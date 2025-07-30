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
    image: 'https://via.placeholder.com/150x150/87CEEB/FFFFFF?text=SNAKE'
  },
  'a': {
    description: 'Open mouth, "ah" sound like in apple.',
    examples: [{ word: 'apple', emoji: '🍎' }, { word: 'ant', emoji: '🐜' }],
    image: 'https://via.placeholder.com/150x150/FF6347/FFFFFF?text=APPLE'
  },
  't': {
    description: 'Tap tongue behind teeth, quick "tuh" sound.',
    examples: [{ word: 'top', emoji: '⬆️' }, { word: 'ten', emoji: '🔟' }],
    image: 'https://via.placeholder.com/150x150/FFD700/000000?text=TIGER'
  },
  'p': {
    description: 'Pop lips together, quick "puh" sound.',
    examples: [{ word: 'pen', emoji: '🖊️' }, { word: 'pig', emoji: '🐷' }],
    image: 'https://via.placeholder.com/150x150/98FB98/000000?text=PIG'
  },
  'i': {
    description: 'Small smile, "ih" sound like in ink.',
    examples: [{ word: 'ink', emoji: '✒️' }, { word: 'igloo', emoji: '🧊' }],
    image: 'https://via.placeholder.com/150x150/ADD8E6/000000?text=IGLOO'
  },
  'n': {
    description: 'Tongue tip behind teeth, nose hums.',
    examples: [{ word: 'net', emoji: '🕸️' }, { word: 'nut', emoji: '🌰' }],
    image: 'https://via.placeholder.com/150x150/DDA0DD/000000?text=NEST'
  },
  'm': {
    description: 'Lips together, mouth closed, hum.',
    examples: [{ word: 'mat', emoji: '🧘' }, { word: 'moon', emoji: '🌕' }],
    image: 'https://via.placeholder.com/150x150/FFB6C1/000000?text=MOON'
  },
  'd': {
    description: 'Tap tongue behind teeth, quick "duh" sound.',
    examples: [{ word: 'dog', emoji: '🐶' }, { word: 'doll', emoji: '🎎' }],
    image: 'https://via.placeholder.com/150x150/8FBC8F/000000?text=DOG'
  },
  'g': {
    description: 'Back of tongue up, "guh" sound.',
    examples: [{ word: 'go', emoji: '➡️' }, { word: 'gap', emoji: '〰️' }],
    image: 'https://via.placeholder.com/150x150/B0E0E6/000000?text=GOAT'
  },
  'o': {
    description: 'Round mouth, short "oh" sound.',
    examples: [{ word: 'on', emoji: '🔛' }, { word: 'pot', emoji: '🍲' }],
    image: 'https://via.placeholder.com/150x150/FFDAB9/000000?text=ORANGE'
  },
  'c': {
    description: 'Back of tongue up, quick "kuh" sound.',
    examples: [{ word: 'cat', emoji: '🐱' }, { word: 'cup', emoji: '☕' }],
    image: 'https://via.placeholder.com/150x150/DDA0DD/000000?text=CAT'
  },
  'k': {
    description: 'Back of tongue up, quick "kuh" sound.',
    examples: [{ word: 'kid', emoji: '🧒' }, { word: 'kit', emoji: '🛠️' }],
    image: 'https://via.placeholder.com/150x150/FFDEAD/000000?text=KITE'
  },
  'ck': {
    description: 'Same as "k", two letters one sound.',
    examples: [{ word: 'duck', emoji: '🦆' }, { word: 'sock', emoji: '🧦' }],
    image: 'https://via.placeholder.com/150x150/F0E68C/000000?text=DUCK'
  },
  'e': {
    description: 'Relaxed mouth, short "eh" sound.',
    examples: [{ word: 'egg', emoji: '🥚' }, { word: 'red', emoji: '🔴' }],
    image: 'https://via.placeholder.com/150x150/F4A460/000000?text=EGG'
  },
  'u': {
    description: 'Short "uh" sound, like up.',
    examples: [{ word: 'up', emoji: '⬆️' }, { word: 'cup', emoji: '☕' }],
    image: 'https://via.placeholder.com/150x150/D8BFD8/000000?text=UMBRELLA'
  },
  'r': {
    description: 'Tongue curls back, "rrr" sound.',
    examples: [{ word: 'run', emoji: '🏃' }, { word: 'rat', emoji: '🐀' }],
    image: 'https://via.placeholder.com/150x150/C0C0C0/000000?text=RABBIT'
  },
  'h': {
    description: 'Quiet breath out of mouth.',
    examples: [{ word: 'hat', emoji: '🎩' }, { word: 'hen', emoji: '🐔' }],
    image: 'https://via.placeholder.com/150x150/FFDAB9/000000?text=HAT'
  },
  'b': {
    description: 'Lips together, puff of air, "buh" sound.',
    examples: [{ word: 'bat', emoji: '🏏' }, { word: 'bus', emoji: '🚌' }],
    image: 'https://via.placeholder.com/150x150/A2CD5A/000000?text=BALL'
  },
  'f': {
    description: 'Top teeth on lower lip, blow air.',
    examples: [{ word: 'fan', emoji: '🌬️' }, { word: 'fish', emoji: '🐠' }],
    image: 'https://via.placeholder.com/150x150/87CEFA/000000?text=FISH'
  },
  'ff': {
    description: 'Same as "f", two letters one sound.',
    examples: [{ word: 'puff', emoji: '💨' }, { word: 'off', emoji: '❌' }],
    image: 'https://via.placeholder.com/150x150/87CEFA/000000?text=FISH' // Same image as 'f'
  },
  'l': {
    description: 'Tongue tip behind top teeth, "llll" sound.',
    examples: [{ word: 'leg', emoji: '🦵' }, { word: 'lip', emoji: '👄' }],
    image: 'https://via.placeholder.com/150x150/F08080/000000?text=LEAF'
  },
  'll': {
    description: 'Same as "l", two letters one sound.',
    examples: [{ word: 'bell', emoji: '🔔' }, { word: 'fill', emoji: '💧' }],
    image: 'https://via.placeholder.com/150x150/F08080/000000?text=LEAF' // Same image as 'l'
  },
  'ss': {
    description: 'Same as "s", two letters one sound.',
    examples: [{ word: 'hiss', emoji: '🐍' }, { word: 'mess', emoji: ' messy' }],
    image: 'https://via.placeholder.com/150x150/87CEEB/FFFFFF?text=SNAKE' // Same image as 's'
  }
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
    
    // Clear Picture-Word Matching specific elements
    elements.pictureWordImage.classList.add('hidden');
    elements.pictureWordImage.src = '';
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
    } else { 
        elements.flashcardPhonemeDescription.textContent = gameState.currentFlashcardSetDescription || 'Try to remember this word!';
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
  Array.from(elements.pictureWordChoices.children).forEach(btn => btn.disabled = true);

  if (selectedWord === gameState.currentPictureWord.word) {
      elements.feedback.textContent = `🎉 Correct! ${gameState.currentPictureWord.emoji}`;
      chosenButton.classList.add('correct-feedback');
      gameState.score++;
      gameState.stars++;
      updateScore();
      updateStars();

      if (gameState.stars >= 10) {
          endGame("You earned 10 stars!");
          return;
      }
      

      setTimeout(() => {
          chosenButton.classList.remove('correct-feedback');
          loadNextPictureWord();
      }, 1500);
  } else {
      elements.feedback.textContent = '❌ Try again!';
      chosenButton.classList.add('incorrect-feedback');
      // Find and highlight the correct answer briefly
      const correctButton = elements.pictureWordChoices.querySelector(`[data-word="${gameState.currentPictureWord.word}"]`);
      if (correctButton) {
          correctButton.classList.add('correct-feedback');
      }

      setTimeout(() => {
          chosenButton.classList.remove('incorrect-feedback');
          if (correctButton) {
              correctButton.classList.remove('correct-feedback');
          }
          // Re-enable buttons if incorrect, so user can try again
          Array.from(elements.pictureWordChoices.children).forEach(btn => btn.disabled = false);
          elements.feedback.textContent = ''; // Clear feedback after showing it
      }, 1500);
  }
}

