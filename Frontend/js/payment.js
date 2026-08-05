if (!requireLogin()) {

    location.href = "login.html";

}

const event =
    JSON.parse(
        localStorage.getItem("paymentEvent")
    );

const ticket =
    JSON.parse(
        localStorage.getItem("paymentTicket")
    );

if (!event || !ticket) {

    alert("Invalid payment session.");

    location.href = "user-events.html";

}

document.getElementById("eventName").textContent =
    event.event_name;

document.getElementById("ticketCategory").textContent =
    ticket.ticket_category;

document.getElementById("ticketCategory2").textContent =
    ticket.ticket_category;

document.getElementById("amount").textContent =
    Number(ticket.price).toFixed(2);

document.getElementById("payAmount").textContent =
    Number(ticket.price).toFixed(2);

document.getElementById("payAmount2").textContent =
    Number(ticket.price).toFixed(2);

const cardSection =
    document.getElementById("cardSection");

const qrSection =
    document.getElementById("qrSection");

document
.querySelectorAll("input[name='method']")
.forEach(radio => {

    radio.addEventListener("change", () => {

        if (radio.value === "UPI") {

            cardSection.style.display = "none";

            qrSection.style.display = "block";

        }

        else {

            cardSection.style.display = "block";

            qrSection.style.display = "none";

        }

    });

});

document
.getElementById("payBtn")
.addEventListener("click", async () => {

    try {

        const paymentMethod =
            document.querySelector(
                "input[name='method']:checked"
            ).value;

        //--------------------------------------------------
        // Simple Card Validation
        //--------------------------------------------------

        if (paymentMethod === "Card") {

            const cardNumber =
                document.getElementById("cardNumber").value.trim();

            const cardName =
                document.getElementById("cardName").value.trim();

            const expiry =
                document.getElementById("expiry").value.trim();

            const cvv =
                document.getElementById("cvv").value.trim();

            if (
                !cardNumber ||
                !cardName ||
                !expiry ||
                !cvv
            ) {

                alert("Please complete card details.");

                return;

            }

        }

        //--------------------------------------------------
        // Create Registration
        //--------------------------------------------------

        const registration =
            await Api.registrations.create({

                user_id:
                    Number(
                        localStorage.getItem("userId")
                    ),

                event_id:
                    event.id

            });

        //--------------------------------------------------
        // Create Payment
        //--------------------------------------------------

        const payment =
            await Api.request(

                "/payments/",

                {

                    method: "POST",

                    body: {

                        registration_id:
                            registration.id,

                        amount:
                            Number(ticket.price),

                        payment_method:
                            paymentMethod,

                        payment_status:
                            "Paid"

                    }

                }

            );

        //--------------------------------------------------
        // Success
        //--------------------------------------------------

        //--------------------------------------------------
        // Success
        //--------------------------------------------------

        localStorage.removeItem("paymentEvent");
        localStorage.removeItem("paymentTicket");

        // Redirect directly to the generated ticket
        location.href =
            `ticket-view.html?id=${registration.id}`;

            }

            catch (err) {

                alert(err.message);

    }

});