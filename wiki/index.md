# Local-Biz Pipeline Wiki

Knowledge base for the automated local business website pipeline.

**What this pipeline does:** Finds local businesses without websites, generates a dark-themed one-page site for each, deploys it to Netlify, and generates cold outreach emails.

**Location in repo:** `pipeline/local-biz/`

## Pages

| Page | Description |
|------|-------------|
| [architecture](pages/architecture.md) | Pipeline design, file roles, data flow, orchestrator |
| [niche-results](pages/niche-results.md) | Niche testing results by city, saturation signals |
| [prompt-versions](pages/prompt-versions.md) | Generator prompt changelog |
| [deployed-sites](pages/deployed-sites.md) | Every deployed site with status |
| [known-issues](pages/known-issues.md) | Bugs, fixes, and open items |
| [pipeline-decisions](pages/pipeline-decisions.md) | Key design decisions and rationale |

## Quick Reference

- **Run the pipeline:** `cd pipeline/local-biz && node scraper.js "niche" "City ST" && node generator.js && node deployer.js && node emailbuilder.js`
- **API keys needed:** `GOOGLE_PLACES_API_KEY`, `ANTHROPIC_API_KEY`, `NETLIFY_API_KEY` (in `pipeline/local-biz/.env`)
- **Output files:** `leads.csv`, `sites/*.html`, `emails.csv`
- **Max leads per scrape:** 20
- **Generator model:** claude-sonnet-4-20250514

## Session Log

See [log.md](log.md) for full session history.
