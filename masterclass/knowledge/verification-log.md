# Verification log

Owner: fact-checker. Nobody else writes this file. Started 2026-10-10 (Phase 1). Last updated 2026-10-10.

## What this file is

This is where facts from `knowledge/KNOWLEDGE_BASE.md` and the content files get checked against live sources. The fact-checker never edits the knowledge base or any content file. Each entry says what must change and who changes it:

- **Knowledge base:** the lead, with Lando, records the change (OWNERSHIP rule 5).
- **Content files** (`content/cards/`, `content/glossary/`, `content/products/`, lessons, SOPs): content-curator.
- **Fix-It nodes** (`content/fixit/`): troubleshooter.
- **Aftercare card, scripts, paint report wording** (`content/customer/`): business-customer.

## The four verdict words

| Verdict | Plain English | What happens next |
|---|---|---|
| **confirmed** | A source says the same thing the knowledge base says. | The lead can retag it `[SOURCED 2026-10-10]`. Customer View still needs this log entry first. |
| **corrected** | A source says something different. The new wording is in the entry. | The owner swaps in the new wording. Until then, treat the old wording as wrong. |
| **unconfirmed** | No source could be found that settles it. | It stays `[VERIFY]`. Never shown in Customer View. |
| **conflicting** | Good sources disagree with each other or with the house rule. | Lando decides. The label in his hand wins over everything else (KB section 0). |

## How sources are labeled

- **Primary:** the maker's own page, label text, tool manual, or official vendor documentation (Tesla, Harbor Freight, Meguiar's, Chemical Guys). Only primary sources can confirm a fact.
- **Retailer** or **Forum:** supporting evidence only. Never enough on its own.
- **Read through the search index:** some primary sites refused direct loading from the build machine (see "Access notes" at the bottom). For those, the page's own text was read through the search engine's copy of that exact URL. Each entry says when this happened. Where it matters, the entry lists a one-glance check Lando can do himself.

## Summary, 2026-10-10

25 entries. **13 confirmed, 4 corrected, 4 unconfirmed, 4 conflicting.**

| ID | Topic | KB | Verdict | Priority |
|---|---|---|---|---|
| FC-01 | Citrus Wash & Gloss: 1 oz per 5 gal to wash | 4, 3.3 | confirmed | normal |
| FC-02 | Citrus Wash & Gloss: "label says 1 oz per gal to strip" | 4, 23 | corrected | normal |
| FC-03 | Citrus Wash & Gloss in a pump sprayer as a pre-soak | 5.3, 5.1 | unconfirmed | damage |
| FC-04 | Hybrid Ceramic Wax: spray on wet car, second rinse, dry, no cure time | 9.1 | confirmed | normal |
| FC-05 | Hybrid Ceramic Wax: "wax as you dry" and two coats | 9.1 | confirmed | normal |
| FC-06 | Aftercare card: "First 24 hours... protection is still setting up" | 16 | corrected | Customer View |
| FC-07 | Hybrid Ceramic Wax comes in a 32 oz bottle | 3.3 | confirmed | normal |
| FC-08 | IPA panel wipe: 1 cup 70% IPA + 3 cups water | 4, 23 | unconfirmed | normal |
| FC-09 | M210 product name as printed | 3.3 | confirmed | normal |
| FC-10 | M210 "built for dark and sensitive paint" | 3.3 | corrected | normal |
| FC-11 | Ultimate Compound name and size | 3.3 | confirmed | normal |
| FC-12 | M210 and Ultimate Compound label directions on pad and speed | 3.3, 8.2 | unconfirmed | damage |
| FC-13 | Tesla Car Wash Mode menu path, current software | 11 | confirmed | normal |
| FC-14 | What Car Wash Mode does | 11 | confirmed | normal |
| FC-15 | Car Wash Mode path on other model years (2025+ Model Y) | 11 | unconfirmed | normal |
| FC-16 | Tesla manual cautions vs the house wash, pre-soak, and compound steps | 5.1, 5.3, 8.5, 11 | conflicting | **urgent: damage, warranty** |
| FC-17 | Bauer 56367 backing plate thread is M8 x 1.25 | 3.1, 14 | confirmed | damage |
| FC-18 | "M8 x 1.25 comes from the manual's spec listing" | 3.1, 14 | corrected | normal |
| FC-19 | HF 64913 is 5/16 in.-24 and does not fit the 56367 | 14 | confirmed | damage, price |
| FC-20 | HF tech and parts line printed in the manual | 3.1, 14 | confirmed | normal |
| FC-21 | Backing plate bolts on through a center hole | 3.1, 14 | confirmed | normal |
| FC-22 | Polisher speed: HF page says 4 to 6 to polish, manual says "only slower speeds" | 3.1, 8.3 | conflicting | damage |
| FC-23 | Polisher pressure: house 10 lb, manual says keep pressure off | 8.3 | conflicting | damage |
| FC-24 | Abnormal vibration: stop and fix before further use; 30-second test run | 3.1, 21 | confirmed | damage |
| FC-25 | Pad washing: manual says machine wash cold, machine dry medium | 13.1 | conflicting | normal |

## Urgent (damage, property, legal)

