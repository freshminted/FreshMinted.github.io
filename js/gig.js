/* =========================
   GIG.JS — shared across all gig pages
   Also handles services/index.html pricing.
   Handles: pricing, order popup, EmailJS

   ════════════════════════════════════
   WHERE TO CONFIGURE SALES → scroll to
   the SALES object below (~line 80).
   That is the ONLY place you ever touch.
   ════════════════════════════════════
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
        You've submitted ${RATE_LIMIT.max} forms in the last ${RATE_LIMIT.windowMins} minutes.
        Please wait <strong style="color:#ef4444">${minsLeft} minute${minsLeft>1?'s':''}</strong> before trying again.
      </p>
      <p style="font-size:13px;color:rgba(255,255,255,0.35);margin-bottom:24px">
        Need urgent help? Email directly:
        <a href="mailto:freshmint.work@gmail.com" style="color:#4CAF50;text-decoration:none">freshmint.work@gmail.com</a>
      </p>
      <button onclick="this.closest('div').parentElement.remove()"
        style="background:#4CAF50;color:#fff;border:none;border-radius:8px;padding:10px 24px;cursor:pointer;font-size:14px;font-family:'DM Sans',sans-serif">
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

/* ════════════════════════════════════════════════
   SALES CONFIGURATION
   ════════════════════════════════════════════════
   This is the ONLY section you ever edit for sales.

   TYPES:
   1. worldwide    — every visitor, every gig
   2. regional     — specific countries or continents
   3. highCurrency — auto 5% when cheapest gig > 1000
                     local units after 20% off
   4. gigs[]       — array, one entry per gig-specific
                     sale. Add as many as you want.

   TO ACTIVATE:   set active: true
   TO DEACTIVATE: set active: false
   expires: "YYYY-MM-DD" or null for no expiry

   GIG IDs:
     "video-editing"    → Video Editing
     "business-advice"  → Business Advice
     "game-strategy"    → Game Strategy
     "web-development"  → Web Development

   CONTINENT CODES for regional.continents:
     "AS" "EU" "NA" "SA" "AF" "OC"
   ════════════════════════════════════════════════ */

const SALES = {

  /* ── TYPE 1: WORLDWIDE ──────────────────────────
     Applies to every visitor on every gig.
  ── */
  worldwide: {
    active:   false,
    label:    "🎉 Launch Sale",
    discount: 15,
    expires:  null,
  },

  /* ── TYPE 2: REGIONAL ───────────────────────────
     Target specific countries (ISO) or continents.
  ── */
  regional: {
    active:     false,
    label:      "🌍 Regional Deal",
    discount:   10,
    expires:    null,
    countries:  [],       // e.g. ["IN","PK","BD"]
    continents: [],       // e.g. ["AS","SA"]
  },

  /* ── TYPE 3: HIGH CURRENCY AUTO-RELIEF ──────────
     Auto 5% off when cheapest gig ($10) costs
     more than 1,000 local units after 20% off.
     Fires automatically for PKR, IDR, NGN, ARS,
     COP, VND etc. No manual config needed.
  ── */
  highCurrency: {
    active:   false,
    label:    "🌐 Currency Relief",
    discount: 2,
  },

  /* ── TYPE 4: GIG-SPECIFIC SALES ─────────────────
     Array — one object per gig. Multiple active at once.
  ── */
  gigs: [
    {
      active:   true,
      label:    "🌐 Web Launch",
      discount: 30,
      expires:  null,
      gigId:    "web-development",
    },
    {
      active:   true,
      label:    "🎬 Editing Deal",
      discount: 5,
      expires:  null,
      gigId:    "video-editing",
    },
    // Template — copy to add more:
    // {
    //   active:   false,
    //   label:    "🎮 Gaming Special",
    //   discount: 10,
    //   expires:  "2026-07-01",
    //   gigId:    "game-strategy",
    // },
  ],

};

/* ════════════════════════════════════════════════
   END OF SALES CONFIGURATION
   Do not edit below this line
   ════════════════════════════════════════════════ */

const CONTINENTS = {
  AS: ["IN","PK","BD","PH","ID","VN","TH","MY","CN","JP","KR","SG","AE","SA"],
  EU: ["GB","DE","FR","IT","ES","NL","SE","NO","PL","CH","BE","AT","PT","DK"],
  NA: ["US","CA","MX"],
  SA: ["BR","AR","CO","CL","PE","VE"],
  AF: ["NG","ZA","EG","KE","GH","TZ","ET"],
  OC: ["AU","NZ","FJ"],
};

