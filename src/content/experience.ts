/**
 * Professional experience for Shiva.
 *
 * TODO: these two roles are written as placeholders in Shiva's own field — replace the
 * company names, dates, numbers and bullets with the real history before launch.
 */

export type Kpi = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Optional grouping for thousands, e.g. 50000 -> "50,000". */
  group?: boolean;
  icon: "clock" | "database" | "chart" | "users" | "funnel" | "list" | "gear" | "presentation";
};

export type Role = {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  startISO: string;
  endISO: string;
  context: string;
  achievements: string[];
  accomplishment: string;
  kpis: Kpi[];
  tools: string[];
  /** Studio / employer mark. */
  logo: { src: string; width: number; height: number };
};

export const experience: Role[] = [
  {
    id: "aerial-practice",
    company: "Independent practice",
    role: "Drone Photographer & Aerial Cinematographer",
    location: "Gorakhpur, Uttar Pradesh",
    start: "2021",
    end: "Present",
    startISO: "2021-01",
    endISO: "2026-10",
    context: "Aerial films, stills, mapping and site documentation, planned, flown, graded and delivered in-house.",
    achievements: [
      "Shot aerial and ground coverage for 60+ projects: hotel and resort films, real-estate launches, construction progress, farmland surveys and wedding features across Uttar Pradesh and Bihar.",
      "Logged 500+ flights behind a written pre-flight routine — airspace and weather check, battery plan, manual pass before any automated run — with a perfect safety record.",
      "Built the studio's post-production pipeline: on-site dual backups, Lightroom culling, Resolve grading and Premiere timelines that return graded stills in 48 hours and edited films within the week.",
    ],
    accomplishment:
      "One crew covering both air and ground, so clients get a finished film, a still set and vertical cutdowns instead of raw footage.",
    kpis: [
      { value: 500, suffix: "+", label: "Flights logged", icon: "clock" },
      { value: 60, suffix: "+", label: "Projects delivered", icon: "list" },
      { value: 48, suffix: "h", label: "Stills turnaround", icon: "gear" },
      { value: 12, suffix: "+", label: "Districts covered", icon: "users" },
    ],
    tools: ["DJI drones", "Full-frame mirrorless", "Lightroom Classic", "DaVinci Resolve", "Premiere Pro", "DJI Terra"],
    logo: { src: "/images/logos/aerial-practice.webp", width: 276, height: 225 },
  },
  {
    id: "camera-specialist",
    company: "Camera house & studio",
    role: "Camera Specialist — Sales, Service & Studio",
    location: "Gorakhpur, Uttar Pradesh",
    start: "2018",
    end: "2021",
    startISO: "2018-01",
    endISO: "2021-12",
    context: "Camera retail, equipment support and studio work: advising buyers, servicing bodies and lenses, assisting on shoots.",
    achievements: [
      "Advised 1,000+ customers on bodies, lenses and accessories, matching kits to how each person actually shoots rather than to the spec sheet.",
      "Serviced and maintained DSLR and mirrorless systems — sensor cleaning, lens calibration and basic repairs — and set up a check-list every rental body left the counter with.",
      "Assisted on studio and event shoots: lighting setups, gimbal work, tethered capture and on-set data wrangling for photographers who did not have a second pair of hands.",
    ],
    accomplishment:
      "Learned the gear from the inside out: what survives a full season in the field, what fails first, and what a working photographer actually needs to carry.",
    kpis: [
      { value: 1000, suffix: "+", label: "Customers advised", icon: "users", group: true },
      { value: 3, label: "Years on the counter and in the studio", icon: "clock" },
      { value: 100, suffix: "%", label: "Rental bodies leaving with a check-list", icon: "list" },
      { value: 20, suffix: "+", label: "Shoots assisted behind the scenes", icon: "presentation" },
    ],
    tools: ["DSLR & mirrorless systems", "Lens service", "Studio lighting", "Gimbals", "Tethered capture"],
    logo: { src: "/images/logos/camera-house.webp", width: 324, height: 111 },
  },
];

/** The pipeline behind every commission, from recce to hand-over. */
export const flightPipeline = [
  { id: "recce", title: "Recce & permits", detail: "Location, light, airspace", note: "Planned the day before" },
  { id: "fly", title: "Fly & capture", detail: "Manual + automated passes", note: "Stills and 4K/6K film" },
  { id: "backup", title: "On-site backup", detail: "Dual cards + SSD", note: "Verified before leaving site" },
  { id: "edit", title: "Edit", detail: "Lightroom + Premiere", note: "Culled, cut, reviewed" },
  { id: "grade", title: "Grade", detail: "DaVinci Resolve", note: "One look across every camera" },
  { id: "deliver", title: "Deliver", detail: "Stills, film, verticals", note: "48h stills, 5–7 day film" },
] as const;

/** What keeps the kit reliable: three habits, from the equipment log. */
export const kitFunnel = [
  { label: "Pre-flight checks before take-off", value: "Every flight" },
  { label: "Battery cycles tracked", value: "Cycle log" },
  { label: "Backups verified on site", value: "Two copies" },
] as const;
