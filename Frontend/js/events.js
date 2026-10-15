// ==========================================
// ADMIN EVENT MANAGEMENT
// ==========================================

let events = [];
let venues = [];
let registrations = [];
let ticketMap = {};

const $ = id => document.getElementById(id);


// ==========================================
// DATE HELPERS
// ==========================================

function formatDate(date) {

    if (!date) return "-";

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString("en-IN");
}


function todayDate() {

    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );
}


    // ==========================================
    // GET EVENT STATUS FROM DATABASE
    // ==========================================

    function getEventStatus(event) {

        if (!event) {
            return "Draft";
        }

        return event.status || "Draft";
    }


// ==========================================
// LOAD ALL BACKEND DATA
// ==========================================

async function load() {

    try {

        // -------------------------------
        // Events
        // -------------------------------

        events =
            await Api.events.list();


        // -------------------------------
        // Venues
        // -------------------------------

        venues =
            await Api.venues.list();

        
        populateEditVenues();


        // -------------------------------
        // Registrations
        // -------------------------------

        try {

            registrations =
                await Api.registrations.list();

        } catch (error) {

            console.warn(
                "Could not load registrations:",
                error
            );

            registrations = [];
        }


        // -------------------------------
        // Tickets for every event
        // -------------------------------

        ticketMap = {};

        await Promise.all(

            events.map(async event => {

                try {

                    const eventTickets =
                        await Api.tickets.event(
                            event.id
                        );

                    ticketMap[event.id] =
                        eventTickets || [];

                } catch (error) {

                    console.warn(
                        `Tickets failed for event ${event.id}`,
                        error
                    );

                    ticketMap[event.id] = [];
                }

            })

        );


        console.log(
            "EVENTS:",
            events
        );

        console.log(
            "VENUES:",
            venues
        );

        console.log(
            "REGISTRATIONS:",
            registrations
        );

        console.log(
            "TICKETS:",
            ticketMap
        );


        updateStatistics();

        applyFilters();

    } catch (error) {

        console.error(
            "Event loading failed:",
            error
        );

        alert(
            error.message ||
            "Failed to load events."
        );
    }
}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        events.length;

    
    const today =
        todayDate();

    const upcoming =
        events.filter(event => {

            if (!event.start_date) {
                return false;
            }

            const eventDate =
                new Date(
                    event.start_date +
                    "T00:00:00"
                );

            const status =
                String(
                    event.status || ""
                ).toLowerCase();

            return (
                eventDate >= today
                &&
                status !== "completed"
                &&
                status !== "cancelled"
            );
        }).length;


    const completed =
        events.filter(event =>
            getEventStatus(event) === "Completed"
        ).length;


    // Don't count cancelled registrations
    const totalRegistrations =
        registrations.filter(registration =>

            String(registration.status)
                .toLowerCase() !== "cancelled"

        ).length;


    if ($("totalEvents")) {

        $("totalEvents").textContent =
            total;
    }


    if ($("upcomingEvents")) {

        $("upcomingEvents").textContent =
            upcoming;
    }


    if ($("completedEvents")) {

        $("completedEvents").textContent =
            completed;
    }


    if ($("totalRegistrations")) {

        $("totalRegistrations").textContent =
            totalRegistrations;
    }
}


// ==========================================
// REGISTRATION COUNT FOR EVENT
// ==========================================

function getRegistrationCount(eventId) {

    return registrations.filter(registration =>

        Number(registration.event_id)
            === Number(eventId)

        &&

        String(registration.status)
            .toLowerCase() !== "cancelled"

    ).length;
}


// ==========================================
// GET VENUE
// ==========================================

function getVenue(event) {

    return venues.find(
        venue =>
            Number(venue.id) ===
            Number(event.venue_id)
    );
}


// ==========================================
// GET EVENT TICKET
// ==========================================

function getTicket(eventId) {

    const eventTickets =
        ticketMap[eventId] || [];

    return eventTickets[0] || null;
}


// ==========================================
// SAFE HTML
// ==========================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==========================================
// RENDER TABLE
// ==========================================

