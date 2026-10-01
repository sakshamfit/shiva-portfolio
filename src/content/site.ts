/**
 * Identity, contact details, social links and navigation for Siva.
 *
 * TODO (placeholders to replace with Siva's real details):
 *  - email + phone below
 *  - the four social links in `socials` (paste the profile URLs; the footer shows them
 *    as "link coming soon" until a URL is set, so nothing links to the wrong page)
 *  - the site URL in NEXT_PUBLIC_SITE_URL / `site.url`
 */

export const site = {
  name: "Siva",
  firstName: "Siva",
  role: "Drone Photographer & Aerial Cinematographer",
  specialism: "Aerial Films, Aerial Stills & Camera Craft",
  location: "Gorakhpur, Uttar Pradesh, India",
  email: "hello@sivaaerial.in",
  phone: {
    // TODO: put Siva's real number here; the contact page hides the phone link while this is empty.
    display: "Add phone number",
    href: "",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Siva is a drone photographer and aerial cinematographer based in Gorakhpur, Uttar Pradesh. Aerial films, stills, mapping and site documentation, shot and graded in-house.",
} as const;

export type SocialId = "instagram" | "facebook" | "youtube" | "whatsapp";

export type Social = {
  id: SocialId;
  label: string;
  /** Leave empty until the real profile link is known: the footer shows it as "coming soon". */
  href: string;
  handle?: string;
};

/**
 * Social profiles shown in the footer and on the contact page.
 * TODO: paste each profile URL into `href`.
 */
export const socials: Social[] = [
  { id: "instagram", label: "Instagram", href: "" },
  { id: "facebook", label: "Facebook", href: "" },
  { id: "youtube", label: "YouTube", href: "" },
  { id: "whatsapp", label: "WhatsApp", href: "" },
];

export const LINK_PENDING = "Link coming soon";

/** The single, approved résumé. Replace the file in /public/resume to update it. */
export const resume = {
  href: "/resume/Siva-Drone-Photographer-CV.pdf",
  fileName: "Siva-Drone-Photographer-CV.pdf",
  format: "PDF",
  pages: 1,
  size: "480 KB",
  updated: "Oct 2026",
  thumbnail: "/images/ui/cv-page.jpg",
} as const;

export type MenuPreviewKind = "about" | "projects" | "skills" | "education" | "contact" | "resume";

export type MenuItem = {
  index: string;
  label: string;
  href: string;
  preview: MenuPreviewKind;
  /** When set, the row downloads this file (and still opens its page). */
  download?: string;
};

/** Full-screen menu destinations, each opening its own page. */
export const menuItems: MenuItem[] = [
  { index: "01", label: "About Me", href: "/about", preview: "about" },
  { index: "02", label: "Projects", href: "/projects", preview: "projects" },
  { index: "03", label: "Skills", href: "/skills", preview: "skills" },
  { index: "04", label: "Education", href: "/education", preview: "education" },
  { index: "05", label: "Contact", href: "/contact", preview: "contact" },
  { index: "06", label: "Download Resume", href: "/resume", preview: "resume", download: resume.href },
];

/** Page navigation in the header bar, in reading order. */
export const pageLinks = [
  { label: "About", href: "/about", description: "Who I am and how I fly, shoot and deliver." },
  { label: "Experience", href: "/experience", description: "Aerial work, camera specialism and the numbers behind them." },
  { label: "Projects", href: "/projects", description: "Four case studies: aerial film, mapping, kit systems and site documentation." },
  { label: "Skills", href: "/skills", description: "Flying, cameras, cinematography and post, each tied to a real use." },
  { label: "Education", href: "/education", description: "Pilot training, photography study and continuous practice." },
  { label: "Contact", href: "/contact", description: "Email, phone, social profiles or a message." },
] as const;

/** Secondary destinations shown in the menu's top bar. */
export const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Experience", href: "/experience" },
  { label: "Case studies", href: "/projects#case-studies" },
  { label: "Certifications", href: "/skills#credentials" },
] as const;
