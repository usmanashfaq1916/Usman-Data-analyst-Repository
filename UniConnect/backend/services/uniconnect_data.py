import os
import asyncio
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


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
