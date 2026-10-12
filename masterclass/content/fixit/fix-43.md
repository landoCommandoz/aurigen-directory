---
id: fix-43
type: fixnode
title: Gauge screen shows Fe, NFe, SNG, or moving dots
group: gauge
audience: [owner, crew]
visibility: internal
status: sourced
kbRef: "7.2"
tags: [gauge, tc100, screen, units, microns]
sayIt:
  - what does fe mean
  - what does nfe mean
  - what does sng mean
  - gauge shows dots
  - moving dots
  - gauge screen codes
  - gauge says fe
  - gauge won't give a number
  - gauge is waiting
  - gauge reading in mils
  - what are the units
sources:
  - label: Knowledge base 7.2, TC100 research
    date: 2026-10-06
    note: Fe is a steel substrate, NFe is aluminum, both read fine. SNG is single-reading mode. µm is microns, leave the units alone. Moving dots mean waiting.
checks:
  - What does the screen show right now?
causes:
  - Moving dots mean the gauge is waiting for a reading.
  - Fe means steel under the paint. NFe means aluminum. Both read fine.
  - SNG means single-reading mode.
  - µm means microns.
steps:
  - Hold the gauge flat on the panel.
  - Wait for the dots to stop.
  - Read the number in microns.
  - Write it down.
  - Leave the units alone.
stillHappening:
  - "Readings still look wrong: open the gauge reading looks wrong fix."
notes:
  - text: 1 mil = 25.4 µm.
    status: house
lessonId: lesson-l3-02-tc100-gauge
equipmentIds:
  - equipment-rd-tc100
related:
  - fix-42
  - term-micron-mil
  - sop-measure
---
