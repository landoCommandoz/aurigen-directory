# Curriculum: the Academy plan in plain English

Owner: learning-designer. Written 2026-10-11 (Phase 2). Updated 2026-10-11 after the fact-check merge (FC-26 to FC-115). The lesson files in `content/lessons/` (content-curator) follow the ids, levels, and orders below. Drills, quizzes, flashcards, and sign-off criteria live in `content/academy/` (learning-designer). Facts come only from `knowledge/KNOWLEDGE_BASE.md` and the fact-checker's `knowledge/verification-log.md`.

## Read this first (Lando, on your phone)

- Five levels are complete: 0 to 4. Levels 5 to 8 are outlined at the bottom of this file.
- Every lesson has one drill you can watch and one short quiz. The last lesson of each level carries the level's sign-off.
- Six sign-offs. Only one of them opens anything in the Job Runner: Level 4 machine polishing opens the polish stage for a crew member (D11). Level 0 opens nothing.
- You sign off on the shop phone, with your PIN, while you watch. DJ's phone is for study only. Finishing a level there unlocks nothing.
- The pass scores and drill counts are my proposal. They are marked unverified until you say "OK" or change them. They still apply, so the polish gate never switches off.
- Level 0 order is my pick from the knowledge base. Your answer to "the first screen a new hire reads" has not arrived, so you may reorder Level 0 (see "Level 0 order").
- Nothing in the Academy settles a decision you have not made: Teslas, polisher speed and pressure, and what crew does when the label and the app disagree all show as pending.
- The fact-check changed the Academy. The wheel cleaner waits 30 seconds, not a minute, and the label asks for eye protection and gloves. No label confirms the one-minute Bug & Tar wait. Tesla's manual adds more conflicts (the hose, mitts, camera lenses, the touchscreen, the interior). The polisher grip, pad drying, and towel wash water now show the house line next to the maker's line.
- Who may run the polisher, the compressor, and the shop vac is now pending on you. The Utah Labor Commission says minors may not operate power equipment, and DJ's age is not in the knowledge base. Every drill and sign-off that runs a power tool shows "Who may run power tools: Lando decides (pending)."

## How a level works

1. Read each lesson: the goal in one sentence, why it matters, the steps, the numbers, and the common mistakes.
2. Do the lesson's drill. Each drill says what one session must show to pass, in a unit you can log (minutes, pounds, sets, spots, calls).
3. Take the lesson's quiz: 4 or 5 questions written from real moments in the garage, each with the reason behind the right answer.
4. Study the flashcards for the numbers, a few minutes a day. Spaced repetition brings back the ones you miss.
5. At the end of the level, take the level quiz (10 questions; the test spot has 6) and log the level's drill sessions.
6. When the level quiz is passed and the drill sessions are logged, the skill reads "Ready for sign-off". You watch the crew member do the owner checks, then enter your PIN.

Skill states (BUILD_PROMPT section 6, BLUEPRINT 3.1): Locked, Learning (lesson opened), Practicing (first drill logged), Ready for sign-off (quiz passed and drill minimum met, in either order), Signed off (owner PIN, shop phone), Revoked (owner PIN and a reason; a new drill returns it to Practicing and the quiz is retaken). Crew can never sign themselves off.

## Level 0 order (Lando may reorder)

Picked from the knowledge base, because your answer has not arrived:

1. The 13 rules that never bend. Knowledge base section 2 is the first working section, and every line in it is house policy. Rule 12, "The label on the bottle beats this app," comes first in the lesson.
2. Stay safe. What can hurt a person on a first Saturday comes before anything about paint.
3. The never list. What can hurt a customer's car on a first Saturday.
4. How paint works.
5. What can and cannot be fixed.
6. Set up the shop and close it down. It ends the level because you can watch it happen on a real morning, so it carries the sign-off.

If you reorder it, the content-curator changes the `order` numbers in the six Level 0 lesson files and I change this list. The sign-off stays on whichever lesson is last.

## Levels 0 to 4, lesson by lesson

Each line: lesson id, title, the goal, its drill, its quiz.

### Level 0. Ground rules

