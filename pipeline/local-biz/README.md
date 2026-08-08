# Local Business Pipeline

Finds local businesses with no website, builds each one a live demo site, and prints a call sheet so Brian can close them over the phone.

**Runs on $0.** Surge hosting is free, Google Places includes $200/month of free usage, and the demo sites can be generated through Claude Code instead of the paid API (see Zero-Budget Mode).

## The Play

1. Scrape a niche in a city — keep only businesses with **no website**
2. Generate a custom one-page site for each one from their real reviews, photos, and hours
3. Deploy every site free to `<business-name>.surge.sh`
4. Print a call sheet per business into `calls/`
5. **Brian calls**, opens with the niche script, texts the live link, closes at $99/month
6. On a YES, build their production site on **Higgsfield** — free Cloudflare hosting, so the monthly fee is pure margin

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Key | Where to get it | Cost |
|-----|-----------------|------|
| `GOOGLE_PLACES_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com/) → enable Places API | Free ($200/mo credit) |
| `SURGE_LOGIN` / `SURGE_TOKEN` | `npx surge login` then `npx surge token` | Free |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) | Optional — see Zero-Budget Mode |

## Run

```bash
# Full pipeline in one shot
node run-all.js "plumber" "Salt Lake City UT"
```

Or step by step:

```bash
node scraper.js "plumber" "Salt Lake City UT"   # 1. Find leads + download photos
node generator.js                                # 2. Write each site with Claude
node deployer.js                                 # 3. Deploy free to Surge
node callsheet.js                                # 4. Print call sheets for Brian
node emailbuilder.js                             # Optional: follow-up emails
```

npm scripts: `npm run all -- "plumber" "Salt Lake City UT"`, `npm run scrape -- ...`, `npm run generate`, `npm run deploy`, `npm run calls`, `npm run email`.

## Output

| Path | Created by | What it is |
|------|-----------|------------|
| `leads.csv` | scraper | All business data; generator and deployer add columns |
| `sites/*.html` | generator | Dark-themed one-page demo sites |
| `sites/*.jpg` | scraper | Google Places photos |
| `calls/*.txt` | callsheet | One call sheet per business for Brian |
| `emails/*.txt` | emailbuilder | Optional follow-up emails (copy/paste into Gmail) |

## What's on a Call Sheet

Everything Brian needs before dialing:

- Phone, address, rating, review count, today's hours, and the live demo URL
- A niche-specific opening line (plumber, HVAC, landscaper, cleaning, mechanic, electrician, contractor, salon, restaurant — generic fallback for everything else)
- Why this business needs a site, backed by their own review count and rating
- Word-for-word responses for YES / "what's the catch" / "I'll think about it" / NO
- Their best review quotes to reference mid-call
- Full business hours so he calls when they actually pick up

Leads with no phone number get flagged in the run output so Brian can hunt the number down first.

## Zero-Budget Mode

`generator.js` calls the Anthropic API, which costs money per site. No credits? Skip it:

1. Run `scraper.js` as normal
2. Open this folder in **Claude Code** and say: *"Read leads.csv and write a site for each lead into sites/, following the design rules and prompt in generator.js. Then fill in the local_file column in leads.csv."*
3. Continue with `deployer.js` and `callsheet.js`

Same output, no API bill — it runs on the Claude subscription instead.

## After the YES — Higgsfield

The Surge demo is disposable bait. The real deliverable gets built on **Higgsfield**, which hosts full production sites on Cloudflare for free:

1. In Claude Code with the Higgsfield connector, say: *"Build a production website for [business] on Higgsfield"* — it scaffolds, builds, and deploys to its own subdomain
2. No hosting bill, ever — the client's $99/month is pure margin
3. Rough Google photos on a hot lead? Higgsfield image generation can produce professional hero shots (uses Higgsfield credits) — worth doing before the demo deploy on leads you really want

## Re-running

Every script is idempotent — it skips rows that already have its output (existing sites, live URLs, written call sheets). Safe to re-run after a crash or a new scrape; only new leads get processed.

## Requirements

- Node 18+ (native `fetch`)
- Google Places API key — free tier
- Surge account — free, no card needed
- Anthropic API key — optional (Zero-Budget Mode above)
- Higgsfield account — optional, for client production sites + AI photos
