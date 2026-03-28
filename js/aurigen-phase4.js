// === SCOUT — DUE DILIGENCE TOOL ===
var SCOUT_STEPS = [
  {
    name: 'Lien/Deed Verification',
    what: 'Confirm certificate or deed is valid, current, and correctly assigned to the right parcel.',
    why: 'Clerical errors in county records are more common than most investors expect. A misrecorded parcel number or incorrect assignment can render a certificate worthless \u2014 meaning you paid real money for something you cannot enforce or foreclose on.',
    how: ['Pull original certificate number from county tax collector','Match parcel ID on certificate to county assessor parcel map','Confirm no prior redemption has been recorded','Verify assignment chain if certificate was purchased OTC or from a third party','Consult a licensed title company or real estate attorney before transacting'],
    whereText: 'County Tax Collector',
    whereUrl: '',
    redFlags: ['Parcel ID mismatch','Prior redemption on record','Broken assignment chain','Certificate issued on exempt property (church, government, homestead in some states)'],
    proTip: 'Always cross-reference the parcel ID against the county GIS map \u2014 not just the text record. Mapping errors catch what text searches miss.',
    source: 'NTLA Best Practices \u00b7 ntla.org'
  },
  {
    name: 'Property Type + Zoning',
    what: 'Identify what the property is and whether it has legal use restrictions.',
    why: 'A tax lien on a landlocked vacant lot with no road access or a property zoned agricultural only in a flood zone can be near impossible to sell \u2014 making redemption unlikely and the asset worthless if you end up with the deed.',
    how: ['Pull property classification from county assessor','Check zoning designation at city or county planning dept','Look for flood zone designation via FEMA Flood Map Service Center','Confirm legal access \u2014 road frontage or recorded easement','Verify property condition and value with a licensed appraiser or inspector'],
    whereText: 'FEMA Flood Map',
    whereUrl: 'https://msc.fema.gov',
    redFlags: ['Landlocked parcel','Flood Zone AE or VE designation','Agricultural-only zoning','Mobile home on land not owned','Condemned status'],
    proTip: 'Check the FEMA flood map before anything else on vacant land. A parcel in a high-risk flood zone has near-zero resale value regardless of assessed value.',
    source: 'FEMA msc.fema.gov'
  },
  {
    name: 'IRS Federal Tax Lien',
    what: 'Search for any IRS federal tax liens recorded against the property owner.',
    why: 'Under IRC Section 6323, the IRS has a 120-day right of redemption after a tax deed sale. In some states federal liens survive the tax sale entirely \u2014 leaving you with a property subject to federal debt you didn\u2019t create.',
    how: ['Search county recorder for federal tax lien filings under owner name','Search PACER for active federal court judgments against the owner','Consult a licensed real estate attorney to confirm your state\u2019s treatment of federal liens post-sale'],
    whereText: 'Search PACER',
    whereUrl: 'https://pacer.gov',
    redFlags: ['Active IRS lien recorded within 30 days of tax sale','Multiple IRS liens','Owner is business entity with IRS issues'],
    proTip: 'The 120-day IRS redemption window applies even after you receive a deed. Do not spend money on improvements until that window closes.',
    source: 'IRC \u00a7 6323 \u00b7 IRS.gov'
  },
  {
    name: 'HOA Super-Lien Check',
    what: 'Determine if an HOA lien exists and whether it has super-priority over your investment.',
    why: 'In Nevada, Colorado, Florida, Maryland, and Washington D.C., HOA liens can have super-priority \u2014 the HOA can foreclose and wipe out your tax lien entirely before you can act.',
    how: ['Check county recorder for HOA lien filings against the parcel','Confirm whether your state grants HOA super-lien priority','If HOA exists \u2014 contact them directly to get current balance','Factor HOA balance into your maximum bid calculation'],
    whereText: 'Community Associations Institute',
    whereUrl: 'https://caionline.org',
    redFlags: ['Active HOA foreclosure filed','HOA balance exceeding equity','Super-lien state with large arrears'],
    proTip: 'In Nevada, HOA super-lien priority covers up to 9 months of unpaid dues \u2014 that can exceed $10,000. Always call the HOA directly before bidding.',
    source: 'CAI \u00b7 caionline.org'
  },
  {
    name: 'Environmental Lien Search',
    what: 'Check for EPA Superfund designation, underground storage tanks, or environmental contamination.',
    why: 'Under CERCLA, property owners \u2014 including investors who acquire through tax deed \u2014 can be held liable for cleanup costs regardless of whether they caused contamination. Cleanup costs routinely exceed property value.',
    how: ['Search EPA ECHO database for the address','Search EPA Superfund site list','Check state environmental agency for underground storage tank records','Look for prior industrial use (gas stations, dry cleaners, auto shops) in property history','Consult a licensed environmental professional for any property with potential contamination history'],
    whereText: 'EPA ECHO Database',
    whereUrl: 'https://echo.epa.gov',
    redFlags: ['Prior gas station or dry cleaner','EPA enforcement action on record','Underground storage tank registration','Any brownfield designation'],
    proTip: 'Even a clean-looking property can have legacy contamination from a business that operated 30 years ago. Always check use history going back at least 20 years.',
    source: 'CERCLA 42 U.S.C. \u00a7 9607 \u00b7 EPA.gov'
  },
  {
    name: 'Title Chain + Encumbrances',
    what: 'Pull the full chain of title to identify any liens, judgments, easements, or encumbrances that may survive the tax sale.',
    why: 'Not all liens get wiped by a tax deed sale. Mechanics liens, some judgment liens, easements, and deed restrictions can survive \u2014 leaving you with hidden obligations. This is the step most new investors skip and regret most.',
    how: ['Pull all recorded documents against the parcel at county recorder','Look for mechanics liens, judgment liens, or lis pendens','Identify all easements and deed restrictions in the chain','Confirm which encumbrances survive tax sale in your state','Consult a licensed title company or real estate attorney before transacting'],
    whereText: 'Search PACER',
    whereUrl: 'https://pacer.gov',
    redFlags: ['Lis pendens (active lawsuit)','Mechanics lien from recent work','Deed restriction limiting use','Utility easement consuming the lot'],
    proTip: 'A lis pendens is a stop sign. Do not bid on any property with an active lis pendens until you understand exactly what the lawsuit is about. It can cloud title indefinitely.',
    source: 'Nolo.com \u00b7 County recorder'
  },
  {
    name: 'Property Condition + Code Violations',
    what: 'Check municipal records for open code violations, demolition orders, or condemnation notices.',
    why: 'A property with an active demolition order can be torn down by the municipality at the investor\u2019s expense after deed transfer. Open code violations become the new owner\u2019s responsibility and can cost tens of thousands to remediate.',
    how: ['Search city or county building department for open permits and violations','Check for active condemnation or unsafe structure notices','Drive by or use Google Street View to assess visible condition','Search municipal court records for housing court cases against the property','Verify property condition with a licensed inspector before transacting'],
    whereText: 'Google Street View',
    whereUrl: 'https://maps.google.com',
    redFlags: ['Open demolition order','Active condemnation notice','Multiple open code violations','Visible structural collapse','Property boarded and posted'],
    proTip: 'Call the building department directly and ask: \u201CAre there any open violations or orders on this parcel?\u201D They will tell you. Most investors never ask.',
    source: 'HUD.gov \u00b7 Municipal records'
  },
  {
    name: 'Equity Calculation',
    what: 'Calculate whether enough equity exists in the property to make the investment worthwhile.',
    why: 'If a property has no equity \u2014 meaning mortgage plus liens exceeds market value \u2014 the owner has no financial reason to redeem and you end up with a property worth less than what you paid.',
    how: ['Pull estimated market value from county assessor (use 80% of assessed as conservative estimate)','Pull mortgage balance from county recorder \u2014 look for deed of trust or mortgage recording','Add all known liens to mortgage','Subtract total debt from market value \u2014 this is available equity','Many investors look for equity exceeding total debt by at least 20% as a general guideline \u2014 verify with a licensed appraiser'],
    whereText: 'County Assessor Search',
    whereUrl: '',
    redFlags: ['Mortgage near or exceeding value','Multiple judgment liens','Equity below 20% after all debts'],
    proTip: 'Never rely on assessed value alone. In many counties it lags market by 1\u20133 years. Pull 3 recent comparable sales to get a real number.',
    source: 'Investopedia \u00b7 County assessor'
  },
  {
    name: 'Redemption Probability',
    what: 'Assess how likely the owner is to redeem before you can foreclose or apply for a deed.',
    why: 'If your strategy is interest income you want high redemption. If your strategy is acquiring the property you want low redemption. Either way you need to know which you\u2019re getting before you bid.',
    how: ['Check if property is owner-occupied (homestead exemption on assessor record)','Identify if owner is individual, LLC, or out-of-state entity','Check if owner has other tax delinquencies on record','Look at property condition \u2014 maintained or abandoned','Check length of delinquency \u2014 1 year vs 5 years tells you a lot'],
    whereText: 'County Tax Records',
    whereUrl: '',
    redFlags: ['Absentee LLC owner','Multiple years delinquent','Property visibly abandoned','Owner delinquent on multiple parcels'],
    proTip: 'Owner-occupied properties with homestead exemptions redeem at a very high rate. Absentee-owned vacant land with 4-year delinquency almost never redeems. Know which one you have before bidding.',
    source: 'NTLA \u00b7 ntla.org'
  },
  {
    name: 'Auction + Registration Confirmation',
    what: 'Confirm the exact auction date, registration deadline, deposit requirement, and bidding rules.',
    why: 'Missing registration means you cannot bid \u2014 period. Showing up without the correct deposit format means you cannot bid. Misunderstanding the bid method means you overbid and destroy your return.',
    how: ['Go directly to county tax collector website \u2014 not a third-party site','Confirm auction date has not changed (counties reschedule)','Download and read the official auction rules document','Confirm registration deadline and exactly what is required','Confirm the bidding method for that specific county','Set calendar reminder for registration deadline \u2014 not auction date'],
    whereText: 'RealAuction Platform',
    whereUrl: 'https://realauction.com',
    redFlags: ['Auction date changed with no notice','Registration requires docs you don\u2019t have in time','Deposit format you can\u2019t provide','Platform you\u2019ve never used before'],
    proTip: 'Set your reminder for the registration deadline \u2014 not the auction date. Most investors who miss deals miss them at registration, not at the auction.',
    source: 'County tax collector sites \u00b7 NTLA auction guidelines \u00b7 ntla.org'
  }
];

