---
id: lesson-l3-03-thickness-bands
type: lesson
title: The thickness bands
level: 3
order: 3
audience: [owner, crew]
visibility: internal
status: house
version: 2
kbRef: "7.3"
tags: [gauge, thickness, bands, microns, thin panel, repaint]
synonyms:
  - thickness bands
  - gauge says 85
  - gauge 85
  - reading under 90
  - reading under 75
  - how thin is too thin
  - can I compound this panel
  - can I polish this panel
  - thin panel
  - repaint reading
  - way above the rest
  - what is allowed on this panel
sources:
  - label: Lando
    date: 2026-10-10
    note: Thin panel means more than 40 µm below the median of the other measured panels (BLUEPRINT section 12 item 16)
  - label: BLUEPRINT section 2.3, gauge entry rules
    date: 2026-10-10
    note: The band comes from the lowest reading on the panel. The rest of the car is the median of the lowest readings of the other measured panels.
  - label: Knowledge base 7.3, background film numbers
    date: 2026-09-22
    note: The background figures now follow DeFelsko, rechecked by the fact-checker (FC-71 and FC-72).
  - label: DeFelsko, automotive paint detailing
    url: https://www.defelsko.com/resources/automotive-paint-detailing
    date: 2026-10-11
    note: Most factory paint jobs run 4 to 7 mils (100 to 180 microns). Some roofs run only 3 mils (75 microns). DeFelsko makes gauges, not paint. Fact-checker FC-72.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: DeFelsko, how to use paint thickness gauges for better automotive detailing
    url: https://www.defelsko.com/resources/how-to-use-paint-thickness-gauges-for-better-automotive-detailing
    date: 2026-10-11
    note: Clear coat usually runs 1.5 to 2.0 mils (35 to 50 microns). Most carmakers recommend removing no more than 0.3 mils (8 microns) of clear coat. Fact-checker FC-71.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y owner's manual, cleaning cautions, current model
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: No cutting pastes, color restoration compounds, or polishes containing harsh abrasives. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
steps:
  - Take the lowest reading you wrote down for the panel.
  - Find that reading's band.
  - Do only what the band allows.
  - Compare the panel with the rest of the car.
  - About 220 µm or more? Call it a repaint. Go gentle or skip. Log it and tell the customer.
  - More than 40 µm below the rest? Call it thin. Go light or skip.
  - Under 90, under 75, or way above the rest? Tell the customer before the pad touches paint.
  - Stay an inch off edges and body lines. They always read low.
numbers:
  - label: 100 µm or more
    value: Full ladder permitted. Over 100 means compound is allowed, not required.
    status: house
    kbRef: "7.3"
  - label: Compound on a Tesla, Tesla's manual
    value: Tesla's manual says do not use cutting pastes, color restoration compounds, or polishes containing harsh abrasives. They can scour the surface and permanently damage the paint.
    status: sourced
  - label: Lando decides how this applies to Teslas (pending)
    value: On a Tesla at 100 µm or more, whether the compound rung is allowed
    status: verify
  - label: 90 to 99 µm
    value: Polish only, yellow or maroon + M210. No compound.
    kbRef: "7.3"
  - label: 85 to 89 µm
    value: Tell the customer. Yellow + M210, light pressure, fewest passes.
    kbRef: "7.3"
  - label: 75 to 84 µm
    value: Tell the customer. Finishing polish only, minimal passes, or hand work.
    kbRef: "7.3"
  - label: Under 75 µm
    value: No machine. Hand protection only.
    kbRef: "7.3"
  - label: Way above the rest of the car, about 220+ µm
    value: Repaint. Go gentle or skip. Log it and tell the customer.
    kbRef: "7.3"
  - label: Way below the rest
    value: Thin panel. Go light or skip.
    kbRef: "7.3"
  - label: Thin, in numbers
    value: More than 40 µm below the median of the other measured panels
    kbRef: "7.3"
  - label: Which reading sets the band
    value: The lowest reading on the panel
    kbRef: "7.3"
  - label: Edges and body lines
    value: They always read low. Stay an inch off.
    kbRef: "7.3"
  - label: What this table is
    value: A conservative house standard, not a manufacturer spec
    kbRef: "7.3"
  - label: Background, total film
    value: Factory total film is usually about 100 to 180 µm.
    status: sourced
    kbRef: "7.3"
  - label: Background, clear coat
    value: The clear coat is about 35 to 50 µm (1.5 to 2 mils) of that.
    status: sourced
    kbRef: "7.3"
  - label: How little to take
    value: DeFelsko says most carmakers recommend removing no more than about 8 µm (0.3 mil) of clear coat.
    status: sourced
    kbRef: "7.3"
