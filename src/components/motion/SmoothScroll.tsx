"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let instance: Lenis | null = null;

/** The active Lenis instance, or null (reduced motion, touch-only devices, or before mount). */
export const getLenis = () => instance;

/**
 * Inertial smooth scrolling for mouse and trackpad wheels. Touch devices keep native
 * momentum scrolling, and visitors who prefer reduced motion get native scrolling.
 * Lenis drives the real window scroll position, so anchors, keyboard scrolling,
 * find-in-page and scroll-linked animations keep working.
 */
export function SmoothScroll() {
  // iOS Safari only applies :active (the tap press in globals.css) when a touch listener exists
  useEffect(() => {
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    // touch-only devices already have native momentum scrolling
    if (!window.matchMedia("(any-pointer: fine)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      // frame-based smoothing: each frame closes 8% of the remaining distance, for a soft, buttery glide
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      anchors: { offset: -24 },
      prevent: (node) => Boolean(node.closest?.("[data-lenis-prevent], #site-menu")),
    });
    instance = lenis;

    const onChange = () => {
      if (reduce.matches) {
        lenis.destroy();
        instance = null;
      }
    };
    reduce.addEventListener("change", onChange);
    return () => {
      reduce.removeEventListener("change", onChange);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
