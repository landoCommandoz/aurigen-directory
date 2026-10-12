# Verification log

Owner: fact-checker. Nobody else writes this file. Started 2026-10-10 (Phase 1). Last updated 2026-10-11 (Phase 2: labels, tools, and business sweeps merged as FC-26 to FC-115).

## What this file is

This is where facts from `knowledge/KNOWLEDGE_BASE.md` and the content files get checked against live sources. The fact-checker never edits the knowledge base or any content file. Each entry says what must change and who changes it:

- **Knowledge base:** the lead, with Lando, records the change (OWNERSHIP rule 5).
- **Content files** (`content/cards/`, `content/glossary/`, `content/products/`, `content/lessons/`, `content/sops/`): content-curator.
- **Academy files** (`content/academy/drills/`, `quizzes/`, `flashcards/`, `signoff/`) and `docs/CURRICULUM.md`: learning-designer.
- **Fix-It nodes** (`content/fixit/`), `content/search/synonyms.yaml`, and `tests/search-cases.yaml`: troubleshooter.
- **Aftercare card, scripts, paint report wording, prices and policies** (`content/customer/`, `content/business/`): business-customer, in Phase 4.
- **Schemas** (`src/schemas/`): architect.

## The four verdict words

| Verdict | Plain English | What happens next |
|---|---|---|
| **confirmed** | A source says the same thing the knowledge base says. | The lead can retag it `[SOURCED]` with the entry's check date. Customer View still needs this log entry first. |
| **corrected** | A source says something different. The new wording is in the entry. | The owner swaps in the new wording. Until then, treat the old wording as wrong. |
| **unconfirmed** | No source could be found that settles it. | It stays `[VERIFY]`. Never shown in Customer View. |
| **conflicting** | Good sources disagree with each other or with the house rule. | Lando decides. The label in his hand wins over everything else (KB section 0). |

## How sources are labeled

- **Primary:** the maker's own page, label text, tool manual, safety data sheet, or official vendor or government documentation (Tesla, Harbor Freight, Meguiar's, Chemical Guys, Armor All, Buff and Shine, Utah and Tooele City pages). Only primary sources can confirm a fact.
- **Retailer** or **Forum:** supporting evidence only. Never enough on its own.
- **Read through the search index:** some primary sites refused direct loading from the build machine (see "Access notes" at the bottom). For those, the page's own text was read through the search engine's copy of that exact URL. Each entry says when this happened. Where it matters, the entry lists a one-glance check Lando can do himself.
- **Tesla China edition:** tesla.com refuses direct loading, but Tesla's own owner's manual PDFs for the same Model Y years load from tesla.cn. Those were read directly on 2026-10-11 (software 2026.26.200.11). Their cleaning text matches the US pages seen through the search index, except the camera build-date cutoffs, which differ by factory.
- **Merge pass:** on 2026-10-11 the fact-checker merged three sweeps and reloaded the key primary sources itself. Entries say "rechecked by the merge pass" where that happened.

## Summary, 2026-10-11

115 entries. **40 confirmed, 17 corrected, 38 unconfirmed, 20 conflicting.**

- Phase 1 (FC-01 to FC-25): 13 confirmed, 4 corrected, 4 unconfirmed, 4 conflicting.
- Phase 2 (FC-26 to FC-115): 27 confirmed, 13 corrected, 34 unconfirmed, 16 conflicting. 21 of them are urgent.
- Merge notes: six findings came from two sweeps and were merged (FC-33 camera lenses, FC-37 Tesla interior, FC-46 fresh water spots, FC-47 water-spot remover, FC-51 cold limit, FC-52 clay mitt). Two sweeps disagreed on the clay mitt; the merge pass reloaded Ragnify's own page and confirmed it (FC-52). One finding a sweep marked confirmed was downgraded to unconfirmed because its quote needs a reading of the city code to support the claim (FC-92).

| ID | Topic | KB | Verdict | Priority |
|---|---|---|---|---|
| FC-01 | Citrus Wash & Gloss: 1 oz per 5 gal to wash | 4, 3.3 | confirmed | normal |
| FC-02 | Citrus Wash & Gloss: "label says 1 oz per gal to strip" | 4, 23 | corrected | normal |
| FC-03 | Citrus Wash & Gloss in a pump sprayer as a pre-soak | 5.3, 5.1 | unconfirmed | damage |
| FC-04 | Hybrid Ceramic Wax: spray on wet car, second rinse, dry, no cure time | 9.1 | confirmed | normal |
| FC-05 | Hybrid Ceramic Wax: "wax as you dry" and two coats | 9.1 | confirmed | normal |
| FC-06 | Aftercare card: the 24-hour set-up line | 16 | corrected | Customer View |
| FC-07 | Hybrid Ceramic Wax comes in a 32 oz bottle | 3.3 | confirmed | normal |
| FC-08 | IPA panel wipe: 1 cup 70% IPA + 3 cups water | 4, 23 | unconfirmed | normal |
| FC-09 | M210 product name as printed | 3.3 | confirmed | normal |
| FC-10 | M210 "built for dark and sensitive paint" | 3.3 | corrected | normal |
| FC-11 | Ultimate Compound name and size | 3.3 | confirmed | normal |
| FC-12 | M210 and Ultimate Compound label directions on pad and speed | 3.3, 8.2 | unconfirmed | damage |
| FC-13 | Tesla Car Wash Mode menu path, current software | 11 | confirmed | normal |
| FC-14 | What Car Wash Mode does | 11 | confirmed | normal |
| FC-15 | Car Wash Mode path on other models (2025+ Model Y now in FC-39) | 11 | unconfirmed | normal |
| FC-16 | Tesla manual cautions vs the house wash, pre-soak, and compound steps | 5.1, 5.3, 8.5, 11 | conflicting | **urgent: damage, warranty** |
| FC-17 | Bauer 56367 backing plate thread is M8 x 1.25 | 3.1, 14 | confirmed | damage |
| FC-18 | "M8 x 1.25 comes from the manual's spec listing" | 3.1, 14 | corrected | normal |
| FC-19 | HF 64913 is 5/16 in.-24 and does not fit the 56367 | 14 | confirmed | damage, price |
| FC-20 | HF tech and parts line printed in the manual | 3.1, 14 | confirmed | normal |
| FC-21 | Backing plate bolts on through a center hole | 3.1, 14 | confirmed | normal |
| FC-22 | Polisher speed: HF page says 4 to 6 to polish, manual says "only slower speeds" | 3.1, 8.3 | conflicting | damage |
| FC-23 | Polisher pressure: house 10 lb, manual says keep pressure off | 8.3 | conflicting | damage |
| FC-24 | Abnormal vibration: stop and fix before further use; 30-second test run | 3.1, 21 | confirmed | damage |
| FC-25 | Pad washing: manual says machine wash cold, machine dry medium (HF pads) | 13.1 | conflicting | normal |
| FC-26 | Armor All Wheel & Tire: 30 seconds, not about a minute | 5.1, 4 | corrected | **urgent: damage** |
| FC-27 | Armor All Wheel & Tire label cautions (gloves, eyes, test spot, warm wheels, brakes, bikes) | 5.1, 4, 12.1 | corrected | **urgent: safety, damage** |
| FC-28 | Tire shine: spray the applicator (house) vs spray the tire (label) | 9.2, 3.3 | conflicting | normal |
| FC-29 | Tire shine set time: at least 3 to 5 min (trigger), 5 min (aerosol) | 9.2 | corrected | normal |
| FC-30 | Tire shine not for cycle tires, seats, pedals, grips, steering wheels | 2, 10, 12.1 | confirmed | safety |
| FC-31 | Hot Shine label: two-wheeler line and directions | 3.3, 12.1 | unconfirmed | normal |
| FC-32 | Hot Shine aerosols are flammable | 3.3, 9.2, 3.1 | confirmed | **urgent: safety** |
| FC-33 | Tesla camera lenses: water only, no wiping on older builds | 11 | conflicting | **urgent: damage** |
| FC-34 | Tesla: avoid washing mitts | 5.2, 6, 11 | conflicting | **urgent: damage** |
| FC-35 | Tesla: do not aim a hose at seals, windows, or modules | 5.1, 11 | conflicting | **urgent: damage** |
| FC-36 | Tesla touchscreen: display cloth only, no cleaners | 10, 11 | conflicting | **urgent: damage** |
| FC-37 | Tesla interior and seats: soap only, no alcohol, citrus, silicone, conditioners | 10, 11 | conflicting | **urgent: damage** |
| FC-38 | FC-16 cautions appear in the 2020 to 2024 Model Y manual | 5.1, 5.3, 8.5, 11 | confirmed | damage |
| FC-39 | Car Wash Mode path on the 2025+ Model Y | 11 | confirmed | normal |
| FC-40 | Tesla body cameras: five (2020 to 2024), six (2025+) | 11 | confirmed | damage |
| FC-41 | Model Y roof is glass | 11 | confirmed | normal |
| FC-42 | Leave the wheel aero covers on | 11 | unconfirmed | normal |
| FC-43 | Satin window trim "turns chalky white" | 11, 8.1 | unconfirmed | damage |
| FC-44 | Bug & Tar: no scrubbing, hose or mitt it off | 5.1, 3.3 | confirmed | normal |
| FC-45 | Bug & Tar: one-minute dwell | 5.1, 22 | unconfirmed | damage |
| FC-46 | Fresh water spots: damp towel and quick detailer or ceramic spray | 5.4, 21 | unconfirmed | normal |
| FC-47 | Mineral water spots: water-spot remover (strong acids) | 5.4, 3.5, 21 | unconfirmed | **urgent: safety, damage** |
| FC-48 | Etched water spots need polish | 5.4, 21 | unconfirmed | normal |
| FC-49 | Ceramic wax as a drying aid against water spots | 5.4, 9.1 | unconfirmed | normal |
| FC-50 | Ceramic wax streak fix: 2 to 3 sprays on a damp towel | 9.1, 21 | unconfirmed | normal |
| FC-51 | Cold limit: below about 50 F | 18.2, 21, 8, 9.1 | unconfirmed | damage |
| FC-52 | Ragnify clay mitt care | 6, 21 | confirmed | damage |
| FC-53 | FIX-13 trim residue method | 21, 3.5 | unconfirmed | damage |
| FC-54 | Uro-Tec pad size vs the 56367 plate | 3.1, 3.2, 14 | conflicting | **urgent: damage** |
| FC-55 | Polisher grip: loose (house) vs firm (manual) | 21, 8.3 | conflicting | **urgent: safety** |
| FC-56 | Polisher power: 7.5 A, outlet, cord; GFCI and outdoor cord | 18.2 | confirmed | **urgent: safety** |
| FC-57 | Backup plates: the Maxshine swap was 5 in.; nobody fitted a BOSS | 14 | corrected | **urgent: damage, price** |
| FC-58 | ShineMate 6 in. plate price | 14 | confirmed | price |
| FC-59 | ShineMate plate fit on the 56367 | 14 | unconfirmed | damage |
| FC-60 | HF parts line can supply the 56367 plate | 14 | unconfirmed | normal |
| FC-61 | Polisher specs: six speeds, 2,000 to 4,600, 20 mm | 3.1 | confirmed | normal |
| FC-62 | HF FAQ: center the pad, spread compound evenly | 3.1, 21 | unconfirmed | normal |
| FC-63 | FIX-01 note: "some float is normal" | 21 | unconfirmed | normal |
| FC-64 | Generator: 2,000 W inverter minimum | 18.2 | unconfirmed | normal |
| FC-65 | Uro-Tec yellow is a polishing pad | 3.2 | confirmed | normal |
| FC-66 | Uro-Tec maroon is medium cut | 3.2, 8.5 | corrected | normal |
| FC-67 | Uro-Tec foam is 1 in. thick | 3.2 | corrected | normal |
| FC-68 | Uro-Tec face is 1 in. wider than the back | 3.2 | confirmed | normal |
| FC-69 | Black pad role (brand not recorded) | 3.2 | unconfirmed | normal |
| FC-70 | Uro-Tec pad washing and drying | 13.1 | conflicting | normal |
| FC-71 | Clear coat is about 35 to 50 µm | 7.3 | corrected | damage |
| FC-72 | Factory total film is about 100 to 180 µm | 7.3 | confirmed | normal |
| FC-73 | Model Y owners read about 4 to 6 mils | 7.2 | unconfirmed | normal |
| FC-74 | TC100: zero only on the plate; screen codes | 7.2, 21 | unconfirmed | damage |
| FC-75 | Quik Interior Detailer on screens | 3.3, 10 | unconfirmed | damage |
| FC-76 | Tuff Stuff role | 3.3, 25 | unconfirmed | normal |
| FC-77 | Blazin' Banana identity and job | 3.3, 25 | unconfirmed | normal |
| FC-78 | Blue Magic: two minutes per light, yellows in about a month | 9.4, 15.1 | unconfirmed | Customer View |
| FC-79 | Maintenance wash ratio; what "Super Soap, 16 oz" is | 4, 3.3 | unconfirmed | normal |
| FC-80 | APC 10:1 and 4:1 | 4 | unconfirmed | normal |
| FC-81 | Compressor drained per its manual | 13.4, 3.1 | unconfirmed | normal |
| FC-82 | Bike windshields: no alcohol, glass cleaner, or abrasives | 12.1, 21 | confirmed | damage |
| FC-83 | Approved bike windshield cleaner | 12.1 | unconfirmed | damage |
| FC-84 | Chain: O-ring safe cleaner and lube only | 12.1 | confirmed | damage |
| FC-85 | Bagger chain add-on vs Harley belt drive | 12.2, 15.4 | conflicting | price |
| FC-86 | Matte paint and Harley Denim care | 12.1, 7.4 | unconfirmed | damage |
| FC-87 | Ceramic wax on bike chrome | 12.1 | unconfirmed | normal |
| FC-88 | Towel wash water: hot (house) vs warm or cold (towel maker) | 13.3 | conflicting | normal |
| FC-89 | Towels: no softener or bleach, no cotton, low heat | 13.3 | confirmed | normal |
| FC-90 | Hose vs pressure washer water use | 5.5 | unconfirmed | normal |
| FC-91 | Keep wash water out of storm drains (Armor All label) | 5.5 | confirmed | legal |
| FC-92 | Dump buckets in a sink or toilet: what the city code says | 5.5, 13.4 | unconfirmed | legal |
| FC-93 | Driveway runoff and the Tooele City call | 5.5, 18.1 | unconfirmed | legal |
| FC-94 | Utah taxes detailing | 19 | corrected | **urgent: legal, price** |
| FC-95 | Exterior-only washes and sales tax | 19, 15.1 | unconfirmed | legal, price |
| FC-96 | Prices and the Quote record carry no sales tax | 15.1, 15.4 | conflicting | **urgent: price** |
| FC-97 | Tooele City business license for a home business | 18.1, 19 | corrected | **urgent: legal** |
| FC-98 | Which office licenses the home shop | 5.5, 18.1, 19 | corrected | legal |
| FC-99 | Home occupation rules vs drop-off at home | 1, 2, 18.1 | conflicting | **urgent: legal** |
| FC-100 | Home occupation assistant rule vs DJ and future hires | 1, 19 | conflicting | **urgent: legal** |
| FC-101 | DBA registration | 19 | confirmed | legal |
| FC-102 | DBA public record vs the private home address | 1, 19 | conflicting | legal |
| FC-103 | Insurance names: garagekeepers, care custody and control | 19 | confirmed | legal |
| FC-104 | Garagekeepers may not pay for damage from your own work | 19, 7.4 | corrected | **urgent: legal, damage** |
| FC-105 | Employee vs contractor in Utah | 19 | confirmed | legal |
| FC-106 | Workers' comp required for employees | 19 | confirmed | **urgent: legal** |
| FC-107 | Minors may not operate power equipment | 19, 1 | corrected | **urgent: legal, safety** |
| FC-108 | Holding the keys until paid: legal footing | 15.2 | unconfirmed | legal |
| FC-109 | Polish script facts | 16 | confirmed | Customer View |
| FC-110 | Brush car washes and swirls | 16 | corrected | Customer View |
| FC-111 | Hand wash method; never dish soap | 16 | confirmed | Customer View |
| FC-112 | Microfiber drying towel, not a bath towel | 16 | confirmed | Customer View |
| FC-113 | "Not a squeegee" | 16 | conflicting | Customer View |
| FC-114 | Bird droppings and bugs etch; remove them fast | 16 | confirmed | Customer View |
| FC-115 | Time map and full-detail arithmetic | 8.7, 17.1, 17.2 | confirmed | normal |

## Urgent (safety, damage, legal)

### People safety
1. **FC-107, DJ and power tools.** The Utah Labor Commission says anyone 17 or younger is a minor and that minors may not work in hazardous occupations, "including ... operating power equipment." DJ's age is not in the KB. No lesson, drill, or sign-off should treat DJ running the polisher, compressor, or shop vac as settled until Lando confirms DJ's age and decides (pending).
2. **FC-27, wheel cleaner.** The Armor All label says to wear eye protection and rubber gloves, test a hidden spot, never use it on a warm or damaged wheel or damaged clear coat, keep it off brake parts, and check with the maker before using it on motorcycles. The KB gives none of this.
3. **FC-32, Hot Shine.** Meguiar's safety data sheet: flammable aerosol, may burst if heated, keep away from heat and sparks, use outdoors or where the air moves. The kit includes a heat gun.
4. **FC-47, water-spot remover.** The one remover checked (Chemical Guys Heavy Duty) is a strong acid labeled Danger: severe skin burns and eye damage. No remover is chosen. Keep any remover step out of DJ's lessons until Lando picks a product and reads its label.
5. **FC-56, power.** The 56367 manual: GFCI supply in damp places, a W-A cord outdoors, plug connections kept off the ground. The KB covers only amps and cord gauge.
6. **FC-55, grip.** The manual says "maintain a firm grip on the tool with both hands to resist starting torque." FIX-01 says "loose grip." Lando decides the wording (pending).

### Car and tool damage
7. **FC-16, Tesla (kept).** Tesla's manual says no chemical-based wheel cleaners or pre-wash products, no cutting pastes or harsh-abrasive polishes, and cleaning-product damage is not covered by the warranty. FC-38 confirms these lines are in the 2020 to 2024 Model Y manual (Lando's car). Lando decides how the wheel step, the pre-soak, and the compound rung apply to Teslas (pending).
8. **FC-33, Tesla camera lenses.** Tesla: spray water on the lens; on older builds never wipe it with a hand or cloth; never use chemical-based or abrasive cleaners. The KB says "glass cleaner only."
9. **FC-34, Tesla and mitts.** Tesla: "Avoid using tight-napped or rough cloths, such as washing mitts." This touches the two-bucket mitt method and the clay mitt on Teslas.
10. **FC-35, Tesla and the hose.** Tesla: do not aim a hose directly at windows, door or hood seals, electronic modules, or exposed cabling.
11. **FC-36, Tesla touchscreen.** Tesla: a lint-free display cloth only; no cleaners, no wet wipes, no dry statically-charged cloth such as a recently washed microfiber. The KB says "dry microfiber or a screen-safe cleaner."
12. **FC-37, Tesla interior.** Tesla: no solvents (including alcohol), bleach, citrus, naphtha, or silicone-based products inside; on seats, "Anything more than soap can be too harsh" and conditioners are not recommended. The KB says leather cleaner, then conditioner.
13. **FC-26, wheel cleaner time.** The label says 30 seconds. The KB and eight content files say about a minute.
14. **FC-54, pads and plate.** A Buff and Shine 6 in. Uro-Tec has a 6 in. back and a 7 in. face; the 56367 manual says the largest accessory is 6 in. A pad sold as 6 in. by some stores has a 5 in. back. Lando measures the pads.
15. **FC-57, backup plates.** The forum "Maxshine swap" was a 5 in. plate, the downsize KB 14 forbids. Nobody reported fitting a Griot's BOSS plate. Buff and Shine's own 600Y plate has 5/16 in.-24 threads and does not match the 56367 (FC-17, FC-19).
16. **FC-22 and FC-23, polisher (kept).** The 56367 manual says use only slower speeds for polishing and keep pressure off the tool. The house says speed 4 and about 10 lb. Lando decides which governs (pending).
17. **FC-03, pre-soak (kept).** No Chemical Guys source covers a pump sprayer, a pre-soak, or a dwell time. It stays `[VERIFY]` and out of any SOP. On Teslas, FC-38 confirms "no pre-wash products."

### Legal and money
18. **FC-94, sales tax.** Utah Tax Commission Publication 5 (Rev. 07/26) lists detailing as taxable. A Utah sales tax license comes before the first paid job.
19. **FC-96, prices.** KB 15 prices, the 15.4 worked examples (unit tests), and the Quote record in `src/schemas/runtime-job.ts` have no sales tax. Lando decides tax-included or tax-added (pending).
20. **FC-97, city license.** Tooele City: "Anyone offering a service from their home, for compensation, requires a Tooele City Business License."
21. **FC-99, home occupation vs drop-off.** If the home is inside Tooele City, City Code 7-2-19 says the work must be entirely inside the home or an accessory building, the yard is for customer parking only, and "vehicle repair work, body and fender work" are excluded. The drop-off model washes and polishes in the driveway.
22. **FC-100, assistants.** The same section allows no assistants except immediate family who live in the home. That covers DJ and future hires.
23. **FC-104, insurance.** Garagekeepers is the right coverage name, but one insurer's bulletin says it "does not provide protection to you in the event you cause damage to a vehicle through your own work on it." Polishing through the clear may not be covered.
24. **FC-106, workers' comp.** "With a few exceptions, every employer is required to provide workers' compensation coverage for all its employees." In place before DJ is paid.

### Customer View
25. **FC-06, aftercare card (kept).** The 24-hour set-up line is customer-facing, and Meguiar's says the spray has no curing time. Customer content is Phase 4. No aftercare text is written in Phase 2.

## Lando's one-glance checks (every open check in this log)

Bottles and labels:
- Citrus Wash & Gloss 64 oz: what it prints for stripping wax (FC-02) and any pre-wash line (FC-03).
- M210 and Ultimate Compound: pad, speed, priming, and any temperature line (FC-12, FC-51). Hybrid Ceramic Wax: any temperature line (FC-51).
- Bug & Tar can: the dwell time and whether it says not to let it dry (FC-45).
- Hot Shine: trigger or aerosol, its directions, and its two-wheeler line (FC-31, FC-32).
- Super Soap and Ultimate Wash & Wax: exact name, item number, size, and ratio (FC-79).
- Blue Magic: the directions on the bottle (FC-78).
- The care tag on the microfiber towels (FC-88).
- The TC100's printed manual: the zero and SNG steps (FC-74).

Tools and car:
- Measure the hook-and-loop back and the face of one yellow and one maroon pad, and read any model number: 534 or 572 means a 5 in. back; 634 or 672 means a 6 in. back (FC-54).
- Is the black pad a Uro-Tec (FC-69)?
- Compressor make and model (FC-81).
- On the Model Y: Controls > Service shows Car Wash Mode (FC-13), and the build month on the driver door jamb label (FC-33).
- Call the HF parts line, 1-888-866-5797, with UPC 193175448170 (FC-60).

Answers only Lando can give:
- What Tuff Stuff and Blazin' Banana are for (FC-76, FC-77).
- For each bagger customer: belt or chain (FC-85).
- Is the home inside Tooele City limits (FC-97 to FC-100)?
- DJ's age, whether DJ is paid, and whether DJ lives in the home (FC-100, FC-105 to FC-107).
- Prices tax-included or tax-added (FC-96).
- Ask the insurance agent, in writing, whether polishing damage is covered (FC-104).
- Ask the Tax Commission (801-297-2200) whether an exterior-only hand wash with spray wax is taxable (FC-95).
- Call the city or county once about driveway runoff and write the answer down (FC-93, FC-98).

---

## Item 1: Chemical Guys Citrus Wash & Gloss

