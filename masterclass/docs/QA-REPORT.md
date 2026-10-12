# QA report: Phase 1 and Phase 2 gates

Owner: qa-adversary. Every number below comes from a command run in the cloud VM against the production build served by `vite preview` at `/` (Netlify shape) and at `/aurigen-directory/` (GitHub Pages shape). The key output lines are quoted.

How this file reads, newest first:

1. **Phase 2 gate, pass 5** (the fourth recheck, branch `masterclass/phase-2`, 2026-10-12): the verdict (gate passed), the brief's checks with evidence, commands, the recheck of DEF-28 to DEF-30 (all closed) and of DEF-27 and DEF-20 (still closed), no new defects, the content audit of the four moved products, the 15-point audit, QA's test changes (the first-session update suite, the flipped tests), the current Phase 2 defect register, the phone checks.
2. **Phase 2 gate, pass 4** (2026-10-12), kept as written: DEF-28 to DEF-30 as found, the recheck of pass 3's defects (DEF-27 and DEF-20 closed), two phone checks.
3. **Phase 2 gate, pass 3** (2026-10-12), kept as written: DEF-27 as found, the recheck of pass 2's defects, two phone checks.
4. **Phase 2 gate, pass 2** (2026-10-12), kept as written: DEF-24 to DEF-26 as found, the recheck of pass 1's defects, 17 more sampled numbers (87 in all), one phone check.
5. **Phase 2 gate, pass 1** (2026-10-12), kept as written: the first verdict, DEF-16 to DEF-23 as found, the full content audit table and the 70-number sample, the pass 1 phone checklist additions.
6. **Phase 1 gate record** (branch `masterclass/phase-1`, passes 1 to 4, 2026-10-11), kept as written: its verdicts, its defect register (DEF-01 to DEF-15, all closed), the phone checklist, the test inventory, and the reproduction steps.

# Phase 2 gate, pass 5 (recheck, 2026-10-12, about 12:20 to 13:25 UTC)

## Verdict

