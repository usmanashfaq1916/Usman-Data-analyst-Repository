from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.groq_client import get_chat_response

router = APIRouter()

MERIT_SYSTEM_PROMPT = """You are UniConnect AI's Merit Predictor. Analyze the student's academic profile and predict their admission chances.

Given their matric marks, intermediate marks, entry test score, and the merit formula used by Pakistani universities,
calculate their aggregate and predict their chances of admission.

Provide:
1. Their calculated aggregate percentage
2. A probability assessment (High > 75%, Medium 40-75%, Low < 40%)
3. A brief explanation of their chances
4. Suggested programs/universities where they might get admission

Be realistic and data-driven. Use standard Pakistani university merit formulas:
- NUST: Matric 10% + FSc 40% + Entry Test 50%
- FAST: Matric 10% + FSc 40% + Entry Test 50%
- UET: Matric 10% + FSc 40% + Entry Test 50%
- LUMS: SAT/LCAT based, typically 85%+ for top programs
- COMSATS: Matric 10% + FSc 40% + Entry Test 50%
- University of Punjab: Matric 10% + FSc 40% + Entry Test 50%"""


class MeritPredictRequest(BaseModel):
    matric: float
    inter: float
    entryTest: float
    formula: str | None = None
    preferredPrograms: list[str] | None = None


class MeritPredictResponse(BaseModel):
    probability: str
    confidence: str
    explanation: str
    programs: list[str]


@router.post("/merit/predict", response_model=MeritPredictResponse)
async def merit_predict(request: MeritPredictRequest):
    try:
        aggregate = round(request.matric * 0.1 + request.inter * 0.4 + request.entryTest * 0.5, 2)
        programs = request.preferredPrograms or []

        user_message = f"""Student Profile:
- Matric Marks: {request.matric}%
- Intermediate Marks: {request.inter}%
- Entry Test Score: {request.entryTest}%
- Calculated Aggregate: {aggregate}%
- Preferred Programs: {', '.join(programs) if programs else 'Not specified'}

Predict their admission chances and suggest suitable programs/universities."""

        reply = await get_chat_response(
            messages=[{"role": "user", "content": user_message}],
            system_prompt=MERIT_SYSTEM_PROMPT,
            temperature=0.7,
            max_tokens=1024,
        )

        if aggregate >= 75:
            probability = "High"
            confidence = "Strong"
        elif aggregate >= 40:
            probability = "Medium"
            confidence = "Moderate"
        else:
            probability = "Low"
            confidence = "Weak"

        return MeritPredictResponse(
            probability=probability,
            confidence=confidence,
            explanation=reply,
            programs=request.preferredPrograms or [],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
