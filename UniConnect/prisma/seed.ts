import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL!;
const adapter = new PrismaPg(url);
const prisma = new PrismaClient({ adapter });

function parseSeedSQL() {
  const fs = require("fs");
  const path = require("path");
  const seedPath = path.join(__dirname, "..", "seed.sql");
  const lines = fs
    .readFileSync(seedPath, "utf-8")
    .split("\n")
    .filter((l: string) => l.trim().startsWith("INSERT"));

  const universities: Array<{
    id: string;
    name: string;
    slug: string;
    province: string;
    city: string;
    type: string;
    websiteUrl: string | null;
    admissionUrl: string | null;
  }> = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const parenIndex = line.indexOf("VALUES (");
    if (parenIndex === -1) continue;

    const valuesStr = line.substring(parenIndex + 8);
    const trimmed = valuesStr.endsWith(");")
      ? valuesStr.slice(0, -2)
      : valuesStr;

    const values: string[] = [];
    let current = "";
    let inString = false;

    for (let i = 0; i < trimmed.length; i++) {
      const ch = trimmed[i];
      if (ch === "'") {
        if (inString && i + 1 < trimmed.length && trimmed[i + 1] === "'") {
          current += "'";
          i++;
          continue;
        }
        if (inString) {
          values.push(current);
          current = "";
          inString = false;
        } else {
          inString = true;
        }
        continue;
      }
      if (!inString) {
        if (ch === "," || ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
          if (current.length > 0) {
            values.push(current);
            current = "";
          }
          continue;
        }
      }
      current += ch;
    }
    if (current.length > 0) values.push(current);

    if (values.length >= 11) {
      const typeStr = values[5].toUpperCase();
      const uniType = typeStr === "PRIVATE" ? "PRIVATE" : typeStr === "MILITARY" ? "MILITARY" : "PUBLIC";
      universities.push({
        id: values[0],
        name: values[1],
        slug: values[2],
        province: values[3],
        city: values[4],
        type: uniType,
        websiteUrl: values[6] || null,
        admissionUrl: values[7] || null,
      });
    }
  }

  return universities;
}

