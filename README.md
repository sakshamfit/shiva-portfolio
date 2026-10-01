# Siva — Drone Photographer Portfolio

Portfolio site for **Siva**, a drone photographer and aerial cinematographer based in
Gorakhpur, Uttar Pradesh: aerial films, stills, mapping, site documentation and the camera
and drone kit behind them.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion and Lenis.
Pages are prerendered as static HTML.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Other scripts: `npm run lint`, `npm run typecheck`, `npm run generate:maps`
(recomputes the map geometry in `src/content/geo`), `node scripts/build-resume.mjs`
(rebuilds the one-page profile PDF from the text inside the script).

## Pages

| Route | Content |
| --- | --- |
| `/` | Landing — an aerial frame at golden hour; Explore opens the full-screen menu |
| `/about` | Portrait collage, the five stages of a shoot, “Why choose me?” |
| `/experience` | The flight pipeline, roles, KPIs and the case-study cards |
| `/projects` | Case studies with working demonstrations |
| `/skills` | Five capability areas, tools, certificates and languages |
| `/education` | Remote pilot training, journey map and practice |
| `/contact` | Contact details, social profiles and a message form |
| `/profile` (Resume) | Downloadable profile PDF |

## Content

Typed content lives under `src/content/` (`site.ts`, `about.ts`, `experience.ts`,
`projects.ts`, `skills.ts`, `education.ts`, `credentials.ts`, `demo/*`). The profile PDF is in
`public/resume/`; rebuild it with `node scripts/build-resume.mjs` after editing the text in
that script.

## Contact details

Siva's email, phone and the Instagram / Facebook / YouTube / WhatsApp links are set in
`src/content/site.ts` (the footer, the menu and `/contact` all read from there). WhatsApp points
at the same number as the phone (`wa.me/918009369410`).

## Offline, installable and mobile

- `public/sw.js` is a service worker (registered in production only by
  `src/components/layout/ServiceWorker.tsx`). Pages are network-first with a 3 s cap, so a slow or
  missing connection falls back to the saved copy; scripts, fonts and images are served from the
  device cache. After the first visit it quietly saves every page and the image sizes that screen
  uses (skipped on Data Saver / 2G, at most once a day). `public/offline.html` is the fallback
  for a page that was never saved. Bump `V` in `sw.js` to force every device to drop its cache.
- `src/app/manifest.ts` + `public/icons/*` make the site installable on Android ("Add to Home
  screen"). Regenerate the icons with `node scripts/build-icons.mjs`.
- Mouse-only effects (smooth cursor, inertial wheel scrolling) are off on touch devices, which keep
  native momentum scrolling.

The contact *form* needs a connection to send through the email service; offline it opens the
visitor's mail app with a pre-filled draft, and the phone, WhatsApp and email links always work.

### Before launch: replace the placeholders

- `site.ts` — `NEXT_PUBLIC_SITE_URL` for metadata and social previews.
- `experience.ts`, `education.ts`, `credentials.ts` — company names, dates and certificate
  details are written as placeholders.
