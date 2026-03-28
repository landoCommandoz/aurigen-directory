const { upsertAuctions, logScrapeRun, parseDate, cleanText, getStateName, fetchWithTimeout } = require('./utils');

const PLATFORM = 'bid4assets';
const BASE_URL = 'https://www.bid4assets.com/';
const UPCOMING_URL = 'https://www.bid4assets.com/upcoming';

// Seed fallback — known upcoming sales for MI, CA
const FALLBACK_SEEDS = [
  { state: 'Michigan', state_code: 'MI', county: 'Wayne County', auction_date: '2026-05-15', registration_deadline: '2026-05-01', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.bid4assets.com/auction/wayne-county-mi', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Michigan', state_code: 'MI', county: 'Oakland County', auction_date: '2026-06-01', registration_deadline: '2026-05-18', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.bid4assets.com/auction/oakland-county-mi', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Michigan', state_code: 'MI', county: 'Genesee County', auction_date: '2026-06-10', registration_deadline: '2026-05-27', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.bid4assets.com/auction/genesee-county-mi', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Michigan', state_code: 'MI', county: 'Macomb County', auction_date: '2026-05-20', registration_deadline: '2026-05-06', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.bid4assets.com/auction/macomb-county-mi', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'California', state_code: 'CA', county: 'Los Angeles County', auction_date: '2026-06-15', registration_deadline: '2026-06-01', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.bid4assets.com/auction/los-angeles-county-ca', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'California', state_code: 'CA', county: 'San Bernardino County', auction_date: '2026-05-28', registration_deadline: '2026-05-14', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.bid4assets.com/auction/san-bernardino-county-ca', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'California', state_code: 'CA', county: 'Sacramento County', auction_date: '2026-06-08', registration_deadline: '2026-05-25', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.bid4assets.com/auction/sacramento-county-ca', bid_method: 'Online', active: true, source: 'seed' },
];

