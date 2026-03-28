// Aurigen — Property Lookup
// Netlify Function: /.netlify/functions/property-lookup
//
// Looks up a single property by parcel_id or address for the Deal Analyzer.
// Returns property details (opening_bid, assessed_value, equity_cushion_pct, etc.)
// Requires paid access (email in paid_users or admin whitelist).
//
// GET /property-lookup?parcel_id=...&email=...
// GET /property-lookup?address=...&state_code=...&email=...

const { createClient } = require('@supabase/supabase-js');

const ALLOWED_ORIGINS = [
  'https://aurigendirectory.com',
  'https://www.aurigendirectory.com',
  'https://aurigen-directory.netlify.app',
  'http://localhost:8888',
  'http://localhost:3000'
];

const ADMIN_EMAILS = ['landon@theaurigen.com', 'lando@theaurigen.com'];

function getCorsOrigin(event) {
  var origin = (event.headers || {}).origin || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

// Rate limiting — 20 req/min per IP
var _rateLimitMap = {};
var RATE_LIMIT_MAX = 20;
var RATE_LIMIT_WINDOW_MS = 60000;

function checkRateLimit(ip) {
  var now = Date.now();
  if (!_rateLimitMap[ip] || now - _rateLimitMap[ip].start > RATE_LIMIT_WINDOW_MS) {
    _rateLimitMap[ip] = { start: now, count: 1 };
    return true;
  }
  _rateLimitMap[ip].count++;
  return _rateLimitMap[ip].count <= RATE_LIMIT_MAX;
}

exports.handler = async (event) => {
  var corsOrigin = getCorsOrigin(event);
  var corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Rate limit
  var clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
  clientIp = clientIp.split(',')[0].trim();
  if (!checkRateLimit(clientIp)) {
    return { statusCode: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' }, body: JSON.stringify({ error: 'Rate limit exceeded. Try again in 60 seconds.' }) };
  }

  try {
    var params = event.queryStringParameters || {};
    var email = (params.email || '').toLowerCase().trim();

    // Auth check
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Authentication required' }) };
    }

    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    var isAdmin = ADMIN_EMAILS.indexOf(email) >= 0;
    if (!isAdmin) {
      var { data: paidUser } = await supabase.from('paid_users').select('id').eq('email', email).eq('active', true).maybeSingle();
      if (!paidUser) {
        return { statusCode: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Paid access required' }) };
      }
    }

    // Lookup by parcel_id (exact match)
    if (params.parcel_id) {
      var safeParcel = params.parcel_id.replace(/[%_]/g, '').trim().slice(0, 50);
      if (!safeParcel) {
        return { statusCode: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Invalid parcel ID' }) };
      }
      var { data, error } = await supabase
        .from('properties')
        .select('id, parcel_id, state_code, county, address, assessed_value, opening_bid, lien_amount, lien_year, property_type, status, delinquency_years, equity_cushion_pct')
        .eq('parcel_id', safeParcel)
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=60' },
        body: JSON.stringify({ property: data || null })
      };
    }

    // Lookup by address + state_code (fuzzy match)
    if (params.address && params.state_code) {
      var safeAddress = params.address.replace(/[%_]/g, '').trim().slice(0, 200);
      var stateCode = params.state_code.toUpperCase().slice(0, 2);
      if (!safeAddress || stateCode.length !== 2) {
        return { statusCode: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Invalid address or state code' }) };
      }
      var { data, error } = await supabase
        .from('properties')
        .select('id, parcel_id, state_code, county, address, assessed_value, opening_bid, lien_amount, lien_year, property_type, status, delinquency_years, equity_cushion_pct')
        .eq('state_code', stateCode)
        .ilike('address', '%' + safeAddress + '%')
        .limit(5);

      if (error) throw error;
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=60' },
        body: JSON.stringify({ properties: data || [] })
      };
    }

    return { statusCode: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Provide parcel_id or address+state_code' }) };

  } catch (e) {
    console.error('[property-lookup] Error:', e.message);
    return { statusCode: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
