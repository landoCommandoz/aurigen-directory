// Aurigen — MapManager
// D3-based geographic map of US states, colored by lien/deed/hybrid type.
// Used as default view in the Explore tab.

var FIPS_TO_ABBR = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE',
  '11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA',
  '20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN',
  '28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM',
  '36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI',
  '45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA',
  '54':'WV','55':'WI','56':'WY'
};

var MapManager = {
  _initialized: false,

  // Build a lookup from state id → type using whichever STATES array is active
  _buildTypeMap: function () {
    var states = window.STATES || window.STATES_EN || [];
    var map = {};
    for (var i = 0; i < states.length; i++) {
      var s = states[i];
      map[s.id] = s.type || 'deed';
    }
    return map;
  },

  // Render the map container HTML (called by App._renderExplore)
  getHTML: function () {
    var lang = LanguageManager.getLang();
    var html = '';
    html += '<div id="d3-map"></div>';
    html += '<div id="map-tooltip"></div>';
    html += '<div id="map-legend">';
    html += '<span class="legend-item"><span class="legend-dot" style="background:var(--color-lien)"></span>' + (lang === 'es' ? 'Gravamen' : 'Lien') + '</span>';
    html += '<span class="legend-item"><span class="legend-dot" style="background:var(--color-deed)"></span>' + (lang === 'es' ? 'Escritura' : 'Deed') + '</span>';
    html += '<span class="legend-item"><span class="legend-dot" style="background:var(--color-hybrid)"></span>' + (lang === 'es' ? 'H\u00edbrido' : 'Hybrid') + '</span>';
    html += '</div>';
    return html;
  },

  // Initialize D3 map after container is in the DOM
  init: function () {
    var container = document.getElementById('d3-map');
    if (!container) return;

    var typeMap = this._buildTypeMap();
    var w = container.clientWidth || 800;
    var h = Math.min(w * 0.62, 500);

    var svg = d3.select(container).append('svg')
      .attr('viewBox', '0 0 ' + w + ' ' + h)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    var projection = d3.geoAlbersUsa().fitSize([w, h], { type: 'Sphere' });
    var path = d3.geoPath().projection(projection);
    var tooltip = document.getElementById('map-tooltip');

    var TYPE_FILL = {
      lien: 'var(--color-lien)',
      deed: 'var(--color-deed)',
      hybrid: 'var(--color-hybrid)',
      'redeemable deed': 'var(--color-rdeed)'
    };

    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then(function (us) {
        var states = topojson.feature(us, us.objects.states).features;
        projection.fitSize([w, h], topojson.feature(us, us.objects.states));

        svg.selectAll('.state-path')
          .data(states)
          .join('path')
          .attr('class', function (d) {
            var fips = String(d.id).padStart(2, '0');
            var abbr = FIPS_TO_ABBR[fips] || '';
            var locked = !AccessManager.canAccessState(abbr);
            return 'state-path' + (locked ? ' locked' : '');
          })
          .attr('d', path)
          .attr('data-abbr', function (d) {
            var fips = String(d.id).padStart(2, '0');
            return FIPS_TO_ABBR[fips] || '';
          })
          .attr('fill', function (d) {
            var fips = String(d.id).padStart(2, '0');
            var abbr = FIPS_TO_ABBR[fips] || '';
            var t = typeMap[abbr] || 'deed';
            return TYPE_FILL[t] || TYPE_FILL.deed;
          })
          .on('mousemove', function (event, d) {
            var fips = String(d.id).padStart(2, '0');
            var abbr = FIPS_TO_ABBR[fips] || '';
            var allStates = window.STATES || window.STATES_EN || [];
            var st = null;
            for (var i = 0; i < allStates.length; i++) {
              if (allStates[i].id === abbr) { st = allStates[i]; break; }
            }
            if (!st || !tooltip) return;
            var locked = !AccessManager.canAccessState(abbr);
            tooltip.innerHTML = locked
              ? abbr + ' \u2014 <span style="color:var(--text-dim)">LOCKED</span>'
              : abbr + ' \u00B7 ' + st.name + ' \u00B7 ' + st.type.toUpperCase();
            tooltip.classList.add('visible');
            tooltip.style.left = (event.clientX + 14) + 'px';
            tooltip.style.top = (event.clientY - 10) + 'px';
          })
          .on('mouseleave', function () {
            if (tooltip) tooltip.classList.remove('visible');
          })
          .on('click', function (event, d) {
            var fips = String(d.id).padStart(2, '0');
            var abbr = FIPS_TO_ABBR[fips] || '';
            if (window.App) App.openState(abbr);
          });

        MapManager._initialized = true;
      })
      .catch(function () {
        container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-dim);font-family:\'Space Mono\',monospace;font-size:11px;letter-spacing:0.1em;">MAP UNAVAILABLE \u2014 CHECK CONNECTION</div>';
      });
  }
};
