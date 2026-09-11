/**
 * RK Marketing Media - High-Converting Business Landing Page Interactions
 * Features: Theme Toggle, Mobile Drawer, ScrollSpy, Stat Counters,
 * Portfolio Filters, Campaign Detail Modals, Form Validation, and Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initActiveNav();
  initScrollSpy();
  initStatsCounter();
  initPortfolioFilters();
  initPortfolioVideoPlayer();
  initCampaignModals();
  initInsightsLightbox();
  initAuditModal();
  initContactForm();
  initNewsletterForm();
  initDynamicYear();
  initFuturisticBackground();
  initFloatingSocialCursorTracking();
  initHeroTicker();
  initHeroHudToggles();
  initRoiSimulator();
  initGrowthEnginesTabs();
  initFaqAccordion();
  initScrollProgressBar();
  initScrollReveal();
  initBackToTop();
  initPageTransitions();
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
   3. Active Page Navigation & ScrollSpy
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  let pageName = currentPath.split('/').pop() || 'index.html';
  if (pageName === '' || pageName === '/' || pageName === 'index') {
    pageName = 'index.html';
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function updateLinks(links) {
    links.forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (!href) return;
      const cleanHref = href.split('#')[0].split('/').pop() || 'index.html';

      const isCurrent = (cleanHref === pageName) || 
                        (pageName === 'index.html' && (cleanHref === 'index.html' || cleanHref === ''));

      if (isCurrent) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  updateLinks(navLinks);
  updateLinks(drawerLinks);
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const drawerLinks = document.querySelectorAll('.drawer-link[href^="#"]');
  if (!navLinks.length && !drawerLinks.length) return;

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
   5. Portfolio / Creative Work Filtering
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
          const videoEl = card.querySelector('video');
          if (videoEl && !videoEl.paused) {
            videoEl.pause();
            const wrapper = card.querySelector('.portfolio-video-wrapper');
            if (wrapper) wrapper.classList.remove('is-playing');
            const playIcon = card.querySelector('.icon-play');
            const pauseIcon = card.querySelector('.icon-pause');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
          }
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5b. Portfolio Video Player Controls & State Management
   -------------------------------------------------------------------------- */
