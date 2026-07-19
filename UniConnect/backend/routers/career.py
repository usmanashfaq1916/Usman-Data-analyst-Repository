from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.groq_client import get_chat_response

router = APIRouter()

CAREER_SYSTEM_PROMPT = """You are UniConnect AI's Career Guidance Expert. Based on a student's profile and interests,
provide a comprehensive career roadmap with actionable steps.

Include:
- Career roadmap with short-term and long-term goals
- Required skills and certifications
- Recommended learning resources (courses, books, platforms)
- Internship and job opportunities in Pakistan
- Current job market trends and salary estimates
- Future growth opportunities
- Relevant universities and programs in Pakistan"""


class CareerRequest(BaseModel):
    careerGoal: str
    currentEducation: str | None = None
    field: str | None = None
    skills: str | None = None
    experience: str | None = None
    preferredCity: str | None = None


class CareerStep(BaseModel):
    title: str
    description: str
    duration: str | None = None


class CareerRoadmap(BaseModel):
    steps: list[CareerStep]


class CareerResponse(BaseModel):
    careerGoal: str
    roadmap: str
    requiredSkills: list[str]
    learningResources: list[str]
    internships: list[str]
    jobTrends: str
    salaryEstimate: str


@router.post("/career/roadmap", response_model=CareerResponse)
async def generate_career_roadmap(request: CareerRequest):
    try:
        user_message = f"""Student Profile for Career Guidance:
- Career Goal: {request.careerGoal}
- Current Education: {request.currentEducation or 'Not specified'}
- Field of Interest: {request.field or 'Not specified'}
- Current Skills: {request.skills or 'Not specified'}
- Experience: {request.experience or 'Not specified'}
- Preferred City: {request.preferredCity or 'Not specified'}

Provide a detailed career roadmap including:
1. Step-by-step career roadmap with timeline
2. Required technical and soft skills
3. Learning resources (courses, books, platforms)
4. Internship and job opportunities
5. Current job market trends
6. Salary estimates in Pakistan and internationally
7. Future growth opportunities"""
        reply = await get_chat_response(
            messages=[{"role": "user", "content": user_message}],
            system_prompt=CAREER_SYSTEM_PROMPT,
            temperature=0.7,
            max_tokens=1536,
        )
        return CareerResponse(
            careerGoal=request.careerGoal,
            roadmap=reply,
            requiredSkills=[],
            learningResources=[],
            internships=[],
            jobTrends="See roadmap for details",
            salaryEstimate="See roadmap for details",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
