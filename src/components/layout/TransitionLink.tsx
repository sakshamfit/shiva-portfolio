"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, type ComponentProps } from "react";
import { navigateTo } from "@/lib/navigation";

/** Plain left clicks become smooth client transitions; modified clicks keep browser behaviour. */
export function useTransitionClick() {
  const router = useRouter();
  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigateTo(router, href);
    },
    [router],
  );
}

/**
 * Prefetch a page when the visitor shows intent (hover, focus, touch) rather than for every
 * link in view. Pages are static, so this keeps navigation instant without upfront CPU cost.
 */
export function usePrefetchOnIntent(href: string) {
  const router = useRouter();
  const done = useRef(false);
  return useCallback(() => {
    if (done.current || !href.startsWith("/")) return;
    done.current = true;
    router.prefetch(href.split("#")[0] || "/");
  }, [router, href]);
}

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** next/link with a cross-fade page transition (View Transitions API where supported). */
export function TransitionLink({ href, onClick, onPointerEnter, onFocus, onTouchStart, children, ...rest }: Props) {
  const onNav = useTransitionClick();
  const prefetch = usePrefetchOnIntent(href);
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={(e) => {
        onClick?.(e);
        onNav(e, href);
      }}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        prefetch();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        prefetch();
      }}
      onTouchStart={(e) => {
        onTouchStart?.(e);
        prefetch();
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
