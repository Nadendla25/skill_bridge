// ==========================================
// RESULT
// ==========================================

const score =
    localStorage.getItem("testScore");

const totalQuestions =
    localStorage.getItem("totalQuestions");

const percentage =
    localStorage.getItem("testPercentage");


// ==========================================
// DISPLAY SCORE
// ==========================================

const scoreElement =
    document.querySelector("#score");

if (
    scoreElement &&
    score !== null &&
    totalQuestions !== null
) {

    scoreElement.textContent =
        score + " / " + totalQuestions;

}


// ==========================================
// DISPLAY PERCENTAGE
// ==========================================

const percentageElement =
    document.querySelector("#percentage");

if (
    percentageElement &&
    percentage !== null
) {

    percentageElement.textContent =
        "Percentage: " +
        percentage + "%";

}