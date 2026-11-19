# SESSION MEMORY
> Updated after every session. Every agent reads this first.

PROJECT: Aurigen County Resource Directory
VERSION: v9+
LIVE SITE: aurigen-directory.netlify.app
REPO: landoCommandoz/aurigen-directory
GHL: pit-538dfecf-570a-4f22-aca7-c72cddae8990
STRIPE: https://buy.stripe.com/14AaEXfcU3aYdCX55E2VG02
BOOKING: https://api.leadconnectorhq.com/widget/bookings/investor-clarity-call-5oVY4

## Report for Lando (from Lando, 2026-11-07). This replaces the old hub block entirely.
Every report ends with this block and nothing comes after it. Write the same block to
C:\SmallHours\vault\hub\platbook.md every time (the hub files are named products, machine-shop,
platbook, hunt; this project is platbook). Plain words only, no tables, no secrets, no code.

```
=== REPORT FOR LANDO ===
WHAT HAPPENED: one sentence a non-programmer understands.
MONEY: closer, no change, or further from a paying customer, and why, in one line.
KIND OF WORK: making money / protecting what exists / fixing something broken / research.
YOUR MOVE: the exact thing only I can do, in plain words, or "nothing".
DECISION: a plain question with numbered options, or "none".
NEXT: what you will do if I say nothing.
=== END ===
```

Rules for this block: no technical words. Never write commit, push, merge, branch, repo, deploy, bd,
bead, workflow, scope, token, API, pipeline, schema, CLAUDE.md or any file path. Say "saved online",
"put live", "task list", "permission", "key" or "the tool" instead. If a sentence would confuse
someone who has never coded, rewrite it. This applies to scheduled runs as well as live sessions.

## AGENT ROSTER
| Codename | Role | Owns |
|----------|------|------|
| Mason | Builder | All code |
| Prism | Creative/Design | UI/UX |
| Blaze | Marketing | Content/campaigns |
| Ace | Sales | Conversion/closing |
| Piper | Email | GHL sequences |
| Rally | Skool/Community | Aurigen Collective |
| Lex | Legal | Compliance/copy review |
| Atlas | Content | Authority/SEO |
| Scout | Outreach | Partnerships |
| Cipher | Analytics | Data/metrics |
| Compass | Operations | Coordination |
| Knox | QA | Testing/verification |
| Recon | Intel | Competitive analysis |
| Cipher-Security | Security | Threat modeling |
| Phantom | Deep security | Threat intelligence |
| Wraith | Absolute security | Complete threat universe |
| Nova | Paid flow QA | Clicks every button in paid view |
| Ghost | Free flow QA | Finds every paywall bypass |

## STANDING RULES (all agents must follow)
- Never reference [seminar brand] in any output
- No fabricated testimonials ever
- Lex must review all user-facing claims before ship
- Knox must pass every PR before merge
- Cipher-Security runs after every major build
- HANDOFF.md must be updated after every session
- CLAUDE.md SESSION MEMORY updated after every session

## THE PLAT BOOK IS LIVE (2026-11-19). Read before touching site.css, the head or the fonts.

- **LIVE since 2026-11-19 on Lando's PIN approval** (Agent Room approval item 6, work item 5,
  approved 01:58:59). `src/site.css` IS the plat book stylesheet; the old cyanotype look is kept
  whole on the branch **`before-platbook-2026-11-19`** and as `src/site.css.bak-2026-11-19-before-platbook`.
  **One-step undo:** run the "Aurigen site" workflow with `mode=restore`,
  `restore_branch=before-platbook-2026-11-19`, `confirm_restore=true`.
- **THE APPROVED PREVIEW WAS RENDERING IN THE FALLBACK FONTS AND NOTHING SHOWED IT.**
  `platbook.css` asked for `url('assets/fonts/...')` with no leading slash. A stylesheet served
  at `/assets/platbook.css` resolves that against its OWN folder, so the browser asked for
  `/assets/assets/fonts/...`, got 404 on both files, and the measured stand-in faces rendered the
  whole site at the right widths. The screenshots looked right, the layout did not move and the
  speed numbers looked good because two webfonts were never fetched. **A missing webfont is
  invisible here by design**, so `build-preview.mjs` now fails the build if any `url()` in either
  stylesheet lacks a leading slash or points at a file that is not in the output. Never judge a
  webfont by looking at the page; check `document.fonts.check()` or the network.
- **`font-display` is `optional`, not `swap`, and Lando asked for swap.** Once the fonts really
  loaded, swap moved the page: lesson 1's headline needs 2 lines in Vollkorn where the
  width-matched Georgia needs 1, so everything below dropped 36px. Shift 0.0257 lesson 1, 0.0410
  FL, 0.0179 GA. That is a LINE-BREAK BOUNDARY and no `size-adjust` can reach one. Preload did
  not fix it; `block` did not either (on a 400Kbps link its 3s timeout expires and it still swaps,
  0.0255). `optional` is the only setting that never moves the page: 0.0000 at 1.6Mbps with
  Vollkorn on screen, 0.0000 at 400Kbps with the stand-in on screen. Both fonts are preloaded so
  an ordinary connection makes optional's window. **If the fonts ever stop appearing, suspect the
  preload or the CSP before anything else** — the page will still look right either way.
- **The key page's CSP is tighter now:** both webfonts come from this site, so the two Google
  origins are gone, `font-src 'self'`, and the page loads nothing from outside at all. Three
  tests in `sheet.test.mjs` assert exactly that, including that the page really asks for what the
  policy allows.
- **To preview a FUTURE look**, the preview route still works and still proves nothing but the
  design changed:
  `cd cloudflare && node scripts/build-site.mjs && node scripts/build-preview.mjs` writes all
  64 pages to `preview/redesign-2026-11-19/platbook/`. Serve that folder at the ROOT of its own
  server (`npx -y http-server "<folder>" -p 8097 -c-1`); the pages use the site's real addresses,
  so opening the files directly finds no stylesheet. Screenshots of every page type at 375 and
  1440 and the speed numbers are in `preview/redesign-2026-11-19/screenshots/`.
- **It reskins the REAL built pages; it never writes new ones.** That is the whole design of it:
  every word, statute, citation, link, date, page address, the pending notice and the visitor
  counting are the live ones. `build-preview.mjs` compares the visible text and every link of
  every preview page against the page it came from and REFUSES to write the folder on any
  difference, and also checks 51 breadcrumbs, the home page's organisation markup, Start Here's
  question-and-answer markup, 47 last-checked lines and the counting script. The one markup
  addition is `data-page` on `<html>`, which carries no content and is how the lessons get more
  air than a state page.
