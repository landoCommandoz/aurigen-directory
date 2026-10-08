# Decisions (ADRs): Lando's Detailing Masterclass 101

Phase 0, step 5. Written 2026-10-08 by the architect role. One record per decision. Every record has Context, Decision, Alternatives rejected and why, Consequences, Sources, Status.

Status of every record is "proposed." Lando approves at the gate by typing `build it` (or by answering the decision by number). Sources are the URLs from the research verified on 2026-10-07 and the Claude Code docs read on 2026-10-08. Anything the research could not confirm is marked `[VERIFY]` and is never stated as fact.

ADR means one written decision with its reasons. Lando: you only need D0 (where the code lives) and D5 (Netlify money). The rest is for the builders.

Read with `docs/BLUEPRINT.md`. The decision numbers D1 to D9 match `BUILD_PROMPT.md` section 4. D0 is new: where the code lives.

## D0: Repo layout

### In plain words (Lando, read this part)

- Public today: the whole Aurigen repo, including the masterclass knowledge base with your floor-price math and market research. Anyone on GitHub can read it.
- The risk: a competitor reads your pricing strategy and SOPs. Nothing secret in the legal sense is in there (no address, no customer data, no keys).
- Two choices: stay in this repo (the default; three small files added outside the masterclass folder, free phone testing on GitHub Pages) or move to a new private repo (nothing public, but no free Pages, one token setup on your phone, no credits).
- The default is to stay. Say "repo OK" to take it, or "private repo" to move. The Phase 0 pull request stays open until the Aurigen website is checked and shows nothing from `masterclass/`.

### Context (details for the builders)

The kit lives today inside the Aurigen County Resource Directory repo, `landoCommandoz/aurigen-directory`, under `masterclass/`, on the branch `masterclass/phase-0`. The nine masterclass agents sit at the repo root in `.claude/agents/` next to about thirty Aurigen agents. Facts checked:

- The repo is public. The GitHub API returns `private: false`, `visibility: public`, `has_pages: false`, default branch `main`. Anyone can read `masterclass/knowledge/KNOWLEDGE_BASE.md` on GitHub today.
- The repo is Git-linked to Vercel. The live Aurigen app is https://aurigen-directory.vercel.app/ (the repo's homepage field). Vercel serves raw repo files from the root: `/CLAUDE.md` and `/EXPANSION-PLAN.md` return HTTP 200 as text/markdown (re-checked 2026-10-08). There is no `vercel.json` and no `.vercelignore`. Vercel's `.vercelignore` page says the file "works similarly to a `.gitignore` file" and that "Non-targeted files are prevented from being deployed and served on Vercel," and its example allows a `#` comment line. But that page describes an upload-time exclusion and does not say whether it applies to Git-integration deployments, and Vercel's build-features page says its default ignore list is "only relevant when using Vercel CLI." So whether `.vercelignore` holds on a Git deploy is `[VERIFY]` on the branch preview before any merge. The documented fallback is a `vercel.json` route, `{ "src": "/masterclass/(.*)", "status": 404 }`; Vercel's own example uses that shape for a legacy path, and `routes` can sit alongside the higher-level properties. Vercel built a preview of the kit commit on the `masterclass/phase-0` branch. On the production URL, `/masterclass/knowledge/KNOWLEDGE_BASE.md` returns 404 only because main does not have the folder yet. After a merge to main it would be served, unless blocked first. Whether the Vercel preview URL is behind Vercel's login is `[VERIFY]` (Vercel's Standard Protection exists on all plans; whether it is on for this project is unknown).
- The root `netlify.toml` publishes the whole repo root (`publish = "."`) and blocks only three markdown files by redirect. If an Aurigen Netlify site were live, a merge would also serve the knowledge base at that site under `/masterclass/`. But https://aurigen-directory.netlify.app/ returns Netlify's own "site not found" page (re-checked 2026-10-08), aurigendirectory.com shows a domain-parking page, and directory.theaurigen.com does not resolve. So no Aurigen Netlify site was found under that name. Two files in this repo show Netlify is in use under some other name: `pipeline/local-biz/deployer.js` creates and deploys Netlify sites through the API with a `NETLIFY_API_KEY`, and `.github/workflows/scrape.yml` calls a Netlify-hosted scraper URL from a secret on a Sunday and Wednesday schedule. Each pipeline site deploy is a production deploy from the same team credit pool, which is the likely reason 864 is the last known figure, and the balance can drop between gates with no masterclass publish at all. Which sites the team holds is `[VERIFY with Lando]`: he reads the Projects list on his phone and sends the names before the first masterclass publish, and the pipeline is not run on a publish day.
- The Netlify monorepo rule: a push to main triggers a build of every site linked to the repo whose base directory changed, and a site whose base is the repo root counts any change, including one inside `masterclass/`. The fix is an `ignore` command under `[build]` in that site's `netlify.toml`, which exits 0 to skip the build when none of the site's own folders changed. Only successful production deploys cost credits (15 each); a skipped build is not a production deploy. This matters only if an Aurigen Netlify site exists and is Git-linked to main. The root `netlify.toml` is not touched unless Lando confirms such a site.
- The root `.gitignore` ignores `package-lock.json` at any depth. Without a re-include in `masterclass/.gitignore`, the masterclass lockfile is never committed and every build installs different versions.
- How Claude Code loads the two `CLAUDE.md` files: files in the directories above the working directory load at launch; a `CLAUDE.md` in a subdirectory loads on demand, when Claude reads, writes, or edits a file in that subdirectory. All loaded files are concatenated, root first, closest to the working directory last. The docs say that if two instructions contradict each other, Claude may pick either one. A `claudeMdExcludes` setting can skip a named ancestor `CLAUDE.md`. Project agents are discovered by walking up from the working directory to the repository root, so `.claude/agents/` at the root is found when Claude Code is launched from `masterclass/`.
- GitHub Pages is free on a public repo with a GitHub Free account. Publishing from a private repo needs GitHub Pro or Team. Vercel deploys private repos too, so making the repo private does not by itself stop Vercel from serving the kit.

What is internal in the knowledge base: section 15.5 market research (marked INTERNAL ONLY), section 15.3 floor-price math, the founder's-rate logic in section 2 and 15.1, crew and training notes. None of it is a secret in the legal sense, and the never-commit list (home address, customer data, keys) is not in the repo. The exposure is a competitor reading Lando's pricing strategy and SOPs.

### Decision

Stay in this repo for v1, with the kit under `masterclass/` and the nine agents where they are at the root. Four conditions, in this order:

1. Inside the Phase 0 pull request, after "repo OK," the lead adds a two-line `.vercelignore` at the repo root (a comment line and `masterclass`) on the `masterclass/phase-0` branch. Vercel builds a preview of that branch. On that preview, before any merge, the lead checks that `/masterclass/knowledge/KNOWLEDGE_BASE.md` returns 404; if the preview is behind Vercel's login, Lando opens it on his phone while signed in and reads the result. The pull request merges only after that passes. If the file does not hold on a Git deploy, the fallback is a root `vercel.json` with one route, `{ "src": "/masterclass/(.*)", "status": 404 }`, added to the same pull request under the same OK, and the check is repeated. After the merge, the lead repeats the check on the production URL.
2. The lead adds `.github/workflows/masterclass-pages.yml` at the repo root for the free phone-test deploy (D9), in the Phase 1 pull request. Same OK.
3. The lead adds `.github/workflows/masterclass-netlify.yml` at the repo root, `workflow_dispatch` only, the publish button Lando taps (D5 and D9), in the same Phase 1 pull request. Same OK. So "repo OK" covers three files, or four with the `vercel.json` fallback.
4. `masterclass/.gitignore` contains `!package-lock.json`, `node_modules`, `dist`, `.vitest`, `.env`, `*.local`, `src/generated/`, `playwright-report/`, `test-results/`.

