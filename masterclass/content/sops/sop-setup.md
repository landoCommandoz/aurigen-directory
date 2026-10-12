---
id: sop-setup
type: sop
title: Setup and kit staging
stage: setup
vehicleBranch: any
audience: [owner, crew]
visibility: internal
status: house
kbRef: "18.3"
tags: [setup, staging, cart, bins, night before]
synonyms:
  - setup steps
  - set up the job
  - stage the kit
  - get the cart ready
  - morning setup
  - staging the cart
  - what do I set out
  - setup checklist
steps:
  - text: Roll the cart or bin set to the back corner of the car.
    timer: { kind: setup, seconds: 900 }
    quickCardId: card-setup-kit
    notes:
      - text: "Setup target: 15 minutes, timed in the app. It is a proposal Lando has not accepted yet."
        status: verify
  - text: "Set the bins out by stage: Wheels, Wash, Clay, Polish, Protect, Interior, Glass, Cleanup."
  - text: Check that nothing is more than three steps away.
  - text: Have the wash bucket mixed, or measured out.
    quickCardId: card-bucket-mix
  - text: Count the towels into piles.
    notes:
      - "Per full detail: drying 2, polish removal 6 to 8, wax 4, interior 6, glass 4, wheels and jambs 4. Call it 24 to 30."
      - Add 16 wash towels for the towel method.
      - The wheel pile never rejoins the paint pile.
  - text: Check the pads are clean and dry.
    notes:
      - "One-step: 2 to 3 finishing or polishing pads per car."
  - text: Fill the IPA bottle and label it.
    quickCardId: card-ipa-wipe
    notes:
      - text: The IPA mix on the card is not confirmed yet. No maker sets a panel-wipe strength.
        status: verify
  - text: Put the tape in your pocket.
  - text: Charge the compressor.
  - text: Run the cords.
related:
  - card-setup-kit
  - card-bucket-mix
  - card-ipa-wipe
  - equipment-microfiber-towels
  - equipment-air-compressor
  - equipment-painters-tape
  - equipment-zep-pump-sprayer
  - lesson-l0-06-shop-setup
  - sop-setup-tesla
  - sop-cleanup
---
Setup is where the time went on Oct 7. Most of the day went to setup, the interior got cut, and you still ran out of time. The fix is the same kit in the same place every time.

Everything lives on one cart or bin set at the back corner of the car, never more than three steps away. Most of this list gets done the night before: bucket mixed or measured, towels counted, pads clean and dry, IPA bottle filled and labeled, tape in your pocket, compressor charged, cords run. Then the morning is a check, not a hunt.
