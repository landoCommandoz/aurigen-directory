# src/schemas: the shared contracts

Owner: architect. Every other agent reads these files and none of them redefines a shape. A change goes through the architect with the lead's approval (`docs/OWNERSHIP.md` rule 3): say what you need in your report (file, field, shape) and build against the new schema once it lands.

This README is for the content writers (content-curator, troubleshooter, learning-designer, business-customer) and for the content build (app-engineer, `scripts/content/`). If it and `docs/BLUEPRINT.md` section 7 disagree, the schema files win, then this README.

## 1. Where files go

One item per file. The file name is the item's `id` plus the extension. Paths are relative to `masterclass/`.

| Type (`type:`) | Folder | Format | Id starts with | Body of a .md file fills | Writer |
|---|---|---|---|---|---|
| `lesson` | `content/lessons/` | .md | `lesson-` | `why` (required) | content-curator |
| `sop` | `content/sops/` | .md | `sop-` | `body` (optional) | content-curator |
| `quickcard` | `content/cards/` | .yaml | `card-` | | content-curator |
| `product` | `content/products/` | .yaml | `product-` | | content-curator |
| `equipment` | `content/products/` | .yaml | `equipment-` | | content-curator |
| `glossaryterm` | `content/glossary/` | .yaml | `term-` | | content-curator |
| `fixnode` | `content/fixit/` | .md | `fix-` | `body` (optional) | troubleshooter |
| `drill` | `content/academy/drills/` | .md | `drill-` | `body` (optional) | learning-designer |
| `quizquestion` | `content/academy/quizzes/` | .yaml | `quiz-` | | learning-designer |
| `flashcard` | `content/academy/flashcards/` | .yaml | `flash-` | | learning-designer |
| `priceitem` | `content/business/` | .yaml | `price-` | | business-customer |
| `policy` | `content/business/` | .md | `policy-` | `text` (required) | business-customer |
| `script` | `content/customer/` | .md | `script-` | `text` (required) | business-customer |

Three more files that are not content items:

| File | Schema | Writer |
|---|---|---|
| `content/academy/signoff/<skillId>.yaml` | `SignOffCriteria` | learning-designer |
| `content/search/synonyms.yaml` | `SynonymFile` | troubleshooter |
| `tests/search-cases.yaml` | `SearchCaseFile` | troubleshooter |

## 2. Ids

- Kebab-case: lowercase letters and digits, single hyphens, 3 to 80 characters. `fix-01`, not `FIX-01` or `fix_01`.
- Start with the type's prefix from the table. Skill ids start with `skill-`. Quiz ids start with `quiz-`.
- Stable: once an id has shipped, never rename it. Other files, crew records on the phone, and backups point at it. To replace an item, write a new item with a new id and `supersedes: <old id>`, and set the old one to `status: superseded` (section 5).
- Patterns to follow so ids sort and read well:
  - Fix It: `fix-01` to `fix-33` match knowledge base 21 (FIX-01 is `fix-01`). New entries continue at `fix-34`.
  - Lessons: `lesson-l<level>-<nn>-<slug>`, for example `lesson-l4-01-machine-control`.
  - Quiz questions: the quiz id, a hyphen, a two-digit number. The questions of `quiz-l4-machine` are `quiz-l4-machine-01`, `quiz-l4-machine-02`. The build refuses a question whose id does not start with its `quizId`.
  - Skills: `skill-l<level>-<slug>`, for example `skill-l4-machine-polishing`.
  - Prices: `price-<car|bike>-<service>-<size>`, for example `price-car-full-detail-polish-sedan`; add-ons and fees `price-addon-pet-hair`, `price-fee-mobile`.
  - Everything else: `<prefix>-<slug>`, for example `card-bucket-mix`, `product-meguiars-m210`, `equipment-bauer-56367`, `term-dual-action`, `policy-01-deposit`, `script-walkaround-polish`.

## 3. File formats

YAML file (`content/cards/card-bucket-mix.yaml`):

