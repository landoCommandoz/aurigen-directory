// Aurigen — Data Freshness (public endpoint)
// Returns last scrape timestamps for transparency
var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');

// Rate limiting
var _freshRateMap = {};
function checkFreshRate(ip) {
  var now = Date.now();
  if (!_freshRateMap[ip] || now - _freshRateMap[ip].start > 60000) {
    _freshRateMap[ip] = { start: now, count: 1 };
    return true;
  }
  _freshRateMap[ip].count++;
  return _freshRateMap[ip].count <= 30;
}

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);
  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
  if (!checkFreshRate(clientIp.split(',')[0].trim())) {
    return { statusCode: 429, headers: { ...headers, 'Retry-After': '60' }, body: JSON.stringify({ error: 'Too many requests' }) };
  }

  try {
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Last auction scrape
    var { data: auctionScrape } = await supabase
      .from('scrape_log')
      .select('run_at')
      .ilike('platform', 'realauction%')
      .order('run_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Last property update
    var { data: propScrape } = await supabase
      .from('scrape_log')
      .select('run_at')
      .eq('platform', 'properties_batch')
      .order('run_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Last weekly report
    var { data: lastReport } = await supabase
      .from('weekly_reports')
      .select('generated_at')
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        last_auction_scrape: auctionScrape ? auctionScrape.run_at : null,
        last_property_update: propScrape ? propScrape.run_at : null,
        last_report: lastReport ? lastReport.generated_at : null,
        next_scheduled: 'Every Sunday at 6am UTC'
      })
    };

  } catch (err) {
    console.error('[data-freshness] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
