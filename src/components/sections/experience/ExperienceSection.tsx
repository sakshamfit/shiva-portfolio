import Image from "next/image";
import type { CSSProperties } from "react";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { Database } from "@phosphor-icons/react/dist/ssr/Database";
import { ChartBar } from "@phosphor-icons/react/dist/ssr/ChartBar";
import { Users } from "@phosphor-icons/react/dist/ssr/Users";
import { Funnel } from "@phosphor-icons/react/dist/ssr/Funnel";
import { ListChecks } from "@phosphor-icons/react/dist/ssr/ListChecks";
import { Gear } from "@phosphor-icons/react/dist/ssr/Gear";
import { Presentation } from "@phosphor-icons/react/dist/ssr/Presentation";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { experience, type Kpi, type Role } from "@/content/experience";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";
import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/utils";
import styles from "./experience.module.css";

const kpiIcons = {
  clock: Clock,
  database: Database,
  chart: ChartBar,
  users: Users,
  funnel: Funnel,
  list: ListChecks,
  gear: Gear,
  presentation: Presentation,
} as const;

const v = (vars: Record<string, string>) => vars as CSSProperties;

function KpiTile({ kpi, delay }: { kpi: Kpi; delay: number }) {
  const Icon = kpiIcons[kpi.icon];
  return (
    <div data-reveal="rise" style={v({ "--d": `${delay}ms`, "--dur": "600ms" })}>
      <div className={cn(styles.kpi, "h-full")}>
        <Icon size={22} weight="light" className="text-blue" aria-hidden />
        <p className="mt-3 text-[1.7rem] font-[640] leading-none tracking-[-0.035em] text-navy">
          <CountUp
            value={kpi.value}
            prefix={kpi.prefix}
            suffix={kpi.suffix}
            group={kpi.group}
            delay={delay / 1000 + 0.15}
            mobileDelay={Math.min(delay * 0.3, 360) / 1000 + 0.15}
          />
        </p>
        <p className="mt-2 text-[0.8125rem] leading-snug text-muted">{kpi.label}</p>
      </div>
    </div>
  );
}

function CompanyLogo({ role }: { role: Role }) {
  return (
    <span className="grid h-[3.75rem] w-[5.75rem] shrink-0 place-items-center rounded-[14px] border border-line bg-white px-2.5 py-2 shadow-[var(--shadow-soft)]">
      <Image
        src={role.logo.src}
        alt={`${role.company} logo`}
        width={role.logo.width}
        height={role.logo.height}
        sizes="92px"
        quality={90}
        className="h-full w-auto max-w-full object-contain"
      />
    </span>
  );
}

