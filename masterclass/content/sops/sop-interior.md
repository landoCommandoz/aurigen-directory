---
id: sop-interior
type: sop
title: Interior, top down, glass last
stage: interior
vehicleBranch: any
audience: [owner, crew]
visibility: internal
status: house
version: 2
kbRef: "10"
plannedMinutes: 65
tags: [interior, vacuum, wipe, dash, mats, glass]
synonyms:
  - interior steps
  - do the inside
  - clean the interior
  - interior order
  - vacuum the car
  - wipe the dash
  - inside of the car
  - interior detail
sources:
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Interior, no solvents (including alcohol), hand sanitizer, bleach, citrus, naphtha, or silicone-based products. Seats, warm water and mild soap on a soft cloth, wipe dry, nothing more; no conditioners or protectants; never spray the seat directly. Interior lights, no soap or chemical cleaners. Touchscreen, a soft lint-free display cloth, no cleaners, no wet wipes, no dry statically-charged cloth such as a recently washed microfiber; Screen Clean Mode is under Controls, Display. Read directly. Fact-checker FC-36 and FC-37.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Verification log FC-75 and FC-80
    date: 2026-10-11
    note: Meguiar's own page for Quik Interior Detailer could not be read, so it is not confirmed screen-safe. No all-purpose cleaner is chosen, so no APC ratio is settled.
steps:
  - text: "Take everything out: trash, mats, car seats, and loose items."
  - text: Put the customer's personal items in one bag they can see.
    notes:
      - Money or valuables go on the dash, and you say something.
  - text: Hose, brush, and rinse the mats.
    notes:
      - text: "No mat cleaner is set. An all-purpose cleaner at 4:1 for floor mats is only if one is bought, and only as its label says."
        status: verify
  - text: Stand the mats in the sun.
  - text: "Knock it down from the top: headliner, vents, seams, and seat rails."
  - text: "Pet hair: pull it with the Analan rubber tool before you vacuum."
    notes:
      - Rubber tool or pumice first, then vacuum. Three passes minimum.
      - Pet hair is quoted separately.
  - text: Clean the cup holders and seams with the Dremel Versa bristle pad.
  - text: "Vacuum top down: seats, under the seats, carpet, then the trunk."
  - text: Slide the seats forward, then back, to vacuum under them.
  - text: Wipe the hard surfaces top down with Quik Interior Detailer sprayed on the towel.
    notes:
      - Spray the towel, never the panel. Overspray lands on glass and screens.
      - text: Quik Interior Detailer is not confirmed screen-safe by Meguiar's.
        status: verify
      - text: On a Tesla, Tesla's manual says no solvents (including alcohol), hand sanitizer, bleach, citrus, naphtha, or silicone-based products on interior parts. Interior lights get a cloth with warm water only.
        status: sourced
      - text: Lando decides how this applies to Teslas (pending). Nobody has checked what Quik Interior Detailer contains.
        status: verify
  - text: Clean the screens with a dry microfiber or a screen-safe cleaner only.
    notes:
      - text: "On a Tesla, Tesla's manual says turn on Screen Clean Mode (Controls > Display > Screen Clean Mode). Use a soft lint-free cloth made for displays. No cleaners such as glass cleaner, no hand sanitizer, no wet wipes, and no dry statically-charged cloth such as a recently washed microfiber."
        status: sourced
      - text: Lando decides how this applies to Teslas (pending).
        status: verify
  - text: Blot the headliner with a barely damp towel.
    notes:
      - Blot only. Soak it and the glue lets go.
  - text: Clean the steering wheel and pedals and leave them dry, with zero slick.
  - text: Look for spots.
    notes:
      - text: No spot method or product is set yet. Do not guess at a product.
        status: verify
  - text: Dress the plastics matte.
    notes:
      - Nothing shiny on the dash. It glares in the windshield. If it looks wet, you used too much.
      - text: The knowledge base names no interior dressing product yet.
        status: verify
  - text: "Leather: cleaner, then conditioner."
    status: verify
    notes:
      - text: Which leather products are in the kit is not confirmed.
        status: verify
      - text: On a Tesla, Tesla's manual says seats get warm water and mild soap on a microfiber, then a dry wipe. No conditioners or protectants. Never spray the seat directly.
        status: sourced
      - text: Lando decides how this applies to Teslas (pending).
        status: verify
  - text: Grab two clean glass towels for the inside glass, one wet and one dry.
    notes:
      - Never a towel that touched wax or polish.
  - text: Wipe the inside glass side to side.
    panelRoute: glass
  - text: Clean the windshield from the passenger seat to reach the far corner.
  - text: Drop each window 1 to 2 inches and clean the top edge.
  - text: "Wet carpet: crack the windows or run the fan before handoff."
related:
  - product-meguiars-quik-interior-detailer
  - equipment-shop-vac
  - equipment-analan-rubber-tool
  - equipment-dremel-versa
  - equipment-microfiber-towels
  - lesson-l2-01-interior-order
  - lesson-l2-02-knock-down-vacuum
  - lesson-l2-03-wipe-dress
  - lesson-l2-04-pet-hair-spots
  - lesson-l2-05-glass
  - lesson-l2-06-full-interior
  - sop-glass
---
The interior runs in one order every time: everything out, mats, knock it down from the top, vacuum top down, wipe hard surfaces top down, spots, dress the plastics matte, then glass last.

Spray the towel, never the panel: overspray lands on the glass and the screens. Nothing shiny on the dash, because it glares in the windshield. The headliner gets a barely damp towel and a blot, because a soaked headliner lets go of its glue. The steering wheel and pedals end clean, dry, and with zero slick.

The customer's things go in one bag they can see. Money or valuables go on the dash, and you tell them.

A clean daily driver takes about 1 hr 5 min inside. A family car with pet hair, crumbs, and stains takes 2 hrs or more. Interiors are priced by condition, so look in the back seat before you quote.

The spot method, the interior dressing, and the leather products are not set yet. They show as unverified until Lando names them.

On a Tesla, Tesla's manual is stricter than this SOP. It says no alcohol, citrus, or silicone-based products inside, soap and water only on the seats with no conditioner, and no cleaners on the touchscreen, not even a freshly washed dry microfiber. Lando decides how each of these applies to Teslas. Until then, the Tesla lines show next to the house steps.
