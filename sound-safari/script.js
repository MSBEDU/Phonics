/****************************************************
  SOUND SAFARI - SCRIPT.JS
  Handles game logic for: flashcards, blending, build-a-word,
  picture matching, tricky word sorting, and letter tracing.
****************************************************/

console.log("Script execution started."); // Debugging log

// Global variable to hold the element being dragged in Tricky Word Sort mode
let draggedTrickyWordElement = null;

// --- GLOBAL GAME DATA & STATE ---
const letterSets = {
  'Set 1': ['s', 'a', 't', 'p'],
  'Set 2': ['i', 'n', 'm', 'd'],
  'Set 3': ['g', 'o', 'c', 'k'],
  'Set 4': ['ck', 'e', 'u', 'r'],
  'Set 5': ['h', 'b', 'f', 'ff', 'l', 'll', 'ss']
};
const allPhase2Letters = Object.values(letterSets).flat();
const masterBuildLettersPool = [...letterSets['Set 1'], ...letterSets['Set 2']];

const trickyWordSets = {
  'Set 1 – Foundation Words': {
    words: ['I', 'the', 'to', 'no', 'go'],
    description: 'Short, very frequent words that appear in almost every beginner book.'
  },
  'Set 2 – Early Sentence Builders': {
    words: ['into', 'he', 'she', 'we', 'me'],
    description: 'Helps children build simple subject-verb sentences like “He is big.”'
  },
  'Set 3 – Identity and Action Words': {
    words: ['be', 'was', 'my', 'you', 'they'],
    description: 'Introduces trickier spelling patterns and supports early storytelling.'
  },
  'Set 4 – Describing and Referring Words': {
    words: ['her', 'all', 'are', 'your', 'said'],
    description: 'Introduces trickier spelling patterns and supports early storytelling.'
  }
};

const phonemeDetails = {
  's': { description: 'Snake sound: teeth close, tongue behind.' },
  'a': { description: 'Open mouth, "ah" sound like in apple.' },
  't': { description: 'Tap tongue behind teeth, quick "tuh" sound.' },
  'p': { description: 'Pop lips together, quick "puh" sound.' },
  'i': { description: 'Small smile, "ih" sound like in ink.' },
  'n': { description: 'Tongue tip behind teeth, nose hums.' },
  'm': { description: 'Lips together, mouth closed, hum.' },
  'd': { description: 'Tap tongue behind teeth, quick "duh" sound.' },
  'g': { description: 'Back of tongue up, "guh" sound.' },
  'o': { description: 'Round mouth, short "oh" sound.' },
  'c': { description: 'Back of tongue up, quick "kuh" sound.' },
  'k': { description: 'Back of tongue up, quick "kuh" sound.' },
  'ck': { description: 'Same as "k", two letters one sound.' },
  'e': { description: 'Relaxed mouth, short "eh" sound.' },
  'u': { description: 'Short "uh" sound, like up.' },
  'r': { description: 'Tongue curls back, "rrr" sound.' },
  'h': { description: 'Quiet breath out of mouth.' },
  'b': { description: 'Lips together, puff of air, "buh" sound.' },
  'f': { description: 'Top teeth on lower lip, blow air.' },
  'ff': { description: 'Same as "f", two letters one sound.' },
  'l': { description: 'Tongue tip behind top teeth, "llll" sound.' },
  'll': { description: 'Same as "l", two letters one sound.' },
  'ss': { description: 'Same as "s", two letters one sound.' }
};

const satpinWordsList = [
  { word: 'sat', emoji: '🪑' },
  { word: 'pin', emoji: '📌' },
  { word: 'pat', emoji: '👏' },
  { word: 'tap', emoji: '🚰' },
  { word: 'nap', emoji: '😴' },
  { word: 'sip', emoji: '🥤' },
  { word: 'tip', emoji: '💡' },
  { word: 'tan', emoji: '🌞' },
  { word: 'pit', emoji: '🕳️' },
  { word: 'pan', emoji: '🍳' }
];

const trickyWordsData = {
  tricky: ['the', 'to', 'no', 'go', 'I', 'into', 'he', 'she', 'we', 'me', 'be', 'was', 'my', 'you', 'they', 'her', 'all', 'are', 'your', 'said'],
  notTricky: ['cat', 'dog', 'sun', 'cup', 'bed', 'fan', 'hat', 'pig', 'box', 'fox']
};

let elements = {}; 
let gameState = { 
  score: 0,
  stars: 0,
  blended: '',
  correctWord: '',
  correctEmoji: '',
  currentWords: [], 
  mode: '', 
  currentFlashcardIndex: 0,
  currentFlashcardLetters: [], 
  currentFlashcardSetName: '', 
  flashcardMasterList: [],
  flashcardsCompletedCount: 0,
  packSelectionType: '', 
  currentFlashcardSetDescription: '', 
  targetBuildWord: '',
  userBuiltWord: [], 
  usedLetterButtons: [], 
  availableBuildWords: [], 
  pictureWordMatchWords: [],
  currentPictureWord: null,
  trickySortWords: [],
  currentTracingLetter: '',
  isDrawing: false,
  lastX: 0,
  lastY: 0,
  hasDrawnOnCanvas: false,
  canvasCtx: null,
  lettersToTrace: []
};

