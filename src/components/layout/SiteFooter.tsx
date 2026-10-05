import Image from "next/image";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { FacebookLogo } from "@phosphor-icons/react/dist/ssr/FacebookLogo";
import { YoutubeLogo } from "@phosphor-icons/react/dist/ssr/YoutubeLogo";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { LINK_PENDING, resume, site, socials, type SocialId } from "@/content/site";
import { TransitionLink } from "./TransitionLink";

/* what travels in the case: the short answer to "what can you shoot with?" */
const kit = [
  "Drone (Mavic class)",
  "Full-frame bodies",
  "Three lenses",
  "Batteries & charger",
  "Filters",
  "Cards & SSD",
];

const socialIcons: Record<SocialId, typeof InstagramLogo> = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  youtube: YoutubeLogo,
  whatsapp: WhatsappLogo,
};

const nav = [
  { label: "Home", href: "/" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "Education", href: "/education" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

export function SiteFooter() {
  const pendingSocials = socials.filter((s) => !s.href);
  return (
    <footer className="relative text-white">
      {/* invitation */}
      <div className="relative overflow-hidden border-t border-line-soft bg-white text-ink" data-header-theme="light">
        {/* phones and tablets: the invitation, then portrait and case side by side; wide: all three in a row */}
        <div className="shell relative grid grid-cols-2 items-end gap-x-4 gap-y-10 pt-20 md:grid-cols-12 md:gap-6 md:pt-24">
          <div className="relative order-2 w-full max-w-[15rem] justify-self-center md:col-span-6 md:max-w-[19rem] lg:order-1 lg:col-span-3" data-reveal="rise">
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-[0.4%] left-[18%] right-[18%] z-0 h-[1.6%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(16_24_40/0.22),transparent_70%)] blur-[2px]"
            />
            <Image
              src="/images/portraits/shirt.webp"
              alt="Shiva in a light button-down shirt, holding a drone controller"
              width={565}
              height={1681}
              sizes="(min-width: 768px) 19rem, 45vw"
              quality={85}
              className="relative z-[1] h-auto w-full"
            />
          </div>
          <div className="order-1 col-span-2 pb-4 md:col-span-12 lg:order-2 lg:col-span-6 lg:pb-24">
            <p className="type-label text-blue" data-reveal>
              Available for bookings
            </p>
            <p className="mt-4 text-[clamp(2.8rem,1.3rem+4.2vw,5.4rem)] font-[700] leading-[0.92] tracking-[-0.06em]" data-reveal style={{ ["--d" as string]: "80ms" }}>
              Let&apos;s shoot it<span className="text-blue">.</span>
            </p>
            <p className="type-lead pretty mt-5 max-w-[34rem] text-ink-2" data-reveal style={{ ["--d" as string]: "160ms" }}>
              Open to shoots, commissions and collaborations across Gorakhpur, eastern Uttar Pradesh and Bihar — from a
              single site visit to a full campaign.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3" data-reveal style={{ ["--d" as string]: "240ms" }}>
              <a href={`mailto:${site.email}`} className="btn btn-primary">
                <EnvelopeSimple size={18} weight="bold" aria-hidden />
                Email {site.name}
                <ArrowRight size={16} weight="bold" className="btn-arrow" aria-hidden />
              </a>
              <a href={site.phone.href} className="btn btn-secondary">
                <Phone size={18} weight="bold" aria-hidden />
                Call {site.phone.display}
              </a>
              <a href={resume.href} download={resume.fileName} className="btn btn-secondary">
                <DownloadSimple size={18} weight="bold" aria-hidden />
                Download profile
              </a>
            </div>
            <p className="mt-4 text-[0.95rem] text-ink-2" data-reveal style={{ ["--d" as string]: "300ms" }}>
              <a href={`mailto:${site.email}`} className="link-draw font-medium text-navy">
                {site.email}
              </a>
            </p>
          </div>
          <div className="relative order-3 self-end pb-6 md:col-span-6 md:w-full md:max-w-[24rem] md:justify-self-center lg:col-span-3 lg:max-w-none lg:pb-12" data-reveal="right" style={{ ["--d" as string]: "200ms" }}>
            <Image
              src="/images/footer/gear-case.png"
              alt="An open hard case holding a drone, camera bodies, lenses, batteries and cards in fitted foam."
              width={1204}
              height={818}
              sizes="(min-width: 1024px) 30vw, 48vw"
              quality={85}
              className="h-auto w-full drop-shadow-[0_24px_30px_rgba(11,40,90,0.25)]"
            />
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-[0.78rem] text-ink-2 lg:grid-cols-3" aria-label="What travels in the case">
              {kit.map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-blue" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* structured footer */}
      <div className="bg-navy-950" data-header-theme="dark" data-surface="dark">
        <div className="shell grid gap-12 py-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4" data-reveal="fade" style={{ ["--dur" as string]: "500ms" }}>
            <p className="text-[1.1rem] font-[680] uppercase tracking-[0.08em]">{site.name}</p>
            <p className="mt-2 text-[0.92rem] text-white/70">Drone photography, aerial film and mapping</p>
            <p className="mt-3 inline-flex items-center gap-2 text-[0.9rem] text-white/70">
              <MapPin size={16} aria-hidden />
              {site.location}
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-4" data-reveal="fade" style={{ ["--d" as string]: "90ms", ["--dur" as string]: "500ms" }}>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-white/50">Sections</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 text-[0.95rem]">
              {nav.map((n) => (
                <li key={n.href}>
                  <TransitionLink href={n.href} className="flex min-h-11 w-full items-center text-white/80 hover:text-white">
                    {n.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4" data-reveal="fade" style={{ ["--d" as string]: "180ms", ["--dur" as string]: "500ms" }}>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-white/50">Find me on</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((s) => {
                const Icon = socialIcons[s.id];
                if (!s.href) {
                  // no link yet: say so rather than sending anyone to the wrong profile
                  return (
                    <span
                      key={s.id}
                      title={`${s.label} — ${LINK_PENDING.toLowerCase()}`}
                      aria-label={`${s.label} (${LINK_PENDING.toLowerCase()})`}
                      className="grid size-12 cursor-default place-items-center rounded-full border border-dashed border-white/20 text-white/45"
                    >
                      <Icon size={22} weight="fill" aria-hidden />
                    </span>
                  );
                }
                return (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-12 place-items-center rounded-full border border-white/20 transition-colors hover:border-white hover:bg-white hover:text-navy-950"
                    aria-label={`${s.label} (opens in a new tab)`}
                  >
                    <Icon size={22} weight="fill" aria-hidden />
                  </a>
                );
              })}
              <a
                href={site.phone.href}
                className="grid size-12 place-items-center rounded-full border border-white/20 transition-colors hover:border-white hover:bg-white hover:text-navy-950"
                aria-label={`Call ${site.phone.display}`}
              >
                <Phone size={22} weight="bold" aria-hidden />
              </a>
              <a
                href={`mailto:${site.email}`}
                className="grid size-12 place-items-center rounded-full border border-white/20 transition-colors hover:border-white hover:bg-white hover:text-navy-950"
                aria-label={`Email ${site.email}`}
              >
                <EnvelopeSimple size={22} weight="bold" aria-hidden />
              </a>
            </div>
            {pendingSocials.length ? (
              <p className="mt-3 text-[0.82rem] text-white/55">
                {pendingSocials.map((s) => s.label).join(", ")} — {LINK_PENDING.toLowerCase()}.
              </p>
            ) : null}
            <p className="mt-8 text-[1.15rem] leading-snug tracking-[-0.015em] text-white/85">
              Golden hour, clean frames,
              <br />
              <span className="text-[#8fb6f5]">delivered on time.</span>
            </p>
          </div>
        </div>
        <div className="shell flex flex-col gap-4 border-t border-white/10 py-6 text-[0.84rem] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
            <span className="mx-2 text-white/25" aria-hidden>
              ·
            </span>
            <span>
              Made by{" "}
              <a
                href="https://github.com/sakshamfit"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/80 transition-colors hover:text-white"
              >
                sakshamfit
              </a>
            </span>
          </p>
          <a href="#main" className="inline-flex min-h-11 items-center gap-2 text-white/75 hover:text-white">
            Back to top
            <ArrowUp size={15} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
