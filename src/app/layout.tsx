import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site, socials } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SmoothCursor } from "@/components/motion/SmoothCursor";
import { RouteEffects } from "@/components/layout/RouteEffects";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ServiceWorker } from "@/components/layout/ServiceWorker";

const inter = localFont({
  src: [{ path: "./fonts/InterVariable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

/** The hand-written marks on the About stage's notes sheet (from sakshamfit/prince-portfolio). */
const hand = localFont({
  src: [{ path: "./fonts/Hand.woff", weight: "400", style: "normal" }],
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

const roleLine = "Drone Photographer in Gorakhpur";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${roleLine}`,
    template: `%s | ${site.name}, Drone Photographer`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  keywords: [
    "Drone Photographer Gorakhpur",
    "Aerial Cinematographer",
    "Drone videography Uttar Pradesh",
    "Aerial photography",
    "Drone mapping",
    "Camera specialist",
  ],
  openGraph: {
    type: "profile",
    title: `${site.name} | ${roleLine}`,
    description: site.description,
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/images/ui/og.jpg", width: 1200, height: 630, alt: "Shiva, drone photographer in Gorakhpur" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${roleLine}`,
    description: site.description,
    images: ["/images/ui/og.jpg"],
  },
  robots: { index: true, follow: true },
  applicationName: site.name,
  formatDetection: { telephone: true, email: true },
  appleWebApp: { capable: true, title: site.name, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#0b3d91",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  telephone: site.phone.display,
  address: { "@type": "PostalAddress", addressLocality: "Gorakhpur", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
  // TODO: add the training school's name once it is confirmed in /src/content/education.ts
  sameAs: socials.map((s) => s.href).filter(Boolean),
  knowsAbout: [
    "Drone photography",
    "Aerial cinematography",
    "Photogrammetry and mapping",
    "Camera and lens craft",
    "Colour grading",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint, so reveal styles never hide content for no-JS visitors.
            A plain inline script runs while the HTML is parsed; next/script's beforeInteractive is queued until
            the Next.js runtime loads, so content first painted visible and then faded out before its reveal. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="relative min-h-dvh bg-canvas font-sans text-ink">
        <div id="scroll-sentinel" aria-hidden className="pointer-events-none absolute left-0 top-0 h-4 w-px" />
        <a
          href="#main"
          className="fixed left-4 top-4 z-[80] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-lg transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <SmoothScroll />
        <SmoothCursor />
        <RouteEffects />
        <RevealObserver />
        <ServiceWorker />
      </body>
    </html>
  );
}
