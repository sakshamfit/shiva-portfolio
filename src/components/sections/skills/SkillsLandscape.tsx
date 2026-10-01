import { ArrowDown } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { site } from "@/content/site";
import { LaptopScreen } from "./LaptopScreen";
import { SkillScene } from "./SkillScene";

export function SkillsLandscape() {
  return (
    <section
      id="skills"
     
      data-header-theme="light"
      aria-labelledby="skills-title"
      className="relative overflow-hidden bg-white"
    >

      <div className="shell section-pad relative">
        <div className="flex flex-wrap items-start justify-between gap-6" data-reveal="fade">
          <div>
            <p className="text-[0.95rem] font-[680] uppercase tracking-[0.08em] text-navy">{site.name}</p>
            <p className="mt-1 text-[0.9rem] text-ink-2">
              {site.role} <span aria-hidden className="mx-1.5 text-line">|</span> {site.specialism}
            </p>
          </div>
          <p className="type-label text-blue">Skills &amp; expertise</p>
        </div>

        <h1
          id="skills-title"
          data-section-heading
          className="reveal-lines mt-12 text-[clamp(3rem,1.4rem+7vw,8.25rem)] font-[640] leading-[0.92] tracking-[-0.055em] text-ink lg:mt-16"
          data-reveal
        >
          <span className="line">
            <span style={{ ["--i" as string]: 0 }}>Drone &amp; camera skills</span>
          </span>
          <span className="line">
            <span style={{ ["--i" as string]: 1 }}>
              &amp; expertise<span className="text-blue">.</span>
            </span>
          </span>
        </h1>

        <div className="mt-12 lg:-mt-6">
          <SkillScene screen={<LaptopScreen />} />
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-end lg:mt-6">
          <p className="max-w-[26rem] text-[clamp(1.3rem,1rem+1vw,1.75rem)] font-[400] leading-snug tracking-[-0.02em] text-ink-2" data-reveal>
            Flying, framing and finishing your story.{" "}
            <span className="font-[640] text-navy">Let&apos;s shoot it.</span>
          </p>
          <a
            href="#capabilities"
            className="group inline-flex items-center gap-3 text-[0.95rem] font-semibold text-ink"
            data-reveal
            style={{ ["--d" as string]: "120ms" }}
          >
            Explore the five capability areas
            <span className="grid size-11 place-items-center rounded-full border border-line transition-colors group-hover:border-blue group-hover:bg-blue group-hover:text-white">
              <ArrowDown size={16} aria-hidden />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
