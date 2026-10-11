# QA report: Phase 1 gate

Owner: qa-adversary. Branch `masterclass/phase-1`. Two passes so far, both on 2026-10-11, both in the cloud VM against the production build served by `vite preview` at `/` (Netlify shape) and at `/aurigen-directory/` (GitHub Pages shape). Every number comes from a command run that day; the key output lines are quoted.

How this file reads, newest first:

1. Pass 2 (recheck): verdict, what the owners fixed, what was rechecked and how, the new defects.
2. The defect register: every defect from both passes with its current status.
3. What only the phone can answer: the checklist Lando ticks.
4. Pass 1 record, kept as written, with the original reproduction steps for every defect.

## Pass 2 verdict (recheck, 2026-10-11, about 01:55 to 02:35 UTC)

**Gate: passed for everything the VM can check. No blocks-gate defect remains.** DEF-09, the one blocker from pass 1, is fixed and verified: on the GitHub Pages build every link on every screen stays inside the offline copy, and a reload with no signal after tapping Home opens the app. The three fix-before-deploy defects from pass 1 (DEF-01, DEF-02, DEF-08) are fixed and verified.

What remains:

- **New, fix-before-deploy: DEF-13.** The DEF-08 fix still blocks the backup when the role or PIN field is the part a newer version changed. The words on screen then send the person in a circle. Fix before real jobs live on the phone (Phase 3).
- **New, later: DEF-14.** The DEF-01 fix holds the top bar on a first launch, so the screen jumps down once when it appears. Mobile performance is 89 to 90 against the 90+ target (92 in pass 1).
- **Still open from pass 1, all later:** DEF-03, DEF-04, DEF-05, DEF-06, DEF-07, DEF-10, DEF-11, DEF-12. The owners did not change them this round, and nothing in this pass made any of them worse.

The rest of the gate (install from the Pages link over HTTPS, airplane mode, the 9-item device checklist) is Lando's, on the phone. The list is below.

### Lando, in plain words

- The Pages link problem is fixed. Home, every other button, and Back all stay inside the copy the phone keeps for no signal. You can run the airplane mode test now.
- Customer View no longer flashes "Masterclass 101" on a reload, even if the phone has lost its quick note of the Customer View setting.
- A garbled link now shows "No screen here" with buttons back to Home and Fix It, never a blank page.
- A settings record from a newer version, or one damaged field in it, no longer blocks backup or restore. One gap is left: if a future version changes the phone's role or the PIN format and you then roll back, the app still cannot make a backup, and its message points you to the Backup screen that just failed. It has to be fixed before real jobs are on the phone.
- The first time the app opens, the screen jumps down once when the top bar appears. Small, later.
- Eight small items from the first pass are still open. All are "later".

## Pass 2: commands and key output

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

## Pass 2: what the owners changed, and the recheck of each defect

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

### New in pass 2: DEF-13 (fix-before-deploy): a role or PIN field from a newer version still traps the jobs

