---
id: fix-60
type: fixnode
title: Wheel cleaner drying on the wheel, or the wheel is hot
group: wash-dry
audience: [owner, crew]
visibility: internal
status: house
kbRef: "5.1"
tags: [wheels, tires, wheel cleaner, dwell, tesla]
sayIt:
  - wheel cleaner drying
  - wheel cleaner dried on
  - cleaner drying on the rim
  - wheel is hot
  - hot wheels
  - rims are hot
  - wheel cleaner spotting
  - cleaner baked on the wheel
  - sprayed all four wheels at once
  - wheels drying before I brush
sources:
  - label: Knowledge base 5.1, step 2
    date: 2026-10-07
    note: Wheels first. Wheel must be cool. Spray face and barrel, wait about a minute, brush (soft on the face, long brush in the barrel, stiff on the tire), rinse before it dries. One wheel at a time. Wheel brushes never touch paint.
  - label: Tesla Model Y owner's manual, wheel cleaner caution
    url: https://www.tesla.com/ownersmanual/modely/en_ae/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Do not use chemical based wheel cleaners or pre-wash products. These can damage the finish on the wheels. Same wording in the Model 3, S, X, and Cybertruck manuals; the 2020 to 2024 Model Y page could not be checked line by line. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y owner's manual, warranty line
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Damage or discoloration from cleaning products is not covered by the warranty. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
stopIf:
  - Wheel not cool? Do not spray it. Let it cool first.
  - Cleaner starting to dry? Rinse it now.
checks:
  - Put your hand on the wheel. Is it cool?
  - Did you spray more than one wheel at a time?
  - How long did the cleaner sit? The plan is about a minute.
causes:
  - The wheel was not cool.
  - More than one wheel was sprayed at a time.
  - The cleaner sat too long before the brush and the rinse.
steps:
  - Rinse the wheel now.
  - Let the wheel cool.
  - Put your hand on it to check.
  - Spray the face and the barrel.
  - Wait about a minute.
  - Brush the face with the soft brush.
  - Brush the barrel with the long brush.
  - Brush the tire with the stiff brush.
  - Rinse before it dries.
  - Move to the next wheel.
stillHappening:
  - text: A mark is left where the cleaner dried. The knowledge base has no fix for that yet.
    status: verify
  - "On a Tesla: open the Tesla wheel cleaner or pre-soak fix."
notes:
  - One wheel at a time.
  - Wheel brushes never touch paint.
  - The label on the bottle beats this app. If they disagree, open the label says something different fix.
  - text: On a Tesla, the house step is Armor All Extreme Wheel & Tire, a brush, and the hose, the same as every car.
    status: house
  - text: "Tesla's manual says: Do not use chemical based wheel cleaners or pre-wash products. These can damage the finish on the wheels."
    status: sourced
  - text: Tesla's manual says damage or discoloration from cleaning products is not covered by the warranty.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
lessonId: lesson-l1-01-wheels-first
productIds:
  - product-armor-all-extreme-wheel-tire
equipmentIds:
  - equipment-wheel-brushes
related:
  - fix-61
  - fix-78
  - sop-wheels
  - sop-wheels-tesla
  - card-tesla-wash-mode-tape
  - fix-80
---
