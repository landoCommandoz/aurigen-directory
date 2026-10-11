# QA report: Phase 1 gate

Owner: qa-adversary. Branch `masterclass/phase-1`. Four passes so far, all on 2026-10-11, all in the cloud VM against the production build served by `vite preview` at `/` (Netlify shape) and at `/aurigen-directory/` (GitHub Pages shape). Every number comes from a command run that day; the key output lines are quoted.

How this file reads, newest first:

1. Pass 4 (the fix wave recheck, second round): verdict, DEF-15 in detail, the recheck of every earlier defect, commands.
2. The defect register: every defect from all four passes with its status after each pass.
3. What only the phone can answer: the checklist Lando ticks.
4. Test inventory and how to run.
5. Pass 3 record (fix wave recheck, first round), kept as written.
6. Pass 2 record (recheck), kept as written.
7. Pass 1 record, kept as written, with the original reproduction steps for DEF-01 to DEF-12.

## Pass 4 verdict (fix wave recheck, second round, 2026-10-11, about 06:30 to 08:05 UTC)

**Gate: passed. No defect is open.** DEF-15, the one defect pass 3 found, is fixed by ui-designer and verified. The ten defects closed in pass 3 (DEF-13 fix-before-deploy; DEF-03, DEF-04, DEF-05, DEF-06, DEF-07, DEF-10, DEF-11, DEF-12, DEF-14 later) still hold: every test written for them passes in every full run of this pass. Hand over still holds in every order of events. Nothing new was found in the app. One full run failed once on a race in QA's own test helper (a request the test itself cancelled by loading a new page); QA fixed the helper and added a test for that moment, and the final full run passed. No test anywhere is marked as a known failure any more: no `test.fail`, no `it.fails`, no skip.

The only app change since pass 3 is the DEF-15 fix in `src/components/ui/` (ui-designer) and its note in `docs/DESIGN-DIRECTIONS.md`. A file scan of `src`, `scripts`, `content`, `public`, and the configs for anything newer than 04:30 UTC lists only those files and the generated content bundle.

### Lando, in plain words

- The PIN typing problem from the last pass is fixed. Type a new PIN and its confirmation straight through at any normal speed and it saves. A double tap on the last digit still never types an extra digit.
- The keys stay exactly where they are when the pad asks for the PIN again, and after "did not match", on every screen size from 320 px up.
- Everything fixed last time still works: backups with an unreadable role, Hand over, one tap one backup, the wrong-PIN count after a reload, the customer screen. Mobile performance is 91 to 92 (target 90+); layout shift is 0.001.
- Good to know, not a bug: the pad cannot tell a double tap from a very fast second tap on the same key. If your PIN starts with its own last digit (like 5 8 2 9 1 5) and you jump into the confirmation much faster than you typed the PIN, the first tap can be taken as a double tap and the screen waits with 5 dots. Tap Cancel and type it again at your normal pace. Nothing wrong is ever saved.

## Pass 4: commands and key output

