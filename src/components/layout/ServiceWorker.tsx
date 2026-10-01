"use client";

import { useEffect } from "react";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

const WARM_KEY = "sw-warmed";
const WARM_EVERY = 24 * 60 * 60 * 1000;

/**
 * Registers /sw.js (production only) so the site opens instantly and works with no network.
 * Once the page has settled and the browser is idle, asks the worker to save the rest of the
 * site for offline use - skipped on Data Saver and 2G connections, and at most once a day.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // a stale worker would hide changes while developing
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
      return;
    }

    let cancelled = false;
    const start = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        const reg = await navigator.serviceWorker.ready;
        if (cancelled) return;

        const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
        if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;
        try {
          const last = Number(localStorage.getItem(WARM_KEY) ?? 0);
          if (Date.now() - last < WARM_EVERY) return;
          localStorage.setItem(WARM_KEY, String(Date.now()));
        } catch {
          /* storage blocked: warm anyway */
        }
        const width = Math.round(Math.max(window.screen.width, 320) * Math.min(window.devicePixelRatio || 1, 3));
        reg.active?.postMessage({ type: "WARM", width });
      } catch {
        /* no service worker (private mode, old browser): the site simply needs a connection */
      }
    };

    const idle = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(start, { timeout: 8000 });
      else setTimeout(start, 4000);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", idle);
    };
  }, []);

  return null;
}
