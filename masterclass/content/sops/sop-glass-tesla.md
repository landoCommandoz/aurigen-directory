---
id: sop-glass-tesla
type: sop
title: Exterior glass, last thing outside, Tesla
stage: glass
vehicleBranch: tesla
audience: [owner, crew]
visibility: internal
status: house
version: 2
kbRef: "9.3"
tags: [glass, windows, windshield, streaks, tesla, model y, cameras]
synonyms:
  - tesla glass
  - tesla camera lenses
  - clean the tesla cameras
  - model y windows
  - tesla windshield
  - camera lens cleaner
sources:
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Page 178, Cleaning a Camera. On older builds, spray water on the lens and do not wipe it with a hand or a cloth; on later builds, spray water and dry with a microfiber. No chemical-based or abrasive cleaners on a lens. Five body cameras on this model. Read directly. Fact-checker FC-33 and FC-40.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, US edition, cleaning
    url: https://www.tesla.com/ownersmanual/2020_2024_modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-11
    note: The no-wipe group is cars built in Fremont and Gigafactory Austin before about late May 2023. Read through the search index. Fact-checker FC-33.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2025 and newer owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Page 200. Spray water on the lens and dry with a microfiber cloth. Six body cameras; the front bumper camera above the grille has its own sprayer. Read directly. Fact-checker FC-33 and FC-40.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
steps:
  - text: Grab two clean glass towels, one wet and one dry.
    notes:
      - Never a towel that touched wax or polish.
      - text: What wets the towel, water or a glass cleaner, is not set in the knowledge base yet.
        status: verify
  - text: Wipe the outside glass up and down with the wet towel.
    panelRoute: glass
  - text: Follow with the dry towel, up and down.
  - text: Drop each window 1 to 2 inches and clean the top edge.
  - text: "House step: clean the camera lenses with glass cleaner only."
    status: house
    quickCardId: card-tesla-wash-mode-tape
    notes:
      - text: "2020 to 2024 Model Y, five cameras: two B-pillar, two fender repeaters, and one above the rear plate."
        status: sourced
      - text: 2025 and newer Model Y, six cameras. The sixth is on the front bumper above the grille.
        status: sourced
      - text: Tesla's manual says spray water on the lens. On a 2020 to 2024 Model Y built before about late May 2023 in Fremont or Austin, do not wipe the lens with a hand or a cloth. On later cars, dry it with a microfiber cloth. Never use chemical-based or abrasive cleaners on a lens.
        status: sourced
      - text: Lando decides how this applies to Teslas (pending). A 2022 Model Y built in Fremont or Austin is in the no-wipe group unless its build date says otherwise. Read the build month on the driver door jamb label.
        status: verify
  - text: Check for streaks.
    notes:
      - Outside is up and down, inside is side to side. A streak's direction tells you which side it is on.
related:
  - card-tesla-wash-mode-tape
  - equipment-microfiber-towels
  - lesson-l2-05-glass
  - sop-glass
  - sop-interior
---
The Tesla glass stage is the regular outside glass with the camera lenses added.

The camera lenses are not settled. The house line is glass cleaner only. Tesla's manual says spray water on the lens, never use chemical-based or abrasive cleaners on it, and on older cars never wipe it at all, because grit dragged across the lens can scratch it. The cameras run Tesla's driver assistance, so a scratched lens matters. Lando decides how this applies to Teslas. Until then, both lines show.

The roof is glass too. It gets washed in the wash stage and never polished.
