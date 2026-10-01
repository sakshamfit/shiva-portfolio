"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import styles from "./why.module.css";

/**
 * "Why choose me?": the cables reveal downward (700ms, 100ms delay), the print is lowered
 * from 22% of its height above its resting place (1250ms, opacity 0.7 to 1, 220ms delay),
 * then settles with a 3px damped dip (420ms, no elastic bounce).
 * Without JavaScript, or with reduced motion, it simply hangs in its final position.
 */
export function DropContainer({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef<HTMLDivElement>(null);
  const armed = useRef(false);
  const reduce = useReducedMotion();
  const inView = useInView(rootRef, { once: true, amount: 0.25 });

  const drop = useMotionValue("0%");
  const settle = useMotionValue(0);
  const opacity = useMotionValue(1);
  const cable = useMotionValue("inset(0% 0% 0% 0%)");

  useEffect(() => {
    if (!reduce) {
      drop.set("-22%");
      opacity.set(0);
      cable.set("inset(0% 0% 100% 0%)");
      armed.current = true;
    }
    loadRef.current?.setAttribute("data-ready", "");
  }, [reduce, drop, opacity, cable]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    armed.current = false;
    const controls = [
      animate(cable, "inset(0% 0% 0% 0%)", { duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }),
      animate(opacity, [0.7, 1], { duration: 0.6, delay: 0.22 }),
      animate(drop, "0%", { duration: 1.25, delay: 0.22, ease: [0.16, 1, 0.3, 1] }),
      animate(settle, [0, 3, -0.8, 0], { duration: 0.42, delay: 1.4, ease: "easeOut", times: [0, 0.4, 0.75, 1] }),
    ];
    return () => controls.forEach((c) => c.stop());
  }, [inView, drop, settle, opacity, cable]);

  return (
    <div ref={rootRef} className={className} aria-hidden>
      <motion.div ref={loadRef} className="crane-load relative will-change-transform" style={{ y: drop, opacity }}>
        <motion.div className="relative" style={{ y: settle }}>
          {/* hoist cables running up out of the frame to the hook block */}
          <motion.div className={styles.cables} style={{ clipPath: cable }}>
            <span />
            <span />
            <span />
          </motion.div>
          <Image
            src="/images/about/print.png"
            alt=""
            width={1006}
            height={1460}
            sizes="(min-width: 1024px) 26vw, 70vw"
            quality={85}
            className="relative block h-auto w-full select-none drop-shadow-[0_36px_40px_rgba(11,40,90,0.35)]"
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