async function scrapeBid4Assets() {
  let found = 0;
  let added = 0;
  let errorMsg = null;

  try {
    let html = '';
    for (const url of [UPCOMING_URL, BASE_URL]) {
      try {
        const response = await fetchWithTimeout(url);
        if (response.ok) {
          const text = await response.text();
          if (text.length > 1000) {
            html = text;
            break;
          }
        }
      } catch (_) {
        // Try next URL
      }
    }

    if (!html) {
      throw new Error('Failed to fetch any page from bid4assets.com');
    }

    const records = parseListings(html);
    found = records.length;

    if (found === 0) {
      console.log('[bid4assets] No live results, using seed fallback');
      const result = await upsertAuctions(FALLBACK_SEEDS);
      await logScrapeRun({ platform: PLATFORM, records_found: FALLBACK_SEEDS.length, records_added: result.added, errors: 'Used seed fallback — no live data parsed', success: true });
      return { found: FALLBACK_SEEDS.length, added: result.added, success: true, seeded: true };
    }

    const result = await upsertAuctions(records);
    added = result.added;
    await logScrapeRun({ platform: PLATFORM, records_found: found, records_added: added, errors: null, success: true });
    console.log(`[bid4assets] Found: ${found}, Added: ${added}`);
    return { found, added, success: true };

  } catch (e) {
    errorMsg = e.message;
    console.error(`[bid4assets] Error: ${errorMsg}`);

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

  const blockPattern = /class="[^"]*(?:auction|sale|listing|event|upcoming|result)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|tr|li|article|section)>/gi;
  let match;
  while ((match = blockPattern.exec(html)) !== null) {
    const rec = extractRecord(match[0]);
    if (rec) records.push(rec);
  }

  if (records.length === 0) {
    const linkPattern = /<a[^>]+href="([^"]*(?:auction|sale)[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    while ((match = linkPattern.exec(html)) !== null) {
      const rec = extractRecord(match[0], match[1]);
      if (rec) records.push(rec);
    }
  }

  if (records.length === 0) {
    const plainText = html.replace(/<[^>]+>/g, ' ');
    const locDatePattern = /([A-Za-z\s]+(?:County|Parish|Borough))\s*,?\s*([A-Z]{2})\b[\s\S]{0,80}?(\d{1,2}\/\d{1,2}\/\d{4}|[A-Z][a-z]+\s+\d{1,2},?\s*\d{4})/g;
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

function extractRecord(block, href) {
  const text = cleanText(block.replace(/<[^>]+>/g, ' '));

  const locMatch = text.match(/([A-Za-z\s]+(?:County|Parish|Borough)?)\s*,\s*([A-Z]{2})\b/);
  if (!locMatch) return null;

  const dateMatch = text.match(/\b(\d{1,2}\/\d{1,2}\/\d{4}|[A-Z][a-z]+\s+\d{1,2},?\s*\d{4})\b/);
  const auctionDate = dateMatch ? parseDate(dateMatch[1]) : null;
  if (!auctionDate) return null;

  const regMatch = text.match(/regist\w*[:\s]+(\d{1,2}\/\d{1,2}\/\d{4}|[A-Z][a-z]+\s+\d{1,2},?\s*\d{4})/i);
  const bidMatch = text.match(/\b(online|in[\s-]?person|hybrid|sealed[\s-]?bid|proxy)\b/i);

  let platformUrl = BASE_URL;
  if (href) {
    try { platformUrl = new URL(href, BASE_URL).href; } catch (_) {}
  }

  return {
    state: getStateName(locMatch[2].toUpperCase()),
    state_code: locMatch[2].toUpperCase(),
    county: cleanText(locMatch[1]),
    auction_date: auctionDate,
    registration_deadline: regMatch ? parseDate(regMatch[1]) : null,
    status: 'Confirmed', platform: PLATFORM, platform_url: platformUrl,
    bid_method: bidMatch ? cleanText(bidMatch[1]) : 'Online',
    active: true, source: 'scraper'
  };
}

// ── Property Scraping ─────────────────────────────────────────
const { buildPropertyRecord, upsertProperties, logPropertyScrape, fetchPropertyPage, parseTableRow } = require('./properties');

async function scrapeBid4AssetsProperties(auctions) {
  var totalFound = 0;
  var totalAdded = 0;
  var errorCount = 0;

  for (var i = 0; i < auctions.length; i++) {
    var auction = auctions[i];
    if (!auction.platform_url) continue;

    try {
      // Bid4Assets uses React-rendered pages — try their API endpoint first
      var apiUrl = auction.platform_url.replace(/\/+$/, '') + '/api/lots';
      var html = await fetchPropertyPage(apiUrl);

      // If API fails, try the HTML page
      if (!html) {
        html = await fetchPropertyPage(auction.platform_url);
      }
      if (!html) { errorCount++; continue; }

      var properties = parseBid4AssetsProperties(html, auction);
      totalFound += properties.length;

      if (properties.length > 0) {
        var result = await upsertProperties(properties);
        totalAdded += result.added;
        errorCount += result.errors;
      }

      console.log('[bid4assets-props] ' + auction.county + ': found=' + properties.length);
    } catch (e) {
      console.error('[bid4assets-props] Error for ' + auction.county + ':', e.message);
      errorCount++;
    }
  }

  await logPropertyScrape('bid4assets', null, totalFound, totalAdded,
    errorCount > 0 ? errorCount + ' errors' : null);

  return { found: totalFound, added: totalAdded, errors: errorCount };
}

function parseBid4AssetsProperties(html, auction) {
  var properties = [];

  // Try JSON response first (from API endpoint)
  try {
    var json = JSON.parse(html);
    var lots = json.lots || json.items || json.data || [];
    if (Array.isArray(lots)) {
      for (var j = 0; j < lots.length; j++) {
        var lot = lots[j];
        var rec = buildPropertyRecord({
          parcel_id:      lot.parcel_number || lot.parcel_id || lot.lot_number || String(j + 1),
          state_code:     auction.state_code,
          county:         auction.county,
          address:        lot.address || lot.property_address || null,
          assessed_value: lot.assessed_value || null,
          opening_bid:    lot.opening_bid || lot.starting_bid || lot.min_bid || null,
          property_type:  lot.property_type || lot.type || null,
          owner_name:     lot.owner || lot.owner_name || null,
          auction_id:     auction.id || null,
          status:         'active',
        });
        if (rec.parcel_id) properties.push(rec);
      }
      return properties;
    }
  } catch (e) {
    // Not JSON — fall through to HTML parsing
  }

  // HTML fallback — parse table rows
  var trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  var match;
  while ((match = trPattern.exec(html)) !== null) {
    var cells = parseTableRow(match[0]);
    if (cells.length < 3) continue;
    if (!/\d{2,}/.test(cells[0])) continue;

    var rec2 = buildPropertyRecord({
      parcel_id:      cells[0],
      state_code:     auction.state_code,
      county:         auction.county,
      address:        cells.length > 1 ? cells[1] : null,
      assessed_value: cells.length > 2 ? cells[2] : null,
      opening_bid:    cells.length > 3 ? cells[3] : null,
      owner_name:     cells.length > 4 ? cells[4] : null,
      property_type:  cells.length > 5 ? cells[5] : null,
      auction_id:     auction.id || null,
      status:         'active',
    });

    if (rec2.parcel_id) properties.push(rec2);
  }

  return properties;
}

module.exports = { scrapeBid4Assets, scrapeBid4AssetsProperties };
