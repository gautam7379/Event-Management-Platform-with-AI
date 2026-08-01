/* ==========================================
            EVENTAI EVENTS
========================================== */


/* ==========================================
            LOCAL STORAGE
========================================== */


function getEvents(){

    return JSON.parse(
        localStorage.getItem("events")
    ) || [];

}



function saveEvents(events){

    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );

}




function getAttendees(){

    return JSON.parse(
        localStorage.getItem("attendees")
    ) || [];

}




function getTickets(){

    return JSON.parse(
        localStorage.getItem("tickets")
    ) || [];

}



/* ==========================================
            GLOBAL EVENTS
========================================== */


let events = getEvents();




/* ==========================================
            ELEMENTS
========================================== */


const tableBody =
document.getElementById("eventTable");


const emptyMessage =
document.getElementById("emptyMessage");


const searchBox =
document.getElementById("searchEvent");


const statusFilter =
document.getElementById("statusFilter");
/* ==========================================
            FORMAT DATE
========================================== */


function formatDate(date){

    if(!date)
        return "—";


    return new Date(date)

        .toLocaleDateString(

            "en-IN",

            {

                day:"2-digit",

                month:"short",

                year:"numeric"

            }

        );

}




/* ==========================================
            RENDER EVENTS
========================================== */


function renderEvents(eventList = events){


    if(!tableBody)
        return;



    tableBody.innerHTML = "";



    /* ---------- EMPTY STATE ---------- */


    if(eventList.length === 0){


        if(emptyMessage){

            emptyMessage.style.display="block";

        }


        return;

    }



    if(emptyMessage){

        emptyMessage.style.display="none";

    }




    /* ---------- TABLE ROWS ---------- */


    eventList.forEach(event => {



        let badgeClass = "upcoming";


        if(event.status === "Completed"){

            badgeClass="completed";

        }


        else if(event.status === "Open"){

            badgeClass="pending";

        }





        const row = `


<tr>


<td>

#${event.id}

</td>



<td>


<img

src="${event.banner || ''}"

alt="${event.name}"

class="event-banner"

width="80"

height="50"

style="border-radius:8px;object-fit:cover;"

>


</td>





<td>


<strong>

${event.name}

</strong>


</td>





<td>

${event.category || "General"}

</td>





<td>


${formatDate(event.date)}

<br>

<small>

${event.time || ""}

</small>


</td>





<td>

${event.venue}

</td>





<td>


${event.price > 0

? "₹"+event.price

: "Free"

}


</td>





<td>


${event.registered || 0}

/

${event.capacity || 0}


</td>





<td>


<span class="badge ${badgeClass}">


${event.status}


</span>


</td>





<td>



<button

class="action-btn view"

onclick="viewEvent(${event.id})">


<i class="fa-solid fa-eye"></i>


</button>





<button

class="action-btn edit"

onclick="editEvent(${event.id})">


<i class="fa-solid fa-pen"></i>


</button>





<button

class="action-btn delete"

onclick="deleteEvent(${event.id})">


<i class="fa-solid fa-trash"></i>


</button>



</td>





<td>


<button

class="primary-btn"

onclick="registerEvent(${event.id})">


Register


</button>


</td>



</tr>


`;



        tableBody.innerHTML += row;



    });



}
/* ==========================================
            LOAD STATISTICS
========================================== */


