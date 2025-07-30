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
const masterBuildLettersPool = [...letterSets['Set 1'], ...letterSets['Set 2']]; // For build a word

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
  's': {
    description: 'Snake sound: teeth close, tongue behind.',
    examples: [{ word: 'sun', emoji: '☀️' }, { word: 'sit', emoji: '🪑' }],
    image: 'https://via.placeholder.com/150x150/87CEEB/FFFFFF?text=SNAKE',
    audio: 'assets/sounds/s.mp3' // Placeholder: Add your actual audio path here
  },
  'a': {
    description: 'Open mouth, "ah" sound like in apple.',
    examples: [{ word: 'apple', emoji: '🍎' }, { word: 'ant', emoji: '🐜' }],
    image: 'https://via.placeholder.com/150x150/FF6347/FFFFFF?text=APPLE',
    audio: 'assets/sounds/a.mp3' // Placeholder
  },
  't': {
    description: 'Tap tongue behind teeth, quick "tuh" sound.',
    examples: [{ word: 'top', emoji: '⬆️' }, { word: 'ten', emoji: '🔟' }],
    image: 'https://via.placeholder.com/150x150/FFD700/000000?text=TIGER',
    audio: 'assets/sounds/t.mp3' // Placeholder
  },
  'p': {
    description: 'Pop lips together, quick "puh" sound.',
    examples: [{ word: 'pen', emoji: '🖊️' }, { word: 'pig', emoji: '🐷' }],
    image: 'https://via.placeholder.com/150x150/98FB98/000000?text=PIG',
    audio: 'assets/sounds/p.mp3' // Placeholder
  },
  'i': {
    description: 'Small smile, "ih" sound like in ink.',
    examples: [{ word: 'ink', emoji: '✒️' }, { word: 'igloo', emoji: '🧊' }],
    image: 'https://via.placeholder.com/150x150/ADD8E6/000000?text=IGLOO',
    audio: 'assets/sounds/i.mp3' // Placeholder
  },
  'n': {
    description: 'Tongue tip behind teeth, nose hums.',
    examples: [{ word: 'net', emoji: '🕸️' }, { word: 'nut', emoji: '🌰' }],
    image: 'https://via.placeholder.com/150x150/DDA0DD/000000?text=NEST',
    audio: 'assets/sounds/n.mp3' // Placeholder
  },
  'm': {
    description: 'Lips together, mouth closed, hum.',
    examples: [{ word: 'mat', emoji: '🧘' }, { word: 'moon', emoji: '🌕' }],
    image: 'https://via.placeholder.com/150x150/FFB6C1/000000?text=MOON',
    audio: 'assets/sounds/m.mp3' // Placeholder
  },
  'd': {
    description: 'Tap tongue behind teeth, quick "duh" sound.',
    examples: [{ word: 'dog', emoji: '🐶' }, { word: 'doll', emoji: '🎎' }],
    image: 'https://via.placeholder.com/150x150/8FBC8F/000000?text=DOG',
    audio: 'assets/sounds/d.mp3' // Placeholder
  },
  'g': {
    description: 'Back of tongue up, "guh" sound.',
    examples: [{ word: 'go', emoji: '➡️' }, { word: 'gap', emoji: '〰️' }],
    image: 'https://via.placeholder.com/150x150/B0E0E6/000000?text=GOAT',
    audio: 'assets/sounds/g.mp3' // Placeholder
  },
  'o': {
    description: 'Round mouth, short "oh" sound.',
    examples: [{ word: 'on', emoji: '🔛' }, { word: 'pot', emoji: '🍲' }],
    image: 'https://via.placeholder.com/150x150/FFDAB9/000000?text=ORANGE',
    audio: 'assets/sounds/o.mp3' // Placeholder
  },
  'c': {
    description: 'Back of tongue up, quick "kuh" sound.',
    examples: [{ word: 'cat', emoji: '🐱' }, { word: 'cup', emoji: '☕' }],
    image: 'https://via.placeholder.com/150x150/DDA0DD/000000?text=CAT',
    audio: 'assets/sounds/c.mp3' // Placeholder
  },
  'k': {
    description: 'Back of tongue up, quick "kuh" sound.',
    examples: [{ word: 'kid', emoji: '🧒' }, { word: 'kit', emoji: '🛠️' }],
    image: 'https://via.placeholder.com/150x150/FFDEAD/000000?text=KITE',
    audio: 'assets/sounds/k.mp3' // Placeholder
  },
  'ck': {
    description: 'Same as "k", two letters one sound.',
    examples: [{ word: 'duck', emoji: '🦆' }, { word: 'sock', emoji: '🧦' }],
    image: 'https://via.placeholder.com/150x150/F0E68C/000000?text=DUCK',
    audio: 'assets/sounds/ck.mp3' // Placeholder
  },
  'e': {
    description: 'Relaxed mouth, short "eh" sound.',
    examples: [{ word: 'egg', emoji: '🥚' }, { word: 'red', emoji: '🔴' }],
    image: 'https://via.placeholder.com/150x150/F4A460/000000?text=EGG',
    audio: 'assets/sounds/e.mp3' // Placeholder
  },
  'u': {
    description: 'Short "uh" sound, like up.',
    examples: [{ word: 'up', emoji: '⬆️' }, { word: 'cup', emoji: '☕' }],
    image: 'https://via.placeholder.com/150x150/D8BFD8/000000?text=UMBRELLA',
    audio: 'assets/sounds/u.mp3' // Placeholder
  },
  'r': {
    description: 'Tongue curls back, "rrr" sound.',
    examples: [{ word: 'run', emoji: '🏃' }, { word: 'rat', emoji: '🐀' }],
    image: 'https://via.placeholder.com/150x150/C0C0C0/000000?text=RABBIT',
    audio: 'assets/sounds/r.mp3' // Placeholder
  },
  'h': {
    description: 'Quiet breath out of mouth.',
    examples: [{ word: 'hat', emoji: '🎩' }, { word: 'hen', emoji: '🐔' }],
    image: 'https://via.placeholder.com/150x150/FFDAB9/000000?text=HAT',
    audio: 'assets/sounds/h.mp3' // Placeholder
  },
  'b': {
    description: 'Lips together, puff of air, "buh" sound.',
    examples: [{ word: 'bat', emoji: '🏏' }, { word: 'bus', emoji: '🚌' }],
    image: 'https://via.placeholder.com/150x150/A2CD5A/000000?text=BALL',
    audio: 'assets/sounds/b.mp3' // Placeholder
  },
  'f': {
    description: 'Top teeth on lower lip, blow air.',
    examples: [{ word: 'fan', emoji: '🌬️' }, { word: 'fish', emoji: '🐠' }],
    image: 'https://via.placeholder.com/150x150/87CEFA/000000?text=FISH',
    audio: 'assets/sounds/f.mp3' // Placeholder
  },
  'ff': {
    description: 'Same as "f", two letters one sound.',
    examples: [{ word: 'puff', emoji: '💨' }, { word: 'off', emoji: '❌' }],
    image: 'https://via.placeholder.com/150x150/87CEFA/000000?text=FISH', // Same image as 'f'
    audio: 'assets/sounds/ff.mp3' // Placeholder
  },
  'l': {
    description: 'Tongue tip behind top teeth, "llll" sound.',
    examples: [{ word: 'leg', emoji: '🦵' }, { word: 'lip', emoji: '👄' }],
    image: 'https://via.placeholder.com/150x150/F08080/000000?text=LEAF',
    audio: 'assets/sounds/l.mp3' // Placeholder
  },
  'll': {
    description: 'Same as "l", two letters one sound.',
    examples: [{ word: 'bell', emoji: '🔔' }, { word: 'fill', emoji: '💧' }],
    image: 'https://via.placeholder.com/150x150/F08080/000000?text=LEAF', // Same image as 'l'
    audio: 'assets/sounds/ll.mp3' // Placeholder
  },
  'ss': {
    description: 'Same as "s", two letters one sound.',
    examples: [{ word: 'hiss', emoji: '🐍' }, { word: 'mess', emoji: ' messy' }],
    image: 'https://via.placeholder.com/150x150/87CEEB/FFFFFF?text=SNAKE', // Same image as 's'
    audio: 'assets/sounds/ss.mp3' // Placeholder
  }
};

