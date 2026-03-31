// === MAP FILTER PANEL (B2) ===
var mapFilter = 'all';
var mapSearchQuery = '';

function initMapFilterPanel() {
  var counts = {};
  var FILTER_TYPES = [
    {key:'lien', label:'Tax Lien', color:'#FFBE0B'},
    {key:'deed', label:'Tax Deed', color:'#00D4FF'},
    {key:'redeemable', label:'Redeemable', color:'#FF2D55'},
    {key:'hybrid', label:'Hybrid', color:'#BF5FFF'}
  ];
  FILTER_TYPES.forEach(function(ft){ counts[ft.key] = ALL_STATES.filter(function(s){ return (s._v2type||s.type)===ft.key; }).length; });

  var gridHtml = FILTER_TYPES.map(function(ft){
    return '<button class="mfp-filter-btn" data-type="'+ft.key+'" onclick="setMapFilter(\''+ft.key+'\')" style="color:'+ft.color+';background:'+ft.color+'18;border-color:'+ft.color+'44">'+ft.label+' <span class="mfp-btn-count">('+counts[ft.key]+')</span></button>';
  }).join('');

  var gridEl = document.getElementById('mfp-grid');
  var gridMob = document.getElementById('mfp-grid-mobile');
  if(gridEl) gridEl.innerHTML = gridHtml;
  if(gridMob) gridMob.innerHTML = gridHtml.replace(/mfp-filter-btn/g,'mfp-filter-btn');

  renderMapStateList();
}

function renderMapStateList() {
  var q = mapSearchQuery.toLowerCase();
  var filtered = ALL_STATES.filter(function(s){
    var t = s._v2type||s.type||s.t||'';
    var c = s.abbr||s.c||'';
    var n = s.name||s.n||'';
    var fOk = mapFilter==='all'||t===mapFilter;
    var qOk = !q||c.toLowerCase().indexOf(q)>=0||n.toLowerCase().indexOf(q)>=0;
    return fOk&&qOk;
  });

  // Update subtitle
  var sub = document.getElementById('mfp-subtitle');
  if(sub){
    if(mapFilter==='all' && !q){
      sub.textContent = '51 jurisdictions \u00b7 Click any state';
    } else if(q){
      sub.textContent = filtered.length + ' result'+(filtered.length!==1?'s':'')+' for \u201c'+q+'\u201d';
    } else {
      var labels = {lien:'Tax Lien',deed:'Tax Deed',redeemable:'Redeemable Deed',hybrid:'Hybrid',forfeiture:'Tax Forfeiture'};
      sub.textContent = filtered.length + ' '+(labels[mapFilter]||mapFilter)+' states shown';
    }
  }

  // Render list
  var list = document.getElementById('mfp-state-list');
  if(!list) return;
  var colors = {lien:'#FFBE0B',deed:'#00D4FF',redeemable:'#FF2D55',hybrid:'#BF5FFF',forfeiture:'#FF6B35'};
  list.innerHTML = filtered.map(function(s){
    var t = s._v2type||s.type||s.t;
    var c = s.abbr||s.c;
    var n = s.name||s.n||c;
    var rate = s.rate||s.y||'N/A';
    var color = colors[t]||'#00D4FF';
    var badge = TYPE_LABELS[t]||'';
    var isSel = selectedState===c;
    var rateShort = shortenRate(rate, t);
    return '<div class="mfp-state-item'+(isSel?' selected':'')+'" onclick="selectMapState(\''+escapeHtml(c)+'\')" style="'+(isSel?'background:'+color+'12;border-color:'+color+'44':'')+';transition:opacity 200ms ease-out">'+
      '<div class="mfp-item-dot" style="background:'+color+';box-shadow:0 0 4px '+color+'"></div>'+
      '<span class="mfp-item-name">'+escapeHtml(n)+'</span>'+
      '<span class="mfp-item-rate">'+escapeHtml(rateShort)+'</span>'+
      '<span class="mfp-item-badge" style="color:'+color+';border-color:'+color+'44;background:'+color+'15">'+escapeHtml(badge)+'</span>'+
    '</div>';
  }).join('');
}

