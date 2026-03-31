// ============================================================
// AURIGEN SCRAPER — puppeteer-realauction.js
// Puppeteer-based property scraper for RealAuction platform
// Targets FL (67 counties) + AZ (15 counties) via JS-rendered pages
// ColdFusion architecture: calendar → date discovery → pageno pagination
// netlify/functions/scraper/puppeteer-realauction.js
// ============================================================

const { logScrapeRun } = require('./utils');
const { buildPropertyRecord, upsertProperties } = require('./properties');

const PLATFORM = 'realauction';

// ── Seed list: FL + AZ counties with subdomain URLs ──
// FL: {county}.realtaxdeed.com | AZ: {county}.arizonataxsale.com
var SEEDS = [
  // ── Florida (67 counties — tax deed, rolling sales year-round) ──
  ['FL','Alachua County','https://alachua.realtaxdeed.com'],
  ['FL','Baker County','https://baker.realtaxdeed.com'],
  ['FL','Bay County','https://bay.realtaxdeed.com'],
  ['FL','Bradford County','https://bradford.realtaxdeed.com'],
  ['FL','Brevard County','https://brevard.realtaxdeed.com'],
  ['FL','Broward County','https://broward.realtaxdeed.com'],
  ['FL','Calhoun County','https://calhoun.realtaxdeed.com'],
  ['FL','Charlotte County','https://charlotte.realtaxdeed.com'],
  ['FL','Citrus County','https://citrus.realtaxdeed.com'],
  ['FL','Clay County','https://clay.realtaxdeed.com'],
  ['FL','Collier County','https://collier.realtaxdeed.com'],
  ['FL','Columbia County','https://columbia.realtaxdeed.com'],
  ['FL','DeSoto County','https://desoto.realtaxdeed.com'],
  ['FL','Dixie County','https://dixie.realtaxdeed.com'],
  ['FL','Duval County','https://duval.realtaxdeed.com'],
  ['FL','Escambia County','https://escambia.realtaxdeed.com'],
  ['FL','Flagler County','https://flagler.realtaxdeed.com'],
  ['FL','Franklin County','https://franklin.realtaxdeed.com'],
  ['FL','Gadsden County','https://gadsden.realtaxdeed.com'],
  ['FL','Gilchrist County','https://gilchrist.realtaxdeed.com'],
  ['FL','Glades County','https://glades.realtaxdeed.com'],
  ['FL','Gulf County','https://gulf.realtaxdeed.com'],
  ['FL','Hamilton County','https://hamilton.realtaxdeed.com'],
  ['FL','Hardee County','https://hardee.realtaxdeed.com'],
  ['FL','Hendry County','https://hendry.realtaxdeed.com'],
  ['FL','Hernando County','https://hernando.realtaxdeed.com'],
  ['FL','Highlands County','https://highlands.realtaxdeed.com'],
  ['FL','Hillsborough County','https://hillsborough.realtaxdeed.com'],
  ['FL','Holmes County','https://holmes.realtaxdeed.com'],
  ['FL','Indian River County','https://indian-river.realtaxdeed.com'],
  ['FL','Jackson County','https://jackson.realtaxdeed.com'],
  ['FL','Jefferson County','https://jefferson.realtaxdeed.com'],
  ['FL','Lafayette County','https://lafayette.realtaxdeed.com'],
  ['FL','Lake County','https://lake.realtaxdeed.com'],
  ['FL','Lee County','https://lee.realtaxdeed.com'],
  ['FL','Leon County','https://leon.realtaxdeed.com'],
  ['FL','Levy County','https://levy.realtaxdeed.com'],
  ['FL','Liberty County','https://liberty.realtaxdeed.com'],
  ['FL','Madison County','https://madison.realtaxdeed.com'],
  ['FL','Manatee County','https://manatee.realtaxdeed.com'],
  ['FL','Marion County','https://marion.realtaxdeed.com'],
  ['FL','Martin County','https://martin.realtaxdeed.com'],
  ['FL','Miami-Dade County','https://miami-dade.realtaxdeed.com'],
  ['FL','Monroe County','https://monroe.realtaxdeed.com'],
  ['FL','Nassau County','https://nassau.realtaxdeed.com'],
  ['FL','Okaloosa County','https://okaloosa.realtaxdeed.com'],
  ['FL','Okeechobee County','https://okeechobee.realtaxdeed.com'],
  ['FL','Orange County','https://orange.realtaxdeed.com'],
  ['FL','Osceola County','https://osceola.realtaxdeed.com'],
  ['FL','Palm Beach County','https://palm-beach.realtaxdeed.com'],
  ['FL','Pasco County','https://pasco.realtaxdeed.com'],
  ['FL','Pinellas County','https://pinellas.realtaxdeed.com'],
  ['FL','Polk County','https://polk.realtaxdeed.com'],
  ['FL','Putnam County','https://putnam.realtaxdeed.com'],
  ['FL','Santa Rosa County','https://santa-rosa.realtaxdeed.com'],
  ['FL','Sarasota County','https://sarasota.realtaxdeed.com'],
  ['FL','Seminole County','https://seminole.realtaxdeed.com'],
  ['FL','St. Johns County','https://st-johns.realtaxdeed.com'],
  ['FL','St. Lucie County','https://st-lucie.realtaxdeed.com'],
  ['FL','Sumter County','https://sumter.realtaxdeed.com'],
  ['FL','Suwannee County','https://suwannee.realtaxdeed.com'],
  ['FL','Taylor County','https://taylor.realtaxdeed.com'],
  ['FL','Union County','https://union.realtaxdeed.com'],
  ['FL','Volusia County','https://volusia.realtaxdeed.com'],
  ['FL','Wakulla County','https://wakulla.realtaxdeed.com'],
  ['FL','Walton County','https://walton.realtaxdeed.com'],
  ['FL','Washington County','https://washington.realtaxdeed.com'],
  // ── Arizona (15 counties — tax lien, February annually) ──
  ['AZ','Maricopa County','https://maricopa.arizonataxsale.com'],
  ['AZ','Pima County','https://pima.arizonataxsale.com'],
  ['AZ','Pinal County','https://pinal.arizonataxsale.com'],
  ['AZ','Yavapai County','https://yavapai.arizonataxsale.com'],
  ['AZ','Mohave County','https://mohave.arizonataxsale.com'],
  ['AZ','Yuma County','https://yuma.arizonataxsale.com'],
  ['AZ','Coconino County','https://coconino.arizonataxsale.com'],
  ['AZ','Navajo County','https://navajo.arizonataxsale.com'],
  ['AZ','Apache County','https://apache.arizonataxsale.com'],
  ['AZ','Cochise County','https://cochise.arizonataxsale.com'],
  ['AZ','Graham County','https://graham.arizonataxsale.com'],
  ['AZ','Santa Cruz County','https://santa-cruz.arizonataxsale.com'],
  ['AZ','Greenlee County','https://greenlee.arizonataxsale.com'],
  ['AZ','La Paz County','https://la-paz.arizonataxsale.com'],
  ['AZ','Gila County','https://gila.arizonataxsale.com'],
];

