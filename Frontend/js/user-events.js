/* ==========================================
            EVENTAI USER EVENTS
========================================== */

/* ==========================================
            LOCAL STORAGE
========================================== */

function getEvents() {

    return JSON.parse(

        localStorage.getItem("events")

    ) || [];

}

function saveEvents(events) {

    localStorage.setItem(

        "events",

        JSON.stringify(events)

    );

}

function getAttendees() {

    return JSON.parse(

        localStorage.getItem("attendees")

    ) || [];

}

function saveAttendees(attendees) {

    localStorage.setItem(

        "attendees",

        JSON.stringify(attendees)

    );

}

function getTickets() {

    return JSON.parse(

        localStorage.getItem("tickets")

    ) || [];

}

function saveTickets(tickets) {

    localStorage.setItem(

        "tickets",

        JSON.stringify(tickets)

    );

}

/* ---------- NEW ---------- */

function getSpeakers() {

    return JSON.parse(

        localStorage.getItem("speakers")

    ) || [];

}

function getSponsors() {

    return JSON.parse(

        localStorage.getItem("sponsors")

    ) || [];

}

function getVendors() {

    return JSON.parse(

        localStorage.getItem("vendors")

    ) || [];

}

/* ==========================================
            CURRENT USER
========================================== */

const currentUser = {

    name:

        localStorage.getItem("userName") ||

        "User",

    email:

        localStorage.getItem("userEmail") ||

        "",

    role:

        localStorage.getItem("userRole") ||

        "user"

};

/* ==========================================
            GLOBAL EVENTS
========================================== */

let events = getEvents();

/* ==========================================
            ELEMENTS
========================================== */

const tableBody =

document.getElementById("eventTable");

const emptyMessage =

document.getElementById("emptyMessage");

const searchBox =

document.getElementById("searchEvent");

const statusFilter =

document.getElementById("statusFilter");

/* ==========================================
            LOAD USER
========================================== */

function loadUser(){

    const user =

    document.getElementById(

        "loggedUserName"

    );

    if(user){

        user.textContent =

        currentUser.name;

    }

}

/* ==========================================
            FORMAT DATE
========================================== */

function formatDate(date){

    return new Date(date)

    .toLocaleDateString(

        "en-IN",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );

}

/* ==========================================
            DASHBOARD STATISTICS
========================================== */

function loadStatistics(){

    const events = getEvents();

    const attendees = getAttendees();

    const tickets = getTickets();

    document.getElementById(

        "availableEvents"

    ).textContent =

    events.filter(

        event => event.status !== "Completed"

    ).length;

    document.getElementById(

        "myRegistrations"

    ).textContent =

    attendees.filter(

        attendee =>

        attendee.email === currentUser.email

    ).length;

    document.getElementById(

        "myTickets"

    ).textContent =

    tickets.filter(

        ticket =>

        ticket.email === currentUser.email

    ).length;

    document.getElementById(

        "upcomingEvents"

    ).textContent =

    events.filter(

        event =>

        event.status === "Upcoming"

    ).length;

}
/* ==========================================
            RENDER EVENTS
========================================== */

