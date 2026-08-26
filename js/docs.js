/**
 * MagnetoClip - Documentation Search & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initDocsSearch();
  initDocsScrollspy();
  initCodeCopyButtons();
  initDocsSidebarToggle();
});

function initDocsSidebarToggle() {
  const toggleBtn = document.getElementById('docs-sidebar-toggle');
  const sidebarContent = document.getElementById('docs-sidebar-content');
  const navLinks = document.querySelectorAll('.docs-nav-link');

  if (toggleBtn && sidebarContent) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebarContent.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const icon = toggleBtn.querySelector('.toggle-icon');
      if (icon) {
        icon.className = isOpen ? 'fas fa-chevron-up toggle-icon' : 'fas fa-chevron-down toggle-icon';
      }
    });

    // Auto collapse on link click for tablet/mobile
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          sidebarContent.classList.remove('open');
          toggleBtn.setAttribute('aria-expanded', 'false');
          const icon = toggleBtn.querySelector('.toggle-icon');
          if (icon) icon.className = 'fas fa-chevron-down toggle-icon';
        }
      });
    });
  }
}

function initDocsSearch() {
  const searchInput = document.getElementById('docs-search-input');
  const articles = document.querySelectorAll('.docs-article');
  const navLinks = document.querySelectorAll('.docs-nav-link');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();

    articles.forEach(article => {
      const text = article.innerText.toLowerCase();
      const id = article.id;
      const matchingLink = document.querySelector(`.docs-nav-link[href="#${id}"]`);

      if (term === '' || text.includes(term)) {
        article.style.display = 'block';
        if (matchingLink) matchingLink.parentElement.style.display = 'block';
      } else {
        article.style.display = 'none';
        if (matchingLink) matchingLink.parentElement.style.display = 'none';
      }
    });
  });
}

function initDocsScrollspy() {
  const links = document.querySelectorAll('.docs-nav-link');
  const articles = document.querySelectorAll('.docs-article');

  window.addEventListener('scroll', () => {
    let current = '';
    articles.forEach(article => {
      const articleTop = article.offsetTop - 150;
      if (window.pageYOffset >= articleTop) {
        current = article.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function initCodeCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-box')?.querySelector('pre');
      if (pre) {
        const text = pre.innerText;
        window.copyToClipboard?.(text, 'Code snippet copied!');
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied';
        setTimeout(() => {
          btn.innerHTML = origHtml;
        }, 2000);
      }
    });
  });
}
