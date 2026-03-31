// ============================================================
// AURIGEN SCRAPER — puppeteer-govease.js
// Puppeteer-based property scraper for GovEase platform
// Targets AL (67 counties) + GA (20 counties)
// Architecture: public page → discover liveauctions link → scrape parcels
// netlify/functions/scraper/puppeteer-govease.js
// ============================================================

const { logScrapeRun } = require('./utils');
const { buildPropertyRecord, upsertProperties } = require('./properties');

const PLATFORM = 'govease';
var LIVE_AUCTION_BASE = 'https://liveauctions.govease.com';

// ── Seed list: AL + GA counties ──
// Pattern: https://www.govease.com/foreclosures/{state}/{county}
var SEEDS = [
  // ── Alabama (67 counties — tax lien, April-June annually) ──
  ['AL','Autauga County','https://www.govease.com/foreclosures/alabama/autauga'],
  ['AL','Baldwin County','https://www.govease.com/foreclosures/alabama/baldwin'],
  ['AL','Barbour County','https://www.govease.com/foreclosures/alabama/barbour'],
  ['AL','Bibb County','https://www.govease.com/foreclosures/alabama/bibb'],
  ['AL','Blount County','https://www.govease.com/foreclosures/alabama/blount'],
  ['AL','Bullock County','https://www.govease.com/foreclosures/alabama/bullock'],
  ['AL','Butler County','https://www.govease.com/foreclosures/alabama/butler'],
  ['AL','Calhoun County','https://www.govease.com/foreclosures/alabama/calhoun'],
  ['AL','Chambers County','https://www.govease.com/foreclosures/alabama/chambers'],
  ['AL','Cherokee County','https://www.govease.com/foreclosures/alabama/cherokee'],
  ['AL','Chilton County','https://www.govease.com/foreclosures/alabama/chilton'],
  ['AL','Choctaw County','https://www.govease.com/foreclosures/alabama/choctaw'],
  ['AL','Clarke County','https://www.govease.com/foreclosures/alabama/clarke'],
  ['AL','Clay County','https://www.govease.com/foreclosures/alabama/clay'],
  ['AL','Cleburne County','https://www.govease.com/foreclosures/alabama/cleburne'],
  ['AL','Coffee County','https://www.govease.com/foreclosures/alabama/coffee'],
  ['AL','Colbert County','https://www.govease.com/foreclosures/alabama/colbert'],
  ['AL','Conecuh County','https://www.govease.com/foreclosures/alabama/conecuh'],
  ['AL','Coosa County','https://www.govease.com/foreclosures/alabama/coosa'],
  ['AL','Covington County','https://www.govease.com/foreclosures/alabama/covington'],
  ['AL','Crenshaw County','https://www.govease.com/foreclosures/alabama/crenshaw'],
  ['AL','Cullman County','https://www.govease.com/foreclosures/alabama/cullman'],
  ['AL','Dale County','https://www.govease.com/foreclosures/alabama/dale'],
  ['AL','Dallas County','https://www.govease.com/foreclosures/alabama/dallas'],
  ['AL','DeKalb County','https://www.govease.com/foreclosures/alabama/dekalb'],
  ['AL','Elmore County','https://www.govease.com/foreclosures/alabama/elmore'],
  ['AL','Escambia County','https://www.govease.com/foreclosures/alabama/escambia'],
  ['AL','Etowah County','https://www.govease.com/foreclosures/alabama/etowah'],
  ['AL','Fayette County','https://www.govease.com/foreclosures/alabama/fayette'],
  ['AL','Franklin County','https://www.govease.com/foreclosures/alabama/franklin'],
  ['AL','Geneva County','https://www.govease.com/foreclosures/alabama/geneva'],
  ['AL','Greene County','https://www.govease.com/foreclosures/alabama/greene'],
  ['AL','Hale County','https://www.govease.com/foreclosures/alabama/hale'],
  ['AL','Henry County','https://www.govease.com/foreclosures/alabama/henry'],
  ['AL','Houston County','https://www.govease.com/foreclosures/alabama/houston'],
  ['AL','Jackson County','https://www.govease.com/foreclosures/alabama/jackson'],
  ['AL','Jefferson County','https://www.govease.com/foreclosures/alabama/jefferson'],
  ['AL','Lamar County','https://www.govease.com/foreclosures/alabama/lamar'],
  ['AL','Lauderdale County','https://www.govease.com/foreclosures/alabama/lauderdale'],
  ['AL','Lawrence County','https://www.govease.com/foreclosures/alabama/lawrence'],
  ['AL','Lee County','https://www.govease.com/foreclosures/alabama/lee'],
  ['AL','Limestone County','https://www.govease.com/foreclosures/alabama/limestone'],
  ['AL','Lowndes County','https://www.govease.com/foreclosures/alabama/lowndes'],
  ['AL','Macon County','https://www.govease.com/foreclosures/alabama/macon'],
  ['AL','Madison County','https://www.govease.com/foreclosures/alabama/madison'],
  ['AL','Marengo County','https://www.govease.com/foreclosures/alabama/marengo'],
  ['AL','Marion County','https://www.govease.com/foreclosures/alabama/marion'],
  ['AL','Marshall County','https://www.govease.com/foreclosures/alabama/marshall'],
  ['AL','Mobile County','https://www.govease.com/foreclosures/alabama/mobile'],
  ['AL','Monroe County','https://www.govease.com/foreclosures/alabama/monroe'],
  ['AL','Montgomery County','https://www.govease.com/foreclosures/alabama/montgomery'],
  ['AL','Morgan County','https://www.govease.com/foreclosures/alabama/morgan'],
  ['AL','Perry County','https://www.govease.com/foreclosures/alabama/perry'],
  ['AL','Pickens County','https://www.govease.com/foreclosures/alabama/pickens'],
  ['AL','Pike County','https://www.govease.com/foreclosures/alabama/pike'],
  ['AL','Randolph County','https://www.govease.com/foreclosures/alabama/randolph'],
  ['AL','Russell County','https://www.govease.com/foreclosures/alabama/russell'],
  ['AL','Shelby County','https://www.govease.com/foreclosures/alabama/shelby'],
  ['AL','St. Clair County','https://www.govease.com/foreclosures/alabama/st-clair'],
  ['AL','Sumter County','https://www.govease.com/foreclosures/alabama/sumter'],
  ['AL','Talladega County','https://www.govease.com/foreclosures/alabama/talladega'],
  ['AL','Tallapoosa County','https://www.govease.com/foreclosures/alabama/tallapoosa'],
  ['AL','Tuscaloosa County','https://www.govease.com/foreclosures/alabama/tuscaloosa'],
  ['AL','Walker County','https://www.govease.com/foreclosures/alabama/walker'],
  ['AL','Washington County','https://www.govease.com/foreclosures/alabama/washington'],
  ['AL','Wilcox County','https://www.govease.com/foreclosures/alabama/wilcox'],
  ['AL','Winston County','https://www.govease.com/foreclosures/alabama/winston'],
  // ── Georgia (20 major counties — redeemable deed) ──
  ['GA','Fulton County','https://www.govease.com/foreclosures/georgia/fulton'],
  ['GA','Gwinnett County','https://www.govease.com/foreclosures/georgia/gwinnett'],
  ['GA','Cobb County','https://www.govease.com/foreclosures/georgia/cobb'],
  ['GA','DeKalb County','https://www.govease.com/foreclosures/georgia/dekalb'],
  ['GA','Cherokee County','https://www.govease.com/foreclosures/georgia/cherokee'],
  ['GA','Forsyth County','https://www.govease.com/foreclosures/georgia/forsyth'],
  ['GA','Hall County','https://www.govease.com/foreclosures/georgia/hall'],
  ['GA','Henry County','https://www.govease.com/foreclosures/georgia/henry'],
  ['GA','Clayton County','https://www.govease.com/foreclosures/georgia/clayton'],
  ['GA','Chatham County','https://www.govease.com/foreclosures/georgia/chatham'],
  ['GA','Richmond County','https://www.govease.com/foreclosures/georgia/richmond'],
  ['GA','Muscogee County','https://www.govease.com/foreclosures/georgia/muscogee'],
  ['GA','Bibb County','https://www.govease.com/foreclosures/georgia/bibb'],
  ['GA','Clarke County','https://www.govease.com/foreclosures/georgia/clarke'],
  ['GA','Glynn County','https://www.govease.com/foreclosures/georgia/glynn'],
  ['GA','Paulding County','https://www.govease.com/foreclosures/georgia/paulding'],
  ['GA','Columbia County','https://www.govease.com/foreclosures/georgia/columbia'],
  ['GA','Carroll County','https://www.govease.com/foreclosures/georgia/carroll'],
  ['GA','Lowndes County','https://www.govease.com/foreclosures/georgia/lowndes'],
  ['GA','Coweta County','https://www.govease.com/foreclosures/georgia/coweta'],
];