function renderEvents(eventList = events) {

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (eventList.length === 0) {

        if (emptyMessage) {

            emptyMessage.style.display = "block";

        }

        return;

    }

    if (emptyMessage) {

        emptyMessage.style.display = "none";

    }

    let html = "";

    eventList.forEach(event => {

        let badgeClass = "upcoming";

        if (event.status === "Completed") {

            badgeClass = "completed";

        }

        else if (event.status === "Open") {

            badgeClass = "pending";

        }

        html += `

        <tr>

            <td>

                #${event.id}

            </td>

            <td>

                <img

                    src="${event.banner}"

                    alt="${event.name}"

                    class="event-banner"

                    style="

                        width:80px;

                        height:50px;

                        object-fit:cover;

                        border-radius:8px;

                    ">

            </td>

            <td>

                <strong>

                    ${event.name}

                </strong>

            </td>

            <td>

                ${event.category}

            </td>

            <td>

                ${formatDate(event.date)}

                <br>

                <small>

                    ${event.time}

                </small>

            </td>

            <td>

                ${event.venue}

            </td>

            <td>

                ${event.price > 0

                    ? `₹${Number(event.price).toLocaleString("en-IN")}`

                    : "Free"}

            </td>

            <td>

                <span class="badge ${badgeClass}">

                    ${event.status}

                </span>

            </td>

            <td>

                <button

                    class="action-btn view"

                    onclick="viewEvent(${event.id})">

                    <i class="fa-solid fa-eye"></i>

                </button>

            </td>

            <td>

                <button

                    class="primary-btn"

                    onclick="registerEvent(${event.id})">

                    Register

                </button>

            </td>

        </tr>

        `;

    });

    tableBody.innerHTML = html;

}

/* ==========================================
            SEARCH & FILTER
========================================== */

function filterEvents() {

    const search =

        searchBox

        ? searchBox.value.trim().toLowerCase()

        : "";

    const status =

        statusFilter

        ? statusFilter.value

        : "All";

    const filtered = events.filter(event => {

        const matchSearch =

            event.name.toLowerCase().includes(search)

            ||

            event.category.toLowerCase().includes(search)

            ||

            event.venue.toLowerCase().includes(search);

        const matchStatus =

            status === "All"

            ||

            event.status === status;

        return matchSearch && matchStatus;

    });

    renderEvents(filtered);

}

/* ==========================================
            EVENTS
========================================== */

if (searchBox) {

    searchBox.addEventListener(

        "input",

        filterEvents

    );

}

if (statusFilter) {

    statusFilter.addEventListener(

        "change",

        filterEvents

    );

}
/* ==========================================
            VIEW EVENT
========================================== */

function viewEvent(id) {

    const event = events.find(

        e => e.id === id

    );

    if (!event) return;

    /* ---------- GET RELATED DATA ---------- */

    const speakers = getSpeakers().filter(

        speaker => speaker.event === event.name

    );

    const sponsors = getSponsors().filter(

        sponsor => sponsor.event === event.name

    );

    const vendors = getVendors().filter(

        vendor => vendor.event === event.name

    );

    const speakerNames =

        speakers.length

        ? speakers.map(s => s.name).join(", ")

        : "Not Assigned";

    const sponsorNames =

        sponsors.length

        ? sponsors.map(s => s.name).join(", ")

        : "Not Assigned";

    const vendorNames =

        vendors.length

        ? vendors.map(v => v.name).join(", ")

        : "Not Assigned";

    /* ---------- VIEW MODAL ---------- */

    const viewContent =

        document.getElementById("viewContent");

    if (!viewContent) return;

    viewContent.innerHTML = `

        <div class="view-banner">

            <img

                src="${event.banner}"

                alt="${event.name}"

                style="

                    width:100%;

                    height:250px;

                    object-fit:cover;

                    border-radius:12px;

                ">

        </div>

        <br>

        <h2>

            ${event.name}

        </h2>

        <br>

        <p>

            <strong>Category :</strong>

            ${event.category}

        </p>

        <br>

        <p>

            <strong>Date :</strong>

            ${formatDate(event.date)}

        </p>

        <br>

        <p>

            <strong>Time :</strong>

            ${event.time}

        </p>

        <br>

        <p>

            <strong>Venue :</strong>

            ${event.venue}

        </p>

        <br>

        <p>

            <strong>Speaker :</strong>

            ${speakerNames}

        </p>

        <br>

        <p>

            <strong>Sponsor :</strong>

            ${sponsorNames}

        </p>

        <br>

        <p>

            <strong>Vendor :</strong>

            ${vendorNames}

        </p>

        <br>

        <p>

            <strong>Price :</strong>

            ${event.price > 0
                ? `₹${Number(event.price).toLocaleString("en-IN")}`
                : "Free"}

        </p>

        <br>

        <p>

            <strong>Capacity :</strong>

            ${event.capacity}

        </p>

        <br>

        <p>

            <strong>Registered :</strong>

            ${event.registered || 0}

        </p>

        <br>

        <p>

            <strong>Status :</strong>

            ${event.status}

        </p>

        <br>

        <p>

            <strong>Description :</strong>

        </p>

        <p>

            ${event.description || "No description available."}

        </p>

        <br>

        <button

            class="primary-btn"

            onclick="registerEvent(${event.id})">

            <i class="fa-solid fa-user-plus"></i>

            Register Now

        </button>

    `;

    document.getElementById("viewModal").style.display = "block";

}
/* ==========================================
            REGISTER EVENT
========================================== */