mistakes:
  - Using the average, or the highest reading, instead of the lowest.
  - Reading 100+ as "compound required." It means compound is allowed, not required.
  - Compound on a panel at 90 to 99.
  - Any machine on a panel under 75.
  - Telling the customer after the pad touched paint instead of before.
  - Trusting a reading taken on an edge. Edges always read low.
  - text: Treating compound on a Tesla as settled. Lando has not decided (pending).
    status: verify
drillIds: [drill-l3-band-calls]
quizId: quiz-l3-03-bands
related:
  - lesson-l3-02-tc100-gauge
  - lesson-l3-04-kills-the-buff
  - lesson-l3-05-walkaround-script
  - card-thickness-bands
  - card-pad-ladder
  - equipment-rd-tc100
  - term-micron-mil
  - term-clear-coat
  - card-tesla-wash-mode-tape
  - product-meguiars-ultimate-compound
  - lesson-l0-04-how-paint-works
  - lesson-l0-05-what-can-be-fixed
---
**Goal:** Turn any gauge reading into what is allowed on that panel, from the full ladder down to no machine at all.

## Why the bands exist

Every polish removes a thin layer of clear coat. The bands turn a number on the gauge into a rule you can follow without guessing. They are a conservative house standard, not a manufacturer spec. Conservative is the point. A panel you skip can be done another day. Clear coat you remove cannot be put back.

## Which number you use

Use the lowest reading on the panel. That is the rule the gauge screen in this app uses too, so your call and the app's call always match. The lowest reading is where the paint has the least to give.

## The table, top to bottom

- 100 µm or more: the full ladder is permitted. Over 100 means compound is allowed, not required. The test spot still picks the combo.
- 90 to 99: polish only, yellow or maroon + M210. No compound.
- 85 to 89: tell the customer. Yellow + M210, light pressure, fewest passes.
- 75 to 84: tell the customer. Finishing polish only, minimal passes, or hand work.
- Under 75: no machine. Hand protection only.

Anything under 90 is a "tell the customer" panel, and you tell them before the pad touches paint, not after.

## Off the rest of the car

Two flags compare a panel with the rest of the car. The rest of the car means the median of the lowest readings on the other panels you measured.

- About 220 µm or more: repaint. Go gentle or skip, log it, and tell the customer.
- More than 40 µm below the rest: thin. Go light or skip.

Edges and body lines always read low. Stay an inch off them when you measure and when you polish.

## Teslas

On most cars, 100 µm or more opens the full ladder, compound included when the test spot proves it. Tesla's own manual says not to use cutting pastes, color restoration compounds, or polishes containing harsh abrasives. Lando has not decided how that applies to Teslas yet. Until he does, never treat compound on a Tesla as settled. That row carries an unverified badge.

## The background numbers

The background: factory total film is usually about 100 to 180 µm, and the clear coat is about 35 to 50 µm (1.5 to 2 mils) of that. Both figures come from DeFelsko, a paint gauge maker. DeFelsko also says most carmakers recommend removing no more than about 8 µm of clear coat. That is why the bands are careful. The background does not change the bands.
