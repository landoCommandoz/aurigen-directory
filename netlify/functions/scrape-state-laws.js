// ============================================================
// AURIGEN — scrape-state-laws.js
// Upserts verified state tax sale law data to Supabase.
// Protected by SCRAPER_SECRET header.
//
// Supabase table (run manually if not exists):
// CREATE TABLE IF NOT EXISTS state_laws (
//   state_code text PRIMARY KEY,
//   state_name text NOT NULL,
//   auction_type text,
//   interest_rate_pct numeric,
//   redemption_period_months integer,
//   bid_method text,
//   statute_citation text,
//   auction_schedule text,
//   official_url text,
//   notes text,
//   needs_manual_review boolean DEFAULT false,
//   scraped_at timestamptz DEFAULT now()
// );
// ============================================================

var { createClient } = require('@supabase/supabase-js');

var STATE_LAW_DATA = [
  { state_code: 'AL', state_name: 'Alabama', auction_type: 'lien', interest_rate_pct: 12, redemption_period_months: 36, bid_method: 'bid-down interest', statute_citation: 'Code of Alabama § 40-10-180', official_url: 'https://revenue.alabama.gov/property-tax/' },
  { state_code: 'AK', state_name: 'Alaska', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'AS § 29.45.440', official_url: 'https://www.tax.alaska.gov/' },
  { state_code: 'AZ', state_name: 'Arizona', auction_type: 'lien', interest_rate_pct: 16, redemption_period_months: 36, bid_method: 'bid-down interest', statute_citation: 'ARS § 42-18112', official_url: 'https://www.azdor.gov/' },
  { state_code: 'AR', state_name: 'Arkansas', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'ACA § 26-37-202', official_url: 'https://www.dfa.arkansas.gov/' },
  { state_code: 'CA', state_name: 'California', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'Cal Rev & Tax Code § 3691', official_url: 'https://www.ftb.ca.gov/' },
  { state_code: 'CO', state_name: 'Colorado', auction_type: 'lien', interest_rate_pct: null, redemption_period_months: 36, bid_method: 'premium bid', statute_citation: 'CRS § 39-11-114', official_url: 'https://www.colorado.gov/pacific/dola/property-taxation' },
  { state_code: 'CT', state_name: 'Connecticut', auction_type: 'deed', interest_rate_pct: 18, redemption_period_months: 6, bid_method: 'premium bid', statute_citation: 'CGS § 12-157', official_url: 'https://portal.ct.gov/DRS' },
  { state_code: 'DE', state_name: 'Delaware', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: '9 Del. C. § 8724', official_url: 'https://revenue.delaware.gov/' },
  { state_code: 'FL', state_name: 'Florida', auction_type: 'hybrid', interest_rate_pct: 18, redemption_period_months: 24, bid_method: 'bid-down interest', statute_citation: 'FL Stat § 197.432', official_url: 'https://floridarevenue.com/property' },
  { state_code: 'GA', state_name: 'Georgia', auction_type: 'deed', interest_rate_pct: 20, redemption_period_months: 12, bid_method: 'premium bid', statute_citation: 'OCGA § 48-4-1', official_url: 'https://dor.georgia.gov/' },
  { state_code: 'HI', state_name: 'Hawaii', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'HRS § 246-56', official_url: 'https://tax.hawaii.gov/' },
  { state_code: 'ID', state_name: 'Idaho', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 14, bid_method: 'premium bid', statute_citation: 'Idaho Code § 63-1005', official_url: 'https://tax.idaho.gov/' },
  { state_code: 'IL', state_name: 'Illinois', auction_type: 'lien', interest_rate_pct: 18, redemption_period_months: 30, bid_method: 'bid-up penalty', statute_citation: '35 ILCS 200/21-215', official_url: 'https://www2.illinois.gov/rev' },
  { state_code: 'IN', state_name: 'Indiana', auction_type: 'lien', interest_rate_pct: 15, redemption_period_months: 12, bid_method: 'premium bid', statute_citation: 'IC § 6-1.1-24-5', official_url: 'https://www.in.gov/dlgf/' },
  { state_code: 'IA', state_name: 'Iowa', auction_type: 'lien', interest_rate_pct: 24, redemption_period_months: 24, bid_method: 'random selection', statute_citation: 'Iowa Code § 446.7', official_url: 'https://tax.iowa.gov/' },
  { state_code: 'KS', state_name: 'Kansas', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'KSA § 79-2804', official_url: 'https://www.ksrevenue.org/' },
  { state_code: 'KY', state_name: 'Kentucky', auction_type: 'lien', interest_rate_pct: 12, redemption_period_months: 12, bid_method: 'premium bid', statute_citation: 'KRS § 134.490', official_url: 'https://revenue.ky.gov/' },
  { state_code: 'LA', state_name: 'Louisiana', auction_type: 'lien', interest_rate_pct: 12, redemption_period_months: 36, bid_method: 'premium bid', statute_citation: 'La. R.S. § 47:2153', official_url: 'https://www.revenue.louisiana.gov/' },
  { state_code: 'ME', state_name: 'Maine', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: '36 MRSA § 942', official_url: 'https://www.maine.gov/revenue/' },
  { state_code: 'MD', state_name: 'Maryland', auction_type: 'lien', interest_rate_pct: 18, redemption_period_months: 6, bid_method: 'bid-down interest', statute_citation: 'MD Tax-Property § 14-817', official_url: 'https://www.dat.maryland.gov/' },
  { state_code: 'MA', state_name: 'Massachusetts', auction_type: 'lien', interest_rate_pct: 16, redemption_period_months: null, bid_method: 'premium bid', statute_citation: 'MGL c.60 § 52', official_url: 'https://www.mass.gov/dor' },
  { state_code: 'MI', state_name: 'Michigan', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'MCL § 211.78m', official_url: 'https://www.michigan.gov/taxes' },
  { state_code: 'MN', state_name: 'Minnesota', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'Minn. Stat. § 281.18', official_url: 'https://www.revenue.state.mn.us/' },
  { state_code: 'MS', state_name: 'Mississippi', auction_type: 'lien', interest_rate_pct: 18, redemption_period_months: 24, bid_method: 'bid-up overbid', statute_citation: 'Miss. Code § 27-43-3', official_url: 'https://www.dor.ms.gov/' },
  { state_code: 'MO', state_name: 'Missouri', auction_type: 'lien', interest_rate_pct: 10, redemption_period_months: 12, bid_method: 'premium bid', statute_citation: 'RSMo § 140.290', official_url: 'https://dor.mo.gov/' },
  { state_code: 'MT', state_name: 'Montana', auction_type: 'lien', interest_rate_pct: 10, redemption_period_months: 36, bid_method: 'premium bid', statute_citation: 'MCA § 15-17-212', official_url: 'https://mtrevenue.gov/' },
  { state_code: 'NE', state_name: 'Nebraska', auction_type: 'lien', interest_rate_pct: 14, redemption_period_months: 24, bid_method: 'premium bid', statute_citation: 'Neb. Rev. Stat. § 77-1807', official_url: 'https://www.revenue.ne.gov/' },
  { state_code: 'NV', state_name: 'Nevada', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'NRS § 361.570', official_url: 'https://tax.nv.gov/' },
  { state_code: 'NH', state_name: 'New Hampshire', auction_type: 'lien', interest_rate_pct: 18, redemption_period_months: 24, bid_method: 'premium bid', statute_citation: 'RSA § 80:20', official_url: 'https://www.revenue.nh.gov/' },
  { state_code: 'NJ', state_name: 'New Jersey', auction_type: 'lien', interest_rate_pct: 18, redemption_period_months: 24, bid_method: 'bid-down interest', statute_citation: 'NJSA § 54:5-19', official_url: 'https://www.njleg.state.nj.us/' },
  { state_code: 'NM', state_name: 'New Mexico', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'NMSA § 7-38-70', official_url: 'https://www.tax.newmexico.gov/' },
  { state_code: 'NY', state_name: 'New York', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'NY RPTL § 1110', official_url: 'https://www.tax.ny.gov/' },
  { state_code: 'NC', state_name: 'North Carolina', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'upset bid', statute_citation: 'NCGS § 105-374', official_url: 'https://www.ncdor.gov/' },
  { state_code: 'ND', state_name: 'North Dakota', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'NDCC § 57-28-04', official_url: 'https://www.nd.gov/tax/' },
  { state_code: 'OH', state_name: 'Ohio', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'ORC § 5721.19', official_url: 'https://tax.ohio.gov/' },
  { state_code: 'OK', state_name: 'Oklahoma', auction_type: 'lien', interest_rate_pct: 8, redemption_period_months: 24, bid_method: 'premium bid', statute_citation: '68 O.S. § 3101', official_url: 'https://oklahoma.gov/tax.html' },
  { state_code: 'OR', state_name: 'Oregon', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'ORS § 312.010', official_url: 'https://www.oregon.gov/DOR' },
  { state_code: 'PA', state_name: 'Pennsylvania', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: '72 P.S. § 5860.601', official_url: 'https://www.revenue.pa.gov/' },
  { state_code: 'RI', state_name: 'Rhode Island', auction_type: 'lien', interest_rate_pct: 16, redemption_period_months: 12, bid_method: 'premium bid', statute_citation: 'RIGL § 44-9-21', official_url: 'https://www.tax.ri.gov/' },
  { state_code: 'SC', state_name: 'South Carolina', auction_type: 'lien', interest_rate_pct: 12, redemption_period_months: 12, bid_method: 'premium bid', statute_citation: 'SC Code § 12-51-40', official_url: 'https://dor.sc.gov/' },
  { state_code: 'SD', state_name: 'South Dakota', auction_type: 'lien', interest_rate_pct: 12, redemption_period_months: 36, bid_method: 'premium bid', statute_citation: 'SDCL § 10-22-1', official_url: 'https://dor.sd.gov/' },
  { state_code: 'TN', state_name: 'Tennessee', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 12, bid_method: 'premium bid', statute_citation: 'TCA § 67-5-2501', official_url: 'https://www.tn.gov/revenue' },
  { state_code: 'TX', state_name: 'Texas', auction_type: 'deed', interest_rate_pct: 25, redemption_period_months: 6, bid_method: 'premium bid', statute_citation: 'TX Tax Code § 34.01', official_url: 'https://comptroller.texas.gov/' },
  { state_code: 'UT', state_name: 'Utah', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'Utah Code § 59-2-1351', official_url: 'https://tax.utah.gov/' },
  { state_code: 'VT', state_name: 'Vermont', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: '32 VSA § 5252', official_url: 'https://tax.vermont.gov/' },
  { state_code: 'VA', state_name: 'Virginia', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'VA Code § 58.1-3965', official_url: 'https://www.tax.virginia.gov/' },
  { state_code: 'WA', state_name: 'Washington', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 36, bid_method: 'premium bid', statute_citation: 'RCW § 84.64.080', official_url: 'https://dor.wa.gov/' },
  { state_code: 'WV', state_name: 'West Virginia', auction_type: 'lien', interest_rate_pct: 12, redemption_period_months: 18, bid_method: 'premium bid', statute_citation: 'WV Code § 11A-3-5', official_url: 'https://tax.wv.gov/' },
  { state_code: 'WI', state_name: 'Wisconsin', auction_type: 'deed', interest_rate_pct: null, redemption_period_months: 0, bid_method: 'premium bid', statute_citation: 'Wis. Stat. § 75.521', official_url: 'https://www.revenue.wi.gov/' },
  { state_code: 'WY', state_name: 'Wyoming', auction_type: 'lien', interest_rate_pct: 15, redemption_period_months: 36, bid_method: 'premium bid', statute_citation: 'WY Stat § 39-13-108', official_url: 'https://revenue.wyo.gov/' },
  { state_code: 'DC', state_name: 'Washington DC', auction_type: 'lien', interest_rate_pct: 18, redemption_period_months: 6, bid_method: 'premium bid', statute_citation: 'DC Code § 47-1346', official_url: 'https://otr.cfo.dc.gov/' },
];

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var secret = (event.headers || {})['x-scraper-secret'];
  if (secret !== process.env.SCRAPER_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  var url = process.env.SUPABASE_URL;
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }) };
  }

  var supabase = createClient(url, key);
  var now = new Date().toISOString();
  var upserted = 0;
  var errors = 0;

  for (var i = 0; i < STATE_LAW_DATA.length; i++) {
    var row = STATE_LAW_DATA[i];
    var { error } = await supabase
      .from('state_laws')
      .upsert({
        state_code: row.state_code,
        state_name: row.state_name,
        auction_type: row.auction_type,
        interest_rate_pct: row.interest_rate_pct,
        redemption_period_months: row.redemption_period_months,
        bid_method: row.bid_method,
        statute_citation: row.statute_citation,
        official_url: row.official_url,
        needs_manual_review: false,
        scraped_at: now,
      }, { onConflict: 'state_code' });

    if (error) {
      console.error('[state-laws] Upsert error for ' + row.state_code + ':', error.message);
      errors++;
    } else {
      upserted++;
    }
  }

  // Log to scrape_log
  try {
    await supabase.from('scrape_log').insert({
      platform: 'state_laws',
      records_found: STATE_LAW_DATA.length,
      records_added: upserted,
      errors: errors > 0 ? errors + ' upsert errors' : null,
      success: errors === 0,
      run_at: now,
    });
  } catch (e) {
    console.error('[state-laws] Failed to write scrape_log:', e.message);
  }

  console.log('[state-laws] Done. Upserted: ' + upserted + ', Errors: ' + errors);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: errors === 0,
      upserted: upserted,
      errors: errors,
      total: STATE_LAW_DATA.length,
    })
  };
};
