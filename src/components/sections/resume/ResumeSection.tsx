import Image from "next/image";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { resume, site } from "@/content/site";
import styles from "./resume.module.css";
import { TransitionLink } from "@/components/layout/TransitionLink";

export function ResumeSection() {
  const meta = [resume.format, `${resume.pages} page`, resume.size, `Updated ${resume.updated}`];
  return (
    <section
      id="resume"
     
      data-header-theme="light"
      aria-labelledby="resume-title"
      className="relative overflow-hidden bg-white"
    >
      <div className="shell section-pad relative">
        <div className="flex items-center justify-between gap-6" data-reveal="fade">
          <p className="type-label flex items-center gap-4 text-ink-2">
            Resume
            <span aria-hidden className="hidden h-px w-40 bg-line sm:block" />
          </p>
          <p className="type-label text-blue">One current version</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <h1
              id="resume-title"
              data-section-heading
              className="reveal-lines text-[clamp(3rem,1.5rem+5.2vw,6.5rem)] font-[700] leading-[0.92] tracking-[-0.06em] text-ink"
              data-reveal
            >
              <span className="line">
                <span style={{ ["--i" as string]: 0 }}>Download</span>
              </span>
              <span className="line">
                <span className="text-blue" style={{ ["--i" as string]: 1 }}>
                  my resume.
                </span>
              </span>
            </h1>
            <p className="type-lead pretty mt-7 max-w-[26rem] text-ink-2" data-reveal style={{ ["--d" as string]: "200ms" }}>
              A complete overview of my experience, skills, projects and training on a single page.
            </p>

            <div className={styles.note} data-reveal="group" aria-hidden>
              <svg viewBox="0 0 120 80" fill="none" className={styles.plane}>
                <path d="M6 30 L104 6 L62 70 L50 42 Z" stroke="#101828" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} className={styles.draw} />
                <path d="M50 42 L104 6" stroke="#101828" strokeWidth="1.6" pathLength={1} className={styles.draw} />
                <path d="M40 58 C 30 74, 14 74, 10 64" stroke="#101828" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 4" />
              </svg>
              <p className="text-[1.05rem] font-[560] leading-snug tracking-[-0.015em] text-ink">
                Let&apos;s build something
                <br />
                great together.
              </p>
              <svg viewBox="0 0 160 14" fill="none" className={styles.underline}>
                <path d="M4 10 C 50 2, 110 2, 156 6" stroke="#145fe5" strokeWidth="2.2" strokeLinecap="round" pathLength={1} className={styles.draw} />
              </svg>
            </div>

            <TransitionLink
              href="/contact"
              className="group mt-9 inline-flex min-h-11 items-center gap-3 border-l-2 border-ink pl-4 lg:mt-12"
              data-reveal
              style={{ ["--d" as string]: "300ms" }}
            >
              <span>
                <span className="block text-[0.9rem] text-ink-2">Still have questions?</span>
                <span className="block text-[1.15rem] font-[640] tracking-[-0.02em] text-blue">Let&apos;s connect.</span>
              </span>
              <ArrowRight size={22} className="text-blue transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </TransitionLink>
          </div>

          <div className={styles.stage}>
            <div aria-hidden className={styles.panel} data-reveal="scale" style={{ ["--d" as string]: "100ms" }} />
            <div className={styles.portrait} data-reveal="fade" style={{ ["--d" as string]: "220ms" }}>
              <Image
                src="/images/portraits/resume.webp"
                alt="Siva in a dark blazer, arms folded, holding a drone controller"
                width={1128}
                height={1272}
                sizes="(min-width: 1024px) 34vw, 80vw"
                quality={85}
                className="h-auto w-full"
              />
            </div>

            {/* the document card */}
            {/* master document: the card arrives from below, Y +36px, over 650-850ms */}
            <div className={styles.folder} data-reveal="rise" style={{ ["--d" as string]: "380ms", ["--ry" as string]: "36px", ["--dur" as string]: "780ms" }}>
              <div aria-hidden className={styles.folderBack} />
              <div aria-hidden className={styles.paper}>
                <Image src={resume.thumbnail} alt="" width={900} height={1164} sizes="220px" quality={80} className="h-auto w-full" />
              </div>
              <div className={styles.folderFront}>
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <span className="grid size-14 place-items-center rounded-full bg-white text-blue shadow-[var(--shadow-soft)]">
                      <FileText size={26} weight="regular" aria-hidden />
                    </span>
                    <p className="mt-5 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-ink-2">{site.name}</p>
                    <p className="mt-1 text-[clamp(1.35rem,1rem+1vw,1.85rem)] font-[680] leading-tight tracking-[-0.03em] text-ink">
                      {site.role}
                    </p>
                    <p className="mt-2 max-w-[22rem] text-[0.9rem] leading-relaxed text-ink-2">
                      Experience, skills, projects, training, certifications and languages.
                    </p>
                  </div>
                  <a
                    href={resume.href}
                    download={resume.fileName}
                    className={styles.download}
                    aria-label={`Download resume (${resume.format}, ${resume.pages} page, ${resume.size})`}
                  >
                    <span className={styles.downloadIcon}>
                      <DownloadSimple size={26} weight="bold" aria-hidden />
                    </span>
                    <span className="text-center text-[0.95rem] font-[680] leading-tight text-ink">
                      Download
                      <br />
                      resume
                    </span>
                  </a>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="File details">
                  {meta.map((m) => (
                    <li key={m} className="rounded-full bg-white/80 px-3 py-1 text-[0.8rem] font-medium text-ink-2">
                      {m}
                    </li>
                  ))}
                </ul>
                <a
                  href={resume.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.86rem] font-semibold text-navy hover:text-blue"
                >
                  View in browser
                  <ArrowUpRight size={15} aria-hidden />
                  <span className="sr-only">(opens the PDF in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