### FC-01: 1 oz per 5 gallons to wash
- **Claim (KB 4, KB 3.3; `content/cards/card-bucket-mix.yaml` rows "Label ratio to wash"; `content/products/product-cg-citrus-wash-gloss.yaml` dilutions):** label says 1 oz per 5 gal to wash.
- **Verdict:** confirmed.
- **Sources (checked 2026-10-10):**
  - Primary: https://www.chemicalguys.com/blogs/exterior-how-tos/how-to-choose-the-right-car-wash-soap (Chemical Guys' own guide): "Use just 1 oz for regular washes, or crank it up to 3 oz when you're prepping for a fresh start by stripping old coatings."
  - Primary: https://www.chemicalguys.com/products/citrus-wash-and-gloss-concentrated-ultra-premium-hyper-wash-and-gloss (product page, loaded directly). Its only "How to Use" text today is for a foam cannon: "Shake well and add 1-3 oz. to a 32 oz. solution tank of your foam cannon or gun. Wash vehicle with thick wash foam, then rinse. Dry with a premium microfiber towel." Sizes listed: 16 oz, 64 oz, 1 gallon (SKUs CWS_301_16, CWS_301_64, CWS_301). No bucket ratio on the page itself.
  - Retailer (supporting, read through the search index): https://www.detailedimage.com/Chemical-Guys-M31/Citrus-Wash-Gloss-P178/64-oz-S4/ reproduces label directions: "add 1 oz. of Citrus Wash & Gloss to 5 gallons of water."
  - Retailer (supporting): https://www.napaonline.com/en/p/NCBCWS30116 says "Just add 1-3 oz. of Citrus Wash and Gloss to a 5 gallon wash bucket."
- **Corrected wording:** none needed. Suggested source line: "Chemical Guys: 1 oz per 5-gallon bucket for a regular wash (Chemical Guys guide and retail copies of the label, checked 2026-10-10)."
- **Who applies:** lead with Lando (KB 4 tag to `[SOURCED 2026-10-10]`); content-curator (source notes in the two content files).

### FC-02: "Label says 1 oz per gallon to strip wax"
- **Claim (KB 4 "Label: ... 1 oz per gal to strip wax"; `content/cards/card-bucket-mix.yaml` lines 19 to 35; `content/glossary/term-strip-wash.yaml` line 5 "the label's strip-wax ratio" and lines 19 to 22; `content/products/product-cg-citrus-wash-gloss.yaml` lines 19 to 32, all marked sourced).**
- **Verdict:** corrected. No Chemical Guys source gives 1 oz per gallon as the strip ratio.
- **Sources (checked 2026-10-10):**
  - Primary: the Chemical Guys guide above: "crank it up to 3 oz when you're prepping for a fresh start by stripping old coatings." It does not say per how much water. Because the same sentence pairs it with "1 oz for regular washes" and the wash line is per 5-gallon bucket, the likely reading is 3 oz per 5-gallon bucket. That reading is an inference, not a quote.
  - Retailer (supporting, search index): Detailed Image's copy of the label: "when used in concentrations of 3oz or more, it can act as a paintwork cleanser to remove wax, sealant, and glaze."
  - Retailer (supporting, conflicts): NAPA's copy says 1 to 3 oz per 5-gallon bucket washes "without stripping any wax or sealant." A 2008 Detailed Image blog says 2 oz per gallon strips. A Detailed Image review says 1 oz per gallon strips. That review is the only place the KB's number appears.
- **What it means for the house bucket:** 4 oz in 4 gallons is more than 3 oz per 5-gallon bucket, so the house mix is at or above Chemical Guys' strip figure on the likely reading. The ratio does not need to change. Only the claim that "the label says 1 oz per gal" is wrong. Polishing follows anyway, which removes old wax.
- **Corrected wording:**
  - KB 4 row: "Pre-polish wash bucket | 4 gal water + 4 oz CG Citrus Wash & Gloss (1 oz per gal, house strip strength because polishing follows). Chemical Guys: 1 oz per 5-gal bucket to wash, about 3 oz to strip old wax; retail copies of the label say 3 oz or more acts as a paintwork cleanser that removes wax, sealant, and glaze. | ratio `[HOUSE]`; wash line `[SOURCED 2026-10-10]`; strip line `[VERIFY: read the strip line on Lando's 64 oz bottle]`"
  - Content: replace "Label ratio to strip wax: 1 oz per gal" with "Chemical Guys strip figure: about 3 oz per 5-gal bucket (status verify until Lando reads his bottle)". In `term-strip-wash.yaml`, replace "at 1 oz per gal, the label's strip-wax ratio" with "at 1 oz per gal (4 oz in the 4-gal bucket), above Chemical Guys' 3 oz strip figure", and set its status to verify.
  - KB 23 row "Wash with Ultimate Wash & Wax... Before polishing: Citrus at strip strength": no change.
- **Lando's one-glance check:** read the back of the 64 oz bottle and say what it prints for stripping wax.
- **Who applies:** lead with Lando (KB 4); content-curator (`card-bucket-mix.yaml`, `term-strip-wash.yaml`, `product-cg-citrus-wash-gloss.yaml`).

### FC-03: Pump-sprayer pre-soak with Citrus Wash & Gloss
- **Claim (KB 5.3 `[VERIFY method and product]`, KB 5.1 step 4, KB 23; `product-cg-citrus-wash-gloss.yaml` line 39, already verify).**
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-10):**
  - Primary: the Chemical Guys product page and guide above give directions for a wash bucket and a foam cannon or foam gun only. No pump sprayer, no pre-soak, no dwell time.
  - Primary: Tesla's Model Y manual cautions against pre-wash products (see FC-16), which matters for Lando's own car and every Tesla.
  - Forum (supporting only): https://autogeekonline.net/threads/chemical-guys-citrus-wash-and-gloss-ratio-question-in-a-foam-cannon.77314 discusses foam cannon mixes, not pump sprayers.
- **Update 2026-10-11:** FC-38 confirms the "no pre-wash products" caution is in the 2020 to 2024 Model Y manual, Lando's own car.
- **Corrected wording:** none. Keep `[VERIFY]`. Suggested note for KB 5.3: "Chemical Guys gives no pump-sprayer, pre-soak, or dwell-time direction for Citrus Wash & Gloss (checked 2026-10-10). Not in any SOP until a label or Chemical Guys answer covers it. On Teslas, see FC-16."
- **Next step that would settle it:** Lando reads the bottle for any pre-wash line, or asks Chemical Guys support whether a pump sprayer at strip strength is approved and for how long it may dwell.
- **Who applies:** lead with Lando (KB 5.3 note); content-curator keeps the pre-soak out of SOPs.

## Item 2: Meguiar's Hybrid Ceramic Wax

### FC-04: Spray on a wet car, rinse, dry; no buffing; no cure time
- **Claim (KB 9.1 `[SOURCED 2026-10-06] [VERIFY reconfirm label]`; `content/products/product-meguiars-hybrid-ceramic-wax.yaml` labelNotes, status verify).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-10):**
  - Primary (loaded directly): https://www.meguiars.co.uk/product/meguiars-hybrid-ceramic-wax-768ml/ (Meguiar's UK, a 3M site, item G190526EU): "After washing & rinsing off the soap, simply spray on Meguiar's Hybrid Ceramic Wax and then follow that with a second rinse with a strong stream of water. This final rinse helps to spread and lay down the wax evenly for you. Dry your vehicle like you would normally with a quality drying towel... There's no rubbing or buffing and there's no curing time." Benefits list: "No rubbing, curing, buffing or mess."
  - Primary (read through the search index; meguiars.com would not load): https://www.meguiars.com/automotive/products/meguiars-hybrid-ceramic-wax-easy-use-ceramic-wax-protection-g190526-26-oz gives the same wash, spray, second rinse, dry steps, "no curing time," and "ready to protect your paint the moment you rinse."
- **Corrected wording:** none. KB 9.1 can drop `[VERIFY reconfirm label]` for the standard method. Lando's US bottle still wins if its wording differs.
- **Who applies:** lead with Lando (KB 9.1 tag); content-curator (`product-meguiars-hybrid-ceramic-wax.yaml` status and source line).

### FC-05: "Wax as you dry" and two coats
- **Claim (KB 9.1: wet panel, light mist, dry with a clean towel, skip the second rinse; a next-day whole-car coat counts as the second coat).**
- **Verdict:** confirmed for apply-while-wet-then-dry and for two coats. The "next day" timing is a house choice; Meguiar's neither supports nor forbids it.
- **Sources (checked 2026-10-10):**
  - Primary (loaded directly): https://www.meguiars.co.uk/showroom/introducing-meguiars-hybrid-ceramic-wax/ (Meguiar's UK launch article, 27 Jan 2019): "For the absolute best results, we recommend applying two coats on panels. Simply apply while the car is still wet (after rinsing off any suds), dry it off with a clean Drying Towel, apply water once again before repeating the process." Also: "you actually apply this wax even before you've dried the bodywork."
  - The main product directions (FC-04) include the second rinse. The launch article's two-coat method does not mention it.
- **Corrected wording:** suggested addition to KB 9.1: "Meguiar's recommends two coats: apply on the wet car, dry, re-wet, and repeat. The next-day whole-car coat is `[HOUSE]`."
- **Who applies:** lead with Lando (KB 9.1); content-curator (`product-meguiars-hybrid-ceramic-wax.yaml` labelNotes).

### FC-06: Aftercare card line that says the protection needs the first day to set up
- **Claim (KB 16 aftercare card text, `[VERIFY against ceramic wax label]`). Customer-facing. The card is not written yet (`content/customer/` does not exist).**
- **Verdict:** corrected. Meguiar's says Hybrid Ceramic Wax has no curing time.
- **Sources (checked 2026-10-10):**
  - Primary: both Meguiar's pages in FC-04 ("there's no curing time"; "ready to protect your paint the moment you rinse").
  - Why the 24-hour idea exists: Meguiar's sells a different product, Hybrid Ceramic **Liquid** Wax (G200416EU). Its UK page (https://www.meguiars.co.uk/product/hybrid-ceramic-liquid-wax-473ml/) says "let it cure for 3-5 minutes, and then wipe off." A 24-hour cure for the liquid wax appears only in forum posts attributed to Meguiar's staff (Forum, supporting only: https://www.meguiarsonline.com/forum/general-auto-detailing-discussion/detailing-101/69401-questions-about-meguiar-s-hybrid-ceramic-liquid-wax, which now redirects and could not be read directly). It does not apply to the spray Lando uses.
- **Corrected wording (two options; Lando picks):**
  - Delete the line.
  - Or replace with: "Your ceramic wax needs no cure time. It started protecting the paint the day we applied it."
- **Phase 2 note (2026-10-11):** customer content is Phase 4. No aftercare text is written in Phase 2, and the 24-hour line appears nowhere in content.
- **Who applies:** lead with Lando (KB 16); business-customer (aftercare card text in `content/customer/`, Phase 4).

### FC-07: 32 oz bottle
- **Claim (KB 3.3 "Meguiar's Hybrid Ceramic Wax, 32 oz"; `product-meguiars-hybrid-ceramic-wax.yaml` title).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-10):**
  - Primary (read through the search index): https://www.meguiars.com/ingredient-search/hybrid-ceramic-wax-g1905-g190526-g190532sp lists "Hybrid Ceramic Wax G1905 [G190526 G190532SP]". G190526 is the 26 oz; G190532SP is the 32 oz.
  - Retailer (supporting): https://www.ubuy.co.in/product/QMWQZQ-meguiars-g190532sp-hybrid-ceramic-wax-the-car-enthusiasts-car-wax-32-fluid-ounces names G190532SP as 32 fl oz.
- **Corrected wording:** none.
- **Who applies:** nobody; informational.

## Item 3: IPA panel wipe

### FC-08: 1 cup 70% IPA + 3 cups water, "about 17%"
- **Claim (KB 4 `[HOUSE] [VERIFY ratio]`, KB 23; `content/cards/card-ipa-wipe.yaml` rows at lines 20 to 28; `content/products/product-ipa-70.yaml` line 21).**
- **Verdict:** unconfirmed. No primary source sets a panel-wipe strength. The old 50/50 (KB 23, superseded) has no primary source either.
- **The math:** 1 cup of 70% IPA holds 0.7 cup of alcohol; in 4 cups total that is **17.5%**. "About 17%" is close but slightly low.
- **Sources (checked 2026-10-10):**
  - Meguiar's: no Meguiar's page found that gives a panel-wipe ratio or asks for an IPA wipe before its waxes. meguiars.com and its forum could not be loaded directly. Forum posts summarized by search (supporting only, not read directly) say Meguiar's staff called an IPA wipe unnecessary before a Meguiar's wax; that is unconfirmed.
  - Primary (Chemical Guys, read through the search index): https://www.chemicalguys.com/article-how-do-i-prep-for-a-ceramic-coating.html says to "Wipe the surface with isopropyl alcohol (IPA) to remove leftover oils or polishing residue," with no ratio.
  - Primary (another maker's ready-to-use prep, loaded directly): https://adamspolishes.com/surface-prep.html: "Special lubricated formula infused with 30% IPA concentration" and "we have previously supplied our Coating Prep with a 12% IPA mixture." So commercial preps sit between 12% and 30%. The house 17.5% falls inside that band.
  - Primary (Tesla, read through the search index, see FC-16): the Model Y manual allows denatured alcohol on paint for tar and grease, "then immediately wash the area with water and a mild, non-detergent soap to remove the alcohol." Context only. The 2020 to 2024 manual (read directly 2026-10-11, FC-38) also says "Use isopropyl alcohol wipes (such as those used to clean glasses or screens) to clean away small stains."
  - Forum (supporting only): 15 to 25% and 50/50 both appear (https://www.meguiarsonline.com/forum/general-auto-detailing-discussion/machines-the-rotary-polisher/36426-proper-dilution-for-ipa-wipedown; https://autogeekonline.net/threads/alcohol-wipe-down.8309).
- **Corrected wording (math fix regardless of verdict):** "1 cup 70% IPA + 3 cups water (17.5% alcohol)." Suggested KB 4 note: "No maker sets a panel-wipe strength. Ready-to-use preps run 12% to 30% (Adam's). The house mix is a house choice." If Lando accepts that, the lead can retag the ratio `[HOUSE]` and drop `[VERIFY ratio]`; the strength itself stays unsourced.
- **Who applies:** lead with Lando (KB 4, KB 23); content-curator (`card-ipa-wipe.yaml` "About 17% alcohol" to "17.5% alcohol"; `product-ipa-70.yaml` line 21 the same).

## Item 4: Meguiar's M210 and Ultimate Compound

### FC-09: M210 product name as printed
- **Claim (KB 3.3 "Meguiar's M210 (finishing polish)"; `content/products/product-meguiars-m210.yaml` title).**
- **Verdict:** confirmed. Meguiar's full name: **Meguiar's M210 Mirror Glaze Ultra Pro Finishing Polish.**
- **Sources (checked 2026-10-10):**
  - Primary (read through the search index): https://www.meguiars.com/professional/products/meguiars-m210-mirror-glaze-ultra-pro-finishing-polish-deep-glossy-finish ("Meguiar's M210 Mirror Glaze Ultra Pro Finishing Polish") and https://www.meguiars.com/products/professional/paint/meguiars-professional-m210-ultra-pro-finishing-polish-mirror-glaze ("Meguiar's Professional M210 Ultra Pro Finishing Polish Mirror Glaze, M21032, 32oz"). Gallon: M21001.
  - Retailer (supporting): https://www.detailedimage.com/Meguiars-M43/Ultra-Pro-Finishing-Polish-M210-P1792/16-oz-S3/ lists a 16 oz size.
- **Corrected wording:** suggested title "Meguiar's M210 Ultra Pro Finishing Polish". Lando's bottle size is not in the KB.
- **Who applies:** content-curator (`product-meguiars-m210.yaml` title); lead (KB 3.3 name, optional).

### FC-10: M210 "label says it is built for dark and sensitive paint"
- **Claim (KB 3.3; `product-meguiars-m210.yaml` lines 19 to 26).**
- **Verdict:** corrected. Meguiar's says it leaves a deep, glossy finish **even on** dark and sensitive paints. It is sold as the finishing step after compounding (M110), safe by hand, DA, or rotary. It does not say it is built for dark paint.
- **Sources (checked 2026-10-10):**
  - Primary (read through the search index): the two meguiars.com M210 pages above: rich polishing oils for "a deep, glossy finish on dark and sensitive paints"; "the perfect final step to obtain show car, swirl-free results after using Meguiar's M110"; "safe and effective when working by hand, Dual Action Polisher or Rotary Buffer with virtually no dust or sling."
  - Retailer (supporting): Detailed Image's label copy: "Creates deep, glossy finish even on dark and sensitive paints."
- **Corrected wording:** KB 3.3 row: "Meguiar's M210 Ultra Pro Finishing Polish | Polish. Meguiar's says it leaves a deep, glossy finish even on dark and sensitive paints, and is safe by hand, DA, or rotary | `[SOURCED 2026-10-10]`". Content labelNotes: "Meguiar's says it creates a deep, glossy finish even on dark and sensitive paints."
- **Who applies:** lead with Lando (KB 3.3); content-curator (`product-meguiars-m210.yaml`).

### FC-11: Ultimate Compound name and size
- **Claim (KB 3.3 "Meguiar's Ultimate Compound, 15.2 oz"; `content/products/product-meguiars-ultimate-compound.yaml` title).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-10):**
  - Primary (read through the search index): https://www.meguiars.com/products/automotive/paint/meguiars-ultimate-compound-g17216-152oz ("Meguiar's Ultimate Compound, G17216, 15.2oz"): "safe and effective by hand or dual action polisher like Meguiar's MT300"; clear coat safe.
  - Primary (loaded directly): https://www.meguiars.co.uk/product/ultimate-compound-450ml/ (G17216EU): "Whether working by hand or with our DA polisher."
- **Corrected wording:** none. Suggested source line for the content file: "Meguiar's, item G17216, 15.2 oz, checked 2026-10-10."
- **Who applies:** content-curator (add the source line).

### FC-12: Label directions on pad and speed (M210 and Ultimate Compound)
- **Claim (brief item 4; relates to KB 8.2 pad priming and 8.3 speed 4).**
- **Verdict:** unconfirmed. No Meguiar's page found gives a pad type or a speed number for either product.
- **Sources (checked 2026-10-10):**
  - Primary: the Meguiar's pages in FC-10 and FC-11 say only "by hand, Dual Action Polisher or Rotary" (M210) and "by hand or dual action polisher" (Ultimate Compound).
  - Primary for a different machine (read through the search index): Meguiar's MT300 instructions (https://m.media-amazon.com/images/I/C17AWntVasL.pdf) pair Ultimate Compound with a red foam cutting disc at 5,800 OPM on the MT300. That is Meguiar's own machine and does not translate to the Bauer dial.
  - Retailer (supporting only): Detailed Image's M210 label copy: "SHAKE WELL. Always work on a cool, properly cured paint surface. Prime new or dry pads by misting on M34 Final Inspection... apply moderate pressure on initial passes, reducing pressure gradually with final passes." The same listing says "Set polisher to 4-5 (for MT310 set 3,800-4,800 opm's)," which may be copied from another product.
- **Possible conflict to check:** if Lando's M210 bottle says to prime pads with M34 Final Inspection (a Meguiar's spray), that differs from the house rule to mist the pad with water (KB 8.2, `card-pad-priming.yaml`, `card-machine-settings.yaml`). Lando does not own M34.
- **Corrected wording:** none until the bottles are read. Keep KB 8.2 and 8.3 as `[HOUSE]`.
- **Lando's one-glance check:** read the directions on the back of the M210 bottle and the Ultimate Compound bottle and say what they print for pad, speed, and priming.
- **Who applies:** lead with Lando (KB 8.2 note if the label conflicts); content-curator.

## Item 5: Tesla Car Wash Mode

