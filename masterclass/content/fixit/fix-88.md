---
id: fix-88
type: fixnode
title: Customer wants polishing at their house, or a two-step
group: customer
audience: [owner, ops]
visibility: internal
status: house
kbRef: "2"
tags: [customer, mobile, drop-off, two-step, 25 cars, travel fee]
sayIt:
  - customer wants mobile polishing
  - can you polish at my house
  - come to me
  - mobile detail
  - we come to you
  - customer wants a two-step
  - full correction
  - heavy correction
  - mobile fee
  - travel fee
  - no hose at their house
  - no water at the customer's house
sources:
  - label: Knowledge base 2, rules 1 and 2
    date: 2026-10-07
    note: All polish jobs happen at home (drop-off) until 25 cars are logged. No two-step correction is sold until 25 cars are logged.
  - label: Knowledge base 15.1, 18.1, 18.2, and 12.2
    date: 2026-10-07
    note: Mobile adds $30, framed as a convenience fee, never as a drop-off discount. Travel is $1.50 per mile outside Tooele, Stansbury, Grantsville. Settle water, power, parking, and HOA rules on the phone. No spigot means a rinseless wash, for dust, not mud. Motorcycles are drop-off only.
  - label: Blueprint 12, items 14 and 15
    date: 2026-10-10
    note: Only delivered jobs with an exterior paint stage count toward 25; interior-only jobs and bikes never count. At 25 cars the two-step appears as quoted after the test spot, with no amount.
checks:
  - Is it a polish job, or a wash or interior?
  - How many cars are logged so far?
  - Is the address inside Tooele, Stansbury, or Grantsville?
causes:
  - Polish jobs stay at the shop until 25 cars are logged.
  - Two-step correction is not sold until 25 cars are logged.
steps:
  - Polish job? Book it as a drop-off.
  - Two-step? Offer the one-step, after the test spot.
  - Wash or interior at their place? Add the $30 mobile fee.
  - Outside Tooele, Stansbury, or Grantsville? Add $1.50 per mile.
  - "Settle water, power, parking, and HOA rules on the phone."
stillHappening:
  - "They push back on the price: open the price pushback fix."
notes:
  - Call the mobile fee a convenience fee. Never call drop-off a discount.
  - Motorcycles are drop-off only.
  - "What counts toward 25: delivered jobs with an exterior paint stage. Interior-only jobs and bikes never count."
  - At 25 cars, the two-step is quoted after the test spot. No amount is set.
  - text: "No spigot: a rinseless wash, for dust, not mud. Caked mud means rinse it or scratch it. No rinseless product is in the kit."
    status: verify
  - text: Mobile power and generator rules are not confirmed.
    status: verify
related:
  - fix-29
  - term-mobile-fee
  - term-drop-off
  - term-two-step
  - term-founders-rate
---
