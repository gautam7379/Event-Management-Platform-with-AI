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

function loadUser() {

    const user =

        document.getElementById("loggedUserName");

    if (user) {

        user.textContent =

            currentUser.name;

    }

}

/* ==========================================
            FORMAT DATE
========================================== */

function formatDate(date) {

    return new Date(date)

        .toLocaleDateString(

            "en-IN",

            {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }

        );

}
/* ==========================================
            DASHBOARD STATISTICS
========================================== */

function loadStatistics() {

    const events = getEvents();

    const attendees = getAttendees();

    const tickets = getTickets();

    /* ---------- AVAILABLE EVENTS ---------- */

    const availableEvents = events.filter(event =>

        event.status !== "Completed"

    ).length;

    document.getElementById(

        "availableEvents"

    ).textContent = availableEvents;

    /* ---------- MY REGISTRATIONS ---------- */

    const myRegistrations = attendees.filter(attendee =>

        attendee.email === currentUser.email

    ).length;

    document.getElementById(

        "myRegistrations"

    ).textContent = myRegistrations;

    /* ---------- MY TICKETS ---------- */

    const myTickets = tickets.filter(ticket =>

        ticket.email === currentUser.email

    ).length;

    document.getElementById(

        "myTickets"

    ).textContent = myTickets;

    /* ---------- UPCOMING EVENTS ---------- */

    const upcomingEvents = events.filter(event =>

        event.status === "Upcoming"

    ).length;

    document.getElementById(

        "upcomingEvents"

    ).textContent = upcomingEvents;

}
/* ==========================================
            RENDER EVENTS
========================================== */

function renderEvents(eventList = events) {

    if (!tableBody) return;

    tableBody.innerHTML = "";


    /* ---------- EMPTY STATE ---------- */

    if (eventList.length === 0) {

        if (emptyMessage) {

            emptyMessage.style.display = "block";

        }

        return;

    }


    if (emptyMessage) {

        emptyMessage.style.display = "none";

    }


    /* ---------- EVENTS TABLE ---------- */

    eventList.forEach(event => {


        const badgeClass =

            event.status === "Completed"

                ? "completed"

                : event.status === "Open"

                ? "pending"

                : "upcoming";


        const row = `

        <tr>


            <td>

                #${event.id}

            </td>


            <td>

                <img

                    src="${event.banner}"

                    alt="${event.name}"

                    class="event-banner"

                    width="80"

                    height="50"

                    style="
                    border-radius:8px;
                    object-fit:cover;
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

                ${
                    event.price > 0

                    ? `₹${event.price}`

                    : "Free"
                }

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


        tableBody.innerHTML += row;


    });

}
/* ==========================================
            SEARCH & FILTER
========================================== */

function filterEvents() {

    const searchText =

        searchBox.value

            .trim()

            .toLowerCase();


    const status =

        statusFilter.value;


    const filteredEvents = events.filter(event => {


        const matchesSearch =

            event.name.toLowerCase()

                .includes(searchText)

            ||

            event.category.toLowerCase()

                .includes(searchText)

            ||

            event.venue.toLowerCase()

                .includes(searchText);



        const matchesStatus =

            status === "All"

            ||

            event.status === status;



        return (

            matchesSearch

            &&

            matchesStatus

        );


    });


    renderEvents(filteredEvents);

}


/* ==========================================
            SEARCH EVENT
========================================== */

if (searchBox) {

    searchBox.addEventListener(

        "input",

        filterEvents

    );

}


/* ==========================================
            STATUS FILTER
========================================== */

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

            <strong>Category:</strong>

            ${event.category}

        </p>


        <br>


        <p>

            <strong>Date:</strong>

            ${formatDate(event.date)}

        </p>


        <br>


        <p>

            <strong>Time:</strong>

            ${event.time}

        </p>


        <br>


        <p>

            <strong>Venue:</strong>

            ${event.venue}

        </p>


        <br>


        <p>

            <strong>Price:</strong>

            ${
                event.price > 0

                ? `₹${event.price}`

                : "Free"
            }

        </p>


        <br>


        <p>

            <strong>Capacity:</strong>

            ${event.capacity}

        </p>


        <br>


        <p>

            <strong>Registered:</strong>

            ${event.registered || 0}

        </p>


        <br>


        <p>

            <strong>Status:</strong>

            ${event.status}

        </p>


        <br>


        <p>

            <strong>Description:</strong>

        </p>


        <p>

            ${event.description || "No description available."}

        </p>


        <br>


        <button

            class="primary-btn"

            onclick="registerEvent(${event.id})">

            Register Now

        </button>


    `;



    document.getElementById("viewModal").style.display = "block";


}
/* ==========================================
            REGISTER EVENT
========================================== */

function registerEvent(eventId) {


    /* ---------- CHECK LOGIN ---------- */

    const loggedIn =

        localStorage.getItem("isLoggedIn");


    if (!loggedIn) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }



    /* ---------- ROLE CHECK ---------- */

    if (currentUser.role !== "user") {

        alert("Only users can register for events.");

        return;

    }



    let attendees = getAttendees();


    let tickets = getTickets();



    /* ---------- FIND EVENT ---------- */

    const event = events.find(

        e => e.id === eventId

    );


    if (!event) {

        alert("Event not found.");

        return;

    }



    /* ---------- DUPLICATE CHECK ---------- */

    const alreadyRegistered = attendees.find(attendee =>

        attendee.eventId === eventId &&

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

            ?

            Math.max(

                ...attendees.map(a => a.id || 0)

            ) + 1

            :

            1,


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



    /* ---------- UPDATE EVENT COUNT ---------- */

    event.registered =

        (event.registered || 0) + 1;



    saveEvents(events);



    /* ---------- CREATE TICKET ---------- */

    const ticket = {


        id:

            tickets.length > 0

            ?

            Math.max(

                ...tickets.map(t => t.id || 0)

            ) + 1

            :

            1,


        ticketId:

            "EVT-" +

            String(Date.now()).slice(-6),


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

        "Registration Successful!\n\n" +

        "Ticket ID : " +

        ticket.ticketId

    );



    refreshEvents();

}
/* ==========================================
            REFRESH EVENTS
========================================== */

function refreshEvents() {

    events = getEvents();

    renderEvents(events);

    loadStatistics();

}


/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener("storage", () => {

    refreshEvents();

});


/* ==========================================
            INITIAL LOAD
========================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ---------- USER SECURITY ---------- */

    if (currentUser.role !== "user") {

        window.location.href = "dashboard.html";

        return;

    }


    loadUser();

    refreshEvents();


});


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

    "Current User:",

    currentUser

);


console.log(

    "Events:",

    getEvents()

);


console.log(

    "Attendees:",

    getAttendees()

);


console.log(

    "Tickets:",

    getTickets()

);


console.log(

    "================================="

);