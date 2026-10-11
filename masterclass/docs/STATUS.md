# STATUS: Lando's Detailing Masterclass 101

The status board. Every session starts here. Owner: the lead. Updated 2026-10-10 (Phase 0 merged, gate answered, waiting on `build it`).

## Where things are

- Phase 0 (intake and blueprint) is complete and merged to `main` (pull request #163, 2026-10-08). Documents only. No app code exists.
- Production check after the merge, 2026-10-10: every `/masterclass/` path on https://aurigen-directory.vercel.app/ returns 404 while Aurigen's own files still return 200. The `.vercelignore` works on Git deployments.
- Lando answered the gate on 2026-10-10 (see below). The only thing left before Phase 1 is the word `build it`.
- Branch: `masterclass/phase-0-decisions` (this pull request): knowledge base section 15.5 removed, the decisions recorded in the docs.
- Code lives in: `masterclass/` inside the Aurigen repo `landoCommandoz/aurigen-directory`. The nine agents live at the repo root in `.claude/agents/`.
- Nothing is connected: no Netlify site, no GitHub Pages, no tokens. Netlify credits spent so far: 0.
- Lando does not want pull request watching. He merges each phase pull request himself.

## Read in this order (new session)

1. `masterclass/CLAUDE.md` (rules). The Aurigen `CLAUDE.md` at the repo root is a different project; its agent roster, file map, and phase plan do not apply here.
2. This file.
3. `docs/BLUEPRINT.md` (the plan; "Read this first" block, then sections 9 and 12).
4. `docs/DECISIONS.md` (D0 to D11 with every source, including the decisions Lando took on 2026-10-10 as D10 and D11 and a dated record at the end).
5. `docs/OWNERSHIP.md` (who writes what).
6. `docs/DESIGN-DIRECTIONS.md` (the two looks; A was picked).

## Lando's decisions, 2026-10-10 (all `[HOUSE]`)

- Repo: stay in this repo under `masterclass/` ("Repo OK"). The two Phase 1 workflow files at the repo root (GitHub Pages deploy, tap-to-run Netlify publish) are approved under the same OK.
- Knowledge base: section 15.5 (market research) removed from the repo. The rest stays public. Note: the removed text remains in the git history of earlier commits; scrubbing history is a separate decision for Lando.
- Defaults OK for items 1 to 16 of `docs/BLUEPRINT.md` section 12, with two edits:
  - Item 9: the pad ladder is yellow + M210, then maroon + M210, then maroon + Ultimate Compound followed by yellow + M210. Black is a wax and finishing pad only and never appears in the ladder. Pads on hand: Uro-Tec yellow x3, maroon x2, HF finishing pads (colors unconfirmed), one black pad.
  - Item 14: interior-only jobs do not count toward 25. Only jobs that touch paint count.
- Look: A (Hi-Vis). In Customer View the accent stays sparse; off-white, photos, and the panel-map readings carry that screen.
- Design questions: while polishing the phone is propped on the cart at arm's length; polisher in the right hand, left thumb taps; keep the left or right switch.
- First real job in the app: the next family car, no firm date. Until Phase 3 lands, the Model Y job sheet in `reference/` is the stopgap.
- Customer View and the phone: nothing from the phone may show. The app sends no notifications of its own while Customer View is on, and when Customer View is switched on it reminds Lando to turn on an iPhone Focus. Calls from Suzie can ring. No text previews, no job alerts.
- Crew gating: DJ's phone is for study only. Sign-offs live on the shop phone and happen with Lando's PIN while he watches the skill. Finishing a level on the study phone unlocks nothing. Machine polishing needs the Level 4 sign-off; Level 0 does not gate polishing. If Lando is standing there, he signs off on the shop phone right then. The car keeps moving: Lando polishes, DJ does what he is cleared for. Owner override only with the PIN and a logged reason.

## Architecture in one breath

One offline-first web app installed to the iPhone Home Screen. Five rooms: Fix It, Job Runner (Shop Mode), Academy, Customer View, Business. Content compiled from files into the app at build time. Jobs, readings, photos, crew, and sign-offs live in a database on the shop phone (Lando's). A study phone (DJ's) holds Academy progress only and shares it as a file. Owner PIN for sign-offs, pricing internals, and leaving Customer View during a customer session. No AI, no accounts, no sync in v1.

Key states: Skill (Locked to Signed off, with Revoked), Job (Draft to Debriefed, with Stopped and Canceled; QC before Delivered; test spot before polish; Level 4 sign-off before a crew member polishes), Business unlocks (25 paint-touching cars; five founder's slots), Customer View (On or Off, PIN to leave during a session, Focus reminder on entry), App version (update never interrupts a running job), Connectivity (Shop Mode identical offline).

## Facts that shape the build (all sourced in `docs/DECISIONS.md`)

- Netlify: a successful production deploy costs 15 credits. Deploy Previews, branch deploys, failed deploys, rollbacks, and CLI draft deploys cost 0. All sites on a team share one credit pool; at zero every site on the team is paused. Balance and plan name: `[VERIFY]` with Lando before the first publish (app.netlify.com, Usage and billing).
- Phone testing: GitHub Pages at https://landocommandoz.github.io/aurigen-directory/ (free because the repo is public, 0 credits). Lando's one tap when Phase 1 is ready: repo Settings, Pages, Source, GitHub Actions. Runner-up: Netlify draft deploys through a tap-to-run workflow. First Netlify production publish at the Phase 3 gate, by Lando's own tap.
- Hosting: no Netlify site exists at aurigen-directory.netlify.app; aurigendirectory.com is a parked page; the live Aurigen app is https://aurigen-directory.vercel.app/ and Vercel serves raw repo files, now minus `masterclass/`. Vercel branch previews are behind a Vercel login.
- iPhone: Home Screen web apps are exempt from Safari's 7-day storage wipe; `persist()` cannot be trusted; screen wake lock works in Home Screen apps from iOS 18.4; speech needs a tap to start and its behavior after the screen locks is `[VERIFY]` on Lando's phone; backups go through the share sheet, not a download link.
- Stack: Vite 8, React 19, TypeScript 6 pinned, vite-plugin-pwa 2 (prompt mode), Dexie 4, MiniSearch 7 (synonyms expanded at index time), Zod 4, Vitest 5, Playwright 1.64 (WebKit for iPhone emulation), npm with a committed lockfile, Node 22.

## Phase 0 record

- Kit committed from the zip into `masterclass/`; agents into the root `.claude/agents/`.
- Research with independent checking: Netlify credits and mechanics, iPhone web-app limits, phone-only testing paths, stack currency. 53 agent runs. 40 critical claims checked by a second agent: 36 confirmed, 4 corrected, 0 refuted. Unconfirmed items are marked `[VERIFY]` in the docs.
- ui-designer: two directions, wireframes, template-tell audit, recommendation A. Lando picked A.
- architect: blueprint, ten decisions (D0 to D9), ownership tree.
- Three review passes (adversary 23 defects, reader 11, facts 8), every defect fixed, then a completeness check that passed 16 of 16 on the recheck.
- The agents were not loaded when the session started. The first wave ran through the built-in agent with each role's file as its instructions; after a restart the nine agents loaded and the architect and QA roles ran as themselves.

## Next (Phase 1, after `build it`)

Foundation, on a fresh branch from `main`: scaffold in `masterclass/`, PWA shell, routing, the three density shells, content pipeline with validation, tokens and base components (Direction A), self-hosted fonts, offline indicator, update banner, developer panel, device preview, install card, storage probe, device role (shop or study, study by default). Plus the two workflow files at the repo root. Gate: Lando installs from the Pages link, opens it in airplane mode, and runs the 9-item device checklist in `docs/BLUEPRINT.md` section 9.

## Last change

2026-10-10: knowledge base section 15.5 removed; Lando's gate decisions recorded in BLUEPRINT.md, DECISIONS.md (D10, D11, dated record), DESIGN-DIRECTIONS.md, and this file; pull request opened for the merge. Waiting on `build it`.
