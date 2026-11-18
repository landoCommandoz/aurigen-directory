# AURIGEN HANDOFF DOCUMENT
## Updated after every session. Read before every session.

### SESSION (2026-11-17, evening): HEADER FIXED ON PHONES, FRAUNCES SELF-HOSTED, MARYLAND BACK, LESSONS EDITED

Three jobs plus an edit pass on the parked lessons. Everything below is live except the lessons.

- **The header nav no longer clips the Free Rules Sheet link.** `.top` wrapped the nav to its own
  row correctly; `.top nav` was the half that was missing, `flex: none` with no `flex-wrap`, so it
  laid out at its natural 427px and ran off every phone while `body { overflow-x: hidden }` hid the
  evidence. Now: `flex-wrap: wrap` as a real safety net, and below 640px `.top nav a` is `.85rem`
  with `.2rem` side padding and `.top` has `.75rem` side padding, so five links fit one row with
  **47px of headroom at 360px even after the webfont swaps** (measure headroom as row width minus
  the sum of the links' natural widths; `justify-content: space-between` makes the last link's
  right edge useless as a fit test, which cost an hour). Every link visible and 44px tall at 360,
  375, 390, 412 and 430; no horizontal scroll at any width; 768, 1024 and 1440 unchanged. Header
  126px to 123px. Nothing removed, renamed or reordered, Start Here still first.
- **Fraunces is served from theplatbook.com.** `cloudflare/src/fonts/`, copied to
  `/assets/fonts/` by `build-site.mjs`. Weight 600 only, which is every rule that uses
  `var(--head)`. The `opsz` axis is kept because `font-optical-sizing` is auto and the headings
  were measured with it on; dropping it would halve the file to 18KB but change heading widths by
  up to 5 percent and therefore the line breaks, which is the thing being fixed. **Licence: SIL
  Open Font License 1.1**, which permits self-hosting; `OFL.txt` ships beside the files. The
  Google request keeps Public Sans and Space Mono, still non-blocking, still `display=swap`.
- **It fixed the last shift.** Home headline at 360px moved 36px, now 0px at 360, 390 and 412, on
  the live site. Measure the **layout box** (`offsetTop`/`offsetHeight`), not
  `getBoundingClientRect`: the hero's `rise` animation is a transform and makes a still headline
  look like it moved 8px.
- **IT COSTS FIRST PAINT, AND THAT IS A KNOWN, MEASURED REGRESSION.** Medians of five, cache off,
  text compressed, Lighthouse mobile throttle: home 996 to 1,148ms at 360px, 960 to 1,140ms at
  390px; `/state/fl/` 724 to 804ms, `/state/ga/` 648 to 736ms. **Preloading on the home page alone
  was tried and rejected**: the same-origin 35KB fetch delays the third-party body font just
  enough that a paragraph on a state page re-wraps and drags content 26px, which showed on 1 run
  in 10 at 360px where the old build showed 0 in 20. Preloading everywhere put it back to 0 in 14.
  The trade is 80 to 150ms against every shift on the site. One line in `page()` reverses it and
  the comment there says which.
- **Maryland's three county rates are back, each through the normal law check.** Anne Arundel
  1.5% a month / 18% a year (aacounty.org, Office of Finance); Cecil 1% a month / 12% a year
  (cecilcountymd.gov, Office of Finance); Baltimore City 12% on a principal residence and 18% on
  all other property (Baltimore City Code, Art. 28, § 8-1, on codes.baltimorecity.gov). Each has a
  snapshot, a quote found in it, a checked date and a recorded second read. **The pre-audit county
  fields stay off.** Three county domains were added to `official-domains.json`, each scoped to
  its own county. None of the three had to stay "varies by county".
- **UNRESOLVED ON PURPOSE, AND LANDO KNOWS: Baltimore City's codified 12% for a principal
  residence sits above the 10% state cap** in Tax-Prop. § 14-820(c) for owner-occupied residential
  property. Both lines are published, both are linked, neither is reconciled on the page. Do not
  quietly pick one.
- `check-law` needs `pass2` on every claim. A new supported claim records `"ok"`; ours record what
  the second read actually checked. `checked` must equal the snapshot's fetch date to the day, and
  the fetch date is UTC, so an evening fetch is tomorrow's date.
- Also: `Fla. Stat. § 95.192` cited a 2025 address while every other Florida line cited 2026. The
  2026 page returns 200, calls itself the 2026 Florida Statutes and carries the same operative
  sentence, so the claim and its Spanish twin moved. Zero 2025 links left in the Florida ledger.

