// ===== APP.JS =====

AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });

// ===== STATE =====
let currentMemoryId = null;
let playerState = { 
  playing: false, 
  index: 0, 
  slides: [], 
  interval: null, 
  memory: null,
  durations: [],      // array of durations for each slide
  offsets: [],        // start time (seconds) for each slide in the global timeline
  totalDuration: 0,
  preloader: null     // hidden video element for buffering
};
let unlockTimer = null;
let unlockProgress = 0;
let signatures = JSON.parse(localStorage.getItem('hf_signatures') || '[]');
let sigCanvas, sigCtx, isDrawing = false;

// ===== INTRO SEQUENCE =====
window.addEventListener('load', async () => {
  // Await the new dynamic manifest loading system
  if (typeof initMemoriesData === 'function') {
    await initMemoriesData();
  }

  const logo = document.getElementById('logo-text');
  const sweep = document.getElementById('logo-sweep');
  const tagline = document.getElementById('intro-tagline');
  const intro = document.getElementById('intro-screen');

  // Animate logo in
  gsap.fromTo(logo,
    { opacity: 0, scale: 0.6, letterSpacing: '0.5em', skewX: -8 },
    { opacity: 1, scale: 1, letterSpacing: '0.15em', skewX: 0, duration: 1.1, ease: 'back.out(1.4)', delay: 0.3 }
  );

  // Sweep light
  gsap.fromTo(sweep,
    { backgroundPosition: '-100% 0', opacity: 0 },
    { backgroundPosition: '200% 0', opacity: 1, duration: 1.4, delay: 0.8, ease: 'power2.inOut' }
  );

  // Glow pulse on logo
  gsap.to(logo, {
    textShadow: '0 0 120px rgba(229,9,20,0.9), 0 0 240px rgba(229,9,20,0.5)',
    duration: 0.6, delay: 1.2, yoyo: true, repeat: 1
  });

  // Tagline
  gsap.to(tagline, { opacity: 1, y: 0, duration: 0.6, delay: 1.6 });
  gsap.set(tagline, { y: 20 });

  // Exit intro
  gsap.to(intro, {
    opacity: 0, duration: 0.7, delay: 3.0, ease: 'power2.inOut',
    onComplete: () => {
      intro.style.display = 'none';
      document.getElementById('main-navbar').style.display = 'flex';
      document.getElementById('main-content').style.display = 'block';
      initApp();
    }
  });
});


// ===== INIT APP =====
function initApp() {
  renderHero();
  if (document.getElementById('row-albums')) renderRows();
  renderContinueWatching();
  initNavbarScroll();
  initSearch();
  if (document.getElementById('sigCanvas')) initSignatureCanvas();
}

// ===== NAVBAR SCROLL =====
function initNavbarScroll() {
  const nav = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== HERO =====
function renderHero() {
  const m    = MEMORIES[0];
  const bgA  = document.getElementById('heroBgA');
  const bgB  = document.getElementById('heroBgB');

  // Pre-load the album poster as a fallback background
  if (bgA) bgA.style.backgroundImage = `url('${m.heroImage}')`;
  if (bgB) bgB.style.backgroundImage = `url('${m.heroImage}')`;

  // Launch the hero slideshow engine (assets/images/manifest.json)
  if (typeof HeroSlideshow !== 'undefined') {
    // HeroSlideshow.init(); // Disabled to keep the static image background.
  }
}

// ===== MEMORY ROWS =====
function renderRows() {
  console.log("HOMIEFLIX: Starting Album Render...");
  const container = document.getElementById('row-albums');
  if (!container) {
    console.error("HOMIEFLIX: Container #row-albums not found!");
    return;
  }

  // Use a safer filter for the 20 albums
  const albums = MEMORIES.filter(m => m.category === 'album' || true); // Fallback: show everything
  console.log(`HOMIEFLIX: Found ${albums.length} albums to show.`);

  if (albums.length > 0) {
    container.innerHTML = albums.map(m => buildCard(m)).join('');
    
    setTimeout(() => {
      new Swiper('#swiper-albums', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        freeMode: true,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
          320:  { slidesPerView: 2.2 },
          600:  { slidesPerView: 3.2 },
          900:  { slidesPerView: 4.2 },
          1200: { slidesPerView: 5.2 }
        }
      });
      console.log("HOMIEFLIX: Swiper Initialized.");
    }, 100);
  } else {
    container.innerHTML = '<p style="padding: 2rem; color: #aaa;">No albums found in data/memories.js</p>';
  }
}

