/* ==========================================
            EVENTAI ATTENDEES
========================================== */

/* ==========================================
            LOCAL STORAGE
========================================== */

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

const attendeeTable =
    document.getElementById("attendeeTable");

const searchInput =
    document.getElementById("searchInput");

const eventFilter =
    document.getElementById("eventFilter");

const statusFilter =
    document.getElementById("statusFilter");

/* ==========================================
            LOAD USER
========================================== */

function loadUser() {

    const userElement =

        document.getElementById("loggedUserName");

    if(userElement){

        userElement.textContent =

            currentUser.name;

    }

}

/* ==========================================
            GET ATTENDEES
========================================== */

function loadAttendeesData(){

    const attendees = getAttendees();

    if(currentUser.role === "admin"){

        return attendees;

    }

    return attendees.filter(

        attendee =>

            attendee.email === currentUser.email

    );

}
/* ==========================================
            EVENT DROPDOWN
========================================== */

function loadEventDropdown() {

    const dropdown =

        document.getElementById("attendeeEvent");

    if (!dropdown) return;

    const events = getEvents();

    dropdown.innerHTML =

        `<option value="">Select Event</option>`;

    events.forEach(event => {

        dropdown.innerHTML += `

            <option value="${event.id}">

                ${event.name}

            </option>

        `;

    });

}

/* ==========================================
            STATISTICS
========================================== */

function loadStatistics() {

    const attendees = loadAttendeesData();

    document.getElementById("totalAttendees").textContent =

        attendees.length;

    document.getElementById("checkedIn").textContent =

        attendees.filter(

            attendee =>

                attendee.status === "Checked In"

        ).length;

    document.getElementById("pending").textContent =

        attendees.filter(

            attendee =>

                attendee.status === "Pending"

                ||

                attendee.status === "Registered"

        ).length;

    document.getElementById("eventCount").textContent =

        getEvents().length;

}

/* ==========================================
            LOAD TABLE
========================================== */