const satpinWordsList = [
  { word: 'sat', emoji: '🪑', image: 'https://via.placeholder.com/250x250/FFDAB9/000000?text=SAT', audio: 'assets/sounds/sat.mp3' }, // Placeholder
  { word: 'pin', emoji: '📌', image: 'https://via.placeholder.com/250x250/ADD8E6/000000?text=PIN', audio: 'assets/sounds/pin.mp3' }, // Placeholder
  { word: 'pat', emoji: '👏', image: 'https://via.placeholder.com/250x250/98FB98/000000?text=PAT', audio: 'assets/sounds/pat.mp3' }, // Placeholder
  { word: 'tap', emoji: '🚰', image: 'https://via.placeholder.com/250x250/FFD700/000000?text=TAP', audio: 'assets/sounds/tap.mp3' }, // Placeholder
  { word: 'nap', emoji: '😴', image: 'https://via.placeholder.com/250x250/DDA0DD/000000?text=NAP', audio: 'assets/sounds/nap.mp3' }, // Placeholder
  { word: 'sip', emoji: '🥤', image: 'https://via.placeholder.com/250x250/87CEFA/000000?text=SIP', audio: 'assets/sounds/sip.mp3' }, // Placeholder
  { word: 'tip', emoji: '💡', image: 'https://via.placeholder.com/250x250/F08080/000000?text=TIP', audio: 'assets/sounds/tip.mp3' }, // Placeholder
  { word: 'tan', emoji: '🌞', image: 'https://via.placeholder.com/250x250/F4A460/000000?text=TAN', audio: 'assets/sounds/tan.mp3' }, // Placeholder
  { word: 'pit', emoji: '🕳️', image: 'https://via.placeholder.com/250x250/B0E0E6/000000?text=PIT', audio: 'assets/sounds/pit.mp3' }, // Placeholder
  { word: 'pan', emoji: '🍳', image: 'https://via.placeholder.com/250x250/FFB6C1/000000?text=PAN', audio: 'assets/sounds/pan.mp3' } // Placeholder
];

const trickyWordsData = {
    tricky: ['the', 'to', 'no', 'go', 'I', 'into', 'he', 'she', 'we', 'me', 'be', 'was', 'my', 'you', 'they', 'her', 'all', 'are', 'your', 'said'],
    notTricky: ['cat', 'dog', 'sun', 'cup', 'bed', 'fan', 'hat', 'pig', 'box', 'fox']
};

