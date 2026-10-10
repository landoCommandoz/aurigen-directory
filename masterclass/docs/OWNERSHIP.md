# Ownership: who writes what

Phase 0, step 5. Written 2026-10-08 by the architect role, revised the same day after review. One writer per file across agents, always. This file is the map.

Lando: nothing in here needs your answer.

## The rules

1. One writer per file. The owner below is the only agent that writes that file or directory. Every other agent reads it.
2. If two agents need one file, neither edits it. The lead edits it, after both have said what they need.
3. Shared contracts (the schemas in `src/schemas/`, the content model, the state tables, the config shape) change only through the architect, with the lead's approval. An agent that needs a contract change files the need in its report; the architect changes the schema; the lead approves; then the agent builds against it.
4. Nothing outside `masterclass/` is written by any agent. The three exceptions (`.vercelignore`, `.github/workflows/masterclass-pages.yml`, and `.github/workflows/masterclass-netlify.yml` at the repo root; a fourth, `vercel.json`, only if `.vercelignore` does not hold on the Aurigen Vercel site) are written by the lead only, after Lando says "repo OK." `.claude/agents/` at the repo root is never touched.
5. `knowledge/KNOWLEDGE_BASE.md` is edited only by the lead, only with Lando, and only to record a decision Lando made or a fact the fact-checker confirmed. Agents that disagree with it write to `knowledge/verification-log.md` (fact-checker) or their report, never to the knowledge base.
6. `reference/` is frozen. Nobody writes there.
7. Generated output (`src/generated/`, `dist/`, `.vitest/`, test reports) is never committed.
8. The lead runs `npm run check` after every wave, updates `docs/STATUS.md`, and commits. Agents do not commit.

## Shared documents

| File | Owner | Who reads it |
|---|---|---|
| `docs/BLUEPRINT.md` | architect | Everyone, before any phase |
| `docs/DECISIONS.md` | architect | Everyone; the lead cites the ADR number in task briefs |
| `docs/OWNERSHIP.md` | architect | Everyone, before writing any file |
| `docs/DESIGN-DIRECTIONS.md` | ui-designer | Lando picks; app-engineer and business-customer build to the pick |
| `docs/STATUS.md` | lead | Every session start |
| `docs/HOW-TO-ADD.md` | lead | Lando, after v1 |
| `docs/HANDOFF.md` | lead | Lando, DJ, Suzie |
| `docs/QA-REPORT.md` | qa-adversary | The lead and every owner with a defect to fix |
| `knowledge/KNOWLEDGE_BASE.md` | lead, with Lando only | Everyone; it wins every conflict except the product label |
| `knowledge/verification-log.md` | fact-checker | content-curator, troubleshooter, business-customer, the lead |
| `CLAUDE.md`, `BUILD_PROMPT.md`, `START_HERE.md` | lead | Everyone |

## The full planned tree

Paths are relative to `masterclass/`. The owner is the only writer. "lead approves" means the owner proposes the change in its report and the lead applies or approves it before it lands.

