require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const { readCSV } = require('./csv-utils');

const CALLS_DIR = path.join(__dirname, 'calls');

// ---------------------------------------------------------------------------
// NICHE OPENERS (what Brian says when the site is ALREADY LIVE)
// ---------------------------------------------------------------------------

const NICHE_OPENERS = {
  plumber: {
    opener: (name) => `Hey, is this ${name}? This is Brian. Real quick, I was on Google looking for a plumber out here and you guys came up, but there's no website. I build websites, so I went ahead and made you one. It's live right now. Can I text you the link?`,
    pain: () => `Somebody's pipe breaks, they google a plumber, they call whoever comes up. No website means that call goes somewhere else.`
  },
  plumbing: {
    opener: (name) => `Hey, is this ${name}? This is Brian. Real quick, I was on Google looking for a plumber out here and you guys came up, but there's no website. I build websites, so I went ahead and made you one. It's live right now. Can I text you the link?`,
    pain: () => `Somebody's pipe breaks, they google a plumber, they call whoever comes up. No website means that call goes somewhere else.`
  },
  hvac: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up heating and air companies out here and saw you guys don't have a website. That's what I do for work, so I already built you one. It's live right now. Want me to text you the link?`,
    pain: () => `Furnace dies in January, people google it and call whoever looks real. No site means they get skipped.`
  },
  'heating and air': {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up heating and air companies out here and saw you guys don't have a website. That's what I do for work, so I already built you one. It's live right now. Want me to text you the link?`,
    pain: () => `Furnace dies in January, people google it and call whoever looks real. No site means they get skipped.`
  },
  landscaper: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up lawn guys out here and you came up on Google, but no website. I build sites, so I already made you one. It's live. Can I text it to you?`,
    pain: () => `People hire lawn guys off Google now. No site, no call.`
  },
  landscaping: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up lawn guys out here and you came up on Google, but no website. I build sites, so I already made you one. It's live. Can I text it to you?`,
    pain: () => `People hire lawn guys off Google now. No site, no call.`
  },
  cleaning: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was searching for cleaning services out here and your listing came up, but there's no website. I build sites, so I already made you one. Want me to text you the link?`,
    pain: () => `People looking for a cleaner check online first. If nothing comes up they move on to the next one.`
  },
  mechanic: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was on Google looking at shops out here and saw you guys don't have a website. I build sites, so I already made you one. It's live right now. Want me to text you the link?`,
    pain: () => `People pick a shop off Google before they ever call. No site means they never even see these guys.`
  },
  'auto repair': {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was on Google looking at shops out here and saw you guys don't have a website. I build sites, so I already made you one. It's live right now. Want me to text you the link?`,
    pain: () => `People pick a shop off Google before they ever call. No site means they never even see these guys.`
  },
  electrician: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up electricians out here and saw you don't have a website. I build sites for a living, so I already made you one. It's live. Want me to text you the link?`,
    pain: () => `When something sparks, people want a company that looks legit online before they call.`
  },
  contractor: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up contractors out here and you came up, but there's no website. I build sites, so I went ahead and made you one. It's live right now. Can I text it to you?`,
    pain: () => `Homeowners research contractors for weeks online before they call anybody. No site means not even in the running.`
  },
  salon: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up salons out here and saw you guys don't have an actual website. I build sites, so I already made you one. Can I text you the link?`,
    pain: () => `People searching Google for a salon never see an Instagram page. They book with whoever has a real site.`
  },
  restaurant: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up places to eat out here and saw you guys don't have a website. I build sites, so I already made you one, menu and all. Want me to text you the link?`,
    pain: () => `People pick where to eat off a menu they find online. No menu online, they pick somewhere else.`
  },
  barber: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up barbershops out here and you guys came up with a ton of good reviews, but no website, just the Facebook page. I build sites, so I already made you one. Can I text you the link?`,
    pain: () => `New people in town google a barbershop and book with whoever has a real site. A Facebook page doesn't cut it on Google.`
  },
  roofing: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up roofers out here and saw you guys don't have a website. I build sites, so I went ahead and made you one. It's live. Can I text you the link?`,
    pain: () => `A roof is a big check. People compare two or three companies online before they call anybody. No site means losing before the phone even rings.`
  },
  towing: {
    opener: (name) => `Hey, is this ${name}? This is Brian. I was looking up tow companies out here and saw you guys don't have a website. I build sites, so I already made you one. Want me to text you the link?`,
    pain: () => `Somebody's stranded on the side of the road, they call the first tow company that looks real on their phone.`
  }
};

const DEFAULT_OPENER = {
  opener: (name) => `Hey, is this ${name}? This is Brian. I was on Google and noticed you guys don't have a website. I build sites for local businesses, so I went ahead and made you one. It's live right now. Can I text you the link?`,
  pain: () => `People check a business online before they call. If nothing comes up, they call somebody else.`
};

// ---------------------------------------------------------------------------
// BUILD-AFTER SCRIPT (what Brian says when NO site is built yet)
// ---------------------------------------------------------------------------

