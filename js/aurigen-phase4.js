// === SCOUT — DUE DILIGENCE TOOL ===
var SCOUT_STEPS = [
  {
    name: 'Lien/Deed Verification',
    what: 'Confirm certificate or deed is valid, current, and correctly assigned to the right parcel.',
    why: 'Clerical errors in county records are more common than most investors expect. A misrecorded parcel number or incorrect assignment can render a certificate worthless \u2014 meaning you paid real money for something you cannot enforce or foreclose on.',
    how: ['Pull original certificate number from county tax collector','Match parcel ID on certificate to county assessor parcel map','Confirm no prior redemption has been recorded','Verify assignment chain if certificate was purchased OTC or from a third party','Consult a licensed title company or real estate attorney before transacting'],
    whereText: 'County Tax Collector',
    whereUrl: '',
    redFlags: ['Parcel ID mismatch','Prior redemption on record','Broken assignment chain','Certificate issued on exempt property (church, government, homestead in some states)'],
    proTip: 'Always cross-reference the parcel ID against the county GIS map \u2014 not just the text record. Mapping errors catch what text searches miss.',
    source: 'NTLA Best Practices \u00b7 ntla.org'
  },
  {
    name: 'Property Type + Zoning',
    what: 'Identify what the property is and whether it has legal use restrictions.',
    why: 'A tax lien on a landlocked vacant lot with no road access or a property zoned agricultural only in a flood zone can be near impossible to sell \u2014 making redemption unlikely and the asset worthless if you end up with the deed.',
    how: ['Pull property classification from county assessor','Check zoning designation at city or county planning dept','Look for flood zone designation via FEMA Flood Map Service Center','Confirm legal access \u2014 road frontage or recorded easement','Verify property condition and value with a licensed appraiser or inspector'],
    whereText: 'FEMA Flood Map',
    whereUrl: 'https://msc.fema.gov',
    redFlags: ['Landlocked parcel','Flood Zone AE or VE designation','Agricultural-only zoning','Mobile home on land not owned','Condemned status'],
    proTip: 'Check the FEMA flood map before anything else on vacant land. A parcel in a high-risk flood zone has near-zero resale value regardless of assessed value.',
    source: 'FEMA msc.fema.gov'
  },
  {
    name: 'IRS Federal Tax Lien',
    what: 'Search for any IRS federal tax liens recorded against the property owner.',
    why: 'Under IRC Section 6323, the IRS has a 120-day right of redemption after a tax deed sale. In some states federal liens survive the tax sale entirely \u2014 leaving you with a property subject to federal debt you didn\u2019t create.',
    how: ['Search county recorder for federal tax lien filings under owner name','Search PACER for active federal court judgments against the owner','Consult a licensed real estate attorney to confirm your state\u2019s treatment of federal liens post-sale'],
    whereText: 'Search PACER',
    whereUrl: 'https://pacer.gov',
    redFlags: ['Active IRS lien recorded within 30 days of tax sale','Multiple IRS liens','Owner is business entity with IRS issues'],
    proTip: 'The 120-day IRS redemption window applies even after you receive a deed. Do not spend money on improvements until that window closes.',
    source: 'IRC \u00a7 6323 \u00b7 IRS.gov'
  },
  {
    name: 'HOA Super-Lien Check',
    what: 'Determine if an HOA lien exists and whether it has super-priority over your investment.',
    why: 'In Nevada, Colorado, Florida, Maryland, and Washington D.C., HOA liens can have super-priority \u2014 the HOA can foreclose and wipe out your tax lien entirely before you can act.',
    how: ['Check county recorder for HOA lien filings against the parcel','Confirm whether your state grants HOA super-lien priority','If HOA exists \u2014 contact them directly to get current balance','Factor HOA balance into your maximum bid calculation'],
    whereText: 'Community Associations Institute',
    whereUrl: 'https://caionline.org',
    redFlags: ['Active HOA foreclosure filed','HOA balance exceeding equity','Super-lien state with large arrears'],
    proTip: 'In Nevada, HOA super-lien priority covers up to 9 months of unpaid dues \u2014 that can exceed $10,000. Always call the HOA directly before bidding.',
    source: 'CAI \u00b7 caionline.org'
  },
  {
    name: 'Environmental Lien Search',
    what: 'Check for EPA Superfund designation, underground storage tanks, or environmental contamination.',
    why: 'Under CERCLA, property owners \u2014 including investors who acquire through tax deed \u2014 can be held liable for cleanup costs regardless of whether they caused contamination. Cleanup costs routinely exceed property value.',
    how: ['Search EPA ECHO database for the address','Search EPA Superfund site list','Check state environmental agency for underground storage tank records','Look for prior industrial use (gas stations, dry cleaners, auto shops) in property history','Consult a licensed environmental professional for any property with potential contamination history'],
    whereText: 'EPA ECHO Database',
    whereUrl: 'https://echo.epa.gov',
    redFlags: ['Prior gas station or dry cleaner','EPA enforcement action on record','Underground storage tank registration','Any brownfield designation'],
    proTip: 'Even a clean-looking property can have legacy contamination from a business that operated 30 years ago. Always check use history going back at least 20 years.',
    source: 'CERCLA 42 U.S.C. \u00a7 9607 \u00b7 EPA.gov'
  },
  {
    name: 'Title Chain + Encumbrances',
    what: 'Pull the full chain of title to identify any liens, judgments, easements, or encumbrances that may survive the tax sale.',
    why: 'Not all liens get wiped by a tax deed sale. Mechanics liens, some judgment liens, easements, and deed restrictions can survive \u2014 leaving you with hidden obligations. This is the step most new investors skip and regret most.',
    how: ['Pull all recorded documents against the parcel at county recorder','Look for mechanics liens, judgment liens, or lis pendens','Identify all easements and deed restrictions in the chain','Confirm which encumbrances survive tax sale in your state','Consult a licensed title company or real estate attorney before transacting'],
    whereText: 'Search PACER',
    whereUrl: 'https://pacer.gov',
    redFlags: ['Lis pendens (active lawsuit)','Mechanics lien from recent work','Deed restriction limiting use','Utility easement consuming the lot'],
    proTip: 'A lis pendens is a stop sign. Do not bid on any property with an active lis pendens until you understand exactly what the lawsuit is about. It can cloud title indefinitely.',
    source: 'Nolo.com \u00b7 County recorder'
  },
  {
    name: 'Property Condition + Code Violations',
    what: 'Check municipal records for open code violations, demolition orders, or condemnation notices.',
    why: 'A property with an active demolition order can be torn down by the municipality at the investor\u2019s expense after deed transfer. Open code violations become the new owner\u2019s responsibility and can cost tens of thousands to remediate.',
    how: ['Search city or county building department for open permits and violations','Check for active condemnation or unsafe structure notices','Drive by or use Google Street View to assess visible condition','Search municipal court records for housing court cases against the property','Verify property condition with a licensed inspector before transacting'],
    whereText: 'Google Street View',
    whereUrl: 'https://maps.google.com',
    redFlags: ['Open demolition order','Active condemnation notice','Multiple open code violations','Visible structural collapse','Property boarded and posted'],
    proTip: 'Call the building department directly and ask: \u201CAre there any open violations or orders on this parcel?\u201D They will tell you. Most investors never ask.',
    source: 'HUD.gov \u00b7 Municipal records'
  },
  {
    name: 'Equity Calculation',
    what: 'Calculate whether enough equity exists in the property to make the investment worthwhile.',
    why: 'If a property has no equity \u2014 meaning mortgage plus liens exceeds market value \u2014 the owner has no financial reason to redeem and you end up with a property worth less than what you paid.',
    how: ['Pull estimated market value from county assessor (use 80% of assessed as conservative estimate)','Pull mortgage balance from county recorder \u2014 look for deed of trust or mortgage recording','Add all known liens to mortgage','Subtract total debt from market value \u2014 this is available equity','Many investors look for equity exceeding total debt by at least 20% as a general guideline \u2014 verify with a licensed appraiser'],
    whereText: 'County Assessor Search',
    whereUrl: '',
    redFlags: ['Mortgage near or exceeding value','Multiple judgment liens','Equity below 20% after all debts'],
    proTip: 'Never rely on assessed value alone. In many counties it lags market by 1\u20133 years. Pull 3 recent comparable sales to get a real number.',
    source: 'Investopedia \u00b7 County assessor'
  },
  {
    name: 'Redemption Probability',
    what: 'Assess how likely the owner is to redeem before you can foreclose or apply for a deed.',
    why: 'If your strategy is interest income you want high redemption. If your strategy is acquiring the property you want low redemption. Either way you need to know which you\u2019re getting before you bid.',
    how: ['Check if property is owner-occupied (homestead exemption on assessor record)','Identify if owner is individual, LLC, or out-of-state entity','Check if owner has other tax delinquencies on record','Look at property condition \u2014 maintained or abandoned','Check length of delinquency \u2014 1 year vs 5 years tells you a lot'],
    whereText: 'County Tax Records',
    whereUrl: '',
    redFlags: ['Absentee LLC owner','Multiple years delinquent','Property visibly abandoned','Owner delinquent on multiple parcels'],
    proTip: 'Owner-occupied properties with homestead exemptions redeem at a very high rate. Absentee-owned vacant land with 4-year delinquency almost never redeems. Know which one you have before bidding.',
    source: 'NTLA \u00b7 ntla.org'
  },
  {
    name: 'Auction + Registration Confirmation',
    what: 'Confirm the exact auction date, registration deadline, deposit requirement, and bidding rules.',
    why: 'Missing registration means you cannot bid \u2014 period. Showing up without the correct deposit format means you cannot bid. Misunderstanding the bid method means you overbid and destroy your return.',
    how: ['Go directly to county tax collector website \u2014 not a third-party site','Confirm auction date has not changed (counties reschedule)','Download and read the official auction rules document','Confirm registration deadline and exactly what is required','Confirm the bidding method for that specific county','Set calendar reminder for registration deadline \u2014 not auction date'],
    whereText: 'RealAuction Platform',
    whereUrl: 'https://realauction.com',
    redFlags: ['Auction date changed with no notice','Registration requires docs you don\u2019t have in time','Deposit format you can\u2019t provide','Platform you\u2019ve never used before'],
    proTip: 'Set your reminder for the registration deadline \u2014 not the auction date. Most investors who miss deals miss them at registration, not at the auction.',
    source: 'County tax collector sites \u00b7 NTLA auction guidelines \u00b7 ntla.org'
  }
];

