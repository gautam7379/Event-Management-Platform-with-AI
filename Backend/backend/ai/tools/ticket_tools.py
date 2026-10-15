from sqlalchemy.orm import Session

from backend.models.registration import Registration


def get_user_tickets(
    db: Session,
    user_id: int,
) -> list[dict]:
    """
    Return all tickets assigned to registrations
    belonging to the authenticated user.

    This function only retrieves structured data.
    It does not interpret the user's question.
    """

    registrations = (
        db.query(Registration)
        .filter(
            Registration.user_id == user_id,
            Registration.ticket_id.isnot(None),
        )
        .order_by(
            Registration.registration_date.desc()
        )
        .all()
    )

    results = []

    for registration in registrations:

        ticket = registration.ticket
        event = registration.event

        if ticket is None:
            continue

        results.append(
            {
                "registration_id":
                    registration.id,

                "registration_number":
                    registration.registration_number,

                "registration_status":
                    registration.status,

                "event_id":
                    registration.event_id,

                "event_name":
                    (
                        event.event_name
                        if event
                        else None
                    ),

                "event_status":
                    (
                        event.status
                        if event
                        else None
                    ),

                "ticket_id":
                    ticket.id,

                "ticket_category":
                    ticket.ticket_category,

                "ticket_price":
                    float(ticket.price or 0),

                "ticket_status":
                    ticket.status,

                "qr_enabled":
                    ticket.qr_enabled,

                "sale_start_date":
                    (
                        ticket.sale_start_date.isoformat()
                        if ticket.sale_start_date
                        else None
                    ),

                "sale_end_date":
                    (
                        ticket.sale_end_date.isoformat()
                        if ticket.sale_end_date
                        else None
                    ),

                "event_start_date":
                    (
                        event.start_date.isoformat()
                        if event and event.start_date
                        else None
                    ),

                "event_start_time":
                    (
                        event.start_time.isoformat()
                        if event and event.start_time
                        else None
                    ),
            }
        )

    return results


def get_user_ticket_details(
    db: Session,
    user_id: int,
    ticket_id: int,
) -> dict | None:
    """
    Return one ticket only when it belongs to a
    registration owned by the authenticated user.
    """

    registration = (
        db.query(Registration)
        .filter(
            Registration.user_id == user_id,
            Registration.ticket_id == ticket_id,
        )
        .first()
    )

    if registration is None:
        return None

    ticket = registration.ticket
    event = registration.event
    payment = registration.payment
    check_in = registration.check_in

    if ticket is None:
        return None

    return {
        "ticket_id":
            ticket.id,

        "ticket_category":
            ticket.ticket_category,

        "ticket_price":
            float(ticket.price or 0),

        "ticket_status":
            ticket.status,

        "qr_enabled":
            ticket.qr_enabled,

        "event": (
            {
                "event_id":
                    event.id,

                "event_name":
                    event.event_name,

                "event_status":
                    event.status,

                "start_date":
                    (
                        event.start_date.isoformat()
                        if event.start_date
                        else None
                    ),

                "start_time":
                    (
                        event.start_time.isoformat()
                        if event.start_time
                        else None
                    ),
            }
            if event
            else None
        ),

        "registration": {
            "registration_id":
                registration.id,

            "registration_number":
                registration.registration_number,

            "registration_status":
                registration.status,
        },

        "payment": (
            {
                "payment_id":
                    payment.id,

                "amount":
                    float(payment.amount or 0),

                "payment_status":
                    payment.payment_status,

                "payment_method":
                    payment.payment_method,

                "refund_amount":
                    float(
                        payment.refund_amount or 0
                    ),
            }
            if payment
            else None
        ),

        "check_in": (
            {
                "attendance_status":
                    check_in.attendance_status,

                "check_in_time":
                    (
                        check_in.check_in_time.isoformat()
                        if check_in.check_in_time
                        else None
                    ),

                "entry_gate":
                    check_in.entry_gate,

                "badge_printed":
                    check_in.badge_printed,
            }
            if check_in
            else None
        ),
    }