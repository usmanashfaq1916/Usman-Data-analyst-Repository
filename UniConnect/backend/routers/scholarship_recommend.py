from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.groq_client import get_chat_response

router = APIRouter()

SCHOLARSHIP_SYSTEM_PROMPT = """You are UniConnect AI's Scholarship Recommender. Based on a student's academic and financial profile,
recommend the best scholarships available for them in Pakistan and internationally.

Consider:
- Academic marks and merit
- Financial status and need
- Degree level and field of study
- Country preference
- Scholarship deadlines
- Merit-based vs need-based eligibility
- Government, university, and private scholarships

Provide 5-8 scholarship recommendations ranked by match strength, with eligibility details and application tips."""


class ScholarshipRecommendRequest(BaseModel):
    matric: float | None = None
    inter: float | None = None
    cgpa: float | None = None
    financialStatus: str | None = None
    degreeLevel: str | None = None
    field: str | None = None
    country: str | None = "Pakistan"
    budget: str | None = None


class ScholarshipRecommendation(BaseModel):
    name: str
    matchScore: int
    reason: str


class ScholarshipRecommendResponse(BaseModel):
    recommendations: list[ScholarshipRecommendation]


@router.post("/scholarships/recommend", response_model=ScholarshipRecommendResponse)
async def recommend_scholarships(request: ScholarshipRecommendRequest):
    try:
        user_message = f"""Student Profile for Scholarship Search:
- Matric Marks: {request.matric or 'Not specified'}
- Intermediate Marks: {request.inter or 'Not specified'}
- CGPA: {request.cgpa or 'Not specified'}
- Financial Status: {request.financialStatus or 'Not specified'}
- Degree Level: {request.degreeLevel or 'Not specified'}
- Field of Study: {request.field or 'Not specified'}
- Preferred Country: {request.country or 'Pakistan'}
- Budget: {request.budget or 'Not specified'}

Recommend 5-8 scholarships with match scores and detailed reasons explaining why each scholarship is suitable."""
        reply = await get_chat_response(
            messages=[{"role": "user", "content": user_message}],
            system_prompt=SCHOLARSHIP_SYSTEM_PROMPT,
            temperature=0.7,
            max_tokens=1024,
        )
        return ScholarshipRecommendResponse(
            recommendations=[
                ScholarshipRecommendation(
                    name="Based on AI Analysis",
                    matchScore=85,
                    reason=reply,
                )
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
