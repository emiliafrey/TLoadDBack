/*
* =================================================================
* EXPERIMENT STRUCTURE
* =================================================================
* This script is organized into the following sections:
*
* 1. INITIALIZATION & STATE VARIABLES:
* Initializes jsPsych and sets up all global variables that track the state of the experiment (e.g., accuracies, stimulus time).
*
* 2. CORE HELPER & UI FUNCTIONS:
* Small, reusable utility functions for tasks like resetting stats, updating the debug display, and saving data.
*
* 3. TRIAL & BLOCK GENERATION FUNCTIONS:
* Functions that are responsible for creating jsPsych trials and timelines for different parts of the experiment.
*
* 4. MAIN EXPERIMENT PHASE FUNCTIONS:
* The large `async` functions that define the logic for each major phase (e.g., digitTrainingLoop, preTestLoop).
*
* 5. MAIN EXECUTION BLOCK:
* The main `(async)` function that runs the entire experiment from start to finish by calling the phase functions in order.
*
* =================================================================
*/


// =============================================================
// 1. INITIALIZATION & STATE VARIABLES
// =============================================================

let jsPsych;
let settings;
let seriesData;

const taskTimeInMinutes = 16;
const accuracyThreshold = 0.85;
let stimulusTimeInMilliseconds;
let blockLength;

let digitAccuracy = 0;
let letterAccuracy = 0;
let overallAccuracy = 0;
let correctDigits = 0;
let correctTargets = 0;
let correctNonTargets = 0;
let totalDigits = 0;
let totalTargets = 0;
let totalNonTargets = 0;

let currentPhaseOverallAccuracySum = 0;
let overallAccuraciesPerPhase = [];

let error = 0;
let accumulatedError = 0;

let currentPhase = null;
let currentPhaseData = [];
let pretestHCL = null, pretestLCL = null;

// =============================================================
// 2. CORE HELPER & UI FUNCTIONS
// =============================================================

function resetStats() {
    digitAccuracy = 0;
    letterAccuracy = 0;
    overallAccuracy = 0;
    correctDigits = 0;
    correctTargets = 0;
    correctNonTargets = 0;
    totalDigits = 0;
    totalTargets = 0;
    totalNonTargets = 0;
}

function resetStatsAndHTML() {
    resetStats();
    updateAccuracyHTML();
    updateLastResponseFeedbackHTML(null);
    updatePretestInfoHTML();
}

function updateAccuracyHTML() {
    const accuracyBox = document.getElementById('accuracy');
    if (currentPhase != null) {
        if (!currentPhase.includes('main_task')) {
            accuracyBox.hidden = false;
        }
        if (currentPhase === 'digit_training') {
            accuracyBox.innerText = `Digit Accuracy: ${(digitAccuracy * 100).toFixed(2)}%`;
        } else if (currentPhase === 'letter_training') {
            accuracyBox.innerText = `Letter Accuracy: ${(letterAccuracy * 100).toFixed(2)}%`;
        } else if (currentPhase === 'letter_digit_training' || currentPhase === 'pretest') {
            accuracyBox.innerText = `Accuracies:
            Digits: ${(digitAccuracy * 100).toFixed(2)}%
            Letters: ${(letterAccuracy * 100).toFixed(2)}%
            Overall: ${(overallAccuracy * 100).toFixed(2)}%
            `;
        }
    }
}

function updateLastResponseFeedbackHTML(isCorrect) {
    const feedbackBox = document.getElementById('last-response-feedback');
    if (currentPhase != null) {
        if (!currentPhase.includes('main_task')) {
            feedbackBox.hidden = false;
        }
        if (isCorrect === null) {
            feedbackBox.innerText = 'Last response was: (waiting…)';
            feedbackBox.style.color = 'navy';
        } else {
            feedbackBox.innerText = `Last response was: ${isCorrect ? "✓ Correct" : "✗ Incorrect"}`;
            feedbackBox.style.color = isCorrect ? 'green' : 'red';
        }
    }
}

function updatePretestInfoHTML() {
    const box = document.getElementById('pretest-info');
    if (box) {
        box.innerText = `Pretest info:\nErrors: ${error}\nAccumulated Errors: ${accumulatedError}\nStimulus Duration Time: ${stimulusTimeInMilliseconds}ms`;
    }
}

const resetTrial = {
    type: jsPsychCallFunction, func: () => {
        resetStatsAndHTML();
    }
};

