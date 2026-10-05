/**
 * About section content for Shiva.
 *
 * The five "links of the chain" become the five stages of a shoot: plan, fly, frame, post, deliver.
 * Portrait files are cutouts: transparent WebP, same canvas as the original frame.
 * TODO: these photographs are AI-generated placeholders — replace the files in
 * /public/images/portraits with Shiva's own pictures (keep the file names and the alpha channel).
 */

export type PortraitId = "operations" | "office" | "suit" | "field" | "casual";

export type Domain = {
  id: string;
  stage: string;
  title: string;
  points: string[];
  portrait: PortraitId;
};

export const portraits: Record<
  PortraitId,
  { src: string; width: number; height: number; alt: string }
> = {
  suit: {
    src: "/images/portraits/suit.webp",
    width: 530,
    height: 1644,
    alt: "Shiva in a dark blazer, arms folded, holding a drone remote controller",
  },
  operations: {
    src: "/images/portraits/operations.webp",
    width: 422,
    height: 1166,
    alt: "Shiva in a field jacket holding a camera drone ready for take-off",
  },
  office: {
    src: "/images/portraits/office.webp",
    width: 380,
    height: 1210,
    alt: "Shiva in a white shirt with a full-frame camera on a shoulder strap",
  },
  field: {
    src: "/images/portraits/field.webp",
    width: 482,
    height: 1160,
    alt: "Shiva piloting a drone with the controller raised, watching the aircraft",
  },
  casual: {
    src: "/images/portraits/casual.webp",
    width: 410,
    height: 1132,
    alt: "Shiva in a casual overshirt holding a mirrorless camera",
  },
};

/**
 * The "field deck" that stands to the right of the portrait on the About stage: what a shoot
 * produces, the readouts behind it, and the kit that goes in the bag. Written to be read in one
 * glance, top to bottom.
 */
export const workDeck = {
  label: "Field notes",
  title: "What I shoot",
  services: [
    { id: "films", title: "Aerial films", text: "Reveals, orbits, tracks" },
    { id: "stills", title: "Aerial stills", text: "Print, listing, ad frames" },
    { id: "mapping", title: "Mapping", text: "Orthomosaics, 3D models" },
    { id: "progress", title: "Site progress", text: "One view, each month" },
  ] as const,
  note: {
    hand: "Book 10 days ahead",
    fine: "Nov–Feb · 6.10–7.40 am",
  },
  hud: {
    label: "Last flight",
    rec: "REC 12:48",
    caption: "Hotel roof, Gorakhpur — golden hour",
    readouts: [
      { id: "alt", label: "ALT", value: "92", unit: "m" },
      { id: "sat", label: "SAT", value: "21", unit: "" },
      { id: "iso", label: "ISO", value: "100", unit: "" },
      { id: "wind", label: "WIND", value: "6", unit: "kt" },
    ],
    /* link and battery strength, out of four bars */
    bars: [
      { id: "link", label: "Link", value: 3 },
      { id: "battery", label: "Battery", value: 4 },
    ],
  },
} as const;

/** The five stages of the work, each tied to something Shiva actually does. */
export const domains: Domain[] = [
  {
    id: "plan",
    stage: "Plan",
    title: "Pre-production",
    points: ["Location recce and shot lists", "Airspace, permit and weather checks", "Storyboards agreed with the client"],
    portrait: "casual",
  },
  {
    id: "fly",
    stage: "Fly",
    title: "Drone operations",
    points: ["DGCA-compliant flight planning", "Manual and automated passes", "Safety checks before every take-off"],
    portrait: "field",
  },
  {
    id: "frame",
    stage: "Frame",
    title: "Camera craft",
    points: ["Full-frame and mirrorless systems", "Lens choice for air and ground", "Exposure held through changing light"],
    portrait: "office",
  },
  {
    id: "post",
    stage: "Post",
    title: "Edit and colour",
    points: ["Aerial stills in Lightroom", "Colour grading in DaVinci Resolve", "Films cut in Premiere Pro"],
    portrait: "operations",
  },
  {
    id: "deliver",
    stage: "Deliver",
    title: "Delivery and care",
    points: ["Stills, films and vertical cuts", "Every flight backed up twice", "Usage rights in writing"],
    portrait: "suit",
  },
];

/** "Why choose me?": five reasons, each backed by how the studio actually works. */
export const whyChooseMe = {
  eyebrow: "Air and ground, one crew",
  statement: ["One visit, one crew, one look", "across every frame."],
  body:
    "Flying, camera work and the edit stay in the same pair of hands, so the film, the stills and the vertical cutdowns all match when they reach the client.",
  corners: { left: ["Drone", "photographer"], right: ["Fly", "Frame", "Grade", "Deliver"] },
  reasons: [
    {
      id: "aerial",
      title: "Aerial and ground in one pass",
      text: "Drone, gimbal and stills camera on every shoot, so a single visit gives you the wide establishing shots and the close detail.",
    },
    {
      id: "camera",
      title: "Camera craft",
      text: "Full-frame bodies, fast primes and ND kits chosen per shot: exposure and colour checked on location, not patched up in post.",
    },
    {
      id: "safety",
      title: "Safe, permitted flying",
      text: "Airspace and weather checks before every take-off, flown inside DGCA limits, with a written pre-flight routine on every job.",
    },
    {
      id: "delivery",
      title: "Same-week delivery",
      text: "Backups on the day, graded stills within 48 hours and edited films within the week, in 16:9 and 9:16.",
    },
    {
      id: "local",
      title: "Local knowledge, wider reach",
      text: "Based in Gorakhpur and shooting across Uttar Pradesh and Bihar: ghats, farmland, construction sites, hotels, weddings and everything between.",
    },
  ],
  stats: [
    { value: 500, suffix: "+", label: "Flights logged" },
    { value: 60, suffix: "+", label: "Projects delivered" },
    { value: 12, suffix: "+", label: "Districts covered" },
    { symbol: "∞", label: "Continuous practice" },
  ],
} as const;

export const aboutCopy = {
  headline: ["Flying the frame.", "Telling your story."],
  lead:
    "I'm Shiva, a drone photographer and camera specialist based in Gorakhpur. I shoot aerial films and stills for brands, builders, hotels, farmland and events — and I look after every camera and drone that makes them.",
  body:
    "My work sits where flying skill meets camera craft: planning a shot around the light and the airspace, flying it smoothly, then grading and cutting it into something a client can actually use. I fly permitted missions over Uttar Pradesh and Bihar, keep the gear serviced and colour-managed, and deliver stills, aerial films and vertical cutdowns with the usage rights in writing.",
  facts: [
    { value: "500+", label: "Flights logged, Gorakhpur and beyond" },
    { value: "DGCA", label: "Compliant flying — add certificate details" },
    { value: "48 hours", label: "Typical turnaround on graded stills" },
  ],
} as const;
