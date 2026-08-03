from langchain_ollama import ChatOllama


# ==========================================
# Ollama LLM
# ==========================================

llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.2,
)


# ==========================================
# AI Analytics Generator
# ==========================================

def generate_event_analytics(
    context: str,
    prompt: str,
) -> str:
    """
    Generate AI-powered event analytics.
    """

    full_prompt = f"""
You are a Senior Event Analytics Consultant.

Analyze the following event information.

========================================
EVENT ANALYTICS
========================================

{context}

========================================
USER REQUEST
========================================

{prompt}

========================================
RULES
========================================

Return only plain text.

Do not use Markdown.

Base every observation ONLY on the provided data.

Do not invent numbers.

Do not invent speakers, sponsors or vendors.

Structure your report exactly as follows.

Event Analytics

Overall Assessment

Key Findings

Risk Analysis

Recommendations

Conclusion

Recommendations must be numbered.

Keep the report professional.
"""

    response = llm.invoke(full_prompt)

    analytics = response.content.strip()

    analytics = analytics.replace("**", "")
    analytics = analytics.replace("__", "")
    analytics = analytics.replace("#", "")
    analytics = analytics.replace("```", "")

    while "\n\n\n" in analytics:
        analytics = analytics.replace("\n\n\n", "\n\n")

    return analytics