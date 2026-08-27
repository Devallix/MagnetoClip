/**
 * MagnetoClip - Checkout & Payment Engine
 * Handles Pricing Plans, Discounts, Paystack Payment, and EmailJS Notifications.
 */

// ── Config ────────────────────────────────────────────────────────
const PAYSTACK_PUBLIC_KEY = 'pk_test_cb41932561435e820ba7979f380f46f6a9cdb2b7';

const EMAILJS_SERVICE_ID  = 'service_4ekolq3';
const EMAILJS_TEMPLATE_ID = 'template_1enrz1l';
const EMAILJS_PUBLIC_KEY  = '0R1GPAZSkmXszyoyc';

const SITE_BASE_URL = 'https://devallix.github.io/MagnetoClip';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
  initPricingAndCheckout();
});

function initPricingAndCheckout() {
  // Pricing state
  let currentBillingCycle = 'annual';
  let selectedPlan = 'pro';
  let appliedDiscount = 0;

  const plans = {
    personal: {
      name: 'Personal Plan',
      devices: '1 PC',
      support: 'Limited Support',
      monthly: { pricePerMonth: 3.00, total: 3.00, billedDesc: 'Billed $3 monthly' },
      annual: { pricePerMonth: 1.86, total: 22.30, billedDesc: 'Billed $22.30 annually' },
      'two-year': { pricePerMonth: 1.80, total: 43.20, billedDesc: 'Billed $43.20 for 2 years' }
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
  const payAmountInput = document.getElementById('pay-amount');

  // Modal elements
  const modal = document.getElementById('purchase-success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseSuccessBtn = document.getElementById('modal-close-success-btn');
  const modalPlanName = document.getElementById('modal-plan-name');
  const modalCustomerEmail = document.getElementById('modal-customer-email');
  const modalOrderNo = document.getElementById('modal-order-no');

  // ── Billing Toggle ────────────────────────────────────────────
  billingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      billingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBillingCycle = btn.getAttribute('data-cycle') || 'annual';
      updatePricingCards();
      updateOrderSummary();
    });
  });

  // ── Plan Selection ────────────────────────────────────────────
  selectPlanBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-select-plan');
      if (plan && plans[plan]) {
        selectedPlan = plan;
        highlightSelectedPlan();
        updateOrderSummary();

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

    if (personalPriceEl) personalPriceEl.innerText = plans.personal[currentBillingCycle].pricePerMonth.toFixed(2);
    if (proPriceEl) proPriceEl.innerText = plans.pro[currentBillingCycle].pricePerMonth.toFixed(2);
    if (entPriceEl) entPriceEl.innerText = plans.enterprise[currentBillingCycle].pricePerMonth.toFixed(2);

    if (personalBilledEl) personalBilledEl.innerText = plans.personal[currentBillingCycle].billedDesc;
    if (proBilledEl) proBilledEl.innerText = plans.pro[currentBillingCycle].billedDesc;
    if (entBilledEl) entBilledEl.innerText = plans.enterprise[currentBillingCycle].billedDesc;
  }

  function getFinalTotal() {
    const planData = plans[selectedPlan];
    const cycleData = planData[currentBillingCycle];
    const baseTotal = cycleData.total;
    const discountVal = appliedDiscount > 0 ? baseTotal * (appliedDiscount / 100) : 0;
    return baseTotal - discountVal;
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
    if (summaryTax) summaryTax.innerText = `$0.00`;

    const finalTotal = subtotalAfterDiscount;
    if (summaryTotal) summaryTotal.innerText = `$${finalTotal.toFixed(2)}`;
    if (payAmountInput) payAmountInput.value = `$${finalTotal.toFixed(2)}`;
    if (paySubmitBtn) paySubmitBtn.innerHTML = `<i class="fas fa-lock"></i> Pay $${finalTotal.toFixed(2)} Now`;
  }

  // ── Coupon Code ───────────────────────────────────────────────
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

  // ── Checkout Form → Paystack ──────────────────────────────────
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstname = document.getElementById('customer-firstname')?.value.trim();
      const lastname = document.getElementById('customer-lastname')?.value.trim();
      const email = document.getElementById('customer-email')?.value.trim();

      if (!firstname || !lastname) {
        window.showToast?.('Please enter your first and last name', 'danger');
        return;
      }
      if (!email || !email.includes('@')) {
        window.showToast?.('Please enter a valid email address', 'danger');
        return;
      }

      const fullName = `${firstname} ${lastname}`;
      const finalTotal = getFinalTotal();
      const amountInCedis = Math.round(finalTotal * 100);

      if (typeof PaystackPop === 'undefined') {
        window.showToast?.('Payment system failed to load. Please refresh and try again.', 'danger');
        return;
      }

      paySubmitBtn.disabled = true;
      paySubmitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Initializing Payment...';

      try {
        const handler = PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: email,
          amount: amountInCedis,
          currency: 'GHS',
          metadata: {
            custom_fields: [
              { display_name: 'First Name', variable_name: 'first_name', value: firstname },
              { display_name: 'Last Name', variable_name: 'last_name', value: lastname },
              { display_name: 'Plan', variable_name: 'plan', value: plans[selectedPlan].name },
              { display_name: 'Billing Cycle', variable_name: 'billing_cycle', value: currentBillingCycle }
            ]
          },
          onSuccess: (transaction) => {
            const orderId = `MCL-${Math.floor(100000 + Math.random() * 900000)}`;
            const planLabel = `${plans[selectedPlan].name} (${currentBillingCycle.charAt(0).toUpperCase() + currentBillingCycle.slice(1)})`;

            if (typeof emailjs !== 'undefined') {
              emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name: fullName,
                from_email: email,
                plan_name: planLabel,
                amount_paid: `$${finalTotal.toFixed(2)}`,
                order_id: orderId,
                transaction_ref: transaction.reference,
                product_image: `${SITE_BASE_URL}/images/product.png`,
                logo_image: `${SITE_BASE_URL}/images/logo.png`,
                to_email: 'compaxxe555@gmail.com'
              })
              .then(() => {
                showSuccessModal(fullName, email, orderId, planLabel);
                window.showToast?.('Payment confirmed! Confirmation email sent.', 'success');
              })
              .catch((err) => {
                console.error('EmailJS error:', err?.text || err?.message || err);
                showSuccessModal(fullName, email, orderId, planLabel);
                window.showToast?.('Payment confirmed! Email delivery failed — check console.', 'warning');
              });
            } else {
              showSuccessModal(fullName, email, orderId, planLabel);
            }
          },
          onClose: () => {
            paySubmitBtn.disabled = false;
            paySubmitBtn.innerHTML = `<i class="fas fa-lock"></i> Pay $${finalTotal.toFixed(2)} Now`;
            window.showToast?.('Payment cancelled. You can try again anytime.', 'info');
          }
        });

        handler.openIframe();
      } catch (err) {
        console.error('Paystack error:', err);
        paySubmitBtn.disabled = false;
        paySubmitBtn.innerHTML = `<i class="fas fa-lock"></i> Pay $${finalTotal.toFixed(2)} Now`;
        window.showToast?.('Failed to initialize payment. Please try again.', 'danger');
      }
    });
  }

  function showSuccessModal(name, email, orderId, planLabel) {
    paySubmitBtn.disabled = false;
    paySubmitBtn.innerHTML = `<i class="fas fa-lock"></i> Pay Now`;

    if (modalPlanName) modalPlanName.innerText = planLabel;
    if (modalCustomerEmail) modalCustomerEmail.innerText = email;
    if (modalOrderNo) modalOrderNo.innerText = orderId;

    modal?.classList.add('active');
  }

  // ── Modal Close ───────────────────────────────────────────────
  const closeModal = () => modal?.classList.remove('active');

  modalCloseBtn?.addEventListener('click', closeModal);
  modalCloseSuccessBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ── Initial Sync ──────────────────────────────────────────────
  updatePricingCards();
  updateOrderSummary();
}
