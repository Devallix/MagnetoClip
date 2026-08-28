/**
 * Vercel serverless function - Paystack transaction verification.
 * Verifies a Paystack transaction reference server-side using the secret key.
 * The secret key never touches the frontend.
 */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ ok: false, message: 'Paystack secret key is not configured.' });
    return;
  }

  const reference = (req.body && req.body.reference || '').toString().trim();
  if (!reference) {
    res.status(400).json({ ok: false, message: 'Transaction reference is required.' });
    return;
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` }
    });

    const data = await paystackRes.json();

    if (paystackRes.ok && data.status === true && data.data && data.data.status === 'success') {
      res.status(200).json({
        ok: true,
        status: data.data.status,
        reference: data.data.reference,
        amount: data.data.amount,
        currency: data.data.currency,
        customerEmail: data.data.customer ? data.data.customer.email : null,
        paidAt: data.data.paid_at
      });
    } else {
      res.status(200).json({
        ok: false,
        message: data.message || 'Payment could not be verified.'
      });
    }
  } catch (err) {
    console.error('Verify payment error:', err?.message || err);
    res.status(500).json({ ok: false, message: 'Failed to verify payment.' });
  }
};