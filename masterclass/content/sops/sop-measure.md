---
id: sop-measure
type: sop
title: Inspect with the light and measure with the gauge
stage: measure
vehicleBranch: any
audience: [owner, crew]
visibility: internal
status: house
kbRef: "7.2"
tags: [measure, inspect, gauge, light, thickness, tc100]
synonyms:
  - measure steps
  - take readings
  - gauge the car
  - paint readings
  - inspect the paint
  - light check
  - read the panels
  - thickness readings
  - job sheet readings
sources:
  - label: Knowledge base 7.2, TC100 research
    date: 2026-10-06
    note: Screen codes, zero on the plate only, hold flat, door jamb baseline, 3 to 5 readings per panel, 20 µm swings within a foot are normal.
steps:
  - text: Hold the light low across the paint.
  - text: Look for swirls. They look like a spiderweb.
  - text: Fingernail-test each scratch you find.
    notes:
      - If a nail catches, polish will not remove it. It stays.
  - text: Photograph every flaw before you start.
  - text: Zero the TC100 on its bare plate. Only there.
    status: sourced
    stopIf: Never press ZERO on the car. It offsets every later reading.
  - text: Read the door jamb first and write it down. That is your baseline.
    status: sourced
  - text: Hold the gauge flat on the panel.
    status: sourced
    panelRoute: measure
  - text: Take 3 to 5 readings per panel, the middle first, then toward each corner.
    status: sourced
    notes:
      - Stay an inch off edges and body lines. They always read low.
      - text: 20 µm swings within a foot are normal.
        status: sourced
  - text: Write every reading down.
    notes:
      - "The job sheet takes the door jamb plus 11 panels x 3 readings: hood, roof, trunk, LF fender, LF door, LR door, LR quarter, RF fender, RF door, RR door, RR quarter."
  - text: Look up each panel's band on the thickness card.
    quickCardId: card-thickness-bands
    notes:
      - Way above the rest of the car, about 220 µm or more, is a repaint. Go gentle or skip, log it, and tell the customer.
      - More than 40 µm below the median of the other panels is a thin panel. Go light or skip.
  - text: Tell the customer about any panel the band says to, before the pad touches paint.
related:
  - card-thickness-bands
  - card-kills-the-buff
  - equipment-rd-tc100
  - equipment-inspection-light
  - term-micron-mil
  - lesson-l3-01-light-and-eyes
  - lesson-l3-02-tc100-gauge
  - lesson-l3-03-thickness-bands
  - sop-measure-tesla
  - sop-test-spot
---
You measure before you cut. The gauge tells you how much paint is there, and the bands tell you what that panel is allowed to take.

Zero the TC100 only on its own bare plate. Press ZERO on the car and every reading after it is off. The door jamb is your baseline. Then 3 to 5 flat readings per panel, an inch off the edges, because edges and body lines always read low. A 20 µm swing within a foot is normal.

The light comes first. Hold it low and swirls show up like a spiderweb. Fingernail-test every scratch: if a nail catches, polish will not remove it, and you never promise it comes out. Photograph every flaw before you start.

The bands are a conservative house standard, not a manufacturer spec.
