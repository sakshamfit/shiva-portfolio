"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr/ArrowCounterClockwise";
import { LineChart } from "@/components/charts/LineChart";
import { DemoNote } from "@/components/charts/primitives";
import { labDefaults, type LabParams } from "@/content/demo/kit";
import { cn, formatMoney, formatNumber, normInv, seeded } from "@/lib/utils";

/** Square-root sign drawn in SVG (the radical glyph is outside the font's Latin subset). */
function Sqrt({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-stretch align-middle">
      <span className="sr-only">square root of </span>
      <svg viewBox="0 0 10 18" preserveAspectRatio="none" className="h-[1.25em] w-[0.62em] shrink-0" aria-hidden>
        <path d="M0.6 10.2 L2.9 9.1 L5.4 16.6 L9.2 1 L10 1" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>
      <span className="border-t border-current px-[0.12em] leading-[1.15]">{children}</span>
    </span>
  );
}

type Control = {
  key: keyof LabParams;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  hint: string;
};

const controls: Control[] = [
  { key: "annualDemand", label: "Units used a year", min: 20, max: 400, step: 5, format: (v) => `${formatNumber(v)} units`, hint: "D" },
  { key: "orderCost", label: "Cost per order", min: 20, max: 300, step: 5, format: (v) => formatMoney(v), hint: "S" },
  { key: "unitCost", label: "Unit cost", min: 5, max: 120, step: 1, format: (v) => formatMoney(v), hint: "C" },
  { key: "holdingRate", label: "Storage & care rate", min: 10, max: 40, step: 1, format: (v) => `${v}% a year`, hint: "h" },
  { key: "leadTime", label: "Supplier lead time", min: 2, max: 40, step: 1, format: (v) => `${v} days`, hint: "L" },
  { key: "demandSd", label: "Monthly draw variability", min: 2, max: 40, step: 1, format: (v) => `${v} units`, hint: "sd" },
  { key: "serviceLevel", label: "Target readiness", min: 85, max: 99.5, step: 0.5, format: (v) => `${v.toFixed(1)}%`, hint: "SL" },
];

function policy(p: LabParams) {
  const d = p.annualDemand / 365;
  const H = (p.unitCost * p.holdingRate) / 100;
  const eoq = Math.sqrt((2 * p.annualDemand * p.orderCost) / H);
  const z = normInv(p.serviceLevel / 100);
  const ss = z * p.demandSd * Math.sqrt(p.leadTime);
  const rop = d * p.leadTime + ss;
  const orders = p.annualDemand / eoq;
  const holding = H * (eoq / 2 + ss);
  const ordering = p.orderCost * orders;
  return { d, H, eoq, z, ss, rop, orders, holding, ordering, total: holding + ordering, cycle: 365 / orders };
}

/** Day-by-day kit stock under the (Q, ROP) policy with seeded draw noise. */
function simulate(p: LabParams, pol: ReturnType<typeof policy>, days = 120) {
  const rnd = seeded(7);
  const gauss = () => {
    let u = 0;
    for (let i = 0; i < 6; i++) u += rnd();
    return u - 3; // ~N(0, 0.707)
  };
  let onHand = pol.ss + pol.eoq;
  const pipeline: { arrive: number; qty: number }[] = [];
  const out: number[] = [];
  for (let day = 0; day < days; day++) {
    for (let i = pipeline.length - 1; i >= 0; i--) {
      if (pipeline[i].arrive === day) {
        onHand += pipeline[i].qty;
        pipeline.splice(i, 1);
      }
    }
    const demand = Math.max(0, pol.d + gauss() * p.demandSd * 1.2);
    onHand = Math.max(0, onHand - demand);
    const onOrder = pipeline.reduce((s, x) => s + x.qty, 0);
    if (onHand + onOrder <= pol.rop) pipeline.push({ arrive: day + p.leadTime, qty: pol.eoq });
    out.push(Math.round(onHand));
  }
  return out;
}

