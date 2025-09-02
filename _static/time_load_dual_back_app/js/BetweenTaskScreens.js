function createInstructionScreen(innerHTML) {
    return `
        <div class="fullscreen-centered-content instruction-box">
            ${innerHTML}
        </div>
    `;
}

function createCenteredContent(innerHTML) {
    return `
        <div class="fullscreen-centered-content">
            ${innerHTML}
        </div>
    `;
}

const MESSAGES = {
    welcome: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
            <p>You have now completed the setup and initial questionnaires and will now receive instructions and training for the main task. 
            Please make sure that you are in full screen (F11). From now on, please refrain from reloading the page or clicking outside of the current page, unless you are asked to do so.
            You must reach an accuracy of 85% in each training to reach the next level. Note that that the training performance does not yet affect your payout, 
            this is just to learn how the task works.</p>
            <div class="key-prompt">Please press Y to see the task instructions.</div>`),
        choices: 'y',
    },
    pause: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
        <p>Let's take a break. Press Y when you feel rested and ready to continue. </p>`),
        choices: 'y',
    },
    repeatTraining: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`<h1>LET'S REPEAT IT!</h1>
<div class="key-prompt">You need to reach 85% accuracy to continue. 
Press Y to continue.</div>`),
        choices: 'y',
    },
    pretestInstructions:
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: createInstructionScreen(`
            <h1>CONGRATULATIONS!</h1>
            <p>You have completed the training and are ready to start the pretest. 
                In the pretest, we will use an algorithm to determine your ideal speed for the main task. 
                Feel free to take a break first, so that you can give your best!</p>
                        <div class="key-prompt">Press Y when you feel rested and ready to continue.</div>`),
            choices: 'y',
        },
    digitTrainingDone: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
            <h1>WELL DONE!</h1>
            <p>Next, we'll move on with some letters.</p>
            <div class="key-prompt">Press Y to see the new instructions.</div>`),
        choices: 'y',
    },
    letterTrainingDone: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
            <h1>WELL DONE!</h1>
            <p>Now, let's do some letters and digits at the same time. 
            The overall accuracy will be determined by a formula containing the digit and letter accuracy.
            Don't worry about it, just do your best to reach 85% overall accuracy.</p>
            <div class="key-prompt">Press Y to see the new instructions.</div>`),
        choices: 'y',
    },
    mainTaskBeginning: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(
            `
        <p>You will now see the instructions again. If you remember what to do, feel free to skip through them. </p>
        <div class="key-prompt">Press Y to continue.</div>`),
        choices: 'y',
    },
    betweenMainTaskScreens: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`<p>Loading the next round...</p>`),
        choices: "NO_KEYS",
        trial_duration: 5000
    },

    pretestFinished:
        `
        <h1>CONGRATULATIONS! The pretest is finished.</h1>
        <p>You will now continue with the main task. 
        From now on, the achieved task accuracy will affect your payout. 
        Please click "Next" to start the main task.</p>`,
    gameBegin:
        `
        <h1>Task Block 1 is finished!</h1>
        <p>Now, there will be some questions and then you get to play a game as a 10 minute break. 
        Some buttons are disabled so that you do not leave the page. At the start of the game, you are told to press the spacebar, but this is incorrect: you must click on the game screen.
        The experiment will automatically advance when the time is up. 
        Please click "Next" to advance to the questions.</p>`,
    mainTaskBreak:
        `
        <h1>Please answer some questions before continuing the task.</h1>
        <p>Please click "Next" to to advance to the questions.</p>`,
    gameCompleted:
        `
        <h1>You will now return to the main task.</h1>
        <p>Please click "Next" to start the main task again.</p>`,
    mainTaskCompleted:
        `
        <h1>You have finished the task!</h1>
        <p>Please click "Next" to continue.</p>`,


}

const INSTRUCTIONS = {
    pretestInstructionImages: [
        '/static/time_load_dual_back_app/images/pretest/General_Instructions.bmp',
        '/static/time_load_dual_back_app/images/pretest/Digits_Instructions.bmp',
        '/static/time_load_dual_back_app/images/pretest/Letters_Instructions.bmp',
        '/static/time_load_dual_back_app/images/pretest/Letters_Digits_Instructions.bmp',
    ],
    mainTaskInstructionImages: [
        '/static/time_load_dual_back_app/images/test/Main_Task_Intro.bmp',
        '/static/time_load_dual_back_app/images/test/Main_Task_Instructions.bmp',
        '/static/time_load_dual_back_app/images/test/Main_Task_Disclaimer.bmp',
    ],
    generalInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/time_load_dual_back_app/images/pretest/General_Instructions.bmp" style="max-width: 100%">`),
        choices: ['y']
    },
    digitsInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/time_load_dual_back_app/images/pretest/Digits_Instructions.bmp" style="max-width: 100%">`),
        choices: ['y'],
    },
    lettersInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/time_load_dual_back_app/images/pretest/Letters_Instructions.bmp" style="max-width: 100%">`),
        choices: ['y'],
    },
    lettersDigitsInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/time_load_dual_back_app/images/pretest/Letters_Digits_Instructions.bmp" style="max-width: 100%">`),
        choices: ['y'],
    },
    mainTaskIntro: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/time_load_dual_back_app/images/test/Main_Task_Intro.bmp" style="max-width: 100%">`),
        choices: ['y'],
    },
    mainTaskInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/time_load_dual_back_app/images/test/Main_Task_Instructions.bmp" style="max-width: 100%">`),
        choices: ['y'],
    },
    mainTaskDisclaimer: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/time_load_dual_back_app/images/test/Main_Task_Disclaimer.bmp" style="max-width: 100%">`),
        choices: ['y'],
    },
}