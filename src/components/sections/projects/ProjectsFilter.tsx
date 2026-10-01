"use client";

import { createContext, Fragment, useContext, useState, type ReactNode } from "react";
import { projectCategories, projects, type ProjectCategory } from "@/content/projects";
import { goToSection } from "@/lib/navigation";
import { ProjectCard } from "./ProjectCard";
import styles from "./projects.module.css";

type Filter = ProjectCategory | "all";

const FilterContext = createContext<{ filter: Filter; setFilter: (f: Filter) => void }>({
  filter: "all",
  setFilter: () => {},
});

export function ProjectFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<Filter>("all");
  return <FilterContext.Provider value={{ filter, setFilter }}>{children}</FilterContext.Provider>;
}

/**
 * The category row from the Projects reference. It filters the case-study cards; used in the
 * landing, it also brings the cards into view when they are further down the page.
 */
export function ProjectFilterRow({ revealCards = false, tone = "dark" }: { revealCards?: boolean; tone?: "dark" | "light" }) {
  const { filter, setFilter } = useContext(FilterContext);
  return (
    <div className={`${styles.filters} ${tone === "light" ? styles.filtersLight : ""}`} role="group" aria-label="Filter case studies by area">
      {projectCategories.map((c, i) => (
        <Fragment key={c.id}>
          {i > 0 ? <span aria-hidden className={styles.filterSep} /> : null}
          <button
            type="button"
            className={styles.filter}
            aria-pressed={filter === c.id}
            aria-controls="case-study-list"
            onClick={(e) => {
              setFilter(c.id);
              // on phones the row scrolls sideways: keep the chosen option fully in view
              e.currentTarget.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
              if (!revealCards) return;
              const list = document.getElementById("case-studies");
              if (list && list.getBoundingClientRect().top > window.innerHeight * 0.55) goToSection("#case-studies", { focus: false });
            }}
          >
            {c.label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

export function FilteredProjects() {
  const { filter } = useContext(FilterContext);
  const shown = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
  const label = projectCategories.find((c) => c.id === filter)?.label ?? "All projects";
  return (
    <>
      <p className="sr-only" aria-live="polite">
        {filter === "all" ? `All ${shown.length} case studies shown.` : `${shown.length} case studies in ${label}.`}
      </p>
      <ul id="case-study-list" className="grid gap-4 md:grid-cols-2" aria-label="Case studies">
        {shown.map((p, i) => (
          <ProjectCard key={p.slug} project={p} delay={i * 80} />
        ))}
      </ul>
    </>
  );
}
