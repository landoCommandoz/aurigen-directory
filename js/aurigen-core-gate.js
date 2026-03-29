// RULE: warroom-billion.html NEVER redirects to gate.html. Access control is UI-only (free vs paid view). No URL redirects. Ever.
// === GATE CHECK — set access tier, NO redirect ===
(function() {
  try {
    var access = localStorage.getItem('aurigen_access');
    if (!access) {
      // First visit — default to free tier, no redirect
      try { localStorage.setItem('aurigen_access', 'free'); } catch(e2) {}
      access = 'free';
    }
    // JWT validation (primary) — if JWT exists, validate server-side
    var jwt = localStorage.getItem('aurigen_jwt');
    if (jwt) {
      var _jwtResolved = false;
      var jwtTimeout = setTimeout(function() {
        if (_jwtResolved) return;
        // Timeout: show overlay and retry once
        console.warn('[GATE] JWT validation timed out after 2s — retrying');
        var overlay = document.createElement('div');
        overlay.id = 'gate-verify-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(10,14,26,0.95);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;font-family:"Plus Jakarta Sans",sans-serif';
        overlay.innerHTML = '<div style="font-family:Bebas Neue,sans-serif;font-size:24px;letter-spacing:0.1em;color:#c9a84c">VERIFYING YOUR SESSION</div><div style="font-size:13px;color:rgba(232,228,220,0.6)">Please wait...</div>';
        document.body.appendChild(overlay);
        // Retry after 3s
        setTimeout(function() {
          if (_jwtResolved) { if (overlay.parentNode) overlay.remove(); return; }
          fetch('/.netlify/functions/validate-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jwt: jwt })
          })
          .then(function(r) { return r.json(); })
          .then(function(data) {
            _jwtResolved = true;
            if (overlay.parentNode) overlay.remove();
            if (data.valid && data.tier === 'paid') {
              try {
                localStorage.setItem('aurigen_access', 'paid');
                localStorage.setItem('aurigen_email', data.email || '');
                localStorage.setItem('aurigen_is_admin', data.isAdmin ? 'true' : 'false');
              } catch(e) {}
              if (access !== 'paid') location.reload();
            } else {
              try { localStorage.removeItem('aurigen_jwt'); localStorage.removeItem('aurigen_is_admin'); localStorage.setItem('aurigen_access', 'free'); } catch(e) {}
              if (access === 'paid') location.reload();
            }
          })
          .catch(function() {
            _jwtResolved = true;
            // Second attempt failed — revoke paid, show error
            try { localStorage.removeItem('aurigen_jwt'); localStorage.removeItem('aurigen_is_admin'); localStorage.setItem('aurigen_access', 'free'); } catch(e) {}
            overlay.innerHTML = '<div style="font-family:Bebas Neue,sans-serif;font-size:24px;letter-spacing:0.1em;color:#c9a84c">UNABLE TO VERIFY SESSION</div><div style="font-size:13px;color:rgba(232,228,220,0.6);max-width:400px;text-align:center;line-height:1.6">Please refresh the page or contact support at landon@theaurigen.com</div><button onclick="location.reload()" style="margin-top:12px;padding:10px 24px;background:transparent;border:1px solid rgba(201,168,76,0.4);color:#c9a84c;font-family:Space Mono,monospace;font-size:11px;letter-spacing:0.1em;cursor:pointer;border-radius:4px">REFRESH</button>';
          });
        }, 3000);
      }, 2000);
      fetch('/.netlify/functions/validate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: jwt })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        _jwtResolved = true;
        clearTimeout(jwtTimeout);
        if (data.valid && data.tier === 'paid') {
          // JWT valid — ensure localStorage matches
          try {
            localStorage.setItem('aurigen_access', 'paid');
            localStorage.setItem('aurigen_email', data.email || '');
            // Store server-issued admin flag (from JWT payload)
            localStorage.setItem('aurigen_is_admin', data.isAdmin ? 'true' : 'false');
          } catch(e) {}
          if (access !== 'paid') { location.reload(); }
        } else {
          // JWT invalid/expired — clear and fall back
          try {
            localStorage.removeItem('aurigen_jwt');
            localStorage.removeItem('aurigen_is_admin');
            localStorage.setItem('aurigen_access', 'free');
          } catch(e) {}
          if (access === 'paid') { location.reload(); }
        }
      })
      .catch(function() {
        // Network error on first attempt — let timeout handler retry
      });
    } else {
      // No JWT — server-verify access via email (legacy path)
      var email = localStorage.getItem('aurigen_email');
      if (email) {
        var _legacyJwt = '';
        try { _legacyJwt = localStorage.getItem('aurigen_jwt') || ''; } catch(le) {}
        fetch('/.netlify/functions/check-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _legacyJwt },
          body: JSON.stringify({ email: email })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var serverTier = data.access || 'free';
          try { localStorage.setItem('aurigen_access', serverTier); } catch(e) {}
          if (serverTier !== access) { location.reload(); }
        })
        .catch(function() { /* Offline: trust cached tier */ });
      }
    }
  } catch(e) {}
})();

