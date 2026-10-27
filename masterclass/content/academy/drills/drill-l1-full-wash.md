---
id: drill-l1-full-wash
type: drill
title: Full wash and decon, timed by stage
audience:
  - owner
  - crew
visibility: internal
status: house
version: 2
kbRef: "17.2"
tags:
  - wash
  - decon
  - time
  - drill
  - level 1
synonyms:
  - full wash drill
  - whole wash practice
  - wash and decon run
  - timed wash
  - wash order drill
sources:
  - label: Tesla Model Y 2020 to 2024 owner's manual, Car Wash Mode
    url: https://www.tesla.com/ownersmanual/2020_2024_modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Controls > Service > Car Wash Mode; parked and not actively charging; what it turns off; turns off above 9 mph or on Exit. Software 2026.32 manual. Read through the search index. Fact-checker FC-13 and FC-14.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y owner's manual, cleaning cautions
    url: https://www.tesla.com/ownersmanual/modely/en_ae/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Do not use chemical based wheel cleaners or pre-wash products. These can damage the finish on the wheels. Read through the search index. Fact-checker FC-16, conflicting with the house wash; Lando decides.
  - label: Tesla Model Y 2020 to 2024 owner's manual, China edition, software 2026.26
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Cautions for exterior cleaning. Do not aim water hoses directly at windows, door or hood seals, electronic modules, or exposed cabling. Do not wash in direct sunlight. The FC-16 cautions are in this manual too. Read directly. Fact-checker FC-35 and FC-38.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Armor All product page, Extreme Wheel & Tire Cleaner
    url: https://armorall.com/product/extreme-wheel-tire-cleaner
    date: 2026-10-11
    note: One wheel at a time. Wear eye protection and rubber gloves. Wet and cool the wheel, let the foam work 30 seconds, rinse well. Fact-checker FC-26 and FC-27.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Meguiar's UK article, Heavy Duty Bug & Tar Remover
    url: https://www.meguiars.co.uk/showroom/introducing-meguiars-heavy-duty-bug-tar-remover/
    date: 2026-10-11
    note: Spray it on, let it soften the contaminants, then hose it off or wash over it. Works without scrubbing. Gives no dwell time. Fact-checker FC-44 and FC-45.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Utah Labor Commission, youth employment page
    url: https://laborcommission.utah.gov/divisions/utah-antidiscrimination-and-labor-uald/wage-claim/
    date: 2026-10-11
    note: The Labor Commission says minors may not work in hazardous occupations, including operating power equipment. DJ's age is not recorded. Who may run power tools is Lando's decision (pending). Fact-checker FC-107.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
needs:
  - A real car that is not a Tesla (see the Tesla rows)
  - The staged kit, with eye protection and rubber gloves in the Wheels bin
  - A timer, or the Job Runner's stage timers
instructions:
  - Set up from the staged kit.
  - text: Put on eye protection and rubber gloves for the wheels.
    status: sourced
  - text: Wheels and tires first, one wheel at a time, on a cool, wet wheel. Let the cleaner work 30 seconds.
    status: sourced
  - Pre-rinse on jet for 3 to 4 minutes, top down.
  - Foam Bug & Tar on the bugs and rocker tar.
  - text: Let it sit about one minute, or what the can says. The can wins.
    status: verify
  - text: Hose it off or wash over it. No scrubbing.
    status: sourced
  - Contact wash roof to rockers with the towel method.
  - Final rinse with the nozzle off.
  - Blow out the gaps with the compressor.
  - text: "Who may run power tools, the compressor included: Lando decides (pending)."
    status: verify
  - Dry with towels laid flat and pulled toward you.
  - Open every door and dry the jambs.
  - Bag test each panel, and clay the gritty ones.
  - Log your time for each stage.
  - Dump the buckets in a sink or a toilet, never the street.
  - text: "Clay before or after drying: the wash steps dry first, then clay; the time plan lists clay before the dry. Lando decides the house order (pending). Either order counts in this drill until he does."
    status: verify
  - text: On a Tesla, turn on Car Wash Mode before any water.
    status: sourced
  - text: "On a Tesla, the house wash is the same: Armor All Extreme Wheel & Tire on the wheels, the pre-rinse on jet, and Bug & Tar on bugs and tar."
    status: house
  - text: On a Tesla, Tesla's manual says do not use chemical-based wheel cleaners or pre-wash products.
    status: sourced
  - text: On a Tesla, Tesla's manual says do not aim a hose directly at windows, door or hood seals, electronic modules, or exposed cabling, and do not wash in direct sunlight.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending). Run this drill on a car that is not a Tesla until he does.
    status: verify
logField:
  label: Total wash and decon time
  unit: min
repsPerSession: 1
passMark:
  - Every stage done in order, with zero rule breaks.
  - Every stage time logged.
  - "Times logged against the plan, in minutes: wheels 25, pre-rinse and bugs 10, contact wash 30, rinse, dry, and jambs 20."
  - text: "Clay logged against the plan's 30 minutes for iron and clay. The plan names an iron remover the shop does not own yet, so this drill times clay only."
    status: verify
related:
  - lesson-l1-06-full-wash
  - card-setup-kit
  - sop-wash
  - sop-wash-tesla
  - sop-wheels
  - sop-dry
  - sop-clay
---
## Why

This is the whole wash in one run, timed by stage, so you see where your day goes. The first car runs long. Log the real times anyway.

Three lines changed after the fact-check. The wheel cleaner label sets the wait at 30 seconds and asks for eye protection and gloves. No label confirms the one-minute Bug & Tar wait, so the can wins. And who may run the compressor and other power tools is waiting on Lando.
