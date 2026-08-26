/**
 * MagnetoClip Website - Main JavaScript
 * Handles Navbar interaction, Toasts, FAQ accordions, Download Engine Simulator, and Shared Utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initDownloadSimulator();
  initGlobalDownloadButtons();
});

/* ==========================================================================
   Navbar & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });

    // Auto reset on window resize above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1017 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }
}

/* ==========================================================================
   FAQ Accordions
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close other open accordions
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });
}

/* ==========================================================================
   Interactive Download Accelerator Demo Simulator
   ========================================================================== */
function initDownloadSimulator() {
  const startBtn = document.getElementById('demo-start-btn');
  const pauseBtn = document.getElementById('demo-pause-btn');
  const speedDisplay = document.getElementById('demo-speed');
  const percentDisplay = document.getElementById('demo-percent');
  const progressBar = document.getElementById('demo-progress-fill');
  const chunks = document.querySelectorAll('.chunk-segment');

  if (!startBtn || !progressBar) return;

  let progress = 74;
  let interval = null;
  let isRunning = false;

  function updateVisuals(val) {
    progress = Math.min(100, Math.max(0, val));
    progressBar.style.width = `${progress}%`;
    if (percentDisplay) percentDisplay.innerText = `${Math.round(progress)}%`;

    const activeIndex = Math.floor((progress / 100) * chunks.length);
    chunks.forEach((chunk, idx) => {
      if (idx < activeIndex) {
        chunk.className = 'chunk-segment done';
      } else if (idx === activeIndex) {
        chunk.className = 'chunk-segment active';
      } else {
        chunk.className = 'chunk-segment';
      }
    });

    if (progress >= 100) {
      clearInterval(interval);
      isRunning = false;
      if (speedDisplay) speedDisplay.innerText = '0.0 MB/s (Complete)';
      showToast('Simulation complete: Verified 64-segment hash check passed!', 'success');
      startBtn.innerHTML = '<i class="fas fa-redo"></i> Restart Demo';
    }
  }

  startBtn.addEventListener('click', () => {
    if (progress >= 100) {
      progress = 0;
      updateVisuals(0);
    }
    if (isRunning) return;
    isRunning = true;
    startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Accelerating...';
    
    interval = setInterval(() => {
      const speed = (Math.random() * 15 + 85).toFixed(1); // 85 - 100 MB/s
      if (speedDisplay) speedDisplay.innerText = `${speed} MB/s`;
      updateVisuals(progress + 1.2);
    }, 150);
  });

  pauseBtn?.addEventListener('click', () => {
    if (interval) {
      clearInterval(interval);
      isRunning = false;
      if (speedDisplay) speedDisplay.innerText = 'Paused (Offset saved in .mclip)';
      startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
      showToast('Download paused. Resumable offset state saved.', 'info');
    }
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   Global Clipboard Helper
   ========================================================================== */
function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, 'success');
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg, 'success');
  } catch (err) {
    showToast('Failed to copy', 'danger');
  }
  document.body.removeChild(textArea);
}

/* ==========================================================================
   Real Downloads Notification for GitHub Release Links
   ========================================================================== */
function initGlobalDownloadButtons() {
  document.querySelectorAll('[data-download-name]').forEach(btn => {
    btn.addEventListener('click', () => {
      const fileName = btn.getAttribute('data-download-name') || 'MagnetoClip-Installer-v0.2.5.exe';
      showToast(`Downloading official release from GitHub: ${fileName}`, 'success');
    });
  });
}

window.showToast = showToast;
window.copyToClipboard = copyToClipboard;
