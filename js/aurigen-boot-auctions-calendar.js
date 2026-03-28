// === AUCTIONS TAB ===
var _auctionsFilters = { search: '', types: [], platforms: [], month: null };
var _interstitialUrl = '';

function initAuctionsTab() {
  if (!window.AUCTION_ENTRIES || !window.AUCTION_META) return;
  var meta = window.AUCTION_META;

  // Build type checkboxes
  var typeHtml = '';
  var typeLabels = { lien: 'Lien', deed: 'Deed', redeemable: 'Redeemable', hybrid: 'Hybrid', forfeiture: 'Forfeiture' };
  Object.keys(meta.types).forEach(function(t) {
    typeHtml += '<label class="auctions-cb-row"><input type="checkbox" value="' + escapeHtml(t) + '" onchange="updateAuctionTypeFilter()">' +
      escapeHtml(typeLabels[t] || t) + '<span class="auctions-cb-count">' + meta.types[t] + '</span></label>';
  });
  var typeEl = document.getElementById('auctions-type-filters');
  if (typeEl) typeEl.innerHTML = typeHtml;

  // Build platform checkboxes (top 10 by count)
  var platArr = Object.keys(meta.platforms).sort(function(a,b){ return meta.platforms[b] - meta.platforms[a]; }).slice(0, 10);
  var platHtml = '';
  platArr.forEach(function(p) {
    platHtml += '<label class="auctions-cb-row"><input type="checkbox" value="' + escapeHtml(p) + '" onchange="updateAuctionPlatformFilter()">' +
      escapeHtml(p) + '<span class="auctions-cb-count">' + meta.platforms[p] + '</span></label>';
  });
  var platEl = document.getElementById('auctions-platform-filters');
  if (platEl) platEl.innerHTML = platHtml;

  // Build month list
  var monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var monthHtml = '<div class="auctions-month-row active" onclick="setAuctionMonth(null)">All months<span class="auctions-month-count">' + meta.total + '</span></div>';
  monthOrder.forEach(function(m) {
    if (meta.monthCounts[m]) {
      monthHtml += '<div class="auctions-month-row" onclick="setAuctionMonth(\'' + m + '\')">' + m +
        '<span class="auctions-month-count">' + meta.monthCounts[m] + '</span></div>';
    }
  });
  var monthEl = document.getElementById('auctions-month-filters');
  if (monthEl) monthEl.innerHTML = monthHtml;

  // Auto-enable DNA filter if user has a DNA profile
  if (calGetDnaStates()) _calDnaOnly = true;

  renderAuctions();
}

function updateAuctionTypeFilter() {
  var checks = document.querySelectorAll('#auctions-type-filters input:checked');
  _auctionsFilters.types = [];
  checks.forEach(function(c) { _auctionsFilters.types.push(c.value); });
  renderAuctions();
}

function updateAuctionPlatformFilter() {
  var checks = document.querySelectorAll('#auctions-platform-filters input:checked');
  _auctionsFilters.platforms = [];
  checks.forEach(function(c) { _auctionsFilters.platforms.push(c.value); });
  renderAuctions();
}

function setAuctionMonth(m) {
  _auctionsFilters.month = m;
  var rows = document.querySelectorAll('#auctions-month-filters .auctions-month-row');
  rows.forEach(function(r) { r.classList.remove('active'); });
  if (!m) { rows[0].classList.add('active'); }
  else {
    rows.forEach(function(r) { if (r.textContent.trim().indexOf(m) === 0) r.classList.add('active'); });
  }
  renderAuctions();
}

// Debounce helper
var _auctionsSearchTimer = null;
function filterAuctions() {
  clearTimeout(_auctionsSearchTimer);
  _auctionsSearchTimer = setTimeout(function() {
    var el = document.getElementById('auctions-search');
    _auctionsFilters.search = el ? el.value.trim().toLowerCase() : '';
    renderAuctions();
  }, 150);
}

// Calendar state
var _auctionsFiltered = [];
var _calYear = new Date().getFullYear();
var _calMonth = new Date().getMonth(); // 0-indexed
var _calDnaOnly = false;
var _calSelectedDate = null;
var _calMonthNames = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
var _calMonthNamesFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var _calDow = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

