# Cinebody Email Template SOP
## Standard Operating Procedure for Creating & Modifying Email Templates

---

## 1. Overview

This document defines the process for creating new Cinebody email templates or modifying existing ones using Claude (AI assistant). All emails must follow the Cinebody brand standards defined in `EMAIL-LIBRARY.md`.

---

## 2. Template Categories

Before creating a new email, identify which category it belongs to:

| Category | Style | Header | Body Theme | Footer |
|----------|-------|--------|------------|--------|
| **Transactional** (filmer-facing) | Dark + aurora hero | Logo + Login pill + tri-color bar | Steps, tutorial blocks, knowledge base | Social links + unsub + copyright |
| **Admin Notifications** | Dark + aurora hero | Logo + Login pill + tri-color bar | White "Need editing help?" upsell section | Audience label + unsub + copyright |
| **Marketing/Nurture** | Dark editorial | Centered logo + tri-color bar | Case study images, comparison tables, stats | Ghost CTA + unsub + copyright |
| **Onboarding** | Dark + aurora hero | Centered logo + tri-color bar | Numbered steps, feature highlights | Ghost CTA + unsub + copyright |
| **Billing** | Dark, minimal | Centered logo + tri-color bar | Clean text, callout boxes, details table | Ghost CTA + unsub + copyright |
| **Product Updates** | Dark editorial | Centered logo + tri-color bar | Feature cards, before/after, screenshots | Ghost CTA + unsub + copyright |
| **Re-engagement** | Dark, conversational | Centered logo + tri-color bar | Stats, "what's new" list, soft CTA | Ghost CTA + unsub + copyright |
| **Creator Network** | Dark + aurora + badge | Centered logo + tri-color bar | Badge card, onboarding steps, benefits grid | Signature + attachments + copyright |

---

## 3. How to Create a New Email with Claude

### Step 1: Pick a Reference Template

Choose the closest existing template to your new email:

- **For transactional emails** -- start from `01-welcome.html` or `04-password-reset.html`
- **For admin notifications** -- start from `05-files-ready.html`
- **For marketing emails** -- start from `marketing-01-welcome.html` (with examples) or `marketing-05-re-engagement.html` (text-focused)
- **For case study emails** -- start from `marketing-02-nike-case-study.html`
- **For onboarding emails** -- start from `onboarding-01-getting-started.html`
- **For billing emails** -- start from `billing-01-trial-ending.html`

### Step 2: Write a Prompt for Claude

Use this prompt template:

```
I need a new Cinebody email template. Here are the details:

CATEGORY: [Transactional / Admin / Marketing / Onboarding / Billing / Product / Re-engagement]

REFERENCE TEMPLATE: [paste the full HTML of the closest existing template]

PURPOSE: [What this email does, e.g. "Notifies team admins when a new filmer joins their project"]

TRIGGER: [What event sends this email, e.g. "New user accepts project invitation"]

AUDIENCE: [Who receives it, e.g. "Team admins only"]

HEADLINE: [Main headline text, e.g. "A new filmer just joined"]

BODY CONTENT: [Key information to include]

CTA: [Button text and what it links to, e.g. "View Project" linking to project dashboard]

DYNAMIC VARIABLES: [List any personalized fields, e.g. {{filmerName}}, {{projectName}}]

BRAND RULES:
- Dark theme (#0a0a0a background)
- Tri-color bar in header and footer ONLY (never in body content)
- Single accent color in body: #00bcf1 (cyan)
- Font: Inter (headings 800 weight, body 400)
- Eyebrows: JetBrains Mono, 10-11px, uppercase
- Container: 640px max-width
- CTA button: #00bcf1 background, white text, 8px border-radius
- Must include: Outlook/MSO compatibility, dark mode support, mobile responsive (600px breakpoint)
- No emojis
```

### Step 3: Review the Output

Check these items before approving:

- [ ] Tri-color bar appears ONLY in header and footer
- [ ] Body uses only `#00bcf1` as accent (not yellow or magenta)
- [ ] Eyebrow text uses JetBrains Mono
- [ ] H1 is 34-40px, weight 800, -0.04em tracking
- [ ] Container is 640px with `.email-container` class
- [ ] Mobile styles use `.mobile-padding` (24px) and `.stack-column`
- [ ] Outlook compatibility block is present (`<!--[if mso]>`)
- [ ] Dark mode support is in CSS (`:root { color-scheme: light dark; }`)
- [ ] Preheader text is present and hidden
- [ ] All links use `#PLACEHOLDER_URL` format or real URLs
- [ ] Footer has unsubscribe link, "view in browser" link, and copyright
- [ ] No emojis anywhere in the template
- [ ] Images have alt text
- [ ] All `<table>` elements have `role="presentation"`

### Step 4: Modify an Existing Template

To change an existing template, use this prompt:

```
I need to modify this Cinebody email template. Here is the current HTML:

[paste the full HTML]

CHANGES NEEDED:
- [describe change 1]
- [describe change 2]

Keep all Cinebody brand standards intact:
- Dark theme, tri-color bar header/footer only
- #00bcf1 as sole body accent
- Inter + JetBrains Mono fonts
- All email compatibility (Outlook, dark mode, mobile responsive)
- No emojis
```

---

## 4. File Naming Convention

```
[category]-[sequence]-[short-name].html
```

