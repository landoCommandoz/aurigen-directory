# Design directions: Lando's Detailing Masterclass 101

Phase 0, step 6. Written 2026-10-07 by the design lead (ui-designer role). Documents only. No app code.

Read with: `CLAUDE.md` (design and mobile rules) and `BUILD_PROMPT.md` sections 3 and 10. Facts come from `knowledge/KNOWLEDGE_BASE.md`; status tags are kept as written there.

## 1. What this file decides

Two looks, A and B. Lando picks one, or A with B's accent. The pick becomes the token file (`src/design/tokens.css`), the self-hosted fonts (`public/fonts/`), and the base components in Phase 1. Nothing here is built yet.

## 2. What we keep from the older apps, and what we leave

| Keep | From | Why | What changes |
|---|---|---|---|
| Top-down SVG car with tappable panels | `reference/panel-map-v3.html` (viewBox 440 x 820, nose at top, one path or rect per panel) | Lando already knows it. It is the right shape for routes, readings, and the paint report | Colors become tokens. The pulsing "next panel" fill goes. Labels grow for Shop Mode |
| Per-panel drawer | `panel-map-v3.html` (bottom sheet: eyebrow, title, steps, note, footer buttons) | One tap, one panel, everything about it | Sized as a flex column with `dvh`, no `max-height` on its list (mobile rule). Footer buttons 64 px in Shop |
| Timeline with a cutoff row | `tonight-model-y-job-sheet.html` (an 8:30 row: "Not past the doors? Finish this panel, IPA it, stop") | The cutoff is a row you walk past, not a popup you dismiss | The Job Runner's cutoff blocks starting a new polish square after the time. It never interrupts a square in progress |
| Route numbering on panels | both | Wash route and polish route are house standards (KB 11 `[HOUSE]`) | Numbers set in the display face, larger |
| Developer panel pattern | both | Live state readout saves debugging time | Dev builds and the owner Developer toggle only. Never in Customer View |

What we leave: gold `#ffc400`, ice blue `#8fd3ff`, Bebas Neue with Plus Jakarta Sans, Space Mono with Sora, fonts loaded from Google's CDN, tracked-out caps eyebrows, pill chips, rounded cards on everything.

## 3. Rules both directions share

- Every color is a CSS variable in one token file. The base is near-black, not pure black. Text is off-white, not pure white.
- Red has one job: STOP. Nothing else in the app is red. STOP is never color alone. It is a full-width band, an octagon, the word STOP, and it is read aloud. The model is house rule 10: paint color on the pad means STOP (KB 2 `[HOUSE]`).
- Why the accents sit where they do. Most colors already have a job in Lando's garage: the maroon and yellow pads, the Scotch Blue tape, white towels, the red of every STOP rule, and the two retired brand colors (KB 2 and 3 `[HOUSE]`). The accent has to mean one thing: the app is talking to you. Direction A takes the color the eye finds first. Direction B takes the one garage color that already means "protected": the tape.
- Pad colors (yellow, maroon, black) appear only as labeled swatches in the pad ladder. Never as UI color.
- Contrast is checked against WCAG 2.2 SC 1.4.3: 4.5:1 for normal text, 3:1 for large text (18 pt, or 14 pt bold). `[SOURCED 2026-10-07]` https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html. Every ratio below was computed from the hex values with the WCAG relative luminance formula.
- Fonts are self-hosted, latin subset, `font-display: swap`, real fallback stacks. Finding from today: the woff2 files Google's CSS API serves are subsets with no OpenType features, so they lose tabular figures. The original TTF files in the google/fonts repository carry `tnum` for all four faces below. Phase 1 builds our woff2 files from those TTFs and keeps `tnum`, so timer digits and gauge readings never jump. `[SOURCED 2026-10-07]` https://fonts.googleapis.com/css2?family=Barlow:wght@500 and https://raw.githubusercontent.com/google/fonts/main/ofl/barlow/Barlow-Medium.ttf (same check run for Barlow Condensed, Archivo, Schibsted Grotesk).
- Timers and readings use `font-variant-numeric: tabular-nums`.
- Motion: one orchestrated load moment per view (under 600 ms total). Press feedback on everything interactive (scale to 0.97, 120 ms). State changes 200 to 400 ms, ease-out `cubic-bezier(0.16, 1, 0.3, 1)`. With `prefers-reduced-motion: reduce`, nothing moves: opacity only, or no animation.
- Touch targets 44 px everywhere, 64 px in Shop Mode. No hover-only. No critical swipes. Undo instead of confirm dialogs.
- Units shown to Lando are microns (µm), as the knowledge base writes them. Customer View explains the word before using it.

