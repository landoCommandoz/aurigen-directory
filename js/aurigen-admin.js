// === ADMIN MODE (email-whitelisted) ===
(function() {
  var SEQ = 'aurigen';
  var buf = '';
  var badge = null;

  function getEmail() {
    try { return (localStorage.getItem('aurigen_email') || '').toLowerCase().trim(); } catch(e) { return ''; }
  }

  function isWhitelisted() {
    return ADMIN_WHITELIST.indexOf(getEmail()) >= 0;
  }

  function adminOn() {
    if (!isWhitelisted()) { console.warn('[admin] Not authorized'); return; }
    try { localStorage.setItem('aurigen_admin', 'on'); } catch(e) {}
    IS_PAID = true;
    IS_FREE = true;
    APP.tier = 2;
    applyAccessLocks();
    showBadge();
  }

  function adminOff() {
    try { localStorage.removeItem('aurigen_admin'); } catch(e) {}
    var real = (function() { try { return localStorage.getItem('aurigen_access') || 'none'; } catch(e) { return 'none'; } })();
    IS_PAID = real === 'paid';
    IS_FREE = real === 'free' || IS_PAID;
    APP.tier = IS_PAID ? 2 : 1;
    applyAccessLocks();
    removeBadge();
  }

  function toggleAdmin() {
    if (isAdminMode()) adminOff(); else adminOn();
  }

  function showBadge() {
    if (badge) return;
    badge = document.createElement('div');
    badge.id = 'admin-badge';
    badge.style.cssText = 'position:fixed;top:8px;left:8px;z-index:99999;font-family:"Space Mono",monospace;font-size:9px;letter-spacing:0.1em;color:#C9A84C;background:rgba(6,6,10,0.85);border:1px solid rgba(201,168,76,0.3);padding:4px 10px;border-radius:4px;pointer-events:none;user-select:none';
    badge.textContent = 'ADMIN \u2014 PAID VIEW';
    document.body.appendChild(badge);
  }

  function removeBadge() {
    if (badge) { badge.remove(); badge = null; }
  }

  // Admin triggers removed — admin mode only via server-validated JWT with admin claim
  // No keyboard sequence, no tap counter, no client-side restore
})();