let elements = {}; // Declare elements globally
let gameState = { // Declare gameState globally
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

// --- UTILITY FUNCTIONS (GLOBAL) ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Placeholder for audio playback function
function playSound(audioPath) {
    // This function will eventually play sounds.
    // For now, it's just a placeholder to avoid errors if called without audio files.
    if (!audioPath || audioPath.includes('placeholder.mp3')) { // Adjusted to check for placeholder
        // console.warn("No real audio path provided or using placeholder.");
        return;
    }
    // When you have audio files, uncomment the following:
    // const audio = new Audio(audioPath);
    // audio.play().catch(e => {
    //     console.error("Error playing audio:", audioPath, e);
    // });
}


function toggleBlendingControls(enable) {
    const letterButtons = elements.blendBox.querySelectorAll('.letter');
    letterButtons.forEach(button => {
        button.disabled = !enable;
    });
    const wordChoiceButtons = elements.wordChoices.querySelectorAll('.word-choice');
    wordChoiceButtons.forEach(button => {
        button.disabled = !enable;
    });
}

function updateBuildWordDisplay() {
    elements.buildWordDisplay.textContent = gameState.userBuiltWord.join('');
    elements.feedback.textContent = ''; 
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

function hideAllGameSpecificElements() {
    elements.flashcardPackSelection.classList.add('hidden');
    elements.flashcardContainer.classList.add('hidden');
    elements.flashcardActions.classList.add('hidden');
    elements.flashcardProgress.classList.add('hidden');
    elements.flashcardPhonemeDescription.textContent = ''; 
    elements.flashcardAudioActions.innerHTML = ''; // Clear audio button

    elements.blendBox.innerHTML = '';
    elements.blendBox.classList.remove('horizontal');
    elements.blendText.textContent = '';
    elements.blendText.classList.add('hidden');

    elements.buildWordTargetFlashcard.classList.add('hidden'); 
    elements.buildWordTargetFlashcard.classList.remove('fade-in'); 
    elements.buildWordTargetFlashcard.textContent = '';


    elements.buildWordDisplay.innerHTML = '';
    elements.buildWordDisplay.classList.add('hidden');
    elements.buildWordDisplay.classList.remove('incorrect-feedback'); 
    elements.letterPool.innerHTML = '';
    elements.letterPool.classList.add('hidden');
    elements.clearBuildBtn.classList.add('hidden');
    elements.deleteBuildBtn.classList.add('hidden'); 
    elements.checkBuildBtn.classList.add('hidden');
    elements.buildActionsContainer.classList.add('hidden'); 
    elements.wordChoices.classList.add('hidden');
    elements.resetBtn.classList.add('hidden');

    // Hide Picture-Word Matching elements
    elements.pictureWordMatchingSection.classList.add('hidden');
    elements.pictureWordImage.classList.add('hidden');
    elements.pictureWordImage.src = '';
    elements.pictureWordAudioActions.innerHTML = ''; // Clear audio button
    elements.pictureWordChoices.innerHTML = '';
    elements.pictureWordResetBtn.classList.add('hidden');

    // Hide Tricky Word Sorting elements
    elements.trickyWordSortingSection.classList.add('hidden');
    // Ensure words-container is cleared and re-added correctly
    elements.trickyZone.innerHTML = '<h3>Tricky Words 🤯</h3><div class="words-container"></div>'; 
    elements.notTrickyZone.innerHTML = '<h3>Not Tricky Words ✅</h3><div class="words-container"></div>'; 
    elements.trickyWordPool.innerHTML = '';
    elements.trickySortFeedback.textContent = '';
    elements.trickySortResetBtn.classList.add('hidden');
    elements.trickySortCheckBtn.classList.add('hidden');
    elements.newTrickySortResetBtn.classList.add('hidden'); // Hide new reset button

    // Hide Canvas Drawing Tracer elements
    elements.canvasDrawingTracerSection.classList.add('hidden');
    elements.letterCanvas.classList.add('hidden'); // Hide canvas element directly
    elements.clearCanvasBtn.classList.add('hidden');
    elements.nextLetterBtn.classList.add('hidden');
    
    // Re-added score and stars display hiding
    elements.scoreDisplay.classList.add('hidden'); 
    elements.starsDisplay.classList.add('hidden');
}

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
    elements.flashcardAudioActions.innerHTML = ''; // Clear audio button
    
    // Clear Picture-Word Matching specific elements
    elements.pictureWordImage.classList.add('hidden');
    elements.pictureWordImage.src = '';
    elements.pictureWordAudioActions.innerHTML = ''; // Clear audio button
    elements.pictureWordChoices.innerHTML = '';

    // Clear Tricky Word Sorting specific elements
    elements.trickyZone.querySelector('.words-container').innerHTML = ''; // Clear words in container
    elements.notTrickyZone.querySelector('.words-container').innerHTML = ''; // Clear words in container
    elements.trickyWordPool.innerHTML = '';
    elements.trickySortFeedback.textContent = '';

    // Clear Canvas Drawing Tracer specific elements
    if (gameState.canvasCtx) {
        gameState.canvasCtx.clearRect(0, 0, elements.letterCanvas.width, elements.letterCanvas.height);
    }
    elements.prompt.textContent = '';
}

function goHome() {
  console.log("goHome function called."); // Debugging log
  elements.gameArea.classList.add('hidden');
  elements.gameComplete.classList.add('hidden');
  elements.flashcardPackSelection.classList.add('hidden');
  elements.homeBtn.classList.add('hidden');
  elements.menu.classList.remove('hidden');
  console.log("Menu visibility set to: ", !elements.menu.classList.contains('hidden')); // Debugging log
  clearBoard();
}

function startGame(mode) {
  console.log(`startGame called with mode: ${mode}`); // Debugging log
  gameState.mode = mode;
  gameState.score = 0; 
  gameState.stars = 0; 
  if (mode === 'words') {
      gameState.currentWords = [...satpinWordsList]; 
  }
  gameState.currentFlashcardIndex = 0;
  gameState.flashcardsCompletedCount = 0;
  gameState.packSelectionType = ''; 
  gameState.currentFlashcardSetDescription = ''; 

  elements.menu.classList.add('hidden');
  elements.gameComplete.classList.add('hidden');
  elements.homeBtn.classList.remove('hidden');
  elements.gameArea.classList.remove('hidden');
  console.log(`gameArea classList after removing hidden: ${elements.gameArea.classList}`); // Debugging log
  
  clearBoard();
  updateScore(); 
  updateStars(); 
  hideAllGameSpecificElements();

  if (mode === 'words') {
    setupBlendMode();
  } else if (mode === 'build') {
      setupBuildMode();
  } else if (mode === 'pictureWordMatch') { 
      setupPictureWordMatching();
  } else if (mode === 'trickyWordSort') { 
      setupTrickyWordSorting();
  } else if (mode === 'canvasDrawingTracer') {
      setupCanvasDrawingTracer();
  }
}

function showFlashcardPackSelection(packType) {
    console.log(`showFlashcardPackSelection called with packType: ${packType}`); // Debugging log
    gameState.mode = 'flashcards'; 
    gameState.packSelectionType = packType; 

    elements.menu.classList.add('hidden');
    elements.gameComplete.classList.add('hidden');
    elements.homeBtn.classList.remove('hidden');
    elements.gameArea.classList.remove('hidden');
    console.log(`gameArea classList after removing hidden in flashcard selection: ${elements.gameArea.classList}`); // Debugging log

    hideAllGameSpecificElements();
    elements.flashcardPackSelection.classList.remove('hidden');
    
    elements.packSelectionIntroText.textContent = `Choose a ${packType === 'letters' ? 'Phase 2 Sound' : 'Tricky Word'} Set:`;

    elements.packButtons.innerHTML = '';
    const sets = packType === 'letters' ? letterSets : trickyWordSets;
    
    let allItems = [];
    let allItemsName = '';
    if (packType === 'letters') {
        allItems = [...allPhase2Letters];
        allItemsName = 'All Sounds';
    } else { 
        allItems = Object.values(trickyWordSets).flatMap(set => set.words);
        allItemsName = 'All Tricky Words';
    }

    for (const setName in sets) {
        const setContent = sets[setName];
        const displayItems = Array.isArray(setContent) ? setContent : setContent.words;
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = `${setName}: ${displayItems.join(', ')}`;
        button.addEventListener('click', () => startFlashcardPack(setName, packType)); 
        elements.packButtons.appendChild(button);
    }

    const allButton = document.createElement('button');
    allButton.className = 'menu-button';
    allButton.textContent = allItemsName;
    allButton.addEventListener('click', () => startFlashcardPack(allItemsName, packType));
    elements.packButtons.appendChild(allButton);
}


function startFlashcardPack(packName, packType) {
    elements.flashcardPackSelection.classList.add('hidden');
    elements.flashcardContainer.classList.remove('hidden');
    elements.flashcardActions.classList.remove('hidden');
    elements.flashcardProgress.classList.remove('hidden');

    let itemsForThisPack;
    gameState.currentFlashcardSetDescription = ''; 

    if (packType === 'letters') {
        if (packName === 'All Sounds') {
            itemsForThisPack = [...allPhase2Letters];
        } else {
            itemsForThisPack = [...letterSets[packName]];
        }
        elements.prompt.textContent = `What sound is this?`;
    } else { 
        if (packName === 'All Tricky Words') {
            itemsForThisPack = Object.values(trickyWordSets).flatMap(set => set.words);
            elements.prompt.textContent = `What is this tricky word?`;
        } else {
            itemsForThisPack = [...trickyWordSets[packName].words];
            elements.prompt.textContent = `What is this tricky word?`;
            gameState.currentFlashcardSetDescription = trickyWordSets[packName].description;
        }
    }
    
    gameState.flashcardMasterList = itemsForThisPack;
    gameState.currentFlashcardLetters = shuffleArray([...itemsForThisPack]);
    gameState.currentFlashcardIndex = 0;
    gameState.currentFlashcardSetName = packName;
    gameState.flashcardsCompletedCount = 0;
    elements.flashcardContainer.dataset.masteredUniqueLetters = ''; 

    displayFlashcard();
}

function displayFlashcard() {
    if (gameState.currentFlashcardLetters.length === 0) {
        endGame("You've mastered all the letters!"); // Corrected message
        return;
    }

    const currentItem = gameState.currentFlashcardLetters[gameState.currentFlashcardIndex];
    elements.flashcardLetter.textContent = currentItem;
    elements.flashcardLetter.classList.remove('hidden-content');
    
    if (gameState.packSelectionType === 'letters') {
        elements.flashcardPhonemeDescription.textContent = phonemeDetails[currentItem]?.description || '';
        // --- AUDIO PLAYBACK (PHONEME) ---
        const audioPath = phonemeDetails[currentItem]?.audio;
        if (audioPath) {
            // playSound(audioPath); // Uncomment this line when you have actual audio files and want autoplay on display
        }

        // Add a replay button for the sound
        const audioReplayContainer = elements.flashcardAudioActions; // Use the element added in index.html
        audioReplayContainer.innerHTML = ''; // Clear previous button
        const replayButton = document.createElement('button');
        replayButton.textContent = '🔊 Play Sound';
        replayButton.className = 'action-buttons';
        replayButton.onclick = () => playSound(audioPath); // This will call playSound on click
        audioReplayContainer.appendChild(replayButton);

    } else { 
        elements.flashcardPhonemeDescription.textContent = gameState.currentFlashcardSetDescription || 'Try to remember this word!';
        // --- AUDIO PLAYBACK (TRICKY WORD) ---
        // You'll need an audio property for tricky words if you want to play them
        const audioPath = `assets/sounds/tricky_words/${currentItem.toLowerCase()}.mp3`; // Placeholder for tricky word audio
        if (audioPath) {
            // playSound(audioPath); // Uncomment this line when you have actual audio files
        }

        // Add a replay button for the word sound
        const audioReplayContainer = elements.flashcardAudioActions;
        audioReplayContainer.innerHTML = '';
        const replayButton = document.createElement('button');
        replayButton.textContent = '🔊 Play Word';
        replayButton.className = 'action-buttons';
        replayButton.onclick = () => playSound(audioPath);
        audioReplayContainer.appendChild(replayButton);
    }

    elements.flashcardProgress.textContent = `Mastered: ${gameState.flashcardsCompletedCount} of ${gameState.flashcardMasterList.length}`;
}

function processFlashcardResponseAndAdvance(assessment) {
    elements.flashcardContainer.classList.add('fade-out');

    setTimeout(() => {
        const currentItem = gameState.currentFlashcardLetters[gameState.currentFlashcardIndex];

        if (assessment === 'gotIt') {
            if (!elements.flashcardContainer.dataset.masteredUniqueLetters.includes(currentItem)) {
                gameState.flashcardsCompletedCount++;
                elements.flashcardContainer.dataset.masteredUniqueLetters += currentItem; 
            }
            gameState.currentFlashcardLetters.splice(gameState.currentFlashcardIndex, 1);
            
            if (gameState.currentFlashcardLetters.length > 0) {
                if (gameState.currentFlashcardIndex >= gameState.currentFlashcardLetters.length) {
                    gameState.currentFlashcardIndex = 0; 
                }
            } else {
                gameState.currentFlashcardIndex = 0;
            }

        } else if (assessment === 'needPractice') {
            gameState.currentFlashcardLetters.push(currentItem);
            gameState.currentFlashcardIndex++;
            if (gameState.currentFlashcardIndex >= gameState.currentFlashcardLetters.length) {
                gameState.currentFlashcardIndex = 0; 
            }
        }

        elements.flashcardContainer.classList.remove('fade-out');
        displayFlashcard();
    }, 300);
}

// --- BLEND WORDS MODE ---
function setupBlendMode() {
  clearBoard();
  elements.prompt.innerHTML = 'Blend the sounds and click the correct word.<br>Collect 10 ⭐ to complete this activity!'; 
  updateScore(); 
  updateStars(); 
  elements.resetBtn.classList.remove('hidden');
  elements.wordChoices.classList.remove('hidden');
  elements.blendText.classList.remove('hidden');
  elements.blendBox.classList.add('horizontal');

  toggleBlendingControls(true); 

  if (gameState.currentWords.length === 0) {
    endGame("You've blended all the SATPIN words!"); 
    return;
  }

  const wordIndex = Math.floor(Math.random() * gameState.currentWords.length);
  const chosenWordObject = gameState.currentWords.splice(wordIndex, 1)[0];
  gameState.correctWord = chosenWordObject.word;
  gameState.correctEmoji = chosenWordObject.emoji;
  gameState.currentWord = chosenWordObject; 

  elements.blendBox.innerHTML = ''; 
  gameState.blended = '';
  elements.blendText.textContent = gameState.blended.split('').join(' ');

  gameState.correctWord.split('').forEach(l => {
    const letterButton = document.createElement('button');
    letterButton.className = 'letter';
    letterButton.textContent = l;
    letterButton.addEventListener('click', (event) => {
      gameState.blended += l;
      elements.blendText.textContent = gameState.blended.split('').join(' ');
      event.target.classList.add('blended-active');
      event.target.disabled = true; 
        // --- AUDIO PLAYBACK (BLEND - INDIVIDUAL LETTER) ---
        const letterAudioPath = phonemeDetails[l]?.audio;
        if (letterAudioPath) {
            playSound(letterAudioPath);
        }
      setTimeout(() => {
          event.target.classList.remove('blended-active');
      }, 150);
    });
    elements.blendBox.appendChild(letterButton);
  });

  const distractors = satpinWordsList.filter(w => w.word !== gameState.correctWord);
  const shuffledDistractors = distractors.sort(() => 0.5 - Math.random());
  const options = [chosenWordObject, ...shuffledDistractors.slice(0, 2)];
  
  elements.wordChoices.innerHTML = '';

  options.sort(() => 0.5 - Math.random()).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'word-choice';
    btn.innerHTML = `${opt.word} <span class="emoji">${opt.emoji}</span>`;
    btn.addEventListener('click', () => handleChoice(opt.word, btn));
    elements.wordChoices.appendChild(btn);
  });
}