## 4. Direction A: Hi-Vis

### Feeling

The hood taped into squares under one bright work light: everything labeled, nothing decorative, readable from across the garage with gloves on.

### Palette

| Token | Hex | Role |
|---|---|---|
| `--base` | `#151311` | Near-black with a warm cast: the concrete floor under a warm bulb |
| `--surface` | `#1f1c18` | Drawer, Academy "why" panels, inputs |
| `--text` | `#f2ede4` | Body text: the color of a clean microfiber towel |
| `--text-2` | `#a79f93` | Secondary text, labels, dim steps |
| `--accent` | `#d7ff3d` | The one bold accent: hi-vis yellow-green |
| `--accent-muted` | `#5d6f23` | The accent mixed into the base. Fills, borders, progress tracks. Never text |
| `--stop` | `#ff3b3b` | STOP conditions only |

Six colors plus the muted accent, which is derived from the accent.

Contrast (computed 2026-10-07):
- `--text` on `--base`: 15.9:1. On `--surface`: 14.6:1. Passes AA and AAA.
- `--text-2` on `--base`: 7.1:1. On `--surface`: 6.5:1. Passes AA for normal text.
- `--accent` on `--base`: 16.1:1. Passes for text of any size.
- Near-black text (`--base`) on an accent button: 16.1:1. Off-white text on the accent fails (1.0:1), so accent buttons always carry near-black text.
- `--stop` on `--base`: 5.2:1. Near-black text on a STOP band: 5.2:1. Both pass AA.
- `--stop` against `--accent`: 3.1:1 lightness difference, plus opposite hues. STOP and "go" stay apart for red-green color blindness.
- `--accent-muted` on `--base`: 3.3:1. Fine for fills and borders. Not used for text.

Why hi-vis: under normal light the eye is most sensitive to yellow-green, which is why safety vests are this color. In a garage lit by one work light, with the phone at arm's length, it is the fastest color to find. It is far from the retired gold (gold is amber; this is yellow-green and much lighter) and far from red. It is close in family to the yellow pad, so pad swatches are always drawn with a label and a ring and never sit on a button.

