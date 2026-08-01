/* ==========================================
            EVENTAI DASHBOARD
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

        "Administrator"

};

/* ==========================================
            LOAD USER
========================================== */

function loadUser() {

    const user =

        document.querySelector(".user span");

    if(user){

        user.textContent =

            currentUser.name;

    }

}
/* ==========================================
            DASHBOARD STATISTICS
========================================== */

function loadStatistics() {

    const events = getEvents();
    const attendees = getAttendees();
    const tickets = getTickets();

    // ===== TOTAL EVENTS =====
    document.getElementById("totalEvents").textContent =
        events.length;

    // ===== TOTAL ATTENDEES =====
    document.getElementById("totalAttendees").textContent =
        attendees.length;

    // ===== TOTAL TICKETS =====
    document.getElementById("totalTickets").textContent =
        tickets.length;

    // ===== TOTAL REVENUE =====
    let revenue = 0;

    tickets.forEach(ticket => {
        revenue += Number(ticket.price || 0);
    });

    document.getElementById("totalRevenue").textContent =
        "₹" + revenue.toLocaleString("en-IN");

    // ===== UPCOMING EVENTS =====
    const upcoming =
        events.filter(event =>
            event.status === "Upcoming"
        ).length;

    document.getElementById("upcomingEvents").textContent =
        upcoming;

    // ===== COMPLETED EVENTS =====
    const completed =
        events.filter(event =>
            event.status === "Completed"
        ).length;

    document.getElementById("completedEvents").textContent =
        completed;

    // ===== CHECKED-IN ATTENDEES =====
    const checkedIn =
        attendees.filter(attendee =>
            attendee.status === "Checked In"
        ).length;

    document.getElementById("checkedInCount").textContent =
        checkedIn;

    // ===== REGISTRATION RATE =====
    const totalCapacity =
        events.reduce(
            (sum, event) => sum + Number(event.capacity || 0),
            0
        );

    const totalRegistered =
        events.reduce(
            (sum, event) => sum + Number(event.registered || 0),
            0
        );

    const registrationRate =
        totalCapacity > 0
            ? Math.round((totalRegistered / totalCapacity) * 100)
            : 0;

    document.getElementById("registrationRate").textContent =
        registrationRate + "%";
}
/* ==========================================
            RECENT EVENTS
========================================== */

function loadRecentEvents() {

    const tbody =

        document.getElementById(

            "recentEventsTable"

        );

    if (!tbody) return;

    tbody.innerHTML = "";

    const events = getEvents();

    if (events.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4"

                    style="text-align:center;padding:20px;">

                    No events available.

                </td>

            </tr>

        `;

        return;

    }

    /* ---------- SORT BY ID ---------- */

    const latestEvents =

        [...events]

        .sort((a, b) => b.id - a.id)

        .slice(0, 5);

    latestEvents.forEach(event => {

        let badgeClass = "upcoming";

        if (event.status === "Completed") {

            badgeClass = "completed";

        }

        else if (event.status === "Open") {

            badgeClass = "pending";

        }

        tbody.innerHTML += `

        <tr>

            <td>

                ${event.name}

            </td>

            <td>

                ${new Date(event.date)

                    .toLocaleDateString("en-IN")}

            </td>

            <td>

                ${event.venue}

            </td>

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
            REFRESH DASHBOARD
========================================== */

function refreshDashboard() {

    loadUser();

    loadStatistics();

    loadRecentEvents();

}

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- ADMIN ONLY ---------- */

    const role =

        localStorage.getItem("userRole");

    if (role !== "admin") {

        window.location.href =

            "user-dashboard.html";

        return;

    }

    refreshDashboard();

});

/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener("storage", () => {

    refreshDashboard();

});
/* ==========================================
            ACTIVITY LOG
========================================== */

function getActivities() {

    return JSON.parse(

        localStorage.getItem("activities")

    ) || [];

}

function saveActivity(message) {

    const activities = getActivities();

    activities.unshift({

        message,

        time: new Date().toLocaleString("en-IN")

    });

    /* Keep only latest 20 */

    if (activities.length > 20) {

        activities.pop();

    }

    localStorage.setItem(

        "activities",

        JSON.stringify(activities)

    );

}

/* ==========================================
            LOAD ACTIVITIES
========================================== */

function loadActivities() {

    const activityList =

        document.getElementById("activityList");

    if (!activityList) return;

    const activities = getActivities();

    activityList.innerHTML = "";

    if (activities.length === 0) {

        activityList.innerHTML = `

            <li>

                No recent activity.

            </li>

        `;

        return;

    }

    activities.forEach(activity => {

        activityList.innerHTML += `

            <li>

                <strong>

                    ${activity.message}

                </strong>

                <br>

                <small>

                    ${activity.time}

                </small>

            </li>

        `;

    });

}

/* ==========================================
            UPDATE REFRESH
========================================== */

function refreshDashboard() {

    loadUser();

    loadStatistics();

    loadRecentEvents();

    loadActivities();

}

console.log("EventAI Dashboard Loaded");