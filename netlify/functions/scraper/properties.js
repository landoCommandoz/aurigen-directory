// ============================================================
// AURIGEN SCRAPER — properties.js
// Property-level scraping utilities used by all platform scrapers
// netlify/functions/scraper/properties.js
// ============================================================

const { getSupabase, logScrapeRun, cleanText, fetchWithTimeout } = require('./utils');

// ── Rate-limited fetch ──────────────────────────────────────
// 2 second delay between requests to avoid aggressive scraping
let _lastFetchTime = 0;

async function rateLimitedFetch(url, options) {
  const now = Date.now();
  const elapsed = now - _lastFetchTime;
  if (elapsed < 2000) {
    await new Promise(resolve => setTimeout(resolve, 2000 - elapsed));
  }
  _lastFetchTime = Date.now();
  return fetchWithTimeout(url, options, 20000);
}

// ── Parse a numeric value from scraped text ─────────────────
function parseNumeric(val) {
  if (val === null || val === undefined || val === '') return null;
  var cleaned = String(val).replace(/[$,\s]/g, '').trim();
  if (!cleaned || cleaned === '-' || cleaned === 'N/A') return null;
  // Handle accounting-format negatives: (1234.56) → -1234.56
  var negate = false;
  if (cleaned.charAt(0) === '(' && cleaned.charAt(cleaned.length - 1) === ')') {
    cleaned = cleaned.slice(1, -1);
    negate = true;
  }
  var num = parseFloat(cleaned);
  if (isNaN(num)) return null;
  return negate ? -num : num;
}

// ── Parse an integer value ──────────────────────────────────
function parseInteger(val) {
  if (val === null || val === undefined || val === '') return null;
  var cleaned = String(val).replace(/[$,\s]/g, '').trim();
  var num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

// ── Build a property record from parsed data ────────────────
function buildPropertyRecord(data) {
  return {
    parcel_id:              (data.parcel_id || '').trim() || null,
    auction_id:             data.auction_id || null,
    state_code:             (data.state_code || '').toUpperCase().trim() || null,
    county:                 (data.county || '').trim() || null,
    address:                data.address ? cleanText(data.address) : null,
    assessed_value:         parseNumeric(data.assessed_value),
    opening_bid:            parseNumeric(data.opening_bid),
    lien_amount:            parseNumeric(data.lien_amount),
    lien_year:              parseInteger(data.lien_year),
    property_type:          data.property_type ? cleanText(data.property_type) : null,
    owner_name:             data.owner_name ? cleanText(data.owner_name) : null,
    owner_mailing_address:  data.owner_mailing_address ? cleanText(data.owner_mailing_address) : null,
    status:                 data.status || 'active',
    delinquency_years:      parseInteger(data.delinquency_years),
    scraped_at:             new Date().toISOString(),
    updated_at:             new Date().toISOString(),
  };
}

// ── Upsert a single property record ─────────────────────────
// Deduplicates on (state_code, county, parcel_id)
async function upsertProperty(record) {
  if (!record.state_code || !record.county || !record.parcel_id) {
    console.warn('[properties] Skipping incomplete record — missing state_code, county, or parcel_id');
    return { success: false, reason: 'incomplete' };
  }

  try {
    var supabase = getSupabase();
    var { error } = await supabase
      .from('properties')
      .upsert(record, {
        onConflict: 'state_code,county,parcel_id',
      });

    if (error) {
      console.error('[properties] Upsert error:', error.message);
      return { success: false, reason: error.message };
    }
    return { success: true };
  } catch (e) {
    console.error('[properties] Upsert crashed:', e.message);
    return { success: false, reason: e.message };
  }
}

// ── Batch upsert properties ─────────────────────────────────
async function upsertProperties(records) {
  var added = 0;
  var skipped = 0;
  var errors = 0;

  for (var i = 0; i < records.length; i++) {
    var result = await upsertProperty(records[i]);
    if (result.success) {
      added++;
    } else if (result.reason === 'incomplete') {
      skipped++;
    } else {
      errors++;
    }
  }

  return { added, skipped, errors };
}

// ── Log a property scrape run ───────────────────────────────
async function logPropertyScrape(platform, auctionId, recordsFound, recordsAdded, errorMsg) {
  try {
    await logScrapeRun({
      platform: platform + '_properties',
      records_found: recordsFound,
      records_added: recordsAdded,
      errors: errorMsg || null,
      success: !errorMsg,
    });
  } catch (e) {
    console.error('[properties] Failed to log scrape:', e.message);
  }
}

// ── Generic HTML table row parser ───────────────────────────
// Extracts text from each <td> in a <tr>
function parseTableRow(trHtml) {
  var cells = [];
  var tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  var match;
  while ((match = tdPattern.exec(trHtml)) !== null) {
    cells.push(cleanText(match[1].replace(/<[^>]+>/g, ' ')));
  }
  return cells;
}

// ── Generic property list fetcher ───────────────────────────
// Fetches a URL and returns the raw HTML
async function fetchPropertyPage(url) {
  try {
    var response = await rateLimitedFetch(url);
    if (!response.ok) {
      console.error('[properties] HTTP ' + response.status + ' from ' + url);
      return null;
    }
    return await response.text();
  } catch (e) {
    console.error('[properties] Fetch failed for ' + url + ':', e.message);
    return null;
  }
}

// ── Exports ─────────────────────────────────────────────────
module.exports = {
  rateLimitedFetch,
  parseNumeric,
  parseInteger,
  buildPropertyRecord,
  upsertProperty,
  upsertProperties,
  logPropertyScrape,
  parseTableRow,
  fetchPropertyPage,
};
