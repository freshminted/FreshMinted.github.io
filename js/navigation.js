/* =========================
   FRESHMINT NAVIGATION
   Intercepts internal link clicks and swaps
   page content via fetch() — no full reload,
   music player stays alive across all pages.

   HOW TO USE:
   Add to every page BEFORE script.js:
   <script src="/js/navigation.js"></script>
   <script src="/js/script.js"></script>
========================= */

(function () {

  /* Pages to swap content on.
     Add any new pages here as you build them. */
  const INTERNAL = [
    "/index.html",
    "/about.html",
    "/portfolio.html",
    "/blog.html",
    "/contact.html",
    "/games.html",
    "/links.html",
    "/services/",
    "/services/index.html",
    "/services/video-editing.html",
    "/services/business-advice.html",
    "/services/game-strategy.html",
  ];

  /* Elements that should NEVER be swapped
     (they persist across all pages) */
  const PERSISTENT = [
    ".music-player",
    ".navbar",
  ];

  let isNavigating = false;

  /* ── Check if a URL is internal ── */
  function isInternal(href) {
    if (!href) return false;
    if (href.startsWith("http") && !href.includes(location.hostname)) return false;
    if (href.startsWith("#"))    return false;
    if (href.startsWith("mailto:")) return false;
    if (href.startsWith("tel:"))   return false;
    if (href.includes("/cdn-cgi/")) return false;
    return true;
  }

  /* ── Show loading indicator ── */
  function showLoader() {
    let loader = document.getElementById("fm-page-loader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "fm-page-loader";
      loader.style.cssText = `
        position:fixed;top:0;left:0;width:0%;height:2px;
        background:#4CAF50;z-index:9999;
        transition:width 0.3s ease;
        box-shadow:0 0 8px rgba(76,175,80,0.6);
      `;
      document.body.appendChild(loader);
    }
    loader.style.width = "30%";
    setTimeout(() => loader.style.width = "70%", 200);
  }

  function finishLoader() {
    const loader = document.getElementById("fm-page-loader");
    if (!loader) return;
    loader.style.width = "100%";
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.width   = "0%";
        loader.style.opacity = "1";
      }, 300);
    }, 200);
  }

  /* ── Merge head stylesheets from new page ── */
  async function mergeStyles(newDoc) {
    const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(l => l.href);

    const newLinks = Array.from(newDoc.querySelectorAll('link[rel="stylesheet"]'));

    const promises = newLinks.map(link => {
      // Always resolve href against origin to avoid services/ path issues
      const resolvedHref = link.getAttribute('href').startsWith('/')
        ? location.origin + link.getAttribute('href')
        : new URL(link.getAttribute('href'), location.origin).href;
      if (existing.includes(resolvedHref)) return Promise.resolve();
      return new Promise(resolve => {
        const el    = document.createElement("link");
        el.rel      = "stylesheet";
        el.href     = resolvedHref;
        el.onload   = resolve;
        el.onerror  = resolve;
        document.head.appendChild(el);
      });
    });

    // Also apply any inline <style> blocks from new page head
    newDoc.querySelectorAll("head style").forEach(s => {
      // Check if already present by content fingerprint
      const existing = Array.from(document.querySelectorAll("head style"))
        .some(es => es.textContent.trim() === s.textContent.trim());
      if (!existing) {
        const el = document.createElement("style");
        el.textContent = s.textContent;
        document.head.appendChild(el);
      }
    });

    await Promise.all(promises);
  }

  /* ── Navigate to a new URL ── */
  async function navigateTo(url) {
    if (isNavigating) return;
    isNavigating = true;
    showLoader();

    try {
      const res  = await fetch(url);
      const html = await res.text();

      // Parse new page
      const parser  = document.createElement("div");
      parser.innerHTML = new DOMParser()
        .parseFromString(html, "text/html")
        .documentElement.innerHTML;

      const newDoc = new DOMParser().parseFromString(html, "text/html");

      // Update <title>
      document.title = newDoc.title;

      // ✅ Merge stylesheets from new page head
      // Adds any CSS links that aren't already loaded
      await mergeStyles(newDoc);

      // Get new body content, remove persistent elements from it
      const newBody = newDoc.body;
      PERSISTENT.forEach(sel => {
        const el = newBody.querySelector(sel);
        if (el) el.remove();
      });

      // ✅ FIX: DETACH persistent elements (don't clone!)
      // Cloning <audio> destroys playback state — detaching preserves it
      const persistentEls = [];
      PERSISTENT.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
          persistentEls.push(el);
          el.remove(); // detach from DOM, keeps all state intact
        }
      });

      // Fade out current content
      const mainContent = document.getElementById("fm-main-content");
      if (mainContent) {
        mainContent.style.opacity = "0";
        mainContent.style.transform = "translateY(8px)";
      }

      await new Promise(r => setTimeout(r, 150));

      // Rebuild body — re-attach the REAL persistent elements first
      document.body.innerHTML = "";

      // Re-attach original elements (audio, event listeners all preserved)
      persistentEls.forEach(el => document.body.appendChild(el));

      // Wrap new content
      const wrapper = document.createElement("div");
      wrapper.id = "fm-main-content";
      wrapper.style.cssText = "opacity:0;transform:translateY(8px);transition:opacity 0.25s ease,transform 0.25s ease;";

      // Add all non-script children from new body
      Array.from(newBody.childNodes).forEach(node => {
        if (node.nodeName !== "SCRIPT") {
          wrapper.appendChild(node.cloneNode(true));
        }
      });

      document.body.appendChild(wrapper);

      // Load new page scripts (gig.js, etc.)
      const scripts = Array.from(newBody.querySelectorAll("script"));
      for (const s of scripts) {
        if (s.src) {
          // Only reload gig.js — never reload script.js (player must not re-init)
          if (s.src.includes("gig.js")) {
            window.__fmGigInit = false; // reset gig flag so gig.js re-runs
            await loadScript(s.src);
          }
          // navbar-patch, script.js, emailjs etc. — skip, already loaded
        } else if (!s.src && s.textContent.trim()) {
          // Inline scripts (GIG_ID etc.)
          try { eval(s.textContent); } catch(e) {}
        }
      }

      // Update URL
      history.pushState({ url }, document.title, url);

      // Fade in
      requestAnimationFrame(() => {
        wrapper.style.opacity   = "1";
        wrapper.style.transform = "translateY(0)";
      });

      // Re-attach nav link listeners
      attachListeners();

      // ✅ Resume audio if it was playing before navigation
      const audio = document.getElementById("audio");
      if (audio) {
        try {
          const DB = JSON.parse(localStorage.getItem("fmPlayer") || "{}");
          if (DB.playing) {
            audio.play().catch(() => {});
            const playBtn = document.getElementById("play");
            if (playBtn) playBtn.textContent = "⏸";
            const player = document.querySelector(".music-player");
            if (player) player.classList.add("is-playing");
          }
        } catch(e) {}
      }

      // Re-run navbar-patch if available
      if (window.applyNavbarPatch) window.applyNavbarPatch();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      finishLoader();

    } catch (err) {
      console.warn("[FreshMint Nav] fetch failed, falling back to full load:", err);
      window.location.href = url;
    }

    isNavigating = false;
  }

  /* ── Load a script dynamically ── */
  function loadScript(src) {
    return new Promise((resolve) => {
      // Remove old version first
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) existing.remove();

      const s   = document.createElement("script");
      s.src     = src;
      s.onload  = resolve;
      s.onerror = resolve;
      document.body.appendChild(s);
    });
  }

  /* ── Attach click listeners to all internal links ── */
  function attachListeners() {
    document.querySelectorAll("a[href]").forEach(a => {
      // Skip if already handled
      if (a.dataset.fmNav) return;
      a.dataset.fmNav = "1";

      a.addEventListener("click", e => {
        const href = a.getAttribute("href");
        if (!isInternal(href)) return; // let external links open normally

        // Don't intercept if modifier key held (open in new tab)
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;

        e.preventDefault();

        // Resolve relative URLs
        const url = new URL(href, location.origin).pathname;
        if (url === location.pathname) return; // already on this page

        navigateTo(url);
      });
    });
  }

  /* ── Handle browser back/forward ── */
  window.addEventListener("popstate", e => {
    if (e.state?.url) navigateTo(e.state.url);
    else navigateTo(location.pathname);
  });

  /* ── Initial page setup ── */
  document.addEventListener("DOMContentLoaded", () => {
    // Wrap existing body content
    // Wrap everything else in fm-main-content, keep persistent in place
    if (!document.getElementById("fm-main-content")) {
      const wrapper = document.createElement("div");
      wrapper.id = "fm-main-content";
      wrapper.style.cssText = "transition:opacity 0.25s ease,transform 0.25s ease;";

      // Move non-persistent children into wrapper (no cloning)
      Array.from(document.body.childNodes).forEach(node => {
        const isPersistent = PERSISTENT.some(sel =>
          node.matches && node.matches(sel)
        );
        if (!isPersistent) wrapper.appendChild(node);
      });

      document.body.appendChild(wrapper);
      // Persistent elements stay exactly where they are — no touching them
    }

    // Save initial state
    history.replaceState({ url: location.pathname }, document.title, location.pathname);

    attachListeners();
  });

})();