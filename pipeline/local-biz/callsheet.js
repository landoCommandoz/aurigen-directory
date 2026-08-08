require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const { readCSV } = require('./csv-utils');

const CALLS_DIR = path.join(__dirname, 'calls');

// ---------------------------------------------------------------------------
// NICHE OPENERS (what Brian says on the phone)
// ---------------------------------------------------------------------------

const NICHE_OPENERS = {
  plumber: {
    opener: (name, city) => `Hey, is this ${name}? My name's Brian. I was looking for a plumber in ${city} and found your Google listing, but noticed you don't have a website. So I actually went ahead and built one for you. Can I send you the link real quick?`,
    pain: (city) => `Homeowners in ${city} search online first. No website means they're calling your competitor instead.`
  },
  plumbing: {
    opener: (name, city) => `Hey, is this ${name}? My name's Brian. I was looking for a plumber in ${city} and found your Google listing, but noticed you don't have a website. So I actually went ahead and built one for you. Can I send you the link real quick?`,
    pain: (city) => `Homeowners in ${city} search online first. No website means they're calling your competitor instead.`
  },
  hvac: {
    opener: (name) => `Hey, is this ${name}? My name's Brian. Between seasons is when HVAC companies either grow online or get buried. I noticed you don't have a website, so I built one for you. Want me to text you the link?`,
    pain: () => `Between seasons people are shopping for HVAC companies online. No website means invisible.`
  },
  'heating and air': {
    opener: (name) => `Hey, is this ${name}? My name's Brian. Between seasons is when HVAC companies either grow online or get buried. I noticed you don't have a website, so I built one for you. Want me to text you the link?`,
    pain: () => `Between seasons people are shopping for HVAC companies online. No website means invisible.`
  },
  landscaper: {
    opener: (name, city) => `Hey, is this ${name}? My name's Brian. Spring's coming and people looking for lawn care in ${city} are already searching online. I noticed you don't have a website, so I put one together for you. Can I send it over?`,
    pain: (city) => `Seasonal search traffic for lawn care in ${city} is already picking up. Missing out on every one of those leads.`
  },
  landscaping: {
    opener: (name, city) => `Hey, is this ${name}? My name's Brian. Spring's coming and people looking for lawn care in ${city} are already searching online. I noticed you don't have a website, so I put one together for you. Can I send it over?`,
    pain: (city) => `Seasonal search traffic for lawn care in ${city} is already picking up. Missing out on every one of those leads.`
  },
  cleaning: {
    opener: (name, city) => `Hey, is this ${name}? My name's Brian. I was searching for cleaning services in ${city} and your Google listing came up, but there was no website. So I built one for you. Want me to text you the link?`,
    pain: (city) => `People searching for cleaning in ${city} skip businesses with no web presence entirely.`
  },
  mechanic: {
    opener: (name) => `Hey, is this ${name}? My name's Brian. Most people pick a mechanic online before they ever make a call. I noticed you don't have a website, so I went ahead and made one for you. Can I send it over?`,
    pain: () => `Most people choose their mechanic online before calling. No site means they never even consider you.`
  },
  'auto repair': {
    opener: (name) => `Hey, is this ${name}? My name's Brian. Most people pick a mechanic online before they ever make a call. I noticed you don't have a website, so I went ahead and made one for you. Can I send it over?`,
    pain: () => `Most people choose their mechanic online before calling. No site means they never even consider you.`
  },
  electrician: {
    opener: (name) => `Hey, is this ${name}? My name's Brian. When something goes wrong electrically, people want to see a real business before they call. I noticed you don't have a website, so I built one. Want me to send you the link?`,
    pain: () => `Electrical emergencies drive urgent searches. No website means they call whoever shows up first online.`
  },
  contractor: {
    opener: (name, city) => `Hey, is this ${name}? My name's Brian. Homeowners in ${city} spend weeks researching contractors before making a call. I noticed you don't have a website, so I put one together for you. Can I text it to you?`,
    pain: (city) => `Homeowners in ${city} research contractors for weeks online before calling. No site means you're not in the running.`
  },
  salon: {
    opener: (name, city) => `Hey, is this ${name}? My name's Brian. Instagram's great for showing your work but people searching for a salon in ${city} on Google won't find you without a website. So I built one for you. Can I send it over?`,
    pain: (city) => `Google searchers in ${city} looking for a salon will never find an Instagram page. They need a website.`
  },
  restaurant: {
    opener: (name, city) => `Hey, is this ${name}? My name's Brian. People searching for food in ${city} want to see a menu before they decide where to go. I noticed you don't have a website, so I put one together. Want me to text you the link?`,
    pain: (city) => `Hungry people in ${city} are searching online and picking restaurants with menus on their website.`
  }
};

