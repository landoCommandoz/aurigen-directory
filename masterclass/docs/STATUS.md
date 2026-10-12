# STATUS: Lando's Detailing Masterclass 101

The status board. Every session starts here. Owner: the lead. Updated 2026-10-12 (Phase 2 built, QA gate passed, pull request open).

## Where things are

- Phase 1 (Foundation) is merged and live at https://landocommandoz.github.io/aurigen-directory/ (GitHub Pages, from `main`). The Aurigen Vercel site returns 404 for every `/masterclass/` path.
- Phase 2 (Content) is built and tested on `masterclass/phase-2`, with a pull request to `main`. QA gate passed on pass 5. Only DEF-22 stays open, parked by design until Phase 4.
- Phase 2 gate for Lando: `docs/FACT-REVIEW.md` (12 decisions, 17 corrected facts, 22 one-glance checks, 21 still unconfirmed). "Defaults OK" accepts every default.
- CI: every push that touches `masterclass/` runs install, `npm run check`, and the Pages build. Only `main` deploys.
- Netlify: nothing connected. Credits spent: 0.
- Lando does not want pull request watching. He merges each phase pull request himself.

## Waiting on Lando

- Asked 2026-10-11, not received (his reply said "answers above" and held none): the Phase 1 device checklist answers (`docs/HANDOFF.md` section 9; needed for Phase 3), and the three Phase 2 pre-build questions (his own words for the problems that bite most; what crew does when the label and the app disagree; the one screen a new hire reads first).
- The Phase 2 gate list in `docs/FACT-REVIEW.md`. It folds in the four decisions asked on 2026-10-11 (Teslas, polisher speed and pressure, aftercare wording, knowledge base corrections) and adds eight more: pad size against the plate, Tooele City home occupation rules, sales tax, pad washing, tire shine method, towel water, bagger chain add-on, and the DBA address.
- Until he answers, every one of these shows in the app as "Lando decides (pending)" or "unverified" and is never settled.

## Read in this order (new session)

1. `masterclass/CLAUDE.md` (rules). The Aurigen `CLAUDE.md` at the repo root is a different project.
2. This file.
3. `docs/BLUEPRINT.md` ("Read this first", then sections 3, 9, 12).
4. `docs/DECISIONS.md` (D0 to D13, the dated records, the lead's defaults L1 and L2, the D1 amendment of 2026-10-12).
5. `docs/OWNERSHIP.md` (who writes what).
6. `docs/CURRICULUM.md` (Levels 0 to 4 in order, skills, Levels 5 to 8 outline).
7. `docs/QA-REPORT.md` (Phase 2 passes 1 to 5 at the top, Phase 1 below).
8. `docs/FACT-REVIEW.md` and `knowledge/verification-log.md` (FC-01 to FC-115).
9. `docs/HANDOFF.md` and `docs/HOW-TO-ADD.md`.

## What Phase 2 delivered

- Content: 599 items, all internal. 89 Fix It entries (fix-01 to fix-33 from the knowledge base, 56 more), 31 lessons for Levels 0 to 4 plus 26 outline lessons for Levels 5 to 8, 31 SOPs, 31 drills, 167 quiz questions, 129 flashcards, 6 sign-off files, 38 glossary terms, 14 Quick Cards, 21 products, 22 tools.
- Search: 62 synonym groups, 101 search cases all passing (41 of the 43 knowledge base 24 cases plus 60 more phrased the way a person dictates; 2 price cases parked until Phase 4), slowest query under 5 ms.
- Facts: a fact-check sweep added FC-26 to FC-115 (40 confirmed, 17 corrected, 38 unconfirmed, 20 conflicting across the whole log). Every finding is applied to content: corrected wording sourced, conflicts as pending rows, nothing upgraded without a source.
- App: Fix It symptom tiles (Fix It, then the tile, is two taps to a fix), fix page with STOP lines first and read aloud, lesson, SOP, and item pages, search with Fix It first, content split into lazy chunks that are all saved for offline use, recovery when a piece fails to load, first-session offline fixed (D1 amendment: clientsClaim on, skipWaiting off, so updates still wait for the Update tap), and the first-session update reload fixed.
- Tests: 1,439 unit tests, 1,543 end-to-end tests at 5 widths and both base paths, none marked as a known failure. Lighthouse mobile 0.90 to 0.94, accessibility 100; axe 0 violations.

## Defaults the lead took (Lando may overrule)

- L1: Hand over to another phone. L2: bike hand polishing not gated by the test spot or Level 4.
- Level 0 order: rules that never bend, stay safe, never list, how paint works, what can and cannot be fixed, shop setup. Lando may reorder it.
- Sign-off pass marks and drill minimums are proposals marked unverified until Lando accepts them (`docs/CURRICULUM.md`).

## Phase 3 entry conditions

- Lando's device checklist answers (speech after lock, wake lock, share sheet, first launch from the icon offline).
- Every table, not only settings, survives a rollback: the backup path reads rows leniently. Architect specifies, app-engineer builds.
- No rollback crosses a database version change; DB_VERSION changes only with the architect's approval and a backup first.
- The polish guard treats "needs re-check" sign-offs as not signed off.
- Decision 4 in `docs/FACT-REVIEW.md` (Tooele City rules) and DJ's age (FC-107) settle before the Job Runner lets a crew profile run a power-tool stage.

## Next

Phase 3 (Shop Mode): Fix It UI completed, search UI, Job Runner, Quick Cards in the run, gauge entry with bands, read-aloud, hands-busy mode, setup timer, cutoff time, test spot gate, then the first Netlify production check. Starts after Lando merges Phase 2 and answers the open items above (or says defaults OK).

## Last change

2026-10-12: Phase 2 content, fact sweep and application, renderers, offline and update fixes, FACT-REVIEW.md; QA gate passed; pull request opened.
