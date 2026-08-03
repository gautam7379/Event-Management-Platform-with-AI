from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.2,
)


def generate_chat_response(
    context: str,
    question: str,
) -> str:
    """
    AI Chat Assistant for Event Management.
    """

    full_prompt = f"""
You are an AI Event Management Assistant.

You have access to the complete event analytics.

Event Context:

{context}

--------------------------------------------------

Organizer Question:

{question}

--------------------------------------------------

Instructions:

Answer ONLY using the provided event information.

If information is unavailable,
say:

"The requested information is not available."

Do NOT invent data.

Keep the answer professional.

Keep it concise.

Use bullet points whenever appropriate.
"""

    response = llm.invoke(full_prompt)

    return response.content