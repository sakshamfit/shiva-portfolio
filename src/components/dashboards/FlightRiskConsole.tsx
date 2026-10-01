"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Circle } from "@phosphor-icons/react/dist/ssr/Circle";
import { Lightbulb } from "@phosphor-icons/react/dist/ssr/Lightbulb";
import Image from "next/image";
import { WORLD_LAND_SRC, WORLD_PORTS, WORLD_VIEWBOX } from "@/content/geo/world.generated";
import { flightSummary, riskLabel, flights, type Flight, type Risk } from "@/content/demo/flight-risk";
import { cn, ease } from "@/lib/utils";

const riskFill: Record<Risk, string> = { low: "#3e83f0", medium: "#fab219", high: "#e05252" };

type Filter = "all" | Risk;

function lane(s: Flight) {
  const [x0, y0] = WORLD_PORTS[s.from];
  const [x1, y1] = WORLD_PORTS[s.to];
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const dist = Math.hypot(x1 - x0, y1 - y0);
  const cx = mx;
  const cy = my - dist * 0.22;
  const t = s.progress;
  const px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
  const py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
  return { d: `M${x0},${y0}Q${cx.toFixed(1)},${cy.toFixed(1)} ${x1},${y1}`, px, py, x0, y0, x1, y1 };
}

function RiskBadge({ risk }: { risk: Risk }) {
  const Icon = risk === "low" ? CheckCircle : WarningCircle;
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-[0.72rem] font-semibold text-white/85">
      <Icon size={14} weight="fill" color={riskFill[risk]} aria-hidden />
      {riskLabel[risk]}
    </span>
  );
}

