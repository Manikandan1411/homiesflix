/**
 * HOMIEFLIX — Hero Slideshow Engine
 * js/hero-slideshow.js
 *
 * Loads assets/images/manifest.json, then cycles through photos (Ken Burns)
 * and videos (actual playback) in the hero background area.
 * Photos stay for PHOTO_DURATION ms; videos play to completion.
 */

const HeroSlideshow = (() => {
  const PHOTO_DURATION = 5000;   // ms each photo is shown
  const FADE_DURATION  = 800;    // crossfade duration in ms
  const MANIFEST_PATH  = 'assets/images/manifest.json';

  let items    = [];
  let current  = 0;
  let timer    = null;
  let paused   = false;
  let bgA, bgB, vidEl, activeBg;
  let initialized = false;

  // ── Public API ───────────────────────────────────────────
  async function init() {
    bgA   = document.getElementById('heroBgA');
    bgB   = document.getElementById('heroBgB');
    vidEl = document.getElementById('heroBgVideo');

    if (!bgA || !bgB || !vidEl) return;   // not on home page

    try {
      const res  = await fetch(`${MANIFEST_PATH}?t=${Date.now()}`);
      if (!res.ok) throw new Error('no manifest');
      const data = await res.json();
      items = (data.items || []).filter(it => it.file && it.type);
    } catch {
      items = [];
    }

    if (!items.length) {
      // Fallback: just do the original static bg from MEMORIES[0]
      _showFallback();
      return;
    }

    initialized = true;
    activeBg = bgA;
    _showItem(0);
  }

  function pause()  { 
    paused = true;  
    clearTimeout(timer); 
    vidEl.pause(); 
    gsap.killTweensOf('#heroProgressBar');
    if (document.getElementById('heroPlayPauseBtn')) document.getElementById('heroPlayPauseBtn').textContent = '▶';
  }
  function resume() { 
    paused = false; 
    if (initialized) _scheduleNext(); else vidEl.play().catch(()=>{}); 
    if (document.getElementById('heroPlayPauseBtn')) document.getElementById('heroPlayPauseBtn').textContent = '⏸';
  }

  function next() { _showItem(current + 1); }
  function prev() { _showItem(current - 1); }
  
  function togglePlay() {
    if (paused) resume(); else pause();
  }

  function toggleMute() {
    vidEl.muted = !vidEl.muted;
    
    // Also control global background music
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
      if (vidEl.muted) bgMusic.pause();
      else bgMusic.play().catch(()=>{});
    }
    
    const muteBtn = document.getElementById('heroMuteBtn');
    if (muteBtn) muteBtn.textContent = vidEl.muted ? '🔇' : '🔊';
  }

  // ── Private ───────────────────────────────────────────────
  function _showItem(idx) {
    current = ((idx % items.length) + items.length) % items.length;
    const item     = items[current];
    const nextBg   = activeBg === bgA ? bgB : bgA;
    const basePath = 'assets/images/';

    clearTimeout(timer);

    // Reset video
    vidEl.pause();
    vidEl.removeAttribute('src');
    vidEl.style.opacity = '0';

    // Reset progress bar
    gsap.killTweensOf('#heroProgressBar');
    gsap.set('#heroProgressBar', { scaleX: 0 });

    if (item.type === 'video') {
      // ── VIDEO ──────────────────────────────────────────
      // Set a still from the current photo bg so there's no black flash
      vidEl.src = basePath + item.file;
      vidEl.muted = true;
      vidEl.loop  = false;
      vidEl.style.opacity = '0';
      vidEl.load();

      vidEl.oncanplay = () => {
        if (current !== ((items.indexOf(item) + items.length) % items.length)) return; // stale
        _crossfadeToEl(vidEl, nextBg);
        vidEl.play().catch(() => { _scheduleNext(PHOTO_DURATION); });

        vidEl.onended = () => {
          if (!paused) _showItem(current + 1);
        };
      };

      // Timeout in case video fails to load
      setTimeout(() => { if (vidEl.readyState < 2) _showItem(current + 1); }, 8000);

    } else {
      // ── IMAGE ──────────────────────────────────────────
      const img  = new Image();
      img.src    = basePath + item.file;
      img.onload = () => {
        nextBg.style.backgroundImage = `url('${basePath + item.file}')`;
        _crossfadeToEl(nextBg, vidEl);
        _pickKenBurns(nextBg);
        _scheduleNext(PHOTO_DURATION);
      };
      img.onerror = () => _showItem(current + 1);   // skip missing file
    }

    activeBg = nextBg;
  }

  function _crossfadeToEl(incoming, outgoing) {
    // Fade in incoming
    incoming.style.transition = `opacity ${FADE_DURATION}ms ease`;
    incoming.style.opacity = '1';
    // Fade out outgoing
    outgoing.style.transition = `opacity ${FADE_DURATION}ms ease`;
    outgoing.style.opacity = '0';
  }

  const KB_SETS = [
    { start: 'scale(1.08) translate(0,0)',   end: 'scale(1.0)  translate(0,0)'    },
    { start: 'scale(1.0)  translate(0,0)',   end: 'scale(1.08) translate(-1%,-1%)' },
    { start: 'scale(1.06) translate(-2%,0)', end: 'scale(1.0)  translate(2%,0)'   },
    { start: 'scale(1.0)  translate(1%,1%)', end: 'scale(1.07) translate(-1%,-1%)'},
  ];
  function _pickKenBurns(el) {
    const kb = KB_SETS[Math.floor(Math.random() * KB_SETS.length)];
    el.style.transition  = 'none';
    el.style.transform   = kb.start;
    requestAnimationFrame(() => {
      el.style.transition = `transform ${PHOTO_DURATION + FADE_DURATION}ms ease`;
      el.style.transform  = kb.end;
    });
  }

  function _scheduleNext(delay = PHOTO_DURATION) {
    clearTimeout(timer);
    if (!paused) {
      if (document.getElementById('heroProgressBar')) {
        gsap.fromTo('#heroProgressBar', { scaleX: 0 }, { scaleX: 1, duration: delay / 1000, ease: "none" });
      }
      timer = setTimeout(() => _showItem(current + 1), delay);
    }
  }

  function _showFallback() {
    // Use MEMORIES[0] poster as static bg (already handled by app.js renderHero)
  }

  return { init, pause, resume, next, prev, togglePlay, toggleMute };
})();