- **Stand-in font faces are MEASURED, and Vollkorn needs one per weight.** Its ratio against
  Georgia is 97.9% at 400, 88.3% at 600 and 90.7% at 700 — seven points apart, because Georgia's
  bold is much wider than Vollkorn's relative to its regular. One family for all three would be
  wrong at two of them. Vollkorn's own box is ascent 95.2%, descent 44.1%.
- **Arial Narrow is deliberately NOT in the label stack.** It is the obvious stand-in and it was
  in the sample's font list. On this PC the name resolves but renders as Arial (881.2px against
  Arial's 881.2px for the same string), so any ratio written for it would be Arial's wearing
  Arial Narrow's name. A stale ratio is worse than none.
- **Neither font is preloaded, and that is measured, not an oversight.** Home first paint at
  375px: both preloaded 1200ms, Vollkorn only 1156ms, neither 876ms — and movement was 0px in
  all five runs of every variant, because the stand-ins already hold the layout. The live site
  preloads Fraunces only because its headline needs 3 lines where Georgia needs 2, a line-break
  boundary no `size-adjust` can reach; Vollkorn has no such boundary at these sizes.
- **MEASURE A AND B ALTERNATING, NEVER IN BLOCKS.** Five runs of one design then five of the
  other gave lesson 1 at 828ms in one pass and 2104ms in the next with nothing changed: this
  machine's load drifts over minutes, so a block of A and a block of B are measured under
  different conditions. `scratchpad/measure/measure-ab.mjs` alternates them inside each round and
  reports the median of the per-round differences. Final figures at 375px, 7 rounds: the plat
  book is faster on first paint and largest paint on all four pages and has 0.0000 layout shift
  where the live design has up to 0.0103. Nothing is worse.
- **`.gitignore` said `preview/` with no leading slash**, which matched a directory named
  preview at ANY depth and was silently hiding `cloudflare/src/preview/` and
  `cloudflare/scripts/preview/` — the entire source of this work. It is anchored to the
  repository root now. The built output is still ignored; the source is tracked.
- **Live proof, 2026-11-19, on theplatbook.com itself:** all 62 sitemap addresses plus the key
  page answer 200; the visible text of all 62 is **word for word identical** to the copies taken
  before the change; 58 structured-data blocks with 0 validator errors; 51 breadcrumbs; 47
  last-checked lines; the pending notice on GA, IN, NY and TN unchanged; counting on 61 pages;
  check-law PASS on 51 states; 135 tests pass. At 375px: layout shift **0.0000** and movement
  **0px** on `/`, `/state/fl/`, `/state/ga/` and `/start-here/lessons/1/` (was 0.0001, 0.0012,
  0.0103), first paint 808-948ms, no sideways scroll at 375/768/1024/1440, and no tap target
  under 44px outside the SVG map. A made-up key still returns **403** and only the 2-state free
  sample; `sheet.csv` without a key is 404.

## FONTS, FIRST PAINT AND THE FIVE LESSONS (2026-11-17, lessons live 2026-11-18) — read before touching site.css or the head

- **`SITE_URL` is fixed and the publish is green.** The workflow files now name
  `https://theplatbook.com`, so "Check the live address" passes. The older bullet below saying
  every restore run ends red is history; the compensating guard in `build-site.mjs` stays anyway.
- **Three `@font-face` fallback families per webfont live in `src/site.css`, with `size-adjust`.**
  They exist to stop text re-wrapping when the real fonts arrive: Public Sans is 4.3-4.9% wider
  than Segoe UI, Roboto and Arial, and Fraunces 600 is 7-10% narrower than Georgia, which was
  moving the page 26-89px after first paint and producing Cloudflare's 0.11 shift. **Do not edit
  the ratios by eye.** They were measured in real Chrome at the sizes the site renders. If a font
  in `--head`, `--body` or `--mono` ever changes, re-measure or delete the faces; a stale ratio is
  worse than none.
- **The Google Fonts stylesheet is deliberately not render-blocking** (`media="print"` with an
  `onload` swap, plus a `<noscript>` copy). That is safe ONLY while the width-matched fallbacks
  above exist. Removing them without putting the blocking link back trades a 0.11 shift for a
  faster paint, which is the wrong trade.
- **`site.css` must not be inlined into the page head.** Tried 2026-11-17 and reverted: it defines
  `.pill.t-lien` and its siblings, the pending-state guard reads the built HTML as a plain string,
  and every inlined page then failed the build as a pending state shading itself. The comment
  above `page()` carries the full reason.
- **The five beginner lessons are LIVE since 2026-11-18 under Start Here**, at
  `/start-here/lessons/1/` to `/5/` plus `/start-here/lessons/`, on Lando's PIN approval of room
  work item 4. `LESSONS_APPROVED = true` is still the whole switch and false still removes the
  pages, the sitemap entries and the Start Here links in one build. Start Here links all five in
  order; each lesson links Previous, Next and Back to Start here through `.crumbs a` (44px).
  **Each lesson carries question-and-answer markup that is generated, never written**: `faqJsonLd()`
  in `build-site.mjs` reads the page's own `<h2>` sections and THROWS if a question or an answer is
  not in the page's visible text, so invented Q&A cannot ship. Lesson 3's pairs are its numbered
  steps, which was a judgment call: see the handoff. The lesson prose Lando approved was not
  touched; the whole diff is the switch and the previous-lesson link
  (`lessons.mjs.bak-2026-11-17-before-publish`).
- **The four rules from the edit pass still bind every future lesson edit.** They stand at the top of `lessons.mjs`: no
  claim about how often anything happens (the ledgers hold statutes, not statistics), no jab at
  seminars or courses, every worked number must be possible under the statute cited on the same
  page, and every bare ledger fragment gets a plain-English lead-in. The example that forced the
  first and third of those: lesson 4 showed 25 percent paid back at twenty three months, which
  Tex. Tax Code § 34.21 allows for neither property type at that point.
  The file is `cloudflare/scripts/lessons.mjs`. Nothing is written, linked or listed while
  `LESSONS_APPROVED` is false; it is true since 2026-11-18. The preview route still works and still
  writes outside `public/`: `LESSONS_PREVIEW=1 npm run build` writes `preview/lessons-2026-11-17/`.
  Every state-specific sentence comes from `lawList()`; lesson 5 states no quiet-title rule for
  any state because the ledgers hold none, and says so on the page.
