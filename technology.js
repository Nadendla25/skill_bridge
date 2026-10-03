// ========================================
// SkillBridge - Technology Selection
// ========================================


// Select technology
function selectTechnology(technologyName) {

    // Save selected technology
    localStorage.setItem(
        "selectedTechnology",
        technologyName
    );


    // Go to Notes page
    window.location.href = "notes.html";
}