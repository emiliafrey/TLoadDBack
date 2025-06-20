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

function resetDebugInfo() {
    resetStats();
    updateDebugAccuracy();
    updateDebugFeedback(null);
    updateDebugPretestInfo();
}

function updateDebugAccuracy() {
    const debugBox = document.getElementById('debug-accuracy');
    if (debugBox) {
        debugBox.innerText =
            `Debug Accuracy:\nOverall: ${(overallAccuracy * 100).toFixed(2)}%\nLetters: ${(letterAccuracy * 100).toFixed(1)}%\nDigits: ${(digitAccuracy * 100).toFixed(1)}%`;
    }
}


function updateDebugFeedback(isCorrect) {
    const feedbackBox = document.getElementById('debug-feedback');
    if (isCorrect === null) {
        feedbackBox.innerText = 'Debug Feedback: (waiting…)';
        feedbackBox.style.color = 'navy';
    } else {
        feedbackBox.innerText = `Debug Feedback: ${isCorrect ? "✓ Correct" : "✗ Incorrect"}`;
        feedbackBox.style.color = isCorrect ? 'green' : 'red';
    }
}

function updateDebugPretestInfo() {
    const box = document.getElementById('debug-pretest');
    if (box) {
        box.innerText = `Debug Pretest:\nErrors: ${error}\nAccumulated Errors: ${accumulatedError}\nStimulus Duration Time: ${stimulusTimeInMilliseconds}ms`;
    }
}

const resetTrial = {
    type: jsPsychCallFunction,
    func: () => {
        resetDebugInfo();
    }
};

const stimulusHTML = content => `
            <div class="fullscreen-centered-content stimulus-display-div">
                ${content}
            </div>`;

const blankScreen = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: stimulusHTML(''),
    choices: "NO_KEYS",
    trial_duration: 100
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

// =============================================================
// 3. TRIAL & BLOCK GENERATION FUNCTIONS
// =============================================================

function makeStimulus(content, choices, correctResponse, trialType) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: stimulusHTML(content),
        choices: choices,
        response_ends_trial: false,
        trial_duration: () => stimulusTimeInMilliseconds,
        post_trial_gap: 100,
        on_finish: function (data) {
            data.correct = data.response === correctResponse;
            currentPhaseData.push({
                    phase: currentPhase,
                    trial_type: trialType,
                    stimulus: content,
                    response: data.response,
                    correct_response: correctResponse,
                    correct: data.correct,
                    digit_accuracy: digitAccuracy,
                    letter_accuracy: letterAccuracy,
                    overall_accuracy: overallAccuracy,
                    rt: data.rt,
                    timestamp: Date.now()
                }
            )
            updateDebugFeedback(data.correct);
            updateDebugPretestInfo();
            if (trialType === 'digit') {
                recalculateDigitAccuracy(data.correct);
            } else if (trialType === 'letter') {
                recalculateLetterAccuracy(data.correct, correctResponse === " ");
            }
            updateDebugAccuracy();
        }
    };
}

const getRandomBlock = () => {
    return jsPsych.randomization.sampleWithoutReplacement(seriesData, 1)[0];
};


const generateDigitBlock = () => {
    const timeline = [];
    for (let i = 0; i < 10; i++) {
        pushRandomNumberStimulus(timeline);
        timeline.push(blankScreen);
    }
    return timeline;
};

