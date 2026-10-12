---
id: sop-polish
type: sop
title: Machine polishing, one-step
stage: polish
vehicleBranch: any
audience: [owner, crew]
visibility: internal
status: house
kbRef: "8.3"
plannedMinutes: 150
tags: [polish, machine, one-step, square, speed, pressure, sets]
synonyms:
  - polish steps
  - polish the car
  - run the polisher
  - one step polish
  - machine polish
  - polishing order
  - square by square
  - how do I polish
  - buff the car
sources:
  - label: Knowledge base 14, backing plate research
    date: 2026-10-07
    note: The unplugged plate checks.
  - label: HF item page, 56367
    url: https://go.harborfreight.com/sku/56367/
    date: 2026-10-10
    note: Speeds 2 to 3 to apply or remove wax or sealant, speeds 4 to 6 when compounding or polishing. Fact-checker FC-22.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: BAUER 56367 owner's manual, 2021
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-10
    note: Page 7, the 30-second test run. Page 8, only use slower speeds for polishing, and keep pressure off of the tool so the foam pad lightly contacts the surface. Pages 3 and 10, abnormal noise or vibration. Fact-checker FC-22, FC-23, and FC-24.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
steps:
  - text: Check for shade, a cool panel, and no wind.
    stopIf: Sun, wind, or a panel too hot to hold your hand on. Do not polish.
  - text: Check the panel's band allows the machine.
    quickCardId: card-thickness-bands
    stopIf: Under 75 µm. No machine. Hand protection only.
  - text: "Unplugged, check the backing plate: center bolt tight, pad centered, hooks not bald or melted, plate not cracked or warped."
    status: sourced
    notes:
      - Spin the plate by hand and watch the edge.
  - text: "Test run it off the car: pad mounted, plug it in, highest speed, at least 30 seconds."
    status: sourced
    stopIf: Abnormal noise or vibration. Stop. Get it fixed before further use.
  - text: Run the cord over your shoulder.
  - text: Tape the panel into 2 x 2 ft squares. One square at a time.
    panelRoute: polish
  - text: Put on the pad the test spot picked, with its polish.
    quickCardId: card-pad-ladder
    notes:
      - One pad per liquid. A compound pad never touches polish.
  - text: "New pad only: work 3 drops into the face with a finger until it is damp all over."
    quickCardId: card-pad-priming
    notes:
      - text: "Not checked yet: what your M210 and Ultimate Compound bottles say about priming, pad, and speed. If the bottle says to prime with M34 Final Inspection, that differs from this step."
        status: verify
      - text: The label on the bottle beats this app.
        status: house
      - text: "What crew does next when the label and this app disagree: Lando decides (pending)."
        status: verify
  - text: "New pad only: add 3 to 4 pea-size drops."
  - text: "Every square after that: 1 to 2 drops, not a full dose."
  - text: Set the dial to speed 1 to 2.
  - text: Set the pad flat on the paint before you pull the trigger.
    timer: { kind: section, seconds: 240 }
    notes:
      - About 4 minutes per square, including the wipe and the check.
  - text: Spread the polish across the whole square.
  - text: Turn the dial to speed 4.
    status: house
    notes:
      - text: Harbor Freight's product page says speeds 4 to 6 for polishing or compounding.
        status: sourced
      - text: "The 56367 manual says: Only use slower speeds for polishing. It does not say which speeds count as slower."
        status: sourced
      - text: Lando decides which applies (pending).
        status: verify
  - text: Use about 10 lb of pressure.
    status: house
    notes:
      - text: "The 56367 manual says: Keep pressure off of the tool. The foam pad should lightly contact the polishing surface."
        status: sourced
      - text: Lando decides which applies (pending).
        status: verify
  - text: Move about 1 inch per second. Slower than feels right.
  - text: "Run one set: left to right overlapping by half, then top to bottom."
  - text: Run 4 to 6 sets on the square.
    stopIf: Paint color on the pad. STOP. You are through the clear. Old single-stage paint is the only exception.
    notes:
      - Keep the pad an inch off edges and body lines.
      - Curves get the middle of the pad. Never tilt onto an edge.
      - "Plastic bumpers heat fast: lighter pressure, lower speed, shorter time."
      - "Pad looks or feels dry: mist the face lightly with water. Do not soak it. Re-mist every 2 or 3 squares as needed."
  - text: Watch the marker line on the pad edge. If it stops turning, ease up and flatten the pad.
  - text: Check the heat with your hand on the panel.
    stopIf: Too hot to keep your hand on. Stop and let it cool.
  - text: "Watch the polish: creamy, then see-through, then almost gone. When it goes clear, it is spent. Stop."
  - text: On the last set, let the machine float on its own weight.
  - text: Let go of the trigger with the pad still on the paint.
  - text: Lift the pad.
  - text: Rest the polisher on its side on a towel.
    notes:
      - Never park it spinning in one spot.
  - text: Wipe the square once.
    notes:
      - Once, at the end of the square's sets. Never wipe and re-apply between passes.
  - text: "IPA it: mist it and wipe with a clean towel."
    quickCardId: card-ipa-wipe
  - text: Check it with the light held low.
  - text: Check it again from a few feet back.
    notes:
      - "Swirls still there: fingernail-test it. Re-quote before you go further than what was sold."
  - text: "Compound square? Follow it with the yellow pad and M210 to clear the haze."
    notes:
      - One compound pass per section, max.
      - Never ship a compounded square without the yellow and M210 pass.
  - text: Blow out or brush the pad.
    notes:
      - A loaded pad stops cutting and starts smearing.
  - text: Swap pads when one is loaded or hot, roughly every two panels.
    notes:
      - At minimum, a fresh yellow at the halfway point of the car.
  - text: Move to the next square.
    stopIf: Past the cutoff time. Do not start a new square.
related:
  - card-machine-settings
  - card-pad-priming
  - card-pad-ladder
  - card-ipa-wipe
  - card-thickness-bands
  - card-stop-rules
  - equipment-bauer-56367
  - equipment-backing-plate
  - equipment-pad-urotec-yellow
  - equipment-pad-urotec-maroon
  - product-meguiars-m210
  - product-meguiars-ultimate-compound
  - term-set
  - term-crosshatch
  - lesson-l4-01-know-the-machine
  - lesson-l4-03-pressure
  - lesson-l4-04-speed-sets-marker
  - lesson-l4-07-full-square
  - sop-test-spot
  - sop-protect
  - sop-polish-tesla
---
One 2 x 2 ft square at a time, with the combo the test spot picked. Keep the pad flat, move slower than feels right, and keep the marker line turning.

Prime a new pad once. After that, 1 to 2 drops per square: the pad is already charged. If the polish looks dry and you cannot finish the square, mist the pad with water. Never a full dose, and never wipe and re-apply between passes. Wipe once, at the end of the sets.

Speed and pressure are not settled. The house setting is speed 4 and about 10 lb. Harbor Freight's product page says speeds 4 to 6 for polishing. The 56367 manual says only use slower speeds for polishing and keep pressure off the tool. Lando decides which applies, and every place that shows speed or pressure shows all of it.

Paint color on the pad means stop: you are through the clear. Old single-stage paint is the only exception.

The time plan for a mid-size sedan is about 2 h 30 m on paint, across 39 squares. Add a third for a truck or SUV, and more for hot weather, wind, or a filthy car. The first car runs long.
