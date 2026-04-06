# Pipeline Session Log

Reverse chronological. Newest entries at top.

---

## 2026-04-06 — Deployer Hardening (2 fixes)

**What happened:**
- Name collision handling: when Netlify 422 means "taken by another account" (not ours), retry with city suffix then state suffix. Example: `ravenhaus-mobile` → `ravenhaus-mobile-stgeorge` → `ravenhaus-mobile-ut`. Logs which name succeeded.
- Deploy delay bumped from 30s to 45s to stop hitting Netlify 429 rate limits.

**Files changed:** `pipeline/local-biz/deployer.js`
**Wiki pages updated:** `pages/known-issues.md`

---

## 2026-04-06 — Generator Hardening (4 fixes)

**What happened:**
- HTML validation: after generation, checks for doctype, `<head>`, `<body>`, and `</html>`. Truncated or malformed output is deleted and skipped.
- Em dash post-processing: strips U+2014 and `&mdash;` from generated HTML, replacing with hyphens. No longer relying on prompt compliance alone.
- Max tokens bumped from 8192 to 16000 to prevent silent truncation on complex sites.
- Photo URL validation: HEAD request before full download. If the URL returns non-200, photo is skipped silently.

**Files changed:** `pipeline/local-biz/generator.js`
**Wiki pages updated:** `pages/prompt-versions.md`, `pages/known-issues.md`

---

## 2026-04-06 — Wiki Initialization

**What happened:**
- Created wiki structure (`wiki/`, `raw/`, `pages/`)
- Ingested all existing knowledge from codebase into organized pages
- Documented current pipeline architecture, prompt version history, niche color system, deployed sites, and known issues

**Pages created:**
- `pages/architecture.md` — Pipeline design, file roles, orchestrator system
- `pages/niche-results.md` — Niche tracking by city and saturation signals
- `pages/prompt-versions.md` — Generator prompt version history
- `pages/deployed-sites.md` — Deployed site registry with status
- `pages/known-issues.md` — Bugs, fixes, and open items
- `pages/pipeline-decisions.md` — Key design decisions and rationale

**Status:** Pipeline has 4 scripts (scraper, generator, deployer, emailbuilder), 1 deployed test site (ogden-handyman.html), niche-specific color system covering 12 niches, and a separate agentic orchestrator for the main Aurigen directory product.

---
