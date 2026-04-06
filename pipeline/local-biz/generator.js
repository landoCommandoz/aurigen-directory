require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');
const { readCSV, writeCSV } = require('./csv-utils');

const SITES_DIR = path.join(__dirname, 'sites');

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function parseCity(address) {
  const parts = (address || '').split(',').map(s => s.trim());
  if (parts.length >= 3) {
    const candidate = parts[parts.length - 3];
    if (candidate && !/^\d/.test(candidate)) return candidate;
  }
  return 'the local area';
}

// ---------------------------------------------------------------------------
// NICHE ROUTING
// ---------------------------------------------------------------------------

const NICHES = {
  mechanic: {
    keywords: ['mechanic', 'auto', 'repair'],
    color: { accent: '#D94A4A', light: '#EF6A6A', glow: 'rgba(217,74,74,0.15)', border: 'rgba(217,74,74,0.3)' },
    emoji: '\uD83D\uDD29',
    heroHeadline: (name) => name.toUpperCase(),
    ctaText: 'CALL NOW',
    aboutVoice: (name, category, city, phone) =>
      `We're ${name}. We come to you. Doesn't matter if it's your driveway, a parking lot, or the side of the road. ${city} is our shop. ${phone ? `Call ${phone} and we'll be there.` : 'Reach out and we will be there.'}`,
    serviceStyle: 'No-nonsense. Direct. "Engine won\'t start at 2am. We come to you." Short, punchy, zero fluff.',
    suggestedServices: ['Engine Diagnostics', 'Brake Repair', 'Oil Changes', 'Battery and Electrical', 'Transmission Work', 'Pre-Purchase Inspections']
  },
  handyman: {
    keywords: ['handyman', 'contractor', 'general contractor', 'remodel'],
    color: { accent: '#5B7BAF', light: '#7D9BCF', glow: 'rgba(91,123,175,0.15)', border: 'rgba(91,123,175,0.3)' },
    emoji: '\uD83D\uDD28',
    heroHeadline: (name) => name.toUpperCase(),
    ctaText: 'CALL NOW',
    aboutVoice: (name, category, city, phone) =>
      `We're ${name}, and we handle repairs, remodels, and everything in between across ${city}. We answer our phone, we show up when we say we will, and we clean up after ourselves. ${phone ? `Give us a call at ${phone} and let's figure out what you need.` : 'Fill out the form below and we will get back to you.'}`,
    serviceStyle: 'Confident tradesperson. "That bathroom you keep putting off. Let\'s get it done." Real language, not brochure copy.',
    suggestedServices: ['Home Repairs', 'Bathroom Remodels', 'Deck and Fence', 'Painting', 'Doors and Windows', 'Odd Jobs']
  },
  cleaning: {
    keywords: ['pressure', 'washing', 'window', 'clean', 'power wash'],
    color: { accent: '#4ABFBF', light: '#6DD9D9', glow: 'rgba(74,191,191,0.15)', border: 'rgba(74,191,191,0.3)' },
    emoji: '\u2728',
    heroHeadline: (name) => name.toUpperCase(),
    ctaText: 'GET A FREE QUOTE',
    aboutVoice: (name, category, city, phone) =>
      `${name} keeps properties looking their best across ${city} and the surrounding area. Driveways, siding, windows, gutters. If it's dirty, we make it look new. ${phone ? `Call ${phone} for a free estimate.` : 'Send us a message for a free estimate.'}`,
    serviceStyle: 'Before/after energy. "Your driveway hasn\'t looked this good since the day it was poured." Visual, satisfying, results-focused.',
    suggestedServices: ['Pressure Washing', 'Window Cleaning', 'Gutter Cleaning', 'Roof Washing', 'Deck Restoration', 'Commercial Exterior']
  },
  fencing: {
    keywords: ['fence', 'fencing'],
    color: { accent: '#8B7355', light: '#A8906E', glow: 'rgba(139,115,85,0.15)', border: 'rgba(139,115,85,0.3)' },
    emoji: '\uD83C\uDFE1',
    heroHeadline: (name) => name.toUpperCase(),
    ctaText: 'GET A FREE QUOTE',
    aboutVoice: (name, category, city, phone) =>
      `${name} builds fences across ${city}. Wood, vinyl, chain link, iron. We measure it, we build it, we make sure it's straight. ${phone ? `Call ${phone} to get started.` : 'Send us a message to get started.'}`,
    serviceStyle: 'Straightforward craftsman. "Cedar privacy fence. 6 foot. Installed in a day." Practical, no poetry.',
    suggestedServices: ['Wood Privacy Fencing', 'Chain Link', 'Vinyl Fencing', 'Iron and Metal', 'Gate Installation', 'Fence Repair']
  },
  junk: {
    keywords: ['junk', 'haul', 'removal', 'dump', 'trash'],
    color: { accent: '#D9A54A', light: '#EFC06A', glow: 'rgba(217,165,74,0.15)', border: 'rgba(217,165,74,0.3)' },
    emoji: '\uD83D\uDE9A',
    heroHeadline: (name) => name.toUpperCase(),
    ctaText: 'CALL NOW',
    aboutVoice: (name, category, city, phone) =>
      `${name} hauls away whatever you don't want. Furniture, appliances, yard waste, construction debris. We serve ${city} and everywhere nearby. ${phone ? `Call ${phone} and point at what goes.` : 'Tell us what needs to go.'}`,
    serviceStyle: 'Casual, action-oriented. "Point at it. We load it. It\'s gone." Fast, easy, no hassle.',
    suggestedServices: ['Furniture Removal', 'Appliance Hauling', 'Yard Waste Cleanup', 'Construction Debris', 'Garage Cleanouts', 'Estate Cleanouts']
  }
};

