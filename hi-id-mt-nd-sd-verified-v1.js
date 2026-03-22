// ═══════════════════════════════════════════════════════════
// BATCH 7 — HI, ID, MT, ND, SD — FULL STRUCTURE v1
// March 2026
// ═══════════════════════════════════════════════════════════

window.COUNTY_DATA = window.COUNTY_DATA || {};

// ─────────────────────────────────────────────────────────
// HAWAII — 4 COUNTIES (only populated counties)
// Statute: HRS Chapter 246 "Real Property Tax Law"
// Type: Redeemable Deed
// 3-year delinquent lien triggers sale (HRS §246-56)
// Premium bid — highest bidder. Deed transfers at sale.
// 1-year redemption at 12%/yr on full purchase price
// Each county runs independently — no statewide platform
// ─────────────────────────────────────────────────────────
const HI_STATE_RULES = {
  type: "redeemable",
  statute: "HRS Chapter 246 (Real Property Tax Law), §246-56 through §246-63",
  process: {
    trigger: "Tax lien exists for 3+ years — mandatory sale",
    law: "HRS §246-56: all property with lien for 3+ years SHALL be sold at public auction to highest bidder for cash",
    deed: "Title transfers to purchaser at time of sale. Deed recorded within 60 days of auction.",
    lateRecording: "If deed not recorded within 60 days, redemption period extends to 1 year from date of recordation"
  },
  auction: {
    frequency: "As scheduled by each county — typically annual",
    bidMethod: "Premium bid — highest bidder above upset price",
    upsetPrice: "All taxes owed + penalties + interest + costs",
    payment: "Cash at sale — 100% due day of auction",
    absenteeBidding: "Maui: no absentee bidding. Attendee or authorized representative required.",
    statute: "HRS §246-56"
  },
  otc: {
    available: false,
    name: "N/A — Hawaii does not have a standard OTC/unsold program",
    note: "Unsold properties may be re-offered at subsequent auctions. Contact county directly."
  },
  subTax: {
    available: false,
    name: "N/A — Hawaii redeemable deed state; no sub-tax mechanism for investors"
  },
  redemption: {
    period: "1 year from date of Tax Sale (or 1 year from date of deed recordation if deed recorded late)",
    interestRate: "12% per annum on full purchase price paid by investor",
    redemptionAmount: "Full purchase price + all costs/expenses investor paid + 12%/yr interest",
    extendedRedemption: "If deed not recorded within 60 days of sale — extended to 1 year from recording date (no interest for extended period)",
    process: "Former owner pays redemption amount to purchaser",
    statute: "HRS §246-60 (Maui: MCC §3.48.450)",
    homesteadDifferent: false,
    note: "Investors strongly advised NOT to develop/build during redemption period"
  },
  deedPath: {
    name: "Tax Deed (County-issued)",
    process: "Deed issued by county at time of sale. Recorded within 60 days by county at Bureau of Conveyances or Land Court.",
    titleQuality: "Fee simple with reservation for redemption period. After redemption expires — clear.",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    statute: "HRS §246-56, §246-57"
  },
  surplus: {
    available: true,
    name: "Surplus Proceeds",
    statute: "HRS §246-63",
    process: "Officer distributes surplus after paying all taxes, interest, penalties. If doubt as to entitled party — may refuse distribution pending circuit court determination.",
    note: "Tyler v. Hennepin applies — HRS §246-63 routes surplus to entitled parties"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['HI'] = [
  {
    county: "Honolulu",
    note: "City and County of Honolulu — covers entire island of Oahu (~70% of HI population)",
    url: "https://realproperty.honolulu.gov",
    platform: "In-person (city/county-run)",
    saleFrequency: "Annual — contact Real Property Assessment Division for scheduled dates",
    alert: "⚡ Largest HI market. Contact city treasury for current sale dates.",
    ...HI_STATE_RULES, verified: true
  },
  {
    county: "Maui",
    note: "County of Maui — includes Maui, Molokai, Lanai islands. Lowest effective property tax rate in US.",
    url: "https://www.mauicounty.gov/faq.aspx?TID=115",
    platform: "In-person — Treasury Division, 110 Ala'ihi St Suite 108, Kahului",
    saleFrequency: "Annual — posted at least 4 weeks prior; advertised in Honolulu Star-Advertiser, Maui News, Molokai Dispatch",
    taxCodeAuth: "Maui County Code Chapter 3.48",
    surplusMCC: "Surplus disposed per MCC §3.48.285 + HRS §246-63",
    titleRecording: "County records deed with Bureau of Conveyances or Land Court within 60 days",
    ...HI_STATE_RULES, verified: true
  },
  {
    county: "Hawaii",
    note: "County of Hawaii — Big Island. Deed transfers at purchase; 1-year redemption recognized by RPT.",
    url: "https://hawaiipropertytax.com/tax-sale/",
    platform: "In-person — County of Hawaii Real Property Tax Office",
    saleFrequency: "Annual — contact RPT for current dates",
    taxCodeAuth: "Hawaii County Code Chapter 19",
    otcNote: "Chapter 19 does NOT include provisions to convey unsold properties to county",
    alert: "⚡ RPT advises purchasers: do NOT develop property until 1-year redemption period expires",
    ...HI_STATE_RULES, verified: true
  },
  {
    county: "Kauai",
    note: "County of Kauai — includes Kauai, Niihau, Lehua, Kaula islands.",
    url: "https://www.kauai.gov/Government/Departments-Agencies/Finance/Real-Property-Tax",
    platform: "In-person — County Finance Dept",
    saleFrequency: "Annual — contact Finance Dept for scheduled dates",
    ...HI_STATE_RULES, verified: true
  }
];
window.COUNTY_DATA['HI_STATE_RULES'] = HI_STATE_RULES;

// ─────────────────────────────────────────────────────────
// IDAHO — 44 COUNTIES — TAX DEED
// Statute: Idaho Code §63-1005 et seq. (Title 63, Ch. 10)
// NO tax lien cert sales in Idaho — county takes title directly
// 3-year delinquency → hearing → tax deed to county → public auction
// Quit Claim Deed issued by county commissioners
// Post-deed redemption: 14 months (some counties) or 1 year from deed
// Title insurance usually requires 1-3 years post-purchase
// ─────────────────────────────────────────────────────────
const ID_STATE_RULES = {
  type: "deed",
  statute: "Idaho Code §63-1005 through §63-1011 (Tax Deed), §31-808 (Commissioner Sale Authority)",
  critical: "Idaho does NOT sell tax lien certificates. The county takes title directly via tax deed after 3-year delinquency.",
  process: {
    step1: "Early warning letter sent to owners with 3-year delinquency pending (typically May/August prior year)",
    step2: "Title search / Litigation Guarantee ordered on delinquent parcels",
    step3: "Certified mail Notice of Pending Issue of Tax Deed sent to all parties of interest — no less than 2 months nor more than 5 months before hearing date",
    step4: "Affidavit of Compliance filed at least 5 days before tax deed issuance",
    step5: "Tax Deed Hearing (typically May). County takes title.",
    step6: "Board of County Commissioners schedules public auction (typically summer/fall following hearing)",
    statute: "IC §63-1005"
  },
  auction: {
    frequency: "Annual (timing varies by county — typically June–October after May hearing)",
    bidMethod: "Highest bid — minimum bid set by commissioners (typically all taxes + penalties + interest + costs)",
    payment: "Cash or certified check — 100% due by close of business day of sale (typically 3:00–5:00 PM)",
    platforms: "Mix: RealAuction (Kootenai), Public Surplus (Bonner), Bid4Assets (some), in-person courthouse (most)",
    commissionerRight: "Commissioners may reject all bids",
    statute: "IC §31-808"
  },
  otc: {
    available: true,
    name: "Surplus / Unsold County Property",
    trigger: "Parcels not sold at public auction",
    process: "Commissioners may sell without further notice by public or private sale. Submit written bids directly to county Board of Commissioners.",
    statute: "IC §31-808(6)",
    note: "No additional advertising required for post-auction private/public sale"
  },
  subTax: {
    available: false,
    name: "N/A — Idaho is deed state; no sub-tax mechanism"
  },
  redemption: {
    preAuction: "Property may be redeemed at any time prior to start of sale for that parcel. Redemption rights only.",
    postDeed: "14 months from tax deed issuance OR until sold at public auction, whichever comes first (Elmore, Shoshone confirmed). Some counties: 1 year from deed issuance.",
    postSale: "After auction sale — 1 additional year if tax deed PROCESS proven irregular (not standard redemption)",
    amounts: "All delinquency including late charges, accrued interest, costs including title search and professional fees",
    statute: "IC §63-1007 (14-month post-deed window), §63-1011 (1-year post-sale irregularity period)",
    note: "⚡ CRITICAL: Once property sells at auction — no standard right of redemption. Post-sale only for proven procedural irregularity."
  },
  deedPath: {
    name: "Quit Claim Deed from County (Commissioner's Deed / Deed of County Property)",
    process: "Commissioner issues QC deed after auction sale. Deed recorded. Original mailed to purchaser.",
    titleQuality: "Quit claim — no warranty. Free and clear of most encumbrances EXCEPT: mortgages where notice not sent, subsequent tax liens, special assessment liens (IC §63-1009).",
    titleInsurance: "Generally not available for 1–3 years post-purchase. Quiet title action may be pursued.",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    statute: "IC §63-1009"
  },
  surplus: {
    available: true,
    name: "Excess Proceeds",
    trigger: "Sale price exceeds minimum bid / taxes owed",
    process: "County holds excess. Parties of interest file claims. Unclaimed excess funds transferred to Idaho State Treasurer Unclaimed Property.",
    statute: "IC §63-1009 (implied); county treasurer administers",
    note: "Tyler v. Hennepin applies — ID excess proceeds available to parties of interest"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const ID_COUNTIES = [
  {county:"Ada",url:"https://adacountyid.gov/treasurer",platform:"Online/In-person",saleMonth:"Summer/Fall"},
  {county:"Adams",url:"https://adamscountyid.gov/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Bannock",url:"https://www.bannockcounty.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Bear Lake",url:"https://www.bearlakecounty.net/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Benewah",url:"https://www.benewahcounty.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Bingham",url:"https://web.binghamid.gov/treasurer/treasurer_tax_deed.html",platform:"In-person",saleMonth:"Summer/Fall",note:"Full timeline documented at official site"},
  {county:"Blaine",url:"https://www.co.blaine.id.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Boise",url:"https://www.boisecounty.us/services/treasurer/",platform:"In-person",saleMonth:"Summer/Fall",note:"Tax deed notice Jan 2026 for 2022 taxes"},
  {county:"Bonner",url:"https://www.bonnercountyid.gov/departments/Treasurer/FAQTaxDeeding",platform:"Public Surplus (online)",saleMonth:"July (after May hearing)",note:"⚡ Uses Public Surplus online. Full timeline at official site."},
  {county:"Bonneville",url:"https://www.bonnevillecountyidaho.gov/page/tax-deed-and-estate-sales",platform:"In-person (sealed bids accepted)",saleMonth:"Summer/Fall"},
  {county:"Boundary",url:"https://www.boundarycountyid.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Butte",url:"https://www.buttecountyid.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Camas",url:"https://www.camascounty.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Canyon",url:"https://canyoncounty.id.gov/treasurer",platform:"Online/In-person",saleMonth:"Summer/Fall"},
  {county:"Caribou",url:"https://www.co.caribou.id.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Cassia",url:"https://www.cassiacounty.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Clark",url:"https://www.clarkcountyidaho.gov/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Clearwater",url:"https://clearwatercounty.id.gov/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Custer",url:"https://www.custercountyid.gov/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Elmore",url:"https://elmorecounty.org/treasurer-tax-collector/tax-deed-sales/",platform:"In-person",saleMonth:"May hearing; summer auction",note:"⚡ 14-month post-deed redemption confirmed. Full process at official site."},
  {county:"Franklin",url:"https://www.franklincountyidaho.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Fremont",url:"https://www.co.fremont.id.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Gem",url:"https://www.gemcounty.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Gooding",url:"https://www.goodingcounty.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Idaho",url:"https://www.idahocounty.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Jefferson",url:"https://www.co.jefferson.id.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Jerome",url:"https://www.co.jerome.id.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Kootenai",url:"https://www.kcgov.us/528/Property-Tax-Sale",platform:"RealAuction (online)",saleMonth:"Annual — fall",note:"⚡ Uses RealAuction. Title free/clear of most encumbrances per IC §63-1009."},
  {county:"Latah",url:"https://www.latahcountyid.gov/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Lemhi",url:"https://www.lemhicountyidaho.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Lewis",url:"https://www.lewiscountyid.gov/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Lincoln",url:"https://www.lincolncountyid.gov/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Madison",url:"https://www.madisoncountyid.gov/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Minidoka",url:"https://www.minidokacounty.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Nez Perce",url:"https://www.co.nezperce.id.us/Elected-Officials/Treasurer/Tax-Deed-Process",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Oneida",url:"https://www.oneidacountyid.gov/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Owyhee",url:"https://owyheecounty.net/departments/treasurer/tax-deed/",platform:"In-person (Murphy, ID courthouse)",saleMonth:"Summer/Fall",note:"1-year post-deed redemption confirmed"},
  {county:"Payette",url:"https://www.payettecounty.org/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Power",url:"https://www.co.power.id.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Shoshone",url:"https://shoshonecounty.id.gov/tax-deed-auction/",platform:"In-person",saleMonth:"Summer/Fall",note:"⚡ 14-month post-deed redemption confirmed. Unsold surplus bids to BOCC."},
  {county:"Teton",url:"https://www.co.teton.id.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Twin Falls",url:"https://www.twinfallscounty.org/treasurer",platform:"Online/In-person",saleMonth:"Summer/Fall"},
  {county:"Valley",url:"https://www.co.valley.id.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
  {county:"Washington",url:"https://www.co.washington.id.us/treasurer",platform:"In-person",saleMonth:"Summer/Fall"},
];
window.COUNTY_DATA['ID'] = ID_COUNTIES.map(c => ({...c, ...ID_STATE_RULES, verified: true}));
window.COUNTY_DATA['ID_STATE_RULES'] = ID_STATE_RULES;

// ─────────────────────────────────────────────────────────
// MONTANA — 56 COUNTIES — HYBRID (Lien Assignment → Deed Auction)
// Statute: MCA Title 15, Ch. 17 (Tax Liens) + Ch. 18 (Ownership/Deed)
// Tax lien attaches August 1 each year for prior-year delinquency
// Private assignment available Aug 15+ (like buying the lien)
// 3-year redemption period
// After 3 years: assignee requests deed auction from county treasurer
// Deed auction opening bid = redemption amount + 50% assessed value (CRITICAL)
// Surplus to legal titleholder within 30 days per MCA §15-18-221
// Rate: 5/6 of 1%/month (10%/yr) + 2% penalty
// ─────────────────────────────────────────────────────────
const MT_STATE_RULES = {
  type: "hybrid",
  statute: "MCA Title 15, Ch. 17 (§15-17-125, §15-17-323) + Ch. 18 (§15-18-111 through §15-18-221)",
  criticalRate: "5/6 of 1% per month (≈10%/yr) + 2% penalty. Interest calculated DAILY.",
  process: {
    step1: "Taxes due: Nov 30 (1st half) and May 31 (2nd half). Delinquency triggers 2% penalty immediately.",
    step2: "August 1: Tax lien attaches to all delinquent property. County files lien with Clerk & Recorder. Lien list made public.",
    step3: "August 15+: Anyone may purchase (assign) the tax lien by: (a) mailing Notice of Pending Assignment to owner at least 2 weeks prior, (b) paying county all delinquent taxes + penalties + interest + costs.",
    step4: "County issues Assignment Certificate to buyer. County also notifies owner.",
    step5: "3-year redemption period runs from lien attachment date.",
    step6: "May 1–30 of final redemption year: Assignee (or county if unassigned) sends notice that tax deed may/will be issued unless redeemed.",
    step7: "Residential owner-occupied: Sheriff personally delivers additional notice.",
    step8: "After redemption period expires: Assignee applies for tax deed. County treasurer schedules AUCTION within 60 days.",
    stat: "MCA §15-17-125, §15-17-323, §15-18-112, §15-18-211, §15-18-212"
  },
  auction: {
    platform: "County treasurer's office — during regular office hours. May be conducted electronically.",
    openingBid: "CRITICAL: Opening bid = (all redemption amount: delinquent taxes + penalties + interest + costs) + (assignee's application costs) + (tax deed fees + recording fees) + (50% of most recent assessed value of land + dwelling)",
    halfAssessedValue: "The 50% assessed value component is AUTOMATICALLY surplus — distributed to titleholder even if no overbid",
    payment: "Full payment within 24 hours (excluding weekends/holidays). Wire/cashier's check.",
    assigneePayment: "If assignee is high bidder — must pay auction costs + any unpaid opening bid components within 24 hours",
    failedPayment: "24-hr payment failure: assignment cancelled, next highest bidder offered at bid amount",
    statute: "MCA §15-18-219, §15-18-220"
  },
  lienAssignment: {
    available: true,
    name: "Tax Lien Assignment (OTC-equivalent)",
    timing: "Aug 15 through approximately 60 days before end of redemption year",
    process: "Mail Notice of Pending Assignment to owner (certified, ≥2 weeks before but not before Aug 15, not more than 60 days before payment). Pay county treasurer. Receive Assignment Certificate.",
    subTaxWindow: "Subsequent taxes: pay June 1 – July 30 (or June 21 – July 30 for PTAP properties)",
    statute: "MCA §15-17-323",
    note: "⚡ Must file Proof of Notice with Clerk & Recorder within 30 days of mailing/publishing. Liens in final redemption year without filed Proof of Notice CANCELLED."
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payments",
    window: "June 1 – July 30 annually",
    statute: "MCA §15-18-112",
    note: "Assignee pays subsequent taxes once delinquent. Earns 5/6%/month + 2% penalty same as original lien"
  },
  redemption: {
    period: "3 years from date tax lien attached (August 1)",
    undevelopedLot: "2 years if undeveloped lot with special improvement district assessments",
    amounts: "All delinquent taxes + penalties + interest + costs + subsequent taxes with penalty and interest",
    statute: "MCA §15-18-111, §15-18-112",
    homesteadDifferent: false,
    agDifferent: false
  },
  deedPath: {
    name: "Tax Deed via Public Auction (county treasurer issues)",
    effect: "Absolute title as of expiration of redemption period, free and clear of all liens and encumbrances",
    exceptions: "Subsequent tax liens, special/rural/local improvement district assessments levied after",
    challengePeriod: "30 days after deed notice to challenge. After 30 days — title valid/binding regardless of irregularities EXCEPT if taxes were not delinquent or had been paid.",
    statute: "MCA §15-18-214, §15-18-411 through §15-18-413",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Surplus Auction Proceeds",
    statute: "MCA §15-18-221",
    process: "County treasurer distributes surplus to legal titleholder of record within 30 DAYS of receiving payment from purchaser. County processes regardless of whether titleholder is in-state or out-of-state.",
    guaranteed: "The 50% assessed value component of opening bid is ALWAYS surplus to titleholder — even if no one bids above opening.",
    note: "Tyler v. Hennepin compliant — MCA §15-18-221 (amended by Ch. 317, L.2019) codifies automatic 30-day surplus distribution"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const MT_COUNTIES = [
  "Beaverhead","Big Horn","Blaine","Broadwater","Carbon","Carter","Cascade","Chouteau",
  "Custer","Daniels","Dawson","Deer Lodge","Fallon","Fergus","Flathead","Gallatin",
  "Garfield","Glacier","Golden Valley","Granite","Hill","Jefferson","Judith Basin",
  "Lake","Lewis and Clark","Liberty","Lincoln","Madison","McCone","Meagher","Mineral",
  "Missoula","Musselshell","Park","Petroleum","Phillips","Pondera","Powder River",
  "Powell","Prairie","Ravalli","Richland","Roosevelt","Rosebud","Sanders","Sheridan",
  "Silver Bow","Stillwater","Sweet Grass","Teton","Toole","Treasure","Valley",
  "Wheatland","Wibaux","Yellowstone"
];

window.COUNTY_DATA['MT'] = MT_COUNTIES.map(name => ({
  county: name,
  url: name === "Yellowstone"
    ? "https://www.yellowstonecountymt.gov/treasurer/TaxSales.asp"
    : name === "Gallatin"
      ? "https://www.gallatinmt.gov/treasurer-property-tax-division/files/delinquent-taxes-tax-liens-and-assignments"
      : `https://${name.toLowerCase().replace(/\s/g,'')}countymt.gov/treasurer`,
  platform: "County Treasurer (in-person or electronic per MCA §15-18-220)",
  saleWindow: "Within 60 days of tax deed application (after 3-yr redemption expires)",
  ...MT_STATE_RULES,
  verified: true,
  notes: name === "Yellowstone" ? ["⚡ Lottery randomizer for assignment list. Delinquent list published on website (Excel + Web). Subsequent taxes: June 1–July 30."] : []
}));
window.COUNTY_DATA['MT_STATE_RULES'] = MT_STATE_RULES;

// ─────────────────────────────────────────────────────────
// NORTH DAKOTA — 53 COUNTIES — TAX DEED (County-owned)
// Statute: NDCC Title 57, Ch. 28 (Foreclosure) + Ch. 24 (Tax Sale)
// ⚡ NOT a private lien sale state since 1999
// Process: Taxes delinquent → annual December auction (NDCC 57-24)
//   → if no private bidder, county acquires → 3yr county hold
//   → foreclosure notice by June 1 → deed to county Oct 1
//   → Annual sale 3rd Tuesday in November (NDCC 57-28-13)
// Rate: 12%/yr simple interest from Jan 1 following delinquency year
// IRS: 120-day post-sale redemption right
// ─────────────────────────────────────────────────────────
const ND_STATE_RULES = {
  type: "deed",
  statute: "NDCC §57-24 (Annual Tax Sale) + §57-28 (Foreclosure and Sale of Tax-Title Land)",
  critical: "⚡ North Dakota has NOT permitted private tax lien certificate purchases since 1999 (SL 1999 ch. 503 §47). All delinquent tax sales result in county ownership. Investors buy from county at annual November sale.",
  process: {
    step1: "Taxes delinquent → Nov 1–15: County treasurer mails notice to owners of delinquency with 12%/yr interest accruing from Jan 1",
    step2: "Annual auction: offered in December at county auditor (NDCC §57-24-12). If no private bid — county acquires at bid of total taxes due.",
    step3: "County holds for 3 years after county acquisition.",
    step4: "June 1: County auditor gives foreclosure notice for all property 4+ years past due since tax became due (NDCC §57-28-01)",
    step5: "Oct 1: Redemption period expires. County auditor issues tax deed TO THE COUNTY (NDCC §57-28-09).",
    step6: "Annual sale: 3rd Tuesday of November — county auditor's office or usual place of holding district court (NDCC §57-28-13)",
    stat: "NDCC §57-28-01, §57-28-09, §57-28-13"
  },
  auction: {
    frequency: "Annual — 3rd Tuesday of November",
    platform: "County auditor's office or courthouse — each of 53 counties independently",
    bidMethod: "Highest bid — commissioners may set minimum at market value or amount owed for back taxes",
    notice: "Posted at county auditor's office ≥15 days before sale + published in official county newspaper ≥10 days before (NDCC §57-28-14)",
    irsRedemption: "⚡ IRS has statutory right to redeem up to 120 days after sale. Affects title strategy.",
    titleNote: "No guarantees of marketability. AS-IS.",
    statute: "NDCC §57-28-13, §57-28-14"
  },
  otc: {
    available: true,
    name: "Post-Sale County Properties",
    process: "Properties not sold at November auction remain county-owned. Contact county auditor directly. Commissioners have discretion on pricing.",
    note: "No uniform statewide OTC program. Each county auditor manages independently."
  },
  subTax: {
    available: false,
    name: "N/A — No private lien holders since 1999"
  },
  redemption: {
    preDecemberAuction: "Owner may redeem before December auction by paying all delinquent taxes + interest + penalties + costs",
    duringCountyHold: "Owner may redeem from county at any time during 3-year county hold period by paying all amounts owed",
    preNovemberSale: "Owners of county-foreclosed property: may redeem until sale date (NDCC §57-28)",
    interestRate: "12% per annum simple interest from January 1 following year taxes become due",
    statute: "NDCC §57-20-26, §57-26-02, §57-26-03",
    homesteadDifferent: false,
    agDifferent: false
  },
  deedPath: {
    name: "Tax Deed from County",
    effect: "Prima facie evidence of truth and regularity of all proceedings (NDCC §57-28-09)",
    titleQuality: "AS-IS. No guarantee of marketability. IRS lien survives 120 days post-sale.",
    postSaleChallenge: "Failure to redeem before redemption expiration waives all errors/irregularities EXCEPT jurisdictional defects (NDCC §57-28-08(3))",
    statute: "NDCC §57-28-09",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: false,
    name: "N/A — County acquires at tax sale bid; no overbid mechanism in county-acquisition context",
    note: "When county sells at November auction, proceeds go to county taxing units. Tyler v. Hennepin impact minimal as county-acquisition model predates private lien sale."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const ND_COUNTIES = [
  "Adams","Barnes","Benson","Billings","Bottineau","Bowman","Burke","Burleigh",
  "Cass","Cavalier","Dickey","Divide","Dunn","Eddy","Emmons","Foster","Golden Valley",
  "Grand Forks","Grant","Griggs","Hettinger","Kidder","LaMoure","Logan","McHenry",
  "McIntosh","McKenzie","McLean","Mercer","Morton","Mountrail","Nelson","Oliver",
  "Pembina","Pierce","Ramsey","Ransom","Renville","Richland","Rolette","Sargent",
  "Sheridan","Sioux","Slope","Stark","Steele","Stutsman","Towner","Traill","Walsh",
  "Ward","Wells","Williams"
];

window.COUNTY_DATA['ND'] = ND_COUNTIES.map(name => ({
  county: name,
  url: name === "Williams"
    ? "https://www.williamsnd.com/tax-foreclosure-properties/"
    : name === "Cass"
      ? "https://www.casscountynd.gov/county/depts/auditor/Pages/TaxForeclosure.aspx"
      : `https://www.${name.toLowerCase().replace(/\s/g,'')}countynd.gov/auditor`,
  platform: "County Auditor Office — in-person",
  saleDate: "3rd Tuesday of November",
  ...ND_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['ND_STATE_RULES'] = ND_STATE_RULES;

// ─────────────────────────────────────────────────────────
// SOUTH DAKOTA — 66 COUNTIES — TAX CERTIFICATE (Lien → Deed)
// Statute: SDCL Title 10, Ch. 22–25
// Unique bid: Bid-down INTEREST RATE on tax certificate
// 3-year redemption minimum (up to 6 years)
// Quit Claim Deed issued after tax deed proceedings
// Title mostly clear except municipal specials + state/federal liens
// Surplus returned to prior owner; 180-day window then Unclaimed Property
// ─────────────────────────────────────────────────────────
const SD_STATE_RULES = {
  type: "lien",
  statute: "SDCL Title 10, Ch. 22 (Delinquent Collection) + Ch. 23 (Sale) + Ch. 24 (Redemption) + Ch. 25 (Tax Deeds)",
  process: {
    taxes: "Taxes paid 1 year in arrears (e.g., 2024 taxes payable in 2025). Due Jan 1; 1st half delinquent May 1, 2nd half delinquent Nov 1.",
    certificate: "Tax certificate issued on any property with delinquent taxes. Annual sale.",
    bidMethod: "Bid-down INTEREST RATE — treasurer offers tract; bidder states lowest interest rate accepted per year. Lowest bid wins certificate. Treasurer issues Certificate of Sale.",
    countyBid: "If no private bidder — county bids for the property (county holds certificate)"
  },
  auction: {
    frequency: "Annual — typically December (contact county treasurer for exact date)",
    platform: "County treasurer — in-person (each of 66 counties independently)",
    bidMethod: "Bid-down interest rate on full amount of taxes, interest, and costs",
    payment: "Certificate holder pays taxes owed immediately; earns bid-rate interest upon redemption",
    statute: "SDCL §10-23-2 through §10-23-27"
  },
  otc: {
    available: true,
    name: "County-Held Tax Certificates",
    process: "Contact county treasurer directly. County may assign certificates it holds.",
    note: "SDCL §10-23-25 — county bids off property when no private bidder. Resulting certificate assignable.",
    statute: "SDCL §10-23-27 — all taxes must be paid before county assigns certificate"
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payments",
    statute: "SDCL §10-24 (redemption provisions)",
    note: "Certificate holder may pay subsequent taxes. Keeps lien position."
  },
  redemption: {
    period: "Any time before tax deed is issued — minimum 3 years from date of tax certificate sale (town: 3–6 years; rural: 3–6 years)",
    amounts: "All taxes + interest + penalties + costs accrued. Must include current taxes if requested by county (SDCL §10-24-7).",
    disability: "Persons under disability: extended redemption period (SDCL §10-24-3)",
    notice: "Before applying for tax deed — certificate holder sends formal notice. 60 days from filing affidavit of service = last chance to redeem.",
    statute: "SDCL §10-24-1, §10-25-1, §10-25-3, §10-25-5, §10-25-8",
    homesteadDifferent: false,
    agDifferent: false
  },
  deedPath: {
    name: "Quit Claim Deed (Tax Deed) — county issues post-proceedings",
    eligibleAfter: "No sooner than 3 years, no later than 6 years from date of tax certificate sale (town and county equally — SDCL §10-25-1)",
    titleEffect: "Releases all liens EXCEPT: municipal special assessments (delinquent/current/future), state liens, federal liens. County/mechanic liens, judgments, mortgages, other specials: ABATED.",
    statute: "SDCL §10-25-12",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    note: "Pennington County example: QC deed to purchaser. Any info on IRS/state liens — direct to those governments."
  },
  surplus: {
    available: true,
    name: "Surplus Proceeds",
    statute: "SDCL §10-25-12 (implied); SD Dept of Revenue county treasurer guidance",
    claimPeriod: "180 days from tax deed sale for prior owner to claim",
    afterExpiry: "Transferred to Unclaimed Property Division per SDCL ch. 43-41B",
    process: "Treasurer returns surplus to prior owner of record. If prior owner not found within 180 days — Unclaimed Property.",
    note: "Tyler v. Hennepin compliant — SD DOR guidance explicitly states surplus returned to prior owner"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const SD_COUNTIES = [
  "Aurora","Beadle","Bennett","Bon Homme","Brookings","Brown","Brule","Buffalo",
  "Butte","Campbell","Charles Mix","Clark","Clay","Codington","Corson","Custer",
  "Davison","Day","Deuel","Dewey","Douglas","Edmunds","Fall River","Faulk","Grant",
  "Gregory","Haakon","Hamlin","Hand","Hanson","Harding","Hughes","Hutchinson","Hyde",
  "Jackson","Jerauld","Jones","Kingsbury","Lake","Lawrence","Lincoln","Lyman",
  "Marshall","McCook","McPherson","Meade","Mellette","Miner","Minnehaha","Moody",
  "Oglala Lakota","Pennington","Perkins","Potter","Roberts","Sanborn","Shannon",
  "Spink","Stanley","Sully","Todd","Tripp","Turner","Union","Walworth","Yankton","Ziebach"
];

window.COUNTY_DATA['SD'] = SD_COUNTIES.map(name => ({
  county: name,
  url: name === "Pennington"
    ? "https://pennco.org/?SEC=00961D41-46CB-456F-B4C4-DD8811C80A00"
    : name === "Fall River"
      ? "https://fallriver.sdcounties.org/treasurer/real-estate-taxes/"
      : name === "Oglala Lakota"
        ? "https://oglalalakota.sdcounties.org/treasurer/real-estate-taxes/"
        : `https://${name.toLowerCase().replace(/\s/g,'')}.sdcounties.org/treasurer`,
  platform: "County Treasurer — in-person",
  saleFrequency: "Annual — typically December",
  ...SD_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['SD_STATE_RULES'] = SD_STATE_RULES;

console.log('Batch 7 loaded — HI:', window.COUNTY_DATA['HI'].length,
  '| ID:', window.COUNTY_DATA['ID'].length,
  '| MT:', window.COUNTY_DATA['MT'].length,
  '| ND:', window.COUNTY_DATA['ND'].length,
  '| SD:', window.COUNTY_DATA['SD'].length);
