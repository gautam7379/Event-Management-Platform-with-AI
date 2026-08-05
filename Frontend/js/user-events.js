let events = [];
let venues = [];
let ticketMap = {};

let registrations = [];
let speakers = [];
let eventSpeakers = [];
let sponsors = [];
let vendors = [];
let sessions = [];

const $ = id => document.getElementById(id);

const fmt = d =>
    new Date(d + "T00:00:00")
        .toLocaleDateString("en-IN");

async function load() {

    events = await Api.events.list();

    venues = await Api.venues.list();

    registrations =
        await Api.registrations.mine()
        .catch(() => []);

    speakers =
        await Api.speakers.list()
        .catch(() => []);

    eventSpeakers =
        await Api.eventSpeakers.list()
        .catch(() => []);

    sponsors =
        await Api.sponsors.list()
        .catch(() => []);

    vendors =
        await Api.vendors.list()
        .catch(() => []);

    sessions =
        await Api.sessions.list()
        .catch(() => []);

    await Promise.all(

        events.map(async event => {

            ticketMap[event.id] =
                (await Api.tickets.event(event.id)
                    .catch(() => []))[0];

        })

    );

    render(events);

    if ($("availableEvents"))
        $("availableEvents").textContent =
            events.length;

    if ($("totalEvents"))
        $("totalEvents").textContent =
            events.length;

    if ($("upcomingEvents"))
        $("upcomingEvents").textContent =
            events.filter(
                event =>
                    new Date(event.start_date) >= new Date()
            ).length;

    if ($("completedEvents"))
        $("completedEvents").textContent =
            events.filter(
                event =>
                    event.status === "Completed"
            ).length;

    try {

        const regs =
            await Api.registrations.mine();

        if ($("myRegistrations"))
            $("myRegistrations").textContent =
                regs.length;

        if ($("myTickets"))
            $("myTickets").textContent =
                regs.length;

    }

    catch {

    }

}

function render(list) {

    const role =
        localStorage.getItem("userRole");

    $("eventTable").innerHTML =
        list.map(event => {

            const venue =
                venues.find(
                    v => v.id === event.venue_id
                );

            const ticket =
                ticketMap[event.id];

            const registered =
                registrations.find(r =>

                    r.event_id === event.id &&

                    r.status !== "Cancelled"

                );

            return `
<tr>

<td>${event.id}</td>

<td>
    <img src="${event.banner_image || 'https://via.placeholder.com/120x70'}"
         style="width:110px;height:65px;object-fit:cover;border-radius:8px;">
</td>

<td>${event.event_name}</td>

<td>${event.event_type}</td>

<td>${fmt(event.start_date)}</td>

<td>${venue ? venue.venue_name : "-"}</td>

<td>${ticket ? "₹" + ticket.price : "Free"}</td>

<td>${event.status}</td>

<td>
    <button onclick="viewEvent(${event.id})">
        View
    </button>
</td>

    <td>

        ${

        role !== "user"

        ?

        `<button disabled>

        User Only

        </button>`

        :

        registered

        ?

        `<button disabled>

        Already Registered

        </button>`

        :

        `<button

        class="primary-btn"

        onclick="registerEvent(${event.id})">

        Register

        </button>`

        }

    </td>

</tr>
`;

        }).join("");

    if ($("emptyMessage")) {

        $("emptyMessage").style.display =
            list.length
                ? "none"
                : "block";

    }

}

