/**
 * Case studies for Shiva's photography and studio work.
 *
 * Framing copy (challenge, objective, relevance) describes how each job is run; the numbers
 * are the studio's own placeholders — TODO: check them against Shiva's real records.
 *
 * Interactive figures used in the case pages live in /src/content/demo and are always
 * labelled on screen as demonstration data.
 */

export type ResultKind = "delivered" | "model" | "simulated" | "modelled";

export type ProjectCategory = "aerial" | "stills" | "mapping" | "systems";

export const projectCategories: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "aerial", label: "Aerial film" },
  { id: "stills", label: "Photography" },
  { id: "mapping", label: "Mapping & docs" },
  { id: "systems", label: "Studio systems" },
];

export type ProjectResult = {
  value: string;
  label: string;
  kind: ResultKind;
  note?: string;
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  oneLiner: string;
  tools: string[];
  tags: string[];
  challenge: string;
  objective: string;
  approach: { title: string; text: string }[];
  capabilities: string[];
  results: ProjectResult[];
  relevance: string;
  /** Card image. */
  thumbnail: { src: string; width: number; height: number };
  /** One-sentence card summary. */
  cardSummary: string;
  cardTags: string[];
  categories: ProjectCategory[];
};

export const resultKindLabel: Record<ResultKind, string> = {
  delivered: "Shot and delivered",
  model: "From the planning model",
  simulated: "Demonstration figure",
  modelled: "Planned figure",
};

