function renderAuctions() {
  var filtered = calFilterEntries();
  _auctionsFiltered = filtered;

  // Update count
  var countEl = document.getElementById('auctions-count');
  if (countEl) countEl.textContent = filtered.length + ' result' + (filtered.length !== 1 ? 's' : '');

  // --- DNA toggle row ---
  var dnaRow = document.getElementById('auctions-dna-row');
  var dnaCodes = calGetDnaStates();
  if (dnaRow) {
    if (dnaCodes) {
      dnaRow.style.display = '';
      var tog = document.getElementById('auctions-dna-toggle');
      if (tog) tog.classList.toggle('active', _calDnaOnly);
      var label = document.getElementById('auctions-dna-label');
      if (label) label.textContent = _calDnaOnly ? 'MY STATES' : 'ALL STATES';
      var chips = document.getElementById('auctions-dna-chips');
      if (chips) {
        chips.innerHTML = dnaCodes.map(function(c) {
          return '<span class="auctions-cal-dna-chip">' + escapeHtml(c) + '</span>';
        }).join('');
      }
    } else {
      dnaRow.style.display = 'none';
    }
  }

  // --- Calendar grid ---
  var dayMap = calGroupByDay(filtered, _calYear, _calMonth);
  var monthLabel = document.getElementById('auctions-cal-month');
  if (monthLabel) monthLabel.textContent = _calMonthNames[_calMonth] + ' ' + _calYear;

  // Day-of-week header row (separate from grid)
  var dowRow = document.getElementById('auctions-cal-dow-row');
  if (dowRow) {
    var dowHtml = '';
    _calDow.forEach(function(d) {
      dowHtml += '<div class="auctions-cal-dow">' + d + '</div>';
    });
    dowRow.innerHTML = dowHtml;
  }

  var grid = document.getElementById('auctions-cal-grid');
  if (!grid) return;

  var html = '';

  // First day of month and total days
  var firstDay = new Date(_calYear, _calMonth, 1).getDay();
  var daysInMonth = new Date(_calYear, _calMonth + 1, 0).getDate();
  var today = new Date();
  var todayKey = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

  // Empty cells before first day
  for (var b = 0; b < firstDay; b++) {
    html += '<div class="auctions-cal-cell empty"><span class="auctions-cal-day-num"></span></div>';
  }

  // Day cells
  for (var d = 1; d <= daysInMonth; d++) {
    var key = _calYear + '-' + String(_calMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    var dayEntries = dayMap[key];
    var count = dayEntries ? dayEntries.length : 0;
    var isPast = new Date(_calYear, _calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var isToday = key === todayKey;
    var classes = 'auctions-cal-cell';
    if (count > 0) classes += ' has-auctions';
    if (isPast) classes += ' past';
    if (isToday) classes += ' today';
    if (key === _calSelectedDate) classes += ' selected';

    html += '<div class="' + classes + '"' + (count > 0 ? ' data-date="' + key + '" onclick="openDayDrawer(\'' + key + '\')"' : '') + '>';
    html += '<span class="auctions-cal-day-num">' + d + '</span>';
    if (count > 0) {
      html += '<span class="auctions-cal-dot"></span>';
      if (count > 1) html += '<span class="auctions-cal-count">' + count + '</span>';
    }
    html += '</div>';
  }

  // Trailing empty cells to complete the last row
  var totalCells = firstDay + daysInMonth;
  var trailing = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (var t = 0; t < trailing; t++) {
    html += '<div class="auctions-cal-cell empty"><span class="auctions-cal-day-num"></span></div>';
  }

  grid.innerHTML = html;

  // --- Archetype recommendations above quarters ---
  var recsEl = document.getElementById('auctions-recs');
  if (recsEl) {
    var archKeyRec = getArchetypeKey();
    var archCfgRec = archKeyRec ? ARCHETYPE_TOOL_CONFIG[archKeyRec] : null;
    if (archCfgRec) {
      var recsFiltered = filtered.filter(function(e) {
        var matchStates = archCfgRec.daStates || [];
        return matchStates.indexOf(e.stateCode) >= 0;
      }).slice(0, 5);
      if (recsFiltered.length > 0) {
        var recHtml = '<div class="auctions-recs-header"><span class="auctions-recs-title">RECOMMENDED FOR YOU</span><span class="auctions-recs-badge">' + escapeHtml(archCfgRec.label) + '</span></div>';
        recsFiltered.forEach(function(e) { recHtml += buildCardHtml(e, false); });
        recsEl.innerHTML = recHtml;
        recsEl.style.display = '';
      } else {
        recsEl.innerHTML = '';
        recsEl.style.display = 'none';
      }
    } else {
      recsEl.innerHTML = '';
      recsEl.style.display = 'none';
    }
  }

  // --- Quarterly groupings below calendar ---
  var quartersEl = document.getElementById('auctions-quarters');
  if (!quartersEl) return;

  // Collect ALL filtered entries grouped by quarter (Q1=Jan-Mar, Q2=Apr-Jun, Q3=Jul-Sep, Q4=Oct-Dec)
  var quarterMap = {};
  var quarterOrder = [];

  filtered.forEach(function(e) {
    if (!e.date || !e.date.year || e.date.day <= 0) return;
    var qLabel = calGetQuarter(e);
    if (!qLabel) return;
    if (!quarterMap[qLabel]) {
      quarterMap[qLabel] = [];
      quarterOrder.push(qLabel);
    }
    quarterMap[qLabel].push(e);
  });

  // Sort quarters chronologically
  quarterOrder.sort(function(a, b) {
    var pa = a.match(/Q(\d)\s+(\d+)/);
    var pb = b.match(/Q(\d)\s+(\d+)/);
    if (!pa || !pb) return 0;
    var ka = parseInt(pa[2]) * 10 + parseInt(pa[1]);
    var kb = parseInt(pb[2]) * 10 + parseInt(pb[1]);
    return ka - kb;
  });

  if (quarterOrder.length === 0) {
    quartersEl.innerHTML = '';
    return;
  }

  var qHtml = '';
  quarterOrder.forEach(function(qLabel) {
    var entries = quarterMap[qLabel];
    qHtml += '<div class="auctions-quarter">';
    qHtml += '<div class="auctions-quarter-header" onclick="toggleQuarter(this)">';
    qHtml += '<span class="auctions-quarter-title">' + escapeHtml(qLabel) + '</span>';
    qHtml += '<span><span class="auctions-quarter-count">' + entries.length + ' auction' + (entries.length !== 1 ? 's' : '') + '</span>';
    qHtml += '<span class="auctions-quarter-chevron">&#9660;</span></span>';
    qHtml += '</div>';
    qHtml += '<div class="auctions-quarter-body">';
    entries.forEach(function(e) { qHtml += buildCardHtml(e, false); });
    qHtml += '</div></div>';
  });

  quartersEl.innerHTML = qHtml;
}

// Interstitial
function openInterstitial(url) {
  if (!url || !/^https?:\/\//i.test(url)) return;
  _interstitialUrl = url;
  var modal = document.getElementById('auctions-interstitial');
  if (modal) {
    modal.classList.add('open');
    // Focus trap
    var cont = document.getElementById('interstitial-continue');
    if (cont) cont.focus();
  }
}

function confirmInterstitial() {
  if (_interstitialUrl) {
    window.open(_interstitialUrl, '_blank', 'noopener,noreferrer');
  }
  closeInterstitial();
}

function closeInterstitial() {
  _interstitialUrl = '';
  var modal = document.getElementById('auctions-interstitial');
  if (modal) modal.classList.remove('open');
}

// Stub — consultation removed
function openConsultModal() {}
function closeConsultModal() {}

// Mobile drawer
function toggleAuctionsSidebar() {
  var overlay = document.getElementById('auctions-drawer-overlay');
  var drawer = document.getElementById('auctions-drawer');
  if (!overlay || !drawer) return;
  // Clone sidebar filters into drawer
  var sidebar = document.getElementById('auctions-sidebar');
  var body = document.getElementById('auctions-drawer-body');
  if (sidebar && body) body.innerHTML = sidebar.querySelector('.auctions-sidebar-inner').innerHTML;
  overlay.classList.add('open');
  drawer.classList.add('open');
}

function closeAuctionsDrawer() {
  var overlay = document.getElementById('auctions-drawer-overlay');
  var drawer = document.getElementById('auctions-drawer');
  if (overlay) overlay.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
}

// Event delegation for interstitial triggers (Register buttons + platform pills)
document.addEventListener('click', function(e) {
  var trigger = e.target.closest('.auction-interstitial-trigger');
  if (trigger) {
    var url = trigger.getAttribute('data-url');
    if (url) openInterstitial(url);
  }
});

// Keyboard: Escape closes interstitial, drawer, and popovers
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeInterstitial();
    closeAuctionsDrawer();
    dismissMobilePopover();
  }
});

