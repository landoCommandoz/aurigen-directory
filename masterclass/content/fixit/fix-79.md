---
id: fix-79
type: fixnode
title: "Tesla: can I use compound on a Tesla?"
group: tesla
audience: [owner, crew]
visibility: internal
status: house
kbRef: "8.5"
tags: [tesla, model y, compound, test spot, ladder, warranty]
sayIt:
  - compound on a tesla
  - can I compound the tesla
  - tesla compound
  - tesla swirls won't come out
  - rung 3 on a tesla
  - maroon and compound on a tesla
  - ultimate compound tesla
  - tesla paint correction
  - is compound safe on a tesla
  - tesla warranty paint
sources:
  - label: Knowledge base 8.5, 7.3, 7.2, 2, and 11
    date: 2026-10-07
    note: Test spot on the worst panel (the hood on Lando's Model Y). Rungs 1 and 2 use M210. Rung 3, maroon + Ultimate Compound only at 100 µm or more, always followed by yellow + M210, one compound pass per section max. Paint color on the pad means stop. Glass roof skipped.
  - label: Knowledge base 7.2, Tesla Model Y readings
    date: 2026-10-06
    note: Model Y owners commonly measure about 4 to 6 mils (100 to 150 µm), highest on the hood. Owner reports, not a spec (fact-checker FC-73).
  - label: Tesla Model Y owner's manual, cleaning cautions
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Do not use cutting pastes, color restoration compounds, or polishes containing harsh abrasives. These can scour the surface and permanently damage the paint. Damage or discoloration from cleaning products is not covered by the warranty. Seen on the 2025 and newer Model Y manual and other Tesla manuals. Read through the search index. Fact-checker FC-16. FC-38 found the same lines in the 2020 to 2024 Model Y manual.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Pages 178 to 181, Cleaning. No chemical based wheel cleaners or pre-wash products. No cutting pastes, color restoration compounds, or polishes containing harsh abrasives. Damage or discoloration from cleaning products is not covered by the warranty. Also says an approved polish with a very mild abrasive may be used occasionally. Loaded directly. Fact-checker FC-38.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Motors Club forum, Tesla paint depth thread
    url: https://teslamotorsclub.com/tmc/threads/tesla-paint-depth-vs-other-cars.221821/
    date: 2026-10-11
    note: One owner's Model Y read about 4.03 to 5.92 mils, hood highest, rear quarters lowest. Forum, supporting only. Tesla publishes no paint thickness. Fact-checker FC-73.
stopIf:
  - Paint color on the pad. Stop now. You are through the clear.
  - "Under 100 µm: no compound on any car."
checks:
  - What does the panel read on the gauge?
  - Has the test spot run rungs 1 and 2?
  - Is it the glass roof? That is never polished.
causes:
  - Rungs 1 and 2 did not clear the swirls, so the next rung is compound.
  - The house ladder and Tesla's manual disagree on compound. Lando has not decided yet.
steps:
  - Run the test spot on the worst panel.
  - "Rung 1: polish the square with yellow + M210."
  - Wipe the square once.
  - Mist it with IPA and wipe it with a clean towel.
  - Check it with the light low.
  - "Rung 2: maroon + M210 on the same square."
  - text: "House rung 3: maroon + Ultimate Compound, only at 100 µm or more, always followed by yellow + M210."
    status: house
  - text: "Tesla's manual says: Do not use cutting pastes, color restoration compounds, or polishes containing harsh abrasives. These can scour the surface and permanently damage the paint."
    status: sourced
  - text: Tesla's manual says damage or discoloration from cleaning products is not covered by the warranty.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
stillHappening:
  - "Customer asks if the scratch comes out: open the customer scratch fix."
  - "Swirls still there: open the swirls still there fix."
notes:
  - One compound pass per section, max.
  - Show the customer both halves and re-quote before going past what was sold.
  - Write the winning combo on the job sheet.
  - text: Whether Tesla's line on harsh-abrasive polishes covers M210 is not checked.
    status: verify
  - On the Model Y the roof is glass. Skip it in the measure and polish routes.
  - text: On a Tesla Model Y, owners report about 4 to 6 mils (100 to 150 µm), highest on the hood. Tesla publishes no paint thickness.
    status: verify
  - text: Tesla's manual also says you can occasionally use an approved polish with a very mild abrasive, filling compounds, and wax.
    status: sourced
lessonId: lesson-l4-08-test-spot-ladder
productIds:
  - product-meguiars-ultimate-compound
  - product-meguiars-m210
equipmentIds:
  - equipment-pad-urotec-yellow
  - equipment-pad-urotec-maroon
related:
  - fix-10
  - fix-11
  - fix-55
  - fix-22
  - card-pad-ladder
  - card-tesla-wash-mode-tape
  - sop-test-spot-tesla
---