function delay(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

// ── Extract property rows from rendered DOM ─────────────────
// Runs inside page.evaluate — browser context only, no Node APIs
function extractPropertiesFromDOM() {
  var results = [];

  // Strategy 1: Table rows with property/cert/lot data
  var rows = document.querySelectorAll('table tr, .property-row, .lot-row, .cert-row, [class*="auction-item"], [class*="property-item"]');
  rows.forEach(function(row) {
    var cells = row.querySelectorAll('td');
    if (cells.length < 3) return;

    var cellTexts = [];
    cells.forEach(function(c) { cellTexts.push((c.textContent || '').trim()); });

    // Skip header rows
    if (/parcel|address|owner|property/i.test(cellTexts[0]) &&
        /parcel|address|owner|property/i.test(cellTexts[1])) return;

    // Need at least a parcel-like ID (2+ digits)
    if (!/\d{2,}/.test(cellTexts[0])) return;

    results.push({
      parcel_id:      cellTexts[0] || null,
      address:        cellTexts.length > 1 ? cellTexts[1] : null,
      owner_name:     cellTexts.length > 2 ? cellTexts[2] : null,
      assessed_value: cellTexts.length > 3 ? cellTexts[3] : null,
      opening_bid:    cellTexts.length > 4 ? cellTexts[4] : null,
      lien_amount:    cellTexts.length > 5 ? cellTexts[5] : null,
      property_type:  cellTexts.length > 6 ? cellTexts[6] : null,
    });
  });

  // Strategy 2: Card-based layouts
  if (results.length === 0) {
    var cards = document.querySelectorAll('.card, .listing, .lot, .property, [class*="auction-card"], [class*="result-item"]');
    cards.forEach(function(card) {
      var text = (card.textContent || '').replace(/\s+/g, ' ').trim();
      var parcelMatch = text.match(/(?:parcel|cert|lot|certificate)\s*#?\s*:?\s*([A-Z0-9\-\.]+)/i);
      if (!parcelMatch) return;

      var addressMatch = text.match(/(?:address|property|location)\s*:?\s*(.+?)(?:(?:parcel|cert|owner|assessed|bid|amount|\$))/i);
      var bidMatch = text.match(/(?:opening|min|starting|amount)\s*(?:bid)?\s*:?\s*\$?([\d,]+\.?\d*)/i);
      var assessedMatch = text.match(/(?:assessed|appraised|market)\s*(?:value)?\s*:?\s*\$?([\d,]+\.?\d*)/i);
      var ownerMatch = text.match(/(?:owner|defendant)\s*:?\s*(.+?)(?:(?:address|parcel|cert|assessed|\$))/i);

      results.push({
        parcel_id:      parcelMatch[1],
        address:        addressMatch ? addressMatch[1].trim() : null,
        opening_bid:    bidMatch ? bidMatch[1] : null,
        assessed_value: assessedMatch ? assessedMatch[1] : null,
        owner_name:     ownerMatch ? ownerMatch[1].trim() : null,
      });
    });
  }

  return results;
}

// ── Extract auction dates from calendar ─────────────────────
// ColdFusion: index.cfm?zaction=USER&zmethod=CALENDAR
function extractAuctionDates() {
  var dates = [];
  // Calendar links contain AUCTIONDATE param
  var links = document.querySelectorAll('a[href*="AUCTIONDATE"], a[href*="auctiondate"], .calendar-day a, td a');
  links.forEach(function(a) {
    var href = a.getAttribute('href') || '';
    var dateMatch = href.match(/AUCTIONDATE=(\d{1,2}(?:%2F|\/)\d{1,2}(?:%2F|\/)\d{4})/i);
    if (dateMatch) {
      var decoded = decodeURIComponent(dateMatch[1]);
      if (dates.indexOf(decoded) === -1) dates.push(decoded);
    }
  });
  // Fallback: highlighted calendar cells
  if (dates.length === 0) {
    var cells = document.querySelectorAll('.hasEvent, .active-date, td.event, td a[href*="cfm"]');
    cells.forEach(function(el) {
      var text = (el.textContent || '').trim();
      var href = (el.getAttribute('href') || '');
      if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(text)) {
        if (dates.indexOf(text) === -1) dates.push(text);
      } else if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(href)) {
        var m = href.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
        if (m && dates.indexOf(m[1]) === -1) dates.push(m[1]);
      }
    });
  }
  return dates;
}

