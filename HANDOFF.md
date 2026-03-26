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

## What's Been Fixed (latest pass)

### Software Page (`v2/preview/software-v4.html`) — DONE
- Hero wall CSS fixed (grid-auto-rows: 1fr for uniform squares)
- Cross-sell card centered (margin: 0 auto)
- Added GP case study teaser with ecosystem tree SVG accent between pricing & FAQ
- Removed dead legacy pricing toggle code + unused legacy pricing CSS
- Section rhythm: dark hero → white How It Works → white cross-sell → white pricing → dark GP teaser → dark FAQ

### Services Page (`v2/preview/services-v4.html`) — DONE
- Hero wall CSS fixed (grid-auto-rows: 1fr)
- Headline, category headers, 7 brand showcases, proper dark/light alternation all good

### Pricing Page (`v2/preview/pricing-v4.html`) — BUILT NEW
- Dark hero (centered text, aurora glows, no video wall)
- White compare section (Services vs Software cards with images)
- Original cb-pricing__ pricing table with annual/monthly toggle
- Dark FAQ with pricing-specific questions
- Full footer with sig bar

### Case Study Pages — RHYTHM FIXED
- All 4 (RC, Point.me, Nike, GP) now have white stats section after dark hero
- Pattern: dark hero → curve → white stats → curve → dark content → yellow CTA → dark footer
- SVG graphics preserved (tabs, tree structure, map, carousel)

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
│   ├── software-v4.html    ← FIXED
│   ├── services-v4.html    ← FIXED
│   ├── pricing-v4.html     ← NEW
│   ├── cs-rc-v4.html       ← FIXED
│   ├── cs-pointme-v4.html  ← FIXED
│   ├── cs-nike-v4.html     ← FIXED
│   └── cs-gp-v4.html       ← FIXED
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