const DEFAULT_NICHE = {
  keywords: [],
  color: { accent: '#c9a84c', light: '#e8c96a', glow: 'rgba(201,168,76,0.15)', border: 'rgba(201,168,76,0.3)' },
  emoji: '\u2B50',
  heroHeadline: (name) => name.toUpperCase(),
  ctaText: 'CALL NOW',
  aboutVoice: (name, category, city, phone) =>
    `${name} provides ${category} services across ${city} and the surrounding area. We're local, we're reliable, and we pick up the phone. ${phone ? `Call ${phone} to get started.` : 'Reach out through the form below.'}`,
  serviceStyle: 'Friendly tradesperson. Direct, warm, no corporate language. Short sentences that sound like a real person.',
  suggestedServices: []
};

function detectNiche(category) {
  const lower = (category || '').toLowerCase();
  for (const [key, niche] of Object.entries(NICHES)) {
    for (const kw of niche.keywords) {
      if (lower.includes(kw)) return { key, ...niche };
    }
  }
  return { key: 'default', ...DEFAULT_NICHE };
}

// ---------------------------------------------------------------------------
// PHOTO DOWNLOADER
// ---------------------------------------------------------------------------

async function downloadPhoto(url, destDir, slug, index) {
  try {
    // Validate URL returns 200 before downloading full body
    const head = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (!head.ok) throw new Error(`HEAD check failed: HTTP ${head.status}`);

    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const ext = (res.headers.get('content-type') || '').includes('png') ? 'png' : 'jpg';
    const filename = `${slug}-photo-${index + 1}.${ext}`;
    const filePath = path.join(destDir, filename);
    fs.writeFileSync(filePath, buffer);
    return filename;
  } catch (err) {
    console.warn(`    PHOTO SKIP: failed to download photo ${index + 1}: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// PROMPT BUILDER
// ---------------------------------------------------------------------------

function buildPrompt(row, niche, localPhotoPaths, city) {
  const colors = niche.color;

  // Parse data from CSV
  let reviews = [];
  try { if (row.reviews_json) reviews = JSON.parse(row.reviews_json); } catch (_) { /* ignore */ }

  let hours = [];
  try { if (row.hours_json) hours = JSON.parse(row.hours_json); } catch (_) { /* ignore */ }

  const rating = row.rating ? parseFloat(row.rating) : 0;
  const reviewCount = row.review_count ? parseInt(row.review_count, 10) : 0;

  const tagline = `${row.category} in ${city}`;
  const metaDesc = row.phone
    ? `${row.business_name}. ${row.category} in ${city}. Call ${row.phone}.`
    : `${row.business_name}. ${row.category} in ${city}.`;

  const aboutText = niche.aboutVoice(row.business_name, row.category, city, row.phone);

  // Build photo HTML directly
  const photoImgTags = localPhotoPaths.length > 0
    ? localPhotoPaths.map((p, i) => `<img src="${p}" alt="${row.business_name} photo ${i + 1}" loading="lazy" class="gallery-img fade-up" style="transition-delay: ${i * 0.1}s;">`).join('\n        ')
    : '';

  // Build review cards directly
  const reviewCards = reviews.map((r, i) => {
    const filled = Math.round(r.rating || 5);
    const stars = '\u2605'.repeat(filled) + '\u2606'.repeat(5 - filled);
    const text = (r.text || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const author = (r.author || 'Customer').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<div class="review-card fade-up" style="transition-delay: ${i * 0.1}s;">
          <div class="review-stars">${stars}</div>
          <p class="review-text">"${text}"</p>
          <p class="review-author">${author}</p>
        </div>`;
  }).join('\n        ');

  // Build hours HTML
  const hoursHtml = hours.length > 0
    ? hours.map(h => `<li>${h.replace(/</g, '&lt;')}</li>`).join('\n              ')
    : '<li>Contact us for current hours</li>';

  // Rating display
  const ratingDisplay = rating > 0
    ? `<div class="rating-badge fade-up">
          <span class="rating-number">${rating}</span>
          <span class="rating-stars">${'\u2605'.repeat(Math.round(rating))}${'\u2606'.repeat(5 - Math.round(rating))}</span>
          <span class="rating-label">${reviewCount} Google Reviews</span>
        </div>`
    : '';

  return `You are a world-class front-end developer. Generate a COMPLETE single-page HTML website. Return ONLY raw HTML. No markdown fences. No explanation. First character must be <, last must be >.

ABSOLUTE RULE: Zero em dashes in the entire output. The characters U+2014 and &mdash; must never appear anywhere.

===== BUSINESS DATA =====
Name: ${row.business_name}
Category: ${row.category}
Address: ${row.address}
Phone: ${row.phone || 'None'}
Niche: ${niche.key}

===== PRE-BUILT HTML BLOCKS (inject these exactly as provided) =====

PHOTO GALLERY HTML (inject inside the gallery grid div):
${photoImgTags || 'NO PHOTOS. Skip the gallery section entirely.'}

REVIEW CARDS HTML (inject inside the reviews grid div):
${reviewCards || 'NO REVIEWS. Skip the reviews section entirely.'}

RATING BADGE HTML (inject below the reviews heading):
${ratingDisplay || 'NO RATING. Skip the rating badge.'}

HOURS LIST HTML (inject inside the hours ul):
${hoursHtml}

ABOUT TEXT (inject inside the about card p tag):
${aboutText}

===== COMPLETE HTML TEMPLATE =====

Generate the full HTML document following this exact structure. Inject the pre-built HTML blocks above into the appropriate locations.

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="description" content="${metaDesc}">
  <title>${row.business_name}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${niche.emoji}</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=Playfair+Display:ital,wght@1,700&display=swap" rel="stylesheet">
</head>

CSS VARIABLES in :root:
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

Every color must reference a variable. Never hardcode hex values in rules.

===== SECTIONS =====

1. SCROLL PROGRESS BAR: div#scroll-progress, position fixed, top 0, left 0, height 2px, width 0%, background var(--gold), z-index 9999, pointer-events none.

2. HERO: 100dvh, flex centered, radial-gradient(ellipse at 50% 40%, var(--gold-glow), transparent 70%).
   - Business name: Bebas Neue, clamp(3.5rem, 10vw, 8rem), uppercase, letter-spacing 0.05em, white.
   - Tagline: "${tagline}" in Playfair Display italic 700, var(--gold), clamp(1rem, 2.5vw, 1.4rem).
   - CTA: ${row.phone ? `"${niche.ctaText}" button wrapping <a href="tel:${row.phone}">. Phone number "${row.phone}" as small text below button.` : '"Request a Quote" button linking to #contact.'}
   - Button: background var(--gold), color var(--bg), DM Sans 700, 1.2rem, padding 18px 52px, border-radius var(--radius-pill). Hover: var(--gold-light), scale(1.03), box-shadow var(--shadow-gold).
   - @keyframes heroFadeUp for staggered load animation (name 0s, tagline 0.15s, button 0.3s).
   - No images in hero. No stock photos.

3. SERVICES: border-top 1px solid var(--border-gold).
   - Heading: "OUR SERVICES" in Bebas Neue.
   - Grid: repeat(auto-fit, minmax(280px, 1fr)), gap 24px, align-items stretch, max-width 1100px.
   - Glassmorphism cards: var(--bg-card), backdrop-filter blur(12px), border var(--border), border-radius var(--radius), padding 32px.
   - Hover: var(--bg-card-hover), border var(--border-gold), translateY(-4px), box-shadow var(--shadow-gold).
   - Service name: Bebas Neue, 1.4rem, var(--gold). Description: DM Sans 300, var(--text-secondary).
   - TONE: ${niche.serviceStyle}
   - Generate 4-6 services from this list (pick what fits): ${niche.suggestedServices.length > 0 ? niche.suggestedServices.join(', ') : 'Infer from category "' + row.category + '"'}.
   - .fade-up class on each card, staggered 0.1s.

${localPhotoPaths.length > 0 ? `4. PHOTO GALLERY: heading "OUR WORK" in Bebas Neue.
   - Grid: repeat(auto-fit, minmax(300px, 1fr)), gap 16px, max-width 1100px.
   - Inject the PHOTO GALLERY HTML block above. Each img: width 100%, height 280px, object-fit cover, border-radius var(--radius), border 1px solid var(--border). Hover: scale(1.02), box-shadow var(--shadow).` : '4. NO PHOTO GALLERY. Skip this section entirely.'}

${reviews.length > 0 ? `5. REVIEWS: heading "${rating > 0 ? rating + ' STARS ON GOOGLE' : 'WHAT CUSTOMERS SAY'}" in Bebas Neue.
   - Inject the RATING BADGE HTML block.
   - Grid: repeat(auto-fit, minmax(300px, 1fr)), gap 24px, max-width 1100px.
   - Inject the REVIEW CARDS HTML block. Style: same glassmorphism cards.
   - .review-stars: var(--gold), 1.1rem. .review-text: DM Sans 300, italic, var(--text-secondary). .review-author: DM Sans 500, var(--text-muted), 0.85rem, border-top 1px solid var(--border).` : '5. NO REVIEWS SECTION. Skip entirely. Do not fabricate any testimonials.'}

6. ABOUT: heading "ABOUT US" in Bebas Neue.
   - Glassmorphism card, max-width 720px, centered.
   - Inject the ABOUT TEXT block above inside a <p> tag. Do not change the text.

7. CONTACT: id="contact". Heading "GET IN TOUCH" in Bebas Neue.
   - Two-column grid on desktop (1fr 1fr, gap 48px, max-width 900px). Single column below 768px.
   - Left card: ${row.phone ? `phone as tap-to-call <a href="tel:${row.phone}"> in var(--gold)` : 'no phone'}, address in var(--text-secondary), hours as <ul> using the HOURS LIST HTML block.
   - Right card: form (action="#" method="POST"). Name, Email, Message fields. Inputs: rgba(255,255,255,0.05) bg, var(--border), var(--radius), var(--text-primary). Focus: border var(--gold), box-shadow 0 0 0 3px var(--gold-glow). Submit: full-width gold pill, "Send Message", min-height 48px.

8. FOOTER: background #060606, border-top 1px solid var(--border-gold), padding 40px 24px, text-align center.
   - Business name in Bebas Neue, var(--text-muted). ${row.phone ? 'Phone as tap-to-call.' : ''} Address. Copyright with dynamic year via document.write(new Date().getFullYear()).

9. SCRIPT: single script tag. Scroll progress bar (scrollY / (scrollHeight - innerHeight) * 100). IntersectionObserver threshold 0.15 for .fade-up elements, adds .visible, unobserves after.

CSS: .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
     .fade-up.visible { opacity: 1; transform: translateY(0); }

Section dividers between each section: max-width 200px, height 1px, linear-gradient(to right, transparent, var(--border), transparent), margin 0 auto.

All sections: padding 60px 24px desktop, 40px 20px mobile. Max content 1100px centered.

Typography: Bebas Neue for headings (uppercase, 0.05em spacing). Playfair Display italic for tagline. DM Sans 300/500/700 for body. clamp() for all sizes. Never system fonts.

MOBILE: grid collapses below 600px (services, photos) and 768px (contact). Hero scales via clamp. All buttons min 44px height. No horizontal scroll.

FINAL CHECKS:
1. Zero em dashes.
2. All colors via CSS variables (except footer #060606).
3. No fabricated content.
4. ${localPhotoPaths.length > 0 ? 'Only use the local photo filenames provided. No external URLs.' : 'No img tags. No placeholders.'}
5. No console.log. No AI comments.
6. All fonts via link tag, display=swap.
7. Complete valid HTML.
8. Every interactive element has hover + transition.
9. Dark design only. No white backgrounds. No generic blue.
10. CALL NOW button is the most dominant interactive element.`;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

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

    const slug = slugify(row.business_name);
    const city = parseCity(row.address);
    const niche = detectNiche(row.category);

    console.log(`Generating: ${row.business_name} [niche: ${niche.key}]...`);

    // Download photos locally
    let photoUrls = [];
    try { if (row.photos) photoUrls = JSON.parse(row.photos); } catch (_) { /* ignore */ }

    const localPhotoPaths = [];
    if (photoUrls.length > 0) {
      console.log(`  Downloading ${photoUrls.length} photos...`);
      for (let i = 0; i < photoUrls.length; i++) {
        const localFile = await downloadPhoto(photoUrls[i], SITES_DIR, slug, i);
        if (localFile) {
          localPhotoPaths.push(localFile);
          console.log(`    SAVED: ${localFile}`);
        }
      }
    }

    // Build prompt and generate
    try {
      const prompt = buildPrompt(row, niche, localPhotoPaths, city);

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      let html = message.content[0].text;

      // Strip markdown fences if present
      html = html.replace(/^```html?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

      // Strip em dashes — don't rely on Claude following the prompt rule
      html = html.replace(/\u2014/g, '-').replace(/&mdash;/g, '-');

      const filename = `${slug}.html`;
      const filePath = path.join(SITES_DIR, filename);

      fs.writeFileSync(filePath, html, 'utf-8');

      // Validate HTML structure — must be a complete document
      const trimmed = html.trim();
      const isComplete = trimmed.startsWith('<!') || trimmed.startsWith('<html');
      const hasClosingTag = trimmed.endsWith('</html>');
      const hasHead = /<head[\s>]/i.test(trimmed);
      const hasBody = /<body[\s>]/i.test(trimmed);

      if (!isComplete || !hasClosingTag || !hasHead || !hasBody) {
        const reasons = [];
        if (!isComplete) reasons.push('missing doctype/html open');
        if (!hasClosingTag) reasons.push('missing </html> (likely truncated)');
        if (!hasHead) reasons.push('missing <head>');
        if (!hasBody) reasons.push('missing <body>');
        console.warn(`  INVALID HTML: ${row.business_name} — ${reasons.join(', ')} — skipping`);
        fs.unlinkSync(filePath);
        continue;
      }

      row.local_file = `sites/${filename}`;
      generated++;

      console.log(`  SAVED: ${filePath}`);
    } catch (err) {
      console.warn(`  ERROR: ${row.business_name} - ${err.message} - skipping`);
    }
  }

  writeCSV('leads.csv', rows, columns);
  console.log(`\nGenerated ${generated} sites. leads.csv updated.`);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
