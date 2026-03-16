/* =========================
   GIG.JS — shared across all gig pages
   Handles: PPP pricing, order popup, EmailJS
========================= */

// Wrap entire gig.js to prevent double-init issues
(function() {

// ── EmailJS config ──────────────────────────────
// 1. Go to emailjs.com and create a free account
// 2. Add Gmail service → copy Service ID below
// 3. Create an email template → copy Template ID below
// 4. Copy your Public Key below
if (typeof emailjs !== 'undefined') {
  emailjs.init("bk2Xr38vMo_Ekp6C_");
}

var EMAILJS_SERVICE  = "service_9ciuxid";
var EMAILJS_TEMPLATE = "template_p462zgr";
var OWNER_EMAIL      = "freshmint.work@gmail.com";
var RECAPTCHA_SITE        = "6Ld9MYssAAAAACoKomRGa0pJ6zdGtqQplIxwXbj2";
var EMAILJS_TEMPLATE_CLIENT = "template_16o1lai"; // confirmation to client

/* =========================
   PPP PRICING
========================= */

const PPP = {
  US:1.00, CA:0.95, GB:0.90, AU:0.90,
  IN:0.35, PK:0.32, BD:0.30, PH:0.40,
  BR:0.55, MX:0.60, ID:0.45, NG:0.30,
  ZA:0.45, AR:0.40, CO:0.45, TR:0.40,
  EG:0.30, VN:0.35, TH:0.45, MY:0.50
};

// USD → local currency exchange rates (ballpark, for price display)
const EXCHANGE = {
  US:1,     CA:1.35,  GB:0.79,   AU:1.53,
  IN:83,    PK:278,   BD:110,    PH:56,
  BR:5.0,   MX:17,    ID:15800,  NG:1550,
  ZA:18,    AR:900,   CO:4000,   TR:32,
  EG:48,    VN:25000, TH:35,     MY:4.7
};

const CURRENCY = {
  US:"$", CA:"CA$", GB:"£", AU:"A$",
  IN:"₹",  PK:"Rs", BD:"৳", PH:"₱",
  BR:"R$", MX:"MX$",ID:"Rp", NG:"₦",
  ZA:"R",  AR:"AR$",CO:"COP",TR:"₺",
  EG:"E£", VN:"₫",  TH:"฿", MY:"RM"
};

let userCountry = "US";
let userCurrency = "$";
let pppMultiplier = 1;

/* =========================
   SALE ENGINE
   3 sale types — all stack together.
   To activate a sale, just set active: true
   and fill in the details below.
========================= */

const SALES = {

  /* TYPE 1 — WORLDWIDE SALE
     Applies to every visitor on every gig.
     Example: Christmas sale, launch discount.
  */
  worldwide: {
    active:   false,          // ← set true to activate
    label:    "🎉 Launch Sale",
    discount: 15,             // % off (e.g. 15 = 15% off)
    expires:  "2026-04-01",   // YYYY-MM-DD, null = no expiry
  },

  /* TYPE 2 — COUNTRY / CONTINENT SALE
     Applies only to specific countries or continents.
     Example: India Independence Day sale, APAC promo.
  */
  regional: {
    active:   false,          // ← set true to activate
    label:    "🇮🇳 India Special",
    discount: 20,             // % off
    expires:  null,
    // Countries (ISO codes) that get the discount
    countries: ["IN", "PK", "BD"],
    // OR target whole continents:
    continents: [],           // "AS" = Asia, "EU" = Europe, "NA" = North America
                              // "SA" = South America, "AF" = Africa, "OC" = Oceania
  },

  /* TYPE 3 — GIG-SPECIFIC SALE
     Applies only to a specific gig page.
     Match GIG_ID from each gig's HTML file.
  */
  gig: {
    active:   false,          // ← set true to activate
    label:    "🎬 Video Special",
    discount: 25,             // % off
    expires:  null,
    gigId:    "video-editing", // matches GIG_ID in the page
  },

};

/* Country → Continent mapping */
const CONTINENTS = {
  AS: ["IN","PK","BD","PH","ID","VN","TH","MY","CN","JP","KR","SG","AE","SA"],
  EU: ["GB","DE","FR","IT","ES","NL","SE","NO","PL","CH","BE","AT","PT","DK"],
  NA: ["US","CA","MX"],
  SA: ["BR","AR","CO","CL","PE","VE"],
  AF: ["NG","ZA","EG","KE","GH","TZ","ET"],
  OC: ["AU","NZ","FJ"],
};

/* Calculate total sale discount for current user + gig */
function getSaleDiscount() {
  const now     = new Date();
  let discount  = 0;
  let labels    = [];

  function notExpired(expires) {
    if (!expires) return true;
    return now < new Date(expires);
  }

  // TYPE 1 — Worldwide
  const w = SALES.worldwide;
  if (w.active && notExpired(w.expires)) {
    discount += w.discount;
    labels.push(w.label + " −" + w.discount + "%");
  }

  // TYPE 2 — Regional
  const r = SALES.regional;
  if (r.active && notExpired(r.expires)) {
    const countryMatch = r.countries.includes(userCountry);
    const continentMatch = r.continents.some(c =>
      (CONTINENTS[c] || []).includes(userCountry)
    );
    if (countryMatch || continentMatch) {
      discount += r.discount;
      labels.push(r.label + " −" + r.discount + "%");
    }
  }

  // TYPE 3 — Gig specific
  const g = SALES.gig;
  if (g.active && notExpired(g.expires)) {
    const currentGig = typeof GIG_ID !== "undefined" ? GIG_ID : "";
    if (currentGig === g.gigId) {
      discount += g.discount;
      labels.push(g.label + " −" + g.discount + "%");
    }
  }

  return { discount, labels };
}

/* Apply sale discount on top of PPP price */
function applyDiscount(price) {
  const { discount } = getSaleDiscount();
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
}

/* Show sale banner on page if any sale is active */
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

  // Insert after navbar
  const navbar = document.querySelector(".navbar");
  if (navbar) navbar.after(banner);
}

// Detect country via free IP geolocation
async function detectCountry() {
  // Step 1 — instant language fallback (works everywhere)
  try {
    const lang = navigator.language || "";
    if (lang.includes("-")) {
      const code = lang.split("-")[1].toUpperCase();
      if (PPP[code]) {
        userCountry   = code;
        pppMultiplier = PPP[code];
        userCurrency  = CURRENCY[code] || "$";
      }
    }
  } catch(e) {}

  // Step 2 — check localStorage cache first (avoids hammering API)
  try {
    const cached = JSON.parse(localStorage.getItem("fmCountry") || "null");
    const now    = Date.now();
    // Cache valid for 24 hours
    if (cached && cached.code && (now - cached.ts) < 86400000) {
      userCountry   = cached.code;
      pppMultiplier = PPP[userCountry]  || 0.80;
      userCurrency  = CURRENCY[userCountry] || "$";
      applyPPP();
      showSaleBanner();
      return; // skip API call entirely
    }
  } catch(e) {}

  // Step 3 — IP API (only called once per day, skipped on localhost)
  try {
    const res  = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("ipapi " + res.status);
    const data = await res.json();
    if (data.country_code) {
      userCountry   = data.country_code;
      pppMultiplier = PPP[userCountry]  || 0.80;
      userCurrency  = CURRENCY[userCountry] || "$";
      // Cache result for 24 hours
      localStorage.setItem("fmCountry", JSON.stringify({
        code: userCountry,
        ts:   Date.now()
      }));
    }
  } catch {
    // CORS on localhost or rate limited — language fallback already applied
  }

  applyPPP();
  showSaleBanner();
}

// Returns localized price:
// Formula: base × PPP multiplier × exchange rate × 0.80 (20% discount)
// Each tier stays proportionally different — no tier collapse.
// 20% off makes the local price feel like a genuine regional deal.
function localPrice(base) {
  const rate   = EXCHANGE[userCountry] || 1;
  const ppp    = Math.round(base * pppMultiplier * rate * 0.80);
  return applyDiscount(ppp); // apply any active sale on top
}

function applyPPP() {
  document.querySelectorAll(".package-price[data-base]").forEach(el => {
    const base  = parseFloat(el.dataset.base);
    const local = localPrice(base);
    if (pppMultiplier < 1) {
      el.innerHTML = `
        <span class="price-original">$${base}</span>
        <span class="price-local">${userCurrency}${local}</span>
        <span class="price-badge">Local pricing</span>
      `;
    } else {
      el.textContent = `$${base}`;
    }
  });

  // Update sidebar starting price — use featured/popular package, not first
  const featuredBase = document.querySelector(".package-card.featured .package-price[data-base]")
                    || document.querySelector(".package-price[data-base]");
  const sidePrice = document.getElementById("sidebar-price");
  if (featuredBase && sidePrice) {
    const base  = parseFloat(featuredBase.dataset.base);
    const local = localPrice(base);
    sidePrice.textContent = pppMultiplier < 1
      ? `${userCurrency}${local} (from $${base})`
      : `$${base}`;
  }
}

detectCountry();

/* =========================
   ORDER STATE
========================= */

let orderState = {
  gig: "",
  tier: "",
  basePrice: 0,
  finalPrice: 0,
  delivery: "standard",
  deliveryDays: 0,
  name: "",
  email: "",
  extra: "",
  message: ""
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

  // Apply PPP to price
  orderState.finalPrice = Math.round(price * pppMultiplier);

  // Reset to step 1
  document.querySelectorAll(".modal-step").forEach(s => s.classList.remove("active"));
  document.getElementById("step-1").classList.add("active");

  // Set header
  document.getElementById("modal-gig-name").textContent = formatGigName(gig);
  document.getElementById("modal-tier").textContent     = tier;

  // Set delivery buttons
  document.getElementById("btn-standard").classList.add("active");
  document.getElementById("btn-fast").classList.remove("active");

  // Populate package summary
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
    "video-editing":  "Video Editing",
    "business-advice":"Business Advice",
    "game-strategy":  "Game Strategy"
  };
  return map[id] || id;
}

