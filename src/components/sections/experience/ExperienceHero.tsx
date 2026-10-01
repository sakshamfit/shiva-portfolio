import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import styles from "./experience-hero.module.css";

const v = (vars: Record<string, string>) => vars as CSSProperties;

/**
 * Experience landing: an aerial shot cut by a diagonal blue band, with the slanted headline on
 * white above it and the role line with a "View experience" action over the photo. All type is
 * live; the photo, band, rings, spark and swoosh are separate layers so they can arrive in order
 * (image rises, rings and marks draw, headline enters right to left). On wide screens every layer
 * is placed in the photo's own coordinates so the headline always sits just above the band;
 * narrow screens stack the headline above a crop of the photo.
 */
export function ExperienceHero() {
  return (
    <section id="experience-landing" aria-labelledby="experience-title" data-header-theme="light" className={styles.hero}>
      <div className={styles.frameBox}>
        <div className={styles.frame} data-reveal="group">
          <div className={styles.photo}>
            <Image
              src="/images/experience/gorakhpur-aerial.jpg"
              alt="Aerial view of a city on a river at golden hour: ghats, temple spires, rooftops and boats, shot from a drone."
              fill
              priority
              sizes="(min-width: 1024px) 112vw, 180vw"
              quality={88}
              className={styles.photoImg}
            />
          </div>

          <svg aria-hidden className={styles.rings} viewBox="0 0 320 320" fill="none">
            {[150, 118, 86, 54].map((r, i) => (
              <circle key={r} cx="160" cy="160" r={r} pathLength={1} className="draw-path" style={v({ "--pd": `${700 + i * 90}ms`, "--pdur": "900ms" })} />
            ))}
          </svg>

          <div aria-hidden className={styles.metaShade} />
        </div>
      </div>

      <div className={styles.copy} data-reveal="group">
        <svg aria-hidden className={styles.spark} viewBox="0 0 60 60" fill="none">
          <path d="M40 8 L30 30" pathLength={1} />
          <path d="M14 22 L30 34" pathLength={1} />
          <path d="M6 44 L28 42" pathLength={1} />
        </svg>
        <h1 id="experience-title" data-section-heading className={styles.headline}>
          <span className="sr-only">Five years of flying, framing and finishing films and stills.</span>
          <span aria-hidden className={styles.lines}>
            <span className={styles.line} style={v({ "--i": "0" })}>
              <span className={styles.blue}>500+ Flights</span>
            </span>
            <span className={styles.line} style={v({ "--i": "1" })}>
              Flying <span className={styles.blue}>Sites, Brands</span>
            </span>
            <span className={styles.line} style={v({ "--i": "2" })}>
              And Cities From <span className={styles.blue}>The</span>
            </span>
            <span className={`${styles.line} ${styles.indent}`} style={v({ "--i": "3" })}>
              Air
            </span>
          </span>
        </h1>
        <span aria-hidden className={styles.swoosh}>
          <svg viewBox="0 0 400 40" preserveAspectRatio="none">
            <path d="M0 34 C 110 27, 250 14, 400 1 L 400 4 C 250 19, 110 33, 2 40 C -1 38, -1 35, 0 34 Z" />
          </svg>
        </span>
      </div>

      <div className={styles.meta} data-reveal="group">
        <p className={styles.metaRole}>
          <span className={styles.metaPart}>Drone Photographer</span>
          <span aria-hidden className={styles.metaBar} />
          <span className={styles.metaPart}>Aerial Film &amp; Camera Craft</span>
        </p>
        <p className={styles.metaAreas}>Aerial Film • Stills • Mapping • Edit &amp; Colour</p>
        <a href="#roles" className={styles.cta}>
          View experience
          <ArrowRight size={17} weight="bold" aria-hidden className={styles.ctaArrow} />
        </a>
      </div>
    </section>
  );
}