- **FIXED 2026-11-17, was live and broken since 2026-11-14: the header nav overflowed every
  phone.** `.top` wrapped the nav to its own row; `.top nav` was the half that was missing,
  `flex: none` with no `flex-wrap`, natural width 427px, so the `Free Rules Sheet` link landed at
  443px and `body { overflow-x: hidden }` hid the evidence on all 57 pages. Now `.top nav` wraps,
  and below 640px `.top nav a` is `.85rem` with `.2rem` side padding. Five links, one row, **47px
  of headroom at 360px even after the webfont swaps.** Measure headroom as row width minus the sum
  of the links' natural widths: `justify-content: space-between` puts the last right edge at the
  row edge no matter what, so it cannot tell you whether anything fits.
- **Fraunces is served from this site now** (`cloudflare/src/fonts/`, copied to `/assets/fonts/`),
  weight 600 only, licence **SIL Open Font License 1.1** with `OFL.txt` shipped beside it. It
  closed the last shift: the home headline needs 3 lines in Fraunces where the fallback needs 2 at
  360px, a line-break boundary no `size-adjust` can reach. 36px of movement, now 0px at 360, 390
  and 412, live. **It cost first paint and that is deliberate**: home 996 to 1,148ms at 360px,
  state pages about 80ms. Preloading the home page alone was tried and rejected because it delayed
  the body font enough to move a state-page paragraph 26px on 1 run in 10. One line in `page()`
  reverses the whole trade and its comment says which.
- **Measure movement on the layout box** (`offsetTop`/`offsetHeight`), never
  `getBoundingClientRect`: the hero's `rise` animation is a transform, so a perfectly still
  headline measures as 8px of movement and sends you chasing nothing.

## PLATBOOK IS LIVE (2026-11-08) — read this before any older "LIVE NOW" line
- **LIVE: https://theplatbook.com** (Worker `platbook`, Cloudflare Workers free plan). Lando bought theplatbook.com on 2026-11-08 in the same Cloudflare account and it is the permanent address. Everything below naming a `.workers.dev` address or the under-review page is history.
- **Both custom domains are declared in `cloudflare/wrangler.jsonc` AND `under-review/wrangler.jsonc`**, not only in the dashboard, because a Worker deploy replaces the whole trigger set: a publish without them would pull the domain off the site. `workers_dev` stays `true` so the old address still answers and can be redirected.
- `www.theplatbook.com`, `platbook.landonbrewington12.workers.dev` and any other hostname are 301'd to the apex by `canonicalRedirect()` in `cloudflare/src/worker.js`, tested in `under-review/test/canonical.test.mjs` (8 tests). `wrangler dev` cannot exercise it: it answers on 127.0.0.1 whatever Host you send.
- **`run_worker_first` order matters.** `["!/assets/*", "/*"]` works; `["/*", "!/assets/*"]` silently stops the Worker running at all and every dynamic route 404s from the asset server with no error logged anywhere. Found by testing both on 2026-11-08.
- The first address is a permanent 301, path for path, served by a second Worker still named `aurigen`. Its code is `forward/worker.js`; it is DEPLOYED from the branch `forward/aurigen-redirect` (whose `cloudflare/wrangler.jsonc` names it) by running "Aurigen site" restore on that branch. **Never merge that branch to main.** Its final step fails on purpose.
- Vercel (`aurigen-directory.vercel.app`) 307s everything to platbook, including `/` (added 2026-11-08; without that rule the root served the retired `gate.html` paywall).
- Cron limit: the free plan allows **5 cron triggers per account**. The site Worker needs one. If a deploy logs "only partially updated / 5 cron triggers", a dead Worker is holding a slot.
- `SITE_URL` in the four workflow files still names the old address (no `workflow` token scope here). Consequences: every "Aurigen site" restore run ends red on its final check although the deploy succeeded, and `build-site.mjs` has a guard refusing that host so the canonical link and sitemap stay correct. Bead `aurigen-directory-6rz`; cure is `gh auth refresh -s workflow`.
- `write-status.mjs` and `build-sheet.mjs` were fixed the same day: a Foundry run had been rewriting STATUS.md with "the live site stays on the under-review page" and resetting the sheet title to "Aurigen Rules Sheet" after every hand correction.
- Only "Aurigen" a visitor can still see: the GitHub project link on /about/ and the Rules Sheet. The repository is still called `aurigen-directory`; renaming it is a separate decision.

## COUNTY TEXT + TAGGED-LINK COUNTING (2026-11-08) — read with the Platbook block above

- **No county ships a redemption period or an interest rate, in any state.** Those were state
  values copied down a column by the pre-audit data files. The law audit corrects the LEDGER,
  which is what a state page's fact rows are built from, so the county copies went stale and the
  Florida page gave two different answers to the same question, 67 times. Dropped in
  `cloudflare/scripts/build-site.mjs` (`countyJson`). DE's real county redemption survives in its
  `extra` block with 9 Del. C. 8758; **MD's 3 county rates were put back 2026-11-17**, not by
  switching the old county fields on, but as ordinary audited claims: Anne Arundel 18% a year
  (aacounty.org), Cecil 12% (cecilcountymd.gov), Baltimore City 12% principal residence / 18% other
  (Baltimore City Code, Art. 28, § 8-1). Each has its own official source, a snapshot, a quote and
  a date, and three county domains were added to `official-domains.json` scoped to their own county.
  **Baltimore City's codified 12% sits above the 10% state cap in Tax-Prop. § 14-820(c) for
  owner-occupied residential. Both are published and linked; it is not reconciled. Do not quietly
  pick one.** Also: a new claim needs `pass2`, and `checked` must match the snapshot's UTC fetch
  date to the day.
- `cleanExtra()` strips placeholder values, and on a **pending** state anything that states the
  law (NY was publishing 63 `method` claims on the page that promises it states none).
  `cleanNotes()` strips notes carrying an internal marker (`[VERIFY] …`), keeping prose that
  merely says "date TBD".
- **`cloudflare/scripts/county-text.mjs` is the standing county-text check.** It reads every
  label and value out of a built page. `build-site.mjs` runs it on all 51 pages and FAILS the
  build; `under-review/test/county-text.test.mjs` runs it and proves it still fails on bad text.
  Keep its `LABEL`/`human()` in step with `cloudflare/src/app.js`.