```css
:root {
  --base: #151311;
  --surface: #1f1c18;
  --text: #f2ede4;
  --text-2: #a79f93;
  --accent: #d7ff3d;
  --accent-muted: #5d6f23;
  --stop: #ff3b3b;
  --hairline: rgba(242, 237, 228, 0.10);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Type pairing

Display: Barlow Condensed, weights 600 and 700. Body: Barlow, weights 400, 500, 700. Both by Jeremy Tribby, SIL Open Font License. `[SOURCED 2026-10-07]` https://raw.githubusercontent.com/google/fonts/main/ofl/barlow/METADATA.pb and https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/METADATA.pb.

The designer's own description: Barlow "shares qualities with the state's car plates, highway signs, busses, and trains" (California). `[SOURCED 2026-10-07]` https://raw.githubusercontent.com/google/fonts/main/ofl/barlow/DESCRIPTION.en_us.html.

- Why it fits a garage at night: it is a sign face. It was drawn to be read at a distance in bad light. The condensed cut fits a step title on a phone in three words a line at 40 px without shrinking.
- Why it fits a customer standing there: set in sentence case it is calm and plain, not shouty. License plate DNA suits a car business without a racing cliché.
- Shop giant numbers (timer, readings) use Barlow at normal width, weight 700, for open counters. Tabular figures are in the original TTF (`tnum` confirmed today).
- Fallback stacks (fallbacks only; the primary face is never Arial, per `CLAUDE.md`):
  - Display: `'Barlow Condensed', 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif`
  - Body: `'Barlow', 'Helvetica Neue', Arial, sans-serif`
- Files: five woff2 files, latin subset, built from the TTFs. Final sizes `[VERIFY after subsetting in Phase 1]`.
- Scale: Shop step text `clamp(28px, 7.5vw, 40px)`, line height 1.15. Timer `clamp(48px, 14vw, 64px)`. Shop body `clamp(18px, 4.8vw, 22px)`. Academy body 18 px, line height 1.6, measure 68 characters. Customer body 17 px, headings 28 to 36 px.

### Signature moment: the polish goes clear

- Where: the section timer in the Job Runner, during every polish set. A smaller version plays when a Fix It step is checked off.
- What moves: a 2 x 2 square is drawn behind the timer digits. It starts covered in a creamy film: off-white at 85% opacity with soft grain. As the planned section time runs (about 4 minutes per 2 x 2 section on a one-step, KB 8.7 `[HOUSE from booklet time map]`), the film thins on a straight line to 15% opacity at the end. The change is slow. You see it across a set, not second to second.
- On "Done, next": a towel wipe. A 320 ms ease-out sweep from left to right clears what is left of the film, the square's outline flashes `--accent` once, and a check appears.
- If the timer runs past plan: the film is gone, the square's edge turns `--text-2`, and the label reads "Spent. Wipe and check."
- What it means to Lando: KB 8.3 `[HOUSE]`: creamy, then see-through, then almost gone. When it goes clear it is spent. Stop. The timer face teaches the rule every set.
- Guard: the paint decides, not the clock. The line under the timer always reads "Watch the paint, not the clock." Co-founder flag: without that line, the timer becomes the thing he trusts, and the knowledge base says the paint is.
- Reduced motion: the film is shown in four fixed steps (at 100%, 75%, 50%, 25% of planned time) with no animation, and the check appears instantly.
- Cost: opacity and transform only, so it runs on the compositor with no layout work. Works offline.

### How the three densities differ

- Shop: targets 64 px minimum. "Done, next" is 96 px tall and full width at the bottom of the screen, in the thumb zone. One action area per screen. Step text 28 to 40 px, three lines maximum. Everything that is not the step is set in `--text-2`. No cards. One square, one timer, one button. Hairline dividers only. The Fix It button sits in the bottom row of every screen.
- Academy: one column, measure 68 characters (under 80), 18 px body, line height 1.6. Each lesson runs in the same order: Why it matters (two to four paragraphs, the deep part), The steps, The numbers (a side rail on desktop, inline on a phone), Common mistakes, Drill, Quiz, Sign-off. Headings in Barlow Condensed 600, sentence case. A 3 px `--accent` rule down the left of every "why" section.
- Customer: the accent nearly disappears. One accent element per screen: the one thing they can tap. Padding grows from 16 to 24 px. No status badges, no `[VERIFY]` content, no internal numbers. Panel map colors always carry plain words. Targets 44 px. The brand name (from config) tops every customer page.

### Shape, depth, texture

Corners 6 px, like a tape cut, never pills. Borders at 10% off-white. The base carries a soft radial warm light from the top left (the work light) at 6%, and a 3% grain layer. One shadow, on the drawer: `0 12px 30px rgba(0, 0, 0, 0.45)`. No glass panels in Shop: blur costs battery and legibility in daylight. Glass appears once, on the handle of the Customer before/after slider.

## 5. Direction B: Blue Tape

### Feeling

Black lacquer under a cool LED, and one strip of blue tape that says: we protect what we don't polish.

### Palette

| Token | Hex | Role |
|---|---|---|
| `--base` | `#0d0f13` | Near-black with a cool cast: black Model Y paint under an LED |
| `--surface` | `#161a21` | Drawer, Academy "why" panels, inputs |
| `--text` | `#edf0f4` | Body text, cool off-white |
| `--text-2` | `#98a2ad` | Secondary text, labels |
| `--accent` | `#3f8fe6` | The one bold accent: tape blue, light enough for text |
| `--accent-muted` | `#255a9c` | The deeper roll color. Tape fills and strips. Never text |
| `--stop` | `#ff4040` | STOP conditions only |

Six colors plus the muted accent, which is derived from the accent.

Contrast (computed 2026-10-07):
- `--text` on `--base`: 16.8:1. On `--surface`: 15.3:1.
- `--text-2` on `--base`: 7.4:1. On `--surface`: 6.7:1. Passes AA for normal text.
- `--accent` on `--base`: 5.7:1. Passes AA for normal text. On `--surface`: 5.2:1.
- Near-black text (`--base`) on an accent button: 5.7:1, passes. Off-white text on the accent: 2.9:1, fails even for large text, so accent buttons always carry near-black text.
- `--stop` on `--base`: 5.5:1. Near-black text on a STOP band: 5.5:1.
- `--stop` against `--accent`: 1.0:1. Same lightness, opposite hues. Red against blue is the pair most people with color blindness can still tell apart, but the separation is hue only, so the STOP band keeps its octagon, full width, and the word STOP.
- `--accent-muted` on `--base`: 2.8:1. Fills and strips only. Not used for text.

The hex is matched by eye to Scotch Blue painter's tape, which Lando owns and uses on every polish job (KB 3.1 `[HOUSE]`; KB 2 rule 9: tape the edges). It is not a 3M value, and the 3M name never appears in the app. The token is tape blue. Check it against a roll in hand on the first build `[VERIFY]`.

