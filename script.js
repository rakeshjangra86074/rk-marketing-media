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
  initFuturisticBackground();
  initFloatingSocialCursorTracking();
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
    description: 'Replaced traditional corporate promo videos with relatable, authentic video testimonials showcasing real career transitions. Scripted 28 psychological hook variations on Instagram Reels and YouTube Shorts that drove a viral wave of inbound sign-ups.',
    technologies: ['Instagram Reels Ads', 'YouTube Shorts', 'Video Production Studio', 'Typeform Funnels'],
    features: [
      'Psychological 3-second hook scripting formula',
      'Student career transition video case studies',
      'High-converting mobile-first webinar registration page',
      'Automated SMS & WhatsApp reminder sequences'
    ]
  },
  4: {
    category: 'Content Writing & Brand Storytelling',
    title: 'High-Impact Brand Copywriting & Thought Leadership',
    client: 'Vanguard B2B Solutions',
    year: '2026',
    timeline: '3 Months',
    impact: '3.5x Lift in Engagement, 180% Inbound Inquiries',
    description: 'Developed an authoritative, persuasive brand voice across website landing pages, in-depth thought-leadership articles, and a weekly executive newsletter that established industry credibility and consistently converted readers into qualified leads.',
    technologies: ['Website Copywriting', 'Editorial Content', 'Email Newsletters', 'Conversion Storytelling'],
    features: [
      'Customer persona research and brand voice guidelines',
      'High-converting landing page headlines and sales hooks',
      'Educational industry articles and executive guides',
      'Automated nurture email sequences and weekly newsletters'
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
    category: 'B2B Funnels & Conversion Optimization',
    title: 'B2B SaaS: 240% Lift in Inbound Qualified Demos',
    client: 'Zenith Cloud SaaS',
    year: '2024',
    timeline: '5 Months',
    impact: '240% Growth in Monthly Demos, 2.8x Conversion Rate',
    description: 'Conducted an exhaustive conversion-rate overhaul, designed 30 high-converting comparison and solution pages, and created an interactive ROI calculator that doubled demo request bookings from qualified visitors.',
    technologies: ['Landing Page CRO', 'Interactive ROI Calculator', 'Calendly Automated Routing', 'Hotjar Heatmaps'],
    features: [
      'High-intent comparison and solution page messaging',
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
          ${data.technologies.map(t => `<span class="tech-tag" style="background: rgba(211, 171, 85, 0.14); color: #f4d685; border: 1px solid rgba(211, 171, 85, 0.3);">${t}</span>`).join('')}
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

/* --------------------------------------------------------------------------
   11. Futuristic Neural Constellation Background Canvas
   -------------------------------------------------------------------------- */
function initFuturisticBackground() {
  const canvas = document.getElementById('futuristicBgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Retina display support
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  function setupCanvasSize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  setupCanvasSize();

  // Particle color palette derived from logo (Gold & Platinum)
  const colors = [
    'rgba(211, 171, 85, ',  // Primary gold
    'rgba(244, 214, 133, ', // Light golden champagne
    'rgba(255, 245, 197, ', // Bright gold highlight
    'rgba(181, 136, 50, ',  // Deep antique gold
    'rgba(226, 232, 240, '  // Subtle silver/platinum
  ];

  const mouse = {
    x: null,
    y: null,
    radius: 160,
    active: false
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
  });

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? 0 : width);
      this.y = Math.random() * height;
      const speed = Math.random() * 0.45 + 0.15;
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.baseRadius = Math.random() * 1.8 + 1.2;
      this.radius = this.baseRadius;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.3;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.currentAlpha = this.alpha;
    }

    update(tick) {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap-around screen bounds
      if (this.x < -20) this.x = width + 20;
      else if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      else if (this.y > height + 20) this.y = -20;

      // Subtle breathing pulse
      this.currentAlpha = this.alpha + Math.sin(tick * this.pulseSpeed + this.pulseOffset) * 0.2;
      if (this.currentAlpha < 0.1) this.currentAlpha = 0.1;

      // Interactive mouse attraction / gentle deflection
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = mouse.radius * mouse.radius;

        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / mouse.radius) * 0.02;
          this.x += dx * force;
          this.y += dy * force;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.colorBase}${this.currentAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(211, 171, 85, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Determine particle density based on viewport width
  function getParticleCount() {
    if (window.innerWidth < 480) return 26;
    if (window.innerWidth < 768) return 38;
    if (window.innerWidth < 1200) return 55;
    return 72;
  }

  let particles = [];
  function createParticles() {
    const count = getParticleCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  createParticles();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupCanvasSize();
      createParticles();
    }, 180);
  });

  // Main animation loop
  let tick = 0;
  let animId = null;
  const maxLineDist = 130;
  const maxLineDistSq = maxLineDist * maxLineDist;

  function render() {
    tick++;
    ctx.clearRect(0, 0, width, height);

    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    const baseAlphaScale = isLightMode ? 0.7 : 1;

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update(tick);
      p1.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxLineDistSq) {
          const dist = Math.sqrt(distSq);
          const lineAlpha = (1 - dist / maxLineDist) * 0.22 * baseAlphaScale;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(211, 171, 85, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw filament to cursor if in proximity
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p1.x;
        const dy = mouse.y - p1.y;
        const distSq = dx * dx + dy * dy;
        const mouseDist = 140;
        if (distSq < mouseDist * mouseDist) {
          const dist = Math.sqrt(distSq);
          const mouseLineAlpha = (1 - dist / mouseDist) * 0.45 * baseAlphaScale;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(244, 214, 133, ${mouseLineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(render);
    }
  }

  // If user prefers reduced motion, render one static frame
  if (prefersReducedMotion) {
    render();
    return;
  }

  render();

  // Pause when tab is inactive to save battery and CPU cycles
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(render);
    }
  });
}

