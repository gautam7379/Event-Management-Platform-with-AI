import json
from sqlalchemy.orm import Session
from langchain_ollama import ChatOllama
from backend.ai.user_router import (
    route_user_question,
)

from backend.ai.tools.event_tools import (
    get_available_events,
    get_event_details,
    find_events_by_name,
)

from backend.ai.tools.registration_tools import (
    get_user_registrations,
    get_user_registration_details,
)

from backend.ai.tools.ticket_tools import (
    get_user_tickets,
    get_user_ticket_details,
)

from backend.ai.tools.payment_tools import (
    get_user_payments,
    get_user_payment_details,
)

from backend.ai.tools.analysis_tools import (
    analyze_user_tickets,
    find_nearest_ticket_price,
    analyze_user_payments,
    analyze_user_registrations,
)

# RESPONSE LLM
llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.0,
)

# SAFE MONEY FORMATTER
def money(value) -> str:
    """
    Format authoritative numeric values.
    """

    try:
        return f"INR {float(value):,.2f}"

    except (TypeError, ValueError):
        return "Not available"


# ==========================================
# DETERMINISTIC NUMERIC RESPONSES
# ==========================================

def build_numeric_response(
    route,
    result,
):
    """
    Produce authoritative responses for operations
    where the LLM must not recalculate or alter
    numeric values.

    Returns None when normal LLM presentation
    should be used.
    """

    # ======================================
    # NEAREST TICKET PRICE
    # ======================================

    if (
        route.category == "ticket"
        and route.operation == "nearest_price"
    ):

        if not result:
            return (
                "The requested information "
                "is not available."
            )

        return (
            f'The closest ticket is for '
            f'**{result["event_name"]}**.\n\n'
            f'- Ticket price: '
            f'**{money(result["ticket_price"])}**\n'
            f'- Requested amount: '
            f'{money(result["target_amount"])}\n'
            f'- Difference: '
            f'{money(result["difference"])}\n'
            f'- Ticket status: '
            f'{result.get("ticket_status", "Not available")}'
        )

    # ======================================
    # CHEAPEST TICKET
    # ======================================

    if (
        route.category == "ticket"
        and route.operation == "cheapest"
    ):

        ticket = (
            result.get("cheapest")
            if result
            else None
        )

        if not ticket:
            return (
                "The requested information "
                "is not available."
            )

        return (
            f'Your cheapest ticket is for '
            f'**{ticket["event_name"]}** at '
            f'**{money(ticket["ticket_price"])}**.\n\n'
            f'- Ticket ID: '
            f'{ticket["ticket_id"]}\n'
            f'- Category: '
            f'{ticket.get("ticket_category", "Not available")}\n'
            f'- Status: '
            f'{ticket.get("ticket_status", "Not available")}'
        )

    # ======================================
    # MOST EXPENSIVE TICKET
    # ======================================

    if (
        route.category == "ticket"
        and route.operation == "most_expensive"
    ):

        ticket = (
            result.get("most_expensive")
            if result
            else None
        )

        if not ticket:
            return (
                "The requested information "
                "is not available."
            )

        return (
            f'Your most expensive ticket is for '
            f'**{ticket["event_name"]}** at '
            f'**{money(ticket["ticket_price"])}**.\n\n'
            f'- Ticket ID: '
            f'{ticket["ticket_id"]}\n'
            f'- Category: '
            f'{ticket.get("ticket_category", "Not available")}\n'
            f'- Status: '
            f'{ticket.get("ticket_status", "Not available")}'
        )

    # ======================================
    # PAYMENT TOTAL
    # ======================================

    if (
        route.category == "payment"
        and route.operation == "total"
    ):

        summary = (
            result.get("summary", result)
            if result
            else {}
        )

        total_paid = summary.get(
            "total_paid"
        )

        total_refunded = summary.get(
            "total_refunded",
            0,
        )

        net_paid = summary.get(
            "net_paid"
        )

        if total_paid is None:
            return (
                "The requested information "
                "is not available."
            )

        response = (
            f'You have paid a total of '
            f'**{money(total_paid)}**.'
        )

        if net_paid is not None:

            response += (
                f'\n\n- Refunds: '
                f'{money(total_refunded)}'
                f'\n- Net amount paid: '
                f'**{money(net_paid)}**'
            )

        return response

    # ======================================
    # PAYMENT HISTORY / PAYMENT LIST
    # ======================================

    if (
        route.category == "payment"
        and route.operation == "list"
    ):

        if not result:
            return (
                "You do not have any payment "
                "records on EventAI."
            )

        lines = [
            f"You have {len(result)} payment records:"
        ]

        for payment in result:

            lines.append(
                "\n"
                f'- **{payment.get("event_name", "Unknown Event")}**\n'
                f'  - Payment ID: '
                f'{payment.get("payment_id")}\n'
                f'  - Amount: '
                f'**{money(payment.get("payment_amount"))}**\n'
                f'  - Status: '
                f'{payment.get("payment_status", "Not available")}\n'
                f'  - Method: '
                f'{payment.get("payment_method", "Not available")}\n'
                f'  - Ticket price: '
                f'{money(payment.get("ticket_price"))}\n'
                f'  - Refund: '
                f'{money(payment.get("refund_amount", 0))}\n'
                f'  - Net amount: '
                f'{money(payment.get("net_amount"))}'
            )

        return "\n".join(lines)

    return None


