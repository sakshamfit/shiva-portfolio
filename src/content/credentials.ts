/**
 * Certificates and languages.
 *
 * TODO: replace with Shiva's real certificates (numbers, issuers and dates) before launch.
 */

export const certifications = [
  { title: "Remote Pilot Certificate (RPC)", code: "DGCA", issuer: "Directorate General of Civil Aviation, India" },
  { title: "Drone Mapping & Photogrammetry", issuer: "Add the training provider" },
  { title: "Colour Grading in DaVinci Resolve", issuer: "Add the course provider" },
] as const;

export const languages = [
  { name: "Hindi", level: "Native", note: "Day-to-day working language" },
  { name: "English", level: "Professional", note: "Client calls, briefs and reports" },
  { name: "Bhojpuri", level: "Conversational", note: "On location across eastern UP" },
] as const;
