/**
* Project      : Mastech Technical Iron Works
* File         : main.js
* Description  : Animation Engine (Industrial Editorial)
*/

(function () {
  "use strict";

  /**
   * GSAP & ScrollTrigger Animations
   */
  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Cinematic Animation (Zoom & Reveal)
    gsap.to(".hero-bg-image", {
      scale: 1.2,
      y: "10%",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-editorial",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // 2. Text Reveal Animation for Headlines
    gsap.utils.toArray(".section-title").forEach(title => {
      gsap.from(title, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: title,
          start: "top 90%"
        }
      });
    });

    // 3. Parallax Images with Smoother Scrub
    document.querySelectorAll('.parallax-img').forEach(img => {
      gsap.to(img, {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    });

    // 5. Services Section Background Activation
    const servicesSection = document.querySelector('.services-theme');
    if (servicesSection) {
      ScrollTrigger.create({
        trigger: servicesSection,
        start: "top 70%",
        onEnter: () => servicesSection.classList.add('active'),
        once: true
      });
    }
  }

  /**
   * Header Behavior
   */
  function initHeader() {
    const header = document.querySelector('#header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  /**
   * Mobile Navigation
   */
  function initMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const body = document.querySelector('body');
    const navLinks = document.querySelectorAll('.navmenu a');

    if (toggle) {
      toggle.addEventListener('click', () => {
        body.classList.toggle('mobile-nav-active');
        toggle.classList.toggle('bi-list');
        toggle.classList.toggle('bi-x');
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (body.classList.contains('mobile-nav-active')) {
          body.classList.remove('mobile-nav-active');
          toggle.classList.add('bi-list');
          toggle.classList.remove('bi-x');
        }
      });
    });
  }

  /**
   * Preloader Transition
   */
  function initPreloader() {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.classList.add('loaded');
          // Initialize animations after preloader clears
          initAnimations();
          AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
          });
        }, 1000);
      });
    }
  }

  /**
   * Interactive Text (Letter splitting)
   */
  function initInteractiveText() {
    const containers = document.querySelectorAll('.interactive-text');
    containers.forEach(container => {
      const text = container.textContent;
      container.innerHTML = '';
      [...text].forEach(char => {
        const span = document.createElement('span');
        span.className = 'hover-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        container.appendChild(span);
      });
    });
  }

  /**
   * Run All
   */
  document.addEventListener('DOMContentLoaded', () => {
    initInteractiveText();
    initHeader();
    initMobileNav();
    initPreloader();
  });

})();