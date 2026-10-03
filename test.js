// ==========================================
// TEST FORM
// ==========================================

const testForm = document.querySelector("#testForm");

if (testForm) {

    testForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let score = 0;
        let unanswered = 0;

        // ==========================================
        // CHECK ALL 10 QUESTIONS
        // ==========================================

        for (let i = 1; i <= 10; i++) {

            const answer = document.querySelector(
                'input[name="q' + i + '"]:checked'
            );

            // Check unanswered question
            if (!answer) {
                unanswered++;
                continue;
            }

            // Check correct answer
            if (answer.value === "correct") {
                score++;
            }
        }

        // ==========================================
        // VALIDATE ALL QUESTIONS
        // ==========================================

        if (unanswered > 0) {

            alert(
                "Please answer all 10 questions before submitting.\n\n" +
                "Unanswered questions: " + unanswered
            );

            return;
        }

        // ==========================================
        // CALCULATE RESULT
        // ==========================================

        const totalQuestions = 10;

        const percentage =
            (score / totalQuestions) * 100;

        // ==========================================
        // SAVE RESULT
        // ==========================================

        localStorage.setItem(
            "testScore",
            score
        );

        localStorage.setItem(
            "totalQuestions",
            totalQuestions
        );

        localStorage.setItem(
            "testPercentage",
            percentage
        );

        // ==========================================
        // GO TO RESULT PAGE
        // ==========================================

        window.location.href = "result.html";

    });

}