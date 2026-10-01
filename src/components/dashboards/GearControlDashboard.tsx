"use client";

import { useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Gauge } from "@phosphor-icons/react/dist/ssr/Gauge";
import { TreeStructure } from "@phosphor-icons/react/dist/ssr/TreeStructure";
import { Handshake } from "@phosphor-icons/react/dist/ssr/Handshake";
import { BellRinging } from "@phosphor-icons/react/dist/ssr/BellRinging";
import { Timer } from "@phosphor-icons/react/dist/ssr/Timer";
import { Table } from "@phosphor-icons/react/dist/ssr/Table";
import { Code } from "@phosphor-icons/react/dist/ssr/Code";
import { GitBranch } from "@phosphor-icons/react/dist/ssr/GitBranch";
import { ChartBar } from "@phosphor-icons/react/dist/ssr/ChartBar";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { LineChart } from "@/components/charts/LineChart";
import { BarList, DemoNote, PartsBar, Sparkline, StatusBadge } from "@/components/charts/primitives";
import { alerts, ctKpis, partners, turnaround, weeks, workflows } from "@/content/demo/gear-control";
import { cn, ease } from "@/lib/utils";

type TabId = "kpis" | "workflows" | "suppliers" | "alerts";

const tabs: { id: TabId; label: string; Icon: typeof Gauge }[] = [
  { id: "kpis", label: "Sentinel numbers", Icon: Gauge },
  { id: "workflows", label: "Kit logs", Icon: TreeStructure },
  { id: "suppliers", label: "Service partners", Icon: Handshake },
  { id: "alerts", label: "Alerts", Icon: BellRinging },
];

const kpiById = Object.fromEntries(ctKpis.map((k) => [k.id, k]));

