const { cleanupOldAuctions, getSupabase, getStateName, logScrapeRun } = require('./utils');
const { scrapeRealAuction } = require('./realauction');
const { scrapeGovEase } = require('./govease');
const { scrapeSRI } = require('./sri');
const { scrapeBid4Assets } = require('./bid4assets');

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

  // ── Part 1: Per-auction alerts for auctions within 90 days ──
  const { data: upcoming, error: fetchErr } = await supabase
    .from('auctions')
    .select('state, state_code, county, auction_date, platform')
    .eq('active', true)
    .gte('auction_date', todayStr)
    .lte('auction_date', cutoffStr)
    .order('auction_date', { ascending: true });

  if (fetchErr) {
    console.error('[pulse] Failed to fetch upcoming auctions:', fetchErr.message);
  } else if (upcoming && upcoming.length > 0) {
    console.log(`[pulse] Found ${upcoming.length} auctions within 90 days`);

    for (const a of upcoming) {
      const daysOut = Math.ceil((new Date(a.auction_date) - today) / 86400000);
      const stateName = a.state || getStateName(a.state_code) || a.state_code;
      const alertText = stateName + ' — ' + a.county + ' auction in ' + daysOut + ' day' + (daysOut !== 1 ? 's' : '');

      const { error, status } = await supabase
        .from('pulse_alerts')
        .upsert(
          {
            alert_text: alertText,
            type: 'upcoming',
            state_code: a.state_code,
            date: a.auction_date,
            auction_date: a.auction_date,
            active: true,
          },
          {
            onConflict: 'state_code,auction_date',
            ignoreDuplicates: true,
          }
        );

      if (error) {
        console.warn('[pulse] Per-auction insert error:', error.message, '| state:', a.state_code, 'date:', a.auction_date);
        errors++;
      } else if (status === 200) {
        // 200 = existing row, no change
        skipped++;
      } else {
        inserted++;
      }
    }
  } else {
    console.log('[pulse] No auctions within 90 days');
  }

  // ── Part 2: State+platform summary alerts (all future auctions) ──
  let summaryCount = 0;
  const { data: allFuture, error: allErr } = await supabase
    .from('auctions')
    .select('state, state_code, county, auction_date, platform')
    .eq('active', true)
    .gte('auction_date', todayStr)
    .order('auction_date', { ascending: true });

  if (allErr) {
    console.error('[pulse] Failed to fetch all future auctions:', allErr.message);
  } else if (allFuture && allFuture.length > 0) {
    // Group by state_code + platform
    const groups = {};
    for (const a of allFuture) {
      const key = a.state_code + '|' + a.platform;
      if (!groups[key]) {
        groups[key] = { state: a.state, state_code: a.state_code, platform: a.platform, counties: new Set(), earliest: a.auction_date, count: 0 };
      }
      groups[key].counties.add(a.county);
      groups[key].count++;
      if (a.auction_date < groups[key].earliest) {
        groups[key].earliest = a.auction_date;
      }
    }

    for (const key of Object.keys(groups)) {
      const g = groups[key];
      const stateName = g.state || getStateName(g.state_code) || g.state_code;
      const countyList = Array.from(g.counties);
      const countyPreview = countyList.length <= 3
        ? countyList.join(', ')
        : countyList.slice(0, 3).join(', ') + ' + ' + (countyList.length - 3) + ' more';
      const title = stateName + ' — ' + g.count + ' upcoming ' + g.platform + ' auction' + (g.count !== 1 ? 's' : '');

      const alertText = title + '. ' + countyPreview + '. Next sale: ' + g.earliest;

      const { error } = await supabase
        .from('pulse_alerts')
        .upsert(
          {
            alert_text: alertText,
            type: 'intel',
            state_code: g.state_code,
            date: g.earliest,
            auction_date: g.earliest,
            active: true,
          },
          {
            onConflict: 'state_code,auction_date',
            ignoreDuplicates: false,
          }
        );

      if (error) {
        console.warn('[pulse] Summary insert error:', error.message, '| state:', g.state_code, 'platform:', g.platform);
        errors++;
      } else {
        inserted++;
        summaryCount++;
      }
    }
  }

  // ── Cleanup: deactivate alerts for past auction dates ──
  const { error: cleanErr } = await supabase
    .from('pulse_alerts')
    .update({ active: false })
    .eq('active', true)
    .not('auction_date', 'is', null)
    .lt('auction_date', todayStr);

  if (cleanErr) {
    console.warn('[pulse] Cleanup error:', cleanErr.message);
  }

  console.log(`[pulse] Done. Inserted: ${inserted}, Skipped (dupes): ${skipped}, Errors: ${errors}`);

  // Log to scrape_log so it appears in the run history
  await logScrapeRun({
    platform: 'pulse_alerts',
    records_found: (upcoming ? upcoming.length : 0) + summaryCount,
    records_added: inserted,
    errors: errors > 0 ? `${errors} insert errors` : null,
    success: errors === 0,
  });

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
