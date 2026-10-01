/* Service worker: lets the portfolio open instantly and work with no network.
 *
 *  - Pages: network first (3 s cap on slow links), fall back to the saved copy, then /offline.html.
 *  - /_next/static (hashed, immutable): cache first.
 *  - Images, fonts, PDF: show the saved copy at once, refresh it quietly in the background.
 *  - After the first visit the page asks the worker to "warm" the cache: it saves every page, its
 *    scripts and the image sizes this screen actually uses, so the whole site works offline.
 * Anything cross-origin (Instagram, YouTube ...), non-GET, or /api/* goes straight to the network. */

const V = "v1";
const PAGES = `pages-${V}`;
const STATIC = `static-${V}`;
const MEDIA = `media-${V}`;
const KEEP = [PAGES, STATIC, MEDIA];
const SEED = ["/", "/about", "/experience", "/projects", "/skills", "/education", "/contact", "/resume"];
const NETWORK_TIMEOUT = 3000;
const MAX_PAGES = 40;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES);
      // the shell is small; never let one failed request block installation
      await Promise.allSettled(["/offline.html", "/"].map((u) => pages.add(new Request(u, { cache: "reload" }))));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => !KEEP.includes(n)).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

const isMedia = (url) =>
  url.pathname.startsWith("/_next/image") ||
  url.pathname.startsWith("/images/") ||
  url.pathname.startsWith("/icons/") ||
  url.pathname.startsWith("/resume/") ||
  /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?|pdf)$/i.test(url.pathname);

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname === "/sw.js") return;
  // Range requests (media seeking) can't be answered from a plain cache entry
  if (req.headers.has("range")) return;

  if (req.mode === "navigate") {
    event.respondWith(navigation(req, event));
    return;
  }
  // client-side navigation payloads: let the app handle failures (it falls back to a normal page load)
  if (req.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(req, STATIC));
  } else if (isMedia(url)) {
    event.respondWith(staleWhileRevalidate(req, MEDIA, event));
  }
});

async function navigation(req, event) {
  const cache = await caches.open(PAGES);
  const network = fetch(req).then((res) => {
    if (res.ok && !res.redirected) {
      const copy = res.clone();
      try {
        event.waitUntil(cache.put(req, copy));
      } catch {
        cache.put(req, copy); // the event already finished (a late answer): save it anyway
      }
    }
    return res;
  });
  try {
    return await Promise.race([
      network,
      new Promise((_, reject) => setTimeout(() => reject(new Error("slow")), NETWORK_TIMEOUT)),
    ]);
  } catch {
    const saved = (await cache.match(req, { ignoreSearch: true })) || (await caches.match(req, { ignoreSearch: true }));
    if (saved) {
      network.catch(() => {}); // a late answer still refreshes the saved copy
      return saved;
    }
    // slow but not saved: keep waiting for the network, unless it is truly offline
    try {
      return await network;
    } catch {
      return (await cache.match("/offline.html")) || Response.error();
    }
  }
}

async function cacheFirst(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, name, event) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  const refresh = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => undefined);
  if (hit) {
    event.waitUntil(refresh);
    return hit;
  }
  const fresh = await refresh;
  if (fresh) return fresh;
  // offline and this exact size was never saved: any saved size of the same picture beats a blank
  const src = new URL(req.url).searchParams.get("url");
  if (src && new URL(req.url).pathname === "/_next/image") {
    for (const key of await cache.keys()) {
      const k = new URL(key.url);
      if (k.pathname === "/_next/image" && k.searchParams.get("url") === src) return cache.match(key);
    }
  }
  return Response.error();
}

/* ---------- warming: save the whole site for offline use ---------- */

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "WARM") event.waitUntil(warm(data));
});

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

async function warm({ width = 828 }) {
  const pages = await caches.open(PAGES);
  const statics = await caches.open(STATIC);
  const media = await caches.open(MEDIA);
  const queue = [...SEED];
  const seen = new Set();
  const assets = new Set();
  const images = new Set();

  while (queue.length && seen.size < MAX_PAGES) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    let html;
    try {
      const res = await fetch(path);
      if (!res.ok || res.redirected) continue;
      await pages.put(path, res.clone());
      html = await res.text();
    } catch {
      continue;
    }

    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const p = decode(m[1]);
      if (p.startsWith("/_next/") || p.startsWith("/api/") || /\.[a-z0-9]+$/i.test(p)) continue;
      queue.push(p.length > 1 ? p.replace(/\/$/, "") : p);
    }
    // scripts, styles and fonts, from tags and from the streamed component payload
    for (const m of html.matchAll(/(?:\/_next\/)?static\/(?:chunks|css|media)\/[A-Za-z0-9_\-./~%[\]]+\.(?:js|css|woff2)/g)) {
      assets.add(m[0].startsWith("/") ? m[0] : `/_next/${m[0]}`);
    }
    // one image candidate per <img>: the smallest size that is sharp on this screen
    for (const m of html.matchAll(/srcSet="([^"]+)"/gi)) {
      const cands = decode(m[1])
        .split(/,\s+(?=\/)/)
        .map((c) => c.trim().split(/\s+/))
        .map(([u, w]) => ({ u, w: parseInt(w, 10) || 0 }))
        .filter((c) => c.u)
        .sort((a, b) => a.w - b.w);
      const pick = cands.find((c) => c.w >= width) || cands[cands.length - 1];
      if (pick) images.add(pick.u);
    }
    for (const m of html.matchAll(/\ssrc="(\/(?:images|icons)\/[^"]+)"/g)) images.add(decode(m[1]));
  }

  const save = async (cache, list, pool = 4) => {
    const todo = [...list];
    await Promise.all(
      Array.from({ length: pool }, async () => {
        while (todo.length) {
          const u = todo.shift();
          try {
            if (await cache.match(u)) continue;
            const res = await fetch(u);
            if (res.ok) await cache.put(u, res);
          } catch {
            /* offline again, or one bad link: keep going */
          }
        }
      }),
    );
  };
  await save(statics, assets);
  await save(media, images);
  await save(media, ["/resume/Siva-Drone-Photographer-CV.pdf"], 1);
}
