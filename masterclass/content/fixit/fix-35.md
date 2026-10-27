---
id: fix-35
type: fixnode
title: Pad is loaded, smearing, or stopped cutting
group: machine
audience: [owner, crew]
visibility: internal
status: house
kbRef: "8.4"
tags: [pad, loaded, smearing, compressor, pad swap]
sayIt:
  - pad loaded
  - loaded pad
  - pad is full
  - pad full of polish
  - pad clogged
  - pad gummed up
  - pad caked up
  - pad smearing
  - smearing polish around
  - pad stopped cutting
  - not cutting anymore
  - pad is hot
  - pad worn out mid job
sources:
  - label: Knowledge base 8.4, pad care during the job
    date: 2026-10-07
    note: Blow out or brush the pad after every square. A loaded pad stops cutting and starts smearing. Swap pads when loaded or hot, roughly every two panels, and at minimum a fresh yellow at the halfway point of the car.
stopIf:
  - Paint color on the pad. STOP. You are through the clear. Old single-stage paint is the only exception.
checks:
  - Did you blow out or brush the pad after the last square?
  - How many panels has this pad done?
  - Is the pad hot?
  - Are you at the halfway point of the car?
causes:
  - The pad was not blown out or brushed after every square.
  - The pad is overdue for a swap. Swap roughly every two panels.
  - The pad is hot.
steps:
  - Let go of the trigger with the pad still on the paint.
  - Lift the pad.
  - Blow out the pad with the compressor, or brush it.
  - Still loaded or hot? Swap to a fresh pad.
  - Put a fresh yellow on at the halfway point of the car, at minimum.
  - Blow out or brush the pad after every square from now on.
stillHappening:
  - Wash the loaded pads the same night, before the polish dries in.
  - "Running short of pads: plan 2 to 3 finishing or polishing pads per car for a one-step."
notes:
  - One pad per liquid. A compound pad never touches polish.
  - text: A pad brush is on the list of candidates to evaluate. It is not bought yet.
    status: verify
lessonId: lesson-l4-06-pad-care-backing-plate
equipmentIds:
  - equipment-air-compressor
  - equipment-pad-urotec-yellow
  - equipment-pad-urotec-maroon
related:
  - card-pad-priming
  - fix-02
  - fix-36
  - fix-50
  - sop-cleanup
  - sop-polish
---
