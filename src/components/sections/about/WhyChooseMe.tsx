import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Aperture } from "@phosphor-icons/react/dist/ssr/Aperture";
import { Camera } from "@phosphor-icons/react/dist/ssr/Camera";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { whyChooseMe as w } from "@/content/about";
import { site } from "@/content/site";
import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/utils";
import { PrintPhoto } from "./PrintPhoto";
import styles from "./why.module.css";

const v = (vars: Record<string, string>) => vars as CSSProperties;

const icons = {
  aerial: Aperture,
  camera: Camera,
  safety: ShieldCheck,
  delivery: PaperPlaneTilt,
  local: MapPin,
} as const;

/** grid area and entrance side for each reason, matching the reference's placement */
const placement = [
  { area: styles.r1, side: "left" },
  { area: styles.r2, side: "right" },
  { area: styles.r3, side: "right" },
  { area: styles.r4, side: "left" },
  { area: styles.r5, side: "right" },
] as const;

export function WhyChooseMe() {
  return (
    <section id="why-choose-me" aria-labelledby="why-title" data-header-theme="light" className={styles.section}>
      {/* the sky and the ground below it; on narrow screens the ground sits along the bottom */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#9cc6ef_0%,#b0d2f3_55%,#bcdaf5_100%)]"
        data-reveal="fade"
        style={v({ "--dur": "600ms" })}
      >
        <div className="absolute inset-x-0 bottom-0 h-[80vw] [mask-image:linear-gradient(180deg,transparent,#000_38%)] lg:inset-0 lg:h-auto lg:[mask-image:none]">
          <Image src="/images/about/why-sky.jpg" alt="" fill sizes="100vw" quality={78} className="object-cover object-bottom" />
        </div>
      </div>

      <h2 id="why-title" className="sr-only">
        Why choose me?
      </h2>

      <div className={cn("shell", styles.grid)}>
        {/* corner labels */}
        <p className={cn(styles.cornerLeft, "type-label dm-0 text-navy-900")} data-reveal="fade" style={v({ "--d": "200ms" })}>
          {w.corners.left[0]}
          <br />
          {w.corners.left[1]}
          <span aria-hidden className="mt-3 block h-0.5 w-7 bg-navy-900" />
        </p>
        <p className={cn(styles.cornerRight, "type-label dm-1 text-right text-navy-900")} data-reveal="fade" style={v({ "--d": "260ms" })}>
          {w.corners.right.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
          <span aria-hidden className="ml-auto mt-3 block h-0.5 w-7 bg-navy-900" />
        </p>

        {/* the print, lowered on its cables */}
        <PrintPhoto className={styles.load} />

        {/* WHY / CHOOSE / ME? rise as the print settles */}
        <div className={styles.why} aria-hidden>
          <p className="type-label dm-0 text-navy-900" data-reveal="fade" style={v({ "--d": "1100ms" })}>
            {w.eyebrow}
          </p>
          <p className={cn(styles.big, "dm-1")} data-reveal style={v({ "--d": "1250ms", "--ry": "56px", "--dur": "700ms" })}>
            Why
          </p>
        </div>
        <p className={cn(styles.choose, styles.big, "dm-0")} aria-hidden data-reveal style={v({ "--d": "1330ms", "--ry": "56px", "--dur": "700ms" })}>
          Choose
        </p>
        <p className={cn(styles.me, styles.big, "dm-0")} aria-hidden data-reveal style={v({ "--d": "1410ms", "--ry": "56px", "--dur": "700ms" })}>
          Me?
        </p>

        {/* statement */}
        <div className={styles.statement}>
          <p className="dm-0 text-[clamp(1.45rem,1.1rem+1vw,2rem)] font-[720] leading-[1.12] tracking-[-0.03em] text-navy-900" data-reveal style={v({ "--d": "1450ms" })}>
            {w.statement[0]} <span className="text-blue">{w.statement[1]}</span>
          </p>
          <span aria-hidden className="dm-2 mt-5 block h-0.5 w-10 bg-navy-900" data-reveal="draw-x" style={v({ "--d": "1600ms" })} />
          <p className="pretty dm-1 mt-5 max-w-[22rem] text-[0.98rem] leading-relaxed text-navy-900/85" data-reveal style={v({ "--d": "1560ms" })}>
            {w.body}
          </p>
        </div>

        {/* five CV-backed reasons, each entering from its nearest edge */}
        <div className="contents">
          {w.reasons.map((r, i) => {
            const Icon = icons[r.id];
            const place = placement[i];
            return (
              <div
                key={r.id}
                className={cn(styles.reason, place.area, i % 2 ? "dm-1" : "dm-0")}
                data-reveal={place.side}
                style={v({ "--d": `${1500 + i * 80}ms`, "--dur": "620ms", "--pd": "300ms", "--pdur": "450ms" })}
              >
                <span className="flex items-center gap-4">
                  <span className={styles.icon}>
                    <Icon size={24} weight="regular" aria-hidden />
                  </span>
                  <ArrowRight size={18} weight="light" className="hidden text-navy-900/70 sm:block" aria-hidden />
                </span>
                <h3 className="mt-4 text-[0.98rem] font-[760] uppercase tracking-[0.02em] text-navy-900">{r.title}</h3>
                <p className="mt-1.5 max-w-[17rem] text-[0.92rem] leading-snug text-navy-900/85">{r.text}</p>
                <span aria-hidden className="mt-4 block h-0.5 w-7 bg-navy-900/80" />
              </div>
            );
          })}
        </div>

        {/* numbers: CV-verified values count up once */}
        <dl className={styles.stats}>
          {w.stats.map((s, i) => (
            <div
              key={s.label}
              className={cn("flex flex-col-reverse items-center px-5 text-center", `dm-${i}`)}
              data-reveal="rise"
              style={v({ "--d": `${1700 + i * 90}ms`, "--dur": "600ms" })}
            >
              <dt className="mt-2 max-w-[9rem] text-[0.72rem] font-medium uppercase leading-snug tracking-[0.06em] text-navy-900/85">{s.label}</dt>
              <dd className="text-[clamp(1.8rem,1.4rem+1vw,2.4rem)] font-[800] leading-none tracking-[-0.03em] text-navy-900">
                {"symbol" in s ? <span aria-label="Unlimited">{s.symbol}</span> : <CountUp value={s.value} suffix={s.suffix} delay={1.8 + i * 0.09} mobileDelay={0.25 + i * 0.1} />}
              </dd>
            </div>
          ))}
        </dl>

        <p className={cn(styles.location, "type-label dm-1 inline-flex items-center gap-2 text-navy-900")} data-reveal="fade" style={v({ "--d": "1900ms" })}>
          <MapPin size={16} weight="fill" aria-hidden />
          {site.location}
        </p>
      </div>
    </section>
  );
}
