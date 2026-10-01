/**
 * DEMONSTRATION DATA for the flight-window console.
 * Flights, sites and probabilities are illustrative. The studio facts (go / no-go decided
 * on wind, rain and light; the same flight lines reused on every visit) are shown
 * separately, with their scope stated.
 */
import type { HubId } from "@/content/geo/world.generated";

export type Risk = "low" | "medium" | "high";

export type Flight = {
  id: string;
  from: HubId;
  to: HubId;
  fromName: string;
  toName: string;
  progress: number; // 0..1 along the route
  risk: Risk;
  probability: number; // modelled probability of losing the window
  delayDays: number; // likely slippage in days if the window is lost
  eta: string;
  promised: string;
  cargo: string;
  milestones: { label: string; planned: string; status: "done" | "current" | "next" | "at-risk" }[];
  action: string;
};

export const riskColor: Record<Risk, string> = {
  low: "#3e83f0",
  medium: "#c98500",
  high: "#e05252",
};

export const riskLabel: Record<Risk, string> = {
  low: "Green window",
  medium: "Watch",
  high: "Likely lost",
};

const ms = (steps: [string, string, "done" | "current" | "next" | "at-risk"][]) =>
  steps.map(([label, planned, status]) => ({ label, planned, status }));

export const flights: Flight[] = [
  {
    id: "GRK-10421",
    from: "gorakhpur",
    to: "varanasi",
    fromName: "Gorakhpur",
    toName: "Varanasi ghats",
    progress: 0.58,
    risk: "high",
    probability: 0.82,
    delayDays: 4,
    eta: "14 Oct",
    promised: "10 Oct",
    cargo: "Sunrise ghat sequence, 3 batteries",
    milestones: ms([
      ["Call sheet confirmed", "12 Sep", "done"],
      ["Recce and permissions", "15 Sep", "done"],
      ["Batteries charged and logged", "22 Sep", "done"],
      ["Weather window opens", "01 Oct", "at-risk"],
      ["Flight day", "10 Oct", "next"],
      ["Graded delivery", "12 Oct", "next"],
    ]),
    action: "Hold a backup date and warn the client that the sunrise window is likely to slip.",
  },
  {
    id: "GRK-10388",
    from: "gorakhpur",
    to: "ayodhya",
    fromName: "Gorakhpur",
    toName: "Ayodhya riverfront",
    progress: 0.4,
    risk: "medium",
    probability: 0.47,
    delayDays: 2,
    eta: "09 Oct",
    promised: "07 Oct",
    cargo: "Riverfront progress stills, 8 fixed viewpoints",
    milestones: ms([
      ["Call sheet confirmed", "15 Sep", "done"],
      ["Permissions requested", "19 Sep", "done"],
      ["Wind check, 48 hours out", "27 Sep", "current"],
      ["Flight day", "07 Oct", "next"],
      ["Stills delivered", "09 Oct", "next"],
    ]),
    action: "Watch the afternoon wind; the morning slot is the safer half of the day.",
  },
  {
    id: "GRK-10456",
    from: "gorakhpur",
    to: "lumbini",
    fromName: "Gorakhpur",
    toName: "Lumbini",
    progress: 0.72,
    risk: "low",
    probability: 0.11,
    delayDays: 0,
    eta: "03 Oct",
    promised: "04 Oct",
    cargo: "Monastery district, vertical and horizontal cuts",
    milestones: ms([
      ["Call sheet confirmed", "10 Sep", "done"],
      ["Border and permit checks", "18 Sep", "done"],
      ["Kit packed and checked", "25 Sep", "current"],
      ["Flight day", "03 Oct", "next"],
      ["First cut delivered", "04 Oct", "next"],
    ]),
    action: "No action needed.",
  },
  {
    id: "GRK-10402",
    from: "gorakhpur",
    to: "kushinagar",
    fromName: "Gorakhpur",
    toName: "Kushinagar",
    progress: 0.3,
    risk: "medium",
    probability: 0.39,
    delayDays: 2,
    eta: "18 Oct",
    promised: "16 Oct",
    cargo: "Heritage walk film, gimbal and drone",
    milestones: ms([
      ["Call sheet confirmed", "20 Sep", "done"],
      ["Shot list approved", "24 Sep", "done"],
      ["Weather watch", "30 Sep", "current"],
      ["Flight day", "16 Oct", "next"],
    ]),
    action: "Keep the tripod pass as a fallback if the wind stays up.",
  },
  {
    id: "GRK-10477",
    from: "varanasi",
    to: "prayagraj",
    fromName: "Varanasi",
    toName: "Prayagraj",
    progress: 0.66,
    risk: "high",
    probability: 0.74,
    delayDays: 5,
    eta: "20 Oct",
    promised: "15 Oct",
    cargo: "Sangam panorama, two-battery grid",
    milestones: ms([
      ["Call sheet confirmed", "08 Sep", "done"],
      ["Permissions filed", "14 Sep", "done"],
      ["Restricted airspace review", "28 Sep", "at-risk"],
      ["Flight day", "15 Oct", "next"],
      ["Delivery", "17 Oct", "next"],
    ]),
    action: "Move the grid to a non-restricted window and tell the client the date is at risk.",
  },
  {
    id: "GRK-10415",
    from: "gorakhpur",
    to: "dehradun",
    fromName: "Gorakhpur",
    toName: "Dehradun",
    progress: 0.52,
    risk: "low",
    probability: 0.16,
    delayDays: 0,
    eta: "06 Oct",
    promised: "06 Oct",
    cargo: "Valley campaign, two-day shoot",
    milestones: ms([
      ["Call sheet confirmed", "18 Sep", "done"],
      ["Travel and stay booked", "22 Sep", "done"],
      ["Battery plan for altitude", "01 Oct", "current"],
      ["Flight day", "06 Oct", "next"],
    ]),
    action: "No action needed.",
  },
  {
    id: "GRK-10433",
    from: "gorakhpur",
    to: "patna",
    fromName: "Gorakhpur",
    toName: "Patna",
    progress: 0.84,
    risk: "low",
    probability: 0.09,
    delayDays: 0,
    eta: "02 Oct",
    promised: "03 Oct",
    cargo: "Hotel campaign, interior and aerial",
    milestones: ms([
      ["Call sheet confirmed", "05 Sep", "done"],
      ["Interior lighting plan", "16 Sep", "done"],
      ["Flight day", "02 Oct", "current"],
      ["Delivery", "03 Oct", "next"],
    ]),
    action: "No action needed.",
  },
  {
    id: "GRK-10461",
    from: "gorakhpur",
    to: "nainital",
    fromName: "Gorakhpur",
    toName: "Nainital",
    progress: 0.46,
    risk: "medium",
    probability: 0.52,
    delayDays: 3,
    eta: "17 Oct",
    promised: "14 Oct",
    cargo: "Lake and hillside film, sunrise call",
    milestones: ms([
      ["Call sheet confirmed", "16 Sep", "done"],
      ["Permit applied for", "21 Sep", "done"],
      ["Altitude and wind check", "30 Sep", "at-risk"],
      ["Flight day", "14 Oct", "next"],
    ]),
    action: "Confirm the permit number before travelling; keep a lakeside fallback shot.",
  },
  {
    id: "GRK-10449",
    from: "gorakhpur",
    to: "lucknow",
    fromName: "Gorakhpur",
    toName: "Lucknow",
    progress: 0.62,
    risk: "low",
    probability: 0.14,
    delayDays: 0,
    eta: "01 Oct",
    promised: "02 Oct",
    cargo: "Rooftop and skyline stills",
    milestones: ms([
      ["Call sheet confirmed", "19 Sep", "done"],
      ["Permissions for the rooftop", "23 Sep", "done"],
      ["Flight day", "01 Oct", "current"],
    ]),
    action: "No action needed.",
  },
  {
    id: "GRK-10470",
    from: "gorakhpur",
    to: "agra",
    fromName: "Gorakhpur",
    toName: "Agra",
    progress: 0.35,
    risk: "low",
    probability: 0.2,
    delayDays: 0,
    eta: "08 Oct",
    promised: "08 Oct",
    cargo: "Heritage exterior, early slot",
    milestones: ms([
      ["Call sheet confirmed", "22 Sep", "done"],
      ["Restricted-area permit", "26 Sep", "done"],
      ["Flight day", "08 Oct", "next"],
    ]),
    action: "No action needed.",
  },
];

export const flightSummary = [
  { label: "Flights planned, next 30 days", value: "34" },
  { label: "Windows likely lost", value: "6", note: "18% of planned" },
  { label: "Backup dates held", value: "9" },
  { label: "Permits outstanding", value: "2" },
];

/**
 * Delivery promise in the studio's own numbers: stills inside 48 hours, films inside the
 * week. Shown as an index (baseline = 100) so no absolute rates are invented.
 */
export const simulation = { baseline: 100, withModel: 82 } as const;
