/* ==========================================
            EVENTAI EVENTS
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

function getTickets() {

    return JSON.parse(

        localStorage.getItem("tickets")

    ) || [];

}

/* ==========================================
            GLOBAL DATA
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
            FORMAT DATE
========================================== */

function formatDate(date){

    if(!date) return "—";

    return new Date(date).toLocaleDateString(

        "en-IN",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );

}

/* ==========================================
            GET REGISTRATION COUNT
========================================== */

function getRegistrationCount(eventId){

    return getAttendees().filter(

        attendee => attendee.eventId === eventId

    ).length;

}

/* ==========================================
            RENDER EVENTS
========================================== */

function renderEvents(eventList = events){

    if(!tableBody) return;

    tableBody.innerHTML = "";

    if(eventList.length===0){

        if(emptyMessage){

            emptyMessage.style.display="block";

        }

        return;

    }

    emptyMessage.style.display="none";

    eventList.forEach(event=>{

        const registered =

            getRegistrationCount(event.id);

        let badgeClass="upcoming";

        if(event.status==="Completed"){

            badgeClass="completed";

        }

        else if(event.status==="Open"){

            badgeClass="pending";

        }

        tableBody.innerHTML += `

<tr>

<td>

#${event.id}

</td>

<td>

<img

src="${event.banner || ""}"

width="80"

height="50"

style="border-radius:8px;object-fit:cover;">

</td>

<td>

<strong>

${event.name}

</strong>

</td>

<td>

${event.category || "General"}

</td>

<td>

${formatDate(event.date)}

<br>

<small>

${event.time || ""}

</small>

</td>

<td>

${event.venue}

</td>

<td>

${event.price>0 ? "₹"+event.price : "Free"}

</td>

<td>

${registered}/${event.capacity || 0}

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

<button

class="action-btn edit"

onclick="editEvent(${event.id})">

<i class="fa-solid fa-pen"></i>

</button>

<button

class="action-btn delete"

onclick="deleteEvent(${event.id})">

<i class="fa-solid fa-trash"></i>

</button>

</td>

<td>

${event.status==="Completed"

? `<button class="primary-btn" disabled>

Completed

</button>`

: `<button

class="primary-btn"

onclick="registerEvent(${event.id})">

Register

</button>`

}

</td>

</tr>

`;

    });

}
/* ==========================================
            LOAD STATISTICS
========================================== */

function loadStatistics(){

    const events = getEvents();

    const attendees = getAttendees();

    const tickets = getTickets();

    /* ==============================
            TOTAL EVENTS
    ============================== */

    const totalEvents =
        document.getElementById("totalEvents");

    if(totalEvents){

        totalEvents.textContent =
            events.length;

    }

    /* ==============================
            TOTAL REGISTRATIONS
    ============================== */

    const totalRegistrations =
        document.getElementById("totalRegistrations");

    if(totalRegistrations){

        totalRegistrations.textContent =
            attendees.length;

    }

    /* ==============================
            UPCOMING EVENTS
    ============================== */

    const upcomingEvents =
        document.getElementById("upcomingEvents");

    if(upcomingEvents){

        upcomingEvents.textContent =

            events.filter(event =>

                event.status === "Upcoming"

            ).length;

    }

    /* ==============================
            COMPLETED EVENTS
    ============================== */

    const completedEvents =
        document.getElementById("completedEvents");

    if(completedEvents){

        completedEvents.textContent =

            events.filter(event =>

                event.status === "Completed"

            ).length;

    }

    /* ==============================
            TOTAL TICKETS
    ============================== */

    const totalTickets =
        document.getElementById("totalTickets");

    if(totalTickets){

        totalTickets.textContent =
            tickets.length;

    }

    /* ==============================
            TOTAL REVENUE
    ============================== */

    let revenue = 0;

    tickets.forEach(ticket=>{

        revenue += Number(ticket.price || 0);

    });

    const totalRevenue =
        document.getElementById("totalRevenue");

    if(totalRevenue){

        totalRevenue.textContent =

            "₹" +

            revenue.toLocaleString("en-IN");

    }

    /* ==============================
            CHECKED IN
    ============================== */

    const checkedInCount =
        document.getElementById("checkedInCount");

    if(checkedInCount){

        checkedInCount.textContent =

            attendees.filter(attendee =>

                attendee.status === "Checked In"

            ).length;

    }

    /* ==============================
            REGISTRATION RATE
    ============================== */

    let totalCapacity = 0;

    events.forEach(event=>{

        totalCapacity += Number(

            event.capacity || 0

        );

    });

    let rate = 0;

    if(totalCapacity > 0){

        rate = Math.round(

            (attendees.length / totalCapacity) * 100

        );

    }

    const registrationRate =
        document.getElementById("registrationRate");

    if(registrationRate){

        registrationRate.textContent =

            rate + "%";

    }

}
/* ==========================================
            REFRESH EVENTS
========================================== */