// State-specific due diligence rules
// type values: 'lien' | 'deed' | 'redeemable_deed' | 'hybrid'
// For hybrid states, lienTrack and deedTrack hold separate item arrays.
var SCOUT_STATE_RULES = {
  // --- LIEN STATES ---
  AL: { type:'lien', redemption_months:36, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:false, registration_required:true, deposit_pct:0,
        note:'Alabama lien certificate rate is 12% per annum. Statute: Ala. Code §40-10-1 et seq.' },
  AZ: { type:'lien', redemption_months:36, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:true, registration_required:true, deposit_pct:0 },
  CO: { type:'lien', redemption_months:36, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:true, online_auction:true, registration_required:true, deposit_pct:0,
        note:'Colorado grants HOA super-lien priority under CRS §38-33.3-316. Verify HOA status before bidding.' },
  CT: { type:'lien', redemption_months:12, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:false, registration_required:true, deposit_pct:0,
        note:'Connecticut imposes an 18% penalty (not a per-annum rate) on redemption. Statute: CGS §12-157.' },
  IA: { type:'lien', redemption_months:21, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:true, registration_required:true, deposit_pct:0,
        note:'Iowa redemption is 21 months (1 year 9 months) plus a 90-day notice period after that. Rate: 2%/month (24%/yr). Statute: Iowa Code §447.1.' },
  IL: { type:'lien', redemption_months:30, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:false, registration_required:true, deposit_pct:0,
        note:'Redemption period varies by property type (24–30 months). Confirm with county clerk before bidding.' },
  IN: { type:'lien', redemption_months:12, quiet_title_required:false, irs_lien_survives:true, hoa_super_lien:false, online_auction:true, registration_required:true, deposit_pct:0 },
  MD: { type:'lien', redemption_months:6, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:true, online_auction:true, registration_required:true, deposit_pct:0,
        note:'Maryland has no fixed redemption period — 6 months is the minimum before foreclosure filing can begin. Rates vary EXTREME by county (6% to 24%). Verify directly with the county. Statute: MD Code Tax-Prop §14-817.' },
  NJ: { type:'lien', redemption_months:24, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:true, online_auction:true, registration_required:true, deposit_pct:0,
        note:'NJ redemption: 2 years (private certificate holder); 6 months if municipality holds the lien. HOA super-liens apply. Statute: NJSA 54:5-86.' },
  SC: { type:'lien', redemption_months:12, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:false, online_auction:false, registration_required:true, deposit_pct:5,
        note:'South Carolina is classified lien — the investor receives a tax receipt (not a deed) and must foreclose after the 1-year redemption expires. Deposit requirements vary by county — verify before auction day. SC Code §12-51-90.' },

  // --- REDEEMABLE DEED STATES ---
  GA: { type:'redeemable_deed', redemption_months:12, quiet_title_required:true, irs_lien_survives:true, hoa_super_lien:false, online_auction:false, registration_required:true, deposit_pct:0,
        note:'Georgia is a redeemable deed state. Investor receives the deed at auction but the owner retains 1-year right of redemption. Penalty: 20% year 1, 10%/yr thereafter. OCGA §48-4-1.' },
  TX: {
    type:'redeemable_deed',
    // Redemption: 180 days (6 months) for non-homestead/non-ag; 2 years (24 months) for homestead/ag
    redemption_months:6,
    redemption_months_homestead:24,
    quiet_title_required:true,
    irs_lien_survives:true,
    hoa_super_lien:false,
    online_auction:false,   // Most Texas counties are in-person at courthouse; some use RealAuction/GovEase
    proxy_allowed:true,     // Investor does not need to be present — proxy bidder is allowed
    registration_required:true,
    deposit_pct:0,
    penalty_yr1_pct:25,     // 25% of full auction price in year 1 (not just back taxes)
    penalty_yr2_pct:50,     // 50% of full auction price in year 2
    note:'Texas redeemable deed: auction held first Tuesday of each month at county courthouse. In-person bidding at courthouse; proxy bidder allowed — investor does not need to attend. Redemption: 25% penalty yr1, 50% penalty yr2 calculated on the FULL auction price. Non-homestead/non-ag: 180-day redemption. Homestead/ag: 2-year redemption. Winning bidder receives Sheriff\'s/Constable\'s deed. Quiet title recommended before selling or financing. Statute: TX Tax Code §34.01, §34.21.'
  },

  // --- HYBRID STATES ---
  // Hybrid states have BOTH a lien track AND a deed track.
  // lienTrack[] and deedTrack[] hold the state-specific items for each track.
  FL: {
    type:'hybrid',
    // LIEN TRACK
    lienTrack: [
      { icon:'\uD83D\uDCDC', text:'LIEN TRACK: Annual tax certificate sale online before June 1 each year. Certificates are auctioned in reverse — you bid the interest rate DOWN from the 18% statutory ceiling, in 0.25% increments. Lowest bid wins.', type:'info' },
      { icon:'\uD83D\uDCB0', text:'Minimum 5% face value guarantee: all certificates carry a statutory minimum 5% interest regardless of the winning bid rate — protecting returns even on 0% bids. FL Stat §197.432.', type:'info' },
      { icon:'\u23F0', text:'Redemption period: 2 years from April 1 of the issuance year. Capital is locked until the owner redeems or the period expires. FL Stat §197.472.', type:'info' },
      { icon:'\uD83C\uDFDB\uFE0F', text:'IRS federal tax liens: the IRS retains a 120-day right of redemption after a tax deed sale. Search PACER for federal liens before bidding on any certificate you intend to convert to a deed. IRC §6323.', type:'warning' },
      { icon:'\uD83C\uDFE0', text:'HOA super-liens apply in Florida. HOA can foreclose and wipe your lien. Check for outstanding HOA assessments and confirm current balance before bidding. FL Stat §718.116.', type:'warning' },
      { icon:'\uD83D\uDCBB', text:'Online auction via LienHub.com (lien certificates). Register and pre-fund your account before the county\'s sale date. OTC certificates available year-round on LienHub at full 18% statutory rate. FL Stat §197.4725.', type:'action' },
      { icon:'\u270D\uFE0F', text:'Pre-registration required per county. Registration typically opens 30 days before the June 1 deadline. Confirm with the specific county.', type:'action' }
    ],
    // DEED TRACK
    deedTrack: [
      { icon:'\uD83D\uDCDC', text:'DEED TRACK: After the 2-year redemption period expires, the certificate holder applies for a tax deed via the county clerk (FL Stat §197.502). You must pay off all other outstanding certificates on the parcel to apply.', type:'info' },
      { icon:'\uD83D\uDD0D', text:'County clerk conducts a title search and publishes legal notice. A public deed auction is held 3–6 months after the application is filed. Any bidder can participate — not just the certificate holder.', type:'info' },
      { icon:'\u26A0\uFE0F', text:'No post-deed redemption period. Once the deed is issued, the former owner has no right of redemption.', type:'info' },
      { icon:'\uD83C\uDFDB\uFE0F', text:'Winning bidder receives a clerk\'s deed — NOT a warranty deed. Title is not insurable without a quiet title action. FL Stat §95.192 provides a 4-year safe harbor period. Budget for quiet title attorney fees before selling or financing.', type:'warning' },
      { icon:'\u2696\uFE0F', text:'Quiet title strongly recommended before selling or refinancing the property. Costs vary — verify locally. FL Stat §95.192.', type:'action' },
      { icon:'\u26D4', text:'Municipal liens, community development district (CDD) liens, and code enforcement liens survive the tax deed sale and become the new owner\'s obligation. FL Stat §197.552. Verify all surviving liens before bidding at the deed auction.', type:'warning' },
      { icon:'\uD83C\uDFDB\uFE0F', text:'IRS 120-day redemption right survives even after the clerk\'s deed is issued. Do not make improvements until this window closes. IRC §6323; FL Stat §197.552.', type:'warning' }
    ],
    // Shared rules that apply regardless of track
    irs_lien_survives:true,
    hoa_super_lien:true,
    online_auction:true,
    registration_required:true,
    note:'Florida hybrid: two parallel tracks. Lien track = annual certificate sale online (LienHub). Deed track = 2-year redemption expires → certificate holder applies for deed → clerk\'s public auction. Statutes: FL Stat §197.432, §197.502, §197.552.'
  },

  NY: {
    type:'hybrid',
    lienTrack: [
      { icon:'\uD83D\uDCDC', text:'LIEN TRACK (NYC + Long Island only): New York City operates one of the largest tax lien sales in the world. Lien certificates carry an 18% statutory rate. NY RPTL §1110.', type:'info' },
      { icon:'\u26A0\uFE0F', text:'NYC lien sales require BULK qualification — individual investors cannot participate. Minimum purchase amounts apply. Not accessible to most investors. Contact nyc.gov/taxlien for current qualification thresholds.', type:'warning' },
      { icon:'\uD83C\uDFEB', text:'Upstate NY counties vary by county — some sell liens, some sell deeds. Confirm whether your target county uses lien or deed format before registering. Contact the county Real Property Tax Office.', type:'action' }
    ],
    deedTrack: [
      { icon:'\uD83D\uDCDC', text:'DEED TRACK (Upstate NY counties): Many upstate counties — including Onondaga (Syracuse), Monroe (Rochester), and Erie (Buffalo) — conduct tax deed sales directly. Processes vary significantly by county.', type:'info' },
      { icon:'\uD83D\uDD0D', text:'Contact the county Real Property Tax Office to confirm format, registration requirements, and auction dates. No statewide centralized platform.', type:'action' },
      { icon:'\uD83D\uDC65', text:'Strong tenant protection laws statewide. If the property is occupied, eviction can take 12+ months in New York courts. Factor this into your acquisition cost.', type:'warning' },
      { icon:'\u2696\uFE0F', text:'Quiet title may be required depending on county and property history. Confirm with a licensed New York real estate attorney before transacting.', type:'action' }
    ],
    irs_lien_survives:true,
    hoa_super_lien:false,
    online_auction:false,
    registration_required:true,
    note:'New York hybrid: NYC lien market (bulk only, 18%) and upstate county-level lien or deed markets. Statute: NY RPTL §1110.'
  },

  OH: {
    type:'hybrid',
    lienTrack: [
      { icon:'\uD83D\uDCDC', text:'LIEN TRACK (34+ lien counties): Over 34 Ohio counties conduct tax lien certificate sales using an 18% upset bid format. Buyers receive a certificate, not the property. ORC §5721.19.', type:'info' },
      { icon:'\uD83D\uDCBB', text:'Many lien counties use SRI Tax Sale Services (sriservices.com) for online bidding. Verify whether your target county uses SRI or in-person registration.', type:'action' },
      { icon:'\u23F0', text:'Redemption period: 1 year. Capital is locked during this period. ORC §5721.19.', type:'info' },
      { icon:'\uD83C\uDFDB\uFE0F', text:'IRS federal tax liens may survive Ohio lien sales. Search PACER for federal liens before bidding. IRC §6323.', type:'warning' }
    ],
    deedTrack: [
      { icon:'\uD83D\uDCDC', text:'DEED TRACK (remaining counties use deed/sheriff sales): These counties sell the property directly at fair market value. No certificate — the winning bidder receives a sheriff\'s deed. ORC §5721.19.', type:'info' },
      { icon:'\u26A0\uFE0F', text:'CRITICAL first step: Call your target county treasurer to confirm whether it is a lien county or a deed/sheriff sale county BEFORE any due diligence or registration. The process is completely different.', type:'warning' },
      { icon:'\uD83D\uDCB0', text:'Sheriff sales in deed counties are at market value — limited discount opportunity compared to lien counties.', type:'info' },
      { icon:'\u2696\uFE0F', text:'Quiet title may be required after sheriff sale deed depending on the county and title history. Confirm with a licensed Ohio real estate attorney.', type:'action' }
    ],
    irs_lien_survives:true,
    hoa_super_lien:false,
    online_auction:false,   // Varies by county; many lien counties use SRI online
    registration_required:true,
    deposit_pct:10,
    note:'Ohio hybrid: 34+ lien counties (18% upset bid, SRI platform) + remaining deed/sheriff sale counties at market value. VERIFY your target county type first. ORC §5721.19.'
  },

  WV: {
    type:'hybrid',
    lienTrack: [
      { icon:'\uD83D\uDCDC', text:'LIEN TRACK: Annual tax lien sales conducted October 14 – November 23 by county sheriffs. Investors receive a lien certificate at 12% per annum. WV Code 11A Art.3.', type:'info' },
      { icon:'\uD83D\uDCC4', text:'Certificate is assignable — it can be transferred to another investor. WV Code 11A Art.3.', type:'info' },
      { icon:'\u23F0', text:'Redemption period: 18 months (NOT 12 months — this is commonly misquoted). Capital is locked for 18 months. WV Code 11A Art.3.', type:'warning' },
      { icon:'\u26A0\uFE0F', text:'Mineral rights are commonly separated from surface rights on West Virginia rural parcels. A lien on the surface only does not encumber the minerals. Verify mineral rights status on every rural parcel before bidding.', type:'warning' }
    ],
    deedTrack: [
      { icon:'\uD83D\uDCDC', text:'DEED TRACK: Unredeemed liens after 18 months transfer to deed sales managed by the West Virginia State Auditor. The State Auditor\'s Delinquent Land Sales are held as needed throughout the year.', type:'info' },
      { icon:'\uD83D\uDD0D', text:'Check the WV State Auditor\'s delinquent land list for upcoming deed sale opportunities: wvsao.gov/CountyCollections', type:'action' },
      { icon:'\u2696\uFE0F', text:'Quiet title is often required for deed sale properties due to complex historical title issues common in West Virginia. Budget for attorney fees before transacting.', type:'action' },
      { icon:'\u26A0\uFE0F', text:'Mineral rights remain a critical risk at the deed stage. Separated mineral rights are extremely common in rural WV — confirm status with the WV State Auditor and a licensed title professional.', type:'warning' }
    ],
    irs_lien_survives:true,
    hoa_super_lien:false,
    online_auction:false,
    registration_required:true,
    note:'West Virginia hybrid: county sheriff lien sales (Oct–Nov, 12%/yr, 18-month redemption) → unredeemed → WV State Auditor deed sales. WV Code 11A Art.3.'
  }
};