window.viewEvent = async function(id) {

    const event =
        events.find(e => e.id === id);

    if (!event) {
        alert("Event not found.");
        return;
    }

    const venue =
        venues.find(
            v => v.id === event.venue_id
        );

    const ticket =
        ticketMap[event.id];


    // ==========================================
    // FIND SPEAKERS ASSIGNED TO THIS EVENT
    // ==========================================

    const eventSpeakerList =
        eventSpeakers

            .filter(es =>
                Number(es.event_id) === Number(event.id)
            )

            .map(es =>
                speakers.find(
                    s =>
                        Number(s.id) ===
                        Number(es.speaker_id)
                )
            )

            .filter(Boolean);


    console.log(
        "Selected Event:",
        event
    );

    console.log(
        "Event Speaker Relations:",
        eventSpeakers.filter(
            es =>
                Number(es.event_id) ===
                Number(event.id)
        )
    );

    console.log(
        "Speakers:",
        eventSpeakerList
    );


    // ==========================================
    // EVENT DETAILS CONTAINER
    // ==========================================

    const detail =
        document.getElementById(
            "eventDetails"
        );

    if (!detail) {

        console.error(
            "eventDetails element not found."
        );

        return;
    }


    detail.style.display = "block";


    // ==========================================
    // RENDER EVENT + SPEAKER DETAILS
    // ==========================================

    detail.innerHTML = `

        <div class="event-detail-card">

            <h2>
                ${event.event_name}
            </h2>


            <img
                src="${
                    event.banner_image ||
                    "https://placehold.co/900x350"
                }"

                alt="${event.event_name}"

                style="
                    width:100%;
                    max-height:350px;
                    object-fit:cover;
                    border-radius:12px;
                    margin:15px 0 20px;
                "
            >


            <div class="event-info">

                <p>
                    <b>Category:</b>
                    ${event.event_type || "-"}
                </p>

                <p>
                    <b>Date:</b>
                    ${fmt(event.start_date)}
                </p>

                <p>
                    <b>Time:</b>
                    ${event.start_time || "-"}
                </p>

                <p>
                    <b>Venue:</b>
                    ${venue?.venue_name || "-"}
                </p>

                <p>
                    <b>Ticket Price:</b>

                    ${
                        ticket
                            ? Number(ticket.price) > 0
                                ? "₹" + ticket.price
                                : "Free"
                            : "Free"
                    }
                </p>

                <p>
                    <b>Status:</b>
                    ${event.status || "-"}
                </p>

            </div>


            <div style="margin-top:20px;">

                <h3>
                    Description
                </h3>

                <p>
                    ${
                        event.description ||
                        "No description available."
                    }
                </p>

            </div>


            <hr style="
                margin:30px 0;
                border:0;
                border-top:1px solid #e5e7eb;
            ">


            <!-- =========================
                    SPEAKERS
            ========================== -->

            <div class="event-speakers">

                <h3 style="margin-bottom:20px;">

                    <i class="fa-solid fa-microphone"></i>

                    Speakers

                </h3>


                ${
                    eventSpeakerList.length

                    ?

                    eventSpeakerList.map(
                        speaker => `

                        <div
                            class="speaker-card"

                            style="
                                padding:20px;
                                margin-bottom:15px;
                                border:1px solid #e5e7eb;
                                border-radius:12px;
                                background:#ffffff;
                            "
                        >

                            <h3 style="
                                margin:0 0 15px;
                            ">

                                <i class="fa-solid fa-user-tie"></i>

                                ${
                                    speaker.first_name ||
                                    ""
                                }

                                ${
                                    speaker.last_name ||
                                    ""
                                }

                            </h3>


                            <p>
                                <b>Experience:</b>

                                ${
                                    speaker.experience ||
                                    "Not provided"
                                }
                            </p>


                            <p>
                                <b>Expertise:</b>

                                ${
                                    speaker.expertise ||
                                    "Not provided"
                                }
                            </p>


                            <p>
                                <b>Organization:</b>

                                ${
                                    speaker.organization ||
                                    "Not provided"
                                }
                            </p>


                            <p>
                                <b>Short Bio:</b>

                                ${
                                    speaker.short_bio ||
                                    speaker.bio ||
                                    "Not provided"
                                }
                            </p>

                        </div>

                    `).join("")

                    :

                    `

                    <div
                        style="
                            padding:20px;
                            background:#f8fafc;
                            border-radius:10px;
                        "
                    >

                        <p style="margin:0;">

                            No speakers assigned to this event.

                        </p>

                    </div>

                    `
                }

            </div>

        </div>

    `;


    // ==========================================
    // SCROLL TO DETAILS
    // ==========================================

    detail.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

};

window.registerEvent = async function(id) {

    if (!requireLogin())
        return;

    try {

        const event =
            await Api.events.get(id);

        const tickets =
            await Api.tickets.event(id);

        if (tickets.length === 0) {

            alert(
                "No ticket available for this event."
            );

            return;

        }

        localStorage.setItem(

            "paymentEvent",

            JSON.stringify(event)

        );

        localStorage.setItem(

            "paymentTicket",

            JSON.stringify(tickets[0])

        );

        location.href =
            "payment.html";

    }

    catch (err) {

        alert(err.message);

    }

};

window.deleteEvent = async function(id) {

    if (!confirm("Delete event?"))
        return;

    await Api.events.remove(id);

    load();

};

$("searchEvent")?.addEventListener(

    "input",

    e => {

        const text =
            e.target.value.toLowerCase();

        render(

            events.filter(

                event =>

                    event.event_name
                        .toLowerCase()
                        .includes(text)

            )

        );

    }

);

document.addEventListener(

    "DOMContentLoaded",

    () => {

        load().catch(

            err => alert(err.message)

        );

    }

);