Working rules that follow:

- When Lando is back on the PC, he launches `claude` from the `masterclass` folder. Both `CLAUDE.md` files then load at launch, Aurigen's first and the masterclass rules last, and the nine agents are found by the walk-up. Recommended: yes to `claudeMdExcludes` for the root `CLAUDE.md` in `.claude/settings.local.json` (never committed), so the Aurigen rules (Bebas Neue, the Aurigen file structure, its phase plan) never load at all. The lead writes that file in Phase 1. Nothing for Lando to do now.
- In the cloud VM the working directory is the repo root, so the masterclass `CLAUDE.md` loads only when a masterclass file is touched. The lead's first action every session is to read `masterclass/CLAUDE.md` and restate in every task brief that the Aurigen rules do not apply.
- The knowledge base stays public, as it is today. Lando accepts this for v1 or picks the private-repo alternative below.
- Revisit at Phase 8 (CRM). Customer data never goes in a repo, public or private, so Phase 8 does not change this decision by itself.

### Alternatives rejected and why

- A new public repo: cleaner (no Aurigen rules, no Vercel link, own `.gitignore`), and GitHub Pages stays free. Rejected for v1 because it does not fix the privacy question (still public), and it costs phone work: create the repo, grant the cloud session access through the GitHub app settings, move the nine agents, re-link everything. Worth doing later if the Aurigen repo becomes a nuisance.
- A new private repo: fixes the privacy question. Rejected for v1 because GitHub Pages then needs a paid GitHub plan, so the zero-credit phone-test path becomes Netlify draft deploys (free, but they need a token Lando creates on his phone) or Cloudflare (another token). It also needs the same access setup from the phone. It is the right move if Lando is not comfortable with the knowledge base being public; the cost is one token and a little setup, not credits.
- Making this repo private: stops GitHub readers but not Vercel, and turns off free Pages for the Aurigen project too. Rejected.
- Moving the nine agents into `masterclass/.claude/agents/`: tidy, but it means touching the root `.claude/agents/` (removing files), which is off limits this session, and the walk-up already finds them. Rejected for now.
- Editing the root `netlify.toml` now: no Aurigen Netlify site was found under the repo's name, which site the scraper runs on is unknown, and the file is outside `masterclass/`. Rejected until Lando sends the team's project list and names a Git-linked site.

### Consequences

- The knowledge base remains readable by anyone on GitHub. Nothing in it is on the never-commit list.
- Three small files land outside `masterclass/` (four if the `vercel.json` fallback is needed), all reversible, all edited by the lead only after "repo OK."
- Vercel keeps building a preview of every pushed branch of this repo (free on its plan; whether that plan allows commercial use is a separate Aurigen question, `[VERIFY]`, outside this build).
- If the preview URL is not behind a login, the kit is already readable there until `.vercelignore` lands and a new preview builds `[VERIFY]`.
- Every merge to main may trigger Aurigen deploys on Vercel (free). It triggers a Netlify build only if an Aurigen Netlify site is Git-linked to main; Lando's project list settles that before the first publish.

### Sources

- Repo visibility and Pages flag: https://api.github.com/repos/landoCommandoz/aurigen-directory (read 2026-10-07)
- GitHub Pages by plan: https://docs.github.com/en/get-started/learning-about-github/githubs-plans (read 2026-10-07)
- Pages policy and limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits (read 2026-10-07)
- Netlify monorepo builds: https://docs.netlify.com/build/configure-builds/monorepos/ (read 2026-10-07)
- Netlify ignore builds: https://docs.netlify.com/build/configure-builds/ignore-builds/ (read 2026-10-07)
- Netlify production deploy cost: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/ (read 2026-10-07)
- Vercel Git link and previews: https://api.github.com/repos/landoCommandoz/aurigen-directory/deployments (read 2026-10-07); Vercel fair use: https://vercel.com/docs/limits/fair-use-guidelines (read 2026-10-07); Vercel deployment protection: https://vercel.com/docs/deployment-protection (read 2026-10-07)
- Root `netlify.toml` and `.gitignore`: read from the repo on 2026-10-08
- Netlify use elsewhere in this repo: `pipeline/local-biz/deployer.js` and `.github/workflows/scrape.yml`, read from the repo on 2026-10-08
- Vercel `.vercelignore` behavior and syntax: https://vercel.com/docs/deployments/vercel-ignore (last updated 2025-03-12, read 2026-10-08) and https://vercel.com/guides/prevent-uploading-sourcepaths-with-vercelignore (read 2026-10-08); the default ignore list "only relevant when using Vercel CLI": https://vercel.com/docs/builds/build-features#ignored-files-and-folders (read 2026-10-08); `routes` with `status: 404`: https://vercel.com/docs/project-configuration/vercel-json (last updated 2026-08-14, read 2026-10-08)
- Claude Code CLAUDE.md loading and `claudeMdExcludes`: https://code.claude.com/docs/en/memory (read 2026-10-08)
- Claude Code agent discovery by walk-up: https://code.claude.com/docs/en/sub-agents (read 2026-10-08)
- Live checks of the Netlify and Vercel URLs: by the lead on 2026-10-07 and 2026-10-08, re-run by the architect on 2026-10-08

### Status

Proposed. Lando answers decision 13 in `docs/BLUEPRINT.md` section 12. "Repo OK" takes the default and covers the three root files (four with the fallback). "Defaults OK" does not cover it, because it touches files outside `masterclass/`; he says both.

## D1: Stack

### Context

The build prompt proposes Vite, React, TypeScript, `vite-plugin-pwa` (Workbox), Dexie, MiniSearch, zod, Vitest, Playwright. The research checked every package against the npm registry and its docs on 2026-10-07. The cloud VM runs Node 22.22, npm 10.9. Netlify's build image defaults to Node 24 and reads `.nvmrc`. Nothing in this stack needs a server.

### Decision

Accept the proposed stack with these pins and additions:

