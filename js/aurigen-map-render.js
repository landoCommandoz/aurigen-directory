/* aurigen-map-render.js — rebuilt clean */

var _mapInitialized = false;
var _mapSvg = null;
var _pathGen = null;
var _selectedState = null;
var _activeTypeFilter = 'all';
var _searchQuery = '';

function initMap() {
  if (_mapInitialized) return;
  var container = document.getElementById('map-container');
  if (!container) return;
  _mapSvg = d3.select('#map-svg');

  function tryDraw() {
    var rect = container.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    if (w < 10 || h < 10) { requestAnimationFrame(tryDraw); return; }
    drawMap(w, h);
  }
  tryDraw();

  var _resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(function() {
      var rect = container.getBoundingClientRect();
      drawMap(rect.width, rect.height);
    }, 150);
  });
}

function drawMap(w, h) {
  if (!_mapSvg) return;
  _mapSvg.selectAll('*').remove();
  _mapSvg.attr('width', w).attr('height', h);

  var projection = d3.geoAlbersUsa()
    .scale(Math.min(w, h * 1.7) * 0.95)
    .translate([w / 2, h / 2]);
  _pathGen = d3.geoPath().projection(projection);

  fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
    .then(function(r) { return r.json(); })
    .then(function(us) {
      var states = topojson.feature(us, us.objects.states);
      _mapInitialized = true;

      _mapSvg.selectAll('.state-path')
        .data(states.features)
        .enter().append('path')
        .attr('class', 'state-path')
        .attr('d', _pathGen)
        .attr('fill', 'rgba(201,168,76,0.06)')
        .attr('stroke', 'rgba(201,168,76,0.35)')
        .attr('stroke-width', 0.6)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          if (_selectedState !== d.id) {
            d3.select(this).attr('fill', 'rgba(201,168,76,0.15)');
          }
        })
        .on('mouseout', function(event, d) {
          if (_selectedState !== d.id) {
            d3.select(this).attr('fill', 'rgba(201,168,76,0.06)');
          }
        })
        .on('click', function(event, d) {
          _mapSvg.selectAll('.state-path').attr('fill', 'rgba(201,168,76,0.06)');
          _selectedState = d.id;
          d3.select(this).attr('fill', 'rgba(201,168,76,0.28)');
          var fips = String(d.id).padStart(2, '0');
          var abbr = FIPS_TO_ABBR[fips];
          if (abbr && typeof App !== 'undefined' && App.openState) {
            App.openState(abbr);
          }
        });

      _mapSvg.selectAll('.state-label')
        .data(states.features)
        .enter().append('text')
        .attr('class', 'state-label')
        .attr('transform', function(d) {
          var c = _pathGen.centroid(d);
          return (c && !isNaN(c[0])) ? 'translate(' + c[0] + ',' + c[1] + ')' : 'translate(-999,-999)';
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '7px')
        .attr('fill', 'rgba(201,168,76,0.7)')
        .attr('pointer-events', 'none')
        .text(function(d) {
          var fips = String(d.id).padStart(2, '0');
          return FIPS_TO_ABBR[fips] || '';
        });

      _mapSvg.append('path')
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr('fill', 'none')
        .attr('stroke', 'rgba(0,0,0,0.3)')
        .attr('stroke-width', 0.4)
        .attr('pointer-events', 'none')
        .attr('d', _pathGen);
    })
    .catch(function(e) { console.error('[map] fetch failed', e); });
}

function refreshMapSize() {
  _mapInitialized = false;
  initMap();
}

function renderStateList() {
  var container = document.getElementById('state-list-rows');
  if (!container) return;
  var data = (typeof window.STATES !== 'undefined') ? window.STATES : (typeof window.STATES_EN !== 'undefined' ? window.STATES_EN : []);
  var filtered = data.filter(function(s) {
    var type = (s.type || s.t || s._v2type || '').toLowerCase();
    var name = (s.name || s.n || '').toLowerCase();
    var abbr = (s.abbr || s.c || '').toLowerCase();
    var typeOk = _activeTypeFilter === 'all' || type === _activeTypeFilter;
    var searchOk = !_searchQuery || name.indexOf(_searchQuery) >= 0 || abbr.indexOf(_searchQuery) >= 0;
    return typeOk && searchOk;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div style="padding:40px;text-align:center;color:#9898b0;font-size:13px;">No states match your filters.</div>';
    return;
  }

  container.innerHTML = filtered.map(function(s, i) {
    var type = (s.type || s.t || s._v2type || 'unknown').toLowerCase();
    var typeColors = { lien: '#c9a84c', deed: '#2dd4c0', hybrid: '#bf5fff', redeemable: '#ff6b35' };
    var color = typeColors[type] || '#9898b0';
    var label = type.toUpperCase();
    var rate = s.rate || s.r || '\u2014';
    var redemption = s.redemption || s.hold || '\u2014';
    var abbr = s.abbr || s.c || '';
    return '<div data-abbr="' + abbr + '" class="state-row" style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:background 0.15s;">'
      + '<span style="color:#9898b0;font-size:11px;font-family:Space Mono,monospace;min-width:24px;">' + (i + 1) + '</span>'
      + '<span style="background:' + color + '22;color:' + color + ';border:1px solid ' + color + '55;font-size:10px;font-family:Space Mono,monospace;padding:2px 8px;border-radius:2px;min-width:56px;text-align:center;">' + label + '</span>'
      + '<span style="flex:1;font-size:14px;color:#f5f0e8;">' + (s.name || s.n || '') + '</span>'
      + '<span style="font-size:12px;color:#c9a84c;font-family:Space Mono,monospace;">' + rate + '</span>'
      + '<span style="font-size:12px;color:#9898b0;font-family:Space Mono,monospace;min-width:60px;text-align:right;">' + redemption + '</span>'
      + '</div>';
  }).join('');

  container.querySelectorAll('.state-row').forEach(function(row) {
    row.addEventListener('click', function() {
      var abbr = this.getAttribute('data-abbr');
      if (abbr && typeof App !== 'undefined' && App.openState) App.openState(abbr);
    });
    row.addEventListener('mouseenter', function() { this.style.background = 'rgba(255,255,255,0.03)'; });
    row.addEventListener('mouseleave', function() { this.style.background = 'transparent'; });
  });
}

function filterStateList(q) {
  _searchQuery = q.toLowerCase();
  renderStateList();
}

function setTypeFilter(type) {
  _activeTypeFilter = type;
  document.querySelectorAll('.type-btn').forEach(function(btn) {
    var isActive = btn.getAttribute('data-type') === type;
    btn.style.background = isActive ? 'rgba(201,168,76,0.1)' : 'transparent';
    btn.style.color = isActive ? '#c9a84c' : '#9898b0';
    btn.style.borderColor = isActive ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)';
    if (isActive) btn.classList.add('active'); else btn.classList.remove('active');
  });
  renderStateList();
}

function switchToMap() {
  document.getElementById('view-map').classList.remove('hidden');
  document.getElementById('view-list').classList.add('hidden');
  document.getElementById('tab-map').classList.add('active');
  document.getElementById('tab-list').classList.remove('active');
  setTimeout(function() { if (!_mapInitialized) initMap(); }, 50);
}

function switchToList() {
  document.getElementById('view-list').classList.remove('hidden');
  document.getElementById('view-map').classList.add('hidden');
  document.getElementById('tab-list').classList.add('active');
  document.getElementById('tab-map').classList.remove('active');
  renderStateList();
}
