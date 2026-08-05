# EventAI Frontend
This frontend is integrated with the existing FastAPI backend. Start `python server.py` and open http://127.0.0.1:5500. The server proxies `/api/*` to `http://127.0.0.1:8000`, so the backend does not need CORS/code changes. See `../FRONTEND_BACKEND_INTEGRATION.md` for full setup and API mapping.