### FC-13: Menu path for current software
- **Claim (KB 11 "Controls > Service > Car Wash Mode" `[VERIFY menu path for current software and other model years]`; `content/cards/card-tesla-wash-mode-tape.yaml` line 24 to 26, status verify).**
- **Verdict:** confirmed for the 2020 to 2024 Model Y (Lando's 2022), current manual.
- **Sources (checked 2026-10-10):**
  - Primary (read through the search index; tesla.com refused direct loading with HTTP 403): https://www.tesla.com/ownersmanual/2020_2024_modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html: "To enable, touch Controls > Service > Car Wash Mode. Your vehicle must be stationary and not actively charging."
  - Primary (search index): the matching PDF is titled "MODEL Y 2020 to 2024 OWNER'S MANUAL Software version: 2026.32 North America" (Tesla prints a dash between the years; written here as "to") (https://www.tesla.com/ownersmanual/2020_2024_modely/en_us/Owners_Manual.pdf), so the online manual reflects 2026 software.
  - Update 2026-10-11: the China edition of the same manual (software 2026.26.200.11), read directly, prints the same path (FC-38).
- **Corrected wording:** none for the path. Add: "The car must be parked and not charging."
- **Lando's one-glance check:** on the car, tap Controls > Service and confirm Car Wash Mode is there.
- **Who applies:** lead with Lando (KB 11 tag for the 2020 to 2024 Model Y); content-curator (`card-tesla-wash-mode-tape.yaml` status on the menu path row).

### FC-14: What Car Wash Mode does
- **Claim (KB 11 "Closes windows, locks the charge port, disables auto wipers and Sentry"; same card, "What it does").**
- **Verdict:** confirmed. The manual lists two more things.
- **Source (checked 2026-10-10):** the Tesla page in FC-13: "Car Wash Mode closes all windows, locks the charge port, and disables windshield wipers, Sentry Mode, walk-away door locking, and parking sensor chimes." "Car Wash Mode disables if the vehicle's speed exceeds 9 mph (15 km/h) or by touching Exit on the touchscreen." "Failure to put Model Y in Car Wash Mode may result in damage (for example, to the charge port or windshield wipers). Damage caused by car washes is not covered by the warranty."
- **Corrected wording (fuller):** "Closes all windows, locks the charge port, and turns off the wipers, Sentry Mode, walk-away door locking, and parking chimes. The car must be parked and not charging. It turns off above 9 mph or when you touch Exit."
- **Who applies:** lead with Lando (KB 11); content-curator (`card-tesla-wash-mode-tape.yaml` line 28).

### FC-15: Other model years
- **Claim (KB 11 `[VERIFY ... other model years]`).**
- **Verdict:** unconfirmed. The 2025+ Model Y has its own manual (https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html); its Car Wash Mode text could not be read. Model 3, S, X, and Cybertruck manuals describe the same mode; their menu paths were not checked.
- **Update 2026-10-11:** the 2025+ Model Y path is now confirmed (FC-39), and the Model 3 path was seen through the search index. Model S, Model X, and Cybertruck stay unchecked, so this entry stays unconfirmed for them.
- **Corrected wording:** none. Keep `[VERIFY per vehicle]` for models other than the Model Y.
- **Who applies:** nobody yet.

### FC-16: Tesla manual cautions vs the house SOP (new finding)
- **Claims affected:** KB 5.1 step 2 (Armor All Extreme Wheel & Tire on the wheels, including Lando's Model Y), KB 5.3 (pump-sprayer pre-soak), KB 8.5 rung 3 (Ultimate Compound), KB 11 (Tesla specifics, which say nothing about these).
- **Verdict:** conflicting.
- **Sources (checked 2026-10-10, all primary, read through the search index; tesla.com refused direct loading):**
  - "Do not use chemical based wheel cleaners or pre-wash products. These can damage the finish on the wheels." Seen on the current Model Y manual page (https://www.tesla.com/ownersmanual/modely/en_ae/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html) and with the same wording in the Model 3, Model S, Model X, and Cybertruck manuals.
  - "Do not use cutting pastes, color restoration compounds, or polishes containing harsh abrasives. These can scour the surface and permanently damage the paint." Current Model Y manual (https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html).
  - "If necessary, use denatured alcohol to remove tar spots and stubborn grease stains, then immediately wash the area with water and a mild, non-detergent soap to remove the alcohol." Same page.
  - "Damage or discoloration from cleaning products is not covered by the warranty." Same page.
  - Caveat: these sentences were seen on the current (2025+) Model Y pages and other models. The 2020 to 2024 Model Y page could not be loaded to check each sentence; the wording is consistent across every Tesla manual found.
  - **Update 2026-10-11: caveat closed.** Every sentence above is in the 2020 to 2024 Model Y manual (China edition, read directly). See FC-38. The verdict stays conflicting.
- **Why it matters:** wheel finish damage and paint damage on a customer's Tesla, with Tesla's warranty excluding cleaning-product damage. Lando's own car is a Tesla.
- **Corrected wording:** none from the fact-checker; this is Lando's decision. Suggested KB 11 addition so the conflict is visible: "Tesla's manual says: no chemical-based wheel cleaners or pre-wash products (wheel finish damage); no cutting pastes, color restoration compounds, or harsh-abrasive polishes (paint damage); cleaning-product damage is not covered by Tesla's warranty. Lando decides how the wheel step, the pre-soak, and the compound rung apply to Teslas. `[HOUSE pending]`"
- **Who applies:** lead with Lando (KB 5.1, 5.3, 8.5, 11); content-curator (Tesla branch SOP, `card-tesla-wash-mode-tape.yaml`, `product-armor-all-extreme-wheel-tire.yaml`); troubleshooter (any Fix-It node that suggests compound or wheel cleaner on a Tesla).

## Item 6: Bauer 56367 backing plate and HF 64913

The owner's manual was loaded directly: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf (12 pages, "Copyright© 2021 by Harbor Freight Tools", UPC 193175448170). harborfreight.com product pages showed a bot check, so their spec tables were read through the search index. HF's coupon site (https://go.harborfreight.com/sku/56367/) loaded directly.

### FC-17: Backing plate thread M8 x 1.25
- **Claim (KB 3.1, KB 14; `equipment-bauer-56367.yaml` line 62 to 65; `equipment-backing-plate.yaml` line 32 to 34).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-10):**
  - Primary (read through the search index): https://www.harborfreight.com/75-amp-6-in-20-mm-long-throw-random-orbit-da-polisher-56367.html spec table: "Thread Size: M8-1.25"; "Accessories Included: Premium 6 in. BAUER hook-and-loop backing pad"; model 1918E-B.
  - Forum (supporting only): https://www.autogeekonline.net/forum/auto-detailing-tools-and-accessories/126678-new-bauer-hf-56367-long-throw-polisher-non-standard-backing-plate.html (owner found the stock plate uses a center cap screw and a standard male-thread plate did not match).
- **Corrected wording:** none for the thread. See FC-18 for the source line.
- **Who applies:** lead (KB 3.1 and 14 tags).

### FC-18: "M8 x 1.25 comes from the manual's spec listing"
- **Claim (KB 3.1 "(manual spec listing; AutoGeek forum owner report)"; `equipment-bauer-56367.yaml` line 26 "M8 x 1.25 spec listing" under the manual; `equipment-backing-plate.yaml` lines 19 to 21 "BAUER 56367 owner's manual spec listing").**
- **Verdict:** corrected. The manual's spec table lists only "Electrical Rating 120VAC / 60Hz / 7.5A", "No Load Speed n0: 2000-4600/min", and "Max Accessory Diameter 6" (150mm)". No thread size anywhere in the manual. The M8-1.25 figure is on the HF product page.
- **Source (checked 2026-10-10):** the manual PDF above, page 7.
- **Corrected wording:** KB 3.1 and 14 source: "(HF product page spec listing; AutoGeek forum owner report)". Content: move the M8 note from the manual source to the HF product page source in both files.
- **Who applies:** lead with Lando (KB 3.1, 14); content-curator (`equipment-bauer-56367.yaml`, `equipment-backing-plate.yaml`).

### FC-19: HF 64913 is 5/16 in.-24 and does not fit
- **Claim (KB 14: "$6.99 BAUER 6 in. backing pad... item 64913 is 5/16 in.-24 thread. It does not fit the 56367"; `equipment-backing-plate.yaml` line 35 to 37).**
- **Verdict:** confirmed. 5/16 in.-24 (inch thread, 24 threads per inch) and M8-1.25 (metric) are different threads and do not interchange.
- **Sources (checked 2026-10-10):**
  - Primary (read through the search index): https://www.harborfreight.com/6-in-hook-and-loop-backing-pad-for-dual-action-and-random-orbit-polishers-64913.html: "Arbor Size: 5/16 in. -24"; model 1914A-B; 6 in.; thickness 0.65 in.; max 10,000 RPM; listed at $6.99 (page last indexed about 44 days before this check, so the price may have moved).
  - Primary (loaded directly): https://go.harborfreight.com/sku/64913/ describes the pad but shows no thread or price.
- **Corrected wording:** none. Price stays internal and dated.
- **Who applies:** lead (KB 14 tag).

### FC-20: Tech and parts line printed in the manual
- **Claim (KB 3.1, KB 14 "1-888-866-5797"; `equipment-bauer-56367.yaml` line 66 to 68).**
- **Verdict:** confirmed. Every manual page footer reads "For technical questions, please call 1-888-866-5797." Page 11 adds: "Specify UPC 193175448170 when ordering parts" and "Some parts are listed and shown for illustration purposes only, and are not available individually as replacement parts."
- **Source (checked 2026-10-10):** the manual PDF above.
- **Corrected wording:** suggested KB 14 "First call" line: "HF tech and parts line, 1-888-866-5797 (printed in the manual). Give them UPC 193175448170 and ask for the replacement backing pad for item 56367. The manual warns some parts are not sold separately. `[VERIFY availability]`"
- **Who applies:** lead with Lando (KB 14); content-curator (`equipment-backing-plate.yaml` "First call" row).

### FC-21: Plate bolts on through a center hole
- **Claim (KB 3.1 "bolts on through a center hole with a low-head cap screw"; `equipment-backing-plate.yaml` line 29 to 31).**
- **Verdict:** confirmed. Manual page 10, "Replacing Backing Pad": "Using hex wrench, turn Spindle Bolt counterclockwise to remove Backing Pad. Replace Backing Pad and Spindle Bolt. Do not overtighten bolt." "If necessary, Spindle Lock is located under Auxiliary Handle. To access Spindle Lock, remove two screws and slide Auxiliary Handle off." The manual calls it the Spindle Bolt; "low-head cap screw" is the forum owner's term.
- **Source (checked 2026-10-10):** the manual PDF above.
- **Corrected wording:** optional: "Bolts on through a center hole with the Spindle Bolt (hex wrench; spindle lock is under the auxiliary handle). Do not overtighten."
- **Who applies:** content-curator (`equipment-backing-plate.yaml`).

### FC-22: Polisher speed for polishing
- **Claims affected:** KB 3.1 "HF guidance: speeds 2 to 3 for wax or sealant, 4 to 6 for polishing or compounding"; KB 8.3 "Work on speed 4"; `card-machine-settings.yaml` lines 33 to 36; `equipment-bauer-56367.yaml` lines 52 to 60.
- **Verdict:** conflicting. Two Harbor Freight sources disagree.
- **Sources (checked 2026-10-10):**
  - Primary (loaded directly): https://go.harborfreight.com/sku/56367/: "Use speeds 2-3 for applying or removing wax or sealants, speeds 4-6 when compounding or polishing to remove defects." (Same text on the harborfreight.com product page, read through the search index.)
  - Primary (loaded directly): the manual, page 8, step 3: "NOTICE: Only use slower speeds for polishing. Otherwise, damage may occur to the paint being polished. Harbor Freight Tools is not responsible for damage to the vehicle's finish due to improper use of this tool." The manual's operating steps are written around applying and buffing wax with a foam pad and a bonnet.
- **Corrected wording:** none from the fact-checker. Suggested KB 3.1 addition so both show: "The 2021 manual says 'Only use slower speeds for polishing' and does not define slower. Lando decides; until then the house setting (speed 4) stands as `[HOUSE]`."
- **Who applies:** lead with Lando (KB 3.1, 8.3); content-curator (`card-machine-settings.yaml`, `equipment-bauer-56367.yaml`).

### FC-23: Polisher pressure
- **Claim affected:** KB 8.3 "About 10 lb of pressure"; `card-machine-settings.yaml` line 40 to 41.
- **Verdict:** conflicting.
- **Source (checked 2026-10-10):** the manual, page 8, step 7: "Keep pressure off of the tool when operating. The Foam Pad should LIGHTLY contact the polishing surface." The manual also says "Start and stop the tool only while it is held firmly against the surface of the vehicle," which matches KB 8.3's pad-on-paint rule.
- **Corrected wording:** none from the fact-checker. Suggested KB 8.3 note: "The 56367 manual says to keep pressure off the tool and let the pad lightly contact the paint. The 10 lb figure is `[HOUSE]`."
- **Who applies:** lead with Lando (KB 8.3); content-curator (`card-machine-settings.yaml`).

### FC-24: Abnormal vibration; test run
- **Claim (KB 3.1 "Manual: if abnormal vibration occurs, stop use immediately"; `equipment-bauer-56367.yaml` line 78 to 79).**
- **Verdict:** confirmed. Manual page 3, Vibration Safety: "To reduce vibration, maintain the tool as explained in this manual. If abnormal vibration occurs, stop use immediately." Page 10: "Do not use damaged equipment. If abnormal noise or vibration occurs, have the problem corrected before further use."
- **New fact for Fix-It FIX-01:** page 7, "Setting and Testing": "1. Ensure Polishing Pad is correctly mounted on Backing Pad. 2. Plug in tool. 3. Set Speed Switch to highest speed. 4. Press the Trigger and test run tool for at least 30 seconds. 5. If abnormal noise or vibration occurs, have the problem corrected before further use." Page 10 also lists a check before each use: loose hardware, misalignment or binding of moving parts, cracked or broken parts.
- **Source (checked 2026-10-10):** the manual PDF above.
- **Corrected wording:** none. Suggested addition to KB 21 FIX-01 checks: "Manual test: pad mounted, highest speed, run 30 seconds off the car. Abnormal noise or vibration: stop and get it fixed before polishing."
- **Who applies:** lead with Lando (KB 3.1, KB 21); troubleshooter (FIX-01); content-curator (`equipment-bauer-56367.yaml` checks).
- **Not rechecked here:** the HF FAQ line "center the foam pad on the backing pad and spread compound evenly" (KB 3.1). Checked 2026-10-11 in FC-62.

### FC-25: Pad washing
- **Claim affected:** KB 13.1 (warm water by hand with a drop of detergent, press out, dry face down on a rack).
- **Verdict:** conflicting, for HF pads only.
- **Source (checked 2026-10-10):** the manual, page 10: "Remove the Pad from the tool when not in use. This will allow the Pad to dry and retain its original shape. The Pads may be machine-washed in cold water with detergent. Then machine-dry the Pads at medium heat."
- **Scope:** this is Harbor Freight's guidance for its pads (the HF finishing pads in KB 3.2). Lando's main pads are Buff and Shine Uro-Tec. Update 2026-10-11: Buff and Shine's care guidance is in FC-70 (it says never put its pads in the dryer).
- **Corrected wording:** none. Suggested KB 13.1 note: "HF's manual allows machine washing HF pads cold and drying on medium. Uro-Tec care: see FC-70."
- **Who applies:** lead with Lando (KB 13.1); content-curator (`equipment-pad-hf-finishing.yaml`).

---

## Item 7: Wheels and tires (Armor All, Meguiar's Hot Shine)

### FC-26: Armor All Extreme Wheel & Tire: 30 seconds, not about a minute
- **Claim (KB 5.1 step 2 "Spray face and barrel, wait about a minute, brush, rinse before it dries"; KB 4 Wheels row).** Content that says "about a minute": `content/products/product-armor-all-extreme-wheel-tire.yaml`, `content/sops/sop-wheels.md`, `content/sops/sop-wheels-tesla.md`, `content/lessons/lesson-l1-01-wheels-first.md`, `content/academy/drills/drill-l1-wheels.md`, `content/academy/quizzes/quiz-l1-01-wheels-01.yaml`, `content/academy/flashcards/flash-times-wheel-wait.yaml`, `content/fixit/fix-60.md`.
- **Verdict:** corrected. The label says 30 seconds and says to wet and cool the wheel first.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: https://armorall.com/product/extreme-wheel-tire-cleaner, Usage Directions: "Use Armor All® Extreme Wheel & Tire Cleaner on one wheel at a time. Wear eye protection and rubber gloves. Wet and cool the wheel with a hose. Hold the bottle 6 inches from the wheel and completely saturate it. Allow the foam to penetrate for 30 seconds. Wipe it with a soft cloth or sponge. Thoroughly rinse the wheel. Dry it with a soft, clean towel." Sizes: 24 oz and 4 oz.
- **Corrected wording:**
  - KB 5.1 step 2: "Wheels and tires first. Wet and cool the wheel with the hose. Spray the face and barrel. Let it work 30 seconds (label). Brush, then rinse the wheel well before it dries. One wheel at a time. Wheel brushes never touch paint." Note under it: "The label says to wipe with a soft cloth or sponge. Brushes are a house choice."
  - Content: every "about a minute" for this product becomes "Let it work 30 seconds."
  - On a Tesla this settles nothing. FC-16 and FC-38 still govern wheel cleaner on Teslas, and that stays pending for Lando.
- **Why it matters:** the house wait is double the label's. The label is the rule (KB 0, house rule 12), and the label warns that hazing or spots can appear on a wheel.
- **Who applies:** lead with Lando (KB 5.1, KB 4); content-curator (product file, `sop-wheels.md`, `sop-wheels-tesla.md`, `lesson-l1-01-wheels-first.md`); learning-designer (`drill-l1-wheels.md`, `quiz-l1-01-wheels-01.yaml`, `flash-times-wheel-wait.yaml`); troubleshooter (`fix-60.md`).

### FC-27: Armor All Extreme Wheel & Tire label cautions
- **Claim (KB 5.1 step 2, KB 4 Wheels row, and KB 12.2 Wash & Protect on bike wheels give the wheel step with no protective gear, test spot, or limits).**
- **Verdict:** corrected. The label adds cautions the KB leaves out.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: https://armorall.com/product/extreme-wheel-tire-cleaner: "Wear eye protection and rubber gloves." "Prior to use on motorcycles or uncoated polished aluminum, check with manufacturer. Before use, test on an inconspicuous area. If hazing or spots appear, discontinue use. Do not apply to brake parts or other zinc- and cadmium-plated surfaces. Do not use on wheels with damaged clear coats." "Do not use on wheels that are warm to the touch or damaged." "Safe on clear-coated and factory-painted wheels."
- **Corrected wording:** add to the wheel step: "Wear eye protection and rubber gloves. Test a hidden spot first. If it hazes or spots, stop. Never on a warm or damaged wheel, or a wheel with damaged clear coat. Keep it off the brakes." Add a label row: "Motorcycle wheels and uncoated polished aluminum: the label says check with the maker before use." Add a pending row, status verify: "What to use on bike wheels: Lando decides (pending)."
- **Why it matters:** eye and skin safety for a teen helper, and wheel and brake damage on customer cars and bikes.
- **Who applies:** lead with Lando (KB 5.1, 4, 12.1, 12.2); content-curator (product file, `card-bike-rules.yaml`, `card-setup-kit.yaml` gloves and eye protection in the Wheels bin, `sop-wheels.md`, `sop-wash-bike.md`, `lesson-l0-02-stay-safe.md`, `lesson-l1-01-wheels-first.md`); learning-designer (`drill-l1-wheels.md`, `drill-l0-safety-start.md`); troubleshooter (`fix-30.md` bike rules).

### FC-28: Tire shine: spray the applicator (house) or spray the tire (label)
- **Claim (KB 9.2 and 3.3: "Spray onto the applicator, not the tire. Thin, even coat. Wipe the rubber-to-wheel edge.").**
- **Verdict:** conflicting.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: https://armorall.com/product/extreme-tire-shine-spray: "Hold bottle 4 to 6 inches away from a clean, dry tire and spray evenly." "Do not wipe as any drips or runs will disappear, leaving a brilliant shine." "Do not use on or near clear plastic surfaces, glass (may cause smearing), fabric, woven materials or paint."
  - Primary: https://armorall.com/product/extreme-tire-shine-aerosol: hold it 8 to 12 inches away; "Spray evenly on clean, dry tire." "Do not wipe."
- **Corrected wording:** none from the fact-checker. Rows for content:
  - House row (status house): "Tire shine: spray onto the applicator, not the tire. Thin coat. Wipe the rubber-to-wheel edge."
  - Label row (status sourced, the URLs above): "Armor All label: spray evenly onto a clean, dry tire from 4 to 6 inches (trigger) or 8 to 12 inches (aerosol). Do not wipe. Keep it off paint, glass, clear plastic, and fabric."
  - Pending row (status verify): "Lando decides which method the crew uses (pending)."
- **Why it matters:** the house method keeps overspray off paint; the label method is what the maker tested. The label also says keep it off paint, which supports the house concern.
- **Who applies:** lead with Lando (KB 9.2); content-curator (`product-armor-all-extreme-tire-shine.yaml`, `sop-tires-trim.md`); troubleshooter (`fix-20.md`).

### FC-29: Tire shine: let it set a few minutes
- **Claim (KB 9.2 "Let it set a few minutes before the car moves"; FIX-20).**
- **Verdict:** corrected. The labels give a minimum.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: trigger spray page above: "Allow product to dry for at least 3 to 5 minutes." "For maximum shine, let stand 15 minutes before repeating application."
  - Primary: aerosol page above: "Allow product to dry for at least 5 minutes."
- **Corrected wording:** "Let it dry at least 3 to 5 minutes before the car moves (Armor All trigger spray label). The aerosol label says at least 5 minutes." Lando owns the trigger or the aerosol; which one is not recorded.
- **Why it matters:** a car that moves too soon slings dressing down the paint (KB 9.2).
- **Who applies:** lead with Lando (KB 9.2); content-curator (`product-armor-all-extreme-tire-shine.yaml`, `sop-tires-trim.md`); troubleshooter (`fix-20.md`).

### FC-30: Tire shine is not for motorcycle tires or anything you grip or stand on
- **Claim (KB 2 rule 11, KB 12.1 "No tire shine on a motorcycle", "Nothing slick on brake rotors, grips, pegs, or the seat"; KB 10 "Steering wheel and pedals: clean, dry, zero slick").**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: trigger and aerosol pages above, both: "Not for use on floors, vehicle controls (pedals, grips, steering wheels), bench or cycle seats, cycle tires, brake drums and other parts where slipperiness may be hazardous."
- **Corrected wording:** none. Suggested source line for the bike card: "Armor All's tire shine label says not for cycle tires, cycle seats, pedals, grips, or steering wheels (checked 2026-10-11)." The house rule is stricter (not near the sidewall either) and stays house.
- **Why it matters:** a slick tire, seat, or grip can put a rider down.
- **Who applies:** content-curator (`card-bike-rules.yaml`, `product-armor-all-extreme-tire-shine.yaml`); troubleshooter (`fix-30.md`); lead (KB 12.1 tag).

### FC-31: Meguiar's Hot Shine: same rule as Armor All; never on a motorcycle
- **Claim (KB 3.3 "Tire shine backup, same rule"; KB 9.2; KB 12.1).**
- **Verdict:** unconfirmed. No Hot Shine label text was read from a primary source.
- **Sources (checked 2026-10-11; meguiars.com returned 503):**
  - Retailer (supporting): https://www.detailedimage.com/Meguiars-M43/Hot-Shine-Tire-Coating-P2726/15-oz-S1/ and other retail copies (search summaries only): Hot Shine Tire Coating is not for motorcycles, bicycles, or other two-wheeled vehicles and is sprayed directly onto the tire. Not verified on the page.
  - Meguiar's sells several products named Hot Shine: Tire Coating High Gloss (G13815, aerosol), Hot Shine Reflect (G18715, aerosol), and a trigger tire spray. Which one Lando owns is not recorded.
- **Corrected wording:** none. Keep the house rule.
- **Lando's one-glance check:** say which Hot Shine he owns and read its directions and its two-wheeler line.
- **Who applies:** lead with Lando (KB 3.3); content-curator (`product-meguiars-hot-shine.yaml`).

### FC-32: Meguiar's Hot Shine aerosols are flammable (new safety fact)
- **Claim (KB 3.3 and 9.2 give no handling line. KB 3.1 lists a heat gun in the kit).**
- **Verdict:** confirmed (new fact the KB lacks).
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: Meguiar's safety data sheet, "Hot Shine Tire Coating (High Gloss) G138 [G13815]", issue date 09/09/26, https://cdmsweb.3m.com/ingredientcommunication/file/Media/3D-RC8t5LUQ: "Flammable aerosol." "Pressurized container: may burst if heated." "Keep away from heat, hot surfaces, sparks, open flames and other ignition sources. No smoking." "Use only outdoors or in a well-ventilated area." Also: "Causes serious eye irritation."
  - Primary: Hot Shine Reflect G187 [G18715] safety data sheet, 05/22/25, https://cdmsweb.3m.com/ingredientcommunication/file/Media/FVKHlgbnvF4: signal word "Danger"; "Contains gas under pressure; may explode if heated."; "May be fatal if swallowed and enters airways."
- **Corrected wording:** add to the Hot Shine file, the setup kit, and the tire lesson: "This can is a flammable aerosol. Keep it away from the heat gun, hot surfaces, and sparks. Use it outdoors or where the air moves (Meguiar's safety data sheet)." This applies if Lando's Hot Shine is an aerosol; the trigger version was not checked.
- **Why it matters:** fire and burn risk in a garage that holds a heat gun, a compressor, and power tools.
- **Who applies:** lead with Lando (KB 3.3 or 9.2 note); content-curator (`product-meguiars-hot-shine.yaml`, `card-setup-kit.yaml`, `sop-tires-trim.md`, `lesson-l0-02-stay-safe.md`); learning-designer (`drill-l0-safety-start.md`, any safety quiz).

## Item 8: Tesla owner's manual (Model Y)

All Tesla quotes in this item were rechecked by the merge pass in the Model Y 2020 to 2024 owner's manual, China edition, software 2026.26.200.11, loaded directly: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf (pages 178 to 181, "Cleaning"). The 2025+ manual (https://www.tesla.cn/ownersmanual/modely/en_cn/Owners_Manual.pdf, page 200) carries the same cleaning cautions. The US pages were read through the search index (tesla.com returns 403).

Every Tesla conflict in this item uses the same three rows in content, as Lando's pending decision requires: the house line with status house, Tesla's line as its own row with status sourced and the URL, and the row "Lando decides how this applies to Teslas (pending)" with status verify.

### FC-33: Tesla camera lenses
- **Claim (KB 11 "Camera lenses: glass cleaner only").** Content with this line: `content/cards/card-tesla-wash-mode-tape.yaml` (row "Camera lenses"), `content/sops/sop-glass-tesla.md`, `content/lessons/lesson-l2-05-glass.md`, `content/lessons/lesson-l0-03-never-list.md`, `content/academy/flashcards/flash-tesla-cameras.yaml`, `content/academy/drills/drill-l2-glass.md`, `content/fixit/fix-19.md`, `fix-48.md`, `fix-81.md`.
- **Verdict:** conflicting. (Merged: found by the labels and tools sweeps.)
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly), 2020 to 2024 manual, page 178, "Cleaning a Camera": "For vehicles built from Gigafactory Shanghai prior to approximately mid-February 2024: Remove any build-up of dirt or debris by spraying water onto the camera lens with a spray bottle. Do not attempt to remove dirt or debris by wiping an exposed lens with your hands or a cloth. This debris can damage the surface of the lens when rubbed against it during wiping." Later builds: "spraying water onto the camera lens and drying it with a microfiber cloth." "CAUTION: Do not use chemical-based or abrasive cleaners. Doing so can damage the surface of the lens."
  - Primary (read through the search index), US page https://www.tesla.com/ownersmanual/2020_2024_modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html: the same split for "vehicles built from Fremont and Gigafactory Austin prior to approximately late May 2023."
  - Primary (loaded directly), 2025+ manual, page 200: "Remove any build-up of dirt or debris by spraying water onto the camera lens and drying it with a microfiber cloth."
- **Rows for content:**
  - House (status house): "Camera lenses: glass cleaner only."
  - Tesla (status sourced, the URLs above): "Tesla's manual: spray water on the lens. On a 2020 to 2024 Model Y built before about late May 2023 (Fremont or Austin), do not wipe the lens with a hand or a cloth. On later cars, dry it with a microfiber cloth. Never use chemical-based or abrasive cleaners on a lens."
  - Pending (status verify): "Lando decides how this applies to Teslas (pending)."
  - Note: a 2022 Model Y built in Fremont or Austin falls in the no-wipe group unless its build date says otherwise.
- **Why it matters:** wiping debris or using glass cleaner on a lens can scratch it, and the cameras run Tesla's driver assistance and safety features.
- **Lando's one-glance check:** read the build month on the driver door jamb label.
- **Who applies:** lead with Lando (KB 11); content-curator (card, `sop-glass-tesla.md`, the two lessons); learning-designer (`flash-tesla-cameras.yaml`, `drill-l2-glass.md`); troubleshooter (`fix-19.md`, `fix-48.md`, `fix-81.md`, and `fix-26.md` if it mentions lenses).

### FC-34: Tesla: avoid washing mitts
- **Claim (KB 5.2 alternative: two-bucket wash with a mitt; KB 6 clay mitt; both used on every car, Teslas included).** Content: `content/sops/sop-wash.md`, `content/sops/sop-wash-tesla.md`, `content/sops/sop-clay.md`, `content/lessons/lesson-l1-03-towel-wash.md`, `content/lessons/lesson-l1-05-clay.md`, `content/products/equipment-clay-mitt.yaml`, `content/academy/quizzes/quiz-l1-wash-decon-10.yaml`, `content/fixit/fix-17.md`.
- **Verdict:** conflicting.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly), 2020 to 2024 manual, "Cautions for Exterior Cleaning": "CAUTION: Avoid using tight-napped or rough cloths, such as washing mitts. A high-quality microfiber cleaning cloth is recommended." Same text in the 2025+ manual.
  - Same manual, "Cleaning the Exterior": "Hand wash Model Y using a clean soft cloth and cold or lukewarm water and a mild, high-quality car shampoo." "Dry thoroughly with a chamois."
- **Rows for content:**
  - House (status house): the towel method with 16 microfiber towels (this already fits Tesla's line), and the two-bucket mitt alternative.
  - Tesla (status sourced): "Tesla's manual says avoid tight-napped or rough cloths, such as washing mitts, and recommends a high-quality microfiber cloth."
  - Pending (status verify): "Lando decides how this applies to Teslas (pending)." This covers the two-bucket mitt method and the clay mitt on a Tesla.
- **Phase 4 note only (no text now):** the aftercare card's "microfiber mitt" line faces the same question for Tesla owners.
- **Why it matters:** paint marring on Teslas, and Tesla excludes damage from improper washing from its warranty.
- **Who applies:** lead with Lando (KB 5.2, 6, 11); content-curator (the SOPs, lessons, and clay mitt file above); learning-designer (`quiz-l1-wash-decon-10.yaml`, `drill-l1-clay.md`); troubleshooter (`fix-17.md`); business-customer (Phase 4 aftercare card).

### FC-35: Tesla: do not aim a hose at seals, windows, or modules
- **Claim (KB 5.1 step 3 "Pre-rinse on jet 3 to 4 minutes, top down, extra on bumpers, rockers, and behind the wheels", on Teslas as written).** Content: `content/sops/sop-wash-tesla.md`, `content/lessons/lesson-l1-02-pre-rinse.md`, `content/lessons/lesson-l1-06-full-wash.md`, `content/academy/drills/drill-l1-pre-rinse.md`, `content/academy/drills/drill-l1-full-wash.md`, `content/fixit/fix-14.md`, `fix-66.md`.
- **Verdict:** conflicting.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly), 2020 to 2024 manual, "Cautions for Exterior Cleaning": "CAUTION: Do not aim water hoses directly at windows, door, or hood seals or at electronic modules or exposed cabling." "CAUTION: Do not wash in direct sunlight." "CAUTION: Do not use hot water, detergents, highly alkaline or caustic cleaning ingredients or solvents, specifically those containing hydroxide." "Damage caused by improper washing is not covered by the warranty." For a future pressure washer: "maintain a distance of at least 30 cm between the nozzle and the surface of Model Y."
- **Rows for content:**
  - House (status house): "Pre-rinse on jet 3 to 4 minutes, top down."
  - Tesla (status sourced): "Tesla's manual says do not aim a hose directly at windows, door or hood seals, electronic modules, or exposed cabling, and do not wash in direct sunlight."
  - Pending (status verify): "Lando decides how this applies to Teslas (pending)."
  - The house shade rule already matches Tesla's sunlight line.
- **Why it matters:** water forced past seals or into modules on a customer's Tesla, with no warranty cover.
- **Who applies:** lead with Lando (KB 5.1, 11); content-curator (`sop-wash-tesla.md`, the lessons); learning-designer (the drills); troubleshooter (`fix-14.md`, `fix-66.md`).

### FC-36: Tesla touchscreen
- **Claim (KB 10 "Screens: dry microfiber or a screen-safe cleaner only," applied to Tesla touchscreens).** Content: `content/sops/sop-interior.md`, `content/lessons/lesson-l2-03-wipe-dress.md`, `content/academy/quizzes/quiz-l2-03-wipe-05.yaml`, `content/fixit/fix-32.md`, `fix-68.md`.
- **Verdict:** conflicting.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly), 2020 to 2024 manual, "Touchscreen": "Use a soft lint-free cloth specifically designed to clean monitors and displays. Do not use cleaners (such as a glass cleaner) or alcohol-based gel products (such as hand sanitizer) and do not use a wet wipe or a dry statically-charged cloth (such as a recently washed microfiber). To wipe the front touchscreen without activating buttons and changing settings, you can enable Screen Clean Mode. Touch Controls > Display > Screen Clean Mode." Also: "CAUTION: Statically-charged materials can cause damage to the touchscreen."
- **Rows for content:**
  - House (status house): "Screens: dry microfiber or a screen-safe cleaner only."
  - Tesla (status sourced): "Tesla touchscreen: turn on Screen Clean Mode (Controls > Display > Screen Clean Mode). Use a soft lint-free cloth made for displays. No cleaners such as glass cleaner, no hand sanitizer, no wet wipes, and no dry statically-charged cloth such as a recently washed microfiber."
  - Pending (status verify): "Lando decides how this applies to Teslas (pending)."
- **Why it matters:** a dry, freshly washed microfiber is the house tool, and Tesla names it as a cause of screen damage.
- **Who applies:** lead with Lando (KB 10, 11); content-curator (`sop-interior.md`, `lesson-l2-03-wipe-dress.md`, `product-meguiars-quik-interior-detailer.yaml`); learning-designer (`quiz-l2-03-wipe-05.yaml`); troubleshooter (`fix-32.md`, `fix-68.md`).

### FC-37: Tesla interior and seats
- **Claim (KB 10 interior SOP on every car: Quik Interior Detailer sprayed on the towel; "Leather: cleaner, then conditioner" `[VERIFY products owned]`; KB 11 lists no Tesla interior limits).** Content: `content/sops/sop-interior.md`, `content/lessons/lesson-l2-03-wipe-dress.md`, `content/products/product-meguiars-quik-interior-detailer.yaml`, `content/products/product-tuff-stuff.yaml`, `content/fixit/fix-74.md`.
- **Verdict:** conflicting. (Merged: the labels sweep said conflicting; the tools sweep said unconfirmed. The merge pass read the seat text directly: Tesla says conditioners are not recommended, and KB 10 says to condition.)
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly), 2020 to 2024 manual, "Cautions for Interior Cleaning": "CAUTION: Using solvents (including alcohol), alcohol-based gel products (such as hand sanitizer), bleach, citrus, naphtha, or silicone-based products or additives on interior components can cause damage."
  - Same manual, "Seats": "Moisten a soft cloth (preferably microfiber) with warm water and mild soap and gently wipe the stain in a circular motion. Then, wipe dry using a soft, lint-free cloth. Do not blow dry. Anything more than soap can be too harsh. Using other cleaning agents, disinfectants, conditioners, or protectants is not recommended." "CAUTION: Do not use products containing alcohol, bleach (sodium hypoclorite), citrus, naptha, or silicon-based additives. Do not spray the seat directly with any spray." (Tesla's spelling.)
  - Same manual: general cleaning with "a soft cloth (such as microfiber) dampened with a mixture of warm water and mild non-detergent cleaner (test all cleaners on a concealed area before use)"; "Do not polish the upper surfaces of the dashboard"; interior lighting: "Do not use any soap or chemical cleaning solutions on interior lighting"; carpets: "For heavily soiled areas, use a diluted upholstery cleaner"; seat belts: "Do not use any type of detergent or chemical cleaning agent"; door seals: "Avoid using alcohol wipes"; "The Tesla warranty does not cover damage caused by improper maintenance, including the use of cleaning solutions or tools that are not recommended in this Owner's Manual."
- **Rows for content:**
  - House: "Leather: cleaner, then conditioner (products not confirmed)." (status verify, as now). "Wipe hard surfaces with Quik Interior Detailer sprayed on the towel." (status house).
  - Tesla (status sourced): "Tesla's manual: no solvents (including alcohol), hand sanitizer, bleach, citrus, naphtha, or silicone-based products on interior parts. Seats: warm water and mild soap on a microfiber, then dry. No conditioners or protectants. Never spray the seat directly. Interior lights: a cloth with warm water only."
  - Pending (status verify): "Lando decides how this applies to Teslas (pending)."
  - Note for writers: Tesla's list covers IPA and anything citrus. Whether Quik Interior Detailer or Tuff Stuff contains a listed ingredient was not checked (see the queue).
- **Why it matters:** seat and trim damage inside a customer's Tesla, with Tesla's warranty excluding cleaning-product damage.
- **Who applies:** lead with Lando (KB 10, 11); content-curator (`sop-interior.md`, `lesson-l2-03-wipe-dress.md`, the two product files); troubleshooter (`fix-74.md`).

### FC-38: The FC-16 cautions are in the 2020 to 2024 Model Y manual
- **Claim (the FC-16 caveat: the wheel-cleaner, pre-wash, cutting-paste, and warranty sentences were seen only on 2025+ and other-model pages).**
- **Verdict:** confirmed. The caveat is closed. FC-16 itself stays conflicting.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** 2020 to 2024 manual, pages 178 to 181: "CAUTION: Do not use chemical based wheel cleaners or pre-wash products. These can damage the finish on the wheels." "CAUTION: Do not use cutting pastes, color restoration compounds, or polishes containing harsh abrasives. These can scour the surface and permanently damage the paint." "Damage or discoloration resulting from cleaning products is not covered by the warranty." "Do not use acidic products either." "Avoid exposure to soaps and chemicals above pH 13."
- **Other Tesla lines in the same pages, for Lando's rung-3 and wash decisions:** "you can occasionally treat the paint surfaces with an approved polish containing: Very mild abrasive to remove surface contamination without removing or damaging the paint. Filling compounds that fill scratches and reduce their visibility. Wax to provide a protective coating between the paint and environmental elements." "CAUTION: Do not use chrome polish or other abrasive cleaners." "If washing in an automatic car wash, use touchless car washes only." "Use isopropyl alcohol wipes (such as those used to clean glasses or screens) to clean away small stains."
- **Corrected wording:** none. Source line: "Tesla Model Y 2020 to 2024 owner's manual (China edition, software 2026.26), read 2026-10-11."
- **Why it matters:** Lando's own car is a 2022 Model Y, so the FC-16 conflict applies to it directly.
- **Who applies:** lead (log note on FC-16); content-curator (source rows in `card-tesla-wash-mode-tape.yaml`, `product-armor-all-extreme-wheel-tire.yaml`, `product-meguiars-ultimate-compound.yaml`, `product-cg-citrus-wash-gloss.yaml`, `sop-wheels-tesla.md`, `sop-wash-tesla.md`, `sop-polish-tesla.md`).

### FC-39: Car Wash Mode path on the 2025+ Model Y
- **Claim (KB 11 path "Controls > Service > Car Wash Mode" on other model years; the open part of FC-15).**
- **Verdict:** confirmed for the 2025+ Model Y.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** 2025+ manual, page 200: "To enable, touch Controls > Service > Car Wash Mode. Your vehicle must be stationary and not actively charging." "Car Wash Mode disables if the vehicle's speed exceeds 15 km/h or by touching Exit on the touchscreen." Model 3 (read through the search index, https://www.tesla.cn/ownersmanual/model3/en_nl/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html): the same path.
- **Corrected wording:** "Same path on the 2020 to 2024 and the 2025+ Model Y." The China edition gives speed in km/h only; the US edition says 9 mph (FC-14). Model S, Model X, and Cybertruck not checked.
- **Who applies:** lead (KB 11 tag); content-curator (`card-tesla-wash-mode-tape.yaml`); learning-designer (`flash-tesla-car-wash-mode.yaml`); troubleshooter (`fix-26.md`).

### FC-40: Tesla body cameras to tape
- **Claim (KB 11 "the five cameras (two B-pillar, two fender repeaters, one above the rear plate)"; "other model years and models have different cameras" `[VERIFY per vehicle]`).**
- **Verdict:** confirmed for the 2020 to 2024 Model Y. The 2025+ Model Y adds a sixth.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - 2020 to 2024 manual, "Cameras": "A camera is mounted above the rear license plate." "A camera is mounted in each door pillar." "Three cameras are mounted to the windshield above the rear view mirror." "A camera is mounted to each front fender."
  - 2025+ manual: "A camera is mounted above the grille on the front bumper." "Two cameras are mounted to the windshield above the rear view mirror." "The front-facing camera is equipped with a sprayer nozzle. To clean the front-facing camera, touch the app launcher, select the Camera app, and press the spray icon."
- **Corrected wording:** 2020 to 2024 Model Y: five body cameras, as written (the windshield cameras sit behind the glass). Add for the 2025+ Model Y: "Six body cameras. Also tape the front bumper camera above the grille. It has its own washer nozzle."
- **Why it matters:** an untaped camera on a newer car takes polish, and FC-33 says no abrasives on lenses.
- **Who applies:** lead (KB 11); content-curator (`card-tesla-wash-mode-tape.yaml`, `sop-tape-tesla.md`, `sop-polish-tesla.md`, `lesson-l4-05-edges-curves-heat.md`); learning-designer (`flash-tesla-cameras.yaml`, `flash-tesla-tape.yaml`); troubleshooter (`fix-13.md`, `fix-81.md`).

### FC-41: The Model Y roof is glass
- **Claim (KB 11 "The roof is glass. Skip it in the measure and polish routes. It gets washed, not polished.").**
- **Verdict:** confirmed that the roof is glass. Skipping it is house.
- **Sources (checked 2026-10-11):**
  - Primary (read through the search index): Tesla Model Y Service Manual contents, https://service.tesla.com/docs/ModelY/ServiceManual/en-us/GUID-4AF149E1-9CC3-48F7-B6F1-471068A8E8C9.html: "Glass - Roof - Fixed (Remove and Replace)".
  - Primary (loaded directly), 2020 to 2024 owner's manual: "Clean windows and mirrors using an automotive glass cleaner. Do not scrape or use any abrasive cleaning fluid on glass or mirrored surfaces."
  - Press (supporting): the 2025+ Model Y Standard has a glass roof covered inside by a headliner.
- **Corrected wording:** none. Optional for 2025+: "The Model Y Standard's roof is still glass outside, covered by a headliner inside."
- **Who applies:** lead (KB 11 tag); content-curator (`card-tesla-wash-mode-tape.yaml`); learning-designer (`flash-tesla-roof.yaml`).

### FC-42: Leave the wheel aero covers on during the wheel clean
- **Claim (KB 11).**
- **Verdict:** unconfirmed. No Tesla source covers cleaning with covers on or off.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly): Tesla DIY page "Removing and Installing Wheel Covers", https://service.tesla.com/docs/Public/diy/modely/en_us/GUID-377C88DB-7FBE-4320-BC1A-0A01AF48005C.html, covers removal for lug-nut access only: "To prevent the wheel cover from falling off, ensure that it is fully secured before driving."
- **Corrected wording:** none. Keep as house. Optional: "If a cover ever comes off, Tesla says it must be fully secured before the car moves."
- **Who applies:** content-curator (`card-tesla-wash-mode-tape.yaml`, `sop-wheels-tesla.md`, `lesson-l1-01-wheels-first.md`); learning-designer (`flash-tesla-wheels-port.yaml`); troubleshooter (`fix-78.md`).

### FC-43: Satin black window trim "turns chalky white" under polish
- **Claim (KB 11 tape list "satin black window trim (polish turns it chalky white)").**
- **Verdict:** unconfirmed for "chalky white." The tape rule stands as house, and two makers support keeping polish off it.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly), 2020 to 2024 manual, "Chrome and Metal Surfaces": "Polish, abrasive cleaners, alcohol-based gel products (such as hand sanitizer), and hard cloths can damage the finish on chrome and metal surfaces."
  - Primary (read through the search index; meguiars.com returned 503): Meguiar's Ultimate Compound G17216 page: "not for use on flat, matte, or satin finishes".
