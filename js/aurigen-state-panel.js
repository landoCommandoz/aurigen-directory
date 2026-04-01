// Aurigen — State Panel (tabbed bottom sheet)
// Owns the entire state detail panel. Replaces inline-style approach.

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

var StatePanel = {

  _currentStateCode: null,
  _currentStateName: null,

  open: async function (id) {
    if (typeof AccessManager !== 'undefined' && !AccessManager.canAccessState(id)) {
      return;
    }
    // Prefer ALL_STATES (has countyData merged) over STATES_EN (thin data)
    var allSt = window.ALL_STATES || [];
    var s = null;
    for (var j = 0; j < allSt.length; j++) {
      if ((allSt[j].id || allSt[j].abbr || allSt[j].c || allSt[j].code) === id) { s = allSt[j]; break; }
    }
    if (!s) {
      var states = window.STATES || window.STATES_EN || [];
      for (var i = 0; i < states.length; i++) {
        var st = states[i];
        if ((st.id || st.abbr || st.c || st.code) === id) { s = st; break; }
      }
    }
    if (!s) return;

    var stateCode = s.id || s.abbr || s.c || id;
    var stateName = s.name || s.n || stateCode;
    StatePanel._currentStateCode = stateCode;
    StatePanel._currentStateName = stateName;
    var sType = s._v2type || s.type || s.t || '';
    var rate = s.rate || s.y || '\u2014';
    var redemption = s.redemption || s.r || '\u2014';
    var bidMethod = s.bidMethod || '\u2014';

    // Fetch law data
    var lawData = null;
    try {
      var lawResp = await fetch('/.netlify/functions/get-state-law?state_code=' + encodeURIComponent(stateCode));
      if (lawResp.ok) {
        var lawJson = await lawResp.json();
        if (lawJson.law) lawData = lawJson.law;
      }
    } catch (e) {}

    // Type colors
    var typeColors = { lien: '#c9a84c', deed: '#2dd4c0', hybrid: '#bf5fff', redeemable: '#ff6b35', forfeiture: '#ff6b35' };
    var typeColor = typeColors[sType] || '#2dd4c0';

    // Build HTML
    var h = '';

    // Overlay
    h += '<div class="sp-overlay" onclick="StatePanel.close()">';
    h += '<div class="sp-panel" onclick="event.stopPropagation()">';

    // 1. Drag handle
    h += '<div class="sp-drag"></div>';

    // 2. Header
    h += '<div class="sp-header">';
    h += '<div class="sp-header-text">';
    h += '<div class="sp-code">' + escapeHtml(stateCode) + '</div>';
    h += '<div class="sp-name">' + escapeHtml(stateName) + '</div>';
    h += '<span class="sp-type-badge" style="border-color:' + typeColor + ';color:' + typeColor + '">' + escapeHtml(sType).toUpperCase() + '</span>';
    h += '</div>';
    h += '<button class="sp-close" onclick="StatePanel.close()">\u2715</button>';
    h += '</div>';

    // 3. Stat row
    h += '<div class="sp-stats">';
    h += '<div class="sp-pill"><div class="sp-pill-label">YIELD RATE</div><div class="sp-pill-value">' + escapeHtml(typeof shortenRate === 'function' ? shortenRate(rate, sType) : rate) + '</div></div>';
    h += '<div class="sp-pill"><div class="sp-pill-label">REDEMPTION</div><div class="sp-pill-value">' + escapeHtml(typeof shortenRedemption === 'function' ? shortenRedemption(redemption) : redemption) + '</div></div>';
    h += '<div class="sp-pill"><div class="sp-pill-label">BID METHOD</div><div class="sp-pill-value">' + escapeHtml(typeof shortenBidMethod === 'function' ? shortenBidMethod(bidMethod) : bidMethod) + '</div></div>';
    h += '</div>';

    // 4. Tab bar
    h += '<div class="sp-tabs">';
    h += '<div class="sp-tab active" data-tab="overview" onclick="StatePanel._switchTab(\'overview\')">OVERVIEW</div>';
    h += '<div class="sp-tab" data-tab="counties" onclick="StatePanel._switchTab(\'counties\')">COUNTIES</div>';
    h += '<div class="sp-tab" data-tab="law" onclick="StatePanel._switchTab(\'law\')">LAW & LINKS</div>';
    h += '</div>';

    // 5. Tab content
    h += '<div class="sp-content">';

    // OVERVIEW tab
    h += '<div class="sp-tab-body active" data-tab="overview">';
    h += StatePanel._buildOverview(s);
    h += '</div>';

    // COUNTIES tab
    h += '<div class="sp-tab-body" data-tab="counties">';
    h += StatePanel._buildCounties(s);
    h += '</div>';

    // LAW & LINKS tab
    h += '<div class="sp-tab-body" data-tab="law">';
    h += StatePanel._buildLaw(s, lawData);
    h += '</div>';

    h += '</div>'; // .sp-content
    h += '</div>'; // .sp-panel
    h += '</div>'; // .sp-overlay

    var modals = document.getElementById('modals');
    if (modals) modals.innerHTML = h;

    // Attach county search filter
    var searchInput = document.getElementById('sp-county-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var val = this.value.toLowerCase();
        var rows = document.querySelectorAll('.sp-county-row');
        for (var i = 0; i < rows.length; i++) {
          var name = rows[i].getAttribute('data-name') || '';
          rows[i].style.display = name.indexOf(val) !== -1 ? '' : 'none';
        }
      });
    }
  },

  close: function () {
    var m = document.getElementById('modals');
    if (m) m.innerHTML = '';
  },

  _switchTab: function (name) {
    var tabs = document.querySelectorAll('.sp-tab');
    var bodies = document.querySelectorAll('.sp-tab-body');
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute('data-tab') === name) { tabs[i].classList.add('active'); }
      else { tabs[i].classList.remove('active'); }
    }
    for (var j = 0; j < bodies.length; j++) {
      if (bodies[j].getAttribute('data-tab') === name) { bodies[j].classList.add('active'); }
      else { bodies[j].classList.remove('active'); }
    }
  },

  _buildOverview: function (s) {
    var h = '';
    if (s.investorAlert) {
      h += '<div class="sp-alert">' + escapeHtml(s.investorAlert) + '</div>';
    }
    if (s.rateNote) {
      h += '<div class="sp-rate-note">' + escapeHtml(s.rateNote) + '</div>';
    }
    var hasContent = false;
    if (s.keyNotes && s.keyNotes.length) {
      hasContent = true;
      h += '<div class="sp-keynotes">';
      for (var k = 0; k < s.keyNotes.length; k++) {
        h += '<div class="sp-keynote"><span class="sp-keynote-dot"></span>' + escapeHtml(s.keyNotes[k]) + '</div>';
      }
      h += '</div>';
    }
    if (s.note) {
      hasContent = true;
      h += '<div class="sp-overview-text">' + escapeHtml(s.note) + '</div>';
    }
    if (!hasContent) {
      h += '<p class="sp-empty">No overview available.</p>';
    }
    return h;
  },

  _buildCounties: function (s) {
    var counties = s.counties || [];
    var fullCounties = s.countyData || null;
    var stPlatform = s.auctionPlatform || '';

    // Build rows from available data
    var rows = [];
    if (fullCounties && fullCounties.length > 0) {
      for (var i = 0; i < fullCounties.length; i++) {
        var co = fullCounties[i];
        var auc = co.auction || {};
        rows.push({
          name: co.county || '',
          platform: co.platform || auc.platform || stPlatform
        });
      }
    } else if (counties.length > 0) {
      for (var j = 0; j < counties.length; j++) {
        var c = counties[j];
        rows.push({
          name: typeof c === 'string' ? c : (c.name || c.county || ''),
          platform: (c.platform || stPlatform)
        });
      }
    }

    if (rows.length === 0) {
      return '<p class="sp-empty">County data not available for this state.</p>';
    }

    var h = '';
    if (rows.length > 5) {
      h += '<input type="text" id="sp-county-search" class="sp-county-search" placeholder="Search counties..." autocomplete="off" spellcheck="false">';
    }
    for (var r = 0; r < rows.length; r++) {
      var safeName = escapeHtml(rows[r].name);
      var platHtml = '';
      if (rows[r].platform) {
        platHtml = '<span class="sp-county-plat">' + escapeHtml(typeof shortenPlatform === 'function' ? shortenPlatform(rows[r].platform) : rows[r].platform) + '</span>';
      }
      h += '<div class="sp-county-row" data-name="' + escapeHtml(rows[r].name.toLowerCase()) + '" data-county="' + safeName + '" onclick="event.stopPropagation();StatePanel._openCounty(this.getAttribute(\'data-county\'))">';
      h += '<span class="sp-county-name">' + safeName + '</span>';
      h += '<span class="sp-county-arrow">\u203A</span>';
      h += platHtml;
      h += '</div>';
    }
    return h;
  },

  _buildLaw: function (s, lawData) {
    var h = '';

    // Law data grid
    if (lawData) {
      var lawTypeColors = { lien: '#c9a84c', deed: '#2dd4c0', hybrid: '#bf5fff', redeemable: '#ff6b35', forfeiture: '#ff6b35' };
      var lawTypeColor = lawTypeColors[lawData.auction_type] || '#f5f0e8';

      h += '<div class="sp-law-grid">';
      h += '<div class="sp-law-item"><div class="sp-law-label">AUCTION TYPE</div><div class="sp-law-val" style="color:' + lawTypeColor + '">' + escapeHtml((lawData.auction_type || '\u2014').toUpperCase()) + '</div></div>';
      h += '<div class="sp-law-item"><div class="sp-law-label">INTEREST RATE</div><div class="sp-law-val">' + (lawData.interest_rate_pct ? escapeHtml(String(lawData.interest_rate_pct)) + '%' : 'Varies') + '</div></div>';
      h += '<div class="sp-law-item"><div class="sp-law-label">REDEMPTION</div><div class="sp-law-val">' + (lawData.redemption_period_months ? escapeHtml(String(lawData.redemption_period_months)) + ' months' : 'None') + '</div></div>';
      h += '<div class="sp-law-item"><div class="sp-law-label">BID METHOD</div><div class="sp-law-val">' + escapeHtml(lawData.bid_method || '\u2014') + '</div></div>';
      h += '</div>';

      if (lawData.statute_citation && lawData.official_url) {
        h += '<a href="' + escapeHtml(lawData.official_url) + '" target="_blank" rel="noopener noreferrer" class="sp-statute-link">' + escapeHtml(lawData.statute_citation) + ' \u2197</a>';
      }
    }

    // Legal citation from state data
    if (s.statute || s.officialLink) {
      h += '<div class="sp-legal-cite">';
      if (s.statute) h += '<div class="sp-legal-statute">' + escapeHtml(s.statute) + '</div>';
      if (s.bidMethod) h += '<div class="sp-legal-meta"><strong>Bid method:</strong> ' + escapeHtml(s.bidMethod) + '</div>';
      if (s.auctionPlatformV2) h += '<div class="sp-legal-meta"><strong>Platform:</strong> ' + escapeHtml(s.auctionPlatformV2) + '</div>';
      if (s.auctionTimingV2) h += '<div class="sp-legal-meta"><strong>Timing:</strong> ' + escapeHtml(s.auctionTimingV2) + '</div>';
      if (s.officialLink) h += '<a href="' + escapeHtml(s.officialLink) + '" target="_blank" rel="noopener noreferrer" class="sp-official-link">View Official Statute \u2197</a>';
      h += '</div>';
    }

    // Pending legislation
    if (s.pendingLegislation && s.pendingLegislation.length) {
      h += '<div class="sp-legwatch-title">LEGISLATIVE WATCH</div>';
      for (var p = 0; p < s.pendingLegislation.length; p++) {
        var leg = s.pendingLegislation[p];
        h += '<div class="sp-legwatch-card">';
        h += '<div class="sp-legwatch-bill">' + escapeHtml(leg.bill) + '</div>';
        h += '<div class="sp-legwatch-summary">' + escapeHtml(leg.summary) + '</div>';
        h += '<div class="sp-legwatch-meta">';
        h += '<span><strong>Status:</strong> ' + escapeHtml(leg.status) + '</span>';
        if (leg.effectiveDate) h += '<span><strong>Effective:</strong> ' + escapeHtml(leg.effectiveDate) + '</span>';
        h += '</div></div>';
      }
    }

    // Platform badges
    if (s.auctionPlatformV2) {
      h += '<div class="sp-platforms"><span class="sp-plat-badge"><span class="sp-plat-dot"></span>' + escapeHtml(s.auctionPlatformV2) + '</span></div>';
    }
    if (s.auctionTimingV2) {
      h += '<div class="sp-timing">' + escapeHtml(s.auctionTimingV2) + '</div>';
    }

    // Disclaimer
    h += '<div class="sp-disclaimer">';
    if (!lawData) h += 'Law summary unavailable for this state. ';
    h += 'This information is for educational purposes only and does not constitute legal, financial, or investment advice. Always verify current laws and consult professionals before investing.';
    h += '</div>';

    return h;
  },

  _openCounty: function (countyName) {
    var stateCode = StatePanel._currentStateCode;
    var stateName = StatePanel._currentStateName;
    if (!stateCode || !countyName) return;

    // Build county detail drawer (replaces state panel content)
    var modals = document.getElementById('modals');
    if (!modals) return;

    var h = '';
    h += '<div class="sp-overlay" onclick="StatePanel._closeCounty()">';
    h += '<div class="sp-panel sp-county-detail" onclick="event.stopPropagation()">';
    h += '<div class="sp-drag"></div>';

    // Header with back button
    h += '<div class="sp-header">';
    h += '<div class="sp-header-text">';
    h += '<button class="sp-back" onclick="StatePanel.open(\'' + escapeHtml(stateCode) + '\').then(function(){StatePanel._switchTab(\'counties\')})">\u2190 ' + escapeHtml(stateName) + '</button>';
    h += '<div class="sp-name" style="font-size:28px">' + escapeHtml(countyName) + '</div>';
    h += '<div class="sp-code">' + escapeHtml(stateCode) + '</div>';
    h += '</div>';
    h += '<button class="sp-close" onclick="StatePanel._closeCounty()">\u2715</button>';
    h += '</div>';

    // Score slot
    h += '<div class="sp-content" style="padding:16px 20px">';
    h += '<div id="sp-opp-score-slot" class="sp-county-section"><div class="sp-county-loading"><div class="sp-spinner"></div>Loading Opportunity Score...</div></div>';
    h += '<div id="sp-redemption-slot" class="sp-county-section"><div class="sp-county-loading"><div class="sp-spinner"></div>Loading Redemption Rate...</div></div>';

    // Action buttons — rendered hidden, revealed after 150ms to block ghost clicks
    h += '<div id="sp-county-actions" class="sp-county-actions" style="opacity:0;pointer-events:none">';
    h += '<button class="sp-county-btn sp-county-btn-primary" onclick="event.stopPropagation();StatePanel._viewProperties(\'' + escapeHtml(stateCode) + '\',\'' + escapeHtml(countyName) + '\')">View Properties</button>';
    h += '<button class="sp-county-btn sp-county-btn-ghost" onclick="event.stopPropagation();StatePanel._runScout(\'' + escapeHtml(stateCode) + '\',\'' + escapeHtml(countyName) + '\')">Run Scout</button>';
    h += '</div>';

    h += '<div class="sp-disclaimer">Scores reflect publicly available data and are not investment recommendations.</div>';
    h += '</div>';
    h += '</div>';
    h += '</div>';

    modals.innerHTML = h;

    // Reveal action buttons after delay to prevent ghost click from touch events
    setTimeout(function () {
      var actions = document.getElementById('sp-county-actions');
      if (actions) { actions.style.opacity = '1'; actions.style.pointerEvents = ''; }
    }, 150);

    // Fetch opportunity score
    StatePanel._fetchCountyScore(stateCode, countyName);
    // Fetch redemption rate
    StatePanel._fetchCountyRedemption(stateCode, countyName);
  },

  _closeCounty: function () {
    var m = document.getElementById('modals');
    if (m) m.innerHTML = '';
  },

  _fetchCountyScore: function (stateCode, countyName) {
    var slot = document.getElementById('sp-opp-score-slot');
    if (!slot) return;
    fetch('/.netlify/functions/county-score?state_code=' + encodeURIComponent(stateCode) + '&county=' + encodeURIComponent(countyName))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || data.score === null || data.score === undefined) {
          slot.innerHTML = '<div class="sp-score-pending">Score pending \u2014 check back after next weekly update</div>';
          return;
        }
        var s = data.score;
        var tier, tierClass, barColor;
        if (s >= 80) { tier = 'ELITE'; tierClass = 'sp-tier-elite'; barColor = '#c9a84c'; }
        else if (s >= 60) { tier = 'STRONG'; tierClass = 'sp-tier-strong'; barColor = '#2DD4C0'; }
        else if (s >= 40) { tier = 'MODERATE'; tierClass = 'sp-tier-moderate'; barColor = 'rgba(232,228,220,0.5)'; }
        else if (s >= 20) { tier = 'WEAK'; tierClass = 'sp-tier-weak'; barColor = '#c97a2d'; }
        else { tier = 'CAUTION'; tierClass = 'sp-tier-caution'; barColor = '#FF2D55'; }

        var breakdownHtml = '';
        var sc = data.score_components;
        if (sc) {
          var rows = [];
          if (sc.auction_volume) rows.push({ label: 'Auction Volume', val: sc.auction_volume.count != null ? sc.auction_volume.count + ' auctions' : null, delta: sc.auction_volume.delta });
          if (sc.avg_equity) rows.push({ label: 'Avg Equity', val: sc.avg_equity.avg != null ? sc.avg_equity.avg + '%' : null, delta: sc.avg_equity.delta });
          if (sc.absentee_rate) rows.push({ label: 'Absentee Rate', val: sc.absentee_rate.rate != null ? sc.absentee_rate.rate + '%' : null, delta: sc.absentee_rate.delta });
          if (sc.redemption) rows.push({ label: 'Redemption', val: sc.redemption.months != null ? sc.redemption.months + 'mo' : null, delta: sc.redemption.delta });
          if (sc.overbid) rows.push({ label: 'Overbid', val: sc.overbid.avg != null ? sc.overbid.avg + '%' : null, delta: sc.overbid.delta });
          if (rows.length > 0) {
            breakdownHtml = '<div class="sp-score-breakdown">';
            rows.forEach(function (r) {
              if (r.delta === 0 && r.val === null) return;
              var dColor = r.delta > 0 ? '#3ecf8e' : r.delta < 0 ? '#f87171' : '#9898b0';
              var dSign = r.delta > 0 ? '+' : '';
              breakdownHtml += '<div class="sp-score-row">';
              breakdownHtml += '<span class="sp-score-row-label">' + r.label + (r.val ? ' <span style="color:#6b7280">(' + r.val + ')</span>' : '') + '</span>';
              breakdownHtml += '<span class="sp-score-row-delta" style="color:' + dColor + '">' + dSign + r.delta + '</span>';
              breakdownHtml += '</div>';
            });
            breakdownHtml += '</div>';
          }
        }

        slot.innerHTML = '<div class="sp-score-card">' +
          '<div class="sp-score-header">' +
          '<div class="sp-score-num">' + s + '</div>' +
          '<div class="sp-score-meta">' +
          '<div class="sp-score-label">OPPORTUNITY SCORE</div>' +
          '<div class="sp-score-tier ' + tierClass + '">' + tier + '</div>' +
          '</div></div>' +
          '<div class="sp-score-bar-wrap"><div class="sp-score-bar-fill" style="width:' + s + '%;background:' + barColor + '"></div></div>' +
          breakdownHtml +
          '</div>';
      })
      .catch(function () {
        slot.innerHTML = '<div class="sp-score-pending">Score pending \u2014 check back after next weekly update</div>';
      });
  },

  _fetchCountyRedemption: function (stateCode, countyName) {
    var slot = document.getElementById('sp-redemption-slot');
    if (!slot) return;
    fetch('/.netlify/functions/county-redemption?state_code=' + encodeURIComponent(stateCode) + '&county=' + encodeURIComponent(countyName))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.rate) {
          slot.innerHTML = '<div class="sp-score-pending">Redemption data pending</div>';
          return;
        }
        var rate = data.rate;
        var pct = typeof rate.redemption_rate === 'number' ? Math.round(rate.redemption_rate * 10) / 10 : null;
        var total = rate.total_events || 0;
        var barColor = pct !== null ? (pct >= 70 ? '#3ecf8e' : pct >= 40 ? '#fbbf24' : '#f87171') : '#9898b0';

        var html = '<div class="sp-redemption-card">';
        html += '<div class="sp-score-header">';
        html += '<div class="sp-score-num" style="color:' + barColor + '">' + (pct !== null ? pct + '%' : '\u2014') + '</div>';
        html += '<div class="sp-score-meta"><div class="sp-score-label">REDEMPTION RATE</div>';
        html += '<div style="font-size:11px;color:#9898b0">' + total + ' events tracked</div></div>';
        html += '</div></div>';
        slot.innerHTML = html;
      })
      .catch(function () {
        slot.innerHTML = '<div class="sp-score-pending">Redemption data unavailable</div>';
      });
  },

  _viewProperties: function (stateCode, countyName) {
    StatePanel._closeCounty();
    // Switch to auctions tab and trigger county filter
    if (typeof switchTab === 'function') switchTab('auctions');
    if (typeof loadPropertyFeed === 'function') loadPropertyFeed(stateCode, countyName);
  },

  _runScout: function (stateCode, countyName) {
    StatePanel._closeCounty();
    if (typeof switchTab === 'function') switchTab('tools');
    // Trigger scout with state pre-selected
    setTimeout(function () {
      if (typeof scoutNewDeal === 'function') scoutNewDeal(stateCode);
    }, 300);
  }
};