const stimulusHTML = content => `
            <div class="fullscreen-centered-content stimulus-display-div">
                ${content}
            </div>`;

const blankScreen = {
    type: jsPsychHtmlKeyboardResponse, stimulus: stimulusHTML(''), choices: "NO_KEYS", trial_duration: 100
};

function recalculateDigitAccuracy(lastAnswerCorrect) {
    if (lastAnswerCorrect) {
        correctDigits++;
    }
    totalDigits++;
    digitAccuracy = correctDigits / totalDigits;
    overallAccuracy = 0.65 * letterAccuracy + 0.35 * digitAccuracy;
}

function recalculateLetterAccuracy(lastAnswerCorrect, isTarget) {
    if (isTarget) {
        totalTargets++;
        if (lastAnswerCorrect) {
            correctTargets++;
        }
    } else {
        totalNonTargets++;
        if (lastAnswerCorrect) {
            correctNonTargets++;
        }
    }

    const letterTargetAccuracy = totalTargets > 0 ? correctTargets / totalTargets : 0;
    const letterNonTargetAccuracy = totalNonTargets > 0 ? correctNonTargets / totalNonTargets : 0;

    letterAccuracy = 0.65 * letterTargetAccuracy + 0.35 * letterNonTargetAccuracy;
    overallAccuracy = 0.65 * letterAccuracy + 0.35 * digitAccuracy;
}

function calculateRepetitionsPerHalfPhase() {
    const stimulusTimeInSeconds = stimulusTimeInMilliseconds / 1000;
    const taskTimeInSeconds = taskTimeInMinutes * 60;
    const blockTimeInSeconds = blockLength * 2 * stimulusTimeInSeconds;
    return repetitions = Math.floor(taskTimeInSeconds / blockTimeInSeconds / 2);
}

// =============================================================
// 3. TRIAL & BLOCK GENERATION FUNCTIONS
// =============================================================

function makeStimulus(content, choices, correctResponse, stimulusType) {
    let startTimeStamp;
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: stimulusHTML(content),
        choices: choices,
        response_ends_trial: false,
        trial_duration: () => stimulusTimeInMilliseconds,
        on_load: function () {
            startTimeStamp = Date.now();
        },
        on_finish: function (data) {
            data.correct = data.response === correctResponse;
            updateLastResponseFeedbackHTML(data.correct);
            updatePretestInfoHTML();
            if (stimulusType === 'digit') {
                recalculateDigitAccuracy(data.correct);
            } else if (stimulusType === 'letter') {
                recalculateLetterAccuracy(data.correct, correctResponse === " ");
            }
            updateAccuracyHTML();
            currentPhaseData.push({
                phase: currentPhase,
                stimulus_type: stimulusType,
                stimulus: content,
                response: data.response,
                correct_response: correctResponse,
                was_correct: data.correct,
                digit_accuracy: digitAccuracy,
                letter_accuracy: letterAccuracy,
                overall_accuracy: overallAccuracy,
                start_time_stamp: startTimeStamp,
                response_time_stamp: data.response === null ? null : startTimeStamp + data.rt,
                completed_time_stamp: Date.now(),
                reaction_time: data.rt,
            })
        }
    };
}

const getRandomBlock = () => {
    return jsPsych.randomization.sampleWithoutReplacement(seriesData, 1)[0];
};


const generateDigitBlock = () => {
    const timeline = [];
    for (let i = 0; i < blockLength / 2; i++) {
        pushRandomNumberStimulus(timeline);
        timeline.push(blankScreen);
    }
    return timeline;
};

const generateLetterBlock = () => {
    const timeline = [];
    const block = getRandomBlock();
    for (let i = 0; i < blockLength / 2; i++) {
        const letter = block.letters[i];
        const expected = block.responses[i] === "1" ? " " : null;
        timeline.push(makeStimulus(letter, [' '], expected, 'letter'));
        timeline.push(blankScreen);
    }
    return timeline;
};

const generateLetterDigitBlock = () => {
    const timeline = [];
    const block = getRandomBlock();
    let currentPhaseBlockLength = blockLength;
    if (currentPhase === 'pretest' || currentPhase === 'letter_digit_training') {
        currentPhaseBlockLength *= (1 / 2);
    }
    for (let i = 0; i < currentPhaseBlockLength; i++) {
        const letter = block.letters[i];
        const letterExpected = block.responses[i] === "1" ? " " : null;
        timeline.push(makeStimulus(letter, [' '], letterExpected, 'letter'));
        pushRandomNumberStimulus(timeline);
    }
    return timeline;
};

