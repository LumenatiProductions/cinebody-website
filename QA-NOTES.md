# Cinebody website QA notes — redesign preview

Preview: https://cinebody-website-git-redesign-ai-platform-cinebody.vercel.app  
Branch: `redesign/ai-platform`  
Date: 2026-08-23  
Widths: desktop ~1440px, tablet glance ~800px, phone ~390px  

Report what is wrong and how to trigger it. No prescribed fixes.  
**Known / skipped:** App Store and Google Play badges are `href="#"` (app not shipped yet). Not filed below.

---

## Summary

| Severity | Count |
|---|---|
| Blocker | 0 |
| Major | 10 |
| Minor | 10 |
| Polish | 6 |

---

## Major

### 1
- **Page:** /
- **Where:** desktop / ~1440px
- **What's wrong:** Top nav items "Pricing" and "Resources" sit on the autoplaying hero video wall with no solid or blurred header backing. Dark link text over moving tiles has poor contrast and visually collides with the video.
- **How to reproduce:** Load `/` at 1440px. Watch the top-right nav while the hero wall autoplays.
- **Severity:** Major
- **Screenshot:** (observed live; hero iframe weight prevented a reliable headless capture)

### 2
- **Page:** / (hamburger)
- **Where:** iPhone / ~390px
- **What's wrong:** In the open hamburger, Resources sub-items (Blog, Knowledge Base) overlap the "Log in" pill instead of stacking with clear spacing.
- **How to reproduce:** 390px → open hamburger → expand Resources. Blog / Knowledge Base collide with Log in.
- **Severity:** Major
- **Screenshot:** (observed live)

### 3
- **Page:** / (and heavy pages generally)
- **Where:** desktop / ~1440px
- **What's wrong:** Perceived jank. Hero runs many simultaneous autoplaying Vimeo iframes on a ~12,000px page. Client-logo marquee and card art (Vimeo thumbs, `/assets` logos, `cut-*.jpg`, `cta-still00*.jpg`) pop in late. Hard reload feels heavy.
- **How to reproduce:** Hard-reload `/` at 1440px (optionally throttle network). Watch the logo strip and hero tiles fill in.
- **Severity:** Major
- **Screenshot:** (observed live)

### 4
- **Page:** /platform, /services
- **Where:** iPhone / ~390px
- **What's wrong:** Hero eyebrow pills ("THE PLATFORM", "CREATIVE SERVICES") sit under the fixed nav at scrollY=0. Badge top/bottom fall inside the 72px nav band and collide with the cinebody logo. Eyebrow is clipped or invisible on first paint.
- **How to reproduce:** Open `/platform` or `/services` at 390px, do not scroll. Measure eyebrow vs fixed nav.
- **Severity:** Major
- **Screenshot:** shots/platform-390.png, shots/services-390.png

### 5
- **Page:** /platform
- **Where:** desktop / ~1440px
- **What's wrong:** Very long page (~10,460px) with many large lazy JPEGs. Scrolling at normal speed shows large blank black viewports before art loads. Reads as broken / slow on first pass.
- **How to reproduce:** Hard-reload `/platform` at 1440px, scroll at normal speed through the tour sections.
- **Severity:** Major
- **Screenshot:** shots/platform-390.png

### 6
- **Page:** /pricing
- **Where:** desktop / ~1440px and iPhone / ~390px
- **What's wrong:** Plus plan price "$250" (and "$") renders in `#E8E8E8` on the white card (~1.1:1 contrast), effectively invisible. Pro "$500" correctly uses brand blue `#07BCF1`, so this looks like a wrong token, not intentional de-emphasis.
- **How to reproduce:** Open `/pricing`, look at the PLUS "For small teams" card price. Confirm computed color `rgb(232,232,232)`.
- **Severity:** Major
- **Screenshot:** (confirmed live via computed style; crop capture failed blank)

### 7
- **Page:** /crocs
- **Where:** desktop / ~1440px
- **What's wrong:** Hero H1 breaks mid-word: "Sustainability, captured authent / ically." Phone wrap is fine.
- **How to reproduce:** Open `/crocs` at 1440px and read the H1.
- **Severity:** Major
- **Screenshot:** shots/crocs-desktop.png

