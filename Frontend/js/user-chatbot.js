/* ==========================================
        EVENTAI USER AI CHATBOT
        BACKEND LLM VERSION
========================================== */

console.log(
    "EventAI User AI Chatbot Backend Version Loaded"
);


/* ==========================================
        ELEMENTS
========================================== */

const chatMessages =
    document.getElementById("chatMessages");

const userMessage =
    document.getElementById("userMessage");

const sendMessage =
    document.getElementById("sendMessage");

const loggedUserName =
    document.getElementById("loggedUserName");


/* ==========================================
        CURRENT USER
========================================== */

let currentUser = null;


/* ==========================================
        ESCAPE HTML
========================================== */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;
}


/* ==========================================
        FORMAT AI RESPONSE
========================================== */

function formatAIResponse(message) {

    if (!message) {
        return "";
    }

    let formatted =
        escapeHtml(message);


    // ======================================
    // Markdown headings
    // ======================================

    formatted = formatted.replace(
        /^###\s+(.*)$/gm,
        "<strong>$1</strong>"
    );

    formatted = formatted.replace(
        /^##\s+(.*)$/gm,
        "<strong>$1</strong>"
    );

    formatted = formatted.replace(
        /^#\s+(.*)$/gm,
        "<strong>$1</strong>"
    );


    // ======================================
    // Markdown bold
    // ======================================

    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // ======================================
    // Markdown bullets
    // ======================================

    formatted = formatted.replace(
        /^[-•]\s+(.*)$/gm,
        "• $1"
    );


    // ======================================
    // Line breaks
    // ======================================

    formatted = formatted.replace(
        /\n/g,
        "<br>"
    );


    return formatted;
}


/* ==========================================
        ADD MESSAGE
========================================== */

function addMessage(
    message,
    sender
) {

    if (!chatMessages) {
        return;
    }


    const div =
        document.createElement("div");


    div.className =
        sender === "user"
            ? "user-message"
            : "bot-message";


    div.innerHTML = `

        <div class="message">

            ${formatAIResponse(message)}

        </div>

    `;


    chatMessages.appendChild(div);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* ==========================================
        SHOW AI TYPING
========================================== */

function showTyping() {

    if (!chatMessages) {
        return;
    }


    removeTyping();


    const div =
        document.createElement("div");


    div.className =
        "bot-message";


    div.id =
        "aiTyping";


    div.innerHTML = `

        <i class="fa-solid fa-robot"></i>

        <div class="message">

            <span class="typing-text">

                EventAI is thinking...

            </span>

        </div>

    `;


    chatMessages.appendChild(div);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* ==========================================
        REMOVE AI TYPING
========================================== */

function removeTyping() {

    const typing =
        document.getElementById(
            "aiTyping"
        );


    if (typing) {

        typing.remove();

    }
}


/* ==========================================
        LOAD CURRENT USER
========================================== */

async function loadCurrentUser() {

    try {

        currentUser =
            await Api.me();


        console.log(
            "Current user:",
            currentUser
        );


        if (loggedUserName) {

            const fullName =

                `${currentUser.first_name || ""} ` +
                `${currentUser.last_name || ""}`;


            loggedUserName.textContent =
                fullName.trim() || "User";
        }


    } catch (error) {

        console.error(
            "Could not load current user:",
            error
        );


        if (loggedUserName) {

            loggedUserName.textContent =
                "User";

        }
    }
}


/* ==========================================
        SEND MESSAGE TO BACKEND LLM
========================================== */

async function sendUserMessage() {

    if (!userMessage) {
        return;
    }


    const message =
        userMessage.value.trim();


    if (!message) {
        return;
    }


    /* ======================================
       DISPLAY USER MESSAGE
    ====================================== */

    addMessage(
        message,
        "user"
    );


    userMessage.value = "";


    /* ======================================
       DISABLE SEND BUTTON
    ====================================== */

    if (sendMessage) {

        sendMessage.disabled = true;

    }


    /* ======================================
       SHOW AI THINKING
    ====================================== */

    showTyping();


    try {

        console.log(
            "User AI Question:",
            message
        );


        /*
         USER-SPECIFIC BACKEND ENDPOINT

         POST /ai/chat/user

         Backend determines current user
         using JWT.

         Frontend never sends user_id.
        */

        const response =
            await Api.userChat(
                message
            );


        console.log(
            "User AI Response:",
            response
        );


        removeTyping();


        /* ==================================
           VALIDATE RESPONSE
        ================================== */

        if (
            !response ||
            !response.answer
        ) {

            addMessage(
                "I could not generate a response.",
                "bot"
            );

            return;
        }


        /* ==================================
           DISPLAY AI RESPONSE
        ================================== */

        addMessage(
            response.answer,
            "bot"
        );


    } catch (error) {

        removeTyping();


        console.error(
            "User AI chatbot failed:",
            error
        );


        addMessage(

            error.message ||

            "Unable to contact the EventAI assistant. Please try again.",

            "bot"
        );


    } finally {


        /* ==================================
           ENABLE SEND BUTTON
        ================================== */

        if (sendMessage) {

            sendMessage.disabled = false;

        }


        /* ==================================
           RETURN FOCUS
        ================================== */

        if (userMessage) {

            userMessage.focus();

        }
    }
}

/* ==========================================
        SEND MESSAGE
========================================== */

async function sendUserMessage() {

    if (!userMessage) {
        return;
    }

    const question =
        userMessage.value.trim();

    if (!question) {
        return;
    }

    // Show user's question
    addMessage(
        question,
        "user"
    );

    // Clear input
    userMessage.value = "";

    // Disable send while processing
    if (sendMessage) {
        sendMessage.disabled = true;
    }

    showTyping();

    try {

        console.log(
            "User AI Question:",
            question
        );

        // New authenticated user AI endpoint
        const response =
            await Api.userChat(
                question
            );

        console.log(
            "User AI Response:",
            response
        );

        removeTyping();

        if (
            !response ||
            !response.answer
        ) {

            addMessage(
                "I could not generate a response.",
                "bot"
            );

            return;
        }

        addMessage(
            response.answer,
            "bot"
        );

    } catch (error) {

        removeTyping();

        console.error(
            "EventAI chatbot error:",
            error
        );

        addMessage(
            error.message ||
            "Unable to contact EventAI. Please try again.",
            "bot"
        );

    } finally {

        if (sendMessage) {
            sendMessage.disabled = false;
        }

        if (userMessage) {
            userMessage.focus();
        }
    }
}


/* ==========================================
        SEND BUTTON
========================================== */

if (sendMessage) {

    sendMessage.addEventListener(
        "click",
        sendUserMessage
    );
}


/* ==========================================
        ENTER KEY
========================================== */

if (userMessage) {

    userMessage.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendUserMessage();

            }
        }
    );
}


/* ==========================================
        INITIALIZE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadCurrentUser();


        if (userMessage) {

            userMessage.focus();

        }
    }
);


/* ==========================================
        GLOBAL
========================================== */

window.sendUserMessage =
    sendUserMessage;