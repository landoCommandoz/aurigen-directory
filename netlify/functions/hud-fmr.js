// ============================================================
// AURIGEN — hud-fmr.js
// HUD Fair Market Rents lookup by state + county.
// GET ?state=XX&county=NAME
// Returns { county, state, fmr_0br, fmr_1br, fmr_2br, fmr_3br, fmr_4br, year }
// On failure returns { error: true }
// ============================================================

var { getCorsHeaders, handlePreflight } = require('./utils/cors');

// In-memory cache (persists for function instance lifetime)
var _cache = {};

exports.handler = async function (event) {
  var headers = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return handlePreflight(event);
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ error: true }) };
  }

  var params = event.queryStringParameters || {};
  var stateCode = (params.state || '').trim().toUpperCase();
  var countyQuery = (params.county || '').trim().toLowerCase();

  if (!stateCode || stateCode.length !== 2 || !countyQuery) {
    return { statusCode: 400, headers: headers, body: JSON.stringify({ error: true }) };
  }

  try {
    var cacheKey = stateCode + ':' + countyQuery;
    if (_cache[cacheKey]) {
      return { statusCode: 200, headers: headers, body: JSON.stringify(_cache[cacheKey]) };
    }

    var token = process.env.HUD_API_TOKEN;
    if (!token) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ error: true }) };
    }

    // Check state-level cache to avoid repeat API calls
    var stateCacheKey = 'state:' + stateCode;
    var stateData = _cache[stateCacheKey] || null;

    if (!stateData) {
      var resp = await fetch('https://www.huduser.gov/hudapi/public/fmr/statedata/' + encodeURIComponent(stateCode), {
        headers: { 'Authorization': 'Bearer ' + token }
      });

      if (!resp.ok) {
        return { statusCode: 200, headers: headers, body: JSON.stringify({ error: true }) };
      }

      stateData = await resp.json();
      _cache[stateCacheKey] = stateData;
    }

    // HUD response has data.metroareas and/or data.counties
    var areas = [];
    if (stateData && stateData.data) {
      if (Array.isArray(stateData.data.metroareas)) areas = areas.concat(stateData.data.metroareas);
      if (Array.isArray(stateData.data.counties)) areas = areas.concat(stateData.data.counties);
    }

    // Find matching county (case-insensitive partial match)
    var match = null;
    for (var i = 0; i < areas.length; i++) {
      var areaName = (areas[i].area_name || areas[i].county_name || '').toLowerCase();
      if (areaName.indexOf(countyQuery) !== -1) {
        match = areas[i];
        break;
      }
    }

    if (!match) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ error: true }) };
    }

    var result = {
      county: match.area_name || match.county_name || countyQuery,
      state: stateCode,
      fmr_0br: match.Efficiency || match.fmr_0 || null,
      fmr_1br: match.One_Bedroom || match.fmr_1 || null,
      fmr_2br: match.Two_Bedroom || match.fmr_2 || null,
      fmr_3br: match.Three_Bedroom || match.fmr_3 || null,
      fmr_4br: match.Four_Bedroom || match.fmr_4 || null,
      year: (stateData.data && stateData.data.year) || null
    };

    _cache[cacheKey] = result;

    return { statusCode: 200, headers: headers, body: JSON.stringify(result) };
  } catch (e) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ error: true }) };
  }
};