Why it is not a generic blue: it is never a gradient, never glossy, never a rounded pill. It appears as matte strips with torn ends (an SVG shape) marking the active step, the section lines on the car, and the primary button, which is a strip of tape across the bottom of the screen. The moment the blue shows up as a soft rounded button on a card, it has become generic and fails the audit in section 7.

```css
:root {
  --base: #0d0f13;
  --surface: #161a21;
  --text: #edf0f4;
  --text-2: #98a2ad;
  --accent: #3f8fe6;
  --accent-muted: #255a9c;
  --stop: #ff4040;
  --hairline: rgba(237, 240, 244, 0.10);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Type pairing

Display: Archivo, variable font, width 125 (Expanded) at weight 700 for titles, width 100 at weight 600 for subheads. Body: Schibsted Grotesk, weights 400, 500, 700.

Archivo is by Omnibus-Type (Héctor Gatti), SIL Open Font License, with a width axis from 62 to 125 and a weight axis from 100 to 900. `[SOURCED 2026-10-07]` https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/METADATA.pb. Its description: "originally designed for highlights and headlines" and "reminiscent of late nineteenth century American typefaces." `[SOURCED 2026-10-07]` https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/DESCRIPTION.en_us.html.

Schibsted Grotesk is by Bakken & Bæck and Henrik Kongsvoll, SIL Open Font License, weights 400 to 900. Its description: "a digital-first font family crafted for user interfaces," with roots in a newspaper publisher's printed media. `[SOURCED 2026-10-07]` https://raw.githubusercontent.com/google/fonts/main/ofl/schibstedgrotesk/METADATA.pb and https://raw.githubusercontent.com/google/fonts/main/ofl/schibstedgrotesk/DESCRIPTION.en_us.html.

- Why Archivo fits a garage at night: a wide, heavy grotesk reads like the badge on a trunk lid. It sits still. At 32 px in mixed case it is confident without caps or tracking.
- Why it fits a customer: wide letters in mixed case read as car branding, not as a startup.
- Why Schibsted Grotesk fits both: it was built for small sizes on screens and for long reading. A phone in the garage and a lesson at midnight are both of those.
- Both carry tabular figures in the original TTF (`tnum` confirmed today). The timer and readings use Schibsted Grotesk 700 tabular.
- Fallback stacks (fallbacks only):
  - Display: `'Archivo', 'Arial Black', 'Helvetica Neue', Arial, sans-serif` (the width axis has no fallback; fallbacks render at normal width)
  - Body: `'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif`
- Files: the Archivo variable TTF is 658 KB before subsetting, too heavy for the offline precache as one file. Phase 1 either subsets it to latin and the two widths used, or ships two static instances (Expanded 700 and Normal 600). Schibsted Grotesk variable is 176 KB as TTF, subset to latin. Final sizes `[VERIFY after subsetting in Phase 1]`.
- Scale: same sizes as A, with one change. Archivo at width 125 is wide, so Shop step titles cap at 36 px and wrap to three lines at most.

### Signature moment: the light sweep

- Where: once per app launch, as the load moment. When the Customer paint report opens. At an Academy level sign-off. Never during a running step.
- What moves: the top-down car sits on the base. Each panel shows a faint swirl texture: thin arcs at 6 to 8% off-white, the spiderweb you see with a light held low across the paint (KB 7.1 `[HOUSE]`). A soft-edged band of cool light, about 20% of the car's width, sweeps from the nose to the tail in 900 ms, ease-out `cubic-bezier(0.16, 1, 0.3, 1)`. Where the band has passed, the arcs are gone and one crisp highlight line remains along the body line: the mirror. The band settles into that line. Last, one tape strip appears in 200 ms on the panel being worked, or the brand strip on the launch screen.
- What it means to Lando: the whole job in one second. Light low, find the swirls, polish, mirror. It is what he did for the first time on Oct 6, 2026, on his own hood (KB 1 `[HOUSE]`).
- Reduced motion: no sweep. The car renders finished with the highlight line, with a 200 ms fade in or none.
- Cost: one SVG mask and one transform, compositor only. The swirl texture is an SVG pattern, not an image. Precached, works offline.

### How the three densities differ

- Shop: same targets as A (64 px, 96 px primary). The primary button is a tape strip across the bottom. The active step carries a short tape strip at its left edge. Symptoms in Fix It are full-width rows, one per row, so long names fit and the whole row is the target. The panel map shows the active panel in tape fill (`--accent-muted`) and taped-off trim as hatched tape. Everything else is bare black with hairlines.
- Academy: measure 68 characters, 18 px Schibsted Grotesk, line height 1.65. Archivo Expanded headings at 32 px. "Why it matters" sits on a `--surface` panel with a tape strip label at its top left, so the deep part of every lesson has a visible home. The numbers sit in the right rail on desktop.
- Customer: the most restrained of the three. Tape appears once per page, as the heading label. Paint report panels use three tints from the palette plus words. Spacing 24 to 32 px. Archivo headings. No hairline clutter.

