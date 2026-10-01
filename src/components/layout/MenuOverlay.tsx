"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { FacebookLogo } from "@phosphor-icons/react/dist/ssr/FacebookLogo";
import { YoutubeLogo } from "@phosphor-icons/react/dist/ssr/YoutubeLogo";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { menuItems, quickLinks, resume, site, socials, LINK_PENDING, type MenuItem, type MenuPreviewKind } from "@/content/site";
import { cn, ease } from "@/lib/utils";
import { goToSection, rememberScroll, scrollToTop } from "@/lib/navigation";
import { getLenis } from "@/components/motion/SmoothScroll";

const menuSocialIcons = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  youtube: YoutubeLogo,
  whatsapp: WhatsappLogo,
} as const;

type Preview = { src: string; position?: string; bg?: string; svg?: boolean; fit?: "cover" | "contain" };

// small dedicated previews, served as-is so every row's image is ready the moment the menu opens
const previews: Record<MenuPreviewKind, Preview> = {
  about: { src: "/images/ui/menu-about.png", bg: "#eef4fb" },
  projects: { src: "/images/ui/menu-projects.png", bg: "#0e1f3b" },
  skills: { src: "/images/ui/menu-skills.png", bg: "#eef4fb" },
  education: { src: "/images/ui/menu-education.png", bg: "#dceeff" },
  contact: { src: "/images/ui/menu-contact.png", bg: "#eef4fb" },
  resume: { src: "/images/ui/menu-resume.png", bg: "#ffffff" },
};

let previewsWarmed = false;

/** Fetch and decode every row's preview before the first opening, so nothing pops in while the panel slides. */
export function warmMenuPreviews() {
  if (previewsWarmed) return;
  previewsWarmed = true;
  for (const p of Object.values(previews)) {
    const img = new window.Image();
    img.src = p.src;
    img.decode().catch(() => {});
  }
}

function PreviewThumb({ kind, className }: { kind: MenuPreviewKind; className?: string }) {
  const p = previews[kind];
  return (
    <span
      className={cn("relative block overflow-hidden rounded-[10px] ring-1 ring-navy/10", className)}
      style={{ background: p.bg ?? "#eef4fb" }}
    >
      <Image
        src={p.src}
        alt=""
        fill
        sizes="160px"
        loading="eager"
        unoptimized
        className="object-cover"
        style={{ objectPosition: p.position ?? "50% 50%" }}
      />
    </span>
  );
}

export type MenuOverlayProps = {
  open: boolean;
  onClose: (restoreFocus?: boolean) => void;
};

