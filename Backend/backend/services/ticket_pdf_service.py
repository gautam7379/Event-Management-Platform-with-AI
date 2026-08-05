from pathlib import Path

from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


def generate_ticket_pdf(
    registration,
    event,
    user,
    ticket,
):
    pdf_folder = Path("uploads/tickets")
    pdf_folder.mkdir(parents=True, exist_ok=True)

    filename = f"{registration.registration_number}.pdf"

    filepath = pdf_folder / filename

    c = canvas.Canvas(str(filepath))

    c.setTitle("Event Ticket")

    c.setFont("Helvetica-Bold",22)
    c.drawString(
        60,
        800,
        "EVENT AI"
    )

    c.setFont("Helvetica",14)

    c.drawString(
        60,
        760,
        f"Event : {event.event_name}"
    )

    c.drawString(
        60,
        735,
        f"User : {user.first_name} {user.last_name}"
    )

    c.drawString(
        60,
        710,
        f"Registration : {registration.registration_number}"
    )

    c.drawString(
        60,
        685,
        f"Category : {ticket.ticket_category}"
    )

    c.drawString(
        60,
        660,
        f"Venue ID : {event.venue_id}"
    )

    c.drawString(
        60,
        635,
        f"Date : {event.start_date}"
    )

    c.drawString(
        60,
        610,
        f"Time : {event.start_time}"
    )

    c.drawString(
        60,
        585,
        "Payment : PAID"
    )

    qr = Path("uploads/qr_codes") / registration.qr_code

    if qr.exists():

        c.drawImage(
            str(qr),
            350,
            570,
            width=2*inch,
            height=2*inch
        )

    c.save()

    return filename