/* =========================
   PACKAGE SUMMARY BOX
========================= */

function buildPackageSummary() {
  const lp       = localPrice(orderState.basePrice);
  const priceStr = pppMultiplier < 1
    ? `${userCurrency}${lp} <small>(from $${orderState.basePrice})</small>`
    : `$${orderState.basePrice}`;

  document.getElementById("modal-package-summary").innerHTML = `
    <div class="summary-row"><span>Package</span><strong>${orderState.tier}</strong></div>
    <div class="summary-row"><span>Gig</span><strong>${formatGigName(orderState.gig)}</strong></div>
    <div class="summary-row"><span>Base price</span><strong>${priceStr}</strong></div>
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
  const base  = localPrice(orderState.basePrice);
  const total = orderState.delivery === "fast" ? Math.round(base * 1.5) : base;
  orderState.finalPrice = total;
  const sym   = pppMultiplier < 1 ? userCurrency : "$";
  document.getElementById("modal-total").textContent = sym + total;
}

/* =========================
   STEP NAVIGATION
========================= */

window.nextStep = function(n) {
  // Validate before moving forward
  if (n === 3) {
    const name    = document.getElementById("client-name").value.trim();
    const email   = document.getElementById("client-email").value.trim();
    const message = document.getElementById("client-message").value.trim();

    if (!name)    { alert("Please enter your name.");    return; }
    if (!email || !email.includes("@")) { alert("Please enter a valid email."); return; }
    if (!message) { alert("Please describe your project."); return; }

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
  const sym   = pppMultiplier < 1 ? userCurrency : "$";
  const days  = orderState.delivery === "fast"
    ? Math.max(1, Math.ceil(orderState.deliveryDays / 2))
    : orderState.deliveryDays;

  const extraLabel = {
    "video-editing":  "Minutes of footage",
    "business-advice":"Platform / Business",
    "game-strategy":  "Game & Issue"
  }[orderState.gig] || "Extra info";

  document.getElementById("review-box").innerHTML = `
    <div class="review-row"><span>Name</span><strong>${orderState.name}</strong></div>
    <div class="review-row"><span>Email</span><strong>${orderState.email}</strong></div>
    <div class="review-row"><span>Gig</span><strong>${formatGigName(orderState.gig)}</strong></div>
    <div class="review-row"><span>Package</span><strong>${orderState.tier}</strong></div>
    <div class="review-row"><span>Delivery</span><strong>${orderState.delivery === "fast" ? "⚡ Rush" : "Standard"} (${days} day${days > 1 ? "s" : ""})</strong></div>
    <div class="review-row"><span>Total</span><strong>${sym}${orderState.finalPrice}</strong></div>
    ${orderState.extra ? `<div class="review-row"><span>${extraLabel}</span><strong>${orderState.extra}</strong></div>` : ""}
    <div class="review-row review-row--message"><span>Message</span><p>${orderState.message}</p></div>
  `;
}

/* =========================
   SUBMIT ORDER via EmailJS
========================= */

window.submitOrder = async function() {
  const btn = document.getElementById("submit-btn");
  btn.textContent = "Verifying...";
  btn.disabled    = true;

  // reCAPTCHA v3 — invisible, no checkbox needed
  let recaptchaToken = "";
  try {
    recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE, { action: "submit_order" });
  } catch(e) {
    console.warn("reCAPTCHA failed:", e);
  }

  btn.textContent = "Sending...";

  const sym  = pppMultiplier < 1 ? userCurrency : "$";
  const days = orderState.delivery === "fast"
    ? Math.max(1, Math.ceil(orderState.deliveryDays / 2))
    : orderState.deliveryDays;

  const templateParams = {
    to_email:      OWNER_EMAIL,
    from_name:     orderState.name,
    from_email:    orderState.email,
    gig:           formatGigName(orderState.gig),
    tier:          orderState.tier,
    delivery:      orderState.delivery === "fast" ? `Rush (${days} days)` : `Standard (${days} days)`,
    total:         sym + orderState.finalPrice,
    country:       userCountry,
    extra:         orderState.extra || "N/A",
    message:       orderState.message,
    reply_to:      orderState.email,
    recaptcha:     recaptchaToken
  };

  try {
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams);

    // Send confirmation email to client
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_CLIENT, {
      from_name:  orderState.name,
      from_email: orderState.email,
      gig:        formatGigName(orderState.gig),
      tier:       orderState.tier,
      delivery:   orderState.delivery === "fast"
                    ? `Rush (${Math.max(1, Math.ceil(orderState.deliveryDays/2))} days)`
                    : `Standard (${orderState.deliveryDays} days)`,
      total:      (pppMultiplier < 1 ? userCurrency : "$") + orderState.finalPrice,
      message:    orderState.message
    });

    // Show success
    document.querySelectorAll(".modal-step").forEach(s => s.classList.remove("active"));
    document.getElementById("step-4").classList.add("active");
    document.getElementById("confirm-email").textContent = orderState.email;

  } catch (err) {
    console.error("EmailJS error:", err);
    alert("Something went wrong sending the order. Please email freshmint.work@gmail.com directly.");
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
  a.style.maxHeight = "0";
  a.style.overflow  = "hidden";
  a.style.transition= "max-height 0.4s ease, padding 0.3s ease";

  q.style.cursor = "pointer";
  q.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    if (isOpen) {
      // Temporarily remove overflow:hidden to measure true height
      a.style.overflow  = "visible";
      a.style.maxHeight = "none";
      const h = a.scrollHeight;
      a.style.maxHeight = "0";
      a.style.overflow  = "hidden";
      // Force reflow then animate
      requestAnimationFrame(() => {
        a.style.maxHeight  = h + 20 + "px"; // +20px buffer
        a.style.paddingTop = "10px";
      });
    } else {
      a.style.maxHeight  = "0";
      a.style.paddingTop = "0";
    }
  });
});
})();