### Shape, depth, texture

Corners 0 px on tape strips (torn ends instead of radius), 12 px on the drawer only. A vertical highlight band at 4% off-white runs down the center of the base, the lacquer reflection. Grain at 2%. One glass panel: the drawer, blur 12 px over 70% `--surface`. Drawer shadow `0 -14px 48px rgba(0, 0, 0, 0.6)`.

## 6. Wireframes

Phone wireframes are 48 characters wide for 375 px, so one character is about 7.8 px and one text line is about 24 px. The desktop wireframe is 120 characters wide for 1440 px, so one character is about 12 px. Values shown (times, dates, "12 min") are sample values, not data. Lesson copy is sample copy; the content-curator writes the real lessons from the knowledge base.

### 6.1 Fix It symptom grid

Direction A: two-column tiles with an icon and words, grouped by where you are in the job.

```
+----------------------------------------------+
| Fix It                              [ Close ]|
| Running: Model Y, hood, square 3 of 5        |
+----------------------------------------------+
| [ Type or say a word                   mic ] |
+----------------------------------------------+
| Machine                                      |
| +-------------------+  +-------------------+ |
| |  ~~~>             |  |  (o)              | |
| |  Polisher jerks,  |  |  Pad stopped      | |
| |  walks, or hops   |  |  spinning         | |
| +-------------------+  +-------------------+ |
| +-------------------+  +-------------------+ |
| |  . . .            |  |  )))              | |
| |  Polish looks     |  |  Heavy            | |
| |  dry              |  |  vibration        | |
| +-------------------+  +-------------------+ |
| Paint                                        |
| +-------------------+  +-------------------+ |
| |  ###              |  |  ~ ~              | |
| |  Swirls still     |  |  Haze after       | |
| |  there            |  |  compound         | |
| +-------------------+  +-------------------+ |
| +==========================================+ |
| | STOP   Paint color on the pad            | |
| +==========================================+ |
| Wash and dry                                 |
| +-------------------+  +-------------------+ |
| |  o o o            |  |  ::::             | |
| |  Water spots      |  |  Dirt still on    | |
| |  after drying     |  |  the paint        | |
| +-------------------+  +-------------------+ |
|  (scrolls: all 33 symptoms, grouped by stage)|
+----------------------------------------------+
|  All symptoms         Read aloud: on         |
+----------------------------------------------+
```

Notes for A:
- Tiles are about 172 px wide and 96 px tall, well over the 64 px Shop minimum. The icon is a simple line glyph; the words carry the meaning.
- The group that matches the running step opens first ("Machine" during a polish set). Groups follow the job order, so the right tile is near the top.
- The STOP tile (FIX-09) is the one red object on the screen: full width, `--stop` fill, near-black text, octagon.
- The search field uses the phone keyboard's mic; no special API. The row at the bottom is 64 px and never scrolls away.
- Rows are hairlines, not cards. The tiles are the only "cards" in Shop Mode.

Direction B: full-width rows, one symptom per row, a tape strip per group.

```
+----------------------------------------------+
| Fix It                                Close  |
| Running: Model Y, hood, square 3 of 5        |
+----------------------------------------------+
|  Type or say a word                    mic   |
|  ____________________________________________|
|                                              |
| ~[ Machine ]~                                |
|                                              |
|  ~~~>  Polisher jerks, walks, or hops        |
|  ............................................|
|  (o)   Pad stopped spinning                  |
|  ............................................|
|  )))   Heavy vibration                       |
|  ............................................|
|  . . . Polish looks dry                      |
|                                              |
| ~[ Paint ]~                                  |
|                                              |
|  ###   Swirls still there after polishing    |
|  ............................................|
|  ~ ~   Haze after compound                   |
|  ............................................|
| +==========================================+ |
| | STOP   Paint color on the pad            | |
| +==========================================+ |
|                                              |
| ~[ Wash and dry ]~                           |
|                                              |
|  o o o Water spots after drying              |
|  ............................................|
|  ::::  Dirt still on the paint after washing |
|  (scrolls: all 33 symptoms, grouped by stage)|
+----------------------------------------------+
|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
|~  All symptoms             Read aloud: on   ~|
|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
+----------------------------------------------+
```

