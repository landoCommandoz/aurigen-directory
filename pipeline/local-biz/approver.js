require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const express = require('express');
const twilio = require('twilio');
const { readCSV, writeCSV } = require('./csv-utils');
const { generateEmail, validateEmail, slugify, appendErrorLog, parseCity } = require('./emailbuilder');

const EMAILS_DIR = path.join(__dirname, 'emails');
const WEBHOOK_PORT = 3001;
const APPROVAL_TIMEOUT_MS = 10 * 60 * 1000;

// ---------------------------------------------------------------------------
// TWILIO
// ---------------------------------------------------------------------------

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    console.error('Error: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env');
    process.exit(1);
  }
  return twilio(sid, token);
}

async function sendWhatsApp(client, message) {
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.TWILIO_WHATSAPP_TO,
    body: message
  });
}

// ---------------------------------------------------------------------------
// EMAIL WRITER (single lead)
// ---------------------------------------------------------------------------

function writeEmailForLead(row) {
  const { subject, body } = generateEmail(row);

  const issues = validateEmail(subject, body, row.business_name);
  for (const issue of issues) {
    appendErrorLog(issue.cat, issue.desc);
    console.warn(`    FLAG: [${issue.cat}] ${issue.desc}`);
  }

  const slug = slugify(row.business_name);
  const emailPath = path.join(EMAILS_DIR, `${slug}.txt`);
  const content = `Subject: ${subject}\n\n${body}`;
  fs.writeFileSync(emailPath, content, 'utf-8');
  return path.basename(emailPath);
}

// ---------------------------------------------------------------------------
// WEBHOOK SERVER
// ---------------------------------------------------------------------------

function startWebhookServer() {
  const app = express();
  app.use(express.urlencoded({ extended: false }));

  let pendingResolve = null;

  app.post('/webhook', (req, res) => {
    const body = (req.body.Body || '').trim().toUpperCase();
    if (pendingResolve) {
      pendingResolve(body);
      pendingResolve = null;
    }
    res.type('text/xml').send('<Response></Response>');
  });

  const server = app.listen(WEBHOOK_PORT, () => {
    console.log(`Webhook server listening on port ${WEBHOOK_PORT}`);
  });

  function waitForReply() {
    return Promise.race([
      new Promise(resolve => { pendingResolve = resolve; }),
      new Promise(resolve => {
        setTimeout(() => {
          pendingResolve = null;
          resolve('TIMEOUT');
        }, APPROVAL_TIMEOUT_MS);
      })
    ]);
  }

  function stop() {
    return new Promise(resolve => server.close(resolve));
  }

  return { waitForReply, stop };
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  if (!process.env.TWILIO_WHATSAPP_FROM || !process.env.TWILIO_WHATSAPP_TO) {
    console.error('Error: TWILIO_WHATSAPP_FROM and TWILIO_WHATSAPP_TO must be set in .env');
    process.exit(1);
  }

  const client = getTwilioClient();
  const rows = readCSV('leads.csv');

  if (rows.length === 0) {
    console.log('No leads found. Run the earlier pipeline steps first.');
    return;
  }

  const columns = Object.keys(rows[0]);
  if (!columns.includes('approval_status')) columns.push('approval_status');

  fs.mkdirSync(EMAILS_DIR, { recursive: true });

  const pending = rows.filter(r => r.live_url && !r.approval_status);

  if (pending.length === 0) {
    console.log('No leads pending approval.');
    return;
  }

  console.log(`\n${pending.length} lead(s) pending approval.\n`);

  const webhook = startWebhookServer();

  let approved = 0;
  let skipped = 0;
  let timedOut = 0;

  for (const row of pending) {
    const city = parseCity(row.address);
    const message = [
      'New lead ready.',
      `Business: ${row.business_name}`,
      `City: ${city}`,
      `Site: ${row.live_url}`,
      'Reply YES to send outreach email or NO to skip.'
    ].join('\n');

    console.log(`Requesting approval: ${row.business_name}...`);

    try {
      await sendWhatsApp(client, message);
      console.log('  WhatsApp sent. Waiting for reply (10 min timeout)...');
    } catch (err) {
      console.warn(`  WhatsApp send failed: ${err.message} - skipping`);
      row.approval_status = 'send_failed';
      writeCSV('leads.csv', rows, columns);
      continue;
    }

    const reply = await webhook.waitForReply();

    if (reply === 'YES') {
      console.log(`  APPROVED: ${row.business_name}`);
      try {
        const filename = writeEmailForLead(row);
        row.approval_status = 'approved';
        approved++;
        console.log(`  Email written: emails/${filename}`);

        await sendWhatsApp(client, `Email ready for ${row.business_name}. Saved to emails/${filename}`).catch(() => {});
      } catch (err) {
        console.warn(`  Email generation failed: ${err.message}`);
        row.approval_status = 'email_failed';
      }
    } else if (reply === 'NO') {
      console.log(`  SKIPPED: ${row.business_name}`);
      row.approval_status = 'skipped';
      skipped++;
    } else if (reply === 'TIMEOUT') {
      console.log(`  TIMEOUT: ${row.business_name} (no reply in 10 min)`);
      row.approval_status = 'pending';
      timedOut++;
    } else {
      console.log(`  Unknown reply "${reply}" for ${row.business_name} - treating as skip`);
      row.approval_status = 'skipped';
      skipped++;
    }

    writeCSV('leads.csv', rows, columns);
  }

  await webhook.stop();

  console.log(`\nApproval complete: ${approved} approved, ${skipped} skipped, ${timedOut} timed out.`);
  console.log('Webhook server stopped.');
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