/****************************************************
  UTILITY FUNCTIONS
****************************************************/
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function toggleBlendingControls(enable) {
  const letterButtons = elements.blendBox.querySelectorAll('.letter');
  letterButtons.forEach(button => button.disabled = !enable);
  const wordChoiceButtons = elements.wordChoices.querySelectorAll('.word-choice');
  wordChoiceButtons.forEach(button => button.disabled = !enable);
}
function updateScore() {
  if (['words', 'pictureWordMatch', 'trickyWordSort', 'canvasDrawingTracer', 'build'].includes(gameState.mode)) { 
      elements.scoreDisplay.textContent = `Score: ${gameState.score}`;
      elements.scoreDisplay.classList.remove('hidden');
  } else {
      elements.scoreDisplay.classList.add('hidden'); 
  }
}
function updateStars() {
  elements.starsDisplay.innerHTML = Array(gameState.stars).fill('⭐').map(s => `<span class="star">${s}</span>`).join('');
  elements.starsDisplay.classList.remove('hidden');
}

/****************************************************
  NAVIGATION & GAME SETUP
****************************************************/
function clearBoard() {
  elements.feedback.textContent = '';
  elements.blendText.textContent = '';
  elements.blendBox.innerHTML = '';
  elements.wordChoices.innerHTML = '';
  gameState.blended = '';
  gameState.userBuiltWord = [];
  gameState.usedLetterButtons = []; 
  elements.buildWordDisplay.textContent = ''; 
  elements.buildWordDisplay.classList.remove('incorrect-feedback'); 
  elements.letterPool.innerHTML = '';
  elements.feedback.textContent = '';
  elements.buildWordTargetFlashcard.classList.add('hidden'); 
  elements.buildWordTargetFlashcard.classList.remove('fade-in');
  elements.buildWordTargetFlashcard.textContent = '';
  elements.flashcardPhonemeDescription.textContent = ''; 
  elements.pictureWordImage.classList.add('hidden');
  elements.pictureWordImage.src = '';
  elements.pictureWordChoices.innerHTML = '';
  elements.trickyZone.querySelector('.words-container').innerHTML = ''; 
  elements.notTrickyZone.querySelector('.words-container').innerHTML = ''; 
  elements.trickyWordPool.innerHTML = '';
  elements.trickySortFeedback.textContent = '';
  if (gameState.canvasCtx) {
    gameState.canvasCtx.clearRect(0, 0, elements.letterCanvas.width, elements.letterCanvas.height);
  }
  elements.prompt.textContent = '';
}

function goHome() {
  elements.gameArea.classList.add('hidden');
  elements.gameComplete.classList.add('hidden');
  elements.flashcardPackSelection.classList.add('hidden');
  elements.homeBtn.classList.add('hidden');
  elements.menu.classList.remove('hidden');
  clearBoard();
}

function endGame(message) {
  elements.gameArea.classList.add('hidden');
  elements.gameComplete.classList.remove('hidden');
  elements.finalMessage.textContent = message;
  elements.playAgainBtn.onclick = () => goHome();
}

/****************************************************
  GAME MODES
  (Blend Words, Build a Word, Flashcards, Sorting, etc.)
****************************************************/
/* 
  All your existing functions for:
  - setupBlendMode, handleChoice
  - setupBuildMode, selectLetterForBuild, deleteLastLetter, renderLetterPool, clearBuild, checkBuildWord
  - setupPictureWordMatching, loadNextPictureWord, handlePictureWordChoice
  - setupTrickyWordSorting, renderTrickyWordPool, renderSortZones, handleTrickyWordDragStart, handleTrickyWordDragOver, handleTrickyWordDragLeave, handleTrickyWordDrop, checkTrickyWordSort
  - setupCanvasDrawingTracer, resizeCanvas, addCanvasEventListeners, getMousePos, startDrawing, draw, stopDrawing, loadLetterToTrace, drawFadedLetter, clearCanvasDrawing, nextTracingLetter
  would be placed here unchanged from your old script.
*/

