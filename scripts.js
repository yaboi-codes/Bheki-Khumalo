/* ═══════════════════════════════════════════════
   BHEKI KHUMALO — scripts.js
   Features:
   - Sticky navbar with scroll effect
   - Mobile nav toggle
   - Active nav link on scroll
   - Scroll-triggered timeline card animations
   - Smooth scroll offset for fixed nav
   - Contact form handler with validation
   - Footer year auto-update
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Footer year ─────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─── Navbar scroll effect ────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


  /* ─── Mobile nav toggle ───────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });


  /* ─── Active nav link on scroll ──────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navAnchors  = document.querySelectorAll('.nav-links a');
  const NAV_OFFSET  = 80; // px below nav to trigger

  const setActiveLink = () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= NAV_OFFSET) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ─── Smooth scroll with nav offset ──────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const topPos = target.getBoundingClientRect().top
                   + window.scrollY
                   - parseInt(getComputedStyle(document.documentElement)
                       .getPropertyValue('--nav-h')) - 8;

      window.scrollTo({ top: topPos, behavior: 'smooth' });
    });
  });


  /* ─── Timeline scroll-in animation ───────── */
  const timelineItems = document.querySelectorAll('.timeline-item[data-animate]');

  if ('IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // stagger each card slightly
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, i * 80);
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    timelineItems.forEach(item => timelineObserver.observe(item));

  } else {
    // Fallback: show all immediately
    timelineItems.forEach(item => item.classList.add('visible'));
  }


  /* ─── General fade-in for sections ───────── */
  const fadeEls = document.querySelectorAll(
    '#about .about-photo-col, #about .about-text-col, .exp-header, .connect-text, .connect-form'
  );

  fadeEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity   = '1';
              entry.target.style.transform = 'translateY(0)';
            }, i * 120);
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    fadeEls.forEach(el => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    });
  }


  /* ─── Hero entrance animation ─────────────── */
  const heroPhoto   = document.querySelector('.hero-photo-wrap');
  const heroContent = document.querySelector('.hero-content');

  if (heroPhoto && heroContent) {
    heroPhoto.style.opacity   = '0';
    heroPhoto.style.transform = 'translateX(-30px)';
    heroPhoto.style.transition = 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s';

    heroContent.style.opacity   = '0';
    heroContent.style.transform = 'translateX(30px)';
    heroContent.style.transition = 'opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s';

    // Trigger after a brief paint delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroPhoto.style.opacity   = '1';
        heroPhoto.style.transform = 'translateX(0)';
        heroContent.style.opacity   = '1';
        heroContent.style.transform = 'translateX(0)';
      });
    });
  }


  /* ─── Respect prefers-reduced-motion ─────── */
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const disableMotion = () => {
    document.querySelectorAll('[style*="transition"]').forEach(el => {
      el.style.transition = 'none';
      el.style.opacity    = '1';
      el.style.transform  = 'none';
    });
    timelineItems.forEach(item => item.classList.add('visible'));
  };

  if (motionQuery.matches) disableMotion();
  motionQuery.addEventListener('change', e => { if (e.matches) disableMotion(); });


  /* ─── Contact form ────────────────────────── */
  const form        = document.getElementById('contactForm');
  const successMsg  = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const fields = form.querySelectorAll('[required]');
      let valid = true;

      fields.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#CC1122';
          valid = false;
        }
        if (field.type === 'email' && field.value.trim()) {
          const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailReg.test(field.value.trim())) {
            field.style.borderColor = '#CC1122';
            valid = false;
          }
        }
      });

      if (!valid) return;

      // Simulate send (replace with actual fetch/API call)
      const btn = form.querySelector('.btn-submit');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';

        if (successMsg) {
          successMsg.classList.add('visible');
          setTimeout(() => successMsg.classList.remove('visible'), 4000);
        }
      }, 1200);
    });

    // Live validation — remove red border on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) field.style.borderColor = '';
      });
    });
  }

}); // end DOMContentLoaded
