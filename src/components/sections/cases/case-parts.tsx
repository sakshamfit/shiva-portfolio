import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { resultKindLabel, type Project, type ProjectResult } from "@/content/projects";
import { cn } from "@/lib/utils";

type Surface = "light" | "dark";

export function CaseLabel({ project, surface = "light" }: { project: Project; surface?: Surface }) {
  return (
    <p
      className={cn("type-label flex items-center gap-3", surface === "dark" ? "text-white/60" : "text-muted")}
      data-reveal
    >
      <span className={cn("num", surface === "dark" ? "text-white" : "text-navy")}>{project.index}</span>
      <span aria-hidden className={cn("h-px w-8", surface === "dark" ? "bg-white/30" : "bg-line")} />
      Case study
    </p>
  );
}

export function ToolTags({ tools, surface = "light", label }: { tools: string[]; surface?: Surface; label: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {tools.map((t) => (
        <li
          key={t}
          className={cn(
            "tag",
            surface === "dark" && "!border-white/15 !bg-white/[0.06] !text-white/85",
          )}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

const kindStyle: Record<ProjectResult["kind"], { light: string; dark: string }> = {
  delivered: { light: "bg-blue-100 text-navy", dark: "bg-white/10 text-white" },
  model: { light: "bg-[#e6f6f7] text-[#0b6e77]", dark: "bg-[#1aa7b4]/15 text-[#8fe3ea]" },
  simulated: { light: "bg-[#fff3dd] text-[#8a5a00]", dark: "bg-[#c98500]/20 text-[#ffd08a]" },
  modelled: { light: "bg-violet-100 text-[#3f32a8]", dark: "bg-[#5b4bd6]/25 text-[#cfc8ff]" },
};

export function ResultCard({ result, surface = "light", delay = 0 }: { result: ProjectResult; surface?: Surface; delay?: number }) {
  const dark = surface === "dark";
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-[16px] border p-5",
        dark ? "border-white/12 bg-white/[0.04]" : "border-line bg-white",
      )}
      data-reveal
      style={{ ["--d" as string]: `${delay}ms` }}
    >
      <span
        className={cn(
          "self-start rounded-full px-2.5 py-1 text-[0.7rem] font-semibold",
          dark ? kindStyle[result.kind].dark : kindStyle[result.kind].light,
        )}
      >
        {resultKindLabel[result.kind]}
      </span>
      <p className={cn("mt-4 text-[2.4rem] font-[660] leading-none tracking-[-0.045em]", dark ? "text-white" : "text-navy")}>
        {result.value}
      </p>
      <p className={cn("mt-2 text-[0.95rem] font-medium", dark ? "text-white" : "text-ink")}>{result.label}</p>
      {result.note ? (
        <p className={cn("mt-3 border-t pt-3 text-[0.8rem] leading-relaxed", dark ? "border-white/10 text-white/60" : "border-line text-muted")}>
          {result.note}
        </p>
      ) : null}
    </div>
  );
}

export function BriefBlock({
  title,
  children,
  surface = "light",
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  surface?: Surface;
  delay?: number;
}) {
  return (
    <div data-reveal style={{ ["--d" as string]: `${delay}ms` }}>
      <h2 className={cn("text-[0.8rem] font-semibold uppercase tracking-[0.14em]", surface === "dark" ? "text-white/55" : "text-muted")}>
        {title}
      </h2>
      <div className={cn("mt-3 text-[1rem] leading-relaxed", surface === "dark" ? "text-white/85" : "text-ink-2")}>{children}</div>
    </div>
  );
}

export function CaseNav({
  prev,
  next,
  surface = "light",
}: {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
  surface?: Surface;
}) {
  const dark = surface === "dark";
  const muted = dark ? "text-white/50" : "text-muted";
  const circle = cn(
    "grid size-11 shrink-0 place-items-center rounded-full border transition-colors",
    dark
      ? "border-white/25 group-hover:bg-white group-hover:text-navy-950"
      : "border-line group-hover:border-blue group-hover:bg-blue group-hover:text-white",
  );
  return (
    <nav
      aria-label="Case study navigation"
      className={cn("mt-16 grid gap-6 border-t pt-8 sm:grid-cols-3 sm:items-center", dark ? "border-white/12" : "border-line")}
    >
      <div>
        {prev ? (
          <TransitionLink href={prev.href} className={cn("group inline-flex items-center gap-3 text-[0.95rem] font-semibold", dark ? "text-white" : "text-ink hover:text-blue")}>
            <span className={circle}>
              <ArrowLeft size={16} aria-hidden />
            </span>
            <span>
              <span className={cn("block text-[0.72rem] font-medium uppercase tracking-[0.14em]", muted)}>Previous</span>
              {prev.label}
            </span>
          </TransitionLink>
        ) : null}
      </div>
      <div className="sm:text-center">
        <TransitionLink
          href="/projects"
          className={cn("inline-flex min-h-11 items-center gap-2 text-[0.9rem] font-medium", dark ? "text-white/75 hover:text-white" : "text-ink-2 hover:text-blue")}
        >
          All projects
        </TransitionLink>
      </div>
      <div className="sm:text-right">
        {next ? (
          <TransitionLink href={next.href} className={cn("group inline-flex items-center gap-3 text-[0.95rem] font-semibold sm:flex-row-reverse", dark ? "text-white" : "text-ink hover:text-blue")}>
            <span className={circle}>
              <ArrowRight size={16} aria-hidden />
            </span>
            <span>
              <span className={cn("block text-[0.72rem] font-medium uppercase tracking-[0.14em]", muted)}>Next</span>
              {next.label}
            </span>
          </TransitionLink>
        ) : null}
      </div>
    </nav>
  );
}
