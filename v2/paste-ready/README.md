# Cinebody V4 — Squarespace Paste-Ready Files

## Order of Operations

1. **Upload static files** to Squarespace via Design > Custom Files (`/s/` path):
   - `vid-player.css`
   - `vid-player.js`

2. **Custom CSS** — Paste `custom-css.css` into Design > Custom CSS

3. **Code Injection > Header** — Paste `code-injection-header.html`

4. **Code Injection > Footer** — Paste `code-injection-footer.html`

5. **Global Footer** — Build the footer in Squarespace's footer section using the native editor (columns, links, etc.) OR paste `global-footer.html` into a Code Block in the footer area. The Custom CSS file handles footer styling.

6. **Each page** — Create a blank page, add a single Code Block, paste the corresponding `page-*.html` file.

---

## File Reference

### Shared (site-wide, paste once)

| File | Where it goes |
|------|--------------|
| `code-injection-header.html` | Settings > Advanced > Code Injection > Header |
| `code-injection-footer.html` | Settings > Advanced > Code Injection > Footer |
| `custom-css.css` | Design > Custom CSS |
| `global-footer.html` | Footer section (Code Block) |
| `vid-player.css` | Design > Custom Files (upload) |
| `vid-player.js` | Design > Custom Files (upload) |

### Pages (one Code Block per page)

| File | Page | Notes |
|------|------|-------|
| `page-homepage.html` | Homepage (`/`) | Logo track JS, CTA marquee JS, counter animation, FAQ accordion, Vanilla Tilt CDN, cursor glow tracking |
| `page-software.html` | Software (`/software`) | FAQ accordion, pricing toggle |
| `page-services.html` | Services (`/services`) | Autoplay videos via vid-player.js |
| `page-pricing.html` | Pricing (`/pricing`) | FAQ accordion, pricing toggle |
| `page-cs-rc.html` | Royal Caribbean (`/royal-caribbean`) | Uses vid-player.css/js |
| `page-cs-pointme.html` | PointMe (`/pointme`) | Uses vid-player.css/js |
| `page-cs-nike.html` | Nike (`/nike`) | Uses vid-player.css/js |
| `page-cs-gp.html` | Georgia-Pacific (`/georgia-pacific`) | Uses vid-player.css/js |
| `page-patents.html` | Patents (`/patents`) | Basic (scroll reveal only) |
| `page-privacy.html` | Privacy Policy (`/privacy-policy`) | Basic (scroll reveal only) |
| `page-terms.html` | Terms of Service (`/terms-of-service`) | Basic (scroll reveal only) |
| `page-knowledge-base.html` | Knowledge Base (`/knowledge-base`) | FAQ accordion, Chatbase AI bot iframe |
| `page-create-projects.html` | Create Projects (`/create-projects`) | Uses vid-player.css/js |
| `page-android.html` | Android Tutorial (`/android`) | Uses vid-player.css/js |

---

## Gotchas

- **Homepage logo track** — The logo marquee is built dynamically via JS at the bottom of `page-homepage.html`. The logo images are hosted on Squarespace CDN. If logos need updating, edit the `logos` array in the script.

- **Homepage CTA marquee** — Same deal: the bottom CTA image strip is built dynamically. Images are in the `imgs` array in the script.

- **Homepage Vanilla Tilt** — Loads `vanilla-tilt.min.js` from cdnjs CDN. The `<script>` tag is included in the page file.

- **Pricing toggle** — Both `page-software.html` and `page-pricing.html` include an annual/monthly toggle that swaps price displays. The JS is embedded in each page file.

- **Knowledge Base chatbot** — `page-knowledge-base.html` embeds a Chatbase iframe. If the bot ID changes, update the iframe `src` URL.

- **Video player pages** — Any page using `vid-playable` containers requires `vid-player.css` and `vid-player.js` (loaded site-wide via Code Injection). The Vimeo Player SDK is also loaded site-wide.

- **Footer CSS** — Each page's `<style>` block includes footer CSS rules (`.footer`, `.footer-grid`, etc.). The `global-footer.html` relies on these. The `custom-css.css` file provides additional Squarespace-specific footer overrides (`footer.sections`, etc.).

- **Code Block padding** — The `custom-css.css` includes `.sqs-block-code { padding: 0 !important; margin: 0 !important; }` to eliminate Squarespace's default Code Block padding.

- **vid-player file paths** — Code Injection references `/s/vid-player.css` and `/s/vid-player.js`. In Squarespace, files uploaded via Design > Custom Files are served at `/s/filename`. The local preview files use relative paths (`vid-player.css`) but the Code Injection uses the `/s/` prefix.
