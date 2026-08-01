/* ==========================================
            EVENTAI TICKET VIEW
========================================== */

// Get selected ticket from localStorage
const ticket = JSON.parse(localStorage.getItem("selectedTicket"));

// If no ticket exists
if (!ticket) {

    alert("Ticket not found!");

    window.location.href = "tickets.html";

}

/* ==========================================
            LOAD TICKET DETAILS
========================================== */

document.getElementById("eventName").textContent =
    ticket.eventName || "Event";

document.getElementById("ticketHolder").textContent =
    ticket.name || "-";

document.getElementById("ticketEmail").textContent =
    ticket.email || "-";

document.getElementById("ticketDate").textContent =
    ticket.date || "-";

document.getElementById("ticketVenue").textContent =
    ticket.venue || "-";

document.getElementById("ticketId").textContent =
    ticket.ticketId || "-";

/* ==========================================
            GENERATE QR CODE
========================================== */

new QRCode(document.getElementById("qrcode"), {

    text: JSON.stringify({

        ticketId: ticket.ticketId,

        name: ticket.name,

        event: ticket.eventName,

        email: ticket.email,

        date: ticket.date

    }),

    width: 180,

    height: 180,

    colorDark: "#000000",

    colorLight: "#ffffff",

    correctLevel: QRCode.CorrectLevel.H

});

/* ==========================================
            PRINT TICKET
========================================== */

function printTicket() {

    window.print();

}

/* ==========================================
            DOWNLOAD PDF
========================================== */

document.getElementById("downloadPDF").addEventListener("click", async function () {

    const ticketElement = document.querySelector(".ticket");

    const canvas = await html2canvas(ticketElement, {

        scale: 2,

        useCORS: true

    });

    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 190;

    const pdfHeight = canvas.height * pdfWidth / canvas.width;

    pdf.addImage(

        imgData,

        "PNG",

        10,

        10,

        pdfWidth,

        pdfHeight

    );

    pdf.save(

        `${ticket.ticketId}.pdf`

    );

});

/* ==========================================
            BACK BUTTON
========================================== */

function goBack() {

    window.location.href = "tickets.html";

}

/* ==========================================
            DEBUG
========================================== */

console.log("================================");

console.log("Ticket Loaded");

console.log(ticket);

console.log("================================");