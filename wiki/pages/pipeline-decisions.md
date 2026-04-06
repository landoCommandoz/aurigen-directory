# Pipeline Decisions

Key design choices and their rationale.

## CSV as Pipeline State

**Decision:** Use `leads.csv` as the shared state between all 4 scripts.

**Why:** Simple, human-readable, inspectable. No database needed. Each script reads the CSV, processes rows missing its output column, and writes back. This makes each script idempotent and independently re-runnable.

**Tradeoff:** No concurrent writes. Scripts must run sequentially.

## Single-Page HTML Sites

**Decision:** Generate complete single-file HTML sites (no external assets except Google Fonts).

**Why:** Deploys as a single file to Netlify. No build step. No asset pipeline. Fast to generate, fast to deploy. The business owner sees a real working site immediately.

## Niche-Specific Color System

**Decision:** Map 12 business niches to distinct accent color palettes, injected into the generator prompt as CSS variables.

**Why:** A plumber's site should feel different from a salon's site. Color is the cheapest way to create niche identity without changing layout. The `NICHE_COLORS` map in `generator.js` handles this with a fuzzy substring matcher.

## Niche-Specific Email Hooks

**Decision:** The emailbuilder has custom opening lines per niche category rather than generic cold email templates.

**Why:** "I was searching for a plumber in Salt Lake City" is more believable than "I noticed your business doesn't have a website." Niche hooks increase open-to-reply conversion.

## Claude for Generation (Not Templates)

**Decision:** Use Claude (claude-sonnet-4-20250514) to generate each site from scratch rather than filling a template.

**Why:** Every business gets a unique site. The AI adapts section content to the business category, incorporates real reviews and photos naturally, and handles edge cases (no phone, no reviews, no photos) without conditional template logic.

**Tradeoff:** Costs ~$0.02-0.05 per site. Occasional prompt adherence issues (em dashes, hallucinated content) handled by strict prompt rules.

## Netlify Free Tier

**Decision:** Each generated site is its own Netlify site on the free tier.

**Why:** Free. Instant. SSL included. Custom subdomain possible later. No server to manage. The deployer creates a site, uploads the HTML via file digest API, and gets a live URL back.

## Dark Theme Default

**Decision:** All generated sites use a dark cinematic theme (near-black backgrounds, gold/niche accent).

**Why:** Matches the Aurigen brand identity. Stands out from generic white website builder output. Creates a premium perception that justifies the cold outreach ("I built you something better than what you could get from Wix").

## No Framework Dependencies

**Decision:** Generated sites use vanilla HTML/CSS/JS only. No React, no Tailwind, no build tools.

**Why:** Zero maintenance burden for the business owner. Opens in any browser. No node_modules. The only external dependency is Google Fonts (loaded via CDN).

## Em Dash Ban

**Decision:** The generator prompt explicitly bans em dashes (U+2014, `&mdash;`).

**Why:** Claude has a tendency to insert em dashes liberally. In generated business websites, they look out of place and overly editorial. The prompt rule forces cleaner punctuation.