var TYPE_LABELS_SHORT = { lien: 'LIEN', deed: 'DEED', redeemable: 'RDBL', hybrid: 'HYBRID', forfeiture: 'FORFEIT' };
// Build HTML for a single auction card
function buildCardHtml(e, animate) {
  var dateBlock;
  if (e.date && e.date.confirmed && e.date.day > 0) {
    dateBlock = '<div class="auction-date-block">' +
      '<span class="auction-date-month">' + escapeHtml(e.date.month.substring(0,3)) + '</span>' +
      '<span class="auction-date-day">' + e.date.day + '</span></div>';
  } else if (e.date) {
    dateBlock = '<div class="auction-date-block">' +
      '<span class="auction-date-est">' + escapeHtml(e.date.display) + '</span></div>';
  } else {
    dateBlock = '<div class="auction-date-block"><span class="auction-date-est">TBD</span></div>';
  }

  var typePill = '<span class="auction-pill type-' + escapeHtml(e.type) + '">' + escapeHtml(TYPE_LABELS_SHORT[e.type] || e.type) + '</span>';

  var platPill = '';
  if (e.platform && e.platform !== 'Unknown') {
    var platSafe = escapeHtml(e.platform);
    if (e.platformUrl && /^https?:\/\//i.test(e.platformUrl)) {
      platPill = '<span class="auction-pill platform auction-interstitial-trigger" data-url="' + escapeHtml(e.platformUrl) + '" title="Visit ' + platSafe + '" style="cursor:pointer">' + platSafe + ' &#8599;</span>';
    } else {
      platPill = '<span class="auction-pill platform">' + platSafe + '</span>';
    }
  }

  var ratePill = e.rate ? '<span class="auction-pill rate">' + escapeHtml(e.rate) + '</span>' : '';
  var alertBadge = e.alert ? '<span class="auction-alert-badge">&#9888; ' + escapeHtml(e.alert) + '</span>' : '';
  var noteHtml = e.note ? '<div class="auction-card-note">' + escapeHtml(e.note) + '</div>' : '';

  var registerUrl = e.platformUrl && /^https?:\/\//i.test(e.platformUrl) ? e.platformUrl : '';
  var registerBtn = registerUrl ?
    '<button class="auction-btn-register auction-interstitial-trigger" data-url="' + escapeHtml(registerUrl) + '">Register &#8594;</button>' :
    '<button class="auction-btn-register" disabled style="opacity:0.3;cursor:default">Register &#8594;</button>';

  return '<div class="auction-card' + (animate ? ' animate-in' : '') + '">' +
    dateBlock +
    '<div class="auction-card-body">' +
      '<div class="auction-card-title">' + escapeHtml(e.stateName) + (e.county !== 'Statewide' ? ' &mdash; ' + escapeHtml(e.county) + ' County' : ' &mdash; Statewide') + '</div>' +
      '<div class="auction-card-pills">' + typePill + platPill + ratePill + '</div>' +
      alertBadge + noteHtml +
    '</div>' +
    '<div class="auction-card-actions">' + registerBtn + '</div>' +
  '</div>';
}

// Get DNA top state codes (returns array or null)
function calGetDnaStates() {
  if (typeof profileTopStateCodes === 'function') {
    var codes = profileTopStateCodes();
    if (codes && codes.length > 0) return codes.slice(0, 3);
  }
  return null;
}

