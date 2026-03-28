const { cleanupOldAuctions, getSupabase, getStateName, logScrapeRun, cleanCounty } = require('./utils');
const { scrapeRealAuction, scrapeRealAuctionProperties } = require('./realauction');
const { scrapeGovEase, scrapeGovEaseProperties } = require('./govease');
const { scrapeSRI, scrapeSRIProperties } = require('./sri');
const { scrapeBid4Assets, scrapeBid4AssetsProperties } = require('./bid4assets');

// Auto-generate pulse_alerts from the auctions table
async function generatePulseAlerts() {
  const supabase = getSupabase();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const cutoff = new Date();
  cutoff.setDate(today.getDate() + 90);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`[pulse] Starting. today=${todayStr}, cutoff=${cutoffStr}`);

  // ── Part 1: Per-auction alerts for auctions within 90 days ──
  let upcoming = null;
  try {
    const result = await supabase
      .from('auctions')
      .select('state, state_code, county, auction_date, platform')
      .eq('active', true)
      .gte('auction_date', todayStr)
      .lte('auction_date', cutoffStr)
      .order('auction_date', { ascending: true });

    console.log('[pulse] Auctions query result — data:', result.data ? result.data.length : 'null', 'error:', JSON.stringify(result.error));
    if (result.error) {
      console.error('[pulse] Auctions query FULL error:', JSON.stringify(result.error, null, 2));
    } else {
      upcoming = result.data;
    }
  } catch (e) {
    console.error('[pulse] Auctions query THREW:', e.message, e.stack);
  }

  if (upcoming && upcoming.length > 0) {
    console.log(`[pulse] Found ${upcoming.length} auctions within 90 days. First:`, JSON.stringify(upcoming[0]));

    for (const a of upcoming) {
      const daysOut = Math.ceil((new Date(a.auction_date) - today) / 86400000);
      const stateName = a.state || getStateName(a.state_code) || a.state_code;
      const county = cleanCounty(a.county);
      const alertText = stateName + ' — ' + county + ' auction in ' + daysOut + ' day' + (daysOut !== 1 ? 's' : '');

      const payload = {
        alert_text: alertText,
        type: 'upcoming',
        state_code: a.state_code,
        date: a.auction_date,
        auction_date: a.auction_date,
        active: true,
      };

      console.log('[pulse] Part1 upsert payload:', JSON.stringify(payload));

      try {
        const { data: upsertData, error: upsertErr, status, statusText } = await supabase
          .from('pulse_alerts')
          .upsert(payload, { onConflict: 'state_code,auction_date,alert_text', ignoreDuplicates: true })
          .select();

        console.log('[pulse] Part1 upsert response — status:', status, statusText, 'data:', JSON.stringify(upsertData), 'error:', JSON.stringify(upsertErr));

        if (upsertErr) {
          console.error('[pulse] Part1 upsert FULL error:', JSON.stringify(upsertErr, null, 2));
          errors++;
        } else if (upsertData && upsertData.length === 0) {
          skipped++;
        } else {
          inserted++;
        }
      } catch (e) {
        console.error('[pulse] Part1 upsert THREW:', e.message, e.stack);
        errors++;
      }
    }
  } else {
    console.log('[pulse] No auctions within 90 days (upcoming is', upcoming ? 'empty array' : 'null', ')');
  }

  // ── Part 2: State+platform summary alerts (all future auctions) ──
  let summaryCount = 0;
  let allFuture = null;
  try {
    const result = await supabase
      .from('auctions')
      .select('state, state_code, county, auction_date, platform')
      .eq('active', true)
      .gte('auction_date', todayStr)
      .order('auction_date', { ascending: true });

    console.log('[pulse] All-future query result — data:', result.data ? result.data.length : 'null', 'error:', JSON.stringify(result.error));
    if (result.error) {
      console.error('[pulse] All-future query FULL error:', JSON.stringify(result.error, null, 2));
    } else {
      allFuture = result.data;
    }
  } catch (e) {
    console.error('[pulse] All-future query THREW:', e.message, e.stack);
  }

  if (allFuture && allFuture.length > 0) {
    // Group by state_code + platform
    const groups = {};
    for (const a of allFuture) {
      const key = a.state_code + '|' + a.platform;
      if (!groups[key]) {
        groups[key] = { state: a.state, state_code: a.state_code, platform: a.platform, counties: new Set(), earliest: a.auction_date, count: 0 };
      }
      groups[key].counties.add(cleanCounty(a.county));
      groups[key].count++;
      if (a.auction_date < groups[key].earliest) {
        groups[key].earliest = a.auction_date;
      }
    }

    console.log('[pulse] Part2 groups:', Object.keys(groups).length);

    for (const key of Object.keys(groups)) {
      const g = groups[key];
      const stateName = g.state || getStateName(g.state_code) || g.state_code;
      const countyList = Array.from(g.counties);
      const countyPreview = countyList.length <= 3
        ? countyList.join(', ')
        : countyList.slice(0, 3).join(', ') + ' + ' + (countyList.length - 3) + ' more';
      const title = stateName + ' — ' + g.count + ' upcoming ' + g.platform + ' auction' + (g.count !== 1 ? 's' : '');
      const alertText = title + '. ' + countyPreview + '. Next sale: ' + g.earliest;

      const payload = {
        alert_text: alertText,
        type: 'intel',
        state_code: g.state_code,
        date: g.earliest,
        auction_date: g.earliest,
        active: true,
      };

      console.log('[pulse] Part2 upsert payload:', JSON.stringify(payload));

      try {
        const { data: upsertData, error: upsertErr, status, statusText } = await supabase
          .from('pulse_alerts')
          .upsert(payload, { onConflict: 'state_code,auction_date,alert_text', ignoreDuplicates: true })
          .select();

        console.log('[pulse] Part2 upsert response — status:', status, statusText, 'data:', JSON.stringify(upsertData), 'error:', JSON.stringify(upsertErr));

        if (upsertErr) {
          console.error('[pulse] Part2 upsert FULL error:', JSON.stringify(upsertErr, null, 2));
          errors++;
        } else {
          inserted++;
          summaryCount++;
        }
      } catch (e) {
        console.error('[pulse] Part2 upsert THREW:', e.message, e.stack);
        errors++;
      }
    }
  }

  // ── Cleanup: deactivate alerts for past auction dates ──
  try {
    const { data: cleanData, error: cleanErr } = await supabase
      .from('pulse_alerts')
      .update({ active: false })
      .eq('active', true)
      .not('auction_date', 'is', null)
      .lt('auction_date', todayStr)
      .select('id');

    console.log('[pulse] Cleanup — deactivated:', cleanData ? cleanData.length : 0, 'error:', JSON.stringify(cleanErr));
    if (cleanErr) {
      console.error('[pulse] Cleanup FULL error:', JSON.stringify(cleanErr, null, 2));
    }
  } catch (e) {
    console.error('[pulse] Cleanup THREW:', e.message, e.stack);
  }

  console.log(`[pulse] Done. Inserted: ${inserted}, Skipped (dupes): ${skipped}, Errors: ${errors}`);

  // Log to scrape_log so it appears in the run history
  try {
    await logScrapeRun({
      platform: 'pulse_alerts',
      records_found: (upcoming ? upcoming.length : 0) + summaryCount,
      records_added: inserted,
      errors: errors > 0 ? `${errors} insert errors` : null,
      success: errors === 0,
    });
  } catch (e) {
    console.error('[pulse] logScrapeRun THREW:', e.message);
  }

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

  // ── Phase 2: Property scraping (after auctions) ──────────────
  // Fetch recently scraped auctions with platform URLs to feed property scrapers
  const propertyResults = {};
  let totalPropsFound = 0;
  let totalPropsAdded = 0;

  try {
    const supabase = getSupabase();
    const today = new Date().toISOString().split('T')[0];

    const { data: recentAuctions } = await supabase
      .from('auctions')
      .select('id, state_code, county, auction_date, platform, platform_url')
      .eq('active', true)
      .gte('auction_date', today)
      .order('auction_date', { ascending: true })
      .limit(50);

    if (recentAuctions && recentAuctions.length > 0) {
      console.log(`[scraper] Starting property scrape for ${recentAuctions.length} auctions...`);

      const propScrapers = [
        { name: 'realauction', fn: scrapeRealAuctionProperties, filter: 'realauction' },
        { name: 'govease', fn: scrapeGovEaseProperties, filter: 'govease' },
        { name: 'sri', fn: scrapeSRIProperties, filter: 'sri' },
        { name: 'bid4assets', fn: scrapeBid4AssetsProperties, filter: 'bid4assets' },
      ];

      for (const ps of propScrapers) {
        try {
          const platformAuctions = recentAuctions.filter(a => a.platform === ps.filter);
          if (platformAuctions.length === 0) continue;

          console.log(`[scraper] Running ${ps.name} property scraper for ${platformAuctions.length} auctions...`);
          const propResult = await ps.fn(platformAuctions);
          propertyResults[ps.name] = propResult;
          totalPropsFound += propResult.found || 0;
          totalPropsAdded += propResult.added || 0;
        } catch (e) {
          console.error(`[scraper] ${ps.name} property scraper crashed:`, e.message);
          propertyResults[ps.name] = { found: 0, added: 0, errors: 1 };
        }
      }
    }
  } catch (e) {
    console.error('[scraper] Property scrape phase failed:', e.message);
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

  console.log(`[scraper] Complete in ${elapsed}s. Auctions found: ${totalFound}, added: ${totalAdded}. Properties found: ${totalPropsFound}, added: ${totalPropsAdded}. Pulse: ${pulseGenerated}, Cleaned: ${cleaned}`);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: allSuccess,
      elapsed: `${elapsed}s`,
      summary: { totalFound, totalAdded, totalPropsFound, totalPropsAdded, pulseGenerated, cleaned },
      platforms: results,
      properties: propertyResults,
    })
  };
};