1. **FC-16, Tesla.** Tesla's current Model Y manual says: do not use chemical-based wheel cleaners or pre-wash products, do not use cutting pastes or polishes with harsh abrasives, and damage from cleaning products is not covered by Tesla's warranty. The house SOP uses Armor All Extreme Wheel & Tire on wheels (5.1), plans a pump-sprayer pre-soak (5.3), and allows Ultimate Compound on rung 3 of the ladder (8.5). Lando's own car is a Tesla, and Tesla owners will be customers. Lando needs to decide how these three steps apply to Teslas before Phase 2 writes the wash SOP and the Tesla branch.
2. **FC-06, aftercare card.** The "first 24 hours, protection is still setting up" line is customer-facing and Meguiar's says the opposite (no curing time). Fix it before business-customer writes the aftercare card.
3. **FC-22 and FC-23, polisher.** The 56367 manual says to use only slower speeds for polishing and to keep pressure off the tool. The HF product page and the house SOP say speed 4 and about 10 lb. Both sources are Harbor Freight. Lando decides which governs, and the cards should say which.
4. **FC-03, pre-soak.** No Chemical Guys source covers a pump sprayer, a pre-soak, or a dwell time. It stays `[VERIFY]` and out of any SOP until a label or maker answer exists.

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

### FC-06: Aftercare card "First 24 hours: keep it dry if you can. The protection is still setting up."
- **Claim (KB 16 aftercare card text, `[VERIFY against ceramic wax label]`). Customer-facing. The card is not written yet (`content/customer/` does not exist).**
- **Verdict:** corrected. Meguiar's says Hybrid Ceramic Wax has no curing time.
- **Sources (checked 2026-10-10):**
  - Primary: both Meguiar's pages in FC-04 ("there's no curing time"; "ready to protect your paint the moment you rinse").
  - Why the 24-hour idea exists: Meguiar's sells a different product, Hybrid Ceramic **Liquid** Wax (G200416EU). Its UK page (https://www.meguiars.co.uk/product/hybrid-ceramic-liquid-wax-473ml/) says "let it cure for 3-5 minutes, and then wipe off." A 24-hour cure for the liquid wax appears only in forum posts attributed to Meguiar's staff (Forum, supporting only: https://www.meguiarsonline.com/forum/general-auto-detailing-discussion/detailing-101/69401-questions-about-meguiar-s-hybrid-ceramic-liquid-wax, which now redirects and could not be read directly). It does not apply to the spray Lando uses.
- **Corrected wording (two options; Lando picks):**
  - Delete the line.
  - Or replace with: "Your ceramic wax needs no cure time. It started protecting the paint the day we applied it."
- **Who applies:** lead with Lando (KB 16); business-customer (aftercare card text in `content/customer/`).

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
  - Primary (Tesla, read through the search index, see FC-16): the Model Y manual allows denatured alcohol on paint for tar and grease, "then immediately wash the area with water and a mild, non-detergent soap to remove the alcohol." Context only.
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
- **Corrected wording:** none. Keep `[VERIFY per vehicle]`.
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
- **Not rechecked:** the HF FAQ line "center the foam pad on the backing pad and spread compound evenly" (KB 3.1) sits on the blocked product page and was not reread.

### FC-25: Pad washing
- **Claim affected:** KB 13.1 (warm water by hand with a drop of detergent, press out, dry face down on a rack).
- **Verdict:** conflicting, for HF pads only.
- **Source (checked 2026-10-10):** the manual, page 10: "Remove the Pad from the tool when not in use. This will allow the Pad to dry and retain its original shape. The Pads may be machine-washed in cold water with detergent. Then machine-dry the Pads at medium heat."
- **Scope:** this is Harbor Freight's guidance for its pads (the HF finishing pads in KB 3.2). Lando's main pads are Buff and Shine Uro-Tec; Buff and Shine's care guidance was not checked.
- **Corrected wording:** none. Suggested KB 13.1 note: "HF's manual allows machine washing HF pads cold and drying on medium. Uro-Tec care: `[VERIFY with Buff and Shine]`."
- **Who applies:** lead with Lando (KB 13.1); content-curator (`equipment-pad-hf-finishing.yaml`).

---

## Not checked yet (queue)

These are on the fact-checker's standing list and are **not** verified by anything in this file. They stay `[VERIFY]` until an entry here says otherwise.

| Topic | KB | Priority |
|---|---|---|
| Bauer 56367 replacement plate options: ShineMate (M8, price for 6 in.), Maxshine, Griot's BOSS 21 fit | 14 | damage, price |
| Hard-water spot removal products and steps | 5.4 | damage |
| Clay mitt care (Ragnify maker's guidance) | 6 | damage |
| Cold-weather limits for M210, Ultimate Compound, and Hybrid Ceramic Wax | 8, 9.1 | damage |
| Utah sales tax on detailing services (Utah State Tax Commission) | 19 | legal, price |
| Tooele City home occupation rules and wash-water runoff | 5.5, 19 | legal |
| Insurance coverage names (garagekeepers, care custody and control) | 19 | legal |
| Utah employee vs contractor; workers' comp before paying DJ | 19 | legal |
| Aftercare card's other lines (automatic washes, dish soap, bird droppings) | 16 | Customer View |
| Clear coat thickness figures (38 to 50 µm of 100 to 180 µm total) | 7.3 | damage |
| Uro-Tec pad thickness and care | 3.2, 13.1 | normal |

## Access notes, 2026-10-10

What loaded directly from the build machine and what did not, so the next check knows where to start:

- Loaded directly: chemicalguys.com (pages and Shopify product JSON), meguiars.co.uk, manuals.harborfreight.com (the 56367 manual PDF), go.harborfreight.com, adamspolishes.com, napaonline.com (through the fetch tool).
- Refused or unreachable: tesla.com and service.tesla.com (HTTP 403 "Access Denied" to plain requests and to a headless browser), harborfreight.com (bot check "Press & Hold"), meguiars.com, meguiarsonline.com and the test.meguiars.com host (no response through the network proxy; the forum now redirects to meguiars.com), detailedimage.com and oreillyauto.com (HTTP 403), manualsfile.com and manualslib.com (HTTP 403), web.archive.org (connection dropped by the proxy).
- For the refused primary sites, page text was read through the search engine's copy of the exact URL, and each entry says so.
