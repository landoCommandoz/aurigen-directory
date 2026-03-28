const { createClient } = require('@supabase/supabase-js');

// Simple in-memory rate limiter for expensive endpoints (warbook)
// Resets on cold start — lightweight protection, not a full solution
const _rateLimitMap = {};
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60000;
function checkRateLimit(ip) {
  const now = Date.now();
  if (!_rateLimitMap[ip] || now - _rateLimitMap[ip].start > RATE_LIMIT_WINDOW_MS) {
    _rateLimitMap[ip] = { start: now, count: 1 };
    return true;
  }
  _rateLimitMap[ip].count++;
  return _rateLimitMap[ip].count <= RATE_LIMIT_MAX;
}

const ALLOWED_ORIGINS = [
  'https://aurigendirectory.com',
  'https://www.aurigendirectory.com',
  'https://aurigen-directory.netlify.app',
  'http://localhost:8888',
  'http://localhost:3000'
];

function getCorsOrigin(event) {
  const origin = (event.headers || {}).origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}

exports.handler = async (event) => {
  const corsOrigin = getCorsOrigin(event);
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // Route: GET /properties?state_code=TX&county=...&status=...&property_type=...&absentee_owner=true&offset=0
  const path = event.path || '';
  const isPropertiesRoute = path.endsWith('/properties');

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (isPropertiesRoute) {
      // Properties are paid-tier data — require verified email
      const params = event.queryStringParameters || {};
      var email = (params.email || '').toLowerCase().trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Authentication required' })
        };
      }

      // Admin whitelist bypasses paid_users check
      var ADMIN_EMAILS = ['landon@theaurigen.com', 'lando@theaurigen.com'];
      var isAdmin = ADMIN_EMAILS.indexOf(email) >= 0;

      if (!isAdmin) {
        // Verify paid access
        var { data: paidUser } = await supabase
          .from('paid_users')
          .select('id')
          .eq('email', email)
          .eq('active', true)
          .maybeSingle();

        if (!paidUser) {
          return {
            statusCode: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Paid access required' })
          };
        }
      }

      // Select all fields EXCEPT owner_mailing_address (privacy)
      var query = supabase
        .from('properties')
        .select('id, parcel_id, auction_id, state_code, county, address, assessed_value, opening_bid, lien_amount, lien_year, property_type, owner_name, status, delinquency_years, absentee_owner, equity_cushion_pct, scraped_at, updated_at');

      // Apply filters — strip wildcard chars from county to prevent ilike abuse
      if (params.state_code) {
        query = query.eq('state_code', params.state_code.toUpperCase().slice(0, 2));
      }
      if (params.county) {
        var safeCounty = params.county.replace(/[%_]/g, '');
        if (safeCounty) query = query.ilike('county', safeCounty);
      }
      if (params.status) {
        query = query.eq('status', params.status);
      }
      if (params.property_type) {
        query = query.eq('property_type', params.property_type);
      }
      if (params.absentee_owner === 'true') {
        query = query.eq('absentee_owner', true);
      }

      // Pagination — max 50 per page
      var offset = parseInt(params.offset, 10);
      if (isNaN(offset) || offset < 0) offset = 0;

      // Sort by equity_cushion_pct DESC (best opportunities first), nulls last
      query = query
        .range(offset, offset + 49)
        .order('equity_cushion_pct', { ascending: false, nullsFirst: false })
        .order('updated_at', { ascending: false });

      // Get count for X-Total-Count header
      var countQuery = supabase
        .from('properties')
        .select('id', { count: 'exact', head: true });
      if (params.state_code) countQuery = countQuery.eq('state_code', params.state_code.toUpperCase().slice(0, 2));
      if (params.county) {
        var safeCounty2 = params.county.replace(/[%_]/g, '');
        if (safeCounty2) countQuery = countQuery.ilike('county', safeCounty2);
      }
      if (params.status) countQuery = countQuery.eq('status', params.status);
      if (params.property_type) countQuery = countQuery.eq('property_type', params.property_type);
      if (params.absentee_owner === 'true') countQuery = countQuery.eq('absentee_owner', true);

      var [dataResult, countResult] = await Promise.all([query, countQuery]);
      if (dataResult.error) throw dataResult.error;
      var totalCount = countResult.count || 0;

      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Cache-Control': 'private, max-age=300',
          'Content-Type': 'application/json',
          'X-Total-Count': String(totalCount)
        },
        body: JSON.stringify({
          properties: dataResult.data || [],
          offset: offset,
          limit: 50,
          total: totalCount
        })
      };
    }

    // Default route: auctions + pulse_alerts
    const today = new Date().toISOString().split('T')[0];
    const params = event.queryStringParameters || {};

    // Build pulse query with optional state filter
    let alertsQuery = supabase
      .from('pulse_alerts')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (params.state_codes) {
      const codes = params.state_codes.split(',').map(c => c.trim().toUpperCase().slice(0, 2)).filter(c => c.length === 2);
      if (codes.length > 0) {
        alertsQuery = alertsQuery.in('state_code', codes);
      }
    }

    // Warbook aggregation endpoint
    if (params.type === 'warbook') {
      // Rate limit: 10 req/min per IP
      const clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
      if (!checkRateLimit(clientIp)) {
        return { statusCode: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' }, body: JSON.stringify({ error: 'Rate limit exceeded. Try again in 60 seconds.' }) };
      }
      // Paid-only gate
      const wbEmail = (params.email || '').toLowerCase().trim();
      if (!wbEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wbEmail)) {
        return { statusCode: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Authentication required' }) };
      }
      const WB_ADMINS = ['landon@theaurigen.com', 'lando@theaurigen.com'];
      if (!WB_ADMINS.includes(wbEmail)) {
        const { data: wbPaid } = await supabase.from('paid_users').select('id').eq('email', wbEmail).eq('active', true).maybeSingle();
        if (!wbPaid) {
          return { statusCode: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Paid access required' }) };
        }
      }

      // Aggregate per-state stats
      const [auctionStats, propStats, scoreStats] = await Promise.all([
        supabase.from('auctions').select('state_code').eq('active', true),
        supabase.from('properties').select('state_code, opening_bid, equity_cushion_pct'),
        supabase.from('county_scores').select('state_code, county, score')
      ]);

      const stateMap = {};
      (auctionStats.data || []).forEach(a => {
        if (!a.state_code) return;
        if (!stateMap[a.state_code]) stateMap[a.state_code] = { auction_count: 0, bids: [], equities: [], top_county: null, top_score: 0 };
        stateMap[a.state_code].auction_count++;
      });
      (propStats.data || []).forEach(p => {
        if (!p.state_code || !stateMap[p.state_code]) return;
        if (p.opening_bid != null) stateMap[p.state_code].bids.push(p.opening_bid);
        if (p.equity_cushion_pct != null) stateMap[p.state_code].equities.push(p.equity_cushion_pct);
      });
      (scoreStats.data || []).forEach(s => {
        if (!s.state_code || !stateMap[s.state_code]) return;
        if (s.score > stateMap[s.state_code].top_score) {
          stateMap[s.state_code].top_score = s.score;
          stateMap[s.state_code].top_county = s.county;
        }
      });

      const states = Object.entries(stateMap).map(([code, d]) => ({
        state_code: code,
        auction_count: d.auction_count,
        avg_opening_bid: d.bids.length > 0 ? Math.round(d.bids.reduce((a, b) => a + b, 0) / d.bids.length) : null,
        avg_equity_cushion: d.equities.length > 0 ? Math.round(d.equities.reduce((a, b) => a + b, 0) / d.equities.length * 10) / 10 : null,
        top_county: d.top_county,
        top_score: d.top_score
      })).sort((a, b) => b.auction_count - a.auction_count);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Cache-Control': 'private, max-age=300', 'Content-Type': 'application/json' },
        body: JSON.stringify({ states })
      };
    }

    // Fetch auctions and pulse_alerts in parallel
    const [auctionsResult, alertsResult] = await Promise.all([
      supabase
        .from('auctions')
        .select('*')
        .eq('active', true)
        .gte('auction_date', today)
        .order('auction_date', { ascending: true })
        .limit(200),
      alertsQuery
    ]);

    if (auctionsResult.error) throw auctionsResult.error;
    if (alertsResult.error) throw alertsResult.error;

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=300',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        auctions: auctionsResult.data,
        alerts: alertsResult.data
      })
    };

  } catch (e) {
    console.error('[auctions] Error:', e.message);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
