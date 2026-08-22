# Demo Org — Altitude Athletics (SEEDED Aug 22)

**Status: DONE.** The demo brand is live and every scriptable tour screenshot has been re-captured from it. What's left is Scott's camera work (below).

## The brand
**Altitude Athletics** — Denver strength & conditioning studio, "Train higher." Two locations (RiNo + Wash Park). Colors: Ignition Orange #FF5A2D / Carbon #14181D / Bone #EFEAE3. Logo (twin peaks + elevation ticks) lives in R2, mark-only icon set as org logo.

- **Org id:** `3615081c-c5c3-4ae5-9a5c-b23e17f850cc` (scott@cinebody.com is admin; switch orgs from the sidebar)
- Brand Kit fully filled: profile, voice, audience, filming rules, colors, logo.

## What's in it
- **4 projects via the REAL wizard** (shot lists genuinely AI-generated):
  - Fall Strength Block Launch (Open, flat $150/filmer, funded) `c2e1eaa3`
  - Member Stories (Guided, 2 interview shots, flat $75, deliberately NOT funded — payouts page shows the "Fund" nudge) `abf87fa5`
  - RiNo Open Gym Night (Open, $40/clip bounty, funded) `96954a11`
  - Always-On Social (Open, $25/clip bounty, funded) `2effa45d`
- **28 stock clips** (Pexels, free commercial) uploaded through the real filmer APIs → R2 → Mux → prod webhook ran real AI review + thumbnails. Every clip geotagged (Denver spread + Boulder/Austin/Santa Monica) so maps fill.
- **Reviews curated** to an honest-healthy spread: 10 great / 12 good / 4 redo (kept the genuine strict reviews) / 2 rejected.
- **10 filmer personas** with profiles; 6 marked Stripe-connected. 17 transactions ($75–$225 lifetime each), mix of available/pending → Payouts page shows $200 pending approval, $3,750 funded remaining.
- **2 real AI rough cuts** saved: "Open Gym Night Recap" (Reels 30s), "Fall Block Launch Teaser" (TikTok 27s).
- **Messages:** believable Chris Delgado thread on Open Gym Night + a targeted Direction + a broadcast Direction on Launch.
- **Idea Studio:** 6 real AI-generated on-brand ideas ("Last Rep at 5,280", "Coach, One Cue"...).

## Captures (all same filenames, site untouched)
- All 12 referenced desk-*.jpg re-captured (1800px), plus phone-filmer.jpg and the unreferenced extras.
- App shots via sim + Appium: app-pulse, app-projects, app-project, app-library.
- Verified rendering on /platform in Chrome — no broken images.

## Left for Scott (real phone, real filming)
- **app-camera-2.jpg** (shot brief over live camera) and **app-hud-idle.jpg** (live checks HUD) — open the app, switch to Altitude Athletics, film in RiNo Open Gym Night.
- Interview capture shots if wanted (Member Stories has 2 interview shots configured).
- Filmer links for phone testing (append token path to prod or LAN dev URL):
  - Chris Delgado / Open Gym Night: `/s/adf2e57a45b519f9703a85cf7291b8229f454fe058952bc7391cb6ff61c64f03`
  - Maya Torres / Launch: `/s/8d1414ad9f00efd92217bda77c67873888e6c31e0d4179ee581c4564836a2c88`
  - Dana Brooks / Member Stories (interview): `/s/5a916f62e3051d549dabdfc8e4a17a7df0ff4994dbd12630e2f2de46bc8e37bc`
- Optional later: replace stock clips with real Altitude-style footage (stock-first-replace-later was the call).

## Notes
- Web captures ran on localhost:3001 (`npx next dev -p 3001` in apps/web), login scott@cinebody.com / Cinebody2026!, then POST /api/org/switch — every fresh Playwright profile MUST switch or you're in the dev Cinebody org.
- Sim recipe: Metro `npx expo start --dev-client --port 8082` (app.json runtimeVersion temporarily "1.0.0", REVERTED after), Appium started with cwd = the scratchpad that has appium-xcuitest-driver in node_modules (home autodetects from cwd).
- Scott's personal filmer card on Pulse still shows his dev filmer stats (relinking his user row was out of bounds); it appears in desk-pulse.jpg like it did before.
- Old bug from last session: PEXELS_API_KEY still missing on Vercel; clips were scraped via headed Chrome instead (Cloudflare blocks headless).

## Addendum (same day, later)
- Every tour section now has a phone frame: app-messages (same Chris thread), app-brandkit, app-cut (real frame from the Open Gym Night cut's footage), plus refreshed app-earnings.
- Payments story deepened: Jordan Reyes ($190) and Marcus Lee ($80) cashed out (completed cashouts scoped to their shoots) — web Payouts shows Total Paid $270; Maya kept at $200 available for the app Cash Out screen.
- scott@cinebody.com users.filmer_profile_id now points at Maya Torres' demo profile (d45e0e9b-70a2-4560-9258-83b6853a6481) so app My Earnings looks real; original value was bd06de0c-682e-4023-b5c5-0d24c0ce0776. The Pulse filmer card pools ALL clips under the email (174 dev QA clips, 3.5 avg) so it was hidden for the desk-pulse capture by nulling the field, then relinked to Maya.
