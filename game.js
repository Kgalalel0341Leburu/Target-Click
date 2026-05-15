let targetTimeout = null;
let countdownInterval = null;
let isRunning = false;
let isPaused = false;

let player = "Player1";
let score = 0;
let hits = 0;
let misses = 0;
let timeLeft = 30; // default game length in seconds
let difficulty = "Normal";
let theme = "classic";
let soundEnabled = false;
let doublePoints = false;
let bonusTargets = false;

const displayPlayer = document.getElementById("displayPlayer");
const displayScore = document.getElementById("displayScore");
const displayHits = document.getElementById("displayHits");
const displayMisses = document.getElementById("displayMisses");
const displayTimeLeft = document.getElementById("displayTimeLeft");
const displayDifficulty = document.getElementById("displayDifficulty");
const displayGameLength = document.getElementById("displayGameLength");
const displayTheme = document.getElementById("displayTheme");
const displayBestScore = document.getElementById("displayBestScore");

const messageArea = document.getElementById("messageArea");
const targetArea = document.getElementById("targetArea");
const logArea = document.getElementById("logArea");

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("resetBtn").addEventListener("click", resetGame);
document.getElementById("saveBtn").addEventListener("click", saveSession);
document.getElementById("loadBtn").addEventListener("click", loadSession);
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem("targetClickSettings"));
  if (saved) {
    player = saved.player || "Player1";
    difficulty = saved.difficulty || "Normal";
    if (saved.difficulty) {
      const diffMap = { easy: "Easy", medium: "Normal", hard: "Hard" };
      difficulty = diffMap[saved.difficulty.toLowerCase()] || saved.difficulty || "Normal";
    }
    timeLeft = saved.length || 30;
    theme = saved.theme || "classic";
    soundEnabled = saved.soundEnabled === true;
    doublePoints = saved.doublePoints === true;
    bonusTargets = saved.bonusTargets === true;
    displayPlayer.textContent = player;
    displayDifficulty.textContent = difficulty;
    displayTheme.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    displayGameLength.textContent = `${timeLeft} seconds`;
  } else {
    displayPlayer.textContent = player;
    displayDifficulty.textContent = difficulty;
    displayTheme.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    displayGameLength.textContent = `${timeLeft} seconds`;
  }
}

function startGame() {
  if (isRunning) return;
  loadSettings();
  resetStats(false);
  isRunning = true;
  isPaused = false;
  messageArea.textContent = "Game started! Click the targets!";
  spawnTarget();
  countdownInterval = setInterval(updateTime, 1000);
}

function togglePause() {
  if (!isRunning) return;
  isPaused = !isPaused;
  messageArea.textContent = isPaused ? "Game paused." : "Game resumed!";
}

function resetGame() {
  clearTimeout(targetTimeout);
  clearInterval(countdownInterval);
  targetArea.innerHTML = "";
  isRunning = false;
  isPaused = false;
  resetStats();
  messageArea.textContent = "Game reset. Click Start Game when ready.";
}

function resetStats(resetConfig = true) {
  score = 0;
  hits = 0;
  misses = 0;
  if (resetConfig) {
    timeLeft = 30;
    difficulty = "Normal";
  }
  updateStats();
}

function updateStats() {
  displayPlayer.textContent = player;
  displayScore.textContent = score;
  displayHits.textContent = hits;
  displayMisses.textContent = misses;
  displayTimeLeft.textContent = `${timeLeft} s`;
  displayDifficulty.textContent = difficulty;
}

function updateTime() {
  if (isPaused) return;
  timeLeft--;
  updateStats();
  if (timeLeft <= 0) {
    endGame();
  }
}

function playSound(frequency = 440, duration = 0.1) {
  if (!soundEnabled || typeof window.AudioContext === "undefined") return;
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.1, context.currentTime);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
    oscillator.onended = () => context.close();
  } catch (error) {
    console.warn("Sound playback failed", error);
  }
}

function spawnTarget() {
  if (!isRunning) return;
  targetArea.innerHTML = "";
  const target = document.createElement("div");
  target.classList.add("target", theme);

  const isBonus = bonusTargets && Math.random() < 0.18;
  if (isBonus) {
    target.classList.add("bonus");
    target.textContent = "★";
  }

  if (difficulty === "Easy") target.style.width = target.style.height = "60px";
  else if (difficulty === "Normal") target.style.width = target.style.height = "40px";
  else if (difficulty === "Hard") target.style.width = target.style.height = "25px";

  target.style.top = `${Math.random() * 80}%`;
  target.style.left = `${Math.random() * 80}%`;

  target.addEventListener("click", () => {
    if (isPaused) return;
    hits++;
    let hitValue = doublePoints ? 20 : 10;
    score += isBonus ? hitValue * 2 : hitValue;
    log(isBonus ? "Bonus hit!" : "Hit!");
    if (soundEnabled) playSound(880, 0.12);
    updateStats();
    spawnTarget();
  });

  targetArea.appendChild(target);

  let missDelay = difficulty === "Easy" ? 2000 : difficulty === "Normal" ? 1500 : 1000;

  targetTimeout = setTimeout(() => {
    if (!isPaused && isRunning) {
      misses++;
      score -= 5;
      log("Miss!");
      if (soundEnabled) playSound(220, 0.08);
      updateStats();
      spawnTarget();
    }
  }, missDelay);
}

function endGame() {
  clearInterval(countdownInterval);
  clearTimeout(targetTimeout);
  isRunning = false;
  messageArea.textContent = "Game over!";
  log(`Final Score: ${score}`);
  saveBestScore();
}

function log(msg) {
  const entry = document.createElement("div");
  entry.textContent = msg;
  logArea.appendChild(entry);
}

function saveSession() {
  const session = { player, score, hits, misses, timeLeft, difficulty };
  localStorage.setItem("targetClickSession", JSON.stringify(session));
  log("Session saved.");
}

function loadSession() {
  const session = JSON.parse(localStorage.getItem("targetClickSession"));
  if (session) {
    player = session.player;
    score = session.score;
    hits = session.hits;
    misses = session.misses;
    timeLeft = session.timeLeft;
    difficulty = session.difficulty;
    updateStats();
    log("Session loaded.");
  } else {
    log("No saved session found.");
  }
}

function saveBestScore() {
  const best = parseInt(localStorage.getItem("bestScore") || "0", 10);
  if (score > best) {
    localStorage.setItem("bestScore", score);
    displayBestScore.textContent = score;
    log("New best score!");
  } else {
    displayBestScore.textContent = best;
  }
}

loadSettings();
updateStats();
displayBestScore.textContent = localStorage.getItem("bestScore") || "0";
