---
id: sop-wheels-tesla
type: sop
title: Wheels and tires, Tesla
stage: wheels
vehicleBranch: tesla
audience: [owner, crew]
visibility: internal
status: house
version: 2
kbRef: "5.1"
plannedMinutes: 25
tags: [wheels, tires, wash, brushes, tesla, model y, warranty, gloves]
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
    note: No chemical-based wheel cleaners or pre-wash products. They can damage the finish on the wheels. Same wording in the Model 3, S, X, and Cybertruck manuals. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y owner's manual, warranty line
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Damage or discoloration from cleaning products is not covered by the warranty. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: The wheel cleaner, pre-wash, and warranty cautions are in the 2020 to 2024 manual too, so they cover a 2022 Model Y. Read directly. Fact-checker FC-38.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Armor All product page, Extreme Wheel & Tire Cleaner
    url: https://armorall.com/product/extreme-wheel-tire-cleaner
    date: 2026-10-11
    note: Eye protection and rubber gloves. Wet and cool the wheel, let the foam work 30 seconds, rinse. Test a hidden spot; stop if it hazes or spots. Not on warm or damaged wheels, damaged clear coat, or brake parts. Fact-checker FC-26 and FC-27. On a Tesla this does not settle the FC-16 question.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla DIY page, removing and installing wheel covers
    url: https://service.tesla.com/docs/Public/diy/modely/en_us/GUID-377C88DB-7FBE-4320-BC1A-0A01AF48005C.html
    date: 2026-10-11
    note: A wheel cover must be fully secured before driving. Leaving the covers on to clean is house. Verification log FC-42.
steps:
  - text: Leave the wheel aero covers on.
    notes:
      - text: If a cover ever comes off, Tesla says it must be fully secured before the car moves.
        status: sourced
  - text: Put on eye protection and rubber gloves.
    status: sourced
  - text: Put your hand on the first wheel. It must be cool.
    stopIf: The wheel is warm to the touch. Wait for it to cool before you spray.
  - text: Look at the wheel for damage and peeling clear coat.
    status: sourced
    stopIf: The wheel or its clear coat is damaged. Do not use the cleaner on that wheel.
  - text: First wheel on this car? Spray a little on a hidden spot and rinse it.
    status: sourced
    stopIf: It hazes or spots. Stop using the cleaner on this car.
  - text: Wet and cool the wheel with the hose.
    status: sourced
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
      - text: Keep it off the brakes. The cleaner label says so.
        status: sourced
  - text: Let it work 30 seconds.
    status: sourced
    timer: { kind: dwell, seconds: 30 }
    stopIf: The cleaner starts to dry. Rinse it now.
  - text: Brush the face with the soft brush.
    notes:
      - Wheel brushes never touch paint.
      - text: The cleaner label says wipe with a soft cloth or sponge. Brushes are a house choice.
        status: sourced
  - text: Brush the barrel with the long brush.
  - text: Brush the tire with the stiff brush.
  - text: Rinse the wheel and tire well before the cleaner dries.
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

The house step uses Armor All Extreme Wheel & Tire on every car, the Tesla included. Tesla's manual says do not use chemical-based wheel cleaners or pre-wash products, because they can damage the finish on the wheels, and it says damage from cleaning products is not covered by Tesla's warranty. Those lines are in the manual for the 2020 to 2024 Model Y too. Lando decides how this applies to Teslas. Until he does, the cleaner step carries the pending row and an unverified badge.

The cleaner's own label still applies whenever it is used: eye protection and rubber gloves, a cool wet wheel, 30 seconds, never on a warm or damaged wheel or the brakes, and a hidden test spot first.

Everything else is the regular wheel stage: aero covers stay on, one wheel at a time, rinse before it dries, and wheel tools stay wheel tools.
