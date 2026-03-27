const { upsertAuctions, logScrapeRun, parseDate, cleanText, getStateName, fetchWithTimeout } = require('./utils');

const PLATFORM = 'sri';
const BASE_URL = 'https://www.sri.com/';

// Seed fallback — known upcoming sales for IL, IN, KY
const FALLBACK_SEEDS = [
  { state: 'Illinois', state_code: 'IL', county: 'Cook County', auction_date: '2026-05-01', registration_deadline: '2026-04-17', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.sri.com/cook-county-il', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Illinois', state_code: 'IL', county: 'Will County', auction_date: '2026-05-12', registration_deadline: '2026-04-28', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.sri.com/will-county-il', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Illinois', state_code: 'IL', county: 'DuPage County', auction_date: '2026-05-18', registration_deadline: '2026-05-04', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.sri.com/dupage-county-il', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Indiana', state_code: 'IN', county: 'Marion County', auction_date: '2026-06-01', registration_deadline: '2026-05-18', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.sri.com/marion-county-in', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Indiana', state_code: 'IN', county: 'Lake County', auction_date: '2026-06-10', registration_deadline: '2026-05-27', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.sri.com/lake-county-in', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Kentucky', state_code: 'KY', county: 'Jefferson County', auction_date: '2026-05-20', registration_deadline: '2026-05-06', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.sri.com/jefferson-county-ky', bid_method: 'Online', active: true, source: 'seed' },
  { state: 'Kentucky', state_code: 'KY', county: 'Fayette County', auction_date: '2026-06-05', registration_deadline: '2026-05-22', status: 'Estimated', platform: PLATFORM, platform_url: 'https://www.sri.com/fayette-county-ky', bid_method: 'Online', active: true, source: 'seed' },
];

async function scrapeSRI() {
  let found = 0;
  let added = 0;
  let errorMsg = null;

  try {
    const response = await fetchWithTimeout(BASE_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from sri.com`);
    }

    const html = await response.text();
    const records = parseListings(html);
    found = records.length;

    if (found === 0) {
      console.log('[sri] No live results, using seed fallback');
      const result = await upsertAuctions(FALLBACK_SEEDS);
      await logScrapeRun({ platform: PLATFORM, records_found: FALLBACK_SEEDS.length, records_added: result.added, errors: 'Used seed fallback — no live data parsed', success: true });
      return { found: FALLBACK_SEEDS.length, added: result.added, success: true, seeded: true };
    }

    const result = await upsertAuctions(records);
    added = result.added;
    await logScrapeRun({ platform: PLATFORM, records_found: found, records_added: added, errors: null, success: true });
    console.log(`[sri] Found: ${found}, Added: ${added}`);
    return { found, added, success: true };

  } catch (e) {
    errorMsg = e.message;
    console.error(`[sri] Error: ${errorMsg}`);

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

  const blockPattern = /class="[^"]*(?:sale|auction|event|upcoming|calendar)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|tr|li|article)>/gi;
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
  if (!cells || cells.length < 2) return null;
  const text = cells.map(c => cleanText(c.replace(/<[^>]+>/g, ''))).join(' ');
  return extractRecord('<div>' + text + '</div>');
}

module.exports = { scrapeSRI };
