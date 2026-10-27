// Aurigen client script: search, filters, county drawer, language toggle, debug panel.
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
  function human(k) { return String(k).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, function (c) { return c.toUpperCase(); }); }
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
  var q = $('#q'), results = $('#results'), idx = null, loading = false;
  function loadIdx(cb) {
    if (idx) return cb();
    if (loading) return;
    loading = true;
    fetch('/assets/search.json').then(function (r) { return r.json(); }).then(function (d) { idx = d; cb(); }).catch(function () { loading = false; });
  }
  function runSearch() {
    var v = norm(q.value.trim());
    if (!v) { results.hidden = true; results.innerHTML = ''; return; }
    loadIdx(function () {
      var out = [];
      idx.s.forEach(function (s) { if (norm(s[1]).indexOf(v) === 0 || s[0].toLowerCase() === v) out.push('<li><a href="/state/' + s[0].toLowerCase() + '/"><span>' + esc(s[1]) + '</span><span class="muted">State</span></a></li>'); });
      for (var i = 0; i < idx.c.length && out.length < 12; i++) {
        var c = idx.c[i];
        if (norm(c[0]).indexOf(v) === 0) out.push('<li><a href="/state/' + c[1].toLowerCase() + '/#c-' + c[3] + '"><span>' + esc(c[0]) + ', ' + c[1] + '</span><span class="muted">' + esc(c[2]) + '</span></a></li>');
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

  // ----- state: language toggle (persisted under aurigen_lang) -----
  function setLang(l) {
    document.documentElement.classList.toggle('lang-es', l === 'es');
    $$('[data-setlang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-setlang') === l); });
    store.set('aurigen_lang', l);
  }
  if ($('[data-setlang]')) {
    $$('[data-setlang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-setlang')); }); });
    if (store.get('aurigen_lang') === 'es') setLang('es');
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
      var rows = Object.keys(v).map(function (k) { var x = renderVal(v[k], d + 1); return x ? '<div><dt>' + esc(human(k)) + '</dt><dd>' + x + '</dd></div>' : ''; }).join('');
      return rows ? '<dl class="kv' + (d ? ' kv-nested' : '') + '">' + rows + '</dl>' : '';
    }
    function open(i) {
      var c = C[i]; if (!c) return;
      lastFocus = document.activeElement;
      var facts = { 'Sale type': c.tl, 'Redemption': c.r, 'Interest / penalty': c.x, 'Auction platform': c.p };
      var html = '<p class="eyebrow">' + esc(c.k) + '</p><h2 id="dTitle">' + esc(c.n) + '</h2>' + renderVal(facts, 0);
      if (c.u) html += '<p><a class="btn" href="' + esc(c.u) + '" target="_blank" rel="noopener nofollow">Official / auction site ↗</a></p>';
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
