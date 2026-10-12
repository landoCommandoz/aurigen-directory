---
id: fix-72
type: fixnode
title: Found money, valuables, or personal items in the car
group: interior
audience: [owner, crew]
visibility: internal
status: house
kbRef: "10"
tags: [interior, personal items, valuables, money, customer]
sayIt:
  - found money
  - found cash in the car
  - found jewelry
  - customer's stuff
  - personal items
  - found a wallet
  - valuables in the car
  - what do I do with their stuff
  - found something under the seat
  - is this trash or theirs
  - car seat
sources:
  - label: Knowledge base 10
    date: 2026-10-07
    note: Everything out first, trash, mats, car seats, loose items. Personal items go in one bag the customer can see. Money or valuables go on the dash, and you say something.
stopIf: []
checks:
  - Is it money or something valuable?
  - Is it a personal item?
causes:
  - Customers leave things in the car. Everything comes out first, so you will find them.
steps:
  - Put personal items in one bag.
  - Keep the bag where the customer can see it.
  - Put money or valuables on the dash.
  - Tell the customer what you found.
  - text: Not sure if it is trash? Put it in the bag.
    status: verify
stillHappening:
  - text: "Crew: who tells the customer when Lando is not there is not set. Lando decides (pending)."
    status: verify
notes:
  - Everything comes out first. Trash, mats, car seats, and loose items.
  - text: Child car seats come out with everything else. Who puts them back, and how, is not in the knowledge base. Lando decides (pending).
    status: verify
lessonId: lesson-l2-01-interior-order
related:
  - sop-interior
  - fix-28
---
