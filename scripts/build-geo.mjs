// Pre-computes the static map geometry used by the site (world land outline,
// academic-journey arc, port positions) so no mapping library ships to the browser.
// Run with: npm run generate:maps
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { geoNaturalEarth1, geoPath, geoMercator } from "d3-geo";
import { feature } from "topojson-client";
import { presimplify, simplify, quantile, sphericalTriangleArea } from "topojson-simplify";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const land110 = JSON.parse(readFileSync(join(root, "node_modules/world-atlas/land-110m.json"), "utf8"));
const countries110 = JSON.parse(readFileSync(join(root, "node_modules/world-atlas/countries-110m.json"), "utf8"));
const land50 = JSON.parse(readFileSync(join(root, "node_modules/world-atlas/land-50m.json"), "utf8"));
const countries50 = JSON.parse(readFileSync(join(root, "node_modules/world-atlas/countries-50m.json"), "utf8"));

const round = (n) => Math.round(n * 10) / 10;
const clone = (o) => JSON.parse(JSON.stringify(o));
const simplified = (topology, keep) => {
  const pre = presimplify(clone(topology), sphericalTriangleArea);
  return simplify(pre, quantile(pre, 1 - keep));
};
const landWorldTopo = simplified(land110, 0.55);
const landMiniTopo = simplified(land110, 0.22);

// ---------- 1. World map (control-tower views): Natural Earth, Antarctica removed
const landWorld = feature(landWorldTopo, landWorldTopo.objects.land);
const withoutAntarctica = {
  type: "FeatureCollection",
  features: landWorld.features.map((f) => ({
    ...f,
    geometry: {
      type: "MultiPolygon",
      coordinates: (f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates]).filter(
        (poly) => Math.max(...poly[0].map((p) => p[1])) > -58,
      ),
    },
  })),
};
const W = 1000;
const H = 470;
// The control-room map covers the region Shiva actually flies in (India and its neighbours),
// so the cities in the demonstration data are legible instead of a cluster of dots.
const regionPolygon = (west, south, east, north) => ({
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [west, south],
        [west, north],
        [east, north],
        [east, south],
        [west, south],
      ],
    ],
  },
});
const flyingRegion = regionPolygon(66, 5, 99, 37);
const world = geoNaturalEarth1().fitExtent(
  [
    [8, 8],
    [W - 8, H - 8],
  ],
  flyingRegion,
);
world.clipExtent([
  [0, 0],
  [W, H],
]);
const worldPath = geoPath(world).digits(1)(withoutAntarctica);

// Bases, cities and landmarks used by the demonstration flight data
// (coordinates are public geography).
const ports = {
  gorakhpur: [83.3732, 26.7606],
  varanasi: [82.9739, 25.3176],
  lucknow: [80.9462, 26.8467],
  kanpur: [80.3319, 26.4499],
  prayagraj: [81.8463, 25.4358],
  ayodhya: [82.1998, 26.7922],
  kushinagar: [83.9101, 26.7411],
  gorakhpurAirstrip: [83.4495, 26.7397],
  lumbini: [83.2756, 27.4833],
  patna: [85.1376, 25.5941],
  delhi: [77.209, 28.6139],
  agra: [78.0081, 27.1767],
  dehradun: [78.0322, 30.3165],
  nainital: [79.4542, 29.3919],
  ranchi: [85.3096, 23.3441],
  kathmandu: [85.324, 27.7172],
};
const portXY = Object.fromEntries(Object.entries(ports).map(([k, ll]) => [k, world(ll).map(round)]));

// ---------- 2. Training journey (Gorakhpur -> training city), higher-detail 50m land
const gorakhpur = [83.3732, 26.7606];
const training = [77.209, 28.6139]; // TODO: the city Shiva actually trained in
const JW = 1000;
const JH = 560;
const journeyRegion = regionPolygon(66, 5, 99, 37);
const journey = geoMercator().fitExtent(
  [
    [0, 0],
    [JW, JH],
  ],
  journeyRegion,
);
journey.clipExtent([[-2, -2], [JW + 2, JH + 2]]);
const landJ = feature(land110, land110.objects.land);
const journeyLand = geoPath(journey).digits(0)(landJ);
const c50 = feature(countries50, countries50.objects.countries);
const india = c50.features.find((f) => f.id === "356");
const nepal = c50.features.find((f) => f.id === "524");
const journeyIndia = geoPath(journey).digits(0)(india);
const journeyNepal = geoPath(journey).digits(0)(nepal);
// great-circle arc between the two pins
const arc = geoPath(journey).digits(1)({ type: "LineString", coordinates: [gorakhpur, training] });
const homeXY = journey(gorakhpur).map(round);
const trainingXY = journey(training).map(round);

