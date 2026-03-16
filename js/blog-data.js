/* =========================
   FRESHMINT BLOG DATA
   ═══════════════════════════════════════════════
   TO ADD A POST:
   Copy one of the objects below, paste it at the
   TOP of the POSTS array, fill in your content.

   TO REMOVE A POST:
   Delete the object from the array.

   TO EDIT A POST:
   Find it by title and change the fields.

   CATEGORIES: "personal" | "video" | "gaming" | "business" | "web"
   ═══════════════════════════════════════════════
========================= */

const BLOG_POSTS = [

  /* ══════════════════════════════
     TEMPLATE — copy this to add a new post
     ══════════════════════════════
  {
    id:       "my-post-slug",          // URL slug — no spaces, use hyphens
    title:    "Your Post Title Here",
    excerpt:  "Short description shown on the blog grid. Keep it under 120 characters.",
    category: "personal",              // personal | video | gaming | business | web
    date:     "March 16, 2026",
    readTime: "5 min read",
    emoji:    "🌿",                    // shown as thumbnail until you add a real image
    image:    "",                      // optional: "/assets/images/blog/post.jpg" or YouTube thumbnail
    featured: false,                   // set true to show as the big featured post
    content: `
      <p>Your first paragraph here. HTML is supported.</p>

      <h2>A Section Heading</h2>
      <p>More content here.</p>

      <ul>
        <li>Bullet point one</li>
        <li>Bullet point two</li>
      </ul>

      <h2>Another Section</h2>
      <p>Keep writing...</p>
    `
  },
  */

  /* ══ FEATURED POST ══ */
  {
    id:       "building-freshmint",
    title:    "Building FreshMint — From MS Paint to a Full Services Platform",
    excerpt:  "How a 4-year-old with a business laptop and MS Paint ended up building a full freelance platform at 18.",
    category: "personal",
    date:     "March 16, 2026",
    readTime: "5 min read",
    emoji:    "🌿",
    image:    "",
    featured: true,
    content: `
      <p>It started with MS Paint. Age 4 or 5, on my family's business laptop in Kanpur — before most kids were even using a computer, I was already figuring out how pixels worked. Nobody taught me. I just opened it and started clicking.</p>

      <p>That curiosity never really left. It just changed shape over the years — from pixels to video cuts to code to strategy. FreshMint is where all of those things finally meet.</p>

      <h2>How it actually started</h2>
      <p>Video editing came through school annual competitions. That pressure of making something look good on a deadline, in front of an audience — it clicked instantly. I realised I genuinely enjoyed the craft of making something feel a certain way.</p>

      <p>Gaming was never just entertainment. Strategy games in particular — Cities: Skylines, Rise of Industries — they're essentially systems thinking in disguise. You're optimising, problem-solving, recovering from chaos. That's a skill that transfers.</p>

      <p>Business was never something I learned from a textbook. It was a mindset that came from watching how the world actually works. How people trade value. How trust is built or lost. How pricing signals quality.</p>

      <h2>Why FreshMint?</h2>
      <p>I wanted a platform that felt alive — not just another static portfolio with a contact form. The music player, the games, the PPP pricing, the animated everything — it's all intentional. I wanted clients to land on it and feel something.</p>

      <p>The name comes from a simple idea: a freshly minted coin. Clean, new, valuable. Just pressed. That's the energy I want every project to have.</p>

      <h2>What's next</h2>
      <p>First real clients. First real reviews. First real money. Then a domain, then growth, then hiring. The roadmap is clear. The work starts now.</p>

      <p>If you're reading this — thanks for being here early. You're seeing something being built in real time. 🪙</p>
    `
  },

  /* ══ VIDEO EDITING ══ */
  {
    id:       "5-cuts-cinematic",
    title:    "5 Cuts That Make Any Video Feel Cinematic",
    excerpt:  "The specific editing techniques that separate amateur cuts from professional ones — in Premiere and DaVinci.",
    category: "video",
    date:     "Coming soon",
    readTime: "4 min read",
    emoji:    "🎬",
    image:    "",
    featured: false,
    content:  `<p>This post is coming soon. Check back shortly!</p>`
  },

  /* ══ GAMING ══ */
  {
    id:       "cities-traffic-disaster",
    title:    "Why Your Cities: Skylines Traffic Is Always a Disaster",
    excerpt:  "3 specific mistakes most players make in their first 50k population — and exactly how to fix each one.",
    category: "gaming",
    date:     "Coming soon",
    readTime: "6 min read",
    emoji:    "🏙️",
    image:    "",
    featured: false,
    content:  `<p>This post is coming soon. Check back shortly!</p>`
  },

  /* ══ BUSINESS ══ */
  {
    id:       "cheap-pricing-kills",
    title:    "Why Cheap Pricing Kills Your Freelance Career Before It Starts",
    excerpt:  "Charging ₹11 for a gig doesn't make you approachable — it makes you look like a scam. The psychology of pricing.",
    category: "business",
    date:     "Coming soon",
    readTime: "5 min read",
    emoji:    "📊",
    image:    "",
    featured: false,
    content:  `<p>This post is coming soon. Check back shortly!</p>`
  },

  /* ══ WEB / CODE ══ */
  {
    id:       "persistent-music-player",
    title:    "How I Built a Persistent Music Player That Works Across Every Page",
    excerpt:  "No iframes. No React. Just localStorage and a single script.js. The full technical breakdown.",
    category: "web",
    date:     "Coming soon",
    readTime: "8 min read",
    emoji:    "💻",
    image:    "",
    featured: false,
    content:  `<p>This post is coming soon. Check back shortly!</p>`
  },

  /* ══ GAMING 2 ══ */
  {
    id:       "dnfc-survival-guide",
    title:    "Definitely Not Fried Chicken — A Beginner's Survival Guide",
    excerpt:  "This game will break. Your kitchen will catch fire. Your staff will stand in a corner. Here's how to survive.",
    category: "gaming",
    date:     "Coming soon",
    readTime: "5 min read",
    emoji:    "🍗",
    image:    "",
    featured: false,
    content:  `<p>This post is coming soon. Check back shortly!</p>`
  },

  /* ══ VIDEO EDITING 2 ══ */
  {
    id:       "ncs-music-guide",
    title:    "NCS Music — How to Pick the Right Track for Any Edit",
    excerpt:  "Which NCS genres work for which edit styles — and how to sync cuts to the beat properly.",
    category: "video",
    date:     "Coming soon",
    readTime: "4 min read",
    emoji:    "🎵",
    image:    "",
    featured: false,
    content:  `<p>This post is coming soon. Check back shortly!</p>`
  },

  /* ══ PERSONAL 2 ══ */
  {
    id:       "first-client",
    title:    "What Getting My First Client Actually Felt Like",
    excerpt:  "The money was the smallest part of it. An honest post about getting paid for something you built yourself.",
    category: "personal",
    date:     "Coming soon",
    readTime: "3 min read",
    emoji:    "🪙",
    image:    "",
    featured: false,
    content:  `<p>This post is coming soon. Check back shortly!</p>`
  },

  /* ══ BUSINESS 2 ══ */
  {
    id:       "social-media-strategy-2026",
    title:    "The Only Social Media Strategy That Actually Works in 2026",
    excerpt:  "Consistency beats virality every time. The exact content framework I use to build brand accounts from zero.",
    category: "business",
    date:     "Coming soon",
    readTime: "6 min read",
    emoji:    "📱",
    image:    "",
    featured: false,
    content:  `<p>This post is coming soon. Check back shortly!</p>`
  },

  /* ══ WEB 2 ══ */
  {
    id:       "ppp-pricing-explained",
    title:    "PPP Pricing — How I Show Different Prices to Different Countries",
    excerpt:  "IP detection, exchange rates and a simple floor formula — all in a static HTML site with no backend.",
    category: "web",
    date:     "Coming soon",
    readTime: "7 min read",
    emoji:    "🌐",
    image:    "",
    featured: false,
    content:  `<p>This post is coming soon. Check back shortly!</p>`
  },

];