function setTrialPhase(phaseName) {
    return {
        type: jsPsychCallFunction, func: function () {
            currentPhase = phaseName;
        }
    };
}

// =============================================================
// 4. MAIN EXPERIMENT PHASE FUNCTIONS
// =============================================================

async function digitTrainingLoop() {
    while (digitAccuracy < accuracyThreshold) {
        resetStatsAndHTML();
        const toRun = generateDigitBlock();
        await jsPsych.run(toRun);
        if (digitAccuracy < accuracyThreshold) {
            await jsPsych.run([MESSAGES.repeatTraining]);
        }
    }
};

async function letterTrainingLoop() {
    while (letterAccuracy < accuracyThreshold) {
        resetStatsAndHTML();
        const toRun = generateLetterBlock();
        await jsPsych.run(toRun);
        if (letterAccuracy < accuracyThreshold) {
            await jsPsych.run([MESSAGES.repeatTraining]);
        }
    }
};

async function letterDigitTrainingLoop() {
    while (overallAccuracy < accuracyThreshold) {
        resetStatsAndHTML();
        const toRun = generateLetterDigitBlock();
        await jsPsych.run(toRun);
        if (overallAccuracy < accuracyThreshold) {
            await jsPsych.run([MESSAGES.repeatTraining]);
        }
    }
};

async function preTestLoop() {
    stimulusTimeInMilliseconds -= 100;
    updatePretestInfoHTML();
    while (error < 3 && accumulatedError < 3) {
        resetStatsAndHTML();
        const toRun = generateLetterDigitBlock();
        await jsPsych.run(toRun);
        if (overallAccuracy < accuracyThreshold) {
            error++;
            accumulatedError++;
        } else {
            error = 0;
            stimulusTimeInMilliseconds -= 100;
        }
        if (error >= 3) {
            pretestHCL = stimulusTimeInMilliseconds + 100; // Revert to last successful speed
            pretestLCL = pretestHCL * 1.5;
            break;
        }
        if (accumulatedError >= 3) {
            pretestHCL = stimulusTimeInMilliseconds;
            pretestLCL = pretestHCL * 1.5;
            break;
        }
        await jsPsych.run([MESSAGES.pause]);
    }
}

async function halfOfMainTaskLoop() {
    const repetitions = calculateRepetitionsPerHalfPhase();
    for (i = 0; i < repetitions; i++) {
        resetStatsAndHTML();
        const toRun = generateLetterDigitBlock();
        await jsPsych.run(toRun);
        currentPhaseOverallAccuracySum += overallAccuracy;
        if (i < repetitions - 1) {
            await jsPsych.run([MESSAGES.betweenMainTaskScreens]);
        }
        console.log(`Completed ${i + 1} of ${repetitions} with STD: ${stimulusTimeInMilliseconds}ms`);
    }
}

function pushRandomNumberStimulus(trials) {
    const number = jsPsych.randomization.sampleWithoutReplacement([1, 2, 3, 4, 6, 7, 8, 9], 1)[0];
    const correctKey = number % 2 === 0 ? '2' : '3';
    trials.push(makeStimulus(number, ['2', '3'], correctKey, 'digit'));
}

