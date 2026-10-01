"use client";

import { getLenis } from "@/components/motion/SmoothScroll";
import { prefersReducedMotion } from "@/lib/utils";

/** Moves keyboard focus to a section's heading without scrolling. */
export function focusSection(id: string) {
  const target = document.getElementById(id.replace(/^#/, ""));
  if (!target) return;
  const heading = target.querySelector<HTMLElement>("[data-section-heading]") ?? target;
  if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

/**
 * Scrolls to an in-page section (smoothly unless instant or reduced motion) and moves
 * focus to its heading, so keyboard and screen-reader users land in the same place.
 */
export function goToSection(hash: string, opts: { focus?: boolean; instant?: boolean } = {}) {
  const id = hash.replace(/^#/, "");
  const target = document.getElementById(id);
  if (!target) return;
  const instant = Boolean(opts.instant) || prefersReducedMotion();
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { offset: -pad, immediate: instant, force: true });
  else target.scrollIntoView({ behavior: instant ? "instant" : "smooth", block: "start" });
  if (window.location.hash !== `#${id}`) window.history.replaceState(window.history.state, "", `#${id}`);
  if (opts.focus !== false) focusSection(id);
}

type Router = { push: (href: string, options?: { scroll?: boolean }) => void };

let pendingResolve: (() => void) | null = null;
const positions = new Map<string, number>();
let popNavigation = false;

/** Remember where the visitor was on the page they are leaving (restored on Back). */
export function rememberScroll() {
  positions.set(window.location.pathname, window.scrollY);
}

export function markPopNavigation() {
  popNavigation = true;
}

/** Position to restore for this path after Back/Forward, or null for a fresh visit. */
export function takeRestorePosition(pathname: string): number | null {
  if (!popNavigation) return null;
  popNavigation = false;
  return positions.get(pathname) ?? 0;
}

/** Called by RouteEffects once the new route has rendered. */
export function resolvePendingNavigation() {
  if (pendingResolve) {
    const r = pendingResolve;
    pendingResolve = null;
    r();
  }
}

export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: "instant" });
}

/**
 * Client-side navigation with a smooth cross-fade between pages.
 * Uses the View Transitions API where available (Chrome, Edge, Safari 18+); elsewhere
 * the new page simply fades in. In-page anchors scroll smoothly instead.
 */
export function navigateTo(router: Router, href: string, { transition = true }: { transition?: boolean } = {}) {
  const url = new URL(href, window.location.href);
  if (url.pathname === window.location.pathname) {
    if (url.hash) goToSection(url.hash);
    else {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "instant" : "smooth" });
    }
    return;
  }

  const target = url.pathname + url.search + url.hash;
  rememberScroll();
  const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
  if (!transition || !doc.startViewTransition || prefersReducedMotion()) {
    router.push(target, { scroll: false });
    return;
  }

  doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        pendingResolve = resolve;
        router.push(target, { scroll: false });
        // never hold the transition hostage to a slow network
        window.setTimeout(() => {
          if (pendingResolve === resolve) resolvePendingNavigation();
        }, 1400);
      }),
  );
}
