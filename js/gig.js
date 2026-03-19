/* =========================
   GIG.JS — shared across all gig pages
   Handles: pricing, order popup, EmailJS

   ╔══════════════════════════════════════╗
   ║  WHERE TO CHANGE SALES               ║
   ║  → Find the SALES object below       ║
   ║  → Set active: true/false per type   ║
   ║  → Worldwide  = everyone             ║
   ║  → Regional   = specific countries   ║
   ║    or auto high-rate detection       ║
   ║  → Gigs[]     = per-service sales    ║
   ╚══════════════════════════════════════╝
========================= */

(function() {

/* =========================
   SECURITY LAYER
========================= */

const RATE_LIMIT = { max: 3, windowMins: 30 };

function checkRateLimit() {
  const now     = Date.now();
  const window  = RATE_LIMIT.windowMins * 60 * 1000;
  let   history = JSON.parse(localStorage.getItem("fmSubmits") || "[]");
  history = history.filter(ts => now - ts < window);
  if (history.length >= RATE_LIMIT.max) {
    const oldest  = history[0];
    const resetIn = Math.ceil((window - (now - oldest)) / 60000);
    showRateLimitWarning(resetIn);
    return false;
  }
  history.push(now);
  localStorage.setItem("fmSubmits", JSON.stringify(history));
  return true;
}

function showRateLimitWarning(minsLeft) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.85);
    z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;
  `;
  overlay.innerHTML = `
    <div style="background:#161616;border:1px solid rgba(239,68,68,0.3);border-radius:16px;
      padding:32px;max-width:420px;width:100%;text-align:center;">
      <div style="font-size:36px;margin-bottom:16px">⏱</div>
      <h3 style="font-family:'Syne',sans-serif;font-size:18px;color:#fff;margin-bottom:10px">Too many submissions</h3>
      <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin-bottom:20px">
        Please wait <strong style="color:#ef4444">${minsLeft} minute${minsLeft>1?'s':''}</strong> before trying again.
      </p>
      <p style="font-size:13px;color:rgba(255,255,255,0.35);margin-bottom:24px">
        Need urgent help? <a href="mailto:freshmint.work@gmail.com" style="color:#4CAF50;text-decoration:none">freshmint.work@gmail.com</a>
      </p>
      <button onclick="this.closest('div').parentElement.remove()"
        style="background:#4CAF50;color:#fff;border:none;border-radius:8px;padding:10px 24px;cursor:pointer;font-size:14px;">
        Got it
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
}

function checkHoneypot() {
  const pot = document.getElementById('fm-honeypot');
  return !pot || pot.value === '';
}

function decodeEmails() {
  document.querySelectorAll('[data-em]').forEach(el => {
    const decoded = atob(el.dataset.em);
    if (el.tagName === 'A') { el.href = 'mailto:' + decoded; el.textContent = decoded; }
    else { el.textContent = decoded; }
  });
}

decodeEmails();

if (typeof emailjs !== 'undefined') emailjs.init("bk2Xr38vMo_Ekp6C_");

var EMAILJS_SERVICE         = "service_9ciuxid";
var EMAILJS_TEMPLATE        = "template_p462zgr";
var OWNER_EMAIL             = "freshmint.work@gmail.com";
var RECAPTCHA_SITE          = "6Ld9MYssAAAAACoKomRGa0pJ6zdGtqQplIxwXbj2";
var EMAILJS_TEMPLATE_CLIENT = "template_16o1lai";

/* =========================
   CURRENCY MAPS
========================= */

const CURRENCY_CODE = {
  US:"USD", CA:"CAD", GB:"GBP", AU:"AUD",
  IN:"INR", PK:"PKR", BD:"BDT", PH:"PHP",
  BR:"BRL", MX:"MXN", ID:"IDR", NG:"NGN",
  ZA:"ZAR", AR:"ARS", CO:"COP", TR:"TRY",
  EG:"EGP", VN:"VND", TH:"THB", MY:"MYR"
};

