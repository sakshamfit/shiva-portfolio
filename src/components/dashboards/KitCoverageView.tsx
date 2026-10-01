"use client";

import { CalendarCheck } from "@phosphor-icons/react/dist/ssr/CalendarCheck";
import { LineChart } from "@/components/charts/LineChart";
import { BarList, DemoNote } from "@/components/charts/primitives";
import { bases, coverageTiles, kitDraw, months, bookedDays, workTypes } from "@/content/demo/kit";

export function KitCoverageView() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-mist shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 md:px-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-navy text-white">
            <CalendarCheck size={17} weight="bold" />
          </span>
          <div>
            <p className="text-[0.9rem] font-semibold leading-tight text-ink">Coverage view</p>
            <p className="text-[0.72rem] text-muted">Shoot days and kit draw, rolling 12 months</p>
          </div>
        </div>
        <DemoNote>Representative interface, demo data</DemoNote>
      </div>

      <div className="grid gap-3 p-3 md:p-5">
        <dl className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {coverageTiles.map((t) => (
            <div key={t.label} className="flex flex-col-reverse justify-end rounded-xl border border-line bg-white p-3.5">
              <dt className="mt-1.5 text-[0.74rem] text-muted">{t.label}</dt>
              <dd className="text-[1.15rem] font-[640] tracking-[-0.02em] text-ink">{t.value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-[0.88rem] font-semibold text-ink">Shoot days by base</p>
            <p className="mb-4 text-[0.76rem] text-muted">Days shot, last 12 months</p>
            <BarList items={bases} format={(v) => `${v}`} caption="Shoot days by base city" />
          </div>
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-[0.88rem] font-semibold text-ink">Shoots by work type</p>
            <p className="mb-4 text-[0.76rem] text-muted">Jobs delivered, last 12 months</p>
            <BarList items={workTypes} format={(v) => `${v}`} caption="Jobs delivered by work type" />
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-4 md:p-5">
          <p className="text-[0.88rem] font-semibold text-ink">Booked days and kit draw</p>
          <p className="mb-3 text-[0.76rem] text-muted">Battery packs drawn against days booked, per month. Gear is ordered ahead of the busy season, not during it.</p>
          <LineChart
            title="Monthly booked days and battery packs drawn"
            summary="Booked days rise through the year; the packs drawn follow them with a wider swing around the wedding season."
            labels={months}
            series={[
              { id: "booked", label: "Days booked", color: "#145fe5", values: bookedDays },
              { id: "draw", label: "Packs drawn", color: "#e0930b", values: kitDraw },
            ]}
            format={(v) => `${v}`}
            height={210}
            xTickEvery={1}
          />
        </div>
      </div>
    </div>
  );
}
