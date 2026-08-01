/* ==========================================
            EVENTAI USER TICKETS
========================================== */


/* ==========================================
            STORAGE
========================================== */


function getTickets(){


    return JSON.parse(

        localStorage.getItem("tickets")

    ) || [];


}




/* ==========================================
            CURRENT USER
========================================== */


const currentUser = {


    name:

    localStorage.getItem("userName") || "User",



    email:

    localStorage.getItem("userEmail") || ""

};







/* ==========================================
            ELEMENTS
========================================== */


const ticketTable =

document.getElementById("ticketTable");



const emptyMessage =

document.getElementById("emptyMessage");







/* ==========================================
            LOAD USER NAME
========================================== */


function loadUser(){


    const user =

    document.getElementById("loggedUserName");



    if(user){

        user.textContent =
        currentUser.name;

    }


}








/* ==========================================
            LOAD STATISTICS
========================================== */


function loadStatistics(tickets){



    document.getElementById(
        "myTicketCount"
    ).textContent = tickets.length;




    const confirmed = tickets.filter(ticket =>

        ticket.status === "Confirmed"

    ).length;



    document.getElementById(
        "confirmedCount"
    ).textContent = confirmed;





    const upcoming = tickets.filter(ticket =>{


        return new Date(ticket.date) >= new Date();


    }).length;



    document.getElementById(
        "upcomingCount"
    ).textContent = upcoming;







    if(tickets.length > 0){


        document.getElementById(
            "lastTicket"
        ).textContent =

        tickets[tickets.length-1].ticketId;


    }



}








/* ==========================================
            LOAD TICKETS
========================================== */


function loadTickets(){



    const allTickets = getTickets();




    const myTickets = allTickets.filter(ticket =>


        ticket.email === currentUser.email


    );







    ticketTable.innerHTML = "";





    if(myTickets.length === 0){


        emptyMessage.style.display="block";


        loadStatistics([]);


        return;


    }





    emptyMessage.style.display="none";







    myTickets.forEach(ticket =>{





        ticketTable.innerHTML += `



<tr>



<td>

${ticket.ticketId}

</td>




<td>

${ticket.eventName}

</td>




<td>

${ticket.date}

</td>




<td>

${ticket.venue}

</td>




<td>

<span class="badge upcoming">

${ticket.status}

</span>

</td>




<td>



<button

class="primary-btn"

onclick="viewTicket('${ticket.ticketId}')">


View


</button>



</td>



</tr>



`;




    });





    loadStatistics(myTickets);



}








/* ==========================================
            VIEW TICKET
========================================== */


function viewTicket(ticketId){



    localStorage.setItem(

        "selectedTicket",

        ticketId

    );



    window.location.href =

    "ticket-view.html";


}








/* ==========================================
            INITIAL LOAD
========================================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadUser();


    loadTickets();


}

);