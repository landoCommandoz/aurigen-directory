---
id: fix-55
type: fixnode
title: Want to hit it with compound again
group: paint
audience: [owner, crew]
visibility: internal
status: house
kbRef: "8.5"
tags: [compound, ladder, thickness, stop, tesla]
sayIt:
  - compound again
  - second compound pass
  - hit it again with compound
  - another pass of compound
  - more compound
  - compound it twice
  - recompound
  - go harder on it
  - one more compound pass
  - it needs more cut
sources:
  - label: Knowledge base 8.5 and 7.3
    date: 2026-10-07
    note: One compound pass per section, max. Compound only when still swirled and the panel reads 100 µm or more; over 100 means compound is allowed, not required. Every compounded square gets yellow and M210. Still there after compound and polish, it is too deep; note it, show the customer, do not chase it.
  - label: Tesla Model Y owner's manual, cleaning cautions, current model
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: No cutting pastes, color restoration compounds, or polishes with harsh abrasives. Cleaning-product damage is not covered by the warranty. Seen on the 2025 and newer Model Y manual and other Tesla manuals; the 2020 to 2024 page could not be checked line by line. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
stopIf:
  - One compound pass per section, max. Do not compound it again.
  - Panel reads under 100 µm. No compound at all.
  - Paint color on the pad. STOP. You are through the clear. Old single-stage paint is the only exception.
checks:
  - Has this section already had a compound pass?
  - What does the gauge read on this panel?
  - Did it get the yellow pad and M210 after the compound?
  - Did you IPA wipe and check with the light?
causes:
  - The defect is deeper than one compound pass and polish can reach.
  - Polish oils are hiding the result. It has not been IPA wiped yet.
  - It is compound haze, not swirls. It needs the yellow and M210 pass.
steps:
  - Do not compound it again.
  - Run the yellow pad and M210 if it has not had it.
  - Wipe it once.
  - Mist it with IPA and wipe with a clean towel.
  - Check it with the light held low.
  - "Still there: it is too deep. Note it."
  - Show the customer.
  - Do not chase it.
stillHappening:
  - "Haze, not swirls: open the haze after compound fix."
notes:
  - Over 100 µm means compound is allowed, not required.
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
  - product-meguiars-ultimate-compound
  - product-meguiars-m210
  - product-ipa-70
equipmentIds:
  - equipment-pad-urotec-maroon
  - equipment-pad-urotec-yellow
  - equipment-rd-tc100
related:
  - card-pad-ladder
  - card-thickness-bands
  - fix-10
  - fix-11
  - fix-09
  - sop-test-spot
  - sop-test-spot-tesla
---
