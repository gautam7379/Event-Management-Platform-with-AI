from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.2,
)


def generate_dashboard(
    context: str,
    prompt: str,
) -> str:
    """
    Generate AI Organizer Dashboard.
    """

    full_prompt = f"""
You are a senior Event Analytics Consultant.

Below is the complete event analytics.

{context}

----------------------------------------

Organizer Request:

{prompt}

----------------------------------------

Create an Executive Organizer Dashboard.

Rules:

Do NOT use Markdown.

Do NOT use # or ##.

Use clean plain text.

Structure exactly as follows:

Organizer Dashboard

Executive Summary

Overall Health Score (0-100)

Success Probability (%)

Registration Overview

Attendance Forecast

Budget Status

Speaker Status

Sponsor Status

Vendor Status

Venue Status

Marketing Performance

Major Risks

Priority Actions

Quick Wins

Long-Term Recommendations

Conclusion

Base every recommendation only on the available event data.

Avoid inventing information.

Keep the report professional and concise.
"""

    response = llm.invoke(full_prompt)

    return response.content