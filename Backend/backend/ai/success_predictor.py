from langchain_ollama import ChatOllama

# Initialize Ollama
llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.2,
)


def generate_success_prediction(
    context: str,
    prompt: str,
) -> str:
    """
    Generate AI event success prediction.
    """

    full_prompt = f"""
You are a senior Event Management Consultant.

Below is the event analytics.

{context}

----------------------------------------

User Request:

{prompt}

----------------------------------------

Generate a professional Event Success Assessment.

Include the following sections:

Event Success Score (0-100)

Success Level

Key Strengths

Weaknesses

Risk Factors

Reasons Behind Score

Recommendations

Executive Summary

Rules:

- Do NOT use Markdown.
- Do NOT use # or ##.
- Use plain text headings.
- Separate each section with a blank line.
- Use numbered lists where appropriate.
- Keep the report concise and professional.
- Base the assessment only on the provided event data.
- Do not invent facts.
"""

    response = llm.invoke(full_prompt)

    return response.content