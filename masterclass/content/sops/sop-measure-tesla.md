---
id: sop-measure-tesla
type: sop
title: Inspect with the light and measure with the gauge, Tesla
stage: measure
vehicleBranch: tesla
audience: [owner, crew]
visibility: internal
status: house
version: 2
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
    note: Screen codes, zero on the plate only, hold flat, door jamb baseline, 3 to 5 readings per panel, 20 µm swings within a foot are normal.
  - label: Verification log FC-74
    date: 2026-10-11
    note: Not reconfirmed. No R&D TC100 manual or maker page was found. Another maker's gauge manual says a zero is only valid on the calibration plate or other bare metal. Read the TC100's printed manual for the zero and SNG steps.
  - label: Tesla Motors Club forum, Tesla paint depth
    url: https://teslamotorsclub.com/tmc/threads/tesla-paint-depth-vs-other-cars.221821/
    date: 2026-10-11
    note: One owner's Model Y read about 4.03 to 5.92 mils, hood highest, rear quarters lowest. An owner report, not a Tesla spec. Tesla publishes no paint thickness. Verification log FC-73.
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
    notes:
      - text: The TC100's own manual has not been read for the zero steps. Read it once and check it matches.
        status: verify
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
      - text: Owners report about 4 to 6 mils (100 to 150 µm) on a Model Y, highest on the hood. That is from an owner forum, not from Tesla.
        status: verify
      - text: Lando's hood read above 100 everywhere.
        status: house
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

Owners report about 4 to 6 mils (100 to 150 µm) on a Model Y, highest on the hood. That comes from an owner forum, not from Tesla, and it is background, not a band. The bands card decides what each panel is allowed to take.