function handleChoice(selection, chosenButton) {
  toggleBlendingControls(false); 

  if (selection === gameState.correctWord) {
    gameState.score++;
    gameState.stars++; 
    updateScore();
    updateStars();
    elements.feedback.textContent = `🎉 Correct! ${gameState.correctEmoji}`; 
    chosenButton.classList.add('correct-feedback');
    
    // --- AUDIO PLAYBACK (BLEND - CORRECT WORD) ---
    const correctWordAudioPath = gameState.currentWord.audio;
    if (correctWordAudioPath) {
        playSound(correctWordAudioPath);
    }

    if (gameState.stars >= 10) { 
        endGame("You earned 10 stars!");
        return;
    }
    

    setTimeout(() => {
      chosenButton.classList.remove('correct-feedback');
      setupBlendMode();
    }, 1200);

  } else {
    elements.feedback.textContent = '❌ Try again!';
    chosenButton.classList.add('incorrect-feedback');
    // --- AUDIO PLAYBACK (BLEND - INCORRECT) ---
    // playSound('assets/sounds/incorrect_buzz.mp3'); // Uncomment if you have an incorrect sound
    setTimeout(() => {
      chosenButton.classList.remove('incorrect-feedback');
      toggleBlendingControls(true); 
      const letterButtons = elements.blendBox.querySelectorAll('.letter');
      letterButtons.forEach(button => {
          button.disabled = false; 
      });
    }, 800);
  }
}


