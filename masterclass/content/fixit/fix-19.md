---
id: fix-19
type: fixnode
title: Glass streaks
group: glass
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [glass, windows, windshield, streaks, towels]
sayIt:
  - glass streaks
  - streaky glass
  - streaky windows
  - windshield streaks
  - smeared windows
  - hazy windshield
  - haze on the inside of the windshield
  - window looks smeary
  - can't get the glass clear
  - streaks on the window I can't find
  - glass still foggy after cleaning
  - which side is the streak on
sources:
  - label: Knowledge base 9.3 and 21
    date: 2026-10-07
    note: Two towels, one wet and one dry, never a towel that touched wax or polish. Inside side to side, outside up and down, so a streak tells you which side it is on. Glass is last. On a bike the windshield is plastic (12.1).
  - label: Tesla Model Y 2020 to 2024 owner's manual, US page, Cleaning a Camera
    url: https://www.tesla.com/ownersmanual/2020_2024_modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-11
    note: Vehicles built in Fremont or Gigafactory Austin before about late May 2023, spray water on the lens and do not wipe it with your hands or a cloth. Later builds, spray water and dry with a microfiber cloth. Read through the search index. Fact-checker FC-33.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Page 178, Cleaning a Camera. Do not use chemical-based or abrasive cleaners; doing so can damage the surface of the lens. Loaded directly. Fact-checker FC-33.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - "On a bike, the windshield is plastic. No alcohol, no glass cleaner, no compound, no clay."
checks:
  - Did either towel touch wax or polish?
  - Did you use two towels, one wet and one dry?
  - Which way does the streak run, side to side or up and down?
  - Was the glass done last?
causes:
  - A towel that touched wax or polish.
  - A one-towel wipe.
  - Glass done before other work, so it got dirty again.
steps:
  - Grab two clean glass towels.
  - Keep one wet and one dry.
  - Wipe the inside side to side.
  - Wipe the outside up and down.
  - Look at the streak that is left.
  - "Streak runs side to side: it is on the inside."
  - "Streak runs up and down: it is on the outside."
  - Re-wipe that side only.
  - Do glass last, last thing inside and last thing outside.
stillHappening:
  - "A dirty line at the top or a missed corner: open the dirty line at the top of the window fix."
  - text: Still streaky with two clean towels. The knowledge base has no next step yet.
    status: verify
notes:
  - Never use a towel that touched wax or polish on glass.
  - text: What wets the glass towel, water or a glass cleaner, is not set in the knowledge base yet.
    status: verify
  - text: On a Tesla, the house rule is glass cleaner only on camera lenses.
    status: house
  - text: Tesla's manual says spray water on the lens. Never use chemical-based or abrasive cleaners on a lens.
    status: sourced
  - text: On a 2020 to 2024 Model Y built before about late May 2023 in Fremont or Austin, Tesla says never wipe the lens with a hand or a cloth. On later cars, dry it with a microfiber cloth.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
  - text: A 2022 Model Y falls in the no-wipe group unless its build date says otherwise. The build month is on the driver door jamb label.
    status: verify
  - text: No glass cleaner product is named in the knowledge base.
    status: verify
lessonId: lesson-l2-05-glass
equipmentIds:
  - equipment-microfiber-towels
related:
  - fix-48
  - fix-84
  - fix-68
  - sop-glass
  - sop-glass-tesla
  - sop-glass-bike
---
