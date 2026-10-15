import re
from typing import Literal, Optional

from pydantic import BaseModel, Field

from langchain_ollama import ChatOllama


# ==========================================
# ROUTE SCHEMA
# ==========================================

class UserQueryRoute(BaseModel):

    category: Literal[
        "event",
        "registration",
        "ticket",
        "payment",
        "general",
    ] = Field(
        description="Main EventAI information domain."
    )

    operation: Literal[
        "list",
        "details",
        "search",
        "summary",
        "compare",
        "cheapest",
        "most_expensive",
        "nearest_price",
        "total",
        "highest",
        "lowest",
        "status",
        "unknown",
    ] = Field(
        description="Requested operation."
    )

    entity_id: Optional[int] = Field(
        default=None,
        description=(
            "Explicit EventAI record ID mentioned by "
            "the user, such as payment ID, ticket ID, "
            "registration ID, or event ID."
        ),
    )

    target_amount: Optional[float] = None

    search_text: Optional[str] = None


# ==========================================
# LLM
# ==========================================

router_llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.0,
)


structured_router = (
    router_llm.with_structured_output(
        UserQueryRoute
    )
)


# ==========================================
# ROUTER PROMPT
# ==========================================

ROUTER_PROMPT = """
You are an intent router for the EventAI
authenticated-user assistant.

Your ONLY task is classification.

Do NOT answer the user's question.

==================================================
DOMAINS
==================================================

ticket:
Questions about the user's ticket itself,
including:
- ticket price
- ticket category
- ticket status
- cheapest ticket
- expensive ticket
- ticket comparisons
- ticket near a requested price

payment:
Questions about money actually paid:
- how much the user spent
- total paid
- payment history
- refunds
- payment methods
- highest payment
- lowest payment

registration:
Questions about:
- events the user registered for
- registration count
- registration status
- registration details

event:
Questions about:
- available events
- event names
- schedules
- dates
- times
- venues
- descriptions
- capacity
- event status

general:
Use only when no EventAI domain fits.

==================================================
IMPORTANT DISTINCTION
==================================================

A requested TICKET PRICE belongs to:

category = ticket

A question about MONEY ACTUALLY PAID belongs to:

category = payment

Examples:

"ticket around 50000"
=> ticket

"ticket costing about 100"
=> ticket

"what did I pay?"
=> payment

"how much have I spent?"
=> payment

==================================================
OPERATIONS
==================================================

list:
The user wants multiple records or history.

Examples:
- show my payments
- payment history
- what payments have I made
- show all my tickets
- list my registrations
- what events did I register for

details:
The user wants ONE specific record, normally
identified by an explicit ID.

Examples:
- show payment ID 7
- details of ticket 3
- registration ID 19
- tell me about event ID 4

search:
Find an event using its name or descriptive text.

summary:
Give a general overview rather than individual
records.

compare:
Compare multiple records.

cheapest:
The LOWEST ticket price owned by the user.

Use cheapest for meanings such as:
- cheapest
- least expensive
- lowest priced
- lowest price
- costs the least
- cost me the least
- least costly
- minimum ticket price

most_expensive:
The HIGHEST ticket price owned by the user.

Use most_expensive for meanings such as:
- most expensive
- priciest
- highest priced
- highest price
- costs the most
- cost me the most
- most costly
- maximum ticket price

IMPORTANT:

"most", "highest", "priciest", and
"most expensive" indicate the HIGH-price direction.

They MUST NOT be classified as cheapest.

"least", "lowest", "cheapest", and
"least expensive" indicate the LOW-price direction.

They MUST NOT be classified as most_expensive.

nearest_price:
Find the user's ticket whose ticket price is closest
to a requested monetary amount.

total:
Calculate an aggregate numeric total.

Examples:
- how much have I spent?
- total amount paid
- what is my total spending?

highest:
Highest payment or other supported numeric value.

lowest:
Lowest payment or other supported numeric value.

status:
Status information.

unknown:
Use only when no operation fits.

cheapest:
The LOWEST ticket price owned by the user.

Use cheapest for meanings such as:
- cheapest
- least expensive
- lowest priced
- lowest price
- costs the least
- cost me the least
- least costly
- minimum ticket price

most_expensive:
The HIGHEST ticket price owned by the user.

Use most_expensive for meanings such as:
- most expensive
- priciest
- highest priced
- highest price
- costs the most
- cost me the most
- most costly
- maximum ticket price

IMPORTANT:

"most", "highest", "priciest", and
"most expensive" indicate the HIGH-price direction.

They MUST NOT be classified as cheapest.

"least", "lowest", "cheapest", and
"least expensive" indicate the LOW-price direction.

They MUST NOT be classified as most_expensive.

==================================================
LIST VS TOTAL
==================================================

This distinction is extremely important.

Questions asking WHAT records exist are "list".

Examples:

"What payments have I made?"
=> payment / list

"Show my payment history"
=> payment / list

"What have I paid for?"
=> payment / list

"Show my tickets"
=> ticket / list

"What events have I registered for?"
=> registration / list

Questions asking HOW MUCH in aggregate are "total".

Examples:

"How much have I paid?"
=> payment / total

"How much have I spent?"
=> payment / total

"What is my total spending?"
=> payment / total

Do NOT classify payment history as total.

==================================================
SPECIFIC RECORD IDs
==================================================

When the user explicitly identifies one record by ID:

"Show payment ID 7"
=> category = payment
=> operation = details
=> entity_id = 7

"Tell me about ticket ID 3"
=> category = ticket
=> operation = details
=> entity_id = 3

"Show registration 19"
=> category = registration
=> operation = details
=> entity_id = 19

"Tell me about event ID 4"
=> category = event
=> operation = details
=> entity_id = 4

Do NOT place record IDs into target_amount.

target_amount is ONLY for monetary price queries.


==================================================
APPROXIMATE PRICE LANGUAGE
==================================================

For a ticket-price question containing meanings
such as:

around
approximately
approx
near
close to
closest to
roughly
about
similar to

use:

category = ticket
operation = nearest_price

Do this even when the amount is written in words.

Do not calculate anything.
Do not answer the question.
"""