let userCountry    = "US";
let userCurrCode   = "USD";
let userCurrSymbol = "$";
let realRate       = 1;

/* ════════════════════════════════════════════════
   PPP DISCOUNT  (replaces the old flat 20% off)
   ════════════════════════════════════════════════
   Scales with how weak the local currency is vs USD,
   on a logarithmic curve, capped at maxDiscount.
   USD and stronger currencies (rate ≤ 1) get 0 — they
   pay full MRP. Gig SALES stack on top of this.

   TUNE HERE:
     maxDiscount — hard ceiling (%)
     steepness   — higher ramps to the cap faster.
   At steepness 4.5: ≈7% at rate 5 (BRL), ≈16% at
   rate 35 (THB), hits the 20% cap by rate ≈85 (INR).
   ════════════════════════════════════════════════ */
const PPP = { maxDiscount: 20, steepness: 4.5 };

function getPppDiscount() {
  if (!(realRate > 1)) return 0;            // USD + stronger currencies pay full
  const raw = PPP.steepness * Math.log(realRate);
  return Math.min(PPP.maxDiscount, Math.round(raw));
}

/* =========================
   SALE CALCULATION
========================= */

function getSaleDiscount() {
  const now    = new Date();
  let discount = 0;
  let labels   = [];

  function notExpired(expires) {
    return !expires || now < new Date(expires);
  }

  const w = SALES.worldwide;
  if (w.active && notExpired(w.expires)) {
    discount += w.discount;
    labels.push(w.label + " −" + w.discount + "%");
  }

  const r = SALES.regional;
  if (r.active && notExpired(r.expires)) {
    const countryMatch   = r.countries.includes(userCountry);
    const continentMatch = r.continents.some(c => (CONTINENTS[c] || []).includes(userCountry));
    if (countryMatch || continentMatch) {
      discount += r.discount;
      labels.push(r.label + " −" + r.discount + "%");
    }
  }

  if (SALES.highCurrency.active && realRate > 0) {
    const cheapestLocal = Math.round(10 * realRate * 0.80);
    if (cheapestLocal > 1000) {
      discount += SALES.highCurrency.discount;
      labels.push(SALES.highCurrency.label + " −" + SALES.highCurrency.discount + "%");
    }
  }

  const currentGig = typeof GIG_ID !== "undefined" ? GIG_ID : "";
  SALES.gigs.forEach(g => {
    if (g.active && notExpired(g.expires) && currentGig === g.gigId) {
      discount += g.discount;
      labels.push(g.label + " −" + g.discount + "%");
    }
  });

  return { discount, labels };
}

function applyDiscount(price) {
  const { discount } = getSaleDiscount();
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
}

function showSaleBanner() {
  const { discount, labels } = getSaleDiscount();
  if (!discount || !labels.length) return;
  const existing = document.querySelector(".fm-sale-banner");
  if (existing) return;
  const banner = document.createElement("div");
  banner.className = "fm-sale-banner";
  banner.innerHTML = `
    <span class="sale-pulse"></span>
    <span>${labels.join(" &nbsp;·&nbsp; ")}</span>
    <span class="sale-total">Total: −${discount}% off</span>
  `;
  const navbar = document.querySelector(".navbar");
  if (navbar) navbar.after(banner);
}

