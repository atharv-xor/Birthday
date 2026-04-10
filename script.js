const TARGET_DATE  = new Date('2026-04-10T18:30:00Z'); 
const YT_VIDEO_ID  = 'fydbhIZJwNs'; 
const YT_START_SEC = 25; 

/* DOM REFERENCES */
const countdownPanel = document.getElementById('countdown-panel');
const birthdayPanel  = document.getElementById('birthday-panel');
const cdDays         = document.getElementById('cd-days');
const cdHours        = document.getElementById('cd-hours');
const cdMins         = document.getElementById('cd-mins');
const cdSecs         = document.getElementById('cd-secs');
const launchBtn      = document.getElementById('launch-btn');
const btnLabel       = document.getElementById('btn-label');
const btnIcon        = launchBtn.querySelector('.btn-icon');

/* STATE */
let ytPlayer = null;
let ytReady  = false;
let isPlaying = false;

const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

/* COUNTDOWN ENGINE */
function updateCountdown() {
  const distance = TARGET_DATE.getTime() - Date.now();

  if (distance <= 0) {
    clearInterval(countdownInterval);
    triggerReveal();
    return;
  }

  const days  = Math.floor(distance / 864e5);
  const hours = Math.floor((distance % 864e5) / 36e5);
  const mins  = Math.floor((distance % 36e5)  / 6e4);
  const secs  = Math.floor((distance % 6e4)   / 1e3);

  cdDays.textContent = pad(days);
  cdHours.textContent = pad(hours);
  cdMins.textContent = pad(mins);
  cdSecs.textContent = pad(secs);
}

/* STATE MACHINE */
function triggerReveal() {
  // Ensure we stop the timer
  if (window.countdownInterval) clearInterval(window.countdownInterval);
  
  countdownPanel.classList.add('glitch-exit');
  
  setTimeout(() => {
    countdownPanel.hidden = true;
    birthdayPanel.removeAttribute('hidden');
    birthdayPanel.classList.add('revealed');
    
    // Try to load audio, but don't let it block the UI
    loadYouTubeAPI();
  }, 780);
}

/* YOUTUBE IFRAME API */
function loadYouTubeAPI() {
  // If we are on a local file, the API often fails.
  if (window.location.protocol === 'file:') {
    console.warn("Audio might not work on local 'file://' links. Use a live server or upload to GitHub.");
  }

  if (window.YT && window.YT.Player) {
    initYTPlayer();
    return;
  }
  const tag = document.createElement('script');
  tag.src   = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = () => initYTPlayer();

function initYTPlayer() {
  if (ytPlayer) return;
  ytPlayer = new YT.Player('yt-player', {
    height: '0', width: '0', videoId: YT_VIDEO_ID,
    playerVars: { start: YT_START_SEC, autoplay: 0, controls: 0, playsinline: 1 },
    events: {
      onReady: () => { ytReady = true; },
      onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED) setButtonIdle(); }
    }
  });
}
/* ══════════════════════════════════════════════════════
   BUTTON & PARTY LOGIC
══════════════════════════════════════════════════════ */

launchBtn.addEventListener('click', () => {
  if (isPlaying) return;
  
  // Visual transition happens immediately
  setButtonPlaying();
  startTheParty(); 

  // Audio Playback
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    if (ytPlayer.unmute) ytPlayer.unmute();
    ytPlayer.setVolume(100);
    ytPlayer.seekTo(YT_START_SEC, true);
    ytPlayer.playVideo();
    isPlaying = true;
  } else {
    console.warn("Audio failed to load, but the party continues!");
  }
});

function startTheParty() {
  const cat = document.getElementById('meme-container');
  if (cat) cat.style.display = 'block';

  // 1. FLICKER EFFECT: Background flashes to the beat
  gsap.to("body", {
    backgroundColor: "#1a0b2e", 
    duration: 0.1, 
    repeat: 19, // One for each year
    yoyo: true, 
    ease: "none",
    onComplete: () => gsap.set("body", { clearProps: "backgroundColor" }) 
  });

  // 2. OIIA CAT POP: Bounces in from the corner
  gsap.fromTo("#meme-container", 
    { scale: 0, rotation: 45, y: 100 }, 
    { scale: 1, rotation: 0, y: 0, duration: 1, ease: "back.out(1.7)" }
  );

  // 3. OIIA CAT VIBE: Infinite loop of hopping
  gsap.to("#meme-container", {
    y: -40,
    duration: 0.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // 4. CAKE ANIMATION: Bouncing and Pulsing
  gsap.to("#cake-container", {
    scale: 1.6,
    rotation: 10,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });
}

function setButtonPlaying() {
  launchBtn.disabled = true;
  launchBtn.style.opacity = "0.7";
  btnIcon.textContent = '🎂';
  btnLabel.textContent = 'Vibing…';
  if (btnHint) btnHint.classList.add('hidden');
}

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Always skip countdown for testing
  if (true) { 
    countdownPanel.hidden = true;
    birthdayPanel.removeAttribute('hidden');
    birthdayPanel.classList.add('revealed');
    loadYouTubeAPI();
  }
});
