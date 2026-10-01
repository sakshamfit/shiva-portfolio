import Image from "next/image";
import type { CSSProperties } from "react";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { Star } from "@phosphor-icons/react/dist/ssr/Star";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { UsersThree } from "@phosphor-icons/react/dist/ssr/UsersThree";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { Bank } from "@phosphor-icons/react/dist/ssr/Bank";
import { BookOpen } from "@phosphor-icons/react/dist/ssr/BookOpen";
import { Quotes } from "@phosphor-icons/react/dist/ssr/Quotes";
import { campusCallouts, campusPhoto, educationCopy, qualifications, type CampusCallout } from "@/content/education";
import { cn } from "@/lib/utils";
import { JourneyMap } from "./JourneyMap";
import styles from "./education.module.css";

const msc = qualifications[0];

const icons: Record<CampusCallout["id"], typeof GraduationCap> = {
  program: GraduationCap,
  accreditation: Star,
  location: MapPin,
  community: UsersThree,
};

const v = (vars: Record<string, string>) => vars as CSSProperties;

/** A note beside the campus photograph, joined to it by a curve that draws after the note appears. */
function Callout({ c, delay }: { c: CampusCallout; delay: number }) {
  const Icon = icons[c.id];
  return (
    <div
      className={cn(styles.callout, styles[c.id])}
      data-reveal
      style={v({ "--d": `${delay}ms`, "--dur": "600ms", "--ry": "16px", "--pd": "380ms", "--pdur": "650ms" })}
    >
      <div className={styles.calloutCard}>
        <span className={styles.calloutIcon}>
          <Icon size={22} weight="regular" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[0.78rem] leading-tight text-muted">{c.label}</p>
          <p className="mt-1 text-[1rem] font-semibold leading-snug tracking-[-0.012em] text-ink">{c.title}</p>
        </div>
      </div>
      <p className="mt-3 max-w-[17rem] pl-1 text-[0.86rem] leading-relaxed text-muted">{c.text}</p>
      <svg aria-hidden className={styles.connector} viewBox="0 0 96 64" fill="none">
        <path
          className="draw-path"
          pathLength={1}
          d={c.id === "program" || c.id === "location" ? "M2 10 C40 6 70 26 88 54" : "M2 46 C34 28 62 20 88 22"}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="88" cy={c.id === "program" || c.id === "location" ? 54 : 22} r="4" fill="currentColor" className={styles.dot} />
      </svg>
    </div>
  );
}