/* =========================
   CURRENCY + REAL-TIME RATE
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

async function detectCountry() {

  // Step 1 — instant language fallback
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

  // Step 2 — check cache (6 hours)
  // ✅ Reject cache if rate is 1 and country is non-USD
  // This fixes stale rate:1 being served forever
  try {
    const cached = JSON.parse(localStorage.getItem("fmPricing") || "null");
    const validRate = cached && cached.rate && cached.rate > 1;
    const usdCountry = cached && ["US","CA","AU","NZ"].includes(cached.country);
    if (cached && cached.country && (validRate || usdCountry) && (Date.now() - cached.ts) < 21600000) {
      userCountry    = cached.country;
      userCurrCode   = CURRENCY_CODE[userCountry]   || "USD";
      userCurrSymbol = CURRENCY_SYMBOL[userCurrCode] || "$";
      realRate       = cached.rate;
      applyPricing();
      showSaleBanner();
      return;
    } else if (cached) {
      // Cache exists but rate is suspicious — clear it and re-fetch
      localStorage.removeItem("fmPricing");
    }
  } catch(e) {}

  // Step 3 — fetch country via IP
  try {
    const geoRes = await fetch("https://ipapi.co/json/");
    if (geoRes.ok) {
      const geo      = await geoRes.json();
      userCountry    = geo.country_code || userCountry;
      userCurrCode   = CURRENCY_CODE[userCountry]   || "USD";
      userCurrSymbol = CURRENCY_SYMBOL[userCurrCode] || "$";
    }
  } catch(e) {}

  // Step 4 — fetch real-time exchange rate
  // open.er-api.com is CORS-enabled (works on GitHub Pages); frankfurter.app is not.
  // Response shape: { result:"success", base_code:"USD", rates:{ INR:83.2, ... } }
  try {
    if (userCurrCode !== "USD") {
      const rateRes = await fetch("https://open.er-api.com/v6/latest/USD");
      if (rateRes.ok) {
        const rateData = await rateRes.json();
        realRate = (rateData.rates && rateData.rates[userCurrCode]) || 1;
      }
    }
  } catch(e) {
    realRate = 1;
  }

  // Only cache if we got a real rate (> 1 for non-USD)
  try {
    if (userCurrCode === "USD" || realRate > 1) {
      localStorage.setItem("fmPricing", JSON.stringify({
        country: userCountry, rate: realRate, ts: Date.now()
      }));
    }
  } catch(e) {}

  applyPricing();
  showSaleBanner();
}

/* =========================
   PRICE CALCULATION
   MRP   = base × realRate            (full local price)
   Price = MRP × (1 − PPP%) − SALES   (PPP replaces the old flat 20%)
========================= */

function calcMRP(base) {
  return Math.round(base * realRate);
}

function calcPrice(base) {
  const ppp = getPppDiscount();
  return applyDiscount(Math.round(calcMRP(base) * (1 - ppp / 100)));
}

function applyPricing() {
  const sym = userCurrSymbol;

  // ── GIG PAGES: .package-price[data-base] ──
  // Show the final price in the visitor's own currency only — no strikethrough,
  // no "% off" badge. Regional pricing is applied silently in calcPrice() so it
  // is never displayed as a discount/advantage.
  document.querySelectorAll(".package-price[data-base]").forEach(el => {
    const base  = parseFloat(el.dataset.base);
    const price = calcPrice(base);
    el.innerHTML = `<span class="price-local">${sym}${price.toLocaleString()}</span>`;
  });

  // ── SERVICES PAGE: .svc-price-amount[data-usd] ──
  // Hide the strikethrough MRP + "% off"; show the converted price only.
  document.querySelectorAll(".svc-price-amount[data-usd]").forEach(mrpEl => {
    const base    = parseFloat(mrpEl.dataset.usd);
    const price   = calcPrice(base);
    const priceEl = mrpEl.nextElementSibling;                     // .svc-price-discounted
    const offEl   = priceEl ? priceEl.nextElementSibling : null;  // .svc-price-off
    mrpEl.style.display = "none";
    if (priceEl) priceEl.textContent = `${sym}${price.toLocaleString()}`;
    if (offEl)   offEl.textContent   = "";
  });

  // ── SIDEBAR price ──
  const featuredBase = document.querySelector(".package-card.featured .package-price[data-base]")
                    || document.querySelector(".package-price[data-base]");
  const sidePrice = document.getElementById("sidebar-price");
  if (featuredBase && sidePrice) {
    const base  = parseFloat(featuredBase.dataset.base);
    const price = calcPrice(base);
    sidePrice.textContent = sym + price.toLocaleString();
  }

  // ── ANY OTHER PRICE: .fm-price[data-base] ──
  // Generic catch-all: homepage "From $X" tiles, inline "just $X" copy,
  // any badge or text that needs live currency conversion.
  // Prefix with data-prefix="From " to keep the label intact.
  document.querySelectorAll(".fm-price[data-base]").forEach(el => {
    const base   = parseFloat(el.dataset.base);
    const price  = calcPrice(base);
    const prefix = el.dataset.prefix || "";
    el.textContent = `${prefix}${sym}${price.toLocaleString()}`;
  });
}

detectCountry();

/* =========================
   ORDER STATE
========================= */

/* Rush delivery surcharge. 1.25 = +25% (market standard).
   Change here to adjust the fast-delivery premium everywhere. */
const RUSH_MULTIPLIER = 1.25;

