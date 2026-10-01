"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import styles from "./projects.module.css";

/* waypoints of the demonstration grid, in the 1000 x 560 coordinate frame */
const WAYPOINTS: [number, number][] = [
  [180, 150],
  [420, 110],
  [690, 170],
  [860, 300],
  [640, 420],
  [330, 400],
  [150, 290],
];

/**
 * Projects landing backdrop: an aerial frame held behind the text, with a slow scroll
 * parallax and a faint flight-grid overlay drawn over it. The photograph and the grid are
 * separate layers, so the grid can draw itself in while the image stays still.
 */
export function ProjectsScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end start"] });
  const slowY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 40]);

  const path = WAYPOINTS.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");

  return (
    <div ref={rootRef} className={styles.sceneWrap} aria-hidden>
      <motion.div className={styles.scene} style={{ y: slowY, ["--dur" as string]: "600ms" }} data-reveal="fade">
        <Image
          src="/images/projects/hero-aerial.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 110vw, 220vw"
          quality={80}
          className="object-cover"
        />
      </motion.div>

      {/* the flight grid: boundary, passes and waypoints, drawn over the photograph */}
      <svg
        viewBox="0 0 1000 560"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-[0.5]"
      >
        <defs>
          <linearGradient id="grid-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8fb6f5" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        {/* boundary */}
        <motion.rect
          x="120"
          y="86"
          width="790"
          height="376"
          rx="14"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.22"
          strokeWidth="1.4"
          strokeDasharray="10 8"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* the passes flown inside it */}
        {[0, 1, 2, 3].map((i) => (
          <motion.line
            key={i}
            x1={180 - i * 6}
            x2={840 - i * 6}
            y1={170 + i * 82}
            y2={170 + i * 82}
            stroke="#8fb6f5"
            strokeOpacity="0.35"
            strokeWidth="1.1"
            strokeDasharray="6 7"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.7 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
        {/* the route between the waypoints */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#grid-arc)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeOpacity="0.75"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        {WAYPOINTS.map(([x, y], i) => (
          <motion.circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={i === 0 ? 6 : 4.4}
            fill={i === 0 ? "#ffffff" : "#0b3d91"}
            stroke="#ffffff"
            strokeWidth="1.6"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}
      </svg>

      <div className={styles.sceneShade} />
    </div>
  );
}