/* --------------------------------------------------------------------------
   12. Interactive Cursor Tracking for Floating Social Media Holograms
   -------------------------------------------------------------------------- */
function initFloatingSocialCursorTracking() {
  const cards = document.querySelectorAll('.futuristic-social-card');
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Viewport dimensions & center
  let centerX = window.innerWidth / 2;
  let centerY = window.innerHeight / 2;

  let mouseX = centerX;
  let mouseY = centerY;
  let targetMouseX = centerX;
  let targetMouseY = centerY;
  let prevTargetMouseX = centerX;
  let prevTargetMouseY = centerY;
  let mouseVelocityX = 0;
  let mouseVelocityY = 0;
  let mouseActive = false;

  // Individual physical attributes & amplified parallax depths for each hologram
  const cardData = [
    { el: document.querySelector('.card-instagram'), depthX: -0.16, depthY: -0.14, speed: 0.0016, ampX: 22, ampY: 26, phase: 0 },
    { el: document.querySelector('.card-youtube'),   depthX: 0.20,  depthY: 0.16,  speed: 0.0014, ampX: 25, ampY: 30, phase: 1.8 },
    { el: document.querySelector('.card-facebook'),  depthX: -0.18, depthY: 0.18,  speed: 0.0015, ampX: 20, ampY: 24, phase: 3.2 },
    { el: document.querySelector('.card-linkedin'),  depthX: 0.17,  depthY: -0.17, speed: 0.0013, ampX: 24, ampY: 28, phase: 4.5 },
    { el: document.querySelector('.card-twitter'),   depthX: -0.22, depthY: -0.14, speed: 0.0017, ampX: 18, ampY: 26, phase: 2.3 },
    { el: document.querySelector('.card-viral'),     depthX: 0.18,  depthY: 0.20,  speed: 0.0015, ampX: 22, ampY: 25, phase: 5.1 }
  ].filter(item => item.el !== null);

  cardData.forEach(item => {
    item.currentX = 0;
    item.currentY = 0;
    item.currentRotateX = 0;
    item.currentRotateY = 0;
    item.currentScale = 1.0;
    item.baseX = 0;
    item.baseY = 0;
  });

  function recalculateBasePositions() {
    centerX = window.innerWidth / 2;
    centerY = window.innerHeight / 2;
    cardData.forEach(item => {
      const rect = item.el.getBoundingClientRect();
      item.baseX = (rect.left - item.currentX) + rect.width / 2;
      item.baseY = (rect.top - item.currentY) + rect.height / 2;
    });
  }

  // Calculate base positions after paint
  requestAnimationFrame(recalculateBasePositions);

  window.addEventListener('resize', () => {
    recalculateBasePositions();
  });

  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
    mouseActive = true;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      targetMouseX = e.touches[0].clientX;
      targetMouseY = e.touches[0].clientY;
      mouseActive = true;
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    targetMouseX = centerX;
    targetMouseY = centerY;
    mouseActive = false;
  });

  let startTime = performance.now();
  let animId = null;

  function animate(now) {
    const time = now - startTime;

    // Track cursor velocity for subtle kinetic impulse
    mouseVelocityX = (targetMouseX - prevTargetMouseX) * 0.25;
    mouseVelocityY = (targetMouseY - prevTargetMouseY) * 0.25;
    prevTargetMouseX = targetMouseX;
    prevTargetMouseY = targetMouseY;

    // Smooth lerp of mouse coordinates for silky inertia
    mouseX += (targetMouseX - mouseX) * 0.085;
    mouseY += (targetMouseY - mouseY) * 0.085;

    const relMouseX = mouseX - centerX;
    const relMouseY = mouseY - centerY;
    const isMobile = window.innerWidth < 768;
    const baseScale = isMobile ? 0.68 : 1.0;

    cardData.forEach(item => {
      // 1. Organic ambient floating oscillation
      const ambientX = Math.sin(time * item.speed + item.phase) * item.ampX;
      const ambientY = Math.cos(time * item.speed * 0.85 + item.phase) * item.ampY;

      // 2. Amplified parallax displacement driven by cursor movement
      const parallaxX = relMouseX * item.depthX;
      const parallaxY = relMouseY * item.depthY;

      // 3. Proximity repulsion & magnetic hover float
      let proximityRepelX = 0;
      let proximityRepelY = 0;
      let proximityRotX = 0;
      let proximityRotY = 0;
      let targetExtraScale = 1.0;

      if (mouseActive) {
        const visualCardX = item.baseX + item.currentX;
        const visualCardY = item.baseY + item.currentY;
        const distDx = visualCardX - mouseX;
        const distDy = visualCardY - mouseY;
        const dist = Math.hypot(distDx, distDy);
        const proximityRadius = 260;

        if (dist < proximityRadius && dist > 1) {
          const proximityFactor = Math.pow((proximityRadius - dist) / proximityRadius, 1.6);
          const repelForce = proximityFactor * 65; // Up to 65px float push
          proximityRepelX = (distDx / dist) * repelForce;
          proximityRepelY = (distDy / dist) * repelForce;

          // Holographic deflection tilt
          proximityRotX = -(distDy / dist) * proximityFactor * 24;
          proximityRotY = (distDx / dist) * proximityFactor * 24;

          // Responsive scale pulse when cursor is near
          targetExtraScale = 1.0 + proximityFactor * 0.16;
        }
      }

      // 4. Parallax 3D holographic tilt angles
      const generalRotateX = (relMouseY / (centerY || 1)) * 14 * (item.depthY > 0 ? 1 : -1);
      const generalRotateY = (relMouseX / (centerX || 1)) * -16 * (item.depthX > 0 ? 1 : -1);

      // Kinetic velocity wave impulse
      const impulseX = mouseVelocityX * (item.depthX * 0.7);
      const impulseY = mouseVelocityY * (item.depthY * 0.7);

      // Target composite position
      const targetX = ambientX + parallaxX + proximityRepelX + impulseX;
      const targetY = ambientY + parallaxY + proximityRepelY + impulseY;
      const targetRotateX = generalRotateX + proximityRotX;
      const targetRotateY = generalRotateY + proximityRotY;

      // Smooth inertia linear interpolation (lerp)
      item.currentX += (targetX - item.currentX) * 0.085;
      item.currentY += (targetY - item.currentY) * 0.085;
      item.currentRotateX += (targetRotateX - item.currentRotateX) * 0.085;
      item.currentRotateY += (targetRotateY - item.currentRotateY) * 0.085;
      item.currentScale += (targetExtraScale - item.currentScale) * 0.085;

      const finalScale = (baseScale * item.currentScale).toFixed(3);

      item.el.style.transform = `translate3d(${item.currentX.toFixed(2)}px, ${item.currentY.toFixed(2)}px, 0) rotateX(${item.currentRotateX.toFixed(2)}deg) rotateY(${item.currentRotateY.toFixed(2)}deg) scale(${finalScale})`;
    });

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(animate);
    }
  }

  if (prefersReducedMotion) {
    animate(performance.now());
    return;
  }

  animId = requestAnimationFrame(animate);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(animate);
    }
  });
}
