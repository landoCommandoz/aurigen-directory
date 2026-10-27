---
id: sop-wash
type: sop
title: Pre-rinse, bugs and tar, and the towel wash
stage: wash
vehicleBranch: any
audience: [owner, crew]
visibility: internal
status: house
version: 2
kbRef: "5.1"
plannedMinutes: 40
tags: [wash, pre-rinse, bug and tar, towel method, hose only]
synonyms:
  - wash steps
  - pre rinse
  - rinse first
  - bugs and tar
  - contact wash
  - towel method
  - wash the car
  - hand wash order
  - how do I wash it
sources:
  - label: Chemical Guys product page, Citrus Wash & Gloss
    url: https://www.chemicalguys.com/products/citrus-wash-and-gloss-concentrated-ultra-premium-hyper-wash-and-gloss
    date: 2026-10-10
    note: No pump sprayer, no pre-soak, and no dwell time on the page. Fact-checker FC-03.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Meguiar's UK article, Heavy Duty Bug & Tar Remover
    url: https://www.meguiars.co.uk/showroom/introducing-meguiars-heavy-duty-bug-tar-remover/
    date: 2026-10-11
    note: Spray it on, let it soften the contaminants, then hose it off or wash over it. Works without scrubbing. Gives no dwell time, so the one-minute dwell is unconfirmed. Fact-checker FC-44 and FC-45.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Armor All product page, Extreme Wheel & Tire Cleaner
    url: https://armorall.com/product/extreme-wheel-tire-cleaner
    date: 2026-10-11
    note: Do not allow wash water to enter storm drains, streams, or lakes. Fact-checker FC-91.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
steps:
  - text: Set the hose nozzle to jet.
  - text: Pre-rinse the whole car, top down, for 3 to 4 minutes.
    notes:
      - Nothing touches the paint before the pre-rinse is done.
      - Keep the wash water out of storm drains.
      - text: Armor All's wheel cleaner label says do not let wash water reach storm drains, streams, or lakes.
        status: sourced
      - text: "Pre-soak for caked dirt: not settled. Chemical Guys gives no pump-sprayer, pre-soak, or dwell-time direction for Citrus Wash & Gloss, so it stays out of this SOP until a label or a Chemical Guys answer covers it."
        status: verify
  - text: Give extra rinse to the bumpers, the rockers, and behind the wheels.
  - text: Foam Bug & Tar on the bugs and the rocker tar.
    notes:
      - "Where: the front end, the mirrors, and rocker tar."
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
  - text: Put all 16 in the bucket.
    quickCardId: card-bucket-mix
    notes:
      - "Polishing follows: the pre-polish mix. A maintenance wash: the maintenance mix."
      - text: Which mix a Wash & Ceramic Wax or a Full Detail without polish gets is not set yet.
        status: verify
      - "Never in this bucket: Ultimate Wash & Wax before polishing, dish soap, Spic and Span, wheel brushes, or the clay mitt."
  - text: Start at the roof. Work roof to rockers, one panel at a time.
    panelRoute: wash
    stopIf: A panel starts drying. Rinse it now.
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
  - card-bucket-mix
  - card-maintenance-wash
  - product-meguiars-bug-tar
  - product-cg-citrus-wash-gloss
  - equipment-microfiber-towels
  - term-dwell
  - term-strip-wash
  - lesson-l1-02-pre-rinse
  - lesson-l1-03-towel-wash
  - sop-wheels
  - sop-dry
  - sop-wash-tesla
---
This is the hose-only wash: no pressure washer, and the foam cannon is useless until there is one. Give the pre-rinse the full 3 to 4 minutes before anything touches the paint.

The towel method keeps a used towel out of the bucket. Each towel goes in clean, comes out dripping, and never goes back in. Upper panels may share a towel on a fresh face. Lower panels never share. The rockers and mirrors come last, and that towel retires.

The pre-soak for caked dirt is not part of this wash yet. The house plan is a pump-sprayer pre-wash, but no label or Chemical Guys direction covers it, so it waits. If a car is still caked after the pre-rinse, rinse longer. Never scrub harder.

The alternative is the two-bucket wash: a mitt and two grit guards, rinse the mitt after every panel, and a dropped mitt is done for the day. Break a new mitt in with soapy water on the windshield for a minute or two. On a Tesla, use the Tesla wash instead: Tesla's manual says avoid washing mitts, and Lando decides how that applies (pending).

Meguiar's says Bug & Tar softens bugs and tar and comes off with a rinse or a wash, no scrubbing. The one-minute wait is a house number that no label confirms yet, so the can wins.

Keep the wash water out of storm drains. Armor All's wheel cleaner label says the same.

The time plan for a full detail gives the pre-rinse and bugs 10 minutes and the contact wash 30.
