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

const NICHE_COLORS = {
  // Plumbing: deep reliable blue
  plumber:            { accent: '#4A90D9', light: '#6AABEF', glow: 'rgba(74,144,217,0.15)', border: 'rgba(74,144,217,0.3)' },
  plumbing:           { accent: '#4A90D9', light: '#6AABEF', glow: 'rgba(74,144,217,0.15)', border: 'rgba(74,144,217,0.3)' },
  // HVAC: warm orange (heat + cool)
  hvac:               { accent: '#E07A3A', light: '#F09A5E', glow: 'rgba(224,122,58,0.15)', border: 'rgba(224,122,58,0.3)' },
  'heating and air':  { accent: '#E07A3A', light: '#F09A5E', glow: 'rgba(224,122,58,0.15)', border: 'rgba(224,122,58,0.3)' },
  // Landscaping: natural green
  landscaper:         { accent: '#5BAF5B', light: '#7DCF7D', glow: 'rgba(91,175,91,0.15)', border: 'rgba(91,175,91,0.3)' },
  landscaping:        { accent: '#5BAF5B', light: '#7DCF7D', glow: 'rgba(91,175,91,0.15)', border: 'rgba(91,175,91,0.3)' },
  'lawn care':        { accent: '#5BAF5B', light: '#7DCF7D', glow: 'rgba(91,175,91,0.15)', border: 'rgba(91,175,91,0.3)' },
  // Cleaning: fresh teal
  cleaning:           { accent: '#4ABFBF', light: '#6DD9D9', glow: 'rgba(74,191,191,0.15)', border: 'rgba(74,191,191,0.3)' },
  'cleaning service': { accent: '#4ABFBF', light: '#6DD9D9', glow: 'rgba(74,191,191,0.15)', border: 'rgba(74,191,191,0.3)' },
  maid:               { accent: '#4ABFBF', light: '#6DD9D9', glow: 'rgba(74,191,191,0.15)', border: 'rgba(74,191,191,0.3)' },
  // Mechanic / Auto: industrial red
  mechanic:           { accent: '#D94A4A', light: '#EF6A6A', glow: 'rgba(217,74,74,0.15)', border: 'rgba(217,74,74,0.3)' },
  'auto repair':      { accent: '#D94A4A', light: '#EF6A6A', glow: 'rgba(217,74,74,0.15)', border: 'rgba(217,74,74,0.3)' },
  'auto shop':        { accent: '#D94A4A', light: '#EF6A6A', glow: 'rgba(217,74,74,0.15)', border: 'rgba(217,74,74,0.3)' },
  'mobile mechanic':  { accent: '#D94A4A', light: '#EF6A6A', glow: 'rgba(217,74,74,0.15)', border: 'rgba(217,74,74,0.3)' },
  // Salon / Hair / Nail: rose pink
  salon:              { accent: '#D97AB5', light: '#EF9AD0', glow: 'rgba(217,122,181,0.15)', border: 'rgba(217,122,181,0.3)' },
  hair:               { accent: '#D97AB5', light: '#EF9AD0', glow: 'rgba(217,122,181,0.15)', border: 'rgba(217,122,181,0.3)' },
  nail:               { accent: '#D97AB5', light: '#EF9AD0', glow: 'rgba(217,122,181,0.15)', border: 'rgba(217,122,181,0.3)' },
  barber:             { accent: '#D97AB5', light: '#EF9AD0', glow: 'rgba(217,122,181,0.15)', border: 'rgba(217,122,181,0.3)' },
  // Restaurant / Food: appetizing amber
  restaurant:         { accent: '#D9A54A', light: '#EFC06A', glow: 'rgba(217,165,74,0.15)', border: 'rgba(217,165,74,0.3)' },
  food:               { accent: '#D9A54A', light: '#EFC06A', glow: 'rgba(217,165,74,0.15)', border: 'rgba(217,165,74,0.3)' },
  // Contractor / Handyman: strong slate blue
  contractor:         { accent: '#5B7BAF', light: '#7D9BCF', glow: 'rgba(91,123,175,0.15)', border: 'rgba(91,123,175,0.3)' },
  'general contractor': { accent: '#5B7BAF', light: '#7D9BCF', glow: 'rgba(91,123,175,0.15)', border: 'rgba(91,123,175,0.3)' },
  handyman:           { accent: '#5B7BAF', light: '#7D9BCF', glow: 'rgba(91,123,175,0.15)', border: 'rgba(91,123,175,0.3)' },
  // Electrician: electric yellow
  electrician:        { accent: '#D9C34A', light: '#EFD96A', glow: 'rgba(217,195,74,0.15)', border: 'rgba(217,195,74,0.3)' },
  electrical:         { accent: '#D9C34A', light: '#EFD96A', glow: 'rgba(217,195,74,0.15)', border: 'rgba(217,195,74,0.3)' }
};

