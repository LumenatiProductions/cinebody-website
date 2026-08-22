# Email Block Design System Research
## Cinebody -- B2B SaaS Video Platform

**Date:** April 3, 2026
**Purpose:** Strategic research to inform Cinebody's block-based email builder -- what blocks to build, how to categorize them, and design rules for composability.

---

## Table of Contents

1. [Industry Block Taxonomy](#1-industry-block-taxonomy)
2. [Conversion-Optimized Email Patterns](#2-conversion-optimized-email-patterns)
3. [Block Independence and Spacing Architecture](#3-block-independence-and-spacing-architecture)
4. [Categorization Strategy](#4-categorization-strategy)
5. [The Definitive Block Library for Cinebody](#5-the-definitive-block-library-for-cinebody)
6. [Design System Rules for Composable Blocks](#6-design-system-rules-for-composable-blocks)
7. [Implementation Recommendations](#7-implementation-recommendations)

---

## 1. Industry Block Taxonomy

### What the Major Platforms Offer

**Beefree (1,500+ templates)**
Beefree structures content around atomic blocks: Title, Paragraph, List, Image, Button, Divider, Spacer, Social, HTML, Video, Icon, Menu, and Table. Their SDK layers these into Rows (full-width stripes), Columns (horizontal layouts within rows), and Content Blocks (the actual elements). They also support AMP blocks (carousels, forms, accordions) for interactive email. Their template taxonomy groups by use case: Newsletters, Promotions, Events, and then tags by style, industry, and content type.

**Klaviyo**
Klaviyo's editor offers: Text, Image, Button, Table (static and dynamic), Split (two-column with adjustable ratio), HTML, and Section/Column layouts. They also have "Universal Content" -- saved blocks reusable across templates. Their dynamic table block is notable: it iterates over a data list, making it useful for personalized product grids or activity summaries.

**Stripo (500+ modules)**
Stripo uses the most sophisticated hierarchy: Stripe (full-width row) > Structure (column layout) > Container (content holder) > Block (text, image, button). They think in terms of "atoms" (basic blocks), "molecules" (combinations like a header or product card), and "organisms" (full sections). Their module library includes AMP-enhanced blocks: carousels, forms, and accordions.

**Customer.io**
Customer.io provides "standard components" (built-in blocks) and "custom components" (user-created reusable blocks) in their Design Studio editor. They also offer "Snippets" -- centrally managed reusable content blocks (footers, disclaimers, CTAs) that update everywhere when edited in one place. Their layout system separates structural code from content.

**Litmus**
Litmus distinguishes between two module types: Snippets (reusable, editable per-email -- ideal for body content like heroes, CTAs, content blocks) and Partials (global, edit-once-update-everywhere -- ideal for headers, footers, legal text). Their recommended categorization: organize by section type (header, body, footer), email type (transactional, marketing), or team/department.

### What's Consistent Across All Platforms

Every platform includes these atomic blocks:
- Text (heading + body variants)
- Image (full-width + inline)
- Button (primary CTA)
- Divider / Spacer
- Social links
- HTML (escape hatch)

Every platform includes these composite modules:
- Header (logo + nav/login)
- Hero (image/gradient + headline + CTA)
- Footer (legal + unsubscribe + social)

### What's Missing from Most Platforms

Most platforms lack purpose-built blocks for:
- **Video thumbnails with play overlays** -- usually hacked together with image + positioned button
- **Stats/metrics displays** -- typically hand-coded as custom HTML
- **Case study cards** -- not a first-class block type anywhere
- **Comparison tables** -- Klaviyo's dynamic table gets closest, but competitive comparison is always custom
- **Step/process blocks** -- numbered steps with descriptions are always custom
- **Testimonial/quote blocks** -- social proof is underserved as a dedicated block type
- **Logo strips/grids** -- always custom despite being in nearly every B2B email
- **Before/after blocks** -- useful for product updates, never offered as a primitive

This gap is Cinebody's opportunity. Building purpose-built blocks for video content, social proof, and metrics gives the email builder a genuine edge over generic drag-and-drop tools.

---

## 2. Conversion-Optimized Email Patterns

### Welcome/Onboarding Sequences That Reduce Churn

**Structure (4-6 emails over first 14 days):**

| Email | Timing | Purpose | Key Block Pattern |
|-------|--------|---------|-------------------|
| Welcome | Immediate | Emotional connection + single next step | Hero + How It Works (3 steps) + Primary CTA |
| Quick Start | Day 1-2 | First success moment | Numbered Steps + Screenshot + CTA |
| First Value | Day 3-5 | Show what's possible | Video Thumbnail + Stats + CTA |
| Social Proof | Day 5-7 | Build confidence | Case Study Card + Testimonial + CTA |
| Team Invite | Day 7-10 | Expand engagement | Feature Highlight + CTA |
| Check-in | Day 14 | Address friction | Text-only conversational + Soft CTA |

**What the data says:**
- Welcome email gets 40-60% open rates -- the highest of any email you'll send
- Users who don't find value in the first 7 days are the most likely to churn
- A single, clear CTA per email consistently outperforms multiple CTAs
- Segmenting by product usage patterns (what they've done vs. haven't) dramatically improves relevance

**Cinebody-specific onboarding blocks needed:**
- "Deploy Your First Shot List" step block
- "Invite Your Filmers" step block
- "Watch Your Dashboard" screenshot block with play button

### Case Study Emails That Drive Demo Bookings

**High-performing pattern:**
1. Full-width video thumbnail with play button overlay (this is the hook)
2. Eyebrow label ("Case Study" or client industry)
3. Bold, result-driven headline ("4 cities. 1 weekend. Zero crews.")
4. Stats bar (3-4 key metrics in a horizontal row)
5. Short narrative paragraph (3-4 sentences max)
6. Single CTA ("Book a Strategy Call")
7. Optional: secondary case study teaser card below

**Conversion insights:**
- Video play buttons generate more clicks than any other CTA type in email
- Emails with specific stats (not vague claims) convert 26% higher
- Case study emails that feature companies similar to the recipient's industry convert 3x better
- Including exactly 3-4 stats is the sweet spot -- fewer feels thin, more causes scroll fatigue

### Re-engagement Emails That Win Back Inactive Users

**3-stage sequence:**

| Stage | Trigger | Tone | Block Pattern |
|-------|---------|------|---------------|
| Soft Check-in | 30 days inactive | Friendly, curious | Text Block + "What's New" List + Soft CTA |
| Value Reminder | 60 days inactive | Helpful, show progress | Stats (their data) + New Features + CTA |
| Final Offer | 90+ days inactive | Direct, last chance | Bold Headline + Testimonial + Strong CTA |

**What the data says:**
- Re-engagement emails recover 5-15% of inactive subscribers
- 63% of brands never attempt win-back at all, so doing it is already an advantage
- Reactivating an inactive user costs 5x less than acquiring a new one
- Inactive subscribers still generate ~7% of overall business revenue
- Subject line determines open for 47% of recipients -- make it personal and curiosity-driven

### Product Update Emails That Drive Feature Adoption

**Effective pattern:**
1. Eyebrow ("New Feature" or "Product Update")
2. Benefit-driven headline (what it does for them, not what you built)
3. GIF or screenshot showing the feature in action
4. 2-3 bullet points explaining the value
5. Primary CTA ("Try It Now" -- deep links to the feature)
6. Optional: "Coming Soon" teaser for next release

**What the data says:**
- Subject lines with specific benefits get 26% higher open rates than generic announcements
- One major update email per 1-2 months is the right cadence -- more than that causes fatigue
- Email drives awareness for inactive users; in-app notifications drive adoption for active users
- Segment by usage: only announce features to users who would actually use them

### Nurture Sequences That Move Leads Through the Funnel

**6-email proven structure:**

| # | Type | Content | Funnel Stage |
|---|------|---------|--------------|
| 1 | Greeting | Brand intro + credibility (logo strip) | Top |
| 2 | Free Value | Educational content (how video at scale works) | Top |
| 3 | Solution Intro | Feature highlights + differentiation | Middle |
| 4 | Social Proof | Case study deep dive | Middle |
| 5 | Competitive Edge | Comparison (Cinebody vs. traditional production) | Bottom |
| 6 | Industry Insights | Stats + trends + call to action | Bottom |

**The 80/20 rule:** 80% educational/helpful content, 20% direct sales asks. Every promotional email should be preceded by 2-3 value-only emails.

### CTA and Layout Best Practices

**Number of CTAs:**
- 1 CTA per email increases clicks by 371% and sales by 1,617% compared to multiple CTAs
- Emails with 3+ CTAs have measurably lower CTR than those with fewer
- Best practice: 1 primary CTA above the fold + 1 duplicate at the bottom for long emails

**Above-the-fold patterns:**
- CTAs placed above the fold see up to 84% more engagement
- The hero section (eyebrow + headline + subtitle + CTA) should complete within the first ~500px
- For long emails, repeat the CTA at the end

**Image-to-text ratio:**
- B2B and lead nurturing: 70% text / 30% image is ideal
- General rule of thumb: 60:40 text-to-image keeps deliverability high
- Images should enhance comprehension, not replace content (critical for image-blocking clients)

**Button design:**
- CTA buttons outperform text links by up to 45% in CTR
- Personalized CTAs convert up to 202% better than generic ones
- Buttons should be 45-57px tall with 10-15px whitespace around them for mobile tap accuracy
- High-contrast colors (against the background) generate 20-30% more clicks

---

## 3. Block Independence and Spacing Architecture

### The Central Question: Who Owns the Gap?

There are three approaches used by professional email design systems. After researching all three, the recommendation for Cinebody is clear.

**Approach A: Each Block Owns Top + Bottom Padding (most common)**
- Every block includes its own padding-top and padding-bottom
- Pro: Blocks are truly self-contained; any block works in any position
- Con: When two blocks stack, you get double padding (bottom of Block A + top of Block B)
- Fix: Use consistent padding values so the visual sum still feels rhythmic

**Approach B: Dedicated Spacer Blocks**
- Blocks have zero or minimal padding; spacers inserted between them control gaps
- Pro: Maximum control over spacing
- Con: Adds complexity; users must manually insert spacers; error-prone
- Used by: Beefree, older Mailchimp templates

**Approach C: Blocks Own Only Bottom Padding (recommended for Cinebody)**
- Each block owns its own bottom padding (the gap below itself)
- The first block in an email uses the section/container's padding-top
- Pro: No double-padding issue; blocks are still self-contained; simpler than spacers
- Con: First block in each section needs a container with appropriate top padding
- Used by: Stripo modules, Litmus snippets, Dyspatch

### Recommendation for Cinebody

**Use Approach C: bottom-padding-only with section containers.**

Each block defines its own `padding-bottom` based on its visual weight:
- Heavy blocks (hero, full-width image, stats bar): `padding-bottom: 0`
- Standard content blocks (text, steps, testimonial): `padding-bottom: 32px`
- Light blocks (divider, eyebrow label): `padding-bottom: 16px`
- CTA blocks: `padding-bottom: 40px`

The email wrapper provides the initial `padding-top` for the first block, and the footer section provides its own `padding-top`.

Additionally, include an optional **Spacer Block** (available but not required) for cases where users want extra breathing room between sections. This spacer should come in three sizes: small (16px), medium (32px), large (48px).

### How Blocks Should Be Self-Contained

Following the Litmus/Stripo model, each Cinebody email block should:

1. **Contain all its own CSS** -- never rely on styles defined elsewhere
2. **Use inline styles** -- email clients strip `<style>` tags inconsistently
3. **Use `role="presentation"` on all tables** -- accessibility requirement
4. **Include mobile responsive overrides** -- each block handles its own stacking via `@media` query with `.stack-column` and `.mobile-padding` classes
5. **Include Outlook conditional comments** where needed -- `<!--[if mso]>` wrappers
6. **Work on both dark (#0a0a0a) and white (#ffffff) backgrounds** -- blocks should declare their own background explicitly

---

## 4. Categorization Strategy

### Three Possible Approaches

| Approach | Organize By | Example Categories |
|----------|------------|-------------------|
| **Email Type** | Transactional / Marketing / Lifecycle | Easy to find "what email am I building?" but blocks duplicate across types |
| **Block Function** | Header / Content / Social Proof / CTA | Intuitive for assembly; each block has one job |
| **Visual Pattern** | Hero / Cards / Stats / Text | Designers think this way, but marketers don't |

### Recommendation: Hybrid -- Function-First, Type-Tagged

The research consistently shows that **block function** is the primary axis professionals use when assembling emails. You think "I need a header, then a hero, then social proof, then a CTA" -- not "I need a marketing block."

But email type context is still valuable for filtering. The solution:

**Primary organization: Block Function (7 categories)**

1. **Structure** -- Header, Footer, Divider, Spacer
2. **Hero** -- Hero with aurora, Hero with image, Hero minimal (text only)
3. **Content** -- Text block, Numbered steps, Feature highlight, Before/after
4. **Media** -- Video thumbnail (with play button), Full-width image, Image + text side-by-side
5. **Social Proof** -- Stats bar, Testimonial quote, Case study card, Logo strip
6. **CTA** -- Primary button, Ghost button, Calendly embed, Book-a-call card
7. **Data** -- Comparison table, Pricing snippet, Details table (billing)

**Secondary filter: Email Type Tags**

Each block gets tagged with which email types it's most commonly used in:
- `transactional` -- filmer-facing system emails
- `admin` -- admin notifications
- `marketing` -- nurture/drip campaigns
- `onboarding` -- getting-started sequence
- `billing` -- subscription/payment emails
- `product` -- feature announcements
- `re-engagement` -- win-back sequence
- `case-study` -- deep-dive social proof

This lets users either browse by function ("I need a hero block") or filter by type ("show me blocks commonly used in onboarding emails").

---

## 5. The Definitive Block Library for Cinebody

### Tier 1: Universal Blocks (used in nearly every email)

These blocks appear in 80%+ of all Cinebody emails. Build these first.

| # | Block Name | Function | Description |
|---|-----------|----------|-------------|
| 1 | **Header (Centered)** | Structure | Centered logo (120px) + tri-color bar. Used in marketing, onboarding, billing, product, re-engagement. |
| 2 | **Header (With Login)** | Structure | Left logo (140px) + right "Log in" pill + tri-color bar. Used in transactional and admin emails. |
| 3 | **Hero (Aurora)** | Hero | Dark gradient bg + aurora glow + eyebrow (JetBrains Mono) + H1 + subtitle + fade-out gradient. The signature Cinebody hero. |
| 4 | **Primary CTA** | CTA | Centered `#00bcf1` button, 8px radius, 14px 32px padding. One button, one job. |
| 5 | **Ghost CTA** | CTA | Centered outline button, 1px `rgba(0,188,241,0.3)` border, cyan text. Secondary action. |
| 6 | **Text Block** | Content | Body paragraph in Inter 15-16px, `rgba(255,255,255,0.55)`. The workhorse. |
| 7 | **Section Eyebrow** | Content | JetBrains Mono label, 11px, uppercase, 0.12-0.15em tracking. Introduces a new section. |
| 8 | **Divider** | Structure | 1px line, `rgba(255,255,255,0.06)`. Visual separator between sections. |
| 9 | **Footer (Standard)** | Structure | Tri-color bar + ghost CTA ("Visit cinebody.com") + unsubscribe/browser links + copyright. |
| 10 | **Spacer** | Structure | Empty vertical space. Three sizes: S (16px), M (32px), L (48px). |

### Tier 2: Marketing/Conversion Blocks (high-impact for lead generation)

These blocks drive conversions in marketing and nurture emails.

| # | Block Name | Function | Description |
|---|-----------|----------|-------------|
| 11 | **Video Thumbnail Card** | Media | Full-width image with play button overlay (48-56px circle, `rgba(0,0,0,0.55)` bg, cyan border). Links to video. Below the image: brand name + one-line description on subtle dark card. This is Cinebody's most distinctive and important block. |
| 12 | **Stats Bar** | Social Proof | 3-4 key metrics in a horizontal row. Large number (32px, 800 weight) + small label below. Top/bottom borders at `rgba(255,255,255,0.08)`. Stacks to 2x2 grid on mobile. |
| 13 | **Case Study Card** | Social Proof | Video thumbnail + headline + 2-3 sentence summary + "Read More" link. Appears as a bordered card with 12px radius. Can be stacked (multiple cards). |
| 14 | **Logo Strip** | Social Proof | Row of 4-6 client logos, opacity 0.4-0.5, grayscale. Shows credibility without words. Stacks to 2x3 on mobile. |
| 15 | **Testimonial Quote** | Social Proof | Pull quote in 18-20px italic, with attribution line (name, title, company) below. Optional: small headshot circle. |
| 16 | **Numbered Steps** | Content | 3-4 step process with cyan numbered circles (42px), bold step title, and description. Connected by subtle vertical line or separated by dividers. |
| 17 | **Comparison Table** | Data | Two-column table comparing Cinebody vs. traditional production (or vs. competitors). Checkmarks and X marks. Clean header row. |
| 18 | **Book-a-Call Card** | CTA | Bordered card with headline ("Ready to see it in action?"), subtitle, and Calendly-linked CTA button. More prominent than a standalone CTA button. |

### Tier 3: Contextual Blocks (used in specific email types)

These blocks serve specific email types and can be built as needed.

| # | Block Name | Function | Used In | Description |
|---|-----------|----------|---------|-------------|
| 19 | **Hero (With Image)** | Hero | Case study, product | Full-width image below the hero gradient (no aurora). Play button overlay optional. |
| 20 | **Feature Highlight** | Content | Product updates | Screenshot/GIF + 2-3 bullet points + CTA. Shows a new feature. |
| 21 | **Before/After** | Content | Product updates | Two-column or stacked: "Before" state vs. "After" state with labels. |
| 22 | **What's New List** | Content | Re-engagement, product | Bulleted list of recent improvements/changes with brief descriptions. |
| 23 | **Details Table** | Data | Billing, transactional | Key-value pairs in a clean table (Plan, Amount, Next Billing Date, etc.). |
| 24 | **Callout Box** | Content | Billing, admin | Bordered box with colored left accent line. Warning, info, or success states. |
| 25 | **White Section Wrapper** | Structure | Marketing, admin | Wraps content blocks in a `#ffffff` background section with dark text colors. For "Need editing help?" upsell sections and similar light-on-dark transitions. |
| 26 | **Social Links Row** | Structure | Transactional | Horizontal row of social media icon links (appears in transactional footers). |
| 27 | **Support Block** | Content | Transactional, billing | "Have questions?" + "Visit the Knowledge Base" text + CTA button. |
| 28 | **Image + Text Row** | Content | Marketing, onboarding | Side-by-side image (40%) and text (60%) that stacks on mobile. For feature descriptions or service cards. |

### Blocks Unique to a Video Platform Like Cinebody

These blocks don't exist in standard email builders and represent Cinebody's differentiation:

- **Video Thumbnail Card (#11)** -- The play button overlay on a video thumbnail is Cinebody's single most important email block. It generates more clicks than any text CTA. Every email builder handles video poorly; this should be a first-class, polished experience.

- **Stats Bar (#12)** -- Video platforms deal in metrics: cities filmed, hours of footage, cost savings percentage, turnaround time. A dedicated stats block (not just a table) with proper visual hierarchy is essential.

- **Case Study Card (#13)** -- Most email builders force you to hack this together from image + text + button primitives. A purpose-built case study card that combines a video thumbnail, client name, headline, and summary is significantly easier to use.

- **Logo Strip (#14)** -- Every B2B email benefits from a "trusted by" logo strip. Building this as a block (with properly sized, grayscale logos) instead of a single uploaded image means it stays crisp and can be updated without Photoshop.

---

## 6. Design System Rules for Composable Blocks

### Rule 1: Spacing Ownership

```
RULE: Each block owns its BOTTOM padding only.
The email container owns the initial top padding.
The footer owns its top padding.
```

| Block Weight | Bottom Padding |
|-------------|---------------|
| Heavy (hero, full-width image, stats bar) | 0px (next block controls its own top context) |
| Standard (text, steps, testimonial, cards) | 32px |
| Light (eyebrow, divider) | 16px |
| CTA blocks | 40px |
| Spacer | S=16px, M=32px, L=48px (this IS the padding) |

The email container's inner `<td>` has `padding: 20px 0` on the outer wrapper. The first content row (header) has `padding: 40px 40px 0` to establish the top margin.

### Rule 2: Dark-on-Dark Stacking

Cinebody emails are primarily dark (#0a0a0a). When two dark blocks stack, visual separation comes from:

1. **Divider block** -- 1px line at `rgba(255,255,255,0.06)` between them
2. **Eyebrow label** -- A JetBrains Mono section label at `rgba(255,255,255,0.35)` acts as a visual section break
3. **Border-bottom on content** -- Some blocks (like numbered steps) include internal bottom borders at `rgba(255,255,255,0.06)` to separate items

What NOT to do:
- Do not add background color variation between dark blocks (e.g., `#111` vs. `#0a0a0a`). This creates visual noise on Cinebody's clean dark canvas.
- Do not rely solely on spacing to separate dark blocks -- without a visual marker, sections blur together.

### Rule 3: Light-on-Dark Transitions

When transitioning from dark to white sections (or vice versa):

```
Dark section (hero, content)
  padding-bottom: 0
White Section Wrapper block
  padding-top: 40px
  background: #ffffff
  [content inside uses dark text colors]
  padding-bottom: 40px
Dark section resumes
  padding-top: 32px (or uses a spacer)
```

Key rules for white sections:
- Text color flips to `#111111` (headings) and `#52525b` (body)
- Dividers become `#e4e4e7` instead of `rgba(255,255,255,0.06)`
- CTA buttons stay `#00bcf1` with white text (unchanged)
- The tri-color bar NEVER appears in body content -- only header and footer

The White Section Wrapper block handles all of this automatically. When a user drops it in, everything inside renders correctly.

### Rule 4: Consistent Visual Rhythm

All Cinebody emails should follow this vertical rhythm:

```
[Header -- 40px padding]
[Tri-color bar -- 0px]
[Hero -- built-in fade gradient at bottom]
[32px gap]
[Content blocks with 32px bottom padding each]
[CTA -- 40px bottom padding]
[Optional: more content blocks]
[Optional: White section with 40px internal top/bottom]
[Optional: more dark content]
[Footer CTA -- 40px bottom padding]
[Footer -- tri-color bar + legal]
```

The key insight: **the hero-to-content transition uses the hero's built-in fade gradient** (from the aurora gradient down to solid `#0a0a0a`). This is a 48px tall gradient element at the bottom of the hero. No other block needs to handle the transition after the hero.

### Rule 5: Mobile Responsiveness Per Block

Every block must handle its own mobile behavior. The standard patterns:

**Container padding:**
- Desktop: `padding-left: 40px; padding-right: 40px`
- Mobile: `.mobile-padding { padding-left: 24px !important; padding-right: 24px !important; }`

**Multi-column to single-column:**
- Any block with side-by-side content uses `.stack-column` class
- Mobile: `.stack-column { display: block !important; width: 100% !important; }`

**Stats bar (4-across to 2x2 grid):**
- Desktop: 4 equal `<td>` cells with vertical dividers
- Mobile: `.stat-cell { display: block !important; width: 50% !important; }` (float-based 2x2) or full-width stack

**Logo strip (6-across to 3x2):**
- Desktop: 6 inline logos
- Mobile: 3 per row or 2 per row depending on logo count

**Images:**
- All images get `class="fluid"` and `max-width: 100% !important; height: auto !important;` on mobile
- Video thumbnails maintain aspect ratio; play button stays centered via percentage-based positioning

**Font sizes:**
- Do NOT scale fonts down on mobile. If anything, body text can go slightly larger (16px) for readability.
- Headlines can scale down slightly via `clamp()` in clients that support it, but inline font-size should work without it.

### Rule 6: Dark Mode Compatibility

Cinebody's dark-first design has a natural advantage in dark mode. Rules:

1. **Always declare explicit background colors** -- never rely on `transparent`. Email clients in dark mode will invert transparent to white.
2. **Use `color-scheme: light dark` in the root** -- signals to clients that the email is dark-mode-aware.
3. **White section blocks must include `@media (prefers-color-scheme: dark)` overrides** to prevent double-inversion (dark mode trying to make an already-intentionally-white section dark).
4. **Logos and icons should work on both dark and light backgrounds** -- use the white Cinebody logo on dark; ensure it has a subtle transparent padding or works on inverted backgrounds.
5. **The play button SVG uses `rgba(10,10,10,0.75)` fill** -- this holds up in dark mode without looking broken.

---

## 7. Implementation Recommendations

### Build Order (prioritized by impact)

**Phase 1: Core (ship first, covers 80% of emails)**
1. Header (Centered)
2. Header (With Login)
3. Hero (Aurora)
4. Text Block
5. Section Eyebrow
6. Primary CTA
7. Ghost CTA
8. Divider
9. Spacer
10. Footer (Standard)

**Phase 2: Conversion (the blocks that drive revenue)**
11. Video Thumbnail Card
12. Stats Bar
13. Case Study Card
14. Logo Strip
15. Testimonial Quote
16. Numbered Steps
17. Book-a-Call Card

**Phase 3: Specialized (complete the library)**
18. Comparison Table
19. Feature Highlight
20. Before/After
21. What's New List
22. Details Table
23. Callout Box
24. White Section Wrapper
25. Social Links Row
26. Support Block
27. Image + Text Row
28. Hero (With Image)

### Block JSON Schema (suggested structure)

Each block in the builder should store:

```json
{
  "id": "video-thumbnail-card",
  "name": "Video Thumbnail Card",
  "category": "media",
  "tags": ["marketing", "case-study", "onboarding"],
  "tier": 2,
  "theme": "dark",
  "fields": [
    { "key": "imageUrl", "type": "image", "label": "Thumbnail Image", "required": true },
    { "key": "videoUrl", "type": "url", "label": "Video Link", "required": true },
    { "key": "brandName", "type": "text", "label": "Brand Name", "required": true },
    { "key": "description", "type": "text", "label": "Short Description", "required": true }
  ],
  "spacing": {
    "paddingBottom": 32
  },
  "mobile": {
    "stackBehavior": "none",
    "imageScaling": "fluid"
  }
}
```

### Template Recipes (common block combinations)

Rather than just offering individual blocks, the builder should suggest "recipes" -- pre-built block combinations for common email types:

**Marketing Welcome:**
Header (Centered) > Hero (Aurora) > Numbered Steps > Video Thumbnail Card x3 > Primary CTA > Logo Strip > Footer

**Case Study Deep Dive:**
Header (Centered) > Hero (With Image + Play Button) > Section Eyebrow > Stats Bar > Text Block > Primary CTA > Case Study Card (secondary) > Ghost CTA > Footer

**Onboarding - Getting Started:**
Header (With Login) > Hero (Aurora) > Numbered Steps > Video Thumbnail Card > Primary CTA > Support Block > Footer

**Product Update:**
Header (Centered) > Hero (Aurora, minimal) > Feature Highlight > Before/After > Primary CTA > What's New List > Footer

**Re-engagement:**
Header (Centered) > Hero (Aurora) > Text Block (conversational) > What's New List > Stats Bar > Testimonial Quote > Primary CTA > Footer

**Billing - Trial Ending:**
Header (Centered) > Hero (Aurora, minimal) > Text Block > Details Table > Callout Box > Primary CTA > Support Block > Footer

### Existing Cinebody Email Audit

The current Cinebody email library already uses many of these patterns, but they're hand-coded as monolithic HTML files rather than composed from reusable blocks. Here's how the existing templates map to the proposed block system:

| Existing Pattern | Proposed Block(s) |
|-----------------|-------------------|
| Aurora hero section | Hero (Aurora) block |
| Tri-color bar in header | Part of Header (Centered) and Header (With Login) |
| Nike/RC/point.me image cards | Video Thumbnail Card block |
| 4-stat horizontal row | Stats Bar block |
| Numbered how-it-works steps | Numbered Steps block |
| "Book a Strategy Call" button | Primary CTA block |
| "Visit cinebody.com" ghost button | Ghost CTA block |
| Logo opacity strip | Logo Strip block |
| White "Need editing help?" section | White Section Wrapper + Text Block + CTA |
| "Have questions?" support section | Support Block |
| Footer with tri-color bar | Footer (Standard) block |

Every existing email can be reconstructed from the proposed 28-block library without losing any content or visual fidelity.

---

## Sources

### Email Design Systems and Architecture
- [Modular Email Design - Dyspatch](https://www.dyspatch.io/blog/modular-email-design/)
- [Email Design Systems Guide - Modular Mail](https://www.modular-mail.com/blog/email-design-systems-guide/)
- [Email Modules - Litmus](https://www.litmus.com/blog/email-modules-and-modular-email)
- [How to Organize Email Modules - Litmus](https://www.litmus.com/blog/how-to-organize-email-modules)
- [Email Template Guide - Blocks Edit](https://blocksedit.com/email-template-guide/)
- [Email Design System - Mailjet](https://www.mailjet.com/blog/email-best-practices/email-design-system/)
- [Modular Email Architecture - Oracle](https://blogs.oracle.com/marketingcloud/modular-email-architectures-efficient-workflow-and-foundation-for-personalization)
- [Component-Driven Email Design - Email on Acid](https://www.emailonacid.com/blog/email-development/components-email-design-system/)

### Platform-Specific Block Libraries
- [Beefree SDK Content Options](https://docs.beefree.io/beefree-sdk/server-side-configurations/server-side-options/content-options)
- [Beefree Content Blocks](https://support.beefree.io/hc/en-us/sections/4452268344082-Working-with-content-blocks)
- [Klaviyo Email Template Editor](https://help.klaviyo.com/hc/en-us/articles/4407911841435)
- [Stripo Modular Email Design](https://stripo.email/blog/how-to-start-on-modular-email-design/)
- [Stripo Email Design System](https://stripo.email/blog/how-to-build-a-strong-email-design-system-that-speeds-up-your-teamwork-using-stripo/)
- [Customer.io Email Layouts](https://docs.customer.io/journeys/3-layouts-and-customerio/)
- [Customer.io Snippet Templates](https://www.emailmavlers.com/blog/customerio-snippet-templates/)

### Conversion and CTA Best Practices
- [B2B Email Marketing Best Practices - Mailtrap](https://mailtrap.io/blog/b2b-email-marketing-best-practices/)
- [CTA Best Practices - Martal Group](https://martal.ca/cta-best-practices-lb/)
- [Email CTAs Best Practices - Moosend](https://moosend.com/blog/email-cta/)
- [Image to Text Ratio - Tabular](https://tabular.email/blog/image-to-text-ratio-in-email-design)
- [Personalized CTAs - HubSpot](https://blog.hubspot.com/marketing/personalized-calls-to-action-convert-better-data)

### Onboarding and Nurture Sequences
- [SaaS Onboarding Email Examples - Howdygo](https://www.howdygo.com/blog/saas-onboarding-email-examples)
- [Onboarding Email Best Practices - Mailsoftly](https://mailsoftly.com/blog/user-onboarding-email-best-practices/)
- [Onboarding Email Sequence - Encharge](https://encharge.io/onboarding-email-sequence/)
- [First 30 Days Onboarding - ProsperStack](https://prosperstack.com/blog/onboarding-email-sequence/)
- [Lead Nurturing Emails - SmartLead](https://www.smartlead.ai/blog/lead-nurturing-emails-sequences)
- [B2B SaaS Lead Nurture - Powered by Search](https://www.poweredbysearch.com/blog/b2b-saas-lead-mql-email-nurture/)

### Re-engagement and Win-back
- [SaaS Win-Back Emails - Userpilot](https://userpilot.com/blog/saas-win-back-email-campaign-examples/)
- [SaaS Re-engagement Emails - Userlist](https://userlist.com/blog/reengagement-emails-saas/)
- [B2B Win-Back Campaign - CleverTap](https://clevertap.com/blog/email-b2b-win-back-campaign/)

### Product Updates and Feature Announcements
- [Product Update Emails - Userpilot](https://userpilot.com/blog/product-update-emails/)
- [Feature Announcement Emails - Encharge](https://encharge.io/feature-announcement-emails/)
- [Feature Announcement Examples - Arcade](https://www.arcade.software/post/feature-announcement-examples)

### Dark Mode and Technical Email Design
- [Dark Mode Guide - Litmus](https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers)
- [Dark Mode Best Practices 2026 - Enchant Agency](https://www.enchantagency.com/blog/dark-mode-email-design-best-practices-css-guide-2026)
- [Email Dark Mode - Customer.io](https://customer.io/learn/message-composing/email-dark-mode)
- [Video in Email Marketing - Mailtrap](https://mailtrap.io/blog/video-in-email-marketing/)
- [Video in Email - Litmus](https://www.litmus.com/blog/video-in-email)

### Design System Spacing
- [Space in Design Systems - EightShapes](https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62)
- [Spacing in Design Systems - LogRocket](https://blog.logrocket.com/8-best-ways-define-component-spacing-design-system/)
