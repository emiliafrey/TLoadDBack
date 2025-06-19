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
    pretestFinished: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
            <h1>CONGRATULATIONS!</h1>
            <p>The pretest is finished. Press any key to continue.</p>`),
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
    breakBegin:
        `
        <h1>Time for a 15 minute break!.</h1>
        <p>Please click "Next" to continue.</p>`,
}

const INSTRUCTIONS = {
    instruction_images: [
        '/static/images/pretest/General_Instructions_REMADE.bmp',
        '/static/images/pretest/Digits_Instructions_REMADE.bmp',
        '/static/images/pretest/Letters_Instructions_REMADE.bmp',
        '/static/images/pretest/Letters_Digits_Instructions_REMADE.bmp'
    ],
    generalInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/images/pretest/General_Instructions_REMADE.bmp" style="max-width: 100%">`),
        choices: ['y']
    },
    digitsInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/images/pretest/Digits_Instructions_REMADE.bmp" style="max-width: 100%">`),
        choices: ['y'],
    },
    lettersInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/images/pretest/Letters_Instructions_REMADE.bmp" style="max-width: 100%">`),
        choices: ['y'],
    },
    lettersDigitsInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createCenteredContent(`<img src="/static/images/pretest/Letters_Digits_Instructions_REMADE.bmp" style="max-width: 100%">`),
        choices: ['y'],
    },
}