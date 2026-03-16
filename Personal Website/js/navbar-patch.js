/* =========================
   NAVBAR AUTO-PATCHER
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
  ── */

  const NAV_LINKS = [
    { label: "Home",      href: "/index.html"             },
    { label: "About",     href: "/about.html"             },
    { label: "Portfolio", href: "/portfolio.html"         },
    { label: "Services",  href: "/services/"              },
    { label: "Games",     href: "/games.html"             },
    { label: "Blog",      href: "/blog.html"              },
    { label: "Links",     href: "/links.html"             },
    { label: "Contact",   href: "/contact.html"           },
  ];

  document.addEventListener("DOMContentLoaded", () => {
    const navList = document.querySelector(".nav-links");
    if (!navList) return;

    // Get all current hrefs in the navbar
    const existing = Array.from(navList.querySelectorAll("a"))
      .map(a => a.getAttribute("href"));

    // Find missing links
    const missing = NAV_LINKS.filter(link => !existing.includes(link.href));

    if (missing.length === 0) return; // Nothing to patch

    // Rebuild the entire navbar in the correct order
    // (easier than trying to insert at exact positions)
    navList.innerHTML = NAV_LINKS.map(link => `
      <li>
        <a href="${link.href}">
          <span>${link.label}</span>
        </a>
      </li>
    `).join("");

    console.log(`[FreshMint] Navbar patched — added: ${missing.map(l => l.label).join(", ")}`);
  });

})();