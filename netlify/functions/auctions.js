const { createClient } = require('@supabase/supabase-js');

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
      query = query.range(offset, offset + 49).order('updated_at', { ascending: false });

      var { data, error } = await query;
      if (error) throw error;

      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Cache-Control': 'private, max-age=300',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: data || [],
          offset: offset,
          limit: 50
        })
      };
    }

    // Default route: auctions + pulse_alerts
    const today = new Date().toISOString().split('T')[0];

    // Fetch auctions and pulse_alerts in parallel
    const [auctionsResult, alertsResult] = await Promise.all([
      supabase
        .from('auctions')
        .select('*')
        .eq('active', true)
        .gte('auction_date', today)
        .order('auction_date', { ascending: true })
        .limit(200),
      supabase
        .from('pulse_alerts')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(50)
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
