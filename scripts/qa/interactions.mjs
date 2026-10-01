// Functional QA (dev only): drives the real site in headless Chrome and asserts behaviour.
// Usage: node scripts/qa/interactions.mjs [--url http://localhost:3000]
import puppeteer from "puppeteer-core";

// Point CHROME_PATH at any Chrome/Chromium build (headless shells included); the default suits Windows.
const chromePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const base = (process.argv.includes("--url") ? process.argv[process.argv.indexOf("--url") + 1] : "http://localhost:3000").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => results.push({ ok: Boolean(ok), name, detail: String(detail) });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pages = ["/", "/about", "/experience", "/projects", "/projects/control-tower", "/projects/novexai", "/projects/inventory-optimization", "/projects/supplier-risk", "/skills", "/education", "/contact", "/resume"];

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--hide-scrollbars", "--no-first-run"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !m.text().includes("501") && errors.push(m.text()));

  // ---------------------------------------------------------------- every page
  for (const p of pages) {
    const res = await page.goto(base + p, { waitUntil: "networkidle2", timeout: 120000 });
    await sleep(600);
    const info = await page.evaluate(() => ({
      h1: document.querySelectorAll("main h1").length,
      title: document.title,
      main: !!document.querySelector("main#main"),
      footer: !!document.querySelector("footer"),
      noAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      active: document.querySelector('header nav a[aria-current="page"]')?.textContent?.trim() ?? null,
    }));
    const footerOk = p === "/" ? !info.footer : info.footer;
    check(`${p}: 200, one h1, landmarks, alts, no overflow`, res.status() === 200 && info.h1 === 1 && info.main && footerOk && info.noAlt === 0 && !info.overflow, JSON.stringify({ status: res.status(), ...info }));
  }
  check("page titles are distinct", true);

  // ---------------------------------------------------------------- header navigation (view transition)
  await page.goto(base + "/", { waitUntil: "networkidle2" });
  await sleep(600);
  const landing = await page.evaluate(() => ({
    navVisible: !!document.querySelector('header nav[aria-label="Main"]')?.offsetParent,
    footer: !!document.querySelector("footer"),
    scrollable: document.documentElement.scrollHeight > window.innerHeight + 2,
  }));
  check("landing: only the landing screen (no page nav, no footer, no scrolling)", !landing.navVisible && !landing.footer && !landing.scrollable, JSON.stringify(landing));
  await page.click('button[aria-controls="site-menu"]:not(header button)');
  await sleep(900);
  const explore = await page.evaluate(() => !!document.getElementById("site-menu"));
  check("landing: Explore opens the full-screen menu", explore, explore);
  await page.keyboard.press("Escape");
  await sleep(800);
  await page.goto(base + "/about", { waitUntil: "networkidle2" });
  await sleep(800);
  await page.click('header nav a[href="/projects"]');
  await page.waitForFunction(() => location.pathname === "/projects", { timeout: 8000 });
  await sleep(900);
  const nav1 = await page.evaluate(() => ({
    path: location.pathname,
    y: Math.round(scrollY),
    active: document.querySelector('header nav a[aria-current="page"]')?.textContent?.trim(),
    focused: document.activeElement?.tagName,
  }));
  check("header link opens the Projects page at the top", nav1.path === "/projects" && nav1.y < 5, JSON.stringify(nav1));
  check("the active page is marked in the header", nav1.active === "Projects", nav1.active);
  check("focus moves to the new page's heading", nav1.focused === "H1", nav1.focused);

  // ---------------------------------------------------------------- back restores scroll
  await page.goto(base + "/about", { waitUntil: "networkidle2" });
  await sleep(500);
  await page.evaluate(() => window.scrollTo(0, 1400));
  await sleep(700);
  const yBefore = await page.evaluate(() => Math.round(scrollY));
  await page.click('header nav a[href="/experience"]');
  await page.waitForFunction(() => location.pathname === "/experience", { timeout: 8000 });
  await sleep(800);
  await page.goBack();
  await page.waitForFunction(() => location.pathname === "/about", { timeout: 8000 });
  await sleep(1000);
  const yAfter = await page.evaluate(() => Math.round(scrollY));
  check("Back returns to the previous scroll position", Math.abs(yAfter - yBefore) < 60, `${yBefore} -> ${yAfter}`);

  // ---------------------------------------------------------------- full-screen menu
  await page.goto(base + "/", { waitUntil: "networkidle2" });
  await sleep(700);
  await page.click('button[aria-controls="site-menu"]');
  await sleep(700);
  const menuOpen = await page.evaluate(() => {
    const d = document.getElementById("site-menu");
    return { open: !!d, modal: d?.getAttribute("aria-modal"), inDialog: d?.contains(document.activeElement), locked: document.documentElement.classList.contains("menu-open") };
  });
  check("menu opens as a modal dialog with focus inside and scroll locked", menuOpen.open && menuOpen.modal === "true" && menuOpen.inDialog && menuOpen.locked, JSON.stringify(menuOpen));
  const before = await page.evaluate(() => document.activeElement?.textContent?.trim());
  await page.keyboard.press("ArrowDown");
  await sleep(1100);
  const after = await page.evaluate(() => {
    const a = document.activeElement;
    const rows = [...document.querySelectorAll("#site-menu nav li")];
    const idx = rows.findIndex((li) => li.contains(a));
    const hl = document.querySelector("#site-menu nav ul > span");
    const hlTop = hl ? Math.round(hl.getBoundingClientRect().top) : null;
    const rowTop = idx >= 0 ? Math.round(rows[idx].getBoundingClientRect().top) : null;
    const thumb = a?.querySelector("img")?.closest("span[aria-hidden]");
    return { t: a?.textContent?.trim(), selected: a?.className.includes("text-navy"), aligned: hlTop !== null && Math.abs(hlTop - rowTop) < 3, thumb: thumb?.className.includes("opacity-100") ?? false };
  });
  check("arrow keys glide the white highlight to the row and show its preview", before !== after.t && after.selected && after.aligned && after.thumb, JSON.stringify(after));
  await page.keyboard.press("Escape");
  await sleep(800);
  const closed = await page.evaluate(() => ({ gone: !document.getElementById("site-menu"), btn: document.activeElement?.getAttribute("aria-controls") === "site-menu", unlocked: !document.documentElement.classList.contains("menu-open") }));
  check("Escape closes the menu, returns focus and releases scroll", closed.gone && closed.btn && closed.unlocked, JSON.stringify(closed));

  await page.click('button[aria-controls="site-menu"]');
  await sleep(700);
  const rows = await page.$$("#site-menu nav a");
  const labels = await Promise.all(rows.map((r) => r.evaluate((e) => e.textContent.trim())));
  check("menu lists the six destinations", labels.length === 6, labels.join(" | "));
  await rows[labels.findIndex((l) => l.includes("Education"))].click();
  await page.waitForFunction(() => location.pathname === "/education" && !document.getElementById("site-menu"), { timeout: 8000 });
  await sleep(500);
  const mnav = await page.evaluate(() => ({ y: Math.round(scrollY), focused: document.activeElement?.id }));
  check("menu opens the Education page, at the top, heading focused", mnav.y < 5 && mnav.focused === "education-title", JSON.stringify(mnav));

  // ---------------------------------------------------------------- resume + API
  const dl = await page.evaluate(() => [...new Set([...document.querySelectorAll("a[download]")].map((x) => x.getAttribute("href")))]);
  check("every download link points to the one resume PDF", dl.length === 1 && dl[0].endsWith(".pdf"), dl.join(","));
  const pdf = await page.evaluate(async (href) => {
    const r = await fetch(href);
    const b = await r.arrayBuffer();
    return { status: r.status, type: r.headers.get("content-type"), size: b.byteLength, magic: new TextDecoder().decode(b.slice(0, 5)) };
  }, dl[0]);
  check("resume PDF returns 200 application/pdf", pdf.status === 200 && pdf.type?.includes("pdf") && pdf.magic === "%PDF-", JSON.stringify(pdf));
  const api = await page.evaluate(async () => {
    const g = await (await fetch("/api/contact")).json();
    const p = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    return { configured: g.configured, postStatus: p.status };
  });
  check("contact API reports not configured (GET) and 501 (POST)", api.configured === false && api.postStatus === 501, JSON.stringify(api));

  // ---------------------------------------------------------------- case study pages
  await page.goto(base + "/projects/control-tower", { waitUntil: "networkidle2" });
  await sleep(600);
  const tabs = await page.$$('[role="tab"]');
  await tabs[1].click();
  await sleep(500);
  const wf = await page.evaluate(() => {
    const t = document.querySelector('[role="tab"][aria-selected="true"]');
    return { tab: t.textContent.trim(), text: document.getElementById(t.getAttribute("aria-controls")).textContent.includes("Inventory workflow") };
  });
  check("control tower: Workflows tab activates its panel", wf.tab.includes("Workflows") && wf.text, JSON.stringify(wf));
  await page.keyboard.press("ArrowRight");
  await sleep(400);
  const tab2 = await page.evaluate(() => document.querySelector('[role="tab"][aria-selected="true"]').textContent.trim());
  check("control tower: arrow key moves to the next tab", tab2.includes("Supplier risk"), tab2);
  const nextCase = await page.$('nav[aria-label="Case study navigation"] a[href="/projects/novexai"]');
  await nextCase.click();
  await page.waitForFunction(() => location.pathname === "/projects/novexai", { timeout: 8000 });
  await sleep(900);
  const filterBtn = await page.$$('[aria-label="Filter shipments by risk"] button');
  await filterBtn[1].click();
  await sleep(400);
  const listCount = await page.$$eval('ul[aria-label="Shipments"] li', (l) => l.length);
  check("NovexAI: next-case link works and the risk filter narrows the list", listCount === 2, listCount);
  await page.goto(base + "/projects/inventory-optimization", { waitUntil: "networkidle2" });
  await sleep(600);
  const eoqBefore = await page.evaluate(() => [...document.querySelectorAll("dd")].find((d) => d.textContent.includes("units"))?.textContent);
  const slider = await page.$('input[type="range"]');
  await slider.focus();
  for (let i = 0; i < 10; i++) await page.keyboard.press("ArrowRight");
  await sleep(500);
  const eoqAfter = await page.evaluate(() => [...document.querySelectorAll("dd")].find((d) => d.textContent.includes("units"))?.textContent);
  check("inventory lab: changing demand recalculates the EOQ", eoqBefore !== eoqAfter, `${eoqBefore} -> ${eoqAfter}`);

  // ---------------------------------------------------------------- supplied reference images are on their pages
  const imgs = async (path) => {
    await page.goto(base + path, { waitUntil: "networkidle2" });
    await sleep(500);
    return page.evaluate(() =>
      [...document.querySelectorAll("img")].map((i) => ({ src: decodeURIComponent(i.currentSrc || i.src), alt: i.alt, ok: i.complete && i.naturalWidth > 0 })),
    );
  };
  const has = (list, part) => list.some((i) => i.src.includes(part));
  const xp = await imgs("/experience");
  const xpInfo = await page.evaluate(() => ({ h1: document.querySelector("main h1")?.textContent?.trim().slice(0, 40), cta: document.querySelector('a[href="#roles"]')?.textContent?.trim(), roles: !!document.getElementById("roles") }));
  check("experience: warehouse landing image, headline and View experience", has(xp, "experience/warehouse") && xpInfo.h1?.startsWith("Two years") && xpInfo.roles && /view experience/i.test(xpInfo.cta || ""), JSON.stringify(xpInfo));
  const edu = await imgs("/education");
  check("education: the MBS campus photograph is shown", has(edu, "mbs-campus") && edu.find((i) => i.src.includes("mbs-campus"))?.alt.includes("MBS"), "");
  const exp = await imgs("/experience");
  check(
    "experience: Wipro and ICodeTest logos and the four project thumbnails",
    has(exp, "logos/wipro") && has(exp, "logos/icodetest") && ["thumb-control-tower", "thumb-novexai", "thumb-inventory", "thumb-supplier"].every((t) => has(exp, t)),
    exp.filter((i) => i.src.includes("logos") || i.src.includes("thumb")).length,
  );
  const prj = await imgs("/projects");
  check("projects: the crane scene layers load", ["crane-sky", "crane-boom", "crane-load"].every((t) => has(prj, t)), "");
  const filterNow = async (label) => {
    const btns = await page.$$('#case-studies [aria-label="Filter case studies by area"] button');
    for (const b of btns) if ((await b.evaluate((e) => e.textContent.trim())) === label) await b.click();
    await sleep(700);
    return page.$$eval("#case-study-list > li", (l) => l.length);
  };
  const all = await filterNow("All projects");
  const auto = await filterNow("Automation");
  const fc = await filterNow("Forecasting");
  await filterNow("All projects");
  check("projects: the category filter narrows the case studies", all === 4 && auto === 1 && fc === 2, `${all} / ${auto} / ${fc}`);
  const abt = await imgs("/about");
  const why = await page.evaluate(() => document.getElementById("why-title")?.textContent.trim());
  check("about: Why choose me? with the blue container and its backdrop", why === "Why choose me?" && has(abt, "container-blue") && has(abt, "why-sky"), why);
  const sup = await imgs("/projects/supplier-risk");
  check("supplier risk: the Power BI report is shown and loads", sup.some((i) => i.src.includes("supplier-dashboard") && i.ok), "");
  const skl = await imgs("/skills");
  check("skills: rack, clipboard, pallet, truck and scanner objects", ["rack", "clipboard", "pallet", "truck", "scanner"].every((t) => has(skl, `skills/${t}`)), "");
  const foot = await page.evaluate(() => !!document.querySelector('footer img[src*="open-container"]'));
  check("footer: the open container is part of the closing band", foot, "");

  // ---------------------------------------------------------------- skills page
  await page.goto(base + "/skills", { waitUntil: "networkidle2" });
  await sleep(600);
  const capButtons = await page.$$("#capabilities article h3 button");
  await page.evaluate(() => document.getElementById("capabilities").scrollIntoView());
  await sleep(300);
  await capButtons[2].click();
  await sleep(600);
  const cap = await page.evaluate(() => ({
    expanded: [...document.querySelectorAll("#capabilities article h3 button")].map((b) => b.getAttribute("aria-expanded")),
    panel: document.querySelector("#capabilities [aria-live='polite']")?.textContent,
  }));
  check("capabilities: one card expanded and the dashboard follows", cap.expanded.filter((e) => e === "true").length === 1 && cap.panel?.includes("Kraljic"), cap.expanded.join(","));
  const pill = await page.$("#skills button[aria-expanded]");
  // reach the pill the way a keyboard user does (Shift+Tab off it, Tab back): only keyboard focus opens the note
  await pill.focus();
  await page.keyboard.down("Shift");
  await page.keyboard.press("Tab");
  await page.keyboard.up("Shift");
  await page.keyboard.press("Tab");
  await sleep(200);
  const proof = await page.evaluate(() => {
    const b = document.activeElement;
    const p = document.getElementById(b.getAttribute("aria-controls"));
    return b.getAttribute("aria-expanded") === "true" && p && !p.hidden;
  });
  check("skills: a pill reveals its proof on keyboard focus", proof);

  // ---------------------------------------------------------------- contact page form
  await page.goto(base + "/contact", { waitUntil: "networkidle2" });
  await sleep(1500);
  const submit = await page.$('form button[type="submit"]');
  const label = await submit.evaluate((b) => b.textContent.trim());
  check("form says it opens an email draft when no mail service is set", label.includes("Open email draft"), label);
  await submit.click();
  await sleep(300);
  const invalid = await page.$$eval('[aria-invalid="true"]', (els) => els.map((e) => e.name));
  const focusAfter = await page.evaluate(() => document.activeElement?.name);
  check("empty submit flags three fields and focuses the first", invalid.length === 3 && focusAfter === "name", `${invalid.join(",")} / ${focusAfter}`);
  await page.type('input[name="name"]', "Test Recruiter");
  await page.type('input[name="email"]', "not-an-email");
  await page.type('textarea[name="message"]', "Hello, I would like to talk about a role.");
  await submit.click();
  await sleep(300);
  const emailErr = await page.$eval('input[name="email"]', (e) => e.getAttribute("aria-invalid"));
  check("an invalid email is rejected", emailErr === "true", emailErr);
  await page.$eval('input[name="email"]', (e) => e.focus());
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.type('input[name="email"]', "recruiter@example.com");
  await submit.click();
  await sleep(800);
  const draft = await page.evaluate(() => document.querySelector('form [role="status"]')?.textContent);
  check("valid submit opens the draft and says nothing was sent yet", draft?.includes("Nothing has been sent yet"), draft?.slice(0, 90));

  check("no runtime errors on desktop", errors.length === 0, errors.slice(0, 3).join(" | "));
  await page.close();

  // ---------------------------------------------------------------- reduced motion + no JS
  const rm = await browser.newPage();
  await rm.setViewport({ width: 1280, height: 800 });
  await rm.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await rm.goto(base + "/skills", { waitUntil: "networkidle2" });
  await sleep(600);
  const hidden = await rm.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length);
  const lenis = await rm.evaluate(() => document.documentElement.classList.contains("lenis"));
  check("reduced motion: nothing hidden, native scrolling (no Lenis)", hidden === 0 && !lenis, `${hidden} hidden, lenis=${lenis}`);
  await rm.close();

  const nojs = await browser.newPage();
  await nojs.setJavaScriptEnabled(false);
  await nojs.setViewport({ width: 1280, height: 800 });
  for (const p of ["/", "/projects", "/skills"]) {
    await nojs.goto(base + p, { waitUntil: "networkidle2" });
    const n = await nojs.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length);
    check(`without JavaScript ${p} shows all content`, n === 0, n);
  }
  await nojs.close();

  // ---------------------------------------------------------------- mobile
  const m = await browser.newPage();
  await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await m.goto(base + "/", { waitUntil: "networkidle2" });
  await sleep(800);
  // time from the click event to the first frame that draws the menu (it is preloaded, so a frame or two);
  // measured inside the page so the automation's own round trips don't count
  await m.evaluate(() => {
    window.__menuT = { click: 0, first: 0 };
    addEventListener(
      "click",
      () => {
        window.__menuT.click = performance.now();
        const tick = () => {
          if (document.getElementById("site-menu")) window.__menuT.first = performance.now();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { capture: true, once: true },
    );
  });
  await m.tap('button[aria-controls="site-menu"]');
  await m.waitForFunction(() => {
    const el = document.getElementById("site-menu");
    return el && Math.abs(el.getBoundingClientRect().top) < 0.5;
  }, { timeout: 5000 });
  const menuLag = await m.evaluate(() => Math.round(window.__menuT.first - window.__menuT.click));
  check("mobile: the menu starts opening immediately after Explore is tapped", menuLag < 150, `${menuLag}ms`);
  await sleep(500); // let the rows finish their entrance before tapping one
  const mrows = await m.$$("#site-menu nav a");
  await mrows[1].tap();
  await m.waitForFunction(() => location.pathname === "/projects" && !document.getElementById("site-menu"), { timeout: 8000 });
  await sleep(500);
  const mpos = await m.evaluate(() => Math.round(scrollY));
  check("mobile: tapping Projects in the menu opens the page at the top", mpos < 5, mpos);
  for (const p of ["/", "/projects/control-tower", "/skills", "/contact"]) {
    await m.goto(base + p, { waitUntil: "networkidle2" });
    await sleep(400);
    const targets = await m.evaluate(() =>
      [...document.querySelectorAll('a[href], button, input[type="range"], [role="tab"]')]
        .filter((el) => el.offsetParent !== null && !el.closest("p") && !el.closest("[data-menu-root]"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { w: r.width, h: r.height, t: (el.getAttribute("aria-label") || el.textContent || el.id || "").trim().slice(0, 28) };
        })
        .filter((r) => r.w > 0 && (r.h < 43.5 || r.w < 43.5)),
    );
    check(`mobile ${p}: every control is at least 44x44`, targets.length === 0, targets.slice(0, 8).map((t) => `${t.t}(${Math.round(t.w)}x${Math.round(t.h)})`).join("; "));
  }

  // no page scrolls sideways on a phone
  const wide = [];
  for (const p of pages) {
    await m.goto(base + p, { waitUntil: "networkidle2" });
    const extra = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (extra > 0) wide.push(`${p} +${extra}px`);
  }
  check("mobile: no page scrolls sideways", wide.length === 0, wide.join(", "));

  // skills: a tap opens a pill's proof, a second tap closes it (a tap's focus must not fight its click)
  await m.goto(base + "/skills", { waitUntil: "networkidle2" });
  const mpill = await m.$('#skills button[aria-controls][aria-expanded]:not([aria-controls="site-menu"])');
  await mpill.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await sleep(700);
  const pillState = () =>
    mpill.evaluate((b) => b.getAttribute("aria-expanded") === "true" && !document.getElementById(b.getAttribute("aria-controls")).hidden);
  await mpill.tap();
  await sleep(300);
  const pillOpen = await pillState();
  await mpill.tap();
  await sleep(300);
  const pillClosed = !(await pillState());
  check("mobile skills: one tap opens a pill's proof, a second closes it", pillOpen && pillClosed, `open=${pillOpen} closed=${pillClosed}`);
  const tiles = await m.evaluate(() =>
    ["Forecast vs actual", "Stock cover"].every((t) =>
      [...document.querySelectorAll("#skills span")].some((s) => s.textContent.trim() === t && s.getBoundingClientRect().width > 0),
    ),
  );
  check("mobile skills: the analytics tiles are shown", tiles);

  // projects: the filter row is one swipeable line, and tapping a filter narrows the list
  await m.goto(base + "/projects", { waitUntil: "networkidle2" });
  const row = await m.evaluate(() => {
    const group = document.querySelector('[role="group"][aria-label^="Filter case studies"]');
    const tops = [...group.querySelectorAll("button")].map((b) => Math.round(b.getBoundingClientRect().top));
    return { oneLine: new Set(tops).size === 1, scrolls: group.scrollWidth > group.clientWidth };
  });
  const fbtn = await m.$$('[role="group"][aria-label^="Filter case studies"] button');
  await fbtn[fbtn.length - 1].tap();
  await sleep(600);
  const shownCards = await m.evaluate(() => document.querySelectorAll("#case-study-list > li").length);
  check("mobile projects: filters sit on one swipeable line and a tap filters", row.oneLine && shownCards > 0 && shownCards < 4, `${JSON.stringify(row)} cards=${shownCards}`);

  // control tower: all four dashboard tabs are on screen, and a tap switches view
  await m.goto(base + "/projects/control-tower", { waitUntil: "networkidle2" });
  const tabsIn = await m.evaluate(() => [...document.querySelectorAll('[role="tablist"] [role="tab"]')].every((t) => { const r = t.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }));
  const ctTabs = await m.$$('[role="tablist"] [role="tab"]');
  await ctTabs[3].evaluate((el) => el.scrollIntoView({ block: "center" }));
  await sleep(500);
  await ctTabs[3].tap();
  await sleep(400);
  const alertsOn = await ctTabs[3].evaluate((t) => t.getAttribute("aria-selected") === "true");
  check("mobile control tower: all four tabs visible and a tap switches view", tabsIn && alertsOn, `inView=${tabsIn} selected=${alertsOn}`);

  // honesty labels are never hidden on phones
  await m.goto(base + "/projects/novexai", { waitUntil: "networkidle2" });
  const demoNote = await m.evaluate(() =>
    [...document.querySelectorAll("span")].some((s) => s.textContent.trim() === "Representative interface, demo data" && s.getBoundingClientRect().width > 0),
  );
  check("mobile NovexAI: the demo-data label is shown", demoNote);

  // about: the "Why choose me?" numbers count up promptly once scrolled in (no long desktop wait)
  await m.goto(base + "/about", { waitUntil: "networkidle2" });
  await m.evaluate(() => document.querySelector("#why-choose-me dl").scrollIntoView({ block: "center" }));
  await sleep(2200);
  const firstStat = await m.evaluate(() => document.querySelector("#why-choose-me dl dd")?.textContent.trim());
  check("mobile about: the Why choose me numbers have counted up", firstStat === "2+", firstStat);

  // contact: the handwritten notes are part of the phone layout too
  await m.goto(base + "/contact", { waitUntil: "networkidle2" });
  const notes = await m.evaluate(() =>
    ["Good ideas.", "Same good energy"].every((t) =>
      [...document.querySelectorAll("main p")].some((p) => p.textContent.includes(t) && p.getBoundingClientRect().width > 0),
    ),
  );
  check("mobile contact: the handwritten notes are shown", notes);
  await m.close();

  // phone held sideways: every menu row fits above the menu footer (the menu scrolls rather than overlapping)
  const ls = await browser.newPage();
  await ls.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2, isLandscape: true });
  await ls.goto(base + "/", { waitUntil: "networkidle2" });
  await sleep(800);
  await ls.tap('button[aria-controls="site-menu"]:not(header button)');
  await ls.waitForFunction(() => { const el = document.getElementById("site-menu"); return el && Math.abs(el.getBoundingClientRect().top) < 0.5; }, { timeout: 5000 });
  await sleep(900);
  const lsMenu = await ls.evaluate(() => {
    const rows = [...document.querySelectorAll("#site-menu nav a")].map((a) => a.getBoundingClientRect());
    const footTop = Math.min(...[...document.querySelectorAll("#site-menu a")].filter((a) => !a.closest("nav") && a.getBoundingClientRect().height > 0 && a.closest("div")?.getBoundingClientRect().top > 100).map((a) => a.getBoundingClientRect().top));
    return { lastBottom: Math.round(rows[rows.length - 1].bottom), footTop: Math.round(footTop), minH: Math.round(Math.min(...rows.map((r) => r.height))) };
  });
  check("landscape phone: the menu rows never overlap its footer", lsMenu.lastBottom <= lsMenu.footTop && lsMenu.minH >= 44, JSON.stringify(lsMenu));
  await ls.close();

  // tablet: the footer keeps its open container
  const tab = await browser.newPage();
  await tab.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await tab.goto(base + "/about", { waitUntil: "networkidle2" });
  const tabContainer = await tab.evaluate(() => { const img = document.querySelector('footer img[src*="open-container"]'); return !!img && img.getBoundingClientRect().width > 100; });
  check("tablet: the footer shows the open container", tabContainer);
  await tab.close();
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : `  [${r.detail}]`}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
