function createInstructionScreen(innerHTML) {
    return `
        <div class="fullscreen-centered-content instruction-box">
            ${innerHTML}
        </div>
    `;
}

const MESSAGES = {
    welcome: {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: createInstructionScreen(`
            <h1>WELCOME</h1>
            <div class="key-prompt">Please press any key to see the task instructions.</div>`),
                choices: "ALL_KEYS",
            },
    pause: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
        <p>PAUSE: Let's take a break. Press any key to continue. </p>`),
        choices: "ALL_KEYS",
    },
    pretestFinished: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: createInstructionScreen(`
            <h1>CONGRATULATIONS!</h1>
            <p>THE PRETEST IS FINISHED.</p>`),
        choices: "NO_KEYS",
        trial_duration: 6000,
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
            <p">You are ready to start the Pretest. Take a long break first.</p>
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
        stimulus: `<img src="/static/images/pretest/General_Instructions_REMADE.bmp" style="max-width: 100%">`,
        choices: ['y']
    },
    digitsInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<img src="/static/images/pretest/Digits_Instructions_REMADE.bmp" style="max-width: 100%">`,
        choices: ['y'],
        on_finish: function () {
            currentPhase = "digit training";
        }
    },
    lettersInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<img src="/static/images/pretest/Letters_Instructions_REMADE.bmp" style="max-width: 100%">`,
        choices: ['y'],
        on_finish: function () {
            currentPhase = "letter training";
        }
    },
    lettersDigitsInstructions: {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<img src="/static/images/pretest/Letters_Digits_Instructions_REMADE.bmp" style="max-width: 100%">`,
        choices: ['y'],
        on_finish: function () {
            currentPhase = "pre-pre-test";
        }
    },
}