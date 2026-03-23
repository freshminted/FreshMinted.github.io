/* =========================
   FRESHMINT NAVBAR AUTO-PATCHER
   Runs on every page load.
   Checks if nav links exist and adds
   any missing ones in the correct order.
   Just add this script to every page and
   never touch individual navbars again.

   HOW TO USE:
   Add this BEFORE script.js on every page:
   <script src="/js/navbar-patch.js"></script>
   <script src="/js/script.js"></script>
========================= */

(function() {

  /* ── DEFINE YOUR FULL NAV ORDER HERE ──
     To add a new page in future:
     Just add it to this array in the right position.
     The script handles everything else automatically.

     REMOVED: Blog (/blog.html) and Games (/games.html)
     These now live on freshminted.me
  ── */

  const NAV_LINKS = [
    { label: "Home",      href: "/index.html"     },
    { label: "About",     href: "/about.html"      },
    { label: "Portfolio", href: "/portfolio.html"  },
    { label: "Services",  href: "/services/"       },
    { label: "Links",     href: "/links.html"      },
    { label: "Contact",   href: "/contact.html"    },
  ];

  /* ── PERSONAL SITE CROSSLINK ──
     Injected as a subtle line below the navbar.
     Visible on About page only — not on every page.
     To show on ALL pages, change the condition to: true
  ── */
  const SHOW_PERSONAL_LINK_ON = ["/about.html"];

  function injectPersonalLink() {
    const path = window.location.pathname;
    const match = SHOW_PERSONAL_LINK_ON.some(p => path.endsWith(p));
    if (!match) return;
    if (document.getElementById("fm-personal-link")) return;

    const bar = document.createElement("div");
    bar.id = "fm-personal-link";
    bar.style.cssText = `
      width: 100%;
      text-align: center;
      padding: 7px 20px;
      font-size: 12px;
      color: rgba(255,255,255,0.25);
      font-family: 'DM Sans', sans-serif;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid rgba(255,255,255,0.04);
      letter-spacing: 0.3px;
    `;
    bar.innerHTML = `The person behind this →
      <a href="https://freshminted.me" target="_blank" rel="noopener"
        style="color:rgba(255,255,255,0.45);text-decoration:none;transition:color 0.2s;"
        onmouseover="this.style.color='#4CAF50'"
        onmouseout="this.style.color='rgba(255,255,255,0.45)'">
        freshminted.me
      </a>`;

    const navbar = document.querySelector(".navbar");
    if (navbar && navbar.nextSibling) {
      navbar.parentNode.insertBefore(bar, navbar.nextSibling);
    } else if (navbar) {
      navbar.after(bar);
    }
  }

  window.applyNavbarPatch = function() {
    const navList = document.querySelector(".nav-links");
    if (!navList) return;

    const existing = Array.from(navList.querySelectorAll("a"))
      .map(a => a.getAttribute("href"));

    const missing = NAV_LINKS.filter(link => !existing.includes(link.href));

    // Rebuild in correct order if anything is missing or out of order
    navList.innerHTML = NAV_LINKS.map(link => `
      <li>
        <a href="${link.href}">
          <span>${link.label}</span>
        </a>
      </li>
    `).join("");

    injectPersonalLink();

    if (missing.length > 0) {
      console.log(`[FreshMint] Navbar patched — added: ${missing.map(l => l.label).join(", ")}`);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    window.applyNavbarPatch();
  });

})();