const DEFAULT_OPENER = {
  opener: (name, city) => `Hey, is this ${name}? My name's Brian. I was searching for local businesses in ${city} and found your Google listing, but noticed you don't have a website. So I actually went ahead and built one for you. Can I send you the link?`,
  pain: (city) => `People in ${city} check online before calling a local business. No website means missed calls.`
};

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

function parseCategory(raw) {
  return (raw || 'services').split(',').pop().trim().toLowerCase() || 'services';
}

function parseCity(address) {
  const parts = (address || '').split(',').map(s => s.trim());
  if (parts.length >= 3) {
    const candidate = parts[parts.length - 3];
    if (candidate && !/^\d/.test(candidate)) return candidate;
  }
  return 'your area';
}

function matchNiche(category) {
  const lower = category.toLowerCase();
  if (NICHE_OPENERS[lower]) return NICHE_OPENERS[lower];
  for (const [key, niche] of Object.entries(NICHE_OPENERS)) {
    if (lower.includes(key) || key.includes(lower)) return niche;
  }
  return DEFAULT_OPENER;
}

function safeParseJSON(str) {
  if (!str) return [];
  try { return JSON.parse(str); } catch (_) { return []; }
}

function formatHoursForCall(hours) {
  if (!hours || hours.length === 0) return 'Not listed';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = hours.find(h => h.startsWith(today));
  if (todayHours) return todayHours;
  return hours[0];
}

function buildReviewHighlights(reviewsJson) {
  const reviews = safeParseJSON(reviewsJson);
  if (reviews.length === 0) return null;

  const lines = [];
  const themes = [];

  for (const r of reviews.slice(0, 3)) {
    const stars = r.rating >= 4 ? `${r.rating}/5` : `${r.rating}/5`;
    const text = r.text.length > 120 ? r.text.slice(0, 120) + '...' : r.text;
    lines.push(`  "${text}" - ${r.author} (${stars})`);
  }

  const allText = reviews.map(r => r.text.toLowerCase()).join(' ');
  if (allText.includes('fast') || allText.includes('quick') || allText.includes('responsive')) themes.push('fast response time');
  if (allText.includes('fair') || allText.includes('reasonable') || allText.includes('good price')) themes.push('fair pricing');
  if (allText.includes('quality') || allText.includes('professional') || allText.includes('great work')) themes.push('quality work');
  if (allText.includes('friendly') || allText.includes('nice') || allText.includes('helpful')) themes.push('friendly service');
  if (allText.includes('recommend') || allText.includes('best') || allText.includes('always')) themes.push('repeat customers');

  return { lines, themes };
}

// ---------------------------------------------------------------------------
// CALL SHEET BUILDER
// ---------------------------------------------------------------------------