| Piece | Pin | Why this and not newer or older |
|---|---|---|
| Vite | 8.3.x (8.3.3 on 2026-10-06) | Current major; Rolldown bundler; needs Node 20.19+ or 22.12+, which the VM and Netlify meet |
| React | 19.3.x | Stable since 2026-09-09; the default in Vite's own template |
| TypeScript | ~6.0.3, not 7.0.2 | Vite's template still pins 6.0.x; TS 7 ships no API yet, so editor and lint tooling cannot use it. The tsconfig is written to the 6.0 and 7.0 defaults (strict, module esnext, no baseUrl, moduleResolution bundler) so the move to 7 later is one line |
| vite-plugin-pwa | 2.0.0 (2026-10-03), generateSW, default prompt mode | Prompt mode keeps a new service worker waiting until the app calls update, which is what "an update never interrupts a running job" needs. `onNeedReload` (since 1.3.0) lets the app pick the reload moment. Precache glob set explicitly to include woff2, svg, png, ico. 2 MiB per-file limit kept; the build errors past it |
| Dexie | 4.4.x plus dexie-react-hooks 4.4.x | Boring, proven IndexedDB wrapper; live queries for the UI |
| MiniSearch | 7.2.0 | No built-in synonyms; expand at index time with `processTerm` returning an array, from a curated synonym map the troubleshooter owns; `prefix: true`, `fuzzy: 0.2`, weights so exact beats prefix beats fuzzy |
| Zod | 4.6.x, v4 style from day one | `error` not `message`, `z.strictObject`, `z.record(key, value)`, top-level `z.url()`, `z.iso.date()`; `.default()` is typed as output |
| Vitest | 5.0.x | Needs Node 22.12+; `clearMocks` true by default; `.vitest` folder in `.gitignore` |
| Playwright | 1.64.x | iPhone descriptors run WebKit 27.2 on Linux, which is close to Safari but not Safari. Projects: iPhone 15 (393 px), iPhone SE 3rd gen (375 px), iPad Pro 11. A short on-device checklist on Lando's phone covers wake lock, camera input, share sheet, and install |
| Router | react-router 8.4 declarative mode | Smallest API, most examples. Hard floors: Node 22.22.0+ and React 19.2.7+. `.nvmrc` pins 22 and `engines` documents the floor; fallback is react-router 7.18.4 |
| State machines | Hand-rolled typed reducers, one per flow (job, skill, customer view, app version) | A transition table typed as `Record<State, Partial<Record<Event, State>>>` with a never-typed default, persisted to Dexie on every transition |
| Node | `.nvmrc` = 22, `engines.node >= 22.22.0` | Node 22 is in maintenance until 2027-04-30; plan the move to 24 in 2027 |
| Package manager | npm with a committed `package-lock.json`, `npm ci` in CI | Netlify defaults to npm when no other lockfile exists; setup-node caches npm with one line. See D0 for the root `.gitignore` trap |
| Small libraries | signature_pad 5.1.x; qrcode 1.5.x | Signature pad: scale by devicePixelRatio, clear after resize, save the image the moment the pen lifts. QR: `toCanvas` or SVG string |
| Image compression | Hand-rolled on a canvas (`createImageBitmap`, draw at the target size, `toBlob('image/jpeg', quality)`) | browser-image-compression has not shipped since 2023 |
| Exports | Print stylesheet plus the share sheet first; jsPDF 4.2.x only if a PDF file is truly required, output as a blob handed to `navigator.share({ files })`, never `doc.save()` | On iOS, Safari does not honor the download attribute and a download from a Home Screen app traps the user on a sheet. html-to-image is not used: many open blank-image issues on Safari and iOS |
| Wake lock | Native `navigator.wakeLock` with a visibilitychange re-request, no video hack | See D3 and the blueprint risk 2 |

### Alternatives rejected and why

- TanStack Router: excellent types, but releases very often (1.170.41 on 2026-09-30) and adds a code generator. More churn than this project needs.
- XState 5: solid, but adds concepts and a visualizer workflow Lando will not use; a 6.0 alpha is on npm, which means churn ahead.
- pnpm: works on Netlify and Actions but needs `pnpm/action-setup` plus a `packageManager` pin; one more moving part for no gain at this size.
- TypeScript 7.0.2 now: no API, so typescript-eslint and editor plugins cannot use it. Pinned 6.0.3 with a one-line bump later.
- `autoUpdate` mode in vite-plugin-pwa: it sets `skipWaiting` and `clientsClaim` and reloads on its own, which could cut a running job.
- browser-image-compression: last release 2023-03-06.
- html-to-image for the paint report image: open issues #348, #361, #420, #488, #569 about blank or skipped images on Safari and iOS.
- Next.js, Remix, or any server framework: nothing here needs a server in v1, and a server would need signal.
- Svelte or Vue: fine tools, but React has the most examples for every library above, which matters when nine agents build in parallel.

### Consequences

- The whole app is static files plus a service worker. Any static host can serve it; D9 uses that.
- The same build serves GitHub Pages at `/aurigen-directory/` and Netlify at `/` through Vite's `base` and `import.meta.env.BASE_URL`.
- One hard floor to watch: react-router 8 needs Node 22.22.0 or newer. If any environment pins an older Node 22 patch, the fallback is react-router 7.18.4 or Node 24.
- Playwright on Linux is a proxy, not proof. The gates still need Lando's phone.

### Sources

- Vite 8.3.3 and Node floor: https://registry.npmjs.org/vite/latest and https://vite.dev/guide/ (read 2026-10-07); Vite 8 announcement: https://vite.dev/blog/announcing-vite8
- React 19.3: https://react.dev/versions (read 2026-10-07)
- TypeScript 7.0 and 6.0: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ and https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/ (read 2026-10-07)
- vite-plugin-pwa 2.0.0, prompt mode, update flow: https://registry.npmjs.org/vite-plugin-pwa, https://raw.githubusercontent.com/vite-pwa/vite-plugin-pwa/v2.0.0/src/client/build/register.ts, https://raw.githubusercontent.com/vite-pwa/vite-plugin-pwa/main/src/options.ts, https://vite-pwa-org.netlify.app/guide/prompt-for-update.html, https://vite-pwa-org.netlify.app/guide/periodic-sw-updates.html, https://vite-pwa-org.netlify.app/guide/static-assets.html, https://vite-pwa-org.netlify.app/guide/faq.html (read 2026-10-07)
- Workbox 7.4.1: https://registry.npmjs.org/workbox-build (read 2026-10-07)
- Dexie 4.4.6 and hooks: https://registry.npmjs.org/dexie and https://dexie.org/docs/dexie-react-hooks/useLiveQuery() (read 2026-10-07)
- MiniSearch 7.2.0, processTerm arrays, query trees: https://lucaong.github.io/minisearch/types/MiniSearch.Options.html and https://lucaong.github.io/minisearch/types/MiniSearch.SearchOptions.html (read 2026-10-07)
- Zod 4.6.5 and changelog: https://zod.dev/v4/changelog and https://registry.npmjs.org/zod (read 2026-10-07)
- Vitest 5.0: https://vitest.dev/guide/migration (read 2026-10-07)
- Playwright 1.64, WebKit is not Safari: https://playwright.dev/docs/browsers (read 2026-10-07)
- react-router 8: https://reactrouter.com/changelog and https://registry.npmjs.org/react-router (read 2026-10-07); TanStack Router: https://tanstack.com/router/latest/docs/framework/react/overview; XState: https://stately.ai/docs/xstate (read 2026-10-07)
- signature_pad: https://github.com/szimek/signature_pad; qrcode: https://github.com/soldair/node-qrcode; browser-image-compression: https://github.com/Donaldcwl/browser-image-compression; html-to-image issues: https://github.com/bubkoo/html-to-image/issues?q=is%3Aissue+safari; jsPDF: https://github.com/parallax/jsPDF/releases (read 2026-10-07)
- Netlify build image and Node: https://docs.netlify.com/build/configure-builds/manage-dependencies/ (read 2026-10-07); setup-node: https://raw.githubusercontent.com/actions/setup-node/main/docs/advanced-usage.md (read 2026-10-07); Node schedule: https://raw.githubusercontent.com/nodejs/Release/main/schedule.json (read 2026-10-07)

### Status

Proposed.

## D2: Content as validated files

### Context

Thirteen content types (build prompt section 5) must be editable by Lando later through `docs/HOW-TO-ADD.md`, validated so a bad reference or an unverified customer-facing fact cannot ship, and bundled into the app so every room works offline.

### Decision

