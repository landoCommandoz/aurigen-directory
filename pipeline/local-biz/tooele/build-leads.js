// Tooele County lead list — compiled 2026-08-08 from web research (no Places API key yet).
// Every business was verified to have NO dedicated website; phone numbers came from
// live directory listings (Yelp, YP, BBB, Birdeye, Facebook, Yahoo Local).
// Run: node tooele/build-leads.js  -> overwrites ../leads.csv in pipeline schema.

const path = require('path');
const { writeCSV } = require(path.join(__dirname, '..', 'csv-utils'));

const LEADS = [
  // ---- AUTO / OUTDOOR ----
  {
    business_name: "Pete's Auto Repair & Diesel",
    phone: '(435) 882-4014',
    address: '46 E 500 N, Tooele, UT 84074, USA',
    category: 'auto repair',
    rating: '4.1', review_count: '84',
    reviews: [
      { author: 'Jolene', rating: 5, text: 'Best in town. Pete cares', time: '' },
      { author: 'Heidi', rating: 5, text: 'They took responsibility for and corrected an error with my vehicle...no trying to get out of it', time: '' },
      { author: 'Sandy', rating: 5, text: 'Honest, reliable and great bunch of people!', time: '' }
    ],
    hours: ['Monday: 8:30 AM – 6:00 PM', 'Tuesday: 8:30 AM – 6:00 PM', 'Wednesday: 8:30 AM – 6:00 PM', 'Thursday: 8:30 AM – 6:00 PM', 'Friday: 8:30 AM – 6:00 PM', 'Saturday: Closed', 'Sunday: Closed'],
    notes: 'Only FB/Yelp/YP/BBB listings; no owned domain.'
  },
  {
    business_name: 'Cruz Auto',
    phone: '(435) 882-8584',
    address: '89 N Garden St, Tooele, UT 84074, USA',
    category: 'auto repair',
    rating: '4.7', review_count: '36',
    reviews: [
      { author: 'Mossscar', rating: 5, text: 'Quick efficient and very helpful', time: '' },
      { author: 'Jared', rating: 5, text: "By far the best mechanic I've ever dealt with...The service was fast, the price was unbelievable", time: '' }
    ],
    hours: ['Monday: 8:00 AM – 5:00 PM', 'Tuesday: 8:00 AM – 5:00 PM', 'Wednesday: 8:00 AM – 5:00 PM', 'Thursday: 8:00 AM – 5:00 PM', 'Friday: 8:00 AM – 5:00 PM', 'Saturday: Closed', 'Sunday: Closed'],
    notes: 'VERIFY FIRST: Birdeye says permanently closed, BBB and Yelp (June 2026) say open. Confirm they are open before pitching. Re-verified no website 2026-08-08.'
  },
  {
    business_name: 'Five Star Auto',
    phone: '(435) 884-3573',
    address: '53 N Hale St, Grantsville, UT 84029, USA',
    category: 'auto repair',
    rating: '4.9', review_count: '241',
    reviews: [
      { author: 'Jake', rating: 5, text: "Dominic is the man. if I cant fix it. I know he can! boats, cars, lawnmowers anything.", time: '' },
      { author: 'EJ', rating: 5, text: "They're the best to work with! Fast, friendly and efficient. They're local and really care about their customers.", time: '' },
      { author: 'Tori', rating: 5, text: "100% worth the couple minutes extra drive from Sandy to Grantsville....the money you save because it's done right the first time is worth its weight in gold!", time: '' }
    ],
    hours: ['Monday: 9:00 AM – 5:00 PM', 'Tuesday: 9:00 AM – 5:00 PM', 'Wednesday: 9:00 AM – 5:00 PM', 'Thursday: 9:00 AM – 5:00 PM', 'Friday: 9:00 AM – 5:00 PM', 'Saturday: Closed', 'Sunday: Closed'],
    notes: 'In business since 1999. Re-verified 2026-08-08: no site on BBB or MechanicAdvisor. Possible second location at 54 E Main St.'
  },
  {
    business_name: 'Dakota Towing',
    phone: '(435) 228-8156',
    address: '11 N 1100 W, Tooele, UT 84074, USA',
    category: 'towing',
    rating: '', review_count: '27',
    reviews: [
      { author: 'Customer', rating: 5, text: 'Over and beyond should be the name', time: '' }
    ],
    hours: ['Monday-Sunday: Open 24 hours'],
    notes: 'Facebook 98% recommend. 24-hour service.'
  },
  {
    business_name: 'Affordable Lawn Care of Tooele LLC',
    phone: '(435) 882-3990',
    address: '1010 W Vine St, Tooele, UT 84074, USA',
    category: 'landscaping',
    rating: '4.3', review_count: '',
    reviews: [],
    hours: [],
    notes: 'Serving Tooele County since 1999. Address differs across directories (10 vs 1010 W Vine St) - confirm on call.'
  },
  {
    business_name: 'Baxter Tree Service',
    phone: '(801) 830-0483',
    address: '364 S 100 W, Tooele, UT 84074, USA',
    category: 'tree service',
    rating: '', review_count: '11',
    reviews: [],
    hours: [],
    notes: 'In business since 1996. Facebook 100% recommend.'
  },
  {
    business_name: 'True Clean Carpet Cleaning LLC',
    phone: '(385) 787-9963',
    address: 'Tooele, UT 84074, USA',
    category: 'carpet cleaning',
    rating: '', review_count: '9',
    reviews: [
      { author: 'Customer', rating: 5, text: 'Candace did an AMAZING job on our carpets, they went from dead to alive looking brand new.', time: '' },
      { author: 'Customer', rating: 5, text: 'Candace was very responsive and prompt. I would highly recommend her anytime.', time: '' }
    ],
    hours: [],
    notes: 'Woman-owned solo operator (Candace). Mobile service, no storefront.'
  },
  {
    business_name: 'Tooele Valley House Cleaning',
    phone: '(208) 680-5037',
    address: 'Tooele, UT, USA',
    category: 'house cleaning',
    rating: '', review_count: '',
    reviews: [],
    hours: [],
    notes: 'Facebook page only.'
  },

  // ---- SERVICES / FOOD ----
  {
    business_name: 'Stay Classic Barbershop',
    phone: '(435) 850-1496',
    address: '18 N Main St, Tooele, UT 84074, USA',
    category: 'barber shop',
    rating: '', review_count: '104',
    reviews: [],
    hours: ['Tuesday: 10:00 AM – 6:00 PM', 'Wednesday: 10:00 AM – 8:00 PM', 'Thursday: 10:00 AM – 8:00 PM', 'Friday: 10:00 AM – 6:00 PM', 'Saturday: 9:00 AM – 3:00 PM', 'Sunday: Closed', 'Monday: Closed'],
    notes: 'ANGLE: their old site stayclassicbarbershop.com is DEAD (does not load) and they only book through Square. Say: your old website does not even come up anymore.'
  },
  // CUT 2026-08-08: Black Cat Barber Company HAS a website (blackcatbarber.co, verified).
  {
    business_name: "Niemi's Barbershop",
    phone: '(435) 249-7256',
    address: '85 N Main St, Tooele, UT 84074, USA',
    category: 'barber shop',
    rating: '', review_count: '',
    reviews: [],
    hours: ['Tuesday: 9:30 AM – 7:00 PM', 'Wednesday: 9:30 AM – 7:00 PM', 'Thursday: 9:30 AM – 7:00 PM', 'Friday: 9:30 AM – 7:00 PM', 'Saturday: 9:30 AM – 7:00 PM', 'Sunday: Closed', 'Monday: Closed'],
    notes: 'Historic Main Street shop, open since 2011. Barely any web presence at all.'
  },
  {
    business_name: 'Ivy Nails',
    phone: '(435) 882-9915',
    address: '1189 N Main St, Tooele, UT 84074, USA',
    category: 'nail salon',
    rating: '3.8', review_count: '201',
    reviews: [
      { author: 'Molly', rating: 5, text: 'I love these ladies, especially Amy. She is so sweet and can literally duplicate anything you find on the internet.', time: '' }
    ],
    hours: ['Monday: 9:30 AM – 7:00 PM', 'Tuesday: 9:30 AM – 7:00 PM', 'Wednesday: 9:30 AM – 7:00 PM', 'Thursday: 9:30 AM – 7:00 PM', 'Friday: 9:30 AM – 7:00 PM', 'Saturday: 9:30 AM – 6:00 PM', 'Sunday: Closed'],
    notes: 'Books through Fresha/Booksy; no owned site.'
  },
  {
    business_name: 'El Green Burrito',
    phone: '(435) 882-5031',
    address: '162 N Main St, Tooele, UT 84074, USA',
    category: 'restaurant',
    rating: '4.5', review_count: '562',
    reviews: [],
    hours: ['Monday: 10:00 AM – 9:00 PM', 'Tuesday: 10:00 AM – 9:00 PM', 'Wednesday: 10:00 AM – 9:00 PM', 'Thursday: 10:00 AM – 9:00 PM', 'Friday: 10:00 AM – 9:00 PM', 'Saturday: 10:00 AM – 9:00 PM', 'Sunday: 10:00 AM – 8:00 PM'],
    notes: 'Re-verified 2026-08-08: Facebook only. A Google reviewer publicly wished they had an actual website. Use that on the call.'
  },
  {
    business_name: 'Hometown Bakery & Grocery',
    phone: '(435) 882-0874',
    address: '99 N Broadway St, Tooele, UT 84074, USA',
    category: 'bakery',
    rating: '', review_count: '16',
    reviews: [
      { author: 'Customer', rating: 5, text: "Love this place been going here for the mannys special for over 20 years best sandwiches and hot links", time: '' },
      { author: 'Customer', rating: 5, text: "Order a sandwich, you won't regret it they're amazing. The staff is also very friendly.", time: '' },
      { author: 'Customer', rating: 5, text: 'Historic small grocer and bakery. I recommend you grab a hot link here', time: '' }
    ],
    hours: ['Monday: 8:00 AM – 10:00 PM', 'Tuesday: 8:00 AM – 10:00 PM', 'Wednesday: 8:00 AM – 10:00 PM', 'Thursday: 8:00 AM – 10:00 PM', 'Friday: 8:00 AM – 10:00 PM', 'Saturday: 8:00 AM – 10:00 PM', 'Sunday: 8:00 AM – 10:00 PM'],
    notes: 'Historic local institution, Facebook 100% recommend, open 7 days.'
  },
  {
    business_name: "Begay's Navajo Tacos",
    phone: '(435) 830-7824',
    address: 'Grantsville, UT 84029, USA',
    category: 'food truck',
    rating: '', review_count: '',
    reviews: [],
    hours: [],
    notes: 'Food truck; presence is Facebook + Instagram only.'
  },
  {
    business_name: 'JR Roofing & Construction',
    phone: '(801) 706-1677',
    address: 'Grantsville, UT 84029, USA',
    category: 'roofing',
    rating: '', review_count: '',
    reviews: [],
    hours: [],
    notes: '20+ years experience, formerly Jackson Roofing. FB + KSL Classifieds only.'
  },
  {
    business_name: 'Russell Welding Corporation',
    phone: '(435) 882-6359',
    address: '1665 Progress Way, Tooele, UT 84074, USA',
    category: 'welding',
    rating: '4.6', review_count: '11',
    reviews: [
      { author: 'Carie', rating: 5, text: 'My dad brought down a project and this company was amazing!!!!! Great customer service!!!!!', time: '' },
      { author: 'Customer', rating: 5, text: 'High quality work at a reasonable price. Would highly recommend.', time: '' }
    ],
    hours: ['Monday: 8:00 AM – 5:00 PM', 'Tuesday: 8:00 AM – 5:00 PM', 'Wednesday: 8:00 AM – 5:00 PM', 'Thursday: 8:00 AM – 5:00 PM', 'Friday: 8:00 AM – 5:00 PM', 'Saturday: Closed', 'Sunday: Closed'],
    notes: 'Founded 1982. ANGLE: their old site russellweldingcorp.com is DEAD (does not load). Say: your old website is gone, I can have a new one up this week.'
  },
  {
    business_name: "Pete's Service Shop",
    phone: '(435) 882-4614',
    address: '548 S 50 W, Tooele, UT 84074, USA',
    category: 'appliance repair',
    rating: '', review_count: '',
    reviews: [
      { author: 'Customer', rating: 5, text: 'Honest and fast.', time: '' }
    ],
    hours: [],
    notes: 'Dryer, stove, oven, ice maker, vacuum repair.'
  },

  // ---- HOME TRADES ----
  {
    business_name: 'A PM Plumber',
    phone: '(435) 840-2525',
    address: '797 Valley View Dr, Tooele, UT 84074, USA',
    category: 'plumber',
    rating: '', review_count: '',
    reviews: [
      { author: 'Patrick', rating: 5, text: 'Referred Devan Lawson at PM Plumber - friendly, does good work, is not expensive, and works evenings.', time: '' }
    ],
    hours: [],
    notes: 'Works evenings - good differentiator for the site.'
  },
  {
    business_name: 'R & B Plumbing',
    phone: '(435) 882-2857',
    address: '427 Noble Rd, Tooele, UT 84074, USA',
    category: 'plumber',
    rating: '', review_count: '',
    reviews: [],
    hours: [],
    notes: 'FB page + directory listings only.'
  },
  {
    business_name: 'Hometown Plumbing LLC',
    phone: '(435) 830-8748',
    address: '762 Ericson Rd, Tooele, UT 84074, USA',
    category: 'plumber',
    rating: '4.7', review_count: '16',
    reviews: [
      { author: 'Carina', rating: 5, text: 'Honest, Courteous and Professional... prompt, thorough, friendly, professional', time: '' }
    ],
    hours: ['Monday: 9:00 AM – 5:00 PM', 'Tuesday: 9:00 AM – 5:00 PM', 'Wednesday: 9:00 AM – 5:00 PM', 'Thursday: 9:00 AM – 5:00 PM', 'Friday: 9:00 AM – 5:00 PM', 'Saturday: 9:00 AM – 5:00 PM', 'Sunday: Closed'],
    notes: 'Best plumber lead: 4.7 stars, 16 reviews, open Saturdays.'
  },
  {
    business_name: 'Bulldog Plumbing and Handy Service',
    phone: '(801) 209-1993',
    address: 'Tooele, UT 84074, USA',
    category: 'plumber',
    rating: '3.0', review_count: '2',
    reviews: [
      { author: 'Michael', rating: 5, text: 'Mike is honest, fair, and first class in providing quality...', time: '' }
    ],
    hours: [],
    notes: 'Low rating (3.0/2 reviews) - lower priority call.'
  },
  // CUT 2026-08-08: Scotty's Heating HAS a website (scottysheating.com, bare template but live).
  // CUT 2026-08-08: K2 HVAC HAS a Thryv-hosted mini-site (k2hvac.localsearch.com via their YP listing).
  {
    business_name: 'Beyond Connected LLC',
    phone: '(435) 840-4980',
    address: '794 E 890 N, Tooele, UT 84074, USA',
    category: 'electrician',
    rating: '5.0', review_count: '1',
    reviews: [
      { author: 'Jed', rating: 5, text: 'Professional, affordable, on time and communication is amazing! Will definitely be using again!', time: '' }
    ],
    hours: ['Monday: 9:00 AM – 5:00 PM', 'Tuesday: 9:00 AM – 5:00 PM', 'Wednesday: 9:00 AM – 5:00 PM', 'Thursday: 9:00 AM – 5:00 PM', 'Friday: 9:00 AM – 5:00 PM', 'Saturday: Closed', 'Sunday: Closed'],
    notes: 'Est. 2017. Smart home / custom lighting specialty - great site angle.'
  },
  {
    business_name: 'N&J Handyman Services',
    phone: '(801) 919-5108',
    address: 'Tooele, UT, USA',
    category: 'handyman',
    rating: '5.0', review_count: '',
    reviews: [
      { author: 'Customer', rating: 5, text: 'N and J handyman services is a lifesaver. Jerry was quick, precise, knowledgeable, clean, and on...', time: '' }
    ],
    hours: [],
    notes: 'Yelp profile only.'
  },
  {
    business_name: 'JDI Handyman',
    phone: '(435) 241-9752',
    address: 'Tooele, UT 84074, USA',
    category: 'handyman',
    rating: '', review_count: '',
    reviews: [],
    hours: ['Monday: 5:00 AM – 8:00 PM', 'Tuesday: 5:00 AM – 8:00 PM', 'Wednesday: 5:00 AM – 8:00 PM', 'Thursday: 5:00 AM – 8:00 PM', 'Friday: 5:00 AM – 8:00 PM', 'Saturday: 6:00 AM – 9:00 PM', 'Sunday: 6:00 AM – 9:00 PM'],
    notes: 'Their jdihandyman.net domain is dead (does not resolve) - easy talking point. Email JDIHandymanlc@gmail.com.'
  },
  {
    business_name: 'Go Forty Handyman',
    phone: '(801) 349-6333',
    address: '345 N Coleman St, Tooele, UT 84074, USA',
    category: 'handyman',
    rating: '', review_count: '',
    reviews: [],
    hours: [],
    notes: 'Drywall, doors, drip irrigation, gate welding. ASL proficient. Takes Venmo/PayPal/cards.'
  },
  {
    business_name: 'One Stop Builders',
    phone: '(562) 507-7661',
    address: '368 E Ventura Blvd, Stansbury Park, UT 84074, USA',
    category: 'general contractor',
    rating: '', review_count: '',
    reviews: [],
    hours: [],
    notes: 'Basements, bathrooms, kitchens, decks, custom homes. Houzz + FB + BBB only.'
  }
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

const rows = LEADS.map(l => ({
  business_name: l.business_name,
  address: l.address,
  phone: l.phone,
  category: l.category,
  place_id: 'web-tooele-' + slugify(l.business_name),
  rating: l.rating,
  review_count: l.review_count,
  photo_1: '', photo_2: '', photo_3: '',
  reviews_json: l.reviews.length ? JSON.stringify(l.reviews) : '',
  hours_json: l.hours.length ? JSON.stringify(l.hours) : '',
  price_level: '',
  google_maps_url: '',
  lat: '', lng: '',
  notes: l.notes || ''
}));

const columns = [
  'business_name', 'address', 'phone', 'category', 'place_id',
  'rating', 'review_count', 'photo_1', 'photo_2', 'photo_3',
  'reviews_json', 'hours_json', 'price_level', 'google_maps_url',
  'lat', 'lng', 'notes'
];

process.chdir(path.join(__dirname, '..'));
writeCSV('leads.csv', rows, columns);
console.log(`Wrote ${rows.length} Tooele County leads to leads.csv`);
