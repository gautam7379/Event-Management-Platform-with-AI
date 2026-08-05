from sqlalchemy.orm import Session

from backend.models.registration import Registration


def get_user_registrations(
    db: Session,
    user_id: int,
) -> list[dict]:
    """
    Return registrations belonging only to
    the authenticated user.

    This is a generic database tool.
    It does not interpret natural-language questions.
    """

    registrations = (
        db.query(Registration)
        .filter(
            Registration.user_id == user_id
        )
        .order_by(
            Registration.registration_date.desc()
        )
        .all()
    )

    results = []

    for registration in registrations:

        event = registration.event

        results.append(
            {
                "registration_id":
                    registration.id,

                "registration_number":
                    registration.registration_number,

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

                "registration_status":
                    registration.status,

                "registration_date":
                    (
                        registration.registration_date.isoformat()
                        if registration.registration_date
                        else None
                    ),

                "ticket_id":
                    registration.ticket_id,

                "has_ticket":
                    registration.ticket is not None,

                "has_payment":
                    registration.payment is not None,

                "has_check_in":
                    registration.check_in is not None,
            }
        )

    return results


def get_user_registration_details(
    db: Session,
    user_id: int,
    registration_id: int,
) -> dict | None:
    """
    Return one registration belonging to the
    authenticated user.

    user_id is always included in the database
    filter so another user's registration cannot
    be retrieved through this tool.
    """

    registration = (
        db.query(Registration)
        .filter(
            Registration.id == registration_id,
            Registration.user_id == user_id,
        )
        .first()
    )

    if registration is None:
        return None

    event = registration.event
    ticket = registration.ticket
    payment = registration.payment
    check_in = registration.check_in

    return {
        "registration_id":
            registration.id,

        "registration_number":
            registration.registration_number,

        "registration_status":
            registration.status,

        "registration_date":
            (
                registration.registration_date.isoformat()
                if registration.registration_date
                else None
            ),

        "event": (
            {
                "event_id": event.id,
                "event_name": event.event_name,
                "event_status": event.status,
                "start_date": (
                    event.start_date.isoformat()
                    if event.start_date
                    else None
                ),
                "start_time": (
                    event.start_time.isoformat()
                    if event.start_time
                    else None
                ),
            }
            if event
            else None
        ),

        "ticket": (
            {
                "ticket_id": ticket.id,
                "ticket_category":
                    ticket.ticket_category,
                "ticket_price":
                    float(ticket.price),
                "ticket_status":
                    ticket.status,
                "qr_enabled":
                    ticket.qr_enabled,
            }
            if ticket
            else None
        ),

        "payment": (
            {
                "payment_id": payment.id,
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
                "payment_date": (
                    payment.payment_date.isoformat()
                    if payment.payment_date
                    else None
                ),
            }
            if payment
            else None
        ),

        "check_in": (
            {
                "attendance_status":
                    check_in.attendance_status,

                "check_in_time": (
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