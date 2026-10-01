"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { goToSection, markPopNavigation, resolvePendingNavigation, scrollToTop, takeRestorePosition } from "@/lib/navigation";
import { getLenis } from "@/components/motion/SmoothScroll";

/**
 * Runs after every route change: completes the view transition, sets the scroll
 * position (top of the new page, or its #anchor) and moves keyboard focus to the
 * new page's main heading so screen-reader and keyboard users land in the content.
 */
export function RouteEffects() {
  const pathname = usePathname();
  // the last path handled; a repeat run for the same path (React Strict Mode re-runs effects in
  // development) is not a navigation
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const onPop = () => markPopNavigation();
    window.addEventListener("popstate", onPop);
    document.documentElement.classList.toggle(
      "vt",
      typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === "function",
    );
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (handled.current === pathname) return;
    const firstLoad = handled.current === null;
    handled.current = pathname;
    if (firstLoad) {
      if (window.location.hash) requestAnimationFrame(() => goToSection(window.location.hash, { instant: true, focus: false }));
      return;
    }
    document.documentElement.classList.add("navigated");
    const restore = takeRestorePosition(pathname);
    if (restore !== null) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(restore, { immediate: true, force: true });
      else window.scrollTo({ top: restore, behavior: "instant" });
    } else if (window.location.hash) {
      goToSection(window.location.hash, { instant: true, focus: false });
    } else {
      scrollToTop();
    }
    resolvePendingNavigation();
    const heading = document.querySelector<HTMLElement>("main h1");
    if (heading) {
      if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
}
