import { Certificate } from "@phosphor-icons/react/dist/ssr/Certificate";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { certifications, languages } from "@/content/credentials";
import { cn } from "@/lib/utils";

const cefr = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export function CredentialsSection() {
  return (
    <section
      id="credentials"
     
      data-header-theme="light"
      aria-labelledby="credentials-title"
      className="relative bg-white"
    >
      <div className="shell py-[clamp(4.5rem,8vw,7.5rem)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="credentials-title" data-section-heading className="type-title text-ink" data-reveal>
              Certifications<span className="text-blue">.</span>
            </h2>
            <p className="mt-4 max-w-[22rem] text-[0.98rem] leading-relaxed text-ink-2" data-reveal style={{ ["--d" as string]: "80ms" }}>
              Formal pilot training, mapping, and the camera and colour courses behind the studio&apos;s look.
            </p>
          </div>

          <ol className="grid gap-3 lg:col-span-8">
            {certifications.map((c, i) => (
              <li
                key={c.title}
                className="group grid grid-cols-[auto_1fr] items-center gap-5 rounded-[18px] border border-line bg-white px-5 py-5 transition-[border-color,box-shadow] duration-300 hover:border-blue/40 hover:shadow-[var(--shadow-soft)] sm:grid-cols-[auto_1fr_auto] sm:px-6"
                data-reveal="right"
                style={{ ["--d" as string]: `${120 + i * 90}ms` }}
              >
                <span className="grid size-12 place-items-center rounded-[14px] bg-blue-100 text-navy">
                  <Certificate size={24} weight="light" aria-hidden />
                </span>
                <div>
                  <p className="text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-ink">{c.title}</p>
                  <p className="mt-1 text-[0.86rem] text-muted">Issued by {c.issuer}</p>
                </div>
                {"code" in c && c.code ? (
                  <span className="col-start-2 justify-self-start rounded-full border border-line px-3 py-1 text-[0.78rem] font-semibold text-navy sm:col-start-3 sm:justify-self-end">
                    {c.code}
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 grid gap-8 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4" data-reveal>
            <h3 className="inline-flex items-center gap-3 text-[1.35rem] font-[640] tracking-[-0.02em] text-ink">
              <Translate size={24} weight="light" className="text-blue" aria-hidden />
              Languages
            </h3>
            <p className="mt-2 text-[0.9rem] text-muted">Common European Framework (CEFR) levels</p>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            {languages.map((l, i) => {
              const level = cefr.indexOf(l.level as (typeof cefr)[number]);
              return (
                <div key={l.name} data-reveal style={{ ["--d" as string]: `${100 + i * 100}ms` }}>
                  <dt className="flex items-baseline justify-between gap-3">
                    <span className="text-[1.1rem] font-semibold text-ink">{l.name}</span>
                    <span className="text-[0.86rem] text-muted">{l.note}</span>
                  </dt>
                  <dd className="mt-3">
                    <span className="sr-only">
                      Level {l.level} on the CEFR scale from A1 to C2.
                    </span>
                    <span aria-hidden className="grid grid-cols-6 gap-1.5">
                      {cefr.map((c, j) => (
                        <span key={c} className="grid gap-1.5">
                          <span className={cn("h-2 rounded-full", j <= level ? "bg-blue" : "bg-line-soft")} />
                          <span className={cn("text-center text-[0.72rem] font-semibold", j === level ? "text-navy" : "text-muted/70")}>{c}</span>
                        </span>
                      ))}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
