import type { CSSProperties } from "react";
import { ArrowDownRight } from "@phosphor-icons/react/dist/ssr/ArrowDownRight";
import { projects } from "@/content/projects";
import { ProjectsScene } from "./ProjectsScene";
import { FilteredProjects, ProjectFilterProvider, ProjectFilterRow } from "./ProjectsFilter";
import styles from "./projects.module.css";

const v = (vars: Record<string, string>) => vars as CSSProperties;

/** Numbers from the case studies themselves, in place of portfolio-wide totals. */
const verified = [
  { value: String(projects.length), label: "Projects documented", source: "Each with its own case study" },
  { value: "500+", label: "Flights logged", source: "Behind a written pre-flight routine" },
  { value: "12+", label: "Sites mapped on a repeat cycle", source: "Mapping & inspection" },
  { value: "8", label: "Fixed viewpoints per site visit", source: "Site documentation" },
];

/*
 * Motion: the navy scene first, then the title fades in, then the accent statement and copy,
 * and the numbers last with a staggered rise. Text stays still once revealed.
 */
export function ProjectsLanding() {
  return (
    <ProjectFilterProvider>
      <section
        id="projects"
        data-header-theme="dark"
        data-surface="dark"
        aria-labelledby="projects-title"
        className="relative isolate overflow-hidden bg-[#0e1f3b] text-white"
      >
        <div className="relative h-[62svh] min-h-[24rem] lg:absolute lg:inset-0 lg:h-auto lg:min-h-0">
          <ProjectsScene />
        </div>

        {/* laid out on the reference's lines: title top right, filters beneath it, the statement
            beside the grid, numbers bottom right; the disc and the headline sit
            over the clouds on the left */}
        <div className={`shell relative ${styles.heroGrid}`}>
          <div className={styles.aTitle}>
            <p className="type-label dm-0 text-white/65" data-reveal="fade" style={v({ "--d": "1500ms" })}>
              Selected work
            </p>
            <h1
              id="projects-title"
              data-section-heading
              className={`${styles.bigTitle} dm-1 mt-3`}
              data-reveal
              style={v({ "--d": "1600ms", "--dur": "750ms", "--ry": "20px" })}
            >
              Projects
            </h1>
          </div>

          <div className={`${styles.aFilters} dm-2`} data-reveal="fade" style={v({ "--d": "1800ms" })}>
            <ProjectFilterRow revealCards />
          </div>

          <a
            href="#case-studies"
            className={`${styles.scrollBtn} ${styles.aDisc}`}
            aria-label="Jump to the case studies"
            data-reveal="scale"
            style={v({ "--d": "1700ms", "--dur": "600ms" })}
          >
            <ArrowDownRight size={30} weight="bold" aria-hidden />
          </a>

          <div className={styles.aCopy}>
            <p className={`${styles.accent} dm-2`} data-reveal style={v({ "--d": "1900ms" })}>
              Shot from the air, finished in the studio
            </p>
            <p className="type-body pretty dm-3 mt-4 text-[0.95rem] text-white/80" data-reveal style={v({ "--d": "2000ms" })}>
              A collection of work covering aerial film, stills, mapping and the studio&apos;s own kit system. Each project
              has its own page, with the approach, the gear, a working demonstration and clearly labelled figures.
            </p>
          </div>

          <p className={`${styles.impact} ${styles.aImpact} dm-0`} data-reveal style={v({ "--d": "1750ms", "--dur": "700ms" })}>
            From the air
            <br />
            to the edit
          </p>

          <div className={`${styles.aCrumb} dm-1`} data-reveal="fade" style={v({ "--d": "1900ms" })}>
            <span aria-hidden className="dm-1 block h-px w-full max-w-[28rem] bg-white/40" data-reveal="draw-x" style={v({ "--d": "1950ms" })} />
            <p className="type-label mt-4 text-[0.7rem] tracking-[0.2em] text-white/85">
              Fly <span aria-hidden className="mx-2 text-white/45">/</span> Frame{" "}
              <span aria-hidden className="mx-2 text-white/45">/</span> Grade{" "}
              <span aria-hidden className="mx-2 text-white/45">/</span> Deliver
            </p>
          </div>

          <dl className={`${styles.aMetrics} grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/15`}>
            {verified.map((m, i) => (
              <div
                key={m.label}
                className={`flex flex-col-reverse justify-end sm:px-5 sm:first:pl-0 dm-${i}`}
                data-reveal="rise"
                style={v({ "--d": `${2150 + i * 100}ms`, "--dur": "600ms" })}
              >
                <dt className="mt-2 text-[0.78rem] leading-snug text-white/75">
                  {m.label}
                  <span className="block text-white/45">{m.source}</span>
                </dt>
                <dd className="text-[clamp(1.6rem,1rem+1.1vw,2.2rem)] font-[760] leading-none tracking-[-0.045em]">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* the case studies, filterable */}
      <section
        id="case-studies"
        aria-labelledby="case-studies-title"
        data-header-theme="light"
        className="relative scroll-mt-20 bg-white pb-24 text-ink sm:pb-28"
      >
        <div className="shell">
          <div className="flex flex-col gap-6 pt-16 sm:pt-20">
            <div>
              <p className="type-label text-muted" data-reveal="fade">
                Case studies
              </p>
              <h2 id="case-studies-title" data-section-heading className="type-title mt-3" data-reveal style={v({ "--d": "80ms" })}>
                Four projects, one page each.
              </h2>
            </div>
            <div data-reveal="fade" style={v({ "--d": "160ms" })}>
              <ProjectFilterRow tone="light" />
            </div>
          </div>
          <div className="mt-10">
            <FilteredProjects />
          </div>
        </div>
      </section>
    </ProjectFilterProvider>
  );
}
