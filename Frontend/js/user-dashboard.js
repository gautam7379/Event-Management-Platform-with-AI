const $ = id => document.getElementById(id);

let events = [];
let registrations = [];
let tickets = [];
let venues = [];

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard().catch(err => {
        console.error(err);
        alert(err.message);
    });
});

async function loadDashboard() {

    if (!requireLogin()) return;

    const username =
        localStorage.getItem("userName") || "User";

    if ($("loggedUserName"))
        $("loggedUserName").textContent = username;

    if ($("topUserName"))
        $("topUserName").textContent = username;

    //----------------------------------------------------
    // Load Backend Data
    //----------------------------------------------------

    events = await Api.events.list();

    registrations = await Api.registrations.mine();

    venues = await Api.venues.list();

    tickets = [];

    for (const event of events) {

        const list =
            await Api.tickets
                .event(event.id)
                .catch(() => []);

        tickets.push(...list);

    }

    //----------------------------------------------------
    // Dashboard Cards
    //----------------------------------------------------

    $("availableEvents").textContent = events.length;

    $("myRegistrations").textContent =
        registrations.length;

    $("myTickets").textContent =
        registrations.length;

    const today = new Date();

    today.setHours(0,0,0,0);

    const upcoming =
        events.filter(e => {

            const d =
                new Date(e.start_date);

            d.setHours(0,0,0,0);

            return d >= today;

        });

    $("upcomingEvents").textContent =
        upcoming.length;

    //----------------------------------------------------

    renderRegisteredEvents();

    renderRecentTickets();

    renderUpcomingEvents();

}

/*=====================================================
REGISTERED EVENTS
=====================================================*/

function renderRegisteredEvents() {

    const tbody =
        $("myEventsTable");

    tbody.innerHTML = "";

    if(registrations.length===0){

        tbody.innerHTML=`

<tr>

<td colspan="7">

No registrations found.

</td>

</tr>

`;

        return;

    }

    registrations.forEach(reg => {

        const event =
            events.find(
                e => e.id === reg.event_id
            );

        if(!event) return;

        const venue =
            venues.find(
                v => v.id === event.venue_id
            );

        const ticket =
            tickets.find(
                t => t.event_id === event.id
            );

        tbody.innerHTML += `

<tr>

<td>${event.event_name}</td>

<td>${formatDate(event.start_date)}</td>

<td>${venue?.venue_name || "-"}</td>

<td>${ticket?.ticket_category || "General"}</td>

<td>₹${ticket?.price || 0}</td>

<td>

<span class="badge">

${reg.status}

</span>

</td>

<td>

<a class="primary-btn"

href="ticket-view.html?id=${reg.id}">

View

</a>

</td>

</tr>

`;

    });

}

/*=====================================================
RECENT TICKETS
=====================================================*/

function renderRecentTickets(){

    const tbody =
        $("myTicketsTable");

    tbody.innerHTML="";

    if(registrations.length===0){

        tbody.innerHTML=`

<tr>

<td colspan="6">

No tickets found.

</td>

</tr>

`;

        return;

    }

    registrations
    .slice()
    .reverse()
    .slice(0,5)
    .forEach(reg=>{

        const event =
            events.find(
                e=>e.id===reg.event_id
            );

        const ticket =
            tickets.find(
                t=>t.event_id===reg.event_id
            );

        tbody.innerHTML+=`

<tr>

<td>

${reg.registration_number || reg.id}

</td>

<td>

${event?.event_name || "-"}

</td>

<td>

${ticket?.ticket_category || "General"}

</td>

<td>

₹${ticket?.price || 0}

</td>

<td>

${reg.status}

</td>

<td>

<a class="primary-btn"

href="ticket-view.html?id=${reg.id}">

View

</a>

</td>

</tr>

`;

    });

}

/*=====================================================
UPCOMING EVENTS
=====================================================*/

function renderUpcomingEvents(){

    const container =
        $("upcomingEventsList");

    container.innerHTML="";

    const today =
        new Date();

    today.setHours(0,0,0,0);

    const upcoming =
        events.filter(e=>{

            const d =
                new Date(e.start_date);

            d.setHours(0,0,0,0);

            return d>=today;

        });

    if(upcoming.length===0){

        container.innerHTML=`

<p>

No upcoming events.

</p>

`;

        return;

    }

    upcoming.forEach(event=>{

        const venue =
            venues.find(
                v=>v.id===event.venue_id
            );

        const ticket =
            tickets.find(
                t=>t.event_id===event.id
            );

        container.innerHTML+=`

<div class="card">

<i class="fa-solid fa-calendar-days"></i>

<h3>

${event.event_name}

</h3>

<p>

<b>Date :</b>

${formatDate(event.start_date)}

</p>

<p>

<b>Venue :</b>

${venue?.venue_name || "-"}

</p>

<p>

<b>Category :</b>

${ticket?.ticket_category || "General"}

</p>

<p>

<b>Price :</b>

₹${ticket?.price || 0}

</p>

<a

href="user-events.html"

class="primary-btn">

View Event

</a>

</div>

`;

    });

}

/*=====================================================
DATE FORMAT
=====================================================*/

function formatDate(date){

    return new Date(date).toLocaleDateString(

        "en-IN",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );

}