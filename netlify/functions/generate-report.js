// Aurigen — Weekly Intelligence Report Generator (background function)
// Triggered by GitHub Actions weekly (after track-redemptions step).
// Queries last 7 days of data and stores report content to weekly_reports table.
// Does NOT send email — content generation pipeline only.
//
// When ready to activate Beehiiv send:
//   POST https://api.beehiiv.com/v2/publications/{BEEHIIV_PUBLICATION_ID}/posts
//   Headers: Authorization: Bearer {BEEHIIV_API_KEY}
//   Body: { title, subtitle, content (HTML), status: 'draft' }

var { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  // Auth: scraper secret only (GitHub Actions trigger)
  var scraperSecret = (event.headers || {})['x-scraper-secret'] || '';
  if (!scraperSecret || scraperSecret !== process.env.SCRAPER_SECRET) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  try {
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    var now = new Date();
    var weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    var weekAgoStr = weekAgo.toISOString();
    var weekOf = now.toISOString().split('T')[0];

    // 1. New auctions added this week (count by state)
    var { data: newAuctions } = await supabase
      .from('auctions')
      .select('state_code')
      .gte('created_at', weekAgoStr)
      .eq('active', true);

    var auctionsByState = {};
    (newAuctions || []).forEach(function(a) {
      auctionsByState[a.state_code] = (auctionsByState[a.state_code] || 0) + 1;
    });

    // Sort by count descending, top 10
    var topStates = Object.entries(auctionsByState)
      .sort(function(a, b) { return b[1] - a[1]; })
      .slice(0, 10)
      .map(function(e) { return { state: e[0], count: e[1] }; });

    // 2. Top 5 counties by opportunity score
    var { data: topCounties } = await supabase
      .from('county_scores')
      .select('state_code, county, score')
      .order('score', { ascending: false })
      .limit(5);

    // 3. Top 5 upcoming deadlines (next 14 days)
    var twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    var today = now.toISOString().split('T')[0];
    var { data: upcomingDeadlines } = await supabase
      .from('auctions')
      .select('state_code, county, auction_date, platform')
      .eq('active', true)
      .gte('auction_date', today)
      .lte('auction_date', twoWeeks)
      .order('auction_date', { ascending: true })
      .limit(5);

    // 4. New pulse alerts
    var { count: alertCount } = await supabase
      .from('pulse_alerts')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', weekAgoStr)
      .eq('active', true);

    // Build report content
    var report = {
      week_of: weekOf,
      generated_at: now.toISOString(),
      new_auctions_total: (newAuctions || []).length,
      top_states: topStates,
      top_counties: (topCounties || []).map(function(c) {
        return { state: c.state_code, county: c.county, score: c.score };
      }),
      upcoming_deadlines: (upcomingDeadlines || []).map(function(d) {
        return { state: d.state_code, county: d.county, date: d.auction_date, platform: d.platform };
      }),
      alert_count: alertCount || 0
    };

    // Store to weekly_reports
    var { error: reportErr } = await supabase
      .from('weekly_reports')
      .upsert({ week_of: weekOf, content: report, generated_at: now.toISOString() }, { onConflict: 'week_of' });

    if (reportErr) {
      console.error('[generate-report] Store error:', reportErr.message);
    }

    // Log to scrape_log
    await supabase.from('scrape_log').insert({
      platform: 'weekly_report',
      state_code: 'ALL',
      records_found: (newAuctions || []).length,
      records_added: 1,
      errors: reportErr ? reportErr.message : '',
      scraped_at: now.toISOString()
    });

    console.log('[generate-report] Report generated for week of ' + weekOf);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, week_of: weekOf, auctions: (newAuctions || []).length, alerts: alertCount || 0 })
    };

  } catch (err) {
    console.error('[generate-report] Error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Report generation failed' }) };
  }
};