var SAGE_STATES = {
  florida: { type:'Tax Lien', rate:'18%', redemption:'2 years', bid:'bid-down interest', platform:'RealAuction + LienHub', statute:'FL Stat \u00A7 197.432', tip:'Fully online, great OTC availability. Start with smaller counties like Putnam or Levy for less competition.', beginner:true },
  arizona: { type:'Tax Lien', rate:'16%', redemption:'3 years', bid:'bid-down interest', platform:'RealAuction', statute:'ARS \u00A7 42-18112', tip:'One of the most accessible OTC programs in the country. Pinal and Yavapai counties are solid starting points.', beginner:true },
  illinois: { type:'Tax Lien', rate:'36% penalty', redemption:'varies', bid:'bid-down', platform:'SRI + county-run', statute:'35 ILCS 200/21-215', tip:'The 36% penalty structure is unique. Avoid Cook County as a beginner \u2014 try downstate counties for less competition.', beginner:false },
  alabama: { type:'Tax Lien', rate:'12%', redemption:'3 years', bid:'bid-down', platform:'GovEase', tip:'Solid lien state with a 3-year window. GovEase handles most counties online.' },
  colorado: { type:'Tax Lien', rate:'9% + federal rate', redemption:'3 years', bid:'bid-down', platform:'online (county)', tip:'Rates adjust with the federal discount rate, so yields shift year to year.' },
  indiana: { type:'Hybrid', rate:'10-15%', redemption:'1 year', bid:'highest bidder', platform:'SRI', tip:'Short redemption means faster capital cycling but also tighter timelines on due diligence.' },
  iowa: { type:'Tax Lien', rate:'24%', redemption:'2 years', bid:'random selection', platform:'county treasurer (in-person)', tip:'No competitive bidding \u2014 liens are assigned randomly. One of the few states where you can get close to statutory max rates.', beginner:true },
  maryland: { type:'Tax Lien', rate:'6-24%', redemption:'6mo-2yr', bid:'bid-down', platform:'county-run', tip:'Rates vary widely by county. Alert: Montgomery County has a platform change pending.' },
  newjersey: { type:'Tax Lien', rate:'18% + 6% penalty', redemption:'2 years', bid:'competitive', platform:'various', tip:'Complex system with both interest and penalty components. Do thorough research before bidding here.' },
  texas: { type:'Redeemable Deed', rate:'25% yr1 / 50% yr2 (homestead)', redemption:'180 days commercial / 2 years homestead', bid:'premium bid', platform:'courthouse steps', tip:'All 254 counties sell first Tuesday monthly. High penalty rates but you are buying a deed, not a lien. Quiet title is essential.', beginner:false },
  georgia: { type:'Redeemable Deed', rate:'20% yr1 / 10% yr2+', redemption:'12 months', bid:'premium bid', platform:'county-run', tip:'Strong penalty rates on a redeemable deed. Research county-specific rules carefully.' },
  tennessee: { type:'Redeemable Deed', rate:'varies', redemption:'1 year', bid:'premium bid', platform:'county-run', tip:'Nashville runs monthly sales Jun-Dec. Smaller counties may sell annually.' },
  california: { type:'Tax Deed', rate:'varies', redemption:'none after sale', bid:'highest bidder', platform:'various', tip:'No redemption \u2014 you are buying the property outright. LA County and Riverside confirmed for 2026.' },
  michigan: { type:'Tax Deed', rate:'12%/18%', redemption:'3-year forfeiture', bid:'highest bidder', platform:'Michigan Land Bank + county', tip:'Tyler v. Hennepin (2023) significantly changed how surplus proceeds work here. Know the law.' },
  newyork: { type:'Hybrid', rate:'5-20%', redemption:'varies by county', bid:'various', platform:'county-run', tip:'Rules vary dramatically by county. This is not a one-size-fits-all state.' },
  louisiana: { type:'Hybrid', rate:'varies', redemption:'varies', bid:'bid-down interest', platform:'various', tip:'ALERT: Entirely new tax lien system launched Jan 1, 2026 \u2014 bid-down interest model replacing the old ownership bid-down.' },
  ohio: { type:'Hybrid', rate:'18%', redemption:'1 year', bid:'highest bidder', platform:'various', tip:'Both lien and deed mechanisms exist depending on county.' },
  southcarolina: { type:'Tax Lien', rate:'12%', redemption:'12 months', bid:'highest bidder', platform:'county-run', tip:'Short 12-month redemption with a flat 12% rate.' },
  mississippi: { type:'Tax Lien', rate:'18%', redemption:'2 years', bid:'highest bidder', platform:'county-run', tip:'18% rate with highest-bidder format. Less competition than coastal states.' },
  missouri: { type:'Tax Lien', rate:'10%', redemption:'1 year', bid:'highest bidder', platform:'county-run', tip:'If unredeemed by year 3, transitions to deed. Interesting hybrid dynamic.' },
  nebraska: { type:'Tax Lien', rate:'14%', redemption:'3 years', bid:'random selection', platform:'county treasurer', tip:'Random selection like Iowa \u2014 less competition, closer to statutory max.' },
  montana: { type:'Tax Lien', rate:'10% + interest', redemption:'5 years', bid:'county treasurer', platform:'county treasurer', tip:'Long 5-year redemption. Patient capital required.' },
  nevada: { type:'Tax Deed', rate:'none', redemption:'none', bid:'highest bidder', platform:'county treasurer', tip:'Pure deed state \u2014 no interest, no redemption. You are buying property.' },
  washingtondc: { type:'Hybrid', rate:'18%', redemption:'6 months', bid:'highest bidder', platform:'online', tip:'18% rate with a short 6-month redemption window.' },
  pennsylvania: { type:'Tax Deed', rate:'varies', redemption:'none', bid:'highest bidder', platform:'various', tip:'Alert: Philadelphia tax sale reform legislation is pending. Verify before bidding.' },
  kansas: { type:'Tax Deed', rate:'varies', redemption:'varies', bid:'highest bidder', platform:'county-run', tip:'Alert: Sedgwick County \u2014 CivicSource contract cancelled Dec 2025, platform TBD.' }
};

