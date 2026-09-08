/**
 * RK Marketing Media - High-Converting Business Landing Page Interactions
 * Features: Theme Toggle, Mobile Drawer, ScrollSpy, Stat Counters,
 * Portfolio Filters, Campaign Detail Modals, Form Validation, and Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initStatsCounter();
  initPortfolioFilters();
  initCampaignModals();
  initContactForm();
  initNewsletterForm();
  initDynamicYear();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('rk_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else {
    root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('rk_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

  if (!hamburgerBtn || !mobileDrawer) return;

  function toggleMenu(isOpen) {
    const active = isOpen ?? !mobileDrawer.classList.contains('open');
    mobileDrawer.classList.toggle('open', active);
    hamburgerBtn.classList.toggle('active', active);
    hamburgerBtn.setAttribute('aria-expanded', active.toString());
    mobileDrawer.setAttribute('aria-hidden', (!active).toString());
    document.body.style.overflow = active ? 'hidden' : '';
  }

  hamburgerBtn.addEventListener('click', () => toggleMenu());

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open')) {
      if (!mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        toggleMenu(false);
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. ScrollSpy & Navigation Highlighting
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        drawerLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. Animated Stat Counters
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statsBar = document.getElementById('statsBar');
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statsBar || !statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(statEl => {
          const target = parseInt(statEl.getAttribute('data-target'), 10);
          animateCounter(statEl, target, 1600);
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsBar);

  function animateCounter(element, target, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      element.innerText = Math.floor(easedProgress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerText = target;
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* --------------------------------------------------------------------------
   5. Portfolio / Campaign Filtering
   -------------------------------------------------------------------------- */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Campaign Case Study Modal Details
   -------------------------------------------------------------------------- */
const campaignData = {
  1: {
    category: 'Performance Paid Ads',
    title: 'Scaling D2C Fashion from ₹6L to ₹42L/Month',
    client: 'Aura D2C Fashion',
    year: '2026',
    timeline: '90 Days',
    impact: '4.6x Blended ROAS, ₹42 Lakhs/Month Run-Rate',
    description: 'Aura was struggling with high customer acquisition costs (CAC) of ₹850 per order. RK Marketing Media completely revamped their creative testing matrix with 14 bespoke short-form UGC video hooks and implemented an Advantage+ Shopping dynamic catalog funnel that decreased CAC to ₹310 while scaling daily ad spend 7x profitably.',
    technologies: ['Meta Advantage+ Ads', 'Shopify Plus', 'Klaviyo Email Automations', 'Triple Whale Tracking'],
    features: [
      'Multi-tier creative testing testing 40+ ad angles weekly',
      'Dynamic product catalog retargeting abandoned carts',
      'High-converting checkout upsell funnel setup',
      'Post-purchase retention email sequences'
    ]
  },
  2: {
    category: 'High-Ticket Lead Generation',
    title: 'Luxury Real Estate: ₹18Cr Property Sales',
    client: 'Signature Heights Realty',
    year: '2025',
    timeline: '45 Days',
    impact: '680+ Verified Buyer Leads, ₹18Cr Units Sold',
    description: 'To sell luxury residential units priced at ₹2.5Cr+, generic lead forms were yielding poor quality contacts. We produced cinematic 4K video property tours paired with high-intent Google Search campaigns and an instant WhatsApp booking qualification funnel, filtering only high-net-worth buyers.',
    technologies: ['Google Search PPC', 'Meta Video Walkthroughs', 'WhatsApp Business API', 'HubSpot CRM'],
    features: [
      'Interactive 3D virtual tour landing page',
      'Instant automated WhatsApp concierge pre-qualification',
      'Hyper-targeted geo-fencing targeting luxury residential zones',
      'Custom CRM pipeline routing leads directly to sales executives'
    ]
  },
  3: {
    category: 'Viral UGC & Short-Form Video',
    title: 'Slashing Student Acquisition Cost by 54%',
    client: 'SkillMaster EdTech',
    year: '2025',
    timeline: '60 Days',
    impact: '54% Reduction in CPL, 22,000+ Webinar Attendees',
    description: 'Replaced traditional corporate promo videos with relatable, authentic UGC creator reviews showcasing student career transitions. Scripted 28 psychological hook variations on Instagram Reels and YouTube Shorts that drove a viral wave of inbound sign-ups.',
    technologies: ['Instagram Reels Ads', 'YouTube Shorts', 'UGC Creator Studio', 'Typeform Funnels'],
    features: [
      'Psychological 3-second hook scripting formula',
      'Micro-influencer student case study testimonials',
      'High-converting mobile-first webinar registration page',
      'Automated SMS & WhatsApp reminder sequences'
    ]
  },
  4: {
    category: 'Influencer & Creator Collaborations',
    title: '125,000 Verified App Installs in 60 Days',
    client: 'FinNest Banking App',
    year: '2026',
    timeline: '2 Months',
    impact: '125,000+ KYC-Completed Installs at ₹42 CPI',
    description: 'Executed an omnichannel creator campaign engaging 45 personal finance influencers across YouTube and Instagram. All creators were briefed with bespoke educational storylines highlighting zero-commission investing, tracked with individual referral links.',
    technologies: ['AppsFlyer Attribution', 'YouTube Sponsor Integrations', 'Meta Influencer Whitelisting'],
    features: [
      'Rigorous fake-follower & engagement rate auditing',
      'Influencer whitelisting ads running directly through creator handles',
      'Dedicated landing page matching each creator’s audience tone',
      'Real-time install and KYC verification tracking'
    ]
  },
  5: {
    category: 'Hyperlocal Growth & Meta Ads',
    title: 'Hyperlocal F&B Scale to 8 Locations',
    client: 'Gourmet Bites Cloud Kitchen',
    year: '2025',
    timeline: '4 Months',
    impact: '28,000+ Direct Orders, 3.8x ROAS on Delivery',
    description: 'Helped a premier cloud kitchen expand from 2 to 8 operational kitchens by deploying 3km-radius targeted Instagram Story ads offering time-sensitive lunch and dinner promo codes, bypassing 30% aggregator commissions.',
    technologies: ['Hyperlocal Radius Meta Ads', 'Direct WhatsApp Ordering', 'Food Motion Graphics'],
    features: [
      'Mouthwatering macro food cinematography & reels',
      'Lunch-hour and dinner-time dynamic ad scheduling',
      'Zero-commission direct WhatsApp ordering engine',
      'Automated repeat-order SMS loyalty triggers'
    ]
  },
  6: {
    category: 'B2B SEO & Growth Funnels',
    title: 'B2B SaaS: 240% Lift in Inbound Qualified Demos',
    client: 'Zenith Cloud SaaS',
    year: '2024',
    timeline: '5 Months',
    impact: '240% Growth in Monthly Demos, 1st Page Google Rankings',
    description: 'Conducted an exhaustive technical SEO overhaul, published 30 bottom-of-funnel comparison and alternative pages, and created an interactive ROI calculator that doubled conversion rates on demo request pages.',
    technologies: ['Technical SEO', 'Semrush', 'Calendly Automated Routing', 'Hotjar Heatmaps'],
    features: [
      'High-intent competitor alternative keyword ranking',
      'Interactive savings calculator embedded on landing page',
      'Automated instant Calendly self-booking workflow',
      'Frictionless 3-field demo request form optimization'
    ]
  }
};

