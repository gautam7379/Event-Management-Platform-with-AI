/* ==========================================
        EVENTAI ADMIN DASHBOARD
========================================== */

const $ = (id) =>
    document.getElementById(id);


/* ==========================================
        MONEY FORMAT
========================================== */

function formatMoney(value) {

    return (
        "₹" +
        Number(value || 0)
            .toLocaleString("en-IN")
    );
}


/* ==========================================
        DATE FORMAT
========================================== */

function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* ==========================================
        LOAD CURRENT USER FROM BACKEND
========================================== */

async function loadCurrentUser() {

    try {

        /*
            GET authenticated user
            using JWT through Api.me()
        */

        const user =
            await Api.me();


        console.log(
            "Dashboard user:",
            user
        );


        /* ----------------------------------
                USER NAME
        ---------------------------------- */

        const fullName = [

            user.first_name,

            user.last_name

        ]
        .filter(Boolean)
        .join(" ");


        if ($("loggedUserName")) {

            $("loggedUserName")
                .textContent =
                fullName || user.email || "User";
        }


        /* ----------------------------------
                USER ROLE
        ---------------------------------- */

        let roleName =
            "User";


        if (Number(user.role_id) === 1) {

            roleName =
                "Admin";

        } else if (
            Number(user.role_id) === 2
        ) {

            roleName =
                "Organizer";
        }


        if ($("userRole")) {

            $("userRole")
                .textContent =
                roleName;
        }


        return user;

    } catch (error) {

        console.error(
            "Unable to load current user:",
            error
        );

        throw error;
    }
}


/* ==========================================
        LOAD DASHBOARD DATA
========================================== */

async function loadDashboard() {

    if (!requireLogin()) {
        return;
    }


    try {

        /*
            Load backend data concurrently.
        */

        const [

            currentUser,

            events,

            analytics

        ] = await Promise.all([

            loadCurrentUser(),

            Api.events.list(),

            Api.analytics()
                .catch(error => {

                    console.warn(
                        "Analytics unavailable:",
                        error
                    );

                    return null;
                })

        ]);


        console.log(
            "Events:",
            events
        );

        console.log(
            "Analytics:",
            analytics
        );


        /* ==================================
                TOTAL EVENTS
        ================================== */

        if ($("totalEvents")) {

            $("totalEvents")
                .textContent =
                analytics?.total_events
                ?? events.length;
        }


        /* ==================================
                TOTAL ATTENDEES
        ================================== */

        if ($("totalAttendees")) {

            $("totalAttendees")
                .textContent =
                analytics?.total_registrations
                ?? 0;
        }


        /* ==================================
                TOTAL TICKETS
        ================================== */

        if ($("totalTickets")) {

            $("totalTickets")
                .textContent =
                analytics?.total_tickets
                ?? 0;
        }


        /* ==================================
                TOTAL REVENUE
        ================================== */

        if ($("totalRevenue")) {

            $("totalRevenue")
                .textContent =
                formatMoney(
                    analytics?.total_revenue
                    ?? 0
                );
        }


        /* ==================================
                UPCOMING EVENTS
        ================================== */

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const upcomingEvents =

            events.filter(event => {

                if (!event.start_date) {
                    return false;
                }

                const startDate =
                    new Date(
                        event.start_date +
                        "T00:00:00"
                    );

                return (
                    startDate >= today &&
                    event.status !== "Completed"
                );

            }).length;


        if ($("upcomingEvents")) {

            $("upcomingEvents")
                .textContent =
                upcomingEvents;
        }


        /* ==================================
                COMPLETED EVENTS
        ================================== */

        const completedEvents =

            events.filter(

                event =>

                    String(
                        event.status
                    ).toLowerCase()
                    === "completed"

            ).length;


        if ($("completedEvents")) {

            $("completedEvents")
                .textContent =
                completedEvents;
        }


        /* ==================================
                CHECKED-IN ATTENDEES
        ================================== */

        if ($("checkedInCount")) {

            $("checkedInCount")
                .textContent =

                analytics?.checked_in_count

                ?? analytics?.total_checkins

                ?? 0;
        }


        /* ==================================
                REGISTRATION RATE
        ================================== */

        let registrationRate =
            analytics?.registration_rate;


        /*
            Only calculate locally if backend
            doesn't provide registration_rate
            but does provide capacity.
        */

        if (
            registrationRate == null &&
            analytics?.total_registrations != null &&
            analytics?.total_capacity
        ) {

            registrationRate =

                (
                    Number(
                        analytics.total_registrations
                    )

                    /

                    Number(
                        analytics.total_capacity
                    )

                    *

                    100
                );
        }


        if ($("registrationRate")) {

            $("registrationRate")
                .textContent =

                registrationRate != null

                    ? (
                        Number(
                            registrationRate
                        ).toFixed(1)
                        + "%"
                    )

                    : "0%";
        }


        /* ==================================
                RECENT EVENTS
        ================================== */

        renderRecentEvents(
            events
        );


        /* ==================================
                ACTIVITY
        ================================== */

        renderActivity(
            analytics
        );


    } catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );

        alert(
            error.message ||
            "Unable to load dashboard."
        );
    }
}


