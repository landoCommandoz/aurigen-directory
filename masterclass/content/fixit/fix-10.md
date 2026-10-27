---
id: fix-10
type: fixnode
title: Swirls still there after polishing
group: paint
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [swirls, test spot, ladder, compound, ipa, light]
sayIt:
  - still swirls
  - swirls still there
  - still swirled
  - swirls won't come out
  - swirls didn't come out
  - still see swirls
  - spiderwebs still there
  - polish didn't work
  - not cutting the swirls
  - swirl marks still showing
  - need more cut
sources:
  - label: Lando
    date: 2026-10-10
    note: Ladder order and the black pad rule confirmed (BLUEPRINT section 12 item 9).
  - label: Tesla Model Y owner's manual, cleaning cautions, current model
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: No cutting pastes, color restoration compounds, or polishes with harsh abrasives. Cleaning-product damage is not covered by the warranty. Seen on the 2025 and newer Model Y manual and other Tesla manuals. Read through the search index. Fact-checker FC-16. FC-38 found the same lines in the 2020 to 2024 Model Y manual.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Buff and Shine 672CR, 6 in. maroon Uro-Tec pad
    url: https://buffandshine.com/products/672cr-6-maroon-uro-tec-foam-pad-medium-cut
    date: 2026-10-11
    note: Maroon (Medium Cut), the workhorse of the line, reliable medium-cut performance, ideal for one-step compound and polish combinations. Loaded directly. Fact-checker FC-66.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Pages 178 to 181, Cleaning. No chemical based wheel cleaners or pre-wash products. No cutting pastes, color restoration compounds, or polishes containing harsh abrasives. Damage or discoloration from cleaning products is not covered by the warranty. Also says an approved polish with a very mild abrasive may be used occasionally. Loaded directly. Fact-checker FC-38.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - Paint color on the pad. STOP. You are through the clear. Old single-stage paint is the only exception.
  - Panel reads under 100 µm. No compound.
  - One compound pass per section, max.
checks:
  - Did you IPA wipe? Polish oils hide swirls.
  - Fingernail test. Does a nail catch?
  - Look with the light low, then from a few feet back.
  - What does the gauge read on this panel?
causes:
  - Not IPA wiped yet. Polish oils hide swirls.
  - This rung is too mild for this paint.
  - A scratch deeper than polish can reach. If a nail catches, it stays.
steps:
  - Mist the square with IPA.
  - Wipe it with a clean towel.
  - Check it with the light held low.
  - Check it again from a few feet back.
  - Fingernail-test what is left.
  - Show the customer both halves.
  - Re-quote before you go further than what was sold.
  - "Climb one rung: yellow and M210 first, then maroon and M210."
  - "Rung 3 only when the panel reads 100 µm or more: maroon and Ultimate Compound, 3 to 4 sets."
  - Always follow compound with the yellow pad and M210.
  - Wipe, IPA, and check with the light after every rung.
stillHappening:
  - "Still there after compound and polish: it is too deep. Note it, show the customer, and do not chase it."
notes:
  - Over 100 µm means compound is allowed, not required.
  - text: The maroon pad is medium cut (Buff and Shine). It cuts more than the yellow.
    status: sourced
  - text: "On a Tesla, the house ladder allows Ultimate Compound on rung 3."
    status: house
  - text: "Tesla's manual says: Do not use cutting pastes, color restoration compounds, or polishes containing harsh abrasives. These can scour the surface and permanently damage the paint."
    status: sourced
  - text: Tesla's manual says damage or discoloration from cleaning products is not covered by the warranty.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
lessonId: lesson-l4-08-test-spot-ladder
productIds:
  - product-meguiars-m210
  - product-meguiars-ultimate-compound
  - product-ipa-70
equipmentIds:
  - equipment-pad-urotec-yellow
  - equipment-pad-urotec-maroon
  - equipment-inspection-light
  - equipment-rd-tc100
related:
  - card-pad-ladder
  - card-thickness-bands
  - card-ipa-wipe
  - fix-11
  - fix-51
  - fix-55
  - fix-59
  - term-swirls
  - sop-test-spot
  - sop-test-spot-tesla
---