- **Corrected wording:** suggested: "Tape the satin black window trim. Tesla says polish can damage chrome and metal finishes, and Meguiar's says Ultimate Compound is not for satin finishes." Drop "turns it chalky white" or mark it status verify.
- **Who applies:** lead (KB 11 note); content-curator (`card-tesla-wash-mode-tape.yaml`, `sop-tape-tesla.md`, `lesson-l4-05-edges-curves-heat.md`); learning-designer (`flash-tesla-satin-trim.yaml`, `quiz-l4-machine-08.yaml`); troubleshooter (`fix-13.md`, `fix-81.md`).

## Item 9: Wash, water spots, and decon

### FC-44: Bug & Tar foam needs no scrubbing
- **Claim (KB 5.1 step 5 "No scrubbing," then wash it off; KB 3.3).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly): Meguiar's UK, 19 Aug 2018, https://www.meguiars.co.uk/showroom/introducing-meguiars-heavy-duty-bug-tar-remover/: "you simply spray it onto the effected bodywork and watch it instantly foam." "Simply wait and let it soften all stubborn contaminants." "you can use this in conjunction with normal cleaning (simply use your wash mitt over the top of the sprayed area) or jet wash it off without any other cleaning." "Works without scrubbing, spray on/hose off." The US item is believed to be Heavy Duty Bug & Tar Remover G180515, 15 oz (Meguiar's Direct listing); Lando's can is not confirmed as that item.
- **Corrected wording:** none. Suggested source line: "Meguiar's: spray on, let it soften, then hose it off or wash over it. No scrubbing."
- **Who applies:** content-curator (`product-meguiars-bug-tar.yaml`, `sop-wash.md`); lead (KB 5.1 tag).

### FC-45: Bug & Tar one-minute dwell
- **Claim (KB 5.1 step 5 "one-minute dwell"; KB 22 dwell).** Content: `content/glossary/term-dwell.yaml`, `content/products/product-meguiars-bug-tar.yaml`, `content/sops/sop-wash.md`, `content/sops/sop-wash-tesla.md`, `content/lessons/lesson-l1-02-pre-rinse.md`, `content/academy/flashcards/flash-times-bug-tar.yaml`, `content/fixit/fix-14.md`, and any other file that gives Bug & Tar one minute.
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly): the Meguiar's UK article above gives no time: "Simply wait and let it soften all stubborn contaminants."
  - Retailer (supporting, UK product "Meguiar's Heavy Duty Foaming Bug Remover", may not match the US can): https://www.halfords.com/motoring/car-cleaning/clay-bars/meguiars-heavy-duty-foaming-bug-remover-731699.html: "Allow product to dwell approximately 5 minutes for the foam to activate, penetrate and dissolve surface contaminants." "Do not allow product to dry."
- **Corrected wording:** none yet. Mark the one-minute dwell status verify in every file listed. Add "Do not let it dry" only once Lando's can says it.
- **Lando's one-glance check:** read the dwell time on his can.
- **Why it matters:** the only label text found says about five times longer, and a foam that dries on paint is harder to remove.
- **Who applies:** lead with Lando (KB 5.1); content-curator (glossary, product, SOPs, lesson); learning-designer (`flash-times-bug-tar.yaml`, pre-rinse drills and quizzes if they state the time); troubleshooter (`fix-14.md`).

### FC-46: Fresh water spots wipe off with a damp towel and quick detailer or the ceramic spray
- **Claim (KB 5.4; FIX-15).** Content: `content/fixit/fix-15.md`, `content/sops/sop-dry.md`, `content/lessons/lesson-l1-04-hard-water-drying.md`, `content/glossary/term-water-spots.yaml`, `content/academy/drills/drill-l1-dry.md`, `content/academy/quizzes/quiz-l1-04-drying-04.yaml`.
- **Verdict:** unconfirmed. (Merged: labels and tools sweeps.)
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly): https://www.meguiars.co.uk/product/meguiars-hybrid-ceramic-wax-768ml/ says nothing about water spots. Its directions are only wash, spray, second rinse, dry, and "there's no curing time."
  - No Meguiar's source found says its quick detailers remove water spots. KB 3.3 lists no exterior quick detailer in Lando's kit.
- **Corrected wording:** none. Keep status verify on the removal steps. Note for writers: the KB names a quick detailer Lando does not own.
- **Who applies:** lead with Lando (KB 5.4); troubleshooter (`fix-15.md`); content-curator (`sop-dry.md`, the lesson, the glossary term); learning-designer (the drill and quiz).

### FC-47: Mineral water spots need a water-spot remover
- **Claim (KB 5.4 and FIX-15 `[VERIFY products]`; KB 3.5 lists a remover as a candidate only).** Content: `content/fixit/fix-15.md`, `content/sops/sop-dry.md`, `content/lessons/lesson-l1-04-hard-water-drying.md`, `content/glossary/term-etching.yaml`.
- **Verdict:** unconfirmed. No remover is chosen, so no label governs. (Merged: labels and tools sweeps.)
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly by the tools sweep): Chemical Guys Heavy Duty Water Spot Remover SPI108 safety data sheet, revised 10/13/2023, https://chemicalguys.com/cdn/shop/files/SDS_SPI108_-_Heavy_Duty_Water_Spot_Remover.pdf: "Skin Corr. 1B: H314 - Causes severe skin burns and eye damage." "P280: Wear protective gloves/protective clothing/eye protection/protective footwear." Contains "sulphuric acid (CAS 7664-93-9); ammonium bifluoride (CAS 1341-49-7)". "pH: ~2.06".
  - Primary (loaded directly): https://www.chemicalguys.com/products/heavy-duty-water-spot-remover: "The surface must be cool to the touch." "Do NOT use it on a hot surface or directly in the sun." "Always test on a small, inconspicuous area first." "Do not leave on the surface longer than 30 seconds." "SOAK the area thoroughly with water or a quick detailer to neutralize the chemical." "Should not be used over ceramic coating, on mirrors, on coated glass, or on coated metal, as it may cause damage." "Nitrile gloves are recommended."
  - Primary (loaded directly, merge pass), Tesla 2020 to 2024 manual: "Do not use acidic products either."
  - Forum (supporting; Meguiar's how-to on its own forum, search index): https://www.meguiarsonline.com/forum/information-station/how-to-articles/5056-how-to-remove-water-spots: above-surface spots "will often times require the use of both detailing clay and a paint cleaner."
- **Corrected wording:** keep "water-spot remover" status verify. Wherever the step appears, add: "Some water-spot removers are strong acids. One sold by Chemical Guys is labeled Danger: causes severe skin burns and eye damage. Read the label first. Wear gloves and eye protection." On Teslas, add the Tesla row "Tesla's manual says do not use acidic products" (status sourced) and the pending row. Keep any remover step out of DJ's lessons until Lando picks a product and reads its label.
- **Why it matters:** chemical burns, and etched glass or trim, from an acid used without its label rules.
- **Who applies:** lead with Lando (KB 5.4, 3.5); troubleshooter (`fix-15.md`); content-curator (`sop-dry.md`, the lesson, `term-etching.yaml`, `card-tesla-wash-mode-tape.yaml`, `sop-wash-tesla.md`).

### FC-48: Etched water spots need polish
- **Claim (KB 5.4; FIX-15).**
- **Verdict:** unconfirmed. Supporting evidence agrees.
- **Sources (checked 2026-10-11):** Forum (supporting; Meguiar's how-to on its own forum, read through the search index; the forum redirects to meguiars.com): etched (Type II) spots happen when "Whatever was in the water was strong enough in its chemical composition to actually eat or dissolve the paint"; removal means polishing by hand or machine.
- **Corrected wording:** none. Stays status verify until a primary Meguiar's page is read.
- **Who applies:** troubleshooter (`fix-15.md` note).

### FC-49: Use the ceramic wax as a drying aid against hard water spots
- **Claim (KB 5.4 prevention list; KB 9.1; KB 20).** Content: `content/products/product-meguiars-hybrid-ceramic-wax.yaml` (jobs line "Drying aid against hard water spots"), `content/sops/sop-dry.md`, `content/sops/sop-protect.md`, `content/lessons/lesson-l1-04-hard-water-drying.md`, `content/glossary/term-water-spots.yaml`, `content/academy/drills/drill-l1-dry.md`, `content/academy/quizzes/quiz-l1-04-drying-04.yaml`, `content/fixit/fix-15.md`, `fix-65.md`.
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):** Primary (loaded directly): https://www.meguiars.co.uk/showroom/introducing-meguiars-hybrid-ceramic-wax/: "you actually apply this wax even before you've dried the bodywork." No Meguiar's page found claims it prevents water spots. A search summary says Meguiar's markets a separate Hybrid Ceramic Detailer for reducing water spotting (not verified on the page).
- **Corrected wording:** none. Applying it on the wet car is sourced (FC-04, FC-05). The water-spot claim carries status verify on that line.
- **Who applies:** content-curator (the product file and the files above); troubleshooter (`fix-15.md`, `fix-65.md`); learning-designer (the drill and quiz).

### FC-50: Ceramic wax streaks: 2 to 3 sprays on a clean damp towel and re-wipe
- **Claim (KB 9.1; FIX-18).**
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):** Primary (loaded directly): the Meguiar's UK product page and launch article say nothing about streaks or high spots. No Meguiar's source found.
- **Corrected wording:** none. Keep status house or verify as now.
- **Who applies:** troubleshooter (`fix-18.md` status).

