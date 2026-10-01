import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { TransitionLink } from "@/components/layout/TransitionLink";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * Project card from the "Real projects. Real results." reference: the project visual,
 * title, tool tags and a one-sentence result, linking to the case study.
 * Hover (160-250ms): a small lift, a stronger border and a soft shadow.
 */
export function ProjectCard({
  project,
  delay = 0,
  surface = "light",
  className,
}: {
  project: Project;
  delay?: number;
  surface?: "light" | "dark";
  className?: string;
}) {
  const dark = surface === "dark";
  return (
    <li className={cn("h-full", className)} data-reveal="rise" style={{ "--d": `${delay}ms`, "--dur": "650ms" } as CSSProperties}>
      <TransitionLink
        href={`/projects/${project.slug}`}
        className={cn(
          "group grid h-full grid-cols-[5.25rem_1fr] gap-3.5 rounded-[18px] border p-3 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out-expo hover:-translate-y-1 sm:grid-cols-[minmax(6.5rem,8.75rem)_1fr] sm:gap-5 sm:p-3.5",
          dark
            ? "border-white/12 bg-white/[0.05] hover:border-white/35 hover:bg-white/[0.08]"
            : "border-line bg-white hover:border-blue/45 hover:shadow-[var(--shadow-lift)]",
        )}
      >
        <span className="relative block aspect-[1/0.92] self-start overflow-hidden rounded-[12px] bg-navy-950">
          <Image
            src={project.thumbnail.src}
            alt=""
            fill
            sizes="(min-width: 640px) 9rem, 5.25rem"
            quality={85}
            className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.05]"
          />
        </span>
        <span className="flex min-w-0 flex-col py-0.5 pr-0.5">
          <span className="flex items-start justify-between gap-3">
            <span className={cn("text-[1.02rem] font-semibold leading-snug tracking-[-0.015em]", dark ? "text-white" : "text-ink")}>
              {project.title}
            </span>
            <span
              aria-hidden
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-200",
                dark
                  ? "border-white/25 text-white group-hover:border-white group-hover:bg-white group-hover:text-navy-950"
                  : "border-blue/25 text-blue group-hover:border-blue group-hover:bg-blue group-hover:text-white",
              )}
            >
              <ArrowRight size={15} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </span>
          <span className="mt-2.5 flex flex-wrap gap-1.5">
            {project.cardTags.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.72rem] font-medium",
                  dark ? "bg-white/10 text-white/80" : "bg-blue-100/70 text-navy",
                )}
              >
                {t}
              </span>
            ))}
          </span>
          <span className={cn("mt-3 text-[0.88rem] leading-relaxed", dark ? "text-white/70" : "text-ink-2")}>{project.cardSummary}</span>
        </span>
      </TransitionLink>
    </li>
  );
}