**THE FIVE LESSONS: EDITED, STILL PARKED.** `LESSONS_APPROVED` is still false, 0 files under
`public/` mention them, 0 sitemap entries. Lando read the printed draft and sent seven changes;
all seven are done and the four standing rules that came out of it are at the top of
`lessons.mjs`. The one that matters most: **the lesson 4 worked example used 25 percent at twenty
three months, which Tex. Tax Code § 34.21 allows for neither property type** (other property
redeems within 180 days; a homestead in year two pays 50 percent). It is now one month against
twelve months on a homestead, with the arithmetic shown. Every other worked number in all five
lessons was re-checked against the statute cited on its own page. Every frequency claim was cut
rather than softened, every jab at seminars and courses is gone, every bare ledger fragment has a
plain-English lead-in above it, and each lesson opens with "The short version", three sentences
making no claim that is not cited lower on the same page. All 50 citations and the pending notice
are unchanged.

Suite: **117 pass, 0 fail**. Build clean, check-law PASS 51 states, pending states asserting
nothing 4 (GA, IN, NY, TN). Publish run 44226233665 success. Live checks after it: header fits at
all five phone widths, font and OFL.txt serve 200 from our own domain, Maryland reads correctly,
GA/IN/NY/TN still carry the pending notice and FL/TX do not.

### SESSION (2026-11-17, later): CORE WEB VITALS FIXED AND PROVED, FIVE LESSONS DRAFTED AND PARKED

Lando brought Cloudflare's real-visitor numbers from the last 21 days: a 0.11 layout shift seen
10 times, named on `#main > section.state-head > div.pending > p`, and LCP P50 256ms / P75 1,212ms
/ P90 3,856ms with 1,193ms of element render delay. Everything below was measured in real Chrome
(puppeteer-core driving the installed Chrome) on a Lighthouse mobile profile: 412x823 at DPR
2.625, 4x CPU throttle, 1.6Mbps down / 150ms RTT. Scripts are in the session scratchpad, not the
repo.

- **The layout jump was the font swap re-wrapping text, and nothing else.** Ruled out first, with
  measurements, not reasoning: the pending panel is already in the first HTML; nothing is injected
  by script; the Cloudflare beacon is `type="module"` so it runs after paint and draws nothing;
  `.state-head`'s `rise` animation is transform plus opacity, which the layout-instability spec
  excludes. What moves is the wrap. Public Sans is 4.3-4.9% WIDER than every sans the stack fell
  back to; Fraunces 600 is 7-10% NARROWER than Georgia. Measured on the live home page at 390px
  before the fix: the hero headline grew 36px (two lines to three) and the largest block below it
  moved 89px down. In an 844px viewport that is a shift of ~0.105. That is the reported 0.11.
- **Fix: eight `@font-face` rules in `src/site.css` that wrap a real system font and scale it.**
  `local('Segoe UI')`, `local('Roboto')`, `local('Helvetica Neue')/('Helvetica')/('Arial')`,
  `local('Georgia')`, `local('Noto Serif')`, `local('Times New Roman')`, `local('Consolas')`,
  `local('Courier New')`, each with `size-adjust` set to the measured width ratio and
  `ascent-override`/`descent-override` divided by that same ratio so the two rules that set
  line-height `normal` (`.btn`, `.map-pill`) keep their height. `--head`, `--body` and `--mono` in
  `:root` now list those faces between the webfont and the bare system names. A browser without
  `size-adjust` ignores them and behaves exactly as before. **`'Hoefler Text'` left the chain on
  purpose**: macOS-only, cannot be measured on this PC, and Georgia is on macOS too, so macOS now
  gets a measured face rather than a guess.
- **After, same method:** `/state/ga/` and `/about/` move NOTHING at 390px or 412px, on both the
  Segoe UI and the Helvetica fallback paths. Before, both moved 26px.
- **STILL OPEN, and it is Lando's call.** The home page hero headline can still gain one line in
  the swap window at ~390px. Fraunces needs 3 lines there where Georgia needs 2, and sweeping
  `size-adjust` from 86% to 100% gives 2 lines at every value: it is a line-break boundary, not a
  width error, so average-width matching cannot reach it. The cures are controlling that
  headline's wrap in the markup or self-hosting Fraunces (~35KB, one file). Not done.
- **First paint: the Google Fonts stylesheet is now `media="print" onload="this.media='all'"`,
  plus a `<noscript>` copy.** Still a link tag, still `display=swap`, which is what Lando asked
  for. It was one of only two render-blocking requests and the only third-party one. Safe to
  unblock ONLY because the fallback is now width-matched; doing this without that change would
  have traded CLS for LCP. **Proof, same page with only that one attribute different, third party
  stalled 2s:** FCP 2,724 -> 900ms on `/state/ga/` and 2,820 -> 872ms on `/`; LCP 3,092 -> 2,520
  and 3,232 -> 2,524. On a fast link the gain is small (live FCP 944 -> 900 on `/state/ga/`,
  1,068 -> 1,004 on `/state/fl/`; LCP 1,044 -> 1,040 and 1,332 -> 1,272) because the third-party
  round trip overlapped with `site.css`. The win is the P90 tail, which is where his problem was.