// === 3B: MOBILE FILTER DRAWER ===
(function() {
  function showFab() {
    var fab = document.getElementById('mobile-filter-fab');
    if (!fab) return;
    // Show FAB only on mobile when property feed is active
    var isPropActive = document.getElementById('panel-properties') && document.getElementById('panel-properties').classList.contains('active');
    var isAuctionsActive = APP.activeTab === 'auctions';
    var isMobile = window.innerWidth <= 600;
    fab.style.display = (isMobile && (isPropActive || isAuctionsActive)) ? 'flex' : 'none';
    // Update count badge on FAB
    var f = isPropActive ? _propFeedFilters : _auctionsInvFilters;
    var count = countActiveFilters(f);
    fab.textContent = count > 0 ? '\u2630 FILTERS (' + count + ')' : '\u2630 FILTERS';
  }

  window.openMobileFilterSheet = function() {
    var overlay = document.getElementById('mobile-filter-overlay');
    var sheet = document.getElementById('mobile-filter-sheet');
    var body = document.getElementById('mobile-filter-sheet-body');
    if (!overlay || !sheet || !body) return;
    // Determine which filter context
    var isPropActive = document.getElementById('panel-properties') && document.getElementById('panel-properties').classList.contains('active');
    var f = isPropActive ? _propFeedFilters : _auctionsInvFilters;
    var prefix = isPropActive ? 'prop' : 'auctInv';
    var html = '';
    // Type
    html += '<div class="mobile-filter-section"><div class="mobile-filter-section-label">PROPERTY TYPE</div><div class="mobile-filter-chips">';
    [['all','All Types'],['residential','Residential'],['commercial','Commercial'],['vacant','Vacant Land']].forEach(function(t) {
      html += '<button class="propfeed-filter-btn' + (f.type === t[0] ? ' active' : '') + '" onclick="mobileFilterSet(\'' + prefix + '\',\'type\',\'' + t[0] + '\')">' + t[1] + '</button>';
    });
    html += '</div></div>';
    // Status
    html += '<div class="mobile-filter-section"><div class="mobile-filter-section-label">STATUS</div><div class="mobile-filter-chips">';
    var statuses = isPropActive ? [['all','All'],['active','Active'],['redeemed','Redeemed'],['struck','Struck Off']] : [['all','All'],['active','Active'],['redeemed','Redeemed']];
    statuses.forEach(function(s) {
      html += '<button class="propfeed-filter-btn' + (f.status === s[0] ? ' active' : '') + '" onclick="mobileFilterSet(\'' + prefix + '\',\'status\',\'' + s[0] + '\')">' + s[1] + '</button>';
    });
    html += '</div></div>';
    // Absentee
    html += '<div class="mobile-filter-section"><div class="mobile-filter-section-label">OWNER</div><div class="mobile-filter-chips">';
    html += '<button class="propfeed-filter-toggle' + (f.absentee ? ' active' : '') + '" onclick="mobileFilterSet(\'' + prefix + '\',\'absentee\')">Absentee Owner</button>';
    html += '</div></div>';
    // Equity
    html += '<div class="mobile-filter-section"><div class="mobile-filter-section-label">EQUITY CUSHION</div><div class="mobile-filter-chips">';
    var eqs = isPropActive ? [[0,'Any'],[100,'100%+'],[200,'200%+'],[300,'300%+']] : [[0,'Any'],[100,'100%+'],[200,'200%+']];
    eqs.forEach(function(e) {
      html += '<button class="propfeed-filter-btn' + (f.equity === e[0] ? ' active' : '') + '" onclick="mobileFilterSet(\'' + prefix + '\',\'equity\',' + e[0] + ')">' + e[1] + '</button>';
    });
    html += '</div></div>';
    body.innerHTML = html;
    overlay.classList.add('open');
    requestAnimationFrame(function() { sheet.classList.add('open'); });
  };

  window.closeMobileFilterSheet = function() {
    var overlay = document.getElementById('mobile-filter-overlay');
    var sheet = document.getElementById('mobile-filter-sheet');
    if (sheet) sheet.classList.remove('open');
    setTimeout(function() { if (overlay) overlay.classList.remove('open'); }, 300);
    showFab();
  };

  window.mobileFilterSet = function(prefix, key, val) {
    var f = prefix === 'prop' ? _propFeedFilters : _auctionsInvFilters;
    if (key === 'absentee') { f.absentee = !f.absentee; }
    else if (key === 'equity') { f.equity = val; }
    else { f[key] = val; }
    // Re-render the mobile sheet to show updated active states
    openMobileFilterSheet();
    // Apply filters to the underlying list
    if (prefix === 'prop') {
      applyPropFilters();
    } else {
      var filtersEl = document.getElementById('auctions-inv-filters');
      if (filtersEl) filtersEl.innerHTML = buildAuctionsInvFilterBtns();
      var body = document.getElementById('auctions-inv-body');
      var county = document.getElementById('auctions-inv-county').value;
      if (body) renderAuctionsInvCards(body, county);
    }
  };

  window.resetMobileFilters = function() {
    var isPropActive = document.getElementById('panel-properties') && document.getElementById('panel-properties').classList.contains('active');
    if (isPropActive) {
      _propFeedFilters = { type:'all', status:'all', absentee:false, equity:0 };
      applyPropFilters();
    } else {
      _auctionsInvFilters = { type:'all', status:'all', absentee:false, equity:0 };
      auctionsInvFilter('type','all');
    }
    openMobileFilterSheet();
  };

  // Show/hide FAB on tab switch and resize
  var origSwitch = window.switchTab;
  if (origSwitch) {
    window.switchTab = function(name) {
      origSwitch(name);
      setTimeout(showFab, 50);
    };
  }
  window.addEventListener('resize', showFab);
  setTimeout(showFab, 500);
})();

// === 4C: MAP OPPORTUNITY SCORE OVERLAY ===
var _scoreOverlayActive = false;
var _stateScoreCache = null;