function finalizePhase(phaseName) {
    const currentPhaseDataInputId = `id_${phaseName}_data`;
    const currentPhaseDataInputElement = document.getElementById(currentPhaseDataInputId);
    if (currentPhaseDataInputElement) {
        currentPhaseDataInputElement.value = JSON.stringify(currentPhaseData);
    } else {
        console.error(`Could not find input element with ID: ${currentPhaseDataInputId}`);
    }
    if (phaseName.includes('main_task')) {
        const currentPhaseOverallAccuracyInputId = `id_${phaseName}_overall_accuracy`;
        const currentPhaseOverallAccuracyInputElement = document.getElementById(currentPhaseOverallAccuracyInputId);
        if (currentPhaseOverallAccuracyInputElement) {
            currentPhaseAverageOverallAccuracy = currentPhaseOverallAccuracySum / calculateRepetitionsPerHalfPhase();
            currentPhaseOverallAccuracyInputElement.value = currentPhaseAverageOverallAccuracy
            overallAccuraciesPerPhase.push(currentPhaseAverageOverallAccuracy);
            sessionStorage.setItem('overallAccuraciesPerPhase', JSON.stringify(overallAccuraciesPerPhase));
        } else {
            console.error(`Could not find input element with ID: ${currentPhaseOverallAccuracyInputId}`);
        }
        if (phaseName.includes('2_2')) {
            const averageOverallAccuracyInput = document.getElementById('id_average_overall_accuracy');
            if (averageOverallAccuracyInput) {
                const averageOverallAccuracy = overallAccuraciesPerPhase.reduce((sum, acc) => sum + acc, 0) / overallAccuraciesPerPhase.length;
                averageOverallAccuracyInput.value = averageOverallAccuracy;
            } else {
                console.error("Could not find input element with ID: id_average_overall_accuracy");
            }
            sessionStorage.removeItem('overallAccuraciesPerPhase');
        }
    }
    currentPhaseOverallAccuracySum = 0;
    currentPhaseData = [];
}

// =============================================================
// 5. MAIN EXECUTION BLOCK
// =============================================================

const TLoadDBack = {
    init: function (otreeSettings, otreeSeriesData, stimulusTimeFromOtree = null) {
        jsPsych = initJsPsych({display_element: 'jspsych-target'});
        const savedOverallAccuraciesPerPhase = sessionStorage.getItem('overallAccuraciesPerPhase');
        overallAccuraciesPerPhase = savedOverallAccuraciesPerPhase ? JSON.parse(savedOverallAccuraciesPerPhase) : [];
        settings = otreeSettings;
        seriesData = otreeSeriesData;
        stimulusTimeInMilliseconds = stimulusTimeFromOtree || settings.stimulus_time_duration_pretest;
        blockLength = getRandomBlock().letters.length;
        resetStatsAndHTML();
    },

    runTrainingAndPretest: async function () {
        await jsPsych.run([
            {
                type: jsPsychPreload,
                images: INSTRUCTIONS.pretestInstructionImages
            },
            MESSAGES.welcome,
            INSTRUCTIONS.generalInstructions,
            setTrialPhase("digit_training"),
            INSTRUCTIONS.digitsInstructions,]);
        await digitTrainingLoop();
        finalizePhase('digit_training');

        await jsPsych.run([
            resetTrial,
            MESSAGES.digitTrainingDone,
            setTrialPhase("letter_training"),
            INSTRUCTIONS.lettersInstructions,
        ]);
        await letterTrainingLoop();
        finalizePhase('letter_training');

        await jsPsych.run([
            resetTrial,
            MESSAGES.letterTrainingDone,
            setTrialPhase("letter_digit_training"),
            INSTRUCTIONS.lettersDigitsInstructions,]);
        await letterDigitTrainingLoop();
        finalizePhase('letter_digit_training');

        await jsPsych.run([
            resetTrial,
            setTrialPhase("pretest"),
            MESSAGES.pretestInstructions,]);
        await preTestLoop();
        finalizePhase('pretest');
        document.getElementById('id_pretest_hcl').value = pretestHCL;
        document.getElementById('id_pretest_lcl').value = pretestLCL;
    },

    runMainTask: async function (phaseNumber) {
        currentPhase = `main_task_${phaseNumber}`;
        await jsPsych.run([{
            type: jsPsychPreload,
            images: INSTRUCTIONS.mainTaskInstructionImages
        },
            MESSAGES.mainTaskBeginning,
            INSTRUCTIONS.mainTaskIntro,
            INSTRUCTIONS.mainTaskInstructions,
            INSTRUCTIONS.mainTaskDisclaimer]);
        await halfOfMainTaskLoop();
        finalizePhase(`main_task_${phaseNumber}`);
    },

    endPhase: function (finalMessage) {
        document.getElementById('jspsych-target').style.display = 'none';
        const finalScreenContainer = document.getElementById('final-screen-container');
        finalScreenContainer.className = 'fullscreen-centered-content instruction-box';
        const oTreeButtonContainer = document.getElementById('otree-next-button-container');
        finalScreenContainer.innerHTML = finalMessage;
        finalScreenContainer.appendChild(oTreeButtonContainer);
        oTreeButtonContainer.style.display = 'block';
        finalScreenContainer.style.display = 'block';
    }
}