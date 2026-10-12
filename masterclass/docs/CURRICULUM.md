# Curriculum: the Academy plan in plain English

Owner: learning-designer. Written 2026-10-11 (Phase 2). The lesson files in `content/lessons/` (content-curator) follow the ids, levels, and orders below. Drills, quizzes, flashcards, and sign-off criteria live in `content/academy/` (learning-designer). Facts come only from `knowledge/KNOWLEDGE_BASE.md` and the fact-checker's `knowledge/verification-log.md`.

## Read this first (Lando, on your phone)

- Five levels are complete: 0 to 4. Levels 5 to 8 are outlined at the bottom of this file.
- Every lesson has one drill you can watch and one short quiz. The last lesson of each level carries the level's sign-off.
- Six sign-offs. Only one of them opens anything in the Job Runner: Level 4 machine polishing opens the polish stage for a crew member (D11). Level 0 opens nothing.
- You sign off on the shop phone, with your PIN, while you watch. DJ's phone is for study only. Finishing a level there unlocks nothing.
- The pass scores and drill counts are my proposal. They are marked unverified until you say "OK" or change them. They still apply, so the polish gate never switches off.
- Level 0 order is my pick from the knowledge base. Your answer to "the first screen a new hire reads" has not arrived, so you may reorder Level 0 (see "Level 0 order").
- Nothing in the Academy settles a decision you have not made: Teslas, polisher speed and pressure, and what crew does when the label and the app disagree all show as pending.

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
| 1 | `lesson-l1-01-wheels-first` Wheels and tires first | Clean all four wheels first, one at a time, on a cool wheel, without letting cleaner dry or a brush touch paint. | `drill-l1-wheels` | `quiz-l1-01-wheels` (4) |
| 2 | `lesson-l1-02-pre-rinse` Pre-rinse, bugs and tar, and the pre-soak question | Rinse 3 to 4 minutes before anything touches paint, give Bug & Tar a one-minute dwell, and know why the pre-soak is not settled. | `drill-l1-pre-rinse` | `quiz-l1-02-pre-rinse` (4) |
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

- Ground rules: finds staged rule breaks; reads a new label first; hand test on a wheel and a panel; unplugs before any plate check; pulls the never-on-paint items; explains paint with no notes; never promises a scratch; stages the kit within three steps; sorts towels into three piles. The safety lines that are not confirmed yet (eye protection, outdoor cords, chemical gear, the heat gun, compressed air, lifting) show as pending, with nothing to check.
- Wash and decon: Car Wash Mode before water on a Tesla; wheels first, one at a time, cool, rinsed before dry; 3 to 4 minute pre-rinse; one-minute Bug & Tar dwell, no scrubbing; no towel back in the bucket; car kept wet; sheeting rinse, compressor, flat towels, jambs; bag test before clay; no spots under the light; no pre-soak. The Tesla wheel step shows the house line, Tesla's manual line, and "Lando decides (pending)".
- Interior: back seat before the quote; everything out, one visible bag, valuables on the dash; knock down, then vacuum top down; rubber tool and three passes on pet hair; spray the towel; no shine, zero slick; headliner blotted; glass last with two towels; wet carpet aired. Spot treatment is pending.
- Inspect and measure: zero on the plate only; jamb plus 11 panels x 3; skips the Tesla glass roof; calls any band without the card; the 8 checks and the walk-away list; low light, nail test, photos first; customer's hand in the bag; script word for word; photo consent defaults to no; tells the customer before the pad touches paint.
- Machine polishing: the unplugged checks and the 30-second test run; stops on abnormal vibration; prime once, 1 to 2 drops; mist, never soak; pad on before the trigger, off before the lift; spread at 1 to 2; the house speed and pressure, with the manual's two lines and "Lando decides (pending)" beside them; 4 to 6 sets at about 1 inch per second with the marker line turning; stops when it goes clear; wipe once, IPA, light low and from a few feet back; an inch off edges; hand test for heat; pad blown out after every square; stops at color on the pad; three squares in a row at about 4 minutes with no haze.
- Test spot: worst panel, taped and split; rung 1 first, one rung at a time; wipe, IPA, light between rungs; stops at the first rung that works; compound only at 100 µm or more, own pad and towel, always followed by yellow + M210, one pass max; stops at rung 4; shows both halves and re-quotes; writes the combo down. On a Tesla, the compound rung shows the house line, Tesla's manual line, and "Lando decides (pending)".

