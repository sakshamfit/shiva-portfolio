/**
 * DEMONSTRATION DATA for the kit planning views.
 * The planning lab uses textbook order-point formulas with example parameters, so visitors
 * can see how order quantity, spare stock and reorder points respond. The coverage view is
 * a representative interface. Neither shows the studio's own records.
 */

export const labDefaults = {
  annualDemand: 120, // battery packs / prop sets drawn from stock in a year
  orderCost: 85, // rupees per order, in hundreds (₹8,500)
  unitCost: 24, // rupees per unit, in hundreds (₹2,400)
  holdingRate: 22, // % of unit cost a year: storage, care and charge cycles
  leadTime: 10, // days from the supplier
  demandSd: 12, // how much the monthly draw moves, units
  serviceLevel: 97.5, // % readiness on a shoot day
} as const;

export type LabParams = { -readonly [K in keyof typeof labDefaults]: number };

/** Shoot days, last 12 months, by the city the work was shot in. */
export const bases = [
  { label: "Gorakhpur (base)", value: 62 },
  { label: "Lucknow", value: 34 },
  { label: "Varanasi", value: 21 },
  { label: "Patna", value: 18 },
  { label: "Delhi NCR", value: 13 },
];

/** Jobs delivered, last 12 months, by type of work. */
export const workTypes = [
  { label: "Aerial film", value: 38 },
  { label: "Aerial stills", value: 52 },
  { label: "Mapping", value: 24 },
  { label: "Interiors", value: 17 },
  { label: "Events", value: 9 },
];

export const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
/** Days booked per month. */
export const bookedDays = [12, 14, 16, 11, 12, 15, 17, 18, 19, 20, 16, 17];
/** Battery packs drawn from stock in the same month. */
export const kitDraw = [18, 22, 26, 15, 14, 21, 26, 27, 29, 31, 23, 25];

export const coverageTiles = [
  { label: "Flights logged", value: "500+" },
  { label: "Shoot days, last 12 months", value: "148 days" },
  { label: "Projects delivered", value: "60+" },
  { label: "Average stills turnaround", value: "48 hours" },
];