### 8
- **Page:** /dell, /royal-caribbean
- **Where:** iPhone / ~390px — Content programs tab video rows
- **What's wrong:** Mobile swipe slider clones cards at load so rows loop. Rows inside tab panels that are hidden at load measure 0px wide, so cloning is skipped. Those rows keep only 3–4 originals and dead-end: swipe forward rubber-bands back. Default-visible tabs loop correctly. Affects Dell (Social Trends, HBCU & Diversity, Global Recruitment, Community) and Royal Caribbean (Rover, Always-On).
- **How to reproduce:** 390px → `/dell` → "Five programs. One platform." → tap "Social Trends" → swipe the video row left repeatedly. Same on `/royal-caribbean` under Rover / Always-On.
- **Severity:** Major
- **Screenshot:** shots/dell-phone.png, shots/dell-phone-tab-slider.png, shots/royal-caribbean-phone.png

### 9
- **Page:** all case studies (shared CTA)
- **Where:** desktop / ~1440px — yellow "Let's build yours" CTA marquee
- **What's wrong:** `cta-still004.jpg` through `cta-still009.jpg` fail to render (`naturalWidth` 0) even though URLs return HTTP 200. Black holes between colored tiles. ~24 img elements affected per case-study page.
- **How to reproduce:** Any case study at 1440px → scroll to the yellow CTA band → several tiles are solid black.
- **Severity:** Major
- **Screenshot:** shots/royal-caribbean-desktop.png, shots/dell-desktop.png

### 10
- **Page:** /cinebody-blog
- **Where:** card grid excerpts
- **What's wrong:** Multiple card excerpts hard-cut mid-word / mid-sentence with no ellipsis (e.g. "…in how your sho", "…to get the job d", "…creative video produ"). Looks broken rather than truncated.
- **How to reproduce:** Load `/cinebody-blog`, read card excerpts (e.g. "How to Frame a Video Shot…").
- **Severity:** Major
- **Screenshot:** shots/blog-800-truncated-excerpt.png, shots/blog-desktop-truncated-excerpt.png

---

## Minor

### 11
- **Page:** /
- **Where:** desktop / ~1440px
- **What's wrong:** Hero video-wall columns are cut hard at the top by the header and bleed off the right edge; top row of tiles is sliced mid-frame.
- **How to reproduce:** Load `/` at 1440px; observe first row of hero tiles under the header.
- **Severity:** Minor
- **Screenshot:** (observed live)
- **Question:** Is the under-header / right-edge bleed intentional?

### 12
- **Page:** /
- **Where:** iPhone / ~390px
- **What's wrong:** Hero scroller measures ~384–390px against a ~375px content box. `body { overflow-x: hidden }` hides horizontal scroll instead of fixing over-wide layout; right-hand tile column is clipped.
- **How to reproduce:** 390px → `/` → inspect hero columns / try horizontal swipe.
- **Severity:** Minor
- **Screenshot:** (observed live)

### 13
- **Page:** / (hamburger)
- **Where:** iPhone / ~390px
- **What's wrong:** Floating round widget button (bottom-right) stays above the open full-screen menu and overlays Book a Demo / Log in.
- **How to reproduce:** 390px → open hamburger; circular button overlays the drawer.
- **Severity:** Minor
- **Screenshot:** (observed live)

### 14
- **Page:** /platform
- **Where:** desktop / ~1440px while scrolling
- **What's wrong:** Fixed nav has no contrast treatment over some dark tour sections; mid-scroll it reads as a hard black band floating over content.
- **How to reproduce:** `/platform` at 1440px, scroll slowly from ~700px to ~4400px.
- **Severity:** Minor
- **Screenshot:** shots/platform-390.png

### 15
- **Page:** /altra, /dell (also /sploot, /cogent)
- **Where:** desktop / ~1440px — hero and video grids
- **What's wrong:** Video cards paint as flat black boxes for ~2–3s before Vimeo posters resolve. No placeholder, so first paint looks broken (worst on Altra / Dell).
- **How to reproduce:** Hard-reload `/altra` at 1440px; watch hero + grid before posters resolve.
- **Severity:** Minor
- **Screenshot:** shots/altra-desktop.png, shots/dell-desktop.png

### 16
- **Page:** /cogent
- **Where:** iPhone / ~390px — "Every stage. Every crowd. Every moment." marquee
- **What's wrong:** Festival marquee rows are not wired to the swipe slider. A full-width drag moves the track only ~9px, so the row feels stuck vs other case-study rows.
- **How to reproduce:** 390px → `/cogent` → festival gallery → drag a row sideways.
- **Severity:** Minor
- **Screenshot:** shots/cogent-phone.png

### 17
- **Page:** /cinebody-blog
- **Where:** card "What Is a Shot List…" excerpt
- **What's wrong:** "Shot lists -- it's one of many crucial elements to any production. if you're running…" — double hyphen and lowercase "if" after a period.
- **How to reproduce:** `/cinebody-blog` → that card excerpt.
- **Severity:** Minor
- **Screenshot:** shots/cinebody-blog-desktop.png

