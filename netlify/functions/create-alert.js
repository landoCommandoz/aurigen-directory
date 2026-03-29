// Aurigen — Create Pulse Alert (paid users only)
var { createClient } = require('@supabase/supabase-js');
var { getCorsHeaders, handlePreflight } = require('./utils/cors');
var { requirePaid } = require('./utils/jwt');

// Rate limiting
var _alertRateMap = {};
function checkAlertRate(ip) {
  var now = Date.now();
  if (!_alertRateMap[ip] || now - _alertRateMap[ip].start > 60000) {
    _alertRateMap[ip] = { start: now, count: 1 };
    return true;
  }
  _alertRateMap[ip].count++;
  return _alertRateMap[ip].count <= 10;
}

// Basic text sanitization — strip HTML tags
function sanitizeText(str) {
  return (str || '').replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, function(c) {
    var map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
    return map[c] || c;
  }).trim().substring(0, 200);
}

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);
  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);

  var clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';

  // === POST: Create alert ===
  if (event.httpMethod === 'POST') {
    if (!checkAlertRate(clientIp.split(',')[0].trim())) {
      return { statusCode: 429, headers: { ...headers, 'Retry-After': '60' }, body: JSON.stringify({ error: 'Too many requests' }) };
    }

    var auth = requirePaid(event);
    if (!auth) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Paid access required' }) };
    }

    try {
      var body = JSON.parse(event.body || '{}');
      var stateCode = (body.state_code || '').trim().toUpperCase().substring(0, 2);
      var alertType = (body.alert_type || '').trim().toLowerCase();
      var alertText = sanitizeText(body.alert_text || '');
      var alertDate = body.alert_date || null;

      if (!stateCode) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'state_code required' }) };
      }
      if (!alertText) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'alert_text required' }) };
      }

      var validTypes = ['auction', 'deadline', 'rate_change', 'general'];
      if (validTypes.indexOf(alertType) < 0) alertType = 'general';

      var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      var record = {
        state_code: stateCode,
        type: alertType,
        message: alertText,
        active: true,
        created_by: auth.email
      };
      if (alertDate) record.date = alertDate;

      var { data, error } = await supabase
        .from('pulse_alerts')
        .insert(record)
        .select()
        .single();

      if (error) {
        console.error('[create-alert] Insert error:', error.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to create alert' }) };
      }

      return { statusCode: 201, headers, body: JSON.stringify({ created: true, alert: data }) };

    } catch (err) {
      console.error('[create-alert] Error:', err.message);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
    }
  }

  // === DELETE: Remove own alert ===
  if (event.httpMethod === 'DELETE') {
    var auth = requirePaid(event);
    if (!auth) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Paid access required' }) };
    }

    try {
      var body = JSON.parse(event.body || '{}');
      var alertId = body.alert_id;
      if (!alertId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'alert_id required' }) };
      }

      var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

      // Only allow deleting own alerts
      var { error } = await supabase
        .from('pulse_alerts')
        .delete()
        .eq('id', alertId)
        .eq('created_by', auth.email);

      if (error) {
        console.error('[create-alert] Delete error:', error.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to delete' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ deleted: true }) };

    } catch (err) {
      console.error('[create-alert] Error:', err.message);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
