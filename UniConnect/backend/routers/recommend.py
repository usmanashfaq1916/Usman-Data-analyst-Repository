from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.groq_client import get_chat_response

router = APIRouter()

RECOMMEND_SYSTEM_PROMPT = """You are UniConnect AI's University Recommender. Based on a student's academic profile, preferences, and budget,
recommend the best Pakistani universities and programs for them.

Consider:
- Merit/aggregate score compatibility
- Budget and fee structure
- Location/city preferences
- Program availability
- University type (public/private/military)
- Career prospects and industry connections

Provide 5-8 recommendations ranked by match strength, with brief reasons for each."""


class RecommendRequest(BaseModel):
    matric: float
    inter: float
    entryTest: float
    budget: str | None = None
    city: str | None = None
    preferredProgram: str | None = None
    province: str | None = None
    universityType: str | None = None


class UniversityRecommendation(BaseModel):
    name: str
    matchScore: int
    reason: str


class RecommendResponse(BaseModel):
    recommendations: list[UniversityRecommendation]


@router.post("/recommend/universities", response_model=RecommendResponse)
async def recommend_universities(request: RecommendRequest):
    try:
        aggregate = round(request.matric * 0.1 + request.inter * 0.4 + request.entryTest * 0.5, 2)

        user_message = f"""Student Profile:
- Aggregate: {aggregate}%
- Budget: {request.budget or 'Not specified'}
- Preferred City: {request.city or 'Not specified'}
- Preferred Program: {request.preferredProgram or 'Not specified'}
- Province: {request.province or 'Not specified'}
- University Type: {request.universityType or 'Not specified'}

Recommend 5-8 Pakistani universities with match scores and reasons."""

        reply = await get_chat_response(
            messages=[{"role": "user", "content": user_message}],
            system_prompt=RECOMMEND_SYSTEM_PROMPT,
            temperature=0.7,
            max_tokens=1024,
        )

        return RecommendResponse(
            recommendations=[
                UniversityRecommendation(
                    name="Based on AI Analysis",
                    matchScore=85,
                    reason=reply,
                )
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
