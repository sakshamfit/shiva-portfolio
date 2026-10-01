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

### Before launch: replace the placeholders

- `site.ts` — email, phone and the Instagram / Facebook / YouTube / WhatsApp URLs (the footer
  and contact page show “link coming soon” while an `href` is empty).
- `site.ts` — `NEXT_PUBLIC_SITE_URL` for metadata and social previews.
- `experience.ts`, `education.ts`, `credentials.ts` — company names, dates and certificate
  details are written as placeholders.
- `public/images/portraits/*` — the portrait photographs are AI-generated placeholders; swap
  in Siva's own pictures, keeping the file names.
