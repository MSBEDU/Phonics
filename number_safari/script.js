document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const appContainer = document.querySelector('.app-container');
    const activityHub = document.getElementById('activity-hub');
    const backToHubButtons = document.querySelectorAll('.back-to-hub');
    const activityButtons = document.querySelectorAll('.activity-buttons button');

    // Counting Game Elements
    const countingGameScreen = document.getElementById('counting-game');
    const countingInstructionText = document.getElementById('counting-instruction-text');
    const countingObjectNameSpan = document.getElementById('counting-object-name');
    const countingStartGameButton = document.getElementById('counting-start-game');
    const countingGameArea = document.querySelector('.counting-area');
    const countingFeedbackMessage = document.getElementById('counting-feedback-message');
    const countingNextRoundButton = document.getElementById('counting-next-round');
    // NEW DOM Elements for Counting Game
    const countingNumberChoices = document.getElementById('counting-number-choices'); // For number selection
    const countingStreakDisplay = document.getElementById('counting-streak-display'); // For streak display

    // Patterns Game Elements
    const patternsGameScreen = document.getElementById('patterns-game');
    const patternsInstructionText = document.getElementById('patterns-instruction-text');
    const patternsStartGameButton = document.getElementById('patterns-start-game');
    const patternsPatternArea = document.querySelector('.pattern-area');
    const patternsChoicesArea = document.querySelector('.choices-area');
    const patternsFeedbackMessage = document.getElementById('patterns-feedback-message');
    const patternsNextRoundButton = document.getElementById('patterns-next-round');

    // Number Recognition Game Elements
    const recognitionGameScreen = document.getElementById('recognition-game');
    const recognitionInstructionText = document.getElementById('recognition-instruction-text');
    const recognitionTargetNumberText = document.getElementById('recognition-target-number-text');
    const recognitionStartGameButton = document.getElementById('recognition-start-game');
    const recognitionGameArea = document.querySelector('.recognition-area');
    const recognitionFeedbackMessage = document.getElementById('recognition-feedback-message');
    const recognitionNextRoundButton = document.getElementById('recognition-next-round');

    // Number Tracing/Match Game Elements
    const tracingGameScreen = document.getElementById('tracing-game');
    const tracingInstructionText = document.getElementById('tracing-instruction-text');
    const tracingStartGameButton = document.getElementById('tracing-start-game');
    const tracingGameArea = document.querySelector('.tracing-area');
    const tracingTargetNumberShape = document.querySelector('.target-number-shape');
    const tracingChoicesArea = document.querySelector('.tracing-choices');
    const tracingFeedbackMessage = document.getElementById('tracing-feedback-message');
    const tracingNextRoundButton = document.getElementById('tracing-next-round');

