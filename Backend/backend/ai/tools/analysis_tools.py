from sqlalchemy.orm import Session

from backend.ai.tools.ticket_tools import (
    get_user_tickets,
)

from backend.ai.tools.payment_tools import (
    get_user_payments,
    get_user_payment_summary,
)

from backend.ai.tools.registration_tools import (
    get_user_registrations,
)


def analyze_user_tickets(
    db: Session,
    user_id: int,
) -> dict:
    """
    Return deterministic ticket analytics.

    No natural-language question is hard-coded here.
    Python calculates facts; the LLM interprets them.
    """

    tickets = get_user_tickets(
        db=db,
        user_id=user_id,
    )

    if not tickets:
        return {
            "count": 0,
            "tickets": [],
            "cheapest": None,
            "most_expensive": None,
            "ascending": [],
            "descending": [],
        }

    ascending = sorted(
        tickets,
        key=lambda item: item["ticket_price"],
    )

    descending = sorted(
        tickets,
        key=lambda item: item["ticket_price"],
        reverse=True,
    )

    return {
        "count": len(tickets),

        "tickets": tickets,

        "cheapest": ascending[0],

        "most_expensive": descending[0],

        "ascending": ascending,

        "descending": descending,
    }


def find_nearest_ticket_price(
    db: Session,
    user_id: int,
    target_amount: float,
) -> dict | None:
    """
    Find the authenticated user's ticket whose
    ticket_price is numerically closest to any
    requested target amount.

    Works dynamically for 100, 500, 50000, etc.
    """

    tickets = get_user_tickets(
        db=db,
        user_id=user_id,
    )

    if not tickets:
        return None

    nearest = min(
        tickets,
        key=lambda item: abs(
            item["ticket_price"]
            - target_amount
        ),
    )

    result = dict(nearest)

    result["target_amount"] = float(
        target_amount
    )

    result["difference"] = abs(
        nearest["ticket_price"]
        - target_amount
    )

    return result


def analyze_user_payments(
    db: Session,
    user_id: int,
) -> dict:
    """
    Return deterministic payment analytics.
    """

    payments = get_user_payments(
        db=db,
        user_id=user_id,
    )

    summary = get_user_payment_summary(
        db=db,
        user_id=user_id,
    )

    paid_payments = [
        payment
        for payment in payments
        if payment["payment_status"] == "Paid"
    ]

    if paid_payments:

        highest = max(
            paid_payments,
            key=lambda item:
                item["payment_amount"],
        )

        lowest = min(
            paid_payments,
            key=lambda item:
                item["payment_amount"],
        )

    else:

        highest = None
        lowest = None

    return {
        "summary": summary,
        "payments": payments,
        "highest_paid_payment": highest,
        "lowest_paid_payment": lowest,
    }


def analyze_user_registrations(
    db: Session,
    user_id: int,
) -> dict:
    """
    Return deterministic registration analytics.
    """

    registrations = get_user_registrations(
        db=db,
        user_id=user_id,
    )

    status_counts = {}

    for registration in registrations:

        status = (
            registration.get(
                "registration_status"
            )
            or "Unknown"
        )

        status_counts[status] = (
            status_counts.get(status, 0)
            + 1
        )

    return {
        "total_registrations":
            len(registrations),

        "status_counts":
            status_counts,

        "registrations":
            registrations,
    }