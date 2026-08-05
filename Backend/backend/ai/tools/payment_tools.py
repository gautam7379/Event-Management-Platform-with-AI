from sqlalchemy.orm import Session

from backend.models.registration import Registration


def get_user_payments(
    db: Session,
    user_id: int,
) -> list[dict]:
    """
    Return payment records belonging only to
    registrations owned by the authenticated user.

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

        payment = registration.payment
        event = registration.event
        ticket = registration.ticket

        if payment is None:
            continue

        amount = float(
            payment.amount or 0
        )

        refund_amount = float(
            payment.refund_amount or 0
        )

        results.append(
            {
                "payment_id":
                    payment.id,

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

                "ticket_id":
                    (
                        ticket.id
                        if ticket
                        else None
                    ),

                "ticket_category":
                    (
                        ticket.ticket_category
                        if ticket
                        else None
                    ),

                "ticket_price":
                    (
                        float(ticket.price or 0)
                        if ticket
                        else None
                    ),

                "payment_amount":
                    amount,

                "payment_status":
                    payment.payment_status,

                "payment_method":
                    payment.payment_method,

                "payment_date":
                    (
                        payment.payment_date.isoformat()
                        if payment.payment_date
                        else None
                    ),

                "refund_amount":
                    refund_amount,

                "net_amount":
                    amount - refund_amount,
            }
        )

    return results


def get_user_payment_summary(
    db: Session,
    user_id: int,
) -> dict:
    """
    Calculate a payment summary for the
    authenticated user.

    Calculations are performed in Python from
    database records rather than by the LLM.
    """

    payments = get_user_payments(
        db=db,
        user_id=user_id,
    )

    total_payment_records = len(payments)

    paid_count = 0
    total_paid = 0.0
    total_refunded = 0.0

    for payment in payments:

        if (
            payment["payment_status"]
            == "Paid"
        ):
            paid_count += 1

            total_paid += (
                payment["payment_amount"]
            )

        total_refunded += (
            payment["refund_amount"]
        )

    return {
        "total_payment_records":
            total_payment_records,

        "successful_payment_count":
            paid_count,

        "total_paid":
            total_paid,

        "total_refunded":
            total_refunded,

        "net_paid":
            total_paid - total_refunded,
    }


def get_user_payment_details(
    db: Session,
    user_id: int,
    payment_id: int,
) -> dict | None:
    """
    Return one payment only if the associated
    registration belongs to the authenticated user.
    """

    registrations = (
        db.query(Registration)
        .filter(
            Registration.user_id == user_id
        )
        .all()
    )

    for registration in registrations:

        payment = registration.payment

        if (
            payment is None
            or payment.id != payment_id
        ):
            continue

        event = registration.event
        ticket = registration.ticket

        amount = float(
            payment.amount or 0
        )

        refund_amount = float(
            payment.refund_amount or 0
        )

        return {
            "payment_id":
                payment.id,

            "payment_amount":
                amount,

            "payment_status":
                payment.payment_status,

            "payment_method":
                payment.payment_method,

            "payment_date":
                (
                    payment.payment_date.isoformat()
                    if payment.payment_date
                    else None
                ),

            "refund_amount":
                refund_amount,

            "net_amount":
                amount - refund_amount,

            "registration": {
                "registration_id":
                    registration.id,

                "registration_number":
                    registration.registration_number,

                "registration_status":
                    registration.status,
            },

            "event": (
                {
                    "event_id":
                        event.id,

                    "event_name":
                        event.event_name,

                    "event_status":
                        event.status,
                }
                if event
                else None
            ),

            "ticket": (
                {
                    "ticket_id":
                        ticket.id,

                    "ticket_category":
                        ticket.ticket_category,

                    "ticket_price":
                        float(ticket.price or 0),

                    "ticket_status":
                        ticket.status,
                }
                if ticket
                else None
            ),
        }

    return None