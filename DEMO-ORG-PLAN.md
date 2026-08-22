# Demo Org — Next Session Brief (written Aug 22, ~1am)

**The mission:** build an incredible fake demo brand account on the Cinebody platform, fill EVERYTHING so it looks like an account genuinely in use, then re-capture every Platform-tour screenshot from it. Clean, on-brand, zero dev-org artifacts (no Grok QA clips, no "safe to delete" cuts, no $0 payouts, no Cinebody-meta idea cards).

**Scott's calls still open:**
- Brand name + vibe (coffee/espresso brand suggested — the wizard capture already invented "Espresso Machine Launch"; he may want something else)
- Footage: stock vertical UGC-style clips to seed (Pexels, free commercial) vs his own. Stock-first-replace-later was recommended.
- **Scott does the camera captures himself** (real phone, real filming) — leave the AI Director / capture / interview phone shots to him. Everything else is scriptable.

**Seed checklist (everything filled):**
1. New org + membership for scott@cinebody.com (org switcher in app + web).
2. Brand Kit: logo, 3 brand colors, voice & tone, audience, filming rules, brand profile page COMPLETE (use "Fetch brand" if we give the brand a one-page site, else hand-fill).
3. 3-4 projects via the REAL wizard (so shot lists are genuinely AI-generated): e.g. product launch, customer stories (interview mode ON, pink), event/café tour, always-on social. Payout amounts configured so the filmer link shows money.
4. Footage: ~20-30 vertical clips uploaded through the filmer link with **spoofed browser geolocation** (Playwright context geolocation, scatter coords across Denver + a few national) so the Map fills with pins. Fallback: set clip lat/lng via service role. Sim path: `xcrun simctl location <udid> set <lat,lon>`.
5. Let AI Clip Review score everything (real scores, mixed results look honest).
6. Post Production: build 1-2 cuts with real briefs; name them properly (no "safe to delete").
7. Messages: a believable filmer thread + a Direction sent (notifications story).
8. Idea Studio: deal ideas under the demo brand (fixes the meta-Cinebody card).
9. Payouts: as much as fake-able without real Stripe money — filmers connected, amounts pending; check what renders without live funding.
10. Re-run captures → `site/public/app-ui/live/` → tour updates automatically (same filenames).

**Tooling already proven (this session):**
- Web captures: Playwright scripts `capture*.mjs` in the session scratchpad — login scott@cinebody.com / Cinebody2026! on localhost:3001 (`npx next dev -p 3001` in apps/web). Use `channel: 'chrome'` for anything with video (headless chromium lacks codecs).
- App captures: real simulator (iPhone 17 Pro, UDID 0C677330-B817-44A5-A8D1-089020D77CC0) + dev-client build from DerivedData + Metro on :8082 + **Appium/XCUITest** driving taps by testID (`~tab-projects`, `~shoot-film`, `~camera-record`, `project-row-{id}`). NEVER computer-use. Gotcha: `expo start` needs app.json runtimeVersion temporarily set to "1.0.0" (bare workflow) — REVERT after.
- Post-prod editor URL: `/dashboard/post-production?project={id}`. Wizard: `/dashboard/new` (4 steps; shots generate on step 2).

**Platform bugs found en route (for a platform session, not this one):** Sploot saved cuts crash the editor; regrade-stuck-clips cron 930 errors/90d; PEXELS_API_KEY missing on Vercel (cover fallback dead). Cover generation itself was fixed + shipped (564fcd0).
