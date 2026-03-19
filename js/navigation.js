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

  const PERSISTENT = [
    ".music-player",
    ".navbar",
  ];

  let isNavigating = false;

  /* ── Full-screen curtain overlay ──
     Slams down instantly before any DOM changes,
     lifted with a fade after new content is ready.
     Nothing can flash underneath it.
  ── */
  function getCurtain() {
    let curtain = document.getElementById("fm-curtain");
    if (!curtain) {
      curtain = document.createElement("div");
      curtain.id = "fm-curtain";
      curtain.style.cssText = `
        position:fixed;
        inset:0;
        background:#0d0d0d;
        z-index:8999;
        opacity:0;
        pointer-events:none;
        transition:opacity 0.18s ease;
      `;
      document.body.appendChild(curtain);
    }
    return curtain;
  }

  function dropCurtain() {
    const c = getCurtain();
    c.style.transition = "none";       // instant drop — no delay
    c.style.opacity = "1";
    c.style.pointerEvents = "all";
  }

  function liftCurtain() {
    const c = getCurtain();
    c.style.transition = "opacity 0.22s ease";
    c.style.opacity = "0";
    c.style.pointerEvents = "none";
  }

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

  /* ── Green progress bar ── */
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

  /* ── Merge stylesheets from new page ── */
  async function mergeStyles(newDoc) {
    const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(l => l.href);

    const newLinks = Array.from(newDoc.querySelectorAll('link[rel="stylesheet"]'));

    const promises = newLinks.map(link => {
      const resolvedHref = link.getAttribute('href').startsWith('/')
        ? location.origin + link.getAttribute('href')
        : new URL(link.getAttribute('href'), location.origin).href;
      if (existing.includes(resolvedHref)) return Promise.resolve();
      return new Promise(resolve => {
        const el  = document.createElement("link");
        el.rel    = "stylesheet";
        el.href   = resolvedHref;
        el.onload = resolve;
        el.onerror = resolve;
        document.head.appendChild(el);
      });
    });

    // Inline <style> blocks from new page head
    newDoc.querySelectorAll("head style").forEach(s => {
      const alreadyPresent = Array.from(document.querySelectorAll("head style"))
        .some(es => es.textContent.trim() === s.textContent.trim());
      if (!alreadyPresent) {
        const el = document.createElement("style");
        el.textContent = s.textContent;
        el.dataset.spaInjected = "1"; // tagged for removal on next nav
        document.head.appendChild(el);
      }
    });

    await Promise.all(promises);
  }

  /* ── Main navigation function ── */
  async function navigateTo(url) {
    if (isNavigating) return;
    isNavigating = true;

    // Remove injected styles from previous page (fixes blog-post → blog title bleed)
    document.querySelectorAll("style[data-spa-injected]").forEach(s => s.remove());

    // ✅ Drop the curtain FIRST — covers everything before any DOM change
    dropCurtain();
    showLoader();

    try {
      const res  = await fetch(url);
      const html = await res.text();

      const newDoc = new DOMParser().parseFromString(html, "text/html");
      document.title = newDoc.title;

      await mergeStyles(newDoc);

      const newBody = newDoc.body;

      // Strip persistent elements from incoming body
      PERSISTENT.forEach(sel => {
        const el = newBody.querySelector(sel);
        if (el) el.remove();
      });

      // Detach persistent elements from current DOM (no clone — keeps audio alive)
      const persistentEls = [];
      PERSISTENT.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
          persistentEls.push(el);
          el.remove();
        }
      });

      // Swap body content — curtain is covering this entirely
      document.body.innerHTML = "";

      // Re-attach persistent elements
      persistentEls.forEach(el => document.body.appendChild(el));

      // Also re-attach the curtain (it was wiped by innerHTML = "")
      document.body.appendChild(getCurtain());

      // Re-attach loader
      const loader = document.getElementById("fm-page-loader");
      if (!loader) showLoader();

      // Build new content wrapper
      const wrapper = document.createElement("div");
      wrapper.id = "fm-main-content";
      wrapper.style.cssText = "transition:opacity 0.25s ease,transform 0.25s ease;";

      Array.from(newBody.childNodes).forEach(node => {
        if (node.nodeName !== "SCRIPT") {
          wrapper.appendChild(node.cloneNode(true));
        }
      });

      document.body.appendChild(wrapper);

      // Load new page scripts
      const scripts = Array.from(newBody.querySelectorAll("script"));
      for (const s of scripts) {
        if (s.src) {
          if (s.src.includes("gig.js")) {
            window.__fmGigInit = false;
            await loadScript(s.src);
          }
        } else if (!s.src && s.textContent.trim()) {
          try { eval(s.textContent); } catch(e) {}
        }
      }

      history.pushState({ url }, document.title, url);

      attachListeners();

      if (typeof window.__onPageSwap === 'function') {
        window.__onPageSwap();
        window.__onPageSwap = null;
      }

      // Resume audio if it was playing
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

      if (window.applyNavbarPatch) window.applyNavbarPatch();

      window.scrollTo({ top: 0, behavior: "instant" });

      finishLoader();

      // ✅ Lift the curtain — new page is fully ready underneath
      liftCurtain();

    } catch (err) {
      console.warn("[FreshMint Nav] fetch failed, falling back to full load:", err);
      window.location.href = url;
    }

    isNavigating = false;
  }

  /* ── Load a script dynamically ── */
  function loadScript(src) {
    return new Promise((resolve) => {
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
      if (a.dataset.fmNav) return;
      a.dataset.fmNav = "1";

      a.addEventListener("click", e => {
        const href = a.getAttribute("href");
        if (!isInternal(href)) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;

        e.preventDefault();

        const parsed = new URL(href, location.origin);
        const url = parsed.pathname + parsed.search;
        if (url === location.pathname + location.search) return;

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
    if (!document.getElementById("fm-main-content")) {
      const wrapper = document.createElement("div");
      wrapper.id = "fm-main-content";
      wrapper.style.cssText = "transition:opacity 0.25s ease,transform 0.25s ease;";

      Array.from(document.body.childNodes).forEach(node => {
        const isPersistent = PERSISTENT.some(sel =>
          node.matches && node.matches(sel)
        );
        if (!isPersistent) wrapper.appendChild(node);
      });

      document.body.appendChild(wrapper);
    }

    history.replaceState({ url: location.pathname }, document.title, location.pathname);

    attachListeners();
  });

})();