function scoutGetStateItems(stateCode) {
  var rules = stateCode ? SCOUT_STATE_RULES[stateCode.toUpperCase()] : null;
  var items = [];
  if (!rules) {
    items.push({ icon: '\u26A0\uFE0F', text: 'State-specific rules not yet available for this state \u2014 verify with local tax collector.', type: 'warning' });
    return items;
  }

  // HYBRID states: render both lien track and deed track with divider
  if (rules.type === 'hybrid') {
    if (rules.lienTrack && rules.lienTrack.length > 0) {
      items.push({ icon: '\uD83D\uDFE1', text: 'LIEN TRACK \u2014 buying lien certificates', type: 'track-header' });
      rules.lienTrack.forEach(function(item) { items.push(item); });
    }
    if (rules.deedTrack && rules.deedTrack.length > 0) {
      items.push({ icon: '\uD83D\uDFE0', text: 'DEED TRACK \u2014 certificate-to-deed conversion path', type: 'track-header' });
      rules.deedTrack.forEach(function(item) { items.push(item); });
    }
    // Shared notes
    if (rules.note) {
      items.push({ icon: '\uD83D\uDCD6', text: rules.note, type: 'source' });
    }
    return items;
  }

  // REDEEMABLE DEED states
  if (rules.type === 'redeemable_deed') {
    items.push({ icon: '\uD83D\uDCDC', text: 'This is a REDEEMABLE DEED state \u2014 you receive the property deed at auction, but the original owner retains a statutory right of redemption.', type: 'info' });
    if (stateCode.toUpperCase() === 'TX') {
      items.push({ icon: '\uD83C\uDFDB\uFE0F', text: 'In-person bidding at county courthouse on the first Tuesday of each month. Proxy bidder allowed \u2014 you do not need to attend in person.', type: 'info' });
      items.push({ icon: '\uD83D\uDCB0', text: 'Redemption penalty: 25% of the full auction price in year 1; 50% in year 2. Calculated on the FULL auction price, not just back taxes. Overbidding dramatically increases your penalty exposure. TX Tax Code \u00a734.21.', type: 'warning' });
      items.push({ icon: '\u23F0', text: 'Redemption period: 180 days (6 months) for non-homestead/non-agricultural properties. 2 years for homestead and agricultural properties. Verify property classification before bidding. TX Tax Code \u00a734.21.', type: 'warning' });
      items.push({ icon: '\uD83C\uDFDB\uFE0F', text: 'IRS federal tax liens survive Texas tax deed sales. Search PACER for active federal liens before bidding. IRC \u00a76323.', type: 'warning' });
      items.push({ icon: '\uD83D\uDCDC', text: 'Winning bidder receives a Sheriff\'s or Constable\'s deed \u2014 NOT a warranty deed. Quiet title is recommended before selling or financing the property. TX Tax Code \u00a734.01.', type: 'action' });
      items.push({ icon: '\uD83D\uDCA1', text: 'Struck-off properties (properties that did not sell at auction) are available directly from the county tax assessor-collector with no redemption period in many cases. Ask for the struck-off list. TX Tax Code \u00a734.01(p).', type: 'action' });
    } else {
      // Generic redeemable deed fallback
      if (rules.redemption_months > 0) {
        items.push({ icon: '\u23F0', text: 'Redemption period: ' + rules.redemption_months + ' months. Owner can reclaim the property during this window.', type: 'warning' });
      }
      if (rules.quiet_title_required) {
        items.push({ icon: '\u2696\uFE0F', text: 'Quiet title action recommended after deed acquisition. Costs vary \u2014 verify locally.', type: 'action' });
      }
    }
    if (rules.note) {
      items.push({ icon: '\uD83D\uDCD6', text: rules.note, type: 'source' });
    }
    return items;
  }

  // DEED states
  if (rules.type === 'deed') {
    items.push({ icon: '\uD83D\uDCDC', text: 'This is a TAX DEED state \u2014 you are bidding on the property itself, not a lien certificate.', type: 'info' });
    if (rules.quiet_title_required) {
      items.push({ icon: '\u2696\uFE0F', text: 'Quiet title action required after foreclosure. Budget $1,500\u2013$3,000+ for attorney fees (costs vary \u2014 verify locally).', type: 'action' });
    }
    if (rules.irs_lien_survives) {
      items.push({ icon: '\uD83C\uDFDB\uFE0F', text: 'IRS federal tax liens survive the sale. Check for federal liens before bidding.', type: 'warning' });
    }
    if (rules.hoa_super_lien) {
      items.push({ icon: '\uD83C\uDFE0', text: 'HOA super-liens may apply. Check for outstanding HOA assessments.', type: 'warning' });
    }
    if (rules.online_auction) {
      items.push({ icon: '\uD83D\uDCBB', text: 'Online auction \u2014 register on the platform in advance. Confirm browser/device requirements.', type: 'action' });
    }
    if (rules.registration_required) {
      items.push({ icon: '\u270D\uFE0F', text: 'Pre-registration required. Set calendar reminder for registration deadline.', type: 'action' });
    }
    if (rules.deposit_pct > 0) {
      items.push({ icon: '\uD83D\uDCB0', text: 'Deposit required: typically ' + rules.deposit_pct + '% of bid amount (costs vary \u2014 verify locally). Confirm exact format with the county.', type: 'action' });
    }
    if (rules.redemption_months > 0) {
      items.push({ icon: '\u23F0', text: 'Redemption period: ' + rules.redemption_months + ' months. Capital locked until owner redeems or period expires.', type: 'info' });
    }
    if (rules.note) {
      items.push({ icon: '\uD83D\uDCD6', text: rules.note, type: 'source' });
    }
    return items;
  }

  // LIEN states (default)
  items.push({ icon: '\uD83D\uDCDC', text: 'This is a TAX LIEN state \u2014 you are purchasing a lien certificate, not the property.', type: 'info' });
  if (rules.quiet_title_required) {
    items.push({ icon: '\u2696\uFE0F', text: 'Quiet title action required after foreclosure. Budget $1,500\u2013$3,000+ for attorney fees (costs vary \u2014 verify locally).', type: 'action' });
  }
  if (rules.irs_lien_survives) {
    items.push({ icon: '\uD83C\uDFDB\uFE0F', text: 'IRS federal tax liens survive the sale. Check for federal liens before bidding.', type: 'warning' });
  }
  if (rules.hoa_super_lien) {
    items.push({ icon: '\uD83C\uDFE0', text: 'HOA super-liens may apply. Check for outstanding HOA assessments.', type: 'warning' });
  }
  if (rules.online_auction) {
    items.push({ icon: '\uD83D\uDCBB', text: 'Online auction \u2014 register on the platform in advance. Confirm browser/device requirements.', type: 'action' });
  }
  if (rules.registration_required) {
    items.push({ icon: '\u270D\uFE0F', text: 'Pre-registration required. Set calendar reminder for registration deadline.', type: 'action' });
  }
  if (rules.deposit_pct > 0) {
    items.push({ icon: '\uD83D\uDCB0', text: 'Deposit required: typically ' + rules.deposit_pct + '% of bid amount (costs vary \u2014 verify locally). Confirm exact format with the county.', type: 'action' });
  }
  if (rules.redemption_months > 0) {
    items.push({ icon: '\u23F0', text: 'Redemption period: ' + rules.redemption_months + ' months. Capital locked until owner redeems or period expires.', type: 'info' });
  }
  if (rules.note) {
    items.push({ icon: '\uD83D\uDCD6', text: rules.note, type: 'source' });
  }
  return items;
}