// --- BUILD A WORD MODE ---
function setupBuildMode() {
  clearBoard();
  elements.prompt.innerHTML = 'Use the letters to build a SATPIN word (from Set 1 & 2 sounds)!<br>Collect 10 ⭐ to complete this activity!'; 
  
  updateScore(); 
  updateStars(); 

  elements.buildWordTargetFlashcard.classList.remove('hidden'); 
  elements.buildWordDisplay.classList.remove('hidden');
  elements.letterPool.classList.remove('hidden');
  elements.buildActionsContainer.classList.remove('hidden'); 
  
  elements.clearBuildBtn.disabled = false;
  elements.deleteBuildBtn.disabled = false; 
  elements.checkBuildBtn.disabled = false;
  elements.resetBtn.disabled = false; 

  elements.clearBuildBtn.classList.remove('hidden');
  elements.deleteBuildBtn.classList.remove('hidden'); 
  elements.checkBuildBtn.classList.remove('hidden');
  elements.resetBtn.classList.remove('hidden'); 

  if (gameState.availableBuildWords.length === 0 || gameState.mode !== 'build') { 
      const filteredWords = satpinWordsList.filter(wordObj => {
          const wordLetters = wordObj.word.split('');
          const allowedLetters = [...letterSets['Set 1'], ...letterSets['Set 2']];
          
          const tempAllowed = [...allowedLetters];
          let possible = true;
          for (const char of wordLetters) {
              const idx = tempAllowed.indexOf(char);
              if (idx > -1) {
                  tempAllowed.splice(idx, 1); 
              } else {
                  possible = false; 
                  break;
              }
          }
          return possible;
      });
      gameState.availableBuildWords = shuffleArray([...filteredWords]);
      gameState.mode = 'build'; 
  }

  if (gameState.availableBuildWords.length === 0) {
      endGame('You have built all the words from Set 1 & 2!');
      return;
  }

  const wordIndex = Math.floor(Math.random() * gameState.availableBuildWords.length);
  const chosenWordObject = gameState.availableBuildWords.splice(wordIndex, 1)[0];
  gameState.targetBuildWord = chosenWordObject.word;
  gameState.correctEmoji = chosenWordObject.emoji;
  
  elements.buildWordTargetFlashcard.textContent = gameState.targetBuildWord.toLowerCase(); 
  elements.buildWordTargetFlashcard.classList.remove('fade-in'); 
  void elements.buildWordTargetFlashcard.offsetWidth; 
  elements.buildWordTargetFlashcard.classList.add('fade-in'); 

  gameState.userBuiltWord = []; 
  gameState.usedLetterButtons = []; 
  gameState.buildLettersPool = shuffleArray([...masterBuildLettersPool]); 
  
  renderLetterPool();
  updateBuildWordDisplay();
}

function selectLetterForBuild(letter, buttonElement) {
    gameState.userBuiltWord.push(letter);
    gameState.usedLetterButtons.push(buttonElement); 
    updateBuildWordDisplay();

    buttonElement.disabled = true; 
    buttonElement.classList.add('selected'); 
    buttonElement.classList.add('blended-active'); 
    // --- AUDIO PLAYBACK (BUILD - INDIVIDUAL LETTER) ---
    const letterAudioPath = phonemeDetails[letter]?.audio;
    if (letterAudioPath) {
        playSound(letterAudioPath);
    }
    setTimeout(() => {
        buttonElement.classList.remove('blended-active');
    }, 150);
}

function deleteLastLetter() {
    if (gameState.userBuiltWord.length > 0) {
        gameState.userBuiltWord.pop(); 
        
        const lastUsedButton = gameState.usedLetterButtons.pop(); 
        if (lastUsedButton) {
            lastUsedButton.disabled = false;
            lastUsedButton.classList.remove('selected');
            lastUsedButton.classList.remove('blended-active'); 
        }
        updateBuildWordDisplay();
    }
}


function renderLetterPool() {
  elements.letterPool.innerHTML = '';
  const currentPoolRender = [...masterBuildLettersPool]; 

  currentPoolRender.forEach((letter, index) => {
      const letterBtn = document.createElement('button');
      letterBtn.className = 'letter';
      letterBtn.textContent = letter;
      letterBtn.dataset.letterValue = letter; 
      letterBtn.dataset.originalIndex = index; 
      letterBtn.addEventListener('click', () => selectLetterForBuild(letter, letterBtn));
      elements.letterPool.appendChild(letterBtn);
  });
}

function clearBuild() {
    gameState.userBuiltWord = [];
    gameState.usedLetterButtons.forEach(button => { 
        button.disabled = false;
        button.classList.remove('selected');
        button.classList.remove('blended-active');
    });
    gameState.usedLetterButtons = []; 
    updateBuildWordDisplay();
    elements.feedback.textContent = '';
    
}

function checkBuildWord() {
    if (gameState.userBuiltWord.join('') === gameState.targetBuildWord) {
        elements.feedback.textContent = `🎉 Correct! You built: ${gameState.targetBuildWord.toLowerCase()} ${gameState.correctEmoji}`; 
        
        gameState.score++;
        gameState.stars++;
        updateScore();
        updateStars();

    // --- AUDIO PLAYBACK (BUILD - CORRECT WORD) ---
    const targetWordObject = satpinWordsList.find(w => w.word === gameState.targetBuildWord);
    if (targetWordObject && targetWordObject.audio) {
        playSound(targetWordObject.audio);
    } else {
        // Fallback: Try to spell out the word if no full word audio
        gameState.targetBuildWord.split('').forEach((l, index) => {
            setTimeout(() => {
                const letterAudioPath = phonemeDetails[l]?.audio;
                if (letterAudioPath) {
                    playSound(letterAudioPath);
                }
            }, index * 300); // Small delay for each letter
        });
    }

        elements.letterPool.querySelectorAll('.letter').forEach(btn => btn.setAttribute('disabled', 'true')); // Disable all letters
        elements.clearBuildBtn.disabled = true;
        elements.deleteBuildBtn.disabled = true; 
        elements.checkBuildBtn.disabled = true;

        if (gameState.stars >= 10) { 
            endGame("You earned 10 stars!");
            return;
        }
        

        setTimeout(() => {
            setupBuildMode(); 
        }, 1800); 
    } else {
        elements.feedback.textContent = '❌ Not quite! Try again.';
        elements.buildWordDisplay.classList.add('incorrect-feedback'); 
        // --- AUDIO PLAYBACK (BUILD - INCORRECT) ---
        // playSound('assets/sounds/incorrect_buzz.mp3'); // Uncomment if you have an incorrect sound
        setTimeout(() => {
            elements.buildWordDisplay.classList.remove('incorrect-feedback'); 
        }, 800);
    }
}


// --- NEW: PICTURE-WORD MATCHING MODE ---
function setupPictureWordMatching() {
  clearBoard();
  gameState.mode = 'pictureWordMatch';
  elements.prompt.innerHTML = 'Match the picture with the correct word!';
  elements.pictureWordMatchingSection.classList.remove('hidden');
  elements.pictureWordImage.classList.remove('hidden');
  elements.pictureWordResetBtn.classList.remove('hidden');
  
  updateScore(); 
  updateStars(); 

  gameState.pictureWordMatchWords = shuffleArray([...satpinWordsList]);
  loadNextPictureWord();
}

