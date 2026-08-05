let registrations = [];
let events = [];
let tickets = [];
let venues = [];

const $ = id => document.getElementById(id);


// ======================================================
// DATE FORMATTER
// ======================================================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

    if (!requireLogin()) return;

    const loggedUserName = $("loggedUserName");

    if (loggedUserName) {

        loggedUserName.textContent =
            localStorage.getItem("userName") || "User";

    }

    try {

        await loadTickets();

    } catch (err) {

        console.error("Ticket loading error:", err);

        alert(err.message);

    }

});


// ======================================================
// LOAD TICKETS
// ======================================================

async function loadTickets() {

    // ------------------------------------------
    // Get logged-in user's registrations
    // ------------------------------------------

    registrations =
        await Api.registrations.mine();


    // ------------------------------------------
    // Get all events
    // ------------------------------------------

    events =
        await Api.events.list();

    venues =
        await Api.venues.list();


    // ------------------------------------------
    // Get tickets for all events
    // ------------------------------------------

    tickets = [];

    await Promise.all(

        events.map(async event => {

            const eventTickets =
                await Api.tickets
                    .event(event.id)
                    .catch(() => []);

            tickets.push(...eventTickets);

        })

    );


    console.log(
        "Registrations:",
        registrations
    );

    console.log(
        "Events:",
        events
    );

    console.log(
        "Tickets:",
        tickets
    );


    renderStatistics();

    renderTickets(
        
    );

}


// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function renderStatistics() {

    // ------------------------------------------
    // Ignore cancelled registrations
    // ------------------------------------------

    const activeRegistrations =
        registrations.filter(registration =>

            String(registration.status)
                .toLowerCase() !== "cancelled"

        );


    // ------------------------------------------
    // TOTAL TICKETS
    // ------------------------------------------

    if ($("myTicketCount")) {

        $("myTicketCount").textContent =
            activeRegistrations.length;

    }


    // ------------------------------------------
    // CONFIRMED TICKETS
    // ------------------------------------------

    const confirmedRegistrations =
        activeRegistrations.filter(registration =>

            String(registration.status)
                .toLowerCase() === "confirmed"

        );


    if ($("confirmedCount")) {

        $("confirmedCount").textContent =
            confirmedRegistrations.length;

    }


    // ------------------------------------------
    // UPCOMING REGISTERED EVENTS
    // ------------------------------------------

    const now = new Date();


    const upcomingRegistrations =
        activeRegistrations.filter(registration => {

            const event =
                events.find(
                    e =>
                        Number(e.id) ===
                        Number(registration.event_id)
                );
                


            if (!event || !event.start_date) {

                return false;

            }


            /*
             * Use end of event date so an event happening
             * today is still considered upcoming/current.
             */

            const eventDate =
                new Date(
                    `${event.start_date}T23:59:59`
                );


            return eventDate >= now;

        });


    if ($("upcomingCount")) {

        $("upcomingCount").textContent =
            upcomingRegistrations.length;

    }


    // ------------------------------------------
    // LATEST TICKET
    // ------------------------------------------

    if ($("lastTicket")) {

        if (activeRegistrations.length === 0) {

            $("lastTicket").textContent = "-";

        } else {

            const latest =
                [...activeRegistrations]
                    .sort((a, b) => {

                        const dateA =
                            new Date(
                                a.registration_date || 0
                            );

                        const dateB =
                            new Date(
                                b.registration_date || 0
                            );

                        return dateB - dateA;

                    })[0];


            /*
             * Currently registration ID is being used
             * as the displayed ticket number because
             * your registration object is what this
             * page is based on.
             */

            $("lastTicket").textContent =
                latest.registration_number ||
                `#${latest.id}`;

        }

    }

}


// ======================================================
// RENDER TICKET TABLE
// ======================================================

function renderTickets() {

    const table =
        $("ticketTable");

    if (!table) return;


    // ------------------------------------------
    // Empty state
    // ------------------------------------------

    if (registrations.length === 0) {

        table.innerHTML = "";

        if ($("emptyMessage")) {

            $("emptyMessage").style.display =
                "block";

        }

        return;

    }


    if ($("emptyMessage")) {

        $("emptyMessage").style.display =
            "none";

    }


    // ------------------------------------------
    // Generate rows
    // ------------------------------------------

    table.innerHTML =
        registrations.map(registration => {

            const event =
                events.find(
                    e =>
                        Number(e.id) ===
                        Number(registration.event_id)
                );

            const venue =
                venues.find(
                    v =>
                        Number(v.id) ===
                        Number(event?.venue_id)
                );
            
            const ticket =
                tickets.find(
                    t =>
                        Number(t.id) ===
                        Number(registration.ticket_id)
                )
                ||
                tickets.find(
                    t =>
                        Number(t.event_id) ===
                        Number(registration.event_id)
                );


            // ----------------------------------
            // Determine status
            // ----------------------------------

            const status =
                registration.status || "Pending";


            const isCancelled =
                status.toLowerCase() ===
                "cancelled";


            // ----------------------------------
            // Ticket Number
            // ----------------------------------

            const ticketNumber =
                registration.registration_number ||
                registration.id;


            return `

<tr>

    <td>
        ${ticketNumber}
    </td>


    <td>
        ${event?.event_name || "-"}
    </td>


    <td>
        ${event?.start_date
            ? formatDate(event.start_date)
            : "-"
        }
    </td>


    <td>
        ${venue?.venue_name || "-"}
    </td>


    <td>

        <span class="badge">

            ${status}

        </span>

    </td>


    <td>

        <button
            type="button"
            onclick="viewTicket(${registration.id})">

            View

        </button>


        <button
            type="button"
            onclick="downloadTicket(${registration.id})">

            Download

        </button>


        ${
            isCancelled

            ?

            `
            <button
                type="button"
                disabled>

                Cancelled

            </button>
            `

            :

            `
            <button
                type="button"
                onclick="cancelRegistration(${registration.id})">

                Cancel

            </button>
            `
        }

    </td>

</tr>

`;

        }).join("");

}


// ======================================================
// VIEW TICKET
// ======================================================

window.viewTicket = function(id) {

    window.location.href =
        `ticket-view.html?id=${id}`;

};


// ======================================================
// DOWNLOAD TICKET
// ======================================================

window.downloadTicket = function(id) {

    window.location.href =
        `ticket-view.html?id=${id}&download=1`;

};


// ======================================================
// CANCEL REGISTRATION
// ======================================================

window.cancelRegistration =
async function(id) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this ticket?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await Api.registrations.cancel(id);


        alert(
            "Registration cancelled successfully."
        );


        // Reload everything after cancellation

        await loadTickets();


    } catch (err) {

        console.error(
            "Cancellation error:",
            err
        );


        alert(
            err.message ||
            "Unable to cancel registration."
        );

    }

};