var _scoutActiveDeal = null;

function scoutGetDeals() {
  try {
    var raw = localStorage.getItem('aurigen_scout_deals');
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function scoutSaveDeals(deals) {
  try { localStorage.setItem('aurigen_scout_deals', JSON.stringify(deals)); } catch(e) {}
}

function scoutSaveDeal(deal) {
  deal.updatedAt = Date.now();
  var deals = scoutGetDeals();
  var idx = deals.findIndex(function(d) { return d.id === deal.id; });
  if (idx >= 0) deals[idx] = deal;
  else deals.unshift(deal);
  scoutSaveDeals(deals);
}

function scoutDeleteDeal(id) {
  if (!confirm('Delete this deal? This cannot be undone.')) return;
  var deals = scoutGetDeals().filter(function(d) { return d.id !== id; });
  scoutSaveDeals(deals);
  if (_scoutActiveDeal && _scoutActiveDeal.id === id) _scoutActiveDeal = null;
  scoutRender();
}

function scoutCountComplete(deal) {
  var c = 0;
  for (var i = 1; i <= 10; i++) { if (deal.steps[i] && deal.steps[i].complete) c++; }
  return c;
}

function scoutNewDeal() {
  if (!getIsPaid()) return;
  var states = window.STATES_V2 ? window.STATES_V2.slice().sort(function(a,b) { return a.name.localeCompare(b.name); }) : [];
  var opts = '<option value="">Select state...</option>';
  states.forEach(function(s) { opts += '<option value="' + escapeHtml(s.code) + '">' + escapeHtml(s.name) + '</option>'; });

  // Pre-select from DNA archetype
  var dnaState = '';
  var archKey = typeof getArchetypeKey === 'function' ? getArchetypeKey() : null;
  var archCfg = archKey && typeof ARCHETYPE_TOOL_CONFIG !== 'undefined' ? ARCHETYPE_TOOL_CONFIG[archKey] : null;
  if (archCfg && archCfg.daStates && archCfg.daStates[0]) dnaState = archCfg.daStates[0];

  var overlay = document.createElement('div');
  overlay.className = 'scout-modal-overlay';
  overlay.innerHTML =
    '<div class="scout-modal">' +
      '<div class="scout-modal-title">NEW DEAL</div>' +
      '<form id="scout-new-form">' +
        '<label>Deal Name *</label>' +
        '<input name="name" required placeholder="e.g. 123 Main St" autocomplete="off">' +
        '<label>Parcel ID or Address</label>' +
        '<input name="parcel" placeholder="Parcel number or street address" autocomplete="off">' +
        '<label>State</label>' +
        '<select name="state">' + opts + '</select>' +
        '<label>County</label>' +
        '<input name="county" placeholder="County name" autocomplete="off">' +
        '<div class="scout-modal-btns">' +
          '<button type="button" class="scout-modal-ghost" onclick="this.closest(\'.scout-modal-overlay\').remove()">Cancel</button>' +
          '<button type="submit" class="scout-modal-primary">Start Checklist \u2192</button>' +
        '</div>' +
      '</form>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });

  // Auto-select DNA state if available
  if (dnaState) {
    var stateSel = overlay.querySelector('select[name="state"]');
    if (stateSel) stateSel.value = dnaState;
  }

  document.getElementById('scout-new-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var f = e.target;
    var steps = {};
    for (var i = 1; i <= 10; i++) steps[i] = { complete: false, notes: '', flag: false };
    var deal = {
      id: 'deal_' + Date.now(),
      name: f.name.value.trim(),
      parcel: f.parcel.value.trim(),
      state: f.state.value,
      county: f.county.value.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      steps: steps
    };
    scoutSaveDeal(deal);
    _scoutActiveDeal = deal;
    overlay.remove();
    scoutRender();
  });
}

function scoutSelectDeal(id) {
  if (!id) { _scoutActiveDeal = null; scoutRender(); return; }
  var deals = scoutGetDeals();
  var deal = deals.find(function(d) { return d.id === id; });
  if (deal) { _scoutActiveDeal = deal; scoutRender(); }
}

function scoutToggleStep(stepNum) {
  var el = document.getElementById('scout-step-' + stepNum);
  if (el) el.classList.toggle('open');
}

function scoutMarkComplete(stepNum) {
  if (!_scoutActiveDeal) return;
  _scoutActiveDeal.steps[stepNum].complete = !_scoutActiveDeal.steps[stepNum].complete;
  scoutSaveDeal(_scoutActiveDeal);
  scoutRender();
}

function scoutToggleFlag(stepNum) {
  if (!_scoutActiveDeal) return;
  _scoutActiveDeal.steps[stepNum].flag = !_scoutActiveDeal.steps[stepNum].flag;
  scoutSaveDeal(_scoutActiveDeal);
  scoutRender();
}

function scoutSaveNotes(stepNum, val) {
  if (!_scoutActiveDeal) return;
  _scoutActiveDeal.steps[stepNum].notes = val;
  scoutSaveDeal(_scoutActiveDeal);
  // Don't re-render — just save silently
}

function scoutCopySummary() {
  if (!_scoutActiveDeal) return;
  var d = _scoutActiveDeal;
  var lines = ['Aurigen Scout \u2014 Due Diligence Report'];
  lines.push('\u2501'.repeat(26));
  lines.push('Deal: ' + d.name);
  if (d.parcel) lines.push('Parcel: ' + d.parcel);
  lines.push('State: ' + (d.state || '\u2014') + ' \u00b7 County: ' + (d.county || '\u2014'));
  lines.push('\u2501'.repeat(26));
  for (var i = 0; i < 10; i++) {
    var st = d.steps[i + 1];
    var icon = st.complete ? '\u2713' : (st.flag ? '!' : '\u25cb');
    lines.push(icon + ' ' + SCOUT_STEPS[i].name);
  }
  lines.push('\u2501'.repeat(26));
  lines.push(new Date().toLocaleDateString());
  lines.push('Rates and rules are subject to change.');
  lines.push('Always verify with official county sources and a licensed professional.');
  lines.push('Built with Aurigen \u00b7 aurigendirectory.com');
  try {
    navigator.clipboard.writeText(lines.join('\n'));
    var btn = document.getElementById('scout-copy-btn');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(function() { btn.textContent = 'Copy Summary'; }, 2000); }
  } catch(e) {}
}

