"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CapabilityId } from "@/content/skills";

/* Small, calm illustrations of each capability's core method. Illustrative values only. */

function useDraw(delay = 0) {
  const reduce = useReducedMotion();
  return reduce
    ? { initial: false as const }
    : {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
      };
}

/** Drone operations: a site boundary with the grid flown over it, waypoint by waypoint. */
function FlightPlanVisual() {
  const path: [number, number][] = [
    [50, 44],
    [370, 44],
    [370, 78],
    [50, 78],
    [50, 112],
    [370, 112],
    [370, 146],
    [50, 146],
  ];
  const d = path.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join("");
  const draw = useDraw(0.1);
  return (
    <svg
      viewBox="0 0 420 190"
      className="h-auto w-full"
      role="img"
      aria-label="Illustration: a site boundary with a grid flight plan flown back and forth, waypoints marked along the lines and the take-off point at the corner."
    >
      <rect x="34" y="28" width="352" height="134" rx="6" fill="#145fe5" opacity="0.05" stroke="#8fb6f5" strokeWidth="1.4" strokeDasharray="6 5" />
      <text x="40" y="22" fontSize="10" fill="#667085" fontWeight="600">
        Site boundary
      </text>
      <motion.path d={d} fill="none" stroke="#145fe5" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" {...draw} />
      {path.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 5 : 3.4} fill={i === 0 ? "#0b3d91" : "#ffffff"} stroke="#145fe5" strokeWidth="2" />
      ))}
      <text x="60" y="34" fontSize="10" fill="#0b3d91" fontWeight="600">
        Take-off
      </text>
      <text x="292" y="176" fontSize="10" fill="#667085">
        8 passes · 120 m
      </text>
    </svg>
  );
}