function refreshEvents(){

    events = getEvents();

    renderEvents(events);

    loadStatistics();

}

/* ==========================================
            SEARCH & FILTER
========================================== */

function filterEvents(){

    const search =

        searchBox

        ? searchBox.value

            .trim()

            .toLowerCase()

        : "";

    const status =

        statusFilter

        ? statusFilter.value

        : "All";

    const filtered = events.filter(event=>{

        const matchesSearch =

            event.name.toLowerCase().includes(search)

            ||

            (event.category || "")

            .toLowerCase()

            .includes(search)

            ||

            (event.venue || "")

            .toLowerCase()

            .includes(search);

        const matchesStatus =

            status === "All"

            ||

            event.status === status;

        return matchesSearch && matchesStatus;

    });

    renderEvents(filtered);

}

/* ==========================================
            SEARCH BOX
========================================== */

if(searchBox){

    searchBox.addEventListener(

        "input",

        filterEvents

    );

}

/* ==========================================
            STATUS FILTER
========================================== */

if(statusFilter){

    statusFilter.addEventListener(

        "change",

        filterEvents

    );

}

/* ==========================================
            STORAGE REFRESH
========================================== */

window.addEventListener(

    "storage",

    function(){

        refreshEvents();

    }

);
/* ==========================================
            VIEW EVENT
========================================== */

function viewEvent(id){

    const event = events.find(

        e => e.id === id

    );

    if(!event) return;

    const registered = getRegistrationCount(event.id);

    const viewContent =

        document.getElementById("viewContent");

    if(!viewContent) return;

    viewContent.innerHTML = `

        <img

            src="${event.banner || ''}"

            alt="${event.name}"

            style="

                width:100%;

                height:250px;

                object-fit:cover;

                border-radius:12px;

                margin-bottom:20px;

            ">

        <h2>${event.name}</h2>

        <hr>

        <p>

            <strong>Category:</strong>

            ${event.category}

        </p>

        <p>

            <strong>Date:</strong>

            ${formatDate(event.date)}

        </p>

        <p>

            <strong>Time:</strong>

            ${event.time}

        </p>

        <p>

            <strong>Venue:</strong>

            ${event.venue}

        </p>

        <p>

            <strong>Ticket Price:</strong>

            ${event.price > 0 ? "₹" + event.price : "Free"}

        </p>

        <p>

            <strong>Registrations:</strong>

            ${registered}/${event.capacity}

        </p>

        <p>

            <strong>Status:</strong>

            ${event.status}

        </p>

        <hr>

        <h3>Description</h3>

        <p>

            ${event.description || "No description available."}

        </p>

    `;

    document.getElementById("viewModal").style.display = "block";

}

/* ==========================================
            EDIT EVENT
========================================== */

function editEvent(id){

    const event = events.find(

        e => e.id === id

    );

    if(!event) return;

    document.getElementById("editId").value = event.id;

    document.getElementById("editName").value = event.name;

    document.getElementById("editCategory").value = event.category;

    document.getElementById("editDate").value = event.date;

    document.getElementById("editTime").value = event.time;

    document.getElementById("editVenue").value = event.venue;

    document.getElementById("editPrice").value = event.price;

    document.getElementById("editCapacity").value = event.capacity;

    document.getElementById("editStatus").value = event.status;

    document.getElementById("editDescription").value =

        event.description || "";

    document.getElementById("editModal").style.display = "block";

}
/* ==========================================
        SAVE EDITED EVENT
========================================== */

const editForm = document.getElementById("editForm");

