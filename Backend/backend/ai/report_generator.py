from langchain_ollama import ChatOllama


# ==========================================
# Ollama LLM
# ==========================================

llm = ChatOllama(
    model="qwen2.5:1.5b",
    temperature=0.2,
)


# ==========================================
# Generate AI Event Report
# ==========================================

def generate_event_report(
    context: str,
    prompt: str,
) -> str:
    """
    Generate a professional AI event report.
    """

    full_prompt = f"""
You are a Senior Event Management Consultant.

You analyze event data and prepare professional reports.

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

Generate a professional event report.

STRICT RULES:

1. Return ONLY the report.
2. Never use Markdown.
3. Never use:
   #
   ##
   ###
   *
   **
   __
   ---
4. Do not wrap headings with symbols.
5. Use plain English.
6. Use professional formatting.
7. Use short paragraphs.
8. Use numbered lists where appropriate.
9. Base every observation ONLY on the provided event data.
10. Do not invent speakers, sponsors, vendors, registrations, or statistics.

==================================================
REPORT FORMAT
==================================================

Event Report

Event Overview

Event Details

Venue Information

Registration Statistics

Speaker Summary

Session Summary

Sponsor Summary

Vendor Summary

Event Analysis

Recommendations

Conclusion

==================================================
END
==================================================
"""

    response = llm.invoke(full_prompt)

    report = response.content.strip()

    # ------------------------------------------
    # Remove Markdown if generated
    # ------------------------------------------

    report = report.replace("**", "")
    report = report.replace("__", "")
    report = report.replace("###", "")
    report = report.replace("##", "")
    report = report.replace("#", "")
    report = report.replace("```", "")

    # Remove repeated blank lines
    while "\n\n\n" in report:
        report = report.replace("\n\n\n", "\n\n")

    return report