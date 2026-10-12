---
id: sop-chain-bike
type: sop
title: Chain clean and lube, motorcycle
stage: chain
vehicleBranch: bike
audience: [owner, crew]
visibility: internal
status: house
version: 2
kbRef: "12.1"
tags: [chain, lube, bike, motorcycle, add-on]
synonyms:
  - lube the chain
  - chain clean and lube
  - o-rings
  - degreaser on a bike
  - bike lube
  - belt or chain
sources:
  - label: D.I.D chain maintenance, Dec 1, 2022
    url: https://didchain.com/blogs/news/d-i-d-chain-maintenance
    date: 2026-10-11
    note: Wipe the chain with a soft cloth dampened with an O-ring or X-ring safe cleaner. Lube with an O-ring or X-ring safe lubricant. Never steam, thinner, gasoline, benzene, or a wire brush. Fact-checker FC-84.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Harley-Davidson 2023 Street Glide (US) specifications
    url: https://h-dmediakit.com/epapi-get/pdf/bikepages/specs/2023/flhx/specifications_flhx_us.pdf
    date: 2026-10-11
    note: Primary drive chain inside the engine case; final drive belt. The 2024 sheet says the same. Verification log FC-85.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
steps:
  - text: Check the final drive. Is it a chain or a belt?
    status: sourced
    stopIf: It is a belt, not a chain. This stage is for chains only.
    notes:
      - text: Harley-Davidson's Street Glide spec sheets list a belt final drive, not a chain.
        status: sourced
      - text: How the chain add-on applies to belt-drive bikes is for Lando to decide (pending).
        status: verify
  - text: Wipe the chain with a cloth dampened with an O-ring safe chain cleaner.
    status: sourced
    quickCardId: card-bike-rules
    stopIf: Household degreaser in your hand. Stop. It strips the O-rings.
    notes:
      - text: Never gasoline, thinner, steam, a pressure washer, or a wire brush. The wrong solvent can ruin the chain's seals.
        status: sourced
      - No water pressure at the chain.
      - text: No chain cleaner is in the kit list yet.
        status: verify
  - text: Lube the chain with an O-ring safe chain lube.
    status: sourced
    notes:
      - text: No chain lube is in the kit list yet.
        status: verify
related:
  - card-bike-rules
  - sop-wash-bike
---
Check the final drive first. Harley-Davidson's Street Glide spec sheets list a belt final drive, not a chain. This stage is for chains only, and how the add-on applies to belt bikes is Lando's call.

Use an O-ring safe chain cleaner and an O-ring safe chain lube only. Never gasoline, thinner, steam, a pressure washer, or a wire brush. The wrong solvent can ruin the chain's seals. Household degreaser strips the O-rings.

Chain clean and lube is an add-on. Neither product is in the kit list yet, so both steps carry an unverified note until Lando names them.