function toggleScoreOverlay() {
  var btn = document.getElementById('score-overlay-toggle');
  _scoreOverlayActive = !_scoreOverlayActive;
  if (btn) {
    btn.classList.toggle('active', _scoreOverlayActive);
    btn.textContent = _scoreOverlayActive ? 'HIDE OPPORTUNITY SCORES' : 'SHOW OPPORTUNITY SCORES';
  }
  if (_scoreOverlayActive) {
    loadAndApplyScoreOverlay();
  } else {
    resetScoreOverlay();
  }
}

function loadAndApplyScoreOverlay() {
  if (_stateScoreCache) {
    applyScoreColors(_stateScoreCache);
    return;
  }
  // Fetch all scores and compute state-level averages
  fetch('/.netlify/functions/county-score?state_code=ALL&county=ALL')
    .then(function(r) { return r.json(); })
    .catch(function() { return { score: null }; })
    .then(function() {
      // county-score endpoint is per-county only — fall back to computing from known states
      // Fetch scores for all states we know about
      var states = typeof STATES_EN !== 'undefined' ? STATES_EN : [];
      var avgScores = {};
      var pending = states.length;
      if (pending === 0) return;

      states.forEach(function(s) {
        var counties = s.counties || [];
        if (counties.length === 0) {
          pending--;
          if (pending === 0) { _stateScoreCache = avgScores; applyScoreColors(avgScores); }
          return;
        }
        // Sample up to 3 counties per state for performance
        var sample = counties.slice(0, 3);
        var scores = [];
        var subPending = sample.length;

        sample.forEach(function(county) {
          var cName = typeof county === 'string' ? county : (county.county || county.name || '');
          if (!cName) { subPending--; check(); return; }
          fetch('/.netlify/functions/county-score?state_code=' + encodeURIComponent(s.id) + '&county=' + encodeURIComponent(cName))
            .then(function(r) { return r.json(); })
            .then(function(d) { if (d && d.score !== null) scores.push(d.score); })
            .catch(function() {})
            .finally(function() { subPending--; check(); });
        });

        function check() {
          if (subPending > 0) return;
          if (scores.length > 0) {
            avgScores[s.id] = Math.round(scores.reduce(function(a, b) { return a + b; }, 0) / scores.length);
          }
          pending--;
          if (pending === 0) { _stateScoreCache = avgScores; applyScoreColors(avgScores); }
        }
      });
    });
}

function applyScoreColors(avgScores) {
  var svg = d3.select('#map-svg');
  svg.selectAll('.state-path').each(function() {
    var el = d3.select(this);
    var stCode = el.attr('data-id');
    var avg = avgScores[stCode];
    if (avg !== undefined) {
      var color;
      if (avg >= 80) color = '#e8c96a';
      else if (avg >= 60) color = '#2dd4c0';
      else if (avg >= 40) color = '#9898b0';
      else if (avg >= 20) color = '#c97a2d';
      else color = '#c94c4c';
      el.attr('fill', color).attr('fill-opacity', 0.6);
    }
  });
  // Update labels with score
  svg.selectAll('.state-label').each(function() {
    var el = d3.select(this);
    var stCode = el.text();
    var avg = avgScores[stCode];
    if (avg !== undefined) {
      el.append('tspan').attr('x', el.attr('x')).attr('dy', '1.2em')
        .style('font-size', '7px').style('fill', 'rgba(232,228,220,0.5)').text(avg);
    }
  });
}

function resetScoreOverlay() {
  // Restore default map colors
  if (typeof resetMapColors === 'function') resetMapColors();
  // Remove score tspans from labels
  d3.selectAll('.state-label tspan').remove();
}

// === 4C: SUCCESS PAGE ENHANCED TOAST + TAB GLOW ===
// The existing playUnlockAnimation already handles toast + glow.
// Enhance: also switch to account tab after animation.
(function() {
  var origUnlock = window.playUnlockAnimation;
  if (origUnlock) {
    window.playUnlockAnimation = function() {
      origUnlock();
      // After toast dismisses, switch to account tab to show upgraded status
      setTimeout(function() {
        if (typeof switchTab === 'function') switchTab('account');
      }, 3500);
    };
  }
})();