/** Cameras & lenses: what each focal length sees, with the exposure held through them. */
function CameraVisual() {
  const frames = [
    { label: "24mm", x: 24, y: 34, w: 220, h: 124 },
    { label: "50mm", x: 66, y: 52, w: 136, h: 88 },
    { label: "85mm", x: 98, y: 68, w: 72, h: 56 },
  ];
  const draw = useDraw(0.15);
  return (
    <div role="img" aria-label="Illustration: three framing rectangles showing what 24, 50 and 85 millimetre lenses see of the same scene, beside the exposure settings used.">
      <svg viewBox="0 0 420 190" className="h-auto w-full" aria-hidden>
        <rect x="24" y="34" width="220" height="124" rx="4" fill="#0e9aa7" opacity="0.08" />
        {frames.map((f, i) => (
          <motion.rect
            key={f.label}
            x={f.x}
            y={f.y}
            width={f.w}
            height={f.h}
            rx="3"
            fill="none"
            stroke={i === 0 ? "#8fb6f5" : "#145fe5"}
            strokeWidth={i === 2 ? 2.4 : 1.6}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "134px 96px" }}
          />
        ))}
        {frames.map((f, i) => (
          <text key={f.label} x={f.x + 5} y={f.y - 6} fontSize="10" fill={i === 2 ? "#0b3d91" : "#667085"} fontWeight="600">
            {f.label}
          </text>
        ))}
        <motion.line x1="266" x2="266" y1="34" y2="158" stroke="#d8e1ec" strokeWidth="1.4" {...draw} />
        <g>
          {[
            { l: "Shutter", v: "1/2000" },
            { l: "Aperture", v: "f/2.8" },
            { l: "ISO", v: "100" },
          ].map((e, i) => (
            <g key={e.l} transform={`translate(282 ${44 + i * 40})`}>
              <rect width="120" height="30" rx="7" fill="#ffffff" stroke="#d8e1ec" />
              <text x="10" y="19" fontSize="10" fill="#667085">
                {e.l}
              </text>
              <text x="110" y="19" fontSize="11" fill="#0b3d91" fontWeight="700" textAnchor="end">
                {e.v}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

/** Cinematography: a shot list cut into a timeline, scene by scene. */
function CinemaVisual() {
  const shots = [0, 1, 2, 3, 4];
  const reduce = useReducedMotion();
  const bar = (delay: number, x: number, w: number, color: string) => (
    <motion.rect
      x={x}
      y="118"
      width={w}
      height="16"
      rx="4"
      fill={color}
      initial={reduce ? false : { opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: `${x}px 126px` }}
    />
  );
  return (
    <svg
      viewBox="0 0 420 190"
      className="h-auto w-full"
      role="img"
      aria-label="Illustration: a strip of five storyboard frames numbered as shots, sitting above a timeline that places each shot in the edit."
    >
      {shots.map((i) => (
        <motion.rect
          key={i}
          x={22 + i * 78}
          y="26"
          width="64"
          height="60"
          rx="5"
          fill={i % 2 ? "#eef4fb" : "#ffffff"}
          stroke={i === 2 ? "#145fe5" : "#d8e1ec"}
          strokeWidth={i === 2 ? 2 : 1.3}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {shots.map((i) => (
        <text key={`n${i}`} x={26 + i * 78} y="100" fontSize="10" fill={i === 2 ? "#0b3d91" : "#667085"} fontWeight="600">
          Shot {String(i + 1).padStart(2, "0")}
        </text>
      ))}
      <line x1="22" x2="398" y1="126" y2="126" stroke="#d8e1ec" strokeWidth="1.4" />
      {bar(0.35, 100, 150, "#145fe5")}
      {bar(0.6, 256, 86, "#8fb6f5")}
      <text x="22" y="156" fontSize="10" fill="#667085">
        0:00
      </text>
      <text x="374" y="156" fontSize="10" fill="#667085">
        1:30
      </text>
      <text x="22" y="176" fontSize="10" fill="#0b3d91" fontWeight="600">
        Reveal · orbit · track · detail · outro
      </text>
    </svg>
  );
}

/** Editing, colour & delivery: one look held across every camera, then shipped. */
function PostVisual() {
  const reduce = useReducedMotion();
  const wheels = [
    { c: "#d03b3b", a: 0 },
    { c: "#0e9aa7", a: 120 },
    { c: "#145fe5", a: 240 },
  ];
  return (
    <svg
      viewBox="0 0 420 190"
      className="h-auto w-full"
      role="img"
      aria-label="Illustration: a colour-grade ramp between shadows and highlights, a colour wheel, and the three delivery formats the edit is exported to."
    >
      {/* grade ramp */}
      <defs>
        <linearGradient id="grade-ramp" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b3d91" />
          <stop offset="0.5" stopColor="#8fb6f5" />
          <stop offset="1" stopColor="#f3c98b" />
        </linearGradient>
      </defs>
      <text x="22" y="30" fontSize="10" fill="#667085" fontWeight="600">
        Shadows
      </text>
      <text x="330" y="30" fontSize="10" fill="#667085" fontWeight="600">
        Highlights
      </text>
      <motion.rect
        x="22"
        y="38"
        width="376"
        height="26"
        rx="6"
        fill="url(#grade-ramp)"
        initial={reduce ? false : { opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "22px 51px" }}
      />
      {[
        { x: 70, l: "Lift" },
        { x: 210, l: "Gamma" },
        { x: 350, l: "Gain" },
      ].map((p, i) => (
        <g key={p.l}>
          <circle cx={p.x} cy="92" r="6" fill="#ffffff" stroke="#0b3d91" strokeWidth="2" />
          <text x={p.x - 14} y="114" fontSize="10" fill="#667085">
            {p.l}
          </text>
          <motion.line
            x1={p.x}
            x2={p.x}
            y1="98"
            y2="118"
            stroke="#d8e1ec"
            strokeWidth="1.2"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
          />
        </g>
      ))}

      {/* colour wheel */}
      <g transform="translate(90 152)">
        {wheels.map((w, i) => (
          <circle
            key={w.c}
            r="16"
            fill="none"
            stroke={w.c}
            strokeWidth="5"
            strokeDasharray={`${(2 * Math.PI * 16) / 3 - 4} 4`}
            transform={`rotate(${w.a} 0 0)`}
            opacity={0.9}
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        ))}
      </g>

      {/* deliverables */}
      <g transform="translate(258 130)">
        {[
          { l: "Stills", w: 58 },
          { l: "16:9", w: 58 },
          { l: "9:16", w: 58 },
        ].map((d, i) => (
          <g key={d.l} transform={`translate(0 ${i * 22})`}>
            <rect width={d.w} height="16" rx="4" fill={i === 1 ? "#145fe5" : "#eef4fb"} stroke={i === 1 ? "none" : "#d8e1ec"} />
            <text x="8" y="12" fontSize="9.5" fill={i === 1 ? "#ffffff" : "#0b3d91"} fontWeight="700">
              {d.l}
            </text>
          </g>
        ))}
      </g>
      <text x="180" y="184" fontSize="10" fill="#0b3d91" fontWeight="600">
        Graded to one look
      </text>
    </svg>
  );
}

/** Studio, clients & logistics: a shoot day planned hour by hour. */
function StudioVisual() {
  const rows = [
    { l: "Recce & permits", x: 24, w: 96, c: "#8fb6f5" },
    { l: "Travel & setup", x: 96, w: 84, c: "#0e9aa7" },
    { l: "Fly & capture", x: 150, w: 150, c: "#145fe5" },
    { l: "Backup & review", x: 288, w: 62, c: "#e0930b" },
    { l: "Edit & deliver", x: 336, w: 58, c: "#0b3d91" },
  ];
  return (
    <svg
      viewBox="0 0 420 190"
      className="h-auto w-full"
      role="img"
      aria-label="Illustration: a shoot day planned as a timeline, from the recce and permits the day before through flying, on-site backup and delivery."
    >
      {["06:00", "10:00", "14:00", "18:00"].map((t, i) => (
        <g key={t}>
          <line x1={30 + i * 108} x2={30 + i * 108} y1="22" y2="164" stroke="#eef2f7" strokeWidth="1.4" />
          <text x={30 + i * 108} y="16" fontSize="9.5" fill="#667085">
            {t}
          </text>
        </g>
      ))}
      {rows.map((r, i) => (
        <g key={r.l}>
          <text x="24" y={44 + i * 30} fontSize="10" fill="#667085">
            {r.l}
          </text>
          <motion.rect
            x={r.x}
            y={50 + i * 30}
            width={r.w}
            height="12"
            rx="6"
            fill={r.c}
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.12 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${r.x}px ${56 + i * 30}px` }}
          />
        </g>
      ))}
      <text x="24" y="184" fontSize="10" fill="#0b3d91" fontWeight="600">
        Call sheet sent the evening before
      </text>
    </svg>
  );
}

export function CapabilityVisual({ id }: { id: CapabilityId }) {
  switch (id) {
    case "flying":
      return <FlightPlanVisual />;
    case "camera":
      return <CameraVisual />;
    case "cinema":
      return <CinemaVisual />;
    case "post":
      return <PostVisual />;
    default:
      return <StudioVisual />;
  }
}

export const visualCaption: Record<CapabilityId, string> = {
  flying: "Flight planning: boundary, grid passes and take-off point",
  camera: "Focal lengths: what 24, 50 and 85mm see, with the exposure held",
  cinema: "Storytelling: the shot list cut into a timeline",
  post: "Colour and delivery: one grade, three exports",
  studio: "Studio work: a shoot day planned hour by hour",
};
