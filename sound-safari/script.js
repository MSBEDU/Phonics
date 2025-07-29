// === GLOBAL DATA ===
let draggedTrickyWordElement = null;

const letterSets = {
  'Set 1': ['s', 'a', 't', 'p'],
  'Set 2': ['i', 'n', 'm', 'd'],
  'Set 3': ['g', 'o', 'c', 'k'],
  'Set 4': ['ck', 'e', 'u', 'r'],
  'Set 5': ['h', 'b', 'f', 'ff', 'l', 'll', 'ss']
};
const allPhase2Letters = Object.values(letterSets).flat();
const masterBuildLettersPool = [...letterSets['Set 1'], ...letterSets['Set 2']];

const satpinWordsList = [
  { word: 'sat', emoji: '🪑', image: 'https://placehold.co/250x250/FFDAB9/000000?text=SAT' },
  { word: 'pin', emoji: '📌', image: 'https://placehold.co/250x250/ADD8E6/000000?text=PIN' },
  { word: 'pat', emoji: '👏', image: 'https://placehold.co/250x250/98FB98/000000?text=PAT' },
  { word: 'tap', emoji: '🚰', image: 'https://placehold.co/250x250/FFD700/000000?text=TAP' },
  { word: 'nap', emoji: '😴', image: 'https://placehold.co/250x250/DDA0DD/000000?text=NAP' },
  { word: 'sip', emoji: '🥤', image: 'https://placehold.co/250x250/87CEFA/000000?text=SIP' },
  { word: 'tip', emoji: '💡', image: 'https://placehold.co/250x250/F08080/000000?text=TIP' },
  { word: 'tan', emoji: '🌞', image: 'https://placehold.co/250x250/F4A460/000000?text=TAN' },
  { word: 'pit', emoji: '🕳️', image: 'https://placehold.co/250x250/B0E0E6/000000?text=PIT' },
  { word: 'pan', emoji: '🍳', image: 'https://placehold.co/250x250/FFB6C1/000000?text=PAN' }
];

const trickyWordsData = {
  tricky: ['the', 'to', 'no', 'go', 'I', 'into', 'he', 'she', 'we', 'me', 'be', 'was', 'my', 'you', 'they', 'her', 'all', 'are', 'your', 'said'],
  notTricky: ['cat', 'dog', 'sun', 'cup', 'bed', 'fan', 'hat', 'pig', 'box', 'fox']
};

// === STATE ===
let elements = {};
let gameState = {
  score: 0, stars: 0,
  mode: '',
  currentLetters: [],
  currentWords: [],
  correctWord: '',
  correctEmoji: '',
  blended: '',
  pictureWordMatchWords: [],
  currentPictureWord: null,
  trickySortWords: [],
  currentTracingLetter: '',
  lettersToTrace: [],
  userBuiltWord: [],
  targetBuildWord: ''
};

// === UTILITIES ===
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function updateScore() { elements.scoreDisplay.textContent = `Score: ${gameState.score}`; }
function updateStars() { elements.starsDisplay.innerHTML = Array(gameState.stars).fill('⭐').join(''); }
function clearBoard() {
  elements.blendBox.innerHTML = ''; elements.blendText.textContent = ''; elements.wordChoices.innerHTML = '';
  elements.feedback.textContent = ''; elements.pictureWordChoices.innerHTML = ''; elements.trickyWordPool.innerHTML = '';
  elements.trickyZone.querySelector('.words-container').innerHTML = ''; elements.notTrickyZone.querySelector('.words-container').innerHTML = '';
}
function endGame(message) {
  elements.gameArea.classList.add('hidden');
  elements.flashcardContainer.classList.add('hidden');
  elements.gameComplete.classList.remove('hidden');
  elements.finalMessage.textContent = message;
}
function goHome() {
  elements.menu.classList.remove('hidden');
  elements.gameArea.classList.add('hidden');
  elements.flashcardPackSelection.classList.add('hidden');
  elements.flashcardContainer.classList.add('hidden');
  elements.gameComplete.classList.add('hidden');
  elements.homeBtn.classList.add('hidden');
}

// === FLASHCARDS ===
function startFlashcards(setName) {
  elements.flashcardPackSelection.classList.add("hidden");
  elements.flashcardContainer.classList.remove("hidden");
  gameState.currentLetters = [...letterSets[setName]];
  loadNextFlashcard();
}
function loadNextFlashcard() {
  if (gameState.currentLetters.length === 0) {
    endGame("All letters mastered!");
    return;
  }
  const letter = gameState.currentLetters.pop();
  document.getElementById("flashcardLetter").textContent = letter;
  document.getElementById("flashcardPhonemeDescription").textContent = `This is the letter "${letter}".`;
}

