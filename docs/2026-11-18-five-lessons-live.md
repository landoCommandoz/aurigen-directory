# The five beginner lessons went live — what to check, 2026-11-18

Written so another session can confirm this without taking my word for it. The room refuses to let
anyone confirm their own work, and that is the point of this file.

Lando approved it: room queue item 5, decided 2026-11-17 22:42 with his PIN, which became work
item 4, taken by the aurigen-directory session at 22:44. The room post is job 39.

## The five addresses, and the one that holds them together

- https://theplatbook.com/start-here/lessons/1/
- https://theplatbook.com/start-here/lessons/2/
- https://theplatbook.com/start-here/lessons/3/
- https://theplatbook.com/start-here/lessons/4/
- https://theplatbook.com/start-here/lessons/5/
- https://theplatbook.com/start-here/lessons/ (all five together)

All six answered 200 after the publish, and none of them carries a hide-from-search header.

## What to check, and what it said when I checked it

| Check | How to see it | Result |
|---|---|---|
| All five answer on the live site | open each address above | 200, five of five |
| Listed for search engines | https://theplatbook.com/sitemap.xml | all six addresses present |
| Start Here links all five, in order | https://theplatbook.com/start-here/ | lessons 1, 2, 3, 4, 5 in that order |
| Each lesson links on and back | foot of each lesson | Previous, Next, Back to Start here |
| Its own name and summary | page title and description of each | five different pairs |
| Question-and-answer wording | the markup in each page's head | 26 pairs, 0 of them absent from the visible page |
| 50 law sentences keep their source | the law lists on the five pages | 50 of 50 carry statute, official link, checked date |
| Four-states notice on all five | foot of each lesson | 5 of 5, naming Georgia, Indiana, New York, Tennessee |
| "The short version" tops all five | top of each lesson | 5 of 5 |
| Lesson 4's worked example | lesson 4 | one month against twelve months, on a homestead |
| No seminar or course mentions | all five lessons | 0 |
| Lesson 5's line | lesson 5 | "Every time. I have never done it myself." |
| Law check | `cd cloudflare && npm run build` | PASS, 51 states |
| County text | same build | clean on 51 pages |
| Whole test suite | `cd cloudflare && node --test ../under-review/test/*.test.mjs` | 117 pass, 0 fail |
| Phone screen, 375px | see below | no sideways scroll, every control 44px or more, no movement |

## The phone measurements, and how to repeat them

Measured in real Chrome at 375px on the five live lesson pages and both index pages, and on the
built pages at 360, 390 and 412px as well:

- document scroll width equals the viewport width, and **zero** elements have a right edge past it;
- **zero** controls under 44px tall (nav links, breadcrumb links, Previous/Next/Back, buttons, cards);
- CLS **0.000**, and **0px** of movement of any heading or paragraph's layout box after first paint.

Two traps, both of which cost time tonight and will cost it again:

1. `body { overflow-x: hidden }` hides sideways overflow, so checking the scroll bar proves
   nothing. Walk every element and compare its right edge with the viewport width.
2. Snapshot the layout box at **first contentful paint**, not at `DOMContentLoaded`. A snapshot
   taken that early reports 27-114px of relayout that no reader can ever see, and it disagrees
   with itself run to run while the browser's own shift number stays 0.

Inline links inside a sentence are not counted as controls: WCAG 2.5.8 exempts them, and the
footer's "Report an error" is one, 17px tall on every page of the site. Padding it out to 44px
would break the sentence it sits in, so it was left alone and is not a lesson problem.

## What was changed, and what was not

Changed: `cloudflare/scripts/lessons.mjs` (the approval switch, and a link to the previous lesson)
and `cloudflare/scripts/build-site.mjs` (the Start Here section listing the five, and the
question-and-answer markup). Dated copies of both files from before the change sit beside them,
ending `.bak-2026-11-17-before-publish`.

Not changed: one word of the lesson prose Lando approved. Diff `lessons.mjs` against its backup
and the whole difference is those two things.

The question-and-answer markup is generated from each page's own headings and the visible text
under them. No prepared draft of it existed in the repo, the vault or the handoff, so it was
written fresh to Lando's rule, and `faqJsonLd()` throws at build time if a question or an answer
cannot be found in the page's visible text. One judgment call inside it: lesson 3's sections are
numbered steps, so its eight pairs read as steps rather than as literal questions. The
alternatives were to give lesson 3 no markup at all, against Lando's "each lesson", or to rephrase
its headings into questions, against his "only text visible on the page".

Still parked and untouched: the three design directions in `preview/redesign-2026-11-17/`.
Still unanswered: the Baltimore City rate question.