// State-specific due diligence rules
var SCOUT_STATE_RULES = {
  AZ: { type:'lien', redemption_months:36, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:true, registration_required:true, deposit_pct:0 },
  FL: { type:'lien', redemption_months:24, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:true, online_auction:true, registration_required:true, deposit_pct:0 },
  TX: { type:'deed', redemption_months:6, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:true, online_auction:false, registration_required:true, deposit_pct:5 },
  GA: { type:'deed', redemption_months:12, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:false, online_auction:false, registration_required:true, deposit_pct:0 },
  NJ: { type:'lien', redemption_months:24, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:true, online_auction:true, registration_required:true, deposit_pct:0 },
  MD: { type:'lien', redemption_months:6, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:true, online_auction:true, registration_required:true, deposit_pct:0 },
  CO: { type:'lien', redemption_months:36, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:true, registration_required:true, deposit_pct:0 },
  IL: { type:'lien', redemption_months:30, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:false, registration_required:true, deposit_pct:0 },
  OH: { type:'deed', redemption_months:0, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:false, online_auction:false, registration_required:true, deposit_pct:10 },
  SC: { type:'deed', redemption_months:12, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:false, online_auction:false, registration_required:true, deposit_pct:5 },
  IN: { type:'lien', redemption_months:12, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:true, registration_required:true, deposit_pct:0 },
  IA: { type:'lien', redemption_months:24, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:true, registration_required:true, deposit_pct:0 }
};

