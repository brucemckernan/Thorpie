from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path

from .thorpie import ask_thorpie
from .config import CORS_ORIGINS, GROQ_API_KEY

app = FastAPI(title="Thorpie API", description="Ask Thorpie owt. Regret it immediately.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

frontend_path = Path(__file__).parent.parent / "frontend"
app.mount("/static", StaticFiles(directory=frontend_path), name="static")


class Question(BaseModel):
    question: str


class Answer(BaseModel):
    answer: str


@app.get("/")
def serve_frontend():
    return FileResponse(frontend_path / "index.html")


@app.get("/health")
def health():
    return {"status": "reight grand", "api_key_set": bool(GROQ_API_KEY)}


@app.post("/ask", response_model=Answer)
def ask(body: Question):
    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Tha's asked nowt. Ask summat.")
    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="No API key set — check thy .env file, lad.")
    try:
        response = ask_thorpie(body.question.strip())
        return Answer(answer=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summat's gone wrong at t'mill: {e}")
