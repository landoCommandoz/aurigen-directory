// ============================================================
// AURIGEN — get-county-portals.js
// Returns official county tax collector portal links for states
// that don't have scrapable auction platforms.
// GET /.netlify/functions/get-county-portals?state=TX
// ============================================================

var { getCorsHeaders, handlePreflight } = require('./utils/cors');

var COUNTY_PORTALS = {
  TX: [
    { county: 'Harris', url: 'https://www.hctax.net/Property/listings/taxsalelisting', notes: 'Monthly auctions, first Tuesday' },
    { county: 'Dallas', url: 'https://www.dallascounty.org/departments/dallascad/propertytaxsales.php', notes: 'Monthly courthouse auctions' },
    { county: 'Tarrant', url: 'https://www.tarrantcounty.com/en/tax/property-tax/tax-sales.html', notes: 'Monthly courthouse auctions' },
    { county: 'Bexar', url: 'https://www.bexar.org/2094/Tax-Sales', notes: 'Monthly courthouse auctions' },
    { county: 'Travis', url: 'https://tax-office.traviscountytx.gov/properties/tax-sales', notes: 'Monthly courthouse auctions' },
    { county: 'Collin', url: 'https://www.collincountytx.gov/tax_administration/Pages/tax_sales.aspx', notes: 'Monthly courthouse auctions' },
    { county: 'Denton', url: 'https://www.dentoncounty.gov/1049/Tax-Sales', notes: 'Monthly courthouse auctions' },
    { county: 'Fort Bend', url: 'https://www.fortbendcountytx.gov/government/departments/tax-assessor-collector/tax-sales', notes: 'Monthly courthouse auctions' },
  ],
  NC: [
    { county: 'Mecklenburg', url: 'https://www.mecknc.gov/TaxCollections/Pages/TaxForeclosureSales.aspx', notes: 'Upset bid process' },
    { county: 'Wake', url: 'https://www.wake.gov/departments-agencies/tax-administration/real-estate-tax-foreclosure-sales', notes: 'Upset bid process' },
    { county: 'Guilford', url: 'https://www.guilfordcountync.gov/our-county/tax-department/real-estate-foreclosures', notes: 'Upset bid process' },
  ],
  WA: [
    { county: 'King', url: 'https://kingcounty.gov/depts/records-licensing/real-property/foreclosure.aspx', notes: 'Annual auction, typically February' },
    { county: 'Pierce', url: 'https://www.piercecountywa.gov/1904/Tax-Title-Property', notes: 'Annual auction' },
    { county: 'Snohomish', url: 'https://snohomishcountywa.gov/1218/Property-Tax-Foreclosure', notes: 'Annual auction' },
  ],
  OR: [
    { county: 'Multnomah', url: 'https://www.multco.us/assessment-taxation/tax-foreclosure', notes: 'Annual auction' },
    { county: 'Washington', url: 'https://www.co.washington.or.us/AssessmentTaxation/TaxForeclosure/', notes: 'Annual auction' },
    { county: 'Clackamas', url: 'https://www.clackamas.us/assessor/taxforeclosure', notes: 'Annual auction' },
  ],
  NY: [
    { county: 'Suffolk', url: 'https://www.suffolkcountyny.gov/Departments/County-Comptroller/Tax-Lien-Sale', notes: 'Annual lien sale' },
    { county: 'Nassau', url: 'https://www.nassaucountyny.gov/1265/Property-Tax', notes: 'Annual lien sale' },
    { county: 'Erie', url: 'https://www2.erie.gov/comptroller/index.php?q=tax-lien-sale', notes: 'Annual lien sale' },
  ],
};

exports.handler = async function(event) {
  var headers = getCorsHeaders(event);
  if (event.httpMethod === 'OPTIONS') return handlePreflight(event);

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var params = event.queryStringParameters || {};
  var stateFilter = (params.state || '').toUpperCase().trim();

  if (stateFilter) {
    var portals = COUNTY_PORTALS[stateFilter] || [];
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ state: stateFilter, portals: portals })
    };
  }

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({ portals: COUNTY_PORTALS })
  };
};
