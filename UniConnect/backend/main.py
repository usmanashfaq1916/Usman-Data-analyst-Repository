import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import chat, merit, recommend, sop, resume, scholarship_recommend, career

load_dotenv()

app = FastAPI(
    title="UniConnect AI API",
    description="AI-powered backend for UniConnect - Pakistan's university admissions portal",
    version="1.0.0",
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(merit.router, prefix="/api", tags=["Merit"])
app.include_router(recommend.router, prefix="/api", tags=["Recommend"])
app.include_router(sop.router, prefix="/api", tags=["SOP"])
app.include_router(resume.router, prefix="/api", tags=["Resume"])
app.include_router(scholarship_recommend.router, prefix="/api", tags=["Scholarships"])
app.include_router(career.router, prefix="/api", tags=["Career"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "UniConnect AI API"}
