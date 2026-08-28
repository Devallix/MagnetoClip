/**
 * Vercel serverless function - License key request.
 * Re-verifies the Paystack transaction server-side, then sends the license
 * email via the EmailJS REST API using the private key (accessToken).
 * No secret keys are exposed to the browser.
 */

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const emailServiceId = process.env.EMAILJS_SERVICE_ID;
  const emailTemplateId = process.env.EMAILJS_TEMPLATE_ID;
  const emailPublicKey = process.env.EMAILJS_PUBLIC_KEY;
  const emailPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!secretKey || !emailServiceId || !emailTemplateId || !emailPublicKey || !emailPrivateKey) {
    res.status(500).json({ ok: false, message: 'Server environment is not fully configured.' });
    return;
  }

  const body = req.body || {};
  const reference = (body.reference || '').toString().trim();
  const fullName = (body.fullName || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const planLabel = (body.planLabel || body.planName || '').toString().trim();
  const amountLabel = (body.amountLabel || '').toString().trim();
  const orderId = (body.orderId || '').toString().trim();

  if (!reference || !email || !orderId) {
    res.status(400).json({ ok: false, message: 'Missing required order details.' });
    return;
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` }
    });

    const paystackData = await paystackRes.json();

    if (!(paystackRes.ok && paystackData.status === true && paystackData.data && paystackData.data.status === 'success')) {
      res.status(400).json({ ok: false, message: 'Payment could not be verified.' });
      return;
    }

    const siteBaseUrl = (process.env.SITE_BASE_URL || 'https://magnetoclip.vercel.app/').replace(/\/+$/, '');
    const adminEmail = process.env.ADMIN_EMAIL || 'compaxxe555@gmail.com';

    const sendRes = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailServiceId,
        template_id: emailTemplateId,
        user_id: emailPublicKey,
        accessToken: emailPrivateKey,
        template_params: {
          from_name: fullName,
          from_email: email,
          plan_name: planLabel,
          amount_paid: amountLabel,
          order_id: orderId,
          transaction_ref: reference,
          product_image: `${siteBaseUrl}/images/product.png`,
          logo_image: `${siteBaseUrl}/images/logo.png`,
          to_email: adminEmail
        }
      })
    });

    const sendText = await sendRes.text();

    if (sendRes.ok) {
      res.status(200).json({ ok: true, message: 'License key request sent.' });
    } else {
      console.error('EmailJS send error:', sendRes.status, sendText);
      res.status(502).json({ ok: false, message: 'Failed to send license email.' });
    }
  } catch (err) {
    console.error('Request license error:', err?.message || err);
    res.status(500).json({ ok: false, message: 'Failed to process license request.' });
  }
};