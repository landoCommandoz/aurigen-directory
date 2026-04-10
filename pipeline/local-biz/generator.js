require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { readCSV, writeCSV } = require('./csv-utils');

const SITES_DIR = path.join(__dirname, 'sites');
const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;

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

function accentColor(category) {
  const lower = (category || '').toLowerCase();
  const map = [
    [['mechanic', 'auto', 'repair'], '#D94A4A'],
    [['handyman', 'contractor', 'remodel'], '#5B7BAF'],
    [['clean', 'pressure', 'wash', 'window'], '#4ABFBF'],
    [['fence', 'fencing'], '#8B7355'],
    [['junk', 'haul', 'removal', 'trash'], '#D9A54A'],
    [['plumb'], '#3A8FD6'],
    [['electric'], '#E8A838'],
    [['hvac', 'heating', 'air condition'], '#5C9EAD'],
    [['landscap', 'lawn', 'tree'], '#6B9E4F'],
    [['salon', 'hair', 'nail', 'barber', 'beauty'], '#C77DBA'],
    [['restaurant', 'food', 'pizza', 'taco', 'cafe'], '#E07B4C'],
    [['roof'], '#8B6F5E'],
    [['paint'], '#7B8EC2'],
    [['pest', 'extermina'], '#A0A040'],
    [['tow', 'wreck'], '#CC6633']
  ];
  for (const [keywords, color] of map) {
    if (keywords.some(kw => lower.includes(kw))) return color;
  }
  return '#c9a84c';
}

const PRICE_LABELS = { 1: 'Budget-friendly', 2: 'Moderately priced', 3: 'Higher-end', 4: 'Premium pricing' };

function priceLevelLabel(level) {
  return PRICE_LABELS[parseInt(level, 10)] || '';
}

function safeParseJSON(str, fallback = []) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch (_) { return fallback; }
}

// ---------------------------------------------------------------------------
// PHOTO DOWNLOADER
// ---------------------------------------------------------------------------

async function downloadPhoto(photoRef, destDir, slug, index) {
  if (!photoRef || !GOOGLE_KEY) return null;
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_KEY}`;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const ext = (res.headers.get('content-type') || '').includes('png') ? 'png' : 'jpg';
    const filename = `${slug}-photo-${index}.${ext}`;
    fs.writeFileSync(path.join(destDir, filename), buffer);
    return filename;
  } catch (err) {
    console.warn(`    PHOTO SKIP: photo ${index}: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// DATA PARSER
// ---------------------------------------------------------------------------

function parseBusinessData(row) {
  return {
    city: parseCity(row.address),
    reviews: safeParseJSON(row.reviews_json),
    hours: safeParseJSON(row.hours_json),
    rating: row.rating ? parseFloat(row.rating) : 0,
    reviewCount: row.review_count ? parseInt(row.review_count, 10) : 0,
    priceLabel: priceLevelLabel(row.price_level)
  };
}

// ---------------------------------------------------------------------------
// PROMPT BUILDER (data-driven, no templates)
// ---------------------------------------------------------------------------