- **The stylesheet is deliberately NOT inlined, and the comment above `page()` says why.**
  Inlining its 8.7KB saves one same-origin round trip; it was tried and reverted because the
  pending-state guard reads the built HTML as a plain string and `site.css` defines `.pill.t-lien`
  and its three siblings, so every inlined page failed the build as a pending state shading
  itself, 16 problems. That guard is what keeps GA, IN, NY and TN stating no law. Anyone
  revisiting this strips the style element before those checks and never relaxes them.
- **FOUND, NOT FIXED, needs a decision: the header nav overflows every phone.** `.top nav` is
  `display:flex` with `flex: none` and no `flex-wrap`, so it lays out at its natural 427px. On a
  360px or 390px phone the `Free Rules Sheet` link's right edge is at 443px, off screen, and
  `body { overflow-x: hidden }` clips it silently instead of letting the visitor scroll to it.
  **The only link to the free product is invisible on a phone, on every one of the 57 pages**, and
  has been since the nav link was added on 2026-11-14. Verified live on `/`, `/start-here/` and
  `/state/ga/`. One declaration fixes it, but it changes the header on every page and was not part
  of the ask, so it was left alone.

**THE FIVE BEGINNER LESSONS: DRAFTED, PARKED, NOT LIVE.** New file
`cloudflare/scripts/lessons.mjs`. One switch, `LESSONS_APPROVED`, currently `false`. While it is
false `build-site.mjs` does not write the pages, does not add them to `sitemap.xml` and links them
from nowhere: verified after a build that 0 files under `public/` mention `start-here/lessons` and
the sitemap has 0 lesson entries. Flip it to `true` and they appear at `/start-here/lessons/1..5/`
with an index at `/start-here/lessons/`.

- Built out of Start Here, not beside it: same `page()` shell, same `.prose.narrow`, same
  `lawList()`. There is no second beginner section.
- **50 state-specific sentences, every one rendered from an audited ledger** with its statute, its
  official link and the date checked: 29 to `www.flsenate.gov`, 21 to `tcss.legis.texas.gov`.
  Nothing typed by hand. A ledger losing a claim throws at build time.
- **Lesson 5 (clearing title) states no quiet-title rule for any state, because the ledgers hold
  none.** The whole claim-id vocabulary is type, rate, rateNote, redemption, bidMethod, statute,
  auctionPlatform, auctionTiming, summary, typeWhy, rateWhy, keyNotes, beginnerTip, risks,
  ddExtra, signup, otc, platforms, surplus. Nothing about quiet title. So the lesson says on the
  page that it is leaving the gap empty on purpose, uses the two Florida claims that genuinely
  bear on title after a sale (§197.552 government liens survive; §95.192(1) four-year limit), says
  it varies by state and county, and hands the reader to a real estate attorney. It also carries
  Lando's own line: he hands title work to an attorney and has never done it himself.
- Every lesson ends with the four pending states, named from the live pending list so the warning
  cannot go stale, then a link to the reader's own state page.
- **Preview for approval:** `LESSONS_PREVIEW=1 npm run build` writes six self-contained files to
  `preview/lessons-2026-11-17/` (outside `public/`, untracked). Stylesheet inlined so they open
  off the disk with no server, site links pointed at the live address, lesson links pointed at
  each other as plain files, canonical stripped (a preview is served nowhere and should claim no
  address), `noindex, nofollow` on each. Parked as room approval item 5.
- Checked: 0 em dashes outside the stylesheet, nothing wider than the screen at 360/390/412px,
  every lesson-navigation tap target 44px after moving the next-and-back line onto `.crumbs`.

Suite after everything: **117 pass, 0 fail** (canonical 8, county-text 71, live 1, ref-clicks 16,
sheet 21), run file by file because the directory at once still fails on Windows with
MODULE_NOT_FOUND. Build clean: check-law PASS 51 states, pending states asserting nothing 4 (GA,
IN, NY, TN), county text clean on 51 pages, 1 pre-existing unmatched county record (SD: Shannon).
`npm run qa` still cannot run here: `puppeteer` is not installed, pre-existing. Live publish run
44209579172 ended **success including "Check the live address"**, the first time that step has
been green. Dated `.bak` copies sit beside every file changed and are deliberately not committed.

### SESSION (2026-11-17): START HERE PAGE LIVE, EMAIL PERMISSION SENTENCE LIVE, STATUS FILE UNSTUCK

Lando approved room items 4, 2 and 3 with his PIN and said "put each one live". All three went out in one deploy from `main`.