### FC-51: Below about 50 F, polish and ceramic wax stop behaving
- **Claim (KB 18.2 `[VERIFY against labels]`; FIX-33; KB 8, 9.1).** Content: `content/fixit/fix-33.md`, `content/lessons/lesson-l4-05-edges-curves-heat.md`.
- **Verdict:** unconfirmed. No label gives a number. (Merged: labels and tools sweeps.)
- **Sources (checked 2026-10-11):**
  - Supporting (Meguiar's FAQ posted on Meguiar's own forum, read through the search index; the forum now redirects to meguiars.com): https://www.meguiarsonline.com/forum/information-station/hot-topics-frequently-asked-questions/3180-what-temperature-ranges-are-best-for-applying-cleaners-polishes-and-waxes: "The best surface temperature range for applying cleaners, polishes, and protectants is approximately 60 degrees to 80 degrees Fahrenheit." "Meguiar's products will work easily within a much broader temperature range, such as, 50 degrees to 90 degrees Fahrenheit, but guaranteed best results will be achieved in the 60 degrees to 80 degrees range." "It's easily possible to have between 10 to 50 degrees difference in ambient temperature compared to surface temperature."
  - Primary (loaded directly): the Meguiar's UK Hybrid Ceramic Wax page has no temperature, cool-surface, or shade line. The Meguiar's UK Ultimate Compound page has no directions.
  - Retailer (supporting): M210 label copy: "Always work on a cool, properly cured paint surface." Hybrid Ceramic Wax label copy: "The car should be cool to the touch & in the shade." A Canadian Tire answer about a different product (Hybrid Ceramic Liquid Wax): "We do not recommend anything below 55 degrees Fahrenheit".
- **Corrected wording:** none yet. Keep "below about 50 F" as a house limit with status verify. Suggested source line once Lando accepts it: "Meguiar's says its products work from about 50 to 90 F surface temperature and work best at 60 to 80 F. Panel and air temperature can differ a lot. House rule: below about 50 F, garage it or move the date."
- **Lando's one-glance check:** read the backs of the M210, Ultimate Compound, and Hybrid Ceramic Wax bottles for any temperature.
- **Who applies:** lead with Lando (KB 18.2); troubleshooter (`fix-33.md`); content-curator (`lesson-l4-05-edges-curves-heat.md`, `product-meguiars-m210.yaml`, `product-meguiars-ultimate-compound.yaml`, `product-meguiars-hybrid-ceramic-wax.yaml`).

### FC-52: Ragnify clay mitt care
- **Claim (KB 6 "Clay mitt: rinse it thoroughly" `[VERIFY mitt maker's guidance]`; FIX-17 "Mitt: rinse thoroughly per maker" `[VERIFY]`). Lando's mitt is a Ragnify medium 2-pack.** Content: `content/products/equipment-clay-mitt.yaml`, `content/sops/sop-clay.md`, `content/lessons/lesson-l1-05-clay.md`, `content/fixit/fix-17.md`.
- **Verdict:** confirmed. (The labels sweep found Ragnify's page; the tools sweep did not and said unconfirmed. The merge pass loaded Ragnify's page directly and the text is there.)
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: Ragnify's own product page, https://www.ragnify.com/products/ragnify-pack-of-2-clay-mitt-auto-detailing-medium-grade-clay-bar-alternative-mitt-for-flawless-removal-of-surface-bonded-micro-contaminant-red: "if you accidentally drop it, just rinse it with water and all the dust will fall off." "Tips: Rinse the clay mitt with soap and air dry after use. Use only after washing the vehicle. Use any shampoo to avoid marks on paint." As lube: "just use any shampoo or soap". Listed at $22.99 (red; blue and gray also sold).
  - Supporting (another maker's mitt, not Lando's): The Rag Company, https://theragcompany.com/products/the-rag-company-ultra-clay-mitt: "Do not soak in liquid" "Do not squeeze or wring out" "Do not store wet in air tight containers" "Inspect surface of the Ultra Clay Towel before and during use."
- **Corrected wording:** mitt check row: "Dropped mitt? Rinse it with water until the grit is gone (Ragnify). After every job, rinse it with soap and water and let it air dry (Ragnify). Check it before it goes back on paint (house)." Status sourced for the Ragnify lines. The Rag Company lines are another maker's and would be house if Lando adopts them. On Teslas, FC-34 applies.
- **Why it matters:** a dropped mitt that goes back on paint unrinsed drags grit across it.
- **Who applies:** lead with Lando (KB 6 tag); content-curator (`equipment-clay-mitt.yaml`, `sop-clay.md`, `lesson-l1-05-clay.md`); troubleshooter (`fix-17.md`); learning-designer (`drill-l1-clay.md`).

### FC-53: FIX-13 trim residue: soft brush and a trim-safe cleaner
- **Claim (FIX-13 `[VERIFY method]`; KB 3.5 lists APC only as a candidate).** Content: `content/fixit/fix-13.md`, `content/lessons/lesson-l4-05-edges-curves-heat.md`.
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):**
  - Forum (supporting, search index): https://www.meguiarsonline.com/forum/general-auto-detailing-discussion/detailing-101/9271-removing-wax-from-black-trim: diluted all-purpose cleaner with a small brush; Meguiar's M39 vinyl cleaner.
  - Primary (loaded directly), Tesla 2020 to 2024 manual: "Some cleaners and car shampoos contain chemicals that can cause damage or discoloration, especially for plastic trim pieces, exterior lights, or camera lenses." "Do not use acidic products either."
- **Corrected wording:** keep status verify. "Trim-safe cleaner" names no product, and the house owns no APC. On Teslas, any trim cleaner must not be highly alkaline, caustic, or acidic (Tesla manual).
- **Who applies:** troubleshooter (`fix-13.md`); content-curator (the lesson); lead with Lando (product choice).

## Item 10: Polisher, pads, and backing plates

### FC-54: Uro-Tec pad size vs the 56367 plate
- **Claim (KB 3.2 "Uro-Tec Yellow 6 in. x3", "Maroon 6 in. x2"; KB 3.1 "6 in. pads"; KB 14 "6 in. (150 mm) plate").** Content: `content/products/equipment-pad-urotec-yellow.yaml`, `equipment-pad-urotec-maroon.yaml`, `equipment-backing-plate.yaml`, `equipment-bauer-56367.yaml`, `content/cards/card-pad-ladder.yaml`, `card-machine-settings.yaml`, `content/lessons/lesson-l4-06-pad-care-backing-plate.md`, `content/fixit/fix-01.md`, `fix-03.md`, `fix-07.md`, `fix-23.md`.
- **Verdict:** conflicting.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: Buff and Shine 634CR, https://buffandshine.com/products/634cr-6-yellow-uro-tec-foam-pad-polishing: "Pad Size: 6"", "Loop Diameter: 6"", "Face Diameter: 7"", "Foam Thickness: 1"", "Orbital Sizes: 8mm, 15mm, 21mm", "Backing Plate(s): 600Y". 534CR (https://buffandshine.com/products/534cr-5-yellow-uro-tec-foam-pad-polishing): "Pad Size: 5"", "Loop Diameter: 5"", "Face Diameter: 6"", "Backing Plate(s): 500Y". Maroon 672CR reads the same as 634CR.
  - Primary: the 600Y is listed as "6" J-Hook Backing Plate with 5/16"-24 Threads."
  - Primary: Bauer 56367 manual, Specifications: "Max Accessory Diameter 6" (150mm)".
  - Retailer (supporting, search index): carsupplieswarehouse.com: "6 inch pad designed to fit a 5 inch backing plate; 7 inch pad designed to fit a 6 inch backing plate." A Kleen-Rite listing named a "534BN Uro-Tec 6 inch yellow" (page now 404).
- **Corrected wording:** none from the fact-checker. On the pad and plate entries, show: "Buff and Shine names Uro-Tec pads by the size of the back. Its 6 in. pad has a 6 in. back and a 7 in. face. Some stores sell the 5 in.-back pad, which has a 6 in. face, as a 6 in. pad. The Bauer manual says the largest accessory is 6 in. (150 mm)." Add the pending row, status verify: "Which Uro-Tec size goes on the 56367: Lando decides (pending)." Add: "Do not buy Buff and Shine's 600Y plate for the 56367. It has 5/16 in.-24 threads; the 56367 uses M8 (FC-17, FC-19)." Note: the pads are rated for orbits up to 21 mm, which covers the 20 mm throw.
- **Lando's one-glance check:** measure the hook-and-loop back and the face of one yellow and one maroon, and read any model number (534 or 572 means a 5 in. back; 634 or 672 means a 6 in. back).
- **Why it matters:** a pad that does not match its plate can run off-center, vibrate, or fly off, and this may explain FIX-01 (polisher jerks). Troubleshooter: add "pad back does not match the plate size" to the FIX-01 and FIX-03 checks, status verify.
- **Who applies:** lead with Lando (KB 3.1, 3.2, 14, 21); content-curator (the pad, plate, and polisher files, both cards, the lesson); troubleshooter (`fix-01.md`, `fix-03.md`, `fix-07.md`, `fix-23.md`); learning-designer (`quiz-l4-06-pads-plate-01.yaml`, `flash-machine-no-downsize.yaml` if it states pad sizes).

### FC-55: Polisher grip
- **Claim (FIX-01 Do this: "two hands, loose grip, guide don't push"; KB 8.3).** Content: `content/lessons/lesson-l4-03-pressure.md`, `content/academy/drills/drill-l4-scale-pressure.md`, `content/academy/quizzes/quiz-l4-03-pressure-02.yaml`, `content/fixit/fix-01.md`.
- **Verdict:** conflicting.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Bauer 56367 manual, general power tool safety: "l. When using a handheld power tool, maintain a firm grip on the tool with both hands to resist starting torque." Operation: "7. Keep pressure off of the tool when operating. The Foam Pad should LIGHTLY contact the polishing surface." "CAUTION! Start and stop the tool only while it is held firmly against the surface of the vehicle."
- **Rows for content (same pattern as FC-22 and FC-23):**
  - House (status house): "Two hands, loose grip, guide, don't push."
  - Manual (status sourced, the manual URL in Item 6): "The 56367 manual says to keep a firm grip with both hands to resist starting torque, and to keep pressure off the tool."
  - Pending (status verify): "Lando decides the grip wording (pending)." A wording Lando could choose: "Two hands on the tool. Hold it firmly so it cannot twist away, but do not push down. Keep the pad flat."
- **Why it matters:** a loose grip at trigger pull can let the tool twist away, and DJ is a beginner.
- **Who applies:** lead with Lando (KB 21 FIX-01, 8.3); troubleshooter (`fix-01.md`); content-curator (`lesson-l4-03-pressure.md`, `card-machine-settings.yaml`, `equipment-bauer-56367.yaml`); learning-designer (the drill and quiz).

### FC-56: Polisher power: amps, outlet, cord
- **Claim (KB 18.2 "Polisher draws about 7.5 A: any normal household outlet. 12-gauge cord, 50 ft max.").** Content: `content/lessons/lesson-l0-02-stay-safe.md`, `content/products/equipment-bauer-56367.yaml`, `content/academy/flashcards/flash-machine-cord.yaml`, `content/academy/drills/drill-l0-safety-start.md`, `content/fixit/fix-58.md`.
- **Verdict:** confirmed. The manual adds safety rules the KB leaves out.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Bauer 56367 manual: "Electrical Rating 120VAC / 60Hz / 7.5A"; "Power Supply Requirements 120VAC, 60Hz, 15A Circuit." Table A, recommended minimum wire gauge for 7.1 to 12.0 A: 25 ft 18 gauge, 50 ft 14, 75 ft 12, 100 ft 10. "If operating a power tool in a damp location is unavoidable, use a ground fault circuit interrupter (GFCI) protected supply." "If you are using an extension cord outdoors, make sure it is marked with the suffix "W-A" ("W" in Canada) to indicate it is acceptable for outdoor use." "To prevent electric shock, keep electrical connections off ground." "If you are using one extension cord for more than one tool, add the nameplate amperes and use the sum to determine the required minimum cord size." Troubleshooting: "Extension cord too long or cord diameter too small."
- **Corrected wording:** the claim stands. A 12-gauge cord at 50 ft is heavier than the manual's 14-gauge minimum, and the manual allows 12 gauge to 75 ft, so "50 ft max" is a stricter house limit. Add, status sourced: "Outdoors, use a cord marked W-A. Near water, plug into a GFCI outlet. Keep plug connections off the wet ground. One cord, one tool."
- **Why it matters:** electric shock where there is water on the ground.
- **Who applies:** lead with Lando (KB 18.2 tag and additions); content-curator (`equipment-bauer-56367.yaml`, `card-setup-kit.yaml`, `lesson-l0-02-stay-safe.md`, `sop-polish.md`, `sop-polish-tesla.md`); learning-designer (`flash-machine-cord.yaml`, `drill-l0-safety-start.md`); troubleshooter (`fix-58.md`).

### FC-57: Backup backing plates: Maxshine and Griot's BOSS
- **Claim (KB 14: "One 56367 owner reported swapping in a Maxshine plate. Another said a Griot's BOSS 21 plate looks nearly identical.").** Content: `content/products/equipment-backing-plate.yaml`, `content/lessons/lesson-l4-06-pad-care-backing-plate.md`, `content/fixit/fix-23.md`.
- **Verdict:** corrected.
- **Sources (checked 2026-10-11):**
  - Forum (the source the KB line reports on; loaded directly): https://www.autogeekonline.net/forum/auto-detailing-tools-and-accessories/126678-new-bauer-hf-56367-long-throw-polisher-non-standard-backing-plate.html (posts Jun 6 to Aug 30, 2020). paulgyro: "I personally replaced the 6 in. included backing plate with the" Maxshine "Dia: 125mm/5 inch DA Backing Pad". He did not say how it ran. N8huntsman: "The G21 Boss backing plate looks like a winner, very similar." Nobody reported fitting one.
  - Retailer (supporting): a Maxshine MSDABP6 listing on a retailer page (nydemo-6301se.nyehandel.se): "5/16 diameter thread", "Size: 6 / 150mm". No Maxshine maker page found.
- **Corrected wording:** KB 14 backup line: "Backup: ShineMate Heavy Duty plate (see FC-58 and FC-59). Not backups: the forum Maxshine swap was a 5 in. (125 mm) plate, which is the downsize this section says not to do, and the owner never said how it ran. Maxshine's standard 6 in. DA plate is listed by a retailer with 5/16 in. threads, not M8. One owner said a Griot's BOSS G21 plate looks very similar; nobody reported fitting one." Keep `[VERIFY fit before buying]`.
- **Why it matters:** buying the wrong plate wastes money, and a downsized plate causes violent vibration and bearing wear (KB 14).
- **Who applies:** lead with Lando (KB 14); content-curator (`equipment-backing-plate.yaml`, the lesson); troubleshooter (`fix-23.md`).

### FC-58: ShineMate Heavy Duty 6 in. price
- **Claim (KB 14: "listed at $23.05 at Parks Car Care (that was the 5 in. listing; confirm the 6 in. price)").**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Parks Car Care store data, https://parkscarcare.net/products/shinemate-5-backing-plate-da-heavy-duty (and its .js product data): title "ShineMate Backing Plate DA Heavy Duty (5" and 6")"; 5 in.: $23.05, available; 6 in.: $23.05, not available. The seller is the source for its own price only, not for fit.
- **Corrected wording:** "ShineMate Heavy Duty 6 in.: $23.05 at Parks Car Care, the same as the 5 in. Out of stock on 2026-10-11." Internal only, dated.
- **Who applies:** lead (KB 14); content-curator (`equipment-backing-plate.yaml`); troubleshooter (`fix-23.md`).

### FC-59: ShineMate plate fits the 56367
- **Claim (KB 14: "M8 thread, M8 bolt included, sold as fitting most 5 to 6 in. long-throws").**
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):** Retailer (seller copy, loaded directly): the Parks Car Care page above: "Standard M8 female thread will fit the majority of 5~6 in. long-throw polishers such as the ShineMate, Maxshine, Adam's swirl killers etc." "Comes with a M8 male mounting bolt." "Designed for the EX620 21mm." No ShineMate maker page found.
- **Corrected wording:** keep `[VERIFY fit before buying]`. Add: "The seller describes a female M8 thread plus an M8 bolt. The 56367 plate mounts with a Spindle Bolt through a center hole (FC-21). Compare the hub to the stock plate before bolting it on."
- **Who applies:** lead with Lando (KB 14); content-curator (`equipment-backing-plate.yaml`).

### FC-60: HF parts line can supply the 56367 backing pad
- **Claim (KB 14 first call `[VERIFY availability]`).**
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):** Primary (loaded directly): the 56367 manual: "Some parts are listed and shown for illustration purposes only, and are not available individually as replacement parts. Specify UPC 193175448170 when ordering parts." No HF parts listing for the plate was found online.
- **Corrected wording:** none. Only a call settles it.
- **Lando's one-glance check:** call 1-888-866-5797 with UPC 193175448170.
- **Who applies:** lead with Lando.

### FC-61: Polisher specs
- **Claim (KB 3.1: "Six-speed dial, about 2,000 to 4,600 OPM, constant-speed electronics, soft start"; 20 mm long-throw).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly): https://go.harborfreight.com/sku/56367/: "combines a six-speed dial with electronic speed control"; "constant speed and power, even under load"; "The long-throw 20mm orbit diameter produces 3X the corrective action per orbit compared to standard/short-throw DA polishers."
  - Primary (rechecked by the merge pass): the manual: "No Load Speed n0: 2000-4600/min"; the manual defines the symbol as "No Load Revolutions per Minute (RPM)".
  - Soft start: seen only on HF coupon pages through the search index.
- **Corrected wording:** none needed. Optional precision: "about 2,000 to 4,600 per minute at no load (manual)."
- **Who applies:** lead (KB 3.1 tag); content-curator (`equipment-bauer-56367.yaml`, `term-opm.yaml`).

### FC-62: HF FAQ: center the pad and spread compound evenly to reduce vibration
- **Claim (KB 3.1 `[SOURCED 2026-10-07]`; FIX-03).**
- **Verdict:** unconfirmed. The FAQ line was not found on any HF page that loads.
- **Sources (checked 2026-10-11):** Primary (loaded directly): the manual: "Only apply the pad/bonnet flat against the surface"; "If the Foam Pad continually comes off the Backing Pad during use, too much wax may have been applied."; "To reduce vibration, maintain the tool as explained in this manual." harborfreight.com product pages are behind a bot check; go.harborfreight.com has no FAQ.
- **Corrected wording:** treat the FAQ line as status verify until it is reread. The manual's "pad comes off the backing pad: too much product" line can support FIX-07 as sourced.
- **Who applies:** lead (KB 3.1 tag); troubleshooter (`fix-03.md`, `fix-07.md`); content-curator (`equipment-bauer-56367.yaml`).

### FC-63: "A 20 mm long-throw moves more than a short-throw; some float is normal"
- **Claim (FIX-01 note `[VERIFY wording]`).** Content: `content/fixit/fix-01.md`, `content/lessons/lesson-l4-01-know-the-machine.md`.
- **Verdict:** unconfirmed. No source says "some float is normal."
- **Sources (checked 2026-10-11):** Primary (loaded directly): HF's page above: "The long-throw 20mm orbit diameter produces 3X the corrective action per orbit compared to standard/short-throw DA polishers."
- **Corrected wording:** suggested: "A 20 mm long-throw makes a bigger orbit than a short-throw polisher. Harbor Freight says it does 3 times the corrective work per orbit." Keep "some float is normal" status verify, or drop it.
- **Who applies:** troubleshooter (`fix-01.md`); content-curator (the lesson, `term-long-throw.yaml`).

### FC-64: Generator: 2,000 W inverter minimum; never vacuum and polisher together
- **Claim (KB 18.2 `[VERIFY]`).** Content: `content/lessons/lesson-l0-02-stay-safe.md`, `content/products/equipment-bauer-56367.yaml`.
- **Verdict:** unconfirmed. No source sets a generator size for this tool.
- **Sources (checked 2026-10-11):** Primary (loaded directly): the manual gives no generator guidance. It says "120VAC / 60Hz / 7.5A", "120VAC, 60Hz, 15A Circuit", and "If you are using one extension cord for more than one tool, add the nameplate amperes and use the sum".
- **Corrected wording:** keep status verify. Arithmetic only: 7.5 A at 120 V is 900 W running. The manual's add-the-amps rule supports "never vacuum and polisher on one cord." The 2,000 W figure has no source.
- **Who applies:** lead with Lando (KB 18.2); content-curator (the two files).

### FC-65: Uro-Tec yellow is a polishing pad
- **Claim (KB 3.2 "Uro-Tec Yellow ... (polishing)"; "Detailed Image lists the yellow as a polishing pad" `[SOURCED 2026-10-02]`).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Buff and Shine 634CR page: "The Yellow URO-Tec pad is the standard polishing pad in the lineup, designed to remove light swirls, haze, and oxidation while restoring depth and clarity." "Best paired with finishing polishes or cleaner waxes".
- **Corrected wording:** none. The source line can move from Detailed Image to Buff and Shine.
- **Who applies:** lead (KB 3.2 tag); content-curator (`equipment-pad-urotec-yellow.yaml`).

### FC-66: Uro-Tec maroon: "heavier polishing / more cut"
- **Claim (KB 3.2; `equipment-pad-urotec-maroon.yaml` "Heavier polishing and more cut").** Content also: `content/lessons/lesson-l4-08-test-spot-ladder.md`, `content/fixit/fix-10.md`, `fix-55.md`, `content/cards/card-pad-ladder.yaml`.
- **Verdict:** corrected.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Buff and Shine 672CR, https://buffandshine.com/products/672cr-6-maroon-uro-tec-foam-pad-medium-cut: "Maroon (Medium Cut) The Maroon URO-Tec pad is the workhorse of the line, delivering reliable medium-cut performance for a wide range of polishing jobs. Its balanced foam structure makes it our most popular option, ideal for one-step compound and polish combinations." Buff and Shine's "Heavy Polishing" pad is a different color, the Blueberry 656CR (tools sweep, loaded directly).
- **Corrected wording:** "Maroon: medium cut (Buff and Shine). More cut than the yellow." The rung roles in the ladder stay house.
- **Who applies:** lead with Lando (KB 3.2); content-curator (the maroon file, the card, the lesson); troubleshooter (`fix-10.md`, `fix-55.md`).

### FC-67: Uro-Tec thickness
- **Claim (KB 3.2: "one older note said Uro-Tec runs about 5/8 in.; a Detailed Image Uro-Tec listing says 1 in. thickness" `[VERIFY: measure the actual pads]`).** Content: `content/products/equipment-pad-urotec-yellow.yaml`, `equipment-pad-urotec-maroon.yaml` (both mention 5/8 in.).
- **Verdict:** corrected.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Buff and Shine 634CR, 534CR, 672CR, and 620CR pages: "Foam Thickness: 1"".
- **Corrected wording:** "Uro-Tec foam is 1 in. thick (Buff and Shine spec)." Drop the 5/8 in. note.
- **Who applies:** lead (KB 3.2); content-curator (both pad files).

### FC-68: Uro-Tec face is about 1 in. wider than the back
- **Claim (KB 3.2 `[SOURCED 2026-10-02]`).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** 634CR: "Loop Diameter: 6"", "Face Diameter: 7"". 534CR: "Loop Diameter: 5"", "Face Diameter: 6"".
- **Corrected wording:** none. See FC-54 for what this means for plate fit.
- **Who applies:** lead (KB 3.2 tag); content-curator (both pad files).

