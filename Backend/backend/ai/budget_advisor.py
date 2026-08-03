from langchain_ollama import ChatOllama

# Initialize Ollama
llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.2,
)


def generate_budget_advice(
    context: str,
    prompt: str,
) -> str:
    """
    Generate AI budget analysis and cost optimization advice.
    """

    full_prompt = f"""
You are an Event Financial Planning Consultant.

Below is the event information.

{context}

--------------------------------------------------

User Request

{prompt}

--------------------------------------------------

Generate a professional budget analysis.

Include the following sections:

Budget Efficiency Score (0-100)

Estimated Budget Utilization

Major Cost Drivers

Potential Cost Savings

ROI Improvement Suggestions

Budget Risks

Recommended Spending Priorities

Executive Financial Summary

Rules:

- Do NOT use Markdown.
- Do NOT use # or ##.
- Use plain text headings.
- Separate sections with blank lines.
- Use numbered lists where appropriate.
- Base your analysis only on the provided event data.
- If financial information is unavailable, clearly state that assumptions are based only on available event data.
- Do not invent budgets, expenses, or revenue values.
"""

    response = llm.invoke(full_prompt)

    return response.content