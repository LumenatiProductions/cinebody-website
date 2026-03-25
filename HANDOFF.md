# Cinebody Website Redesign — Handoff

## Repo
- **GitHub:** LumenatiProductions/cinebody-website
- **Branch:** `redesign/v2` (original untouched on `main`)
- **Working dir:** /Users/scottmcdonald/cinebody-website

## What's Done & Approved

### Homepage (GOOD — use as template for everything)
- **File:** `v2/preview/homepage-v4.html`
- Scott approved this design. It's the source of truth.
- Dark hero with 3x3 video wall, aurora glows, pill badge eyebrow
- Alternating dark/light sections with curved SVG dividers
- Logo marquee (individually sized per brand)
- Glassmorphism stat cards with hover recount
- Case study teasers (Point.me, RC, Nike) with SVG accents (globe, ship, map)
- 4-across case study image cards with color tint overlay + brand labels
- Testimonial quote in white case studies section
- 3D tilt service cards (vanilla-tilt.js)
- Image marquee CTA on yellow
- FAQ accordion with JSON-LD
- Scroll progress bar, cursor glow on cards, gradient link hovers
- Footer with sig bar

### Design Language (from homepage-v4)
- **Base:** #0a0a0a dark, Inter font
- **Colors:** Teal #00bcf1, Yellow #ffec03, Pink #eb008b
- **Aurora:** Blurred teal/pink blobs, low opacity (0.06-0.12), contained per section
- **Sections alternate** dark ↔ light with curved SVG dividers
- **Video wall:** 3x3 grid, padding-bottom:100% squares, vumbnail.com fallbacks
- **Buttons:** .btn-glow with gradient fill hover (teal→pink→yellow behind, blurred)
- **Links:** Gradient text on hover (teal→pink→yellow)
- **Stats:** Recount on hover, gradient shimmer
- **Labels:** Inter (NOT JetBrains Mono — Scott didn't like the monospace)

## What Needs Work

### Software Page (`v2/preview/software-v4.html`)
- Hero needs to match homepage exactly (same 3x3 wall, same sizing)
- How It Works should be on LIGHT background (original site was mostly white)
- Cross-sell card needs dark bg on light section (currently broken)
- Pricing table: use the ORIGINAL `cb-pricing__` CSS from `blocks/stats-bar.html` or the code Scott pasted — it's proven and works
- Missing: Georgia-Pacific case study teaser with ecosystem SVG
- Section rhythm should match original cinebody.com/software

### Services Page (`v2/preview/services-v4.html`)
- Headline updated: "Your content team, without the headcount."
- Category headers added (Social, CTV, Events, Employee)
- Hero needs same 3x3 wall as homepage
- Text clipping on italic gradient headline — fixed to use solid teal color instead
- 7 brand showcases present but need to match homepage visual quality

### Pricing Page
- Agent timed out. Needs to be built.
- Use the original pricing table CSS (Scott pasted the full code)
- Add a compare section (Services vs Software) above the pricing cards

### Case Study Pages (4 files in v2/preview/)
- RC, Point.me, Nike, GP — all built but are walls of black
- Need to match homepage rhythm (dark/light alternating)
- MUST keep the distinctive SVG graphics (globe, ship, map, ecosystem tree, amphitheater)
- These SVGs exist in the original blocks at `blocks/case-study-*.html` and `blocks/case-studies/`

## Critical Rules
1. **homepage-v4.html IS the design system** — copy its exact CSS
2. **Original blocks ARE the content** — don't rewrite, don't remove graphics
3. **Alternate dark/light** with curved dividers — match homepage rhythm
4. **Same hero layout** on every page — same grid, same wall, same padding
5. **Use original pricing CSS** (cb-pricing__ classes)
6. **One page at a time** — don't batch generate with agents
7. **The original site cinebody.com shows the correct content structure**

## File Structure
```
v2/
├── preview/
│   ├── homepage-v4.html    ← APPROVED TEMPLATE
│   ├── software-v4.html    ← WIP, needs fixes
│   ├── services-v4.html    ← WIP, has category headers
│   ├── cs-rc-v4.html       ← needs rhythm fixes
│   ├── cs-pointme-v4.html  ← needs rhythm fixes
│   ├── cs-nike-v4.html     ← needs rhythm fixes
│   └── cs-gp-v4.html       ← needs rhythm fixes
├── design-system.css        ← older, homepage-v4 is newer
├── shared.js                ← older, homepage-v4 has inline JS
└── (block directories from earlier attempts — ignore)
```

## Key URLs
- Calendly (all CTAs): https://calendly.com/tyler-cinebody/creating-high-quality-ugc-with-cinebody
- Logo (white): https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/2886fba6-1049-443f-90c9-28d4ff6bf9c7/cb_white.png
- Icon: https://images.squarespace-cdn.com/content/68752bed553a097656efd4e1/9da6d1b5-d46d-4623-ae15-d4723266cbb2/cinebody_icon.png
- Wordmark: https://images.squarespace-cdn.com/content/68752bed553a097656efd4e1/27ef5dd7-3767-463e-ab20-297c5ce88942/cinebody_wordmark.png
- Live site: www.cinebody.com
- Vimeo: vimeo.com/cinebody

## Scott's Preferences
- Poppy, welcoming, accessible — not dramatic
- Likes the homepage auroras, video wall, curved dividers, gradient hovers
- Doesn't like JetBrains Mono for labels (use Inter)
- Doesn't like walls of black
- Wants the original SVG graphics kept/evolved
- Services headline: "Your content team, without the headcount."
- Original pricing table design is preferred over any new version
- Color tint overlays on case study cards should be subtle
- Video wall tiles: overlay on hover shows brand + project name
