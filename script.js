const TARGET_DATE  = new Date('2026-04-10T18:30:00Z'); 
const YT_VIDEO_ID  = 'fydbhIZJwNs'; 
const YT_START_SEC = 25; 

const countdownPanel = document.getElementById('countdown-panel');
const birthdayPanel  = document.getElementById('birthday-panel');
const launchBtn      = document.getElementById('launch-btn');
const btnLabel       = document.getElementById('btn-label');

let ytPlayer = null;

function loadYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src   = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = () => {
  ytPlayer = new YT.Player('yt-player', {
    height: '0', width: '0', videoId: YT_VIDEO_ID,
    playerVars: { start: YT_START_SEC, autoplay: 0, controls: 0, playsinline: 1 }
  });
};

/* Inside your startTheParty function */
function startTheParty() {
  const cat = document.getElementById('meme-container');
  if (cat) cat.style.display = 'block';

  // Flicker, Cat Pop, and Cake Bounce
  gsap.to("body", { backgroundColor: "#1a0b2e", duration: 0.1, repeat: 15, yoyo: true });
  gsap.fromTo("#meme-container", { scale: 0, y: 50 }, { scale: 1, y: 0, duration: 1, ease: "back.out(2)" });
  gsap.to("#cake-container", { scale: 1.3, duration: 0.5, repeat: -1, yoyo: true });
}

launchBtn.addEventListener('click', () => {
  startTheParty();
  btnLabel.textContent = 'Vibing…';
  launchBtn.disabled = true;

  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.unmute();
    ytPlayer.playVideo();
  }
});

// Auto-reveal for testing
document.addEventListener('DOMContentLoaded', () => {
  countdownPanel.hidden = true;
  birthdayPanel.removeAttribute('hidden');
  loadYouTubeAPI();
});