function selectMapState(abbr) {
  var s = ALL_STATES.find(function(x){ return (x.abbr||x.c)===abbr; });
  if(!s) return;
  if(selectedState===abbr){ selectedState=null; StatePanel.close(); resetMapColors(); updateMapCallout(null); }
  else { selectedState=abbr; App.openState(s.abbr||s.c||s.id); updateMapColors(); updateMapCallout(s); }
  renderMapStateList();
}

function setMapFilter(f) {
  mapFilter = f;
  // Update filter button styles
  document.querySelectorAll('.mfp-filter-btn').forEach(function(btn){
    var bType = btn.getAttribute('data-type');
    var colors = {lien:'#FFBE0B',deed:'#00D4FF',redeemable:'#FF2D55',hybrid:'#BF5FFF',forfeiture:'#FF6B35'};
    var c = colors[bType]||'#fff';
    if(f===bType){
      btn.style.color = c;
      btn.style.background = c+'28';
      btn.style.borderColor = c+'88';
      btn.style.opacity = '1';
    } else if(f==='all'){
      btn.style.color = c;
      btn.style.background = c+'18';
      btn.style.borderColor = c+'44';
      btn.style.opacity = '1';
    } else {
      btn.style.opacity = '0.35';
    }
  });
  // Update Show All button
  document.querySelectorAll('.mfp-show-all').forEach(function(btn){
    btn.classList.toggle('active', f==='all');
  });
  applyMapFilter();
  renderMapStateList();
}

function handleMapSearch(v) {
  mapSearchQuery = v;
  // Sync both search inputs
  var desk = document.getElementById('mfp-search');
  var mob = document.getElementById('mfp-search-mobile');
  if(desk && desk.value!==v) desk.value = v;
  if(mob && mob.value!==v) mob.value = v;
  // Show/hide clear buttons
  var show = v.length>0;
  var clrD = document.getElementById('mfp-search-clear');
  var clrM = document.getElementById('mfp-search-clear-mobile');
  if(clrD) clrD.style.display = show?'block':'none';
  if(clrM) clrM.style.display = show?'block':'none';
  applyMapFilter();
  renderMapStateList();
}

function clearMapSearch() {
  mapSearchQuery = '';
  var desk = document.getElementById('mfp-search');
  var mob = document.getElementById('mfp-search-mobile');
  if(desk) desk.value = '';
  if(mob) mob.value = '';
  document.querySelectorAll('.mfp-search-clear').forEach(function(b){ b.style.display='none'; });
  applyMapFilter();
  renderMapStateList();
}

function applyMapFilter() {
  if(!svgEl) return;
  var q = mapSearchQuery.toLowerCase();
  var matchedAbbr = null;

  svgEl.selectAll('.state-path').each(function(d){
    var s = getStateData(d);
    if(!s) return;
    var t = s._v2type||s.type||s.t||'';
    var c = s.abbr||s.c||'';
    var n = s.name||s.n||'';
    var color = getTypeColor(s); // TODO: dead code — remove in next cleanup PR
    var fOk = mapFilter==='all'||t===mapFilter;
    var qOk = !q||c.toLowerCase().indexOf(q)>=0||n.toLowerCase().indexOf(q)>=0;
    var visible = fOk && qOk;
    var isSel = selectedState===c;
    var el = d3.select(this);

    el.transition().duration(250).ease(d3.easeQuadOut)
      .attr('fill', visible ? (isSel ? 'rgba(201,168,76,0.28)' : 'rgba(201,168,76,0.06)') : 'transparent')
      .attr('stroke', visible ? 'rgba(201,168,76,0.28)' : 'rgba(255,255,255,0.04)')
      .attr('stroke-width', isSel ? 2 : 0.5);

    // Gold pulse on search match
    if(q && visible && !matchedAbbr){
      matchedAbbr = c;
      el.attr('stroke', '#C9A84C').attr('stroke-opacity',1).attr('stroke-width',2);
    }
  });

  // Labels
  svgEl.selectAll('.state-label').each(function(d){
    var s = getStateData(d);
    if(!s) return;
    var t = s._v2type||s.type||s.t||'';
    var c = s.abbr||s.c||'';
    var n = s.name||s.n||'';
    var fOk = mapFilter==='all'||t===mapFilter;
    var qOk = !q||c.toLowerCase().indexOf(q)>=0||n.toLowerCase().indexOf(q)>=0;
    var visible = fOk && qOk;
    d3.select(this).transition().duration(250)
      .attr('fill-opacity', visible ? 0.85 : 0.05);
  });
}

