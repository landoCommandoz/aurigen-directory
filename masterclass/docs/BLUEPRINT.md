# Blueprint: Lando's Detailing Masterclass 101

This is the plan for the app. The decisions in it were taken on 2026-10-10. The only thing left is to type `build it`.

Phase 0, step 5. Written 2026-10-08 by the architect role and revised the same day after three reviews. Updated 2026-10-10 with Lando's gate decisions (section 12 and `docs/DECISIONS.md`). Documents only. No app code exists yet.

## Read this first (Lando, on your phone)

1. What gets built: one app that works with no signal, with five rooms (Fix It, Job Runner, Academy, Customer View, Business), in seven phases. You test each phase on your phone before the next one starts.
2. Where the code lives: decided 2026-10-10, "Repo OK." The app and notes stay in the Aurigen project folder on GitHub. The knowledge base stays readable there, minus the market research, which was removed on 2026-10-10 at your request. The Aurigen website was checked on 2026-10-10 and shows nothing from the masterclass folder. The two Phase 1 workflow files at the repo root are approved under the same OK (`docs/DECISIONS.md` D0).
3. Cheapest phone test: a free GitHub Pages link, 0 Netlify credits. When the lead sends the Phase 1 link, you do one tap: repo Settings, Pages, Source, GitHub Actions. `[VERIFY]`: this is the first thing to try; if Safari cannot reach that setting even after "Request Desktop Website," we use the Netlify path in 10.4.
4. Only a real publish to Netlify costs credits: 15 each. Deploy Previews and branch deploys cost 0, and so does the draft deploy our test button makes. Nothing touches Netlify until you say go at the Phase 3 gate. Source: Netlify Docs, How credits work, https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/ (read 2026-10-07); details in 10.2.
5. Budget for all of v1: 2 planned publishes (30 credits) plus a reserve of 3 (45 credits), 75 credits at most, plus a few credits of phone traffic. Credits may have reset since August, so check the balance first (10.7).
6. The look: A, Hi-Vis, picked 2026-10-10. In Customer View the accent stays sparse; off-white, photos, and the panel-map readings carry that screen. The rest is in `docs/DESIGN-DIRECTIONS.md`.
7. Decisions: items 1 to 16 in section 12 accepted on 2026-10-10 with your two edits (9, the pad ladder; 14, only jobs that touch paint count toward 25). Your three answers (first real job, Customer View and the phone, DJ and the Level 4 sign-off) are recorded in sections 3 and 9 and in `docs/DECISIONS.md` D10 and D11.
8. To start: type `build it`. Nothing else is open. You only need this block, section 9, and section 12. Sections 6 to 8 are for the builders.

## 1. How to read this file

