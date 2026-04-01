// ============================================================
// AURIGEN — geocode.js
// Census Geocoder proxy. No API key required.
// GET ?address=X&city=X&state=X&zip=X (zip optional)
// Returns { lat, lng, match: true } or { match: false }
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
  var address = (params.address || '').trim();
  var city = (params.city || '').trim();
  var state = (params.state || '').trim();
  var zip = (params.zip || '').trim();

  if (!address || !state) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ match: false }) };
  }

  try {
    var cacheKey = [address, city, state, zip].join('|').toLowerCase();
    if (_cache[cacheKey]) {
      return { statusCode: 200, headers: headers, body: JSON.stringify(_cache[cacheKey]) };
    }

    var url = 'https://geocoding.geo.census.gov/geocoder/locations/address?street=' +
      encodeURIComponent(address) +
      '&city=' + encodeURIComponent(city) +
      '&state=' + encodeURIComponent(state) +
      (zip ? '&zip=' + encodeURIComponent(zip) : '') +
      '&benchmark=2020&format=json';

    var resp = await fetch(url);
    if (!resp.ok) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ match: false }) };
    }

    var data = await resp.json();
    var matches = data && data.result && data.result.addressMatches;
    if (!matches || matches.length === 0) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ match: false }) };
    }

    var coords = matches[0].coordinates;
    var result = {
      lat: coords.y,
      lng: coords.x,
      match: true
    };

    _cache[cacheKey] = result;

    return { statusCode: 200, headers: headers, body: JSON.stringify(result) };
  } catch (e) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ match: false }) };
  }
};