const PROGRAM_DATA: Record<string, Array<{
  name: string; degreeLevel: string; field: string; slug: string; minAggregate: number; semesterFee?: number; totalSeats?: number; duration?: number
}>> = {
  "national-university-of-sciences-and-technology-pakistan": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 70, semesterFee: 85000, totalSeats: 200, duration: 4 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-electrical-engineering", minAggregate: 68, semesterFee: 82000, totalSeats: 180, duration: 4 },
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-mechanical-engineering", minAggregate: 65, semesterFee: 80000, totalSeats: 150, duration: 4 },
  ],
  "comsats-university": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 65, semesterFee: 72000, totalSeats: 250, duration: 4 },
    { name: "BS Software Engineering", degreeLevel: "BS", field: "Computer Science", slug: "bs-software-engineering", minAggregate: 63, semesterFee: 70000, totalSeats: 200, duration: 4 },
    { name: "BS Business Administration", degreeLevel: "BS", field: "Business", slug: "bs-business-administration", minAggregate: 60, semesterFee: 68000, totalSeats: 180, duration: 4 },
  ],
  "quaid-i-azam-university": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 65, semesterFee: 45000, totalSeats: 150, duration: 4 },
    { name: "BS Economics", degreeLevel: "BS", field: "Business", slug: "bs-economics", minAggregate: 60, semesterFee: 42000, totalSeats: 120, duration: 4 },
    { name: "MS Data Science", degreeLevel: "MS", field: "Computer Science", slug: "ms-data-science", minAggregate: 55, semesterFee: 55000, totalSeats: 60, duration: 2 },
  ],
  "lahore-university-of-management-sciences": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 75, semesterFee: 250000, totalSeats: 100, duration: 4 },
    { name: "BSc Accounting & Finance", degreeLevel: "BS", field: "Business", slug: "bsc-accounting-finance", minAggregate: 72, semesterFee: 240000, totalSeats: 120, duration: 4 },
    { name: "BS Economics", degreeLevel: "BS", field: "Business", slug: "bs-economics", minAggregate: 70, semesterFee: 230000, totalSeats: 80, duration: 4 },
  ],
  "national-university-of-computer-and-emerging-sciences": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 70, semesterFee: 95000, totalSeats: 200, duration: 4 },
    { name: "BS Artificial Intelligence", degreeLevel: "BS", field: "Computer Science", slug: "bs-artificial-intelligence", minAggregate: 72, semesterFee: 100000, totalSeats: 100, duration: 4 },
    { name: "BS Software Engineering", degreeLevel: "BS", field: "Computer Science", slug: "bs-software-engineering", minAggregate: 68, semesterFee: 90000, totalSeats: 150, duration: 4 },
  ],
  "university-of-engineering-and-technology-lahore": [
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-mechanical-engineering", minAggregate: 72, semesterFee: 55000, totalSeats: 200, duration: 4 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-electrical-engineering", minAggregate: 70, semesterFee: 55000, totalSeats: 180, duration: 4 },
    { name: "BS Civil Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-civil-engineering", minAggregate: 68, semesterFee: 52000, totalSeats: 160, duration: 4 },
  ],
  "university-of-the-punjab": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 60, semesterFee: 35000, totalSeats: 300, duration: 4 },
    { name: "BS Business Administration", degreeLevel: "BS", field: "Business", slug: "bs-business-administration", minAggregate: 55, semesterFee: 32000, totalSeats: 250, duration: 4 },
    { name: "BS Law", degreeLevel: "BS", field: "Law", slug: "bs-law", minAggregate: 58, semesterFee: 30000, totalSeats: 150, duration: 5 },
  ],
  "university-of-karachi": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 55, semesterFee: 30000, totalSeats: 200, duration: 4 },
    { name: "BS Business Administration", degreeLevel: "BS", field: "Business", slug: "bs-business-administration", minAggregate: 50, semesterFee: 28000, totalSeats: 200, duration: 4 },
    { name: "BS Microbiology", degreeLevel: "BS", field: "Medical", slug: "bs-microbiology", minAggregate: 52, semesterFee: 25000, totalSeats: 100, duration: 4 },
  ],
  "institute-of-business-administration-karachi": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 72, semesterFee: 180000, totalSeats: 80, duration: 4 },
    { name: "BBA", degreeLevel: "BS", field: "Business", slug: "bba", minAggregate: 70, semesterFee: 170000, totalSeats: 120, duration: 4 },
    { name: "BS Economics", degreeLevel: "BS", field: "Business", slug: "bs-economics", minAggregate: 68, semesterFee: 160000, totalSeats: 60, duration: 4 },
  ],
  "ghulam-ishaq-khan-institute-of-engineering-sciences-and-technology": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 72, semesterFee: 120000, totalSeats: 100, duration: 4 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-electrical-engineering", minAggregate: 70, semesterFee: 115000, totalSeats: 120, duration: 4 },
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-mechanical-engineering", minAggregate: 68, semesterFee: 110000, totalSeats: 100, duration: 4 },
  ],
  "bahria-university": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 60, semesterFee: 65000, totalSeats: 150, duration: 4 },
    { name: "BS Business Administration", degreeLevel: "BS", field: "Business", slug: "bs-business-administration", minAggregate: 55, semesterFee: 60000, totalSeats: 120, duration: 4 },
    { name: "BS Psychology", degreeLevel: "BS", field: "Arts", slug: "bs-psychology", minAggregate: 55, semesterFee: 55000, totalSeats: 80, duration: 4 },
  ],
  "ned-university-of-engineering-and-technology": [
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-mechanical-engineering", minAggregate: 68, semesterFee: 48000, totalSeats: 180, duration: 4 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-electrical-engineering", minAggregate: 66, semesterFee: 48000, totalSeats: 160, duration: 4 },
    { name: "BS Civil Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-civil-engineering", minAggregate: 65, semesterFee: 45000, totalSeats: 140, duration: 4 },
  ],
  "aga-khan-university": [
    { name: "MBBS", degreeLevel: "MBBS", field: "Medical", slug: "mbbs", minAggregate: 80, semesterFee: 500000, totalSeats: 80, duration: 5 },
    { name: "BS Nursing", degreeLevel: "BS", field: "Medical", slug: "bs-nursing", minAggregate: 65, semesterFee: 200000, totalSeats: 60, duration: 4 },
    { name: "MS Public Health", degreeLevel: "MS", field: "Medical", slug: "ms-public-health", minAggregate: 55, semesterFee: 300000, totalSeats: 40, duration: 2 },
  ],
  "dow-university-of-health-sciences": [
    { name: "MBBS", degreeLevel: "MBBS", field: "Medical", slug: "mbbs", minAggregate: 75, semesterFee: 150000, totalSeats: 150, duration: 5 },
    { name: "BDS", degreeLevel: "BDS", field: "Medical", slug: "bds", minAggregate: 72, semesterFee: 120000, totalSeats: 80, duration: 4 },
    { name: "BS Nursing", degreeLevel: "BS", field: "Medical", slug: "bs-nursing", minAggregate: 60, semesterFee: 60000, totalSeats: 100, duration: 4 },
  ],
  "university-of-engineering-and-technology-taxila": [
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-mechanical-engineering", minAggregate: 65, semesterFee: 45000, totalSeats: 150, duration: 4 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-electrical-engineering", minAggregate: 63, semesterFee: 45000, totalSeats: 130, duration: 4 },
    { name: "BS Civil Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-civil-engineering", minAggregate: 62, semesterFee: 42000, totalSeats: 120, duration: 4 },
  ],
  "air-university-islamabad": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 60, semesterFee: 70000, totalSeats: 100, duration: 4 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", slug: "bs-electrical-engineering", minAggregate: 58, semesterFee: 75000, totalSeats: 80, duration: 4 },
  ],
  "international-islamic-university-islamabad": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", slug: "bs-computer-science", minAggregate: 55, semesterFee: 35000, totalSeats: 200, duration: 4 },
    { name: "BS Business Administration", degreeLevel: "BS", field: "Business", slug: "bs-business-administration", minAggregate: 50, semesterFee: 32000, totalSeats: 180, duration: 4 },
  ],
};

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
    content: `## Introduction

Applying to university in Pakistan can feel overwhelming, but with the right preparation, you can navigate the process smoothly.

## Step 1: Choose Your Field

Start by identifying your area of interest. Consider your academic strengths, career goals, and job market trends.

- **Engineering**: For students with strong math and physics backgrounds
- **Medical**: Requires high marks in biology and chemistry
- **Computer Science**: Growing field with excellent job prospects
- **Business**: Versatile degree for corporate careers
- **Arts & Humanities**: For creative and analytical minds

## Step 2: Research Universities

Use UniConnect to compare universities based on:
- Merit requirements (past cutoffs)
- Fee structures
- Location and campus facilities
- Faculty and program reputation

## Step 3: Prepare Your Documents

Get these documents ready early:

1. **CNIC/B-Form**: Computerized National Identity Card or Family Registration Certificate
2. **Educational Certificates**: Matric and Intermediate detailed marksheets
3. **Passport-size Photographs**: Usually 4-6 copies
4. **Domicile Certificate**: Proof of your home province
5. **Character Certificates**: From your previous institution

## Step 4: Track Deadlines

Admission deadlines vary by university. Use the Admission Alerts feature on UniConnect to track opening and closing dates.

## Step 5: Apply Online

Most universities now have online application portals. Fill out the forms carefully and pay the application fee before the deadline.

## Step 6: Prepare for Entry Tests

Start preparing at least 2-3 months before your test. Focus on:
- **NUST / NET**: Mathematics, Physics, Chemistry/Computer Science
- **MDCAT**: Biology, Chemistry, Physics, English
- **ECAT / NAT**: Varies by field

Good luck with your applications!`,
    coverUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    isPublished: true,
  },
  {
    title: "How to Calculate Your Merit for Engineering Programs",
    slug: "how-to-calculate-merit-engineering-programs",
    excerpt: "Learn the exact formula used by top engineering universities like NUST, UET, and GIKI to calculate admission merit.",
    content: `## Understanding Merit Calculation

Each engineering university in Pakistan uses a specific formula to calculate your aggregate score. Here's a breakdown of the most common formulas.

## NUST Merit Formula

**NET-based aggregate:**
- Matric (SSC): **10%**
- Intermediate (HSSC): **15%**
- NET Score: **75%**

### Example Calculation

If you scored:
- Matric: 950/1100 (86.4%)
- FSc: 980/1100 (89.1%)
- NET: 140/200 (70%)

Your aggregate = (86.4 × 0.10) + (89.1 × 0.15) + (70 × 0.75)
= 8.64 + 13.37 + 52.50
= **74.51%**

## UET Merit Formula

- Matric (SSC): **10%**
- Intermediate (HSSC): **40%**
- Entry Test: **50%**

## GIKI Merit Formula

- Matric (SSC): **10%**
- Intermediate (HSSC): **30%**
- Entry Test: **60%**

## Tips to Improve Your Merit

1. **Focus on Intermediate**: It carries significant weight in most formulas
2. **Entry Test Preparation**: Join a test prep academy or use online resources
3. **Apply Strategically**: Apply to universities where your merit aligns with past cutoffs

Use our Merit Calculator on UniConnect to compute your exact aggregate for any university!`,
    coverUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    isPublished: true,
  },
  {
    title: "Top 10 Scholarships for Pakistani Students in 2026",
    slug: "top-10-scholarships-pakistani-students-2026",
    excerpt: "Discover the best scholarship opportunities available for Pakistani students, from need-based aid to fully-funded programs.",
    content: `## Scholarships in Pakistan

Here are the top scholarship opportunities available for Pakistani students in 2026.

## 1. HEC Ehsaas Undergraduate Scholarship

The largest need-based scholarship program in Pakistan, covering full tuition and a monthly stipend for students from low-income backgrounds.

**Coverage**: Full tuition + PKR 4,000 monthly stipend
**Eligibility**: Family income below PKR 45,000/month

## 2. Punjab Educational Endowment Fund (PEEF)

Provides interest-free loans and scholarships to deserving students from Punjab.

**Coverage**: Up to PKR 100,000 per year
**Eligibility**: Merit-based with financial need

## 3. Sindh Talent Support Program (STSP)

A merit-based scholarship for students from Sindh.

**Coverage**: Full tuition for BS programs
**Eligibility**: Top 10% in Intermediate exams

## 4. University-Specific Merit Scholarships

Top universities offer their own merit scholarships:
- **NUST**: Top 5% in NET get 50% fee reduction
- **LUMS**: Need-based financial aid up to 100%
- **AKU**: Financial assistance based on family income

## 5. Overseas Scholarships

- **HEC Overseas Scholarship**: For MS/PhD at top international universities
- **Commonwealth Scholarship**: For postgraduate study in the UK
- **DAAD Scholarship**: For study in Germany

## How to Apply

1. Check eligibility criteria carefully
2. Prepare required documents (income proof, academic transcripts)
3. Submit applications before deadlines
4. Prepare for interviews (if applicable)

Stay updated on new scholarship opportunities through UniConnect!`,
    coverUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80",
    isPublished: true,
  },
  {
    title: "MDCAT 2026: Complete Preparation Guide",
    slug: "mdcat-2026-complete-preparation-guide",
    excerpt: "Everything you need to know about the MDCAT 2026 exam, including syllabus, preparation tips, and test-taking strategies.",
    content: `## MDCAT 2026 Overview

The Medical and Dental College Admission Test (MDCAT) is the mandatory entry test for all medical and dental colleges in Pakistan.

## Exam Structure

- **Total Marks**: 200
- **Duration**: 3.5 hours
- **Format**: Multiple Choice Questions (MCQs)

### Subject Distribution

| Subject | Marks | MCQs |
|---------|-------|------|
| Biology | 80 | 80 |
| Chemistry | 60 | 60 |
| Physics | 40 | 40 |
| English | 20 | 20 |
| **Total** | **200** | **200** |

## Preparation Strategy

### 3 Months Before

- Review your FSc textbooks thoroughly
- Create a study schedule (4-5 hours daily)
- Identify your weak areas

### 1 Month Before

- Solve past papers (last 5 years)
- Take full-length practice tests weekly
- Review mistakes and focus on weak topics

### 1 Week Before

- Light revision only
- Practice time management
- Get adequate sleep

## Key Topics to Focus

**Biology**: Cell biology, genetics, human physiology, evolution
**Chemistry**: Organic chemistry, chemical bonding, electrochemistry
**Physics**: Mechanics, electricity, waves and optics
**English**: Vocabulary, comprehension, grammar

## Test Day Tips

- Reach the test center 1 hour early
- Bring your roll number slip and original CNIC
- Manage your time: spend max 1 minute per MCQ
- Skip difficult questions and return later

Good luck! Use UniConnect to check your aggregate after the results.`,
    coverUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
    isPublished: true,
  },
  {
    title: "Understanding University Degree Levels in Pakistan",
    slug: "understanding-university-degree-levels-pakistan",
    excerpt: "A comprehensive overview of degree levels offered by Pakistani universities, from BS to PhD.",
    content: `## Degree Levels in Pakistan

Pakistani universities offer various degree levels under the HEC's standardized framework.

## Undergraduate Degrees

### BS (Bachelor of Science) / BA (Bachelor of Arts)
- **Duration**: 4 years (8 semesters)
- **Credit Hours**: 130-136
- **Entry Requirements**: Intermediate (FSc/FA) or equivalent
- **Specializations**: Computer Science, Business Administration, Economics, Psychology, etc.

### BBA (Bachelor of Business Administration)
- **Duration**: 4 years
- **Focus**: Business and management skills
- **Entry Requirements**: Intermediate with minimum 50%

### LLB (Bachelor of Laws)
- **Duration**: 5 years
- **Entry Requirements**: Intermediate or equivalent
- **Note**: 5-year program after intermediate (or 3-year after BA/BSc)

### MBBS / BDS (Medical / Dental)
- **Duration**: 5 years (MBBS) / 4 years (BDS)
- **Entry Requirements**: FSc Pre-Medical with minimum 60-70%
- **Entry Test**: MDCAT (mandatory)

## Graduate Degrees

### MS / MPhil (Master of Philosophy)
- **Duration**: 2 years (4 semesters)
- **Credit Hours**: 30 + thesis
- **Entry Requirements**: BS/BA with minimum CGPA 2.5/4.0
- **Note**: Requires a research thesis

### MBA (Master of Business Administration)
- **Duration**: 1.5 to 2 years
- **Entry Requirements**: BS/BA in any discipline
- **Specializations**: Marketing, Finance, HR, Supply Chain

### MA / MSc (Master of Arts / Science)
- **Duration**: 2 years
- **Entry Requirements**: Relevant BS/BA degree
- **Note**: Coursework-based (no thesis usually)

## Doctoral Degrees

### PhD (Doctor of Philosophy)
- **Duration**: 3-5 years
- **Credit Hours**: 18-24 (coursework) + dissertation
- **Entry Requirements**: MS/MPhil with minimum CGPA 3.0/4.0
- **Features**: Original research contribution required

## Choosing the Right Degree

Consider these factors:
- **Career goals**: What profession do you want?
- **Duration**: How many years can you commit?
- **Cost**: Compare tuition across universities
- **Market demand**: Research job prospects

Use UniConnect to explore programs across all degree levels!`,
    coverUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    isPublished: true,
  },
];

