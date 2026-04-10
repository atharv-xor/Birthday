// 🎯 PUT YOUR VIDEO ID HERE
const YT_VIDEO_ID  = 'fydbhIZJwNs';  // change this
const YT_START_SEC = 0;

/* DOM */
const launchBtn = document.getElementById('launch-btn');
const btnLabel  = document.getElementById('btn-label');

/* STATE */
let ytPlayer = null;
let isPlaying = false;

/* LOAD YOUTUBE API */
function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) {
    initYTPlayer();
    return;
  }

  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

/* YT READY */
window.onYouTubeIframeAPIReady = function () {
  initYTPlayer();
};

/* INIT PLAYER */
function initYTPlayer() {
  if (ytPlayer) return;

  ytPlayer = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: YT_VIDEO_ID,
    playerVars: {
      start: YT_START_SEC,
      autoplay: 0,
      controls: 0,
      playsinline: 1,
      mute: 1   // 🔥 required for autoplay policy
    },
    events: {
      onReady: (event) => {
        event.target.mute(); // start muted
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED) {
          setIdle();
        }
      }
    }
  });
}

/* BUTTON CLICK */
launchBtn.addEventListener('click', () => {
  if (!ytPlayer) return;

  ytPlayer.unMute();                 // enable sound
  ytPlayer.seekTo(YT_START_SEC, true);
  ytPlayer.playVideo();

  isPlaying = true;
  setPlaying();
});

/* UI STATES */
function setPlaying() {
  launchBtn.disabled = true;
  btnLabel.textContent = "Playing...";
}

function setIdle() {
  isPlaying = false;
  launchBtn.disabled = false;
  btnLabel.textContent = "Launch Birthday Vibe";
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  loadYouTubeAPI(); // load immediately
});