// Flashcard actions
document.addEventListener("click", (e) => {
  if (e.target.id === "gotItBtn") loadNextFlashcard();
  if (e.target.id === "needPracticeBtn") {
    const currentLetter = document.getElementById("flashcardLetter").textContent;
    gameState.currentLetters.unshift(currentLetter);
    loadNextFlashcard();
  }
});

// === BLEND WORDS ===
function setupBlendMode() {
  clearBoard();
  elements.prompt.innerHTML = 'Blend the sounds and click the correct word.<br>Collect 10 ⭐ to complete this activity!';
  elements.resetBtn.classList.remove('hidden'); elements.wordChoices.classList.remove('hidden'); elements.blendText.classList.remove('hidden');
  elements.blendBox.classList.add('horizontal'); updateScore(); updateStars();
  if (gameState.currentWords.length === 0) { endGame("You've blended all the SATPIN words!"); return; }
  const wordIndex = Math.floor(Math.random() * gameState.currentWords.length);
  const chosenWordObject = gameState.currentWords.splice(wordIndex, 1)[0];
  gameState.correctWord = chosenWordObject.word; gameState.correctEmoji = chosenWordObject.emoji;
  elements.blendBox.innerHTML = ''; gameState.blended = ''; elements.blendText.textContent = gameState.blended.split('').join(' ');
  chosenWordObject.word.split('').forEach(l => {
    const letterButton = document.createElement('button'); letterButton.className = 'letter'; letterButton.textContent = l;
    letterButton.addEventListener('click', () => { gameState.blended += l; elements.blendText.textContent = gameState.blended.split('').join(' '); letterButton.disabled = true; });
    elements.blendBox.appendChild(letterButton);
  });
  const distractors = shuffleArray(satpinWordsList.filter(w => w.word !== gameState.correctWord)).slice(0, 2);
  const options = shuffleArray([chosenWordObject, ...distractors]);
  elements.wordChoices.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button'); btn.className = 'word-choice'; btn.innerHTML = `${opt.word} <span class="emoji">${opt.emoji}</span>`;
    btn.addEventListener('click', () => handleBlendChoice(opt.word)); elements.wordChoices.appendChild(btn);
  });
}
function handleBlendChoice(selection) {
  if (selection === gameState.correctWord) {
    gameState.score++; gameState.stars++; updateScore(); updateStars();
    if (gameState.stars >= 10) { endGame("You earned 10 stars!"); return; }
    setTimeout(setupBlendMode, 800);
  } else { elements.feedback.textContent = '❌ Try again!'; }
}

// === GAME STARTER ===
function startGame(mode) {
  gameState.mode = mode; gameState.score = 0; gameState.stars = 0;
  elements.menu.classList.add('hidden'); elements.gameArea.classList.remove('hidden'); elements.homeBtn.classList.remove('hidden');
  if (mode === 'words') { gameState.currentWords = [...satpinWordsList]; setupBlendMode(); }
  // Other modes (build, picture match, tricky, tracing) here...
}

// === DOM READY ===
document.addEventListener('DOMContentLoaded', () => {
  elements = {
    menu: document.getElementById('menu'), gameArea: document.getElementById('gameArea'), homeBtn: document.getElementById('homeBtn'),
    flashcardPackSelection: document.getElementById('flashcardPackSelection'),
    flashcardContainer: document.getElementById('flashcardContainer'),
    scoreDisplay: document.getElementById('score'), starsDisplay: document.getElementById('stars'), prompt: document.getElementById('prompt'),
    blendBox: document.getElementById('blendBox'), blendText: document.getElementById('blendText'), wordChoices: document.getElementById('wordChoices'),
    resetBtn: document.getElementById('resetBtn'), feedback: document.getElementById('feedback'), gameComplete: document.getElementById('gameComplete'),
    finalMessage: document.getElementById('finalMessage'), playAgainBtn: document.getElementById('playAgainBtn'),
    packButtons: document.getElementById('packButtons')
  };

  // MENU BUTTONS
  document.getElementById("learnLettersBtn").addEventListener("click", () => {
    elements.menu.classList.add("hidden");
    elements.flashcardPackSelection.classList.remove("hidden");
    elements.homeBtn.classList.remove("hidden");
    elements.packButtons.innerHTML = "";
    Object.keys(letterSets).forEach(set => {
      const btn = document.createElement("button");
      btn.textContent = set;
      btn.className = "menu-button";
      btn.addEventListener("click", () => startFlashcards(set));
      elements.packButtons.appendChild(btn);
    });
  });

  document.getElementById('blendWordsBtn').addEventListener('click', () => startGame('words'));
  elements.homeBtn.addEventListener('click', goHome);
  elements.playAgainBtn.addEventListener('click', goHome);

  goHome();
});
