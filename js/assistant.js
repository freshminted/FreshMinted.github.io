/* =========================================================
   FRESHMINT ORDERING ASSISTANT  (assistant.js)
   A self-contained, no-backend guided helper. It asks a few
   quick questions, recommends the right service + package,
   explains "why order from FreshMint", and opens the order
   box (or sends the visitor to the right gig page).

   Loads on every page. Rule-based — no API key, no cost.
   ========================================================= */

(function () {
  if (window.__fmAssistant) return;
  window.__fmAssistant = true;

  /* ---------- service / package data ---------- */
  const SVC = {
    "video-editing": {
      name: "Video Editing", icon: "🎬", url: "/services/video-editing.html",
      scopes: [
<<<<<<< HEAD
        { label: "A Reel, Short or speed-edit clip", tier: "Startup" },
=======
        { label: "Just one quick reel or short", tier: "Startup" },
>>>>>>> 87ee787ea42d21660881f186b4e99b3bdb4c6e14
        { label: "A few videos / ongoing content", tier: "Professional" },
        { label: "Big project — film, campaign, lots of footage", tier: "Signature" }
      ],
      tiers: { Startup: { base: 8, days: 3 }, Professional: { base: 18, days: 5 }, Signature: { base: 35, days: 7 } },
<<<<<<< HEAD
      why: "cinematic edits with colour grading, music sync and every export size — revisions included until it's right.",
      tierBlurb: {
        Startup: "Punchy, fast-cut speed editing for Reels, Shorts & TikToks — vertical exports, music synced, $8 to start.",
        Professional: "Multi-video pack with Kinetic Sync Editing, AI tools and stock footage for ongoing creators.",
        Signature: "Full cinematic projects — films, campaigns, unlimited raw footage, licensed music and priority support."
      }
=======
      why: "cinematic edits with colour grading, music sync and every export size — revisions included until it's right."
>>>>>>> 87ee787ea42d21660881f186b4e99b3bdb4c6e14
    },
    "business-advice": {
      name: "Business Strategy", icon: "📊", url: "/services/business-advice.html",
      scopes: [
        { label: "Just starting out, one platform", tier: "Starter" },
        { label: "Growing — multi-platform plan", tier: "Growth" },
        { label: "Full brand / serious roadmap", tier: "Authority" }
      ],
      tiers: { Starter: { base: 30, days: 2 }, Growth: { base: 65, days: 4 }, Authority: { base: 120, days: 7 } },
      why: "a clear, actionable strategy doc — audit, content calendar and competitor analysis — not vague tips."
    },
    "web-development": {
      name: "Web Development", icon: "💻", url: "/services/web-development.html",
      scopes: [
        { label: "Fix a bug or small change", tier: "Patch" },
        { label: "Build a site or landing page", tier: "Build" },
        { label: "Full multi-page platform", tier: "Studio" }
      ],
      tiers: { Patch: { base: 20, days: 2 }, Build: { base: 80, days: 7 }, Studio: { base: 180, days: 14 } },
      why: "fast, clean, hand-written code — responsive, optimised, no monthly fees — and revisions until it works."
    },
    "game-strategy": {
      name: "Game Strategy", icon: "🎮", url: "/services/game-strategy.html",
      scopes: [
        { label: "Stuck on one specific problem", tier: "Scout" },
        { label: "Improve my overall play", tier: "Tactician" },
        { label: "Master the whole game", tier: "Commander" }
      ],
      tiers: { Scout: { base: 10, days: 1 }, Tactician: { base: 25, days: 2 }, Commander: { base: 70, days: 3 } },
      why: "a VOD review with timestamped feedback and a custom plan — real strategy tailored to your game."
    }
  };

  const GOALS = [
    { label: "🎬 Make my content look pro", svc: "video-editing" },
    { label: "📊 Grow on social media", svc: "business-advice" },
    { label: "💻 Build or fix a website", svc: "web-development" },
    { label: "🎮 Get better at a game", svc: "game-strategy" }
  ];

  const WHY = [
    "One expert handles your project end-to-end — no account managers, no outsourcing.",
    "Revisions are included until you're genuinely happy.",
    "Replies within 24 hours, every time — usually much faster.",
    "Secure ordering — spam-protected forms, your email is never shown publicly.",
    "Prices are shown in your own local currency, clear and upfront."
  ];

  /* ---------- styles (scoped with fma- prefix) ---------- */
  const css = `
  .fma-launch{position:fixed;bottom:20px;left:20px;z-index:8000;display:flex;align-items:center;gap:10px;
    padding:12px 18px 12px 14px;border:none;border-radius:30px;cursor:pointer;font-family:'DM Sans',sans-serif;
    font-size:14px;font-weight:600;color:#fff;background:var(--accent,#10b981);
    box-shadow:0 8px 24px rgba(16,185,129,0.35);transition:transform .2s ease,box-shadow .2s ease;
    animation:fmaPop .5s cubic-bezier(.4,0,.2,1) both}
  .fma-launch:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(16,185,129,0.45)}
<<<<<<< HEAD
  .fma-launch .fma-ico{font-size:18px;line-height:1;display:inline-flex;align-items:center}
  .fma-launch .fma-ico svg{display:block}
=======
  .fma-launch .fma-ico{font-size:18px;line-height:1}
>>>>>>> 87ee787ea42d21660881f186b4e99b3bdb4c6e14
  .fma-launch .fma-dot{position:absolute;top:-3px;right:-3px;width:12px;height:12px;border-radius:50%;
    background:#ef4444;border:2px solid #fff;animation:fmaPing 1.8s infinite}
  @keyframes fmaPop{from{opacity:0;transform:translateY(20px) scale(.9)}to{opacity:1;transform:none}}
  @keyframes fmaPing{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}70%{box-shadow:0 0 0 7px rgba(239,68,68,0)}}
  @media(max-width:560px){.fma-launch span.fma-label{display:none}.fma-launch{padding:14px;border-radius:50%}}

  .fma-panel{position:fixed;bottom:20px;left:20px;z-index:8001;width:360px;max-width:calc(100vw - 40px);
    max-height:min(620px,calc(100vh - 40px));display:flex;flex-direction:column;overflow:hidden;
    background:rgba(255,255,255,0.82);backdrop-filter:blur(26px) saturate(160%);-webkit-backdrop-filter:blur(26px) saturate(160%);
    border:1px solid rgba(255,255,255,0.7);border-radius:22px;font-family:'DM Sans',sans-serif;color:var(--text,#0f172a);
    box-shadow:0 16px 50px rgba(15,23,42,0.20),inset 0 1px 0 rgba(255,255,255,0.85);
    opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:opacity .25s,transform .25s}
  .fma-panel.open{opacity:1;transform:none;pointer-events:auto}

  .fma-head{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid rgba(15,23,42,0.07)}
  .fma-avatar{width:38px;height:38px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;
    font-size:18px;background:radial-gradient(circle at 35% 30%,#6ee7b7,var(--accent,#10b981),var(--accent-deep,#047857));
    box-shadow:0 4px 12px rgba(16,185,129,0.35)}
  .fma-head h4{margin:0;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:var(--text,#0f172a)}
  .fma-head p{margin:2px 0 0;font-size:11px;color:var(--accent-dark,#059669);font-weight:600}
  .fma-head .fma-x{margin-left:auto;background:rgba(15,23,42,0.05);border:none;width:30px;height:30px;border-radius:50%;
    cursor:pointer;color:var(--text-muted,#8a97a8);font-size:13px;transition:all .2s}
  .fma-head .fma-x:hover{background:rgba(15,23,42,0.1);color:var(--text,#0f172a)}

  .fma-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;
    scrollbar-width:thin;scrollbar-color:rgba(16,185,129,0.4) transparent}
  .fma-body::-webkit-scrollbar{width:5px}
  .fma-body::-webkit-scrollbar-thumb{background:rgba(16,185,129,0.4);border-radius:10px}

  .fma-bot,.fma-user{max-width:88%;font-size:14px;line-height:1.55;padding:11px 14px;border-radius:16px;animation:fmaIn .3s ease both}
  .fma-bot{align-self:flex-start;background:#fff;border:1px solid rgba(15,23,42,0.07);border-bottom-left-radius:5px;
    box-shadow:0 2px 8px rgba(15,23,42,0.05);color:var(--text-body,#475569)}
  .fma-bot strong{color:var(--text,#0f172a)}
  .fma-user{align-self:flex-end;background:var(--accent,#10b981);color:#fff;border-bottom-right-radius:5px;font-weight:500}
  @keyframes fmaIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

  .fma-choices{display:flex;flex-direction:column;gap:8px;align-self:stretch;margin-top:2px}
  .fma-choice{text-align:left;background:rgba(255,255,255,0.9);border:1px solid var(--glass-border,rgba(15,23,42,0.08));
    border-radius:12px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;
    color:var(--text,#0f172a);cursor:pointer;transition:all .18s}
  .fma-choice:hover{border-color:var(--accent-border,rgba(16,185,129,0.4));background:var(--accent-soft,rgba(16,185,129,0.08));
    transform:translateX(3px)}
  .fma-choice.primary{background:var(--accent,#10b981);color:#fff;border-color:transparent;text-align:center;font-weight:700;
    box-shadow:0 6px 16px rgba(16,185,129,0.3)}
  .fma-choice.primary:hover{background:var(--accent-dark,#059669);transform:translateY(-2px)}
  .fma-choice.ghost{text-align:center;color:var(--text-muted,#8a97a8);background:transparent;border-color:transparent}
  .fma-choice.ghost:hover{color:var(--accent-dark,#059669);background:transparent;transform:none}

  .fma-reco{align-self:stretch;background:linear-gradient(180deg,var(--accent-soft,rgba(16,185,129,0.08)),#fff);
    border:1px solid var(--accent-border,rgba(16,185,129,0.3));border-radius:16px;padding:16px;box-shadow:0 4px 14px rgba(15,23,42,0.06)}
  .fma-reco .fma-reco-top{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--accent-dark,#059669);font-weight:700;font-family:'Syne',sans-serif}
  .fma-reco h5{margin:4px 0 6px;font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--text,#0f172a)}
  .fma-reco p{margin:0 0 12px;font-size:13px;line-height:1.6;color:var(--text-body,#475569)}
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- DOM ---------- */
  const launch = document.createElement("button");
  launch.className = "fma-launch";
  launch.setAttribute("aria-label", "Open ordering assistant");
<<<<<<< HEAD
  launch.innerHTML = `<span class="fma-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H8l-5 3v-3a8 8 0 1 1 18-8z"/></svg></span><span class="fma-label">Need help choosing?</span><span class="fma-dot"></span>`;
=======
  launch.innerHTML = `<span class="fma-ico">💬</span><span class="fma-label">Need help choosing?</span><span class="fma-dot"></span>`;
>>>>>>> 87ee787ea42d21660881f186b4e99b3bdb4c6e14

  const panel = document.createElement("div");
  panel.className = "fma-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "FreshMint ordering assistant");
  panel.innerHTML = `
    <div class="fma-head">
      <div class="fma-avatar">🌱</div>
      <div>
        <h4>FreshMint Assistant</h4>
        <p>● Online · replies instantly</p>
      </div>
      <button class="fma-x" aria-label="Close">✕</button>
    </div>
    <div class="fma-body" id="fma-body"></div>
  `;

  document.body.appendChild(launch);
  document.body.appendChild(panel);

  const body = panel.querySelector("#fma-body");
  let started = false;

  /* ---------- helpers ---------- */
  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function bot(html) {
    const el = document.createElement("div");
    el.className = "fma-bot";
    el.innerHTML = html;
    body.appendChild(el);
    scrollDown();
    return el;
  }

  function user(text) {
    const el = document.createElement("div");
    el.className = "fma-user";
    el.textContent = text;
    body.appendChild(el);
    scrollDown();
  }

  function choices(list) {
    const wrap = document.createElement("div");
    wrap.className = "fma-choices";
    list.forEach(c => {
      const b = document.createElement("button");
      b.className = "fma-choice" + (c.cls ? " " + c.cls : "");
      b.textContent = c.label;
      b.onclick = () => {
        wrap.remove();                 // consume the choice set
        if (!c.silent) user(c.label.replace(/^[^\w]+\s*/, ""));
        c.onClick();
      };
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
    scrollDown();
  }

  /* ---------- conversation ---------- */
  function start() {
    body.innerHTML = "";
    bot("👋 Hey! I'm here to help you pick the right service and get your order started. What brings you in?");
    choices([
<<<<<<< HEAD
      { label: "⚡ Edit a Reel / Short (speed editing)", onClick: () => recommend("video-editing", "Startup", false) },
=======
>>>>>>> 87ee787ea42d21660881f186b4e99b3bdb4c6e14
      { label: "🧭 Help me choose a service", onClick: askService },
      { label: "🤔 I'm not sure what I need", onClick: askGoal },
      { label: "💚 Why order from FreshMint?", onClick: showWhy }
    ]);
  }

  function askService() {
    bot("Great — what do you need help with?");
    const list = Object.keys(SVC).map(id => ({
      label: SVC[id].icon + "  " + SVC[id].name,
      onClick: () => askScope(id)
    }));
    list.push({ label: "🤔 Not sure yet", cls: "ghost", onClick: askGoal });
    choices(list);
  }

  function askGoal() {
    bot("No problem — what's your main goal right now?");
    choices(GOALS.map(g => ({ label: g.label, onClick: () => askScope(g.svc) })));
  }

  function askScope(id) {
    const s = SVC[id];
    bot(`Nice choice. For <strong>${s.name}</strong>, which sounds most like your project?`);
    choices(s.scopes.map(sc => ({
      label: sc.label,
      onClick: () => askTimeline(id, sc.tier)
    })));
  }

  function askTimeline(id, tier) {
    bot("Last thing — how soon do you need it?");
    choices([
      { label: "🗓️ No rush", onClick: () => recommend(id, tier, false) },
      { label: "⏳ Within a week", onClick: () => recommend(id, tier, false) },
      { label: "⚡ ASAP — rush it", onClick: () => recommend(id, tier, true) }
    ]);
  }

  function recommend(id, tier, rush) {
    const s = SVC[id];
<<<<<<< HEAD
    const blurb = (s.tierBlurb && s.tierBlurb[tier]) || `This tier fits your scope best. With it you get ${s.why}`;
=======
>>>>>>> 87ee787ea42d21660881f186b4e99b3bdb4c6e14
    const reco = document.createElement("div");
    reco.className = "fma-reco";
    reco.innerHTML = `
      <div class="fma-reco-top">${s.icon} Recommended for you</div>
      <h5>${s.name} — ${tier}</h5>
<<<<<<< HEAD
      <p>${blurb}${rush ? " Rush delivery is available at checkout if you need it fast." : ""}</p>
=======
      <p>This tier fits your scope best. With it you get ${s.why}${rush ? " Rush delivery is available at checkout if you need it fast." : ""}</p>
>>>>>>> 87ee787ea42d21660881f186b4e99b3bdb4c6e14
    `;
    body.appendChild(reco);
    bot("Why FreshMint? " + WHY.slice(0, 3).map(w => "<br>✓ " + w).join(""));
    choices([
      { label: "✅ Start my order", cls: "primary", silent: true, onClick: () => startOrder(id, tier) },
      { label: "See full package details", silent: true, onClick: () => { location.href = s.url; } },
      { label: "↩ Pick something else", cls: "ghost", silent: true, onClick: askService }
    ]);
    scrollDown();
  }

  function showWhy() {
    bot("Here's what you can count on:" + WHY.map(w => "<br>✓ " + w).join(""));
    choices([
      { label: "🧭 OK, help me choose", onClick: askService },
      { label: "💬 Just send a message", cls: "ghost", silent: true, onClick: () => { location.href = "/contact.html"; } }
    ]);
  }

  /* ---------- CTA: open the order box or go to the gig ---------- */
  function startOrder(id, tier) {
    const t = SVC[id].tiers[tier];
    const onMatchingGig =
      typeof window.openOrder === "function" &&
      (typeof GIG_ID !== "undefined" ? GIG_ID === id : location.pathname.indexOf(id) !== -1);

    if (onMatchingGig && t) {
      closePanel();
      window.openOrder(id, tier, t.base, t.days);
    } else {
      // Remember the pick, then head to the gig page to complete the order.
      try { sessionStorage.setItem("fmReco", JSON.stringify({ id: id, tier: tier })); } catch (e) {}
      location.href = SVC[id].url;
    }
  }

  /* ---------- open / close ---------- */
  function openPanel() {
    panel.classList.add("open");
    launch.style.display = "none";
    const dot = launch.querySelector(".fma-dot");
    if (dot) dot.remove();
    if (!started) { started = true; start(); }
  }
  function closePanel() {
    panel.classList.remove("open");
    launch.style.display = "";
  }

  launch.onclick = openPanel;
  panel.querySelector(".fma-x").onclick = closePanel;

  // Deep link: any page with #assistant in the URL opens the helper automatically.
  window.addEventListener("hashchange", () => { if (location.hash === "#assistant") openPanel(); });
  if (location.hash === "#assistant") openPanel();
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
  });

  /* If we arrived from a recommendation on another page, auto-open the order box. */
  document.addEventListener("DOMContentLoaded", () => {
    let reco = null;
    try { reco = JSON.parse(sessionStorage.getItem("fmReco") || "null"); } catch (e) {}
    if (!reco) return;
    sessionStorage.removeItem("fmReco");
    const onGig = typeof window.openOrder === "function" &&
      (typeof GIG_ID !== "undefined" ? GIG_ID === reco.id : location.pathname.indexOf(reco.id) !== -1);
    const t = SVC[reco.id] && SVC[reco.id].tiers[reco.tier];
    if (onGig && t) setTimeout(() => window.openOrder(reco.id, reco.tier, t.base, t.days), 600);
  });

})();
