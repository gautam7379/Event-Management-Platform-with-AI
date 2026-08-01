/* ==========================================
            EVENTAI AI CHATBOT
========================================== */

/* ==========================================
            LOCAL STORAGE
========================================== */

function getEvents() {

    return JSON.parse(

        localStorage.getItem("events")

    ) || [];

}

function getAttendees() {

    return JSON.parse(

        localStorage.getItem("attendees")

    ) || [];

}

function getTickets() {

    return JSON.parse(

        localStorage.getItem("tickets")

    ) || [];

}

/* ==========================================
            CURRENT USER
========================================== */

const currentUser = {

    name:

        localStorage.getItem("userName") ||

        "Guest",

    email:

        localStorage.getItem("userEmail") ||

        "",

    role:

        localStorage.getItem("userRole") ||

        "user"

};

/* ==========================================
            ELEMENTS
========================================== */

const chatContainer =

    document.getElementById("chatContainer");

const input =

    document.getElementById("userInput");

const sendBtn =

    document.getElementById("sendBtn");

/* ==========================================
            LOAD USER
========================================== */

function loadUser(){

    const user =

        document.getElementById("loggedUserName");

    if(user){

        user.textContent =

            currentUser.name;

    }

}

/* ==========================================
            USER MESSAGE
========================================== */

function addUserMessage(message){

    chatContainer.innerHTML += `

    <div class="user-message">

        <div class="message">

            ${message}

        </div>

        <i class="fa-solid fa-user"></i>

    </div>

    `;

    scrollBottom();

}

/* ==========================================
            BOT MESSAGE
========================================== */

function addBotMessage(message){

    chatContainer.innerHTML += `

    <div class="bot-message">

        <i class="fa-solid fa-robot"></i>

        <div class="message">

            ${message}

        </div>

    </div>

    `;

    scrollBottom();

}

/* ==========================================
            SCROLL
========================================== */

function scrollBottom(){

    chatContainer.scrollTop =

        chatContainer.scrollHeight;

}
/* ==========================================
            AI RESPONSE ENGINE
========================================== */

function generateResponse(question) {

    const query = question.toLowerCase();

    const events = getEvents();

    const attendees = getAttendees();

    const tickets = getTickets();

    /* ---------- TOTAL EVENTS ---------- */

    if (

        query.includes("total events")

        ||

        query.includes("how many events")

        ||

        query.includes("events")

    ) {

        return `📅 There are <strong>${events.length}</strong> events in EventAI.`;

    }

    /* ---------- ATTENDEES ---------- */

    if (

        query.includes("attendees")

        ||

        query.includes("registrations")

        ||

        query.includes("registered users")

    ) {

        return `👥 Total registered attendees: <strong>${attendees.length}</strong>.`;

    }

    /* ---------- TICKETS ---------- */

    if (

        query.includes("tickets")

        &&

        !query.includes("my")

    ) {

        return `🎟 Total tickets generated: <strong>${tickets.length}</strong>.`;

    }

    /* ---------- MY TICKETS ---------- */

    if (

        query.includes("my ticket")

        ||

        query.includes("my tickets")

    ) {

        const myTickets = tickets.filter(

            ticket =>

                ticket.email === currentUser.email

        );

        if(myTickets.length===0){

            return "🎟 You don't have any tickets yet.";

        }

        let response =

            `🎟 You have <strong>${myTickets.length}</strong> ticket(s).<br><br>`;

        myTickets.forEach(ticket=>{

            response +=

            `• ${ticket.eventName}<br>`;

        });

        return response;

    }

    /* ---------- REVENUE ---------- */

    if (

        query.includes("revenue")

        ||

        query.includes("income")

        ||

        query.includes("earnings")

    ) {

        let revenue = 0;

        tickets.forEach(ticket=>{

            revenue += Number(ticket.price || 0);

        });

        return `💰 Total revenue is <strong>₹${revenue.toLocaleString("en-IN")}</strong>.`;

    }

    /* ---------- UPCOMING EVENTS ---------- */

    if (

        query.includes("upcoming")

    ) {

        const upcoming = events.filter(

            event =>

                event.status === "Upcoming"

        );

        if(upcoming.length===0){

            return "📅 There are no upcoming events.";

        }

        let response =

            `📅 Upcoming Events:<br><br>`;

        upcoming.forEach(event=>{

            response +=

            `• ${event.name}<br>`;

        });

        return response;

    }

    /* ---------- POPULAR EVENT ---------- */

    if (

        query.includes("popular")

        ||

        query.includes("highest registration")

        ||

        query.includes("most registered")

    ) {

        if(events.length===0){

            return "No events available.";

        }

        const popular =

            [...events].sort(

                (a,b)=>

                (b.registered||0)

                -

                (a.registered||0)

            )[0];

        return `🏆 Most popular event is <strong>${popular.name}</strong> with <strong>${popular.registered||0}</strong> registrations.`;

    }

    /* ---------- HELP ---------- */

    if (

        query.includes("help")

    ) {

        return `

        🤖 I can answer questions like:

        <br><br>

        • How many events?

        <br>

        • Total attendees

        <br>

        • Total revenue

        <br>

        • Upcoming events

        <br>

        • Most popular event

        <br>

        • My tickets

        `;

    }

    /* ---------- DEFAULT ---------- */

    return `

    🤖 Sorry, I couldn't understand that.

    <br><br>

    Try asking:

    <br>

    • Total Events

    <br>

    • Total Revenue

    <br>

    • Upcoming Events

    <br>

    • My Tickets

    `;

}
/* ==========================================
            ASK QUESTION
========================================== */

