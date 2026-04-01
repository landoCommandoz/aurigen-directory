const { upsertAuctions, logScrapeRun, parseDate, cleanText, getStateName, fetchWithTimeout } = require('./utils');

const PLATFORM = 'realauction';
const BASE_URL = 'https://www.realauction.com/';

// Comprehensive seed list — FL (67), AZ (15), NJ (21), CO (12) = 115 counties
// FL: realtaxdeed.com | AZ: arizonataxsale.com | NJ: newjerseytaxliens.com | CO: coloradotaxsale.com
var _RA = [
  // ── Florida (67 counties — tax deed, rolling sales year-round) ──
  ['FL','Alachua County','https://alachua.realtaxdeed.com','2026-07-01'],
  ['FL','Baker County','https://baker.realtaxdeed.com','2026-07-01'],
  ['FL','Bay County','https://bay.realtaxdeed.com','2026-07-01'],
  ['FL','Bradford County','https://bradford.realtaxdeed.com','2026-07-01'],
  ['FL','Brevard County','https://brevard.realtaxdeed.com','2026-07-01'],
  ['FL','Broward County','https://broward.realtaxdeed.com','2026-07-01'],
  ['FL','Calhoun County','https://calhoun.realtaxdeed.com','2026-07-01'],
  ['FL','Charlotte County','https://charlotte.realtaxdeed.com','2026-07-01'],
  ['FL','Citrus County','https://citrus.realtaxdeed.com','2026-07-01'],
  ['FL','Clay County','https://clay.realtaxdeed.com','2026-07-01'],
  ['FL','Collier County','https://collier.realtaxdeed.com','2026-07-01'],
  ['FL','Columbia County','https://columbia.realtaxdeed.com','2026-07-01'],
  ['FL','DeSoto County','https://desoto.realtaxdeed.com','2026-07-01'],
  ['FL','Dixie County','https://dixie.realtaxdeed.com','2026-07-01'],
  ['FL','Duval County','https://duval.realtaxdeed.com','2026-07-01'],
  ['FL','Escambia County','https://escambia.realtaxdeed.com','2026-07-01'],
  ['FL','Flagler County','https://flagler.realtaxdeed.com','2026-07-01'],
  ['FL','Franklin County','https://franklin.realtaxdeed.com','2026-07-01'],
  ['FL','Gadsden County','https://gadsden.realtaxdeed.com','2026-07-01'],
  ['FL','Gilchrist County','https://gilchrist.realtaxdeed.com','2026-07-01'],
  ['FL','Glades County','https://glades.realtaxdeed.com','2026-07-01'],
  ['FL','Gulf County','https://gulf.realtaxdeed.com','2026-07-01'],
  ['FL','Hamilton County','https://hamilton.realtaxdeed.com','2026-07-01'],
  ['FL','Hardee County','https://hardee.realtaxdeed.com','2026-07-01'],
  ['FL','Hendry County','https://hendry.realtaxdeed.com','2026-07-01'],
  ['FL','Hernando County','https://hernando.realtaxdeed.com','2026-07-01'],
  ['FL','Highlands County','https://highlands.realtaxdeed.com','2026-07-01'],
  ['FL','Hillsborough County','https://hillsborough.realtaxdeed.com','2026-07-01'],
  ['FL','Holmes County','https://holmes.realtaxdeed.com','2026-07-01'],
  ['FL','Indian River County','https://indian-river.realtaxdeed.com','2026-07-01'],
  ['FL','Jackson County','https://jackson.realtaxdeed.com','2026-07-01'],
  ['FL','Jefferson County','https://jefferson.realtaxdeed.com','2026-07-01'],
  ['FL','Lafayette County','https://lafayette.realtaxdeed.com','2026-07-01'],
  ['FL','Lake County','https://lake.realtaxdeed.com','2026-07-01'],
  ['FL','Lee County','https://lee.realtaxdeed.com','2026-07-01'],
  ['FL','Leon County','https://leon.realtaxdeed.com','2026-07-01'],
  ['FL','Levy County','https://levy.realtaxdeed.com','2026-07-01'],
  ['FL','Liberty County','https://liberty.realtaxdeed.com','2026-07-01'],
  ['FL','Madison County','https://madison.realtaxdeed.com','2026-07-01'],
  ['FL','Manatee County','https://manatee.realtaxdeed.com','2026-07-01'],
  ['FL','Marion County','https://marion.realtaxdeed.com','2026-07-01'],
  ['FL','Martin County','https://martin.realtaxdeed.com','2026-07-01'],
  ['FL','Miami-Dade County','https://miami-dade.realtaxdeed.com','2026-07-01'],
  ['FL','Monroe County','https://monroe.realtaxdeed.com','2026-07-01'],
  ['FL','Nassau County','https://nassau.realtaxdeed.com','2026-07-01'],
  ['FL','Okaloosa County','https://okaloosa.realtaxdeed.com','2026-07-01'],
  ['FL','Okeechobee County','https://okeechobee.realtaxdeed.com','2026-07-01'],
  ['FL','Orange County','https://orange.realtaxdeed.com','2026-07-01'],
  ['FL','Osceola County','https://osceola.realtaxdeed.com','2026-07-01'],
  ['FL','Palm Beach County','https://palm-beach.realtaxdeed.com','2026-07-01'],
  ['FL','Pasco County','https://pasco.realtaxdeed.com','2026-07-01'],
  ['FL','Pinellas County','https://pinellas.realtaxdeed.com','2026-07-01'],
  ['FL','Polk County','https://polk.realtaxdeed.com','2026-07-01'],
  ['FL','Putnam County','https://putnam.realtaxdeed.com','2026-07-01'],
  ['FL','Santa Rosa County','https://santa-rosa.realtaxdeed.com','2026-07-01'],
  ['FL','Sarasota County','https://sarasota.realtaxdeed.com','2026-07-01'],
  ['FL','Seminole County','https://seminole.realtaxdeed.com','2026-07-01'],
  ['FL','St. Johns County','https://st-johns.realtaxdeed.com','2026-07-01'],
  ['FL','St. Lucie County','https://st-lucie.realtaxdeed.com','2026-07-01'],
  ['FL','Sumter County','https://sumter.realtaxdeed.com','2026-07-01'],
  ['FL','Suwannee County','https://suwannee.realtaxdeed.com','2026-07-01'],
  ['FL','Taylor County','https://taylor.realtaxdeed.com','2026-07-01'],
  ['FL','Union County','https://union.realtaxdeed.com','2026-07-01'],
  ['FL','Volusia County','https://volusia.realtaxdeed.com','2026-07-01'],
  ['FL','Wakulla County','https://wakulla.realtaxdeed.com','2026-07-01'],
  ['FL','Walton County','https://walton.realtaxdeed.com','2026-07-01'],
  ['FL','Washington County','https://washington.realtaxdeed.com','2026-07-01'],
  // ── Arizona (15 counties — tax lien, February annually) ──
  ['AZ','Maricopa County','https://maricopa.arizonataxsale.com','2027-02-01'],
  ['AZ','Pima County','https://pima.arizonataxsale.com','2027-02-01'],
  ['AZ','Pinal County','https://pinal.arizonataxsale.com','2027-02-01'],
  ['AZ','Yavapai County','https://yavapai.arizonataxsale.com','2027-02-01'],
  ['AZ','Mohave County','https://mohave.arizonataxsale.com','2027-02-01'],
  ['AZ','Yuma County','https://yuma.arizonataxsale.com','2027-02-01'],
  ['AZ','Coconino County','https://coconino.arizonataxsale.com','2027-02-01'],
  ['AZ','Navajo County','https://navajo.arizonataxsale.com','2027-02-01'],
  ['AZ','Apache County','https://apache.arizonataxsale.com','2027-02-01'],
  ['AZ','Cochise County','https://cochise.arizonataxsale.com','2027-02-01'],
  ['AZ','Graham County','https://graham.arizonataxsale.com','2027-02-01'],
  ['AZ','Santa Cruz County','https://santa-cruz.arizonataxsale.com','2027-02-01'],
  ['AZ','Greenlee County','https://greenlee.arizonataxsale.com','2027-02-01'],
  ['AZ','La Paz County','https://la-paz.arizonataxsale.com','2027-02-01'],
  ['AZ','Gila County','https://gila.arizonataxsale.com','2027-02-01'],
  // ── New Jersey (21 counties — tax lien, municipal level, fall) ──
  ['NJ','Atlantic County','https://atlantic.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Bergen County','https://bergen.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Burlington County','https://burlington.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Camden County','https://camden.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Cape May County','https://capemay.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Cumberland County','https://cumberland.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Essex County','https://essex.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Gloucester County','https://gloucester.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Hudson County','https://hudson.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Hunterdon County','https://hunterdon.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Mercer County','https://mercer.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Middlesex County','https://middlesex.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Monmouth County','https://monmouth.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Morris County','https://morris.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Ocean County','https://ocean.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Passaic County','https://passaic.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Salem County','https://salem.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Somerset County','https://somerset.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Sussex County','https://sussex.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Union County','https://union.newjerseytaxliens.com','2026-10-15'],
  ['NJ','Warren County','https://warren.newjerseytaxliens.com','2026-10-15'],
  // ── Colorado (12 counties — tax lien, November annually) ──
  ['CO','Adams County','https://adams.coloradotaxsale.com','2026-11-01'],
  ['CO','Arapahoe County','https://arapahoe.coloradotaxsale.com','2026-11-01'],
  ['CO','Boulder County','https://boulder.coloradotaxsale.com','2026-11-01'],
  ['CO','Denver County','https://denver.coloradotaxsale.com','2026-11-01'],
  ['CO','Douglas County','https://douglas.coloradotaxsale.com','2026-11-01'],
  ['CO','El Paso County','https://elpaso.coloradotaxsale.com','2026-11-01'],
  ['CO','Jefferson County','https://jefferson.coloradotaxsale.com','2026-11-01'],
  ['CO','Larimer County','https://larimer.coloradotaxsale.com','2026-11-01'],
  ['CO','Mesa County','https://mesa.coloradotaxsale.com','2026-11-01'],
  ['CO','Pueblo County','https://pueblo.coloradotaxsale.com','2026-11-01'],
  ['CO','Weld County','https://weld.coloradotaxsale.com','2026-11-01'],
  ['CO','Grand County','https://grand.coloradotaxsale.com','2026-11-01'],
];
var _RA_NAMES = {FL:'Florida',AZ:'Arizona',NJ:'New Jersey',CO:'Colorado'};
const FALLBACK_SEEDS = _RA.map(function(s) {
  return {state:_RA_NAMES[s[0]],state_code:s[0],county:s[1],auction_date:s[3],registration_deadline:null,status:'Estimated',platform:PLATFORM,platform_url:s[2],bid_method:'Online',active:true,source:'seed'};
});

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
    const locDatePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:County|Parish))\s*,?\s*([A-Z]{2})\b[\s\S]{0,80}?(\d{1,2}\/\d{1,2}\/\d{4}|[A-Z][a-z]+\s+\d{1,2},?\s*\d{4})/g;
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

  const locMatch = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:County|Parish)?)\s*,\s*([A-Z]{2})\b/);
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
