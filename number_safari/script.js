document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const appContainer = document.querySelector('.app-container');
    const screens = document.querySelectorAll('.screen');
    const activityHub = document.getElementById('activity-hub');
    const backToHubButtons = document.querySelectorAll('.back-to-hub');
    const activityButtons = document.querySelectorAll('.activity-buttons button');

    // Counting Game Elements
    const countingGameScreen = document.getElementById('counting-game');
    const countingInstructionText = document.getElementById('counting-instruction-text');
    const countingObjectNameSpan = document.getElementById('counting-object-name');
    const countingStartGameButton = document.getElementById('counting-start-game');
    const countingGameArea = document.getElementById('counting-game-area');
    const countingFeedbackMessage = document.getElementById('counting-feedback-message');
    const countingNextRoundButton = document.getElementById('counting-next-round');
    const countingNumberChoices = document.getElementById('counting-number-choices');
    const countingStreakDisplay = document.getElementById('counting-streak-display');

    // Patterns Game Elements
    const patternsGameScreen = document.getElementById('patterns-game');
    console.log('patternsGameScreen:', patternsGameScreen);
    const patternsStartGameButton = document.getElementById('patterns-start-game');
    const patternsPatternArea = document.querySelector('.pattern-area');
    const patternsChoicesArea = document.querySelector('.choices-area');
    const patternsFeedbackMessage = document.getElementById('patterns-feedback-message');
    const patternsNextRoundButton = document.getElementById('patterns-next-round');
    const patternsCounter = document.getElementById('patternsCounter');

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
    const tracingStartGameButton = document.getElementById('tracing-start-game');
    const tracingTargetNumberShape = document.querySelector('.target-number-shape');
    const tracingChoicesArea = document.querySelector('.tracing-choices');
    const tracingFeedbackMessage = document.getElementById('tracing-feedback-message');
    const tracingNextRoundButton = document.getElementById('tracing-next-round');

