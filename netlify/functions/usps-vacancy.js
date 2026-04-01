// ============================================================
// AURIGEN — usps-vacancy.js
// HUD USPS Vacancy Data by lat/lng. Requires HUD_API_TOKEN.
// GET ?lat=X&lng=X
// Returns { vacancy_rate, vacant_units, total_units, quarter }
// On failure returns { vacancy_rate: null }
// ============================================================

var { getCorsHeaders, handlePreflight } = require('./utils/cors');

var _cache = {};

exports.handler = async function (event) {
  var headers = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return handlePreflight(event);
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ vacancy_rate: null }) };
  }

  var params = event.queryStringParameters || {};
  var lat = parseFloat(params.lat);
  var lng = parseFloat(params.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ vacancy_rate: null }) };
  }

  try {
    var cacheKey = lat.toFixed(4) + ',' + lng.toFixed(4);
    if (_cache[cacheKey]) {
      return { statusCode: 200, headers: headers, body: JSON.stringify(_cache[cacheKey]) };
    }

    var token = process.env.HUD_API_TOKEN;
    if (!token) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ vacancy_rate: null }) };
    }

    var url = 'https://www.huduser.gov/hudapi/public/usps?type=4&query=' +
      encodeURIComponent(lat + ',' + lng);

    var resp = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!resp.ok) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ vacancy_rate: null }) };
    }

    var data = await resp.json();

    // HUD USPS API returns data.results array
    var results = data && data.data && data.data.results;
    if (!results) {
      // Try alternate response shape
      results = Array.isArray(data) ? data : (data && data.results);
    }
    if (!results || (Array.isArray(results) && results.length === 0)) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ vacancy_rate: null }) };
    }

    // Get the most recent quarter
    var latest = Array.isArray(results) ? results[results.length - 1] : results;

    var totalAddr = parseFloat(latest.total_addr || latest.TOTAL_ADDR || 0);
    var vacantAddr = parseFloat(latest.vac_addr || latest.VAC_ADDR || latest.ams_res || latest.AMS_RES || 0);
    var noStatAddr = parseFloat(latest.no_stat_addr || latest.NO_STAT_ADDR || 0);
    var vacantTotal = vacantAddr + noStatAddr;
    var vacRate = totalAddr > 0 ? Math.round((vacantTotal / totalAddr) * 1000) / 10 : null;

    var quarter = latest.quarter || latest.QUARTER || null;
    var year = latest.year || latest.YEAR || null;
    var qLabel = quarter && year ? 'Q' + quarter + ' ' + year : null;

    var result = {
      vacancy_rate: vacRate,
      vacant_units: Math.round(vacantTotal),
      total_units: Math.round(totalAddr),
      quarter: qLabel
    };

    _cache[cacheKey] = result;

    return { statusCode: 200, headers: headers, body: JSON.stringify(result) };
  } catch (e) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ vacancy_rate: null }) };
  }
};