### 18
- **Page:** /knowledge-base
- **Where:** right-column AI chat iframe
- **What's wrong:** Tall empty black body between suggested prompts and the input (~350px desktop, worse on phone). Hero looks lopsided; phone shows a large dead black block.
- **How to reproduce:** Load `/knowledge-base` at 1440px and 390px.
- **Severity:** Minor
- **Screenshot:** shots/kb-desktop-chat-empty.png, shots/kb-phone-chat.png

### 19
- **Page:** /privacy-policy vs /terms-of-service
- **Where:** hero date line + Privacy end matter
- **What's wrong:** Inconsistent dates/format: Privacy "Last updated April 2025" vs Terms "Last Updated: March 2026". Privacy body promises an effective date at the end of the page; none is present.
- **How to reproduce:** Compare heroes; scroll Privacy to the end (section 09).
- **Severity:** Minor
- **Screenshot:** shots/privacy-desktop-lastupdated.png, shots/terms-desktop-lastupdated.png

### 20
- **Page:** /privacy-policy
- **Where:** section 01, "Ad Servers…" paragraph
- **What's wrong:** Cross-reference says see the "Choice" section below; actual section is "Choices" (TOC 04). Plain text, not linked to `#choices`.
- **How to reproduce:** `/privacy-policy` → section 01 → last sentence of "Ad Servers…".
- **Severity:** Minor
- **Screenshot:** shots/privacy-policy-desktop.png

---

## Polish

### 21
- **Page:** /
- **Where:** AI Director / Payments mocks
- **What's wrong:** Literal "✓" dingbats used as text ("✓ Framing looks great", "+ $150 ✓") instead of icons. Render weight/color varies by platform.
- **How to reproduce:** `/` → AI Director / Payments feature mocks.
- **Severity:** Polish
- **Screenshot:** (observed live)
- **Question:** Intentional for the chat mock?

### 22
- **Page:** /cogent
- **Where:** iPhone / ~390px — hero paragraph
- **What's wrong:** Reads "fueling a steady stream authentic video" (missing "of"). Source appears to contain "stream of authentic".
- **How to reproduce:** 390px → `/cogent` → read hero paragraph.
- **Severity:** Polish
- **Screenshot:** shots/cogent-phone.png

### 23
- **Page:** /cinebody-blog
- **Where:** all 23 card thumbnails
- **What's wrong:** Every card image has empty `alt=""`. Images load (HTTP 200); accessibility/SEO gap.
- **How to reproduce:** View source; inspect `img.blog-card__img`.
- **Severity:** Polish
- **Screenshot:** shots/cinebody-blog-desktop.png

### 24
- **Page:** /knowledge-base
- **Where:** "Uploads & Sync" → "See the fixes →"; disclaimer / FAQ copy
- **What's wrong:** "See the fixes →" jumps to `#common-questions` (generic FAQ), not upload-specific content. Also comma splices in disclaimer and FAQ ("Our AI is still learning, if you get…").
- **How to reproduce:** `/knowledge-base` → click "See the fixes →"; read disclaimer and FAQ items.
- **Severity:** Polish
- **Screenshot:** shots/knowledge-base-desktop.png

### 25
- **Page:** /patents
- **Where:** desktop / ~1440px — three-column cards
- **What's wrong:** Equal-height columns leave large empty white space in "International Patents" (~230px). Heading says "International Patents" while both entries are applications (eyebrow says APPLICATIONS), unlike U.S. columns that split Granted vs Pending.
- **How to reproduce:** `/patents` at 1440px → third column.
- **Severity:** Polish
- **Screenshot:** shots/patents-desktop-columns.png

### 26
- **Page:** /privacy-policy, /terms-of-service (and site-wide footer note)
- **Where:** contact blocks + typography + HTML comment
- **What's wrong:** Address written two ways (Jackson St. vs N Jackson Street). Privacy security email `Travis@cinebody.com` capitalization inconsistent with lowercase support addresses. Legal pages use straight quotes while marketing pages use curly. Served HTML includes a leaked authoring comment before `<footer>` referencing Squarespace ("Paste into the Squarespace footer section…") — not visible on screen, but stale build note on an Astro/Vercel site.
- **How to reproduce:** Compare bottoms of Privacy and Terms; view-source search "Squarespace".
- **Severity:** Polish
- **Screenshot:** shots/privacy-policy-desktop.png, shots/terms-of-service-desktop.png

---

## Verified working (no defect)

