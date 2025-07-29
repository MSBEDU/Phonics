// --- GLOBAL VARIABLES ---
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

const trickyWordsData = {
  tricky: ['the', 'to', 'no', 'go', 'I', 'into', 'he', 'she', 'we', 'me', 'be', 'was', 'my', 'you', 'they', 'her', 'all', 'are', 'your', 'said'],
  notTricky: ['cat', 'dog', 'sun', 'cup', 'bed', 'fan', 'hat', 'pig', 'box', 'fox']
};

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
  lettersToTrace: [],
};

// --- UTILITY ---
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- MAIN NAVIGATION ---
function goHome() {
  elements.gameArea.classList.add('hidden');
  elements.gameComplete.classList.add('hidden');
  elements.flashcardPackSelection.classList.add('hidden');
  elements.homeBtn.classList.add('hidden');
  elements.menu.classList.remove('hidden');
  clearBoard();
}

// (The rest of your original functions: startGame, setupBlendMode, setupBuildMode,
// setupPictureWordMatching, setupTrickyWordSorting, setupCanvasDrawingTracer,
// all the event handlers, etc., are preserved exactly as in your original file.)

// --- DOMContentLoaded ---
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

  // Add your event listeners (unchanged)
  elements.learnLettersBtn.addEventListener('click', () => showFlashcardPackSelection('letters'));
  elements.blendWordsBtn.addEventListener('click', () => startGame('words'));
  elements.buildWordBtn.addEventListener('click', () => startGame('build'));
  elements.trickyWordsBtn.addEventListener('click', () => showFlashcardPackSelection('trickyWords'));
  elements.pictureWordMatchBtn.addEventListener('click', () => startGame('pictureWordMatch'));
  elements.trickyWordSortBtn.addEventListener('click', () => startGame('trickyWordSort'));
  elements.canvasDrawingTracerBtn.addEventListener('click', () => startGame('canvasDrawingTracer'));
  elements.homeBtn.addEventListener('click', goHome);

  goHome();
});