// --- NEW: TRICKY WORD SORTING GAME ---
function setupTrickyWordSorting() {
    clearBoard();
    gameState.mode = 'trickyWordSort';
    elements.prompt.innerHTML = 'Drag "Tricky Words" to the left box and "Not Tricky Words" to the right!';
    elements.trickyWordSortingSection.classList.remove('hidden');
    elements.trickySortResetBtn.classList.remove('hidden');
    elements.trickySortCheckBtn.classList.remove('hidden'); // Ensure button is visible
    elements.newTrickySortResetBtn.classList.remove('hidden'); // Show new reset button
    elements.trickySortCheckBtn.disabled = true; // Explicitly disable at start


    updateScore();
    updateStars();

    // Select 3 tricky and 3 not tricky words
    const selectedTricky = shuffleArray([...trickyWordsData.tricky]).slice(0, 3);
    const selectedNotTricky = shuffleArray([...trickyWordsData.notTricky]).slice(0, 3);

    // Combine and shuffle for the pool
    const allWordsForRound = [
        ...selectedTricky.map(word => ({ word, type: 'tricky' })),
        ...selectedNotTricky.map(word => ({ word, type: 'notTricky' }))
    ];
    gameState.trickySortWords = shuffleArray(allWordsForRound);


    renderTrickyWordPool();
    renderSortZones(); // Initial render of empty zones
}

