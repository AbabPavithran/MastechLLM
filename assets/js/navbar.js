/* ============================================================
   MASTECH — Dropdown & Mobile Menu JS
   Paste this into main.js (or the <script> block at bottom of index.html)
   REPLACE your existing hamburger/mobile-menu block with this.
============================================================ */

/* ── Hamburger / Mobile menu ── */
const navHamburger = document.getElementById('navHamburger');
const mobileMenu   = document.getElementById('mobileMenu');

function openMobileMenu() {
  navHamburger.classList.add('open');
  navHamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  navHamburger.classList.remove('open');
  navHamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (navHamburger) {
  navHamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
}

/* ── Mobile: Company sub-menu toggle ── */
const mobileCompanyToggle = document.getElementById('mobileCompanyToggle');
const mobileSubLinks      = document.getElementById('mobileSubLinks');

if (mobileCompanyToggle && mobileSubLinks) {
  mobileCompanyToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent closeMobileMenu() if called elsewhere
    const isOpen = mobileSubLinks.classList.toggle('open');
    mobileCompanyToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

/* ── Desktop: Company dropdown keyboard / click support ── */
const companyWrap    = document.querySelector('.nav-dropdown-wrap');
const companyTrigger = document.getElementById('companyTrigger');

if (companyTrigger && companyWrap) {
  // Toggle on click (complements CSS :hover)
  companyTrigger.addEventListener('click', () => {
    const isOpen = companyWrap.classList.toggle('open');
    companyTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!companyWrap.contains(e.target)) {
      companyWrap.classList.remove('open');
      companyTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      companyWrap.classList.remove('open');
      companyTrigger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Highlight active dropdown item based on current URL ── */
document.querySelectorAll('.nav-dropdown li a').forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});