const CURRENCY_SYMBOL = {
  USD:"$",  CAD:"CA$", GBP:"£",  AUD:"A$",
  INR:"₹",  PKR:"Rs",  BDT:"৳",  PHP:"₱",
  BRL:"R$", MXN:"MX$", IDR:"Rp", NGN:"₦",
  ZAR:"R",  ARS:"AR$", COP:"COP",TRY:"₺",
  EGP:"E£", VND:"₫",  THB:"฿",  MYR:"RM"
};

let userCountry    = "US";
let userCurrCode   = "USD";
let userCurrSymbol = "$";
let realRate       = 1;

/* ══════════════════════════════════════════
   ★ SALES — CHANGE EVERYTHING HERE ★

   HOW TO READ THIS:
   ─────────────────
   active:   true  → sale is live
   active:   false → sale is off (no changes needed elsewhere)
   discount: 15    → 15% off
   expires:  "2026-06-01" → auto-expires on that date
   expires:  null  → never expires (manual off only)

   STACKING:
   All active sales stack together.
   Example: worldwide 5% + regional 5% + gig 30%
            = a visitor in that region buying that gig
              gets all three stacked.

   TYPES:
   ──────
   worldwide → applies to every visitor on every gig page
   regional  → targets specific countries or auto high-rate
   gigs[]    → array, one entry per gig-specific sale
               gigId must match the GIG_ID in the page's HTML

   CURRENTLY ACTIVE:
   - 30% off Web Development (launch offer)
   - 5%  off Video Editing   (attract first clients)
   - 5%  for high exchange-rate countries (PK, BD, VN, ID, NG, CO, AR)
══════════════════════════════════════════ */

const SALES = {

  /* ── TYPE 1: WORLDWIDE ──────────────────────
     Applies to everyone, on every gig.
     Use for: launch sale, holiday sale, etc.
  ── */
  worldwide: {
    active:   false,          // ← flip to true to go live
    label:    "🎉 Launch Sale",
    discount: 15,             // % off
    expires:  null,
  },

  /* ── TYPE 2: REGIONAL ───────────────────────
     Targets specific countries or auto detects
     high exchange-rate countries.

     autoHighRate: true → automatically gives the
     discount to any country where the cheapest
     gig ($10) converts to over 1,000 local units.
     (e.g. PKR, BDT, VND, IDR, NGN, COP, ARS)
     You don't need to list them manually.

     countries: [] → override with specific ISO codes
     if you want exact control instead.
  ── */
  regional: {
    active:       true,                  // ← currently ON
    label:        "🌍 Regional Discount",
    discount:     5,                     // 5% extra off
    expires:      null,
    autoHighRate: true,                  // auto-detect high-rate countries
    countries:    [],                    // leave empty to use autoHighRate
    continents:   [],
  },

  /* ── TYPE 3: GIG-SPECIFIC ───────────────────
     Array — add as many gig sales as you want.
     Each entry targets one specific gig page.
     gigId must match the GIG_ID variable in HTML.

     Current gig IDs:
       "video-editing"
       "business-advice"
       "game-strategy"
       "web-development"
  ── */
  gigs: [
    {
      active:   true,                    // ← 30% web launch sale — ON
      label:    "🌐 Web Launch Special",
      discount: 30,
      expires:  null,                    // run until you turn it off
      gigId:    "web-development",
    },
    {
      active:   true,                    // ← 5% video editing sale — ON
      label:    "🎬 Editing Special",
      discount: 5,
      expires:  null,
      gigId:    "video-editing",
    },
    /* ── TEMPLATE: copy this block to add another gig sale ──
    {
      active:   false,
      label:    "🎮 Gaming Special",
      discount: 10,
      expires:  "2026-06-01",
      gigId:    "game-strategy",
    },
    */
  ],

};

/* =========================
   CONTINENTS MAP
========================= */

