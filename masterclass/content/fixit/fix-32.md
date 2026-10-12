---
id: fix-32
type: fixnode
title: Dash looks greasy or shiny
group: interior
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [interior, dash, dressing, glare, matte]
sayIt:
  - dash greasy
  - dash is shiny
  - shiny dash
  - greasy dashboard
  - glare on the windshield
  - dash looks wet
  - too much dressing
  - oily dash
  - dash reflects in the windshield
  - streaky dash
  - dash feels sticky
  - dash is all shiny
  - dash is all greasy
sources:
  - label: Knowledge base 10 and 21
    date: 2026-10-07
    note: Spray the towel, never the panel. Nothing shiny on the dash; it glares in the windshield; if it looks wet you used too much. Dress plastics matte. Screens get a dry microfiber or a screen-safe cleaner only.
  - label: Tesla Model Y 2020 to 2024 owner's manual, Touchscreen
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Use a soft lint-free cloth made to clean monitors and displays. Do not use cleaners such as glass cleaner, alcohol-based gel products such as hand sanitizer, a wet wipe, or a dry statically-charged cloth such as a recently washed microfiber. Screen Clean Mode is at Controls > Display > Screen Clean Mode. Statically-charged materials can damage the touchscreen. Loaded directly. Fact-checker FC-36.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - text: "Screens: a dry microfiber or a screen-safe cleaner only."
    status: house
  - text: "On a Tesla touchscreen: turn on Screen Clean Mode (Controls > Display > Screen Clean Mode). Use a soft lint-free cloth made for displays."
    status: sourced
  - text: On a Tesla touchscreen, Tesla's manual says no cleaners such as glass cleaner, no hand sanitizer, no wet wipes, and no dry statically-charged cloth such as a recently washed microfiber.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
checks:
  - Does it look wet?
  - Did you spray the dash or the towel?
  - Is there glare in the windshield?
causes:
  - Too much product.
  - Sprayed on the dash, not on the towel.
steps:
  - Wipe the dash with a clean, damp towel.
  - Dry it with a clean, dry towel.
  - Sit in the driver's seat and check the windshield for glare.
  - Next time, spray the towel, never the dash.
stillHappening:
  - "Overspray on the screen or the glass: open the smudges on the screen fix."
  - "Wheel or pedals feel slick: open the slick steering wheel fix."
notes:
  - Nothing shiny on the dash. It glares in the windshield.
  - If it looks wet, you used too much.
  - Dress plastics matte.
  - text: The knowledge base names no interior dressing product yet.
    status: verify
lessonId: lesson-l2-03-wipe-dress
productIds:
  - product-meguiars-quik-interior-detailer
equipmentIds:
  - equipment-microfiber-towels
related:
  - fix-68
  - fix-70
  - sop-interior
---
