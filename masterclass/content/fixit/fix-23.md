---
id: fix-23
type: fixnode
title: Backing plate damaged or needs replacing
group: machine
audience: [owner, crew]
visibility: internal
status: sourced
kbRef: "21"
tags: [backing plate, backing pad, hook and loop, m8, replacement, "56367"]
sayIt:
  - backing plate
  - backing pad
  - plate is cracked
  - plate is warped
  - plate wobbles
  - hooks worn out
  - bald hooks
  - velcro worn out
  - melted hooks
  - pad won't stay on the plate
  - need a new backing plate
  - which plate fits
  - replacement plate
  - "64913"
  - dropped the polisher
  - polisher fell on the floor
sources:
  - label: Knowledge base 14, backing plate research
    date: 2026-10-07
    note: Unplugged checks, replace with a 6 in. (150 mm) long-throw plate on an M8 bolt, never downsize, compare the hub before bolting on. Backup plates are not confirmed to fit.
  - label: HF product page, item 56367
    url: https://www.harborfreight.com/75-amp-6-in-20-mm-long-throw-random-orbit-da-polisher-56367.html
    date: 2026-10-10
    note: "Spec table: Thread Size M8-1.25. The thread comes from this page, not the manual. Read through the search index. Fact-checker FC-17 and FC-18."
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: HF product page, item 64913
    url: https://www.harborfreight.com/6-in-hook-and-loop-backing-pad-for-dual-action-and-random-orbit-polishers-64913.html
    date: 2026-10-10
    note: Arbor Size 5/16 in.-24, so it does not fit the 56367. Read through the search index. Fact-checker FC-19.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: BAUER 56367 owner's manual, 2021
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-10
    note: Tech line on every page, UPC 193175448170 for parts, some parts not sold separately (FC-20). Spindle bolt with a hex wrench, counterclockwise to remove, do not overtighten, spindle lock under the auxiliary handle (FC-21). The 30-second test run and abnormal vibration (FC-24).
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
stopIf:
  - Abnormal vibration. Stop use now.
  - Do not buy HF item 64913 for the 56367. It is 5/16 in.-24 thread and does not fit.
  - Never downsize to a 3 in. plate to stop vibration. It causes violent vibration and can wear out the bearings.
checks:
  - Unplug it first.
  - Center bolt tight?
  - Pad centered on the plate?
  - Hooks bald or melted?
  - Spin the plate by hand and watch the edge. Cracked or warped?
causes:
  - Hooks bald or melted.
  - The plate is cracked or warped.
  - A loose center bolt.
steps:
  - Unplug the polisher.
  - Call the HF tech and parts line, 1-888-866-5797.
  - Give them UPC 193175448170.
  - Ask for the replacement backing pad for item 56367.
  - Compare the new plate's hub to the old one before you bolt it on.
  - Turn the spindle bolt counterclockwise with the hex wrench to take the old plate off.
  - Bolt the new plate on.
  - Do not overtighten the bolt.
  - Center a pad on the new plate.
  - "Test run it off the car: plug it in, highest speed, at least 30 seconds."
stillHappening:
  - "The bolt won't turn, or the plate just spins: open the plate bolt won't loosen fix."
  - "Still abnormal noise or vibration on the test run: do not polish. Get it fixed before further use."
  - text: HF may not sell the plate. The manual says some parts are not sold separately.
    status: sourced
  - text: "Backup plates: ShineMate Heavy Duty (M8 thread, M8 bolt included). Owners report a Maxshine plate, and a Griot's BOSS 21 plate that looks nearly identical. Fit and the 6 in. price are not confirmed. Check before you buy."
    status: verify
notes:
  - "The right plate: 6 in. (150 mm), made for a long-throw, mounted with an M8 bolt. The thread is M8 x 1.25."
  - Long-throw machines are counterweighted for 5 or 6 in. plates.
  - text: Whether HF has the replacement plate in stock is not confirmed.
    status: verify
lessonId: lesson-l4-06-pad-care-backing-plate
equipmentIds:
  - equipment-backing-plate
  - equipment-bauer-56367
related:
  - fix-01
  - fix-03
  - fix-07
  - fix-34
  - fix-49
  - card-machine-settings
  - term-backing-plate
  - term-m8
  - term-hook-and-loop
---
