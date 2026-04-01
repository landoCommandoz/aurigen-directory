// ============================================================
// AURIGEN — fema-flood.js
// FEMA National Flood Hazard Layer lookup by lat/lng. No API key.
// GET ?lat=X&lng=X
// Returns { zone, label, risk_level } or { risk_level: 'unknown' }
// ============================================================

var { getCorsHeaders, handlePreflight } = require('./utils/cors');

var _cache = {};

function classifyZone(zone) {
  if (!zone) return { label: 'Unknown', risk_level: 'unknown' };
  var z = zone.toUpperCase().trim();

  // High risk — Special Flood Hazard Areas
  if (/^(A|AE|AH|AO|AR|A1|A2|A3|A4|A5|A6|A7|A8|A9|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A30|A99|V|VE|V1|V2|V3|V4|V5|V6|V7|V8|V9|V10|V11|V12|V13|V14|V15|V16|V17|V18|V19|V20|V21|V22|V23|V24|V25|V26|V27|V28|V29|V30)$/.test(z)) {
    return { label: 'HIGH RISK \u2014 Special Flood Hazard Area', risk_level: 'high' };
  }
  // Moderate risk
  if (z === 'B' || z === 'X (SHADED)' || z === 'X SHADED' || (z === 'X' && false)) {
    return { label: 'MODERATE RISK', risk_level: 'moderate' };
  }
  // Low risk
  if (z === 'C' || z === 'X' || z === 'X (UNSHADED)' || z === 'X UNSHADED') {
    return { label: 'LOW RISK', risk_level: 'low' };
  }
  // Undetermined
  if (z === 'D') {
    return { label: 'UNDETERMINED', risk_level: 'unknown' };
  }
  return { label: 'Unknown', risk_level: 'unknown' };
}

exports.handler = async function (event) {
  var headers = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return handlePreflight(event);
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ risk_level: 'unknown' }) };
  }

  var params = event.queryStringParameters || {};
  var lat = parseFloat(params.lat);
  var lng = parseFloat(params.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ risk_level: 'unknown' }) };
  }

  try {
    var cacheKey = lat.toFixed(4) + ',' + lng.toFixed(4);
    if (_cache[cacheKey]) {
      return { statusCode: 200, headers: headers, body: JSON.stringify(_cache[cacheKey]) };
    }

    var url = 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query' +
      '?geometry=' + lng + ',' + lat +
      '&geometryType=esriGeometryPoint' +
      '&inSR=4326' +
      '&spatialRel=esriSpatialRelIntersects' +
      '&outFields=FLD_ZONE,ZONE_SUBTY' +
      '&returnGeometry=false' +
      '&f=json';

    var resp = await fetch(url);
    if (!resp.ok) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ risk_level: 'unknown' }) };
    }

    var data = await resp.json();
    var features = data && data.features;
    if (!features || features.length === 0) {
      return { statusCode: 200, headers: headers, body: JSON.stringify({ risk_level: 'unknown' }) };
    }

    var attrs = features[0].attributes || {};
    var fldZone = attrs.FLD_ZONE || '';
    var subtype = attrs.ZONE_SUBTY || '';

    // Disambiguate X shaded vs unshaded via subtype
    var zoneForClassify = fldZone;
    if (fldZone.toUpperCase() === 'X' && subtype) {
      var subLower = subtype.toLowerCase();
      if (subLower.indexOf('shaded') !== -1 || subLower.indexOf('moderate') !== -1 || subLower.indexOf('0.2') !== -1) {
        zoneForClassify = 'B'; // treat as moderate
      }
    }

    var classification = classifyZone(zoneForClassify);
    var result = {
      zone: fldZone,
      label: classification.label,
      risk_level: classification.risk_level
    };

    _cache[cacheKey] = result;

    return { statusCode: 200, headers: headers, body: JSON.stringify(result) };
  } catch (e) {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ risk_level: 'unknown' }) };
  }
};
