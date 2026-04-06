# Generator Prompt Version History

Tracks changes to the site generation prompt in `pipeline/local-biz/generator.js`.

## Current Version (v1 — as of 2026-04-06)

**Model:** claude-sonnet-4-20250514

**Key prompt rules:**
1. Returns raw HTML only (no markdown fences, first char `<`, last char `>`)
2. Zero em dashes anywhere (U+2014 and `&mdash;` banned)
3. Uses only real business data — invents nothing
4. Niche-specific CSS color palette injected via `NICHE_COLORS` map
5. Design system: dark theme (`--bg: #0a0a0a`), CSS variables only, no hardcoded colors
6. Typography: Bebas Neue (headings), Playfair Display italic (tagline), DM Sans (body)
7. Hero: 100dvh, radial gold glow, staggered fade-up animation (name/tagline/CTA)
8. Phone-aware: tap-to-call CTA if phone exists, "Request a Quote" fallback if not
9. Real Google Places photos injected as `<img>` tags when available
10. Real Google reviews displayed verbatim when available
11. Rating display if rating >= 4.0
12. Services section with gold border-top separator
13. About section with city context
14. Contact section with phone and/or address
15. Footer with business name + year
16. Intersection Observer for scroll reveal animations
17. Favicon: niche-specific emoji in SVG data URI
18. Meta description auto-generated from business data

**Sections generated:**
1. Hero (name, tagline, CTA)
2. Services (niche-contextual)
3. Reviews/Testimonials (if available)
4. About
5. Contact
6. Footer

**Data injected into prompt:**
- `business_name`, `category`, `address`, `phone`
- `rating`, `review_count`
- `photos` (JSON array of Google Places photo URLs)
- `reviews_json` (JSON array of review objects with text, author, rating)
- Niche color palette (accent, light, glow, border)

## Changelog

| Date | Version | Changes | Reason |
|------|---------|---------|--------|
| 2026-04-06 | v1.1 | max_tokens 8192→16000, em dash post-processing, HTML validation, photo HEAD check | Sites getting truncated; em dashes leaking through; broken photo URLs possible |
| Pre-2026-04-06 | v1 | Initial prompt | Pipeline creation |

_Update this table each time `buildPrompt()` in generator.js is modified._