| Command | Result | Key lines |
|---|---|---|
| `npm run check`, before QA's changes | exit 0, 41 s | `Test Files 52 passed (52)`, `Tests 980 passed (980)` (pass 3: 961). The owner's new `src/components/ui/__tests__/PinPadStep.test.tsx` adds 20 tests; `PinPad.test.tsx` has one fewer: its four DEF-04 pointer-guard tests are unchanged, and its hardware-key test now asserts that keys count at once inside the window (the DEF-15 rule). QA's DEF-15 tests are e2e only, so `check` was already green |
| `npm run check`, after QA's changes | exit 0, 43 s | typecheck clean (both programs); `oxlint --deny-warnings` no output; `content build: 77 items (quickcard 14, equipment 22, product 21, glossaryterm 20), 0 customer-safe, 0 superseded left out, 0 sign-off files, 0 synonym groups, 77 search documents`; `Test Files 52 passed (52)`, `Tests 980 passed (980)` |
| `npx vitest run tests/unit` (QA suites only), twice | exit 0 | `Test Files 10 passed (10)`, `Tests 475 passed (475)` both times |
| `npx vitest run src/components/ui` (the owner's component suites, including the DEF-15 tests) | exit 0 | `Test Files 11 passed (11)`, `Tests 100 passed (100)` |
| `npm run build` | exit 0, 15 s | `✓ 349 modules transformed`; `index 199.30 kB (gzip 62.45 kB)`; `vendor 469.55 kB (gzip 146.03 kB)`; `precache 19 entries (938.37 KiB)` |
| `VITE_BASE=/aurigen-directory/ npm run build` | exit 0, 15 s | `✓ 349 modules transformed`; `precache 19 entries (938.85 KiB)`; `dist/index.html` links `/aurigen-directory/manifest.webmanifest`; manifest `start_url "."`, `scope "."` |
| `node --check` on `dist/sw.js` and every `dist/assets/*.js` (both builds) | pass | no output |
| `npm run test:e2e`, run 1 (full: builds `/` and `/aurigen-directory/`, serves 4173 and 4174) | **exit 0**, 11.8 min | `Running 901 tests using 3 workers`; `901 passed (11.8m)`; JSON stats `expected 901, unexpected 0, flaky 0, skipped 0` |
| `npm run test:e2e`, run 2 (full, with the 2 PIN tests added after run 1) | exit 1, 11.9 min | `Running 911 tests using 3 workers`; `1 failed`, `910 passed (11.8m)`; JSON stats `expected 910, unexpected 1, flaky 0, skipped 0`. The one failure was a race in QA's test, not the app: see "Run 2's one failure" below |
| `npm run check`, after the fix to QA's request watcher | exit 0, 42 s | `Test Files 52 passed (52)`, `Tests 980 passed (980)` |
| `npm run test:e2e`, run 3 (full, the final state of every file) | **exit 0**, 12.0 min | `Running 912 tests using 3 workers`; `912 passed (12.0m)`; JSON stats `expected 912, unexpected 0, flaky 0, skipped 0`. Every test is plain: none is marked `test.fail` |
| Lighthouse 13.5.0, mobile, 3 runs | ran | performance 0.92, 0.91, 0.91; accessibility 1.00; best practices 1.00; SEO 0.54 (noindex on purpose); FCP 2.3 s; LCP 3.0, 3.1, 3.1 s; TBT 80, 70, 30 ms; **CLS 0.001** every run (the same two shifts as pass 3: `nav.app-bottom` 0.0008, `header.app-top > div.app-top__actions` 0.0006) |
| Lighthouse 13.5.0, `--preset=desktop` | ran | performance 1.00, accessibility 1.00, best practices 1.00, SEO 0.54 (`is-crawlable`, `robots-txt` only); FCP 0.5 s, LCP 0.6 s, TBT 0 ms, CLS 0.0001 |
| axe-core 4 (WCAG 2.0 to 2.2 A and AA, best practice), scratch probe | ran | 32 screens at 375 and 1440 px: the 16 routes; 5 PIN screens (the new PIN pad on arrival, the confirmation step, the mismatch step, Change PIN current and new); the 3 Hand over screens; the 6 unreadable-settings screens; Customer View with and without the Focus reminder: `total axe violations: 0` |
| PIN cadence probe (scratch), 375 px | ran | PIN `482915`, new PIN then confirmation at a steady gap: saved at every gap tried. Taps 60, 80, 100, 120, 200, 250, 300 ms; touch taps the same; hardware keys 20, 60, 120, 250 ms. PIN `582915` (starts with its own last digit): saved at every gap from 80 ms up by mouse, at every touch gap including 60 ms, and at every key gap; at 60 ms mouse taps, faster than a thumb can hit separate keys, the first confirmation digit is dropped. Pass 3 for comparison: 4 or 5 dots at 120 to 300 ms |
| PIN key position probe (scratch) | ran | all 12 keys measured on the first pad, the confirmation, and the mismatch retry, at 320, 360, 375, 430, 768, 1024, 1440 px, in Shop and Academy density: **0 keys moved**. "The two PINs did not match. Enter a new PIN again." takes 2 lines everywhere, inside the 2 reserved; axe 0 on every pad; no sideways scroll; 0 page or console errors |
| Slow phone probe (scratch, CPU 6 times slower), 375 px | ran | `482915` at 250 and 120 ms, `582915` at 250 and 150 ms: saved. A double tap on the last digit of the first entry: 0 dots on the confirmation, then saved |
| Change PIN probe (scratch), 375 and 1440 px | ran | the current PIN is checked in about 34 ms, then "New owner PIN" opens with its pad 57 px lower at 375 px (37 px at 1440 px, under the screen's one line of text) and holding 350 ms, as any pad on a new screen does. Typing the new PIN straight on from the current one without looking at the new screen keeps 2 or 3 of the 6 digits (at 250, 400, 600 ms per digit), because the keys moved. Looking first, then typing, saves it (e2e, 5 widths) |
| Navigation during the search preload (scratch, Pages build, offline and online) | ran | a `page.goto` the moment the idle search preload starts gives exactly `GET .../search-index-CNPyF5Qb.js net::ERR_ABORTED`, and sometimes `fonts/barlow-500.woff2` and `barlow-700.woff2` the same way; the next page loads the chunk again (`finished`) and shows its screen |
| Customer View probe (scratch), 375 and 1440 px | ran | words on screen, exactly: `Lando's Detailing Serving Tooele, Stansbury, and Grantsville. Ask Lando about today's work. Call or text (801) 680-5090. Exit Customer View`; elements painted in `--accent` or `--accent-muted`: `0`; with the Customer View hint deleted, the only top box drawn during a reload: `div aria-hidden=true text="" h=81` |

Readings from the e2e runs: a 6 times slower CPU draws Home with the bottom row in 933 to 1054 ms in run 3 (885 to 1103 ms in run 1; limit 5000). The double tap on "Create the owner PIN" leaves 0 dots at every width. The pass 3 DEF-15 test now saves the PIN at every width (`dots-left-on-the-confirmation-pad 0`). On the Pages build, Home leads to `/aurigen-directory/`. The first visit is still not controlled by the service worker and the second is (prompt mode, by design in D1).

Nothing was left running: Playwright stopped both servers, the scratch preview servers on 4180 (root build) and 4181 (Pages build) were stopped, and ports 4173, 4174, 4180, and 4181 refuse connections. Lighthouse and axe-core ran from the scratch folder, never from the project. No git command was run.

## Pass 4: the recheck of each defect

| Defect | Severity | Owner's change since pass 3 | Recheck | Evidence |
|---|---|---|---|---|
| DEF-15 | later | ui-designer: `src/components/ui/pinStep.ts` (new: `stepHoldFor`, `noteFinish`, `finishToStepFrom`, `isEchoOfFinish`, `STEP_GUARD_MS = 150`, `STEP_GUARD_MIN_MS = 80`); `PinPad.tsx` (a pad that replaces one whose entry has just finished steps in place, with no arrival hold; hardware keys are never held); `useTapGuard.ts` (comment only); `PinPad.css` (two message lines reserved; a stepped pad's keys do not fade in again); `__tests__/PinPadStep.test.tsx` (new, 20 tests); `docs/DESIGN-DIRECTIONS.md` "PIN step in place". app-engineer: no change needed (`NewPinEntry` in `PinGate.tsx` is unchanged) | **closed** | the pass 3 `test.fail` pair (taps, hardware keys) passes as plain tests at 5 widths; new `tests/adversarial/pin-step.spec.ts` (11 tests x 5 widths); the probes above. Details below |
| DEF-13 | fix-before-deploy | none | still closed | `settings-rollback.spec.ts` (the 3 settings-rollback cases: a role from a newer version, a PIN from a newer hash, a shop role with the PIN gone) and `settings-restore.spec.ts` (restore on an unreadable phone never grants shop or a PIN; sign-offs come back `needsRecheck` when the destination has no readable PIN) pass at 5 widths in every full run; `tests/unit/def13-restore.test.ts` and `settings-recovery.test.ts` pass; axe 0 on the 6 unreadable-settings screens |
| DEF-03 | later | none | still closed | the Backup screen at four double-tap gaps saves one file each time, and "double tap Save your first backup" saves one file (5 widths, every run) |
| DEF-04 | later | none (the arrival hold is unchanged for a pad that opens from a button) | still closed | "double tap Create the owner PIN" leaves 0 dots and the 430 px Start fresh double tap keeps the PIN screen (5 widths); new: on Change PIN, a double tap on the last digit of the current PIN types nothing into the new PIN pad |
| DEF-05 | later | none | still closed | `tests/unit/pin-timing.test.ts`; `persistence.spec.ts` (2 wrong, reload, 1 wrong locks; the countdown shows after another reload), 5 widths |
| DEF-06 | later | none | still closed | `tests/unit/customer-safe.test.ts` (three copies of one id give 2 problems, nothing written) |
| DEF-07 | later | none | still closed | `a11y-flows.spec.ts` device preview buttons 64 px tall in Shop, 5 widths |
| DEF-10 | later | none | still closed | `routes.spec.ts`: no placeholder names a repo folder, 5 widths |
| DEF-11 | later | none | still closed | every privacy test with the build-word scanner passes at 5 widths; the Customer View probe reads the exact words above with 0 accent elements |
| DEF-12 | later | none | still closed | `shell.spec.ts`: a clamped preview's button names its real width, 5 widths |
| DEF-14 | later | none | still closed | Lighthouse mobile CLS 0.001 on 3 runs |
| DEF-01, DEF-02, DEF-08, DEF-09 | earlier passes | none | still closed | their pass 1 and pass 2 tests pass in every full run (privacy flash tests, encoded line breaks, unrecognised settings fields, `pages375`) |
| Content (the curator's 14 files from pass 3) | n/a | none since pass 3 | still holds | content build `77 items ... 0 customer-safe`: every item is internal; the 16 seed search cases put the expected top result first (`tests/unit/search-cases.test.ts` inside `npm run check`); the Customer View leak test over every route plus the verify card `/cards/card-ipa-wipe` and `/search?q=ipa` passes at 5 widths: no verify row, no internal element, no internal or build word |
| Hand over (D12 amendment) | n/a | none | still holds | `tests/adversarial/hand-over.spec.ts` (7 tests x 5 widths) and `tests/unit/hand-over.test.ts` (25 tests) pass in every run; axe 0 on its 3 screens |

### DEF-15 in detail: what was tried and what held

The fix's rule: a pad that mounts in the same task as the finish of the pad before it (NewPinEntry swaps its pad with `key={phase}` inside `onComplete`) steps in place. Its keys are live at once and do not fade in again; only the label fades in. The one tap it drops is a pointer tap on the key that finished the entry, or on whatever key now covers that spot, sooner than the hold: 60% of the middle gap of the entry just typed, never under 80 ms and never over 150 ms. Hardware keys, Enter, and Space are never dropped. A pad that arrives later, after a PIN check or on a new screen, is a new arrival and holds the full 350 ms as before.

- **A steady rhythm saves the PIN.** In the browser at 5 widths: taps at 120, 250, and 300 ms per digit, and hardware keys at 60 and 250 ms. In the probe: every tap gap from 60 to 300 ms and every key gap from 20 to 250 ms. The confirmation pad has no `data-tap-guard` and carries `data-step="true"`.
- **A PIN that starts with its own last digit** (`582915`) confirms at a steady 120 ms in the browser at 5 widths, and at every steady gap from 80 ms up in the probe, the same on a 6 times slower CPU at 150 and 250 ms.
- **The doubled last digit is still dropped.** A double tap on the last digit of the first entry leaves the confirmation pad at 0 dots at 5 widths (40 ms), and at 40, 80, and 120 ms in the probe, by mouse and by touch, and on a 6 times slower CPU. The PIN then saves with one `pinSet`. A double tap on the last digit of the confirmation saves one PIN in the setup flow (pass 3 test) and, new, makes one shop phone in Start fresh with no backup saved and audit `pinSet, roleChange, startFresh`.
- **The keys never move.** All 12 keys keep the same box through the first entry, the confirmation, and the "did not match" retry, at 5 widths in the browser and at 320 to 1440 px in Shop and Academy density in the probe. A steady retry after the mismatch saves the PIN, and nothing is saved before it.
- **Pads that must still hold do.** A pad opened by a button ("Create the owner PIN", Start fresh) still ignores the second tap of a double tap (DEF-04 tests). On Change PIN, the new PIN pad arrives on a new screen after the current PIN is checked: a double tap on the last current digit types nothing into it, and the new PIN then saves (second `pinSet`, a different hash).
- **A pad that stays put never holds.** After "Wrong PIN. 2 tries left." on the Developer tools drawer, the correct PIN typed at 120 ms per digit opens Developer tools.
- **Targets, motion, and access.** The confirmation and mismatch pads keep every key at least 44 px wide and 64 px tall in Shop density with no sideways scroll (5 widths). With reduced motion nothing in the pad animates or transitions for more than 10 ms, before or after the step. axe: 0 violations on the arrival, confirmation, and mismatch pads.
- **Memory only.** The hand-off between the two pads holds the finishing key, the tap point, and the time for one task, in memory; it is never stored or logged.

Observed, not a defect (the trade-off the rule makes, written into DESIGN-DIRECTIONS "PIN step in place"):

- No rule can tell a double tap from a very fast deliberate second tap on the same key. A tap on the finishing key counts as a double tap when it lands sooner than 60% of the person's own pace (capped at 150 ms). Probe: `582915` with the first entry at 400 ms per digit and the first confirmation digit 120 ms after the last digit: dropped, 5 dots, no message. At 160 or 200 ms: saved. At a steady pace it saves at every pace a thumb can reach (80 ms per digit and slower). Nothing wrong is ever saved; the person sees 5 dots and starts again. Recorded with numbers in case a phone shows otherwise; there is a line for it in the phone checklist.
- Change PIN is two screens. After the current PIN, "New owner PIN" opens with its pad lower on the screen and the usual 350 ms hold of a new arrival, so a person who types the new PIN without looking at the new screen hits the wrong keys. That is the rule as written (a pad on a new screen is a new arrival, DESIGN-DIRECTIONS); the person chooses a new PIN there, so a look is expected. Recorded with the numbers above.

### Run 2's one failure: a race in QA's test, fixed in QA's helper

- **What failed.** `tests/e2e/pages-base.spec.ts` "every asset and the service worker live under the base path; the app installs and works offline there" (`pages375`) in run 2 only, on `failed requests`: `GET http://localhost:4174/aurigen-directory/assets/search-index-CNPyF5Qb.js net::ERR_ABORTED`. The same test passed in run 1, in 20 repeats on its own, and in passes 1 to 3.
- **Why.** `src/main.tsx` loads the search index while the phone is idle after each page load. The test reloads offline and then calls `page.goto('cards')`, a full page load. When the full suite keeps the machine busy, the preload is still in flight at that moment, and the browser cancels it, as it cancels everything a page still has in flight when it is left. A scratch probe makes that moment happen on purpose and gets the same line every time, sometimes with two fonts the old page was still drawing (`barlow-500.woff2`, `barlow-700.woff2`). The next page loads the chunk again and its screen works, offline too. In the app a person moves between screens without a page load, so nothing is cancelled; after a reload, the next load fetches it again.
- **Not an app defect.** No screen, search, or offline behavior was wrong; the watcher counted a request the test itself had cancelled.
- **The fix (QA's files only).** `tests/fixtures/app.ts`: `watchProblems` now notes which page each request began on (a page counts when its load commits, so the old page's last font requests stay with the old page), and `expectNoProblems` first calls the new `settleAborted`, which sets aside only `net::ERR_ABORTED` on a request that began on an earlier page than the last one loaded. Those go to `superseded`, kept for the record. Every other failure still counts. A scratch check confirmed both sides: a request aborted on the page still showing, and a request that failed on an earlier page, are both still reported as failures.
- **The new test.** `pages-base.spec.ts` "a full reload while the search index is still loading, offline: no error, and the next screen searches" reloads offline, waits for the preload request to start, loads Search at once, and finds "Pre-polish wash bucket mix" for "bucket". It passed 8 of 8 repeats on its own and in run 3, and records what was set aside, for example `GET .../search-index-CNPyF5Qb.js net::ERR_ABORTED; GET .../fonts/barlow-500.woff2 net::ERR_ABORTED; ...` (one repeat in four records none: the preload had already finished).

## Pass 4: Lando's 15-point audit on the changed files

Files: `src/components/ui/pinStep.ts` (new, 98 lines), `PinPad.tsx` (220), `PinPad.css` (155), `useTapGuard.ts` (106), `__tests__/PinPadStep.test.tsx` (new, 212), `__tests__/PinPad.test.tsx` (221), `__tests__/tap.ts`, `docs/DESIGN-DIRECTIONS.md` (lines 37 and 38), and QA's four changed test files.

| Tier | Result | Files that fail |
|---|---|---|
| 1 Structure | pass | none. Both `tsc` programs clean, oxlint clean, every changed file ends with a newline, `node --check` passes on every built script of both builds |
| 2 Logic | pass | none. `stepHoldFor` falls back to 150 ms for an empty list, NaN, or negative gaps; `isEchoOfFinish` returns false for no finish, a keyboard click (detail 0), a NaN or negative gap, and a zero-size box; no `switch` was added; every PIN screen keeps Cancel, and a wrong confirmation leads back to the first entry with the reason in words |
| 3 Journey | pass | setup, Start fresh, Change PIN, Developer tools, and the Hand over PIN walked at 5 widths; the PIN saves and the next screen appears at once |
| 4 Runtime | pass | no storage access added; the hand-off lives in memory for one task and is cleared by a zero timer; no `console` call; no `window.self`, `window.top`, `btoa`, `atob`, `eval`, `innerHTML`; 0 page and 0 console errors in every new test |
| 5 Build rules | pass | no file over 400 lines in `src`, `scripts`, `tests` (largest app file `src/features/settings/DeviceRoleScreen.tsx` 353; largest QA files `tests/unit/def13-restore.test.ts` 333 and `tests/fixtures/app.ts` 321; `tests/adversarial/pin-step.spec.ts` 210) |

Specific checks:

- Hardcoded colors outside `tokens.css`: none (hex, rgb, rgba, hsl, oklch, color-mix).
- Em or en dashes: a scan of 337 files (`src`, `content`, `scripts`, `tests`, `docs`, `knowledge`, `public`, `index.html`, the configs, `CLAUDE.md`): none.
- `overflow: hidden` or `clip`, `max-height`, `:hover`: none in any CSS (the only hits are comments saying so).
- Secrets: none added.
- Touch targets and horizontal scroll: the stepped pads pass at 5 widths (above); every route still passes in every full run.

## Pass 4: tests added or changed by QA

| File | Change |
|---|---|
| `tests/adversarial/double-taps.spec.ts` | DEF-15 `test.fail` removed: the two steady 250 ms tests (taps, hardware keys) are plain tests and pass at 5 widths |
| `tests/fixtures/app.ts` | `watchProblems` notes which page each request began on; new `settleAborted`, called by `expectNoProblems`, sets aside only `net::ERR_ABORTED` on a request a later page load overtook (run 2's race) |
| `tests/e2e/pages-base.spec.ts` | new: a full reload while the search index is still loading, offline: no error, and the next screen searches |
| `tests/adversarial/pin-step.spec.ts` | new, 11 tests x 5 widths: steady paces 120 and 300 ms; hardware keys at 60 ms; a PIN that starts with its own last digit; the doubled last digit of the first entry; keys that never move through the confirmation and the mismatch, then a steady retry; Change PIN after a doubled last digit; a quick retry after a wrong PIN; Start fresh with a doubled last digit; the stepped pads' targets and sideways scroll; reduced motion |

## Defect register (current, after pass 4)

Severity: blocks-gate (the gate cannot pass), fix-before-deploy (fix before the first Netlify publish at the Phase 3 gate, when real jobs start living on the phone), later. Owners from `docs/OWNERSHIP.md`. Reproduction steps: DEF-01 to DEF-12 in the pass 1 record, DEF-13 and DEF-14 in the pass 2 record, DEF-15 in the pass 3 record.

| ID | Severity | Owner | File | One line | Pass 1 | Pass 2 | Pass 3 | Pass 4 |
|---|---|---|---|---|---|---|---|---|
| DEF-09 | blocks-gate | app-engineer | `src/app/deepLink.ts` | On the Pages base, Home went to `/aurigen-directory`, outside the offline copy's scope | open | closed | closed | closed (still passes) |
| DEF-01 | fix-before-deploy | app-engineer | `src/app/Shell.tsx` | The internal top bar drew while the saved Customer View flag loaded | open | closed | closed | closed (still passes) |
| DEF-02 | fix-before-deploy | app-engineer | `src/app/routes.tsx` | An encoded line break in the first path segment rendered a blank page | open | closed | closed | closed (still passes) |
| DEF-08 | fix-before-deploy | app-engineer (architect for the read rule) | `src/core/db.ts`, `src/core/settingsRead.ts` | One unrecognised settings field blocked backup, restore, and setup | open | closed (residual DEF-13) | closed | closed (still passes) |
| DEF-13 | fix-before-deploy | architect (decides), then app-engineer | `src/schemas/backup.ts`, `src/schemas/backup-recovery.ts`, `src/core/backup.ts`, `src/core/backupImport.ts`, `src/core/phoneSettings.ts` | A role or PIN field a newer version changed blocked the backup, and the words looped back to Backup | n/a | new, open | closed | closed (still passes) |
| DEF-03 | later | app-engineer | `src/features/settings/ui/BackupNow.tsx` | A second tap 40 ms or more after the first saved a second backup | open | open | closed | closed (still passes) |
| DEF-04 | later | app-engineer, ui-designer (`PinPad.tsx`, `useTapGuard.ts`) | `src/features/settings/DeviceRoleScreen.tsx`, `src/components/ui/PinPad.tsx` | A double tap landed on the PIN pad's Cancel (430 px) or typed a stray digit (375 px) | open | open | closed (residual DEF-15) | closed (still passes) |
| DEF-05 | later | app-engineer | `src/core/pin.ts`, `src/core/pinGuard.ts` | The wrong-PIN count lived in memory; a reload between tries reset it | open | open | closed | closed (still passes) |
| DEF-06 | later | app-engineer | `scripts/content/pipeline.ts` | A duplicate id crashed the content build instead of listing the problem | open | open | closed | closed (still passes) |
| DEF-07 | later | app-engineer | `src/features/settings/dev/dev.css` | Device preview buttons were 44 px tall in Shop density | open | open | closed | closed (still passes) |
| DEF-10 | later | app-engineer | `src/app/screens/RoomPlaceholder.tsx` | The Job Runner placeholder pointed to `reference/`, which the phone cannot open | open | open | closed | closed (still passes) |
| DEF-11 | later | app-engineer | `src/app/screens/CustomerScreen.tsx` | The customer screen said "arrive in Phase 4" and "this is a preview" | open | open | closed | closed (still passes) |
| DEF-12 | later | app-engineer | `src/features/settings/DevicePreviewBar.tsx`, `src/app/PreviewHost.tsx` | "Mobile 375" showed a 341 px frame on a 375 px screen under a 375 label | open | open | closed | closed (still passes) |
| DEF-14 | later | app-engineer | `src/app/Shell.tsx` | On a first launch the held top bar appeared late and pushed the screen down (CLS 0.10) | n/a | new, open | closed | closed (still passes) |
| DEF-15 | later | ui-designer (`PinPad.tsx`, `pinStep.ts`, `useTapGuard.ts`) | `src/components/ui/PinPad.tsx`, `src/components/ui/pinStep.ts` | The PIN confirmation dropped its first one or two digits when typed at a steady 120 to 300 ms per digit | n/a | n/a | new, open | **closed** |

## What only the phone can answer (tick these on your iPhone)

Do this from the GitHub Pages link (https://landocommandoz.github.io/aurigen-directory/). One thing first, because the iPhone keeps the Home Screen app's storage apart from Safari's:

- [ ] After Add to Home Screen, open the app from its icon **with signal** and wait until the top line says **Ready offline**. Only then turn on airplane mode. (The copy Safari saved does not carry over to the icon.)

The 9-item device checklist (BLUEPRINT section 9). Items 7, 8, and 9 last, with a test record only.

- [ ] 1. iOS version (Settings, General, About). The keep-the-screen-on feature needs 18.4 or newer. Write it down: ______
- [ ] 2. Developer panel, "Storage kept (persisted)" and "Answer to the keep request": write both values: ______ / ______ (No inside the installed app is the one to report)
- [ ] 3. Settings, Read aloud, Test voice, then lock the screen right away: does the voice keep going? Yes / No
- [ ] 4. Developer panel, Test share PNG, PDF, JSON: which apps appear for each? ______
- [ ] 5. Which voices the panel lists, and does the default English voice sound acceptable? ______
- [ ] 6. Turn on Low Power Mode, tap the keep-awake test in the panel: does the screen stay on for 30 seconds? Yes / No
- [ ] 7. Clear Safari history and website data (this signs you out of websites), reopen the installed app: is the test record still there? Yes / No
- [ ] 8. Create a new test record in the installed app (for Phase 1: set the owner PIN and save the first backup; the PIN and "Last backup" are the record)
- [ ] 9. Delete the icon, reinstall from the same link: is the record from item 8 still there? Yes / No

Also on the phone, because Chromium cannot stand in for Safari here:

- [ ] Airplane mode, then in the installed app tap Home, Fix It, Quick Cards, Search, and open a card. Then tap Home and pull the app closed from the app switcher, and open it again from the icon, still in airplane mode: the Home screen opens.
- [ ] When you create the owner PIN (item 8), type the PIN and then its confirmation without stopping, at your normal speed, with the thumb you use in the garage: it saves on the first try. (If your PIN starts with its own last digit and the confirmation waits with 5 dots, write down that it happened.)
- [ ] Save the first backup: the share sheet opens (not a download). Pick Save to Files. Then Settings, Backup and restore, Restore from a file, pick that file: it shows this phone's counts first, then the file's, and asks for the word before replacing.
- [ ] Hand over (only if you have a second phone to try it on; it really switches this phone to study): Settings, Device role, Hand over to another phone, your PIN, Save backup and hand over, Save to Files. This phone now says study phone. On the other phone: Settings, Device role, Import the newest backup, pick that file. That phone is the shop phone. (Also try closing the share sheet without saving: the first phone must still say shop phone.)
- [ ] Turn Customer View on from Home: the Focus reminder shows once; the screen shows only your name, the towns, one line, and your number; the bottom row holds only "Exit Customer View". Close the app from the app switcher and open it again: no "Masterclass 101" top line flashes before the customer screen.
- [ ] The text is readable at arm's length on the cart, and every button can be hit with the left thumb.

## Test inventory and how to run

From `masterclass/`:

- `npm run check` runs the unit suites (app-engineer's, architect's, and ui-designer's under `src/`, QA's under `tests/unit/`). Known-defect unit tests use `it.fails` so `check` stays green while they are open; today there are none.
- `npm run test:e2e` builds, serves `/` on 4173 and the Pages build on 4174, and runs every browser suite. Known "later" defects use `test.fail`; blocks-gate and fix-before-deploy defects fail outright. Today there are none of either, so it exits 0 with every test plain. `PW_SKIP_BUILD=1` reuses a fresh `dist/`; `PW_REUSE_SERVER=1` reuses running servers; `PW_WORKERS` sets the worker count; `PW_CHROMIUM` points at another Chromium binary if the bundled revision ever stops matching.

| File | What it covers |
|---|---|
| `playwright.config.ts` | 5 width projects plus `pages375`, two web servers, retries 0, trace off |
| `tests/fixtures/app.ts` | UI helpers: PIN taps, setup and Start fresh through the UI, IndexedDB reads, tap-target scanner, Customer View leak scanner (internal elements, internal words, build words), the problem watcher (console and page errors, failed requests, HTTP 400+; a request cancelled because the test loaded a new page is set aside) |
| `tests/fixtures/content.ts` | one valid item per content type and the ways to break each |
| `tests/fixtures/jobs.ts` | seeded logs: 24 and 25 cars, 4 and 5 founder jobs, bad and good gauge readings |
| `tests/unit/schemas.test.ts` | content schemas, readings, bands, flags, settings rules |
| `tests/unit/pin-timing.test.ts` | owner pass and lockout timing; the saved wrong-PIN count (DEF-05) |
| `tests/unit/device-role.test.ts` | role transitions, Start fresh, import, backup round trip and counters |
| `tests/unit/customer-safe.test.ts` | customerSafe filter, content build on temp folders (DEF-06) |
| `tests/unit/search-cases.test.ts` | knowledge base 24 cases on the seed content, timing |
| `tests/unit/rules.test.tsx` | every flow table, banner rules, developer tools rule, deep link guard, DEF-01 and DEF-02 at unit level |
| `tests/unit/shell-recheck.test.tsx` | pass 2: DEF-01 first frame, DEF-02 addresses, DEF-09 basename |
| `tests/unit/settings-recovery.test.ts` | DEF-08 edges, DEF-13 backup side |
| `tests/unit/def13-restore.test.ts` | pass 3: DEF-13 restore side, tampered files |
| `tests/unit/hand-over.test.ts` | pass 3: Hand over rules and order of events |
| `tests/e2e/routes.spec.ts` | every route at every width; no placeholder names a repo folder (DEF-10) |
| `tests/e2e/shell.spec.ts` | install card, setup banner and flow, developer panel, device preview (DEF-12), shop phone path |
| `tests/e2e/a11y-flows.spec.ts` | flow-screen targets, landmarks and names, focus, reduced motion (DEF-07) |
| `tests/e2e/pages-base.spec.ts` | the GitHub Pages base path, offline, link scope, Back step (DEF-09), a reload during the search preload |
| `tests/privacy/customer-view.spec.ts` | Customer View leak test, reload flashes with and without the hint (DEF-01, DEF-11) |
| `tests/persistence/persistence.spec.ts` | reloads, kills, mid-flow refreshes, offline, the wrong-PIN count (DEF-05) |
| `tests/adversarial/double-taps.spec.ts` | impatient and confused users (DEF-03, DEF-04, DEF-15) |
| `tests/adversarial/pin-step.spec.ts` | pass 4: the PIN step in place after the DEF-15 fix: paces, doubled digits, keys that never move, pads that hold and pads that never hold |
| `tests/adversarial/hostile.spec.ts` | storage, backups, URL tricks, toggles, tiny screen, slow phone (DEF-02, DEF-08) |
| `tests/adversarial/settings-rollback.spec.ts` | settings from a newer version: the backup side (DEF-08, DEF-13) |
| `tests/adversarial/settings-restore.spec.ts` | pass 3: DEF-13 restore side in the browser |
| `tests/adversarial/hand-over.spec.ts` | pass 3: Hand over in the browser |

## Pass 3 record (fix wave recheck, first round, 2026-10-11, about 04:30 to 05:30 UTC, kept as written)

Everything in this section is the pass 3 report as it was written before the DEF-15 fix. Where it says "open" or "fails", that was true at pass 3; the current status of every defect is in the register above. The pass 3 copies of the phone checklist and the test inventory were replaced by the current ones above: the only changes are the new PIN typing line on the phone list, the new `pin-step.spec.ts` row, the problem watcher in the `tests/fixtures/app.ts` row, the reload-during-preload test in the `pages-base.spec.ts` row, and the note that no known-defect test is left.

### Verdict (pass 3, fix wave recheck, 2026-10-11, about 04:30 to 05:30 UTC)

**Gate: passed. No blocks-gate or fix-before-deploy defect remains.** All ten defects that were open after pass 2 are closed and verified: DEF-13 (fix-before-deploy) and DEF-03, DEF-04, DEF-05, DEF-06, DEF-07, DEF-10, DEF-11, DEF-12, DEF-14 (later). The new "Hand over to another phone" holds in every order of events tried. Every known-defect test from passes 1 and 2 is now a plain test and passes.

One new defect, **DEF-15 (later)**, came in with the DEF-04 fix. The PIN confirmation pad now ignores taps and keys for its first 350 ms, and it appears right in the middle of the person's typing rhythm. If you type the new PIN and its confirmation at a steady 120 to 300 ms per digit, the first one or two confirmation digits are dropped. The screen then waits on "Enter the same PIN again" with 4 or 5 dots and no message. Nothing wrong is ever saved. Owner: ui-designer (`PinPad`), with app-engineer (`NewPinEntry`). Lando's standard is to fix it now, so it is listed for the next wave, not left for later.

#### Lando, in plain words

- A phone that cannot read which phone it is, or its PIN, now always saves a backup with every job in it. Restoring that file never makes a phone the shop phone and never brings a PIN. Its sign-offs come back marked "needs re-check".
- Hand over works the way you set it. Your PIN comes first, Cancel changes nothing, and the phone becomes a study phone only after the share sheet says the backup is saved. That file then makes the new phone the shop phone with the same jobs and counts.
- One tap saves one backup. Wrong PIN tries still count after a reload. The customer screen shows only your business name, the towns, "Ask Lando about today's work.", and your phone number.
- The first launch no longer jumps. Mobile performance is 91 to 93 (the target is 90+), and layout shift is 0.001.
- New, small: if you type a new PIN and then its confirmation without a pause, the confirmation can drop its first digit or two. Until it is fixed, pause for a beat when the screen says "Enter the same PIN again".

### Pass 3: commands and key output

| Command | Result | Key lines |
|---|---|---|
| `npm run check` | exit 0, 40 s | typecheck clean (both programs); `oxlint --deny-warnings` no output; `content build: 77 items (quickcard 14, equipment 22, product 21, glossaryterm 20), 0 customer-safe, 0 superseded left out, 0 sign-off files, 0 synonym groups, 77 search documents`; `Test Files 51 passed (51)`, `Tests 961 passed (961)`. No unit test is marked `it.fails` any more |
| `npx vitest run tests/unit` (QA suites only) | exit 0, run 3 times | `Test Files 10 passed (10)`, `Tests 475 passed (475)` each time. The four new and changed files ran 6 more times on their own: `Tests 62 passed (62)` each time |
| Before QA's changes: `npm run check` | exit 1 | exactly what app-engineer reported: 4 `it.fails` that now pass (DEF-05, DEF-06, DEF-13 twice) and 2 QA assertions that still expected the old DEF-13 refusal |
| `npm run build` | exit 0 | `✓ 348 modules transformed`; `index 198.11 kB (gzip 61.92 kB)`; `vendor 469.55 kB (gzip 146.03 kB)`; `precache 19 entries (937.05 KiB)` |
| `VITE_BASE=/aurigen-directory/ npm run build` | exit 0 | `✓ 348 modules transformed`; `precache 19 entries (937.52 KiB)`; `dist/index.html` links `/aurigen-directory/manifest.webmanifest`; manifest `"start_url":"."`, `"scope":"."` |
| `node --check` on `dist/sw.js` and every `dist/assets/*.js` | pass | no output |
| `npm run test:e2e` (full: builds `/` and `/aurigen-directory/`, serves 4173 and 4174) | **exit 0**, 11.2 min | `856 passed (11.2m)`; JSON stats `expected 856, unexpected 0, flaky 0, skipped 0`. The 856 include 10 known-defect results marked `test.fail` that failed as expected: DEF-15, 2 tests x 5 widths |
| `settings-rollback.spec.ts` at 5 widths, after tightening when it reads the screen | exit 0 | `25 passed (43.1s)` |
| Lighthouse 13.5.0, mobile, 3 runs | ran | performance 0.91, 0.93, 0.92; accessibility 1.00; best practices 1.00; SEO 0.54 (noindex on purpose); FCP 2.3 s; LCP 3.1, 2.8, 3.0 s; TBT 50, 20, 30 ms; **CLS 0.001** every run. The two shifts left are 0.0008 (`nav.app-bottom`) and 0.0006 (`header.app-top > div.app-top__actions`); the 0.098 culprit from pass 2 (`div.app-scroll`) is gone |
| Lighthouse 13.5.0, `--preset=desktop` | ran | performance 1.00, accessibility 1.00, best practices 1.00, SEO 0.54 (`is-crawlable`, `robots-txt` only); FCP 0.5 s, LCP 0.7 s, TBT 0 ms, CLS 0 |
| axe-core 4 (WCAG 2.0 to 2.2 A and AA, best practice), scratch probe | ran | 16 routes (including the verify card `/cards/card-ipa-wipe`, `/search?q=bucket`, `/%0a`) plus 11 new or changed screens (Hand over PIN, ready, result; Home and Backup with an unreadable role; the held "Saved" button; the restore confirm on an unreadable phone; the restore result; the import refusal; Customer View with and without the Focus reminder), at 375 and 1440 px: `total axe violations: 0` |
| PIN cadence probe (scratch), 375 px | ran | new PIN then confirmation at a steady gap. Taps: `120 ms: 4 dots, still on Enter the same PIN again`; `200 ms: 5`; `300 ms: 5`; `400 ms: saved`; `500 ms: saved`. Hardware keys: the same five results (DEF-15) |
| Customer View probe (scratch), 375 and 1440 px | ran | words on screen, exactly: `Lando's Detailing Serving Tooele, Stansbury, and Grantsville. Ask Lando about today's work. Call or text (801) 680-5090. Exit Customer View`; elements painted in `--accent` or `--accent-muted`: `0`; with the Customer View hint deleted, the only top box drawn during a reload: `div aria-hidden=true text="" h=81` |

Readings from the e2e run: a 6 times slower CPU draws Home with the bottom row in 1030 to 1223 ms (limit 5000). The double tap on "Create the owner PIN" leaves 0 dots at every width (pass 2: 1 at 375 px). "Mobile 375" on a 375 px window is a 341 px frame and its button now says so. On the Pages build, Home leads to `/aurigen-directory/`. The first visit is still not controlled by the service worker and the second is (prompt mode, by design in D1).

Nothing was left running: Playwright stopped both servers, the scratch preview server was stopped, and ports 4173 and 4174 refuse connections. Lighthouse and axe-core ran from the scratch folder, never from the project. No git command was run.

### Pass 3: the recheck of each defect

The owners' fix reports named the files. Each fix was read, each known-defect test was turned into a plain test, and new tests were then aimed at the edges of each fix.

| Defect | Severity | Owner's change (files) | Recheck | Evidence |
|---|---|---|---|---|
| DEF-13 | fix-before-deploy | architect: `src/schemas/backup.ts` (`settingsUnreadable`, `parseAnyBackupFile`), `src/schemas/backup-recovery.ts` (`backupSettingsState`, `restorePlan`, `settingsAfterRestore`, `signOffsAfterRestore`), `frozen-shapes.test.ts`. app-engineer: `src/core/phoneSettings.ts` (new), `backup.ts`, `backupFile.ts`, `backupImport.ts`, `restorePreview.ts` (new), `importRules.ts`, `errors.ts`; `BackupScreen.tsx`, `DeviceRoleScreen.tsx`, `restoreFlow.ts`, `ui/RestoreConfirm.tsx`, `ui/BackupNow.tsx`, `ui/BackupSummary.tsx` | **closed** | Unit: the 2 pass 2 `it.fails` pass as plain tests; `tests/unit/def13-restore.test.ts` (new, 13 tests). E2E: `settings-rollback.spec.ts` DEF-13 for a role from a newer version, a PIN from a newer hash, and a shop role with the PIN gone (3 tests x 5 widths); `settings-restore.spec.ts` (new, 6 tests x 5 widths). Details below |
| DEF-03 | later | `src/features/settings/ui/BackupNow.tsx`: a synchronous in-flight guard, then the button holds as "Saved" until OK and 2 s (`BACKUP_HOLD_MS`) | **closed** | the pass 1 `test.fail` passes as a plain test at 5 widths; new: on the Backup screen, double taps at 40, 120, 400, and 1000 ms each save exactly 1 file, and after OK the next deliberate tap saves the next (5 `export` entries for setup plus 4 rounds) |
| DEF-04 | later | ui-designer: `src/components/ui/useTapGuard.ts` (new, `TAP_GUARD_MS = 350`), used by `PinPad`, `Drawer`, `Toast`; app-engineer: `ui/TapGuarded.tsx` around the Start fresh choice row and the Hand over button | **closed** (residual filed as DEF-15) | the 430 px `test.fail` passes as a plain test; the 375 px stray digit is now asserted: 0 dots at all 5 widths; new: a double tap on the last digit of the Hand over PIN never presses "Save backup and hand over" (0 shares) |
| DEF-05 | later | `src/core/pinGuard.ts` (new): the count and lock time in localStorage, tied to the PIN's salt; `pin.ts`, `usePinLock.ts`, `PinGate.tsx` (the lock shows as soon as the pad opens) | **closed** | the pass 1 `it.fails` passes as a plain test; 6 new unit edges: one wrong PIN per reload still locks on the third; a correct PIN resets the count; a new PIN starts again at zero; 10 damaged or tampered saved values read as zero, never crash, and a lock already running still holds from its audit entry when the saved value is wiped; with localStorage blocked the count holds for the session; the saved value never holds a PIN. New e2e (5 widths): 2 wrong, reload, 1 wrong locks, and after another reload the countdown shows before any digit is typed |
| DEF-06 | later | `scripts/content/pipeline.ts`: the duplicate is reported with both files and the second is left out | **closed** | the pass 1 `it.fails` passes as a plain test; new: three copies of one id give 2 problems, each naming the file that is kept, no stack trace, nothing written |
| DEF-07 | later | `src/features/settings/dev/dev.css`: `min-height: var(--target-min)` | **closed** | the pass 1 `test.fail` passes as a plain test at 5 widths |
| DEF-10 | later | `src/app/screens/RoomPlaceholder.tsx`: "keep using the Model Y job sheet you already have"; `shell.test.tsx` updated | **closed** | new e2e (5 widths): `/job`, `/business`, `/academy` name no folder in the repo (`reference/`, `docs/`, `content/`, `src/`) |
| DEF-11 | later | `src/app/screens/CustomerScreen.tsx`: the brand name, the service area, "Ask Lando about today's work.", the phone number; no accent | **closed** | the Customer View leak scanner (`tests/fixtures/app.ts`) now also fails on build words (`Phase`, `phase`, `preview`, `placeholder`, `reference/`, `Masterclass`); every privacy test passes at 5 widths with it. Probe: the exact words above, 0 elements in an accent color |
| DEF-12 | later | `src/features/settings/DevicePreviewBar.tsx` `previewLabel`, `PreviewHost.tsx` | **closed** | the e2e preview test now asserts that a clamped frame's button names its real width: "Mobile 375, shown at 341 here" and "Tablet 768, shown at 341 here" at 375 px, "Tablet 768, shown at 396 here" at 430 px, "Tablet 768, shown at 734 here" at 768 px |
| DEF-14 | later | `src/app/Shell.tsx`: while the bar is held with the hint "unknown", an empty `aria-hidden` box of the bar's height holds its place | **closed** | Lighthouse mobile CLS 0.001 on 3 runs (pass 2: 0.099 to 0.106), performance 0.91 to 0.93 (target 90+). Probe: the held box has no text, is `aria-hidden`, 81 px tall; the privacy test with the hint missing on every load passes at 5 widths |

#### DEF-13 in detail: what was tried and what held

The architect's rule is that a file whose role and PIN could not be read is data without a role. These checks went after that rule from every side.

- **The backup is never refused.** A role this version does not know (`"crewTablet"`), a PIN record from a newer hash (`"Argon2id"`), and a shop role with the PIN gone each save a file. Each file has every job, no `deviceRole`, an empty settings table, and a `settingsUnreadable` section with the matching reason (`deviceRoleUnreadable`, `ownerPinUnreadable`, `shopRoleWithoutPin`). The settings row stays exactly as the newer version left it. Customer View cannot be switched on, the PIN check refuses, and the owner pass stays closed. The Backup screen says "This phone's role and owner PIN could not be read, so the shop tools stay locked. Your jobs are still here: tap Save backup below". It never says "open Settings, Backup" and never shows schema text (5 widths each).
- **Restore never grants shop or a PIN.** We restored the unreadable file onto four kinds of phone:
  - a shop phone with its own PIN: its own owner PIN is asked first (the file's PIN is "Wrong PIN"). It stays the shop phone with its own PIN and its own cars seed (7, not the file's 40). The counts follow the file's jobs (30 jobs, 25 + 7 cars). No roleChange entry is written, and the import entry says "this phone kept its own settings".
  - a study phone with no PIN: the typed word only. It stays a study phone with no PIN.
  - a study phone with its own PIN: that phone's PIN is asked. The file's PIN never lands.
  - a phone whose own role or PIN cannot be read: no PIN is asked. Restore is refused (`backupNotOffered`) until a backup of this phone has been offered, and that offered backup saves from the confirm itself (the unreadable kind, 30 jobs). After the restore the phone is a study phone with no PIN, with the role not yet chosen, so the banner says "Is this the shop phone?" again. The audit says "Unreadable phone to study phone (restore)". Neither PIN opens anything, and Customer View stays off.
- **Sign-offs come back flagged.** In every case above, both restored sign-offs read `needsRecheck: true`. A readable study backup with no PIN that holds a sign-off also flags it. A flagged sign-off stays flagged through a later backup and restore that does bring its PIN.
- **The shop path refuses the file.** "This is the shop phone" and then Import says "This backup's role and owner PIN could not be read, so it cannot make this phone the shop phone. Use Start fresh with your PIN, then restore this backup to bring every job back." The Yes button is off, Cancel changes nothing, and `parseBackupFile` refuses the file.
- **The plan is checked again inside the write.** A row that turns unreadable between the preview and Apply is caught: the restore refuses with `backupNotOffered`, and nothing changes.
- **Tampered files are refused, nothing written.** We tried seven kinds:
  - a `deviceRole` added back at the top;
  - a shop settings row with a PIN slipped into the tables, with the checksum re-signed;
  - an empty reason list;
  - an unknown reason;
  - a raw row of 16,385 characters;
  - an extra key in the section;
  - the section written as a string.

  A raw row edited to claim the shop role and a known PIN is never read: that restore leaves a study phone with no PIN.
- **The documented cases behave as written.** A readable shop backup restored onto a phone whose settings are unreadable makes it the shop phone with the file's PIN, after the typed word and with no owner pass, as BLUEPRINT 3.8 says. A readable file from before the fix still parses on the shop path and imports.
- **A refresh before Apply writes nothing.** On the broken phone's restore confirm, the word was typed and the page refreshed. The phone still holds its own 32 jobs and its unreadable role, and the confirm had said "This backup holds fewer jobs (30) than this phone has now (32)".

#### Hand over to another phone (D12 amendment, `[HOUSE default]`)

Chromium on Linux has no share sheet, so an init script stands one in. It can resolve, close, stay open, or fail on storage. Its resolve waits 300 ms, as a real sheet stays up while the person picks a target.

| Check from the brief | Result | Evidence |
|---|---|---|
| PIN required | pass | the Hand over button opens "Enter the owner PIN to hand over this phone"; with no owner pass at the tap the share sheet never opens and nothing is written (unit); if the phone locks on the ready screen (visibility hidden), the next tap goes back to the PIN pad with 0 shares (e2e, 5 widths) |
| Cancel changes nothing | pass | Cancel on the PIN pad returns to Device role with the settings row and the whole audit log unchanged and 0 shares; after a closed share sheet, Cancel returns to Device role with the settings row unchanged, no `export` and no hand-over `roleChange` entry (e2e, 5 widths) |
| Role switches to study only after the backup resolves | pass | with the share sheet held open, the role reads shop and no roleChange exists until it resolves (unit); while it is open the panel offers no Cancel, and a reload then reopens the app as the shop phone with no roleChange (e2e, 5 widths); a closed sheet says "Nothing changed. This phone stays the shop phone until the backup is saved through the share sheet." with Try again and Cancel; a download never switches the phone (unit); with storage full right after the share the screen says "The backup was saved, but this phone could not switch itself to a study phone." with Try again and Cancel, no page error, and a reload shows the shop phone with nothing half written (e2e, 5 widths) |
| The old phone cannot create jobs afterwards | pass | `/job` says "Jobs run on the shop phone only. This phone is a study phone."; `/business` says the Business room opens on the shop phone only; the Customer mode is refused; Device role shows "This is a study phone." with no Hand over; `ROLE_CAN.study` has `createJobs`, `businessRoom`, `signOff`, `customerView` all false (unit and e2e). The PIN and every job stay on the old phone |
| Audit entry | pass | exactly one `roleChange` "Shop phone to study phone (hand over)" and one `export` after a resolved share; none after a canceled share, a failed share, a download, a storage failure, or a lapsed pass at the tap (unit and e2e) |
| The next phone | pass | the file the share sheet carried imports on a fresh phone through "Import the newest backup" and makes it the shop phone with the same 35 jobs, the same cars count, 4 founder's slots, and the same PIN (unit and e2e) |
| Edges | pass | an owner pass that runs out while the sheet is open does not stop the switch; another tab switching the phone to study mid-share leaves one roleChange; two calls at once switch once; a phone whose own role cannot be read cannot hand over (nothing shared); a device with no file share sheet shows no Hand over button and names the two separate steps; `canHandOver` over all 16 combinations of role, pass, and share outcome allows exactly one |
| Layout | pass | the PIN, ready, and result screens: no target under 44 x 44, none under 64 px tall in Shop density, no horizontal scroll (5 widths); axe 0 violations (375 and 1440 px) |

Observed, not a defect: with a stand-in share that resolves at once, the second tap of a double tap on "Save backup and hand over" lands on "Back to device role" on the result screen and skips the next-step words. A real share sheet covers the screen for longer than any double tap, so a phone cannot reach this; the test stand-in now waits 300 ms like a sheet. It is recorded in case a later change makes the result appear without the sheet.

#### The content changes and Customer View

The curator changed 14 seed files: 4 Quick Cards, 1 glossary term, 6 products, and 3 equipment files. The content build lists 77 items: 61 house, 7 verify, 9 sourced, **all 77 internal, 0 customer-safe**. The 16 seed search cases still put the expected top result first (`tests/unit/search-cases.test.ts` passes inside `npm run check`). The Customer View leak test covers every route plus the verify card `/cards/card-ipa-wipe`, `/search?q=ipa`, and the developer panel by URL. It passes at 5 widths with the stricter word list: no verify row, no `[VERIFY`, no "nverified", no internal element, no internal word in the accessibility tree.

#### New in pass 3: DEF-15 (later): the PIN confirmation drops digits typed at a steady pace

- **Where.** `src/components/ui/PinPad.tsx` (ui-designer) arms `useTapGuard` on every mount, and its document key listener drops digit keys while the guard holds. `src/features/settings/ui/PinGate.tsx` `NewPinEntry` (app-engineer) renders `<PinPad key={phase}>`, so the confirmation is a new pad and the 350 ms guard starts again right after the sixth digit of the first entry.
- **Reproduce** (Playwright at any width, or by hand on a phone):
  1. Open `/settings/setup` and tap Create the owner PIN.
  2. Wait half a second.
  3. Type `482915482915` at a steady 250 ms per digit, as taps on the keys or as hardware digit keys.

  Result: the screen stays on "Enter the same PIN again" with 5 of 6 dots filled and no message, and no PIN is saved. The probe: 4 dots at 120 ms per digit, 5 at 200 and 300 ms, saved at 400 and 500 ms. Taps and hardware keys give the same result.
- **Expected.** A steady rhythm creates the PIN; only the second tap of a double tap (about 40 ms) is dropped. The designer's fix report also says "Keyboard users are never slowed down", but the PIN pad drops hardware digit keys during its guard.
- **Impact.** Nothing wrong is ever saved. A short confirmation never completes, and a padded one reports "The two PINs did not match" and starts again. It is confusing on the first-run setup and Start fresh, and worse with gloves. Before the fix wave the confirmation pad had no guard, so this is new.
- **Suggested fix** (ui-designer decides, with app-engineer for `NewPinEntry`): do not re-arm the full guard when the pad steps in place to the confirmation. The keys do not move there, so only a doubled last digit can land on them, and a window of about 150 ms still drops a 40 ms double tap. Never drop hardware digit keys.
- **Test.** `tests/adversarial/double-taps.spec.ts` "DEF-15: a new PIN and its confirmation typed at a steady 250 ms pace (taps / hardware keys) save the PIN" (2 tests, `test.fail`, 5 widths).

### Pass 3: Lando's 15-point audit on the changed files

**Files:**

- `scripts/content/` (2)
- `src/app/`: `BottomRow`, `PreviewHost`, `Shell`, `BannerStack`, `CustomerScreen`, `RoomPlaceholder`, `shell.css`
- `src/components/ui/`: `useTapGuard`, `PinPad`, `Drawer`, `Toast` and their CSS, `index.ts`
- `src/core/`: `backup`, `backupFile`, `backupImport`, `db`, `deviceRole`, `errors`, `importRules`, `phoneSettings`, `pin`, `pinGuard`, `restorePreview`, `settingsRead`, `usePinLock`
- `src/features/settings/`: `BackupScreen`, `DevicePreviewBar`, `DeviceRoleScreen`, `RoleOverview`, `StateReadouts`, `dev.css`, `hooks`, `index`, `restoreFlow`, `roleFlow`, and `ui/`: `BackupNow`, `BackupSummary`, `HandOverPanel`, `PinGate`, `RestoreConfirm`, `TapGuarded`, `format`, `screen.css`
- `src/schemas/`: `backup`, `backup-recovery`, `content-shop`, `index`, `runtime-device`
- the 14 content files
- QA's files changed in this pass

| Tier | Result | Files that fail |
|---|---|---|
| 1 Structure | pass | none. Both `tsc` programs clean, oxlint clean, every changed file ends with a newline, `node --check` passes on every built script |
| 2 Logic | pass with one defect | `src/components/ui/PinPad.tsx` with `PinGate.tsx` `NewPinEntry` (DEF-15: a normal typing pace leaves the confirmation waiting). Every `switch` in the changed files has a `default` (6 checked; the seventh hit is a comment). Every new screen has a way out: Hand over PIN (Cancel, Back to Settings), ready (Cancel, Try again), working (Back to Settings), result (Back to device role, Back to Settings); restore confirm (Cancel at every step) |
| 3 Journey | pass | first load to every exit walked at 5 widths; Hand over and every restore path change the role and the screens at once |
| 4 Runtime | pass | no TypeErrors on any route (0 page errors, 0 console errors on 14 routes x 5 widths); the new localStorage access (`pinGuard.ts`) is wrapped in try/catch with a zero fallback and a session fallback in memory; the only new `console.error` (`backup.ts`) logs a storage error object, never a PIN, hash, or setting; the saved wrong-PIN count holds the PIN's salt and never a PIN; no `window.self`, `window.top`, `btoa`, `atob`, `eval`, `innerHTML` |
| 5 Build rules | pass | no file over 400 lines in `src`, `scripts`, `tests` (largest app file `src/features/settings/DeviceRoleScreen.tsx` 353; largest QA file `tests/unit/def13-restore.test.ts` 333); the developer panel shows the wrong-PIN count kept across reloads and the settings row state ("Cannot be read as is: ...") |

Specific checks:

- Hardcoded colors outside `tokens.css`: none (hex, rgb, rgba, hsl, oklch, color-mix).
- Em or en dashes in `src`, `content`, `scripts`, `tests`, `docs`, `knowledge`, `public`, `index.html`, and the configs: none.
- `overflow: hidden` or `clip`, `max-height`, `:hover`: none in any CSS (the only hits are comments saying so).
- Secrets: none added.
- Touch targets and horizontal scroll: every route at 5 widths and every new screen pass (above).

### Pass 3: tests added or changed by QA

| File | Change |
|---|---|
| `tests/unit/pin-timing.test.ts` | DEF-05 `it.fails` turned into a plain test; 6 new edge tests |
| `tests/unit/customer-safe.test.ts` | DEF-06 `it.fails` turned into a plain test; three copies of one id |
| `tests/unit/settings-recovery.test.ts` | DEF-13 `it.fails` (2) turned into plain tests that also check the file's shape and reason; the "today: refused" test replaced by "after the fix: still opens no gate"; the DEF-08 shop-row-with-no-PIN test now expects an unreadable backup instead of a refusal |
| `tests/unit/def13-restore.test.ts` | new: the DEF-13 restore plan through core, on 5 kinds of phone, the shop path, readable files, the re-check inside the write, 7 tampered files (13 tests) |
| `tests/unit/hand-over.test.ts` | new: `canHandOver` over all 16 combinations, `settingsOnHandOver`, the order of events, afterwards (25 tests) |
| `tests/adversarial/hand-over.spec.ts` | new: Hand over in the browser (7 tests x 5 widths) |
| `tests/adversarial/settings-restore.spec.ts` | new: DEF-13 restore in the browser (6 tests x 5 widths) |
| `tests/adversarial/settings-rollback.spec.ts` | DEF-13: a third case (shop role with the PIN gone), the file's shape, no gate opened, and the words read on the Backup screen once it is ready |
| `tests/adversarial/double-taps.spec.ts` | DEF-03 and DEF-04 `test.fail` removed; 0 stray dots asserted; Backup screen at four gaps; DEF-15 (2 tests, `test.fail`) |
| `tests/e2e/a11y-flows.spec.ts` | DEF-07 `test.fail` removed |
| `tests/e2e/shell.spec.ts` | DEF-12: a clamped preview's button names its real width |
| `tests/e2e/routes.spec.ts` | DEF-10: no placeholder names a folder in the repo |
| `tests/persistence/persistence.spec.ts` | DEF-05 in the browser: the count and the countdown survive reloads |
| `tests/fixtures/app.ts` | the Customer View leak scanner also fails on build words (DEF-11) |

### Defect register (after pass 3)

Severity: blocks-gate (the gate cannot pass), fix-before-deploy (fix before the first Netlify publish at the Phase 3 gate, when real jobs start living on the phone), later. Owners from `docs/OWNERSHIP.md`. Reproduction steps: DEF-01 to DEF-12 in the pass 1 record, DEF-13 and DEF-14 in the pass 2 record, DEF-15 above.

| ID | Severity | Owner | File | One line | Pass 1 | Pass 2 | Pass 3 |
|---|---|---|---|---|---|---|---|
| DEF-09 | blocks-gate | app-engineer | `src/app/deepLink.ts` | On the Pages base, Home went to `/aurigen-directory`, outside the offline copy's scope | open | closed | closed (still passes) |
| DEF-01 | fix-before-deploy | app-engineer | `src/app/Shell.tsx` | The internal top bar drew while the saved Customer View flag loaded | open | closed | closed (still passes) |
| DEF-02 | fix-before-deploy | app-engineer | `src/app/routes.tsx` | An encoded line break in the first path segment rendered a blank page | open | closed | closed (still passes) |
| DEF-08 | fix-before-deploy | app-engineer (architect for the read rule) | `src/core/db.ts`, `src/core/settingsRead.ts` | One unrecognised settings field blocked backup, restore, and setup | open | closed (residual DEF-13) | closed (still passes) |
| DEF-13 | fix-before-deploy | architect (decides), then app-engineer | `src/schemas/backup.ts`, `src/schemas/backup-recovery.ts`, `src/core/backup.ts`, `src/core/backupImport.ts`, `src/core/phoneSettings.ts` | A role or PIN field a newer version changed blocked the backup, and the words looped back to Backup | n/a | new, open | **closed** |
| DEF-03 | later | app-engineer | `src/features/settings/ui/BackupNow.tsx` | A second tap 40 ms or more after the first saved a second backup | open | open | **closed** |
| DEF-04 | later | app-engineer, ui-designer (`PinPad.tsx`, `useTapGuard.ts`) | `src/features/settings/DeviceRoleScreen.tsx`, `src/components/ui/PinPad.tsx` | A double tap landed on the PIN pad's Cancel (430 px) or typed a stray digit (375 px) | open | open | **closed** (residual DEF-15) |
| DEF-05 | later | app-engineer | `src/core/pin.ts`, `src/core/pinGuard.ts` | The wrong-PIN count lived in memory; a reload between tries reset it | open | open | **closed** |
| DEF-06 | later | app-engineer | `scripts/content/pipeline.ts` | A duplicate id crashed the content build instead of listing the problem | open | open | **closed** |
| DEF-07 | later | app-engineer | `src/features/settings/dev/dev.css` | Device preview buttons were 44 px tall in Shop density | open | open | **closed** |
| DEF-10 | later | app-engineer | `src/app/screens/RoomPlaceholder.tsx` | The Job Runner placeholder pointed to `reference/`, which the phone cannot open | open | open | **closed** |
| DEF-11 | later | app-engineer | `src/app/screens/CustomerScreen.tsx` | The customer screen said "arrive in Phase 4" and "this is a preview" | open | open | **closed** |
| DEF-12 | later | app-engineer | `src/features/settings/DevicePreviewBar.tsx`, `src/app/PreviewHost.tsx` | "Mobile 375" showed a 341 px frame on a 375 px screen under a 375 label | open | open | **closed** |
| DEF-14 | later | app-engineer | `src/app/Shell.tsx` | On a first launch the held top bar appeared late and pushed the screen down (CLS 0.10) | n/a | new, open | **closed** |
| DEF-15 | later | ui-designer (`PinPad.tsx`, `useTapGuard.ts`), with app-engineer (`PinGate.tsx` `NewPinEntry`) | `src/components/ui/PinPad.tsx`, `src/features/settings/ui/PinGate.tsx` | The PIN confirmation drops its first one or two digits when typed at a steady 120 to 300 ms per digit | n/a | n/a | **new, open** |

## Pass 2 record (recheck, 2026-10-11, about 01:55 to 02:35 UTC, kept as written)

Everything in this section is the pass 2 report as it was written before the fix wave. Where it says "open" or "fails", that was true at pass 2; the current status of every defect is in the register above. The pass 2 copies of the phone checklist and the test inventory were replaced by the current ones above: the only changes are the Hand over item, the restore line (counts first, then the word), the customer screen line, and the new test files.

### Verdict (pass 2, recheck, 2026-10-11, about 01:55 to 02:35 UTC)

**Gate: passed for everything the VM can check. No blocks-gate defect remains.** DEF-09, the one blocker from pass 1, is fixed and verified: on the GitHub Pages build every link on every screen stays inside the offline copy, and a reload with no signal after tapping Home opens the app. The three fix-before-deploy defects from pass 1 (DEF-01, DEF-02, DEF-08) are fixed and verified.

What remains:

- **New, fix-before-deploy: DEF-13.** The DEF-08 fix still blocks the backup when the role or PIN field is the part a newer version changed. The words on screen then send the person in a circle. Fix before real jobs live on the phone (Phase 3).
- **New, later: DEF-14.** The DEF-01 fix holds the top bar on a first launch, so the screen jumps down once when it appears. Mobile performance is 89 to 90 against the 90+ target (92 in pass 1).
- **Still open from pass 1, all later:** DEF-03, DEF-04, DEF-05, DEF-06, DEF-07, DEF-10, DEF-11, DEF-12. The owners did not change them this round, and nothing in this pass made any of them worse.

The rest of the gate (install from the Pages link over HTTPS, airplane mode, the 9-item device checklist) is Lando's, on the phone. The list is below.

#### Lando, in plain words

- The Pages link problem is fixed. Home, every other button, and Back all stay inside the copy the phone keeps for no signal. You can run the airplane mode test now.
- Customer View no longer flashes "Masterclass 101" on a reload, even if the phone has lost its quick note of the Customer View setting.
- A garbled link now shows "No screen here" with buttons back to Home and Fix It, never a blank page.
- A settings record from a newer version, or one damaged field in it, no longer blocks backup or restore. One gap is left: if a future version changes the phone's role or the PIN format and you then roll back, the app still cannot make a backup, and its message points you to the Backup screen that just failed. It has to be fixed before real jobs are on the phone.
- The first time the app opens, the screen jumps down once when the top bar appears. Small, later.
- Eight small items from the first pass are still open. All are "later".

### Pass 2: commands and key output

| Command | Result | Key lines |
|---|---|---|
| `npm run check` | exit 0, 34 s | typecheck clean (both programs; `tests/` is in `tsconfig.node.json`); `oxlint --deny-warnings` no output; `content build: 77 items (quickcard 14, equipment 22, product 21, glossaryterm 20), 0 customer-safe, 0 superseded left out, 0 sign-off files, 0 synonym groups, 77 search documents`; `Test Files 44 passed (44)`, `Tests 812 passed \| 4 expected fail (816)` |
| `npx vitest run tests/unit` (QA suites only) | exit 0 | `Test Files 8 passed (8)`, `Tests 426 passed \| 4 expected fail (430)`. The 4 expected failures: DEF-05, DEF-06, and DEF-13 twice |
| `npm run build` | exit 0 | `✓ 339 modules transformed`; `vendor 469.55 kB (gzip 146.03 kB)`; `index 177.37 kB (gzip 56.02 kB)`; `precache 19 entries (898.87 KiB)` |
| `npm run test:e2e` (builds `/` and `/aurigen-directory/`, serves 4173 and 4174) | exit 1, 8.1 min | `Running 761 tests using 3 workers`; `10 failed`; `751 passed`; JSON stats `expected 751, unexpected 10, flaky 0, skipped 0`. The 10 failures are exactly DEF-13 (2 tests x 5 widths). The 751 include 11 known-defect tests marked `test.fail` that failed as expected: DEF-03 at 5 widths, DEF-04 at 430 px, DEF-07 at 5 widths |
| Lighthouse 13.5.0, mobile, 3 runs | ran | performance 0.89, 0.90, 0.90; accessibility 1.00; best practices 1.00; SEO 0.54 (noindex on purpose); FCP 2.3 s, LCP 2.9 s, TBT 10 to 30 ms, CLS 0.106, 0.099, 0.099 |
| Lighthouse 13.5.0, `--preset=desktop` | ran | performance 0.99, accessibility 1.00, best practices 1.00, SEO 0.54; FCP 0.5 s, LCP 0.6 s, TBT 0 ms, CLS 0.055 |
| Installability, DevTools Protocol `Page.getInstallabilityErrors` | ran | `http://localhost:4173/: errors []; start_url .; scope .; display standalone` and the same for `http://localhost:4174/aurigen-directory/` |
| axe-core 4 (WCAG 2.0 to 2.2 A and AA, best practice) | ran | 16 routes (the 14 from pass 1 plus `/%0a` and `/abc%0d%0a`) x 375 and 1440 px: 0 violations. The new "Settings could not be read" notice on Home and the Backup screen: 0 violations once the entry fade has finished (150 ms wait, normal and reduced motion; an axe run mid-fade reports contrast on the fading text, which is the animation, not the colors) |
| DEF-03 probe (scratch script, double tap "Save backup" at set gaps) | ran | `gap 0 ms: downloads 1`; `gap 10 ms: downloads 1`; `gap 40 ms: downloads 2`; same 2 at 80, 120, 200, 400, 700, 1000 ms |

Readings from the e2e run: Home on the Pages build now leads to `/aurigen-directory/` (pass 1: `/aurigen-directory`). A 6 times slower CPU draws Home with the bottom row in 1109 to 1306 ms (limit 5000). The first visit is still not controlled by the service worker and the second is (prompt mode, by design in D1).

Nothing was left running: both preview servers were stopped and ports 4173 and 4174 are free. Lighthouse and axe-core were run from the scratch folder (`npm i --prefix <scratchpad>/lh lighthouse axe-core`), never installed into the project.

### Pass 2: what the owners changed, and the recheck of each defect

The owners did not send a list, so the recheck started from the files changed after pass 1 ended (01:12 UTC) and mapped each one to a defect. Every pass 1 test for a fixed defect now passes; tests that were marked `it.fails` were turned into plain tests. New tests were then written against the edges of each fix.

| Defect | Severity | Owner's change (files) | Recheck | Evidence |
|---|---|---|---|---|
| DEF-09 | blocks-gate | `src/app/deepLink.ts`: `basenameFor` keeps the trailing slash; `keepBaseSlash` and `watchBaseSlash` put the slash back at boot and on every back or forward step | **closed** | `tests/e2e/pages-base.spec.ts`, 6 of 6 pass: the pass 1 test (Home, then offline reload, opens the app); the pass 1 scope scan; new: every link on 12 screens stays under `/aurigen-directory/`; new: a same-page Back step onto `/aurigen-directory` gets its slash back and an offline reload there opens the app. Unit: `basenameFor` for 7 spellings of the base, `slashedBaseFor` edge cases |
| DEF-01 | fix-before-deploy | `src/core/customerViewHint.ts` (new): a copy of the flag in localStorage, written "on" before the row and "off" after it; `src/core/customerView.tsx` reads it once at mount; `src/app/Shell.tsx` `showTopBar` holds the top bar unless the hint is "off" | **closed** | `tests/privacy/customer-view.spec.ts` pass 1 test passes at 5 widths; new: the same MutationObserver test with the hint deleted before every load, 6 routes, 5 widths: no internal element in any frame. Unit (`tests/unit/shell-recheck.test.tsx`): hint present, 6 routes, first frame clean; hint missing, first frame clean and the hint is filled in after; the hint write fails while switching on, so the hint reads "unknown", never "off"; a refused switch-on leaves no "on" hint; `showTopBar` over 8 input rows |
| DEF-02 | fix-before-deploy | `src/app/routes.tsx` `renderLocationFor`: when nothing matches, render the table for `NO_SCREEN_PATH` with the real path in the location state; `src/app/unmatched.ts` (new); `src/app/screens/NotFound.tsx` shows control characters as %XX; `deepLink.ts` refuses control characters after one decode | **closed** | `tests/adversarial/hostile.spec.ts` pass 1 test passes at 5 widths; the pass 1 unit test now passes as a plain test. New unit: 11 addresses (`/%0a`, `/%0d`, `/%0d%0a`, `/abc%0d%0a`, `/%E2%80%A8`, `/%E2%80%A9`, `/%0a/cards`, `/settings%0a`, `/cards%0d/x`, `/%00`, `/%7f`) each show "No screen here" with Home and Fix It; the Pages guard refuses 9 raw and encoded control-character paths; a twice-encoded `/%250a` reaches the router as literal text and shows Not found |
| DEF-08 | fix-before-deploy | `src/core/settingsRead.ts` (new): read leniently (drop unknown top-level keys), write strictly; a recovery read resets damaged ordinary fields for backup, Restore, and the PIN check, and never guesses the role or the PIN. `db.ts`, `backup.ts`, `backupImport.ts`, `pin.ts`, `settingsStore.ts`, `customerView.tsx` use it; `errors.ts` plain words; `BannerStack.tsx` "Settings could not be read" with "Open Backup"; `BackupNow.tsx` names reset fields; `StateReadouts.tsx` shows ignored fields | **closed, with a residual filed as DEF-13** | pass 1 e2e test passes at 5 widths. New e2e (`tests/adversarial/settings-rollback.spec.ts`), 5 widths each: a shop phone with an unknown field shows no notice, the backup saves without the field, and Restore of that file runs with the PIN; a damaged ordinary field (`handedness: "both"`) shows "Settings could not be read" with no Private Browsing advice and no schema text, Open Backup names the reset field and saves a file holding `"handedness":"left"`; 0 page errors. New unit (`tests/unit/settings-recovery.test.ts`): Customer View stays on through a reload with an unknown field and Exit works; the backup restores on a wiped phone with every job and the PIN; a shop row with no PIN never reads as shop, never turns Customer View on, never opens the pass |
| DEF-03 | later | none (`BackupNow.tsx` changed only for DEF-08) | **open** | probe: a second tap 40 ms or more after the first saves a second file and a second `export` entry; the `test.fail` test still fails as expected at 5 widths |
| DEF-04 | later | none | **open** | `test.fail` at 430 px still fails as expected; at 375 px a double tap on "Create the owner PIN" still types one stray digit (`dots-after-double-tap = 1`) |
| DEF-05 | later | none (`pin.ts` changed only for DEF-08; `consecutiveFails` is still memory only) | **open** | `tests/unit/pin-timing.test.ts` `it.fails` still fails as expected |
| DEF-06 | later | none (`scripts/content/pipeline.ts` unchanged) | **open** | `tests/unit/customer-safe.test.ts` `it.fails` still fails as expected |
| DEF-07 | later | none (`dev.css` line 42 `min-height: 44px` unchanged) | **open** | `test.fail` still fails as expected at 5 widths |
| DEF-10 | later | none | **open** | `src/app/screens/RoomPlaceholder.tsx` line 17 still says "the Model Y job sheet in reference/ is the stopgap" |
| DEF-11 | later | none | **open** | `src/app/screens/CustomerScreen.tsx` line 35 still says "arrive in Phase 4. Until then this is a preview" |
| DEF-12 | later | none | **open** | `src/app/shell.css` line 192 `max-width: 100%`; e2e reading: "375 preview is 341 px inside a 375 px window" |

#### New in pass 2: DEF-13 (fix-before-deploy): a role or PIN field from a newer version still traps the jobs

- Where: `src/core/settingsRead.ts` `salvageStoredSettings` refuses (`RecordInvalid`) when `deviceRole` or `ownerPin` fails its check, by design ("never guessed"). `src/core/backup.ts` `exportBackup` reads settings only through that salvage, so the whole backup is refused, not only the settings row. Restore is refused too: it needs the owner pass, and the PIN cannot be read. The words come from `src/core/errors.ts` `SETTINGS_UNREADABLE_MESSAGE`.
- When it happens: D5 allows a rollback. A later version adds a device role (for example a crew tablet) or moves the PIN to a new hash, the phone gets that version, and then the site is rolled back. The older copy cannot read either field. A damaged PIN record does the same.
- Reproduce (Playwright, any width): make a shop phone through Start fresh, set the settings row's `deviceRole` to `"crewTablet"` in IndexedDB (or the PIN record's `algorithm` to `"Argon2id"`), reload. Home shows "Settings could not be read ... Your jobs are still on this phone: open Settings, Backup to save a backup or restore one." Tap Open Backup. The Backup screen says: "The backup could not be prepared. This phone's saved settings could not be read, so nothing was changed. They may come from a newer version of the app. Your jobs are still on this phone: open Settings, Backup to save a backup or restore one." There is no Save backup button. The only way out is clearing site data, which deletes the jobs. 0 page errors, and no gate opens (Customer View cannot be switched on, the PIN check refuses, the pass stays closed).
- Expected: the jobs can always leave the phone, as the fix's own comment promises ("so the jobs can always leave the phone"), and the words never send the person to the screen that just failed.
- Suggested fix (architect decides, app-engineer applies): either (a) let the backup carry the jobs and every other table when the role or PIN cannot be read, marked so that Restore treats its settings as unreadable and asks for the owner's decision on another phone; or (b) freeze the `DeviceRole` and `OwnerPin` shapes in `src/schemas/runtime-device.ts`, with a schema test that fails on any change, so a later version adds a new field instead of changing these two. In both cases, change the words on the Backup screen so they do not point at Backup.
- Tests: `tests/adversarial/settings-rollback.spec.ts` "DEF-13: ... Backup still saves a file with the jobs" (2 tests x 5 widths, fail today); `tests/unit/settings-recovery.test.ts` (2 x `it.fails`, plus a passing test that pins down today's safe refusal).

#### New in pass 2: DEF-14 (later): the screen jumps on the first launch

- Where: `src/app/Shell.tsx`. With no hint yet (a first launch, or localStorage blocked), `showTopBar` holds the top bar until the settings row answers, then draws it, which pushes `.app-scroll` down. Before the DEF-01 fix the bar was drawn from the first frame.
- Evidence: Lighthouse mobile layout shift culprit `div#root > div.app-frame > div.app-scroll`, score 0.098 of a 0.106 total (pass 1 total: 0.051); mobile performance 0.89, 0.90, 0.90 against the BUILD_PROMPT target of 90+ (pass 1: 0.92). Lighthouse always measures a first launch. On the phone, the second launch onward has the hint "off" and draws the bar at once.
- Suggested fix: while the bar is held with the hint "unknown", hold its space with an empty box of the same height (no text, `aria-hidden`), so nothing internal shows and nothing moves.
- No test fails for it today; the Lighthouse numbers above are the record.

#### Edges of the fixes that were probed and held

- DEF-01: a phone upgraded from the pass 1 build (no hint) holds the bar (unit and e2e). From the `showTopBar` table and the code: a hint left "on" after Customer View went off only holds the bar until the row answers; storage stuck for more than 4 seconds with the hint "on" keeps the bar hidden and offers Reload in the body, so there is no dead end.
- DEF-02: line separators U+2028 and U+2029 (which the router's `*` also cannot match) land on Not found. A twice-encoded line break passes the Pages guard but reaches the router as plain text and lands on Not found.
- DEF-08: `__proto__` and nested unknown keys are dropped, never applied (owner's test plus mine); a shop row with no PIN is never salvaged into a shop phone; a damaged field is written back at its default only on the next ordinary write, never guessed for the role or PIN.
- DEF-09: Netlify (`/`) is unchanged; a back step that loads a new page (not a same-page step) goes to the server, which on GitHub Pages redirects the bare base to the slash.

### Pass 2: Lando's 15-point audit on the changed files

Files: `src/app/Shell.tsx`, `src/app/deepLink.ts`, `src/app/routes.tsx`, `src/app/unmatched.ts`, `src/app/screens/NotFound.tsx`, `src/app/banners/BannerStack.tsx`, `src/core/customerViewHint.ts`, `src/core/customerView.tsx`, `src/core/settingsRead.ts`, `src/core/db.ts`, `src/core/errors.ts`, `src/core/backup.ts`, `src/core/backupImport.ts`, `src/core/pin.ts`, `src/core/settingsStore.ts`, `src/features/settings/dev/StateReadouts.tsx`, `src/features/settings/ui/BackupNow.tsx`, the owners' new tests (`src/app/__tests__/deepLink.test.ts`, `shellDefects.test.tsx`, `shellState.test.ts`, `src/core/settingsRead.test.ts`, `settingsRecovery.test.ts`), and QA's files changed in this pass.

| Tier | Result | Files that fail |
|---|---|---|
| 1 Structure | pass | none. Both `tsc` programs clean, oxlint clean, every changed file ends with a newline |
| 2 Logic | pass with one defect | `src/core/backup.ts` and `src/core/errors.ts` (DEF-13: no way out when the role or PIN cannot be read, and the words loop). Every switch has a default; `NotFound` and every placeholder keep Home and Fix It |
| 3 Journey | pass | first load to every exit walked at 5 widths and on the Pages base; the gate fixes change what shows at once |
| 4 Runtime | pass | no TypeErrors on any route; the new localStorage access (`customerViewHint.ts`) is wrapped in try/catch with an "unknown" fallback; the only `console.error` in the changed files logs a storage error object, never a PIN, hash, or setting; no `window.self`, `window.top`, `btoa`, `atob`, `eval`, `innerHTML` |
| 5 Build rules | pass | no file over 400 lines anywhere in `src`, `scripts`, `tests` (largest changed: `src/core/db.ts` 326); the developer panel shows the new readouts ("Customer View at launch (first frame)", the ignored settings fields) |

Specific checks: hardcoded colors outside `tokens.css` and `icon.svg`: none (hex, rgb, rgba, hsl, oklch, color-mix). Em or en dashes in `src`, `content`, `scripts`, `tests`, `docs`, `knowledge`, `public`, `index.html`, configs: none. `overflow: hidden` or `clip`, `max-height`: none in any CSS (only comments saying so). `:hover` rules: none. Secrets: none added.

### Pass 2: tests added or changed by QA

| File | Change |
|---|---|
| `tests/unit/rules.test.tsx` | DEF-01 and DEF-02 unit tests turned from `it.fails` into plain tests (they pass) |
| `tests/unit/shell-recheck.test.tsx` | new: DEF-01 first-frame probes, DEF-02 eleven addresses and the guard, DEF-09 basename edges (21 tests) |
| `tests/unit/settings-recovery.test.ts` | new: DEF-08 edges (4 tests), DEF-13 (2 `it.fails` and 1 passing) |
| `tests/privacy/customer-view.spec.ts` | new test: no flash with the hint missing on every load (5 widths) |
| `tests/e2e/pages-base.spec.ts` | 2 new tests: links on 12 screens stay in scope; the same-page Back step |
| `tests/adversarial/settings-rollback.spec.ts` | new: DEF-08 in the browser (2 tests) and DEF-13 (2 tests), 5 widths each |

### Defect register (after pass 2)

Severity: blocks-gate (the gate cannot pass), fix-before-deploy (fix before the first Netlify publish at the Phase 3 gate, when real jobs start living on the phone), later. Owners from `docs/OWNERSHIP.md`. Reproduction steps for DEF-01 to DEF-12 are in the pass 1 record below; DEF-13 and DEF-14 are above.

| ID | Severity | Owner | File | One line | Pass 1 | Pass 2 |
|---|---|---|---|---|---|---|
| DEF-09 | blocks-gate | app-engineer | `src/app/deepLink.ts` | On the Pages base, Home went to `/aurigen-directory`, outside the offline copy's scope | open | **closed** |
| DEF-01 | fix-before-deploy | app-engineer | `src/app/Shell.tsx` | The internal top bar drew while the saved Customer View flag loaded | open | **closed** |
| DEF-02 | fix-before-deploy | app-engineer | `src/app/routes.tsx` | An encoded line break in the first path segment rendered a blank page | open | **closed** |
| DEF-08 | fix-before-deploy | app-engineer (architect for the read rule) | `src/core/db.ts`, `src/core/settingsRead.ts` | One unrecognised settings field blocked backup, restore, and setup | open | **closed** (residual is DEF-13) |
| DEF-13 | fix-before-deploy | architect (decides), then app-engineer | `src/core/settingsRead.ts`, `src/core/backup.ts`, `src/core/errors.ts`, `src/schemas/runtime-device.ts` | A role or PIN field a newer version changed still blocks the backup, and the words loop back to Backup | new | **open** |
| DEF-03 | later | app-engineer | `src/features/settings/ui/BackupNow.tsx` | A second tap 40 ms or more after the first saves a second backup | open | open |
| DEF-04 | later | app-engineer (ui-designer if the fix goes in `PinPad.tsx`) | `src/features/settings/DeviceRoleScreen.tsx` | At 430 px a double tap on Start fresh lands on the PIN pad's Cancel; at 375 px a double tap on "Create the owner PIN" types a stray digit | open | open |
| DEF-05 | later | app-engineer | `src/core/pin.ts` | The wrong-PIN count lives in memory; a reload between tries resets it | open | open |
| DEF-06 | later | app-engineer | `scripts/content/pipeline.ts` | A duplicate id crashes the content build instead of listing the problem | open | open |
| DEF-07 | later | app-engineer | `src/features/settings/dev/dev.css` line 42 | Device preview buttons are 44 px tall in Shop density | open | open |
| DEF-10 | later | app-engineer | `src/app/screens/RoomPlaceholder.tsx` line 17, `src/app/__tests__/shell.test.tsx` line 81 | The Job Runner placeholder points to `reference/`, which the phone cannot open | open | open |
| DEF-11 | later | app-engineer | `src/app/screens/CustomerScreen.tsx` line 35 | The customer screen tells the customer "arrive in Phase 4" and "this is a preview" | open | open |
| DEF-12 | later | app-engineer | `src/app/PreviewHost.tsx`, `src/app/shell.css` line 192 | "Mobile 375" shows a 341 px frame on a 375 px screen | open | open |
| DEF-14 | later | app-engineer | `src/app/Shell.tsx` | On a first launch the held top bar appears late and pushes the screen down (CLS 0.10, mobile performance 89 to 90) | new | **open** |

## Pass 1 record (first pass, 2026-10-11, about 00:30 to 01:12 UTC, kept as written)

Everything in this section is the pass 1 report as it was written before the owners fixed anything. Where it says "open" or "fails", that was true at pass 1; the current status of every defect is in the register above.

Owner: qa-adversary. Written 2026-10-11 on branch `masterclass/phase-1`. Every number below comes from a command run in the cloud VM on that date; the output lines are quoted. The build under test is the production build served by `vite preview`, at `/` (Netlify shape) and at `/aurigen-directory/` (GitHub Pages shape).

### Verdict (pass 1)

**Gate: not passed. One defect blocks it (DEF-09).** On the GitHub Pages install, the Home link sends the app to an address the offline copy does not cover, so a reload with no signal shows the browser's "no internet" page instead of the app. That is the exact test the Phase 1 gate asks for, on the exact link Lando installs from. The fix is small and is described under DEF-09.

Everything else that can be checked in this VM passes: `npm run check` is green, the build is clean, the app installs (zero installability errors), works offline at both base paths, holds Customer View with nothing internal on any route, survives reloads, refuses every bad backup and bad reading, and scores 100 on accessibility. Three more defects should be fixed before the first Netlify publish (DEF-01, DEF-02, DEF-08) and seven can wait.

#### Lando, in plain words

- The app works with no signal, but on the Pages link one button (Home) can strand you on a "not connected" screen after the phone reloads the app. Fix that before you test in the garage.
- Customer View never showed anything internal on any screen. On a reload it flashes the words "Masterclass 101" at the top for a split second before the customer screen. Fix before customers see it.
- A garbled link can open a blank page. A rare case, easy to fix.
- If the phone's settings record is ever damaged (for example by rolling back to an older version), the app cannot make or restore a backup. Fix before real jobs live on the phone.
- The phone-only checks are at the end of this file as a list you can tick.

### Commands and key output

| Command | Result | Key lines |
|---|---|---|
| `npm run check` | exit 0, 33 s | typecheck clean; `oxlint --deny-warnings` no output; `content build: 77 items (quickcard 14, equipment 22, product 21, glossaryterm 20), 0 customer-safe, 0 superseded left out ... 77 search documents`; `Test Files 39 passed (39)`, `Tests 731 passed \| 4 expected fail (735)` |
| `npm run build` | exit 0 | `✓ 336 modules transformed`; largest chunk `vendor 470.64 kB (gzip 146.42 kB)`; `PWA v2.0.0 mode generateSW precache 19 entries (894.99 KiB)` |
| `npx vitest run tests/unit` (QA suites only) | exit 0 | `Test Files 6 passed (6)`, `Tests 398 passed \| 4 expected fail (402)` |
| `npm run test:e2e` (builds, then serves `/` on 4173 and `/aurigen-directory/` on 4174) | exit 1 by design: the failures are the open defects | see "E2E run" below |
| Lighthouse 13.5.0, mobile (simulated throttling) | ran | performance 0.92, accessibility 1.00, best practices 1.00, SEO 0.54 (noindex on purpose; see below); FCP 2.3 s, LCP 2.9 s, TBT 30 ms, CLS 0.051 |
| Lighthouse 13.5.0, `--preset=desktop` | ran | performance 1.00, accessibility 1.00, best practices 1.00, SEO 0.54; FCP 0.5 s, LCP 0.7 s, TBT 0 ms, CLS 0.027 |
| Installability (Chrome DevTools Protocol `Page.getInstallabilityErrors`, `/` and `/aurigen-directory/`) | ran | `installabilityErrors []` on both; manifest `display standalone`, `start_url "."`, `scope "."`, icons 192 and 512, any and maskable; `apple-touch-icon 200 image/png` |
| axe-core 4 sweep (WCAG 2.0, 2.1, 2.2 A and AA plus best practice) | ran | 14 routes x 2 widths (375, 1440) x 2 densities (Shop, Academy), the Start fresh result screen, and Customer View: `total violations across route sweep: 0`, result screen `[]`, Customer View `[]` |

Lighthouse 13 has no PWA category any more (it was removed in Lighthouse 12), so installability was checked through the DevTools Protocol instead, with the same rule Chrome uses. SEO 0.54 comes from two audits only: "Page is blocked from indexing" (the `noindex, nofollow` meta tag is intentional for a private shop app) and "robots.txt is not valid" (`vite preview` answers `/robots.txt` with the app shell). Neither is a target.

Lighthouse was installed in the scratch folder, not the project: `npm i --prefix <scratchpad>/lh lighthouse axe-core`, run with `CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.

#### E2E run

Playwright 1.56.1, Chromium 141.0.7390.37 (the build in `/opt/pw-browsers`; the bundled revision matched, so no executablePath override was needed). Projects: `w375`, `w430`, `w768`, `w1024`, `w1440`, and `pages375` (the Pages base path at 375 px).

Final run (`npm run test:e2e`, 2026-10-11 01:03 to 01:11, 7.6 min, 3 workers): **734 tests, 717 as expected, 17 unexpected failures, 0 flaky, 0 skipped.** The 717 include 11 known-defect tests marked `test.fail` (DEF-03 at 5 widths, DEF-04 at 430 px, DEF-07 at 5 widths) that failed as expected. The 17 failures are exactly the open defects that must be fixed:

| Failing test | Projects | Defect |
|---|---|---|
| `tests/privacy/customer-view.spec.ts` "a refresh in Customer View never flashes an internal element, even for one frame" | w375, w430, w768, w1024, w1440 | DEF-01 |
| `tests/adversarial/hostile.spec.ts` "an address with an encoded line break still shows a screen with a way out" | all 5 widths | DEF-02 |
| `tests/adversarial/hostile.spec.ts` "a settings row the app does not recognise: the phone can still make a backup and restore one" | all 5 widths | DEF-08 |
| `tests/e2e/pages-base.spec.ts` "after tapping Home, a reload with no signal still opens the app" and "every in-app link stays inside the service worker scope" | pages375 | DEF-09 |

Readings recorded by the run: a 6 times slower CPU drew Home with the bottom row in 835 to 1212 ms (limit 5000); the first visit is not controlled by the service worker and the second load is (prompt mode, `clientsClaim: false`, by design in D1); the Home link on the Pages build leads to `/aurigen-directory`.

An earlier full run (729 tests, 716 passed, 13 failed) had one extra failure: my privacy test reloaded before the Focus reminder's "Done" had been saved. That was a test race, not an app defect (the app correctly shows the reminder again when the mark is not yet saved); the test now waits for the save.

### Results per check

| # | Check (brief item) | Result | Evidence |
|---|---|---|---|
| 1 | `playwright.config.ts` at five widths, webServer on the built dist, retries 0, trace off | pass | `playwright.config.ts`; `npm run test:e2e` builds first, then serves; a second server serves the Pages build from `.cache/pages-dist` (gitignored) |
| 2a | Schema fixtures, valid and invalid, every content type | pass | `tests/unit/schemas.test.ts`: 13 types x 17 general breakages + 25 type-specific breakages, all refused; every valid fixture parses |
| 2b | PIN and owner pass timing (injected clocks) | pass, 1 defect | `tests/unit/pin-timing.test.ts`: pass ends at exactly 5:00 monotonic; wall clock moves do not stretch it; ends on hidden, pagehide, reload; lock at the third wrong PIN, released at 30 s, survives a reload. DEF-05: the wrong-PIN count resets on reload |
| 2c | Device role transitions, mistaken tap with no PIN, import to become shop, Start fresh needs the warning | pass | `tests/unit/device-role.test.ts` (18 tests) and `tests/unit/rules.test.tsx` (every role, setup, and restore table: every event not in a row is refused) |
| 2d | Backup export and import round trip, counters | pass | 24 and 25 paint-touching cars (plus Interior Only, bike, Stopped, Canceled, In progress that never count) read 24 and 25 after the round trip; 4 and 5 founder jobs read 4 and 5; PIN hash equal; Customer View off; audit has `import` and `roleChange` |
| 2e | customerSafe filter | pass | `tests/unit/customer-safe.test.ts`: 16 cases (verify item, verify row, verify line, verify dilution, `[VERIFY` text, sourced without confirmation, superseded) |
| 2f | Search cases for the seed content | pass | `tests/unit/search-cases.test.ts`: 16 queries, every top hit in the right knowledge base section, slowest 2.5 ms (target 100 ms). Tops: bucket mix `card-bucket-mix`; ipa mix `card-ipa-wipe`; clay lube `card-clay-tub`; zero gauge `equipment-rd-tc100`; gauge 85 `card-thickness-bands`; what kills the buff `card-kills-the-buff`; matte paint `card-kills-the-buff`; how much polish and wet the pad `card-pad-priming`; pad ladder `card-pad-ladder`; headlights `product-blue-magic-headlight-restorer`; car wash mode and tesla roof `card-tesla-wash-mode-tape`; bike tire shine and chain `card-bike-rules`; backing plate `equipment-backing-plate` |
| 2g | Content build rejects a customer-safe verify item (temp content dir) | pass, 1 defect | names the file and the reason, writes nothing. DEF-06: two files with the same id crash the build with a stack trace instead of a plain problem |
| 3a | Every route renders, no console errors, no failed requests | pass | 14 routes x 5 widths, 0 page errors, 0 console errors, 0 failed requests, 0 responses of 400+ |
| 3b | No horizontal scroll | pass | 14 routes x 5 widths, plus 8 main screens at 320 px |
| 3c | Every button and link at least 44 x 44, 64 px tall in Shop density | pass, 1 defect | 14 routes x 5 widths in Shop (64) and Academy (44); flow screens (PIN pad, Start fresh, result, restore picker, developer panel, Customer View) too. DEF-07: the device preview buttons are 44 to 47 px in Shop density |
| 3d | No clipped heading or button text | pass | 14 routes x 5 widths |
| 3e | Fix It on every internal screen, absent in Customer density | pass | bottom row on all 14 routes, fully on screen; absent on every route in Customer View |
| 3f | Install card when not standalone | pass | shows on Home and Settings, not on Fix It, Cards, Search; "Not now" holds after a reload; absent when standalone is emulated |
| 3g | Setup banner shows with no PIN and is gone after the setup flow | pass | driven through the UI with PIN 482915: role, PIN, first backup (download fallback in Chromium, `masterclass-backup-YYYY-MM-DD.json`), Done; audit `export, pinSet, roleChange`; the PIN is never in settings, audit, or the backup file |
| 3h | Developer panel renders every readout label | pass | 46 labels present after the PIN toggle; `developerToggle` audited once; reads "Production" |
| 3i | Device preview resizes the frame to 375 and 768 | pass | inner width exactly 375 and 768 where the window is wider; at 375 and 430 px windows the frame shrinks to fit (noted as DEF-12) |
| 4 | Privacy: Customer View on, no internal element on any route or in the accessibility tree; no unverified badge; no developer panel; no toast | pass, 1 defect | 14 routes plus `/cards/card-ipa-wipe` (a verify card), `/search?q=ipa`, `/settings/developer?panel=1`, with developer tools on beforehand: no `[data-internal]`, no bottom row, no banner, no toast, no drawer, no internal link, no internal word in the ARIA snapshot; the only button is "Exit Customer View". A due backup reminder is held and returns after. DEF-01: during the load after a refresh, the internal top bar ("Masterclass 101") is drawn for a moment |
| 5a | Persistence: PIN and role survive reload and kill; Customer View survives reload | pass | `tests/persistence/persistence.spec.ts`; also mode and thumb side; the owner pass does not survive (correct) |
| 5b | Refresh mid role flow writes nothing; after the role write the banner sits on the backup | pass | Start fresh warning, between PIN entries, setup flow between PIN entries |
| 5c | Offline: after the worker is ready, offline reload of `/`, `/cards`, `/fixit`, a card opens, search works | pass at `/`, fails one case at `/aurigen-directory/` | 5 widths at `/`. At the Pages base: offline reload of the base, Fix It, a card, and search pass; reload after tapping Home fails (DEF-09) |
| 6a | Double taps: setup buttons and "This is the shop phone" | pass, 2 defects | one write per double tap; "This is the shop phone" writes nothing whatever the second tap hits. DEF-03 (backup saved twice), DEF-04 (at 430 px a double tap on Start fresh lands on the PIN pad's Cancel) |
| 6b | Storage denied (IndexedDB removed) | pass | "This phone is not saving" in plain words; Fix It and a card still open; 0 page errors |
| 6c | 9999 um refused by the schema | pass | `parseGaugeInput`, `Micron`, and `PanelReading` refuse 0, 19, 1000, 9999, empty, "abc", -5, NaN, Infinity, "1e3", "0x50", "85 um" and more |
| 6d | Developer panel by URL in production without the owner toggle | pass | "Developer tools are off" for 4 URL variants, even with a saved preview width in localStorage |
| 6e | Customer density toggled while a card is open | pass | card open in one tab, Customer View on in another: replaced at once, comes back after; a search result sheet is gone too |
| 6f | Malformed backup rejected with a message | pass | garbage, empty, other JSON, `[]`, unknown version, tampered checksum: each refused in words with "Nothing on this phone changed"; a study backup cannot make a shop phone |
| 6g | Extra adversarial runs | 2 defects | stuck storage offers Reload after 4 s; storage full on the PIN write is refused with nothing half-written; 6x slower CPU draws Home in 835 to 1212 ms; deep link guard refuses `//evil`, backslash, `https:`, `javascript:`. DEF-02 (encoded line break gives a blank page), DEF-08 (an unrecognised settings field blocks backup and restore) |
| 7 | Lando's 15-point audit on every changed file | pass with the defects above | see "15-point audit" |
| 8 | Lighthouse | pass | mobile: performance 92, accessibility 100; installable; see the table above |
| BUILD_PROMPT 9 item 9 | Accessibility: contrast, focus, labels, reduced motion | pass | axe 0 violations; Tab through Home shows a focus ring on every stop; every control named, every field labelled; with reduced motion nothing animates or transitions over 10 ms |

### Defects

Severity: blocks-gate (the gate cannot pass), fix-before-deploy (fix before the first Netlify publish at the Phase 3 gate), later. Owners from `docs/OWNERSHIP.md`. Every defect except the three wording and label items (DEF-10, DEF-11, DEF-12) has a test that fails today and passes once it is fixed. Unit tests for defects use `it.fails` so `npm run check` stays green; e2e tests for "later" defects use `test.fail`; e2e tests for blocks-gate and fix-before-deploy defects fail outright.

| ID | Severity | Owner | File | One line |
|---|---|---|---|---|
| DEF-09 | blocks-gate | app-engineer | `src/app/deepLink.ts` (`basenameFor`), `src/app/App.tsx`, every `to="/"` | On the Pages base, Home goes to `/aurigen-directory`, outside the offline copy's scope |
| DEF-01 | fix-before-deploy | app-engineer | `src/app/Shell.tsx` line 107 | The internal top bar draws while the saved Customer View flag loads |
| DEF-02 | fix-before-deploy | app-engineer | `src/app/routes.tsx` | An encoded line break in the first path segment renders a blank page |
| DEF-08 | fix-before-deploy | app-engineer (with architect for the schema rule) | `src/core/db.ts` (`readSettingsIn`, `readSettingsRowIn`), `src/core/backup.ts`, `src/schemas/runtime-device.ts` (`Settings` is strict) | One unrecognised settings field blocks backup, restore, and setup |
| DEF-03 | later | app-engineer | `src/features/settings/ui/BackupNow.tsx` | A second tap 40 ms or more after the first saves a second backup |
| DEF-04 | later | app-engineer | `src/features/settings/DeviceRoleScreen.tsx`, `src/components/ui/PinPad.tsx` (ui-designer, if the fix goes there) | At 430 px a double tap on Start fresh lands on the PIN pad's Cancel |
| DEF-05 | later | app-engineer | `src/core/pin.ts` | The wrong-PIN count lives in memory; a reload between tries resets it |
| DEF-06 | later | app-engineer | `scripts/content/pipeline.ts` | A duplicate id crashes the content build instead of listing the problem |
| DEF-07 | later | app-engineer | `src/features/settings/dev/dev.css` line 42 | Device preview buttons are 44 px tall in Shop density |
| DEF-10 | later | app-engineer | `src/app/screens/RoomPlaceholder.tsx` line 17 (and `src/app/__tests__/shell.test.tsx` line 81) | The Job Runner placeholder points to `reference/`, which the phone cannot open |
| DEF-11 | later | app-engineer | `src/app/screens/CustomerScreen.tsx` | The customer screen tells the customer "arrive in Phase 4" and "this is a preview" |
| DEF-12 | later | app-engineer | `src/app/PreviewHost.tsx`, `src/app/shell.css` (`.app-preview__frame max-width: 100%`) | "Mobile 375" shows a 341 px frame on a 375 px screen, under a 375 label |

#### DEF-09 (blocks-gate): Home leaves the offline copy on the Pages install

- Where: the router basename is `basenameFor('/aurigen-directory/')` = `/aurigen-directory`, so every link to `/` (top bar Home, Not found, placeholders, error boundary, and the Home back buttons on Fix It, Search, Quick Cards, Settings) renders `href="/aurigen-directory"`. The service worker's scope is `/aurigen-directory/` (with the slash), and a scope can never be wider than the folder of `sw.js` without a `Service-Worker-Allowed` header, which GitHub Pages cannot send. So `/aurigen-directory` is not covered.
- Reproduce (Playwright, `pages375`): open `/aurigen-directory/cards` online, wait for "Ready offline", reload, tap Home in the top bar (address becomes `/aurigen-directory`), go offline, reload. Result: `net::ERR_INTERNET_DISCONNECTED`, no app, `navigator.serviceWorker.controller` is null. Expected: the Home screen.
- On the phone: open the installed app, tap Home, then anything that reloads the page with no signal: the app's own Reload button (boot guard, slow storage), iOS reloading the app after it was pushed out of memory in the background, or a reload in a Safari tab. Result: Safari's "not connected to the internet" page inside the Home Screen app, which has no address bar and no back button.
- Netlify (`/`) is not affected: there the basename is `/`.
- Suggested fix: keep the trailing slash. For example, on boot and on every location change, if `window.location.pathname` equals the base without its slash, `history.replaceState` to the base with the slash (the router's own path stays `/`). Then re-run `tests/e2e/pages-base.spec.ts`.
- Tests: `tests/e2e/pages-base.spec.ts` "after tapping Home, a reload with no signal still opens the app" and "every in-app link stays inside the service worker scope".

#### DEF-01 (fix-before-deploy): a flash of the internal frame on a refresh in Customer View

- Where: `src/app/Shell.tsx` line 107 renders `<header class="app-top">` when `customerView.on` is false, and `on` is false while the saved flag is still loading (`ready` false). `<Internal>` and the bottom row already fail closed; the header does not. The `<html data-density>` is also `shop` for that moment.
- Reproduce: make a shop phone, turn Customer View on, tap Done on the Focus reminder, reload any route. A MutationObserver installed before load records `header.app-top` with the text "Masterclass 101" on every route tried (`/`, `/fixit`, `/cards/card-bucket-mix`, `/settings`, `/settings/developer`). No buttons, no data, but BLUEPRINT 3.4 says a refresh never reveals internals.
- Suggested fix: render the header only when `customerView.ready && !customerView.on`, and apply the customer density before the first paint when the saved flag says so (or hold the frame until ready).
- Tests: `tests/privacy/customer-view.spec.ts` "a refresh in Customer View never flashes an internal element, even for one frame" (5 widths); unit `tests/unit/rules.test.tsx` "with Customer View saved on, the first frame after a reload draws no internal top bar" (`it.fails`).

#### DEF-02 (fix-before-deploy): a blank page from an encoded line break

- Where: react-router compiles the `*` route to a pattern whose `.` does not match a newline, so `matchRoutes` returns nothing for `/\n` and `<Routes>` renders null: no top bar, no bottom row, no message. The boot guard does not fire because `main.tsx` ran. Confirmed in Node: `"/x" -> / > *`, `"/\n" -> NO MATCH`, `"/cards/%0a" -> cards/:id`.
- Reproduce: open `/%0a`, `/abc%0d%0a`, or the Pages-style deep link `/?p=%2F%250d%250aSet-Cookie`. Result: `#root` is empty, 0 links. The Pages 404 redirect turns any such link into this address, so it is reachable from outside.
- Suggested fix: render Not found when `useRoutes` returns null (for example `useRoutes(table) ?? <Shell with NotFound>`), or replace any path holding a control character with the base before the router starts (next to `restoreDeepLink`).
- Tests: `tests/adversarial/hostile.spec.ts` "an address with an encoded line break still shows a screen with a way out" (5 widths); unit `tests/unit/rules.test.tsx` (`it.fails`).

#### DEF-08 (fix-before-deploy): one unrecognised settings field blocks backup and restore

- Where: `Settings` is a strict schema and every settings read validates it. A settings row with one field this version does not know (what a newer version writes; an older copy then reads it after a rollback, D5 allows rollbacks) makes `readSettingsIn` throw `RecordInvalid` everywhere.
- Reproduce: open `/`, add `fieldFromANewerVersion: true` to the `settings` row in IndexedDB, reload. Result: the banner says "This phone is not saving ... Private Browsing off and some free space usually fix it" (wrong advice) and shows the schema text `ownerPin: A shop phone always has an owner PIN (D12)` or `Unrecognized key`; Backup shows "The backup could not be prepared"; Restore from a valid file fails with the same message; "This is a study phone" fails; two unhandled promise rejections are logged. The only way out is clearing the site data, which deletes the jobs.
- Suggested fix: read runtime records leniently (strip unknown keys on read, validate strictly on write), let Backup export the raw tables even when settings fail validation, let Restore replace a settings row that fails validation, and give the banner plain words for this case. Architect: say whether runtime records keep `strictObject` on read.
- Test: `tests/adversarial/hostile.spec.ts` "a settings row the app does not recognise: the phone can still make a backup and restore one" (5 widths).

#### DEF-03 (later): a double tap can save two backups

- Reproduce: `/settings/backup`, wait for "Save backup", tap twice. Gap 0 or 10 ms: 1 file, 1 `export` entry. Gap 40 or 120 ms: 2 files, 2 `export` entries. The guard holds only while the share or download is in flight, and the Chromium download plus the next copy's preparation finish in under 40 ms. On the iPhone the share sheet covers the button, so the risk is mostly desktop and Android.
- Suggested fix: ignore a second tap within about 700 ms (the window planned for "Done, next").
- Test: `tests/adversarial/double-taps.spec.ts` (`test.fail`).

#### DEF-04 (later): at 430 px a double tap on Start fresh is undone

- Reproduce: 430 x 932, `/settings/device`, Start fresh, type `zero`, double tap Start fresh. The first tap opens "Create the owner PIN"; the second lands on the PIN pad's Cancel key, which sits where the button was, and the screen drops back to Device role. Nothing is written (safe), but the tap looks like it did nothing. At 375, 768, 1024, 1440 the keys do not line up and it works.
- Same family at 375 px: a double tap on "Create the owner PIN" types one stray digit into the new PIN pad (recorded by the run: 1 dot filled at 375, 0 at the other widths). The confirmation step then reports a mismatch and starts again, so no wrong PIN is saved, but it is confusing with gloves.
- Suggested fix: ignore taps on a PIN pad for about 300 ms after it appears, or move Cancel and the keys away from where the previous screen's main button sits.
- Test: `tests/adversarial/double-taps.spec.ts` (`test.fail` at w430).

#### DEF-05 (later): the wrong-PIN count resets on reload

- Reproduce (unit, injected clocks): two wrong PINs, reload (memory reset), one more wrong PIN: answer `wrong`, not `locked`. Two tries per reload never lock. D4 says three wrong attempts lock. D4 also says the PIN keeps honest people honest; this matters for DJ guessing, not for a determined attacker.
- Suggested fix: count failures from the `pinFail` audit entries (write one per wrong PIN) or keep the count in settings.
- Test: `tests/unit/pin-timing.test.ts` (`it.fails`).

#### DEF-06 (later): a duplicate id crashes the content build

- Reproduce: a temp content folder with the same card id in two files. `buildContent` reports the duplicate, still adds both items, and `buildSearchIndex` throws `MiniSearch: duplicate ID card-fixture-mix`. The CLI then prints "content build crashed" with a stack trace instead of the list of problems. It still exits 1 and writes nothing, so nothing broken ships.
- Suggested fix: skip the second item after reporting the duplicate.
- Test: `tests/unit/customer-safe.test.ts` (`it.fails`).

#### DEF-07 (later): device preview buttons are 44 px in Shop density

- `.mc-preview__button { min-height: 44px; }` wins over the Shop density's 64 px. Measured 116 x 44 at 375 px and 135 x 47 at 1440 px. A developer tool, but it sits on every screen once the toggle is on.
- Test: `tests/e2e/a11y-flows.spec.ts` (`test.fail`).

#### DEF-10 (later): the Job Runner placeholder points to a folder the phone cannot open

- `/job` says "Until then, the Model Y job sheet in reference/ is the stopgap." `reference/` is a folder in the code repo. The screen still has working Fix It and Quick Cards exits, so it is not a dead end. Suggest words such as "Until then, use the printed Model Y job sheet." Update `src/app/__tests__/shell.test.tsx` line 81 with it. (Also reported by the integration run.)

#### DEF-11 (later): the customer screen talks about phases

- In Customer View every route says "Customer pages (check-in, paint report, menu) arrive in Phase 4. Until then this is a preview, and leaving it is one tap below." A customer standing there reads build jargon. Suggest dropping that block or saying nothing about it until Phase 4 replaces the screen.

#### DEF-12 (later): the "Mobile 375" label is wrong on a narrow screen

- `.app-preview__frame` has `max-width: 100%` inside a stage with 16 px padding, so a preview wider than the screen shrinks: at a 375 px window both "Mobile 375" and "Tablet 768" show a 341 px frame; at 430 px "Tablet 768" is 396 px; at 768 px it is 734 px. The buttons keep their labels. Suggest disabling a width the screen cannot show, or naming the real width.

### Lando's 15-point audit

Run on every changed file: `src/app`, `src/core`, `src/features`, `src/components/ui`, `src/design`, `src/schemas`, `scripts`, `index.html`, `vite.config.ts`, `public/404.html`, plus the QA files in this pass.

| Tier | Result | Files that fail |
|---|---|---|
| 1 Structure | pass | none. `tsc` on both programs clean; oxlint clean; 208 files checked for a final newline, balanced CSS braces, and closed HTML tags; `node --check` on `dist/sw.js` and every `dist/assets/*.js` passes |
| 2 Logic | pass with defects | `src/app/routes.tsx` (DEF-02: no screen for one class of address); `src/core/db.ts` (DEF-08: an unreadable settings row has no way out). Every `switch` has a default (12 checked); every state table refuses unknown events (tested exhaustively) |
| 3 Journey | pass with defects | `src/app/deepLink.ts` and every Home link (DEF-09: Home leaves the offline copy on Pages); first load to every exit walked at 5 widths |
| 4 Runtime | pass with defects | `src/app/Shell.tsx` (DEF-01). No TypeErrors on load on any route; storage access wrapped (`mode.ts`, `installCard.ts`, `previewWidth.ts` all in try/catch); no `window.self`, `window.top`, `btoa`, `atob`, `eval`, `innerHTML`, `dangerouslySetInnerHTML`; `console.error` calls log errors only, never a PIN, hash, or setting value; the PIN is never in settings, audit, or a backup |
| 5 Build rules | pass | no file over 400 lines (largest: `src/core/speech.ts` 331, `src/schemas/runtime-job.ts` 326; QA's largest `tests/adversarial/hostile.spec.ts` 326); developer panel present, toggleable, labelled "Removable before the final deploy" |

Specific checks from the brief:

- Files over 400 lines: none.
- Hardcoded colors: `grep -rnE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b' src` outside `tokens.css` and `icon.svg`: none. No `rgb(`, `rgba(`, `hsl(`, `oklch(`, `color-mix(` or named colors outside `tokens.css`. The one hex outside `src` is `index.html` `theme-color #151311`, which HTML requires as a literal and the build checks against `--base`.
- Em or en dashes: a scan of 305 files (src, content, scripts, tests, public, docs, knowledge, configs): none.
- `overflow: hidden` or `clip`: none in any CSS (the only hits are comments saying there is none).
- `max-height`: none in any CSS.
- Hover-only interactions: no `:hover` rule at all; press feedback is `:active` and `.ui-press`.
- Fonts: Barlow and Barlow Condensed, self-hosted woff2, `font-display: swap` on all five faces, fallback stacks present; Inter, Roboto, Arial, and system-ui are never the primary face (Arial appears only as a fallback).
- App root `100dvh` (with a `100vh` fallback line), the one scroll container is `.app-scroll` with `overflow-y: auto`; the document never scrolls (tested).
- Secrets: no API key, token, or password patterns in `src`, `scripts`, `content`, or `dist`. The phone number and email in `src/app/config.ts` ship in the build by design (D7 public brand values).

### Not run in Phase 1, and why

These items in BUILD_PROMPT section 9 need screens that arrive in later phases. Nothing here is skipped silently; each has a home.

| Item | Waits for |
|---|---|
| Double tap "Done, next"; refresh, kill, and lock mid-job on the same step with correct timers; a moved clock mid-stage | Phase 3 (Job Runner) |
| 0, empty, and 9999 typed into the gauge screen | Phase 3 (gauge entry). The schema refusal is tested now |
| A job with no vehicle size | Phase 3 and 4 (quote) |
| Customer View toggled during a running job; the customer session PIN | Phase 3 and 4 |
| Camera permission denied | Phase 4 (check-in) |
| Crew reaching a sign-off by URL | Phase 5. Today no sign-off screen exists: 4 hand-typed sign-off addresses land on Not found |
| Pricing, bands in the UI, founder's and 25-car unlocks in the quote builder | Phase 4 and 6. The counters are tested on seeded logs now |
| The full 43 (45 or more) search cases | Phase 2 (`tests/search-cases.yaml`, troubleshooter). 16 seed cases run now |
| WebKit (iPhone engine) runs | Not installed in this VM; Lando's phone at each gate |

### What only the phone can answer (pass 1 copy; tick the current list near the top of this file)

Do this from the GitHub Pages link once DEF-09 is fixed. One thing first, because the iPhone keeps the Home Screen app's storage apart from Safari's:

- [ ] After Add to Home Screen, open the app from its icon **with signal** and wait until the top line says **Ready offline**. Only then turn on airplane mode. (The copy Safari saved does not carry over to the icon.)

The 9-item device checklist (BLUEPRINT section 9). Items 7, 8, and 9 last, with a test record only.

- [ ] 1. iOS version (Settings, General, About). The keep-the-screen-on feature needs 18.4 or newer. Write it down: ______
- [ ] 2. Developer panel, "Storage kept (persisted)" and "Answer to the keep request": write both values: ______ / ______ (No inside the installed app is the one to report)
- [ ] 3. Settings, Read aloud, Test voice, then lock the screen right away: does the voice keep going? Yes / No
- [ ] 4. Developer panel, Test share PNG, PDF, JSON: which apps appear for each? ______
- [ ] 5. Which voices the panel lists, and does the default English voice sound acceptable? ______
- [ ] 6. Turn on Low Power Mode, tap the keep-awake test in the panel: does the screen stay on for 30 seconds? Yes / No
- [ ] 7. Clear Safari history and website data (this signs you out of websites), reopen the installed app: is the test record still there? Yes / No
- [ ] 8. Create a new test record in the installed app (for Phase 1: set the owner PIN and save the first backup; the PIN and "Last backup" are the record)
- [ ] 9. Delete the icon, reinstall from the same link: is the record from item 8 still there? Yes / No

Also on the phone, because Chromium cannot stand in for Safari here:

- [ ] Airplane mode, then in the installed app tap Home, Fix It, Quick Cards, Search, and open a card. Every screen opens.
- [ ] Save the first backup: the share sheet opens (not a download). Pick Save to Files. Then Settings, Backup and restore, Restore from a file, pick that file: it shows the date and counts and asks before replacing.
- [ ] Turn Customer View on from Home: the Focus reminder shows once; the bottom row holds only "Exit Customer View".
- [ ] The text is readable at arm's length on the cart, and every button can be hit with the left thumb.

### Test inventory and how to run (pass 1 copy; the current table is near the top of this file)

From `masterclass/`:

- `npm run check` runs the unit suites (app-engineer's under `src/` and QA's under `tests/unit/`).
- `npm run test:e2e` builds, serves `/` on 4173 and the Pages build on 4174, and runs every browser suite. `PW_SKIP_BUILD=1` reuses a fresh `dist/`; `PW_REUSE_SERVER=1` reuses running servers; `PW_WORKERS` sets the worker count; `PW_CHROMIUM` points at another Chromium binary if the bundled revision ever stops matching.

| File | What it covers |
|---|---|
| `playwright.config.ts` | 5 width projects plus `pages375`, two web servers, retries 0, trace off |
| `tests/fixtures/app.ts` | UI helpers: PIN taps, setup and Start fresh through the UI, IndexedDB reads, tap-target and Customer View leak scanners |
| `tests/fixtures/content.ts` | one valid item per content type and the ways to break each |
| `tests/fixtures/jobs.ts` | seeded logs: 24 and 25 cars, 4 and 5 founder jobs, bad and good gauge readings |
| `tests/unit/schemas.test.ts` | content schemas, readings, bands, flags, settings rules |
| `tests/unit/pin-timing.test.ts` | owner pass and lockout timing |
| `tests/unit/device-role.test.ts` | role transitions, Start fresh, import, backup round trip and counters |
| `tests/unit/customer-safe.test.ts` | customerSafe filter, content build on temp folders |
| `tests/unit/search-cases.test.ts` | knowledge base 24 cases on the seed content, timing |
| `tests/unit/rules.test.tsx` | every flow table, banner rules, developer tools rule, deep link guard, DEF-01 and DEF-02 at unit level |
| `tests/e2e/routes.spec.ts` | every route at every width |
| `tests/e2e/shell.spec.ts` | install card, setup banner and flow, developer panel, device preview, shop phone path |
| `tests/e2e/a11y-flows.spec.ts` | flow-screen targets, landmarks and names, focus, reduced motion |
| `tests/e2e/pages-base.spec.ts` | the GitHub Pages base path, offline |
| `tests/privacy/customer-view.spec.ts` | Customer View leak test |
| `tests/persistence/persistence.spec.ts` | reloads, kills, mid-flow refreshes, offline |
| `tests/adversarial/double-taps.spec.ts` | impatient and confused users |
| `tests/adversarial/hostile.spec.ts` | storage, backups, URL tricks, toggles, tiny screen, slow phone |
