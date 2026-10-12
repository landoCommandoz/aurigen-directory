---
id: sop-measure-tesla
type: sop
title: Inspect with the light and measure with the gauge, Tesla
stage: measure
vehicleBranch: tesla
audience: [owner, crew]
visibility: internal
status: house
kbRef: "7.2"
tags: [measure, inspect, gauge, light, thickness, tc100, tesla, model y, glass roof]
synonyms:
  - tesla readings
  - measure the tesla
  - model y readings
  - tesla gauge
  - skip the glass roof
  - tesla paint thickness
sources:
  - label: Knowledge base 7.2, TC100 research
    date: 2026-10-06
    note: Screen codes, zero on the plate only, hold flat, door jamb baseline, 3 to 5 readings per panel, 20 µm swings within a foot are normal, Model Y owners commonly read about 4 to 6 mils.
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
  - text: Skip the roof. It is glass.
  - text: Hold the gauge flat on the panel.
    status: sourced
    panelRoute: measure
  - text: Take 3 to 5 readings per panel, the middle first, then toward each corner.
    status: sourced
    notes:
      - Stay an inch off edges and body lines. They always read low.
      - text: 20 µm swings within a foot are normal.
        status: sourced
      - text: Model Y owners commonly measure about 4 to 6 mils (100 to 150 µm), highest on the hood. Lando's hood read above 100 everywhere.
        status: sourced
  - text: Write every reading down.
    notes:
      - "The job sheet panels: hood, trunk, LF fender, LF door, LR door, LR quarter, RF fender, RF door, RR door, RR quarter. The roof is glass, so it gets no reading."
  - text: Look up each panel's band on the thickness card.
    quickCardId: card-thickness-bands
    notes:
      - Way above the rest of the car, about 220 µm or more, is a repaint. Go gentle or skip, log it, and tell the customer.
      - More than 40 µm below the median of the other panels is a thin panel. Go light or skip.
  - text: Tell the customer about any panel the band says to, before the pad touches paint.
related:
  - card-tesla-wash-mode-tape
  - card-thickness-bands
  - equipment-rd-tc100
  - equipment-inspection-light
  - term-micron-mil
  - lesson-l3-02-tc100-gauge
  - lesson-l3-03-thickness-bands
  - sop-measure
  - sop-test-spot-tesla
---
The Tesla measure is the regular measure with one change: the roof is glass, so it gets no reading and never goes on the polish route.

Model Y owners commonly read about 4 to 6 mils (100 to 150 µm), highest on the hood. That is background, not a band. The bands card decides what each panel is allowed to take.
