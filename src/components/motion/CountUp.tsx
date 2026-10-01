"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  group?: boolean;
  decimals?: number;
  duration?: number;
  /** seconds to wait after the number enters view (match the reveal it sits in) */
  delay?: number;
  /** the same below 64rem, where long first-screen choreography delays give way to short ones (see .dm-*) */
  mobileDelay?: number;
  className?: string;
};

/**
 * Renders the final figure on the server (so it is correct without JavaScript),
 * then counts up once when scrolled into view. If the number is already on screen
 * at hydration, or the visitor prefers reduced motion, it simply stays put.
 */
export function CountUp({ value, prefix = "", suffix = "", group = false, decimals = 0, duration = 1.4, delay = 0.25, mobileDelay, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const format = (n: number) =>
      prefix +
      (group
        ? n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : n.toFixed(decimals)) +
      suffix;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    el.textContent = format(0);
    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const narrow = mobileDelay !== undefined && !window.matchMedia("(min-width: 64rem)").matches;
        const controls = animate(0, value, {
          duration,
          delay: narrow ? mobileDelay : delay,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => {
            el.textContent = format(decimals ? v : Math.round(v));
          },
        });
        stop = () => controls.stop();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
      el.textContent = format(value);
    };
  }, [value, prefix, suffix, group, decimals, duration, delay, mobileDelay, reduce]);

  const initial =
    prefix +
    (group
      ? value.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : value.toFixed(decimals)) +
    suffix;

  return (
    <span ref={ref} className={className}>
      {initial}
    </span>
  );
}
