var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { requirePaid } = require('./utils/jwt');

// Rate limiting — per-route, per-IP, per-minute
var _rateLimitMap = {};
function checkRateLimit(ip, max) {
  max = max || 10;
  var now = Date.now();
  if (!_rateLimitMap[ip] || now - _rateLimitMap[ip].start > 60000) {
    _rateLimitMap[ip] = { start: now, count: 1 };
    return true;
  }
  _rateLimitMap[ip].count++;
  return _rateLimitMap[ip].count <= max;
}

exports.handler = async (event) => {
  var corsHeaders = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);

  var path = event.path || '';
  var isPropertiesRoute = path.endsWith('/properties');

  try {
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // === PROPERTIES ROUTE (paid-only, JWT auth, rate-limited) ===
    if (isPropertiesRoute) {
      var propIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
      if (!checkRateLimit('prop:' + propIp.split(',')[0].trim(), 30)) {
        return { statusCode: 429, headers: { ...corsHeaders, 'Retry-After': '60' }, body: JSON.stringify({ error: 'Rate limit exceeded.' }) };
      }
      var auth = requirePaid(event);
      if (!auth) {
        return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Valid paid-tier JWT required' }) };
      }

      var params = event.queryStringParameters || {};
      var query = supabase
        .from('properties')
        .select('*');

      if (params.state_code) query = query.eq('state_code', params.state_code.toUpperCase().slice(0, 2));
      if (params.county) {
        var safeCounty = params.county.replace(/[%_]/g, '');
        if (safeCounty) query = query.ilike('county', safeCounty);
      }
      if (params.status) query = query.eq('status', params.status);
      if (params.property_type) query = query.eq('property_type', params.property_type);

      var offset = parseInt(params.offset, 10);
      if (isNaN(offset) || offset < 0) offset = 0;

      query = query
        .range(offset, offset + 49)
        .order('updated_at', { ascending: false });

      var countQuery = supabase.from('properties').select('id', { count: 'exact', head: true });
      if (params.state_code) countQuery = countQuery.eq('state_code', params.state_code.toUpperCase().slice(0, 2));
      if (params.county) { var sc2 = params.county.replace(/[%_]/g, ''); if (sc2) countQuery = countQuery.ilike('county', sc2); }
      if (params.status) countQuery = countQuery.eq('status', params.status);
      if (params.property_type) countQuery = countQuery.eq('property_type', params.property_type);

      var [dataResult, countResult] = await Promise.all([query, countQuery]);
      if (dataResult.error) throw dataResult.error;
      var totalCount = countResult.count || 0;

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Cache-Control': 'private, max-age=300', 'X-Total-Count': String(totalCount) },
        body: JSON.stringify({ properties: dataResult.data || [], offset: offset, limit: 50, total: totalCount })
      };
    }

    // === WARBOOK ROUTE (paid-only, JWT auth + rate limit) ===
    var params = event.queryStringParameters || {};
    if (params.type === 'warbook') {
      var clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
      if (!checkRateLimit('wb:' + clientIp.split(',')[0].trim(), 10)) {
        return { statusCode: 429, headers: { ...corsHeaders, 'Retry-After': '60' }, body: JSON.stringify({ error: 'Rate limit exceeded.' }) };
      }

      var auth = requirePaid(event);
      if (!auth) {
        return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Valid paid-tier JWT required' }) };
      }

      var [auctionStats, propStats, scoreStats] = await Promise.all([
        supabase.from('auctions').select('state_code').eq('active', true),
        supabase.from('properties').select('*'),
        supabase.from('county_scores').select('state_code, county, score')
      ]);

      var stateMap = {};
      (auctionStats.data || []).forEach(function(a) {
        if (!a.state_code) return;
        if (!stateMap[a.state_code]) stateMap[a.state_code] = { auction_count: 0, bids: [], equities: [], overbids: [], top_county: null, top_score: 0 };
        stateMap[a.state_code].auction_count++;
      });
      (propStats.data || []).forEach(function(p) {
        if (!p.state_code || !stateMap[p.state_code]) return;
        if (p.opening_bid != null) stateMap[p.state_code].bids.push(p.opening_bid);
        if (p.equity_cushion_pct != null) stateMap[p.state_code].equities.push(p.equity_cushion_pct);
        if (p.overbid_pct != null) stateMap[p.state_code].overbids.push(p.overbid_pct);
      });
      (scoreStats.data || []).forEach(function(s) {
        if (!s.state_code || !stateMap[s.state_code]) return;
        if (s.score > stateMap[s.state_code].top_score) {
          stateMap[s.state_code].top_score = s.score;
          stateMap[s.state_code].top_county = s.county;
        }
      });

      var states = Object.entries(stateMap).map(function(e) {
        var code = e[0], d = e[1];
        return {
          state_code: code,
          auction_count: d.auction_count,
          avg_opening_bid: d.bids.length > 0 ? Math.round(d.bids.reduce(function(a,b){return a+b;},0) / d.bids.length) : null,
          avg_equity_cushion: d.equities.length > 0 ? Math.round(d.equities.reduce(function(a,b){return a+b;},0) / d.equities.length * 10) / 10 : null,
          avg_overbid_pct: d.overbids.length > 0 ? Math.round(d.overbids.reduce(function(a,b){return a+b;},0) / d.overbids.length * 10) / 10 : null,
          top_county: d.top_county,
          top_score: d.top_score
        };
      }).sort(function(a,b) { return b.auction_count - a.auction_count; });

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Cache-Control': 'private, max-age=300' },
        body: JSON.stringify({ states: states })
      };
    }

    // === DEFAULT ROUTE: auctions + pulse_alerts (public, rate-limited) ===
    var publicIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
    if (!checkRateLimit('pub:' + publicIp.split(',')[0].trim(), 30)) {
      return { statusCode: 429, headers: { ...corsHeaders, 'Retry-After': '60' }, body: JSON.stringify({ error: 'Rate limit exceeded.' }) };
    }
    var today = new Date().toISOString().split('T')[0];

    var alertsQuery = supabase
      .from('pulse_alerts')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (params.state_codes) {
      var codes = params.state_codes.split(',').map(function(c) { return c.trim().toUpperCase().slice(0, 2); }).filter(function(c) { return c.length === 2; });
      if (codes.length > 0) alertsQuery = alertsQuery.in('state_code', codes);
    }

    var [auctionsResult, alertsResult] = await Promise.all([
      supabase.from('auctions').select('*').eq('active', true).gte('auction_date', today).order('auction_date', { ascending: true }).limit(200),
      alertsQuery
    ]);

    if (auctionsResult.error) throw auctionsResult.error;
    if (alertsResult.error) throw alertsResult.error;

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=300' },
      body: JSON.stringify({ auctions: auctionsResult.data, alerts: alertsResult.data })
    };

  } catch (e) {
    console.error('[auctions] Error:', e.message);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