const CONTINENTS = {
  AS: ["IN","PK","BD","PH","ID","VN","TH","MY","CN","JP","KR","SG","AE","SA"],
  EU: ["GB","DE","FR","IT","ES","NL","SE","NO","PL","CH","BE","AT","PT","DK"],
  NA: ["US","CA","MX"],
  SA: ["BR","AR","CO","CL","PE","VE"],
  AF: ["NG","ZA","EG","KE","GH","TZ","ET"],
  OC: ["AU","NZ","FJ"],
};

/* =========================
   SALE CALCULATOR
========================= */

function isHighRateCountry() {
  // Cheapest gig is $10 — if $10 × realRate > 1000 local units, qualifies
  return realRate > 100;
}

function getSaleDiscount() {
  const now    = new Date();
  let discount = 0;
  let labels   = [];

  function notExpired(expires) {
    return !expires || now < new Date(expires);
  }

  // Worldwide
  const w = SALES.worldwide;
  if (w.active && notExpired(w.expires)) {
    discount += w.discount;
    labels.push(w.label + " −" + w.discount + "%");
  }

  // Regional
  const r = SALES.regional;
  if (r.active && notExpired(r.expires)) {
    let qualifies = false;
    if (r.autoHighRate && isHighRateCountry()) qualifies = true;
    if (r.countries.includes(userCountry)) qualifies = true;
    if (r.continents.some(c => (CONTINENTS[c] || []).includes(userCountry))) qualifies = true;
    if (qualifies) {
      discount += r.discount;
      labels.push(r.label + " −" + r.discount + "%");
    }
  }

  // Gig-specific (array — all matching gigs stack)
  const currentGig = typeof GIG_ID !== "undefined" ? GIG_ID : "";
  (SALES.gigs || []).forEach(g => {
    if (g.active && notExpired(g.expires) && g.gigId === currentGig) {
      discount += g.discount;
      labels.push(g.label + " −" + g.discount + "%");
    }
  });

  return { discount, labels };
}

function applyExtraDiscount(price) {
  const { discount } = getSaleDiscount();
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
}

function showSaleBanner() {
  const { discount, labels } = getSaleDiscount();
  if (!discount || !labels.length) return;
  if (document.querySelector(".fm-sale-banner")) return;
  const banner = document.createElement("div");
  banner.className = "fm-sale-banner";
  banner.innerHTML = `
    <span class="sale-pulse"></span>
    <span>${labels.join(" &nbsp;·&nbsp; ")}</span>
    <span class="sale-total">Total extra: −${discount}%</span>
  `;
  const navbar = document.querySelector(".navbar");
  if (navbar) navbar.after(banner);
}

/* =========================
   PRICING ENGINE
   MRP   = base × real-time rate
   Price = MRP × 0.80           (20% regional always)
         × (1 - saleDiscount%)  (any active sales stacked)
========================= */

function calcMRP(base) {
  return Math.round(base * realRate);
}

function calcPrice(base) {
  const mrp        = calcMRP(base);
  const regional   = Math.round(mrp * 0.80);   // 20% regional always
  return applyExtraDiscount(regional);          // stack active sales
}

/* =========================
   COUNTRY + REAL-TIME RATE
========================= */

