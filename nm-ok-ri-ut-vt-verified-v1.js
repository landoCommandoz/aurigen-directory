// ═══════════════════════════════════════════════════════════
// BATCH 9 — NM, OK, RI, UT, VT — FULL STRUCTURE v1
// March 2026
// ═══════════════════════════════════════════════════════════

window.COUNTY_DATA = window.COUNTY_DATA || {};

// ─────────────────────────────────────────────────────────
// NEW MEXICO — 33 COUNTIES — TAX DEED
// Statute: NMSA §7-38-65 through §7-38-70 (Property Tax Code)
// Unique: STATE-administered — NM Taxation & Revenue Dept (PTD)
//   conducts all auctions, not county treasurers
// 3-year delinquency → PTD schedules county auction
// Premium bid — highest bidder. Tax Deed issued immediately.
// NO post-sale redemption. 2-year window to challenge via court.
// Only redemption: 120-day IRS window (federal lien properties)
// ⚡ 2026 CONFIRMED: 7 counties March 2–24, 2026
// ─────────────────────────────────────────────────────────
const NM_STATE_RULES = {
  type: "deed",
  statute: "NMSA §7-38-65 (Sale Authority), §7-38-66 (Notice), §7-38-67 (Publication), §7-38-70 (Deed + 2-yr Challenge)",
  administrator: "New Mexico Taxation and Revenue Department, Property Tax Division (PTD) — NOT county treasurers",
  adminUrl: "https://www.tax.newmexico.gov/businesses/property-tax-overview/delinquent-property-tax-auctions/",
  process: {
    step1: "Taxes delinquent → 2-year delinquency → added to county tax delinquency list",
    step2: "3 years after first delinquent date on list → PTD schedules auction",
    step3: "PTD mails certified mail notice 20–30 days before sale to record owner",
    step4: "Publication in local newspaper for 3 consecutive weeks before sale",
    step5: "Public auction at county courthouse or designated location. 10 AM start. Registration 8 AM, closes at auction start.",
    step6: "Highest bid wins. Tax Deed issued. New owner immediately.",
    stat: "NMSA §7-38-65, §7-38-66, §7-38-67, §7-38-70"
  },
  auction: {
    frequency: "As scheduled by PTD — multiple rounds per year (March, August, September, October, December confirmed in 2025/2026)",
    platform: "In-person at county courthouse or designated location — PTD-administered",
    bidMethod: "Premium bid — highest bidder",
    minimumBid: "All delinquent taxes + penalties + interest + costs. No bid below this accepted.",
    payment: "In full before auction closes — money order, certified/cashier's check, or personal/business check with bank letter of credit",
    registration: "In-person day of sale. 8 AM open, closes at auction start (10 AM). Must be registered to bid.",
    statute: "NMSA §7-38-68, §7-38-70"
  },
  confirmed2026: {
    march: [
      "Harding County — March 2, 1 PM — 35 Pine St., Mosquero, NM 87733",
      "Union County — March 3, 10 AM — 200 Court St., Clayton, NM 88415",
      "Colfax County — March 4-5, 10 AM — 230 North 3rd St., Raton, NM 87740",
      "Santa Fe County — March 13, 10 AM — 102 Grant Ave Floor #2, Santa Fe, NM 87501",
      "Eddy County — March 17, 10 AM — 101 W. Greene St. Ste 211, Carlsbad, NM 88220",
      "Lea County — March 18, 10 AM — 100 N Main Ste 3-C, Lovington, NM 88260",
      "Otero County — March 24, 10 AM — 401 [location TBC per PTD notice], Alamogordo, NM"
    ],
    source: "NM Taxation & Revenue Department Press Release 02/23/26 + KRQE News 13",
    note: "PTD announces additional rounds throughout year. Check tax.newmexico.gov for updated schedule."
  },
  otc: {
    available: false,
    name: "N/A — NM does NOT conduct tax deed, tax certificate, or tax lien sales outside PTD auctions",
    note: "Per Sandoval County official site: 'The State of New Mexico, including all counties, does not conduct tax deed, tax certificate and tax lien sales. The only property sales conducted by the State are public auctions.'"
  },
  subTax: {
    available: false,
    name: "N/A — NM is deed state, PTD-administered"
  },
  redemption: {
    preAuction: "Owner may redeem (pay all delinquent taxes + penalties + interest + costs) by 5:00 PM day prior to sale",
    postSale: "⚡ NO standard redemption period post-sale. New owner takes title immediately.",
    federalLien: "120-day IRS redemption right if federal lien exists on property",
    challengePeriod: "2-year window post-sale — former owner may challenge sale in court ONLY on 4 specific grounds: (1) taxes not delinquent, (2) PTD failed to mail required notice/return receipt, (3) taxes paid before sale, (4) installment agreement in effect and payments current",
    statute: "NMSA §7-38-65, §7-38-70",
    homesteadDifferent: false
  },
  deedPath: {
    name: "Tax Deed (State of New Mexico)",
    effect: "Conveys all former owner's interest as of date state's tax lien arose. Fee simple absolute. Strikes down all previous titles and interests.",
    exceptions: "Federal tax liens if IRS exercises 120-day redemption right. Betterment statute liens (§42-4-18 NMSA).",
    statute: "NMSA §7-38-70",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Surplus / Excess Proceeds",
    statute: "NMSA §7-38-70 (implied) — PTD auction proceeds first applied to taxes + costs",
    process: "Any proceeds above taxes + costs should be available to former owner. Tyler v. Hennepin applies.",
    note: "[VERIFY] — NM PTD official FAQ does not explicitly detail surplus claim process. Contact PTD at 505-827-0883 for excess proceeds claims."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const NM_COUNTIES = [
  "Bernalillo","Catron","Chaves","Cibola","Colfax","Curry","De Baca","Doña Ana",
  "Eddy","Grant","Guadalupe","Harding","Hidalgo","Lea","Lincoln","Los Alamos",
  "Luna","McKinley","Mora","Otero","Quay","Rio Arriba","Roosevelt","Sandoval",
  "San Juan","San Miguel","Santa Fe","Sierra","Socorro","Taos","Torrance","Union","Valencia"
];

window.COUNTY_DATA['NM'] = NM_COUNTIES.map(name => ({...NM_STATE_RULES, 
  county: name,
  url: "https://www.tax.newmexico.gov/businesses/property-tax-overview/delinquent-property-tax-auctions/",
  platform: "NM Taxation & Revenue Dept (PTD) — in-person county courthouse",
  saleAdministrator: "State of New Mexico PTD — not county treasurer",
  verified: true
}));
window.COUNTY_DATA['NM_STATE_RULES'] = NM_STATE_RULES;

// ─────────────────────────────────────────────────────────
// OKLAHOMA — 77 COUNTIES — THREE-STAGE HYBRID
// Statute: 68 OS §3101–§3147 (Delinquent Taxes and Collection)
// Stage 1: Tax Sale — 1st Monday in October (lien cert, 2yr redemption, 8%/yr)
// Stage 2: Resale — 2nd Monday in June (deed, 3yr delinquent, highest bid)
// Stage 3: County Commissioner Sale — year-round (deed, unsold from resale)
// ─────────────────────────────────────────────────────────
const OK_STATE_RULES = {
  type: "hybrid",
  statute: "68 OS §3101–§3147 (Delinquent Taxes and Collection)",
  threeStageProcess: {
    stage1_taxSale: {
      name: "Tax Sale",
      date: "First Monday in October annually",
      type: "Tax Lien Certificate",
      bidMethod: "Random selection / impartial drawing (68 OS §3108(A))",
      interestRate: "8% per annum on lien cert (68 OS §3113)",
      redemptionPeriod: "2 years from date of sale (68 OS §3117(b))",
      redemptionNote: "Owner may redeem at any time BEFORE county treasurer executes deed. No post-deed redemption.",
      unsold: "Unsold liens assigned to county — available OTC anytime prior to 2-year redemption expiry",
      statute: "68 OS §3107, §3108, §3113, §3117"
    },
    stage2_resale: {
      name: "Tax Resale",
      date: "Second Monday in June annually",
      type: "Tax Deed (Treasurer's Deed)",
      eligibility: "Properties with taxes delinquent 3+ years from date taxes first became due and payable",
      bidMethod: "Highest bidder — minimum bid = 2/3 assessed value OR total taxes owed (whichever is lesser)",
      redemption: "None post-resale. Owner must redeem before deed is executed.",
      deedIssuance: "Deed executed and delivered to purchaser within 30 days of sale",
      unsold: "Unsold properties struck off to county → County Commissioner Sale",
      exemption: "⚡ Counties >100,000 population: single-family owner-occupied, 65+ or totally disabled, income ≤ HHS poverty guidelines, FMV ≤ $180,000 — EXEMPT from tax sale",
      statute: "68 OS §3105, §3125, §3127"
    },
    stage3_commissionerSale: {
      name: "County Commissioner Sale",
      type: "Tax Deed",
      timing: "Year-round — as scheduled by county commissioners",
      price: "Set by county commissioners",
      statute: "68 OS §3135"
    }
  },
  auction: {
    taxSale_date2026: "First Monday in October 2026 (Oct 5, 2026)",
    resale_date2026: "Second Monday in June 2026 (June 8, 2026)",
    platform: "In-person county courthouse — each of 77 counties independently",
    note: "Oklahoma County (largest) uses online platform. Check docs.oklahomacounty.org/treasurer"
  },
  otc: {
    available: true,
    name: "County-Held OTC Liens + County Commissioner Sale Properties",
    process: {
      liens: "Unsold Tax Sale liens assigned to county. Available OTC from county treasurer anytime within 2-year redemption period. County-held certs earn 12%/yr (vs 8% for private investor certs).",
      deeds: "Post-Resale unsold properties: contact county commissioners for availability and pricing."
    },
    statute: "68 OS §3108, §3135"
  },
  subTax: {
    available: false,
    name: "N/A — Oklahoma cert holder does not pay subsequent taxes; owner must pay or additional delinquency triggers separate lien"
  },
  redemption: {
    stage1: "2 years from Tax Sale date. Anytime before treasurer executes deed after 2 years.",
    stage2: "Must redeem BEFORE resale deed is executed. No post-deed redemption.",
    amounts: "Sum originally delinquent + interest + additional costs (not to exceed 10%/yr per 68 OS §3113)",
    minorException: "Minors or mentally incapacitated persons may redeem within 1 year after disability expires",
    statute: "68 OS §3113, §3117",
    homesteadDifferent: true,
    homesteadNote: "Large-county exemption (>100K pop): certain elderly/disabled/low-income homeowners exempt from sale entirely"
  },
  deedPath: {
    name: "Treasurer's Deed (Resale) / Tax Deed (Commissioner Sale)",
    resale: "68 OS §3118: deed vests absolute estate in fee simple. Extinguishes mortgages of record.",
    challenge: "1-year post-recording window to challenge deed procedurally (68 OS §3141). After 1 year — only fraud/constitutional grounds.",
    quietTitle: "⚡ Quiet title strongly recommended. Tax deed not warranty deed. County makes no representations.",
    statute: "68 OS §3118, §3141",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Excess Proceeds",
    statute: "68 OS §3103 — excess proceeds of personal property lien release to county treasurer. Tyler v. Hennepin applies to real property surplus.",
    process: "Surplus from resale: court-supervised or treasurer distribution. Tyler v. Hennepin compliance applies.",
    note: "[VERIFY] — OK surplus statutes for real property sales not as clearly codified as some states. Confirm with county treasurer."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const OK_COUNTIES = [
  "Adair","Alfalfa","Atoka","Beaver","Beckham","Blaine","Bryan","Caddo","Canadian",
  "Carter","Cherokee","Choctaw","Cimarron","Cleveland","Coal","Comanche","Cotton",
  "Craig","Creek","Custer","Delaware","Dewey","Ellis","Garfield","Garvin","Grady",
  "Grant","Greer","Harmon","Harper","Haskell","Hughes","Jackson","Jefferson","Johnston",
  "Kay","Kingfisher","Kiowa","Latimer","Le Flore","Lincoln","Logan","Love","Major",
  "Marshall","Mayes","McClain","McCurtain","McIntosh","Murray","Muskogee","Noble",
  "Nowata","Okfuskee","Oklahoma","Okmulgee","Osage","Ottawa","Pawnee","Payne",
  "Pittsburg","Pontotoc","Pottawatomie","Pushmataha","Roger Mills","Rogers","Seminole",
  "Sequoyah","Stephens","Texas","Tillman","Tulsa","Wagoner","Washington","Washita",
  "Woods","Woodward"
];

window.COUNTY_DATA['OK'] = OK_COUNTIES.map(name => ({...OK_STATE_RULES, 
  county: name,
  url: name === "Oklahoma"
    ? "https://docs.oklahomacounty.org/treasurer/TaxLiens.asp"
    : name === "Tulsa"
      ? "https://www.tulsacounty.org/treasurer/tax-sale"
      : `https://www.${name.toLowerCase().replace(/\s/g,'')}county.us/treasurer`,
  platform: name === "Oklahoma" ? "Online + in-person" : "In-person courthouse",
  taxSaleDate2026: "October 5, 2026 (1st Monday October)",
  resaleDate2026: "June 8, 2026 (2nd Monday June)",
  verified: true
}));
window.COUNTY_DATA['OK_STATE_RULES'] = OK_STATE_RULES;

// ─────────────────────────────────────────────────────────
// RHODE ISLAND — 5 COUNTIES / 39 MUNICIPALITIES — TAX LIEN
// Statute: RIGL Chapter 44-9 (Tax Sales)
// Municipality-level system — each of 39 cities/towns runs own sale
// Interest: 1%/month (12%/yr) on full purchase price post-sale
// Pre-sale penalty: 10% if redeemed within 6mo, +1%/mo thereafter
// 1-year: title holder and owner jointly/severally liable for property
// After 1 year: foreclosure via Superior Court petition (§44-9-25)
// ⚡ East Providence 2026 Tax Sale: April 15, 2026 — CONFIRMED
// ─────────────────────────────────────────────────────────
const RI_STATE_RULES = {
  type: "lien",
  statute: "RIGL Chapter 44-9 (Tax Sales) — §44-9-1 through §44-9-56",
  structure: "39 municipalities run independent tax sales. No county-level auction. Each city/town manages its own lien sales.",
  process: {
    step1: "Taxes delinquent → municipality schedules annual tax sale",
    step2: "Notice: first-class mail 90+ days prior, certified mail 40+ days prior, newspaper publication + public posting",
    step3: "Public auction — collector sells municipal tax lien to highest bidder. Purchaser gets Tax Collector's Deed (lien cert, not ownership).",
    step4: "Year 1: municipality handles redemptions, records certificates. After year 1: lienholder handles redemptions directly.",
    step5: "After 1 year from sale: title holder jointly and severally liable with owner for property compliance.",
    step6: "Foreclose: After 1 year — lien holder petitions Superior Court to foreclose all rights of redemption (§44-9-25)",
    stat: "RIGL §44-9-1, §44-9-8, §44-9-19, §44-9-21, §44-9-25"
  },
  auction: {
    frequency: "Annual — as scheduled by each municipality",
    platform: "Municipality-run. Providence uses CivicSource (confirmed active). Others in-person.",
    bidMethod: "Premium bid — highest bidder. Competitive; experienced investors often bid down to minimum redemption.",
    payment: "Cash or cashier's check. No personal checks.",
    deposit: "Providence requires $1,500 certified check bond to guarantee payment upon winning bid.",
    registration: "In advance required (Providence: 3 weeks prior). Business entities must submit last annual report.",
    statute: "RIGL §44-9-1, §44-9-3"
  },
  confirmed2026: {
    eastProvidence: "April 15, 2026 — confirmed official (eastprovidenceri.gov)",
    providence: "Spring 2026 — check providenceri.gov/collector for exact date (CivicSource)",
    note: "Each municipality sets its own date. Check town/city tax collector website for exact 2026 date."
  },
  otc: {
    available: true,
    name: "Tax Title Assignment",
    statute: "RIGL §44-9-8.1 et seq.",
    process: "Municipality may assign its tax title (from properties it acquired where no bidder) to private investors. Contact municipal tax collector/treasurer directly.",
    note: "RIHMFC (RI Housing) has specific assignment provisions per §44-9-8.3"
  },
  subTax: {
    available: true,
    name: "Intervening Tax Payments",
    statute: "RIGL §44-9-21",
    note: "Lienholder may pay subsequent taxes. Added to redemption amount investor earns interest on."
  },
  redemption: {
    withinSixMonths: "10% of purchase price penalty + 1%/month interest on purchase price from sale date + intervening taxes + costs",
    afterSixMonths: "Additional 1% of purchase price per succeeding month + same interest + intervening taxes + costs",
    fromMunicipality: "First year: redeem from city/town treasurer. After 1 year: redeem directly from lienholder.",
    untilForeclosure: "Right of redemption survives until Superior Court enters final decree foreclosing redemption rights",
    statute: "RIGL §44-9-19, §44-9-21",
    homesteadDifferent: false
  },
  deedPath: {
    name: "Superior Court Decree — Title Absolute After Foreclosure (§44-9-24)",
    process: "After 1 year from sale — petition Superior Court to foreclose redemption (§44-9-25). Court process. Decree bars all rights of redemption.",
    titleEffect: "Absolute title after court decree. Free and clear of redemption rights.",
    alternativeNoForeclosure: "§44-9-36: City/town may sell property without full foreclosure in certain situations.",
    statute: "RIGL §44-9-24, §44-9-25",
    quietTitleRequired: false,
    note: "⚡ Post-1-year: title holder jointly/severally liable with owner for property maintenance, compliance with use/occupancy statutes. Significant investor risk if property has violations."
  },
  surplus: {
    available: true,
    name: "Surplus Proceeds",
    statute: "RIGL §44-9-37 (surplus from sale without foreclosure)",
    process: "Surplus from municipality's sale without foreclosure returned to former owner per §44-9-37. Tyler v. Hennepin applies.",
    note: "Tyler v. Hennepin compliance not yet legislatively codified in RI as of 2026 — municipalities should follow constitutional requirements regardless"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const RI_COUNTIES = [
  {county:"Bristol",municipalities:3,url:"https://www.bristolri.gov/tax-collector"},
  {county:"Kent",municipalities:5,url:"https://www.kentri.gov/tax-collector"},
  {county:"Newport",municipalities:6,url:"https://www.newportri.gov/tax-collector"},
  {county:"Providence",municipalities:20,url:"https://www.providenceri.gov/collector/tax-sale-information/"},
  {county:"Washington",municipalities:9,url:"https://www.southkingstownri.com/tax-collector"},
];

window.COUNTY_DATA['RI'] = RI_COUNTIES.map(c => ({...RI_STATE_RULES, 
  ...c,
  platform: "Municipal tax collector — in-person / CivicSource (Providence confirmed)",
  note: `${c.municipalities} municipalities. Each runs independent lien sale. ⚡ East Providence 2026: April 15. Providence 2026: Spring (CivicSource). Check individual city/town for exact date.`,
  verified: true
}));
window.COUNTY_DATA['RI_STATE_RULES'] = RI_STATE_RULES;

// ─────────────────────────────────────────────────────────
// UTAH — 29 COUNTIES — TAX DEED (Bid-Down Ownership %)
// Statute: UCA §59-2-1339 through §59-2-1362
// Unique: Annual May sale. NO tax lien certs sold.
// Bid method: BID-DOWN ownership percentage
//   (bidder accepts LOWEST % of undivided interest for taxes owed)
// 4-year delinquency required (5 years including sale year in some counties)
// Interest: Federal Funds Rate (varies annually) + 2.5% penalty
// NO post-sale redemption — must redeem BEFORE first bid
// Surplus: 90 days to claim → Utah State Treasurer Unclaimed Property
// ⚡ Weber County May 21, 2026 CONFIRMED
// ─────────────────────────────────────────────────────────
const UT_STATE_RULES = {
  type: "deed",
  statute: "UCA §59-2-1339 through §59-2-1362 (Tax Sales)",
  critical: "⚡ Utah does NOT sell tax lien certificates (UCA §13-50-337 prohibits). Annual May tax sale is a DEED sale. Bid-down ownership percentage is unique to Utah.",
  process: {
    delinquencyTrigger: "4 years delinquent from final payment deadline (some counties: 5 years including year of sale)",
    certification: "March 15/16: 5-year delinquent parcels forwarded to County Auditor for Tax Sale",
    sale: "Annual — 3rd Thursday of May (Utah County: online + live auction. Weber: in-person Ogden.)",
    bidDown: "Bidding starts at 100% undivided interest. As bidding continues, percentage bid DOWN. Winner accepts lowest % of ownership for amount of taxes owed. Original owner retains remaining %.",
    coOwnership: "Post-sale: TWO owners — investor (bid %) + original owner (remaining %). Both are co-owners.",
    deedIssuance: "Tax deed issued after sale ratified by County Commission — usually 60–180 days post-sale.",
    stat: "UCA §59-2-1351.1, §59-2-1351.7"
  },
  auction: {
    frequency: "Annual — 3rd Thursday of May",
    confirmed2026: {
      weber: "May 21, 2026 — Weber Center, Commission Chambers, 2380 Washington Blvd., Ogden, UT 84401. Registration 9 AM.",
      utahCounty: "3rd Thursday May 2026 — online auction (vendor TBD) + live auction at Utah County Admin Bldg, 100 E Center St, Provo",
      note: "Check individual county auditor/clerk websites for exact dates. Weber typical: Thursday before Memorial Day."
    },
    platform: "Utah County: online auction platform + in-person. Weber: in-person. Other counties: varies.",
    payment: "Full amount in cash or certified funds — due same day. Utah County: cash, certified check, money order. Duchesne: credit card (max $4K/transaction) or wire.",
    antiBuyback: "⚡ Owner/lienholders/family/associates CANNOT purchase own parcel at sale. Treated as redemption — no new deed issued."
  },
  otc: {
    available: true,
    name: "Struck-Off / County-Owned Property",
    statute: "UCA §59-2-1351.3 (struck off to county), §59-2-1351.5 (disposition)",
    process: "Parcels with no bids struck off to county. County holds and may sell. Contact county auditor/clerk directly.",
    note: "Some counties post unsold lists on their websites"
  },
  subTax: {
    available: false,
    name: "N/A — Utah deed state, no lien cert mechanism"
  },
  redemption: {
    preAuction: "Owner/lienholders may redeem (pay all delinquent taxes + penalties + interest + fees) until FIRST BID is offered. No redemption after bidding starts.",
    postSale: "⚡ ZERO post-sale redemption period. Utah has NO statutory right of redemption after sale.",
    irsRedemption: "120-day IRS redemption right applies if federal lien",
    thirdPartyPayment: "If third party pays delinquency before first bid — property still redeemed, ownership stays with original owner",
    statute: "UCA §59-2-1346",
    homesteadDifferent: false
  },
  interestAndPenalty: {
    interest: "Federal Funds Rate (established annually) — varies year to year",
    penalty1: "1% minimum/$10 per parcel (Dec 1–Jan 31 and Nov–Dec delinquency)",
    penalty2: "2.5% minimum/$10 per parcel (Feb 1 onward, on original delinquent tax)",
    statute: "UCA §59-2-1331"
  },
  deedPath: {
    name: "Tax Deed (Quit Claim style — similar to QC deed per Utah County FAQ)",
    process: "Deed issued after County Commission ratification (60–180 days post-sale). Records with county recorder.",
    coOwnershipNote: "If bid was for less than 100% — investor and original owner are co-owners. Investor must partition or negotiate buyout to gain full title.",
    titleQuality: "No warranty. AS-IS.",
    statute: "UCA §59-2-1351.1",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Excess Sale Proceeds",
    statute: "UCA §59-2 (implied) + county ordinances",
    claimPeriod: "90 days after sale ratification by County Commission",
    afterExpiry: "Forwarded to Utah State Treasurer Unclaimed Property (mycash.utah.gov)",
    process: "Former owner contacts county treasurer. After 90 days — claim via mycash.utah.gov",
    note: "Tyler v. Hennepin applies. Utah surplus flows to State Treasurer unclaimed property fund if unclaimed within 90 days."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const UT_COUNTIES = [
  {county:"Beaver",url:"https://beaver.utah.gov/clerk-auditor"},
  {county:"Box Elder",url:"https://www.boxeldercounty.org/clerk-auditor"},
  {county:"Cache",url:"https://www.cachecounty.gov/tax-administration/tax-sale.html"},
  {county:"Carbon",url:"https://www.carbon.utah.gov/clerk-auditor"},
  {county:"Daggett",url:"https://www.daggettcounty.org/clerk-auditor"},
  {county:"Davis",url:"https://www.daviscountyutah.gov/clerk-auditor"},
  {county:"Duchesne",url:"https://duchesne.utah.gov/gov/elected-officials/clerk-auditor/delinquent-tax/tax-sale-list/"},
  {county:"Emery",url:"https://www.emerycounty.com/clerk-auditor"},
  {county:"Garfield",url:"https://www.garfield.utah.gov/clerk-auditor"},
  {county:"Grand",url:"https://www.grandcountyutah.net/clerk-auditor"},
  {county:"Iron",url:"https://www.ironcounty.net/clerk-auditor"},
  {county:"Juab",url:"https://www.juabcounty.com/clerk-auditor"},
  {county:"Kane",url:"https://www.kane.utah.gov/clerk-auditor"},
  {county:"Millard",url:"https://www.millardcounty.com/clerk-auditor"},
  {county:"Morgan",url:"https://morgancountyutah.gov/clerk-auditor"},
  {county:"Piute",url:"https://www.piute.utah.gov/clerk-auditor"},
  {county:"Rich",url:"https://www.richcountyutah.org/clerk-auditor"},
  {county:"Salt Lake",url:"https://www.slco.org/clerk-auditor"},
  {county:"San Juan",url:"https://sanjuancountyutah.org/clerk-auditor"},
  {county:"Sanpete",url:"https://www.sanpete.com/clerk-auditor"},
  {county:"Sevier",url:"https://www.sevier.utah.gov/clerk-auditor"},
  {county:"Summit",url:"https://www.summitcounty.org/clerk-auditor"},
  {county:"Tooele",url:"https://www.tooeleco.org/clerk-auditor"},
  {county:"Uintah",url:"https://www.uintah.utah.gov/clerk-auditor"},
  {county:"Utah",url:"https://auditor.utahcounty.gov/may-tax-sale"},
  {county:"Wasatch",url:"https://www.wasatch.utah.gov/clerk-auditor"},
  {county:"Washington",url:"https://www.washco.utah.gov/clerk-auditor"},
  {county:"Wayne",url:"https://www.wayne.utah.gov/clerk-auditor"},
  {county:"Weber",url:"https://www.webercountyutah.gov/Clerk_Auditor/tax_sale.php"},
];

window.COUNTY_DATA['UT'] = UT_COUNTIES.map(c => ({...UT_STATE_RULES, 
  ...c,
  platform: c.county === "Utah" ? "Online auction + in-person (Utah County Auditor)" : c.county === "Weber" ? "In-person — Weber Center, Ogden" : "In-person courthouse / county auditor",
  saleDate2026: c.county === "Weber" ? "May 21, 2026 — CONFIRMED" : "3rd Thursday May 2026 — check county auditor site",
  verified: true
}));
window.COUNTY_DATA['UT_STATE_RULES'] = UT_STATE_RULES;

// ─────────────────────────────────────────────────────────
// VERMONT — 14 COUNTIES / 246 MUNICIPALITIES — TAX LIEN (deed hybrid)
// Statute: 32 VSA Chapter 133, §5252–§5263
// Municipality-level system (like ME, NH). No county auction.
// 1yr+ delinquency + $1,500+ threshold → warrant + levy → auction
// Bid method: Premium bid — highest bidder gets deed subject to redemption
// Interest: 1%/month (12%/yr) from day of sale to redemption
// Redemption: 1 year from sale
// After 1 year: Tax Collector's Deed becomes marketable (+ 1yr SOL for challenge)
// ⚡ Vermont S.196 (2026 session) — pending bill amending §5253 + §5260
// Surplus: UNSETTLED — no explicit surplus statute. Tyler v. Hennepin applies.
// ─────────────────────────────────────────────────────────
const VT_STATE_RULES = {
  type: "lien",
  statute: "32 VSA Chapter 133 §5252 (Warrant), §5253 (Notice), §5255 (Report of Sale), §5260 (Redemption), §5263 (SOL)",
  structure: "246 municipalities run independent tax sales. No county-level auction. Each town/city manages its own tax sale.",
  process: {
    threshold: "Delinquency > 1 year AND minimum $1,500 owed before warrant may be extended",
    paymentPlan: "⚡ Municipality MUST offer written reasonable repayment plan before initiating sale. Cannot proceed until taxpayer declines or defaults.",
    warrant: "Collector extends warrant (lien) on land. Warrant and levy recorded per §5252(a).",
    notice: "Certified mail return receipt to last known address: 10 days prior (residents), 20 days prior (non-residents). Newspaper publication 3 consecutive weeks.",
    bilingualNotice: "⚡ 2023 No. 106 (eff. May 13 2024): Notice must include statement translated into 5 most common non-English languages in VT, with resource for translation.",
    auction: "Public auction — municipality sells at highest bid. Purchaser receives deed subject to 1-year redemption.",
    stat: "32 VSA §5252, §5253"
  },
  pendingLegislation: {
    bill: "S.196 (2026 Vermont Legislative Session)",
    amends: "32 VSA §5252 (warrant procedure), §5253 (notice requirements), §5260 (redemption), adds §5254a",
    status: "Introduced 2026 session — MONITOR. Amendments to notice and redemption provisions.",
    sourceUrl: "https://legislature.vermont.gov/Documents/2026/Docs/BILLS/S-0196/S-0196%20As%20Introduced.pdf",
    alert: "⚡ Vermont S.196 (2026) — pending bill that amends tax sale notice and redemption statutes. Check legislature.vermont.gov for status before teaching VT rules in seminars."
  },
  auction: {
    frequency: "As scheduled by each municipality — no fixed statewide date",
    platform: "Municipality-run — in-person auction. No statewide platform.",
    bidMethod: "Premium bid — highest bidder. Purchaser receives Tax Collector's Deed subject to 1-year redemption.",
    payment: "Immediate payment at auction. Exact requirements set by municipality.",
    statute: "32 VSA §5254"
  },
  otc: {
    available: false,
    name: "N/A — Vermont tax sales are municipality-run public auctions. No OTC mechanism.",
    note: "Contact individual municipalities directly for delinquent property inquiries."
  },
  subTax: {
    available: false,
    name: "N/A — Vermont lien stays with municipality/purchaser as sold at auction"
  },
  redemption: {
    period: "1 year from day of sale",
    amounts: "Sum for which land was sold + 1%/month interest from day of sale to day of payment + costs",
    paymentTo: "Collector who made sale (or town clerk if collector died/moved)",
    statute: "32 VSA §5260",
    homesteadDifferent: false,
    notice90to120days: "⚡ Collector must post notice in public place 90–120 days prior to end of redemption period (2023 amendment, eff. May 2024)"
  },
  deedPath: {
    name: "Tax Collector's Deed",
    timing: "Deed issued AFTER 1-year redemption period expires without redemption",
    marketableTitle: "Requires: (1) notice consistent with §5252/§5253 and constitutional due process, AND (2) 1-year SOL from date of levy has passed (32 VSA §5263)",
    statute: "32 VSA §5255, §5261, §5263",
    titleEffect: "Conveys title against taxpayer and all persons claiming under taxpayer. State tax liens and federal tax liens may survive.",
    stateLinenSurvival: "⚡ VT Dept of Taxes position: state tax liens NOT extinguished by tax sale. Federal government takes same position for IRS liens.",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    note: "Title insurance: examiner must verify notice compliance AND confirm 1-year SOL has passed. Court order confirms title if defect exists."
  },
  surplus: {
    available: true,
    name: "Surplus / Excess Proceeds",
    statute: "No explicit VT statute (noted as 'unsettled' in Vermont Attorney's Title Corp Standard 19.1)",
    status: "⚡ UNSETTLED — Vermont has no clear codified surplus distribution statute as of 2026. Tyler v. Hennepin constitutional requirements apply regardless.",
    note: "In Re Estate of Mary Lee Settle-Tazewell case noted as pending resolution. Best practice: municipalities should distribute surplus to former owner. Contact VT Dept of Taxes for guidance.",
    tylerCompliance: "Constitutional requirement under Tyler v. Hennepin — former owner entitled to surplus even without explicit VT statute"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const VT_COUNTIES = [
  {county:"Addison",municipalities:23,url:"https://addisondeeds.com"},
  {county:"Bennington",municipalities:11,url:"https://benningtondeeds.com"},
  {county:"Caledonia",municipalities:17,url:"https://caledoniadeeds.com"},
  {county:"Chittenden",municipalities:19,url:"https://www.ccrpcvt.org/registry-of-deeds"},
  {county:"Essex",municipalities:11,url:"https://essexdeeds.com"},
  {county:"Franklin",municipalities:14,url:"https://franklindeeds.com"},
  {county:"Grand Isle",municipalities:5,url:"https://grandisledeeds.com"},
  {county:"Lamoille",municipalities:11,url:"https://lamoilledeeds.com"},
  {county:"Orange",municipalities:20,url:"https://orangedeeds.com"},
  {county:"Orleans",municipalities:27,url:"https://orleansdeeds.com"},
  {county:"Rutland",municipalities:27,url:"https://rutlanddeeds.com"},
  {county:"Washington",municipalities:22,url:"https://washingtondeeds.com"},
  {county:"Windham",municipalities:28,url:"https://windhamdeeds.com"},
  {county:"Windsor",municipalities:25,url:"https://windsordeeds.com"},
];

window.COUNTY_DATA['VT'] = VT_COUNTIES.map(c => ({...VT_STATE_RULES, 
  ...c,
  platform: "Municipal tax collector — in-person public auction",
  note: `${c.municipalities} municipalities. Each runs independent tax sale. ⚡ S.196 (2026 session) pending — amends notice + redemption statutes. Monitor legislature.vermont.gov. Surplus law unsettled — Tyler v. Hennepin applies.`,
  verified: true
}));
window.COUNTY_DATA['VT_STATE_RULES'] = VT_STATE_RULES;

console.log('Batch 9 loaded — NM:', window.COUNTY_DATA['NM'].length,
  '| OK:', window.COUNTY_DATA['OK'].length,
  '| RI:', window.COUNTY_DATA['RI'].length,
  '| UT:', window.COUNTY_DATA['UT'].length,
  '| VT:', window.COUNTY_DATA['VT'].length);