export function FlightRiskConsole() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState("GRK-10421");
  const [hoverId, setHoverId] = useState<string | null>(null);
  // each marker's tap circle covers at least 24px on screen, however small the map is drawn (phones)
  const mapRef = useRef<SVGSVGElement>(null);
  const [hitR, setHitR] = useState(13);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setHitR(Math.max(13, (12 * WORLD_VIEWBOX.width) / w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visible = useMemo(
    () => flights.filter((s) => filter === "all" || s.risk === filter).sort((a, b) => b.probability - a.probability),
    [filter],
  );
  const selected = flights.find((s) => s.id === selectedId) ?? flights[0];
  const geo = useMemo(() => Object.fromEntries(flights.map((s) => [s.id, lane(s)])), []);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "high", label: "High risk" },
    { id: "medium", label: "Watch" },
    { id: "low", label: "Low" },
  ];

  return (
    <div data-surface="dark" className="overflow-hidden rounded-[20px] border border-white/10 bg-[#081733] text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]">
      {/* top bar */}
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5">
        {/* the demo-data label shows at every size (on phones it wraps under the title) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-white/10">
            <PaperPlaneTilt size={17} weight="bold" />
          </span>
          <div>
            <p className="text-[0.9rem] font-semibold leading-tight">Flight window console</p>
            <p className="text-[0.72rem] text-white/55">Go / no-go risk by planned flight</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-semibold text-[#c9c1ff] sm:ml-1">
            <span aria-hidden className="size-1.5 rounded-full bg-[#9d8cff]" />
            Representative interface, demo data
          </span>
        </div>
        <div role="group" aria-label="Filter flights by risk" className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "tap inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-[0.76rem] font-medium transition-colors",
                filter === f.id ? "bg-white text-[#081733]" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              {f.id !== "all" ? <span aria-hidden className="size-2 rounded-full" style={{ background: riskFill[f.id] }} /> : null}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* summary */}
      <dl className="grid grid-cols-2 border-b border-white/10 md:grid-cols-4">
        {flightSummary.map((m, i) => (
          <div key={m.label} className={cn("flex flex-col-reverse justify-end px-4 py-3.5 md:px-5", i % 2 === 1 && "border-l border-white/10", i >= 2 && "border-t border-white/10 md:border-t-0", i === 2 && "md:border-l")}>
            <dt className="mt-1 text-[0.72rem] text-white/55">
              {m.label}
              {m.note ? <span className="text-white/40">, {m.note}</span> : null}
            </dt>
            <dd className="text-[1.3rem] font-[640] tracking-[-0.02em]">{m.value}</dd>
          </div>
        ))}
      </dl>

      <div>
        {/* map */}
        <div className="relative border-b border-white/10 p-3 md:px-5">
          <div className="relative bg-[radial-gradient(70%_60%_at_50%_40%,rgba(18,58,122,0.55),transparent_75%)]">
          <Image
            src={WORLD_LAND_SRC}
            alt=""
            width={WORLD_VIEWBOX.width}
            height={WORLD_VIEWBOX.height}
            unoptimized
            className="block h-auto w-full select-none"
            draggable={false}
          />
          <svg
            ref={mapRef}
            viewBox={`0 0 ${WORLD_VIEWBOX.width} ${WORLD_VIEWBOX.height}`}
            className="absolute inset-0 h-full w-full"
            role="group"
            aria-label={`Map of ${visible.length} planned flights across the region, coloured by the risk of losing the weather window. The same flights are listed below.`}
          >
            {flights.map((s) => {
              const g = geo[s.id];
              const shown = visible.includes(s);
              const on = s.id === selectedId || s.id === hoverId;
              return (
                <g key={s.id} opacity={shown ? 1 : 0.12} style={{ transition: "opacity 300ms" }}>
                  <path d={g.d} fill="none" stroke={on ? "#ffffff" : riskFill[s.risk]} strokeOpacity={on ? 0.9 : 0.45} strokeWidth={on ? 1.8 : 1.1} strokeDasharray={on ? undefined : "3 4"} />
                  <circle cx={g.x0} cy={g.y0} r="2.6" fill="#8fb6f5" />
                  <circle cx={g.x1} cy={g.y1} r="2.6" fill="#8fb6f5" />
                </g>
              );
            })}
            {flights.map((s) => {
              const g = geo[s.id];
              const shown = visible.includes(s);
              if (!shown) return null;
              const on = s.id === selectedId;
              return (
                <g
                  key={`${s.id}-m`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${s.id}, ${s.fromName} to ${s.toName}, ${riskLabel[s.risk]}`}
                  aria-pressed={on}
                  className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-white"
                  onClick={() => setSelectedId(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(s.id);
                    }
                  }}
                  onPointerEnter={() => setHoverId(s.id)}
                  onPointerLeave={() => setHoverId(null)}
                >
                  <circle cx={g.px} cy={g.py} r={hitR} fill="transparent" stroke="transparent" strokeWidth="2" />
                  {s.risk === "high" ? <circle cx={g.px} cy={g.py} r="10" fill="none" stroke={riskFill.high} strokeOpacity="0.5" strokeWidth="1.2" /> : null}
                  <circle cx={g.px} cy={g.py} r={on ? 7 : 5.5} fill={riskFill[s.risk]} stroke="#081733" strokeWidth="2" />
                </g>
              );
            })}
          </svg>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-[0.72rem] text-white/60" aria-label="Map legend">
            {(["high", "medium", "low"] as Risk[]).map((r) => (
              <li key={r} className="inline-flex items-center gap-1.5">
                <span aria-hidden className="size-2.5 rounded-full" style={{ background: riskFill[r] }} />
                {riskLabel[r]}
              </li>
            ))}
            <li className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-2.5 rounded-full bg-[#8fb6f5]" />
              Base city
            </li>
          </ul>
        </div>

      </div>

      <div className="grid md:grid-cols-[18rem_1fr]">
        {/* list */}
        <div data-lenis-prevent className="max-h-[24rem] overflow-y-auto overscroll-contain border-b border-white/10 p-2 md:max-h-[30rem] md:border-b-0 md:border-r">
          <p className="px-2 pb-2 pt-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/50">
            Planned flights by risk
          </p>
          <ul className="grid gap-1" aria-label="Planned flights">
            {visible.map((s) => {
              const on = s.id === selectedId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelectedId(s.id)}
                    onPointerEnter={() => setHoverId(s.id)}
                    onPointerLeave={() => setHoverId(null)}
                    className={cn(
                      "grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2.5 text-left transition-colors",
                      on ? "bg-white/[0.12]" : "hover:bg-white/[0.06]",
                    )}
                  >
                    <span className="text-[0.8rem] font-semibold">{s.id}</span>
                    <span className="num text-right text-[0.8rem] font-semibold">{Math.round(s.probability * 100)}%</span>
                    <span className="text-[0.74rem] text-white/60">
                      {s.fromName} to {s.toName}
                    </span>
                    <RiskBadge risk={s.risk} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* detail */}
      <div className="p-4 md:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: ease.out }}
            className="grid gap-6 xl:grid-cols-[1fr_16rem]"
            aria-live="polite"
          >
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/50">Selected flight</p>
              <p className="mt-1.5 text-[1.15rem] font-semibold">{selected.id}</p>
              <p className="text-[0.82rem] text-white/70">
                {selected.fromName} to {selected.toName}
              </p>
              <p className="mt-1 text-[0.78rem] text-white/50">{selected.cargo}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.78rem]">
                <div>
                  <dt className="text-white/50">Promised</dt>
                  <dd className="font-semibold">{selected.promised}</dd>
                </div>
                <div>
                  <dt className="text-white/50">Predicted arrival</dt>
                  <dd className="font-semibold">{selected.eta}</dd>
                </div>
              </dl>
            </div>

            <ol className="relative grid content-start gap-3" aria-label="Milestones">
              {selected.milestones.map((m) => (
                <li key={m.label} className="flex items-center gap-3 text-[0.8rem]">
                  {m.status === "done" ? (
                    <CheckCircle size={16} weight="fill" className="shrink-0 text-[#3e83f0]" aria-hidden />
                  ) : m.status === "at-risk" ? (
                    <WarningCircle size={16} weight="fill" className="shrink-0 text-[#e05252]" aria-hidden />
                  ) : (
                    <Circle size={16} weight={m.status === "current" ? "fill" : "regular"} className="shrink-0 text-white/60" aria-hidden />
                  )}
                  <span className={cn("flex-1", m.status === "next" ? "text-white/60" : "text-white")}>{m.label}</span>
                  <span className="num text-white/50">{m.planned}</span>
                  <span className="sr-only">
                    {m.status === "done" ? "completed" : m.status === "at-risk" ? "at risk" : m.status === "current" ? "in progress" : "upcoming"}
                  </span>
                </li>
              ))}
            </ol>
            </div>

            <div className="self-start rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/50">Model output</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-[2rem] font-[640] leading-none tracking-[-0.03em]">{Math.round(selected.probability * 100)}%</span>
                <span className="text-[0.78rem] text-white/60">probability of losing the window</span>
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
                <div className="h-full rounded-full" style={{ width: `${selected.probability * 100}%`, background: riskFill[selected.risk] }} />
              </div>
              <p className="mt-3">
                <RiskBadge risk={selected.risk} />
                {selected.delayDays ? <span className="ml-2 text-[0.76rem] text-white/60">about {selected.delayDays} days later</span> : null}
              </p>
              <p className="mt-3 flex gap-2 border-t border-white/10 pt-3 text-[0.78rem] leading-relaxed text-white/80">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-[#fab219]" aria-hidden />
                {selected.action}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
