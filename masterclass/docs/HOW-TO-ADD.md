# How to add content

For Lando. How to add a Quick Card, a product, a tool, or a glossary word now, and a Fix It entry, a lesson, or a price change once those exist. Phase 1 version, 2026-10-11. Every template below passed the real content check on that date.

## The one rule

When you are unsure, mark it `[VERIFY]`. In a file that means `status: verify` on the item, or on the one line you are unsure of. Never guess a dilution, a price, a tool spec, or a legal fact. A `verify` fact shows inside the app with an "unverified" badge, never to a customer, and the fact-checker picks it up. Tell the lead what you were unsure of. And never write anything from knowledge base section 15.5; it was removed on 2026-10-10.

## Two ways to add something

1. The easy way, from the phone or the PC: in a Claude Code session on this repo, say "Add a Quick Card for (what): (your facts). Follow docs/HOW-TO-ADD.md." Claude writes the file, runs the check, and tells you what it marked `verify`.
2. By hand on the PC: copy a template below into a new file in the right folder, fill it in, and run the check.
3. Either way, nothing reaches the phone until Claude Code commits and pushes the change. The Pages link rebuilds a few minutes later, and the app shows "Update ready" the next time it checks (when you open it, or within the hour). Tap Update now when you are not mid-job.

## Where each file goes

| You want to add | Folder (inside `masterclass/`) | File name | Exists now? |
|---|---|---|---|
| Quick Card | `content/cards/` | `card-<name>.yaml` | Yes, 14 cards |
| Product (a bottle, a can, a tub) | `content/products/` | `product-<name>.yaml` | Yes, 21 |
| Tool or machine | `content/products/` | `equipment-<name>.yaml` | Yes, 22 |
| Glossary word | `content/glossary/` | `term-<word>.yaml` | Yes, 20 |
| Fix It entry | `content/fixit/` | `fix-34.md`, then the next number | Phase 2 |
| Lesson | `content/lessons/` | `lesson-l<level>-<nn>-<name>.md` | Phase 2 (the reader is Phase 5) |
| Price | `content/business/` | `price-car-<service>-<size>.yaml` or `price-bike-...` | Phase 4 |

Names use lowercase letters, digits, and single hyphens. The file name is the `id` inside it plus `.yaml` or `.md`. Once an item has shipped, never rename its id: the phone, the backups, and other files point at it. The other types (SOPs, drills, quiz questions, flashcards, policies, customer scripts) are written by the build team in Phases 2 and 4; ask Claude for one, and `src/schemas/README.md` has every field.

## Status and visibility, in two sentences

`status` says how sure the fact is: `house` is your own rule, `sourced` was checked against a label or a page on a date you write under `sources`, `verify` is not confirmed yet (badged inside the app, never shown to a customer), and `superseded` was replaced and never shows anywhere. `visibility` says who may see it: `internal` (you and the crew; use it whenever in doubt) or `customer-safe` (may show in Customer View, and the check refuses it unless the status is `house`, or `sourced` and confirmed by the fact-checker).

## Mistakes the check catches

- Quote the knowledge base section: `kbRef: "7.3"`. Without quotes, 8.10 turns into 8.1.
- Quote any text with a colon and a space in it: `- "Unplugged: center bolt tight"`.
- Dates are written `2026-10-11`. Every id in `related` must exist.
- Never type `[VERIFY]` inside the text. Put `status: verify` on that line, as the templates do.

## Run the content check on the PC

In PowerShell or the VS Code terminal, with Node 22 installed (`npm ci` only the first time, or after `package-lock.json` changes):

```
cd C:\path\to\aurigen-directory\masterclass
npm ci
npm run content
```

A pass prints `content build: 78 items (quickcard 15, ...)` and a `wrote:` line. A problem prints `content build failed`, one line per problem with the file, the field, and what is wrong, then `Nothing was written to src/generated/.` A real example from 2026-10-11, a `verify` item marked `customer-safe`: `content/glossary/term-new-word.yaml: visibility: status is verify: [VERIFY] items never show to a customer`. An unquoted colon shows as `YAML: Nested mappings are not allowed in compact mappings`. Fix the line it names and run it again. `npm run check` runs this plus the type check, lint, and tests; the lead runs it before every commit.

## Templates you can use now

Copy the whole block into a new file. Text after `#` is a note; it can stay or go. Change `verify` to `house` or `sourced` only for facts you are sure of. To link other items, add a line such as `related: [card-bucket-mix, term-strip-wash]`.

