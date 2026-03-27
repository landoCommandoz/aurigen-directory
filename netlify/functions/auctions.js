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

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

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
      body: JSON.stringify({ error: e.message })
    };
  }
};