function scoutGetStateItems(stateCode) {
  var rules = stateCode ? SCOUT_STATE_RULES[stateCode.toUpperCase()] : null;
  var items = [];
  if (!rules) {
    items.push({ icon: '\u26A0\uFE0F', text: 'State-specific rules not yet available for this state \u2014 verify with local tax collector.', type: 'warning' });
    return items;
  }
  if (rules.type === 'deed') {
    items.push({ icon: '\uD83D\uDCDC', text: 'This is a TAX DEED state \u2014 you are bidding on the property itself, not a lien certificate.', type: 'info' });
  } else {
    items.push({ icon: '\uD83D\uDCDC', text: 'This is a TAX LIEN state \u2014 you are purchasing a lien certificate, not the property.', type: 'info' });
  }
  if (rules.quiet_title_required) {
    items.push({ icon: '\u2696\uFE0F', text: 'Quiet title action required after foreclosure. Budget $1,500\u2013$3,000+ for attorney fees (costs vary \u2014 verify locally).', type: 'action' });
  }
  if (rules.irs_lien_survives) {
    items.push({ icon: '\uD83C\uDFDB\uFE0F', text: 'IRS federal tax liens survive the sale. Check for federal liens before bidding.', type: 'warning' });
  }
  if (rules.hoa_super_lien) {
    items.push({ icon: '\uD83C\uDFE0', text: 'HOA super-liens may apply. Check for outstanding HOA assessments.', type: 'warning' });
  }
  if (rules.online_auction) {
    items.push({ icon: '\uD83D\uDCBB', text: 'Online auction \u2014 register on the platform in advance. Confirm browser/device requirements.', type: 'action' });
  }
  if (rules.registration_required) {
    items.push({ icon: '\u270D\uFE0F', text: 'Pre-registration required. Set calendar reminder for registration deadline.', type: 'action' });
  }
  if (rules.deposit_pct > 0) {
    items.push({ icon: '\uD83D\uDCB0', text: 'Deposit required: typically ' + rules.deposit_pct + '% of bid amount (costs vary \u2014 verify locally). Confirm exact format with the county.', type: 'action' });
  }
  if (rules.redemption_months > 0) {
    items.push({ icon: '\u23F0', text: 'Redemption period: ' + rules.redemption_months + ' months. Capital locked until owner redeems or period expires.', type: 'info' });
  }
  return items;
}