- Where: `src/core/settingsRead.ts` `salvageStoredSettings` refuses (`RecordInvalid`) when `deviceRole` or `ownerPin` fails its check, by design ("never guessed"). `src/core/backup.ts` `exportBackup` reads settings only through that salvage, so the whole backup is refused, not only the settings row. Restore is refused too: it needs the owner pass, and the PIN cannot be read. The words come from `src/core/errors.ts` `SETTINGS_UNREADABLE_MESSAGE`.
- When it happens: D5 allows a rollback. A later version adds a device role (for example a crew tablet) or moves the PIN to a new hash, the phone gets that version, and then the site is rolled back. The older copy cannot read either field. A damaged PIN record does the same.
- Reproduce (Playwright, any width): make a shop phone through Start fresh, set the settings row's `deviceRole` to `"crewTablet"` in IndexedDB (or the PIN record's `algorithm` to `"Argon2id"`), reload. Home shows "Settings could not be read ... Your jobs are still on this phone: open Settings, Backup to save a backup or restore one." Tap Open Backup. The Backup screen says: "The backup could not be prepared. This phone's saved settings could not be read, so nothing was changed. They may come from a newer version of the app. Your jobs are still on this phone: open Settings, Backup to save a backup or restore one." There is no Save backup button. The only way out is clearing site data, which deletes the jobs. 0 page errors, and no gate opens (Customer View cannot be switched on, the PIN check refuses, the pass stays closed).
- Expected: the jobs can always leave the phone, as the fix's own comment promises ("so the jobs can always leave the phone"), and the words never send the person to the screen that just failed.
- Suggested fix (architect decides, app-engineer applies): either (a) let the backup carry the jobs and every other table when the role or PIN cannot be read, marked so that Restore treats its settings as unreadable and asks for the owner's decision on another phone; or (b) freeze the `DeviceRole` and `OwnerPin` shapes in `src/schemas/runtime-device.ts`, with a schema test that fails on any change, so a later version adds a new field instead of changing these two. In both cases, change the words on the Backup screen so they do not point at Backup.
- Tests: `tests/adversarial/settings-rollback.spec.ts` "DEF-13: ... Backup still saves a file with the jobs" (2 tests x 5 widths, fail today); `tests/unit/settings-recovery.test.ts` (2 x `it.fails`, plus a passing test that pins down today's safe refusal).

### New in pass 2: DEF-14 (later): the screen jumps on the first launch

- Where: `src/app/Shell.tsx`. With no hint yet (a first launch, or localStorage blocked), `showTopBar` holds the top bar until the settings row answers, then draws it, which pushes `.app-scroll` down. Before the DEF-01 fix the bar was drawn from the first frame.
- Evidence: Lighthouse mobile layout shift culprit `div#root > div.app-frame > div.app-scroll`, score 0.098 of a 0.106 total (pass 1 total: 0.051); mobile performance 0.89, 0.90, 0.90 against the BUILD_PROMPT target of 90+ (pass 1: 0.92). Lighthouse always measures a first launch. On the phone, the second launch onward has the hint "off" and draws the bar at once.
- Suggested fix: while the bar is held with the hint "unknown", hold its space with an empty box of the same height (no text, `aria-hidden`), so nothing internal shows and nothing moves.
- No test fails for it today; the Lighthouse numbers above are the record.

### Edges of the fixes that were probed and held

- DEF-01: a phone upgraded from the pass 1 build (no hint) holds the bar (unit and e2e). From the `showTopBar` table and the code: a hint left "on" after Customer View went off only holds the bar until the row answers; storage stuck for more than 4 seconds with the hint "on" keeps the bar hidden and offers Reload in the body, so there is no dead end.
- DEF-02: line separators U+2028 and U+2029 (which the router's `*` also cannot match) land on Not found. A twice-encoded line break passes the Pages guard but reaches the router as plain text and lands on Not found.
- DEF-08: `__proto__` and nested unknown keys are dropped, never applied (owner's test plus mine); a shop row with no PIN is never salvaged into a shop phone; a damaged field is written back at its default only on the next ordinary write, never guessed for the role or PIN.
- DEF-09: Netlify (`/`) is unchanged; a back step that loads a new page (not a same-page step) goes to the server, which on GitHub Pages redirects the bare base to the slash.

## Pass 2: Lando's 15-point audit on the changed files

Files: `src/app/Shell.tsx`, `src/app/deepLink.ts`, `src/app/routes.tsx`, `src/app/unmatched.ts`, `src/app/screens/NotFound.tsx`, `src/app/banners/BannerStack.tsx`, `src/core/customerViewHint.ts`, `src/core/customerView.tsx`, `src/core/settingsRead.ts`, `src/core/db.ts`, `src/core/errors.ts`, `src/core/backup.ts`, `src/core/backupImport.ts`, `src/core/pin.ts`, `src/core/settingsStore.ts`, `src/features/settings/dev/StateReadouts.tsx`, `src/features/settings/ui/BackupNow.tsx`, the owners' new tests (`src/app/__tests__/deepLink.test.ts`, `shellDefects.test.tsx`, `shellState.test.ts`, `src/core/settingsRead.test.ts`, `settingsRecovery.test.ts`), and QA's files changed in this pass.

| Tier | Result | Files that fail |
|---|---|---|
| 1 Structure | pass | none. Both `tsc` programs clean, oxlint clean, every changed file ends with a newline |
| 2 Logic | pass with one defect | `src/core/backup.ts` and `src/core/errors.ts` (DEF-13: no way out when the role or PIN cannot be read, and the words loop). Every switch has a default; `NotFound` and every placeholder keep Home and Fix It |
| 3 Journey | pass | first load to every exit walked at 5 widths and on the Pages base; the gate fixes change what shows at once |
| 4 Runtime | pass | no TypeErrors on any route; the new localStorage access (`customerViewHint.ts`) is wrapped in try/catch with an "unknown" fallback; the only `console.error` in the changed files logs a storage error object, never a PIN, hash, or setting; no `window.self`, `window.top`, `btoa`, `atob`, `eval`, `innerHTML` |
| 5 Build rules | pass | no file over 400 lines anywhere in `src`, `scripts`, `tests` (largest changed: `src/core/db.ts` 326); the developer panel shows the new readouts ("Customer View at launch (first frame)", the ignored settings fields) |

Specific checks: hardcoded colors outside `tokens.css` and `icon.svg`: none (hex, rgb, rgba, hsl, oklch, color-mix). Em or en dashes in `src`, `content`, `scripts`, `tests`, `docs`, `knowledge`, `public`, `index.html`, configs: none. `overflow: hidden` or `clip`, `max-height`: none in any CSS (only comments saying so). `:hover` rules: none. Secrets: none added.

## Pass 2: tests added or changed by QA

| File | Change |
|---|---|
| `tests/unit/rules.test.tsx` | DEF-01 and DEF-02 unit tests turned from `it.fails` into plain tests (they pass) |
| `tests/unit/shell-recheck.test.tsx` | new: DEF-01 first-frame probes, DEF-02 eleven addresses and the guard, DEF-09 basename edges (21 tests) |
| `tests/unit/settings-recovery.test.ts` | new: DEF-08 edges (4 tests), DEF-13 (2 `it.fails` and 1 passing) |
| `tests/privacy/customer-view.spec.ts` | new test: no flash with the hint missing on every load (5 widths) |
| `tests/e2e/pages-base.spec.ts` | 2 new tests: links on 12 screens stay in scope; the same-page Back step |
| `tests/adversarial/settings-rollback.spec.ts` | new: DEF-08 in the browser (2 tests) and DEF-13 (2 tests), 5 widths each |

## Defect register (current, after pass 2)

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

## What only the phone can answer (tick these on your iPhone)

Do this from the GitHub Pages link (https://landocommandoz.github.io/aurigen-directory/). DEF-09 is fixed, so this is ready. One thing first, because the iPhone keeps the Home Screen app's storage apart from Safari's:

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

- [ ] Airplane mode, then in the installed app tap Home, Fix It, Quick Cards, Search, and open a card. Then tap Home and pull the app closed from the app switcher, and open it again from the icon, still in airplane mode: the Home screen opens (this is the DEF-09 fix on the real phone).
- [ ] Save the first backup: the share sheet opens (not a download). Pick Save to Files. Then Settings, Backup and restore, Restore from a file, pick that file: it shows the date and counts and asks before replacing.
- [ ] Turn Customer View on from Home: the Focus reminder shows once; the bottom row holds only "Exit Customer View". Close the app from the app switcher and open it again: no "Masterclass 101" top line flashes before the customer screen (the DEF-01 fix).
- [ ] The text is readable at arm's length on the cart, and every button can be hit with the left thumb.

## Test inventory and how to run

From `masterclass/`:

- `npm run check` runs the unit suites (app-engineer's under `src/` and QA's under `tests/unit/`). Known-defect unit tests use `it.fails`, so `check` stays green while they are open.
- `npm run test:e2e` builds, serves `/` on 4173 and the Pages build on 4174, and runs every browser suite. Known "later" defects use `test.fail`; blocks-gate and fix-before-deploy defects fail outright, so today it exits 1 on DEF-13 only. `PW_SKIP_BUILD=1` reuses a fresh `dist/`; `PW_REUSE_SERVER=1` reuses running servers; `PW_WORKERS` sets the worker count; `PW_CHROMIUM` points at another Chromium binary if the bundled revision ever stops matching.

| File | What it covers |
|---|---|
| `playwright.config.ts` | 5 width projects plus `pages375`, two web servers, retries 0, trace off |
| `tests/fixtures/app.ts` | UI helpers: PIN taps, setup and Start fresh through the UI, IndexedDB reads, tap-target and Customer View leak scanners |
| `tests/fixtures/content.ts` | one valid item per content type and the ways to break each |
| `tests/fixtures/jobs.ts` | seeded logs: 24 and 25 cars, 4 and 5 founder jobs, bad and good gauge readings |
| `tests/unit/schemas.test.ts` | content schemas, readings, bands, flags, settings rules |
| `tests/unit/pin-timing.test.ts` | owner pass and lockout timing (DEF-05) |
| `tests/unit/device-role.test.ts` | role transitions, Start fresh, import, backup round trip and counters |
| `tests/unit/customer-safe.test.ts` | customerSafe filter, content build on temp folders (DEF-06) |
| `tests/unit/search-cases.test.ts` | knowledge base 24 cases on the seed content, timing |
| `tests/unit/rules.test.tsx` | every flow table, banner rules, developer tools rule, deep link guard, DEF-01 and DEF-02 at unit level |
| `tests/unit/shell-recheck.test.tsx` | pass 2: DEF-01 first frame, DEF-02 addresses, DEF-09 basename |
| `tests/unit/settings-recovery.test.ts` | pass 2: DEF-08 edges, DEF-13 |
| `tests/e2e/routes.spec.ts` | every route at every width |
| `tests/e2e/shell.spec.ts` | install card, setup banner and flow, developer panel, device preview, shop phone path |
| `tests/e2e/a11y-flows.spec.ts` | flow-screen targets, landmarks and names, focus, reduced motion (DEF-07) |
| `tests/e2e/pages-base.spec.ts` | the GitHub Pages base path, offline, link scope, Back step (DEF-09) |
| `tests/privacy/customer-view.spec.ts` | Customer View leak test, reload flashes with and without the hint (DEF-01) |
| `tests/persistence/persistence.spec.ts` | reloads, kills, mid-flow refreshes, offline |
| `tests/adversarial/double-taps.spec.ts` | impatient and confused users (DEF-03, DEF-04) |
| `tests/adversarial/hostile.spec.ts` | storage, backups, URL tricks, toggles, tiny screen, slow phone (DEF-02, DEF-08) |
| `tests/adversarial/settings-rollback.spec.ts` | pass 2: settings from a newer version in the browser (DEF-08, DEF-13) |

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