```yaml
id: card-bucket-mix
type: quickcard
title: Pre-polish bucket mix
audience: [owner, crew]
visibility: internal
status: house
kbRef: "4"
kind: mix
rows:
  - label: Water
    value: 4 gal
  - label: CG Citrus Wash & Gloss
    value: "4 oz (1 oz per gal, strip strength because polishing follows)"
related: [card-clay-tub]
```

Markdown file: front matter between two `---` lines, then the body. The body fills the field named in section 1. Never set that field in the front matter too; the build refuses it.

```markdown
---
id: fix-01
type: fixnode
title: Polisher jerks, walks, or hops side to side
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
group: machine
sayIt: [jerking, hopping, walking, bouncing, pulling, fighting me, wants to go left and right]
stopIf:
  - Grinding noise, burning smell, visible plate wobble, or abnormal vibration
checks:
  - "Unplugged: center bolt tight"
  - Pad centered on the plate
causes:
  - Pad tilted onto an edge
  - Pushing instead of guiding (grip too tight, pressure over about 10 lb)
steps:
  - Re-center the pad
  - Spread at speed 1 to 2, work at 4
notes:
  - text: A 20 mm long-throw moves more than a short-throw; some float is normal
    status: verify
related: [fix-02, fix-03, fix-23]
---
Optional extra notes in Markdown.
```

YAML traps the build will catch, and how to avoid them:

- Quote `kbRef` always: `kbRef: "7.3"`. Unquoted, `8.10` becomes the number 8.1.
- Quote any text that contains `: ` (colon and space), starts with `[`, `{`, `*`, `&`, `!`, `%`, `@`, or a backtick, or contains ` #`. Example: `- "Unplugged: center bolt tight"`.
- Dates are `YYYY-MM-DD`. They stay text; no quotes needed.
- Lists can be inline `[a, b]` or one `- item` per line. Inside `[ ]` or `{ }` a comma ends the item, so quote any text that contains a comma there, or use one `- item` per line.

## 4. Fields every item carries

| Field | Required | Value |
|---|---|---|
| `id` | yes | Section 2 |
| `type` | yes | One of the 13 types in section 1 |
| `title` | yes | 1 to 120 characters |
| `audience` | yes | One or more of `owner`, `ops`, `crew`, `customer`. Filters the Academy and Business rooms by role. Customer View ignores it |
| `visibility` | yes | `internal` or `customer-safe` (section 5) |
| `status` | yes | `house`, `sourced`, `verify`, `superseded` (section 5) |
| `sources` | no, default `[]` | `{ label, url?, date, note?, confirmedOn?, confirmedBy? }`. `label` is who or what ("HF product page", "Lando", "Knowledge base 8.3"). `date` is when it was checked. `confirmedOn` and `confirmedBy: fact-checker` are set together, only from a fact-checker finding |
| `version` | no, default `1` | Raise it when the meaning changes; crew then see "this changed, re-read" |
| `supersedes` | no | The id this item replaces |
| `related` | no, default `[]` | Ids of other items, any type. Every one must exist and must not be superseded |
| `tags`, `synonyms` | no, default `[]` | Search words. `synonyms` is what a person types or says |
| `kbRef` | no | Knowledge base section, quoted: `"7.3"` |

A line (steps, checks, causes, mistakes, notes, instructions) is either plain text or `{ text, status }` when that one line carries its own status. Rows (Quick Card rows, lesson numbers, equipment specs) are `{ label, value, status?, kbRef? }`. Use a line status instead of copying a bracket tag into the text: never write `[VERIFY]` or `[SUPERSEDED]` inside text.

The per-type fields are in `content-shop.ts`, `content-academy.ts`, and `content-business.ts`, each with a comment. The ones that trip people up:

- `fixnode`: `sayIt` (at least one), `causes` and `steps` (at least one each), `group` (one of `FIX_GROUPS`). Optional `lessonId` (the one main lesson), `productIds`, `equipmentIds`. Quick Cards and any further lessons go in `related`.
- `sop`: `stage` is one of `STAGE_IDS` in `common.ts`. Machine polishing is `polish`; bikes are hand polished, so a bike SOP uses `hand-polish`, and a `hand-polish` SOP must set `vehicleBranch: bike` (the build refuses it on `any` or `tesla`; the test spot and Level 4 guards check `polish` only, D11 amendment 2026-10-11). A step `timer` of kind `cure` is the tire shine set time only, never a ceramic wax haze timer (knowledge base 9.1 and 23). A step's `notes` (added 2026-10-11) hold rows under the step that are not actions, each with its own optional status; one action per step, so a maker's line or a pending decision is a note, never a step of its own.
- `sop` branches (2026-10-11, the architect's default; the Phase 3 run plan confirms it): one SOP per stage per branch. A branch SOP is complete, never a list of differences: it repeats every step of the `any` SOP it replaces, with the branch's changes in place. A Tesla job uses the `tesla` SOP for a stage when one exists and the `any` SOP otherwise. A bike job never falls back to an `any` SOP (knowledge base 12.1: no tire shine, hose on low, hand polish), so write a `bike` SOP for every stage a bike runs. Stage order on a job is not set by any field yet; do not invent one.
- `lesson`: `level` 0 to 8, `order` from 1 (no two lessons share a level and order), `steps` at least one. `skillId` and nothing more about sign-off; Levels 5 to 8 set `outline: true` (an outline still needs a short `why` and at least one step: list the topics as steps).
- `drill`: `repsPerSession` is reps in one logged session. `passMark` (added 2026-10-11) is what one session must show to pass, in the `logField` unit where there is one, with numbers exactly as the knowledge base writes them and never a tolerance it does not give; each line may carry its own status. The sign-off drill minimum is not here, and it counts logged sessions, passed or not (v1 records no pass per session).
- `quizquestion`: `choices` 2 to 6, `correctIndex` counts from 0.
- `priceitem`: `amount` in dollars exactly as knowledge base 15 and 12.2 write them. Required unless `unit: quote`, and forbidden with it. A quote item may set `quoteText` ("Quoted on inspection"); otherwise it renders "Quoted after the test spot". It never renders a number. `size` sedan or suv needs `vehicleType: car`; standard or bagger needs `vehicleType: bike`. `touchesPaint: true` only on a service package or plan with an exterior paint stage (Wash & Ceramic Wax, Full Detail, Full Detail + One-Step Polish); never on an add-on. `founderRate: { amount, slots }` on the one-step polish packages. `unlockAtCars` hides an item until that many cars (two-step: 25). `mobileUnlockAtCars` keeps an item drop-off only until that many cars (polish: 25).
- `script`: `when` is `booking`, `walkaround`, `pickup`, `damage`, `paint-report`, or `aftercare`.
- Sign-off criteria file: `skillId`, `title`, `lessonId`, `quizId`, `quizPassScore` (percent), `drillMinimum` (logged sessions of the lesson's drills), `prerequisites` (skill ids), `gates`. Exactly one file, the Level 4 machine polishing skill, sets `gates: [polish-stage]` (D11). The file name is the `skillId`. Added 2026-10-11: `ownerChecks`, the lines Lando watches the crew member do before he enters his PIN (one observable action per line, each with its own optional status), and `status`, `house` or `verify` (the default). The knowledge base sets no pass mark or drill minimum, so every new file is `verify` until Lando accepts its numbers; the numbers apply either way, so the polish gate never switches off.

Two patterns every writer uses (2026-10-11):

- A house line with a maker's line beside it and a decision Lando has not made (Teslas, FC-16; polisher speed and pressure, FC-22 and FC-23). Three lines or rows, in this order: the house line with `status: house`; the maker's line with `status: sourced`, its URL in the item's `sources` with a `note` naming the finding ("Fact-checker FC-16"); then "Lando decides how this applies (pending)" with `status: verify`. A line has no URL of its own, so the sentence names its source ("The 56367 manual says"). The model is `content/cards/card-machine-settings.yaml`. In a FixNode the three go together in one list, in an SOP they are the step plus its `notes`, in a lesson they are `numbers` rows or lines, in a drill they are `passMark` lines.
- Tesla only or bike only. FixNode: `group: tesla` or `group: bike`. SOP: `vehicleBranch`. Every other type: the tag `tesla` or `bike`, exactly that, lowercase (the seed cards already use it). A line inside a general item that applies to one vehicle starts with "On a Tesla" or "On a bike".

## 5. Status and visibility

Status mirrors the knowledge base tag on the fact:

| Knowledge base tag | `status` |
|---|---|
| `[HOUSE]`, `[HOUSE from booklet]` | `house` |
| `[HOUSE proposal]` | `house` only if `docs/BLUEPRINT.md` section 12 records Lando accepting it; otherwise `verify` |
| `[SOURCED yyyy-mm-dd]` | `sourced`, with a source whose `date` is that date |
| `[VERIFY ...]` | `verify` |
| `[SUPERSEDED]` | `superseded` |
| Two tags on one fact (`[SOURCED 2026-10-06]` `[VERIFY reconfirm label]`) | The stricter wins: superseded, then verify, then sourced, then house |

Never write content from knowledge base 15.5. It was removed on 2026-10-10 and is never cited or recreated.

What each status does:

- `house` and `sourced` render internally as written.
- `verify` renders internally with an "unverified" badge, and never in Customer View. A single line with `status: verify` gets the badge on that line only.
- `superseded` never renders anywhere. The file stays so the history is visible. A superseded item must be named in some other item's `supersedes`, and nothing else may point at it.

`visibility: customer-safe` means the item may appear in Customer View. The build allows it only when all of these hold (`assertCustomerRenderable`):

1. `status` is `house`, or `sourced` with at least one source carrying `confirmedOn` from the fact-checker.
2. No text anywhere in the item contains `[VERIFY` or `[SUPERSEDED` (any case).
3. No line, row, step, number, spec, or dilution has its own status `verify` or `superseded`.
4. A line with its own status `sourced` needs the item to carry a confirmed source.

Everything else is `internal`. Always internal: Fix It entries, floor price math (knowledge base 15.3), founder's-rate logic, crew and training notes, sign-off criteria, anything about another customer.

## 6. How the build fails

The content build (`npm run content`, also inside `npm run build` and `npm run check`) stops with the file, the field, and the message, and writes nothing to `src/generated/`, when any of these happens:

| Problem | Example message |
|---|---|
| A required field is missing or has the wrong shape | `content/fixit/fix-07.md: causes: Too small: expected array to have >=1 items` |
| An unknown field | `content/cards/card-ipa.yaml: Unrecognized key: "colour"` |
| A wrong folder, extension, or file name | the path does not equal `expectedContentPath(type, id)` |
| A Markdown file that sets its body field in the front matter | `content/lessons/lesson-l0-01-ground-rules.md: why: put this text in the body` |
| Two files with one id | `Duplicate id: another file already uses it` |
| A `related`, `supersedes`, `lessonId`, `quizId`, `drillIds`, `productIds`, `equipmentIds`, `quickCardId`, or `skillId` that points to nothing | `related[1]: Points to "fix-99", which does not exist` |
| A reference to a superseded item | `Points to "card-ipa-old", which is superseded; point to its replacement` |
| A superseded item nothing replaces | `Superseded, but no item names it in supersedes` |
| A `verify` or `superseded` item marked customer-safe, or any rule in section 5 broken | `status is verify: [VERIFY] items never show to a customer` |
| A price item with `unit: quote` and an amount, or another unit and no amount | `A quote item has no amount. Remove it.` |
| A lesson with a `skillId` and no criteria file, a criteria file no lesson names, or one whose `lessonId` or `quizId` does not exist | `No content/academy/signoff/skill-l4-machine-polishing.yaml exists for this skill` |
| A prerequisite loop, or more than one polish-stage gate | `Prerequisite loop: skill-a -> skill-b -> skill-a` |
| A search case whose expected id does not exist, or whose expected top result is not returned | `cases[3] "jerking": expects "fix-01", which does not exist` |

If the item you want to point at does not exist yet, leave the reference out and list it in your report. Run `npm run content` before you hand in.

## 7. For the content build (app-engineer): the exact exports

Import from `src/schemas` (the index). In this order:

1. Walk `content/` except `content/search/` and `content/academy/signoff/`. Accept `.md` and `.yaml` only.
2. YAML: parse with the `yaml` package. Markdown: the front matter is the YAML between a first line `---` and the next line `---`; the rest, trimmed, goes into `MARKDOWN_BODY_FIELD[type]`. Refuse a front matter that already sets that field.
3. Compare the file's path with `expectedContentPath(type, id)` (built from `CONTENT_DIR_BY_TYPE` and `CONTENT_FORMAT_BY_TYPE`).
4. Parse with `ContentItem` (or `SCHEMA_BY_TYPE[type]` for messages scoped to one type). Report every issue, not the first.
5. Parse each `content/academy/signoff/*.yaml` with `SignOffCriteria`; the file name must equal its `skillId`.
6. Run `checkContentSet(items, signOffs)`. It returns `ContentProblem[]` (`{ id, field, message }`); map each `id` to its file. It already applies `customerRenderProblems` to every customer-safe item; `assertCustomerRenderable(item)` throws the same reasons for one item.
7. Parse `content/search/synonyms.yaml` with `SynonymFile` (a missing file is an empty map until Phase 2) and `tests/search-cases.yaml` with `SearchCaseFile`. Run `searchCaseReferenceProblems(cases, ids)`, then every query; the top result must be one of `expect`. From Phase 2 on, fewer than `MIN_SEARCH_CASES` cases fails.
8. Leave superseded items out of the bundle and the search index (`isRenderable`). Write `src/generated/` only when everything passed; exit 1 otherwise.

For the app: `isRenderable`, `needsUnverifiedBadge`, `isCustomerRenderable` (the `customerSafe(items)` filter in `src/core/customerView.tsx` uses it), `visibleLines`, `lineText`, `lineStatus`, `priceDisplayText`.

## 8. Search files (troubleshooter)

`content/search/synonyms.yaml`:

```yaml
version: 1
groups:
  - words: [jerking, hopping, walking, bouncing]
  - words: [ipa, alcohol, panel wipe]
    note: knowledge base 4
```

`tests/search-cases.yaml`: the top result must be one of `expect`. `kb` keeps the knowledge base 24 wording.

```yaml
version: 1
cases:
  - { query: jerking, expect: [fix-01], kb: FIX-01 }
  - { query: wet the pad, expect: [card-pad-priming, fix-04], kb: 8.2 / FIX-04 }
```

## 9. Runtime records and files (app-engineer, business-customer, qa-adversary)

`runtime.ts` re-exports the device records: `TABLE_NAMES` and `TABLE_SCHEMAS` (one schema per Dexie table), `Job`, `DraftJob`, `AnyJob`, `jobTransitions`, `nextJobState`, `POLISH_STAGE_ID`, `Quote`, `StageTiming`, `PanelReading` with `Micron`, `bandFor`, `panelFlags`, `parseGaugeInput`, `JobPhoto`, `Issue`, `Debrief`, `FieldNote`, `CrewMember`, `SkillState` with `SkillStateEnum` and `skillTransitions`, `SignOff`, `QuizAttempt`, `DrillLog`, `FlashcardState`, `Settings` with `defaultSettings`, `OwnerPin`, `PinEntry`, `AuditLog`, and the device role rules `canBecomeShop`, `canBecomeStudy`, `canHandOver`, `settingsOnHandOver`, `START_FRESH_WARNING`, `START_FRESH_CLEARS`, `settingsOnPinCreated`, `setupStep`, `backupReminderDue`, `ROLE_CAN`. `DeviceRole`, `OwnerPin`, and `PinEntry` are frozen (`frozen-shapes.test.ts`). `backup.ts` holds `BackupFile`, `BackupFileSettingsUnreadable`, `SettingsUnreadable`, `parseBackupFile` (readable settings only), `parseAnyBackupFile` (both kinds, for Restore), `CrewProgressFile`, `parseCrewProgressFile`, and `checksumInput`. `backup-recovery.ts` holds the DEF-13 rules: `backupSettingsState`, `settingsUnreadableSection`, `restorePlan`, `settingsAfterRestore`, `signOffsAfterRestore`, `SETTINGS_GUARD_FIELDS`. `config.ts` holds `AppConfigSchema` and `parseAppConfig`. The rules behind them are `docs/BLUEPRINT.md` sections 3 and 6 and `docs/DECISIONS.md` D12.
