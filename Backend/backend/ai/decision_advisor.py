from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.2,
)


def generate_decision_advice(
    context: str,
    prompt: str,
) -> str:
    """
    Generate AI Decision Support recommendations.
    """

    full_prompt = f"""
You are a Senior Event Strategy Consultant with expertise in event operations,
marketing, budgeting, sponsorships, logistics, and risk management.

Below is the complete event analytics.

{context}

----------------------------------------------------

Organizer Request:

{prompt}

----------------------------------------------------

Prepare an Executive Decision Support Report.

Instructions:

- Do NOT use Markdown.
- Do NOT use # or ##.
- Use plain text headings only.
- Base every recommendation strictly on the provided event data.
- Never invent information.
- Keep recommendations practical and actionable.

Generate the report using exactly this structure:

Decision Support Report

Executive Summary

Current Situation

Top 5 Immediate Actions

High Priority Decisions

Medium Priority Decisions

Low Priority Decisions

Potential Risks

Business Opportunities

Expected Business Impact

90-Day Strategic Roadmap

Final Recommendation
"""

    response = llm.invoke(full_prompt)

    return response.content