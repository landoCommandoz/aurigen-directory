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
  - label: AutoGeek forum, BAUER 56367 non-standard backing plate thread
    url: https://www.autogeekonline.net/forum/auto-detailing-tools-and-accessories/126678-new-bauer-hf-56367-long-throw-polisher-non-standard-backing-plate.html
    date: 2026-10-11
    note: The owner's Maxshine swap was a 125 mm (5 in.) plate, and he did not say how it ran. Another owner said a Griot's BOSS G21 plate looks very similar; nobody reported fitting one. Forum. Fact-checker FC-57.
  - label: Retail listing, Maxshine MSDABP6
    date: 2026-10-11
    note: Maxshine's standard 6 in. DA plate is listed with a 5/16 in. thread, not M8. Retailer only; no Maxshine maker page found. Fact-checker FC-57.
  - label: Parks Car Care, ShineMate Backing Plate DA Heavy Duty
    url: https://parkscarcare.net/products/shinemate-5-backing-plate-da-heavy-duty
    date: 2026-10-11
    note: The 6 in. is $23.05, the same as the 5 in., and was out of stock on 2026-10-11. Seller copy says a standard M8 female thread, an M8 male mounting bolt included, and fits most 5 to 6 in. long-throws. The seller is a source for its price only, not for fit. Fact-checker FC-58 and FC-59.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Buff and Shine 634CR Uro-Tec pad and 600Y plate
    url: https://buffandshine.com/products/634cr-6-yellow-uro-tec-foam-pad-polishing
    date: 2026-10-11
    note: The 6 in. pad has a 6 in. loop back and a 7 in. face and pairs with the 600Y plate. The 600Y is listed with 5/16 in.-24 threads. Loaded directly. Fact-checker FC-54.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - Abnormal vibration. Stop use now.
  - Do not buy HF item 64913 for the 56367. It is 5/16 in.-24 thread and does not fit.
  - text: Do not buy Buff and Shine's 600Y plate for the 56367. It has 5/16 in.-24 threads. The 56367 uses M8.
    status: sourced
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
  - text: "Backup plate: ShineMate Heavy Duty 6 in. The seller says M8 thread with an M8 bolt included. Fit on the 56367 is not confirmed. Check before you buy."
    status: verify
  - text: The ShineMate 6 in. was $23.05 at Parks Car Care on 2026-10-11, the same as the 5 in. It was out of stock.
    status: sourced
  - text: The seller describes a female M8 thread plus an M8 bolt. The 56367 plate mounts with a spindle bolt through a center hole. Compare the hub to the stock plate before you bolt it on.
    status: verify
  - text: "Not backups: the forum Maxshine swap was a 5 in. plate, the downsize this fix forbids. A retailer lists Maxshine's standard 6 in. plate with 5/16 in. threads. Nobody reported fitting a Griot's BOSS G21 plate."
    status: sourced
notes:
  - "The right plate: 6 in. (150 mm), made for a long-throw, mounted with an M8 bolt. The thread is M8 x 1.25."
  - Long-throw machines are counterweighted for 5 or 6 in. plates.
  - text: Whether HF can supply the replacement plate is not confirmed. Only a call to the parts line settles it.
    status: verify
  - text: Buff and Shine's 6 in. Uro-Tec has a 6 in. back and a 7 in. face. Its 5 in. pad has a 5 in. back and a 6 in. face.
    status: sourced
  - text: "Which Uro-Tec size goes on the 56367: Lando decides (pending)."
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
