---
id: fix-85
type: fixnode
title: Bike chain is dirty or dry
group: bike
audience: [owner, crew]
visibility: internal
status: house
kbRef: "12.1"
tags: [bike, motorcycle, chain, lube, degreaser, o-rings, add-on]
sayIt:
  - chain
  - dirty chain
  - chain is dry
  - chain is gunked up
  - lube the chain
  - can I degrease the chain
  - household degreaser on the chain
  - chain clean and lube
  - o-rings
  - greasy chain
  - harley belt
  - belt drive
  - bagger chain
sources:
  - label: Knowledge base 12.1 and 12.2
    date: 2026-10-07
    note: Chain-specific cleaner and chain lube only. Household degreaser strips the O-rings. No pressure at the chain. Nothing slick on brake rotors. Chain clean and lube is a $25 add-on.
  - label: D.I.D chain maintenance, 2022
    url: https://didchain.com/blogs/news/d-i-d-chain-maintenance
    date: 2026-10-11
    note: Clean the chain with a soft cloth and an O-ring safe cleaner. Lube it with an O-ring safe lubricant. Never steam, thinner, gasoline, benzene, or a wire brush. Kerosene deforms the seal rings. Loaded directly. Fact-checker FC-84.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Harley-Davidson 2023 Street Glide spec sheet
    url: https://h-dmediakit.com/epapi-get/pdf/bikepages/specs/2023/flhx/specifications_flhx_us.pdf
    date: 2026-10-11
    note: Primary drive chain, 34/46 ratio. Final drive belt, 32/68 ratio. The footnote says the models use a carbon fiber belt final drive. The 2024 sheet says the same. Loaded directly. Fact-checker FC-85.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - Household degreaser in your hand? Stop. It strips the O-rings.
  - text: Never gasoline, thinner, steam, a pressure washer, or a wire brush on the chain. The wrong solvent can ruin the chain's seals.
    status: sourced
  - No water pressure at the chain.
  - Keep chain lube off the brake rotors. Nothing slick on a rotor.
checks:
  - text: Chain or belt? Look at the final drive before you offer the add-on.
    status: verify
  - text: Is the cleaner O-ring safe?
    status: sourced
  - text: Is the lube O-ring safe?
    status: sourced
  - Is the hose on low and off the chain?
causes:
  - A dirty or dry chain on a bike that came in for a wash or detail.
steps:
  - text: Clean the chain with an O-ring safe chain cleaner.
    status: sourced
  - text: Lube the chain with an O-ring safe chain lube.
    status: sourced
  - text: Quote chain clean and lube as an add-on, $25.
    status: house
stillHappening:
  - "Something slick got on a rotor: open the slick product on a bike fix."
notes:
  - text: No chain cleaner or chain lube is in the kit list yet.
    status: verify
  - Household degreaser strips the O-rings. Chain products only.
  - text: "House menu: chain clean and lube is a $25 add-on."
    status: house
  - text: Harley-Davidson's spec sheets show its touring bikes (baggers) use a belt final drive, not a chain.
    status: sourced
  - text: Lando decides how the chain add-on applies to belt bikes (pending).
    status: verify
related:
  - fix-30
  - fix-86
  - card-bike-rules
  - sop-chain-bike
---
