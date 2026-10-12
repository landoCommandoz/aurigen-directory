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
  - how long do I let the wheel cleaner sit
  - wheel cleaner left haze
sources:
  - label: Knowledge base 5.1, step 2
    date: 2026-10-07
    note: Wheels first. Wheel must be cool. Spray face and barrel, wait about a minute, brush (soft on the face, long brush in the barrel, stiff on the tire), rinse before it dries. One wheel at a time. Wheel brushes never touch paint. The wait is corrected to the label's 30 seconds (FC-26).
  - label: Armor All Extreme Wheel & Tire Cleaner, usage directions and cautions
    url: https://armorall.com/product/extreme-wheel-tire-cleaner
    date: 2026-10-11
    note: One wheel at a time. Wear eye protection and rubber gloves. Wet and cool the wheel with a hose. Saturate it from 6 inches. Allow the foam to penetrate for 30 seconds. Wipe with a soft cloth or sponge. Rinse thoroughly. Test on a hidden area first; if hazing or spots appear, stop using it. Not on brake parts or zinc- and cadmium-plated surfaces. Not on wheels with damaged clear coats, or wheels that are warm to the touch or damaged. Motorcycles or uncoated polished aluminum, check with the maker first. Loaded directly. Fact-checker FC-26 and FC-27.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
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
stopIf:
  - text: Wear eye protection and rubber gloves.
    status: sourced
  - text: Wheel warm to the touch, or damaged? Do not spray it.
    status: sourced
  - text: Clear coat on the wheel damaged? Do not use the cleaner on it.
    status: sourced
  - text: Hazing or spots on the wheel? Stop using the cleaner.
    status: sourced
  - text: Keep the cleaner off the brakes.
    status: sourced
  - Cleaner starting to dry? Rinse it now.
checks:
  - Put your hand on the wheel. Is it cool?
  - text: Did you test a hidden spot first?
    status: sourced
  - Did you spray more than one wheel at a time?
  - text: How long did the cleaner sit? The label says 30 seconds.
    status: sourced
causes:
  - The wheel was not cool.
  - More than one wheel was sprayed at a time.
  - The cleaner sat too long before the brush and the rinse.
steps:
  - Rinse the wheel now.
  - text: Wet and cool the wheel with the hose.
    status: sourced
  - Put your hand on it to check.
  - Spray the face and the barrel.
  - text: Let it work 30 seconds.
    status: sourced
  - Brush the face with the soft brush.
  - Brush the barrel with the long brush.
  - Brush the tire with the stiff brush.
  - text: Rinse the wheel well before it dries.
    status: sourced
  - Move to the next wheel.
stillHappening:
  - text: A mark is left where the cleaner dried. The knowledge base has no fix for that yet.
    status: verify
  - "On a Tesla: open the Tesla wheel cleaner or pre-soak fix."
notes:
  - text: One wheel at a time.
    status: sourced
  - Wheel brushes never touch paint.
  - text: The label says to wipe with a soft cloth or sponge.
    status: sourced
  - The brushes are a house choice.
  - text: On a bike, the label says check with the bike maker before you use it on motorcycle wheels or uncoated polished aluminum.
    status: sourced
  - text: "On a bike: what to use on the wheels, Lando decides (pending)."
    status: verify
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
