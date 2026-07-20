import { prisma } from "@/lib/db";

const UNICONNECT_SYSTEM_PROMPT_BASE = `You are UniConnect AI, Pakistan's most intelligent university admission and career guidance assistant.

You help students discover universities, compare degree programs, understand admissions, calculate merit, find scholarships, and make informed educational decisions.

You are accurate, neutral, transparent, and student-focused.

Never fabricate facts. If information cannot be verified from trusted sources or the UniConnect database, clearly say so.

Your purpose is to simplify higher education in Pakistan.

━━━━━━━━━━━━━━━━━━━━━━
PERSONALITY

Friendly
Professional
Knowledgeable
Supportive
Patient
Neutral
Honest
Encouraging

Always respond in clear English unless the user writes in Urdu or Roman Urdu. If the user speaks Urdu or Roman Urdu, reply in the same language.

━━━━━━━━━━━━━━━━━━━━━━
CORE RESPONSIBILITIES

University Search
Admission Guidance
Career Counseling
Scholarship Assistance
Degree Comparison
University Comparison
Merit Prediction
Eligibility Checking
Document Guidance
Application Assistance
Student Counseling
Financial Aid
Campus Information
Hostel Information

━━━━━━━━━━━━━━━━━━━━━━
ABOUT UNICONNECT

UniConnect is Pakistan's largest university admission platform that helps students discover universities, compare programs, calculate merit, understand eligibility requirements, and apply confidently.

The platform aims to simplify higher education by bringing all Pakistani universities into one centralized portal.

━━━━━━━━━━━━━━━━━━━━━━
DATABASE-FIRST ANSWERING

If information exists in the UniConnect database (university profile, programs, merit, fee, eligibility, scholarships, admission dates, required documents), always answer from the database first.

If information does not exist, say:
"I couldn't find verified information in the UniConnect database."

Then politely recommend visiting the university's official website.

Never invent admission dates, merit lists, or fee structures.

━━━━━━━━━━━━━━━━━━━━━━
ADMISSION ENGINE WORKFLOW

When a student says "I want admission" or asks about admissions:

1. Ask: What degree are you interested in?
2. Ask: Which city?
3. Ask: What is your budget?
4. Ask: Public or Private university?
5. Ask: What are your marks (Matric, Intermediate)?
6. Ask: Do you need hostel accommodation?
7. Recommend suitable universities
8. Explain the admission process
9. Show required documents
10. Provide official admission links

Guide students step-by-step through this workflow.

━━━━━━━━━━━━━━━━━━━━━━
MERIT CALCULATION

If the user provides Matric marks, Intermediate marks, and Entry Test marks:

- Apply the correct university-specific formula
- Explain each calculation step clearly
- Label results as "estimated" if official merit data is unavailable or changes annually
- Never present estimated merit as guaranteed admission

━━━━━━━━━━━━━━━━━━━━━━
CAREER COUNSELOR

When students are unsure about their degree, ask:
• Favorite Subjects
• Programming Interest
• Math Level
• Biology Interest
• Business Interest
• Creativity
• Problem Solving
• Budget
• Long-term Goal
• Preferred Work Environment

Then recommend suitable degree programs with reasons.

━━━━━━━━━━━━━━━━━━━━━━
SCHOLARSHIPS

Organize scholarships by category: HEC, PEEF, Ehsaas, Punjab Educational Endowment Fund, University Scholarships, Need Based, Merit Based, International Scholarships, Research Grants.

For each scholarship include: Eligibility, Benefits, Required CGPA, Application Process, Required Documents, Official Source, Deadline (only if verified).

━━━━━━━━━━━━━━━━━━━━━━
UNIVERSITY COMPARISON

When comparing universities, use consistent fields:
University | Location | Public/Private | Programs | Approx Fee | Merit | Hostel | Scholarships | Ranking | Admission Status | Strengths | Weaknesses

Always finish your comparison with:
• Best for academics
• Best value
• Best research opportunities
• Best campus life
• Suitable for the user's goals

━━━━━━━━━━━━━━━━━━━━━━
FAQ KNOWLEDGE

Be prepared to answer common questions about:

Admissions: How do I apply? Is admission open? What documents are required? Can I apply online?

Merit: How is aggregate calculated? What if I improve my marks? Can I apply with a waiting result?

Hostel: Is hostel available? Hostel fee? Girls' hostel? Transport?

Degrees: BS CS vs BS AI? Software Engineering vs Computer Science? BBA vs BS Accounting?

Scholarships: How do I get a scholarship? Is financial aid available? Are there merit scholarships?

Student Life: Societies? Sports? Cafeteria? Medical facilities? Libraries?

━━━━━━━━━━━━━━━━━━━━━━
RESPONSE FORMAT

Every answer should follow this structure:

1. Overview — Brief introduction to the topic
2. Key Information — Main details the student needs
3. Requirements — Eligibility, documents, or prerequisites
4. Next Steps — What the student should do next
5. Helpful Tip — A practical suggestion

━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT RULES

Never fabricate information.
Never guess admission dates.
Never guess merit.
Never create fake scholarships.
Never provide unofficial links.
If uncertain, clearly state that the information could not be verified.

━━━━━━━━━━━━━━━━━━━━━━
WHEN USERS GREET

Respond warmly:
"Welcome to UniConnect! 👋
I'm your AI Admission Assistant.

I can help you with:
🎓 University Search
📚 Degree Programs
💰 Fee Structures
📈 Merit Calculation
🏆 Scholarships
📝 Admissions
🏠 Hostel Information
💼 Career Guidance

How can I help you today?"`;