- **The Start Here page** is new at `/start-here/`: what an unpaid tax bill is, what a lien is, what a deed is, how they differ, a 15-term glossary of the words the state pages use, an 8-question FAQ, and where to go next. Built by `startHerePage()` in `cloudflare/scripts/build-site.mjs`, written by `write('start-here/index.html', ...)`, added to the nav (prepended, so it reads first) and to the `sitemap.xml` array. Styles appended to `cloudflare/src/site.css`: `.law-list`, `.compare`, `.glossary`, `.faq`. **No new palette values** - every colour is an existing token.
- **Every legal sentence on it is rendered from the audited ledgers, never typed.** `lawLine(L, id)` pulls the claim by id out of `sheetLawLedger('fl')` / `('tx')` and **throws at build time** if that claim loses its id, its statute or its url, so the page cannot go stale silently. Verified mechanically: **12 law statements rendered, 12 word-for-word from the ledger, 0 paraphrased.** No em dashes anywhere on the page.
- **The email permission sentence is on the Rules Sheet page**, directly above the button, in `under-review/sheet.js`: "Your address is used to send your key and to tell you when states are added to the sheet, nothing else, it is never sold or shared, and every update email has a one-click unsubscribe link." It sits **before** the decision deliberately; a promise shown after the address is given is not a promise anyone agreed to.
- **THE HALF THAT IS NOT DONE, AND IT MATTERS.** The address is not collected by this site. It is typed into the **Polar checkout**. The same sentence has to go in the Polar product description or the permission still does not cover the moment the address is actually handed over. That is on Lando's hands list and in `STATUS.md`'s Human line; it is not something this session changed, because Polar is the money platform.
- **`STATUS.md` was nine days stale and the public `/status.json` was telling readers the sheet is "unlisted ... until you say publish"**, nine days after it was published. Lines 1, 2, 5 and 8 corrected. The full-site deploy is what republishes it: `aurigen-site.yml` builds `public/status.json` from `main`'s `STATUS.md` with `make-status.mjs`. `status-publish.yml` does NOT do this - it only touches the under-review Worker, and only while the live site is the 503 page.
- **Checks run before the deploy:** `cloudflare && npm run build` clean (**check-law PASS, 51 states**; county text clean on 51 pages; 1 unmatched county record, `SD: Shannon`, pre-existing). Every test file run individually from the repo root: **117 pass, 0 fail** (canonical 8, county-text 71, live 1, ref-clicks 16, sheet 21). `npm run qa` **cannot run on this PC at all**: `MODULE_NOT_FOUND` for `puppeteer`, which is pre-existing and unrelated to this work.
- Dated `.bak-2026-11-17-*` copies sit beside every file changed and are **deliberately not committed**.

### SESSION (2026-11-15): VERIFICATION ROUND - ALL FOUR ASKS WERE ALREADY SHIPPED, NOTHING CHANGED LIVE
- Lando asked for the link / tag / index / checks work again. It had all landed the night before in `e684443` and is live. Nothing was built and nothing was deployed; this round only proved it.
- Verified **live on theplatbook.com, not from the repo**: nav link `/rules-sheet/?from=nav` on the front page, about page and state pages; the front-page band reading 44 states / 1,181 rows / 8 checked / 36 with gaps straight out of `under-review/sheet.json`; `/about/` linking `?from=about`; `/rules-sheet/` in `sitemap.xml`; the sheet page with **no** robots meta, **no** `x-robots-tag` and `<link rel="canonical" href="https://theplatbook.com/rules-sheet/">`; and `?from=nav` answering `x-platbook-counted: yes`.
- **All 56 built pages carry the nav link** (`grep -rl nav-sheet` over `cloudflare/public`, 56 of 56).
- Checks run: `npm run check` clean, `npm run build` clean (check-law PASS 51 states, county text clean on 51 pages), `node --test test/*.test.mjs` from `under-review/` **117 pass, 0 fail**. Note the path form: `node --test under-review/test` fails on Windows with MODULE_NOT_FOUND; run it from inside `under-review/` against `test/*.test.mjs`.
- **Live HTML differs from a local build in exactly two bytes-worth of places, and it is not a drift.** `?v=` on the stylesheet and script is a hash of the file *including line endings*; this checkout is CRLF, CI is LF. Proved: `ver(site.css)` is `3p3l17` on disk and `1vz2zx` with LF only, which is exactly what live serves. Everything else in the page is identical. Do not "fix" this by rebuilding and deploying.
- **Layout sweep at 375/430/768/1024/1440 over CDP** (script in the session scratchpad, not committed): no sideways scroll anywhere, no element past the edge, the sheet link measures 114x48 at phone widths and 153x48 above 768px, header 126px at 375/430 and 66px above. Two pre-existing sub-44px links surfaced and were **not** touched: `Status` (41x16) alone in the sheet-page footer, and the statute link in each state's fact row (120x19, e.g. `FL Stat §197.172`). Both predate this work and sit on pages it never edited. Note for the next sweep: the skip-to-content link is parked at left:-999px on purpose and inline links inside sentences are the WCAG 2.5.8 inline exception - a probe that flags either is wrong, not the site.
- Task list: closed `6lr.5` (real key proven) and `4np` (beacon verified live on the home page). `6lr.7` could not be closed - bd refuses because `6lr.6` (read 10 rows against official links) blocks it, and `--force` was denied; close it by hand or close `6lr.6` first. Filed `qos` (Start Here page), `egm` (no permission to email signups) and `8w1` (no way to read the tagged-link counts here).
- The three answers Lando asked for again, all unchanged from 2026-11-14 and all re-checked against the live pages tonight: no email consent anywhere (see `egm`), the counts are unreadable from this PC (`wrangler whoami` = not authenticated, no `CLOUDFLARE_API_TOKEN`), and the Start Here page still does not exist.

