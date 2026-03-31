// === TICKER ===
function buildTicker() {
  const items = [
    { label: 'FL LIEN RATE', value: '18%', cls: 'up' },
    { label: 'IL PENALTY', value: '36%', cls: 'up' },
    { label: 'AZ INTEREST', value: '16%', cls: 'up' },
    { label: 'REDEMPTION PERIOD', value: 'FL 2YR · IL 2.5YR · AZ 3YR', cls: 'neutral' },
    { label: 'BID METHOD', value: 'FL INTEREST-DOWN · IL ROTATIONAL · AZ INTEREST-DOWN', cls: 'neutral' },
    { label: 'PLATFORM', value: 'FL LIENHUB · IL GOVEASE · AZ REALAUCTION', cls: 'neutral' },
    { label: 'AURIGEN', value: 'INTELLIGENCE PLATFORM', cls: 'neutral' },
  ];
  const track = document.getElementById('ticker-track');
  // Duplicate for seamless loop
  [1,2].forEach(() => {
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'ticker-item';
      div.innerHTML = `${item.label} <span class="${item.cls}">${item.value}</span>`;
      track.appendChild(div);
    });
  });
}

// === ALL 51 JURISDICTIONS (powered by STATES_V2) ===
// Normalize STATES_V2 → ALL_STATES adapter. Dedup by keeping last occurrence of each code.
var ALL_STATES = (function() {
  var seen = {};
  var deduped = [];
  var i, s;
  // Walk backwards so last occurrence wins, then reverse to preserve order
  for (i = STATES_V2.length - 1; i >= 0; i--) {
    s = STATES_V2[i];
    if (!seen[s.code]) {
      seen[s.code] = true;
      deduped.unshift(s);
    }
  }
  return deduped.map(function(s) {
    var mapType = s.type === 'forfeiture' ? 'hybrid' : s.type;
    return {
      abbr: s.code,
      name: s.name,
      type: mapType,
      rate: s.rate || 'N/A',
      redemption: s.redemption || 'N/A',
      rateNote: s.rateNote || null,
      bidMethod: s.bidMethod || null,
      statute: s.statute || null,
      officialLink: s.officialLink || null,
      auctionPlatform: s.auctionPlatform || null,
      auctionTiming: s.auctionTiming || null,
      keyNotes: s.keyNotes || [],
      investorAlert: s.investorAlert || null,
      _v2type: s.type  // preserve original for display labels
    };
  });
})();

// === TYPE RATIONALE — classification methodology per state type ===
var TYPE_RATIONALE = {
  lien: {
    short: "You purchase the tax debt — not the property. The owner repays you with interest during the redemption period.",
    why: "Some platforms classify this state as a deed state because the process ends in a deed sale if unredeemed. We label by the investor entry point: you buy a lien certificate first. Both labels are used in the industry."
  },
  deed: {
    short: "You purchase the property itself at auction. Ownership transfers to the winning bidder.",
    why: "Certain sources may list this state as hybrid or lien-eligible because some counties allow both mechanisms. We classify by the dominant statutory instrument available to investors statewide."
  },
  redeemable: {
    short: "You purchase a deed, but the original owner has a legal window to reclaim the property after the sale.",
    why: "Sometimes called a 'redeemable tax deed' or incorrectly grouped with deed states. The post-sale redemption right is the distinguishing factor — it changes your strategy and timeline significantly."
  },
  hybrid: {
    short: "Counties in this state may conduct either lien or deed sales depending on local rules. Confirm the method with each county before bidding.",
    why: "Hybrid states appear as lien states on some maps and deed states on others — both can be accurate depending on the county. We label it hybrid to prevent investors from assuming a single statewide mechanism."
  },
  forfeiture: {
    short: "This state uses a forfeiture process. Property is surrendered to the state after multi-year delinquency, then made available through a separate state disposition process.",
    why: "Minnesota's system does not fit cleanly into lien or deed. We classify it separately so investors are not misled into applying lien or deed strategies to a fundamentally different process."
  }
};

// === MERGE COUNTY DATA — window.COUNTY_DATA primary, STATES_EN fallback ===
(function() {
  var CD = (typeof window !== 'undefined' && window.COUNTY_DATA) ? window.COUNTY_DATA : {};
  var enMap = {};
  if (typeof STATES_EN !== 'undefined') {
    STATES_EN.forEach(function(s) { enMap[s.id] = s; });
  }
  ALL_STATES.forEach(function(s) {
    var abbr = s.abbr;
    // Primary: window.COUNTY_DATA['XX'] from verified county files
    if (CD[abbr] && CD[abbr].length > 0) {
      s.countyData = CD[abbr];           // full schema array
      s.countyRules = CD[abbr + '_STATE_RULES'] || null;
    }
    // Enrich from states-en.js — overview fields + county fallback
    var en = enMap[abbr];
    if (en) {
      if (!s.countyData) s.counties = en.counties || [];
      s.otc = en.otc || null;
      s.auctionSignup = en.auctionSignup || null;
      s.note = en.note || s.note || '';
      s.risks = en.risks || s.risks || [];
      s.beginnerTip = en.beginnerTip || s.beginnerTip || '';
      s.beginnerFriendly = en.beginnerFriendly !== undefined ? en.beginnerFriendly : s.beginnerFriendly;
      s.score = en.score !== undefined ? en.score : s.score;
      s.scoreWhy = en.scoreWhy || s.scoreWhy || '';
    }
  });
})();

