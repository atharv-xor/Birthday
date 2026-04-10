const TARGET_DATE  = new Date('2026-04-10T18:30:00Z'); 
const YT_VIDEO_ID  = 'fydbhIZJwNs'; 
const YT_START_SEC = 25; 

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
launchBtn.addEventListener('click', () => {
  if (isPlaying) return;
  
  // Safe-check: only play if functions exist
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    if (ytPlayer.unmute) ytPlayer.unmute();
    ytPlayer.seekTo(YT_START_SEC, true);
    ytPlayer.playVideo();
    isPlaying = true;
    setButtonPlaying();
  } else {
    // If player failed, show a message instead of getting stuck
    btnLabel.textContent = "Audio Error (Use HTTPS)";
    setTimeout(setButtonIdle, 2000);
  }
});

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

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  // Check if it's already birthday time
  if (true) {
    triggerReveal();
  } else {
    updateCountdown();
    window.countdownInterval = setInterval(updateCountdown, 1000);
  }
}); 