function renderTrickyWordPool() {
    elements.trickyWordPool.innerHTML = '';
    gameState.trickySortWords.forEach(wordObj => {
        const wordElement = document.createElement('div');
        wordElement.classList.add('sortable-word');
        wordElement.textContent = wordObj.word;
        wordElement.setAttribute('draggable', true);
        wordElement.dataset.word = wordObj.word;
        wordElement.dataset.type = wordObj.type;
        wordElement.addEventListener('dragstart', handleTrickyWordDragStart);
        elements.trickyWordPool.appendChild(wordElement);
    });
}

function renderSortZones() {
    // Clear existing content but keep headers
    elements.trickyZone.querySelector('.words-container').innerHTML = '';
    elements.notTrickyZone.querySelector('.words-container').innerHTML = '';

    // Re-attach drag listeners to zones (still on the main sort-zone)
    elements.trickyZone.addEventListener('dragover', handleTrickyWordDragOver);
    elements.trickyZone.addEventListener('dragleave', handleTrickyWordDragLeave);
    elements.trickyZone.addEventListener('drop', handleTrickyWordDrop);
    elements.notTrickyZone.addEventListener('dragover', handleTrickyWordDragOver);
    elements.notTrickyZone.addEventListener('dragleave', handleTrickyWordDragLeave);
    elements.notTrickyZone.addEventListener('drop', handleTrickyWordDrop);
}

function handleTrickyWordDragStart(e) {
    // Ensure the target is a sortable word and has dataset properties
    if (e.target && e.target.classList.contains('sortable-word') && e.target.dataset.word && e.target.dataset.type) {
        draggedTrickyWordElement = e.target; // Set global reference
        e.dataTransfer.setData('text/plain', e.target.dataset.word);
        e.dataTransfer.setData('text/word-type', e.target.dataset.type); // Store the type as well
        e.dataTransfer.effectAllowed = 'move';
    } else {
        e.preventDefault(); // Prevent dragging if it's not a valid sortable word
        draggedTrickyWordElement = null; // Ensure it's null if drag is invalid
    }
}

function handleTrickyWordDragOver(e) {
    e.preventDefault();
    e.target.closest('.sort-zone').classList.add('drag-over');
}

function handleTrickyWordDragLeave(e) {
    e.target.closest('.sort-zone').classList.remove('drag-over');
}

