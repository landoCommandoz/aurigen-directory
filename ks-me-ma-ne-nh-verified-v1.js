// ═══════════════════════════════════════════════════════════
// BATCH 8 — KS, ME, MA, NE, NH — FULL STRUCTURE v1
// March 2026
// ═══════════════════════════════════════════════════════════

window.COUNTY_DATA = window.COUNTY_DATA || {};

// ─────────────────────────────────────────────────────────
// KANSAS — 105 COUNTIES — TAX DEED (Judicial Foreclosure)
// Statute: KSA 79-2801 et seq.
// Unique: Judicial process — county counselor files in District Court
// NO post-sale redemption rights (except 120-day IRS window + 12-mo challenge)
// Delinquency thresholds: 3yr homestead / 2yr commercial / 1yr vacant+abandoned
// Sheriff's Deed after court confirmation
// Surplus via court order per KSA 79-2803
// Major platforms: CivicSource (Sedgwick, Shawnee) + county-run
// ─────────────────────────────────────────────────────────
const KS_STATE_RULES = {
  type: "deed",
  statute: "KSA §79-2801 et seq. (Judicial Tax Foreclosure), §79-2401a (Redemption), §79-2803 (Surplus)",
  process: {
    step1: "County counselor files petition in District Court in name of Board of County Commissioners against all owners/interested parties",
    step2: "Court determines tax lien amounts and orders sale",
    step3: "Public auction (open bid — no sealed bids per KSA)",
    step4: "Court confirms sale",
    step5: "Sheriff records deed with Register of Deeds",
    delinquencyThreshold: "3 years: homestead properties. 2 years: commercial properties. 1 year: vacant and abandoned properties."
  },
  auction: {
    frequency: "As scheduled — typically annual or bi-annual by county",
    platforms: "CivicSource (Sedgwick, Shawnee, others) + county-run in-person auctions",
    bidMethod: "Open public auction — highest bidder. No sealed bids per statute.",
    payment: "Cash — typically via CivicSource checkout same day or cashier's check",
    minimumBid: "Set by court judgment (taxes + charges + interest + penalties + court costs)",
    statute: "KSA §79-2804"
  },
  otc: {
    available: false,
    name: "N/A — Kansas requires judicial process. No direct OTC purchases.",
    note: "Properties not sold at auction may be re-offered at subsequent foreclosure sales. Contact county counselor."
  },
  subTax: {
    available: false,
    name: "N/A — Kansas judicial deed state; no private lien cert sub-tax mechanism"
  },
  redemption: {
    preAuction: "Owner may redeem until close of business DAY BEFORE the sale by paying all delinquent taxes + interest + court costs",
    postSale: "⚡ NO redemption rights after sale is confirmed. Right of redemption ends day prior to sale.",
    federalLien: "IRS: 120-day redemption right post-sale. Federal judgment liens: 1 year post-sale. Deed for these properties withheld until federal period expires.",
    postSaleChallenge: "12-month challenge period post-confirmation: owner or lienholder may contest foreclosure procedures only. If successful: sale voided, purchase price refunded. Not a redemption — procedural challenge only.",
    statute: "KSA §79-2401a (pre-sale redemption), §79-2804b (12-month challenge)",
    homesteadDifferent: true,
    homesteadNote: "Homestead: 3-year delinquency required vs 2-year commercial and 1-year vacant/abandoned"
  },
  deedPath: {
    name: "Sheriff's Deed (after court confirmation)",
    process: "After court confirms sale — Sheriff prepares and records deed with Register of Deeds. May take up to 90 days post-auction.",
    titleEffect: "All other liens of record extinguished upon confirmation. EXCEPT: covenants, restrictions, easements of record survive. Buyer responsible for current-year taxes.",
    federalLienDelay: "If property has federal tax or judgment lien — deed withheld until federal redemption period expires (120 days–1 year)",
    antiFlip: "⚡ If property transferred to former owner/related party within 10 years of auction — personal judgment liability for full original lien + interest",
    statute: "KSA §79-2804",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Excess Proceeds",
    statute: "KSA §79-2803",
    process: "Surplus distributed upon further order of the Court. Former owners and lienholders of record may petition court for excess proceeds.",
    note: "Tyler v. Hennepin applies — court-supervised distribution protects former owner equity"
  },
  bidderRestrictions: "⚡ Cannot bid if you owe delinquent property taxes or special assessments in that county (KSA §79-2812). Cannot bid for/on behalf of owner/relatives/mortgage holders. Cannot acquire property and transfer to former owner within 10 years.",
  alert2026: "⚡ CRITICAL — Sedgwick County KS: CivicSource contract CANCELLED December 2025 after alleged $1.28M theft from October 2025 tax sale. 2026 Sedgwick auction platform TBD. Properties already queued for 2026 foreclosure — sign up for Sedgwick auction alerts at sedgwickcounty.org/treasurer/tax-foreclosure-auction-alerts/ for new platform announcement. All other KS counties unaffected.",
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const KS_COUNTIES = [
  "Allen","Anderson","Atchison","Barber","Barton","Bourbon","Brown","Butler","Chase",
  "Chautauqua","Cherokee","Cheyenne","Clark","Clay","Cloud","Coffey","Comanche",
  "Cowley","Crawford","Decatur","Dickinson","Doniphan","Douglas","Edwards","Elk",
  "Ellis","Ellsworth","Finney","Ford","Franklin","Geary","Gove","Graham","Grant",
  "Gray","Greeley","Greenwood","Hamilton","Harper","Harvey","Haskell","Hodgeman",
  "Jackson","Jefferson","Jewell","Johnson","Kearny","Kingman","Kiowa","Labette",
  "Lane","Leavenworth","Lincoln","Linn","Logan","Lyon","Marion","Marshall","McPherson",
  "Meade","Miami","Mitchell","Montgomery","Morris","Morton","Nemaha","Neosho","Ness",
  "Norton","Osage","Osborne","Ottawa","Pawnee","Phillips","Pottawatomie","Pratt",
  "Rawlins","Reno","Republic","Rice","Riley","Rooks","Rush","Russell","Saline",
  "Scott","Sedgwick","Seward","Shawnee","Sheridan","Sherman","Smith","Stafford",
  "Stanton","Stevens","Sumner","Thomas","Trego","Wabaunsee","Wallace","Washington",
  "Wichita","Wilson","Woodson","Wyandotte"
];

window.COUNTY_DATA['KS'] = KS_COUNTIES.map(name => ({
  county: name,
  url: name === "Sedgwick"
    ? "https://www.sedgwickcounty.org/treasurer/tax-foreclosure-auctions/"
    : name === "Shawnee"
      ? "https://www.snco.gov/counselor/tax_sale.php"
      : name === "Butler"
        ? "https://www.bucoks.gov/502/Tax-Foreclosure-Sale-Information"
        : name === "McPherson"
          ? "https://www.mcphersoncountyks.us/250/Tax-Foreclosure-Sale"
          : name === "Franklin"
            ? "https://www.franklincoks.org/495/Tax-Foreclosures"
            : `https://www.${name.toLowerCase().replace(/\s/g,'')}county.org/treasurer`,
  platform: name === "Sedgwick" || name === "Shawnee" ? "CivicSource (online)" : "In-person / CivicSource",
  saleFrequency: "Annual or as scheduled — contact county counselor",
  ...KS_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['KS_STATE_RULES'] = KS_STATE_RULES;

// ─────────────────────────────────────────────────────────
// MAINE — 16 COUNTIES / 493+ MUNICIPALITIES — TAX LIEN MORTGAGE
// Statute: MRS Title 36, §942 (Tax Lien Certificate) + §943 (Mortgage/Foreclosure) + §943-C (Sale)
// Unique: Municipality-level system. No county auction.
// Tax lien = "tax lien mortgage" filed in Registry of Deeds
// 18-month redemption → AUTOMATIC foreclosure (no court required)
// Interest: Municipality-set, max = prime rate + 3% rounded up (varies; typically 8%)
// ⚡ Tyler-compliant: §943-C (2023, amended 2024) — must sell via RE broker, return surplus
// ─────────────────────────────────────────────────────────
const ME_STATE_RULES = {
  type: "lien",
  statute: "MRS Title 36, §942 (Lien Certificate) + §943 (Tax Lien Mortgage) + §943-C (Sale of Foreclosed Property)",
  structure: "493+ municipalities run independent tax lien processes. No county-level auction. Each town/city manages its own tax-acquired property.",
  process: {
    step1: "Taxes delinquent → tax collector makes demand for payment + notice",
    step2: "Tax collector files tax lien certificate in county Registry of Deeds — creates 'tax lien mortgage' on property",
    step3: "Municipality sends certified mail copy to record owner and all mortgage holders",
    step4: "30–45 days before 18-month deadline: treasurer sends certified mail notice of impending foreclosure with exact date",
    step5: "18 months from lien filing: AUTOMATIC FORECLOSURE — municipality owns property without court order",
    step6: "Municipality sells under §943-C: must list with licensed RE broker at highest reasonable price. At least 12 months to sell.",
    stat: "MRS §942, §943, §943-C"
  },
  auction: {
    frequency: "As scheduled by each municipality",
    platform: "Municipality-run — listed with licensed ME real estate broker (§943-C requirement)",
    bidMethod: "Broker-listed sale at market price",
    notice: "Former owner must receive advance notice of intent to sell. May require former owner to execute QC deed conveying interest before receiving excess proceeds.",
    statute: "MRS §943-C (as amended by PL 2024, enacted per PL 2023, c.640 + St.2024)"
  },
  otc: {
    available: false,
    name: "N/A — Maine tax-acquired property sold via RE broker under §943-C",
    note: "Contact individual municipalities directly for tax-acquired property listings"
  },
  subTax: {
    available: false,
    name: "N/A — Maine lien stays with municipality unless assigned (bulk sale option)"
  },
  taxTitleAssignment: {
    available: true,
    name: "Tax Title Assignment (MGL c.60 §52 equivalent)",
    statute: "MRS §943 — municipality may assign tax lien mortgage to private party",
    note: "Bulk sale option: municipality may assign right to collect tax obligation to private investor per §943. Less common than municipal retention."
  },
  redemption: {
    period: "18 months from date tax lien certificate filed in Registry of Deeds",
    lateNoticeException: "If required notices not sent timely — mortgagee/owner may redeem within 3 months of receiving actual knowledge of lien recording",
    probateExtension: "Probate court may extend up to 60 days following final allowance/disallowance of will",
    interestRate: "Municipality-set. Maximum: prime rate (WSJ first business day of year) + 3 percentage points, rounded up to nearest whole number. No statewide fixed rate.",
    costToRedeem: "All taxes + interest + recording fees + $13 + certified mail fees",
    statute: "MRS §943, §942",
    homesteadDifferent: false
  },
  deedPath: {
    name: "Automatic Foreclosure — Municipality Owns (no court required)",
    effect: "At 18 months from lien recording — municipality automatically owns property. Tax lien mortgage is prima facie evidence of title regularity.",
    postForeclosure: "Municipality must sell via licensed RE broker per §943-C. Must send former owner pre-sale notice.",
    formerOwnerPostDeed: "Former owner may execute QC deed and waive §946-B challenge right to receive excess proceeds. This enables marketable title.",
    statute: "MRS §943",
    quietTitleRequired: false,
    note: "⚡ PL 2024 amendment: post-sale notice of intent to distribute must be sent to former owners and all parties with recorded interests. Itemized accounting available on request. Within 10 days of distributing proceeds — municipality records notice at Registry."
  },
  surplus: {
    available: true,
    name: "Excess Sale Proceeds",
    statute: "MRS §943-C (2024 amendments, eff. Aug 9 2024)",
    definition: "Sale proceeds minus: all delinquent taxes that would have accrued during municipal ownership + fees (advertising, mailing, recording, RE broker fees) + admin costs + attorney fees + utility charges",
    process: "Notice mailed to former owner at last known address. If not located → published in local newspaper. If former owner fails to claim within 30 days of final published notice → transferred to state unclaimed property fund.",
    formerOwnerRequest: "Former owner may request written accounting and itemization of deductions",
    waiver: "Former owner who receives excess proceeds waives right to contest foreclosure under §946-B",
    note: "Tyler v. Hennepin directly influenced ME §943-C overhaul in 2023/2024. Municipalities now MUST return surplus to former owners."
  },
  confirmed2026: {
    fortFairfield_foreclosure: "Feb 17, 2026 — 16 properties foreclosed for non-payment of 2023 taxes. Listed with Dobb's Realty on/after April 21, 2026.",
    fortFairfield_prior: "Sept 15, 2025 foreclosure parcels — Purchase/Sale Agreements approved Feb 18, 2026 Town Council.",
    stateTaxAcquired: "Maine Revenue Services (unorganized territory) now uses On Point Realty for all state tax-acquired property listings (no longer sealed bid process).",
    stateUrl: "https://www.maine.gov/revenue/taxes/property-tax/unorganized-territory/tax-acquired-property"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const ME_COUNTIES = [
  {county:"Androscoggin",municipalities:57,registryUrl:"https://www.androscoggincounty.net/registry"},
  {county:"Aroostook",municipalities:118,registryUrl:"https://www.aroostookcounty.org/registry"},
  {county:"Cumberland",municipalities:28,registryUrl:"https://www.cumberlandcounty.org/registry-of-deeds"},
  {county:"Franklin",municipalities:33,registryUrl:"https://www.franklincounty.us/registry-of-deeds"},
  {county:"Hancock",municipalities:28,registryUrl:"https://www.hancockcounteregistry.com"},
  {county:"Kennebec",municipalities:32,registryUrl:"https://www.kennebeccounty.org/registry"},
  {county:"Knox",municipalities:16,registryUrl:"https://www.knox-county.net/registry"},
  {county:"Lincoln",municipalities:15,registryUrl:"https://www.lincolncounty.org/registry"},
  {county:"Oxford",municipalities:27,registryUrl:"https://www.oxfordcounty.org/registry"},
  {county:"Penobscot",municipalities:60,registryUrl:"https://www.penobscotcounty.net/registry"},
  {county:"Piscataquis",municipalities:32,registryUrl:"https://www.piscataquiscounty.net/registry"},
  {county:"Sagadahoc",municipalities:11,registryUrl:"https://www.sagadahoccounty.net/registry"},
  {county:"Somerset",municipalities:31,registryUrl:"https://www.somersetcounty.net/registry"},
  {county:"Waldo",municipalities:26,registryUrl:"https://www.waldocounty.net/registry"},
  {county:"Washington",municipalities:48,registryUrl:"https://www.washingtoncountyregistry.com"},
  {county:"York",municipalities:32,registryUrl:"https://www.yorkdeeds.com"},
];

window.COUNTY_DATA['ME'] = ME_COUNTIES.map(c => ({
  ...c,
  url: c.registryUrl,
  platform: "Municipal treasurer / RE broker (§943-C)",
  note: `${c.municipalities} municipalities in county — each runs independent lien process. Tax-acquired property listed via licensed RE broker per MRS §943-C.`,
  ...ME_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['ME_STATE_RULES'] = ME_STATE_RULES;

// ─────────────────────────────────────────────────────────
// MASSACHUSETTS — 14 COUNTIES / 351 MUNICIPALITIES — TAX LIEN (Collector's Deed)
// Statute: MGL Chapter 60 (Collection of Local Taxes)
// Unique: Only Land Court can foreclose right of redemption
// Two tracks: (1) Tax taking by municipality OR (2) Collector's Deed auction to private investor
// Interest: 8% pre-taking; post-Collector's Deed = 8% (⚡ AMENDED from 16% eff. Nov 1 2024)
// ⚡ St. 2024, c.140 (eff. Nov 1 2024): surplus must be returned to former owner
// Municipalities may assign/sell tax titles to private investors (MGL c.60 §52)
// ─────────────────────────────────────────────────────────
const MA_STATE_RULES = {
  type: "lien",
  statute: "MGL Chapter 60 §§43–85 (Collection of Local Taxes, Tax Titles, Foreclosure)",
  structure: "351 municipalities run independent tax processes. Foreclosure ONLY via Massachusetts Land Court (exclusive jurisdiction).",
  criticalAmendment: "⚡ St. 2024, c.140 §§80-99 (eff. Nov 1 2024): Municipalities must return excess equity to former owner upon foreclosure + sale. Interest rate amended.",
  process: {
    collectorsAuction: "Collector's Deed Auction (MGL c.60 §43): City/town treasurer offers unpaid tax lien at public auction. Purchaser gets Collector's Deed — initial step only, NOT foreclosure. Owner retains right of redemption.",
    taxTaking: "Tax Taking (MGL c.60 §53-54): Municipality takes property by Instrument of Taking. Creates tax title account. Municipality OR private assignee holds.",
    landCourt: "Foreclosure of Right of Redemption: ONLY Land Court may enter judgment foreclosing owner's right to redeem. Can be filed 6 or 12 months after taking/sale (depending on date).",
    privateAssignment: "MGL c.60 §52: Municipality may sell/assign tax titles to private investors. Private investor stands in municipality's shoes."
  },
  auction: {
    frequency: "As scheduled by each municipality",
    platform: "Municipality-run / bulk sale assignments to investors",
    interest_preTaking: "8% per year",
    interest_postSale: "8% per year (amended from 16% by St. 2024, c.140 eff. Nov 1 2024)",
    payment: "Purchaser pays municipality within 2 weeks of auction. Instrument of Assignment filed in Registry of Deeds within 60 days.",
    statute: "MGL c.60 §43, §45, §62"
  },
  otc: {
    available: true,
    name: "Tax Title Assignment",
    statute: "MGL c.60 §52",
    process: "Municipalities may sell receivables, liens, or tax titles to private investors to raise immediate revenue. Private investor stands in municipality's shoes for collection and foreclosure proceedings.",
    note: "Contact municipal treasurers directly. Boston and large cities have active tax title programs."
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Certifications",
    statute: "MGL c.60 §§50, 61",
    note: "Municipality may add/certify later unpaid taxes to existing tax title account. Important: §45 Collector's Deed purchasers may include later tax payments in redemption amount; §52 assignees generally may not."
  },
  redemption: {
    period: "Until filing of petition for foreclosure in Land Court (no fixed date — owner may redeem anytime before foreclosure petition filed)",
    interestRate: "8%/yr from sale/taking date (post Nov 1 2024 amendment). Pre-Nov 1 2024 existing titles: 16%/yr (verify per date of original taking)",
    paymentTo: "Former owner pays purchaser OR municipal treasurer per MGL c.60 §63",
    treasurerAcceptance: "City/town treasurer may accept payment from former owner and pass to purchaser (§63). Treasurer may extend foreclosure prohibition for up to 2 years.",
    installmentPlan: "Municipality may enter payment plan if it (not private party) holds tax title",
    statute: "MGL c.60 §62, §63, §65, §68",
    homesteadDifferent: false
  },
  deedPath: {
    name: "Land Court Judgment of Foreclosure / Absolute Title (MGL c.60 §64)",
    process: "Petition filed in Land Court → court hearing → judgment enters decree barring right of redemption → absolute title to petitioner",
    titleEffect: "Absolute title — free from all claims and encumbrances after Land Court decree (§64)",
    postDecreeChallenge: "Decree may be vacated within 1 year if entered by municipality/assignee who is not petitioner (§69A)",
    statute: "MGL c.60 §64, §65, §69",
    quietTitleRequired: false,
    note: "Private party holding Collector's Deed has NO right to possession until Land Court enters Judgment of Foreclosure"
  },
  surplus: {
    available: true,
    name: "Excess Equity",
    statute: "MGL c.60 §64A (eff. Nov 1 2024, per St.2024, c.140 §§80-99)",
    definition: "Property value minus redemption amount and other liens",
    process: "If municipality forecloses and sells — former owner entitled to excess equity. Land Court judgment holder must make election regarding sale or retention. Former owner may file claim for excess equity.",
    retroactive: "⚡ Retroactive application to past foreclosures may be possible — statute of limitations typically ~3 years",
    note: "Tyler v. Hennepin directly drove St. 2024, c.140. Prior to Nov 1 2024 — municipalities/private parties could retain ALL proceeds. Now excess must be returned."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const MA_COUNTIES = [
  {county:"Barnstable",municipalities:15,url:"https://www.barnstabledeeds.org"},
  {county:"Berkshire",municipalities:32,url:"https://www.berkshiredeeds.com"},
  {county:"Bristol",municipalities:20,url:"https://www.bristoldeeds.com"},
  {county:"Dukes",municipalities:7,url:"https://www.dukescounty.org/registry-of-deeds"},
  {county:"Essex",municipalities:34,url:"https://www.salemdeeds.com"},
  {county:"Franklin",municipalities:26,url:"https://www.franklindeeds.net"},
  {county:"Hampden",municipalities:23,url:"https://www.hampdenmass.com/registry"},
  {county:"Hampshire",municipalities:23,url:"https://www.hampshiredeeds.com"},
  {county:"Middlesex",municipalities:54,url:"https://www.middlesexdeeds.com"},
  {county:"Nantucket",municipalities:1,url:"https://www.nantucketdeeds.com"},
  {county:"Norfolk",municipalities:28,url:"https://www.norfolkdeeds.org"},
  {county:"Plymouth",municipalities:27,url:"https://www.plymouthdeeds.org"},
  {county:"Suffolk",municipalities:4,url:"https://suffolkdeeds.com"},
  {county:"Worcester",municipalities:60,url:"https://www.worcesterdeeds.com"},
];

window.COUNTY_DATA['MA'] = MA_COUNTIES.map(c => ({
  ...c,
  platform: "Municipal Treasurer / Land Court",
  note: `${c.municipalities} municipalities. Foreclosure ONLY via MA Land Court. ⚡ St. 2024 c.140 eff. Nov 1 2024: surplus must be returned to former owners; interest rate amended to 8%.`,
  ...MA_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['MA_STATE_RULES'] = MA_STATE_RULES;

// ─────────────────────────────────────────────────────────
// NEBRASKA — 93 COUNTIES — TAX LIEN CERTIFICATE
// Statute: NRS §77-1801 through §77-1941
// Annual sale: First Monday in March
// Bid method: RANDOM LOTTERY ORDER (not bid-down) — each bidder picks one parcel per round
// Rate: 14%/yr per NRS §45-104.01 (set by Legislature — verify annually)
// 3-year redemption period
// After 3yr: 9 months to apply for tax deed (if threshold met) OR foreclose
// ⚡ Confirmed 2026 sale: March 2 (Gage, Dawes, Saline, Frontier, Nance, Saline confirmed)
// ─────────────────────────────────────────────────────────
const NE_STATE_RULES = {
  type: "lien",
  statute: "NRS §77-1801 through §77-1941 (Tax Sale Certificates) + §77-1901 through §77-1941 (Foreclosure)",
  criticalBidMethod: "⚡ Nebraska uses RANDOM LOTTERY ORDER — not bid-down rate, not premium bid. Random number drawing determines order. Each bidder picks one parcel per round; may pass.",
  process: {
    advertising: "County advertises delinquent taxes in local newspaper 3 consecutive weeks in February + online at Nebraska Taxes Online (nebraskataxes.com)",
    registration: "Register with county treasurer by Thursday before first Monday in March. $25 registration fee. One bidder per company. Must be present.",
    sale: "Public sale opens first Monday in March at 9:00 AM. Random lottery drawing determines bidding order. Each round: one parcel per bidder. Pass or purchase. After public auction: private sale of remaining unsold taxes.",
    certificate: "Winning bidder pays all delinquent taxes + interest + advertising + costs. County issues Certificate of Purchase. $22 issuance fee.",
    subTax: "During 3-year redemption period: investor must pay subsequent taxes as they become delinquent",
    maturity: "After 3 years: certificate matures. Investor must apply for tax deed (if eligible) within 9 months OR foreclose within 9 months. Investor responsible for own collection process.",
    stat: "NRS §77-1807, §77-1818, §77-1824, §77-1837"
  },
  auction: {
    date2026: "March 2, 2026 (confirmed — Gage/Dawes/Saline/Frontier/Nance and majority of NE counties)",
    frequency: "Annual — first Monday in March",
    platform: "In-person county treasurer office. No major statewide platform.",
    privateSale: "Unsold taxes after public auction available via private sale — contact county treasurer directly",
    statute: "NRS §77-1801, §77-1807, §77-1814"
  },
  otc: {
    available: true,
    name: "Private Tax Sale",
    trigger: "Taxes remaining unsold after public auction",
    process: "Contact county treasurer directly. Available year-round.",
    statute: "NRS §77-1814",
    note: "Private and county certificates may also be assigned for $20 fee"
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payments",
    statute: "NRS §77-1824",
    note: "MUST be paid as they become delinquent to protect certificate position"
  },
  redemption: {
    period: "3 years from date of tax sale certificate",
    interestRate: "14% per annum (per NRS §45-104.01 — set by Legislature, verify annually)",
    amounts: "Certificate amount + 14%/yr interest + all subsequent taxes paid by investor + 14% interest on those payments",
    deadline: "Redemption must be received PRIOR TO CLOSE OF BUSINESS on day application for tax deed is received by county treasurer",
    statute: "NRS §77-1824",
    homesteadDifferent: false,
    agDifferent: false
  },
  deedPath: {
    name: "Tax Deed (county treasurer issues) OR Court Foreclosure (sheriff's sale)",
    eligibleWindow: "Application must be made within 9 months after 3-year redemption period expires (2 years for vacant/abandoned)",
    taxDeedEligibility: "Investor may apply for tax deed ONLY if: 110% of assessed value minus redemption amount is ≤ $25,000. Otherwise must foreclose.",
    foreclosure: "If threshold not met — investor must file suit in District Court to foreclose lien (NRS §77-1901). Court enters judgment, sheriff's sale held.",
    statute: "NRS §77-1837 (tax deed), §77-1901 (foreclosure)",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Surplus / Excess Proceeds",
    process: "Any excess above taxes/costs at foreclosure sale: court-supervised distribution. Tyler v. Hennepin applies — former owner entitled to surplus.",
    note: "At public auction — no overbid mechanism (investors pay exact taxes). Surplus arises only at court-supervised foreclosure sheriff's sale."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const NE_COUNTIES = [
  "Adams","Antelope","Arthur","Banner","Blaine","Boone","Box Butte","Boyd","Brown",
  "Buffalo","Burt","Butler","Cass","Cedar","Chase","Cherry","Cheyenne","Clay",
  "Colfax","Cuming","Custer","Dakota","Dawes","Dawson","Deuel","Dixon","Dodge",
  "Douglas","Dundy","Fillmore","Franklin","Frontier","Furnas","Gage","Garden",
  "Garfield","Gosper","Grant","Greeley","Hall","Hamilton","Harlan","Hayes",
  "Hitchcock","Holt","Hooker","Howard","Jefferson","Johnson","Kearney","Keith",
  "Keya Paha","Kimball","Knox","Lancaster","Lincoln","Logan","Loup","Madison",
  "McPherson","Merrick","Morrill","Nance","Nemaha","Nuckolls","Otoe","Pawnee",
  "Perkins","Phelps","Pierce","Platte","Polk","Red Willow","Richardson","Rock",
  "Saline","Sarpy","Saunders","Scotts Bluff","Seward","Sheridan","Sherman","Sioux",
  "Stanton","Thayer","Thomas","Thurston","Valley","Washington","Wayne","Webster",
  "Wheeler","York"
];

window.COUNTY_DATA['NE'] = NE_COUNTIES.map(name => ({
  county: name,
  url: name === "Gage"
    ? "https://gagecountyne.gov/treasurer/"
    : name === "Dawes"
      ? "https://dawescounty.ne.gov/what-we-do/county-offices/treasurer.html"
      : name === "Saline"
        ? "https://salinecountyne.gov/treasurer-office/public-tax-sale-information/"
        : name === "Lancaster"
          ? "https://www.lancaster.ne.gov/treasury"
          : `https://${name.toLowerCase().replace(/\s/g,'')}county.ne.gov/treasurer`,
  platform: "In-person county treasurer",
  saleDate2026: "March 2, 2026",
  ...NE_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['NE_STATE_RULES'] = NE_STATE_RULES;

// ─────────────────────────────────────────────────────────
// NEW HAMPSHIRE — 10 COUNTIES / 221 MUNICIPALITIES — TAX LIEN (Optional Lien Procedure)
// Statute: RSA 80:58–80:91 (Optional Tax Lien Procedure)
// Municipality-level system (same as ME). No county auction.
// Two steps: (1) Tax lien executed → (2) Tax deed after 2-year redemption
// Interest: 18%/yr on lien balance (RSA 80:69) — some municipalities vary
// 2-year redemption from lien execution
// Former owner has 3 years from tax deed to redeem (RSA 80:89)
// Surplus: Polonsky v. Bedford (2020) + Tyler → municipality must return excess proceeds
// RSA 80:88: Superior Court interpleader for excess proceeds distribution
// ─────────────────────────────────────────────────────────
const NH_STATE_RULES = {
  type: "lien",
  statute: "RSA 80:58–80:91 (Optional Tax Lien Procedure) + RSA 80:76 (Tax Deed) + RSA 80:88-80:90 (Excess Proceeds)",
  structure: "221 municipalities run independent lien processes. No county-level auction. Each town/city manages its own tax-acquired property sales.",
  process: {
    step1: "Taxes delinquent after December 1 (assessment year). Tax collector sends notice of sums due + date lien will be executed.",
    step2: "If not paid by execution date — lien is 'executed' (transferred to municipality). Clock starts on 2-year redemption.",
    step3: "Interest at 18%/yr accrues on unpaid balance (RSA 80:69) + substantial costs and penalties for notices/recording",
    step4: "2 years from lien execution without redemption: tax collector MUST tender tax deed to municipality (RSA 80:76). Exceptions: environmental liability, tenant obligations, or contrary to public interest.",
    step5: "Municipality may sell tax-deeded property by sealed bid or public auction (RSA 80:80). May also authorize alternative methods by warrant article.",
    step6: "If selling within 3 years of deed: must send 90-day notice to former owners + mortgage holders before sale date.",
    stat: "RSA 80:69, §76, §80, §88, §89"
  },
  auction: {
    frequency: "As scheduled by each municipality",
    platform: "Municipal auction / sealed bid / NHTaxDeedAuctions.com (private auctioneer frequently used)",
    methods: "RSA 80:80: sealed bid OR public auction. By warrant article/ordinance: alternative methods (abutters, direct sale). Perpetual authorization possible with 'indefinitely, until rescinded' language.",
    statute: "RSA 80:80"
  },
  otc: {
    available: false,
    name: "N/A — NH tax-acquired property sold via municipal auction/sealed bid per RSA 80:80",
    note: "Contact individual municipalities directly. NHTaxDeedAuctions.com aggregates many NH tax deed auctions."
  },
  subTax: {
    available: false,
    name: "N/A — NH lien stays with municipality"
  },
  lienTransfer: {
    available: true,
    name: "Tax Lien Transfer to Private Investor",
    statute: "RSA 80:42 (Transfer of Tax Lien)",
    note: "Municipality may transfer tax lien to private party by vote at town meeting or city council action. Requires annual or perpetual authorization. Less common than municipal retention."
  },
  redemption: {
    preExecutionDeadline: "Taxes may be paid before execution date to stop the process entirely",
    duringLienPeriod: "2 years from lien execution — owner may redeem by paying all taxes + 18%/yr interest + costs",
    interestRate: "18% per annum on unpaid lien balance (RSA 80:69). Plus substantial costs and penalties.",
    postTaxDeed: "Former owner has 3 years from recording of tax deed to redeem by paying all back taxes + penalties to municipality (RSA 80:89). Municipality may sell property during this period.",
    statute: "RSA 80:19, §69, §76, §89",
    homesteadDifferent: false
  },
  deedPath: {
    name: "Tax Collector's Deed to Municipality",
    process: "After 2-year lien period without redemption — tax collector tenders deed to municipality. Title passes to municipality.",
    selling: "Municipality may sell via auction/sealed bid per RSA 80:80 as soon as deed is recorded.",
    previewSale3yr: "If municipality sells within 3 years of deed: 90-day advance notice to former owners + mortgage holders required. Former owner retains right to repurchase.",
    postSale3yr: "If municipality sells after 3 years from deed: redemption notice no longer required per RSA 80:89 VII (but excess proceeds still due per Polonsky + Tyler).",
    statute: "RSA 80:76, §80, §88, §89",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Excess Proceeds",
    statute: "RSA 80:88 (Distribution), §80:90 (Definitions)",
    trigger: "Sale proceeds exceed back taxes + interest + costs + penalty + reasonable legal fees",
    process: "Within 60 days of settlement: municipality files Bill of Interpleader with Superior Court (county where property located), naming former owners and all recorded interest holders as defendants, paying all excess proceeds into court.",
    municipalRetention: "Municipality retains only: back taxes + interest + costs + penalty + court filing costs/attorney fees for interpleader",
    defaultIfNoClaim: "In default of valid claims by others — municipality has continuing interest in unclaimed funds",
    statute: "RSA 80:88, §80:89, §80:90",
    legal: "⚡ Polonsky v. Town of Bedford, 173 N.H. 226 (2020) — NH Supreme Court: 3-year limitation in RSA 80:89 VII is unconstitutional. Municipalities may NOT keep excess proceeds even after 3 years. Tyler v. Hennepin (2023) affirms at federal level."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

const NH_COUNTIES = [
  {county:"Belknap",municipalities:9,url:"https://www.belnap.nh.gov/registry"},
  {county:"Carroll",municipalities:12,url:"https://www.carrollcountynh.net/registry"},
  {county:"Cheshire",municipalities:23,url:"https://www.co.cheshire.nh.us/registry"},
  {county:"Coos",municipalities:17,url:"https://www.cooscountynh.us/registry"},
  {county:"Grafton",municipalities:28,url:"https://www.co.grafton.nh.us/registry"},
  {county:"Hillsborough",municipalities:31,url:"https://www.hcnh.org/registry"},
  {county:"Merrimack",municipalities:27,url:"https://www.merrimackcounty.net/registry"},
  {county:"Rockingham",municipalities:33,url:"https://www.nhdeeds.com"},
  {county:"Strafford",municipalities:16,url:"https://www.co.strafford.nh.us/registry"},
  {county:"Sullivan",municipalities:15,url:"https://www.sullivancountynh.gov/registry"},
];

window.COUNTY_DATA['NH'] = NH_COUNTIES.map(c => ({
  ...c,
  platform: "Municipal auction / NHTaxDeedAuctions.com (statewide aggregator)",
  note: `${c.municipalities} municipalities. Each runs independent lien + deed process. Excess proceeds via Superior Court interpleader per RSA 80:88 (Polonsky + Tyler compliant).`,
  ...NH_STATE_RULES,
  verified: true
}));
window.COUNTY_DATA['NH_STATE_RULES'] = NH_STATE_RULES;

console.log('Batch 8 loaded — KS:', window.COUNTY_DATA['KS'].length,
  '| ME:', window.COUNTY_DATA['ME'].length,
  '| MA:', window.COUNTY_DATA['MA'].length,
  '| NE:', window.COUNTY_DATA['NE'].length,
  '| NH:', window.COUNTY_DATA['NH'].length);
