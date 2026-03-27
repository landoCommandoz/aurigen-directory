// ============================================================
// AURIGEN SCRAPER — utils.js
// Shared helpers used by all platform scrapers
// netlify/functions/scraper/utils.js
// ============================================================

const { createClient } = require('@supabase/supabase-js');

// ── Supabase client (singleton) ──────────────────────────────
let _supabase = null;

function getSupabase() {
  if (_supabase) return _supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  }

  _supabase = createClient(url, key);
  return _supabase;
}

// ── Upsert auction records ───────────────────────────────────
// Deduplicates on (state_code, county, auction_date, platform)
// Returns { added, skipped, errors }
async function upsertAuctions(records) {
  const supabase = getSupabase();
  let added = 0;
  let skipped = 0;
  let errors = 0;

  for (const record of records) {
    // Validate minimum required fields before attempting insert
    if (!record.state_code || !record.county || !record.platform) {
      console.warn('[utils] Skipping incomplete record:', record);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('auctions')
      .upsert(
        {
          state:                 record.state,
          state_code:            record.state_code,
          county:                record.county,
          auction_date:          record.auction_date || null,
          registration_deadline: record.registration_deadline || null,
          status:                record.status || 'Estimated',
          platform:              record.platform,
          platform_url:          record.platform_url || null,
          bid_method:            record.bid_method || null,
          active:                true,
          scraped_at:            new Date().toISOString(),
          source:                record.source || null,
        },
        {
          onConflict: 'state_code,county,auction_date,platform',
          ignoreDuplicates: true,
        }
      );

    if (error) {
      console.error('[utils] Upsert error:', error.message, record);
      errors++;
    } else {
      added++;
    }
  }

  return { added, skipped, errors };
}

// ── Log a scrape run ─────────────────────────────────────────
async function logScrapeRun({ platform, records_found, records_added, errors, success }) {
  const supabase = getSupabase();

  const { error } = await supabase.from('scrape_log').insert({
    platform,
    records_found: records_found || 0,
    records_added: records_added || 0,
    errors:        errors ? String(errors) : null,
    success:       success === true,
    run_at:        new Date().toISOString(),
  });

  if (error) {
    console.error('[utils] Failed to write scrape_log:', error.message);
  }
}

// ── Deactivate past auctions ─────────────────────────────────
// Marks any auction older than 30 days as inactive
async function cleanupOldAuctions() {
  const supabase = getSupabase();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const { error } = await supabase
    .from('auctions')
    .update({ active: false })
    .eq('active', true)
    .lt('auction_date', cutoff.toISOString().split('T')[0]);

  if (error) {
    console.error('[utils] Cleanup error:', error.message);
  }
}

// ── Date parsing ─────────────────────────────────────────────
// Accepts many formats, returns 'YYYY-MM-DD' or null
function parseDate(raw) {
  if (!raw) return null;

  const cleaned = String(raw).trim();

  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;

  const attempt = new Date(cleaned);
  if (!isNaN(attempt.getTime())) {
    return attempt.toISOString().split('T')[0];
  }

  // MM/DD/YYYY
  const mdy = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    const [, m, d, y] = mdy;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // Month DD, YYYY — e.g. "April 15, 2025"
  const named = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (named) {
    const attempt2 = new Date(`${named[1]} ${named[2]}, ${named[3]}`);
    if (!isNaN(attempt2.getTime())) {
      return attempt2.toISOString().split('T')[0];
    }
  }

  console.warn('[utils] Could not parse date:', raw);
  return null;
}

// ── State name → code lookup ─────────────────────────────────
const STATE_CODES = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC',
};

function getStateCode(stateName) {
  if (!stateName) return null;
  const key = stateName.toLowerCase().trim();
  // Already a 2-letter code
  if (/^[A-Z]{2}$/.test(stateName.trim())) return stateName.trim().toUpperCase();
  return STATE_CODES[key] || null;
}

// ── Simple fetch with timeout ────────────────────────────────
// Node 18+ has native fetch — this wraps it with a timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AurigenBot/1.0)',
        ...(options.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

// ── Exports ──────────────────────────────────────────────────
module.exports = {
  getSupabase,
  upsertAuctions,
  logScrapeRun,
  cleanupOldAuctions,
  parseDate,
  getStateCode,
  fetchWithTimeout,
};
