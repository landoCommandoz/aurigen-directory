// ============================================================
// AURIGEN — scrape-properties-background.js
// Dedicated background function for property-level scraping.
// Netlify background functions run up to 15 minutes.
// The "-background" suffix triggers Netlify's async handler —
// returns 202 immediately, runs the handler in the background.
// ============================================================

const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  var url = process.env.SUPABASE_URL;
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}

// Import property scrapers from the scraper directory
const { scrapeRealAuctionProperties } = require('./scraper/realauction');
const { scrapeGovEaseProperties } = require('./scraper/govease');
const { scrapeSRIProperties } = require('./scraper/sri');
const { scrapeBid4AssetsProperties } = require('./scraper/bid4assets');

exports.handler = async (event) => {
  // Security: validate scraper secret
  var secret = (event.headers || {})['x-scraper-secret'];
  if (secret !== process.env.SCRAPER_SECRET) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  console.log('[props-scraper] Starting property scrape run...');
  var startTime = Date.now();
  var propertyResults = {};
  var totalPropsFound = 0;
  var totalPropsAdded = 0;

  try {
    var supabase = getSupabase();
    var today = new Date().toISOString().split('T')[0];

    var { data: recentAuctions, error } = await supabase
      .from('auctions')
      .select('id, state_code, county, auction_date, platform, platform_url')
      .eq('active', true)
      .gte('auction_date', today)
      .order('auction_date', { ascending: true })
      .limit(50);

    if (error) {
      console.error('[props-scraper] Auctions query error:', error.message);
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    if (!recentAuctions || recentAuctions.length === 0) {
      console.log('[props-scraper] No active auctions found. Nothing to scrape.');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, totalPropsFound: 0, totalPropsAdded: 0, message: 'No active auctions' })
      };
    }

    console.log('[props-scraper] Found ' + recentAuctions.length + ' active auctions to scrape properties for.');

    var propScrapers = [
      { name: 'realauction', fn: scrapeRealAuctionProperties, filter: 'realauction' },
      { name: 'govease', fn: scrapeGovEaseProperties, filter: 'govease' },
      { name: 'sri', fn: scrapeSRIProperties, filter: 'sri' },
      { name: 'bid4assets', fn: scrapeBid4AssetsProperties, filter: 'bid4assets' },
    ];

    for (var i = 0; i < propScrapers.length; i++) {
      var ps = propScrapers[i];
      try {
        var platformAuctions = recentAuctions.filter(function(a) { return a.platform === ps.filter; });
        if (platformAuctions.length === 0) {
          console.log('[props-scraper] No auctions for ' + ps.name + ', skipping.');
          continue;
        }

        console.log('[props-scraper] Running ' + ps.name + ' for ' + platformAuctions.length + ' auctions...');
        var propResult = await ps.fn(platformAuctions);
        propertyResults[ps.name] = propResult;
        totalPropsFound += propResult.found || 0;
        totalPropsAdded += propResult.added || 0;
        console.log('[props-scraper] ' + ps.name + ' done — found: ' + (propResult.found || 0) + ', added: ' + (propResult.added || 0));
      } catch (e) {
        console.error('[props-scraper] ' + ps.name + ' crashed:', e.message);
        propertyResults[ps.name] = { found: 0, added: 0, errors: 1, error: e.message };
      }
    }
  } catch (e) {
    console.error('[props-scraper] Fatal error:', e.message);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }

  // Log the run to scrape_log
  try {
    var supabase2 = getSupabase();
    await supabase2.from('scrape_log').insert({
      platform: 'properties_batch',
      records_found: totalPropsFound,
      records_added: totalPropsAdded,
      errors: null,
      success: true,
    });
  } catch (e) {
    console.error('[props-scraper] Failed to log run:', e.message);
  }

  var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('[props-scraper] Complete in ' + elapsed + 's. Found: ' + totalPropsFound + ', Added: ' + totalPropsAdded);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      elapsed: elapsed + 's',
      totalPropsFound: totalPropsFound,
      totalPropsAdded: totalPropsAdded,
      platforms: propertyResults,
    })
  };
};
