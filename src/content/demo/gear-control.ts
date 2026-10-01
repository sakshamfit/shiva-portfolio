/**
 * DEMONSTRATION DATA for the gear control room view.
 * Item names, service partners and alert texts are illustrative and are labelled as demo
 * data wherever they appear. The studio facts (every item logged by serial, service rules
 * per item type, alerts to the phone) describe how the kit is actually tracked.
 */
import type { Status } from "@/components/charts/primitives";

export const weeks = Array.from({ length: 12 }, (_, i) => `Wk ${i + 1}`);

export type CtKpi = {
  id: string;
  name: string;
  value: string;
  target: string;
  status: Status;
  series: number[];
  unit: string;
  higherIsBetter: boolean;
  threshold?: number;
  rule: string;
  workflow: string;
};

export const ctKpis: CtKpi[] = [
  {
    id: "battery-cycles",
    name: "Battery cycles used",
    value: "412",
    target: "Limit: 500 cycles",
    status: "warning",
    series: [318, 326, 334, 345, 351, 360, 369, 378, 384, 392, 403, 412],
    unit: "cycles",
    higherIsBetter: false,
    threshold: 470,
    rule: "Warn the pilot when a battery passes 470 cycles so it becomes a ground-only pack.",
    workflow: "power",
  },
  {
    id: "card-life",
    name: "Card write life used",
    value: "64%",
    target: "Limit: 80%",
    status: "good",
    series: [38, 41, 44, 46, 49, 52, 55, 57, 59, 61, 63, 64],
    unit: "%",
    higherIsBetter: false,
    threshold: 80,
    rule: "Retire a card once it passes 80% of its write life, or 18 months of service.",
    workflow: "storage",
  },
  {
    id: "spares",
    name: "Spare props in stock",
    value: "2 sets",
    target: "Minimum: 4 sets",
    status: "critical",
    series: [7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2],
    unit: "sets",
    higherIsBetter: true,
    threshold: 4,
    rule: "Order props whenever stock drops below four sets: they break on site, never at home.",
    workflow: "airframe",
  },
  {
    id: "reorder",
    name: "Consumables to reorder",
    value: "6 items",
    target: "Next order: 3 days",
    status: "warning",
    series: [2, 3, 3, 4, 3, 5, 4, 6, 5, 7, 6, 6],
    unit: "items",
    higherIsBetter: false,
    rule: "A weekly list goes to the vendor account: batteries, props, cards, filters, gimbal mounts.",
    workflow: "procurement",
  },
  {
    id: "unbacked",
    name: "Files not yet backed up",
    value: "0 GB",
    target: "Limit: 0 GB",
    status: "good",
    series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    unit: "GB",
    higherIsBetter: false,
    threshold: 0,
    rule: "Cards are only reformatted after two verified copies exist and the checksums match.",
    workflow: "archive",
  },
  {
    id: "service",
    name: "Service due, next 30 days",
    value: "2 items",
    target: "Bookings held: 2",
    status: "warning",
    series: [1, 1, 2, 2, 1, 2, 3, 2, 2, 1, 2, 2],
    unit: "items",
    higherIsBetter: false,
    rule: "Lenses and bodies are booked into the service centre before a wedding season, not during it.",
    workflow: "optics",
  },
  {
    id: "booked",
    name: "Shoot days booked, next 4 weeks",
    value: "14 days",
    target: "Up 3 days on the last month",
    status: "info",
    series: [9, 10, 10, 11, 12, 11, 12, 13, 12, 13, 14, 14],
    unit: "days",
    higherIsBetter: true,
    rule: "Feeds the battery and card plan: how many packs and cards are actually needed that month.",
    workflow: "logistics",
  },
  {
    id: "ontime",
    name: "Edits delivered on time",
    value: "96.4%",
    target: "Target: 95%",
    status: "good",
    series: [93.1, 94.0, 94.6, 95.2, 95.0, 95.8, 96.1, 96.0, 96.4, 96.2, 96.5, 96.4],
    unit: "%",
    higherIsBetter: true,
    threshold: 95,
    rule: "Alert when the delivery promise slips: stills inside 48 hours, films inside the week.",
    workflow: "delivery",
  },
];

export type Workflow = {
  id: string;
  name: string;
  trigger: string;
  steps: string[];
  outputs: string[];
  kpis: string[];
};

