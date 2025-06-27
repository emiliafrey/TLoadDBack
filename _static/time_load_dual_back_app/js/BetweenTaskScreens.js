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
            <h1>WELCOME!</h1>
            <div class="key-prompt">Please press any key to see the task instructions.</div>`),
        choices: "ALL_KEYS",
    },
    pause: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
        <p>Let's take a break. Press any key when you feel rested and ready to continue. </p>`),
        choices: "ALL_KEYS",
    },
    repeatTraining: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`<h1>LET'S REPEAT IT!</h1><div class="key-prompt">Press any key to continue.</div>`),
        choices: "ALL_KEYS",
    },
    pretestInstructions:
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: createInstructionScreen(`
            <h1>CONGRATULATIONS!</h1>
            <p">You are ready to start the pretest. Take a long break first.</p>
                        <div class="key-prompt">Press any key when you feel rested and ready to continue.</div>`),
            choices: "ALL_KEYS",
        },
    digitTrainingDone: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
            <h1>WELL DONE!</h1>
            <p>Next, we'll move on with some letters.</p>
            <div class="key-prompt">Press any key to see the new instructions.</div>`),
        choices: "ALL_KEYS",
    },
    letterTrainingDone: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
            <h1>WELL DONE!</h1>
            <p>Now, let's do some letters and digits at the same time.</p>
            <div class="key-prompt">Press any key to see the new instructions.</div>`),
        choices: "ALL_KEYS",
    },
    pretestFinished:
        `
        <h1>CONGRATULATIONS! The pretest is finished.</h1>
        <p>Please click "Next" to start the main task.</p>`,
    gameBegin:
        `
        <h1>You will now get to play a game as a 15 minute break.</h1>
        <p>The experiment will automatically advance when the time is up. Please click "Next" to start the game.</p>`,
    mainTaskBreak:
        `
        <h1>Time to answer a questionnaire before continuing the task.</h1>
        <p>Please click "Next" to start the rest of the task.</p>`,
    gameCompleted:
        `
        <h1>You have completed the game and will now return to the main task.</h1>
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