### SESSION (2026-11-14): THE RULES SHEET IS PUBLISHED AND FINDABLE
- Main `e684443`, live on https://theplatbook.com via the "Aurigen site" workflow (restore, restore_branch main, confirm). The sheet was already written and already free; what it did not have was a single link anywhere on the site.
- `under-review/sheet-listing.json` listed=true (via `node launch/publish.mjs`). Four additions in `cloudflare/scripts/build-site.mjs`, every one gated on that flag so `--undo` genuinely unlists: nav link on all 56 pages, front-page band, about-page sentence, sitemap entry. Counts in the band come from `under-review/sheet.json`, not typed.
- `?from=nav|home|about` on each link, and the D1 `ref_clicks` counter now actually sees them: the /rules-sheet route used to return before the counting code ran. `cloudflare/src/worker.js` has one `countIfTagged()` helper for both branches; it sets `x-platbook-counted: yes` so a count is provable with curl.
- `under-review/sheet.js`: noindex gone when listed, and a `<link rel="canonical">` added (it never had one). Hardcoded to the apex, tag-free on purpose.
- Tests: `sheet.test.mjs` had hardcoded listed===false, so publishing broke it; rewritten to inject a listing and cover both states. Six new tests in `ref-clicks.test.mjs` for the counter refactor. Full suite green, `node --check` clean, county-text check clean.
- Live checks at 375/430/768/1024/1440 over CDP (`Emulation.setDeviceMetricsOverride` - `--window-size` is NOT a CSS viewport and gives false clipping): no overflow, no tap target under 44px.
- Polar is $0 and the signup works end to end: Lando did it on his phone 2026-11-13, key by email, full sheet opened. Hands-only item 1 closed. `polar/rules-sheet.json` still describes the old $19 product and is left as a record; nothing reads it.
- Still open: no consent wording for emailing signups later; `ref_clicks` cannot be read from this PC (no Cloudflare token here); the Start Here page (tax lien / tax deed / FAQ) does not exist in any form.

### LAW AUDIT RUN 3 (2026-10-29, Foundry chain, branch foundry/aurigen-law-audit)
- Done this run: TX, UT, WI, WV, AR, CO, IA, MA. Total 21 of 51. CT and IL marked blocked (cga.ct.gov and ilga.gov TLS certificate errors from runner; retry or find other official copies). Next: CT, IL, MD, NH, SD, then AZ...
- Texas statutes: statutes.capitol.texas.gov is a JS app; use https://tcss.legis.texas.gov/resources/TX/htm/TX.<ch>.htm.
- Utah: le.utah.gov section pages load versioned files (C59-2-S1351_<version>.html; versionDefault in the page).
- Wisconsin: use docs.legis.wisconsin.gov/document/statutes/<sec> (single column); chapter PDF is two-column.
- Colorado: CRS PDFs at leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf (2025 edition 404).
- Arkansas: code is LexisNexis (JS); cited COSL agency pages and Rules PDF. Find the 2023 act ending post-sale redemption.
- Gaps: CO 2025-26 acts not searched; AR act numbers; WV 2026 SB 651 (not in signed list, treat as not enacted).

### LAW AUDIT RUN 2 (2026-10-27, Foundry chain, branch foundry/aurigen-law-audit)
- Done this run: HI, KY, LA, ME, MS, ND, NM. Total 11 of 51. Next: OK, PA, TX, UT, WI, WV.
- Per-state authoring scripts: foundry/out/law-audit/authoring/<st>.mjs (lib.mjs build(), report.mjs). After a state: check-law --state, law-sources.mjs, law-progress.mjs <st> done.
- Blocked hosts: capitol.hawaii.gov (403), mauicounty.gov (403), legislature.maine.gov (intermittent resets; .pdf copies sometimes work), legislature.ms.gov (TLS error; MS code is vendor-hosted).
- Gaps to revisit: NM code not fetched (TRD quotes used); MS rate unverified; ME § 505 rate; 2023-2026 bill searches only from section histories for KY/LA/ME.

### LAW AUDIT RUN 1 (2026-10-27, Foundry chain, branch foundry/aurigen-law-audit)
- Spec: foundry/aurigen-law-audit.md. Done: AK, AL, CA, DC (4 of 51). HI in progress (see foundry/out/law-audit/hi.md).
- Gate: cloudflare/scripts/check-law.mjs (now in `npm run build`; fails until all 51 states have ledgers, by design).
- Ledgers: cloudflare/data/law/<st>.json. Site renders audited states from the ledger (build-site.mjs + law-pieces.mjs).
- Statute watch: cloudflare/scripts/watch-statutes.mjs; workflow to copy: foundry/out/law-audit/proposed-statute-watch.yml.
- Authoring helpers used this run: foundry/out/law-audit/authoring/ (lib.mjs, report.mjs, one script per state).
- Live site untouched (under-review page). Nothing deployed.

