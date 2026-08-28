/**
 * Vercel serverless function - Contact form proxy.
 * Forwards the contact form to Splitforms using the access key server-side,
 * so the access key is never exposed to the browser.
 */

const SPLITFORMS_ENDPOINT = 'https://splitforms.com/api/submit';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  const accessKey = process.env.SPLITFORMS_ACCESS_KEY;
  if (!accessKey) {
    res.status(500).json({ ok: false, message: 'Splitforms access key is not configured.' });
    return;
  }

  const body = req.body || {};
  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const topic = (body.topic || '').toString().trim();
  const subject = (body.subject || '').toString().trim();
  const message = (body.message || '').toString().trim();
  const website = (body.website || '').toString().trim();

  if (!name || !email || !subject || !message) {
    res.status(400).json({ ok: false, message: 'Please fill in all required fields.' });
    return;
  }

  if (website) {
    res.status(400).json({ ok: false, message: 'Submission blocked as spam.' });
    return;
  }

  try {
    const splitformsRes = await fetch(SPLITFORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        topic,
        subject,
        message,
        website
      })
    });

    const data = await splitformsRes.json().catch(() => null);

    if (splitformsRes.ok && data && data.success) {
      res.status(200).json({ ok: true, message: 'Ticket sent.' });
    } else {
      console.error('Splitforms error:', splitformsRes.status, data);
      res.status(502).json({ ok: false, message: 'Failed to send ticket.' });
    }
  } catch (err) {
    console.error('Contact proxy error:', err?.message || err);
    res.status(500).json({ ok: false, message: 'Failed to send ticket.' });
  }
};