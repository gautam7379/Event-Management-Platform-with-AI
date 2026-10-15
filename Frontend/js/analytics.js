// ==========================================
// EVENTAI ANALYTICS - BACKEND CONNECTED
// ==========================================

let events = [];
let registrations = [];
let ticketMap = {};

let revenueChart = null;
let statusChart = null;
let categoryChart = null;
let registrationChart = null;

const $ = id => document.getElementById(id);


// ==========================================
// CURRENT USER
// ==========================================

const currentUser = {

    name:
        localStorage.getItem("userName") ||
        "Administrator",

    role:
        localStorage.getItem("userRole") ||
        "admin"

};


// ==========================================
// LOAD USER
// ==========================================

function loadUser() {

    if ($("loggedUserName")) {

        $("loggedUserName").textContent =
            currentUser.name;
    }
}


// ==========================================
// EVENT STATUS
// Uses actual backend/database status
// ==========================================

function getEventStatus(event) {

    if (!event) {
        return "Draft";
    }

    return event.status || "Draft";
}


// ==========================================
// ACTIVE REGISTRATIONS
// Cancelled registrations are not attendees
// ==========================================

function getActiveRegistrations() {

    return registrations.filter(registration =>

        String(registration.status || "")
            .toLowerCase() !== "cancelled"

    );
}


// ==========================================
// REGISTRATION COUNT BY EVENT
// ==========================================

function getRegistrationCount(eventId) {

    return getActiveRegistrations()
        .filter(registration =>

            Number(registration.event_id) ===
            Number(eventId)

        )
        .length;
}


// ==========================================
// GET EVENT TICKETS
// ==========================================

function getEventTickets(eventId) {

    return ticketMap[eventId] || [];
}


// ==========================================
// GET MAIN TICKET
// ==========================================

function getMainTicket(eventId) {

    const tickets =
        getEventTickets(eventId);

    return tickets.length
        ? tickets[0]
        : null;
}


// ==========================================
// GET TICKET PRICE
// ==========================================

function getTicketPrice(eventId) {

    const ticket =
        getMainTicket(eventId);

    return Number(
        ticket?.price || 0
    );
}


// ==========================================
// EVENT REVENUE
//
// Current backend registration response does
// not expose payment amount, so revenue is
// estimated from active registrations *
// current first ticket price.
// ==========================================

function getEventRevenue(eventId) {

    const registrationCount =
        getRegistrationCount(eventId);

    const ticketPrice =
        getTicketPrice(eventId);

    return registrationCount * ticketPrice;
}


// ==========================================
// TOTAL REVENUE
// ==========================================

function getTotalRevenue() {

    return events.reduce(

        (sum, event) =>
            sum + getEventRevenue(event.id),

        0
    );
}


// ==========================================
// LOAD ALL BACKEND DATA
// ==========================================

async function loadAnalyticsData() {

    try {

        // ----------------------------------
        // EVENTS
        // ----------------------------------

        events =
            await Api.events.list();


        // ----------------------------------
        // ALL REGISTRATIONS
        // Admin endpoint
        // ----------------------------------

        registrations =
            await Api.registrations.list();


        // ----------------------------------
        // TICKETS FOR EACH EVENT
        // ----------------------------------

        ticketMap = {};

        await Promise.all(

            events.map(async event => {

                try {

                    const tickets =
                        await Api.tickets.event(
                            event.id
                        );

                    ticketMap[event.id] =
                        Array.isArray(tickets)
                            ? tickets
                            : [];

                }

                catch (error) {

                    console.warn(
                        `Failed to load tickets for event ${event.id}`,
                        error
                    );

                    ticketMap[event.id] = [];
                }

            })

        );


        console.log(
            "ANALYTICS EVENTS:",
            events
        );

        console.log(
            "ANALYTICS REGISTRATIONS:",
            registrations
        );

        console.log(
            "ANALYTICS TICKETS:",
            ticketMap
        );


        refreshAnalytics();

    }

    catch (error) {

        console.error(
            "Analytics loading failed:",
            error
        );

        alert(
            error.message ||
            "Failed to load analytics."
        );
    }
}


// ==========================================
// STATISTICS
// ==========================================