# ==========================================
# NUMERIC AMOUNT EXTRACTION
# ==========================================

def extract_numeric_amount(
    question: str,
) -> Optional[float]:
    """
    Deterministically extract common numeric
    monetary expressions.

    Examples:
        50000
        50,000
        50k
        1.5k

    This does NOT classify the question.
    """

    text = question.lower()

    pattern = re.compile(
        r"""
        (?<!\w)
        (?P<number>
            \d+(?:,\d{3})*(?:\.\d+)?
        )
        \s*
        (?P<suffix>k)?
        (?!\w)
        """,
        re.VERBOSE,
    )

    matches = list(
        pattern.finditer(text)
    )

    if not matches:
        return None

    # Prefer the last numeric expression because
    # currency requests commonly place the amount
    # near the end of the question.
    match = matches[-1]

    raw_number = (
        match.group("number")
        .replace(",", "")
    )

    try:
        amount = float(raw_number)
    except ValueError:
        return None

    if match.group("suffix"):
        amount *= 1000

    return amount


# ==========================================
# WORD AMOUNT EXTRACTION
# ==========================================

class AmountExtraction(BaseModel):

    amount: Optional[float] = Field(
        default=None,
        description=(
            "Monetary amount represented in the "
            "question. Convert number words and "
            "abbreviations to a numeric value."
        ),
    )


amount_llm = (
    router_llm.with_structured_output(
        AmountExtraction
    )
)


def extract_word_amount(
    question: str,
) -> Optional[float]:
    """
    LLM fallback for amounts expressed in words,
    such as 'fifty thousand'.
    """

    prompt = f"""
Extract only the monetary amount from the
following user question.

Convert number words to their numeric value.

Examples:

fifty thousand rupees
=> 50000

one hundred rupees
=> 100

two thousand five hundred
=> 2500

twenty five thousand
=> 25000

If there is no monetary amount, return null.

Do not answer the question.

USER QUESTION:

{question}
"""

    try:

        result = amount_llm.invoke(
            prompt
        )

        return result.amount

    except Exception:

        return None

# ==========================================
# ENTITY ID EXTRACTION
# ==========================================

def extract_entity_id(
    question: str,
) -> Optional[int]:
    """
    Extract an explicitly identified EventAI
    record ID.

    Examples:
        payment ID 7
        ticket id: 3
        registration #19
        event ID 4

    Does not treat arbitrary numbers as IDs.
    """

    pattern = re.compile(
        r"""
        \b
        (?:payment|ticket|registration|event)
        \s*
        (?:id\s*[:#-]?\s*|\#\s*)
        (?P<id>\d+)
        \b
        """,
        re.IGNORECASE | re.VERBOSE,
    )

    match = pattern.search(question)

    if not match:
        return None

    try:
        return int(match.group("id"))
    except (TypeError, ValueError):
        return None



def normalize_route(
    question: str,
    route: UserQueryRoute,
) -> UserQueryRoute:
    """
    Correct unambiguous semantic direction after
    LLM classification.

    This does not answer questions or retrieve data.
    It only normalizes high/low ticket-price intent.
    """

    text = question.lower()

    # Only apply ticket-price direction rules
    # when the question is about tickets.
    if route.category != "ticket":
        return route

    high_price_terms = (
        "most expensive",
        "priciest",
        "highest priced",
        "highest price",
        "cost me the most",
        "costs the most",
        "most costly",
        "maximum price",
        "max price",
    )

    low_price_terms = (
        "cheapest",
        "least expensive",
        "lowest priced",
        "lowest price",
        "cost me the least",
        "costs the least",
        "least costly",
        "minimum price",
        "min price",
    )

    if any(
        term in text
        for term in high_price_terms
    ):
        route.operation = "most_expensive"

    elif any(
        term in text
        for term in low_price_terms
    ):
        route.operation = "cheapest"

    return route

# ==========================================
# ROUTE QUESTION
# ==========================================

def route_user_question(
    question: str,
) -> UserQueryRoute:

    route = structured_router.invoke(
        ROUTER_PROMPT
        + "\n\nUSER QUESTION:\n"
        + question
    )

        # --------------------------------------
    # Explicit EventAI record ID
    # --------------------------------------

    entity_id = extract_entity_id(
        question
    )

    if entity_id is not None:

        route.entity_id = entity_id

        # An explicit record ID represents
        # a request concerning that record.
        route.operation = "details"

    # --------------------------------------
    # Extract monetary parameter separately
    # --------------------------------------

    if route.operation == "nearest_price":

        amount = extract_numeric_amount(
            question
        )

        if amount is None:
            amount = extract_word_amount(
                question
            )

        route.target_amount = amount
        route.category = "ticket"

        # ======================================
        # NORMALIZE SEMANTIC DIRECTION
        # ======================================

    route = normalize_route(
        question=question,
        route=route,
    )

    return route