const DEFAULT_COLORS = { accent: '#c9a84c', light: '#e8c96a', glow: 'rgba(201,168,76,0.15)', border: 'rgba(201,168,76,0.3)' };

function getNicheColors(category) {
  const lower = (category || '').toLowerCase();
  if (NICHE_COLORS[lower]) return NICHE_COLORS[lower];
  for (const [key, colors] of Object.entries(NICHE_COLORS)) {
    if (lower.includes(key) || key.includes(lower)) return colors;
  }
  return DEFAULT_COLORS;
}

function buildPrompt(row) {
  // Address: "165 Gregson Ave S, Salt Lake City, UT 84115, USA" -> "Salt Lake City"
  const addressParts = (row.address || '').split(',').map(s => s.trim());
  let city = 'the local area';
  if (addressParts.length >= 3) {
    const candidate = addressParts[addressParts.length - 3];
    if (candidate && !/^\d/.test(candidate)) city = candidate;
  }

  const colors = getNicheColors(row.category);

  const phoneInstruction = row.phone
    ? `Phone: ${row.phone}. This is a real number. Use it in a tap-to-call anchor: <a href="tel:${row.phone}">${row.phone}</a>. Place it in the hero as the primary CTA button, in the contact section, and in the footer.`
    : 'No phone number available. Omit all tap-to-call buttons. Use "Request a Quote" as the hero CTA text instead, linking to the contact form with href="#contact".';

  const tagline = `${row.category} in ${city}`;

  const metaDesc = row.phone
    ? `${row.business_name}. ${row.category} in ${city}. Call ${row.phone}.`
    : `${row.business_name}. ${row.category} in ${city}.`;

  return `You are a world-class front-end developer. Generate a complete single-page HTML website. Return ONLY the raw HTML. No markdown fences. No explanation before or after. The first character of your response must be < and the last must be >.

ABSOLUTE RULE: Zero em dashes in the entire output. Not in text. Not in comments. Not in attributes. The characters U+2014 and &mdash; must never appear. Use periods, commas, or semicolons for all punctuation breaks. This is non-negotiable.

===== BUSINESS DATA (use only this, invent nothing) =====
Name: ${row.business_name}
Category: ${row.category}
Address: ${row.address}
${phoneInstruction}

===== DOCUMENT STRUCTURE =====

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="description" content="${metaDesc}">
  <title>${row.business_name}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>FAVICON_EMOJI</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">

Choose the favicon emoji based on the business category: plumber/plumbing = wrench emoji, contractor/construction = construction crane emoji, landscaper/landscaping/lawn = herb emoji, cleaner/cleaning/maid = sparkles emoji, mechanic/auto repair = nut and bolt emoji. For any other category use star emoji. Place the actual emoji character in the SVG text element replacing FAVICON_EMOJI.
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=Playfair+Display:ital,wght@1,700&display=swap" rel="stylesheet">
  <style>/* all styles here */</style>
</head>
<body>
  <!-- hero, services, about, contact, footer -->
  <script>/* intersection observer only */</script>
</body>
</html>

===== CSS VARIABLES (declare in :root, reference everywhere) =====

:root {
  --bg: #0a0a0a;
  --bg-card: rgba(255,255,255,0.03);
  --bg-card-hover: rgba(255,255,255,0.06);
  --gold: ${colors.accent};
  --gold-light: ${colors.light};
  --gold-glow: ${colors.glow};
  --text-primary: #f0f0f0;
  --text-secondary: #888896;
  --text-muted: #555560;
  --border: rgba(255,255,255,0.07);
  --border-gold: ${colors.border};
  --shadow: 0 8px 40px rgba(0,0,0,0.5);
  --shadow-gold: 0 0 30px ${colors.glow};
  --radius: 12px;
  --radius-pill: 50px;
}

Never hardcode a hex color outside this system. Every color in every rule must reference a variable.

===== GLOBAL RESET =====

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text-secondary); font-family: 'DM Sans', sans-serif; font-weight: 300; line-height: 1.7; overflow-x: hidden; font-size: clamp(0.95rem, 2vw, 1.1rem); }

===== TYPOGRAPHY =====

- Bebas Neue: all headings, uppercase, letter-spacing 0.05em
- Playfair Display italic 700: tagline text only, gold
- DM Sans 300: paragraphs. DM Sans 500: labels, nav, small text. DM Sans 700: buttons.
- Hero business name: font-family 'Bebas Neue', cursive; font-size clamp(3.5rem, 10vw, 8rem); letter-spacing 0.05em; text-transform uppercase; color var(--text-primary); line-height 0.95;
- Section headings: font-family 'Bebas Neue', cursive; font-size clamp(2rem, 5vw, 4rem); letter-spacing 0.05em; text-transform uppercase; color var(--text-primary); margin-bottom 16px;
- Never fall back to system fonts. Always specify the loaded font first.

===== HERO SECTION =====

- Height: 100dvh. Display flex, align-items center, justify-content center. Text-align center.
- Background: var(--bg) with a radial-gradient overlay: radial-gradient(ellipse at 50% 40%, var(--gold-glow) 0%, transparent 70%)
- Content stacked vertically: business name, tagline, CTA button.
- Business name: the specs above. It must dominate the screen.
- Tagline: "${tagline}" in Playfair Display italic 700, color var(--gold), font-size clamp(1rem, 2.5vw, 1.4rem). This is factual, not invented.
- CTA button (below tagline, margin-top 32px): ${row.phone ? `Text: "${row.phone}" (just the phone number, no prefix). Wrap in <a href="tel:${row.phone}">` : 'Text: "Request a Quote". Wrap in <a href="#contact">'}. Style: display inline-block, background var(--gold), color var(--bg), font-family 'DM Sans', font-weight 700, font-size 1.1rem, padding 16px 44px, border-radius var(--radius-pill), border none, cursor pointer, text-decoration none, transition all 0.2s ease. Hover: background var(--gold-light), transform scale(1.03), box-shadow var(--shadow-gold).
- Hero load animation: the three elements (name, tagline, button) start at opacity 0 + translateY(20px) and animate to opacity 1 + translateY(0) with 0.8s ease-out. Stagger: name 0s delay, tagline 0.15s, button 0.3s. Use CSS @keyframes named heroFadeUp, applied with animation property (not transition, so it runs on load).
- No images. No stock photos. No placeholder images. No img tags in the hero.
- No empty space below the hero. The services section should begin within one natural scroll.

===== SERVICES SECTION =====

- The services section must have a border-top: 1px solid var(--border-gold) to visually separate it from the hero. This thin gold line sits at the very top of the section.
- Section heading: "OUR SERVICES" centered, using the section heading specs above.
- Grid: display grid, grid-template-columns repeat(auto-fit, minmax(280px, 1fr)), gap 24px, max-width 1100px, margin 0 auto, padding 0 24px, align-items stretch (so all cards in the same row match height).
- Cards: background var(--bg-card), backdrop-filter blur(12px), -webkit-backdrop-filter blur(12px), border 1px solid var(--border), border-radius var(--radius), padding 32px.
- Card hover: background var(--bg-card-hover), border-color var(--border-gold), transform translateY(-4px), box-shadow var(--shadow-gold), transition all 0.25s ease.
- Inside each card: service name in Bebas Neue, font-size 1.4rem, color var(--gold), letter-spacing 0.03em, margin-bottom 8px. Description in DM Sans 300, color var(--text-secondary), two sentences max.
- CRITICAL TONE RULE FOR SERVICE DESCRIPTIONS: Write like the tradesperson themselves, not a copywriter. Short punchy sentences. Real language. Match the energy of the trade. A mobile mechanic says "Your engine dies at 2am, we come to you." A plumber says "Burst pipe flooding your kitchen. We fix it fast." A landscaper says "Overgrown yard dragging your house down. We clean it up." A contractor says "That remodel you keep putting off. Let's get it done." Never say "comprehensive", "complete", "professional services", "diagnostics and repair services", or any other corporate filler. Every description should sound like it came from someone who actually does the work, not someone who writes about it.
- Generate 3 to 6 services. Infer intelligently from the category "${row.category}". Every service must plausibly belong to this type of business. No filler. No generic "consulting" unless it's a consulting firm.
- If only one card would land on the last row, give it grid-column: 1 / -1 using a :last-child:nth-child(odd) selector or similar.
- Each card gets the .fade-up class for scroll animation, staggered with transition-delay: nth-child(1) 0s, nth-child(2) 0.1s, nth-child(3) 0.2s, nth-child(4) 0.3s, nth-child(5) 0.4s, nth-child(6) 0.5s.

===== ABOUT SECTION =====

- Section heading: "ABOUT US" centered.
- Content in a glassmorphism card (same card style as services), max-width 720px, centered.
- STRICT COPY RULES: Do NOT fabricate a backstory. Do NOT invent years in business, employee counts, awards, certifications, founding stories, or owner names. You know ONLY: the business name, category, city, and address.
- Write exactly two sentences:
  1. "[Business Name] provides [category] services to homes and businesses throughout [city] and the surrounding area."
  2. ${row.phone ? `"Call us at ${row.phone} to get started on your next project."` : '"Reach out through the form below to get started on your next project."'}
- That is the entire about section. Nothing more.

===== CONTACT SECTION =====

- id="contact" on the section element.
- Section heading: "GET IN TOUCH" centered.
- Two-column layout on desktop (display grid, grid-template-columns 1fr 1fr, gap 48px, max-width 900px, centered). Stacks to single column below 768px.
- Left column: contact info card (glassmorphism). Contains:
  ${row.phone ? `- Phone: <a href="tel:${row.phone}" style with color var(--gold), text-decoration none, hover color var(--gold-light)>${row.phone}</a>` : '- No phone line.'}
  - Address: ${row.address} in var(--text-secondary)
  - Hours: "Contact us for current hours" in var(--text-muted). Do NOT invent hours.
- Right column: form card (glassmorphism). form action="#" method="POST".
  - Fields: Name (input text), Email (input email), Message (textarea, 5 rows).
  - All inputs: width 100%, background rgba(255,255,255,0.05), border 1px solid var(--border), border-radius var(--radius), color var(--text-primary), font-family 'DM Sans', font-size 1rem, font-weight 300, padding 14px 16px, margin-bottom 16px, transition border-color 0.2s ease, box-shadow 0.2s ease.
  - Focus state: border-color var(--gold), outline none, box-shadow 0 0 0 3px var(--gold-glow).
  - Labels: DM Sans 500, var(--text-secondary), font-size 0.85rem, margin-bottom 6px, display block.
  - Submit button: full width, same gold pill style as hero CTA. Text: "Send Message". Min-height 48px.
- Both columns get .fade-up class.

===== SECTION DIVIDERS =====

Between each major section, add a divider: a div with max-width 200px, height 1px, background linear-gradient(to right, transparent, var(--border), transparent), margin 0 auto.

===== FOOTER =====

- Background: #060606 (this is the one exception to the variable rule, it's darker than --bg for contrast).
- border-top: 1px solid var(--border-gold).
- Padding: 40px 24px. Text-align center.
- Business name: Bebas Neue, font-size 1.2rem, var(--text-muted), letter-spacing 0.05em, margin-bottom 8px.
${row.phone ? `- Phone: tap-to-call link in var(--text-muted), hover color var(--gold).` : ''}
- Address: one line, var(--text-muted), font-size 0.85rem.
- Copyright: "\\u00A9 " + current year via <script>document.write(new Date().getFullYear())</script> + " ${row.business_name}". var(--text-muted), font-size 0.8rem, margin-top 16px.
- No social media icons. No "Powered by" text. No links except the phone.

===== SCROLL PROGRESS BAR =====

Add a div with id="scroll-progress" as the first child of body. Style it: position fixed, top 0, left 0, height 2px, width 0%, background var(--gold), z-index 9999, transition none, pointer-events none.

In the script tag, add a scroll event listener on window that calculates scroll percentage: (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 and sets the width of #scroll-progress to that percentage + "%".

===== SCROLL ANIMATION SCRIPT =====

Single script tag before </body> that includes BOTH the scroll progress bar logic AND the IntersectionObserver. IntersectionObserver with threshold 0.15. Observes all .fade-up elements. Adds class "visible" when intersecting. unobserve after triggering.

CSS for .fade-up: opacity 0, transform translateY(30px), transition opacity 0.6s ease, transform 0.6s ease.
CSS for .fade-up.visible: opacity 1, transform translateY(0).
The transition-delay on individual cards handles the stagger.

===== SECTION PADDING =====

All sections: padding 60px 24px on desktop. padding 40px 20px below 768px.
Max content width within sections: 1100px, margin 0 auto.

===== FINAL CHECKS =====

Before outputting, verify:
1. Zero em dashes in the entire document.
2. Every color references a CSS variable (except footer background #060606).
3. No fabricated content. No invented history, stats, reviews, or claims.
4. No img tags anywhere.
5. No console.log statements.
6. No comments that reference generation or AI.
7. All fonts loaded via link tag, not @import.
8. The HTML is complete and valid. Opens with <!DOCTYPE html>, closes with </html>.
9. Every interactive element has a hover state with transition.
10. The page looks cinematic at 1440px and clean at 375px.`;
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