function handleTrickyWordDrop(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.sort-zone');
    if (!dropZone) {
        return;
    }
    dropZone.classList.remove('drag-over');

    // Use the globally stored dragged element for its data and removal
    if (!draggedTrickyWordElement) {
        return;
    }

    const word = draggedTrickyWordElement.dataset.word;
    const wordType = draggedTrickyWordElement.dataset.type; 

    if (!word || !wordType) {
        return;
    }

    // Remove the original element from its previous parent
    if (draggedTrickyWordElement.parentNode) {
        draggedTrickyWordElement.parentNode.removeChild(draggedTrickyWordElement);
    }

    // Create a new element for the dropped word in the target zone
    const newWordElement = document.createElement('div');
    newWordElement.classList.add('sortable-word');
    newWordElement.textContent = word;
    newWordElement.setAttribute('draggable', true);
    newWordElement.dataset.word = word;
    newWordElement.dataset.type = wordType;
    newWordElement.addEventListener('dragstart', handleTrickyWordDragStart); // Re-attach dragstart listener
    
    // Append to the inner words-container
    dropZone.querySelector('.words-container').appendChild(newWordElement);

    elements.trickySortFeedback.textContent = ''; // Clear feedback on drag
    
    // Check if the word pool is empty after the drop and update prompt/button state
    if (elements.trickyWordPool.children.length === 0) {
        elements.prompt.textContent = 'All words sorted! Click "Check My Sort" to see how you did.';
        elements.trickySortCheckBtn.disabled = false; // Enable the button
    } else {
        elements.prompt.textContent = 'Drag "Tricky Words" to the left box and "Not Tricky Words" to the right!';
        elements.trickySortCheckBtn.disabled = true; // Disable if words remain
    }
    
}

function checkTrickyWordSort() {
    let allCorrect = true;
    // Query words from within the .words-container
    let wordsInTrickyZone = Array.from(elements.trickyZone.querySelector('.words-container').querySelectorAll('.sortable-word'));
    let wordsInNotTrickyZone = Array.from(elements.notTrickyZone.querySelector('.words-container').querySelectorAll('.sortable-word'));
    let incorrectWords = [];

    // Corrected logic: Check against the element's own dataset.type
    wordsInTrickyZone.forEach(wordEl => {
        if (wordEl.dataset.type !== 'tricky') { // Check the element's own type
            allCorrect = false;
            incorrectWords.push(wordEl);
        }
    });
    wordsInNotTrickyZone.forEach(wordEl => {
        if (wordEl.dataset.type !== 'notTricky') { // Check the element's own type
            allCorrect = false;
            incorrectWords.push(wordEl);
        }
    });
    
    // Check if any words are still in the pool (shouldn't be if button is enabled, but for robustness)
    if (elements.trickyWordPool.children.length > 0) {
        allCorrect = false;
    }

    // If there are incorrect words or words in the pool, move incorrect ones back
    if (!allCorrect) {
        elements.trickySortFeedback.textContent = '❌ Some words were moved back. Try again!';
        elements.trickySortFeedback.classList.remove('correct');
        elements.trickySortFeedback.classList.add('incorrect');

        // Move incorrect words back to the pool
        incorrectWords.forEach(wordEl => {
            wordEl.remove(); // Remove from current zone
            // Re-add to the pool
            const newWordElement = document.createElement('div');
            newWordElement.classList.add('sortable-word');
            newWordElement.textContent = wordEl.dataset.word;
            newWordElement.setAttribute('draggable', true);
            newWordElement.dataset.word = wordEl.dataset.word;
            newWordElement.dataset.type = wordEl.dataset.type; // Preserve original type
            newWordElement.addEventListener('dragstart', handleTrickyWordDragStart);
            elements.trickyWordPool.appendChild(newWordElement);
        });
        
        // Re-enable the check button, as words are back in the pool for another attempt
        elements.trickySortCheckBtn.disabled = false;
        elements.prompt.textContent = 'Drag "Tricky Words" to the left box and "Not Tricky Words" to the right!';
        

    } else { // All correct
        elements.trickySortFeedback.textContent = '🎉 Great job! All words sorted correctly!';
        elements.trickySortFeedback.classList.remove('incorrect');
        elements.trickySortFeedback.classList.add('correct');
        gameState.score++;
        gameState.stars++;
        updateScore();
        updateStars();

        if (gameState.stars >= 10) {
            endGame("You earned 10 stars!");
            return;
        }
        

        setTimeout(setupTrickyWordSorting, 2000); // Load new set of words after a delay
    }
}


