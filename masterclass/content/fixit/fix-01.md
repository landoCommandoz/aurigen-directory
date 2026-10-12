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
  - polisher twisted out of my hand
  - kicked when I pulled the trigger
  - how tight do I hold it
sources:
  - label: HF product page, item 56367, FAQ
    date: 2026-10-07
    note: To reduce vibration, center the foam pad on the backing pad and spread compound evenly around the pad. Knowledge base 3.1. On 2026-10-11 the fact-checker could not find this FAQ line on any HF page that loads, so it is not reconfirmed (FC-62).
  - label: HF coupon page, item 56367
    url: https://go.harborfreight.com/sku/56367/
    date: 2026-10-11
    note: The long-throw 20 mm orbit produces 3 times the corrective action per orbit of a standard short-throw DA polisher. Loaded directly. Fact-checker FC-61 and FC-63. No source says some float is normal.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Buff and Shine 634CR, 6 in. yellow Uro-Tec pad
    url: https://buffandshine.com/products/634cr-6-yellow-uro-tec-foam-pad-polishing
    date: 2026-10-11
    note: Pad Size 6 in., Loop Diameter 6 in., Face Diameter 7 in., Foam Thickness 1 in., Orbital Sizes 8, 15, and 21 mm, Backing Plate 600Y. The maroon 672CR reads the same. Loaded directly. Fact-checker FC-54.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Buff and Shine 534CR, 5 in. yellow Uro-Tec pad
    url: https://buffandshine.com/products/534cr-5-yellow-uro-tec-foam-pad-polishing
    date: 2026-10-11
    note: Pad Size 5 in., Loop Diameter 5 in., Face Diameter 6 in., Backing Plate 500Y. Loaded directly. Fact-checker FC-54.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Buff and Shine 600Y backing plate listing
    date: 2026-10-11
    note: Listed as a 6 in. J-Hook backing plate with 5/16 in.-24 threads, so it does not match the 56367's M8 spindle. Fact-checker FC-54, with FC-17 and FC-19.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Retail pad listings
    date: 2026-10-11
    note: Some stores sell the 5 in.-back Uro-Tec, which has a 6 in. face, as a 6 in. pad. Retailer evidence only. Fact-checker FC-54.
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
  - label: BAUER 56367 owner's manual, 2021, rechecked
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-11
    note: General power tool safety, maintain a firm grip on the tool with both hands to resist starting torque. Operation, keep pressure off of the tool; the foam pad should lightly contact the surface. Specifications, Max Accessory Diameter 6 in. (150 mm). Fact-checker FC-54 and FC-55.
    confirmedOn: 2026-10-11
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
  - text: Pad back the same size as the plate. Measure the hook-and-loop back, not the face.
    status: verify
  - Marker line drawn on the pad edge, so you can see it turn.
  - text: "Test run it off the car: pad mounted, plug it in, highest speed, at least 30 seconds."
    status: sourced
causes:
  - Pad tilted onto an edge.
  - "Pushing instead of guiding: grip too tight, or pressure over about 10 lb."
  - Polish uneven, too much, or too little.
  - Pad off-center, or a loose plate.
  - text: A pad back that does not match the plate size. It can run off-center.
    status: verify
  - Speed too low for a 20 mm throw.
  - A curved panel under a flat pad.
steps:
  - Re-center the pad on the plate.
  - Spread the polish evenly at speed 1 to 2.
  - Turn the dial to speed 4 to work the square.
  - text: Hold the polisher with two hands.
    status: sourced
  - text: Keep your grip loose.
    status: house
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
  - text: A 20 mm long-throw makes a bigger orbit than a short-throw polisher. Harbor Freight says it does 3 times the corrective work per orbit.
    status: sourced
  - text: Some float is normal.
    status: verify
  - text: "House grip: two hands, loose grip, guide, don't push."
    status: house
  - text: The 56367 manual says to keep a firm grip with both hands to resist starting torque, and to keep pressure off the tool.
    status: sourced
  - text: Lando decides the grip wording (pending).
    status: verify
  - text: Buff and Shine names Uro-Tec pads by the size of the back. Its 6 in. pad has a 6 in. back and a 7 in. face. Its 5 in. pad has a 5 in. back and a 6 in. face.
    status: sourced
  - text: Some stores sell the 5 in.-back pad as a 6 in. pad.
    status: verify
  - text: The 56367 manual says the largest accessory is 6 in. (150 mm).
    status: sourced
  - text: Buff and Shine rates these pads for orbits up to 21 mm. That covers the 20 mm throw.
    status: sourced
  - text: "Which Uro-Tec size goes on the 56367: Lando decides (pending)."
    status: verify
  - text: Do not buy Buff and Shine's 600Y plate for the 56367. It has 5/16 in.-24 threads. The 56367 uses M8.
    status: sourced
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
