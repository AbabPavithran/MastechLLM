/**
* Project: Mastech Technical Iron Works
* File   : main.js
*/

(function () {
  "use strict";

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToggle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', () => {
      if (document.querySelector('body').classList.contains('mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const parentLi = this.closest('li');
      if (parentLi) {
        parentLi.classList.toggle('active');
        const submenu = parentLi.querySelector('ul');
        if (submenu) submenu.classList.toggle('dropdown-active');
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => { preloader.classList.add('loaded'); }, 800);
      setTimeout(() => { preloader.remove(); }, 1600);
    });
  }

  /**
   * Header scroll class toggle
   */
  const header = document.querySelector('#header');
  function toggleScrolled() {
    if (header) {
      window.scrollY > 50
        ? header.classList.add('scrolled')
        : header.classList.remove('scrolled');
    }
  }
  window.addEventListener('load', toggleScrolled);
  document.addEventListener('scroll', toggleScrolled);

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add('active')
        : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  }

  /**
   * AOS Animation init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * GLightbox init
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.glightbox' });
  }

  /**
   * Swiper init
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll('.init-swiper').forEach(function (swiperElement) {
      const configEl = swiperElement.querySelector('.swiper-config');
      if (!configEl) return;
      const config = JSON.parse(configEl.innerHTML.trim());
      new Swiper(swiperElement, config);
    });
  }
  window.addEventListener('load', initSwiper);

})();