function endGame(message) {
  elements.gameArea.classList.add('hidden');
  elements.gameComplete.classList.remove('hidden');
  elements.finalMessage.textContent = message;
  
  // Remove existing specific play again buttons to avoid duplicates
  let existingChooseAnotherPack = elements.gameComplete.querySelector('.choose-another-pack-btn');
  if (existingChooseAnotherPack) {
      existingChooseAnotherPack.remove();
  }
  let existingChooseAnotherGame = elements.gameComplete.querySelector('.choose-another-game-btn');
  if (existingChooseAnotherGame) {
      existingChooseAnotherGame.remove();
  }

  // Set playAgainBtn text and action based on the current game mode
  let playAgainText = 'Play Again';
  let playAgainAction = () => goHome(); // Default to home

  if (gameState.mode === 'words') {
      playAgainText = 'Play Blend SATPIN Words Again';
      playAgainAction = () => startGame('words');
  } else if (gameState.mode === 'build') {
      playAgainText = 'Play Build a Word Again';
      playAgainAction = () => startGame('build');
  } else if (gameState.mode === 'pictureWordMatch') {
      playAgainText = 'Play Picture-Word Match Again';
      playAgainAction = () => startGame('pictureWordMatch');
  } else if (gameState.mode === 'trickyWordSort') { // Specific for tricky word sort
      playAgainText = 'Play Tricky Word Sort Again';
      playAgainAction = () => startGame('trickyWordSort');
  } else if (gameState.mode === 'canvasDrawingTracer') {
      playAgainText = 'Play Trace Letters Again';
      playAgainAction = () => startGame('canvasDrawingTracer');
  } else if (gameState.mode === 'flashcards') {
      // For flashcards, it should go back to pack selection or home
      playAgainText = `Play ${gameState.currentFlashcardSetName || 'Flashcards'} Again`;
      playAgainAction = () => showFlashcardPackSelection(gameState.packSelectionType);
      if (!gameState.packSelectionType) { // Fallback if type not set
          playAgainAction = () => goHome();
      }
  }
  
  elements.playAgainBtn.textContent = playAgainText; 
  elements.playAgainBtn.onclick = playAgainAction;

  const chooseAnotherGameBtn = document.createElement('button');
  chooseAnotherGameBtn.className = 'play-again choose-another-game-btn';
  chooseAnotherGameBtn.textContent = 'Choose Another Game';
  chooseAnotherGameBtn.onclick = () => goHome();
  elements.gameComplete.appendChild(chooseAnotherGameBtn);
}

// --- CANVAS DRAWING TRACER FUNCTIONS (GLOBAL) ---
function setupCanvasDrawingTracer() {
    clearBoard();
    gameState.mode = 'canvasDrawingTracer';
    elements.prompt.textContent = 'Trace the letter with your finger or mouse!';
    elements.canvasDrawingTracerSection.classList.remove('hidden');
    elements.letterCanvas.classList.remove('hidden'); // Ensure canvas is visible
    elements.clearCanvasBtn.classList.remove('hidden');
    elements.nextLetterBtn.classList.remove('hidden');

    updateScore();
    updateStars();

    // Initialize canvas context if not already done
    if (!gameState.canvasCtx) {
        gameState.canvasCtx = elements.letterCanvas.getContext('2d');
        addCanvasEventListeners();
    }
    
    // Initialize letters to trace list (reverted to text-based)
    const singleLetters = allPhase2Letters.filter(letter => letter.length === 1);
    gameState.lettersToTrace = shuffleArray(singleLetters);

    // Ensure font is loaded before attempting to draw
    document.fonts.ready.then(() => {
        // Use a small timeout to allow browser to render the canvas element after it becomes visible
        setTimeout(() => {
            resizeCanvas(); // Call resize after fonts are confirmed loaded and canvas is rendered
            loadLetterToTrace();
        }, 50); // Small delay
    }).catch(err => {
        console.error('Font loading failed:', err); // Debugging log
        // Fallback if font fails to load
        setTimeout(() => {
            resizeCanvas();
            loadLetterToTrace();
        }, 50);
    });
}

