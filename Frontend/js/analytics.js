/* ==========================================
            EVENTAI ANALYTICS
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

        "Administrator",

    role:

        localStorage.getItem("userRole") ||

        "admin"

};

/* ==========================================
            LOAD USER
========================================== */

function loadUser() {

    const user =

        document.getElementById("loggedUserName");

    if(user){

        user.textContent =

            currentUser.name;

    }

}

/* ==========================================
            SECURITY
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    if(currentUser.role !== "admin"){

        window.location.href="user-dashboard.html";

        return;

    }

});

/* ==========================================
            LOAD STATISTICS
========================================== */

function loadStatistics(){

    const events = getEvents();

    const attendees = getAttendees();

    const tickets = getTickets();

    let revenue = 0;

    tickets.forEach(ticket=>{

        revenue += Number(ticket.price || 0);

    });

    document.getElementById("analyticsEvents").textContent =

        events.length;

    document.getElementById("analyticsAttendees").textContent =

        attendees.length;

    document.getElementById("analyticsTickets").textContent =

        tickets.length;

    document.getElementById("analyticsRevenue").textContent =

        "₹" + revenue.toLocaleString("en-IN");

}
/* ==========================================
            REVENUE CHART
========================================== */

let revenueChart = null;

function loadRevenueChart() {

    const events = getEvents();

    const labels = [];

    const revenue = [];

    events.forEach(event => {

        labels.push(event.name);

        revenue.push(

            (event.registered || 0) *

            Number(event.price || 0)

        );

    });

    if (revenueChart) {

        revenueChart.destroy();

    }

    revenueChart = new Chart(

        document.getElementById("revenueChart"),

        {

            type: "bar",

            data: {

                labels: labels,

                datasets: [

                    {

                        label: "Revenue (₹)",

                        data: revenue,

                        backgroundColor: "#2563EB",

                        borderRadius: 8

                    }

                ]

            },

            options: {

                responsive: true,

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

/* ==========================================
            STATUS CHART
========================================== */

let statusChart = null;

function loadStatusChart() {

    const events = getEvents();

    const upcoming = events.filter(

        event =>

            event.status === "Upcoming"

    ).length;

    const open = events.filter(

        event =>

            event.status === "Open"

    ).length;

    const completed = events.filter(

        event =>

            event.status === "Completed"

    ).length;

    if (statusChart) {

        statusChart.destroy();

    }

    statusChart = new Chart(

        document.getElementById("statusChart"),

        {

            type: "pie",

            data: {

                labels: [

                    "Upcoming",

                    "Open",

                    "Completed"

                ],

                datasets: [

                    {

                        data: [

                            upcoming,

                            open,

                            completed

                        ],

                        backgroundColor: [

                            "#3B82F6",

                            "#F59E0B",

                            "#22C55E"

                        ]

                    }

                ]

            },

            options: {

                responsive: true

            }

        }

    );

}
/* ==========================================
            CATEGORY CHART
========================================== */

let categoryChart = null;

function loadCategoryChart() {

    const events = getEvents();

    const categoryMap = {};

    events.forEach(event => {

        const category = event.category || "Other";

        categoryMap[category] =

            (categoryMap[category] || 0) + 1;

    });

    if (categoryChart) {

        categoryChart.destroy();

    }

    categoryChart = new Chart(

        document.getElementById("categoryChart"),

        {

            type: "doughnut",

            data: {

                labels: Object.keys(categoryMap),

                datasets: [

                    {

                        data: Object.values(categoryMap),

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

/* ==========================================
            REGISTRATION CHART
========================================== */

let registrationChart = null;

function loadRegistrationChart() {

    const events = getEvents();

    const labels = [];

    const registrations = [];

    events.forEach(event => {

        labels.push(event.name);

        registrations.push(

            event.registered || 0

        );

    });

    if (registrationChart) {

        registrationChart.destroy();

    }

    registrationChart = new Chart(

        document.getElementById("registrationChart"),

        {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {

                        label: "Registrations",

                        data: registrations,

                        borderColor: "#2563EB",

                        backgroundColor: "rgba(37,99,235,0.2)",

                        fill: true,

                        tension: 0.4

                    }

                ]

            },

            options: {

                responsive: true,

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        }

    );

}

/* ==========================================
            PERFORMANCE TABLE
========================================== */

function loadPerformanceTable() {

    const table =

        document.getElementById("analyticsTable");

    if (!table) return;

    table.innerHTML = "";

    const events = getEvents();

    if (events.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="5"

                style="text-align:center;padding:20px;">

                No events available.

            </td>

        </tr>

        `;

        return;

    }

    events.forEach(event => {

        const revenue =

            (event.registered || 0)

            *

            Number(event.price || 0);

        let badgeClass = "upcoming";

        if (event.status === "Completed") {

            badgeClass = "completed";

        }

        else if (event.status === "Open") {

            badgeClass = "pending";

        }

        table.innerHTML += `

        <tr>

            <td>

                ${event.name}

            </td>

            <td>

                ${event.registered || 0}

            </td>

            <td>

                ${event.capacity || "-"}

            </td>

            <td>

                ₹${revenue.toLocaleString("en-IN")}

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
            TOP PERFORMING EVENTS
========================================== */

function loadTopEvents() {

    const container =

        document.getElementById("topEvents");

    if (!container) return;

    container.innerHTML = "";

    const events = [...getEvents()]

        .sort((a, b) =>

            (b.registered || 0) -

            (a.registered || 0)

        )

        .slice(0, 5);

    if (events.length === 0) {

        container.innerHTML =

            "<p>No event data available.</p>";

        return;

    }

    events.forEach((event, index) => {

        const revenue =

            (event.registered || 0) *

            Number(event.price || 0);

        container.innerHTML += `

        <div class="card"

             style="margin-bottom:15px;">

            <h3>

                #${index + 1} ${event.name}

            </h3>

            <p>

                👥 ${event.registered || 0} Registrations

            </p>

            <p>

                💰 ₹${revenue.toLocaleString("en-IN")}

            </p>

        </div>

        `;

    });

}

/* ==========================================
            QUICK INSIGHTS
========================================== */

function loadInsights() {

    const events = getEvents();

    if (events.length === 0) return;

    const popular =

        [...events].sort(

            (a, b) =>

                (b.registered || 0)

                -

                (a.registered || 0)

        )[0];

    document.getElementById(

        "mostPopularEvent"

    ).textContent =

        popular.name;

    document.getElementById(

        "highestRevenue"

    ).textContent =

        "₹" +

        (

            (popular.registered || 0)

            *

            Number(popular.price || 0)

        ).toLocaleString("en-IN");

    const attendance =

        events.reduce(

            (sum, event) =>

                sum +

                (

                    (event.registered || 0)

                    /

                    (event.capacity || 1)

                ) *

                100,

            0

        ) / events.length;

    document.getElementById(

        "averageAttendance"

    ).textContent =

        attendance.toFixed(1) + "%";

}

/* ==========================================
            REFRESH ANALYTICS
========================================== */

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

/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener("storage", () => {

    refreshAnalytics();

});

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (

        currentUser.role !== "admin"

    ) {

        window.location.href =

            "user-dashboard.html";

        return;

    }

    refreshAnalytics();

});

/* ==========================================
            DEBUG
========================================== */

console.log("====================================");

console.log("EventAI Analytics Loaded");

console.log("Admin :", currentUser.name);

console.log("====================================");