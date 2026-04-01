// ============================================================
// AURIGEN — geocode.js
// Nominatim (OpenStreetMap) geocoder proxy. No API key required.
// GET ?q=Broward+County,+FL  (freeform query)
// Returns { lat, lng, match: true } or { match: false }
// Handles county-level, city-level, and address-level queries.
// ============================================================

var { getCorsHeaders, handlePreflight } = require('./utils/cors');

var _cache = {};

exports.handler = async function (event) {
  var headers = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return handlePreflight(event);
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ match: false }) };
  }

  var params = event.queryStringParameters || {};
  var query = (params.q || '').trim();

  if (!query) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ match: false }) };
  }

  try {
    var cacheKey = query.toLowerCase();
    if (_cache[cacheKey]) {
      return { statusCode: 200, headers: headers, body: JSON.stringify(_cache[cacheKey]) };
    }

    var url = 'https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(query) +
      '&format=json&limit=1&countrycodes=us';

    var resp = await fetch(url, {
      headers: { 'User-Agent': 'AurigenDirectory/1.0' }
    });

    if (!resp.ok) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ match: false }) };
    }

    var data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ match: false }) };
    }

    var result = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      match: true
    };

    _cache[cacheKey] = result;

    return { statusCode: 200, headers: headers, body: JSON.stringify(result) };
  } catch (e) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ match: false }) };
  }
};