function buildCard(m) {
  const isFav = favorites.includes(m.id);
  return `
    <div class="swiper-slide" style="width:220px">
      <div class="memory-card" onclick="openMemory(${m.id})">
        <img src="${m.poster}" alt="${m.title}" loading="lazy"/>
        <div class="card-play-icon">▶</div>
        <div class="card-overlay">
          <div class="card-title">${m.title}</div>
          <div class="card-meta">
            <span>${m.year}</span>
            <span>${m.tags[0]}</span>
            ${isFav ? '<span style="color:#e50914">❤️</span>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== CONTINUE WATCHING =====
function renderContinueWatching() {
  if (!continueWatching.length) return;
  const section = document.getElementById('continueWatchingSection');
  const row = document.getElementById('continueWatchingRow');
  section.style.display = 'block';

  row.innerHTML = continueWatching.map(entry => {
    const m = MEMORIES.find(x => x.id === entry.id);
    if (!m) return '';
    const pct = Math.round((entry.slideIndex / m.slides.length) * 100);
    return `
      <div class="swiper-slide" style="width:220px">
        <div class="cw-card" onclick="playMemory(${m.id}, ${entry.slideIndex})">
          <img src="${m.poster}" alt="${m.title}" style="width:100%;height:100%;object-fit:cover"/>
          <div class="cw-progress" style="width:${pct}%"></div>
          <div class="cw-label">${m.title}</div>
        </div>
      </div>
    `;
  }).join('');

  new Swiper('.swiper-cw', {
    slidesPerView: 'auto', spaceBetween: 10, freeMode: true,
    breakpoints: { 320: {slidesPerView:2.2}, 600: {slidesPerView:3.2}, 900: {slidesPerView:4.2} }
  });
}

// ===== OPEN MEMORY MODAL =====
function openMemory(id) {
  currentMemoryId = id;
  const m = MEMORIES.find(x => x.id === id);
  if (!m) return;

  document.getElementById('modalPoster').src = m.poster;
  document.getElementById('modalTitle').textContent = m.title;
  document.getElementById('modalYear').textContent = m.year;
  document.getElementById('modalDuration').textContent = m.duration;
  document.getElementById('modalDesc').textContent = m.description;
  document.getElementById('modalTags').innerHTML = m.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

  const isFav = favorites.includes(id);
  document.getElementById('modalListBtn').textContent = isFav ? '✓ In My List' : '+ My List';

  document.getElementById('modalPlayBtn').onclick = () => { closeModal(); playMemory(id); };

  document.getElementById('memoryModal').classList.add('active');
}

function closeModal() {
  document.getElementById('memoryModal').classList.remove('active');
}

// ===== FAVORITES =====
function toggleFavorite() {
  if (currentMemoryId === null) return;
  const idx = favorites.indexOf(currentMemoryId);
  if (idx === -1) {
    favorites.push(currentMemoryId);
    document.getElementById('modalListBtn').textContent = '✓ In My List';
  } else {
    favorites.splice(idx, 1);
    document.getElementById('modalListBtn').textContent = '+ My List';
  }
  localStorage.setItem('hf_favorites', JSON.stringify(favorites));
}

function openFavorites() {
  const panel = document.getElementById('favoritesPanel');
  const grid = document.getElementById('favGrid');
  const favMemories = MEMORIES.filter(m => favorites.includes(m.id));

  grid.innerHTML = favMemories.length
    ? favMemories.map(m => `
        <div class="fav-item" onclick="openMemory(${m.id})">
          <img src="${m.poster}" alt="${m.title}"/>
          <div class="fav-item-label">${m.title}</div>
        </div>
      `).join('')
    : '<p style="color:var(--hf-muted);grid-column:1/-1;text-align:center;padding:2rem">No favourites yet.<br>Hit + My List on any memory!</p>';

  panel.classList.add('open');
}

function closeFavorites() {
  document.getElementById('favoritesPanel').classList.remove('open');
}

// ===== SURPRISE MODE =====
const SURPRISE_TYPES = ['confetti', 'particles', 'quote', 'flash'];

function showSurprise(cb) {
  const type = SURPRISE_TYPES[Math.floor(Math.random() * SURPRISE_TYPES.length)];
  const modal = document.getElementById('surpriseModal');
  const content = document.getElementById('surpriseContent');
  modal.classList.add('active');

  const quotes = [
    "\"Some moments are too beautiful to forget.\" ✨",
    "\"Not all treasure is silver and gold, mate.\" 🏴‍☠️",
    "\"The best memories are the ones we never planned.\" 🌟",
    "\"Time flies, but memories last forever.\" 💛",
    "\"Life is made of moments — collect them all.\" 🎬"
  ];

  if (type === 'confetti') {
    content.innerHTML = `<div style="font-size:5rem">🎉</div><h2 style="font-family:var(--font-display);font-size:2.5rem;letter-spacing:0.1em;margin-top:1rem;color:var(--hf-red)">SHOWTIME!</h2><p style="color:var(--hf-muted);margin-top:0.5rem">Get ready for something special...</p>`;
    launchConfetti();
  } else if (type === 'particles') {
    content.innerHTML = `<div style="font-size:5rem">💫</div><h2 style="font-family:var(--font-display);font-size:2.5rem;letter-spacing:0.1em;margin-top:1rem;color:var(--hf-red)">MEMORY UNLOCKED</h2><p style="color:var(--hf-muted);margin-top:0.5rem">Starring: You & Your Homies</p>`;
    launchParticles();
  } else if (type === 'quote') {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    content.innerHTML = `<div style="font-size:3rem;margin-bottom:1rem">🎬</div><blockquote style="font-size:1.3rem;font-style:italic;color:#fff;line-height:1.7;max-width:360px;animation:quoteReveal 0.8s ease forwards">${q}</blockquote>`;
  } else {
    content.innerHTML = `<div style="font-size:5rem;animation:flashBang 0.8s ease">⚡</div><h2 style="font-family:var(--font-display);font-size:2.5rem;letter-spacing:0.1em;margin-top:1rem">LIGHTS...</h2><p style="color:var(--hf-muted)">CAMERA... ACTION!</p>`;
  }

  setTimeout(() => {
    modal.classList.remove('active');
    setTimeout(cb, 200);
  }, 2200);
}

function launchConfetti() {
  const colors = ['#e50914','#f5c518','#fff','#46d369','#ff9900'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random()*100}vw;
      top: -20px;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      width: ${Math.random()*10+5}px;
      height: ${Math.random()*10+5}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random()*2}s;
      animation-delay: ${Math.random()*0.5}s;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

function launchParticles() {
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const angle = Math.random() * 360;
    const dist = 80 + Math.random() * 120;
    el.style.cssText = `
      left: 50vw; top: 50vh;
      --tx: ${Math.cos(angle)*dist}px;
      --ty: ${Math.sin(angle)*dist}px;
      background: ${Math.random() > 0.5 ? '#e50914' : '#f5c518'};
      animation: particleFloat 1.2s ease forwards;
      animation-delay: ${Math.random()*0.3}s;
      position: fixed; z-index: 3600;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

// ===== PLAYER =====
function playMemory(id, startIndex = 0) {
  const m = MEMORIES.find(x => x.id === id);
  if (!m) return;

  // iOS Safari: unlock audio and video IMMEDIATELY inside the user-gesture handler.
  // The 2.2s surprise animation kills the gesture context, so we pre-unlock here.
  unlockAudio();
  primeVideo();

  showSurprise(() => {
    playerState.memory = m;
    playerState.slides = m.slides;
    playerState.index = startIndex;
    playerState.playing = true;
    playerState.durations = new Array(m.slides.length).fill(5);
    playerState.offsets = new Array(m.slides.length).fill(0);
    playerState.totalDuration = 0;

    document.getElementById('playerTitle').textContent = m.title;
    document.getElementById('playerOverlay').style.display = 'block';
    gsap.fromTo('#playerOverlay', { opacity: 0 }, { opacity: 1, duration: 0.6 });

    calculateGlobalTimeline();
    renderPlayerSlide();
    startPlayerInterval();
    tryPlayMusic();
    saveContinueWatching(id, startIndex);
    preScanDurations();
  });
}

// Unlock the audio element on first user gesture so iOS allows later .play() calls
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  const audio = document.getElementById('bgMusic');
  audio.volume = 0;
  const p = audio.play();
  if (p !== undefined) {
    p.then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.4;
      audioUnlocked = true;
    }).catch(() => {});
  }
}

