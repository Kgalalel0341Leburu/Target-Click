/**************** Initialise Game ************
 */
// Load settings from launcher
let gameSettings = JSON.parse(sessionStorage.getItem("settings")) || {
  PlayerName: "guest",
  difficulty: "medium",
  gamelength: 30,
  theme: "Classic",
  soundenabled: true,
  doublepoints: false,
  bonustargets: true
};

// DOM references
const messageArea = document.getElementById("messageArea");
const logArea = document.getElementById("logArea");
const targetArea = document.getElementById("targetArea");

const displayPlayer = document.getElementById("displayPlayer");
const displayScore = document.getElementById("displayScore");
const displayHits = document.getElementById("displayHits");
const displayMisses = document.getElementById("displayMisses");
const displayTimeLeft = document.getElementById("displayTimeLeft");
const displayDifficulty = document.getElementById("displayDifficulty");
const displayGameLength = document.getElementById("displayGameLength");
const displayTheme = document.getElementById("displayTheme");
const displayBestScore = document.getElementById("displayBestScore");

// Buttons
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("saveBtn").addEventListener("click", saveSession);
document.getElementById("loadBtn").addEventListener("click", loadSession);
document.getElementById("resetBtn").addEventListener("click", resetGame);
document.getElementById("backBtn").addEventListener("click", () => window.location.href = "index.html");

// Game state
let score = 0;
let hits = 0;
let misses = 0;
let timeLeft = gameSettings.gamelength;
let timer;
let paused = false;

// Initialise display
displayPlayer.textContent = gameSettings.PlayerName;
displayDifficulty.textContent = gameSettings.difficulty;
displayGameLength.textContent = gameSettings.gamelength + " s";
displayTheme.textContent = gameSettings.theme;

function getTargetSize() {
  if (gameSettings.difficulty === "easy") return 60;
  if (gameSettings.difficulty === "medium") return 40;
  return 25;
}

function startGame() {
  score = 0;
  hits = 0;
  misses = 0;
  timeLeft = gameSettings.gamelength;
  updateStats();
  messageArea.textContent = "Game started!";
  spawnTarget();
  clearInterval(timer);
  timer = setInterval(countdown, 1000);
}

function spawnTarget() {
  targetArea.innerHTML = "";
  const target = document.createElement("div");
  target.className = "target";
  target.style.width = getTargetSize() + "px";
  target.style.height = getTargetSize() + "px";
  target.style.top = Math.random() * (300) + "px";
  target.style.left = Math.random() * (300) + "px";
  target.addEventListener("click", hitTarget);
  targetArea.appendChild(target);

  // Bonus target
  if (gameSettings.bonustargets && Math.random() < 0.2) {
    const bonus = document.createElement("div");
    bonus.className = "target";
    bonus.style.background = "gold";
    bonus.style.width = "30px";
    bonus.style.height = "30px";
    bonus.style.top = Math.random() * 300 + "px";
    bonus.style.left = Math.random() * 300 + "px";
    bonus.addEventListener("click", () => {
      score += 5;
      updateStats();
      bonus.remove();
    });
    targetArea.appendChild(bonus);
  }
}

function hitTarget() {
  hits++;
  score += gameSettings.doublepoints ? 2 : 1;
  updateStats();
  if (gameSettings.soundenabled) new Audio("hit.mp3").play();
  spawnTarget();
}

function countdown() {
  if (paused) return;
  timeLeft--;
  displayTimeLeft.textContent = timeLeft + " s";
  if (timeLeft <= 0) endGame();
}

function togglePause() {
  paused = !paused;
  messageArea.textContent = paused ? "Game paused." : "Game resumed.";
}

function resetGame() {
  clearInterval(timer);
  score = 0;
  hits = 0;
  misses = 0;
  timeLeft = gameSettings.gamelength;
  updateStats();
  targetArea.innerHTML = "";
  messageArea.textContent = "Game reset. Click Start Game when ready.";
}

function endGame() {
  clearInterval(timer);
  targetArea.innerHTML = "";
  messageArea.textContent = "Game Over! " + gameSettings.PlayerName + ", your score is " + score;
}

function updateStats() {
  displayScore.textContent = score;
  displayHits.textContent = hits;
  displayMisses.textContent = misses;
  displayTimeLeft.textContent = timeLeft + " s";
}

function saveSession() {
  localStorage.setItem("score", score);
  localStorage.setItem("hits", hits);
  localStorage.setItem("misses", misses);
  localStorage.setItem("timeLeft", timeLeft);
  alert("Session saved.");
}

function loadSession() {
  score = parseInt(localStorage.getItem("score")) || 0;
  hits = parseInt(localStorage.getItem("hits")) || 0;
  misses = parseInt(localStorage.getItem("misses")) || 0;
  timeLeft = parseInt(localStorage.getItem("timeLeft")) || gameSettings.gamelength;
  updateStats();
  alert("Session loaded.");
}



 /* document.getElementById("Load Session").addEventListener("click", () => 
    {
  const saved = localStorage.getItem("targetArea");
  if (saved) {
    preview_box = JSON.parse(saved);
    alert("Game loaded! Current score: " + targetArea.score);
  } else {
    alert("Found no saved game."); /** No record found of saved game  but previous score is tracked. ***/
  /*};
  
  /*document.getElementById("Save Session").addEventListener("click", () => 
    {targetArea
  localStorage.setItem("targetArea", JSON.stringify(previewText));
  alert("Save Game!"); /** Each game is saved everytime a user plays ***/
/*}); */

