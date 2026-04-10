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
   - **TWILIO_ACCOUNT_SID** / **TWILIO_AUTH_TOKEN** - [Twilio Console](https://console.twilio.com/)
   - **TWILIO_WHATSAPP_FROM** / **TWILIO_WHATSAPP_TO** - Pre-filled in `.env.example`

4. Set up the Twilio WhatsApp webhook:
   - Expose port 3001 publicly (e.g. `ngrok http 3001`)
   - In Twilio Console > Messaging > WhatsApp sandbox settings
   - Set **When a message comes in** to `https://YOUR_NGROK_URL/webhook`
   - Method: **POST**

## Run the Pipeline

```bash
# Run the full pipeline (scrape + generate + deploy + WhatsApp approval)
node run-all.js "plumber" "Salt Lake City UT"
```

Or run each step individually:
```bash
node scraper.js "plumber" "Salt Lake City UT"   # Step 1: Find leads + download photos
node generator.js                                # Step 2: Generate sites with Claude
node deployer.js                                 # Step 3: Deploy to Netlify
node approver.js                                 # Step 4: WhatsApp approval + email
node emailbuilder.js                             # Alt Step 4: Skip approval, email all
```

npm scripts:
```bash
npm run all -- "plumber" "Salt Lake City UT"
npm run scrape -- "plumber" "Salt Lake City UT"
npm run generate
npm run deploy
npm run approve
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

4. **approver.js** - Sends each deployed lead to Lando via WhatsApp for approval. Starts a local Express webhook on port 3001. YES generates the outreach email, NO skips. 10-minute timeout per lead.

5. **emailbuilder.js** - Generates personalized cold emails with niche-specific hooks. Validates tone, formatting, and banned words. Saves each email as a separate `.txt` file. Can run standalone (emails all leads) or is called by `approver.js` for individual leads.

## Re-running

Each script is idempotent. It skips rows that already have the data it would add. Safe to re-run without duplicating work.

## WhatsApp Approval Flow

When `approver.js` runs (or `run-all.js` reaches step 4), it:
1. Starts a webhook server on port 3001
2. Sends a WhatsApp message for each deployed lead
3. Waits up to 10 minutes for your reply
4. **YES** - generates the outreach email and confirms via WhatsApp
5. **NO** - skips the lead
6. **No reply** - marks as pending and moves on

Approval status is saved to `leads.csv` in the `approval_status` column (`approved`, `skipped`, `pending`, `send_failed`).

You need a public URL pointing to port 3001 for Twilio to reach the webhook. Use ngrok or a similar tunnel:
```bash
ngrok http 3001
```
Then paste the HTTPS URL (e.g. `https://abc123.ngrok.io/webhook`) into your Twilio WhatsApp sandbox settings.

## Requirements

- Node.js 18+ (uses native `fetch`)
- Google Places API key (scraper)
- Anthropic API key (generator)
- Netlify Personal Access Token (deployer)
- Twilio account with WhatsApp sandbox (approver)
