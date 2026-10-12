---
id: fix-26
type: fixnode
title: Tesla windows dropped, wipers ran, or Sentry fired during the wash
group: tesla
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
tags: [tesla, model y, car wash mode, sentry, wipers, windows]
sayIt:
  - car wash mode
  - tesla windows went down
  - windows dropped during the wash
  - wipers came on
  - wipers started going
  - sentry mode went off
  - tesla alarm during the wash
  - tesla honking at me
  - car wash mode won't turn on
  - car wash mode turned off
  - can't find car wash mode
  - tesla keeps beeping
  - charge port opened
sources:
  - label: Knowledge base 11
    date: 2026-10-07
    note: Car Wash Mode before any water. Charge port door stays closed.
  - label: Tesla Model Y 2020 to 2024 owner's manual, Car Wash Mode
    url: https://www.tesla.com/ownersmanual/2020_2024_modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html
    date: 2026-10-10
    note: Controls > Service > Car Wash Mode. The car must be stationary and not actively charging. It closes all windows, locks the charge port, and turns off the wipers, Sentry Mode, walk-away door locking, and parking chimes. It turns off above 9 mph or on Exit. Skipping it may damage the charge port or wipers, and car wash damage is not covered by the warranty. Read through the search index. Fact-checker FC-13 and FC-14.
    confirmedOn: 2026-10-10
    confirmedBy: fact-checker
  - label: Tesla Model Y 2025 and newer owner's manual, China edition
    url: https://www.tesla.cn/ownersmanual/modely/en_cn/Owners_Manual.pdf
    date: 2026-10-11
    note: Page 200, to enable, touch Controls > Service > Car Wash Mode. The vehicle must be stationary and not actively charging. It disables above 15 km/h or on Exit. Same path as the 2020 to 2024 Model Y. Loaded directly. Fact-checker FC-39. Model S, Model X, and Cybertruck not checked.
    confirmedOn: 2026-10-11
    confirmedBy: fact-checker
stopIf:
  - No water on a Tesla until Car Wash Mode is on.
checks:
  - Is Car Wash Mode on?
  - text: Is the car parked and not charging?
    status: sourced
  - text: Did the car go over 9 mph, or did someone touch Exit?
    status: sourced
  - Is the charge port door closed?
causes:
  - Car Wash Mode was not on before the water.
  - text: Car Wash Mode turned off. It turns off above 9 mph or when you touch Exit.
    status: sourced
  - text: The car was not parked, or it was charging. Car Wash Mode needs it parked and not charging.
    status: sourced
steps:
  - Stop the water.
  - text: Park the car.
    status: sourced
  - text: Make sure it is not charging.
    status: sourced
  - text: "Touch Controls > Service > Car Wash Mode."
    status: sourced
  - Check every window is closed.
  - Check the charge port door is closed.
  - Start the wash again.
stillHappening:
  - text: "Can't find Car Wash Mode on this car: the menu path is checked for the Model Y only, 2020 to 2024 and 2025 or newer. Other models may differ."
    status: verify
  - "Something got damaged, like the charge port or the wipers: open the broke something fix."
notes:
  - text: The menu path is the same on the 2020 to 2024 and the 2025 or newer Model Y.
    status: sourced
  - text: Car Wash Mode closes all windows, locks the charge port, and turns off the wipers, Sentry Mode, walk-away door locking, and parking chimes.
    status: sourced
  - text: Tesla's manual says skipping Car Wash Mode can damage the charge port or the wipers, and car wash damage is not covered by the warranty.
    status: sourced
lessonId: lesson-l1-06-full-wash
related:
  - card-tesla-wash-mode-tape
  - sop-setup-tesla
  - sop-wash-tesla
  - fix-78
  - fix-28
---