function scoutRender() {
  var deals = scoutGetDeals();
  var list = document.getElementById('scout-deal-list');
  var dd = document.getElementById('scout-mobile-dd');
  var main = document.getElementById('scout-main');
  var empty = document.getElementById('scout-empty');
  var cl = document.getElementById('scout-checklist');

  // Sidebar deal list
  var html = '';
  deals.forEach(function(d) {
    var cnt = scoutCountComplete(d);
    var isActive = _scoutActiveDeal && _scoutActiveDeal.id === d.id;
    html += '<div class="scout-deal-card' + (isActive ? ' active' : '') + '" onclick="scoutSelectDeal(\'' + d.id + '\')">' +
      '<button class="scout-deal-del" onclick="event.stopPropagation();scoutDeleteDeal(\'' + d.id + '\')">\u2715</button>' +
      '<div class="scout-deal-name">' + escapeHtml(d.name) + '</div>' +
      '<div class="scout-deal-meta">' + escapeHtml(d.state || '\u2014') + ' \u00b7 ' + escapeHtml(d.county || '\u2014') + '</div>' +
      '<div class="scout-deal-bar"><div class="scout-deal-bar-fill" style="width:' + (cnt * 10) + '%"></div></div>' +
      '<div class="scout-deal-steps">' + cnt + '/10 steps</div>' +
    '</div>';
  });
  if (list) list.innerHTML = html;

  // Mobile dropdown
  if (dd) {
    var ddHtml = '<option value="">Select a deal...</option>';
    deals.forEach(function(d) {
      var sel = _scoutActiveDeal && _scoutActiveDeal.id === d.id ? ' selected' : '';
      ddHtml += '<option value="' + d.id + '"' + sel + '>' + escapeHtml(d.name) + ' (' + scoutCountComplete(d) + '/10)</option>';
    });
    dd.innerHTML = ddHtml;
  }

  // Main content
  if (!_scoutActiveDeal) {
    empty.style.display = 'flex';
    cl.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  cl.style.display = 'block';

  var d = _scoutActiveDeal;
  var cnt = scoutCountComplete(d);
  var pct = cnt * 10;

  var out = '';
  // Header
  out += '<div class="scout-hdr">' +
    '<div class="scout-hdr-name">' + escapeHtml(d.name) + '</div>' +
    '<div class="scout-hdr-meta">' + escapeHtml(d.state || '\u2014') + ' \u00b7 ' + escapeHtml(d.county || '\u2014') + (d.parcel ? ' \u00b7 ' + escapeHtml(d.parcel) : '') + '</div>' +
    '<div class="scout-hdr-progress">' +
      '<div class="scout-hdr-progress-text">' + cnt + ' of 10 steps complete</div>' +
      '<div class="scout-hdr-progress-bar"><div class="scout-hdr-progress-fill" style="width:' + pct + '%"></div></div>' +
    '</div>' +
  '</div>';

  // Complete banner
  if (cnt === 10) {
    out += '<div class="scout-complete-banner">' +
      '<div class="scout-complete-icon">\u2713</div>' +
      '<div class="scout-complete-text">' +
        '<div class="scout-complete-title">Due Diligence Complete</div>' +
        '<div class="scout-complete-sub">Always verify with a licensed title company or real estate attorney before transacting. Rates and rules vary by county.</div>' +
      '</div>' +
      '<button class="scout-copy-btn" id="scout-copy-btn" onclick="scoutCopySummary()">Copy Summary</button>' +
    '</div>';
  }

  // State-specific items
  var stateItems = scoutGetStateItems(d.state);
  if (stateItems.length > 0) {
    out += '<div class="scout-state-rules">';
    out += '<div class="scout-state-rules-title">STATE-SPECIFIC: ' + escapeHtml(d.state || 'GENERAL') + '</div>';
    stateItems.forEach(function(item) {
      var cls;
      if (item.type === 'warning') {
        cls = 'scout-state-warning';
      } else if (item.type === 'action') {
        cls = 'scout-state-action';
      } else if (item.type === 'track-header') {
        cls = 'scout-state-track-header';
      } else if (item.type === 'source') {
        cls = 'scout-state-source';
      } else {
        cls = 'scout-state-info';
      }
      out += '<div class="' + cls + '">' + item.icon + ' ' + escapeHtml(item.text) + '</div>';
    });
    out += '</div>';
  }

  // Steps
  // Preserve which steps are open
  var openSteps = {};
  for (var oi = 1; oi <= 10; oi++) {
    var oel = document.getElementById('scout-step-' + oi);
    if (oel && oel.classList.contains('open')) openSteps[oi] = true;
  }

  for (var i = 0; i < 10; i++) {
    var stepNum = i + 1;
    var s = SCOUT_STEPS[i];
    var st = d.steps[stepNum];
    var classes = 'scout-step';
    if (st.complete) classes += ' completed';
    if (st.flag) classes += ' flagged';
    if (openSteps[stepNum]) classes += ' open';

    var numContent = st.complete ? '\u2713' : (st.flag ? '!' : stepNum);

    out += '<div class="' + classes + '" id="scout-step-' + stepNum + '">' +
      '<div class="scout-step-hdr" onclick="scoutToggleStep(' + stepNum + ')">' +
        '<div class="scout-step-num">' + numContent + '</div>' +
        '<div class="scout-step-info">' +
          '<div class="scout-step-name">' + escapeHtml(s.name) + '</div>' +
          '<div class="scout-step-what">' + escapeHtml(s.what) + '</div>' +
        '</div>' +
        '<div class="scout-step-actions">' +
          '<button class="scout-flag-btn' + (st.flag ? ' active' : '') + '" onclick="event.stopPropagation();scoutToggleFlag(' + stepNum + ')" title="Flag issue"></button>' +
          '<span class="scout-chevron">\u25BC</span>' +
        '</div>' +
      '</div>' +
      '<div class="scout-step-body">' +
        '<div class="scout-section-label why">WHY IT MATTERS</div>' +
        '<div class="scout-section-text">' + escapeHtml(s.why) + '</div>' +
        '<div class="scout-section-label how">HOW TO DO IT</div>' +
        '<ol class="scout-how-list">';
    s.how.forEach(function(h) { out += '<li>' + escapeHtml(h) + '</li>'; });
    out += '</ol>';
    if (s.whereUrl) {
      out += '<div class="scout-section-label where">WHERE</div>' +
        '<a class="scout-where-link" href="' + escapeHtml(s.whereUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(s.whereText) + ' \u2192</a>';
    } else if (s.whereText) {
      out += '<div class="scout-section-label where">WHERE</div>' +
        '<span class="scout-section-text">' + escapeHtml(s.whereText) + '</span>';
    }
    out += '<div class="scout-section-label redflags">RED FLAGS</div><ul class="scout-redflag-list">';
    s.redFlags.forEach(function(r) { out += '<li>' + escapeHtml(r) + '</li>'; });
    out += '</ul>' +
      '<div class="scout-section-label protip">PRO TIP</div>' +
      '<div class="scout-protip">' + escapeHtml(s.proTip) + '</div>' +
      '<div class="scout-section-label notes">YOUR NOTES</div>' +
      '<textarea class="scout-notes-area" placeholder="Add your notes for this step..." oninput="scoutSaveNotes(' + stepNum + ',this.value)">' + escapeHtml(st.notes || '') + '</textarea>' +
      '<div class="scout-step-footer">' +
        '<button class="scout-flag-toggle' + (st.flag ? ' active' : '') + '" onclick="scoutToggleFlag(' + stepNum + ')"><span class="scout-flag-dot"></span> ' + (st.flag ? 'Flagged' : 'Flag Issue') + '</button>' +
        '<button class="scout-complete-btn' + (st.complete ? ' done' : '') + '" onclick="scoutMarkComplete(' + stepNum + ')">' + (st.complete ? '\u2713 Completed' : 'Mark Complete \u2713') + '</button>' +
      '</div>' +
      '<div class="scout-source">' + escapeHtml(s.source) + '</div>' +
    '</div></div>';
  }

  cl.innerHTML = out;
}

// Init scout on load
(function() {
  var deals = scoutGetDeals();
  if (deals.length > 0) { _scoutActiveDeal = deals[0]; }
  scoutRender();
})();

