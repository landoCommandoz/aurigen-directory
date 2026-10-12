---
id: fix-62
type: fixnode
title: A dirty towel went back in the wash bucket
group: wash-dry
audience: [owner, crew]
visibility: internal
status: house
kbRef: "5.2"
tags: [wash, towel method, bucket, contamination]
sayIt:
  - dirty towel in the bucket
  - put a used towel back in the bucket
  - dunked a dirty towel
  - towel went back in the bucket
  - reused a wash towel
  - same towel on the rockers and the hood
  - lower panel towel on the roof
  - dropped a wash towel
  - towel touched the ground
  - ran out of wash towels
sources:
  - label: Knowledge base 5.2, towel method
    date: 2026-10-07
    note: 16 towels, one per panel, folded in quarters. Squeeze over the panel's top edge, straight lines front to back, never circles. A used towel never goes back in the bucket. Upper panels may share on a fresh face; lower panels never share; rockers and mirrors last, then retire that towel. The booklet's mitt rule says a dropped mitt is done for the day.
stopIf:
  - A used towel never goes back in the bucket.
checks:
  - Which towel went back in, and from which panel?
  - Did a lower panel towel touch an upper panel?
  - How many clean towels are left?
causes:
  - Not enough towels counted out, so a used one got reached for.
  - Lost track of which towel was clean.
  - A lower panel towel was used up high.
steps:
  - Pull that towel out.
  - Put it in the water-only laundry pile.
  - text: Dump the bucket and mix a new one.
    status: verify
  - Grab a fresh towel for each panel.
  - Fold it in quarters.
  - Lift it out dripping and squeeze it over the panel's top edge.
  - Wipe in straight lines, front to back. Never circles.
  - Do the rockers and mirrors last, then retire that towel.
stillHappening:
  - "Out of towels: open the ran out of towels or pads fix."
  - text: A dropped wash towel is not in the knowledge base yet. The booklet's rule for a dropped mitt is that it is done for the day.
    status: verify
notes:
  - Upper panels may share a towel on a fresh face.
  - Lower panels never share.
  - Keep the whole car wet. If a panel starts drying, rinse it.
  - text: Whether to dump and remix the bucket is not set in the knowledge base.
    status: verify
lessonId: lesson-l1-03-towel-wash
equipmentIds:
  - equipment-microfiber-towels
related:
  - fix-61
  - fix-63
  - fix-77
  - fix-17
  - sop-wash
  - card-bucket-mix
---
