// ==========================================
// PROFILE
// ==========================================

const currentUser =
    localStorage.getItem("currentUser");

const storedUser =
    localStorage.getItem("skillBridgeUser");


// ==========================================
// DISPLAY USER NAME
// ==========================================

const profileName =
    document.querySelector("#profileName");

if (profileName && currentUser) {

    profileName.textContent =
        currentUser;

}


// ==========================================
// DISPLAY EMAIL
// ==========================================

const profileEmail =
    document.querySelector("#profileEmail");

if (profileEmail && storedUser) {

    const user =
        JSON.parse(storedUser);

    profileEmail.textContent =
        user.email;

}