// Aurigen — GoHighLevel CRM Sync
// Called from capture-email.js (free users) and verify-session.js (paid users).
// Auth: JWT Bearer token OR internal function-to-function key.
//
// When GHL_API_KEY is set and non-empty: POST to GHL contacts endpoint.
// Free users → free pipeline. Paid users → paid pipeline.
//
// Expected GHL API:
//   POST https://services.leadconnectorhq.com/contacts/upsert
//   Headers: Authorization: Bearer {GHL_API_KEY}, Version: 2021-07-28
//   Body: { locationId: GHL_PIPELINE_ID, email, tags: [...], source: 'Aurigen Directory' }
//
// Env vars (Netlify):
//   GHL_API_KEY    — GoHighLevel API token (empty = logging only)
//   GHL_PIPELINE_ID — GoHighLevel location ID

var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { verifyBearer } = require('./utils/jwt');

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);
  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Auth: JWT or internal key
  var auth = verifyBearer(event);
  var internalKey = (event.headers || {})['x-internal-key'] || '';
  var isInternal = internalKey && process.env.SUPABASE_SERVICE_ROLE_KEY && internalKey === process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!auth && !isInternal) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Valid JWT required' }) };
  }

  try {
    var body;
    try { body = JSON.parse(event.body || '{}'); } catch(e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    var email = (body.email || '').toLowerCase().trim();
    var tier = body.tier || 'free';
    var language = body.language || 'en';
    var utmSource = (body.utm_source || '').slice(0, 100);
    var utmMedium = (body.utm_medium || '').slice(0, 100);
    var utmCampaign = (body.utm_campaign || '').slice(0, 100);

    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    var ghlApiKey = process.env.GHL_API_KEY || '';
    var ghlLocationId = process.env.GHL_PIPELINE_ID || '';
    var synced = false;
    var errorMsg = '';

    if (ghlApiKey && ghlLocationId) {
      // Live GHL API call
      try {
        var tags = ['Aurigen Directory Lead'];
        if (tier === 'paid') tags.push('Paid User');
        else tags.push('Free User');

        var ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + ghlApiKey,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          },
          body: JSON.stringify({
            locationId: ghlLocationId,
            email: email,
            tags: tags,
            source: 'Aurigen Directory',
            customFields: [
              { field_key: 'preferred_language', value: language },
              { field_key: 'utm_source', value: utmSource || 'direct' },
              { field_key: 'utm_medium', value: utmMedium || '' },
              { field_key: 'utm_campaign', value: utmCampaign || '' },
              { field_key: 'tier', value: tier }
            ]
          })
        });
        if (ghlRes.ok) {
          synced = true;
          console.log('[ghl-sync] Upserted contact:', ghlRes.status);
        } else {
          errorMsg = 'GHL API error: ' + ghlRes.status;
          console.error('[ghl-sync] Error:', ghlRes.status);
        }
      } catch (ghlErr) {
        errorMsg = 'GHL API network error';
        console.error('[ghl-sync] Network error:', ghlErr.message);
      }
    } else {
      errorMsg = 'GHL API not yet configured';
    }

    // Log sync attempt to scrape_log
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    await supabase.from('scrape_log').insert({
      platform: 'ghl_sync',
      state_code: tier,
      records_found: 1,
      records_added: synced ? 1 : 0,
      errors: errorMsg,
      scraped_at: new Date().toISOString()
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ synced: synced, message: errorMsg })
    };

  } catch (err) {
    console.error('[ghl-sync] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
