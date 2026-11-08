// Platbook client script: search, filters, county drawer, language toggle, debug panel.
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function isUrl(s) { return typeof s === 'string' && /^https?:\/\/[^\s"'<>]+$/.test(s); }
  // Labels for the county drawer. Without the map the raw data keys reached the page as
  // labels: "Url", "Otc", "Deed Auction", and - because the old rule put no space before a
  // run of digits - "Sale Date2026" and "Tax Sale Date2026", which read as typos. Keys not
  // listed fall through to the generic rule, which now also splits letters from digits and
  // upper-cases known initialisms. The map never changes a value, only the word before it.
  var LABEL = {
    url: 'Website', saleUrl: 'Website', otcUrl: 'Website', registryUrl: 'Registry',
    platform: 'Platform', note: 'Note', otcNote: 'Note', delinquencyNote: 'Note',
    statute: 'Statute', name: 'Name', fee: 'Fee', assignmentFee: 'Assignment fee',
    rate: 'Interest / penalty', period: 'Redemption period', premium: 'Premium',
    available: 'Available', availableWhen: 'Available', process: 'How it works',
    method: 'Bidding method', bidMethod: 'Bidding method', minBid: 'Minimum bid',
    frequency: 'How often', saleFrequency: 'How often', trigger: 'Applies when',
    saleMonth: 'Sale month', saleWindow: 'Sale window', saleDate: 'Sale date',
    saleDate2026: '2026 sale date', taxSaleDate2026: '2026 tax sale',
    resaleDate2026: '2026 resale', certIssuanceDate: 'Certificate issued',
    auction: 'Auction', deedAuction: 'Tax deed sale', otc: 'Over the counter',
    municipalities: 'Municipalities', saleAdministrator: 'Run by',
    countyClerk: 'County clerk', taxCodeAuth: 'Tax code',
    titleRecording: 'Title recording', transferTax: 'Transfer tax',
    surplusMCC: 'Surplus funds', subTax: 'Subsequent taxes',
    scavenger: 'Scavenger sale', payment: 'Payment', redemption: 'Redemption'
  };
  var ACRO = { otc: 'OTC', mcc: 'MCC', url: 'URL', llc: 'LLC' };
  // Reading order inside a county block. The data files list the website first, so a block
  // opened with "Website: lienhub.com/county/martin" before saying what LienHub is. Keys not
  // listed keep the order they were written in, after the ones that are.
  var ORDER = ['name', 'platform', 'available', 'availableWhen', 'process', 'method', 'bidMethod',
    'minBid', 'rate', 'period', 'premium', 'statute', 'fee', 'assignmentFee', 'frequency',
    'saleFrequency', 'saleMonth', 'saleWindow', 'saleDate', 'saleDate2026', 'taxSaleDate2026',
    'resaleDate2026', 'certIssuanceDate', 'note', 'url', 'saleUrl', 'otcUrl', 'registryUrl'];
  function ordered(keys) {
    return keys.map(function (k, i) {
      var at = ORDER.indexOf(k);
      return { k: k, at: at === -1 ? ORDER.length + i : at };
    }).sort(function (a, b) { return a.at - b.at; }).map(function (x) { return x.k; });
  }
  function human(k) {
    if (LABEL[k]) return LABEL[k];
    return String(k).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Za-z])([0-9])/g, '$1 $2')
      .split(' ')
      .map(function (w, i) { return ACRO[w.toLowerCase()] || (i ? w : w.charAt(0).toUpperCase() + w.slice(1)); })
      .join(' ');
  }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  // ----- home: sale type chips -----
  var cards = $$('#cards .card');
  $$('.chip').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      $$('.chip').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      cards.forEach(function (c) { c.hidden = f !== 'all' && c.getAttribute('data-type') !== f; });
      $$('.map a[data-type] path').forEach(function (p) { p.classList.toggle('dim', f !== 'all' && p.parentNode.getAttribute('data-type') !== f); });
    });
  });

  // ----- home: search (index loaded on first use) -----
  var TL = { lien: 'Tax lien', deed: 'Tax deed', hybrid: 'Hybrid', redeemable: 'Redeemable deed', other: 'Other' };
  var q = $('#q'), results = $('#results'), idx = null, loading = false;
  function loadIdx(cb) {
    if (idx) return cb();
    if (loading) return;
    loading = true;
    // Re-run the search once loaded so typing during the fetch isn't lost.
    fetch('/assets/search.json').then(function (r) { return r.json(); }).then(function (d) { idx = d; cb(); if (q.value.trim()) runSearch(); }).catch(function () { loading = false; });
  }
  function runSearch() {
    var v = norm(q.value.trim());
    if (!v) { results.hidden = true; results.innerHTML = ''; return; }
    loadIdx(function () {
      var out = [];
      idx.s.forEach(function (s) { if (norm(s[1]).indexOf(v) === 0 || s[0].toLowerCase() === v) out.push('<li><a href="/state/' + s[0].toLowerCase() + '/"><span>' + esc(s[1]) + '</span><span class="muted">State</span></a></li>'); });
      for (var i = 0; i < idx.c.length && out.length < 12; i++) {
        var c = idx.c[i];
        if (norm(c[0]).indexOf(v) === 0) out.push('<li><a href="/state/' + c[1].toLowerCase() + '/#c-' + c[3] + '"><span>' + esc(c[0]) + ', ' + c[1] + '</span><span class="muted">' + esc(TL[c[2]] || c[2]) + '</span></a></li>');
      }
      results.innerHTML = out.length ? out.join('') : '<li class="muted" style="padding:.7rem .8rem">No matches</li>';
      results.hidden = false;
      cards.forEach(function (c) { c.hidden = c.getAttribute('data-name').indexOf(v) === -1; });
    });
  }
  if (q) {
    q.addEventListener('input', runSearch);
    q.addEventListener('focus', function () { loadIdx(function () {}); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) results.hidden = true; });
    q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { q.value = ''; runSearch(); } });
  }

  // ----- state: language toggle -----
  // Stored under platbook_lang. The old aurigen_lang is still read once, so a visitor who
  // chose Spanish before the rename is not dropped back into English.
  function setLang(l) {
    document.documentElement.classList.toggle('lang-es', l === 'es');
    $$('[data-setlang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-setlang') === l); });
    store.set('platbook_lang', l);
  }
  if ($('[data-setlang]')) {
    $$('[data-setlang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-setlang')); }); });
    if ((store.get('platbook_lang') || store.get('aurigen_lang')) === 'es') setLang('es');
  }

  // ----- state: counties -----
  var dataEl = $('#countyData');
  if (dataEl) {
    var C = JSON.parse(dataEl.textContent);
    var drawer = $('#drawer'), dBody = $('#dBody'), lastFocus = null;
    var sec = $('#counties'), pill = $('#mapPill');
    function renderVal(v, d) {
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) return '';
      if (typeof v === 'boolean') return v ? 'Yes' : 'No';
      if (typeof v !== 'object') return isUrl(String(v)) ? '<a href="' + esc(v) + '" target="_blank" rel="noopener nofollow">' + esc(String(v).replace(/^https?:\/\//, '')) + '</a>' : esc(v);
      if (Array.isArray(v)) return '<ul>' + v.map(function (x) { return '<li>' + renderVal(x, d + 1) + '</li>'; }).join('') + '</ul>';
      var rows = ordered(Object.keys(v)).map(function (k) { var x = renderVal(v[k], d + 1); return x ? '<div><dt>' + esc(human(k)) + '</dt><dd>' + x + '</dd></div>' : ''; }).join('');
      return rows ? '<dl class="kv' + (d ? ' kv-nested' : '') + '">' + rows + '</dl>' : '';
    }
    function open(i) {
      var c = C[i]; if (!c) return;
      lastFocus = document.activeElement;
      // A county record carries no redemption period and no interest rate (see the note in
      // scripts/build-site.mjs). Those are state rules, stated once on this page from the
      // audited ledger; the drawer points up at them instead of giving a second answer.
      // The platform and the official link are dropped here when the county-specific block
      // below already names them, which is what used to put two platforms on one card:
      // "Auction platform: RealTaxDeed" directly above "Auction > Platform: LienHub".
      var eTxt = c.e ? JSON.stringify(c.e) : '';
      var dupP = !!(c.p && eTxt.indexOf(JSON.stringify(String(c.p))) !== -1);
      var dupU = !!(c.u && eTxt.indexOf(JSON.stringify(String(c.u))) !== -1);
      var facts = { 'Sale type': c.tl };
      if (c.p && !dupP) facts['Auction platform'] = c.p;
      var html = '<p class="eyebrow">' + esc(c.k) + '</p><h2 id="dTitle">' + esc(c.n) + '</h2>';
      html += c.cs && c.cs.u ? '<p class="fresh ok">County source: <a href="' + esc(c.cs.u) + '" target="_blank" rel="noopener nofollow">' + esc(c.cs.t || c.cs.u.replace(/^https?:\/\//, '')) + '</a>, checked ' + esc(c.cs.d) + '.</p>' : '<p class="fresh flag" role="note">Confirm with the county.</p>';
      html += renderVal(facts, 0);
      if (c.tl) html += '<p class="muted">Redemption period and interest or penalty rate are set state-wide. They are stated once in <b>State rules</b> above, with the statute.</p>';
      if (c.u && !dupU) html += '<p><a class="btn" href="' + esc(c.u) + '" target="_blank" rel="noopener nofollow">Official / auction site ↗</a></p>';
      if (c.no && c.no.length) html += '<h3>Notes</h3><ul>' + c.no.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>';
      var extra = renderVal(c.e, 0);
      if (extra) html += '<h3>County-specific details</h3>' + extra;
      if (c.v) html += '<p class="muted">Research dated: ' + esc(c.v) + '</p>';
      dBody.innerHTML = html;
      drawer.hidden = false;
      $$('.county.sel, .map path.sel').forEach(function (x) { x.classList.remove('sel'); });
      $$('[data-i="' + i + '"]').forEach(function (x) { (x.closest('.county') || x).classList.add('sel'); });
      $('#dClose').focus();
    }
    function close() {
      drawer.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      if (location.hash.indexOf('#c-') === 0) history.replaceState(null, '', location.pathname);
    }
    $('#dClose').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) close(); });
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-i]');
      if (t && (t.tagName === 'BUTTON' || t.tagName === 'path')) open(+t.getAttribute('data-i'));
    });
    $$('.county-map path[data-i]').forEach(function (p) {
      p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(+p.getAttribute('data-i')); } });
    });
    var cq = $('#cq');
    cq.addEventListener('input', function () {
      var v = norm(cq.value.trim());
      $$('#countyList .county').forEach(function (li) { li.hidden = v && norm(li.getAttribute('data-name')).indexOf(v) === -1; });
    });
    pill.addEventListener('click', function () {
      var on = !sec.classList.contains('show-map');
      sec.classList.toggle('show-map', on);
      pill.textContent = on ? 'List' : 'Map';
      pill.setAttribute('aria-pressed', on);
    });
    if (location.hash.indexOf('#c-') === 0) {
      var li = document.getElementById(location.hash.slice(1));
      if (li) { li.scrollIntoView({ block: 'center' }); open(+li.getAttribute('data-i')); }
    }
  }

  // ----- debug / device preview: only with ?debug=1 -----
  if (/[?&]debug=1\b/.test(location.search)) {
    var bytes = 0;
    try { performance.getEntriesByType('resource').concat(performance.getEntriesByType('navigation')).forEach(function (e) { bytes += e.transferSize || 0; }); } catch (e) { /* ignore */ }
    var d = document.createElement('div');
    d.className = 'debug';
    d.innerHTML = 'viewport ' + innerWidth + '×' + innerHeight + '<br>transfer ~' + Math.round(bytes / 1024) + ' KB<br>scrollW ' + document.documentElement.scrollWidth +
      '<br><button data-w="375">375</button><button data-w="768">768</button><button data-w="1280">1280</button><button data-w="0">close</button>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) {
      var w = e.target.getAttribute && e.target.getAttribute('data-w'); if (w == null) return;
      var old = $('.preview'); if (old) old.remove();
      if (w === '0') return;
      var p = document.createElement('div'); p.className = 'preview';
      p.innerHTML = '<iframe title="Device preview" style="width:' + w + 'px;max-width:96vw" src="' + location.pathname + '"></iframe>';
      p.addEventListener('click', function (ev) { if (ev.target === p) p.remove(); });
      document.body.appendChild(p);
    });
  }
})();