| # | Lesson | Goal | Drill | Quiz |
|---|---|---|---|---|
| 1 | `lesson-l0-01-rules-that-never-bend` The 13 rules that never bend | Know the 13 house rules well enough to spot any one being broken, starting with "the label on the bottle beats this app." | `drill-l0-rule-walk` | `quiz-l0-01-rules` (4) |
| 2 | `lesson-l0-02-stay-safe` Stay safe | Work so chemicals, cords, heat, and heavy loads never hurt you, and stop the moment a tool or a panel says to. | `drill-l0-safety-start` | `quiz-l0-02-safety` (5) |
| 3 | `lesson-l0-03-never-list` The never list | Name every tool and product that never touches customer paint or goes in the wash bucket, and pull them before a job. | `drill-l0-never-sort` | `quiz-l0-03-never` (4) |
| 4 | `lesson-l0-04-how-paint-works` How paint works | Explain clear coat, base coat, single-stage paint, and microns, and why every polish removes a thin layer of clear. | `drill-l0-explain-paint` | `quiz-l0-04-paint` (4) |
| 5 | `lesson-l0-05-what-can-be-fixed` What can and cannot be fixed | Use a low light and the fingernail test to tell what polishing can fix, and never promise it comes out. | `drill-l0-fingernail` | `quiz-l0-05-fixable` (4) |
| 6 | `lesson-l0-06-shop-setup` Set up the shop and close it down (sign-off) | Stage the kit so nothing is more than three steps away, and close the day with towels in three piles. | `drill-l0-stage-kit` | `quiz-l0-ground-rules` (10) |

### Level 1. Wash and decon

| # | Lesson | Goal | Drill | Quiz |
|---|---|---|---|---|
| 1 | `lesson-l1-01-wheels-first` Wheels and tires first | Clean all four wheels first, one at a time, on a cool wheel, with eye protection and gloves on, without letting cleaner dry or a brush touch paint. | `drill-l1-wheels` | `quiz-l1-01-wheels` (4) |
| 2 | `lesson-l1-02-pre-rinse` Pre-rinse, bugs and tar, and the pre-soak question | Rinse 3 to 4 minutes before anything touches paint, let Bug & Tar soften the bugs and tar without scrubbing, and know why the pre-soak is not settled. | `drill-l1-pre-rinse` | `quiz-l1-02-pre-rinse` (4) |
| 3 | `lesson-l1-03-towel-wash` The towel wash, hose only | Wash roof to rockers with the 16-towel method so a dirty towel never goes back in the bucket. | `drill-l1-towel-wash` | `quiz-l1-03-towel-wash` (5) |
| 4 | `lesson-l1-04-hard-water-drying` Hard water and drying | Rinse, blow out, and dry so Utah hard water leaves no spots. | `drill-l1-dry` | `quiz-l1-04-drying` (5) |
| 5 | `lesson-l1-05-clay` Bag test and clay | Let the bag test pick the panels, then clay each 2 x 2 ft section on plenty of lube until the bar glides silent. | `drill-l1-clay` | `quiz-l1-05-clay` (5) |
| 6 | `lesson-l1-06-full-wash` Run the whole wash (sign-off) | Run the full wash and decon in order and log your time against the plan. | `drill-l1-full-wash` | `quiz-l1-wash-decon` (10) |

### Level 2. Interior

| # | Lesson | Goal | Drill | Quiz |
|---|---|---|---|---|
| 1 | `lesson-l2-01-interior-order` The interior order and the customer's things | Empty the car the same way every time and keep every personal item where the customer can see it. | `drill-l2-empty-out` | `quiz-l2-01-order` (4) |
| 2 | `lesson-l2-02-knock-down-vacuum` Knock it down, then vacuum | Knock dust down from the top, then vacuum top down with the seats slid forward and back. | `drill-l2-vacuum` | `quiz-l2-02-vacuum` (4) |
| 3 | `lesson-l2-03-wipe-dress` Wipe and dress, never shiny | Clean hard surfaces, screens, and the headliner with no overspray, no shine, and no soaking. | `drill-l2-matte-dash` | `quiz-l2-03-wipe` (5) |
| 4 | `lesson-l2-04-pet-hair-spots` Pet hair, spots, and wet carpet | Pull pet hair with the rubber tool before you vacuum, never guess at a spot product, and air out wet carpet. | `drill-l2-pet-hair` | `quiz-l2-04-pet-hair` (4) |
| 5 | `lesson-l2-05-glass` Glass, inside and out | Clean glass last with two towels and a direction rule, so a streak tells you its side. | `drill-l2-glass` | `quiz-l2-05-glass` (4) |
| 6 | `lesson-l2-06-full-interior` A full interior, start to finish (sign-off) | Run a full interior in order, check it the way the customer will, and log your time. | `drill-l2-full-interior` | `quiz-l2-interior` (10) |