// Apply all filters (sidebar + DNA) and return filtered entries
function calFilterEntries() {
  var entries = window.AUCTION_ENTRIES || [];
  var f = _auctionsFilters;
  var dnaCodes = _calDnaOnly ? calGetDnaStates() : null;

  return entries.filter(function(e) {
    // DNA state filter
    if (dnaCodes && dnaCodes.indexOf(e.stateCode) === -1) return false;
    // Sidebar filters
    if (f.search) {
      var q = f.search;
      var hay = (e.stateName + ' ' + e.stateCode + ' ' + e.county + ' ' + e.platform).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    if (f.types.length > 0 && f.types.indexOf(e.type) === -1) return false;
    if (f.platforms.length > 0 && f.platforms.indexOf(e.platform) === -1) return false;
    return true;
  });
}

// Group entries by ISO date key (YYYY-MM-DD) for a given month
function calGroupByDay(entries, year, month) {
  var map = {};
  entries.forEach(function(e) {
    if (!e.date || !e.date.year || e.date.day <= 0) return;
    var mi = _calMonthNamesFull.indexOf(e.date.month);
    if (mi === -1) {
      // Try 3-letter match
      for (var k = 0; k < _calMonthNamesFull.length; k++) {
        if (_calMonthNamesFull[k].substring(0,3).toLowerCase() === e.date.month.substring(0,3).toLowerCase()) { mi = k; break; }
      }
    }
    if (mi === month && e.date.year === year) {
      var key = year + '-' + String(mi + 1).padStart(2, '0') + '-' + String(e.date.day).padStart(2, '0');
      if (!map[key]) map[key] = [];
      map[key].push(e);
    }
  });
  return map;
}

// Get quarter label for a date entry
function calGetQuarter(e) {
  if (!e.date || !e.date.year) return null;
  var mi = _calMonthNamesFull.indexOf(e.date.month);
  if (mi === -1) {
    for (var k = 0; k < _calMonthNamesFull.length; k++) {
      if (_calMonthNamesFull[k].substring(0,3).toLowerCase() === e.date.month.substring(0,3).toLowerCase()) { mi = k; break; }
    }
  }
  if (mi === -1) return null;
  var q = Math.floor(mi / 3) + 1;
  return 'Q' + q + ' ' + e.date.year;
}

// Toggle DNA-only filter
function toggleAuctionsDna() {
  _calDnaOnly = !_calDnaOnly;
  var tog = document.getElementById('auctions-dna-toggle');
  if (tog) tog.classList.toggle('active', _calDnaOnly);
  var label = document.getElementById('auctions-dna-label');
  if (label) label.textContent = _calDnaOnly ? 'MY STATES' : 'ALL STATES';
  renderAuctions();
}

// Navigate calendar month
function navigateCalMonth(delta) {
  _calMonth += delta;
  if (_calMonth > 11) { _calMonth = 0; _calYear++; }
  if (_calMonth < 0) { _calMonth = 11; _calYear--; }
  renderAuctions();
}

// Open day detail drawer
function openDayDrawer(dateKey) {
  _calSelectedDate = dateKey;
  var filtered = calFilterEntries();
  var dayMap = calGroupByDay(filtered, _calYear, _calMonth);
  var dayEntries = dayMap[dateKey] || [];

  // Update header
  var parts = dateKey.split('-');
  var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  var dateEl = document.getElementById('day-drawer-date');
  if (dateEl) dateEl.textContent = _calMonthNamesFull[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  var countEl = document.getElementById('day-drawer-count');
  if (countEl) countEl.textContent = dayEntries.length + ' auction' + (dayEntries.length !== 1 ? 's' : '');

  // Render cards
  var container = document.getElementById('day-drawer-cards');
  if (container) {
    var html = '';
    dayEntries.forEach(function(e) { html += buildCardHtml(e, true); });
    container.innerHTML = html || '<div class="auctions-empty">No auctions on this date.</div>';
  }

  // Highlight selected cell
  document.querySelectorAll('.auctions-cal-cell.selected').forEach(function(c) { c.classList.remove('selected'); });
  var cell = document.querySelector('.auctions-cal-cell[data-date="' + dateKey + '"]');
  if (cell) cell.classList.add('selected');

  // Open drawer
  var overlay = document.getElementById('auctions-day-overlay');
  var drawer = document.getElementById('auctions-day-drawer');
  if (overlay) overlay.classList.add('open');
  if (drawer) drawer.classList.add('open');
}

// Close day detail drawer
function closeDayDrawer() {
  _calSelectedDate = null;
  document.querySelectorAll('.auctions-cal-cell.selected').forEach(function(c) { c.classList.remove('selected'); });
  var overlay = document.getElementById('auctions-day-overlay');
  var drawer = document.getElementById('auctions-day-drawer');
  if (overlay) overlay.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
}

// Toggle quarterly accordion
function toggleQuarter(el) {
  el.closest('.auctions-quarter').classList.toggle('open');
}