const BUILD_AFTER = {
  opener: (name) => `Hey, is this ${name}? This is Brian. Real quick, I was on Google and noticed you guys don't have a website. That's what I do, I build sites for local businesses out here. I'd like to build you one for free so you can actually see it. If you like it, it's 99 bucks a month. If not, I take it down and we're square. Can I text it to you when it's done?`,
  yes: `"Cool. Is this the best number to text? Give me a day or two.\nI'll send you the link when it's up. No charge to look."`,
  catch: `"Nothing up front. I build it first so you can see exactly\nwhat you'd get. You only pay if you want to keep it."`,
  think: `"Tell you what, let me build it anyway and text it over.\nCosts you nothing to look at it. Then take your time."`,
  no: `"All good. If you ever change your mind, my number's the\none that just called you. Take it easy."`
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
    const text = r.text.length > 120 ? r.text.slice(0, 120) + '...' : r.text;
    lines.push(`  "${text}" - ${r.author} (${r.rating}/5)`);
  }

  const allText = reviews.map(r => r.text.toLowerCase()).join(' ');
  if (allText.includes('fast') || allText.includes('quick') || allText.includes('responsive')) themes.push('fast service');
  if (allText.includes('fair') || allText.includes('reasonable') || allText.includes('good price')) themes.push('fair prices');
  if (allText.includes('quality') || allText.includes('professional') || allText.includes('great work')) themes.push('quality work');
  if (allText.includes('friendly') || allText.includes('nice') || allText.includes('helpful')) themes.push('friendly people');
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
  const rating = row.rating ? parseFloat(row.rating) : 0;
  const reviewCount = row.review_count ? parseInt(row.review_count, 10) : 0;
  const isLive = Boolean(row.live_url);
  const hours = safeParseJSON(row.hours_json);
  const niche = matchNiche(category);

  const reviewData = buildReviewHighlights(row.reviews_json);

  let sheet = '';

  // Header
  sheet += '================================================================\n';
  sheet += `  CALL SHEET: ${name}\n`;
  sheet += '================================================================\n\n';

  if (!isLive) {
    sheet += '  NO SITE BUILT YET. This sheet uses the build-it-after script:\n';
    sheet += '  offer a free demo, build it for the ones who want to see it.\n\n';
  }

  // Quick info
  sheet += `Phone:     ${phone}\n`;
  sheet += `Address:   ${address}\n`;
  sheet += `Category:  ${category}\n`;
  if (rating > 0) {
    sheet += `Rating:    ${rating} stars (${reviewCount} reviews)\n`;
  }
  sheet += `Hours:     ${formatHoursForCall(hours)}\n`;
  sheet += `Site URL:  ${isLive ? row.live_url : '(none yet, build after they say yes)'}\n`;
  if (row.google_maps_url) {
    sheet += `Google:    ${row.google_maps_url}\n`;
  }
  if (row.notes) {
    sheet += `Notes:     ${row.notes}\n`;
  }

  // Opening line
  sheet += '\n--- OPENING LINE ---\n\n';
  sheet += `"${isLive ? niche.opener(name) : BUILD_AFTER.opener(name)}"\n`;

  // Why they need it
  sheet += '\n--- WHY THEY NEED THIS ---\n\n';
  sheet += `- ${niche.pain()}\n`;
  if (rating > 0) {
    sheet += `- ${reviewCount} reviews at ${rating} stars and nowhere to show them off\n`;
  }
  if (reviewData && reviewData.themes.length > 0) {
    sheet += `- Their reviews keep bringing up: ${reviewData.themes.join(', ')}\n`;
  }
  sheet += '- The businesses around here that do have sites are picking up those calls instead\n';

  if (isLive) {
    sheet += '\n--- IF THEY SAY YES ---\n\n';
    sheet += `"Sweet. I'll text it to this number right now. Look it over.\n`;
    sheet += `If you want to keep it live it's 99 a month and I handle\n`;
    sheet += `everything. Cancel whenever."\n`;

    sheet += '\n--- IF THEY SAY "WHAT\'S THE CATCH" ---\n\n';
    sheet += `"No catch. It's already built and already live. I'll leave it\n`;
    sheet += `up for a week either way. If you don't want it, it comes down\n`;
    sheet += `and you owe nothing."\n`;

    sheet += '\n--- IF THEY SAY "I\'LL THINK ABOUT IT" ---\n\n';
    sheet += `"No rush. It stays up for a week. I'll text you the link so\n`;
    sheet += `you can look whenever. If you want it, call me back at this\n`;
    sheet += `number."\n`;

    sheet += '\n--- IF THEY SAY NO ---\n\n';
    sheet += `"All good. It'll be up another week if you change your mind.\n`;
    sheet += `Take it easy."\n`;
  } else {
    sheet += '\n--- IF THEY SAY YES ---\n\n';
    sheet += `${BUILD_AFTER.yes}\n`;

    sheet += '\n--- IF THEY SAY "WHAT\'S THE CATCH" ---\n\n';
    sheet += `${BUILD_AFTER.catch}\n`;

    sheet += '\n--- IF THEY SAY "I\'LL THINK ABOUT IT" ---\n\n';
    sheet += `${BUILD_AFTER.think}\n`;

    sheet += '\n--- IF THEY SAY NO ---\n\n';
    sheet += `${BUILD_AFTER.no}\n`;
  }

  // Review highlights for conversation
  if (reviewData && reviewData.lines.length > 0) {
    sheet += '\n--- REVIEW HIGHLIGHTS (use in conversation) ---\n\n';
    for (const line of reviewData.lines) {
      sheet += `${line}\n`;
    }
    sheet += '\n';
    sheet += `Worth dropping in the call: "You've got ${reviewCount} reviews on\n`;
    sheet += `Google and people love you guys. The site puts those right up\n`;
    sheet += `front where new customers actually see them."\n`;
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
    const slug = slugify(row.business_name);
    const sheetPath = path.join(CALLS_DIR, `${slug}.txt`);

    if (fs.existsSync(sheetPath)) {
      const existing = fs.readFileSync(sheetPath, 'utf-8');
      const needsRefresh = row.live_url && existing.includes('NO SITE BUILT YET');
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

      const mode = row.live_url ? 'site live' : 'build-after script';
      console.log(`CALL SHEET: ${row.business_name} -> calls/${slug}.txt (${row.phone || 'NO PHONE'}, ${mode})`);
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
