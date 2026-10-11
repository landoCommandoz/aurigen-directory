# Design system: Direction A, Hi-Vis

The look Lando picked on 2026-10-10. The full reasoning is in `docs/DESIGN-DIRECTIONS.md`.

## Files

- `index.css`: the one file the app imports (`import './design/index.css'` in `main.tsx`). It pulls in the four below and sets the screen frame.
- `tokens.css`: every color, size, space, layer, and timing as a CSS variable. The only file in the app with color values.
- `fonts.css`: Barlow (body, 400/500/700) and Barlow Condensed (headings, 600/700), served from `public/fonts/`. Nothing loads from Google.
- `motion.css`: the load moment, press feedback, and the reduced-motion rules.
- `print.css`: black on white for printed SOPs. Mark anything that should not print with `data-print="hide"`.
- `icon.svg`: the app icon artwork. app-engineer turns it into the PNG icons.

## Rules that keep the look honest

1. Never type a color. Use a token: `color: var(--text-2)`. If a color is missing, ask the design owner to add a token.
2. The accent (`--accent`, hi-vis yellow-green) means "the app is talking to you". One primary action per screen.
3. Red (`--stop`) means STOP and nothing else. Use the `StopBand` component or a `stop` Button, which always add the octagon and the word.
4. Errors and warnings are words plus a glyph, never red.
5. Sentence case everywhere. The only word in capitals is STOP.
6. Every button has words. No icon-only buttons.

## Densities

Set `data-density` on `<html>` (so drawers and toasts, which render outside `#root`, follow it):

| Value | For | What changes |
|---|---|---|
| `shop` | Job Runner, Fix It, arm's length | Targets 64 px, "Done, next" 96 px, body 18 to 22 px |
| `academy` | Lessons, settings, reading | Lines held to 68 characters (`.ui-measure`), body 18 px, line height 1.6 |
| `customer` | Customer View | 24 px side padding; focus rings and selected states turn off-white; T panels get a dashed grey outline |

In Customer View the accent may appear once per page, only as one primary Button. The paint report has none.

Set `data-hand="right"` on `<html>` for a right-thumb user. It mirrors the bottom row and the Undo position only.

## Screen frame (do not break)

`html`, `body`, and `#root` fill the screen and never scroll. Each view has one scroll container: `flex: 1 1 auto; min-height: 0; overflow-y: auto`. Never put `overflow: hidden` or `max-height` on a list or on anything that holds one. The bottom row is `--bottom-row-height` tall; toasts float above it.

## Motion

- Load moment: add `className="ui-rise"` and `style={{ '--i': n }}` to a view's main blocks (n = 0, 1, 2 ...).
- Press feedback: base components already have it. For a custom tappable element, add `ui-press`.
- Changes run 200 to 400 ms with `var(--ease-out)`. With reduced motion on, nothing moves.

## Handy classes

`ui-num` (timers and readings: digits keep one width), `ui-muted`, `ui-measure`, `ui-visually-hidden`.