function KpiPanel() {
  const [selected, setSelected] = useState("spares");
  const k = kpiById[selected];
  const fmt = (v: number) => (k.unit === "%" ? `${v.toFixed(1)}%` : `${Math.round(v * 10) / 10}`);
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4" role="group" aria-label="Monitored numbers">
        {ctKpis.map((kpi) => {
          const on = kpi.id === selected;
          return (
            <button
              key={kpi.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(kpi.id)}
              className={cn(
                "group relative flex min-h-[8.6rem] flex-col rounded-xl border p-3.5 text-left transition-[border-color,box-shadow,background-color] duration-200",
                on ? "border-blue bg-blue-100/40 shadow-[0_0_0_1px_var(--color-blue)]" : "border-line bg-white hover:border-blue/50",
              )}
            >
              <span className="text-[0.74rem] font-medium leading-tight text-ink-2">{kpi.name}</span>
              <span className="mt-2 text-[1.2rem] font-[640] leading-none tracking-[-0.02em] text-ink">{kpi.value}</span>
              <span className="mt-auto flex items-end justify-between gap-2 pt-3">
                <StatusBadge status={kpi.status} />
                <Sparkline values={kpi.series} width={64} height={24} color={kpi.status === "critical" ? "#d03b3b" : "#145fe5"} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 rounded-xl border border-line bg-white p-4 md:p-5 lg:grid-cols-[1fr_16rem]">
        <div>
          <p className="text-[0.9rem] font-semibold text-ink">{k.name}, last 12 weeks</p>
          <p className="text-[0.78rem] text-muted">{k.target}</p>
          <div className="mt-4">
            <LineChart
              key={k.id}
              title={`${k.name} over 12 weeks`}
              summary={`Currently ${k.value}. ${k.target}.`}
              labels={weeks}
              series={[{ id: k.id, label: k.name, color: k.status === "critical" ? "#d03b3b" : "#145fe5", values: k.series, area: true }]}
              threshold={k.threshold !== undefined ? { value: k.threshold, label: `Limit ${fmt(k.threshold)}` } : undefined}
              format={fmt}
              height={200}
            />
          </div>
        </div>
        <aside className="grid content-start gap-4 border-t border-line pt-4 text-[0.82rem] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div>
            <p className="font-semibold text-ink">Alert rule</p>
            <p className="mt-1 leading-relaxed text-ink-2">{k.rule}</p>
          </div>
          <div>
            <p className="font-semibold text-ink">Owned by workflow</p>
            <p className="mt-1 text-ink-2">{workflows.find((w) => w.id === k.workflow)?.name}</p>
          </div>
          <div>
            <p className="font-semibold text-ink">Current status</p>
            <p className="mt-1">
              <StatusBadge status={k.status} />
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

const stepIcons = [Table, Code, GitBranch];

function WorkflowPanel() {
  const [selected, setSelected] = useState("power");
  const reduce = useReducedMotion();
  const wf = workflows.find((w) => w.id === selected)!;
  return (
    <div className="grid gap-5 lg:grid-cols-[13.5rem_1fr]">
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-1" aria-label="Kit logs">
        {workflows.map((w, i) => {
          const on = w.id === selected;
          return (
            <li key={w.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(w.id)}
                className={cn(
                  "tap flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[0.82rem] font-medium transition-colors",
                  on ? "bg-navy text-white" : "text-ink-2 hover:bg-mist",
                )}
              >
                <span className={cn("num text-[0.7rem]", on ? "text-white/70" : "text-muted")}>{String(i + 1).padStart(2, "0")}</span>
                {w.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="rounded-xl border border-line bg-white bg-[radial-gradient(circle,#dde5ef_1px,transparent_1.3px)] bg-[length:18px_18px] p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.95rem] font-semibold text-ink">{wf.name} workflow</p>
          <span className="text-[0.75rem] text-muted">Example configuration</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.ol
            key={wf.id}
            className="mt-5 grid gap-3 md:grid-cols-[repeat(5,minmax(0,1fr))] md:gap-0"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: ease.out }}
            aria-label={`${wf.name} workflow steps`}
          >
            <FlowNode Icon={Timer} kind="Trigger" label={wf.trigger} first />
            {wf.steps.map((s, i) => (
              <FlowNode key={s} Icon={stepIcons[i]} kind={i === 0 ? "Kit log" : i === 1 ? "Rules" : "IF"} label={s} />
            ))}
            <li className="relative flex flex-col gap-2 md:pl-3">
              {wf.outputs.map((o) => (
                <span
                  key={o}
                  className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5 text-[0.78rem] font-medium text-ink shadow-[var(--shadow-soft)]"
                >
                  {o.toLowerCase().includes("alert") ? (
                    <ChartBar size={16} className="text-blue" aria-hidden />
                  ) : (
                    <EnvelopeSimple size={16} className="text-blue" aria-hidden />
                  )}
                  {o}
                </span>
              ))}
            </li>
          </motion.ol>
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="text-[0.78rem] font-semibold text-ink">KPIs covered</span>
          {wf.kpis.map((id) => (
            <span key={id} className="tag !text-[0.74rem]">
              {kpiById[id].name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlowNode({ Icon, kind, label, first }: { Icon: typeof Timer; kind: string; label: string; first?: boolean }) {
  return (
    <li className="relative flex items-stretch md:pr-3">
      {!first ? (
        <span aria-hidden className="absolute -left-0 top-1/2 hidden h-px w-3 -translate-x-full bg-navy/40 md:block" />
      ) : null}
      <div className="flex w-full flex-col gap-1.5 rounded-lg border border-line bg-white px-3 py-2.5 shadow-[var(--shadow-soft)]">
        <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-blue">
          <Icon size={14} aria-hidden />
          {kind}
        </span>
        <span className="text-[0.78rem] leading-snug text-ink">{label}</span>
      </div>
      <CaretRight size={12} aria-hidden className="absolute -right-0.5 top-1/2 hidden -translate-y-1/2 text-navy/50 md:block" />
    </li>
  );
}

function PartnerPanel() {
  const totalSpend = partners.reduce((s, x) => s + x.spend, 0);
  const onTime = partners.reduce((s, x) => s + x.onTime * x.spend, 0) / totalSpend;
  const highRisk = partners.filter((s) => s.risk > 70);
  const highRiskSpend = highRisk.reduce((s, x) => s + x.spend, 0) / totalSpend;
  const avgLate = partners.reduce((s, x) => s + x.daysLate, 0) / partners.length;
  const byLate = [...partners].sort((a, b) => b.daysLate - a.daysLate);
  const tiles = [
    { label: "Jobs returned on time, spend-weighted", value: `${onTime.toFixed(1)}%` },
    { label: "Average delay when late", value: `${avgLate.toFixed(1)} days` },
    { label: "Partners above risk limit", value: `${highRisk.length} of ${partners.length}` },
    { label: "Spend with high-risk partners", value: `${(highRiskSpend * 100).toFixed(1)}%` },
  ];
  return (
    <div className="grid gap-4">
      <dl className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="flex flex-col-reverse justify-end rounded-xl border border-line bg-white p-3.5">
            <dt className="mt-1.5 text-[0.74rem] leading-snug text-muted">{t.label}</dt>
            <dd className="text-[1.2rem] font-[640] tracking-[-0.02em] text-ink">{t.value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="text-[0.88rem] font-semibold text-ink">Average days late, by partner</p>
          <p className="mb-4 text-[0.76rem] text-muted">Where slow returns put a shoot date at risk</p>
          <BarList
            items={byLate.map((s) => ({ label: s.name, value: s.daysLate }))}
            format={(v) => v.toFixed(1)}
            caption="Average days late by service partner"
          />
        </div>
        <div className="grid gap-4">
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-[0.88rem] font-semibold text-ink">Turnaround times</p>
            <p className="mb-4 text-[0.76rem] text-muted">Share of jobs returned, last quarter</p>
            <PartsBar parts={turnaround} caption="Service turnaround distribution" />
          </div>
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="mb-3 text-[0.88rem] font-semibold text-ink">Highest risk scores</p>
            <ul className="grid gap-2 text-[0.8rem]">
              {[...partners]
                .sort((a, b) => b.risk - a.risk)
                .slice(0, 3)
                .map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-3">
                    <span className="text-ink-2">
                      {s.name} <span className="text-muted">({s.category})</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="num font-semibold text-ink">{s.risk}</span>
                      <StatusBadge status={s.risk > 70 ? "critical" : s.risk > 55 ? "warning" : "good"} label={s.risk > 70 ? "Escalate" : s.risk > 55 ? "Watch" : "Stable"} />
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertPanel() {
  return (
    <ul className="grid gap-2.5" aria-label="Automated email alerts">
      {alerts.map((a) => (
        <li key={a.id} className="grid gap-2 rounded-xl border border-line bg-white p-4 md:grid-cols-[9rem_1fr_auto] md:items-center md:gap-5">
          <StatusBadge status={a.status} />
          <div>
            <p className="text-[0.88rem] font-semibold text-ink">{a.title}</p>
            <p className="mt-0.5 text-[0.8rem] text-ink-2">{a.detail}</p>
          </div>
          <div className="text-[0.76rem] text-muted md:text-right">
            <p>
              <EnvelopeSimple size={13} className="mr-1 inline -translate-y-px" aria-hidden />
              {a.to}
            </p>
            <p className="mt-0.5">
              {a.workflow}, {a.when}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function GearControlDashboard() {
  const [tab, setTab] = useState<TabId>("kpis");
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const counts = useMemo(
    () => ({ alerts: alerts.filter((a) => a.status === "critical" || a.status === "serious" || a.status === "warning").length }),
    [],
  );

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-mist shadow-[var(--shadow-lift)]">
      <div className="flex flex-col gap-3 border-b border-line bg-white px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-navy text-white">
            <Gauge size={17} weight="bold" />
          </span>
          <div>
            <p className="text-[0.9rem] font-semibold leading-tight text-ink">Kit & Flight Control Room</p>
            <p className="text-[0.72rem] text-muted">7 kit logs, 8 numbers, alerts to the phone</p>
          </div>
          <DemoNote className="ml-1 hidden sm:inline-flex">Representative interface, demo data</DemoNote>
        </div>
        {/* phones: all four views side by side as a segmented control (icon over label); wider: a pill row */}
        <div role="tablist" aria-label="Kit control room views" className="grid grid-cols-4 gap-1 sm:-mx-1 sm:flex sm:overflow-x-auto sm:px-1 sm:pb-0.5">
          {tabs.map((t, i) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`${baseId}-tab-${t.id}`}
                aria-selected={on}
                aria-controls={`${baseId}-panel-${t.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "tap relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-center text-[0.7rem] font-medium leading-tight transition-colors",
                  "sm:inline-flex sm:h-9 sm:shrink-0 sm:pointer-fine:min-h-0 sm:flex-row sm:gap-2 sm:rounded-full sm:px-3.5 sm:py-0 sm:text-[0.8rem]",
                  on ? "text-white" : "text-ink-2 hover:bg-mist",
                )}
              >
                {on ? (
                  <motion.span layoutId={`${baseId}-pill`} className="absolute inset-0 rounded-xl bg-navy sm:rounded-full" transition={{ duration: 0.35, ease: ease.out }} />
                ) : null}
                <t.Icon size={15} className="relative" aria-hidden />
                <span className="relative">{t.label}</span>
                {t.id === "alerts" ? (
                  <span
                    className={cn(
                      "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.66rem] font-bold max-sm:absolute max-sm:right-1 max-sm:top-1 sm:relative",
                      on ? "bg-white text-navy" : "bg-status-critical text-white",
                    )}
                  >
                    {counts.alerts}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      <DemoNote className="mx-4 mt-3 sm:hidden">Representative interface, demo data</DemoNote>

      <div className="p-3 md:p-5">
        {tabs.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`${baseId}-panel-${t.id}`}
            aria-labelledby={`${baseId}-tab-${t.id}`}
            hidden={tab !== t.id}
            tabIndex={0}
            className="outline-none"
          >
            {tab === t.id ? (
              t.id === "kpis" ? (
                <KpiPanel />
              ) : t.id === "workflows" ? (
                <WorkflowPanel />
              ) : t.id === "suppliers" ? (
                <PartnerPanel />
              ) : (
                <AlertPanel />
              )
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