function askQuestion(question = null) {

    const message =

        question ||

        input.value.trim();

    if (message === "") return;

    addUserMessage(message);

    if (!question) {

        input.value = "";

    }

    /* ---------- Typing ---------- */

    const typing = document.createElement("div");

    typing.className = "bot-message";

    typing.id = "typing";

    typing.innerHTML = `

        <i class="fa-solid fa-robot"></i>

        <div class="message">

            <i class="fa-solid fa-ellipsis"></i>

            Thinking...

        </div>

    `;

    chatContainer.appendChild(typing);

    scrollBottom();

    setTimeout(() => {

        const typingBox =

            document.getElementById("typing");

        if (typingBox) {

            typingBox.remove();

        }

        const response =

            generateResponse(message);

        addBotMessage(response);

    }, 800);

}

/* ==========================================
            SEND BUTTON
========================================== */

if (sendBtn) {

    sendBtn.addEventListener(

        "click",

        () => askQuestion()

    );

}

/* ==========================================
            ENTER KEY
========================================== */

if (input) {

    input.addEventListener(

        "keypress",

        function (e) {

            if (e.key === "Enter") {

                askQuestion();

            }

        }

    );

}

/* ==========================================
            CHAT HISTORY
========================================== */

function saveChat(message, sender) {

    const history =

        JSON.parse(

            localStorage.getItem("chatHistory")

        ) || [];

    history.push({

        sender,

        message,

        time: new Date().toLocaleTimeString()

    });

    localStorage.setItem(

        "chatHistory",

        JSON.stringify(history)

    );

}

const originalUser = addUserMessage;
const originalBot = addBotMessage;

addUserMessage = function(message){

    saveChat(message,"user");

    originalUser(message);

}

addBotMessage = function(message){

    saveChat(message,"bot");

    originalBot(message);

}

/* ==========================================
            LOAD HISTORY
========================================== */

function loadHistory(){

    const history =

        JSON.parse(

            localStorage.getItem("chatHistory")

        ) || [];

    history.forEach(item=>{

        if(item.sender==="user"){

            originalUser(item.message);

        }

        else{

            originalBot(item.message);

        }

    });

}

/* ==========================================
            CLEAR HISTORY
========================================== */

function clearChat(){

    localStorage.removeItem("chatHistory");

    location.reload();

}

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadUser();

        loadHistory();

    }

);

/* ==========================================
            DEBUG
========================================== */

console.log("===================================");

console.log("EventAI AI Assistant Loaded");

console.log("User :",currentUser.name);

console.log("Role :",currentUser.role);

console.log("===================================");