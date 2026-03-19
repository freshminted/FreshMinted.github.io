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
    excerpt:  "The specific editing techniques that separate amateur cuts from professional ones — and the one tip most tutorials never mention.",
    category: "video",
    date:     "March 18, 2026",
    readTime: "4 min read",
    emoji:    "🎬",
    image:    "",
    featured: false,
    content: `
      <p>Most beginner editors focus on what cut to make. Professional editors focus on <strong>how</strong> the cut feels. There's a big difference. Here are the 5 techniques I use on every project — and one tip at the end that most tutorials completely skip.</p>

      <h2>1. The J-Cut and L-Cut — The Invisible Edit</h2>
      <p>If you want your edits to feel seamless, this is the one. A <em>J-Cut</em> means the audio from the next scene starts slightly before the video cuts. An <em>L-Cut</em> is the opposite — video cuts but audio from the previous scene lingers.</p>
      <p>The result? The viewer's brain processes the transition naturally, like how real life works. You never consciously notice a well-executed J or L cut. That's the point.</p>

      <h2>2. Whip Zoom (Smash Zoom)</h2>
      <p>Zoom out from one scene, crash zoom into the next. Done right with matching speed and a subtle motion blur, this creates incredible energy. It's a staple in gaming montages and highlight reels — but it works in any fast-paced content.</p>
      <p>The key is matching the zoom speed to the music beat. Off-beat whip zooms feel wrong even if the viewer can't explain why.</p>

      <h2>3. Liquid / Water Drop Transition</h2>
      <p>That satisfying fluid morph between scenes. This is an organic wipe — the transition shape mimics a liquid spreading across the frame. Used sparingly, it adds a premium feel. Overused, it becomes a distraction.</p>
      <p>Rule: use it at major scene changes, not between every clip.</p>

      <h2>4. Rack Focus</h2>
      <p>One subject is in focus, another is blurred. You shift focus between them while the camera stays still. It directs the viewer's attention exactly where you want it — without a cut at all.</p>
      <p>In post production, you can fake this with blur masks and keyframes in After Effects or DaVinci Resolve. It's not as clean as real camera rack focus, but it works for most content.</p>

      <h2>5. The Flip Transition</h2>
      <p>Classic for a reason. A card or page flip between scenes. Clean, satisfying, works on almost any content type. Don't overcomplicate it — sometimes the simple techniques are simple because they work.</p>

      <h2>The Tip Most Tutorials Skip</h2>
      <p>Here it is — the one thing I wish someone had told me early: <strong>explore every single effect in your editing software.</strong></p>
      <p>Not to use them all. But to know they exist. Most editors only use what they've been shown. The editors who develop a truly unique style are the ones who spent hours clicking through the effects panel just to see what happens.</p>
      <p>Your editing style develops from your knowledge of what's possible. You can't create something you don't know exists. Open the effects panel. Click everything. Build your mental library.</p>

      <h2>My Workflow</h2>
      <p>I use Premiere Pro for the rough cut and assembly, After Effects for motion graphics and complex transitions, DaVinci Resolve for colour grading, then back to Premiere to wrap everything up. Each tool does something the others don't — knowing all three is a genuine advantage.</p>

      <blockquote>Want a free audit of your current editing? Send me a clip and I'll show you exactly how I'd improve it.</blockquote>
    `
  },

  /* ══ GAMING ══ */
  {
    id:       "cities-traffic-disaster",
    title:    "Why Your Cities: Skylines Traffic Is Always a Disaster",
    excerpt:  "3 specific mistakes most players make before 50k population — curved roads, roundabouts, and the metro system most players ignore.",
    category: "gaming",
    date:     "March 18, 2026",
    readTime: "6 min read",
    emoji:    "🏙️",
    image:    "",
    featured: false,
    content: `
      <p>Your city is at 40,000 citizens. Traffic is at 62%. The main road into the industrial district is backed up for three kilometres. You've added more roads. It's getting worse. Sound familiar?</p>
      <p>After hundreds of hours in Cities: Skylines, I've seen the same three mistakes kill traffic flow in almost every struggling city. Here they are — and exactly how to fix them.</p>

      <h2>Mistake 1: Right Angle Corners</h2>
      <p>Most players build roads like a grid — perfectly straight lines meeting at sharp 90-degree corners. It looks neat. It destroys traffic flow.</p>
      <p>The problem is physics. When a vehicle hits a sharp corner, it has to slow down significantly to turn. Multiply that by hundreds of vehicles per minute and you have a permanent bottleneck baked into your road design.</p>
      <p><strong>The fix:</strong> Use curved roads at every corner and junction. A curved road lets vehicles maintain speed through a turn — they don't need to brake as hard. This also dramatically improves road merging, because vehicles can blend into traffic smoothly rather than forcing their way in at a hard angle.</p>
      <p>It takes slightly longer to build. The traffic improvement is immediate and significant.</p>

      <h2>Mistake 2: No Roundabouts</h2>
      <p>Traffic lights stop traffic. Roundabouts keep it moving. This sounds simple but most players avoid roundabouts because they look complex to build.</p>
      <p>A roundabout at a busy intersection eliminates the stop-start cycle of traffic lights entirely. Vehicles yield briefly and merge — they rarely come to a complete stop. At peak hours, a roundabout handles roughly twice the vehicle throughput of a signalled intersection of the same size.</p>
      <p><strong>The fix:</strong> Replace your 4-way intersections in high-traffic areas with roundabouts. Start with your city centre and the entrances to industrial zones — those are where the worst bottlenecks form.</p>

      <h2>Mistake 3: Ignoring the Metro</h2>
      <p>This is the biggest one. Most players look at the metro system cost and decide to stick with buses. This is the single worst decision you can make for a growing city.</p>
      <p>Buses use your roads. Every bus is another vehicle adding to traffic. When traffic is already bad, buses get stuck too — making public transport slow and making your roads worse simultaneously.</p>
      <p>Metro runs underground. It does not interact with road traffic at all. Every citizen who takes the metro is one fewer car on your roads. At 50,000+ population, a well-designed metro system can reduce road traffic by 30-40%.</p>
      <p><strong>The fix:</strong> Build metro early, before traffic becomes critical. Connect residential zones to commercial and industrial zones with direct metro lines. Cover your dead zones — areas where citizens have no public transport option at all. Those residents all drive.</p>

      <h2>The Order of Fixes</h2>
      <p>If your city is already struggling, apply fixes in this order: metro first (biggest impact, doesn't require demolishing anything), roundabouts second (replace existing intersections), curved roads third (long-term rebuild as you expand).</p>

      <blockquote>Stuck on a specific traffic problem? Send me a screenshot or describe your situation — I offer free 10-minute game strategy sessions.</blockquote>
    `
  },

  /* ══ BUSINESS ══ */
  {
    id:       "cheap-pricing-kills",
    title:    "Why Cheap Pricing Kills Your Freelance Career Before It Starts",
    excerpt:  "Charging ₹11 for a gig doesn't make you approachable — it makes you look like a scam. The psychology of pricing and what actually builds trust.",
    category: "business",
    date:     "March 18, 2026",
    readTime: "5 min read",
    emoji:    "📊",
    image:    "",
    featured: false,
    content: `
      <p>I learned this the hard way. During the development of FreshMint, my PPP pricing model — which adjusts prices based on your country — accidentally set a $30 service to ₹11 for Indian visitors. Eleven rupees. That's less than a chai.</p>
      <p>Nobody ordered it. And they shouldn't have — because ₹11 doesn't say "affordable." It says "something is wrong here."</p>

      <h2>The Psychology of Price Anchoring</h2>
      <p>Here's a thought experiment. You're looking for a video editor. You find two — one charges $10, the other shows a crossed-out $40 with a current price of $10. Same price. Which do you trust more?</p>
      <p>Almost everyone picks the second. The crossed-out price acts as an anchor — it tells your brain "this is worth $40, you're getting a deal." The first option has no anchor, so your brain fills the gap with suspicion.</p>
      <p>This is why MRP (Maximum Retail Price) exists on products. The original price isn't just information — it's a trust signal. When there's no reference point, humans assume the worst.</p>

      <h2>The Real Cost of Underpricing</h2>
      <p>I've watched many beginners underprice themselves, thinking it will attract more clients. What actually happens:</p>
      <ul>
        <li>You attract clients who only care about price — the hardest clients to work with</li>
        <li>You can't invest in better tools or skills because margins are too thin</li>
        <li>You build a reputation at the bottom of the market — very hard to escape</li>
        <li>You burn out doing high volume at low rates before you ever build real momentum</li>
      </ul>

      <h2>The Local Business Story</h2>
      <p>There was a local company doing reasonably well. To increase sales, they decided to cut prices significantly — operating at a much smaller margin but hoping volume would compensate.</p>
      <p>The result was the opposite of what they expected. Sales dropped. Customers who had previously trusted the brand started saying "nobody sells at that price — they must be cutting corners on materials." The low price destroyed the trust the brand had spent years building.</p>
      <p>They eventually had to close. Not because of bad products. Because of bad pricing psychology.</p>

      <h2>What to Do Instead</h2>
      <p>Price for the value you deliver, not the market you think you're competing in. Then use PPP — adjust for purchasing power by region, not desperation. A $25 service at ₹580 for an Indian client is fair. ₹11 is an insult to both of you.</p>
      <p>Show your original price. Offer a regional discount. Let clients feel like they're getting real value — because they are.</p>

      <blockquote>Want a free audit of your brand's social media presence? I'll give you 3 specific improvements you can make this week.</blockquote>
    `
  },

  /* ══ WEB / CODE ══ */
  {
    id:       "persistent-music-player",
    title:    "How I Built a Persistent Music Player That Works Across Every Page",
    excerpt:  "No iframes. No React. Just localStorage and a single script.js. The full story — including everything that failed first.",
    category: "web",
    date:     "March 18, 2026",
    readTime: "8 min read",
    emoji:    "💻",
    image:    "",
    featured: false,
    content: `
      <p>The original brief was simple: a music player that keeps playing when you navigate to a different page. Simple to describe. Surprisingly painful to build on a static HTML site with no backend.</p>
      <p>Here's everything that failed, what I learned, and how it finally works.</p>

      <h2>Why It's Hard</h2>
      <p>Every time you click a link on a normal website, the browser destroys the current page entirely and builds a new one from scratch. That includes your audio element, your JavaScript state, everything. Music stops. Every time.</p>
      <p>Frameworks like React solve this with a virtual DOM — they never actually reload the page. But FreshMint is pure HTML/CSS/JS. No framework. So I had to solve it differently.</p>

      <h2>What Failed First: The iFrame Approach</h2>
      <p>The first idea was to put the music player inside an iframe. The iframe would stay alive while the main content changed around it. In theory, clean. In practice, a disaster.</p>
      <p>iFrames create isolated browsing contexts. Communication between the iframe and the parent page requires <code>postMessage</code> — which works but adds complexity. The player UI couldn't access the main page's DOM. Styling became a nightmare. The player looked like it was embedded from another website entirely.</p>
      <p>Then there were the smaller issues — unclosed brackets, wrong variable scopes, timing problems with script execution order. Every fix revealed another problem underneath.</p>
      <p>Scrapped it entirely.</p>

      <h2>The Solution: SPA Navigation + localStorage</h2>
      <p>The real solution was to stop letting the browser reload pages at all. When you click a link on FreshMint, <code>navigation.js</code> intercepts the click, fetches the new page content via the Fetch API, and swaps only the body content — while keeping the navbar and music player completely untouched in the DOM.</p>
      <p>The audio element never gets destroyed. It just keeps playing.</p>
      <p>localStorage handles the state persistence — so if you do hard-reload a page, the player knows exactly where it was:</p>
      <ul>
        <li>Which song was playing</li>
        <li>The exact timestamp</li>
        <li>Volume level</li>
        <li>Playback speed</li>
        <li>Whether it was playing or paused</li>
        <li>Shuffle and repeat state</li>
      </ul>
      <p>On page load, the player reads from localStorage and resumes exactly where it left off. One line of data, stored locally, no server needed.</p>

      <h2>The Autoplay Problem</h2>
      <p>Modern browsers block autoplay until the user has interacted with the page. So even with perfect state restoration, <code>audio.play()</code> would be rejected on first load.</p>
      <p>The fix: a one-time click listener on the document. The moment the user clicks anything — anything at all — the player checks if music should be playing and resumes. Invisible to the user, solves the browser restriction completely.</p>

      <h2>What I'd Do Differently</h2>
      <p>Build the SPA navigation first, before the player. The iframe path wasted significant time. Understanding that the browser's page reload was the root problem — not the player itself — would have pointed to the right solution immediately.</p>

      <blockquote>Building your own site and stuck on something? I offer web development help as a service — or just reach out on the contact page.</blockquote>
    `
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