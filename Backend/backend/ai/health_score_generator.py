from langchain_ollama import ChatOllama


# ==========================================
# Ollama LLM
# ==========================================

llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.2,
)


# ==========================================
# AI Health Score Generator
# ==========================================

def generate_health_score(
    context: str,
    prompt: str,
) -> str:
    """
    Generate AI Event Health Assessment.
    """

    full_prompt = f"""
You are a Senior Event Management Consultant.

Analyze the following event data.

==================================================
EVENT DATA
==================================================

{context}

==================================================
USER REQUEST
==================================================

{prompt}

==================================================
INSTRUCTIONS
==================================================

Return ONLY plain text.

Do NOT use Markdown.

Do NOT invent information.

Base every conclusion ONLY on the provided data.

Estimate a Health Score from 0 to 100.

Estimate a Risk Level:
- Low
- Medium
- High

Return the report using exactly this structure.

Event Health Assessment

Health Score

Risk Level

Strengths

Weaknesses

Key Risks

Priority Actions

Conclusion
"""

    response = llm.invoke(full_prompt)

    report = response.content.strip()

    report = report.replace("**", "")
    report = report.replace("#", "")
    report = report.replace("__", "")
    report = report.replace("```", "")

    while "\n\n\n" in report:
        report = report.replace("\n\n\n", "\n\n")

    return report