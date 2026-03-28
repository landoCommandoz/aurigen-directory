// Aurigen — Property Lookup
// GET /property-lookup?parcel_id=...  or  GET /property-lookup?address=...&state_code=...
// Auth: JWT Bearer token (paid tier required)
var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { requirePaid } = require('./utils/jwt');

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
  var headers = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
  clientIp = clientIp.split(',')[0].trim();
  if (!checkRateLimit(clientIp)) {
    return { statusCode: 429, headers: { ...headers, 'Retry-After': '60' }, body: JSON.stringify({ error: 'Rate limit exceeded.' }) };
  }

  // JWT auth — paid tier required
  var auth = requirePaid(event);
  if (!auth) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Valid paid-tier JWT required' }) };
  }

  try {
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    var params = event.queryStringParameters || {};

    // Lookup by parcel_id
    if (params.parcel_id) {
      var safeParcel = params.parcel_id.replace(/[%_]/g, '').trim().slice(0, 50);
      if (!safeParcel) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid parcel ID' }) };
      }
      var { data, error } = await supabase
        .from('properties')
        .select('id, parcel_id, state_code, county, address, assessed_value, opening_bid, lien_amount, lien_year, property_type, status, delinquency_years, equity_cushion_pct')
        .eq('parcel_id', safeParcel)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return { statusCode: 200, headers: { ...headers, 'Cache-Control': 'private, max-age=60' }, body: JSON.stringify({ property: data || null }) };
    }

    // Lookup by address + state_code
    if (params.address && params.state_code) {
      var safeAddress = params.address.replace(/[%_]/g, '').trim().slice(0, 200);
      var stateCode = params.state_code.toUpperCase().slice(0, 2);
      if (!safeAddress || stateCode.length !== 2) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid address or state code' }) };
      }
      var { data, error } = await supabase
        .from('properties')
        .select('id, parcel_id, state_code, county, address, assessed_value, opening_bid, lien_amount, lien_year, property_type, status, delinquency_years, equity_cushion_pct')
        .eq('state_code', stateCode)
        .ilike('address', '%' + safeAddress + '%')
        .limit(5);
      if (error) throw error;
      return { statusCode: 200, headers: { ...headers, 'Cache-Control': 'private, max-age=60' }, body: JSON.stringify({ properties: data || [] }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Provide parcel_id or address+state_code' }) };

  } catch (e) {
    console.error('[property-lookup] Error:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