if(editForm){

    editForm.addEventListener("submit",function(e){

        e.preventDefault();

        const id = Number(

            document.getElementById("editId").value

        );

        const index = events.findIndex(

            event => event.id === id

        );

        if(index === -1){

            alert("Event not found.");

            return;

        }

        // Preserve existing registration count
        const registered =
            events[index].registered || 0;

        events[index] = {

            ...events[index],

            id: id,

            name:
                document.getElementById("editName").value.trim(),

            category:
                document.getElementById("editCategory").value,

            date:
                document.getElementById("editDate").value,

            time:
                document.getElementById("editTime").value,

            venue:
                document.getElementById("editVenue").value.trim(),

            price:
                Number(
                    document.getElementById("editPrice").value
                ),

            capacity:
                Number(
                    document.getElementById("editCapacity").value
                ),

            status:
                document.getElementById("editStatus").value,

            description:
                document.getElementById("editDescription").value.trim(),

            registered: registered

        };

        saveEvents(events);

        document.getElementById("editModal").style.display = "none";

        refreshEvents();

        alert("✅ Event updated successfully.");

    });

}

/* ==========================================
            DELETE EVENT
========================================== */

function deleteEvent(id){

    const event = events.find(

        event => event.id === id

    );

    if(!event) return;

    const confirmDelete = confirm(

        `Delete "${event.name}" ?`

    );

    if(!confirmDelete) return;

    events = events.filter(

        event => event.id !== id

    );

    saveEvents(events);

    refreshEvents();

    alert("✅ Event deleted successfully.");

}
/* ==========================================
            REGISTER EVENT
========================================== */

function registerEvent(eventId){

    /* ---------- LOGIN CHECK ---------- */

    if(localStorage.getItem("isLoggedIn") !== "true"){

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    /* ---------- USER ROLE CHECK ---------- */

    if(localStorage.getItem("userRole") !== "user"){

        alert("Only users can register for events.");

        return;

    }

    const event = events.find(

        e => e.id === eventId

    );

    if(!event){

        alert("Event not found.");

        return;

    }

    /* ---------- EVENT STATUS ---------- */

    if(event.status === "Completed"){

        alert("Registration is closed for this event.");

        return;

    }

    /* ---------- CAPACITY CHECK ---------- */

    const attendees = getAttendees();

    const registered = attendees.filter(

        attendee => attendee.eventId === event.id

    ).length;

    if(registered >= Number(event.capacity)){

        alert("This event is already full.");

        return;

    }

    const email =

        localStorage.getItem("userEmail");

    const name =

        localStorage.getItem("userName");

    /* ---------- DUPLICATE CHECK ---------- */

    const alreadyRegistered = attendees.find(

        attendee =>

            attendee.eventId === event.id &&

            attendee.email === email

    );

    if(alreadyRegistered){

        alert("You have already registered for this event.");

        return;

    }

    /* ---------- CREATE ATTENDEE ---------- */

    const attendee = {

        id:

            attendees.length

            ? Math.max(...attendees.map(a => a.id || 0)) + 1

            : 1,

        eventId: event.id,

        eventName: event.name,

        name: name,

        email: email,

        phone: "-",

        status: "Registered",

        registrationDate:

            new Date().toLocaleDateString("en-IN")

    };

    attendees.push(attendee);

    localStorage.setItem(

        "attendees",

        JSON.stringify(attendees)

    );

    /* ---------- UPDATE EVENT ---------- */

    event.registered = registered + 1;

    saveEvents(events);

    /* ---------- CREATE TICKET ---------- */

    const tickets = getTickets();

    const ticket = {

        id:

            tickets.length

            ? Math.max(...tickets.map(t => t.id || 0)) + 1

            : 1,

        ticketId:

            "EVT-" +

            Date.now().toString().slice(-6),

        attendeeId:

            attendee.id,

        eventId:

            event.id,

        eventName:

            event.name,

        name:

            attendee.name,

        email:

            attendee.email,

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

    localStorage.setItem(

        "tickets",

        JSON.stringify(tickets)

    );

    refreshEvents();

    alert(

        "Registration Successful!\n\n" +

        "Ticket ID: " +

        ticket.ticketId

    );

}
/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    refreshEvents();

});

/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener("storage", () => {

    refreshEvents();

});

/* ==========================================
            DEBUG
========================================== */

console.log("====================================");

console.log("EventAI Events Loaded");

console.log("Total Events :", getEvents().length);

console.log("Total Attendees :", getAttendees().length);

console.log("Total Tickets :", getTickets().length);

console.log("====================================");