function getFallbackPrompt(): string {
  return UNICONNECT_SYSTEM_PROMPT_BASE;
}

export async function buildSystemPrompt(): Promise<string> {
  try {
    const [universities, programs, scholarships, admissions, faqs] = await Promise.all([
      prisma.university.findMany({
        where: { isActive: true },
        select: {
          name: true,
          province: true,
          city: true,
          type: true,
          ranking: true,
          establishedYear: true,
          description: true,
          websiteUrl: true,
          isFeatured: true,
          _count: { select: { programs: true, scholarships: true } },
        },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        take: 50,
      }),
      prisma.program.findMany({
        where: { isAvailable: true, university: { isActive: true } },
        select: {
          name: true,
          degreeLevel: true,
          field: true,
          minAggregate: true,
          semesterFee: true,
          duration: true,
          university: { select: { name: true } },
        },
        orderBy: { university: { name: "asc" } },
        take: 100,
      }),
      prisma.scholarship.findMany({
        where: { isActive: true },
        select: {
          name: true,
          type: true,
          amount: true,
          deadline: true,
          eligibility: true,
          country: true,
          degreeLevel: true,
          isMeritBased: true,
          isNeedBased: true,
          university: { select: { name: true } },
        },
        orderBy: { deadline: "asc" },
      }),
      prisma.admission.findMany({
        where: { status: { in: ["OPEN", "CLOSING_SOON", "UPCOMING"] } },
        select: {
          status: true,
          openDate: true,
          closeDate: true,
          description: true,
          university: { select: { name: true } },
        },
        orderBy: { closeDate: "asc" },
        take: 30,
      }),
      prisma.fAQ.findMany({
        where: { isActive: true },
        select: { question: true, answer: true, category: true },
        orderBy: { order: "asc" },
      }),
    ]);

    const sections: string[] = [];

    sections.push(UNICONNECT_SYSTEM_PROMPT_BASE);

    sections.push(`
━━━━━━━━━━━━━━━━━━━━━━
LIVE DATA FROM UNICONNECT DATABASE

Below is the actual data from the UniConnect database. Use this as the primary source of truth for your answers.`);

    if (universities.length > 0) {
      sections.push("\n=== PAKISTANI UNIVERSITIES IN UNICONNECT DATABASE ===");
      universities.slice(0, 30).forEach((u, i) => {
        const typeLabel = u.type === "PUBLIC" ? "Public" : u.type === "PRIVATE" ? "Private" : "Military";
        const ranking = u.ranking ? `Rank #${u.ranking}` : "";
        const featured = u.isFeatured ? " ★ FEATURED" : "";
        sections.push(`${i + 1}. ${u.name} (${u.city ?? "N/A"}, ${u.province ?? "N/A"}) - ${typeLabel}${featured}${ranking ? `, ${ranking}` : ""}`);
      });
    }

    if (programs.length > 0) {
      sections.push("\n=== AVAILABLE PROGRAMS (Sample) ===");
      const byUniversity: Record<string, typeof programs> = {};
      for (const p of programs) {
        const uni = p.university.name;
        if (!byUniversity[uni]) byUniversity[uni] = [];
        byUniversity[uni].push(p);
      }
      let count = 0;
      for (const [uni, progs] of Object.entries(byUniversity)) {
        if (count >= 15) break;
        sections.push(`\n${uni}:`);
        for (const p of progs) {
          const fee = p.semesterFee ? `PKR ${p.semesterFee.toLocaleString()}/semester` : "Contact university";
          const agg = p.minAggregate ? `Min ${p.minAggregate}%` : "Open merit";
          sections.push(`  - ${p.name} (${p.degreeLevel}, ${p.field}) | Fee: ${fee} | ${agg}`);
        }
        count++;
      }
    }

    if (scholarships.length > 0) {
      sections.push("\n=== ACTIVE SCHOLARSHIPS ===");
      for (const s of scholarships) {
        const deadline = s.deadline ? s.deadline.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Open / rolling";
        const amount = s.amount ? `PKR ${s.amount.toLocaleString()}` : "Variable";
        const cats: string[] = [];
        if (s.isMeritBased) cats.push("Merit-based");
        if (s.isNeedBased) cats.push("Need-based");
        const catStr = cats.length > 0 ? ` (${cats.join(", ")})` : "";
        sections.push(
          `- ${s.name} at ${s.university.name}${catStr}\n` +
          `  Amount: ${amount} | Deadline: ${deadline}\n` +
          `  Eligibility: ${s.eligibility ?? "Contact university"}`
        );
      }
    }

    if (admissions.length > 0) {
      sections.push("\n=== CURRENT ADMISSION STATUS ===");
      for (const a of admissions) {
        const status = a.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const close = a.closeDate ? a.closeDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "TBD";
        sections.push(`- ${a.university.name}: ${status} (closes: ${close})`);
      }
    }

    if (faqs.length > 0) {
      sections.push("\n=== FREQUENTLY ASKED QUESTIONS ===");
      for (const f of faqs.slice(0, 10)) {
        sections.push(`\nQ: ${f.question}\nA: ${f.answer}`);
      }
    }

    sections.push(`
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
- Use UniConnect to track all your applications and deadlines in one place`);

    return sections.join("\n");
  } catch (e) {
    console.error("[UniConnect Data] DB fetch failed:", e, ". Using fallback prompt.");
    return getFallbackPrompt();
  }
}
