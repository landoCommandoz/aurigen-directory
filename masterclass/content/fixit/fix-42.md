---
id: fix-42
type: fixnode
title: Pressed ZERO on the car
group: gauge
audience: [owner, crew]
visibility: internal
status: sourced
kbRef: "7.2"
tags: [gauge, tc100, zero, readings, baseline]
sayIt:
  - pressed zero on the car
  - zeroed on the car
  - hit zero on the paint
  - zeroed it on the hood
  - zeroed the gauge wrong
  - calibrated on the car
  - reset the gauge on the paint
  - readings all off after zero
  - forgot the zero plate
sources:
  - label: Knowledge base 7.2, TC100 research
    date: 2026-10-06
    note: Zero only on the included bare plate. Never press ZERO on the car; it offsets every later reading. Hold it flat. Door jamb first is the baseline. 3 to 5 readings per panel.
  - label: Fact-checker FC-74, TC100 zero and screen codes
    date: 2026-10-11
    note: No R&D TC100 manual or maker page was found to recheck the zero and screen-code steps. Another maker's gauge manual (Sauter) says a zero is not valid unless the probe sits directly on the calibration plate or other uncoated metal. Lando's check is the printed TC100 manual.
stopIf:
  - Never press ZERO on the car. It offsets every later reading.
checks:
  - Did you press ZERO with the gauge on paint?
  - Do the readings look off from the door jamb baseline?
causes:
  - ZERO was pressed on the car, so every reading after it is off.
steps:
  - Stop writing readings down.
  - Find the TC100's bare plate.
  - Zero the gauge on the bare plate. Only there.
  - Take the door jamb reading again.
  - Write it down as your baseline.
  - Hold the gauge flat on each panel.
  - Take every panel reading again, 3 to 5 per panel.
  - Write them down.
stillHappening:
  - "Readings still look wrong: open the gauge reading looks wrong fix."
notes:
  - 20 µm swings within a foot are normal.
  - text: The zero step comes from the 2026-10-06 research. No TC100 manual was found online to recheck it. Read the printed TC100 manual.
    status: verify
lessonId: lesson-l3-02-tc100-gauge
equipmentIds:
  - equipment-rd-tc100
related:
  - fix-43
  - card-thickness-bands
  - sop-measure
  - term-micron-mil
---