/** The seven areas of the kit log; the configuration shown is an illustrative design. */
export const workflows: Workflow[] = [
  {
    id: "power",
    name: "Batteries",
    trigger: "After every flight day",
    steps: ["Read the cycle log", "Check charge and cell balance", "Flag packs near the limit"],
    outputs: ["Alert the pilot", "Update the pack list"],
    kpis: ["battery-cycles"],
  },
  {
    id: "storage",
    name: "Cards & storage",
    trigger: "Daily",
    steps: ["Read card write history", "Check free space on the archive", "Flag cards due to retire"],
    outputs: ["Alert before a shoot", "Update the card register"],
    kpis: ["card-life", "unbacked"],
  },
  {
    id: "airframe",
    name: "Drone airframe",
    trigger: "Weekly",
    steps: ["Log airframe hours", "Check props, motors and gimbal", "Flag the spares list"],
    outputs: ["Alert the pilot", "Update the spares list"],
    kpis: ["spares"],
  },
  {
    id: "procurement",
    name: "Consumables",
    trigger: "Weekly",
    steps: ["Compare stock with order points", "Size the order", "Build the vendor list"],
    outputs: ["Order list to the vendor", "Update the spend log"],
    kpis: ["reorder"],
  },
  {
    id: "optics",
    name: "Optics & bodies",
    trigger: "Monthly",
    steps: ["Read shutter counts and service dates", "Check sensor cleanliness", "Book the service slot"],
    outputs: ["Service booking", "Update the service log"],
    kpis: ["service"],
  },
  {
    id: "logistics",
    name: "Shoot logistics",
    trigger: "Before each shoot",
    steps: ["Read the booked days", "Size batteries and cards", "Pack against the call sheet"],
    outputs: ["Kit list for the day", "Alert on missing items"],
    kpis: ["booked"],
  },
  {
    id: "delivery",
    name: "Delivery & archive",
    trigger: "Monday morning",
    steps: ["Verify two backups", "Check the delivery clock", "Summarise the week"],
    outputs: ["Archive confirmation", "Weekly summary to the studio"],
    kpis: ["unbacked", "ontime", "battery-cycles", "card-life", "spares", "reorder", "service", "booked"],
  },
];

/** Service partners and vendors: on-time returns, days late, annual spend and a risk score. */
export const partners = [
  { name: "Airframe service centre", category: "Drone service", onTime: 96.1, daysLate: 0.6, spend: 2140, risk: 22 },
  { name: "Optics workshop", category: "Lens service", onTime: 93.4, daysLate: 1.2, spend: 1680, risk: 31 },
  { name: "Battery importer", category: "Power", onTime: 94.8, daysLate: 0.9, spend: 640, risk: 27 },
  { name: "Card & storage vendor", category: "Storage", onTime: 91.2, daysLate: 1.8, spend: 520, risk: 38 },
  { name: "Filter supplier", category: "Optics", onTime: 88.6, daysLate: 2.7, spend: 1390, risk: 52 },
  { name: "Gimbal parts", category: "Spares", onTime: 86.9, daysLate: 3.1, spend: 760, risk: 58 },
  { name: "Courier for gear", category: "Freight", onTime: 84.3, daysLate: 3.9, spend: 910, risk: 66 },
  { name: "Body repair workshop", category: "Repair", onTime: 78.5, daysLate: 5.4, spend: 1180, risk: 74 },
];

export const turnaround = [
  { label: "Same day", value: 64, color: "#145fe5" },
  { label: "1 to 2 days", value: 21, color: "#8fb6f5" },
  { label: "3 to 5 days", value: 11, color: "#e0930b" },
  { label: "More than 5 days", value: 4, color: "#d03b3b" },
];

export type Alert = {
  id: string;
  status: Status;
  title: string;
  detail: string;
  to: string;
  when: string;
  workflow: string;
};

export const alerts: Alert[] = [
  {
    id: "a1",
    status: "critical",
    title: "Spare props below the minimum",
    detail: "2 sets in the case against a minimum of 4. Two shoot days booked this week.",
    to: "Studio lead",
    when: "Today, 06:02",
    workflow: "Drone airframe",
  },
  {
    id: "a2",
    status: "serious",
    title: "Battery pack near its cycle limit",
    detail: "Pack B-07 is at 412 cycles. It becomes a ground-only pack past 470.",
    to: "Pilot",
    when: "Today, 06:05",
    workflow: "Batteries",
  },
  {
    id: "a3",
    status: "warning",
    title: "Service booking due",
    detail: "24-70mm due a clean and calibration before the wedding season.",
    to: "Studio lead",
    when: "Mon, 07:10",
    workflow: "Optics & bodies",
  },
  {
    id: "a4",
    status: "warning",
    title: "Delivery clock at 6 days",
    detail: "Two films are on day 6 of the 7-day promise.",
    to: "Editor",
    when: "Today, 08:00",
    workflow: "Delivery & archive",
  },
  {
    id: "a5",
    status: "good",
    title: "Consumables order list ready",
    detail: "6 items at their order point: 4 props sets, 2 cards, 3 filters.",
    to: "Vendor account",
    when: "Today, 06:10",
    workflow: "Consumables",
  },
  {
    id: "a6",
    status: "info",
    title: "Weekly kit report sent",
    detail: "8 numbers with 3 exceptions highlighted.",
    to: "Studio",
    when: "Mon, 08:30",
    workflow: "Delivery & archive",
  },
];