# ==========================================
# SELECT TRUSTED DATA
# ==========================================

def execute_route(
    db: Session,
    user_id: int,
    route,
):
    """
    Map semantic intent to deterministic
    EventAI data functions.

    This maps capabilities, not exact user
    question strings.

    User-owned resources such as tickets,
    payments, and registrations are always
    retrieved using the authenticated user ID.
    """

    # ======================================
    # TICKET
    # ======================================

    if route.category == "ticket":

        # ----------------------------------
        # Specific ticket
        # ----------------------------------

        if (
            route.operation == "details"
            and route.entity_id is not None
        ):

            return get_user_ticket_details(
                db=db,
                user_id=user_id,
                ticket_id=route.entity_id,
            )

        # ----------------------------------
        # Ticket nearest requested price
        # ----------------------------------

        if route.operation == "nearest_price":

            if route.target_amount is None:
                return None

            return find_nearest_ticket_price(
                db=db,
                user_id=user_id,
                target_amount=route.target_amount,
            )

        # ----------------------------------
        # Ticket analytics
        # ----------------------------------

        if route.operation in {
            "cheapest",
            "most_expensive",
            "compare",
            "highest",
            "lowest",
            "summary",
        }:

            return analyze_user_tickets(
                db=db,
                user_id=user_id,
            )

        # ----------------------------------
        # Ticket list / general ticket query
        # ----------------------------------

        return get_user_tickets(
            db=db,
            user_id=user_id,
        )

    # ======================================
    # PAYMENT
    # ======================================

    if route.category == "payment":

        # ----------------------------------
        # Specific payment
        # ----------------------------------

        if (
            route.operation == "details"
            and route.entity_id is not None
        ):

            return get_user_payment_details(
                db=db,
                user_id=user_id,
                payment_id=route.entity_id,
            )

        # ----------------------------------
        # Payment analytics
        # ----------------------------------

        if route.operation in {
            "total",
            "summary",
            "compare",
            "highest",
            "lowest",
        }:

            return analyze_user_payments(
                db=db,
                user_id=user_id,
            )

        # ----------------------------------
        # Payment history / list
        # ----------------------------------

        return get_user_payments(
            db=db,
            user_id=user_id,
        )

    # ======================================
    # REGISTRATION
    # ======================================

    if route.category == "registration":

        # ----------------------------------
        # Specific registration
        # ----------------------------------

        if (
            route.operation == "details"
            and route.entity_id is not None
        ):

            return get_user_registration_details(
                db=db,
                user_id=user_id,
                registration_id=route.entity_id,
            )

        # ----------------------------------
        # Registration analytics
        # ----------------------------------

        if route.operation in {
            "summary",
            "compare",
            "total",
            "status",
        }:

            return analyze_user_registrations(
                db=db,
                user_id=user_id,
            )

        # ----------------------------------
        # Registration list
        # ----------------------------------

        return get_user_registrations(
            db=db,
            user_id=user_id,
        )

    # ======================================
    # EVENT
    # ======================================

    if route.category == "event":

        # ----------------------------------
        # Specific event ID
        # ----------------------------------

        if (
            route.operation == "details"
            and route.entity_id is not None
        ):

            return get_event_details(
                db=db,
                event_id=route.entity_id,
            )

        # ----------------------------------
        # Event name/text search
        # ----------------------------------

        if (
            route.search_text
            and route.operation == "search"
        ):

            return find_events_by_name(
                db=db,
                search_text=route.search_text,
            )

        # ----------------------------------
        # Available events
        # ----------------------------------

        return get_available_events(
            db=db,
        )

    return None