function buildPrompt(row, data, photoFiles) {
  const { city, reviews, hours, rating, reviewCount, priceLabel } = data;
  const accent = accentColor(row.category);

  let profile = `NAME: ${row.business_name}
CATEGORY: ${row.category}
LOCATION: ${row.address}
CITY: ${city}`;

  if (row.phone) profile += `\nPHONE: ${row.phone}`;
  if (rating > 0) profile += `\nRATING: ${rating} stars from ${reviewCount} real customers`;
  if (priceLabel) profile += `\nPRICING: ${priceLabel}`;

  let hoursBlock = '';
  if (hours.length > 0) {
    hoursBlock = '\n\nHOURS OF OPERATION:\n' + hours.map(h => `  ${h}`).join('\n');
  }

  let reviewsBlock = '';
  if (reviews.length > 0) {
    reviewsBlock = '\n\nREAL CUSTOMER REVIEWS (use these exact quotes, pull specific phrases for copy):';
    for (const r of reviews) {
      const stars = r.rating + '/5 stars';
      reviewsBlock += `\n  - ${r.author} (${stars}): "${r.text}"`;
    }
  }

  let photosBlock = '';
  if (photoFiles.length > 0) {
    photosBlock = `\n\nPHOTOS AVAILABLE: ${photoFiles.length} real business photos`;
    photosBlock += '\nLocal filenames (use these exact src values):';
    for (const f of photoFiles) {
      photosBlock += `\n  - ${f}`;
    }
  }

  let mapsBlock = '';
  if (row.lat && row.lng && GOOGLE_KEY) {
    mapsBlock = `\n\nGOOGLE MAPS EMBED: Use this iframe src: https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${row.lat},${row.lng}&zoom=15`;
  }
  if (row.google_maps_url) {
    mapsBlock += `\nGOOGLE MAPS LINK: ${row.google_maps_url}`;
  }

  return `You are building a website for a real local business. Every word must be written specifically for this business based on the data below. No generic phrasing. No template language. Read the reviews, understand what customers love, and write copy that reflects this specific business.

Return ONLY raw HTML. No markdown fences. No explanation. First character must be <, last must be >.

ABSOLUTE RULE: Zero em dashes in the entire output. The characters U+2014 and &mdash; must never appear. Use commas, periods, or separate sentences instead.

===== THIS BUSINESS =====
${profile}${hoursBlock}${reviewsBlock}${photosBlock}${mapsBlock}

===== WHAT TO BUILD =====

Build a complete single-page HTML website with these exact sections:

1. HERO SECTION
   - Business name as the headline (Bebas Neue font, massive, uppercase)
   ${rating > 0 ? `- Below the name: "${rating} stars from ${reviewCount} reviews" as a subtle gold badge` : '- Tagline derived from the category and city'}
   ${reviews.length > 0 ? '- A short tagline pulled directly from the best review. Use the customer\'s actual words, not a paraphrase.' : `- Tagline: "${row.category} in ${city}"`}
   ${row.phone ? `- Primary CTA: "CALL NOW" button wrapping <a href="tel:${row.phone}">. Show the phone number "${row.phone}" as smaller text below the button.` : '- Primary CTA: "GET A FREE QUOTE" button linking to #contact'}
   ${photoFiles.length > 0 ? `- Background: the first photo (${photoFiles[0]}) as a full-width background image with a dark overlay (linear-gradient(rgba(10,10,10,0.75), rgba(10,10,10,0.9)))` : '- Background: radial gradient with subtle accent color glow, no images'}
   - Staggered fade-in animation on load (name, tagline, button at 0s, 0.15s, 0.3s)

${photoFiles.length > 1 ? `2. PHOTOS SECTION
   - Heading: "OUR WORK" (Bebas Neue)
   - Grid: repeat(auto-fit, minmax(300px, 1fr)), gap 16px
   - Show photos: ${photoFiles.slice(1).map(f => `<img src="${f}">`).join(', ')}
   - Each img: width 100%, height 280px, object-fit cover, border-radius 12px, border 1px solid rgba(255,255,255,0.07)
   - Hover: scale(1.02), box-shadow` : `2. PHOTOS SECTION
   - SKIP THIS SECTION. No photos available.`}

3. ABOUT SECTION
   - Heading: "ABOUT US" (Bebas Neue)
   - Glassmorphism card (rgba(255,255,255,0.03) bg, backdrop-filter blur(12px), border rgba(255,255,255,0.07))
   - Max-width 720px, centered
   ${reviews.length > 0 ? '- Write 3-4 sentences about this business based on what customers say in the reviews. Reference specific things customers mentioned. Write in third person. Do not fabricate any claims not supported by the reviews.' : `- Write 3-4 sentences about ${row.business_name} as a ${row.category} business in ${city}. Keep it honest and grounded. Do not make claims about awards, years of experience, or anything not in the data.`}

4. SERVICES SECTION
   - Heading: "OUR SERVICES" (Bebas Neue)
   - Grid: repeat(auto-fit, minmax(280px, 1fr)), gap 24px, max-width 1100px
   - Glassmorphism cards with hover effect (translateY(-4px), accent border glow)
   - Generate 4-6 services inferred from the category "${row.category}"${reviews.length > 0 ? ' and what customers mention in their reviews' : ''}
   ${reviews.length > 0 ? '- Write each service description using language and details from the actual reviews. If a customer mentioned fast response time, say that. If they mentioned quality work, reflect that.' : '- Write short, direct descriptions. No corporate language. Sound like a real tradesperson.'}

${reviews.length > 0 ? `5. REVIEWS SECTION
   - Heading: "WHAT CUSTOMERS SAY" (Bebas Neue)
   ${rating > 0 ? `- Rating badge: "${rating} stars" with filled/empty star characters, "${reviewCount} Google Reviews" label` : ''}
   - Grid: repeat(auto-fit, minmax(300px, 1fr)), gap 24px
   - Show up to 3 reviews as glassmorphism cards:
${reviews.slice(0, 3).map(r => {
    const filled = Math.round(r.rating || 5);
    const stars = '\u2605'.repeat(filled) + '\u2606'.repeat(5 - filled);
    const text = r.text.replace(/"/g, '&quot;');
    const author = r.author.replace(/</g, '&lt;');
    return `     * ${stars} "${text}" - ${author}`;
  }).join('\n')}
   - Star rating in accent color above each quote
   - Author name below, muted color, smaller text, border-top separator` : `5. REVIEWS SECTION
   - SKIP THIS SECTION. No reviews available.`}

${hours.length > 0 ? `6. HOURS SECTION
   - Heading: "HOURS" (Bebas Neue)
   - Glassmorphism card, max-width 500px, centered
   - Display as a clean list:
${hours.map(h => `     ${h}`).join('\n')}` : `6. HOURS SECTION
   - SKIP THIS SECTION. No hours data available.`}

7. CONTACT SECTION
   - id="contact"
   - Heading: "GET IN TOUCH" (Bebas Neue)
   - Two-column grid on desktop (1fr 1fr, gap 48px, max-width 900px), single column below 768px
   - Left card: ${row.phone ? `phone as tap-to-call <a href="tel:${row.phone}"> in accent color` : 'no phone'}, address, ${row.google_maps_url ? `"Get Directions" link to ${row.google_maps_url}` : 'no directions link'}${priceLabel ? `, pricing: "${priceLabel}"` : ''}
   ${row.lat && row.lng && GOOGLE_KEY ? `- Below the two columns: Google Maps embed iframe (src="https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${row.lat},${row.lng}&zoom=15"), width 100%, height 300px, border-radius 12px, border 1px solid rgba(255,255,255,0.07)` : ''}
   - Right card: contact form (action="/" method="POST" data-netlify="true" name="contact-${slugify(row.business_name)}"). Fields: Name, Email, Message. Submit button: full-width, accent color pill.
   - Inputs: rgba(255,255,255,0.05) bg, border rgba(255,255,255,0.07), border-radius 12px. Focus: accent border + glow.

8. FOOTER
   - Background #060606, border-top 1px solid accent color at 30% opacity, padding 40px 24px, text-align center
   - Business name (Bebas Neue, muted), ${row.phone ? 'phone as tap-to-call, ' : ''}address, copyright with dynamic year via document.write(new Date().getFullYear())

===== DESIGN SYSTEM =====

CSS VARIABLES (set in :root):
  --bg: #0a0a0a
  --bg-card: rgba(255,255,255,0.03)
  --bg-card-hover: rgba(255,255,255,0.06)
  --accent: ${accent}
  --text-primary: #f0f0f0
  --text-secondary: #888896
  --text-muted: #555560
  --border: rgba(255,255,255,0.07)
  --radius: 12px

Every color in CSS rules must reference a variable. Never hardcode hex values in rules (except footer #060606).

FONTS: Google Fonts only.
  - Bebas Neue for all headings (uppercase, letter-spacing 0.05em)
  - DM Sans 300/400/500/700 for body text
  - Use clamp() for all font sizes

SCROLL PROGRESS BAR: div#scroll-progress, position fixed top 0 left 0, height 2px, width 0%, background var(--accent), z-index 9999, pointer-events none.

ANIMATIONS:
  .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  IntersectionObserver (threshold 0.15) adds .visible class, unobserves after.
  Stagger cards with transition-delay: 0.1s increments.

SECTION DIVIDERS: Between each section, a decorative hr: max-width 200px, height 1px, linear-gradient(to right, transparent, var(--border), transparent), margin 0 auto.

ALL SECTIONS: padding 60px 24px desktop, 40px 20px mobile. Max content width 1100px, centered.

MOBILE: All grids collapse below 600px. Hero text scales via clamp(). All buttons min-height 44px. No horizontal scroll.

DARK DESIGN ONLY. No white backgrounds. No light sections. No generic blue.

FINAL CHECKS:
1. Zero em dashes (U+2014 and &mdash;).
2. All colors via CSS variables.
3. No fabricated reviews, hours, or phone numbers.
4. ${photoFiles.length > 0 ? 'Use only the exact local photo filenames listed above.' : 'No img tags. No placeholder images.'}
5. Complete valid HTML document (<!DOCTYPE html> through </html>).
6. No console.log. No AI-generated comments.
7. Every interactive element has hover state + transition.
8. CALL NOW button is the most prominent interactive element.`;
}

// ---------------------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------------------

const FATAL_CODES = new Set(['NO_DOCTYPE', 'TRUNCATED']);

function validateHTML(html) {
  const issues = [];

  if (!html.includes('<!DOCTYPE html') && !html.includes('<!doctype html')) {
    issues.push({ code: 'NO_DOCTYPE', msg: 'Missing <!DOCTYPE html>' });
  }
  if (!html.includes('<head')) issues.push({ code: 'NO_HEAD', msg: 'Missing <head>' });
  if (!html.includes('<body')) issues.push({ code: 'NO_BODY', msg: 'Missing <body>' });
  if (!html.includes('</html>')) issues.push({ code: 'NO_CLOSE', msg: 'Missing </html>' });

  if (!html.trim().endsWith('>')) {
    issues.push({ code: 'TRUNCATED', msg: 'File appears truncated' });
  }

  return issues;
}

function stripEmDashes(html) {
  return html.replace(/\u2014/g, '-').replace(/&mdash;/g, '-');
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

  fs.mkdirSync(SITES_DIR, { recursive: true });

  const columns = Object.keys(rows[0]);
  if (!columns.includes('local_file')) columns.push('local_file');

  let generated = 0;

  for (const row of rows) {
    if (row.local_file) {
      console.log(`SKIP: ${row.business_name} (already generated)`);
      continue;
    }

    const slug = slugify(row.business_name);
    const data = parseBusinessData(row);

    console.log(`\nGenerating: ${row.business_name}`);
    console.log(`  Category: ${row.category}`);
    console.log(`  City: ${data.city}`);
    console.log(`  Rating: ${data.rating > 0 ? data.rating + ' stars (' + data.reviewCount + ' reviews)' : 'none'}`);
    console.log(`  Reviews: ${data.reviews.length}`);
    console.log(`  Hours: ${data.hours.length > 0 ? 'yes' : 'none'}`);

    const photoRefs = [row.photo_ref_1, row.photo_ref_2, row.photo_ref_3].filter(Boolean);
    let photoFiles = [];

    if (photoRefs.length > 0) {
      console.log(`  Downloading ${photoRefs.length} photos...`);
      const results = await Promise.all(
        photoRefs.map((ref, i) => downloadPhoto(ref, SITES_DIR, slug, i + 1))
      );
      photoFiles = results.filter(Boolean);
      for (const f of photoFiles) console.log(`    SAVED: ${f}`);
    }

    // Build prompt from this business's actual data
    const prompt = buildPrompt(row, data, photoFiles);

    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }]
      });

      let html = message.content[0].text;

      // Strip markdown fences if present
      html = html.replace(/^```html?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

      // Strip em dashes
      html = stripEmDashes(html);

      // Validate
      const issues = validateHTML(html);
      if (issues.length > 0) {
        console.warn(`  VALIDATION ISSUES: ${issues.map(i => i.msg).join(', ')}`);
        if (issues.some(i => FATAL_CODES.has(i.code))) {
          console.warn(`  SKIPPED: ${row.business_name} (failed validation)`);
          continue;
        }
      }

      const filename = `${slug}.html`;
      fs.writeFileSync(path.join(SITES_DIR, filename), html, 'utf-8');
      row.local_file = `sites/${filename}`;
      generated++;

      // Write CSV after each success for crash resilience
      writeCSV('leads.csv', rows, columns);
      console.log(`  SAVED: sites/${filename} (${Math.round(html.length / 1024)}KB)`);
    } catch (err) {
      console.warn(`  ERROR: ${row.business_name} - ${err.message}`);
    }
  }

  console.log(`\nGenerated ${generated} sites. leads.csv updated.`);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
