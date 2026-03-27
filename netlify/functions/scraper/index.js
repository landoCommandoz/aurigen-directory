const { cleanupOldAuctions } = require('./utils');
const { scrapeRealAuction } = require('./realauction');
const { scrapeGovEase } = require('./govease');
const { scrapeSRI } = require('./sri');
const { scrapeBid4Assets } = require('./bid4assets');

// Netlify Background Function — runs async, no 10s timeout
// Name the file scraper.js or export from scraper/ directory
// Netlify detects background functions by the -background suffix or config
exports.handler = async (event) => {
  // Security: validate scraper secret
  const secret = (event.headers || {})['x-scraper-secret'];
  if (secret !== process.env.SCRAPER_SECRET) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  console.log('[scraper] Starting scrape run...');
  const startTime = Date.now();
  const results = {};

  // Run all 4 scrapers in sequence with independent try/catch
  const scrapers = [
    { name: 'realauction', fn: scrapeRealAuction },
    { name: 'govease', fn: scrapeGovEase },
    { name: 'sri', fn: scrapeSRI },
    { name: 'bid4assets', fn: scrapeBid4Assets },
  ];

  for (const scraper of scrapers) {
    try {
      console.log(`[scraper] Running ${scraper.name}...`);
      results[scraper.name] = await scraper.fn();
    } catch (e) {
      console.error(`[scraper] ${scraper.name} crashed:`, e.message);
      results[scraper.name] = { found: 0, added: 0, success: false, error: e.message };
    }
  }

  // Cleanup old auctions after all scrapers finish
  let cleaned = 0;
  try {
    cleaned = await cleanupOldAuctions();
  } catch (e) {
    console.error('[scraper] Cleanup failed:', e.message);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalFound = Object.values(results).reduce((sum, r) => sum + (r.found || 0), 0);
  const totalAdded = Object.values(results).reduce((sum, r) => sum + (r.added || 0), 0);
  const allSuccess = Object.values(results).every(r => r.success);

  console.log(`[scraper] Complete in ${elapsed}s. Found: ${totalFound}, Added: ${totalAdded}, Cleaned: ${cleaned}`);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: allSuccess,
      elapsed: `${elapsed}s`,
      summary: { totalFound, totalAdded, cleaned },
      platforms: results
    })
  };
};
