"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { pageLinks, site } from "@/content/site";
import { TransitionLink } from "./TransitionLink";
import type { MenuOverlayProps } from "./MenuOverlay";
import { SITE_MENU_EVENT } from "@/lib/navigation";
import { cn } from "@/lib/utils";

// The full-screen menu (and the animation library it uses) stays out of the first load. It is fetched once the
// browser is idle and then kept mounted, so opening it never waits on a download or a Suspense reveal.
type MenuComponent = ComponentType<MenuOverlayProps>;
let menuModule: Promise<MenuComponent> | null = null;
const loadMenu = () =>
  (menuModule ??= import("./MenuOverlay").then(
    (m) => {
      m.warmMenuPreviews();
      return m.MenuOverlay;
    },
    (err) => {
      menuModule = null; // allow a retry on the next intent
      throw err;
    },
  ));

type HeaderTheme = "light" | "dark";

/** Pages whose first screen is dark (so the bar starts in its light-on-dark state). */
const darkStart = (path: string) => path === "/" || path === "/projects";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [Menu, setMenu] = useState<MenuComponent | null>(null);
  const [theme, setTheme] = useState<HeaderTheme>(darkStart(pathname) ? "dark" : "light");
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // A new page starts from its known first surface...
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setTheme(darkStart(pathname) ? "dark" : "light");
  }

  // ...then the bar follows whatever surface is beneath it while scrolling.
  useEffect(() => {
    const themed = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTheme((entry.target as HTMLElement).dataset.headerTheme === "dark" ? "dark" : "light");
          }
        }
      },
      { rootMargin: "0px 0px -94% 0px" },
    );
    themed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Solid bar once the page has moved: watch a 16px sentinel at the top of the document.
  useEffect(() => {
    const sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const ensureMenu = useCallback(() => {
    loadMenu().then(
      (C) => setMenu(() => C),
      () => {},
    );
  }, []);

  // load the menu as soon as the page has settled: on the landing screen it is the way in
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(ensureMenu, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(ensureMenu, 700);
    return () => window.clearTimeout(t);
  }, [ensureMenu]);

  // the landing screen's Explore button opens the same menu
  useEffect(() => {
    const onOpen = () => {
      ensureMenu();
      setOpen(true);
    };
    window.addEventListener(SITE_MENU_EVENT, onOpen);
    return () => window.removeEventListener(SITE_MENU_EVENT, onOpen);
  }, [ensureMenu]);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => buttonRef.current?.focus({ preventScroll: true }));
  }, []);

  const dark = theme === "dark";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  // the landing screen keeps only the name and the menu: the menu is the way into the pages
  const landing = pathname === "/";

  return (
    <>
      <header
        className={cn(
          "header-in no-print fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,border-color,box-shadow] duration-500 ease-out-expo",
          scrolled
            ? dark
              ? "border-white/10 bg-navy-950"
              : "border-line-soft bg-white shadow-[0_1px_0_rgb(16_24_40/0.02),0_8px_24px_-18px_rgb(11_61_145/0.25)]"
            : "border-transparent bg-transparent",
        )}
        style={{ viewTransitionName: "site-header" }}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
          <TransitionLink
            href="/"
            aria-label={`${site.name}, home`}
            className={cn(
              "type-label inline-flex min-h-11 items-center rounded-md text-[0.8rem] tracking-[0.22em] transition-colors duration-300",
              dark ? "text-white" : "text-ink",
            )}
          >
            {site.name}
          </TransitionLink>

          <nav aria-label="Main" className={cn("hidden", !landing && "xl:block")}>
            <ul className="flex items-center gap-1">
              {pageLinks.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <TransitionLink
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-11 items-center rounded-full px-3.5 text-[0.88rem] font-medium transition-colors duration-200",
                        dark
                          ? active
                            ? "text-white"
                            : "text-white/75 hover:text-white"
                          : active
                            ? "text-ink"
                            : "text-ink-2 hover:text-blue",
                      )}
                    >
                      {l.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3.5 bottom-1.5 h-[2px] origin-left rounded-full transition-transform duration-300 ease-out-expo",
                          dark ? "bg-white" : "bg-blue",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <TransitionLink
              href="/resume"
              aria-current={isActive("/resume") ? "page" : undefined}
              className={cn(
                "hidden h-11 items-center gap-2 rounded-full border px-4 text-[0.84rem] font-semibold transition-colors duration-300",
                !landing && "sm:inline-flex",
                dark
                  ? "border-white/30 text-white hover:bg-white hover:text-navy-950"
                  : "border-line bg-white/70 text-ink hover:border-blue hover:text-blue",
              )}
            >
              <DownloadSimple size={16} weight="bold" aria-hidden />
              Resume
            </TransitionLink>
            <button
              ref={buttonRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="site-menu"
              onPointerEnter={ensureMenu}
              onFocus={ensureMenu}
              onTouchStart={ensureMenu}
              onClick={() => {
                ensureMenu();
                setOpen(true);
              }}
              className={cn(
                "group inline-flex h-11 items-center gap-3 rounded-full pl-5 pr-4 text-[0.8rem] font-semibold uppercase tracking-[0.18em] transition-[background-color,color,border-color,box-shadow] duration-300",
                dark
                  ? "border border-white/30 bg-white/10 text-white hover:bg-white/20"
                  : "border border-line bg-white text-ink shadow-[var(--shadow-soft)] hover:border-navy/40",
              )}
            >
              Menu
              <span
                aria-hidden
                className={cn(
                  "block size-2.5 rounded-full transition-transform duration-300 ease-out-expo group-hover:scale-[1.6]",
                  dark ? "bg-white" : "bg-navy",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {Menu ? <Menu open={open} onClose={close} /> : null}
    </>
  );
}