- **Tagged links:** `?from=<source>` (`/^[A-Za-z0-9-]{1,30}$/`) adds 1 to D1 `ref_clicks
  (day, source, clicks)`, day in **Mountain** time, table created by the Worker. Robots skipped
  by user agent, absent UA skipped. Write in `ctx.waitUntil`, all errors swallowed, response
  carries `x-platbook-counted: yes`. Nothing personal is stored. Read it with:
  `SELECT day, source, clicks FROM ref_clicks ORDER BY day DESC, clicks DESC;`
- **workerd refuses a non-function named export from the entrypoint.** `export const
  CANONICAL_HOST` stopped `wrangler dev` starting at all; it is `canonicalHost()` now.
- **D1 refuses a schema change inside a transaction**, so `CREATE TABLE` must not share a
  `batch()` with an insert — otherwise the very first click fails silently, forever.
- **Cloudflare Web Analytics does not auto-inject into pages served by a Worker.** Put the
  public site token in `cloudflare/data/beacon.json` and the snippet goes on every page. The
  site sets no CSP, so nothing blocks it.

## SESSION 17 (2026-10-27) — FREE SITE LIVE (Foundry run, branch foundry/aurigen-free)
- LIVE NOW: https://aurigen.landonbrewington12.workers.dev (Cloudflare Workers free plan, static assets). The Netlify/Supabase notes below are history. **Superseded 2026-11-08: see the Platbook block above.**
- Code: cloudflare/ (build-data.mjs, build-site.mjs, src/worker.js, wrangler.jsonc, SOURCES.md). Everything public is free; no paywall.
- Paid extras behind PAID_EXTRAS=off: Spreadsheet Pack $19, Sale Calendar $3/mo or $29/yr (Polar; IDs in foundry/out/polar.md).
- Open: merge to main (activates vercel.json redirect), move aurigendirectory.com nameservers to Cloudflare, Polar payouts, refresh workflow, unconfirmed states.

## SESSION 16 (2026-10-27) — MOVE TO FREE CLOUDFLARE
- Old hosting is gone: Netlify site 404, Supabase/scrapers/Sage dead. Static copy still on Vercel (main).
- aurigendirectory.com: Name.com, paid through 2027-03-24, parked, no MX records.
- Added .github/workflows/foundry.yml (manual Claude Code run on a spec in foundry/) and foundry/aurigen-free.md.
- Removed .github/workflows/scrape.yml (dead scraper schedule).
- foundry/aurigen-free.md overrides this file where they conflict (no paywall, free Cloudflare, Polar extras).
- Added foundry/aurigen-design.md (3 design concepts at preview addresses; live site untouched). Not run yet.
- Added foundry/aurigen-law-audit.md (multi-run official-source audit of all 51 states, EN+ES; live site untouched). PRIORITY before going public.
- Live site switch: .github/workflows/aurigen-site.yml (under-review 503 page from under-review/, or restore from a branch). vercel.json redirects the old Vercel copy.
- Foundry now chains runs (foundry/out/chain/<spec>.json, max 20) and updates one issue per title. Law audit snapshots only via foundry/tools/fetch-source.mjs (curl + pdftotext, hashed).
- Foundry runs Claude through the Agent SDK (foundry/tools/run-agent.mjs, SDK pinned in foundry/tools/package.json), not claude-code-action: the API promo credit covers the SDK and plain API but Claude Code was refused with "Credit balance is too low". Tested 2026-10-27: 3 turns, $0.17.

## LAW AUDIT (2026-10-29, run 3 of chain)
- Run 3: TX, UT, WI, WV, AR, CO, IA, MA done (21 of 51). CT, IL blocked (TLS errors). Next CT, IL, MD, NH, SD. See HANDOFF.md.

## LAW AUDIT (2026-10-27, runs 1-2 of chain)
- Run 2: HI, KY, LA, ME, MS, ND, NM done (11 of 51). Next OK, PA, TX, UT, WI, WV. See HANDOFF.md.
- foundry/aurigen-law-audit.md: AK, AL, CA, DC done; HI in progress. Gate cloudflare/scripts/check-law.mjs; ledgers cloudflare/data/law/.
- Progress: foundry/out/law-audit/PROGRESS.json and SUMMARY.md. Live site untouched.

## LAW AUDIT UPDATE (2026-10-29)
- Foundry #13: 21 of 51 states done (EN+ES). Audit branch foundry/aurigen-law-audit; live site still on the under-review page.
- Check status per state in cloudflare/data/law/gaps.json: checked (PA, WI), checked with gaps (19 states), Couldn't reach source (CT, IL: TLS chain incomplete, verification stays on). Gap queue adds 19 items; chain total is now 70.
- 1,262 corrected claims: 866 substantive, 166 wording or citation only, 230 removed opinion (foundry/out/law-audit/corrections-summary.md).
- 40 flagged claims: 33 need Lando's decision (11 "not available/varies" wording, 22 Oklahoma), 7 are research gaps (foundry/out/law-audit/decisions-needed.md).
- Fixed: chain crashed on "1.0" inputs from manual dispatch (foundry.yml now takes strings).