export function EducationSection() {
  return (
    <section id="education" data-header-theme="light" aria-labelledby="education-title" className="relative overflow-hidden bg-white">
      <div className="shell section-pad relative">
        <div className="flex items-center justify-between gap-6" data-reveal="fade" style={v({ "--d": "60ms" })}>
          <p className="type-label flex items-center gap-4 text-ink-2">
            Education
            <span aria-hidden className="hidden h-px w-40 bg-line sm:block" data-reveal="draw-x" style={v({ "--d": "260ms" })} />
          </p>
          <p className="type-label text-blue">[ Academic journey ]</p>
        </div>

        {/* label and headline: low-distance fade, Y +16px, 600-750ms */}
        <div className="mx-auto mt-12 max-w-[66rem] text-center">
          <p className="type-label text-muted" data-reveal style={v({ "--d": "120ms", "--ry": "16px" })}>
            {qualifications[0].school}
          </p>
          <h1
            id="education-title"
            data-section-heading
            className="reveal-lines mt-5 text-[clamp(2.4rem,1.1rem+4.3vw,5.1rem)] font-[640] leading-[0.98] tracking-[-0.045em]"
            data-reveal
            style={v({ "--d": "180ms", "--ly": "16px", "--ldur": "700ms" })}
          >
            <span className="line">
              <span style={v({ "--i": "0" })}>Training that keeps</span>
            </span>
            <span className="line">
              <span style={v({ "--i": "1" })}>
                the <span className="text-blue">flying legal and safe</span>.
              </span>
            </span>
          </h1>
          <p className="type-lead pretty mx-auto mt-6 max-w-[40rem] text-muted" data-reveal style={v({ "--d": "380ms", "--ry": "16px" })}>
            {educationCopy.intro}
          </p>
        </div>

        {/* the campus, framed by an arch, with its four notes and the programme facts */}
        <div className={styles.stage}>
          <figure className={styles.arch} data-reveal="scale" style={v({ "--d": "420ms", "--dur": "1000ms", "--pd": "520ms", "--pdur": "800ms" })}>
            <Image
              src={campusPhoto.src}
              alt={campusPhoto.alt}
              width={campusPhoto.width}
              height={campusPhoto.height}
              sizes="(min-width: 1024px) 60vw, 100vw"
              quality={85}
              className="relative block h-auto w-full select-none"
              draggable={false}
              priority
            />
            {/* the arch outline drawn over the photograph */}
            <svg aria-hidden className={styles.archLine} viewBox="0 0 806 426" preserveAspectRatio="none" fill="none">
              <path className="draw-path" pathLength={1} d="M-22 434 A418 418 0 0 1 814 434" />
            </svg>
          </figure>

          {campusCallouts.map((c, i) => (
            <Callout key={c.id} c={c} delay={760 + i * 110} />
          ))}

          <dl className={styles.bar} data-reveal="rise" style={v({ "--d": "1150ms" })}>
            {[
              { Icon: CalendarBlank, label: "Duration", value: `${msc.start} to ${msc.end}` },
              { Icon: Bank, label: "Training partner", value: "DGCA-approved school" },
              { Icon: BookOpen, label: "Program", value: "Remote Pilot Certificate" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blue-100/70 text-blue">
                  <f.Icon size={22} weight="regular" aria-hidden />
                </span>
                <div className="flex flex-col-reverse">
                  <dt className="text-[0.82rem] text-muted">{f.label}</dt>
                  <dd className="text-[1.15rem] font-semibold tracking-[-0.015em] text-ink">{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* qualifications timeline: title, then the rule draws, then each entry in turn */}
        <div className="mt-24 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className="type-subtitle text-ink" data-reveal style={v({ "--ry": "16px", "--dur": "550ms" })}>
              Qualifications
            </h2>
            <p className="pretty mt-4 max-w-[26rem] text-[0.98rem] leading-relaxed text-ink-2" data-reveal style={v({ "--d": "100ms", "--ry": "16px", "--dur": "550ms" })}>
              {educationCopy.narrative}
            </p>
            <div className="mt-8 max-w-[26rem]">
              <JourneyMap />
            </div>
          </div>
          <ol className="relative grid content-start gap-12 lg:col-span-8">
            <span
              aria-hidden
              className="absolute bottom-3 left-[0.4375rem] top-3 w-px bg-gradient-to-b from-blue to-blue/10"
              data-reveal="draw-y"
              style={v({ "--d": "150ms", "--dur": "650ms" })}
            />
            {qualifications.map((q, i) => (
              <li key={q.id} className="relative pl-10">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 size-3.5 rounded-full bg-blue shadow-[0_0_0_5px_#fff,0_0_0_6px_rgba(20,95,229,0.25)]"
                  data-reveal="scale"
                  style={v({ "--d": `${450 + i * 100}ms`, "--rs": "0.4", "--dur": "450ms" })}
                />
                <div data-reveal style={v({ "--d": `${500 + i * 100}ms`, "--ry": "18px", "--dur": "550ms" })}>
                  <p className="text-[0.95rem] font-semibold text-blue">
                    {q.start} <span aria-hidden className="mx-1.5 inline-block h-px w-3 translate-y-[-0.3em] bg-blue/60" />
                    <span className="sr-only">to</span> {q.end}
                    {q.status ? <span className="ml-3 rounded-full bg-blue-100 px-2.5 py-0.5 text-[0.72rem] text-navy">{q.status}</span> : null}
                  </p>
                  <h3 className="mt-2 text-[1.35rem] font-[640] leading-snug tracking-[-0.02em] text-ink">{q.degree}</h3>
                  <p className="mt-1 text-[0.95rem] text-ink-2">
                    {q.school}
                    {q.schoolNote ? ` (${q.schoolNote})` : ""}, {q.location}
                    {q.accreditation ? `. ${q.accreditation.join(" & ")} accredited.` : ""}
                  </p>
                </div>

                {q.modules ? (
                  <div className="mt-5" data-reveal style={v({ "--d": "750ms", "--ry": "18px", "--dur": "550ms" })}>
                    <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">Modules</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {q.modules.map((m) => (
                        <li key={m} className="tag">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {q.thesis ? (
                  <figure className="mt-6 rounded-[16px] border border-line bg-mist p-5 sm:p-6" data-reveal style={v({ "--d": "860ms", "--ry": "18px", "--dur": "550ms" })}>
                    <Quotes size={22} weight="fill" className="text-blue" aria-hidden />
                    <blockquote className="mt-3 text-[1.15rem] font-[560] leading-snug tracking-[-0.015em] text-ink">{q.thesis}</blockquote>
                    <figcaption className="mt-3 text-[0.82rem] text-muted">Master&apos;s thesis</figcaption>
                  </figure>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