function RoleEntry({ role, last }: { role: Role; last: boolean }) {
  return (
    <li className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-2 lg:pt-0.5" data-reveal="fade" style={v({ "--d": "150ms", "--dur": "550ms" })}>
        <p className="text-[1.05rem] font-[640] tracking-[-0.02em] text-blue">
          <time dateTime={role.startISO}>{role.start}</time>
          <span aria-hidden className="mx-2 inline-block h-px w-3 translate-y-[-0.3em] bg-blue/60" />
          <span className="sr-only"> to </span>
          <time dateTime={role.endISO}>{role.end}</time>
        </p>
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.875rem] text-muted">
          <MapPin size={14} aria-hidden />
          {role.location}
        </p>
      </div>

      <div className={cn(styles.entryTrack, last && styles.entryLast, "lg:col-span-6")}>
        <span aria-hidden className={styles.entryRule} data-reveal="draw-y" style={v({ "--d": "0ms", "--dur": "650ms" })} />
        <span aria-hidden className={styles.dot} />
        <div className="flex items-center gap-4" data-reveal="fade" style={v({ "--d": "250ms", "--dur": "550ms" })}>
          <CompanyLogo role={role} />
          <div>
            <h2 className="text-[1.45rem] font-[640] leading-tight tracking-[-0.025em] text-ink">{role.company}</h2>
            <p className="mt-0.5 text-[1.02rem] font-medium text-blue">{role.role}</p>
          </div>
        </div>
        <p className="mt-4 text-[0.95rem] text-ink-2" data-reveal style={v({ "--d": "360ms", "--ry": "18px" })}>
          {role.context}
        </p>
        <ul className="mt-5 grid gap-3.5">
          {role.achievements.map((a, i) => (
            <li
              key={i}
              className="relative pl-5 text-[0.96rem] leading-relaxed text-ink-2"
              data-reveal
              style={v({ "--d": `${460 + i * 140}ms`, "--ry": "18px", "--dur": "600ms" })}
            >
              <span aria-hidden className="absolute left-0 top-[0.62em] size-1.5 rounded-full bg-blue" />
              {a}
            </li>
          ))}
        </ul>
        <p
          className="mt-6 border-l-2 border-blue/70 pl-4 text-[0.92rem] leading-relaxed text-ink"
          data-reveal
          style={v({ "--d": "900ms", "--ry": "18px" })}
        >
          <span className="font-semibold">Accomplishment. </span>
          {role.accomplishment}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Tools used at ${role.company}`} data-reveal style={v({ "--d": "980ms", "--ry": "18px" })}>
          {role.tools.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 self-start lg:col-span-4 lg:pl-2">
        {role.kpis.map((k, i) => (
          <KpiTile key={k.label} kpi={k} delay={1060 + i * 100} />
        ))}
      </div>
    </li>
  );
}

export function ExperienceSection() {
  return (
    <section
      id="experience"
     
      data-header-theme="light"
      aria-labelledby="experience-intro-title"
      className="relative overflow-hidden bg-white"
    >
      {/* the timeline opens with the reference's "From data to impact" row */}
      <div className="shell pt-[clamp(4.5rem,9vw,7.5rem)]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="type-label text-muted" data-reveal="right" style={v({ "--dur": "600ms" })}>
              Professional experience
            </p>
            <h2
              id="experience-intro-title"
              className="type-display reveal-lines mt-5"
              data-reveal
              style={v({ "--d": "80ms", "--lx": "24px", "--ly": "0px", "--ldur": "700ms" })}
            >
              <span className="line">
                <span style={{ ["--i" as string]: 0 }}>
                  From the air <span className="text-blue">to the edit.</span>
                </span>
              </span>
            </h2>
          </div>
          <p className="type-lead pretty max-w-[32rem] text-ink-2 lg:col-span-5" data-reveal="right" style={v({ "--d": "220ms", "--dur": "650ms" })}>
            Five years of flying and shooting: commissions delivered solo, and three seasons on a camera counter
            learning the gear from the inside.
          </p>
        </div>
      </div>

      <div className="shell pb-[var(--section-y)]">

        {/* timeline */}
        <div className="mt-16 lg:mt-20">
          <ol id="roles" className="grid scroll-mt-28 gap-[4.5rem]" aria-label="Roles, in chronological order">
            {experience.map((role, i) => (
              <RoleEntry key={role.id} role={role} last={i === experience.length - 1} />
            ))}
          </ol>
        </div>

        {/* key projects, as in the Experience reference */}
        <div className="mt-28 border-t border-line pt-16 lg:mt-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p className="type-label text-muted" data-reveal="fade">
                Key projects
              </p>
              <h2 className="type-title reveal-lines mt-4" data-reveal style={v({ "--d": "80ms" })}>
                <span className="line">
                  <span style={v({ "--i": "0" })}>
                    Real work. <span className="text-blue">Delivered.</span>
                  </span>
                </span>
              </h2>
            </div>
            <p className="type-body pretty max-w-[30rem] text-ink-2 lg:col-span-5" data-reveal style={v({ "--d": "200ms" })}>
            Four case studies covering aerial film, mapping flights, the studio&apos;s own kit system and monthly site
            documentation. Every figure is labelled as delivered, planned or demonstration data.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-2" aria-label="Key projects">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} delay={260 + i * 80} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
