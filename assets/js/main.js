/* ============================================================
   MASTECH TECHNICAL IRON WORKS L.L.C
   main.js  |  Animation Engine — Premium v2
   No custom cursor. All bugs fixed. Loop animations added.
============================================================ */

(function () {
  "use strict";

  /* ============================================================
     1. NAV SCROLL + PROGRESS BAR
  ============================================================ */
  const nav = document.getElementById("mainNav");
  const pb  = document.getElementById("progressBar");

  window.addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
    if (pb) {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      pb.style.width = Math.min(pct, 100) + "%";
    }
  }, { passive: true });

  /* ============================================================
     2. MOBILE MENU TOGGLE
  ============================================================ */
  const hamburger  = document.getElementById("navHamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ============================================================
     3. SCROLL REVEAL
  ============================================================ */
  const revealSelectors = [
    ".reveal", ".reveal-left", ".reveal-right",
    ".reveal-scale", ".reveal-clip", ".reveal-blur",
    ".section-label", ".service-tile", ".cert-pill"
  ].join(", ");

  const revealEls = document.querySelectorAll(revealSelectors);
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.07, rootMargin: "0px 0px -36px 0px" }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  /* ============================================================
     4. LETTER SPLIT ANIMATION
  ============================================================ */
  function splitLetters(el) {
    const nodes = Array.from(el.childNodes);
    let charIndex = 0;
    const out = [];

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split("").forEach(ch => {
          if (ch === " ") {
            out.push("&nbsp;");
          } else {
            out.push(`<span class="char" style="--i:${charIndex++}">${ch}</span>`);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const cls = node.className ? ` class="${node.className}"` : "";
        if (tag === "br") {
          out.push("<br>");
        } else {
          let inner = "";
          node.textContent.split("").forEach(ch => {
            if (ch === " ") inner += "&nbsp;";
            else inner += `<span class="char" style="--i:${charIndex++}">${ch}</span>`;
          });
          out.push(`<${tag}${cls}>${inner}</${tag}>`);
        }
      }
    });

    el.innerHTML = out.join("");
  }

  document.querySelectorAll(".split-letters").forEach(el => {
    splitLetters(el);
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.classList.add("visible");
        obs.unobserve(el);
      }
    }, { threshold: 0.18 });
    obs.observe(el);
  });

  /* ============================================================
     5. WORD SPLIT ANIMATION
  ============================================================ */
  function splitWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(tn => {
      const frag = document.createDocumentFragment();
      tn.textContent.split(/(\s+)/).forEach(token => {
        if (/^\s+$/.test(token)) {
          frag.appendChild(document.createTextNode(token));
        } else if (token) {
          const outer = document.createElement("span");
          outer.className = "word";
          const inner = document.createElement("span");
          inner.textContent = token;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
      });
      tn.parentNode.replaceChild(frag, tn);
    });
  }

  const wordSplitObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        wordSplitObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".split-words").forEach(el => {
    splitWords(el);
    wordSplitObs.observe(el);
  });

  /* ============================================================
     6. ANIMATED COUNTERS
  ============================================================ */
  function animCount(el, target, suffix) {
    const steps    = 80;
    const interval = 1800 / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur += target / steps;
      if (cur >= target) {
        clearInterval(timer);
        el.textContent = Number(target).toLocaleString() + (suffix || "");
      } else {
        el.textContent = Math.floor(cur).toLocaleString() + (suffix || "");
      }
    }, interval);
  }

  const metricMap = [
    { id: "m1", target: 487,   suffix: "" },
    { id: "m2", target: 12500, suffix: "" },
    { id: "m3", target: 98,    suffix: "%" },
    { id: "m4", target: 32,    suffix: "" },
  ];

  let metricsDone = false;
  const metricsSection = document.querySelector(".metrics-section");
  if (metricsSection) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !metricsDone) {
        metricsDone = true;
        metricMap.forEach(({ id, target, suffix }) => {
          const el = document.getElementById(id);
          if (el) animCount(el, target, suffix);
        });
      }
    }, { threshold: 0.25 }).observe(metricsSection);
  }

  /* ============================================================
     7. PARALLAX SCROLL EFFECTS
  ============================================================ */
  function onScroll() {
    const sy = window.scrollY;

    const heroBg = document.querySelector(".hero-bg-text");
    if (heroBg) heroBg.style.transform = `translateY(${sy * 0.14}px)`;

    const heroImg = document.querySelector(".hero-img");
    if (heroImg) heroImg.style.transform = `scale(1.08) translateY(${sy * 0.055}px)`;

    const cWord = document.querySelector(".contact-bg-word");
    if (cWord && cWord.parentElement) {
      const rect = cWord.parentElement.getBoundingClientRect();
      cWord.style.transform = `translateY(${-rect.top * 0.05}px)`;
    }

    // About visual parallax
    const aboutImg = document.querySelector(".about-visual img");
    if (aboutImg) {
      const rect = aboutImg.parentElement.getBoundingClientRect();
      const pct = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
      aboutImg.style.transform = `scale(1.06) translateY(${(pct - 0.5) * 26}px)`;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============================================================
     8. MAGNETIC BUTTONS
  ============================================================ */
  document.querySelectorAll(".btn-main, .btn-submit, .nav-cta, .btn-ghost").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.12;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.12;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  /* ============================================================
     9. PROJECT CARD 3D TILT
  ============================================================ */
  document.querySelectorAll(".project-item").forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.12s linear";
    });
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform .65s cubic-bezier(0.2, 0.9, 0.4, 1)";
      card.style.transform = "";
    });
  });

  /* ============================================================
     10. SERVICE TILE STAGGER
  ============================================================ */
  const tiles = document.querySelectorAll(".service-tile");
  tiles.forEach((t, idx) => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        t.style.transitionDelay = `${idx * 0.07}s`;
        t.classList.add("visible");
        obs.unobserve(t);
      }
    }, { threshold: 0.07 });
    obs.observe(t);
  });

  /* ============================================================
     11. CERT PILLS STAGGER
  ============================================================ */
  document.querySelectorAll(".cert-pill").forEach((pill, i) => {
    pill.style.transitionDelay = `${i * 0.06}s`;
  });

  /* ============================================================
     12. FLOATING PARTICLES — varied speeds & sizes
  ============================================================ */
  const particlesContainer = document.getElementById("particles");
  if (particlesContainer) {
    for (let i = 0; i < 32; i++) {
      const p    = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 4 + 1.5;
      const dur  = 14 + Math.random() * 18;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        animation-duration:${dur}s;
        animation-delay:${Math.random() * dur}s;
        opacity:${0.14 + Math.random() * 0.24};
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ============================================================
     13. SMOOTH SCROLL ANCHORS
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href   = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ============================================================
     14. TIMELINE STAGGER REVEAL
  ============================================================ */
  document.querySelectorAll(".timeline-entry").forEach((entry, i) => {
    entry.classList.add("reveal");
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        entry.style.transitionDelay = `${i * 0.09}s`;
        entry.classList.add("visible");
        obs.unobserve(entry);
      }
    }, { threshold: 0.1 });
    obs.observe(entry);
  });

  /* ============================================================
     15. CAPABILITIES INFINITE LOOP
  ============================================================ */
  // Duplicate cap-track items for seamless infinite scroll
  document.querySelectorAll(".cap-track").forEach(track => {
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
  });

  /* ============================================================
     16. HERO STAT NUMBER HOVER POP
  ============================================================ */
  document.querySelectorAll(".hero-stat-num").forEach(el => {
    el.addEventListener("mouseenter", () => {
      el.style.transform = "scale(1.1)";
      el.style.transition = "transform .35s cubic-bezier(.2,.9,.4,1.2)";
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });

  /* ============================================================
     17. CAP ITEM REVEAL
  ============================================================ */
  document.querySelectorAll(".cap-item").forEach((item, i) => {
    item.classList.add("reveal");
    item.style.transitionDelay = `${i * 0.06}s`;
    revealObserver.observe(item);
  });

  /* ============================================================
     18. PROCESS STEP HOVER CONNECTOR
  ============================================================ */
  document.querySelectorAll(".process-step").forEach(step => {
    step.addEventListener("mouseenter", () => {
      const sib = step.nextElementSibling;
      if (sib) { sib.style.borderLeftColor = "rgba(193,58,42,.26)"; sib.style.transition = "border-left-color .4s"; }
    });
    step.addEventListener("mouseleave", () => {
      const sib = step.nextElementSibling;
      if (sib) sib.style.borderLeftColor = "";
    });
  });

  /* ============================================================
     19. MULTI-STEP FORM ENGINE
  ============================================================ */
  window.goStep = function (step) {
    const steps  = [1, 2, 3];
    const titles = {
      1: ["What are you building?",    "Select the service that best describes your project."],
      2: ["Project scope.",            "Help us understand the scale and timeline."],
      3: ["Your details.",             "Almost done — how should we reach you?"],
    };

    // Validate current step before advancing
    const currentPage = document.querySelector(".form-page:not(.hidden)");
    if (currentPage && step > parseInt(currentPage.id.replace("step", ""))) {
      if (currentPage.id === "step1") {
        const checked = currentPage.querySelector('input[name="service"]:checked');
        if (!checked) {
          const grid = currentPage.querySelector(".service-selector-grid");
          grid.style.outline = "1px solid var(--rust)";
          setTimeout(() => grid.style.outline = "", 1200);
          return;
        }
      }
      const required = currentPage.querySelectorAll("[required]");
      for (const el of required) {
        if (!el.value.trim()) {
          el.focus();
          const row = el.closest(".form-row");
          if (row) {
            row.style.borderBottomColor = "var(--rust)";
            setTimeout(() => row.style.borderBottomColor = "", 1200);
          }
          return;
        }
      }
    }

    // Switch pages
    steps.forEach(s => {
      const page = document.getElementById("step" + s);
      if (page) page.classList.toggle("hidden", s !== step);
    });

    // Update header
    const titleEl = document.getElementById("formStepTitle");
    const subEl   = document.getElementById("formStepSub");
    if (titleEl && titles[step]) titleEl.textContent = titles[step][0];
    if (subEl   && titles[step]) subEl.textContent   = titles[step][1];

    // Update indicators
    document.querySelectorAll(".form-step").forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.toggle("active", s === step);
      el.classList.toggle("done",   s <  step);
    });
    document.querySelectorAll(".form-step-line").forEach((line, i) => {
      line.classList.toggle("done", i + 1 < step);
    });
  };

  /* ============================================================
     20. CONTACT FORM — VALIDATION & SUBMISSION
  ============================================================ */
  const form        = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (form) {
    function showError(row, msg) {
      let err = row.querySelector(".form-error");
      if (!err) {
        err = document.createElement("span");
        err.className = "form-error";
        err.style.cssText = "font-size:.58rem;color:#c13a2a;letter-spacing:1px;margin-top:3px;display:block;";
        row.appendChild(err);
      }
      err.textContent = msg;
    }
    function clearError(row) {
      const err = row.querySelector(".form-error");
      if (err) err.remove();
    }
    function validateRow(row) {
      const input = row.querySelector(".form-input, .form-select");
      if (!input) return true;
      const val   = input.value.trim();
      const label = row.querySelector(".form-label")?.textContent || "Field";
      clearError(row);
      if (input.hasAttribute("required") && !val) { showError(row, label + " is required"); return false; }
      if (input.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showError(row, "Enter a valid email address"); return false;
      }
      return true;
    }

    form.querySelectorAll(".form-row").forEach(row => {
      const input = row.querySelector(".form-input, .form-select");
      if (input) {
        input.addEventListener("blur",  () => validateRow(row));
        input.addEventListener("input", () => clearError(row));
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll(".form-row").forEach(row => { if (!validateRow(row)) valid = false; });
      if (!valid) return;

      const btn = form.querySelector(".btn-submit");
      btn.textContent = "Sending…";
      btn.disabled    = true;
      btn.style.opacity = "0.65";

      setTimeout(() => {
        form.style.cssText = "opacity:0;transform:translateY(16px);transition:opacity .4s, transform .4s;";
        setTimeout(() => {
          form.style.display = "none";
          if (formSuccess) formSuccess.classList.add("show");
        }, 420);
      }, 1400);
    });
  }

  /* ============================================================
     21. FOOTER REVEAL
  ============================================================ */
  const footerMain = document.querySelector(".footer-main");
  if (footerMain) {
    footerMain.classList.add("reveal");
    revealObserver.observe(footerMain);
  }

  /* ============================================================
     22. TICKER PAUSE ON HOVER (already CSS — JS fallback)
  ============================================================ */
  // Already handled via CSS :hover on .ticker-inner

  /* ============================================================
     23. SECTION LABEL LINE TRIGGER
  ============================================================ */
  document.querySelectorAll(".section-label").forEach(el => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.classList.add("visible");
        obs.unobserve(el);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* ============================================================
     24. NEWSLETTER FORM (footer)
  ============================================================ */
  const nlForm = document.querySelector(".footer-nl-form");
  if (nlForm) {
    nlForm.addEventListener("submit", e => {
      e.preventDefault();
      const input = nlForm.querySelector(".footer-nl-input");
      const btn   = nlForm.querySelector(".footer-nl-btn");
      if (input && input.value.trim()) {
        btn.textContent = "✓ Done";
        btn.style.color = "var(--gold)";
        input.value = "";
        setTimeout(() => { btn.textContent = "Subscribe →"; btn.style.color = ""; }, 2500);
      }
    });
  }

  console.log("[MASTECH] main.js v2 — All systems go.");
})();