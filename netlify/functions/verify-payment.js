// Aurigen — Stripe Webhook Handler
// Netlify Function: /.netlify/functions/verify-payment
//
// Receives Stripe webhook events, validates signature,
// and upserts paid_users record in Supabase on checkout.session.completed.
//
// Env vars (Netlify only — never hardcode):
//   STRIPE_WEBHOOK_SECRET    — Stripe webhook signing secret (whsec_...)
//   SUPABASE_URL             — Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (bypasses RLS)

const crypto = require('crypto');

/**
 * Verify Stripe webhook signature (v1 scheme).
 * Uses raw body + STRIPE_WEBHOOK_SECRET to compute expected signature.
 * Returns the parsed event object or throws on mismatch.
 */
function verifyStripeSignature(rawBody, sigHeader, secret) {
  if (!sigHeader || !secret) {
    throw new Error('Missing signature header or webhook secret');
  }

  const parts = {};
  sigHeader.split(',').forEach(function(item) {
    var kv = item.split('=');
    if (kv.length === 2) {
      if (!parts[kv[0]]) parts[kv[0]] = [];
      parts[kv[0]].push(kv[1]);
    }
  });

  var timestamp = parts.t && parts.t[0];
  var signatures = parts.v1 || [];

  if (!timestamp || signatures.length === 0) {
    throw new Error('Invalid signature header format');
  }

  // Reject timestamps older than 5 minutes (replay protection)
  var age = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
  if (age > 300) {
    throw new Error('Webhook timestamp too old (' + Math.round(age) + 's)');
  }

  var signedPayload = timestamp + '.' + rawBody;
  var expected = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  var valid = signatures.some(function(sig) {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'utf8'),
      Buffer.from(sig, 'utf8')
    );
  });

  if (!valid) {
    throw new Error('Stripe signature verification failed');
  }

  return JSON.parse(rawBody);
}

exports.handler = async function(event) {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    var rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;

    var sigHeader = event.headers['stripe-signature'] || event.headers['Stripe-Signature'] || '';
    var secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration' }) };
    }

    // Verify signature
    var stripeEvent;
    try {
      stripeEvent = verifyStripeSignature(rawBody, sigHeader, secret);
    } catch (sigErr) {
      console.error('Signature verification failed:', sigErr.message);
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid signature' }) };
    }

    // Only process checkout.session.completed
    if (stripeEvent.type !== 'checkout.session.completed') {
      return { statusCode: 200, body: JSON.stringify({ received: true, ignored: stripeEvent.type }) };
    }

    var session = stripeEvent.data && stripeEvent.data.object;
    if (!session) {
      console.error('No session object in event');
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing session data' }) };
    }

    var customerEmail = session.customer_email || (session.customer_details && session.customer_details.email) || null;
    if (!customerEmail) {
      console.error('No email in checkout session:', session.id);
      return { statusCode: 200, body: JSON.stringify({ received: true, warning: 'No email found' }) };
    }

    customerEmail = customerEmail.toLowerCase().trim();

    // Lazy-load Supabase
    var createClient = require('@supabase/supabase-js').createClient;
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Upsert into paid_users
    var { error: upsertError } = await supabase
      .from('paid_users')
      .upsert(
        {
          email: customerEmail,
          stripe_session_id: session.id,
          paid_at: new Date().toISOString(),
          active: true
        },
        { onConflict: 'email' }
      );

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Database write failed' }) };
    }

    console.log('Payment recorded for:', customerEmail, 'session:', session.id);
    return { statusCode: 200, body: JSON.stringify({ received: true, email: customerEmail }) };

  } catch (err) {
    console.error('Webhook handler error:', err.message || err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
