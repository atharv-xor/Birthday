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

/* BUTTON ACTION */
/* ══════════════════════════════════════════════════════
   BUTTON & PARTY LOGIC
══════════════════════════════════════════════════════ */

launchBtn.addEventListener('click', () => {
  if (isPlaying) return;
  
  // Check if YouTube player is ready and has the required methods
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    if (ytPlayer.unmute) ytPlayer.unmute();
    ytPlayer.setVolume(100);
    ytPlayer.seekTo(YT_START_SEC, true);
    ytPlayer.playVideo();
    
    isPlaying = true;
    setButtonPlaying();
    startTheParty(); // 🚀 Trigger the GSAP chaos
  } else {
    btnLabel.textContent = "Audio Error (Use HTTPS)";
    setTimeout(setButtonIdle, 2000);
  }
});

function startTheParty() {
  const cat = document.getElementById('meme-container');
  if (cat) cat.style.display = 'block';

  // 1. Flicker Effect: Flashes background to deep purple
  gsap.to("body", {
    backgroundColor: "#2e0249", 
    duration: 0.1, 
    repeat: 15, 
    yoyo: true, 
    ease: "none",
    onComplete: () => gsap.set("body", { backgroundColor: "#050509" }) 
  });

  // 2. Oiia Cat Pop: Comes in with a bounce
  gsap.fromTo("#meme-container", 
    { scale: 0, rotation: -20 }, 
    { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" }
  );

  // 3. Floating Cat Loop
  gsap.to("#meme-container", {
    y: -30,
    duration: 0.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // 4. Cake Bounce
  gsap.to("#cake-container", {
    scale: 1.4,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });
}

function setButtonPlaying() {
  launchBtn.disabled = true;
  btnIcon.textContent = '🎂';
  btnLabel.textContent = 'Vibing…';
}

function setButtonIdle() {
  isPlaying = false;
  launchBtn.disabled = false;
  btnIcon.textContent = '🎵';
  btnLabel.textContent = 'Launch Birthday Vibe';
}

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const distance = TARGET_DATE.getTime() - Date.now();

  // Change to 'distance <= 0' tonight so the countdown works!
  if (true) { 
    triggerReveal();
  } else {
    updateCountdown();
    window.countdownInterval = setInterval(updateCountdown, 1000);
  }
});