```
masterclass/
  CLAUDE.md                          lead
  BUILD_PROMPT.md                    lead
  START_HERE.md                      lead
  .gitignore                         lead            (must contain !package-lock.json; the root .gitignore ignores it)
  .nvmrc                             app-engineer    (lead approves)
  package.json                       app-engineer    (lead approves every dependency change)
  package-lock.json                  app-engineer    (committed; npm ci in CI)
  vite.config.ts                     app-engineer    (lead approves; base path, PWA, precache globs)
  tsconfig.json                      app-engineer    (lead approves)
  netlify.toml                       app-engineer    (lead approves; publish dir, SPA fallback, security headers)
  index.html                         app-engineer    (meta tags, apple-touch-icon, the boot try/catch)
  playwright.config.ts               qa-adversary
  vitest.config.ts                   app-engineer

  docs/
    BLUEPRINT.md                     architect
    DECISIONS.md                     architect
    OWNERSHIP.md                     architect
    DESIGN-DIRECTIONS.md             ui-designer
    STATUS.md                        lead
    HOW-TO-ADD.md                    lead
    HANDOFF.md                       lead
    QA-REPORT.md                     qa-adversary

  knowledge/
    KNOWLEDGE_BASE.md                lead, with Lando only
    verification-log.md              fact-checker

  reference/                         frozen (lead; nobody writes)
    README.md
    booklet-text.md
    panel-map-v3.html
    tonight-model-y-job-sheet.html

  content/
    lessons/                         content-curator   (Lesson files, Levels 0 to 4 full, 5 to 8 outlines)
    sops/                            content-curator   (SOP files per stage; Tesla and bike branches)
    cards/                           content-curator   (QuickCard files)
    products/                        content-curator   (Product and Equipment files)
    glossary/                        content-curator   (GlossaryTerm files)
    fixit/                           troubleshooter    (FixNode files, FIX-01 to FIX-33 and additions)
    search/
      synonyms.yaml                  troubleshooter    (the curated synonym map, applied at index time)
    academy/
      drills/                        learning-designer
      quizzes/                       learning-designer (QuizQuestion files)
      flashcards/                    learning-designer
      signoff/                       learning-designer (one <skillId>.yaml per skill: lessonId, quizId, quizPassScore, drillMinimum, prerequisites; the only place these live; a Lesson carries skillId only; the build checks that every lesson with a skillId has a file and every file matches a lesson)
    business/                        business-customer (PriceItem, Policy files; founder's rate; unlocks; the two-step line with unit quote and no amount)
    customer/                        business-customer (Script files, aftercare card text, paint report wording)

  public/
    fonts/                           ui-designer       (woff2 built from the Google Fonts TTFs, latin subset, tnum kept)
    icons/                           app-engineer      (apple-touch-icon 180 px, maskable 192 px and 512 px; ui-designer supplies the artwork)
    404.html                         app-engineer      (boots the app on GitHub Pages deep links)

  scripts/
    content/                         app-engineer      (build-content: validate with src/schemas, write src/generated/, build the search index, run the search cases)

  src/
    app/                             app-engineer      (shell, routes, the three density shells, mode switches, config.ts, install card, update banner, offline indicator)
    core/                            app-engineer      (db.ts Dexie tables; state machines; search engine; speech; wake lock; pin; export and import; clipboard; counters; customerView.tsx: the <Internal> component, useCustomerView(), customerSafe(items), the one mechanism behind Customer View)
    schemas/                         architect         (zod: content types, runtime records, config, backup file; the only shared contract)
    generated/                       app-engineer      (build output: content bundle and search index; gitignored)
    design/                          ui-designer       (tokens.css, fonts.css, motion.css, print.css, the signature moment)
    components/
      ui/                            ui-designer       (base components: Button, Tile, Row, Drawer, StopBand, Timer, PanelMap, Toast, PinPad, SegmentedControl)
    features/
      fixit/                         app-engineer      (symptom grid, fix page, issue tag, Copy for Claude)
      search/                        app-engineer      (search box, results, dictation hint)
      jobrunner/                     app-engineer      (job picker, setup checklist, the run, cutoff, test spot gate, gauge entry, hands-busy mode)
      cards/                         app-engineer      (Quick Cards)
      academy/                       app-engineer      (lesson reader, drills log, quizzes, flashcards, crew profiles, sign-off screen, printable SOP view)
      settings/                      app-engineer      (owner PIN, roles, read-aloud, wake lock, backup and restore, developer panel, device preview)
      business/                      business-customer (pricing calculator, policies script, floor price calculator, job log, dashboard and debrief UI in Phase 6)
      customer/                      business-customer (Customer View switch and filter, check-in, paint report, menu, before and after slider, aftercare share, review QR)

  tests/
    search-cases.yaml                troubleshooter    (the 43 cases from knowledge base section 24, expanded to 45 or more)
    unit/                            qa-adversary      (state tables, pricing combos, bands, counters, schema validation)
    e2e/                             qa-adversary      (Playwright at 375, 430, 768, 1024 and 1440 px; offline job; install flow; both base paths)
    privacy/                         qa-adversary      (Customer View leak test over every screen; the enforcement of the <Internal> rule)
    persistence/                     qa-adversary      (refresh, kill, lock mid-job; timers correct; a moved clock; export on one origin and import on another; crew progress import)
    adversarial/                     qa-adversary      (impatient, edge-case, confused, malicious user runs)
    fixtures/                        qa-adversary      (seeded logs: 24 and 25 cars, 4 and 5 founder jobs, a 9999 reading)
```