function render(list) {

    const table =
        $("eventTable");

    const emptyMessage =
        $("emptyMessage");


    if (!table) return;


    if (!list.length) {

        table.innerHTML = "";

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";
        }

        return;
    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";
    }


    table.innerHTML =
        list.map(event => {

            const venue =
                getVenue(event);

            const ticket =
                getTicket(event.id);

            const registered =
                getRegistrationCount(
                    event.id
                );

            const status =
                getEventStatus(event);


            // --------------------------
            // Banner
            // --------------------------

            let bannerHtml;

            if (event.banner_image) {

                bannerHtml = `

                    <img
                        src="${escapeHtml(event.banner_image)}"
                        alt="${escapeHtml(event.event_name)}"
                        style="
                            width:70px;
                            height:45px;
                            object-fit:cover;
                            border-radius:6px;
                        "
                        onerror="
                            this.style.display='none';
                            this.nextElementSibling.style.display='inline-block';
                        "
                    >

                    <span style="display:none;">
                        No Image
                    </span>
                `;

            } else {

                bannerHtml = `
                    <span>No Image</span>
                `;
            }


            // --------------------------
            // Price
            // --------------------------

            let price = "-";

            if (ticket) {

                const numericPrice =
                    Number(ticket.price || 0);

                price =
                    numericPrice === 0
                        ? "Free"
                        : `₹${numericPrice}`;
            }


            // --------------------------
            // Venue
            // --------------------------

            const venueName =
                venue
                    ? venue.venue_name
                    : `Venue #${event.venue_id}`;


            return `

                <tr>

                    <td>
                        ${event.id}
                    </td>


                    <td>
                        ${bannerHtml}
                    </td>


                    <td>
                        ${escapeHtml(
                            event.event_name
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            event.event_type ||
                            "General"
                        )}
                    </td>


                    <td>

                        ${formatDate(
                            event.start_date
                        )}

                    </td>


                    <td>
                        ${escapeHtml(
                            venueName
                        )}
                    </td>


                    <td>
                        ${price}
                    </td>


                    <td>

                        <strong>
                            ${registered}
                        </strong>

                        /

                        ${event.capacity ?? "-"}

                    </td>


                    <td>

                        <span
                            class="badge ${status.toLowerCase()}">

                            ${status}

                        </span>

                    </td>


                    <td>

                        <button
                            type="button"
                            onclick="viewEvent(${event.id})">

                            View

                        </button>


                        <button
                            type="button"
                            onclick="editEvent(${event.id})">

                            Edit

                        </button>


                        <button
                            type="button"
                            onclick="deleteEvent(${event.id})">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        }).join("");
}


// ==========================================
// VIEW EVENT
// ==========================================

window.viewEvent =
function (id) {

    const event =
        events.find(
            event =>
                Number(event.id) ===
                Number(id)
        );


    if (!event) {

        alert("Event not found.");

        return;
    }


    const venue =
        getVenue(event);

    const ticket =
        getTicket(event.id);

    const registered =
        getRegistrationCount(
            event.id
        );

    const status =
        getEventStatus(event);


    const content =
        $("viewContent");


    content.innerHTML = `

        <div class="event-view-details">

            ${
                event.banner_image
                ? `
                    <img
                        src="${escapeHtml(event.banner_image)}"
                        alt="${escapeHtml(event.event_name)}"
                        style="
                            width:100%;
                            max-height:300px;
                            object-fit:cover;
                            border-radius:10px;
                            margin-bottom:20px;
                        "
                    >
                `
                : ""
            }


            <h2>
                ${escapeHtml(event.event_name)}
            </h2>


            <p>
                <strong>Category:</strong>
                ${escapeHtml(
                    event.event_type ||
                    "General"
                )}
            </p>


            <p>
                <strong>Status:</strong>
                ${status}
            </p>


            <p>
                <strong>Start Date:</strong>
                ${formatDate(event.start_date)}
            </p>


            <p>
                <strong>Start Time:</strong>
                ${event.start_time || "-"}
            </p>


            <p>
                <strong>End Date:</strong>
                ${formatDate(event.end_date)}
            </p>


            <p>
                <strong>End Time:</strong>
                ${event.end_time || "-"}
            </p>


            <p>
                <strong>Venue:</strong>
                ${
                    venue
                    ? escapeHtml(venue.venue_name)
                    : "-"
                }
            </p>


            <p>
                <strong>City:</strong>
                ${
                    venue
                    ? escapeHtml(venue.city)
                    : "-"
                }
            </p>


            <p>
                <strong>Price:</strong>

                ${
                    ticket
                    ? Number(ticket.price) === 0
                        ? "Free"
                        : `₹${ticket.price}`
                    : "-"
                }

            </p>


            <p>
                <strong>Capacity:</strong>
                ${event.capacity ?? "-"}
            </p>


            <p>
                <strong>Registered:</strong>
                ${registered}
            </p>


            <p>
                <strong>Available Seats:</strong>

                ${
                    event.capacity != null
                    ? Math.max(
                        0,
                        Number(event.capacity) -
                        registered
                    )
                    : "-"
                }

            </p>


            <p>
                <strong>Description:</strong>
            </p>

            <p>
                ${
                    escapeHtml(
                        event.description ||
                        "No description available."
                    )
                }
            </p>

        </div>
    `;


    $("viewModal").style.display =
        "block";
};


// ==========================================
// EDIT EVENT
// ==========================================

window.editEvent =
function (id) {

    const event =
        events.find(
            event =>
                Number(event.id) ===
                Number(id)
        );

    if (!event) {

        alert(
            "Event not found."
        );

        return;
    }

    const ticket =
        getTicket(
            event.id
        );

    $("editId").value =
        event.id;

    $("editName").value =
        event.event_name || "";

    $("editCategory").value =
        event.event_type || "";

    $("editDate").value =
        event.start_date || "";

    $("editEndDate").value =
        event.end_date || "";

    $("editTime").value =
        event.start_time
            ? event.start_time.slice(
                0,
                5
            )
            : "";

    $("editEndTime").value =
        event.end_time
            ? event.end_time.slice(
                0,
                5
            )
            : "";

    $("editVenue").value =
        String(
            event.venue_id || ""
        );

    $("editPrice").value =
        ticket?.price ?? 0;

    $("editCapacity").value =
        event.capacity ?? 0;

    $("editStatus").value =
        event.status || "Draft";

    $("editDescription").value =
        event.description || "";

    $("editAgenda").value =
        event.agenda || "";

    $("editModal").style.display =
        "block";

    $("editBannerImage").value =
        event.banner_image || "";

    const bannerPreview =
        $("editBannerPreview");

    const bannerContainer =
        $("editBannerPreviewContainer");

    if (event.banner_image) {

        bannerPreview.src =
            event.banner_image;

        bannerContainer.style.display =
            "block";

    } else {

        bannerPreview.src = "";

        bannerContainer.style.display =
            "none";
    }
};


// ==========================================
// SAVE EDITED EVENT
// ==========================================

$("editForm")
?.addEventListener(
    "submit",
    async function (eventObject) {

        eventObject.preventDefault();


        const id =
            Number(
                $("editId").value
            );


        const originalEvent =
            events.find(
                event =>
                    Number(event.id) === id
            );


        if (!originalEvent) {

            alert("Event not found.");

            return;
        }


        try {

            const payload = {

                organizer_id:
                    originalEvent.organizer_id,

                venue_id:
                    Number(
                        $("editVenue").value
                    ),

                event_name:
                    $("editName")
                        .value
                        .trim(),

                event_type:
                    $("editCategory")
                        .value
                        .trim(),

                description:
                    $("editDescription")
                        .value
                        .trim()
                    || null,

                agenda:
                    $("editAgenda")
                        .value
                        .trim()
                    || null,

                start_date:
                    $("editDate").value,

                end_date:
                    $("editEndDate").value,

                start_time:
                    $("editTime").value,

                end_time:
                    $("editEndTime").value,

                capacity:
                    Number(
                        $("editCapacity").value
                    ),

                banner_image:
                    $("editBannerImage")
                        .value
                        .trim()
                    || null,

                status:
                    $("editStatus").value
            };


            console.log(
                "Updating event:",
                payload
            );


            await Api.events.update(
                id,
                payload
            );


            $("editModal").style.display =
                "none";


            alert(
                "Event updated successfully."
            );


            await load();

        } catch (error) {

            console.error(
                "Update event error:",
                error
            );

            alert(
                error.message ||
                "Failed to update event."
            );
        }
    }
);


// ==========================================
// DELETE EVENT
// ==========================================

window.deleteEvent =
async function (id) {

    const event =
        events.find(
            event =>
                Number(event.id) ===
                Number(id)
        );


    if (!event) {

        return;
    }


    const confirmed =
        confirm(
            `Delete "${event.event_name}"?`
        );


    if (!confirmed) {

        return;
    }


    try {

        await Api.events.remove(id);

        alert(
            "Event deleted successfully."
        );

        await load();

    } catch (error) {

        console.error(
            "Delete event error:",
            error
        );

        alert(
            error.message ||
            "Failed to delete event."
        );
    }
};


// ==========================================
// SEARCH + STATUS FILTER
// ==========================================

function applyFilters() {

    const search =
        $("searchEvent")
            ?.value
            .trim()
            .toLowerCase()
        || "";


    const selectedStatus =
        $("statusFilter")
            ?.value
        || "All";


    const filtered =
        events.filter(event => {

            const venue =
                getVenue(event);


            const matchesSearch =

                !search ||

                event.event_name
                    ?.toLowerCase()
                    .includes(search)

                ||

                event.event_type
                    ?.toLowerCase()
                    .includes(search)

                ||

                venue?.venue_name
                    ?.toLowerCase()
                    .includes(search);


            const calculatedStatus =
                getEventStatus(event);


            const matchesStatus =

                selectedStatus === "All"

                ||

                calculatedStatus ===
                selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );
        });


    render(filtered);
}


// ==========================================
// SEARCH EVENT
// ==========================================

$("searchEvent")
?.addEventListener(
    "input",
    applyFilters
);


// ==========================================
// STATUS FILTER
// ==========================================

$("statusFilter")
?.addEventListener(
    "change",
    applyFilters
);


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        load().catch(error => {

            console.error(error);

            alert(
                error.message ||
                "Failed to load event data."
            );
        });
    }
);


function populateEditVenues() {

    const select =
        $("editVenue");

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            Select Venue
        </option>
    `;

    venues.forEach(venue => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            venue.id;

        option.textContent =
            venue.venue_name;

        select.appendChild(
            option
        );
    });
}