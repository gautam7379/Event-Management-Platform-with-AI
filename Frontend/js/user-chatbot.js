/* ==========================================
        EVENTAI USER CHATBOT
========================================== */



/* ==========================================
            LOCAL STORAGE
========================================== */


function getEvents(){


    return JSON.parse(

        localStorage.getItem("events")

    ) || [];


}



function getTickets(){


    return JSON.parse(

        localStorage.getItem("tickets")

    ) || [];


}



function getAttendees(){


    return JSON.parse(

        localStorage.getItem("attendees")

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


const chatMessages =

document.getElementById("chatMessages");



const userMessage =

document.getElementById("userMessage");



const sendMessage =

document.getElementById("sendMessage");
/* ==========================================
            ADD MESSAGE
========================================== */


function addMessage(message, sender){


    const div = document.createElement("div");



    if(sender === "user"){


        div.className = "user-message";


    }

    else{


        div.className = "bot-message";


    }




    div.innerHTML = `

        <p>

        ${message}

        </p>

    `;




    chatMessages.appendChild(div);



    chatMessages.scrollTop =

        chatMessages.scrollHeight;


}







/* ==========================================
            AI RESPONSE
========================================== */


function getBotResponse(message){



    const text =

        message.toLowerCase();






    const events = getEvents();



    const tickets = getTickets();



    const attendees = getAttendees();






    /* ===============================
            GREETING
    =============================== */


    if(

        text.includes("hello")

        ||

        text.includes("hi")

        ||

        text.includes("hey")

    ){


        return (

        "Hello "+currentUser.name+

        " 👋 How can I help you today?"

        );


    }







    /* ===============================
            AVAILABLE EVENTS
    =============================== */


    if(

        text.includes("event")

        &&

        (

        text.includes("available")

        ||

        text.includes("show")

        ||

        text.includes("list")

        )

    ){



        if(events.length === 0){


            return "Currently no events are available.";

        }





        let reply =

        "Upcoming Events:<br><br>";





        events.forEach((event,index)=>{


            if(event.status !== "Completed"){


                reply +=

                `${index+1}. ${event.name}<br>
                Date: ${event.date}<br>
                Venue: ${event.venue}<br><br>`;


            }


        });





        return reply;


    }








    /* ===============================
            EVENT SEARCH
    =============================== */


    for(let event of events){



        if(

            text.includes(

                event.name.toLowerCase()

            )

        ){



            return `

            Event Details:<br><br>

            Name: ${event.name}<br>

            Category: ${event.category}<br>

            Date: ${event.date}<br>

            Time: ${event.time}<br>

            Venue: ${event.venue}<br>

            Price: ₹${event.price}

            `;


        }


    }








    /* ===============================
            MY TICKETS
    =============================== */


    if(

        text.includes("ticket")

        ||

        text.includes("my ticket")

    ){



        const myTickets =

        tickets.filter(ticket =>

            ticket.email === currentUser.email

        );





        if(myTickets.length === 0){


            return (

            "You don't have any tickets yet. "+

            "Register for an event to generate a ticket."

            );


        }






        let reply =

        "Your Tickets:<br><br>";





        myTickets.forEach(ticket=>{


            reply +=

            `Ticket ID: ${ticket.ticketId}<br>
             Event: ${ticket.eventName}<br>
             Status: ${ticket.status}<br><br>`;


        });





        return reply;


    }








    /* ===============================
            REGISTRATION
    =============================== */


    if(

        text.includes("register")

    ){


        return (

        "To register:<br><br>"+

        "1. Go to Browse Events<br>"+

        "2. Select an event<br>"+

        "3. Click Register button<br>"+

        "4. Your ticket will be generated"

        );


    }







    /* ===============================
            HELP
    =============================== */


    if(

        text.includes("help")

    ){


        return (

        "I can help you with:<br><br>"+

        "• Available events<br>"+

        "• Event details<br>"+

        "• Registration<br>"+

        "• My tickets"

        );


    }






    return (

    "Sorry, I couldn't understand that. "

    +

    "Try asking about events, tickets, or registration."

    );



}
/* ==========================================
            SEND MESSAGE
========================================== */


function sendUserMessage(){


    const message =

        userMessage.value.trim();




    if(message === ""){

        return;

    }





    // USER MESSAGE

    addMessage(

        message,

        "user"

    );





    userMessage.value = "";







    // BOT RESPONSE DELAY


    setTimeout(()=>{


        const response =

            getBotResponse(message);



        addMessage(

            response,

            "bot"

        );



    },500);



}








/* ==========================================
            SEND BUTTON CLICK
========================================== */


if(sendMessage){


    sendMessage.addEventListener(

        "click",

        sendUserMessage

    );


}








/* ==========================================
            ENTER KEY SUPPORT
========================================== */


if(userMessage){


    userMessage.addEventListener(

        "keypress",

        function(event){



            if(event.key === "Enter"){


                sendUserMessage();


            }



        }


    );


}








/* ==========================================
            INITIAL LOAD
========================================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


    const user =

    document.getElementById(
        "loggedUserName"
    );



    if(user){


        user.textContent =

        currentUser.name;


    }


});