// Ensure video element can play after the delay
function primeVideo() {
  const vid = document.getElementById('playerVid');
  if (!vid) return;
  // Play/Pause briefly to satisfy iOS "user gesture" requirement
  const p = vid.play();
  if (p !== undefined) {
    p.then(() => vid.pause()).catch(() => {});
  }
}

function manualVideoStart() {
  const vid = document.getElementById('playerVid');
  if (vid) {
    vid.play().then(() => {
      document.getElementById('mobilePlayOverlay').style.display = 'none';
    }).catch(() => {});
  }
}

function calculateGlobalTimeline() {
  let offset = 0;
  playerState.slides.forEach((slide, i) => {
    playerState.offsets[i] = offset;
    offset += playerState.durations[i] || 5;
  });
  playerState.totalDuration = offset;
}

async function preScanDurations() {
  // Quickly check video durations to build a precise timeline
  for (let i = 0; i < playerState.slides.length; i++) {
    const s = playerState.slides[i];
    if (s.type === 'video') {
      const temp = document.createElement('video');
      temp.src = s.src;
      temp.preload = 'metadata';
      temp.onloadedmetadata = () => {
        playerState.durations[i] = temp.duration;
        calculateGlobalTimeline();
        temp.remove();
      };
    }
  }
}

function renderPlayerSlide() {
  const slide = playerState.slides[playerState.index];
  const img = document.getElementById('playerImg');
  const vid = document.getElementById('playerVid');
  const caption = document.getElementById('slideCaption');
  const bg = document.getElementById('playerBg');

  gsap.to('#playerOverlay .player-content', { opacity: 0, duration: 0.3, onComplete: () => {
    caption.textContent = slide.caption || '';
    
    if (slide.type === 'video') {
      img.style.display = 'none';
      vid.style.display = 'block';
      
      // Reset the video element fully (important for iOS)
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
      
      vid.src = slide.src;
      // muted attribute is set in HTML; this is a belt-and-suspenders for some Android browsers
      vid.muted = true;
      
      // Reset time display
      document.getElementById('playerTime').textContent = "0:00 / 0:00";
      
      // Ensure video is properly loaded before play
      vid.load();
      const p = vid.play();
      if (p !== undefined) {
        p.catch(e => {
          console.log("Video play blocked, showing overlay", e);
          document.getElementById('mobilePlayOverlay').style.display = 'block';
        });
      }
      
      // Clear overlay on successful manual start
      vid.onplay = () => {
        document.getElementById('mobilePlayOverlay').style.display = 'none';
      };
      
      // Update progress and time every interval
      vid.ontimeupdate = () => {
        if (!vid.duration) return;
        
        playerState.durations[playerState.index] = vid.duration;
        calculateGlobalTimeline();

        const globalCurrent = playerState.offsets[playerState.index] + vid.currentTime;
        const pct = (globalCurrent / playerState.totalDuration) * 100;
        
        document.getElementById('playerFill').style.width = pct + '%';
        document.getElementById('playerTime').textContent = `${formatTime(globalCurrent)} / ${formatTime(playerState.totalDuration)}`;
        
        if (vid.currentTime > vid.duration - 2 && playerState.index < playerState.slides.length - 1) {
          preloadNextSlide(playerState.index + 1);
        }
      };

      // Auto-advance after video ends
      vid.onended = () => { if (playerState.playing) nextSlide(); };
      
      bg.style.backgroundImage = `url('${playerState.memory.poster}')`;
    } else {
      document.getElementById('playerTime').textContent = ""; 
      vid.style.display = 'none';
      vid.pause();
      vid.removeAttribute('src');
      img.style.display = 'block';
      img.src = slide.src;
      bg.style.backgroundImage = `url('${slide.src}')`;
      
      const globalCurrent = playerState.offsets[playerState.index];
      const pct = (globalCurrent / playerState.totalDuration) * 100;
      document.getElementById('playerFill').style.width = pct + '%';
    }

    gsap.fromTo('#playerOverlay .player-content',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    );
  }});

  const total = playerState.slides.length;
  // If it's the 30-clip "single movie", we hide the counter
  const isSingleMovie = playerState.slides.length > 20; 
  document.getElementById('playerCounter').style.opacity = isSingleMovie ? '0' : '1';
  document.getElementById('playerCounter').textContent = `${playerState.index + 1} / ${total}`;
}