// Add this new listener somewhere within your document.addEventListener('DOMContentLoaded', () => { ... });
countingStartGameButton.addEventListener('click', () => {
    countingGame.startGame();
});
    // --- Assets ---
    const assets = {
        images: {
            counting: [
                { id: 'acorn', src: 'assets/images/counting/acorn.png', name: 'acorn' },
                { id: 'butterfly', src: 'assets/images/counting/butterfly.png', name: 'butterfly' },
                { id: 'flower', src: 'assets/images/counting/flower.png', name: 'flower' },
                { id: 'star', src: 'assets/images/counting/star.png', name: 'star' },
            ],
            patterns: [
                { id: 'red_circle', src: 'assets/images/patterns/red_circle.png', name: 'Red Circle' },
                { id: 'blue_square', src: 'assets/images/patterns/blue_square.png', name: 'Blue Square' },
                { id: 'yellow_triangle', src: 'assets/images/patterns/yellow_triangle.png', name: 'Yellow Triangle' },
                { id: 'green_star', src: 'assets/images/patterns/green_star.png', name: 'Green Star' },
                { id: 'purple_flower', src: 'assets/images/patterns/purple_flower.png', name: 'Purple Flower' },
            ],
            numbers: { // For recognition and tracing
                '1': { src: 'assets/images/numbers/number_1.png', name: 'one' },
                '2': { src: 'assets/images/numbers/number_2.png', name: 'two' },
                '3': { src: 'assets/images/numbers/number_3.png', name: 'three' },
                '4': { src: 'assets/images/numbers/number_4.png', name: 'four' },
                '5': { src: 'assets/images/numbers/number_5.png', name: 'five' },
                // Add images for numbers up to 10 if desired (and put them in assets/images/numbers/)
            }
        },
        audio: {
            numbers: {
                1: new Audio('assets/audio/numbers/one.mp3'),
                2: new Audio('assets/audio/numbers/two.mp3'),
                3: new Audio('assets/audio/numbers/three.mp3'),
                4: new Audio('assets/audio/numbers/four.mp3'),
                5: new Audio('assets/audio/numbers/five.mp3'),
                // Add audio for numbers up to 10 (and put them in assets/audio/numbers/)
            },
            success: new Audio('assets/audio/great_job.mp3'),
            tryAgain: new Audio('assets/audio/try_again.mp3'),
            correctDing: new Audio('assets/audio/correct_ding.mp3'),
            incorrectBuzz: new Audio('assets/audio/incorrect_buzz.mp3')
        }
    };

    // --- Utility Functions ---
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Game Manager ---
    const gameManager = {
        currentScreen: activityHub,
        showScreen(screenElement) {
            // Hide current screen
            this.currentScreen.classList.remove('active');
            // Use a slight delay to allow transition to start before hiding
            setTimeout(() => {
                this.currentScreen.classList.add('hidden');
                // Show new screen
                screenElement.classList.remove('hidden');
                // Force reflow to ensure transition plays
                void screenElement.offsetWidth;
                screenElement.classList.add('active');
                this.currentScreen = screenElement;
            }, 500); // Match CSS transition duration
        },
        initActivity(activityName) {
            switch (activityName) {
                case 'counting':
                    this.showScreen(countingGameScreen);
                    // Reset streak if starting new session
                    countingGame.currentStreak = 0;
                    countingGame.streakMessageElement.textContent = countingGame.currentStreak;
                    break;
                case 'patterns':
                    this.showScreen(patternsGameScreen);
                    patternsGame.startGame();
                    break;
                case 'recognition':
                    this.showScreen(recognitionGameScreen);
                    numberRecognitionGame.startGame();
                    break;
                case 'tracing':
                    this.showScreen(tracingGameScreen);
                    numberTracingGame.startGame();
                    break;
                default:
                    console.error('Unknown activity:', activityName);
                    break;
            }
        },
        backToHub() {
            this.showScreen(activityHub);
            // Optionally reset game states here if needed, e.g., stop audio
        }
    };

    // --- Counting Game Logic ---
