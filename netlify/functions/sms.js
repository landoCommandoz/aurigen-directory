// Aurigen — WhatsApp Sender
// Netlify Function: /.netlify/functions/sms
//
// Env vars required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
//
// Sends WhatsApp messages to Lando via Twilio REST API (no npm package)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const message = (body.message || '').trim();

  if (!message) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'No message provided.' })
    };
  }

  if (message.length > 1600) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Message exceeds 1600 characters.' })
    };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'WhatsApp not configured.' })
    };
  }

  const toNumber = 'whatsapp:+18016805090';
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const params = new URLSearchParams();
  params.append('To', toNumber);
  params.append('From', `whatsapp:${fromNumber}`);
  params.append('Body', message);

  try {
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.message || 'Twilio error.' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, sid: data.sid })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'WhatsApp delivery failed.' })
    };
  }
};
