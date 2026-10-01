import { Fragment } from "react";
import { HeroScene } from "./HeroScene";
import { ExploreButton } from "./ExploreButton";
import { site } from "@/content/site";
import styles from "./hero.module.css";

const disciplines = ["Drone Cinematography", "Aerial Stills", "Mapping", "Post & Colour"];

export function HomeHero() {
  return (
    <section
      id="home"
      data-header-theme="dark"
      aria-labelledby="hero-title"
      className={`${styles.hero} relative isolate flex h-[100svh] min-h-[38rem] items-center justify-center overflow-hidden text-white`}
    >
      <HeroScene />

      <div className="shell relative z-10 flex flex-col items-center text-center">
        <h1 id="hero-title" data-section-heading className="flex flex-col items-center">
          <span className={`${styles.eyebrow} flex items-center gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.3em] sm:text-[0.78rem]`}>
            <span aria-hidden className="h-px w-8 bg-white/70 sm:w-12" />
            {site.name}
            <span aria-hidden className="h-px w-8 bg-white/70 sm:w-12" />
          </span>
          <span className="sr-only">, drone photographer in Gorakhpur. Flying the frame, telling your story.</span>
          {/* visual line breaks differ by width; the accessible text above is read once */}
          <span aria-hidden className={`${styles.headline} type-hero mt-6 hidden sm:block sm:mt-7`}>
            <span className={styles.line}>
              <span style={{ ["--i" as string]: 0 }}>Flying the frame.</span>
            </span>
            <span className={styles.line}>
              <span style={{ ["--i" as string]: 1 }}>Telling your story.</span>
            </span>
          </span>
          <span aria-hidden className={`${styles.headline} type-hero mt-6 block sm:hidden`}>
            <span className={styles.line}>
              <span style={{ ["--i" as string]: 0 }}>Flying the</span>
            </span>
            <span className={styles.line}>
              <span style={{ ["--i" as string]: 1 }}>frame. Telling</span>
            </span>
            <span className={styles.line}>
              <span style={{ ["--i" as string]: 2 }}>your story.</span>
            </span>
          </span>
        </h1>

        <p className={`${styles.role} mt-6 text-[1.02rem] font-medium tracking-[-0.01em] text-white/90 sm:text-lg`}>
          Drone Photographer &amp; Aerial Cinematographer
        </p>

        <ul
          aria-label="Focus areas"
          className={`${styles.disciplines} mt-5 flex flex-wrap items-center justify-center gap-y-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/85`}
        >
          {disciplines.map((d, i) => (
            <Fragment key={d}>
              {i === 1 ? <li aria-hidden className={styles.breakNarrow} /> : null}
              {i === 2 ? <li aria-hidden className={styles.break} /> : null}
              <li className={styles.discipline}>{d}</li>
            </Fragment>
          ))}
        </ul>
      </div>

      <ExploreButton />
    </section>
  );
}