Notes for B:
- `~[ Machine ]~` is a tape strip: matte `--accent-muted` fill, torn ends, sentence case text in `--text`.
- Each row is 72 px tall and the whole row is the target. Dotted lines are hairlines. No cards at all.
- The bottom row is a tape strip button, drawn with `~` edges here.

### 6.2 Job Runner step, hands-busy mode

Direction A:

```
+----------------------------------------------+
| Model Y, one-step          Ahead of plan 12m |
| Hood   square 3 of 5   set 4 of 6            |
+----------------------------------------------+
|                                              |
|  Top to bottom pass.                         |
|  Speed 4. About 1 inch                       |
|  per second.                                 |
|                                              |
|  +--------------------------------------+    |
|  |::::::::::::::::::::..................|    |
|  |::::::::    02:40 left   .............|    |
|  |::::::::   of 4:00 planned   .........|    |
|  |::::::::::::::::::::..................|    |
|  +--------------------------------------+    |
|  Watch the paint, not the clock.             |
|                                              |
|  Reading aloud )))          [ Undo last ]    |
|                                              |
+----------------------------------------------+
|                                              |
|                 Done, next                   |
|                                              |
+----------------------------------------------+
|   Fix It        Quick cards        Pause     |
+----------------------------------------------+
```

Notes for A:
- "Ahead of plan 12m" compares the time map (KB 17 `[HOUSE from booklet]`) with the clock. It flips to "Behind plan" in `--text-2`, never red. Red is for STOP.
- The square behind the timer is the signature moment. `:` is film still creamy, `.` is film gone clear. "4:00 planned" is the house time per 2 x 2 section (KB 8.7).
- The step text is the whole step, three lines maximum, `clamp(28px, 7.5vw, 40px)`, in `--text`. It is read aloud as the step opens.
- "Done, next" is 96 px tall, `--accent` fill, near-black text. A second tap inside about 700 ms is ignored (tune the window in Phase 3). After a tap, "Undo last" appears for 5 seconds. No confirm dialogs.
- The bottom row is 64 px. Fix It is always one tap away. "Pause" stops the timer and the read-aloud and keeps the job.
- A STOP condition, if the step has one, appears above the step text as a full-width `--stop` band with the octagon and the word STOP. Here the set has none.

Direction B:

```
+----------------------------------------------+
| Model Y, one-step          Ahead of plan 12m |
| ~[ Hood  3 of 5 ]~   set 4 of 6              |
+----------------------------------------------+
|                                              |
|  Top to bottom pass.                         |
|  Speed 4. About 1 inch                       |
|  per second.                                 |
|                                              |
|            02:40 left                        |
|            of 4:00 planned                   |
|  ======================______________________|
|                                              |
|  Watch the paint, not the clock.             |
|                                              |
|  Reading aloud )))            Undo last      |
|                                              |
+----------------------------------------------+
|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
|~                Done, next                  ~|
|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
+----------------------------------------------+
|   Fix It        Quick cards        Pause     |
+----------------------------------------------+
```

Notes for B:
- The timer is bare digits in Schibsted Grotesk 700 tabular at `clamp(48px, 14vw, 64px)`. Under it, a 2 px progress hairline in `--accent-muted` (`=` done, `_` left). No film: B spends its one moment on the light sweep, not here.
- The panel label is a tape strip. "Done, next" is a tape strip across the bottom, 96 px tall, near-black text.
- Everything else matches A: same undo, same double-tap guard, same bottom row.

### 6.3 Customer paint report

Direction A:

```
+----------------------------------------------+
| Lando's Detailing                            |
| Paint report                                 |
| 2022 Tesla Model Y, black        Oct 7, 2026 |
+----------------------------------------------+
|                 +------------+               |
|                 |front bumper|               |
|                 |     H      |               |
|          +----+ +------------+ +----+        |
|          | L  | |            | | R  |        |
|          |fend| |    hood    | |fend|        |
|          | H  | |     H      | | H  |        |
|          +----+ |            | +----+        |
|          +----+ +------------+ +----+        |
|          | L  | | windshield | | R  |        |
|          |frt | |   glass    | |frt |        |
|          |door| +------------+ |door|        |
|          | H  | |            | | G  |        |
|          +----+ |   roof     | +----+        |
|          +----+ |   glass    | +----+        |
|          | L  | |            | | R  |        |
|          |rear| +------------+ |rear|        |
|          |door| | rear glass | |door|        |
|          | H  | +------------+ | H  |        |
|          +----+ |  liftgate  | +----+        |
|          +----+ |     H      | +----+        |
|          | L  | +------------+ | R  |        |
|          |qtr | |rear bumper | |qtr |        |
|          | H  | |     H      | | H  |        |
|          +----+ +------------+ +----+        |
|                                              |
|  H  Healthy paint. Polished normally.        |
|  G  Thinner here. Polished gently.           |
|  T  Thin. Protected by hand, no machine.     |
|  Glass is washed, not polished.              |
|  Tap a panel to see its readings.            |
+----------------------------------------------+
| What is clear coat?                          |
| Your paint has a clear top layer. Swirls     |
| live in that layer. Polishing levels it.     |
+----------------------------------------------+
| The fingernail test   |   The test spot      |
+----------------------------------------------+
| What we did today                            |
+----------------------------------------------+
```