- Footer look is consistent across pages checked (logo, columns, social, copyright).
- Routes load: Platform, Services, Work, Pricing, Blog, Knowledge Base, Patents, Privacy, Terms, all 9 case studies (HTTP 200).
- Default-visible phone video rows loop both ways without blanking or dead-end (Nike, Altra, Georgia-Pacific, Crocs, Cogent hero, Dell hero, Royal Caribbean default tab). Tap-to-play verified on Nike.
- Georgia-Pacific "Sixteen creators" carousel wraps at both ends.
- `/pointme` clean at both widths.
- `/work` and `/pricing` layouts (aside from the Plus price token) align; pricing Monthly/Annual toggle and FAQ accordion work.
- Brand voice sweep: **no emojis** and **no visible em dashes (—)** in marketing/case-study copy. Intentional glyphs only: →, ∞, ©, and the "✓" dingbats called out above.
- No page-level horizontal overflow at 390px on case studies / product pages checked (hero home overflow is masked by `overflow-x: hidden`).

---

## Open questions

1. Is the home hero meant to bleed under the header and off the right edge?
2. Should the header get a solid/blurred background over the hero so Pricing / Resources stay legible?
3. Are the "✓" text glyphs intentional in the AI Director / Payments mocks?
4. App Store / Play `href="#"` is known (app not shipped). Prefer leaving as-is, visually disabling, or hiding until URLs exist?

---

## Method notes

- Preview only; platform app (`cinebody.vercel.app`) not exercised beyond the Knowledge Base help-widget iframe.
- Phone slider dead-end on tab panels was reproduced with synthetic pointer events on the slider's own handlers; a real-device pass on Dell tab panels is still worth doing before sign-off.
- Some headless full-page captures timed out under the heavy Vimeo hero; defects above were confirmed live in the browser even when a PNG was not saved.

## Re-check 2026-08-23 (after builder fixes)

Preview hard-refreshed with cache-busters. Phone ~390px + desktop ~1440px. #8 Dell tabs verified on real iPhone 17 Pro Simulator Safari.

| # | Item | Verdict |
|---|---|---|
| 1 | Home nav legible over hero | **PASS** |
| 2 | Hamburger Resources vs Log in overlap | **PASS** (not reproducible; clean stack) |
| 3 / 5 / 15 | Black-flash / heavy late art | **PASS** (much improved; home/platform videos capped → images at phone) |
| 4 | Platform/Services phone eyebrow clears nav | **PASS** |
| 6 | Pricing Plus $250 dark/legible | **PASS** (`rgb(13,13,13)`) |
| 7 | Crocs H1 mid-word break | **PASS** |
| 8 | Dell / Royal Caribbean phone tab-panel swipe loop | **PASS** (Dell Social Trends on iPhone 17 Pro sim; RC Rover + Always-On loop at 390px) |
| 9 | Yellow CTA marquee black holes | **PASS** |
| 10 | Blog excerpts mid-word cut | **PASS** |
| 17 | Shot-list excerpt punctuation | **PASS** |
| 18 | KB chat empty black block | **PASS** |
| 19 | Privacy date + effective-date wording | **PASS** |
| 20 | Privacy "Choices" cross-ref | **PASS** |
| 23 | Blog card alt text | **PASS** |
| 24 | KB disclaimer comma splice | **PASS** ("See the fixes →" still generic FAQ — known open) |
| 25 | Patents International empty space | **PASS** |
| 26 | Address/email + Squarespace comment | **PASS** (Squarespace comment gone) |

### Intentional / won't-fix — confirmed

| # | Item | Confirmed |
|---|---|---|
| 11 / 12 | Home hero bleed / masked over-width | Yes — no visible horizontal scrollbar |
| 13 | Floating round widget over hamburger | **ABSENT** on deployed preview (only Vercel Live preview bubble, won't ship) |
| 14 | Sticky nav dark glass + hairline | Present as designed |
| 16 | Cogent festival row | Intentional auto-scrolling marquee |
| 21 | ✓ glyphs in AI Director / Payments mocks | Still present, intentional |
| App Store / Play `href="#"` | Known — app not shipped | Unchanged |

### Still open / known (not addressed this round)

- Deeper perf on very long Home/Platform pages beyond the image/stream cuts
- #24 "See the fixes →" still `href="#common-questions"`

### Notes

- **#8:** Canonical Social Trends repro on iPhone 17 Pro sim looped (Warming Up after 7 left swipes; not rubber-band). Default Dell row looped both ways. HBCU swipes executed. Royal Caribbean Rover + Always-On also looped at 390px (8 left swipes each, wrapping transforms).
- Residual cosmetics not re-filed: home hero tile shuffle between refreshes; legal pages still mix some straight quotes; Patents "International Patents" heading vs APPLICATIONS eyebrow unchanged.