// Hide all screens except the hub
document.querySelectorAll('.screen').forEach(el => {
  if (el !== activityHub) el.classList.add('hidden');
  else el.classList.add('active');
});

    
    // --- Assets ---
    const assets = {
        images: {
            counting: [
                { id: 'acorn', src: 'assets/images/counting/acorn.png', name: 'acorn' },
                { id: 'butterfly', src: 'assets/images/counting/butterfly.png', name: 'butterfly' },
                { id: 'flower', src: 'assets/images/counting/flower.png', name: 'flower' },
                { id: 'star', src: 'assets/images/counting/star.png', name: 'star' }
            ],
            patterns: [
                { id: 'red_circle', src: 'assets/images/patterns/red_circle.png', name: 'Red Circle' },
                { id: 'blue_square', src: 'assets/images/patterns/blue_square.png', name: 'Blue Square' },
                { id: 'yellow_triangle', src: 'assets/images/patterns/yellow_triangle.png', name: 'Yellow Triangle' },
                { id: 'green_star', src: 'assets/images/patterns/green_star.png', name: 'Green Star' },
                { id: 'purple_flower', src: 'assets/images/patterns/purple_flower.png', name: 'Purple Flower' }
            ],
            numbers: {
                '1': { src: 'assets/images/numbers/number_1.png', name: 'one' },
                '2': { src: 'assets/images/numbers/number_2.png', name: 'two' },
                '3': { src: 'assets/images/numbers/number_3.png', name: 'three' },
                '4': { src: 'assets/images/numbers/number_4.png', name: 'four' },
                '5': { src: 'assets/images/numbers/number_5.png', name: 'five' }
            }
        },
        audio: {
            numbers: {
                1: new Audio('assets/audio/numbers/one.mp3'),
                2: new Audio('assets/audio/numbers/two.mp3'),
                3: new Audio('assets/audio/numbers/three.mp3'),
                4: new Audio('assets/audio/numbers/four.mp3'),
                5: new Audio('assets/audio/numbers/five.mp3')
            },
            success: new Audio('assets/audio/great_job.mp3'),
            tryAgain: new Audio('assets/audio/try_again.mp3'),
            correctDing: new Audio('assets/audio/correct_ding.mp3'),
            incorrectBuzz: new Audio('assets/audio/incorrect_buzz.mp3')
        }
    };

    // --- Utilities ---
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    function hideAllScreens() {
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });
    }

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

    // --- Screen Management ---
    function hideAllScreens() {
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });
    }
    const gameManager = {
        showScreen(screenElement, onShown) {
            hideAllScreens();
            screenElement.classList.remove('hidden');
            screenElement.classList.add('active');
            if (typeof onShown === "function") onShown();
        },
        initActivity(activityName) {
            switch (activityName) {
                case 'counting':
                    this.showScreen(countingGameScreen, () => {
                        countingGame.currentStreak = 0;
                        countingGame.streakMessageElement.textContent = countingGame.currentStreak;
                        countingGame.startGame();
                    });
                    break;
                case 'patterns':
                    this.showScreen(patternsGameScreen, () => {
                        patternsGame.startGame();
                    });
                    break;
                case 'recognition':
                    this.showScreen(recognitionGameScreen, () => {
                        numberRecognitionGame.startGame();
                    });
                    break;
                case 'tracing':
                    this.showScreen(tracingGameScreen, () => {
                        numberTracingGame.startGame();
                    });
                    break;
                default:
                    this.showScreen(activityHub);
                    break;
            }
        },
        backToHub() {
            this.showScreen(activityHub);
        }
    };
    // --- Counting Game Logic ---
    const countingGame = {
        currentCount: 0,
        targetCount: 0,
        selectedObject: null,
        clickedObjects: new Set(),
        MAX_COUNT_NUMBER: 5,
        currentStreak: 0,
        targetStreak: 10,
        streakMessageElement: countingStreakDisplay,

        startGame() {
            countingStartGameButton.classList.add('hidden');
            countingNextRoundButton.classList.add('hidden');
            countingFeedbackMessage.textContent = '';
            this.currentCount = 0;
            this.clickedObjects.clear();
            countingGameArea.innerHTML = '';
            countingNumberChoices.innerHTML = '';
            countingNumberChoices.classList.add('hidden');
            this.targetCount = getRandomInt(1, this.MAX_COUNT_NUMBER);
            this.selectedObject = assets.images.counting[getRandomInt(0, assets.images.counting.length - 1)];
            countingObjectNameSpan.textContent = this.selectedObject.name;
            countingInstructionText.innerHTML = `How many <span id="counting-object-name" style="color:#E91E63;">${this.selectedObject.name}s</span> can you find and count?`;
            setTimeout(() => {
                const gameAreaRect = countingGameArea.getBoundingClientRect();
                const dummyImg = document.createElement('img');
                dummyImg.src = this.selectedObject.src;
                dummyImg.classList.add('object-to-count');
                dummyImg.style.visibility = 'hidden';
                dummyImg.style.position = 'absolute';
                countingGameArea.appendChild(dummyImg);
                const objectWidth = dummyImg.offsetWidth;
                const objectHeight = dummyImg.offsetHeight;
                countingGameArea.removeChild(dummyImg);
                const safetyMargin = 10;
                const maxX = gameAreaRect.width - objectWidth - safetyMargin;
                const maxY = gameAreaRect.height - objectHeight - safetyMargin;
                const finalMaxX = Math.max(0, maxX);
                const finalMaxY = Math.max(0, maxY);
                const placedObjects = [];
                for (let i = 0; i < this.targetCount; i++) {
                    const img = document.createElement('img');
                    img.src = this.selectedObject.src;
                    img.classList.add('object-to-count');
                    img.dataset.id = i;
                    const randomScale = getRandomInt(80, 120) / 100;
                    const randomRotate = getRandomInt(-20, 20);
                    img.style.transform = `scale(${randomScale}) rotate(${randomRotate}deg)`;
                    img.style.transformOrigin = 'center center';
                    let newLeft, newTop;
                    let collision, attempts = 0, maxAttempts = 500;
                    do {
                        collision = false;
                        newLeft = getRandomInt(0, finalMaxX);
                        newTop = getRandomInt(0, finalMaxY);
                        for (const placed of placedObjects) {
                            const placedObjectRenderedWidth = placed.width * placed.scale;
                            const placedObjectRenderedHeight = placed.height * placed.scale;
                            const newObjectRenderedWidth = objectWidth * randomScale;
                            const newObjectRenderedHeight = objectHeight * randomScale;
                            if (newLeft < placed.left + placedObjectRenderedWidth &&
                                newLeft + newObjectRenderedWidth > placed.left &&
                                newTop < placed.top + placedObjectRenderedHeight &&
                                newTop + newObjectRenderedHeight > placed.top) {
                                collision = true;
                                break;
                            }
                        }
                        attempts++;
                    } while (collision && attempts < maxAttempts);
                    img.style.left = newLeft + 'px';
                    img.style.top = newTop + 'px';
                    img.addEventListener('click', (e) => this.handleObjectClick(e));
                    countingGameArea.appendChild(img);
                    placedObjects.push({
                        left: newLeft,
                        top: newTop,
                        width: objectWidth,
                        height: objectHeight,
                        scale: randomScale
                    });
                }
            }, 300);
        },

        handleObjectClick(event) {
            const objectId = event.target.dataset.id;
            if (this.clickedObjects.has(objectId)) return;
            this.currentCount++;
            this.clickedObjects.add(objectId);
            event.target.classList.add('clicked');
            if (assets.audio.numbers[this.currentCount]) {
                assets.audio.numbers[this.currentCount].cloneNode(true).play();
            }
            if (this.currentCount === this.targetCount) {
                if (assets.audio.numbers[this.currentCount]) {
                    assets.audio.numbers[this.currentCount].cloneNode(true).play();
                }
                setTimeout(() => {
                    countingGameArea.innerHTML = '';
                    countingFeedbackMessage.textContent = 'How many did you count? Select the correct number!';
                    this.presentNumberChoices();
                }, 700);
            } else if (this.currentCount > this.targetCount) {
                countingFeedbackMessage.textContent = `Oops! You counted too many. Try again!`;
                if (assets.audio.tryAgain) assets.audio.tryAgain.cloneNode(true).play();
                this.handleIncorrectAnswer();
                setTimeout(() => this.startGame(), 2000);
            }
        },

        presentNumberChoices() {
            countingNumberChoices.classList.remove('hidden');
            countingNumberChoices.innerHTML = '';
            let choices = new Set();
            choices.add(this.targetCount);
            while (choices.size < 3) {
                let randomNum = getRandomInt(1, this.MAX_COUNT_NUMBER);
                if (randomNum !== this.targetCount) choices.add(randomNum);
            }
            let choicesArray = Array.from(choices);
            shuffleArray(choicesArray);
            choicesArray.forEach(num => {
                const button = document.createElement('button');
                button.classList.add('number-choice-button');
                button.textContent = num;
                button.dataset.number = num;
                button.addEventListener('click', (e) => this.handleNumberChoiceClick(e));
                countingNumberChoices.appendChild(button);
            });
        },

        handleNumberChoiceClick(event) {
            const selectedNumber = parseInt(event.target.dataset.number);
            document.querySelectorAll('.number-choice-button').forEach(btn => btn.disabled = true);
            if (selectedNumber === this.targetCount) {
                event.target.classList.add('correct');
                countingFeedbackMessage.textContent = 'Excellent! That\'s correct!';
                if (assets.audio.success) assets.audio.success.cloneNode(true).play();
                this.handleCorrectAnswer();
            } else {
                event.target.classList.add('incorrect');
                countingFeedbackMessage.textContent = `Not quite! The correct number was ${this.targetCount}.`;
                if (assets.audio.incorrectBuzz) assets.audio.incorrectBuzz.cloneNode(true).play();
                this.handleIncorrectAnswer();
            }
            setTimeout(() => {
                countingNumberChoices.classList.add('hidden');
                countingNumberChoices.innerHTML = '';
                countingNextRoundButton.classList.remove('hidden');
            }, 1500);
        },

        handleCorrectAnswer() {
            this.currentStreak++;
            this.updateStreakDisplay();
            if (this.currentStreak >= this.targetStreak) {
                countingFeedbackMessage.textContent = `Amazing! You got ${this.targetStreak} in a row!`;
                if (assets.audio.success) assets.audio.success.cloneNode(true).play();
                setTimeout(() => {
                    this.currentStreak = 0;
                    this.updateStreakDisplay();
                    countingStartGameButton.textContent = "Play Again!";
                    countingStartGameButton.classList.remove('hidden');
                    countingNextRoundButton.classList.add('hidden');
                }, 2000);
            }
        },

        handleIncorrectAnswer() {
            this.currentStreak = 0;
            this.updateStreakDisplay();
        },

        updateStreakDisplay() {
            let starsHtml = '';
            for (let i = 0; i < this.targetStreak; i++) {
                starsHtml += (i < this.currentStreak) ? '⭐' : '🐾';
            }
            this.streakMessageElement.innerHTML = starsHtml;
        }
    };

    // --- Pattern Parade Game Logic ---
    const patternsGame = {
        patternSolution: [],
        filledSlots: new Set(),
        patternCounter: 0,

        startGame() {
            patternsStartGameButton.classList.add('hidden');
            patternsNextRoundButton.classList.add('hidden');
            patternsFeedbackMessage.textContent = '';
            patternsPatternArea.innerHTML = '';
            patternsChoicesArea.innerHTML = '';
            document.getElementById('patternsCounter').textContent = `Patterns completed: ${this.patternCounter}`;
            this.filledSlots.clear();

            const { currentPattern, solution, uniqueItemsUsed } = this.generatePattern();
            this.patternSolution = solution;

            // Show initial pattern
            currentPattern.forEach(item => {
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
                emptySlotDiv.addEventListener('dragover', this.handleDragOver);
                emptySlotDiv.addEventListener('dragleave', e => e.currentTarget.classList.remove('drop-hover'));
                emptySlotDiv.addEventListener('drop', (e) => this.handleDrop(e));
                patternsPatternArea.appendChild(emptySlotDiv);
            }

            // Create draggable choices (UNLIMITED for each type)
            let needed = {};
            this.patternSolution.forEach(item => {
                needed[item.id] = (needed[item.id] || 0) + 1;
            });
            // Always show all possible types for fun
            let choicesList = [...assets.images.patterns];

            choicesList.forEach(asset => {
                // Make enough draggable clones for the max needed in the pattern
                const count = Math.max(needed[asset.id] || 1, 1);
                for (let i = 0; i < count; i++) {
                    const img = document.createElement('img');
                    img.src = asset.src;
                    img.classList.add('draggable-choice');
                    img.setAttribute('draggable', 'true');
                    img.dataset.id = asset.id;
                    img.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', asset.id);
                        setTimeout(() => img.classList.add('dragging'), 0);
                    });
                    img.addEventListener('dragend', () => {
                        img.classList.remove('dragging');
                    });
                    patternsChoicesArea.appendChild(img);
                }
            });
        },

        generatePattern() {
            const patternTypes = ['ABAB', 'AABB', 'ABC'];
            const chosenType = patternTypes[getRandomInt(0, patternTypes.length - 1)];
            const availableImages = [...assets.images.patterns];
            shuffleArray(availableImages);

            const patternLength = 6, numFilled = 4;
            let pattern = [], uniqueItemsUsed = [];
            const numPatternElements = (chosenType === 'ABC') ? 3 : 2;
            for (let i = 0; i < numPatternElements; i++) {
                uniqueItemsUsed.push(availableImages[i]);
            }
            for (let i = 0; i < patternLength; i++) {
                let item;
                if (chosenType === 'ABAB') item = uniqueItemsUsed[i % 2];
                else if (chosenType === 'AABB') item = uniqueItemsUsed[Math.floor(i / 2) % 2];
                else item = uniqueItemsUsed[i % 3];
                pattern.push(item);
            }
            return {
                currentPattern: pattern.slice(0, numFilled),
                solution: pattern.slice(numFilled, patternLength),
                uniqueItemsUsed
            };
        },

        handleDragOver(e) {
            e.preventDefault();
            e.currentTarget.classList.add('drop-hover');
        },

        handleDrop(e) {
            e.preventDefault();
            e.currentTarget.classList.remove('drop-hover');
            if (e.currentTarget.querySelector('img')) return; // Already filled
            const droppedId = e.dataTransfer.getData('text/plain');
            const slotIndex = parseInt(e.currentTarget.dataset.index);
            const correctId = patternsGame.patternSolution[slotIndex].id;
            // Find *any* dragged element in choices area with that id
            const draggedImg = patternsChoicesArea.querySelector(`.draggable-choice[data-id="${droppedId}"]:not(.dragging)`);
            if (!draggedImg) return;
            if (droppedId === correctId) {
                // Correct
                const img = document.createElement('img');
                img.src = draggedImg.src;
                img.alt = draggedImg.alt;
                e.currentTarget.innerHTML = '';
                e.currentTarget.appendChild(img);
                e.currentTarget.classList.add('filled');
                // Remove only that dragged element from choices
                draggedImg.parentNode.removeChild(draggedImg);
                patternsGame.filledSlots.add(slotIndex);
                if (assets.audio && assets.audio.correctDing) assets.audio.correctDing.cloneNode(true).play();
                patternsFeedbackMessage.textContent = 'Great!';
                if (patternsGame.filledSlots.size === patternsGame.patternSolution.length) {
                    setTimeout(() => {
                        patternsFeedbackMessage.textContent = 'Fantastic! You completed the pattern!';
                        if (assets.audio && assets.audio.success) assets.audio.success.cloneNode(true).play();
                        patternsNextRoundButton.classList.remove('hidden');
                        patternsGame.patternCounter++;
                        document.getElementById('patternsCounter').textContent = `Patterns completed: ${patternsGame.patternCounter}`;
                        if (patternsGame.patternCounter === 10) {
                            setTimeout(() => {
                                alert('Wow! You finished 10 patterns!');
                            }, 600);
                        }
                    }, 500);
                }
            } else {
                patternsFeedbackMessage.textContent = 'Oops! Try again!';
                if (assets.audio && assets.audio.incorrectBuzz) assets.audio.incorrectBuzz.cloneNode(true).play();
                e.currentTarget.classList.add('shake');
                setTimeout(() => {
                    e.currentTarget.classList.remove('shake');
                    patternsFeedbackMessage.textContent = '';
                }, 800);
            }
        }
    };

    // --- Number Recognition Game Logic ---
    const numberRecognitionGame = {
        targetNumber: 0,
        MAX_RECOGNITION_NUMBER: 5,
        startGame() {
            recognitionStartGameButton.classList.add('hidden');
            recognitionNextRoundButton.classList.add('hidden');
            recognitionFeedbackMessage.textContent = '';
            recognitionGameArea.innerHTML = '';
            this.targetNumber = getRandomInt(1, this.MAX_RECOGNITION_NUMBER);
            recognitionTargetNumberText.textContent = assets.audio.numbers[this.targetNumber] ? assets.images.numbers[this.targetNumber].name : this.targetNumber;
            recognitionInstructionText.innerHTML = `Click on the number <span id="recognition-target-number-text" style="color:#E91E63;">${recognitionTargetNumberText.textContent}</span>!`;
            let choices = new Set();
            choices.add(this.targetNumber);
            while (choices.size < 5) {
                let randomNum = getRandomInt(1, this.MAX_RECOGNITION_NUMBER);
                if (randomNum !== this.targetNumber) choices.add(randomNum);
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
                setTimeout(() => recognitionNextRoundButton.classList.remove('hidden'), 1000);
            } else {
                event.target.classList.add('incorrect');
                recognitionFeedbackMessage.textContent = 'Oops! Try again!';
                assets.audio.tryAgain.cloneNode(true).play();
                setTimeout(() => {
                    event.target.classList.remove('incorrect');
                    recognitionFeedbackMessage.textContent = '';
                }, 1000);
            }
        }
    };

    // --- Number Tracing/Match Game Logic ---
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
            const targetImg = document.createElement('img');
            targetImg.src = assets.images.numbers[targetNum].src;
            targetImg.alt = assets.images.numbers[targetNum].name;
            tracingTargetNumberShape.appendChild(targetImg);
            tracingTargetNumberShape.addEventListener('dragover', (e) => this.handleDragOver(e));
            tracingTargetNumberShape.addEventListener('drop', (e) => this.handleDrop(e));
            let choices = new Set();
            choices.add(targetNum);
            while (choices.size < 4) {
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
                e.currentTarget.classList.add('correct-match');
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
     // --- Event Listeners ---
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

    // --- Start/Next buttons for each game ---
    countingStartGameButton.addEventListener('click', () => countingGame.startGame());
    countingNextRoundButton.addEventListener('click', () => countingGame.startGame());

    patternsStartGameButton.addEventListener('click', () => patternsGame.startGame());
    patternsNextRoundButton.addEventListener('click', () => patternsGame.startGame());

    recognitionStartGameButton.addEventListener('click', () => numberRecognitionGame.startGame());
    recognitionNextRoundButton.addEventListener('click', () => numberRecognitionGame.startGame());

    tracingStartGameButton.addEventListener('click', () => numberTracingGame.startGame());
    tracingNextRoundButton.addEventListener('click', () => numberTracingGame.startGame());

    // --- Initial state: SHOW ONLY THE HUB ---
    hideAllScreens();
    activityHub.classList.remove('hidden');
    activityHub.classList.add('active');
});
