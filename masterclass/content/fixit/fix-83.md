---
id: fix-83
type: fixnode
title: The bike is still hot
group: bike
audience: [owner, crew]
visibility: internal
status: house
kbRef: "12.1"
tags: [bike, motorcycle, hot pipes, exhaust, chrome, stone cold]
sayIt:
  - bike is still hot
  - just rode in
  - pipes are hot
  - hot exhaust
  - engine still warm
  - can I wash a hot bike
  - rider just dropped it off
  - chrome stained after the wash
  - bug remover baked on the exhaust
  - water on hot pipes
sources:
  - label: Knowledge base 12.1
    date: 2026-10-07
    note: The bike must be stone cold. Water on hot pipes stains chrome. Bug remover on a hot exhaust bakes on.
stopIf:
  - Bike not stone cold? No water and no bug remover. Wait.
  - text: Do not grab hot pipes or an exhaust to check. They can burn you.
    status: verify
checks:
  - When was it last ridden?
  - Is any heat coming off the engine or the pipes?
causes:
  - The bike was ridden in and not given time to cool.
steps:
  - Wait until the bike is stone cold, pipes and engine included.
  - Then set the hose on low.
  - Start the wash.
stillHappening:
  - text: Chrome already stained, or bug remover baked on. The knowledge base has no fix yet.
    status: verify
notes:
  - Water on hot pipes stains chrome.
  - Bug remover on a hot exhaust bakes on.
  - text: How long a bike takes to go stone cold is not in the knowledge base.
    status: verify
  - Motorcycles are drop-off only.
productIds:
  - product-meguiars-bug-tar
related:
  - fix-30
  - fix-64
  - card-bike-rules
  - sop-wash-bike
  - sop-setup-bike
---