// === TAB SYNC — unlock animation when paid access granted ===
try {
  window.addEventListener('storage', function(e) {
    if (e.key === 'aurigen_access' && e.newValue === 'paid') {
      playUnlockAnimation();
    }
  });
} catch(e) {}

function playUnlockAnimation() {
  // Update tier
  IS_PAID = true;
  IS_FREE = true;
  APP.tier = 2;

  // Show toast
  var toast = document.createElement('div');
  toast.className = 'unlock-toast';
  toast.innerHTML = '<span class="unlock-lock-spin">&#128275;</span> FULL ACCESS UNLOCKED';
  document.body.appendChild(toast);

  // Remove locks with animation
  applyAccessLocks();

  // Glow on nav tabs
  document.querySelectorAll('.nav-tab').forEach(function(t) {
    t.classList.add('unlock-glow');
    setTimeout(function() { t.classList.remove('unlock-glow'); }, 1500);
  });

  // Auto-dismiss toast
  setTimeout(function() {
    toast.classList.add('dismiss');
    setTimeout(function() { toast.remove(); }, 400);
  }, 3000);
}

// Check if just unlocked (from success.html redirect)
(function checkJustUnlocked() {
  try {
    var justPaid = sessionStorage.getItem('aurigen_just_paid');
    if (justPaid === '1') {
      sessionStorage.removeItem('aurigen_just_paid');
      setTimeout(playUnlockAnimation, 800);
    }
  } catch(e) {}
})();

// === I18N — BILINGUAL SYSTEM ===
var LANG = 'en';
try { LANG = localStorage.getItem('aurigen_language') || 'en'; } catch(e) {}

