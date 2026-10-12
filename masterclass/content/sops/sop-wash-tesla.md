---
id: sop-wash-tesla
type: sop
title: Pre-rinse, bugs and tar, and the towel wash, Tesla
stage: wash
vehicleBranch: tesla
audience: [owner, crew]
visibility: internal
status: house
version: 2
kbRef: "5.1"
plannedMinutes: 40
tags: [wash, pre-rinse, bug and tar, towel method, tesla, model y, warranty]
synonyms:
  - tesla wash
  - wash the tesla
  - model y wash
  - tesla wash route
  - tesla pre soak
  - tesla bug and tar
sources:
  - label: Tesla Model Y owner's manual, wheel cleaner and pre-wash caution
    url: https://www.tesla.com/ownersmanual/modely/en_ae/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: No chemical-based wheel cleaners or pre-wash products. Same wording in the Model 3, S, X, and Cybertruck manuals. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y owner's manual, warranty line
    url: https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Damage or discoloration from cleaning products is not covered by the warranty. Read through the search index. Fact-checker FC-16.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Chemical Guys product page, Citrus Wash & Gloss
    url: https://www.chemicalguys.com/products/citrus-wash-and-gloss-concentrated-ultra-premium-hyper-wash-and-gloss
    date: 2026-10-10
    note: No pump sprayer, no pre-soak, and no dwell time on the page. Fact-checker FC-03.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Every FC-16 caution is in this manual, so it covers a 2022 Model Y. Cautions for exterior cleaning, do not aim water hoses directly at windows, door or hood seals, electronic modules, or exposed cabling; do not wash in direct sunlight; avoid tight-napped or rough cloths such as washing mitts, a high-quality microfiber cloth is recommended; do not use acidic products. Read directly. Fact-checker FC-34, FC-35, FC-38, FC-47.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Meguiar's UK article, Heavy Duty Bug & Tar Remover
    url: https://www.meguiars.co.uk/showroom/introducing-meguiars-heavy-duty-bug-tar-remover/
    date: 2026-10-11
    note: Spray it on, let it soften the contaminants, then hose it off or wash over it. Works without scrubbing. Gives no dwell time, so the one-minute dwell is unconfirmed. Fact-checker FC-44 and FC-45.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
steps:
  - text: Check Car Wash Mode is on.
    quickCardId: card-tesla-wash-mode-tape
  - text: Set the hose nozzle to jet.
  - text: "House step: pre-rinse the whole car, top down, for 3 to 4 minutes."
    status: house
    notes:
      - Nothing touches the paint before the pre-rinse is done.
      - text: Tesla's manual says do not aim a hose directly at windows, door or hood seals, electronic modules, or exposed cabling, and do not wash in direct sunlight.
        status: sourced
      - text: Lando decides how this applies to Teslas (pending).
        status: verify
      - text: "House plan for caked dirt: a pump-sprayer pre-soak. It is not settled and stays out of this SOP. Chemical Guys gives no pump-sprayer, pre-soak, or dwell-time direction for Citrus Wash & Gloss."
        status: verify
      - text: Tesla's manual says do not use chemical-based wheel cleaners or pre-wash products.
        status: sourced
      - text: Lando decides how this applies to Teslas (pending).
        status: verify
  - text: Give extra rinse to the bumpers, the rockers, and behind the wheels.
  - text: Foam Bug & Tar on the bugs and the rocker tar.
    notes:
      - "Where: the front end, the mirrors, and rocker tar."
      - text: Not checked yet whether Bug & Tar counts as a pre-wash product under Tesla's manual.
        status: verify
  - text: Let it sit about one minute so it softens the bugs and tar.
    status: verify
    timer: { kind: dwell, seconds: 60 }
    notes:
      - text: No label confirms one minute. Read the dwell time on your can. The can wins.
        status: verify
  - text: Wash it off or hose it off. Do not scrub.
    status: sourced
    stopIf: Still caked? Rinse longer. Never scrub harder.
  - text: Fold 16 microfiber towels in quarters.
    notes:
      - The towel method is the house wash on every car.
      - text: Tesla's manual says avoid tight-napped or rough cloths, such as washing mitts. It recommends a high-quality microfiber cloth.
        status: sourced
      - text: Lando decides how this applies to Teslas (pending). This covers the two-bucket mitt method on a Tesla.
        status: verify
  - text: Put all 16 in the bucket.
    quickCardId: card-bucket-mix
    notes:
      - "Polishing follows: the pre-polish mix. A maintenance wash: the maintenance mix."
      - text: Which mix a Wash & Ceramic Wax or a Full Detail without polish gets is not set yet.
        status: verify
      - "Never in this bucket: Ultimate Wash & Wax before polishing, dish soap, Spic and Span, wheel brushes, or the clay mitt."
  - text: Wash the Tesla route, one panel at a time.
    panelRoute: wash
    stopIf: A panel starts drying. Rinse it now.
    notes:
      - "Route: roof, windshield, rear glass, hood, liftgate, L fender, L front door, L rear door, L quarter, R quarter, R rear door, R front door, R fender, front bumper, rear bumper."
      - The roof is glass. It gets washed, never polished.
  - text: Lift a towel out dripping.
  - text: Squeeze it over the top edge of the panel.
  - text: Wipe in straight lines, front to back. Never circles.
  - text: Set the used towel aside. It never goes back in the bucket.
    notes:
      - Upper panels may share a towel on a fresh face.
      - Lower panels never share.
  - text: Do the rockers and mirrors last, then retire that towel.
  - text: Keep the whole car wet until the final rinse.
related:
  - card-tesla-wash-mode-tape
  - card-bucket-mix
  - card-maintenance-wash
  - product-meguiars-bug-tar
  - product-cg-citrus-wash-gloss
  - equipment-microfiber-towels
  - lesson-l1-02-pre-rinse
  - lesson-l1-03-towel-wash
  - sop-wash
  - sop-wheels-tesla
---
The Tesla wash is the regular hose-only wash on the Tesla route, with Car Wash Mode on the whole time.

Several things are not settled on a Tesla, and each carries an unverified badge until Lando decides.

- The pre-soak is out of every wash until a label or Chemical Guys covers it, and Tesla's manual also says no pre-wash products.
- Nobody has checked yet whether Bug & Tar counts as a pre-wash product under Tesla's manual. The one-minute wait is not confirmed by any label either.
- Tesla's manual says do not aim a hose straight at windows, door or hood seals, electronic modules, or exposed cabling. The house pre-rinse is on jet. The house shade rule already matches Tesla's line about direct sunlight.
- Tesla's manual says avoid washing mitts. The towel method fits that line. The two-bucket mitt method on a Tesla is Lando's call.
- Tesla's manual says do not use acidic products. Some water-spot removers are strong acids, and no remover is chosen yet.

These lines are all in the manual for the 2020 to 2024 Model Y, Lando's own car.

The roof is glass. Wash it. Never polish it.
