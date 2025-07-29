// === GLOBAL VARIABLES & DATA ===
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
  { word: 'sat', emoji: '🪑', image: 'https://via.placeholder.com/250x250/FFDAB9/000000?text=SAT' },
  { word: 'pin', emoji: '📌', image: 'https://via.placeholder.com/250x250/ADD8E6/000000?text=PIN' },
  { word: 'pat', emoji: '👏', image: 'https://via.placeholder.com/250x250/98FB98/000000?text=PAT' },
  { word: 'tap', emoji: '🚰', image: 'https://via.placeholder.com/250x250/FFD700/000000?text=TAP' },
  { word: 'nap', emoji: '😴', image: 'https://via.placeholder.com/250x250/DDA0DD/000000?text=NAP' },
  { word: 'sip', emoji: '🥤', image: 'https://via.placeholder.com/250x250/87CEFA/000000?text=SIP' },
  { word: 'tip', emoji: '💡', image: 'https://via.placeholder.com/250x250/F08080/000000?text=TIP' },
  { word: 'tan', emoji: '🌞', image: 'https://via.placeholder.com/250x250/F4A460/000000?text=TAN' },
  { word: 'pit', emoji: '🕳️', image: 'https://via.placeholder.com/250x250/B0E0E6/000000?text=PIT' },
  { word: 'pan', emoji: '🍳', image: 'https://via.placeholder.com/250x250/FFB6C1/000000?text=PAN' }
];

const trickyWordsData = {
  tricky: ['the', 'to', 'no', 'go', 'I', 'into', 'he', 'she', 'we', 'me', 'be', 'was', 'my', 'you', 'they', 'her', 'all', 'are', 'your', 'said'],
  notTricky: ['cat', 'dog', 'sun', 'cup', 'bed', 'fan', 'hat', 'pig', 'box', 'fox']
};

let elements = {};
let gameState = {
  score: 0, stars: 0,
  blended: '',
  correctWord: '', correctEmoji: '',
  currentWords: [],
  mode: '',
  // flashcards
  flashcardMasterList: [], currentFlashcardIndex: 0,
  currentFlashcardLetters: [], currentFlashcardSetName: '', flashcardsCompletedCount: 0, packSelectionType: '',
  // picture-word
  pictureWordMatchWords: [], currentPictureWord: null,
  // tricky sort
  trickySortWords: [],
  // tracing
  currentTracingLetter: '', isDrawing: false, lastX: 0, lastY: 0, hasDrawnOnCanvas: false, canvasCtx: null, lettersToTrace: [],
  // build
  userBuiltWord: [], usedLetterButtons: [], availableBuildWords: [], targetBuildWord: ''
};

