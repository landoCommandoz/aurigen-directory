const { upsertAuctions, logScrapeRun, parseDate, cleanText, getStateName, fetchWithTimeout } = require('./utils');

const PLATFORM = 'realauction';
const BASE_URL = 'https://www.realauction.com/';

// Seed fallback — known upcoming sales for FL, NJ, AZ
const FALLBACK_SEEDS = [
  { state: 'Florida', state_code: 'FL', county: 'Miami-Dade County', auction_date: '2026-06-01', registration_deadline: '2026-05-15', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.realauction.com/miami-dade-county-fl', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Florida', state_code: 'FL', county: 'Broward County', auction_date: '2026-05-20', registration_deadline: '2026-05-06', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.realauction.com/broward-county-fl', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Florida', state_code: 'FL', county: 'Palm Beach County', auction_date: '2026-06-03', registration_deadline: '2026-05-20', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.realauction.com/palm-beach-county-fl', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Florida', state_code: 'FL', county: 'Hillsborough County', auction_date: '2026-05-28', registration_deadline: '2026-05-14', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.realauction.com/hillsborough-county-fl', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'New Jersey', state_code: 'NJ', county: 'Essex County', auction_date: '2026-06-10', registration_deadline: '2026-05-27', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.realauction.com/essex-county-nj', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'New Jersey', state_code: 'NJ', county: 'Hudson County', auction_date: '2026-06-15', registration_deadline: '2026-06-01', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.realauction.com/hudson-county-nj', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Arizona', state_code: 'AZ', county: 'Maricopa County', auction_date: '2026-02-01', registration_deadline: '2026-01-15', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.realauction.com/maricopa-county-az', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Arizona', state_code: 'AZ', county: 'Pima County', auction_date: '2026-02-10', registration_deadline: '2026-01-27', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.realauction.com/pima-county-az', bid_method: 'Online', active: true, source: 'seed' },
];

async function scrapeRealAuction() {
  let found = 0;
  let added = 0;
  let errorMsg = null;

  try {
    const response = await fetchWithTimeout(BASE_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from realauction.com`);
    }

    const html = await response.text();
    const records = parseListings(html);
    found = records.length;

    if (found === 0) {
      console.log('[realauction] No live results, using seed fallback');
      const result = await upsertAuctions(FALLBACK_SEEDS);
      await logScrapeRun({ platform: PLATFORM, records_found: FALLBACK_SEEDS.length, records_added: result.added, errors: 'Used seed fallback — no live data parsed', success: true });
      return { found: FALLBACK_SEEDS.length, added: result.added, success: true, seeded: true };
    }

    const result = await upsertAuctions(records);
    added = result.added;
    await logScrapeRun({ platform: PLATFORM, records_found: found, records_added: added, errors: null, success: true });
    console.log(`[realauction] Found: ${found}, Added: ${added}`);
    return { found, added, success: true };

  } catch (e) {
    errorMsg = e.message;
    console.error(`[realauction] Error: ${errorMsg}`);

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

  const blockPattern = /class="[^"]*(?:auction|sale|event|upcoming)[^"]*"[^>]*>([\s\S]*?)<\/(?:tr|div|li|article)>/gi;
  let match;
  while ((match = blockPattern.exec(html)) !== null) {
    const rec = extractRecord(match[0]);
    if (rec) records.push(rec);
  }

  if (records.length === 0) {
    const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    while ((match = rowPattern.exec(html)) !== null) {
      const rec = extractFromRow(match[0]);
      if (rec) records.push(rec);
    }
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
  const bidMatch = text.match(/\b(online|in[\s-]?person|hybrid|sealed[\s-]?bid)\b/i);

  return {
    state: getStateName(locMatch[2].toUpperCase()),
    state_code: locMatch[2].toUpperCase(),
    county: cleanText(locMatch[1]),
    auction_date: auctionDate,
    registration_deadline: regMatch ? parseDate(regMatch[1]) : null,
    status: 'Confirmed', platform: PLATFORM, platform_url: BASE_URL,
    bid_method: bidMatch ? cleanText(bidMatch[1]) : 'Online',
    active: true, source: 'scraper'
  };
}

function extractFromRow(row) {
  const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
  if (!cells || cells.length < 3) return null;
  const text = cells.map(c => cleanText(c.replace(/<[^>]+>/g, ''))).join(' ');
  return extractRecord('<div>' + text + '</div>');
}

// ── Property Scraping ─────────────────────────────────────────
// Scrapes property-level data from RealAuction sale pages
const { buildPropertyRecord, upsertProperties, logPropertyScrape, fetchPropertyPage, parseTableRow } = require('./properties');

// Build county-specific URL. Seeds have full URLs; scraped records only have BASE_URL.
function buildRealAuctionUrl(auction) {
  // If platform_url is already county-specific (not just the base domain), use it
  if (auction.platform_url && auction.platform_url !== BASE_URL &&
      auction.platform_url.replace(/\/+$/, '') !== BASE_URL.replace(/\/+$/, '')) {
    return auction.platform_url;
  }
  // Construct from county + state: https://www.realauction.com/{county-name}-{state_code}
  // URL pattern KEEPS "county" in the slug: broward-county-fl, essex-county-nj
  var county = (auction.county || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  var state = (auction.state_code || '').toLowerCase();
  if (!county || !state) return null;
  return 'https://www.realauction.com/' + county + '-' + state;
}

async function scrapeRealAuctionProperties(auctions) {
  var totalFound = 0;
  var totalAdded = 0;
  var errorCount = 0;

  for (var i = 0; i < auctions.length; i++) {
    var auction = auctions[i];
    var url = buildRealAuctionUrl(auction);
    if (!url) continue;

    try {
      var html = await fetchPropertyPage(url);
      if (!html) { errorCount++; continue; }

      var properties = parseRealAuctionProperties(html, auction);
      totalFound += properties.length;

      if (properties.length > 0) {
        var result = await upsertProperties(properties);
        totalAdded += result.added;
        errorCount += result.errors;
      }

      console.log('[realauction-props] ' + auction.county + ' (' + url + '): found=' + properties.length);
    } catch (e) {
      console.error('[realauction-props] Error for ' + auction.county + ':', e.message);
      errorCount++;
    }
  }

  await logPropertyScrape('realauction', null, totalFound, totalAdded,
    errorCount > 0 ? errorCount + ' errors' : null);

  return { found: totalFound, added: totalAdded, errors: errorCount };
}

function parseRealAuctionProperties(html, auction) {
  var properties = [];
  // RealAuction typically renders property tables with rows containing:
  // parcel/cert number, address, assessed value, min bid, property type, owner
  var trPattern = /<tr[^>]*class="[^"]*(?:property|item|lot|cert)[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
  var match;

  while ((match = trPattern.exec(html)) !== null) {
    var cells = parseTableRow(match[0]);
    if (cells.length < 3) continue;

    // Try to extract fields from cell positions
    // RealAuction varies by county, but common patterns:
    // [parcel_id, address, owner, assessed_value, min_bid, ...]
    var rec = buildPropertyRecord({
      parcel_id:      cells[0] || null,
      state_code:     auction.state_code,
      county:         auction.county,
      address:        cells.length > 1 ? cells[1] : null,
      owner_name:     cells.length > 2 ? cells[2] : null,
      assessed_value: cells.length > 3 ? cells[3] : null,
      opening_bid:    cells.length > 4 ? cells[4] : null,
      lien_amount:    cells.length > 5 ? cells[5] : null,
      property_type:  cells.length > 6 ? cells[6] : null,
      auction_id:     auction.id || null,
      status:         'active',
    });

    if (rec.parcel_id) properties.push(rec);
  }

  // Fallback: try generic table rows if no class-matched rows found
  if (properties.length === 0) {
    var genericTr = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    while ((match = genericTr.exec(html)) !== null) {
      var cells2 = parseTableRow(match[0]);
      // Need at least a parcel-like ID (digits/dashes/dots pattern)
      if (cells2.length < 3) continue;
      if (!/\d{2,}/.test(cells2[0])) continue;

      var rec2 = buildPropertyRecord({
        parcel_id:      cells2[0],
        state_code:     auction.state_code,
        county:         auction.county,
        address:        cells2.length > 1 ? cells2[1] : null,
        owner_name:     cells2.length > 2 ? cells2[2] : null,
        assessed_value: cells2.length > 3 ? cells2[3] : null,
        opening_bid:    cells2.length > 4 ? cells2[4] : null,
        auction_id:     auction.id || null,
        status:         'active',
      });

      if (rec2.parcel_id) properties.push(rec2);
    }
  }

  return properties;
}

module.exports = { scrapeRealAuction, scrapeRealAuctionProperties };