const countingGame = {
    currentCount: 0,
    targetCount: 0,
    selectedObject: null,
    clickedObjects: new Set(),
    MAX_COUNT_NUMBER: 5, // Max number to count
    currentStreak: 0, // NEW: Current streak counter
    targetStreak: 10, // NEW: Target streak for mastery
    streakMessageElement: countingStreakDisplay, // Reference to the streak display element

    startGame() {
        countingStartGameButton.classList.add('hidden');
        countingNextRoundButton.classList.add('hidden');
        countingFeedbackMessage.textContent = '';
        this.currentCount = 0;
        this.clickedObjects.clear();
        countingGameArea.innerHTML = ''; // Clear previous objects
        countingNumberChoices.innerHTML = ''; // NEW: Clear number choices
        countingNumberChoices.classList.add('hidden'); // NEW: Hide choices

        this.targetCount = getRandomInt(1, this.MAX_COUNT_NUMBER);
        this.selectedObject = assets.images.counting[getRandomInt(0, assets.images.counting.length - 1)];

        countingObjectNameSpan.textContent = this.selectedObject.name; // Use full name for instruction
        countingInstructionText.innerHTML = `How many <span id="counting-object-name" style="color:#E91E63;">${this.selectedObject.name}s</span> can you find and count?`;

        // Generate and place objects
        // Use a slight delay to ensure gameArea dimensions are stable
        setTimeout(() => {
            const gameAreaRect = countingGameArea.getBoundingClientRect();
            console.log('countingGameArea Bounding Rect:', gameAreaRect); // ADDED: Console log for debugging

            // Create a dummy image to get its *actual* rendered dimensions
            // before creating all the others
            const dummyImg = document.createElement('img');
            dummyImg.src = this.selectedObject.src;
            dummyImg.classList.add('object-to-count');
            dummyImg.style.visibility = 'hidden'; // Don't show it
            dummyImg.style.position = 'absolute'; // Don't affect layout
            countingGameArea.appendChild(dummyImg); // Temporarily add to DOM to get dimensions

            const objectWidth = dummyImg.offsetWidth;
            const objectHeight = dummyImg.offsetHeight;
            countingGameArea.removeChild(dummyImg); // Remove the dummy image

            console.log('Object Width:', objectWidth, 'Object Height:', objectHeight); // ADDED: Console log for debugging

            const safetyMargin = 10; // Add a small buffer from the edges

            const maxX = gameAreaRect.width - objectWidth - safetyMargin;
            const maxY = gameAreaRect.height - objectHeight - safetyMargin;

            // Ensure max values are not negative
            const finalMaxX = Math.max(0, maxX);
            const finalMaxY = Math.max(0, maxY);

            console.log('Final Max X:', finalMaxX, 'Final Max Y:', finalMaxY); // ADDED: Console log for debugging

            // Store positions of already placed objects for collision detection
            const placedObjects = [];

            for (let i = 0; i < this.targetCount; i++) {
                const img = document.createElement('img');
                img.src = this.selectedObject.src;
                img.classList.add('object-to-count');
                img.dataset.id = i;

                // NEW: Random size and rotation (Idea #5)
                const randomScale = getRandomInt(80, 120) / 100; // 0.8 to 1.2 scale
                const randomRotate = getRandomInt(-20, 20); // -20 to 20 degrees rotation
                img.style.transform = `scale(${randomScale}) rotate(${randomRotate}deg)`;
                img.style.transformOrigin = 'center center'; // Ensure rotation around center

                let newLeft, newTop;
                let collision;
                let attempts = 0;
                const maxAttempts = 500; // Limit attempts to prevent infinite loops on dense layouts

                do {
                    collision = false;
                    newLeft = getRandomInt(0, finalMaxX);
                    newTop = getRandomInt(0, finalMaxY);

                    // Check for collision with already placed objects (AABB collision detection)
                    for (const placed of placedObjects) {
                        // Account for potential scaling when checking collision
                        const placedObjectRenderedWidth = placed.width * placed.scale;
                        const placedObjectRenderedHeight = placed.height * placed.scale;
                        const newObjectRenderedWidth = objectWidth * randomScale;
                        const newObjectRenderedHeight = objectHeight * randomScale;

                        if (newLeft < placed.left + placedObjectRenderedWidth &&
                            newLeft + newObjectRenderedWidth > placed.left &&
                            newTop < placed.top + placedObjectRenderedHeight &&
                            newTop + newObjectRenderedHeight > placed.top) {
                            collision = true;
                            break; // Found a collision, break and try new position
                        }
                    }
                    attempts++;
                } while (collision && attempts < maxAttempts); // Keep trying until no collision or max attempts reached

                if (attempts >= maxAttempts) {
                    console.warn('Could not place object without overlap after max attempts. Placing anyway.');
                    // If it's too hard to place without overlap, it might still overlap a little
                }

                img.style.left = newLeft + 'px';
                img.style.top = newTop + 'px';

                img.addEventListener('click', (e) => this.handleObjectClick(e));
                countingGameArea.appendChild(img);

                // Store the position and *applied* size (including scale) of this newly placed object
                placedObjects.push({
                    left: newLeft,
                    top: newTop,
                    width: objectWidth,
                    height: objectHeight,
                    scale: randomScale // Store scale for accurate collision checks
                });
            }
        }, 300); // Increased delay to 300ms for potentially more stable DOM calculations
    },

    handleObjectClick(event) {
        const objectId = event.target.dataset.id;

        if (this.clickedObjects.has(objectId)) {
            return; // Already clicked, ignore
        }

        this.currentCount++;
        this.clickedObjects.add(objectId);
        event.target.classList.add('clicked'); // Add visual feedback

        // Play number sound
        if (assets.audio.numbers[this.currentCount]) {
            // Clone node to allow multiple rapid plays
            assets.audio.numbers[this.currentCount].cloneNode(true).play();
        }

        // Check for completion or error
        if (this.currentCount === this.targetCount) {
            // Correct count!
            // Play final number audio
            if (assets.audio.numbers[this.currentCount]) {
                assets.audio.numbers[this.currentCount].cloneNode(true).play();
            }

            setTimeout(() => {
                // Hide objects and prompt for number selection
                countingGameArea.innerHTML = ''; // Clear objects
                countingFeedbackMessage.textContent = 'How many did you count? Select the correct number!';
                this.presentNumberChoices(); // NEW: Call function to show choices
            }, 700); // Small delay for number audio to finish
        } else if (this.currentCount > this.targetCount) {
            // Too many clicked
            countingFeedbackMessage.textContent = `Oops! You counted too many. Try again!`;
            assets.audio.tryAgain.cloneNode(true).play();
            this.handleIncorrectAnswer(); // NEW: Reset streak on overcount
            setTimeout(() => this.startGame(), 2000); // Restart the game after a short delay
        }
    },

    // NEW: Method to present number choices
    presentNumberChoices() {
        countingNumberChoices.classList.remove('hidden');
        countingNumberChoices.innerHTML = ''; // Clear previous choices

        let choices = new Set();
        choices.add(this.targetCount); // Always include the correct answer

        // Add distractors (e.g., 2 other random numbers)
        while (choices.size < 3) { // You can adjust how many choices to show (e.g., 3, 4, 5)
            let randomNum = getRandomInt(1, this.MAX_COUNT_NUMBER);
            // Ensure distractors are not the target and not already in choices
            if (randomNum !== this.targetCount) {
                choices.add(randomNum);
            }
        }
        let choicesArray = Array.from(choices);
        shuffleArray(choicesArray); // Shuffle to randomize order

        choicesArray.forEach(num => {
            const button = document.createElement('button');
            button.classList.add('number-choice-button'); // Add a class for styling
            button.textContent = num;
            button.dataset.number = num; // Store the number
            button.addEventListener('click', (e) => this.handleNumberChoiceClick(e));
            countingNumberChoices.appendChild(button);
        });
    },

    // NEW: Method to handle number choice click
    handleNumberChoiceClick(event) {
        const selectedNumber = parseInt(event.target.dataset.number);

        // Disable all buttons to prevent multiple clicks
        document.querySelectorAll('.number-choice-button').forEach(btn => btn.disabled = true);

        if (selectedNumber === this.targetCount) {
            event.target.classList.add('correct');
            countingFeedbackMessage.textContent = 'Excellent! That\'s correct!';
            assets.audio.success.cloneNode(true).play();
            this.handleCorrectAnswer(); // NEW: Handle streak logic
        } else {
            event.target.classList.add('incorrect');
            countingFeedbackMessage.textContent = `Not quite! The correct number was ${this.targetCount}.`;
            assets.audio.incorrectBuzz.cloneNode(true).play();
            this.handleIncorrectAnswer(); // NEW: Handle streak logic
        }

        // Hide choices and show next round button after a delay
        setTimeout(() => {
            countingNumberChoices.classList.add('hidden');
            countingNumberChoices.innerHTML = ''; // Clear choices
            countingNextRoundButton.classList.remove('hidden');
        }, 1500); // Small delay before showing next round button
    },

    // NEW: Handle streak increment
    handleCorrectAnswer() {
        this.currentStreak++;
        this.streakMessageElement.textContent = this.currentStreak;
        if (this.currentStreak >= this.targetStreak) {
            countingFeedbackMessage.textContent = `Amazing! You got ${this.targetStreak} in a row!`;
            // Play a special celebratory sound or animation for achieving streak
            assets.audio.success.cloneNode(true).play(); // Play success again for streak completion
            setTimeout(() => {
                this.currentStreak = 0; // Reset for next mastery session
                this.streakMessageElement.textContent = this.currentStreak;
                countingStartGameButton.textContent = "Play Again!"; // Change button text
                countingStartGameButton.classList.remove('hidden');
                countingNextRoundButton.classList.add('hidden'); // Hide regular next round
            }, 2000); // Longer delay for celebration
        }
    },

    // NEW: Handle streak reset
    handleIncorrectAnswer() {
        this.currentStreak = 0; // Reset streak on incorrect answer
        this.streakMessageElement.textContent = this.currentStreak;
    }
};

    // --- Patterns Game Logic ---
    const patternsGame = {
        currentPattern: [],
        patternSolution: [],
        emptySlots: [],
        filledSlots: new Set(),
        draggedItemData: null,

        startGame() {
            patternsStartGameButton.classList.add('hidden');
            patternsNextRoundButton.classList.add('hidden');
            patternsFeedbackMessage.textContent = '';
            patternsPatternArea.innerHTML = '';
            patternsChoicesArea.innerHTML = '';
            this.emptySlots = [];
            this.filledSlots.clear();

            const { currentPattern: initialPattern, solution, uniqueItemsUsed } = this.generatePattern();
            this.patternSolution = solution;

            // Display initial pattern elements
            initialPattern.forEach(item => {
                const patternItemDiv = document.createElement('div');
                patternItemDiv.classList.add('pattern-item');
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.name;
                patternItemDiv.appendChild(img);
                patternsPatternArea.appendChild(patternItemDiv);
            });

            // Create empty slots
            for (let i = 0; i < this.patternSolution.length; i++) {
                const emptySlotDiv = document.createElement('div');
                emptySlotDiv.classList.add('pattern-item', 'empty');
                emptySlotDiv.dataset.index = i;
                emptySlotDiv.addEventListener('dragover', (e) => this.handleDragOver(e));
                emptySlotDiv.addEventListener('drop', (e) => this.handleDrop(e));
                patternsPatternArea.appendChild(emptySlotDiv);
                this.emptySlots.push(emptySlotDiv);
            }

            // Populate choices area
            let choicesPool = [...uniqueItemsUsed];
            const allAvailableAssets = [...assets.images.patterns];
            shuffleArray(allAvailableAssets);
            const distractorsNeeded = Math.min(3, allAvailableAssets.length - uniqueItemsUsed.length);
            for(let i = 0; i < distractorsNeeded; i++) {
                const distractor = allAvailableAssets.find(a => !uniqueItemsUsed.includes(a) && !choicesPool.includes(a));
                if (distractor) {
                    choicesPool.push(distractor);
                }
            }
            shuffleArray(choicesPool);

            choicesPool.forEach(asset => {
                patternsChoicesArea.appendChild(this.createDraggableItem(asset));
            });
        },

        generatePattern() {
            const patternTypes = ['ABAB', 'AABB', 'ABC'];
            const chosenType = patternTypes[getRandomInt(0, patternTypes.length - 1)];
            const availableImages = [...assets.images.patterns];
            shuffleArray(availableImages);

            const patternLength = 5; // e.g., 5 items in the pattern, with 2 missing

            let pattern = [];
            let solution = [];
            let uniqueItemsUsed = [];

            const numPatternElements = chosenType === 'ABC' ? 3 : 2;
            for (let i = 0; i < numPatternElements; i++) {
                uniqueItemsUsed.push(availableImages[i]);
            }

            for (let i = 0; i < patternLength; i++) {
                let item;
                if (chosenType === 'ABAB') {
                    item = uniqueItemsUsed[i % 2];
                } else if (chosenType === 'AABB') {
                    item = uniqueItemsUsed[Math.floor(i / 2) % 2];
                } else if (chosenType === 'ABC') {
                    item = uniqueItemsUsed[i % 3];
                }
                pattern.push(item);
            }

            const numMissing = 2;
            solution = pattern.slice(pattern.length - numMissing);
            // NOTE: 'currentPattern' here refers to the initial sequence displayed, not the entire completed pattern.
            // The global 'currentPattern' in the 'patternsGame' object is not directly used after being set here.
            // It might be intended to hold the initial pattern for reference. If so, it should be assigned.
            // For now, it's just a local variable being returned.
            const currentPatternForDisplay = pattern.slice(0, pattern.length - numMissing);


            return { currentPattern: currentPatternForDisplay, solution, uniqueItemsUsed };
        },

        createDraggableItem(asset) {
            const img = document.createElement('img');
            img.src = asset.src;
            img.classList.add('draggable-choice');
            img.setAttribute('draggable', 'true');
            img.dataset.id = asset.id;

            img.addEventListener('dragstart', (e) => {
                this.draggedItemData = { id: asset.id, src: asset.src };
                e.dataTransfer.setData('text/plain', asset.id);
                e.dataTransfer.effectAllowed = 'copy';
            });
            return img;
        },

        handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        },

        handleDrop(e) {
            e.preventDefault();
            const droppedElementId = e.dataTransfer.getData('text/plain') || this.draggedItemData.id;
            const targetSlotIndex = parseInt(e.currentTarget.dataset.index);
            const correctElementId = this.patternSolution[targetSlotIndex].id;

            const droppedElementAsset = assets.images.patterns.find(img => img.id === droppedElementId);

            if (droppedElementId === correctElementId) {
                if (!this.filledSlots.has(targetSlotIndex)) {
                    const img = document.createElement('img');
                    img.src = droppedElementAsset.src;
                    img.alt = droppedElementAsset.name;
                    e.currentTarget.innerHTML = '';
                    e.currentTarget.appendChild(img);
                    e.currentTarget.classList.remove('empty');
                    e.currentTarget.removeEventListener('drop', this.handleDrop); // Prevent dropping again in same slot

                    this.filledSlots.add(targetSlotIndex);

                    if (assets.audio.correctDing) assets.audio.correctDing.cloneNode(true).play();
                    patternsFeedbackMessage.textContent = 'Great!';

                    if (this.filledSlots.size === this.patternSolution.length) {
                        setTimeout(() => {
                            patternsFeedbackMessage.textContent = 'Fantastic! You completed the pattern!';
                            assets.audio.success.cloneNode(true).play();
                            patternsNextRoundButton.classList.remove('hidden');
                        }, 500);
                    }
                }
            } else {
                patternsFeedbackMessage.textContent = 'Oops! That doesn\'t fit there. Try again!';
                if (assets.audio.incorrectBuzz) assets.audio.incorrectBuzz.cloneNode(true).play();
                setTimeout(() => patternsFeedbackMessage.textContent = '', 1500);
            }
        }
    };

    // --- Number Recognition Game Logic ---
    const numberRecognitionGame = {
        targetNumber: 0,
        MAX_RECOGNITION_NUMBER: 5, // Max number for recognition

        startGame() {
            recognitionStartGameButton.classList.add('hidden');
            recognitionNextRoundButton.classList.add('hidden');
            recognitionFeedbackMessage.textContent = '';
            recognitionGameArea.innerHTML = '';

            this.targetNumber = getRandomInt(1, this.MAX_RECOGNITION_NUMBER);
            recognitionTargetNumberText.textContent = assets.audio.numbers[this.targetNumber] ? assets.images.numbers[this.targetNumber].name : this.targetNumber;
            recognitionInstructionText.innerHTML = `Click on the number <span id="recognition-target-number-text" style="color:#E91E63;">${recognitionTargetNumberText.textContent}</span>!`;

            // Generate choices (correct + distractors)
            let choices = new Set();
            choices.add(this.targetNumber);
            while (choices.size < 5) { // Always show 5 choices
                let randomNum = getRandomInt(1, this.MAX_RECOGNITION_NUMBER);
                if (randomNum !== this.targetNumber) {
                    choices.add(randomNum);
                }
            }
            let choicesArray = Array.from(choices);
            shuffleArray(choicesArray);

            choicesArray.forEach(num => {
                const numDiv = document.createElement('div');
                numDiv.classList.add('number-choice');
                numDiv.textContent = num;
                numDiv.dataset.number = num;
                numDiv.addEventListener('click', (e) => this.handleChoiceClick(e));
                recognitionGameArea.appendChild(numDiv);
            });
        },

        handleChoiceClick(event) {
            const clickedNumber = parseInt(event.target.dataset.number);
            if (clickedNumber === this.targetNumber) {
                event.target.classList.add('correct');
                recognitionFeedbackMessage.textContent = 'You got it! Great job!';
                assets.audio.success.cloneNode(true).play();
                setTimeout(() => {
                    recognitionNextRoundButton.classList.remove('hidden');
                }, 1000);
            } else {
                event.target.classList.add('incorrect');
                recognitionFeedbackMessage.textContent = 'Oops! Try again!';
                assets.audio.tryAgain.cloneNode(true).play();
                setTimeout(() => {
                    event.target.classList.remove('incorrect'); // Clear feedback
                    recognitionFeedbackMessage.textContent = '';
                }, 1000);
            }
        }
    };

    // --- Number Tracing/Match Game Logic (Simplified to "Number Shape Match") ---
    const numberTracingGame = {
        targetNumberId: null,
        draggedItemData: null,

        startGame() {
            tracingStartGameButton.classList.add('hidden');
            tracingNextRoundButton.classList.add('hidden');
            tracingFeedbackMessage.textContent = '';
            tracingTargetNumberShape.innerHTML = '';
            tracingChoicesArea.innerHTML = '';

            const numberIds = Object.keys(assets.images.numbers);
            const targetNum = numberIds[getRandomInt(0, numberIds.length - 1)];
            this.targetNumberId = targetNum;

            // Display target number shape
            const targetImg = document.createElement('img');
            targetImg.src = assets.images.numbers[targetNum].src;
            targetImg.alt = assets.images.numbers[targetNum].name;
            tracingTargetNumberShape.appendChild(targetImg);
            tracingTargetNumberShape.addEventListener('dragover', (e) => this.handleDragOver(e));
            tracingTargetNumberShape.addEventListener('drop', (e) => this.handleDrop(e));

            // Generate draggable number choices (including the correct one and distractors)
            let choices = new Set();
            choices.add(targetNum);
            while (choices.size < 4) { // Show 4 choices
                let randomNum = numberIds[getRandomInt(0, numberIds.length - 1)];
                choices.add(randomNum);
            }
            let choicesArray = Array.from(choices);
            shuffleArray(choicesArray);

            choicesArray.forEach(numId => {
                const choiceDiv = document.createElement('div');
                choiceDiv.classList.add('tracing-choice-item');
                choiceDiv.setAttribute('draggable', 'true');
                choiceDiv.dataset.id = numId;

                const img = document.createElement('img');
                img.src = assets.images.numbers[numId].src;
                img.alt = assets.images.numbers[numId].name;
                choiceDiv.appendChild(img);

                choiceDiv.addEventListener('dragstart', (e) => {
                    this.draggedItemData = { id: numId, src: assets.images.numbers[numId].src };
                    e.dataTransfer.setData('text/plain', numId);
                    e.dataTransfer.effectAllowed = 'copy';
                });
                tracingChoicesArea.appendChild(choiceDiv);
            });
        },

        handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        },

        handleDrop(e) {
            e.preventDefault();
            const droppedElementId = e.dataTransfer.getData('text/plain') || this.draggedItemData.id;

            if (droppedElementId === this.targetNumberId) {
                tracingFeedbackMessage.textContent = 'Fantastic! That\'s a match!';
                assets.audio.success.cloneNode(true).play();
                e.currentTarget.classList.add('correct-match'); // Visual feedback on target
                // Find and highlight the correct choice in the choices area
                const correctChoiceElement = document.querySelector(`.tracing-choice-item[data-id="${droppedElementId}"]`);
                if (correctChoiceElement) {
                    correctChoiceElement.classList.add('correct-match');
                }
                setTimeout(() => {
                    tracingNextRoundButton.classList.remove('hidden');
                }, 1000);
            } else {
                tracingFeedbackMessage.textContent = 'Oops! That\'s not the right number. Try again!';
                assets.audio.tryAgain.cloneNode(true).play();
                // Briefly highlight the incorrect choice
                const incorrectChoiceElement = document.querySelector(`.tracing-choice-item[data-id="${droppedElementId}"]`);
                if (incorrectChoiceElement) {
                    incorrectChoiceElement.classList.add('incorrect-match');
                    setTimeout(() => incorrectChoiceElement.classList.remove('incorrect-match'), 1000);
                }
                setTimeout(() => tracingFeedbackMessage.textContent = '', 1500);
            }
        }
    };

    // --- Event Listeners for Activity Hub ---
    activityButtons.forEach(button => {
        button.addEventListener('click', () => {
            const activity = button.dataset.activity;
            gameManager.initActivity(activity);
        });
    });

    backToHubButtons.forEach(button => {
        button.addEventListener('click', () => {
            gameManager.backToHub();
        });
    });

    // --- Game Specific Start/Next Round Buttons ---
    countingStartGameButton.addEventListener('click', () => countingGame.startGame());
    countingNextRoundButton.addEventListener('click', () => countingGame.startGame());

    patternsStartGameButton.addEventListener('click', () => patternsGame.startGame());
    patternsNextRoundButton.addEventListener('click', () => patternsGame.startGame());

    recognitionStartGameButton.addEventListener('click', () => numberRecognitionGame.startGame());
    recognitionNextRoundButton.addEventListener('click', () => numberRecognitionGame.startGame());

    tracingStartGameButton.addEventListener('click', () => numberTracingGame.startGame());
    tracingNextRoundButton.addEventListener('click', () => numberTracingGame.startGame());

    // Initial load: ensure only the hub is active
    gameManager.showScreen(activityHub);
});
