---
id: fix-34
type: fixnode
title: Polisher sounds wrong or smells hot
group: machine
audience: [owner, crew]
visibility: internal
status: house
kbRef: "3.1"
tags: [polisher, machine, noise, smell, test run, safety]
sayIt:
  - grinding noise
  - grinding
  - burning smell
  - smells hot
  - smells like burning
  - weird noise
  - strange noise
  - sounds wrong
  - rattling
  - clicking noise
  - squealing
  - motor smell
  - making a noise
sources:
  - label: Knowledge base 14, backing plate research
    date: 2026-10-07
    note: Unplugged checks of the center bolt, the pad, the hooks, and the plate.
  - label: BAUER 56367 owner's manual, 2021
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-10
    note: Page 3, if abnormal vibration occurs, stop use immediately. Page 7, the 30-second test run. Page 10, do not use damaged equipment; if abnormal noise or vibration occurs, have the problem corrected before further use; before each use check for loose hardware, misalignment or binding of moving parts, and cracked or broken parts; Replacing Backing Pad says do not overtighten the bolt. Page 11, give UPC 193175448170 for parts. Fact-checker FC-20, FC-21, and FC-24.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
stopIf:
  - Grinding noise, burning smell, or visible plate wobble. Stop now.
  - text: Abnormal noise. Have the problem corrected before further use. The manual says so.
    status: sourced
checks:
  - Unplug it first.
  - text: Look for loose hardware, misaligned or binding parts, and cracked or broken parts.
    status: sourced
  - text: Center bolt tight.
    status: sourced
  - text: Hooks not bald or melted.
    status: sourced
  - text: Plate not cracked or warped. Spin it by hand and watch the edge.
    status: sourced
causes:
  - A loose center bolt or a loose plate.
  - text: Loose hardware, misaligned or binding parts, or cracked or broken parts.
    status: sourced
  - text: A cracked or warped plate, or melted hooks.
    status: sourced
steps:
  - Let go of the trigger with the pad still on the paint.
  - Lift the pad.
  - Unplug the polisher.
  - Rest it on its side on a towel.
  - Run the checks above.
  - text: "Loose center bolt: snug it with the hex wrench. Do not overtighten it."
    status: sourced
  - "Plate cracked or warped, or hooks melted: replace the plate. Open the backing plate fix."
  - text: "Test run it off the car: pad mounted, plug it in, highest speed, at least 30 seconds."
    status: sourced
stillHappening:
  - text: "Still sounds or smells wrong: do not use it. Do not use damaged equipment."
    status: sourced
  - text: "Call the HF tech and parts line, 1-888-866-5797. Give them UPC 193175448170."
    status: sourced
notes:
  - The knowledge base does not rank these causes. Check all of them.
lessonId: lesson-l4-01-know-the-machine
equipmentIds:
  - equipment-bauer-56367
  - equipment-backing-plate
related:
  - fix-01
  - fix-03
  - fix-49
  - lesson-l0-02-stay-safe
  - sop-polish
---