function findSageState(q) {
  var map = {
    'florida':'florida',' fl ':'florida','arizona':'arizona',' az ':'arizona',
    'illinois':'illinois',' il ':'illinois','alabama':'alabama',' al ':'alabama',
    'colorado':'colorado',' co ':'colorado','indiana':'indiana',' in ':'indiana',
    'iowa':'iowa',' ia ':'iowa','maryland':'maryland',' md ':'maryland',
    'new jersey':'newjersey','newjersey':'newjersey',' nj ':'newjersey',
    'texas':'texas',' tx ':'texas','georgia':'georgia',' ga ':'georgia',
    'tennessee':'tennessee',' tn ':'tennessee','california':'california',' ca ':'california',
    'michigan':'michigan',' mi ':'michigan','new york':'newyork','newyork':'newyork',' ny ':'newyork',
    'louisiana':'louisiana',' la ':'louisiana','ohio':'ohio',' oh ':'ohio',
    'south carolina':'southcarolina',' sc ':'southcarolina',
    'mississippi':'mississippi',' ms ':'mississippi','missouri':'missouri',' mo ':'missouri',
    'nebraska':'nebraska',' ne ':'nebraska','montana':'montana',' mt ':'montana',
    'nevada':'nevada',' nv ':'nevada','washington dc':'washingtondc','dc':'washingtondc',
    'pennsylvania':'pennsylvania',' pa ':'pennsylvania','kansas':'kansas',' ks ':'kansas'
  };
  var padded = ' ' + q + ' ';
  for (var k in map) {
    if (padded.indexOf(k) !== -1) return map[k];
  }
  return null;
}

