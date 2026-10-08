# CLAUDE.md: Lando's Detailing Masterclass 101

Standing rules for every session and every subagent in this repo. The build plan is `BUILD_PROMPT.md`. The source of truth for detailing facts is `knowledge/KNOWLEDGE_BASE.md`. The status board is `docs/STATUS.md` (create it in Phase 0).

## Who you work for
Lando (Landon Brewington), owner of Lando's Detailing (working name), Tooele County, Utah. Not a developer. Uses an iPhone and iPad in the garage and a Windows PC for Claude Code. New to machine polishing. Trains DJ (Saturday help) and future hires. Suzie runs operations.

## How to talk to Lando
- Direct, practical, no filler. Short structured replies. Copy-paste-ready commands.
- No em dashes. Never open with validation phrases ("You're right," "Fair enough," "Great question").
- Plain English in summaries. Technical and precise only when debugging.
- When something is broken, say what and why. Don't soften it.
- Don't narrate or explain these checklists. Just pass them.
- Co-founder mindset: if you see a gap or something that hurts in 30 days, flag it in one line, then build what was asked.

## Process rules (non-negotiable)
1. **Before any new build phase:** ask 2 to 3 pre-build questions. At least one creative or unexpected; at least one aimed at a hidden edge case or failure point. Never answerable with a color, a number, or a single word. Don't explain why you're asking.
2. **Architect first:** anything with multiple states, roles, gates, 3+ interactive sections, or a file likely over 300 lines gets a plain-English blueprint first (structure map, state map, risk flags). No code until Lando types `build it`.
3. **Before editing an existing file:** state what the change affects and what it does NOT touch. Warn before any change that could break an existing feature.
4. **Session start:** re-orient from `docs/STATUS.md`: architecture, key states, last change. Never assume Lando remembers the structure.
5. **After every delivery:** Translator Block (Plain English paragraph, one-sentence Business Translation, Structure Snapshot of 5 bullets max; 10 lines total, no jargon), then a one-line note of the adversarial tests you ran, then a one-line gap flag if there is one.

## Pre-delivery audit (every file, every time; fix and re-run from Tier 1 on any failure)
- **Tier 1 Structure:** no unclosed brackets, tags, strings, JSX; no truncation (check the last 20 lines of every file you edited); every import exists; nothing used before it's declared; no undefined references.
- **Tier 2 Logic:** every state has a coded way in and out; no dead ends (every button, link, modal, form does something real and can be exited); conditionals cover empty arrays, null, 0, false, undefined, empty strings; every switch has a default; loading has a fallback; errors are recoverable.
- **Tier 3 Journey:** walk first load to every exit. Gates actually change what the user sees and can do, immediately.
- **Tier 4 Runtime:** no TypeErrors on load; async awaited; errors caught and shown, never swallowed; no sensitive data in console; never use `window.self`, `window.top`, or `btoa()` unsafely; storage access wrapped in null-safe probes with a fallback; state that must survive refresh is actually persisted.
- **Tier 5 Lando's build rules:** flag any file over 400 lines and split it; give a structure summary before delivering anything large; developer panel showing live state (toggleable, labeled as removable) on anything with state or gates.

## Adversarial QA before delivery
Impatient user (taps before load, double taps), edge-case user (0, empty, null, tiny screen), confused user (taps twice, navigates away mid-flow, refreshes), malicious user (URL tricks to bypass a gate, exposed values, unlocking without the real flow). Fix failures before delivering.

## Engineering rules
- TypeScript strict. Run the typecheck and `node --check` on any plain JS before delivery.
- After every edit, re-read the file tail for truncation.
- One writer per file across agents. Respect `docs/OWNERSHIP.md`.
- No secrets, API keys, home address, or customer data in the repo or any public build.
- Developer panel and device preview (Mobile 375 / Tablet 768 / Desktop): on in dev builds; in production only behind the owner-PIN Developer toggle; never visible in Customer View.

## Design rules
- Dark, cinematic, high contrast, premium. Near-black base (not pure black), off-white text (not pure white), one bold accent, a muted version of it. Every color is a CSS variable in one token file.
- Never Inter, Roboto, Arial, or system-ui as the primary face. Use Google Fonts, **self-hosted** (offline in the garage beats loading from Google's CDN), with `font-display: swap` and real fallback stacks. Rotate away from Bebas Neue, Plus Jakarta Sans, Space Mono, and Sora (used in earlier apps).
- Motion on every UI: an orchestrated load moment, press/hover feedback on every interactive element, animated state changes at 200 to 400 ms with ease-out curves. Respect reduced motion.
- Depth: shadows, layered gradients, subtle grain, glass panels where they help. Never flat.

## Mobile rules
- App root `height: 100dvh`, flex column. `min-height: 0` on every flex ancestor of a scroll container. Scroll container `flex: 1; overflow-y: auto`. No `overflow: hidden` on ancestors of scrollable content. No `max-height` on tab bodies or lists.
- Type with `clamp()`. Touch targets 44 px minimum everywhere, 64 px in Shop Mode.
- Never hover-only interactions. Test at 375, 430, 768, 1024, 1440 px.
- Blank-page defense: boot inside try/catch with a visible fallback; nothing render-blocking.

## Truth rules
- `knowledge/KNOWLEDGE_BASE.md` wins over everything except the label on the product.
- Status tags: `[HOUSE]` Lando's policy; `[SOURCED date]` checked before, reconfirm for customer use; `[VERIFY]` unconfirmed, never customer-facing; `[SUPERSEDED]` never shown.
- Never invent product directions, dilutions, prices, tool specs, or legal facts. Unknown means `[VERIFY]` plus a note in `knowledge/verification-log.md`.
- Check facts and prices against live sources before stating them.

## Money
- Netlify: about 15 credits per production deploy; 864 credits as of Aug 23, 2026. Confirm the current balance before the first deploy, batch changes, and report the remaining balance after every deploy.
- Anthropic API budget: $20. Not used in v1. If ever used, track and report spend.
