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
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play reverse play reverse"
        }
      });
    });

    // 2b. Paragraph & List Reveal
    gsap.utils.toArray(".chapter-section").forEach(section => {
      const texts = section.querySelectorAll('p, ul li, .tagline-ui');
      if(texts.length > 0) {
        gsap.from(texts, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play reverse play reverse"
          }
        });
      }
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
            duration: 800,
            easing: 'ease-out-cubic',
            once: false,
            mirror: true,
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
   * Interactive 3D Tilt for Service Cards
   */
  function init3DTilt() {
    const cards = document.querySelectorAll('.service-card-new');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate tilt angles based on mouse position relative to center
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
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
    init3DTilt();
  });

})();