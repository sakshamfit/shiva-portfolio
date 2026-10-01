// Builds the one-page profile PDF shipped in /public/resume, with no external tooling.
// Simple base-14 text: edit the LINES below and run `node scripts/build-resume.mjs`.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/resume");
const outFile = "Siva-Drone-Photographer-CV.pdf";

const PAGE = { w: 595.28, h: 841.89 }; // A4
const MARGIN = 48;
const LEAD = 13.2;

/** [text, style] where style: h1 | h2 | body | meta */
const LINES = [
  ["SIVA", "h1"],
  ["Drone Photographer & Aerial Cinematographer — Gorakhpur, Uttar Pradesh", "meta"],
  ["Email hello@sivaaerial.in  ·  Phone to be added  ·  Instagram / Facebook / YouTube to be linked", "meta"],
  ["", "gap"],
  ["PROFILE", "h2"],
  ["Drone photographer and camera specialist working across eastern Uttar Pradesh and Bihar. Aerial", "body"],
  ["films, stills, mapping and site documentation, shot on a written shot list and delivered as a", "body"],
  ["finished set: graded stills within 48 hours, edited films within the week, usage rights in writing.", "body"],
  ["", "gap"],
  ["EXPERIENCE", "h2"],
  ["Independent practice — Drone Photographer & Aerial Cinematographer, Gorakhpur   2021 – Present", "body"],
  ["· 60+ projects: hotel and resort films, real-estate launches, construction progress, farmland", "body"],
  ["  surveys and wedding features across 12+ districts.", "body"],
  ["· 500+ flights logged behind a written pre-flight routine; airspace, weather and battery checks", "body"],
  ["  on every mission, with a perfect safety record.", "body"],
  ["· Built the post pipeline: on-site dual backups, Lightroom culling, Resolve grading, Premiere", "body"],
  ["  timelines, delivery in 16:9 and 9:16.", "body"],
  ["Camera house & studio — Camera Specialist (Sales, Service & Studio), Gorakhpur   2018 – 2021", "body"],
  ["· Advised 1,000+ customers on bodies, lenses and accessories; serviced DSLR and mirrorless", "body"],
  ["  systems, including sensor cleaning and lens calibration.", "body"],
  ["· Assisted on studio and event shoots: lighting, gimbal work, tethered capture and data wrangling.", "body"],
  ["", "gap"],
  ["SELECTED WORK", "h2"],
  ["Aerial films for hotels, builders and brands — one visit covering air and ground, one grade.", "body"],
  ["Aerial mapping & site inspection — repeatable grids, orthomosaics and month-on-month overlays.", "body"],
  ["Camera & drone kit management — every item logged by serial with service and alert rules.", "body"],
  ["Progress documentation for builders — fixed viewpoints, documented monthly through the build.", "body"],
  ["", "gap"],
  ["SKILLS", "h2"],
  ["Flying: DJI Mavic / Air / Mini class, manual and automated modes, waypoint and grid missions,", "body"],
  ["airspace and DGCA compliance, night flying, emergency procedures.", "body"],
  ["Cameras: full-frame mirrorless and DSLR systems, lens choice, ND filters, manual exposure,", "body"],
  ["studio and location lighting, gimbals and sliders, sensor care and lens calibration.", "body"],
  ["Post: Lightroom Classic, Premiere Pro, DaVinci Resolve, colour matching, vertical cutdowns,", "body"],
  ["delivery formats, dual backup and archiving.", "body"],
  ["", "gap"],
  ["TRAINING & CERTIFICATES", "h2"],
  ["Remote Pilot Certificate (RPC) training — DGCA rules, flight planning, meteorology, systems and", "body"],
  ["emergency procedures. Add the training partner and certificate number.", "body"],
  ["Drone mapping & photogrammetry  ·  Colour grading in DaVinci Resolve  ·  Camera service basics", "body"],
  ["", "gap"],
  ["LANGUAGES", "h2"],
  ["Hindi (native)  ·  English (professional)  ·  Bhojpuri (conversational)", "body"],
];

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

let y = PAGE.h - MARGIN;
const parts = [];
for (const [text, style] of LINES) {
  if (style === "gap") {
    y -= LEAD * 0.6;
    continue;
  }
  if (style === "h1") {
    y -= 8;
    parts.push(`BT /F2 22 Tf 1 0 0 1 ${MARGIN} ${y.toFixed(1)} Tm (${esc(text)}) Tj ET`);
    y -= LEAD + 4;
    continue;
  }
  if (style === "h2") {
    y -= 6;
    parts.push(`BT /F2 10.5 Tf 1 0 0 1 ${MARGIN} ${y.toFixed(1)} Tm 0.043 0.239 0.569 rg (${esc(text)}) Tj ET`);
    parts.push(`0.043 0.239 0.569 RG 1 w ${MARGIN} ${(y - 4).toFixed(1)} m ${PAGE.w - MARGIN} ${(y - 4).toFixed(1)} l S`);
    y -= LEAD + 2;
    parts.push("0 0 0 rg");
    continue;
  }
  const size = style === "meta" ? 9.5 : 9.6;
  parts.push(`BT /F1 ${size} Tf 1 0 0 1 ${MARGIN} ${y.toFixed(1)} Tm (${esc(text)}) Tj ET`);
  y -= LEAD;
}

parts.push(`0.6 0.65 0.72 RG 0.8 w ${MARGIN} 40 m ${PAGE.w - MARGIN} 40 l S`);
parts.push(`BT /F1 8 Tf 1 0 0 1 ${MARGIN} 30 Tm 0.4 0.45 0.52 rg (Siva — drone photographer, Gorakhpur, Uttar Pradesh. Portfolio PDF, updated October 2026.) Tj ET`);

const content = parts.join("\n");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.w} ${PAGE.h}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`,
];

let pdf = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((body, i) => {
  offsets.push(Buffer.byteLength(pdf, "latin1"));
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});
const xrefPos = Buffer.byteLength(pdf, "latin1");
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i++) {
  pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, outFile), Buffer.from(pdf, "latin1"));
console.log(`wrote public/resume/${outFile} (${(Buffer.byteLength(pdf, "latin1") / 1024).toFixed(1)} KB)`);