function initPortfolioVideoPlayer() {
  const video = document.getElementById('portfolioMainVideo');
  const wrapper = document.getElementById('portfolioVideoWrapper');
  const playOverlay = document.getElementById('videoPlayOverlay');
  const playToggleBtn = document.getElementById('vPlayToggle');
  const progressBar = document.getElementById('vProgressBar');
  const progressFilled = document.getElementById('vProgressFilled');
  const timeDisplay = document.getElementById('vTimeDisplay');
  const muteToggleBtn = document.getElementById('vMuteToggle');
  const fullscreenBtn = document.getElementById('vFullscreenBtn');

  if (!video || !wrapper) return;

  const iconPlay = playToggleBtn ? playToggleBtn.querySelector('.icon-play') : null;
  const iconPause = playToggleBtn ? playToggleBtn.querySelector('.icon-pause') : null;
  const iconVol = muteToggleBtn ? muteToggleBtn.querySelector('.icon-vol') : null;
  const iconMute = muteToggleBtn ? muteToggleBtn.querySelector('.icon-mute') : null;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play().then(() => {
        wrapper.classList.add('is-playing');
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';
      }).catch(() => {});
    } else {
      video.pause();
      wrapper.classList.remove('is-playing');
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
    }
  }

  if (playOverlay) {
    playOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
    playOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    });
  }

  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  video.addEventListener('click', () => {
    togglePlay();
  });

  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progressFilled) progressFilled.style.width = `${pct}%`;
    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
  });

  video.addEventListener('loadedmetadata', () => {
    if (timeDisplay && video.duration) {
      timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
    }
  });

  video.addEventListener('ended', () => {
    wrapper.classList.remove('is-playing');
    if (iconPlay) iconPlay.style.display = 'block';
    if (iconPause) iconPause.style.display = 'none';
  });

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (video.duration) {
        video.currentTime = Math.max(0, Math.min(pos * video.duration, video.duration));
      }
    });
  }

  if (muteToggleBtn) {
    muteToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (iconVol && iconMute) {
        if (video.muted) {
          iconVol.style.display = 'none';
          iconMute.style.display = 'block';
        } else {
          iconVol.style.display = 'block';
          iconMute.style.display = 'none';
        }
      }
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        if (wrapper.requestFullscreen) wrapper.requestFullscreen();
        else if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  let controlsTimeout;
  wrapper.addEventListener('mousemove', () => {
    wrapper.classList.add('is-controls-active');
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      wrapper.classList.remove('is-controls-active');
    }, 2800);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !video.paused) {
      video.pause();
      wrapper.classList.remove('is-playing');
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   6. Campaign Case Study Modal Details
   -------------------------------------------------------------------------- */
const campaignData = {
  1: {
    category: 'Reels, Shorts & Video Production',
    title: 'High-Retention Viral Reels, Shorts & Video Editing Showcase',
    client: 'RK Video Production Studio',
    year: '2026 Showcase',
    timeline: 'Master Compilation (10+ Mins)',
    impact: 'Over 10M+ Organic Views, 85%+ 3-Second Hook Retention',
    description: 'Our comprehensive video production showcase demonstrates our end-to-end capabilities across commercial video editing, Reels, YouTube Shorts, and high-converting creative ads. Every reel is engineered with psychology-backed pattern interrupt hooks, kinetic subtitle typography, color grading, sound design, and pacing tuned specifically for algorithmic reach and direct audience engagement.',
    technologies: ['4K Video Production', 'Motion Graphics', 'Psychological 3s Hooks', 'Viral Sound FX', 'Vertical Video CRO'],
    features: [
      'Comprehensive 10+ minute master reel compilation featuring real client deliverables',
      '3-second psychological hook formulas engineered to halt fast scrollers',
      'Kinetic typography, animated sound effects & dynamic transitions',
      'Multi-platform optimization for Instagram Reels, YouTube Shorts & Meta Video Ads'
    ]
  },
  2: {
    category: 'Content Writing & Brand Storytelling',
    title: 'High-Impact Brand Copywriting & Thought Leadership',
    client: 'Vanguard B2B Solutions',
    year: '2026',
    timeline: '3 Months',
    impact: '3.5x Lift in Engagement, 180% Inbound Inquiries',
    description: 'Developed an authoritative, persuasive brand voice across website landing pages, in-depth thought-leadership articles, and a weekly executive newsletter that established industry credibility and consistently converted readers into qualified leads.',
    technologies: ['Website Copywriting', 'Editorial Articles', 'Email Newsletters', 'Conversion Storytelling'],
    features: [
      'Customer persona research and brand voice guidelines',
      'High-converting landing page headlines and sales hooks',
      'Educational industry articles and executive guides',
      'Automated nurture email sequences and weekly newsletters'
    ]
  },
  3: {
    category: 'Content Writing & Video Scripting',
    title: 'Viral Short-Form Scripting & Psychological Opening Hooks',
    client: 'Digital Creators & Founders',
    year: '2025 - 2026',
    timeline: 'Ongoing',
    impact: '85%+ Average View Duration, 2.4x Follower Growth',
    description: 'Scripted retention-optimized short-form video concepts with calculated curiosity gaps, conversational language, and zero fluff. Designed to hook viewers in the first 3 seconds and keep them glued until the final call to action.',
    technologies: ['Reel & Short Scripting', 'Story Arc Architecture', 'Pattern Interrupts', 'Retention Strategy'],
    features: [
      '3-second hook variations tested across targeted audience segments',
      'Story arcs optimized for high algorithmic completion rate',
      'Frictionless call-to-action scripts driving profile visits & bio clicks',
      'Audience retention heat-mapping and continuous script iteration'
    ]
  },
  4: {
    category: 'Content Writing & Funnel Copy',
    title: 'High-Converting Landing Page & Sales Funnel Copy',
    client: 'Growth Brands & Startups',
    year: '2026',
    timeline: '45 Days',
    impact: '2.8x Lift in Form Submissions & Checkout Confidence',
    description: 'Crafted persuasive sales copy, overcome-objection FAQs, and compelling value propositions that clearly communicate the transformation offered by the brand and convert cold traffic into paying customers.',
    technologies: ['Sales Funnel Copywriting', 'Direct Response Copy', 'Landing Page Copy', 'Offer Positioning'],
    features: [
      'Clear, punchy above-the-fold value propositions answering visitor questions in seconds',
      'Psychological objection handling and strategic social proof placement',
      'Friction-free checkout and contact form microcopy',
      'A/B tested headline variations delivering up to 48% conversion lift'
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
    // Pause main portfolio video if playing
    const mainVid = document.getElementById('portfolioMainVideo');
    if (mainVid && !mainVid.paused) {
      mainVid.pause();
      const wrap = document.getElementById('portfolioVideoWrapper');
      if (wrap) wrap.classList.remove('is-playing');
      const pIcon = document.querySelector('.icon-play');
      const paIcon = document.querySelector('.icon-pause');
      if (pIcon) pIcon.style.display = 'block';
      if (paIcon) paIcon.style.display = 'none';
    }

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
   6b. Instagram Insights Screenshot Lightbox
   -------------------------------------------------------------------------- */
function initInsightsLightbox() {
  const modal = document.getElementById('insightLightboxModal');
  const backdrop = document.getElementById('insightLightboxBackdrop');
  const closeBtn = document.getElementById('insightLightboxClose');
  const img = document.getElementById('insightLightboxImg');
  const caption = document.getElementById('insightLightboxCaption');
  const insightCards = document.querySelectorAll('.insight-card');

  if (!modal || !img) return;

  function openLightbox(fullSrc, captionText) {
    // Pause main portfolio video if playing
    const mainVid = document.getElementById('portfolioMainVideo');
    if (mainVid && !mainVid.paused) {
      mainVid.pause();
      const wrap = document.getElementById('portfolioVideoWrapper');
      if (wrap) wrap.classList.remove('is-playing');
      const pIcon = document.querySelector('.icon-play');
      const paIcon = document.querySelector('.icon-pause');
      if (pIcon) pIcon.style.display = 'block';
      if (paIcon) paIcon.style.display = 'none';
    }

    img.src = fullSrc;
    img.alt = captionText || 'Instagram Insight Screenshot';
    if (caption) {
      caption.textContent = captionText || '';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  insightCards.forEach(card => {
    const triggerOpen = () => {
      const fullSrc = card.getAttribute('data-full') || card.querySelector('img')?.getAttribute('src');
      const captionText = card.getAttribute('data-caption') || card.querySelector('h4')?.textContent;
      if (fullSrc) {
        openLightbox(fullSrc, captionText);
      }
    };

    card.addEventListener('click', triggerOpen);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerOpen();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   6c. Free Growth Audit Modal Interaction
   -------------------------------------------------------------------------- */
function initAuditModal() {
  const modal = document.getElementById('auditModal');
  const closeBtn = document.getElementById('auditModalCloseBtn');
  const form = document.getElementById('auditModalForm');
  const submitBtn = document.getElementById('auditSubmitBtn');
  const headerBtn = document.getElementById('headerAuditBtn');
  const drawerBtn = document.getElementById('drawerAuditBtn');

  if (!modal) return;

  function openAuditModal() {
    // Pause main portfolio video if playing
    const mainVid = document.getElementById('portfolioMainVideo');
    if (mainVid && !mainVid.paused) {
      mainVid.pause();
      const wrap = document.getElementById('portfolioVideoWrapper');
      if (wrap) wrap.classList.remove('is-playing');
      const pIcon = document.querySelector('.icon-play');
      const paIcon = document.querySelector('.icon-pause');
      if (pIcon) pIcon.style.display = 'block';
      if (paIcon) paIcon.style.display = 'none';
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const nameInput = document.getElementById('auditFullName');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 150);
    }
  }

  function closeAuditModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (headerBtn) {
    headerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuditModal();
    });
  }

  if (drawerBtn) {
    drawerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const mobileDrawer = document.getElementById('mobileDrawer');
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
      openAuditModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeAuditModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAuditModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeAuditModal();
    }
  });

  if (form) {
    const nameInput = document.getElementById('auditFullName');
    const emailInput = document.getElementById('auditEmail');
    const phoneInput = document.getElementById('auditPhone');

    const nameError = document.getElementById('auditNameError');
    const emailError = document.getElementById('auditEmailError');
    const phoneError = document.getElementById('auditPhoneError');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous error states
      [nameInput, emailInput, phoneInput].forEach(inp => inp && inp.classList.remove('is-invalid'));
      [nameError, emailError, phoneError].forEach(err => err && (err.textContent = ''));

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, nameError, 'Please enter your full name.');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, nameError, 'Name must be at least 2 characters.');
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Please enter your email.');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate Phone
      const phoneVal = phoneInput.value.trim();
      const digits = phoneVal.replace(/\D/g, '');
      if (!phoneVal) {
        showError(phoneInput, phoneError, 'Please enter your phone/WhatsApp number.');
        isValid = false;
      } else if (digits.length < 7) {
        showError(phoneInput, phoneError, 'Please enter a valid phone number.');
        isValid = false;
      }

      if (!isValid) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        const clientName = nameInput.value.trim();
        form.reset();
        closeAuditModal();
        showToast(`Thank you, ${clientName}! Your Free Audit request has been received. We'll analyze your profile and contact you within 24 hours.`, 'success');
      }, 1000);
    });

    function showError(input, errorEl, message) {
      input.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = message;
    }
  }
}

