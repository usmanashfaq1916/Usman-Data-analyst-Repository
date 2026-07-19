from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.groq_client import get_chat_response

router = APIRouter()

RESUME_SYSTEM_PROMPT = """You are UniConnect AI's Resume Builder. Help students create ATS-friendly resumes for university applications and internships.

For each resume, provide:
1. A professional summary (2-3 sentences)
2. Suggested skills to add (relevant to their target role)
3. Improved project descriptions (2-3 bullet points each)
4. Actionable tips to strengthen their resume

Be specific and practical. Focus on Pakistani education and job market context."""


class ResumeGenerateRequest(BaseModel):
    name: str
    education: str
    skills: str
    projects: str
    experience: str
    targetRole: str


class ResumeGenerateResponse(BaseModel):
    summary: str
    suggestedSkills: list[str]
    projectDescriptions: list[str]


@router.post("/resume/generate", response_model=ResumeGenerateResponse)
async def resume_generate(request: ResumeGenerateRequest):
    try:
        user_message = f"""Generate resume improvements for:

Name: {request.name}
Education: {request.education}
Current Skills: {request.skills}
Projects: {request.projects}
Experience: {request.experience}
Target Role: {request.targetRole}

Provide:
1. Professional summary
2. Suggested skills to add
3. Improved project descriptions"""

        reply = await get_chat_response(
            messages=[{"role": "user", "content": user_message}],
            system_prompt=RESUME_SYSTEM_PROMPT,
            temperature=0.7,
            max_tokens=2048,
        )

        return ResumeGenerateResponse(
            summary="AI-generated professional summary based on your profile.",
            suggestedSkills=["Communication", "Teamwork", "Problem Solving"],
            projectDescriptions=[reply],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