function preloadNextSlide(idx) {
  const next = playerState.slides[idx];
  if (!next) return;
  if (next.type === 'video') {
    if (!playerState.preloader) {
      playerState.preloader = document.createElement('video');
      playerState.preloader.style.display = 'none';
      document.body.appendChild(playerState.preloader);
    }
    if (playerState.preloader.dataset.idx !== String(idx)) {
      playerState.preloader.src = next.src;
      playerState.preloader.preload = 'auto';
      playerState.preloader.dataset.idx = idx;
    }
  } else {
    new Image().src = next.src;
  }
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function skipTime(delta) {
  const vid = document.getElementById('playerVid');
  if (vid.style.display !== 'none') {
    vid.currentTime = Math.max(0, Math.min(vid.duration, vid.currentTime + delta));
  } else {
    // For images, we just jump slides
    if (delta > 0) nextSlide(); else prevSlide();
  }
}

function scrubPlayer(e) {
  const wrap = e.currentTarget;
  const rect = wrap.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  const targetTime = playerState.totalDuration * pct;
  
  // Find which slide this time belongs to
  let targetIdx = 0;
  for (let i = 0; i < playerState.offsets.length; i++) {
    if (targetTime >= playerState.offsets[i]) {
      targetIdx = i;
    } else {
      break;
    }
  }

  const slideOffset = targetTime - playerState.offsets[targetIdx];
  
  if (playerState.index !== targetIdx) {
    playerState.index = targetIdx;
    renderPlayerSlide();
  }
  
  const vid = document.getElementById('playerVid');
  if (vid.style.display !== 'none') {
    vid.currentTime = slideOffset;
  }
}

function startPlayerInterval() {
  clearInterval(playerState.interval);
  if (playerState.playing) {
    playerState.interval = setInterval(() => {
      const currentSlide = playerState.slides[playerState.index];
      // Only auto-advance if it's an image. Videos have their own 'onended' trigger.
      if (currentSlide.type !== 'video') {
        if (playerState.index < playerState.slides.length - 1) {
          playerState.index++;
          renderPlayerSlide();
          saveContinueWatching(playerState.memory.id, playerState.index);
        } else {
          clearInterval(playerState.interval);
        }
      }
    }, 5000); // 5 seconds for images
  }
}

function togglePlay() {
  playerState.playing = !playerState.playing;
  document.getElementById('playPauseBtn').textContent = playerState.playing ? '⏸' : '▶';
  if (playerState.playing) {
    startPlayerInterval();
    tryPlayMusic();
  } else {
    clearInterval(playerState.interval);
    document.getElementById('bgMusic').pause();
  }
}

function nextSlide() {
  clearInterval(playerState.interval);
  if (playerState.index < playerState.slides.length - 1) {
    playerState.index++;
    renderPlayerSlide();
    startPlayerInterval();
    saveContinueWatching(playerState.memory.id, playerState.index);
  } else {
    // Reached the end: Exit the player
    exitPlayer();
  }
}

function prevSlide() {
  clearInterval(playerState.interval);
  if (playerState.index > 0) {
    playerState.index--;
    renderPlayerSlide();
    startPlayerInterval();
  }
}

function exitPlayer() {
  clearInterval(playerState.interval);
  gsap.to('#playerOverlay', { opacity: 0, duration: 0.4, onComplete: () => {
    document.getElementById('playerOverlay').style.display = 'none';
    const audio = document.getElementById('bgMusic');
    audio.pause();
    audio.currentTime = 0; // Reset music for next play
    playerState.playing = false;
  }});
}

function setVolume(val) {
  document.getElementById('bgMusic').volume = parseFloat(val);
}

function tryPlayMusic() {
  const audio = document.getElementById('bgMusic');
  audio.volume = 0.4;
  // If already unlocked by unlockAudio(), this will succeed on iOS too
  const p = audio.play();
  if (p !== undefined) p.catch(() => {});
}

// ===== CONTINUE WATCHING =====
function saveContinueWatching(id, slideIndex) {
  continueWatching = continueWatching.filter(x => x.id !== id);
  continueWatching.unshift({ id, slideIndex });
  continueWatching = continueWatching.slice(0, 6);
  localStorage.setItem('hf_continue', JSON.stringify(continueWatching));
}

// ===== LOCKED MEMORY =====
function startUnlock() {
  unlockProgress = 0;
  const fill = document.getElementById('unlockProgress');
  unlockTimer = setInterval(() => {
    unlockProgress += 3.5;
    fill.style.width = unlockProgress + '%';
    if (unlockProgress >= 100) {
      clearInterval(unlockTimer);
      revealSecret();
    }
  }, 100);
}

function cancelUnlock() {
  clearInterval(unlockTimer);
  gsap.to('#unlockProgress', { width: '0%', duration: 0.5 });
}

function revealSecret() {
  const modal = document.getElementById('surpriseModal');
  const content = document.getElementById('surpriseContent');
  modal.classList.add('active');

  content.innerHTML = `
    <div style="font-size:5rem;margin-bottom:1.5rem;animation:lockPulse 2s infinite">${SECRET_MEMORY.emoji}</div>
    <h2 style="font-family:var(--font-display);font-size:2rem;letter-spacing:0.1em;color:var(--hf-red);margin-bottom:1rem">${SECRET_MEMORY.title}</h2>
    <p style="color:rgba(255,255,255,0.85);line-height:1.8;font-size:1rem;max-width:400px;margin:0 auto 2rem">${SECRET_MEMORY.message}</p>
    <button class="btn-play" onclick="document.getElementById('surpriseModal').classList.remove('active')">Close ✕</button>
  `;

  launchConfetti();
  document.getElementById('unlockProgress').style.width = '0%';
}

// ===== SEARCH =====
function initSearch() {
  document.getElementById('searchInput').addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    if (!q) return;
    const results = MEMORIES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q))
    );
    // Show first result in modal
    if (results.length) openMemory(results[0].id);
  });
}

