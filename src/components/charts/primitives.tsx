import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Info } from "@phosphor-icons/react/dist/ssr/Info";
import { cn, linePath, smoothPath } from "@/lib/utils";

export type Status = "good" | "warning" | "serious" | "critical" | "info";

const statusMeta: Record<Status, { label: string; color: string; Icon: typeof CheckCircle }> = {
  good: { label: "On target", color: "#0ca30c", Icon: CheckCircle },
  warning: { label: "Watch", color: "#c98a00", Icon: Warning },
  serious: { label: "Above limit", color: "#d86a3f", Icon: WarningCircle },
  critical: { label: "Alert", color: "#d03b3b", Icon: WarningCircle },
  info: { label: "Forecast", color: "#145fe5", Icon: Info },
};

/** Status is never colour alone: always an icon plus a text label. */
export function StatusBadge({
  status,
  label,
  surface = "light",
  className,
}: {
  status: Status;
  label?: string;
  surface?: "light" | "dark";
  className?: string;
}) {
  const m = statusMeta[status];
  const Icon = m.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap text-[0.72rem] font-semibold",
        surface === "dark" ? "text-white/85" : "text-ink-2",
        className,
      )}
    >
      <Icon size={14} weight="fill" color={m.color} aria-hidden />
      {label ?? m.label}
    </span>
  );
}

/** 12-point trend line with an emphasised current value. Decorative: the value sits next to it as text. */
export function Sparkline({
  values,
  color = "#145fe5",
  width = 96,
  height = 30,
  className,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map(
    (v, i) =>
      [(i / (values.length - 1)) * (width - 6) + 3, height - 4 - ((v - min) / (max - min || 1)) * (height - 8)] as [number, number],
  );
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <path d={smoothPath(pts, 0.3)} fill="none" stroke={color} strokeOpacity="0.9" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

/** Horizontal bars for a single measure across named categories (one colour; value at the tip). */
export function BarList({
  items,
  format = (v: number) => String(v),
  color = "#145fe5",
  max,
  surface = "light",
  highlight,
  caption,
}: {
  items: { label: string; value: number; note?: string }[];
  format?: (v: number) => string;
  color?: string;
  max?: number;
  surface?: "light" | "dark";
  highlight?: (item: { label: string; value: number }) => boolean;
  caption: string;
}) {
  const top = max ?? Math.max(...items.map((i) => i.value));
  const dark = surface === "dark";
  return (
    <figure>
      <figcaption className="sr-only">{caption}</figcaption>
      <ul className="grid gap-2.5">
        {items.map((it) => {
          const pct = Math.max(2, (it.value / (top || 1)) * 100);
          const hot = highlight?.(it);
          return (
            <li key={it.label} className="grid grid-cols-[minmax(7rem,38%)_1fr] items-center gap-3 text-[0.8rem]">
              <span className={cn("truncate", dark ? "text-white/75" : "text-ink-2")} title={it.label}>
                {it.label}
              </span>
              <span className="flex items-center gap-2">
                <span className="relative block h-2.5 flex-1">
                  <span
                    className="absolute inset-y-0 left-0 rounded-r-[4px]"
                    style={{ width: `${pct}%`, background: hot ? "#d03b3b" : color, opacity: hot ? 1 : 0.9 }}
                  />
                </span>
                <span className={cn("num w-12 shrink-0 text-right font-semibold", dark ? "text-white" : "text-ink")}>
                  {format(it.value)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

/** A single 100% bar split into a few ordered parts, each labelled beneath. */
export function PartsBar({
  parts,
  caption,
  surface = "light",
}: {
  parts: { label: string; value: number; color: string }[];
  caption: string;
  surface?: "light" | "dark";
}) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const dark = surface === "dark";
  return (
    <figure>
      <figcaption className="sr-only">{caption}</figcaption>
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-[4px]" aria-hidden>
        {parts.map((p) => (
          <span key={p.label} style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />
        ))}
      </div>
      <ul className="mt-3 grid gap-1.5 text-[0.78rem]">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center justify-between gap-3">
            <span className={cn("inline-flex items-center gap-2", dark ? "text-white/75" : "text-ink-2")}>
              <span aria-hidden className="inline-block size-2.5 rounded-[3px]" style={{ background: p.color }} />
              {p.label}
            </span>
            <span className={cn("num font-semibold", dark ? "text-white" : "text-ink")}>
              {Math.round((p.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function DemoNote({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span className={cn("demo-badge", className)}>
      <span aria-hidden className="inline-block size-1.5 rounded-full bg-[#5b4bd6]" />
      {children ?? "Demo data"}
    </span>
  );
}

export { linePath };
