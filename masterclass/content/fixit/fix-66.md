---
id: fix-66
type: fixnode
title: "Foam cannon won't work: no pressure washer"
group: wash-dry
audience: [owner, crew]
visibility: internal
status: house
kbRef: "3.1"
tags: [foam cannon, pressure washer, pre-soak, pre-rinse]
sayIt:
  - foam cannon
  - foam cannon won't work
  - snow foam
  - no pressure washer
  - can I foam the car
  - foam it first
  - pre-soak with the foam cannon
  - hook up the foam cannon
  - need more suds
  - foam gun on the hose
sources:
  - label: Knowledge base 3.1, 3.5, 5.1, 5.3, and 23
    date: 2026-10-07
    note: The foam cannon is useless until there is a pressure washer. A pressure washer is the first purchase from revenue; check the foam cannon fitting matches before buying. The foam cannon pre-soak is superseded; the pump-sprayer pre-soak is not confirmed.
  - label: Meguiar's UK, Heavy Duty Bug & Tar Remover launch article
    url: https://www.meguiars.co.uk/showroom/introducing-meguiars-heavy-duty-bug-tar-remover/
    date: 2026-10-11
    note: Spray it on, wait and let it soften the contaminants, then hose it off or wash over it. Works without scrubbing. It gives no dwell time. Loaded directly. Fact-checker FC-44 and FC-45. The one-minute dwell is not confirmed; a UK retail label for a similar can says about 5 minutes.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
  - label: Tesla Model Y 2020 to 2024 owner's manual, exterior cleaning cautions
    url: https://www.tesla.cn/ownersmanual/2020_2024_modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Do not aim water hoses directly at windows, door, or hood seals or at electronic modules or exposed cabling. Do not wash in direct sunlight. Damage caused by improper washing is not covered by the warranty. Loaded directly. Fact-checker FC-35.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf: []
checks:
  - "Bug & Tar: read the dwell time on your can. The label on the can beats this app."
  - Is there a pressure washer? Not yet.
causes:
  - The foam cannon needs a pressure washer. There is not one yet.
steps:
  - Leave the foam cannon on the shelf.
  - Pre-rinse on jet for 3 to 4 minutes, top down.
  - Give the bumpers, rockers, and behind the wheels extra time.
  - Foam Bug & Tar on the bugs and rocker tar.
  - text: Wait one minute.
    status: verify
  - text: Wash it off. No scrubbing.
    status: sourced
  - Start the contact wash, roof to rockers.
stillHappening:
  - "Caked dirt still on after the wash: open the dirt still on the paint fix."
notes:
  - The pressure washer is the first purchase from revenue.
  - Before buying it, check the foam cannon fitting matches.
  - text: "A pump-sprayer pre-soak on caked dirt is a house plan. The method and the product are not confirmed, so it is not a step yet."
    status: verify
  - "On a Tesla: open the Tesla wheel cleaner or pre-soak fix."
  - text: "On a Tesla, the house pre-rinse is the same: jet 3 to 4 minutes, top down."
    status: house
  - text: Tesla's manual says do not aim a hose directly at windows, door or hood seals, electronic modules, or exposed cabling, and do not wash in direct sunlight.
    status: sourced
  - text: Lando decides how this applies to Teslas (pending).
    status: verify
lessonId: lesson-l1-02-pre-rinse
productIds:
  - product-meguiars-bug-tar
equipmentIds:
  - equipment-foam-cannon
related:
  - fix-14
  - fix-78
  - sop-wash
  - term-dwell
---
