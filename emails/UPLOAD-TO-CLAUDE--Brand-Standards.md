# Cinebody Email Template Library

## Brand Standards Quick Reference

| Token | Value |
|-------|-------|
| **Background** | `#0a0a0a` |
| **Accent (Primary)** | `#00bcf1` (cyan) |
| **Accent (Secondary)** | `#ffec03` (yellow) |
| **Accent (Tertiary)** | `#eb008b` (magenta) |
| **Heading Font** | Inter, 800 weight, -0.04em tracking |
| **Body Font** | Inter, 400 weight, 15-16px |
| **Mono Font** | JetBrains Mono (eyebrows/labels only) |
| **Container** | 640px max-width |
| **Border Radius** | 12px (cards), 8px (buttons), 9999px (pills) |
| **Hero Gradient** | `linear-gradient(180deg, #0a0a0a, #041a24)` |
| **Aurora Glow** | `radial-gradient(ellipse at 85% 10%, rgba(0,188,241,0.12)...)` |

### Tri-Color Bar Rules
- Used ONLY in header and footer as a signature element
- Never use all 3 accent colors in body content
- Body content uses `#00bcf1` as the sole accent; white for emphasis

### Typography Hierarchy
- **Eyebrow**: JetBrains Mono, 10-11px, 600, uppercase, 0.12-0.15em spacing, `#00bcf1`
- **H1**: Inter, 34-40px, 800, -0.04em tracking, `#ffffff`
- **H2**: Inter, 24px, 700, -0.02em, `#ffffff`
- **Body**: Inter, 15-16px, 400, `rgba(255,255,255,0.55)`
- **Caption/Meta**: Inter, 12-13px, `rgba(255,255,255,0.35)`

### Component Patterns
- **Header**: Centered logo (120px) + tri-color bar
- **Header (w/ login)**: Left logo (140px) + right "Log in" pill link + tri-color bar
- **Hero**: Dark gradient bg + aurora glow + eyebrow + H1 + subtitle + fade-out
- **CTA Button**: `#00bcf1` bg, 14-15px 600, 14px 32px padding, 8px radius
- **Ghost CTA**: 1px border `rgba(0,188,241,0.3)`, cyan text
- **White Section**: `#ffffff` bg, `#111111` text, `#e4e4e7` dividers
- **Footer**: Tri-color bar + "Visit cinebody.com" ghost CTA + unsub/browser links + copyright
- **Play Button Overlay**: 48-56px circle, `rgba(0,0,0,0.55)` bg, 2px white border, negative margin-top overlay
- **Step Numbers**: 42px square, 12px radius, cyan bg/border, centered number

---

## Template Categories

### 1. Filmer / All Permissions (Transactional)
**Folder:** `transactional/`

| # | File | Trigger | Audience |
|---|------|---------|----------|
| 01 | `01-welcome.html` | User signs up | All |
| 02 | `02-project-invite.html` | Added to project | All |
| 03 | `03-new-message.html` | Unread message >1hr | All |
| 04 | `04-password-reset.html` | Password reset request | All |

### 2. Team & Account Admin (Notifications)
**Folder:** `admin-notifications/`

| # | File | Trigger | Audience |
|---|------|---------|----------|
| 05 | `05-files-ready.html` | Bulk download zipped | Team & Account admins |
| 06 | `06-signatures-ready.html` | Legal signatures ready | Team & Account admins |
| 07 | `07-filming-activity.html` | Filmers filming (settings) | Team & Account admins |

### 3. Marketing Drip (Nurture Sequence)
**Folder:** `marketing-drip/`