### Level 3. Inspect and measure

| # | Lesson | Goal | Drill | Quiz |
|---|---|---|---|---|
| 1 | `lesson-l3-01-light-and-eyes` Read paint with a light | Find swirls and scratches with a low light, fingernail test each one, and photograph every flaw first. | `drill-l3-flaw-map` | `quiz-l3-01-light` (4) |
| 2 | `lesson-l3-02-tc100-gauge` The TC100 paint gauge | Zero only on the bare plate, take a door jamb baseline, and write down the readings per panel. | `drill-l3-gauge-sheet` | `quiz-l3-02-gauge` (5) |
| 3 | `lesson-l3-03-thickness-bands` The thickness bands | Turn any reading into what is allowed on that panel. | `drill-l3-band-calls` | `quiz-l3-03-bands` (5) |
| 4 | `lesson-l3-04-kills-the-buff` What kills the buff | Run the 8 checks before any quote and know the five cars you walk away from. | `drill-l3-eight-checks` | `quiz-l3-04-eight-checks` (5) |
| 5 | `lesson-l3-05-walkaround-script` The walkaround and the script (sign-off) | Run the walkaround with the customer there, and read the script word for word before anything touches the car. | `drill-l3-mock-walkaround` | `quiz-l3-inspect-measure` (10) |

### Level 4. Machine polishing

| # | Lesson | Goal | Drill | Quiz |
|---|---|---|---|---|
| 1 | `lesson-l4-01-know-the-machine` Know your machine | Know what the BAUER 56367 is and is not, check it unplugged, and run the manual's 30-second test run. | `drill-l4-check-and-test-run` | `quiz-l4-01-long-throw` (4) |
| 2 | `lesson-l4-02-prime-and-product` Prime the pad, then use less polish | Prime a new pad once, then 1 to 2 drops per section and a light mist when it runs dry. | `drill-l4-prime-pad` | `quiz-l4-02-priming` (4) |
| 3 | `lesson-l4-03-pressure` Pressure: feel it on a scale | Feel the house pressure on a bathroom scale, float the last set, and know the manual's line is waiting on you. | `drill-l4-scale-pressure` | `quiz-l4-03-pressure` (4) |
| 4 | `lesson-l4-04-speed-sets-marker` Speed, arm speed, sets, and the marker line | Spread slow, work in crosshatch sets at about 1 inch per second, keep the marker line turning, stop when it goes clear. | `drill-l4-marker-line` | `quiz-l4-04-sets` (5) |
| 5 | `lesson-l4-05-edges-curves-heat` Edges, curves, and heat | Tape first, stay an inch off edges, use the middle of the pad on curves, and stop when a panel is too hot to hold. | `drill-l4-edges-heat` | `quiz-l4-05-edges-heat` (5) |
| 6 | `lesson-l4-06-pad-care-backing-plate` Pad care and the backing plate | Keep pads clean during the job, wash them the same night, and replace the plate with one that fits. | `drill-l4-pad-care` | `quiz-l4-06-pads-plate` (5) |
| 7 | `lesson-l4-07-full-square` One full square, start to finish (sign-off, opens the polish stage) | Polish one 2 x 2 ft square in about 4 minutes, wipe once, IPA it, and see no haze under the light. | `drill-l4-timed-square` | `quiz-l4-machine` (10) |
| 8 | `lesson-l4-08-test-spot-ladder` The test spot and the ladder (sign-off) | Run the test spot on the worst panel and climb the pad ladder one rung at a time. | `drill-l4-test-spot` | `quiz-l4-test-spot` (6) |

Level 4 has eight lessons because it holds two skills: machine control, and the test spot built on top of it.

## The six sign-offs

Every number here is a proposal (status verify) until you accept it. "Drill sessions" counts logged sessions of the level's drills, passed or not; the app does not record a pass per session in v1, so the owner checks are what you actually watch.

