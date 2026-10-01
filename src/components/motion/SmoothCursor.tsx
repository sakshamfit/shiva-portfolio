"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], label, summary, select, input[type="range"], input[type="checkbox"], input[type="radio"]';
const TEXT = 'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

/**
 * A precise dot that sits exactly on the pointer, and a ring that glides after it with a soft
 * ease (and grows over anything clickable). Mouse and trackpad only; touch devices and visitors
 * who prefer reduced motion keep the system cursor. Text fields keep the text cursor.
 * Positions are written as GPU transforms in one requestAnimationFrame loop that sleeps when idle.
 */
export function SmoothCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("smooth-cursor");

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let scale = 1;
    let targetScale = 1;
    let frame = 0;
    let visible = false;

    const render = () => {
      frame = 0;
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      scale += (targetScale - scale) * 0.2;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale.toFixed(3)})`;
      if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1 || Math.abs(targetScale - scale) > 0.002) {
        frame = requestAnimationFrame(render);
      }
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        root.classList.add("cursor-visible");
      }
      const t = e.target as Element | null;
      const onText = Boolean(t?.closest?.(TEXT));
      root.classList.toggle("cursor-on-dark", Boolean(t?.closest?.('[data-surface="dark"], [data-header-theme="dark"]')));
      root.classList.toggle("cursor-text", onText);
      targetScale = !onText && t?.closest?.(INTERACTIVE) ? 1.7 : 1;
      ring.classList.toggle("is-active", targetScale > 1);
      wake();
    };
    const onDown = () => {
      targetScale = Math.max(0.8, targetScale - 0.3);
      wake();
    };
    const onUp = () => {
      targetScale = ring.classList.contains("is-active") ? 1.7 : 1;
      wake();
    };
    const onLeave = () => {
      visible = false;
      root.classList.remove("cursor-visible");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("smooth-cursor", "cursor-visible", "cursor-text", "cursor-on-dark");
    };
  }, []);

  return (
    <div aria-hidden className="smooth-cursor-layer">
      <div ref={ringRef} className="smooth-cursor-ring" />
      <div ref={dotRef} className="smooth-cursor-dot" />
    </div>
  );
}