async function main() {
  console.log("Seeding database with new schema...\n");

  // 1. Create admin user (upsert so seed is idempotent)
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@uniconnect.pk" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@uniconnect.pk",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`Admin user ready: ${admin.email}`);

  // 2. Seed universities
  const universities = parseSeedSQL();
  console.log(`Parsed ${universities.length} universities`);

  const existingIds = new Set((await prisma.university.findMany({ select: { id: true } })).map((u) => u.id));
  const newUniversities = universities.filter((u) => !existingIds.has(u.id));
  if (newUniversities.length > 0) {
    await prisma.university.createMany({
      data: newUniversities.map((uni) => ({
        id: uni.id,
        name: uni.name,
        slug: uni.slug,
        province: uni.province,
        city: uni.city,
        type: uni.type as any,
        websiteUrl: uni.websiteUrl || null,
        admissionUrl: uni.admissionUrl || null,
        isActive: true,
        isFeatured: false,
      })),
    });
    console.log(`Created ${newUniversities.length} new universities`);
  } else {
    console.log(`All ${universities.length} universities already exist`);
  }

  // 3. Mark featured universities
  const featuredSlugs = [
    "national-university-of-sciences-and-technology-pakistan",
    "comsats-university",
    "quaid-i-azam-university",
    "lahore-university-of-management-sciences",
    "aga-khan-university",
    "ned-university-of-engineering-and-technology",
  ];
  for (const slug of featuredSlugs) {
    await prisma.university.updateMany({
      where: { slug },
      data: { isFeatured: true },
    });
  }
  console.log(`Featured ${featuredSlugs.length} universities`);

  // 4. Seed programs (delete existing first for idempotency)
  await prisma.program.deleteMany();
  let programCount = 0;
  for (const [slug, programs] of Object.entries(PROGRAM_DATA)) {
    const uni = universities.find((u) => u.slug === slug || u.slug.includes(slug));
    if (!uni) {
      console.log(`  Skipping programs for ${slug}: not found`);
      continue;
    }
    for (const prog of programs) {
      await prisma.program.create({
        data: {
          universityId: uni.id,
          name: prog.name,
          slug: prog.slug,
          degreeLevel: prog.degreeLevel as any,
          field: prog.field,
          minAggregate: prog.minAggregate,
          semesterFee: prog.semesterFee,
          totalSeats: prog.totalSeats,
          duration: prog.duration,
          isAvailable: true,
        },
      });
      programCount++;
    }
  }
  console.log(`Created ${programCount} programs`);

  // 5. Seed admissions (delete existing first)
  await prisma.admission.deleteMany();
  const now = new Date();
  const admissionData = [
    { slug: "national-university-of-sciences-and-technology-pakistan", daysToOpen: -30, daysToClose: 45, status: "OPEN" as const },
    { slug: "comsats-university", daysToOpen: -20, daysToClose: 30, status: "OPEN" as const },
    { slug: "quaid-i-azam-university", daysToOpen: -10, daysToClose: 60, status: "OPEN" as const },
    { slug: "lahore-university-of-management-sciences", daysToOpen: -15, daysToClose: 20, status: "CLOSING_SOON" as const },
    { slug: "national-university-of-computer-and-emerging-sciences", daysToOpen: -5, daysToClose: 55, status: "OPEN" as const },
    { slug: "university-of-engineering-and-technology-lahore", daysToOpen: 10, daysToClose: 80, status: "UPCOMING" as const },
    { slug: "university-of-the-punjab", daysToOpen: 20, daysToClose: 90, status: "UPCOMING" as const },
    { slug: "institute-of-business-administration-karachi", daysToOpen: -25, daysToClose: 5, status: "CLOSING_SOON" as const },
    { slug: "ghulam-ishaq-khan-institute-of-engineering-sciences-and-technology", daysToOpen: -60, daysToClose: -10, status: "CLOSED" as const },
    { slug: "ned-university-of-engineering-and-technology", daysToOpen: -40, daysToClose: 15, status: "CLOSING_SOON" as const },
    { slug: "aga-khan-university", daysToOpen: -50, daysToClose: -5, status: "CLOSED" as const },
    { slug: "dow-university-of-health-sciences", daysToOpen: -3, daysToClose: 25, status: "OPEN" as const },
    { slug: "university-of-engineering-and-technology-taxila", daysToOpen: 5, daysToClose: 65, status: "UPCOMING" as const },
    { slug: "bahria-university", daysToOpen: -7, daysToClose: 40, status: "OPEN" as const },
  ];

  let admissionCount = 0;
  for (const ad of admissionData) {
    const uni = universities.find((u) => u.slug === ad.slug || u.slug.includes(ad.slug));
    if (!uni) {
      console.log(`  Skipping admission for ${ad.slug}: not found`);
      continue;
    }
    const openDate = new Date(now);
    openDate.setDate(openDate.getDate() + ad.daysToOpen);
    const closeDate = new Date(now);
    closeDate.setDate(closeDate.getDate() + ad.daysToClose);

    await prisma.admission.create({
      data: {
        universityId: uni.id,
        openDate,
        closeDate,
        status: ad.status,
      },
    });
    admissionCount++;
  }
  console.log(`Created ${admissionCount} admission records`);

  // 6. Seed FAQs (delete existing first for idempotency)
  await prisma.fAQ.deleteMany();
  for (const faq of FAQ_DATA) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`Created ${FAQ_DATA.length} FAQs`);

  // 7. Seed scholarships for featured universities (delete existing first)
  await prisma.scholarship.deleteMany();
  const scholarshipData = [
    { slug: "national-university-of-sciences-and-technology-pakistan", name: "NUST Merit Scholarship", type: "Merit Based", amount: 50000, deadline: new Date(2026, 8, 30), eligibility: "Top 5% in entry test", isMeritBased: true },
    { slug: "national-university-of-sciences-and-technology-pakistan", name: "NUST Financial Assistance", type: "Need Based", amount: 100000, deadline: new Date(2026, 7, 15), eligibility: "Family income below PKR 300,000/year", isNeedBased: true },
    { slug: "comsats-university", name: "COMSATS Merit Scholarship", type: "Merit Based", amount: 40000, deadline: new Date(2026, 8, 31), eligibility: "Top 10% in entry test", isMeritBased: true },
    { slug: "comsats-university", name: "COMSATS Need-Based Support", type: "Need Based", amount: 60000, deadline: new Date(2026, 7, 20), eligibility: "Family income below PKR 400,000/year", isNeedBased: true },
    { slug: "quaid-i-azam-university", name: "QAU Merit Scholarship", type: "Merit Based", amount: 30000, deadline: new Date(2026, 9, 15), eligibility: "CGPA 3.5 or above", isMeritBased: true },
    { slug: "lahore-university-of-management-sciences", name: "LUMS Need-Based Scholarship", type: "Need Based", amount: 500000, deadline: new Date(2026, 6, 15), eligibility: "Family income below PKR 500,000/year", isNeedBased: true },
    { slug: "lahore-university-of-management-sciences", name: "LUMS Merit Award", type: "Merit Based", amount: 250000, deadline: new Date(2026, 6, 30), eligibility: "Top 5% in LUMS admission test", isMeritBased: true },
    { slug: "national-university-of-computer-and-emerging-sciences", name: "FAST Merit Scholarship", type: "Merit Based", amount: 45000, deadline: new Date(2026, 8, 15), eligibility: "Top 5 students in each program", isMeritBased: true },
    { slug: "aga-khan-university", name: "AKU Financial Assistance", type: "Need Based", amount: 800000, deadline: new Date(2026, 5, 30), eligibility: "Demonstrated financial need", isNeedBased: true },
    { slug: "dow-university-of-health-sciences", name: "DUHS Merit Scholarship", type: "Merit Based", amount: 35000, deadline: new Date(2026, 9, 30), eligibility: "Top 3% in annual exams", isMeritBased: true },
    { slug: "ned-university-of-engineering-and-technology", name: "NED Alumni Scholarship", type: "Merit Based", amount: 25000, deadline: new Date(2026, 10, 15), eligibility: "Outstanding academic performance", isMeritBased: true },
  ];

  let scholarshipCount = 0;
  for (const sch of scholarshipData) {
    const uni = universities.find((u) => u.slug === sch.slug || u.slug.includes(sch.slug));
    if (!uni) continue;
    await prisma.scholarship.create({
      data: {
        universityId: uni.id,
        name: sch.name,
        type: sch.type,
        amount: sch.amount,
        deadline: sch.deadline,
        eligibility: sch.eligibility,
        isMeritBased: sch.isMeritBased || false,
        isNeedBased: sch.isNeedBased || false,
        isActive: true,
      },
    });
    scholarshipCount++;
  }
  console.log(`Created ${scholarshipCount} scholarships`);

  // 7b. Seed sample reviews (delete existing first)
  await prisma.review.deleteMany();
  const reviewData = [
    { slug: "national-university-of-sciences-and-technology-pakistan", rating: 5, title: "Excellent Engineering University", content: "NUST is the best engineering university in Pakistan. The campus is beautiful and the faculty is world-class." },
    { slug: "comsats-university", rating: 4, title: "Great IT Programs", content: "COMSATs has excellent computer science programs. Modern labs and experienced teachers." },
    { slug: "quaid-i-azam-university", rating: 5, title: "Top Research University", content: "QAU has the best research environment. The library is amazing and the faculty is very supportive." },
    { slug: "lahore-university-of-management-sciences", rating: 5, title: "World-Class Business School", content: "LUMS provides an excellent learning environment. The campus is state-of-the-art." },
    { slug: "university-of-the-punjab", rating: 4, title: "Historic University", content: "Oldest university in Pakistan. Great for arts and sciences. Affordable fee structure." },
  ];

  for (const rev of reviewData) {
    const uni = universities.find((u) => u.slug === rev.slug || u.slug.includes(rev.slug));
    if (!uni) continue;
    const existingReview = await prisma.review.findFirst({
      where: { userId: admin.id, universityId: uni.id },
    });
    if (!existingReview) {
      await prisma.review.create({
        data: {
          userId: admin.id,
          universityId: uni.id,
          rating: rev.rating,
          title: rev.title,
          content: rev.content,
          isApproved: true,
        },
      });
    }
  }
  console.log(`Created ${reviewData.length} reviews`);

  // 8. Seed blogs (delete existing first for idempotency)
  await prisma.blog.deleteMany();
  let blogCount = 0;
  for (const blog of BLOG_DATA) {
    await prisma.blog.create({
      data: {
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        coverUrl: blog.coverUrl,
        authorId: admin.id,
        isPublished: blog.isPublished,
        publishedAt: blog.isPublished ? new Date() : null,
      },
    });
    blogCount++;
  }
  console.log(`Created ${blogCount} blog posts`);

  // 9. Seed a test student user
  const studentPassword = await bcrypt.hash("student123", 12);
  await prisma.user.upsert({
    where: { email: "student@test.pk" },
    update: {},
    create: {
      name: "Test Student",
      email: "student@test.pk",
      password: studentPassword,
      role: "STUDENT",
      phone: "0300-1234567",
      city: "Lahore",
      province: "Punjab",
      emailVerified: new Date(),
    },
  });
  console.log("Test student created: student@test.pk / student123");

  // 10. Seed sample community questions
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  const studentUser = await prisma.user.findUnique({ where: { email: "student@test.pk" } });
  if (studentUser && universities.length > 0) {
    const nust = universities.find((u) => u.slug.includes("national-university-of-sciences"));
    const lums = universities.find((u) => u.slug.includes("lahore-university-of-management"));
    const fast = universities.find((u) => u.slug.includes("national-university-of-computer"));
    const questions = [
      {
        title: "What is the minimum aggregate for NUST Computer Science?",
        content: "I scored 85% in matric and 78% in FSc. What NET score do I need to get into NUST for BS Computer Science? Also, how is the hostel facility there?",
        tags: "nust,admissions,computer-science",
        authorId: studentUser.id,
        answers: [
          { content: "For NUST CS, you need approximately 70% aggregate. With your scores: Matric (85×10%)=8.5, FSc (78×15%)=11.7, so you need NET score of about 66% (66×75%=49.5) to reach ~70%. The hostels are good - separate for boys/girls with WiFi and mess.", authorId: admin.id, isAccepted: true },
        ],
      },
      {
        title: "How does LUMS financial aid work?",
        content: "I want to apply to LUMS but the fee is very high. Can someone explain how their need-based financial aid works? What documents are required?",
        tags: "lums,financial-aid,scholarships",
        authorId: studentUser.id,
        answers: [
          { content: "LUMS offers need-based financial aid up to 100% tuition waiver. You need to submit: family income certificate, tax returns (last 3 years), property details, and a financial affidavit. Apply early as funds are limited. They also have merit scholarships for top students.", authorId: admin.id, isAccepted: false },
        ],
      },
      {
        title: "FAST vs NUST for Computer Science - which is better?",
        content: "I'm trying to decide between FAST-NUCES and NUST for BS Computer Science. Which one has better faculty, job prospects, and campus life?",
        tags: "fast,nust,computer-science,comparison",
        authorId: studentUser.id,
        answers: [],
      },
    ];
    for (const q of questions) {
      const created = await prisma.question.create({ data: { title: q.title, content: q.content, tags: q.tags, authorId: q.authorId } });
      for (const a of q.answers) {
        await prisma.answer.create({ data: { content: a.content, questionId: created.id, authorId: a.authorId, isAccepted: a.isAccepted } });
      }
    }
    console.log(`Created ${questions.length} sample questions`);
  }

  // Summary
  const totalUniversities = await prisma.university.count();
  const totalPrograms = await prisma.program.count();
  const totalAdmissions = await prisma.admission.count();
  const totalFAQs = await prisma.fAQ.count();
  const totalScholarships = await prisma.scholarship.count();
  const totalBlogs = await prisma.blog.count();

  console.log("\n─── Seeding Complete ───");
  console.log(`  Universities: ${totalUniversities}`);
  console.log(`  Programs:     ${totalPrograms}`);
  console.log(`  Admissions:   ${totalAdmissions}`);
  console.log(`  FAQs:         ${totalFAQs}`);
  console.log(`  Scholarships: ${totalScholarships}`);
  console.log(`  Blogs:        ${totalBlogs}`);
  console.log(`  Admin:        admin@uniconnect.pk / admin123`);
  console.log("────────────────────────\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
