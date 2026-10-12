---
id: fix-81
type: fixnode
title: "Tesla: polish near the glass roof, cameras, or satin trim"
group: tesla
audience: [owner, crew]
visibility: internal
status: house
kbRef: "11"
tags: [tesla, model y, glass roof, cameras, satin trim, tape]
sayIt:
  - tesla roof
  - glass roof
  - do I polish the tesla roof
  - polish on the tesla camera
  - camera covered in polish
  - satin trim turned white
  - window trim went chalky
  - tesla door handles
  - what do I tape on a tesla
  - tesla badges
  - black glass header
  - tesla camera lens
  - polish on the camera lens
sources:
  - label: Knowledge base 11 and 8.3
    date: 2026-10-07
    note: The roof is glass, skipped in the measure and polish routes; washed, not polished. Tape the satin black window trim (polish turns it chalky white), flush door handle edges, the five cameras, badges, the black glass header, and the textured cladding. Camera lenses get glass cleaner only. Trigger off with the pad still on the paint, then lift. The chalky white part is not confirmed by any source (fact-checker FC-43).
  - label: Tesla Model Y 2020 to 2024 owner's manual, US page, Cleaning a Camera
    url: https://www.tesla.com/ownersmanual/2020_2024_modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-11
    note: Vehicles built in Fremont or Gigafactory Austin before about late May 2023, spray water on the lens and do not wipe it with your hands or a cloth. Later builds, spray water and dry with a microfiber cloth. Read through the search index. Fact-checker FC-33.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Page 178, Cleaning a Camera. Do not use chemical-based or abrasive cleaners; doing so can damage the surface of the lens. Cameras, one above the rear license plate, one in each door pillar, one on each front fender, three behind the windshield. Chrome and metal surfaces, polish, abrasive cleaners, and hard cloths can damage the finish. Loaded directly. Fact-checker FC-33, FC-40, and FC-43.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2025 and newer owner's manual, China edition
    url: https://www.tesla.cn/ownersmanual/modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Adds a camera above the grille on the front bumper, with a sprayer nozzle. Clean it from the Camera app with the spray icon. Loaded directly. Fact-checker FC-40.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Meguiar's Ultimate Compound, G17216
    url: https://www.meguiars.com/products/automotive/paint/meguiars-ultimate-compound-g17216-152oz
    date: 2026-10-11
    note: Not for use on flat, matte, or satin finishes. Read through the search index. Fact-checker FC-43.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - The roof is glass. Never polish it.
  - Untaped camera or satin trim near the pad? Stop and tape it first.
checks:
  - Are the satin black window trim, door handle edges, cameras, badges, glass header, and cladding taped?
  - Is the pad near the roof glass?
causes:
  - Trim or cameras were not taped before polishing.
  - The glass roof was put in the polish route.
steps:
  - Let go of the trigger with the pad still on the paint.
  - Lift the pad.
  - Tape the satin black window trim.
  - Tape the flush door handle edges.
  - text: "On a 2020 to 2024 Model Y, tape all five body cameras: two B-pillar, two fender repeaters, one above the rear plate."
    status: sourced
  - text: On a 2025 or newer Model Y, also tape the front bumper camera above the grille. It has its own washer nozzle.
    status: sourced
  - Tape the badges.
  - Tape the black glass header.
  - Tape the textured cladding on the wheel arches and the lower bumper.
  - text: Polish on a camera lens? The house rule is glass cleaner only.
    status: house
  - text: Tesla's manual says spray water on the lens. Never use chemical-based or abrasive cleaners on a lens.
    status: sourced
  - text: On a 2020 to 2024 Model Y built before about late May 2023 in Fremont or Austin, Tesla says never wipe the lens with a hand or a cloth. On later cars, dry it with a microfiber cloth.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
  - Take the roof out of the polish route. Wash it only.
stillHappening:
  - "Trim already turned white: open the white residue on trim fix."
  - "Tape left glue behind: open the tape residue fix."
notes:
  - "Polish route: hood first, liftgate, L fender, L doors, L quarter, R quarter, R doors, R fender, bumpers last. No roof, no glass."
  - text: No glass cleaner product is named in the knowledge base.
    status: verify
  - text: Other Tesla models have different cameras and trim. Check each car.
    status: verify
  - text: Polish turns satin black trim chalky white.
    status: verify
  - text: Tesla's manual says polish, abrasive cleaners, and hard cloths can damage chrome and metal finishes. Meguiar's says Ultimate Compound is not for satin finishes.
    status: sourced
  - text: A 2022 Model Y falls in the camera no-wipe group unless its build date says otherwise. The build month is on the driver door jamb label.
    status: verify
lessonId: lesson-l4-05-edges-curves-heat
equipmentIds:
  - equipment-painters-tape
  - equipment-bauer-56367
related:
  - card-tesla-wash-mode-tape
  - sop-tape-tesla
  - sop-polish-tesla
  - sop-measure-tesla
  - fix-13
  - fix-39
  - fix-21
---