function buildCallSheet(row) {
  const name = row.business_name;
  const phone = row.phone || 'NO PHONE - SKIP OR FIND NUMBER';
  const address = row.address || 'Unknown';
  const category = parseCategory(row.category);
  const city = parseCity(row.address);
  const rating = row.rating ? parseFloat(row.rating) : 0;
  const reviewCount = row.review_count ? parseInt(row.review_count, 10) : 0;
  const url = row.live_url || 'NOT DEPLOYED YET';
  const hours = safeParseJSON(row.hours_json);
  const niche = matchNiche(category);

  const reviewData = buildReviewHighlights(row.reviews_json);

  let sheet = '';

  // Header
  sheet += '================================================================\n';
  sheet += `  CALL SHEET: ${name}\n`;
  sheet += '================================================================\n\n';

  if (!row.live_url) {
    sheet += '  *** SITE NOT DEPLOYED YET - DO NOT CALL UNTIL IT IS LIVE ***\n';
    sheet += '  (the pitch depends on "I already built it" being true)\n\n';
  }

  // Quick info
  sheet += `Phone:     ${phone}\n`;
  sheet += `Address:   ${address}\n`;
  sheet += `Category:  ${category}\n`;
  if (rating > 0) {
    sheet += `Rating:    ${rating} stars (${reviewCount} reviews)\n`;
  }
  sheet += `Hours:     ${formatHoursForCall(hours)}\n`;
  sheet += `Site URL:  ${url}\n`;
  if (row.google_maps_url) {
    sheet += `Google:    ${row.google_maps_url}\n`;
  }

  // Opening line
  sheet += '\n--- OPENING LINE ---\n\n';
  sheet += `"${niche.opener(name, city)}"\n`;

  // Why they need it
  sheet += '\n--- WHY THEY NEED THIS ---\n\n';
  sheet += `- ${niche.pain(city)}\n`;
  if (rating > 0) {
    sheet += `- ${reviewCount} reviews averaging ${rating} stars but no website to show it\n`;
  }
  if (reviewData && reviewData.themes.length > 0) {
    sheet += `- Customers love their ${reviewData.themes.join(', ')}\n`;
  }
  sheet += '- Every competitor with a website is getting calls they are missing\n';

  // If they say yes
  sheet += '\n--- IF THEY SAY YES ---\n\n';
  sheet += `"Great, I'll text it to you right now at this number.\n`;
  sheet += `Take a look. If you like it and want to keep it live,\n`;
  sheet += `it's $99 a month. I handle everything. You can cancel anytime."\n`;

  // If they ask what's the catch
  sheet += '\n--- IF THEY SAY "WHAT\'S THE CATCH" ---\n\n';
  sheet += `"No catch. I built it, it's live right now, and I'll\n`;
  sheet += `keep it up for 7 days either way. After that if you\n`;
  sheet += `don't want it, it just comes down. No charge."\n`;

  // If they want to think about it
  sheet += '\n--- IF THEY SAY "I\'LL THINK ABOUT IT" ---\n\n';
  sheet += `"Totally fine. The site's live for 7 days. I'll text\n`;
  sheet += `you the link so you can check it out whenever. If you\n`;
  sheet += `change your mind, just call me back at this number."\n`;

  // If they say no
  sheet += '\n--- IF THEY SAY NO ---\n\n';
  sheet += `"No worries at all. The site will be up for a week if\n`;
  sheet += `you change your mind. Have a good one."\n`;

  // Review highlights for conversation
  if (reviewData && reviewData.lines.length > 0) {
    sheet += '\n--- REVIEW HIGHLIGHTS (use in conversation) ---\n\n';
    for (const line of reviewData.lines) {
      sheet += `${line}\n`;
    }
    sheet += '\n';
    sheet += `TIP: "By the way, you've got ${reviewCount} reviews on Google\n`;
    sheet += `and people are saying great things. The site shows those\n`;
    sheet += `reviews front and center so new customers can see them."\n`;
  }

  // Hours info for when to call
  if (hours.length > 0) {
    sheet += '\n--- BUSINESS HOURS (best call times) ---\n\n';
    for (const h of hours) {
      sheet += `  ${h}\n`;
    }
  }

  sheet += '\n================================================================\n';

  return sheet;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  const rows = readCSV('leads.csv');

  if (rows.length === 0) {
    console.log('No leads found. Run the earlier scripts first.');
    return;
  }

  fs.mkdirSync(CALLS_DIR, { recursive: true });

  let written = 0;
  let noPhone = 0;

  for (const row of rows) {
    if (!row.live_url) {
      console.warn(`WARNING: ${row.business_name} has no live site yet - sheet stamped DO NOT CALL`);
    }

    const slug = slugify(row.business_name);
    const sheetPath = path.join(CALLS_DIR, `${slug}.txt`);

    if (fs.existsSync(sheetPath)) {
      const existing = fs.readFileSync(sheetPath, 'utf-8');
      const needsRefresh = row.live_url && existing.includes('NOT DEPLOYED YET');
      if (!needsRefresh) {
        console.log(`SKIP: ${row.business_name} (call sheet already exists)`);
        continue;
      }
    }

    if (!row.phone) {
      console.warn(`WARNING: ${row.business_name} has no phone number`);
      noPhone++;
    }

    try {
      const sheet = buildCallSheet(row);
      fs.writeFileSync(sheetPath, sheet, 'utf-8');
      written++;

      console.log(`CALL SHEET: ${row.business_name} -> calls/${slug}.txt (${row.phone || 'NO PHONE'})`);
    } catch (err) {
      console.warn(`ERROR: ${row.business_name} - ${err.message} - skipping`);
    }
  }

  if (written === 0) {
    console.log('No new call sheets to generate.');
    return;
  }

  console.log(`\nWrote ${written} call sheets to calls/ folder.`);
  if (noPhone > 0) {
    console.log(`WARNING: ${noPhone} leads have no phone number. Brian will need to find those numbers.`);
  }
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