export function KitPlanningLab() {
  const [params, setParams] = useState<LabParams>({ ...labDefaults });
  const deferred = useDeferredValue(params);
  const id = useId();
  const pol = useMemo(() => policy(deferred), [deferred]);
  const sim = useMemo(() => simulate(deferred, pol), [deferred, pol]);
  const days = useMemo(() => sim.map((_, i) => `Day ${i + 1}`), [sim]);

  const cost = useMemo(() => {
    const qs = Array.from({ length: 28 }, (_, i) => Math.round(pol.eoq * (0.25 + i * 0.1)));
    return {
      labels: qs.map((q) => formatNumber(q)),
      holding: qs.map((q) => pol.H * (q / 2 + pol.ss)),
      ordering: qs.map((q) => (deferred.orderCost * deferred.annualDemand) / q),
      total: qs.map((q) => pol.H * (q / 2 + pol.ss) + (deferred.orderCost * deferred.annualDemand) / q),
      eoqIndex: qs.reduce((best, q, i) => (Math.abs(q - pol.eoq) < Math.abs(qs[best] - pol.eoq) ? i : best), 0),
    };
  }, [pol, deferred]);

  const nextSl = Math.min(99.5, params.serviceLevel + 1);
  const ssNext = normInv(nextSl / 100) * params.demandSd * Math.sqrt(params.leadTime);
  const changed = (Object.keys(labDefaults) as (keyof LabParams)[]).some((k) => params[k] !== labDefaults[k]);

  const outputs = [
    { label: "Order quantity", value: `${formatNumber(pol.eoq)} units`, formula: <Sqrt>2DS ÷ H</Sqrt> },
    {
      label: "Spare stock",
      value: `${formatNumber(pol.ss)} units`,
      formula: (
        <>
          z × sd × <Sqrt>L</Sqrt>
        </>
      ),
    },
    { label: "Reorder point", value: `${formatNumber(pol.rop)} units`, formula: "d × L + spare stock" },
    { label: "Orders per year", value: `${pol.orders.toFixed(1)}`, formula: `every ${Math.round(pol.cycle)} days` },
  ];

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[var(--shadow-lift)]">
      <div className="flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[0.9rem] font-semibold text-ink">Kit planning lab</p>
          <DemoNote>Example parameters, not studio data</DemoNote>
        </div>
        <button
          type="button"
          onClick={() => setParams({ ...labDefaults })}
          disabled={!changed}
          className="tap inline-flex h-8 items-center justify-center gap-1.5 self-start rounded-full border border-line px-3 text-[0.76rem] font-medium text-ink-2 transition-colors hover:border-blue hover:text-blue disabled:opacity-40 sm:self-auto"
        >
          <ArrowCounterClockwise size={14} aria-hidden />
          Reset
        </button>
      </div>

      <div className="grid lg:grid-cols-[20rem_1fr]">
        {/* controls */}
        <fieldset className="grid content-start gap-5 border-b border-line bg-mist/60 p-5 lg:border-b-0 lg:border-r">
          <legend className="sr-only">Policy inputs</legend>
          {controls.map((c) => (
            <div key={c.key}>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`${id}-${c.key}`} className="text-[0.8rem] font-medium text-ink">
                  {c.label} <span className="font-normal text-muted">({c.hint})</span>
                </label>
                <output htmlFor={`${id}-${c.key}`} className="num text-[0.8rem] font-semibold text-navy">
                  {c.format(params[c.key])}
                </output>
              </div>
              <input
                id={`${id}-${c.key}`}
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={params[c.key]}
                onChange={(e) => setParams((p) => ({ ...p, [c.key]: Number(e.target.value) }))}
                className="range tap mt-2 w-full"
                style={{ ["--fill" as string]: `${((params[c.key] - c.min) / (c.max - c.min)) * 100}%` }}
              />
            </div>
          ))}
          <p className="rounded-lg border border-line bg-white p-3 text-[0.78rem] leading-relaxed text-ink-2">
            Readiness has a rising price: moving from {params.serviceLevel.toFixed(1)}% to {nextSl.toFixed(1)}% adds about{" "}
            <strong className="text-ink">{formatNumber(Math.max(0, ssNext - pol.ss))} units</strong> of spare stock.
          </p>
        </fieldset>

        {/* outputs + charts */}
        <div className="grid gap-6 p-4 md:p-6">
          <dl className="grid grid-cols-2 gap-2.5 xl:grid-cols-4" aria-live="polite">
            {outputs.map((o) => (
              <div key={o.label} className="flex flex-col-reverse justify-end rounded-xl border border-line p-3.5">
                <dt className="mt-1.5 text-[0.74rem] leading-snug text-muted">
                  {o.label}
                  <span className="num mt-1 block text-[0.72rem] text-ink-2">{o.formula}</span>
                </dt>
                <dd className="text-[1.2rem] font-[640] tracking-[-0.02em] text-ink">{o.value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-[0.9rem] font-semibold text-ink">Kit stock over 120 days</p>
            <p className="mb-3 text-[0.78rem] text-muted">An order goes out when stock plus what is already on order reach the reorder point</p>
            <LineChart
              title="Simulated kit stock over 120 days"
              summary={`Stock cycles between about ${formatNumber(pol.ss)} and ${formatNumber(pol.ss + pol.eoq)} units; the reorder point is ${formatNumber(pol.rop)} units.`}
              labels={days}
              series={[{ id: "stock", label: "Kit stock", color: "#145fe5", values: sim, area: true }]}
              band={{ lower: sim.map(() => 0), upper: sim.map(() => pol.ss), label: "Spare stock", color: "#0e9aa7" }}
              threshold={{ value: pol.rop, label: `Reorder point ${formatNumber(pol.rop)}` }}
              format={(v) => formatNumber(v)}
              curve="linear"
              height={210}
              xTickEvery={20}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_15rem]">
            <div>
              <p className="text-[0.9rem] font-semibold text-ink">Annual cost by order quantity</p>
              <p className="mb-3 text-[0.78rem] text-muted">Total cost is lowest at the economic order quantity</p>
              <LineChart
                title="Annual holding, ordering and total cost by order quantity"
                summary={`Total cost is lowest near ${formatNumber(pol.eoq)} units per order, at about ${formatMoney(pol.total)} a year.`}
                labels={cost.labels}
                series={[
                  { id: "holding", label: "Holding", color: "#145fe5", values: cost.holding },
                  { id: "ordering", label: "Ordering", color: "#e0930b", values: cost.ordering },
                  { id: "total", label: "Total", color: "#0e9aa7", values: cost.total },
                ]}
                markers={[{ index: cost.eoqIndex, label: "EOQ" }]}
                format={(v) => formatMoney(v)}
                yDomain={[0, Math.max(...cost.total) * 1.05]}
                height={200}
                xTickEvery={6}
              />
            </div>
            <dl className="grid content-start gap-3 rounded-xl border border-line bg-mist/60 p-4 text-[0.8rem]">
              {[
                ["Holding cost", pol.holding],
                ["Ordering cost", pol.ordering],
                ["Total a year", pol.total],
              ].map(([l, v]) => (
                <div key={l as string} className={cn("flex items-baseline justify-between gap-3", l === "Total a year" && "border-t border-line pt-3")}>
                  <dt className="text-ink-2">{l}</dt>
                  <dd className="num font-semibold text-ink">{formatMoney(v as number)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