### FC-69: Black pad: finishing and wax only, very soft
- **Claim (KB 3.2; the brand is not named).** Content: `content/products/equipment-pad-black.yaml`.
- **Verdict:** unconfirmed. It matches Buff and Shine only if Lando's black pad is a Uro-Tec.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Buff and Shine 620CR, https://buffandshine.com/products/620cr-6-black-uro-tec-foam-pad-final-finishing: "The Black URO-Tec pad is the softest in the line, designed for ultra-fine finishing and applying protection products." Its spec table reads the same as the yellow: loop 6 in., face 7 in., foam 1 in.
- **Corrected wording:** none until Lando names the brand. If it is a Uro-Tec black, add the Buff and Shine source line, and FC-54 applies to it too.
- **Who applies:** lead with Lando (which black pad); content-curator (`equipment-pad-black.yaml`).

### FC-70: Uro-Tec pad washing and drying
- **Claim (KB 13.1: "Warm water (not hot; hot is hard on foam) with a drop of laundry detergent... Press the water out, never wring. Dry face down on a rack.").** Content: `content/sops/sop-cleanup.md`, `content/lessons/lesson-l4-06-pad-care-backing-plate.md`, `content/products/equipment-pad-urotec-yellow.yaml`, `equipment-pad-urotec-maroon.yaml`, `equipment-pad-hf-finishing.yaml`, `content/academy/drills/drill-l4-pad-care.md`, `content/academy/flashcards/flash-pads-wash.yaml`, `content/academy/quizzes/quiz-l4-06-pads-plate-04.yaml`, `content/fixit/fix-50.md`.
- **Verdict:** conflicting for drying. Warm, never hot, is confirmed.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: Buff and Shine FAQ, https://buffandshine.com/pages/faqs: "It is possible to wash foam pads with a very mild solution of your favorite all-purpose cleaner." Machine washing: "set the washer on "gentle" cycle, and use only warm or cold water, NEVER HOT. Air-dry the washed pads on a flat surface. NEVER put pads in the dryer, as they will warp." Storage: "Never place a pad face down on any surface."
  - Primary: Buff and Shine buffing tips, https://buffandshine.com/pages/buffing-tips: "Soak foam pads in warm water and ring dry. Never put in dryer."
- **Rows for content:**
  - Sourced (status sourced): "Warm water, never hot. Never put Uro-Tec pads in the dryer (Buff and Shine)."
  - House (status house): "Dry face down on a rack. Never wring."
  - Buff and Shine (status sourced): "Air-dry flat. Never place a pad face down on any surface."
  - Pending (status verify): "Lando decides how pads dry (pending)."
  - The HF manual's machine-dry line (FC-25) covers HF pads only.
- **Why it matters:** heat warps foam, and a pad that dries out of shape runs unevenly.
- **Who applies:** lead with Lando (KB 13.1); content-curator (the SOP, lesson, and pad files); learning-designer (the drill, flashcard, and quiz); troubleshooter (`fix-50.md`, and the search case "pad wash" if its expected wording changes).

## Item 11: Paint thickness and the gauge

### FC-71: Clear coat thickness
- **Claim (KB 7.3: "the clear coat itself is only about 38 to 50 µm" `[SOURCED 2026-09-22]` `[VERIFY reconfirm]`).** Content: `content/cards/card-thickness-bands.yaml`, `content/lessons/lesson-l0-04-how-paint-works.md`, `content/lessons/lesson-l3-03-thickness-bands.md`, `content/fixit/fix-22.md`.
- **Verdict:** corrected. The source prints 35, not 38.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** DeFelsko (a paint-gauge maker), https://www.defelsko.com/resources/how-to-use-paint-thickness-gauges-for-better-automotive-detailing: "Thickness usually ranges between 1.5 to 2.0 mils (35 to 50 microns)." (DeFelsko prints a dash between the numbers; written here as "to".) Also: "most auto manufacturers recommend that a maximum of 0.3 mils (8 microns) clear coat be removed as prevention from UV damage to underlying paint layers."
- **Corrected wording:** "Factory total film is usually about 100 to 180 µm. The clear coat is about 35 to 50 µm (1.5 to 2 mils) of that (DeFelsko)." Optional teaching line: "DeFelsko says most carmakers recommend removing no more than about 8 µm (0.3 mil) of clear coat." Note: 1.5 mils converts to 38 µm, but the source prints 35, so use 35.
- **Why it matters:** the thickness bands and the stop rules teach how little clear there is to remove.
- **Who applies:** lead with Lando (KB 7.3); content-curator (the card and two lessons, `term-clear-coat.yaml`); troubleshooter (`fix-22.md`).

### FC-72: Factory total film is about 100 to 180 µm
- **Claim (KB 7.3).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** DeFelsko, https://www.defelsko.com/resources/automotive-paint-detailing: "Most factory paint jobs seem to range from 4 to 7 mils (100 to 180 microns)." "Some vehicles may only have 3 mils (75 microns) of total paint thickness on the roof, while some SUVs may have 17 mils (430 microns) on their rocker panels." (Dashes written as "to".) DeFelsko makes gauges, not paint. Tesla publishes no figure.
- **Corrected wording:** none. Source line: "DeFelsko, checked 2026-10-11." The lead can retag the total-film line as sourced.
- **Who applies:** lead (KB 7.3 tag); content-curator (`card-thickness-bands.yaml`, `term-micron-mil.yaml`, `lesson-l3-03-thickness-bands.md`).

### FC-73: Model Y owners measure about 4 to 6 mils
- **Claim (KB 7.2: "Tesla Model Y owners commonly measure about 4 to 6 mils (100 to 150 µm), highest on the hood").** Content: `content/products/equipment-rd-tc100.yaml`, `content/lessons/lesson-l3-02-tc100-gauge.md`, `content/lessons/lesson-l0-04-how-paint-works.md`, `content/sops/sop-measure-tesla.md`, `content/academy/flashcards/flash-tesla-gauge.yaml`, `content/fixit/fix-21.md`, `fix-79.md`.
- **Verdict:** unconfirmed. Tesla publishes no paint thickness.
- **Sources (checked 2026-10-11):** Forum (supporting, search index): https://teslamotorsclub.com/tmc/threads/tesla-paint-depth-vs-other-cars.221821/: one owner's Model Y read about 4.03 to 5.92 mils, hood highest, rear quarters lowest.
- **Corrected wording:** keep as owner reports, not a spec: "Owners report about 4 to 6 mils (100 to 150 µm), highest on the hood (forum)."
- **Who applies:** lead (KB 7.2 note); content-curator (the files above); learning-designer (`flash-tesla-gauge.yaml`); troubleshooter (`fix-21.md`, `fix-79.md`).

### FC-74: TC100: zero only on the bare plate; screen codes
- **Claim (KB 7.2 `[SOURCED 2026-10-06]`: Fe, NFe, SNG; "Zero ONLY on the included bare plate. Never press ZERO on the car.").**
- **Verdict:** unconfirmed. No R&D TC100 manual or maker page was found.
- **Sources (checked 2026-10-11):** Supporting (another maker's gauge manual, search index): Sauter, https://tester.co.uk/files/get/download/id/2160/sauter-tc-combination-coating-thickness-gauge-operating-instructions.pdf: "Zero calibration is not valid, if the sensor does not contact the calibration plate directly or any other uncoated base material."
- **Corrected wording:** none.
- **Lando's one-glance check:** read the TC100's printed manual for the zero and SNG steps.
- **Who applies:** lead with Lando; content-curator (`equipment-rd-tc100.yaml`, `lesson-l3-02-tc100-gauge.md`, `sop-measure.md`, `sop-measure-tesla.md`); learning-designer (`flash-gauge-zero.yaml`, `quiz-l3-02-gauge-01.yaml`); troubleshooter (`fix-21.md`, `fix-42.md`).

## Item 12: Other products in the kit

### FC-75: Meguiar's Quik Interior Detailer and screens
- **Claim (KB 3.3 "Interior wipe, sprayed on the towel"; KB 10 "Screens: dry microfiber or a screen-safe cleaner only").** Content: `content/products/product-meguiars-quik-interior-detailer.yaml`, `content/sops/sop-interior.md`, `content/lessons/lesson-l2-03-wipe-dress.md`, `content/academy/drills/drill-l2-matte-dash.md`, `content/academy/quizzes/quiz-l2-03-wipe-01.yaml`.
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11; meguiars.com returned 503; 3mcanada.ca returned 403):** Retailer (supporting): retail copies of the G13616 label: "Shake well. For best results, apply to a cool surface. Mist on section at a time and wipe" and it is said to "safely clean interior plastics, vinyl, leather, rubber, metal, and even LCD and navigation screens." Not read on Meguiar's own page. Meguiar's page (not loaded): https://www.meguiars.com/automotive/products/meguiars-quik-interior-detailer-g13616-16-oz-spray.
- **Corrected wording:** none. Spraying the towel is house and stricter than the label. Do not list it as screen-safe on a Tesla (FC-36).
- **Who applies:** content-curator (the product file, SOP, lesson); learning-designer (the drill and quiz); lead with Lando (the Tesla row).

### FC-76: Tuff Stuff's role
- **Claim (KB 3.3 "Foam cleaner" `[VERIFY: confirm role, likely carpet/upholstery]`; KB 25 question 8).**
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):** Retailer (supporting): https://www.tractorsupply.com/tsc/product/tuff-stuff-multi-purpose-foam-cleaner-22-oz-1093398 and other retail copies: "Tuff Stuff Multi Purpose Foam Cleaner", 22 oz aerosol, for upholstery, carpet, vinyl, and floor mats; spray, let it work 30 to 40 seconds, scrub if needed, wipe with a clean cloth; test a hidden area first. A product database lists the maker as Armored AutoGroup (Energizer). No maker page found.
- **Corrected wording:** none. The role is Lando's call.
- **Who applies:** lead with Lando (KB 3.3); content-curator (`product-tuff-stuff.yaml`); troubleshooter (`fix-74.md`).

### FC-77: Blazin' Banana
- **Claim (KB 3.3 "Unknown" `[VERIFY: ask Lando what it is and its job]`).**
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):** Primary (loaded directly): https://www.chemicalguys.com/products/blazin-banana-natural-carnauba-spray-wax: "Blazin' Banana Natural Carnauba Spray Wax", SKU WAC21516, 16 oz, sold out when read. How to use: mist a thin coat one area at a time, wipe off with microfiber, flip and buff. Finishes: paintwork and glass. Whether this is Lando's bottle is not confirmed.
- **Corrected wording:** none. If Lando confirms it is this spray wax, house rule 5 applies (no wax before correction) and it is not in the current SOP. Lando decides its job (pending).
- **Who applies:** lead with Lando (KB 3.3); content-curator (`product-blazin-banana.yaml`); troubleshooter (`fix-74.md`).

### FC-78: Blue Magic Headlight Lens Restorer: two minutes per light; yellows again in about a month
- **Claim (KB 9.4; KB 15.1 headlight refresh $30/pair). Customer-facing.** Content: `content/products/product-blue-magic-headlight-restorer.yaml`, `content/lessons/lesson-l0-05-what-can-be-fixed.md`, `content/academy/flashcards/flash-times-headlights.yaml`, `content/academy/quizzes/quiz-l0-05-fixable-04.yaml`, `content/fixit/fix-82.md`.
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11; bluemagicinc.com redirects to a domain-for-sale page):** Retailer (supporting, search index): https://oreillyauto.com/detail/c/blue-magic/blue-magic-headlight-lens-restorer/bmg0/725: item 725, 8 oz, "wipe on/wipe off", removes yellowing and haze. Blue Magic sells a separate Lens Sealer that keeps lenses "protected from UV rays". A Walmart reviewer says lenses look good 3 months to a year without a sealer; forum users say about one to two months. No primary source gives a time per light or how long it lasts.
- **Corrected wording:** none. Until a label or maker source is read, customer wording names no time frame. "A refresh, not a fix" is house wording and can stay.
- **Lando's one-glance check:** read the directions on his bottle.
- **Who applies:** lead with Lando (KB 9.4); content-curator (the product file and lesson); learning-designer (the flashcard and quiz); troubleshooter (`fix-82.md`); business-customer (Phase 4 pitch wording).

### FC-79: Maintenance wash ratio; what "Meguiar's Super Soap, 16 oz" is
- **Claim (KB 4 "Meguiar's soaps about 1 oz per gallon (per a Meguiar's specialist). Super Soap at 2 oz/gal when you want it stronger" `[SOURCED 2026-10-06]`; KB 3.3 "Meguiar's Super Soap, 16 oz").** Content: `content/cards/card-maintenance-wash.yaml`, `content/products/product-meguiars-super-soap.yaml`, `product-meguiars-ultimate-wash-wax.yaml`, `content/lessons/lesson-l1-03-towel-wash.md`, `content/academy/flashcards/flash-mixes-maintenance-bucket.yaml`, `content/academy/drills/drill-l1-towel-wash.md`, `content/academy/quizzes/quiz-l1-wash-decon-08.yaml`.
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11; meguiars.com returned 503):** Forum (supporting, Meguiar's forum through the search index): https://www.meguiarsonline.com/forum/meguiar-s-product-specific-discussion/meguiar-s-professional-lines-mirror-glaze-detailer-pro-hybrid-ceramic-other/31486-d112-super-soap: Meguiar's "Super Soap" appears to be the professional Detailer-line D112. A Meguiar's rep calls it "the only soap we make specifically formulated for use in a low pressure spray such as the Gilmour foam gun". No 16 oz size was found. No primary label ratio was found for Super Soap or for Ultimate Wash & Wax (G17748, 48 oz).
- **Corrected wording:** none. Keep the 2026-10-06 specialist source, but it is not reconfirmed.
- **Lando's one-glance check:** read the Super Soap and Ultimate Wash & Wax bottles for the exact name, item number, size, and ratio.
- **Who applies:** lead with Lando (KB 4, 3.3); content-curator (the card, product files, lesson); learning-designer (the flashcard, drill, quiz).

### FC-80: APC 10:1 interior, 4:1 floor mats (only if bought)
- **Claim (KB 4 `[VERIFY against the chosen label]`).** Content: `content/sops/sop-interior.md`.
- **Verdict:** unconfirmed. No APC is chosen.
- **Sources (checked 2026-10-11):** Retailer (supporting): https://www.carsupplieswarehouse.com/collections/interior-care/products/detailer-all-purpose-cleaner-pre-order, retail copy for Meguiar's D101: "Light-Duty Cleaning: Dilute D101 10:1 (10 parts water, 1 part cleaner)", with 4:1 for heavy soiling. Meguiar's own chart was not read.
- **Corrected wording:** none. Keep status verify against the chosen label. `sop-interior.md` must not present these ratios as settled.
- **Who applies:** lead with Lando (KB 4); content-curator (`sop-interior.md`).

### FC-81: Compressor drained per its manual
- **Claim (KB 13.4 `[VERIFY]`; KB 3.1).** Content: `content/products/equipment-air-compressor.yaml` (check "Drain it per its manual.").
- **Verdict:** unconfirmed. Not checkable: the KB records no make or model.
- **Corrected wording:** none.
- **Lando's one-glance check:** give the compressor make and model.
- **Who applies:** lead with Lando (KB 3.1); content-curator.

## Item 13: Motorcycles

### FC-82: Bike windshields are plastic: no alcohol, no glass cleaner, no compound
- **Claim (KB 12.1 "no alcohol, no glass cleaner, no compound, no clay"; FIX-30).**
- **Verdict:** confirmed for alcohol, glass cleaner, and abrasives. The no-clay line stays house.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly): National Cycle instruction sheet (2016), https://www.nationalcycle.com/media/wysiwyg/pdf/ispl/10-118601-000.pdf: "Do not clean polycarbonate in hot sun or high temperatures. Do not clean the screen with household glass cleaners." "Do not allow brake fluid, alcohol, or strong solvents to contact the windshield."
  - Primary (read through the search index; direct load denied): Harley-Davidson service info, https://serviceinfo.harley-davidson.com/sip/service/procedure/1952428810735561133/BLAISE/393859/en_US?nid=6372: "Ammonia-based window cleaners cause permanent yellow effects to windshields." "Powdered, abrasive or alkaline cleanser can damage the windscreen/windshield."
- **Corrected wording:** none. Suggested addition: "Do not clean it in hot sun (National Cycle)."
- **Who applies:** lead with Lando (KB 12.1 tag); content-curator (`card-bike-rules.yaml`, `sop-glass-bike.md`); learning-designer (`flash-bikes-windshield.yaml`); troubleshooter (`fix-30.md`, `fix-84.md`).

### FC-83: Approved plastic windshield cleaner for bikes
- **Claim (KB 12.1 `[VERIFY approved plastic cleaner]`).**
- **Verdict:** unconfirmed. The choice is Lando's.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly): National Cycle: "To clean your windshield, wash with a clean soft cloth and plenty of warm water and, if necessary, a non-abrasive soap such as dishwashing liquid." "National Cycle Shield Wash (N1401-01) makes a good daily cleaner."
  - Primary (search index): Harley-Davidson: mild soap and warm water, or Harley-Davidson's own windshield cleaner; no gas station windshield cleaner.
- **Corrected wording:** none. One maker names dishwashing liquid for windshields, while KB 3.4 keeps dish soap in the garage. Lando decides (pending).
- **Who applies:** lead with Lando (KB 12.1); content-curator (`card-bike-rules.yaml`, `sop-glass-bike.md`).

### FC-84: Chain: chain-specific cleaner and lube only
- **Claim (KB 12.1 "Chain: chain-specific cleaner and chain lube only. Household degreaser strips the O-rings.").**
- **Verdict:** confirmed for O-ring safe cleaner and lube and for the reason (the wrong solvent damages the seals). The household degreaser example is not named by any maker and stays house.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: D.I.D, Dec 1, 2022, https://didchain.com/blogs/news/d-i-d-chain-maintenance: "Clean the chain by wiping with a soft cloth dampened with an O-Ring/X-Ring® safe cleaner". "To protect X-Ring®, never use steam, thinner or such volatile solvents as gasoline or benzene, and a wire bush as well." "Lube the chain every other use with an O-Ring/X-Ring safe lubricant." "D.I.D does not recommend maintaining any drive chain with kerosene." "Cleaning a sealed chain with kerosene would cause deformation of the seal ring".
  - Supporting (Honda owner's manual page on a third-party host): https://www.bike-parts.fr/thumbs/pdf_url/img/owner_manuals/owner_CBR1000RRA_EN/2500_2500/0174.pdf: "The O-rings can be damaged by steam cleaning, high pressure washers, and certain solvents." Honda allows kerosene; D.I.D does not.
- **Corrected wording:** suggested sourced wording: "Use an O-ring safe chain cleaner and an O-ring safe chain lube only. Never gasoline, thinner, steam, a pressure washer, or a wire brush. The wrong solvent can ruin the chain's seals." Keep "household degreaser" as the house example.
- **Who applies:** lead with Lando (KB 12.1 tag); content-curator (`card-bike-rules.yaml`, `sop-chain-bike.md`); troubleshooter (`fix-30.md`, `fix-85.md`).

### FC-85: Bagger chain clean and lube add-on
- **Claim (KB 12.2 add-on "chain clean and lube $25"; KB 15.4 worked example "Bagger Store-It-Clean + chain clean and lube: $245 + $25 = $270", used as a unit test).**
- **Verdict:** conflicting.
- **Sources (checked 2026-10-11):** Primary (loaded directly): Harley-Davidson 2023 Street Glide (US) spec sheet, https://h-dmediakit.com/epapi-get/pdf/bikepages/specs/2023/flhx/specifications_flhx_us.pdf: "Primary Drive Chain, 34/46 ratio" and "Final Drive Belt, 32/68 ratio". Footnote: "All models feature 6-speed transmission (VRSC models and Sportster models are 5-speed) and carbon fiber belt final drive". The 2024 sheet says the same.
- **Corrected wording:** none from the fact-checker. Suggested note: "Check the final drive before you offer chain clean and lube. Harley touring bikes (baggers) use a belt, not a chain. The add-on fits chain-drive bikes only. Lando decides how this applies to belt bikes (pending)." The 15.4 example may need a chain-drive bike instead.
- **Why it matters:** selling a chain service on a bike with no drive chain.
- **Who applies:** lead with Lando (KB 12.2, 15.4); learning-designer (`flash-prices-store-it-clean.yaml`, `flash-prices-bike-addons.yaml`); business-customer (Phase 4 bike menu); qa-adversary (the 15.4 unit tests, if the example changes).

### FC-86: Matte paint, including Harley Denim: no compound, polish, or wax
- **Claim (KB 12.1, KB 7.4).**
- **Verdict:** unconfirmed. The house rule stands, and supporting evidence agrees.
- **Sources (checked 2026-10-11):** Primary (read through the search index; direct load denied): Harley-Davidson care chart, https://serviceinfo.harley-davidson.com/sip/service/procedure/2195584092891312857/BLAISE/472799/en_US?nid=5693: a search summary says it lists a Denim Paint Cleaner (part 93600064) and says the Harley Travel Care Kit is not for denim finishes. Exact "do not wax" wording was not found. Supporting (Muc-Off, a licensed vendor): gloss polishes or waxes on matte paint add unwanted shine.
- **Corrected wording:** none. Keep status house.
- **Who applies:** content-curator (`card-bike-rules.yaml`, `card-kills-the-buff.yaml`, `term-matte-satin.yaml`, `sop-hand-polish-bike.md`, `sop-protect-bike.md`, `lesson-l3-04-kills-the-buff.md`); troubleshooter (`fix-30.md`, `fix-53.md`, `fix-87.md`).

### FC-87: Bikes: chrome polish, then a coat of ceramic wax
- **Claim (KB 12.1; `product-meguiars-hybrid-ceramic-wax.yaml` jobs line "A coat on chrome after chrome polish, on bikes").**
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):** Primary (loaded directly): Meguiar's UK pages list no surfaces for the spray. Retailer (Detailed Image, supporting): it can be used on glass, plastic, metals, and wheels. The chrome and trim claims found were for a different product, Hybrid Ceramic Liquid Wax G200416.
- **Corrected wording:** none. Mark the chrome line status verify until the bottle is read.
- **Who applies:** content-curator (`card-bike-rules.yaml` row "Chrome", the product file, `sop-protect-bike.md`).

## Item 14: Towels

### FC-88: Towel wash water temperature
- **Claim (KB 13.3 "Hot water for the product piles (home-washer hot water won't hurt microfiber...; Meguiar's washes its own polishing cloths hot)"; "Dryer heat is what melts microfiber, not the washer" `[SOURCED 2026-10-07]`).** Content: `content/products/equipment-microfiber-towels.yaml`, `content/sops/sop-cleanup.md`, `content/sops/sop-cleanup-bike.md`, `content/lessons/lesson-l0-06-shop-setup.md`, `content/academy/flashcards/flash-towels-washer.yaml`, `content/academy/quizzes/quiz-l0-ground-rules-03.yaml`, `quiz-l1-wash-decon-09.yaml`, `content/fixit/fix-76.md`.
- **Verdict:** conflicting.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly): The Rag Company (microfiber maker, its own towels), https://www.theragcompany.com/use-and-care-tips: "Choose warm or cold water." "Avoid hot water and sanitize cycles." "Low heat or no heat only."
  - Forum (supporting, Meguiar's staff posts through the search index): one says the team washes polishing cloths in hot water; later staff posts say warm water and low dryer heat. Lando's towel brand is not recorded.
- **Rows for content:**
  - House (status house): "Product piles: hot water."
  - Towel maker example (status sourced): "The Rag Company: warm or cold, never hot."
  - Pending (status verify): "Follow the care tag on your towels. Lando decides hot or warm (pending)."
  - Drop "not the washer" from the dryer line.
- **Lando's one-glance check:** read the care tag on his towels.
- **Who applies:** lead with Lando (KB 13.3); content-curator (the product file, SOPs, lesson); learning-designer (the flashcard and quizzes); troubleshooter (`fix-76.md`).

### FC-89: Towels: no softener, dryer sheets, or bleach; never with cotton; low heat or air dry
- **Claim (KB 13.3).**
- **Verdict:** confirmed (dryer sheets are not named; they stay house).
- **Sources (checked 2026-10-11):** Primary (loaded directly): The Rag Company care guide above: "No fabric softener, no bleach." Softener "coats and clogs the fibers so they stop absorbing and start smearing." "Tumble dry on low, delicate or air-fluff, or hang them to air dry." "Keep microfiber away from cotton towels, clothes and anything that sheds lint." "Liquid only: powders and pods can leave residue in the fibers."
- **Corrected wording:** none. Suggested source line: "The Rag Company care guide, checked 2026-10-11."
- **Who applies:** content-curator (`equipment-microfiber-towels.yaml`).

## Item 15: Water use and runoff

### FC-90: Hose vs pressure washer water use
- **Claim (KB 5.5 "Hose uses roughly double the water of a pressure washer; a full wash off a pressure washer runs about 25 to 35 gallons" `[HOUSE from booklet]` `[VERIFY]`).** Content: `content/lessons/lesson-l0-06-shop-setup.md`, `content/lessons/lesson-l1-06-full-wash.md`, `content/fixit/fix-67.md`.
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):**
  - Primary (loaded directly): EPA WaterSense, archived 2017 page, https://19january2017snapshot.epa.gov/www3/watersense/docs/kidsquiz.pdf: "Hoses can waste more than 6 gallons a minute while a bucket only uses a few gallons for a whole wash."
  - Supporting (news, search index): a Utah official quoted by ABC4 says a pressure washer can clean a whole vehicle with about 20 gallons; an industry figure puts a home hose wash near 100 gallons.
