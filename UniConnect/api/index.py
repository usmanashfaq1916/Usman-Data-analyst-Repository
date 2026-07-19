import os
import asyncio
from datetime import date
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras
from groq import AsyncGroq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")

groq_client = AsyncGroq(api_key=GROQ_API_KEY)
GROQ_MODEL = "llama-3.3-70b-versatile"

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

async def get_chat_response(
    messages: list[dict],
    system_prompt: str | None = None,
    temperature: float = 0.7,
    max_tokens: int = 1024,
) -> str:
    groq_messages = []
    if system_prompt:
        groq_messages.append({"role": "system", "content": system_prompt})
    groq_messages.extend(messages)
    response = await groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=groq_messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content or ""

def get_sync_connection():
    return psycopg2.connect(DATABASE_URL)

async def fetch_university_data():
    loop = asyncio.get_event_loop()
    def _fetch():
        conn = get_sync_connection()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""
                    SELECT u."name", u."province", u."city", u."type", u."ranking",
                           u."establishedYear", u."description", u."websiteUrl", u."isFeatured",
                           (SELECT COUNT(*) FROM "Program" p WHERE p."universityId" = u.id) as program_count,
                           (SELECT COUNT(*) FROM "Scholarship" s WHERE s."universityId" = u.id) as scholarship_count
                    FROM "University" u
                    WHERE u."isActive" = true
                    ORDER BY u."isFeatured" DESC, u."name" ASC
                    LIMIT 50
                """)
                return [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()
    return await loop.run_in_executor(None, _fetch)

async def fetch_program_data():
    loop = asyncio.get_event_loop()
    def _fetch():
        conn = get_sync_connection()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""
                    SELECT p."name", p."degreeLevel", p."field", p."minAggregate",
                           p."semesterFee", p."duration", u."name" as university_name
                    FROM "Program" p
                    JOIN "University" u ON u.id = p."universityId"
                    WHERE p."isAvailable" = true AND u."isActive" = true
                    ORDER BY u."name", p."name"
                    LIMIT 100
                """)
                return [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()
    return await loop.run_in_executor(None, _fetch)

async def fetch_scholarship_data():
    loop = asyncio.get_event_loop()
    def _fetch():
        conn = get_sync_connection()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""
                    SELECT s."name", s."type", s."amount", s."deadline", s."eligibility",
                           s."country", s."degreeLevel", s."isMeritBased", s."isNeedBased",
                           u."name" as university_name
                    FROM "Scholarship" s
                    JOIN "University" u ON u.id = s."universityId"
                    WHERE s."isActive" = true
                    ORDER BY s."deadline" ASC
                """)
                return [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()
    return await loop.run_in_executor(None, _fetch)

async def fetch_admission_data():
    loop = asyncio.get_event_loop()
    def _fetch():
        conn = get_sync_connection()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""
                    SELECT a."status", a."openDate", a."closeDate", a."description",
                           u."name" as university_name
                    FROM "Admission" a
                    JOIN "University" u ON u.id = a."universityId"
                    WHERE a."status" IN ('OPEN', 'CLOSING_SOON', 'UPCOMING')
                    ORDER BY a."closeDate" ASC
                    LIMIT 30
                """)
                return [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()
    return await loop.run_in_executor(None, _fetch)

async def fetch_faq_data():
    loop = asyncio.get_event_loop()
    def _fetch():
        conn = get_sync_connection()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""
                    SELECT "question", "answer", "category"
                    FROM "FAQ"
                    WHERE "isActive" = true
                    ORDER BY "order" ASC
                """)
                return [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()
    return await loop.run_in_executor(None, _fetch)

_system_prompt_cache: str | None = None
_cache_lock = asyncio.Lock()

async def get_cached_system_prompt() -> str:
    global _system_prompt_cache
    async with _cache_lock:
        if _system_prompt_cache is None:
            _system_prompt_cache = await build_system_prompt()
        return _system_prompt_cache

def invalidate_cache():
    global _system_prompt_cache
    _system_prompt_cache = None

def get_fallback_prompt():
    return """You are UniConnect AI, Pakistan's smartest university admissions assistant built into the UniConnect platform.
You help students discover universities, find scholarships, compare programs, estimate admission chances, and navigate the entire application process.

You have knowledge about:
- 259+ Pakistani universities (NUST, LUMS, FAST, UET, QAU, COMSATS, etc.)
- Programs across Computer Science, Engineering, Business, Medical, Arts, and Sciences
- Scholarships: merit-based, need-based, government (HEC, PEEF), and private
- Admission deadlines and requirements
- Merit calculation formulas for different universities
- Career guidance and study abroad options
- Application documents and procedures

Always be helpful, accurate, and encouraging. Keep responses concise unless asked for details.
Use bullet points and structured formatting for clarity.
Never make up information - if unsure, direct students to the official university website or UniConnect platform.

Merit Formulas (standard):
- NUST: Matric(10%) + FSc(15%) + NET(75%)
- UET: Matric(10%) + FSc(40%) + ECAT(50%)
- FAST: Matric(10%) + FSc(40%) + Entry Test(50%)
- Medical: Matric(10%) + FSc(40%) + MDCAT(50%)
- GIKI: Matric(10%) + FSc(30%) + GIKI Test(60%)

Key scholarships:
- HEC Ehsaas (need-based, full tuition)
- PEEF (Punjab, up to PKR 100k/year)
- University-specific merit scholarships
"""

async def build_system_prompt():
    try:
        universities = await fetch_university_data()
        programs = await fetch_program_data()
        scholarships = await fetch_scholarship_data()
        admissions = await fetch_admission_data()
        faqs = await fetch_faq_data()
    except Exception as e:
        print(f"[UniConnect Data] DB fetch failed: {e}. Using fallback prompt.")
        return get_fallback_prompt()

    sections = []

    sections.append("""You are UniConnect AI, Pakistan's smartest university admissions assistant built into the UniConnect platform.
You help students discover universities, find scholarships, compare programs, estimate admission chances, and navigate the entire application process.

IMPORTANT RULES:
- Always provide accurate information based on the UniConnect data below
- If asked about something not in the data, say you don't have that specific info and suggest where to find it
- Keep responses concise (under 200 words) unless asked for details
- Use bullet points and structured formatting for clarity
- Be encouraging and supportive to students
- Always mention UniConnect as the platform when relevant
- Never make up data - only use what's provided below""")

    if universities:
        sections.append("\n=== PAKISTANI UNIVERSITIES IN UNICONNECT DATABASE ===")
        for i, u in enumerate(universities[:30], 1):
            type_label = "Public" if u.get('type') == 'PUBLIC' else "Private" if u.get('type') == 'PRIVATE' else "Military"
            ranking = f"Rank #{u['ranking']}" if u.get('ranking') else ""
            featured = " ★ FEATURED" if u.get('isFeatured') else ""
            sections.append(
                f"{i}. {u['name']} ({u.get('city', 'N/A')}, {u.get('province', 'N/A')})"
                f" - {type_label}{featured}"
            )
            if ranking:
                sections[-1] += f", {ranking}"

    if programs:
        sections.append("\n=== AVAILABLE PROGRAMS (Sample) ===")
        by_university = {}
        for p in programs:
            uni = p['university_name']
            if uni not in by_university:
                by_university[uni] = []
            by_university[uni].append(p)
        for uni, progs in list(by_university.items())[:15]:
            sections.append(f"\n{uni}:")
            for p in progs:
                fee = f"PKR {int(p['semesterFee']):,}/semester" if p.get('semesterFee') else "Contact university"
                agg = f"Min {p['minAggregate']}%" if p.get('minAggregate') else "Open merit"
                sections.append(f"  - {p['name']} ({p['degreeLevel']}, {p['field']}) | Fee: {fee} | {agg}")

    if scholarships:
        sections.append("\n=== ACTIVE SCHOLARSHIPS ===")
        for s in scholarships:
            deadline = s['deadline'].strftime('%B %Y') if s.get('deadline') else "Open / rolling"
            amount = f"PKR {int(s['amount']):,}" if s.get('amount') else "Variable"
            cats = []
            if s.get('isMeritBased'): cats.append("Merit-based")
            if s.get('isNeedBased'): cats.append("Need-based")
            cat_str = f" ({', '.join(cats)})" if cats else ""
            sections.append(
                f"- {s['name']} at {s['university_name']}{cat_str}\n"
                f"  Amount: {amount} | Deadline: {deadline}\n"
                f"  Eligibility: {s.get('eligibility') or 'Contact university'}"
            )

    if admissions:
        sections.append("\n=== CURRENT ADMISSION STATUS ===")
        for a in admissions:
            status = a['status'].replace('_', ' ').title()
            close = a['closeDate'].strftime('%B %d, %Y') if a.get('closeDate') else "TBD"
            sections.append(f"- {a['university_name']}: {status} (closes: {close})")

    if faqs:
        sections.append("\n=== FREQUENTLY ASKED QUESTIONS ===")
        for f in faqs[:10]:
            sections.append(f"\nQ: {f['question']}\nA: {f['answer']}")

    sections.append("""
=== MERIT CALCULATION FORMULAS ===
The standard formulas used by top Pakistani universities:

NUST (NET):
  Aggregate = Matric × 10% + FSc × 15% + NET × 75%

UET Lahore / UET Taxila:
  Aggregate = Matric × 10% + FSc × 40% + ECAT × 50%

FAST-NUCES:
  Aggregate = Matric × 10% + FSc × 40% + FAST Entry Test × 50%

COMSATS:
  Aggregate = Matric × 10% + FSc × 40% + Entry Test × 50%

GIKI:
  Aggregate = Matric × 10% + FSc × 30% + GIKI Test × 60%

Medical (all colleges via MDCAT):
  Aggregate = Matric × 10% + FSc × 40% + MDCAT × 50%

NED UET:
  Aggregate = Matric × 10% + FSc × 40% + Entry Test × 50%

University of the Punjab:
  Aggregate = Matric × 10% + FSc × 40% + Entry Test × 50%
  (varies by department)

=== COMMON SCHOLARSHIPS IN PAKISTAN ===
- HEC Ehsaas Undergraduate Scholarship: Need-based, full tuition + PKR 4,000/month stipend
  (Family income below PKR 45,000/month)
- Punjab Educational Endowment Fund (PEEF): Merit + need-based, up to PKR 100,000/year
- Sindh Talent Support Program (STSP): Merit-based, full tuition for BS
- University-specific: Most universities offer their own merit/need scholarships
- Overseas: HEC Overseas Scholarship (MS/PhD), Commonwealth Scholarship, DAAD

=== APPLICATION DOCUMENTS CHECKLIST ===
- CNIC / B-Form
- Matric (SSC) detailed marksheet
- Intermediate (HSSC) detailed marksheet
- Passport-size photographs (4-6 copies)
- Domicile certificate
- Character certificate from previous institution
- Entry test scorecard (NET, ECAT, MDCAT, etc.)

=== QUICK TIPS ===
- Most applications open between May and August
- Apply to 3-5 universities with varying merit requirements (safe, moderate, ambitious)
- Start preparing for entry tests 2-3 months in advance
- Check each university's official website for the most current information
- Use UniConnect to track all your applications and deadlines in one place""")

    return "\n".join(sections)

class ChatRequest(BaseModel):
    message: str
    history: list[dict] | None = None

class ChatResponse(BaseModel):
    reply: str

@app.post("/ai/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        history = request.history or []
        messages = history[-10:] + [{"role": "user", "content": request.message}]
        system_prompt = await get_cached_system_prompt()
        reply = await get_chat_response(
            messages=messages,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=1536,
        )
        return ChatResponse(reply=reply)
    except Exception as e:
        try:
            fallback = get_fallback_prompt()
            reply = await get_chat_response(
                messages=[{"role": "user", "content": request.message}],
                system_prompt=fallback,
                temperature=0.7,
                max_tokens=1024,
            )
            return ChatResponse(reply=reply)
        except Exception as e2:
            raise HTTPException(status_code=500, detail=str(e2))

@app.post("/ai/chat/refresh")
async def refresh_chat_data():
    invalidate_cache()
    await get_cached_system_prompt()
    return {"status": "ok", "message": "Chat data cache refreshed"}

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

@app.post("/ai/merit/predict", response_model=MeritPredictResponse)
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

@app.post("/ai/recommend/universities", response_model=RecommendResponse)
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
                    name="Based on AI Analysis", matchScore=85, reason=reply,
                )
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

@app.post("/ai/sop/generate", response_model=SOPGenerateResponse)
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

@app.post("/ai/resume/generate", response_model=ResumeGenerateResponse)
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

@app.post("/ai/scholarships/recommend", response_model=ScholarshipRecommendResponse)
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
                ScholarshipRecommendation(name="Based on AI Analysis", matchScore=85, reason=reply,)
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

class CareerResponse(BaseModel):
    careerGoal: str
    roadmap: str
    requiredSkills: list[str]
    learningResources: list[str]
    internships: list[str]
    jobTrends: str
    salaryEstimate: str

@app.post("/ai/career/roadmap", response_model=CareerResponse)
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

@app.get("/ai/health")
async def health_check():
    return {"status": "ok", "service": "UniConnect AI API"}