function updateMapCallout(s) {
  var el = document.getElementById('map-callout');
  if(!el) return;
  if(!s){
    el.className = 'callout-animate';
    el.innerHTML = '';
    return;
  }
  var t = s._v2type||s.type||s.t;
  var c = s.abbr||s.c;
  var n = s.name||s.n||c;
  var rate = s.rate||s.y||'N/A';
  var redemption = s.redemption||s.r||'N/A';
  var platform = (s.auctionPlatform||'County');
  var colors = {lien:'#FFBE0B',deed:'#00D4FF',redeemable:'#FF2D55',hybrid:'#BF5FFF',forfeiture:'#FF6B35'};
  var color = colors[t]||'#00D4FF';
  var badge = TYPE_LABELS[t]||t;
  var rateShort = shortenRate(rate, t);
  var holdShort = shortenHold(redemption, t);

  el.className = 'callout-animate';
  el.innerHTML =
    '<div class="callout-label">&#9654; SELECTED STATE</div>'+
    '<div class="callout-name">'+escapeHtml(n)+'</div>'+
    '<span class="callout-type-badge" style="color:'+color+';border-color:'+color+'44;background:'+color+'15">'+escapeHtml(badge)+'</span>'+
    '<div class="callout-stats">'+
      '<div class="callout-stat"><span class="callout-stat-label">RATE</span><span class="callout-stat-value">'+escapeHtml(rateShort)+'</span></div>'+
      '<div class="callout-stat"><span class="callout-stat-label">REDEMPTION</span><span class="callout-stat-value">'+escapeHtml(holdShort)+'</span></div>'+
      '<div class="callout-stat"><span class="callout-stat-label">PLATFORM</span><span class="callout-stat-value">'+escapeHtml(platform.length>10?platform.slice(0,9)+'\u2026':platform)+'</span></div>'+
    '</div>'+
    '<button class="callout-open" onclick="var s=ALL_STATES.find(function(x){return(x.abbr||x.c)===\''+escapeHtml(c)+'\';});if(s)App.openState(s.abbr||s.c||s.id);">Open Full Detail \u2192</button>';
}

// Mobile filter drawer (from nav bar)
function toggleMobileDrawer() {
  var drawer = document.getElementById('mfp-mobile-drawer');
  var overlay = document.getElementById('mfp-drawer-overlay');
  var btn = document.getElementById('nav-filter-btn');
  if(!drawer||!overlay) return;
  var isOpen = drawer.classList.contains('open');
  if(isOpen){
    drawer.classList.remove('open');
    if(btn) btn.classList.remove('active');
    setTimeout(function(){ overlay.style.display='none'; drawer.style.display='none'; },250);
  } else {
    drawer.style.display = 'block';
    overlay.style.display = 'block';
    if(btn) btn.classList.add('active');
    void drawer.offsetHeight;
    drawer.classList.add('open');
  }
}

// Show/hide nav filter button based on active tab
function updateNavFilterBtn() {
  var btn = document.getElementById('nav-filter-btn');
  if(!btn) return;
  var isMobile = window.innerWidth <= 768;
  btn.style.display = (isMobile && APP.activeTab === 'map') ? 'flex' : 'none';
}

