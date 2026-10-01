"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { landscapeSkills } from "@/content/skills";
import { Sparkline } from "@/components/charts/primitives";
import { cn } from "@/lib/utils";
import styles from "./skills.module.css";

const floatTimings = [
  { dur: "6.2s", delay: "-1.1s", amp: "-9px" },
  { dur: "5.4s", delay: "-3.2s", amp: "-7px" },
  { dur: "6.8s", delay: "-0.4s", amp: "-11px" },
  { dur: "4.8s", delay: "-2.6s", amp: "-8px" },
  { dur: "5.9s", delay: "-4.1s", amp: "-10px" },
  { dur: "6.5s", delay: "-1.9s", amp: "-8px" },
  { dur: "4.4s", delay: "-0.9s", amp: "-7px" },
  { dur: "5.1s", delay: "-2.2s", amp: "-12px" },
];

function Float({ i, children, className, still }: { i: number; children: React.ReactNode; className?: string; still?: boolean }) {
  const t = floatTimings[i % floatTimings.length];
  // text stays still so it is always easy to read; only the photographed objects drift
  if (still) return <div className={className}>{children}</div>;
  return (
    <div
      className={cn("anim-float", className)}
      style={{ ["--float-dur" as string]: t.dur, ["--float-delay" as string]: t.delay, ["--float" as string]: t.amp }}
    >
      {children}
    </div>
  );
}