async function detectCountry() {
  // Language fallback (instant)
  try {
    const lang = navigator.language || "";
    if (lang.includes("-")) {
      const code = lang.split("-")[1].toUpperCase();
      if (CURRENCY_CODE[code]) {
        userCountry    = code;
        userCurrCode   = CURRENCY_CODE[code];
        userCurrSymbol = CURRENCY_SYMBOL[userCurrCode] || "$";
      }
    }
  } catch(e) {}

  // Cache check (6 hours)
  try {
    const cached = JSON.parse(localStorage.getItem("fmPricing") || "null");
    if (cached && cached.country && cached.rate && (Date.now() - cached.ts) < 21600000) {
      userCountry    = cached.country;
      userCurrCode   = CURRENCY_CODE[userCountry]    || "USD";
      userCurrSymbol = CURRENCY_SYMBOL[userCurrCode] || "$";
      realRate       = cached.rate;
      applyPricing();
      showSaleBanner();
      return;
    }
  } catch(e) {}

  // IP geolocation
  try {
    const geoRes = await fetch("https://ipapi.co/json/");
    if (geoRes.ok) {
      const geo      = await geoRes.json();
      userCountry    = geo.country_code || userCountry;
      userCurrCode   = CURRENCY_CODE[userCountry]    || "USD";
      userCurrSymbol = CURRENCY_SYMBOL[userCurrCode] || "$";
    }
  } catch(e) {}

  // Real-time exchange rate (frankfurter.app — free, no key needed)
  try {
    if (userCurrCode !== "USD") {
      const rateRes = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${userCurrCode}`);
      if (rateRes.ok) {
        const rateData = await rateRes.json();
        realRate = rateData.rates[userCurrCode] || 1;
      }
    }
  } catch(e) {}

  // Cache result
  try {
    localStorage.setItem("fmPricing", JSON.stringify({
      country: userCountry, rate: realRate, ts: Date.now()
    }));
  } catch(e) {}

  applyPricing();
  showSaleBanner();
}

function applyPricing() {
  document.querySelectorAll(".package-price[data-base]").forEach(el => {
    const base  = parseFloat(el.dataset.base);
    const mrp   = calcMRP(base);
    const price = calcPrice(base);
    const { discount } = getSaleDiscount();
    const totalOff = 20 + Math.round((1 - (price / mrp)) * 100 - 20); // total % vs MRP

    if (userCurrCode !== "USD") {
      el.innerHTML = `
        <span class="price-original">${userCurrSymbol}${mrp.toLocaleString()}</span>
        <span class="price-local">${userCurrSymbol}${price.toLocaleString()}</span>
        <span class="price-badge">${Math.round((1 - price/mrp)*100)}% off · Local pricing</span>
      `;
    } else {
      // US: still show 20% regional off USD MRP
      const usdPrice = calcPrice(base);
      el.innerHTML = `
        <span class="price-original">$${base}</span>
        <span class="price-local">$${usdPrice}</span>
        <span class="price-badge">${Math.round((1 - usdPrice/base)*100)}% off</span>
      `;
    }
  });

  // Sidebar price
  const featuredBase = document.querySelector(".package-card.featured .package-price[data-base]")
                    || document.querySelector(".package-price[data-base]");
  const sidePrice = document.getElementById("sidebar-price");
  if (featuredBase && sidePrice) {
    const base  = parseFloat(featuredBase.dataset.base);
    const price = calcPrice(base);
    const sym   = userCurrCode !== "USD" ? userCurrSymbol : "$";
    sidePrice.textContent = `${sym}${price.toLocaleString()}`;
  }
}

detectCountry();

/* =========================
   ORDER STATE
========================= */

let orderState = {
  gig: "", tier: "", basePrice: 0, finalPrice: 0,
  delivery: "standard", deliveryDays: 0,
  name: "", email: "", extra: "", message: ""
};

/* =========================
   OPEN / CLOSE POPUP
========================= */

window.openOrder = function(gig, tier, price, days) {
  orderState.gig          = gig;
  orderState.tier         = tier;
  orderState.basePrice    = price;
  orderState.deliveryDays = days;
  orderState.delivery     = "standard";
  orderState.finalPrice   = calcPrice(price);

  document.querySelectorAll(".modal-step").forEach(s => s.classList.remove("active"));
  document.getElementById("step-1").classList.add("active");
  document.getElementById("modal-gig-name").textContent = formatGigName(gig);
  document.getElementById("modal-tier").textContent     = tier;
  document.getElementById("btn-standard").classList.add("active");
  document.getElementById("btn-fast").classList.remove("active");

  buildPackageSummary();
  updatePriceDisplay();

  document.getElementById("order-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

window.closeOrder = function(e) {
  if (e.target === document.getElementById("order-overlay")) closeOrderDirect();
}

window.closeOrderDirect = function() {
  document.getElementById("order-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

function formatGigName(id) {
  return {
    "video-editing":   "Video Editing",
    "business-advice": "Business Advice",
    "game-strategy":   "Game Strategy",
    "web-development": "Web Development"
  }[id] || id;
}

/* =========================
   PACKAGE SUMMARY BOX
========================= */

function buildPackageSummary() {
  const mrp   = calcMRP(orderState.basePrice);
  const price = calcPrice(orderState.basePrice);
  const sym   = userCurrCode !== "USD" ? userCurrSymbol : "$";
  const pct   = Math.round((1 - price / (userCurrCode !== "USD" ? mrp : orderState.basePrice)) * 100);

  const mrpDisplay = userCurrCode !== "USD"
    ? `<span style="text-decoration:line-through;color:rgba(255,255,255,0.35);font-size:13px">${sym}${mrp.toLocaleString()}</span>`
    : `<span style="text-decoration:line-through;color:rgba(255,255,255,0.35);font-size:13px">$${orderState.basePrice}</span>`;

  document.getElementById("modal-package-summary").innerHTML = `
    <div class="summary-row"><span>Package</span><strong>${orderState.tier}</strong></div>
    <div class="summary-row"><span>Gig</span><strong>${formatGigName(orderState.gig)}</strong></div>
    <div class="summary-row"><span>MRP</span><strong>${mrpDisplay}</strong></div>
    <div class="summary-row"><span>Your price</span><strong>
      ${sym}${price.toLocaleString()}
      <small style="color:#4CAF50;font-size:11px;margin-left:4px">${pct}% off</small>
    </strong></div>
  `;
}

/* =========================
   DELIVERY TOGGLE
========================= */

window.setDelivery = function(type) {
  orderState.delivery = type;
  document.getElementById("btn-standard").classList.toggle("active", type === "standard");
  document.getElementById("btn-fast").classList.toggle("active",     type === "fast");
  const days = type === "fast"
    ? Math.max(1, Math.ceil(orderState.deliveryDays / 2))
    : orderState.deliveryDays;
  document.getElementById("delivery-info").textContent =
    type === "fast"
      ? `⚡ Rush delivery: ${days} day${days > 1 ? "s" : ""}`
      : `Standard delivery: ${days} day${days > 1 ? "s" : ""}`;
  updatePriceDisplay();
}

function updatePriceDisplay() {
  const base  = calcPrice(orderState.basePrice);
  const total = orderState.delivery === "fast" ? Math.round(base * 1.5) : base;
  orderState.finalPrice = total;
  const sym = userCurrCode !== "USD" ? userCurrSymbol : "$";
  document.getElementById("modal-total").textContent = sym + total.toLocaleString();
}

/* =========================
   STEP NAVIGATION
========================= */

window.nextStep = function(n) {
  if (n === 3) {
    const name    = document.getElementById("client-name").value.trim();
    const email   = document.getElementById("client-email").value.trim();
    const message = document.getElementById("client-message").value.trim();
    if (!name)                          { alert("Please enter your name.");       return; }
    if (!email || !email.includes("@")) { alert("Please enter a valid email.");   return; }
    if (!message)                       { alert("Please describe your project."); return; }
    orderState.name    = name;
    orderState.email   = email;
    orderState.extra   = document.getElementById("footage-mins").value.trim();
    orderState.message = message;
    buildReview();
  }
  document.querySelectorAll(".modal-step").forEach(s => s.classList.remove("active"));
  document.getElementById("step-" + n).classList.add("active");
}

/* =========================
   REVIEW BOX
========================= */

function buildReview() {
  const sym  = userCurrCode !== "USD" ? userCurrSymbol : "$";
  const days = orderState.delivery === "fast"
    ? Math.max(1, Math.ceil(orderState.deliveryDays / 2))
    : orderState.deliveryDays;
  const extraLabel = {
    "video-editing":   "Minutes of footage",
    "business-advice": "Platform / Business",
    "game-strategy":   "Game & Issue",
    "web-development": "Current Site URL"
  }[orderState.gig] || "Extra info";

  document.getElementById("review-box").innerHTML = `
    <div class="review-row"><span>Name</span><strong>${orderState.name}</strong></div>
    <div class="review-row"><span>Email</span><strong>${orderState.email}</strong></div>
    <div class="review-row"><span>Gig</span><strong>${formatGigName(orderState.gig)}</strong></div>
    <div class="review-row"><span>Package</span><strong>${orderState.tier}</strong></div>
    <div class="review-row"><span>Delivery</span><strong>${orderState.delivery === "fast" ? "⚡ Rush" : "Standard"} (${days} day${days>1?"s":""})</strong></div>
    <div class="review-row"><span>Total</span><strong>${sym}${orderState.finalPrice.toLocaleString()}</strong></div>
    ${orderState.extra ? `<div class="review-row"><span>${extraLabel}</span><strong>${orderState.extra}</strong></div>` : ""}
    <div class="review-row review-row--message"><span>Message</span><p>${orderState.message}</p></div>
  `;
}

/* =========================
   SUBMIT ORDER via EmailJS
========================= */

window.submitOrder = async function() {
  if (!checkHoneypot()) { console.warn("Bot detected"); return; }
  if (!checkRateLimit()) return;

  const btn = document.getElementById("submit-btn");
  btn.textContent = "Verifying...";
  btn.disabled    = true;

  let recaptchaToken = "";
  try {
    recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE, { action: "submit_order" });
  } catch(e) { console.warn("reCAPTCHA failed:", e); }

  btn.textContent = "Sending...";

  const sym  = userCurrCode !== "USD" ? userCurrSymbol : "$";
  const days = orderState.delivery === "fast"
    ? Math.max(1, Math.ceil(orderState.deliveryDays / 2))
    : orderState.deliveryDays;

  const templateParams = {
    to_email:   OWNER_EMAIL,
    from_name:  orderState.name,
    from_email: orderState.email,
    gig:        formatGigName(orderState.gig),
    tier:       orderState.tier,
    delivery:   orderState.delivery === "fast" ? `Rush (${days} days)` : `Standard (${days} days)`,
    total:      sym + orderState.finalPrice.toLocaleString(),
    country:    userCountry,
    extra:      orderState.extra || "N/A",
    message:    orderState.message,
    reply_to:   orderState.email,
    recaptcha:  recaptchaToken
  };

  try {
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams);
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_CLIENT, {
      from_name:  orderState.name,
      from_email: orderState.email,
      gig:        formatGigName(orderState.gig),
      tier:       orderState.tier,
      delivery:   orderState.delivery === "fast"
                    ? `Rush (${Math.max(1, Math.ceil(orderState.deliveryDays/2))} days)`
                    : `Standard (${orderState.deliveryDays} days)`,
      total:      sym + orderState.finalPrice.toLocaleString(),
      message:    orderState.message
    });
    document.querySelectorAll(".modal-step").forEach(s => s.classList.remove("active"));
    document.getElementById("step-4").classList.add("active");
    document.getElementById("confirm-email").textContent = orderState.email;
  } catch (err) {
    console.error("EmailJS error:", err);
    alert("Something went wrong. Please email freshmint.work@gmail.com directly.");
    btn.textContent = "Send Order ✉";
    btn.disabled    = false;
  }
}

/* =========================
   FAQ ACCORDION
========================= */

document.querySelectorAll(".faq-item").forEach(item => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  a.style.maxHeight  = "0";
  a.style.overflow   = "hidden";
  a.style.transition = "max-height 0.4s ease, padding 0.3s ease";
  q.style.cursor     = "pointer";
  q.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    if (isOpen) {
      a.style.overflow  = "visible";
      a.style.maxHeight = "none";
      const h = a.scrollHeight;
      a.style.maxHeight = "0";
      a.style.overflow  = "hidden";
      requestAnimationFrame(() => {
        a.style.maxHeight  = h + 20 + "px";
        a.style.paddingTop = "10px";
      });
    } else {
      a.style.maxHeight  = "0";
      a.style.paddingTop = "0";
    }
  });
});

})();