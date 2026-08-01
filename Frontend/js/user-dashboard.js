/* ==========================================
            EVENTAI USER DASHBOARD
========================================== */

/* ==========================================
            LOCAL STORAGE
========================================== */

function getEvents() {
    return JSON.parse(localStorage.getItem("events")) || [];
}

function getAttendees() {
    return JSON.parse(localStorage.getItem("attendees")) || [];
}

function getTickets() {
    return JSON.parse(localStorage.getItem("tickets")) || [];
}

/* ==========================================
            CURRENT USER
========================================== */

const currentUser = {
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "",
    role: localStorage.getItem("userRole") || "user"
};

/* ==========================================
            LOAD USER
========================================== */

function loadUser() {

    const nameElement = document.getElementById("loggedUserName");

    if (nameElement) {
        nameElement.textContent = currentUser.name;
    }

    const roleElement = document.getElementById("userRole");

    if (roleElement) {
        roleElement.textContent = "User";
    }
}

/* ==========================================
            USER SECURITY
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (currentUser.role !== "user") {
        window.location.href = "dashboard.html";
        return;
    }

});
/* ==========================================
            DASHBOARD STATISTICS
========================================== */

function loadStatistics() {

    const events = getEvents();
    const attendees = getAttendees();
    const tickets = getTickets();

    /* ---------- AVAILABLE EVENTS ---------- */

    const availableEvents = events.filter(event => {
        return (
            event.status &&
            event.status.toLowerCase() !== "completed"
        );
    }).length;

    document.getElementById("availableEvents").textContent =
        availableEvents;

    /* ---------- MY REGISTRATIONS ---------- */

    const myRegistrations = attendees.filter(attendee => {
        return (
            attendee.email &&
            attendee.email.toLowerCase() ===
            currentUser.email.toLowerCase()
        );
    });

    document.getElementById("myRegistrations").textContent =
        myRegistrations.length;

    /* ---------- MY TICKETS ---------- */

    const myTickets = tickets.filter(ticket => {
        return (
            ticket.email &&
            ticket.email.toLowerCase() ===
            currentUser.email.toLowerCase()
        );
    });

    document.getElementById("myTickets").textContent =
        myTickets.length;

    /* ---------- UPCOMING EVENTS ---------- */

    const upcomingEvents = events.filter(event => {

        if (!event.status) return false;

        return (
            event.status.toLowerCase() === "upcoming"
        );

    }).length;

    document.getElementById("upcomingEvents").textContent =
        upcomingEvents;

    /* ---------- DEBUG ---------- */

    console.log("========== USER DASHBOARD ==========");
    console.log("Current User:", currentUser);
    console.log("Events:", events);
    console.log("Attendees:", attendees);
    console.log("Tickets:", tickets);
    console.log("====================================");
}
/* ==========================================
            MY REGISTERED EVENTS
========================================== */

function loadMyEvents() {

    const table = document.getElementById("myEventsTable");

    if (!table) return;

    table.innerHTML = "";

    const events = getEvents();
    const attendees = getAttendees();

    /* ---------- MY REGISTRATIONS ---------- */

    const myRegistrations = attendees.filter(attendee => {

        return (
            attendee.email &&
            attendee.email.toLowerCase() ===
            currentUser.email.toLowerCase()
        );

    });

    if (myRegistrations.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4"
                    style="text-align:center;padding:20px;">
                    You haven't registered for any events.
                </td>
            </tr>
        `;

        return;
    }

    myRegistrations.forEach(registration => {

        const event = events.find(e =>
            Number(e.id) === Number(registration.eventId)
        );

        if (!event) return;

        let badgeClass = "upcoming";

        if (
            event.status &&
            event.status.toLowerCase() === "completed"
        ) {
            badgeClass = "completed";
        }
        else if (
            event.status &&
            event.status.toLowerCase() === "open"
        ) {
            badgeClass = "pending";
        }

        table.innerHTML += `
            <tr>

                <td>${event.name}</td>

                <td>${new Date(event.date)
                    .toLocaleDateString("en-IN")}</td>

                <td>${event.venue}</td>

                <td>
                    <span class="badge ${badgeClass}">
                        ${event.status}
                    </span>
                </td>

            </tr>
        `;

    });

}
/* ==========================================
            MY TICKETS
========================================== */

function loadMyTickets() {

    const table = document.getElementById("myTicketsTable");

    if (!table) return;

    table.innerHTML = "";

    const tickets = getTickets();

    /* ---------- FILTER USER TICKETS ---------- */

    const myTickets = tickets.filter(ticket => {

        return (
            ticket.email &&
            ticket.email.toLowerCase() ===
            currentUser.email.toLowerCase()
        );

    });

    if (myTickets.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4"
                    style="text-align:center;padding:20px;">
                    No tickets available.
                </td>
            </tr>
        `;

        return;
    }

    myTickets.forEach(ticket => {

        let badgeClass = "completed";

        if (ticket.status) {

            const status = ticket.status.toLowerCase();

            if (status === "upcoming") {
                badgeClass = "upcoming";
            }
            else if (status === "open") {
                badgeClass = "pending";
            }
        }

        table.innerHTML += `
            <tr>

                <td>${ticket.ticketId}</td>

                <td>${ticket.eventName}</td>

                <td>
                    ${new Date(ticket.date)
                        .toLocaleDateString("en-IN")}
                </td>

                <td>
                    <span class="badge ${badgeClass}">
                        ${ticket.status || "Booked"}
                    </span>
                </td>

            </tr>
        `;

    });

}
/* ==========================================
            UPCOMING EVENTS
========================================== */

function loadUpcomingEvents() {

    const container = document.getElementById("upcomingEventsList");

    if (!container) return;

    container.innerHTML = "";

    const events = getEvents()
        .filter(event =>
            event.status &&
            event.status.toLowerCase() === "upcoming"
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    if (events.length === 0) {

        container.innerHTML = `
            <p style="text-align:center;padding:20px;">
                No upcoming events available.
            </p>
        `;

        return;
    }

    events.forEach(event => {

        container.innerHTML += `
            <div class="card" style="margin-bottom:15px;">

                <h3>${event.name}</h3>

                <p>
                    <strong>Date:</strong>
                    ${new Date(event.date).toLocaleDateString("en-IN")}
                </p>

                <p>
                    <strong>Venue:</strong>
                    ${event.venue}
                </p>

                <p>
                    <strong>Price:</strong>
                    ${Number(event.price) > 0 ? "₹" + event.price : "Free"}
                </p>

            </div>
        `;

    });

}

/* ==========================================
            REFRESH DASHBOARD
========================================== */

function refreshDashboard() {

    loadUser();
    loadStatistics();
    loadMyEvents();
    loadMyTickets();
    loadUpcomingEvents();

}

/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener("storage", () => {

    refreshDashboard();

});

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (currentUser.role !== "user") {

        window.location.href = "dashboard.html";
        return;

    }

    refreshDashboard();

});

/* ==========================================
            LOGOUT
========================================== */

/* ==========================================
            HELPERS
========================================== */

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "2-digit",
        month: "short",
        year: "numeric"

    });

}

/* ==========================================
            DEBUG
========================================== */

console.log("======================================");
console.log("EventAI User Dashboard Loaded");
console.log("Current User :", currentUser);
console.log("Events :", getEvents());
console.log("Attendees :", getAttendees());
console.log("Tickets :", getTickets());
console.log("======================================");