/* --------------------------------------------------------------------------
   7. Contact Us Form Validation
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
      showToast(`Thank you, ${clientName}! Your message has been received. We'll be in touch within 24 hours.`, 'success');
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

/* --------------------------------------------------------------------------
   14. Hero Kinetic Dynamic Ticker
   -------------------------------------------------------------------------- */
function initHeroTicker() {
  const tickerEl = document.getElementById('heroTickerText');
  if (!tickerEl) return;

  const benchmarks = [
    '4.62x Average Client ROAS',
    '+428% Organic Reach Surge',
    '150+ Master Viral Reels Produced',
    '₹1.5Cr+ Scaled Ad Spend Pipeline',
    '0% Vanity Fluff Metrics',
    '98% Verified Client Retention'
  ];

  let idx = 0;
  setInterval(() => {
    tickerEl.style.opacity = '0';
    tickerEl.style.transform = 'translateY(6px)';
    setTimeout(() => {
      idx = (idx + 1) % benchmarks.length;
      tickerEl.textContent = benchmarks[idx];
      tickerEl.style.opacity = '1';
      tickerEl.style.transform = 'translateY(0)';
    }, 300);
  }, 3400);
}

/* --------------------------------------------------------------------------
   15. Hero Cyber HUD Channel Toggles
   -------------------------------------------------------------------------- */
