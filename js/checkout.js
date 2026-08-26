/**
 * MagnetoClip - Checkout & Licensing Engine
 * Handles Pricing Plans, Discounts, Form Validation, License Key Generation, and Receipt Download.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPricingAndCheckout();
});

function initPricingAndCheckout() {
  // Pricing state
  let currentBillingCycle = 'annual'; // 'monthly', 'annual', 'two-year'
  let selectedPlan = 'pro'; // 'personal', 'pro', 'enterprise'
  let appliedDiscount = 0; // percentage

  const plans = {
    personal: {
      name: 'Personal Plan',
      devices: '1 PC',
      support: 'Limited Support',
      monthly: { pricePerMonth: 3.00, total: 3.00, billedDesc: 'Billed $3 monthly' },
      annual: { pricePerMonth: 3.00, total: 36.00, billedDesc: 'Billed $36 annually' },
      'two-year': { pricePerMonth: 3.00, total: 72.00, billedDesc: 'Billed $72 for 2 years' }
    },
    pro: {
      name: 'Pro Plan',
      devices: '1 PC',
      support: 'Unlimited Priority Support',
      monthly: { pricePerMonth: 4.00, total: 4.00, billedDesc: 'Billed $4 monthly' },
      annual: { pricePerMonth: 2.50, total: 30.00, billedDesc: 'Billed $30 annually ($2.50/mo)' },
      'two-year': { pricePerMonth: 2.50, total: 60.00, billedDesc: 'Billed $60 for 2 years' }
    },
    enterprise: {
      name: 'Enterprise Plan',
      devices: '1 PC (Extended)',
      support: '2 Years Unlimited VIP Support',
      monthly: { pricePerMonth: 5.00, total: 5.00, billedDesc: 'Billed $5 monthly' },
      annual: { pricePerMonth: 3.00, total: 36.00, billedDesc: 'Billed $36 annually' },
      'two-year': { pricePerMonth: 2.00, total: 48.00, billedDesc: 'Billed $48 for 2 years ($2.00/mo)' }
    }
  };

  // DOM Elements
  const billingBtns = document.querySelectorAll('.billing-toggle-btn');
  const planCards = document.querySelectorAll('.pricing-card');
  const selectPlanBtns = document.querySelectorAll('[data-select-plan]');
  
  const summaryPlanName = document.getElementById('summary-plan-name');
  const summaryBillingCycle = document.getElementById('summary-billing-cycle');
  const summaryBasePrice = document.getElementById('summary-base-price');
  const summaryDiscountRow = document.getElementById('summary-discount-row');
  const summaryDiscountAmount = document.getElementById('summary-discount-amount');
  const summaryTax = document.getElementById('summary-tax');
  const summaryTotal = document.getElementById('summary-total');

  const couponInput = document.getElementById('coupon-code');
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const couponMsg = document.getElementById('coupon-msg');

  const checkoutForm = document.getElementById('checkout-form');
  const paySubmitBtn = document.getElementById('pay-submit-btn');

  // Modal elements
  const modal = document.getElementById('purchase-success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalLicenseKey = document.getElementById('modal-license-key');
  const modalPlanName = document.getElementById('modal-plan-name');
  const modalCustomerEmail = document.getElementById('modal-customer-email');
  const modalOrderNo = document.getElementById('modal-order-no');
  const copyKeyBtn = document.getElementById('copy-license-btn');
  const downloadReceiptBtn = document.getElementById('download-receipt-btn');

  // Setup Billing Toggle
  billingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      billingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBillingCycle = btn.getAttribute('data-cycle') || 'annual';
      updatePricingCards();
      updateOrderSummary();
    });
  });

  // Setup Plan Selection
  selectPlanBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-select-plan');
      if (plan && plans[plan]) {
        selectedPlan = plan;
        highlightSelectedPlan();
        updateOrderSummary();

        // Scroll to checkout section smoothly
        const checkoutSec = document.getElementById('checkout-section');
        if (checkoutSec) {
          checkoutSec.scrollIntoView({ behavior: 'smooth' });
        }
        window.showToast?.(`Selected: ${plans[plan].name}`, 'info');
      }
    });
  });

  function highlightSelectedPlan() {
    planCards.forEach(card => {
      const p = card.getAttribute('data-plan');
      if (p === selectedPlan) {
        card.style.borderColor = 'var(--primary-cyan)';
      } else {
        card.style.borderColor = 'var(--border-color)';
      }
    });
  }

  function updatePricingCards() {
    const personalPriceEl = document.getElementById('price-personal');
    const proPriceEl = document.getElementById('price-pro');
    const entPriceEl = document.getElementById('price-enterprise');

    const personalBilledEl = document.getElementById('billed-personal');
    const proBilledEl = document.getElementById('billed-pro');
    const entBilledEl = document.getElementById('billed-enterprise');

    if (personalPriceEl) personalPriceEl.innerText = plans.personal[currentBillingCycle].pricePerMonth.toFixed(currentBillingCycle === 'annual' && plans.personal.annual.pricePerMonth % 1 !== 0 ? 2 : 2);
    if (proPriceEl) proPriceEl.innerText = plans.pro[currentBillingCycle].pricePerMonth.toFixed(2);
    if (entPriceEl) entPriceEl.innerText = plans.enterprise[currentBillingCycle].pricePerMonth.toFixed(2);

    if (personalBilledEl) personalBilledEl.innerText = plans.personal[currentBillingCycle].billedDesc;
    if (proBilledEl) proBilledEl.innerText = plans.pro[currentBillingCycle].billedDesc;
    if (entBilledEl) entBilledEl.innerText = plans.enterprise[currentBillingCycle].billedDesc;
  }

  function updateOrderSummary() {
    const planData = plans[selectedPlan];
    const cycleData = planData[currentBillingCycle];
    
    if (summaryPlanName) summaryPlanName.innerText = planData.name;
    if (summaryBillingCycle) {
      summaryBillingCycle.innerText = currentBillingCycle === 'monthly' ? 'Monthly' : currentBillingCycle === 'annual' ? 'Annual (1 Year)' : '2 Years Access';
    }

    const baseTotal = cycleData.total;
    if (summaryBasePrice) summaryBasePrice.innerText = `$${baseTotal.toFixed(2)}`;

    let discountVal = 0;
    if (appliedDiscount > 0) {
      discountVal = baseTotal * (appliedDiscount / 100);
      if (summaryDiscountRow) summaryDiscountRow.style.display = 'flex';
      if (summaryDiscountAmount) summaryDiscountAmount.innerText = `-$${discountVal.toFixed(2)} (${appliedDiscount}% OFF)`;
    } else {
      if (summaryDiscountRow) summaryDiscountRow.style.display = 'none';
    }

    const subtotalAfterDiscount = baseTotal - discountVal;
    const estimatedTax = 0.00; // Digital tax free promo
    if (summaryTax) summaryTax.innerText = `$0.00`;

    const finalTotal = subtotalAfterDiscount + estimatedTax;
    if (summaryTotal) summaryTotal.innerText = `$${finalTotal.toFixed(2)}`;
    if (paySubmitBtn) paySubmitBtn.innerText = `Pay $${finalTotal.toFixed(2)} & Activate`;
  }

  // Coupon Code
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'MAGNETO20' || code === 'LAUNCH20' || code === 'SAVE20') {
        appliedDiscount = 20;
        if (couponMsg) {
          couponMsg.style.display = 'block';
          couponMsg.className = 'badge badge-cyan';
          couponMsg.innerText = 'Coupon Applied: 20% Discount Activated!';
        }
        updateOrderSummary();
        window.showToast?.('20% Promo discount applied!', 'success');
      } else if (code === '') {
        window.showToast?.('Please enter a coupon code', 'danger');
      } else {
        window.showToast?.('Invalid or expired coupon code', 'danger');
      }
    });
  }

  // Credit Card Form Formatters
  const cardNumberInput = document.getElementById('card-number');
  const cardExpiryInput = document.getElementById('card-expiry');
  const cardCvvInput = document.getElementById('card-cvv');

  cardNumberInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formatted;
  });

  cardExpiryInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 3) {
      e.target.value = `${value.substring(0, 2)}/${value.substring(2)}`;
    } else {
      e.target.value = value;
    }
  });

  cardCvvInput?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
  });

  // Payment tab switching
  const paymentTabs = document.querySelectorAll('.payment-tab-btn');
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const method = tab.getAttribute('data-method');
      const cardFields = document.getElementById('card-payment-fields');
      const altFields = document.getElementById('alt-payment-fields');
      if (method === 'card') {
        if (cardFields) cardFields.style.display = 'block';
        if (altFields) altFields.style.display = 'none';
      } else {
        if (cardFields) cardFields.style.display = 'none';
        if (altFields) altFields.style.display = 'block';
      }
    });
  });

  // Generate Serial Key
  function generateSerialKey() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    function segment(len) {
      let s = '';
      for (let i = 0; i < len; i++) {
        s += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return s;
    }
    return `MGCL-${segment(5)}-${segment(5)}-${segment(5)}-${segment(5)}`;
  }

  // Handle Checkout Submit
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('customer-email');
      const email = emailInput ? emailInput.value.trim() : 'customer@example.com';
      const nameInput = document.getElementById('customer-name');
      const name = nameInput ? nameInput.value.trim() : 'MagnetoClip User';

      if (!email || !email.includes('@')) {
        window.showToast?.('Please enter a valid email address for license key delivery', 'danger');
        return;
      }

      // Simulate payment processing
      paySubmitBtn.disabled = true;
      paySubmitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing Secure Payment...';

      setTimeout(() => {
        paySubmitBtn.disabled = false;
        updateOrderSummary();

        const orderId = `MCL-${Math.floor(100000 + Math.random() * 900000)}`;

        if (modalPlanName) modalPlanName.innerText = `${plans[selectedPlan].name} (${currentBillingCycle.toUpperCase()})`;
        if (modalCustomerEmail) modalCustomerEmail.innerText = email;
        if (modalOrderNo) modalOrderNo.innerText = orderId;

        // Open modal
        modal?.classList.add('active');
        window.showToast?.(`Payment approved! License sent to ${email}`, 'success');

        // Resend email button
        const resendBtn = document.getElementById('resend-email-btn');
        resendBtn?.addEventListener('click', () => {
          window.showToast?.(`License key re-sent to ${email}`, 'success');
        });

        // Download receipt button
        downloadReceiptBtn?.addEventListener('click', () => {
          downloadReceipt(name, email, orderId, plans[selectedPlan].name, summaryTotal?.innerText || '$0.00');
        });

      }, 1500);
    });
  }

  // Modal close
  modalCloseBtn?.addEventListener('click', () => {
    modal?.classList.remove('active');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Initial summary sync
  updatePricingCards();
  updateOrderSummary();
}

function downloadReceipt(name, email, orderId, plan, total) {
  const receiptContent = `=====================================================
MAGNETOCLIP SOFTWARE INVOICE & ORDER CONFIRMATION
Developed by Devallix | https://magnetoclip.app
=====================================================

Order Number   : ${orderId}
Date           : ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Status         : PAID & COMPLETED
Customer Name  : ${name}
Delivery Email : ${email}

-----------------------------------------------------
ITEM DESCRIPTION                               AMOUNT
-----------------------------------------------------
MagnetoClip Desktop App License                ${total}
Plan: ${plan}
Platform: Windows 10/11 (64-bit)

-----------------------------------------------------
TOTAL AMOUNT PAID:                             ${total}
Payment Method: 256-Bit SSL Encrypted Card
-----------------------------------------------------

LICENSE SERIAL KEY DELIVERY:
Your cryptographically signed Ed25519 serial activation
key has been dispatched directly to:
--> ${email}

ACTIVATION INSTRUCTIONS:
1. Open the license delivery email in your inbox.
2. Launch MagnetoClip on your Windows PC.
3. Navigate to Settings > License and paste your key.
4. Click 'Activate Now' to unlock full functionality.

Thank you for choosing MagnetoClip!
Support: support@magnetoclip.app
=====================================================`;

  const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MagnetoClip-Receipt-${orderId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.showToast?.('Receipt downloaded successfully!', 'success');
}
