const { cleanupOldAuctions, getSupabase, getStateName } = require('./utils');
const { scrapeRealAuction } = require('./realauction');
const { scrapeGovEase } = require('./govease');
const { scrapeSRI } = require('./sri');
const { scrapeBid4Assets } = require('./bid4assets');

// Auto-generate pulse_alerts for auctions within the next 30 days
async function generatePulseAlerts() {
  const supabase = getSupabase();
  const today = new Date();
  const cutoff = new Date();
  cutoff.setDate(today.getDate() + 30);

  const todayStr = today.toISOString().split('T')[0];
  const cutoffStr = cutoff.toISOString().split('T')[0];

  // Fetch upcoming auctions in the next 30 days
  const { data: upcoming, error: fetchErr } = await supabase
    .from('auctions')
    .select('state, state_code, county, auction_date, platform')
    .eq('active', true)
    .gte('auction_date', todayStr)
    .lte('auction_date', cutoffStr)
    .order('auction_date', { ascending: true });

  if (fetchErr) {
    console.error('[pulse] Failed to fetch upcoming auctions:', fetchErr.message);
    return 0;
  }

  if (!upcoming || upcoming.length === 0) {
    console.log('[pulse] No auctions within 30 days');
    return 0;
  }

  let inserted = 0;

  for (const a of upcoming) {
    const daysOut = Math.ceil((new Date(a.auction_date) - today) / 86400000);
    const stateName = a.state || getStateName(a.state_code) || a.state_code;
    const title = stateName + ' — ' + a.county + ' auction in ' + daysOut + ' day' + (daysOut !== 1 ? 's' : '');

    // Upsert with dedup on state_code + county + auction_date
    const { error } = await supabase
      .from('pulse_alerts')
      .upsert(
        {
          title: title,
          body: 'Upcoming ' + a.platform + ' auction on ' + a.auction_date + ' in ' + a.county + ', ' + stateName + '. Verify registration deadlines directly with the platform.',
          state_code: a.state_code,
          county: a.county,
          alert_type: 'upcoming',
          auction_date: a.auction_date,
          active: true,
        },
        {
          onConflict: 'state_code,county,auction_date',
          ignoreDuplicates: true,
        }
      );

    if (error) {
      console.warn('[pulse] Insert error:', error.message);
    } else {
      inserted++;
    }
  }

  // Deactivate pulse alerts for past auctions
  const { error: cleanErr } = await supabase
    .from('pulse_alerts')
    .update({ active: false })
    .eq('active', true)
    .not('auction_date', 'is', null)
    .lt('auction_date', todayStr);

  if (cleanErr) {
    console.warn('[pulse] Cleanup error:', cleanErr.message);
  }

  console.log('[pulse] Generated ' + inserted + ' alerts for auctions within 30 days');
  return inserted;
}

// Netlify Background Function — runs async, no 10s timeout
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

  // Generate pulse alerts for upcoming auctions
  let pulseGenerated = 0;
  try {
    pulseGenerated = await generatePulseAlerts();
  } catch (e) {
    console.error('[scraper] Pulse alert generation failed:', e.message);
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

  console.log(`[scraper] Complete in ${elapsed}s. Found: ${totalFound}, Added: ${totalAdded}, Pulse: ${pulseGenerated}, Cleaned: ${cleaned}`);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: allSuccess,
      elapsed: `${elapsed}s`,
      summary: { totalFound, totalAdded, pulseGenerated, cleaned },
      platforms: results
    })
  };
};