## Drills

- 31 drills, one per lesson. Each has what it needs, numbered one-action steps, a log field (one number per session), reps per session, and a pass mark.
- Pass marks use the knowledge base numbers exactly ("about 10 lb", "about 4 minutes", "3 to 4 minutes", "4 to 6 sets"). No tolerance is invented.
- Rep counts and hold times (5 staged breaks, 10 fingernail calls, 12 band calls, a 30-second hold, 3 squares in a row) are training sizes I chose, not detailing facts. Change any of them and the drill still works.
- Where a plan time exists (knowledge base 17.2), the time is logged against the plan, not passed or failed on it. "The first car runs long" (17.1). The timed square is the one drill where time is the skill, at "about 4 minutes."
- Every Level 4 drill runs on a scrap hood or a practice panel, never a customer car before the Level 4 sign-off (D11). Drills that touch a Tesla's pending steps run on a car that is not a Tesla until you decide.
- The safety lesson's drill is `drill-l0-safety-start`: every confirmed safety line done out loud before the first spray, with zero lines missed.

## Quizzes

- 167 questions in 31 quizzes: 4 or 5 per lesson quiz, 10 per level quiz, 6 for the test spot.
- Every question is a scenario from the garage ("The gauge reads 82 on the left rear door. That is its lowest reading. What is allowed?"), with four choices, one right answer, and the reason.
- No pending decision is ever a right answer or a wrong answer. Questions that would need speed 4, about 10 lb, wheel cleaner, a pre-soak, or compound on a Tesla, the clay-before-or-after-drying order, or a spot product are not written. Where a scenario touches a Tesla rung, it says "on a car that is not a Tesla."
- Right answers are spread across the four positions, and their length was balanced against the wrong ones so "pick the longest" does not work.

## Flashcards

128 cards in 12 decks: bands 11, gauge 7, mixes 6, machine 25, ladder 9, times 15, towels and pads 10, prices 17, policies 9, Tesla 8, bikes 5, interior 6.

Held back on purpose, until you decide or the fact-checker confirms:

- Work speed 4, about 10 lb, and the Harbor Freight speed ranges (FC-22, FC-23). The house lines are taught in the lessons and drills, always beside the manual's lines and the pending row, never as a card to memorize.
- Anything that would show wheel cleaner, a pre-soak, or compound on a Tesla as settled (FC-16). Cards that touch those steps say "on a car that is not a Tesla."
- Unconfirmed numbers crew do not use on a job today: cord gauge, generator size, 50 F, water use, the 15-minute setup target.
- Two cards are on the deck with the unverified badge because crew need them every job: the IPA panel wipe mix (FC-08) and the Monthly Maintenance price (plan contents not set).
- No aftercare text anywhere (FC-06, Phase 4).

## Pending decisions, and where they show

| Decision | Shows as | Where |
|---|---|---|
| Teslas (FC-16): wheel cleaner, pre-soak, compound | House line, Tesla's manual line (sourced, with the URL), "Lando decides how this applies to Teslas (pending)" | Drills `drill-l0-never-sort`, `drill-l1-wheels`, `drill-l1-pre-rinse`, `drill-l1-full-wash`, `drill-l4-test-spot`; sign-offs Level 1 and test spot. `drill-l3-band-calls` keeps every reading off a Tesla |
| Polisher speed and pressure (FC-22, FC-23) | House speed 4 and about 10 lb, the 56367 manual's two lines, "Lando decides which applies (pending)" | Every Level 4 drill that runs the machine; the scale drill's pass mark; the Level 4 machine sign-off |
| Label and app disagree, Lando not there | Rule 12 as house; "What crew does next: Lando decides (pending)" | `drill-l0-rule-walk`, `drill-l4-prime-pad` (and lessons L0-01, L2-03, L4-02) |
| HF pad washing (FC-25) | House hand wash, the manual's machine wash line, pending row | `drill-l4-pad-care` |
| Clay before or after drying | Either order counts in the drill until you decide | `drill-l1-full-wash` |
| Aftercare card (FC-06) | Nothing written | Phase 4, business-customer |