function getStateData(d) {
  var fips = String(d.id).padStart(2,'0');
  var abbr = FIPS_TO_ABBR[fips];
  return ALL_STATES.find(function(s){ return (s.abbr||s.c)===abbr; }) || null;
}

function getTypeColor(s) {
  if(!s) return 'rgba(255,255,255,0.025)';
  var t = s.type || s.t;
  return TYPE_FILL[t] || 'rgba(255,255,255,0.025)';
}

var svgEl, pathGen;

function initMap() {
  svgEl = d3.select('#map-svg');
  var w = Math.max(400, window.innerWidth - 280);
  var h = Math.max(300, window.innerHeight - 180);
  var scale = Math.min(w, h * 1.6) * 1.1;
  var projection = d3.geoAlbersUsa().scale(scale).translate([w/2, h/2]);
  pathGen = d3.geoPath().projection(projection);
  if (svgEl) { svgEl.attr('width', w).attr('height', h).attr('viewBox', null); }

  fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
    .then(function(r){ return r.json(); })
    .then(function(us){
      var states = topojson.feature(us, us.objects.states);

      svgEl.selectAll('.state-path')
        .data(states.features)
        .enter().append('path')
        .attr('class','state-path')
        .attr('d',pathGen)
        .attr('fill','#0d1628')
        .attr('stroke','#c9a84c')
        .attr('stroke-width',0.6)
        .on('click',function(event,d){
          var s = getStateData(d);
          if(!s) return;
          var abbr = s.abbr || s.c;
          if(selectedState===abbr){ selectedState=null; StatePanel.close(); resetMapColors(); updateMapCallout(null); renderMapStateList(); }
          else { selectedState=abbr; App.openState(s.abbr||s.c||s.id); updateMapColors(); updateMapCallout(s); renderMapStateList(); }
        });

      svgEl.selectAll('.state-label')
        .data(states.features)
        .enter().append('text')
        .attr('class','state-label')
        .attr('transform',function(d){
          var c=pathGen.centroid(d);
          return (c&&!isNaN(c[0]))?'translate('+c[0]+','+c[1]+')':'translate(-999,-999)';
        })
        .attr('text-anchor','middle')
        .attr('dominant-baseline','central')
        .attr('font-size','7px')
        .attr('fill','rgba(201,168,76,0.7)')
        .attr('pointer-events','none')
        .text(function(d){
          var fips=String(d.id).padStart(2,'0');
          return FIPS_TO_ABBR[fips]||'';
        });

      svgEl.append('path')
        .datum(topojson.mesh(us,us.objects.states,function(a,b){ return a!==b; }))
        .attr('fill','none')
        .attr('stroke','rgba(0,0,0,0.3)')
        .attr('stroke-width',0.5)
        .attr('pointer-events','none')
        .attr('d',pathGen);

      buildLegend();

      // Resize handler with debounce — full redraw on window resize
      var _resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(function() { redrawMap(); }, 100);
      });
    });
}

// Full map redraw — recompute projection, update all paths and labels
function redrawMap() {
  if (!svgEl) return;
  var w = Math.max(400, window.innerWidth - 280);
  var h = Math.max(300, window.innerHeight - 180);
  var scale = Math.min(w, h * 1.6) * 1.1;
  var projection = d3.geoAlbersUsa().scale(scale).translate([w/2, h/2]);
  pathGen = d3.geoPath().projection(projection);
  svgEl.attr('width', w).attr('height', h).attr('viewBox', null);
  svgEl.selectAll('.state-path').attr('d', pathGen);
  svgEl.selectAll('.state-label').attr('transform', function(d) {
    var c = pathGen.centroid(d);
    return (c && !isNaN(c[0])) ? 'translate(' + c[0] + ',' + c[1] + ')' : 'translate(-999,-999)';
  });
  svgEl.selectAll('path[pointer-events="none"]').attr('d', pathGen);
}

// Re-render map when tab becomes visible (tab switch)
function refreshMapSize() {
  redrawMap();
}

