# Handoff: Phase 1 (Foundation)

For Lando, DJ, and Suzie. Phase 1 version, drafted 2026-10-11 for the lead. Lando: read all of it. DJ: sections 2, 6, and 10. Suzie: sections 2, 6, and 7.

Phase 1 is the base of the app. It installs on the phone, works with no signal, searches the 77 items that exist so far (14 Quick Cards, 21 products, 22 tools, 20 glossary words), and sets up the phone, the owner PIN, and backups. The jobs, lessons, and customer screens come in later phases (section 11).

## 1. The link

https://landocommandoz.github.io/aurigen-directory/

It is a free test link (0 Netlify credits). The lead tells you when it is live. If it shows a GitHub "404" page, see section 10.

## 2. Install on iPhone or iPad

1. Open the link in Safari. Use Safari, not another browser.
2. Tap Share (the square with the arrow; if you do not see it, tap the ••• button first).
3. Scroll down and tap Add to Home Screen.
4. If you see an Open as Web App switch, leave it on. Tap Add.
5. Close Safari. Open the app from its new Home Screen icon, with signal.
6. Wait until the line under the title says Ready offline. The app now has a full copy saved on the phone.

The iPad is the same. Always open the app from the icon. A Safari tab keeps its own separate data, and Safari can erase it after 7 days of Safari use without a visit; the icon is exempt. The app shows an "Install on this phone" card whenever it is opened in a tab.

## 3. First run on your iPhone (the shop phone)

The app opens straight into Home. Fix It, Quick Cards, and Search work at once. A banner at the top, "Set up this phone," walks you through setup. "Later" closes it until the next launch.

1. Tap Set up. Under "1. Is this the shop phone?", tap This is the shop phone. That opens the Device role screen and changes nothing.
2. No other phone has your jobs, so tap Start fresh. Read the warning: cars logged and founder's slots start at zero. Type the word it asks for (zero) and tap Start fresh.
3. Create a 6 digit owner PIN and enter it again. It is stored scrambled and never shown again. Write it down somewhere DJ cannot read it. This PIN keeps honest people honest. It is not real security.
4. The next screen says "This is now the shop phone" and that the weekly backup reminder is on. Tap Save your first backup. The share sheet opens. Pick Save to Files, then iCloud Drive, then Save (or Mail it to yourself).
5. If the share sheet closes without saving, the screen offers Try again, Share as a text file, and Copy backup text (no photos). You can leave without saving (Back to Settings), but the banner then stays on "Save your first backup" and the reminder is due at once.

Optional: Settings, Thumb side. Left is the default (polisher in the right hand, left thumb taps).

## 4. Back up and restore

Back up: Settings (top of the screen), Backup and restore, Save backup, then Save to Files or Mail. The Home screen shows "Last backup" with a Backup button. Once a week a "Backup due" banner appears; tap Back up now. Always back up from the installed app: the share sheet works there, and the app never uses a download link inside it.

Restore: Settings, Backup and restore, Restore from a file, and pick the backup in Files (or paste the copied text). The screen shows the backup's date, jobs, cars toward 25, founder's slots, and which phone it came from. Type replace, tap Apply, and enter the owner PIN if this phone has one. Cancel at any point changes nothing.

Each link keeps its own data, and nothing moves between links by itself. One move is planned, at v1.0 (Phase 7): Backup, install the new link, Import, check the counts match, then delete the old icon.

## 5. Shop phone and study phone

Your rules, 2026-10-10, in your words:

> "A mistaken 'This is the shop phone' tap changes nothing until an owner PIN exists, and the screen has a clear Cancel. One shop phone at a time: a second phone can only become the shop phone by importing the latest backup. 'Start fresh' is a separate choice with a warning that the counts reset to zero."

> "Straight in with the setup banner. When the owner PIN is created, the first backup happens right then, not later, and the weekly backup reminder turns on."

How the app keeps them:

- Every phone starts as a study phone. The shop phone holds the jobs, the counts (cars toward 25, founder's slots), and the sign-offs. A study phone holds study only.
- On the Device role screen of a study phone with no PIN, This is the shop phone is greyed out ("Create the owner PIN first"). With a PIN, it asks for the PIN, then a screen says "Nothing has changed yet" and offers Import, Start fresh, and Cancel.
- No phone can see your other phones. "One at a time" is kept by these two ways in, not by detection. So after a move, always switch the old phone to study.

Moving the shop phone to a new phone:

1. Old phone: Settings, Backup and restore, Save backup, Save to Files.
2. New phone: install (section 2), Settings, Device role, Import the newest backup, pick the file. Check the date and counts, then tap Yes, this is the newest backup. The shop role and the PIN come with it.
3. Old phone: Settings, Device role, Make this a study phone, enter the PIN.

## 6. Give DJ the study phone

You set it up yourself, then hand it over.

1. Install on DJ's phone (section 2).
2. Setup banner: tap Set up, then This is a study phone.
3. Tap Create the owner PIN and enter a PIN DJ does not know, out of his sight. If he ever learns it, change it: Settings, Owner PIN, Change PIN (it asks for the current PIN first).
4. Tap Save your first backup and save it to DJ's Files.

Your rule for his phone, 2026-10-10: "DJ's phone is for study only. Sign-offs live on the shop phone and happen with my PIN while I watch him do the skill. Finishing a level on his phone unlocks nothing." A study phone has no job screens, no Business room, no sign-offs, and no Customer View.

DJ: open the app from its icon, not from Safari. In Phase 1 you have Fix It, Quick Cards, Search, and the Academy outline. Lessons arrive in Phase 2. If a screen asks for the owner PIN, hand the phone to Lando.

Suzie: nothing to set up in Phase 1. To look around, install it the same way as a study phone and let Lando set the PIN. The Ops role approved for you (bookings, prices, policies, and the job log, without sign-offs or pricing internals) comes with the Business room in a later phase.

## 7. Customer View (a preview in Phase 1)

On the shop phone: Home, tap the Customer View tile. A reminder shows once: "Turn on your Customer Focus: Control Center, Focus." Tap Done. The screen shows only the business name, the service area, the phone number, and a line about Phase 4, and the bottom row holds only Exit Customer View. In Phase 1 that exit is one tap. From Phase 4, ending a customer session needs your PIN.

One-time Focus setup on your iPhone: Settings, Focus, add a Focus (+), Custom, name it Customer. Under People, Allow Notifications From, add Suzie. Under Apps, allow none and leave Time Sensitive Notifications off. Then Suzie's calls ring and text previews stay off the screen. Whether an "urgent" message gets through is `[VERIFY]` at the Phase 4 walkaround.

## 8. The developer panel

It shows the app's live state and runs the phone tests in section 9. It is off by default and never shows in Customer View.

To open it: Settings, Developer tools (near the bottom), switch it On, enter the owner PIN, then tap Open the developer panel. Its top line reads "Developer panel. Removable before the final deploy." Turn it off the same way. The device preview buttons (Mobile, Tablet, Desktop) belong to the build team; you can ignore them. The lead can remove the panel before the final release.

## 9. Your Phase 1 device checklist (about 15 minutes)

First, the gate test:

- [ ] Install from the link (section 2), open from the icon with signal, and wait for Ready offline.
- [ ] Turn on Airplane Mode. Tap Home, Fix It, Quick Cards, Search, and open a card.
- [ ] Still in Airplane Mode, close the app (swipe up from the bottom and pause, then swipe it away) and open it from the icon. Home opens.
- [ ] Do the first run (section 3). The share sheet opens for the backup, not a download.

Then the 9 items from the blueprint. Do 7, 8, and 9 last, with the test record only (no real jobs exist in Phase 1).

- [ ] 1. iOS version: Settings, General, About. Keeping the screen on needs 18.4 or newer. ______
- [ ] 2. Developer panel, Storage: write "Storage kept (persisted)" and "Answer to the keep request." ______ / ______
- [ ] 3. Settings, Read aloud, Test voice, then lock the screen right away. Does the voice keep going? Yes / No
- [ ] 4. Developer panel, Share sheet: tap Test share PNG, PDF, and JSON. Which apps appear for each? ______
- [ ] 5. Developer panel, Voice: Show the voice list. Which voices, and does the English one sound OK? ______
- [ ] 6. Turn on Low Power Mode. Developer panel, Hold screen awake for 30 s. Does the screen stay on? Yes / No
- [ ] 7. Clear Safari history and website data (Settings, Apps, Safari; on older iOS, Settings, Safari). This signs you out of websites in Safari. Reopen the app: are the PIN and the Last backup date still there? Yes / No
- [ ] 8. Make a new test record: Settings, Backup and restore, Save backup. Note the new Last backup time. ______
- [ ] 9. Delete the icon, reinstall from the same link, open it. Is the Last backup time from item 8 still there? Yes / No. If not, do not tap Start fresh: restore the backup from Files (section 4). That doubles as the restore test.

Also: turn Customer View on and off once (section 7), and check that the text reads at arm's length on the cart and every button is easy for your left thumb. Send the lead this list with your answers.

## 10. If something breaks

- The link shows a GitHub "404" page: the one-time Pages switch is off or the build has not run. In Safari: the repo on github.com, Settings, Pages, Source, GitHub Actions (if Settings is hidden, tap aA, then Request Desktop Website). Then tell the lead.
- A blank screen at start: wait 8 seconds. "The app did not start. Reload, or tell Lando." Tap Reload.
- "The app hit a problem. Reload, or tell Lando if it keeps happening." Tap Reload.
- "This screen hit a problem": tap Home, Fix It, or Reload. Nothing you saved is lost.
- "No screen here": a bad link. Tap Home or Fix It.
- To restart the app fully: swipe up from the bottom and pause, swipe the app away, open it from the icon.
- Works with signal, fails in Airplane Mode: open it from the icon (not Safari) with signal, wait for Ready offline, then try again. The banner "Offline, and not saved yet" means the copy is not saved yet.
- "This phone is not saving": turn Private Browsing off and free some space. Fix It, Quick Cards, and Search still work.
- "Settings could not be read": stop. Do not delete the app or clear Safari data. Tell the lead.
- "Update ready": tap Update now when you are not mid-job. Later is fine.
- Forgot the owner PIN: Phase 1 has no reset screen yet. Do not delete the app. Tell the lead.

Telling the lead: what you tapped, what the screen said (a screenshot is best), your iOS version, whether Airplane Mode was on, and the App version and Build lines from the developer panel. Never send your PIN.

## 11. Not in Phase 1 yet

- Fix It symptom tiles and fix pages: Phase 2. For now Fix It opens search and the Quick Cards.
- Lessons: written in Phase 2, with the reader in Phase 5. The Academy shows the Level 0 to 8 outline.
- Job Runner (timers, read-aloud of steps, hands-busy mode, gauge entry): Phase 3. Run jobs the way you do now.
- Customer screens (check-in, paint report, menu), pricing, and policies: Phase 4.
- Crew profiles, quizzes, sign-offs, and DJ's Share my progress: Phase 5.
- Job log, dashboard, Field Notes, and the weekly review: Phase 6.
- The Netlify link: one production check at the Phase 3 gate, and v1.0 with your real data in Phase 7.
- A forgot-PIN reset screen, and Suzie's Ops role: later phases.
- Known small issues are listed in `docs/QA-REPORT.md`. None of them blocks this test.