const generateLetterBlock = () => {
    const timeline = [];
    const block = getRandomBlock();
    for (let i = 0; i < block.letters.length; i++) {
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
    for (let i = 0; i < block.letters.length; i++) {
        const letter = block.letters[i];
        const letterExpected = block.responses[i] === "1" ? " " : null;
        timeline.push(makeStimulus(letter, [' '], letterExpected, 'letter'));
        pushRandomNumberStimulus(timeline);
    }
    return timeline;
};

function setTrialPhase(phaseName) {
    return {
        type: jsPsychCallFunction,
        func: function () {
            currentPhase = phaseName;
        }
    };
}

// =============================================================
// 4. MAIN EXPERIMENT PHASE FUNCTIONS
// =============================================================

async function digitTrainingLoop() {
    while (digitAccuracy < accuracyThreshold) {
        resetDebugInfo();
        const toRun = generateDigitBlock();
        await jsPsych.run(toRun);
        if (digitAccuracy < accuracyThreshold) {
            await jsPsych.run([MESSAGES.repeatTraining]);
        }
    }
};

async function letterTrainingLoop() {
    while (letterAccuracy < accuracyThreshold) {
        resetDebugInfo();
        const toRun = generateLetterBlock();
        await jsPsych.run(toRun);
        if (letterAccuracy < accuracyThreshold) {
            await jsPsych.run([MESSAGES.repeatTraining]);
        }
    }
};

async function letterDigitTrainingLoop() {
    while (overallAccuracy < accuracyThreshold) {
        resetDebugInfo();
        const toRun = generateLetterDigitBlock();
        await jsPsych.run(toRun);
        if (overallAccuracy < accuracyThreshold) {
            await jsPsych.run([MESSAGES.repeatTraining]);
        }
    }
};

async function preTestLoop() {
    stimulusTimeInMilliseconds -= 100;
    updateDebugPretestInfo();
    while (error < 3 && accumulatedError < 5) {
        resetDebugInfo();
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
        if (accumulatedError >= 5) {
            pretestHCL = stimulusTimeInMilliseconds;
            pretestLCL = pretestHCL * 1.5;
            break;
        }
        await jsPsych.run([MESSAGES.pause]);
    }
}

async function halfOfMainTaskLoop() {
    const stimulusTimeInSeconds = stimulusTimeInMilliseconds / 1000;
    const taskTimeInSeconds = taskTimeInMinutes * 60;
    const blockTimeInSeconds = blockLength * 2 * stimulusTimeInSeconds;
    const repetitions = Math.floor(taskTimeInSeconds / blockTimeInSeconds / 2);
    for (i = 0; i < repetitions; i++) {
        resetDebugInfo();
        const toRun = generateLetterDigitBlock();
        await jsPsych.run(toRun);
    }
}

function pushRandomNumberStimulus(trials) {
    const number = jsPsych.randomization.sampleWithoutReplacement([1, 2, 3, 4, 6, 7, 8, 9], 1)[0];
    const correctKey = number % 2 === 0 ? '2' : '3';
    trials.push(makeStimulus(number, ['2', '3'], correctKey, 'digit'));
}

function finalizePhase(phaseName) {
    const inputId = `id_${phaseName}_data`;
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.value = JSON.stringify(currentPhaseData);
    } else {
        console.error(`Could not find input element with ID: ${inputId}`);
    }
    currentPhaseData = [];
}

// =============================================================
// 5. MAIN EXECUTION BLOCK
// =============================================================

const TLoadDBack = {
    init: function (otreeSettings, otreeSeriesData, stimulusTimeFromOtree = null) {
        jsPsych = initJsPsych({display_element: 'jspsych-target'});

        settings = otreeSettings;
        seriesData = otreeSeriesData;
        stimulusTimeInMilliseconds = stimulusTimeFromOtree || settings.stimulus_time_duration_pretest;
        blockLength = getRandomBlock().letters.length;
        resetDebugInfo();
    },

    runTrainingAndPretest: async function () {
        await jsPsych.run([{
            type: jsPsychPreload,
            images: INSTRUCTIONS.instruction_images
        }
            ,
            MESSAGES.welcome,
            INSTRUCTIONS.generalInstructions,
            INSTRUCTIONS.digitsInstructions,
            setTrialPhase("digit_training")
        ]);
        await digitTrainingLoop();
        finalizePhase('digit_training');
        await jsPsych.run(
            [
                resetTrial,
                MESSAGES.digitTrainingDone,
                INSTRUCTIONS.lettersInstructions,
                setTrialPhase("letter_training")]);
        await letterTrainingLoop();
        finalizePhase('letter_training');
        await jsPsych.run([
            resetTrial,
            MESSAGES.letterTrainingDone,
            INSTRUCTIONS.lettersDigitsInstructions,
            setTrialPhase("letter_digit_training")]);
        await letterDigitTrainingLoop();
        finalizePhase('letter_digit_training');
        await jsPsych.run([
            resetTrial,
            MESSAGES.pretestInstructions,
            setTrialPhase("pretest")]);
        await preTestLoop();
        finalizePhase('pretest');
        document.getElementById('id_pretest_hcl').value = pretestHCL;
        document.getElementById('id_pretest_lcl').value = pretestLCL;
    },
    runMainTask: async function (phaseNumber) {
        currentPhase = `main_task_${phaseNumber}`;
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