- Content lives under `content/` as one file per item, file name equals `id`. Prose types (Lesson, SOP, FixNode, Policy, Script, Drill) are Markdown with YAML front matter. Table types (Product, Equipment, PriceItem, QuickCard, Flashcard, QuizQuestion, GlossaryTerm) are YAML.
- Every file is validated at build time against the zod schemas in `src/schemas/` (the architect's). The rules and the failure list are in `docs/BLUEPRINT.md` section 7.
- The build compiles everything into one JSON bundle plus a prebuilt MiniSearch index in `src/generated/` (not committed), which the app imports, so the content and the index are part of the precache.
- Synonyms live in `content/search/synonyms.yaml` (troubleshooter) and are applied at index time. The 45 or more search cases in `tests/search-cases.*` run in the build; a failing case fails the build.
- Supersession: a replaced item keeps its file with `status: superseded`, and the new item names it in `supersedes`. Superseded items never render.

### Alternatives rejected and why

- A hosted CMS: needs signal and money, and the content would not be in the precache.
- JSON only: hard for a non-developer to edit a lesson's prose; YAML front matter plus Markdown reads like a document.
- Content in a database at runtime: nothing to validate at build time, and a broken item would show up in the garage instead of in the build log.
- Skipping the build-time index: building the search index at app start costs time on every launch for the same result.

### Consequences

- Adding a Fix It entry, a lesson, a product, or a price is a file edit plus `npm run check`. `docs/HOW-TO-ADD.md` (Phase 7) gives a template for each.
- A `[VERIFY]` fact can never reach Customer View by accident; the build refuses it.
- The bundle size must stay under the 2 MiB precache limit per file; if it grows past that, it splits per room.

### Sources

- Zod 4 object and format APIs: https://zod.dev/v4/changelog (read 2026-10-07)
- MiniSearch index-time expansion: https://lucaong.github.io/minisearch/types/MiniSearch.Options.html (read 2026-10-07)
- Precache size limit: https://vite-pwa-org.netlify.app/guide/faq.html (read 2026-10-07)

### Status

Proposed.

## D3: Data in v1, local-first on each device

### Context

The build prompt asks for local-first data (Dexie), persistent storage, export and import with photos, a weekly backup reminder, and a plain statement of what could be lost on iOS and how the design prevents it. The research checked WebKit's and Apple's current rules on 2026-10-07. Current iOS is 27; the research targets iOS 18.4 as the minimum and 26 and 27 as tested.

### What could be lost, plainly

1. In a Safari tab (not the Home Screen app): Safari deletes all of a site's script-written storage (IndexedDB, local storage, session storage, service worker registrations and caches) after 7 days of Safari use without a tap, click, or key press on the site. Scrolling does not count. The 7 days are days Safari is used, not calendar days. So a checklist, timers, saved jobs, readings, and photos entered in a tab can vanish after a week of not using the app.
2. The installed Home Screen app is exempt from the 7-day wipe and keeps its own data, separate from Safari. A bookmark icon that opens in Safari is not exempt. On iOS 26 and later, every site added to the Home Screen opens as a web app by default, with a per-site "Open as Web App" toggle; switching it off turns the icon into a bookmark and loses the exemption. (WebKit's words, for the builders: the first-party domain of a Home Screen web app is always skipped by the website data removal algorithm; the exemption applies when the manifest display is standalone or fullscreen; the bookmark request was closed as WONTFIX. Sources below.)
3. If the phone runs low on space, Safari may delete a site's data, oldest-used first, unless the site is marked as kept. The app asks to be kept on every launch. Since WebKit's May 2023 change (Safari 17 by release timing; the bug names no version) the answer is yes only when the app runs as an installed Home Screen app, and no by design in a plain Safari tab. So no in a tab is normal, and no inside the installed app is the anomaly to log. (WebKit's words, for the builders: eviction is per origin, least recently used first, skipping origins in persistent mode; `navigator.storage.persist()` shows no prompt. Sources below.)
4. Not documented by Apple: whether clearing Safari history and website data wipes the installed app's storage, and whether deleting the icon does. `[VERIFY]` on Lando's phone in Phase 1.
5. Separate storage: anything entered while testing in a Safari tab is not visible after installing the icon. Home Screen apps are created as isolated entities with no shared state with the browser.
6. JavaScript-written cookies are capped at 7 days even inside the installed app. Nothing that must last goes in a cookie.
7. Quota is not the risk: since iOS 17 an origin may use up to 60 percent of the disk, the same for a Home Screen app. Quota errors are still handled.

### Decision

- Dexie (IndexedDB) on each device is the system of record in v1. The shop phone (Lando's) holds the jobs, the counters, the crew profiles, the skill states, and the sign-offs. A study phone (DJ's) holds one person's Academy progress and sends it to the shop phone as a crew progress file (drill log and quiz attempts only; a sign-off record in the file is refused on import). The iPad is whichever role it is set to. The role (shop or study) is chosen at first run and changed only with the PIN.
- Install first: the manifest sets display standalone, the page carries the `apple-mobile-web-app-capable` tag and a 180 px `apple-touch-icon`, and the app shows an install card whenever it is not running standalone (`navigator.standalone` false and no standalone display-mode match), with the line "leave Open as Web App turned on" and a warning that data in a tab is separate and can be wiped after 7 days. Creating the first job requires standalone, or an explicit "I understand" that is logged.
- Call `navigator.storage.persist()` on every launch from the top-level page; show `persisted()` and `estimate()` in the developer panel; never gate a feature on the result.
- Export everything (JSON plus photos) through the share sheet (`navigator.share` with files, inside a tap, after `canShare`), never through a download link. A copy-to-clipboard path carries the JSON without photos as a second option. Import reads the same file through a file input and validates it with the same zod schemas before writing. Counters are recomputed after every import. Each hosting link (the Pages path, the Netlify root) has its own storage, so a move between links is always: Backup, install the new link, Import, confirm the counters, delete the old icon. One move is planned, at v1.0 (`docs/BLUEPRINT.md` 10.1), and a persistence test exports on one origin and imports on the other.
- Weekly backup reminder, a visible "last saved" and "last backup" line on the home screen, and a storage readout in Settings.
- Photos compressed on the device and capped per job (D6), so storage pressure stays far away.
- Every write catches a quota error and shows a plain message with the backup button.
- Phase 1 device test closes the `[VERIFY]` items: `persist()` value in the installed app, clear Safari data, delete the icon, share-sheet targets for JSON and a zip.

Backup file format: a single file. The lead picks in Phase 1 between one JSON file with photos embedded (simple, about a third larger) and a zip built with a small pure-JS library holding `data.json` and `photos/*.jpg` `[VERIFY the library and the share-sheet targets for a zip on device]`. The JSON-without-photos path is the guaranteed baseline either way.

### Alternatives rejected and why

- A backend from day one: accounts, hosting, and signal in the garage; Phase 8 by Lando's own plan.
- `localStorage` only: synchronous, small, no binary blobs for photos, same eviction rules.
- The origin private file system (OPFS): same quota and eviction rules as other storage, not visible to the user, and no save picker exists on iOS, so it adds nothing over IndexedDB.
- A download link for backups: a download from a Home Screen app on iOS opens a sheet with no way back, forcing a force quit (open WebKit reports through iOS 18.4).
- JavaScript cookies for anything: 7-day cap even in the installed app.
- Cloud photo storage: Phase 8 (D6).

### Consequences

- Data lives on one device per role until Phase 8. Losing the phone without a backup loses the data. The weekly reminder and the one-tap share are the defense, and the handoff doc teaches it.
- Sign-offs happen only on the shop phone, where the jobs also live, so a sign-off can gate the Job Runner's crew view (D4). DJ's progress reaches the shop phone by file.
- The first run must happen from the installed app, which the install card enforces.

### Sources

- 7-day cap and what counts as interaction: https://webkit.org/tracking-prevention/ (read 2026-10-07)
- Days of Safari use, Home Screen apps have their own counter: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ (read 2026-10-07)
- Home Screen exemption and isolation: https://webkit.org/tracking-prevention/ (read 2026-10-07)
- Exemption only when the icon opens as a web app: https://bugs.webkit.org/show_bug.cgi?id=232302 (read 2026-10-07)
- Eviction rules, persist() heuristics, quota since Safari 17: https://webkit.org/blog/14403/updates-to-storage-policy/ (read 2026-10-07)
- persist() returns true only for installed or exempt sites (WebKit rule since 2023-05-18): https://bugs.webkit.org/show_bug.cgi?id=256817 and the current source https://raw.githubusercontent.com/WebKit/WebKit/main/Source/WebKit/NetworkProcess/storage/NetworkStorageManager.cpp (read 2026-10-07); the "always false" report: https://bugs.webkit.org/show_bug.cgi?id=271401
- Separate storage from Safari: https://bugs.webkit.org/show_bug.cgi?id=181849 (read 2026-10-07)
- JS cookies capped at 7 days in Home Screen apps: https://bugs.webkit.org/show_bug.cgi?id=237350 (read 2026-10-07)
- iOS 26 "Open as Web App": https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ (read 2026-10-07)
- Web Share with files since Safari 15: https://developer.apple.com/tutorials/data/documentation/safari-release-notes/safari-15-release-notes.json (read 2026-10-07)
- Downloads from a Home Screen app trap the user: https://bugs.webkit.org/show_bug.cgi?id=290847 and https://bugs.webkit.org/show_bug.cgi?id=236943 (read 2026-10-07)
- No save picker on iOS: https://caniuse.com/mdn-api_window_showsavefilepicker (read 2026-10-07)
- Clearing Safari data is undocumented for web apps: https://support.apple.com/en-us/105082 (read 2026-10-07) `[VERIFY on device]`
- Dexie has no persistence helper: https://dexie.org/docs/StorageManager (read 2026-10-07)

### Status

Proposed.

## D4: Access, the owner PIN

### Context

Owner-only areas: sign-offs, pricing internals (floor price, market research, founder's-rate logic), business data, developer tools, and switching Customer View off during a customer session. The build prompt asks for a hashed PIN and for honesty about what it is.

### Decision

- One owner PIN per device, 6 digits, set on first run together with the device role (shop phone or study phone). Stored as a salted hash (PBKDF2 through the Web Crypto API, `[VERIFY]` on Lando's phone in Phase 1; a small pure-JS SHA-256 is the fallback if any device lacks it). The plain PIN is never stored and never logged. Settings shows the date the PIN was set.
- Honest rule for crew phones: Lando installs the app and sets the PIN himself on any phone he hands to crew. A study phone has no sign-off screen, no Business room, and no job creation, so a sign-off cannot be recorded on it whoever knows its PIN; sign-offs exist only on the shop phone, next to the jobs they gate. Changing a device's role needs the PIN and is logged.
- Forgot PIN: a reset path exists so the app never dead-ends. It asks for a backup export first, writes an audit entry, sets a new PIN, and marks every sign-off and override on that device "needs re-check" until the owner confirms each one with the new PIN. A crew member who resets the PIN cannot make an old sign-off look clean.
- A correct PIN issues an owner token that lives only in memory for 5 minutes. Every guarded write (sign-off, revoke, override, cutoff change, Customer View off during a session, developer toggle in production) requires the token. Three wrong attempts lock PIN entry for 30 seconds and write an audit entry.
- Roles per device: owner, ops (if Lando approves one for Suzie), crew. A role hides screens and the data layer refuses writes outside the role; the URL alone never opens a guarded screen.
- Honesty, in plain words: a client-side PIN keeps honest people honest. Anyone holding the phone with developer tools, or anyone who reads the app's code, can read the local database and flip a flag. It stops DJ from tapping "sign off" by mistake or on purpose; it does not stop a determined person. It is not real security. Real access control means accounts and a backend, which is Phase 8.

### Alternatives rejected and why

- No PIN: crew could sign themselves off and see pricing internals.
- Accounts and passwords: needs a backend, signal, and a password reset flow; Phase 8.
- Biometrics through WebAuthn: without a server to verify against it adds little over a PIN, and iOS support in a Home Screen app was not researched; `[VERIFY]` if ever revisited.
- Storing the PIN in plain text: the one thing the build prompt forbids, and it would show in a backup file.

### Consequences

- The PIN hash is device-local and is included in a backup only as a hash; a restore on a new device keeps the same PIN.
- Lando signs DJ off on the shop phone after importing DJ's progress file (D3). DJ's own phone is a study phone whose PIN Lando sets before handing it over. The handoff doc explains both.
- The blueprint, the handoff doc, and the app's own Settings screen all carry the sentence "This PIN keeps honest people honest. It is not real security."

### Sources

- The honesty requirement: `BUILD_PROMPT.md` section 4, D4
- Web Crypto on iOS: not in the verified research; `[VERIFY]` in the Phase 1 device checklist

### Status

Proposed.

## D5: Deploy on Netlify, one site, manual deploys only

### Context

Lando has Netlify credits and wants to spend as few as possible. Netlify's credit rules were checked on 2026-10-07: only a successful production deploy is metered (15 credits), Deploy Previews and branch deploys are 0, failed deploys and rollbacks are 0, CLI draft deploys are free, every site on the team shares one credit pool, and at zero every site on the team is paused. The Free plan is 300 credits a month with a hard limit and no way to buy more; Personal is $9 a month for 1,000 credits; Pro starts at $20 a month for 3,000 credits. Monthly plan credits reset at the start of each billing cycle; unused credits roll over only on Pro plans with 5,000 or more monthly credits, for one extra month; credit packs do not expire, promotional credits usually do (re-read 2026-10-08). Lando's plan and today's balance are `[VERIFY]`; 864 on Aug 23, 2026 is not a standard allotment. The VM holds no Netlify token, and a GitHub Actions secret is only visible inside a workflow run on GitHub's machines (checked 2026-10-08), so every Netlify command in this plan runs inside a GitHub workflow that Lando triggers from his phone.

### Decision

- One Netlify site for the app, created at the Phase 3 gate as a blank project with no Git link (`netlify sites:create --disable-linking`, 0 credits), by the `create-site` action of `.github/workflows/masterclass-netlify.yml`. It never auto-builds. Only the `production` action of that workflow publishes, only when Lando taps "Run workflow" himself, only at a gate, only after he reports the balance, and he reports the balance after. The lead never triggers a production publish.
- Draft deploys (the workflow's `draft` action, `netlify deploy` without `--prod`) are the free staging path on Netlify when Pages is not the right tool. Caution: if the team's default project visibility is Private (the default for teams created on or after July 28, 2026), a draft URL needs a Netlify login on the phone, and "Make public" is offered only after one successful production deploy; then the free phone path is GitHub Pages only and the draft is a lead-side smoke test read from the run log. Lando checks Team settings, General, Visitor access, Default project visibility before the Phase 3 gate (`docs/BLUEPRINT.md` 10.4). Whether draft deploys follow the preview rule is not stated on Netlify's page, `[VERIFY]`.
- `masterclass/netlify.toml` holds the publish directory, the SPA fallback, and security headers (Content-Security-Policy with no external hosts, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security). The app loads nothing from a CDN; fonts are self-hosted.
- Project visibility is set to Public after the first deploy, or Safari hits a Netlify login and Add to Home Screen breaks.
- Budget: 2 planned production deploys (the Phase 3 production check and v1.0 at Phase 7, 30 credits) plus a reserve of 3 (two hotfixes and an optional Phase 5 publish, 45 credits), 75 credits at most plus a few credits of traffic. The Phase 5 publish is optional because DJ's phone can test from Pages like every other gate, and both phones move to the Netlify URL at v1.0 with one Backup and Import. The table is in `docs/BLUEPRINT.md` section 10.7.
- A public marketing page, if ever wanted, is a separate build with zero private content. None in v1.
- The Netlify token, when needed at Phase 3, goes into a GitHub Actions secret. Always as a GitHub Actions secret. Never in chat, never in the repo. Lando picks an expiration date that reaches past Phase 7; Netlify's page only says to select an expiration date, so the lead names the date.

### Alternatives rejected and why

- A Git-linked Netlify site: every merge to main would be a 15-credit production deploy, and Deploy Previews, while free, occupy the single Free-plan build slot. Manual deploys give the same result with full control of spend.
- Vercel: the Hobby plan's fair-use terms restrict it to non-commercial use, and this app serves a business. Not needed.
- Cloudflare Workers Static Assets: free, unlimited asset requests, and fine. Rejected as primary only because it means one more account and token on Lando's phone, the Aurigen project already lives on Vercel, and a Netlify team exists (which sites it holds is `[VERIFY with Lando]`, D0). Kept as a fallback.
- GitHub Pages as the production host: free, but GitHub's rules forbid running a business on Pages, and the test build is public. Pages is the test host (D9), not the production host.
- Netlify Drop: drag and drop of a folder, no phone path, and by Netlify's definition a production deploy; cost `[VERIFY]`, Netlify's docs do not state it.

### Consequences

- Nothing on Netlify is created, linked, or deployed before Lando's go at the Phase 3 gate. Phase 0 connects nothing.
- Every production deploy is a conscious act with a balance check before and after, and it is Lando's own tap on the Actions tab.
- This repo's local-biz pipeline creates Netlify sites by API from the same credit pool, and a Netlify-hosted scraper runs from GitHub Actions. Before the first masterclass publish, Lando reads the team's project list and the balance, and the pipeline is not run on a publish day (D0).
- If the team balance ever reaches zero, every site on Lando's Netlify team pauses, not just this one. The budget table and the balance checks exist to make that impossible by accident.

### Sources

- Credits, deploy types, metered rates: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/ (read 2026-10-07)
- Plans, non-metered functionality, project limits: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ (read 2026-10-07)
- Shared pool and pause at zero: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/ (read 2026-10-07)
- Where to read the balance: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/monitor-usage-for-credit-based-plans/ (read 2026-10-07)
- Draft and production deploys from the CLI: https://www.netlify.com/knowledge-base/publish-and-update-sites-with-the-netlify-cli and https://cli.netlify.com/commands/deploy (read 2026-10-07)
- Blank site creation: https://cli.netlify.com/commands/sites (read 2026-10-07)
- Personal access tokens: https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/ (read 2026-10-07)
- Project visibility: https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/ (read 2026-10-07)
- Stop builds, locked deploys (for an Aurigen site, if one exists): https://docs.netlify.com/build/configure-builds/stop-or-activate-builds/ and https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/ (read 2026-10-07)
- Vercel fair use: https://vercel.com/docs/limits/fair-use-guidelines (read 2026-10-07)
- Cloudflare Workers static assets: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ (read 2026-10-07); Cloudflare steers new projects to Workers: https://developers.cloudflare.com/pages/ (read 2026-10-07)
- GitHub Pages policy: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits (read 2026-10-07)
- Netlify Drop: https://docs.netlify.com/deploy/create-deploys/ and https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/ (read 2026-10-07; cost `[VERIFY]`, not stated)
- Credit reset and rollover, plan credits: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/ and https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ (read 2026-10-08)
- Project visibility, Private default for teams created on or after July 28, 2026, Make public after one production deploy: https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/ (read 2026-10-08)
- CLI `--site` accepts a project name or id; `sites:create --disable-linking`: https://cli.netlify.com/commands/deploy and https://cli.netlify.com/commands/sites (read 2026-10-08)
- `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` in a CI tool; token expiration date: https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/ (read 2026-10-08)
- GitHub `workflow_dispatch` needs the file on the default branch, inputs, the Run workflow button: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows and https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow (read 2026-10-08)
- GitHub repository secrets: https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions (read 2026-10-08)
- No Netlify, Vercel, or Cloudflare variable in the VM: local probe on 2026-10-08

### Status

Proposed. Lando approves the first deploy at the Phase 3 gate with the balance in hand.

## D6: Photos on the device

### Context

Before and after photos, damage photos, test spot halves, and the signature image are part of every job and of the paint report. They must survive offline, travel in backups, and never be hosted publicly. iOS camera access from a web app was checked on 2026-10-07.

### Decision

- Capture with `<input type="file" accept="image/jpeg,image/png" capture="environment">`. The HTML Media Capture attribute is supported in Safari on iOS since version 6, opens the system camera, and needs no camera permission prompt from the page. The accept list excludes HEIC on purpose, because iOS converts HEIC to JPEG on the file input only when the accept list excludes it (WebKit reports; `[VERIFY]` on Lando's iOS version in Phase 1).
- Compress on the device on a canvas: longest edge 1600 px, JPEG quality 0.8. Expected 200 to 400 KB per photo `[estimate, measured in Phase 1]`. Store the blob in `jobPhotos` with width, height, and bytes.
- Cap per job: 24 photos in v1, with the count and total size shown on the job sheet. The cap can be raised in Settings behind the PIN.
- Included in exports (D3). The before and after slider and the paint report read from the local blobs.
- Cloud storage is Phase 8.

### Alternatives rejected and why

- Live camera (`getUserMedia`): works in Home Screen apps since iOS 13.4, but the permission is not remembered across launches, so it would prompt every cold start. Nothing in v1 needs a live viewfinder.
- browser-image-compression: last release 2023-03-06; the canvas path is 20 lines and has no dependency.
- Uncompressed photos: a 12 megapixel JPEG from the phone is several megabytes; twenty of them per job would make backups and storage pressure a real problem.
- Cloud upload in v1: needs signal, an account, and a bucket with a bill. Phase 8.

### Consequences

- Photos are only as safe as the backup habit. D3's reminder and share button cover it.
- Image quality is fine for a report and a before and after slider, not for print at poster size. That is the right trade.

### Sources

- HTML Media Capture on iOS: https://caniuse.com/html-media-capture (read 2026-10-07)
- getUserMedia in Home Screen apps and permission prompts: https://bugs.webkit.org/show_bug.cgi?id=215884 and https://bugs.webkit.org/show_bug.cgi?id=185448 (read 2026-10-07)
- HEIC to JPEG conversion depends on the accept list: https://bugs.webkit.org/show_bug.cgi?id=267277 (read 2026-10-07, likely; `[VERIFY]` on device)
- browser-image-compression stale: https://github.com/Donaldcwl/browser-image-compression (read 2026-10-07)

### Status

Proposed.

## D7: Brand in one config file

### Context

"Lando's Detailing" is a working name. The brand name, colors, phone, review link, and service area must change in one place. The home address is never committed and never public.

### Decision

- `src/app/config.ts` exports one object, validated by a zod schema in `src/schemas/`: brand name, short name, public phone (801) 680-5090, public email LandonBrewington12@gmail.com, review link (`[VERIFY]` until Lando supplies it; the stated default in `docs/BLUEPRINT.md` section 2.5 is none yet, and the review QR does not show until it is set), service area (Tooele, Stansbury, Grantsville), the accent token name, the app version string. Every screen reads the brand from here. The manifest's name fields are generated from it at build time.
- The accent color itself lives in `src/design/tokens.css` (ui-designer); config names the token, so the brand color and the design system stay in one system.
- The home address is not in the app in v1. If a future phase needs it (booking confirmations), it goes into on-device Settings behind the owner PIN, never into the repo, never into a customer-facing file, and never into a backup that leaves the device unencrypted `[design point for Phase 8]`.
- A build-time check greps the content bundle and the config for the old "MAD" name and fails if it appears outside `reference/`.

### Alternatives rejected and why

- Hard-coding the name in components: the rename would touch every screen.
- Environment variables: fine for secrets, wrong for a public value that the manifest and the printed SOPs need at build time.
- A brand file in `content/`: would make the brand a content item with a status tag, which makes no sense.

### Consequences

- Renaming the business is one file edit and one deploy.
- The config file is public in the build, so it holds only public values.

### Sources

- Knowledge base section 1 (`[HOUSE]`: name in one config value, address never in the repo)

### Status

Proposed.

## D8: No AI in v1, "Copy for Claude" instead

### Context

Lando's own call, confirmed in the build prompt: built-in AI needs signal, costs money per question, and recreates the wait the app exists to kill. The Anthropic API budget is $20 and is not used in v1.

### Decision

- No AI in v1. No API key in the client, no function on Netlify, no model on the device.
- "Copy for Claude" on every Fix It page and every Job Runner step builds one plain-text packet: vehicle, size, finish, paint readings for the panel, products and pads in use, the current stage and step, the symptom tapped, the time and the cutoff, and the question. It copies the packet to the clipboard from inside the tap (`navigator.clipboard.writeText`, `[VERIFY]` on Lando's phone in Phase 1; a selectable text box is the fallback), and offers "Share" through the share sheet as text. Lando pastes it into the Claude app.
- When the answer comes back, "Add as Field Note" captures it against the job and the Fix It entry, so the weekly review can turn it into an SOP change or a new entry and next time it is instant.
- If AI is ever added (Phase 8 or later): it runs server-side behind Lando's go, with a hard spend cap, and spend is reported against the $20 budget after every session. Netlify compute is metered at 10 credits per GB-hour and AI inference through Netlify at 180 credits per dollar, so any such function also costs Netlify credits; that goes in the Phase 8 ADR.

### Alternatives rejected and why

- An API key in the client: anyone can read it from the build and spend the budget.
- A Netlify function calling the API: needs signal in the garage, costs compute credits and API dollars per question, and brings back the wait.
- An on-device model: too large for the precache and too slow on a phone for a one-word answer.
- A chat box that looks like AI but searches locally: the search box already does that honestly.

### Consequences

- The app never waits on a network in Shop Mode.
- The loop still learns: every Claude answer that matters becomes a Field Note and then content.
- Spend in v1: $0 of the $20 budget.

### Sources

- Build prompt sections 1 and 4 (D8), knowledge base section 20 (field notes become SOP changes)
- Netlify compute and AI inference rates: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/ (read 2026-10-07)
- Clipboard API on iOS: not in the verified research; `[VERIFY]` in the Phase 1 device checklist

### Status

Proposed.

## D9: Phone testing for a phone-only owner

### Context

Rewritten for the current situation: Lando has an iPhone and no PC; the build runs in an ephemeral cloud VM with a GitHub token for this repo and no Netlify, Cloudflare, or Vercel tokens; he tests only through URLs he taps. Service workers and Add to Home Screen need HTTPS. The build prompt suggested a temporary tunnel; the VM is ephemeral, so a tunnel URL would die with each session. The research compared every free path on 2026-10-07.

### Decision

Primary path, Phases 1 to 6: GitHub Pages published by a GitHub Actions workflow from the `masterclass/` build.

- Cost: $0 and 0 Netlify credits. GitHub Pages and Actions are free on a public repo. HTTPS is automatic on github.io.
- URL: https://landocommandoz.github.io/aurigen-directory/ (one Pages site per repository; Aurigen does not use Pages, so the slot is free).
- Lando's one-time taps: Safari, the repo on github.com, Settings, Pages, Build and deployment, Source, GitHub Actions. If Settings is hidden, tap the dropdown; if the layout is cut down, aA then Request Desktop Website. Whether mobile Safari shows the Settings tab is not documented by GitHub; it is the only phone dependency of this path, so it is the first thing to try `[VERIFY]`.
- Optional one-time tap so a phase can be tested before its pull request merges: Settings, Environments, github-pages, Deployment branches and tags, Add deployment branch or tag rule, `masterclass/*`. GitHub may protect the `github-pages` environment to the default branch by default; the first run tells us. Without the rule, Pages deploys from main only, and testing happens after the merge.
- The lead's work: `.github/workflows/masterclass-pages.yml` (outside `masterclass/`, needs "repo OK") with `on.push` for `main` and `masterclass/**` filtered to `paths: ["masterclass/**"]`, plus `workflow_dispatch`; permissions `contents: read`, `pages: write`, `id-token: write`; steps checkout, setup-node reading `masterclass/.nvmrc`, `npm ci` and `npm run build` with working directory `masterclass`, `actions/configure-pages`, `actions/upload-pages-artifact` with path `masterclass/dist`, `actions/deploy-pages` in the `github-pages` environment. In Vite: `base: '/aurigen-directory/'` for Pages and `'/'` for Netlify, switched by an environment variable. Manifest `start_url` and `scope` follow the base. The service worker is registered at `${import.meta.env.BASE_URL}sw.js`. A `404.html` boots the app so a refresh on a deep link works.
- Enabling Pages by API from the VM is not possible: the proxy returns 403 for the Pages, hooks, and environments endpoints, while plain repo reads, pulls, and pushes work. So the browser tap is the route.
- The Pages URL is public. No customer data, no secrets, no PIN values in a test build. The app's content is the knowledge base, which is already public on GitHub.

Runner-up: Netlify draft deploys through `.github/workflows/masterclass-netlify.yml` (the third root file, `workflow_dispatch` only, never on push; one input, `action`: `draft`, `production`, `create-site`). Its `draft` action runs `netlify deploy --dir masterclass/dist --no-build --alias masterclass-test` on GitHub's runner and gives a root-path HTTPS URL, free by Netlify's own rule (only production deploys are metered). The VM cannot run it: it has no Netlify token, and a GitHub Actions secret is only visible inside a workflow run. Needs a personal access token Lando creates on his phone (Applications, Personal access tokens, New access token, with an expiration date that reaches past Phase 7) and saves as the repository secret `NETLIFY_AUTH_TOKEN`, plus the project id as `NETLIFY_SITE_ID` after the `create-site` run; the exact taps are in `docs/BLUEPRINT.md` 10.4. The "Run workflow" button exists only once the file is on `main`, so it lands with the Pages workflow in the Phase 1 pull request and does nothing until the secrets exist. Use it if the Pages environment rule or the Pages cache (about 10 minutes, `[VERIFY]`) gets in the way. Caution: if the team's default project visibility is Private, the draft URL needs a Netlify login on the phone and the project cannot be made public before its first production deploy; then the free phone path is Pages only and the draft is a lead-side smoke test read from the run log (D5).

Emergency path: `netlify deploy --allow-anonymous --dir masterclass/dist --no-build` gives a live URL for one hour with no account or token. The URL changes every time. Do not claim it.

Production: Netlify, D5, first at the Phase 3 gate as a production check with a test record only. Real data moves to the Netlify URL once, at v1.0 (Backup, install, Import, confirm the counters, delete the old icon). Each link has its own storage, so nothing moves by itself.

Install test, every gate: tap the URL in Safari, Share, Add to Home Screen, leave "Open as Web App" on, open from the Home Screen, Airplane Mode, reload, run the gate's checklist.

Do Netlify Deploy Previews spend credits? No. "Deploy Previews or branch deploys: 0 credits." Only "each successful production deploy consumes 15 credits." Page views on any URL are metered at 2 credits per 10,000 requests and 20 credits per GB, a fraction of a credit for one phone. Deploy Previews need a Git-linked site, which D5 avoids, so the free equivalent here is the draft deploy.

### Alternatives rejected and why

- A temporary tunnel from the VM (ngrok, cloudflared): the VM is ephemeral, the tunnel needs a binary and often a token, and the URL dies with the session. Lando would never have a stable URL between sessions.
- Localhost: not reachable from a phone.
- Netlify Deploy Previews: free, but they need the site linked to Git, which turns every merge into a 15-credit production deploy and ties up the single Free-plan build slot.
- Vercel previews: already building for this repo, but the project is on a personal scope whose plan is unknown, Hobby forbids commercial use, and previews may sit behind a Vercel login on the phone.
- Cloudflare Workers Static Assets with `wrangler deploy`: free and root-path; needs an API token Lando creates on his phone. Kept as fallback C.
- Surge: the account and token are created in a terminal, so a password would pass through chat.
- Firebase Hosting: a Google login flow and a service account for a test host. Too heavy.
- Render: a dashboard Git link that spends pipeline minutes on every push; bandwidth figure unconfirmed.
- Netlify Drop: no phone path and a production deploy by definition.

### Consequences

- Zero Netlify credits are spent before the Phase 3 gate, and nothing is connected in Phase 0.
- Two workflow files land at the repo root (outside `masterclass/`): the Pages deploy, filtered so Aurigen pushes never trigger it, and the Netlify publish button, which runs only on a tap.
- Data does not move between links by itself. The shop phone's real jobs live on the Pages install from Phase 3 to Phase 6 and move to the Netlify URL once, at v1.0, by Backup and Import; DJ's study phone does the same. The persistence suite proves that an export on one origin and an import on the other give equal counters and founder's slots.
- The app must work under two base paths. Vite's `base` and the manifest scope handle it; the build is tested under both.
- Pages is a test host only. Lando confirms he is comfortable with the test build being publicly reachable during development.
- Pages caching may delay a service worker update by minutes; the update banner's hourly check covers it.

### Sources

- Pages free on public repos: https://docs.github.com/en/get-started/learning-about-github/githubs-plans (read 2026-10-07)
- Actions free on public repos: https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions (read 2026-10-07)
- Repo is public, Pages not enabled: https://api.github.com/repos/landoCommandoz/aurigen-directory (read 2026-10-07)
- Custom workflow publishing and permissions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages (read 2026-10-07)
- The settings taps: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site (read 2026-10-07)
- deploy-pages environment and OIDC branch claim: https://github.com/actions/deploy-pages (read 2026-10-07); environments and branch rules: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments (read 2026-10-07)
- Pages limits and policy: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits (read 2026-10-07)
- Project site URL: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages (read 2026-10-07)
- HTTPS on github.io: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https (read 2026-10-07)
- Workflow location and path filters: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax (read 2026-10-07)
- Custom 404: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site (read 2026-10-07)
- Vite base for Pages and the sample workflow: https://vite.dev/guide/static-deploy.html and https://vite.dev/guide/build.html (read 2026-10-07)
- Manifest scope rules: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope (read 2026-10-07)
- Service worker scope: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register (read 2026-10-07)
- Installing on iOS from the Share menu: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable (read 2026-10-07)
- Proxy blocks the Pages API from the VM: local probe on 2026-10-07; configure-pages enablement needs a PAT: https://github.com/actions/configure-pages/blob/main/action.yml (read 2026-10-07)
- Netlify previews and branch deploys at 0 credits: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/ and https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ (read 2026-10-07)
- Netlify draft deploys free, anonymous deploys: https://www.netlify.com/knowledge-base/publish-and-update-sites-with-the-netlify-cli and https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/ (read 2026-10-07)
- Netlify Deploy Previews need a linked repo: https://docs.netlify.com/site-deploys/deploy-previews/ (read 2026-10-07)
- Vercel fair use and protection: https://vercel.com/docs/limits/fair-use-guidelines and https://vercel.com/docs/deployment-protection (read 2026-10-07)
- Cloudflare Workers and wrangler auth: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ and https://developers.cloudflare.com/workers/wrangler/system-environment-variables/ (read 2026-10-07)
- Surge: https://surge.sh/docs/cli/automation; Firebase: https://firebase.google.com/docs/hosting/usage-quotas-pricing; Render: https://render.com/docs/static-sites (read 2026-10-07)
- The Netlify workflow's sources (`workflow_dispatch`, repository secrets, CLI flags, project visibility): listed under D5

### Status

Proposed. Lando approves the two workflow files and `.vercelignore` with "repo OK" and does the one-time Pages tap when the lead sends the Phase 1 link, not before.

## Browser facts that shape the Job Runner (recorded here so D1 and the blueprint cite one place)

- Screen Wake Lock: supported in the Safari browser on iOS from 16.4, but it did not work inside Home Screen web apps until iOS 18.4 ("Fixed Wake Lock API for Home Screen Web Apps," Safari 18.4 release notes). The lock is released when the page is hidden and must be re-requested. Low Power Mode behavior is `[VERIFY]` on device. Sources: https://developer.apple.com/documentation/safari-release-notes/safari-18_4-release-notes, https://bugs.webkit.org/show_bug.cgi?id=254545, https://caniuse.com/wake-lock, https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API (read 2026-10-07). The hidden-video fallback is unreliable on current iOS and is not shipped: https://github.com/richtr/NoSleep.js and bug 254545 comments (read 2026-10-07).
- Speech synthesis: supported on iOS since version 7. iOS requires a user gesture before the first utterance; the first `speak()` inside a tap unlocks later calls for that page; a call before the unlock returns silently. Whether speech continues after the screen locks in a Home Screen app is `[VERIFY]` on device; the design assumes it stops and holds the wake lock while speaking. Voices are the preinstalled system voices and vary; never hard-code a voice name. Safari 26 and 27 fixed `cancel()` event bugs; avoid `cancel()` then `speak()` in the same tick and keep utterances referenced until done. Sources: https://caniuse.com/speech-synthesis, https://bugs.webkit.org/show_bug.cgi?id=223473 and the current WebKit source https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/speech/SpeechSynthesis.cpp, https://bugs.webkit.org/show_bug.cgi?id=290497, https://webkit.org/blog/17333/webkit-features-in-safari-26-0/, https://webkit.org/blog/18325/webkit-features-for-safari-27-0/ (read 2026-10-07). If voice must survive the lock: media element audio keeps playing in a Home Screen app since iOS 15.4, with the Media Session API: https://bugs.webkit.org/show_bug.cgi?id=198277 and https://caniuse.com/mdn-api_mediasession (read 2026-10-07).
- Web Share with files: dependable from iOS 15 (Safari 15 release notes: "sharing files from a web page to an app"). `share()` must run inside a tap and over HTTPS; `canShare({ files })` is checked first. Share-sheet targets for images changed across iOS 16 to 18; which targets appear for PNG, PDF, and JSON from the installed app is `[VERIFY]` on Lando's phone. Sources: https://developer.apple.com/tutorials/data/documentation/safari-release-notes/safari-15-release-notes.json, https://bugs.webkit.org/show_bug.cgi?id=231995, https://bugs.webkit.org/show_bug.cgi?id=261498 (read 2026-10-07).
- No install prompt API on iOS: https://caniuse.com/mdn-api_window_beforeinstallprompt_event (read 2026-10-07). Install from Safari's Share menu; Chrome, Edge, Firefox, and Orion can also offer it since iOS 16.4: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable (read 2026-10-07). The install card tells the user to use Safari.
- Web Push: Home Screen web apps only, since iOS 16.4, on a tap. Phase 8 only. Source: https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ (read 2026-10-07).
- Current iOS is 27 (Safari 27 shipped September 2026). The 26.6 and 27.0 feature posts change none of the rules above. Sources: https://webkit.org/blog/18325/webkit-features-for-safari-27-0/ and https://webkit.org/blog/18178/webkit-features-for-safari-26-6/ (read 2026-10-07).
