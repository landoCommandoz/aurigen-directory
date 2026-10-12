---
id: fix-78
type: fixnode
title: "Tesla: can I use wheel cleaner or a pre-soak?"
group: tesla
audience: [owner, crew]
visibility: internal
status: house
kbRef: "11"
tags: [tesla, model y, wheels, wheel cleaner, pre-soak, warranty]
sayIt:
  - tesla wheel cleaner
  - wheel cleaner on a tesla
  - can I use armor all on the tesla wheels
  - tesla pre-soak
  - pre-wash on a tesla
  - tesla wheels
  - model y wheels
  - aero covers
  - is wheel cleaner safe on a tesla
  - tesla warranty wheels
sources:
  - label: Knowledge base 5.1, 5.3, and 11
    date: 2026-10-07
    note: House wheel step is Armor All Extreme Wheel & Tire, a brush, and the hose on every car. The pre-soak method and product are not confirmed. On the Model Y, leave the aero covers on during the wheel clean; Car Wash Mode before any water.
  - label: Tesla Model Y owner's manual, wheel cleaner caution
    url: https://www.tesla.com/ownersmanual/modely/en_ae/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Do not use chemical based wheel cleaners or pre-wash products. These can damage the finish on the wheels. Same wording in the Model 3, S, X, and Cybertruck manuals. Read through the search index. Fact-checker FC-16. FC-38 found the same lines in the 2020 to 2024 Model Y manual.
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
    note: Pages 178 to 181, Cleaning. No chemical based wheel cleaners or pre-wash products. No cutting pastes, color restoration compounds, or polishes containing harsh abrasives. Damage or discoloration from cleaning products is not covered by the warranty. Also says an approved polish with a very mild abrasive may be used occasionally. Loaded directly. Fact-checker FC-38.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla DIY, removing and installing wheel covers, Model Y
    url: https://service.tesla.com/docs/Public/diy/modely/en_us/GUID-377C88DB-7FBE-4320-BC1A-0A01AF48005C.html
    date: 2026-10-11
    note: Covers removal for lug nut access only. To prevent the wheel cover from falling off, make sure it is fully secured before driving. No Tesla source covers cleaning with the covers on or off (FC-42). Loaded directly.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Armor All Extreme Wheel & Tire Cleaner
    url: https://armorall.com/product/extreme-wheel-tire-cleaner
    date: 2026-10-11
    note: Wear eye protection and rubber gloves. Wet and cool the wheel. Let it work 30 seconds. Test a hidden area first. The label settles nothing about Teslas; FC-16 and FC-38 still govern. Loaded directly. Fact-checker FC-26 and FC-27.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - No water on a Tesla until Car Wash Mode is on.
  - Wheel not cool? Do not spray it.
  - text: Wheel cleaner in your hand? Wear eye protection and rubber gloves.
    status: sourced
checks:
  - Is Car Wash Mode on?
  - Are the wheel aero covers on?
  - Put your hand on the wheel. Is it cool?
causes:
  - The house wheel step and Tesla's manual disagree. Lando has not decided yet.
  - text: The pre-soak method and product are not confirmed on any car.
    status: verify
steps:
  - Turn on Car Wash Mode before any water.
  - Leave the wheel aero covers on.
  - Put your hand on the wheel. It must be cool.
  - text: "House step: Armor All Extreme Wheel & Tire, a brush, and the hose, the same as every car."
    status: house
  - text: "Tesla's manual says: Do not use chemical based wheel cleaners or pre-wash products. These can damage the finish on the wheels."
    status: sourced
  - text: Tesla's manual says damage or discoloration from cleaning products is not covered by the warranty.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
stillHappening:
  - "Windows dropped or wipers ran: open the Tesla Car Wash Mode fix."
  - "Caked dirt still on after the wash: open the dirt still on the paint fix."
notes:
  - text: If a wheel cover ever comes off, Tesla says it must be fully secured before the car moves.
    status: sourced
  - text: "The pre-soak is a house plan for caked dirt on any car. It is not a step yet: Chemical Guys gives no pump-sprayer, pre-soak, or dwell direction."
    status: verify
  - One wheel at a time. Rinse before it dries.
  - Wheel brushes never touch paint.
lessonId: lesson-l1-01-wheels-first
productIds:
  - product-armor-all-extreme-wheel-tire
equipmentIds:
  - equipment-wheel-brushes
related:
  - fix-60
  - fix-26
  - fix-14
  - sop-wheels-tesla
  - sop-wash-tesla
  - card-tesla-wash-mode-tape
  - lesson-l1-02-pre-rinse
---
