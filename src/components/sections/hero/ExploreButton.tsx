"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import { openSiteMenu } from "@/lib/navigation";
import styles from "./hero.module.css";

/** The landing screen's way in: opens the full-screen menu, from which every page is one step away. */
export function ExploreButton() {
  return (
    <button
      type="button"
      onClick={openSiteMenu}
      aria-haspopup="dialog"
      aria-controls="site-menu"
      className={`${styles.cue} group absolute bottom-[max(1.5rem,3.5svh)] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 rounded-full text-white`}
    >
      <span className="grid size-14 place-items-center rounded-full border border-white/70 bg-navy-950/45 shadow-[0_10px_30px_-10px_rgb(4_17_43/0.6)] transition-[background-color,color,transform] duration-300 ease-out-expo group-hover:scale-105 group-hover:bg-white group-hover:text-navy">
        <Plus size={20} weight="bold" aria-hidden className={`${styles.cueIcon} transition-transform duration-500 ease-out-expo group-hover:rotate-90`} />
      </span>
      <span className="rounded-full bg-navy-950/45 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] [text-shadow:0_1px_8px_rgb(4_17_43/0.5)]">
        Explore
      </span>
      <span className="sr-only">: open the menu</span>
    </button>
  );
}
