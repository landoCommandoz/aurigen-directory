# Pipeline Architecture

## Overview

Four-script sequential pipeline. Each script reads/writes `leads.csv` as the shared state file. Scripts are idempotent — they skip rows that already have the data they would add.

## File Map

```
pipeline/local-biz/
├── .env.example        — Template for API keys
├── .env                — Actual keys (gitignored)
├── .gitignore          — Ignores .env, leads.csv, emails.csv, sites/
├── README.md           — Setup and usage docs
├── csv-utils.js        — Shared CSV read/write helpers
├── scraper.js          — Step 1: Google Places API lead finder
├── generator.js        — Step 2: Claude-powered site generator
├── deployer.js         — Step 3: Netlify deployment
├── emailbuilder.js     — Step 4: Cold email generator
├── leads.csv           — Pipeline state (gitignored)
├── emails.csv          — Email output (gitignored)
└── sites/              — Generated HTML files (gitignored)
```

## Data Flow

```
scraper.js → leads.csv → generator.js → leads.csv + sites/*.html → deployer.js → leads.csv (with URLs) → emailbuilder.js → emails.csv
```

## Script Details

### scraper.js
- **Input:** CLI args: `"search term" "City ST"`
- **APIs:** Google Places Text Search + Place Details
- **Fields retrieved:** name, address, phone, website, rating, review_count, photos, reviews
- **Logic:** Filters to businesses with NO website. Max 20 leads per run.
- **Output:** Appends to `leads.csv`

### generator.js
- **Input:** `leads.csv` rows missing `site_file` column
- **API:** Anthropic (claude-sonnet-4-20250514)
- **Logic:** Builds a detailed prompt per business using real data (name, category, address, phone, rating, photos, reviews). Generates a complete single-page HTML site. Saves to `sites/{slug}.html`.
- **Output:** Updates `leads.csv` with `site_file` path
- **Key feature:** Niche-specific color palettes (12 niches mapped to distinct accent colors)

### deployer.js
- **Input:** `leads.csv` rows with `site_file` but no `deployed_url`
- **API:** Netlify REST API (create site, deploy via file digest)
- **Logic:** Creates a Netlify site per business, deploys the HTML, writes the live URL back.
- **Output:** Updates `leads.csv` with `deployed_url`

### emailbuilder.js
- **Input:** `leads.csv` rows with `deployed_url` but no entry in `emails.csv`
- **API:** Anthropic (for email generation)
- **Logic:** Niche-specific hooks and bridges (12+ niches with custom cold email openers). Generates personalized 4-paragraph email per lead.
- **Output:** Writes to `emails.csv`

## Separate System: Agentic Orchestrator

The repo also contains `pipeline/orchestrator.js` — a separate agentic pipeline for the main Aurigen directory product (not the local-biz pipeline). It uses Design Agent, Code Agent, and QA Agent to propose and implement improvements to the directory app. Config is in `pipeline/config.js`. This is unrelated to the local-biz website generator.
