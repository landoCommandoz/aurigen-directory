require('dotenv').config({ path: __dirname + '/.env' });

const { readCSV, writeCSV } = require('./csv-utils');

function generateEmail(row) {
  const name = row.business_name;
  const url = row.live_url;

  const subject = `I built ${name} a website — take a look`;

  const body = `Hi there,

I came across ${name} and noticed you don't have a website yet, so I went ahead and built one for you. No strings attached — just wanted to show you what's possible.

Take a look: ${url}

If you like it, I can keep it live and maintained for $99/month. Cancel anytime. If not, no worries at all.

Either way, hope it's useful.

— Landon Brewington`;

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
      console.log(`SKIP: ${row.business_name} (no live_url — run deployer.js)`);
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

      console.log(`EMAIL: ${row.business_name} — "${subject}"`);
    } catch (err) {
      console.warn(`ERROR: ${row.business_name} — ${err.message} — skipping`);
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