| Skill | Lesson | Level quiz, pass score | Drill sessions | Needs first | Opens |
|---|---|---|---|---|---|
| `skill-l0-ground-rules` Ground rules | `lesson-l0-06-shop-setup` | `quiz-l0-ground-rules`, 100% | 6 | nothing | nothing |
| `skill-l1-wash-decon` Wash and decon | `lesson-l1-06-full-wash` | `quiz-l1-wash-decon`, 80% | 8 | Level 0 | nothing |
| `skill-l2-interior` Interior | `lesson-l2-06-full-interior` | `quiz-l2-interior`, 80% | 8 | Level 0 | nothing |
| `skill-l3-inspect-measure` Inspect and measure | `lesson-l3-05-walkaround-script` | `quiz-l3-inspect-measure`, 90% | 7 | Level 1 | nothing |
| `skill-l4-machine-polishing` Machine polishing | `lesson-l4-07-full-square` | `quiz-l4-machine`, 90% | 12 | Level 3 | the polish stage (D11) |
| `skill-l4-test-spot` Test spot and the ladder | `lesson-l4-08-test-spot-ladder` | `quiz-l4-test-spot`, 100% | 3 | Level 4 machine polishing | nothing |

Why these numbers: rules, the paint ladder, and safety are all-or-nothing, so Level 0 and the test spot ask for every question right (retakes are allowed). Wash and interior forgive one or two misses. Inspect and machine polishing touch the customer's paint, so they ask for 9 of 10. Drill sessions are at least one per drill, plus extra sessions on the drills that build feel (the full wash, the full interior, the scale, the marker line, the timed square).

### What you watch before you enter the PIN

The full lists are in `content/academy/signoff/<skillId>.yaml` as `ownerChecks`. In short:

- Ground rules: finds staged rule breaks; reads a new label first; hand test on a wheel and a panel; eye protection and gloves before the wheel cleaner (label); the Hot Shine aerosol away from the heat gun (Meguiar's safety sheet); unplugs before any plate check; a W-A cord outdoors, GFCI near water, plugs off the wet ground (56367 manual); pulls the never-on-paint items; explains paint with no notes; never promises a scratch; stages the kit within three steps; sorts towels into three piles. Pending, with nothing to check: who may run power tools, and eye protection, gear, and first aid for the other chemicals, the heat gun, compressed air, and lifting.
- Wash and decon: Car Wash Mode before water on a Tesla; eye protection and gloves; wheels first, one at a time, cool and wet, 30 seconds, rinsed before dry (label); 3 to 4 minute pre-rinse; Bug & Tar hosed or washed off with no scrubbing (Meguiar's), the one-minute wait shown as unconfirmed; no towel back in the bucket; car kept wet; sheeting rinse, compressor, flat towels, jambs; bag test before clay; no spots under the light; no pre-soak. The Tesla wheel step and the Tesla pre-rinse each show the house line, Tesla's manual line, and "Lando decides (pending)". Who may run the compressor is pending.
- Interior: back seat before the quote; everything out, one visible bag, valuables on the dash; knock down, then vacuum top down; rubber tool and three passes on pet hair; spray the towel; no shine, zero slick; headliner blotted; glass last with two towels; wet carpet aired. Pending: spot treatment, who may run the shop vac and the Dremel Versa, and the Tesla interior (house line, Tesla's manual line on the touchscreen, cleaners, and seats, then "Lando decides (pending)").
- Inspect and measure: zero on the plate only; jamb plus 11 panels x 3; skips the Tesla glass roof; calls any band without the card; the 8 checks and the walk-away list; low light, nail test, photos first; customer's hand in the bag; script word for word; photo consent defaults to no; tells the customer before the pad touches paint.
- Machine polishing: who may run the polisher (pending); the unplugged checks and the 30-second test run; stops on abnormal vibration; prime once, 1 to 2 drops; mist, never soak; pad on before the trigger, off before the lift; spread at 1 to 2; the house grip (two hands, loose) next to the manual's firm grip and "Lando decides the grip wording (pending)"; the house speed and pressure, with the manual's two lines and "Lando decides (pending)" beside them; 4 to 6 sets at about 1 inch per second with the marker line turning; stops when it goes clear; wipe once, IPA, light low and from a few feet back; an inch off edges; hand test for heat; pad blown out after every square; stops at color on the pad; three squares in a row at about 4 minutes with no haze.
- Test spot: who may run the polisher (pending); worst panel, taped and split; rung 1 first, one rung at a time; wipe, IPA, light between rungs; stops at the first rung that works; compound only at 100 µm or more, own pad and towel, always followed by yellow + M210, one pass max; stops at rung 4; shows both halves and re-quotes; writes the combo down. On a Tesla, the compound rung shows the house line, Tesla's manual line, and "Lando decides (pending)".

## Drills

- 31 drills, one per lesson. Each has what it needs, numbered one-action steps, a log field (one number per session), reps per session, and a pass mark.
- Pass marks use the knowledge base numbers exactly ("about 10 lb", "about 4 minutes", "3 to 4 minutes", "4 to 6 sets"), or the label's number where the fact-checker corrected the knowledge base (the wheel cleaner's 30 seconds, FC-26). No tolerance is invented.
- Rep counts and hold times (5 staged breaks, 10 fingernail calls, 12 band calls, a 30-second hold, 3 squares in a row) are training sizes I chose, not detailing facts. Change any of them and the drill still works.
- Where a plan time exists (knowledge base 17.2), the time is logged against the plan, not passed or failed on it. "The first car runs long" (17.1). The timed square is the one drill where time is the skill, at "about 4 minutes." The plan's "iron and clay 30" names an iron remover the shop does not own, so the full wash drill times clay only and shows that line as unverified (FC-115).
- Every Level 4 drill runs on a scrap hood or a practice panel, never a customer car before the Level 4 sign-off (D11). Drills that touch a Tesla's pending steps run on a car that is not a Tesla until you decide.
- Every drill that runs a power tool (the polisher, the compressor, the shop vac, the Dremel Versa) carries the row "Who may run power tools: Lando decides (pending)" (FC-107). No age rule is written anywhere.
- The safety lesson's drill is `drill-l0-safety-start`: every safety line done out loud before the first spray, with zero lines missed. It now includes eye protection and gloves for the wheel cleaner, the Hot Shine aerosol kept away from the heat gun, and the outdoor cord and GFCI lines from the 56367 manual.

## Quizzes

- 167 questions in 31 quizzes: 4 or 5 per lesson quiz, 10 per level quiz, 6 for the test spot.
- Every question is a scenario from the garage ("The gauge reads 82 on the left rear door. That is its lowest reading. What is allowed?"), with four choices, one right answer, and the reason.
- No pending decision is ever a right answer or a wrong answer, and neither is a number the fact-checker could not confirm (the Bug & Tar wait, how long a headlight refresh lasts, the maintenance soap ratio). Questions that would need speed 4, about 10 lb, the grip, how pads dry, hot or warm towel water, the one-minute Bug & Tar wait, how long a headlight refresh lasts, wheel cleaner, a pre-soak, a mitt, the hose, the touchscreen, interior products, or compound on a Tesla, the clay-before-or-after-drying order, or a spot product are not written. Where a scenario touches one of those Tesla steps, it says "on a car that is not a Tesla."
- After the fact-check, 23 questions changed, and the 5 gauge questions got an updated source note (FC-73, FC-74). Rewritten around what is confirmed: `quiz-l1-02-pre-rinse-03` (no scrubbing, the can sets the wait), `quiz-l4-03-pressure-02` (two hands, pad flat, stop pushing), `quiz-l4-06-pads-plate-04` (warm water, never the dryer), `quiz-l4-machine-08` (tape the satin trim), `quiz-l0-05-fixable-04` (a refresh, no time frame), `quiz-l0-02-safety-01` (cool wheel, gloves and eye protection). `quiz-l0-02-safety-04` is now the Hot Shine aerosol next to the heat gun. The rest got a corrected explanation, a new source, a "not a Tesla" scope, or a wrong answer that no longer leans on an unconfirmed fact.
- Right answers are spread across the four positions (43, 37, 46, 41), and their length was balanced against the wrong ones so "pick the longest" does not work.

## Flashcards

129 cards in 12 decks: bands 11, gauge 7, mixes 6, machine 26, ladder 9, times 15, towels and pads 10, prices 17, policies 9, Tesla 8, bikes 5, interior 6.

Changed after the fact-check: the wheel cleaner wait is 30 seconds (FC-26); the Model Y camera card counts five cameras on a 2020 to 2024 and six on a 2025 or newer (FC-40) and no longer says what goes on the lenses (FC-33); the satin trim card drops "chalky white" (FC-43); the Model Y gauge card says owners report 4 to 6 mils, not a Tesla spec (FC-73); Car Wash Mode has the same path on the 2025 or newer Model Y (FC-39); the bike windshield card adds "never in hot sun" (FC-82); the chain add-on is priced for a chain-drive bike, because Harley baggers use a belt (FC-85); the headlight card quotes no time frame (FC-78); the pad wash card drops the drying step (FC-70); the wash plan card drops the iron and clay slot (FC-115). New card: `flash-machine-power`, the polisher's 7.5 A, the 12-gauge 50 ft cord, W-A outdoors, and GFCI near water (FC-56).

Held back on purpose, until you decide or the fact-checker confirms:

- Work speed 4, about 10 lb, the grip, and the Harbor Freight speed ranges (FC-22, FC-23, FC-55). The house lines are taught in the lessons and drills, always beside the manual's lines and the pending row, never as a card to memorize.
- Anything that would show wheel cleaner, a pre-soak, a mitt, the hose, the camera lenses, the touchscreen, interior products, or compound on a Tesla as settled (FC-16, FC-33 to FC-37). Cards that touch those steps say "on a car that is not a Tesla" or leave the step out.
- How pads dry (FC-70). The pad card stops at "never in the dryer."
- Unconfirmed numbers crew do not use on a job today: generator size, 50 F, water use, the 15-minute setup target.
- Four cards are on the deck with the unverified badge because crew need them every job: the IPA panel wipe mix (FC-08), the Monthly Maintenance price (plan contents not set), the Bug & Tar wait (FC-45, "read your can"), and towel washer basics (FC-88: "follow the care tag", warm for the water-only pile, detergent and cycle). The product-pile water temperature is not on any card; the shop setup lesson and fix-76 carry its three rows.
- No aftercare text anywhere (FC-06, Phase 4).

## Pending decisions, and where they show

| Decision | Shows as | Where |
|---|---|---|
| Teslas (FC-16): wheel cleaner, pre-soak, compound | House line, Tesla's manual line (sourced, with the URL), "Lando decides how this applies to Teslas (pending)" | Drills `drill-l0-never-sort`, `drill-l1-wheels`, `drill-l1-pre-rinse`, `drill-l1-full-wash`, `drill-l4-test-spot`; sign-offs Level 1 and test spot. `drill-l3-band-calls` keeps every reading off a Tesla |
| Teslas, more conflicts (FC-33 to FC-37): camera lenses, mitts, aiming the hose, the touchscreen, interior products and seats | The same three rows | `drill-l2-glass` (lenses), `drill-l1-clay` (clay mitt), `drill-l1-pre-rinse` and `drill-l1-full-wash` (hose), `drill-l2-matte-dash` and `drill-l2-full-interior` (touchscreen, interior); sign-offs Level 1 and Level 2. Quizzes on these steps are set on a car that is not a Tesla |
| Polisher speed and pressure (FC-22, FC-23) | House speed 4 and about 10 lb, the 56367 manual's two lines, "Lando decides which applies (pending)" | Every Level 4 drill that runs the machine; the scale drill's pass mark; the Level 4 machine sign-off |
| Polisher grip (FC-55) | House "two hands, loose grip, guide, don't push", the manual's "firm grip with both hands to resist starting torque", "Lando decides the grip wording (pending)" | `drill-l4-scale-pressure`, the Level 4 machine sign-off, the explanation in `quiz-l4-03-pressure-02` |
| Who may run power tools (FC-107) | "Who may run power tools: Lando decides (pending)" | Every drill that runs the polisher, compressor, shop vac, or Dremel Versa; sign-offs Level 0, 1, 2, and both Level 4 |
| Label and app disagree, Lando not there | Rule 12 as house; "What crew does next: Lando decides (pending)" | `drill-l0-rule-walk`, `drill-l4-prime-pad` (and lessons L0-01, L2-03, L4-02) |
| How pads dry (FC-70) | House face down on a rack, Buff and Shine's "air-dry flat, never face down", "Lando decides how pads dry (pending)"; either counts in the drill | `drill-l4-pad-care`, the explanation in `quiz-l4-06-pads-plate-04` |
| HF pad washing (FC-25) | House hand wash, the manual's machine wash line, pending row | `drill-l4-pad-care` |
| Towel wash water (FC-88) | "Follow the care tag"; house hot, The Rag Company warm or cold, Lando decides (pending) | `lesson-l0-06-shop-setup` and `fix-76` carry the three rows. `flash-towels-washer` (unverified badge) keeps only the settled parts and points to the lesson |
| Bike wheels (FC-27) | The label says check with the maker before motorcycles; "What to use on bike wheels: Lando decides (pending)" | `drill-l1-wheels` |
| Chain add-on on belt-drive bikes (FC-85) | Priced for a chain-drive bike; check the final drive first | `flash-prices-bike-addons` |
| Water-spot remover (FC-47) | None chosen; stays on the shelf | `drill-l0-safety-start`, `drill-l1-dry` |
| Clay before or after drying | Either order counts in the drill until you decide | `drill-l1-full-wash` |
| Aftercare card (FC-06) | Nothing written | Phase 4, business-customer |

## Levels 5 to 8 (outline only)

These are outlines: no sign-off, no drills, and no quizzes until each level is written in full. Numbers and statuses follow the verification log as of 2026-10-11.

### Level 5. Protection and finishing

- Protect the same day you polish: Hybrid Ceramic Wax on a wet car (spray, second rinse, dry), or wax as you dry; two coats. Knowledge base 9.1, rule 5; FC-04 and FC-05 confirmed. The next-day second coat is house. Whether it helps against water spots is unconfirmed (FC-49). The old thin-coat-and-haze method is superseded (23) and never appears.
- Streaks and high spots: 2 to 3 sprays on a clean damp towel, re-wipe, shade, cool panel (9.1, FIX-18; no Meguiar's source, FC-50).
- Tires: the house sprays the applicator, and the Armor All label says spray a clean, dry tire and do not wipe (FC-28, pending). Let it dry at least 3 to 5 minutes before the car moves (trigger label); the aerosol label says at least 5 (FC-29). Hot Shine aerosols are flammable: away from the heat gun (FC-32). Never on a bike tire, seat, grip, or pedal (FC-30 confirmed).
- Trim: faded trim needs a trim restorer (product not chosen); nothing slick before correction (9.2, 2, FIX-20).
- Exterior glass last, two towels, up and down outside (9.3, FIX-19).
- Cold: below about 50 F stays a house limit with an unverified badge. A Meguiar's FAQ says its products work from about 50 to 90 F surface temperature and best at 60 to 80 F (FC-51, supporting only).
- Final walkaround with the light, the way the customer will see it (17.2, 16 step 7).
- Planned skill: `skill-l5-protection-finishing`. No aftercare text in this level (FC-06).

### Level 6. Specialty

- Tesla Model Y: Car Wash Mode, the same path on the 2020 to 2024 and the 2025 or newer (FC-13, FC-14, FC-39 confirmed); the glass roof skipped (FC-41 confirmed it is glass); the tape list, with five body cameras on a 2020 to 2024 and six on a 2025 or newer (FC-40); satin trim taped because Tesla says polish can damage chrome and metal finishes (FC-43); aero covers on (house, FC-42). Shown as three rows, pending: wheel cleaner, pre-soak, and compound (FC-16, FC-38), camera lenses (FC-33), mitts (FC-34), the hose (FC-35), the touchscreen (FC-36), and the interior and seats (FC-37). Model S, Model X, and Cybertruck unchecked (FC-15).
- Motorcycles: the bike rules, hand polish only (no Level 4 gate, D11 amendment), drop-off only, Store-It-Clean as the October pitch (12.1, 12.2, FIX-30). Windshields: no alcohol, glass cleaner, or abrasives, and never in hot sun (FC-82 confirmed); which cleaner to use is your call (FC-83). Chain: O-ring safe cleaner and lube only (FC-84 confirmed). Check the final drive before the chain add-on: Harley baggers use a belt (FC-85). Wheel cleaner on a bike: the label says check with the maker (FC-27, pending). Matte and Denim stay house (FC-86). Ceramic wax on chrome is unconfirmed (FC-87).
- Headlights: Blue Magic by hand, about two minutes per light, a refresh, $30 a pair (9.4). No time frame is quoted to a customer until a label confirms one (FC-78).
- Pet hair, the full job and how it is quoted (10, 15.1, FIX-31).
- Odor: the knowledge base has no method and the smoke odor fee is not set. Needs your method and the fact-checker before any step is written.
- Planned skills: `skill-l6-tesla`, `skill-l6-motorcycles`.

### Level 7. Business

- The car and bike menus, drop-off default, mobile +$30, travel, add-ons, founder's rate (15.1, 12.2). Sales tax: whether prices include it or it is added at checkout is your call (FC-96, pending). No tax line is added to any price card until you decide.
- The floor price formula, and why a discount comes out of your pay (15.3).
- The five policies said out loud at booking (15.2; smoke odor amount not set). "Payment before the keys go back" is a house term; no lesson cites a law for it (FC-108).
- The seven booking steps from the call to pickup (16).
- What kills the buff as a sales conversation; scratch questions; price pushback (7.4, FIX-27, FIX-29).
- Retention: one add-on or the plan, the review, one referral (16 step 7; Monthly Maintenance contents not set).
- Seasons (18.2, 12.2).
- The business setup checklist (19). The lesson teaches each line with its status from the verification log:
  - Sales tax: the Utah Tax Commission (Publication 5, Rev. 07/26) lists detailing, interior cleaning, and exterior cleaning that includes the interior as taxable. A Utah sales tax license comes before the first paid job (FC-94, corrected). Exterior-only washes are unconfirmed; ask the Tax Commission (FC-95).
  - City or county license: inside Tooele City, anyone offering a service from home for pay needs a Tooele City business license, and city licenses expire December 31 each year. The city's order is register the name with the State, register with the Tax Commission, then apply to the city (FC-97, corrected). Outside the city, the office depends on where the home sits (FC-98).
  - Home occupation rules inside Tooele City: the work must be inside the home or an accessory building, and the yard is for customer parking only (FC-99). Assistants must be immediate family who live in the home (FC-100). Both conflict with the drop-off driveway shop and with DJ, so both are your call after the city answers (pending).
  - DBA: register the name with the Utah Division of Corporations; it lasts 3 years, and the name cannot be changed later (FC-101). The filing is public record and asks for addresses, so how to keep the home address off it is your call (FC-102, pending).
  - Insurance: ask for garagekeepers, also called care, custody, and control coverage; a general liability policy alone does not cover customer cars (FC-103). Garagekeepers coverage may not pay when your own work damages a car, for example polishing through the clear coat. Ask your agent in writing (FC-104, pending). This also sits behind the Level 4 stop rule.
  - Before paying any helper: Utah treats a paid helper as an employee unless both tests for a contractor are met (FC-105), and every employer must carry workers' comp, with a few exceptions (FC-106).
  - Minors: the Labor Commission says minors may not work in hazardous occupations, including operating power equipment. You confirm DJ's age and decide what DJ may run (FC-107, pending).
  - Runoff: Tooele City Code says do not let water from anything you control run onto the sidewalk (4-11-11), and the mayor can restrict car washing in a declared water shortage (9-4-16). The driveway runoff call is still pending (FC-93).
- Planned skill: `skill-l7-booking`.

### Level 8. Mastery (opens at 25 cars)

- Opens when 25 cars are logged, counted the way BLUEPRINT 3.3 says: delivered jobs that touch paint. On a study phone it stays locked with "Opens at 25 cars on the shop phone." You can open it early on the shop phone with your PIN; the unlock is logged.
- Two-step correction: rule 2, the two-step time column (17.1), pads per car (18.4). The knowledge base has no two-step procedure yet and no price; needs you and the fact-checker first.
- Speed: your logged times against the time map (17.1, 17.2, 17.3; the arithmetic checks out, FC-115).
- Two-person flow, one in and one out, about 5 h (17.2).
- Mobile polishing after 25 cars: water, power, parking, weather (rule 1, 18.2). The power lines are confirmed (7.5 A, 15 A circuit, W-A cord outdoors, GFCI near water, FC-56). The generator size (FC-64) and the 50 F limit (FC-51) stay unconfirmed.
- The black pad's future uses: machine sealant at speed 2 to 3, or a final gloss pass with M210 on soft black paint (3.2). Its brand is not recorded (FC-69).
- Teaching others: running drills with a new hire, watching the owner checks, and why the sign-off stays behind your PIN.
- Planned skill: `skill-l8-two-step`.

## Counts (2026-10-11, after the fact-check)

- Lessons: 31 full (Levels 0 to 4), written by the content-curator. Levels 5 to 8: 26 outline lessons (Level 5: 7, Level 6: 5, Level 7: 8, Level 8: 6).
- Drills: 31. Quiz questions: 167 in 31 quizzes. Flashcards: 129 in 12 decks. Sign-off files: 6.

## Open questions for Lando

1. Accept or change the pass scores and drill counts in the sign-off table.
2. Do you have a scrap hood or practice panel? Every Level 4 drill needs one.
3. How old is DJ, and who may run the polisher, the compressor, and the shop vac? Every power tool drill waits on this.
4. Is eye protection a house rule beyond the wheel cleaner? And which heat gun do you own, and what do you use it for?
5. Reorder Level 0 if you want a different first screen for a new hire.
