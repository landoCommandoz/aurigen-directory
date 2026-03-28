const { upsertAuctions, logScrapeRun, parseDate, cleanText, getStateName, fetchWithTimeout } = require('./utils');

const PLATFORM = 'govease';
const BASE_URL = 'https://www.govease.com/';

// Seed fallback — known upcoming sales for AL, LA, MS
const FALLBACK_SEEDS = [
  { state: 'Alabama', state_code: 'AL', county: 'Jefferson County', auction_date: '2026-05-15', registration_deadline: '2026-05-01', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.govease.com/foreclosures/alabama/jefferson', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Alabama', state_code: 'AL', county: 'Mobile County', auction_date: '2026-05-20', registration_deadline: '2026-05-06', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.govease.com/foreclosures/alabama/mobile', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Alabama', state_code: 'AL', county: 'Madison County', auction_date: '2026-06-01', registration_deadline: '2026-05-18', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.govease.com/foreclosures/alabama/madison', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Louisiana', state_code: 'LA', county: 'Orleans Parish', auction_date: '2026-05-10', registration_deadline: '2026-04-26', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.govease.com/foreclosures/louisiana/orleans', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Louisiana', state_code: 'LA', county: 'East Baton Rouge Parish', auction_date: '2026-06-05', registration_deadline: '2026-05-22', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.govease.com/foreclosures/louisiana/east-baton-rouge', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Mississippi', state_code: 'MS', county: 'Hinds County', auction_date: '2026-05-18', registration_deadline: '2026-05-04', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.govease.com/foreclosures/mississippi/hinds', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Mississippi', state_code: 'MS', county: 'Harrison County', auction_date: '2026-06-08', registration_deadline: '2026-05-25', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.govease.com/foreclosures/mississippi/harrison', bid_method: 'Online', active: true, source: 'seed' },
];

async function scrapeGovEase() {
  let found = 0;
  let added = 0;
  let errorMsg = null;

  try {
    const response = await fetchWithTimeout(BASE_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from govease.com`);
    }

    const html = await response.text();
    const records = parseListings(html);
    found = records.length;

    if (found === 0) {
      console.log('[govease] No live results, using seed fallback');
      const result = await upsertAuctions(FALLBACK_SEEDS);
      await logScrapeRun({ platform: PLATFORM, records_found: FALLBACK_SEEDS.length, records_added: result.added, errors: 'Used seed fallback — no live data parsed', success: true });
      return { found: FALLBACK_SEEDS.length, added: result.added, success: true, seeded: true };
    }

    const result = await upsertAuctions(records);
    added = result.added;
    await logScrapeRun({ platform: PLATFORM, records_found: found, records_added: added, errors: null, success: true });
    console.log(`[govease] Found: ${found}, Added: ${added}`);
    return { found, added, success: true };

  } catch (e) {
    errorMsg = e.message;
    console.error(`[govease] Error: ${errorMsg}`);

    try {
      const result = await upsertAuctions(FALLBACK_SEEDS);
      await logScrapeRun({ platform: PLATFORM, records_found: FALLBACK_SEEDS.length, records_added: result.added, errors: `Scrape failed: ${errorMsg}. Used seed fallback.`, success: false });
      return { found: FALLBACK_SEEDS.length, added: result.added, success: false, error: errorMsg, seeded: true };
    } catch (seedErr) {
      await logScrapeRun({ platform: PLATFORM, records_found: 0, records_added: 0, errors: `Scrape failed: ${errorMsg}. Seed also failed: ${seedErr.message}`, success: false });
      return { found: 0, added: 0, success: false, error: errorMsg };
    }
  }
}

function parseListings(html) {
  const records = [];

  const blockPattern = /class="[^"]*(?:sale|auction|event|listing|calendar)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|tr|li|article)>/gi;
  let match;
  while ((match = blockPattern.exec(html)) !== null) {
    const rec = extractRecord(match[0]);
    if (rec) records.push(rec);
  }

  if (records.length === 0) {
    const plainText = html.replace(/<[^>]+>/g, ' ');
    const locDatePattern = /([A-Za-z\s]+(?:County|Parish))\s*,?\s*([A-Z]{2})\b[\s\S]{0,80}?(\d{1,2}\/\d{1,2}\/\d{4}|[A-Z][a-z]+\s+\d{1,2},?\s*\d{4})/g;
    while ((match = locDatePattern.exec(plainText)) !== null) {
      const county = cleanText(match[1]);
      const stateCode = match[2].toUpperCase();
      const auctionDate = parseDate(match[3]);
      if (auctionDate && county) {
        records.push({
          state: getStateName(stateCode), state_code: stateCode, county,
          auction_date: auctionDate, registration_deadline: null,
          status: 'Confirmed', platform: PLATFORM, platform_url: BASE_URL,
          bid_method: 'Online', active: true, source: 'scraper'
        });
      }
    }
  }

  return records;
}

function extractRecord(block) {
  const text = cleanText(block.replace(/<[^>]+>/g, ' '));

  const locMatch = text.match(/([A-Za-z\s]+(?:County|Parish)?)\s*,\s*([A-Z]{2})\b/);
  if (!locMatch) return null;

  const dateMatch = text.match(/\b(\d{1,2}\/\d{1,2}\/\d{4}|[A-Z][a-z]+\s+\d{1,2},?\s*\d{4})\b/);
  const auctionDate = dateMatch ? parseDate(dateMatch[1]) : null;
  if (!auctionDate) return null;

  const regMatch = text.match(/regist\w*[:\s]+(\d{1,2}\/\d{1,2}\/\d{4}|[A-Z][a-z]+\s+\d{1,2},?\s*\d{4})/i);

  return {
    state: getStateName(locMatch[2].toUpperCase()),
    state_code: locMatch[2].toUpperCase(),
    county: cleanText(locMatch[1]),
    auction_date: auctionDate,
    registration_deadline: regMatch ? parseDate(regMatch[1]) : null,
    status: 'Confirmed', platform: PLATFORM, platform_url: BASE_URL,
    bid_method: 'Online', active: true, source: 'scraper'
  };
}

// ── Property Scraping ─────────────────────────────────────────
const { buildPropertyRecord, upsertProperties, logPropertyScrape, fetchPropertyPage, parseTableRow } = require('./properties');

// Build county-specific URL for GovEase
function buildGovEaseUrl(auction) {
  if (auction.platform_url && auction.platform_url !== BASE_URL &&
      auction.platform_url.replace(/\/+$/, '') !== BASE_URL.replace(/\/+$/, '')) {
    return auction.platform_url;
  }
  // Pattern: https://www.govease.com/foreclosures/{state}/{county}
  var stateName = (getStateName(auction.state_code) || '').toLowerCase().replace(/\s+/g, '-');
  var county = (auction.county || '').toLowerCase().replace(/\s+(county|parish)$/i, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (!stateName || !county) return null;
  return 'https://www.govease.com/foreclosures/' + stateName + '/' + county;
}

async function scrapeGovEaseProperties(auctions) {
  var totalFound = 0;
  var totalAdded = 0;
  var errorCount = 0;

  for (var i = 0; i < auctions.length; i++) {
    var auction = auctions[i];
    var url = buildGovEaseUrl(auction);
    if (!url) continue;

    try {
      var html = await fetchPropertyPage(url);
      if (!html) { errorCount++; continue; }

      var properties = parseGovEaseProperties(html, auction);
      totalFound += properties.length;

      if (properties.length > 0) {
        var result = await upsertProperties(properties);
        totalAdded += result.added;
        errorCount += result.errors;
      }

      console.log('[govease-props] ' + auction.county + ': found=' + properties.length);
    } catch (e) {
      console.error('[govease-props] Error for ' + auction.county + ':', e.message);
      errorCount++;
    }
  }

  await logPropertyScrape('govease', null, totalFound, totalAdded,
    errorCount > 0 ? errorCount + ' errors' : null);

  return { found: totalFound, added: totalAdded, errors: errorCount };
}

function parseGovEaseProperties(html, auction) {
  var properties = [];
  // GovEase property tables: parcel, address, assessed value, opening bid, lien amount, owner
  var trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  var match;

  while ((match = trPattern.exec(html)) !== null) {
    var cells = parseTableRow(match[0]);
    if (cells.length < 3) continue;
    // Skip header rows
    if (/parcel|address|owner/i.test(cells[0]) && /parcel|address|owner/i.test(cells[1])) continue;
    // Need a parcel-like ID
    if (!/\d{2,}/.test(cells[0])) continue;

    var rec = buildPropertyRecord({
      parcel_id:             cells[0],
      state_code:            auction.state_code,
      county:                auction.county,
      address:               cells.length > 1 ? cells[1] : null,
      assessed_value:        cells.length > 2 ? cells[2] : null,
      opening_bid:           cells.length > 3 ? cells[3] : null,
      lien_amount:           cells.length > 4 ? cells[4] : null,
      owner_name:            cells.length > 5 ? cells[5] : null,
      owner_mailing_address: cells.length > 6 ? cells[6] : null,
      property_type:         cells.length > 7 ? cells[7] : null,
      auction_id:            auction.id || null,
      status:                'active',
    });

    if (rec.parcel_id) properties.push(rec);
  }

  return properties;
}

module.exports = { scrapeGovEase, scrapeGovEaseProperties };
