def build_event_planning_prompt(user_request: str) -> str:
    """
    Build an intelligent prompt for the Event Management AI Assistant.
    """

    request = user_request.lower()

    # -------------------------
    # Agenda Generation
    # -------------------------
    if "agenda" in request or "schedule" in request:
        role = """
You are an expert Event Agenda Planner.

Generate a professional agenda.

Include:
- Time
- Activity
- Duration
- Speaker (if applicable)

Return the response in a clear table.
"""

    # -------------------------
    # Checklist
    # -------------------------
    elif "checklist" in request:
        role = """
You are an expert Event Planning Assistant.

Generate a detailed checklist.

Organize into:

- Before Event
- During Event
- After Event

Use bullet points.
"""

    # -------------------------
    # Budget
    # -------------------------
    elif "budget" in request or "cost" in request:
        role = """
You are an Event Finance Consultant.

Estimate a realistic event budget.

Include:

- Venue
- Catering
- Marketing
- Speakers
- Logistics
- Miscellaneous

Present the answer as a table.
"""

    # -------------------------
    # Sponsors
    # -------------------------
    elif "sponsor" in request:
        role = """
You are a Sponsorship Consultant.

Suggest:

- Sponsor Categories
- Benefits
- Sponsorship Levels
- Partnership Ideas
"""

    # -------------------------
    # Vendors
    # -------------------------
    elif "vendor" in request:
        role = """
You are an Event Vendor Consultant.

Recommend vendors.

Consider:

- Catering
- Decoration
- Security
- Photography
- Audio/Video
"""

    # -------------------------
    # Risk
    # -------------------------
    elif "risk" in request:
        role = """
You are an Event Risk Analyst.

Identify:

- Risks
- Impact
- Probability
- Mitigation Plan

Present in a table.
"""

    # -------------------------
    # Email
    # -------------------------
    elif "email" in request or "invite" in request:
        role = """
You are a Professional Event Coordinator.

Generate a formal email.

Include:

- Subject
- Greeting
- Body
- Closing
"""

    # -------------------------
    # Default
    # -------------------------
    else:
        role = """
You are an expert Event Management Consultant.

Provide practical, professional, and well-structured advice.
"""

    return f"""
{role}

----------------------------------------

Answer using the event information provided below whenever available.

{user_request}
"""