function loadStatistics(){


    const events = getEvents();


    const attendees = getAttendees();


    const tickets = getTickets();





    /* ==============================
            TOTAL EVENTS
    ============================== */


    const totalEvents =
        document.getElementById("totalEvents");


    if(totalEvents){

        totalEvents.textContent =
            events.length;

    }





    /* ==============================
            TOTAL ATTENDEES
    ============================== */


    const totalAttendees =
        document.getElementById("totalAttendees");


    if(totalAttendees){

        totalAttendees.textContent =
            attendees.length;

    }





    /* ==============================
            TOTAL TICKETS
    ============================== */


    const totalTickets =
        document.getElementById("totalTickets");


    if(totalTickets){

        totalTickets.textContent =
            tickets.length;

    }





    /* ==============================
            TOTAL REVENUE
    ============================== */


    let revenue = 0;


    tickets.forEach(ticket=>{


        revenue += Number(
            ticket.price || 0
        );


    });



    const totalRevenue =
        document.getElementById("totalRevenue");



    if(totalRevenue){

        totalRevenue.textContent =
            "₹" +
            revenue.toLocaleString("en-IN");

    }







    /* ==============================
            UPCOMING EVENTS
    ============================== */


    const upcoming =

        events.filter(event =>

            event.status === "Upcoming"

        ).length;



    const upcomingEvents =
        document.getElementById("upcomingEvents");



    if(upcomingEvents){

        upcomingEvents.textContent =
            upcoming;

    }








    /* ==============================
            COMPLETED EVENTS
    ============================== */


    const completed =

        events.filter(event =>

            event.status === "Completed"

        ).length;



    const completedEvents =
        document.getElementById("completedEvents");



    if(completedEvents){

        completedEvents.textContent =
            completed;

    }








    /* ==============================
            CHECKED IN
    ============================== */


    const checkedIn =

        attendees.filter(attendee =>

            attendee.status === "Checked In"

        ).length;



    const checkedInCount =
        document.getElementById("checkedInCount");



    if(checkedInCount){

        checkedInCount.textContent =
            checkedIn;

    }








    /* ==============================
            REGISTRATION RATE
    ============================== */


    let totalCapacity = 0;


    let totalRegistered = 0;



    events.forEach(event=>{


        totalCapacity += Number(
            event.capacity || 0
        );



        totalRegistered += Number(
            event.registered || 0
        );


    });





    let rate = 0;



    if(totalCapacity > 0){


        rate = Math.round(

            (totalRegistered /
            totalCapacity) * 100

        );


    }






    const registrationRate =
        document.getElementById("registrationRate");



    if(registrationRate){

        registrationRate.textContent =
            rate + "%";

    }
}
/* ==========================================
            REFRESH EVENTS
========================================== */


function refreshEvents(){


    events = getEvents();


    renderEvents(events);


    loadStatistics();


}






/* ==========================================
            SEARCH & FILTER
========================================== */


function filterEvents(){


    const searchText =

        searchBox

        ? searchBox.value
            .trim()
            .toLowerCase()

        : "";




    const status =

        statusFilter

        ? statusFilter.value

        : "All";





    const filtered = events.filter(event=>{



        const matchesSearch =


            event.name

            .toLowerCase()

            .includes(searchText)



            ||



            (event.category || "")

            .toLowerCase()

            .includes(searchText)



            ||



            (event.venue || "")

            .toLowerCase()

            .includes(searchText);








        const matchesStatus =


            status === "All"

            ||

            event.status === status;





        return (

            matchesSearch

            &&

            matchesStatus

        );



    });





    renderEvents(filtered);



}






/* ==========================================
            SEARCH BOX EVENT
========================================== */


if(searchBox){


    searchBox.addEventListener(

        "input",

        filterEvents

    );


}







/* ==========================================
            STATUS FILTER EVENT
========================================== */


if(statusFilter){


    statusFilter.addEventListener(

        "change",

        filterEvents

    );
}
/* ==========================================
            VIEW EVENT
========================================== */


function viewEvent(id){


    const event = events.find(

        e => e.id === id

    );



    if(!event)
        return;





    const viewContent =

        document.getElementById("viewContent");



    if(!viewContent)
        return;





    viewContent.innerHTML = `


        <img

        src="${event.banner || ''}"

        style="
        width:100%;
        height:250px;
        object-fit:cover;
        border-radius:12px;
        ">


        <h2>

        ${event.name}

        </h2>


        <p>

        <b>Category:</b>

        ${event.category}

        </p>



        <p>

        <b>Date:</b>

        ${formatDate(event.date)}

        </p>



        <p>

        <b>Time:</b>

        ${event.time}

        </p>



        <p>

        <b>Venue:</b>

        ${event.venue}

        </p>



        <p>

        <b>Price:</b>

        ${event.price > 0
            ? "₹"+event.price
            : "Free"}

        </p>



        <p>

        <b>Capacity:</b>

        ${event.capacity}

        </p>



        <p>

        <b>Registered:</b>

        ${event.registered || 0}

        </p>



        <p>

        <b>Status:</b>

        ${event.status}

        </p>



        <p>

        <b>Description:</b>

        </p>


        <p>

        ${event.description || ""}

        </p>


    `;



    const modal =

        document.getElementById("viewModal");



    if(modal){

        modal.style.display="block";

    }



}






/* ==========================================
            EDIT EVENT
========================================== */


function editEvent(id){


    const event = events.find(

        e => e.id === id

    );



    if(!event)
        return;





    document.getElementById("editId").value =
        event.id;



    document.getElementById("editName").value =
        event.name;



    document.getElementById("editCategory").value =
        event.category;



    document.getElementById("editDate").value =
        event.date;



    document.getElementById("editTime").value =
        event.time;



    document.getElementById("editVenue").value =
        event.venue;



    document.getElementById("editPrice").value =
        event.price;



    document.getElementById("editCapacity").value =
        event.capacity;



    document.getElementById("editStatus").value =
        event.status;



    document.getElementById("editDescription").value =
        event.description || "";





    document.getElementById("editModal")
        .style.display="block";



}