function updateMapColors() {
  var q = mapSearchQuery.toLowerCase();
  svgEl.selectAll('.state-path').each(function(d){
    var s=getStateData(d); var abbr=s?(s.abbr||s.c):null;
    var isSel=selectedState===abbr;
    var color=getTypeColor(s); // TODO: dead code — remove in next cleanup PR
    // Respect filter + search
    var t=s?(s._v2type||s.type||s.t||''):'';
    var n=s?(s.name||s.n||''):'';
    var fOk=mapFilter==='all'||t===mapFilter;
    var qOk=!q||(abbr&&abbr.toLowerCase().indexOf(q)>=0)||(n.toLowerCase().indexOf(q)>=0);
    var visible=fOk&&qOk;
    d3.select(this)
      .attr('fill',visible?(isSel?'rgba(201,168,76,0.28)':'rgba(201,168,76,0.06)'):'transparent')
      .attr('stroke',visible?'rgba(201,168,76,0.28)':'rgba(255,255,255,0.04)')
      .attr('stroke-width',isSel?2:0.5);
    if(isSel){
      document.getElementById('ambient-glow').style.background='radial-gradient(ellipse 60% 60% at 50% 50%,rgba(201,168,76,0.08) 0%,transparent 70%)';
    }
  });
  svgEl.selectAll('.state-label').each(function(d){
    var s=getStateData(d); var abbr=s?(s.abbr||s.c):null;
    var t=s?(s._v2type||s.type||s.t||''):'';
    var n=s?(s.name||s.n||''):'';
    var fOk=mapFilter==='all'||t===mapFilter;
    var qOk=!q||(abbr&&abbr.toLowerCase().indexOf(q)>=0)||(n.toLowerCase().indexOf(q)>=0);
    var visible=fOk&&qOk;
    var isSel=selectedState===abbr;
    d3.select(this).attr('fill-opacity',visible?(isSel?1:0.85):0.05).attr('font-weight',isSel?'700':'400');
  });
}

function resetMapColors() {
  if(!svgEl) return;
  // If filter or search is active, use applyMapFilter instead of full reset
  if(mapFilter!=='all' || mapSearchQuery) {
    applyMapFilter();
    document.getElementById('ambient-glow').style.background='';
    return;
  }
  svgEl.selectAll('.state-path').each(function(){
    d3.select(this).attr('fill','rgba(201,168,76,0.06)')
      .attr('stroke','rgba(201,168,76,0.28)').attr('stroke-width',0.5);
  });
  svgEl.selectAll('.state-label').attr('fill-opacity',0.75).attr('font-weight','400');
  document.getElementById('ambient-glow').style.background='';
}

function switchExploreView(tab) {
  currentTab=tab; selectedState=null; StatePanel.close();
  document.querySelectorAll('.tab').forEach(function(t,i){ t.classList.toggle('active',(i===0&&tab==='map')||(i===1&&tab==='list')); });
  document.getElementById('view-map').classList.toggle('hidden',tab!=='map');
  document.getElementById('view-list').classList.toggle('hidden',tab!=='list');
  if(tab==='list') renderList();
}

function updatePills() {
  document.querySelectorAll('.pill').forEach(function(p){
    var k=p.id.replace('pill-','');
    var colors={lien:'#FFBE0B',deed:'#00D4FF',redeemable:'#FF2D55',hybrid:'#BF5FFF',forfeiture:'#FF6B35'};
    var c=colors[k];
    if(k===activeFilter){
      p.style.background=c?(c+'28'):'rgba(0,212,255,0.12)';
      p.style.borderColor=c?(c+'88'):'rgba(0,212,255,0.5)';
      p.style.color=c||'rgba(0,212,255,0.8)';
    } else {
      p.style.background='rgba(0,212,255,0.04)';
      p.style.borderColor='rgba(0,212,255,0.12)';
      p.style.color='rgba(0,212,255,0.4)';
    }
  });
}

