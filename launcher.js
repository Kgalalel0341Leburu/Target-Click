window.onload = function() {
  console.log("Target Click Launcher has loaded");
};

/***************** Default Settings ********************/
let Settings = { 
  PlayerName: "guest", 
  difficulty: "medium", 
  gamelength: 30, 
  theme: "Classic", 
  soundenabled: true, 
  doublepoints: false, 
  bonustargets: true
};

// Load saved settings  available
const saved = JSON.parse(sessionStorage.getItem("settings"));
if (saved) Settings = saved;

/***************** DOM Elements ********************/
const playerinput = document.getElementById("playerName");
const selectdifficulty = document.getElementById("difficulty");
const selectlength = document.getElementById("gameLength");
const soundCheck = document.getElementById("soundEnabled");
const doublePointsCheck = document.getElementById("doublePoints");
const bonusTargetsCheck = document.getElementById("bonusTargets");
const previewText = document.getElementById("previewText");

const openGameBtn = document.getElementById("openGameBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const loadSettingsBtn = document.getElementById("loadSettingsBtn");
const resetSettingsBtn = document.getElementById("resetSettingsBtn");

/***************** Helpers ********************/
function getSelectedTheme() {
  const selected = document.querySelector("input[name='theme']:checked");
  return selected ? selected.value : Settings.theme;
}

/***************** Preview ********************/
function updatePreview() {
  previewText.textContent = `
    playerName: ${playerinput.value || Settings.PlayerName}, 
    difficulty: ${selectdifficulty.value || Settings.difficulty}, 
    gamelength: ${selectlength.value || Settings.gamelength}, 
    theme: ${getSelectedTheme()}, 
    soundenabled: ${soundCheck.checked || Settings.soundenabled}, 
    doublepoints: ${doublePointsCheck.checked || Settings.doublepoints}, 
    bonustargets: ${bonusTargetsCheck.checked || Settings.bonustargets}
  `;
}

/***************** Save/Load/Reset ********************/
function updateSaveSettings() {
  const settings = {
    PlayerName: playerinput.value || Settings.PlayerName,
    difficulty: selectdifficulty.value || Settings.difficulty,
    gamelength: parseInt(selectlength.value) || Settings.gamelength,
    theme: getSelectedTheme(),
    soundenabled: soundCheck.checked || Settings.soundenabled,
    doublepoints: doublePointsCheck.checked || Settings.doublepoints,
    bonustargets: bonusTargetsCheck.checked || Settings.bonustargets
  };
  sessionStorage.setItem("settings", JSON.stringify(settings));
  alert("Settings have been saved!");
}

function updateLoadSettings() {
  const settings = JSON.parse(sessionStorage.getItem("settings"));
  if (settings) {
    playerinput.value = settings.PlayerName;
    selectdifficulty.value = settings.difficulty;
    selectlength.value = settings.gamelength;
    soundCheck.checked = settings.soundenabled;
    doublePointsCheck.checked = settings.doublepoints;
    bonusTargetsCheck.checked = settings.bonustargets;
    document.querySelector(`input[name='theme'][value='${settings.theme.toLowerCase()}']`).checked = true;
    updatePreview();
    alert("Settings loaded!");
  } else {
    alert("No saved settings found.");
  }
}

function updateResetSettings() {
  playerinput.value = "";
  selectdifficulty.value = "medium";
  selectlength.value = 30;
  soundCheck.checked = true;
  doublePointsCheck.checked = false;
  bonusTargetsCheck.checked = true;
  document.querySelector("input[name='theme'][value='classic']").checked = true;
  updatePreview();
  alert("Settings reset to defaults.");
}

/***************** Open Game ********************/
function openGameWindow() {
  updateSaveSettings(); // save before opening
  window.location.href = "game.html";
}

/***************** Event Listeners ********************/
[playerinput, selectdifficulty, selectlength, soundCheck, doublePointsCheck, bonusTargetsCheck]
  .forEach(el => el.addEventListener("change", updatePreview));
document.querySelectorAll("input[name='theme']").forEach(el => el.addEventListener("change", updatePreview));

openGameBtn.addEventListener("click", openGameWindow);
saveSettingsBtn.addEventListener("click", updateSaveSettings);
loadSettingsBtn.addEventListener("click", updateLoadSettings);
resetSettingsBtn.addEventListener("click", updateResetSettings);

// Initialise preview
updatePreview();