### SESSION 17 (2026-10-27): FREE SITE LIVE ON CLOUDFLARE (Foundry run)
- Live: https://aurigen.landonbrewington12.workers.dev (Worker `aurigen`, free plan). aurigendirectory.com NOT attached (no Cloudflare zone).
- New site lives in `cloudflare/`: `npm ci && npm run build && npx wrangler deploy`. Old app files untouched.
  - `scripts/build-data.mjs` turns the legacy JS data into `data/states/xx.json` (51 states, 3,291 county/town records) + coverage report.
  - `scripts/build-site.mjs` makes static pages with pre-rendered Census (us-atlas) SVG maps. No paywall, no gate, no Sage/DNA/Pulse/scores.
  - `data/freshness.json`: per-state official-source check (see foundry/out/freshness.md). Changes are applied at build time.
  - `src/worker.js` runs only for /extras* and /api/*. Paid extras sit behind `PAID_EXTRAS=off` (wrangler.jsonc). Polar keys are checked via the public validate endpoint, cached in D1 `aurigen-db`.
- Paid extras (Polar, see foundry/out/polar.md): Spreadsheet Pack $19 one-time; Sale Calendar .ics $3/mo or $29/yr. Preview at /extras/?preview=1.
- vercel.json on this branch redirects the old Vercel copy (307) once merged to main.
- Open: Lando merges branch, sets up Polar payouts, then flips PAID_EXTRAS; domain needs nameservers moved to Cloudflare; weekly refresh workflow is in foundry/out/proposed-refresh-workflow.yml (needs copying into .github/workflows); 30-ish states still unconfirmed.

### SESSION 16 (2026-10-27): FREE CLOUDFLARE MOVE, SETUP ONLY
- Built: Foundry workflow (.github/workflows/foundry.yml) and its first spec (foundry/aurigen-free.md).
- Removed: dead scraper schedule (.github/workflows/scrape.yml).
- Next: Lando merges to main, adds 3 secrets, taps Run workflow with task aurigen-free.md.
  The run works on branch foundry/aurigen-free and opens issue "NEEDS LANDO: Aurigen result".
- Added foundry/aurigen-design.md: next Foundry spec (Records Room, Legal Notice, Field Survey concepts). Lando runs it.
- Added foundry/aurigen-law-audit.md: multi-run law audit (17 never-rechecked states first). Run it before anything goes public.
- Added aurigen-site workflow (under-review / restore), foundry/tools/ downloader, Foundry chaining + single issue, vercel.json redirect.

### LAST SESSION DATE:
2026-03-29

### LAST SESSION SUMMARY:
Session 15 — Hero headline, DNA Pulse wire, Sage tuning, lazy-load, ES fixes, server hardening. All reviews passed. Merged to main.

**Step 1 — Hero Headline:**
- gate.html: "The investor war room Wall Street doesn't want you to have" (Bebas Neue, clamp 48-72px, #f5f0e8, letter-spacing 0.03em)
- Subheadline: "3,200+ counties. Live auction data. One-time access." (Plus Jakarta Sans)
- Mobile breakpoints: 860px → clamp(36px,8vw,48px), 480px → 32px
- og:title updated to match

**Step 2 — DNA Persistence (Pulse):**
- Pulse DNA suggestion card: "Based on your [archetype] profile, investors like you track [states]. Save them?"
- DNA_PULSE_STATES mapping: yield→AZ/FL/IA, hunter→TX/GA/OH, patient→IA/NE/IN, local→FL/AZ/IL, portfolio→FL/TX/IA
- YES saves states + dismisses, SKIP just dismisses (localStorage: aurigen_pulse_dna_dismissed)
- DNA persistence now complete for: Scout, Deadlines, Dossier, Analyzer, Versus, Pulse, Auctions

**Step 3 — First Deal Pulse Wire:**
- Step 5 action changed from 'account' to 'fd-pulse'
- Sets aurigen_fd_pulse_pending → switches to map → opens Pulse drawer → auto-opens create alert
- Step 5 completion: checks aurigen_fd_pulse flag OR saved states > 0

**Step 4 — Sage v2 Tuning:**
- System prompt: educational disclaimer, no fabrication, no seminar brands, verify with county sources
- CTA every 3rd free response: "Unlock unlimited Sage →"
- Archetype context includes tone guidance

**Step 5 — ES Fixes:**
- Fixed "Decomiso" → "Confiscación" (type_forfeiture)
- Fixed "$197 ÚNICO PAGO" → "$197 PAGO ÚNICO" word order (acct_upgrade, paywall_cta)
- Full audit: 202 EN / 202 ES keys, 0 missing, 20 Category B awkward for Lando review

**Step 6 — Performance Lazy-Load:**
- Phase 4 tools (3 scripts) lazy-loaded on first tab access via dynamic script injection
- switchTab() refactored: checks PHASE4_TABS → _loadPhase4(callback) → _switchTabInit()
- Original eager <script> tags removed from warroom-billion.html

**Step 7 — Server Hardening:**
- sage-query.js: checkFreeLimit() — 3 queries per IP per 24h for free tier
- 429 response with Retry-After: 86400, upgrade: true flag
- Paid users bypass free limit (auth.tier === 'paid')

**Reviews:**
- @lex S15: 5 PASS / 0 FAIL / 3 ADVISORY (headline puffery, "unlimited" wording, "live data" claim)
- @knox+@nova S15: 30 PASS / 1 FAIL (fixed: duplicate letter-spacing) / 0 ADVISORY
- @cipher-security S15: 12 PASS / 0 FAIL / 1 ADVISORY (upgrade flag in 429 reveals tier — informational)

### WHAT WAS BUILT THIS SESSION (2026-03-29):
1. Hero headline: "The investor war room Wall Street doesn't want you to have" + subheadline
2. DNA Pulse suggestions with archetype-specific state mapping (YES/SKIP flow)
3. First Deal Step 5 → Pulse wire (auto-trigger create alert)
4. Sage v2 prompt tuning + CTA frequency (every 3rd free response)
5. ES fixes: Confiscación, PAGO ÚNICO word order
6. Phase 4 lazy-load (3 scripts on first tab access)
7. Sage free-tier server-side rate limit (3/IP/24h)

### WHAT WAS BUILT PRIOR SESSIONS:

**Session 14 (2026-03-29):**
DNA persistence (Scout, Deadlines, Dossier), Sage v2 API backend, First Deal 5-step flow, ES county parity, CSP header, @prism headline alternatives.

**Session 13 (2026-03-29):**
C2 rate limiting, DOMPurify XSS fix, Pre-Call Summary polish, gate hero redesign, Sage v2 UX (duplicate detection, error retry, typing), 28 ES/EN i18n keys, @piper 5-email nurture sequence.

**Session 12 (2026-03-29):**
Referral commission engine, custom subdomain, CORS localhost gate, Pulse CREATE ALERT, Account upgrades, C2 audit, @lex compliance fixes.

**Session 11 (2026-03-28):**
Privacy disclosure, JWT timeout bypass fix, Beehiiv draft, Phase 4 tool audit, Scout IS_PAID guard.

**Session 10 (2026-03-28):**
Security fixes (CORS, rate limiting), admin JWT flag, GHL sync, referral engine, weekly report generator.

**Session 9 (2026-03-24):**
3 UX fixes: free tier messaging, county collapse, hard lock + walkthrough previews.

### WHAT IS CURRENTLY PENDING:
- Phase 5: C2 JWT session validation for get-states.js
- GHL 5-email nurture sequence (Lando loads into GHL)
- Sage v2: API key (ANTHROPIC_API_KEY) must be set in Netlify env vars for API mode
- ES Category B translations: 20 awkward strings flagged for Lando review (see list below)

### ES CATEGORY B STRINGS FOR LANDO REVIEW:
1. type_lien: "Gravamen Fiscal" — consider "Tax Lien" untranslated for bilingual audience
2. type_deed: "Escritura Fiscal" — consider "Tax Deed" untranslated
3. type_forfeiture: "Confiscación" — FIXED this session (was "Decomiso")
4. type_redeemable: "Redimible" — consider "Con Derecho de Redención"
5. stat_redemption/county_redemption/vs_redemption: "REDENCIÓN" — religious connotation; consider "RESCATE"
6. da_hold: "Período de Tenencia" — consider "Período de Retención"
7. fd_title/fd_complete/scout_new: "Negocio" for "Deal" — consider "Operación" or "Inversión"
8. tools_lock_title: "ANALIZADOR DE NEGOCIOS" — consider "ANALIZADOR DE INVERSIONES"
9. da_tab_analyzer: "Analizador" drops "Deal" — consider "Analizador de Inversiones"
10. acct_freshness: "ACTUALIZACIÓN DE DATOS" — consider "VIGENCIA DE DATOS"
11. acct_upgrade/paywall_cta: "PAGO ÚNICO" — FIXED this session (was "ÚNICO PAGO")
12. vs_analysis: drops "OUTPUT" — consider "RESULTADO DEL ANÁLISIS"
13. scout_sub: "RASTREADOR" — consider "VERIFICACIÓN DE DEBIDA DILIGENCIA"
14. scout_red: "SEÑALES DE ALERTA" — consider "BANDERAS ROJAS"
15. pulse_new: "Nuevas" gender-locked feminine — verify context
16. deadlines_lock_desc: "fechas de documentación" — consider "fechas límite de presentación"
17. fd_complete: "CONFIGURADO" — consider "LISTA" for natural phrasing
18. dna_lock_desc: "Cazador de Negocios" — consider "Cazador de Oportunidades"
19. vs_lock_desc: "inversores eligiendo" — consider "inversores que eligen"
20. acct_value_total: "tuyo por $197 una vez" — consider "todo por solo $197, un único pago"

### OPEN SECURITY ITEMS:
- **C2 (Critical)**: states-en.js data gated via get-states.js but needs JWT session validation
- ~~**H4 (High)**: innerHTML XSS via AI advisor response~~ — FIXED (DOMPurify + sanitizeHTML)
- ~~**C5 (Low)**: No CSP header configured~~ — FIXED (Session 14)

### OPEN LEGAL/FTC ITEMS:
- **CRITICAL**: "Founding member" 500-cap claim unverified — needs Lando confirmation
- **ADVISORY**: "$200+/month comparable tools" claim in email sequence — document comparables before sending
- **ADVISORY**: Email 3 lists 9 tools — verify all are live before deployment
- **ADVISORY**: Gate hero feature cards list "Equity Cushion Scanner" and "Absentee Owner Filter" — verify these are live before gate launch
- **ADVISORY (S15)**: "Live auction data" in subheadline — @lex recommends "Auction calendar data" or "Updated auction data"
- **ADVISORY (S15)**: "Unlock unlimited Sage" — @lex recommends "Unlock full Sage access"

### KNOWN WAIVERS:
- **#080**: rgba() opacity variants permanently exempt from CSS variable requirement

### NEXT SESSION STARTS WITH:
**Session 16 Queue:**
1. C2: JWT session validation for get-states.js (Critical security item)
2. @lex S15 advisories: "Live auction data" → "Auction calendar data", "unlimited" → "full access"
3. ES Category B: Lando picks which of the 20 translations to fix
4. Sage conversation starters (suggested first questions in empty state)
5. og:image asset — @prism
6. Scout partnership outreach — @scout
7. Add to Home Screen guide — @atlas
8. Performance audit: bundle size, image optimization, Lighthouse score

### OPEN QUESTIONS FOR LANDO:
- Is the 500 founding member cap real? If so, where is the counter? If not, remove the claim.
- Run the 2 SQL migrations (referrals_commission.sql + pulse_alerts_created_by.sql)
- Add DNS CNAME record: directory → aurigen-directory.netlify.app
- Load the 5-email nurture sequence into GHL (pipeline/PIPER-GHL-NURTURE-SEQUENCE.md)
- Document "$200+/month comparable tools" claim before email sequence goes live
- Set ANTHROPIC_API_KEY in Netlify env vars for Sage v2 API mode
- Review 20 ES Category B translations (see list above) — which to fix?
- "Live auction data" in hero subheadline — keep as-is or change to "Auction calendar data"?
- "Unlock unlimited Sage" — keep as-is or change to "Unlock full Sage access"?
- Ready to set BEEHIIV_SEND_ENABLED=true?
- Ready to add SKOOL_API_KEY and GHL_API_KEY to Netlify env vars?

### DNS ACTIVATION INSTRUCTIONS (Lando executes manually):
Add CNAME record at your DNS provider:
  Name: directory
  Value: aurigen-directory.netlify.app
  TTL: 3600

Then add "directory.theaurigen.com" as a custom domain in Netlify Site Settings > Domain Management. SSL will provision automatically via Let's Encrypt. Allow 24-48 hours for propagation.

### SQL MIGRATIONS TO RUN (Lando executes manually):
1. `supabase/referrals_commission.sql` — adds commission columns to referrals table
2. `supabase/pulse_alerts_created_by.sql` — adds created_by column to pulse_alerts table

### ENV VARS NEEDED (Netlify):
- `ANTHROPIC_API_KEY` — required for Sage v2 API mode (falls back to local without it)
- `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `BEEHIIV_SEND_ENABLED`
- `SKOOL_API_KEY`, `SKOOL_GROUP_ID`
- `GHL_API_KEY`, `GHL_LOCATION_ID`

### AGENT STATUS:
**Mason:** Session 15 complete. Hero headline, DNA Pulse wire, Sage tuning, lazy-load, ES fixes, server hardening shipped.
**Lex:** Session 15: 5 PASS / 0 FAIL / 3 ADVISORY (informational).
**Knox:** Session 15: 30 PASS / 1 FAIL (fixed) / 0 ADVISORY.
**Cipher-Security:** Session 15: 12 PASS / 0 FAIL / 1 ADVISORY (informational).
**Piper:** Session 13: 5-email nurture sequence delivered. Ready for GHL load.
**Prism:** Session 14: Headline Option C chosen and implemented in S15.
**Compass:** Session 15 coordinated. Standing by for Session 16.