- **Corrected wording:** none. Keep status verify. The supporting figures suggest a hose uses far more than double, so do not teach "double" as fact.
- **Who applies:** lead with Lando (KB 5.5); content-curator (the two lessons); troubleshooter (`fix-67.md`).

### FC-91: Keep wash water out of storm drains (label support)
- **Claim (KB 5.5 "Keep wash water out of storm drains" `[HOUSE]`).**
- **Verdict:** confirmed as label text.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Armor All Extreme Wheel & Tire Cleaner, https://armorall.com/product/extreme-wheel-tire-cleaner: "Note: Do not allow wash water to enter storm drains, streams or lakes."
- **Corrected wording:** none. Suggested source line: "Armor All's wheel cleaner label says do not let wash water enter storm drains, streams, or lakes." Tooele City's own rule is FC-92 and FC-93, still pending.
- **Who applies:** content-curator (`sop-wash.md`, `sop-cleanup.md`, `lesson-l1-06-full-wash.md`).

### FC-92: Dump buckets in a sink or toilet: what Tooele City code says
- **Claim (KB 5.5 "Dump buckets in a sink or toilet, not the street"; KB 13.4 "Buckets dumped in a sink or toilet").** Content: `content/sops/sop-cleanup.md`, `content/sops/sop-cleanup-bike.md`, `content/lessons/lesson-l0-06-shop-setup.md`, `content/lessons/lesson-l1-06-full-wash.md`, `content/academy/quizzes/quiz-l1-wash-decon-07.yaml`, `content/fixit/fix-67.md`.
- **Verdict:** unconfirmed. (The business sweep marked this confirmed from City Code 8-5-5. The merge pass downgraded it: the code text does not say that bucket wash water is "sewage." That is a reading of the code, not a statement by the city.) The house rule stays `[HOUSE]` and needs no source.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Tooele City Code, https://www.tooelecity.gov/government/city_code.php:
  - 8-5-5: "All sewage shall be discharged to public sewers except as provided hereafter. (1) No person shall discharge any sewage from any premises within the POTW service area in and upon any public highway, stream, water course, or public place, or into any drain, cesspool, storm or private sewer, except as provided for hereinafter."
  - 8-5-3: "Wastewater" or "sewage" means "the liquid and water-carried industrial or domestic wastes from residences, dwellings, commercial buildings, industrial facilities and institutions, together with any infiltrating groundwater, surface water and stormwater that may be present, whether treated or untreated, which are discharged to or allowed to enter the POTW."
  - 8-5-3: "Storm sewer" or "storm drain" includes "every street, sidewalk, alley, gutter, roof, parking lot, yard, field, driveway, patio, and other surface within the City across which any naturally occurring stormwater runoff may seep, percolate, or flow."
- **Corrected wording:** none. Content cites the house rule as house, and the Armor All label line (FC-91) for storm drains. No content says city law requires it until the city answers (FC-93).
- **Why it matters:** if bucket water does count as sewage, the code's storm drain definition includes the driveway and the street, which would reach the drop-off model too (FC-93, FC-99).
- **Who applies:** lead with Lando (ask this in the city call); content-curator (the SOPs and lessons must not cite a city rule yet); learning-designer (`quiz-l1-wash-decon-07.yaml`); troubleshooter (`fix-67.md`).

### FC-93: Driveway runoff and the Tooele City call
- **Claim (KB 5.5 and 18.1: "Call Tooele City once about runoff and write the answer down (pending)").**
- **Verdict:** unconfirmed. The call is still pending. One related rule is plain in the code text.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Tooele City Code, https://www.tooelecity.gov/government/city_code.php:
  - 4-11-11: "It is unlawful for any person owning, occupying, or having control of any premises to suffer or permit water from the roof or eves of any house, building, or structure, or from any other source under the control of such person, to be discharged upon the surface of any sidewalk."
  - 9-4-16: "In time of water shortage, whenever it shall in the judgment of the mayor be necessary, the mayor shall, by proclamation ... limit the use of water ... Those nonessential purposes which may be restricted or curtailed absolutely shall include ... (b) Washing automobiles, trucks, trailers, trailer houses, or other types of mobile equipment." (Second part read by the business sweep.)
  - The sweep found no storm-water page and no illicit-discharge chapter that speaks to washing a car in a driveway. The city's outdoor watering schedule is "voluntary."
- **Corrected wording:** none for the runoff call. Suggested KB 5.5 additions, status sourced: "Tooele City Code 4-11-11: do not let water from anything you control run onto the sidewalk." "During a declared water shortage, the Tooele City mayor can restrict car washing (City Code 9-4-16)." These apply only inside Tooele City (FC-98).
- **Lando's one-glance check:** call the city or county once about driveway runoff and write the answer down.
- **Who applies:** lead with Lando (KB 5.5, 18.1); content-curator (`lesson-l1-06-full-wash.md`, `lesson-l0-06-shop-setup.md`); troubleshooter (`fix-67.md`).

## Item 16: Business setup and legal (KB 19 checklist)

The legal entries rest on the agencies' own pages. The Utah Code text was not read: le.utah.gov failed through the proxy (TLS error) and returned HTTP 503 to the fetch tool. The Tax Commission says its publications "are reference tools. They are not all-inclusive and should not be used as legal references."

### FC-94: Utah taxes detailing
- **Claim (KB 19: "Ask the Utah State Tax Commission whether detailing is taxable").**
- **Verdict:** corrected. The Tax Commission lists detailing as taxable.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: Publication 5 (Rev. 07/26), https://tax.utah.gov/forms/form-pubs/pub-05, "What is Taxable": "Labor and parts to repair or renovate vehicles", "Detailing", "Cleaning a vehicle's interior", "Cleaning a vehicle's exterior when it includes cleaning the vehicle's interior". "Washing Vehicles in Dealer Inventory: Cleaning, washing and detailing vehicles is taxable unless the vehicle is held in resale inventory."
  - Primary: Publication 25 (Rev. 08/26), https://tax.utah.gov/forms/form-pubs/pub-25: "Every seller with an established presence in Utah (see Nexus Filers, below) must have a Utah Sales Tax License." (Read by the business sweep.)
  - Primary: Tooele City business license page (FC-97): "if you collect sales tax in Tooele City, please use Tooele City Sales Tax Code 23048 when filing your taxes."
- **Corrected wording:** KB 19: "Utah taxes detailing. Tax Commission Publication 5 (Rev. 07/26) lists detailing, interior cleaning, and exterior cleaning that includes the interior as taxable. Get a Utah sales tax license (form TC-69 at tap.utah.gov) before the first paid job. Tooele City asks for the sales tax number on its business license application. Still to ask the Tax Commission: exterior-only washes (FC-95)." Status: sourced 2026-10-11 for detailing; verify for exterior-only.
- **Why it matters:** collecting no sales tax on taxable work leaves Lando owing it himself.
- **Who applies:** lead with Lando (KB 19); learning-designer (`docs/CURRICULUM.md` L7 Business outline, setup checklist); business-customer (Phase 4 prices and receipts).

### FC-95: Exterior-only washes and sales tax
- **Claim (Wash & Ceramic Wax, exterior-only Monthly Maintenance, and bike washes are taxed the same as detailing; KB 19, 15.1).**
- **Verdict:** unconfirmed.
- **Sources (checked 2026-10-11):** Primary (loaded directly): Publication 5 names exterior cleaning as taxable only "when it includes cleaning the vehicle's interior." Its broader line sits under the dealer-inventory heading. A Utah Code exemption for unassisted cleaning (59-12-104) was seen only in search summaries.
- **Corrected wording:** none. Keep status verify.
- **Lando's one-glance check:** ask the Tax Commission (801-297-2200) whether a hand exterior wash with spray wax, with no interior work, is taxable.
- **Who applies:** lead with Lando (KB 19).

### FC-96: Prices and the Quote record carry no sales tax
- **Claim (KB 15.1 list prices; KB 15.4 worked examples used as unit tests; the Quote record in `src/schemas/runtime-job.ts`, whose total is the priced lines plus the mobile and travel fees).**
- **Verdict:** conflicting. Prices are house decisions, and detailing is taxable (FC-94).
- **Sources (checked 2026-10-11):** Publication 5 (FC-94). The business sweep read `src/schemas/runtime-job.ts`: no tax field.
- **Corrected wording:** none from the fact-checker. Suggested KB 15 note: "Sales tax: Lando decides whether list prices include sales tax or tax is added at checkout (pending)."
- **Why it matters:** every quote, receipt, and unit-tested total is off by the tax if this is not decided.
- **Who applies:** lead with Lando (KB 15); architect through the lead (the Quote record has no tax field); business-customer (Phase 4 pricing calculator); qa-adversary (the 15.4 unit tests); learning-designer (the price flashcards, such as `flash-prices-example-mobile.yaml`, get a tax-pending note only after Lando decides).

### FC-97: Tooele City business license for a home business
- **Claim (KB 18.1 and 19 list a pending call about home-occupation rules; KB 19 lists no city business license).**
- **Verdict:** corrected. A license is required inside Tooele City.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):**
  - Primary: https://www.tooelecity.gov/services/community_development/business_licenses/index.php: "The Business Licensing Office is located in City Hall, 90 North Main Street, Tooele, Suite 108 (Community Development). Anyone offering a service from their home, for compensation, requires a Tooele City Business License." Phone 435.843.2110.
  - Primary (read by the business sweep): City Code 5-6-2: "It shall be unlawful for any person to engage in a home occupation without first securing a business license therefor, unless expressly exempt by law." Home Occupation Business License Check List (updated March 9, 2021): "1. Register your business name with the State of Utah ... 2. Register your business with the Utah State Tax Commission ... 3. Pick up Business License Application" and "ALL BUSINESS LICENSES EXPIRE December 31st of each year".
- **Corrected wording:** KB 19 add: "Get a Tooele City business license for a home occupation (City Hall, 90 North Main Street, Suite 108; 435-843-2110). The city's order: register the business name with the State, register with the Utah State Tax Commission, then apply to the city. City licenses expire December 31 each year." Applies only if the home is inside Tooele City (FC-98).
- **Who applies:** lead with Lando (KB 18.1, 19); learning-designer (L7 outline).

### FC-98: Which office licenses the home shop
- **Claim (KB 5.5, 18.1, 19: "Call Tooele City").**
- **Verdict:** corrected. It depends on where the home sits, and the KB keeps the address private.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** the Tooele City business license page: "If you live in Stansbury, or other unincorporated areas of Tooele County, you fall under Tooele County's jurisdiction and would need to contact the Tooele County Clerk's Office for business licensing at 435.843.3140 ... If you live in a city other than Tooele (including Lake Point and Erda), please contact that city about their licensing requirements." The business sweep also read: "By law, all businesses are required to be licensed with the local municipality in which they are doing business".
- **Corrected wording:** "Call the city or county where the home shop sits: Tooele City if the home is inside Tooele City limits; the Tooele County Clerk (435-843-3140) for Stansbury Park and other unincorporated areas; the city office for Grantsville, Erda, or Lake Point. For mobile jobs, ask each city or county you work in what it requires."
- **Who applies:** lead with Lando (KB 5.5, 18.1, 19).

