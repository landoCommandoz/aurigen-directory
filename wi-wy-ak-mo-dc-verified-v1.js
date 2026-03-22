// ═══════════════════════════════════════════════════════════
// BATCH 10 — WI, WY, AK, MO, DC — FULL STRUCTURE v1
// March 2026
// ═══════════════════════════════════════════════════════════

window.COUNTY_DATA = window.COUNTY_DATA || {};

// ─────────────────────────────────────────────────────────
// WISCONSIN — 72 COUNTIES — TAX DEED (County-held, 3 paths)
// Statute: Wis. Stat. Ch. 74 (Collection) + Ch. 75 (Tax Sales)
// ⚡ Wisconsin does NOT sell tax lien certificates (§74.57(3))
// Sept 1: County treasurer issues Tax Certificate for all unpaid parcels
// 2-year redemption period
// After 2 years: county may pursue one of 3 paths to get title
// Interest: 1%/month (12%/yr) — Milwaukee County: 18%/yr (1.5%/mo)
// Tyler v. Hennepin: WI law changed post-2023 — surplus must be returned
// ─────────────────────────────────────────────────────────
const WI_STATE_RULES = {
  type: "deed",
  statute: "Wis. Stat. §74.57 (Tax Certificate) + §75.01–§75.521 (Tax Sales/Foreclosure)",
  critical: "⚡ Wisconsin does NOT sell tax lien certificates to private investors (§74.57(3) prohibits county from selling, assigning, or transferring tax certificates). County holds all certificates.",
  process: {
    step1: "Taxes delinquent after Jan 31. Interest + penalty: 1%/month from Feb 1. Washington County confirmed: 1.5%/month = 18%/yr.",
    step2: "September 1: County treasurer issues Tax Certificate for ALL parcels with unpaid taxes as of Aug 31. Includes all delinquent real property taxes, special assessments, special charges, special taxes.",
    step3: "Treasurer mails notice to homeowner within 90 days of certificate issuance (§74.59).",
    step4: "2-year redemption period begins. Owner may redeem by paying all delinquent amounts + interest + penalties + costs.",
    step5: "After 2 years without redemption — county may pursue ONE of 3 title-taking paths.",
    titlePaths: {
      path1_taxDeed: "Tax Deed Process (§75.12, §75.14): County applies to county clerk for tax deed. Clerk issues deed to county. County records deed.",
      path2_mortgage: "Mortgage Foreclosure Process (§75.19): County forecloses using same process as mortgage lender. Court-supervised.",
      path3_inRem: "In Rem Statutory Foreclosure (§75.521): County files petition with court listing all delinquent properties. Most common in rural/smaller counties. Court enters judgment. GAL appointed for minors/incompetents."
    },
    stat: "Wis. Stat. §74.57, §75.12, §75.14, §75.19, §75.521"
  },
  auction: {
    frequency: "After county takes title — county sells at public auction. As scheduled by county.",
    platform: "County-run — in-person or online depending on county",
    bidMethod: "Premium bid — highest bidder",
    note: "County must sell property after taking title per §75.35. Timing varies by county."
  },
  otc: {
    available: true,
    name: "County-Owned Tax-Deeded Properties",
    process: "Contact county treasurer or clerk directly. Counties may offer unsold tax-deeded properties.",
    note: "No standard OTC lien cert sales — county holds all certs"
  },
  subTax: {
    available: false,
    name: "N/A — No private lien cert holders in Wisconsin"
  },
  delinquencyInterest: {
    standard: "1%/month (12%/yr) — confirmed at multiple WI counties",
    milwaukee: "⚡ Milwaukee County: 18%/yr (1.5%/month) — confirmed per county treasurer",
    washington: "1.5%/month — confirmed Washington County",
    statute: "Wis. Stat. §74.47"
  },
  redemption: {
    period: "2 years from issuance of tax certificate (September 1 of certificate year)",
    delayException: "If treasurer fails to mail required notice — redemption period starts from mailing date, not certificate date",
    erosionException: "1-year redemption if county incurred expenses for erosion control",
    amounts: "All delinquent taxes + special assessments + special charges + interest + penalties + costs",
    statute: "Wis. Stat. §74.57, §75.03",
    homesteadDifferent: false
  },
  deedPath: {
    name: "Tax Deed to County / Foreclosure Judgment (3 paths)",
    titleEffect: "County takes title. Then sells to new owner.",
    restrictionsSurvive: "⚡ Covenants and restrictions running with land SURVIVE tax deed (§75.14(4)) — unlike most states",
    challenge: "Former owner may challenge within limitation period set by §75.27. Notice required before limitation runs.",
    statute: "Wis. Stat. §75.12, §75.14, §75.19, §75.521",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Excess Sale Proceeds",
    statute: "Wis. Stat. §75.35 (sale of county-held property) + Tyler v. Hennepin (2023)",
    process: "Post-Tyler: Wisconsin counties must return surplus to former owner. State law changed after Tyler ruling.",
    note: "⚡ Pre-Tyler: WI counties kept surplus. Now excess must go to former property owner after county recoups taxes + costs + interest."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const WI_COUNTIES = [
  "Adams","Ashland","Barron","Bayfield","Brown","Buffalo","Burnett","Calumet",
  "Chippewa","Clark","Columbia","Crawford","Dane","Dodge","Door","Douglas",
  "Dunn","Eau Claire","Florence","Fond du Lac","Forest","Grant","Green",
  "Green Lake","Iowa","Iron","Jackson","Jefferson","Juneau","Kenosha","Kewaunee",
  "La Crosse","Lafayette","Langlade","Lincoln","Manitowoc","Marathon","Marinette",
  "Marquette","Menominee","Milwaukee","Monroe","Oconto","Oneida","Outagamie",
  "Ozaukee","Pepin","Pierce","Polk","Portage","Price","Racine","Richland","Rock",
  "Rusk","Sauk","Sawyer","Shawano","Sheboygan","St. Croix","Taylor","Trempealeau",
  "Vernon","Vilas","Walworth","Washburn","Washington","Waukesha","Waupaca",
  "Waushara","Winnebago","Wood"
];

window.COUNTY_DATA['WI'] = WI_COUNTIES.map(name => ({
  county: name,
  url: name === "Lafayette"
    ? "https://www.lafayettecountywi.org/treasurer/page/property-tax-foreclosure-sale"
    : name === "Oconto"
      ? "https://www.ocontocountywi.gov/416/In-Rem-Foreclosure-of-Tax-Liens"
      : name === "Milwaukee"
        ? "https://county.milwaukee.gov/EN/Treasurer/Delinquent-Property-Taxes"
        : name === "Washington"
          ? "https://www.washcowisco.gov/departments/county_treasurer"
          : `https://www.co.${name.toLowerCase().replace(/\s\./g,'').replace(/\s/g,'.')}.wi.us/treasurer`,
  platform: "County treasurer/clerk — in-person or online per county",
  certIssuanceDate: "September 1 annually",
  ...WI_STATE_RULES,
  verified: true,
  delinquencyNote: name === "Milwaukee" ? "⚡ Milwaukee: 18%/yr (1.5%/month)" : "1%/month (12%/yr)"
}));
window.COUNTY_DATA['WI_STATE_RULES'] = WI_STATE_RULES;

// ─────────────────────────────────────────────────────────
// WYOMING — 23 COUNTIES — TAX LIEN
// Statute: WS §39-13-108 (Enforcement)
// Annual sale: Last Thursday in July or first Thursday in August
// Interest: 15%/yr simple interest + 3% penalty on day of purchase
// Subsequent taxes: also earn 15%/yr when paid by cert holder
// 4-year redemption (up to 6 years total — deed eligible 4–6 yrs)
// County holds certificates (not mailed to investor)
// Cert void after 6 years if no deed obtained
// ⚡ Teton County Aug 5, 2026 CONFIRMED (pre-reg Aug 3–4)
// ─────────────────────────────────────────────────────────
const WY_STATE_RULES = {
  type: "lien",
  statute: "WS §39-13-108 (Enforcement — Tax Lien Sale, Redemption, Deed)",
  process: {
    step1: "Taxes delinquent. County treasurer publishes notice in local newspaper 3 consecutive weeks prior to sale.",
    step2: "Annual public auction. Purchaser pays all taxes + interest + costs. County issues Certificate of Purchase.",
    step3: "County retains physical custody of Certificate. Sends copy to purchaser within reasonable time.",
    step4: "During 4-year redemption: original owner may redeem. Purchaser may pay subsequent taxes (also earn 15%/yr).",
    step5: "4 years post-sale: cert holder may apply for tax deed (providing statutory notice). County treasurer issues deed.",
    step6: "6-year limit: tax deed CANNOT be issued after 6 years from original sale date. Certificate void.",
    stat: "WS §39-13-108"
  },
  auction: {
    frequency: "Annual — last Thursday in July OR first Thursday in August",
    platform: "In-person county courthouse/designated location. Each of 23 counties independently.",
    bidMethod: "Premium bid — purchaser bids and pays full amount of taxes + interest + costs",
    registration: "Pre-registration varies by county. Some: day of sale 8 AM. Teton: must pre-register. W-9 required at many counties.",
    payment: "Cash, bank checks, credit/debit cards (county-dependent). No personal checks at most counties.",
    limitation: "Some counties cap attendance (Teton: pre-registered only, Lincoln: 100 max)",
    confirmed2026: {
      teton: "August 5, 2026 — Teton County Fairgrounds Community Building, 305 W. Snow King, Jackson, WY 83001. Pre-registration Aug 3–4, 9AM–4:30PM, County Admin Building 200 S. Willow St. — CONFIRMED OFFICIAL",
      laramie: "Late July/early August — check county website (historically after Frontier Days™)",
      general: "Most counties: last Thursday July or first Thursday August 2026"
    },
    statute: "WS §39-13-108"
  },
  otc: {
    available: true,
    name: "County-Held Certificates (OTC)",
    process: "If no bidder at tax sale — county holds certificate. Contact county treasurer to purchase county-held liens.",
    note: "County-held certs earn same 15%/yr rate upon redemption"
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payments",
    statute: "WS §39-13-108",
    rate: "15% per annum on subsequent taxes paid",
    obligation: "Certificate holder is under NO obligation to pay subsequent taxes. Optional.",
    note: "If paid — subsequent taxes attach to original lien and earn 15%/yr"
  },
  redemption: {
    period: "4 years from date of tax lien sale",
    window: "Can redeem anytime until county treasurer accepts tax deed application (between 4–6 years)",
    amounts: "Amount of tax sold at sale + 3% penalty + 15% simple interest + any subsequent taxes paid by cert holder with 15% interest + redemption fee + purchaser's actual expenses (not to exceed $250 if redeeming after pre-deed notice)",
    statute: "WS §39-13-108, §39-13-109",
    homesteadDifferent: false
  },
  deedPath: {
    name: "Treasurer's Deed",
    eligibleWindow: "4 years to 6 years from date of sale",
    noticeRequired: "Cert holder must comply with statutory notice requirements BEFORE applying. 60-day notice to record owner + mortgage holders by personal service or certified mail.",
    taxDeedAfter6yr: "⚡ Tax deed CANNOT be issued after 6 years from sale. Certificate expires. All money invested is potentially lost.",
    titleEffect: "Deed conveys title free and clear. 6-year SOL on actions to recover property (WS §39-13-108(c)(D))",
    statute: "WS §39-13-108",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Surplus Proceeds",
    statute: "WS §39-13-108 — surplus of personal property sale returned to owner. Tyler v. Hennepin applies to real property.",
    process: "Surplus from sale above taxes + costs returned to former owner. Tyler v. Hennepin constitutional requirement.",
    note: "WY statute §39-13-108(A)(V) explicitly requires surplus return on personal property distraint — Tyler applies to real property surplus."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const WY_COUNTIES = [
  {county:"Albany",url:"https://www.albanycountywy.gov/299/Tax-Lien-Sale"},
  {county:"Big Horn",url:"https://www.bighorncountywy.gov/treasurer/tax-sale"},
  {county:"Campbell",url:"https://www.campbellcountywy.gov/2267/Tax-Sale-Info"},
  {county:"Carbon",url:"https://www.carbonwy.com/treasurer/tax-sale"},
  {county:"Converse",url:"https://www.conversecounty.org/treasurer/tax-sale"},
  {county:"Crook",url:"https://www.crookcounty.wy.gov/treasurer/tax-sale"},
  {county:"Fremont",url:"https://www.fremontcountywy.gov/treasurer/tax-sale"},
  {county:"Goshen",url:"https://goshencounty.org/236/Tax-Sale"},
  {county:"Hot Springs",url:"https://www.hotspringswy.gov/treasurer/tax-sale"},
  {county:"Johnson",url:"https://www.johnsoncountywy.net/treasurer/tax-sale"},
  {county:"Laramie",url:"https://www.laramiecountywy.gov/County-Government/Elected-Officials/County-Treasurer/Tax-Sale"},
  {county:"Lincoln",url:"https://www.lincolncountywy.gov/government/treasurer/tax_sale.php"},
  {county:"Natrona",url:"https://www.natrona.net/treasurer/tax-sale"},
  {county:"Niobrara",url:"https://www.niobraracountywy.gov/treasurer/tax-sale"},
  {county:"Park",url:"https://www.parkcounty.us/treasurer/tax-sale"},
  {county:"Platte",url:"https://www.plattecountywyoming.com/treasurer/tax-sale"},
  {county:"Sheridan",url:"https://www.sheridancountywy.gov/treasurer/tax-sale"},
  {county:"Sublette",url:"https://www.sublettewyo.com/treasurer/tax-sale"},
  {county:"Sweetwater",url:"https://www.sweetwatercountywy.gov/departments/treasurer/tax_sales_and_redemptions.php"},
  {county:"Teton",url:"https://www.tetoncountywy.gov/439/Delinquent-Tax-Sale-Information-Provisio"},
  {county:"Uinta",url:"https://www.uintacounty.com/treasurer/tax-sale"},
  {county:"Washakie",url:"https://www.washakiecountywy.gov/treasurer/tax-sale"},
  {county:"Weston",url:"https://www.westoncountywy.gov/treasurer/tax-sale"},
];

window.COUNTY_DATA['WY'] = WY_COUNTIES.map(c => ({
  ...c,
  platform: "In-person county courthouse/fairgrounds",
  saleDate2026: c.county === "Teton" ? "August 5, 2026 — CONFIRMED (pre-reg Aug 3–4)" : "Late July or early August 2026 — check county treasurer site",
  ...WY_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['WY_STATE_RULES'] = WY_STATE_RULES;

// ─────────────────────────────────────────────────────────
// ALASKA — 19 ORGANIZED BOROUGHS + UNIFIED HOME RULE MUNICIPALITIES
// Statute: AS §29.45.290–§29.45.500 (Enforcement of Tax Liens)
// Unique: Municipality-administered judicial foreclosure. NO public tax sale.
// Process: Municipality files court petition → Judgment/Decree → 
//   property transfers to municipality → 1-year redemption → 
//   municipality sells tax-foreclosed property
// No private lien cert sales. Municipality acquires directly.
// 10-year repurchase right (if property not yet sold)
// Surplus: 6-month claim window; municipality must give written notice
// ⚡ FNSB Aug 28, 2026 CONFIRMED
// ⚡ Anchorage 2026 properties listed at muni.org
// ─────────────────────────────────────────────────────────
const AK_STATE_RULES = {
  type: "deed",
  statute: "AS §29.45.290–§29.45.500 (Municipal Taxation — Enforcement of Tax Liens)",
  structure: "Alaska has boroughs (not counties) + home rule municipalities. Only taxing municipalities (25 total) levy property tax. Rural Alaska unorganized areas generally have no property tax.",
  critical: "⚡ Alaska does NOT hold public tax auctions where anyone can bid on tax-delinquent property. Municipality files court petition, acquires property through judicial decree, then sells through its own process.",
  process: {
    step1: "Delinquent taxes become lien on property.",
    step2: "Municipality files petition with Superior Court for judicial foreclosure (AS §29.45.320, §29.45.330).",
    step3: "Publication: delinquent tax list published in newspaper for 4 weeks (or posted if no newspaper).",
    step4: "Within 10 days of first publication: municipality mails certified mail notice to owner.",
    step5: "30-day answer period: interested parties may file answer with court (AS §29.45.370).",
    step6: "Court enters Judgment and Decree of Foreclosure. Property transfers to municipality.",
    step7: "Municipality holds property ≥1 year (redemption period).",
    step8: "Municipality sells foreclosed property (sealed bids, public auction, or other process per municipal ordinance).",
    stat: "AS §29.45.320, §29.45.330, §29.45.380, §29.45.390, §29.45.400, §29.45.460"
  },
  auction: {
    frequency: "As scheduled by each municipality. FNSB: at least every 2 years.",
    platform: {
      anchorage: "Sealed bid auction (typical). Properties listed at muni.org/Departments/hlb/pages/resforeclosedproperties.aspx. 2026 properties listed.",
      fnsb: "Public auction — Aug 28, 2026 CONFIRMED",
      other: "Each municipality sets its own process per AS §29.45.460(b)"
    },
    confirmed2026: {
      fnsb: "August 28, 2026 — Fairbanks North Star Borough — CONFIRMED OFFICIAL (fnsb.gov)",
      anchorage: "2026 properties listed at muni.org — sale date TBD. Typical: sealed bid process.",
      fnsb_interest: "FNSB delinquency: 5% penalty + 8%/yr simple interest on taxes due"
    }
  },
  otc: {
    available: false,
    name: "N/A — Alaska municipal foreclosure only. No OTC lien cert sales.",
    note: "Contact individual municipalities for surplus/unsold foreclosed property listings."
  },
  subTax: {
    available: false,
    name: "N/A — No private lien cert holders in Alaska"
  },
  delinquencyInterest: {
    fnsb: "5% penalty + 8%/yr simple interest",
    anchorage: "Varies — contact MOA Treasury (907) 343-6650",
    statute: "AS §29.45 — rates set by each municipality"
  },
  redemption: {
    period: "1 year from date property transferred to municipality by court decree",
    amounts: "Lien amount + penalties + interest + costs (including AS §29.45.440(a) costs)",
    payTo: "Municipality",
    possession: "Owner may reside in property during redemption period. Municipality may declare immediate forfeiture if owner damages property.",
    preDecree: "Owner may stop foreclosure anytime before court transfers property by paying full delinquency.",
    statute: "AS §29.45.400, §29.45.340",
    homesteadDifferent: false
  },
  repurchaseRight: {
    period: "10 years from date foreclosure completed (if property not yet sold to new owner)",
    amounts: "Debt amount + interest ≤15%/yr from foreclosure judgment date + delinquent taxes that would have accrued + maintenance/management costs exceeding rental income + insurance + HOA dues",
    statute: "AS §29.45.470",
    note: "10-year right expires if municipality sells property to third party"
  },
  deedPath: {
    name: "Municipality acquires by court decree → sells to buyer",
    titleEffect: "Buyer gets title to property. Mortgage and other liens eliminated.",
    anchorageProcess: "MOA: sealed bids generally. Property profiles (litigation guarantee + vicinity map) available before sale.",
    statute: "AS §29.45.460, §29.45.480",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Excess Sale Proceeds",
    statute: "AS §29.45.480(b)",
    claimPeriod: "6 months from date of sale",
    process: "Upon sale: municipality provides written notice to former owner of excess amount and claim procedure. Claim must be filed within 6 months — permanently barred after.",
    scope: "Applies if property held <10 years after redemption period and NOT designated for public purpose",
    anchorageNote: "⚡ Anchorage MOA: 'A claim for the excess filed after six months of the date of sale is forever barred.' Municipality sends written notice of excess and claim procedure.",
    noticeRequired: "Municipality MUST give written notice of surplus and claim procedure to former owner (AS §29.45.460(c))"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const AK_BOROUGHS = [
  {county:"Municipality of Anchorage",url:"https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx",note:"⚡ 2026 properties listed. Sealed bid process typical. Treasury: (907) 343-6650"},
  {county:"Fairbanks North Star Borough",url:"https://www.fnsb.gov/169/Tax-Foreclosure",note:"⚡ Aug 28, 2026 CONFIRMED. Delinquency: 5% penalty + 8%/yr."},
  {county:"Matanuska-Susitna Borough",url:"https://www.matsugov.us/treasury/delinquent-taxes"},
  {county:"Kenai Peninsula Borough",url:"https://www.kpb.us/treasurer/delinquent-taxes"},
  {county:"Kodiak Island Borough",url:"https://www.kodiakak.us/treasurer/delinquent-taxes"},
  {county:"City and Borough of Juneau",url:"https://juneau.org/finance/property-taxes"},
  {county:"City and Borough of Sitka",url:"https://www.cityofsitka.com/government/departments/finance/taxes"},
  {county:"Ketchikan Gateway Borough",url:"https://www.kgbak.us/departments/finance/property-tax"},
  {county:"Bristol Bay Borough",url:"https://www.bristolbayborough.org/finance"},
  {county:"Denali Borough",url:"https://www.denaligov.org/finance"},
  {county:"Haines Borough",url:"https://hainesak.gov/finance"},
  {county:"Petersburg Borough",url:"https://www.petersburgak.gov/government/finance"},
  {county:"City of Wrangell",url:"https://www.wrangell.com/finance"},
  {county:"Skagway Borough",url:"https://www.skagway.org/finance"},
  {county:"Lake and Peninsula Borough",url:"https://www.lakeandpenboroughak.us"},
  {county:"Aleutians East Borough",url:"https://www.aleutianseast.org"},
  {county:"Aleutians West Census Area",url:"https://commerce.alaska.gov/web/dcra"},
  {county:"Northwest Arctic Borough",url:"https://www.nwabor.org"},
  {county:"Nome Census Area",url:"https://commerce.alaska.gov/web/dcra"},
];

window.COUNTY_DATA['AK'] = AK_BOROUGHS.map(b => ({
  ...b,
  platform: "Municipal/Borough — judicial foreclosure + sealed bid or public auction",
  ...AK_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['AK_STATE_RULES'] = AK_STATE_RULES;

// ─────────────────────────────────────────────────────────
// MISSOURI — 114 COUNTIES + CITY OF ST. LOUIS — TAX LIEN (Multi-Offering)
// Statute: RSMo Chapter 140 (Tax Sales)
// Annual sale: 4th Monday in August (most counties)
// Unique: Multi-offering system (1st, 2nd, 3rd, post-3rd offerings)
// Interest: 10%/yr on purchase price (sub-tax: 8%/yr)
// 1-year redemption (1st/2nd offering) | 90 days (3rd offering) | NONE (post-3rd)
// Surplus: 3 years to claim → school fund
// Title requires quiet title for 30 years (many title insurers)
// CivicSource used in KC-area counties
// ─────────────────────────────────────────────────────────
const MO_STATE_RULES = {
  type: "lien",
  statute: "RSMo Chapter 140 (Tax Sales, Redemption, Deeds)",
  multiOffering: {
    first: "1st Offering: Property taxes delinquent >1 year (as of last business day in April) and unpaid by day of sale. Purchaser gets Certificate of Purchase.",
    second: "2nd Offering: Same property offered second year without prior sale.",
    third: "3rd Offering: Property offered 3rd time — sold to highest bidder ≥ delinquent taxes + costs. Certificate issued. 90-day redemption only.",
    postThird: "Post-3rd Offering: Collector's Deed issued IMMEDIATELY. NO redemption period. County trustee (if applicable) attempts resale.",
    note: "St. Louis City and large charter counties may have different fee structures"
  },
  process: {
    advertising: "Delinquent list published in local newspaper 3 consecutive weeks prior to sale. Delinquent list also published online at county website.",
    registration: "Pre-registration typically opens August. Day-of: sign affidavit of no delinquent taxes. Must present MO driver's license or ID. Bidding in business name requires additional Bidder Affidavit-Business form.",
    sale: "Public auction. Minimum bid = all taxes + interest + sale expenses. No upper limit. Highest bidder gets Certificate of Purchase.",
    certificate: "Certificate = lien on property. NOT ownership. Certificate does NOT entitle holder to possession during redemption.",
    stat: "RSMo §140.150, §140.160, §140.170, §140.190, §140.250, §140.290"
  },
  auction: {
    frequency: "Annual — 4th Monday in August (most counties). Some counties vary.",
    date2026: "4th Monday August 2026 = August 24, 2026",
    platform: "CivicSource online (KC-area and growing), in-person courthouse (most counties)",
    payment: "Full payment IMMEDIATELY at sale. Penalty of 25% of bid to school fund if winning bidder defaults.",
    nonResident: "Non-MO residents must appoint citizen of county as agent + consent in writing to Circuit Court jurisdiction (RSMo §140.190)",
    registrationNote: "Must affirm no delinquent taxes in county. Bidding on own property or relatives' property prohibited.",
    statute: "RSMo §140.170, §140.190, §140.280"
  },
  otc: {
    available: true,
    name: "Post-Tax-Sale / 2nd/3rd Offering / County Land Trust",
    process: "Properties unsold from prior years available. Contact county collector directly. Some counties maintain surplus property lists.",
    landTrust: "RSMo §140.260: County may establish land trust for unsold tax-delinquent parcels. Trustee sells for benefit of taxing entities."
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payments",
    statute: "RSMo §140.280, §140.290",
    rate: "8% per annum (vs 10% on original cert amount)",
    obligation: "Purchaser IS responsible for all subsequent taxes (different from WY/CA). Must pay to protect lien position.",
    note: "⚡ MO certificate holder MUST pay subsequent taxes. Failure to pay subsequent taxes may compromise ability to obtain deed."
  },
  redemption: {
    firstSecondOffering: "1 year absolute right to redeem. Continues as defeasible right until deed issued.",
    thirdOffering: "90 days only (RSMo §140.250)",
    postThird: "⚡ NO redemption period. Collector's Deed issued immediately.",
    amounts: {
      original: "Purchase price + 10%/yr simple interest (on original cert amount MINUS any surplus)",
      subTax: "Subsequent taxes paid by cert holder + 8%/yr interest",
      costs: "Title search costs + notice costs (after March 1 of year following sale for 1st/2nd; immediately for 3rd offering)"
    },
    statute: "RSMo §140.340, §140.250",
    infants: "Infants/incapacitated/disabled: may redeem 1 year after disability expiration",
    homesteadDifferent: false
  },
  deedPath: {
    name: "Collector's Deed",
    process: "After 90-day notice requirement met (RSMo §140.405): certified mail to owner + all recorded lienholders. After redemption period + proper notice → cert holder applies for deed.",
    notice: "⚡ At least 90 days before deed application: certified mail to owner of record AND all recorded deed of trust/mortgage/lease/lien holders at last known address. If certified mail returned unsigned and first-class also returned — attempt additional notice (door posting, alternative method).",
    deedDeadline: "Cert holder must cause deed to be executed and RECORDED within 18 months of sale date. Miss this → assignment of deed prohibited (RSMo §140.410)",
    noInterest: "If 90-day notice not sent until after 1-year redemption period → no further interest charged from that date",
    titleInsurance: "⚡ Many title companies restrict property for 30 YEARS from tax sale date — severely limits ability to sell or finance",
    quietTitle: "Quiet title action in Circuit Court recommended. Must commence within 3 years from when deed was recorded.",
    statute: "RSMo §140.405, §140.410, §140.460",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Surplus Funds",
    statute: "RSMo §140.230",
    distribution: "First to former lienholders of record (by priority), then to former owner",
    timing: "Not distributed until 90 days after redemption period expires",
    claimPeriod: "3 years from sale date — unclaimed surplus becomes county school fund",
    noInterest: "⚡ No interest paid on surplus receipts",
    process: "Collector submits sworn statement to county commission. Commission approves. Treasurer holds in trust. Former owners/lienholders must make satisfactory proof of claim.",
    note: "Tyler v. Hennepin applies — former owner entitled to surplus. MO statute §140.230 already provided this mechanism."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const MO_COUNTIES = [
  "Adair","Andrew","Atchison","Audrain","Barry","Barton","Bates","Benton",
  "Bollinger","Boone","Buchanan","Butler","Caldwell","Callaway","Camden",
  "Cape Girardeau","Carroll","Carter","Cass","Cedar","Chariton","Christian",
  "Clark","Clay","Clinton","Cole","Cooper","Crawford","Dade","Dallas","Daviess",
  "DeKalb","Dent","Douglas","Dunklin","Franklin","Gasconade","Gentry","Greene",
  "Grundy","Harrison","Henry","Hickory","Holt","Howard","Howell","Iron",
  "Jackson","Jasper","Jefferson","Johnson","Knox","Laclede","Lafayette",
  "Lawrence","Lewis","Lincoln","Linn","Livingston","McDonald","Macon","Madison",
  "Maries","Marion","Mercer","Miller","Mississippi","Moniteau","Monroe",
  "Montgomery","Morgan","New Madrid","Newton","Nodaway","Oregon","Osage","Ozark",
  "Pemiscot","Perry","Pettis","Phelps","Pike","Platte","Polk","Pulaski","Putnam",
  "Ralls","Randolph","Ray","Reynolds","Ripley","St. Charles","St. Clair",
  "St. Francois","St. Louis","Ste. Genevieve","Saline","Schuyler","Scotland",
  "Scott","Shannon","Shelby","Stoddard","Stone","Sullivan","Taney","Texas",
  "Vernon","Warren","Washington","Wayne","Webster","Worth","Wright",
  "City of St. Louis"
];

window.COUNTY_DATA['MO'] = MO_COUNTIES.map(name => ({
  county: name,
  url: name === "Greene"
    ? "https://greenecountymo.gov/collector/faq/tax_sale.php"
    : name === "Boone"
      ? "https://www.showmeboone.com/collector/real-estate-tax/delinquent.asp"
      : name === "Jackson"
        ? "https://www.jacksongov.org/collector/tax-sale"
        : name === "Johnson"
          ? "https://www.jcmtax.com/tax-sale-information"
          : `https://www.${name.toLowerCase().replace(/\s\./g,'').replace(/\s/g,'')}.mo.us/collector`,
  platform: name === "Jackson" || name === "St. Louis" || name === "Greene" ? "CivicSource (online) + in-person" : "In-person courthouse",
  saleDate2026: "August 24, 2026 (4th Monday August)",
  ...MO_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['MO_STATE_RULES'] = MO_STATE_RULES;

// ─────────────────────────────────────────────────────────
// DISTRICT OF COLUMBIA — 1 JURISDICTION — TAX LIEN
// Statute: DC Code Title 47, Chapter 13 (Real Property Tax Sales)
// + Chapter 13A (Real Property Tax Sales — Modern provisions)
// Annual sale: July (3rd week typical) — online auction via OTR
// Rate: 1.5%/month (18%/yr) on purchase price
// Threshold: $2,500+ delinquent (any amount for vacant/blighted)
// Cert valid: 1 year from issuance — VOID if no foreclosure filed
// 6-month redemption after sale before investor can foreclose
// OTC available year-round via otr.cfo.dc.gov
// Surplus: paid to former owner per DC Code §47-1307, §47-1315
// ─────────────────────────────────────────────────────────
const DC_STATE_RULES = {
  type: "lien",
  statute: "DC Code §47-1301 through §47-1320 (Chapter 13) + §47-1330 through §47-1395 (Chapter 13A)",
  administrator: "DC Office of Tax and Revenue (OTR) — otr.cfo.dc.gov",
  adminUrl: "https://otr.cfo.dc.gov/page/real-property-tax-sale",
  structure: "Single jurisdiction — Washington, DC. OTR administers all tax lien sales. Annual July auction. OTC available year-round.",
  thresholds: {
    standard: "$2,500 or more delinquent in property taxes",
    vacantBlighted: "ANY delinquent amount if property classified as Vacant or Blighted",
    forbearance: "Owner-occupied homeowners may apply for tax sale forbearance through mytax.dc.gov"
  },
  process: {
    step1: "Taxes delinquent. OTR publishes delinquent property list in DC newspapers (Washington Times, Washington Informer) around June.",
    step2: "Annual tax sale — online auction, typically 3rd week of July. Lien cert sold to highest bidder.",
    step3: "Purchaser receives Certificate of Sale. Interest at 1.5%/month accrues.",
    step4: "Owner has 6 months from sale to redeem (pay OTR directly — NOT investor). After 6 months: investor may file foreclosure.",
    step5: "If cert holder fails to file foreclosure within 1 year from cert date — cert becomes VOID. All money paid forfeited to District.",
    step6: "Foreclosure action filed in DC Superior Court. Owner still has time to redeem but now owes investor's attorney fees.",
    stat: "DC Code §47-1303, §47-1307, §47-1348, §47-1361"
  },
  auction: {
    frequency: "Annual — typically 3rd week of July",
    date2026: "Expected July 2026 — OTR publishes exact date. Check otr.cfo.dc.gov",
    platform: "Online auction via OTR (mytax.dc.gov / OTR online portal)",
    registration: "Required in advance. Check otr.cfo.dc.gov for registration requirements.",
    payment: "Wire or ACH via OTR platform. Cash/certified check/cashier's check/postal money order at OTR Cashier's Office.",
    statute: "DC Code §47-1303, §47-1348"
  },
  otc: {
    available: true,
    name: "Over-the-Counter (OTC) Tax Lien Sale",
    statute: "DC Code §47-1353(a)",
    process: "Purchase specific tax liens on properties presented but NOT sold at annual auction. Available online Mon–Fri 8AM–3PM (excluding holidays). Payment in full same day.",
    payment: "At OTR Cashier's Office: cash, certified check, cashier's check, postal money order (8:30AM–4:30PM). Electronic wire also accepted.",
    blockoutPeriods: "OTC blocked during annual, First-Come-First-Serve, and Discount sale events at OTR's discretion.",
    url: "https://otr.cfo.dc.gov/page/real-property-tax-sale"
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payments",
    note: "Cert holder may pay subsequent taxes. Added to redemption amount.",
    statute: "DC Code §47-1361"
  },
  redemption: {
    period: "6 months from date of tax sale (for standard residential) — owner may redeem anytime in this window without owing investor attorney fees",
    afterSixMonths: "Owner can still redeem UNTIL foreclosure judgment — but must pay investor's attorney fees (can exceed $3,000–$5,000 in DC)",
    paymentTo: "⚡ Owner MUST pay OTR directly — NOT the investor — for redemption",
    amounts: "All delinquent taxes + penalties + interest + costs (including investor's permitted expenses per Chapter 13A)",
    certVoid: "⚡ Cert becomes VOID if investor fails to file foreclosure within 1 year of cert date. All money paid forfeited to District.",
    statute: "DC Code §47-1307, §47-1361, §47-1348",
    vacantBlighted: "Vacant/blighted properties: 6-month redemption per §47-1307(b)",
    homesteadDifferent: false
  },
  deedPath: {
    name: "Deed in Fee Simple Absolute — DC Superior Court",
    process: "After foreclosure judgment — court orders sale at fair market value (§47-1303.04(3)) or issues deed. Deed is prima facie evidence of good title.",
    titleEffect: "Fee simple absolute. OTR or transferee (private investor) gets same priority as District had.",
    challenge: "90-day window to contest after deed recorded (§47-1303.04(f)(2))",
    statute: "DC Code §47-1303.03, §47-1303.04",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Surplus Proceeds",
    statute: "DC Code §47-1307, §47-1315",
    process: "Surplus above taxes + penalties + costs deposited to Surplus Fund. Paid to former owner. If redeemed within 6 months of sale — surplus paid to cert holder.",
    note: "Tyler v. Hennepin applies — DC §47-1307 already provides for surplus return to owner."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['DC'] = [{
  county: "District of Columbia",
  url: "https://otr.cfo.dc.gov/page/real-property-tax-sale",
  platform: "OTR Online Auction (annual July) + OTC year-round",
  saleDate2026: "Expected July 2026 (3rd week typical) — check otr.cfo.dc.gov",
  otcUrl: "https://otr.cfo.dc.gov/page/real-property-tax-sale",
  ...DC_STATE_RULES,
  verified: true
}];
window.COUNTY_DATA['DC_STATE_RULES'] = DC_STATE_RULES;

console.log('Batch 10 loaded — WI:', window.COUNTY_DATA['WI'].length,
  '| WY:', window.COUNTY_DATA['WY'].length,
  '| AK:', window.COUNTY_DATA['AK'].length,
  '| MO:', window.COUNTY_DATA['MO'].length,
  '| DC:', window.COUNTY_DATA['DC'].length);
