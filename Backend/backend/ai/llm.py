import os
from langchain_ollama import ChatOllama

llm = ChatOllama(
    model=os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b"),
    base_url=os.getenv(
        "OLLAMA_BASE_URL",
        "http://host.docker.internal:11434"
    ),
    temperature=0,
)