Examples:
- `01-welcome.html` (transactional, filmer-facing)
- `marketing-02-nike-case-study.html` (marketing drip)
- `onboarding-03-invite-team.html` (onboarding sequence)
- `billing-01-trial-ending.html` (billing)
- `product-01-feature-launch.html` (product updates)
- `reengagement-02-whats-new.html` (win-back)

---

## 5. Testing Checklist

Before deploying any email template:

### Visual Testing
- [ ] Preview in browser (open the .html file)
- [ ] Check mobile view (resize browser to 375px wide)
- [ ] Test in Litmus or Email on Acid for cross-client rendering
- [ ] Verify images load (check squarespace-cdn URLs)
- [ ] Confirm play buttons overlay correctly on images

### Content Testing
- [ ] All placeholder URLs are replaced with real links
- [ ] Dynamic variables ({{firstName}}, etc.) are connected to your ESP
- [ ] Preheader text is accurate and compelling
- [ ] Subject line is written and under 50 characters
- [ ] Alt text on all images is descriptive

### Technical Testing
- [ ] Send test email to Gmail, Outlook, Apple Mail
- [ ] Verify dark mode rendering
- [ ] Check all links are clickable and correct
- [ ] Confirm unsubscribe link works
- [ ] Validate HTML (no unclosed tags)

---

## 6. Common Sections (Copy-Paste Reference)

### Standard Header (with Login)
Use in: Transactional, Admin Notifications

```
Logo (left, 140px) | "Log in" pill (right)
[tri-color bar]
```

### Standard Header (centered)
Use in: Marketing, Onboarding, Billing, Product, Re-engagement

```
Logo (center, 120px)
[tri-color bar]
```

### Aurora Hero
Use in: Most emails

```
Dark gradient bg + radial glow
Eyebrow (JetBrains Mono, cyan, uppercase)
H1 headline
Subtitle text
CTA button
Fade-out gradient
```

### "Need Editing Help?" Upsell
Use in: Admin notification emails (05, 06, 07)

```
White background section
3 benefits with icon circles
"Learn More" ghost CTA
```

### "Have Questions?" Support Block
Use in: Transactional emails (03, 04, 07)

```
White or dark background
"Visit our knowledge base" text
"Visit the Knowledge Base" CTA button
```

### Standard Footer
```
[tri-color bar]
"Visit cinebody.com" ghost CTA (marketing) or social links (transactional)
Unsubscribe | View in browser
(c) 2026 Cinebody. All rights reserved. Denver, CO
```

---

## 7. Image Assets

### Logos
| Asset | URL |
|-------|-----|
| Cinebody (white) | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/2886fba6-1049-443f-90c9-28d4ff6bf9c7/cb_white.png` |

### Case Study Screenshots
| Client | URL |
|--------|-----|
| Nike | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/c7a826f6-08ea-4cea-8b21-929cba3c1c98/Screenshot+2025-07-20+at+4.55.19%E2%80%AFPM.png` |
| Royal Caribbean | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/b76de59f-310a-4b26-a7e3-651359614dfd/Screenshot+2025-07-15+at+9.03.36%E2%80%AFAM.png` |
| point.me | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/be064369-ea83-4b63-8a58-3d834b9a8a20/Screenshot+2025-07-15+at+8.52.47%E2%80%AFAM.png` |
| Georgia-Pacific | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/040f2cd8-5aad-4f5f-bcc3-6adc732d7ca4/Paper-Plate-Dinosaur-Craft.aShadeOfTeal-3.webp` |

### Client Logos (for logo strips)
| Client | URL |
|--------|-----|
| Dell | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/1752627278987-YPPWINMNWY9CFG5RG38P/Dell_Logo.svg.png` |
| Boeing | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/1752627268766-2QVYTRN3751AIPACC1DY/Boeing_full_logo.svg.png` |
| Roku | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/1752627421486-833XE0MQ1XX3CN6X4CWM/Roku_logo.svg.png` |
| Experian | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/1752627290901-W6MGMUKBSWN9LCQ0A0PE/Experian_logo.svg.png` |
| Royal Caribbean | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/1752627411120-274CV165FQ2V3F5ES5RB/Royal_Caribbean_logo_%282024%29.svg.png` |
| Altra Running | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/1752627430711-TW8HK4VKFQZ4J7AZ0P7G/Altra_running_logo.png` |
| S&P Global | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/1752627309936-06LGFF1K8WXPIXXW2NVF/S%26P_Global_logo.svg.png` |
| Siemens | `https://images.squarespace-cdn.com/content/v1/68752bed553a097656efd4e1/1752627396194-CW02B4SCASKFVILEHX39/image.png` |

---

## 8. ESP Integration Notes

When importing templates into your email service provider (e.g., Customer.io, SendGrid, Mailchimp):

1. **Replace placeholder URLs** -- Find all `#PLACEHOLDER_URL` patterns and replace with real links or ESP merge tags
2. **Map dynamic variables** -- Replace `{{variableName}}` with your ESP's syntax (e.g., `{{ subscriber.first_name }}` for Customer.io)
3. **Set preheader** -- Some ESPs have a dedicated preheader field; duplicate the hidden preheader text there
4. **Configure triggers** -- Set up automation rules per the "Trigger" column in EMAIL-LIBRARY.md
5. **Test rendering** -- Always send test emails to Gmail, Outlook, and Apple Mail before activating
