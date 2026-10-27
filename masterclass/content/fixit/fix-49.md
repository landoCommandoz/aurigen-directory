---
id: fix-49
type: fixnode
title: Plate bolt won't loosen, or the plate just spins
group: machine
audience: [owner, crew]
visibility: internal
status: sourced
kbRef: "14"
tags: [backing plate, spindle bolt, spindle lock, parts, m8]
sayIt:
  - can't get the plate off
  - plate won't come off
  - bolt won't loosen
  - plate keeps spinning
  - plate spins when I turn the bolt
  - spindle lock
  - spindle bolt
  - how do I take the plate off
  - swap the plate
  - remove the plate
sources:
  - label: BAUER 56367 owner's manual, 2021
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-10
    note: Page 10, Replacing Backing Pad. Using hex wrench, turn Spindle Bolt counterclockwise to remove Backing Pad. Replace Backing Pad and Spindle Bolt. Do not overtighten bolt. If necessary, Spindle Lock is located under Auxiliary Handle; remove two screws and slide Auxiliary Handle off. Page 7, the 30-second test run. Fact-checker FC-21 and FC-24.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: HF product page, item 64913
    url: https://www.harborfreight.com/6-in-hook-and-loop-backing-pad-for-dual-action-and-random-orbit-polishers-64913.html
    date: 2026-10-10
    note: Arbor Size 5/16 in.-24, so it does not fit the 56367. Read through the search index. Fact-checker FC-19.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Knowledge base 14, backing plate research
    date: 2026-10-07
    note: Replace with a 6 in. (150 mm) plate made for a long-throw, mounted with an M8 bolt. Compare the new plate's hub to the old one before bolting it on.
stopIf:
  - text: Unplug the polisher before you touch the plate.
    status: house
checks:
  - Is it unplugged?
  - Does the spindle turn along with the bolt?
causes:
  - text: The spindle turns with the bolt. The spindle lock is there to hold it still.
    status: verify
steps:
  - Unplug the polisher.
  - Remove the two screws on the auxiliary handle.
  - Slide the auxiliary handle off. The spindle lock is under it.
  - text: Hold the spindle lock in.
    status: verify
  - Turn the spindle bolt counterclockwise with the hex wrench.
  - Take the old plate off.
  - Compare the new plate's hub to the old one.
  - Put the new plate on with the spindle bolt.
  - Do not overtighten the bolt.
  - text: Slide the auxiliary handle back on and put its two screws back.
    status: verify
  - Test run it off the car for at least 30 seconds.
stillHappening:
  - "Need a new plate: open the backing plate fix."
  - "Call the HF tech and parts line, 1-888-866-5797."
notes:
  - Do not buy HF item 64913 for the 56367. It is 5/16 in.-24 thread and does not fit.
  - Replace with a 6 in. (150 mm) plate made for a long-throw, mounted with an M8 bolt.
  - text: Exactly how to hold the spindle lock in is not written in the manual's text the fact-checker read.
    status: verify
lessonId: lesson-l4-06-pad-care-backing-plate
equipmentIds:
  - equipment-backing-plate
  - equipment-bauer-56367
related:
  - fix-34
  - fix-07
  - term-m8
  - term-backing-plate
---
