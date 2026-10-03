// ==========================================
// PRACTICE SELECTION
// ==========================================

const practiceButtons =
    document.querySelectorAll(".practice-btn");

practiceButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const card =
            button.closest(".practice-card");

        const technology =
            card.querySelector(".technology-name")
                .textContent.trim();

        localStorage.setItem(
            "selectedPracticeTechnology",
            technology
        );

        alert(
            "Practice Selected!\n\n" +
            "Technology: " + technology
        );

    });

});