/****************************************************
  DOMContentLoaded: INITIALIZE APP
****************************************************/
document.addEventListener('DOMContentLoaded', () => {
  elements = { 
    menu: document.getElementById('menu'),
    gameArea: document.getElementById('gameArea'),
    homeBtn: document.getElementById('homeBtn'),
    learnLettersBtn: document.getElementById('learnLettersBtn'),
    blendWordsBtn: document.getElementById('blendWordsBtn'),
    buildWordBtn: document.getElementById('buildWordBtn'),
    trickyWordsBtn: document.getElementById('trickyWordsBtn'), 
    pictureWordMatchBtn: document.getElementById('pictureWordMatchBtn'),
    trickyWordSortBtn: document.getElementById('trickyWordSortBtn'),
    canvasDrawingTracerBtn: document.getElementById('canvasDrawingTracerBtn'),
    scoreDisplay: document.getElementById('score'),
    starsDisplay: document.getElementById('stars'),
    prompt: document.getElementById('prompt'),
    flashcardPackSelection: document.getElementById('flashcardPackSelection'),
    packSelectionIntroText: document.getElementById('packSelectionIntroText'), 
    packButtons: document.getElementById('packButtons'),
    backToMainMenuBtn: document.getElementById('backToMainMenuBtn'),
    flashcardContainer: document.getElementById('flashcardContainer'),
    flashcardLetter: document.getElementById('flashcardLetter'),
    flashcardPhonemeDescription: document.getElementById('flashcardPhonemeDescription'),
    flashcardActions: document.getElementById('flashcardActions'),
    gotItBtn: document.getElementById('gotItBtn'),
    needPracticeBtn: document.getElementById('needPracticeBtn'),
    flashcardProgress: document.getElementById('flashcardProgress'),
    blendBox: document.getElementById('blendBox'),
    blendText: document.getElementById('blendText'),
    buildWordTargetFlashcard: document.getElementById('buildWordTargetFlashcard'), 
    buildWordDisplay: document.getElementById('buildWordDisplay'),
    letterPool: document.getElementById('letterPool'),
    buildActionsContainer: document.querySelector('.build-actions'), 
    clearBuildBtn: document.getElementById('clearBuildBtn'),
    deleteBuildBtn: document.getElementById('deleteBuildBtn'), 
    checkBuildBtn: document.getElementById('checkBuildBtn'),
    pictureWordMatchingSection: document.getElementById('pictureWordMatchingSection'),
    pictureWordImage: document.getElementById('pictureWordImage'),
    pictureWordChoices: document.getElementById('pictureWordChoices'),
    pictureWordResetBtn: document.getElementById('pictureWordResetBtn'),
    trickyWordSortingSection: document.getElementById('trickyWordSortingSection'),
    trickyZone: document.getElementById('trickyZone'),
    notTrickyZone: document.getElementById('notTrickyZone'),
    trickyWordPool: document.getElementById('trickyWordPool'),
    trickySortFeedback: document.getElementById('trickySortFeedback'),
    trickySortResetBtn: document.getElementById('trickySortResetBtn'),
    trickySortCheckBtn: document.getElementById('trickySortCheckBtn'),
    newTrickySortResetBtn: document.getElementById('newTrickySortResetBtn'),
    canvasDrawingTracerSection: document.getElementById('canvasDrawingTracerSection'),
    letterCanvas: document.getElementById('letterCanvas'),
    clearCanvasBtn: document.getElementById('clearCanvasBtn'),
    nextLetterBtn: document.getElementById('nextLetterBtn'),
    wordChoices: document.getElementById('wordChoices'),
    resetBtn: document.getElementById('resetBtn'), 
    feedback: document.getElementById('feedback'),
    gameComplete: document.getElementById('gameComplete'),
    finalMessage: document.getElementById('finalMessage'),
    playAgainBtn: document.getElementById('playAgainBtn'),
  };

  // Event listeners
  elements.learnLettersBtn.addEventListener('click', () => showFlashcardPackSelection('letters'));
  elements.blendWordsBtn.addEventListener('click', () => startGame('words'));
  elements.buildWordBtn.addEventListener('click', () => startGame('build'));
  elements.trickyWordsBtn.addEventListener('click', () => showFlashcardPackSelection('trickyWords')); 
  elements.pictureWordMatchBtn.addEventListener('click', () => startGame('pictureWordMatch')); 
  elements.trickyWordSortBtn.addEventListener('click', () => startGame('trickyWordSort')); 
  elements.canvasDrawingTracerBtn.addEventListener('click', () => startGame('canvasDrawingTracer'));
  elements.homeBtn.addEventListener('click', goHome); 

  elements.pictureWordResetBtn.addEventListener('click', setupPictureWordMatching); 
  elements.trickySortResetBtn.addEventListener('click', setupTrickyWordSorting); 
  elements.trickySortCheckBtn.addEventListener('click', checkTrickyWordSort); 
  elements.newTrickySortResetBtn.addEventListener('click', setupTrickyWordSorting);

  elements.clearCanvasBtn.addEventListener('click', clearCanvasDrawing);
  elements.nextLetterBtn.addEventListener('click', nextTracingLetter);

  document.addEventListener('dragend', () => draggedTrickyWordElement = null); 

  window.addEventListener('resize', () => {
    if (gameState.mode === 'canvasDrawingTracer' && elements.letterCanvas) {
      resizeCanvas();
    }
  });

  goHome(); // Start at menu
});