// shortenRate defined below (consolidated at line ~2058)
function shortenRate(rate, type) {
  if (!rate) return 'N/A';
  var r = rate;
  if (type === 'deed' || type === 'redeemable') return 'N/A';
  if (/bid.?down/i.test(r)) return 'Bid-Dn';
  if (/premium/i.test(r)) return 'Prem';
  var pct = r.match(/([\d.]+)s*%/);
  if (pct) return pct[1] + '%';
  if (/varies/i.test(r)) return 'Varies';
  return r.length > 8 ? r.substring(0, 7) + '...' : r;
}
function shortenRedemption(redemption) {
  if (!redemption) return 'N/A';
  var r = redemption;
  if (/none after|no redempt/i.test(r)) return 'None';
  var mo = r.match(/([\d]+)s*months?/i); if (mo) return mo[1] + 'mo';
  var yr = r.match(/([\d.]+)s*years?/i); if (yr) return yr[1] + 'yr';
  return r.length > 8 ? r.substring(0, 7) + '...' : r;
}
function shortenBidMethod(method) {
  if (!method) return '—';
  if (/bid.?down/i.test(method)) return 'Bid-Dn';
  if (/premium/i.test(method)) return 'Premium';
  if (/random|rotati/i.test(method)) return 'Random';
  if (/highest/i.test(method)) return 'Highest';
  if (/over.?bid/i.test(method)) return 'Overbid';
  return method.length > 8 ? method.substring(0, 7) + '...' : method;
}
function shortenPlatform(platform) {
  if (!platform) return '';
  if (/realtaxdeed|realauc/i.test(platform)) return 'RealAuction';
  if (/govease/i.test(platform)) return 'GovEase';
  if (/lienhub/i.test(platform)) return 'LienHub';
  if (/bid4assets/i.test(platform)) return 'Bid4Assets';
  if (/taxcertsale/i.test(platform)) return 'TaxCertSale';
  return platform;
}


function shortenHold(redemption, type) {
  if(!redemption) return 'N/A';
  var r=redemption;
  if(type==='forfeiture') return '3yr';
  if(/none after|no redempt/i.test(r)) return 'No Redempt';
  // "2 years (lien); none post-deed sale" → "2yr"
  // "21 months" → "21mo"
  // "2.5 years (30 months)" → "30mo"
  var mo=r.match(/(\d+)\s*months/i); if(mo) return mo[1]+'mo';
  // "3 years" / "4 years" → "3yr" / "4yr"
  var yr=r.match(/([\d.]+)\s*years?\b/i);
  if(yr) {
    var suffix='yr';
    if(/minimum|min/i.test(r)) suffix='yr min';
    return yr[1]+suffix;
  }
  // "30 days" / "60 days" → "30d" / "60d"
  var dy=r.match(/(\d+)\s*days?\b/i); if(dy) return dy[1]+'d';
  // "Until Land Court" / "Until foreclosure"
  if(/until/i.test(r)) return 'Varies';
  if(/varies/i.test(r)) return 'Varies';
  return r.length>10?r.slice(0,8)+'…':r;
}

var TYPE_ABBR={lien:'Lien',deed:'Deed',redeemable:'Rdbl',hybrid:'Hybrid',forfeiture:'Forf'};
function buildStateRow(s,i,colors){
  var t=s.type||s.t; var c=s.abbr||s.c; var n=s.name||s.n||c;
  var rate=s.rate||s.y||'N/A'; var redemption=s.redemption||s.r||'N/A';
  var color=colors[t]||'#00D4FF';
  var isSel=selectedState===c;
  var vt=s._v2type||t;
  var badge=TYPE_LABELS[vt]||vt.toUpperCase().slice(0,6);
  var ratePill=shortenRate(rate,vt);
  var holdPill=shortenHold(redemption,vt);
  var typeAbbr=TYPE_ABBR[vt]||vt;
  return '<div class="state-row" id="row-'+c+'" onclick="selectFromList(\''+c+'\')"'+
    ' style="background:'+(isSel?'linear-gradient(90deg,'+color+'15,transparent)':'transparent')+';border-left-color:'+(isSel?color:'transparent')+'"'+
    ' data-type="'+vt+'">'+
    '<span class="row-num">'+String(i+1).padStart(2,'0')+'</span>'+
    '<div class="row-badge"><span class="badge" style="color:#fff;background:'+color+';border-color:'+color+';box-shadow:0 0 5px '+color+'">'+badge+'</span></div>'+
    '<span class="row-name">'+escapeHtml(n.toUpperCase())+'</span>'+
    '<span class="row-type-label" style="color:'+color+'">'+escapeHtml(typeAbbr)+'</span>'+
    '<div class="row-stats" title="'+rate.replace(/"/g,'&quot;')+' | '+redemption.replace(/"/g,'&quot;')+'">'+
      '<span class="stat-pill pill-rate">'+ratePill+'</span>'+
      '<span class="stat-pill pill-hold">'+holdPill+'</span>'+
    '</div>'+
  '</div>';
}

