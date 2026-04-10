const TARGET_DATE  = new Date('2026-04-10T18:30:00Z'); 
const YT_VIDEO_ID  = 'fydbhIZJwNs'; 
const YT_START_SEC = 25; 

/* DOM REFERENCES */
const countdownPanel = document.getElementById('countdown-panel');
const birthdayPanel  = document.getElementById('birthday-panel');
const launchBtn      = document.getElementById('launch-btn');
const btnLabel       = document.getElementById('btn-label');
const btnIcon        = launchBtn.querySelector('.btn-icon');

let ytPlayer = null;
let ytReady  = false;
let isPlaying = false;

/* YOUTUBE ENGINE */
function loadYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src   = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = () => {
  ytPlayer = new YT.Player('yt-player', {
    height: '0', width: '0', videoId: YT_VIDEO_ID,
    playerVars: { start: YT_START_SEC, autoplay: 0, controls: 0, playsinline: 1 },
    events: { onReady: () => { ytReady = true; } }
  });
};

/* PARTY LOGIC (GSAP) */
function startTheParty() {
  const cat = document.getElementById('meme-container');
  if (cat) cat.style.display = 'block';

  // 1. FLICKER: Fast flash background
  gsap.to("body", {
    backgroundColor: "#1a0b2e", 
    duration: 0.1, 
    repeat: 15, 
    yoyo: true, 
    ease: "none",
    onComplete: () => gsap.set("body", { clearProps: "backgroundColor" }) 
  });

  // 2. OIIA CAT: Pop and vibrate
  gsap.fromTo("#meme-container", 
    { scale: 0, rotation: -30 }, 
    { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" }
  );
  
  gsap.to("#meme-container", {
    y: -30,
    duration: 0.35,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // 3. CAKE: Bounce to the beat
  gsap.to("#cake-container", {
    scale: 1.4,
    y: -20,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });
}

/* BUTTON CLICK */
launchBtn.addEventListener('click', () => {
  if (isPlaying) return;
  
  // Start visuals immediately
  startTheParty();
  btnLabel.textContent = 'Vibing…';
  btnIcon.textContent = '🎂';
  launchBtn.disabled = true;

  // Try playing audio
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.unmute();
    ytPlayer.seekTo(YT_START_SEC, true);
    ytPlayer.playVideo();
    isPlaying = true;
  }
});

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  // Preview mode
  if (true) {
    countdownPanel.hidden = true;
    birthdayPanel.removeAttribute('hidden');
    birthdayPanel.classList.add('revealed');
    loadYouTubeAPI();
  }
});
