---
id: fix-68
type: fixnode
title: Smudges or overspray on the screen or the inside glass
group: interior
audience: [owner, crew]
visibility: internal
status: house
kbRef: "10"
tags: [interior, screens, overspray, glass, touchscreen]
sayIt:
  - smudges on the screen
  - overspray on the screen
  - touchscreen is smeared
  - screen has streaks
  - sprayed the screen
  - spray got on the windshield
  - inside glass has overspray
  - fingerprints on the screen
  - tesla screen smudged
  - mist on the inside of the windows
  - tesla screen
  - clean the tesla touchscreen
  - screen clean mode
sources:
  - label: Knowledge base 10 and 9.3
    date: 2026-10-07
    note: Spray the towel, never the panel; overspray lands on glass and screens. Screens get a dry microfiber or a screen-safe cleaner only. Glass is last, with two towels; inside side to side.
  - label: Tesla Model Y 2020 to 2024 owner's manual, Touchscreen
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Use a soft lint-free cloth made to clean monitors and displays. Do not use cleaners such as glass cleaner, alcohol-based gel products such as hand sanitizer, a wet wipe, or a dry statically-charged cloth such as a recently washed microfiber. Screen Clean Mode is at Controls > Display > Screen Clean Mode. Statically-charged materials can damage the touchscreen. Loaded directly. Fact-checker FC-36.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - text: "Screens: a dry microfiber or a screen-safe cleaner only. Nothing else."
    status: house
  - text: "On a Tesla touchscreen: turn on Screen Clean Mode (Controls > Display > Screen Clean Mode). Use a soft lint-free cloth made for displays."
    status: sourced
  - text: On a Tesla touchscreen, Tesla's manual says no cleaners such as glass cleaner, no hand sanitizer, no wet wipes, and no dry statically-charged cloth such as a recently washed microfiber.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
checks:
  - Did you spray the panel or the towel?
  - Is the glass done yet? Glass comes last.
causes:
  - Product sprayed straight on the panel. Overspray lands on glass and screens.
  - Glass done before the wipe-down, so it got hit again.
steps:
  - Stop spraying the panels.
  - text: Wipe the screen with a dry microfiber.
    status: house
  - Spray the towel from now on, never the panel.
  - Leave the inside glass for last.
  - Clean the inside glass with two towels, one wet and one dry.
  - Wipe the inside glass side to side.
stillHappening:
  - "Streaks on the glass: open the glass streaks fix."
  - "Dash looks greasy or shiny: open the greasy dash fix."
notes:
  - text: No screen-safe cleaner is named in the kit yet.
    status: verify
lessonId: lesson-l2-03-wipe-dress
productIds:
  - product-meguiars-quik-interior-detailer
equipmentIds:
  - equipment-microfiber-towels
related:
  - fix-19
  - fix-32
  - sop-interior
  - sop-glass
---
