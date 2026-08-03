from langchain_core.prompts import ChatPromptTemplate

from backend.ai.llm import llm


def generate_email(
    prompt: str,
    event_context: str = "",
):
    """
    Generate a professional email.

    Returns:
    {
        "subject": "...",
        "body": "..."
    }
    """

    system_prompt = """
You are an expert event communication assistant.

Generate a professional email.

Rules:

1. Return ONLY this format.

Subject:
...

Body:
...

2. Do NOT use markdown.

3. Do NOT explain anything.

4. Keep the subject concise.

5. Make the body professional.

Event Context:

{event_context}
"""

    chat_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{prompt}"),
        ]
    )

    chain = chat_prompt | llm

    response = chain.invoke(
        {
            "prompt": prompt,
            "event_context": event_context,
        }
    )

    text = response.content.strip()

    subject = ""
    body = ""

    if "Body:" in text:

        parts = text.split("Body:", 1)

        subject = (
            parts[0]
            .replace("Subject:", "")
            .strip()
        )

        body = parts[1].strip()

    else:

        subject = "AI Generated Email"

        body = text

    return {
        "subject": subject,
        "body": body,
    }