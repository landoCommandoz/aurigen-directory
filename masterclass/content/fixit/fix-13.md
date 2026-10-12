---
id: fix-13
type: fixnode
title: White residue on trim or badges
group: paint
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [trim, badges, emblems, tape, residue, tesla]
sayIt:
  - white residue
  - residue on the trim
  - polish on the trim
  - white stuff on the rubber
  - white marks on the badges
  - polish stuck in the emblems
  - trim turned white
  - chalky white trim
  - white crust in the gaps
  - polish dried on the plastic
sources:
  - label: Knowledge base 8.1 and 11
    date: 2026-10-07
    note: Tape rubber and plastic trim, emblems, and sharp body lines before polishing. On the Model Y, satin black window trim turns chalky white from polish. The chalky white part is not confirmed by any source (fact-checker FC-43).
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Chrome and metal surfaces, polish, abrasive cleaners, hand sanitizer, and hard cloths can damage the finish. Some cleaners and car shampoos can damage or discolor plastic trim, exterior lights, or camera lenses. Do not use highly alkaline or caustic cleaners. Do not use acidic products either. Cameras, one above the rear license plate, one in each door pillar, one on each front fender. Loaded directly. Fact-checker FC-40, FC-43, and FC-53.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2025 and newer owner's manual, China edition
    url: https://www.tesla.cn/ownersmanual/modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Adds a camera above the grille on the front bumper, with its own sprayer nozzle. Loaded directly. Fact-checker FC-40.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Meguiar's Ultimate Compound, G17216
    url: https://www.meguiars.com/products/automotive/paint/meguiars-ultimate-compound-g17216-152oz
    date: 2026-10-11
    note: Not for use on flat, matte, or satin finishes. Read through the search index. Fact-checker FC-43.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Meguiar's forum, removing wax from black trim
    url: https://www.meguiarsonline.com/forum/general-auto-detailing-discussion/detailing-101/9271-removing-wax-from-black-trim
    date: 2026-10-11
    note: Diluted all-purpose cleaner with a small brush. Forum, supporting only. The trim residue method stays unconfirmed (FC-53).
stopIf: []
checks:
  - Was the trim taped before you polished?
  - "On a Tesla: was the satin black window trim taped?"
causes:
  - Untaped trim.
  - On a Tesla, untaped satin black window trim.
  - text: Polish turns satin black trim chalky white.
    status: verify
  - text: Tesla's manual says polish, abrasive cleaners, and hard cloths can damage chrome and metal finishes.
    status: sourced
  - text: Meguiar's says Ultimate Compound is not for flat, matte, or satin finishes.
    status: sourced
steps:
  - Stop polishing near the trim.
  - Tape the trim before you go on.
  - Tape the emblems and badges.
  - text: Remove the residue with a soft brush and a trim-safe cleaner.
    status: verify
stillHappening:
  - "Tape left glue behind: open the tape residue fix."
  - "Trim is grey and faded, not white: open the faded trim fix."
notes:
  - "Tape before polishing: rubber and plastic trim, emblems, and sharp body lines."
  - Test cheap tape on scrap first. Beige tape can leave residue when it gets hot.
  - "On a Tesla, also tape the flush door handle edges, the badges, the black glass header, and the textured cladding on the wheel arches and lower bumper."
  - text: "On a 2020 to 2024 Model Y, tape the five body cameras: two B-pillar, two fender repeaters, one above the rear plate."
    status: sourced
  - text: On a 2025 or newer Model Y, there are six body cameras. Also tape the front bumper camera above the grille. It has its own washer nozzle.
    status: sourced
  - text: No trim-safe cleaner is named in the knowledge base yet. The house owns no all-purpose cleaner.
    status: verify
  - text: On a Tesla, the house residue step is the same soft brush and trim-safe cleaner.
    status: verify
  - text: Tesla's manual says some cleaners can damage or discolor plastic trim. It says no highly alkaline, caustic, or acidic products.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
lessonId: lesson-l4-05-edges-curves-heat
equipmentIds:
  - equipment-painters-tape
related:
  - card-tesla-wash-mode-tape
  - sop-tape
  - sop-tape-tesla
  - fix-39
  - fix-57
  - fix-06
---
