---
id: fix-17
type: fixnode
title: Dropped clay or mitt
group: clay
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [clay, mitt, dropped, rules]
sayIt:
  - dropped clay
  - dropped the clay bar
  - clay fell on the ground
  - clay hit the floor
  - clay on the ground
  - dropped the clay mitt
  - dropped mitt
  - mitt fell on the ground
  - dropped the wash mitt
  - can I still use the clay
sources:
  - label: Knowledge base 2, rule 8, and 6
    date: 2026-10-07
    note: A dropped clay bar goes in the trash. Tear the bar in half and keep one piece in the case, so a drop costs one piece. Clay mitt, rinse it thoroughly.
  - label: Ragnify clay mitt product page
    url: https://www.ragnify.com/products/ragnify-pack-of-2-clay-mitt-auto-detailing-medium-grade-clay-bar-alternative-mitt-for-flawless-removal-of-surface-bonded-micro-contaminant-red
    date: 2026-10-11
    note: If you accidentally drop it, just rinse it with water and all the dust will fall off. Rinse the clay mitt with soap and air dry after use. Use only after washing the vehicle. Lando's mitt is a Ragnify medium 2-pack. Loaded directly. Fact-checker FC-52.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, exterior cleaning cautions
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Avoid using tight-napped or rough cloths, such as washing mitts. A high-quality microfiber cleaning cloth is recommended. Same text in the 2025 and newer manual. Loaded directly. Fact-checker FC-34.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - A dropped clay bar goes in the trash. No exceptions.
  - Never put a dropped bar or mitt back on paint unchecked.
checks:
  - Was it the bar, the clay mitt, or the wash mitt?
  - Is the other half of the bar still in the case?
causes:
  - text: A drop picks up grit from the ground that scratches paint.
    status: verify
  - Working with the whole bar, so one drop costs all of it.
steps:
  - "Dropped clay bar: throw it in the trash."
  - Take the other half out of the case.
  - text: "Dropped clay mitt: rinse it with water until the grit is gone."
    status: sourced
  - Check the mitt before it goes back on paint.
  - "Dropped wash mitt: it is done for the day."
  - Never put either back on paint unchecked.
stillHappening:
  - Tear the next bar in half and keep one piece in the case, so a drop costs one piece.
notes:
  - text: After every job, rinse the clay mitt with soap and water and let it air dry.
    status: sourced
  - text: On a Tesla, the house method uses the clay mitt, and the booklet's wash alternative uses a wash mitt.
    status: house
  - text: Tesla's manual says avoid tight-napped or rough cloths, such as washing mitts, and recommends a high-quality microfiber cloth.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
lessonId: lesson-l1-05-clay
equipmentIds:
  - equipment-clay-bar
  - equipment-clay-mitt
related:
  - card-stop-rules
  - sop-clay
  - fix-16
  - term-clay
---