Quick Card, `content/cards/card-new-card.yaml`:

```yaml
id: card-new-card              # the file name is this id plus .yaml
type: quickcard
title: Short name you would search for
kind: list                     # mix, settings, table, list, or stop
audience: [owner, crew]
visibility: internal
status: verify                 # change to house or sourced once you are sure
synonyms: [words you would type or say]
sources:
  - label: Who or what you checked (a label, a web page, Lando)
    date: 2026-10-11           # the day you checked it
rows:
  - label: First line
    value: What it says
  - label: A number you have not confirmed
    value: Write it as you have it
    status: verify
```

Product, `content/products/product-new-product.yaml`:

```yaml
id: product-new-product
type: product
title: Brand and product name, size
brand: Brand
audience: [owner, crew]
visibility: internal
status: verify
synonyms: [what you call it out loud]
sources:
  - label: Product label
    date: 2026-10-11
jobs:
  - What you use it for
dilutions:                     # copy from the label; leave the list out if there is none
  - use: What for, per the label
    ratio: Exactly as the label writes it
    status: verify
neverFor:
  - Where it must never go
neverOnPaint: false            # true puts it on the never-on-paint list
```

Tool or machine, `content/products/equipment-new-tool.yaml`:

```yaml
id: equipment-new-tool
type: equipment
title: Tool name
audience: [owner, crew]
visibility: internal
status: verify
synonyms: [what you call it]
specs:                         # every spec row needs its own status
  - label: Spec name
    value: As printed on the box or in the manual
    status: verify
checks:
  - Something to check before you use it
neverOnPaint: false
```

Glossary word, `content/glossary/term-new-word.yaml`:

```yaml
id: term-new-word
type: glossaryterm
title: The word, as a heading
term: The word
definition: One or two plain sentences.
alsoCalled: [another name for it]
audience: [owner, ops, crew]
visibility: internal
status: verify
synonyms: [what someone would type]
```

## Templates for later phases (they match the schema; ask the lead before adding one early)

Fix It entry (Phase 2), `content/fixit/fix-34.md`. Always internal. Optional lists: `checks`, `stillHappening`, `notes`; optional notes go under the second `---`.

```markdown
---
id: fix-34
type: fixnode
title: What went wrong, in your words
group: machine        # machine, paint, wash-dry, clay, protect, glass, interior, gauge, setup-time, customer, bike, tesla
audience: [owner, crew]
visibility: internal
status: verify
sayIt: [words you would say when this happens]
stopIf:
  - When to stop right away
causes:
  - The most likely cause first
steps:
  - The first thing to do
---
```

Lesson (Phase 2), `content/lessons/lesson-l1-01-new-lesson.md`. The text under the second `---` is the "why," and it is required. Optional: `numbers` and `mistakes`. Leave out `skillId`; sign-off rules live in their own file, written by the learning-designer.

```markdown
---
id: lesson-l1-01-new-lesson
type: lesson
title: Lesson name
level: 1              # 0 to 8
order: 1              # its place in the level; no two lessons share one
audience: [owner, crew]
visibility: internal
status: verify
steps:
  - Do this first
---
The why: the deep part of the lesson, in plain sentences.
```

Price (Phase 4), `content/business/price-car-new-service-sedan.yaml`. As written it shows "Quoted after the test spot" and no number.

```yaml
id: price-car-new-service-sedan
type: priceitem
title: Service name, sedan
kind: service         # service, addon, fee, deposit, or plan
vehicleType: car      # car, bike, or any
size: sedan           # sedan or suv (car); standard or bagger (bike); any
unit: quote           # no number; for a price: unit flat, plus amount in dollars as knowledge base 15 writes it
touchesPaint: false   # true only for a package with an exterior paint stage
audience: [owner]
visibility: internal
status: verify
```

To change a price (from Phase 4): a price is your decision, so tell the lead first. The lead writes it into knowledge base section 15 with you, because the knowledge base wins every conflict. Then change `amount` in that price's file and raise `version` by 1. Do not touch `founderRate`, `unlockAtCars`, or `touchesPaint` without asking: they drive the founder's slots and the 25-car count.

## Replacing or retiring an item

Never delete a file and never rename an id. Write a new file with a new id and the line `supersedes: <old id>`, then set the old file to `status: superseded`. The old one stops showing everywhere, its history stays, and the check makes sure nothing still points at it.