// === STATE_DATA (powers Pulse + Compare tools — all 51 states) ===
var STATE_DATA = {};
ALL_STATES.forEach(function(s) {
  STATE_DATA[s.abbr] = {
    rate: s.rate,
    redemption: s.redemption,
    platform: s.auctionPlatform || 'N/A'
  };
});

const FREE_STATES = ['FL','IL','AZ'];

// === FIPS → ABBR LOOKUP ===
const FIPS_TO_ABBR = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE',
  '11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA',
  '20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN',
  '28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM',
  '36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI',
  '45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA',
  '54':'WV','55':'WI','56':'WY'
};

// === TYPE COLOR SYSTEM ===
// System 1 — TYPE_FILL: raw hex for D3 path fills and JS color lookups
var TYPE_FILL = {
  lien: '#FFBE0B',
  deed: '#00D4FF',
  redeemable: '#FF2D55',
  hybrid: '#BF5FFF',
  forfeiture: '#FF6B35'
};

// System 2 — TYPE_COLORS: CSS var references for styled elements
var TYPE_COLORS = { lien: 'var(--lien)', deed: 'var(--deed)', hybrid: 'var(--hybrid)', redeemable: 'var(--rdeed)', forfeiture: 'var(--forfeiture)' };

// Type display labels
var TYPE_LABELS = { lien: 'LIEN', deed: 'DEED', redeemable: 'RDBL DEED', hybrid: 'HYBR', forfeiture: 'FORFEIT' };
var TYPE_FULL = { lien: 'TAX LIEN', deed: 'TAX DEED', redeemable: 'REDEEMABLE DEED', hybrid: 'HYBRID', forfeiture: 'TAX FORFEITURE' };

// Current explore state
var selectedState = null;
var currentTab = 'map';
var activeFilter = 'all';
var searchQuery = '';

function buildLegend() {
  var TYPES = {
    lien:{label:"TAX LIEN",color:"#FFBE0B"},
    deed:{label:"TAX DEED",color:"#00D4FF"},
    redeemable:{label:"REDEEMABLE DEED",color:"#FF2D55"},
    hybrid:{label:"HYBRID",color:"#BF5FFF"},
    forfeiture:{label:"TAX FORFEITURE",color:"#FF6B35"}
  };
  var counts = {};
  Object.keys(TYPES).forEach(function(t){ counts[t] = ALL_STATES.filter(function(s){ return (s._v2type||s.type)===t; }).length; });
  var PILL_LABELS={lien:'Tax Lien',deed:'Tax Deed',redeemable:'Redeemable',hybrid:'Hybrid',forfeiture:'Forfeiture'};
  var _tl = document.getElementById('type-legend'); if (_tl) { _tl.innerHTML = Object.entries(TYPES).map(function(e){
    var k=e[0], v=e[1];
    return '<div class="leg-item" style="border:1px solid '+v.color+'40;background:'+v.color+'14"><div class="leg-dot" style="background:'+v.color+';box-shadow:0 0 6px '+v.color+'"></div><span class="leg-label">'+(PILL_LABELS[k]||k)+'</span><span class="leg-count" style="color:'+v.color+'">'+counts[k]+'</span></div>';
  }).join(''); }
  document.getElementById('map-legend').innerHTML = Object.entries(TYPES).map(function(e){
    var k=e[0], v=e[1];
    return '<div class="mleg-item"><div class="mleg-swatch" style="background:'+v.color+'"></div><span class="mleg-txt">'+v.label+'</span></div>';
  }).join('');
  document.getElementById('filter-pills').innerHTML = [
    ['all','ALL',null],['lien','LIEN','lien'],['deed','DEED','deed'],
    ['redeemable','RDBL','redeemable'],['hybrid','HYBR','hybrid'],['forfeiture','FORFEIT','forfeiture']
  ].map(function(a){ return '<button class="pill" id="pill-'+a[0]+'" onclick="setFilter(\''+a[0]+'\')">'+a[1]+'</button>'; }).join('');
  updatePills();
  initMapFilterPanel();
}

