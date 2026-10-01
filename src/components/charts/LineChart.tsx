"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Table } from "@phosphor-icons/react/dist/ssr/Table";
import { ChartLine } from "@phosphor-icons/react/dist/ssr/ChartLine";
import { cn, niceTicks, smoothPath, linePath } from "@/lib/utils";

export type Series = {
  id: string;
  label: string;
  color: string;
  values: number[];
  dashed?: boolean;
  /** draws a 10% wash under the line */
  area?: boolean;
};

type Props = {
  series: Series[];
  labels: string[];
  height?: number;
  format?: (v: number) => string;
  yDomain?: [number, number];
  threshold?: { value: number; label: string };
  band?: { lower: number[]; upper: number[]; label: string; color: string };
  markers?: { index: number; label: string }[];
  title: string;
  summary: string;
  surface?: "light" | "dark";
  curve?: "smooth" | "linear";
  className?: string;
  xTickEvery?: number;
};

/**
 * Accessible line chart: SVG strokes scale with the container (non-scaling strokes),
 * text and markers are HTML so they never distort. Hover or arrow keys move a
 * crosshair; every value is also available in the table view.
 */
export function LineChart({
  series,
  labels,
  height = 240,
  format = (v) => String(Math.round(v)),
  yDomain,
  threshold,
  band,
  markers,
  title,
  summary,
  surface = "light",
  curve = "smooth",
  className,
  xTickEvery,
}: Props) {
  const id = useId();
  const plotRef = useRef<HTMLDivElement>(null);
  const [plotWidth, setPlotWidth] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const n = labels.length;
  const dark = surface === "dark";

  const { y0, y1, ticks } = useMemo(() => {
    const all = series.flatMap((s) => s.values);
    if (band) all.push(...band.lower, ...band.upper);
    if (threshold) all.push(threshold.value);
    let lo = yDomain ? yDomain[0] : Math.min(...all);
    let hi = yDomain ? yDomain[1] : Math.max(...all);
    if (!yDomain) {
      const pad = (hi - lo) * 0.12 || 1;
      lo = Math.max(0, lo - pad);
      hi = hi + pad;
    }
    const t = niceTicks(lo, hi, 4);
    return { y0: Math.min(lo, t[0]), y1: Math.max(hi, t[t.length - 1]), ticks: t };
  }, [series, band, threshold, yDomain]);

  const X = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const Y = (v: number) => 100 - ((v - y0) / (y1 - y0 || 1)) * 100;
  const path = (vals: number[]) => {
    const pts = vals.map((v, i) => [X(i), Y(v)] as [number, number]);
    return curve === "smooth" ? smoothPath(pts, 0.35) : linePath(pts);
  };

  const onPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setActive(Math.round(f * (n - 1)));
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => {
        const cur = a ?? (e.key === "ArrowRight" ? -1 : n);
        return Math.min(n - 1, Math.max(0, cur + (e.key === "ArrowRight" ? 1 : -1)));
      });
    } else if (e.key === "Home") {
      setActive(0);
    } else if (e.key === "End") {
      setActive(n - 1);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  };

  // Measure the plot so tick density follows the real width (phones get fewer labels).
  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setPlotWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [showTable]);

  const longest = labels.reduce((m, l) => Math.max(m, l.length), 1);
  const requested = xTickEvery ?? Math.max(1, Math.ceil(n / 7));
  const fit = plotWidth ? Math.max(2, Math.floor(plotWidth / (longest * 6.4 + 18))) : n;
  const every = Math.max(requested, Math.ceil(n / fit));
  const tickIdx = useMemo(() => {
    const t: number[] = [];
    for (let i = 0; i < n; i += every) t.push(i);
    const lastTick = t[t.length - 1];
    if (lastTick !== n - 1) {
      if (n - 1 - lastTick >= every * 0.6) t.push(n - 1);
      else t[t.length - 1] = n - 1;
    }
    return new Set(t);
  }, [n, every]);
  const ink = dark ? "text-white/60" : "text-muted";
  const grid = dark ? "bg-white/10" : "bg-line-soft";

  return (
    <figure className={cn("relative", className)} aria-labelledby={`${id}-t`}>
      <figcaption className="sr-only" id={`${id}-t`}>
        {title}. {summary}
      </figcaption>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {series.length > 1 ? (
          <ul className={cn("flex flex-wrap gap-x-4 gap-y-1 text-[0.78rem]", dark ? "text-white/75" : "text-ink-2")}>
            {series.map((s) => (
              <li key={s.id} className="inline-flex items-center gap-2">
                <svg width="18" height="6" aria-hidden>
                  <line
                    x1="1"
                    y1="3"
                    x2="17"
                    y2="3"
                    stroke={s.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={s.dashed ? "4 3" : undefined}
                  />
                </svg>
                {s.label}
              </li>
            ))}
            {band ? (
              <li className="inline-flex items-center gap-2">
                <span aria-hidden className="inline-block h-2.5 w-4 rounded-sm" style={{ background: band.color, opacity: 0.25 }} />
                {band.label}
              </li>
            ) : null}
          </ul>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-pressed={showTable}
          className={cn(
            "tap inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-3 text-[0.75rem] font-medium transition-colors",
            dark
              ? "border-white/15 text-white/75 hover:border-white/40 hover:text-white"
              : "border-line text-ink-2 hover:border-blue hover:text-blue",
          )}
        >
          {showTable ? <ChartLine size={14} aria-hidden /> : <Table size={14} aria-hidden />}
          {showTable ? "Chart view" : "Table view"}
        </button>
      </div>

      {showTable ? (
        <div data-lenis-prevent className="max-h-[22rem] overflow-auto overscroll-contain rounded-lg border border-line/60">
          <table className={cn("w-full text-left text-[0.8rem]", dark ? "text-white/85" : "text-ink-2")}>
            <caption className="sr-only">{title}</caption>
            <thead className={cn("sticky top-0", dark ? "bg-[#0b1a33]" : "bg-mist")}>
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  Period
                </th>
                {series.map((s) => (
                  <th key={s.id} scope="col" className="px-3 py-2 text-right font-semibold">
                    {s.label}
                  </th>
                ))}
                {threshold ? (
                  <th scope="col" className="px-3 py-2 text-right font-semibold">
                    {threshold.label}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="num">
              {labels.map((l, i) => (
                <tr key={l + i} className={dark ? "border-t border-white/10" : "border-t border-line-soft"}>
                  <th scope="row" className="px-3 py-1.5 font-medium">
                    {l}
                  </th>
                  {series.map((s) => (
                    <td key={s.id} className="px-3 py-1.5 text-right">
                      {format(s.values[i])}
                    </td>
                  ))}
                  {threshold ? <td className="px-3 py-1.5 text-right">{format(threshold.value)}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative pl-11 pr-2" style={{ height }}>
          {/* y grid + ticks */}
          {ticks.map((t) => (
            <div key={t} className="absolute left-11 right-2" style={{ top: `${Y(t)}%` }} aria-hidden>
              <div className={cn("h-px w-full", grid)} />
              <span className={cn("num absolute -left-11 -translate-y-1/2 text-[0.7rem]", ink)} style={{ width: "2.5rem", textAlign: "right" }}>
                {format(t)}
              </span>
            </div>
          ))}

          {/* plot */}
          <div
            ref={plotRef}
            className="absolute inset-y-0 left-11 right-2 cursor-crosshair touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-blue/60"
            tabIndex={0}
            role="img"
            aria-label={`${title}. ${summary} Use the left and right arrow keys to read values.`}
            onPointerMove={onPointer}
            onPointerLeave={() => setActive(null)}
            onPointerDown={onPointer}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
          >
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {band ? (
                <path
                  d={`${linePath(band.upper.map((v, i) => [X(i), Y(v)]))}L${[...band.lower]
                    .map((v, i) => [X(i), Y(v)] as [number, number])
                    .reverse()
                    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
                    .join("L")}Z`}
                  fill={band.color}
                  opacity={0.16}
                />
              ) : null}
              {threshold ? (
                <line
                  x1="0"
                  x2="100"
                  y1={Y(threshold.value)}
                  y2={Y(threshold.value)}
                  stroke={dark ? "#f0a36c" : "#d03b3b"}
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
              {series.map((s) =>
                s.area ? (
                  <path key={`${s.id}-a`} d={`${path(s.values)}L100,100L0,100Z`} fill={s.color} opacity={0.1} />
                ) : null,
              )}
              {series.map((s) => (
                <path
                  key={s.id}
                  d={path(s.values)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={s.dashed ? "6 5" : undefined}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {threshold ? (
              <span
                className={cn(
                  "absolute right-0 -translate-y-[125%] rounded px-1.5 py-px text-[0.68rem] font-semibold",
                  dark ? "bg-[#0b1a33]/85 text-[#f5b489]" : "bg-white/90 text-status-critical",
                )}
                style={{ top: `${Y(threshold.value)}%` }}
                aria-hidden
              >
                {threshold.label}
              </span>
            ) : null}

            {markers?.map((m) => (
              <span
                key={m.index}
                aria-hidden
                className={cn("absolute top-0 h-full w-px", dark ? "bg-white/20" : "bg-ink/15")}
                style={{ left: `${X(m.index)}%` }}
              >
                <span className={cn("absolute -top-1 left-1 whitespace-nowrap text-[0.66rem] font-medium", ink)}>{m.label}</span>
              </span>
            ))}

            {/* end dots */}
            {series.map((s) => (
              <span
                key={`${s.id}-end`}
                aria-hidden
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${X(n - 1)}%`,
                  top: `${Y(s.values[n - 1])}%`,
                  background: s.color,
                  boxShadow: `0 0 0 2px ${dark ? "#0b1a33" : "#fff"}`,
                }}
              />
            ))}

            {active !== null ? (
              <>
                <span
                  aria-hidden
                  className={cn("pointer-events-none absolute inset-y-0 w-px", dark ? "bg-white/40" : "bg-ink/30")}
                  style={{ left: `${X(active)}%` }}
                />
                {series.map((s) => (
                  <span
                    key={`${s.id}-dot`}
                    aria-hidden
                    className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      left: `${X(active)}%`,
                      top: `${Y(s.values[active])}%`,
                      background: s.color,
                      boxShadow: `0 0 0 2px ${dark ? "#0b1a33" : "#fff"}`,
                    }}
                  />
                ))}
                <div
                  className={cn(
                    "pointer-events-none absolute top-1 z-10 min-w-[9.5rem] rounded-lg border px-3 py-2 text-[0.75rem] shadow-lg",
                    dark ? "border-white/15 bg-[#0e2140] text-white" : "border-line bg-white text-ink",
                  )}
                  style={
                    X(active) > 60
                      ? { right: `calc(${100 - X(active)}% + 12px)` }
                      : { left: `calc(${X(active)}% + 12px)` }
                  }
                  role="status"
                  aria-live="polite"
                >
                  <p className={cn("mb-1 font-medium", ink)}>{labels[active]}</p>
                  {series.map((s) => (
                    <p key={s.id} className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span aria-hidden className="inline-block h-[2px] w-3 rounded" style={{ background: s.color }} />
                        <span className={dark ? "text-white/70" : "text-ink-2"}>{s.label}</span>
                      </span>
                      <span className="num font-semibold">{format(s.values[active])}</span>
                    </p>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {/* x labels */}
          <div className="absolute inset-x-0 -bottom-6 left-11 right-2" aria-hidden>
            {labels.map((l, i) =>
              tickIdx.has(i) ? (
                <span
                  key={l + i}
                  className={cn("num absolute -translate-x-1/2 whitespace-nowrap text-[0.7rem]", ink)}
                  style={{ left: `${X(i)}%` }}
                >
                  {l}
                </span>
              ) : null,
            )}
          </div>
        </div>
      )}
      {!showTable ? <div className="h-7" aria-hidden /> : null}
    </figure>
  );
}