// ── State Panel CSS (injected once) ──────────────────────────
(function () {
  var style = document.createElement('style');
  style.textContent = [
    /* Overlay */
    '.sp-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:flex-end;justify-content:center}',
    /* Panel */
    '.sp-panel{position:fixed;bottom:0;left:0;right:0;max-width:600px;margin:0 auto;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;background:#0d1220;border-radius:16px 16px 0 0;border-top:1px solid rgba(201,168,76,0.15)}',
    /* Drag handle */
    '.sp-drag{flex-shrink:0;width:40px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;margin:12px auto 14px}',
    /* Header */
    '.sp-header{flex-shrink:0;padding:0 20px;position:relative;display:flex;align-items:flex-start;justify-content:space-between}',
    '.sp-header-text{flex:1;min-width:0}',
    '.sp-code{font-family:"Space Mono",monospace;font-size:10px;color:#60607a;letter-spacing:0.1em;margin-bottom:2px}',
    '.sp-name{font-family:"Bebas Neue",sans-serif;font-size:36px;letter-spacing:0.06em;color:#f5f0e8;line-height:1;margin-bottom:6px}',
    '.sp-type-badge{font-family:"Space Mono",monospace;font-size:9px;border:1px solid;border-radius:3px;padding:3px 8px;display:inline-block}',
    '.sp-close{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.06);border:none;color:#60607a;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:4px}',
    '.sp-close:hover{background:rgba(255,255,255,0.12);color:#f5f0e8}',
    /* Stat row */
    '.sp-stats{flex-shrink:0;padding:14px 20px 0;display:flex;gap:8px}',
    '.sp-pill{flex:1;background:rgba(255,255,255,0.03);border:1px solid rgba(201,168,76,0.15);border-radius:8px;padding:10px 8px;text-align:center}',
    '.sp-pill-label{font-family:"Space Mono",monospace;font-size:8px;color:#60607a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px}',
    '.sp-pill-value{font-family:"Bebas Neue",sans-serif;font-size:20px;color:#e8c96a}',
    /* Tab bar */
    '.sp-tabs{flex-shrink:0;display:flex;border-bottom:1px solid rgba(255,255,255,0.06);margin-top:14px}',
    '.sp-tab{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#60607a;padding:10px;flex:1;text-align:center;border-bottom:2px solid transparent;cursor:pointer;transition:color 0.15s,border-color 0.15s}',
    '.sp-tab:hover{color:#9898b0}',
    '.sp-tab.active{color:#c9a84c;border-bottom-color:#c9a84c}',
    /* Tab content */
    '.sp-content{flex:1;overflow-y:auto;min-height:0;-webkit-overflow-scrolling:touch}',
    '.sp-tab-body{display:none;padding:16px 20px}',
    '.sp-tab-body.active{display:block}',
    '.sp-empty{color:#60607a;font-size:13px}',
    /* Overview tab */
    '.sp-alert{background:rgba(224,85,85,0.12);border:1px solid #e05555;border-radius:8px;padding:12px 14px;font-size:13px;color:#e05555;line-height:1.6;margin-bottom:14px}',
    '.sp-rate-note{font-style:italic;font-size:12px;color:rgba(245,240,232,0.6);margin-bottom:14px;line-height:1.5}',
    '.sp-keynotes{margin-bottom:12px}',
    '.sp-keynote{position:relative;padding:8px 0 8px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:rgba(245,240,232,0.7);line-height:1.5}',
    '.sp-keynote-dot{position:absolute;left:0;top:14px;width:4px;height:4px;border-radius:50%;background:#c9a84c}',
    '.sp-overview-text{font-size:13px;color:rgba(245,240,232,0.7);line-height:1.6;margin-top:12px}',
    /* Counties tab */
    '.sp-county-search{width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:8px 12px;color:#f5f0e8;font-size:12px;margin-bottom:12px;outline:none;font-family:inherit;box-sizing:border-box}',
    '.sp-county-search:focus{border-color:rgba(201,168,76,0.3)}',
    '.sp-county-row{display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:background 0.15s}',
    '.sp-county-row:hover{background:rgba(255,255,255,0.04)}',
    '.sp-county-row:active{background:rgba(201,168,76,0.08)}',
    '.sp-county-name{font-size:13px;font-weight:500;color:#f5f0e8;flex:1}',
    '.sp-county-arrow{color:#60607a;font-size:16px;flex-shrink:0;transition:color 0.15s}',
    '.sp-county-row:hover .sp-county-arrow{color:#c9a84c}',
    '.sp-county-plat{font-family:"Space Mono",monospace;font-size:8px;padding:2px 6px;border-radius:2px;border:1px solid rgba(45,212,192,0.4);color:#2dd4c0}',
    /* Law & Links tab */
    '.sp-law-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}',
    '.sp-law-item{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:10px}',
    '.sp-law-label{font-family:"Space Mono",monospace;font-size:8px;color:#60607a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px}',
    '.sp-law-val{font-size:13px;font-weight:600;color:#f5f0e8}',
    '.sp-statute-link{display:block;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.15);border-radius:6px;padding:10px 12px;font-family:"Space Mono",monospace;font-size:10px;color:#c9a84c;text-decoration:none;margin-bottom:12px;cursor:pointer}',
    '.sp-statute-link:hover{background:rgba(201,168,76,0.15)}',
    '.sp-legal-cite{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:12px 14px;margin-bottom:12px}',
    '.sp-legal-statute{font-size:13px;color:#f5f0e8;font-weight:600;font-family:"Space Mono",monospace;margin-bottom:6px}',
    '.sp-legal-meta{font-size:12px;color:rgba(245,240,232,0.6);margin-bottom:4px}',
    '.sp-official-link{font-size:12px;color:#c9a84c;text-decoration:underline;display:inline-block;margin-top:4px}',
    '.sp-legwatch-title{font-family:"Space Mono",monospace;font-size:10px;color:#c9a84c;letter-spacing:0.12em;margin:12px 0 8px;text-transform:uppercase}',
    '.sp-legwatch-card{background:rgba(200,168,75,0.08);border:1px solid rgba(200,168,75,0.3);border-radius:8px;padding:12px 14px;margin-bottom:8px}',
    '.sp-legwatch-bill{font-size:13px;font-weight:700;color:#c9a84c;margin-bottom:4px}',
    '.sp-legwatch-summary{font-size:12px;color:rgba(245,240,232,0.6);line-height:1.5;margin-bottom:6px}',
    '.sp-legwatch-meta{display:flex;gap:12px;font-size:11px;color:#60607a}',
    '.sp-platforms{margin-top:12px;display:flex;flex-wrap:wrap;gap:6px}',
    '.sp-plat-badge{font-family:"Space Mono",monospace;font-size:9px;border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:6px 12px;color:#f5f0e8;display:inline-flex;align-items:center;gap:6px}',
    '.sp-plat-dot{width:4px;height:4px;border-radius:50%;background:#c9a84c}',
    '.sp-timing{font-size:11px;color:#60607a;margin-top:6px}',
    '.sp-disclaimer{margin-top:16px;padding:12px;background:rgba(255,255,255,0.02);border-radius:6px;font-size:11px;color:#60607a;line-height:1.6}',
    /* Back button */
    '.sp-back{background:none;border:none;color:#c9a84c;font-family:"Space Mono",monospace;font-size:11px;cursor:pointer;padding:0;margin-bottom:6px;display:inline-block;letter-spacing:0.05em}',
    '.sp-back:hover{text-decoration:underline}',
    /* County detail sections */
    '.sp-county-section{margin-bottom:16px}',
    '.sp-county-loading{display:flex;align-items:center;gap:10px;padding:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;font-size:12px;color:#60607a}',
    '.sp-spinner{width:16px;height:16px;border:2px solid rgba(201,168,76,0.2);border-top-color:#c9a84c;border-radius:50%;animation:sp-spin 0.8s linear infinite}',
    '@keyframes sp-spin{to{transform:rotate(360deg)}}',
    /* Score card */
    '.sp-score-card{background:rgba(255,255,255,0.03);border:1px solid rgba(201,168,76,0.15);border-radius:8px;padding:16px}',
    '.sp-score-header{display:flex;align-items:center;gap:14px}',
    '.sp-score-num{font-family:"Bebas Neue",sans-serif;font-size:48px;color:#c9a84c;line-height:1}',
    '.sp-score-meta{flex:1}',
    '.sp-score-label{font-family:"Space Mono",monospace;font-size:9px;color:#60607a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px}',
    '.sp-score-tier{font-family:"Bebas Neue",sans-serif;font-size:16px;letter-spacing:0.08em}',
    '.sp-tier-elite{color:#c9a84c}',
    '.sp-tier-strong{color:#2DD4C0}',
    '.sp-tier-moderate{color:rgba(232,228,220,0.5)}',
    '.sp-tier-weak{color:#c97a2d}',
    '.sp-tier-caution{color:#FF2D55}',
    '.sp-score-bar-wrap{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-top:12px;overflow:hidden}',
    '.sp-score-bar-fill{height:100%;border-radius:2px;transition:width 0.6s ease}',
    '.sp-score-breakdown{margin-top:12px;padding:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px}',
    '.sp-score-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-family:"Space Mono",monospace;font-size:10px}',
    '.sp-score-row-label{color:#9898b0}',
    '.sp-score-row-delta{font-weight:600}',
    '.sp-score-pending{padding:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;font-size:12px;color:#60607a;text-align:center}',
    /* Redemption card */
    '.sp-redemption-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:16px}',
    /* Action buttons */
    '.sp-county-actions{display:flex;gap:8px;margin-top:16px}',
    '.sp-county-btn{flex:1;padding:12px;border-radius:8px;font-family:"Bebas Neue",sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;text-align:center;border:none;transition:background 0.15s}',
    '.sp-county-btn-primary{background:#c9a84c;color:#0d0d0d}',
    '.sp-county-btn-primary:hover{background:#d4b85c}',
    '.sp-county-btn-ghost{background:rgba(255,255,255,0.04);border:1px solid rgba(201,168,76,0.25);color:#c9a84c}',
    '.sp-county-btn-ghost:hover{background:rgba(201,168,76,0.1)}'
  ].join('\n');
  document.head.appendChild(style);
})();
