// Aurigen Directory — State Data (English)
// Fields: id, name, type, rate, redemption, score, beginnerFriendly, beginnerTip,
//         scoreWhy, note, risks, ddExtra, auctionSignup, otc, counties, platforms

const STATES_EN = [
  {
    id: "AL", name: "Alabama", type: "deed", rate: "Varies", redemption: "3 years",
    score: 18, beginnerFriendly: false,
    notBeginnerReason: "Long redemption, title issues common, institutional competition in metro areas.",
    scoreWhy: "Low interest rate environment, long 3-year redemption, and institutional dominance in metros limit upside for individual investors.",
    note: "Alabama conducts tax deed sales at the county level. Properties must be delinquent for 3 years before the county auctions them. Statute: AL Code §40-10-1 et seq.",
    auctionSignup: {
      platform: "County-level (varies by county)",
      steps: [
        "Contact your target county's Revenue Commissioner office — find them at revenue.alabama.gov/property-tax",
        "Request the delinquent property list (usually available 30–60 days before auction)",
        "Register in person at the courthouse — bring government-issued ID and a cashier's check or wire confirmation for your deposit",
        "Attend the auction on the scheduled date — bidding is oral and open"
      ],
      depositInfo: "Typically 10–20% of bid required day-of. Confirm with county.",
      directLink: "https://revenue.alabama.gov/property-tax/"
    },
    beginnerTip: "Start with rural counties where institutional buyers are absent. Avoid Jefferson and Madison counties until you have experience.",
    otc: { available: false, note: "No statewide direct purchase program." },
    risks: [
      "Institutional buyers dominate Jefferson (Birmingham) and Madison (Huntsville) counties",
      "3-year redemption period ties up capital",
      "Title is not guaranteed — quiet title action may be required",
      "Many rural parcels have access or environmental issues"
    ],
    ddExtra: [
      "Verify the 3-year delinquency threshold has been met before bidding",
      "Order a title search — Alabama deed sales do not guarantee clean title",
      "Check county GIS for road access on rural parcels"
    ],
    platforms: ["County courthouse (in-person)"],
    counties: []
  },
  {
    id: "AK", name: "Alaska", type: "deed", rate: "Varies", redemption: "1 year",
    score: 12, beginnerFriendly: false,
    notBeginnerReason: "Borough-based system, limited inventory, federal land ownership restricts most parcels. Requires local connections.",
    scoreWhy: "Remote logistics, limited inventory, and federal land restrictions make this impractical for most investors.",
    note: "Alaska operates through boroughs (not counties). The Matanuska-Susitna and Fairbanks North Star boroughs occasionally sell tax-foreclosed properties. Statute: AS §29.45.",
    auctionSignup: {
      platform: "Borough-specific",
      steps: [
        "Identify your target borough at commerce.alaska.gov",
        "Contact the borough assessor or tax collector directly — no centralized state system",
        "Request the tax foreclosure list when available",
        "Register and attend the auction per borough instructions — most require in-person attendance"
      ],
      depositInfo: "Varies by borough. Confirm directly.",
      directLink: "https://commerce.alaska.gov/web/dcra"
    },
    beginnerTip: "Not a recommended starting state. If pursuing Alaska, focus on Matanuska-Susitna Borough which has the most consistent auction activity.",
    otc: { available: false, note: "No statewide OTC program." },
    risks: [
      "Federal land ownership restricts a large percentage of available parcels",
      "Remote properties have extreme logistics costs",
      "Very low inventory — not a reliable primary market",
      "Borough rules vary significantly"
    ],
    ddExtra: [
      "Verify parcel is not federal, state, or Native corporation land before bidding",
      "Check BLM land atlas for ownership classification",
      "Confirm road access — many parcels are landlocked or fly-in only"
    ],
    platforms: ["Borough assessor offices"],
    counties: []
  },
  {
    id: "AZ", name: "Arizona", type: "lien", rate: "Up to 16%", redemption: "3 years",
    score: 78, beginnerFriendly: true,
    scoreWhy: "High statutory rate, fully online auctions, excellent year-round OTC availability. One of the best beginner states in the country.",
    note: "Arizona conducts reverse-bid auctions in February where investors compete to accept lower interest rates from the 16% ceiling. Unsold liens go to direct purchase (OTC) year-round at the county level. Statute: ARS Title 42 Chapter 18.",
    auctionSignup: {
      platform: "County-specific (most use county treasurer portals; Maricopa uses an online system)",
      steps: [
        "Go to your target county treasurer's website — find all Arizona county treasurers at aztaxsale.info or each county's individual site",
        "Create an account 2 weeks before the auction date (usually February)",
        "Fund your account via ACH or wire transfer — minimum deposits vary by county",
        "Bid online during the auction window — you're bidding DOWN from 16% to win the certificate"
      ],
      depositInfo: "Maricopa requires pre-funding. Most counties require wire or ACH before auction day.",
      directLink: "https://treasurer.maricopa.gov/tax-lien"
    },
    beginnerTip: "Start with Pinal or Yavapai counties — less competition than Maricopa. OTC purchases are available year-round at 16% in most counties. Go to the county treasurer's office directly and ask for the unsold lien list.",
    otc: { available: true, note: "Unsold liens available year-round directly from county treasurers at the statutory 16% rate. Best OTC program in the country for beginners." },
    risks: [
      "Maricopa and Pima counties are saturated — institutional buyers push rates to 0–3%",
      "3-year holding period before requesting treasurer's deed",
      "Many parcels are undeveloped desert with no road access or development potential",
      "Check for active water rights and irrigation district liens",
      "Confirm parcel is not state trust land"
    ],
    ddExtra: [
      "Run parcel through county GIS to confirm road access and zoning",
      "Verify no irrigation district or water district secondary liens",
      "Check ADWR (Arizona Department of Water Resources) for water rights status on agricultural parcels"
    ],
    platforms: ["aztaxsale.info", "County treasurer portals", "RealAuction (some counties)"],
    counties: [
      { name: "Maricopa", link: "https://treasurer.maricopa.gov/tax-lien", notes: "Largest auction in AZ. High competition. Online only." },
      { name: "Pima", link: "https://www.pima.gov/government/treasurer", notes: "Second largest. Moderate competition." },
      { name: "Pinal", link: "https://pinalcountyaz.gov/Treasurer", notes: "Less competition. Good for beginners." },
      { name: "Yavapai", link: "https://www.yavapai.us/treasurer", notes: "Rural, lower competition, OTC available." }
    ]
  },
  {
    id: "AR", name: "Arkansas", type: "deed", rate: "Penalty only", redemption: "2 years",
    score: 44, beginnerFriendly: true,
    scoreWhy: "State-run COSL system is straightforward for newcomers with direct online purchasing, though property quality varies widely.",
    note: "Arkansas Commissioner of State Lands (COSL) manages all tax-delinquent properties statewide. Online purchasing available. Deed issued is quitclaim-equivalent with a 90-day litigation risk window. Statute: ACA §26-37-101.",
    auctionSignup: {
      platform: "cosl.org (Commissioner of State Lands)",
      steps: [
        "Go to cosl.org and create a free account",
        "Browse available properties — updated regularly",
        "Submit an online offer for any available property",
        "If accepted, pay via credit card or ACH and receive your deed electronically"
      ],
      depositInfo: "Payment required at time of purchase. No deposit needed to browse.",
      directLink: "https://cosl.org"
    },
    beginnerTip: "The COSL website lets you buy properties from your computer without attending any auction. Perfect starting point. Filter by property type and stick to properties with structures — raw land quality varies wildly.",
    otc: { available: true, note: "COSL sells directly year-round at cosl.org. No auction required." },
    risks: [
      "90-day litigation window — make no improvements during this period",
      "Many auction parcels are closed timber land or undevelopable",
      "Quitclaim-equivalent deed makes title insurance difficult without quiet title action",
      "Rural parcels frequently have access problems"
    ],
    ddExtra: [
      "Request COSL deed history to confirm no prior failed redemptions",
      "Check land use classification in county records before committing",
      "Budget for quiet title action if you intend to resell with title insurance"
    ],
    platforms: ["cosl.org"],
    counties: []
  },
  {
    id: "CA", name: "California", type: "deed", rate: "Varies (market value bids)", redemption: "None post-sale",
    score: 22, beginnerFriendly: false,
    notBeginnerReason: "Minimum 5 years delinquency, bids open at market value, intense institutional competition, no direct purchase.",
    scoreWhy: "Opening bids near market value, 5-year delinquency requirement, no OTC, and institutional saturation eliminate beginner opportunity.",
    note: "California requires minimum 5 years of tax delinquency before county auctions. Opening bids are set near assessed value. Conducted by county tax collectors. Statute: CA Rev & Tax Code §3691.",
    auctionSignup: {
      platform: "Bid4Assets.com (most counties) or county-specific portals",
      steps: [
        "Find your target county's tax sale schedule at the county tax collector's website",
        "Register on Bid4Assets.com or the county's auction platform",
        "Submit a deposit (typically $500–$5,000 depending on county) to qualify for bidding",
        "Bid online or in person per county instructions — opening bids are near market value"
      ],
      depositInfo: "Deposit required. Varies by county — typically $500–$5,000.",
      directLink: "https://www.bid4assets.com/taxsales"
    },
    beginnerTip: "California is not a beginner state. If you're set on California, look at rural counties (Lassen, Modoc, Siskiyou) where competition is lower and opening bids are lower.",
    otc: { available: false, note: "No direct purchase option in California." },
    risks: [
      "Opening bids near market value — little to no discount",
      "Institutional competition is among the highest in the country",
      "5-year delinquency requirement creates very limited inventory",
      "Tenants have strong protections — factor eviction costs into any occupied property"
    ],
    ddExtra: [
      "Verify 5-year delinquency is fully met before bidding",
      "Check for active tenants — California eviction process can take 12–18 months",
      "Run title search for IRS liens, HOA super-liens, and Mello-Roos assessments"
    ],
    platforms: ["Bid4Assets.com", "County tax collector portals"],
    counties: [
      { name: "Los Angeles", link: "https://ttc.lacounty.gov/tax-defaulted-property-auctions/", notes: "Largest in state. Near-market bids, high competition." },
      { name: "Sacramento", link: "https://www.assessor.saccounty.gov", notes: "Moderate competition, better rural inventory." }
    ]
  },
  {
    id: "CO", name: "Colorado", type: "lien", rate: "Federal Discount Rate + 9%", redemption: "3 years",
    score: 52, beginnerFriendly: true,
    scoreWhy: "Online auctions and solid OTC availability in rural counties. Rate fluctuates with the Federal Discount Rate but is competitive.",
    note: "Colorado holds online county tax lien sales. Rate = Federal Discount Rate + 9% (calculated annually). Unsold liens available for direct purchase. Statute: CRS §39-11-101.",
    auctionSignup: {
      platform: "SRI Tax Sale Services or county-specific portals",
      steps: [
        "Find your target county's treasurer at colorado.gov/treasury or Google '[county name] CO treasurer tax lien sale'",
        "Register on the county's auction platform (many use SRI Tax Sale Services at sriservices.com)",
        "Submit ACH or wire deposit per county instructions — typically 2 weeks before auction",
        "Bid online during the auction window"
      ],
      depositInfo: "Deposit required. Amount varies by county. Confirm with county treasurer.",
      directLink: "https://sriservices.com/taxsales/colorado"
    },
    beginnerTip: "Look at rural eastern Colorado counties (Kiowa, Cheyenne, Kit Carson) for OTC purchases at the full rate with zero auction competition.",
    otc: { available: true, note: "Unsold liens available for direct purchase from county treasurers after annual sale." },
    risks: [
      "Rate fluctuates annually with the Federal Discount Rate — calculate the current rate before bidding",
      "HOA and special improvement district liens can compete with or survive tax sales",
      "Some parcels are landlocked agricultural land with limited development potential"
    ],
    ddExtra: [
      "Verify the current rate by calling the county treasurer — it changes annually",
      "Check for HOA liens and special improvement district assessments",
      "Confirm parcel is not in a federal conservation area or water district with superior claims"
    ],
    platforms: ["SRI Tax Sale Services", "County treasurer portals"],
    counties: [
      { name: "El Paso", link: "https://www.elpasoco.com/treasurer/", notes: "Largest auction in CO. Moderate competition." },
      { name: "Denver", link: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Treasury", notes: "Urban, competitive." },
      { name: "Kiowa", link: "https://www.kiowacounty.org", notes: "Rural, excellent OTC availability, minimal competition." }
    ]
  },
  {
    id: "CT", name: "Connecticut", type: "lien", rate: "18% penalty", redemption: "1 year",
    score: 41, beginnerFriendly: false,
    notBeginnerReason: "Each municipality independently chooses between lien and redeemable deed format. Requires individual research per town.",
    scoreWhy: "Fixed 18% penalty is solid but format varies town-by-town, limiting scalability and making due diligence complex.",
    note: "Connecticut municipalities independently elect to sell tax liens or redeemable deeds. No centralized state platform. 1-year redemption. Statute: CGS §12-157.",
    auctionSignup: {
      platform: "Town-specific — contact each municipality directly",
      steps: [
        "Identify your target municipality at portal.ct.gov",
        "Contact the Town Tax Collector directly — ask if they conduct lien or redeemable deed sales and when the next sale is scheduled",
        "Request the delinquent property list",
        "Register per the town's specific instructions — most require in-person registration"
      ],
      depositInfo: "Varies by municipality.",
      directLink: "https://portal.ct.gov/OPM/IGP-MUNFINSR/Municipal-Finance-Resource-Center/Tax-Collectors"
    },
    beginnerTip: "Contact tax collectors in Waterbury, Bridgeport, and Hartford — these cities have higher delinquency rates and more consistent sale schedules than smaller towns.",
    otc: { available: false, note: "No statewide OTC program." },
    risks: [
      "Format (lien vs. redeemable deed) varies by town — confirm before registering",
      "No centralized state system — requires individual municipality research",
      "Higher-value towns (Greenwich, Westport) rarely have delinquencies worth pursuing"
    ],
    ddExtra: [
      "Confirm the sale format with the town tax collector before any due diligence",
      "Verify lien priority — Connecticut has complex municipal lien priority rules",
      "Check for any active municipal code violations on occupied structures"
    ],
    platforms: ["Town-level (no centralized platform)"],
    counties: []
  },
  {
    id: "DE", name: "Delaware", type: "hybrid", llcFriendly: true, rate: "15-20% (varies by county)", redemption: "60 days to 1 year",
    score: 28, beginnerFriendly: false,
    notBeginnerReason: "Only 3 counties, very limited inventory, not a viable primary market.",
    scoreWhy: "Only 3 counties operating independently with minimal inventory. Too small to build a strategy around.",
    note: "Delaware has only 3 counties (Kent, New Castle, Sussex), each running independent auctions. Inventory is very limited. Statute: Del. Code Title 9 §8721.",
    auctionSignup: {
      platform: "County-specific",
      steps: [
        "Contact the specific county's finance office — New Castle: newcastlede.gov, Kent: co.kent.de.us, Sussex: sussexcountyde.gov",
        "Request the upcoming tax sale schedule and delinquent property list",
        "Register with the county per their instructions",
        "Attend the auction — most are in-person"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://newcastlede.gov/205/Finance"
    },
    beginnerTip: "Delaware works best as a supplemental state, not a primary market. If you're already working the Mid-Atlantic region, add it to your list.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Very limited inventory — 3 counties total",
      "Low deal flow makes this an unreliable primary strategy",
      "Competitive in New Castle County (Wilmington area)"
    ],
    ddExtra: [
      "Verify the exact redemption period for your county — it ranges 60 days to 1 year",
      "Check for Wilmington city-specific tax liens which operate separately from New Castle County"
    ],
    platforms: ["County finance offices"],
    counties: [
      { name: "New Castle", link: "https://newcastlede.gov/205/Finance", notes: "Most inventory. Competitive near Wilmington." },
      { name: "Kent", link: "https://co.kent.de.us", notes: "Low volume." },
      { name: "Sussex", link: "https://www.sussexcountyde.gov", notes: "Low volume, mostly rural." }
    ]
  },
  {
    id: "DC", name: "Washington D.C.", type: "lien", rate: "18%", redemption: "6–12 months",
    score: 55, beginnerFriendly: false,
    notBeginnerReason: "Very high property values require substantial capital. 20% deposit required. Competitive institutional market.",
    scoreWhy: "18% rate and high property values create strong lien security, but 20% upfront deposit and institutional competition require significant capital.",
    note: "DC conducts annual tax lien sales starting July 1, running daily until inventory is exhausted. Minimum 20% deposit required upfront. Statute: DC Official Code §47-1301.",
    auctionSignup: {
      platform: "dc.gov tax sale portal",
      steps: [
        "Go to mytax.dc.gov and create an account",
        "Register for the annual tax sale (usually begins July 1)",
        "Fund your account with a minimum 20% deposit of your intended bid amount via wire transfer",
        "Bid online during the sale window"
      ],
      depositInfo: "20% of intended bid required upfront. This is one of the highest deposit requirements in the country.",
      directLink: "https://mytax.dc.gov"
    },
    beginnerTip: "DC is for experienced investors with significant capital. The 20% deposit and high property values mean you need $10,000+ just to participate meaningfully.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "20% upfront deposit is a major capital barrier",
      "Government-owned properties and historic properties are excluded",
      "Redemption period varies 6–12 months based on property type",
      "Environmental and code compliance issues are common in older DC properties"
    ],
    ddExtra: [
      "Verify property is not government-owned or under historic preservation",
      "Check for active DC code violations — these become your responsibility",
      "Confirm exact redemption period: 6 months standard, 12 months for owner-occupied"
    ],
    platforms: ["mytax.dc.gov"],
    counties: []
  },
  {
    id: "FL", name: "Florida", type: "hybrid", rate: "Up to 18% (5% minimum on redemption)", redemption: "2 years",
    score: 82, beginnerFriendly: true,
    scoreWhy: "Massive inventory, two parallel profit paths (lien + deed), fully online, year-round OTC availability. One of the top states in the country.",
    note: "Florida is a hybrid state with two parallel auction tracks. (1) Annual tax certificate sale online before June 1 — reverse bid auction starting at 18%. (2) After 2-year redemption, lienholder applies for tax deed and property goes to public auction at RealAuction. OTC available year-round via LienHub. Statutes: FL Stat §197.172 (rate), §197.432 (sale), §197.4725 (OTC), §197.472 (redemption), §197.502 (deed application).",
    auctionSignup: {
      platform: "LienHub.com (primary) + RealAuction.com (deed sales)",
      steps: [
        "Go to LienHub.com and create a free account",
        "Fund your account via ACH or wire transfer (minimum varies by county, typically $500–$2,000)",
        "Register for the specific county's annual tax certificate sale (before June 1 each year)",
        "Bid online — you're bidding the interest rate DOWN from 18%. Lowest bid wins.",
        "For OTC purchases: log into LienHub year-round and browse unsold certificates by county"
      ],
      depositInfo: "Deposit required per county. Most counties require pre-funding before auction day.",
      directLink: "https://lienhub.com"
    },
    beginnerTip: "Your best first move in Florida is LienHub OTC — buy unsold certificates year-round at the full 18% statutory rate with zero competition and no auction schedule to wait for. Skip the live auctions entirely until you're comfortable. When you're ready to shop inventory, start with smaller counties like Citrus, Hernando, or Levy for less saturated supply.",
    otc: { available: true, note: "Unsold tax certificates available year-round on LienHub.com. Start here — guaranteed 18% rate, no competition, no bidding." },
    risks: [
      "Miami-Dade and Broward: institutional buyers push rates to 0–1% — avoid for beginners",
      "Tax deed title is generally not insurable without quiet title action",
      "Government liens (code enforcement, municipal utilities) can survive tax deed sale",
      "5% mandatory minimum interest applies on all redemptions except 0% bids (§197.472). Separate rule: no interest accrues during 60-day post-delinquency window (§197.172)"
    ],
    ddExtra: [
      "Verify OTC inventory on LienHub for direct purchase certificates",
      "Confirm no government code compliance liens — contact the municipality directly",
      "Validate the 2-year redemption timeline before applying for tax deed"
    ],
    platforms: ["LienHub.com", "RealAuction.com"],
    counties: [
      { name: "Miami-Dade", link: "https://www.miamidade.gov/taxcollector/", notes: "Largest in FL. Rates bid to 0–1%. Not for beginners." },
      { name: "Broward", link: "https://www.broward.org/TaxCollector/", notes: "High competition. Same as Miami-Dade." },
      { name: "Citrus", link: "https://www.citrusclerk.org", notes: "Lower competition. Good for beginners." },
      { name: "Hernando", link: "https://www.hernandocounty.us/departments/departments-a-m/clerk-of-circuit-court", notes: "Lower competition. Beginner-friendly." },
      { name: "Orange", link: "https://www.occompt.com", notes: "Moderate competition. Good inventory." }
    ]
  },
  {
    id: "GA", name: "Georgia", type: "hybrid", rate: "20% yr1 + 10%/yr after", redemption: "1 year",
    score: 71, beginnerFriendly: true,
    scoreWhy: "Monthly auctions every first Tuesday statewide, strong penalty structure, and consistent deal flow make Georgia excellent for active investors.",
    note: "Georgia is a redeemable deed state. Investor receives the tax deed at auction but owner retains 1-year right of redemption. Redemption cost = bid price + 20% premium (year 1) + 10% per additional year. After 12 months, investor can execute via certified mail notice. Statute: OCGA §48-4-1.",
    auctionSignup: {
      platform: "County Superior Court Clerk (in-person, first Tuesday of each month)",
      steps: [
        "Find your target county's Superior Court Clerk at gsccca.org",
        "Contact the clerk's office at least 2 weeks before the first Tuesday to confirm the sale is happening and request the property list",
        "Arrive at the courthouse on the first Tuesday — register in person with your government ID",
        "Bidding is oral/open — bring a cashier's check or confirm wire requirements with the county"
      ],
      depositInfo: "Typically cashier's check. Amount varies. Confirm with the clerk's office.",
      directLink: "https://gsccca.org"
    },
    beginnerTip: "Georgia's monthly auctions give you 12 chances per year to buy. Start with mid-size counties like Bibb, Houston, or Dougherty — lower competition than Fulton (Atlanta). Remember: you cannot rent or improve the property during the 1-year redemption window.",
    otc: { available: false, note: "No OTC program. Auction only." },
    risks: [
      "Penalty calculated on full bid price — overbidding dramatically reduces your effective return",
      "Cannot collect rent or make improvements during 1-year redemption period",
      "Certified mail notice to execute redemption right is required — many investors miss this step",
      "Deed issued at auction is a tax deed — not a warranty deed"
    ],
    ddExtra: [
      "Research recent sale prices in the county to calibrate your maximum bid",
      "Verify no active litigation on the parcel at the Superior Court",
      "Prepare certified mail notice template in advance — you'll need it at month 12"
    ],
    platforms: ["County Superior Court Clerk offices"],
    counties: [
      { name: "Fulton", link: "https://www.fultoncountyga.gov/services/courts/superior-court", notes: "Atlanta area. High competition." },
      { name: "Bibb", link: "https://www.maconbibb.us/clerk-of-superior-court/", notes: "Macon area. Moderate competition. Good for beginners." },
      { name: "Chatham", link: "https://chathamcounty.org/454/Superior-Court", notes: "Savannah area. Good inventory." }
    ]
  },
  {
    id: "HI", name: "Hawaii", type: "deed", rate: "Varies", redemption: "1 year",
    score: 14, beginnerFriendly: false,
    notBeginnerReason: "Extremely limited inventory, leasehold land complexity, and Hawaiian Home Lands restrictions make this impractical.",
    scoreWhy: "Limited inventory, complex leasehold structures, and extremely high property values make Hawaii impractical for most investors.",
    note: "Hawaii has 4 counties. Many parcels are leasehold (not fee simple). Hawaiian Home Lands and other restricted designations eliminate large portions of the market. Statute: HRS §246-60.",
    auctionSignup: {
      platform: "County-specific",
      steps: [
        "Contact the County of Hawaii Real Property Tax Division, Maui County, Honolulu DPP, or Kauai Finance Division",
        "Request the delinquent property list — availability is sporadic",
        "Confirm whether the parcel is fee simple or leasehold before proceeding",
        "Register per county instructions"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://www.realpropertyhonolulu.com"
    },
    beginnerTip: "Hawaii is not a viable tax lien strategy for most investors. The leasehold complexity alone makes most parcels impractical.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Many parcels are leasehold — you'd own the improvements but not the land",
      "Hawaiian Home Lands parcels are completely restricted",
      "Extremely high property values require significant capital",
      "Very low inventory"
    ],
    ddExtra: [
      "Confirm fee simple vs. leasehold status before any due diligence",
      "Verify parcel is not in Hawaiian Home Lands designation (DHHL)",
      "Check DLNR for any state land or conservation restrictions"
    ],
    platforms: ["County tax offices"],
    counties: []
  },
  {
    id: "ID", name: "Idaho", type: "deed", rate: "Varies", redemption: "3 years",
    score: 31, beginnerFriendly: false,
    notBeginnerReason: "Counties have discretion on whether to sell — many never do. No central calendar or system.",
    scoreWhy: "Unpredictable inventory, no centralized system, and county discretion on sales make this unreliable as a strategy.",
    note: "Idaho counties have the authority but not the obligation to sell tax-delinquent properties. Some counties haven't held sales in years. Contact county treasurer directly for any real opportunity. Statute: IC §63-1003.",
    auctionSignup: {
      platform: "County treasurer (varies — many counties do not hold sales)",
      steps: [
        "Call the county treasurer directly — find them at tax.idaho.gov/county",
        "Ask explicitly: 'Do you hold tax deed sales? When is the next one scheduled?'",
        "If a sale is confirmed, request the property list and registration instructions",
        "Most sales are in-person at the courthouse"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://tax.idaho.gov/county-contact-information/"
    },
    beginnerTip: "Call Ada (Boise) and Canyon counties first — they have the most consistent sale activity in Idaho.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Many counties simply retain properties indefinitely — no guaranteed auction schedule",
      "Rural parcels often have road access, title, or environmental issues",
      "No statewide calendar or registration system"
    ],
    ddExtra: [
      "Call the county treasurer to confirm a sale is actually scheduled before investing any research time",
      "Request the full property list in advance — do not bid sight unseen",
      "Verify road access and utilities on all rural parcels"
    ],
    platforms: ["County treasurer offices"],
    counties: []
  },
  {
    id: "IL", name: "Illinois", type: "lien", rate: "Up to 18%/6mo + penalties", redemption: "2.5–3 years",
    score: 63, beginnerFriendly: false,
    notBeginnerReason: "Cook County (Chicago) is dominated by institutional buyers pushing rates to 0%. Complex Scavenger Sale rules. Requires attorney for foreclosure.",
    scoreWhy: "High statutory penalties and massive inventory — but institutional dominance in Cook and complex legal process require experience.",
    note: "Illinois holds Annual Sales (county-level, competitive bidding) and Scavenger Sales (Cook County, special rules for long-delinquent properties). Interest rate bid down from 18%/6mo. Penalty resets to 12%/6mo in forfeiture. Foreclosure requires specialized attorney. Statute: 35 ILCS 200/21.",
    auctionSignup: {
      platform: "County-specific (Cook uses its own system; others vary)",
      steps: [
        "For Cook County: go to cookcountytreasurer.com and register for the Annual Tax Sale",
        "For other counties: contact the county clerk or treasurer — find them at revenue.illinois.gov",
        "Pre-register at least 2 weeks in advance with government ID and entity documents if bidding as LLC",
        "Fund your account per county instructions — Cook requires pre-funding"
      ],
      depositInfo: "Cook County requires pre-funding. Other counties vary.",
      directLink: "https://www.cookcountytreasurer.com"
    },
    beginnerTip: "Skip Cook County until you have experience. Start with DuPage, Lake, or Will counties — better rates and less institutional competition than Chicago.",
    otc: { available: false, note: "No OTC. Unsold liens go to forfeiture status — contact county for purchase." },
    risks: [
      "Cook County: institutional buyers push rates to 0% — not viable for individual investors",
      "Penalty resets to 12% per 6 months in forfeiture — understand this before buying",
      "Scavenger Sale rules differ significantly from Annual Sale",
      "Foreclosure process requires specialized Illinois tax lien attorney"
    ],
    ddExtra: [
      "Verify the current open tax year balance with the county collector before bidding",
      "Check PACER for active bankruptcy proceedings",
      "Confirm you understand the difference between Annual Sale and Scavenger Sale rules"
    ],
    platforms: ["cookcountytreasurer.com", "County clerk offices"],
    counties: [
      { name: "Cook", link: "https://www.cookcountytreasurer.com", notes: "Largest in IL. Institutional dominated. Not for beginners." },
      { name: "DuPage", link: "https://www.dupageco.org/Treasurer/", notes: "Better rates, less competition." },
      { name: "Will", link: "https://www.willcountytreasurer.com", notes: "Good inventory." }
    ]
  },
  {
    id: "IN", name: "Indiana", type: "lien", rate: "10% (0–6mo) / 15% (6–12mo)", redemption: "1 year",
    score: 69, beginnerFriendly: true,
    scoreWhy: "Two auction windows annually, clear tiered penalty structure, and online participation available in many counties.",
    note: "Indiana holds two annual lien sales: Fall Sale (October) and Judgment Sale (January). Penalty: 10% if redeemed within 6 months, 15% months 7–12. Overbid earns only 5%. Statute: IC §6-1.1-24.",
    auctionSignup: {
      platform: "SRI Tax Sale Services (sriservices.com) — most Indiana counties",
      steps: [
        "Go to sriservices.com and select Indiana",
        "Create an account and find your target county's upcoming sale",
        "Register online — most Indiana counties use SRI for online bidding",
        "Fund your account via ACH or wire before the auction date"
      ],
      depositInfo: "Deposit required. Varies by county. Most counties require pre-funding through SRI.",
      directLink: "https://sriservices.com/taxsales/indiana"
    },
    beginnerTip: "Indiana is one of the most beginner-friendly lien states. SRI Tax Sale Services lets you bid from your computer. Start with Marion (Indianapolis) or Hamilton county — good inventory and clear online process.",
    otc: { available: true, note: "OTC certificates available from counties after the Fall Sale. Contact county auditor directly." },
    risks: [
      "Overbid earns only 5% — don't overbid",
      "Verify whether the county holds a Fall Sale (October) or Spring Sale — not all counties hold both",
      "Check for active drug seizure or civil forfeiture proceedings on the property"
    ],
    ddExtra: [
      "Confirm which sale type (A or B) the county is holding before you plan your calendar",
      "Verify no active drug seizure or civil forfeiture on the parcel",
      "Check county DLGF records for any special assessments"
    ],
    platforms: ["SRI Tax Sale Services", "County auditor offices"],
    counties: [
      { name: "Marion", link: "https://www.indy.gov/agency/marion-county-auditor", notes: "Indianapolis. Good inventory. Online via SRI." },
      { name: "Hamilton", link: "https://www.hamiltoncounty.in.gov/229/Auditor", notes: "Suburban Indianapolis. Clean title, good properties." },
      { name: "Allen", link: "https://www.allencounty.us/egov/apps/document/center.egov?view=item;id=30578", notes: "Fort Wayne area. Consistent deal flow." }
    ]
  },
  {
    id: "IA", name: "Iowa", type: "lien", rate: "24%", redemption: "2 years",
    score: 74, beginnerFriendly: true,
    scoreWhy: "Highest statutory lien rate in the country at 24%. Strong legal framework. Online participation available. Critical: must send 90-day notice at month 21 or certificate voids.",
    note: "Iowa holds its annual tax lien sale in June. Rate is a flat 24% per year. After 2 years, lienholder must send 90-day notice to owner to initiate deed process — failure to do so at the 21-month mark voids the certificate. Statute: Iowa Code §446.",
    auctionSignup: {
      platform: "County treasurer (varies — some online, some in-person)",
      steps: [
        "Find your target county treasurer at iowa.gov/counties",
        "Contact the treasurer to confirm the June sale date and registration requirements",
        "Register in advance — online participation available in some counties",
        "Fund via wire or cashier's check per county instructions"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://tax.iowa.gov/property-tax"
    },
    beginnerTip: "Iowa's 24% rate is the best in the country. The critical rule: set a calendar reminder to send your 90-day notice at exactly 21 months from purchase. Missing this deadline voids your certificate. That's the #1 mistake Iowa investors make.",
    otc: { available: false, note: "Liens not sold at auction must be purchased directly from the county — contact treasurer after the June sale." },
    risks: [
      "Must send 90-day notice at 21 months — missing this voids the certificate permanently",
      "Agricultural land dominates inventory in many counties — limited development potential",
      "OTC purchases require direct county contact after the June sale"
    ],
    ddExtra: [
      "Set a hard calendar reminder for month 21 — send 90-day notice via certified mail",
      "Subscribe to the county treasurer's mailing list for the June auction date",
      "Check for agricultural drainage district liens — these can be superior to your lien"
    ],
    platforms: ["County treasurer offices"],
    counties: []
  },
  {
    id: "KS", name: "Kansas", type: "lien", rate: "Up to 15%", redemption: "2 years",
    score: 48, beginnerFriendly: true,
    scoreWhy: "2-year redemption window before judicial sale, county can reduce minimums on unsold properties, and decent suburban inventory near Wichita and Kansas City.",
    note: "Kansas holds tax lien sales at the county level. After 2-year redemption, county files for judicial sale. County can reduce minimum bid on properties that didn't sell. Statute: KSA §79-2801.",
    auctionSignup: {
      platform: "County clerk or district court (varies)",
      steps: [
        "Contact your target county clerk — find them at ksrevisor.org/municipalities",
        "Ask about the upcoming tax lien sale schedule",
        "Register per county instructions — most are in-person",
        "Bring cashier's check or confirm wire requirements"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://www.ksrevisor.org/statutes/chapters/ch79/079_028_0001.html"
    },
    beginnerTip: "Look at Sedgwick (Wichita) and Johnson (Kansas City suburb) counties for the best inventory. Rural counties often have reduced minimums on unsold properties — ask the county clerk directly.",
    otc: { available: true, note: "Unsold properties available at reduced minimums from county. Contact county clerk directly." },
    risks: [
      "Judicial sale process adds time and legal costs",
      "Rural inventory often has limited development or resale value",
      "Check for concurrent partition actions on shared-ownership properties"
    ],
    ddExtra: [
      "Verify the full tax balance including special assessments and improvement district fees",
      "Check for active partition actions if property has multiple owners",
      "Confirm road access on rural parcels before bidding"
    ],
    platforms: ["County clerk offices"],
    counties: [
      { name: "Sedgwick", link: "https://www.sedgwickcounty.org/treasurer/", notes: "Wichita area. Best inventory in KS." },
      { name: "Johnson", link: "https://www.jocogov.org/dept/treasury/home", notes: "Kansas City suburb. Good properties." }
    ]
  },
  {
    id: "KY", name: "Kentucky", type: "lien", rate: "12%", redemption: "1 year",
    score: 38, beginnerFriendly: false,
    notBeginnerReason: "In-person only, no online bidding, sealed bid format makes it hard to gauge competition.",
    scoreWhy: "Decent 12% rate but in-person-only requirement and sealed bid format limit scalability significantly.",
    note: "Kentucky conducts in-person sealed bid sales at the county level. No online bidding. 1-year redemption before foreclosure can proceed. Statute: KRS §134.420.",
    auctionSignup: {
      platform: "County Sheriff or County Clerk (in-person, sealed bid)",
      steps: [
        "Find your target county's sheriff or clerk at kycourts.net",
        "Contact the office to confirm the upcoming sale date and request the property list",
        "Obtain and complete the sealed bid form — submit in person by the deadline",
        "Attend the opening — winners are announced publicly"
      ],
      depositInfo: "Typically cashier's check at time of bid submission.",
      directLink: "https://revenue.ky.gov/Property/Pages/default.aspx"
    },
    beginnerTip: "Jefferson (Louisville) and Fayette (Lexington) counties have the best inventory. The sealed bid format works in your favor in rural counties — less competition means your opening bid often wins.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "In-person only — cannot participate remotely",
      "Sealed bid format makes it impossible to know competitor bids",
      "Limited online infrastructure"
    ],
    ddExtra: [
      "Visit the property in person before submitting a bid — no online verification is sufficient",
      "Verify lien priority in the county records office",
      "Confirm the redemption period has not been extended for any reason"
    ],
    platforms: ["County sheriff offices", "County clerk offices"],
    counties: []
  },
  {
    id: "LA", name: "Louisiana", type: "lien", rate: "Up to 12%/yr bid-down (min 8.4%); + 5% penalty", redemption: "3 years",
    score: 61, beginnerFriendly: false,
    notBeginnerReason: "New system launched January 1, 2026 — procedures still developing, no established case law, unique civil law jurisdiction.",
    scoreWhy: "First-mover advantage in a new system with solid rates. However, 2026 is year one — county procedures and judicial sale process are untested.",
    note: "Louisiana launched a new tax lien system January 1, 2026, replacing property bidding with a downward interest rate auction (starts at 1%/month = 12%/yr, floor 0.7%/month = 8.4%/yr). After 3-year redemption, investor executes judicial sale. Statute: LA RS §47:2153 (amended 2025).",
    auctionSignup: {
      platform: "Parish Sheriff (varies by parish — new system being implemented)",
      steps: [
        "Contact the target parish sheriff's office directly — louisiana.gov/government/parishes",
        "Ask explicitly: 'Are you conducting auctions under the new 2026 lien system?'",
        "Request registration instructions — the new system is still being rolled out parish by parish",
        "Monitor the Louisiana Department of Revenue for updated guidance at revenue.louisiana.gov"
      ],
      depositInfo: "Varies by parish. New system is still being implemented.",
      directLink: "https://revenue.louisiana.gov"
    },
    beginnerTip: "Wait until late 2026 when the new system has more procedures in place. If you move early, contact parishes directly and document everything — case law doesn't exist yet for this system.",
    otc: { available: false, note: "OTC availability under new 2026 system not yet confirmed. Contact parish directly." },
    risks: [
      "2026 is year one — no established procedures or case law",
      "Do not confuse pre-2026 property bidding sales with the new lien system",
      "Judicial sale process after 3 years is untested under the new statute",
      "Louisiana is a civil law state — legal processes differ from common law states"
    ],
    ddExtra: [
      "Verify which system the target parish is using before registering",
      "Contact the parish sheriff directly to confirm the auction format",
      "Monitor NTLA and Louisiana DOR for updated guidance throughout 2026"
    ],
    platforms: ["Parish sheriff offices"],
    counties: []
  },
  {
    id: "ME", name: "Maine", type: "lien", rate: "8%", redemption: "18 months",
    score: 29, beginnerFriendly: false,
    notBeginnerReason: "Municipal-level only, sporadic auctions, very low volume. Not a viable primary market.",
    scoreWhy: "Low rate, low volume, no centralized system. Works only as a supplemental opportunity.",
    note: "Maine municipalities hold tax liens. After 18 months, municipality takes title and can auction. No centralized state system. Statute: MRSA Title 36 §942.",
    auctionSignup: {
      platform: "Municipal tax collector (varies)",
      steps: [
        "Identify your target municipality at maine.gov/revenue/propertytax",
        "Contact the municipal tax collector at least 6 months before any expected auction",
        "Request the delinquent property list and auction schedule",
        "Register per municipality instructions — most are in-person"
      ],
      depositInfo: "Varies by municipality.",
      directLink: "https://www.maine.gov/revenue/taxes/property-taxes"
    },
    beginnerTip: "Portland and Bangor have the most consistent municipal auction activity. For rural towns, call the town office directly — many don't advertise sales publicly.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Municipalities conduct sales infrequently and irregularly",
      "No centralized platform — requires monitoring individual town tax collectors",
      "Very low volume"
    ],
    ddExtra: [
      "Contact the municipal tax collector at least 6 months before any expected sale",
      "Confirm the municipality plans to auction rather than negotiate or hold the property",
      "Check for conservation easements or deed restrictions before bidding"
    ],
    platforms: ["Municipal tax collector offices"],
    counties: []
  },
  {
    id: "MD", name: "Maryland", type: "lien", rate: "6–18% (varies by county)", redemption: "6 months (9 months owner-occupied)",
    score: 77, beginnerFriendly: true,
    scoreWhy: "Shortest redemption period in the country (6 months), strong rates in Baltimore City and Anne Arundel, and multiple counties on RealAuction.",
    note: "Maryland conducts annual tax lien sales, typically in May–June. Interest rates vary: most counties 6%, Anne Arundel and Baltimore City up to 18%. Redemption: 6 months standard, 9 months for owner-occupied in Baltimore City. Statute: MD Tax-Property Code §14-820.",
    auctionSignup: {
      platform: "RealAuction.com (most counties) + county-specific for others",
      steps: [
        "Go to reauction.com and search for Maryland counties",
        "Create an account and register for your target county's annual tax sale",
        "Fund your account via ACH or wire transfer before the auction date",
        "Bid online during the auction window"
      ],
      depositInfo: "Deposit required. Varies by county. Most counties require pre-funding through RealAuction.",
      directLink: "https://reauction.com"
    },
    beginnerTip: "Start with Baltimore City or Anne Arundel County for the 18% rate. The 6-month redemption window is the shortest in the country — faster capital cycle than any other lien state.",
    otc: { available: false, note: "No statewide OTC. Check county treasurer for any unsold certificates after annual sale." },
    risks: [
      "Rate varies significantly by county — confirm before bidding (not all counties offer 18%)",
      "Baltimore City: owner-occupied properties have 9-month extended redemption",
      "Water and sewer liens from municipalities can be substantial — verify before bidding",
      "Short 6-month window means you need to move quickly on execution"
    ],
    ddExtra: [
      "Verify the specific county rate before registering",
      "Check for water, sewer, and municipal utility liens — these can exceed the tax lien value",
      "Confirm owner-occupied vs. vacant status — affects redemption timeline in Baltimore City"
    ],
    platforms: ["RealAuction.com", "County treasurer portals"],
    counties: [
      { name: "Baltimore City", link: "https://sdat.dat.maryland.gov/realestate/pages/default.aspx", notes: "18% rate. Best in MD. Online via RealAuction." },
      { name: "Anne Arundel", link: "https://www.aacounty.org/departments/budget-and-finance/treasurer", notes: "18% rate. Good inventory." },
      { name: "Prince George's", link: "https://www.princegeorgescountymd.gov/government/departments/finance", notes: "Moderate rate. Good suburban inventory." }
    ]
  },
  {
    id: "MA", name: "Massachusetts", type: "lien", rate: "16%", redemption: "6 months to 3 years (Land Court process)",
    score: 45, beginnerFriendly: false,
    notBeginnerReason: "Municipal auctions only, Land Court process required for title, expensive in metro areas.",
    scoreWhy: "Solid 16% rate but Land Court process adds cost and time. No statewide platform. Metro areas require significant capital.",
    note: "Massachusetts municipalities sell tax liens. After purchase, full title requires Land Court quiet title. No statewide platform. Statute: MGL c.60 §62.",
    auctionSignup: {
      platform: "Municipal tax collector (town-specific)",
      steps: [
        "Identify your target municipality at mass.gov/info-details/mass-interactive-property-tax-data",
        "Contact the town tax collector 60 days before their scheduled sale",
        "Request the delinquent property list and registration instructions",
        "Most sales are in-person at the town hall or courthouse"
      ],
      depositInfo: "Varies by municipality.",
      directLink: "https://www.mass.gov/orgs/massachusetts-department-of-revenue"
    },
    beginnerTip: "Worcester, Springfield, and Fall River have the most consistent municipal sale activity. Budget for Land Court quiet title costs ($3,000–$8,000) before bidding on anything you'd want to resell.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Land Court process is required for insurable title — adds $3,000–$8,000 in costs",
      "Many municipalities auction every 2–3 years — limited deal flow",
      "Metro areas (Boston, Cambridge) require significant capital for any meaningful position"
    ],
    ddExtra: [
      "Confirm the municipal sale schedule — many towns only sell every 2–3 years",
      "Budget for Land Court quiet title action before planning any resale",
      "Check for municipal improvement liens that could be superior to your lien"
    ],
    platforms: ["Municipal tax collector offices"],
    counties: []
  },
  {
    id: "MI", name: "Michigan", type: "deed", rate: "N/A (deed state)", redemption: "None post-sale",
    score: 73, beginnerFriendly: true,
    scoreWhy: "Three annual auction windows, no minimum in November, massive Wayne County inventory on Bid4Assets, and strong urban opportunity.",
    note: "Michigan holds 3 annual auctions: July (minimum bid = back taxes + fees), September (same minimums), and November (no minimum). Wayne County (Detroit) uses Bid4Assets with significant urban inventory. Unsold properties transfer to municipality. Statute: MCL §211.78.",
    auctionSignup: {
      platform: "Bid4Assets.com (Wayne County) + county-specific for others",
      steps: [
        "For Wayne County: go to bid4assets.com and search 'Wayne County Michigan'",
        "Create a Bid4Assets account and verify your identity (ID required)",
        "Submit a deposit ($500–$2,000 depending on the sale) to qualify for bidding",
        "Bid online during the auction window — November sale has no minimum"
      ],
      depositInfo: "Bid4Assets deposit: typically $500–$2,000 refundable after sale.",
      directLink: "https://www.bid4assets.com/michigan"
    },
    beginnerTip: "The November auction is where the real value is — no minimum bid means you can get properties for $500–$2,000 in Detroit. Properties sell as-is with no warranty. Inspect or get a drive-by photo before bidding on anything.",
    otc: { available: false, note: "Unsold properties go to the municipality — check Wayne County Land Bank for available inventory." },
    risks: [
      "July and September have minimum bids — November is where the real deals are",
      "Properties sold as-is with no title guarantee — title issues are common in Wayne County",
      "Detroit-area properties may have squatters, blight violations, or demolition orders"
    ],
    ddExtra: [
      "Check the Wayne County Land Bank for properties not in the public auction",
      "Run a blight violation search before bidding on any Detroit property",
      "Order a drive-by photo — Wayne County has many properties in poor condition"
    ],
    platforms: ["Bid4Assets.com", "County drain commissioner offices"],
    counties: [
      { name: "Wayne", link: "https://www.bid4assets.com/michigan", notes: "Detroit. Largest inventory. November sale = no minimum. Use Bid4Assets." },
      { name: "Oakland", link: "https://www.oakgov.com/treasurer/", notes: "Suburban Detroit. Better property condition." },
      { name: "Macomb", link: "https://www.macombgov.org/Treasurer", notes: "Good suburban inventory." }
    ]
  },
  {
    id: "MN", name: "Minnesota", type: "deed", rate: "N/A", redemption: "None post-sale",
    score: 24, beginnerFriendly: false,
    notBeginnerReason: "Minimum bid set at assessed value, Tyler v. Hennepin (2023) surplus return requirement, many counties simply retain properties.",
    scoreWhy: "Market-value minimums and the Tyler ruling's surplus return requirement nearly eliminate below-market opportunity.",
    note: "Minnesota sets minimum bids at assessed value — eliminating most discount opportunity. Tyler v. Hennepin (2023) requires counties to return surplus bids to prior owners. Many counties retain properties via county land bank rather than auctioning. Statute: MN Stat §280.01.",
    auctionSignup: {
      platform: "County auditor (varies)",
      steps: [
        "Contact your target county auditor — mn.gov/admin/government/counties",
        "Ask if the county is actively auctioning tax-forfeited land or using a land bank",
        "Request the upcoming sale list and registration instructions",
        "Most sales are in-person with public notice required"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://www.revenue.state.mn.us/property-tax-division"
    },
    beginnerTip: "Minnesota is not a recommended market. If you're in MN, look at county land bank programs — St. Louis County and Cass County occasionally offer direct purchase of tax-forfeited land at below-assessed prices.",
    otc: { available: false, note: "County land banks may offer direct purchase — contact county auditor." },
    risks: [
      "Minimum bids at assessed value eliminate below-market opportunity",
      "Tyler v. Hennepin requires complex surplus return process",
      "Many counties retain properties rather than auctioning"
    ],
    ddExtra: [
      "Confirm the county intends to auction — many use land banks instead",
      "Understand how Tyler v. Hennepin affects any overbid situation",
      "Check for concurrent private mortgage foreclosure proceedings"
    ],
    platforms: ["County auditor offices"],
    counties: []
  },
  {
    id: "MS", name: "Mississippi", type: "lien", rate: "18%", redemption: "2 years",
    score: 58, beginnerFriendly: true,
    scoreWhy: "18% rate with direct purchase available on state-owned land. Good inventory in rural counties with limited competition.",
    note: "Mississippi holds annual tax lien sales at the county level. 18% rate. After 2-year redemption, lienholder can file for chancery court decree. State land available for direct purchase via GovEase. Statute: MS Code §27-41-1.",
    auctionSignup: {
      platform: "GovEase.com (state land) + county chancery clerk (county sales)",
      steps: [
        "For state-owned land: go to govease.com and search Mississippi",
        "For county sales: contact the county chancery clerk — find them at mdah.ms.gov/county-list",
        "Register per county instructions — some counties use GovEase, others are in-person",
        "Fund your account or bring cashier's check per county requirements"
      ],
      depositInfo: "Varies. GovEase requires pre-funding.",
      directLink: "https://govease.com"
    },
    beginnerTip: "Start with GovEase for direct purchase of state-owned land. No auction competition — you pick the property, pay the price, and get your certificate. Best beginner entry point in Mississippi.",
    otc: { available: true, note: "State-owned tax land available for direct purchase on GovEase.com year-round." },
    risks: [
      "2-year redemption before chancery court decree — long capital cycle",
      "Overbid premium is NOT returned if owner redeems",
      "Title research is critical — many rural properties have complex ownership histories"
    ],
    ddExtra: [
      "Check GovEase for direct purchase inventory before attending county auctions",
      "Confirm pre-bid registration deadlines with county chancery clerk",
      "Verify property is not in a FEMA flood zone — Mississippi has significant flood risk"
    ],
    platforms: ["GovEase.com", "County chancery clerk offices"],
    counties: []
  },
  {
    id: "MO", name: "Missouri", type: "lien", rate: "10%", redemption: "1 year",
    score: 41, beginnerFriendly: false,
    notBeginnerReason: "Non-residents cannot bid directly — must designate a Missouri resident agent. St. Louis and Jackson County operate as deed states with unique junior-lien rules.",
    scoreWhy: "Resident agent requirement for non-residents and complex lien priority rules (older liens subordinate to newer) make this state difficult to operate in remotely.",
    note: "Missouri non-residents cannot bid directly — must designate a resident county agent to bid and hold the certificate, then transfer by quitclaim deed. Annual sale: 4th Monday in August. St. Louis City and Jackson County conduct tax deed sales with the unusual rule that older liens are subordinate to newer ones per RSMo Cap.140.",
    auctionSignup: {
      platform: "County collector (in-person, 4th Monday in August)",
      steps: [
        "If not a Missouri resident: find a local agent willing to bid and hold the certificate on your behalf",
        "Contact the county collector — sos.mo.gov/elections/countyofficials",
        "Register through your agent or in person if you are a MO resident",
        "Bring cashier's check — most Missouri counties do not accept wire on auction day"
      ],
      depositInfo: "Cashier's check. Confirm amount with county collector.",
      directLink: "https://dor.mo.gov/taxation/property/"
    },
    beginnerTip: "Missouri is not recommended for out-of-state beginners due to the agent requirement. If you have a Missouri contact, start with rural counties where the 10% rate faces no competition.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Non-residents must use a Missouri resident agent — adds complexity and cost",
      "St. Louis City and Jackson County use deed system with unique lien priority rules",
      "10% rate is relatively low compared to other lien states"
    ],
    ddExtra: [
      "Confirm your agent's registration status and understand the quitclaim transfer process",
      "For St. Louis/Jackson County: understand the inverted lien priority rules before bidding",
      "Check for IRS liens — these survive Missouri tax lien sales"
    ],
    platforms: ["County collector offices"],
    counties: []
  },
  {
    id: "MT", name: "Montana", type: "lien", rate: "10% + 2% penalty", redemption: "2-3 years (residential: 3 yrs; commercial: 2 yrs)",
    score: 37, beginnerFriendly: false,
    notBeginnerReason: "Annual July assignment, no online platform, no direct purchase, and predominantly rural agricultural inventory.",
    scoreWhy: "Low rate, long 3-year redemption, no online platform, and limited urban inventory restrict opportunity.",
    note: "Montana assigns tax liens annually in July to the county. Unsold liens transfer to county for private assignment. No centralized platform or online system. 3-year redemption before deed. Statute: MCA §15-17-112.",
    auctionSignup: {
      platform: "County treasurer (in-person)",
      steps: [
        "Contact the county treasurer — mt.gov/govt/counties",
        "Ask about the July lien assignment schedule",
        "Request the delinquent property list",
        "Register in person with the county"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://mtrevenue.gov/property/"
    },
    beginnerTip: "Montana works best for investors who are physically in the state. Remote participation is very difficult without a local contact.",
    otc: { available: false, note: "No OTC. Unassigned liens go to county — contact treasurer for private assignment." },
    risks: [
      "Assignment system operates on first-come, first-served basis — not competitive auction",
      "Limited urban inventory — primarily rural agricultural land",
      "No online infrastructure"
    ],
    ddExtra: [
      "Verify road access on all rural parcels before assignment",
      "Confirm no conflicting water rights or grazing easements",
      "Check for prior failed assignments on the parcel"
    ],
    platforms: ["County treasurer offices"],
    counties: []
  },
  {
    id: "NE", name: "Nebraska", type: "lien", rate: "14%", redemption: "3 years",
    score: 55, beginnerFriendly: true,
    scoreWhy: "14% rate with OTC availability after the March auction and a rotational bidding format that levels the playing field.",
    note: "Nebraska holds annual tax lien sales in March. Rotational bidding format (unusual — counties rotate through available properties giving each registered bidder equal turns). 3-year redemption. OTC available after the sale. Statute: NRS §77-1801.",
    auctionSignup: {
      platform: "County treasurer (in-person or online for some counties)",
      steps: [
        "Find your target county treasurer at nebraska.gov/government/county",
        "Contact the treasurer 30 days before the March sale",
        "Register for the rotational auction — understand the rotational bidding format before attending",
        "OTC: contact the county after the March sale for unsold liens"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://revenue.nebraska.gov/PAD"
    },
    beginnerTip: "The rotational format is unusual but actually helps beginners — every registered bidder gets equal turns, so large investors can't dominate. Attend one auction to observe before bidding.",
    otc: { available: true, note: "Unsold liens available for direct purchase after the March auction. Contact county treasurer." },
    risks: [
      "Rotational format is confusing on first visit — observe before bidding",
      "3-year redemption ties up capital",
      "Limited urban inventory outside Omaha and Lincoln"
    ],
    ddExtra: [
      "Attend one auction as an observer before committing capital",
      "Verify road access and utilities on rural parcels",
      "Contact county after March sale for OTC list"
    ],
    platforms: ["County treasurer offices"],
    counties: []
  },
  {
    id: "NV", name: "Nevada", type: "deed", llcFriendly: true, rate: "N/A", redemption: "None post-sale",
    score: 49, beginnerFriendly: false,
    notBeginnerReason: "2-year county hold period before auction, sealed bid followed by oral bid, and strong institutional competition in Las Vegas area.",
    scoreWhy: "Decent inventory in Clark County (Las Vegas) but 2-year wait and competitive urban market require patience and experience.",
    note: "Nevada counties hold tax-delinquent properties for 2 years before public auction. Auction uses sealed bids followed by oral bids. Clark County (Las Vegas) has strongest inventory. Statute: NRS §361.585.",
    auctionSignup: {
      platform: "County treasurer or assessor (varies)",
      steps: [
        "Find your target county at Nevada County government sites — clarkcountynv.gov for Clark",
        "Request the delinquent property list and auction schedule",
        "Submit sealed bid by the deadline — then attend oral bid follow-up",
        "Bring cashier's check or confirm wire requirements"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://www.clarkcountynv.gov/government/assessor/"
    },
    beginnerTip: "Focus on rural Nevada counties (Churchill, Lander, Esmeralda) for lower competition. Las Vegas-area properties in Clark County face significant institutional competition.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "2-year wait before auction — long capital cycle",
      "Clark County: institutional competition is significant in metro areas",
      "Sealed bid format — difficult to gauge market interest"
    ],
    ddExtra: [
      "Verify the 2-year hold period has been met before attending",
      "Check for active water rights or mining claims on rural parcels",
      "Confirm the sealed bid deadline — missing it disqualifies you from the oral auction"
    ],
    platforms: ["County treasurer offices"],
    counties: [
      { name: "Clark", link: "https://www.clarkcountynv.gov/government/assessor/", notes: "Las Vegas. Best inventory. Competitive." }
    ]
  },
  {
    id: "NH", name: "New Hampshire", type: "deed", rate: "18%", redemption: "2 years",
    score: 33, beginnerFriendly: false,
    notBeginnerReason: "Municipal auctions only, sporadic sales, and 2020 NH Supreme Court ruling prevents municipalities from retaining surplus bids.",
    scoreWhy: "18% rate on paper, but low volume, infrequent sales, and the surplus return ruling limit practical returns.",
    note: "New Hampshire municipalities conduct sporadic tax lien sales. 2-year redemption. 2020 NH Supreme Court ruling requires municipalities to return surplus beyond what's owed. Statute: NHRS §80:19.",
    auctionSignup: {
      platform: "Municipal tax collector (town-specific)",
      steps: [
        "Monitor municipal annual reports and town meeting minutes for upcoming sales",
        "Contact the town tax collector directly — nh.gov/nhes for municipal directory",
        "Register per the town's specific instructions — most are in-person",
        "Understand the surplus return ruling before setting your maximum bid"
      ],
      depositInfo: "Varies by municipality.",
      directLink: "https://www.revenue.nh.gov/property-appraisal/index.htm"
    },
    beginnerTip: "Manchester and Nashua have the most active municipal tax sales in NH. Monitor town meeting agendas — sales are often listed months in advance.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Surplus return requirement reduces maximum profitable bid",
      "No centralized system — must monitor individual municipalities",
      "Very low volume"
    ],
    ddExtra: [
      "Calculate your maximum bid with the surplus return ruling in mind",
      "Monitor municipal meeting agendas — sales are often announced here first",
      "Verify the 2-year redemption period has been met"
    ],
    platforms: ["Municipal tax collector offices"],
    counties: []
  },
  {
    id: "NJ", name: "New Jersey", type: "lien", rate: "18% + penalties", redemption: "2 years",
    score: 76, beginnerFriendly: false,
    notBeginnerReason: "567 municipalities with varying competition. North NJ rates bid to 0%. Premium bids required in many municipalities. Bankruptcy risk within 90 days can void certificate.",
    scoreWhy: "Strong 18% rate and massive deal flow, but institutional dominance in northern NJ and bankruptcy risk require experience.",
    note: "New Jersey has 567 municipalities, 98%+ conducting annual tax sales. Rate bid down from 18%. Premiums often required. Bankruptcy within 90 days of purchase can void the certificate per Third Circuit ruling. Statute: NJSA §54:5-1.",
    auctionSignup: {
      platform: "RealAuction.com (most municipalities) + municipal-specific",
      steps: [
        "Go to reauction.com and search for New Jersey municipalities",
        "Create an account and register for your target municipality's annual sale",
        "Fund your account via ACH or wire transfer before the auction date",
        "Bid online — you're bidding the interest rate DOWN from 18%, then up on premium"
      ],
      depositInfo: "Varies by municipality. Most require pre-funding through RealAuction.",
      directLink: "https://reauction.com"
    },
    beginnerTip: "Start with South Jersey municipalities (Salem, Cumberland, Cape May counties) — lower competition and better rates than North Jersey. Avoid Bergen, Essex, and Hudson counties where rates go to 0%.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Bankruptcy within 90 days can void your certificate — check PACER after purchase",
      "North NJ rates go to 0% — not viable for individual investors",
      "Premium bids reduce effective yield significantly",
      "567 municipalities mean 567 different registration processes"
    ],
    ddExtra: [
      "Check PACER for bankruptcy filings after purchase — critical in NJ",
      "Confirm municipality-specific registration deadlines before the sale",
      "Research prior year sale results to gauge competition level in your target municipality"
    ],
    platforms: ["RealAuction.com", "Municipal tax collector offices"],
    counties: [
      { name: "Salem", link: "https://www.salemcountynj.gov/county-government/county-offices/tax-administrator/", notes: "Low competition. Good rates." },
      { name: "Cumberland", link: "https://www.co.cumberland.nj.us/264/Tax-Board", notes: "Low competition. Good rates." },
      { name: "Bergen", link: "https://www.bergencountynj.gov/", notes: "High competition. Rates often 0%. Avoid for beginners." }
    ]
  },
  {
    id: "NM", name: "New Mexico", type: "deed", rate: "N/A", redemption: "None post-sale",
    score: 51, beginnerFriendly: true,
    scoreWhy: "State PTD system centralizes all auctions on a single platform — simplest auction registration process in the country.",
    note: "New Mexico's Property Tax Division (PTD) manages all tax deed sales statewide through a centralized online system. Single registration covers all NM counties. Statute: NMSA §7-38-65.",
    auctionSignup: {
      platform: "New Mexico PTD online portal",
      steps: [
        "Go to tax.newmexico.gov/property-taxes and find the tax sale section",
        "Create an account — single registration covers all New Mexico counties",
        "Browse available properties and register for upcoming sales",
        "Bid online per PTD instructions"
      ],
      depositInfo: "Varies by sale. Confirm with PTD.",
      directLink: "https://www.tax.newmexico.gov/property-taxes/"
    },
    beginnerTip: "New Mexico's single-registration system is the simplest in the country. Register once, access all county sales. Good starting point for deed-state investing.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Many parcels are rural desert with limited development potential",
      "Title issues common on older properties",
      "Some parcels have Native American land claim complications"
    ],
    ddExtra: [
      "Check BLM and BIA records for any Native American land complications",
      "Verify road access — many NM parcels are landlocked desert",
      "Run title search before bidding on any property with structures"
    ],
    platforms: ["tax.newmexico.gov"],
    counties: []
  },
  {
    id: "NY", name: "New York", type: "hybrid", rate: "Varies (NYC lien: 18%; upstate deed: varies)", redemption: "Varies",
    score: 47, beginnerFriendly: false,
    notBeginnerReason: "NYC lien sales require bulk qualification. Upstate varies by county — some lien, some deed. Complex system requires legal expertise.",
    scoreWhy: "NYC lien market is one of the world's largest but requires bulk qualification. Upstate varies county-by-county. Significant legal complexity.",
    note: "New York is hybrid: NYC and Long Island operate lien markets (NYC lien sale is one of the largest in the world, requires bulk qualification). Upstate counties vary between lien and deed sales. Statute: NY RPTL §1110.",
    auctionSignup: {
      platform: "NYC: cityofnewyork.us tax lien sale; Upstate: county-specific",
      steps: [
        "For NYC: go to nyc.gov/taxlien — bulk qualification required, minimum purchase amounts apply",
        "For upstate counties: contact the county treasurer or real property tax office directly",
        "Confirm whether your target county is a lien or deed state before registering",
        "Register per county instructions — processes vary significantly"
      ],
      depositInfo: "NYC: significant capital requirement for bulk purchase. Upstate: varies.",
      directLink: "https://www.nyc.gov/site/finance/taxes/property-tax-lien-sale.page"
    },
    beginnerTip: "Skip NYC — it's not for beginners. Focus on upstate deed counties like Onondaga (Syracuse), Monroe (Rochester), or Erie (Buffalo) where processes are more accessible.",
    otc: { available: false, note: "No statewide OTC." },
    risks: [
      "NYC requires bulk qualification — not accessible to individual investors",
      "Upstate counties vary between lien and deed — confirm before registering",
      "Strong tenant protection laws statewide — occupied property eviction can take 12+ months"
    ],
    ddExtra: [
      "Confirm whether your target county uses lien or deed format",
      "NYC: understand bulk qualification requirements before pursuing",
      "Check for active tax exemptions (STAR, senior, veterans) that complicate lien status"
    ],
    platforms: ["nyc.gov/taxlien", "County treasurer offices (upstate)"],
    counties: []
  },
  {
    id: "NC", name: "North Carolina", type: "deed", rate: "N/A", redemption: "10-day upset bid period post-auction",
    score: 62, beginnerFriendly: true,
    scoreWhy: "Good deed inventory and two execution methods, but the 10-day upset bid period means someone can outbid you after you win.",
    note: "North Carolina holds tax deed sales. After auction, there is a 10-day 'upset bid' window where any party can submit a 5% higher bid and win the property. Good inventory in Charlotte and Raleigh metro areas. Statute: NCGS §105-374.",
    auctionSignup: {
      platform: "County tax collector or sheriff (in-person or online)",
      steps: [
        "Find your target county tax collector at dornc.com or the county government website",
        "Register for the upcoming sale — some NC counties use online platforms, others are in-person",
        "Attend the auction and bid — if you win, be aware of the 10-day upset bid window",
        "Monitor for upset bids during the 10-day window before assuming you own the property"
      ],
      depositInfo: "Typically 5–10% deposit at auction. Varies by county.",
      directLink: "https://www.ncdor.gov/taxes-forms/property-tax"
    },
    beginnerTip: "Mecklenburg (Charlotte), Wake (Raleigh), and Durham counties have the best inventory. Factor the 10-day upset bid period into your planning — never make improvements or arrangements during those 10 days.",
    otc: { available: false, note: "No statewide OTC. Check county for surplus sale inventory." },
    risks: [
      "10-day upset bid period: anyone can outbid you by 5% after you win — you don't own it until day 11",
      "Two execution methods (in rem vs. judicial) — confirm which your county uses",
      "Strong tenant protections — budget for eviction costs on occupied properties"
    ],
    ddExtra: [
      "Confirm which execution method the county uses for the sale",
      "Do not schedule contractors or movers until the 10-day upset bid period expires",
      "Check for active IRS liens — these survive NC tax deed sales"
    ],
    platforms: ["County tax collector offices", "County sheriff offices"],
    counties: [
      { name: "Mecklenburg", link: "https://www.mecknc.gov/TaxCollections/Pages/Home.aspx", notes: "Charlotte. Strong inventory." },
      { name: "Wake", link: "https://www.wake.gov/departments-agencies/revenue-department", notes: "Raleigh. Good suburban inventory." }
    ]
  },
  {
    id: "ND", name: "North Dakota", type: "lien", rate: "Varies", redemption: "4 years",
    score: 27, beginnerFriendly: false,
    notBeginnerReason: "4-year redemption period, December-only auctions, and predominantly rural agricultural inventory.",
    scoreWhy: "4-year redemption ties up capital far too long. December-only auctions and agricultural-dominated inventory limit strategic value.",
    note: "North Dakota holds tax lien auctions in December only. 4-year redemption period. Inventory dominated by rural agricultural land. Statute: NDCC §57-28.",
    auctionSignup: {
      platform: "County auditor (in-person, December)",
      steps: [
        "Find your target county auditor at nd.gov/counties",
        "Request the delinquent property list in October",
        "Register in person for the December auction",
        "Bring cashier's check"
      ],
      depositInfo: "Cashier's check required.",
      directLink: "https://www.nd.gov/tax/"
    },
    beginnerTip: "North Dakota is not recommended for beginners or most investors. If you're here specifically for agricultural land, focus on Cass County (Fargo area) where there's more demand.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "4-year redemption — the longest in the country",
      "December-only auctions limit timing flexibility",
      "Agricultural land dominates — limited development potential"
    ],
    ddExtra: [
      "Calculate your opportunity cost over the 4-year holding period before bidding",
      "Verify water rights and mineral rights status on agricultural parcels",
      "Confirm drainage district liens on any farmland"
    ],
    platforms: ["County auditor offices"],
    counties: []
  },
  {
    id: "OH", name: "Ohio", type: "hybrid", rate: "18% (lien counties) / Market value (deed counties)", redemption: "1 year",
    score: 64, beginnerFriendly: true,
    scoreWhy: "34+ counties conduct lien sales with 18% upset bids. Remaining counties use deed/sheriff sales. Strong urban inventory in Cleveland and Columbus.",
    note: "Ohio is hybrid: 34+ counties hold lien certificate sales with 18% upset bids. Other counties use deed or sheriff sales at fair market value. Must verify which type your target county uses. Statute: ORC §5721.19.",
    auctionSignup: {
      platform: "County treasurer (varies — some online via SRI, some in-person)",
      steps: [
        "Call your target county treasurer to confirm whether it's a lien or deed county",
        "For lien counties: many use SRI Tax Sale Services at sriservices.com",
        "Register online or in-person per county instructions",
        "Fund your account before the auction date"
      ],
      depositInfo: "Varies by county. SRI counties require pre-funding.",
      directLink: "https://sriservices.com/taxsales/ohio"
    },
    beginnerTip: "Cuyahoga (Cleveland) and Franklin (Columbus) counties have the best lien inventory. Call the county treasurer first to confirm the auction type before any due diligence.",
    otc: { available: false, note: "No OTC. Check with county treasurer for unsold lien availability after sale." },
    risks: [
      "Must confirm lien vs. deed type before registering — processes are completely different",
      "Sheriff sales are at market value — limited discount opportunity",
      "IRS liens may survive Ohio tax sales — verify before bidding"
    ],
    ddExtra: [
      "Call the county treasurer to confirm auction type before investing research time",
      "Check sheriff sale records and foreclosure filings for the parcel",
      "Verify IRS lien status — federal liens can survive Ohio tax lien sales"
    ],
    platforms: ["SRI Tax Sale Services", "County treasurer offices"],
    counties: [
      { name: "Cuyahoga", link: "https://treasurer.cuyahogacounty.us/en-US/tax-certificate-sale.aspx", notes: "Cleveland. Strong lien inventory." },
      { name: "Franklin", link: "https://treasurer.franklincountyohio.gov/", notes: "Columbus. Good inventory." }
    ]
  },
  {
    id: "OK", name: "Oklahoma", type: "lien", rate: "8%", redemption: "2 years",
    score: 36, beginnerFriendly: true,
    scoreWhy: "Lowest rate among lien states at 8%, but straightforward process with October OTC and June resale options.",
    note: "Oklahoma holds October tax lien auction followed by June resale and Commissioner's sale. OTC available first Monday of October. Rate is only 8%. Statute: OS Title 68 §3101.",
    auctionSignup: {
      platform: "County treasurer (Oklahoma County uses online system)",
      steps: [
        "Find your target county treasurer at ok.gov/treasurer",
        "Oklahoma County (OKC): check oklahomacounty.org/treasurer for online registration",
        "Register at least 2 weeks before the October auction",
        "OTC: show up at the county treasurer's office on the first Monday of October for direct purchase"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://www.ok.gov/treasurer/Property_Tax/index.html"
    },
    beginnerTip: "Oklahoma County (OKC) and Tulsa County have the best inventory. The 8% rate is low but the OTC direct purchase option on the first Monday of October is beginner-friendly — no auction competition.",
    otc: { available: true, note: "OTC available first Monday of October each year — direct purchase from county treasurer at 8% rate." },
    risks: [
      "8% is the lowest lien rate in the country — make sure the return justifies the capital",
      "2-year redemption before deed proceedings",
      "Limited online infrastructure in rural counties"
    ],
    ddExtra: [
      "Calculate whether 8% justifies your capital commitment vs. other states",
      "Verify road access on rural parcels",
      "Confirm OTC availability date with county treasurer — it's the first Monday of October"
    ],
    platforms: ["County treasurer offices"],
    counties: [
      { name: "Oklahoma", link: "https://www.oklahomacounty.org/departments/county-treasurer", notes: "OKC area. Best inventory." },
      { name: "Tulsa", link: "https://www.tulsacounty.org/Department/TreasurerPortal.aspx", notes: "Good inventory." }
    ]
  },
  {
    id: "OR", name: "Oregon", type: "deed", rate: "N/A", redemption: "None post-sale",
    score: 19, beginnerFriendly: false,
    notBeginnerReason: "80% of assessed value minimum bid, 3 years delinquency + 2 years county hold, virtually no below-market opportunity.",
    scoreWhy: "80% of assessed value as opening bid eliminates discount opportunity. 5-year total cycle before auction is too long.",
    note: "Oregon requires 3 years delinquency before county takes deed, then 2 years county hold before auction. Opening bids set at 80% of assessed value. Statute: ORS §312.060.",
    auctionSignup: {
      platform: "County tax collector (varies)",
      steps: [
        "Contact the county tax collector — oregon.gov/dor for county directory",
        "Request the upcoming auction schedule and property list",
        "Register per county instructions — most are in-person",
        "Be prepared for opening bids near 80% of assessed value"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://www.oregon.gov/dor/programs/property/Pages/default.aspx"
    },
    beginnerTip: "Oregon is not recommended for investors seeking below-market deals. The 80% minimum makes it impractical.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "80% minimum of assessed value leaves minimal margin",
      "5-year total cycle (3-year delinquency + 2-year county hold) is the longest effective cycle",
      "No OTC option"
    ],
    ddExtra: [
      "Verify the county's assessed value vs. market value before bidding",
      "Check for environmental or wetlands designations",
      "Calculate whether the 80% minimum leaves any workable margin"
    ],
    platforms: ["County tax collector offices"],
    counties: []
  },
  {
    id: "PA", name: "Pennsylvania", type: "deed", rate: "N/A", redemption: "None post-sale",
    score: 67, beginnerFriendly: true,
    scoreWhy: "Upset Sale in September often creates significant discounts. Multiple purchase pathways (upset, private, judicial) and strong urban inventory.",
    note: "Pennsylvania's Real Estate Tax Sale Law creates multiple pathways: Upset Sale (September, min = all back taxes), Private Sale (unsold properties), and Judicial Sale (lower minimums, wipes most liens). Title clearance frequently required for insurable deed. Statute: PA Act 542 (72 PS §5860.101).",
    auctionSignup: {
      platform: "County tax claim office (in-person) + Bid4Assets (Philadelphia, some others)",
      steps: [
        "Find your target county tax claim office — pa.gov/guides/pa-courts for county directory",
        "Request the September Upset Sale property list (usually available August)",
        "Register with the county tax claim office — in-person registration required in most counties",
        "For Philadelphia: go to bid4assets.com and register for the Sheriff's Sale"
      ],
      depositInfo: "Typically $500–$1,000 deposit. Confirm with county.",
      directLink: "https://www.bid4assets.com/taxsales/pennsylvania"
    },
    beginnerTip: "Start with the private sale list — properties that didn't sell at Upset Sale are available for direct purchase from the county tax claim office at reduced prices. No auction competition. Call the county tax claim office and ask for their private sale inventory.",
    otc: { available: true, note: "Private sale list available from county tax claim offices for properties unsold at Upset Sale. Call the county directly." },
    risks: [
      "Title clearance required for insurable deed — budget $2,500–$7,500",
      "Mortgage liens may survive Upset Sale (but not Judicial Sale) — know which type you're buying",
      "Some liens survive both sale types — IRS liens are the primary concern"
    ],
    ddExtra: [
      "Verify which sale type applies — Upset vs. Private vs. Judicial have different lien survivability",
      "Check the county tax claim office private sale list for underutilized buying opportunities",
      "Budget for title clearance before planning any resale"
    ],
    platforms: ["Bid4Assets.com", "County tax claim offices"],
    counties: [
      { name: "Philadelphia", link: "https://www.bid4assets.com/taxsales/pennsylvania", notes: "Sheriff's Sale via Bid4Assets. High inventory." },
      { name: "Allegheny", link: "https://www.alleghenycounty.us/real-estate/tax-claim-bureau.aspx", notes: "Pittsburgh area. Good inventory." },
      { name: "Dauphin", link: "https://www.dauphincounty.org/government/departments/treasury", notes: "Harrisburg area. Moderate competition." }
    ]
  },
  {
    id: "RI", name: "Rhode Island", type: "hybrid", rate: "16% penalty (6 months); 1%/mo thereafter", redemption: "1 year",
    score: 26, beginnerFriendly: false,
    notBeginnerReason: "39 tiny municipalities with very low volume, no state infrastructure, irregular sales.",
    scoreWhy: "Too small and irregular to build a strategy around. Works only as a supplemental opportunity if already in the region.",
    note: "Rhode Island has 39 municipalities each conducting their own irregular tax lien sales. Very low volume. No centralized platform. Statute: RI Gen Laws §44-9-1.",
    auctionSignup: {
      platform: "Municipal treasurer (town-specific)",
      steps: [
        "Contact the target municipality's treasurer directly — ri.gov for municipal directory",
        "Ask when the next tax sale is scheduled — most municipalities sell infrequently",
        "Register per municipality instructions",
        "Most are in-person"
      ],
      depositInfo: "Varies by municipality.",
      directLink: "https://www.ri.gov/government/local/"
    },
    beginnerTip: "Providence and Pawtucket have the most consistent sale activity in RI. For such a small state, your time may be better spent on a neighboring state with more inventory.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Sales are irregular — municipalities conduct auctions infrequently",
      "No centralized platform",
      "Very low volume makes this an unreliable strategy"
    ],
    ddExtra: [
      "Contact the municipal treasurer directly — don't assume a sale is happening",
      "Verify the 1-year redemption period is still intact",
      "Check for municipal improvement liens"
    ],
    platforms: ["Municipal treasurer offices"],
    counties: []
  },
  {
    id: "SC", name: "South Carolina", type: "lien", rate: "3–12% (varies by redemption month)", redemption: "1 year",
    score: 43, beginnerFriendly: false,
    notBeginnerReason: "Variable penalty structure tied to redemption month creates unpredictable returns. Limited online infrastructure.",
    scoreWhy: "Variable penalty structure makes returns unpredictable. October–December auction window is decent but limited online access.",
    note: "South Carolina holds annual lien sales October–December. Penalty varies by redemption month (3% if redeemed month 1, scaling to 12% if redeemed at month 12). No statewide platform. Statute: SC Code §12-51-90.",
    auctionSignup: {
      platform: "County delinquent tax collector (in-person)",
      steps: [
        "Find your target county delinquent tax collector at scdor.sc.gov",
        "Request the upcoming sale list (typically available October)",
        "Register in person with the county",
        "Bring cashier's check — most SC counties do not accept wire on sale day"
      ],
      depositInfo: "Cashier's check required in most counties.",
      directLink: "https://dor.sc.gov/tax/property"
    },
    beginnerTip: "Greenville, Richland (Columbia), and Charleston counties have the best inventory. Calculate your worst-case return if the owner redeems in month 1 (3%) before committing capital.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Penalty varies 3–12% depending on redemption month — your return is uncertain",
      "Calculate worst-case (month 1 redemption at 3%) before bidding",
      "Limited online infrastructure"
    ],
    ddExtra: [
      "Calculate worst-case return if property redeems in month 1",
      "Verify homestead exemption status — affects redemption process",
      "Check for prior lien holders who may have superior claims"
    ],
    platforms: ["County delinquent tax collector offices"],
    counties: [
      { name: "Greenville", link: "https://www.greenvillecounty.org/treasurer/", notes: "Best inventory in SC." },
      { name: "Richland", link: "https://www.richlandcountysc.gov/Departments/Treasurer", notes: "Columbia area. Good inventory." }
    ]
  },
  {
    id: "SD", name: "South Dakota", type: "lien", rate: "12%", redemption: "3–4 years",
    score: 35, beginnerFriendly: false,
    notBeginnerReason: "Long 3–4 year redemption, limited inventory, December-only auctions.",
    scoreWhy: "12% rate is decent but 3–4 year redemption ties up capital too long for most strategies. Limited inventory.",
    note: "South Dakota holds limited annual lien sales, mostly in December. Certificates are transferable. 3–4 year redemption before deed. Statute: SDCL §10-25.",
    auctionSignup: {
      platform: "County treasurer (in-person)",
      steps: [
        "Find your target county treasurer at sd.gov/government/counties",
        "Contact the treasurer in October to confirm a December sale is scheduled",
        "Request the delinquent property list",
        "Register in person"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://dor.sd.gov/businesses/taxes/property-tax/"
    },
    beginnerTip: "Minnehaha (Sioux Falls) and Pennington (Rapid City) counties have the best SD inventory. Note that certificates are transferable — you can sell your certificate position to another investor.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "3–4 year redemption is very long",
      "December-only auctions limit timing",
      "Limited inventory outside Sioux Falls and Rapid City"
    ],
    ddExtra: [
      "Calculate opportunity cost over the 3–4 year holding period",
      "Verify the exact redemption period for the county",
      "Confirm certificates are transferable if you need liquidity before redemption"
    ],
    platforms: ["County treasurer offices"],
    counties: []
  },
  {
    id: "TN", name: "Tennessee", type: "hybrid", rate: "10% penalty on redemption", redemption: "2 years",
    score: 59, beginnerFriendly: false,
    notBeginnerReason: "Chancery Court process requires attorney. 2-year delinquency required. Cannot access property during 1-year redemption.",
    scoreWhy: "Decent inventory in Nashville and Memphis but Chancery Court involvement adds costs and time.",
    note: "Tennessee is a redeemable deed state with 2-year delinquency requirement and 1-year redemption after purchase. Chancery Court process requires attorney participation. Unsold properties go to county surplus sales. Statute: TCA §67-5-2401.",
    auctionSignup: {
      platform: "County Chancery Court (in-person) — Nashville uses online platform",
      steps: [
        "Hire a local Tennessee attorney familiar with Chancery Court deed sales before attending any auction",
        "Find your target county's Chancery Court schedule at tncourts.gov",
        "Register per Chancery Court instructions",
        "Nashville (Davidson County) has an online component — check nashville.gov for details"
      ],
      depositInfo: "Varies by county. Attorney required.",
      directLink: "https://www.tn.gov/revenue/taxes/property-tax.html"
    },
    beginnerTip: "Budget $2,000–$4,000 for attorney costs before your first TN purchase. Davidson (Nashville) and Shelby (Memphis) counties have the best inventory but also the most competition.",
    otc: { available: false, note: "Check county surplus sale listings for post-auction direct purchase opportunities." },
    risks: [
      "Cannot rent or access property during 1-year redemption window",
      "Attorney required for Chancery Court process",
      "2-year delinquency threshold must be verified before bidding"
    ],
    ddExtra: [
      "Verify the 2-year delinquency threshold has been met",
      "Hire a local attorney before attending — non-negotiable in Tennessee",
      "Check county surplus sale list for properties that didn't sell at Chancery Court auction"
    ],
    platforms: ["County Chancery Court offices"],
    counties: [
      { name: "Davidson", link: "https://www.nashville.gov/departments/trustee", notes: "Nashville. Best inventory in TN." },
      { name: "Shelby", link: "https://www.shelbycountytn.gov/TrusteeIndex", notes: "Memphis. Good urban inventory." }
    ]
  },
  {
    id: "TX", name: "Texas", type: "hybrid", rate: "25% yr1 / 50% yr2 (penalty on redemption)", redemption: "180 days (commercial) / 2 years (homestead/ag)",
    score: 81, beginnerFriendly: true,
    scoreWhy: "Monthly statewide auctions every first Tuesday, massive deal flow, excellent struck-off OTC opportunities. One of the most active deed markets in the country.",
    note: "Texas is a redeemable deed state. Monthly auctions on the first Tuesday statewide. Investor gets deed at auction but owner can redeem. Redemption penalty: 25% year 1, 50% year 2, calculated on full auction price — not just back taxes. Commercial: 180-day redemption. Homestead/agricultural: 2 years. Struck-off properties often skip redemption entirely. Statute: TX Tax Code §34.21.",
    auctionSignup: {
      platform: "RealAuction.com or GovEase.com (varies by county) + county courthouse",
      steps: [
        "Find your target county's auction info — txdmv.gov for county directory",
        "Check if the county uses RealAuction.com or GovEase.com for online bidding",
        "Register on the platform and verify your identity (government ID + entity docs if LLC)",
        "Fund your account before the first Tuesday auction",
        "For struck-off properties: contact the county tax assessor-collector directly for OTC list"
      ],
      depositInfo: "Varies by county. Most require wire or cashier's check.",
      directLink: "https://reauction.com"
    },
    beginnerTip: "Start with struck-off properties — these are properties that didn't sell at auction and are available directly from the county with no redemption period in many cases. Contact the county tax assessor-collector and ask for the struck-off list. This is the best beginner entry into Texas.",
    otc: { available: true, note: "Struck-off properties available directly from county tax assessor-collector. Often no redemption period. Call the county and ask for the struck-off inventory list." },
    risks: [
      "Redemption penalty calculated on FULL auction price — overbidding is extremely expensive if redeemed",
      "Homestead and agricultural properties: 2-year redemption window",
      "Verify property type before bidding — homestead vs. commercial dramatically changes the redemption window"
    ],
    ddExtra: [
      "Verify property type (homestead, commercial, agricultural) before bidding — determines redemption window",
      "Contact county tax assessor-collector for struck-off list before attending auction",
      "Check for active IRS liens — these survive Texas tax deed sales"
    ],
    platforms: ["RealAuction.com", "GovEase.com", "County tax assessor-collector offices"],
    counties: [
      { name: "Harris", link: "https://www.hctax.net/", notes: "Houston. Massive inventory. Online bidding." },
      { name: "Dallas", link: "https://www.dallascounty.org/departments/dallascounty/taxoffice.php", notes: "Dallas. Strong urban inventory." },
      { name: "Tarrant", link: "https://www.tarrantcounty.com/en/tax.html", notes: "Fort Worth. Good inventory." },
      { name: "Bexar", link: "https://www.bexar.org/218/Tax-Assessor-Collector", notes: "San Antonio. Good inventory." }
    ]
  },
  {
    id: "UT", name: "Utah", type: "deed", rate: "N/A", redemption: "4 years",
    score: 44, beginnerFriendly: false,
    notBeginnerReason: "All counties auction same day in May, 4-year redemption period, separate registration per county required.",
    scoreWhy: "Statewide same-day auctions simplify planning but 4-year redemption and no central platform require county-by-county coordination.",
    note: "Utah holds all county tax deed auctions on the same day each May. Each county registers separately — no statewide system. Sheriff sale option also available. Limited urban inventory outside Salt Lake City. Statute: UCA §59-2-1351.1.",
    auctionSignup: {
      platform: "County treasurer (each county registers separately)",
      steps: [
        "Find your target county treasurer at utah.gov/government/counties.html",
        "Contact each target county separately — no statewide registration system",
        "Request the property list 60 days before the May auction",
        "Attend in-person — most Utah counties do not offer online bidding"
      ],
      depositInfo: "Varies by county. Confirm with each county treasurer separately.",
      directLink: "https://propertytax.utah.gov/"
    },
    beginnerTip: "Salt Lake and Utah counties have the best inventory. Contact each county treasurer separately in March — by April, the list of remaining properties after owner payments shrinks significantly.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "4-year redemption — long capital commitment",
      "Separate registration for each county — time-intensive",
      "Limited urban inventory outside Wasatch Front"
    ],
    ddExtra: [
      "Register with each target county separately at least 30 days before May auction",
      "Confirm the exact May auction date — it can vary by a few days",
      "Review the delinquent list in April for remaining properties after owner payments"
    ],
    platforms: ["County treasurer offices"],
    counties: [
      { name: "Salt Lake", link: "https://slco.org/treasurer/", notes: "Best inventory in UT." },
      { name: "Utah", link: "https://www.utahcounty.gov/dept/Treas/", notes: "Provo area. Good inventory." }
    ]
  },
  {
    id: "VT", name: "Vermont", type: "lien", rate: "12%", redemption: "1 year",
    score: 17, beginnerFriendly: false,
    notBeginnerReason: "Extremely rare municipal sales, virtually no inventory. Not a viable market.",
    scoreWhy: "12% rate on paper but almost no sales ever happen. Most investors never find an available lien in Vermont.",
    note: "Vermont municipalities can sell tax liens but rarely do. Sales are extremely rare. Overbid is NOT returned and does NOT earn interest — bid only at tax value. Statute: VT Stat Title 32 Ch.133.",
    auctionSignup: {
      platform: "Municipal tax collector (extremely rare)",
      steps: [
        "Monitor Vermont municipal meeting minutes — sales are announced here when they occur",
        "Contact town clerks in Burlington, Rutland, and Essex for any upcoming sales",
        "Register per municipality instructions if a sale is confirmed",
        "Remember: overbid is not returned and earns no interest — bid at or below tax owed"
      ],
      depositInfo: "Varies.",
      directLink: "https://tax.vermont.gov/property-owners/property-tax"
    },
    beginnerTip: "Vermont is not a viable market. Do not plan a strategy around it.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "Sales are extremely rare — most investors never find one",
      "Overbid is not returned and earns no interest — critical to understand before bidding",
      "No centralized system"
    ],
    ddExtra: [
      "If you find a sale, bid only at the tax value — overbid is never returned",
      "Verify the municipality intends to proceed — many announce sales and cancel"
    ],
    platforms: ["Municipal tax collector offices"],
    counties: []
  },
  {
    id: "VA", name: "Virginia", type: "deed", rate: "N/A", redemption: "None (3-year delinquency required before sale)",
    score: 53, beginnerFriendly: false,
    notBeginnerReason: "3-year delinquency required, judicial sale process, each locality manages independently — slow and complex.",
    scoreWhy: "Good inventory in Northern Virginia but 3-year delinquency requirement and judicial sale process add significant time and cost.",
    note: "Virginia requires 3 years of delinquency before a judicial sale with oral upset bids. Each locality (city or county) manages independently — no statewide calendar. Northern Virginia has strong high-value inventory. Statute: VA Code §58.1-3965.",
    auctionSignup: {
      platform: "Circuit Court or Treasurer (locality-specific)",
      steps: [
        "Identify your target locality at virginia.gov/agencies/local-government",
        "Contact the local treasurer or circuit court — ask when the next judicial sale is scheduled",
        "Hire a local Virginia attorney for the judicial sale process — highly recommended",
        "Register per the court's instructions and attend in person"
      ],
      depositInfo: "Varies by locality. Attorney costs add $1,500–$3,500.",
      directLink: "https://www.tax.virginia.gov/property-tax"
    },
    beginnerTip: "Focus on localities with consistent judicial sale schedules — Prince William, Henrico, and Chesterfield have regular activity. Budget for attorney costs upfront.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "3-year delinquency must be verified before pursuing",
      "Judicial sale process adds attorney costs and time",
      "Each locality manages independently — no unified schedule"
    ],
    ddExtra: [
      "Verify the 3-year delinquency threshold has been met",
      "Hire a Virginia-licensed attorney familiar with judicial tax sales",
      "Confirm no IRS or federal liens — these survive Virginia tax sales"
    ],
    platforms: ["Circuit Court offices", "Local treasurer offices"],
    counties: [
      { name: "Prince William", link: "https://www.pwcgov.org/government/dept/finance/Pages/Treasurer.aspx", notes: "Northern VA. Good inventory." },
      { name: "Henrico", link: "https://www.henrico.us/services/finance/", notes: "Richmond area. Consistent sales." }
    ]
  },
  {
    id: "WA", name: "Washington", type: "deed", rate: "N/A", redemption: "3 years delinquency + county hold",
    score: 56, beginnerFriendly: false,
    notBeginnerReason: "3-year delinquency plus county hold period. Auction windows in April and November. Tenant-friendly state.",
    scoreWhy: "Decent inventory in King (Seattle) and Pierce counties with Bid4Assets access, but long cycle and tenant protections require experience.",
    note: "Washington counties hold deed auctions in April and November. King, Pierce, and Snohomish use Bid4Assets. Tax title properties available for direct purchase. 3-year delinquency required before auction. Statute: RCW §84.64.",
    auctionSignup: {
      platform: "Bid4Assets.com (King, Pierce, Snohomish) + county-specific others",
      steps: [
        "For King, Pierce, Snohomish: go to bid4assets.com and search Washington state",
        "Create a Bid4Assets account and verify identity",
        "Submit deposit and register for the April or November auction",
        "For tax title properties: contact the county assessor directly for direct purchase list"
      ],
      depositInfo: "Bid4Assets deposit: $500–$2,000. Varies by county.",
      directLink: "https://www.bid4assets.com/taxsales/washington"
    },
    beginnerTip: "Tax title properties (available from the county assessor after the regular auction cycle) are your best beginner entry in Washington. Less competition than the regular auction, and often available at discounted prices.",
    otc: { available: true, note: "Tax title properties available for direct purchase from county assessor. Contact King County Assessor's office for current list." },
    risks: [
      "Strong tenant protections — eviction can take 12+ months in King County",
      "Long cycle before auctions",
      "King County: strong competition from institutional buyers"
    ],
    ddExtra: [
      "Verify the county's judicial foreclosure schedule and deed sale timing",
      "Check King County GIS for zoning designation before bidding",
      "Verify no IRS liens — federal liens survive Washington tax sales"
    ],
    platforms: ["Bid4Assets.com", "County assessor offices"],
    counties: [
      { name: "King", link: "https://kingcounty.gov/depts/assessor.aspx", notes: "Seattle. Best inventory. Institutional competition." },
      { name: "Pierce", link: "https://www.piercecountywa.gov/399/Assessor-Treasurer", notes: "Tacoma. Good inventory." }
    ]
  },
  {
    id: "WV", name: "West Virginia", type: "hybrid", rate: "12%", redemption: "18 months",
    score: 48, beginnerFriendly: false,
    notBeginnerReason: "Often misquoted as 12-month redemption — it's actually 18 months. Mineral rights commonly separated. Complex title history.",
    scoreWhy: "12% rate with hybrid lien-to-deed path managed by the State Auditor. Strong for patient investors who understand the mineral rights landscape.",
    note: "West Virginia State Auditor manages delinquent land sales. Annual lien sales October 14–November 23 by county sheriff. Unredeemed liens after 18 months → deed sales as needed. Certificate is assignable. Statute: WV Code 11A Art.3.",
    auctionSignup: {
      platform: "County sheriff (in-person, October–November)",
      steps: [
        "Find your target county sheriff at wv.gov/government/counties.aspx",
        "Contact the sheriff's office in September to confirm the sale schedule and property list",
        "Register in person for the October–November auction window",
        "Note: the lien certificate you receive is assignable — you can transfer it"
      ],
      depositInfo: "Varies by county. Confirm with county sheriff.",
      directLink: "https://tax.wv.gov/Property/SaleOfLands/Pages/SaleOfLands.aspx"
    },
    beginnerTip: "Confirm the 18-month redemption period before planning your deed execution. Many investors incorrectly plan for 12 months and are caught off guard. Also check for separated mineral rights on any rural WV parcel — they're extremely common.",
    otc: { available: false, note: "No OTC. Check WV State Auditor's delinquent land list for additional opportunities." },
    risks: [
      "Redemption period is 18 months — commonly misquoted as 12 months",
      "Separated mineral rights are common on rural WV parcels — affects land value significantly",
      "Title issues on deed sale properties are common — quiet title may be required"
    ],
    ddExtra: [
      "Confirm the exact redemption expiration date — 18 months, not 12",
      "Check the WV State Auditor's delinquent land list for additional inventory",
      "Verify mineral rights status — separated rights are very common in WV"
    ],
    platforms: ["County sheriff offices", "WV State Auditor"],
    counties: []
  },
  {
    id: "WI", name: "Wisconsin", type: "deed", rate: "N/A", redemption: "2 years",
    score: 45, beginnerFriendly: false,
    notBeginnerReason: "2-year redemption, limited centralized platform, and county-by-county coordination required.",
    scoreWhy: "Decent inventory in Milwaukee and Dane counties but 2-year cycle and limited online infrastructure require patience.",
    note: "Wisconsin counties sell tax deeds after 2-year tax certificate. Milwaukee and Dane have best inventory. Online infrastructure is growing but limited. Some counties use land banks. Statute: WS §74.57.",
    auctionSignup: {
      platform: "County treasurer (varies — Milwaukee uses online system)",
      steps: [
        "Find your target county treasurer at wi.gov/government/counties",
        "Contact the treasurer to confirm the delinquency threshold and upcoming sale schedule",
        "Milwaukee County has online auction capabilities — check milwaukee.county.gov/treasurer",
        "Register per county instructions"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://www.revenue.wi.gov/Pages/FAQS/ise-propertytax.aspx"
    },
    beginnerTip: "Milwaukee and Dane (Madison) counties have the best WI inventory. Contact the Milwaukee County Treasurer specifically — they have the most organized auction process in the state.",
    otc: { available: false, note: "Check county land bank for properties not in public auction." },
    risks: [
      "2-year cycle before auction",
      "No statewide online platform",
      "Some counties use land banks rather than public auctions"
    ],
    ddExtra: [
      "Contact the county treasurer to confirm the 2-year delinquency threshold has passed",
      "Check the Milwaukee County Land Records System for upcoming actions",
      "Verify whether the county plans to auction vs. use a land bank for specific parcels"
    ],
    platforms: ["County treasurer offices"],
    counties: [
      { name: "Milwaukee", link: "https://county.milwaukee.gov/EN/Treasurer", notes: "Best inventory in WI. Online capable." },
      { name: "Dane", link: "https://www.countyofdane.com/treasurer", notes: "Madison area. Good inventory." }
    ]
  },
  {
    id: "WY", name: "Wyoming", type: "lien", rate: "15%", redemption: "4 years",
    score: 32, beginnerFriendly: false, llcFriendly: true,
    notBeginnerReason: "4-year redemption, limited inventory, November-only auctions, and primarily rural energy/agricultural land.",
    scoreWhy: "15% rate but 4-year redemption and limited inventory dominated by energy-sector land make this impractical for most strategies.",
    note: "Wyoming holds annual tax lien sales in November. 4-year redemption. Inventory dominated by energy sector and agricultural land. Statute: WS §39-13-108.",
    auctionSignup: {
      platform: "County treasurer (in-person, November)",
      steps: [
        "Find your target county treasurer at wyoming.gov/government/counties",
        "Contact the treasurer in September to confirm the November sale schedule",
        "Request the property list",
        "Register in person — most WY counties do not have online bidding"
      ],
      depositInfo: "Varies by county.",
      directLink: "https://revenue.wyo.gov/property-tax"
    },
    beginnerTip: "Laramie and Natrona counties have the best WY inventory. The 4-year redemption makes Wyoming a very long-term play — not recommended unless you understand the energy land market.",
    otc: { available: false, note: "No OTC program." },
    risks: [
      "4-year redemption — among the longest in lien states",
      "Energy sector land has specialized valuation considerations",
      "November-only auctions limit timing"
    ],
    ddExtra: [
      "Verify mineral rights status — commonly separated from surface rights in Wyoming",
      "Calculate opportunity cost over 4-year holding period",
      "Confirm the November sale date with the county treasurer by October"
    ],
    platforms: ["County treasurer offices"],
    counties: []
  }
];

if (typeof module !== 'undefined') module.exports = STATES_EN;
