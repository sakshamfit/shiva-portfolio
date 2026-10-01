"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Drone } from "@phosphor-icons/react/dist/ssr/Drone";
import { Aperture } from "@phosphor-icons/react/dist/ssr/Aperture";
import { FilmStrip } from "@phosphor-icons/react/dist/ssr/FilmStrip";
import { Palette } from "@phosphor-icons/react/dist/ssr/Palette";
import { Users } from "@phosphor-icons/react/dist/ssr/Users";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { capabilities, type Capability, type CapabilityId } from "@/content/skills";
import { cn, ease } from "@/lib/utils";
import { CapabilityVisual, visualCaption } from "./CapabilityVisuals";
import styles from "./capabilities.module.css";

const icons: Record<CapabilityId, typeof Drone> = {
  flying: Drone,
  camera: Aperture,
  cinema: FilmStrip,
  post: Palette,
  studio: Users,
};

function CapabilityCard({
  cap,
  selected,
  onSelect,
  panelId,
  delay,
}: {
  cap: Capability;
  selected: boolean;
  onSelect: () => void;
  panelId: string;
  delay: number;
}) {
  const Icon = icons[cap.id];
  const reduce = useReducedMotion();
  const detailsId = `${panelId}-${cap.id}-details`;
  return (
    <article
      className={cn(styles.card, styles[`area-${cap.id}`], selected && styles.cardOn)}
      data-reveal
      style={{ ["--d" as string]: `${delay}ms` }}
    >
      <h3 className="m-0">
        <button
          type="button"
          className={styles.cardButton}
          aria-expanded={selected}
          aria-controls={`${detailsId} ${panelId}`}
          onClick={onSelect}
        >
          <span className={styles.cardIcon}>
            <Icon size={22} weight="light" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="flex items-baseline gap-2.5">
              <span className="num text-[0.85rem] font-semibold text-blue">{cap.index}</span>
              <span aria-hidden className="h-3.5 w-px translate-y-0.5 bg-line" />
              <span className="text-[1.02rem] font-[640] leading-snug tracking-[-0.015em] text-ink">{cap.title}</span>
            </span>
            <span className="mt-1.5 block text-[0.86rem] leading-relaxed text-ink-2">{cap.summary}</span>
          </span>
          <CaretDown
            size={16}
            aria-hidden
            className={cn("mt-1 shrink-0 text-muted transition-transform duration-300", selected && "rotate-180 text-blue")}
          />
        </button>
      </h3>

      <ul className="mt-4 flex flex-wrap gap-1.5 pl-[3.6rem]" aria-label={`${cap.title} tools and methods`}>
        {cap.skills.map((s) => (
          <li key={s} className={styles.chip}>
            {s}
          </li>
        ))}
      </ul>

      <AnimatePresence initial={false}>
        {selected ? (
          <motion.div
            key="details"
            id={detailsId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: ease.out }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-line pt-4 pl-[3.6rem]">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-muted">Where I have used it</p>
              <ul className="mt-2.5 grid gap-2">
                {cap.evidence.map((e) => (
                  <li key={e} className="flex gap-2 text-[0.86rem] leading-snug text-ink">
                    <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-blue" aria-hidden />
                    {e}
                  </li>
                ))}
              </ul>
              {/* on small screens the illustration lives inside the open card */}
              <div className="mt-5 rounded-xl border border-line bg-mist p-3 lg:hidden">
                <p className="mb-2 text-[0.72rem] font-medium text-muted">{visualCaption[cap.id]} (illustration)</p>
                <CapabilityVisual id={cap.id} />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

export function CapabilitySection() {
  const [selected, setSelected] = useState<CapabilityId>("flying");
  const reduce = useReducedMotion();
  const panelId = useId();
  const current = capabilities.find((c) => c.id === selected)!;

  return (
    <section
      id="capabilities"
     
      data-header-theme="light"
      aria-labelledby="capabilities-title"
      className="relative overflow-hidden bg-white"
    >
      <div className="shell section-pad relative">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className="type-label text-muted" data-reveal>
              From plan to final grade
            </p>
            <h2 id="capabilities-title" data-section-heading className="reveal-lines mt-5 text-[clamp(2.8rem,1.6rem+4.4vw,5.4rem)] font-[680] leading-[0.95] tracking-[-0.055em] text-ink" data-reveal>
              <span className="line">
                <span style={{ ["--i" as string]: 0 }}>Skills,</span>
              </span>
              <span className="line">
                <span style={{ ["--i" as string]: 1 }}>tools &amp;</span>
              </span>
              <span className="line">
                <span style={{ ["--i" as string]: 2 }}>
                  expertise<span className="text-blue">.</span>
                </span>
              </span>
            </h2>
            <p className="type-body pretty mt-6 max-w-[24rem] text-ink-2" data-reveal style={{ ["--d" as string]: "200ms" }}>
              Flying, camera craft, storytelling, post and the studio side of the job — the five areas every shoot
              passes through. Select one to see where it has been used.
            </p>
            <p className="mt-7 border-l-2 border-blue pl-4 text-[1.05rem] leading-snug text-ink-2 lg:mt-10" data-reveal style={{ ["--d" as string]: "300ms" }}>
              Flying safely, shooting cleanly, delivering on time.
            </p>
          </div>

          {capabilities.map((cap, i) => (
            <CapabilityCard
              key={cap.id}
              cap={cap}
              selected={cap.id === selected}
              onSelect={() => setSelected(cap.id)}
              panelId={panelId}
              delay={120 + i * 90}
            />
          ))}

          {/* central dashboard: shows the method behind the selected capability */}
          <div id={panelId} className={styles.center} data-reveal="scale" style={{ ["--d" as string]: "200ms" }} aria-live="polite">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="num grid size-7 place-items-center rounded-full bg-navy text-[0.72rem] font-semibold text-white">
                  {current.index}
                </span>
                <p className="text-[0.88rem] font-semibold text-ink">{current.title}</p>
              </div>
              <span className="demo-badge">Illustration</span>
            </div>
            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: ease.out }}
                >
                  <p className="mb-4 text-[0.8rem] text-muted">{visualCaption[current.id]}</p>
                  <CapabilityVisual id={current.id} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-line px-5 py-3.5" role="group" aria-label="Choose a capability area">
              {capabilities.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={c.id === selected}
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    "tap num h-8 min-w-8 rounded-full px-2.5 text-[0.75rem] font-semibold transition-colors",
                    c.id === selected ? "bg-navy text-white" : "bg-mist text-ink-2 hover:bg-blue-100",
                  )}
                  aria-label={`${c.index}: ${c.title}`}
                >
                  {c.index}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