function resizeCanvas() {
    const canvas = elements.letterCanvas;
    // Get the actual rendered dimensions of the canvas element
    const displayWidth = canvas.offsetWidth;
    const displayHeight = canvas.offsetHeight;

    // Set the internal drawing buffer size to match the display size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    
    console.log(`Canvas resized. Internal: ${canvas.width}x${canvas.height}, Display: ${displayWidth}x${displayHeight}`); // Debugging log
    // Redraw the faded letter after resize
    drawFadedLetter(gameState.currentTracingLetter);
}

function addCanvasEventListeners() {
    const canvas = elements.letterCanvas;
    const ctx = gameState.canvasCtx;

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent scrolling
        startDrawing(e.touches[0]);
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scrolling
        draw(e.touches[0]);
    }, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    // Calculate coordinates relative to the canvas's display size
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    // Scale coordinates from display pixels to internal canvas pixels
    // This is crucial if canvas.width/height (internal) differs from rect.width/height (display)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const scaledX = x * scaleX;
    const scaledY = y * scaleY; 
    return { x: scaledX, y: scaledY };
}

function startDrawing(e) {
    gameState.isDrawing = true;
    const pos = getMousePos(elements.letterCanvas, e);
    gameState.lastX = pos.x;
    gameState.lastY = pos.y;
    gameState.hasDrawnOnCanvas = true; // Mark that drawing has started
    // Start a new path for each new drawing stroke
    gameState.canvasCtx.beginPath();
    gameState.canvasCtx.moveTo(gameState.lastX, gameState.lastY);
}

function draw(e) {
    if (!gameState.isDrawing) return;
    const ctx = gameState.canvasCtx;
    const pos = getMousePos(elements.letterCanvas, e);

    // Use quadraticCurveTo for smoother lines
    ctx.quadraticCurveTo(gameState.lastX, gameState.lastY, (gameState.lastX + pos.x) / 2, (gameState.lastY + pos.y) / 2);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-drawing-color');
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    gameState.lastX = pos.x;
    gameState.lastY = pos.y;
}

function stopDrawing() {
    gameState.isDrawing = false;
}

function loadLetterToTrace() {
    // Check if there are letters left in the queue
    if (gameState.lettersToTrace.length === 0) {
        endGame("You've traced all the letters!");
        // Re-initialize for next game
        const singleLetters = allPhase2Letters.filter(letter => letter.length === 1);
        gameState.lettersToTrace = shuffleArray(singleLetters);
        return;
    }
    
    // Get the next letter from the queue
    gameState.currentTracingLetter = gameState.lettersToTrace.shift();
    
    clearCanvasDrawing(); // Clear user drawing and redraw faded letter
    gameState.hasDrawnOnCanvas = false; // Reset drawing flag for new letter
    elements.feedback.textContent = ''; // Clear feedback
}

function drawFadedLetter(letter) {
    const ctx = gameState.canvasCtx;
    const canvas = elements.letterCanvas;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear everything first

    ctx.save(); // Save current context state
    ctx.globalAlpha = 0.7; 
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    
    // Set font to 80% of canvas height for better fit
    const fontSize = canvas.height * 0.8; 
    const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--main-font');
    ctx.font = `${fontSize}px ${fontFamily}`; 
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2);
    ctx.restore(); // Restore context state (resets globalAlpha)
}

function clearCanvasDrawing() {
    const ctx = gameState.canvasCtx;
    const canvas = elements.letterCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFadedLetter(gameState.currentTracingLetter); // Redraw the faded letter
    elements.feedback.textContent = '';
    gameState.hasDrawnOnCanvas = false; // Reset drawing flag
}