// ===== SIGNATURES =====
function initSignatureCanvas() {
  sigCanvas = document.getElementById('sigCanvas');
  if (!sigCanvas) return;
  sigCtx = sigCanvas.getContext('2d');
  sigCtx.strokeStyle = '#e50914';
  sigCtx.lineWidth = 2;
  sigCtx.lineCap = 'round';

  sigCanvas.addEventListener('mousedown', e => { isDrawing = true; sigCtx.beginPath(); sigCtx.moveTo(...getPos(e)); });
  sigCanvas.addEventListener('mousemove', e => { if (!isDrawing) return; sigCtx.lineTo(...getPos(e)); sigCtx.stroke(); });
  sigCanvas.addEventListener('mouseup', () => isDrawing = false);
  sigCanvas.addEventListener('touchstart', e => { e.preventDefault(); isDrawing = true; sigCtx.beginPath(); sigCtx.moveTo(...getPos(e.touches[0])); }, { passive: false });
  sigCanvas.addEventListener('touchmove', e => { e.preventDefault(); if (!isDrawing) return; sigCtx.lineTo(...getPos(e.touches[0])); sigCtx.stroke(); }, { passive: false });
  sigCanvas.addEventListener('touchend', () => isDrawing = false);

  initSignatures();
}

function initSignatures() {
  renderSignaturesWall();
}

