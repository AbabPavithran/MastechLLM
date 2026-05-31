/* ============================================================
   MASTECH — main.js
   Extracted and cleaned from original inline script.
   No UI changes – all original behaviour preserved.
============================================================ */

(function() {
  "use strict";

  // ---------- UTILS ----------
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  function closeMobile() {
    const mobileMenu = $("#mobileMenu");
    const hamburger = $("#navHamburger");
    if (mobileMenu) mobileMenu.classList.remove("open");
    if (hamburger) hamburger.classList.remove("open");
    document.body.style.overflow = "";
  }

  // ---------- NAV SCROLL + PROGRESS BAR ----------
  const nav = $("#mainNav");
  const progressBar = $("#progressBar");
  window.addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
    if (progressBar) {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = pct + "%";
    }
    const backTop = $("#backTop");
    if (backTop) backTop.classList.toggle("visible", window.scrollY > 400);

    // update active nav link
    $$("section[id], div[id]").forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < 140 && top > -sec.offsetHeight + 140) {
        $$(".nav-links a").forEach(a => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + sec.id);
        });
      }
    });
  }, { passive: true });

  // ---------- MOBILE MENU ----------
  const hamburger = $("#navHamburger");
  const mobileMenu = $("#mobileMenu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });
    // close menu when any link/button inside is clicked
    mobileMenu.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("click", closeMobile);
    });
  }

  // ---------- SCROLL REVEAL ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible", "revealed");
        const lbl = e.target.closest("section,div")?.querySelector?.(".section-label");
        if (lbl) lbl.classList.add("visible");
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip, .reveal-blur").forEach(el => revealObserver.observe(el));

  const labelObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.5 });
  $$(".section-label").forEach(el => labelObserver.observe(el));

  // ---------- ANIMATED COUNTERS ----------
  function animateCount(el, target, duration = 1800) {
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      el.textContent = val;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      if (e.target.classList.contains("metric-num")) {
        const target = +e.target.dataset.count;
        if (target) {
          const unit = e.target.querySelector(".metric-unit");
          const unitHtml = unit ? unit.outerHTML : "";
          const tempSpan = document.createElement("span");
          tempSpan.textContent = "0";
          e.target.innerHTML = "";
          e.target.appendChild(tempSpan);
          if (unit) e.target.insertAdjacentHTML("beforeend", unitHtml);
          animateCount(tempSpan, target);
        }
        counterObserver.unobserve(e.target);
      } else if (e.target.closest(".hero-stats")) {
        const valEl = e.target.querySelector(".count-val");
        const target = +e.target.dataset.count;
        if (valEl && target) animateCount(valEl, target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  $$(".metric-num[data-count]").forEach(el => counterObserver.observe(el));
  $$(".hero-stat-num[data-count]").forEach(el => counterObserver.observe(el));

  // ---------- INDUSTRY TABS (bridge tabs) ----------
  $$(".bridge-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".bridge-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.industry;
      // add your filtering logic here if needed
    });
  });

  // ---------- SERVICE PILL FILTER (svc-pill) ----------
  $$(".svc-pill").forEach(btn => {
    btn.addEventListener("click", function() {
      $$(".svc-pill").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const filter = this.dataset.filter;
      $$(".svc-cell").forEach(cell => {
        cell.style.opacity = (filter === "all" || cell.dataset.cat === filter) ? "1" : "0.25";
        cell.style.pointerEvents = (filter === "all" || cell.dataset.cat === filter) ? "auto" : "none";
      });
    });
  });

  // ---------- SERVICE TABS (if any) ----------
  $$(".svc-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".svc-tab-btn").forEach(b => b.classList.remove("active"));
      $$(".services-grid-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const panel = document.getElementById("tab-" + btn.dataset.tab);
      if (panel) {
        panel.classList.add("active");
        $$(".service-tile", panel).forEach(t => {
          t.classList.remove("visible", "revealed");
          setTimeout(() => revealObserver.observe(t), 10);
        });
      }
    });
  });

  // ---------- PROJECT FILTER (legacy masonry) ----------
  $$(".proj-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".proj-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      $$(".project-item").forEach(item => {
        const match = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("hidden", !match);
      });
    });
  });

  // ---------- PROCESS ACCORDION ----------
  $$(".acc-header").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.closest(".acc-item");
      const isOpen = item.classList.contains("open");
      $$(".acc-item").forEach(i => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  // ---------- FORM SUBMIT (simple version) ----------
  window.handleSubmit = function(e) {
    e.preventDefault();
    $("#contactForm").style.display = "none";
    $("#successMsg").classList.add("show");
  };

  // ---------- HERO IMAGE PARALLAX ----------
  const heroImg = $("#heroImg");
  const heroRight = document.querySelector(".hero-right");
  if (heroImg && heroRight) {
    heroRight.addEventListener("mousemove", e => {
      const rect = heroRight.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImg.style.transform = `scale(1.1) translate(${x * 14}px, ${y * 10}px)`;
    });
    heroRight.addEventListener("mouseleave", () => {
      heroImg.style.transform = "scale(1.08)";
    });
  }

  // ---------- SERVICE TILE 3D TILT ----------
  $$(".service-tile").forEach(tile => {
    tile.addEventListener("mousemove", e => {
      const rect = tile.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tile.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    });
    tile.addEventListener("mouseleave", () => {
      tile.style.transform = "";
    });
  });

  // ---------- PROJECT CAROUSEL (filter, dots, arrows, drag) ----------
  const projCards = $$(".proj-card");
  const cardRevealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), i * 90);
        cardRevealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  projCards.forEach(c => cardRevealObs.observe(c));

  $$(".filter-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".filter-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      projCards.forEach(c => {
        const match = f === "all" || c.dataset.category === f;
        c.style.opacity = match ? "" : "0.25";
        c.style.pointerEvents = match ? "" : "none";
        c.style.transform = match ? "" : "scale(0.97)";
      });
    });
  });

  const track = $("#carouselTrack");
  const navDots = $$(".nav-dot");
  let current = 0;
  function scrollToCard(idx) {
    const cardEls = track ? track.querySelectorAll(".proj-card") : [];
    if (!cardEls[idx]) return;
    const cardW = cardEls[idx].offsetWidth + 20;
    track.scrollTo({ left: cardW * idx, behavior: "smooth" });
    navDots.forEach(d => d.classList.remove("active"));
    if (navDots[idx]) navDots[idx].classList.add("active");
    current = idx;
  }
  navDots.forEach(d => {
    d.addEventListener("click", () => scrollToCard(+d.dataset.index));
  });
  $("#nextBtn")?.addEventListener("click", () => scrollToCard(Math.min(current + 1, projCards.length - 1)));
  $("#prevBtn")?.addEventListener("click", () => scrollToCard(Math.max(current - 1, 0)));

  if (track) {
    track.addEventListener("scroll", () => {
      const cardW = (track.querySelectorAll(".proj-card")[0]?.offsetWidth ?? 0) + 20 || 1;
      const idx = Math.round(track.scrollLeft / cardW);
      if (idx !== current) {
        navDots.forEach(d => d.classList.remove("active"));
        if (navDots[idx]) navDots[idx].classList.add("active");
        current = idx;
      }
    }, { passive: true });

    // drag to scroll
    let isDown = false, startX, scrollLeft;
    track.addEventListener("mousedown", e => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.style.cursor = "grabbing";
    });
    track.addEventListener("mouseleave", () => { isDown = false; track.style.cursor = "grab"; });
    track.addEventListener("mouseup", () => { isDown = false; track.style.cursor = "grab"; });
    track.addEventListener("mousemove", e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  }

  // ---------- FLOATING PARTICLES ----------
  const pContainer = document.createElement("div");
  pContainer.className = "floating-particles";
  document.body.appendChild(pContainer);
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 4 + 1.5;
    p.style.cssText = `
      left:${Math.random() * 100}%;
      bottom:${Math.random() * 20}%;
      width:${size}px; height:${size}px;
      animation-duration:${8 + Math.random() * 14}s;
      animation-delay:${Math.random() * 12}s;
      --dx:${(Math.random() - 0.5) * 80}px;
      opacity:0;
    `;
    pContainer.appendChild(p);
  }

  // ---------- BACK TO TOP ----------
  $("#backTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ---------- BUTTON HANDLERS (replace inline onclicks) ----------
  // Hero buttons
  $(".hero-btn-primary")?.addEventListener("click", () => {
    document.querySelector(".services-section")?.scrollIntoView({ behavior: "smooth" });
  });
  $(".hero-btn-ghost")?.addEventListener("click", () => scrollTo("contact"));

  // Nav CTA
  $(".nav-cta")?.addEventListener("click", () => scrollTo("contact"));

  // Mobile CTA
  $(".mobile-cta")?.addEventListener("click", () => {
    scrollTo("contact");
    closeMobile();
  });

  // About CTA buttons
  $(".hm-btn-primary")?.addEventListener("click", () => {
    document.querySelector(".services-section")?.scrollIntoView({ behavior: "smooth" });
  });
  $(".btn-link-inline")?.addEventListener("click", () => {
    // company profile link – currently logs; replace with actual URL if needed
    console.log("Company profile clicked");
  });

  // CTA split button
  $(".cta-left-btn")?.addEventListener("click", () => scrollTo("contact"));

  // Bridge search button placeholder
  $(".bridge-search-btn")?.addEventListener("click", () => {
    const input = $(".bridge-search-input");
    if (input && input.value.trim()) {
      console.log("Searching for:", input.value.trim());
      // implement actual search if required
    }
  });

  // close mobile menu when nav-links are clicked
  $$(".nav-links a").forEach(link => {
    link.addEventListener("click", closeMobile);
  });

  console.log("[MASTECH] main.js loaded – all systems operational.");
})();