/* ==========================================
            EVENTAI TICKET VIEW
========================================== */

if (!requireLogin()) {
    location.href = "login.html";
}

/* ==========================================
        GET REGISTRATION ID
========================================== */

const registrationId =
    new URLSearchParams(window.location.search).get("id");

if (!registrationId) {

    alert("Invalid ticket.");

    location.href = "user-tickets.html";

}

/* ==========================================
        LOAD TICKET
========================================== */

let ticket = null;

async function loadTicket() {

    try {

        ticket =
            await Api.tickets.view(registrationId);

        renderTicket();

    }

    catch (err) {

        alert(err.message);

        location.href = "user-tickets.html";

    }

}

/* ==========================================
        RENDER TICKET
========================================== */

function renderTicket() {

    document.getElementById("eventName").textContent =
        ticket.event_name;

    document.getElementById("ticketHolder").textContent =
        ticket.holder_name;

    document.getElementById("ticketEmail").textContent =
        ticket.email;

    document.getElementById("ticketDate").textContent =
        ticket.date;

    document.getElementById("ticketVenue").textContent =
        ticket.venue;

    document.getElementById("ticketId").textContent =
        ticket.registration_number;

    generateQRCode();

}

/* ==========================================
        QR CODE
========================================== */

function generateQRCode() {

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(

        document.getElementById("qrcode"),

        {

            text: JSON.stringify({

                registration_number:
                    ticket.registration_number,

                holder:
                    ticket.holder_name,

                event:
                    ticket.event_name,

                email:
                    ticket.email,

                venue:
                    ticket.venue,

                date:
                    ticket.date

            }),

            width: 180,

            height: 180,

            colorDark: "#000000",

            colorLight: "#ffffff",

            correctLevel: QRCode.CorrectLevel.H

        }

    );

}

/* ==========================================
        PRINT
========================================== */

function printTicket() {

    window.print();

}

/* ==========================================
        DOWNLOAD PDF
========================================== */

document
.getElementById("downloadPDF")
.addEventListener(
    "click",
    async function () {

        const ticketElement =
            document.querySelector(".ticket");

        const canvas =
            await html2canvas(ticketElement, {

                scale: 2,

                useCORS: true

            });

        const imgData =
            canvas.toDataURL("image/png");

        const { jsPDF } =
            window.jspdf;

        const pdf =
            new jsPDF("p", "mm", "a4");

        const pdfWidth = 190;

        const pdfHeight =
            canvas.height *
            pdfWidth /
            canvas.width;

        pdf.addImage(

            imgData,

            "PNG",

            10,

            10,

            pdfWidth,

            pdfHeight

        );

        pdf.save(

            `${ticket.registration_number}.pdf`

        );

    }

);

/* ==========================================
        BACK
========================================== */

function goBack() {

    location.href =
        "user-tickets.html";

}

/* ==========================================
        INIT
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadTicket();

    const params =
        new URLSearchParams(location.search);

    if (params.get("download") === "1") {

        setTimeout(() => {

            document
                .getElementById("downloadPDF")
                .click();

        }, 800);

    }

});