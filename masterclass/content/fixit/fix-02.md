---
id: fix-02
type: fixnode
title: Pad stops spinning (marker line slows or stops)
group: machine
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [polisher, machine, pad, rotation, marker line, pressure]
sayIt:
  - pad not spinning
  - pad stopped spinning
  - pad won't spin
  - pad stops turning
  - pad not turning
  - pad just vibrates
  - marker line stopped
  - marker line not turning
  - marker line slowing down
  - pad stalls
  - pad bogging down
  - not rotating
  - pad stuck in place
sources:
  - label: HF item page, 56367
    url: https://go.harborfreight.com/sku/56367/
    date: 2026-10-10
    note: Speeds 2 to 3 to apply or remove wax or sealant, speeds 4 to 6 when compounding or polishing. Fact-checker FC-22.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: BAUER 56367 owner's manual, 2021
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-10
    note: Page 8, only use slower speeds for polishing, and keep pressure off the tool so the foam pad lightly contacts the surface. Fact-checker FC-22 and FC-23.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
stopIf:
  - Paint color on the pad. STOP. You are through the clear. Old single-stage paint is the only exception.
checks:
  - "Marker line on the pad edge: turning, slow, or stopped?"
  - Pad flat on the paint, or tilted?
  - Are you on a curve?
  - How much polish is on the pad?
causes:
  - Too much pressure.
  - Tilted pad.
  - A curve.
  - Too much product.
steps:
  - Ease off the pressure.
  - Flatten the pad on the paint.
  - On a curve, use the middle of the pad.
  - Turn the speed up one notch.
  - "Check the product amount: 1 to 2 drops per section after priming."
  - Watch the marker line turn again.
stillHappening:
  - "Still stalls with light pressure on a flat panel: unplug it and run the checks in the jerking fix."
  - "Pad is loaded or hot: open the loaded pad fix."
notes:
  - text: "House setting: work at speed 4 with about 10 lb of pressure. Let the last set float on the machine's own weight."
    status: house
  - text: Harbor Freight's product page says speeds 4 to 6 for polishing or compounding.
    status: sourced
  - text: "The 56367 manual says: Only use slower speeds for polishing. It does not say which speeds count as slower."
    status: sourced
  - text: "The 56367 manual says: Keep pressure off of the tool. The foam pad should lightly contact the polishing surface."
    status: sourced
  - text: Lando decides which applies (pending). Until he does, the house settings stay.
    status: verify
lessonId: lesson-l4-04-speed-sets-marker
productIds:
  - product-meguiars-m210
equipmentIds:
  - equipment-bauer-56367
  - equipment-pad-urotec-yellow
  - equipment-pad-urotec-maroon
related:
  - fix-01
  - fix-35
  - card-machine-settings
  - card-pad-priming
  - lesson-l4-03-pressure
  - sop-polish
---
