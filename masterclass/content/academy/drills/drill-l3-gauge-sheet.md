---
id: drill-l3-gauge-sheet
type: drill
title: "Gauge sheet: jamb plus 11 panels"
audience:
  - owner
  - crew
visibility: internal
status: sourced
kbRef: "7.2"
tags:
  - gauge
  - measure
  - drill
  - level 3
synonyms:
  - gauge drill
  - paint gauge practice
  - fill the job sheet readings
  - tc100 drill
  - measure the car drill
sources:
  - label: R&D TC100 gauge notes (knowledge base 7.2)
    date: 2026-10-06
    note: Zero only on the bare plate; door jamb baseline; 3 to 5 readings per panel; 20 µm swings within a foot are normal; Tesla Model Y owners commonly measure 100 to 150 µm.
needs:
  - The R&D TC100 and its bare zero plate
  - A job sheet or the app's gauge entry
  - A washed car
instructions:
  - Zero the gauge only on its bare plate.
  - Check the screen says SNG and the units read µm.
  - Hold the gauge flat on the paint.
  - Take the door jamb reading first. Write it down as the baseline.
  - "Take 3 readings on each of the 11 panels: hood, roof, trunk, LF fender, LF door, LR door, LR quarter, RF fender, RF door, RR door, RR quarter."
  - Middle first, then toward each corner.
  - text: Stay an inch off edges and body lines.
    status: house
  - Write every reading down.
  - text: On a Tesla, skip the roof. It is glass.
    status: house
  - Lando watches for procedure errors.
logField:
  label: Procedure errors
  unit: errors
repsPerSession: 1
passMark:
  - "Zero procedure errors: never zeroed on the car, never tilted, never on an edge or a body line."
  - text: Jamb baseline plus 3 readings on each of the 11 panels, written down.
    status: house
related:
  - lesson-l3-02-tc100-gauge
  - equipment-rd-tc100
  - card-thickness-bands
  - sop-measure
---