function loadStatistics() {

    const activeRegistrations =
        getActiveRegistrations();

    const totalEvents =
        events.length;

    // Registration = attendee for the
    // currently available backend data
    const totalAttendees =
        activeRegistrations.length;

    const ticketsSold =
        activeRegistrations.length;

    const revenue =
        getTotalRevenue();


    if ($("analyticsEvents")) {

        $("analyticsEvents").textContent =
            totalEvents;
    }


    if ($("analyticsAttendees")) {

        $("analyticsAttendees").textContent =
            totalAttendees;
    }


    if ($("analyticsTickets")) {

        $("analyticsTickets").textContent =
            ticketsSold;
    }


    if ($("analyticsRevenue")) {

        $("analyticsRevenue").textContent =
            "₹" +
            revenue.toLocaleString("en-IN");
    }
}


// ==========================================
// REVENUE CHART
// ==========================================

function loadRevenueChart() {

    const canvas =
        $("revenueChart");

    if (!canvas) return;


    const labels =
        events.map(event =>
            event.event_name
        );


    const revenueData =
        events.map(event =>
            getEventRevenue(event.id)
        );


    if (revenueChart) {

        revenueChart.destroy();
    }


    revenueChart = new Chart(

        canvas,

        {

            type: "bar",

            data: {

                labels,

                datasets: [

                    {

                        label:
                            "Revenue (₹)",

                        data:
                            revenueData,

                        backgroundColor:
                            "#2563EB",

                        borderRadius:
                            8
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: true,

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        }

    );
}


// ==========================================
// STATUS CHART
// Uses database event.status values
// dynamically instead of hard-coded statuses.
// ==========================================

function loadStatusChart() {

    const canvas =
        $("statusChart");

    if (!canvas) return;


    const statusMap = {};


    events.forEach(event => {

        const status =
            getEventStatus(event);

        statusMap[status] =
            (statusMap[status] || 0) + 1;

    });


    if (statusChart) {

        statusChart.destroy();
    }


    statusChart = new Chart(

        canvas,

        {

            type: "pie",

            data: {

                labels:
                    Object.keys(statusMap),

                datasets: [

                    {

                        data:
                            Object.values(statusMap),

                        backgroundColor: [

                            "#3B82F6",
                            "#22C55E",
                            "#F59E0B",
                            "#EF4444",
                            "#8B5CF6",
                            "#06B6D4"

                        ]

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }

    );
}


// ==========================================
// CATEGORY CHART
//
// Backend field:
// event_type
//
// NOT:
// category
// ==========================================

function loadCategoryChart() {

    const canvas =
        $("categoryChart");

    if (!canvas) return;


    const categoryMap = {};


    events.forEach(event => {

        const category =
            event.event_type ||
            "Other";


        categoryMap[category] =
            (categoryMap[category] || 0)
            + 1;

    });


    if (categoryChart) {

        categoryChart.destroy();
    }


    categoryChart = new Chart(

        canvas,

        {

            type: "doughnut",

            data: {

                labels:
                    Object.keys(categoryMap),

                datasets: [

                    {

                        data:
                            Object.values(categoryMap),

                        backgroundColor: [

                            "#2563EB",
                            "#22C55E",
                            "#F59E0B",
                            "#EF4444",
                            "#8B5CF6",
                            "#06B6D4"

                        ]

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }

    );
}


// ==========================================
// REGISTRATION CHART
// ==========================================

function loadRegistrationChart() {

    const canvas =
        $("registrationChart");

    if (!canvas) return;


    const labels =
        events.map(event =>
            event.event_name
        );


    const registrationData =
        events.map(event =>
            getRegistrationCount(event.id)
        );


    if (registrationChart) {

        registrationChart.destroy();
    }


    registrationChart = new Chart(

        canvas,

        {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label:
                            "Registrations",

                        data:
                            registrationData,

                        borderColor:
                            "#2563EB",

                        backgroundColor:
                            "rgba(37,99,235,0.2)",

                        fill:
                            true,

                        tension:
                            0.4

                    }

                ]

            },

            options: {

                responsive: true,

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            precision: 0

                        }

                    }

                }

            }

        }

    );
}


// ==========================================
// BADGE CLASS
// ==========================================

function getBadgeClass(status) {

    const value =
        String(status || "")
            .toLowerCase();


    if (value === "completed") {

        return "completed";
    }


    if (value === "published") {

        return "completed";
    }


    if (value === "open") {

        return "pending";
    }


    if (value === "cancelled") {

        return "cancelled";
    }


    if (value === "draft") {

        return "pending";
    }


    return "upcoming";
}


// ==========================================
// PERFORMANCE TABLE
// ==========================================

function loadPerformanceTable() {

    const table =
        $("analyticsTable");


    if (!table) return;


    table.innerHTML = "";


    if (!events.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:20px;
                    "
                >

                    No events available.

                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML =

        events.map(event => {


            const registrationsCount =
                getRegistrationCount(
                    event.id
                );


            const revenue =
                getEventRevenue(
                    event.id
                );


            const status =
                getEventStatus(
                    event
                );


            const badgeClass =
                getBadgeClass(status);


            return `

                <tr>

                    <td>

                        ${event.event_name || "-"}

                    </td>


                    <td>

                        ${registrationsCount}

                    </td>


                    <td>

                        ${event.capacity ?? "-"}

                    </td>


                    <td>

                        ₹${revenue.toLocaleString(
                            "en-IN"
                        )}

                    </td>


                    <td>

                        <span
                            class="badge ${badgeClass}"
                        >

                            ${status}

                        </span>

                    </td>

                </tr>

            `;

        }).join("");
}


// ==========================================
// TOP PERFORMING EVENTS
// ==========================================

function loadTopEvents() {

    const container =
        $("topEvents");


    if (!container) return;


    container.innerHTML = "";


    const topEvents =

        [...events]

            .sort(

                (a, b) =>

                    getRegistrationCount(b.id)

                    -

                    getRegistrationCount(a.id)

            )

            .slice(0, 5);


    if (!topEvents.length) {

        container.innerHTML =

            "<p>No event data available.</p>";

        return;
    }


    container.innerHTML =

        topEvents.map(

            (event, index) => {


                const count =
                    getRegistrationCount(
                        event.id
                    );


                const revenue =
                    getEventRevenue(
                        event.id
                    );


                return `

                    <div
                        class="card"
                        style="
                            margin-bottom:15px;
                        "
                    >

                        <h3>

                            #${index + 1}

                            ${event.event_name}

                        </h3>


                        <p>

                            👥 ${count}
                            Registrations

                        </p>


                        <p>

                            💰 ₹${revenue.toLocaleString(
                                "en-IN"
                            )}

                        </p>

                    </div>

                `;

            }

        ).join("");
}


// ==========================================
// QUICK INSIGHTS
// ==========================================

function loadInsights() {

    if (!events.length) {

        if ($("mostPopularEvent")) {

            $("mostPopularEvent")
                .textContent = "-";
        }

        if ($("highestRevenue")) {

            $("highestRevenue")
                .textContent = "₹0";
        }

        if ($("averageAttendance")) {

            $("averageAttendance")
                .textContent = "0%";
        }

        return;
    }


    // --------------------------------------
    // MOST POPULAR EVENT
    // --------------------------------------

    const mostPopular =

        [...events].sort(

            (a, b) =>

                getRegistrationCount(b.id)

                -

                getRegistrationCount(a.id)

        )[0];


    if ($("mostPopularEvent")) {

        $("mostPopularEvent").textContent =

            mostPopular.event_name;
    }


    // --------------------------------------
    // HIGHEST REVENUE EVENT
    // --------------------------------------

    const highestRevenueEvent =

        [...events].sort(

            (a, b) =>

                getEventRevenue(b.id)

                -

                getEventRevenue(a.id)

        )[0];


    if ($("highestRevenue")) {

        $("highestRevenue").textContent =

            "₹" +

            getEventRevenue(
                highestRevenueEvent.id
            ).toLocaleString("en-IN");
    }


    // --------------------------------------
    // AVERAGE ATTENDANCE / CAPACITY USE
    // --------------------------------------

    const attendancePercentages =

        events.map(event => {

            const capacity =
                Number(
                    event.capacity || 0
                );


            if (capacity <= 0) {

                return 0;
            }


            return (

                getRegistrationCount(event.id)

                /

                capacity

            ) * 100;

        });


    const average =

        attendancePercentages.reduce(

            (sum, value) =>
                sum + value,

            0

        )

        /

        attendancePercentages.length;


    if ($("averageAttendance")) {

        $("averageAttendance").textContent =

            average.toFixed(1) + "%";
    }
}


// ==========================================
// REFRESH UI
// ==========================================

function refreshAnalytics() {

    loadUser();

    loadStatistics();

    loadRevenueChart();

    loadStatusChart();

    loadCategoryChart();

    loadRegistrationChart();

    loadPerformanceTable();

    loadTopEvents();

    loadInsights();
}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        if (!requireLogin()) {

            return;
        }


        const role =

            String(
                localStorage.getItem("userRole")
                || ""
            ).toLowerCase();


        if (

            role !== "admin"

            &&

            role !== "administrator"

        ) {

            window.location.href =
                "user-dashboard.html";

            return;
        }


        await loadAnalyticsData();

    }

);


// ==========================================
// DEBUG
// ==========================================

console.log(
    "EventAI Analytics Backend Version Loaded"
);