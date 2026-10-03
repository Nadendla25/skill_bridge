// ==========================================
// ROADMAP FILTER
// ==========================================

const filterButtons =
    document.querySelectorAll(".filter-btn");

const roadmapCards =
    document.querySelectorAll(".roadmap-card");

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedFilter =
            button.getAttribute("data-filter");

        roadmapCards.forEach(function(card) {

            const category =
                card.getAttribute("data-category");

            if (
                selectedFilter === "all" ||
                category === selectedFilter
            ) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }

        });

    });

});


// ==========================================
// ROADMAP SELECTION
// ==========================================

const roadmapButtons =
    document.querySelectorAll(".roadmap-btn");

roadmapButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const card =
            button.closest(".roadmap-card");

        const technology =
            card.querySelector(".technology-name")
                .textContent.trim();

        const roadmapName =
            card.querySelector("h2")
                .textContent.trim();

        localStorage.setItem(
            "selectedRoadmapTechnology",
            technology
        );

        localStorage.setItem(
            "selectedRoadmap",
            roadmapName
        );

        alert(
            "Roadmap Selected!\n\n" +
            "Technology: " + technology +
            "\nRoadmap: " + roadmapName
        );

    });

});