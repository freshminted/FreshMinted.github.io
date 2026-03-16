document.addEventListener("DOMContentLoaded", () => {

// ✅ Guard — player only initialises once across SPA navigations
if (window.__fmPlayerInit) return;
window.__fmPlayerInit = true;

/* =========================
   PPP PRICING ENGINE
========================= */

const PPP = {
  US:1, CA:0.95, UK:0.9, AU:0.9,
  IN:0.35, PK:0.32, BD:0.30,
  PH:0.40, BR:0.55, MX:0.60, ID:0.45
};

function getCountry() {
  let lang = navigator.language;
  if (lang.includes("-")) return lang.split("-")[1];
  return "US";
}

const country = getCountry();

document.querySelectorAll(".gig-price").forEach(el => {
  let base = parseFloat(el.dataset.price);
  if (!base) return;
  let multiplier = PPP[country] || 0.85;
  let price = Math.round(base * multiplier);
  let currency = "$";
  if (country === "IN") currency = "₹";
  if (country === "BR") currency = "R$";
  if (country === "PH") currency = "₱";
  el.innerHTML = `
    <span class="old-price">${currency}${base}</span>
    <span class="new-price">${currency}${price}</span>
  `;
});

/* =========================
   NAVBAR — SCROLL SHRINK + GLOW
========================= */

const navbar = document.querySelector(".navbar");

if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("shrink", window.scrollY > 50);
    navbar.classList.toggle("glow",   window.scrollY > 50);
  });
}

/* =========================
   HAMBURGER MENU
========================= */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks   = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

  menuToggle.addEventListener("click", e => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.classList.toggle("open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("open");
    });
  });

  document.addEventListener("click", e => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("open");
    }
  });

}

/* =========================
   PLAYER DATABASE
========================= */

let DB = JSON.parse(localStorage.getItem("fmPlayer")) || {
  song: 0,
  time: 0,
  volume: 0.7,
  speed: 1,
  playing: false,
  shuffle: false,
  repeat: false
};

function saveDB() {
  localStorage.setItem("fmPlayer", JSON.stringify(DB));
}

/* =========================
   SONG LIST
========================= */

const songs = [
  { title: "Low Mileage - Hold You",                                          src: "/assets/audio/song2.mp3" },
  { title: "BIMINI, Avi Snow - No Way",                                       src: "/assets/audio/song3.mp3" },
  { title: "Glitch Cat - REACHOUT",                                           src: "/assets/audio/song1.mp3" },
  { title: "Eli Raain, Cadmium - Ghost [NCS Release]",                        src: "/assets/audio/song4.mp3" },
  { title: "Eli Raain, Syndec - Lost [NCS Release]",                          src: "/assets/audio/song5.mp3" },
  { title: "Low Mileage - Hold You [NCS Release]",                            src: "/assets/audio/song6.mp3" },
  { title: "Max Landry, Zeus X Crona - Lights Turn Out [NCS Release]",        src: "/assets/audio/song7.mp3" },
  { title: "November Lights, Diviners - Change [NCS Release]",                src: "/assets/audio/song8.mp3" },
];

/* Shuffle queue — used when shuffle is on */
let shuffleQueue = [];

function buildShuffleQueue(currentIdx) {
  shuffleQueue = songs.map((_,i) => i).filter(i => i !== currentIdx);
  for (let i = shuffleQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffleQueue[i], shuffleQueue[j]] = [shuffleQueue[j], shuffleQueue[i]];
  }
  shuffleQueue.unshift(currentIdx);
}

function getNextSong() {
  if (DB.shuffle) {
    const idx = shuffleQueue.indexOf(DB.song);
    return shuffleQueue[(idx + 1) % shuffleQueue.length];
  }
  return (DB.song + 1) % songs.length;
}

function getPrevSong() {
  if (DB.shuffle) {
    const idx = shuffleQueue.indexOf(DB.song);
    return shuffleQueue[(idx - 1 + shuffleQueue.length) % shuffleQueue.length];
  }
  return (DB.song - 1 + songs.length) % songs.length;
}

/* =========================
   BUILD PLAYER HTML
========================= */