// ── Scrape a single county ──────────────────────────────────
// Step 1: Calendar → discover auction dates
// Step 2: For each date, paginate through PREVIEW with pageno=
async function scrapeCounty(browser, seed) {
  var stateCode = seed[0];
  var county = seed[1];
  var baseUrl = seed[2];
  var properties = [];
  var page = null;

  try {
    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // Block heavy resources for speed
    await page.setRequestInterception(true);
    page.on('request', function(req) {
      var type = req.resourceType();
      if (type === 'image' || type === 'font' || type === 'stylesheet') {
        req.abort();
      } else {
        req.continue();
      }
    });

    // ── Step 1: Discover auction dates from calendar ──
    var calendarUrl = baseUrl + '/index.cfm?zaction=USER&zmethod=CALENDAR';
    console.log('[puppeteer-ra] Calendar: ' + county + ' → ' + calendarUrl);
    await page.goto(calendarUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(2000);

    var auctionDates = await page.evaluate(extractAuctionDates);
    console.log('[puppeteer-ra] ' + county + ': ' + auctionDates.length + ' auction dates found');

    // Fallback: try base URL directly if no calendar dates
    if (auctionDates.length === 0) {
      console.log('[puppeteer-ra] No calendar dates for ' + county + ', trying base URL');
      await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      try {
        await page.waitForSelector('table, [class*="auction"], [class*="property"]', { timeout: 10000 });
        var fallbackResults = await page.evaluate(extractPropertiesFromDOM);
        for (var fi = 0; fi < fallbackResults.length; fi++) {
          var frec = buildPropertyRecord({
            parcel_id: fallbackResults[fi].parcel_id, state_code: stateCode, county: county,
            address: fallbackResults[fi].address, owner_name: fallbackResults[fi].owner_name,
            assessed_value: fallbackResults[fi].assessed_value, opening_bid: fallbackResults[fi].opening_bid,
            lien_amount: fallbackResults[fi].lien_amount, property_type: fallbackResults[fi].property_type,
            status: 'active',
          });
          if (frec.parcel_id) properties.push(frec);
        }
      } catch (e) {
        console.log('[puppeteer-ra] No content at base URL for ' + county);
      }
    }

    // ── Step 2: For each date, paginate through PREVIEW ──
    for (var d = 0; d < auctionDates.length; d++) {
      var dateStr = auctionDates[d];
      var encodedDate = encodeURIComponent(dateStr);
      var pageNum = 1;
      var maxPages = 50;
      var prevCount = -1;

      while (pageNum <= maxPages) {
        var previewUrl = baseUrl + '/index.cfm?zaction=AUCTION&Zmethod=PREVIEW&AUCTIONDATE=' + encodedDate + '&pageno=' + pageNum;
        if (pageNum === 1) console.log('[puppeteer-ra] ' + county + ' date=' + dateStr + ' → ' + previewUrl);

        await page.goto(previewUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(2000);

        var pageResults = await page.evaluate(extractPropertiesFromDOM);
        console.log('[puppeteer-ra] ' + county + ' date=' + dateStr + ' page=' + pageNum + ': ' + pageResults.length + ' rows');

        if (pageResults.length === 0) break;
        if (pageResults.length === prevCount && pageNum > 1) break;
        prevCount = pageResults.length;

        for (var i = 0; i < pageResults.length; i++) {
          var raw = pageResults[i];
          var rec = buildPropertyRecord({
            parcel_id: raw.parcel_id, state_code: stateCode, county: county,
            address: raw.address, owner_name: raw.owner_name,
            assessed_value: raw.assessed_value, opening_bid: raw.opening_bid,
            lien_amount: raw.lien_amount, property_type: raw.property_type,
            status: 'active',
          });
          if (rec.parcel_id) properties.push(rec);
        }
        pageNum++;
      }
    }

    // ── Upsert to Supabase ──
    var result = { added: 0, errors: 0 };
    if (properties.length > 0) {
      result = await upsertProperties(properties);
    }

    console.log('[puppeteer-ra] ' + county + ': found=' + properties.length + ' added=' + result.added);
    return { county: county, found: properties.length, added: result.added };

  } catch (e) {
    console.error('[puppeteer-ra] Error scraping ' + county + ':', e.message);
    return { county: county, found: 0, added: 0, error: e.message };
  } finally {
    if (page) { try { await page.close(); } catch (e) { /* ignore */ } }
  }
}

// ── Main entry point ────────────────────────────────────────
async function scrapeRealAuctionPuppeteer() {
  var puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('[puppeteer-ra] Puppeteer not installed. Run: npm install puppeteer');
    return { found: 0, added: 0, errors: 1, error: 'puppeteer not installed' };
  }

  var totalFound = 0;
  var totalAdded = 0;
  var errorCount = 0;
  var countyResults = [];
  var browser = null;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
    });

    console.log('[puppeteer-ra] Browser launched. Scraping ' + SEEDS.length + ' counties...');

    for (var i = 0; i < SEEDS.length; i++) {
      var result = await scrapeCounty(browser, SEEDS[i]);
      countyResults.push(result);
      totalFound += result.found;
      totalAdded += result.added;
      if (result.error) errorCount++;

      // 2s rate limit between counties
      if (i < SEEDS.length - 1) await delay(2000);
    }

    await logScrapeRun({
      platform: PLATFORM + '_puppeteer',
      records_found: totalFound,
      records_added: totalAdded,
      errors: errorCount > 0 ? errorCount + ' county errors' : null,
      success: errorCount === 0,
    });

    console.log('[puppeteer-ra] COMPLETE: found=' + totalFound + ' added=' + totalAdded + ' errors=' + errorCount);
    return { found: totalFound, added: totalAdded, errors: errorCount, counties: countyResults };

  } catch (e) {
    console.error('[puppeteer-ra] Fatal error:', e.message);
    await logScrapeRun({
      platform: PLATFORM + '_puppeteer', records_found: totalFound, records_added: totalAdded,
      errors: 'Fatal: ' + e.message, success: false,
    });
    return { found: totalFound, added: totalAdded, errors: errorCount + 1, error: e.message };
  } finally {
    if (browser) { try { await browser.close(); } catch (e) { /* ignore */ } }
  }
}

module.exports = { scrapeRealAuctionPuppeteer, SEEDS };
