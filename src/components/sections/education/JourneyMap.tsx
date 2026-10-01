"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { JOURNEY_ARC_PATH, JOURNEY_BASE_SRC, JOURNEY_POINTS, JOURNEY_WINDOW } from "@/content/geo/journey.generated";
import styles from "./education.module.css";

const VB = JOURNEY_WINDOW;
const pct = ([x, y]: readonly [number, number]) => ({
  left: `${((x - VB.x) / VB.w) * 100}%`,
  top: `${((y - VB.y) / VB.h) * 100}%`,
});

/**
 * The training journey on a real map: Gorakhpur (home base) to the city where the
 * remote pilot training was completed. The route draws itself when revealed (CSS, via
 * the reveal system); a small plane then travels it once. Labels are HTML so they stay
 * legible at every size.
 */
export function JourneyMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<SVGAnimateMotionElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const start = window.setTimeout(() => {
      if (planeRef.current) planeRef.current.style.opacity = "1";
      motionRef.current?.beginElement();
    }, 900);
    // the route is flown once; the plane then leaves the pin uncluttered
    const end = window.setTimeout(() => {
      if (planeRef.current) planeRef.current.style.opacity = "0";
    }, 900 + 2200 + 250);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [inView, reduce]);

  return (
    <div ref={wrapRef} className={styles.map} data-reveal="group">
      <div className={styles.mapBase}>
        <Image src={JOURNEY_BASE_SRC} alt="" width={VB.w} height={VB.h} unoptimized className="block h-auto w-full select-none" draggable={false} />
      </div>
      <svg
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Map of the training journey from Gorakhpur, the home base in Uttar Pradesh, to the city where the remote pilot certificate training was completed."
      >
        <defs>
          <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#145fe5" />
            <stop offset="1" stopColor="#0b3d91" />
          </linearGradient>
        </defs>
        <path id="journey-arc" d={JOURNEY_ARC_PATH} className={styles.arc} pathLength={1} stroke="url(#arc-grad)" />
        <circle cx={JOURNEY_POINTS.home[0]} cy={JOURNEY_POINTS.home[1]} r="7" className={styles.pin} />
        <circle cx={JOURNEY_POINTS.training[0]} cy={JOURNEY_POINTS.training[1]} r="7" className={styles.pinEnd} />
        <circle cx={JOURNEY_POINTS.training[0]} cy={JOURNEY_POINTS.training[1]} r="7" className={styles.ring} />
        <g ref={planeRef} style={{ opacity: 0, transition: "opacity 300ms" }}>
          {/* plane glyph, nose pointing along +x so rotate="auto" follows the route */}
          <path d="M9 0 L-5 -6 L-2 0 L-5 6 Z" fill="#0b3d91" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
          <animateMotion
            ref={motionRef}
            dur="2.2s"
            begin="indefinite"
            fill="freeze"
            rotate="auto"
            calcMode="spline"
            keyPoints="0;1"
            keyTimes="0;1"
            keySplines="0.45 0 0.25 1"
          >
            <mpath href="#journey-arc" />
          </animateMotion>
        </g>
      </svg>

      <div className={styles.label} style={pct(JOURNEY_POINTS.training)} data-align="top-right">
        <span className={styles.labelCity}>Training city</span>
        <span className={styles.labelDetail}>Remote Pilot Certificate, 2021</span>
      </div>
      <div className={styles.label} style={pct(JOURNEY_POINTS.home)} data-align="bottom">
        <span className={styles.labelCity}>Gorakhpur, Uttar Pradesh</span>
        <span className={styles.labelDetail}>Home base and studio</span>
      </div>
    </div>
  );
}