// === UTILITIES ===
function shuffleArray(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function updateScore() { elements.scoreDisplay.textContent = `Score: ${gameState.score}`; }
function updateStars() { elements.starsDisplay.innerHTML = Array(gameState.stars).fill('⭐').map(s => `<span class="star">${s}</span>`).join(''); }
function clearBoard() {
  elements.blendBox.innerHTML = ''; elements.blendText.textContent = ''; elements.wordChoices.innerHTML = '';
  elements.feedback.textContent = ''; elements.pictureWordChoices.innerHTML = ''; elements.trickyWordPool.innerHTML = '';
  elements.trickyZone.querySelector('.words-container').innerHTML = ''; elements.notTrickyZone.querySelector('.words-container').innerHTML = '';
}
function endGame(message) {
  elements.gameArea.classList.add('hidden'); elements.gameComplete.classList.remove('hidden');
  elements.finalMessage.textContent = message; elements.playAgainBtn.onclick = goHome;
}
function goHome() {
  elements.menu.classList.remove('hidden'); elements.gameArea.classList.add('hidden'); elements.gameComplete.classList.add('hidden');
  elements.homeBtn.classList.add('hidden');
}

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
  const distractors = satpinWordsList.filter(w => w.word !== gameState.correctWord); const shuffledDistractors = shuffleArray(distractors).slice(0, 2);
  const options = shuffleArray([chosenWordObject, ...shuffledDistractors]);
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

// === BUILD A WORD ===
function setupBuildMode() {
  clearBoard();
  elements.prompt.innerHTML = 'Use the letters to build a SATPIN word!'; updateScore(); updateStars();
  gameState.userBuiltWord = []; gameState.usedLetterButtons = [];
  gameState.availableBuildWords = shuffleArray([...satpinWordsList]); const wordObj = gameState.availableBuildWords.pop();
  gameState.targetBuildWord = wordObj.word; gameState.correctEmoji = wordObj.emoji;
  elements.buildWordDisplay.textContent = ''; renderLetterPool();
}
function renderLetterPool() {
  elements.letterPool.innerHTML = ''; masterBuildLettersPool.forEach(letter => {
    const letterBtn = document.createElement('button'); letterBtn.className = 'letter'; letterBtn.textContent = letter;
    letterBtn.addEventListener('click', () => { gameState.userBuiltWord.push(letter); letterBtn.disabled = true; elements.buildWordDisplay.textContent = gameState.userBuiltWord.join(''); });
    elements.letterPool.appendChild(letterBtn);
  });
}
function checkBuildWord() {
  if (gameState.userBuiltWord.join('') === gameState.targetBuildWord) {
    gameState.score++; gameState.stars++; updateScore(); updateStars();
    if (gameState.stars >= 10) { endGame("You earned 10 stars!"); return; }
    setTimeout(setupBuildMode, 800);
  } else { elements.feedback.textContent = '❌ Not quite!'; }
}

// === PICTURE WORD MATCH ===
function setupPictureWordMatching() {
  clearBoard(); elements.prompt.innerHTML = 'Match the picture with the correct word!'; updateScore(); updateStars();
  gameState.pictureWordMatchWords = shuffleArray([...satpinWordsList]); loadNextPictureWord();
}
function loadNextPictureWord() {
  if (gameState.pictureWordMatchWords.length === 0) { endGame("All matched!"); return; }
  gameState.currentPictureWord = gameState.pictureWordMatchWords.pop();
  elements.pictureWordImage.src = gameState.currentPictureWord.image; elements.pictureWordChoices.innerHTML = '';
  const distractors = shuffleArray(satpinWordsList.filter(w => w.word !== gameState.currentPictureWord.word)).slice(0, 2);
  const options = shuffleArray([gameState.currentPictureWord, ...distractors]);
  options.forEach(opt => { const btn = document.createElement('button'); btn.className = 'word-choice'; btn.textContent = opt.word; btn.addEventListener('click', () => handlePictureWordChoice(opt.word)); elements.pictureWordChoices.appendChild(btn); });
}
function handlePictureWordChoice(word) {
  if (word === gameState.currentPictureWord.word) {
    gameState.score++; gameState.stars++; updateScore(); updateStars();
    if (gameState.stars >= 10) { endGame("You earned 10 stars!"); return; }
    setTimeout(loadNextPictureWord, 800);
  } else { elements.feedback.textContent = '❌ Try again!'; }
}

// === TRICKY WORD SORT ===
function setupTrickyWordSorting() {
  clearBoard(); elements.prompt.innerHTML = 'Drag tricky words to the left box and not-tricky to the right!'; updateScore(); updateStars();
  const tricky = shuffleArray([...trickyWordsData.tricky]).slice(0, 3); const notTricky = shuffleArray([...trickyWordsData.notTricky]).slice(0, 3);
  gameState.trickySortWords = shuffleArray([...tricky.map(w => ({ word: w, type: 'tricky' })), ...notTricky.map(w => ({ word: w, type: 'notTricky' }))]);
  gameState.trickySortWords.forEach(w => {
    const el = document.createElement('div'); el.classList.add('sortable-word'); el.textContent = w.word; el.setAttribute('draggable', true); el.dataset.type = w.type;
    el.addEventListener('dragstart', e => draggedTrickyWordElement = e.target); elements.trickyWordPool.appendChild(el);
  });
}
function handleDrop(e, type) {
  e.preventDefault(); if (!draggedTrickyWordElement) return;
  const newEl = draggedTrickyWordElement.cloneNode(true); newEl.addEventListener('dragstart', ev => draggedTrickyWordElement = ev.target);
  e.target.querySelector('.words-container').appendChild(newEl); draggedTrickyWordElement.remove();
}
function checkTrickyWordSort() {
  const trickyWords = elements.trickyZone.querySelectorAll('.sortable-word'); const notTrickyWords = elements.notTrickyZone.querySelectorAll('.sortable-word');
  let allCorrect = true;
  trickyWords.forEach(w => { if (w.dataset.type !== 'tricky') allCorrect = false; });
  notTrickyWords.forEach(w => { if (w.dataset.type !== 'notTricky') allCorrect = false; });
  if (allCorrect) { gameState.score++; gameState.stars++; updateScore(); updateStars(); if (gameState.stars >= 10) { endGame("You earned 10 stars!"); return; } setTimeout(setupTrickyWordSorting, 800); } else { elements.feedback.textContent = '❌ Try again!'; }
}

// === CANVAS LETTER TRACING ===
function setupCanvasDrawingTracer() {
  clearBoard(); elements.prompt.textContent = 'Trace the letter!'; updateScore(); updateStars();
  gameState.lettersToTrace = shuffleArray(allPhase2Letters.filter(l => l.length === 1)); loadLetterToTrace();
}
function loadLetterToTrace() {
  if (gameState.lettersToTrace.length === 0) { endGame("All letters traced!"); return; }
  gameState.currentTracingLetter = gameState.lettersToTrace.pop(); drawFadedLetter(gameState.currentTracingLetter);
}
function drawFadedLetter(letter) {
  const ctx = elements.letterCanvas.getContext('2d'); ctx.clearRect(0,0,elements.letterCanvas.width,elements.letterCanvas.height);
  ctx.globalAlpha = 0.2; ctx.font = `${elements.letterCanvas.height * 0.8}px Quicksand`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(letter, elements.letterCanvas.width/2, elements.letterCanvas.height/2); ctx.globalAlpha = 1.0;
}

// === GAME FLOW ===
function startGame(mode) {
  gameState.mode = mode; gameState.score = 0; gameState.stars = 0;
  elements.menu.classList.add('hidden'); elements.gameArea.classList.remove('hidden'); elements.homeBtn.classList.remove('hidden');
  if (mode === 'words') { gameState.currentWords = [...satpinWordsList]; setupBlendMode(); }
  else if (mode === 'build') setupBuildMode();
  else if (mode === 'pictureWordMatch') setupPictureWordMatching();
  else if (mode === 'trickyWordSort') setupTrickyWordSorting();
  else if (mode === 'canvasDrawingTracer') setupCanvasDrawingTracer();
}

// === DOM READY ===
document.addEventListener('DOMContentLoaded', () => {
  elements = {
    menu: document.getElementById('menu'), gameArea: document.getElementById('gameArea'), homeBtn: document.getElementById('homeBtn'),
    blendWordsBtn: document.getElementById('blendWordsBtn'), buildWordBtn: document.getElementById('buildWordBtn'), trickyWordsBtn: document.getElementById('trickyWordsBtn'),
    pictureWordMatchBtn: document.getElementById('pictureWordMatchBtn'), trickyWordSortBtn: document.getElementById('trickyWordSortBtn'), canvasDrawingTracerBtn: document.getElementById('canvasDrawingTracerBtn'),
    scoreDisplay: document.getElementById('score'), starsDisplay: document.getElementById('stars'), prompt: document.getElementById('prompt'),
    blendBox: document.getElementById('blendBox'), blendText: document.getElementById('blendText'), wordChoices: document.getElementById('wordChoices'),
    resetBtn: document.getElementById('resetBtn'), feedback: document.getElementById('feedback'), gameComplete: document.getElementById('gameComplete'),
    finalMessage: document.getElementById('finalMessage'), playAgainBtn: document.getElementById('playAgainBtn'), buildWordDisplay: document.getElementById('buildWordDisplay'),
    letterPool: document.getElementById('letterPool'), pictureWordImage: document.getElementById('pictureWordImage'), pictureWordChoices: document.getElementById('pictureWordChoices'),
    trickyWordPool: document.getElementById('trickyWordPool'), trickyZone: document.getElementById('trickyZone'), notTrickyZone: document.getElementById('notTrickyZone'), letterCanvas: document.getElementById('letterCanvas')
  };
  elements.blendWordsBtn.addEventListener('click', () => startGame('words'));
  elements.buildWordBtn.addEventListener('click', () => startGame('build'));
  elements.pictureWordMatchBtn.addEventListener('click', () => startGame('pictureWordMatch'));
  elements.trickyWordSortBtn.addEventListener('click', () => startGame('trickyWordSort'));
  elements.canvasDrawingTracerBtn.addEventListener('click', () => startGame('canvasDrawingTracer'));
  elements.homeBtn.addEventListener('click', goHome);
  elements.trickyZone.addEventListener('dragover', e => e.preventDefault()); elements.trickyZone.addEventListener('drop', e => handleDrop(e, 'tricky'));
  elements.notTrickyZone.addEventListener('dragover', e => e.preventDefault()); elements.notTrickyZone.addEventListener('drop', e => handleDrop(e, 'notTricky'));
  goHome();
});
