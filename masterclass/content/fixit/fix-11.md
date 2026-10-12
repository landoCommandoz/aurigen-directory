---
id: fix-11
type: fixnode
title: Haze after compound
group: paint
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [haze, compound, ladder, yellow pad, m210]
sayIt:
  - haze
  - hazy
  - compound haze
  - hazy after compound
  - cloudy after compound
  - dull after compound
  - milky paint
  - foggy paint
  - compound left it cloudy
  - looks cloudy
sources:
  - label: Tesla Model Y owner's manual, cleaning cautions, current model
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: No cutting pastes, color restoration compounds, or polishes with harsh abrasives. Cleaning-product damage is not covered by the warranty. Seen on the 2025 and newer Model Y manual and other Tesla manuals; the 2020 to 2024 page could not be checked line by line. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
stopIf:
  - One compound pass per section, max. Do not compound it again.
  - Paint color on the pad. STOP. You are through the clear. Old single-stage paint is the only exception.
checks:
  - Did this square get the yellow pad and M210 after the compound?
  - Did you wipe the compound off with its own towel?
causes:
  - Compound leaves haze. The yellow pad and M210 pass was skipped.
steps:
  - Wipe the compound off with its own towel.
  - Put the yellow pad on. A compound pad never touches polish.
  - Run the yellow pad and M210 on the square.
  - Wipe it once.
  - Mist it with IPA and wipe with a clean towel.
  - Check it with the light held low.
stillHappening:
  - Never ship a compounded square without the yellow and M210 pass.
  - "Swirls, not haze, still there after compound and polish: it is too deep. Note it and do not chase it."
notes:
  - Every compounded square gets both passes.
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
related:
  - card-pad-ladder
  - card-ipa-wipe
  - fix-10
  - fix-55
  - fix-56
  - term-haze
  - sop-test-spot
  - sop-test-spot-tesla
---