- Read with: `CLAUDE.md` (rules), `BUILD_PROMPT.md` (plan), `knowledge/KNOWLEDGE_BASE.md` (facts, with their status tags kept as written), `docs/DESIGN-DIRECTIONS.md` (the two looks), `docs/DECISIONS.md` (the reasons behind every choice here), `docs/OWNERSHIP.md` (who writes what; nothing in it needs your answer).
- Lando took the decisions on 2026-10-10 (section 12; `docs/DECISIONS.md` D0, D9, D10, D11 and the dated record at its end). Every one of them is `[HOUSE]`. Phase 1 starts when he types `build it`.
- Numbers come from the knowledge base and keep its tags: `[HOUSE]`, `[SOURCED date]`, `[VERIFY]`, `[SUPERSEDED]`. Nothing tagged `[VERIFY]` is ever shown to a customer.
- Browser, hosting, and money facts come from the research checked on 2026-10-07 and 2026-10-08 (WebKit, Apple, MDN, Netlify, GitHub, Vercel, npm). Each one is cited in `docs/DECISIONS.md`. Where the research could not confirm something, it says `[VERIFY]` and names the test we run on your phone.
- Sessions: one Claude Code working session is roughly 2 to 4 hours of agent work. Lando-minutes are your own time on the phone at each gate.
- Two phones appear below. The shop phone is yours: it holds the jobs, the counters, the crew profiles, and the sign-offs. A study phone (DJ's) holds the Academy only. Section 3.1 says why.

## 2. Structure map: one app, five rooms, one loop

### 2.1 The shell (what every room shares)

| Module | One sentence | Feeds |
|---|---|---|
| App shell | One screen frame with the three densities (Shop, Academy, Customer), the mode switches, and a bottom row that holds Fix It on every internal screen; in Customer View the bottom row holds only "End customer session." Built to Direction A, Hi-Vis (Lando's pick, 2026-10-10); the Customer density keeps the accent sparse, so off-white, photos, and the panel-map readings carry that screen; tokens, type, and wireframes are in `docs/DESIGN-DIRECTIONS.md` | Every room |
| Content bundle | Every lesson, fix, card, price, and policy, compiled from `content/` at build time, validated, and shipped inside the app so it works offline | Fix It, Search, Academy, Quick Cards, Business, Customer View |
| Search | One text box that takes typed or dictated words (the phone keyboard's mic), searches the bundle on the device with synonyms and fuzzy matching, and returns the best fix or card in under 100 ms | Fix It, Quick Cards, Academy |
| Read-aloud | On-device speech that reads any fix or step after one "Start voice" tap, with Pause and Repeat | Fix It, Job Runner, Academy |
| Data layer | A database that lives on the phone (the tool is called Dexie) holding jobs, readings, photos, notes, crew, skills, and settings, with backup and restore through the phone's share sheet | Job Runner, Customer View, Business, Academy, Mastery Engine |
| Offline and updates | A background helper that keeps a full copy of the app on the phone so it opens with no signal, a "Ready offline" marker, and an update banner that waits for a quiet moment | Everything |
| Owner PIN | A PIN stored scrambled so it cannot be read back; a correct PIN unlocks sign-offs, pricing internals, business data, developer tools, and switching Customer View off during a customer session | Academy, Business, Customer View, developer panel |
| Internal wrapper | One component, `<Internal>`, that every internal element sits inside; in Customer View it renders nothing, so the element is not on the page at all (one file, `src/core/customerView.tsx`, section 3.4) | Every room |
| Developer panel | A toggleable readout of live state (job state, counters, storage, the offline copy, wake lock, speech), on in dev builds and behind the owner PIN in production, never in Customer View | Lead and QA |
| Config | One file with the brand name, phone, email, review link, service area, and the accent color | Every screen with the brand on it |
| Copy for Claude | One button that packages vehicle, readings, products, current step, and symptom into one text block for the Claude app, with a Field Note capture for the answer | Fix It, Job Runner, Field Notes |

### 2.2 Room 1: Fix It

| Module | One sentence | Feeds |
|---|---|---|
| Fix It button | Sits in the bottom row of every internal screen (never in Customer View) and opens the symptom grid in one tap | The symptom grid |
| Symptom grid | Big tiles with an icon and words, grouped by job stage, with the group matching the running step opened first | The fix page |
| Fix page | Symptom, then STOP conditions in red, then 30-second checks, then ranked causes, then numbered steps, then "still happening?" escalation | Read-aloud, related lesson, products and tools, Copy for Claude |
| Issue tag | A one-tap "this happened on this job" that records the fix used against the running job | Debrief, dashboard, auto-assigned drills |

Seeded from knowledge base section 21 (33 entries). The troubleshooter agent expands it. Works fully offline.

### 2.3 Room 2: Job Runner (Shop Mode)

| Module | One sentence | Feeds |
|---|---|---|
| Job picker | Car or bike menu, vehicle size, Tesla branch, bike branch, add-ons, drop-off or mobile | The quote, the run plan |
| Setup checklist | The kit staging list with its own 15 minute target timer (knowledge base 18.3 `[HOUSE proposal]`) | Stage timings |
| The run | Staged steps in the house order with timers (dwell, clay, the 30 minute ceramic wax stage plan from knowledge base 17.2, 2 x 2 ft sections), the panel map with routes, per-panel notes, one huge "Done, next" control, Pause and Resume, and an "ahead or behind plan" readout against the time map (knowledge base 17) | Stage timings, debrief, dashboard |
| Cutoff | A time set per job; after it, the Runner will not start a new polish square, and it never interrupts a square in progress | The run |
| Test spot gate | The polish stage will not open until a test spot (panel, combo, result) is logged; when a crew member is the one running the stage, that member also needs the Level 4 sign-off on this phone; the only way around either check is an owner override with the PIN and a reason, written to the audit log (3.2) | The run, the job sheet, the paint report |
| Gauge entry | Readings per panel with the bands table applied automatically and color-coded with words (knowledge base 7.3); the rules below say what is accepted | Panel readings, the paint report, FIX-22 |
| Quick Cards | Bucket mix, clay tub, IPA mix, machine settings, pad ladder, thickness bands, never-on-paint list, stop rules, Tesla tape list, bike rules, one tap from the run | The run, Search |
| Hands-busy mode | One action area, 64 px targets, auto read-aloud of each step, screen kept awake while a stage runs; laid out for how Lando works (2026-10-10): the phone propped on the cart at arm's length, the polisher in the right hand, the left thumb tapping, with the left or right handed switch kept | The run |
| Stop | Owner PIN and a reason; the job ends as Stopped and stays in the log (paint on the pad, a walk-away finding, the customer takes the car) | The job log, the debrief |

Pad ladder Quick Card, as Lando set it on 2026-10-10 `[HOUSE]`. It matches knowledge base 8.5, and 3.2 already says the black pad is for finishing and wax only; the earlier default in section 12 item 9 was wrong to list black in the ladder.

1. Yellow + M210.
2. Still swirled: maroon + M210.
3. Still swirled and the panel reads 100 µm or more (knowledge base 8.5): maroon + Ultimate Compound, then always yellow + M210 to clear the compound haze.

Black is a wax and finishing pad only and never appears in the ladder. Pads on hand: Uro-Tec yellow x3, maroon x2, HF finishing pads (colors unconfirmed, `[VERIFY]` as knowledge base 3.2 says), one black pad. The card shows the three rungs and the black-pad rule; the test spot record (section 6) names the rung that won.

Gauge entry rules, so every test has an expected result:

- Accepted range: 20 to 999 µm. Anything else (0, empty, text, a negative number, 9999 µm) is refused with "Check the gauge" and a link to FIX-21, and is not saved.
- A panel saves with 1 reading and shows "take 3" until it has 3. Up to 5 per panel (knowledge base 7.2: 3 to 5 readings).
- The panel's band is computed from the lowest reading on that panel against the knowledge base 7.3 table.
- "The rest of the car" is the median of the lowest readings of the other measured panels. A panel whose lowest reading is 220 µm or more is flagged repaint, as 7.3 says ("about 220+"). A panel more than 40 µm below that median is flagged thin. The 40 µm is a proposal, `[HOUSE proposal]`, section 12 item 16. With fewer than 2 other panels measured there is no "rest" yet, so neither flag is computed.
- The door jamb baseline is entered first and shown beside every panel (knowledge base 7.2).

State survives refresh, app switch, and phone lock. A job is never lost (section 3.2).

### 2.4 Room 3: Academy (Masterclass 101)

| Module | One sentence | Feeds |
|---|---|---|
| Levels and lessons | Levels 0 to 4 complete in v1, 5 to 8 outlined; every lesson runs why, steps, numbers, mistakes, drill, quiz, sign-off | Skill states |
| Drills log | Real practice logged with a number where there is one (scale pressure, marker-line turns, timed 2 x 2 ft sections) | Skill states, dashboard |
| Quizzes | Scenario questions with a pass mark per skill (set in the sign-off criteria file) | Skill states |
| Flashcards | Spaced repetition for the numbers (bands, mixes, speeds, times, prices) | Nothing else; a drill of its own |
| Crew profiles | Live on the shop phone with their skill states and sign-offs; a study phone (DJ's) is for study only: it holds one person's lesson progress, drills, quizzes, and flashcards and sends them to the shop phone as a small file ("Share my progress"); finishing a level on a study phone unlocks nothing anywhere | Sign-offs, the Job Runner's crew view |
| Sign-off | Owner PIN only, on the shop phone only, given while Lando watches the crew member do the skill; if he is standing there he signs off on the shop phone right then; records who, what, when, and a reason on revoke; the Level 4 sign-off is the one that lets a crew member run machine polishing in the Job Runner's crew view (3.1) | Skill states, audit log, the polish stage guard |
| Printable SOPs | Print stylesheet for the wall; printed from the phone (Share, Print, AirPrint) or from the PC | The wall |
| Reading view | Desktop layout with 68 characters per line for the deep "why" sections | The PC at night |

### 2.5 Room 4: Customer View

| Module | One sentence | Feeds |
|---|---|---|
| The switch | One tap on, hides every internal field instantly and shows a one-tap reminder to turn on an iPhone Focus; while Customer View is on the app sends no notification and renders no toast, banner, or in-app alert of its own; off needs the owner PIN while a customer session is active (section 3.4, `[HOUSE]` 2026-10-10) | Every screen |
| Walkaround check-in | Existing damage photos, the script read out loud, acknowledgment, signature, photo-posting consent (default off) | The job, the job sheet |
| Paint report | The panel map colored by the bands with plain words, "what is clear coat," the fingernail test, the test spot halves, what was done | Pickup, the aftercare moment |
| Menu and plans | Service menu with drop-off prices, mobile +$30, bike menu, Store-It-Clean, Monthly Maintenance | The quote |
| Before and after | 50/50 slider over the job's photos | Pickup |
| Aftercare card | "Next wash due" filled in, shared as an image or PDF through the share sheet | Pickup |
| Review request | QR code to the review link from config; no link is set yet, so the screen stays hidden until you paste one into the config file (a stated default, D7) | Pickup |

Only customer-safe content with status house, or sourced and confirmed by the fact-checker, ever renders here. No customer data is hosted anywhere public. Look: Direction A with the accent kept sparse; off-white, photos, and the panel-map readings carry these screens (Lando, 2026-10-10; details in `docs/DESIGN-DIRECTIONS.md`).

### 2.6 Room 5: Business

| Module | One sentence | Feeds |
|---|---|---|
| Pricing calculator | Every combination in knowledge base 15 with deposit and balance due, the founder's rate on the first five machine-polish jobs, and the 25-car unlocks | The quote |
| Policies script | The five policies said out loud when booking | Booking |
| Floor price calculator | Monthly costs divided by jobs, plus products, plus hours at the rate (knowledge base 15.3) | Pricing decisions, internal only |
| Job log | Every job with its state, times, readings, issues, and money | Dashboard, counters |
| Mastery Engine (v2, Phase 6) | Debrief, Field Notes inbox, weekly review, SOP versioning, dashboard, auto-assigned drills, backups | The loop |

### 2.7 The loop that makes you better

1. The Job Runner records real stage times, products, readings, and every Fix It tag during the job.
2. The 2 minute debrief at Delivered turns that into one record: time per stage against the time map, issues, photos, rebook offered, review asked, one thing to drill next.
3. Field Notes captured during the job (dictated) wait in an inbox. The weekly review turns each into an SOP change, a new Fix It entry, or a dismissal. SOP changes carry a version, and crew see a "this changed, re-read" flag.
4. The dashboard counts cars that touched paint toward 25 (3.3), dollars per hour against the $60 to $75 target, time by job type, comebacks, rebook and review rates, personal records.
5. The app assigns the next lesson or drill from what keeps going wrong (two water-spot tags in a week assigns the hard-water lesson).
6. Sign-offs recorded on the shop phone change what the crew view of the Job Runner on that same phone lets a crew member run: machine polishing opens for a crew member only with that member's Level 4 sign-off. Jobs and sign-offs live in one database, so the gate is real.

Phases 1 to 5 build the rooms. Phase 6 closes the loop.

## 3. State maps

Rules that apply to every state map:

- Every state lives in the data layer, not in a screen. A screen only shows the stored state.
- Every transition is one write in one transaction. After a refresh the app sees the old state or the new state, never half of one.
- Timers store a start stamp, paused time, and a heartbeat (the last time the app saw the clock, written every 15 seconds while the app is awake), never a countdown. Elapsed time is the clock now, minus the start stamp, minus paused time. So a locked phone keeps counting, and the dwell timer in your pocket still ends on time. If the clock ever reads earlier than the last heartbeat (the phone clock was moved back), the timer holds at its last value, shows "Clock changed, timer held," and resumes from that value on the next tap. A clock moved forward cannot be told apart from a locked phone, so a countdown that ends while the screen was off reads "Ended while the screen was off. Check the panel." Nothing in the Runner advances on a timer; only a tap advances.
- Every event carries the step or state it expects to act on. A stale event (a second tap, an old tab) is rejected instead of applied twice.
- The developer panel shows the current state of every map below.

### 3.1 Skill (per crew member, per skill)

| State | Enters when | Leaves when | On refresh mid-transition | Risk |
|---|---|---|---|---|
| Locked | A crew profile is created (every skill starts here) or a prerequisite skill is not signed off | The lesson is opened and prerequisites are signed off | Nothing in flight | Low |
| Learning | The lesson is opened for the first time | The first drill for this skill is logged | Scroll position may reset; state is kept | Low |
| Practicing | The first drill is logged | The quiz is passed at or above the pass mark AND the drill minimum is met, in either order | A quiz attempt saves every answer; the attempt resumes or restarts; the state stays Practicing until the attempt is submitted | Medium: two conditions in either order. Handled by recomputing readiness after every quiz or drill write, including after a crew progress import |
| Ready for sign-off | Both conditions are true | The owner signs off (owner PIN, shop phone) | The PIN entry is never persisted; the owner re-enters it | High: see the guard below |
| Signed off | The sign-off record is written | The owner revokes with a reason (owner PIN). A revoke of a prerequisite does not cascade: this skill stays Signed off and the profile shows "prerequisite revoked" on it | Nothing in flight | Low |
| Revoked | The revoke record is written with its reason | A new drill is logged, which returns the skill to Practicing; the quiz must be passed again (a stated default: a revoke means the quiz is retaken) | Nothing in flight | Low |

Guard, crew can never sign themselves off: the sign-off button does not render for a crew profile; the data layer refuses a sign-off without an owner pass (a 5 minute pass the app keeps only while it is open, issued by a correct PIN); opening the sign-off URL directly as crew shows a locked screen; on a study phone the screen does not exist. Tested by the malicious-user run (crew reaches the sign-off URL by hand).

Crew gating, as Lando set it on 2026-10-10 `[HOUSE]`:

- DJ's phone is for study only. Finishing a level on it unlocks nothing, on that phone or on the shop phone.
- Sign-offs live on the shop phone and happen with Lando's PIN while he watches the crew member do the skill. If he is standing there, he signs off on the shop phone right then; nobody waits on a progress file.
- Machine polishing in the crew view of the Job Runner needs that crew member's Level 4 sign-off (the machine polishing skill). Level 0 does not gate polishing or anything else in the Runner; Level 0 is the ground rules lesson.
- The car keeps moving: Lando polishes, DJ does what he is cleared for. A missing sign-off never stops the job; it only decides who runs the polish stage.
- Owner override only with Lando's PIN and a logged reason (the `polishOverride` record in section 6 plus an audit entry). The reason is required; the data layer refuses an override without one.
- The answer to "DJ's phone says he passed but the shop phone shows no sign-off": blocked. The study phone's word counts for nothing; only a sign-off record on the shop phone opens the stage. `docs/DECISIONS.md` D11.

Where crew data lives in v1 (there is no sync):

- The shop phone (yours) holds the crew profiles, every skill state, every sign-off, the jobs, and the counters. Its owner PIN is yours. The crew view of the Job Runner on the shop phone reads sign-offs from the same database, so a sign-off changes what DJ can run on that phone the moment it is written.
- A study phone (DJ's own phone) is set to "Study phone" at first run. It holds Academy reading, drills, quizzes, and flashcards for one person, plus Fix It, Search, and Quick Cards. It has no sign-off screen, no Business room, no job creation, and no counters. A sign-off cannot be recorded on it, whoever knows its PIN.
- DJ's progress travels to the shop phone by "Share my progress" (a small JSON file through the share sheet: his drill log and quiz attempts, nothing else) and "Import crew progress" on the shop phone. The import merges drills and quiz attempts, recomputes readiness, and refuses any sign-off record found in the file. You sign off on the shop phone with your PIN.
- Changing a phone's role (Shop or Study) needs the PIN and is logged.
- Honest rule for any phone you hand to crew: you install the app and set its PIN yourself before handing it over. Settings shows the date the PIN was set. A PIN reset (the "Forgot PIN" path) marks every sign-off and override on that phone "needs re-check" until you confirm each one with the new PIN (`docs/DECISIONS.md` D4).
- Sync across devices is Phase 8.

### 3.2 Job

| State | Enters when | Leaves when | On refresh mid-transition | Risk |
|---|---|---|---|---|
| Draft | "New job" is tapped | Quote: vehicle size, package, and options are set and the quote is computed. Delete: the draft is removed; nothing else changes | Every field change is saved; the draft reopens where it was. A draft may still have no vehicle size (the DraftJob record in section 6) | Low |
| Quoted | The quote is computed and frozen into the job (prices, founder's rate yes or no, unlock rules as of this moment) | Book: records the $50 deposit (paid or waived with a logged reason). Cancel. Edit: returns the job to Draft; the frozen quote is discarded and any held founder's slot is released; the next Quote re-reads the counters | Nothing in flight | Medium: the counters are read at quote time and frozen, so a later job cannot re-price this one |
| Booked | The deposit is recorded | Check-in done: at least one before photo, the script acknowledged, a signature captured, consent recorded. Cancel: deposit rule applied (policies 3 and 4), reason logged, founder's slot released | The walkaround is saved field by field as a check-in draft inside the job; it resumes on the same screen. The signature pad clears itself if the screen resizes, so the signature is saved the moment the customer lifts the pen | High: four sub-steps with a camera and a pen. Handled by the field-by-field draft and by saving the signature image immediately |
| Checked in | The last walkaround field is saved | Start: the first stage starts (start time stamped). Cancel: the customer walks after the walkaround (damage found, FIX-28; price pushback, FIX-29); deposit rule applied, reason logged, founder's slot released | Nothing in flight | Low |
| In progress | The first stage starts | Stages done: every required stage is done, or the owner skips a stage with a logged reason, which opens QC. Stop: owner PIN and a reason; the job becomes Stopped. Pause and Resume keep the state and set or clear `pausedAt` | The current stage, step, square, and set are stored on every "Done, next"; timers resume from their start stamps less paused time; "Undo last" replays the journal back one step | Highest: this is the state the app exists for. Guards below |
| Paused (In progress with `pausedAt` set) | "Pause" is tapped | "Resume" is tapped (the gap is added to `pausedMs`), or Stop | Reopens still paused with the same `pausedMs`; the wake lock is released on Pause and re-requested inside the Resume tap; read-aloud stops on Pause | Medium |
| QC | QC is opened | Deliver: QC checklist complete with a pass time stamped. Fail: back to In progress at the stage named in the failed tick; failed ticks are kept and shown; QC reopens when the rework is done | The checklist saves per tick | Medium |
| Delivered | "Deliver" is tapped with QC passed; payment recorded (policy 2: payment before keys) | The debrief is saved | Nothing in flight | Low |
| Debriefed | The debrief is saved | Terminal | Nothing in flight | Low |
| Stopped | Stop from In progress or Paused: owner PIN, reason required, audit entry written, every open stage timer ended, founder's slot released | Terminal. A debrief can still be attached (what happened, one thing to drill), and the job stays in the log. It never counts as a car | Nothing in flight | Low |
| Canceled | Cancel from Quoted, Booked, or Checked in | Terminal | Nothing in flight | Low. Releases a founder's-rate slot if one was held |

Guards, all enforced in the data layer, not only in the screen:

- Quote needs a size: "Quote" is refused with "Pick a size first" when the draft has no vehicle size; no quote record is written and `quote` stays null.
- No Delivered without QC: "Deliver" is refused unless the job is in QC with a pass time. The button does not render before that.
- QC fail is the rework path: a failed tick names the stage to return to (swirls still there, FIX-10, returns to polish). A job never passes QC on a car that was not finished.
- No polishing without a logged test spot, and no crew polishing without Level 4: the polish stage will not start until a test spot record exists (panel, combo tried from the ladder in 2.3, result). When a crew member is the one running the stage (the active profile on the shop phone is a crew profile), the stage also needs a Signed off state for that member's Level 4 skill in `skillStates`; Level 0 is never checked here. Either refusal is plain: "Log the test spot first" or "Level 4 sign-off needed. Lando runs this stage." The job keeps moving: the owner switches the active profile to himself and polishes, and the crew member runs the stages he is cleared for. Starting the polish stage under the owner profile needs the owner pass (a correct PIN within the last 5 minutes); switching the active profile to a crew profile needs no PIN. The only way past either check is an owner override: owner PIN, a reason of at least 3 characters, written to `polishOverride`, the audit log, and the job sheet (`[HOUSE]` 2026-10-10, `docs/DECISIONS.md` D11).
- Cutoff: after the job's cutoff time, "Start next square" is replaced by "Past cutoff. Finish this square, IPA it, stop." A square already running is never interrupted. The owner can move the cutoff with the PIN; the change is logged.
- Double tap on "Done, next": a second tap within about 700 ms is ignored, and the event carries the step index it expects, so a stale event is rejected. After each tap, "Undo last" shows for 5 seconds.
- Stop: needs the owner PIN and a reason. It writes the audit log, ends every open stage timer, releases a held founder's slot, and leaves the job in the log as Stopped. The knowledge base already names the reasons: paint color on the pad (FIX-09, house rule 10), clear coat failure or another walk-away finding (knowledge base 7.4), the customer taking the car mid-job. No stage is skipped to get there.
- Before photo required: the check-in screen says "A before photo is required before anything touches the car" and shows the two fixes: Settings, Safari, Camera, set to Ask or Allow; or pick a photo from the library. There is no owner override: house rule 13 says the walkaround and before photos come first. The only exits from Booked are a photo (then the rest of check-in) or Cancel.
- Personal car days: a job may stay In progress or Paused across days (knowledge base 20: split personal-car work). The Runner shows "Paused since" on the job list.

### 3.3 Business unlocks (two counters, derived from the job log, never stored by hand)

- Cars logged = jobs in Delivered or Debriefed whose vehicle is a car and whose package touches paint, plus a one-time "cars logged before this app" seed the owner sets behind the PIN (default 0). Lando's rule, 2026-10-10 `[HOUSE]`: only jobs that touch paint count; interior-only jobs never count. The precise rule, so the code and the tests agree:
  - A package touches paint when it has an exterior paint stage: wash, decon, polish, or protection. From knowledge base 15.1 that is Wash & Ceramic Wax, Full Detail (no polish), and Full Detail + One-Step Polish. Interior Only never counts. Monthly Maintenance is not sold in v1 (section 12 item 4), so no job carries it; when Lando defines it, a visit counts only if it includes a wash or protection stage.
  - The package decides; add-ons do not change the answer (an Interior Only job with pet hair or headlight refresh added still does not count). This is the architect's reading of Lando's words, `[VERIFY with Lando]` in one line at the Phase 6 gate.
  - Bikes never count, whatever the package. Stopped and Canceled jobs never count. A job that has not reached Delivered does not count yet.
  - The count is derived from the job log every time it is read, never stored by hand. Each price item carries `touchesPaint` (section 7) and the rule in section 6 reads it.
- Machine-polish jobs sold = jobs with a one-step polish line in Booked, Checked in, In progress, QC, Delivered, or Debriefed. A founder's slot is held at Booked and released by Cancel, Edit, or Stop.

| State | Enters when | Leaves when | On refresh mid-transition | Risk |
|---|---|---|---|---|
| Under 25 cars | Always at first | Cars logged reaches 25 | Derived from the log; nothing to lose | Low |
| 25 or more | Cars logged reaches 25 | Never (a restore of an older backup can drop it; the counters are recomputed after every import) | Derived | Low |
| Founder's rate, slots 1 to 5 | Always at first | The fifth machine-polish job is Booked | Derived | Medium |
| List price, slot 6 and up | The fifth machine-polish job is Booked | Never | Derived | Medium |

Guards:

- Under 25 cars, two-step correction and the mobile option on polish packages do not appear in the quote builder. At 25 they appear. Tested with a seeded log of 24 and 25.
- Two-step correction has no price anywhere in the knowledge base (15.1 lists five services and the founder's rate; 17.1 has two-step time only). So at 25 cars the line appears as "Two-step correction: quoted after the test spot" with no amount. It is a price item with unit `quote`, tagged verify internally, and it never shows in Customer View until you set a number (section 12 item 15). A `quote` item never renders a number, and the quote builder never invents one.
- Mobile polish is not a new price. At 25 cars the mobile option becomes allowed on polish packages; the price is the list price plus the $30 mobile fee plus travel at $1.50 per mile outside the zone, as knowledge base 15.1 says.
- Founder's rate: the first five machine-polish jobs quote at $275, stated as a founder's rate. The sixth quotes at list price ($425 sedan, $495 SUV or truck). The quote freezes the price. If the slots fill between Quoted and Booked, "Book" shows the change and asks the owner to re-quote or honor the founder's rate with a logged override.
- `[VERIFY with Lando]`: $275 for both sizes (knowledge base 15.1 flags it). Default in section 12 item 1.
- Academy Level 8 reads the same cars-logged counter. On a study phone, which has no job log, Level 8 stays locked with the text "Opens at 25 cars on the shop phone." On the shop phone the owner can unlock it early with the PIN; the unlock is logged.

### 3.4 Customer View

| State | Enters when | Leaves when | On refresh mid-transition | Risk |
|---|---|---|---|---|
| Off | Default | The switch is tapped on (no PIN) | Nothing in flight | Low |
| On, no customer session | The switch is tapped on and no customer screen is open. On entry the app shows the Focus reminder (below) once and stops every notification, toast, banner, and in-app alert of its own | The switch is tapped off (no PIN), or a customer screen opens | The flag is persisted, so a refresh reopens in Customer View without repeating the Focus reminder (the "shown" mark is persisted with the flag). A refresh never reveals internals | High: a leak is the failure. Handled below |
| On, customer session active | Customer View is On AND a check-in, paint report, or aftercare screen is open for a job. This is a derived condition, checked on every change of either part, not an event, so the order of taps does not matter: open the walkaround first, then tap Customer View on, and the session is active | The owner enters the PIN to switch Customer View off, or taps "End customer session" with the PIN, or the job leaves those three screens by its own transition (check-in completes, the report is closed by the job moving on) | Both flags are persisted; reopens On with the session active | High |

Customer View during a running job: with a stage running, tapping Customer View on keeps every timer running in the data layer (start stamps are untouched), replaces the Runner screen with a customer-safe job card (vehicle, package, stage name, "in progress," nothing else), and hides "Done, next," Fix It, Quick Cards, Search, and the panel readings until Customer View is off. Turning it off needs no PIN unless a customer session is active. The adversarial test asserts those four points.

The Customer density has no internal controls: the bottom row holds no Fix It, no Search, and no Quick Cards; it holds only "End customer session" (PIN). The developer panel, the device preview, the install card, and the update banner are also absent while Customer View is on.

Nothing from the phone may show while Customer View is on (Lando, 2026-10-10 `[HOUSE]`): no text previews, no job alerts; calls from Suzie can ring. A web app cannot silence other apps or the phone, so the rule has two parts:

1. The app's side, which the code enforces: while Customer View is on, the app sends no notification and renders no toast, banner, or in-app alert of its own. The update banner, the weekly backup reminder, the "Undo last" toast, the "Ready offline" marker, and any timer-ended notice are held and shown after Customer View is off. v1 has no push notifications at all (section 11), so there is nothing of the app's to mute at the system level.
2. The phone's side, which only Lando can do: the moment Customer View is switched on, the app shows a one-tap, customer-safe reminder, "Turn on your Customer Focus: Control Center, Focus," with a "Done" button. An iPhone Focus lets you pick the people and apps whose notifications come through and silences the rest; under People, "Allow Notifications From" takes chosen contacts, and the same screen has options to allow calls from certain groups of people and repeated calls. So a Focus set up once with Suzie under Allow Notifications From, no apps allowed, and Time Sensitive Notifications off lets her calls ring and keeps text previews and other alerts off the screen. Source: Apple Support, iPhone User Guide (iOS 27), "Allow or silence notifications for a Focus on iPhone," https://support.apple.com/guide/iphone/allow-or-silence-notifications-for-a-focus-iph21d43af5b/ios, and "Turn on or schedule a Focus on iPhone," https://support.apple.com/guide/iphone/turn-a-focus-on-or-off-iph5c3f5b77b/ios (both read 2026-10-10). One limit Apple states: people who message you see that notifications are silenced and "can still notify you if something is urgent"; whether that breaks through on Lando's phone, and the setting that stops it, is `[VERIFY on his phone]` at the Phase 4 gate. Setting up the Focus is a one-time step in the handoff doc (lead); the app cannot turn a Focus on or off. `docs/DECISIONS.md` D10.

How a leak is prevented: internal items are not on the page at all, so even a screen reader cannot find them. Every internal element sits inside one component, `<Internal>`, which returns nothing when Customer View is on. One file holds the mechanism, `src/core/customerView.tsx` (app-engineer): the `<Internal>` component, the `useCustomerView()` hook, and the `customerSafe(items)` filter that hands Customer View only customer-safe items with status house or confirmed sourced. The switch screen and the session rule belong to business-customer in `src/features/customer/`. An automated test (quality bar item 6, listed in 3.8) turns Customer View on, visits every screen, and fails on any element marked internal, any "unverified" badge, the literal text "[VERIFY" or "[SUPERSEDED", any price internal, any crew note, Fix It, Search, Quick Cards, the developer panel, the device preview, the install card, or the update banner. Three wrong PINs lock the switch for 30 seconds and write an audit entry.

### 3.5 App version

| State | Enters when | Leaves when | On refresh mid-transition | Risk |
|---|---|---|---|---|
| Current | Launch, with no waiting new version | A new version is reported waiting | Nothing in flight | Low |
| Update available | A new version is waiting (checked on launch and about once an hour while online) | The user taps "Update now" on the banner | The new version keeps waiting; the banner returns | Medium: the banner is suppressed while the Job Runner is open, while any stage timer is running, and in Customer View; it shows on other screens with "Update now" and "Later" |
| Updating | "Update now" is tapped and the waiting version is told to take over | The new version takes control and the app reloads at a quiet moment (not on a Job Runner screen; otherwise at the next navigation) | The job data is in the database and is untouched by the update; the page reloads into the new version and reopens the job list | Medium |
| Updated | The reload completes under the new version | "What changed" is dismissed once | Nothing in flight | Low |

Guard, an update never interrupts a running job: a new version waits until you tap "Update now," and never while a job is open. The technical setup behind that (the PWA plugin's prompt mode and the app's reload hook) is in `docs/DECISIONS.md` D1. If a second tab triggers the update (only possible in a Safari tab, not in the Home Screen app), the same deferral runs in every tab.

### 3.6 Connectivity

| State | Enters when | Leaves when | On refresh mid-transition | Risk |
|---|---|---|---|---|
| Online | The phone reports a connection | The phone reports no connection | Re-read on boot | Low |
| Offline | The phone reports no connection | A connection returns | Re-read on boot | Low in v1 |

Guard, Shop Mode behaves identically online and offline: in v1 Shop Mode, Fix It, Search, Quick Cards, and Academy make no network requests at all. The state only changes the small indicator ("Online", "Offline, ready") and, in Phase 8, a sync queue. "Ready offline" appears once the full copy of the app is saved on the phone. Tested by running a whole job with the network blocked.

### 3.7 Membership (Phase 8, outline only)

Active (sold at $89 sedan or $109 SUV per month), Paused (on request), Canceled (per the cancel policy you set in section 12 item 4), with a "next visit due" date on Active. Reminders and rebooking depend on the CRM and sync, so nothing here is built in v1.

### 3.8 Tests these maps need (the qa-adversary writes them; the expected result is written here so no test is guessed)

Unit tests (state tables, counters, bands, prices):

- Every row of 3.1 to 3.5 as a table test: from state, event, to state. Every event not in the row is refused and leaves the state unchanged.
- Draft Delete removes the row; nothing else changes. Draft Quote with no vehicle size: refused with "Pick a size first"; `quote` stays null.
- Quoted Edit: back to Draft, `quote` null, a held founder's slot released, the next Quote re-reads the counters.
- Checked in Cancel: deposit rule applied, reason stored, slot released.
- In progress Stop without the owner pass: refused. With the pass and a reason: state Stopped, every open stage timing gets an end stamp, slot released, audit entry written, the job still appears in the log, a debrief can be attached, cars logged unchanged.
- Pause then Resume: `pausedMs` grows by the gap; elapsed excludes it. Pause twice: the second is refused.
- QC Fail: state In progress, position set to the stage named in the failed tick, failed ticks kept. QC Deliver without a pass time: refused.
- Polish stage guard: with no test spot record, "start polish" is refused with "Log the test spot first." With a test spot and the active profile a crew member whose Level 4 skill is not Signed off (Locked, Learning, Practicing, Ready for sign-off, or Revoked): refused with "Level 4 sign-off needed. Lando runs this stage." The same crew member with Level 4 Signed off: allowed. A crew member with Level 0 Signed off and Level 4 not: refused (Level 0 gates nothing). The owner profile with a test spot and the owner pass: allowed. The owner profile without the pass: refused with a plain message. Override without the owner pass: refused. Override with the pass and a reason: allowed, `polishOverride` set, audit entry written. Override with the pass and an empty reason: refused.
- Seeded logs of 24 and 25 cars, and of 4 and 5 founder jobs. What counts (3.3): a Delivered Wash & Ceramic Wax, Full Detail (no polish), or Full Detail + One-Step Polish on a car counts; a Delivered Interior Only never counts, with or without add-ons; a bike never counts, whatever its package; Stopped and Canceled never count. A seeded log of 24 paint-touching cars plus 1 Delivered Interior Only reads 24 and keeps two-step and mobile polish hidden; adding one Delivered Wash & Ceramic Wax reads 25 and shows them.
- A `quote` price item (two-step) never renders a number; the mobile option on a polish package is absent under 25 cars and present at 25.
- Bands: 100, 99, 90, 89, 85, 84, 75, and 74 µm land in the right knowledge base 7.3 row. A panel at 220 µm with the others near 120 µm is flagged repaint. A panel 41 µm below the median is flagged thin; one 39 µm below is not. Readings of 0, 19, 1000, 9999, empty, "abc", and -5 are refused with "Check the gauge" and not saved. One reading saves and shows "take 3."
- Pricing: every knowledge base 15.4 example, including the mobile SUV example at $328 with travel at $1.50 per mile, plus every menu combination in knowledge base 15.1 and 12.2.

Persistence tests (quality bar item 7):

- Refresh, kill, and lock mid-stage: same step, timer right. Refresh mid-pause: still paused, same `pausedMs`.
- Fake clock moved back 10 minutes mid-stage: the timer holds at its last value, shows "Clock changed, timer held," never shows a negative or shrinking time, and resumes from the held value on the next tap. Fake clock moved forward 10 minutes: elapsed grows by 10 minutes, a countdown that ended reads "Ended while the screen was off. Check the panel," and no step advanced.
- Export on one origin (the Pages path), import on another (the root path): cars logged, founder's slots used, every job state, and the PIN hash are equal.
- Import of a crew progress file: drills and quiz attempts merged, readiness recomputed; any sign-off record in the file refused and reported. A file that marks every Level 0 to Level 4 lesson, drill, and quiz complete leaves every skill at most Ready for sign-off, never Signed off, and the polish stage stays closed to that crew member until Lando signs off Level 4 on the shop phone with his PIN.

Privacy tests (quality bar item 6): with Customer View on, on every screen, none of these exist on the page or in the accessibility tree: any element inside `<Internal>`, any "unverified" badge, the literal text "[VERIFY" or "[SUPERSEDED", any price internal (floor price math, founder's-rate logic), any crew note, Fix It, Search, Quick Cards, the developer panel, the device preview, the install card, the update banner. The Focus reminder renders on entry to Customer View, once, and carries no internal text; after it is dismissed, no toast, banner, or in-app alert of the app's own renders anywhere in Customer View (the backup reminder, the "Undo last" toast, a timer-ended notice, and the update banner are all absent and appear only after Customer View is off). Switching off during a customer session needs the PIN; without a session it does not. The session is active whether Customer View was switched on before or after the walkaround was opened.

Adversarial tests (quality bar item 8):

- Double tap "Done, next": one advance.
- Customer View toggled on with a stage running: timers keep running (start stamps unchanged); the Runner screen is replaced by the customer job card; "Done, next," Fix It, Quick Cards, Search, and the panel readings are absent until Customer View is off; off needs no PIN unless a session is active.
- Camera denied: the check-in screen shows "A before photo is required before anything touches the car" with the Settings path and the library option; Booked cannot reach Checked in without a photo; Cancel still works.
- Crew reaches the sign-off URL by hand: a locked screen; the data layer refuses the write without the owner pass; on a study phone the screen does not exist.
- Crew member without Level 4 taps "start polish" in the crew view: refused with the plain message; the job stays In progress; the owner switches the active profile to himself, enters the PIN, and the stage opens for him; the crew member still runs the stages he is cleared for.
- Storage full: the write fails with a plain message and the backup button; nothing is half-written.

## 4. Top 3 risk flags

Money and privacy risks (the public knowledge base, the shared Netlify credit pool) are covered in section 10 and in `docs/DECISIONS.md` D0 and D9. These three are where the app itself is most likely to break.

### Risk 1: data vanishes from the iPhone

What can happen: if the app is used in a Safari tab, Safari may delete everything it saved after 7 days of Safari use without a tap on the app. If the phone runs low on space, Safari may delete the app's data unless the app is installed on the Home Screen. The installed Home Screen app is exempt from the 7 day wipe and keeps its own storage, separate from Safari. Apple does not document what happens when you clear Safari data or delete the icon. The technical terms behind this are in `docs/DECISIONS.md` D3.

Handling:
- Install first, before any data (a stated default, D3). The app shows an install card whenever it is not running as a Home Screen app, with the line "leave Open as Web App turned on," and warns that data entered in a Safari tab is separate and can be wiped after 7 days of Safari use without a tap. The first job cannot be created in a Safari tab without an "I understand" that is logged.
- Ask the phone to keep the storage on every launch and show the answer in the developer panel; never make a feature depend on it.
- One-tap backup through the share sheet (JSON, photos included), a visible "last saved" and "last backup" line, and a weekly backup reminder.
- Photos compressed on the device and capped per job, so storage pressure stays far away; every write handles a full-storage error with a visible message.
- Phase 1 device test on your phone: the storage answer in the installed app, what clearing Safari data does, what deleting the icon does.

### Risk 2: the screen locks or the voice stops mid-polish

What can happen: the screen-awake feature works in Safari from iOS 16.4, but inside a Home Screen app only from iOS 18.4. It is released whenever the app is hidden. Speech needs a tap before the first word, may stop when the screen locks (no primary source answers this), and the available voices vary by phone.

Handling:
- Minimum iPhone software, a stated default: iOS 18.4 or newer, for the screen-awake feature, named in the setup card. On an older phone the app shows "Settings, Display & Brightness, Auto-Lock, Never" instead of promising to keep the screen on, and everything else still works.
- The screen-awake request is made inside the tap that starts a stage, made again when the app returns to the foreground and on the next tap, released on Pause, and shown as a small "screen stays on" marker.
- "Start voice" speaks a short real sentence inside the tap, then queues the steps as sentence-sized pieces; "done" is taken from either the end or the error event; the current step is re-read when the app returns.
- Phase 3 device test before relying on it: lock the screen mid-step and see whether speech continues. If it must survive the lock, the proven path is pre-recorded audio files played through an audio element, which does continue in a Home Screen app since iOS 15.4.
- No hidden-video hack; it is unreliable on current iOS and shows media controls on the lock screen.

### Risk 3: a job is lost or lands on the wrong step

What can happen: a refresh, an app kill, a locked phone, a double tap on "Done, next," or a phone clock change mid-job.

Handling:
- Every "Done, next" writes the new position before the screen changes; timers store start stamps, so the clock in the garage keeps running while the phone is locked and the remaining time is right on return.
- A clock moved back holds the timer and says so; a clock moved forward cannot be told apart from a locked phone, so a countdown that ended while the screen was off says so and nothing advances by itself (the rule in section 3).
- Events carry the step they expect; stale events are rejected; "Undo last" replays the journal back one step.
- QC, test spot, and Stop live in the data layer, so no screen can skip them.
- The persistence suite (refresh, kill, lock mid-job, a moved clock, a move between links) and the adversarial suite (double tap, 0 and empty readings, a reading of 9999 µm, no vehicle size, Customer View toggled mid-job, storage full, camera denied) run before every gate. The expected results are in 3.8.

## 5. Design for the four moments

| Moment | Requirement | How |
|---|---|---|
| Gloves, product on hands | 64 px targets in Shop Mode | A Shop density setting makes every target 64 px minimum and "Done, next" 96 px tall, full width, in the thumb zone. Lando's setup (2026-10-10): the phone propped on the cart at arm's length, the polisher in the right hand, the left thumb tapping; the left or right handed switch stays |
| | No critical swipes | Shop Mode has no swipe gestures at all; everything is a tap; lists scroll, nothing else responds to a drag |
| | Every action undoable instead of confirm dialogs | A journal of the last action with a 5 second "Undo last" toast; no confirm dialogs in Shop Mode |
| | Double-tap protection on "Done, next" | Second tap within about 700 ms ignored (window tuned in Phase 3) plus the stale-event rule in section 3 |
| | Read-aloud | The phone's own voice, no download; the first words must come from a tap, so a "Start voice" button starts it; the ringer mute switch may silence it `[VERIFY]`, and the UI says so |
| | Big type, high contrast | Step text from 28 to 40 px depending on the screen; contrast from the chosen look (A: 15.9:1 body text on base) |
| No signal | Offline-first app | The whole app is saved on the phone at install; a file too big to save stops the build on purpose (details in `docs/DECISIONS.md` D1) |
| | Everything for Shop Mode, Fix It, search, Quick Cards, Academy saved at install | The content and the search index are built into the app, so they are saved with it, not fetched later |
| | Fonts self-hosted | The fonts ship inside the app (five files); nothing loads from Google |
| | Visible "Ready offline" indicator | The marker shows once the full copy is saved; "Offline" shows from the phone's connection state |
| | Update prompt | A new version waits until you tap "Update now," and never while a job is open (section 3.5) |
| | iOS install | The install card tells the user to use Safari's Share, Add to Home Screen, and to leave "Open as Web App" on. iOS has no install prompt of its own, so the card is the only way |
| Customer watching | One-tap switch that cannot leak internal fields | The `<Internal>` wrapper, the data-layer filter, and the automated privacy test (section 3.4) |
| | Nothing from the phone shows | `[HOUSE]` 2026-10-10: the app sends no notification and renders no toast, banner, or alert of its own while Customer View is on, and on entry it shows a one-tap reminder to turn on an iPhone Focus set up so calls from Suzie ring and text previews and other alerts stay silent (3.4). The app cannot silence other apps; the Focus does that |
| | Clean, premium visuals, plain English | The Customer density from Direction A, Hi-Vis (picked 2026-10-10): the accent stays sparse, at most one accent element per screen; off-white, photos, and the panel-map readings carry the screen; no badges, no jargon; the word "microns" is explained before it is used |
| PC at night | Desktop reading layout | At 1024 px and up: lesson list, a reading column of 68 characters per line, numbers rail (wireframe 6.4 in the design doc). Until you have a PC again, the 1024 and 1440 px layouts are checked by Playwright screenshots in `docs/QA-REPORT.md` |
| | Keyboard shortcuts for search | `/` focuses search, `Esc` closes, arrow keys move through results |
| | Printable SOPs | A print stylesheet per SOP: one column, no navigation, step numbers, the numbers box. Printed from the phone with AirPrint until the PC is back |

Browser facts above come from the research cited in `docs/DECISIONS.md` D3 (storage), D4 (PIN), D6 (photos), D8 (clipboard), D9 (hosting), the iOS items in D1, and the iPhone Focus facts in D10 (read 2026-10-10).

## 6. Data model: runtime tables (Dexie, on the device)

Sections 6 to 8 are for the builders. Lando, skip to section 9.

Database name `masterclass`, version 1. Every record carries `id` (random UUID), `createdAt`, `updatedAt`. Money is stored in dollars exactly as the knowledge base writes it: whole dollars everywhere except travel at $1.50 per mile (knowledge base 15.1; the 15.4 mobile example is 12 x $1.50 = $18). Thickness is stored in microns. Times are stored as ISO strings in local time with the offset.

| Table | Key fields | Notes |
|---|---|---|
| `jobs` | `state` (section 3.2), `vehicle` (type car or bike; size sedan, suv, standard, bagger; make, model, color, finish gloss or matte, isTesla), `packageId`, `addOnIds`, `mobile`, `milesOutsideZone`, `quote` (frozen: lines, mobile fee, travel fee, founder's rate yes or no, deposit, balance due, total), `customer` (first name, phone, both optional in v1), `checkIn` (before photo ids, script acknowledged at, signature photo id, photo consent, damage notes), `testSpot` (panel, combo, result, logged at) or null, `polishOverride` (reason, by, at) or null, `cutoffAt`, `startedAt`, `pausedAt`, `position` (stage id, step index, square, set), `qc` (checklist ticks, failed ticks, passed at), `deliveredAt`, `paidAt`, `stoppedAt`, `stopReason`, `canceledAt` | One row per job. A Draft is stored as a DraftJob (vehicle fields optional); from Quoted on it must satisfy Job. The state machine writes here |
| `stageTimings` | `jobId`, `stageId`, `runByCrewId` (the active profile when the stage started; the polish stage guard reads it), `plannedMinutes`, `startedAt`, `endedAt`, `pausedMs`, `lastTick` (the heartbeat), `sections` (index, started at, ended at) | Feeds "ahead or behind plan," the debrief, and the Level 4 guard |
| `panelReadings` | `jobId`, `panelId`, `readings` (1 to 5 numbers, each 20 to 999 µm), `jambBaseline`, `band` (computed from the lowest reading against knowledge base 7.3), `flags` (repaint, thin), `takenAt` | Feeds the paint report and FIX-22. Rules in 2.3 |
| `jobPhotos` | `jobId`, `kind` (before, after, damage, test spot, signature), `panelId` (optional), `blob` (compressed JPEG; PNG for the signature), `width`, `height`, `bytes`, `takenAt` | Capped per job; counted in the storage readout |
| `issues` | `jobId`, `fixNodeId`, `stageId`, `note`, `at` | One tap from Fix It during a job |
| `debriefs` | `jobId`, `timePerStage`, `productsUsed`, `issueIds`, `photosTaken`, `rebookOffered`, `reviewAsked`, `drillNext`, `at` | One per job at Delivered, or attached to a Stopped job |
| `fieldNotes` | `text`, `jobId` (optional), `stageId` (optional), `status` (inbox, promoted, dismissed), `promotedTo` (type and id) | The inbox for the weekly review |
| `crewMembers` | `name`, `role` (owner, ops, crew), `active` | DJ first. On the shop phone, one profile per person; on a study phone, one profile only |
| `skillStates` | `crewId`, `skillId`, `state` (section 3.1), `lessonOpenedAt`, `drillsLogged`, `quizBestScore`, `readyAt`, `signOffId`, `revokedAt`, `prerequisiteRevoked` | Key is `crewId:skillId` |
| `signOffs` | `crewId`, `skillId`, `action` (signoff, revoke), `reason`, `ownerVerifiedAt`, `needsRecheck`, `at` | Written only with an owner pass, only on a shop phone |
| `quizAttempts` | `crewId`, `quizId`, `answers`, `score`, `passed`, `at`, `importedFrom` (optional) | Every answer saved as it is given |
| `flashcardStates` | `crewId`, `cardId`, `due`, `intervalDays`, `ease`, `reps`, `lapses`, `lastReviewedAt` | Spaced repetition (SM-2 style) |
| `settings` | `key`, `value` | Device role (shop or study), owner PIN hash and salt, PIN set date, Customer View flag and whether its Focus reminder was shown for this switch-on, active profile on the shop phone (owner by default; a crew profile when a crew member runs stages; switching to a crew profile needs no PIN, and starting the polish stage under the owner profile needs the owner pass, see 3.2), read-aloud on or off, wake lock preference, carsLoggedBefore seed, last backup at, app version seen, chosen voice language, left or right handed layout |
| `auditLog` | `type` (override, signoff, revoke, stop, customerViewOff, pinFail, pinReset, roleChange, export, import, cutoffMoved, level8Unlock), `detail`, `crewId`, `at` | Added by the architect; not in the build prompt's list, needed for the guards |

Phase 8 adds `customers`, `vehicles`, `memberships`, `reminders`, and a sync queue. Nothing in v1 holds a customer's address.

Two files leave the device: the backup (everything, photos included; D3) and the crew progress file (one crew member's drill log and quiz attempts, nothing else; imported on the shop phone, where sign-off records in it are refused).

Runtime record sketch (zod, so the same rules validate an import; the full schemas live in `src/schemas/` in Phase 1):

```ts
import { z } from "zod";

const At = z.iso.datetime({ offset: true });

export const JobState = z.enum([
  "draft", "quoted", "booked", "checkedIn", "inProgress", "qc", "delivered", "debriefed", "stopped", "canceled",
]);

export const JobEvent = z.enum([
  "QUOTE", "DELETE", "EDIT", "BOOK", "CANCEL", "CHECK_IN_DONE", "START",
  "PAUSE", "RESUME", "STAGES_DONE", "STOP", "QC_FAIL", "DELIVER", "DEBRIEF_SAVED",
]);

export const Vehicle = z.strictObject({
  type: z.enum(["car", "bike"]),
  size: z.enum(["sedan", "suv", "standard", "bagger"]),
  make: z.string().default(""),
  model: z.string().default(""),
  color: z.string().default(""),
  finish: z.enum(["gloss", "matte"]).default("gloss"),
  isTesla: z.boolean().default(false),
});

export const DraftVehicle = Vehicle.partial();               // every field optional while the job is a Draft

export const QuoteLine = z.strictObject({
  priceItemId: z.string(),
  label: z.string(),
  amount: z.number().min(0).nullable(),                      // null only for a unit "quote" item (two-step); never rendered as a number
});

export const Quote = z.strictObject({
  lines: z.array(QuoteLine).min(1),
  mobileFee: z.number().min(0),                              // 30 when mobile, else 0
  travelFee: z.number().min(0),                              // miles outside the zone x 1.50
  founderRate: z.boolean(),
  founderSlot: z.number().int().min(1).max(5).nullable(),
  carsLoggedAtQuote: z.number().int().min(0),
  deposit: z.literal(50),
  total: z.number().min(0),
  balanceDue: z.number().min(0),
  quotedAt: At,
});

export const CheckIn = z.strictObject({
  beforePhotoIds: z.array(z.uuid()).default([]),
  scriptAcknowledgedAt: At.nullable(),
  signaturePhotoId: z.uuid().nullable(),
  photoConsent: z.boolean().default(false),
  damageNotes: z.string().default(""),
  completedAt: At.nullable(),
});

export const TestSpot = z.strictObject({
  panelId: z.string(),
  combo: z.string(),                                         // "yellow + M210", "maroon + M210", "maroon + Ultimate Compound, then yellow + M210"
  result: z.enum(["swirlsGone", "stillSwirled", "tooDeep"]),
  loggedAt: At,
});

export const DraftJob = z.strictObject({
  id: z.uuid(),
  state: z.literal("draft"),
  vehicle: DraftVehicle,
  packageId: z.string().nullable(),
  addOnIds: z.array(z.string()).default([]),
  mobile: z.boolean().default(false),
  milesOutsideZone: z.number().min(0).default(0),
  customer: z.strictObject({ firstName: z.string(), phone: z.string() }).partial().nullable(),
  createdAt: At,
  updatedAt: At,
});

export const Job = z.strictObject({
  id: z.uuid(),
  state: JobState.exclude(["draft"]),
  vehicle: Vehicle,
  packageId: z.string(),
  addOnIds: z.array(z.string()).default([]),
  mobile: z.boolean().default(false),
  milesOutsideZone: z.number().min(0).default(0),
  quote: Quote,
  customer: z.strictObject({ firstName: z.string(), phone: z.string() }).partial().nullable(),
  checkIn: CheckIn.nullable(),
  testSpot: TestSpot.nullable(),
  polishOverride: z.strictObject({ reason: z.string().min(3), byCrewId: z.string(), at: At }).nullable(),
  cutoffAt: At.nullable(),
  startedAt: At.nullable(),
  pausedAt: At.nullable(),
  position: z.strictObject({ stageId: z.string(), stepIndex: z.number().int().min(0), square: z.number().int().min(0), set: z.number().int().min(0) }).nullable(),
  qc: z.strictObject({ ticks: z.record(z.string(), z.boolean()), failedTicks: z.array(z.strictObject({ tick: z.string(), returnToStageId: z.string(), at: At })).default([]), passedAt: At.nullable() }).nullable(),
  deliveredAt: At.nullable(),
  paidAt: At.nullable(),
  stoppedAt: At.nullable(),
  stopReason: z.string().min(3).nullable(),
  canceledAt: At.nullable(),
  createdAt: At,
  updatedAt: At,
});
```

The transition table is a plain object the engineer codes and the tests cover. It mirrors the 3.2 table row for row:

```ts
type JobEventName = z.infer<typeof JobEvent>;
type JobStateName = z.infer<typeof JobState>;

export const jobTransitions: Record<JobStateName, Partial<Record<JobEventName, JobStateName | "deleted">>> = {
  draft:      { QUOTE: "quoted", DELETE: "deleted" },                 // "deleted": the row is removed in the same transaction; no job is ever stored with that state
  quoted:     { BOOK: "booked", CANCEL: "canceled", EDIT: "draft" },  // EDIT discards the frozen quote and releases a held founder's slot
  booked:     { CHECK_IN_DONE: "checkedIn", CANCEL: "canceled" },
  checkedIn:  { START: "inProgress", CANCEL: "canceled" },
  inProgress: { PAUSE: "inProgress", RESUME: "inProgress", STAGES_DONE: "qc", STOP: "stopped" },   // PAUSE needs pausedAt null; RESUME needs it set
  qc:         { DELIVER: "delivered", QC_FAIL: "inProgress" },        // DELIVER refused unless qc.passedAt is set; QC_FAIL sets position to the named stage
  delivered:  { DEBRIEF_SAVED: "debriefed" },
  debriefed:  {},
  stopped:    {},                                                     // a debrief may be attached without a state change
  canceled:   {},
};
```

Guards (size present, QC passed, test spot logged or override, Level 4 for a crew profile on the polish stage, cutoff, owner pass, reason present) run before the table is consulted and return a plain-English refusal the screen shows.

How the 25-car count is derived (3.3), as a rule the engineer codes and the tests cover; nothing stores the number:

```ts
// A job counts toward 25 when it is finished, is a car, and its package touches paint.
// [HOUSE] 2026-10-10: only jobs that touch paint count; interior-only jobs never count.
// Bikes, Stopped, and Canceled never count. Add-ons never change the answer.
const finished = (j: Job) => j.state === "delivered" || j.state === "debriefed";

export const countsTowardTwentyFive = (j: Job, pkg: PriceItem): boolean =>
  finished(j) && j.vehicle.type === "car" && pkg.touchesPaint === true;

export const carsLogged = (jobs: Job[], pkgById: Map<string, PriceItem>, seed: number): number =>
  seed + jobs.filter((j) => {
    const pkg = pkgById.get(j.packageId);
    return pkg !== undefined && countsTowardTwentyFive(j, pkg);
  }).length;
```

`touchesPaint` is set per price item in content (section 7): true for Wash & Ceramic Wax, Full Detail (no polish), and Full Detail + One-Step Polish; false for Interior Only. Bike items are kept out by the vehicle check whatever their flag. The founder's-slot count is unchanged: machine-polish jobs sold (3.3).

## 7. Content model (the files under `content/`)

Content is written as files, validated at build time with zod, and compiled into one bundle the app ships with. Thirteen content types: Lesson, SOP, QuickCard, FixNode, Product, Equipment, PriceItem, Policy, Script, Drill, QuizQuestion, Flashcard, GlossaryTerm. One more file type that is not a content item: SignOffCriteria, one per skill.

Every content item carries the common fields:

```ts
import { z } from "zod";

export const Status = z.enum(["house", "sourced", "verify", "superseded"]);   // mirrors the knowledge base tags
export const Visibility = z.enum(["internal", "customer-safe"]);
export const Audience = z.enum(["owner", "ops", "crew", "customer"]);
export const ContentType = z.enum([
  "lesson", "sop", "quickcard", "fixnode", "product", "equipment", "priceitem",
  "policy", "script", "drill", "quizquestion", "flashcard", "glossaryterm",
]);

export const Source = z.strictObject({
  label: z.string().min(1),                 // "HF product page", "Knowledge base 8.3", "Lando"
  url: z.url().optional(),
  date: z.iso.date(),                       // when it was checked
  confirmedOn: z.iso.date().optional(),     // fact-checker reconfirmation; required for customer-safe sourced items
  confirmedBy: z.literal("fact-checker").optional(),
});

// One line of a fix, a step, or a number. A curator can mark one line verify or superseded instead of the whole item.
export const Line = z.union([
  z.string().min(1),
  z.strictObject({ text: z.string().min(1), status: Status.optional() }),
]);

export const Base = z.strictObject({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),   // fix-01, lesson-l4-03, price-car-full-detail-polish-sedan
  type: ContentType,
  title: z.string().min(1).max(120),
  tags: z.array(z.string()).default([]),
  synonyms: z.array(z.string()).default([]),          // the "say it" words; fed to search
  audience: z.array(Audience).min(1),
  visibility: Visibility,
  status: Status,
  sources: z.array(Source).default([]),
  version: z.number().int().min(1),
  supersedes: z.string().optional(),                  // id of the item this replaces
  related: z.array(z.string()).default([]),
  kbRef: z.string().optional(),                       // knowledge base section, "7.3"
});
```

Per-type fields (the shape that matters; the full schemas live in `src/schemas/` in Phase 1):

```ts
export const FixNode = Base.extend({
  type: z.literal("fixnode"),
  group: z.enum(["machine", "paint", "wash-dry", "clay", "protect", "glass", "interior", "gauge", "setup-time", "customer", "bike", "tesla"]),
  sayIt: z.array(z.string()).min(1),            // search words, also copied into synonyms
  stopIf: z.array(Line).default([]),            // rendered as the red STOP band, first
  checks: z.array(Line).default([]),            // 30-second checks
  causes: z.array(Line).min(1),                 // most likely first
  steps: z.array(Line).min(1),                  // numbered; a line may carry its own status
  stillHappening: z.array(Line).default([]),
  lessonId: z.string().optional(),
  productIds: z.array(z.string()).default([]),
  equipmentIds: z.array(z.string()).default([]),
});

export const Lesson = Base.extend({
  type: z.literal("lesson"),
  level: z.number().int().min(0).max(8),
  order: z.number().int().min(1),
  why: z.string().min(1),                       // markdown, the deep part
  steps: z.array(Line).min(1),
  numbers: z.array(z.strictObject({ label: z.string(), value: z.string(), kbRef: z.string().optional(), status: Status.optional() })).default([]),
  mistakes: z.array(z.string()).default([]),
  drillIds: z.array(z.string()).default([]),
  quizId: z.string().optional(),
  skillId: z.string().optional(),               // the sign-off criteria for this skill live in content/academy/signoff/<skillId>.yaml, not here
});

// Not a content item. One file per skill, written by the learning-designer. The only place a pass mark or drill minimum is written.
export const SignOffCriteria = z.strictObject({
  skillId: z.string(),
  lessonId: z.string(),
  quizId: z.string(),
  quizPassScore: z.number().min(0).max(100),
  drillMinimum: z.number().int().min(0),
  prerequisites: z.array(z.string()).default([]),   // skill ids
});

export const SOP = Base.extend({
  type: z.literal("sop"),
  stage: z.string(),                            // wheels, wash, clay, measure, test-spot, polish, protect, interior, glass, cleanup
  steps: z.array(z.strictObject({
    text: z.string(),
    status: Status.optional(),                  // one step can be marked verify without marking the whole SOP
    timer: z.strictObject({ kind: z.enum(["dwell", "section", "setup", "stage", "cure"]), seconds: z.number().int().positive() }).optional(),
    // stage: the 30 minute ceramic wax stage plan (knowledge base 17.2). cure: tire shine set time only (knowledge base 9.2); never a ceramic wax haze timer (superseded, knowledge base 9.1 and 23).
    stopIf: z.string().optional(),
    panelRoute: z.enum(["wash", "polish", "measure", "wax", "glass"]).optional(),
    quickCardId: z.string().optional(),
  })).min(1),
  plannedMinutes: z.number().int().positive().optional(),
  vehicleBranch: z.enum(["any", "tesla", "bike"]).default("any"),
});

export const QuickCard = Base.extend({
  type: z.literal("quickcard"),
  kind: z.enum(["mix", "settings", "table", "list", "stop"]),
  rows: z.array(z.strictObject({ label: z.string(), value: z.string(), status: Status.optional() })).min(1),
});

export const Product = Base.extend({
  type: z.literal("product"),
  brand: z.string(),
  jobs: z.array(z.string()).min(1),
  dilutions: z.array(z.strictObject({ use: z.string(), ratio: z.string(), status: Status })).default([]),
  neverFor: z.array(z.string()).default([]),
  labelNotes: z.string().optional(),
});

export const Equipment = Base.extend({
  type: z.literal("equipment"),
  model: z.string().optional(),
  specs: z.array(z.strictObject({ label: z.string(), value: z.string(), status: Status })).default([]),
  checks: z.array(z.string()).default([]),
  neverOnPaint: z.boolean().default(false),
});

export const PriceItem = Base.extend({
  type: z.literal("priceitem"),
  kind: z.enum(["service", "addon", "fee", "deposit", "plan"]),
  vehicle: z.enum(["sedan", "suv", "standard", "bagger", "any"]),
  amount: z.number().min(0).optional(),        // dollars exactly as knowledge base 15 and 12.2 write them: whole dollars everywhere except travel at 1.50 per mile
  unit: z.enum(["flat", "per-mile", "per-pair", "from", "per-month", "quote"]),   // "quote": no amount exists yet (two-step correction); renders "quoted after the test spot," never a number
  founderRate: z.strictObject({ amount: z.literal(275), slots: z.literal(5) }).optional(),
  unlockAtCars: z.literal(25).optional(),
  mobileOnly: z.boolean().default(false),
  dropOffOnly: z.boolean().default(false),
  touchesPaint: z.boolean().default(false),   // service packages: true when the package has an exterior paint stage (wash, decon, polish, protection); drives the 25-car count (3.3). [HOUSE] 2026-10-10
}).refine(
  (p) => (p.unit === "quote" ? p.amount === undefined : p.amount !== undefined),
  { error: "amount is required unless unit is quote, and forbidden when it is" },
);

export const Policy = Base.extend({ type: z.literal("policy"), order: z.number().int(), text: z.string(), sayOutLoud: z.boolean() });
export const Script = Base.extend({ type: z.literal("script"), when: z.enum(["booking", "walkaround", "pickup", "damage"]), text: z.string(), acknowledgment: z.string().optional() });
export const Drill = Base.extend({ type: z.literal("drill"), needs: z.array(z.string()), instructions: z.array(z.string()).min(1), logField: z.strictObject({ label: z.string(), unit: z.string() }).optional(), minimumReps: z.number().int().min(1) });
export const QuizQuestion = Base.extend({ type: z.literal("quizquestion"), quizId: z.string(), prompt: z.string(), choices: z.array(z.string()).min(2), correctIndex: z.number().int().min(0), explanation: z.string(), scenario: z.boolean().default(true) });
export const Flashcard = Base.extend({ type: z.literal("flashcard"), deck: z.string(), front: z.string(), back: z.string() });
export const GlossaryTerm = Base.extend({ type: z.literal("glossaryterm"), term: z.string(), definition: z.string(), alsoCalled: z.array(z.string()).default([]) });
```

Rendering rules, coded once in the data layer and tested:

- Customer View renders only items with `visibility: customer-safe` AND (`status: house` OR `status: sourced` with a `confirmedOn` date from the fact-checker). The filter is `customerSafe(items)` in `src/core/customerView.tsx`.
- `superseded` items never render anywhere. They stay in the files so the supersession chain is visible. A line with `status: superseded` never renders either.
- `verify` items render internally with a visible "unverified" badge and never in Customer View. A single line with `status: verify` renders internally with the badge on that line.
- A price item with unit `quote` never renders a number anywhere. It renders "quoted after the test spot."
- Every number shown to a customer comes from an item that passes the first rule, so it has a source or is a house policy.
- `audience` filters the Academy and Business rooms by role (owner, ops, crew). Customer View ignores `audience` and uses only the first rule.

Build-time validation (the build fails, with the file and field named):

- Any item that fails its schema.
- A duplicate `id`.
- A `related`, `supersedes`, `lessonId`, `quizId`, `drillIds`, `productIds`, `equipmentIds`, or `skillId` reference to an id that does not exist.
- A `verify` item marked `customer-safe`.
- A `customer-safe` item whose string fields contain the literal text "[VERIFY" or "[SUPERSEDED" anywhere (knowledge base 7.3, FIX-01, and FIX-15 carry such notes inside otherwise house text).
- A `customer-safe` item with any line, row, number, or step whose own `status` is `verify` or `superseded`.
- A `customer-safe` `sourced` item without `confirmedOn`.
- A `superseded` item that nothing supersedes (a dangling old version).
- A price item with unit `quote` that carries an amount, or with any other unit that lacks one.
- A lesson with a `skillId` and no `content/academy/signoff/<skillId>.yaml`, or a sign-off file whose `skillId` no lesson names, or whose `lessonId` or `quizId` does not exist.
- A search test case whose expected top result is not returned. The set is the 43 cases in knowledge base section 24, expanded by the troubleshooter to 45 or more per `BUILD_PROMPT.md` section 8.

File formats: Markdown with YAML front matter for prose types (Lesson, SOP, FixNode, Policy, Script, Drill); YAML for table types (Product, Equipment, PriceItem, QuickCard, Flashcard, QuizQuestion, GlossaryTerm) and for SignOffCriteria. One item per file, file name equals `id`.

## 8. File tree with owners (summary; the full tree is `docs/OWNERSHIP.md`)

```
masterclass/
  CLAUDE.md  BUILD_PROMPT.md  START_HERE.md        lead
  .gitignore  .nvmrc  package.json  package-lock.json  vite.config.ts  tsconfig.json  netlify.toml  index.html
                                                   app-engineer (lead approves changes to the config files)
  docs/                                            per file, see OWNERSHIP.md
  knowledge/KNOWLEDGE_BASE.md                      lead, edits only with Lando
  knowledge/verification-log.md                    fact-checker
  reference/                                       frozen, lead
  content/lessons/ sops/ cards/ products/ glossary/ content-curator
  content/fixit/  content/search/                  troubleshooter
  content/academy/ (drills, quizzes, flashcards, signoff)   learning-designer
  content/business/  content/customer/             business-customer
  public/fonts/                                    ui-designer
  public/icons/  public/404.html                   app-engineer
  scripts/content/                                 app-engineer (the content build and validation)
  src/schemas/                                     architect
  src/design/  src/components/ui/                  ui-designer
  src/app/  src/core/ (includes customerView.tsx)  src/generated/   app-engineer
  src/features/fixit/ jobrunner/ cards/ search/ academy/ settings/   app-engineer
  src/features/business/  src/features/customer/   business-customer
  tests/search-cases.*                             troubleshooter
  tests/ (everything else)                         qa-adversary
```

Three files outside `masterclass/`, all need Lando's "repo OK" and are edited by the lead only: `.vercelignore` (keeps the kit out of the Aurigen Vercel site; added in the Phase 0 pull request), `.github/workflows/masterclass-pages.yml` (the phone-test deploy), and `.github/workflows/masterclass-netlify.yml` (the Netlify publish button, 10.4). If `.vercelignore` does not hold on the Aurigen site, a fourth root file, `vercel.json`, with one 404 rule for `/masterclass/` joins the list under the same OK (D0). Nothing else outside `masterclass/` is touched. `.claude/agents/` is never touched.

One repo fact to know: the root `.gitignore` ignores `package-lock.json` at any depth, so `masterclass/.gitignore` must contain `!package-lock.json` or the lockfile silently never gets committed.

## 9. Phase plan

Estimates are ranges. A session is roughly 2 to 4 hours of agent work. "Lando" is your own phone time at the gate. Every gate stops until you say go.

| Phase | What gets built | Sessions | Lando at the gate | What you will see |
|---|---|---|---|---|
| 0 Intake and blueprint | This file, the ADRs, ownership, the two looks, the decisions list, and `docs/STATUS.md` (the status board, written by the lead) | Done | 20 to 30 min to read section 12 and pick a look | Documents only |
| 1 Foundation | Scaffold, PWA shell, routing, three density shells, content pipeline with validation, tokens and base components, fonts, offline indicator, update banner, developer panel, device preview, install card, storage probe, device role (shop or study) | 2 to 3 | 15 min: open the Pages URL in Safari, Add to Home Screen, open it, airplane mode, reload, then run the 9 item device checklist below | A dark shell in your chosen look with placeholder rooms, "Ready offline," and a developer panel that reports storage, wake lock, speech voices, share sheet |
| 2 Content | Every knowledge base section converted, Fix It at 33 or more entries, Levels 0 to 4, synonyms, 45 or more search cases, fact-check pass | 3 to 4 | 30 to 45 min: read only the facts the fact-checker changed or could not confirm, answer yes or no on each | A list of changed facts, not the app |
| 3 Shop Mode | Fix It UI, search UI, Job Runner, Quick Cards, gauge entry with bands, read-aloud, hands-busy mode, setup timer, cutoff, test spot gate, Stop, Pause, persistence | 4 to 6 | One real wash plus one polished panel in the garage in airplane mode, on the Pages install (your normal work time, plus 15 min of friction notes). Then the first Netlify publish as a production check, after you confirm the credit balance (10.6) | The app running your job, the jerking-polisher fix in two taps or one word, read aloud, with no signal; the same build on the Netlify URL, installed with a test record only |
| 4 Customer View and business basics | Check-in with signature and consent, paint report, menu, pricing calculator, policies script, aftercare share, review QR, privacy filter and its automated test | 3 to 4 | 30 min: a mock walkaround with Suzie or DJ as the customer, on the Pages install | The customer-facing screens, the paint report from your Model Y readings, the aftercare card in the share sheet |
| 5 Academy | Lesson reader, drills log, quizzes, flashcards, crew profiles, owner PIN sign-off, skill gates, Share my progress, printable SOPs, desktop reading view | 3 to 4 | DJ: 45 min to finish Level 0 on his own phone (Pages link, set as a study phone) and tap Share my progress. You: 10 min to import it on the shop phone and sign off one skill with your PIN while you watch him do it (his phone unlocks nothing by itself; the sign-off is yours, on the shop phone). Print one SOP from your phone (Share, Print, AirPrint). Netlify publish optional here (10.7) | DJ's Level 0 skill signed off on the shop phone; the SOP printed from your phone with AirPrint (or from the PC later); the 1024 and 1440 px layouts as Playwright screenshots in `docs/QA-REPORT.md` until you have a PC again |
| 6 Mastery Engine | Job log, debrief, dashboard, Field Notes inbox, weekly review, SOP versioning, auto-assigned drills, export and import, backup reminder | 3 to 4 | Two real jobs logged on the shop phone's Pages install (your work time) plus 15 min for one weekly review and one backup through the share sheet | The dashboard with two jobs, cars logged toward 25, and a backup file in Files or Mail |
| 7 Hardening | The full quality bar, device matrix, Lighthouse, fixes, v1.0 publish, handoff docs | 2 to 3 | 30 min: the handoff walkthrough on your phone, confirm the credit balance before and after the v1.0 publish, then the one data move (Backup on the Pages install, install the Netlify URL, Import, confirm the counters, delete the old icon; DJ's phone does the same) | v1.0 on the Netlify URL with your real data, HANDOFF.md, HOW-TO-ADD.md |
| Total v1 | | 20 to 28 sessions | About 3 to 4 hours of your time outside your normal jobs | |

First real job in the app (Lando, 2026-10-10): the next family car, no firm date yet. Until Phase 3 lands, the Model Y job sheet in `reference/tonight-model-y-job-sheet.html` is the stopgap; `reference/` is frozen, so nothing in it changes.

Phase 1 device checklist (10 minutes, on your iPhone, from the installed app; each answer closes a `[VERIFY]` from the research):

1. Which iOS version the phone runs (Settings, General, About). The screen-awake feature inside a Home Screen app needs 18.4 or newer.
2. What the developer panel shows for "storage kept" (the two values it reports).
3. Tap "Test voice," then lock the screen: does the voice keep going?
4. Tap "Test share" for a PNG, a PDF, and a JSON file: which apps appear in the share sheet?
5. Which voices the panel lists, and whether the default English voice sounds acceptable.
6. Turn on Low Power Mode and start a test stage: does the screen stay on?
7. Do 7, 8, and 9 last, with a test record only, never a real job. Item 7 signs you out of every website in Safari. Clear Safari history and website data, reopen the installed app: is the test record still there?
8. Create a new test record in the installed app.
9. Delete the icon, reinstall from the same URL: is the test record from item 8 still there?

## 10. Deploy and testing plan for a phone-only owner

### 10.1 The short version

- Phases 1 to 6: test on GitHub Pages. 0 Netlify credits. Free because the repo is public.
- Your real data in v1 lives on one install at a time. From Phase 3 to Phase 6 the Pages install on the shop phone carries the newest build and your real jobs. Netlify gets one publish at the Phase 3 gate as a production check (a test record only, to prove install, headers, and the root path) and the v1.0 publish at Phase 7.
- Data never moves between links by itself: each link has its own storage. Every move between links is: Backup (share sheet), install the new link, Import, confirm the cars-logged count and the founder's slots, then delete the old icon. One move is planned, at v1.0. DJ's study phone makes the same move at v1.0. A persistence test proves it (3.8).
- If you want real jobs on the Netlify link before v1.0, say so: every later gate that needs a newer build on Netlify then costs 15 credits (the optional Phase 5 publish in 10.7).
- Nothing gets connected until you approve it. Phase 0 connects nothing.

### 10.2 Do Netlify Deploy Previews and branch deploys cost credits?

No. Netlify's docs list "Deploy Previews or branch deploys" at 0 credits and say "each successful production deploy consumes 15 credits during that month's billing cycle." Failed deploys and rollbacks also cost 0. Netlify's knowledge base says a plain `netlify deploy` (a draft deploy) is free and only `netlify deploy --prod` costs 15.
Sources, read 2026-10-07 and 2026-10-08: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/ and https://www.netlify.com/knowledge-base/publish-and-update-sites-with-the-netlify-cli
Two cautions: (1) traffic to any URL is metered at 2 credits per 10,000 requests and 20 credits per GB, which is a fraction of a credit for one phone; (2) Deploy Previews need a Git-linked site, and our site will not be Git-linked, so we use draft deploys instead, which are free by the same rule.

### 10.3 Primary path: GitHub Pages (0 credits)

Why: the repo is public, so Pages and Actions are free; HTTPS is automatic on github.io, which the offline copy and Add to Home Screen need; no token of any kind is needed in the cloud VM.
URL: https://landocommandoz.github.io/aurigen-directory/
Your one-time taps (about 30 seconds): Safari, github.com/landoCommandoz/aurigen-directory, Settings (tap the dropdown if Settings is hidden; if the page looks cut down, tap aA then Request Desktop Website), Pages, Build and deployment, Source, GitHub Actions. `[VERIFY]`: whether iPhone Safari shows the Settings and Pages screens is not documented by GitHub. It is the first thing to try. If Safari cannot reach the Pages setting even after Request Desktop Website, use 10.4.
Optional second one-time step, so you can test a phase before its pull request is merged: Settings, Environments, github-pages, Deployment branches and tags, Add deployment branch or tag rule, type `masterclass/*`, save. Without it, GitHub may refuse deploys from any branch but main; we try one run first and add the rule only if it is refused.
Your taps at every gate: tap the URL, Share, Add to Home Screen (leave "Open as Web App" on), open it from the Home Screen, turn on Airplane Mode, reload.
The lead's steps from the VM: add `.github/workflows/masterclass-pages.yml` (needs your OK) that builds `masterclass/` on pushes to main and `masterclass/**` branches when files under `masterclass/` change; set the Vite base to `/aurigen-directory/`; set the manifest start and scope to the same path; register the offline helper at the base path; ship a `404.html` that boots the app; push; watch the Actions run; send you the URL.
Known traps: a blank page means the base path is wrong; a refresh on a deep link needs the `404.html`; Pages may cache for about 10 minutes `[VERIFY]`; the URL is public, so no customer data or secrets ever go in a test build, and you should be comfortable that the app's content (the same knowledge base that is already public on GitHub, minus the market research removed on 2026-10-10) is viewable there during development. The data you enter is on your phone, not on the URL. GitHub's rules allow a test or project site and forbid running a business storefront on Pages, so Pages is the test host, never the customer-facing host.

### 10.4 Netlify from your phone, through GitHub (the runner-up test path and the only publish path)

The VM has no Netlify token and never will. A GitHub Actions secret is only visible inside a workflow run on GitHub's own machines; it never reaches this VM (checked 2026-10-08: no Netlify, Vercel, or Cloudflare variable exists here). So the lead cannot run `netlify deploy` from the VM, and nothing in this plan asks for that. Instead, a third root file, `.github/workflows/masterclass-netlify.yml`, runs the Netlify CLI on GitHub, and only when a person taps "Run workflow" (`workflow_dispatch` only, never on push).

What the workflow does: one input, `action`, with three choices: `draft` (the default), `production`, `create-site`. It checks out the repo, runs `npm ci` and `npm run build` in `masterclass/`, then:
- `create-site`: `netlify sites:create --name <name> --disable-linking` (a blank project with no Git link, 0 credits). The run log prints the project id.
- `draft`: `netlify deploy --dir masterclass/dist --no-build --alias masterclass-test` (0 credits). The run log prints the draft URL, https://masterclass-test--<site>.netlify.app, at the root path.
- `production`: `netlify deploy --prod --dir masterclass/dist --no-build` (15 credits).
It reads two secrets: `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` (the CLI's `--site` also accepts the project name, so the name works there too). The secrets are redacted from the log.

Your taps, once, at the Phase 3 gate, not before:
1. Token: app.netlify.com, avatar, User settings, Applications, Personal access tokens, New access token, name it `masterclass-actions`, pick an expiration date that reaches past Phase 7 (the lead tells you the date; Netlify's page only says "select an expiration date"), Generate token, copy it.
2. GitHub: the repo, Settings, Secrets and variables, Actions, New repository secret, name `NETLIFY_AUTH_TOKEN`, paste, Add secret. One rule for the token: always as a GitHub Actions secret, never in chat.
3. Actions tab, "Masterclass Netlify" in the left list, Run workflow, branch `main`, action `create-site`, Run workflow. Open the finished run and copy the project id from the log.
4. New repository secret `NETLIFY_SITE_ID`, paste the id.

Rules: every production publish is your own tap (Actions, Run workflow, action `production`). The lead never triggers `production`. The lead may trigger a `draft` run for you from the VM only if the VM can reach the Actions API `[VERIFY]`; otherwise you tap that too. The "Run workflow" button appears only once the workflow file is on `main`, so the file lands with the Pages workflow in the Phase 1 pull request and does nothing until the secrets exist. Whether mobile Safari shows "Run workflow" is `[VERIFY]`; if the button is missing, tap aA, Request Desktop Website.

Visibility caution, checked 2026-10-08: Netlify's current rules say private projects need a Netlify login to view; previews and branch deploys stay private unless the preview setting is changed; teams created on or after July 28, 2026 start new projects Private; and "Make public is available once your project has at least one successful production deploy." So before counting on a draft URL, you, on your phone: app.netlify.com, your team, Team settings, General, Visitor access, Default project visibility. Tell the lead what it says. If it says Private, a draft URL asks you to log in to Netlify on your phone, and the project cannot be made public until the first 15-credit publish. In that case the free phone path is GitHub Pages only, and the draft at the Phase 3 gate is a lead-side smoke test read from the run log, not a link you tap. Whether draft deploys follow the preview rule is not stated on Netlify's page, `[VERIFY]`. Source: https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/ (read 2026-10-08).

### 10.5 Emergency path: anonymous Netlify deploy (0 credits, no token)

`netlify deploy --allow-anonymous --dir masterclass/dist --no-build` gives a live URL for one hour with no account. Good for one quick check. The URL changes every time, so installs and caches do not carry over. Do not claim it unless you want a new project on your team.

### 10.6 Production: Netlify, first publish at the Phase 3 gate

0. You, on your phone, once: the token and the two secrets (10.4, steps 1 to 4).
1. You read the credit balance: app.netlify.com, your team, Usage & billing. The number of available credits is at the top. Tell the lead.
2. You, on your phone: Actions, Masterclass Netlify, Run workflow, action `draft`. Open the run log and tap the draft URL. (If your team default is Private, the lead reads the log instead; see 10.4.)
3. On your "go": the same button with action `production` (15 credits). Your tap, nobody else's.
4. You, on your phone: app.netlify.com, the project, Project configuration, General, Visitor access, set Project visibility to Public. The option is offered after this first publish. Without it, Safari hits a Netlify login and Add to Home Screen breaks.
5. You read the balance again and tell the lead; the lead records both numbers in `docs/STATUS.md`. Every production publish follows this same sequence.

Never tap "Fix with agent" in the Netlify UI; it burns AI inference and compute credits. "Why did it fail?" is free.

### 10.7 Credit budget

| Phase | Production publishes | Credits | Note |
|---|---|---|---|
| 0 | 0 | 0 | Nothing connected |
| 1 | 0 | 0 | GitHub Pages |
| 2 | 0 | 0 | No app change to deploy |
| 3 | 1 | 15 | Production check after the friction fixes; test record only |
| 4 | 0 | 0 | Tested on Pages |
| 5 | 0 planned | 0 | Optional: 15 from the reserve, only if you want real jobs on the Netlify link before v1.0 |
| 6 | 0 | 0 | Tested on Pages |
| 7 | 1 | 15 | v1.0 and the one data move |
| Reserve | 3 | 45 | Two hotfixes after v1.0, plus the optional Phase 5 publish |
| Traffic, all phases | | under 5 (estimate) | 2 credits per 10,000 requests, 20 credits per GB, one phone |
| Total | 2 planned, 5 at most | 30 planned, 75 at most, plus traffic | |

Cost per production publish: 15 credits. Source: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/ (read 2026-10-07 and 2026-10-08).
Starting balance: 864 credits on Aug 23, 2026, from your note. Netlify resets monthly plan credits at the start of each billing cycle. Unused monthly credits do not roll over, except on Pro plans with 5,000 or more monthly credits, where they carry forward for one extra month. Plan credits: Free 300 credits a month with a hard limit, Personal 1,000 credits ($9 a month), Pro from 3,000 credits ($20 a month). 864 is not one of those, so part of it may be a credit pack (no expiry) or a promotion (usually expires). Sources: the page above and https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ (read 2026-10-08).
Today's balance and the plan name are `[VERIFY]`. You, on your phone: app.netlify.com, your team, Usage & billing. Send the lead the number at the top and the plan name shown there.
Shared pool warning: every site on your Netlify team draws from one balance. At zero, every site on the team is paused with a "Site not available" page and no production deploy is possible. On a Free plan there is no way to buy more; you wait for the next cycle or upgrade.
Other Netlify use from this repo: the Aurigen local-biz pipeline (`pipeline/local-biz/deployer.js`) creates and deploys Netlify sites through the API with its own key, and `.github/workflows/scrape.yml` calls a Netlify-hosted scraper URL on a schedule (Sunday and Wednesday). Each pipeline site deploy is a production deploy from the same team pool, and the scraper runs on a Netlify site that already exists under some name. That is the likely reason 864 is the last known figure, and the balance can drop between gates with no masterclass publish at all. Before the first masterclass publish, you, on your phone: app.netlify.com, your team, Projects. Send the lead the list of project names. The pipeline is not run on a publish day. If one of those projects is Git-linked to main, every merge would also cost it 15 credits until its `netlify.toml` gets an ignore command; the root `netlify.toml` is not touched otherwise. https://aurigen-directory.netlify.app/ itself returns Netlify's "site not found" page (checked 2026-10-07 and 2026-10-08), so the site has another name.

### 10.8 Rejected paths, in one line each

Netlify Drop: drag and drop of a folder, no phone path, and by Netlify's definition a production deploy; cost `[VERIFY]`, Netlify's docs do not state it. Vercel Hobby: the fair-use terms restrict Hobby to non-commercial use, and this app serves a business. A temporary tunnel from the VM (the build prompt's example): the VM is ephemeral and the tunnel dies with the session, so the URL would never survive to your next test. Cloudflare Workers: fine and free, but it needs another token you would create on your phone; kept as a fallback. Surge, Firebase, Render: more credentials for no gain.

## 11. What v1 deliberately leaves out

- Built-in AI. "Copy for Claude" instead (D8). No API spend in v1.
- Accounts, logins, roles enforced by a server, sync between your phone, the iPad, and DJ's phone. The shop phone holds the jobs and the crew records; a study phone holds one person's Academy progress; backups and progress files move data by hand (D3, D4). Phase 8.
- CRM: customers, vehicles, job history across visits, memberships, rebook reminders. Phase 8. In v1 a job holds a first name and phone at most.
- Cloud photo storage. Photos live on the device, compressed, and travel in backups (D6).
- Push notifications. Reminders in v1 are on-screen only, and none of them shows while Customer View is on (3.4).
- Academy Levels 5 to 8 as full lessons. They are outlined; Level 8 unlocks at 25 cars either way (3.3).
- The two-step correction workflow in the Job Runner beyond the unlock rule. The unlock is coded; the line has no price until you set one (section 12 item 15); the full two-step run plan is written when the first two-step is sold.
- A public marketing page. If one is ever wanted it is a separate build with zero private content (D5).
- Spanish. The content model does not block it; nothing is translated in v1.
- Payments, invoices, deposits taken in the app. Money is recorded, not collected.
- A pressure washer or foam cannon path in the wash SOP. The current SOP is hose only, as the knowledge base states.
- Automated review requests or texting. The QR code and the aftercare share are the v1 limit.
- Real security. A client-side PIN is a fence, not a lock (D4).

## 12. Decisions needed (all taken 2026-10-10)

Taken. On 2026-10-10 Lando accepted items 1 to 16 ("Defaults OK for 1 to 16") with his edits to items 9 and 14, written below as his decisions, and accepted item 13 ("Repo OK"; the two Phase 1 workflow files approved under the same OK). Every item is now `[HOUSE]`. The list stays here so the defaults he took are on record. Nothing is invented: where the knowledge base has no number, the item stays off every customer-facing screen until he sets it.

From knowledge base section 25:

1. Founder's rate $275: same for sedan and SUV? Default: yes, $275 for both sizes.
2. Smoke odor fee amount? Default: none set; the app shows "quoted on inspection" and never a number.
3. Does Suzie book jobs or manage customers? Default: yes, add an Ops role that sees bookings, prices, policies, and the job log, but not sign-offs, pricing internals (floor price math, founder's-rate logic), or developer tools.
4. Monthly Maintenance: what is included, how often, how it cancels? Default: hold the $89 and $109 prices; the plan shows in Customer View only as "ask us" until you define it; it stays `[VERIFY]` internally.
5. Final brand name and colors, or keep "Lando's Detailing" for now? Default: keep "Lando's Detailing" in the config file; the accent of the look you pick becomes the brand color.
6. Is DJ paid? Default: treat as unpaid family help in v1; the section 19 business checklist shows in the Business room either way.
7. Insurance status for customer vehicles? Default: unknown; the walk-away rule "any car worth more than your insurance covers" stays internal with an "unverified" badge.
8. What are Blazin' Banana and Tuff Stuff used for? Default: both stay `[VERIFY]` and appear on no checklist or card until you say.
9. Which HF pads arrived (colors)? Lando's decision, 2026-10-10: the pad ladder is yellow + M210, then maroon + M210, then maroon + Ultimate Compound followed by yellow + M210. Black is a wax and finishing pad only and never appears in the ladder. Pads on hand: Uro-Tec yellow x3, maroon x2, HF finishing pads (colors unconfirmed), one black pad. This matches knowledge base 8.5 and 3.2; the earlier default here was wrong to list black in the ladder. The HF finishing pad colors stay `[VERIFY]` and appear on no card until confirmed.
10. Which inspection light do you use? Default: the app says "a light held low," names no model.
11. Photo consent default off until the customer says yes? Default: yes, off.
12. Home shop address only in booking confirmations? Default: yes; in v1 the address is not in the app at all and never in the repo.

Repo layout:

13. Where the code lives. Accepted 2026-10-10, "Repo OK": stay in this Aurigen repo under `masterclass/`. `.vercelignore` is at the repo root and was verified on the production site on 2026-10-10: every `/masterclass/` path on https://aurigen-directory.vercel.app/ returns 404 while Aurigen's own files still return 200, so the `vercel.json` fallback is not needed. The two Phase 1 workflow files, `.github/workflows/masterclass-pages.yml` (the free phone-test deploy) and `.github/workflows/masterclass-netlify.yml` (the Netlify publish button you tap), are approved under the same OK and land in the Phase 1 pull request, written by the lead. The knowledge base stays readable on GitHub minus section 15.5 (market research), removed on 2026-10-10 at Lando's request (D0). The alternative, a new private repo, was not taken.

The architect's items:

14. What counts toward the 25-car unlock and the five founder's-rate slots. Lando's decision, 2026-10-10: only jobs that touch paint count toward 25; interior-only jobs never count. In full: a car counts when its job reaches Delivered and its package has an exterior paint stage (wash, decon, polish, or protection), which from knowledge base 15.1 means Wash & Ceramic Wax, Full Detail (no polish), and Full Detail + One-Step Polish; Interior Only never counts; bikes never count; Stopped and Canceled jobs never count (3.3 has the precise rule and section 6 the code). The rest of the default stands: a founder's slot is held when a machine-polish job is Booked and released if that job is Canceled, Edited back to Draft, or Stopped; cars you logged before the app start at 0 and you can set the number behind the PIN. Crew profiles, skill states, and sign-offs live on the shop phone (yours), the same phone as the jobs; DJ's phone is a study phone that sends its progress to yours as a file (3.1).
15. Two-step correction price per size? Default: no number yet. At 25 cars the line appears as "Two-step correction: quoted after the test spot" with no amount, tagged verify internally, and never in Customer View until you set it. Mobile polish is not a new price: list price plus the $30 mobile fee plus travel.
16. Thin-panel flag: how far below the rest of the car counts as thin? Default: more than 40 µm below the median of the other measured panels (a proposal; knowledge base 7.3 says "way below the rest" with no number). Repaint stays at 220 µm or more, as 7.3 says.

Defaults already stated in the body, so they are not questions: install before data (section 4, risk 1), iOS 18.4 minimum (section 4, risk 2), the review QR hidden until a link is set (section 2.5), a revoke means the quiz is retaken (section 3.1).

Both were said on 2026-10-10: "Defaults OK for 1 to 16" with the two edits above, and "Repo OK." Of the four design questions in `docs/DESIGN-DIRECTIONS.md` section 8, question 3 is item 5 here and question 4 is item 10. Questions 1 and 2 were answered the same day: while polishing, the phone is propped on the cart at arm's length; the polisher is in the right hand and the left thumb taps; the left or right handed switch stays. The look: A, Hi-Vis, with the accent kept sparse in Customer View. The ui-designer records the design side in that file.

## 13. Sources

Every browser, hosting, pricing, and library fact in this file is cited with its URL and access date in `docs/DECISIONS.md` under the decision it supports. The main ones:

- Netlify credits, deploy types, balance, reset and rollover, pause rule: Netlify Docs, How credits work; Credit-based pricing plans; Billing FAQ; Monitor usage (read 2026-10-07 and 2026-10-08).
- Netlify CLI draft and production deploys, `--site` by name or id, `sites:create`: Netlify Knowledge Base, Publish and update sites with the Netlify CLI; https://cli.netlify.com/commands/deploy; https://cli.netlify.com/commands/sites (read 2026-10-08).
- Netlify personal access tokens and the `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` variables: https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/ (read 2026-10-08).
- Netlify project visibility, Private default for new teams, Make public after one production deploy: https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/ (read 2026-10-08).
- GitHub `workflow_dispatch` (file must be on the default branch; inputs; Run workflow button): https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows and https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow (read 2026-10-08). Secrets: https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions (read 2026-10-08).
- GitHub Pages cost, limits, workflow, settings taps: GitHub Docs, GitHub's plans; GitHub Pages limits; Using custom workflows with GitHub Pages; Configuring a publishing source (read 2026-10-07).
- Vercel `.vercelignore` and the `vercel.json` 404 route: https://vercel.com/docs/deployments/vercel-ignore (last updated 2025-03-12), https://vercel.com/guides/prevent-uploading-sourcepaths-with-vercelignore, https://vercel.com/docs/builds/build-features, https://vercel.com/docs/project-configuration/vercel-json (all read 2026-10-08).
- iPhone storage: WebKit, Tracking Prevention Policy; Full Third-Party Cookie Blocking and More (2020); Updates to Storage Policy (2023); WebKit bugs 232302, 256817 (read 2026-10-07).
- Wake Lock: Apple Safari 16.4 and 18.4 release notes; WebKit bug 254545 (read 2026-10-07).
- Speech: WebKit bug 223473 and the current WebKit source (read 2026-10-07).
- Web Share with files: Apple Safari 15 release notes (read 2026-10-07).
- iPhone Focus (allow chosen people and apps, calls from groups of people, Control Center): Apple Support, iPhone User Guide for iOS 27, "Allow or silence notifications for a Focus on iPhone" and "Turn on or schedule a Focus on iPhone" (read 2026-10-10); cited in 3.4 and in `docs/DECISIONS.md` D10.
- Stack versions: the npm registry and each project's docs (read 2026-10-07).
- Claude Code nested CLAUDE.md and agent discovery: Claude Code docs, memory and sub-agents pages (read 2026-10-08).
