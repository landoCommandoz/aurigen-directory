require('dotenv').config({ path: __dirname + '/.env' });

const { readCSV, writeCSV } = require('./csv-utils');

function generateEmail(row) {
  const name = row.business_name;
  const url = row.live_url;
  // Take the last item before any comma: "general contractor, plumber" -> "plumber"
  const rawCategory = (row.category || 'services').split(',').pop().trim().toLowerCase();
  const category = rawCategory || 'services';

  // Address format: "165 Gregson Ave S, Salt Lake City, UT 84115, USA"
  // City is the second-to-last segment before "STATE ZIP" and "USA/Country"
  const parts = (row.address || '').split(',').map(s => s.trim());
  let city = 'your area';
  if (parts.length >= 3) {
    // Work backwards: last is country (USA), second-to-last is "UT 84115", third-to-last is city
    const candidate = parts[parts.length - 3];
    if (candidate && !/^\d/.test(candidate)) {
      city = candidate;
    }
  }

  const subject = `I built ${name} a website`;

  const body = `Hey,

I was looking for a ${category} in ${city} and noticed ${name} didn't have a website. So I built one.

Take a look: ${url}

If you want to keep it live, it's $99/month. I handle everything. Cancel anytime.

Landon`;

  return { subject, body };
}

async function main() {
  const rows = readCSV('leads.csv');

  if (rows.length === 0) {
    console.log('No leads found. Run the earlier scripts first.');
    return;
  }

  const emails = [];

  for (const row of rows) {
    if (!row.live_url) {
      console.log(`SKIP: ${row.business_name} (no live_url, run deployer.js)`);
      continue;
    }

    try {
      const { subject, body } = generateEmail(row);

      emails.push({
        business_name: row.business_name,
        email_subject: subject,
        email_body: body,
        live_url: row.live_url
      });

      console.log(`EMAIL: ${row.business_name} - "${subject}"`);
    } catch (err) {
      console.warn(`ERROR: ${row.business_name} - ${err.message} - skipping`);
    }
  }

  if (emails.length === 0) {
    console.log('No emails to generate. Ensure deployer.js has run first.');
    return;
  }

  const columns = ['business_name', 'email_subject', 'email_body', 'live_url'];
  writeCSV('emails.csv', emails, columns);
  console.log(`\nWrote ${emails.length} emails to emails.csv`);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
