---
id: sop-cleanup-bike
type: sop
title: Cleanup and laundry, motorcycle
stage: cleanup
vehicleBranch: bike
audience: [owner, crew]
visibility: internal
status: house
version: 2
kbRef: "13"
tags: [cleanup, laundry, towels, bike, motorcycle]
synonyms:
  - bike cleanup
  - close down after the bike
  - motorcycle cleanup
  - bike laundry
  - put away after the bike
  - end of a bike job
sources:
  - label: Knowledge base 13.3
    date: 2026-10-07
    note: Hot water for the product piles, warm for the water-only pile. Meguiar's washes its own polishing cloths hot.
  - label: The Rag Company use and care tips
    url: https://www.theragcompany.com/use-and-care-tips
    date: 2026-10-11
    note: Warm or cold water; avoid hot water and sanitize cycles. Low heat or no heat only. A towel maker's own guide, not Lando's towel brand. Fact-checker FC-88.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Armor All product page, Extreme Wheel & Tire Cleaner
    url: https://armorall.com/product/extreme-wheel-tire-cleaner
    date: 2026-10-11
    note: Do not allow wash water to enter storm drains, streams, or lakes. Fact-checker FC-91.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Verification log FC-92
    date: 2026-10-11
    note: Dumping buckets in a sink or toilet is a house rule. No city code has been confirmed to require it, so no content cites a city rule until Lando's call.
steps:
  - text: "Sort the towels into three piles that never mix: water-only, product, and wheels."
    notes:
      - Water-only is the wash and drying towels.
      - Product is polish, compound, IPA, and ceramic.
      - Wheel towels are wheel towels for good.
  - text: Soak the product pile 1 hour in warm soapy water.
    timer: { kind: dwell, seconds: 3600 }
  - text: Wash the product piles in hot water.
    status: house
    notes:
      - Wax-residue towels get at least two washes.
      - text: The Rag Company, a towel maker, says warm or cold water, never hot.
        status: sourced
      - text: Follow the care tag on your towels. Lando decides hot or warm (pending).
        status: verify
  - text: Wash the water-only pile in warm water.
    status: sourced
  - text: Wash the wheel towels in their own load.
  - text: Use dye-free, fragrance-free detergent, a full cycle, and an extra rinse.
    notes:
      - Never fabric softener, dryer sheets, or bleach. Empty the softener cup on a shared washer.
      - Microfiber only. Never with cotton or terry.
  - text: Dry the towels on low, or air dry them.
    notes:
      - Dryer heat is what melts microfiber.
  - text: Dump the buckets in a sink or toilet, not the street.
    notes:
      - Keep wash water out of storm drains.
      - text: Armor All's wheel cleaner label says do not let wash water reach storm drains, streams, or lakes.
        status: sourced
      - text: Lando's call to Tooele City about runoff is still pending.
        status: verify
  - text: Drain the compressor the way its manual says.
    status: verify
    notes:
      - text: The compressor manual's draining steps are not checked yet.
        status: verify
related:
  - equipment-microfiber-towels
  - equipment-air-compressor
  - sop-cleanup
---
A bike job closes down like a car job for the towels and the buckets. Towels go in three piles that never mix, product towels soak an hour first, and wash water stays out of storm drains.
