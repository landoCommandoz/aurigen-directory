---
id: fix-84
type: fixnode
title: "Bike windshield is hazy or dirty: what can I use?"
group: bike
audience: [owner, crew]
visibility: internal
status: house
kbRef: "12.1"
tags: [bike, motorcycle, windshield, plastic, glass cleaner, alcohol]
sayIt:
  - bike windshield
  - motorcycle windshield
  - windscreen on the bike
  - hazy bike windshield
  - bugs on the bike windshield
  - can I use glass cleaner on the bike
  - ipa on the windshield
  - scratched bike windshield
  - plastic windshield
  - fairing windshield cleaner
sources:
  - label: Knowledge base 12.1 and 21
    date: 2026-10-07
    note: Motorcycle windshields are plastic. No alcohol, no glass cleaner, no compound, no clay. The approved plastic cleaner is not confirmed.
  - label: National Cycle windshield instruction sheet, 2016
    url: https://www.nationalcycle.com/media/wysiwyg/pdf/ispl/10-118601-000.pdf
    date: 2026-10-11
    note: Do not clean polycarbonate in hot sun or high temperatures. Do not clean the screen with household glass cleaners. Do not allow brake fluid, alcohol, or strong solvents to contact the windshield. Clean with a soft cloth, plenty of warm water, and if needed a non-abrasive soap such as dishwashing liquid. Loaded directly. Fact-checker FC-82 and FC-83.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Harley-Davidson service information, windshield care
    url: https://serviceinfo.harley-davidson.com/sip/service/procedure/1952428810735561133/BLAISE/393859/en_US?nid=6372
    date: 2026-10-11
    note: Ammonia-based window cleaners cause permanent yellowing. Powdered, abrasive, or alkaline cleansers can damage the windshield. Read through the search index. Fact-checker FC-82.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - text: "A bike windshield is plastic. No alcohol, no glass cleaner, no compound."
    status: sourced
  - No clay on it either.
  - text: Do not clean it in hot sun.
    status: sourced
checks:
  - What is in your hand? The IPA bottle and glass cleaner stay away.
  - Is it haze, bugs, or scratches?
causes:
  - Car glass habits on a plastic windshield.
steps:
  - Put the IPA bottle and the glass cleaner down.
  - Keep the clay and the compound away from it.
  - text: Clean it with the approved plastic cleaner.
    status: verify
stillHappening:
  - text: Scratches in the windshield. The knowledge base has no fix for plastic scratches.
    status: verify
  - "Other bike questions: open the motorcycle, what can't I use fix."
notes:
  - text: No approved plastic cleaner is confirmed yet. One windshield maker names warm water and dishwashing liquid, while the house keeps dish soap in the garage. Lando decides (pending).
    status: verify
  - The glass rules for cars do not apply. This is plastic.
productIds:
  - product-ipa-70
related:
  - fix-30
  - fix-19
  - card-bike-rules
  - card-ipa-wipe
  - sop-glass-bike
---
