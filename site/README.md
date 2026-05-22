# Cinebody, Standalone Site (Astro → Vercel)

The cinebody.com site, rebuilt to run on Vercel instead of Squarespace.
It reuses the existing V4 design system verbatim, each page's hand-authored
HTML/CSS is preserved exactly and wrapped in a shared Astro layout that adds a
real navigation header, the shared footer, and the video controller (all of
which Squarespace used to provide).

## How it works

```
site/
├── src/
│   ├── layouts/Base.astro      <head>, SEO/OG, Nav, footer, Vimeo video JS
│   ├── components/Nav.astro     rebuilt nav (transparent → glass on scroll, mobile menu)
│   ├── pages/*.astro            one thin wrapper per route (generated)
│   ├── fragments/*.html         the page bodies (copied from ../v2/paste-ready, URLs localized)
│   └── styles/global.css        ported shared CSS (curves, nav, footer, vid-player)
├── public/
│   ├── assets/                  self-hosted images (was Squarespace CDN)
│   ├── cinebody-icon.png        favicon
│   └── robots.txt
├── scripts/
│   ├── prep-fragments.mjs       copies fragments, downloads SQSP images, rewrites URLs
│   └── gen-pages.mjs            generates src/pages/*.astro from a metadata table
├── astro.config.mjs
└── vercel.json                  clean URLs, caching, security headers
```

Each page (e.g. `src/pages/royal-caribbean.astro`) just imports its fragment as
raw HTML and drops it into `Base`:

```astro
---
import Base from '../layouts/Base.astro';
import body from '../fragments/royal-caribbean.html?raw';
---
<Base title="Royal Caribbean Case Study" description="...">
  <Fragment set:html={body} />
</Base>
```

`set:html` injects the markup verbatim, so the original `<style>` blocks and
inline `<script>` (logo marquee, tilt, counters, FAQ, pricing toggle) keep
working untouched.

## Routes

`/` `/software` `/services` `/pricing` `/knowledge-base` `/patents`
`/privacy-policy` `/terms-of-service` `/create-projects` `/android`
Case studies: `/royal-caribbean` `/pointme` `/nike` `/georgia-pacific`
`/dell` `/altra` `/cogent` `/crocs` `/sploot`

## Editing content

Source of truth for content is still `../v2/paste-ready/page-*.html`. To pull
new edits in and regenerate everything:

```bash
npm run sync     # re-copy fragments + re-localize images + regenerate pages
npm run build
```

To edit a page directly in this project, edit the matching
`src/fragments/<route>.html`.

## Local dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build && npm run preview   # test the production build
```

## Deploy to Vercel

1. Import the `LumenatiProductions/cinebody-website` repo in Vercel.
2. **Set the project Root Directory to `site`.** (The repo root holds the old
   Squarespace files; the deployable app is in `site/`.)
3. Framework preset: **Astro** (auto-detected). Build `astro build`, output `dist`.
4. Deploy. Add the custom domain once you're ready to cut over from Squarespace.

## Notes

- Vimeo videos/thumbnails, Calendly, and map tiles remain on their own CDNs
  (they're not tied to the Squarespace account; videos stream from Vimeo).
- `/cinebody-blog` (footer link) still points at the Squarespace blog and is not
  part of this build yet.
