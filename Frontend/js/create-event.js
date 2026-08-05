function toast(message) {
    const t = document.getElementById("toast");

    if (t) {
        t.textContent = message;
        t.classList.add("show");

        setTimeout(() => {
            t.classList.remove("show");
        }, 2500);
    } else {
        alert(message);
    }
}


// ===============================
// INITIALIZE PAGE
// ===============================

async function init() {
    if (!requireLogin()) return;

    // Do NOT load venues and do NOT replace
    // venue input with a dropdown.

    const adminName = document.querySelector(".admin span");

    if (adminName) {
        adminName.textContent =
            localStorage.getItem("userName") || "Organizer";
    }
}


// ===============================
// CREATE EVENT
// ===============================

document
    .getElementById("createForm")
    ?.addEventListener("submit", async (e) => {

        e.preventDefault();

        try {

            // --------------------------------
            // Read form data
            // --------------------------------

            const eventName =
                document.getElementById("name").value.trim();

            const date =
                document.getElementById("date").value;

            const venueName =
                document.getElementById("venue").value.trim();

            const category =
                document.getElementById("category").value.trim()
                || "General";

            const time =
                document.getElementById("time").value
                || "10:00";

            // --------------------------------
            // Automatically calculate end
            // date/time (2 hours after start)
            // --------------------------------

            // ============================================
            // CALCULATE EVENT END DATE/TIME
            // Default duration = 2 hours
            // ============================================

            const startDateTime =
                new Date(`${date}T${time}:00`);

            if (isNaN(startDateTime.getTime())) {

                toast("Invalid event date or time.");
                return;
            }

            const endDateTime =
                new Date(
                    startDateTime.getTime() +
                    (2 * 60 * 60 * 1000)
                );


            // --------------------------------------------
            // Format LOCAL date as YYYY-MM-DD
            // Do NOT use toISOString() here
            // --------------------------------------------

            function formatLocalDate(dateObject) {

                const year =
                    dateObject.getFullYear();

                const month =
                    String(
                        dateObject.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        dateObject.getDate()
                    ).padStart(2, "0");

                return `${year}-${month}-${day}`;
            }


            // --------------------------------------------
            // Format LOCAL time as HH:MM
            // --------------------------------------------

            function formatLocalTime(dateObject) {

                const hours =
                    String(
                        dateObject.getHours()
                    ).padStart(2, "0");

                const minutes =
                    String(
                        dateObject.getMinutes()
                    ).padStart(2, "0");

                return `${hours}:${minutes}`;
            }


            const endDate =
                formatLocalDate(endDateTime);

            const endTime =
                formatLocalTime(endDateTime);


            console.log(
                "Start:",
                date,
                time
            );

            console.log(
                "End:",
                endDate,
                endTime
            );

            const capacity =
                Number(
                    document.getElementById("capacity").value || 100
                );

            const description =
                document.getElementById("description").value.trim()
                || null;

            const banner =
                document.getElementById("banner").value.trim()
                || null;

            const price =
                Number(
                    document.getElementById("price").value || 0
                );


            // --------------------------------
            // Basic validation
            // --------------------------------

            if (!eventName) {
                toast("Event name is required");
                return;
            }

            if (!date) {
                toast("Event date is required");
                return;
            }

            if (!venueName) {
                toast("Venue is required");
                return;
            }


            // =====================================================
            // STEP 1: CREATE VENUE IN POSTGRESQL THROUGH BACKEND API
            // =====================================================

            const venuePayload = {

                    venue_name:
                        document
                            .getElementById("venue")
                            .value
                            .trim(),

                    address:
                        document
                            .getElementById("venueAddress")
                            .value
                            .trim(),

                    city:
                        document
                            .getElementById("venueCity")
                            .value
                            .trim(),

                    state:
                        document
                            .getElementById("venueState")
                            .value
                            .trim(),

                    country:
                        document
                            .getElementById("venueCountry")
                            .value
                            .trim(),

                    postal_code:
                        document
                            .getElementById("venuePostalCode")
                            .value
                            .trim(),

                    capacity:
                        Number(
                            document.getElementById("capacity").value || 100
                        ),

                    contact_person:
                        document
                            .getElementById("venueContactPerson")
                            .value
                            .trim(),

                    phone:
                        document
                            .getElementById("venuePhone")
                            .value
                            .trim()
                };

            console.log(
                "Creating venue:",
                venuePayload
            );

            const venue =
                await Api.venues.create(venuePayload);


            if (!venue || !venue.id) {
                throw new Error(
                    "Venue could not be created"
                );
            }


            console.log(
                "Venue created:",
                venue
            );


            // =====================================================
            // STEP 2: CREATE EVENT USING DATABASE venue_id
            // =====================================================

            const eventPayload = {

                organizer_id:
                    Number(
                        localStorage.getItem("userId")
                    ),

                venue_id:
                    Number(venue.id),

                event_name:
                    eventName,

                event_type:
                    category,

                description:
                    description,

                agenda:
                    null,

                start_date:
                    date,

                end_date:
                    date,

                start_time:
                    time,

                end_time:
                    endTime,

                capacity:
                    capacity,

                banner_image:
                    banner,

                status:
                    "Draft"
            };


            console.log("Creating event payload:");
            console.log(JSON.stringify(eventPayload, null, 2));

            console.log("START DATE:", eventPayload.start_date);
            console.log("END DATE:", eventPayload.end_date);
            console.log("START TIME:", eventPayload.start_time);
            console.log("END TIME:", eventPayload.end_time);

            
            const event =
                await Api.events.create(eventPayload);


            if (!event || !event.id) {
                throw new Error(
                    "Event could not be created"
                );
            }


            console.log(
                "Event created:",
                event
            );


            // =====================================================
            // STEP 3: CREATE TICKET
            // =====================================================

            const ticketPayload = {

                event_id:
                    event.id,

                ticket_category:
                    "General",

                price:
                    price,

                quantity:
                    capacity,

                qr_enabled:
                    true,

                sale_start_date:
                    new Date()
                        .toISOString()
                        .slice(0, 10),

                sale_end_date:
                    date,

                status:
                    "Active"
            };


            console.log(
                "Creating ticket:",
                ticketPayload
            );


            try {

                await Api.tickets.create(
                    ticketPayload
                );

            } catch (ticketError) {

                console.warn(
                    "Event created but ticket creation failed:",
                    ticketError
                );
            }


            // =====================================================
            // SUCCESS
            // =====================================================

            toast(
                "Event and venue created successfully"
            );


            setTimeout(() => {

                location.href =
                    "events.html";

            }, 700);


        } catch (error) {

            console.error(
                "Create Event Error:",
                error
            );

            toast(
                error.message ||
                "Failed to create event"
            );
        }
    });


// ===============================
// START
// ===============================

init().catch((error) => {

    console.error(error);

    toast(error.message);

});