**Gate: passed. 1 defect is open: 0 blocks-gate, 0 fix-before-deploy, 1 later (DEF-22, parked by design until Phase 4).** The three defects pass 4 opened are closed: DEF-30 (an update in the first session never reloaded), DEF-29 (the marker and the offline notice when the copy is saved but does not serve the page), and DEF-28 (house lines in four products' `labelNotes`). DEF-27 and DEF-20, closed in pass 4, stay closed: their tests pass again in this run. No new defect. The full browser run is green: `1543 passed`, `40 skipped` (the crawl runs at 375 px only), 0 unexpected, 0 flaky, with no known-defect test left anywhere in the suites.

The brief named DEF-27 and DEF-20 as the two open defects and quoted their fix reports; both were closed in pass 4, which opened DEF-28 to DEF-30. A hash snapshot against pass 4's closing one shows exactly the owners' fixes for those three since then (four product files; `src/core/pwa.ts`, `src/app/status.ts`, `src/app/StatusChip.tsx`, `src/app/banners/bannerRules.ts`, `BannerStack.tsx`, and their tests), so this pass rechecks all five and runs every check the brief lists.

What held, with evidence below: in the first session, Update now reloads exactly once into the new version (also on a double tap), at five widths and both base paths; a takeover the page did not ask for (another tab's Update now) never reloads it while a stage runs or in front of a customer, and reloads once on the next tap after; two tabs in their first session each reload once. A copy that is saved but does not serve the page says "Saved, reopen app", offline "Offline, saved" with a notice that says the copy is saved, and Try again opens the page from it. labelNotes holds only the label's words on every item. Lighthouse mobile is 0.90 to 0.94 on every page measured, desktop 1.00. axe found 0 problems on 30 screens. The content passes every truth rule on the same 599 items, and the four moved products lost no fact.

## Lando, in plain words

- Everything QA flagged last time is fixed. If a new version comes out while you have the app open for the very first time, tapping Update now reloads the app into it by itself. It still never reloads during a job or while a customer is looking.
- After a hard refresh on the computer, the top now says "Saved, reopen app" instead of "Saving for offline", and with no signal it says the copy is saved and that Try again opens the page. Both are true; Try again works.
- Four more product pages now show the label's words on their own, and your house numbers as separate lines with their own badges.
- Nothing here needs your answer. One phone check changed, at the end of this section.

## The brief's checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | DEF-27 and DEF-20 closed; their known-defect tests flipped | **pass** | Both closed in pass 4 and flipped then (DEF-27's `test.fail` in `phase2-offline.spec.ts` became `phase2-first-session.spec.ts`; DEF-20's `it.fails` became four tests). In this pass every one of those tests passes again at 5 widths and both bases. Pass 4's three known-defect tests were flipped here: at the start of the pass DEF-28's `it.fails` failed as designed (`Error: Expect test to fail`), and DEF-29's and DEF-30's `test.fail` reported `Expected to fail, but passed` in all 15 runs. `grep` finds no `test.fail` or `it.fails` left in `tests/` or `src/` |
| 2 | DEF-27 attacked again: first visit, "Ready offline", airplane mode with no reload, then a lesson, an SOP, a product, a tool, a word, and search; both base paths | **pass** | `phase2-first-session.spec.ts` (DEF-27 at root and at Pages, 5 widths): no worker served the page as it loaded; "Ready offline" with a controller; by taps only the Academy, "One full square", M210, the BAUER, "One-step polish", Fix It, fix-01, "Machine polishing, one-step", Search "jerking" and Enter; every `/assets/` response after airplane mode `fromServiceWorker: true`, 0 failed requests, never "did not load". New in this pass: the marker log never says "Saving for offline" or "Saved, reopen app" after "Ready offline" |
| 3 | An update: a second version built, the banner shows, nothing takes over until Update now, never while a job is active; both base paths | **pass** | `phase2-update.spec.ts` (9 tests x 5 widths) and `phase2-update-first-session.spec.ts` (new, 5 tests x 5 widths), each on its own static host that swaps in a second real build (`0.1.0-qa-second-build`). Later launch, both bases: the banner, then 3 s, taps, Later, and a reload never take over; a double tap on Update now reloads once; the new copy works offline and no longer holds the old code. First session (DEF-30), both bases: Update now and a double tap each reload exactly once into the new version, "Updated", "Ready offline", offline taps work. A running stage (a job in progress with no `pausedAt`): no banner, nothing taken over; in the first session Update now is refused in words, and when another tab hands the page to the new version nothing reloads through 3 s and two taps; paused, the next tap reloads once; the job row is untouched. Customer View on, first session: no notice at all and no reload after the takeover; Customer View off, the next tap reloads once. Two tabs in their first session: Update now in one reloads both, each once. The job hooks are the app's own (`updateBlocker` in `src/core/pwa.ts` reads the jobs table and the settings row); there is no Job Runner until Phase 3 |
| 4 | `npm run check`, both builds, `npm run test:e2e` (full) | **pass** | Check, start of pass: exit 1, `Tests 1 failed \| 1436 passed (1437)`, the one failure DEF-28's `it.fails` ("Expect test to fail"). Check, end: **exit 0**, `Test Files 74 passed (74)`, `Tests 1439 passed (1439)`, no expected fail left. Both builds exit 0, no chunk warning, the service worker guard silent (passed). e2e full: **exit 0**, `Running 1583 tests using 3 workers`, `1543 passed`, `40 skipped` (the crawl runs at 375 px only), JSON `expected 1543, unexpected 0, flaky 0`, 28.4 min; every Phase 1 suite passes |
| 5 | Lighthouse mobile | **pass** | Mobile Home **0.94, 0.93, 0.91, 0.92, 0.91** (LCP 2.64 to 2.96 s, TBT 80 to 141 ms, CLS 0.001 to 0.008); fix-01 **0.90, 0.93, 0.92** (TBT 138 to 242 ms); `lesson-l6-01-tesla` **0.94**; the moved Hybrid Ceramic Wax page **0.90** (LCP 3.12 s; it and the first fix-01 run sit on the 0.90 line, the VM noise pass 4 measured); accessibility and best practices 1.00 on every run; desktop 1.00. Precache **33 entries, 2,533.98 KiB** at `/` and 2,534.46 KiB at `/aurigen-directory/` (pass 4: 2,532.97 and 2,533.44). Largest file `assets/vendor-*.js` 470,219 bytes (22% of the 2 MiB per-file limit); `search-index-*.js` 424,634; `content-lesson-*.js` 354,756; the app code `index-*.js` 236,248 (pass 4: 235,500) |
| 6 | Content truth audit | **pass** | Only the four DEF-28 product files changed under `content/` since pass 4, and `knowledge/` did not change (hash snapshot). Every pass 1 to 4 rule re-ran on 599 items inside `npm run check`; the 87 sampled numbers pass; search cases 101 of 101. The move, line by line against pass 4's build: every sentence of the four old `labelNotes` is now in `labelNotes` (the label's words) or a `notes` line with its own status; no number changed; Blue Magic's two house numbers left the job lines too and now sit only in a verify note, which matches FC-78 ("unconfirmed"). Details below |
| 7 | Accessibility | **pass** | axe-core 4.14, scratch sweep: `pages checked: 30; total axe violations: 0`: the ten product pages in play (DEF-20, DEF-28), "Update ready" in a first session, the refusal line, "Updated" after the DEF-30 reload, the "Saved, reopen app" marker, and offline "Offline, saved" with the "Offline copy saved" notice, at 375 and 1440 px |
| 8 | Lando's 15-point audit on every changed file | **pass** | 5 app files and 3 app test files, 4 content files, QA's 6; details below |

## Commands and key output

| Command | Result | Key lines |
|---|---|---|
| `npm run check` (start of pass) | exit 1, 66 s | content `599 items (quickcard 14, drill 31, equipment 22, fixnode 89, flashcard 129, lesson 57, product 21, quizquestion 167, sop 31, glossaryterm 38), 0 customer-safe, 0 superseded left out, 6 sign-off files, 62 synonym groups, 272 search documents, search cases 101 of 101 passed`; `Test Files 1 failed \| 73 passed (74)`, `Tests 1 failed \| 1436 passed (1437)`: `DEF-28 ... Error: Expect test to fail` |
| `npm run build` | exit 0, 20.6 s | no chunk warning; `index 236.24 kB`, `vendor 470.21 kB`, `search-index 424.63 kB`, `content-lesson 354.75 kB`; `precache 33 entries (2533.98 KiB)`; the service worker guard silent (passed); `dist/sw.js`: the `SKIP_WAITING` listener, `s.clientsClaim()`, exactly one `skipWaiting()` (inside the listener) |
| `VITE_BASE=/aurigen-directory/ npx vite build --outDir .cache/pages-dist --emptyOutDir` | exit 0, 2.9 s | `precache 33 entries (2534.46 KiB)`; `index.html` links `/aurigen-directory/manifest.webmanifest` and preloads only `rolldown-runtime` and `vendor` |
| `PW_SKIP_BUILD=1 npx playwright test` the first-session, update, and offline specs, before any QA change | exit 1 by design, 2.6 min | `55 passed`, `15 failed`: every one of the 15 is a known-defect test reporting `Expected to fail, but passed` (DEF-29 x 5 widths, DEF-30 x 5 widths x 2 bases) |
| Mutation check: `src/core/pwa.ts` changed in two scratch copies, both built, the update specs run against each at 375 px | ran | M1, the quiet-moment guard skipped (reload at once on a takeover): the stage test fails at both bases and the Customer View test fails (the page reloads under the test). M2, pass 4's behavior (no reload on a worker-to-worker change): 8 tests fail (DEF-30 x 4, the stage test x 2, Customer View, two tabs), each at "the page reloads into the new version". The real code passes all 15. So the new tests catch both a missing reload and a reload that ignores the job |
| `npx tsc --noEmit -p tsconfig.node.json`; `npx oxlint --deny-warnings` | exit 0 | clean (one `valid-expect` message on QA's first draft fixed) |
| `npm run test:e2e` (full, both builds) | **exit 0**, 28.4 min | `Running 1583 tests using 3 workers`; `1543 passed`, `40 skipped`; JSON `expected 1543, unexpected 0, flaky 0`. The 40 runs new since pass 4: the second DEF-30 test per base, the first-session update suite, and DEF-29 in Customer View. Every first session's marker log, at 5 widths and both bases: `Saving for offline > Saved, reopen app > Saved, reopen app [served] > Ready offline [served] > Offline, ready [served]`. The Phase 1 first-visit test ran under its old title here (the run had loaded the file before QA renamed it); the renamed test then ran on its own: `5 passed` at 5 widths |
| Lighthouse 13.5.0 (mobile Home x5, fix-01 x3, a lesson, a moved product, desktop) | ran | numbers in check 5 |
| axe-core 4.14 (WCAG 2.0 to 2.2 A and AA, best practice), scratch sweep | ran | `pages checked: 30; total axe violations: 0` |
| `npm run check` (final) | **exit 0**, 70.5 s | `Test Files 74 passed (74)`, `Tests 1439 passed (1439)`; `npx vitest run tests/unit`: `Test Files 13 passed (13)`, `Tests 739 passed (739)`; the content audit files (`phase2-truth`, `phase2-numbers`, `phase2-counts`, `search-cases`): `284 passed` |
| Scratch probes (Playwright library on QA's static host; `vite preview` on 4180 and 4181) | ran | the marker through 16 first sessions at both bases, 375 and 1440 px; a hard-reloaded page when a new version deploys; 0 em or en dashes in 941 project files |

Nothing was left running: Playwright stopped its two servers; QA's static hosts close after each test; the scratch previews on 4180 and 4181 were stopped, and ports 4173, 4174, 4180, and 4181 refuse connections. The two mutant copies lived in the scratch folder and were deleted after the check. No file outside QA's own changed during the pass (hash snapshot of `src/`, `content/`, `scripts/`, `docs/`, `knowledge/`, `public/`, `tests/`, and the root config files at the start and the end: only `tests/` and this report moved, plus `src/generated/`, the content build's gitignored output). No git command was run.

## The recheck of each open defect

| ID | Pass 4 | What the owner changed | Recheck evidence | Pass 5 |
|---|---|---|---|---|
| DEF-30 | fix-before-deploy, app-engineer | `src/core/pwa.ts`: the page remembers which worker served it (at boot, then at every `controllerchange`); one worker replacing another marks the reload pending and asks the quiet-moment guard, the same path as `onNeedReload`; a first claim (no worker before) only marks the copy ready; a guard after the `await` lets only one of the two signals reload. Four new unit tests in `src/core/pwa.test.ts` | The known-defect test reported `Expected to fail, but passed` at 5 widths x 2 bases. Flipped to two normal tests (one tap, a double tap, each exactly one reload, then offline taps), plus the new first-session suite (a running stage, Customer View, two tabs, a hard-reloaded page). Mutation check: the tests fail when the reload is missing and when it skips the guard | **closed** |
| DEF-29 | later, app-engineer | `src/app/status.ts`: `statusWords` takes the offline copy table; `savedNotServing` reads "Saved, reopen app" online and "Offline, saved" offline (17 and 14 characters, so the top bar never wraps). `bannerRules.ts`: a new `offlineSaved` notice; `BannerStack.tsx`: "Offline copy saved: The offline copy of the app is saved on this phone. If a page does not open, tap Try again and it opens from the saved copy. Closing the app and opening it again also works." `StatusChip.tsx` passes the state | The known-defect test reported `Expected to fail, but passed` at 5 widths. Flipped and made stricter: after a hard reload, 5 s of "Saved, reopen app" (never "Saving for offline"), the top bar the same height as with "Ready offline" at every width in Shop density, offline "Offline, saved" with the notice word for word and no "not saved yet", then the Academy fails, one Try again opens it from the copy, the notice goes and the marker says "Offline, ready". New: in Customer View the same state shows no marker, no notice, and no internal element, online or offline | **closed** |
| DEF-28 | later, content-curator | Four products (Blue Magic v1 to 2, Bug & Tar v2 to 3, Hot Shine v2 to 3, Hybrid Ceramic Wax v3 to 4): every house line moved to a house note, every unconfirmed number to a verify note; `labelNotes` keeps the label's words (Blue Magic has none, so it has no `labelNotes`) | The `it.fails` failed as designed at the start of the pass. Flipped to three tests: no item's `labelNotes` holds a house line, a pending row, a name, a doubt, or a "read your bottle" line (the rule catches all four old paragraphs and none of the six current ones); the four versions and their house and verify notes; the label words word for word | **closed** |
| DEF-27 | closed in pass 4 | none since | its tests pass at 5 widths and both bases (check 2) | closed |
| DEF-20 | closed in pass 4 | none since | its four tests pass | closed |
| DEF-22 | later, troubleshooter (Phase 4) | none | 101 search cases, 101 pass; the parked pair still pinned in `search-cases.test.ts` | **open** (later, by design until Phase 4) |

## New defects (Phase 2, pass 5)

None.

Also seen, not filed:
- Between the save and the takeover in a first session, the marker reads "Saved, reopen app" for 1 to 3 ms before "Ready offline" (16 first sessions probed at both bases, 375 and 1440 px; for example `506ms Saved, reopen app`, `507ms Saved, reopen app [served]`, `508ms Ready offline [served]`). Too short to see; the marker is a polite live region, so a screen reader may say it once. The words are true at that moment. If a phone's takeover lags, the phone check below shows it.
- Pass 4's hard-reload case, rerun with the fixes: a page the saved copy does not serve, when a new version deploys, is taken by it at once (no old-version page to wait for), shows no "Update ready" and no "Installing the update", says "Ready offline", and keeps working; it runs the old code until the next launch, which says "Updated". Shift + reload on the PC only. Now a test (`phase2-update-first-session.spec.ts`), so a change in that path shows up.
- `scripts/pwa/swGuard.ts` is still in a folder `docs/OWNERSHIP.md` does not name (pass 4's one line for the architect).
- QA's Phase 1 test "the first visit is not controlled by the service worker until the next load (prompt mode, clientsClaim false)" still described the Phase 1 setting. Renamed and made to check today's rule: the first page is not served as it loads, the install takes it with no reload, the next load is served from the start.

## Content audit, pass 5

Only `content/products/` changed (four files), and `knowledge/` did not change (hash snapshot against pass 4's closing one). Every rule in the earlier tables re-ran on 599 items inside `npm run check` and passed; the 87 sampled numbers passed in `phase2-numbers.test.ts`.

| Product | Version | Before (pass 4 build) | Now |
|---|---|---|---|
| `product-blue-magic-headlight-restorer` (house) | 1 to 2 | `labelNotes`: the two minutes and the month are house numbers, no source confirms them, the bottle wins; the job lines said "about two minutes per light" and "yellow again in about a month" | no `labelNotes` (no label was read, FC-78). Jobs: "Headlight refresh by hand, then wipe clean", "Sell it as a refresh." `notes`: about two minutes per light, about a month without a sealant, both house numbers no source confirms (verify); read the directions on your bottle, the bottle wins (house) |
| `product-meguiars-bug-tar` | 2 to 3 | `labelNotes`: Meguiar's method, then the house one-minute dwell no label confirms, then the can wins | `labelNotes`: Meguiar's method only. `notes`: the one-minute house dwell no label confirms (verify, FC-45); read the dwell time on your can, the can wins (house) |
| `product-meguiars-hot-shine` | 2 to 3 | `labelNotes`: the safety data sheet lines, the trigger bottle not checked, the directions not read "so the house rule stands", read your bottle | `labelNotes`: the safety data sheet lines only. `notes`: house rule, spray the applicator, never on a motorcycle (house); the directions and the two-wheeler line not read, read your bottle (verify, FC-31); the safety data sheet lines are for the aerosol cans, the trigger bottle not checked (verify, FC-32) |
| `product-meguiars-hybrid-ceramic-wax` | 3 to 4 | `labelNotes`: Meguiar's method and two coats, then the house next-day coat, the house uses, the cold line, the bottle wins | `labelNotes`: Meguiar's method and two coats only. `notes`: the next-day coat counts as the second (house, FC-05); spraying on the wet car is Meguiar's, the water-spot and bike-chrome uses are house uses Meguiar's has not confirmed (verify, FC-49, FC-87); below about 50 F garage it or move the date, no label number (verify, FC-51); the bottle wins (house) |

Every sentence of the four old paragraphs is accounted for, and no number changed. One sentence is new in words, not in fact: "The safety data sheet lines are for the aerosol cans" (both sources on the item are aerosol data sheets, FC-32). Blue Magic's numbers are now verify, not house: stricter, and what FC-78's verdict ("unconfirmed") asks.

## Lando's 15-point audit on the changed files (pass 5)

Files: the app-engineer's `src/core/pwa.ts` (352 lines), `src/app/status.ts` (41), `src/app/StatusChip.tsx` (28), `src/app/banners/bannerRules.ts` (102), `src/app/banners/BannerStack.tsx` (235), and their tests `src/core/pwa.test.ts`, `src/app/__tests__/bannerRules.test.ts`, `src/app/__tests__/shellState.test.ts`; the content-curator's four product files; QA's 6 (below).

| Tier | Result | Notes |
|---|---|---|
| 1 Structure | pass | both `tsc` programs clean, `oxlint --deny-warnings` clean, both builds compile; every changed file ends with a newline and a closed block; the four YAML files parse (the content build) |
| 2 Logic | pass | the `updating` state now has its way out in a first session (a worker-to-worker `controllerchange` reloads at the next quiet moment); a first claim never reloads; the reload guard runs after the `await`, so two signals reload once. `statusWords` covers all three offline copy states online and offline; `pickBanners` gives `savedNotServing` its own notice, keeps its `switch` default, and falls back to the old rule when the state is not given. The offline notice promises Try again, and both Try again paths (a content page and search) reload into the saved copy (`src/core/freshPage.ts`) |
| 3 Journey | pass | first visit to Ready offline to an update to Update now to Updated, in one document, at both bases; the same through a running stage, Customer View, and a second tab; a hard-reloaded page to "Saved, reopen app" to offline to Try again to "Offline, ready" |
| 4 Runtime | pass | 0 page errors in the new browser tests; `readController` is wrapped and counts an unreadable container as no worker; no storage access added; no `window.self`, `window.top`, `btoa`, `eval`, `innerHTML` |
| 5 Build rules | pass | no file over 400 lines (largest changed app file `src/core/pwa.ts` 352; largest QA file `tests/unit/phase2-truth.test.ts` 394); the developer panel already shows the offline copy state |

0 em or en dashes in 941 project files; no secret, key, or address added.

## Tests added or changed by QA (pass 5)

| File | Change |
|---|---|
| `tests/unit/phase2-truth.test.ts` | DEF-28 flipped to three tests: no `labelNotes` on any item holds a house line, a pending row, a name, a doubt, or a "read your bottle" line; the four versions and their house and verify notes (with FC-78: Blue Magic's numbers in no job line); the label words word for word |
| `tests/persistence/phase2-first-session.spec.ts` | DEF-29 flipped and made stricter (the words, the top bar height at every width, the notice word for word, Try again heals, the notice goes); new: the same state in Customer View shows nothing; the DEF-27 test also checks the marker never goes back to saving after "Ready offline" |
| `tests/persistence/phase2-update.spec.ts` | DEF-30 flipped to two normal tests per base (one tap, a double tap, each one reload); the helpers moved to `tests/fixtures/update.ts` |
| `tests/persistence/phase2-update-first-session.spec.ts` (new) | 5 tests x 5 widths: a running stage and another tab's takeover at both bases, Customer View, two first-session tabs, a hard-reloaded page when a new version arrives |
| `tests/fixtures/update.ts` (new) | the update measures shared by both update suites, plus `countLoads`, `skipWaitingFromOutside` (what another tab's Update now does), and `expectSecondVersion` |
| `tests/persistence/persistence.spec.ts` | the Phase 1 first-visit test renamed and made to check the D1 amendment's rule (see "Also seen") |

Known defects in QA's tests: none. DEF-22 is pinned as parked in `search-cases.test.ts`.

## Defect register, Phase 2 (current, after pass 5)

| ID | Severity | Owner | File | One line | Pass 1 | Pass 2 | Pass 3 | Pass 4 | Pass 5 |
|---|---|---|---|---|---|---|---|---|---|
| DEF-22 | later | troubleshooter, with business-customer in Phase 4 | `tests/search-cases.yaml` | Two knowledge base 24 price cases parked until price items have pages | new, open | open | open | open | open (parked by design) |
| DEF-30 | fix-before-deploy | app-engineer | `src/core/pwa.ts` | First session: Update now installed and took the page, but the page never reloaded | | | | new, open | **closed** |
| DEF-29 | later | app-engineer | `src/app/status.ts`, `src/app/banners/bannerRules.ts`, `BannerStack.tsx` | Saved but not serving the page: "Saving for offline" for good, and offline "no offline copy yet" | | | | new, open | **closed** |
| DEF-28 | later | content-curator | four product files | House lines inside `labelNotes` (Blue Magic, Bug & Tar, Hot Shine, Hybrid Ceramic Wax) | | | | new, open | **closed** |
| DEF-27 | fix-before-deploy | app-engineer (architect: D1 amendment) | `vite.config.ts`, `src/core/pwa.ts`, `src/core/freshPage.ts` | First session offline: lessons did not open and Try again said "no signal" | | | new, open | closed | closed |
| DEF-20 | later | content-curator | six product files | Pending rows and house lines in `labelNotes` | new, open | open | open | closed | closed |
| DEF-16 to DEF-19, DEF-21, DEF-23 to DEF-26 | | | | Closed in passes 2 and 3; their tests pass in this run | | | | closed | closed |

The Phase 1 register (DEF-01 to DEF-15) is below, all closed; every test written for them passed in the full run.

## What only the phone can answer (pass 5 update)

Pass 4's two checks stand, with the words the app now uses:

- [ ] The first launch offline (DEF-27): on a phone that has never opened the app (or delete the Home Screen app first), install from the Pages link, open from the icon with signal, wait for **Ready offline**, then 11 more minutes with the app open. Airplane mode without closing the app. The Academy, "One full square", Fix It, the jerking fix, "Machine polishing, one-step" in its Related list: each opens. Does the top ever stay on "Saved, reopen app" (the phone did not take the page over; reopening the app fixes it, and Try again works meanwhile)? ______
- [ ] The update in the first session (DEF-30): open the app for the first time from the icon and keep it open; the lead deploys; switch away and back. "Update ready" shows; tap Update now: the app reloads by itself and says "Updated". ______

# Phase 2 gate, pass 4 (recheck, 2026-10-12, about 10:55 to 12:05 UTC, kept as written)

## Verdict

**Gate: not passed. 4 defects are open: 0 blocks-gate, 1 fix-before-deploy, 3 later.** Both defects pass 3 left open are closed: DEF-27 (the first session offline) and DEF-20 (the product notes). The brief asked QA to attack DEF-27's fix with a real update, and that found DEF-30: in the first session, "Update now" installs the new version but the page never reloads. Two smaller ones are new (DEF-29, DEF-28), and DEF-22 stays parked. The full browser run is green: `1503 passed`, 0 unexpected, 0 flaky, with DEF-29 and DEF-30 failing as expected.

- **Fix before deploy.** DEF-30 (app-engineer): if an update arrives while the app is open for the very first time (the first visit, or the first launch from the Home Screen icon), tapping "Update now" installs it and the new version takes the page, but the page never reloads. The notice says "Installing the update. The app reloads into the new version at the next quiet moment, never during a job." and stays. The page runs the old code under the new worker, whose saved copy no longer holds the old version's files, until the app is closed. The plugin reloads only when a worker served the page when it loaded, which is never true in a first session. It is older than DEF-27's fix: with `clientsClaim` taken out of both builds, the same steps end on the same notice. Every later launch reloads into the update correctly, and the job guard holds in every case.
- **Later.** DEF-29 (app-engineer): when the copy is saved but does not serve the open page (after a hard reload, Ctrl+Shift+R on the PC; on the iPhone only if the first launch is not taken over, which is the open phone check), the marker says "Saving for offline" for the whole session and, offline, the notice says "This phone has no offline copy of the app yet". Both untrue; Try again opens everything from the copy. DEF-28 (content-curator): four more products mix house lines into `labelNotes`, which D2's amendment keeps for the label's own words; nothing reads as settled. DEF-22 (troubleshooter, Phase 4): parked by design.

What held, with evidence below: the first session in airplane mode with no reload opens a lesson, a product, a tool, a word, a procedure, and search by taps at five widths and both base paths, every piece served by the saved copy (Playwright's `fromServiceWorker`), and the marker never said "Ready offline" while no worker served the page. A page the copy does not serve heals with one Try again offline. A new version waits: the banner shows, and time, taps, Later, and a reload never swap it in; a double tap on "Update now" reloads once into the new version, whose copy works offline and no longer holds the old code. A running stage hides the banner and blocks the update; a stage that starts after the banner showed makes "Update now" refuse in words; Customer View shows no notice and blocks it too; the job row is untouched by the update. Lighthouse mobile on Home is 0.91 to 0.94. axe found 0 problems on 30 screens. The content passes every truth rule on the same 599 items; the six moved products lost no fact.

## Lando, in plain words

- The two things from last time are fixed. The first time you open the app, the saved copy now takes over right away: when the top says "Ready offline", you can switch on airplane mode without closing the app, and every lesson, procedure, product, tool, word, and search opens. Six product pages now show your house rule, the maker's line, and "Lando decides" as separate lines, each with its own badge.
- One thing to fix before this goes on your phone. If a new version comes out while you have the app open for the very first time and you tap Update now, the app says "Installing the update" and then just sits there. Close the app and open it again and you have the new version; everything else keeps working meanwhile, and it never interrupts a job. Every later time, Update now works as it should.
- Two small ones for later: after a hard refresh on the computer, the top says "Saving for offline" and, with no signal, "no offline copy yet", though the copy is there (Try again opens everything); and four product pages still put a house line inside the label paragraph, worded so nothing reads as settled.
- Nothing here needs your answer. Two phone checks at the end of this section.

## The brief's checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | DEF-27 and DEF-20 closed; their known-defect tests flipped | **pass** | DEF-27: the owner reports its `test.fail` "Expected to fail, but passed" at 5 widths; QA removed it and wrote a stricter normal test that passes (check 2). DEF-20's `it.fails` failed as designed at the start of the pass (`Error: Expect test to fail`); flipped to four normal tests over all six moved products |
| 2 | DEF-27 attacked: first visit, Ready offline, airplane mode with no reload, then a lesson, an SOP, a product, a tool, a word, and search; both base paths | **pass** | `phase2-first-session.spec.ts`, 2 tests x 5 widths (`/` on 4173, `/aurigen-directory/` on 4174): no worker served the page as it loaded; "Ready offline" then `controller` set (annotation `controlled before airplane mode=true` at all 10); none of the lesson, procedure, product, tool, or word pieces fetched before airplane mode; then by taps only: the Academy, "One full square" (h2 "The steps"), from its Related list M210 (product), the BAUER (tool), "One-step polish" (word); Fix It, fix-01, its Related "Machine polishing, one-step" (procedure); Search "jerking", Enter, fix-01. Every `/assets/` response after airplane mode `fromServiceWorker: true`, 0 failed requests, never "did not load", never a Try again; the marker log never shows "Ready offline" or "Offline, ready" without a controller. Scratch probe: two tabs opened at once on deep links (a lesson, a word), both taken over, both work offline, at both base paths |
| 3 | The belt and braces: Try again reloads into the saved copy | **pass** | `phase2-first-session.spec.ts` at 5 widths: after a hard reload (CDP `Page.reload ignoreCache`, the same as Shift + reload) the page has no controller and the registration is active; airplane mode, the Academy: "This page did not load. Check the signal, then tap Try again."; one Try again: one reload, the Academy list, a controller, "Offline, ready", never "no signal" |
| 4 | An update: a second version built, the banner shows, nothing takes over until Update now, never while a job runs; both base paths | **pass, except DEF-30** | `phase2-update.spec.ts` (new), 8 tests x 5 widths, each on its own static host that swaps in a second real build (the same app with version `0.1.0-qa-second-build`, built by `tests/fixtures/second-version.config.ts`). Taken over is measured three ways: a controller change, a reload, and the app code the page runs. Both bases: the banner shows with "It installs only when you tap Update now, never during a job."; after 3 s, three taps (Fix It, fix-01, its Related procedure, a lazy piece), Later, and a reload: same document until the reload, 0 controller changes, the first version's code, the update still waiting; a double tap on Update now: exactly one reload, "Updated: This phone now runs version 0.1.0-qa-second-build.", "Ready offline", the old index chunk gone from the copy, the new one in it, offline taps work. Both bases: a running stage (a job in progress with no `pausedAt`, the app's own rule): the update downloads, no banner and no Update now for 2.5 s, taps, nothing taken over; paused and reopened: the banner, Update now, the new version, and the job row exactly as it was. Root, a later launch: the banner showed, then a stage started: Update now says "A stage is running. The update waits until the job is paused or done." and nothing changes for 3 s; paused: one tap installs and reloads. Root: Customer View on: no notice at all, nothing taken over; off: the banner. **DEF-30**: the same live update in the first session, at both bases: Update now takes the page and never reloads (`test.fail`, 10 runs) |
| 5 | `npm run check`, both builds, `npm run test:e2e` (full) | **pass** | Check, start of pass: exit 1, `Tests 1 failed \| 1425 passed (1426)`, the one failure DEF-20's `it.fails` ("Expect test to fail"). Check, end: **exit 0**, `Test Files 74 passed (74)`, `Tests 1429 passed \| 1 expected fail (1430)` (the expected fail is DEF-28). Both builds exit 0, no chunk warning, the service worker guard silent (passed). e2e full: **exit 0**, `Running 1543 tests using 3 workers`, `1503 passed`, `40 skipped` (the crawl runs at 375 px only), JSON `expected 1503, unexpected 0, flaky 0` (15 of the 1503 are DEF-29 and DEF-30 failing as expected), 27.1 min; every Phase 1 suite passes |
| 6 | Content truth audit | **pass** (DEF-28 later) | Only the six product files changed under `content/` (hash snapshot against pass 3's closing one). Every pass 1 to 3 rule re-ran on 599 items inside `npm run check`; the 87 sampled numbers pass. The move, line by line against pass 3's build: every sentence of the six old `labelNotes` is now either in `labelNotes` (the label's words) or a `notes` line with its own status; nothing dropped, two lines reworded to match `sop-wheels-tesla` and the source note ("damage or discoloration"). Details below |
| 7 | Lighthouse mobile; precache; largest file | **pass** | Mobile Home **0.94, 0.93, 0.94, 0.91, 0.92** (LCP 2.94 to 2.97 s, TBT 58 to 161 ms, CLS 0.001 to 0.008); `lesson-l6-01-tesla` **0.92**; the moved wheel cleaner page **0.92**; fix-01 **0.93, 0.86, 0.88, 0.92, 0.94, 0.92, 0.88, 0.91** (median 0.915; see "Also seen": pass 3's build, run in the same minutes, scored 0.94, 0.89, 0.89, so the dips are this VM, not the change); accessibility and best practices 1.00 on every run; desktop 1.00. Precache **33 entries, 2,532.97 KiB** at `/` and 2,533.44 KiB at `/aurigen-directory/` (pass 3: 2,531.01). Largest file `assets/vendor-*.js` 470,219 bytes (22% of the 2 MiB per-file limit); `search-index-*.js` 424,625; `content-lesson-*.js` 354,756; the app code `index-*.js` 235,500 (pass 3: 234,406) |
| 8 | Customer View and the rest of Phases 1 and 2 | **pass** | the full run's privacy suites (all 272 content pages, also after every piece arrived), the crawl (0 dead ends), the v1 line at 5 widths, the Phase 1 suites; new: Customer View on during an update shows no notice and blocks it |
| 9 | Lando's 15-point audit on every changed file | **pass, except Tier 2 (DEF-30)** | 10 app files, 6 content files, 3 docs (`DECISIONS.md`, `BLUEPRINT.md`, `OWNERSHIP.md`), QA's 8; details below |

## Commands and key output

| Command | Result | Key lines |
|---|---|---|
| `npm run check` (start of pass) | exit 1, 66.7 s | content `599 items (quickcard 14, drill 31, equipment 22, fixnode 89, flashcard 129, lesson 57, product 21, quizquestion 167, sop 31, glossaryterm 38), 0 customer-safe, 0 superseded left out, 6 sign-off files, 62 synonym groups, 272 search documents, search cases 101 of 101 passed`; `Test Files 1 failed \| 73 passed (74)`, `Tests 1 failed \| 1425 passed (1426)`: `DEF-20 ... Error: Expect test to fail` |
| `npm run build` | exit 0, 19.9 s | `✓ 390 modules transformed`; no chunk warning; `index 235.50 kB`, `vendor 470.21 kB`, `search-index 424.62 kB`, `content-lesson 354.75 kB`; `precache 33 entries (2532.97 KiB)`; the service worker guard passed (silent); `dist/sw.js`: `self.addEventListener("message",s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()}),s.clientsClaim(),s.precacheAndRoute(...)` and no other `skipWaiting()` |
| `VITE_BASE=/aurigen-directory/ npx vite build --outDir .cache/pages-dist --emptyOutDir` | exit 0 | `precache 33 entries (2533.44 KiB)`; `index.html` links `/aurigen-directory/manifest.webmanifest` and preloads only `rolldown-runtime` and `vendor` |
| `npx vite build --config tests/fixtures/second-version.config.ts --outDir .cache/qa-v2-root --emptyOutDir` (and at the Pages base) | exit 0, 3.8 s | the second version: a new `index-*.js` (reads `0.1.0-qa-second-build`), a new `index.html` revision, a different `sw.js`, everything else the same file names; the guard passed |
| `npx tsc --noEmit -p tsconfig.node.json`; `npx oxlint --deny-warnings` | exit 0 | clean (two `valid-expect` messages on QA's first draft fixed) |
| `PW_SKIP_BUILD=1 npx playwright test` the first-session, update, and offline specs at 5 widths | exit 0, 3.6 min | `70 passed` (15 of them DEF-29 and DEF-30 failing as expected); the expected failures fail on the right line (JSON: DEF-29 `Received string: "Saving for offline"`; DEF-30 `the page reloads into the new version ... Expected: >= 1, Received: 0`) |
| `npm run test:e2e` (full, both builds) | **exit 0**, 27.1 min | `Running 1543 tests using 3 workers`; `1503 passed`, `40 skipped`; JSON `expected 1503, unexpected 0, flaky 0`; Home before any content piece: load 174 to 260 ms, FCP 84 to 168 ms, 0 lazy requests before either, at 5 widths; offline copy 33 entries at 5 widths |
| Lighthouse 13.5.0 (mobile Home x5, fix-01 x5, a lesson, a moved product, desktop; then fix-01 A/B x3 against pass 3's `dist/`) | ran | numbers in check 7 |
| axe-core 4.14 (WCAG 2.0 to 2.2 A and AA, best practice), scratch sweep | ran, 28 s | `pages checked: 30; total axe violations: 0`: the ten product pages in play (DEF-20, DEF-28), "Update ready", the refusal line, "Installing the update", "Updated", and the offline notice in the saved-but-not-serving state, at 375 and 1440 px |
| `npm run check` (final) | **exit 0**, 64.8 s | `Test Files 74 passed (74)`, `Tests 1429 passed \| 1 expected fail (1430)` (DEF-28); `npx vitest run tests/unit`: `Test Files 13 passed (13)`, `Tests 736 passed \| 1 expected fail (737)` |
| Scratch probes (Playwright library on QA's static host; `vite preview` of copies on 4180 and 4181) | ran | two tabs on deep links in a first session, both taken over and working offline at both bases; a hard reload then Try again offline; the live update in a first session with and without `clientsClaim` (DEF-30 is older than the fix); 0 em or en dashes in 944 project files |

Nothing was left running: Playwright stopped its two servers; QA's static hosts close after each test; the scratch previews on 4180 and 4181 were stopped, and ports 4173, 4174, 4180, and 4181 refuse connections. Lighthouse and axe-core ran from the scratch folder. No file outside QA's own changed during the pass (hash snapshot of `src/`, `content/`, `scripts/`, `docs/`, `knowledge/`, `public/`, `tests/`, and the root config files at the start and the end; only `src/generated/`, the content build's gitignored output, moved). No git command was run.

## The recheck of each pass 3 defect

| ID | Pass 3 | What the owner changed | Recheck evidence | Pass 4 |
|---|---|---|---|---|
| DEF-27 | fix-before-deploy, app-engineer | architect: D1 amendment 2026-10-12 (generateSW, prompt mode, `clientsClaim` true, `skipWaiting` false), BLUEPRINT 3.5 and 3.8 one line each. app-engineer: `vite.config.ts` `clientsClaim: true`; `scripts/pwa/swGuard.ts` (new) fails the build if `sw.js` calls `skipWaiting()` outside the SKIP_WAITING listener, lacks the listener, or never calls `clientsClaim()`; `src/core/pwa.ts` offline copy table (`notSaved`, `savedNotServing`, `ready`; "Ready offline" only when a worker serves the page); `src/core/freshPage.ts` Try again reloads when an active registration exists, before asking the network; the developer panel shows the table's state | The real `dist/sw.js`: the SKIP_WAITING listener, `s.clientsClaim()`, no bare `skipWaiting()`. `phase2-first-session.spec.ts` (check 2) at 5 widths and both bases, stricter than pass 3's test (no Try again allowed, every piece from the saved copy, the marker never ahead of the controller); the belt-and-braces test (check 3); the update tests (check 4) show the claim never swaps a waiting version in | **closed** (attacking it found DEF-30, which is older) |
| DEF-20 | later, content-curator | All six products whose `labelNotes` held a "(pending)" sentence (pass 3's report named only two; its `it.fails` checked every product): every house line, maker's line, and pending row moved to `Product.notes` with its own status; `labelNotes` keeps the label's words (absent where there is no label line); version +1 each | The `it.fails` failed as designed. Flipped to four tests: no `labelNotes` holds "(pending)" or "Lando decides"; every pending note is a verify line (8 of them); the six keep their pending row and their `labelNotes` name no house line, Tesla, or Lando; the Tesla rows are house, then the sourced manual line, then pending, in that order (wheel cleaner, compound), and the interior detailer and Tuff Stuff keep the manual line and the pending row; ten pinned facts survive the move. `phase2-pages.spec.ts`: every verify note carries its badge at 5 widths | **closed** (the same rule found DEF-28 on four other files) |
| DEF-22 | later, troubleshooter (Phase 4) | none | 101 search cases, 101 pass; the parked pair still pinned | **open** (later, by design until Phase 4) |

## New defects (Phase 2, pass 4)

### DEF-30 (fix-before-deploy, app-engineer): in the first session, "Update now" installs the update but the page never reloads

- **Files.** `src/core/pwa.ts` (`onNeedReload` is the only way into `reloadPending`); the plugin it relies on, `node_modules/vite-plugin-pwa/dist/client/build/register.js` (prompt mode: `wb.addEventListener("controlling", (event) => { if (event.isUpdate) onNeedReload ... })`) and `node_modules/workbox-window/src/Workbox.ts` line 119 (`this._isUpdate = Boolean(navigator.serviceWorker.controller)`, read once, at register).
- **What happens.** A first session is a page that loaded with no service worker (the first visit to the link, or the first launch from the icon). Since DEF-27's fix the first install takes that page, so a new version found later in the same session waits properly and the banner shows. On "Update now" the new worker activates and takes the page (a `controllerchange`), but workbox-window reports `isUpdate: false` for the whole session, so the plugin never calls `onNeedReload`, `reloadPending` stays false, and nothing reloads. The notice stays on "Installing the update. The app reloads into the new version at the next quiet moment, never during a job." on every screen; navigating does not help. The page keeps running the old code under the new worker, which deleted the old version's files from the saved copy when it activated, so a piece the deploy changed would fail once ("This page did not load") and Try again would reload into the new version (DEF-26's path, from the code; the second build here changes only the app code, so every content piece kept its name and opened). Closing and reopening the app shows "Updated" (the axe sweep's reload of the stuck page did exactly that).
- **Older than DEF-27's fix.** Scratch probe with `s.clientsClaim(),` deleted from both versions' `sw.js`: the first session is never controlled, the new version activates at once, the banner shows, and Update now ends on the same notice with no reload. Phase 1's tests never ran a live update in a first session.
- **Not affected.** Every later launch (the page loaded with a worker): the update tests above reload exactly once after Update now, at both bases, also when the update was found while the app was open (the "later launch" test). The job and Customer View guards hold in every case, so it never interrupts a job.
- **When it bites.** Lando installs from the Pages link, keeps the app open (or in the background), a merge deploys, he comes back (the app checks on return), sees "Update ready", taps Update now. During the build phases deploys are frequent; so is a first session for each new phone and each new hire.
- **Reproduce.** `npx playwright test tests/persistence/phase2-update.spec.ts -g "DEF-30"`: a `test.fail` at 5 widths and both bases, failing as expected ("the page reloads into the new version: Expected >= 1, Received 0"). By hand: `npm run build`, then `npx vite build --config tests/fixtures/second-version.config.ts --outDir .cache/qa-v2-root --emptyOutDir`; serve `dist/` from a static host with `Cache-Control: no-cache` and open it in a fresh Chrome profile; wait for "Ready offline"; replace the served files with `.cache/qa-v2-root/`; switch to another tab and back; tap Update now. DevTools Application: the new worker is activated and controls the page; the page never reloads.
- **Fix idea (owner's choice).** `pwa.ts` already listens to `controllerchange`. A change from one worker to another (the page had a controller before it) is an update taking over, whoever applied it: set `reloadPending` and call `reloadIfPending()`, the same as `onNeedReload`, so the quiet-moment guard still decides when. The first claim (no controller before) stays `PAGE_CONTROLLED` only and never reloads. Then QA flips the test.

### DEF-29 (later, app-engineer): saved but not serving the page, the app says it is still saving, and offline that there is no copy

- **Files.** `src/app/status.ts` (`statusWords` gets `offlineReady` only: `savedNotServing` reads as "Saving for offline", or "Offline" when offline), `src/app/banners/bannerRules.ts` and `BannerStack.tsx` (`offlineNotSaved`: "This phone has no offline copy of the app yet. Open it once with a signal and wait for Ready offline at the top.").
- **What happens.** DEF-27's table has three states; the marker and the notice show two. With the copy saved and not serving the page (`savedNotServing`), nothing is being saved, yet the marker says "Saving for offline" until the next launch, so waiting for "Ready offline", as the notice advises, never ends. With no signal the notice says there is no copy, while Try again opens every page from it. The developer panel already says it right: "Saved, not serving this page yet (Try again reloads into it)".
- **When it bites.** A hard reload (Ctrl+Shift+R or Shift + reload on the PC); on the iPhone, only if the first launch from the icon is not taken over (the DEF-27 phone check). Not in the normal first session in Chromium (the claim lands within the same moment as the save).
- **Reproduce.** `npx playwright test tests/persistence/phase2-first-session.spec.ts -g "DEF-29"` (`test.fail`, 5 widths). By hand: `npm run build`, `npx vite preview`, open `/`, wait for "Ready offline", Ctrl+Shift+R: "Saving for offline" for good; DevTools Network Offline: "Offline" and "Offline, and not saved yet".
- **Fix idea (owner's choice).** Pass `offlineCopy` to `statusWords` and `pickBanners`; for `savedNotServing` say what is true, for example "Saved. Reopen the app to use it offline." and, with no signal, "The offline copy is saved. Tap Try again on any page, or close and reopen the app."

### DEF-28 (later, content-curator): four products still hold house lines in `labelNotes`

- **Files and words.** `product-blue-magic-headlight-restorer` (house item): the whole paragraph is about the house numbers ("The two minutes per light and the month before they yellow again are house numbers. No label or maker source confirms them yet."), no label words. `product-meguiars-bug-tar`: "The house dwell is about one minute, but no label confirms that number." `product-meguiars-hot-shine`: "... so the house rule stands: spray the applicator, never on a motorcycle." `product-meguiars-hybrid-ceramic-wax`: "House plan: a whole-car coat the next day counts as the second coat on a freshly polished panel." and "Cold: below about 50 F, the house says garage the car or move the date. No label gives a number yet".
- **The rule.** D2 amendment 2026-10-12: `labelNotes` "now holds the label's own words only" (mixing in house policy is what knowledge base section 0 keeps apart); `src/schemas/README.md`, product pattern: "`labelNotes` is the label's own words, one paragraph, nothing else."
- **Truth impact.** None found: every sentence names its source in words, and three of the four items carry the page's unverified badge. The house lines just get no line status of their own.
- **Reproduce.** `npx vitest run tests/unit/phase2-truth.test.ts -t "DEF-28"`: an `it.fails` that passes while the four hold "house" in `labelNotes`.
- **Fix.** Move each house line into `notes` with `status: house`, each unconfirmed number with `status: verify`, keep the label's words in `labelNotes`, version +1. Then QA flips the test.

Also seen, not filed:
- A hard-reloaded page (no controller) when a new version deploys: the new worker has no client of the old one to wait for, activates at once, and with `clientsClaim` takes that page while it runs the old code; no reload follows (the same `isUpdate` rule as DEF-30). A changed piece then fails once and Try again reloads into the new version (DEF-26's path). Hard reload only; a running job is never reloaded.
- `scripts/pwa/swGuard.ts` is a new app-engineer file in a folder `docs/OWNERSHIP.md` does not name (`scripts/content/` is listed). One line for the architect.
- Pass 3's report named two products for DEF-20; six held a pending sentence. Its `it.fails` checked every product, and the content-curator moved all six.
- Lighthouse on fix-01 sits at the line on this VM: 0.86 to 0.94 over eight runs (median 0.915; TBT 109 to 244 ms). Run alternately in the same minutes, pass 3's build scored 0.94, 0.89, 0.89 and this build 0.92, 0.88, 0.91, so the change did not cost anything; pass 3 measured 0.92 twice on a quieter machine. Home stays 0.91 to 0.94. Worth watching when Phase 3 adds code to the first screen.

## Content audit, pass 4

Only `content/products/` changed (six files), and `knowledge/` did not change (hash snapshot against pass 3's closing one). Every rule in the earlier tables re-ran on 599 items inside `npm run check` and passed; the 87 sampled numbers passed in `phase2-numbers.test.ts`.

| Product | Version | Before (pass 3 build) | Now |
|---|---|---|---|
| `product-armor-all-extreme-tire-shine` | 2 to 3 | one paragraph: house method, the label's method, keep-off list, pending method, dry times, which bottle, not-for list, the stricter bike rule | `labelNotes`: keep-off list, dry times, not-for list (label). `notes`: house method (house), the label disagrees, 4 to 6 in or 8 to 12 in, do not wipe (sourced), "Lando decides which method the crew uses (pending)" (verify), which bottle is not recorded (verify), no tire shine on a motorcycle (house) |
| `product-armor-all-extreme-wheel-tire` | 3 to 4 | the label's directions, then brushes, the bike row, and the three Tesla rows | `labelNotes`: the label's directions only. `notes`: brushes are a house choice (sourced, as in `sop-wheels-tesla`), the bike row (verify, pending), Tesla house step (house), Tesla's manual and the warranty line (sourced), the pending row (verify) |
| `product-blazin-banana` | 2 to 3 | what Chemical Guys sells, house rule 5, pending | no `labelNotes`. `notes`: the Chemical Guys wax, not confirmed as this bottle (verify), house rule 5 (house), pending (verify) |
| `product-meguiars-quik-interior-detailer` | 2 to 3 | house wipe, screen line, Tesla manual, ingredients, pending | no `labelNotes`. `notes`: house wipe (house), screen-safe not confirmed (verify), Tesla's manual (sourced), ingredients not checked (verify), pending (verify) |
| `product-meguiars-ultimate-compound` | 2 to 3 | the Tesla house ladder, the manual, pending | no `labelNotes`. `notes`: house (house), Tesla's manual and the warranty line (sourced), pending (verify) |
| `product-tuff-stuff` | 2 to 3 | its job pending, Tesla manual, ingredients, Tesla pending | no `labelNotes`. `notes`: its job (verify, pending), Tesla's manual (sourced), ingredients not checked (verify), Tesla pending (verify) |

Every sentence of the six old paragraphs is accounted for. Two rewordings, both matching an existing source: "damage from cleaning products" became "damage or discoloration from cleaning products" (the item's own source note and `sop-wheels-tesla`), and the compound's warranty clause became its own sentence. No number changed. The sourced Tesla lines cite FC-16 and FC-38 sources already on each item; the sourced label lines cite FC-26 to FC-30 sources already on each item.

## Lando's 15-point audit on the changed files (pass 4)

Files: the app-engineer's `vite.config.ts`, `scripts/pwa/swGuard.ts` (new), `src/core/pwa.ts`, `src/core/freshPage.ts`, `src/features/settings/dev/StateReadouts.tsx`, and their tests `src/core/pwa.test.ts`, `freshPage.test.ts`, `swUpdateGuard.test.ts` (new), `contentLoadFailure.test.ts`, `searchLoadFailure.test.ts`; the content-curator's six product files; the architect's `docs/DECISIONS.md`, `docs/BLUEPRINT.md`, `docs/OWNERSHIP.md`; plus QA's 8 (below).

| Tier | Result | Notes |
|---|---|---|
| 1 Structure | pass | both `tsc` programs clean, `oxlint --deny-warnings` clean, both builds compile and the new build guard runs after `sw.js` is written; every changed file ends with a newline and a closed block; the six YAML files parse (the content build) |
| 2 Logic | **fail, DEF-30** | the offline copy table has a way into `ready` from both other states and its `switch` in the developer panel has a `default`; Try again reloads only when the reload has somewhere to land (an active registration or an answering address); the guard's three rules each have a failing fixture. But the `updating` state has no way out in a first session: its only exit is a reload that never comes (DEF-30). DEF-29: `savedNotServing` is shown with the words of the other two states |
| 3 Journey | pass | first visit to Ready offline to airplane mode to every content type and search, both bases; a hard-reloaded page to Try again to the saved copy; the update from banner to Later to reload to Update now to Updated, and through a running stage, a paused one, and Customer View |
| 4 Runtime | pass | 0 page errors in the new browser tests; `savedCopyInstalled` times out after 2 s and never throws; no storage access added; no `window.self`, `window.top`, `btoa`, `eval`, `innerHTML`; the guard reads only `sw.js` |
| 5 Build rules | pass | no file over 400 lines (largest changed app file `src/core/pwa.ts` 316; largest QA file `tests/persistence/phase2-update.spec.ts` 327); the developer panel shows the offline copy state |

0 em or en dashes in 944 project files; no secret, key, or address added.

## Tests added or changed by QA (pass 4)

| File | Change |
|---|---|
| `tests/unit/phase2-truth.test.ts` | DEF-20 flipped to four tests over the six moved products (no pending sentence in any `labelNotes`, every pending note verify, the Tesla rows in order, ten facts survive the move); new `it.fails` for DEF-28 |
| `tests/persistence/phase2-first-session.spec.ts` (new) | DEF-27's test, flipped and made stricter, at both base paths (no Try again allowed, every piece from the saved copy, the marker never ahead of the controller); the belt-and-braces Try again test; new `test.fail` for DEF-29 |
| `tests/persistence/phase2-offline.spec.ts` | DEF-27's `test.fail` removed (moved, flipped, to the file above) |
| `tests/persistence/phase2-update.spec.ts` (new) | 8 tests x 5 widths: a waiting update at both bases, a running stage at both bases, the guard on a later launch, Customer View; new `test.fail` for DEF-30 at both bases |
| `tests/fixtures/site.ts` (new) | a static host per test that swaps the served build (a deploy), `no-cache` like `vite preview` |
| `tests/fixtures/second-version.config.ts`, `second-version-build.ts` (new) | the second version: the real `vite.config.ts` with one change, the version the app reads; built at both bases into `.cache/` (gitignored) by Playwright's global setup, skipped when already built from the same first version |
| `playwright.config.ts` | `globalSetup` for the second version; `PAGES_URL` exported for the first-session test |

Known defects in QA's tests: DEF-28 (`it.fails`, unit), DEF-29 (`test.fail`, 5 widths), DEF-30 (`test.fail`, 5 widths x 2 bases). They pass while the defect is open and fail the day it is fixed; QA then flips them. DEF-22 is pinned as parked in `search-cases.test.ts`.

## Defect register, Phase 2 (current, after pass 4)

| ID | Severity | Owner | File | One line | Pass 1 | Pass 2 | Pass 3 | Pass 4 |
|---|---|---|---|---|---|---|---|---|
| DEF-30 | fix-before-deploy | app-engineer | `src/core/pwa.ts` | First session: Update now installs and takes the page, but the page never reloads; "Installing the update" stays | | | | new, open |
| DEF-29 | later | app-engineer | `src/app/status.ts`, `src/app/banners/bannerRules.ts`, `BannerStack.tsx` | Saved but not serving the page: "Saving for offline" for good, and offline "no offline copy yet" | | | | new, open |
| DEF-28 | later | content-curator | four product files | House lines inside `labelNotes` (Blue Magic, Bug & Tar, Hot Shine, Hybrid Ceramic Wax) | | | | new, open |
| DEF-22 | later | troubleshooter, with business-customer in Phase 4 | `tests/search-cases.yaml` | Two knowledge base 24 price cases parked until price items have pages | new, open | open | open | open |
| DEF-27 | fix-before-deploy | app-engineer (architect: D1 amendment) | `vite.config.ts`, `src/core/pwa.ts`, `src/core/freshPage.ts` | First session offline: lessons did not open and Try again said "no signal" | | | new, open | **closed** |
| DEF-20 | later | content-curator | six product files | Pending rows and house lines in `labelNotes` | new, open | open | open | **closed** |
| DEF-16 to DEF-19, DEF-21, DEF-23 to DEF-26 | | | | Closed in passes 2 and 3; their tests pass in this run | | | | closed |

The Phase 1 register (DEF-01 to DEF-15) is below, all closed; every test written for them passed in the full run.

## What only the phone can answer (pass 4 addition)

- [ ] Pass 3's DEF-27 phone check, now with the fix in: on a phone that has never opened the app (or delete the Home Screen app first), install from the Pages link, open from the icon with signal, wait for **Ready offline**, then 11 more minutes with the app open. Airplane mode without closing the app. The Academy, "One full square", Fix It, the jerking fix, "Machine polishing, one-step" in its Related list: each opens. Does the top ever say "Saving for offline" for more than a minute (that would be DEF-29 on the phone)? ______
- [ ] After DEF-30's fix, with the lead: open the app for the first time from the icon and keep it open; the lead deploys; switch away and back. "Update ready" shows; tap Update now: the app reloads by itself and says "Updated". ______

# Phase 2 gate, pass 3 (recheck, 2026-10-12, about 09:24 to 10:30 UTC, kept as written)

## Verdict

**Gate: not passed. 3 defects are open: 0 blocks-gate, 1 fix-before-deploy, 2 later.** Pass 2's three new defects are closed (DEF-24, DEF-25, DEF-26), and the app-engineer's half of DEF-20 is done. Pass 3 found one new defect by attacking DEF-26's fix: DEF-27. The full browser run is green: `1448 passed`, 0 unexpected, 0 flaky, with DEF-27's new test failing as expected at five widths.

- **Fix before deploy.** DEF-27 (app-engineer): on the first visit, and on the first launch from the Home Screen icon, the app says "Ready offline" before the saved copy serves the open page. The service worker saves everything, but it does not take over a page that is already open (`clientsClaim: false`, prompt mode). Pages the warm-up did not bring in (every lesson, procedure, product, tool, and word) still come from the network. On GitHub Pages the browser's own cache covers them for 10 minutes (`max-age=600`). After that, in airplane mode, the Academy says "This page did not load", and Try again says "There is no signal right now" every time, while the top line says "Offline, ready". Only closing and reopening the app helps. Fix It, the jerking fix, the Quick Cards, and search still work, because the warm-up loads them. A reload would also be served by the saved copy, but Try again never reloads here, because the address check from the not-yet-served page gets no answer. Before DEF-17's split, the content was inside the app code, so this could not happen.
- **Later.** DEF-20 (content-curator): the item page now draws `Product.notes` with a badge per line. The two product files still hold the Tesla house line, Tesla's manual line, and "Lando decides how this applies to Teslas (pending)" inside `labelNotes`, a paragraph with no badge. Both items carry the page badge and say "pending", so nothing reads as settled. DEF-22 (troubleshooter, Phase 4): two knowledge base 24 price cases stay parked by design. There are now two interim guards, both passing.

What held, with evidence below: `npm run check` is green and the flaky owner test is steady (12 of 12 runs). A failed content piece now comes back with Try again, under a fresh address, with no reload. A tab left open across a deploy reloads once (also on a double tap) and opens the lesson, at `/` and at `/aurigen-directory/`. With no signal, the line says so and the app never reloads into the browser's offline page. Every failure line is plain words. Search says "Search did not load" with Try again, never "Nothing found", and the next word answers once the signal is back. Lighthouse mobile is 0.92 to 0.95. axe found 0 problems on 355 screens, including the new failure screens. The offline copy is 33 entries (2,531.01 KiB), with every lazy piece in it. The content has not changed since pass 2 (hash snapshot), and every truth rule and all 87 sampled numbers pass again.

## Lando, in plain words

- The three things QA flagged last time are fixed. If a page fails to load on a weak signal, Try again now works once the signal is back, the message is plain English, and search no longer says "Nothing found" when it simply did not load. The test that passed or failed by chance is steady. The curriculum count is right.
- One thing to fix before this goes on your phone. The first time you open the app (from the link, or the first time from the icon), it says "Ready offline" a little before that is fully true. If you go to the garage, turn on airplane mode, and open a lesson without closing the app first, the lesson may not open, and Try again keeps saying there is no signal. Fix It, the jerking fix, the cards, and search still work. Closing the app and opening it again fixes it until the app-engineer's fix lands.
- Nothing here needs your answer. Two new phone checks are at the end of this section.

## The brief's eight checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | `npm run check`, both builds, `npm run test:e2e` (full); Phase 1 suites still pass | **pass** | Check, start of pass: exit 1, `Tests 1 failed \| 1407 passed (1408)`. The one failure is DEF-25's `it.fails`, which failed as designed because the line was fixed (flipped). The brief's integration note (4 failures in `tests/unit/search-cases.test.ts`) is from integration run 1, before pass 1 fixed that file; today it is `150 passed`. Check, end of pass: **exit 0**, `Test Files 73 passed (73)`, `Tests 1408 passed \| 1 expected fail (1409)` (the expected fail is DEF-20); two more `npx vitest run`: the same. Both builds exit 0, no chunk warning. e2e full: **exit 0**, `1488 tests`, `1448 passed`, `40 skipped` (the crawl runs at 375 px only), JSON `unexpected 0, flaky 0`, 23.8 min; every Phase 1 suite passes |
| 2 | Content audit | **pass** (DEF-20 later) | No content file changed since pass 2 (`sha1sum` of `content/`, `src/`, `scripts/`, `docs/`, `knowledge/`, `public/`, `tests/` against pass 2's closing snapshot: 20 changed and 8 new files, none under `content/` or `knowledge/`). `phase2-truth.test.ts` (22 tests plus DEF-20's new `it.fails`), `phase2-numbers.test.ts` (89 tests, 87 numbers), `phase2-counts.test.ts` (16 tests); 0 em or en dashes in 937 project files; no "first 24 hours" or "keep it dry" anywhere; 0 customer-safe items |
| 3 | Counts against the Phase 2 bar | **pass** | Fix It 89, fix-01 to fix-33 present. Levels 0 to 4: 31 lessons (6, 6, 6, 5, 8), each with steps and a why, 31 drills, 31 quizzes of 4 to 10 questions (167), 6 sign-off files, one per skill. Levels 5 to 8: 26 outlines (7, 5, 8, 6). 101 search cases, 101 pass. Slowest query 2.04 to 4.60 ms over three runs (the slowest "label says something different"), index load 9.4 to 16.9 ms, 272 documents |
| 4 | The v1 line, five widths, no dead ends | **pass** (DEF-27 is the first session in airplane mode) | `phase2-v1.spec.ts` (9 tests x 5 widths): two taps to fix-01, "jerking" puts fix-01 first, Read aloud offered. `phase2-pages.spec.ts`: 272 pages x 5 widths, no sideways scroll, no clipped title, 44 px targets, 64 px in Shop. `phase2-links.spec.ts`: the crawl of every content page, Fix It, the Academy, the cards, the procedures, and search results: 0 dead ends, Not found never reached from an internal link. New in `phase2-shards.spec.ts`: a failed piece is never a dead end (Try again and Home, then the page). Scratch probe of the failure screens (a lesson, fix-01, a word, search) at 375, 430, 768, 1024, 1440 px in Shop density: Try again and Home 64 px tall, no sideways scroll |
| 5 | Offline | **pass after "Ready offline" and a reload; fail in the same session (DEF-27)** | `phase2-offline.spec.ts` (2 tests x 5 widths): after "Ready offline", airplane mode, reload: Fix It, fix-01, a lesson, a procedure, a tool, search then Enter, cold deep links to fix-09, a card, a product, a word, an outline lesson, the card list; the offline copy holds 33 entries, including all 16 lazy pieces. New: DEF-27 as `test.fail` at 5 widths (the same steps with no reload: the Academy does not open). Probe on a server with the Pages cache header: `max-age=600` opens the Academy offline (the browser's cache); `max-age=0`, the same as after 10 minutes: "This page did not load", then "There is no signal right now" on every Try again |
| 6 | Customer View | **pass** | `phase2-customer-view.spec.ts` and `customer-view.spec.ts`: all 272 content pages, `/sops`, two searches: only "Lando's Detailing" and "Exit Customer View", nothing internal in the page or the accessibility tree, no flash on refresh; `phase2-shards.spec.ts`: still only the customer screen 2.5 s after load. The new failure line and the search Try again sit inside internal screens and the internal search box, so Customer View never draws them |
| 7 | Lighthouse mobile 90+; precache size; largest file | **pass** | Mobile Home **0.95, 0.92, 0.93, 0.93, 0.92** (LCP 2.9 s, TBT 80 to 110 ms, CLS 0.001 to 0.008); fix-01 **0.92, 0.92**; `lesson-l6-01-tesla` **0.92**; a product page **0.93**; accessibility and best practices 1.00 on every run; desktop 1.00. Precache **33 entries, 2,531.01 KiB** (pass 2: 2,526.99). Largest file `assets/vendor-*.js` 470,219 bytes (22% of the 2 MiB per-file limit); `search-index-*.js` 424,543; `content-lesson-*.js` 354,756; the app code `index-*.js` 234,406 (pass 2: 230,440) |
| 8 | Lando's 15-point audit on every changed code file | **pass, except Tier 2 (DEF-27)** | 21 app files changed or added since pass 2, plus QA's 4; details below |

## Commands and key output

| Command | Result | Key lines |
|---|---|---|
| `npm run check` (start of pass) | exit 1, 64.8 s | content `599 items (quickcard 14, drill 31, equipment 22, fixnode 89, flashcard 129, lesson 57, product 21, quizquestion 167, sop 31, glossaryterm 38), 0 customer-safe, 0 superseded left out, 6 sign-off files, 62 synonym groups, 272 search documents, search cases 101 of 101 passed`; `Test Files 1 failed \| 72 passed (73)`, `Tests 1 failed \| 1407 passed (1408)`: `DEF-25 ... Error: Expect test to fail` |
| `npx vitest run src/features/shared/__tests__/ContentWait.test.tsx` (12 runs) | 12 green | `Tests 9 passed (9)` each; pass 2's reproducer (`-t "pages on the generated content\|does not load the index"`): `3 passed \| 6 skipped` |
| `npx vitest run tests/unit` (QA's suites, after QA's changes) | exit 0 | `Test Files 13 passed (13)`, `Tests 732 passed \| 1 expected fail (733)` (DEF-20) |
| `npx tsc --noEmit -p tsconfig.node.json`; `npx oxlint --deny-warnings` | exit 0 | clean |
| `VITE_BASE=/aurigen-directory/ npm run build` | exit 0, 18.5 s | `✓ 390 modules transformed`; no chunk warning; `precache 33 entries (2531.48 KiB)`; `index.html` links `/aurigen-directory/manifest.webmanifest` and preloads only `rolldown-runtime` and `vendor`; the lazy-chunk guard (`viteShards.ts`) passed |
| `npm run build` (left in `dist/`) | exit 0, 18.3 s | `index 234.40 kB (gzip 72.87 kB)`, `vendor 470.21 kB (gzip 146.24 kB)`, `search-index 424.54 kB (gzip 102.61 kB)`, `content-lesson 354.75 kB (gzip 89.19 kB)`, `content-fixnode 266.42 kB (gzip 66.53 kB)`; `precache 33 entries (2531.01 KiB)`; each lazy loader reads `` ()=>w(()=>import(`./content-lesson-BGNcr8Lu.js`).then(e=>e.default),[]) ``, the shape `freshImport.ts` reads |
| Lighthouse 13.5.0, mobile Home x5, fix-01 x2, a lesson, a product, desktop | ran | numbers in check 7 |
| axe-core 4.14 (WCAG 2.0 to 2.2 A and AA, best practice), scratch sweep | ran, 5.5 min | `pages checked: 355; total axe violations: 0`: pass 2's 345 screens, plus the failure line on a lesson, fix-01, the Academy, and a product, and "Search did not load", at 375 and 1440 px |
| `PW_SKIP_BUILD=1 npx playwright test` the two changed specs, w375 and w1440 | first run: 31 passed, 3 failed | the 3 were QA's own test races (the search screen focuses its box on open, which starts the index load at once, and the warm-up can answer the word on its own); fixed in the tests; then `-g "DEF-26"` at 5 widths: `35 passed` |
| `npm run test:e2e` (full, both builds) | **exit 0**, 23.8 min | `Running 1488 tests using 3 workers`; `1448 passed`, `40 skipped`; JSON `expected 1448, unexpected 0, flaky 0` (5 of the 1448 are DEF-27's `test.fail`, failing as expected); Home before any content piece: load 158 to 205 ms, FCP 64 to 144 ms, 0 lazy requests before either, at 5 widths; offline copy 33 entries at 5 widths |
| `PW_SKIP_BUILD=1 npx playwright test tests/persistence/phase2-offline.spec.ts -g "DEF-27"` (after the full run, the test extended to fix-01's Related procedure and word) | exit 0 | `5 passed` (expected failures at 5 widths); a temporary copy of the same steps with a reload before airplane mode, at w375 and w1440: `2 passed`, so every step and name in the test is right (copy deleted) |
| `npm run check` (final) | **exit 0**, 64 s | content `599 items ... search cases 101 of 101 passed`; `Test Files 73 passed (73)`, `Tests 1408 passed \| 1 expected fail (1409)` (DEF-20); `npx vitest run` twice more: the same; `search-cases.test.ts` three times with the console on: `slowest 4.60 ms`, `2.62 ms`, `2.04 ms` |
| Scratch probes (Playwright library, `vite preview` of a copy of `dist/` on 4180, the Pages build on 4182, a static server with Pages' cache header on 4190 (`max-age=600`) and 4191 (`max-age=0`)) | ran | Listed under "The recheck of each pass 2 defect" and DEF-27 |

Nothing was left running: Playwright stopped its two servers; the scratch servers on 4180, 4182, 4190, and 4191 were stopped, and ports 4173, 4174, 4180, 4182, 4190, and 4191 refuse connections. Lighthouse and axe-core ran from the scratch folder. No file outside QA's own changed during the pass (hash snapshot of `src/`, `content/`, `scripts/`, `docs/`, `knowledge/`, `public/`, `tests/`, and the root config files at the start and the end). Only read-only git commands were run, at the start, to see what changed (`git log`, `git status --short`, `git diff --stat`); nothing was staged, committed, or checked out.

## The recheck of each pass 2 defect

| ID | Pass 2 | What the owner changed | Recheck evidence | Pass 3 |
|---|---|---|---|---|
| DEF-26 | fix-before-deploy, app-engineer | `src/core/freshImport.ts` (new): a second try imports the same chunk under `?mc-retry=N`, the address read from the loader's own text; `src/core/freshPage.ts` (new): Try again reloads the page only when the app's own address answers (a 5 s check), and two taps share one check and one reload; `content.ts` keeps the error for the developer panel and shows `This page did not load. Check the signal, then tap Try again.`; `search.ts` never keeps an index from a failed load, never builds one from part of the content, and says `Search did not load` (`failed` state); `useSearchResults.ts` and `SearchBox.tsx` show the line with Try again, and answer the word on screen once the index arrives by any path; `viteShards.ts` fails the build if a lazy chunk's loader stops reading `import("./file.js")` | `phase2-shards.spec.ts`, DEF-26 block, 7 tests x 5 widths, all pass: a blocked lesson opens on Try again under `?mc-retry=1` with no reload; the line is plain (no `TypeError`, no address, no `.js`); with no signal at all, Try again says "This page still did not load. There is no signal right now." and the page never reloads; signal back, Try again opens it; a 404 until a reload (a tab open across a deploy): a double tap reloads once and opens the lesson; search shows "Search did not load" with Try again and never "Nothing found", Enter opens nothing, then Try again finds fix-01; the next keystroke with the signal back finds fix-01 with no Try again; search Try again with no signal says so. Probe at `/aurigen-directory/`: the same, the address check goes to `/aurigen-directory/`, and the reload keeps the deep link. axe: the failure screens are clean | **closed** (attacking it found DEF-27) |
| DEF-24 | fix-before-deploy, app-engineer | `search.ts`: a generation number; `__resetSearchForTests()` bumps it and a load from before the reset writes nothing; two new tests in `searchLoadFailure.test.ts` | 12 runs of the file: 12 green (pass 2: 7 of 9 red); pass 2's reproducer: green; `npm run check` green at the end | **closed** |
| DEF-25 | later, learning-designer | `docs/CURRICULUM.md` Counts: "Levels 5 to 8: 26 outline lessons (Level 5: 7, Level 6: 5, Level 7: 8, Level 8: 6)." | The `it.fails` failed as designed ("Expect test to fail"); flipped to a pin on the total and on the split per level, against the outlines in the app | **closed** |
| DEF-20 | later, app-engineer then content-curator | app-engineer: `ItemDetail.tsx` draws `notes` under a "Notes" heading (h2 on the page, h3 in the sheet), one line each, a badge per pending line, superseded lines never; `searchEngine.ts` indexes `notes`; `productNotes.test.tsx` (new). content-curator: not yet | `grep "(pending)"` in `labelNotes`: `product-armor-all-extreme-wheel-tire` (the bike row and the Tesla rows) and `product-meguiars-ultimate-compound` (the Tesla rows). New QA `it.fails` in `phase2-truth.test.ts` passes while they stay there | **open** (later); owner now content-curator only |
| DEF-22 | later, troubleshooter (Phase 4 with business-customer) | A second interim guard: "how much for a full detail on an suv" lands on `lesson-l7-01-menus` | `tests/search-cases.yaml`: 101 cases, 101 pass; the parked pair still pinned in `search-cases.test.ts` | **open** (later, by design until Phase 4) |

## New defect (Phase 2, pass 3)

### DEF-27 (fix-before-deploy, app-engineer): "Ready offline" in the first session, then airplane mode: lessons, procedures, and item pages do not open, and Try again says "no signal" forever

- **Files.** `vite.config.ts` (`clientsClaim: false`: a first install does not take over the open page); `src/core/freshPage.ts` (`appAnswers` fetches the app's address from the page; a page the service worker does not serve yet gets no answer offline, so Try again never reloads); `src/core/pwa.ts` (`offlineReady` is true once the worker is installed, whether or not it serves this page); `src/app/warmUp.ts` (the warm-up loads only the index, the fixes, the cards, and the catalog).
- **What happens.** The first visit to the Pages link, or the first launch from the Home Screen icon (on iOS the Home Screen app may keep its own storage, so its first launch can be a first visit): the service worker installs and saves all 33 files, and the top line says "Ready offline". The open page is still not served by it (`navigator.serviceWorker.controller` is null) until the next launch or reload. Every lazy piece the warm-up did not load goes to the network. In airplane mode the Academy shows "This page did not load. Check the signal, then tap Try again."; Try again asks for a fresh copy (fails), checks the app's address from the page (fails), and says "This page still did not load. There is no signal right now." every time. The top line says "Offline, ready" the whole time. Fix It, fix-01, the cards, and search work (the warm-up brought them in). The related links on a fix page to a tool, a product, a word, or a procedure do not. A reload or a fresh launch is served by the saved copy and everything opens.
- **The 10-minute window.** On GitHub Pages, files carry `Cache-Control: max-age=600`, so the browser's own cache answers for 10 minutes after the copy was saved. Probe on a static server with that header: the Academy opens offline. With `max-age=0` (the same as 10 minutes later; `vite preview` sends `no-cache`): it fails as above. iPhone Safari's cache may differ; that part is a phone check.
- **When it bites.** Lando's own steps: install, open from the icon with signal, wait for Ready offline, then go to the garage without closing the app. Pass 1's phone checklist walks the same steps on the installed app, ending on "One full square"; on its first launch it meets this. A new hire on the first Saturday, the same.
- **Reproduce.** `npx playwright test tests/persistence/phase2-offline.spec.ts -g "DEF-27"`: a `test.fail`, failing as expected at 5 widths. By hand: `npm run build`, `npx vite preview`, open `/` in a fresh Chrome profile, wait for "Ready offline" and 4 more seconds, DevTools Network "Offline" (no reload), tap the Academy: the failure line; Try again: "There is no signal right now"; reload: everything opens.
- **Fix ideas (owner's choice).** (a) In `freshPage.ts`, treat a page with no controller but an active registration (`navigator.serviceWorker.getRegistration()` then `.active`) as answering: a reload is a navigation, and the saved copy serves it, also offline. Try again then heals the page in one tap. (b) `clientsClaim: true` with `skipWaiting` still false: a first install then serves the open page at once; an update still waits for the person to accept it, which reloads anyway. This touches the stack decision in `docs/DECISIONS.md` (prompt mode; `autoUpdate` was rejected because it sets `skipWaiting` and `clientsClaim` and reloads on its own), so it goes through the architect. (c) Hold "Ready offline" until the page is served by the copy (and say "Saved. Reopen the app to use it offline." until then). Then QA flips the test.

Also seen, not filed:
- When the search index fails, search's fallback asks for all 15 content pieces (about 1.3 MB) to build an index on the phone. That is the design, and on a weak signal it is a lot. With every piece blocked, one typed word made 16 requests and the warm-up 16 more.
- In the first 1.2 s after opening with no signal, a Try again's "no signal" line can be replaced by "This page did not load" when the warm-up's search fallback tries the same pieces again. Both lines are plain and true.
- The search screen says "Everything is on the phone, so it works with no signal." under which, before the offline copy exists, the box can say "Search did not load". Phase 1 wording; true once the app says Ready offline (and, after DEF-27's fix, served by it).

## Content audit, pass 3

No file under `content/` changed since pass 2 (hash snapshot against pass 2's closing one), and `knowledge/` did not change. The only content-adjacent changes are `tests/search-cases.yaml` (the troubleshooter's second interim guard, 101 cases) and `docs/CURRICULUM.md` (DEF-25). Every rule in pass 1's "Content audit" table and pass 2's additions ran again inside `npm run check` on the same 599 items and passed. The 87 sampled numbers (pass 1's rows 1 to 70 and pass 2's rows 71 to 87) passed again in `phase2-numbers.test.ts`. New in pass 3: DEF-20's `it.fails`, which names the two products whose `labelNotes` still hold a "(pending)" sentence; it also checks that, once moved, each has a house note, a sourced Tesla manual note, and the verify row "Lando decides how this applies to Teslas (pending)".

| Rule | Result | How |
|---|---|---|
| No superseded fact (knowledge base 23) presented as current | pass | `phase2-truth.test.ts`: knowledge base 23 and 9.1 rules, 0 superseded items, the renderer drops every superseded line |
| No market research figure, no 15.5 | pass | same suite |
| No "first 24 hours" aftercare line (FC-06) | pass | same suite; a project-wide grep finds nothing |
| No em or en dashes | pass | 937 project files, 0 |
| Every item internal, 0 customer-safe | pass | content build `0 customer-safe`; same suite |
| Every verify line renders with the unverified badge, never in Customer View | pass | `phase2-pages.spec.ts` (272 pages x 5 widths), `phase2-customer-view.spec.ts` |
| Numbers match the knowledge base or the verification log | pass | 87 sampled numbers, unchanged content |
| Pending rows for Tesla (FC-16) and speed and pressure (FC-22, FC-23) wherever those topics appear | pass (DEF-20 later) | same suite; the two products' rows are pending in words, in the wrong field |
| No quiz answer or flashcard depends on a pending decision | pass | 167 right answers and 129 flashcard answers |

## Lando's 15-point audit on the changed code files (pass 3)

Files: the 21 app files changed or added since pass 2: new `src/core/freshImport.ts`, `freshPage.ts`, and their tests, `lazyChunks.test.ts`, `searchLoadFailure.test.ts`, `src/features/search/productNotes.test.tsx`, `searchFailure.test.tsx`; changed `scripts/content/viteShards.ts`, `src/app/warmUp.ts`, `src/core/content.ts`, `contentLoaders.ts`, `contentLoadFailure.test.ts`, `search.ts`, `searchEngine.ts`, `src/features/search/ItemDetail.tsx`, `SearchBox.tsx`, `search.css`, `useSearchResults.ts`, `src/features/settings/dev/StateReadouts.tsx`, `src/features/shared/__tests__/ContentWait.test.tsx`. Plus QA's 4 (below).

| Tier | Result | Notes |
|---|---|---|
| 1 Structure | pass | both `tsc` programs clean, `oxlint --deny-warnings` clean, both builds compile; every changed file ends with a newline and a closed block |
| 2 Logic | **fail, DEF-27** | every state has a way in and out: loading ("Opening"), failed (plain line, Try again, Home), no signal (its own line), reloading (stays "Opening"); search: idle, loading, ready, failed, each shown; every `switch` has a `default` (`searchWords` in the developer panel, `ItemDetail`); `importedAddress` falls back to calling the loader again when it cannot read an address; `reloadForFreshCopy` never rejects and shares one reload between two taps. But in the first session after "Ready offline" with no signal, Try again cannot recover a page the saved copy could serve (DEF-27) |
| 3 Journey | pass | the crawl, the v1 line at 5 widths, Back and Forward across a loading piece, Enter before the index arrives, a failed piece to Try again or Home, a deploy-across-tab reload that keeps the address |
| 4 Runtime | pass | 0 page errors in every new browser test; errors are caught and shown in plain words, the detail kept for the developer panel (`failedDetail`, `lastError`); `console.error` only on error paths (the warm-up's failed index, a reload that throws); no storage access added; no `window.self`, `window.top`, `btoa`, `eval`, `innerHTML`, or `dangerouslySetInnerHTML`; `Function.prototype.toString` reads only the app's own loaders; the fresh import and the address check pass the page's CSP (`script-src 'self'`, `connect-src 'self'`) |
| 5 Build rules | pass | no file over 400 lines (largest app files `src/core/content.ts` 371, `src/core/searchEngine.ts` 278, `SearchBox.tsx` 219, `StateReadouts.tsx` 183; largest QA file `tests/e2e/phase2-shards.spec.ts` 321); the developer panel shows each failed piece's error and the search index state ("Did not load; the next search tries again", "Loading, a fresh copy after N failed") |

Specific checks: the only CSS change (`search.css`, `.sr-results__problem`) uses tokens only (`--space-3`, `--dur-fast`, `--ease-out`), no color, no `overflow: hidden`, no `max-height`, no `:hover`; Try again is a Shop-size button (64 px in Shop density); 0 em or en dashes in 937 project files; no secret, key, or address added.

## Tests added or changed by QA (pass 3)

| File | Change |
|---|---|
| `tests/unit/phase2-counts.test.ts` | DEF-25 flipped: the Counts line must state the number of outlines in the app and the same split per level |
| `tests/unit/phase2-truth.test.ts` | New `it.fails` for DEF-20: no product holds a "(pending)" sentence in `labelNotes`, and the two products carry a house note, a sourced Tesla manual note, and the pending row as `notes` lines |
| `tests/e2e/phase2-shards.spec.ts` | DEF-26's three `test.fail` replaced by 7 tests x 5 widths: Try again under a fresh address with no reload; plain words; no signal says so and never reloads; signal back opens; a deploy-across-tab 404 reloads once on a double tap and opens the lesson; search "did not load" with Try again, never "Nothing found", Enter opens nothing; the next word answers once the signal is back; search Try again with no signal says so |
| `tests/persistence/phase2-offline.spec.ts` | New `test.fail` for DEF-27: "Ready offline", airplane mode with no reload, then by taps only: the Academy, "One full square", Fix It, fix-01, its Related procedure ("Machine polishing, one-step") and word ("Long-throw"), and never "did not load" |

`playwright.config.ts` is unchanged. Known defects in QA's tests: DEF-20 (`it.fails`, unit) and DEF-27 (`test.fail`, browser, 5 widths). They pass while the defect is open and fail the day it is fixed; QA then flips them. DEF-22 is pinned as parked in `search-cases.test.ts`.

## Defect register, Phase 2 (current, after pass 3)

| ID | Severity | Owner | File | One line | Pass 1 | Pass 2 | Pass 3 |
|---|---|---|---|---|---|---|---|
| DEF-27 | fix-before-deploy | app-engineer | `src/core/freshPage.ts`, `vite.config.ts`, `src/core/pwa.ts` | First session after "Ready offline", airplane mode, no reload: lessons, procedures, and item pages do not open; Try again says "no signal" forever while the top says "Offline, ready" | | | new, open |
| DEF-20 | later | content-curator (app-engineer's part done) | `content/products/product-armor-all-extreme-wheel-tire.yaml`, `product-meguiars-ultimate-compound.yaml` | The Tesla house line, manual line, and pending row (and the bike row) still sit in `labelNotes`, a paragraph with no badge; move them to `notes` | new, open | open (schema done) | open (renderer done) |
| DEF-22 | later | troubleshooter, with business-customer in Phase 4 | `tests/search-cases.yaml` | Two knowledge base 24 price cases parked until price items have pages (two interim guards pass) | new, open | open | open |
| DEF-26 | fix-before-deploy | app-engineer | `src/core/content.ts`, `src/core/search.ts`, `src/features/shared/ContentWait.tsx` | A failed piece stayed failed until a reload; raw TypeError; search said "Nothing found" | | new, open | **closed** |
| DEF-24 | fix-before-deploy | app-engineer | `src/core/search.ts`, `ContentWait.test.tsx` | Flaky test: an index load from an earlier test landed after the reset | | new, open | **closed** |
| DEF-25 | later | learning-designer | `docs/CURRICULUM.md` | The Counts line said 23 outline lessons | | new, open | **closed** |
| DEF-16 to DEF-19, DEF-21, DEF-23 | | | | Closed in pass 2; their tests pass in this run | | | closed |

The Phase 1 register (DEF-01 to DEF-15) is below, all closed; every test written for them passed in the full run.

## What only the phone can answer (pass 3 addition)

- [ ] After DEF-27 is fixed, on a phone that has never opened the app (or delete the Home Screen app first): install from the Pages link, open from the icon with signal, wait for **Ready offline**, then wait 11 more minutes with the app open. Turn on airplane mode without closing the app. Tap the Academy, then "One full square": the lesson opens. Back to Fix It, the jerking fix, then "Machine polishing, one-step" in its Related list: it opens. ______
- [ ] Before the fix, the same steps tell us how big the problem is on an iPhone: does the lesson open in airplane mode without closing the app? Yes / No ______

# Phase 2 gate, pass 2 (recheck, 2026-10-12, about 07:45 to 08:45 UTC, kept as written)

## Verdict

**Gate: not passed. 5 defects are open: 0 blocks-gate, 2 fix-before-deploy, 3 later.** Six of pass 1's eight are closed (DEF-16, DEF-17, DEF-18, DEF-19, DEF-21, DEF-23). DEF-20 and DEF-22 stay open (later). Pass 2 found three new ones (DEF-24, DEF-25, DEF-26). The full browser run is green: `1423 passed`, 0 unexpected, 0 flaky, with DEF-26's three tests failing as expected at five widths.

- **Fix before deploy.** DEF-26, found by attacking DEF-17's fix: the content now loads in 16 pieces, and a piece that fails to download once stays failed until the page is reloaded. "Try again" asks the browser for the same failed piece and fails every time; the line shows the raw `TypeError: Failed to fetch dynamically imported module: http://.../content-lesson-....js`; and search, with nothing loaded, answers "Nothing found" to "jerking" and every other word, even after the signal is back, and Enter does nothing. Before the fix the content was inside the app code, so this could not happen. It bites on the first visit to the Pages link before "Ready offline" on a weak garage signal, or in a Safari tab left open across a deploy. An installed phone that says "Ready offline" is not affected: every piece is in the offline copy.
- **Fix before deploy.** DEF-24: an app-engineer test is flaky. `src/features/shared/__tests__/ContentWait.test.tsx`, "a box on screen does not load the index until it is focused", failed the first `npm run check` of this pass and 7 of 9 runs of its own file; the final `npm run check` and three more full runs were green. A search index load started by an earlier test finishes after the next test's reset. The app is right; the test is not reliable, and CI runs it before every deploy.
- **Later.** DEF-20 (the item page does not draw the new product `notes` yet, so two products still hold the Tesla lines in one paragraph); DEF-22 (two knowledge base 24 cases parked until price items have pages, now with an interim guard case); DEF-25 (`docs/CURRICULUM.md` says 23 outline lessons are planned; it lists 26 topics, and the app has 26 outlines).

What held, with evidence below: the app opens fast again (Lighthouse mobile on Home 0.95, 0.91, 0.92, 0.92, 0.94; fix-01 0.91 and 0.92; a lesson 0.93); no content piece or search index is requested before the first paint or the load event, at five widths; the offline copy holds all 16 lazy pieces, and a fix, two lessons, a procedure, a product, a tool, a word, a card, the card list, and search all open in airplane mode; a slow network shows "Opening" and never a false "not found"; Customer View shows only the customer screen on all 272 content addresses, also after every piece has arrived; the crawl made 3,220 taps with no dead end; axe found 0 problems on 345 screens; the content passes every truth rule on 599 items, including the 26 new outline lessons and 17 more sampled numbers (87 in all, all matching).

## Lando, in plain words

- Most of what QA flagged last time is fixed. The app opens fast again on a phone (Lighthouse 0.91 to 0.95; the target is 0.90). The flashcard that held your pending towel decision now leaves it to the lesson. A gloved double tap on Read aloud keeps reading. The Academy now shows 26 outline lessons for Levels 5 to 8.
- Two things to fix before this goes on your phone. First: the content now loads in pieces, and if a piece fails once (weak signal on the very first visit), "Try again" never works and search says "Nothing found" for everything until you close and reopen the app. Once the app says "Ready offline", this cannot happen. Second: one of the app-engineer's tests passes or fails by chance; the app is fine, but the check that runs before every deploy must be reliable.
- Nothing here needs your answer. The phone checks at the end of the pass 1 section still stand, plus one new one at the end of this section.

## The brief's eight checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | `npm run check`, both builds, `npm run test:e2e` (full); Phase 1 suites still pass | **pass, with DEF-24** | check, start of pass: exit 1, `Tests 2 failed \| 1348 passed (1350)`: DEF-16's `it.fails` (fixed, so it failed as designed; flipped) and DEF-24. Check, end of pass: **exit 0**, `Test Files 67 passed (67)`, `Tests 1370 passed \| 1 expected fail (1371)` (the expected fail is DEF-25); three more `npx vitest run`: green. Both builds exit 0, no chunk warning. e2e full: **exit 0**, `1463 tests`, `1423 passed`, `40 skipped` (the crawl runs at 375 px only), JSON `unexpected 0, flaky 0`, 23.9 min; every Phase 1 suite passes |
| 2 | Content audit | **pass** (DEF-20, DEF-25 later) | `phase2-truth.test.ts` (22 tests), `phase2-numbers.test.ts` (89 tests: 87 numbers), `phase2-counts.test.ts` (16 tests); `phase2-pages.spec.ts` (every verify line and pending row carries its badge on all 272 pages at 5 widths); `phase2-customer-view.spec.ts` (never in Customer View). Details in "Content audit, pass 2" |
| 3 | Counts against the Phase 2 bar | **pass** | Fix It 89, fix-01 to fix-33 present; Levels 0 to 4: 31 lessons with steps and a why, a drill each, 31 quizzes of 4 to 10 questions (167), 6 sign-off files; Levels 5 to 8: 26 outlines; 100 search cases, 100 pass; slowest query 2.98 ms ("polish turned to powder"), index load 16.5 ms, 272 documents |
| 4 | The v1 line, five widths, no dead ends | **pass** | `phase2-v1.spec.ts` (9 tests x 5 widths): Fix It then the jerking tile shows fix-01 in two taps; "jerking" puts fix-01 first; Read aloud is offered; `phase2-hostile.spec.ts`: a 6 times slower CPU draws Fix It in 497 to 796 ms and fix-01 in 583 to 888 ms, and answers "jerking" in 105 to 336 ms; `phase2-pages.spec.ts`: 272 pages x 5 widths, no sideways scroll, no clipped title, every target 44 px and 64 px in Shop; `phase2-links.spec.ts`: 3,220 taps over all 272 content pages, Fix It, the Academy, the cards, the procedures, and search results, 0 dead ends, Not found never reached from an internal link |
| 5 | Offline | **pass** (DEF-26 is before the offline copy exists) | `phase2-offline.spec.ts` (2 tests x 5 widths): after "Ready offline", airplane mode, reload: two taps to fix-01, a lesson, a procedure, a tool, search then Enter, cold deep links to fix-09, a card, a product, a word, an outline lesson, the card list; the offline copy holds 33 entries, including all 16 lazy pieces; `pages-base.spec.ts` the same under `/aurigen-directory/` |
| 6 | Customer View | **pass** | `phase2-customer-view.spec.ts`: 275 addresses at 375 px (all 272 content pages, `/sops`, two searches), one of each type at the other widths: only "Lando's Detailing" and "Exit Customer View", nothing internal in the page or the accessibility tree, no flash on refresh, Back and Forward; new in `phase2-shards.spec.ts`: still only the customer screen 2.5 s after load, when the warm-up has brought in the index and the Fix It content |
| 7 | Lighthouse mobile 90+; precache size; largest file | **pass** (DEF-17 closed) | mobile Home **0.95, 0.91, 0.92, 0.92, 0.94** (LCP 2.6 to 3.0 s, TBT 70 to 130 ms, CLS 0.001); fix-01 **0.91, 0.92**; `lesson-l6-01-tesla` **0.93**; accessibility and best practices 1.00 on every run; desktop 1.00. Precache **33 entries, 2,526.99 KiB** (pass 1: 19, 2,211.80 KiB). Largest file `assets/vendor-*.js` 470,219 bytes (22% of the 2 MiB per-file limit); largest content piece `content-lesson-*.js` 354,756 bytes; the search index 424,543 bytes |
| 8 | Lando's 15-point audit on every changed code file | **pass, except Tier 2 (DEF-26)** | 49 app files changed since pass 1, plus QA's 6; details below |

## Commands and key output

| Command | Result | Key lines |
|---|---|---|
| `npm run check` (start of pass) | exit 1, 60.6 s | content `599 items (quickcard 14, drill 31, equipment 22, fixnode 89, flashcard 129, lesson 57, product 21, quizquestion 167, sop 31, glossaryterm 38), 0 customer-safe, 0 superseded left out, 6 sign-off files, 62 synonym groups, 272 search documents, search cases 100 of 100 passed`; `Tests 2 failed \| 1348 passed (1350)`: `DEF-16 ... Error: Expect test to fail` and `ContentWait.test.tsx > ... does not load the index until it is focused: expected 'ready' to be 'idle'` |
| `npx vitest run src/features/shared/__tests__/ContentWait.test.tsx` (9 runs) | 7 red, 2 green | `1 failed \| 8 passed` or `9 passed`; alone (`-t "does not load the index"`): pass; with the two tests before it (`-t "pages on the generated content\|does not load the index"`): `1 failed \| 2 passed`; with any other earlier test: pass (DEF-24) |
| `VITE_BASE=/aurigen-directory/ npm run build` | exit 0, 19.1 s | `✓ 388 modules transformed`; no chunk size warning; `precache 33 entries (2527.45 KiB)`; `index.html` links `/aurigen-directory/manifest.webmanifest` and preloads only `rolldown-runtime` and `vendor`; manifest `start_url "."`, `scope "."` |
| `npm run build` (left in `dist/`) | exit 0, 18.0 s | `index 230.44 kB (gzip 71.44 kB)`, `vendor 470.21 kB (gzip 146.24 kB)`, `search-index 424.54 kB (gzip 102.61 kB)`, `content-lesson 354.75 kB (gzip 89.19 kB)`, `content-fixnode 266.42 kB (gzip 66.53 kB)`; `precache 33 entries (2526.99 KiB)` |
| Lighthouse 13.5.0, mobile, Home x5, fix-01 x2, a lesson, desktop | ran | Home 0.95, 0.91, 0.92, 0.92, 0.94; fix-01 0.91, 0.92; Tesla lesson 0.93; desktop 1.00; first-load scripts `index` 70 KiB, `vendor` 142 KiB, `rolldown-runtime` 1 KiB, `pwaRegister` 1 KiB; no content piece in the critical path (fix-01 loads `content-fixnode` 65 KiB and `content-catalog` 12 KiB after the first paint) |
| `npx vitest run tests/unit` (QA's suites, after QA's changes) | exit 0 | `Test Files 13 passed (13)`, `Tests 730 passed \| 1 expected fail (731)` (DEF-25) |
| `npx tsc --noEmit -p tsconfig.node.json`; `npx oxlint --deny-warnings` | exit 0 | clean |
| `PW_SKIP_BUILD=1 npx playwright test` the changed specs, w375 and w1440 | exit 0 | `42 passed` (6 of them DEF-26's expected failures) |
| `npm run test:e2e` (full, both builds) | **exit 0**, 23.9 min | `Running 1463 tests using 3 workers`; `1423 passed`, `40 skipped`; JSON `expected 1423, unexpected 0, flaky 0` (15 of the 1423 are DEF-26's `test.fail`, failing as expected); Home before any content piece: load 171 to 251 ms, FCP 80 to 168 ms, 0 lazy requests before either; offline copy 33 entries |
| axe-core 4.14 (WCAG 2.0 to 2.2 A and AA, best practice), scratch sweep | ran, 5.3 min | `pages checked: 345; total axe violations: 0`: all 272 content pages and 6 lists at 375 px in Shop density, a tenth at 1440 px, a tenth at 768 px in Academy density, each after its content arrived and the load animation ended. `heading-order` (DEF-19) is gone |
| `npm run check` (final) | **exit 0**, 68 s | `Test Files 67 passed (67)`, `Tests 1370 passed \| 1 expected fail (1371)` |
| `npx vitest run` (3 more full runs) | 3 green | `1370 passed \| 1 expected fail (1371)` each |
| Scratch probes (Playwright library, `vite preview` on 4180) | ran | Read aloud: a second tap 150 or 250 ms after the first is held, 400 or 600 ms pauses; a double tap on Stop reading lands on the row (`DIV.mc-actions`), not on the new Read aloud; a blocked lesson piece: three Try again taps after unblocking, still the failure line; a reload: the lesson. Search with every piece blocked: "Nothing found for "jerking"", still after unblocking. The outline lessons' numbers: every digit is in the knowledge base or the log (only years and "1099" come from the log) |

Nothing was left running: Playwright stopped its two servers, the scratch preview on 4180 was stopped, and ports 4173, 4174, and 4180 refuse connections. Lighthouse and axe-core ran from the scratch folder. No file outside QA's own changed during the pass (a hash snapshot of `src/`, `content/`, `scripts/`, `docs/`, `knowledge/`, `public/`, and `tests/` at the start and the end). No git command was run.

## The recheck of each pass 1 defect

| ID | Pass 1 | What the owner changed | Recheck evidence | Pass 2 |
|---|---|---|---|---|
| DEF-18 | blocks-gate, app-engineer | `src/features/cards/cards.test.tsx` counts the badges inside the card's own rows (the `dl` labelled with the card title), with the expected rows taken from the card data, and the Related badges from the related items' own status | `npm run check`: `cards.test.tsx` passes (11 of 11); a content status change can no longer break it | **closed** |
| DEF-17 | fix-before-deploy, app-engineer | The content is cut into one lazy chunk per type plus a catalog and extras (`scripts/content/viteShards.ts`, `src/core/contentShards.ts`, `contentLoaders.ts`, `content.ts`); Home draws from an item-count summary; a warm-up loads the search index and the Fix It content after the load event plus 1.2 s (`src/app/warmUp.ts`); the index ships as `JSON.parse` of one string and loads in batches | Lighthouse mobile on Home **0.95, 0.91, 0.92, 0.92, 0.94** (LCP 2.6 to 3.0 s; was 4.7 s), fix-01 **0.91, 0.92**, desktop 1.00; `phase2-shards.spec.ts`: no shard or index request starts before the load event or the first paint, at 5 widths; the offline copy holds all 16 lazy chunks; offline, Customer View, the crawl, and the v1 line all pass | **closed** (the fix opened DEF-24 and DEF-26) |
| DEF-16 | fix-before-deploy, learning-designer | `flash-towels-washer` answer: care tag; water-only pile warm; dye-free, fragrance-free detergent; full cycle; extra rinse; "Water for the product pile is in the shop setup lesson." The product-pile line stays in `lesson-l0-06-shop-setup` (house, the towel maker's line, pending) and fix-76 | `phase2-truth.test.ts`: the `it.fails` failed as expected the day it was fixed ("Expect test to fail"); flipped to a pin that also checks the settled parts and the links | **closed** |
| DEF-23 | later, app-engineer | `useTapHold` (`src/features/shared/useTapHold.ts`): the voice row takes no pointer taps for the tap guard time after a tap swaps its first button; keyboard activation is never held | `phase2-hostile.spec.ts` at 5 widths: a double tap on Read aloud leaves the voice reading (`speak` only); new: double taps on Pause, Resume, and Stop reading each do one thing, and a deliberate second tap 600 ms later still pauses. Scratch probe: a second tap 150 or 250 ms after Read aloud is held; 400 or 600 ms pauses | **closed** |
| DEF-19 | later, app-engineer | `ItemDetail` headings are `h2` on the item page and `h3` inside the search sheet (under the drawer's `h2`) | `/items/product-meguiars-m210`: h1, then h2 What it is for, Related, Where this comes from; axe sweep below | **closed** (axe: 0 violations on 345 screens) |
| DEF-20 | later, architect then content-curator | Architect: `Product.notes: Line[]` (D2 amendment 2026-10-12, README pattern section). Not yet: `ItemDetail.tsx` does not draw `notes`, and the two product files still hold the three Tesla statements in `labelNotes` (the README says to move them only after the page draws `notes`) | `grep -n notes src/features/search/ItemDetail.tsx`: nothing; `labelNotes` of `product-armor-all-extreme-wheel-tire` and `product-meguiars-ultimate-compound` still ends "Lando decides how this applies to Teslas (pending)." | **open** (later); owner now app-engineer (draw `notes`), then content-curator (move the lines) |
| DEF-21 | later, content-curator | 26 outline lessons, Levels 5 to 8 (7, 5, 8, 6), `outline: true`, each with a goal, a why, 3 to 23 steps, numbers rows with their own status, and related links | `phase2-counts.test.ts` (new block): one outline per curriculum topic, in order, no drill, quiz, or sign-off; odor and two-step write no method (verify); 17 of their numbers added to the sample; every truth rule passes on them; their 26 pages pass the page, badge, crawl, and Customer View suites | **closed** (one doc line left, DEF-25) |
| DEF-22 | later, troubleshooter (Phase 4 with business-customer) | An interim guard case: "how much is store it clean" lands on the Level 7 lessons that hold the price | `tests/search-cases.yaml`: 100 cases, 100 pass; the parked pair still pinned | **open** (later, by design until Phase 4) |

## New defects (Phase 2, pass 2)

### DEF-24 (fix-before-deploy, app-engineer): a flaky owner test can turn `npm run check` red

- **Files.** `src/features/shared/__tests__/ContentWait.test.tsx` (line 89, "a box on screen does not load the index until it is focused"); `src/core/search.ts` (`__resetSearchForTests`, `load`).
- **What happens.** The test renders a search box, waits 50 ms, and expects `searchStatus.state` to be `idle`. Often it finds `ready`. The two tests before it ("a fix page says Opening ...", and "the Fix It grid keeps its search box ...", which types "swirl") start a search index load. Since 07:38 the index loads in batches (`loadSearchIndexAsync`, part of DEF-17's fix), so that load can still be running when the next test's `beforeEach` calls `__resetSearchForTests()`. The reset sets `idle` and forgets the promise, but the old load then finishes and writes `state: 'ready'`. The app never resets search, so the app is right; the harness is racy. `content.ts` already guards the same race with a generation number; `search.ts` does not.
- **How often.** The first `npm run check` of this pass: red (`Tests 2 failed | 1348 passed`, this and DEF-16's flip). The final `npm run check` and three more `npx vitest run`: green. The file alone: red in 7 of 9 runs. A test that fails by chance in the check that runs before every deploy has to be fixed before this merges.
- **Reproduce.** From `masterclass/`: `npx vitest run src/features/shared/__tests__/ContentWait.test.tsx` a few times: mostly `1 failed | 8 passed`, `AssertionError: expected 'ready' to be 'idle'`. Alone, `-t "does not load the index"`: passes. With the two tests before it, `-t "pages on the generated content|does not load the index"`: `1 failed | 2 passed`. With any other earlier test: passes.
- **Fix.** A generation number in `search.ts` that `__resetSearchForTests()` bumps and `load()` checks before it writes the status or the index (as `content.ts` does), or let the earlier tests wait for the load they start.

### DEF-26 (fix-before-deploy, app-engineer): a chunk that failed once stays failed until a reload, and search then says "Nothing found"

- **Files.** `src/core/content.ts` (`loadShard`: the failure line and the retry), `src/features/shared/ContentWait.tsx` (Try again), `src/core/search.ts` (`load` builds an index from whatever loaded and `preloadSearch` keeps it for the session), `src/app/warmUp.ts` (its comment says search loads the index on first use; it does not after a failure).
- **What happens.** DEF-17's fix moved the content out of the app code into 16 lazy chunks. When one of them fails to download:
  1. The page shows the failure line with Try again and Home (no dead page, good). But the browser keeps a failed dynamic import, so Try again imports the same failed module and fails again, every time, even with the signal back. Only a reload helps.
  2. The line is the raw error: "The content did not load (TypeError: Failed to fetch dynamically imported module: http://localhost:4180/assets/content-lesson-BGNcr8Lu.js). Tap Try again, or reload." That is not plain English for DJ, and it prints a file address.
  3. Search: when the index chunk fails, search falls back to building an index from the shards; when those fail too, it builds an empty index, marks it ready, and keeps it. Every word answers "Nothing found for "jerking". Try fewer words, or open the Quick Cards." and Enter does nothing. With the signal back, the same, until a reload. A false "nothing found" on the v1 word is worse than "search did not load".
- **When it bites.** The first open of the Pages link before "Ready offline" on a weak garage signal (a lazy chunk is fetched over the network), or a Safari tab left open across a deploy (the old chunk names are gone). Not on an installed phone that says "Ready offline": every chunk is in the offline copy, and `phase2-offline.spec.ts` passes at 5 widths.
- **Reproduce.** `npx playwright test tests/e2e/phase2-shards.spec.ts -g "DEF-26"`: three `test.fail` tests, failing as expected at 5 widths. By hand: `npm run build`, serve `dist/`, block `content-lesson-*.js` in DevTools (Network request blocking), open `/academy/lesson-l4-07-full-square`, unblock, tap Try again: the same line again. Block every `content-*` and `search-index-*` file, open `/search`, type "jerking", unblock, type it again: "Nothing found".
- **Fix ideas (owner's choice).** On a failed chunk, Try again reloads the page (the service worker or the network then serves it), or re-imports with a cache-busting query; plain words ("This page did not load. Check the signal, then tap Try again."); never cache a search index built from a failed load, show "Search did not load" with Try again instead of "Nothing found", and try again on the next word. Then QA flips the three tests.

### DEF-25 (later, learning-designer): the curriculum still says 23 outline lessons

- **File.** `docs/CURRICULUM.md`, "Counts (2026-10-11, after the fact-check)": "Levels 5 to 8: 23 outline lessons planned."
- **What happens.** The curriculum's own outline lists 26 topics (Level 5: 7, Level 6: 5, Level 7: 8, Level 8: 6), and the app now has 26 outline lessons, one per topic. Lando reads this file.
- **Reproduce.** `npx vitest run tests/unit/phase2-counts.test.ts -t "DEF-25"`: an `it.fails` that passes while the line is wrong.
- **Fix.** "Levels 5 to 8: 26 outline lessons (Level 5: 7, Level 6: 5, Level 7: 8, Level 8: 6)." Then QA flips the test.

Also seen, not filed: at 375 px, tapping Pause swaps it for the wider "Resume", and "Stop reading" drops to a second line (a 76 px jump). The tap guard holds the row, so a double tap cannot land on the wrong button; it is a small jolt to the eye only.

## Content audit, pass 2

Every rule in pass 1's "Content audit" table re-ran on the 599 items of this build inside `npm run check` and passed, now including the 26 outline lessons, the rewritten flashcard, the 62 synonym groups, and the 100 search cases: no superseded fact as current, the fact-checker's corrections applied, no market figure and no 15.5, no aftercare line (FC-06; the final walkaround and booking outlines say only that the card's wording is not written and Lando decides it, as verify), no em or en dash in 921 project files, no bracket tag in text, every item internal (0 customer-safe), every open fact verify, house rule 12 house and the crew's next step pending. What pass 2 looked at in particular:

| Rule | Result | How |
|---|---|---|
| No quiz answer or flashcard depends on a pending decision | **pass** (DEF-16 closed) | 167 right answers and 129 flashcard answers; `flash-towels-washer` keeps the settled parts and points to the shop setup lesson, which holds the house line, the towel maker's line, and the pending row |
| Tesla (FC-16) in the outlines | pass | `lesson-l6-01-tesla`: the house wheel and compound row (house), Tesla's two manual rows (sourced), "Lando decides how this applies to Teslas (pending)" (verify), and the same three rows for camera lenses, mitts, the hose, the touchscreen, and the interior; the pre-soak is its own verify row. `lesson-l5-05-exterior-glass` sends Teslas to the Tesla glass procedure |
| Speed and pressure (FC-22, FC-23) in the outlines | pass | `lesson-l8-05-black-pad` states the black pad's sealant speed (house, knowledge base 3.2) and a verify row "The house polishing speed and pressure wait on Lando's decision"; no outline states speed 4 or about 10 lb |
| Methods the knowledge base does not have | pass | odor and the two-step: one verify step each ("no odor method yet", "no two-step procedure yet"), no invented step; the smoke odor fee says "quoted on inspection", never a number (BLUEPRINT 12 item 2) |
| Numbers in the outlines | pass | a scratch scan of every digit in the 26 outlines: all in the knowledge base, except model years and "1099", which are in the verification log; 17 sampled below with their words |
| Founder's rate "for a sedan or an SUV" (`lesson-l7-01-menus`, house) | pass | knowledge base 15.1 tags it `[VERIFY with Lando]`; BLUEPRINT 12 item 1 default ("$275 for both sizes"), accepted by Lando on 2026-10-10 |
| Product notes (DEF-20) | open, later | the two product pages still hold the three Tesla statements in `labelNotes`; the item carries the page badge and the words say pending, so nothing reads as settled |

### The number sample, pass 2 additions (17 numbers from the outline lessons; 87 in all)

Rows 1 to 70 are pass 1's table above, all still passing. "Renders as" is the status of the line the number sits on.

| # | Item | The item says | Renders as | Source | The source says |
|---|---|---|---|---|---|
| 71 | `lesson-l5-03-tire-dressing` | At least 3 to 5 minutes before the car moves | sourced | verification log | at least 3 to 5 min (trigger), 5 min (aerosol) |
| 72 | `lesson-l5-05-exterior-glass` | Drop the windows 1 to 2 inches | house | knowledge base | Drop windows 1 to 2 inches |
| 73 | `lesson-l6-03-headlight-refresh` | $30 a pair | house | knowledge base | headlight refresh $30/pair |
| 74 | `lesson-l6-04-pet-hair-job` | 2 hrs or more | house | knowledge base | stains: 2 hrs or more |
| 75 | `lesson-l7-01-menus` | Standard $75, bagger or touring $95 | house | knowledge base | \| Wash & Protect (1 hr): ... \| $75 \| $95 \| |
| 76 | `lesson-l7-01-menus` | badge removal $40 | house | knowledge base | badge removal $40 |
| 77 | `lesson-l7-01-menus` | $60 to $75 per hour gross | house | knowledge base | Target: $60 to $75 per hour gross |
| 78 | `lesson-l7-03-five-policies` | 24 hours notice | house | knowledge base | Cancellation: 24 hours notice or the deposit stays |
| 79 | `lesson-l7-05-honest-selling` | fresh paint under 30 days | house | knowledge base | fresh paint under 30 days |
| 80 | `lesson-l8-01-two-step` | 4 h 55 m | house | knowledge base | \| **Total on paint** \| 39 \| **2 h 30 m** \| **4 h 55 m** \| |
| 81 | `lesson-l8-01-two-step` | 3 to 4 cutting plus 3 finishing | house | knowledge base | two-step 3 to 4 cutting plus 3 finishing |
| 82 | `lesson-l8-02-speed` | 5:25 PM against a 6:10 plan | house | knowledge base | wheels + wash done 5:25 PM (plan was 6:10) |
| 83 | `lesson-l8-03-two-person-flow` | About 5 h | house | knowledge base | Two people (one in, one out): about 5 h |
| 84 | `lesson-l8-04-mobile-polishing` | The polisher draws 7.5 A | sourced | verification log | 120VAC / 60Hz / 7.5A |
| 85 | `lesson-l8-04-mobile-polishing` | 12-gauge, 50 ft max | house | knowledge base | 12-gauge cord, 50 ft max |
| 86 | `lesson-l8-04-mobile-polishing` | within 20 minutes of each other | house | knowledge base | within 20 minutes of each other |
| 87 | `lesson-l8-05-black-pad` | speed 2 to 3 | house | knowledge base | sealant at speed 2 to 3 |

## Lando's 15-point audit on the changed code files (pass 2)

Files: the 49 app files changed since pass 1 (newer than QA's pass 1 tests, under `src/`, `scripts/`, and `vite.config.ts`): new `scripts/content/viteShards.ts`, `src/core/contentShards.ts`, `contentLoaders.ts`, `src/app/warmUp.ts`, `src/features/shared/ContentWait.tsx`, `useTapHold.ts` and their tests; changed `src/core/content.ts`, `contentBundle.ts`, `search.ts`, `searchEngine.ts`, `backup.ts`, `backupImport.ts`, `restorePreview.ts`, `src/main.tsx`, `src/app/screens/Home.tsx`, the Academy, card, Fix It, search, and shared screens that now wait on their content, `ReadAloud.tsx`, `ItemDetail.tsx`, `src/schemas/content-shop.ts` and README, `vite.config.ts`, `scripts/content/pipeline.ts`. Plus QA's 6.

| Tier | Result | Notes |
|---|---|---|
| 1 Structure | pass | both `tsc` programs clean, `oxlint --deny-warnings` clean, both builds compile; every changed file ends with a newline and a closed block |
| 2 Logic | **fail, DEF-26** | every new `switch` has a `default` (`shardOf`, `isShard`); a page waiting on content says "Opening" with `aria-busy`, never "not found" (tested on a slow network); an unknown id still ends at its not-found screen; a failure is a final state with Try again and Home. But Try again cannot recover a failed piece, and search turns a failed load into "Nothing found" (DEF-26) |
| 3 Journey | pass | the crawl (3,220 taps at 375 px), the v1 line at 5 widths, Back and Forward across a piece that is still loading, Enter typed before the index arrives (opens fix-01) |
| 4 Runtime | pass, with DEF-26 | 0 page errors and 0 console errors in every new browser test; no storage access added; no `window.self`, `window.top`, `btoa`, `eval`, `innerHTML`, or `dangerouslySetInnerHTML`; `console.error` only on error paths (boot, backup time, the warm-up). The warm-up's line "search loads it on first use" never prints and is not true after a failure (DEF-26). The failure line prints a file address to the screen (DEF-26) |
| 5 Build rules | pass | no file over 400 lines (largest app files `src/core/content.ts` 312, `scripts/content/pipeline.ts` 298, `vite.config.ts` 283, `src/core/searchEngine.ts` 278; largest QA files `tests/adversarial/phase2-hostile.spec.ts` 288, `tests/unit/phase2-truth.test.ts` 262); the developer panel gains "Content shards in memory" (loaded, loading, failed) |

Specific checks: the only CSS change (`shared.css`) is `pointer-events: none` under the tap guard, no color; 0 em or en dashes in 921 project files; no `overflow: hidden`, `max-height`, or `:hover` added; 44 px targets and 64 px in Shop on every content page at 5 widths; no secret, key, or address added.

## Tests added or changed by QA (pass 2)

| File | Change |
|---|---|
| `tests/unit/phase2-truth.test.ts` | DEF-16 flipped: the flashcard rule now covers every flashcard, and a pin checks `flash-towels-washer` keeps the settled parts, says no "hot", and links to the shop setup lesson and fix-76 |
| `tests/unit/phase2-counts.test.ts` | new block, Levels 5 to 8: one outline per curriculum topic (7, 5, 8, 6), in order; each marked as an outline, with a goal, a why, 3 or more steps, and a link on; no drill, quiz, skill, or sign-off; odor and the two-step write no method; DEF-25 as `it.fails` |
| `tests/unit/phase2-numbers.test.ts` | 17 numbers from the outline lessons added (87 in all) |
| `tests/e2e/phase2-shards.spec.ts` | new, 10 tests x 5 widths: nothing lazy before the first paint or the load event, and no content preload in `index.html`; the warm-up brings in the index, the fixes, the cards, and the catalog, the lessons wait for the Academy; slow-network deep links to 7 pages never draw a not-found title; 6 unknown ids end at not found; Enter before the index arrives; Customer View after every piece arrived; Back and Forward across a loading piece; DEF-26 as three `test.fail` |
| `tests/persistence/phase2-offline.spec.ts` | every lazy chunk in `dist/assets` (16) must be in the offline copy; cold offline deep links to a card, a product, a word, an outline lesson, and the card list |
| `tests/adversarial/phase2-hostile.spec.ts` | DEF-23 flipped (the voice log is exactly `speak`); new: double taps on Pause, Resume, and Stop reading each do one thing; a deliberate second tap 600 ms after Read aloud still pauses |

`playwright.config.ts` is unchanged. Known defects in QA's tests: DEF-25 (`it.fails`, unit) and DEF-26 (three `test.fail`, browser). They pass while the defect is open and fail the day it is fixed; QA then flips them. DEF-24 is itself an owner test. DEF-20 and DEF-22 have no QA test that fails today.

## Defect register, Phase 2 (after pass 2; the current register is in pass 3 above)

| ID | Severity | Owner | File | One line | Pass 1 | Pass 2 |
|---|---|---|---|---|---|---|
| DEF-26 | fix-before-deploy | app-engineer | `src/core/content.ts`, `src/core/search.ts`, `src/features/shared/ContentWait.tsx` | A content piece or the index that failed once stays failed until a reload: Try again never works, the line shows a raw TypeError, search answers "Nothing found" | | new, open |
| DEF-24 | fix-before-deploy | app-engineer | `src/features/shared/__tests__/ContentWait.test.tsx`, `src/core/search.ts` | Flaky test: an index load from an earlier test lands after the reset (red in 1 of 5 full runs, 7 of 9 file runs) | | new, open |
| DEF-25 | later | learning-designer | `docs/CURRICULUM.md` | The Counts line says 23 outline lessons; the curriculum lists 26 and the app has 26 | | new, open |
| DEF-20 | later | app-engineer (draw `notes`), then content-curator (move the lines); architect's part done | `src/features/search/ItemDetail.tsx`; two product files | The Tesla house line, manual line, and pending row still sit in one paragraph on two product pages | new, open | open (schema done) |
| DEF-22 | later | troubleshooter, with business-customer in Phase 4 | `tests/search-cases.yaml` | Two knowledge base 24 cases parked until price items have pages (interim guard case added) | new, open | open |
| DEF-18 | blocks-gate | app-engineer | `src/features/cards/cards.test.tsx` | Badge count test broke on a content status change | new, open | **closed** |
| DEF-17 | fix-before-deploy | app-engineer | `src/core/content.ts`, `vite.config.ts` | Lighthouse mobile 0.76 to 0.83 | new, open | **closed** (0.91 to 0.95) |
| DEF-16 | fix-before-deploy | learning-designer | `content/academy/flashcards/flash-towels-washer.yaml` | A flashcard answer held a pending decision | new, open | **closed** |
| DEF-23 | later | app-engineer | `src/features/shared/ReadAloud.tsx` | A double tap on Read aloud paused the reading | new, open | **closed** |
| DEF-19 | later | app-engineer | `src/features/search/ItemDetail.tsx` | Product and tool pages skipped from h1 to h3 | new, open | **closed** (axe 0 on 345 screens) |
| DEF-21 | later | content-curator | `content/lessons/` | No outline lessons for Levels 5 to 8 | new, open | **closed** (26 outlines) |

The Phase 1 register (DEF-01 to DEF-15) is below, all closed; every test written for them passed in the full run.

## What only the phone can answer (pass 2 addition)

- [ ] After DEF-26 is fixed, on the Pages link in a private Safari tab (so nothing is saved yet): open Home, turn on airplane mode before "Ready offline" shows, tap the Academy tile. You should see one plain line with Try again and Home. Turn airplane mode off and tap Try again: the Academy opens. Then Search, type "jerking": the jerking fix is first. ______

# Phase 2 gate, pass 1 (2026-10-12, about 04:10 to 05:35 UTC, kept as written)

## Verdict

**Gate: not passed. 8 defects are open: 1 blocks-gate, 2 fix-before-deploy, 5 later.** All are new in Phase 2 (DEF-16 to DEF-23). None of the Phase 1 defects came back: the full browser run passed every Phase 1 test.

- **Blocks the gate.** DEF-18: `npm run check` is red. An app-engineer unit test (`src/features/cards/cards.test.tsx`) counts the "unverified" badges on the real pad ladder card and expects 1; the fact application turned `product-meguiars-ultimate-compound` to verify, so the card's Related list now (correctly) shows a second badge. The app is right; the test is stale. CI runs `npm run check`, so the branch cannot go green until it is fixed.
- **Fix before deploy.** DEF-17: Lighthouse mobile performance fell to 0.76 to 0.83 (target 90, Phase 1 was 0.91 to 0.93). LCP went from about 3.0 s to 4.7 s because the 1.09 MiB content chunk (262 KB gzip) now loads before the first screen. DEF-16: one flashcard (`flash-towels-washer`) puts a pending decision (FC-88, product towels hot or warm) in its answer.
- **Later.** DEF-23 a gloved double tap on Read aloud pauses the reading at once (the second tap lands on Pause); DEF-19 heading order on the 41 product and tool pages (axe best practice); DEF-20 the Tesla lines on two product pages sit in a paragraph, not as their own sourced and pending rows (the product schema has no per-line field); DEF-21 Levels 5 to 8 have no outline lessons in the app (the outline lives in `docs/CURRICULUM.md` only); DEF-22 two knowledge base 24 search cases stay parked until price items get pages in Phase 4.

What held, with evidence below: the content is clean on every truth rule QA could automate (no superseded fact as current, no market figure, no aftercare line, no dash, all 573 items internal, every open fact carries verify, Tesla and speed and pressure always show the house line, the maker's line, and a pending row); 70 sampled numbers match the knowledge base or the verification log; Fix It has 89 entries with fix-01 to fix-33 present; Levels 0 to 4 are complete (31 lessons, 31 drills, 31 quizzes of 4 to 10 questions, 6 sign-off files); 99 search cases pass with the slowest at 2.71 ms; the v1 line works in two taps or one word at every width, read aloud included (a single tap; see DEF-23 for a double tap); no dead end in 246 content pages and the four lists; offline works for a fix, a lesson, a procedure, an item, and search; Customer View shows nothing internal on any of the 246 content addresses.

## Lando, in plain words

- The content is solid. Every number QA checked matches your knowledge base or the fact-checker's log, nothing old or unconfirmed reads as settled, and every decision you have not made shows as "pending", including Teslas and the polisher speed and pressure.
- Fix It works the way you asked: Fix It, then the jerking tile, and fix-01 is on screen. Typing "jerking" puts it first. Read aloud reads the STOP lines first, then the steps. It all works in airplane mode.
- Three things must be fixed before this goes live: a test the app-engineer wrote is out of date (the app is fine), the app's first load on a phone got slower because the content is much bigger, and one flashcard answer includes a decision you have not made yet.
- One to fix by the garage test: if you double-tap Read aloud with gloves on, the second tap lands on Pause and the voice stops. One firm tap works.
- Nothing here needs your answer. The phone checks at the end of this section are for when the build is live.

## The brief's eight checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | `npm run check`, both builds, `npm run test:e2e` (full); Phase 1 suites still pass | **fail** (DEF-18) | check: exit 1, `Tests 1 failed \| 1291 passed \| 1 expected fail (1293)`, the one failure is DEF-18 (the expected fail is DEF-16). Both builds exit 0 (one Vite chunk-size warning, DEF-17). e2e full: exit 0, `1363 passed`, `40 skipped` (the crawl runs at 375 px only), 0 failed, 21.9 min; every Phase 1 suite passes, with QA's sign-off address test updated for the new `/academy/:lessonId` route |
| 2 | Content audit | **pass, except DEF-16** (and DEF-20 later) | `tests/unit/phase2-truth.test.ts` (22 tests), `tests/unit/phase2-numbers.test.ts` (72 tests), `tests/e2e/phase2-pages.spec.ts` (badges at 5 widths), details in "Content audit" below |
| 3 | Counts against the Phase 2 bar | **pass** (DEF-21, DEF-22 later) | `tests/unit/phase2-counts.test.ts` (12 tests), `tests/unit/search-cases.test.ts` (148 tests): Fix It 89; fix-01 to fix-33 present; 31 lessons Levels 0 to 4 with steps and a why; a drill and a quiz (4 to 10 questions, counts equal the curriculum) per lesson; 6 sign-off files; 99 search cases, 99 pass; slowest query 2.71 ms ("car wash mode"), index load 12.9 ms |
| 4 | The v1 line, five widths, no dead ends | **pass** (DEF-23 later: a double tap on Read aloud) | `tests/e2e/phase2-v1.spec.ts` (9 tests x 5 widths): two taps to fix-01, "jerking" first on Fix It, Search, and Home, Enter opens it, Read aloud below every STOP band, the voice reads STOP then steps and stops on leaving; tiles 64 px or taller; `phase2-pages.spec.ts` (246 pages x 5 widths): no sideways scroll, no clipped text, every target 44 px and 64 px tall in Shop; `phase2-links.spec.ts`: 2,930 taps (2,514 on the 246 content pages, 189 on Fix It, the Academy, Quick Cards, and the procedures, 227 on search results for 12 words), 0 dead ends, 0 taps that did nothing, and every Related list shows every linked item that has a page |
| 5 | Offline | **pass** | `tests/persistence/phase2-offline.spec.ts` (2 tests x 5 widths): airplane mode after "Ready offline", two taps to fix-01, a lesson from the outline, a procedure and an item by deep link, search then Enter, a cold deep link to fix-09; the search index chunk is in the offline copy; plus the Pages base path (`pages-base.spec.ts`, new test) |
| 6 | Customer View | **pass** | `tests/privacy/phase2-customer-view.spec.ts`: all 246 content addresses at 375 px (one of each type at the other widths), `/sops`, `/search?q=jerking`: only "Lando's Detailing" and "Exit Customer View", no badge, STOP band, or result, nothing internal in the accessibility tree; no internal element drawn for even one frame on a refresh; Back and Forward onto a fix and a lesson after Customer View went on; the Phase 1 privacy test now covers the 9 new routes too |
| 7 | Lighthouse mobile 90+; precache size; largest file | **fail** (DEF-17) | mobile performance 0.76, 0.83, 0.81 on Home and 0.83 on fix-01 (accessibility 1.00, best practices 1.00); desktop 0.99. Precache 19 entries, 2,211.80 KiB (Phase 1: 938 KiB). Largest file `assets/content-BVzfO9vE.js` 1,116,094 bytes (262.41 kB gzip), 53% of the 2 MiB per-file precache limit |
| 8 | Lando's 15-point audit on every changed code file | **pass** | 56 app files changed in Phase 2 plus QA's 15; details below |

## Commands and key output

| Command | Result | Key lines |
|---|---|---|
| `npm run content` (start of pass) | exit 0, 1.7 s | `573 items (quickcard 14, drill 31, equipment 22, fixnode 89, flashcard 129, lesson 31, product 21, quizquestion 167, sop 31, glossaryterm 38), 0 customer-safe, 0 superseded left out, 6 sign-off files, 61 synonym groups, 246 search documents, search cases 99 of 99 passed` |
| `npx vitest run tests/unit/search-cases.test.ts` (before QA's change) | exit 1 | `4 failed \| 16 passed`: the Phase 1 test expected every bundle item in the index (only 246 of the 573 items are searchable now) and the seed sections as top results; `"gauge 85" top was fix-22 (kb 21)`, `"bike tire shine" top was fix-30`, `"backing plate" top was fix-23` (all three are right in Phase 2). Rewritten against `tests/search-cases.yaml` |
| `npm run test:e2e`, baseline (Phase 1 suites on the Phase 2 code, before QA's changes) | exit 1, 13.6 min | `907 passed`, `5 failed`: `hostile.spec.ts` "a sign-off address typed by hand finds no sign-off screen" at 5 widths, because `/academy/signoff` now matches `/academy/:lessonId` and shows "Lesson not found" (with All lessons and Search) instead of "No screen here". Not an app defect; QA's test updated |
| `npm run typecheck` | exit 0 | both programs clean |
| `npx oxlint --deny-warnings` | exit 0 | no output |
| `npm run check` (after QA's changes) | **exit 1**, 54 s | typecheck and lint clean; content as above; `Test Files 1 failed \| 60 passed (61)`, `Tests 1 failed \| 1291 passed \| 1 expected fail (1293)`. The failure: `src/features/cards/cards.test.tsx > CardView > shows each row, and the unverified badge only on the verify row`: `expected [ Array(2) ] to have a length of 1` (DEF-18). The expected fail is DEF-16 |
| `npx vitest run tests/unit` (QA's suites) | exit 0 | `Test Files 13 passed (13)`, `Tests 708 passed \| 1 expected fail (709)` |
| `VITE_BASE=/aurigen-directory/ npm run build` | exit 0 | `✓ 368 modules transformed`; `content-BVzfO9vE.js 1,116.09 kB (gzip 262.41 kB)`; `(!) Some chunks are larger than 1024 kB after minification`; `precache 19 entries (2212.27 KiB)`; `dist/index.html` links `/aurigen-directory/manifest.webmanifest`; manifest `start_url "."`, `scope "."` |
| `npm run build` (left in `dist/`) | exit 0 | `✓ 368 modules transformed`; `index 220.68 kB (gzip 68.56 kB)`, `search-index 310.13 kB (gzip 87.69 kB)`, `vendor 470.21 kB (gzip 146.24 kB)`, `content 1,116.09 kB (gzip 262.41 kB)`; same chunk warning; `precache 19 entries (2211.80 KiB)` |
| `npm run test:e2e` (full, both builds, after QA's changes) | **exit 0**, 21.9 min | `Running 1403 tests using 3 workers`; `1363 passed`, `40 skipped`; JSON stats `expected 1363, skipped 40, unexpected 0, flaky 0`. Readings: a 6 times slower CPU draws Home in 1038 to 1550 ms (limit 5000); Fix It then fix-01 in 479 to 935 ms and 737 to 988 ms, and "jerking" answers in 98 to 127 ms on that CPU; the offline copy holds 19 entries; Customer View checked 249 addresses at 375 px |
| `npx playwright test tests/adversarial/phase2-hostile.spec.ts` (after the run, the Read aloud test corrected) | exit 0 | `45 passed`; the double tap on Read aloud is now `test.fail` (DEF-23) and fails as expected at 5 widths: annotation `speak, cancel; buttons Resume, Repeat, Stop reading` |
| `npm run check` (final, after every QA change) | **exit 1**, 61 s | same as above: `Tests 1 failed \| 1291 passed \| 1 expected fail (1293)`; the failure is DEF-18 |
| Lighthouse 13.5.0, mobile, 3 runs on Home | ran | performance **0.76, 0.83, 0.81**; accessibility 1.00; best practices 1.00; SEO 0.54 (noindex on purpose); FCP 3.5, 0.9, 2.1 s; **LCP 4.7 s** every run (score 0.33); TBT 30 ms; CLS 0.001, 0.001, 0.008. Scripts on the first load: `index` 67 KiB, `vendor` 142 KiB, `content` 255 KiB, `search-index` 84 KiB (transfer) |
| Lighthouse 13.5.0, mobile, `/fixit/fix-01` | ran | performance 0.83, accessibility 1.00, best practices 1.00; FCP 2.1 s, LCP 4.4 s, TBT 80 ms, CLS 0.001 |
| Lighthouse 13.5.0, `--preset=desktop` | ran | performance 0.99, accessibility 1.00, best practices 1.00; LCP 0.8 s, CLS 0 |
| Installability (DevTools Protocol) | ran | `installability errors []` |
| axe-core 4.14 (WCAG 2.0 to 2.2 A and AA, best practice), scratch sweep | ran | 314 screens: all 246 content pages and 6 lists at 375 px (Shop), a tenth at 1440 px, a tenth at 768 px in Academy density, after the load animation ends. Only rule hit: `heading-order` (best practice), 1 node on each product and tool page (DEF-19). `color-contrast` 0 (a first sweep that ran during the load animation flagged faded tiles; with the animation finished there are none) |
| Content scans (scratch probes, kept in the unit tests) | ran | numbers not found in the knowledge base: 38 distinct values, every one in the verification log, BLUEPRINT 12 (an accepted default), or a quiz scenario input (a reading of 94, a 2021 SUV); dollar amounts: every one in the knowledge base or the log except two quiz distractors ($200, $260), never the right answer |

Nothing was left running: Playwright stopped both servers, the scratch preview servers on 4180 (Lighthouse) and 4181 (the Read aloud probe) were stopped, and ports 4173, 4174, 4180, and 4181 refuse connections. Lighthouse and axe-core ran from the scratch folder, never from the project. No git command was run.

## Defects (Phase 2, pass 1)

Severity for Phase 2: blocks-gate (a gate check fails or the branch cannot go green), fix-before-deploy (fix before this phase merges to `main`, which deploys the Pages link Lando installs from), later. Owners from `docs/OWNERSHIP.md`; a content defect goes to the owner of the file.

### DEF-18 (blocks-gate, app-engineer): `npm run check` is red on a stale card test

- **File.** `src/features/cards/cards.test.tsx`, "CardView > shows each row, and the unverified badge only on the verify row" (line 128).
- **What happens.** The test renders the real `card-pad-ladder` and expects exactly one "unverified" badge, on the HF finishing pads row. The fact application set `content/products/product-meguiars-ultimate-compound.yaml` to `status: verify` (it was house in the last commit), and that product is in the card's Related list, so `RelatedList` now draws a second badge on its row. The page is right: a verify item gets the badge wherever it is listed.
- **Reproduce.** From `masterclass/`: `npx vitest run src/features/cards/cards.test.tsx`. Result: `1 failed | 10 passed`, `AssertionError: expected [ Array(2) ] to have a length of 1`.
- **Fix.** Count the badges inside the card's rows only (the `dl` labelled with the card title), or load the test fixture bundle instead of the real content, so a content edit cannot break it. No content change.

### DEF-17 (fix-before-deploy, app-engineer): Lighthouse mobile performance 0.76 to 0.83 (target 90)

- **Files.** `src/core/content.ts` (the bundle is an eager `import.meta.glob`), `vite.config.ts` (the `content` chunk).
- **What happens.** The content bundle is 1,116,094 bytes (262 KB gzip) and loads before the first screen draws. Under Lighthouse's mobile throttling the largest paint moves from about 3.0 s (Phase 1) to 4.7 s on Home and 4.4 s on fix-01; TBT stays 30 to 80 ms and CLS 0.001, so the loss is the download in the critical path. Vite also warns `Some chunks are larger than 1024 kB`. On an installed phone the chunk comes from the offline copy, but it is still parsed before the first screen, and the 2 MiB per-file precache limit (D1) is 53% used before Levels 5 to 8 and the customer content arrive.
- **Reproduce.** `npm run build`, serve `dist/` (`npx vite preview --outDir <copy of dist> --port 4180`), then `lighthouse http://localhost:4180/` (mobile default) three times: performance 0.76, 0.83, 0.81; LCP 4.7 s; `network-requests` lists `content-*.js` 255 KiB before the first paint.
- **Fix ideas (owner's choice).** Draw the shell and Home before the content arrives (import the bundle after first paint, with the existing "content missing" status as the fallback), and split what no Phase 2 screen reads out of the eager chunk: drills, quiz questions, flashcards, and sign-offs are about 325 KiB of the 1,111 KiB JSON, and the `sources` records another 251 KiB. Recheck: Lighthouse mobile 0.90 or more on 3 runs, and the offline tests still pass.

### DEF-16 (fix-before-deploy, learning-designer): a flashcard answer holds a pending decision

- **File.** `content/academy/flashcards/flash-towels-washer.yaml`, `back`.
- **What happens.** The answer reads "Product pile, the house says hot and one towel maker says warm or cold, never hot; Lando decides (pending)." A flashcard answer must not depend on a decision Lando has not made (the brief, check 2). The card is honest, but the right answer to "What water ... do the microfiber towels get?" is not settled, so a crew member cannot get it right.
- **Reproduce.** `npx vitest run tests/unit/phase2-truth.test.ts -t "DEF-16"`: the test is `it.fails` and passes, which means the defect is present. A scan of every flashcard answer and every right quiz answer for "(pending)", "Lando decides", "not settled", "speed 4", "10 lb", "loose grip", and "face down on a rack" finds only this one.
- **Fix.** Keep the settled parts in the answer (follow the care tag; water-only pile warm; dye-free, fragrance-free detergent; full cycle; extra rinse) and leave the product-pile temperature to the lesson and fix-76, which already show the house line, the towel maker's line, and the pending row. Then flip the `it.fails` (QA).

### DEF-23 (later, app-engineer): a double tap on Read aloud pauses the reading at once

- **File.** `src/features/shared/ReadAloud.tsx` (the same spot holds "Read aloud", then "Pause" the moment the voice starts).
- **What happens.** The first tap starts the voice and the button under the thumb becomes "Pause" in the same render. The second tap of a gloved double tap lands on Pause, and `pause()` stops the voice (it keeps the place for Resume). The person hears a word or nothing, and sees Resume. This is the Phase 1 DEF-04 pattern (a double tap landing on the next control) on the v1 line's own button.
- **Reproduce.** `npx playwright test tests/adversarial/phase2-hostile.spec.ts -g "double tap Read aloud"`: `test.fail` at 5 widths, annotation `speak, cancel; buttons Resume, Repeat, Stop reading`. Scratch probe with a stand-in voice: a second tap 40, 80, 150, 250, or 400 ms after the first, by touch at 375 px and by mouse at 1440 px, always ends paused (`speak@888, cancel@949`).
- **Fix ideas.** Hold the swapped button for the tap guard the PIN pad uses (about 350 ms, `useTapGuard`), or keep Pause out of the spot Read aloud was in. Then flip the `test.fail` (QA). Fix before the Phase 3 garage test at the latest.

### DEF-19 (later, app-engineer): product and tool pages skip from h1 to h3

- **File.** `src/features/search/ItemDetail.tsx` (`Heading` renders `h3`; the section around it has no `h2`).
- **What happens.** On 41 item pages (21 products: "What it is for", "Dilutions", "Never for"; 20 tools: "Checks") the headings go h1 then h3. axe `heading-order` (best practice), 1 node per page, at every width and density. A screen reader user jumping by heading level misses them.
- **Reproduce.** Open `/items/product-meguiars-m210` and list the headings: `h1 Meguiar's M210...`, then `h3 What it is for`. The scratch axe sweep lists the rule on every product and tool page.
- **Fix.** `h2` for these headings (or a titled `Section`).

### DEF-20 (later, architect then content-curator): two products hold the Tesla conflict in a paragraph, not in rows

- **Files.** `content/products/product-armor-all-extreme-wheel-tire.yaml`, `content/products/product-meguiars-ultimate-compound.yaml` (`labelNotes`); the schema `src/schemas/content-shop.ts` (product `jobs` and `neverFor` are plain strings).
- **What happens.** Wherever content touches a Tesla, the house line, Tesla's manual line (sourced, with its URL), and "Lando decides how this applies to Teslas (pending)" (verify) are to be separate rows. On these two product pages all three sit inside one `labelNotes` paragraph, so no "pending" badge is drawn on the pending sentence. Both items are status verify, so the page still carries the "unverified" badge at the top, and the words say pending; nothing is presented as settled. The schema README's pattern section names where the three rows go for fixes, SOPs, lessons, and drills, but not for products, and a product has no field that takes a line with its own status.
- **Reproduce.** Open `/items/product-armor-all-extreme-wheel-tire`: the Tesla lines are in the last paragraph with no badge of their own.
- **Fix.** Architect: a `notes: Line[]` field on products (or name `jobs` as `Line[]`), and a line in the README pattern section. Then content-curator: move the three lines into it.

### DEF-21 (later, content-curator, with learning-designer's curriculum): Levels 5 to 8 have no outline lessons in the app

- **Files.** `content/lessons/` (no `level` 5 to 8 file); `docs/CURRICULUM.md` "Levels 5 to 8 (outline only)" ("23 outline lessons planned").
- **What happens.** OWNERSHIP names `content/lessons/` as holding "Levels 0 to 4 full, 5 to 8 outlines", and the schema has `outline: true` for them. None was written, so `/academy` shows each of Levels 5 to 8 as "An outline in v1." followed by "No lessons in this build yet." The outline is complete in `docs/CURRICULUM.md`, which Lando reads; it is not in the app.
- **Reproduce.** Open `/academy`, scroll to Level 5.
- **Fix.** Write the 23 outline lessons from the curriculum (a short why and the topics as steps), or change the level line so the screen does not promise an outline it does not show.

### DEF-22 (later, troubleshooter, with business-customer in Phase 4): two knowledge base 24 cases are parked

- **File.** `tests/search-cases.yaml` (the two commented cases under Part 2).
- **What happens.** "price suv full detail" (15.1) and "store it clean" (12.2) are not run: their answers are price items, which have no page and are left out of search until Phase 4 (`SEARCH_TYPES`). 41 of the 43 knowledge base 24 rows run and pass. QA's test pins the parked pair, so a third one cannot quietly drop out.
- **Fix.** Turn both back on when price items get pages (Phase 4).

Also seen, not filed (writing only): five lesson and fix steps are a maker's quote rather than one action (`lesson-l2-03-wipe-dress` steps of 268 and 283 characters, `lesson-l2-05-glass` 286, `lesson-l1-02-pre-rinse` 166, `fix-79` 178, `fix-81` 182). They are allowed by the README pattern ("in a lesson they are numbers rows or lines"), but they read aloud as long blocks; moving them to `numbers` or `notes` would keep the steps to one action each.

## Content audit

All of it runs inside `npm run check` (QA's `tests/unit/phase2-*.test.ts`) on the bundle the content build makes, so it re-runs on every content edit. Paragraph fields (a lesson's why, a Markdown body) are judged one sentence at a time with the sentence or two after it, so "... 3 cups water. That ratio is not confirmed yet." passes and a bare statement fails; a self-test in the same file proves the scanner flags a bare statement.

| Rule | Result | How |
|---|---|---|
| No superseded fact (knowledge base 23 and 9.1) as current | pass | IPA 50/50, Pro Speed, CM-224, the booklet's haze 3 to 5 minutes, foam cannon pre-soak, "under 70 to 80", "[YOUR PRICE]", microfiber cutting pads, "need compound and don't have it", pads and towels both warm, Wash & Wax before a polish: every hit says the guidance is old, never used, or not settled (a "Never in the bucket" row, a mistakes line, a booklet note). 0 superseded items in the bundle |
| The fact-checker's corrections applied | pass | FC-02 (strip ratio not "the label"), FC-08 (17.5%), FC-10 (M210 "even on" dark paint), FC-18 (M8 from the HF page), FC-26 (wheel cleaner 30 seconds), FC-29 (tire shine at least 3 to 5 minutes), FC-66 (maroon medium cut), FC-67 (1 in. foam), FC-71 (clear coat 35 to 50 µm): 0 old wordings outside a note that records the correction |
| No market research figure; 15.5 never cited | pass | 0 hits for market research, competitor, going rate, industry average, average price, 15.5. Every dollar amount is in the knowledge base or the log, except two quiz distractors ($200, $260) that are never the right answer |
| No aftercare line (FC-06) | pass | 0 hits for "first 24 hours", "keep it dry", "still setting up"; no file under `content/customer/` |
| No em or en dash | pass | 0 in the 580 files under `content/` (synonyms and sign-offs included), `tests/search-cases.yaml`, and `docs/CURRICULUM.md` |
| No status tag in brackets inside text | pass | 0 in every string of 573 items |
| Every item internal | pass | 573 of 573 `visibility: internal`; build stats `0 customer-safe` |
| Open facts carry verify | pass | IPA ratio, below about 50 F, 2,000 W generator, APC 10:1 and 4:1, 25 to 35 gallons, Monthly Maintenance, the insurance walk-away line, the ShineMate fit, the trim-safe cleaner, the one-minute Bug & Tar wait: every line or row that states one is verify, or says in the next sentence that it is not confirmed |
| Blazin' Banana, Tuff Stuff, HF finishing pad colors on no card or SOP step (BLUEPRINT 12 items 8, 9) | pass | 0 |
| Every verify line renders with its badge | pass | `phase2-pages.spec.ts` at 5 widths: 262 "unverified" and 181 "pending" badges found exactly on their lines and rows across the 246 pages, and every verify item (16 with pages) has its own badge at the top |
| Never in Customer View | pass | `phase2-customer-view.spec.ts` (all 246 addresses): no badge, no line, nothing internal in the page or the tree |
| Tesla (FC-16) | pass, except DEF-20 (later) | every Tesla-only fix, SOP, card, lesson, and drill that uses wheel cleaner, a pre-soak, or compound carries Tesla's manual line (sourced) and a "(pending)" row (verify); no line written for a Tesla states one of the three as settled; no quiz asks about them on a Tesla. The two product pages hold the same three statements in a paragraph (DEF-20) |
| Speed and pressure (FC-22, FC-23) | pass | all 16 items that say speed 4 or about 10 lb (the machine settings card, 6 drills, the 56367 tool, fix-01, fix-02, 4 lessons, 2 SOPs) carry the manual's "slower speeds" and "pressure off" lines (sourced) and a pending row (verify) |
| Other conflicts shown the same way | pass (scratch probe) | FC-28 tire shine on the applicator, FC-55 grip, FC-70 pad drying, FC-88 towel water, FC-33 camera lenses, FC-36 touchscreen: every house line sits with the maker's line and a pending row (the HF pad uses the 56367 manual's washing line, as FC-25 says) |
| No quiz answer or flashcard depends on a pending decision | **fail, DEF-16** | 167 right answers and 129 flashcard answers scanned: one flashcard (`flash-towels-washer`) |
| House rule 12 and the crew's next step (pre-build answer 6) | pass | "The label on the bottle beats this app" is house wherever it appears; every "What crew does next" row is verify and says "Lando decides (pending)" (fix-04, fix-80, lessons l0-01, l2-03, l4-02, two drills, two SOPs) |
| Lando's own words (pre-build answer 5) | pass | `synonyms.yaml` opens with the commented block "Lando's own words (pending)" |
| Level 0 order (pre-build answer 7) | pass | `docs/CURRICULUM.md` "Level 0 order (Lando may reorder)" |
| Writing rules | pass | every item has 4 or more search words and at least one related link; every page links on to another page; quiz choices distinct; the right answers spread over positions 0 to 3 (43, 37, 46, 41) |

### The number sample (70 numbers, all seven types)

Each row is a test in `tests/unit/phase2-numbers.test.ts`: the item says the words, the source says its words, and the numbers in both are the same. "Renders as" is the status of the line the number sits on; "(paragraph)" means a Markdown paragraph or a flashcard or quiz text, which carries the item's status. 70 of 70 match.

| # | Item | The item says | Renders as | Source | The source says |
|---|---|---|---|---|---|
| 1 | `lesson-l0-01-rules-that-never-bend` | until 25 cars are logged | house | knowledge base | until 25 cars are logged |
| 2 | `lesson-l0-02-stay-safe` | at least 30 seconds | sourced | verification log | run 30 seconds off the car |
| 3 | `lesson-l0-04-how-paint-works` | 100 to 180 µm | sourced | knowledge base | about 100 to 180 µm |
| 4 | `lesson-l0-04-how-paint-works` | 35 to 50 µm (1.5 to 2 mils) | sourced | verification log | 1.5 to 2.0 mils (35 to 50 microns) |
| 5 | `lesson-l0-06-shop-setup` | 1 hour in warm soapy water | house | knowledge base | soak 1 hour in warm soapy water |
| 6 | `lesson-l1-01-wheels-first` | 30 seconds | sourced | verification log | 30 seconds, not about a minute |
| 7 | `lesson-l1-03-towel-wash` | 16 microfiber towels in quarters | house | knowledge base | 16 microfiber towels in the bucket, one per panel, folded in quarters |
| 8 | `lesson-l1-04-hard-water-drying` | Rinse, dry, and jambs, 20 min | house | knowledge base | rinse/dry/jambs 20 |
| 9 | `lesson-l2-05-glass` | Glass towels per full detail: 4 | house | knowledge base | glass 4 |
| 10 | `lesson-l2-06-full-interior` | Sedan $150, SUV or truck $180 | house | knowledge base | \| Interior Only \| $150 \| $180 \| |
| 11 | `lesson-l3-03-thickness-bands` | 100 µm or more | house | knowledge base | \| 100 µm or more \| Full ladder permitted |
| 12 | `lesson-l3-02-tc100-gauge` | 4 to 6 mils (100 to 150 µm) | verify | verification log | about 4 to 6 mils (100 to 150 µm), highest on the hood (forum) |
| 13 | `sop-clay` | 2 x 2 ft | house | knowledge base | Work 2 x 2 ft sections |
| 14 | `sop-measure` | about 220 µm or more | house | knowledge base | (about 220+) |
| 15 | `sop-measure-tesla` | More than 40 µm below the median | house | BLUEPRINT 12 (accepted) | more than 40 µm below the median of the other measured panels |
| 16 | `sop-polish` | speed 1 to 2 | house | knowledge base | Spread on speed 1 to 2 |
| 17 | `sop-polish` | 4 to 6 sets | house | knowledge base | 4 to 6 sets per square |
| 18 | `sop-polish-tesla` | 3 drops | house | knowledge base | 3 drops worked into the face |
| 19 | `sop-setup` | 15 minutes | verify | knowledge base | Setup target time: 15 minutes |
| 20 | `sop-test-spot` | under 100 µm | house | knowledge base | reads 100 µm or more |
| 21 | `sop-wheels-tesla` | Let it work 30 seconds | sourced | verification log | Allow the foam to penetrate for 30 seconds |
| 22 | `sop-wash` | 3 to 4 minutes | house | knowledge base | Pre-rinse on jet 3 to 4 minutes |
| 23 | `card-bucket-mix` | 4 gal | house | knowledge base | 4 gal water + 4 oz CG Citrus Wash & Gloss |
| 24 | `card-clay-tub` | 1 gal | house | knowledge base | 1 gal water + 1 oz Citrus Wash & Gloss |
| 25 | `card-ipa-wipe` | 1 cup | verify | knowledge base | 1 cup 70% IPA + 3 cups water |
| 26 | `card-ipa-wipe` | 17.5% alcohol | verify | verification log | (17.5% alcohol) |
| 27 | `card-machine-settings` | About 1 inch per second | house | knowledge base | About 1 inch per second |
| 28 | `card-machine-settings` | About 10 lb | house | knowledge base | About 10 lb of pressure |
| 29 | `card-thickness-bands` | about 220+ | house | knowledge base | (about 220+) |
| 30 | `card-pad-ladder` | x2 | house | knowledge base | Maroon 6 in. x2 |
| 31 | `card-tesla-wash-mode-tape` | Controls > Service > Car Wash Mode | sourced | knowledge base | Controls > Service > Car Wash Mode |
| 32 | `card-bike-rules` | A 3 in. machine comes later | house | knowledge base | A 3 in. machine comes later |
| 33 | `fix-01` | speed 1 to 2 | house | knowledge base | spread at speed 1 to 2 |
| 34 | `fix-01` | about 10 lb | house | knowledge base | pressure over ~10 lb |
| 35 | `fix-01` | 1-888-866-5797 | sourced | knowledge base | 1-888-866-5797 |
| 36 | `fix-04` | 1 to 2 drops | house | knowledge base | mist the pad face with water; 1 to 2 drops |
| 37 | `fix-05` | 4 to 6 sets | house | knowledge base | 4 to 6 sets, wipe once at the end |
| 38 | `fix-14` | 3 to 4 minutes | house | knowledge base | jet 3 to 4 minutes |
| 39 | `fix-18` | 2 to 3 sprays | verify | knowledge base | 2 to 3 sprays on a clean damp towel |
| 40 | `fix-21` | 20 µm | sourced | knowledge base | 20 µm swings within a foot are normal |
| 41 | `fix-22` | Under 75 | house | knowledge base | \| Under 75 \| No machine |
| 42 | `fix-23` | 5/16 in.-24 | sourced | knowledge base | is 5/16 in.-24 thread |
| 43 | `fix-23` | $23.05 | sourced | verification log | $23.05 |
| 44 | `fix-26` | 9 mph | sourced | verification log | 9 mph |
| 45 | `fix-33` | 50 F | verify | knowledge base | below about 50 F |
| 46 | `fix-81` | five body cameras | sourced | verification log | five (2020 to 2024) |
| 47 | `fix-88` | $1.50 per mile | house | knowledge base | $1.50 per mile outside Tooele |
| 48 | `fix-89` | 24 hours | house | knowledge base | 24 hours notice or the deposit stays |
| 49 | `quiz-l0-ground-rules-05` | 1 hour in warm soapy water | house | knowledge base | soak 1 hour in warm soapy water |
| 50 | `quiz-l1-02-pre-rinse-01` | 3 to 4 minutes | house | knowledge base | Pre-rinse on jet 3 to 4 minutes |
| 51 | `quiz-l1-wash-decon-04` | 30 | house | knowledge base | contact wash 30 |
| 52 | `quiz-l3-03-bands-02` | 90 to 99 | house | knowledge base | \| 90 to 99 \| Polish only |
| 53 | `quiz-l3-02-gauge-03` | 20 µm | sourced | knowledge base | 20 µm swings within a foot are normal |
| 54 | `quiz-l4-test-spot-04` | 3 to 4 sets | house (paragraph) | knowledge base | maroon + Ultimate Compound (3 to 4 sets) |
| 55 | `quiz-l4-06-pads-plate-01` | 5/16 in.-24 | sourced (paragraph) | knowledge base | is 5/16 in.-24 thread |
| 56 | `quiz-l4-06-pads-plate-02` | 1-888-866-5797 | sourced (paragraph) | knowledge base | HF tech/parts line 1-888-866-5797 |
| 57 | `flash-gauge-mil` | 25.4 µm | house (paragraph) | knowledge base | 1 mil = 25.4 µm |
| 58 | `flash-ladder-rung-3` | 3 to 4 sets | house (paragraph) | knowledge base | maroon + Ultimate Compound (3 to 4 sets) |
| 59 | `flash-machine-test-run` | at least 30 seconds | sourced (paragraph) | verification log | run 30 seconds off the car |
| 60 | `flash-policies-cancel` | 24 hours | house (paragraph) | knowledge base | 24 hours notice or the deposit stays |
| 61 | `flash-prices-full-detail` | Sedan $230. SUV or truck $280 | house (paragraph) | knowledge base | \| Full Detail (no polish) \| $230 \| $280 \| |
| 62 | `flash-times-wash-slots` | contact wash 30 | house (paragraph) | knowledge base | contact wash 30 |
| 63 | `flash-towels-per-detail` | 24 to 30 | house (paragraph) | knowledge base | Call it 24 to 30 |
| 64 | `flash-prices-example-mobile` | $328 | house (paragraph) | knowledge base | = $328 |
| 65 | `drill-l0-explain-paint` | 1 mil | house | knowledge base | 1 mil = 25.4 µm |
| 66 | `drill-l1-dry` | 20 min | house | knowledge base | rinse/dry/jambs 20 |
| 67 | `drill-l1-wheels` | 30 seconds | sourced | verification log | Allow the foam to penetrate for 30 seconds |
| 68 | `drill-l3-gauge-sheet` | the 11 panels | sourced | knowledge base | 11 panels x 3 readings |
| 69 | `drill-l4-marker-line` | speed 1 to 2 | house | knowledge base | Spread on speed 1 to 2 |
| 70 | `drill-l4-timed-square` | 4 minutes | house | knowledge base | About 4 minutes per 2 x 2 ft section |

## Lando's 15-point audit on the changed code files

Files: the 56 app files changed or added in Phase 2 (`git diff --name-only cb07ee8` plus untracked, under `src/` and `scripts/`): `scripts/content/pipeline.ts`; `src/app/routes.tsx`, `src/app/screens/Home.tsx`, `src/app/__tests__/shell.test.tsx` (and `src/app/screens/AcademyOutline.tsx` removed); `src/core/content.ts`, `search.ts`, `searchEngine.ts` and their tests; `src/features/academy/` (8 files), `cards/` (4), `fixit/` (8), `search/` (9), `shared/` (13); `src/schemas/README.md`, `common.ts`, `content-academy.ts`, `content-shop.ts`, `content-phase2.test.ts`. Plus QA's 15 files listed under "Tests added or changed by QA".

| Tier | Result | Notes |
|---|---|---|
| 1 Structure | pass | both `tsc` programs clean, `oxlint --deny-warnings` clean, both builds compile; every file ends cleanly |
| 2 Logic | pass | every `switch` (searchEngine `bodyText`, Markdown blocks and heading levels, ItemDetail) has a `default` (two end in a `never` check); every page has an unknown-id screen with two ways out; empty lists say so ("No lessons in this build yet.", "No procedures in this build yet.", an empty Fix It grid keeps search and cards); the content-missing status shows on the Academy |
| 3 Journey | pass | walked by the crawl (every button on 246 pages and the 4 lists, at 375 px) and the v1 line at 5 widths; no tap does nothing, no tap lands on "not found" |
| 4 Runtime | pass | no storage access added; no `console` call outside tests; no `window.self`, `window.top`, `btoa`, `eval`, `innerHTML`, or `dangerouslySetInnerHTML` (Markdown builds React elements and keeps a link's words only); 0 page and 0 console errors in every new browser test; hostile addresses with `<img onerror>` and `<script>` in the path, query, and hash run nothing |
| 5 Build rules | pass | no file over 400 lines (largest app file `scripts/content/pipeline.ts` 297, `src/core/searchEngine.ts` 270; largest QA file `tests/adversarial/hostile.spec.ts` 355, `tests/fixtures/app.ts` 334) |

Specific checks: colors only from tokens (no hex, rgb, hsl, oklch, or color-mix in the 4 new CSS files; the only non-token values are `inherit` and `currentColor`); 0 em or en dashes in 879 project files (src, content, scripts, tests, docs, knowledge, public, configs); no `overflow: hidden` or `clip`, no `max-height`, no `:hover` in any new CSS; 44 px targets everywhere and 64 px tall in Shop density on every content page at 5 widths (`phase2-pages.spec.ts`); no secret, key, or address added.

## Tests added or changed by QA

| File | Change |
|---|---|
| `tests/unit/search-cases.test.ts` | rewritten for Phase 2: reads `tests/search-cases.yaml` (troubleshooter's) and runs every case on the index as the app ships it; the first row on screen (what Enter opens) is the top result; every knowledge base 24 row is a case except the 2 parked (pinned); each section 24 top result comes from its section or named fix (two fix seeds that hold the section's fact are named); slowest query and index load timed; the v1 word typed 9 ways; garbage and 2,800-character queries; no drill, quiz, or flashcard in results |
| `tests/unit/phase2-truth.test.ts` | new: the truth and writing rules above, with DEF-16 as `it.fails`, and a self-test of the sentence scanner |
| `tests/unit/phase2-counts.test.ts` | new: Fix It count, curriculum against lessons, drills, quizzes, sign-offs, flashcard decks, search words, related links, no dead-end page |
| `tests/unit/phase2-numbers.test.ts` | new: the 70-number sample, printed with each line's status |
| `tests/fixtures/contentAudit.ts` | new: the content build once per file, text units with the status they render with, the curriculum table parser, the sentence scanner |
| `tests/fixtures/bundle.ts` | new: the generated bundle for the browser suites, page routes (the app's own `pageRoute`), the Related rule, the badge each line must carry |
| `tests/fixtures/app.ts` | `ROUTES` gains 9 Phase 2 addresses (3 fixes, a card, 2 items, a lesson, the procedures list, a Tesla procedure), so the route, accessibility, and privacy suites cover them at 5 widths |
| `tests/adversarial/hostile.spec.ts` | the sign-off address test updated for `/academy/:lessonId` ("Lesson not found" is a right answer too) and widened to 9 addresses; new: a quiz question, flashcard, or drill opened by hand shows no answer |
| `tests/e2e/phase2-v1.spec.ts` | new, 9 tests x 5 widths: the v1 line |
| `tests/e2e/phase2-pages.spec.ts` | new, 10 chunks x 5 widths: every content page |
| `tests/e2e/phase2-links.spec.ts` | new, 10 tests at 375 px (skipped at other widths): the crawl |
| `tests/e2e/pages-base.spec.ts` | new test: Phase 2 pages under `/aurigen-directory/`, a Pages deep link to fix-01, a Related tap, search, an offline reload |
| `tests/persistence/phase2-offline.spec.ts` | new, 2 tests x 5 widths: airplane mode with the Phase 2 content |
| `tests/privacy/phase2-customer-view.spec.ts` | new, 3 tests x 5 widths: every content address, refresh flashes, Back and Forward |
| `tests/adversarial/phase2-hostile.spec.ts` | new, 9 tests x 5 widths: double taps (tile, Related row, search result, Read aloud: `test.fail`, DEF-23), 18 hostile addresses, no IndexedDB, 320 px, a 6 times slower CPU, a 5,000-character paste. The Read aloud test first asserted only that `pause` was never called; the app pauses with `cancel`, so the first version passed while the defect was there. Corrected after the full run and re-run at 5 widths |

`playwright.config.ts` is unchanged. Known defects in QA's tests: DEF-16 (`it.fails`, unit) and DEF-23 (`test.fail`, browser). They pass while the defect is open and fail the day it is fixed; QA then flips them. DEF-17, DEF-18, DEF-19, DEF-20, DEF-21, and DEF-22 have no QA test that fails today: DEF-18 is itself a failing owner test, DEF-17 is a Lighthouse figure, and the rest are recorded here.

## Defect register, Phase 2 (after pass 1; the current register is in pass 2 above)

| ID | Severity | Owner | File | One line | Pass 1 |
|---|---|---|---|---|---|
| DEF-18 | blocks-gate | app-engineer | `src/features/cards/cards.test.tsx` | A unit test counts badges on the real pad ladder card; a content status change made `npm run check` red | new, open |
| DEF-17 | fix-before-deploy | app-engineer | `src/core/content.ts`, `vite.config.ts` | The 1.09 MiB content chunk loads before the first screen: Lighthouse mobile 0.76 to 0.83, LCP 4.7 s | new, open |
| DEF-16 | fix-before-deploy | learning-designer | `content/academy/flashcards/flash-towels-washer.yaml` | A flashcard answer holds the pending towel-water decision (FC-88) | new, open |
| DEF-23 | later | app-engineer | `src/features/shared/ReadAloud.tsx` | A double tap on Read aloud lands on Pause: the reading stops at once | new, open |
| DEF-19 | later | app-engineer | `src/features/search/ItemDetail.tsx` | 41 product and tool pages go from h1 to h3 (axe heading-order) | new, open |
| DEF-20 | later | architect, then content-curator | `src/schemas/content-shop.ts`; two product files | The Tesla house line, manual line, and pending row sit in one paragraph on two product pages | new, open |
| DEF-21 | later | content-curator (curriculum: learning-designer) | `content/lessons/` | No outline lessons for Levels 5 to 8; the Academy says "An outline in v1." then "No lessons in this build yet." | new, open |
| DEF-22 | later | troubleshooter, with business-customer in Phase 4 | `tests/search-cases.yaml` | Two knowledge base 24 cases parked until price items have pages | new, open |

The Phase 1 register (DEF-01 to DEF-15) is below, all closed; every test written for them still passes in the full run.

## What only the phone can answer (Phase 2 additions)

The Phase 1 list below still stands. Add these once this build is on the Pages link:

- [ ] With signal, open the installed app and wait for **Ready offline**. Airplane mode. Tap Fix It, then "Polisher jerks, walks, or hops side to side": the fix opens. Tap Read aloud: the voice reads the STOP lines first, then the steps. Lock the screen: write down whether the voice keeps going. ______
- [ ] Still in airplane mode: Search, say "jerking" with the keyboard mic: the jerking fix is the first row. Then open the Academy, Level 4, "One full square": the lesson opens.
- [ ] Time the first open after a reboot (not the first install): how many seconds from the icon to the Home screen? ______ (DEF-17 is about this on a slow first load)
- [ ] On a fix page with gloves on: double-tap Read aloud. Does it keep reading? Yes / No

# Phase 1 gate record (passes 1 to 4, 2026-10-11, kept as written)

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
