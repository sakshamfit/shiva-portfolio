/**
 * Training and education for Siva.
 *
 * TODO: the school, the training partner and the years are placeholders — replace them
 * with the real record. The layout expects two qualifications.
 */

export type Qualification = {
  id: string;
  degree: string;
  school: string;
  schoolNote?: string;
  location: string;
  start: string;
  end: string;
  status?: string;
  accreditation?: string[];
  modules?: string[];
  thesis?: string;
};

export const qualifications: Qualification[] = [
  {
    id: "rpc",
    degree: "Remote Pilot Certificate (RPC) — Drone Pilot Training",
    school: "DGCA-approved training partner",
    schoolNote: "Add the training school's name",
    location: "India",
    start: "2021",
    end: "2021",
    status: "Certified",
    accreditation: ["DGCA"],
    modules: [
      "Air regulations and airspace",
      "Flight planning and meteorology",
      "Drone systems and maintenance",
      "Emergency procedures",
      "Radio telephony",
    ],
    thesis: undefined,
  },
  {
    id: "bachelor",
    degree: "Bachelor's degree — add the subject",
    school: "Add the university or college",
    location: "Gorakhpur, Uttar Pradesh",
    start: "2015",
    end: "2018",
  },
];

export const educationCopy = {
  intro:
    "Flying is a licence; seeing is a practice. The first came from formal remote-pilot training, the second from years behind a camera and thousands of frames.",
  narrative:
    "Training gave me the discipline the job needs — airspace, weather, systems, emergency procedure — while the camera counter and the years of shooting built the eye. I keep both current: renewals and readings for the flying, and a weekly practice shoot for the looking. When a client asks for something I have not flown before, I plan it, test it on a practice flight and only then bring it to their site.",
} as const;

/** The four notes around the training photograph. */
export type CampusCallout = {
  id: "program" | "accreditation" | "location" | "community";
  label: string;
  title: string;
  text: string;
  side: "left" | "right";
};

export const campusCallouts: CampusCallout[] = [
  {
    id: "program",
    label: "Training",
    title: "Remote Pilot Certificate",
    text: "Formal drone pilot training: air regulations, flight planning, meteorology, systems and emergency procedures.",
    side: "left",
  },
  {
    id: "accreditation",
    label: "Compliance",
    title: "DGCA rules",
    text: "Commercial flying inside India's drone rules, with permissions checked before every commission.",
    side: "left",
  },
  {
    id: "location",
    label: "Home base",
    title: "Gorakhpur, Uttar Pradesh",
    text: "Shooting across eastern Uttar Pradesh and Bihar, from ghats and farmland to new construction.",
    side: "right",
  },
  {
    id: "community",
    label: "Practice",
    title: "Never only on a job",
    text: "New moves, new lenses and new edits get tested on practice flights before a client ever pays for them.",
    side: "right",
  },
];

export const campusPhoto = {
  src: "/images/education/training.webp",
  width: 1612,
  height: 852,
  alt: "A drone pilot training session in a field: an instructor and a pilot watching a quadcopter lift off in the evening light.",
  thumbnail: "/images/education/training-thumb.jpg",
} as const;