| # | File | Trigger | Purpose |
|---|------|---------|---------|
| M1 | `marketing-01-welcome.html` | New lead signup | Intro + 3 case study examples |
| M2 | `marketing-02-nike-case-study.html` | Visited case study/pricing | Nike case study deep dive |
| M3 | `marketing-03-competitive.html` | Researching UGC/competitors | Comparison table + example |
| M4 | `marketing-04-services.html` | Visited services page | 3 service cards + process |
| M5 | `marketing-05-re-engagement.html` | Lead went cold (7-14 days) | Stats + call offer |
| M6 | `marketing-06-royal-caribbean.html` | Nurture sequence | RC case study deep dive |

### 4. Onboarding Sequence
**Folder:** `onboarding/`

| # | File | Trigger | Purpose |
|---|------|---------|---------|
| O1 | `onboarding-01-getting-started.html` | Day 1 after signup | Quick start guide |
| O2 | `onboarding-02-first-project.html` | Day 3 / no project created | Create first project nudge |
| O3 | `onboarding-03-invite-team.html` | Day 5 / solo user | *Not yet built* |
| O4 | `onboarding-04-first-content.html` | Day 7 / no uploads | *Not yet built* |

### 5. Billing & Subscription
**Folder:** `billing/`

| # | File | Trigger | Purpose |
|---|------|---------|---------|
| B1 | `billing-01-trial-ending.html` | 7 days before trial expires | Trial expiration warning |
| B2 | `billing-02-payment-receipt.html` | Successful payment | *Not yet built* |
| B3 | `billing-03-payment-failed.html` | Payment fails | *Not yet built* |
| B4 | `billing-04-plan-changed.html` | Upgrade/downgrade | *Not yet built* |

### 6. Product Updates
**Folder:** `product-updates/`

| # | File | Trigger | Purpose |
|---|------|---------|---------|
| P1 | `product-01-feature-launch.html` | Major release | New feature announcement |
| P2 | `product-02-monthly-update.html` | Monthly cadence | *Not yet built* |

### 7. Re-engagement / Win-back
**Folder:** `re-engagement/`

| # | File | Trigger | Purpose |
|---|------|---------|---------|
| R1 | `reengagement-01-miss-you.html` | 30 days inactive | Soft check-in |
| R2 | `reengagement-02-whats-new.html` | 60 days inactive | *Not yet built* |
| R3 | `reengagement-03-final-offer.html` | 90+ days inactive | *Not yet built* |

### 8. Creator Network
**Folder:** `creator-network/`

| # | File | Trigger | Purpose |
|---|------|---------|---------|
| CN | `creator-network-email.html` | Selected for network | Onboarding + agreements |

---

## Dynamic Variables Reference

| Variable | Example | Used In |
|----------|---------|---------|
| `{{firstName}}` | Sarah | All |
| `{{projectName}}` | Summer Campaign 2026 | 02, 07, filming-related |
| `{{filmerNames}}` | Jake, Maria | 07 |
| `{{number}}` | 12 | 07 (clip count) |
| `{{interval}}` | 24 hours | 07 |
| `{{planName}}` | Professional | Billing emails |
| `{{trialDaysLeft}}` | 7 | B1 |
| `{{amount}}` | $250.00 | B2 |
| `{{featureName}}` | Shot List Templates | P1 |

## Placeholder URL Reference

All CTAs use `#PLACEHOLDER_URL` format for easy find-and-replace:
- `#LOGIN_URL`, `#DOWNLOAD_APP_URL`, `#START_FILMING_URL`
- `#OPEN_CHAT_URL`, `#RESET_PASSWORD_URL`, `#KNOWLEDGE_BASE_URL`
- `#DOWNLOAD_FILES_URL`, `#DOWNLOAD_SIGNATURES_URL`, `#OPEN_PROJECT_URL`
- `#BOOK_CALL_URL`, `#LEARN_MORE_URL`, `#UNSUBSCRIBE_URL`, `#VIEW_IN_BROWSER_URL`
- `#NIKE_VIDEO_URL`, `#RC_VIDEO_URL`, `#POINTME_VIDEO_URL`
- Calendly: `https://calendly.com/tyler-cinebody/creating-high-quality-ugc-with-cinebody`
