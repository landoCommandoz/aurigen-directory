---
id: sop-wheels-tesla
type: sop
title: Wheels and tires, Tesla
stage: wheels
vehicleBranch: tesla
audience: [owner, crew]
visibility: internal
status: house
kbRef: "5.1"
plannedMinutes: 25
tags: [wheels, tires, wash, brushes, tesla, model y, warranty]
synonyms:
  - tesla wheels
  - tesla wheel cleaner
  - model y wheels
  - aero covers
  - clean tesla rims
  - wheel cleaner on a tesla
sources:
  - label: Tesla Model Y owner's manual, wheel cleaner caution
    url: https://www.tesla.com/ownersmanual/modely/en_ae/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: No chemical-based wheel cleaners or pre-wash products. They can damage the finish on the wheels. Same wording in the Model 3, S, X, and Cybertruck manuals; the 2020 to 2024 Model Y page could not be checked line by line. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y owner's manual, warranty line
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Damage or discoloration from cleaning products is not covered by the warranty. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
steps:
  - text: Leave the wheel aero covers on.
  - text: Put your hand on the first wheel. It must be cool.
    stopIf: The wheel is hot. Wait for it to cool before you spray.
  - text: "House step: spray Armor All Extreme Wheel & Tire on the face and the barrel."
    status: house
    quickCardId: card-tesla-wash-mode-tape
    notes:
      - text: Tesla's manual says do not use chemical-based wheel cleaners or pre-wash products. They can damage the finish on the wheels.
        status: sourced
      - text: Tesla's manual says damage or discoloration from cleaning products is not covered by the warranty.
        status: sourced
      - text: Lando decides how this applies to Teslas (pending).
        status: verify
  - text: Wait about a minute.
    timer: { kind: dwell, seconds: 60 }
    stopIf: The cleaner starts to dry. Rinse it now.
  - text: Brush the face with the soft brush.
    notes:
      - Wheel brushes never touch paint.
  - text: Brush the barrel with the long brush.
  - text: Brush the tire with the stiff brush.
  - text: Rinse the wheel and tire before the cleaner dries.
  - text: Move to the next wheel and repeat, one wheel at a time, until all four are done.
    notes:
      - Wheel brushes never go in the wash bucket.
      - Any towel that touches a wheel goes in the wheel pile for good.
      - "Full detail: the floor mats soak while you do the wheels."
related:
  - card-tesla-wash-mode-tape
  - product-armor-all-extreme-wheel-tire
  - equipment-wheel-brushes
  - equipment-microfiber-towels
  - lesson-l1-01-wheels-first
  - sop-wheels
  - sop-setup-tesla
  - sop-wash-tesla
---
On a Tesla, the wheel step is not settled.

The house step uses Armor All Extreme Wheel & Tire on every car, the Tesla included. Tesla's manual says do not use chemical-based wheel cleaners or pre-wash products, because they can damage the finish on the wheels, and it says damage from cleaning products is not covered by Tesla's warranty. Lando decides how this applies to Teslas. Until he does, the cleaner step carries the pending row and an unverified badge.

Everything else is the regular wheel stage: aero covers stay on, a cool wheel, one wheel at a time, rinse before it dries, and wheel tools stay wheel tools.
