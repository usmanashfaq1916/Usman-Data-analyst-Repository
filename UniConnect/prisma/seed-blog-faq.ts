import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL!;
const adapter = new PrismaPg(url);
const prisma = new PrismaClient({ adapter });

const FAQ_DATA = [
  { question: "How do I apply for admission?", answer: "Each university has its own application process. Visit the university's admission page or website for specific instructions. Most universities now accept online applications through their official portals.", category: "Admissions", order: 1 },
  { question: "Can I apply to multiple universities?", answer: "Yes, you can apply to as many universities as you like. Each application is processed independently. Just make sure to track each university's deadline and requirements separately.", category: "Admissions", order: 2 },
  { question: "What documents are required for admission?", answer: "Typically: CNIC/B-Form, Matric certificate, Intermediate certificate, passport-sized photos, domicile certificate, and character certificates from previous institutions.", category: "Documents", order: 1 },
  { question: "Do I need to submit attested copies of my documents?", answer: "Yes, most universities require attested copies of your educational documents. Get them attested from a Grade 17 officer or your institution's principal.", category: "Documents", order: 2 },
  { question: "What is the merit calculator?", answer: "The merit calculator helps you compute your aggregate score based on your matric, intermediate, and entry test marks. Use our calculator at UniConnect to estimate your merit for different programs.", category: "Merit & Entry Tests", order: 1 },
  { question: "How is aggregate calculated for engineering?", answer: "Engineering aggregate = (Matric × 10%) + (Intermediate × 40%) + (Entry Test × 50%). Different universities may use slightly different weightings.", category: "Merit & Entry Tests", order: 2 },
  { question: "How is aggregate calculated for medical?", answer: "Medical aggregate = (Matric × 10%) + (Intermediate × 40%) + (MDCAT × 50%). The MDCAT is conducted by PMC and is mandatory for all medical colleges.", category: "Merit & Entry Tests", order: 3 },
  { question: "What scholarships are available for university students?", answer: "Scholarships include merit-based, need-based, sports scholarships, and HEC's Ehsaas program. Check each university's scholarship page for specific opportunities.", category: "Scholarships", order: 1 },
  { question: "How do I apply for a need-based scholarship?", answer: "Need-based scholarships require proof of family income, tax returns, and a financial affidavit. Submit these alongside your scholarship application before the deadline.", category: "Scholarships", order: 2 },
  { question: "What is the difference between public and private universities?", answer: "Public universities are government-funded with lower fees but competitive merit. Private universities have higher fees but often offer more flexible admission criteria and modern facilities.", category: "General", order: 1 },
];

