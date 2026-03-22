// ═══════════════════════════════════════════════════════════
// NEW JERSEY — 21 COUNTIES — FULL STRUCTURE v1
// Statute: NJSA 54:5-1 et seq. (Tax Sale Law)
// Type: TAX LIEN
// ═══════════════════════════════════════════════════════════
//
// CRITICAL STRUCTURE NOTE:
// NJ has NO county-level tax sales.
// All 566 municipalities conduct their OWN independent sales.
// County entries below point to the county clerk (for recording)
// + the master sale notice board (TCTANJ) where municipalites
// post upcoming sale dates.
// Investors must check TCTANJ or contact individual municipal
// tax collectors directly to find specific sales.
//
// ─────────────────────────────────────────────────────────
// STATE-LEVEL RULES (apply to all 566 municipalities):
//
// AUCTION:
//   Statute: NJSA 54:5-19, 54:5-32
//   Frequency: At least once per year per municipality
//   Trigger: Taxes delinquent on Nov 11 of fiscal year
//   Method: Public auction — bid DOWN from 18%
//   After 0%: Premium bid (dollar amount above lien) accepted
//   Premium escheats to municipality after 5 years if unclaimed
//   Tie bids: Random number generator (per A3968 2026 reform)
//   Increments: Even % bids OR 0.25% fractional increments (A3968)
//   Certificate: "Tax Sale Certificate (TSC)"
//   Recording: TSC must be recorded with County Clerk within 90 days
//   Includes: Taxes + water/sewer + municipal charges
//
// DELINQUENCY PENALTIES (pre-sale, charged by municipality):
//   Statute: NJSA 54:4-67
//   Interest: 8% on first $1,500 delinquency / 18% over $1,500
//   Year-end penalty: 6% on delinquencies >$10,000 at fiscal year end
//
// REDEMPTION PENALTIES (at time of redemption):
//   Statute: NJSA 54:5-61
//   On liens >$200: +2% penalty added to certificate
//   On liens >$5,000: +4% penalty added to certificate
//   On liens >$10,000: +6% penalty added to certificate
//   Penalties are IN ADDITION to the interest rate bid
//
// OTC / MUNICIPAL CERTIFICATE PURCHASE:
//   Statute: NJSA 54:5-113, 54:5-114.2
//   Name: "Municipal Certificate Assignment" / "OTC Municipal Lien"
//   Trigger: No private bidder → municipality struck off at 18%
//   Process: Municipality may sell/assign by:
//     (a) Public sale — highest bidder
//     (b) Private sale — governing body resolution, not less than
//         lien amount (or assessed value if liens exceed it)
//   Governing body must approve assignment
//   All assignments must be recorded with County Clerk
//   Note: Availability varies by municipality — some hold aggressively,
//         others rarely sell municipal certs. Contact tax collector directly.
//
// SUB-TAX / SUBSEQUENT TAXES:
//   Statute: NJSA 54:5 (referenced throughout)
//   Name: "Subsequent Tax Payment"
//   Available: Certificate holder may pay future delinquent taxes
//   Rate: Earns interest at rate set by the municipality (not cert rate)
//   CRITICAL: Any subsequent certificate (if NOT paid by holder) is
//             PARAMOUNT to prior certificate — new cert holder senior
//   Recommendation: Always pay subsequent taxes to protect position
//
// REDEMPTION:
//   Statute: NJSA 54:5-54
//   Who may redeem: Owner, heirs, prior lien holder, mortgage holder,
//                   legal occupant only (not third parties)
//   Period: Anytime before foreclosure judgment
//   Amount: All taxes + interest + penalties + subsequent taxes paid
//            by cert holder + interest on those + attorney fees
//   Payment: Cash or certified funds to municipal tax collector
//   Process: Collector notifies cert holder → holder returns cert
//            endorsed for cancellation → funds released
//   Cancellation: Must be recorded at County Clerk to clear title
//
// FORECLOSURE PATH:
//   Statute: NJSA 54:5-86 (standard) / NJSA 54:5-104.29 (In Rem)
//   Eligible: 2 years from date of sale
//   Exception: "Abandoned property" — accelerated timeline available
//   Process: Action filed in Superior Court, Chancery Division
//   Court grants: "Absolute and indefeasible estate of inheritance
//                  in fee simple" — full title to foreclosing party
//   Quiet title: Not required post-foreclosure — court order IS title
//   In Rem: Available for municipalities with large volumes of certs
//
// SURPLUS / EQUITY PROTECTION:
//   Statute: NJSA 54:5-1 et seq. + 2024 Tyler v. Hennepin reform law
//   ⚡ MAJOR 2026 ALERT:
//   Following US Supreme Court Tyler v. Hennepin County (2023),
//   NJ enacted equity protection law in July 2024.
//   New rule: Lienholder may only collect taxes paid + interest.
//   Excess equity above lien + interest must be returned to owner.
//   Process: Owner may request judicial sale or online auction
//            before entry of foreclosure judgment.
//   Surplus returned via Sheriff or court process.
//   Pending: NJ S1425 / S2052 (2026 session) — additional reforms
//   ⚡ This is a MATERIAL CHANGE from prior NJ law — lien holders
//      can NO LONGER capture full equity on low-tax-debt properties.
//
// ═══════════════════════════════════════════════════════════

