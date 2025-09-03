# oTree Implementation of the TloadDback Task

This repository contains a browser-based implementation of the TloadDback task, a cognitive stressor designed to induce mental fatigue. The task was developed from scratch for the [oTree](https://www.otree.org/) platform to ensure seamless integration into a web-based experimental flow and utilizes the [jsPsych](https://www.jspsych.org/) library for precise trial presentation and data collection.

This implementation was created as part of the bachelor thesis, *"Evaluating the Influence of Playing Casual Video Games as a Recovery Activity from Work-induced Mental Fatigue Using Physiological Data"* by Emilia Frey at the Karlsruhe Institute of Technology (KIT).

This implementation is based on the TloadDback task designed and described by Borragán et al. The core logic, stimuli, and adaptive procedure are based on the following works:

*   **The Paper:**
    > Borragán, Slama, Bartolomei and Peigneux. 2017. [Cognitive Fatigue: A Time-Based Resource-Sharing Account.](https://doi.org/10.1016/j.cortex.2017.01.023) Cortex 89: 71–84. doi:10.1016/j.cortex.2017.01.023.

*   **The Original Software:**
    > The reference implementation (`.rar` file), on which the parameters for this project were based, is available on the [Open Science Framework](https://osf.io/ay6er/files/osfstorage).
    

## Task Description

The TloadDback task is a dual-task paradigm that presents an alternating sequence of visual stimuli (a letter followed by a digit) and requires participants to perform two sub-tasks simultaneously.

### Rules
1.  **Letter Task (1-Back):** When a letter is displayed, the participant must perform a 1-back task.
    *   If the current letter is the **same** as the previous letter, the participant must press the **spacebar**.
    *   If the current letter is **different**, the participant must **inhibit their response** (do nothing).

2.  **Digit Task (Parity Judgment):** When a digit is displayed, the participant must perform a parity judgment task.
    *   If the digit is **even**, the participant must press the **'2' key**.
    *   If the digit is **odd**, the participant must press the **'3' key**.

### Stimuli
-   **Digits:** The digit '5' is excluded to ensure an equal number of even and odd trials.
-   **Letters:** The letter set is based on high-frequency letters (>2.5%) in the French and German languages to ensure familiarity.

## Key Features

-   **Browser-Based:** Runs entirely within the oTree framework, eliminating the need for external software and minimizing distractions.
-   **Adaptive Difficulty:** Includes a pre-test phase that calibrates the stimulus duration to the individual participant's performance threshold.
    - Compared to the original version, the pre-test ist shorter to prevent excessive fatigue before the main task.
-   **Structured Phases:** The task is divided into three distinct phases, though training and pre-test are seen as one phase (pre-test) in the papers:
    1.  **Training:** Familiarizes the participant with the rules for each sub-task individually and then combined.
    2.  **Pre-Test:** An adaptive procedure that decreases stimulus duration based on performance to find a challenging but manageable speed for the main task.
    3.  **Main Task:** Two 16-minute blocks at the calibrated speed, designed to induce cognitive fatigue.
-   **Detailed Performance Logging:** Records trial-by-trial data, including stimuli, responses, and reaction times, which are used to calculate weighted accuracy scores.

## Technical Implementation

-   **Framework:** oTree
-   **Backend Logic:** Python
-   **Frontend & Task Logic:** JavaScript, leveraging the jsPsych library.
-   **Structure:** HTML & CSS

## Performance Metrics

Overall performance is calculated using a weighted accuracy score to account for the different sub-tasks and trial types.

1.  **Digit Accuracy:**
    ```
    Acc_digit = (Correct Digit Targets) / (Total Digit Targets)
    ```
2.  **Letter Accuracy** (weighted for target vs. non-target trials):
    ```
    Acc_letter_target = (Correct Letter Targets) / (Total Letter Targets)
    Acc_nontarget = (Correct Letter Non-Targets) / (Total Letter Non-Targets)

    Acc_letter = (0.65 * Acc_target) + (0.35 * Acc_nontarget)
    ```
3.  **Overall Accuracy:**
    ```
    Acc_overall = (0.65 * Acc_letter) + (0.35 * Acc_digit)
    ```

## Usage

This task is designed as an app within an oTree project (steps 1 and 2), but can also be run standalone (step 2). It is recommended to use a virtual environment.

1. Integrate the app into your oTree project by copying the app folder into your project's directory, then refactoring as necessary.
2. Run the oTree server using `otree devserver`.

## Citation

If you use this implementation in your research, you can cite the following thesis:

> Frey, E. (2025). *Evaluating the Influence of Playing Casual Video Games as a Recovery Activity from Work-induced Mental Fatigue Using Physiological Data* [Bachelor Thesis, Karlsruhe Institute of Technology].