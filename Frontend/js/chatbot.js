/* ==========================================
        EVENTAI AI CHATBOT
========================================== */

console.log(
    "EventAI AI Chatbot Backend Version Loaded"
);


/* ==========================================
        ELEMENTS
========================================== */

const userInput =
    document.getElementById("userInput");

const sendBtn =
    document.getElementById("sendBtn");

const chatContainer =
    document.getElementById("chatContainer");

const chatScope =
    document.getElementById("chatScope");

const eventSelect =
    document.getElementById("eventSelect");

const eventSelectorWrapper =
    document.getElementById(
        "eventSelectorWrapper"
    );


/* ==========================================
        STATE
========================================== */

let events = [];

let isSending = false;


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

function formatAnswer(answer) {

    return escapeHtml(answer)
        .replace(/\n/g, "<br>");

}


/* ==========================================
        SCROLL CHAT
========================================== */

function scrollChat() {

    if (!chatContainer) {
        return;
    }

    chatContainer.scrollTop =
        chatContainer.scrollHeight;

}


/* ==========================================
        ADD USER MESSAGE
========================================== */

function addUserMessage(message) {

    if (!chatContainer) {
        return;
    }

    chatContainer.insertAdjacentHTML(
        "beforeend",
        `

        <div class="user-message">

            <div class="message">

                ${escapeHtml(message)}

            </div>

        </div>

        `
    );

    scrollChat();

}


/* ==========================================
        ADD BOT MESSAGE
========================================== */

function addBotMessage(message) {

    if (!chatContainer) {
        return;
    }

    chatContainer.insertAdjacentHTML(
        "beforeend",
        `

        <div class="bot-message">

            <i class="fa-solid fa-robot"></i>

            <div class="message">

                ${formatAnswer(message)}

            </div>

        </div>

        `
    );

    scrollChat();

}


/* ==========================================
        LOADING MESSAGE
========================================== */

function showLoadingMessage() {

    if (!chatContainer) {
        return;
    }

    chatContainer.insertAdjacentHTML(
        "beforeend",
        `

        <div
            class="bot-message"
            id="aiLoadingMessage"
        >

            <i class="fa-solid fa-robot"></i>

            <div class="message">

                <i class="fa-solid fa-spinner fa-spin"></i>

                EventAI is thinking...

            </div>

        </div>

        `
    );

    scrollChat();

}


function removeLoadingMessage() {

    const loading =
        document.getElementById(
            "aiLoadingMessage"
        );

    if (loading) {
        loading.remove();
    }

}


/* ==========================================
        LOAD EVENTS
========================================== */

async function loadEvents() {

    try {

        const data =
            await Api.events.list();

        events =
            Array.isArray(data)
                ? data
                : [];

        if (!eventSelect) {
            return;
        }

        eventSelect.innerHTML = `

            <option value="">
                Select Event
            </option>

        `;


        events.forEach(event => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                event.id;

            option.textContent =
                event.event_name ||
                `Event ${event.id}`;

            eventSelect.appendChild(
                option
            );

        });


        console.log(
            "Chatbot events loaded:",
            events
        );


    } catch (error) {

        console.error(
            "Could not load events:",
            error
        );

    }

}


/* ==========================================
        CHANGE CHAT SCOPE
========================================== */

function updateScopeUI() {

    if (
        !chatScope ||
        !eventSelectorWrapper
    ) {
        return;
    }


    if (
        chatScope.value === "event"
    ) {

        eventSelectorWrapper.style.display =
            "block";

    } else {

        eventSelectorWrapper.style.display =
            "none";

        if (eventSelect) {
            eventSelect.value = "";
        }

    }

}


/* ==========================================
        SEND QUESTION
========================================== */

async function sendQuestion(
    question = null
) {

    if (isSending) {
        return;
    }


    const text = String(
        question ??
        userInput?.value ??
        ""
    ).trim();


    if (!text) {
        return;
    }


    let eventId = null;


    /* ------------------------------------------
        EVENT-SPECIFIC MODE
    ------------------------------------------ */

    if (
        chatScope &&
        chatScope.value === "event"
    ) {

        if (
            !eventSelect ||
            !eventSelect.value
        ) {

            alert(
                "Please select an event first."
            );

            return;
        }

        eventId =
            Number(eventSelect.value);

    }


    /* ------------------------------------------
        DISPLAY USER MESSAGE
    ------------------------------------------ */

    addUserMessage(text);


    if (userInput) {
        userInput.value = "";
    }


    /* ------------------------------------------
        CALL BACKEND AI
    ------------------------------------------ */

    try {

        isSending = true;

        if (sendBtn) {
            sendBtn.disabled = true;
        }


        showLoadingMessage();


        console.log(
            "AI Question:",
            {
                eventId,
                question: text
            }
        );


        const response =
            await Api.chat(
                eventId,
                text
            );


        removeLoadingMessage();


        console.log(
            "AI Response:",
            response
        );


        addBotMessage(
            response?.answer ||
            "The requested information is not available."
        );


    } catch (error) {

        removeLoadingMessage();


        console.error(
            "AI chatbot failed:",
            error
        );


        addBotMessage(
            error.message ||
            "Unable to get a response from EventAI."
        );


    } finally {

        isSending = false;

        if (sendBtn) {
            sendBtn.disabled = false;
        }

        if (userInput) {
            userInput.focus();
        }

    }

}


/* ==========================================
        QUICK QUESTION
========================================== */

function askQuestion(question) {

    sendQuestion(question);

}


/* ==========================================
        SEND BUTTON
========================================== */

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        () => {

            sendQuestion();

        }
    );

}


/* ==========================================
        ENTER KEY
========================================== */

if (userInput) {

    userInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendQuestion();

            }

        }
    );

}


/* ==========================================
        SCOPE CHANGE
========================================== */

if (chatScope) {

    chatScope.addEventListener(
        "change",
        updateScopeUI
    );

}


/* ==========================================
        INITIALIZE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        updateScopeUI();

        await loadEvents();

        if (userInput) {
            userInput.focus();
        }

    }
);


/* ==========================================
        GLOBAL FUNCTIONS
========================================== */

window.askQuestion =
    askQuestion;

window.sendQuestion =
    sendQuestion;