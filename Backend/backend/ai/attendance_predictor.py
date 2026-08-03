from langchain_ollama import ChatOllama


# ==========================================
# Ollama LLM
# ==========================================

llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.2,
)


# ==========================================
# AI Attendance Predictor
# ==========================================

def predict_attendance(
    context: str,
    prompt: str,
) -> str:
    """
    Predict event attendance using AI.
    """

    full_prompt = f"""
You are a Senior Event Analytics Consultant.

Analyze the following event information and estimate attendance.

==================================================
EVENT DATA
==================================================

{context}

==================================================
USER REQUEST
==================================================

{prompt}

==================================================
RULES
==================================================

Return ONLY plain text.

Do NOT use Markdown.

Do NOT invent event information.

Use only the provided event data.

Estimate attendance based on:
- Current registrations
- Capacity
- Event status
- Speakers
- Sponsors
- Vendors
- Sessions

Return the report in exactly this format:

Attendance Prediction

Predicted Attendance

Capacity Utilization

Confidence Level

Prediction Factors

Potential Risks

Recommendations

Conclusion
"""

    response = llm.invoke(full_prompt)

    prediction = response.content.strip()

    prediction = prediction.replace("**", "")
    prediction = prediction.replace("__", "")
    prediction = prediction.replace("#", "")
    prediction = prediction.replace("```", "")

    while "\n\n\n" in prediction:
        prediction = prediction.replace("\n\n\n", "\n\n")

    return prediction