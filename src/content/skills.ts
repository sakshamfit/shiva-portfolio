/**
 * Skills, grouped the way a flying-shooting-grading job actually divides up.
 * No proficiency ratings: each capability is backed by an example of where it was used.
 *
 * TODO: swap any tool names for the ones Shiva really shoots with.
 */

export type CapabilityId = "flying" | "camera" | "cinema" | "post" | "studio";

export type Capability = {
  id: CapabilityId;
  index: string;
  title: string;
  summary: string;
  skills: string[];
  evidence: string[];
};

export const capabilities: Capability[] = [
  {
    id: "flying",
    index: "01",
    title: "Drone Operations & Aerial Capture",
    summary: "Flying safely and repeatably — the part that makes every shot afterwards possible.",
    skills: [
      "DJI Mavic, Air and Mini class drones",
      "Manual and automated flight modes",
      "Waypoint and grid missions",
      "Airspace and DGCA compliance",
      "Pre-flight safety routine",
      "Battery and signal management",
      "Low-light and night flying",
      "Emergency procedures",
    ],
    evidence: [
      "500+ flights logged behind a written pre-flight routine",
      "Repeatable grid missions for monthly site documentation",
      "12+ sites mapped into orthomosaics and 3D models",
    ],
  },
  {
    id: "camera",
    index: "02",
    title: "Cameras, Lenses & Lighting",
    summary: "Gear knowledge from years on the camera counter, put to work on every shoot.",
    skills: [
      "Full-frame mirrorless & DSLR systems",
      "Lens choice: wide, prime, tele, macro",
      "ND and polarising filters",
      "Manual exposure and focus",
      "Studio and location lighting",
      "Gimbal, slider and tripod movement",
      "Sensor care and lens calibration",
    ],
    evidence: [
      "1,000+ customers advised on camera kit in Gorakhpur",
      "Colour-matched stills and video from three different bodies",
      "Every rental body leaving the counter with a check-list",
    ],
  },
  {
    id: "cinema",
    index: "03",
    title: "Cinematography & Storytelling",
    summary: "Turning flight time into sequences that hold together and say something.",
    skills: [
      "Shot lists and storyboards",
      "Aerial reveals, orbits and tracks",
      "Composition for air and ground",
      "Log and flat picture profiles",
      "Lav and on-camera audio capture",
      "Time-lapse and hyperlapse",
      "Directing people on location",
    ],
    evidence: [
      "Hotel, resort and real-estate films built from a written shot list",
      "Wedding aftermovies shot solo on drone and ground camera",
      "Repeatable flight lines so a site can be compared month to month",
    ],
  },
  {
    id: "post",
    index: "04",
    title: "Editing, Colour & Delivery",
    summary: "The edit is where a shoot becomes something a client can use — done in-house, on time.",
    skills: [
      "Adobe Lightroom Classic",
      "Adobe Premiere Pro",
      "DaVinci Resolve",
      "Colour matching across cameras",
      "Vertical cutdowns (9:16)",
      "Delivery formats and codecs",
      "Dual backup and archiving",
      "Client proofing galleries",
    ],
    evidence: [
      "Graded stills delivered within 48 hours of the shoot",
      "Aerial films edited and delivered within the week",
      "Every flight backed up twice before the cards are reformatted",
    ],
  },
  {
    id: "studio",
    index: "05",
    title: "Studio, Clients & Logistics",
    summary: "The unglamorous half: permissions, planning and paperwork that make a shoot day calm.",
    skills: [
      "Location recce and permissions",
      "Quoting and shot-list planning",
      "Production scheduling",
      "Client review rounds",
      "Usage rights and licensing",
      "On-set data wrangling",
      "Insurance and safety documentation",
    ],
    evidence: [
      "60+ commissions quoted, planned and delivered",
      "Airspace and permission checks before every commercial flight",
      "Usage rights handed over in writing with each delivery",
    ],
  },
];

/** Skills highlighted in the immersive landscape, each with a one-line proof point. */
export const landscapeSkills = [
  { label: "Drone cinematography", proof: "Aerial films for hotels, builders and brands, shot on a written shot list." },
  { label: "Aerial stills", proof: "Graded stills delivered within 48 hours of the shoot." },
  { label: "Mapping & photogrammetry", proof: "12+ sites flown as repeatable grids and built into orthomosaics." },
  { label: "Camera & lenses", proof: "Years on a camera counter: bodies, lenses and the kit that survives a season." },
  { label: "Lighting", proof: "Studio and location lighting for portraits, products and interiors." },
  { label: "Edit & colour", proof: "Premiere Pro and DaVinci Resolve, graded to one look across cameras." },
  { label: "Delivery & client care", proof: "Stills, 4K films and vertical cutdowns, with usage rights in writing." },
] as const;
