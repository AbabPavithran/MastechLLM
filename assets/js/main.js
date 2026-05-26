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
  const pb = document.getElementById("progressBar");

  window.addEventListener(
    "scroll",
    () => {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
      if (pb) {
        const pct =
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100;
        pb.style.width = Math.min(pct, 100) + "%";
      }
    },
    { passive: true },
  );

  /* ============================================================
     2. MOBILE MENU TOGGLE
  ============================================================ */
  const hamburger = document.getElementById("navHamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a, button").forEach((el) => {
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
    ".reveal",
    ".reveal-left",
    ".reveal-right",
    ".reveal-scale",
    ".reveal-clip",
    ".reveal-blur",
    ".section-label",
    ".service-tile",
    ".cert-pill",
  ].join(", ");

  const revealEls = document.querySelectorAll(revealSelectors);
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.07, rootMargin: "0px 0px -36px 0px" },
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ============================================================
     4. LETTER SPLIT ANIMATION
  ============================================================ */
  function splitLetters(el) {
    const nodes = Array.from(el.childNodes);
    let charIndex = 0;
    const out = [];

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split("").forEach((ch) => {
          if (ch === " ") {
            out.push("&nbsp;");
          } else {
            out.push(
              `<span class="char" style="--i:${charIndex++}">${ch}</span>`,
            );
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const cls = node.className ? ` class="${node.className}"` : "";
        if (tag === "br") {
          out.push("<br>");
        } else {
          let inner = "";
          node.textContent.split("").forEach((ch) => {
            if (ch === " ") inner += "&nbsp;";
            else
              inner += `<span class="char" style="--i:${charIndex++}">${ch}</span>`;
          });
          out.push(`<${tag}${cls}>${inner}</${tag}>`);
        }
      }
    });

    el.innerHTML = out.join("");
  }

  document.querySelectorAll(".split-letters").forEach((el) => {
    splitLetters(el);
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.18 },
    );
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

    textNodes.forEach((tn) => {
      const frag = document.createDocumentFragment();
      tn.textContent.split(/(\s+)/).forEach((token) => {
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

  const wordSplitObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          wordSplitObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  document.querySelectorAll(".split-words").forEach((el) => {
    splitWords(el);
    wordSplitObs.observe(el);
  });

  /* ============================================================
     6. ANIMATED COUNTERS
  ============================================================ */
  function animCount(el, target, suffix) {
    const steps = 80;
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
    { id: "m1", target: 487, suffix: "" },
    { id: "m2", target: 12500, suffix: "" },
    { id: "m3", target: 98, suffix: "%" },
    { id: "m4", target: 32, suffix: "" },
  ];

  let metricsDone = false;
  const metricsSection = document.querySelector(".metrics-section");
  if (metricsSection) {
    new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !metricsDone) {
          metricsDone = true;
          metricMap.forEach(({ id, target, suffix }) => {
            const el = document.getElementById(id);
            if (el) animCount(el, target, suffix);
          });
        }
      },
      { threshold: 0.25 },
    ).observe(metricsSection);
  }

  /* ============================================================
     7. PARALLAX SCROLL EFFECTS
  ============================================================ */
  function onScroll() {
    const sy = window.scrollY;

    const heroBg = document.querySelector(".hero-bg-text");
    if (heroBg) heroBg.style.transform = `translateY(${sy * 0.14}px)`;

    const heroImg = document.querySelector(".hero-img");
    if (heroImg)
      heroImg.style.transform = `scale(1.08) translateY(${sy * 0.055}px)`;

    const cWord = document.querySelector(".contact-bg-word");
    if (cWord && cWord.parentElement) {
      const rect = cWord.parentElement.getBoundingClientRect();
      cWord.style.transform = `translateY(${-rect.top * 0.05}px)`;
    }

    // About visual parallax
    const aboutImg = document.querySelector(".about-visual img");
    if (aboutImg) {
      const rect = aboutImg.parentElement.getBoundingClientRect();
      const pct =
        1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
      aboutImg.style.transform = `scale(1.06) translateY(${(pct - 0.5) * 26}px)`;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============================================================
     8. MAGNETIC BUTTONS
  ============================================================ */
  document
    .querySelectorAll(
      ".btn-main, .btn-submit, .nav-cta, .btn-ghost, .btn-next, .btn-next-compact, .btn-submit-compact",
    )
    .forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.12;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.12;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });

  /* ============================================================
     9. PROJECT CARD 3D TILT
  ============================================================ */
  document.querySelectorAll(".project-item").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.12s linear";
    });
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
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
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          t.style.transitionDelay = `${idx * 0.07}s`;
          t.classList.add("visible");
          obs.unobserve(t);
        }
      },
      { threshold: 0.07 },
    );
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
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 4 + 1.5;
      const dur = 14 + Math.random() * 18;
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
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
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
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entry.style.transitionDelay = `${i * 0.09}s`;
          entry.classList.add("visible");
          obs.unobserve(entry);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(entry);
  });

  /* ============================================================
     15. CAPABILITIES INFINITE LOOP
  ============================================================ */
  // Duplicate cap-track items for seamless infinite scroll
  document.querySelectorAll(".cap-track").forEach((track) => {
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
  });

  /* ============================================================
     16. HERO STAT NUMBER HOVER POP
  ============================================================ */
  document.querySelectorAll(".hero-stat-num").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.style.transform = "scale(1.1)";
      el.style.transition = "transform .35s cubic-bezier(.2,.9,.4,1.2)";
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
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
  document.querySelectorAll(".process-step").forEach((step) => {
    step.addEventListener("mouseenter", () => {
      const sib = step.nextElementSibling;
      if (sib) {
        sib.style.borderLeftColor = "rgba(193,58,42,.26)";
        sib.style.transition = "border-left-color .4s";
      }
    });
    step.addEventListener("mouseleave", () => {
      const sib = step.nextElementSibling;
      if (sib) sib.style.borderLeftColor = "";
    });
  });

  /* ============================================================
     19. MULTI-STEP FORM ENGINE (Compact Contact Form)
  ============================================================ */
  window.goStep = function (targetStep) {
    const stepTitles = {
      1: [
        "What are you building?",
        "Select the service that best describes your project.",
      ],
      2: ["Project scope.", "Help us understand the scale and timeline."],
      3: ["Your details.", "Almost done — how should we reach you?"],
    };

    const currentPage = document.querySelector(".form-page:not(.hidden)");
    if (!currentPage) return;
    const currentStep = parseInt(currentPage.id.replace("step", ""));

    /* Validation before advancing */
    if (targetStep > currentStep) {
      /* Step 1: must select a service */
      if (currentStep === 1) {
        const checked = document.querySelector('input[name="service"]:checked');
        if (!checked) {
          const grid = document.getElementById("serviceSelectorGrid");
          if (grid) {
            grid.style.outline = "1px solid var(--rust)";
            grid.style.transition = "outline .2s";
            setTimeout(() => {
              grid.style.outline = "";
            }, 1400);
          }
          return;
        }
      }

      /* Step 2: project overview required */
      if (currentStep === 2) {
        const msg = document.getElementById("f-message");
        if (msg && !msg.value.trim()) {
          msg.focus();
          const row = msg.closest(".form-row-compact");
          if (row) flashError(row);
          return;
        }
      }

      /* Step 3: name, company, email required */
      if (currentStep === 3) {
        const required = currentPage.querySelectorAll("[required]");
        let hasError = false;
        required.forEach((el) => {
          if (!el.value.trim()) {
            hasError = true;
            el.focus();
            const row = el.closest(".form-row-compact");
            if (row) flashError(row);
          }
        });
        if (hasError) return;
      }
    }

    /* Switch pages */
    [1, 2, 3].forEach((n) => {
      const page = document.getElementById("step" + n);
      if (page) page.classList.toggle("hidden", n !== targetStep);
    });

    /* Update header text */
    const titleEl = document.getElementById("formStepTitle");
    const subEl = document.getElementById("formStepSub");
    if (titleEl && stepTitles[targetStep])
      titleEl.textContent = stepTitles[targetStep][0];
    if (subEl && stepTitles[targetStep])
      subEl.textContent = stepTitles[targetStep][1];

    /* Update step indicator dots */
    document.querySelectorAll(".form-step").forEach((el) => {
      const n = parseInt(el.dataset.step);
      el.classList.toggle("active", n === targetStep);
      el.classList.toggle("done", n < targetStep);
    });

    /* Update progress lines */
    const line1 = document.getElementById("formLine1");
    const line2 = document.getElementById("formLine2");
    if (line1) line1.classList.toggle("done", targetStep > 1);
    if (line2) line2.classList.toggle("done", targetStep > 2);
  };

  /* Flash error highlight on a form row */
  function flashError(row) {
    row.style.borderBottomColor = "var(--rust)";
    row.style.transition = "border-bottom-color .2s";
    setTimeout(() => {
      row.style.borderBottomColor = "";
    }, 1400);
  }

  /* ============================================================
     20. CONTACT FORM — VALIDATION & SUBMISSION (Compact Version)
  ============================================================ */
  (function initContactForm() {
    const form = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");
    if (!form) return;

    /* Real-time inline validation */
    function showError(row, msg) {
      let err = row.querySelector(".form-error-compact");
      if (!err) {
        err = document.createElement("span");
        err.className = "form-error-compact";
        row.appendChild(err);
      }
      err.textContent = msg;
    }

    function clearError(row) {
      const err = row.querySelector(".form-error-compact");
      if (err) err.remove();
    }

    function validateRow(row) {
      const input = row.querySelector(".form-input-compact, .select-compact");
      if (!input) return true;
      const val = input.value.trim();
      const label = (
        row.querySelector(".form-label-compact")?.textContent || "Field"
      ).replace(" *", "");
      clearError(row);

      if (input.hasAttribute("required") && !val) {
        showError(row, label + " is required.");
        return false;
      }
      if (
        input.type === "email" &&
        val &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
      ) {
        showError(row, "Enter a valid email address.");
        return false;
      }
      return true;
    }

    form.querySelectorAll(".form-row-compact").forEach((row) => {
      const input = row.querySelector(".form-input-compact, .select-compact");
      if (input) {
        input.addEventListener("blur", () => validateRow(row));
        input.addEventListener("input", () => clearError(row));
      }
    });

    /* Submit handler */
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      /* Validate all visible rows in step 3 */
      let valid = true;
      document
        .getElementById("step3")
        ?.querySelectorAll(".form-row-compact")
        .forEach((row) => {
          if (!validateRow(row)) valid = false;
        });

      if (!valid) return;

      /* Loading state */
      const btn = form.querySelector(".btn-submit-compact");
      if (btn) {
        btn.textContent = "SENDING...";
        btn.disabled = true;
        btn.style.opacity = "0.65";
      }

      /* Collect form data */
      const formData = {
        service: document.querySelector('input[name="service"]:checked')?.value,
        budget: document.getElementById("f-budget")?.value,
        timeline: document.getElementById("f-timeline")?.value,
        message: document.getElementById("f-message")?.value,
        name: document.getElementById("f-name")?.value,
        company: document.getElementById("f-company")?.value,
        email: document.getElementById("f-email")?.value,
        phone: document.getElementById("f-phone")?.value,
        source: document.getElementById("f-source")?.value,
      };

      console.log("Form submitted:", formData);

      /* Simulate async send — replace with actual fetch */
      setTimeout(() => {
        const formWrap = form;
        if (formWrap) {
          formWrap.style.opacity = "0";
          formWrap.style.transform = "translateY(16px)";
          formWrap.style.transition = "opacity .3s, transform .3s";
          setTimeout(() => {
            formWrap.style.display = "none";
            if (formSuccess) {
              formSuccess.classList.add("show");
              /* Reset form */
              form.reset();
              setTimeout(() => {
                window.goStep(1);
                const radios = document.querySelectorAll(
                  'input[name="service"]',
                );
                radios.forEach((r) => (r.checked = false));
              }, 100);
            }
          }, 300);
        }

        /* Reset button */
        if (btn) {
          btn.textContent = "Send Enquiry";
          btn.disabled = false;
          btn.style.opacity = "1";
        }
      }, 1500);
    });
  })();

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
  document.querySelectorAll(".section-label").forEach((el) => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
  });

  /* ============================================================
     24. NEWSLETTER FORM (footer)
  ============================================================ */
  const nlForm = document.querySelector(".footer-nl-form");
  if (nlForm) {
    nlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = nlForm.querySelector(".footer-nl-input");
      const btn = nlForm.querySelector(".footer-nl-btn");
      if (input && input.value.trim()) {
        btn.textContent = "✓ Done";
        btn.style.color = "var(--gold)";
        input.value = "";
        setTimeout(() => {
          btn.textContent = "Subscribe →";
          btn.style.color = "";
        }, 2500);
      }
    });
  }
  /* ============================================================
     CONTACT FORM - Horizontal Split Version
  ============================================================ */
  window.goToStep = function (step) {
    // Hide all steps
    document.querySelectorAll(".form-page").forEach((page) => {
      page.classList.add("hidden");
    });

    // Show selected step
    const targetPage = document.getElementById("step" + step);
    if (targetPage) {
      targetPage.classList.remove("hidden");
    }
  };

  // Initialize contact form
  (function initHorizontalContactForm() {
    const form = document.getElementById("contactForm");
    const successDiv = document.getElementById("formSuccess");
    if (!form) return;

    function showError(input, message) {
      const group = input.closest(".form-group");
      let error = group.querySelector(".form-error");
      if (!error) {
        error = document.createElement("span");
        error.className = "form-error";
        group.appendChild(error);
      }
      error.textContent = message;
    }

    function clearError(input) {
      const group = input.closest(".form-group");
      const error = group.querySelector(".form-error");
      if (error) error.remove();
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validate step 3 fields
      const name = document.getElementById("f-name");
      const company = document.getElementById("f-company");
      const email = document.getElementById("f-email");
      let isValid = true;

      [name, company, email].forEach((field) => {
        clearError(field);
        if (!field.value.trim()) {
          showError(field, "This field is required");
          isValid = false;
        }
      });

      if (email.value.trim() && !validateEmail(email.value.trim())) {
        showError(email, "Enter a valid email address");
        isValid = false;
      }

      // Validate service selection from step 1
      const selectedService = document.querySelector(
        'input[name="service"]:checked',
      );
      if (
        !selectedService &&
        document.getElementById("step1") &&
        !document.getElementById("step1").classList.contains("hidden")
      ) {
        // Show error on service selector
        isValid = false;
      }

      if (!isValid) return;

      // Collect data
      const formData = {
        service: document.querySelector('input[name="service"]:checked')?.value,
        budget: document.getElementById("f-budget")?.value,
        timeline: document.getElementById("f-timeline")?.value,
        message: document.getElementById("f-message")?.value,
        name: name?.value,
        company: company?.value,
        email: email?.value,
        phone: document.getElementById("f-phone")?.value,
        source: document.getElementById("f-source")?.value,
      };

      console.log("Form submitted:", formData);

      // Show loading state on button
      const submitBtn = form.querySelector('.submit-btn[type="submit"]');
      const originalText = submitBtn?.textContent;
      if (submitBtn) {
        submitBtn.textContent = "SENDING...";
        submitBtn.disabled = true;
      }

      // Simulate API call
      setTimeout(() => {
        form.style.display = "none";
        if (successDiv) {
          successDiv.classList.add("show");
        }

        // Reset form
        form.reset();
        window.goToStep(1);

        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }, 1500);
    });

    // Real-time validation on inputs
    document
      .querySelectorAll("#f-name, #f-company, #f-email")
      .forEach((input) => {
        input.addEventListener("input", () => clearError(input));
        input.addEventListener("blur", () => {
          if (
            input.id === "f-email" &&
            input.value.trim() &&
            !validateEmail(input.value.trim())
          ) {
            showError(input, "Enter a valid email address");
          } else if (!input.value.trim() && input.hasAttribute("required")) {
            showError(input, "This field is required");
          } else {
            clearError(input);
          }
        });
      });
  })();
  console.log("[MASTECH] main.js v2 — All systems go.");
})();