function initHeroHudToggles() {
  const pills = document.querySelectorAll('.hud-tab-pill');
  const valEl = document.getElementById('hudMetricValue');
  const descEl = document.getElementById('hudMetricDesc');
  const tagEl = document.getElementById('hudMetricTag');
  if (!pills.length || !valEl) return;

  const channelData = {
    meta: {
      val: '4.62x',
      desc: 'Blended Meta Campaign ROAS (Last 30 Days)',
      tag: 'Live Meta Engine'
    },
    reels: {
      val: '+2.84M',
      desc: 'Organic Viral Reels Discovery & Views',
      tag: 'Viral Video Studio'
    },
    google: {
      val: '5.14x',
      desc: 'Search & High-Intent Shopping ROAS',
      tag: 'Google Scaling Engine'
    }
  };

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const ch = pill.getAttribute('data-hud-channel');
      const data = channelData[ch] || channelData.meta;
      if (valEl) valEl.textContent = data.val;
      if (descEl) descEl.textContent = data.desc;
      if (tagEl) tagEl.textContent = data.tag;
    });
  });
}

/* --------------------------------------------------------------------------
   16. Interactive Brand Growth & ROI Simulator
   -------------------------------------------------------------------------- */
function initRoiSimulator() {
  const budgetSlider = document.getElementById('roiBudgetSlider');
  const reachSlider = document.getElementById('roiReachSlider');
  const budgetVal = document.getElementById('roiBudgetValue');
  const reachVal = document.getElementById('roiReachValue');
  const projectedReach = document.getElementById('roiProjectedReach');
  const projectedRoas = document.getElementById('roiProjectedRoas');
  const projectedCac = document.getElementById('roiProjectedCac');
  const projectedGmv = document.getElementById('roiProjectedGmv');
  const surgeBadge = document.getElementById('roiReachSurgeBadge');
  const pillBtns = document.querySelectorAll('.roi-pill-btn');
  const claimBtn = document.getElementById('roiClaimRoadmapBtn');

  if (!budgetSlider || !reachSlider) return;

  let selectedModel = 'd2c';

  const modelConfigs = {
    d2c: {
      name: 'D2C E-Commerce',
      minRoas: 4.2,
      maxRoas: 5.8,
      reachMult: 4.5,
      cacDrop: '-42%',
      serviceId: 'ads'
    },
    creator: {
      name: 'Creator / Personal Brand',
      minRoas: 6.0,
      maxRoas: 8.5,
      reachMult: 6.2,
      cacDrop: '-55%',
      serviceId: 'reels'
    },
    b2b: {
      name: 'B2B & High-Ticket',
      minRoas: 3.8,
      maxRoas: 5.0,
      reachMult: 3.2,
      cacDrop: '-35%',
      serviceId: 'ads'
    },
    startup: {
      name: 'Startup & Scaleup',
      minRoas: 3.6,
      maxRoas: 5.2,
      reachMult: 4.8,
      cacDrop: '-38%',
      serviceId: 'ads'
    }
  };

  function formatINR(amount) {
    if (amount >= 10000000) {
      return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
    }
    if (amount >= 100000) {
      return '₹' + (amount / 100000).toFixed(1) + 'L';
    }
    return '₹' + amount.toLocaleString('en-IN');
  }

  function formatReach(views) {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(2) + 'M+';
    }
    if (views >= 100000) {
      return (views / 100000).toFixed(1) + 'L+';
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(0) + 'K+';
    }
    return views.toLocaleString();
  }

  function recalculate() {
    const budget = parseInt(budgetSlider.value, 10) || 100000;
    const reach = parseInt(reachSlider.value, 10) || 150000;
    const config = modelConfigs[selectedModel] || modelConfigs.d2c;

    if (budgetVal) {
      budgetVal.textContent = `₹${budget.toLocaleString('en-IN')} / mo`;
    }
    if (reachVal) {
      reachVal.textContent = `${reach >= 100000 ? (reach / 100000).toFixed(1) + 'L' : (reach / 1000).toFixed(0) + 'K'} Views / mo`;
    }

    const reachBoost = Math.round(reach * (config.reachMult * 0.7) + (budget / 8));
    const percentageSurge = Math.round(((reachBoost - reach) / Math.max(reach, 1)) * 100);

    const gmvLow = budget * config.minRoas;
    const gmvHigh = budget * config.maxRoas;

    if (projectedReach) projectedReach.textContent = formatReach(reachBoost);
    if (surgeBadge) surgeBadge.textContent = `+${Math.max(percentageSurge, 120)}% Expansion`;
    if (projectedRoas) projectedRoas.textContent = `${config.minRoas.toFixed(1)}x – ${config.maxRoas.toFixed(1)}x`;
    if (projectedCac) projectedCac.textContent = config.cacDrop;
    if (projectedGmv) projectedGmv.textContent = `${formatINR(gmvLow)} – ${formatINR(gmvHigh)}`;
  }

  budgetSlider.addEventListener('input', recalculate);
  reachSlider.addEventListener('input', recalculate);

  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      selectedModel = btn.getAttribute('data-model') || 'd2c';
      recalculate();
    });
  });

  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      const config = modelConfigs[selectedModel] || modelConfigs.d2c;
      const budget = parseInt(budgetSlider.value, 10) || 100000;
      const reach = parseInt(reachSlider.value, 10) || 150000;

      const auditService = document.getElementById('auditService');
      const auditNotes = document.getElementById('auditNotes');
      const auditModal = document.getElementById('auditModal');

      if (auditService) {
        auditService.value = config.serviceId;
      }
      if (auditNotes) {
        auditNotes.value = `Simulated Growth Plan for ${config.name} | Monthly Media Budget: ₹${budget.toLocaleString('en-IN')} | Current Reach: ${reach.toLocaleString()} views.`;
      }

      const headerAuditBtn = document.getElementById('headerAuditBtn');
      if (headerAuditBtn) {
        headerAuditBtn.click();
      } else if (auditModal) {
        auditModal.classList.add('open');
        auditModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  recalculate();
}