function loadNextPictureWord() {
  if (gameState.pictureWordMatchWords.length === 0) {
      endGame("You've matched all the words!");
      return;
  }

  gameState.currentPictureWord = gameState.pictureWordMatchWords.shift();
  elements.pictureWordImage.src = gameState.currentPictureWord.image;
  elements.pictureWordImage.alt = gameState.currentPictureWord.word;

  elements.feedback.textContent = ''; // Clear feedback

    // --- AUDIO PLAYBACK (PICTURE-WORD - ON LOAD) ---
    if (gameState.currentPictureWord.audio) {
        // playSound(gameState.currentPictureWord.audio); // Uncomment this line if you want autoplay on load
    }

    // Add a replay button for the word sound
    const pictureAudioReplayContainer = elements.pictureWordAudioActions;
    pictureAudioReplayContainer.innerHTML = '';
    const replayButton = document.createElement('button');
    replayButton.textContent = '🔊 Play Word';
    replayButton.className = 'action-buttons';
    replayButton.onclick = () => playSound(gameState.currentPictureWord.audio);
    pictureAudioReplayContainer.appendChild(replayButton);


  // Generate choices
  const correctWord = gameState.currentPictureWord;
  const distractors = satpinWordsList.filter(w => w.word !== correctWord.word);
  const shuffledDistractors = shuffleArray(distractors).slice(0, 2); // Get 2 random distractors
  const choices = shuffleArray([correctWord, ...shuffledDistractors]);

  elements.pictureWordChoices.innerHTML = '';
  choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'word-choice';
      btn.textContent = choice.word;
      btn.dataset.word = choice.word;
      btn.addEventListener('click', () => handlePictureWordChoice(choice.word, btn));
      elements.pictureWordChoices.appendChild(btn);
  });
}

function handlePictureWordChoice(selectedWord, chosenButton) {
  // Disable all choice buttons to prevent multiple clicks
  Array.from(elements.pictureWordChoices.children).forEach(btn => btn.disabled = true); // Disable all choice buttons

  if (selectedWord === gameState.currentPictureWord.word) {
      gameState.score++;
      gameState.stars++;
      updateScore();
      updateStars();
      elements.feedback.textContent = `🎉 Correct!`;
      chosenButton.classList.add('correct-feedback');

    // --- AUDIO PLAYBACK (PICTURE-WORD - CORRECT) ---
    if (gameState.currentPictureWord.audio) {
        playSound(gameState.currentPictureWord.audio);
    }

      if (gameState.stars >= 10) {
          endGame("You earned 10 stars!");
          return;
      }

      setTimeout(() => {
          chosenButton.classList.remove('correct-feedback');
          loadNextPictureWord();
      }, 1200);
  } else {
      elements.feedback.textContent = '❌ Try again!';
      chosenButton.classList.add('incorrect-feedback');
    // --- AUDIO PLAYBACK (PICTURE-WORD - INCORRECT) ---
    // playSound('assets/sounds/incorrect_buzz.mp3'); // Uncomment if you have an incorrect sound
      setTimeout(() => {
          chosenButton.classList.remove('incorrect-feedback');
          Array.from(elements.pictureWordChoices.children).forEach(btn => btn.disabled = false); // Re-enable buttons
      }, 800);
  }
}


// --- TRICKY WORD SORTING MODE ---
function setupTrickyWordSorting() {
  console.log("Setting up Tricky Word Sorting...");
  clearBoard();
  gameState.mode = 'trickyWordSort';
  elements.prompt.innerHTML = 'Drag and drop each word into "Tricky Words" or "Not Tricky Words" categories.';
  elements.trickyWordSortingSection.classList.remove('hidden');
  elements.trickySortResetBtn.classList.remove('hidden');
  elements.trickySortCheckBtn.classList.remove('hidden');
  elements.newTrickySortResetBtn.classList.remove('hidden'); // Show new reset button
  updateScore();
  updateStars();

  // Combine all tricky and non-tricky words and shuffle them
  const allWords = shuffleArray([...trickyWordsData.tricky, ...trickyWordsData.notTricky]);
  gameState.trickySortWords = allWords;

  elements.trickyWordPool.innerHTML = '';
  gameState.trickySortWords.forEach(word => {
      const wordElement = document.createElement('div');
      wordElement.className = 'sortable-word';
      wordElement.textContent = word;
      wordElement.draggable = true;
      wordElement.dataset.word = word; // Store the word in a data attribute
      elements.trickyWordPool.appendChild(wordElement);
  });

  addDragDropListeners();
}

