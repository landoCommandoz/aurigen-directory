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
lessonId: lesson-l3-02-tc100-gauge
equipmentIds:
  - equipment-rd-tc100
related:
  - fix-43
  - card-thickness-bands
  - sop-measure
  - term-micron-mil
---