function renderList() {
  var q=searchQuery.toLowerCase();
  var filtered=ALL_STATES.filter(function(s){
    var t=s._v2type||s.type||s.t||'';
    var c=s.abbr||s.c||'';
    var n=s.name||s.n||'';
    var fOk=activeFilter==='all'||t===activeFilter;
    var qOk=!q||c.toLowerCase().indexOf(q)>=0||n.toLowerCase().indexOf(q)>=0||t.indexOf(q)>=0;
    return fOk&&qOk;
  });
  document.getElementById('result-count').textContent=filtered.length+' / '+ALL_STATES.length;
  var container=document.getElementById('rows-container');
  var empty=document.getElementById('empty-state');
  if(!empty){empty=document.createElement('div');empty.id='empty-state';container.appendChild(empty);}
  if(filtered.length===0){
    empty.style.display='flex';
    empty.innerHTML='\uD83D\uDD0D<div style="font-size:14px;color:#686880;margin-top:4px">No states found</div><div style="font-size:12px;color:#686880">Try searching by state name</div>';
    container.innerHTML=''; container.appendChild(empty); return;
  }
  empty.style.display='none';
  var colors={lien:'#FFBE0B',deed:'#00D4FF',redeemable:'#FF2D55',hybrid:'#BF5FFF',forfeiture:'#FF6B35'};
  var typeOrder=['lien','hybrid','redeemable','deed','forfeiture'];
  var typeLabels={lien:'Tax Lien States',hybrid:'Hybrid States',redeemable:'Redeemable Deed States',deed:'Tax Deed States',forfeiture:'Forfeiture States'};
  var isMobile=window.innerWidth<=768;
  var html='';
  if(isMobile){
    typeOrder.forEach(function(type){
      var group=filtered.filter(function(s){return(s._v2type||s.type||s.t)===type;});
      if(group.length===0) return;
      html+='<div class="list-section-header">'+typeLabels[type]+' ('+group.length+')</div>';
      group.forEach(function(s,i){html+=buildStateRow(s,i,colors);});
    });
  } else {
    filtered.forEach(function(s,i){html+=buildStateRow(s,i,colors);});
  }
  container.innerHTML=html+'<div id="empty-state" style="display:none">NO RESULTS</div>';
}

function selectFromList(abbr) {
  var s=ALL_STATES.find(function(x){ return (x.abbr||x.c)===abbr; });
  if(!s) return;
  if(selectedState===abbr){selectedState=null;StatePanel.close();}
  else{selectedState=abbr;App.openState(s.abbr||s.c||s.id);}
  renderList();
}

function handleSearch(v) {
  searchQuery=v;
  document.getElementById('search-clear').style.display=v?'block':'none';
  renderList();
}

function clearSearch() {
  searchQuery=''; document.getElementById('search-input').value='';
  document.getElementById('search-clear').style.display='none'; renderList();
}

function setFilter(f){activeFilter=f;selectedState=null;StatePanel.close();updatePills();renderList();}

// Platform name → URL lookup
