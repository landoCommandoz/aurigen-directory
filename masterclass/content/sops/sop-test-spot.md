---
id: sop-test-spot
type: sop
title: Test spot and the pad ladder
stage: test-spot
vehicleBranch: any
audience: [owner, crew]
visibility: internal
status: house
kbRef: "8.5"
plannedMinutes: 10
tags: [test spot, ladder, pad, compound, polish, combo]
synonyms:
  - test spot steps
  - run the test spot
  - which combo
  - climb the ladder
  - pad ladder steps
  - do I need compound
  - yellow or maroon
  - find the combo
sources:
  - label: Lando
    date: 2026-10-10
    note: Ladder order and the black pad rule confirmed (BLUEPRINT section 12 item 9).
steps:
  - text: Pick the worst panel.
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
  - text: "Still swirled and the panel reads 100 µm or more: rung 3, the maroon pad and Ultimate Compound, 3 to 4 sets."
    stopIf: The panel reads under 100 µm. No compound. Stop at rung 2.
    notes:
      - Over 100 µm means compound is allowed, not required.
      - One compound pass per section, max.
      - One pad per liquid. A compound pad never touches polish.
  - text: Wipe the compound off with its own towel.
  - text: Always follow with the yellow pad and M210 to clear the compound haze.
    notes:
      - Every compounded square gets both passes.
  - text: "Check it the same way: wipe, IPA, light."
  - text: "Still there after compound and polish: it is too deep. Note it and do not chase it."
  - text: Show the customer both halves.
  - text: Re-quote before you go further than what was sold.
  - text: Write the winning combo on the job sheet.
related:
  - card-pad-ladder
  - card-thickness-bands
  - card-machine-settings
  - card-ipa-wipe
  - card-stop-rules
  - product-meguiars-m210
  - product-meguiars-ultimate-compound
  - equipment-pad-urotec-yellow
  - equipment-pad-urotec-maroon
  - term-test-spot
  - lesson-l4-08-test-spot-ladder
  - sop-measure
  - sop-polish
  - sop-test-spot-tesla
---
Every car gets a test spot before polishing. The paint picks the combo, not a guess.

You start with the mildest rung and climb one rung at a time. Yellow and M210 first. Still swirled, maroon and M210. Compound is rung 3, and only when the panel reads 100 µm or more. Every compounded square always gets yellow and M210 after it, to clear the compound haze. If it survives compound and polish, it is too deep: note it, show the customer, and do not chase it.

Wipe, IPA, and check with the light after every rung. Polish oils hide swirls, so you never judge an unwiped square.

The winning combo goes on the job sheet. That is the combo for the whole car.