## STANDING ORDERS APPLIED (2026-11-01)
- Nightly law audit: foundry.yml schedule at 2 am Mountain (gate job; 08:00 or 09:00 UTC by DST), chain on, Sonnet 5.5. $10 a run, $40 total (spent/cap kept in foundry/out/chain/aurigen-law-audit.json), stops at the cap or 51 of 51 states. Manual Run still works.
- Decisions: A softened 11 claims to referrals; B 22 Oklahoma claims held (hold:true, shown ""); C CT/IL get the missing intermediate only via foundry/tools/cert-chain.mjs (server's own AIA address, verified to a system root, fingerprint logged, those two hosts only). Untested against the real hosts until the first run (tested on a local test PKI).
- STATUS.md (10 lines) is rewritten by every Foundry run and published at /status.json by status-publish.yml; the under-review page footer links it. statute-watch.yml runs monthly. Showcase (foundry/aurigen-showcase.md) starts once when 40 states are done, own $10 cap.
- Open question with default: after 51 of 51 the schedule stops and the 19-item gap queue is only worked if budget remains in that night's chain. Default if no answer in 7 days: leave it.
- Keep the audit branch's .github/workflows identical to main's whenever a workflow changes (a run's token cannot push them).

## RULES SHEET (2026-11-01)
- Product: Platbook Rules Sheet, 44 audited states side by side, every row with statute, official link, date and quote; Polar license key. **PUBLISHED 2026-11-14** at https://theplatbook.com/rules-sheet/ after Lando went through the free checkout on his phone and confirmed $0.00, the key arriving by email, and the key opening the full sheet.

  **What publishing actually did, 2026-11-14.** `listed: true` in `under-review/sheet-listing.json` (set by `node launch/publish.mjs`) drops the noindex meta tag and the `x-robots-tag` header. Everything else was added the same day and is gated on that same flag, so `--undo` genuinely unpublishes:
  - A **"Free Rules Sheet"** link in the nav on all 56 pages, a block on the front page, and a line on `/about/`. Every count in them is read from `under-review/sheet.json` at build time, never typed.
  - Each link carries its own tag: `?from=nav`, `?from=home`, `?from=about`.
  - `/rules-sheet/` is in `sitemap.xml`, and the page carries `<link rel="canonical" href="https://theplatbook.com/rules-sheet/">` with no tag on it.
  - **`launch/publish.mjs`'s comment is wrong and was wrong before today**: listing never linked the sheet from the LIVE home page. `homeFooterLink()` is only used by `under-review/worker.js`, the 503 hide page. The live site had no link to the sheet at all until the nav link above.
  - **The sheet route was never counted.** `handleSheet()` returns before the static-page branch that held the counting, so `/rules-sheet/?from=nav` loaded and was counted nowhere. Counting now lives in one function, `countIfTagged()` in `cloudflare/src/worker.js`, used by both routes. Six tests in `ref-clicks.test.mjs` cover it.
  - `.top nav a` is `inline-flex`, so flex layout discards the whitespace between two text runs: `<em>Free </em>Rules Sheet` rendered as "FreeRules Sheet". The space is `&nbsp;` now. Below 640px the `em` is hidden and the link reads "Rules Sheet"; the header goes to two rows (126px) at 375 and 430.
  - Deploy route: push to main, then run the **"Aurigen site"** workflow with `mode=restore`, `restore_branch=main`, `confirm_restore=true`. It ends RED every time on "Check the live address" because that step checks the retired `aurigen.landonbrewington12.workers.dev`, which 301s. The "Build and deploy the full site" step above it is the one that matters. `status-publish.yml` does NOT deploy the full site: it only touches the under-review Worker, and only while the live site is the 503 page.

  **CORRECTED 2026-11-14, on Lando's instruction, after reading the live Polar product instead of our own config file. Nothing was changed in Polar or on the site.** Three things this line used to say were wrong:
  - **It is $0, not $19.** The live price is zero. The site saying "free" and Polar are in agreement, and have been. The older note in `vault\sessions\aurigen.md` saying "The Polar product is still $19 while the site says free" is stale and that hands-only item is already done. What actually makes the sheet invisible is that it is `noindex` and nothing links to it, which is a separate decision (set `listed:true`) and is still Lando's to make.
  - **The keys have no `AURSHEET` prefix.** The live benefit (`b13ef8b5-b65d-4cec-9ffc-b946580da87b`) reports its prefix as empty. `polar/rules-sheet.json` asks for `"prefix": "AURSHEET"`, and Polar did not apply it. So a real key will not begin with `AURSHEET`, and any check or support reply that assumes it does would be wrong.
  - **The keys do not expire after 12 months.** The live benefit reports no expiry at all, so a key issued today works indefinitely. `polar/rules-sheet.json` asks for `"ttlMonths": 12`, and Polar did not apply that either.

  `polar/rules-sheet.json` has deliberately been left exactly as it is. It is the input we handed Polar, not a record of what Polar did, and rewriting it would erase the evidence of the mismatch. The mismatch itself is the finding: **that file cannot be trusted as a description of the live product, and this note can.** Worth Lando knowing, though it needs nothing from him tonight: the product description in Polar still tells a customer "Your license key works for 12 months", which is now a promise that understates what they get, so it costs nobody anything and was left alone as instructed.
- Code: under-review/sheet.js (+ worker.js, tests in under-review/test), data under-review/sheet.json built by foundry/tools/build-sheet.mjs (only supported/corrected, unheld claims whose quote is found in the saved official copy; states with too few confirmed rows are left out). Polar product made by .github/workflows/polar-sheet.yml from polar/rules-sheet.json (organization token: never send organization_id in a body).
- Options memo: foundry/out/product-options.md. Foundry's end step rebuilds sheet.json and STATUS.md after tests pass.
- Untested until a real purchase: a genuine key unlocking the sheet (stand-in Polar used in tests; a made-up key against the real Polar endpoint is rejected, tested live).

## LAUNCH PREP (2026-11-01, later)
- Sheet shows the two plain lines (not legal advice; confirm dates and rules with the county) plus the 14-day refund line. Publish = Actions "Publish" (mode publish) or `node launch/publish.mjs` + push: removes noindex, links the sheet from the home page footer, redeploys the showcase with a link (showcase noindex stays).
- Domain: **theplatbook.com**, bought 2026-11-08, in the Cloudflare account, attached to the `platbook` Worker. aurigendirectory.com is abandoned, not just parked: Lando cannot reach the account that holds it and it is no longer needed. domain/README.md and the Domain zone / Domain attach workflows are dead; `under-review/wrangler.domain.jsonc` was repointed at theplatbook.com only so that running the old workflow cannot detach the live domain. Polar token lacks discounts scopes, so the test discount code is made by hand in Polar (settings in the report) or after adding the scopes.
- Launch messages in launch/ (post after publish). When a workflow file changes, sync it to foundry/aurigen-law-audit and foundry/aurigen-showcase too.

## OPEN CRITICAL ITEMS
1. FTC: Founding member 500-cap claim — needs Lando confirmation
2. C2: states-en.js serverless gating (get-states.js built, needs C2 JWT session validation)
3. Email 3 lists 9 tools — verify all live before GHL deployment
4. "$200+/month comparable tools" claim needs documented comparables
5. ANTHROPIC_API_KEY env var needed for Sage v2 API mode

## RESOLVED THIS SESSION (2026-03-29 — Session 15)
- ~~Hero headline missing~~ — BUILT ("The investor war room Wall Street doesn't want you to have" + subheadline)
- ~~DNA Pulse suggestions missing~~ — BUILT (archetype-specific state mapping, YES/SKIP flow)
- ~~First Deal Step 5 not wired to Pulse~~ — FIXED (fd_pulse_pending flag, auto-trigger create alert)
- ~~Sage CTA too frequent~~ — FIXED (every 3rd free response only)
- ~~ES Decomiso wrong~~ — FIXED (Confiscación)
- ~~ES ÚNICO PAGO word order~~ — FIXED (PAGO ÚNICO)
- ~~Phase 4 eager load~~ — FIXED (lazy-load on first tab access, 3 scripts sequential)
- ~~Sage free queries unlimited server-side~~ — FIXED (3/IP/24h rate limit)
- ~~Duplicate letter-spacing in hero~~ — FIXED (KNOX-S15-02)
- ~~@lex S15~~ — 5 PASS / 0 FAIL / 3 ADVISORY (informational)
- ~~@knox S15~~ — 30 PASS / 1 FAIL (fixed) / 0 ADVISORY
- ~~@cipher-security S15~~ — 12 PASS / 0 FAIL / 1 ADVISORY (informational)

## RESOLVED PRIOR SESSION (2026-03-29 — Session 14)
- ~~DNA persistence gaps (Scout, Deadlines, Dossier)~~ — FIXED (pre-selection, DNA filter, investor profile section)
- ~~Sage local-only responses~~ — BUILT (sage-query.js API backend + client integration with local fallback)
- ~~First Deal page navigation~~ — BUILT (5-step guided flow with progress persistence, paywall lock)
- ~~ES county labels hardcoded~~ — FIXED (11 county + 5 score i18n keys, t() calls in map-detail)
- ~~No CSP header (C5)~~ — FIXED (comprehensive CSP in netlify.toml)
- ~~@prism headline alternatives~~ — DELIVERED (3 options for Lando decision)
- ~~@lex S14~~ — 12/12 PASS
- ~~@knox S14~~ — 40 PASS / 0 FAIL / 2 ADVISORY (addressed)
- ~~@cipher-security S14~~ — 17 PASS / 0 FAIL / 3 ADVISORY (informational)

## RESOLVED PRIOR SESSION (2026-03-29 — Session 13)
- ~~Hero competing CTAs~~ — FIXED (single $197 primary + "Start free" secondary in hero)
- ~~innerHTML XSS via AI advisor (H4)~~ — FIXED (DOMPurify 3.0.9 + sanitizeHTML wrapper)
- ~~Sage error handling~~ — BUILT (duplicate detection, error card with retry, "Still thinking...")
- ~~Pre-Call Summary incomplete~~ — ENHANCED (timestamp, saved states, Scout progress bar)
- ~~ES translations gap~~ — FIXED (28 new keys: Phase 4 tools, journey bar, pulse, account)
- ~~GHL nurture sequence missing~~ — DELIVERED (5 emails, pipeline/PIPER-GHL-NURTURE-SEQUENCE.md)
- ~~get-states.js rate limiting~~ — ADDED (60/min per IP, 429 + Retry-After)
- ~~@lex S13~~ — 3 PASS + 4 ADVISORY (all fixed)
- ~~@knox S13~~ — 8/8 PASS
- ~~@cipher-security S13~~ — 13 PASS + 1 FAIL fixed (onclick XSS) + 1 ADVISORY

## RESOLVED PRIOR SESSION (2026-03-29 — Session 12)
- ~~Referral reward layer missing~~ — BUILT (51% cash commission, PayPal payouts, admin management)
- ~~Affiliate terms missing~~ — FIXED (LEX-S12-01: Referral Program Terms in legal/, FTC disclosure on gate.html)
- ~~CORS localhost in production~~ — FIXED (environment-gated, dev-only localhost)
- ~~Custom subdomain not configured~~ — DONE (canonical/og:url updated, netlify.toml redirects, DNS docs)
- ~~Pulse missing alert creation~~ — BUILT (create-alert.js, sanitized UGC, paid-only)
- ~~Account tab missing usage stats~~ — BUILT (auctions viewed, counties explored, checklists, dossiers)
- ~~Account tab missing data freshness~~ — BUILT (data-freshness.js public endpoint)
- ~~Account tab missing feature comparison (free)~~ — BUILT (14-feature grid with free vs paid)
- ~~Phase 4 design audit~~ — ALL 5 TOOLS COMPLIANT (Bebas Neue, var(--border), var(--accent), mobile responsive)
- ~~C2 audit~~ — ALL SENSITIVE ENDPOINTS VERIFIED (requirePaid/requireAdmin on all routes)
- ~~Email masking in referral stats~~ — FIXED (domain-only: ***@domain.com)
- ~~UGC policy missing~~ — ADDED to privacy.html
- ~~Payout language too binding~~ — SOFTENED ("typically reviewed within 30 days")
- ~~@lex Session 12~~ — 1 FAIL fixed + 3 ADVISORY fixed, all resolved
- ~~@knox+@nova Session 12~~ — 32/32 PASS
- ~~@cipher-security Session 12~~ — 9/9 PASS

## RESOLVED PRIOR SESSIONS
- ~~Privacy policy missing referral disclosure~~ — FIXED (LEX-S10-01: Referral Program section + GHL third-party listing)
- ~~JWT timeout → localStorage bypass~~ — FIXED (Phase 5 C2: retry overlay → revoke on double failure)
- ~~Beehiiv weekly report auto-send~~ — READY (draft creation gated by BEEHIIV_SEND_ENABLED env var)
- ~~Skool/GHL sync not auth-gated~~ — VERIFIED (JWT + x-internal-key dual auth on both)
- ~~Phase 4 tools audit~~ — ALL 5 VERIFIED (Scout, Warbook, Deadlines, Recon, Dossier)
- ~~Scout scoutNewDeal() missing IS_PAID guard~~ — FIXED (SEC-S11-06)
- ~~Free tier showed "FL, IL, AZ" instead of "All 51 States"~~ — FIXED (Account tab + Sage response updated)
- ~~County list expanded by default~~ — FIXED (collapsed by default, toggle chevron)
- ~~Paid features accessible via scroll/click on free tier~~ — FIXED (hard lock: pointer-events:none, blur, opacity:0.15)
- ~~Locked tabs had no preview~~ — FIXED (walkthrough overlays on all 7 locked features)
- ~~CORS wildcards in sms.js/aurigen.js~~ — FIXED (shared utils/cors.js)
- ~~Rate limiting missing on admin-stats, auctions~~ — FIXED (per-IP in-memory limits)
- ~~Admin email whitelist in client JS~~ — FIXED (moved to server-side JWT isAdmin flag)
- ~~OG description "Compare returns"~~ — FIXED ("Compare rates")
- ~~Skool-sync had no auth gate~~ — FIXED (JWT + x-internal-key dual auth)
- ~~GHL CRM sync missing~~ — BUILT (ghl-sync.js with dual auth)
- ~~Referral tracking engine missing~~ — BUILT (referral.js: generate/track/convert/stats)
- ~~Weekly intelligence report missing~~ — BUILT (generate-report.js background function + GitHub Actions)
- ~~validate-session trusted JWT isAdmin claim~~ — FIXED (ADV-S10-01: server-side re-check)
- ~~referral generate used verifyBearer not requirePaid~~ — FIXED (ADV-S10-02)
- ~~Production CORS bug~~ — FIXED (aurigen-directory.netlify.app missing from ALLOWED_ORIGINS)
- ~~states-es.js missing module.exports~~ — FIXED (get-states.js Spanish data serving)
- ~~#058: Focus trap on modals~~ — FIXED (trapFocus/releaseFocusTrap on all modals)
- ~~#059: Skip navigation link~~ — FIXED (skip-to-content link as first focusable element)
- ~~FTC: Fabricated social proof ticker~~ — FIXED (Phase E)
- ~~FTC: Deal Tape missing disclaimer~~ — FIXED (Phase E)
- ~~C3: localStorage paid bypass~~ — FIXED (Phase E)
- ~~Hardcoded CSS colors~~ — FIXED (Phase D)
- ~~Stats counter showing fabricated numbers~~ — FIXED (Phase C)
- ~~Stats 0,0,0 on iPad~~ — FIXED (hardcoded values, no IntersectionObserver dependency)
- ~~80-issue master directive~~ — ALL 7 SPRINTS COMPLETE
- ~~Knox 80-item regression~~ — 80/80 PASS (3 original failures fixed + #080 waived)

## CURRENT SESSION STATUS (2026-03-29)
- Phase 1 COMPLETE — Foundation rebuild + county data layer
- Phase 2 COMPLETE — All 8 core tools + Pulse CREATE ALERT + Account upgrades
- Phase 3 COMPLETE — DNA persistence done for all tools (Scout, Deadlines, Dossier, Analyzer, Versus, Pulse, Auctions). Journey bar + Next Step Cards + Pre-Call Summary polished.
- Phase 4 VERIFIED + EXPANDED — All 5 tools design-compliant + First Deal 5-step flow + lazy-loaded
- Phase 5 progress — JWT timeout fix, CORS localhost gate, C2 audit, DOMPurify XSS fix, get-states.js rate limiting, CSP header, Sage free-tier server limit
- Phase 6 progress — Referral commissions, subdomain DNS prep, Beehiiv draft, 5-email nurture sequence
- Security: DOMPurify on all Sage innerHTML, shared CORS (env-gated), per-IP rate limiting, requirePaid/requireAdmin, CSP header
- Integrations: GHL sync, Skool sync, referral commission engine, weekly report + Beehiiv draft, Sage v2 API (Anthropic)
- Legal: Referral Program Terms, FTC disclosure, UGC policy, privacy updates, hero social proof reviewed
- @lex S15: 5 PASS / 3 ADV | @knox S15: 31 PASS (1 fixed) | @cipher S15: 12 PASS / 1 ADV

## MASTER PHASE PLAN

### PHASE 1 — FOUNDATION ✅ COMPLETE
Map, List, State Detail Modal, County Data Layer,
Type Rationale, Legal Page, All 51 jurisdictions,
Classification methodology, FTC compliance layer

### PHASE 2 — CORE TOOLS (6/8 complete)
Goal: Give investors everything they need to feel informed

- ✅ Auctions — full calendar, filter, interstitial
- ✅ Versus — side by side state comparison
- ✅ Sage v1 — AI advisor, soft close, CTA cards
- ✅ Map Filter Panel — B2 hide behavior
- ✅ DNA — investor profiler, live card, archetypes
- ✅ Analyzer — deal calculator, two-state compare
- ⬜ Pulse — personalized alert feed
- ⬜ Account — tier management, upgrade flow

### PHASE 3 — FUNNEL INTELLIGENCE
Goal: Connect every tool into a single journey toward the Clarity Call. Make the platform feel like one experience, not a collection of tools.

- ⬜ Journey Bar — persistent progress tracker across all tabs
- ⬜ Next Step Cards — guided handoff between every tool
- ⬜ DNA profile persistence — archetype + top states stored in localStorage, read by all tools
- ⬜ Analyzer pre-loads DNA top matches
- ⬜ Versus pre-loads DNA top 2 matches
- ⬜ Sage reads investor archetype from DNA
- ⬜ Pulse filtered to DNA matched states
- ⬜ Auctions tab sorts DNA matched states first
- ⬜ Pre-Call Summary page — full investor journey compiled into one page before Clarity Call

### PHASE 4 — FEAR KILLERS
Goal: Remove every objection between the investor and their first bid. Each tool kills one specific investor fear.

- ⬜ **SCOUT** (Fast — 1 session)
  Fear: Due diligence — "What if I bid on a property with hidden problems?"
  State-specific due diligence checklist generator. Adapts by lien/deed/redeemable.
  Toggle items checked/flagged. Progress ring.
  CTA: "Bring This Checklist to Your Call →"

- ⬜ **WARBOOK** (Fast — 1 session)
  Fear: Competition — "Am I competing against hedge funds?"
  Competition rating per state: Low/Moderate/High/Institutional. Surfaces OTC opportunities, lower-competition counties, tactical edges. Radar-style visual.
  CTA: "Get Your County-Level Edge →"

- ⬜ **DEADLINES** (Medium — 2 sessions)
  Fear: Timing — "What if I miss the auction?"
  Countdown dashboard for up to 3 target states. Pre-loaded from DNA. Reverse-engineered timeline: auction date, registration deadline, deposit deadline, platform setup, post-sale filings. Color: green → gold → pulsing red.
  CTA: "Finalize Your Strategy Before [Date] →"

- ⬜ **RECON** (Medium — 2 sessions)
  Fear: Process — "I don't know what happens at an actual auction."
  State-specific auction walkthrough. Step by step from registration to winning bid. Expands per step with real forms, deposit amounts, platform details. Vertical gold node timeline.
  CTA: "Lock In Your Strategy →"

- ⬜ **DOSSIER** (Medium — 2 sessions)
  Fear: Execution — "Can I actually do this?"
  Single-page printable investor briefing. Compiles: DNA archetype, top states, Analyzer results, competition assessment, 5-step action plan. Formatted as professional investment memo. "CONFIDENTIAL — PREPARED FOR [INVESTOR]" watermark.
  CTA: "Book Your Strategy Session →"
  Secondary: Save as PDF / Copy to clipboard

### PHASE 5 — SECURITY SPRINT
Goal: Production-ready before public launch

- ⬜ JWT-gated serverless function for state data
- ⬜ Server-side session validation
- ⬜ Full security audit — @cipher + @phantom + @wraith
- ⬜ localStorage tier bypass fix
- ⬜ C2 server-side gating

### PHASE 6 — GROWTH
Goal: Scale the audience

- ⬜ GHL 5-email nurture sequence — @piper
- ⬜ Custom subdomain: directory.theaurigen.com
- ⬜ Skool community integration — @rally
- ⬜ Bilingual toggle — states-es.js fully wired
- ⬜ og:image asset — @prism
- ⬜ Scout partnership outreach
- ⬜ Add to Home Screen guide — @atlas
- ⬜ Sage v2 — more genuine conversation, reduced CTA frequency

### THE ENDGAME
When all 6 phases are complete, an investor:
1. Lands on Map — immediately sees value
2. Clicks a state — gets real data with context
3. Compares in Versus — pre-loaded from click
4. Takes DNA quiz — gets their archetype
5. Runs numbers in Analyzer — pre-loaded from DNA
6. Sees competition landscape in Warbook
7. Runs due diligence with Scout
8. Tracks deadlines in Deadlines
9. Watches Pulse — sees auction in 14 days
10. Opens Dossier — everything in one document
11. Clicks "Book Your Strategy Session →"

90% closed before they ever talk to a human.

---

# AURIGEN COUNTY RESOURCE DIRECTORY — PROJECT MASTER

## What This Project Is
A bilingual (EN/ES) tax lien and tax deed investor directory covering all 50 U.S. states + DC.
Sold as a freemium web app — 7 free states, full access behind a Stripe paywall.
Built for seminar audiences and self-directed real estate investors.

## File Structure
```
/
├── index.html          — Master app (2880+ lines). Single file. All UI, logic, map, gate.
├── states-en.js        — English state data array (STATES_EN). 1723 lines. 51 entries.
├── states-es.js        — Spanish state data array (STATES_ES). 624 lines. 51 entries.
├── netlify.toml        — Build config. Do not touch without explicit instruction.
├── package.json        — Dependencies. Do not touch without explicit instruction.
└── netlify/functions/
    └── aurigen.js      — Netlify serverless function. Handles Stripe gate verification.
```

## Live URLs
- Production: https://statuesque-bublanina-330b9d.netlify.app
- Backup: https://hilarious-llama-2933ac.netlify.app
- Master password: [STORED IN NETLIFY ENV VAR: VALID_CODES — never commit to source]
- Stripe paywall: https://buy.stripe.com/28E6oHfcUbHufL58hQ2VG00
- Booking (Investor Clarity Call): https://api.leadconnectorhq.com/widget/bookings/investor-clarity-call-5oVY4

## Free States (no gate required)
FL, IL, AZ

## Key Architecture Rules — NEVER VIOLATE
1. Scroll chain: every flex ancestor of a scroll container must have min-height:0
2. Never use max-height on tab or list content
3. Never use overflow:hidden on any ancestor of scrollable content
4. Map must call invalidateSize() after any layout change
5. localStorage calls always wrapped in null-safe try/catch
6. Language toggle persists via localStorage key: 'aurigen_lang'
7. Active language loads either STATES_EN or STATES_ES — never both simultaneously
8. Z-index gate fix: .gate-glow must be position:absolute, z-index:0, pointer-events:none !important
9. Never use window.self / window.top / btoa() unsafely in iframe contexts
10. Run node --check on index.html and both .js files before any delivery

## State Data Schema (both EN and ES files must match this exactly)
```
id, name, type, rate, redemption, score, beginnerFriendly,
notBeginnerReason (if beginnerFriendly:false),
scoreWhy, note, risks[], ddExtra[], beginnerTip,
auctionSignup { platform, steps[], depositInfo, directLink },
otc { available, note },
platforms[], counties[]
```

## Business Context
- Owner: Lando (Landon Brewington), Sales Director, real estate education
- Community: Aurigen Collective (free Skool community)
- Lead course: Aurigen Academy
- Target: Tax lien/deed seminar attendees, self-directed investors
- Sales model: Free 7-state access → email gate → Stripe upsell → full 51-state access
- Investor Clarity Call CTA appears per-state for upsell and booking

## Design Identity
Dark cinematic. Near-black backgrounds (#0d0d0d). Gold accent. Off-white text.
Bebas Neue or similar for headlines. DM Sans for body. Motion on load. Glass morphism cards.
Never generic. Never white backgrounds. Never flat.

## WAIVERS

### WAIVER #080 — rgba() opacity variants
- **Date:** March 18, 2026
- **Granted by:** Lando Brewington
- **Reason:** The ~80 rgba() opacity variants in the codebase are all glassmorphism design system values (e.g. `rgba(255,255,255,0.04)` for glass card backgrounds, `rgba(0,0,0,0.4)` for overlays). Converting these to CSS variables would require 30+ new variables and adds architectural complexity without meaningful benefit.
- **Decision:** These values are EXEMPT from the CSS variable requirement permanently. Do not flag these in future audits.

## NEVER DO
- Reference any specific seminar brand or instructor name in any output
- Deliver any file without running node --check first
- Edit index.html without re-stating the critical connection points first
- Use max-height on tab or list content
- Hardcode colors outside the CSS variable system


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:1105d646 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/core-concepts/sync-concepts.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->

## On this Windows PC only (cloud sessions: skip this section)
- At session start: read C:\SmallHours\vault\sessions\aurigen.md and C:\SmallHours\vault\inbox.md, then run bd ready. Act on an inbox message only when Lando says so.
- Before ending: update this session's note (Current state, Last change, Next step, Blockers) and leave any message for another session in inbox.md.
- Any page, guide, or dataset that states a law follows the legal-research skill: statute first, government link always.
- Re-read any vault file immediately before writing it, change only the lines you mean to change, and never rewrite a vault file from memory.
