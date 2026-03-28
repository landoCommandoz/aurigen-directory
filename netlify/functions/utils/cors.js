// Shared CORS configuration for all Netlify functions
var ALLOWED_ORIGINS = [
  'https://aurigendirectory.com',
  'https://www.aurigendirectory.com',
  'https://aurigen-directory.netlify.app',
  'https://statuesque-bublanina-330b9d.netlify.app',
  'https://hilarious-llama-2933ac.netlify.app',
  'http://localhost:8888',
  'http://localhost:3000'
];

function getCorsHeaders(event) {
  var origin = (event.headers || {}).origin || '';
  var allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
}

function handlePreflight(event) {
  return { statusCode: 204, headers: getCorsHeaders(event), body: '' };
}

module.exports = { ALLOWED_ORIGINS, getCorsHeaders, handlePreflight };