function getPos(e) {
  const r = sigCanvas.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
}

function clearCanvas() {
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
}

function saveSignature() {
  const name = document.getElementById('sigName').value.trim();
  const msg = document.getElementById('sigMessage').value.trim();
  if (!name && !msg) return;

  const drawing = sigCanvas.toDataURL();
  const entry = { name: name || 'Anonymous', msg, drawing, time: new Date().toLocaleDateString() };
  signatures.unshift(entry);
  localStorage.setItem('hf_signatures', JSON.stringify(signatures));

  document.getElementById('sigName').value = '';
  document.getElementById('sigMessage').value = '';
  clearCanvas();
  renderSignaturesWall();

  gsap.from('.sig-entry:first-child', { opacity: 0, y: -20, duration: 0.4 });
}

function renderSignaturesWall() {
  const wall = document.getElementById('sigWall');
  if (!wall) return;
  if (!signatures.length) {
    wall.innerHTML = '<p style="color:var(--hf-muted);text-align:center;padding:2rem">Be the first to sign the wall! ✍️</p>';
    return;
  }
  wall.innerHTML = signatures.map(s => `
    <div class="sig-entry">
      <div class="sig-name">${s.name}</div>
      ${s.msg ? `<div class="sig-msg">"${s.msg}"</div>` : ''}
      ${s.drawing ? `<img src="${s.drawing}" style="width:100%;border-radius:4px;margin-top:0.4rem;opacity:0.7" alt="signature"/>` : ''}
      <div class="sig-time">${s.time}</div>
    </div>
  `).join('');
}

function openSignatures() { window.location.href = 'signatures.html'; }
function closeSignatures() {}


// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  const playerVisible = document.getElementById('playerOverlay').style.display !== 'none';
  if (playerVisible) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    if (e.key === 'Escape') exitPlayer();
  }
  if (e.key === 'Escape') closeModal();
});

function toggleMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('mobileMenuOverlay');
  if (btn && overlay) {
    btn.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  }
}

// Close modal on backdrop
document.getElementById('memoryModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