export const projects: Project[] = [
  {
    slug: "aerial-films",
    index: "01",
    title: "Aerial Films for Hotels, Builders & Brands",
    shortTitle: "Aerial films",
    oneLiner:
      "Drone films and stills for hospitality, real estate and brand campaigns around Gorakhpur — planned shot by shot, flown in one visit and graded in-house.",
    tools: ["DJI Mavic 3 Pro", "Full-frame mirrorless", "Premiere Pro", "DaVinci Resolve", "Lightroom Classic"],
    tags: ["Aerial film", "Brand campaign", "Stills"],
    challenge:
      "A brand film usually means two crews — a drone pilot for the wide establishing shots and a camera team for the ground detail — plus a separate edit. That is two site visits, two bills, and footage that never quite matches when it is cut together.",
    objective:
      "Cover an entire campaign in a single visit: aerial and ground, film and stills, graded to one look and delivered in both horizontal and vertical.",
    approach: [
      {
        title: "Fly the story first",
        text: "A recce sets the sun path, the airspace and the angles; the client signs off a shot list before anyone drives to the location.",
      },
      {
        title: "Shoot air and ground in one pass",
        text: "Drone, gimbal and stills camera together, with matched picture profiles and white balance so the two angles cut cleanly.",
      },
      {
        title: "Grade and cut in-house",
        text: "Stills are culled in Lightroom, the film is cut in Premiere Pro and every camera is matched in DaVinci Resolve, then delivered in 16:9 and 9:16.",
      },
    ],
    capabilities: ["Flight planning", "Aerial cinematography", "Ground coverage and stills", "Edit and colour"],
    results: [
      { value: "60+", label: "Projects shot and delivered", kind: "delivered" },
      {
        value: "48h",
        label: "Graded stills after the shoot",
        kind: "delivered",
        note: "The film follows within the week, in horizontal and vertical cuts.",
      },
    ],
    relevance:
      "The same one-visit approach fits hotel and resort films, real-estate launches, event aftermovies and tourism films across Uttar Pradesh and Bihar.",
    thumbnail: { src: "/images/projects/thumb-films.jpg", width: 300, height: 268 },
    cardSummary:
      "Aerial and ground coverage in a single visit: drone, gimbal and stills camera shot to one look, then graded and cut in-house.",
    cardTags: ["DJI Mavic", "Premiere Pro", "Resolve", "Lightroom"],
    categories: ["aerial", "stills"],
  },
  {
    slug: "aerial-mapping",
    index: "02",
    title: "Aerial Mapping & Site Inspection",
    shortTitle: "Mapping & inspection",
    oneLiner:
      "Orthomosaics, 3D site models and inspection passes for construction, solar and farmland — the same grid and the same angles, every visit.",
    tools: ["Mapping drone", "DJI Terra", "Photogrammetry", "Lightroom"],
    tags: ["Mapping", "Photogrammetry", "Inspection"],
    challenge:
      "A progress report built from hand-held photos is hard to compare month to month: different angle, different light, different scale. Everyone spends the meeting working out whether the site actually changed.",
    objective:
      "Fly the same grid, the same altitude and the same camera settings on every visit, so each month's capture stacks directly over the last one.",
    approach: [
      {
        title: "Grid and ground control",
        text: "Waypoint lines are planned over the site boundary with ground markers, and flown only inside a safe weather and wind window.",
      },
      {
        title: "Capture and process",
        text: "Overlapping frames are stitched into a centimetre-accurate orthomosaic and, where the site calls for it, a 3D model of progress.",
      },
      {
        title: "Compare and report",
        text: "Month-on-month overlays, measured areas and volumes, and annotated stills the site team can read without training.",
      },
    ],
    capabilities: ["Mission planning", "Photogrammetry", "Repeatable flight lines", "Inspection reporting"],
    results: [
      { value: "12+", label: "Sites documented on a repeat cycle", kind: "delivered" },
      {
        value: "8",
        label: "Grid passes flown per site visit",
        kind: "delivered",
        note: "The same lines, altitude and settings every time, so the captures stack cleanly.",
      },
    ],
    relevance:
      "Used for construction progress, solar-plant inspection and farmland planning, where the value is in the comparison rather than in a single pretty frame.",
    thumbnail: { src: "/images/projects/thumb-mapping.jpg", width: 274, height: 268 },
    cardSummary:
      "Repeatable flight grids flown over construction, solar and farmland sites, processed into orthomosaics and month-on-month comparisons.",
    cardTags: ["Photogrammetry", "DJI Terra", "Grid missions"],
    categories: ["mapping", "aerial"],
  },
  {
    slug: "kit-management",
    index: "03",
    title: "Camera & Drone Kit Management",
    shortTitle: "Kit management",
    oneLiner:
      "How the gear is tracked, serviced and planned: batteries by cycle count, cards by write history, bodies and lenses by service date — plus a planning lab for consumables.",
    tools: ["Google Sheets", "n8n", "Lightroom Classic", "Serial logs"],
    tags: ["Operations", "Maintenance", "Planning"],
    challenge:
      "Shooting every week means the failure points are boring ones: a battery past its cycle limit, a card that has been reformatted one time too many, a lens that has been due a service since the last wedding.",
    objective:
      "Track every body, lens, battery, card and filter against its own service and replacement rules, and plan the consumables so a shoot is never held up for want of a spare.",
    approach: [
      {
        title: "Log every item",
        text: "Each body, lens, drone, battery, card and filter is logged by serial with its own rules: cycle limit, service interval, replacement trigger.",
      },
      {
        title: "Automate the checks",
        text: "A daily check reads the flight and shoot logs, flags anything near a limit and sends the warning to the phone before the next call sheet goes out.",
      },
      {
        title: "Plan the consumables",
        text: "Cards, batteries and filters are planned with the same order-point thinking a warehouse uses — the lab below shows how the numbers move.",
      },
    ],
    capabilities: ["Gear tracking", "Maintenance rules", "Consumable planning", "Alerting"],
    results: [
      { value: "120+", label: "Items tracked by serial", kind: "delivered" },
      {
        value: "48h",
        label: "Notice before a battery or card hits its limit",
        kind: "delivered",
        note: "Enough time to swap the item out or order a replacement before a shoot.",
      },
    ],
    relevance:
      "Gear discipline is the reason the same kit is still reliable after 500+ flights and a full wedding season.",
    thumbnail: { src: "/images/projects/thumb-kit.jpg", width: 280, height: 268 },
    cardSummary:
      "Every body, lens, battery and card tracked by serial against its own service and replacement rules, with a planning lab for consumables.",
    cardTags: ["Sheets", "n8n", "Maintenance", "Planning"],
    categories: ["systems"],
  },
  {
    slug: "progress-documentation",
    index: "04",
    title: "Progress Documentation for Builders",
    shortTitle: "Site documentation",
    oneLiner:
      "Monthly aerial documentation for construction and real-estate projects: the same flight lines and angles, delivered as an annotated set the client can file, share or print.",
    tools: ["Drone", "Lightroom", "Premiere Pro", "Client gallery"],
    tags: ["Documentation", "Real estate", "Timelapse"],
    challenge:
      "Builders and developers need a visual record of progress for investors, buyers and their own team — and hand-held photographs taken from wherever someone could stand are impossible to compare over a twelve-month build.",
    objective:
      "Give every project a fixed visual record: the same viewpoints each month, plus a time-lapse that shows the whole build in a minute.",
    approach: [
      {
        title: "Fix the viewpoints",
        text: "Permanent markers and saved waypoints keep every flight aligned to the same eight viewpoints across the whole build.",
      },
      {
        title: "Document the site, not just the building",
        text: "Boundary and access, earthworks, structure, materials storage and safety observations are captured in the same pass.",
      },
      {
        title: "Deliver a fileable set",
        text: "A dated gallery of graded stills, a one-minute progress film and the month-on-month overlays, ready for an investor pack.",
      },
    ],
    capabilities: ["Repeatable viewpoints", "Construction documentation", "Time-lapse editing", "Client delivery"],
    results: [
      { value: "8", label: "Fixed viewpoints per site visit", kind: "delivered" },
      {
        value: "12 months",
        label: "Typical documentation run for a build",
        kind: "delivered",
        note: "Same angles from foundation to hand-over, so progress reads at a glance.",
      },
    ],
    relevance:
      "The questions this documentation answers are the ones a developer's investor pack asks: how far along, how fast, and what changed this month.",
    thumbnail: { src: "/images/projects/thumb-progress.jpg", width: 600, height: 361 },
    cardSummary:
      "Monthly flyovers from fixed viewpoints, delivered as a dated still set, a progress film and month-on-month overlays for the investor pack.",
    cardTags: ["Documentation", "Time-lapse", "Real estate"],
    categories: ["mapping", "aerial"],
  },
];

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<string, Project>;
