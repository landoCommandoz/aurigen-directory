---
id: fix-01
type: fixnode
title: Polisher jerks, walks, or hops side to side
group: machine
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [polisher, machine, control, backing plate, marker line, long-throw]
sayIt:
  - jerking
  - jerks
  - polisher jerking
  - hopping
  - polisher hopping
  - walking
  - walks across the panel
  - bouncing
  - pulling
  - fighting me
  - polisher is fighting me
  - it keeps fighting me
  - wants to go left and right
  - jerks left and right going up and down
  - jumping around
  - won't stay put
  - kicking
  - skipping across the paint
sources:
  - label: HF product page, item 56367, FAQ
    date: 2026-10-07
    note: To reduce vibration, center the foam pad on the backing pad and spread compound evenly around the pad. Knowledge base 3.1.
  - label: Knowledge base 14, backing plate research
    date: 2026-10-07
    note: Unplugged checks of the center bolt, the pad, the hooks, and the plate.
  - label: HF item page, 56367
    url: https://go.harborfreight.com/sku/56367/
    date: 2026-10-10
    note: Speeds 2 to 3 to apply or remove wax or sealant, speeds 4 to 6 when compounding or polishing. Fact-checker FC-22.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: BAUER 56367 owner's manual, 2021
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-10
    note: Page 7, the 30-second test run at the highest speed. Pages 3 and 10, abnormal noise or vibration. Page 8, only use slower speeds for polishing, and keep pressure off the tool. The tech line is on every page. Fact-checker FC-20, FC-22, FC-23, and FC-24.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: HF product page, item 64913
    url: https://www.harborfreight.com/6-in-hook-and-loop-backing-pad-for-dual-action-and-random-orbit-polishers-64913.html
    date: 2026-10-10
    note: Arbor Size 5/16 in.-24, so it does not fit the 56367. Read through the search index. Fact-checker FC-19.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
stopIf:
  - Grinding noise, burning smell, visible plate wobble, or abnormal vibration. Stop now.
  - text: Abnormal noise or vibration on the test run. Get it fixed before further use. The manual says so.
    status: sourced
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
  - Marker line drawn on the pad edge, so you can see it turn.
  - text: "Test run it off the car: pad mounted, plug it in, highest speed, at least 30 seconds."
    status: sourced
causes:
  - Pad tilted onto an edge.
  - "Pushing instead of guiding: grip too tight, or pressure over about 10 lb."
  - Polish uneven, too much, or too little.
  - Pad off-center, or a loose plate.
  - Speed too low for a 20 mm throw.
  - A curved panel under a flat pad.
steps:
  - Re-center the pad on the plate.
  - Spread the polish evenly at speed 1 to 2.
  - Turn the dial to speed 4 to work the square.
  - Hold the polisher with two hands.
  - Keep your grip loose.
  - Guide it. Do not push it.
  - Keep the pad flat on the paint.
  - On a curve, use the middle of the pad.
  - Watch the marker line and keep it turning.
stillHappening:
  - "Marker line slows or stops: open the pad stops spinning fix."
  - "It shakes hard: unplug it and open the heavy vibration fix."
  - "Plate cracked or warped, or hooks bald or melted: replace the backing plate. Open the backing plate fix."
  - text: Do not buy HF item 64913 for the 56367. It is 5/16 in.-24 thread and does not fit.
    status: sourced
  - text: "Still abnormal on the 30-second test run: do not polish. Call the HF tech and parts line, 1-888-866-5797."
    status: sourced
notes:
  - text: A 20 mm long-throw moves more than a short-throw. Some float is normal.
    status: verify
  - text: "House setting: work at speed 4 with about 10 lb of pressure. Let the last set float on the machine's own weight."
    status: house
  - text: Harbor Freight's product page says speeds 4 to 6 for polishing or compounding.
    status: sourced
  - text: "The 56367 manual says: Only use slower speeds for polishing. It does not say which speeds count as slower."
    status: sourced
  - text: "The 56367 manual says: Keep pressure off of the tool. The foam pad should lightly contact the polishing surface."
    status: sourced
  - text: Lando decides which applies (pending). Until he does, the house settings stay.
    status: verify
lessonId: lesson-l4-04-speed-sets-marker
productIds:
  - product-meguiars-m210
  - product-meguiars-ultimate-compound
equipmentIds:
  - equipment-bauer-56367
  - equipment-backing-plate
  - equipment-pad-urotec-yellow
  - equipment-pad-urotec-maroon
related:
  - fix-02
  - fix-03
  - fix-34
  - card-machine-settings
  - lesson-l4-01-know-the-machine
  - lesson-l4-03-pressure
  - term-long-throw
  - sop-polish
---
