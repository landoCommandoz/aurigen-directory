# Prism UI Review — 2026-03-16

Creative Director review of the current index.html UI changes.

---

## 1. Bottom Nav Redesign (7 emoji tabs to 4 SVG icon tabs)

**Verdict: PASS**

The consolidation from 7 emoji tabs to 4 (Explore, Tools, Advisor, Account) is a significant improvement. Findings:

- **SVG icons** are clean Lucide-style strokes: globe (Explore), grid (Tools), chat bubble (Advisor), user silhouette (Account). All use `stroke="currentColor"` so they inherit the color system properly. Width/height 22px is appropriate for mobile nav.
- **Labels** are 9px, weight 600, uppercase with 0.05em tracking. This is tight but legible. The uppercase treatment matches the brand's commanding tone.
- **Active state** uses `color: var(--accent)` (gold) with a subtle `scale(1.15)` transform on the icon. This is restrained and intentional — no garish highlight.
- **Background** is `rgba(17,17,22,0.95)` with 20px blur backdrop-filter. This reads as near-black glass, consistent with the design identity.
- **Border-top** uses `var(--border)` (rgba 255,255,255,0.07) — subtle white hairline. Correct.
- **Safe area padding** handled with `env(safe-area-inset-bottom)`. Good for notched devices.
- **Small screen fallback** (375px and below): labels hide, nav shrinks to 56px. Sensible.
- **Touch targets**: min-width and min-height 44px on `.nav-item`. Meets accessibility guidelines.

**Notes:**
- The grid icon (four squares) for Tools is generic but functional. A wrench or calculator might signal "tools" more directly, but the grid reads as a dashboard/utility hub, which works for a container that holds Analyzer, Legal, and Glossary.
- No emoji remnants found. Clean transition.

---

## 2. Tools Sub-Tabs (Analyzer, Legal, Glossary)

**Verdict: PASS**

The `.tools-tabs` and `.tools-tab` CSS is well-executed:

- **Container**: `background: var(--bg2)` (#111116) with `border-bottom: 1px solid var(--border)`. Flush with the view, no padding, flex layout. Clean.
- **Tab buttons**: `flex: 1`, 12px font, weight 700, uppercase, 0.06em tracking. Default color `var(--text-muted)` (#76768a). This is appropriately subdued.
- **Active state**: `color: var(--accent)` with `border-bottom: 2px solid var(--accent)`. This is the gold underline pattern. It reads as professional and intentional — not overdone.
- **Hover**: transitions to `var(--text-dim)` (#888896). Subtle and correct.
- **Transition**: 0.2s ease on all properties. Smooth.

**Notes:**
- The `.tools-panel` uses `display: none / flex` toggling with `min-height: 0` and `overflow: hidden`. This respects the scroll chain rules from CLAUDE.md (Rule 1).
- No max-height used anywhere in the tab content. Compliant with Rule 2.

---

## 3. Account Sub-Tabs (Profile, Saved)

**Verdict: PASS**

Account reuses the exact same `.tools-tabs` / `.tools-tab` classes as Tools. This is the correct approach — one pattern, one set of styles:

```html
<div class="tools-tabs">
  <button class="tools-tab active" onclick="switchToolsTab('profile', this)">Profile</button>
  <button class="tools-tab" onclick="switchToolsTab('saved', this)">Saved</button>
</div>
```

- Consistent gold underline active state.
- Same font size, weight, tracking, and color system.
- Same `switchToolsTab()` function handles both Tools and Account views.

**Notes:**
- The class name `tools-tabs` being used inside the Account view is semantically misleading but functionally harmless. If this ever needs to diverge in styling (e.g., Account gets a different accent), a rename would be needed. For now, this is fine.

---

## 4. Map Colors (Hardcoded vs. CSS Variables)

**Verdict: PASS WITH FLAG**

The map `getColor()` function at line 3558-3564 uses hardcoded hex values:

| State Type | Free/Unlocked | Locked |
|---|---|---|
| Lien | `#d4b44f` (warm gold) | `#9a7f30` (muted gold) |
| Deed | `#34e0cc` (vivid teal) | `#1fa08e` (muted teal) |
| Both | `#b99cff` (soft purple) | `#7a5fc4` (muted purple) |

**Contrast analysis against near-black (#0a0a0c):**

- `#d4b44f` on `#0a0a0c`: Excellent contrast. The warm gold is rich and readable.
- `#34e0cc` on `#0a0a0c`: Excellent contrast. Vivid teal pops without being neon.
- `#b99cff` on `#0a0a0c`: Excellent contrast. Soft lavender is distinct from the other two.
- Locked variants are intentionally dimmed (~60-70% luminance of the free versions). They still read on dark backgrounds, and the reduced opacity (0.75 via `getOpacity()`) further distinguishes them. This communicates "available but gated" effectively.

**Flag:**
- These hardcoded colors deviate from the CSS variable system. The CSS variables define `--accent: #c8a84b`, `--teal: #2dd4bf`, `--purple: #a78bfa`. The map uses different values (`#d4b44f`, `#34e0cc`, `#b99cff`). The difference is subtle but breaks the single-source-of-truth principle. CLAUDE.md Rule: "Never hardcode colors outside the CSS variable system." This is a technical violation. However, the locked variants have no CSS variable equivalents at all, which may justify the inline approach. Recommend adding `--map-lien`, `--map-deed`, `--map-both` (and locked variants) to `:root` if these colors are intentional departures from the base palette.

---

## 5. State Preview Gate (Fade-to-Paywall)

**Verdict: PASS**

The preview gate implementation is well-crafted:

- **`.preview-fade-gate`**: `position: relative; margin-top: 20px`. Simple container.
- **`.preview-fade-overlay`**: Absolutely positioned, offset `top: -60px` to overlap the preceding content. Uses `linear-gradient(to bottom, transparent, var(--bg2))`. This creates a 60px fade from visible content into the gate background. `pointer-events: none` so users can still interact with the visible content above. This is a cinematic content-to-gate transition.
- **`.preview-gate-content`**: `background: var(--bg2)`, border with `var(--border)`, 16px radius, centered layout. Glass morphism card styling is present through the border treatment.

**Paywall card content** (inline styles in the JS template):
- Lock icon at 32px. Gold price at 18px bold with `var(--accent)`. CTA uses `.paywall-btn` class.
- Copy is clear and value-oriented: "Get auction signup steps, county links, risks, due diligence checklists, beginner tips, and OTC availability for all 51 states."
- Code entry fallback is present with an underline link.

**Notes:**
- The inline styles on the gate content elements (font-size, margin, color) could be extracted to CSS classes for maintainability, but functionally they work and match the design system colors.
- The gradient fade is effective. The 60px height is enough to feel cinematic without wasting vertical space on mobile.

---

## 6. Landing Page Typography

**Verdict: PASS**

The typographic hierarchy on the gate hero section:

| Element | Font | Size | Weight | Tracking | Notes |
|---|---|---|---|---|---|
| `.gate-eyebrow` | DM Sans (inherited) | 12px | 600 | 0.25em | Gold accent color, uppercase. Classic luxury eyebrow. |
| `.gate-logo` | Bebas Neue | clamp(56px, 14vw, 96px) | normal | 0.15em | Off-white with gold `<span>` accent. Commanding. |
| `.gate-sub` | Cormorant Garamond | clamp(15px, 3vw, 20px) | italic | 0.08em | Dim text. Serif contrast against the sans headlines. |
| `.gate-tagline` | DM Sans | clamp(18px, 4vw, 26px) | 600 | default | Full white text. Direct and bold. |
| `.gate-description` | DM Sans | clamp(13px, 2.5vw, 15px) | normal | default | Dim text, 1.7 line-height. Comfortable reading. |

**Assessment:**
- The Bebas Neue to Cormorant Garamond pairing is strong. Condensed sans-serif for impact, elegant serif for refinement. This reads as premium, not template.
- The 0.15em letter-spacing on the logo is generous but intentional for Bebas Neue, which is naturally tight. At 56-96px, this spacing gives it room to breathe.
- The 0.25em tracking on the eyebrow is standard for small uppercase text. Correct.
- Cormorant Garamond italic with 0.08em tracking is an intentional serif accent. It differentiates the subtitle from the DM Sans body copy. Good typographic layering.
- Staggered fadeUp animations (0.2s, 0.35s, 0.5s, 0.65s, 0.8s, 0.95s) create a cinematic reveal. Timing increments of ~150ms feel natural.

---

## 7. Language Toggle Position (top: 12px to top: 56px)

**Verdict: PASS WITH NOTE**

The `#lang-toggle` is now at `top: 56px; right: 12px` with `z-index: var(--z-nav)` (50).

- **Map toggle bar**: The `#map-toggle-bar` sits at the top of the map view with `padding: 10px 16px`. On mobile, this bar is roughly 0-40px from the view top. The lang toggle at 56px sits just below it. No overlap.
- **Desktop**: The map toggle bar is hidden on desktop (1024px+). The lang toggle at 56px floats in the top-right of the map view. No conflicts.
- **Gate screen**: The gate is `position: fixed; inset: 0; z-index: var(--z-gate)` (200). The lang toggle at z-index 50 would be hidden behind the gate. This means the language toggle is not accessible while the gate is showing. If bilingual users need to switch language before entering their email, this could be a UX issue.

**Note:**
- Confirm that the language toggle is intentionally hidden during the gate screen. If the gate needs to be accessible in both languages, the toggle needs to be elevated above `z-index: 200` when the gate is active, or the gate itself needs an inline language switch.

---

## 8. Overall Brand Consistency

**Verdict: PASS**

Audit against the Aurigen design identity checklist:

| Requirement | Status |
|---|---|
| Near-black backgrounds (#0d0d0d / #0a0a0c / #111116) | Present throughout. `--bg`, `--bg2`, `--bg3` all in the correct range. |
| Gold accent | `--accent: #c8a84b` used for active states, CTAs, highlights. Consistent. |
| Off-white text (#f0f0f0) | `--text: #f0f0f0`. Never pure white. Correct. |
| Bebas Neue headlines | Used for `.gate-logo`, `.gate-section-title`, `.gate-stat-number`, `.gate-price-*`. Correct. |
| DM Sans body | Set on `html, body`. Inherited everywhere except explicit overrides. Correct. |
| Glass morphism cards | `backdrop-filter: blur()` on nav, stat cards, feature cards, modals. `rgba` backgrounds with subtle borders. Present. |
| Motion on load | Staggered `fadeUp` animations on gate hero elements. `glowPulse` on CTA. `scrollBounce` on chevron. Present. |
| No white backgrounds | None found. |
| No flat elements | Cards have borders, blurs, shadows, hover transforms. Depth is maintained. |
| No generic feel | Typography pairing (Bebas Neue + Cormorant Garamond + DM Sans) is distinctive. Color palette is custom. Layout is purpose-built. |

**One concern:**
- The map legend (line 2201-2206) uses CSS variables (`var(--accent)`, `var(--teal)`, `var(--purple)`) for legend dots, but the actual map fills use the hardcoded variants (#d4b44f, #34e0cc, #b99cff). This means the legend colors don't exactly match what users see on the map. The difference is subtle (e.g., #c8a84b in legend vs. #d4b44f on map for lien states) but technically a mismatch.

---

## Summary

| Area | Verdict |
|---|---|
| 1. Bottom nav redesign | PASS |
| 2. Tools sub-tabs | PASS |
| 3. Account sub-tabs | PASS |
| 4. Map colors | PASS WITH FLAG — hardcoded colors violate CSS variable rule; legend/map color mismatch |
| 5. State preview gate | PASS |
| 6. Landing page typography | PASS |
| 7. EN button position | PASS WITH NOTE — lang toggle hidden behind gate z-index; verify this is intentional |
| 8. Overall brand consistency | PASS |

**Action items (non-blocking):**
1. Consider adding `--map-lien`, `--map-deed`, `--map-both` (free + locked variants) to `:root` to bring map colors into the CSS variable system.
2. Sync the map legend dot colors with the actual map fill colors, or vice versa.
3. Verify the language toggle is intentionally inaccessible during the gate screen.
