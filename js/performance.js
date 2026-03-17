/* =========================
   FRESHMINT PERFORMANCE
   Add to every page FIRST before all other scripts:
   <script src="/js/performance.js"></script>
========================= */

(function() {

  /* ── 1. LAZY LOAD HERO VIDEO ──
     Don't load the video until user has interacted
     or 3 seconds have passed. Massively improves LCP.
  ── */
  function lazyLoadVideo() {
    const video = document.querySelector('.hero-video');
    if (!video) return;

    // Set a low-res poster image first (add /assets/images/hero-poster.webp)
    if (!video.getAttribute('poster')) {
      video.setAttribute('poster', '/assets/images/hero-poster.webp');
    }

    // Remove src initially — add it after page is interactive
    const src = video.querySelector('source')?.getAttribute('src');
    if (!src) return;

    const loadVideo = () => {
      if (video.readyState === 0) {
        video.querySelector('source') && (video.querySelector('source').src = src);
        video.load();
        video.play().catch(() => {});
      }
    };

    // Load after 2s or on first interaction — whichever comes first
    const timer = setTimeout(loadVideo, 2000);
    ['click','scroll','touchstart','keydown'].forEach(e => {
      document.addEventListener(e, () => { clearTimeout(timer); loadVideo(); }, { once: true });
    });
  }

  /* ── 2. DEFER GOOGLE FONTS ──
     Fonts block rendering. Load them async.
  ── */
  function deferFonts() {
    const links = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    links.forEach(link => {
      link.media = 'print';
      link.onload = () => link.media = 'all';
    });
  }

  /* ── 3. LAZY LOAD IMAGES ──
     Any <img> with data-src loads when scrolled into view.
     Also converts standard imgs to use IntersectionObserver.
  ── */
  function lazyLoadImages() {
    const imgs = document.querySelectorAll('img[loading="lazy"], img[data-src]');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      });
    }, { rootMargin: '200px' });

    imgs.forEach(img => observer.observe(img));
  }

  /* ── 4. PRECONNECT TO CRITICAL ORIGINS ──
     Tells browser to open connections early.
  ── */
  function addPreconnects() {
    const origins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net',
    ];
    origins.forEach(origin => {
      if (document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) return;
      const link = document.createElement('link');
      link.rel  = 'preconnect';
      link.href = origin;
      if (origin.includes('gstatic')) link.crossOrigin = '';
      document.head.appendChild(link);
    });
  }

  /* ── 5. DEFER NON-CRITICAL SCRIPTS ──
     Scripts that don't need to run immediately.
  ── */
  function deferScripts() {
    // reCAPTCHA — only needed when form is opened, not on load
    const recaptcha = document.querySelector('script[src*="recaptcha"]');
    if (recaptcha && !document.querySelector('.order-overlay')) {
      recaptcha.remove(); // will be loaded on demand in gig.js
    }
  }

  /* ── RUN ALL ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      lazyLoadVideo();
      lazyLoadImages();
      deferFonts();
      addPreconnects();
    });
  } else {
    lazyLoadVideo();
    lazyLoadImages();
    deferFonts();
    addPreconnects();
  }

})();