### FC-99: Home occupation rules vs drop-off at home
- **Claim (KB 1, KB 2 rule 1, KB 18.1: drop-off at Lando's home is the default; customer cars sit in the driveway, and the wash, clay, polish, and wax happen at home).**
- **Verdict:** conflicting, if the home is inside Tooele City.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** City Code 7-2-19, https://www.tooelecity.gov/government/city_code.php: "Home occupations are permitted upon compliance with the following: (1) shall be carried on entirely within the dwelling unit or accessory building on the premises; (2) shall not include the outside storage of goods, materials, or equipment; (3) shall not involve any use of any outside yard area about the premises whereupon the dwelling unit or accessory building is located, except for customer parking ...; (9) shall not create a nuisance; (10) shall specifically exclude: vehicle repair work, body and fender work, firewood sales ...; (11) shall not display signs".
- **Corrected wording:** none from the fact-checker. Suggested KB 18.1 note: "Tooele City Code 7-2-19 (only if the home is inside Tooele City): a home occupation must be carried on entirely inside the home or an accessory building, may use the outside yard only for customer parking, may not store equipment outside, may not display signs, and excludes vehicle repair work and body and fender work. Ask the city whether driveway washing and paint polishing fit. Lando decides after the call (pending)." Whether detailing counts as "vehicle repair work" or "body and fender work" is the city's call.
- **Why it matters:** the whole drop-off model, and every lesson that says the driveway is the shop.
- **Who applies:** lead with Lando (KB 1, 2, 18.1); content-curator (`lesson-l0-06-shop-setup.md`, `card-setup-kit.yaml`: no content says the home shop is approved); troubleshooter (`fix-67.md`); learning-designer (L7 outline).

### FC-100: Home occupation assistant rule vs DJ and future hires
- **Claim (KB 1: DJ, Suzie's son, helps on Saturdays at the home shop; future hires will train in this system).**
- **Verdict:** conflicting, if the home is inside Tooele City.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** City Code 7-2-19: "(6) shall be carried on only by persons residing in the dwelling unit; (7) shall have no employees or assistants other than members of the immediate family, and only if such family members reside in the dwelling unit, except as otherwise permitted by this Chapter". The only exception in the section is one non-residential employee for home child day care. Whether DJ lives in the home or counts as immediate family is not in the KB.
- **Corrected wording:** none from the fact-checker. Suggested KB 19 line: "Tooele City home occupations allow assistants only if they are immediate family who live in the home (City Code 7-2-19). Ask the city how this applies to DJ and future hires. Lando decides (pending)."
- **Who applies:** lead with Lando (KB 1, 19, 25 question 6); learning-designer (L7 outline).

### FC-101: DBA registration
- **Claim (KB 19: "Register the business name (DBA) with the state while operating as a sole proprietor").**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11, business sweep, loaded directly):** https://corporations.utah.gov/business-entities/dba/: "A DBA can be a Sole Proprietor or a General Partnership." "You cannot amend the name of a DBA." Form, https://www.corporations.utah.gov/wp-content/uploads/2021/09/dbaform.pdf: "When approved the DBA is registered for 3 years." "If you want a new name (adding or changing the existing name), a new DBA filing is required." Utah Code 42-2 was not read; a search summary says that chapter was recodified on Oct 1, 2026, which is not confirmed, so no section number is cited.
- **Corrected wording:** suggested KB 19: "Register the business name as a DBA with the Utah Division of Corporations and Commercial Code. It lasts 3 years and must be renewed. A DBA name cannot be changed later; a new name needs a new filing, so file once the brand name is final (KB 25 question 5)."
- **Who applies:** lead with Lando (KB 19); learning-designer (L7 outline).

### FC-102: DBA public record vs the private home address
- **Claim (KB 1: "Home shop address: never stored in the repo and never shown publicly"; a DBA filing asks for addresses).**
- **Verdict:** conflicting.
- **Sources (checked 2026-10-11, business sweep, loaded directly):** the DBA form: "Under GRAMA {63G-2-201}, all registration information maintained by the Division is classified as public record. For confidentiality purposes, you may use the business entity physical address rather than the residential or private address of any individual affiliated with the entity." Fields include "Business Address", a registered agent, and "Utah Street Address Required".
- **Corrected wording:** none from the fact-checker. Suggested KB 19 note: "A Utah DBA filing is public record and asks for a business address and a registered agent's Utah street address. Lando decides how to keep the home address off that record before filing (pending)."
- **Who applies:** lead with Lando (KB 1, 19).

### FC-103: Insurance names: garagekeepers, care custody and control
- **Claim (KB 19: ask for "garagekeepers" or "care, custody and control" coverage).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** State Auto risk-control bulletin TB-F41 (1112), a 2012 insurer document (State Auto is now part of Liberty Mutual), https://sacom-l3.stateauto.com/uploadedfiles/Content/pdfs/TB-F41-1112-NW%20Garage%20Operations%20and%20Care-Custody-Control.pdf: a "Garage" or "Commercial General Liability" policy "is not designed to and will not provide coverage for these types of claims." "Called Garagekeepers Insurance, we provide coverage under three broad categories". Options: legal liability, direct coverage on a primary basis, direct coverage on an excess basis. One insurer; Lando's own policy wording governs.
- **Corrected wording:** suggested KB 19: "Insurance for customer cars: ask for garagekeepers coverage (also called care, custody and control coverage). A general liability policy alone does not cover customer cars in your care. Ask whether the form is legal liability, direct primary, or direct excess."
- **Who applies:** lead with Lando (KB 19, 25 question 7); learning-designer (L7 outline).

### FC-104: Garagekeepers may not pay for damage from your own work
- **Claim (KB 19 implies garagekeepers protects customer cars in Lando's care; `content/cards/card-kills-the-buff.yaml` line 40 "Any car worth more than your insurance covers").**
- **Verdict:** corrected.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** the same State Auto bulletin: "this type of insurance does not provide protection to you in the event you cause damage to a vehicle through your own work on it. The installation of a defective part or use of defective materials or performing a repair or service in error are exposures considered "business risks"". One insurer, 2012. Whether Lando's policy covers polishing damage is unknown (KB 25 question 7).
- **Corrected wording:** KB 19 add: "Garagekeepers coverage may not pay when your own work damages the car, for example polishing through the clear coat. Ask the agent, in writing, whether polishing damage is covered and what would cover it." Status verify until Lando has the answer. No content promises that polishing damage is insured.
- **Why it matters:** the biggest risk in a polish job (going through the clear, KB 2 rule 10) may be uninsured.
- **Who applies:** lead with Lando (KB 19, 25 question 7); content-curator (`card-kills-the-buff.yaml` line 40, `lesson-l3-04-kills-the-buff.md`); learning-designer (L7 outline, L4 stop-rule material).

### FC-105: Employee vs contractor in Utah
- **Claim (KB 19: "Before paying DJ or any helper: employee vs contractor").**
- **Verdict:** confirmed (the unemployment insurance test; workers' comp and IRS tests not checked here).
- **Sources (checked 2026-10-11, business sweep, loaded directly):** Department of Workforce Services, https://jobs.utah.gov/UI/Employer/Public/Handbook/IndependentContractor.aspx: services for wages are employment "unless it is shown to the satisfaction of the division that: The individual is customarily engaged in an independently established trade, occupation, profession, or business of the same nature as that involved in the contract of hire for services; and The individual has been and will continue to be free from control or direction over the means of performance of those services". https://jobs.utah.gov/UI/Employer/Public/IsContractor.aspx lists as myths that a 1099 or a signed contractor agreement makes a worker a contractor.
- **Corrected wording:** suggested KB 19: "Utah treats a paid helper as an employee unless the business shows both: the helper runs an independently established business of the same kind, and the helper is free from your control over how the work is done (Workforce Services). A 1099 or a signed contractor agreement does not make someone a contractor."
- **Who applies:** lead with Lando (KB 19, 25 question 6); learning-designer (L7 outline).

### FC-106: Workers' comp before paying DJ
- **Claim (KB 19: "Utah workers' comp").**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11, business sweep, loaded directly):** Labor Commission employer guide, https://laborcommission.utah.gov/divisions/industrial-accidents/employers/employers-guide-to-workers-compensation/: "With a few exceptions, every employer is required to provide workers' compensation coverage for all its employees. Refer to Utah Code Ann. §34A-2-201." Employers must post notice that they comply. The exceptions were not checked.
- **Corrected wording:** suggested KB 19: "Every Utah employer must carry workers' compensation for its employees, with a few exceptions, and must post the compliance notice (Labor Commission). Ask the Industrial Accidents Division (801-530-6800) before relying on an exception."
- **Why it matters:** an injured, uninsured helper is Lando's cost.
- **Who applies:** lead with Lando (KB 19, 25 question 6); learning-designer (L7 outline).

### FC-107: Minors may not operate power equipment
- **Claim (KB 19's helper checklist says nothing about age; DJ's age is not in the KB).**
- **Verdict:** corrected. The checklist needs the Employment of Minors Act.
- **Sources (checked 2026-10-11; rechecked by the merge pass, loaded directly):** Labor Commission, https://laborcommission.utah.gov/divisions/utah-antidiscrimination-and-labor-uald/wage-claim/: "Minors are defined as anyone 17 years old or younger. However, the Act does not apply to minors 16 or 17 years of age if they: Have received a high school diploma, Have received a school release certificate Are legally married Are heads of a household". "Minors are prohibited by law from working in any hazardous occupation, including mining, manufacturing, roofing, using heavy machinery or operating power equipment." "It is the responsibility of the employer to determine that the work being done by the youth worker is not prohibited by Utah or federal labor laws." This is the agency's plain-English page. The rule text and the federal hazardous-occupation list were not read, so whether a DA polisher, compressor, or shop vac counts as "power equipment" for a 16 or 17 year old is not settled.
- **Corrected wording:** KB 19 add: "If a helper is under 18, Utah's Employment of Minors Act applies. The Labor Commission says minors may not work in hazardous occupations, including operating power equipment, and limits hours for minors. Lando confirms DJ's age and decides what DJ may run before DJ uses the polisher or any power tool (pending)." In content, add a pending row, status verify, wherever DJ or crew runs a power tool: "Who may run power tools: Lando decides (pending)." Invent no age rule.
- **Why it matters:** a teen running a power polisher for pay may be illegal, and it is a safety risk either way.
- **Who applies:** lead with Lando (KB 19; DJ's age and pay status); learning-designer (`skill-l4-machine-polishing.yaml`, `skill-l4-test-spot.yaml`, L4 drills, L7 outline); content-curator (`lesson-l0-02-stay-safe.md`, the L4 lessons, `equipment-bauer-56367.yaml`, `equipment-air-compressor.yaml`, `equipment-shop-vac.yaml`).

### FC-108: "Payment due at completion, before keys go back": legal footing
- **Claim (KB 15.2 policy 2, a house term).** Content: `content/academy/flashcards/flash-policies-deposit-payment.yaml`, `content/fixit/fix-89.md`.
- **Verdict:** unconfirmed for any legal footing. The policy itself is a house term and needs no source.
- **Sources (checked 2026-10-11):** Supporting (secondary law sites; le.utah.gov did not load): Utah Code 38-2-3, "Repairman's lien on personal property", https://law.justia.com/codes/utah/title-38/chapter-2/section-3/. Their summary: a person who does labor on personal property at the owner's request may keep it until paid, and the lien is subordinate to a lender's security interest. Whether wash and polish work counts was not checked. No verbatim quote.
- **Corrected wording:** none. No policy, script, or lesson cites a law for holding the car until this is checked.
- **Who applies:** lead with Lando (KB 15.2); learning-designer (the flashcard); troubleshooter (`fix-89.md`); business-customer (Phase 4 policy item).

## Item 17: Polish script and aftercare facts (customer content is Phase 4)

These entries check facts only. No aftercare card text is written in Phase 2. The card belongs to business-customer in Phase 4.

### FC-109: Polish script facts
- **Claim (KB 16 script: "Polishing removes a thin layer of clear coat to level out swirls. Scratches that catch a fingernail and rock chips usually can't be fully removed.").**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11, business sweep, loaded directly):**
  - Primary: 3M Scratch Removal System 39071 instructions, https://multimedia.3m.com/mws/media/642801O/scratch-removal-system-part-number-39071-dfu.pdf: "When removing a defect in the paint surface, you are actually removing a very thin layer of the clear coat paint." "The 3M Scratch Removal System will not eliminate deep or wide scratches or scratches that go through the clear coat ... Some deep scratches, acid rain pits, or other types of paint defects may not be able to be removed without repainting a portion of the vehicle."
  - Primary: Chemical Guys, https://www.chemicalguys.com/blogs/exterior-how-tos/types-of-car-scratches: "If you catch the scratch with your fingernail, it likely extends into the paint layer." A pebble "can easily chip or gouge the clear coat, leading to visible surface scratches or even deeper paint damage."
- **Corrected wording:** none. The lead can retag the script sourced 2026-10-11 for Customer View.
- **Who applies:** lead (KB 16 tag); business-customer (Phase 4 walkaround script); content-curator (`lesson-l0-05-what-can-be-fixed.md` source line).

### FC-110: Brush car washes and swirls
- **Claim (KB 16 aftercare: "No automatic washes with brushes. They put every swirl right back in.").**
- **Verdict:** corrected. Makers say brush washes can leave fine scratches and swirls. No maker says "every swirl."
- **Sources (checked 2026-10-11):**
  - Primary (business sweep, loaded directly): Chemical Guys, https://www.chemicalguys.com/blogs/exterior-how-tos/automatic-car-wash-vs-hand-wash: "Some brush-style automatic washes can contribute to light scratches or swirl marks if dirt or debris is trapped in the cleaning materials." Chemical Guys, https://www.chemicalguys.com/blogs/exterior-how-tos/how-to-remove-swirl-marks: "Brush-style automatic car washes can be rough on paint, especially when the equipment holds dirt from previous vehicles." 3M PDF (FC-109): "Examples include fine scratches from automatic car wash brushes."
  - Primary (loaded directly by the merge pass), Tesla 2020 to 2024 manual: "CAUTION: If washing in an automatic car wash, use touchless car washes only. These car washes have no parts, such as brushes, that touch the surfaces of Model Y."
- **Corrected fact for Phase 4 (not card text):** brush washes can leave fine scratches and swirls (Chemical Guys, 3M); Tesla tells its owners to use touchless washes only.
- **Who applies:** lead with Lando (KB 16); business-customer (Phase 4 aftercare card).

### FC-111: Hand wash method; never dish soap
- **Claim (KB 16 aftercare: "Hand wash only: two buckets, pH-neutral soap, top down, microfiber mitt. Never dish soap.").**
- **Verdict:** confirmed (makers' guidance, not label text).
- **Sources (checked 2026-10-11, business sweep, loaded directly):** Chemical Guys, https://www.chemicalguys.com/blogs/exterior-how-tos/the-5-donts-of-washing-your-car: "Dish soap does not belong on your ride!" "go for a pH-balanced car wash soap designed for vehicles." "always start at the top and work your way down." "The best alternative is a Chenille Wash Mitt." https://www.chemicalguys.com/blogs/exterior-how-tos/diy-car-wash: "Implement the two-bucket method and follow the top-to-bottom approach for safe, scratch-free washes." https://www.chemicalguys.com/blogs/exterior-how-tos/can-you-use-dish-soap-to-wash-your-car: "Dish soap strips away wax and sealants, exposing your car's paint to damage." Meguiar's not checked.
- **Corrected wording:** none. Phase 4 note: for Tesla owners, the mitt line faces FC-34.
- **Who applies:** lead (KB 16 tag); business-customer (Phase 4); content-curator (`card-never-on-paint.yaml` dish soap source line).

### FC-112: Dry with a microfiber towel, not a bath towel
- **Claim (KB 16 aftercare).**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11, business sweep, loaded directly):** Chemical Guys, the 5 Don'ts page above: "#5: Don't Use Bath Towels, Rags, or Old T-Shirts to Dry Your Car" "Cheap rags, old t-shirts, or bath towels have rough seams and are often not absorbent enough to get the job done without harming your paint. Instead, reach for a microfiber drying towel".
- **Corrected wording:** none.
- **Who applies:** business-customer (Phase 4).

### FC-113: "Not a squeegee"
- **Claim (KB 16 aftercare: dry with a microfiber towel, "not ... a squeegee").**
- **Verdict:** conflicting. No maker source says never use a squeegee; the line may stand as house advice.
- **Sources (checked 2026-10-11, business sweep, loaded directly):** Chemical Guys, the DIY car wash page above: "Alternatively, consider using a silicone squeegee for the initial wipe-down to remove most water." "If you're using a squeegee, apply minimal pressure and let the tool glide over grooves, curves, and edges." Supporting (search index): Griot's Garage describes a paint-safe soft-blade squeegee followed by a towel.
- **Corrected wording:** none from the fact-checker. Lando picks: keep "not a squeegee" as house advice, or drop the clause.
- **Who applies:** lead with Lando (KB 16); business-customer (Phase 4).

### FC-114: Bird droppings and bugs etch; remove them fast
- **Claim (KB 16 aftercare: "Bird droppings and bug guts come off the same day. Left on, they etch the clear coat.").**
- **Verdict:** confirmed.
- **Sources (checked 2026-10-11):**
  - Primary (business sweep, loaded directly): Chemical Guys, https://www.chemicalguys.com/blogs/exterior-how-tos/what-happens-if-you-dont-wash-your-car: "Bird droppings, for instance, can begin damaging paint in just a few hours"; "Tree sap, bug splatter, and bird droppings may seem minor, but they contain acids that quickly etch into clear coats."
  - Primary (loaded directly by the merge pass), Tesla 2020 to 2024 manual: "To prevent damage to the paint, immediately remove corrosive substances (grease, oil, bird droppings, tree resin, dead insects, tar spots, road salt, industrial fallout, etc.). Do not wait until Model Y is due for a complete wash."
- **Corrected wording:** none.
- **Who applies:** lead (KB 16 tag); business-customer (Phase 4); content-curator (L1 wash lessons, bugs and droppings).

## Item 18: Time standards

### FC-115: Time map and full-detail arithmetic
- **Claim (KB 8.7 "about 4 minutes per 2 x 2 ft section"; KB 17.1 time map; KB 17.2 full-detail order; all `[HOUSE from booklet]`).**
- **Verdict:** confirmed against the house source. No outside source applies; these are house numbers.
- **Sources (checked 2026-10-11; rechecked by the merge pass):** `masterclass/reference/booklet-text.md`, booklet page 9 time map and the full-detail order: "Mid-size sedan, one-step, in the shade. One 2 x 2 ft section is about 4 minutes: 4 to 6 slow passes, wipe, check." "Time on the paint 39, 2 h 30 m, 4 h 55 m". "Straight through, one person 7 h 10 m"; "Working the dwell time, one person 6 h 30 m"; "Two people, one inside and one outside About 5 h".
- **Arithmetic (merge pass):** sections 5+4+3+3+10+5+5+4 = 39. One-step 20+15+10+10+40+20+20+15 = 150 min (2 h 30 m). Two-step 40+30+20+20+80+40+40+25 = 295 min (4 h 55 m). One-step day 30+30+20+150+30+20 = 280 min (4 h 40 m). Two-step day 30+30+20+295+30+20 = 425 min (7 h 5 m; the booklet says "about 7 h"). Full detail straight through, the 16 steps in 17.2 = 430 min (7 h 10 m).
- **Carry-over warnings for content:** (1) the booklet's step 14 says "Each panel hazes 3 to 5 min: start the next." That is superseded (KB 9.1, KB 23) and must not be copied into any 17.2 content. (2) In 17.2, "pre-soak 10" carries FC-03 and FC-16 (verify, and conflicting on Teslas), and "iron/clay 30" names an iron remover the house does not own (KB 3.5 candidate). Show both as status verify.
- **Corrected wording:** none. The tags stay `[HOUSE from booklet]`.
- **Who applies:** content-curator (the time lessons); learning-designer (`flash-times-*` cards); troubleshooter (`fix-25.md`); app-engineer reads the same numbers for the Job Runner in Phase 3.

---

## Apply list by owner (FC-26 to FC-115)

File names come from a text search of `content/` on 2026-10-11. Content is still being written, so search again before editing. Each entry above has the exact wording.

**lead, with Lando (knowledge base, after Lando decides or the entry is confirmed):** KB 3.1 (FC-54, FC-61, FC-62); 3.2 (FC-54, FC-65 to FC-69); 3.3 (FC-31, FC-32, FC-76, FC-77, FC-79); 4 (FC-26, FC-79, FC-80); 5.1 (FC-26, FC-27, FC-35, FC-44, FC-45); 5.2 and 6 (FC-34, FC-52); 5.4 (FC-46 to FC-49); 5.5 (FC-90 to FC-93, FC-98); 7.2 and 7.3 (FC-71 to FC-74); 9.2 (FC-28, FC-29, FC-32); 9.4 (FC-78); 10 (FC-36, FC-37, FC-75); 11 (FC-33 to FC-43); 12.1 and 12.2 (FC-27, FC-30, FC-82 to FC-87); 13.1, 13.3, 13.4 (FC-70, FC-81, FC-88, FC-89); 14 (FC-57 to FC-60); 15 (FC-85, FC-96, FC-108); 16 (FC-109 to FC-114, tags only); 18.1 and 18.2 (FC-51, FC-56, FC-64, FC-97, FC-99); 19 (FC-94, FC-95, FC-97, FC-98, FC-100 to FC-107); 21 (FC-53, FC-55, FC-62, FC-63).

**content-curator:**
- Products: `product-armor-all-extreme-wheel-tire.yaml` (FC-26, FC-27, FC-38, FC-91); `product-armor-all-extreme-tire-shine.yaml` (FC-28 to FC-30); `product-meguiars-hot-shine.yaml` (FC-31, FC-32); `product-meguiars-bug-tar.yaml` (FC-44, FC-45); `product-meguiars-hybrid-ceramic-wax.yaml` (FC-49, FC-51, FC-87); `product-meguiars-m210.yaml`, `product-meguiars-ultimate-compound.yaml` (FC-38, FC-51); `product-cg-citrus-wash-gloss.yaml` (FC-38); `product-meguiars-quik-interior-detailer.yaml` (FC-36, FC-37, FC-75); `product-tuff-stuff.yaml` (FC-37, FC-76); `product-blazin-banana.yaml` (FC-77); `product-blue-magic-headlight-restorer.yaml` (FC-78); `product-meguiars-super-soap.yaml`, `product-meguiars-ultimate-wash-wax.yaml` (FC-79).
- Equipment: `equipment-clay-mitt.yaml` (FC-34, FC-52); `equipment-pad-urotec-yellow.yaml`, `equipment-pad-urotec-maroon.yaml` (FC-54, FC-65 to FC-68, FC-70); `equipment-pad-black.yaml` (FC-69); `equipment-pad-hf-finishing.yaml` (FC-70 scope note); `equipment-backing-plate.yaml` (FC-54, FC-57 to FC-60); `equipment-bauer-56367.yaml` (FC-54 to FC-56, FC-61, FC-62, FC-64, FC-107); `equipment-air-compressor.yaml` (FC-81, FC-107); `equipment-shop-vac.yaml` (FC-107); `equipment-microfiber-towels.yaml` (FC-88, FC-89); `equipment-rd-tc100.yaml` (FC-73, FC-74).
- Cards: `card-tesla-wash-mode-tape.yaml` (FC-33 to FC-43, FC-47); `card-bike-rules.yaml` (FC-27, FC-30, FC-82 to FC-84, FC-86, FC-87); `card-setup-kit.yaml` (FC-27, FC-32, FC-56, FC-99); `card-machine-settings.yaml` (FC-54, FC-55); `card-pad-ladder.yaml` (FC-54, FC-66); `card-thickness-bands.yaml` (FC-71, FC-72); `card-kills-the-buff.yaml` (FC-86, FC-104); `card-maintenance-wash.yaml` (FC-79); `card-never-on-paint.yaml` (FC-111).
- Glossary: `term-dwell.yaml` (FC-45); `term-clear-coat.yaml` (FC-71); `term-micron-mil.yaml` (FC-72); `term-long-throw.yaml` (FC-63); `term-opm.yaml` (FC-61); `term-water-spots.yaml` (FC-46, FC-49); `term-etching.yaml` (FC-47); `term-matte-satin.yaml` (FC-86).
- SOPs: `sop-wheels.md` (FC-26, FC-27); `sop-wheels-tesla.md` (FC-26, FC-38, FC-42); `sop-wash.md` (FC-34, FC-44, FC-45, FC-91); `sop-wash-tesla.md` (FC-34, FC-35, FC-38, FC-45, FC-47); `sop-dry.md` (FC-46, FC-47, FC-49); `sop-clay.md` (FC-34, FC-52); `sop-tires-trim.md` (FC-28, FC-29, FC-31, FC-32); `sop-interior.md` (FC-36, FC-37, FC-75, FC-80); `sop-glass-tesla.md` (FC-33); `sop-tape-tesla.md` (FC-40, FC-43); `sop-polish.md`, `sop-polish-tesla.md` (FC-38, FC-40, FC-55, FC-56); `sop-measure.md`, `sop-measure-tesla.md` (FC-73, FC-74); `sop-protect.md` (FC-49); `sop-cleanup.md`, `sop-cleanup-bike.md` (FC-70, FC-88, FC-91, FC-92); `sop-chain-bike.md` (FC-84); `sop-glass-bike.md` (FC-82, FC-83); `sop-protect-bike.md`, `sop-hand-polish-bike.md` (FC-86, FC-87); `sop-wash-bike.md` (FC-27).
- Lessons: `lesson-l0-02-stay-safe.md` (FC-27, FC-32, FC-47, FC-56, FC-64, FC-107); `lesson-l0-03-never-list.md` (FC-33, FC-84); `lesson-l0-04-how-paint-works.md` (FC-71, FC-73); `lesson-l0-05-what-can-be-fixed.md` (FC-78, FC-109); `lesson-l0-06-shop-setup.md` (FC-88, FC-90, FC-92, FC-93, FC-99); `lesson-l1-01-wheels-first.md` (FC-26, FC-27, FC-42); `lesson-l1-02-pre-rinse.md` (FC-35, FC-45); `lesson-l1-03-towel-wash.md` (FC-34, FC-79); `lesson-l1-04-hard-water-drying.md` (FC-46 to FC-49); `lesson-l1-05-clay.md` (FC-34, FC-52); `lesson-l1-06-full-wash.md` (FC-35, FC-90 to FC-93, FC-114); `lesson-l2-03-wipe-dress.md` (FC-36, FC-37, FC-75); `lesson-l2-05-glass.md` (FC-33); `lesson-l3-02-tc100-gauge.md` (FC-73, FC-74); `lesson-l3-03-thickness-bands.md` (FC-71, FC-72); `lesson-l3-04-kills-the-buff.md` (FC-86, FC-104); `lesson-l4-01-know-the-machine.md` (FC-56, FC-61, FC-63); `lesson-l4-03-pressure.md` (FC-55); `lesson-l4-05-edges-curves-heat.md` (FC-40, FC-43, FC-51, FC-53); `lesson-l4-06-pad-care-backing-plate.md` (FC-54, FC-57, FC-70); `lesson-l4-08-test-spot-ladder.md` (FC-66).

**troubleshooter:** `fix-01.md` (FC-54, FC-55, FC-63); `fix-03.md` (FC-54, FC-62); `fix-07.md` (FC-54, FC-62); `fix-10.md`, `fix-55.md` (FC-66); `fix-13.md` (FC-40, FC-43, FC-53); `fix-14.md` (FC-35, FC-45); `fix-15.md` (FC-46 to FC-49); `fix-17.md` (FC-34, FC-52); `fix-18.md` (FC-50); `fix-19.md`, `fix-48.md`, `fix-81.md` (FC-33, FC-40, FC-43); `fix-20.md` (FC-28, FC-29); `fix-21.md` (FC-73, FC-74); `fix-22.md` (FC-71); `fix-23.md` (FC-54, FC-57 to FC-60); `fix-26.md` (FC-33, FC-39); `fix-30.md` (FC-27, FC-30, FC-82, FC-84, FC-86); `fix-32.md`, `fix-68.md` (FC-36); `fix-33.md` (FC-51); `fix-42.md` (FC-74); `fix-50.md` (FC-70); `fix-53.md`, `fix-87.md` (FC-86); `fix-58.md` (FC-56); `fix-60.md` (FC-26); `fix-65.md` (FC-49); `fix-66.md` (FC-35); `fix-67.md` (FC-90, FC-92, FC-93, FC-99); `fix-74.md` (FC-37, FC-76, FC-77); `fix-76.md` (FC-88); `fix-78.md` (FC-42); `fix-79.md` (FC-73); `fix-82.md` (FC-78); `fix-84.md` (FC-82); `fix-85.md` (FC-84); `fix-89.md` (FC-108). Also `fix-44.md` and `fix-64.md` if they give Bug & Tar a one-minute dwell (FC-45). Search: the "pad wash" case if FC-70 changes its expected wording; "Lando's own words (pending)" is unchanged.

**learning-designer:** drills `drill-l0-safety-start.md` (FC-27, FC-32, FC-56), `drill-l1-wheels.md` (FC-26, FC-27), `drill-l1-pre-rinse.md`, `drill-l1-full-wash.md` (FC-35, FC-45), `drill-l1-dry.md` (FC-46, FC-49), `drill-l1-clay.md` (FC-34, FC-52), `drill-l2-glass.md` (FC-33), `drill-l2-matte-dash.md` (FC-75), `drill-l4-scale-pressure.md` (FC-55), `drill-l4-pad-care.md` (FC-70); flashcards `flash-times-wheel-wait.yaml` (FC-26), `flash-times-bug-tar.yaml` (FC-45), `flash-tesla-cameras.yaml`, `flash-tesla-tape.yaml` (FC-33, FC-40), `flash-tesla-satin-trim.yaml` (FC-43), `flash-tesla-wheels-port.yaml` (FC-42), `flash-tesla-roof.yaml` (FC-41), `flash-tesla-car-wash-mode.yaml` (FC-39), `flash-tesla-gauge.yaml` (FC-73), `flash-gauge-zero.yaml` (FC-74), `flash-machine-cord.yaml` (FC-56), `flash-pads-wash.yaml` (FC-70), `flash-towels-washer.yaml` (FC-88), `flash-bikes-windshield.yaml` (FC-82), `flash-times-headlights.yaml` (FC-78), `flash-prices-store-it-clean.yaml`, `flash-prices-bike-addons.yaml` (FC-85), `flash-policies-deposit-payment.yaml` (FC-108); quizzes `quiz-l1-01-wheels-01.yaml` (FC-26), `quiz-l1-02-pre-rinse-02.yaml`, `quiz-l1-02-pre-rinse-03.yaml` (FC-45 if they state the Bug & Tar time), `quiz-l1-04-drying-04.yaml` (FC-46, FC-49), `quiz-l1-05-clay-05.yaml`, `quiz-l1-wash-decon-10.yaml` (FC-34), `quiz-l1-wash-decon-07.yaml` (FC-92), `quiz-l1-wash-decon-08.yaml` (FC-79), `quiz-l0-ground-rules-03.yaml`, `quiz-l1-wash-decon-09.yaml` (FC-88), `quiz-l2-03-wipe-01.yaml` (FC-75), `quiz-l2-03-wipe-05.yaml` (FC-36), `quiz-l3-02-gauge-01.yaml` (FC-74), `quiz-l4-03-pressure-02.yaml` (FC-55), `quiz-l4-06-pads-plate-01.yaml` (FC-54), `quiz-l4-06-pads-plate-04.yaml` (FC-70), `quiz-l4-machine-08.yaml` (FC-43), `quiz-l0-05-fixable-04.yaml` (FC-78); sign-off `skill-l1-wash-decon.yaml` (FC-45 if it states the time), `skill-l4-machine-polishing.yaml`, `skill-l4-test-spot.yaml` (FC-107 pending row); `docs/CURRICULUM.md` L7 Business outline (FC-94, FC-97 to FC-107).

**business-customer (Phase 4, no text now):** FC-06, FC-34 (Tesla mitt line), FC-78, FC-85, FC-94 to FC-96, FC-104, FC-108, FC-109 to FC-114.

**architect:** FC-96, the Quote record in `src/schemas/runtime-job.ts` has no sales tax field.

**qa-adversary:** FC-85 and FC-96, the 15.4 worked examples used as unit tests, if Lando changes them.

---

## Not checked yet (queue)

These are on the fact-checker's standing list and are **not** verified by anything in this file. They stay `[VERIFY]` until an entry here says otherwise. Everything on the 2026-10-10 queue was checked in FC-26 to FC-115.

| Topic | KB | Priority |
|---|---|---|
| What a 16 or 17 year old may run: the federal hazardous-occupation list (U.S. Department of Labor) and the Utah rule text (Utah Code 34-23, Admin. Code R610) | 19 | legal, safety |
| Utah Code text: sales tax (59-12-103, 59-12-104), workers' comp (34A-2-201), DBA (42-2), repairman's lien (38-2-3); le.utah.gov did not load | 15.2, 19 | legal |
| Tooele County and Grantsville home-business and runoff rules, if the home is outside Tooele City | 5.5, 18.1, 19 | legal |
| Quik Interior Detailer and Tuff Stuff ingredients vs Tesla's interior list (alcohol, citrus, silicone) | 10, 11 | damage |
| Armor All Extreme Tire Shine aerosol: flammability (safety data sheet) | 3.3, 9.2 | safety |
| Hot pipes: water stains chrome; bug remover bakes on a hot exhaust | 12.1 | damage |
| HF clay kit: its own lube and use directions | 6, 4 | damage |
| "Clay can mar soft or black paint; clay mitts are riskier on black paint" `[SOURCED 2026-10-06]`, not reconfirmed | 6 | damage |
| Trim restorer (not owned; KB 9.2 says faded trim needs one) | 9.2, 3.5 | normal |
| Car Wash Mode path on Model S, Model X, and Cybertruck | 11 | normal |
| Spot-free or deionized rinse cost | 5.4 | price |
| Answers only Lando can give (not source checks): which inspection light, which HF pads arrived, leather products owned, founder's rate for both sizes, smoke odor fee, one-step product cost, photo consent default | 3.1, 3.2, 10, 15, 16 | normal |

## Access notes

### 2026-10-10
What loaded directly from the build machine and what did not, so the next check knows where to start:

- Loaded directly: chemicalguys.com (pages and Shopify product JSON), meguiars.co.uk, manuals.harborfreight.com (the 56367 manual PDF), go.harborfreight.com, adamspolishes.com, napaonline.com (through the fetch tool).
- Refused or unreachable: tesla.com and service.tesla.com (HTTP 403 "Access Denied" to plain requests and to a headless browser), harborfreight.com (bot check "Press & Hold"), meguiars.com, meguiarsonline.com and the test.meguiars.com host (no response through the network proxy; the forum now redirects to meguiars.com), detailedimage.com and oreillyauto.com (HTTP 403), manualsfile.com and manualslib.com (HTTP 403), web.archive.org (connection dropped by the proxy).
- For the refused primary sites, page text was read through the search engine's copy of the exact URL, and each entry says so.

### 2026-10-11
- Loaded directly: tesla.cn owner's manual PDFs for the Model Y 2020 to 2024 and 2025+ (China editions, software 2026.26.200.11; every other region returned 403 or 404), service.tesla.com DIY pages, armorall.com, buffandshine.com (product pages sometimes answer 429 or 503; a retry a few seconds later works), ragnify.com, chemicalguys.com (pages, product JSON, safety data sheets), meguiars.co.uk, cdmsweb.3m.com and multimedia.3m.com PDFs, theragcompany.com, didchain.com, nationalcycle.com PDF, h-dmediakit.com spec PDFs, defelsko.com, parkscarcare.net (store JSON), manuals.harborfreight.com, go.harborfreight.com, autogeekonline.net thread pages, tooelecity.gov (city code page, business license page, checklist PDF), tooeleco.gov, tax.utah.gov, corporations.utah.gov, jobs.utah.gov, laborcommission.utah.gov, sacom-l3.stateauto.com (PDF), the EPA 2017 snapshot.
- Refused or unreachable: tesla.com (403), meguiars.com (503), meguiarsonline.com (redirects to meguiars.com), serviceinfo.harley-davidson.com (Access Denied), walmart.com (bot check), 3mcanada.ca (403), autogeek.net (403), le.utah.gov (TLS error through the proxy; 503 to the fetch tool), bluemagicinc.com (redirects to a domain-for-sale page), the kleen-ritecorp.com listing (404).
- Tesla, Harley-Davidson, and Meguiar's forum text from refused sites was read through the search index, and each entry says so.