function loadAttendeesTable(list = loadAttendeesData()) {

    attendeeTable.innerHTML = "";

    const events = getEvents();

    if (list.length === 0) {

        attendeeTable.innerHTML = `

        <tr>

            <td colspan="7"

                style="text-align:center;padding:20px;">

                No attendees found.

            </td>

        </tr>

        `;

        return;

    }

    list.forEach(attendee => {

        const event = events.find(

            e =>

                e.id == attendee.eventId

        );

        attendeeTable.innerHTML += `

        <tr>

            <td>

                ${attendee.id}

            </td>

            <td>

                ${attendee.name}

            </td>

            <td>

                ${attendee.email}

            </td>

            <td>

                ${attendee.phone}

            </td>

            <td>

                ${event ? event.name : "-"}

            </td>

            <td>

                <span class="${
                    attendee.status === "Checked In"

                    ? "badge completed"

                    : "badge upcoming"
                }">

                    ${attendee.status}

                </span>

            </td>

            <td>

                <button

                    class="btn-small"

                    onclick="checkIn(${attendee.id})">

                    Check In

                </button>

                <button

                    class="btn-small"

                    onclick="editAttendee(${attendee.id})">

                    Edit

                </button>

                <button

                    class="btn-small delete"

                    onclick="deleteAttendee(${attendee.id})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}
/* ==========================================
            SEARCH & FILTER
========================================== */

function applyFilters() {

    const keyword =

        searchInput.value

            .trim()

            .toLowerCase();

    const selectedEvent =

        eventFilter

            ? eventFilter.value

            : "all";

    const selectedStatus =

        statusFilter

            ? statusFilter.value

            : "all";

    let attendees =

        loadAttendeesData();

    attendees = attendees.filter(attendee => {

        const event = getEvents().find(

            e =>

                e.id == attendee.eventId

        );

        const eventName =

            event

                ? event.name.toLowerCase()

                : "";

        const matchesSearch =

            attendee.name.toLowerCase().includes(keyword)

            ||

            attendee.email.toLowerCase().includes(keyword)

            ||

            attendee.phone.toLowerCase().includes(keyword)

            ||

            eventName.includes(keyword);

        const matchesEvent =

            selectedEvent === "all"

            ||

            attendee.eventId == selectedEvent;

        const matchesStatus =

            selectedStatus === "all"

            ||

            attendee.status === selectedStatus;

        return (

            matchesSearch

            &&

            matchesEvent

            &&

            matchesStatus

        );

    });

    loadAttendeesTable(attendees);

}

/* ==========================================
            EVENT LISTENERS
========================================== */

if (searchInput) {

    searchInput.addEventListener(

        "input",

        applyFilters

    );

}

if (eventFilter) {

    eventFilter.addEventListener(

        "change",

        applyFilters

    );

}

if (statusFilter) {

    statusFilter.addEventListener(

        "change",

        applyFilters

    );

}
/* ==========================================
            EDIT ATTENDEE
========================================== */

let editingId = null;

function editAttendee(id) {

    const attendees = getAttendees();

    const attendee = attendees.find(

        a => a.id === id

    );

    if (!attendee) return;

    editingId = id;

    document.getElementById("attendeeName").value =
        attendee.name;

    document.getElementById("attendeeEmail").value =
        attendee.email;

    document.getElementById("attendeePhone").value =
        attendee.phone;

    document.getElementById("attendeeEvent").value =
        attendee.eventId;

    document.getElementById("attendeeStatus").value =
        attendee.status;

    openModal();

}

/* ==========================================
        UPDATE ATTENDEE
========================================== */

function updateAttendee() {

    const attendees = getAttendees();

    const attendee = attendees.find(

        a => a.id === editingId

    );

    if (!attendee) return;

    attendee.name =
        document.getElementById("attendeeName").value.trim();

    attendee.email =
        document.getElementById("attendeeEmail").value.trim();

    attendee.phone =
        document.getElementById("attendeePhone").value.trim();

    attendee.eventId =
        Number(document.getElementById("attendeeEvent").value);

    attendee.status =
        document.getElementById("attendeeStatus").value;

    saveAttendees(attendees);

    editingId = null;

    closeModal();

    loadStatistics();

    loadAttendeesTable();

}

/* ==========================================
            CHECK IN
========================================== */

function checkIn(id) {

    const attendees = getAttendees();

    const attendee = attendees.find(

        a => a.id === id

    );

    if (!attendee) return;

    attendee.status = "Checked In";

    saveAttendees(attendees);

    loadStatistics();

    loadAttendeesTable();

}

/* ==========================================
            DELETE ATTENDEE
========================================== */

function deleteAttendee(id) {

    if (!confirm("Delete this attendee?")) {

        return;

    }

    let attendees = getAttendees();

    const attendee = attendees.find(

        a => a.id === id

    );

    if (!attendee) return;

    /* ---------- REMOVE ATTENDEE ---------- */

    attendees = attendees.filter(

        a => a.id !== id

    );

    saveAttendees(attendees);

    /* ---------- REMOVE TICKET ---------- */

    let tickets = getTickets();

    tickets = tickets.filter(

        ticket =>

            !(

                ticket.email === attendee.email

                &&

                ticket.eventId == attendee.eventId

            )

    );

    saveTickets(tickets);

    /* ---------- UPDATE EVENT ---------- */

    const events = getEvents();

    const event = events.find(

        e => e.id == attendee.eventId

    );

    if (event) {

        event.registered = Math.max(

            0,

            (event.registered || 1) - 1

        );

    }

    saveEvents(events);

    alert("Attendee deleted successfully.");

    loadStatistics();

    loadAttendeesTable();

}
/* ==========================================
            ADD / UPDATE ATTENDEE
========================================== */

function saveAttendee() {

    if (editingId === null) {

        registerAttendee();

    } else {

        updateAttendee();

    }

}

const saveBtn = document.getElementById("saveAttendee");

if (saveBtn) {

    saveBtn.addEventListener("click", saveAttendee);

}

/* ==========================================
            REGISTER ATTENDEE
========================================== */

function registerAttendee() {

    const name =
        document.getElementById("attendeeName").value.trim();

    const email =
        document.getElementById("attendeeEmail").value.trim();

    const phone =
        document.getElementById("attendeePhone").value.trim();

    const eventId =
        Number(document.getElementById("attendeeEvent").value);

    const status =
        document.getElementById("attendeeStatus").value;

    if (!name || !email || !phone || !eventId) {

        alert("Please fill all fields.");

        return;

    }

    const attendees = getAttendees();

    /* Prevent duplicate registration for SAME event */

    const exists = attendees.some(

        attendee =>

            attendee.email.toLowerCase() === email.toLowerCase()

            &&

            attendee.eventId == eventId

    );

    if (exists) {

        alert("Attendee already registered for this event.");

        return;

    }

    const nextId =

        attendees.length > 0

            ? Math.max(...attendees.map(a => a.id)) + 1

            : 1;

    attendees.push({

        id: nextId,

        name,

        email,

        phone,

        eventId,

        status

    });

    saveAttendees(attendees);

    /* Increase event count */

    const events = getEvents();

    const event = events.find(e => e.id == eventId);

    if (event) {

        event.registered = (event.registered || 0) + 1;

    }

    saveEvents(events);

    closeModal();

    loadStatistics();

    loadAttendeesTable();

    alert("Attendee Added Successfully.");

}

/* ==========================================
            EXPORT CSV
========================================== */

function exportCSV() {

    const attendees = getAttendees();

    const events = getEvents();

    let csv =

        "ID,Name,Email,Phone,Event,Status\n";

    attendees.forEach(attendee => {

        const event = events.find(

            e => e.id == attendee.eventId

        );

        csv +=

`${attendee.id},
${attendee.name},
${attendee.email},
${attendee.phone},
${event ? event.name : ""},
${attendee.status}
`;

    });

    const blob = new Blob(

        [csv],

        {

            type:"text/csv;charset=utf-8;"

        }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "attendees.csv";

    link.click();

}

/* ==========================================
            MODAL
========================================== */

function openModal() {

    document.getElementById("attendeeModal").style.display =

        "block";

}

function closeModal() {

    document.getElementById("attendeeModal").style.display =

        "none";

    editingId = null;

    document.getElementById("attendeeName").value = "";

    document.getElementById("attendeeEmail").value = "";

    document.getElementById("attendeePhone").value = "";

    document.getElementById("attendeeEvent").selectedIndex = 0;

    document.getElementById("attendeeStatus").value = "Pending";

}

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    loadEventDropdown();

    loadStatistics();

    loadAttendeesTable();

});

/* ==========================================
            STORAGE REFRESH
========================================== */

window.addEventListener("storage", () => {

    loadStatistics();

    loadAttendeesTable();

});
/* ==========================================
        EXPORT ATTENDEES CSV
========================================== */


function exportAttendeesCSV(){


    const attendees = JSON.parse(

        localStorage.getItem("attendees")

    ) || [];



    if(attendees.length === 0){


        alert("No attendees available to export");


        return;

    }




    let csv = "";


    csv += "ID,Name,Email,Event,Status,Registration Date\n";





    attendees.forEach(attendee=>{


        csv +=

        `${attendee.id},` +

        `${attendee.name},` +

        `${attendee.email},` +

        `${attendee.eventName},` +

        `${attendee.status},` +

        `${attendee.registrationDate}\n`;


    });







    const blob = new Blob(

        [csv],

        {
            type:"text/csv"
        }

    );





    const url = URL.createObjectURL(blob);





    const link = document.createElement("a");



    link.href = url;



    link.download = "attendees.csv";



    link.click();





    URL.revokeObjectURL(url);


}