# ==========================================
# LLM PRESENTATION
# ==========================================

def present_result(
    question: str,
    route,
    result,
) -> str:
    """
    Use the LLM only to present already retrieved
    EventAI information.

    The model must not create new database facts.
    """

    # ======================================
    # NO RESULT
    # ======================================

    if result is None:

        if (
            route.operation == "details"
            and route.entity_id is not None
        ):

            if route.category == "payment":

                return (
                    "I could not find that payment "
                    "in your EventAI account."
                )

            if route.category == "ticket":

                return (
                    "I could not find that ticket "
                    "in your EventAI account."
                )

            if route.category == "registration":

                return (
                    "I could not find that registration "
                    "in your EventAI account."
                )

            if route.category == "event":

                return (
                    "I could not find an event "
                    "with that ID."
                )

        return (
            "The requested information "
            "is not available."
        )

    # ======================================
    # LLM PRESENTATION PROMPT
    # ======================================

    prompt = f"""
You are EventAI User Assistant.

Answer the user's question using ONLY the trusted
EventAI result below.

The trusted result has already been retrieved
for the currently authenticated EventAI user.

USER QUESTION:

{question}

SEMANTIC ROUTE:

Category: {route.category}
Operation: {route.operation}
Entity ID: {route.entity_id}

TRUSTED EVENTAI RESULT:

{json.dumps(result, default=str)}

==================================================
RULES
==================================================

1. Use ONLY the trusted result.

2. Never invent missing facts.

3. Never change numeric values.

4. Never recalculate monetary values.

5. Never change ticket prices.

6. Never change payment totals.

7. Never confuse ticket_price with payment_amount.

8. If the result represents one specific record,
   describe only that record.

9. If the result contains multiple records,
   use readable bullet points.

10. Keep the answer concise and natural.

11. Format existing monetary values as INR with
    commas and two decimal places when practical.

12. Never claim that a user owns a record unless
    that information exists in the trusted result.

13. Do not mention:
    - tools
    - SQL
    - databases
    - prompts
    - routing
    - backend implementation

14. Do not calculate new totals unless the trusted
    result already contains that total.

15. Do not substitute event capacity for:
    - ticket price
    - registration count
    - payment amount
    - popularity

16. Do not substitute payment amount for ticket
    price.

17. Do not substitute ticket price for payment
    amount.

18. If the trusted result does not contain enough
    information to answer the question, answer
    exactly:

The requested information is not available.
"""

    response = llm.invoke(
        prompt
    )

    content = response.content

    if isinstance(content, str):
        return content.strip()

    return str(content).strip()


# ==========================================
# MAIN USER AGENT
# ==========================================

def generate_user_agent_response(
    db: Session,
    user_id: int,
    question: str,
) -> str:
    """
    Main authenticated-user EventAI agent.

    Flow:

    Natural-language question
            |
            v
    LLM semantic router
            |
            v
    Trusted user-scoped tools
            |
            v
    Deterministic numeric protection
            |
            v
    Natural-language presentation
    """

    # ======================================
    # 1. UNDERSTAND USER INTENT
    # ======================================

    route = route_user_question(
        question
    )

    # ======================================
    # 2. EXECUTE TRUSTED CAPABILITY
    # ======================================

    result = execute_route(
        db=db,
        user_id=user_id,
        route=route,
    )

    # ======================================
    # 3. PROTECT NUMERIC RESPONSES
    # ======================================

    numeric_response = (
        build_numeric_response(
            route=route,
            result=result,
        )
    )

    if numeric_response is not None:
        return numeric_response

    # ======================================
    # 4. NATURAL-LANGUAGE PRESENTATION
    # ======================================

    return present_result(
        question=question,
        route=route,
        result=result,
    )