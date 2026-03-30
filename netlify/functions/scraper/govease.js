const { upsertAuctions, logScrapeRun, parseDate, cleanText, getStateName, fetchWithTimeout } = require('./utils');

const PLATFORM = 'govease';
const BASE_URL = 'https://www.govease.com/';

// Comprehensive seed list — AL (67), GA (20), MS (15), LA (10), TX (1) = 113 counties
var _GE = [
  // ── Alabama (67 counties — tax lien, April-June annually) ──
  ['AL','Autauga County','https://www.govease.com/foreclosures/alabama/autauga','2026-05-15'],
  ['AL','Baldwin County','https://www.govease.com/foreclosures/alabama/baldwin','2026-05-15'],
  ['AL','Barbour County','https://www.govease.com/foreclosures/alabama/barbour','2026-05-15'],
  ['AL','Bibb County','https://www.govease.com/foreclosures/alabama/bibb','2026-05-15'],
  ['AL','Blount County','https://www.govease.com/foreclosures/alabama/blount','2026-05-15'],
  ['AL','Bullock County','https://www.govease.com/foreclosures/alabama/bullock','2026-05-15'],
  ['AL','Butler County','https://www.govease.com/foreclosures/alabama/butler','2026-05-15'],
  ['AL','Calhoun County','https://www.govease.com/foreclosures/alabama/calhoun','2026-05-15'],
  ['AL','Chambers County','https://www.govease.com/foreclosures/alabama/chambers','2026-05-15'],
  ['AL','Cherokee County','https://www.govease.com/foreclosures/alabama/cherokee','2026-05-15'],
  ['AL','Chilton County','https://www.govease.com/foreclosures/alabama/chilton','2026-05-15'],
  ['AL','Choctaw County','https://www.govease.com/foreclosures/alabama/choctaw','2026-05-15'],
  ['AL','Clarke County','https://www.govease.com/foreclosures/alabama/clarke','2026-05-15'],
  ['AL','Clay County','https://www.govease.com/foreclosures/alabama/clay','2026-05-15'],
  ['AL','Cleburne County','https://www.govease.com/foreclosures/alabama/cleburne','2026-05-15'],
  ['AL','Coffee County','https://www.govease.com/foreclosures/alabama/coffee','2026-05-15'],
  ['AL','Colbert County','https://www.govease.com/foreclosures/alabama/colbert','2026-05-15'],
  ['AL','Conecuh County','https://www.govease.com/foreclosures/alabama/conecuh','2026-05-15'],
  ['AL','Coosa County','https://www.govease.com/foreclosures/alabama/coosa','2026-05-15'],
  ['AL','Covington County','https://www.govease.com/foreclosures/alabama/covington','2026-05-15'],
  ['AL','Crenshaw County','https://www.govease.com/foreclosures/alabama/crenshaw','2026-05-15'],
  ['AL','Cullman County','https://www.govease.com/foreclosures/alabama/cullman','2026-05-15'],
  ['AL','Dale County','https://www.govease.com/foreclosures/alabama/dale','2026-05-15'],
  ['AL','Dallas County','https://www.govease.com/foreclosures/alabama/dallas','2026-05-15'],
  ['AL','DeKalb County','https://www.govease.com/foreclosures/alabama/dekalb','2026-05-15'],
  ['AL','Elmore County','https://www.govease.com/foreclosures/alabama/elmore','2026-05-15'],
  ['AL','Escambia County','https://www.govease.com/foreclosures/alabama/escambia','2026-05-15'],
  ['AL','Etowah County','https://www.govease.com/foreclosures/alabama/etowah','2026-05-15'],
  ['AL','Fayette County','https://www.govease.com/foreclosures/alabama/fayette','2026-05-15'],
  ['AL','Franklin County','https://www.govease.com/foreclosures/alabama/franklin','2026-05-15'],
  ['AL','Geneva County','https://www.govease.com/foreclosures/alabama/geneva','2026-05-15'],
  ['AL','Greene County','https://www.govease.com/foreclosures/alabama/greene','2026-05-15'],
  ['AL','Hale County','https://www.govease.com/foreclosures/alabama/hale','2026-05-15'],
  ['AL','Henry County','https://www.govease.com/foreclosures/alabama/henry','2026-05-15'],
  ['AL','Houston County','https://www.govease.com/foreclosures/alabama/houston','2026-05-15'],
  ['AL','Jackson County','https://www.govease.com/foreclosures/alabama/jackson','2026-05-15'],
  ['AL','Jefferson County','https://www.govease.com/foreclosures/alabama/jefferson','2026-05-15'],
  ['AL','Lamar County','https://www.govease.com/foreclosures/alabama/lamar','2026-05-15'],
  ['AL','Lauderdale County','https://www.govease.com/foreclosures/alabama/lauderdale','2026-05-15'],
  ['AL','Lawrence County','https://www.govease.com/foreclosures/alabama/lawrence','2026-05-15'],
  ['AL','Lee County','https://www.govease.com/foreclosures/alabama/lee','2026-05-15'],
  ['AL','Limestone County','https://www.govease.com/foreclosures/alabama/limestone','2026-05-15'],
  ['AL','Lowndes County','https://www.govease.com/foreclosures/alabama/lowndes','2026-05-15'],
  ['AL','Macon County','https://www.govease.com/foreclosures/alabama/macon','2026-05-15'],
  ['AL','Madison County','https://www.govease.com/foreclosures/alabama/madison','2026-05-15'],
  ['AL','Marengo County','https://www.govease.com/foreclosures/alabama/marengo','2026-05-15'],
  ['AL','Marion County','https://www.govease.com/foreclosures/alabama/marion','2026-05-15'],
  ['AL','Marshall County','https://www.govease.com/foreclosures/alabama/marshall','2026-05-15'],
  ['AL','Mobile County','https://www.govease.com/foreclosures/alabama/mobile','2026-05-15'],
  ['AL','Monroe County','https://www.govease.com/foreclosures/alabama/monroe','2026-05-15'],
  ['AL','Montgomery County','https://www.govease.com/foreclosures/alabama/montgomery','2026-05-15'],
  ['AL','Morgan County','https://www.govease.com/foreclosures/alabama/morgan','2026-05-15'],
  ['AL','Perry County','https://www.govease.com/foreclosures/alabama/perry','2026-05-15'],
  ['AL','Pickens County','https://www.govease.com/foreclosures/alabama/pickens','2026-05-15'],
  ['AL','Pike County','https://www.govease.com/foreclosures/alabama/pike','2026-05-15'],
  ['AL','Randolph County','https://www.govease.com/foreclosures/alabama/randolph','2026-05-15'],
  ['AL','Russell County','https://www.govease.com/foreclosures/alabama/russell','2026-05-15'],
  ['AL','Shelby County','https://www.govease.com/foreclosures/alabama/shelby','2026-05-15'],
  ['AL','St. Clair County','https://www.govease.com/foreclosures/alabama/st-clair','2026-05-15'],
  ['AL','Sumter County','https://www.govease.com/foreclosures/alabama/sumter','2026-05-15'],
  ['AL','Talladega County','https://www.govease.com/foreclosures/alabama/talladega','2026-05-15'],
  ['AL','Tallapoosa County','https://www.govease.com/foreclosures/alabama/tallapoosa','2026-05-15'],
  ['AL','Tuscaloosa County','https://www.govease.com/foreclosures/alabama/tuscaloosa','2026-05-15'],
  ['AL','Walker County','https://www.govease.com/foreclosures/alabama/walker','2026-05-15'],
  ['AL','Washington County','https://www.govease.com/foreclosures/alabama/washington','2026-05-15'],
  ['AL','Wilcox County','https://www.govease.com/foreclosures/alabama/wilcox','2026-05-15'],
  ['AL','Winston County','https://www.govease.com/foreclosures/alabama/winston','2026-05-15'],
  // ── Georgia (20 major counties — tax deed) ──
  ['GA','Fulton County','https://www.govease.com/foreclosures/georgia/fulton','2026-06-01'],
  ['GA','Gwinnett County','https://www.govease.com/foreclosures/georgia/gwinnett','2026-06-01'],
  ['GA','Cobb County','https://www.govease.com/foreclosures/georgia/cobb','2026-06-01'],
  ['GA','DeKalb County','https://www.govease.com/foreclosures/georgia/dekalb','2026-06-01'],
  ['GA','Cherokee County','https://www.govease.com/foreclosures/georgia/cherokee','2026-06-01'],
  ['GA','Forsyth County','https://www.govease.com/foreclosures/georgia/forsyth','2026-06-01'],
  ['GA','Hall County','https://www.govease.com/foreclosures/georgia/hall','2026-06-01'],
  ['GA','Henry County','https://www.govease.com/foreclosures/georgia/henry','2026-06-01'],
  ['GA','Clayton County','https://www.govease.com/foreclosures/georgia/clayton','2026-06-01'],
  ['GA','Chatham County','https://www.govease.com/foreclosures/georgia/chatham','2026-06-01'],
  ['GA','Richmond County','https://www.govease.com/foreclosures/georgia/richmond','2026-06-01'],
  ['GA','Muscogee County','https://www.govease.com/foreclosures/georgia/muscogee','2026-06-01'],
  ['GA','Bibb County','https://www.govease.com/foreclosures/georgia/bibb','2026-06-01'],
  ['GA','Clarke County','https://www.govease.com/foreclosures/georgia/clarke','2026-06-01'],
  ['GA','Glynn County','https://www.govease.com/foreclosures/georgia/glynn','2026-06-01'],
  ['GA','Paulding County','https://www.govease.com/foreclosures/georgia/paulding','2026-06-01'],
  ['GA','Columbia County','https://www.govease.com/foreclosures/georgia/columbia','2026-06-01'],
  ['GA','Carroll County','https://www.govease.com/foreclosures/georgia/carroll','2026-06-01'],
  ['GA','Lowndes County','https://www.govease.com/foreclosures/georgia/lowndes','2026-06-01'],
  ['GA','Coweta County','https://www.govease.com/foreclosures/georgia/coweta','2026-06-01'],
  // ── Mississippi (15 counties — tax lien) ──
  ['MS','Hinds County','https://www.govease.com/foreclosures/mississippi/hinds','2026-08-15'],
  ['MS','Harrison County','https://www.govease.com/foreclosures/mississippi/harrison','2026-08-15'],
  ['MS','DeSoto County','https://www.govease.com/foreclosures/mississippi/desoto','2026-08-15'],
  ['MS','Rankin County','https://www.govease.com/foreclosures/mississippi/rankin','2026-08-15'],
  ['MS','Madison County','https://www.govease.com/foreclosures/mississippi/madison','2026-08-15'],
  ['MS','Jackson County','https://www.govease.com/foreclosures/mississippi/jackson','2026-08-15'],
  ['MS','Lamar County','https://www.govease.com/foreclosures/mississippi/lamar','2026-08-15'],
  ['MS','Forrest County','https://www.govease.com/foreclosures/mississippi/forrest','2026-08-15'],
  ['MS','Lee County','https://www.govease.com/foreclosures/mississippi/lee','2026-08-15'],
  ['MS','Lowndes County','https://www.govease.com/foreclosures/mississippi/lowndes','2026-08-15'],
  ['MS','Warren County','https://www.govease.com/foreclosures/mississippi/warren','2026-08-15'],
  ['MS','Pike County','https://www.govease.com/foreclosures/mississippi/pike','2026-08-15'],
  ['MS','Pearl River County','https://www.govease.com/foreclosures/mississippi/pearl-river','2026-08-15'],
  ['MS','George County','https://www.govease.com/foreclosures/mississippi/george','2026-08-15'],
  ['MS','Oktibbeha County','https://www.govease.com/foreclosures/mississippi/oktibbeha','2026-08-15'],
  // ── Louisiana (10 parishes — tax lien) ──
  ['LA','Orleans Parish','https://www.govease.com/foreclosures/louisiana/orleans','2026-06-01'],
  ['LA','Jefferson Parish','https://www.govease.com/foreclosures/louisiana/jefferson','2026-06-01'],
  ['LA','East Baton Rouge Parish','https://www.govease.com/foreclosures/louisiana/east-baton-rouge','2026-06-01'],
  ['LA','St. Tammany Parish','https://www.govease.com/foreclosures/louisiana/st-tammany','2026-06-01'],
  ['LA','Caddo Parish','https://www.govease.com/foreclosures/louisiana/caddo','2026-06-01'],
  ['LA','Calcasieu Parish','https://www.govease.com/foreclosures/louisiana/calcasieu','2026-06-01'],
  ['LA','Lafayette Parish','https://www.govease.com/foreclosures/louisiana/lafayette','2026-06-01'],
  ['LA','Bossier Parish','https://www.govease.com/foreclosures/louisiana/bossier','2026-06-01'],
  ['LA','Ouachita Parish','https://www.govease.com/foreclosures/louisiana/ouachita','2026-06-01'],
  ['LA','Livingston Parish','https://www.govease.com/foreclosures/louisiana/livingston','2026-06-01'],
  // ── Texas (1 county — GovEase) ──
  ['TX','McLennan County','https://www.govease.com/foreclosures/texas/mclennan','2026-06-01'],
];
var _GE_NAMES = {AL:'Alabama',GA:'Georgia',MS:'Mississippi',LA:'Louisiana',TX:'Texas'};
const FALLBACK_SEEDS = _GE.map(function(s) {
  return {state:_GE_NAMES[s[0]],state_code:s[0],county:s[1],auction_date:s[3],registration_deadline:null,status:'Estimated',platform:PLATFORM,platform_url:s[2],bid_method:'Online',active:true,source:'seed'};
});

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