const onPage = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const pendingPath = useRef<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const defaultIndex = Math.max(
    0,
    menuItems.findIndex((m) => onPage(pathname, m.href)),
  );
  const [selected, setSelected] = useState(defaultIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const pendingFocus = useRef<string | null>(null);

  // Reset the highlighted row to the section currently in view each time the menu opens.
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setSelected(defaultIndex);
  }

  // Scroll lock, background inert, initial focus. Reads before writes (stopping Lenis reads the scroll position),
  // and the scrollbar is compensated on <body> alone: an inherited custom property on <html> would restyle the
  // whole page in the menu's first frame.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    getLenis()?.stop();
    const gap = window.innerWidth - html.clientWidth;
    html.classList.add("menu-open");
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    const background = Array.from(document.body.children).filter(
      (el) => !el.hasAttribute("data-menu-root") && el.tagName !== "SCRIPT",
    );
    const focusTimer = window.setTimeout(() => {
      linkRefs.current[defaultIndex]?.focus({ preventScroll: true });
    }, 60);
    // Making a long page inert restyles all of it: do that once the panel covers the screen, not in its first
    // frame (focus is already trapped by the dialog meanwhile).
    const inertTimer = window.setTimeout(() => background.forEach((el) => el.setAttribute("inert", "")), reduce ? 0 : 680);
    return () => {
      window.clearTimeout(focusTimer);
      window.clearTimeout(inertTimer);
      getLenis()?.start();
      html.classList.remove("menu-open");
      body.style.removeProperty("padding-right");
      background.forEach((el) => el.removeAttribute("inert"));
    };
    // defaultIndex intentionally read once per opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose(true);
        return;
      }
      const links = linkRefs.current.filter(Boolean) as HTMLAnchorElement[];
      const current = links.indexOf(document.activeElement as HTMLAnchorElement);
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && current !== -1) {
        e.preventDefault();
        const next = (current + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links[next].focus();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        ).filter((el) => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  // A different page: keep the curtain down until it has rendered, then lift it to reveal the page.
  useEffect(() => {
    if (open && pendingPath.current && pathname === pendingPath.current) {
      pendingPath.current = null;
      window.clearTimeout(closeTimer.current);
      pendingFocus.current = "main-heading";
      onClose(false);
    }
  }, [pathname, open, onClose]);

  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isDownload = false) => {
    if (!isDownload) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
    }
    const url = new URL(href, window.location.href);
    // Release the scroll lock first (mobile browsers can ignore programmatic scrolling on a locked page).
    document.documentElement.classList.remove("menu-open");
    if (url.pathname === window.location.pathname) {
      // Same page: jump while the curtain still covers it; the rising panel reveals the destination.
      if (url.hash) goToSection(url.hash, { instant: true, focus: false });
      else scrollToTop();
      pendingFocus.current = url.hash || "main-heading";
      onClose(false);
      return;
    }
    rememberScroll();
    pendingPath.current = url.pathname;
    router.push(url.pathname + url.hash, { scroll: false });
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      pendingPath.current = null;
      pendingFocus.current = "main-heading";
      onClose(false);
    }, 2500);
  };

  const onRowClick = (e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem, i: number) => {
    setSelected(i);
    navigate(e, item.href, Boolean(item.download));
  };

  // The panel and rows animate `transform`/`opacity` themselves (not x/y), which Motion hands to the compositor:
  // the slide stays smooth even while the main thread is busy with the page underneath.
  const panel = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { transform: "translateY(-100%)" },
        animate: { transform: "translateY(0%)" },
        exit: { transform: "translateY(-100%)" },
      };

  return (
    <div data-menu-root>
      <AnimatePresence
        onExitComplete={() => {
          const target = pendingFocus.current;
          if (!target) return;
          pendingFocus.current = null;
          if (target === "main-heading") {
            const h = document.querySelector<HTMLElement>("main h1");
            if (h) {
              if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
              h.focus({ preventScroll: true });
            }
            return;
          }
          // If anything above shifted during the transition, settle precisely on the section.
          const el = document.getElementById(target.replace(/^#/, ""));
          const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
          if (el && Math.abs(el.getBoundingClientRect().top - pad) > 6) {
            el.scrollIntoView({ behavior: "instant", block: "start" });
          }
          goToSection(target, { instant: true });
        }}
      >
        {open ? (
          <motion.div
            key="menu"
            ref={dialogRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-surface="dark"
            onKeyDown={onKeyDown}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-navy text-white will-change-transform"
            initial={panel.initial}
            animate={panel.animate}
            exit={panel.exit}
            transition={{ duration: reduce ? 0.2 : 0.62, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* top bar */}
            <motion.div
              className="relative flex h-[var(--header-h)] shrink-0 items-center px-[var(--gutter)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.25, duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <ul className="hidden items-center gap-7 text-[0.8125rem] font-medium lg:flex">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(e) => navigate(e, l.href)}
                      className="link-draw text-white/80 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              {/* centred between the quick links and Close; on phones (no quick links) it sits where the header's name is */}
              <span className="type-label pointer-events-none absolute left-[var(--gutter)] text-[0.8rem] tracking-[0.22em] lg:left-1/2 lg:-translate-x-1/2">
                Siva
              </span>
              <button
                type="button"
                onClick={() => onClose(true)}
                className="ml-auto inline-flex h-11 items-center gap-2.5 rounded-full border border-white/25 pl-4 pr-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-white hover:text-navy"
              >
                Close
                <X size={16} weight="bold" aria-hidden />
              </button>
            </motion.div>

            {/* destinations */}
            <nav aria-label="Site sections" className="flex flex-1 flex-col">
              <ul
                className="relative flex flex-1 flex-col"
                onMouseLeave={() => {
                  // back to the row that has keyboard focus, or to the current page
                  const focused = linkRefs.current.findIndex((el) => el === document.activeElement);
                  setSelected(focused >= 0 ? focused : defaultIndex);
                }}
              >
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-0 bg-white will-change-transform"
                  style={{ height: `calc(100% / ${menuItems.length})` }}
                  initial={reduce ? false : { opacity: 0, y: `${selected * 100}%` }}
                  animate={{ opacity: 1, y: `${selected * 100}%` }}
                  transition={{
                    y: { type: "spring", stiffness: 380, damping: 38, mass: 0.9 },
                    opacity: { delay: reduce ? 0 : 0.42, duration: 0.3 },
                  }}
                />
                {menuItems.map((item, i) => {
                  const isSel = selected === i;
                  return (
                    <motion.li
                      key={item.index}
                      className="relative z-[1] flex min-h-[3.6rem] flex-1 border-t border-white/[0.16] last:border-b [@media(max-height:32rem)]:min-h-12"
                      initial={reduce ? false : { opacity: 0, transform: "translateY(28px)" }}
                      animate={{ opacity: 1, transform: "translateY(0px)" }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      transition={{ delay: 0.16 + i * 0.05, duration: 0.6, ease: ease.out }}
                    >
                      <a
                        ref={(el) => {
                          linkRefs.current[i] = el;
                        }}
                        href={item.download ?? item.href}
                        download={item.download ? resume.fileName : undefined}
                        onMouseEnter={() => setSelected(i)}
                        onFocus={() => setSelected(i)}
                        onClick={(e) => onRowClick(e, item, i)}
                        aria-current={onPage(pathname, item.href) ? "page" : undefined}
                        aria-label={item.download ? `${item.label} (PDF, ${resume.size})` : undefined}
                        className={cn(
                          "grid w-full grid-cols-[3rem_1fr_3rem] items-center px-[var(--gutter)] outline-none transition-colors duration-300 ease-out-expo sm:grid-cols-[4rem_1fr_4rem]",
                          isSel ? "text-navy" : "text-white",
                        )}
                      >
                        <span className="num text-[0.8125rem] font-medium opacity-80">{item.index}</span>
                        <span className="relative justify-self-center">
                          <span
                            className="block whitespace-nowrap font-[560] leading-none tracking-[-0.035em]"
                            style={{ fontSize: "min(8.4vw, 8.6dvh, 5.6rem)" }}
                          >
                            {item.label}
                          </span>
                          <span
                            aria-hidden
                            className={cn(
                              "absolute left-[calc(100%+1.5rem)] top-1/2 hidden -translate-y-1/2 transition-[opacity,transform] duration-300 ease-out-expo sm:block",
                              isSel ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0",
                            )}
                          >
                            <PreviewThumb kind={item.preview} className="h-[min(10dvh,5.5rem)] w-[min(16dvh,9rem)]" />
                          </span>
                        </span>
                        <span className="relative grid justify-self-end">
                          <PreviewThumb
                            kind={item.preview}
                            className={cn(
                              "col-start-1 row-start-1 size-11 transition-[opacity,transform] duration-300 ease-out-expo sm:hidden",
                              isSel ? "scale-100 opacity-100" : "scale-90 opacity-0",
                            )}
                          />
                          <span
                            className={cn(
                              "num col-start-1 row-start-1 self-center justify-self-end text-[0.8125rem] font-medium opacity-80 transition-opacity duration-200",
                              isSel && "max-sm:opacity-0",
                            )}
                          >
                            {item.index}
                          </span>
                        </span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* compact footer: quick links on small screens, contact everywhere */}
            <motion.div
              className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 px-[var(--gutter)] py-4 text-[0.8125rem] text-white/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.45 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <ul className="flex flex-wrap gap-x-5 gap-y-1 lg:hidden">
                {quickLinks.map((l, i) => (
                  <li key={l.href} className={i >= 2 ? "max-md:hidden" : undefined}>
                    <a href={l.href} onClick={(e) => navigate(e, l.href)} className="inline-flex min-h-11 items-center hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={`mailto:${site.email}`} className="link-draw hidden hover:text-white md:inline">
                {site.email}
              </a>
              <ul className="flex items-center gap-x-4">
                {socials.map((s) => {
                  const Icon = menuSocialIcons[s.id];
                  if (!s.href) {
                    return (
                      <li key={s.id} className="inline-flex min-h-11 items-center gap-2 text-white/45" title={LINK_PENDING}>
                        <Icon size={18} weight="fill" aria-hidden />
                        {s.label}
                        <span className="sr-only"> ({LINK_PENDING.toLowerCase()})</span>
                      </li>
                    );
                  }
                  return (
                    <li key={s.id}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 hover:text-white"
                      >
                        <Icon size={18} weight="fill" aria-hidden />
                        {s.label}
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
