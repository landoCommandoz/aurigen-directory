---
id: fix-33
type: fixnode
title: "Can I polish today? (cold, hot, wind)"
group: setup-time
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [weather, cold, heat, wind, shade, polish, protection]
sayIt:
  - can I polish today
  - too cold to polish
  - too hot to polish
  - is it too windy
  - is it too cold
  - cold garage
  - hot day
  - polishing in the sun
  - below 50 degrees
  - freezing out
  - weather
  - winter polishing
sources:
  - label: Knowledge base 2, 8.3, 18.1, 18.2, and 21
    date: 2026-10-07
    note: Shade, cool panels, no wind for polishing and protection; the hand-on-panel test. Below about 50 F, garage it or move the date (tagged verify against labels). Utah winter, sell interiors and maintenance washes, not corrections.
  - label: Meguiar's FAQ on its own forum, temperature ranges
    url: https://www.meguiarsonline.com/forum/information-station/hot-topics-frequently-asked-questions/3180-what-temperature-ranges-are-best-for-applying-cleaners-polishes-and-waxes
    date: 2026-10-11
    note: Best surface temperature is about 60 to 80 F. Products work within a broader range, about 50 to 90 F. Surface and air temperature can differ by 10 to 50 degrees. Read through the search index; the forum now redirects to meguiars.com. Supporting only, not a label. Fact-checker FC-51. No label gives a number.
stopIf:
  - Sun on the panel. No polishing and no protection in the sun.
  - Wind. No polishing and no protection in the wind.
  - Panel too hot to keep your hand on? Stop and let it cool.
  - text: Below about 50 F, polish and ceramic wax stop behaving. Garage it or move the date.
    status: verify
checks:
  - Is the car in shade?
  - Is it windy?
  - Put your hand flat on the panel. Can you keep it there?
  - What is the temperature outside?
causes:
  - Sun or a hot panel.
  - Wind.
  - text: Cold, below about 50 F.
    status: verify
steps:
  - Move the car into shade.
  - Get the car out of the wind.
  - Put your hand flat on the panel.
  - Too hot to keep it there? Let it cool.
  - text: "Cold out: garage it or move the date."
    status: verify
stillHappening:
  - "The panel heats up while you polish: open the panel too hot fix."
  - "Utah winter: sell interiors and maintenance washes, not corrections."
notes:
  - text: Cold-weather limits for M210, Ultimate Compound, and Hybrid Ceramic Wax are not on any label the fact-checker could read. Read the backs of the bottles.
    status: verify
  - text: A Meguiar's FAQ says its products work from about 50 to 90 F surface temperature, and best at 60 to 80 F. Panel and air temperature can differ a lot.
    status: verify
  - Drop-off at home has shade, power, water, and the compressor.
  - Plastic bumpers heat fast. Lighter pressure, lower speed, shorter time.
lessonId: lesson-l4-05-edges-curves-heat
related:
  - fix-12
  - fix-18
  - fix-46
  - card-stop-rules
  - sop-polish
  - sop-protect
---
