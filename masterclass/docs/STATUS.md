# STATUS: Lando's Detailing Masterclass 101

The status board. Every session starts here. Owner: the lead. Updated 2026-10-08 (end of Phase 0).

## Where things are

- Phase: 0 (intake and blueprint) is complete. Documents only. No app code exists.
- Gate: waiting on Lando. He answers `docs/BLUEPRINT.md` section 12 (or says "defaults OK"), picks a look (A, B, or A with B's accent), says "repo OK" or "private repo", then types `build it`.
- Branch: `masterclass/phase-0`, pull request to `main` open. See the pull request for the merge rule.
- Code lives in: `masterclass/` inside the Aurigen repo `landoCommandoz/aurigen-directory`. The nine agents live at the repo root in `.claude/agents/` and load as project agents.
- Nothing is connected: no Netlify site, no GitHub Pages, no tokens. Netlify credits spent so far: 0.

## Read in this order (new session)

1. `masterclass/CLAUDE.md` (rules). The Aurigen `CLAUDE.md` at the repo root is a different project; its agent roster, file map, and phase plan do not apply here.
2. This file.
3. `docs/BLUEPRINT.md` (the plan; "Read this first" block, then sections 9 and 12).
4. `docs/DECISIONS.md` (D0 to D9, with every source).
5. `docs/OWNERSHIP.md` (who writes what).
6. `docs/DESIGN-DIRECTIONS.md` (the two looks).

## Architecture in one breath

One offline-first web app installed to the iPhone Home Screen. Five rooms: Fix It, Job Runner (Shop Mode), Academy, Customer View, Business. Content compiled from files into the app at build time. Jobs, readings, photos, crew, and sign-offs live in a database on the shop phone (Lando's). A study phone (DJ's) holds Academy progress only and shares it as a file. Owner PIN for sign-offs, pricing internals, and leaving Customer View during a customer session. No AI, no accounts, no sync in v1.

Key states: Skill (Locked to Signed off, with Revoked), Job (Draft to Debriefed, with Stopped and Canceled; QC before Delivered; test spot before polish), Business unlocks (25 cars; five founder's slots), Customer View (On or Off, PIN to leave during a session), App version (update never interrupts a running job), Connectivity (Shop Mode identical offline).

## Facts that shape the build (all sourced in `docs/DECISIONS.md`)

- Netlify: a successful production deploy costs 15 credits. Deploy Previews, branch deploys, failed deploys, rollbacks, and CLI draft deploys cost 0. All sites on a team share one credit pool; at zero every site on the team is paused. Balance and plan name: `[VERIFY]` with Lando (app.netlify.com, Usage and billing).
- Phone testing: GitHub Pages at https://landocommandoz.github.io/aurigen-directory/ (free because the repo is public, 0 credits). Lando's one tap when Phase 1 is ready: repo Settings, Pages, Source, GitHub Actions. Runner-up: Netlify draft deploys through a tap-to-run workflow. First Netlify production publish at the Phase 3 gate, by Lando's own tap.
- Hosting found on 2026-10-07 and 2026-10-08: no Netlify site exists at aurigen-directory.netlify.app; aurigendirectory.com is a parked page; the live Aurigen app is https://aurigen-directory.vercel.app/ and Vercel serves raw repo files. Vercel builds a preview of every pushed branch of this repo.
- Repo is public. The knowledge base, including market research and floor-price math, is readable on GitHub today. A `.vercelignore` at the repo root keeps `masterclass/` out of Vercel deployments; the pull request records the before and after check.
- iPhone: Home Screen web apps are exempt from Safari's 7-day storage wipe; `persist()` cannot be trusted; screen wake lock works in Home Screen apps from iOS 18.4; speech needs a tap to start and its behavior after the screen locks is `[VERIFY]` on Lando's phone; backups go through the share sheet, not a download link.
- Stack: Vite 8, React 19, TypeScript 6 pinned, vite-plugin-pwa 2 (prompt mode), Dexie 4, MiniSearch 7 (synonyms expanded at index time), Zod 4, Vitest 5, Playwright 1.64 (WebKit for iPhone emulation), npm with a committed lockfile, Node 22.

## Open decisions (Lando)

- `docs/BLUEPRINT.md` section 12, items 1 to 16, each with a default. "Defaults OK" covers all 16.
- "Repo OK" (stay in this repo; three small root files) or "private repo" (move).
- The look: A Hi-Vis (recommended), B Blue Tape, or A with B's accent.
- `docs/DESIGN-DIRECTIONS.md` section 8, questions 1 and 2 (where the phone sits while polishing; which hand taps). Proposed defaults: phone propped on the cart at arm's length, so the one action sits at the bottom and the timer reads from four feet; polisher in the right hand, left thumb taps, with a left or right switch in Settings either way.

## Phase 0 record

- Kit committed from the zip into `masterclass/`; agents into the root `.claude/agents/`.
- Research with independent checking: Netlify credits and mechanics, iPhone web-app limits, phone-only testing paths, stack currency. 53 agent runs in total. Every claim the blueprint relies on was checked against its source by a second agent; unconfirmed items are marked `[VERIFY]` in the docs.
- ui-designer: two directions, wireframes, template-tell audit, recommendation A.
- architect: blueprint, ten decisions (D0 to D9), ownership tree.
- Three review passes (adversary, plain-English reader, fact check), every defect fixed by the architect, then a completeness check that passed 16 of 16 on the recheck.
- The agents were not loaded when the session started (new agents load on a new session). The first wave ran through the built-in agent with each role's file as its instructions; after a restart the nine agents loaded and the architect and QA roles ran as themselves.

## Next (Phase 1, after `build it`)

Foundation: scaffold in `masterclass/`, PWA shell, routing, the three density shells, content pipeline with validation, tokens and base components, self-hosted fonts, offline indicator, update banner, developer panel, device preview, install card, storage probe, device role (shop or study). Plus, after "repo OK", the two workflow files at the repo root (Pages deploy; tap-to-run Netlify deploy). Gate: Lando installs from the Pages link, opens it in airplane mode, and runs the 9-item device checklist in `docs/BLUEPRINT.md` section 9.

## Last change

2026-10-08: Phase 0 documents written and reviewed; `.vercelignore` added at the repo root; pull request opened.
