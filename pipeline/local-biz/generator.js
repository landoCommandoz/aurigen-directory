require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { readCSV, writeCSV } = require('./csv-utils');

const SITES_DIR = path.join(__dirname, 'sites');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function buildPrompt(row) {
  const phoneBlock = row.phone
    ? `The phone number is ${row.phone}. Include a prominent tap-to-call button: <a href="tel:${row.phone}"> styled as a large gold pill-shaped button with hover glow.`
    : 'No phone number available. Omit the tap-to-call button.';

  return `Generate a complete, single-page HTML website for a local business. Return ONLY the raw HTML code. No markdown fences. No explanation. No commentary.

CRITICAL: Do NOT use em dashes anywhere in the output. Not in HTML, not in text content, not in comments. Use periods, commas, or semicolons instead. Never output the character "\u2014" or "&mdash;" under any circumstance.

Business details:
- Name: ${row.business_name}
- Category: ${row.category}
- Address: ${row.address}
- Phone: ${phoneBlock}

DESIGN SYSTEM (follow exactly):

COLOR PALETTE:
- Background: #0d0d0d
- Surface cards: rgba(255,255,255,0.04) with backdrop-filter: blur(16px) and border: 1px solid rgba(255,255,255,0.08)
- Primary accent: #c9a84c (gold)
- Accent hover: #e0c068
- Headline text: #ffffff
- Body text: #d1d1d1
- Muted text: #888888

TYPOGRAPHY (load from Google Fonts):
- Import: Bebas Neue (headlines), Playfair Display 700 (subheadlines), DM Sans 400/500/600 (body)
- Hero business name: Bebas Neue, font-size clamp(4rem, 10vw, 9rem), letter-spacing: 0.04em, text-transform: uppercase, color: #ffffff
- Hero tagline: Playfair Display, font-size clamp(1rem, 2.5vw, 1.5rem), color: #c9a84c, font-style: italic
- Section headings: Bebas Neue, font-size clamp(2rem, 5vw, 3.5rem), letter-spacing: 0.03em, text-transform: uppercase
- Body text: DM Sans, font-size 1rem, line-height 1.7, color: #d1d1d1

LAYOUT STRUCTURE:

1. HERO (100vh, display: flex, align-items: center, justify-content: center, text-align: center)
   - Business name as the dominant visual element, oversized
   - One-line tagline below in gold italic Playfair Display (generate something fitting for the category)
   - Subtle radial gradient overlay from center: rgba(201,168,76,0.06) fading to transparent
   - If phone exists, place the gold tap-to-call pill button below the tagline with padding: 14px 40px, border-radius: 50px, font-family DM Sans 600, font-size 1.1rem, background: #c9a84c, color: #0d0d0d, transition: all 0.3s ease. On hover: background #e0c068, box-shadow: 0 0 30px rgba(201,168,76,0.4), transform: translateY(-2px)

2. SERVICES SECTION
   - Section heading centered
   - Magazine-style grid: display: grid, grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)), gap: 24px, max-width: 1100px, margin: 0 auto
   - Each service in a glassmorphism card: background rgba(255,255,255,0.04), backdrop-filter: blur(16px), border: 1px solid rgba(255,255,255,0.08), border-radius: 16px, padding: 32px
   - Card hover: border-color rgba(201,168,76,0.3), box-shadow: 0 8px 32px rgba(0,0,0,0.3), transform: translateY(-4px), transition: all 0.4s ease
   - Each card: service name in DM Sans 600 white, short 2-sentence description in #d1d1d1
   - Generate 4 services relevant to the business category. Write natural, specific copy. No filler.

3. ABOUT SECTION
   - Max-width: 720px, centered
   - One glassmorphism card with the business story (3-4 sentences, genuine tone, written as if the owner is speaking). Mention the city/area. No corporate jargon.

4. CONTACT SECTION
   - Display the full address in muted text
   - Contact form inside a glassmorphism card, max-width: 560px, centered
   - Form fields: Name, Email, Message (textarea). Each input: background rgba(255,255,255,0.06), border: 1px solid rgba(255,255,255,0.1), border-radius: 10px, padding: 14px 18px, color: #ffffff, font-family: DM Sans, font-size: 1rem. On focus: border-color #c9a84c, outline: none, box-shadow: 0 0 0 2px rgba(201,168,76,0.2)
   - Submit button: same gold pill style as the tap-to-call button. Text: "Send Message"
   - form action="#" method="POST"

5. FOOTER
   - Simple centered text: business name, current year, muted color
   - No links, no clutter

ANIMATIONS:
- Add a CSS class .fade-up with: opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease;
- Add .fade-up.visible with: opacity: 1; transform: translateY(0);
- Apply .fade-up to: each service card, the about card, the contact card, section headings
- Stagger the cards using transition-delay: 0s on the first, 0.15s on the second, 0.3s on the third, 0.45s on the fourth
- Include a small inline <script> at the bottom that uses IntersectionObserver to add the "visible" class when elements enter the viewport with threshold 0.15

RESPONSIVE:
- All sections: padding 80px 24px
- On screens below 768px: hero name font-size drops via clamp, grid goes single column, card padding 24px
- The page must look cinematic on desktop and clean on mobile

GLOBAL:
- *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
- html { scroll-behavior: smooth; }
- body { background: #0d0d0d; color: #d1d1d1; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
- All CSS in a single <style> tag in <head>
- Include <meta name="viewport" content="width=device-width, initial-scale=1">
- Include <meta charset="UTF-8">
- <title> is the business name

FINAL REMINDER: No em dashes anywhere. Not one. Use periods or commas instead. Write all copy in a warm, confident, human tone. No marketing buzzwords. No "premier" or "solutions" or "leverage." Write like a real person who is good at what they do.`;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY not set. Add it to pipeline/local-biz/.env');
    process.exit(1);
  }

  const client = new Anthropic();
  const rows = readCSV('leads.csv');

  if (rows.length === 0) {
    console.log('No leads found. Run scraper.js first.');
    return;
  }

  if (!fs.existsSync(SITES_DIR)) {
    fs.mkdirSync(SITES_DIR, { recursive: true });
  }

  const columns = Object.keys(rows[0]);
  if (!columns.includes('local_file')) columns.push('local_file');

  let generated = 0;

  for (const row of rows) {
    if (row.local_file) {
      console.log(`SKIP: ${row.business_name} (already generated)`);
      continue;
    }

    console.log(`Generating site for: ${row.business_name}...`);

    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [
          { role: 'user', content: buildPrompt(row) }
        ]
      });

      let html = message.content[0].text;

      // Strip markdown fences if present
      html = html.replace(/^```html?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

      const slug = slugify(row.business_name);
      const filename = `${slug}.html`;
      const filePath = path.join(SITES_DIR, filename);

      fs.writeFileSync(filePath, html, 'utf-8');
      row.local_file = `sites/${filename}`;
      generated++;

      console.log(`  SAVED: ${filePath}`);
    } catch (err) {
      console.warn(`  ERROR: ${row.business_name} — ${err.message} — skipping`);
    }
  }

  writeCSV('leads.csv', rows, columns);
  console.log(`\nGenerated ${generated} sites. leads.csv updated.`);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
