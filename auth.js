const API_URL = "http://127.0.0.1:5000";


// ==========================================
// REGISTER
// ==========================================

async function registerUser() {

    const fullName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!fullName || !email || !password) {

        alert("Please fill all fields.");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password
            })

        });


        const data = await response.json();


        if (response.ok) {

            alert("Registration successful!");

            window.location.href = "login.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error("Register Error:", error);

        alert("Unable to connect to SkillBridge backend.");

    }
}



// ==========================================
// LOGIN
// ==========================================

async function loginUser() {

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;


    if (!email || !password) {

        alert("Please enter email and password.");

        return;
    }


    try {

        const response = await fetch(`${API_URL}/api/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: email,

                password: password

            })

        });


        const data = await response.json();


        console.log("Login Response:", data);


        if (response.ok) {

            // Save logged-in user
            localStorage.setItem(
                "currentUser",
                JSON.stringify(data.user)
            );


            localStorage.setItem(
                "skillBridgeUser",
                JSON.stringify(data.user)
            );


            alert("Login successful!");


            // Go to Technology page
            window.location.href = "technology.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error("Login Error:", error);

        alert("Unable to connect to SkillBridge backend.");

    }
}