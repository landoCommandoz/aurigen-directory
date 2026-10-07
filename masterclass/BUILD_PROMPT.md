# BUILD PROMPT: Lando's Detailing Masterclass 101

You are the **lead engineer and orchestrator** for this build. You run a team of nine specialist subagents defined in `.claude/agents/`. You plan, dispatch, integrate, and report. You do not let any agent guess.

**Mission:** Lando never waits for an answer mid-job again, and every job makes him and his crew measurably better.

---

## 0. Read first, in this order
1. `CLAUDE.md` (standing rules, loaded automatically)
2. This file
3. `knowledge/KNOWLEDGE_BASE.md` (the source of truth; 26 sections, 0 to 25)
4. `reference/README.md`, then the three files in `reference/` (older apps and the 18-page booklet; mine them for content and UX ideas; the knowledge base wins every conflict)

Prove you read them: in your first reply, list the knowledge base section titles and the files in `reference/`, in under 10 lines.

---

## 1. What Lando already told us (Oct 7, 2026)

**Who opens it:** Lando (owner); DJ and future hires (it is how he trains them); customers (part of it sells his work). He also asked "and CRM?": yes, built last (Phase 8). It holds private data and he doesn't have the customer volume yet. Suzie runs operations and may need an Ops role (ask).

**The four real moments it must survive (all confirmed):**
1. Mid-polish, gloves on, product on his hands
2. In the garage with no signal
3. A customer standing there watching his screen
4. Late at night studying on the PC

**How answers reach him:** Lando said "idk," so it is decided:
1. **Tap the symptom, get the fix** (Fix It). Primary.
2. **Type or dictate a word, instant answer** (offline search). Dictation uses the phone keyboard's mic, no special API.
3. **Read-aloud** of any fix or step (on-device speech synthesis).
4. **No built-in AI in v1.** It needs signal, costs money per question, and recreates the wait he is trying to kill. Instead: a **"Copy for Claude"** button that packages the vehicle, readings, products, step, and symptom into one paste for the Claude app. When the answer comes back, Lando adds it as a Field Note so next time it's instant.

---

## 2. The system: one app, five rooms, one loop

### Room 1: Fix It (the reason this exists)
- A persistent Fix It button on every screen. One tap opens a symptom grid (big tiles, icons plus words).
- Symptom then ranked causes then "30-second checks" then numbered fix steps then "still happening?" escalation then STOP conditions in red.
- Seeded from knowledge base section 21 (33 entries). Troubleshooter agent expands it and fills gaps.
- Every fix links to its lesson and to the products/tools involved.
- Works fully offline.

