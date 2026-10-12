---
id: fix-03
type: fixnode
title: Heavy vibration
group: machine
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [polisher, machine, vibration, backing plate, pad]
sayIt:
  - vibrating bad
  - vibrating
  - heavy vibration
  - polisher vibrates
  - shaking
  - machine shaking
  - shakes my hands
  - hands going numb
  - wobbling
  - wobble
  - buzzing hard
  - shaking like crazy
sources:
  - label: HF product page, item 56367, FAQ
    date: 2026-10-07
    note: To reduce vibration, center the foam pad on the backing pad and spread compound evenly around the pad. Knowledge base 3.1. On 2026-10-11 the fact-checker could not find this FAQ line on any HF page that loads, so it is not reconfirmed (FC-62).
  - label: Knowledge base 14, backing plate research
    date: 2026-10-07
    note: Unplugged checks of the center bolt, the pad, the hooks, and the plate. Long-throw machines are counterweighted for 5 or 6 in. plates; a 3 in. plate causes violent vibration and can wear out the bearings.
  - label: BAUER 56367 owner's manual, 2021
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-10
    note: Page 3, if abnormal vibration occurs, stop use immediately. Page 7, the 30-second test run at the highest speed. Page 10, have abnormal noise or vibration corrected before further use, and check for loose hardware, misaligned or binding parts, and cracked or broken parts before each use. Page 11, give UPC 193175448170 for parts. Fact-checker FC-20 and FC-24.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: BAUER 56367 owner's manual, 2021, rechecked
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-11
    note: Specifications, Max Accessory Diameter 6 in. (150 mm). Only apply the pad flat against the surface. To reduce vibration, maintain the tool as explained in the manual. Fact-checker FC-54 and FC-62.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Buff and Shine 634CR and 534CR Uro-Tec pads
    url: https://buffandshine.com/products/634cr-6-yellow-uro-tec-foam-pad-polishing
    date: 2026-10-11
    note: The 6 in. pad has a 6 in. loop back and a 7 in. face. The 5 in. pad (534CR) has a 5 in. back and a 6 in. face. Buff and Shine's own 600Y plate has 5/16 in.-24 threads. Loaded directly. Fact-checker FC-54.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - text: Abnormal vibration. Stop use immediately. The manual says so.
    status: sourced
  - Grinding noise, burning smell, or visible plate wobble. Stop now.
checks:
  - Unplug it first.
  - text: Center bolt tight.
    status: sourced
  - text: Pad centered on the plate.
    status: sourced
  - text: Hooks not bald or melted.
    status: sourced
  - text: Plate not cracked or warped. Spin it by hand and watch the edge.
    status: sourced
  - text: Look for loose hardware, misaligned or binding parts, and cracked or broken parts.
    status: sourced
  - text: Pad back the same size as the plate. Measure the hook-and-loop back, not the face.
    status: verify
causes:
  - Loose or worn backing plate.
  - Off-center pad.
  - Uneven compound or polish on the pad.
  - Damaged pad.
  - text: A pad back that does not match the plate size.
    status: verify
  - text: A plate smaller than 5 or 6 in. A 3 in. plate causes violent vibration on a long-throw.
    status: sourced
steps:
  - Let go of the trigger with the pad still on the paint.
  - Lift the pad.
  - Unplug the polisher.
  - Run the checks above.
  - Center the pad on the backing plate.
  - Spread the product evenly around the pad.
  - "Plate loose, cracked, or worn: replace it. Open the backing plate fix."
  - "Pad damaged: swap it for a good one."
  - text: Never downsize the plate to stop vibration.
    status: sourced
  - text: Test run it off the car for at least 30 seconds before it touches paint.
    status: sourced
stillHappening:
  - text: "Still abnormal on the test run: do not use it. Get it fixed before further use."
    status: sourced
  - text: "Call the HF tech and parts line, 1-888-866-5797. Give them UPC 193175448170."
    status: sourced
notes:
  - text: Harbor Freight's FAQ line on centering the pad and spreading compound evenly was not found again on 2026-10-11. The steps stay as house steps.
    status: verify
  - text: The 56367 manual says the largest accessory is 6 in. (150 mm).
    status: sourced
  - text: Buff and Shine's 6 in. Uro-Tec has a 6 in. back and a 7 in. face. Its 5 in. pad has a 5 in. back and a 6 in. face.
    status: sourced
  - text: "Which Uro-Tec size goes on the 56367: Lando decides (pending)."
    status: verify
  - text: Do not buy Buff and Shine's 600Y plate for the 56367. It has 5/16 in.-24 threads. The 56367 uses M8.
    status: sourced
lessonId: lesson-l4-01-know-the-machine
equipmentIds:
  - equipment-bauer-56367
  - equipment-backing-plate
  - equipment-pad-urotec-yellow
  - equipment-pad-urotec-maroon
related:
  - fix-01
  - fix-34
  - fix-07
  - card-machine-settings
  - term-long-throw
  - sop-polish
---