/* --------------------------------------------------------------------------
   17. The 4 Proprietary Growth Engines (Interactive Tabs)
   -------------------------------------------------------------------------- */
function initGrowthEnginesTabs() {
  const tabs = document.querySelectorAll('.engine-tab-btn');
  const panes = document.querySelectorAll('.engine-pane');
  if (!tabs.length || !panes.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetEngine = tab.getAttribute('data-engine');
      if (!targetEngine) return;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panes.forEach(pane => {
        const paneId = pane.getAttribute('id');
        const expectedId = `pane${targetEngine.charAt(0).toUpperCase() + targetEngine.slice(1)}`;
        if (paneId === expectedId) {
          pane.classList.add('active');
          pane.removeAttribute('hidden');
        } else {
          pane.classList.remove('active');
          pane.setAttribute('hidden', '');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   18. Interactive FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('#faqAccordion .faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items for a clean accordion effect
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          const otherAns = other.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.setAttribute('hidden', '');
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        ans.setAttribute('hidden', '');
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        ans.removeAttribute('hidden');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   19. Fiber-Optic Cyber Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgressBar() {
  let progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scrollProgressBar';
    progressBar.className = 'cyber-scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.prepend(progressBar);
  }

  let ticking = false;

  function updateProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/* --------------------------------------------------------------------------
   20. Scroll-Triggered Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const selectorTargets = [
    '.section-header',
    '.roi-controls-card',
    '.roi-results-card',
    '.engine-pane-grid',
    '.comparison-card',
    '.roadmap-step',
    '.faq-item',
    '.subpage-cta-banner',
    '.portfolio-card',
    '.service-card',
    '.insight-card',
    '.pillar-card',
    '.contact-card',
    '.advantage-card',
    '.framework-card',
    '.industry-card'
  ];

  const elements = document.querySelectorAll(selectorTargets.join(', '));
  if (!elements.length) return;

  // Assign staggered delays for sibling cards in the same grid/parent
  const parentGroups = new Map();

  elements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    const parent = el.parentElement;
    if (parent) {
      const count = parentGroups.get(parent) || 0;
      if (count < 5) {
        el.classList.add(`delay-${count + 1}`);
      }
      parentGroups.set(parent, count + 1);
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   21. Circular Back-to-Top Floating Progress Widget
   -------------------------------------------------------------------------- */
function initBackToTop() {
  let btn = document.getElementById('backToTopBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.innerHTML = `
      <svg class="back-to-top-progress-ring" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="16" pathLength="100"></circle>
      </svg>
      <svg class="back-to-top-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  const ringCircle = btn.querySelector('circle');
  let ticking = false;

  function updateBackToTop() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollY > 280) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }

    if (ringCircle) {
      const offset = 100 - Math.min(Math.max(progress, 0), 100);
      ringCircle.style.strokeDashoffset = offset;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateBackToTop);
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  updateBackToTop();
}

/* --------------------------------------------------------------------------
   22. Seamless High-Velocity Page Transitions
   -------------------------------------------------------------------------- */
function initPageTransitions() {
  // 1. Create top cyber beam and transition curtain
  let curtain = document.getElementById('pageTransitionCurtain');
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.id = 'pageTransitionCurtain';
    curtain.className = 'page-transition-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(curtain);
  }

  let beam = document.getElementById('pageTransitionBeam');
  if (!beam) {
    beam = document.createElement('div');
    beam.id = 'pageTransitionBeam';
    beam.className = 'page-transition-beam';
    beam.setAttribute('aria-hidden', 'true');
    document.body.appendChild(beam);
  }

  // Smooth entry animation on initial page load
  document.body.classList.add('page-entering');
  setTimeout(() => {
    document.body.classList.remove('page-entering');
  }, 400);

  // 2. Intercept internal page navigation links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore non-internal links
    if (
      href.startsWith('#') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      link.getAttribute('target') === '_blank' ||
      link.classList.contains('nav-cta') ||
      link.id === 'headerAuditBtn' ||
      link.id === 'drawerAuditBtn'
    ) {
      return;
    }

    const cleanHref = href.split('?')[0].split('#')[0];
    const currentClean = window.location.pathname.split('/').pop() || 'index.html';

    // If clicking current page link, just smoothly scroll to top
    if (cleanHref === currentClean) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    e.preventDefault();

    // Trigger high-speed cyber data beam and exit fade
    curtain.classList.add('active');
    beam.style.width = '100%';
    document.body.classList.add('page-exiting');

    setTimeout(() => {
      window.location.href = href;
    }, 220);
  });

  // 3. Reset on browser back/forward navigation (bfcache)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      curtain.classList.remove('active');
      beam.style.width = '0%';
      document.body.classList.remove('page-exiting');
      document.body.classList.add('page-entering');
      setTimeout(() => {
        document.body.classList.remove('page-entering');
      }, 350);
    }
  });
}