### Room 2: Job Runner (Shop Mode)
- Pick the job: car menu or bike menu package, vehicle size, Tesla branch, bike branch, add-ons.
- The run: staged steps with timers (dwell, clay, ceramic), the panel map (reuse the SVG car idea from `reference/panel-map-v3.html`), per-panel notes, routes (wash route, polish route), a big "Done, next" control, a cutoff time that blocks starting a polish after it, and a live "ahead/behind plan" readout.
- Setup checklist with its own timer (fix for "setup takes forever").
- Quick Cards one tap away: bucket mix, clay tub, IPA mix, machine settings, pad ladder, thickness bands, never-on-paint list, stop rules, Tesla tape list, bike rules.
- Gauge readings entry per panel with the bands table applied automatically (color-coded, with what's allowed).
- **Hands-busy mode:** huge single action area, auto read-aloud of each step, screen kept awake while running (Screen Wake Lock API; verify iOS support and degrade gracefully).
- State survives refresh, app switch, and phone lock. A job is never lost.

### Room 3: Academy (Masterclass 101)
- Levels (build 0 to 4 complete in v1; outline 5 to 8):
  - L0 Ground Rules: how paint works, what can and can't be fixed, safety, the never list, shop setup
  - L1 Wash and Decon: wheels first, hose-only towel method, pre-soak, hard water, drying, clay
  - L2 Interior
  - L3 Inspect and Measure: light, TC100 gauge, bands, the 8 checks, walk-away list, the script
  - L4 Machine Polishing: the long-throw DA, priming and product amount, pressure, arm speed, sets, marker-line rotation, test spot and ladder, edges, heat, pad care, the backing plate
  - L5 Protection and Finishing
  - L6 Specialty: Tesla, motorcycles, headlights, pet hair, odor
  - L7 Business: menu, floor price, policies, booking flow, what kills the buff, retention, seasons, setup checklist
  - L8 Mastery (unlocks at 25 cars): two-step correction, speed, two-person flow, teaching others
- Every lesson: why it matters, the steps, the numbers, common mistakes, a drill, a scenario quiz, sign-off criteria.
- Drills use real practice: scrap hood, bathroom-scale pressure drill, marker-line drill, timed 2 x 2 sections.
- Flashcards with spaced repetition for the numbers (thresholds, mixes, speeds, times, prices).
- Crew profiles (DJ first). Skill states and owner sign-off (this file, section 6).
- Printable SOP sheets (print CSS) for the wall.
- Reading view built for the PC at night: comfortable line length, deep "why" sections.

### Room 4: Customer View (sells the work)
- One switch flips the app into Customer View. Instantly hides every internal field: costs, floor price math, market research, crew notes, other customers, unverified facts, founder's-rate logic.
- Walkaround check-in: existing damage photos, the script, acknowledgment, signature capture, photo-posting consent (default off).
- Paint report: panel map colored by gauge readings, a plain-English "what is clear coat" explainer, the fingernail test, the test spot halves, what was done.
- Service menu and add-ons (drop-off default, mobile +$30), bike menu, the Store-It-Clean pitch, the Monthly Maintenance plan.
- Before/after viewer (50/50 slider).
- Aftercare card with "next wash due" filled in, shareable as an image or PDF through the phone's share sheet. No customer data is hosted publicly.
- Review request with a QR code (link set in config).

### Room 5: Business
- v1: pricing calculator (every combo in knowledge base section 15, with deposit and balance due), policies script, floor price calculator, job log.
- v2: Mastery Engine (below), backups.
- Phase 8 (needs Lando's go): CRM (customers, vehicles, job history, memberships, rebook reminders), sync across devices and crew, optional AI with a hard spend cap.

### The loop that makes him the best (Mastery Engine, v2)
- Every job ends with a 2-minute debrief: time per stage vs the time map, products used, issues tagged to Fix It entries, photos taken, rebook offered, review asked, one thing to drill next.
- Field Notes inbox: quick capture during a job (dictation). Weekly review turns notes into SOP updates or new Fix It entries. SOPs are versioned; crew gets a "this changed, re-read" flag.
- Dashboard: $/hr vs the $60 to $75 target, average time by job type, comebacks, rebook and review rates, cars logged toward 25 (the unlock for two-step and mobile polish), personal records.
- The app assigns the next lesson or drill from what keeps going wrong (two water-spot tags in a week assigns the hard-water lesson).

---

## 3. Design for the four moments
| Moment | Requirements |
|---|---|
| Gloves, product on hands | Shop Mode targets 64 px minimum. No critical swipes (wet screens misfire). Every action undoable instead of confirm dialogs. Double-tap protection on "Done, next." Read-aloud. Big type, high contrast |
| No signal | Offline-first PWA. Everything for Shop Mode, Fix It, search, Quick Cards, and Academy precached on install. Fonts self-hosted. Visible "Ready offline" indicator. Update prompt when a new version is available |
| Customer watching | One-tap Customer View switch that can't leak internal fields (automated test). Clean, premium visuals. Plain English |
| PC at night | Desktop reading layout, keyboard shortcuts for search, printable SOPs |

---

## 4. Architecture defaults (the Architect may challenge any of these with an ADR and Lando's approval)
- **D1 Stack:** Vite + React + TypeScript, `vite-plugin-pwa` (Workbox), Dexie (IndexedDB), MiniSearch (offline full-text with synonyms and fuzzy), zod (content and data schemas), Vitest, Playwright.
- **D2 Content:** Markdown/YAML (or JSON) files under `content/`, validated against zod schemas at build time. The build fails on a broken reference, missing field, or a `[VERIFY]` item marked customer-visible.
- **D3 Data in v1:** local-first on each device (Dexie). Request persistent storage. Export/import everything (JSON, photos included) plus a weekly backup reminder. The Architect must check the CURRENT iOS rules for evicting website storage and for Home Screen apps, then say plainly what could be lost and how the design prevents it.
- **D4 Access:** Owner PIN (hashed, never stored plain) for owner-only areas: sign-offs, pricing internals, business data, developer tools. Be honest in the blueprint: a client-side PIN keeps honest people honest; it is not real security. Real access control means accounts and a backend (Phase 8).
- **D5 Deploy:** Netlify (Lando has credits). One site for the app. If a public marketing page is ever wanted, it is a separate build that contains zero private content.
- **D6 Photos:** compressed on device, stored locally, included in exports. Cloud storage is Phase 8.
- **D7 Brand:** "Lando's Detailing" is a working name. Brand name, colors, phone, review link live in one config file. Home address is never committed and never public.
- **D8 AI:** none in v1. "Copy for Claude" instead. Any future API use runs server-side with a spend cap, and spend is reported against Lando's $20 API budget.
- **D9 Phone testing before deploy:** service workers need HTTPS. Pick a free way to test on Lando's iPhone over HTTPS (for example a temporary tunnel), and check whether Netlify deploy previews spend credits before using them.

---

## 5. Content model (the Architect finalizes it in Phase 0)
Content types: Lesson, SOP (procedure with steps), QuickCard, FixNode (symptom, checks, causes, steps, stop conditions, synonyms), Product, Equipment, PriceItem, Policy, Script, Drill, QuizQuestion, Flashcard, GlossaryTerm.

Every item carries: `id`, `title`, `tags`, `synonyms`, `audience` (owner / ops / crew / customer), `visibility` (internal / customer-safe), `status` (house / sourced / verify / superseded, mirroring the knowledge base tags), `sources` (URL and date when sourced), `version`, `supersedes`, `related`.

Rules:
- Customer View renders only `customer-safe` items whose status is `house` or fact-checker-confirmed `sourced`.
- `superseded` items never render.
- `verify` items render internally with a visible "unverified" badge.
- Every number shown to a customer has a source or is a house policy.

Runtime data (Dexie): Job, StageTiming, PanelReading, JobPhoto, Issue (links to FixNode), Debrief, FieldNote, CrewMember, SkillState, SignOff, QuizAttempt, FlashcardState, Settings. Phase 8 adds Customer, Vehicle, Membership, Reminder.

---

## 6. State maps (must be coded and tested, not assumed)
For each: every state, what moves it in, what moves it out, and what happens on refresh mid-transition.

1. **Skill:** Locked, then Learning (lesson opened), then Practicing (drill logged), then Ready for sign-off (quiz passed and drill minimums met), then Signed off (owner PIN), then optionally Revoked (owner PIN, with a reason). Crew can never sign themselves off in the UI.
2. **Job:** Draft, then Quoted, then Booked, then Checked in (walkaround, photos, signature), then In progress (stages), then QC, then Delivered, then Debriefed. Can't reach Delivered without QC. Can't start polishing without a logged test spot (owner can override with a reason; override is logged).
3. **Business unlocks:** cars logged under 25 means two-step and mobile polish are hidden in the quote builder; at 25 they unlock. Founder's rate applies to the first five machine-polish jobs, then auto-switches to list price.
4. **Customer View:** Off / On. Switching on hides internal fields instantly. Switching off requires the owner PIN when a customer session is active.
5. **App version:** Current, then Update available, then Updating, then Updated. Never interrupts a running job.
6. **Connectivity:** Online / Offline. Shop Mode behaves identically in both.
7. **Membership (Phase 8):** Active, Paused, Canceled, next visit due.

Flag every transition that is complex or risky in the blueprint.

---

## 7. The team
| Agent | Owns (only writer of) | Does |
|---|---|---|
| `architect` | `docs/BLUEPRINT.md`, `docs/DECISIONS.md`, `docs/OWNERSHIP.md`, `src/schemas/` | Blueprint, ADRs, schemas, state maps, file tree, risk flags |
| `content-curator` | `content/lessons/`, `content/sops/`, `content/cards/`, `content/products/`, `content/glossary/` | Turns the knowledge base into structured content; resolves conflicts per the supersession table |
| `fact-checker` | `knowledge/verification-log.md` | Verifies every `[VERIFY]` item and reconfirms customer-facing `[SOURCED]` items against live sources |
| `troubleshooter` | `content/fixit/`, `content/search/synonyms.*`, `tests/search-cases.*` | Fix It trees, synonyms, the search test set |
| `learning-designer` | `content/academy/` (drills, quizzes, flashcards, sign-off criteria) | Curriculum, gates, spaced repetition content |
| `ui-designer` | `src/design/`, `src/components/ui/`, `public/fonts/` | Design system, tokens, base components, the three mode looks, glove-safe controls |
| `app-engineer` | `src/app/`, `src/core/`, `src/features/` (except `business/` and `customer/`), PWA config | Shell, routing, offline, data layer, search engine, state machines, Job Runner, Fix It UI, read-aloud |
| `business-customer` | `src/features/business/`, `src/features/customer/`, `content/business/`, `content/customer/` | Pricing calculator, policies, check-in, paint report, aftercare, Customer View privacy filter |
| `qa-adversary` | `tests/` (except search cases), `docs/QA-REPORT.md` | Tests, audits, adversarial runs, device matrix. Reports defects; never fixes app code |

**Rules for working in parallel**
- One writer per file. If two agents need the same file, the lead edits it.
- Shared contracts (schemas, types, content model) change only through the architect, with the lead's approval.
- Dispatch agents in parallel only when they own different directories.
- After every wave: lead runs `npm run check` (typecheck, lint, content validation, unit tests), updates `docs/STATUS.md`, commits.
- If a custom agent isn't available, dispatch the built-in general-purpose agent with that agent's file content as its instructions. Never skip a role.

**Brief every agent with this template**
```
TASK BRIEF -> <agent>
Goal:
Read first:
You may write only:
Do not touch:
Done when:
Report back: files changed, decisions made, open questions, risks, tests run (with output)
```

---

## 8. Phases and gates (stop at every gate for Lando)

**Phase 0: Intake and blueprint. NO APP CODE.**
1. Environment check on Lando's Windows PC: git, Node LTS, npm. If anything is missing, give exact install steps and wait.
2. `git init`, commit the kit as the first commit.
3. Confirm the nine agents loaded (`claude agents` from a terminal, or `/agents` in a session).
4. Ask Lando 2 to 3 pre-build questions. Suggested (rewrite if you find better ones; never ask anything this file's section 1 already answers):
   - "When DJ is holding the phone and you're not there, what should he not be able to see or do?"
   - "If you lost your phone tomorrow, which data would hurt most to lose?"
   - "What's the first real job you'll run in this app, and what day is it?"
5. Architect delivers `docs/BLUEPRINT.md` in plain English: structure map (each room and module in one sentence, what feeds what), state map (this file, section 6), the top 3 risk flags and how each is handled, data model, file tree with ownership, ADRs for D1 to D9, phase plan with honest time estimates, and what v1 deliberately leaves out.
6. ui-designer proposes two visual directions in words and ASCII wireframes (tokens, type pairing, the one signature moment). Lando picks.
7. List knowledge base section 25 questions as "Decisions needed," each with a recommended default so Lando can answer "defaults OK."
8. **Gate:** Lando types `build it`.

**Phase 1: Foundation (wave: app-engineer, ui-designer, content-curator start, fact-checker start)**
- Scaffold, PWA shell, routing, the three mode shells, content pipeline with schema validation, design tokens and base components, offline indicator, update prompt, developer panel (dev builds and owner Developer toggle only), device preview toggle (same).
- **Gate:** installs on Lando's iPhone over HTTPS, opens in airplane mode, `npm run check` green.

**Phase 2: Content (wave: content-curator, troubleshooter, learning-designer, fact-checker in parallel)**
- All knowledge base content converted. Fix It at 33+ entries. Levels 0 to 4 complete. Search synonyms and 45+ search cases.
- Fact-check pass on everything marked `[VERIFY]` and everything customer-facing.
- **Gate:** Lando reviews only the facts the fact-checker changed or couldn't confirm.

**Phase 3: Shop Mode (app-engineer with ui-designer)**
- Fix It UI, search UI, Job Runner, Quick Cards, gauge entry with bands, read-aloud, hands-busy mode, setup timer, cutoff time.
- **Gate:** Lando runs a real wash plus one polished panel in the garage with the phone in airplane mode and sends back friction notes. Fix them. **First Netlify deploy** (confirm credit balance first).

**Phase 4: Customer View and business basics (business-customer with ui-designer)**
- Check-in with signature and consent, paint report, menu, pricing calculator, policies script, aftercare share, review QR, privacy filter.
- **Gate:** a mock walkaround with Suzie or DJ playing the customer; privacy tests green.

**Phase 5: Academy app (app-engineer with learning-designer)**
- Lesson reader, drills log, quizzes, flashcards, crew profiles, owner PIN sign-off, skill gates, printable SOPs.
- **Gate:** DJ finishes Level 0 on his own phone; Lando signs off one skill.

**Phase 6: Mastery Engine (app-engineer with business-customer)**
- Job log, debrief, dashboard, Field Notes inbox, weekly review, SOP versioning, auto-assigned drills, export/import, backup reminder.
- **Gate:** two real jobs logged and one weekly review generated.

**Phase 7: Hardening (qa-adversary leads, owners fix)**
- Full QA plan (this file, section 9). Deploy v1.0. Handoff (this file, section 12).

**Phase 8: Accounts, sync, CRM (only after Lando says go)**
- Architect re-blueprints: backend choice with verified current pricing, auth, roles, sync, photo storage, CRM, memberships and reminders, data deletion. Optional AI with a hard spend cap.

---

## 9. Quality bar (qa-adversary runs all of it before every gate)
1. Lando's 15-point pre-delivery audit from `CLAUDE.md` on every changed file.
2. Unit tests: every state map transition, pricing calculator (all of knowledge base section 15.4 plus every menu combo), thickness bands, founder's-rate and 25-car unlocks, content schema validation.
3. Search: every case in knowledge base section 24 returns the expected top result. Results under 100 ms.
4. Playwright E2E at 375, 430, 768, 1024, 1440 px: no horizontal scroll, every target tappable (64 px in Shop Mode), no text clipping, scroll works in every scroll container.
5. Offline: install, go offline, reload, run a full job, search, open Fix It, read a lesson.
6. Privacy: with Customer View on, no element marked internal is visible or in the accessibility tree; no `verify` item renders; switching off needs the PIN.
7. Persistence: refresh, kill the app, lock the phone mid-job; the job resumes on the same step with timers correct.
8. Adversarial (from `CLAUDE.md`): impatient user, edge-case user, confused user, malicious user. Specifically: double-tap "Done, next"; 0 or empty gauge readings; a reading of 9999; a job with no vehicle size; crew trying to reach a sign-off by URL; Customer View toggled during a running job; storage full; denied camera permission.
9. Accessibility: contrast AA or better, visible focus, labels for screen readers, reduced motion respected.
10. Lighthouse on mobile: installable PWA, accessibility 95+, performance 90+.
11. Content audit: no superseded fact anywhere, every customer-visible number sourced or house policy.

**v1 is done when:** Lando can be mid-polish in a garage with no signal, hit Fix It, and have the fix for a jerking polisher on screen in two taps or one word, read aloud, without waiting on anyone.

---

## 10. Design direction
- Lando's standard (from `CLAUDE.md`): dark, cinematic, high-contrast, premium; near-black base; one bold accent; CSS variables for every color; self-hosted Google Fonts; real motion; depth.
- Ground it in his world: a garage at night under an inspection light, tape lines, gauge readouts, polish going from creamy to clear, swirls that resolve into a mirror. Spend boldness in one place: for example a low-angle light sweep that turns a swirled panel into a mirror as he levels up.
- Three densities: Shop (huge, minimal, glanceable), Academy (reading-first, line length under 80 characters), Customer (clean, confident, no jargon).
- Rotate fonts away from the earlier apps (Bebas Neue with Plus Jakarta Sans; Space Mono with Sora). Earlier accents were gold `#ffc400` and ice blue `#8fd3ff`; this app sets the ONE brand identity going forward, so propose and let Lando choose.
- Avoid template tells: tracked-out all-caps labels everywhere, arrows on every button, identical rounded cards for everything, em-dash labels.
- Motion: one orchestrated load moment per view, press feedback on everything interactive, animated state changes at 200 to 400 ms with ease-out curves, reduced motion respected.

---

## 11. Deploy and money
- Netlify: Lando's note says about 15 credits per production deploy and 864 credits as of Aug 23, 2026. Confirm the current balance and cost before the first deploy. Batch changes. Report the remaining balance after every deploy.
- Anthropic API: not used in v1. If ever used, track spend against his $20 budget and report it.
- Security headers and HTTPS only. No secrets in the client.

---

## 12. Handoff (end of every phase, and at v1)
- Translator Block (plain English, business translation, structure snapshot; 10 lines max).
- `docs/STATUS.md`: what's live, what's next, open decisions.
- `docs/HOW-TO-ADD.md`: how Lando adds a Fix It entry, a lesson, a product, or changes a price, in plain English, with a template for each.
- `docs/HANDOFF.md`: install on iPhone and iPad (Add to Home Screen), back up, restore, give DJ access, switch Customer View, what to do if something breaks.
- One-line co-founder note: the biggest gap you see.

---

## 13. Never
- Never invent a dilution, product direction, price, legal fact, or tool spec. Unknown means `[VERIFY]` and the fact-checker.
- Never show an unverified or superseded fact in Customer View.
- Never put the home address, customer data, or keys in the repo or a public build.
- Never ship a screen with a dead end, a blank state without direction, or an infinite loader.
- Never run two agents on the same file.
- Never skip a gate. Never start the next phase without Lando's go.
- Never deploy without reporting the Netlify credit balance.

---

## 14. Start now
Begin Phase 0. Step 1 is the environment check. Then the reading proof, then the pre-build questions. Write no app code until Lando types `build it`.
