---
id: sop-setup-tesla
type: sop
title: Setup and kit staging, Tesla
stage: setup
vehicleBranch: tesla
audience: [owner, crew]
visibility: internal
status: house
kbRef: "18.3"
tags: [setup, staging, cart, tesla, model y, car wash mode]
synonyms:
  - tesla setup
  - set up for the tesla
  - model y setup
  - before washing the tesla
  - tesla wash mode first
  - stage the kit tesla
sources:
  - label: Tesla Model Y 2020 to 2024 owner's manual, Car Wash Mode
    url: https://www.tesla.com/ownersmanual/2020_2024_modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Menu path, what the mode does, parked and not charging, turns off above 9 mph or on Exit, and car wash damage is not covered by the warranty. Manual for software 2026.32. Read through the search index. Fact-checker FC-13 and FC-14.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
steps:
  - text: Turn on Car Wash Mode before any water touches the car.
    quickCardId: card-tesla-wash-mode-tape
    notes:
      - text: "Menu path on the 2020 to 2024 Model Y: Controls > Service > Car Wash Mode."
        status: sourced
      - text: The car must be parked and not charging.
        status: sourced
      - text: It closes all windows, locks the charge port, and turns off the wipers, Sentry Mode, walk-away door locking, and parking chimes.
        status: sourced
      - text: It turns off above 9 mph or when you touch Exit.
        status: sourced
      - text: Other model years and models may use a different path. Check each car.
        status: verify
  - text: Check the charge port door is closed.
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
  - card-tesla-wash-mode-tape
  - card-setup-kit
  - card-bucket-mix
  - card-ipa-wipe
  - equipment-microfiber-towels
  - equipment-air-compressor
  - lesson-l0-06-shop-setup
  - lesson-l1-06-full-wash
  - sop-setup
  - sop-wheels-tesla
---
The Tesla setup is the regular setup with Car Wash Mode first. Water on a Tesla without Car Wash Mode can drop windows, run the wipers, or fire Sentry. Tesla's manual says skipping it can damage the charge port or the wipers, and car wash damage is not covered by the warranty.

Turn it on before the first drop of water, and keep the charge port door closed for the whole job.