Notes for A:
- The car is the SVG from the Panel Map, recolored by the house thickness bands (KB 7.3 `[HOUSE]`). Proposed customer grouping: H is 100 µm or more (full ladder permitted); G is 75 to 99 (the "polish only" and "tell the customer" bands); T is under 75 (no machine, hand protection only). A panel reading far above the rest (about 220 or more) is a repaint and gets its own label, "Repainted panel, treated gently," when present.
- Fills: H is `--accent` at 35% over the base, G is `--accent-muted` with a hatch, T is a `--stop` outline with no fill. The letter and the legend always carry the meaning; color never carries it alone.
- The bands are a conservative house standard, not a manufacturer spec (KB 7.3). The customer words above are a proposal. The business-customer agent and the fact-checker own the final wording, and nothing tagged `[VERIFY]` renders here.
- The roof is glass on a Model Y, so it is washed and not measured or polished (KB 11 `[HOUSE]`). Other vehicles differ.
- Tapping a panel opens the drawer with that panel's 3 to 5 readings (KB 7.2) and one plain sentence.
- No internal fields appear: no floor price, no crew notes, no pad or product internals unless Lando marks them customer-safe.

Direction B:

```
+----------------------------------------------+
| Lando's Detailing                            |
| ~[ Paint report ]~                           |
| 2022 Tesla Model Y, black        Oct 7, 2026 |
+----------------------------------------------+
|                                              |
|          (same car map as A, recolored:      |
|           H panels in a cool tint of --text, |
|           G panels in --accent-muted tape    |
|           fill, T panels as --stop outline;  |
|           taped-off trim drawn as hatched    |
|           tape along the window line)        |
|                                              |
|  H  Healthy paint. Polished normally.        |
|  G  Thinner here. Polished gently.           |
|  T  Thin. Protected by hand, no machine.     |
|  Glass is washed, not polished.              |
|  Tap a panel to see its readings.            |
+----------------------------------------------+
|                                              |
|  What is clear coat?                         |
|                                              |
|  Your paint has a clear top layer. Swirls    |
|  live in that layer. Polishing levels it.    |
|                                              |
|  The fingernail test                         |
|  If a nail catches, polish will not remove   |
|  it. We showed you these before we started.  |
|                                              |
|  The test spot                               |
|  Two halves, side by side. The left half is  |
|  before. The right half is after.            |
|                                              |
|  What we did today                           |
+----------------------------------------------+
```

Notes for B:
- The report opens with the light sweep across the car (the signature moment), then the colors settle in.
- One tape strip on the page: the heading. Sections are plain headings with 32 px of air between them, no cards, no hairlines.
- Same legend words as A. Same rule: nothing tagged `[VERIFY]` renders.

### 6.4 Desktop, 1440 px: Academy lesson reading view

Drawn once. Direction A sets headings in Barlow Condensed 600 with a 3 px `--accent` rule on the left of the "why" section. Direction B sets headings in Archivo Expanded 700 and puts the "why" section on a `--surface` panel with a tape strip label.