const BLOG_DATA = [
  {
    title: "Complete Guide to University Admissions in Pakistan (2026)",
    slug: "complete-guide-university-admissions-pakistan-2026",
    excerpt: "Everything you need to know about applying to Pakistani universities, from choosing the right program to tracking deadlines.",
    content: `## Introduction\n\nApplying to university in Pakistan can feel overwhelming, but with the right preparation, you can navigate the process smoothly.\n\n## Step 1: Choose Your Field\n\nStart by identifying your area of interest. Consider your academic strengths, career goals, and job market trends.\n\n- **Engineering**: For students with strong math and physics backgrounds\n- **Medical**: Requires high marks in biology and chemistry\n- **Computer Science**: Growing field with excellent job prospects\n- **Business**: Versatile degree for corporate careers\n- **Arts & Humanities**: For creative and analytical minds\n\n## Step 2: Research Universities\n\nUse UniConnect to compare universities based on:\n- Merit requirements (past cutoffs)\n- Fee structures\n- Location and campus facilities\n- Faculty and program reputation\n\n## Step 3: Prepare Your Documents\n\nGet these documents ready early:\n\n1. **CNIC/B-Form**: Computerized National Identity Card or Family Registration Certificate\n2. **Educational Certificates**: Matric and Intermediate detailed marksheets\n3. **Passport-size Photographs**: Usually 4-6 copies\n4. **Domicile Certificate**: Proof of your home province\n5. **Character Certificates**: From your previous institution\n\n## Step 4: Track Deadlines\n\nAdmission deadlines vary by university. Use the Admission Alerts feature on UniConnect to track opening and closing dates.\n\n## Step 5: Apply Online\n\nMost universities now have online application portals. Fill out the forms carefully and pay the application fee before the deadline.\n\n## Step 6: Prepare for Entry Tests\n\nStart preparing at least 2-3 months before your test. Focus on:\n- **NUST / NET**: Mathematics, Physics, Chemistry/Computer Science\n- **MDCAT**: Biology, Chemistry, Physics, English\n- **ECAT / NAT**: Varies by field\n\nGood luck with your applications!`,
    coverUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  },
  {
    title: "How to Calculate Your Merit for Engineering Programs",
    slug: "how-to-calculate-merit-engineering-programs",
    excerpt: "Learn the exact formula used by top engineering universities like NUST, UET, and GIKI to calculate admission merit.",
    content: `## Understanding Merit Calculation\n\nEach engineering university in Pakistan uses a specific formula to calculate your aggregate score.\n\n## NUST Merit Formula\n\n**NET-based aggregate:**\n- Matric (SSC): **10%**\n- Intermediate (HSSC): **15%**\n- NET Score: **75%**\n\n### Example Calculation\n\nIf you scored:\n- Matric: 950/1100 (86.4%)\n- FSc: 980/1100 (89.1%)\n- NET: 140/200 (70%)\n\nYour aggregate = (86.4 × 0.10) + (89.1 × 0.15) + (70 × 0.75)\n= 8.64 + 13.37 + 52.50 = **74.51%**\n\n## UET Merit Formula\n\n- Matric (SSC): **10%**\n- Intermediate (HSSC): **40%**\n- Entry Test: **50%**\n\n## GIKI Merit Formula\n\n- Matric (SSC): **10%**\n- Intermediate (HSSC): **30%**\n- Entry Test: **60%**\n\n## Tips to Improve Your Merit\n\n1. **Focus on Intermediate**: It carries significant weight in most formulas\n2. **Entry Test Preparation**: Join a test prep academy or use online resources\n3. **Apply Strategically**: Apply to universities where your merit aligns with past cutoffs\n\nUse our Merit Calculator on UniConnect to compute your exact aggregate for any university!`,
    coverUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  },
  {
    title: "Top 10 Scholarships for Pakistani Students in 2026",
    slug: "top-10-scholarships-pakistani-students-2026",
    excerpt: "Discover the best scholarship opportunities available for Pakistani students, from need-based aid to fully-funded programs.",
    content: `## Scholarships in Pakistan\n\nHere are the top scholarship opportunities available for Pakistani students in 2026.\n\n## 1. HEC Ehsaas Undergraduate Scholarship\n\nThe largest need-based scholarship program in Pakistan, covering full tuition and a monthly stipend.\n\n**Coverage**: Full tuition + PKR 4,000 monthly stipend\n**Eligibility**: Family income below PKR 45,000/month\n\n## 2. Punjab Educational Endowment Fund (PEEF)\n\nProvides interest-free loans and scholarships to deserving students from Punjab.\n\n**Coverage**: Up to PKR 100,000 per year\n**Eligibility**: Merit-based with financial need\n\n## 3. Sindh Talent Support Program (STSP)\n\nA merit-based scholarship for students from Sindh.\n\n**Coverage**: Full tuition for BS programs\n**Eligibility**: Top 10% in Intermediate exams\n\n## 4. University-Specific Merit Scholarships\n\nTop universities offer their own merit scholarships:\n- **NUST**: Top 5% in NET get 50% fee reduction\n- **LUMS**: Need-based financial aid up to 100%\n- **AKU**: Financial assistance based on family income\n\n## 5. Overseas Scholarships\n\n- **HEC Overseas Scholarship**: For MS/PhD at top international universities\n- **Commonwealth Scholarship**: For postgraduate study in the UK\n- **DAAD Scholarship**: For study in Germany\n\n## How to Apply\n\n1. Check eligibility criteria carefully\n2. Prepare required documents (income proof, academic transcripts)\n3. Submit applications before deadlines\n4. Prepare for interviews (if applicable)`,
    coverUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80",
  },
  {
    title: "MDCAT 2026: Complete Preparation Guide",
    slug: "mdcat-2026-complete-preparation-guide",
    excerpt: "Everything you need to know about the MDCAT 2026 exam, including syllabus, preparation tips, and test-taking strategies.",
    content: `## MDCAT 2026 Overview\n\nThe Medical and Dental College Admission Test (MDCAT) is the mandatory entry test for all medical and dental colleges in Pakistan.\n\n## Exam Structure\n\n- **Total Marks**: 200\n- **Duration**: 3.5 hours\n- **Format**: Multiple Choice Questions (MCQs)\n\n### Subject Distribution\n\n| Subject | Marks | MCQs |\n|---------|-------|------|\n| Biology | 80 | 80 |\n| Chemistry | 60 | 60 |\n| Physics | 40 | 40 |\n| English | 20 | 20 |\n| **Total** | **200** | **200** |\n\n## Preparation Strategy\n\n### 3 Months Before\n- Review your FSc textbooks thoroughly\n- Create a study schedule (4-5 hours daily)\n- Identify your weak areas\n\n### 1 Month Before\n- Solve past papers (last 5 years)\n- Take full-length practice tests weekly\n- Review mistakes and focus on weak topics\n\n### 1 Week Before\n- Light revision only\n- Practice time management\n- Get adequate sleep\n\n## Key Topics to Focus\n\n**Biology**: Cell biology, genetics, human physiology, evolution\n**Chemistry**: Organic chemistry, chemical bonding, electrochemistry\n**Physics**: Mechanics, electricity, waves and optics\n**English**: Vocabulary, comprehension, grammar\n\n## Test Day Tips\n\n- Reach the test center 1 hour early\n- Bring your roll number slip and original CNIC\n- Manage your time: spend max 1 minute per MCQ\n- Skip difficult questions and return later`,
    coverUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
  },
  {
    title: "Understanding University Degree Levels in Pakistan",
    slug: "understanding-university-degree-levels-pakistan",
    excerpt: "A comprehensive overview of degree levels offered by Pakistani universities, from BS to PhD.",
    content: `## Degree Levels in Pakistan\n\nPakistani universities offer various degree levels under the HEC's standardized framework.\n\n## Undergraduate Degrees\n\n### BS (Bachelor of Science) / BA (Bachelor of Arts)\n- **Duration**: 4 years (8 semesters)\n- **Credit Hours**: 130-136\n- **Entry Requirements**: Intermediate (FSc/FA) or equivalent\n\n### BBA (Bachelor of Business Administration)\n- **Duration**: 4 years\n- **Focus**: Business and management skills\n- **Entry Requirements**: Intermediate with minimum 50%\n\n### LLB (Bachelor of Laws)\n- **Duration**: 5 years\n- **Entry Requirements**: Intermediate or equivalent\n\n### MBBS / BDS (Medical / Dental)\n- **Duration**: 5 years (MBBS) / 4 years (BDS)\n- **Entry Requirements**: FSc Pre-Medical with minimum 60-70%\n- **Entry Test**: MDCAT (mandatory)\n\n## Graduate Degrees\n\n### MS / MPhil (Master of Philosophy)\n- **Duration**: 2 years (4 semesters)\n- **Credit Hours**: 30 + thesis\n- **Entry Requirements**: BS/BA with minimum CGPA 2.5/4.0\n\n### MBA (Master of Business Administration)\n- **Duration**: 1.5 to 2 years\n- **Entry Requirements**: BS/BA in any discipline\n\n### MA / MSc (Master of Arts / Science)\n- **Duration**: 2 years\n- **Entry Requirements**: Relevant BS/BA degree\n\n## Doctoral Degrees\n\n### PhD (Doctor of Philosophy)\n- **Duration**: 3-5 years\n- **Credit Hours**: 18-24 (coursework) + dissertation\n- **Entry Requirements**: MS/MPhil with minimum CGPA 3.0/4.0\n\n## Choosing the Right Degree\n\nConsider these factors:\n- **Career goals**: What profession do you want?\n- **Duration**: How many years can you commit?\n- **Cost**: Compare tuition across universities\n- **Market demand**: Research job prospects\n\nUse UniConnect to explore programs across all degree levels!`,
    coverUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  },
];

async function main() {
  console.log("Seeding blogs and FAQs...\n");

  // Get admin user
  const admin = await prisma.user.findUnique({ where: { email: "admin@uniconnect.pk" } });
  if (!admin) {
    console.error("Admin user not found. Run the main seed first.");
    process.exit(1);
  }

  // Clear and re-seed FAQs
  await prisma.fAQ.deleteMany();
  for (const faq of FAQ_DATA) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`Created ${FAQ_DATA.length} FAQs`);

  // Clear and re-seed blogs
  await prisma.blog.deleteMany();
  for (const blog of BLOG_DATA) {
    await prisma.blog.create({
      data: {
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        coverUrl: blog.coverUrl,
        authorId: admin.id,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`Created ${BLOG_DATA.length} blog posts`);

  console.log("\nDone!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