function addDragDropListeners() {
    const sortableWords = document.querySelectorAll('.sortable-word');
    const sortZones = document.querySelectorAll('.sort-zone');

    sortableWords.forEach(word => {
        word.addEventListener('dragstart', handleDragStart);
        word.addEventListener('touchenter', handleTouchStart); // For touch devices
        word.addEventListener('touchmove', handleTouchMove);
        word.addEventListener('touchend', handleTouchEnd);
        word.addEventListener('touchcancel', handleTouchEnd);
    });

    sortZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedTrickyWordElement = e.target;
    e.dataTransfer.setData('text/plain', e.target.dataset.word);
    e.target.classList.add('dragging');
    elements.trickySortFeedback.textContent = ''; // Clear feedback on drag start
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
    const targetZone = e.target.closest('.sort-zone');
    if (targetZone) {
        targetZone.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const targetZone = e.target.closest('.sort-zone');
    if (targetZone) {
        targetZone.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const targetZone = e.target.closest('.sort-zone');
    if (targetZone && draggedTrickyWordElement) {
        targetZone.querySelector('.words-container').appendChild(draggedTrickyWordElement);
        targetZone.classList.remove('drag-over');
        draggedTrickyWordElement.classList.remove('dragging');
        draggedTrickyWordElement = null; // Reset
    }
}

function handleTouchStart(e) {
    e.preventDefault(); // Prevent scrolling
    draggedTrickyWordElement = e.target;
    e.target.classList.add('dragging');
    elements.trickySortFeedback.textContent = '';
    // Position the element under the finger (optional, but improves UX)
    const touch = e.touches[0];
    draggedTrickyWordElement.style.position = 'absolute';
    draggedTrickyWordElement.style.zIndex = 1000;
    draggedTrickyWordElement.style.left = `${touch.pageX - draggedTrickyWordElement.offsetWidth / 2}px`;
    draggedTrickyWordElement.style.top = `${touch.pageY - draggedTrickyWordElement.offsetHeight / 2}px`;
}

function handleTouchMove(e) {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    if (draggedTrickyWordElement) {
        draggedTrickyWordElement.style.left = `${touch.pageX - draggedTrickyWordElement.offsetWidth / 2}px`;
        draggedTrickyWordElement.style.top = `${touch.pageY - draggedTrickyWordElement.offsetHeight / 2}px`;

        // Highlight potential drop zones
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        document.querySelectorAll('.sort-zone').forEach(zone => zone.classList.remove('drag-over'));
        const targetZone = targetElement?.closest('.sort-zone');
        if (targetZone) {
            targetZone.classList.add('drag-over');
        }
    }
}

function handleTouchEnd(e) {
    if (!draggedTrickyWordElement) return;

    // Determine the drop target based on the final touch position
    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetZone = targetElement?.closest('.sort-zone');

    if (targetZone) {
        targetZone.querySelector('.words-container').appendChild(draggedTrickyWordElement);
    } else {
        // If dropped outside a zone, return to original pool
        elements.trickyWordPool.appendChild(draggedTrickyWordElement);
    }

    draggedTrickyWordElement.classList.remove('dragging');
    draggedTrickyWordElement.style.position = ''; // Remove inline styles
    draggedTrickyWordElement.style.zIndex = '';
    draggedTrickyWordElement.style.left = '';
    draggedTrickyWordElement.style.top = '';

    document.querySelectorAll('.sort-zone').forEach(zone => zone.classList.remove('drag-over'));
    draggedTrickyWordElement = null;
}


function checkTrickyWordSort() {
  console.log("Checking tricky word sort...");
  let correctCount = 0;
  let totalWords = trickyWordsData.tricky.length + trickyWordsData.notTricky.length;

  const trickyZoneWords = Array.from(elements.trickyZone.querySelector('.words-container').children).map(el => el.dataset.word);
  const notTrickyZoneWords = Array.from(elements.notTrickyZone.querySelector('.words-container').children).map(el => el.dataset.word);
  const poolWords = Array.from(elements.trickyWordPool.children).map(el => el.dataset.word);

  let allCorrect = true;

  // Check words in Tricky Zone
  trickyZoneWords.forEach(word => {
      if (trickyWordsData.tricky.includes(word)) {
          correctCount++;
      } else {
          allCorrect = false;
      }
  });

  // Check words in Not Tricky Zone
  notTrickyZoneWords.forEach(word => {
      if (trickyWordsData.notTricky.includes(word)) {
          correctCount++;
      } else {
          allCorrect = false;
      }
  });

  // Any words left in the pool means not all sorted
  if (poolWords.length > 0) {
      allCorrect = false;
  }

  if (allCorrect && correctCount === totalWords) {
      elements.trickySortFeedback.textContent = '🎉 Excellent! All words sorted correctly!';
      elements.trickySortFeedback.className = 'sort-feedback correct';
      gameState.score++;
      gameState.stars++;
      updateScore();
      updateStars();
      // Optionally disable further dragging/dropping or move to next activity
      document.querySelectorAll('.sortable-word').forEach(word => word.draggable = false);
      document.querySelectorAll('.sort-zone').forEach(zone => {
          zone.removeEventListener('dragover', handleDragOver);
          zone.removeEventListener('dragleave', handleDragLeave);
          zone.removeEventListener('drop', handleDrop);
      });
        // playSound('assets/sounds/correct_chime.mp3'); // Uncomment if you have a correct sound
      if (gameState.stars >= 10) {
          endGame("You earned 10 stars!");
          return;
      }
  } else {
      elements.trickySortFeedback.textContent = '❌ Not quite right. Keep trying!';
      elements.trickySortFeedback.className = 'sort-feedback incorrect';
      // Optionally highlight incorrect words or provide specific feedback
        // playSound('assets/sounds/incorrect_buzz.mp3'); // Uncomment if you have an incorrect sound
  }
}


function resetTrickyWordSort() {
    setupTrickyWordSorting(); // Re-shuffles and resets the board
}


// --- CANVAS DRAWING TRACER MODE ---
function setupCanvasDrawingTracer() {
    clearBoard();
    gameState.mode = 'canvasDrawingTracer';
    elements.prompt.innerHTML = 'Trace the letter!';
    elements.canvasDrawingTracerSection.classList.remove('hidden');
    elements.letterCanvas.classList.remove('hidden'); // Ensure canvas is visible
    elements.clearCanvasBtn.classList.remove('hidden');
    elements.nextLetterBtn.classList.remove('hidden');

    // Initialize canvas context if not already
    if (!gameState.canvasCtx) {
        elements.letterCanvas.width = elements.letterCanvas.offsetWidth;
        elements.letterCanvas.height = elements.letterCanvas.offsetHeight;
        gameState.canvasCtx = elements.letterCanvas.getContext('2d');
        gameState.canvasCtx.lineWidth = 10;
        gameState.canvasCtx.lineCap = 'round';
        gameState.canvasCtx.strokeStyle = 'var(--canvas-drawing-color)';

        elements.letterCanvas.addEventListener('mousedown', startDrawing);
        elements.letterCanvas.addEventListener('mouseup', stopDrawing);
        elements.letterCanvas.addEventListener('mouseout', stopDrawing); // Stop drawing if mouse leaves canvas
        elements.letterCanvas.addEventListener('mousemove', draw);

        elements.letterCanvas.addEventListener('touchstart', startDrawing, { passive: false });
        elements.letterCanvas.addEventListener('touchend', stopDrawing);
        elements.letterCanvas.addEventListener('touchcancel', stopDrawing);
        elements.letterCanvas.addEventListener('touchmove', draw, { passive: false });
    }

    updateScore();
    updateStars();

    // Prepare letters for tracing
    if (gameState.lettersToTrace.length === 0) {
        gameState.lettersToTrace = shuffleArray([...allPhase2Letters]);
    }
    loadNextTracingLetter();
}

function loadNextTracingLetter() {
    if (gameState.lettersToTrace.length === 0) {
        endGame("You've traced all the letters!");
        return;
    }
    gameState.currentTracingLetter = gameState.lettersToTrace.shift();
    clearCanvas();
    drawLetterOutline(gameState.currentTracingLetter);
    gameState.hasDrawnOnCanvas = false; // Reset for new letter
}

function drawLetterOutline(letter) {
    const ctx = gameState.canvasCtx;
    ctx.clearRect(0, 0, elements.letterCanvas.width, elements.letterCanvas.height);
    ctx.save(); // Save current state

    // Setup for drawing the letter outline (can be customized)
    ctx.font = `bold ${elements.letterCanvas.height * 0.8}px ${getComputedStyle(document.body).fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; // Light grey, semi-transparent outline

    // Adjust text position for centering
    const x = elements.letterCanvas.width / 2;
    const y = elements.letterCanvas.height / 2;
    ctx.fillText(letter.toUpperCase(), x, y); // Draw uppercase letter for tracing

    ctx.restore(); // Restore to previous state (removes fillStyle etc.)
    // The drawing color for the user's stroke is set in setupCanvasDrawingTracer
}


function startDrawing(e) {
    e.preventDefault(); // Prevent scrolling on touch devices
    gameState.isDrawing = true;
    gameState.hasDrawnOnCanvas = true; // User has started drawing
    const rect = elements.letterCanvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    gameState.lastX = x;
    gameState.lastY = y;
    gameState.canvasCtx.beginPath();
    gameState.canvasCtx.moveTo(gameState.lastX, gameState.lastY);
}

function draw(e) {
    if (!gameState.isDrawing) return;
    e.preventDefault(); // Prevent scrolling on touch devices

    const rect = elements.letterCanvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    gameState.canvasCtx.lineTo(x, y);
    gameState.canvasCtx.stroke();
    gameState.lastX = x;
    gameState.lastY = y;
}

function stopDrawing() {
    gameState.isDrawing = false;
    gameState.canvasCtx.closePath();
}

function clearCanvas() {
    if (gameState.canvasCtx) {
        gameState.canvasCtx.clearRect(0, 0, elements.letterCanvas.width, elements.letterCanvas.height);
        drawLetterOutline(gameState.currentTracingLetter); // Redraw the outline
        gameState.hasDrawnOnCanvas = false;
    }
}

function nextTracingLetter() {
    if (gameState.hasDrawnOnCanvas) { // Only score if something was drawn
        gameState.score++;
        gameState.stars++;
        updateScore();
        updateStars();
        // playSound('assets/sounds/correct_ding.mp3'); // Uncomment if you have a sound for completing a trace
    } else {
        // playSound('assets/sounds/hint_sound.mp3'); // Optionally play a hint sound if nothing was drawn
        elements.feedback.textContent = 'Draw the letter first!'; // Provide feedback
        setTimeout(() => elements.feedback.textContent = '', 1500);
    }

    if (gameState.stars >= 10) { // Check win condition
        endGame("You earned 10 stars!");
        return;
    }
    loadNextTracingLetter();
}


// --- GAME INITIALIZATION & EVENT LISTENERS ---
function init() {
  // Get references to all necessary DOM elements
  elements = {
    menu: document.getElementById('menu'),
    learnLettersBtn: document.getElementById('learnLettersBtn'),
    blendWordsBtn: document.getElementById('blendWordsBtn'),
    buildWordBtn: document.getElementById('buildWordBtn'),
    trickyWordsBtn: document.getElementById('trickyWordsBtn'), // Tricky Words Flashcards
    pictureWordMatchBtn: document.getElementById('pictureWordMatchBtn'),
    trickyWordSortBtn: document.getElementById('trickyWordSortBtn'),
    canvasDrawingTracerBtn: document.getElementById('canvasDrawingTracerBtn'),

    gameArea: document.getElementById('gameArea'),
    prompt: document.getElementById('prompt'),
    feedback: document.getElementById('feedback'),
    scoreDisplay: document.getElementById('score'),
    starsDisplay: document.getElementById('stars'),
    homeBtn: document.getElementById('homeBtn'),
    resetBtn: document.getElementById('resetBtn'),

    // Flashcard elements
    flashcardPackSelection: document.getElementById('flashcardPackSelection'),
    packSelectionIntroText: document.getElementById('packSelectionIntroText'),
    packButtons: document.getElementById('packButtons'),
    backToMainMenuBtn: document.getElementById('backToMainMenuBtn'),
    flashcardContainer: document.getElementById('flashcardContainer'),
    flashcardLetter: document.getElementById('flashcardLetter'),
    flashcardPhonemeDescription: document.getElementById('flashcardPhonemeDescription'),
    flashcardAudioActions: document.getElementById('flashcardAudioActions'), // NEW
    flashcardActions: document.getElementById('flashcardActions'),
    gotItBtn: document.getElementById('gotItBtn'),
    needPracticeBtn: document.getElementById('needPracticeBtn'),
    flashcardProgress: document.getElementById('flashcardProgress'),

    // Blend Word elements
    blendBox: document.getElementById('blendBox'),
    blendText: document.getElementById('blendText'),
    wordChoices: document.getElementById('wordChoices'),

    // Build a Word elements
    buildWordTargetFlashcard: document.getElementById('buildWordTargetFlashcard'),
    buildWordDisplay: document.getElementById('buildWordDisplay'),
    letterPool: document.getElementById('letterPool'),
    clearBuildBtn: document.getElementById('clearBuildBtn'),
    deleteBuildBtn: document.getElementById('deleteBuildBtn'),
    checkBuildBtn: document.getElementById('checkBuildBtn'),
    buildActionsContainer: document.querySelector('.build-actions'), // Select the container

    // Picture-Word Matching elements
    pictureWordMatchingSection: document.getElementById('pictureWordMatchingSection'),
    pictureWordImage: document.getElementById('pictureWordImage'),
    pictureWordAudioActions: document.getElementById('pictureWordAudioActions'), // NEW
    pictureWordChoices: document.getElementById('pictureWordChoices'),
    pictureWordResetBtn: document.getElementById('pictureWordResetBtn'),

    // Tricky Word Sorting elements
    trickyWordSortingSection: document.getElementById('trickyWordSortingSection'),
    trickyZone: document.getElementById('trickyZone'),
    notTrickyZone: document.getElementById('notTrickyZone'),
    trickyWordPool: document.getElementById('trickyWordPool'),
    trickySortFeedback: document.getElementById('trickySortFeedback'),
    trickySortResetBtn: document.getElementById('trickySortResetBtn'),
    trickySortCheckBtn: document.getElementById('trickySortCheckBtn'),
    newTrickySortResetBtn: document.getElementById('newTrickySortResetBtn'), // New Reset Game button

    // Canvas Drawing Tracer elements
    canvasDrawingTracerSection: document.getElementById('canvasDrawingTracerSection'),
    letterCanvas: document.getElementById('letterCanvas'),
    clearCanvasBtn: document.getElementById('clearCanvasBtn'),
    nextLetterBtn: document.getElementById('nextLetterBtn'),

    // Game Complete elements
    gameComplete: document.getElementById('gameComplete'),
    finalMessage: document.getElementById('finalMessage'),
    playAgainBtn: document.getElementById('playAgainBtn'),
  };

  // Add Event Listeners
  elements.learnLettersBtn.addEventListener('click', () => showFlashcardPackSelection('letters'));
  elements.trickyWordsBtn.addEventListener('click', () => showFlashcardPackSelection('words')); // Tricky Words use 'words' type for pack selection

  elements.blendWordsBtn.addEventListener('click', () => startGame('words'));
  elements.buildWordBtn.addEventListener('click', () => startGame('build'));
  elements.pictureWordMatchBtn.addEventListener('click', () => startGame('pictureWordMatch'));
  elements.trickyWordSortBtn.addEventListener('click', () => startGame('trickyWordSort'));
  elements.canvasDrawingTracerBtn.addEventListener('click', () => startGame('canvasDrawingTracer'));

  // Common game action buttons
  elements.homeBtn.addEventListener('click', goHome);
  elements.resetBtn.addEventListener('click', () => {
      if (gameState.mode === 'words') {
          setupBlendMode();
      } else if (gameState.mode === 'build') {
          setupBuildMode();
      }
  });

  // Flashcard specific buttons
  elements.gotItBtn.addEventListener('click', () => processFlashcardResponseAndAdvance('gotIt'));
  elements.needPracticeBtn.addEventListener('click', () => processFlashcardResponseAndAdvance('needPractice'));
  elements.backToMainMenuBtn.addEventListener('click', goHome);

  // Build a Word specific buttons
  elements.clearBuildBtn.addEventListener('click', clearBuild);
  elements.deleteBuildBtn.addEventListener('click', deleteLastLetter);
  elements.checkBuildBtn.addEventListener('click', checkBuildWord);

  // Picture-Word Matching specific button
  elements.pictureWordResetBtn.addEventListener('click', loadNextPictureWord); // Reset button for P-W Match

  // Tricky Word Sorting specific buttons
  elements.trickySortResetBtn.addEventListener('click', resetTrickyWordSort);
  elements.trickySortCheckBtn.addEventListener('click', checkTrickyWordSort);
  elements.newTrickySortResetBtn.addEventListener('click', resetTrickyWordSort); // New reset button for consistency

  // Canvas Drawing Tracer specific buttons
  elements.clearCanvasBtn.addEventListener('click', clearCanvas);
  elements.nextLetterBtn.addEventListener('click', nextTracingLetter);


  // Game Complete screen button
  elements.playAgainBtn.addEventListener('click', goHome); // Go back to menu to choose again
}

function endGame(message) {
  elements.gameArea.classList.add('hidden');
  elements.gameComplete.classList.remove('hidden');
  elements.finalMessage.textContent = message;
}

// Initial call to set up event listeners once the DOM is ready
document.addEventListener('DOMContentLoaded', init);
console.log("DOMContentLoaded fired."); // Debugging log
