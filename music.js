const audio = document.querySelector(".native-audio");
const playButton = document.querySelector(".play-button");
const progress = document.querySelector(".track-progress");
const timeDisplay = document.querySelector(".time-display");
const playerStatus = document.querySelector(".player-status");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "--:--";

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function updatePlayer() {
  const duration = audio.duration;
  const position = duration ? audio.currentTime / duration : 0;

  progress.value = Math.round(position * 1000);
  progress.style.setProperty("--track-position", `${position * 100}%`);
  timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
  playButton.textContent = audio.paused ? "[ PLAY ]" : "[ PAUSE ]";
  playButton.setAttribute("aria-label", audio.paused ? "Play" : "Pause");
}

async function togglePlayback() {
  if (audio.paused) {
    try {
      await audio.play();
      playerStatus.textContent = "PLAYING";
    } catch {
      playerStatus.textContent = "PLAYBACK ERROR";
    }
  } else {
    audio.pause();
    playerStatus.textContent = "PAUSED";
  }

  updatePlayer();
}

playButton.addEventListener("click", togglePlayback);

progress.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration)) return;
  audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
  updatePlayer();
});

audio.addEventListener("loadedmetadata", updatePlayer);
audio.addEventListener("timeupdate", updatePlayer);
audio.addEventListener("ended", () => {
  playerStatus.textContent = "COMPLETE";
  updatePlayer();
});
audio.addEventListener("error", () => {
  playerStatus.textContent = "AUDIO FILE NOT FOUND";
});

window.addEventListener("keydown", (event) => {
  if (event.target === progress) return;

  if (event.code === "Space") {
    event.preventDefault();
    togglePlayback();
  }

  if (event.key === "ArrowLeft") {
    audio.currentTime = Math.max(0, audio.currentTime - 5);
  }

  if (event.key === "ArrowRight") {
    audio.currentTime = Math.min(
      Number.isFinite(audio.duration) ? audio.duration : audio.currentTime + 5,
      audio.currentTime + 5,
    );
  }
});

updatePlayer();
