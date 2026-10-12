---
id: sop-test-spot-tesla
type: sop
title: Test spot and the pad ladder, Tesla
stage: test-spot
vehicleBranch: tesla
audience: [owner, crew]
visibility: internal
status: house
kbRef: "8.5"
plannedMinutes: 10
tags: [test spot, ladder, pad, compound, tesla, model y, warranty]
synonyms:
  - tesla test spot
  - compound on a tesla
  - model y test spot
  - tesla ladder
  - tesla hood test spot
  - can I compound a tesla
sources:
  - label: Lando
    date: 2026-10-10
    note: Ladder order and the black pad rule confirmed (BLUEPRINT section 12 item 9).
  - label: Tesla Model Y owner's manual, cleaning cautions, current model
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: No cutting pastes, color restoration compounds, or polishes with harsh abrasives. Cleaning-product damage is not covered by the warranty. Seen on the 2025 and newer Model Y manual and other Tesla manuals; the 2020 to 2024 page could not be checked line by line. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
steps:
  - text: Pick the worst panel.
    notes:
      - On Lando's Model Y, that was the hood.
  - text: Tape a 2 x 2 ft square on it.
  - text: Split the square in half with tape, so you can compare halves.
  - text: "Rung 1: run the yellow pad and M210 on the square."
    quickCardId: card-pad-ladder
    stopIf: Paint color on the pad. STOP. You are through the clear. Old single-stage paint is the only exception.
    notes:
      - Run the machine the way the polish stage does. Speed and pressure are on the machine settings card.
      - The black pad is never a rung. It is for wax and finishing only.
  - text: Wipe the square.
  - text: "IPA it: mist it and wipe with a clean towel."
    quickCardId: card-ipa-wipe
    notes:
      - Polish oils hide swirls. Wipe before you judge.
  - text: Check it with the light held low.
  - text: Swirls gone? Stop climbing. Yellow and M210 is the combo for the whole car.
  - text: "Still swirled: rung 2, the maroon pad and M210 on the same square."
    stopIf: Paint color on the pad. STOP. You are through the clear. Old single-stage paint is the only exception.
  - text: "Check it the same way: wipe, IPA, light."
  - text: "House rung 3, when it is still swirled and the panel reads 100 µm or more: the maroon pad and Ultimate Compound, 3 to 4 sets."
    status: house
    quickCardId: card-tesla-wash-mode-tape
    stopIf: The panel reads under 100 µm. No compound. Stop at rung 2.
    notes:
      - text: Tesla's manual says do not use cutting pastes, color restoration compounds, or polishes with harsh abrasives. They can scour the surface and permanently damage the paint.
        status: sourced
      - text: Tesla's manual says damage or discoloration from cleaning products is not covered by the warranty.
        status: sourced
      - text: Lando decides how this applies to Teslas (pending).
        status: verify
      - One compound pass per section, max.
      - One pad per liquid. A compound pad never touches polish.
  - text: If you ran rung 3, wipe the compound off with its own towel.
  - text: If you ran rung 3, always follow with the yellow pad and M210 to clear the compound haze.
    notes:
      - Every compounded square gets both passes.
  - text: "Check it the same way: wipe, IPA, light."
  - text: "Still there: it is too deep. Note it and do not chase it."
  - text: Show the customer both halves.
  - text: Re-quote before you go further than what was sold.
  - text: Write the winning combo on the job sheet.
related:
  - card-pad-ladder
  - card-tesla-wash-mode-tape
  - card-thickness-bands
  - card-machine-settings
  - product-meguiars-m210
  - product-meguiars-ultimate-compound
  - term-test-spot
  - lesson-l4-08-test-spot-ladder
  - sop-test-spot
  - sop-measure-tesla
  - sop-polish-tesla
---
The Tesla test spot is the regular ladder, with rung 3 not settled.

The house ladder allows Ultimate Compound on rung 3 when the paint reads 100 µm or more and the first two rungs leave swirls. Tesla's manual says do not use cutting pastes, color restoration compounds, or polishes with harsh abrasives, and it says cleaning-product damage is not covered by Tesla's warranty. Lando decides how this applies to Teslas. Until he does, rung 3 carries the pending row and an unverified badge on every Tesla.

Rungs 1 and 2 are the same as every car. Wipe, IPA, and check with the light after each rung, and write the winning combo on the job sheet.
