---
id: fix-22
type: fixnode
title: Reading under 90, under 75, or way above the rest
group: gauge
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [gauge, bands, thin panel, repaint, compound, tesla]
sayIt:
  - gauge 85
  - low reading
  - reading under 90
  - reading under 75
  - reading in the 80s
  - thin paint
  - thin panel
  - reads way high
  - reading over 220
  - repaint
  - gauge says 70
  - can I compound this panel
  - how low is too low
  - paint too thin to polish
sources:
  - label: Knowledge base 7.3, thickness bands
    date: 2026-10-07
    note: A conservative house standard, not a manufacturer spec. Tell the customer before the pad touches paint (21).
  - label: Blueprint 12, item 16
    date: 2026-10-10
    note: Thin panel means more than 40 µm below the median of the other measured panels. Lando accepted the default on 2026-10-10.
  - label: Knowledge base 7.3, background film numbers
    date: 2026-09-22
    note: Factory total film about 100 to 180 µm, clear coat about 38 to 50 µm of that. The fact-checker corrected the clear coat to 35 to 50 µm (FC-71) and confirmed the total film (FC-72).
  - label: DeFelsko, how to use paint thickness gauges for automotive detailing
    url: https://www.defelsko.com/resources/how-to-use-paint-thickness-gauges-for-better-automotive-detailing
    date: 2026-10-11
    note: Clear coat thickness usually ranges from 1.5 to 2.0 mils (35 to 50 microns). Most auto manufacturers recommend removing no more than 0.3 mils (8 microns) of clear coat. Loaded directly. Fact-checker FC-71.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: DeFelsko, automotive paint detailing
    url: https://www.defelsko.com/resources/automotive-paint-detailing
    date: 2026-10-11
    note: Most factory paint jobs range from 4 to 7 mils (100 to 180 microns). DeFelsko makes gauges, not paint. Loaded directly. Fact-checker FC-72.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y owner's manual, cleaning cautions
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: No cutting pastes, color restoration compounds, or harsh-abrasive polishes. Cleaning-product damage is not covered by the warranty. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Pages 178 to 181, Cleaning. No chemical based wheel cleaners or pre-wash products. No cutting pastes, color restoration compounds, or polishes containing harsh abrasives. Damage or discoloration from cleaning products is not covered by the warranty. Also says an approved polish with a very mild abrasive may be used occasionally. Loaded directly. Fact-checker FC-38.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - "Under 75: no machine. Hand protection only."
  - "Under 100: no compound."
checks:
  - Was the gauge zeroed on the plate and held flat?
  - What is the door jamb baseline?
  - What do the other panels read?
  - Are you an inch off edges and body lines?
causes:
  - The panel is thin.
  - The panel was repainted. It reads way above the rest, about 220 or more.
  - The reading was too close to an edge or body line.
  - A gauge error, like ZERO pressed on the car.
steps:
  - Measure the panel again, flat, an inch off edges, 3 to 5 readings.
  - Look up the reading in the bands below.
  - Do only what that band allows.
  - Tell the customer before the pad touches paint.
  - Write the readings on the job sheet.
  - Log any repaint or thin panel.
stillHappening:
  - "The readings look wrong: open the gauge reading looks wrong fix."
  - "Peeling, flaking, or cloudy clear coat: open the clear coat failure fix."
notes:
  - "100 µm or more: full ladder permitted. Compound is allowed, not required."
  - "90 to 99: polish only, yellow or maroon + M210. No compound."
  - "85 to 89: tell the customer. Yellow + M210, light pressure, fewest passes."
  - "75 to 84: tell the customer. Finishing polish only, minimal passes, or hand work."
  - "Under 75: no machine. Hand protection only."
  - "Way above the rest, about 220 or more: repaint. Go gentle or skip. Log it and tell the customer."
  - "Way below the rest: thin panel. Go light or skip."
  - Thin means more than 40 µm below the median of the other measured panels.
  - Edges and body lines always read low. Stay an inch off.
  - These bands are a conservative house standard, not a manufacturer spec.
  - text: Factory total film is usually about 100 to 180 µm. The clear coat is about 35 to 50 µm (1.5 to 2 mils) of that.
    status: sourced
  - text: DeFelsko says most carmakers recommend removing no more than about 8 µm (0.3 mil) of clear coat.
    status: sourced
  - text: "On a Tesla, the house ladder allows compound at 100 µm or more when the test spot proves it."
    status: house
  - text: "Tesla's manual says: Do not use cutting pastes, color restoration compounds, or polishes containing harsh abrasives. These can scour the surface and permanently damage the paint."
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
lessonId: lesson-l3-03-thickness-bands
equipmentIds:
  - equipment-rd-tc100
related:
  - card-thickness-bands
  - card-pad-ladder
  - card-kills-the-buff
  - fix-21
  - fix-40
  - fix-79
  - sop-measure
  - term-repaint
  - term-micron-mil
---