var I18N = {
  en: {
    // Nav
    nav_map:'Map', nav_auctions:'Auctions', nav_account:'Account',
    nav_tools_menu:'Tools',
    nav_tier_free:'FREE', nav_tier_paid:'FULL ACCESS',
    nav_mobile_upgrade:'Full Access \u2192',
    // Map header
    map_brand_sub:'COUNTY INTELLIGENCE PLATFORM',
    map_tab_map:'\u25C7  MAP', map_tab_list:'\u2261  LIST',
    mfp_title:'State Intelligence', mfp_subtitle:'51 jurisdictions \u00B7 Click any state',
    mfp_search_placeholder:'Search states\u2026',
    mfp_filter_title:'FILTER BY TYPE',
    type_lien:'Tax Lien', type_deed:'Tax Deed', type_redeemable:'Redeemable',
    type_hybrid:'Hybrid', type_forfeiture:'Forfeiture', type_all:'ALL',
    mfp_show_all:'Show All',
    map_footer_left:'AURIGEN \u00B7 TAX INVESTMENT INTELLIGENCE \u00B7 2026',
    map_footer_right:'51 JURISDICTIONS',
    // State modal
    stat_yield:'YIELD RATE', stat_redemption:'REDEMPTION', stat_bid:'BID METHOD',
    detail_open:'Open Full Detail \u2192',
    next_step:'Next Step',
    next_step_compare:'See how {state} compares',
    next_step_compare_sub:'Open Versus with this state pre-loaded',
    next_step_compare_btn:'Compare {state} in Versus \u2192',
    // Versus
    vs_topbar_title:'AURIGEN \u2014 VERSUS INTELLIGENCE',
    vs_topbar_status:'SECURE \u00B7 READ ONLY',
    vs_cmd_prefix:'$ aurigen compare',
    vs_state_a:'STATE A:', vs_state_b:'STATE B:',
    vs_col_metric:'METRIC',
    vs_type:'TYPE', vs_yield:'YIELD RATE', vs_redemption:'REDEMPTION',
    vs_bid:'BID METHOD', vs_platform:'PLATFORM', vs_beginner:'BEGINNER',
    vs_edge:'EDGE',
    vs_analysis:'> ANALYSIS OUTPUT',
    vs_disclaimer:'DATA SHOWN REFLECTS STATUTORY PROVISIONS \u00B7 MAY VARY BY COUNTY \u00B7 CONSULT A QUALIFIED PROFESSIONAL BEFORE INVESTING',
    // Versus locked
    vs_lock_title:'UNLOCK VERSUS',
    vs_lock_desc:'Compare any two states side by side \u2014 yield rates, redemption periods, bid methods, and platforms. Built for investors choosing their next market.',
    // DNA
    dna_lock_title:'UNLOCK DNA PROFILER',
    dna_lock_desc:'Answer 6 questions. Get your investor archetype \u2014 Yield Maximizer, Deal Hunter, Patient Capitalist, Local Operator, or Portfolio Builder. Every other tool in the platform adapts to your profile.',
    dna_title:'INVESTOR DNA',
    dna_continue:'Continue', dna_back:'Back',
    dna_top_matches:'TOP MATCHES', dna_signals:'PROFILE SIGNALS',
    dna_risk:'Risk Tolerance', dna_capital:'Capital Range',
    dna_timeline:'Timeline Horizon', dna_strategy:'Strategy Type',
    dna_retake:'Retake Quiz', dna_share:'\uD83D\uDCF8 Share your profile',
    dna_completion:'Your profile is ready. Use the Analyzer to run your numbers, or open Versus to compare your top matches side by side.',
    dna_disclaimer:'This quiz is for educational purposes only. Rates shown are statutory maximums \u2014 actual returns vary. This does not constitute investment advice.',
    // Advisor / Sage
    sage_lock_title:'UNLOCK SAGE AI ADVISOR',
    sage_lock_desc:'Ask Sage anything about tax lien or deed investing. Personalizes responses based on your DNA profile and investor type.',
    sage_placeholder:'Ask Sage anything\u2026',
    sage_send:'Send',
    sage_disclaimer:'Sage is an educational research assistant, not a financial advisor. It does not constitute financial, legal, or investment advice. Always verify information with official sources.',
    // Tools / Analyzer
    tools_lock_title:'UNLOCK DEAL ANALYZER',
    tools_lock_desc:'Run real numbers on any deal. Enter purchase price, back taxes, ARV. Get projected ROI, margin of safety, and a clear go/no-go signal.',
    da_tab_analyzer:'Deal Analyzer', da_tab_quick:'Quick Tools', da_tab_summary:'My Summary',
    da_amount_label:'Investment Amount',
    da_state_a:'STATE A', da_state_b:'STATE B',
    da_conservative:'Conservative', da_realistic:'Realistic', da_optimistic:'Optimistic',
    da_projected:'Projected Return', da_interest:'Interest Earned',
    da_total:'Total Recovered', da_yield:'Effective Annual Yield',
    da_hold:'Hold Period', da_better:'HIGHER PROJECTED',
    da_open_versus:'Open in Versus \u2192',
    da_disclaimer:'Rates shown are statutory maximums. Actual returns depend on competitive bidding and redemption outcomes. Bid-down states typically yield below the statutory ceiling in competitive counties. This is not financial advice. Always verify with the official county or state authority before transacting.',
    // Scout
    scout_lock_title:'UNLOCK SCOUT',
    scout_lock_desc:'10-step due diligence checklist for any property. Walk through title, liens, condition, comparables, and exit strategy before you spend a dollar.',
    scout_title:'SCOUT', scout_sub:'DUE DILIGENCE TRACKER',
    scout_new:'+ New Deal',
    scout_why:'WHY IT MATTERS', scout_how:'HOW TO DO IT',
    scout_where:'WHERE', scout_red:'RED FLAGS', scout_pro:'PRO TIP',
    scout_notes:'YOUR NOTES', scout_notes_placeholder:'Add your notes for this step\u2026',
    scout_complete:'Mark Complete', scout_flag:'Flag Issue',
    scout_disclaimer:'This checklist is for educational and research purposes only. It does not constitute legal, financial, or investment advice. Always conduct independent due diligence and consult a qualified professional before investing.',
    // Auctions
    auctions_lock_title:'UNLOCK AUCTIONS',
    auctions_lock_desc:'Upcoming auction calendar across all 51 states. Filter by state, format, and date. Never miss a sale in your target market.',
    auctions_register:'Register \u2192',
    auctions_online:'ONLINE', auctions_in_person:'IN-PERSON',
    // Account
    acct_tier_free:'FREE ACCESS', acct_tier_paid:'FULL ACCESS',
    acct_email:'Email', acct_level:'Access Level', acct_level_free:'Free', acct_level_paid:'Full Access',
    acct_map:'Map Access', acct_map_val:'All 51 States',
    acct_locked:'Locked Features',
    acct_locked_val:'Counties, DNA, Versus, Analyzer, Sage, Scout, Warbook, Deadlines, Recon, Dossier, Auctions, Pulse',
    acct_what_unlock:'WHAT YOU UNLOCK',
    vc_county:'County Directory', vc_dna:'DNA Investor Profiler',
    vc_versus:'Versus Comparison', vc_analyzer:'Deal Analyzer',
    vc_sage:'Sage AI Advisor', vc_scout:'Scout Due Diligence',
    vc_auctions:'Auctions Calendar', vc_pulse:'Pulse Alerts',
    acct_value_total:'Total estimated value if purchased as separate tools: $1,500+/year \u2014 yours for $197 once.',
    acct_upgrade:'UNLOCK FULL ACCESS \u2014 $197 ONE TIME',
    acct_upgrade_sub:'Comparable tools charge $200+/month. You pay once.',
    lang_label:'LANGUAGE / IDIOMA',
    // Paywall generic
    paywall_cta:'UNLOCK FULL ACCESS \u2014 $197 ONE TIME',
    paywall_sub:'Comparable tools charge $200+/month. You pay once.',
    // Disclaimer
    disclaimer_full:'This directory is for informational and educational purposes only. It does not constitute investment, legal, or financial advice. Tax lien and tax deed investing involves risk. Always conduct independent due diligence and consult a qualified professional before investing. Rates and rules are subject to change \u2014 verify with the official county or state authority before transacting.',
    disclaimer_short:'Educational only \u00B7 Not investment advice',
    disclaimer_legal:'Legal',
    disclaimer_view_full:'View Full Legal Page \u2192',
    // Ticker
    ticker_aurigen:'AURIGEN', ticker_platform:'INTELLIGENCE PLATFORM',
    // Pulse
    pulse_title:'PULSE', pulse_new:'New',
    pulse_disclaimer:'Dates based on published schedules \u2014 verify with official authority.',
    pulse_lock_title:'UNLOCK PULSE',
    pulse_lock_desc:'Real-time alerts when new auctions drop in your watched states. Set it once \u2014 Pulse notifies you.',
    // Phase 4 tools
    warbook_title:'WARBOOK', warbook_sub:'COMPETITIVE INTELLIGENCE',
    warbook_lock_title:'UNLOCK WARBOOK',
    warbook_lock_desc:'Competition rating per state. Surfaces OTC opportunities, lower-competition counties, and tactical edges.',
    deadlines_title:'DEADLINES', deadlines_sub:'COUNTDOWN DASHBOARD',
    deadlines_lock_title:'UNLOCK DEADLINES',
    deadlines_lock_desc:'Countdown dashboard for your target states. Registration, deposit, auction, and filing deadlines.',
    recon_title:'RECON', recon_sub:'AUCTION WALKTHROUGH',
    recon_lock_title:'UNLOCK RECON',
    recon_lock_desc:'State-specific auction walkthrough. Step by step from registration to winning bid.',
    dossier_title:'DOSSIER', dossier_sub:'INVESTOR BRIEFING',
    dossier_lock_title:'UNLOCK DOSSIER',
    dossier_lock_desc:'Single-page printable investor briefing. Compiles your DNA, top states, and action plan.',
    // Journey bar
    journey_map:'MAP', journey_county:'COUNTY', journey_pulse:'PULSE',
    journey_quiz:'QUIZ', journey_access:'ACCESS',
    // Pulse create
    pulse_create:'Create Alert', pulse_create_state:'State',
    pulse_create_type:'Type', pulse_create_text:'Alert text',
    pulse_create_submit:'Create', pulse_create_cancel:'Cancel',
    // Account extras
    acct_usage:'USAGE STATS', acct_freshness:'DATA FRESHNESS',
    acct_referral_title:'REFERRAL PROGRAM',
    acct_feature_compare:'FEATURE COMPARISON',
    // County panel labels
    county_yield:'YIELD RATE', county_redemption:'REDEMPTION', county_bid:'BID METHOD',
    county_view:'View', county_counties:'COUNTIES', county_county:'COUNTY',
    county_search:'Search counties\u2026', county_empty:'County data coming soon for',
    county_otc:'OTC',
    // Score tiers
    score_elite:'ELITE', score_strong:'STRONG', score_moderate:'MODERATE', score_weak:'WEAK',
    score_pending:'Score pending',
    // First Deal flow
    fd_title:'MY FIRST DEAL', fd_step:'Step',
    fd_step1:'CHOOSE YOUR STATE', fd_step1_desc:'Click any state on the map to begin.',
    fd_step2:'PICK A COUNTY', fd_step2_desc:'Open a county panel to explore local data.',
    fd_step3:'RUN THE DOSSIER', fd_step3_desc:'Generate your investor briefing for this county.',
    fd_step4:'SCOUT CHECKLIST', fd_step4_desc:'Run due diligence on your target property.',
    fd_step5:'SET A PULSE ALERT', fd_step5_desc:'Save this state to track upcoming auctions.',
    fd_complete:'YOUR FIRST DEAL PIPELINE IS SET',
    fd_upgrade:'Unlock full access to continue your first deal \u2192'
  },
  es: {
    // Nav
    nav_map:'Mapa', nav_auctions:'Subastas', nav_account:'Cuenta',
    nav_tools_menu:'Herramientas',
    nav_tier_free:'GRATIS', nav_tier_paid:'ACCESO COMPLETO',
    nav_mobile_upgrade:'Acceso Completo \u2192',
    // Map header
    map_brand_sub:'PLATAFORMA DE INTELIGENCIA POR CONDADO',
    map_tab_map:'\u25C7  MAPA', map_tab_list:'\u2261  LISTA',
    mfp_title:'Inteligencia Estatal', mfp_subtitle:'51 jurisdicciones \u00B7 Haz clic en cualquier estado',
    mfp_search_placeholder:'Buscar estados\u2026',
    mfp_filter_title:'FILTRAR POR TIPO',
    type_lien:'Tax Lien', type_deed:'Tax Deed', type_redeemable:'Redimible',
    type_hybrid:'H\u00edbrido', type_forfeiture:'Confiscaci\u00f3n', type_all:'TODOS',
    mfp_show_all:'Mostrar Todo',
    map_footer_left:'AURIGEN \u00B7 INTELIGENCIA DE INVERSI\u00d3N FISCAL \u00B7 2026',
    map_footer_right:'51 JURISDICCIONES',
    // State modal
    stat_yield:'TASA DE RENDIMIENTO', stat_redemption:'PER\u00cdODO DE RESCATE', stat_bid:'M\u00c9TODO DE PUJA',
    detail_open:'Ver Detalle Completo \u2192',
    next_step:'Siguiente Paso',
    next_step_compare:'Ver c\u00f3mo se compara {state}',
    next_step_compare_sub:'Abrir Versus con este estado precargado',
    next_step_compare_btn:'Comparar {state} en Versus \u2192',
    // Versus
    vs_topbar_title:'AURIGEN \u2014 INTELIGENCIA VERSUS',
    vs_topbar_status:'SEGURO \u00B7 SOLO LECTURA',
    vs_cmd_prefix:'$ aurigen comparar',
    vs_state_a:'ESTADO A:', vs_state_b:'ESTADO B:',
    vs_col_metric:'M\u00c9TRICA',
    vs_type:'TIPO', vs_yield:'TASA DE RENDIMIENTO', vs_redemption:'PER\u00cdODO DE RESCATE',
    vs_bid:'M\u00c9TODO DE PUJA', vs_platform:'PLATAFORMA', vs_beginner:'PRINCIPIANTE',
    vs_edge:'VENTAJA',
    vs_analysis:'> AN\u00c1LISIS',
    vs_disclaimer:'LOS DATOS REFLEJAN DISPOSICIONES LEGALES \u00B7 PUEDEN VARIAR POR CONDADO \u00B7 CONSULTA A UN PROFESIONAL CALIFICADO ANTES DE INVERTIR',
    // Versus locked
    vs_lock_title:'DESBLOQUEAR VERSUS',
    vs_lock_desc:'Compara dos estados lado a lado \u2014 tasas de rendimiento, per\u00edodos de redenci\u00f3n, m\u00e9todos de puja y plataformas. Dise\u00f1ado para inversores eligiendo su pr\u00f3ximo mercado.',
    // DNA
    dna_lock_title:'DESBLOQUEAR PERFIL DNA',
    dna_lock_desc:'Responde 6 preguntas. Obt\u00e9n tu arquetipo de inversor \u2014 Maximizador de Rendimiento, Cazador de Oportunidades, Capitalista Paciente, Operador Local, o Constructor de Portafolio. Cada herramienta se adapta a tu perfil.',
    dna_title:'ADN DE INVERSOR',
    dna_continue:'Continuar', dna_back:'Atr\u00e1s',
    dna_top_matches:'MEJORES COINCIDENCIAS', dna_signals:'SE\u00d1ALES DE PERFIL',
    dna_risk:'Tolerancia al Riesgo', dna_capital:'Rango de Capital',
    dna_timeline:'Horizonte de Tiempo', dna_strategy:'Tipo de Estrategia',
    dna_retake:'Repetir Quiz', dna_share:'\uD83D\uDCF8 Compartir tu perfil',
    dna_completion:'Tu perfil est\u00e1 listo. Usa el Analizador para calcular tus n\u00fameros, o abre Versus para comparar tus mejores coincidencias.',
    dna_disclaimer:'Este quiz es solo para fines educativos. Las tasas mostradas son m\u00e1ximos legales \u2014 los rendimientos reales var\u00edan. No constituye asesoramiento de inversi\u00f3n.',
    // Advisor / Sage
    sage_lock_title:'DESBLOQUEAR ASESOR IA SAGE',
    sage_lock_desc:'Pregunta a Sage cualquier cosa sobre inversi\u00f3n en grav\u00e1menes o escrituras fiscales. Personaliza respuestas seg\u00fan tu perfil DNA y tipo de inversionista.',
    sage_placeholder:'Preg\u00fantale a Sage\u2026',
    sage_send:'Enviar',
    sage_disclaimer:'Sage es un asistente de investigaci\u00f3n educativa, no un asesor financiero. No constituye asesoramiento financiero, legal o de inversi\u00f3n. Siempre verifica la informaci\u00f3n con fuentes oficiales.',
    // Tools / Analyzer
    tools_lock_title:'DESBLOQUEAR ANALIZADOR DE INVERSIONES',
    tools_lock_desc:'Calcula n\u00fameros reales para cualquier negocio. Ingresa precio de compra, impuestos atrasados, ARV. Obt\u00e9n ROI proyectado, margen de seguridad y una se\u00f1al clara.',
    da_tab_analyzer:'Analizador', da_tab_quick:'Herramientas R\u00e1pidas', da_tab_summary:'Mi Resumen',
    da_amount_label:'Monto de Inversi\u00f3n',
    da_state_a:'ESTADO A', da_state_b:'ESTADO B',
    da_conservative:'Conservador', da_realistic:'Realista', da_optimistic:'Optimista',
    da_projected:'Rendimiento Proyectado', da_interest:'Inter\u00e9s Ganado',
    da_total:'Total Recuperado', da_yield:'Rendimiento Anual Efectivo',
    da_hold:'Per\u00edodo de Tenencia', da_better:'MAYOR PROYECCI\u00d3N',
    da_open_versus:'Abrir en Versus \u2192',
    da_disclaimer:'Las tasas mostradas son m\u00e1ximos legales. Los rendimientos reales dependen de la puja competitiva y los resultados de redenci\u00f3n. Los estados con puja descendente t\u00edpicamente rinden por debajo del techo legal en condados competitivos. Esto no es asesoramiento financiero. Siempre verifica con la autoridad oficial del condado o estado.',
    // Scout
    scout_lock_title:'DESBLOQUEAR SCOUT',
    scout_lock_desc:'Lista de verificaci\u00f3n de debida diligencia de 10 pasos para cualquier propiedad. Revisa t\u00edtulo, grav\u00e1menes, condici\u00f3n, comparables y estrategia de salida antes de gastar un d\u00f3lar.',
    scout_title:'SCOUT', scout_sub:'RASTREADOR DE DEBIDA DILIGENCIA',
    scout_new:'+ Nueva Operaci\u00f3n',
    scout_why:'POR QU\u00c9 IMPORTA', scout_how:'C\u00d3MO HACERLO',
    scout_where:'D\u00d3NDE', scout_red:'SE\u00d1ALES DE ALERTA', scout_pro:'CONSEJO PRO',
    scout_notes:'TUS NOTAS', scout_notes_placeholder:'Agrega tus notas para este paso\u2026',
    scout_complete:'Marcar Completo', scout_flag:'Marcar Problema',
    scout_disclaimer:'Esta lista es solo para fines educativos y de investigaci\u00f3n. No constituye asesoramiento legal, financiero o de inversi\u00f3n. Siempre realiza una debida diligencia independiente y consulta con un profesional calificado antes de invertir.',
    // Auctions
    auctions_lock_title:'DESBLOQUEAR SUBASTAS',
    auctions_lock_desc:'Calendario de pr\u00f3ximas subastas en los 51 estados. Filtra por estado, formato y fecha. No te pierdas ninguna venta en tu mercado objetivo.',
    auctions_register:'Registrarse \u2192',
    auctions_online:'EN L\u00cdNEA', auctions_in_person:'EN PERSONA',
    // Account
    acct_tier_free:'ACCESO GRATUITO', acct_tier_paid:'ACCESO COMPLETO',
    acct_email:'Email', acct_level:'Nivel de Acceso', acct_level_free:'Gratuito', acct_level_paid:'Acceso Completo',
    acct_map:'Acceso al Mapa', acct_map_val:'Los 51 Estados',
    acct_locked:'Funciones Bloqueadas',
    acct_locked_val:'Condados, DNA, Versus, Analizador, Sage, Scout, Warbook, Deadlines, Recon, Dossier, Subastas, Pulse',
    acct_what_unlock:'LO QUE DESBLOQUEAS',
    vc_county:'Directorio de Condados', vc_dna:'Perfil de Inversor DNA',
    vc_versus:'Comparaci\u00f3n Versus', vc_analyzer:'Analizador de Inversiones',
    vc_sage:'Asesor IA Sage', vc_scout:'Debida Diligencia Scout',
    vc_auctions:'Calendario de Subastas', vc_pulse:'Alertas Pulse',
    acct_value_total:'Valor total estimado si se compra como herramientas separadas: $1,500+/a\u00f1o \u2014 tuyo por $197 una vez.',
    acct_upgrade:'DESBLOQUEAR ACCESO COMPLETO \u2014 $197 PAGO \u00daNICO',
    acct_upgrade_sub:'Herramientas similares cobran $200+/mes. T\u00fa pagas una vez.',
    lang_label:'LANGUAGE / IDIOMA',
    // Paywall generic
    paywall_cta:'DESBLOQUEAR ACCESO COMPLETO \u2014 $197 PAGO \u00daNICO',
    paywall_sub:'Herramientas similares cobran $200+/mes. T\u00fa pagas una vez.',
    // Disclaimer
    disclaimer_full:'Este directorio es solo para fines informativos y educativos. No constituye asesoramiento de inversi\u00f3n, legal o financiero. Invertir en grav\u00e1menes y escrituras fiscales implica riesgo. Siempre realiza una debida diligencia independiente y consulta con un profesional calificado antes de invertir. Las tasas y reglas est\u00e1n sujetas a cambios \u2014 verifica con la autoridad oficial del condado o estado antes de realizar transacciones.',
    disclaimer_short:'Solo educativo \u00B7 No es asesoramiento de inversi\u00f3n',
    disclaimer_legal:'Legal',
    disclaimer_view_full:'Ver P\u00e1gina Legal Completa \u2192',
    // Ticker
    ticker_aurigen:'AURIGEN', ticker_platform:'PLATAFORMA DE INTELIGENCIA',
    // Pulse
    pulse_title:'PULSE', pulse_new:'Nuevas',
    pulse_disclaimer:'Fechas basadas en calendarios publicados \u2014 verifica con la autoridad oficial.',
    pulse_lock_title:'DESBLOQUEAR PULSE',
    pulse_lock_desc:'Alertas en tiempo real cuando nuevas subastas aparecen en tus estados. Conf\u00edguralo una vez \u2014 Pulse te notifica.',
    // Phase 4 tools
    warbook_title:'WARBOOK', warbook_sub:'INTELIGENCIA COMPETITIVA',
    warbook_lock_title:'DESBLOQUEAR WARBOOK',
    warbook_lock_desc:'Calificaci\u00f3n de competencia por estado. Oportunidades OTC, condados de menor competencia y ventajas t\u00e1cticas.',
    deadlines_title:'FECHAS L\u00cdMITE', deadlines_sub:'PANEL DE CUENTA REGRESIVA',
    deadlines_lock_title:'DESBLOQUEAR FECHAS L\u00cdMITE',
    deadlines_lock_desc:'Panel de cuenta regresiva para tus estados objetivo. Registro, dep\u00f3sito, subasta y fechas de documentaci\u00f3n.',
    recon_title:'RECON', recon_sub:'GU\u00cdA DE SUBASTA',
    recon_lock_title:'DESBLOQUEAR RECON',
    recon_lock_desc:'Gu\u00eda de subasta espec\u00edfica por estado. Paso a paso desde el registro hasta la puja ganadora.',
    dossier_title:'DOSSIER', dossier_sub:'INFORME DE INVERSOR',
    dossier_lock_title:'DESBLOQUEAR DOSSIER',
    dossier_lock_desc:'Informe de inversor de una p\u00e1gina imprimible. Compila tu DNA, mejores estados y plan de acci\u00f3n.',
    // Journey bar
    journey_map:'MAPA', journey_county:'CONDADO', journey_pulse:'PULSE',
    journey_quiz:'QUIZ', journey_access:'ACCESO',
    // Pulse create
    pulse_create:'Crear Alerta', pulse_create_state:'Estado',
    pulse_create_type:'Tipo', pulse_create_text:'Texto de alerta',
    pulse_create_submit:'Crear', pulse_create_cancel:'Cancelar',
    // Account extras
    acct_usage:'ESTAD\u00cdSTICAS DE USO', acct_freshness:'ACTUALIZACI\u00d3N DE DATOS',
    acct_referral_title:'PROGRAMA DE REFERIDOS',
    acct_feature_compare:'COMPARACI\u00d3N DE FUNCIONES',
    // County panel labels
    county_yield:'TASA DE RENDIMIENTO', county_redemption:'PER\u00cdODO DE RESCATE', county_bid:'M\u00c9TODO DE PUJA',
    county_view:'Ver', county_counties:'CONDADOS', county_county:'CONDADO',
    county_search:'Buscar condados\u2026', county_empty:'Datos de condados disponibles pr\u00f3ximamente para',
    county_otc:'OTC',
    // Score tiers
    score_elite:'\u00c9LITE', score_strong:'FUERTE', score_moderate:'MODERADO', score_weak:'D\u00c9BIL',
    score_pending:'Puntuaci\u00f3n pendiente',
    // First Deal flow
    fd_title:'MI PRIMERA OPERACI\u00d3N', fd_step:'Paso',
    fd_step1:'ELIGE TU ESTADO', fd_step1_desc:'Haz clic en cualquier estado del mapa para comenzar.',
    fd_step2:'ELIGE UN CONDADO', fd_step2_desc:'Abre un panel de condado para explorar datos locales.',
    fd_step3:'GENERA EL DOSSIER', fd_step3_desc:'Genera tu informe de inversor para este condado.',
    fd_step4:'LISTA DE SCOUT', fd_step4_desc:'Ejecuta la debida diligencia en tu propiedad objetivo.',
    fd_step5:'CONFIGURA UNA ALERTA PULSE', fd_step5_desc:'Guarda este estado para rastrear pr\u00f3ximas subastas.',
    fd_complete:'TU PRIMERA OPERACI\u00d3N EST\u00c1 LISTA',
    fd_upgrade:'Desbloquea acceso completo para continuar tu primer negocio \u2192'
  }
};

function t(key) {
  var strings = I18N[LANG] || I18N.en;
  return strings[key] || (I18N.en[key] || key);
}

function applyLanguage(lang) {
  LANG = lang || 'en';
  try { localStorage.setItem('aurigen_language', LANG); } catch(e) {}
  // Static data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var val = t(key);
    if (val) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    }
  });
  // data-i18n-html for elements needing innerHTML
  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-html');
    var val = t(key);
    if (val) el.innerHTML = val;
  });
  // Update language toggle active state
  var enBtn = document.getElementById('lang-en');
  var esBtn = document.getElementById('lang-es');
  if (enBtn) enBtn.classList.toggle('active', LANG === 'en');
  if (esBtn) esBtn.classList.toggle('active', LANG === 'es');
  // Update HTML lang attribute
  document.documentElement.lang = LANG;
}

