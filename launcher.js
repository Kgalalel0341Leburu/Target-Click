const openGameBtn = document.getElementById("openGameBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const loadSettingsBtn = document.getElementById("loadSettingsBtn");
const resetSettingsBtn = document.getElementById("resetSettingsBtn");
const backBtn = document.getElementById("backBtn");
const playerInput = document.getElementById("playerName");
const difficultySelect = document.getElementById("difficulty");
const lengthSelect = document.getElementById("gameLength");
const previewText = document.getElementById("previewText");
const soundCheckbox = document.getElementById("soundEnabled");
const doublePointsCheckbox = document.getElementById("doublePoints");
const bonusTargetsCheckbox = document.getElementById("bonusTargets");

let settings = {
  player: "Player1",
  difficulty: "medium",
  theme: "classic",
  length: 30,
  soundEnabled: true,
  doublePoints: false,
  bonusTargets: true
};

function getSelectedTheme() {
  const selected = document.querySelector('input[name="theme"]:checked');
  return selected ? selected.value : "classic";
}

function updatePreview() {
  const themeText = getSelectedTheme();
  previewText.textContent = `Player: ${playerInput?.value || settings.player} | Difficulty: ${difficultySelect?.value || settings.difficulty} | Length: ${lengthSelect?.value || settings.length} seconds | Theme: ${themeText}`;
}

function applySettings() {
  settings.player = playerInput?.value.trim() || "Player1";
  settings.difficulty = difficultySelect?.value || "medium";
  settings.theme = getSelectedTheme();
  settings.length = parseInt(lengthSelect?.value || "30", 10);
  settings.soundEnabled = soundCheckbox?.checked === true;
  settings.doublePoints = doublePointsCheckbox?.checked === true;
  settings.bonusTargets = bonusTargetsCheckbox?.checked === true;

  localStorage.setItem("targetClickSettings", JSON.stringify(settings));
  updatePreview();
}

function loadLauncherSettings() {
  const saved = JSON.parse(localStorage.getItem("targetClickSettings"));
  if (saved) {
    settings = {
      ...settings,
      ...saved
    };
    if (playerInput) playerInput.value = settings.player;
    if (difficultySelect) difficultySelect.value = settings.difficulty;
    if (lengthSelect) lengthSelect.value = settings.length;
    if (soundCheckbox) soundCheckbox.checked = settings.soundEnabled;
    if (doublePointsCheckbox) doublePointsCheckbox.checked = settings.doublePoints;
    if (bonusTargetsCheckbox) bonusTargetsCheckbox.checked = settings.bonusTargets;
    const themeInput = document.querySelector(`input[name="theme"][value="${settings.theme}"]`);
    if (themeInput) themeInput.checked = true;
    updatePreview();
  }
}

function resetSettings() {
  settings = {
    player: "Player1",
    difficulty: "medium",
    theme: "classic",
    length: 30,
    soundEnabled: true,
    doublePoints: false,
    bonusTargets: true
  };
  if (playerInput) playerInput.value = settings.player;
  if (difficultySelect) difficultySelect.value = settings.difficulty;
  if (lengthSelect) lengthSelect.value = settings.length;
  if (soundCheckbox) soundCheckbox.checked = settings.soundEnabled;
  if (doublePointsCheckbox) doublePointsCheckbox.checked = settings.doublePoints;
  if (bonusTargetsCheckbox) bonusTargetsCheckbox.checked = settings.bonusTargets;
  const themeInput = document.querySelector(`input[name="theme"][value="${settings.theme}"]`);
  if (themeInput) themeInput.checked = true;
  applySettings();
}

function goToGame() {
  applySettings();
  window.location.href = "game.html";
}

function goBackToSettings() {
  window.location.href = "index.html";
}

openGameBtn?.addEventListener("click", goToGame);
saveSettingsBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  applySettings();
});
loadSettingsBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  loadLauncherSettings();
});
resetSettingsBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  resetSettings();
});

[ playerInput, difficultySelect, lengthSelect, soundCheckbox, doublePointsCheckbox, bonusTargetsCheckbox ].forEach((input) => {
  input?.addEventListener("change", updatePreview);
});

(function initLauncher() {
  loadLauncherSettings();
  updatePreview();
})();