function registerEvent(eventId) {

    if (!localStorage.getItem("isLoggedIn")) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    if (currentUser.role !== "user") {

        alert("Only users can register.");

        return;

    }

    let attendees = getAttendees();

    let tickets = getTickets();

    const event = events.find(

        e => e.id === eventId

    );

    if (!event) {

        alert("Event not found.");

        return;

    }

    const alreadyRegistered = attendees.find(

        attendee =>

            attendee.eventId === event.id &&

            attendee.email === currentUser.email

    );

    if (alreadyRegistered) {

        alert("You have already registered for this event.");

        return;

    }

    /* ---------- CREATE ATTENDEE ---------- */

    const attendee = {

        id:

            attendees.length > 0

            ? Math.max(...attendees.map(a => a.id || 0)) + 1

            : 1,

        eventId: event.id,

        eventName: event.name,

        name: currentUser.name,

        email: currentUser.email,

        phone: "-",

        status: "Registered",

        registrationDate:

            new Date().toLocaleDateString("en-IN")

    };

    attendees.push(attendee);

    saveAttendees(attendees);

    /* ---------- UPDATE EVENT ---------- */

    event.registered =

        (event.registered || 0) + 1;

    saveEvents(events);

    /* ---------- CREATE TICKET ---------- */

    const ticket = {

        id:

            tickets.length > 0

            ? Math.max(...tickets.map(t => t.id || 0)) + 1

            : 1,

        ticketId:

            "EVT-" +

            Date.now(),

        attendeeId:

            attendee.id,

        eventId:

            event.id,

        eventName:

            event.name,

        name:

            currentUser.name,

        email:

            currentUser.email,

        date:

            event.date,

        time:

            event.time,

        venue:

            event.venue,

        price:

            event.price,

        status:

            "Confirmed",

        issuedOn:

            new Date().toLocaleDateString("en-IN")

    };

    tickets.push(ticket);

    saveTickets(tickets);

    alert(

        "Registration Successful!\n\nTicket ID : " +

        ticket.ticketId

    );

    refreshEvents();

}

/* ==========================================
            REFRESH
========================================== */

function refreshEvents() {

    events = getEvents();

    renderEvents(events);

    loadStatistics();

}

/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener(

    "storage",

    refreshEvents

);

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        if (currentUser.role !== "user") {

            window.location.href = "dashboard.html";

            return;

        }

        loadUser();

        refreshEvents();

    }

);

/* ==========================================
            DEBUG
========================================== */

console.log(

    "================================="

);

console.log(

    "EventAI User Events Loaded"

);

console.log(

    "Current User :",

    currentUser

);

console.log(

    "Events :",

    getEvents()

);

console.log(

    "Attendees :",

    getAttendees()

);

console.log(

    "Tickets :",

    getTickets()

);

console.log(

    "Speakers :",

    getSpeakers()

);

console.log(

    "Sponsors :",

    getSponsors()

);

console.log(

    "Vendors :",

    getVendors()

);

console.log(

    "================================="

);