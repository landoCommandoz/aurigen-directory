---
id: fix-14
type: fixnode
title: Dirt still on the paint after washing
group: wash-dry
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [wash, pre-rinse, pre-soak, bug and tar, clay, tesla]
sayIt:
  - dirt after wash
  - still dirty after washing
  - dirt left on the car
  - caked dirt
  - caked on dirt
  - grime still there
  - film after the wash
  - dirty lower panels
  - mud won't come off
  - wash didn't get it clean
  - neglected car still dirty
sources:
  - label: Knowledge base 5.1 and 5.3
    date: 2026-10-07
    note: Pre-rinse on jet 3 to 4 minutes, top down, extra on bumpers, rockers, and behind the wheels. Bug & Tar one-minute dwell, no scrubbing. Pre-soak method and product are not confirmed.
  - label: Tesla Model Y owner's manual, wheel and pre-wash caution
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
  - Never scrub harder.
checks:
  - How long was the pre-rinse? The plan is 3 to 4 minutes.
  - Where is the dirt? The lower third, the front end, behind the wheels?
  - Is it bugs or tar?
  - Bag test the panel. Still gritty?
causes:
  - Caked buildup.
  - Short pre-rinse.
  - No dwell.
  - Bonded contamination.
steps:
  - Rinse longer on jet, top down.
  - Give the bumpers, rockers, and behind the wheels extra time.
  - Foam Bug & Tar on bugs and rocker tar.
  - Let it dwell one minute.
  - Wash it off. No scrubbing.
  - Bag test the panel.
  - Gritty? Clay what is bonded.
stillHappening:
  - "Clay will not lift the tar: open the clay won't take off the tar fix."
  - "Still rough after clay: open the still rough after clay fix."
notes:
  - text: "A pre-soak with a dwell on caked dirt is a house plan. The method and the product are not confirmed. Chemical Guys gives no pump-sprayer, pre-soak, or dwell direction for Citrus Wash & Gloss."
    status: verify
  - text: On a Tesla, the house plan is a pump-sprayer pre-soak on caked dirt.
    status: house
  - text: "Tesla's manual says: Do not use chemical based wheel cleaners or pre-wash products. These can damage the finish on the wheels."
    status: sourced
  - text: Tesla's manual says damage or discoloration from cleaning products is not covered by the warranty.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
lessonId: lesson-l1-02-pre-rinse
productIds:
  - product-meguiars-bug-tar
equipmentIds:
  - equipment-clay-bar
related:
  - fix-44
  - fix-45
  - fix-16
  - sop-wash
  - sop-wash-tesla
  - sop-clay
  - term-bag-test
  - term-dwell
  - card-tesla-wash-mode-tape
---