Outside `masterclass/`, at the repo root, lead only, after "repo OK":

```
.vercelignore                        lead              (two lines: a comment and "masterclass"; added in the Phase 0 pull request, checked on the production URL after the merge on 2026-10-10 (branch previews sit behind a Vercel login))
.github/workflows/masterclass-pages.yml   lead         (the GitHub Pages deploy, filtered to masterclass/** paths; Phase 1 pull request)
.github/workflows/masterclass-netlify.yml lead         (workflow_dispatch only; actions draft, production, create-site; reads the NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID secrets; Phase 1 pull request)
vercel.json                          lead              (only if .vercelignore does not hold on a Git deploy: one route, /masterclass/(.*) to status 404)
```

Never touched by anyone in this build: `.claude/agents/`, the root `CLAUDE.md`, the root `netlify.toml` (unless Lando confirms an Aurigen Netlify site exists and asks for the ignore command), every Aurigen file.

## Where the lines are thin (read before dispatching in parallel)

- `src/features/academy/` (app-engineer) renders content from `content/academy/` (learning-designer). The schema in `src/schemas/` is the contract between them. Neither edits the other's directory.
- `src/features/customer/` (business-customer) uses base components from `src/components/ui/` (ui-designer) and tokens from `src/design/`. If a component is missing, business-customer asks in its report; ui-designer adds it; the lead sequences the two.
- `src/features/jobrunner/` (app-engineer) shows prices from `src/features/business/` (business-customer) through one exported function, `quoteFor(job)`. The function's shape is in `src/schemas/` (the Quote record). app-engineer never computes a price; business-customer never renders a Job Runner screen.
- The developer panel lives in `src/features/settings/` (app-engineer) and reads state from every feature through one hook each feature exports. No feature writes into the panel.
- `tests/search-cases.yaml` belongs to the troubleshooter and runs inside the content build (app-engineer's script) and inside the QA suite (qa-adversary). Both read it; only the troubleshooter writes it.
- The fact-checker changes no content file. It writes findings to `knowledge/verification-log.md`, the owning agent applies them, and the lead records any knowledge base change with Lando.
- `public/icons/` is app-engineer's directory, but the artwork comes from ui-designer as files in `src/design/` that app-engineer copies at build time. No shared file.
- Customer View has one mechanism and one writer. `src/core/customerView.tsx` (app-engineer) holds the `<Internal>` component, the `useCustomerView()` hook, and the `customerSafe(items)` filter. Every feature, whoever owns it (app-engineer's jobrunner, academy, settings; business-customer's customer and business; ui-designer's components), wraps its internal elements in `<Internal>` and never writes its own version. business-customer owns the switch screen and the customer session rule in `src/features/customer/`. The privacy test in `tests/privacy/` (qa-adversary) is the enforcement: it fails on any internal element found on the page with Customer View on.
- Sign-off criteria have one writer. The pass mark, drill minimum, and prerequisites live only in `content/academy/signoff/<skillId>.yaml` (learning-designer). A Lesson (content-curator) names its `skillId` and nothing more. The build refuses a lesson with a `skillId` and no file, and a file with no lesson.
