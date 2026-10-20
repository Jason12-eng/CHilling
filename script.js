
// QUESTIONS


const questions = [

    {
        question: "Which is the largest animal in the world?",

        answers: [
            {
                text: "Shark",
                correct: false
            },

            {
                text: "Blue whale",
                correct: true
            },

            {
                text: "Elephant",
                correct: false
            },

            {
                text: "Giraffe",
                correct: false
            }
        ]
    },


    {
        question: "What is the capital of Cambodia?",

        answers: [
            {
                text: "Siem Reap",
                correct: false
            },

            {
                text: "Phnom Penh",
                correct: true
            },

            {
                text: "Battambang",
                correct: false
            },

            {
                text: "Kampot",
                correct: false
            }
        ]
    },


    {
        question: "Which language runs in the browser?",

        answers: [
            {
                text: "Java",
                correct: false
            },

            {
                text: "C#",
                correct: false
            },

            {
                text: "JavaScript",
                correct: true
            },

            {
                text: "Python",
                correct: false
            }
        ]
    }

];



// GET HTML ELEMENTS


// Home button
const startButton =
    document.getElementById("start-btn");


// Popup
const popup =
    document.getElementById("popping-info");

const overlay =
    document.getElementById("popup-overlay");


// Popup buttons
const exitButton =
    document.getElementById("exit-btn");

const continueButton =
    document.getElementById("continue-btn");


// Quiz
const quizSection =
    document.getElementById("quiz-section");

const quizContent =
    document.getElementById("quiz-content");

const questionElement =
    document.getElementById("question");

const answersElement =
    document.getElementById("answers");

const nextButton =
    document.getElementById("next-btn");

const resultBox =
    document.getElementById("result-box");

const resultPercent =
    document.getElementById("result-percent");

const resultScore =
    document.getElementById("result-score");

const retryButton =
    document.getElementById("retry-btn");

const homeButton =
    document.getElementById("home-btn");



// QUIZ VARIABLES


let currentQuestion = 0;

let score = 0;


// START BUTTON


startButton.addEventListener("click", function () {

    // Show popup
    popup.classList.add("active");

    // Show blur
    overlay.classList.add("active");

});



// EXIT QUIZ GUIDE


exitButton.addEventListener("click", function () {

    // Hide popup
    popup.classList.remove("active");

    // Remove blur
    overlay.classList.remove("active");

});


// CONTINUE BUTTON


continueButton.addEventListener("click", function () {

    // Hide popup
    popup.classList.remove("active");

    // Remove blur
    overlay.classList.remove("active");

    // Show quiz
    quizSection.classList.add("active");

    startQuiz();

});


function startQuiz() {

    currentQuestion = 0;
    score = 0;

    quizContent.style.display = "block";
    resultBox.classList.remove("active");
    nextButton.style.display = "block";

    showQuestion();

}


// SHOW QUESTION


function showQuestion() {

    // Get current question
    const question =
        questions[currentQuestion];


    // Display question
    questionElement.textContent =
        (currentQuestion + 1) +
        ". " +
        question.question;


    // Remove old answers
    answersElement.innerHTML = "";


    // Create answer buttons
    question.answers.forEach(function (answer) {

        // Create button
        const button =
            document.createElement("button");


        // Put answer text inside button
        button.textContent =
            answer.text;


        // Add CSS class
        button.classList.add("answer");


        // Store correct / wrong
        button.dataset.correct =
            answer.correct;


        // Add click event
        button.addEventListener(
            "click",
            selectAnswer
        );


        // Add button to page
        answersElement.appendChild(button);

    });

}



// SELECT ANSWER


function selectAnswer(event) {

    // Get clicked button
    const clickedButton =
        event.target;


    // Check whether answer is correct
    const isCorrect =
        clickedButton.dataset.correct === "true";


    // If correct
    if (isCorrect) {

        // Turn green
        clickedButton.classList.add("correct");

        // Increase score
        score++;

    }

    // If wrong
    else {

        // Turn red
        clickedButton.classList.add("wrong");

        // Show correct answer
        showCorrectAnswer();

    }


    // Get every answer button
    const allAnswers =
        document.querySelectorAll(".answer");


    // Disable all answers
    allAnswers.forEach(function (button) {

        button.disabled = true;

    });

}



// SHOW CORRECT ANSWER


function showCorrectAnswer() {

    const allAnswers =
        document.querySelectorAll(".answer");


    allAnswers.forEach(function (button) {

        if (button.dataset.correct === "true") {

            button.classList.add("correct");

        }

    });

}



// NEXT BUTTON


nextButton.addEventListener("click", function () {

    // Move to next question
    currentQuestion++;


    // Check if there are more questions
    if (currentQuestion < questions.length) {

        showQuestion();

    }

    // Quiz finished
    else {

        showResult();

    }

});


function showResult() {

    const percentage = Math.round((score / questions.length) * 100);
    const ring = document.getElementById("score-ring");

    resultPercent.textContent = "0%";
    resultScore.textContent = `Your Score ${score} out of ${questions.length}`;

    ring.style.setProperty("--result-angle", "0%");

    quizContent.style.display = "none";
    resultBox.classList.add("active");
    nextButton.style.display = "none";

    let currentValue = 0;
    const duration = 1250;
    const startTime = performance.now();

    function animateResult(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const displayed = Math.round(eased * percentage);

        resultPercent.textContent = `${displayed}%`;
        ring.style.setProperty("--result-angle", `${displayed}%`);

        if (progress < 1) {
            requestAnimationFrame(animateResult);
        }
    }

    requestAnimationFrame(animateResult);

}


retryButton.addEventListener("click", function () {

    startQuiz();

});


homeButton.addEventListener("click", function () {

    quizSection.classList.remove("active");
    resultBox.classList.remove("active");
    quizContent.style.display = "block";
    nextButton.style.display = "block";
    overlay.classList.remove("active");

});


startButton.addEventListener("click", function () {

    popup.classList.add("active");
    overlay.classList.add("active");

});