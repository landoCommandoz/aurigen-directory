---
id: fix-80
type: fixnode
title: The label on the bottle says something different from this app
group: setup-time
audience: [owner, crew]
visibility: internal
status: house
kbRef: "2"
tags: [label, directions, rule 12, verification, products]
sayIt:
  - label says something different
  - the label disagrees with the app
  - bottle says something else
  - directions don't match
  - app is wrong
  - which one do I follow
  - label versus the app
  - the bottle says to do it differently
  - instructions on the bottle
  - label says prime with something else
sources:
  - label: Knowledge base 0 and 2, rule 12
    date: 2026-10-07
    note: The label on the bottle beats this app. When the knowledge base conflicts with a product label, the label wins and the conflict goes in the verification log.
  - label: Fact-checker findings FC-02, FC-04, and FC-12
    date: 2026-10-10
    note: The strip line on the Citrus Wash & Gloss bottle is unread (FC-02). Lando's US ceramic wax bottle wins if its wording differs from the pages checked (FC-04). The M210 and Ultimate Compound label directions are unchecked; an M210 label copy says to prime pads with M34 Final Inspection, which Lando does not own (FC-12).
stopIf: []
checks:
  - Which product, and which line on the label?
  - What does the app say for the same thing?
  - Does that line in the app carry an unverified badge?
causes:
  - The app line is not confirmed yet. Look for the unverified badge.
  - Your bottle is a different version or size than the one the fact-checker read.
steps:
  - Read the label all the way through.
  - text: "House rule 12: the label on the bottle beats this app."
    status: house
  - text: "What crew does next: Lando decides (pending)."
    status: verify
  - Photograph the label.
  - Write down what the label says and what the app says.
stillHappening:
  - "Not sure the product belongs on paint at all: check the never-on-paint card."
notes:
  - When the app and a label disagree, the conflict goes in the verification log.
  - text: "Known open check: M210's label may say to prime pads with M34 Final Inspection. The house rule mists the pad with water. Not checked yet."
    status: verify
  - text: "Known open check: the strip line on the 64 oz Citrus Wash & Gloss bottle. Not read yet."
    status: verify
lessonId: lesson-l0-01-rules-that-never-bend
productIds:
  - product-meguiars-m210
  - product-cg-citrus-wash-gloss
  - product-meguiars-hybrid-ceramic-wax
related:
  - card-never-on-paint
  - card-pad-priming
  - fix-04
  - fix-74
---
