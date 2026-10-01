import Image from "next/image";
import { Aperture } from "@phosphor-icons/react/dist/ssr/Aperture";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { Target } from "@phosphor-icons/react/dist/ssr/Target";
import { MapTrifold } from "@phosphor-icons/react/dist/ssr/MapTrifold";
import { projectBySlug } from "@/content/projects";
import { simulation } from "@/content/demo/flight-risk";
import { GearControlDashboard } from "@/components/dashboards/GearControlDashboard";
import { FlightRiskConsole } from "@/components/dashboards/FlightRiskConsole";
import { KitPlanningLab } from "@/components/dashboards/KitPlanningLab";
import { KitCoverageView } from "@/components/dashboards/KitCoverageView";
import { BriefBlock, CaseLabel, CaseNav, ResultCard, ToolTags } from "./case-parts";

/* ---------------------------------------------------------------------------
   01  Aerial films: light, product-showcase layout
   ------------------------------------------------------------------------- */
export function CaseAerialFilms() {
  const p = projectBySlug["aerial-films"];
  return (
    <article
      id="case-aerial-films"
      aria-labelledby="case-aerial-films-title"
      data-header-theme="light"
      className="relative bg-white"
    >
      <div className="shell section-pad">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <CaseLabel project={p} />
            <h1 id="case-aerial-films-title" data-section-heading className="type-title balance mt-5 text-ink" data-reveal style={{ ["--d" as string]: "80ms" }}>
              {p.title}
            </h1>
            <p className="type-lead pretty mt-5 max-w-[40rem] text-ink-2" data-reveal style={{ ["--d" as string]: "160ms" }}>
              {p.oneLiner}
            </p>
          </div>
          <aside className="grid content-start gap-6 lg:col-span-4 lg:col-start-9 lg:pt-12" aria-label="Project facts">
            <div data-reveal style={{ ["--d" as string]: "200ms" }}>
              <p className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">Shot with</p>
              <ToolTags tools={p.tools} label="Tools" />
            </div>
            <div data-reveal style={{ ["--d" as string]: "260ms" }}>
              <p className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">Capabilities shown</p>
              <p className="text-[0.95rem] leading-relaxed text-ink-2">{p.capabilities.join(", ")}.</p>
            </div>
          </aside>
        </div>

        <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8">
          <div className="grid content-start gap-10 lg:col-span-5">
            <BriefBlock title="The problem">{p.challenge}</BriefBlock>
            <BriefBlock title="The objective" delay={80}>
              {p.objective}
            </BriefBlock>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted" data-reveal>
              How a shoot is run
            </h2>
            <ol className="mt-3 grid gap-5">
              {p.approach.map((a, i) => (
                <li key={a.title} className="grid grid-cols-[2.25rem_1fr] gap-4" data-reveal style={{ ["--d" as string]: `${120 + i * 90}ms` }}>
                  <span className="num grid size-9 place-items-center rounded-full border border-line text-[0.78rem] font-semibold text-navy">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[1.02rem] font-semibold text-ink">{a.title}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">{a.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-16" data-reveal="rise">
          <GearControlDashboard />
          <p className="mt-3 text-[0.8rem] text-muted">
            Rebuilt as a working interface to show how the kit logs, the numbers and the alerts fit together. Partner
            names and alert texts are demonstration data, not results from the studio.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {p.results.map((r, i) => (
              <ResultCard key={r.label} result={r} delay={i * 90} />
            ))}
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-2" data-reveal style={{ ["--d" as string]: "240ms" }}>
            <BriefBlock title="Why it matters">{p.relevance}</BriefBlock>
          </div>
        </div>

        <CaseNav next={{ href: "/projects/aerial-mapping", label: projectBySlug["aerial-mapping"].shortTitle }} />
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------------
   02  Mapping & inspection: dark split layout with a sticky narrative
   ------------------------------------------------------------------------- */
export function CaseMapping() {
  const p = projectBySlug["aerial-mapping"];
  const [sites, passes] = p.results;
  return (
    <article
      id="case-aerial-mapping"
      aria-labelledby="case-aerial-mapping-title"
      data-header-theme="light"
      className="relative overflow-hidden bg-white text-ink"
    >
      <div className="shell section-pad relative">
        <div className="max-w-[54rem]">
          <CaseLabel project={p} />
          <h1 id="case-aerial-mapping-title" data-section-heading className="type-title balance mt-5 text-ink" data-reveal style={{ ["--d" as string]: "80ms" }}>
            {p.title}
          </h1>
          <p className="type-lead pretty mt-5 text-ink-2" data-reveal style={{ ["--d" as string]: "160ms" }}>
            {p.oneLiner}
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="grid gap-9 lg:sticky lg:top-24">
              <BriefBlock title="The problem">{p.challenge}</BriefBlock>
              <BriefBlock title="The objective" delay={80}>
                {p.objective}
              </BriefBlock>
              <div data-reveal style={{ ["--d" as string]: "140ms" }}>
                <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">How the grid is flown</h2>
                <ol className="mt-4 grid gap-4">
                  {p.approach.map((a, i) => {
                    const Icon = [MapTrifold, Aperture, CalendarBlank][i];
                    return (
                      <li key={a.title} className="grid grid-cols-[2.25rem_1fr] gap-3.5">
                        <span className="grid size-9 place-items-center rounded-full border border-line text-navy">
                          <Icon size={17} weight="light" aria-hidden />
                        </span>
                        <div>
                          <p className="text-[0.98rem] font-semibold text-ink">{a.title}</p>
                          <p className="mt-1 text-[0.9rem] leading-relaxed text-ink-2">{a.text}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div data-reveal style={{ ["--d" as string]: "200ms" }}>
                <p className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">Flown with</p>
                <ToolTags tools={p.tools} label="Tools" />
              </div>
            </div>
          </div>

          <div className="grid content-start gap-6 lg:col-span-8">
            <div data-reveal="rise">
              <FlightRiskConsole />
              <p className="mt-3 text-[0.8rem] text-muted">
                A working reconstruction of how a flight window is judged. Sites, dates and probabilities are
                demonstration data.
              </p>
            </div>

            {/* what the numbers claim, stated precisely */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-4">
                <ResultCard result={sites} />
                <ResultCard result={passes} delay={80} />
              </div>
              <div className="flex flex-col rounded-[16px] border border-line bg-white p-5" data-reveal style={{ ["--d" as string]: "160ms" }}>
                <span className="self-start rounded-full bg-[#fff3dd] px-2.5 py-1 text-[0.7rem] font-semibold text-[#8a5a00]">
                  Demonstration figure
                </span>
                <p className="mt-4 text-[2.4rem] font-[660] leading-none tracking-[-0.045em] text-navy">48h</p>
                <p className="mt-2 text-[0.95rem] font-medium text-ink">Graded stills after each visit</p>
                <figure className="mt-5">
                  <figcaption className="sr-only">
                    Missed flight windows, indexed: baseline {simulation.baseline}, with the flight plan holding them
                    down to {simulation.withModel}.
                  </figcaption>
                  {[
                    { label: "Windows lost, ad-hoc", value: simulation.baseline, color: "#c7d3e3" },
                    { label: "With the flight plan", value: simulation.withModel, color: "#145fe5" },
                  ].map((b) => (
                    <div key={b.label} className="mt-3" aria-hidden>
                      <div className="flex justify-between text-[0.78rem] text-ink-2">
                        <span>{b.label}</span>
                        <span className="num font-semibold text-ink">{b.value}</span>
                      </div>
                      <div className="mt-1.5 h-2.5">
                        <div className="h-full rounded-r-[4px]" style={{ width: `${b.value}%`, background: b.color }} />
                      </div>
                    </div>
                  ))}
                  <p className="mt-3 text-[0.74rem] text-muted">Missed windows, indexed to the baseline (= 100)</p>
                </figure>
                <p className="mt-4 border-t border-line pt-3 text-[0.8rem] leading-relaxed text-muted">
                  Weather, wind and permits decide whether a site can be flown at all: two or three backup windows are
                  held for every site visit.
                </p>
              </div>
            </div>

            <div data-reveal>
              <BriefBlock title="Why it matters">{p.relevance}</BriefBlock>
            </div>
          </div>
        </div>

        <CaseNav
          prev={{ href: "/projects/aerial-films", label: projectBySlug["aerial-films"].shortTitle }}
          next={{ href: "/projects/kit-management", label: projectBySlug["kit-management"].shortTitle }}
        />
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------------
   03  Kit management: interactive planning lab
   ------------------------------------------------------------------------- */
export function CaseKitManagement() {
  const p = projectBySlug["kit-management"];
  const [items, notice] = p.results;
  return (
    <article
      id="case-kit-management"
      aria-labelledby="case-kit-title"
      data-header-theme="light"
      className="relative bg-white"
    >
      <div className="shell section-pad">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <CaseLabel project={p} />
            <h1 id="case-kit-title" data-section-heading className="type-title balance mt-5 text-ink" data-reveal style={{ ["--d" as string]: "80ms" }}>
              {p.title}
            </h1>
            <p className="type-lead pretty mt-5 max-w-[40rem] text-ink-2" data-reveal style={{ ["--d" as string]: "160ms" }}>
              {p.oneLiner}
            </p>
            <div className="mt-8" data-reveal style={{ ["--d" as string]: "220ms" }}>
              <ToolTags tools={p.tools} label="Tools" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:pt-10">
            <ResultCard result={items} delay={120} />
            <ResultCard result={notice} delay={200} />
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8">
          <div className="grid content-start gap-8 lg:col-span-4">
            <BriefBlock title="The problem">{p.challenge}</BriefBlock>
            <BriefBlock title="The objective" delay={80}>
              {p.objective}
            </BriefBlock>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted" data-reveal>
              How the system is built
            </h2>
            <ol className="mt-5 grid gap-px overflow-hidden rounded-[16px] border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
              {p.approach.map((a, i) => (
                // the white cell stays put (its 1px gaps are the dividers); only its content fades in
                <li key={a.title} className="bg-white p-5">
                  <div data-reveal style={{ ["--d" as string]: `${100 + i * 90}ms` }}>
                    <span className="num text-[0.8rem] font-semibold text-blue">Step {i + 1}</span>
                    <p className="mt-2 text-[1rem] font-semibold text-ink">{a.title}</p>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-2">{a.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-16" data-reveal="rise">
          <h2 className="mb-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">Try the trade-offs</h2>
          <p className="mb-5 max-w-[46rem] text-[0.95rem] leading-relaxed text-ink-2">
            The same order-point logic the kit log uses, with example numbers: change how much gear is used in a year,
            what it costs to store or to order, the supplier lead time or the readiness you want, and watch the order
            quantity, spare stock and reorder point respond.
          </p>
          <KitPlanningLab />
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4" data-reveal>
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">How the year is watched</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">
              An order point only helps if the workload it has to cover is visible. This representative view shows the
              signals that keep it honest: shoot days by base, jobs by work type, and the packs drawn each month
              against the days booked.
            </p>
            <div className="mt-8 flex gap-3 rounded-[16px] border border-line bg-white p-5">
              <Target size={24} weight="light" className="shrink-0 text-blue" aria-hidden />
              <div>
                <p className="text-[0.95rem] font-semibold text-ink">Why it matters</p>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-2">{p.relevance}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8" data-reveal="rise">
            <KitCoverageView />
          </div>
        </div>

        <CaseNav
          prev={{ href: "/projects/aerial-mapping", label: projectBySlug["aerial-mapping"].shortTitle }}
          next={{ href: "/projects/progress-documentation", label: projectBySlug["progress-documentation"].shortTitle }}
        />
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------------
   04  Progress documentation: the delivered sheet itself
   ------------------------------------------------------------------------- */
const documentationViews = [
  {
    title: "Fixed viewpoints",
    question: "Is this month's frame the same as last month's?",
    detail: "Eight saved waypoints and markers on the site, so every visit lines up with the last.",
  },
  {
    title: "Build progress",
    question: "How far along is the structure, and what changed this month?",
    detail: "Foundation to hand-over, dated and filed so the change reads at a glance.",
  },
  {
    title: "Site and access",
    question: "What do the boundary, the access roads and the material storage look like now?",
    detail: "The whole site in one pass, not just the building.",
  },
  {
    title: "Earthworks and levels",
    question: "How is the ground changing?",
    detail: "Cut and fill areas documented before they are covered up by the next stage.",
  },
  {
    title: "Safety observations",
    question: "What would a fresh pair of eyes flag from the air?",
    detail: "Open edges, uncovered openings and storage that has crept into a walkway.",
  },
  {
    title: "The investor pack",
    question: "What goes in front of buyers and investors this quarter?",
    detail: "A dated gallery, a one-minute progress film and the month-on-month overlays.",
  },
];

export function CaseProgressDocumentation() {
  const p = projectBySlug["progress-documentation"];
  return (
    <article id="case-progress-documentation" aria-labelledby="case-progress-title" data-header-theme="light" className="relative bg-white">
      <div className="shell section-pad">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <CaseLabel project={p} />
            <h1 id="case-progress-title" data-section-heading className="type-title balance mt-5 text-ink" data-reveal style={{ ["--d" as string]: "80ms" }}>
              {p.title}
            </h1>
            <p className="type-lead pretty mt-5 max-w-[40rem] text-ink-2" data-reveal style={{ ["--d" as string]: "160ms" }}>
              {p.oneLiner}
            </p>
          </div>
          <aside className="grid content-start gap-6 lg:col-span-4 lg:col-start-9 lg:pt-12" aria-label="Project facts">
            <div data-reveal style={{ ["--d" as string]: "200ms" }}>
              <p className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">Shot with</p>
              <ToolTags tools={p.tools} label="Tools" />
            </div>
            <div data-reveal style={{ ["--d" as string]: "280ms" }}>
              <p className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">Capabilities shown</p>
              <p className="text-[0.95rem] leading-relaxed text-ink-2">{p.capabilities.join(", ")}.</p>
            </div>
          </aside>
        </div>

        {/* the delivered sheet itself */}
        <figure className="mt-14" data-reveal="rise" style={{ ["--d" as string]: "240ms" }}>
          <div className="overflow-hidden rounded-[18px] border border-line bg-[#101828] shadow-[var(--shadow-float)]">
            <Image
              src="/images/projects/site-grid.jpg"
              alt="Aerial documentation sheet for a construction site: a stitched overhead view of the site with eight fixed viewpoints marked, dated panels of the same viewpoints from previous months, and measured areas for the boundary, access, storage and earthworks."
              width={2358}
              height={1328}
              sizes="(min-width: 1408px) 1312px, 94vw"
              quality={90}
              className="block h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 text-[0.8rem] text-muted">
            <span>A documentation sheet as delivered. Site and dates are sample data.</span>
            <a
              href="/images/projects/site-grid.jpg"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-1.5 font-medium text-blue hover:text-blue-700"
            >
              Open full size
              <ArrowSquareOut size={15} aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </figcaption>
        </figure>

        <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8">
          <div className="grid content-start gap-10 lg:col-span-5">
            <BriefBlock title="The problem">{p.challenge}</BriefBlock>
            <BriefBlock title="The objective" delay={80}>
              {p.objective}
            </BriefBlock>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted" data-reveal>
              How the set is built
            </h2>
            <ol className="mt-3 grid gap-5">
              {p.approach.map((a, i) => (
                <li key={a.title} className="grid grid-cols-[2.25rem_1fr] gap-4" data-reveal style={{ ["--d" as string]: `${120 + i * 80}ms` }}>
                  <span className="num grid size-9 place-items-center rounded-full border border-line text-[0.78rem] font-semibold text-navy">{i + 1}</span>
                  <div>
                    <p className="text-[1.02rem] font-semibold text-ink">{a.title}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">{a.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink" data-reveal>
            What each view answers
          </h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-[16px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {documentationViews.map((dv, i) => (
              <li key={dv.title} className="bg-white p-5">
                <div data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
                  <p className="text-[1rem] font-semibold text-ink">{dv.title}</p>
                  <p className="mt-2 text-[0.92rem] font-medium leading-snug text-blue">{dv.question}</p>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-2">{dv.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="rounded-[16px] border border-line bg-mist p-5 lg:col-span-7" data-reveal>
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">Results</p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">
              A documentation service: the value is in the comparison month to month, and in how quickly a developer can
              answer a question from an investor, so no outcome figures are claimed for it.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-2" data-reveal style={{ ["--d" as string]: "120ms" }}>
            <BriefBlock title="Why it matters">{p.relevance}</BriefBlock>
          </div>
        </div>

        <CaseNav prev={{ href: "/projects/kit-management", label: projectBySlug["kit-management"].shortTitle }} />
      </div>
    </article>
  );
}

/** Case study page bodies, keyed by project slug. */
export const caseStudyBySlug = {
  "aerial-films": CaseAerialFilms,
  "aerial-mapping": CaseMapping,
  "kit-management": CaseKitManagement,
  "progress-documentation": CaseProgressDocumentation,
} as const;
