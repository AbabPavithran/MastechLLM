/* ============================================================
   MASTECH TECHNICAL IRON WORKS L.L.C
   navbar.js  |  Shared Navbar Component with Company Dropdown
   
   USAGE — Add this to every HTML page <head>:
     <script src="assets/js/navbar.js" defer></script>
   
   Then place this single tag where the navbar should appear:
     <div id="navbar-mount"></div>
   
   The script auto-detects the page's depth relative to root
   and adjusts all hrefs accordingly. Pages at root: path=""
   Pages one level deep (e.g. /pages/about.html): path="../"
============================================================ */

(function () {
  "use strict";

  /* ── 1. Detect relative root path ─────────────────────────
     Counts directory depth of current page URL so links
     always resolve correctly from any subfolder.            */
  function getRootPath() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    return depth > 0 ? "../".repeat(depth) : "";
  }

  /* ── 2. Navbar HTML template ───────────────────────────── */
  function buildNavHTML(r) {
    return `
    <div class="progress-bar" id="progressBar"></div>

    <nav id="main-nav">
      <a href="${r}index.html" class="logo">
        MASTECH<span class="logo-dot"></span>
      </a>

      <div class="nav-links">
        <a href="${r}index.html">Home</a>
        <a href="${r}services.html">Services</a>
        <a href="${r}projects.html">Projects</a>

        <!-- Company dropdown -->
        <div class="nav-dropdown-wrap">
          <a href="#" class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false">
            Company
            <svg class="nav-dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <div class="nav-dropdown" role="menu">
            <a href="${r}company/trade-licenses.html"      role="menuitem">Trade Licenses</a>
            <a href="${r}company/membership-certificate.html" role="menuitem">Membership Certificate</a>
            <a href="${r}company/organization-chart.html"  role="menuitem">Organization Chart</a>
            <a href="${r}company/policies.html"            role="menuitem">Policies</a>
          </div>
        </div>

        <a href="${r}about.html">About</a>
        <a href="${r}contact.html">Contact</a>
      </div>

      <button class="nav-cta" onclick="window.location='${r}contact.html'">Get a Quote</button>

      <button class="nav-hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <!-- Mobile full-screen menu -->
    <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
      <a href="${r}index.html"    onclick="closeMobileMenu()">Home</a>
      <a href="${r}services.html" onclick="closeMobileMenu()">Services</a>
      <a href="${r}projects.html" onclick="closeMobileMenu()">Projects</a>

      <!-- Mobile Company accordion -->
      <div class="mobile-dropdown-wrap">
        <button class="mobile-dropdown-trigger" aria-expanded="false">
          Company
          <svg class="nav-dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="mobile-dropdown" aria-hidden="true">
          <a href="${r}company/trade-licenses.html"         onclick="closeMobileMenu()">Trade Licenses</a>
          <a href="${r}company/membership-certificate.html" onclick="closeMobileMenu()">Membership Certificate</a>
          <a href="${r}company/organization-chart.html"     onclick="closeMobileMenu()">Organization Chart</a>
          <a href="${r}company/policies.html"               onclick="closeMobileMenu()">Policies</a>
        </div>
      </div>

      <a href="${r}about.html"   onclick="closeMobileMenu()">About</a>
      <a href="${r}contact.html" onclick="closeMobileMenu()">Contact</a>
      <button class="mobile-cta" onclick="window.location='${r}contact.html'">Get a Quote</button>
    </div>
    `;
  }

  /* ── 3. Mount into DOM ─────────────────────────────────── */
  function mount() {
    const mount = document.getElementById("navbar-mount");
    if (!mount) {
      console.warn("[navbar.js] No #navbar-mount element found on this page.");
      return;
    }
    mount.innerHTML = buildNavHTML(getRootPath());
    initNavBehaviour();
  }

  /* ── 4. Behaviour: scroll, hamburger, dropdown ─────────── */
  function initNavBehaviour() {
    const nav         = document.getElementById("main-nav");
    const progressBar = document.getElementById("progressBar");
    const hamburger   = document.getElementById("hamburgerBtn");
    const mobileMenu  = document.getElementById("mobileMenu");

    /* Scroll: shrink nav + progress bar */
    function onScroll() {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 40);

      if (progressBar) {
        const scrolled = window.scrollY;
        const total    = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = total > 0 ? (scrolled / total * 100) + "%" : "0%";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Hamburger toggle */
    window.closeMobileMenu = function () {
      if (!hamburger || !mobileMenu) return;
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
    };

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", function () {
        const isOpen = mobileMenu.classList.toggle("open");
        hamburger.classList.toggle("open", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
        mobileMenu.setAttribute("aria-hidden",  String(!isOpen));
      });
    }

    /* Desktop dropdown: hover-intent with small delay */
    const dropWrap    = document.querySelector(".nav-dropdown-wrap");
    const dropTrigger = document.querySelector(".nav-dropdown-trigger");
    const dropdown    = document.querySelector(".nav-dropdown");

    if (dropWrap && dropdown) {
      let closeTimer;

      function openDrop() {
        clearTimeout(closeTimer);
        dropWrap.classList.add("open");
        if (dropTrigger) dropTrigger.setAttribute("aria-expanded", "true");
      }
      function closeDrop() {
        closeTimer = setTimeout(function () {
          dropWrap.classList.remove("open");
          if (dropTrigger) dropTrigger.setAttribute("aria-expanded", "false");
        }, 120);
      }

      dropWrap.addEventListener("mouseenter", openDrop);
      dropWrap.addEventListener("mouseleave", closeDrop);
      dropdown.addEventListener("mouseenter", openDrop);
      dropdown.addEventListener("mouseleave", closeDrop);

      /* Also allow click/tap on the trigger for keyboard + touch */
      if (dropTrigger) {
        dropTrigger.addEventListener("click", function (e) {
          e.preventDefault();
          const isOpen = dropWrap.classList.toggle("open");
          dropTrigger.setAttribute("aria-expanded", String(isOpen));
        });
      }

      /* Close on outside click */
      document.addEventListener("click", function (e) {
        if (!dropWrap.contains(e.target)) {
          dropWrap.classList.remove("open");
          if (dropTrigger) dropTrigger.setAttribute("aria-expanded", "false");
        }
      });

      /* Keyboard: Escape closes */
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          dropWrap.classList.remove("open");
          if (dropTrigger) {
            dropTrigger.setAttribute("aria-expanded", "false");
            dropTrigger.focus();
          }
        }
      });
    }

    /* Mobile dropdown accordion */
    const mobTrigger = document.querySelector(".mobile-dropdown-trigger");
    const mobDrop    = document.querySelector(".mobile-dropdown");

    if (mobTrigger && mobDrop) {
      mobTrigger.addEventListener("click", function () {
        const isOpen = mobDrop.classList.toggle("open");
        mobTrigger.classList.toggle("open", isOpen);
        mobTrigger.setAttribute("aria-expanded", String(isOpen));
        mobDrop.setAttribute("aria-hidden", String(!isOpen));
      });
    }

    /* Mark active nav link */
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(function (link) {
      const href = link.getAttribute("href") || "";
      if (href && href.split("/").pop() === currentPath) {
        link.classList.add("nav-active");
      }
    });
  }

  /* ── 5. Init ───────────────────────────────────────────── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();