function nextTracingLetter() {
    if (gameState.hasDrawnOnCanvas) {
        elements.feedback.textContent = '🎉 Great tracing!';
        elements.feedback.classList.remove('incorrect');
        elements.feedback.classList.add('correct');
        gameState.score++;
        gameState.stars++;
        updateScore();
        updateStars();
        setTimeout(() => {
            loadLetterToTrace();
        }, 1000); // Short delay before next letter
    } else {
        elements.feedback.textContent = 'Please trace the letter first!';
        elements.feedback.classList.remove('correct');
        elements.feedback.classList.add('incorrect');
    }
}


document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded fired."); // Debugging log
  // --- DOM ELEMENTS (INITIALIZED ON DOMContentLoaded) ---
  elements = { // Assign to the globally declared elements object
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

  // --- EVENT LISTENERS (ATTACHED ON DOMContentLoaded) ---
  elements.learnLettersBtn.addEventListener('click', () => { console.log('Learn Letters clicked'); showFlashcardPackSelection('letters'); });
  elements.blendWordsBtn.addEventListener('click', () => { console.log('Blend Words clicked'); startGame('words'); });
  elements.buildWordBtn.addEventListener('click', () => { console.log('Build Word clicked'); startGame('build'); });
  elements.trickyWordsBtn.addEventListener('click', () => { console.log('Tricky Words clicked'); showFlashcardPackSelection('trickyWords'); }); 
  elements.pictureWordMatchBtn.addEventListener('click', () => { console.log('Picture-Word Match clicked'); startGame('pictureWordMatch'); }); 
  elements.trickyWordSortBtn.addEventListener('click', () => { console.log('Tricky Word Sort clicked'); startGame('trickyWordSort'); }); 
  elements.canvasDrawingTracerBtn.addEventListener('click', () => { console.log('Trace Letters clicked'); startGame('canvasDrawingTracer'); });
  elements.homeBtn.addEventListener('click', goHome); 

  elements.resetBtn.addEventListener('click', () => {
    if (gameState.mode === 'words') {
      gameState.blended = '';
      elements.blendText.textContent = gameState.blended.split('').join(' ');
      const letterButtons = elements.blendBox.querySelectorAll('.letter');
      letterButtons.forEach(button => {
          button.classList.remove('blended-active');
          button.disabled = false; 
      });
      toggleBlendingControls(true); 
    } else if (gameState.mode === 'build') {
      setupBuildMode(); 
    }
  });

  elements.gotItBtn.addEventListener('click', () => processFlashcardResponseAndAdvance('gotIt'));
  elements.needPracticeBtn.addEventListener('click', () => processFlashcardResponseAndAdvance('needPractice'));

  elements.backToMainMenuBtn.addEventListener('click', goHome);

  elements.clearBuildBtn.addEventListener('click', clearBuild);
  elements.deleteBuildBtn.addEventListener('click', deleteLastLetter); 
  elements.checkBuildBtn.addEventListener('click', checkBuildWord);

  elements.pictureWordResetBtn.addEventListener('click', setupPictureWordMatching); 
  elements.trickySortResetBtn.addEventListener('click', setupTrickyWordSorting); 
  elements.trickySortCheckBtn.addEventListener('click', checkTrickyWordSort); 
  elements.newTrickySortResetBtn.addEventListener('click', setupTrickyWordSorting);

  elements.clearCanvasBtn.addEventListener('click', clearCanvasDrawing);
  elements.nextLetterBtn.addEventListener('click', nextTracingLetter);

  // Add a global dragend listener to reset draggedTrickyWordElement
  document.addEventListener('dragend', () => {
      draggedTrickyWordElement = null; // Clear the reference after drag operation
  });

  // Add window resize listener for canvas, only if canvas is active
  window.addEventListener('resize', () => {
      if (gameState.mode === 'canvasDrawingTracer' && elements.letterCanvas) {
          resizeCanvas();
      }
  });

  // Call goHome on initial load to ensure the main menu is visible
  goHome();
  
});

