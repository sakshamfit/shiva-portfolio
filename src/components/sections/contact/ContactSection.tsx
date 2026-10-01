import Image from "next/image";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { FacebookLogo } from "@phosphor-icons/react/dist/ssr/FacebookLogo";
import { YoutubeLogo } from "@phosphor-icons/react/dist/ssr/YoutubeLogo";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { LINK_PENDING, site, socials } from "@/content/site";
import { ContactForm } from "./ContactForm";
import styles from "./contact.module.css";

const socialIcons = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  youtube: YoutubeLogo,
  whatsapp: WhatsappLogo,
} as const;

const socialLabels = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
} as const;

/* TODO: paste the profile URLs into `socials` in /src/content/site.ts — they render as
   "link coming soon" here until then, so nothing ever points at the wrong profile. */
type Detail = {
  Icon: typeof EnvelopeSimple;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

const details: Detail[] = [
  { Icon: EnvelopeSimple, label: "Email", value: site.email, href: `mailto:${site.email}` },
  ...(site.phone.href ? [{ Icon: Phone as typeof EnvelopeSimple, label: "Phone", value: site.phone.display, href: site.phone.href }] : []),
  { Icon: MapPin as typeof EnvelopeSimple, label: "Location", value: site.location },
  ...socials.map((s) => ({
    Icon: socialIcons[s.id as keyof typeof socialIcons] as typeof EnvelopeSimple,
    label: s.label,
    value: s.href || LINK_PENDING,
    href: s.href || undefined,
    external: Boolean(s.href),
  })),
];

const socialNames = Object.values(socialLabels).join(", ");

export function ContactSection() {
  return (
    <section
      id="contact"
     
      data-header-theme="light"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-white"
    >
      <div className="shell section-pad relative">
        <div className="flex items-center justify-between gap-6" data-reveal="fade">
          <p className="type-label flex items-center gap-4 text-ink-2">
            Contact
            <span aria-hidden className="hidden h-px w-40 bg-line sm:block" />
          </p>
          <p className="type-label text-blue">Open to opportunities</p>
        </div>

        <div className={styles.grid}>
          {/* invitation + details */}
          <div className={styles.copy}>
            <h1
              id="contact-title"
              data-section-heading
              className="reveal-lines text-[clamp(3.4rem,1.6rem+6vw,7.25rem)] font-[700] leading-[0.9] tracking-[-0.06em] text-ink"
              data-reveal
              style={{ ["--lx" as string]: "-24px", ["--ly" as string]: "0px", ["--ldur" as string]: "650ms" }}
            >
              <span className="line">
                <span style={{ ["--i" as string]: 0 }}>Let&apos;s</span>
              </span>
              <span className="line">
                <span className="text-blue" style={{ ["--i" as string]: 1 }}>
                  Connect<span className="text-ink">.</span>
                </span>
              </span>
            </h1>
            <p className="type-lead pretty mt-7 max-w-[28rem] text-ink-2" data-reveal="left" style={{ ["--d" as string]: "240ms" }}>
              Open to shoots, commissions and collaborations — a single site visit, a full campaign, or a regular
              documentation run.
            </p>

            <ul className="mt-10 grid gap-4">
              {details.map((d, i) => (
                <li key={d.label} className="flex items-center gap-4" data-reveal="left" style={{ ["--d" as string]: `${320 + i * 70}ms` }}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mist text-navy">
                    <d.Icon size={20} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9rem] font-semibold text-ink">{d.label}</span>
                    {d.href ? (
                      <a
                        href={d.href}
                        {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="link-draw tap block truncate text-[0.95rem] leading-[44px] text-ink-2 hover:text-blue [@media(pointer:fine)]:leading-normal"
                      >
                        {d.value}
                        {d.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                      </a>
                    ) : (
                      <span className="block text-[0.95rem] text-ink-2">{d.value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[26rem] text-[0.86rem] leading-relaxed text-muted">
              {socialNames} profiles are on the way — the links are added as soon as the pages are live. Until then,
              email or the form below reach me directly.
            </p>
          </div>

          {/* portrait */}
          <div className={styles.portrait} aria-hidden data-reveal="group">
            <div className={styles.circle} data-reveal="scale" style={{ ["--d" as string]: "150ms" }} />
            <div className={styles.photo} data-reveal="scale" style={{ ["--d" as string]: "260ms", ["--dur" as string]: "900ms" }}>
              <Image
                src="/images/portraits/connect.webp"
                alt=""
                width={1264}
                height={1602}
                sizes="(min-width: 1024px) 34vw, 80vw"
                quality={85}
                className="h-auto w-full"
              />
            </div>
            <svg className={styles.doodleTop} viewBox="0 0 200 120" fill="none">
              <path d="M8 104 C 40 60, 90 30, 170 22" stroke="#101828" strokeWidth="1.6" strokeLinecap="round" pathLength={1} className={styles.draw} />
              <path d="M156 12 L172 22 L158 34" stroke="#101828" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className={styles.draw} />
            </svg>
            <p className={styles.note}>
              Good ideas.
              <br />
              Good conversations.
              <br />
              <span className="text-blue">Better opportunities.</span>
            </p>
            <svg className={styles.underline} viewBox="0 0 160 14" fill="none">
              <path d="M4 10 C 50 2, 110 2, 156 6" stroke="#145fe5" strokeWidth="2.2" strokeLinecap="round" pathLength={1} className={styles.draw} />
            </svg>
            {/* lower note from the reference: an arrow from the portrait to "same good energy" */}
            <svg className={styles.doodleBottom} viewBox="0 0 180 120" fill="none">
              <path d="M10 8 C 30 40, 60 70, 150 96" stroke="#101828" strokeWidth="1.6" strokeLinecap="round" pathLength={1} className={styles.draw} />
              <path d="M136 86 L152 97 L136 106" stroke="#101828" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className={styles.draw} />
            </svg>
            <p className={styles.noteBottom}>
              Same good energy
              <br />
              here too.
            </p>
            <svg className={styles.underlineBottom} viewBox="0 0 120 12" fill="none">
              <path d="M4 8 C 40 2, 80 2, 116 5" stroke="#145fe5" strokeWidth="2" strokeLinecap="round" pathLength={1} className={styles.draw} />
            </svg>
          </div>

          {/* form */}
          <div className={styles.formWrap}>
            {/* paper plane doodle above the form */}
            <svg aria-hidden className={styles.plane} viewBox="0 0 120 90" fill="none" data-reveal="fade" style={{ ["--d" as string]: "900ms" }}>
              <path d="M6 82 C 22 62, 40 52, 62 46" stroke="#101828" strokeWidth="1.5" strokeLinecap="round" pathLength={1} className={styles.draw} />
              <path d="M70 30 L112 8 L96 52 L84 40 Z M84 40 L112 8" stroke="#101828" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className={styles.draw} />
            </svg>
            <div className={styles.form} data-reveal="right" style={{ ["--d" as string]: "200ms", ["--dur" as string]: "650ms" }}>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