function initCampaignModals() {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');
  const detailButtons = document.querySelectorAll('.view-details-btn');

  if (!modal || !modalBody) return;

  function openModal(campaignId) {
    const data = campaignData[campaignId];
    if (!data) return;

    modalBody.innerHTML = `
      <span class="modal-header-tag">${data.category}</span>
      <h3 class="modal-title" id="modalTitle">${data.title}</h3>
      
      <div class="modal-details-grid">
        <div class="modal-detail-item">
          <div class="m-label">Client</div>
          <div class="m-value">${data.client}</div>
        </div>
        <div class="modal-detail-item">
          <div class="m-label">Timeline</div>
          <div class="m-value">${data.timeline}</div>
        </div>
        <div class="modal-detail-item">
          <div class="m-label">Year</div>
          <div class="m-value">${data.year}</div>
        </div>
      </div>

      <p>${data.description}</p>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; margin-bottom: 8px; color: var(--text-primary);">Campaign Strategy & Execution:</h4>
        <ul style="list-style: none; padding-left: 0;">
          ${data.features.map(f => `<li style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-weight: bold;">✓</span> ${f}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="m-label" style="margin-bottom: 8px;">Platforms & Stack</div>
        <div class="modal-tech-list">
          ${data.technologies.map(t => `<span class="tech-tag" style="background: rgba(139, 92, 246, 0.14); color: #c084fc;">${t}</span>`).join('')}
        </div>
      </div>

      <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; gap: 10px;">
        <span style="color: #10b981; font-weight: 800; font-size: 1.1rem;">★ Verified Impact:</span>
        <span style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">${data.impact}</span>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openModal(id);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. Contact & Free Growth Audit Form Validation
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    clearErrors();

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Please enter your name.');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      showError(nameInput, nameError, 'Name must be at least 2 characters.');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, 'Please enter your business email.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, emailError, 'Please enter a valid work email address.');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showError(messageInput, messageError, 'Please tell us about your brand challenges and goals.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, messageError, 'Please share at least a sentence on your targets.');
      isValid = false;
    }

    if (!isValid) return;

    // Show simulated loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      const clientName = nameInput.value.trim();
      form.reset();
      showToast(`Thank you, ${clientName}! Your Growth Audit request is received. We'll be in touch within 24 hours.`, 'success');
    }, 1200);
  });

  function showError(input, errorEl, message) {
    input.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    [nameInput, emailInput, messageInput].forEach(inp => inp.classList.remove('is-invalid'));
    [nameError, emailError, messageError].forEach(err => {
      if (err) err.textContent = '';
    });
  }

  // Clear validation styling upon typing
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        input.classList.remove('is-invalid');
        const errEl = document.getElementById(`${input.id}Error`);
        if (errEl) errEl.textContent = '';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Growth Bulletin Newsletter Subscription
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value.trim()) {
      showToast(`Welcome! ${input.value.trim()} is now subscribed to RK Marketing Media insights!`, 'success');
      form.reset();
    }
  });
}

/* --------------------------------------------------------------------------
   9. Dynamic Year
   -------------------------------------------------------------------------- */
function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   10. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3800);
}
