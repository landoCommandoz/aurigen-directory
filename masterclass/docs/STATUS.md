# STATUS: Lando's Detailing Masterclass 101

The status board. Every session starts here. Owner: the lead. Updated 2026-10-11 (Phase 1 built, QA gate passed, pull request open).

## Where things are

- Phase 1 (Foundation) is built, tested, and on the branch `masterclass/phase-1`, with a pull request to `main`. It also carries the Phase 0 decisions branch (pull request #164) underneath it.
- Live link after the merge: https://landocommandoz.github.io/aurigen-directory/ (GitHub Pages, free, 0 Netlify credits). Pages deploys from `main` only. Lando's one tap, once: the repo on github.com, Settings, Pages, Source, GitHub Actions.
- CI: every push that touches `masterclass/` runs the Masterclass Pages workflow: install, `npm run check`, and the Pages build. Green on the branch.
- Netlify: nothing connected. Credits spent so far: 0. The tap-to-run Netlify workflow exists and does nothing until Lando adds the token at the Phase 3 gate.
- Lando does not want pull request watching. He merges each phase pull request himself.

## Read in this order (new session)

1. `masterclass/CLAUDE.md` (rules). The Aurigen `CLAUDE.md` at the repo root is a different project.
2. This file.
3. `docs/BLUEPRINT.md` ("Read this first", then sections 3, 9, 12).
4. `docs/DECISIONS.md` (D0 to D13, the dated records, the lead's defaults L1 and L2).
5. `docs/OWNERSHIP.md` (who writes what; agents write only their own folders).
6. `docs/QA-REPORT.md` (what was tested, pass history, phone-only checklist).
7. `docs/HANDOFF.md` (Lando, DJ, Suzie) and `docs/HOW-TO-ADD.md` (adding content).

## What Phase 1 delivered

- App: Vite 8, React 19, TypeScript 6, offline-first PWA (prompt-mode updates that never interrupt), three densities (Shop, Academy, Customer), bottom row with Fix It on every internal screen, install card, setup banner, update banner, offline marker, Pages deep-link fallback, CSP.
- Core: Dexie database, storage probe, owner PIN (PBKDF2, 5-minute owner pass, three wrong tries lock 30 seconds and survive a reload), device role rules (D12), backup and restore through the share sheet (never refused for an unreadable settings row, D12 amendment), Hand over (L1), Customer View mechanism with held toasts and the Focus reminder, speech, wake lock, search, content build with validation.
- Screens: Home, Fix It entry (search plus Quick Card tiles; symptom tiles are Phase 2), Quick Cards with read aloud, Search, Settings, setup flow (PIN, then the first backup right then, weekly reminder on), Device role, Backup and restore, developer panel (owner PIN, removable), device preview, thumb side (left default), Academy outline, Job placeholder, Customer screen (brand, towns, one line, phone).
- Content: 77 seed items, all internal: 14 Quick Cards, 21 products, 22 tools, 20 glossary terms. The fact-checker's corrections are applied to content (see "Knowledge base corrections" below).
- Design: Direction A tokens, self-hosted Barlow and Barlow Condensed, motion and print styles, base components, app icon.
- Tests: 980 unit tests and 912 end-to-end tests (375, 430, 768, 1024, 1440 px plus the Pages base), all passing, none marked as a known failure. Lighthouse mobile 91 to 92 performance, 100 accessibility; axe 0 violations.

## Open decisions (Lando)

1. Teslas (verification log FC-16): Tesla's manual says no chemical wheel cleaners or pre-wash products, no cutting pastes or harsh-abrasive polishes, and cleaning damage is not under warranty. The house SOP uses Armor All on wheels, a pump-sprayer pre-soak, and compound on rung 3. Proposed default: on Teslas, bucket soap and a soft brush on wheels, no pre-soak, the ladder stops at maroon + M210, compound only with the owner's OK after seeing the test spot.
2. Polisher speed and pressure (FC-22, FC-23): the 56367 manual says "only use slower speeds for polishing" and "keep pressure off of the tool"; the HF product page says speeds 4 to 6; the house rule is speed 4 and about 10 lb. Proposed default: keep the house settings and show the manual's lines on the card.
3. Aftercare card (FC-06): Meguiar's says the spray Hybrid Ceramic Wax needs no cure time, so "First 24 hours: keep it dry" is wrong. Proposed default: replace it with "Your ceramic wax needs no cure time. It started protecting the paint the day we applied it."
4. Knowledge base corrections the fact-checker confirmed (FC-02 strip ratio wording, FC-10 M210 wording, FC-18 where the thread size comes from, FC-24 the manual's 30-second test run): proposed default: the lead edits those knowledge base lines to match. Until then, content follows the label and the knowledge base still shows the old wording.
5. Phase 2 pre-build questions (asked in the Phase 1 gate message).

## Defaults the lead took (Lando may overrule; `docs/DECISIONS.md`)

- L1: Hand over to another phone is built (PIN, backup through the share sheet, switch to study only after the share saved).
- L2: bike hand polishing is not gated by the test spot or Level 4 checks; those cover machine polishing.
- Sign-offs restored from a backup come back "needs re-check" unless the restore brings the PIN that made them (architect, stricter than the brief, closes a Start-fresh loophole).
- Press scale 0.98 (the build) is the design value; the doc matches.

## Phase 3 entry conditions (before the first real job is stored)

- Every table, not only settings, must survive a rollback: the backup path reads rows leniently (unknown fields dropped and reported, writes stay strict). Architect specifies, app-engineer builds. Today only settings has this.
- No rollback ever crosses a database version change (IndexedDB refuses to open a lower version). DB_VERSION changes only with the architect's approval and a backup-first step. Record in D5.
- The polish guard treats "needs re-check" sign-offs as not signed off.

## Phase-only checks for Lando's phone (WebKit is not in the build VM)

The 9-item device checklist in `docs/HANDOFF.md` section 9 and `docs/BLUEPRINT.md` section 9, plus: the PIN pad with gloves (a deliberate first tap must never be ignored; the guard is 350 ms), Hand over's share sheet, and the Focus reminder.

## Next

Phase 2 (Content): all knowledge base content converted, Fix It at 33 or more entries, Levels 0 to 4, synonyms and 45 or more search cases, fact-check pass. Starts after Lando merges Phase 1, answers the open decisions above (or says defaults OK), and answers the Phase 2 pre-build questions.

## Last change

2026-10-11: Phase 1 foundation, fix wave (DEF-03 to DEF-15 closed), Hand over, fact-checker corrections applied to content, handoff docs; pull request opened.
