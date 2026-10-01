import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { TransitionLink } from "./TransitionLink";

/** Closing band that points to the next page in reading order. */
export function NextPage({ label, href, description }: { label: string; href: string; description: string }) {
  return (
    <section aria-label={`Next page: ${label}`} className="border-t border-line bg-white" data-header-theme="light">
      <div className="shell py-14 md:py-20">
        <TransitionLink href={href} className="group grid items-end gap-6 rounded-2xl md:grid-cols-[1fr_auto]">
          <span>
            <span className="type-label text-muted">Next</span>
            <span className="mt-3 block text-[clamp(2.5rem,1.3rem+4.2vw,4.75rem)] font-[680] leading-[0.95] tracking-[-0.05em] text-ink transition-colors duration-300 group-hover:text-blue">
              {label}
            </span>
            <span className="mt-3 block max-w-[36rem] text-[1rem] leading-relaxed text-ink-2">{description}</span>
          </span>
          <span className="grid size-16 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color,translate] duration-300 ease-out-expo group-hover:translate-x-1 group-hover:border-blue group-hover:bg-blue group-hover:text-white">
            <ArrowRight size={24} aria-hidden />
          </span>
        </TransitionLink>
      </div>
    </section>
  );
}
