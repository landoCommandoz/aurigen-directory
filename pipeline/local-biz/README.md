# Local Business Pipeline

Four-script pipeline that finds local businesses without websites, generates premium sites using AI, deploys them live, and drafts personalized cold outreach emails.

## Setup

1. Clone and install:
   ```bash
   git clone https://github.com/landoCommandoz/local-biz-pipeline.git
   cd local-biz-pipeline
   npm install
   ```

2. Create your `.env`:
   ```bash
   cp .env.example .env
   ```

3. Add your API keys to `.env`:
   - **GOOGLE_PLACES_API_KEY** - [Google Cloud Console](https://console.cloud.google.com/) > enable Places API
   - **ANTHROPIC_API_KEY** - [Anthropic Console](https://console.anthropic.com/)
   - **NETLIFY_API_KEY** - [Netlify User Settings](https://app.netlify.com/user/applications) > Personal Access Token

## Run the Pipeline

```bash
# Step 1: Find businesses without websites + download their photos
node scraper.js "plumber" "Salt Lake City UT"

# Step 2: Generate a dark-themed site for each lead using Claude
node generator.js

# Step 3: Deploy each site (HTML + photos) to Netlify
node deployer.js

# Step 4: Generate personalized cold outreach emails
node emailbuilder.js
```

Or use npm scripts:
```bash
npm run scrape -- "plumber" "Salt Lake City UT"
npm run generate
npm run deploy
npm run email
```

## Output

| Path | Created By | Description |
|------|-----------|-------------|
| `leads.csv` | scraper | Business data, updated by generator and deployer |
| `sites/*.html` | generator | Dark-themed one-page websites |
| `sites/*.jpg` | scraper | Google Places photos for each business |
| `emails/*.txt` | emailbuilder | Individual cold outreach emails |

## How It Works

1. **scraper.js** - Queries Google Places API, filters for businesses without websites, downloads up to 3 photos per business, writes everything to `leads.csv`.

2. **generator.js** - Reads `leads.csv` and builds a unique Claude prompt for each business using their real reviews, hours, photos, and rating. No templates. Every site is written specifically for that business. Includes exponential backoff retry on rate limits.

3. **deployer.js** - Creates Netlify sites and deploys all files (HTML + photos) so images load from the CDN. Writes live URLs back to `leads.csv`.

4. **emailbuilder.js** - Generates personalized cold emails with niche-specific hooks. Validates tone, formatting, and banned words. Saves each email as a separate `.txt` file.

## Re-running

Each script is idempotent. It skips rows that already have the data it would add. Safe to re-run without duplicating work.

## Requirements

- Node.js 18+ (uses native `fetch`)
- Google Places API key (scraper)
- Anthropic API key (generator)
- Netlify Personal Access Token (deployer)