/* ==========================================
        RECENT EVENTS
========================================== */

function renderRecentEvents(
    events
) {

    const table =
        $("recentEventsTable");

    if (!table) {
        return;
    }


    if (!events.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;">

                    No events available.

                </td>

            </tr>

        `;

        return;
    }


    /*
        Most recent 5 events.

        Copy array before sorting so original
        API data is not modified.
    */

    const recentEvents =

        [...events]

        .sort(

            (a, b) =>

                Number(b.id) -
                Number(a.id)

        )

        .slice(
            0,
            5
        );


    table.innerHTML =

        recentEvents.map(

            event => `

                <tr>

                    <td>

                        ${escapeHtml(
                            event.event_name
                            || "-"
                        )}

                    </td>


                    <td>

                        ${formatDate(
                            event.start_date
                        )}

                    </td>


                    <td>

                        ${escapeHtml(
                            getEventVenue(
                                event
                            )
                        )}

                    </td>


                    <td>

                        ${escapeHtml(
                            event.status
                            || "-"
                        )}

                    </td>

                </tr>

            `

        ).join("");
}


/* ==========================================
        EVENT VENUE
========================================== */

function getEventVenue(event) {

    /*
        Different APIs may return venue in
        slightly different shapes.

        Support the common representations.
    */

    if (
        event.venue &&
        typeof event.venue === "string"
    ) {

        return event.venue;
    }


    if (
        event.venue &&
        typeof event.venue === "object"
    ) {

        return (
            event.venue.venue_name
            ||
            event.venue.name
            ||
            "-"
        );
    }


    if (event.venue_name) {

        return event.venue_name;
    }


    /*
        Don't display event_type as venue.

        Your previous dashboard.js did this:

            <td>${e.event_type}</td>

        which was incorrect.
    */

    return "-";
}


/* ==========================================
        ACTIVITY FEED
========================================== */

function renderActivity(
    analytics
) {

    const list =
        $("activityList");

    if (!list) {
        return;
    }


    /*
        If analytics backend eventually returns
        recent_activity, display it.
    */

    const activities =
        analytics?.recent_activity;


    if (
        !Array.isArray(activities)
        ||
        !activities.length
    ) {

        list.innerHTML = `

            <li>

                No recent activity.

            </li>

        `;

        return;
    }


    list.innerHTML =

        activities.map(

            activity => `

                <li>

                    ${escapeHtml(
                        activity.message
                        ||
                        activity.description
                        ||
                        String(activity)
                    )}

                </li>

            `

        ).join("");
}


/* ==========================================
        HTML ESCAPE
========================================== */

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;
}


/* ==========================================
        START DASHBOARD
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadDashboard();

    }

);