const { createClient } = require('@supabase/supabase-js');

const ADMIN_EMAILS = ['landon@theaurigen.com'];

const ALLOWED_ORIGINS = [
  'https://statuesque-bublanina-330b9d.netlify.app',
  'https://hilarious-llama-2933ac.netlify.app',
  'https://aurigen-directory.netlify.app',
  'https://aurigendirectory.com',
  'https://www.aurigendirectory.com',
  'http://localhost:8888',
  'http://localhost:3000'
];

function getCorsOrigin(event) {
  const origin = (event.headers || {}).origin || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

exports.handler = async function(event) {
  const origin = getCorsOrigin(event);
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Count paid users
    const { count: paidCount, error: paidErr } = await supabase
      .from('paid_users')
      .select('*', { count: 'exact', head: true });
    if (paidErr) throw paidErr;

    // Count free users (email_captures minus paid_users)
    const { count: totalEmails, error: emailErr } = await supabase
      .from('email_captures')
      .select('*', { count: 'exact', head: true });
    if (emailErr) throw emailErr;

    const freeCount = Math.max(0, (totalEmails || 0) - (paidCount || 0));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        free_count: freeCount,
        paid_count: paidCount || 0
      })
    };
  } catch (err) {
    console.error('admin-stats error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
