---
id: sop-tires-trim
type: sop
title: Tires and trim
stage: tires-trim
vehicleBranch: any
audience: [owner, crew]
visibility: internal
status: house
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
steps:
  - text: Check the paint is already polished, or that this job has no polish.
    stopIf: Polishing still to come on this car. No tire shine yet. Nothing slick goes on before correction.
  - text: Check the tire is completely dry.
    stopIf: The tire is still wet. Dry it first.
  - text: Spray Armor All Extreme Tire Shine onto the applicator, not the tire.
    notes:
      - Meguiar's Hot Shine is the backup. Same rule.
  - text: Put on a thin, even coat.
    notes:
      - A thick coat slings black spots down the side on the first drive.
  - text: Wipe the rubber-to-wheel edge.
  - text: Let it set a few minutes before the car moves.
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

The tire must be completely dry. Spray the applicator, not the tire, and keep the coat thin. A thick coat slings black spots down the side of the car on the first drive. Wipe the edge where the rubber meets the wheel, and let it set a few minutes before the car moves.

Grey, faded trim needs a trim restorer, not tire dressing. No trim restorer is in the kit yet.