if (!document.querySelector(".music-player")) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="music-player" id="fm-player">

      <div class="player-drag-handle" title="Drag to move"></div>

      <div class="player-header">
        <div class="player-track-info">
          <div class="player-song-title" id="song-title">Loading...</div>
          <div class="player-song-index" id="song-index">1 / ${songs.length}</div>
        </div>
        <div class="player-actions">
          <button id="playlist-btn" title="Playlist" aria-label="Playlist">☰</button>
          <button id="min-btn"      title="Minimize"  aria-label="Minimize">⟂</button>
          <button id="circle-btn"   title="Mini mode" aria-label="Mini mode">◉</button>
        </div>
      </div>

      <canvas id="wave"></canvas>

      <div class="progress" id="progress-track" role="slider" aria-label="Seek">
        <div class="progress-bar" id="progress-bar"></div>
        <div class="progress-thumb" id="progress-thumb"></div>
      </div>

      <div class="time-row">
        <span id="time-current">0:00</span>
        <span id="time-total">0:00</span>
      </div>

      <div class="controls">
        <button id="shuffle-btn" title="Shuffle" aria-label="Shuffle" class="ctrl-extra">⇄</button>
        <button id="prev"        title="Previous (←)" aria-label="Previous">⏮</button>
        <button id="play"        title="Play/Pause (Space)" aria-label="Play">▶</button>
        <button id="next"        title="Next (→)" aria-label="Next">⏭</button>
        <button id="repeat-btn"  title="Repeat" aria-label="Repeat" class="ctrl-extra">↻</button>
      </div>

      <div class="player-bottom">
        <span class="vol-icon" id="vol-icon" title="Mute (M)">🔊</span>
        <input type="range" id="volume" min="0" max="1" step="0.01" aria-label="Volume">
        <select id="speed" aria-label="Playback speed">
          <option value="0.75">0.75×</option>
          <option value="1" selected>1×</option>
          <option value="1.25">1.25×</option>
          <option value="1.5">1.5×</option>
        </select>
      </div>

      <!-- PLAYLIST PANEL -->
      <div class="playlist-panel" id="playlist-panel">
        <div class="playlist-header">
          <span>Playlist</span>
          <button id="playlist-close">✕</button>
        </div>
        <ul class="playlist-items" id="playlist-items"></ul>
      </div>

      <div class="orb" id="orb" title="Click to expand"></div>

      <audio id="audio" crossorigin="anonymous"></audio>

    </div>
  `);
}

/* =========================
   PLAYER VARIABLES
========================= */

const player        = document.querySelector(".music-player");
const audio         = document.getElementById("audio");
const titleEl       = document.getElementById("song-title");
const indexEl       = document.getElementById("song-index");
const playBtn       = document.getElementById("play");
const nextBtn       = document.getElementById("next");
const prevBtn       = document.getElementById("prev");
const volSlider     = document.getElementById("volume");
const speedSel      = document.getElementById("speed");
const progressTrack = document.getElementById("progress-track");
const progressBar   = document.getElementById("progress-bar");
const progressThumb = document.getElementById("progress-thumb");
const orb           = document.getElementById("orb");
const volIcon       = document.getElementById("vol-icon");
const timeCurrent   = document.getElementById("time-current");
const timeTotal     = document.getElementById("time-total");
const shuffleBtn    = document.getElementById("shuffle-btn");
const repeatBtn     = document.getElementById("repeat-btn");
const playlistBtn   = document.getElementById("playlist-btn");
const playlistPanel = document.getElementById("playlist-panel");
const playlistClose = document.getElementById("playlist-close");
const playlistItems = document.getElementById("playlist-items");

/* =========================
   HELPERS
========================= */

function fmt(s) {
  if (isNaN(s) || s === Infinity) return "0:00";
  let m   = Math.floor(s / 60);
  let sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function updateVolIcon() {
  let v = parseFloat(volSlider.value);
  volIcon.textContent = v === 0 ? "🔇" : v < 0.4 ? "🔉" : "🔊";
}

function updateShuffleBtn() {
  shuffleBtn.style.color   = DB.shuffle ? "#4CAF50" : "rgba(255,255,255,0.4)";
  shuffleBtn.style.opacity = DB.shuffle ? "1" : "0.5";
}

function updateRepeatBtn() {
  repeatBtn.style.color   = DB.repeat ? "#4CAF50" : "rgba(255,255,255,0.4)";
  repeatBtn.style.opacity = DB.repeat ? "1" : "0.5";
}

/* =========================
   PLAYLIST
========================= */

function buildPlaylist() {
  playlistItems.innerHTML = "";
  songs.forEach((s, i) => {
    const li = document.createElement("li");
    li.className = "playlist-item" + (i === DB.song ? " active" : "");
    li.innerHTML = `
      <span class="pl-num">${i + 1}</span>
      <span class="pl-title">${s.title}</span>
      <span class="pl-play">${i === DB.song ? "▶" : ""}</span>
    `;
    li.onclick = () => {
      DB.time = 0;
      loadSong(i, false);
      audio.play();
      playBtn.textContent = "⏸";
      DB.playing = true;
      player.classList.add("is-playing");
      saveDB();
      buildPlaylist();
    };
    playlistItems.appendChild(li);
  });
}

playlistBtn.onclick = () => {
  const open = playlistPanel.classList.toggle("open");
  playlistBtn.style.color = open ? "#4CAF50" : "";
  if (open) buildPlaylist();
};

playlistClose.onclick = () => {
  playlistPanel.classList.remove("open");
  playlistBtn.style.color = "";
};

/* =========================
   LOAD SONG
========================= */

function loadSong(i, resume) {
  audio.src           = songs[i].src;
  titleEl.textContent = songs[i].title;
  indexEl.textContent = (i + 1) + " / " + songs.length;
  DB.song = i;
  saveDB();

  if (resume && DB.time > 0) {
    audio.addEventListener("canplay", () => {
      audio.currentTime = DB.time;
    }, { once: true });
  }

  audio.addEventListener("loadedmetadata", () => {
    timeTotal.textContent = fmt(audio.duration);
  }, { once: true });

  // Update playlist highlight if open
  if (playlistPanel.classList.contains("open")) buildPlaylist();
}

loadSong(DB.song, true);

/* =========================
   RESTORE SETTINGS
========================= */

audio.volume       = DB.volume;
audio.playbackRate = DB.speed;
volSlider.value    = DB.volume;
speedSel.value     = DB.speed;
updateVolIcon();
updateShuffleBtn();
updateRepeatBtn();

if (DB.playing) playBtn.textContent = "⏸";
if (DB.shuffle) buildShuffleQueue(DB.song);

/* =========================
   AUTO RESUME ON FIRST INTERACTION
========================= */

document.addEventListener("click", () => {
  if (DB.playing) {
    audio.play().catch(() => {});
    initAudio();
  }
}, { once: true });

/* =========================
   PLAY / PAUSE
========================= */

playBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
    DB.playing = true;
    player.classList.add("is-playing");
    initAudio();
  } else {
    audio.pause();
    playBtn.textContent = "▶";
    DB.playing = false;
    player.classList.remove("is-playing");
  }
  saveDB();
};

/* =========================
   SHUFFLE
========================= */

shuffleBtn.onclick = () => {
  DB.shuffle = !DB.shuffle;
  if (DB.shuffle) buildShuffleQueue(DB.song);
  updateShuffleBtn();
  saveDB();
};

/* =========================
   REPEAT
========================= */

repeatBtn.onclick = () => {
  DB.repeat = !DB.repeat;
  updateRepeatBtn();
  saveDB();
};

/* =========================
   NEXT / PREV
========================= */

nextBtn.onclick = () => {
  DB.song = getNextSong();
  DB.time = 0;
  loadSong(DB.song, false);
  audio.play();
  playBtn.textContent = "⏸";
  DB.playing = true;
  player.classList.add("is-playing");
  saveDB();
};

prevBtn.onclick = () => {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  DB.song = getPrevSong();
  DB.time = 0;
  loadSong(DB.song, false);
  audio.play();
  playBtn.textContent = "⏸";
  DB.playing = true;
  player.classList.add("is-playing");
  saveDB();
};

/* Repeat or advance on song end */
audio.onended = () => {
  if (DB.repeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextBtn.click();
  }
};

/* =========================
   PROGRESS — TIME UPDATE
========================= */

audio.ontimeupdate = () => {
  if (!audio.duration) return;
  let pct = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width   = pct + "%";
  progressThumb.style.left  = pct + "%";
  timeCurrent.textContent   = fmt(audio.currentTime);
  DB.time = audio.currentTime;
  saveDB();
};

/* =========================
   SEEK — click + drag
========================= */

let seeking = false;

function doSeek(clientX) {
  let rect = progressTrack.getBoundingClientRect();
  let pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  if (audio.duration) audio.currentTime = pct * audio.duration;
}

progressTrack.addEventListener("mousedown",  e => { seeking = true; doSeek(e.clientX); });
document.addEventListener("mousemove",       e => { if (seeking) doSeek(e.clientX); });
document.addEventListener("mouseup",         ()  => { seeking = false; });

progressTrack.addEventListener("touchstart", e => { seeking = true; doSeek(e.touches[0].clientX); }, { passive: true });
document.addEventListener("touchmove",       e => { if (seeking) doSeek(e.touches[0].clientX); },    { passive: true });
document.addEventListener("touchend",        ()  => { seeking = false; });

/* =========================
   VOLUME
========================= */

volSlider.oninput = () => {
  audio.volume = volSlider.value;
  DB.volume    = parseFloat(volSlider.value);
  updateVolIcon();
  saveDB();
};

volIcon.onclick = () => {
  audio.muted         = !audio.muted;
  volIcon.textContent = audio.muted ? "🔇" : (DB.volume < 0.4 ? "🔉" : "🔊");
};

/* =========================
   SPEED
========================= */

speedSel.onchange = () => {
  audio.playbackRate = speedSel.value;
  DB.speed           = parseFloat(speedSel.value);
  saveDB();
};

/* =========================
   KEYBOARD SHORTCUTS
   Disabled on games page so Space/Arrows don't conflict
========================= */

document.addEventListener("keydown", e => {
  if (["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) return;
  // Don't hijack keys on games page — games need Space + Arrow keys
  if (document.getElementById("gameCanvas")) return;

  switch (e.code) {
    case "Space":
      e.preventDefault(); playBtn.click(); break;
    case "ArrowRight":
      e.preventDefault(); nextBtn.click(); break;
    case "ArrowLeft":
      e.preventDefault(); prevBtn.click(); break;
    case "ArrowUp":
      e.preventDefault();
      audio.volume    = Math.min(1, audio.volume + 0.05);
      volSlider.value = audio.volume;
      DB.volume       = audio.volume;
      updateVolIcon(); saveDB(); break;
    case "ArrowDown":
      e.preventDefault();
      audio.volume    = Math.max(0, audio.volume - 0.05);
      volSlider.value = audio.volume;
      DB.volume       = audio.volume;
      updateVolIcon(); saveDB(); break;
    case "KeyM":
      audio.muted         = !audio.muted;
      volIcon.textContent = audio.muted ? "🔇" : (DB.volume < 0.4 ? "🔉" : "🔊");
      break;
    case "KeyS":
      shuffleBtn.click(); break;
    case "KeyR":
      repeatBtn.click(); break;
  }
});

/* =========================
   AUDIO ANALYSER
========================= */

let audioCtx, analyser, dataArray;
let vizStarted = false;

const canvas = document.getElementById("wave");
const ctx    = canvas.getContext("2d");
canvas.width  = 260;
canvas.height = 55;

function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    let src  = audioCtx.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 128;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    if (!vizStarted) { vizStarted = true; drawViz(); }
  } catch (err) {
    console.warn("AudioContext error:", err);
  }
}

/* =========================
   VISUALIZER — centered bars
========================= */

function drawViz() {
  requestAnimationFrame(drawViz);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!analyser) {
    ctx.strokeStyle = "rgba(76,175,80,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    return;
  }

  analyser.getByteFrequencyData(dataArray);

  let count = dataArray.length;
  let barW  = Math.floor(canvas.width / count) - 1;

  for (let i = 0; i < count; i++) {
    let v    = dataArray[i] / 255;
    let barH = Math.max(2, v * canvas.height);
    let x    = i * (barW + 1);
    let y    = (canvas.height - barH) / 2;
    let green = Math.floor(175 + v * 80);
    ctx.fillStyle = `rgba(76,${green},80,${0.4 + v * 0.6})`;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 2);
    ctx.fill();
  }

  // Orb bass pulse
  let scale = 1 + (dataArray[2] / 255) * 0.8;
  orb.style.transform = `scale(${scale})`;
}

drawViz();

/* =========================
   PLAYER MODES
========================= */

const minBtn    = document.getElementById("min-btn");
const circleBtn = document.getElementById("circle-btn");

minBtn.onclick = () => {
  player.classList.toggle("minimized");
  player.classList.remove("circle");
  playlistPanel.classList.remove("open");
};

circleBtn.onclick = () => {
  player.classList.toggle("circle");
  player.classList.remove("minimized");
  playlistPanel.classList.remove("open");
};

orb.onclick = () => player.classList.remove("circle");

/* =========================
   DRAG — desktop (from handle)
========================= */

let dragging = false, dragOX, dragOY;

const handle = player.querySelector(".player-drag-handle");

handle.addEventListener("mousedown", e => {
  dragging = true;
  let r    = player.getBoundingClientRect();
  dragOX   = e.clientX - r.left;
  dragOY   = e.clientY - r.top;
  player.style.transition = "none";
  e.preventDefault();
});

document.addEventListener("mousemove", e => {
  if (!dragging) return;
  player.style.right  = "auto";
  player.style.bottom = "auto";
  player.style.left   = (e.clientX - dragOX) + "px";
  player.style.top    = (e.clientY - dragOY) + "px";
});

document.addEventListener("mouseup", () => {
  dragging = false;
  player.style.transition = "";
});

/* =========================
   DRAG — mobile (from header)
========================= */

player.addEventListener("touchstart", e => {
  if (!e.target.closest(".player-drag-handle, .player-header")) return;
  dragging = true;
  dragOX   = e.touches[0].clientX - player.offsetLeft;
  dragOY   = e.touches[0].clientY - player.offsetTop;
}, { passive: true });

document.addEventListener("touchmove", e => {
  if (!dragging) return;
  player.style.left   = (e.touches[0].clientX - dragOX) + "px";
  player.style.top    = (e.touches[0].clientY - dragOY) + "px";
  player.style.right  = "auto";
  player.style.bottom = "auto";
}, { passive: true });

document.addEventListener("touchend", () => dragging = false);

}); // end DOMContentLoaded