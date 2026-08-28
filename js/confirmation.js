/**
 * MagnetoClip - Order Confirmation & License Key Request
 * Reads the completed order from sessionStorage and sends the license request
 * via the Vercel serverless API (which handles payment verification + EmailJS).
 */

document.addEventListener('DOMContentLoaded', () => {
  initConfirmation();
});

function initConfirmation() {
  const orderEls = {
    orderNo: document.getElementById('cf-order-no'),
    customerName: document.getElementById('cf-customer-name'),
    customerEmail: document.getElementById('cf-customer-email'),
    planName: document.getElementById('cf-plan-name'),
    billingCycle: document.getElementById('cf-billing-cycle'),
    amount: document.getElementById('cf-amount'),
    transactionRef: document.getElementById('cf-transaction-ref'),
    orderDate: document.getElementById('cf-order-date'),
    customerFirst: document.getElementById('confirm-customer-first')
  };

  const requestBtn = document.getElementById('request-license-btn');
  const missingNotice = document.getElementById('confirm-missing');

  let order = null;
  try {
    const raw = sessionStorage.getItem('mcl_order');
    order = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to read order details:', err);
  }

  if (!order) {
    if (missingNotice) missingNotice.style.display = 'block';
    if (requestBtn) requestBtn.disabled = true;
    return;
  }

  if (orderEls.orderNo) orderEls.orderNo.innerText = order.orderId || '—';
  if (orderEls.customerName) orderEls.customerName.innerText = order.fullName || '—';
  if (orderEls.customerEmail) orderEls.customerEmail.innerText = order.email || '—';
  if (orderEls.planName) orderEls.planName.innerText = order.planLabel || order.planName || '—';
  if (orderEls.billingCycle) orderEls.billingCycle.innerText = order.billingCycle || '—';
  if (orderEls.amount) orderEls.amount.innerText = order.amountLabel || '—';
  if (orderEls.transactionRef) orderEls.transactionRef.innerText = order.transactionRef || '—';
  if (order.orderDate) orderEls.orderDate.innerText = order.transactionDate
    ? new Date(order.transactionDate).toLocaleString()
    : '—';
  if (orderEls.customerFirst) {
    orderEls.customerFirst.innerText = (order.fullName || 'Dear Customer').trim().split(/\s+/)[0] || 'Dear Customer';
  }

  window.showToast?.('Payment confirmed! Please review your order and request your license key.', 'success');

  requestBtn?.addEventListener('click', async () => {
    requestBtn.disabled = true;
    requestBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending License Request...';

    try {
      const res = await fetch('api/request-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: order.transactionRef,
          orderId: order.orderId,
          planLabel: order.planLabel,
          billingCycle: order.billingCycle,
          fullName: order.fullName,
          email: order.email,
          amountLabel: order.amountLabel
        })
      });
      const data = await res.json().catch(() => null);

      if (!(res.ok && data && data.ok)) {
        throw new Error(data && data.message ? data.message : 'License request failed');
      }

      try {
        sessionStorage.removeItem('mcl_order');
      } catch (err) {
        console.error('Failed to clear order details:', err);
      }
      window.showToast?.('License key request sent! Check your email.', 'success');
      setTimeout(() => { window.location.href = SITE_BASE_URL; }, 2000);
    } catch (err) {
      console.error('License request error:', err?.message || err);
      requestBtn.disabled = false;
      requestBtn.innerHTML = '<i class="fas fa-key"></i> Request License Key';
      window.showToast?.('Failed to send request. Please try again.', 'danger');
    }
  });
}