let orderState = {
  gig: "", tier: "", basePrice: 0, finalPrice: 0,
  delivery: "standard", deliveryDays: 0,
  name: "", email: "", extra: "", message: ""
};

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
  const map = {
    "video-editing":   "Video Editing",
    "business-advice": "Business Advice",
    "game-strategy":   "Game Strategy",
    "web-development": "Web Development"
  };
  return map[id] || id;
}

function buildPackageSummary() {
  const price = calcPrice(orderState.basePrice);
  const sym   = userCurrSymbol;

  // Clean price only — regional pricing is applied silently, never shown as a discount.
  document.getElementById("modal-package-summary").innerHTML = `
    <div class="summary-row"><span>Package</span><strong>${orderState.tier}</strong></div>
    <div class="summary-row"><span>Gig</span><strong>${formatGigName(orderState.gig)}</strong></div>
    <div class="summary-row"><span>Your price</span><strong>${sym}${price.toLocaleString()}</strong></div>
  `;
}

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
  // Rush surcharge — market-standard +25% for fast delivery
  const total = orderState.delivery === "fast" ? Math.round(base * RUSH_MULTIPLIER) : base;
  orderState.finalPrice = total;
  document.getElementById("modal-total").textContent = userCurrSymbol + total.toLocaleString();
}

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

function buildReview() {
  const sym  = userCurrSymbol;
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
    <div class="review-row"><span>Delivery</span><strong>${orderState.delivery === "fast" ? "⚡ Rush" : "Standard"} (${days} day${days > 1 ? "s" : ""})</strong></div>
    <div class="review-row"><span>Total</span><strong>${sym}${orderState.finalPrice.toLocaleString()}</strong></div>
    ${orderState.extra ? `<div class="review-row"><span>${extraLabel}</span><strong>${orderState.extra}</strong></div>` : ""}
    <div class="review-row review-row--message"><span>Message</span><p>${orderState.message}</p></div>
  `;
}

window.submitOrder = async function() {
  if (!checkHoneypot()) return;
  if (!checkRateLimit()) return;

  const btn = document.getElementById("submit-btn");
  btn.textContent = "Verifying...";
  btn.disabled    = true;

  let recaptchaToken = "";
  try {
    recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE, { action: "submit_order" });
  } catch(e) {}

  btn.textContent = "Sending...";

  const sym  = userCurrSymbol;
  const days = orderState.delivery === "fast"
    ? Math.max(1, Math.ceil(orderState.deliveryDays / 2))
    : orderState.deliveryDays;
  const gigName  = formatGigName(orderState.gig);
  const priceStr = sym + orderState.finalPrice.toLocaleString();
  const delivStr = orderState.delivery === "fast" ? `Rush (${days} days)` : `Standard (${days} days)`;

  // Self-contained order summary prepended to the email body, so the gig
  // name and price are always visible even on a barebones email template.
  const orderSummary =
    `━━━━━━ NEW ORDER ━━━━━━\n` +
    `Gig:      ${gigName}\n` +
    `Package:  ${orderState.tier}\n` +
    `Price:    ${priceStr}\n` +
    `Delivery: ${delivStr}\n` +
    (orderState.extra ? `Details:  ${orderState.extra}\n` : ``) +
    `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  const templateParams = {
    to_email:   OWNER_EMAIL,
    from_name:  orderState.name,
    from_email: orderState.email,
    gig:        gigName,
    tier:       orderState.tier,
    delivery:   delivStr,
    total:      priceStr,
    country:    userCountry,
    extra:      orderState.extra || "N/A",
    message:    orderSummary + orderState.message,
    reply_to:   orderState.email,
    recaptcha:  recaptchaToken
  };

  try {
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams);
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_CLIENT, {
      from_name:  orderState.name,
      from_email: orderState.email,
      gig:        gigName,
      tier:       orderState.tier,
      delivery:   delivStr,
      total:      priceStr,
      message:    `Your order: ${gigName} — ${orderState.tier} · ${priceStr} · ${delivStr}\n\n` + orderState.message
    });

    document.querySelectorAll(".modal-step").forEach(s => s.classList.remove("active"));
    document.getElementById("step-4").classList.add("active");
    document.getElementById("confirm-email").textContent = orderState.email;

    // Restate the order (gig + package + price) on the confirmation screen.
    const confirmOrder = document.getElementById("confirm-order");
    if (confirmOrder) {
      confirmOrder.innerHTML =
        `<span>${gigName} · ${orderState.tier}</span><strong>${priceStr}</strong>`;
    }

  } catch (err) {
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