function delay(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

// ── Extract property rows from rendered DOM ─────────────────
function extractPropertiesFromDOM() {
  var results = [];

  // Strategy 1: Table rows
  var rows = document.querySelectorAll('table tr, .property-row, [class*="auction-item"], [class*="property-item"], [class*="lot-item"]');
  rows.forEach(function(row) {
    var cells = row.querySelectorAll('td');
    if (cells.length < 3) return;

    var cellTexts = [];
    cells.forEach(function(c) { cellTexts.push((c.textContent || '').trim()); });

    if (/parcel|address|owner|property/i.test(cellTexts[0]) &&
        /parcel|address|owner|property/i.test(cellTexts[1])) return;

    if (!/\d{2,}/.test(cellTexts[0])) return;

    results.push({
      parcel_id:      cellTexts[0] || null,
      address:        cellTexts.length > 1 ? cellTexts[1] : null,
      assessed_value: cellTexts.length > 2 ? cellTexts[2] : null,
      opening_bid:    cellTexts.length > 3 ? cellTexts[3] : null,
      lien_amount:    cellTexts.length > 4 ? cellTexts[4] : null,
      owner_name:     cellTexts.length > 5 ? cellTexts[5] : null,
      property_type:  cellTexts.length > 7 ? cellTexts[7] : null,
    });
  });

  // Strategy 2: Card-based layouts
  if (results.length === 0) {
    var cards = document.querySelectorAll('.auction-card, .property-card, .sale-item, .listing-item, [class*="auction-list"] > div, [class*="property-list"] > div');
    cards.forEach(function(card) {
      var text = (card.textContent || '').replace(/\s+/g, ' ').trim();
      var parcelMatch = text.match(/(?:parcel|cert|lot|pin|folio)\s*#?\s*:?\s*([A-Z0-9\-\.]+)/i);
      if (!parcelMatch) return;

      var bidMatch = text.match(/(?:opening|min|starting|amount|bid)\s*(?:bid|price)?\s*:?\s*\$?([\d,]+\.?\d*)/i);
      var assessedMatch = text.match(/(?:assessed|appraised|market|fair)\s*(?:value)?\s*:?\s*\$?([\d,]+\.?\d*)/i);
      var lienMatch = text.match(/(?:lien|tax|delinquen)\s*(?:amount|owed|due)?\s*:?\s*\$?([\d,]+\.?\d*)/i);
      var addressMatch = text.match(/(?:address|property|location)\s*:?\s*(.+?)(?:(?:parcel|cert|owner|assessed|bid|amount|\$))/i);
      var ownerMatch = text.match(/(?:owner|defendant|taxpayer)\s*:?\s*(.+?)(?:(?:address|parcel|\$|assessed))/i);

      results.push({
        parcel_id:      parcelMatch[1],
        address:        addressMatch ? addressMatch[1].trim() : null,
        opening_bid:    bidMatch ? bidMatch[1] : null,
        assessed_value: assessedMatch ? assessedMatch[1] : null,
        lien_amount:    lienMatch ? lienMatch[1] : null,
        owner_name:     ownerMatch ? ownerMatch[1].trim() : null,
      });
    });
  }

  return results;
}

// ── Extract live auction URLs from public page ──────────────
function extractLiveAuctionUrls() {
  var urls = [];
  var links = document.querySelectorAll('a[href*="liveauctions.govease.com"], a[href*="browsebid"]');
  links.forEach(function(a) {
    var href = a.getAttribute('href') || '';
    if (href && urls.indexOf(href) === -1) urls.push(href);
  });
  // Check Register/Bid Now buttons
  var buttons = document.querySelectorAll('a.btn, a[class*="register"], a[class*="bid"], button[onclick]');
  buttons.forEach(function(btn) {
    var href = btn.getAttribute('href') || '';
    var onclick = btn.getAttribute('onclick') || '';
    if (href.indexOf('liveauctions') !== -1 && urls.indexOf(href) === -1) urls.push(href);
    var m = onclick.match(/['"]([^'"]*liveauctions[^'"]*)['"]/);
    if (m && urls.indexOf(m[1]) === -1) urls.push(m[1]);
  });
  return urls;
}

// ── Find next page button ───────────────────────────────────
function findNextPageButton() {
  var selectors = [
    'a[aria-label="Next"]', 'a[rel="next"]', '.pagination a:last-child',
    'a[title="Next"]', 'button[aria-label="Next"]', '.pager .next a',
    'a.next', 'li.next a', '.page-link[aria-label="Next"]',
  ];
  for (var i = 0; i < selectors.length; i++) {
    try {
      var el = document.querySelector(selectors[i]);
      if (el && !el.classList.contains('disabled') && !el.hasAttribute('disabled')) return selectors[i];
    } catch (e) { /* ignore */ }
  }
  var links = document.querySelectorAll('a, button');
  for (var j = 0; j < links.length; j++) {
    var txt = (links[j].textContent || '').trim();
    if (/^(Next|>>|›|»)$/i.test(txt) && !links[j].classList.contains('disabled')) {
      links[j].setAttribute('data-puppeteer-next', 'true');
      return '[data-puppeteer-next="true"]';
    }
  }
  return null;
}

// ── Scrape a single county ──────────────────────────────────
// Step 1: Hit public page → discover liveauctions.govease.com link
// Step 2: If found, navigate and scrape parcel table
// Step 3: Fallback to public page scraping
// NOTE: liveauctions.govease.com requires auth — parcels visible 1-2 days pre-sale
async function scrapeCounty(browser, seed) {
  var stateCode = seed[0];
  var county = seed[1];
  var publicUrl = seed[2];
  var properties = [];
  var page = null;

  try {
    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    await page.setRequestInterception(true);
    page.on('request', function(req) {
      var type = req.resourceType();
      if (type === 'image' || type === 'font' || type === 'stylesheet') { req.abort(); }
      else { req.continue(); }
    });

    // ── Step 1: Public page → discover live auction URL ──
    console.log('[puppeteer-ge] Public: ' + county + ' → ' + publicUrl);
    await page.goto(publicUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(2000);

    var liveUrls = await page.evaluate(extractLiveAuctionUrls);
    console.log('[puppeteer-ge] ' + county + ': ' + liveUrls.length + ' live auction links');

    // ── Step 2: Try live auction pages ──
    for (var li = 0; li < liveUrls.length; li++) {
      var liveUrl = liveUrls[li];
      if (liveUrl.startsWith('/')) liveUrl = LIVE_AUCTION_BASE + liveUrl;

      console.log('[puppeteer-ge] Live: ' + county + ' → ' + liveUrl);
      try {
        await page.goto(liveUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(2000);

        // Auth wall detection
        var currentUrl = page.url();
        if (currentUrl.indexOf('/Account/Login') !== -1 || currentUrl.indexOf('/login') !== -1) {
          console.log('[puppeteer-ge] ' + county + ': auth wall — skipping live page');
          continue;
        }

        try {
          await page.waitForSelector('table, [class*="property"], [class*="parcel"], [class*="bid"]', { timeout: 10000 });
        } catch (e) { console.log('[puppeteer-ge] No parcel table on live page for ' + county); continue; }

        // Paginate live auction pages
        var pageNum = 1;
        var maxPages = 50;
        while (pageNum <= maxPages) {
          var pageResults = await page.evaluate(extractPropertiesFromDOM);
          console.log('[puppeteer-ge] ' + county + ' live page ' + pageNum + ': ' + pageResults.length + ' rows');

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

          if (pageResults.length === 0) break;
          var nextSelector = await page.evaluate(findNextPageButton);
          if (!nextSelector) break;

          try {
            await page.click(nextSelector);
            await delay(2000);
            await page.waitForSelector('table, [class*="property"], [class*="parcel"]', { timeout: 10000 });
          } catch (e) { break; }
          pageNum++;
        }
      } catch (e) {
        console.error('[puppeteer-ge] Error on live page for ' + county + ':', e.message);
      }
    }

    // ── Step 3: Fallback — scrape public page ──
    if (properties.length === 0) {
      console.log('[puppeteer-ge] No live data for ' + county + ', scraping public page');
      await page.goto(publicUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      try {
        await page.waitForSelector('table, .card, .listing, [class*="auction"], [class*="property"]', { timeout: 10000 });
        var pubResults = await page.evaluate(extractPropertiesFromDOM);
        for (var pi = 0; pi < pubResults.length; pi++) {
          var prec = buildPropertyRecord({
            parcel_id: pubResults[pi].parcel_id, state_code: stateCode, county: county,
            address: pubResults[pi].address, owner_name: pubResults[pi].owner_name,
            assessed_value: pubResults[pi].assessed_value, opening_bid: pubResults[pi].opening_bid,
            lien_amount: pubResults[pi].lien_amount, property_type: pubResults[pi].property_type,
            status: 'active',
          });
          if (prec.parcel_id) properties.push(prec);
        }
      } catch (e) {
        console.log('[puppeteer-ge] No content on public page for ' + county);
      }
    }

    var result = { added: 0, errors: 0 };
    if (properties.length > 0) { result = await upsertProperties(properties); }

    console.log('[puppeteer-ge] ' + county + ': found=' + properties.length + ' added=' + result.added);
    return { county: county, found: properties.length, added: result.added };

  } catch (e) {
    console.error('[puppeteer-ge] Error scraping ' + county + ':', e.message);
    return { county: county, found: 0, added: 0, error: e.message };
  } finally {
    if (page) { try { await page.close(); } catch (e) { /* ignore */ } }
  }
}

// ── Main entry point ────────────────────────────────────────
async function scrapeGovEasePuppeteer() {
  var puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('[puppeteer-ge] Puppeteer not installed. Run: npm install puppeteer');
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

    console.log('[puppeteer-ge] Browser launched. Scraping ' + SEEDS.length + ' counties...');

    for (var i = 0; i < SEEDS.length; i++) {
      var result = await scrapeCounty(browser, SEEDS[i]);
      countyResults.push(result);
      totalFound += result.found;
      totalAdded += result.added;
      if (result.error) errorCount++;

      if (i < SEEDS.length - 1) await delay(2000);
    }

    await logScrapeRun({
      platform: PLATFORM + '_puppeteer',
      records_found: totalFound,
      records_added: totalAdded,
      errors: errorCount > 0 ? errorCount + ' county errors' : null,
      success: errorCount === 0,
    });

    console.log('[puppeteer-ge] COMPLETE: found=' + totalFound + ' added=' + totalAdded + ' errors=' + errorCount);
    return { found: totalFound, added: totalAdded, errors: errorCount, counties: countyResults };

  } catch (e) {
    console.error('[puppeteer-ge] Fatal error:', e.message);
    await logScrapeRun({
      platform: PLATFORM + '_puppeteer', records_found: totalFound, records_added: totalAdded,
      errors: 'Fatal: ' + e.message, success: false,
    });
    return { found: totalFound, added: totalAdded, errors: errorCount + 1, error: e.message };
  } finally {
    if (browser) { try { await browser.close(); } catch (e) { /* ignore */ } }
  }
}

module.exports = { scrapeGovEasePuppeteer, SEEDS };
