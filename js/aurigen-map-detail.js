var PLATFORM_URLS={
  'GovEase':'https://www.govease.com',
  'Bid4Assets':'https://www.bid4assets.com',
  'RealAuction':'https://www.realauction.com',
  'CivicSource':'https://www.civicsource.com',
  'SRI':'https://www.sri-taxsale.com',
  'PublicSurplus':'https://www.publicsurplus.com',
  'iowataxauction.com':'https://www.iowataxauction.com',
  'cosl.org':'https://cosl.org',
  'BidSpencer':'https://www.bidspencer.com',
  'Michigan Land Bank':'https://www.michiganlandbank.org'
};
function linkifyPlatform(text){
  var result=text;
  Object.keys(PLATFORM_URLS).forEach(function(name){
    var re=new RegExp('('+name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
    result=result.replace(re,'<a href="'+PLATFORM_URLS[name]+'" target="_blank" rel="noopener noreferrer">$1 \u2197</a>');
  });
  return result;
}

function safeHref(url){
  if(!url||typeof url!=='string') return '';
  var trimmed=url.trim();
  if(/^https?:\/\//i.test(trimmed)) return trimmed;
  return '';
}

function shortenPlatform(text){
  if(!text) return '';
  // Extract the main platform name, strip parenthetical/description
  var m=text.match(/^([A-Za-z0-9.]+(?:\.com)?)/);
  if(m) return m[1];
  if(text.length>18) return text.slice(0,16)+'\u2026';
  return text;
}

function toggleCounties(){
  var list=document.getElementById('counties-list');
  var chev=document.getElementById('counties-chevron');
  var sw=document.getElementById('county-search-wrap');
  var nr=document.getElementById('county-no-results');
  if(!list)return;
  list.classList.toggle('collapsed');
  var isCollapsed=list.classList.contains('collapsed');
  chev.textContent=isCollapsed?'\u25B6':'\u25BC';
  if(sw)sw.style.display=isCollapsed?'none':'block';
  if(nr&&isCollapsed)nr.style.display='none';
  if(isCollapsed)clearCountySearch();
}

function filterCounties(val){
  var query=val.toLowerCase().trim();
  var list=document.getElementById('counties-list');
  var badge=document.getElementById('counties-count-badge');
  var clearBtn=document.getElementById('county-search-clear');
  var noResults=document.getElementById('county-no-results');
  if(!list)return;
  clearBtn.style.display=query?'block':'none';
  var rows=list.querySelectorAll('.county-row');
  var visible=0;
  for(var i=0;i<rows.length;i++){
    var name=rows[i].getAttribute('data-county-name')||'';
    var match=!query||name.indexOf(query)!==-1;
    rows[i].style.display=match?'':'none';
    if(match)visible++;
  }
  if(badge){
    if(query){badge.textContent=visible+'/'+window._countyTotal;}
    else{badge.textContent=window._countyTotal;}
  }
  if(noResults){noResults.style.display=(query&&visible===0)?'block':'none';}
}

function clearCountySearch(){
  var input=document.getElementById('county-search-input');
  if(input){input.value='';filterCounties('');}
}

// Shorten stat box values for scannable display
function shortenRate(raw, type) {
  if (!raw || raw === 'N/A') {
    if (type === 'deed' || type === 'forfeiture') return 'N/A \u2014 Deed';
    return 'N/A';
  }
  var s = String(raw);
  // "N/A — deed state..." or "N/A — ..."
  if (/^N\/A/i.test(s)) {
    if (/deed/i.test(s) || type === 'deed') return 'N/A \u2014 Deed';
    return 'N/A';
  }
  // "Bid-down..." → "Bid-Down"
  if (/^bid.?down/i.test(s)) return 'Bid-Down';
  // "Varies" → "Varies"
  if (/^varies/i.test(s)) return 'Varies';
  // "0.7%–1.0%/month (8.4%–12% annualized)" → "8.4%–12%"
  var m = s.match(/(\d+\.?\d*%)\s*[\u2013\-]\s*(\d+\.?\d*%)\s*annualized/i);
  if (m) return m[1] + '\u2013' + m[2];
  // "9% per 6 months (18% annualized)" → "18%"
  m = s.match(/(\d+%)\s*annualized/i);
  if (m) return m[1];
  // "6%–24% depending on county" or "3%–12% sliding..." → "6%–24%"
  m = s.match(/^(\d+\.?\d*%)\s*[\u2013\-]\s*(\d+\.?\d*%)/);
  if (m) return m[1] + '\u2013' + m[2];
  // TX: "25% year 1 / 50% year 2 (homestead/ag)..." → "25% / 50%"
  m = s.match(/^(\d+%)\s*(?:year\s*\d\S*\s*)?\/\s*(\d+%)/i);
  if (m) return m[1] + ' / ' + m[2];
  // "10% (months 0–6) / 15% (months 6–12)" → "10% / 15%"
  m = s.match(/^(\d+%)\s*\([^)]*\)\s*\/\s*(\d+%)/);
  if (m) return m[1] + ' / ' + m[2];
  // "20% year 1 / 10% year 2+" → "20% / 10%"
  m = s.match(/^(\d+%)\s*year\s*\d[^\/]*\/\s*(\d+%)/i);
  if (m) return m[1] + ' / ' + m[2];
  // "18% max / 6% floor" → "18% / 6%"
  m = s.match(/^(\d+%)\s*\w+\s*\/\s*(\d+%)/);
  if (m) return m[1] + ' / ' + m[2];
  // "Federal Discount Rate ... ~14%" → "~14%"
  m = s.match(/~(\d+%)/);
  if (m) return '~' + m[1];
  // "18% max" → "18%"
  m = s.match(/^(\d+%)\s*max/i);
  if (m) return m[1];
  // "18% per year on total purchase price (≈9%...)" → "18%"
  m = s.match(/^(\d+\.?\d*%)\s*(?:per\s*year|fixed|on\s|max)/i);
  if (m) return m[1];
  // Simple "XX%" or "XX% fixed"
  m = s.match(/^(\d+\.?\d*%)/);
  if (m) return m[1];
  // Fallback: truncate at first paren/dash/comma
  var cut = s.replace(/\s*[\(\u2014\u2013,].*/,'');
  return cut.length > 16 ? cut.substring(0,14) + '\u2026' : cut;
}

function shortenRedemption(raw) {
  if (!raw || raw === 'N/A') return 'N/A';
  var s = String(raw);
  // "None after sale" → "None"
  if (/^none/i.test(s)) return 'None';
  // "Until ..." or "Minimum 6 months before..." → extract the period
  // "2 years (homestead/agricultural) / 180 days (commercial)" → "180d \u2013 2 Yrs"
  var periods = [];
  var rx = /(\d+\.?\d*)\s*(year|yr|month|mo|day|d)s?/gi;
  var match;
  while ((match = rx.exec(s)) !== null) {
    var num = parseFloat(match[1]);
    var unit = match[2].toLowerCase();
    var days;
    if (unit === 'year' || unit === 'yr') days = num * 365;
    else if (unit === 'month' || unit === 'mo') days = num * 30;
    else days = num;
    var label;
    if (unit === 'year' || unit === 'yr') {
      if (num === 1) label = '1 Year';
      else if (num % 1 !== 0) label = num + ' Years';
      else label = num + ' Years';
    }
    else if (unit === 'month' || unit === 'mo') label = num + ' Mo';
    else label = num + ' Days';
    periods.push({ days: days, label: label });
  }
  if (periods.length === 0) {
    // No numeric period found — truncate
    var cut = s.replace(/\s*[\(\u2014\u2013].*/,'');
    return cut.length > 14 ? cut.substring(0,12) + '\u2026' : cut;
  }
  if (periods.length === 1) return periods[0].label;
  // Deduplicate near-equal periods (e.g. "2.5 years (30 months)")
  periods.sort(function(a,b){ return a.days - b.days; });
  var unique = [periods[0]];
  for (var p = 1; p < periods.length; p++) {
    if (Math.abs(periods[p].days - unique[unique.length-1].days) > unique[unique.length-1].days * 0.15) {
      unique.push(periods[p]);
    }
  }
  if (unique.length === 1) return unique[0].label;
  // Multiple periods: show range shortest–longest
  var shortest = unique[0];
  var longest = unique[unique.length - 1];
  return shortest.label + ' \u2013 ' + longest.label;
}

function shortenBidMethod(raw) {
  if (!raw || raw === 'N/A') return 'N/A';
  var s = String(raw);
  if (/^bid.?down/i.test(s)) return 'Bid-Down';
  if (/^premium/i.test(s)) return 'Premium Bid';
  if (/^highest/i.test(s)) return 'Highest Bidder';
  if (/^rotat/i.test(s)) return 'Rotational';
  if (/^over.the.counter/i.test(s)) return 'Over-the-Counter';
  if (/^municipal/i.test(s)) return 'Municipal';
  if (/^N\/A/i.test(s)) return 'N/A';
  if (/^varies/i.test(s)) return 'Varies';
  // Remove parentheticals
  var cut = s.replace(/\s*\([^)]*\)/g, '').trim();
  // Take first 3 words max
  var words = cut.split(/\s+/).slice(0, 3).join(' ');
  return words;
}

// Build detail text for a stat box popover
function buildStatDetail(shortVal, fullVal, noteVal, keyNotes, topicRx) {
  var parts = [];
  // Add the full value if it differs meaningfully from the short value
  if (fullVal && shortVal.toLowerCase() !== fullVal.toLowerCase() && fullVal.length > shortVal.length + 4) {
    parts.push(fullVal);
  }
  // Add the rate/bid note if present
  if (noteVal && noteVal.length > 0) {
    parts.push(noteVal);
  }
  // Add matching keyNotes
  if (keyNotes && keyNotes.length > 0) {
    keyNotes.forEach(function(note) {
      if (topicRx.test(note)) {
        // Avoid duplicating text already in parts
        var dominated = false;
        for (var i = 0; i < parts.length; i++) {
          if (parts[i].indexOf(note) !== -1 || note.indexOf(parts[i]) !== -1) { dominated = true; break; }
        }
        if (!dominated) parts.push(note);
      }
    });
  }
  // Cap at 3 items for readability
  if (parts.length > 3) parts = parts.slice(0, 3);
  return parts.join(' \u2022 ');
}

// Stat box popover — mobile tap toggle (desktop hover is CSS-only)
var _mobilePopover = null;
function dismissMobilePopover() {
  if (_mobilePopover) { _mobilePopover.classList.remove('mobile-open'); _mobilePopover = null; }
}
document.addEventListener('click', function(e) {
  var wrap = e.target.closest('.stat-box-wrap');
  if (wrap) {
    var pop = wrap.querySelector('.stat-popover');
    if (!pop) return;
    if (pop === _mobilePopover) {
      dismissMobilePopover();
    } else {
      dismissMobilePopover();
      pop.classList.add('mobile-open');
      _mobilePopover = pop;
    }
    e.stopPropagation();
  } else {
    dismissMobilePopover();
  }
});

function showDetail(s) {
  var t=s._v2type||s.type||s.t; var mapType=s.type; var c=s.abbr||s.c; var n=s.name||s.n||c;
  var rate=s.rate||s.y||'N/A'; var redemption=s.redemption||s.r||'N/A';
  var colors={lien:'#FFBE0B',deed:'#00D4FF',redeemable:'#FF2D55',hybrid:'#BF5FFF',forfeiture:'#FF6B35'};
  var glows={lien:'rgba(255,190,11,0.4)',deed:'rgba(0,212,255,0.4)',redeemable:'rgba(255,45,85,0.4)',hybrid:'rgba(191,95,255,0.4)',forfeiture:'rgba(255,107,53,0.4)'};
  var labels={lien:'TAX LIEN',deed:'TAX DEED',redeemable:'REDEEMABLE DEED',hybrid:'HYBRID',forfeiture:'TAX FORFEITURE'};
  var color=colors[t]||colors[mapType]||'#00D4FF';
  var glw=glows[t]||glows[mapType]||'rgba(0,212,255,0.4)';
  var panel=document.getElementById('detail-panel');
  var inner=document.getElementById('detail-panel-inner');
  inner.style.borderTop='1px solid '+color+'66';
  document.getElementById('panel-shimmer').style.cssText='height:1px;background:linear-gradient(90deg,transparent,'+color+',transparent);box-shadow:0 0 16px '+glw;

  // Investor alert — top of panel, above everything
  var alertEl=document.getElementById('panel-alert');
  if(s.investorAlert){
    alertEl.textContent=s.investorAlert;
    alertEl.classList.add('visible');
  } else {
    alertEl.textContent='';
    alertEl.classList.remove('visible');
  }

  var titleEl=document.getElementById('panel-title');
  titleEl.style.cssText="color:"+color+";text-shadow:0 0 30px "+glw;
  titleEl.innerHTML='<span class="title-abbr">'+escapeHtml(c)+'</span><span class="title-name">'+escapeHtml(n)+'</span>';
  document.getElementById('panel-type').textContent=labels[t]||t.toUpperCase();

  // Type rationale block
  var rawType=(t||'').toLowerCase();
  var typeKey=rawType.indexOf('redeemable')!==-1?'redeemable'
    :rawType.indexOf('forfeiture')!==-1?'forfeiture'
    :rawType.indexOf('hybrid')!==-1?'hybrid'
    :rawType.indexOf('deed')!==-1?'deed'
    :rawType.indexOf('lien')!==-1?'lien'
    :null;
  var rationale=typeKey?TYPE_RATIONALE[typeKey]:null;
  var rationaleEl=document.getElementById('panel-rationale');
  if(rationale){
    rationaleEl.innerHTML='<div class="type-rationale">'
      +'<p class="rationale-short">'+escapeHtml(rationale.short)+'</p>'
      +'<details class="rationale-why">'
      +'<summary>\u24D8 Why is this labeled differently on other maps?</summary>'
      +'<p>'+escapeHtml(rationale.why)+'</p>'
      +'<a href="/legal" target="_blank" rel="noopener noreferrer" class="rationale-legal-link">'
      +'View our full classification methodology \u2192</a>'
      +'</details></div>';
  } else {
    rationaleEl.innerHTML='';
  }

  // Stats: yield, redemption, bid method — short display values + detail popovers
  var bidMethod=s.bidMethod||'N/A';
  var rateShort=shortenRate(rate, t);
  var redemptionShort=shortenRedemption(redemption);
  var bidMethodShort=shortenBidMethod(bidMethod);

  // Build detail text for each stat box from full values + keyNotes
  var rateDetail=buildStatDetail(rateShort, rate, s.rateNote, s.keyNotes, /rate|interest|penalty|yield|bid.?down|%/i);
  var redemptionDetail=buildStatDetail(redemptionShort, redemption, null, s.keyNotes, /redemption|redeem|foreclos|deed|title|challenge/i);
  var bidMethodDetail=buildStatDetail(bidMethodShort, bidMethod, null, s.keyNotes, /bid|auction|premium|overbid|sheriff|municipal|highest/i);

  document.getElementById('panel-stats').innerHTML=[
    ['YIELD RATE',escapeHtml(rateShort),rateDetail],
    ['REDEMPTION',escapeHtml(redemptionShort),redemptionDetail],
    ['BID METHOD',escapeHtml(bidMethodShort),bidMethodDetail]
  ].map(function(a){
    var hasDetail=a[2]&&a[2].length>0;
    var popoverHtml=hasDetail?'<div class="stat-popover">'+escapeHtml(a[2])+'</div>':'';
    return '<div class="stat-box-wrap">'
      +'<div class="stat-box'+(hasDetail?' has-detail':'')+'" style="border-left-color:'+color+'88">'
      +'<span class="stat-info">\u24D8</span>'
      +'<div class="stat-label">'+a[0]+'</div>'
      +'<div class="stat-value" style="color:'+color+'">'+a[1]+'</div>'
      +'</div>'
      +popoverHtml
      +'</div>';
  }).join('');

  // Key notes
  var notesEl=document.getElementById('panel-notes');
  if(s.keyNotes&&s.keyNotes.length>0){
    notesEl.innerHTML=s.keyNotes.map(function(note){ return '<div class="panel-note">\u2022 '+escapeHtml(note)+'</div>'; }).join('');
  } else {
    notesEl.innerHTML='';
  }

  // Meta chips: statute, platform, timing
  var metaHtml=[];
  var chipDot=function(c){return '<span class="chip-dot" style="background:'+c+'"></span>';};
  if(s.statute){
    var statLink=s.officialLink?'<a href="'+escapeHtml(s.officialLink)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(s.statute)+'</a>':escapeHtml(s.statute);
    metaHtml.push('<span class="meta-chip">'+chipDot('#FFD700')+statLink+'</span>');
  }
  if(s.auctionPlatform) metaHtml.push('<span class="meta-chip">'+chipDot('#00D4FF')+linkifyPlatform(s.auctionPlatform)+'</span>');
  if(s.auctionTiming) metaHtml.push('<span class="meta-chip">'+chipDot('#FF6B35')+escapeHtml(s.auctionTiming)+'</span>');
  if(s.rateNote) metaHtml.push('<span class="meta-chip">'+chipDot('#BF5FFF')+escapeHtml(s.rateNote)+'</span>');
  document.getElementById('panel-meta').innerHTML=metaHtml.join('');

  // Calculator lock prompt for free users
  var calcLockEl=document.getElementById('panel-calc-lock');
  if(calcLockEl){
    if(!IS_PAID){
      calcLockEl.innerHTML='<div style="display:flex;align-items:center;gap:10px;margin-top:14px;padding:12px 14px;background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:8px">'
        +'<span style="font-size:18px">\uD83D\uDCC8</span>'
        +'<div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--text)">Return Calculator</div><div style="font-size:11px;color:var(--text2);margin-top:2px">Calculate your projected return on this state.</div></div>'
        +'<a href="'+STRIPE_URL+'" target="_blank" rel="noopener noreferrer" style="font-family:\'Space Mono\',monospace;font-size:10px;color:var(--accent);text-decoration:none;white-space:nowrap;padding:6px 12px;border:1px solid var(--accent-mid);border-radius:4px">Unlock \u2192</a>'
        +'</div>';
    } else {
      calcLockEl.innerHTML='';
    }
  }

  // Counties section — uses window.COUNTY_DATA (full) or states-en.js (thin fallback)
  var countiesEl=document.getElementById('panel-counties');
  var fullCounties=s.countyData||null;
  var thinCounties=s.counties||[];
  var countyRules=s.countyRules||null;
  var hasOtc=s.otc&&s.otc.available;
  var stPlatform=s.auctionPlatform||'';
  var stTiming=s.auctionTiming||'';
  var stRedemption=s.redemption||'';

  // Normalize: build unified array from whichever source is available
  // Handles 4 schemas: flat (co.url), nested (co.auction.url), NJ (co.countyClerk), thin (co.name/co.link)
  var rows=[];
  var rulesRd=(countyRules&&countyRules.redemption)?countyRules.redemption.period||'':'';
  var rulesAu=(countyRules&&countyRules.auction)?countyRules.auction.frequency||'':'';
  if(fullCounties&&fullCounties.length>0){
    fullCounties.forEach(function(co){
      // Resolve URL: flat co.url OR nested co.auction.url
      var auc=co.auction||{};
      var coUrl=co.url||auc.url||auc.saleUrl||'';
      var coPlat=co.platform||auc.platform||stPlatform;
      var coTiming=auc.saleDate2026||auc.frequency||rulesAu||stTiming;
      var coOtc=(co.otc&&co.otc.url)?true:hasOtc;
      var coNotes=co.saleType||auc.note||'';
      rows.push({
        name:co.county||'',
        link:coUrl,
        platform:coPlat,
        timing:coTiming,
        otc:coOtc,
        redemption:rulesRd||stRedemption,
        notes:coNotes
      });
    });
  } else if(thinCounties.length>0){
    thinCounties.forEach(function(co){
      rows.push({
        name:co.name||'',
        link:co.link||'',
        platform:co.platform||stPlatform,
        timing:stTiming,
        otc:hasOtc,
        redemption:stRedemption,
        notes:co.notes||''
      });
    });
  }

  if(rows.length===0){
    countiesEl.innerHTML='<div class="counties-empty">County data coming soon for '+escapeHtml(n)+'.</div>';
  } else {
    var cLabel=rows.length===1?'COUNTY':'COUNTIES';
    var showSearch=rows.length>5;
    var cHtml='';
    // Upgrade CTA above counties for free users
    if(!IS_PAID){
      cHtml+='<a class="detail-upgrade-cta" href="'+STRIPE_URL+'" target="_blank" rel="noopener noreferrer">UNLOCK FULL ACCESS \u2014 $197 ONE TIME<span class="detail-upgrade-sub">Comparable tools charge $200+/month. You pay once.</span></a>';
    }
    cHtml+='<div class="counties-header" onclick="toggleCounties()">'+
      '<span class="counties-label">View '+rows.length+' '+cLabel+'</span>'+
      '<span class="counties-count" id="counties-count-badge">'+rows.length+'</span>'+
      '<span class="counties-chevron" id="counties-chevron">\u25B6</span>'+
    '</div>';
    if(showSearch){
      cHtml+='<div class="county-search-wrap" id="county-search-wrap" style="display:none">'+
        '<input type="text" class="county-search-input" id="county-search-input" placeholder="Search counties..." oninput="filterCounties(this.value)" autocomplete="off" spellcheck="false">'+
        '<button class="county-search-clear" id="county-search-clear" onclick="clearCountySearch()" aria-label="Clear search">\u00D7</button>'+
      '</div>';
    }
    // Show redemption/note once above list (used on mobile instead of per-row pills)
    var redemptionNote=rows.length>0?rows[0].redemption:'';
    if(redemptionNote){
      cHtml+='<div class="county-redemption-note">'+escapeHtml(redemptionNote)+'</div>';
    }
    cHtml+='<div class="counties-list collapsed" id="counties-list">';
    window._countyTotal=rows.length;
    rows.forEach(function(r){
      var safeName=escapeHtml(r.name);
      var safeLink=safeHref(r.link);
      // County name — clickable link to official auction page
      var nameTag=safeLink?'<a class="county-name" href="'+safeLink+'" target="_blank" rel="noopener noreferrer">'+safeName+'</a>':'<span class="county-name">'+safeName+'</span>';
      // Platform pill — clickable if URL known
      var platPill='';
      if(r.platform){
        var platSafe=escapeHtml(shortenPlatform(r.platform));
        var platUrl=PLATFORM_URLS[shortenPlatform(r.platform)]||'';
        if(platUrl){platPill='<span class="county-pill platform"><a href="'+platUrl+'" target="_blank" rel="noopener noreferrer">'+platSafe+'</a></span>';}
        else{platPill='<span class="county-pill platform">'+platSafe+'</span>';}
      }
      // OTC badge
      var otcPill=r.otc?'<span class="county-pill otc">OTC</span>':'';
      // Timing pill
      var timPill=r.timing?'<span class="county-pill timing">'+escapeHtml(r.timing)+'</span>':'';
      // Redemption pill
      var redPill=r.redemption?'<span class="county-pill redemption">'+escapeHtml(r.redemption)+'</span>':'';
      // Notes
      var safeNotes=r.notes?escapeHtml(r.notes):'';
      var noteSpan=safeNotes?'<span class="county-notes" title="'+safeNotes.replace(/"/g,'&quot;')+'">'+safeNotes+'</span>':'';
      var rowClick=' onclick="loadPropertyFeed(\''+escapeHtml(c)+'\',\''+escapeHtml(r.name).replace(/'/g,"\\'")+'\');"';
      cHtml+='<div class="county-row"'+rowClick+' data-county-name="'+escapeHtml(r.name.toLowerCase())+'">'+nameTag+platPill+otcPill+timPill+redPill+noteSpan+'</div>';
    });
    cHtml+='</div>';
    if(showSearch){cHtml+='<div class="county-no-results" id="county-no-results">No counties match your search</div>';}
    countiesEl.innerHTML=cHtml;
  }

  var panelCtaEl = document.getElementById('panel-cta');
  if (panelCtaEl) panelCtaEl.style.cssText="width:100%;margin-top:12px;padding:12px;border-radius:3px;cursor:pointer;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:0.2em;background:"+color+"28;border:1px solid "+color+"88;color:"+color+";box-shadow:0 4px 20px "+glw;

  // Save State button
  var saveSlot = document.getElementById('panel-save-state');
  if (saveSlot) {
    var isSaved = getSavedStates().indexOf(c) >= 0;
    saveSlot.innerHTML = '<button class="save-state-btn' + (isSaved ? ' saved' : '') + '" onclick="toggleSaveState(\'' + escapeHtml(c) + '\')">' +
      '<span class="bookmark-icon">' + (isSaved ? '\u2605' : '\u2606') + '</span>' +
      '<span>' + (isSaved ? 'STATE SAVED' : 'SAVE THIS STATE') + '</span>' +
    '</button>';
  }

  panel.classList.add('open');
  trackMapExploration(c);
}

function closeDetail() {
  selectedState=null;
  var panel=document.getElementById('detail-panel');
  panel.classList.remove('open');
  var alertEl=document.getElementById('panel-alert');
  if(alertEl) alertEl.classList.remove('visible');
  resetMapColors();
}