const NJ_STATE_RULES = {
  type: "lien",
  auction: {
    frequency: "At least annual per municipality (566 municipalities)",
    saleMonth: "Varies by municipality — year-round",
    bidMethod: "Public auction — bid DOWN from 18%; after 0% → premium bid",
    startRate: "18%",
    zeroBid: "Accepted; after 0% bidders offer premium (dollar amount above lien)",
    premiumEscheat: "Premium escheats to municipality after 5 years",
    increments: "Even % or 0.25% fractional (per 2026 A3968 reform)",
    tieBreaker: "Random number generator (per 2026 A3968)",
    certificateName: "Tax Sale Certificate (TSC)",
    recordingDeadline: "90 days — County Clerk Deed Room",
    includes: "Taxes + water/sewer + all municipal charges",
    statute: "NJSA 54:5-19, 54:5-32",
    saleBoardUrl: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659"
  },
  otc: {
    available: true,
    name: "Municipal Certificate Assignment",
    rate: "18% (struck to municipality at 18%)",
    availableWhen: "After annual sale — varies by municipality",
    process: "Public sale (highest bidder) or private sale (governing body resolution)",
    statute: "NJSA 54:5-113, 54:5-114.2",
    note: "Availability varies. Contact individual municipal tax collector. All assignments must be recorded with County Clerk."
  },
  delinquencyPenalties: {
    rate1: "8% on first $1,500 delinquency",
    rate2: "18% on amounts over $1,500",
    yearEndPenalty: "6% additional on delinquencies >$10,000 at fiscal year end",
    statute: "NJSA 54:4-67"
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payment",
    rate: "Interest set by municipality (not certificate rate)",
    statute: "NJSA 54:5 (general)",
    warning: "CRITICAL: Unpaid subsequent taxes generate NEW certificate paramount to yours. Always pay to protect position."
  },
  redemption: {
    period: "Anytime before foreclosure judgment",
    statute: "NJSA 54:5-54",
    whoMayRedeem: "Owner, heirs, prior lien holder, mortgage holder, legal occupant ONLY",
    penalties: {
      over200: "+2% redemption penalty",
      over5000: "+4% redemption penalty",
      over10000: "+6% redemption penalty",
      note: "Penalties IN ADDITION to interest rate bid"
    },
    homesteadDifferent: false,
    agDifferent: false
  },
  deedPath: {
    name: "Foreclosure of Right of Redemption",
    eligibleAfter: "2 years from sale date",
    abandonedProperty: "Accelerated timeline available for abandoned properties",
    process: "File action in Superior Court, Chancery Division",
    result: "Court grants absolute fee simple title — no separate quiet title needed",
    inRem: "In Rem available for municipalities per NJSA 54:5-104.29",
    statute: "NJSA 54:5-86",
    quietTitleRequired: false,
    quietTitleRecommended: false,
    note: "Court order IS title — strongest title outcome of any lien state"
  },
  surplus: {
    available: true,
    name: "Equity / Surplus Protection",
    statute: "NJSA 54:5-1 et seq. + 2024 Tyler v. Hennepin reform",
    alert: "⚡ MAJOR 2026 CHANGE: Post Tyler v. Hennepin (2023), NJ enacted July 2024 law requiring excess equity above taxes+interest be returned to owner. Pending S1425/S2052 additional reforms.",
    process: "Owner requests judicial sale or online auction before foreclosure judgment. Surplus returned via Sheriff/court.",
    note: "Lien holders can NO LONGER capture full equity. Consult attorney on current exposure."
  },
  results: {
    lastSaleUrl: null,
    avgRateBid: null,
    totalLiensSold: null,
    totalValue: null
  }
};

// ─────────────────────────────────────────────────────────
// COUNTY ENTRIES
// Each entry points to:
//   1. County Clerk (for recording TSCs + foreclosure filings)
//   2. TCTANJ sale board (for finding municipal sales in that county)
//   3. Key platform used by municipalities in that county
// ─────────────────────────────────────────────────────────

