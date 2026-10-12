---
id: fix-58
type: fixnode
title: Cord dragging on the paint, or nowhere safe to set the polisher
group: machine
audience: [owner, crew]
visibility: internal
status: house
kbRef: "8.1"
tags: [cord, polisher, setup, safety, towel]
sayIt:
  - cord dragging on the paint
  - cord on the car
  - cord in the way
  - cord keeps catching
  - tripping on the cord
  - where do I set the polisher
  - set the polisher down
  - put the polisher down on its pad
  - polisher on the ground
  - nowhere to put the machine
  - gfci
  - extension cord outside
  - cord in the wet
  - which extension cord
sources:
  - label: Knowledge base 8.1 and 8.3
    date: 2026-10-07
    note: Cord over your shoulder. Polisher rests on its side on a towel. Never park the machine spinning in one spot.
  - label: Knowledge base 18.2, mobile rules
    date: 2026-10-07
    note: Polisher draws about 7.5 A, any normal household outlet. 12-gauge cord, 50 ft max. Tagged verify; the fact-checker confirmed the amps, outlet, and cord (FC-56).
  - label: BAUER 56367 owner's manual, 2021
    url: https://manuals.harborfreight.com/manuals/56000-56999/56367-193175448170.pdf
    date: 2026-10-11
    note: Electrical rating 120 VAC, 60 Hz, 7.5 A, on a 15 A circuit. Table A, 7.1 to 12.0 A, 50 ft needs at least 14 gauge, 75 ft needs 12. In a damp location, use a GFCI protected supply. Outdoors, use a cord marked W-A. Keep electrical connections off the ground. One cord for more than one tool, add the amps. Loaded directly. Fact-checker FC-56.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - Never park the machine spinning in one spot.
  - text: Damp spot or water on the ground? Plug into a GFCI outlet. Keep plug connections off the wet ground.
    status: sourced
checks:
  - Is the cord over your shoulder?
  - Is there a towel to set the polisher on?
  - text: Outdoors, is the cord marked W-A?
    status: sourced
  - text: Near water, is it plugged into a GFCI outlet?
    status: sourced
  - text: Are the plug connections off the ground?
    status: sourced
  - text: One cord, one tool?
    status: sourced
causes:
  - The cord is not over your shoulder.
  - No towel staged to rest the polisher on.
steps:
  - Let go of the trigger with the pad still on the paint.
  - Lift the pad.
  - Run the cord over your shoulder.
  - Lay a towel down where you work.
  - Rest the polisher on its side on the towel.
stillHappening:
  - "Setup keeps slowing you down: open the setup is taking forever fix."
notes:
  - Let go of the trigger before the pad leaves the paint, every time.
  - text: The polisher draws 7.5 A on a 120 V, 15 A circuit. Any normal household outlet works.
    status: sourced
  - text: Use a 12-gauge cord, 50 ft max. That is stricter than the manual's minimum.
    status: sourced
lessonId: lesson-l4-01-know-the-machine
equipmentIds:
  - equipment-bauer-56367
  - equipment-microfiber-towels
related:
  - card-setup-kit
  - card-machine-settings
  - lesson-l0-02-stay-safe
  - sop-polish
---