function getAdvisorResponse(input) {
  var q = input.toLowerCase();
  var stateKey = findSageState(q);
  // Archetype context — tailors advice
  var archKey = getArchetypeKey();
  var archCtx = archKey && ARCHETYPE_TOOL_CONFIG[archKey] ? ARCHETYPE_TOOL_CONFIG[archKey].sageContext : null;
  // FREQUENCY RULE: Never deploy CTA on back-to-back responses.
  // If CTA was just shown and investor did not engage — wait at least 2 more exchanges.
  // Cold factual questions do not trigger a CTA.
  var ctaGap = _sageQuestionCount - _sageLastCTATurn;
  var needsCTA = _sageQuestionCount >= 3 && ctaGap >= 3;

  // State-specific query
  if (stateKey && SAGE_STATES[stateKey]) {
    var s = SAGE_STATES[stateKey];
    var name = stateKey.charAt(0).toUpperCase() + stateKey.slice(1);
    if (stateKey === 'newyork') name = 'New York';
    if (stateKey === 'newjersey') name = 'New Jersey';
    if (stateKey === 'southcarolina') name = 'South Carolina';
    if (stateKey === 'washingtondc') name = 'Washington DC';
    var r = name + ': ' + s.type + ' state. Statutory max rate of ' + s.rate + ', ' + s.redemption + ' redemption, ' + s.bid + ' bidding.\n\n' + s.tip;
    if (s.platform) r += '\n\nPlatform: ' + s.platform + '.';
    if (s.statute) r += '\nStatute: ' + s.statute + '.';
    r += '\n\nOpen ' + name + ' on the Map or List tab to see full county-level data, platform links, and auction dates.';
    return r;
  }

  // Compare two states
  if (q.includes('compare') || q.includes('vs') || q.includes('versus')) {
    var found = [];
    var testMap = { florida:'Florida', arizona:'Arizona', texas:'Texas', illinois:'Illinois', iowa:'Iowa', georgia:'Georgia', california:'California', ohio:'Ohio', newyork:'New York', michigan:'Michigan' };
    for (var tk in testMap) { if (q.indexOf(tk) !== -1 || q.indexOf(testMap[tk].toLowerCase()) !== -1) found.push(tk); }
    if (found.length >= 2 && SAGE_STATES[found[0]] && SAGE_STATES[found[1]]) {
      var a = SAGE_STATES[found[0]], b = SAGE_STATES[found[1]];
      var na = testMap[found[0]], nb = testMap[found[1]];
      return na + ' vs ' + nb + ':\n\n' +
        na + ': ' + a.type + ', ' + a.rate + ' rate, ' + a.redemption + ' redemption, ' + a.bid + '.\n' +
        nb + ': ' + b.type + ', ' + b.rate + ' rate, ' + b.redemption + ' redemption, ' + b.bid + '.\n\n' +
        'These are fundamentally different vehicles. ' + na + ' is a ' + a.type.toLowerCase() + ' \u2014 ' + nb + ' is a ' + b.type.toLowerCase() + '. The Versus tab gives you a full side-by-side breakdown with all five metrics.';
    }
    return 'The Versus tab lets you compare any two states side by side \u2014 rate, redemption, bid method, platform, and type. Pick your two states from the dropdowns and it does the breakdown for you. That\u2019s a Full Access feature.';
  }

  // Beginner / getting started
  if (q.includes('beginner') || q.includes('start') || q.includes('new to') || q.includes('first') || q.includes('getting started') || q.includes('where do i')) {
    var beginnerResp = 'For getting started, I\u2019d point you toward Florida, Arizona, or Iowa.\n\nFlorida and Arizona are fully online, well-documented, and have strong OTC programs so you can buy unsold liens without competitive bidding. Iowa uses random selection, which means you\u2019re not competing on rate at all.\n\nAll three have solid infrastructure for newer investors. Open any of them on the Map tab to see the full breakdown.';
    if (archCtx) beginnerResp = 'Based on your ' + ARCHETYPE_TOOL_CONFIG[archKey].label + ' profile:\n\n' + beginnerResp;
    return beginnerResp;
  }

  // Budget questions
  if (q.includes('$') || q.includes('budget') || q.includes('money') || q.includes('capital') || q.includes('afford') || q.includes('how much')) {
    return 'Entry points vary a lot by state and county. Some rural counties in deed states have minimum bids under $500. Iowa\u2019s random selection model can work at lower capital levels. OTC purchases \u2014 unsold liens you buy directly from the county \u2014 are often available at face value with no competition.\n\nThe Deal Analyzer can help you run the numbers on different capital levels across any state.';
  }

  // Redemption
  if (q.includes('redemption') || q.includes('redeem')) {
    return 'Redemption is the window where the original property owner can pay back the investor plus statutory interest to reclaim their property.\n\nShorter redemption = faster capital cycling. Longer = more time earning interest but capital is locked up.\n\nExamples: Florida is 2 years at up to 18%. Arizona is 3 years at up to 16%. Texas gives 180 days on commercial (25%) and 2 years on homestead (25% yr1, 50% yr2).\n\nYou can see every state\u2019s redemption period on the List tab \u2014 it\u2019s the second pill on each row.';
  }

  // Rates / interest / yield
  if (q.includes('rate') || q.includes('interest') || q.includes('yield') || q.includes('return') || q.includes('percent')) {
    return 'Statutory maximum rates vary by state. Illinois has a 36% penalty structure. Iowa is 24%. Florida caps at 18%. Arizona at 16%.\n\nBut the statutory max is the ceiling, not the floor. In bid-down states like Florida and Arizona, competition drives actual yields lower. In random-selection states like Iowa, you\u2019re more likely to land near the max.\n\nThe List tab shows every state\u2019s rate in the first pill. Filter by LIEN to see them ranked.\n\nImportant: these are statutory maximums. Actual yields depend on competition, county, and timing.';
  }

  // Bidding
  if (q.includes('bid') || q.includes('bidding')) {
    return 'Three main bidding methods:\n\nBid-down interest: investors compete by accepting a lower rate. Starts at statutory max, gets bid down. Florida, Arizona, Maryland use this.\n\nPremium bid / highest bidder: investors bid up the purchase price above the tax amount owed. Common in deed and redeemable deed states like Texas and Georgia.\n\nRandom selection: no competitive bidding. Liens assigned randomly. Iowa uses this \u2014 less competition, closer to max rates.\n\nThe bid method directly impacts your effective yield. Understanding it is step one before entering any auction.';
  }

  // Auction / how to register
  if (q.includes('auction') || q.includes('register') || q.includes('sign up') || q.includes('upcoming')) {
    return 'The Auctions tab has every confirmed 2026 auction date we track. You can filter by state, county, platform, type, and month.\n\nGovEase and RealAuction are the two biggest online platforms. Most require registration 2-4 weeks before the sale, and some require a deposit.\n\nEach auction card has a REGISTER button that takes you to the platform after a legal acknowledgment.\n\nFor your first auction, start with a state you\u2019ve researched thoroughly. Florida and Arizona have the most investor-friendly online infrastructure.';
  }

  // OTC
  if (q.includes('otc') || q.includes('over the counter') || q.includes('unsold')) {
    return 'OTC \u2014 over the counter \u2014 means buying unsold liens or deeds directly from the county after the auction. No competitive bidding, face value purchase.\n\nArizona has one of the best OTC programs in the country. Florida also has strong OTC availability in many counties.\n\nOTC can be excellent for newer investors because you skip the auction competition entirely. Check the county detail in any state modal \u2014 OTC availability is listed per county.';
  }

  // Due diligence
  if (q.includes('due diligence') || q.includes('research') || q.includes('before i bid') || q.includes('diligence')) {
    return 'Before bidding on any lien or deed:\n\n1. Pull the property record from the county assessor\n2. Verify the property exists and is accessible\n3. Check for IRS liens (these survive most tax sales)\n4. Check for environmental liens (also survive)\n5. Check for HOA super-liens (state-specific)\n6. Verify chain of title at county level\n7. Confirm auction platform and registration deadlines\n8. Understand the specific county\u2019s process\n\nState law sets the floor, but counties add their own rules. Always verify directly with the county before transacting.';
  }

  // Risk / safety / scam
  if (q.includes('risk') || q.includes('safe') || q.includes('scam') || q.includes('legit') || q.includes('lose money') || q.includes('dangerous')) {
    return 'Valid concern. Tax lien and tax deed investing involves risk including potential loss of principal. There are bad actors in this space, which is exactly why Aurigen links directly to official state statutes and government sites \u2014 not third-party summaries.\n\nReal risks to understand: properties can be worthless, environmental liens survive tax sales, IRS liens survive, title issues can block resale, and competition can drive yields to near-zero in popular counties.\n\nThe best defense is due diligence. Pull the property record, verify it exists, check for senior liens, and understand the specific county\u2019s process before bidding. The Scout tool can help you build a state-specific due diligence checklist.';
  }

  // Quiet title
  if (q.includes('quiet title') || q.includes('title')) {
    return 'Quiet title is the legal process to clear title after acquiring a tax deed. It\u2019s required in some states, recommended in all. Without it, you may have difficulty selling or financing the property.\n\nAlways consult a real estate attorney before selling a tax deed property. This is one area where cutting corners can cost more than the property is worth.';
  }

  // Tyler v Hennepin
  if (q.includes('tyler') || q.includes('hennepin') || q.includes('supreme court') || q.includes('surplus')) {
    return 'Tyler v. Hennepin County (2023) was a US Supreme Court ruling that changed tax deed investing significantly. The court held that when a government sells a tax-delinquent property for more than the taxes owed, the surplus must be returned to the former owner.\n\nThis primarily impacts deed states like Michigan. Investors should understand how surplus proceeds work in any deed state they\u2019re considering. It\u2019s shifted how some counties handle excess bids at auction.';
  }

  // Property acquisition
  if (q.includes('property') || q.includes('free') || q.includes('own') || q.includes('foreclos')) {
    return 'Let me calibrate expectations here. Most tax lien investors earn their return through interest \u2014 not property acquisition. The majority of liens get redeemed by the owner.\n\nWhen a lien isn\u2019t redeemed within the statutory period, you may initiate foreclosure proceedings. But that process has costs, takes time, and the property may not be what you expected.\n\nProperty acquisition through tax sales can work, but it\u2019s the exception, not the rule. Go in expecting the interest return, and treat any property as a bonus.';
  }

  // Platform / Aurigen features
  if (q.includes('upgrade') || q.includes('full access') || q.includes('account') || q.includes('what do i get') || q.includes('features') || q.includes('platform')) {
    return 'Full Access unlocks the Deal Analyzer, county-level data, Versus comparison, DNA Profiler, Scout, Auctions calendar, and Pulse alerts.\n\nThe free tier gives you the map and state-level data for all 51 states \u2014 interest rates, redemption periods, bid methods, and statute citations. Features are what\u2019s locked, not states.\n\nVisit the Account tab to see your current tier and upgrade options.';
  }

  // Legal / tax / financial advice boundary
  if (q.includes('tax advice') || q.includes('lawyer') || q.includes('accountant') || q.includes('legal advice') || q.includes('cpa') || q.includes('financial advisor')) {
    return 'That\u2019s the kind of question that needs a qualified professional who can look at your specific situation. I can tell you how the mechanism works \u2014 rates, redemption periods, bidding methods \u2014 but tax treatment, legal strategy, and financial planning need a CPA, attorney, or financial advisor.\n\nAlways consult a licensed professional before making investment decisions.';
  }

  // Greeting
  if (q.match(/^(hi|hello|hey|sup|what's up|howdy|yo)\b/)) {
    return 'Hey \u2014 welcome to Sage. I\u2019m here to help you understand tax lien and tax deed investing at whatever level you\u2019re at.\n\nAsk me about any state, bidding strategies, redemption periods, due diligence, or how to get started. What\u2019s on your mind?';
  }

  // Thanks
  if (q.match(/^(thanks|thank you|thx|appreciate)/)) {
    return 'Anytime. That\u2019s what I\u2019m here for. If something else comes up, just ask.';
  }

  // Out of scope
  if (q.includes('stock') || q.includes('crypto') || q.includes('bitcoin') || q.includes('forex') || q.includes('mutual fund')) {
    return 'That\u2019s outside what I can help with here \u2014 but for tax lien and tax deed questions, I\u2019m your person.';
  }

  // Fallback with CTA after enough questions
  if (needsCTA) {
    return 'That\u2019s getting into territory where a general answer won\u2019t cut it \u2014 your situation has specific variables that matter. Try narrowing your question to a specific state or topic and I can point you in the right direction.';
  }

  return 'I want to make sure I point you in the right direction on that. Try asking about a specific state, bidding methods, redemption periods, or how to get started \u2014 those are my strong suits.\n\nOr open the Map tab and click any state to see the full breakdown.';
}

// Allow Enter key to send advisor messages
document.addEventListener('DOMContentLoaded', function() {
  var inp = document.getElementById('advisor-input');
  if (inp) inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendAdvisorMessage();
  });
});