export function SkillScene({ screen }: { screen: React.ReactNode }) {
  const reduce = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  // how the last press started: a mouse click keeps a hover-opened note open; a tap toggles it
  const lastPointer = useRef("");
  const [finePointer, setFinePointer] = useState(false);
  const baseId = useId();

  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(ny, { stiffness: 90, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, [-1, 1], [-7, 7]);
  const rotateX = useTransform(sy, [-1, 1], [5, -5]);
  const glare = useTransform(sx, [-1, 1], [-18, 18]);
  const glareVar = useMotionTemplate`${glare}%`;
  const nearX = useTransform(sx, [-1, 1], [-14, 14]);
  const nearY = useTransform(sy, [-1, 1], [-8, 8]);
  const farX = useTransform(sx, [-1, 1], [-6, 6]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const interactive = finePointer && !reduce;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    nx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    ny.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    nx.set(0);
    ny.set(0);
  };

  return (
    <div
      ref={sceneRef}
      className={styles.scene}
      data-reveal="group"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(null);
      }}
    >
      {/* floating analytics tiles (decorative, demo values) */}
      <motion.div className={cn(styles.tile, styles.tileA)} style={interactive ? { x: farX } : undefined} aria-hidden data-reveal="left">
        <Float i={3} className="grid gap-1.5" still>
          <span className="text-[0.72rem] font-medium text-muted">Windows flown as planned</span>
          <span className="text-[1.2rem] font-[640] tracking-[-0.02em] text-ink">91% of call sheets</span>
          <Sparkline values={[62, 66, 64, 70, 74, 71, 78, 81, 80, 86, 88, 91]} width={170} height={34} className="h-auto w-full max-w-[170px]" />
          <span className="text-[0.66rem] text-muted">Demo values</span>
        </Float>
      </motion.div>
      <motion.div className={cn(styles.tile, styles.tileB)} style={interactive ? { x: farX } : undefined} aria-hidden data-reveal="right">
        <Float i={5} className="grid gap-1.5" still>
          <span className="text-[0.72rem] font-medium text-muted">Kit readiness</span>
          <span className="text-[1.2rem] font-[640] tracking-[-0.02em] text-ink">Ready for 12 shoots</span>
          <span className="mt-1 flex h-2 gap-[2px] overflow-hidden rounded-[4px]">
            <span className="w-[58%] bg-blue" />
            <span className="w-[27%] bg-[#8fb6f5]" />
            <span className="w-[15%] bg-[#e0930b]" />
          </span>
          <span className="flex justify-between text-[0.66rem] text-muted">
            <span>Charged</span>
            <span>In use</span>
            <span>Service</span>
          </span>
        </Float>
      </motion.div>

      {/* the laptop */}
      <div className={styles.laptopWrap} data-reveal="rise" style={{ ["--d" as string]: "150ms" }}>
        <motion.div className={styles.laptop} style={interactive ? { rotateX, rotateY } : undefined}>
          <div className={styles.bezel}>
            <motion.div className={styles.display} style={interactive ? ({ ["--gx" as string]: glareVar } as never) : undefined}>
              {screen}
            </motion.div>
          </div>
          <div className={styles.base} />
          <div className={styles.shadow} />
        </motion.div>
      </div>

      {/* the kit, shot on the same white floor as the rest of the site */}
      <div className={styles.objects} aria-hidden>
        <motion.div className={cn(styles.object, styles.caseSlot)} style={interactive ? { x: nearX, y: nearY } : undefined}>
          <div data-reveal="left" style={{ ["--d" as string]: "300ms" }}>
            <Float i={0}>
              <Image src="/images/skills/case.png" alt="" width={1000} height={680} sizes="(min-width: 1024px) 14vw, 32vw" />
            </Float>
          </div>
        </motion.div>
        <motion.div className={cn(styles.object, styles.cameraSlot)} style={interactive ? { x: nearX, y: nearY } : undefined}>
          <div data-reveal="rise" style={{ ["--d" as string]: "420ms" }}>
            <Float i={2}>
              <Image src="/images/skills/camera.png" alt="" width={560} height={640} sizes="(min-width: 1024px) 6vw, 16vw" />
            </Float>
          </div>
        </motion.div>
        <motion.div className={cn(styles.object, styles.droneSlot)} style={interactive ? { x: nearX, y: nearY } : undefined}>
          <div data-reveal="right" style={{ ["--d" as string]: "360ms" }}>
            <Float i={4}>
              <Image src="/images/skills/drone.png" alt="" width={900} height={460} sizes="(min-width: 1024px) 17vw, 38vw" />
            </Float>
          </div>
        </motion.div>
        <motion.div className={cn(styles.object, styles.batterySlot)} style={interactive ? { x: farX } : undefined}>
          <div data-reveal="left" style={{ ["--d" as string]: "480ms" }}>
            <Float i={5}>
              <Image src="/images/skills/battery.png" alt="" width={520} height={520} sizes="(min-width: 1024px) 9vw, 22vw" />
            </Float>
          </div>
        </motion.div>
        <motion.div className={cn(styles.object, styles.tripodSlot)} style={interactive ? { x: farX } : undefined}>
          <div data-reveal="right" style={{ ["--d" as string]: "540ms" }}>
            <Float i={6}>
              <Image src="/images/skills/tripod.png" alt="" width={420} height={960} sizes="(min-width: 1024px) 7vw, 17vw" />
            </Float>
          </div>
        </motion.div>
        {/* the blue bar-chart tile from the reference, drawn in CSS so it stays crisp */}
        <motion.div className={cn(styles.object, styles.chartTile)} style={interactive ? { x: farX } : undefined}>
          <div data-reveal="scale" style={{ ["--d" as string]: "600ms" }}>
            <Float i={7}>
              <span className={styles.chartTileFace}>
                <span style={{ height: "38%" }} />
                <span style={{ height: "62%" }} />
                <span style={{ height: "88%" }} />
              </span>
            </Float>
          </div>
        </motion.div>
      </div>

      {/* skills: each reveals where it was used */}
      <ul className={styles.pills} aria-label="Core skills, with where each was applied">
        {landscapeSkills.map((s, i) => {
          const isOpen = open === i;
          const proofId = `${baseId}-proof-${i}`;
          return (
            <li key={s.label} className={cn(styles.pillWrap, styles[`p${i}`])}>
              <div data-reveal="fade" style={{ ["--d" as string]: `${500 + i * 80}ms` }}>
                <Float i={i + 1} still>
                  <button
                    type="button"
                    className={styles.pill}
                    aria-expanded={isOpen}
                    aria-controls={proofId}
                    onPointerDown={(e) => {
                      lastPointer.current = e.pointerType;
                    }}
                    onClick={() => setOpen(isOpen && lastPointer.current !== "mouse" ? null : i)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") setOpen(i);
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === "mouse") setOpen((o) => (o === i ? null : o));
                    }}
                    // keyboard focus opens the note; a tap's focus must not, or the tap's click would close it again
                    onFocus={(e) => {
                      if (e.currentTarget.matches(":focus-visible")) setOpen(i);
                    }}
                    onBlur={() => setOpen((o) => (o === i ? null : o))}
                  >
                    <span aria-hidden className={styles.pillDot} />
                    {s.label}
                  </button>
                  <p id={proofId} role="note" className={styles.proof} hidden={!isOpen}>
                    {s.proof}
                  </p>
                </Float>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