// The visible window is fitted to the two pins, so the mapper never has to hand-tune it.
const pad = 150;
const winX = Math.max(0, Math.round(Math.min(homeXY[0], trainingXY[0]) - pad));
const winY = Math.max(0, Math.round(Math.min(homeXY[1], trainingXY[1]) - pad * 0.85));
const winW = Math.round(Math.abs(homeXY[0] - trainingXY[0]) + pad * 2);
const winH = Math.round(winW * 0.58);
const JOURNEY_WINDOW = { x: winX, y: winY, w: winW, h: winH };

// ---------- 3. Small world silhouette for thumbnails (110m, lower precision)
const sw = 320;
const sh = 160;
const small = geoNaturalEarth1().fitExtent(
  [
    [3, 3],
    [sw - 3, sh - 3],
  ],
  flyingRegion,
);
small.clipExtent([
  [0, 0],
  [sw, sh],
]);
const miniLand = feature(landMiniTopo, landMiniTopo.objects.land);
const smallBig = {
  type: "FeatureCollection",
  features: miniLand.features.map((f) => ({
    ...f,
    geometry: {
      type: "MultiPolygon",
      coordinates: (f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates]).filter((poly) => {
        if (Math.max(...poly[0].map((p) => p[1])) <= -58) return false;
        const pts = poly[0].map((p) => small(p)).filter(Boolean);
        const xs = pts.map((p) => p[0]);
        const ys = pts.map((p) => p[1]);
        return Math.max(...xs) - Math.min(...xs) > 6 || Math.max(...ys) - Math.min(...ys) > 6;
      }),
    },
  })),
};
const smallPath = geoPath(small).digits(0)(smallBig);
const smallPorts = Object.fromEntries(Object.entries(ports).map(([k, ll]) => [k, small(ll).map(Math.round)]));

// unused import guard (countries110 kept for future country-level views)
void countries110;
void journeyNepal;

const header = `// AUTO-GENERATED by scripts/build-geo.mjs. Do not edit by hand.
// Source geometry: Natural Earth via the world-atlas package (public domain).
`;
const files = {
  "src/content/geo/world.generated.ts": `${header}
export const WORLD_VIEWBOX = { width: ${W}, height: ${H} } as const;
/** Land outline lives in /public/images/geo/world-land.svg (loaded lazily as an image). */
export const WORLD_LAND_SRC = "/images/geo/world-land.svg";
export const WORLD_PORTS = ${JSON.stringify(portXY)} as const;
export type HubId = keyof typeof WORLD_PORTS;
`,
  "src/content/geo/mini-world.generated.ts": `${header}
export const MINI_WORLD_VIEWBOX = { width: ${sw}, height: ${sh} } as const;
export const MINI_WORLD_SRC = "/images/geo/mini-world.svg";
export const MINI_WORLD_PORTS = ${JSON.stringify(smallPorts)} as const;
`,
  "src/content/geo/journey.generated.ts": `${header}
export const JOURNEY_VIEWBOX = { width: ${JW}, height: ${JH} } as const;
/** Land, France and India outlines, cropped to the map window, as a static image. */
export const JOURNEY_BASE_SRC = "/images/geo/journey-base.svg";
export const JOURNEY_WINDOW = ${JSON.stringify(JOURNEY_WINDOW)} as const;
export const JOURNEY_ARC_PATH = ${JSON.stringify(arc)};
export const JOURNEY_POINTS = { home: ${JSON.stringify(homeXY)}, training: ${JSON.stringify(trainingXY)} } as const;
`,
};

// ---------- static geometry images (cached by the browser, never in the JS bundle)
mkdirSync(join(root, "public/images/geo"), { recursive: true });
writeFileSync(
  join(root, "public/images/geo/world-land.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><path d="${worldPath}" fill="#1a3160" stroke="#26437a" stroke-width="0.6"/></svg>`,
);
writeFileSync(
  join(root, "public/images/geo/mini-world.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sw} ${sh}" width="${sw}" height="${sh}"><path d="${smallPath}" fill="#dbe6f5"/></svg>`,
);
writeFileSync(
  join(root, "public/images/geo/journey-base.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${JOURNEY_WINDOW.x} ${JOURNEY_WINDOW.y} ${JOURNEY_WINDOW.w} ${JOURNEY_WINDOW.h}" width="${JOURNEY_WINDOW.w}" height="${JOURNEY_WINDOW.h}"><path d="${journeyLand}" fill="#e4ecf6" stroke="#ffffff" stroke-width="1.2"/><path d="${journeyIndia}" fill="#145fe5" fill-opacity="0.22" stroke="#145fe5" stroke-opacity="0.35" stroke-width="0.8"/><path d="${journeyIndia}" fill="#145fe5" fill-opacity="0.22" stroke="#145fe5" stroke-opacity="0.35" stroke-width="0.8"/></svg>`,
);

mkdirSync(join(root, "src/content/geo"), { recursive: true });
for (const [rel, text] of Object.entries(files)) {
  writeFileSync(join(root, rel), text);
  console.log(rel, (text.length / 1024).toFixed(1) + " KB");
}
