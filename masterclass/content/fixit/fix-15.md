---
id: fix-15
type: fixnode
title: Water spots after drying
group: wash-dry
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [water spots, hard water, drying, utah, ceramic wax]
sayIt:
  - water spots
  - hard water spots
  - spots after drying
  - water marks
  - mineral spots
  - white spots on the paint
  - spotty paint
  - drying spots
  - rings on the paint
  - hard water marks
  - water spot remover
  - acid spot remover
sources:
  - label: Knowledge base 5.4, hard water spots
    date: 2026-10-07
    note: Prevention list is house. Removal steps and products are not confirmed.
  - label: Meguiar's UK, Hybrid Ceramic Wax product page and launch article
    url: https://www.meguiars.co.uk/product/meguiars-hybrid-ceramic-wax-768ml/
    date: 2026-10-11
    note: Spray it on after the soap is rinsed off, rinse again, then dry. The launch article says you apply it before you dry the bodywork. Neither page says anything about water spots. Loaded directly. Fact-checker FC-46 and FC-49.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Chemical Guys Heavy Duty Water Spot Remover SPI108, safety data sheet
    url: https://chemicalguys.com/cdn/shop/files/SDS_SPI108_-_Heavy_Duty_Water_Spot_Remover.pdf
    date: 2026-10-11
    note: Causes severe skin burns and eye damage. Wear protective gloves, clothing, eye protection, and footwear. Contains sulphuric acid and ammonium bifluoride. One remover only; no remover is chosen. Loaded directly. Fact-checker FC-47.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Do not use acidic products either. Loaded directly. Fact-checker FC-47.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Meguiar's forum, how to remove water spots
    url: https://www.meguiarsonline.com/forum/information-station/how-to-articles/5056-how-to-remove-water-spots
    date: 2026-10-11
    note: Etched spots happen when the water ate into the paint, and removal means polishing by hand or machine. Above-surface spots often need clay and a paint cleaner. Forum, supporting only. Fact-checker FC-47 and FC-48.
stopIf:
  - text: Some water-spot removers are strong acids. One sold by Chemical Guys is labeled Danger. It causes severe skin burns and eye damage.
    status: sourced
  - text: Read the remover's label first. Wear gloves and eye protection.
    status: sourced
  - text: No remover is chosen yet. Do not use one until Lando picks it and reads its label (pending).
    status: verify
checks:
  - Wipe one spot with a damp towel. Does it come off?
  - Still there after the wipe? It is a mineral spot.
  - Can you see it sunk into the paint? It may be etched.
  - Was the car washed or left wet in the sun?
causes:
  - Water dried on the paint in the sun or on a hot panel.
  - Sections too big, so water dried before you got to it.
  - Slow drying, or walking away from a wet car.
  - Utah hard water.
steps:
  - text: "Fresh spots: wipe with a damp towel and the ceramic spray."
    status: verify
  - text: "Mineral spots: they need a water-spot remover. None is owned yet."
    status: verify
  - text: "Etched spots: they need polish."
    status: verify
stillHappening:
  - "Spots on every wash: work in shade on cool panels."
  - Wash smaller sections.
  - Never walk away from a wet car in the sun.
  - Dry right away.
  - Blow out the gaps with the compressor.
  - text: Use the ceramic wax as a drying aid against water spots.
    status: verify
  - Finish with the open-hose sheeting rinse.
notes:
  - text: The removal steps and products in this fix are not confirmed yet.
    status: verify
  - text: No Meguiar's source says the ceramic spray removes or prevents water spots.
    status: verify
  - text: Meguiar's says to spray Hybrid Ceramic Wax on the wet car, then dry.
    status: sourced
  - text: A Meguiar's how-to on its forum says etched spots need polishing by hand or machine.
    status: verify
  - text: "On a Tesla, the house step for mineral spots is a water-spot remover. None is chosen yet."
    status: verify
  - text: Tesla's manual says do not use acidic products.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
  - text: "Future fix: spot-free or deionized rinse water. The cost is not checked."
    status: verify
lessonId: lesson-l1-04-hard-water-drying
productIds:
  - product-meguiars-hybrid-ceramic-wax
equipmentIds:
  - equipment-air-compressor
  - equipment-microfiber-towels
related:
  - term-water-spots
  - term-sheeting-rinse
  - term-etching
  - sop-dry
  - sop-protect
---
