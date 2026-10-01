import Image from "next/image";
import type { CSSProperties } from "react";
import { Camera } from "@phosphor-icons/react/dist/ssr/Camera";
import { Crop } from "@phosphor-icons/react/dist/ssr/Crop";
import { FilmStrip } from "@phosphor-icons/react/dist/ssr/FilmStrip";
import { MapTrifold } from "@phosphor-icons/react/dist/ssr/MapTrifold";
import { workDeck } from "@/content/about";
import { cn } from "@/lib/utils";
import styles from "./about.module.css";

const v = (vars: Record<string, string>) => vars as CSSProperties;

const serviceIcons = {
  films: FilmStrip,
  stills: Camera,
  mapping: MapTrifold,
  progress: Crop,
} as const;

/** Attitude indicator: sky, ground and pitch ladder in a ring, banked a few degrees. */
function HorizonGauge() {
  return (
    <svg viewBox="0 0 64 64" className={styles.gauge} aria-hidden focusable="false">
      <defs>
        <clipPath id="hud-horizon">
          <circle cx="32" cy="32" r="24" />
        </clipPath>
      </defs>
      <g clipPath="url(#hud-horizon)">
        <g className={styles.gaugeSway}>
          <rect x="-16" y="-16" width="96" height="48" fill="#dceeff" />
          <rect x="-16" y="32" width="96" height="48" fill="#b7d4f0" />
          <line x1="-16" y1="32" x2="80" y2="32" stroke="#0b3d91" strokeWidth="1.8" />
          <line x1="14" y1="24" x2="50" y2="24" stroke="#0b3d91" strokeWidth="1" opacity="0.5" />
          <line x1="21" y1="40" x2="43" y2="40" stroke="#0b3d91" strokeWidth="1" opacity="0.5" />
        </g>
      </g>
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="rgb(255 255 255 / 0.5)" strokeWidth="1.4" />
      <path d="M15 32h9M40 32h9" stroke="#f26a1b" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Four bars, filled to `value`: the signal and battery marks of a transmitter screen. */
function Bars({ value, label }: { value: number; label: string }) {
  return (
    <span className={styles.bars} role="img" aria-label={`${label}: ${value} of 4 bars`}>
      {[1, 2, 3, 4].map((i) => (
        <i key={i} className={cn(styles.bar, i <= value && styles.barOn)} style={{ height: `${3 + i * 1.6}px` }} />
      ))}
    </span>
  );
}

/**
 * The right-hand half of the About stage: what a booking produces, the numbers behind the last
 * flight and the note a client would otherwise phone to ask about. Below 1100px the sheets stack
 * under the standing portrait; above it they are placed in the stage's right column.
 */
export function WorkDeck() {
  const { hud, label, note, services, title } = workDeck;

  return (
    <div className={styles.deck}>
      {/* the pinned sheet: what a shoot delivers */}
      <article aria-label={title} className={styles.deckSheet} data-reveal="right" style={v({ "--d": "1040ms", "--dur": "520ms", "--rx": "16px" })}>
        <span aria-hidden className={styles.clip}>
          <Image src="/images/ui/stationery/clip.webp" alt="" width={493} height={503} sizes="72px" quality={82} />
        </span>

        <p className={styles.deckLabel}>{label}</p>
        <h2 className={styles.deckTitle}>{title}</h2>

        <ul className={styles.serviceList}>
          {services.map((s) => {
            const Icon = serviceIcons[s.id as keyof typeof serviceIcons];
            return (
              <li key={s.id} className={styles.service}>
                <span className={styles.serviceIcon}>
                  <Icon size={14} weight="regular" aria-hidden />
                </span>
                <span>
                  <span className={styles.serviceTitle}>{s.title}</span>
                  <span className={styles.serviceText}>{s.text}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className={styles.note}>
          <p className={styles.noteHand}>{note.hand}</p>
          <p className={styles.noteFine}>{note.fine}</p>
        </div>
      </article>

      {/* the instrument panel: the readouts of the last sortie */}
      <div className={styles.hud} data-reveal="right" style={v({ "--d": "1180ms", "--dur": "520ms", "--rx": "16px" })}>
        <p className={styles.hudTop}>
          <span aria-hidden className={styles.recDot} />
          {hud.label}
          <span className={styles.hudSignals}>
            {hud.bars.map((b) => (
              <Bars key={b.id} value={b.value} label={b.label} />
            ))}
          </span>
          <span className={styles.hudRec}>{hud.rec}</span>
        </p>

        <HorizonGauge />

        <dl className={styles.readouts}>
          {hud.readouts.map((r) => (
            <div key={r.id} className={styles.readout}>
              <dt>{r.label}</dt>
              <dd>
                {r.value}
                {r.unit ? <span className={styles.readoutUnit}>{r.unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>

        <p className={styles.hudCaption}>{hud.caption}</p>

        <span aria-hidden className={styles.pencil}>
          <Image src="/images/ui/stationery/pencil.webp" alt="" width={478} height={475} sizes="56px" quality={82} />
        </span>
      </div>
    </div>
  );
}
