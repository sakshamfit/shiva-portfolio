"use client";

import { usePathname } from "next/navigation";

/** The Home page is the landing screen alone (the menu leads into the pages), so it has no footer. */
export function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname === "/" ? null : children;
}
