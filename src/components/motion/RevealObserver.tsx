"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver drives every [data-reveal] element on the page.
 * - Reveals start as an element reaches ~80% of the viewport height (master document: 70-80%);
 *   whatever is already on screen when tracked (a page's opening screen) plays at once.
 *   Phones and tablets start at ~92%: their screens are short and scrolled in flicks, and an 80%
 *   line would leave the bottom of every screen blank after each flick.
 * - Elements already above the viewport (e.g. after a reload mid-page) are shown at once.
 * - At the very end of a page, anything still waiting in view is shown, so content low on
 *   the last screen is never left hidden.
 * - New elements (tabs, expanded panels, new pages) are picked up through a MutationObserver.
 * - Sets html.reveal-ready so the CSS fail-safe stands down.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      root.classList.add("reveal-ready");
      return;
    }

    // On screen when first tracked (a page's opening screen): keeps its full choreography. Everything else is
    // marked .rv-scroll as it arrives, which shortens desktop-length delays on narrow screens (globals.css).
    const initial = new WeakSet<Element>();
    const show = (el: Element, scrolled: boolean) => {
      if (scrolled && !initial.has(el)) el.classList.add("rv-scroll");
      el.classList.add("is-in");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show(entry.target, true);
            io.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: window.matchMedia("(min-width: 64rem)").matches ? "0px 0px -20% 0px" : "0px 0px -8% 0px",
        threshold: 0.01,
      },
    );
    // Anything already on screen when it is tracked (the opening screen of a page, new content
    // in view) plays its entrance straight away, even in the bottom fifth of the viewport.
    const onScreen = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          show(entry.target, false);
          io.unobserve(entry.target);
        }
        onScreen.unobserve(entry.target);
      }
    });

    let frame = 0;
    const flushAtEnd = () => {
      frame = 0;
      if (window.scrollY + window.innerHeight < root.scrollHeight - 4) return;
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          show(el, true);
          io.unobserve(el);
        }
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(flushAtEnd);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const track = (el: Element) => {
      if (el.classList.contains("is-in")) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0) {
        el.classList.add("is-in");
        return;
      }
      io.observe(el);
      if (rect.top < window.innerHeight) {
        initial.add(el);
        onScreen.observe(el);
      }
    };

    document.querySelectorAll("[data-reveal]").forEach(track);
    root.classList.add("reveal-ready");
    onScroll();

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.hasAttribute("data-reveal")) track(node);
          node.querySelectorAll?.("[data-reveal]").forEach(track);
        });
      }
      onScroll();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      onScreen.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
