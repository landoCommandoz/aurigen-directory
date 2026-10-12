---
id: sop-tires-trim
type: sop
title: Tires and trim
stage: tires-trim
vehicleBranch: any
audience: [owner, crew]
visibility: internal
status: house
version: 2
kbRef: "9.2"
tags: [tires, tire shine, trim, dressing]
synonyms:
  - tire steps
  - dress the tires
  - put tire shine on
  - tire dressing
  - shine the tires
  - faded trim
  - trim steps
  - black the tires
sources:
  - label: Armor All product page, Extreme Tire Shine trigger spray
    url: https://armorall.com/product/extreme-tire-shine-spray
    date: 2026-10-11
    note: Spray evenly onto a clean, dry tire from 4 to 6 inches. Do not wipe. Keep it off clear plastic, glass, fabric, and paint. Dry at least 3 to 5 minutes. Fact-checker FC-28 and FC-29.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Armor All product page, Extreme Tire Shine aerosol
    url: https://armorall.com/product/extreme-tire-shine-aerosol
    date: 2026-10-11
    note: Spray evenly on a clean, dry tire from 8 to 12 inches. Do not wipe. Dry at least 5 minutes. Fact-checker FC-28 and FC-29.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Meguiar's safety data sheet, Hot Shine Tire Coating (High Gloss) G13815
    url: https://cdmsweb.3m.com/ingredientcommunication/file/Media/3D-RC8t5LUQ
    date: 2026-10-11
    note: Flammable aerosol. May burst if heated. Keep away from heat, hot surfaces, sparks, and open flames. Use only outdoors or in a well-ventilated area. Fact-checker FC-32. Hot Shine directions were not read (FC-31).
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
steps:
  - text: Check the paint is already polished, or that this job has no polish.
    stopIf: Polishing still to come on this car. No tire shine yet. Nothing slick goes on before correction.
  - text: Check the tire is completely dry.
    stopIf: The tire is still wet. Dry it first.
  - text: "House step: spray Armor All Extreme Tire Shine onto the applicator, not the tire."
    status: house
    notes:
      - text: "Armor All label: spray evenly onto a clean, dry tire from 4 to 6 inches (trigger) or 8 to 12 inches (aerosol). Do not wipe. Keep it off paint, glass, clear plastic, and fabric."
        status: sourced
      - text: Lando decides which method the crew uses (pending).
        status: verify
      - Meguiar's Hot Shine is the backup. Same house rule.
      - text: If your Hot Shine is an aerosol, it is flammable. Keep it away from the heat gun, hot surfaces, and sparks. Use it outdoors or where the air moves.
        status: sourced
  - text: Put on a thin, even coat.
    notes:
      - A thick coat slings black spots down the side on the first drive.
  - text: Wipe the rubber-to-wheel edge.
    status: house
  - text: Let it dry at least 3 to 5 minutes before the car moves.
    status: sourced
    notes:
      - text: That is the trigger spray label. The aerosol label says at least 5 minutes. Read which one you have.
        status: sourced
  - text: Look at the trim.
    notes:
      - Grey, faded trim needs a trim restorer, not tire dressing.
      - text: No trim restorer is in the kit yet. It is on the list of candidates to evaluate.
        status: verify
related:
  - product-armor-all-extreme-tire-shine
  - product-meguiars-hot-shine
  - card-stop-rules
  - sop-protect
  - sop-glass
---
Nothing slick goes on the car until the paint is polished: no tire shine, no trim dressing, no wax before correction. So on a polish job, tires come after the polish and the wax.

The tire must be completely dry. The house sprays the applicator, not the tire, and keeps the coat thin. A thick coat slings black spots down the side of the car on the first drive. Wipe the edge where the rubber meets the wheel.

The Armor All label says something different: spray the tire itself and do not wipe. It also says keep the spray off paint and glass, which is why the house sprays the applicator. Lando decides which method the crew uses. Until then, both lines show.

Let it dry at least 3 to 5 minutes before the car moves. That is the trigger spray label. The aerosol label says at least 5 minutes.

If the Hot Shine backup is an aerosol can, it is flammable. Keep it away from the heat gun, hot surfaces, and sparks.

Grey, faded trim needs a trim restorer, not tire dressing. No trim restorer is in the kit yet.