## Levels 5 to 8 (outline only)

These are outlines: no sign-off, no drills, and no quizzes until each level is written in full.

### Level 5. Protection and finishing

- Protect the same day you polish: Hybrid Ceramic Wax on a wet car (spray, second rinse, dry), or wax as you dry; two coats. Knowledge base 9.1, rule 5; FC-04 and FC-05 confirmed. The old thin-coat-and-haze method is superseded (23) and never appears.
- Streaks and high spots: 2 to 3 sprays on a clean damp towel, re-wipe, shade, cool panel (9.1, FIX-18).
- Tires and trim: dry tire, spray the applicator, thin coat, wipe the edge, let it set; faded trim needs a trim restorer (product not chosen); nothing slick before correction; no tire shine on a bike (9.2, 2, FIX-20).
- Exterior glass last, two towels, up and down outside (9.3, FIX-19).
- Final walkaround with the light, the way the customer will see it (17.2, 16 step 7).
- Planned skill: `skill-l5-protection-finishing`. No aftercare text in this level (FC-06).

### Level 6. Specialty

- Tesla Model Y: Car Wash Mode (FC-13 and FC-14 confirmed for 2020 to 2024), glass roof skipped, the tape list, camera lenses glass cleaner only, aero covers on. Other years unconfirmed (FC-15). FC-16 shown as three rows.
- Motorcycles: the bike rules, hand polish only (no Level 4 gate, D11 amendment), drop-off only, Store-It-Clean as the October pitch (12.1, 12.2, FIX-30). Windshield cleaner still unconfirmed.
- Headlights: Blue Magic by hand, about two minutes per light, a refresh, $30 a pair (9.4).
- Pet hair, the full job and how it is quoted (10, 15.1, FIX-31).
- Odor: the knowledge base has no method and the smoke odor fee is not set. Needs your method and the fact-checker before any step is written.
- Planned skills: `skill-l6-tesla`, `skill-l6-motorcycles`.

### Level 7. Business

- The car and bike menus, drop-off default, mobile +$30, travel, add-ons, founder's rate (15.1, 12.2).
- The floor price formula, and why a discount comes out of your pay (15.3).
- The five policies said out loud at booking (15.2; smoke odor amount not set).
- The seven booking steps from the call to pickup (16).
- What kills the buff as a sales conversation; scratch questions; price pushback (7.4, FIX-27, FIX-29).
- Retention: one add-on or the plan, the review, one referral (16 step 7; Monthly Maintenance contents not set).
- Seasons and the business setup checklist (18.2, 12.2, 19; every line of 19 unconfirmed).
- Planned skill: `skill-l7-booking`.

### Level 8. Mastery (opens at 25 cars)

- Opens when 25 cars are logged, counted the way BLUEPRINT 3.3 says: delivered jobs that touch paint. On a study phone it stays locked with "Opens at 25 cars on the shop phone." You can open it early on the shop phone with your PIN; the unlock is logged.
- Two-step correction: rule 2, the two-step time column (17.1), pads per car (18.4). The knowledge base has no two-step procedure yet and no price; needs you and the fact-checker first.
- Speed: your logged times against the time map (17.1, 17.2, 17.3).
- Two-person flow, one in and one out, about 5 h (17.2).
- Mobile polishing after 25 cars: water, power, parking, weather (rule 1, 18.2; most lines unconfirmed).
- The black pad's future uses: machine sealant at speed 2 to 3, or a final gloss pass with M210 on soft black paint (3.2).
- Teaching others: running drills with a new hire, watching the owner checks, and why the sign-off stays behind your PIN.
- Planned skill: `skill-l8-two-step`.

## Counts (2026-10-11)

- Lessons: 31 full (Levels 0 to 4), written by the content-curator. Levels 5 to 8: 23 outline lessons planned.
- Drills: 31. Quiz questions: 167 in 31 quizzes. Flashcards: 128 in 12 decks. Sign-off files: 6.

## Open questions for Lando

1. Accept or change the pass scores and drill counts in the sign-off table.
2. Do you have a scrap hood or practice panel? Every Level 4 drill needs one.
3. Is eye protection a house rule? And which heat gun do you own, and what do you use it for?
4. Reorder Level 0 if you want a different first screen for a new hire.
