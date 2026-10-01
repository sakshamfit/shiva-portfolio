// Visual QA (dev only): first-screen and full-page captures for each route.
// Usage: node scripts/qa/pages.mjs --vp desktop --out <dir> [--full true] [--pages /,/about]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const arg = (k, d) => (process.argv.includes(`--${k}`) ? process.argv[process.argv.indexOf(`--${k}`) + 1] : d);
const base = arg("url", "http://localhost:3000").replace(/\/$/, "");
const out = arg("out", "qa-pages");
const full = arg("full", "false") === "true";
const vps = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  tablet: { width: 820, height: 1180, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
};
const vp = vps[arg("vp", "desktop")];
const pages = arg("pages", "/,/about,/experience,/projects,/projects/control-tower,/projects/novexai,/projects/inventory-optimization,/skills,/education,/contact,/resume").split(",");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true, args: ["--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport(vp);
for (const p of pages) {
  const name = (p === "/" ? "home" : p.slice(1).replaceAll("/", "-")) + "-" + arg("vp", "desktop");
  await page.goto(base + p, { waitUntil: "networkidle2", timeout: 120000 });
  await sleep(2600);
  await page.screenshot({ path: join(out, `${name}-first.png`) });
  if (full) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += Math.round(vp.height * 0.6)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(140);
    }
    await sleep(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(400);
    await page.screenshot({ path: join(out, `${name}-full.png`), fullPage: true, captureBeyondViewport: true });
  }
  console.log("captured", p);
}
await browser.close();
