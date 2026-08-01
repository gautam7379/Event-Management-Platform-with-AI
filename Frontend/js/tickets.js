/* ==========================================
            EVENTAI TICKETS
========================================== */

/* ==========================================
            LOCAL STORAGE
========================================== */

function getTickets() {

    return JSON.parse(
        localStorage.getItem("tickets")
    ) || [];

}

function getEvents() {

    return JSON.parse(
        localStorage.getItem("events")
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

const ticketTable =
document.getElementById("ticketTable");

const searchBox =
document.getElementById("searchTicket");

const statusFilter =
document.getElementById("statusFilter");

const emptyMessage =
document.getElementById("emptyMessage");

/* ==========================================
            LOAD USER
========================================== */

function loadUser(){

    const userElement =
    document.getElementById("loggedUserName");

    if(userElement){

        userElement.textContent =
        currentUser.name;

    }

}

/* ==========================================
            LOAD USER TICKETS
========================================== */

function loadTickets(){

    const tickets = getTickets();

    if(currentUser.role==="admin"){

        return tickets;

    }

    return tickets.filter(ticket=>

        ticket.email===currentUser.email

    );

}

/* ==========================================
            LOAD STATISTICS
========================================== */

function loadStatistics(){

    const tickets = loadTickets();

    const total =
    document.getElementById("totalTickets");

    const confirmed =
    document.getElementById("confirmedTickets");

    const pending =
    document.getElementById("pendingTickets");

    const cancelled =
    document.getElementById("cancelledTickets");

    if(total)
        total.textContent=tickets.length;

    if(confirmed)
        confirmed.textContent=tickets.filter(

            t=>t.status==="Confirmed"

        ).length;

    if(pending)
        pending.textContent=tickets.filter(

            t=>t.status==="Pending"

        ).length;

    if(cancelled)
        cancelled.textContent=tickets.filter(

            t=>t.status==="Cancelled"

        ).length;

}
/* ==========================================
            RENDER TICKETS
========================================== */

function renderTickets(ticketList = loadTickets()) {

    if (!ticketTable) return;

    ticketTable.innerHTML = "";

    if (ticketList.length === 0) {

        if (emptyMessage) {

            emptyMessage.style.display = "block";

        }

        return;

    }

    if (emptyMessage) {

        emptyMessage.style.display = "none";

    }

    let html = "";

    ticketList.forEach(ticket => {

        let badgeClass = "completed";

        if (ticket.status === "Pending") {

            badgeClass = "pending";

        }

        else if (ticket.status === "Cancelled") {

            badgeClass = "cancelled";

        }

        html += `

        <tr>

            <td>${ticket.ticketId}</td>

            <td>${ticket.name}</td>

            <td>${ticket.eventName}</td>

            <td>${new Date(ticket.date).toLocaleDateString("en-IN")}</td>

            <td>${ticket.venue}</td>

            <td>

                ${ticket.price > 0

                    ? `₹${Number(ticket.price).toLocaleString("en-IN")}`

                    : "Free"}

            </td>

            <td>

                <span class="badge ${badgeClass}">

                    ${ticket.status}

                </span>

            </td>

            <td>

                <button

                    class="action-btn view"

                    onclick="viewTicket('${ticket.ticketId}')">

                    <i class="fa-solid fa-eye"></i>

                </button>

                <button

                    class="action-btn edit"

                    onclick="printTicket('${ticket.ticketId}')">

                    <i class="fa-solid fa-print"></i>

                </button>

            </td>

        </tr>

        `;

    });

    ticketTable.innerHTML = html;

}

/* ==========================================
            SEARCH & FILTER
========================================== */

function filterTickets() {

    const search =

        searchBox

        ? searchBox.value.trim().toLowerCase()

        : "";

    const status =

        statusFilter

        ? statusFilter.value

        : "All";

    const filtered = loadTickets().filter(ticket => {

        const matchSearch =

            ticket.ticketId.toLowerCase().includes(search)

            ||

            ticket.name.toLowerCase().includes(search)

            ||

            ticket.eventName.toLowerCase().includes(search)

            ||

            ticket.email.toLowerCase().includes(search);

        const matchStatus =

            status === "All"

            ||

            ticket.status === status;

        return matchSearch && matchStatus;

    });

    renderTickets(filtered);

}

/* ==========================================
            EVENTS
========================================== */

if (searchBox) {

    searchBox.addEventListener(

        "input",

        filterTickets

    );

}

if (statusFilter) {

    statusFilter.addEventListener(

        "change",

        filterTickets

    );

}
/* ==========================================
            VIEW TICKET
========================================== */

function viewTicket(ticketId){

    const ticket = loadTickets().find(

        t => t.ticketId === ticketId

    );

    if(!ticket){

        alert("Ticket not found.");

        return;

    }

    localStorage.setItem(

        "selectedTicket",

        JSON.stringify(ticket)

    );

    window.location.href = "ticket-view.html";

}

/* ==========================================
            PRINT TICKET
========================================== */

function printTicket(ticketId){

    const ticket = loadTickets().find(

        t => t.ticketId === ticketId

    );

    if(!ticket){

        alert("Ticket not found.");

        return;

    }

    localStorage.setItem(

        "selectedTicket",

        JSON.stringify(ticket)

    );

    window.open(

        "ticket-view.html",

        "_blank"

    );

}

/* ==========================================
            DOWNLOAD TICKET
========================================== */

function downloadTicket(ticketId){

    const ticket = loadTickets().find(

        t => t.ticketId === ticketId

    );

    if(!ticket){

        return;

    }

    localStorage.setItem(

        "selectedTicket",

        JSON.stringify(ticket)

    );

    window.open(

        "ticket-view.html",

        "_blank"

    );

}

/* ==========================================
            GET SINGLE TICKET
========================================== */

function getTicketById(ticketId){

    return loadTickets().find(

        ticket => ticket.ticketId === ticketId

    );

}
/* ==========================================
            REFRESH PAGE
========================================== */

function refreshTickets(){

    renderTickets();

    loadStatistics();

}

/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener("storage", () => {

    refreshTickets();

});

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    refreshTickets();

});

/* ==========================================
            EXPORT (Optional)
========================================== */

window.viewTicket = viewTicket;
window.printTicket = printTicket;
window.downloadTicket = downloadTicket;

/* ==========================================
            DEBUG
========================================== */

console.log("================================");

console.log("EventAI Tickets Loaded");

console.log("Current User :", currentUser.name);

console.log("Role :", currentUser.role);

console.log("Total Tickets :", loadTickets().length);

console.log("================================");