window.COUNTY_DATA = window.COUNTY_DATA || {};
window.COUNTY_DATA['NJ'] = [
  {...NJ_STATE_RULES, 
    county: "Atlantic",
    countyClerk: {url:"https://www.atlantic-county.org/clerk/default.asp", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Varies by municipality — online auction common (Granicus, SRI, municipal platforms)",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Atlantic City, Egg Harbor, Galloway, Hamilton, Pleasantville and 20+ other municipalities"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Bergen",
    countyClerk: {url:"https://www.co.bergen.nj.us/county-clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — Granicus, municipal platforms",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "70 municipalities including Teaneck (Jan 2026), Fort Lee, Hackensack, Paramus"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Burlington",
    countyClerk: {url:"https://www.co.burlington.nj.us/192/County-Clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — Willingboro uses online platform",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Burlington City, Evesham, Moorestown, Mt. Holly, Stafford (Ocean County border)"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Camden",
    countyClerk: {url:"https://www.camdencounty.com/service/county-clerk/", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction — Camden City uses online platform (Apr 6 2026 confirmed)",
      saleDate2026: "Camden City: April 6, 2026 online. Others check TCTANJ board.",
      note: "⚡ Camden City sale April 6 2026 — 2025 and prior delinquencies"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true,
    alert:"⚡ Camden City online sale April 6 2026 confirmed"
  },
  {...NJ_STATE_RULES, 
    county: "Cape May",
    countyClerk: {url:"https://www.capemaycountynj.gov/180/County-Clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "In-person or online per municipality",
      saleDate2026: "Cape May City: fall 2026 (date TBD). Others check TCTANJ board.",
      note: "Cape May City 2026 fall sale TBD — posted on capemaycity.com"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Cumberland",
    countyClerk: {url:"https://www.co.cumberland.nj.us/county_clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Millville uses standard public auction; others vary",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Bridgeton, Millville, Vineland (largest cities)"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Essex",
    countyClerk: {url:"https://www.essexcountynj.org/county-clerk/", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — Newark, Irvington, East Orange use online platforms",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Newark (largest city in NJ), Irvington, East Orange, Montclair"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Gloucester",
    countyClerk: {url:"https://www.gloucestercountynj.gov/county-clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Varies by municipality",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Deptford, Washington, Monroe, Woodbury"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Hudson",
    countyClerk: {url:"https://www.hudsoncountynj.gov/government/offices/county-clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — Jersey City, Bayonne use online platforms",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Jersey City (2nd largest NJ city), Bayonne, Hoboken, Union City, Kearny"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Hunterdon",
    countyClerk: {url:"https://www.co.hunterdon.nj.us/clerk.htm", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "In-person for most smaller municipalities",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Mostly small rural townships"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Mercer",
    countyClerk: {url:"https://www.mercercounty.org/government/county-clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — Trenton uses online platform",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Trenton (state capital), Princeton, Hamilton, Lawrence"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Middlesex",
    countyClerk: {url:"https://www.middlesexcountynj.gov/government/departments/county-clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — New Brunswick, Woodbridge use online",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes New Brunswick, Edison, Woodbridge, Piscataway, Sayreville"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Monmouth",
    countyClerk: {url:"https://www.co.monmouth.nj.us/county_clerk.aspx", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — many municipalities use Granicus",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Asbury Park, Long Branch, Freehold, Middletown, Brick (border)"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Morris",
    countyClerk: {url:"https://www.morriscountynj.gov/Departments/County-Clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Varies by municipality",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Morristown, Parsippany, Rockaway, Dover"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Ocean",
    countyClerk: {url:"https://www.co.ocean.nj.us/OC/Clerk/Pages/default.aspx", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — Stafford (Feb 13 2026 confirmed)",
      saleDate2026: "Stafford Twp: February 13, 2026 electronic. Others check TCTANJ.",
      note: "⚡ Stafford Township confirmed Feb 13 2026 electronic sale. Includes Toms River, Brick, Stafford, Lakewood."
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true,
    alert:"⚡ Stafford Twp electronic sale Feb 13 2026 confirmed"
  },
  {...NJ_STATE_RULES, 
    county: "Passaic",
    countyClerk: {url:"https://www.passaiccountynj.org/government/offices/county_clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — Paterson, Clifton use online",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Paterson, Clifton, Passaic, Wayne, West Milford"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Salem",
    countyClerk: {url:"https://www.salemcountynj.gov/county-clerk/", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "In-person or online — smaller county",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Small rural county — lower competition, higher chance of unsold certs"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Somerset",
    countyClerk: {url:"https://www.co.somerset.nj.us/government/county-offices/county-clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Varies by municipality",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Bridgewater, Franklin, Warren, Bound Brook"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Sussex",
    countyClerk: {url:"https://www.sussexcountynj.gov/government/offices/county-clerk", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "In-person for most — smaller rural county",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Rural county — lower competition generally"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Union",
    countyClerk: {url:"https://www.ucnj.org/county-clerk/", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "Online auction common — Elizabeth, Linden, Union use online",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Includes Elizabeth (4th largest NJ city), Linden, Union, Plainfield, Cranford"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
  {...NJ_STATE_RULES, 
    county: "Warren",
    countyClerk: {url:"https://www.co.warren.nj.us/county-clerk.html", note:"Record TSC here within 90 days"},
    auction: {
      url: "https://www.tctanj.org/cn/webpage.cfm?tpid=14659",
      platform: "In-person for most — rural county",
      saleDate2026: "Multiple municipalities — check TCTANJ board",
      note: "Rural county — lower competition generally"
    },
    otc: {...NJ_STATE_RULES.otc, url:"https://www.tctanj.org/cn/webpage.cfm?tpid=14659"}, verified:true
  },
];

window.COUNTY_DATA['NJ_STATE_RULES'] = NJ_STATE_RULES;
console.log('NJ counties loaded:', window.COUNTY_DATA['NJ'].length);
