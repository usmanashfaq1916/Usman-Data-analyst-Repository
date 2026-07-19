from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.groq_client import get_chat_response

router = APIRouter()

SOP_SYSTEM_PROMPT = """You are UniConnect AI's SOP Generator. Write compelling, personalized Statements of Purpose for university applications.

Follow these guidelines:
- Write 500-800 words
- Start with a strong personal hook
- Explain academic background and achievements
- Describe why the student chose this program/university
- Include career goals and how the program aligns
- End with a confident conclusion
- Use professional but natural language
- Be specific to the student's profile, not generic

Generate only the SOP content, no additional commentary."""


class SOPGenerateRequest(BaseModel):
    university: str
    country: str
    degree: str
    studentProfile: str
    type: str = "statement_of_purpose"


class SOPGenerateResponse(BaseModel):
    content: str
    wordCount: int


@router.post("/sop/generate", response_model=SOPGenerateResponse)
async def sop_generate(request: SOPGenerateRequest):
    try:
        user_message = f"""Generate a {request.type} for:

University: {request.university}
Country: {request.country}
Degree: {request.degree}
Student Profile: {request.studentProfile}

Write a compelling, personalized {request.type.replace('_', ' ')}."""

        reply = await get_chat_response(
            messages=[{"role": "user", "content": user_message}],
            system_prompt=SOP_SYSTEM_PROMPT,
            temperature=0.7,
            max_tokens=2048,
        )

        word_count = len(reply.split())

        return SOPGenerateResponse(content=reply, wordCount=word_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