var _scoutActiveDeal = null;

function scoutGetDeals() {
  try {
    var raw = localStorage.getItem('aurigen_scout_deals');
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function scoutSaveDeals(deals) {
  try { localStorage.setItem('aurigen_scout_deals', JSON.stringify(deals)); } catch(e) {}
}

function scoutSaveDeal(deal) {
  deal.updatedAt = Date.now();
  var deals = scoutGetDeals();
  var idx = deals.findIndex(function(d) { return d.id === deal.id; });
  if (idx >= 0) deals[idx] = deal;
  else deals.unshift(deal);
  scoutSaveDeals(deals);
}

function scoutDeleteDeal(id) {
  if (!confirm('Delete this deal? This cannot be undone.')) return;
  var deals = scoutGetDeals().filter(function(d) { return d.id !== id; });
  scoutSaveDeals(deals);
  if (_scoutActiveDeal && _scoutActiveDeal.id === id) _scoutActiveDeal = null;
  scoutRender();
}

function scoutCountComplete(deal) {
  var c = 0;
  for (var i = 1; i <= 10; i++) { if (deal.steps[i] && deal.steps[i].complete) c++; }
  return c;
}

function scoutNewDeal() {
  if (!IS_PAID) return;
  var states = window.STATES_V2 ? window.STATES_V2.slice().sort(function(a,b) { return a.name.localeCompare(b.name); }) : [];
  var opts = '<option value="">Select state...</option>';
  states.forEach(function(s) { opts += '<option value="' + escapeHtml(s.code) + '">' + escapeHtml(s.name) + '</option>'; });

  var overlay = document.createElement('div');
  overlay.className = 'scout-modal-overlay';
  overlay.innerHTML =
    '<div class="scout-modal">' +
      '<div class="scout-modal-title">NEW DEAL</div>' +
      '<form id="scout-new-form">' +
        '<label>Deal Name *</label>' +
        '<input name="name" required placeholder="e.g. 123 Main St" autocomplete="off">' +
        '<label>Parcel ID or Address</label>' +
        '<input name="parcel" placeholder="Parcel number or street address" autocomplete="off">' +
        '<label>State</label>' +
        '<select name="state">' + opts + '</select>' +
        '<label>County</label>' +
        '<input name="county" placeholder="County name" autocomplete="off">' +
        '<div class="scout-modal-btns">' +
          '<button type="button" class="scout-modal-ghost" onclick="this.closest(\'.scout-modal-overlay\').remove()">Cancel</button>' +
          '<button type="submit" class="scout-modal-primary">Start Checklist \u2192</button>' +
        '</div>' +
      '</form>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });

  document.getElementById('scout-new-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var f = e.target;
    var steps = {};
    for (var i = 1; i <= 10; i++) steps[i] = { complete: false, notes: '', flag: false };
    var deal = {
      id: 'deal_' + Date.now(),
      name: f.name.value.trim(),
      parcel: f.parcel.value.trim(),
      state: f.state.value,
      county: f.county.value.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      steps: steps
    };
    scoutSaveDeal(deal);
    _scoutActiveDeal = deal;
    overlay.remove();
    scoutRender();
  });
}

function scoutSelectDeal(id) {
  if (!id) { _scoutActiveDeal = null; scoutRender(); return; }
  var deals = scoutGetDeals();
  var deal = deals.find(function(d) { return d.id === id; });
  if (deal) { _scoutActiveDeal = deal; scoutRender(); }
}

function scoutToggleStep(stepNum) {
  var el = document.getElementById('scout-step-' + stepNum);
  if (el) el.classList.toggle('open');
}

function scoutMarkComplete(stepNum) {
  if (!_scoutActiveDeal) return;
  _scoutActiveDeal.steps[stepNum].complete = !_scoutActiveDeal.steps[stepNum].complete;
  scoutSaveDeal(_scoutActiveDeal);
  scoutRender();
}

function scoutToggleFlag(stepNum) {
  if (!_scoutActiveDeal) return;
  _scoutActiveDeal.steps[stepNum].flag = !_scoutActiveDeal.steps[stepNum].flag;
  scoutSaveDeal(_scoutActiveDeal);
  scoutRender();
}

function scoutSaveNotes(stepNum, val) {
  if (!_scoutActiveDeal) return;
  _scoutActiveDeal.steps[stepNum].notes = val;
  scoutSaveDeal(_scoutActiveDeal);
  // Don't re-render — just save silently
}

function scoutCopySummary() {
  if (!_scoutActiveDeal) return;
  var d = _scoutActiveDeal;
  var lines = ['Aurigen Scout \u2014 Due Diligence Report'];
  lines.push('\u2501'.repeat(26));
  lines.push('Deal: ' + d.name);
  if (d.parcel) lines.push('Parcel: ' + d.parcel);
  lines.push('State: ' + (d.state || '\u2014') + ' \u00b7 County: ' + (d.county || '\u2014'));
  lines.push('\u2501'.repeat(26));
  for (var i = 0; i < 10; i++) {
    var st = d.steps[i + 1];
    var icon = st.complete ? '\u2713' : (st.flag ? '!' : '\u25cb');
    lines.push(icon + ' ' + SCOUT_STEPS[i].name);
  }
  lines.push('\u2501'.repeat(26));
  lines.push(new Date().toLocaleDateString());
  lines.push('Rates and rules are subject to change.');
  lines.push('Always verify with official county sources and a licensed professional.');
  lines.push('Built with Aurigen \u00b7 aurigendirectory.com');
  try {
    navigator.clipboard.writeText(lines.join('\n'));
    var btn = document.getElementById('scout-copy-btn');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(function() { btn.textContent = 'Copy Summary'; }, 2000); }
  } catch(e) {}
}

