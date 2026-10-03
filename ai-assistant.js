
const chatForm = document.getElementById("chatForm");
const userMessage = document.getElementById("userMessage");
const chatMessages = document.getElementById("chatMessages");
const technologySelect = document.getElementById("technology");
const sendButton = document.getElementById("sendButton");

const API_URL = "http://127.0.0.1:5000/api/ai-assistant";

function addMessage(text, sender, isError = false) {
    const message = document.createElement("div");
    message.className = `message ${sender}-message`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = String(text);

    if (isError) {
        bubble.classList.add("error");
    }

    message.appendChild(bubble);
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;
}

chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = userMessage.value.trim();

    if (!message) {
        addMessage("Please enter your question.", "assistant", true);
        return;
    }

    addMessage(message, "user");

    userMessage.value = "";
    sendButton.disabled = true;
    sendButton.textContent = "Thinking...";

    const loadingMessage = addMessage(
        "Preparing your answer...",
        "assistant"
    );

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                message: message,
                technology: technologySelect
                    ? technologySelect.value
                    : "General"
            })
        });

        const responseText = await response.text();
        let data;

        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error(
                `Backend returned a non-JSON response (HTTP ${response.status}). ` +
                "Check the Flask terminal and the running app.py file."
            );
        }

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                `Request failed (HTTP ${response.status}).`
            );
        }

        const answer = data.reply || data.response;

        if (!answer) {
            throw new Error(
                data.error || "The backend returned an empty answer."
            );
        }

        loadingMessage.remove();
        addMessage(answer, "assistant");

    } catch (error) {
        loadingMessage.remove();

        console.error("SkillBridge AI error:", error);

        let messageToShow = error.message;

        if (error instanceof TypeError) {
            messageToShow =
                "Cannot connect to SkillBridge. Check that Flask is running " +
                "at http://127.0.0.1:5000.";
        }

        addMessage(messageToShow, "assistant", true);

    } finally {
        sendButton.disabled = false;
        sendButton.textContent = "Send ↗";
        userMessage.focus();
    }
});