/* ==========================================
        SAVE EDITED EVENT
========================================== */


const editForm =

document.getElementById("editForm");



if(editForm){



editForm.addEventListener(

"submit",

function(e){



    e.preventDefault();





    const id = Number(

        document.getElementById("editId").value

    );





    const index = events.findIndex(

        e => e.id === id

    );





    if(index === -1)
        return;







    events[index].name =

        document.getElementById("editName").value;





    events[index].category =

        document.getElementById("editCategory").value;





    events[index].date =

        document.getElementById("editDate").value;





    events[index].time =

        document.getElementById("editTime").value;





    events[index].venue =

        document.getElementById("editVenue").value;





    events[index].price =

        Number(

        document.getElementById("editPrice").value

        );





    events[index].capacity =

        Number(

        document.getElementById("editCapacity").value

        );





    events[index].status =

        document.getElementById("editStatus").value;





    events[index].description =

        document.getElementById("editDescription").value;





    saveEvents(events);



    closeEditModal();



    refreshEvents();





    alert(

        "Event Updated Successfully!"

    );



});



}







/* ==========================================
            DELETE EVENT
========================================== */


function deleteEvent(id){



    const confirmDelete = confirm(

        "Delete this event?"

    );





    if(!confirmDelete)
        return;





    events = events.filter(

        event => event.id !== id

    );





    saveEvents(events);



    refreshEvents();





    alert(

        "Event Deleted Successfully"

    );
}
/* ==========================================
            REGISTER EVENT
========================================== */


function registerEvent(eventId){



    /* ---------- LOGIN CHECK ---------- */


    const loggedIn =

        localStorage.getItem("isLoggedIn");



    if(!loggedIn){


        alert(

            "Please login first."

        );


        window.location.href =
            "login.html";


        return;

    }







    /* ---------- ROLE CHECK ---------- */


    const role =

        localStorage.getItem("userRole");



    if(role !== "user"){


        alert(

            "Only users can register for events."

        );


        return;

    }







    const email =

        localStorage.getItem("userEmail");



    const name =

        localStorage.getItem("userName");







    let attendees = getAttendees();







    /* ---------- FIND EVENT ---------- */


    const event = events.find(

        e => e.id === eventId

    );



    if(!event)
        return;







    /* ---------- DUPLICATE CHECK ---------- */


    const alreadyRegistered =

        attendees.find(

            attendee =>

            attendee.eventId === eventId

            &&

            attendee.email === email

        );





    if(alreadyRegistered){


        alert(

            "You already registered for this event."

        );


        return;

    }








    /* ---------- CREATE ATTENDEE ---------- */


    const attendee = {



        id:

        attendees.length > 0

        ?

        Math.max(

            ...attendees.map(

                a => a.id || 0

            )

        ) + 1

        :

        1,



        eventId:event.id,


        eventName:event.name,


        name:name,


        email:email,


        phone:"-",


        status:"Registered",



        registrationDate:

        new Date()

        .toLocaleDateString("en-IN")



    };






    attendees.push(attendee);





    localStorage.setItem(

        "attendees",

        JSON.stringify(attendees)

    );









    /* ---------- UPDATE EVENT COUNT ---------- */


    event.registered =

        (event.registered || 0) + 1;





    saveEvents(events);









    /* ---------- CREATE TICKET ---------- */


    let tickets = getTickets();





    const ticket = {



        id:

        tickets.length > 0

        ?

        Math.max(

            ...tickets.map(

                t=>t.id || 0

            )

        ) + 1

        :

        1,




        ticketId:

        "EVT-" +

        String(Date.now()).slice(-6),




        attendeeId:

        attendee.id,




        eventId:

        event.id,




        eventName:

        event.name,




        name:

        attendee.name,




        email:

        attendee.email,




        date:

        event.date,




        time:

        event.time,




        venue:

        event.venue,




        price:

        event.price,




        status:

        "Confirmed",




        issuedOn:

        new Date()

        .toLocaleDateString("en-IN")



    };







    tickets.push(ticket);





    localStorage.setItem(

        "tickets",

        JSON.stringify(tickets)

    );







    refreshEvents();






    alert(

        "Registration Successful!\n\n"+

        "Ticket ID : "+

        ticket.ticketId

    );



}









/* ==========================================
            INITIAL LOAD
========================================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


    refreshEvents();


}

);