---
id: fix-64
type: fixnode
title: Bugs still stuck after the wash
group: wash-dry
audience: [owner, crew]
visibility: internal
status: house
kbRef: "5.1"
tags: [bugs, bug and tar, front end, mirrors, dwell]
sayIt:
  - bugs won't come off
  - bugs still on the bumper
  - bug guts
  - bugs stuck on the front
  - dead bugs on the mirrors
  - bug splatter
  - bugs baked on
  - front end still buggy
  - can I scrub the bugs
  - bug and tar didn't work
sources:
  - label: Knowledge base 5.1, 3.3, 6, and 12.1
    date: 2026-10-07
    note: Pre-rinse first, nothing touches paint before it. Bug & Tar foam on bugs and rocker tar, one-minute dwell, then wash it off, no scrubbing. Front end and mirrors. Bag test, then clay what is gritty. On a bike, bug remover on a hot exhaust bakes on.
  - label: Meguiar's UK, Heavy Duty Bug & Tar Remover launch article
    url: https://www.meguiars.co.uk/showroom/introducing-meguiars-heavy-duty-bug-tar-remover/
    date: 2026-10-11
    note: Spray it on, wait and let it soften the contaminants, then hose it off or wash over it. Works without scrubbing. It gives no dwell time. Loaded directly. Fact-checker FC-44 and FC-45. The one-minute dwell is not confirmed; a UK retail label for a similar can says about 5 minutes.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - Never scrub bugs.
  - "On a bike: stone cold first. Bug remover on a hot exhaust bakes on."
checks:
  - "Bug & Tar: read the dwell time on your can. The label on the can beats this app."
  - Did the pre-rinse run 3 to 4 minutes first?
  - text: Did the Bug & Tar dwell one full minute?
    status: verify
  - Is it bugs, or tar on the rockers?
causes:
  - text: The Bug & Tar did not dwell the full minute.
    status: verify
  - Bug & Tar went on before the pre-rinse, or not at all.
  - Bug remains bonded to the paint. That is bonded contamination.
steps:
  - Pre-rinse first. Nothing touches the paint before it.
  - Foam Bug & Tar on the bugs.
  - text: Wait one minute.
    status: verify
  - text: Wash it off. No scrubbing.
    status: sourced
  - After the wash and dry, bag test that spot.
  - Gritty? Clay it.
stillHappening:
  - text: Still there after one round. A second round is not set in the knowledge base yet.
    status: verify
  - "Tar on the rockers that clay won't lift: open the clay won't take off the tar fix."
notes:
  - Bug & Tar is for the front end, the mirrors, and rocker tar, before washing.
  - The label on the bottle beats this app. If they disagree, open the label says something different fix.
  - text: "On a Tesla: whether Tesla's caution on pre-wash products covers Bug & Tar is not checked."
    status: verify
lessonId: lesson-l1-02-pre-rinse
productIds:
  - product-meguiars-bug-tar
equipmentIds:
  - equipment-clay-bar
related:
  - fix-14
  - fix-44
  - fix-45
  - sop-wash
  - term-dwell
  - term-bag-test
  - fix-80
---