```
+----------------------------------------------------------------------------------------------------------------------+
| Lando's Detailing   Academy          Search: press /                      DJ (crew)   Shop Mode   Customer View      |
+----------------------+----------------------------------------------------------------------+------------------------+
| Level 4              |                                                                      | The numbers            |
| Machine polishing    |  Lesson 4.3                                                          |                        |
|                      |  Pressure and arm speed                                              |  Spread on speed 1 to 2|
|  4.1 The long-throw  |                                                                      |  Work on speed 4       |
|      DA              |  Why it matters                                                      |  About 1 inch a second |
|  4.2 Prime the pad   |  A dual-action polisher only works when the pad keeps spinning.      |  About 10 lb pressure  |
|> 4.3 Pressure and    |  Push too hard and the pad stops, so the abrasive drags instead of   |  4 to 6 sets a square  |
|      arm speed       |  cutting. Move faster than about an inch a second and you are past   |  Wipe once at the end  |
|  4.4 Sets and the    |  the house speed. The right pressure feels lighter than you expect.  |                        |
|      crosshatch      |  The right speed feels slower than feels right. This lesson is       | Drill                  |
|  4.5 The marker line |  about trusting those two feelings before you trust your eyes.       |  Bathroom scale: learn |
|  4.6 Test spot and   |                                                                      |  what 10 lb feels like.|
|      the ladder      |  (two to four paragraphs on a desktop; the measure stays at 68       |  Log each try.         |
|  4.7 Edges and heat  |  characters, 18 px, line height 1.6)                                 |                        |
|  4.8 Pad care        |                                                                      | Sign-off               |
|                      |  The steps                                                           |  Quiz: not taken       |
| Progress: 3 of 8     |  1. Pad flat on the paint before you pull the trigger.               |  Drill: 0 logged       |
|                      |  2. Spread on speed 1 to 2 across the whole square.                  |  Owner sign-off: locked|
| Print this SOP       |  3. Work on speed 4. About 1 inch per second.                        |                        |
|                      |  4. Crosshatch: left to right, then top to bottom. That is one set.  | Related fixes          |
|                      |  5. 4 to 6 sets. On the last set, let the machine float.             |  Polisher jerks        |
|                      |  6. Wipe once, at the end. Then IPA, wipe, check with the light low. |  Pad stopped spinning  |
+----------------------+----------------------------------------------------------------------+------------------------+
```

Notes:
- Three columns: lesson list 264 px, reading column 840 px with the text held to a 68 character measure at 18 px, numbers rail 288 px. At 1024 px the rail moves below the text. On a phone the lesson list becomes a drawer.
- The steps and numbers shown come from KB 8.3 `[HOUSE]`. The "why" text is sample copy. Lesson numbering is a placeholder; the learning-designer sets the real order.
- "Search: press /" is the keyboard shortcut for the PC at night. "Print this SOP" uses print CSS.
- Sign-off is read-only for crew. The owner PIN unlocks it, never a crew tap.

## 7. Template-tell audit

| Tell | Direction A | Direction B |
|---|---|---|
| Tracked-out all-caps labels everywhere | First draft had condensed caps group labels in Fix It. Cut. Sentence case everywhere. The only word in caps is STOP. Passes | Tape strip labels are sentence case. Passes |
| Arrows on every button | First draft had chevrons on tiles. Cut. "Done, next" is words. Passes | None. Passes |
| Identical rounded cards for everything | Fix It tiles are the only cards, at 6 px. Lists are rows with hairlines. Academy has no cards. Passes | First draft put every lesson section on a card. Cut. Only the drawer and the "why" panel have a surface. Passes |
| Em-dash labels | None. Colons and periods. Passes | None. Passes |
| Purple gradients | None. Passes | None. Passes |
| Generic blues | None. Passes | The risk in B. It passes only while the blue is matte, tape-shaped, torn-ended, one per screen in Customer View, and never a gradient or pill. A rounded blue button on a card fails this row |
| Centered card on a flat background | Content is left-aligned on a lit, grained base. Passes | Same, with the lacquer band. Passes |

Extra tells found and cut while writing:
- The pulsing fill on the "next" panel from the Panel Map. Cut in both. The next panel gets a static outline and the route number.
- Pill chips across the top of the Panel Map. Cut in both. Modes are a segmented control with 64 px targets.
- Glass panels on every card from the job sheet. Cut. A uses glass once (slider handle), B once (drawer).
- Icon-only buttons. Cut in both. Every button has words.
- Blue as a text link color in B's Customer View. Cut. Links are underlined off-white; the accent is spent on the one tappable strip.

## 8. Open design questions for Lando

1. While you polish, is the phone in your hand, in a pocket, or propped somewhere? This decides where the one action area sits and whether the timer must read from four feet away.
2. Which hand holds the polisher when you tap the phone? This sets the thumb side, and whether we need a left or right handed layout switch.
3. Is there any color already on your shirts, cards, or a logo sketch? If not, do you want this app to set the brand color? The accent you pick here becomes it.
4. Which inspection light do you use? KB 3.1 marks it `[VERIFY]`. It decides whether the light in B's sweep is cool or warm.

## 9. Recommendation

Pick A: the four moments weight the garage over the showroom, hi-vis is the color the eye finds first at arm's length, it stays far from STOP red in both hue and lightness, and it carries no template baggage. B's tape is the better story to tell a customer, so if that story matters more to you than glance speed, take A with B's accent.

Lando picks: A or B (or: A with B's accent)
