// Renders the PWA / home-screen icons in /public/icons from src/app/icon.svg.
// Run: node scripts/build-icons.mjs   (uses `sharp`, which Next.js already installs)
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "src/app/icon.svg"));
const out = (name) => join(root, "public/icons", name);

// "any" icons: the rounded logo tile as drawn
for (const size of [192, 512]) {
  await sharp(svg, { density: 600 }).resize(size, size).png({ compressionLevel: 9 }).toFile(out(`icon-${size}.png`));
}

// "maskable" icon: full-bleed brand colour with the logo inside the 80% safe zone,
// so Android's circle / squircle masks never crop the mark
const inner = await sharp(svg, { density: 600 }).resize(Math.round(512 * 0.8)).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#0b3d91" } })
  .composite([{ input: inner, gravity: "centre" }])
  .png({ compressionLevel: 9 })
  .toFile(out("maskable-512.png"));
