---
id: sop-setup-bike
type: sop
title: Setup and kit staging, motorcycle
stage: setup
vehicleBranch: bike
audience: [owner, crew]
visibility: internal
status: house
kbRef: "18.3"
tags: [setup, staging, cart, bike, motorcycle]
synonyms:
  - bike setup
  - set up for the bike
  - motorcycle setup
  - stage the kit for a bike
  - bike morning setup
  - get ready for the motorcycle
steps:
  - text: Roll the cart or bin set next to the bike.
    timer: { kind: setup, seconds: 900 }
    quickCardId: card-bike-rules
    notes:
      - text: "Setup target: 15 minutes, timed in the app. It is a proposal Lando has not accepted yet."
        status: verify
  - text: Set the bins out by stage.
  - text: Check that nothing is more than three steps away.
  - text: Have the wash bucket mixed, or measured out.
    notes:
      - text: Which wash mix a bike gets is not set yet.
        status: verify
  - text: Count the towels into piles.
    notes:
      - The wheel pile never rejoins the paint pile.
  - text: Charge the compressor.
    notes:
      - Bikes dry with the air compressor, every crevice.
  - text: Run the cords.
related:
  - card-bike-rules
  - card-setup-kit
  - equipment-air-compressor
  - equipment-microfiber-towels
  - sop-setup
  - sop-wash-bike
---
A bike runs its own steps. It never borrows the car steps, because the car steps include things a bike must never get: tire shine, full hose pressure, and the machine on the paint.

Stage the kit the same way as a car: one cart, bins by stage, nothing more than three steps away. The compressor matters more on a bike, because a bike dries with air, every crevice.
