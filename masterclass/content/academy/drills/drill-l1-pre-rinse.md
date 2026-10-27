---
id: drill-l1-pre-rinse
type: drill
title: Timed pre-rinse and Bug & Tar dwell
audience:
  - owner
  - crew
visibility: internal
status: house
version: 2
kbRef: "5.1"
tags:
  - pre-rinse
  - bugs
  - drill
  - level 1
synonyms:
  - pre rinse drill
  - timed rinse
  - rinse practice
  - bug and tar drill
  - dwell timer practice
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
  - label: Meguiar's UK article, Heavy Duty Bug & Tar Remover
    url: https://www.meguiars.co.uk/showroom/introducing-meguiars-heavy-duty-bug-tar-remover/
    date: 2026-10-11
    note: Spray it on, let it soften the contaminants, then hose it off or wash over it. Works without scrubbing. Gives no dwell time, so the one-minute dwell stays unconfirmed. Fact-checker FC-44 and FC-45.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
needs:
  - A car that is not a Tesla (see the Tesla rows)
  - The hose with a jet nozzle
  - Meguiar's Bug & Tar
  - A timer
  - A car with bugs on the front or tar on the rockers
instructions:
  - text: "On a Tesla, turn on Car Wash Mode before any water: Controls > Service > Car Wash Mode, parked and not charging."
    status: sourced
  - Set the nozzle to jet.
  - Start the timer.
  - Rinse top down.
  - Give extra rinse to the bumpers, the rockers, and behind the wheels.
  - Stop at 3 to 4 minutes by the timer.
  - Touch nothing to the paint until the rinse is done.
  - Foam Bug & Tar on the bugs and the rocker tar.
  - text: Read the dwell time on the can.
    status: verify
  - text: Start the timer again. Let it sit about one minute, or what the can says. The can wins.
    status: verify
  - text: Hose it off or wash over it. Do not scrub.
    status: sourced
  - Write your rinse time down.
  - text: Leave the pump-sprayer pre-soak out. It is not confirmed (pending).
    status: verify
  - text: "On a Tesla, the house pre-rinse is the same: jet, 3 to 4 minutes, top down. Then Bug & Tar the same way."
    status: house
  - text: On a Tesla, Tesla's manual says do not aim a hose directly at windows, door or hood seals, electronic modules, or exposed cabling, and do not wash in direct sunlight.
    status: sourced
  - text: On a Tesla, Tesla's manual says do not use chemical-based wheel cleaners or pre-wash products.
    status: sourced
  - text: Nobody has checked yet whether Bug & Tar counts as a pre-wash product under Tesla's manual.
    status: verify
  - text: Lando decides how this applies to Teslas (pending). Run this drill on a car that is not a Tesla until he does.
    status: verify
logField:
  label: Pre-rinse time
  unit: min
repsPerSession: 1
passMark:
  - Pre-rinse ran 3 to 4 minutes on jet, top down, by the timer.
  - Bumpers, rockers, and behind the wheels got extra rinse.
  - Nothing touched the paint before the rinse was done.
  - text: Bug & Tar came off with the hose or a wash, with no scrubbing.
    status: sourced
  - text: Bug & Tar sat about one minute, or the time on the can.
    status: verify
related:
  - lesson-l1-02-pre-rinse
  - product-meguiars-bug-tar
  - term-dwell
  - sop-wash
  - sop-wash-tesla
---
## Why

Nothing touches the paint until the rinse has carried off the loose grit. The timer makes 3 to 4 minutes real.

Meguiar's says Bug & Tar works without scrubbing: spray it on, let it soften, then hose it off or wash over it. Meguiar's gives no wait time, so the one-minute dwell is a house number with an unverified badge. The can in your hand wins.
