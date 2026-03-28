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

    // === BEEHIIV DRAFT CREATION ===
    // Set BEEHIIV_SEND_ENABLED=true in Netlify env vars to activate draft creation.
    // Drafts appear in Beehiiv dashboard for Lando to review before publishing.
    var beehiivEnabled = (process.env.BEEHIIV_SEND_ENABLED || '').toLowerCase() === 'true';
    var beehiivApiKey = process.env.BEEHIIV_API_KEY || '';
    var beehiivPubId = process.env.BEEHIIV_PUBLICATION_ID || '';
    var beehiivDraft = false;

    if (beehiivEnabled && beehiivApiKey && beehiivPubId) {
      try {
        // Build HTML content from report data
        var htmlContent = '<h2>Aurigen Weekly Intelligence Brief — Week of ' + weekOf + '</h2>';
        htmlContent += '<p><strong>' + report.new_auctions_total + ' new auctions</strong> added this week across ' + topStates.length + ' states.</p>';
        if (topStates.length > 0) {
          htmlContent += '<h3>Top States by New Auctions</h3><ul>';
          topStates.forEach(function(s) { htmlContent += '<li>' + s.state + ': ' + s.count + ' auctions</li>'; });
          htmlContent += '</ul>';
        }
        if ((topCounties || []).length > 0) {
          htmlContent += '<h3>Top Counties by Opportunity Score</h3><ul>';
          (topCounties || []).forEach(function(c) { htmlContent += '<li>' + c.state_code + ' — ' + c.county + ' (Score: ' + c.score + ')</li>'; });
          htmlContent += '</ul>';
        }
        if ((upcomingDeadlines || []).length > 0) {
          htmlContent += '<h3>Upcoming Deadlines (Next 14 Days)</h3><ul>';
          (upcomingDeadlines || []).forEach(function(d) { htmlContent += '<li>' + d.state_code + ' — ' + d.county + ' on ' + d.auction_date + ' (' + d.platform + ')</li>'; });
          htmlContent += '</ul>';
        }
        htmlContent += '<p>' + (report.alert_count || 0) + ' new Pulse alerts this week.</p>';
        htmlContent += '<p><a href="https://aurigendirectory.com/">Open Aurigen Intelligence Platform →</a></p>';

        var beehiivRes = await fetch(
          'https://api.beehiiv.com/v2/publications/' + beehiivPubId + '/posts',
          {
            method: 'POST',
            headers: {
              'Authorization': 'ApiKey ' + beehiivApiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: 'Aurigen Weekly Intelligence Brief — ' + weekOf,
              subtitle: report.new_auctions_total + ' new auctions, ' + (report.alert_count || 0) + ' alerts',
              content: htmlContent,
              status: 'draft'
            })
          }
        );
        if (beehiivRes.ok) {
          beehiivDraft = true;
          console.log('[generate-report] Beehiiv draft created');
        } else {
          console.error('[generate-report] Beehiiv error:', beehiivRes.status);
        }
      } catch (beehiivErr) {
        console.error('[generate-report] Beehiiv error:', beehiivErr.message);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, week_of: weekOf, auctions: (newAuctions || []).length, alerts: alertCount || 0, beehiiv_draft: beehiivDraft })
    };

  } catch (err) {
    console.error('[generate-report] Error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Report generation failed' }) };
  }
};
