/**
 * MagnetoClip - Contact Form via Splitforms (proxied)
 * Posts the contact form to the Vercel serverless API (/api/contact), which
 * forwards the submission to Splitforms with the access key server-side.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btn = document.getElementById('contact-submit-btn');
  const honeypot = document.getElementById('contact-website');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name  = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const topic = document.getElementById('contact-category').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      window.showToast?.('Please fill in all required fields.', 'danger');
      return;
    }

    if (honeypot && honeypot.value.trim()) {
      window.showToast?.('Submission blocked as spam.', 'danger');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Ticket...';

    try {
      const res = await fetch('api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          topic,
          subject,
          message,
          website: honeypot ? honeypot.value : ''
        })
      });

      let data = null;
      try { data = await res.json(); } catch (_) { /* non-JSON error body */ }

      if (res.ok && data && data.ok) {
        const ticketId = `MCL-TK-${Math.floor(1000 + Math.random() * 9000)}`;
        btn.innerHTML = '<i class="fas fa-check"></i> Ticket Sent!';
        window.showToast?.(`Thank you ${name}! Your support ticket has been sent. Ticket ID: #${ticketId}`, 'success');
        form.reset();

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Support Ticket';
        }, 3000);
      } else {
        throw new Error(data && data.message ? data.message : 'Submission failed');
      }
    } catch (err) {
      console.error('Contact submit error:', err?.message || err);
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Support Ticket';
      window.showToast?.('Failed to send ticket. Please try again or email us directly at compaxxe555@gmail.com', 'danger');
    }
  });
});