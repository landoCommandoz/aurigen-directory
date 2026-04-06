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
  return `Generate a complete, single-page HTML website for a local business. Return ONLY the HTML code — no markdown fences, no explanation.

Business details:
- Name: ${row.business_name}
- Category: ${row.category}
- Address: ${row.address}
- Phone: ${row.phone || 'Not provided'}

Requirements:
1. Dark background (#0d0d0d), off-white text (#f5f5f5), gold accent (#d4a843)
2. Bold, modern typography using system fonts (font-family: 'Segoe UI', system-ui, sans-serif)
3. Fully responsive — mobile-first design
4. Sections: Hero with business name and tagline, Services (3-4 relevant to the category), About, Contact
5. If phone is provided, include a tap-to-call link: <a href="tel:${row.phone}">${row.phone}</a>
6. Display the full address
7. Simple contact form (name, email, message) with a styled submit button — form action="#"
8. Professional, clean layout with good spacing
9. All CSS inline in a <style> tag — no external dependencies
10. Include a <meta name="viewport" content="width=device-width, initial-scale=1"> tag`;
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
        max_tokens: 4096,
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
