require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const { writeCSV, readCSV } = require('./csv-utils');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const MAX_LEADS = 20;
const SITES_DIR = path.join(__dirname, 'sites');

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// ---------------------------------------------------------------------------
// GOOGLE PLACES API
// ---------------------------------------------------------------------------

async function textSearch(query) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Text Search failed: ${res.status} ${res.statusText}`);
  const data = await res.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API error: ${data.status} - ${data.error_message || ''}`);
  }
  return data.results || [];
}

async function getPlaceDetails(placeId) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', [
    'name', 'formatted_address', 'formatted_phone_number',
    'rating', 'user_ratings_total', 'reviews', 'photos',
    'opening_hours', 'price_level', 'url', 'geometry',
    'website', 'types'
  ].join(','));
  url.searchParams.set('key', API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Details failed: ${res.status}`);
  const data = await res.json();

  if (data.status !== 'OK') {
    throw new Error(`Details error: ${data.status}`);
  }
  return data.result;
}

// ---------------------------------------------------------------------------
// PHOTO DOWNLOADER
// ---------------------------------------------------------------------------

async function downloadPhoto(photoRef, slug, index) {
  if (!photoRef) return null;
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = `${slug}-${index}.jpg`;
    fs.writeFileSync(path.join(SITES_DIR, filename), buffer);
    return filename;
  } catch (err) {
    console.warn(`    PHOTO SKIP: photo ${index}: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  const searchTerm = process.argv[2];
  const city = process.argv[3];

  if (!searchTerm || !city) {
    console.error('Usage: node scraper.js "<search term>" "<city state>"');
    console.error('Example: node scraper.js "plumber" "Salt Lake City UT"');
    process.exit(1);
  }

  if (!API_KEY) {
    console.error('Error: GOOGLE_PLACES_API_KEY not set. Add it to .env');
    process.exit(1);
  }

  fs.mkdirSync(SITES_DIR, { recursive: true });

  const query = `${searchTerm} in ${city}`;
  console.log(`Searching: "${query}"...`);

  let results;
  try {
    results = await textSearch(query);
  } catch (err) {
    console.error(`Search failed: ${err.message}`);
    process.exit(1);
  }

  console.log(`Found ${results.length} results. Checking for missing websites...`);

  const leads = [];

  for (const place of results) {
    if (leads.length >= MAX_LEADS) break;

    try {
      const details = await getPlaceDetails(place.place_id);

      if (details.website) {
        console.log(`  SKIP: ${details.name || place.name} (has website)`);
        continue;
      }

      const category = (details.types || place.types || [])
        .filter(t => !['point_of_interest', 'establishment'].includes(t))
        .map(t => t.replace(/_/g, ' '))
        .slice(0, 2)
        .join(', ') || searchTerm;

      const slug = slugify(details.name || place.name);

      // Download up to 3 photos
      const photoRefs = (details.photos || []).slice(0, 3).map(p => p.photo_reference);
      const localPhotos = [];

      if (photoRefs.length > 0) {
        console.log(`    Downloading ${photoRefs.length} photos...`);
        const results = await Promise.all(
          photoRefs.map((ref, i) => downloadPhoto(ref, slug, i + 1))
        );
        for (const f of results.filter(Boolean)) {
          localPhotos.push(f);
          console.log(`      SAVED: ${f}`);
        }
      }

      // Reviews (up to 5)
      const reviews = (details.reviews || []).slice(0, 5).map(r => ({
        author: r.author_name || 'Customer',
        rating: r.rating || 5,
        text: (r.text || '').slice(0, 300),
        time: r.relative_time_description || ''
      }));

      // Hours
      const hours = (details.opening_hours && details.opening_hours.weekday_text)
        ? details.opening_hours.weekday_text
        : [];

      // Coordinates
      const lat = details.geometry && details.geometry.location ? String(details.geometry.location.lat) : '';
      const lng = details.geometry && details.geometry.location ? String(details.geometry.location.lng) : '';

      leads.push({
        business_name: details.name || place.name,
        address: details.formatted_address || place.formatted_address || '',
        phone: details.formatted_phone_number || '',
        category: category,
        place_id: place.place_id,
        rating: String(details.rating || ''),
        review_count: String(details.user_ratings_total || ''),
        photo_1: localPhotos[0] || '',
        photo_2: localPhotos[1] || '',
        photo_3: localPhotos[2] || '',
        reviews_json: reviews.length > 0 ? JSON.stringify(reviews) : '',
        hours_json: hours.length > 0 ? JSON.stringify(hours) : '',
        price_level: String(details.price_level || ''),
        google_maps_url: details.url || '',
        lat: lat,
        lng: lng
      });

      console.log(`  LEAD: ${details.name || place.name} (${details.rating ? details.rating + ' stars' : 'no rating'}, ${localPhotos.length} photos, ${reviews.length} reviews)`);
    } catch (err) {
      console.warn(`  ERROR on ${place.name}: ${err.message} - skipping`);
    }
  }

  if (leads.length === 0) {
    console.log('No leads found (all businesses have websites).');
    return;
  }

  const columns = [
    'business_name', 'address', 'phone', 'category', 'place_id',
    'rating', 'review_count',
    'photo_1', 'photo_2', 'photo_3',
    'reviews_json', 'hours_json',
    'price_level', 'google_maps_url', 'lat', 'lng'
  ];

  // Preserve existing rows
  const existing = readCSV('leads.csv');
  const existingIds = new Set(existing.map(r => r.place_id));
  const newLeads = leads.filter(l => !existingIds.has(l.place_id));
  const allRows = [...existing, ...newLeads];

  const allColumns = [...new Set([...columns, ...Object.keys(allRows[0] || {})])];
  writeCSV('leads.csv', allRows, allColumns);

  console.log(`\nWrote ${newLeads.length} new leads (${allRows.length} total) to leads.csv`);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
