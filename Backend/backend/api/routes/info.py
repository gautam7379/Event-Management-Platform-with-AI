from fastapi import APIRouter

router = APIRouter(
    prefix="/info",
    tags=["Information"],
)


@router.get("/")
def api_info():
    """
    API information.
    """

    return {
        "project": "Event Management Platform with AI",
        "backend": "FastAPI",
        "database": "PostgreSQL",
        "ai": "Ollama",
        "version": "1.0.0",
        "author": "Chandan Kumar",
    }