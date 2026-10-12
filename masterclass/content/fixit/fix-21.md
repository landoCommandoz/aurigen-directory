---
id: fix-21
type: fixnode
title: Gauge reading looks wrong
group: gauge
audience: [owner, crew]
visibility: internal
status: sourced
kbRef: "21"
tags: [gauge, tc100, readings, microns, measure]
sayIt:
  - gauge reading wrong
  - gauge is off
  - weird readings
  - readings all over the place
  - gauge says something crazy
  - reading too high
  - reading too low
  - numbers jumping around
  - gauge won't read
  - tc100 acting up
  - paint gauge is wrong
  - readings don't make sense
sources:
  - label: Knowledge base 7.2, R&D TC100 paint gauge
    date: 2026-10-06
    note: Screen codes, zero only on the bare plate, hold it flat, door jamb baseline, 3 to 5 readings per panel, 20 µm swings within a foot are normal, Tesla Model Y readings.
  - label: Knowledge base 7.3 and 11
    date: 2026-10-07
    note: Edges and body lines always read low, so stay an inch off. On the Model Y the roof is glass and is skipped in the measure route.
  - label: Tesla Motors Club forum, Tesla paint depth thread
    url: https://teslamotorsclub.com/tmc/threads/tesla-paint-depth-vs-other-cars.221821/
    date: 2026-10-11
    note: One owner's Model Y read about 4.03 to 5.92 mils, hood highest, rear quarters lowest. Forum, supporting only. Tesla publishes no paint thickness. Fact-checker FC-73.
  - label: Fact-checker FC-74, TC100 zero and screen codes
    date: 2026-10-11
    note: No R&D TC100 manual or maker page was found to recheck the zero and screen-code steps. Another maker's gauge manual (Sauter) says a zero is not valid unless the probe sits directly on the calibration plate or other uncoated metal. Lando's check is the printed TC100 manual.
stopIf:
  - Never press ZERO on the car. It offsets every later reading.
checks:
  - Did you zero it on the bare plate, not the car?
  - Are you holding it flat?
  - Does the screen show SNG?
  - "Fe or NFe on the screen? Both read fine."
  - Are you an inch off edges and body lines?
  - Moving dots? It is still waiting.
causes:
  - ZERO was pressed on the car, not the plate.
  - The gauge was not held flat.
  - text: Too close to an edge or body line. They always read low.
    status: house
  - "On a Tesla: a reading taken on the glass roof."
  - A normal swing. 20 µm within a foot is normal.
  - The reading is real. The panel is thin or repainted.
steps:
  - Hold the gauge flat.
  - text: Move an inch off edges and body lines.
    status: house
  - Check the screen shows SNG.
  - Wait for the moving dots to stop and a number to show.
  - "Pressed ZERO on the car? Zero it on the bare plate. Only there."
  - Take the door jamb reading again as your baseline.
  - Take 3 to 5 readings on the panel, the middle first, then toward each corner.
  - Write them down.
  - Compare them with the door jamb baseline.
stillHappening:
  - "Pressed ZERO on the car: open the pressed ZERO on the car fix."
  - "Screen shows codes you don't know: open the gauge screen fix."
  - "The readings are real and low or way high: open the reading under 90 fix."
notes:
  - 20 µm swings within a foot are normal.
  - Leave the units alone. µm is microns.
  - text: On a Tesla Model Y, owners report about 4 to 6 mils (100 to 150 µm), highest on the hood. Tesla publishes no paint thickness.
    status: verify
  - text: The zero and screen-code steps come from the 2026-10-06 research. No TC100 manual was found online to recheck them. Read the printed TC100 manual.
    status: verify
  - text: "On a Tesla, the roof is glass. Skip it in the measure route."
    status: house
lessonId: lesson-l3-02-tc100-gauge
equipmentIds:
  - equipment-rd-tc100
related:
  - fix-42
  - fix-43
  - fix-22
  - card-thickness-bands
  - sop-measure
  - sop-measure-tesla
  - term-micron-mil
---
