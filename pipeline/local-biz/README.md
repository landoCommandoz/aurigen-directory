# Local Business Website Automation Pipeline

Four-script pipeline that finds local businesses without websites, builds them a site, deploys it live, and generates cold outreach emails.

## Setup

1. Install dependencies from the project root:
   ```bash
   cd /path/to/aurigen-directory
   npm install
   ```

2. Create your `.env` file in `pipeline/local-biz/`:
   ```bash
   cp pipeline/local-biz/.env.example pipeline/local-biz/.env
   ```

3. Add your API keys to `pipeline/local-biz/.env`:
   - **GOOGLE_PLACES_API_KEY** — [Google Cloud Console](https://console.cloud.google.com/) → enable Places API
   - **ANTHROPIC_API_KEY** — [Anthropic Console](https://console.anthropic.com/)
   - **NETLIFY_API_KEY** — [Netlify User Settings](https://app.netlify.com/user/applications) → Personal Access Token

## Run the Pipeline

Execute each script in order from the `pipeline/local-biz/` directory:

```bash
cd pipeline/local-biz

# Step 1: Find businesses without websites
node scraper.js "plumber" "Salt Lake City UT"

# Step 2: Generate a website for each lead
node generator.js

# Step 3: Deploy each site to Netlify
node deployer.js

# Step 4: Generate cold outreach emails
node emailbuilder.js
```

## Output Files

| File | Created By | Description |
|------|-----------|-------------|
| `leads.csv` | scraper.js | Business leads — updated by generator.js and deployer.js |
| `sites/*.html` | generator.js | Generated HTML websites |
| `emails.csv` | emailbuilder.js | Ready-to-send cold emails |

## How It Works

1. **scraper.js** — Queries Google Places API for businesses matching your search term + city. Calls Place Details on each result to check for a website. Businesses without one are saved to `leads.csv`.

2. **generator.js** — Reads `leads.csv` and calls Claude (claude-sonnet-4-20250514) to generate a dark-themed, mobile-responsive one-page site per business. Saves HTML files to `sites/` and updates `leads.csv` with file paths.

3. **deployer.js** — Reads `leads.csv`, creates a Netlify site per business, deploys the HTML file, and writes the live URL back to `leads.csv`.

4. **emailbuilder.js** — Reads `leads.csv` for deployed businesses and generates a personalized cold email per lead. Outputs `emails.csv` ready for outreach.

## Re-running

Each script is idempotent — it skips rows that already have the data it would add. You can safely re-run any script without duplicating work.

## Notes

- Max 20 leads per scraper run
- Each script logs progress and skips errors on individual rows without stopping
- All API keys stay in `.env` (never committed)