function scoutRender() {
  var deals = scoutGetDeals();
  var list = document.getElementById('scout-deal-list');
  var dd = document.getElementById('scout-mobile-dd');
  var main = document.getElementById('scout-main');
  var empty = document.getElementById('scout-empty');
  var cl = document.getElementById('scout-checklist');

  // Sidebar deal list
  var html = '';
  deals.forEach(function(d) {
    var cnt = scoutCountComplete(d);
    var isActive = _scoutActiveDeal && _scoutActiveDeal.id === d.id;
    html += '<div class="scout-deal-card' + (isActive ? ' active' : '') + '" onclick="scoutSelectDeal(\'' + d.id + '\')">' +
      '<button class="scout-deal-del" onclick="event.stopPropagation();scoutDeleteDeal(\'' + d.id + '\')">\u2715</button>' +
      '<div class="scout-deal-name">' + escapeHtml(d.name) + '</div>' +
      '<div class="scout-deal-meta">' + escapeHtml(d.state || '\u2014') + ' \u00b7 ' + escapeHtml(d.county || '\u2014') + '</div>' +
      '<div class="scout-deal-bar"><div class="scout-deal-bar-fill" style="width:' + (cnt * 10) + '%"></div></div>' +
      '<div class="scout-deal-steps">' + cnt + '/10 steps</div>' +
    '</div>';
  });
  if (list) list.innerHTML = html;

  // Mobile dropdown
  if (dd) {
    var ddHtml = '<option value="">Select a deal...</option>';
    deals.forEach(function(d) {
      var sel = _scoutActiveDeal && _scoutActiveDeal.id === d.id ? ' selected' : '';
      ddHtml += '<option value="' + d.id + '"' + sel + '>' + escapeHtml(d.name) + ' (' + scoutCountComplete(d) + '/10)</option>';
    });
    dd.innerHTML = ddHtml;
  }

  // Main content
  if (!_scoutActiveDeal) {
    empty.style.display = 'flex';
    cl.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  cl.style.display = 'block';

  var d = _scoutActiveDeal;
  var cnt = scoutCountComplete(d);
  var pct = cnt * 10;

  var out = '';
  // Header
  out += '<div class="scout-hdr">' +
    '<div class="scout-hdr-name">' + escapeHtml(d.name) + '</div>' +
    '<div class="scout-hdr-meta">' + escapeHtml(d.state || '\u2014') + ' \u00b7 ' + escapeHtml(d.county || '\u2014') + (d.parcel ? ' \u00b7 ' + escapeHtml(d.parcel) : '') + '</div>' +
    '<div class="scout-hdr-progress">' +
      '<div class="scout-hdr-progress-text">' + cnt + ' of 10 steps complete</div>' +
      '<div class="scout-hdr-progress-bar"><div class="scout-hdr-progress-fill" style="width:' + pct + '%"></div></div>' +
    '</div>' +
  '</div>';

  // Complete banner
  if (cnt === 10) {
    out += '<div class="scout-complete-banner">' +
      '<div class="scout-complete-icon">\u2713</div>' +
      '<div class="scout-complete-text">' +
        '<div class="scout-complete-title">Due Diligence Complete</div>' +
        '<div class="scout-complete-sub">Always verify with a licensed title company or real estate attorney before transacting. Rates and rules vary by county.</div>' +
      '</div>' +
      '<button class="scout-copy-btn" id="scout-copy-btn" onclick="scoutCopySummary()">Copy Summary</button>' +
    '</div>';
  }

  // State-specific items
  var stateItems = scoutGetStateItems(d.state);
  if (stateItems.length > 0) {
    out += '<div class="scout-state-rules">';
    out += '<div class="scout-state-rules-title">STATE-SPECIFIC: ' + escapeHtml(d.state || 'GENERAL') + '</div>';
    stateItems.forEach(function(item) {
      var cls = item.type === 'warning' ? 'scout-state-warning' : (item.type === 'action' ? 'scout-state-action' : 'scout-state-info');
      out += '<div class="' + cls + '">' + item.icon + ' ' + escapeHtml(item.text) + '</div>';
    });
    out += '</div>';
  }

  // Steps
  // Preserve which steps are open
  var openSteps = {};
  for (var oi = 1; oi <= 10; oi++) {
    var oel = document.getElementById('scout-step-' + oi);
    if (oel && oel.classList.contains('open')) openSteps[oi] = true;
  }

  for (var i = 0; i < 10; i++) {
    var stepNum = i + 1;
    var s = SCOUT_STEPS[i];
    var st = d.steps[stepNum];
    var classes = 'scout-step';
    if (st.complete) classes += ' completed';
    if (st.flag) classes += ' flagged';
    if (openSteps[stepNum]) classes += ' open';

    var numContent = st.complete ? '\u2713' : (st.flag ? '!' : stepNum);

    out += '<div class="' + classes + '" id="scout-step-' + stepNum + '">' +
      '<div class="scout-step-hdr" onclick="scoutToggleStep(' + stepNum + ')">' +
        '<div class="scout-step-num">' + numContent + '</div>' +
        '<div class="scout-step-info">' +
          '<div class="scout-step-name">' + escapeHtml(s.name) + '</div>' +
          '<div class="scout-step-what">' + escapeHtml(s.what) + '</div>' +
        '</div>' +
        '<div class="scout-step-actions">' +
          '<button class="scout-flag-btn' + (st.flag ? ' active' : '') + '" onclick="event.stopPropagation();scoutToggleFlag(' + stepNum + ')" title="Flag issue"></button>' +
          '<span class="scout-chevron">\u25BC</span>' +
        '</div>' +
      '</div>' +
      '<div class="scout-step-body">' +
        '<div class="scout-section-label why">WHY IT MATTERS</div>' +
        '<div class="scout-section-text">' + escapeHtml(s.why) + '</div>' +
        '<div class="scout-section-label how">HOW TO DO IT</div>' +
        '<ol class="scout-how-list">';
    s.how.forEach(function(h) { out += '<li>' + escapeHtml(h) + '</li>'; });
    out += '</ol>';
    if (s.whereUrl) {
      out += '<div class="scout-section-label where">WHERE</div>' +
        '<a class="scout-where-link" href="' + escapeHtml(s.whereUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(s.whereText) + ' \u2192</a>';
    } else if (s.whereText) {
      out += '<div class="scout-section-label where">WHERE</div>' +
        '<span class="scout-section-text">' + escapeHtml(s.whereText) + '</span>';
    }
    out += '<div class="scout-section-label redflags">RED FLAGS</div><ul class="scout-redflag-list">';
    s.redFlags.forEach(function(r) { out += '<li>' + escapeHtml(r) + '</li>'; });
    out += '</ul>' +
      '<div class="scout-section-label protip">PRO TIP</div>' +
      '<div class="scout-protip">' + escapeHtml(s.proTip) + '</div>' +
      '<div class="scout-section-label notes">YOUR NOTES</div>' +
      '<textarea class="scout-notes-area" placeholder="Add your notes for this step..." oninput="scoutSaveNotes(' + stepNum + ',this.value)">' + escapeHtml(st.notes || '') + '</textarea>' +
      '<div class="scout-step-footer">' +
        '<button class="scout-flag-toggle' + (st.flag ? ' active' : '') + '" onclick="scoutToggleFlag(' + stepNum + ')"><span class="scout-flag-dot"></span> ' + (st.flag ? 'Flagged' : 'Flag Issue') + '</button>' +
        '<button class="scout-complete-btn' + (st.complete ? ' done' : '') + '" onclick="scoutMarkComplete(' + stepNum + ')">' + (st.complete ? '\u2713 Completed' : 'Mark Complete \u2713') + '</button>' +
      '</div>' +
      '<div class="scout-source">' + escapeHtml(s.source) + '</div>' +
    '</div></div>';
  }

  cl.innerHTML = out;
}

// Init scout on load
(function() {
  var deals = scoutGetDeals();
  if (deals.length > 0) { _scoutActiveDeal = deals[0]; }
  scoutRender();
})();

