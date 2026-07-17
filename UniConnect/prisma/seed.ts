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
  { question: "How do I apply for admission?", answer: "Each university has its own application process. Visit the university's admission page or website for specific instructions.", category: "admissions", order: 1 },
  { question: "What is the merit calculator?", answer: "The merit calculator helps you compute your aggregate score based on your matric, intermediate, and entry test marks.", category: "merit", order: 1 },
  { question: "How is aggregate calculated for engineering?", answer: "Engineering aggregate = (Matric × 10%) + (Intermediate × 40%) + (Entry Test × 50%).", category: "merit", order: 2 },
  { question: "How is aggregate calculated for medical?", answer: "Medical aggregate = (Matric × 10%) + (Intermediate × 40%) + (MDCAT × 50%).", category: "merit", order: 3 },
  { question: "Can I apply to multiple universities?", answer: "Yes, you can apply to as many universities as you like. Each application is processed independently.", category: "admissions", order: 2 },
  { question: "What documents are required for admission?", answer: "Typically: CNIC/B-Form, Matric certificate, Intermediate certificate, passport-sized photos, and domicile certificate.", category: "admissions", order: 3 },
];

async function main() {
  console.log("Seeding database with new schema...\n");

  // 1. Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@uniconnect.pk",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Seed universities
  const universities = parseSeedSQL();
  console.log(`Parsed ${universities.length} universities`);

  for (const uni of universities) {
    await prisma.university.create({
      data: {
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
      },
    });
  }
  console.log(`Created ${universities.length} universities`);

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

  // 4. Seed programs
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

  // 5. Seed admissions
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

  // 6. Seed FAQs
  for (const faq of FAQ_DATA) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`Created ${FAQ_DATA.length} FAQs`);

  // 7. Seed scholarships for featured universities
  const scholarshipData = [
    { slug: "national-university-of-sciences-and-technology-pakistan", name: "NUST Merit Scholarship", type: "Merit Based", amount: 50000, deadline: new Date(2026, 8, 30), eligibility: "Top 5% in entry test" },
    { slug: "lahore-university-of-management-sciences", name: "LUMS Need-Based Scholarship", type: "Need Based", amount: 500000, deadline: new Date(2026, 6, 15), eligibility: "Family income below PKR 500,000/year" },
    { slug: "aga-khan-university", name: "AKU Financial Assistance", type: "Need Based", amount: 800000, deadline: new Date(2026, 5, 30), eligibility: "Demonstrated financial need" },
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
        isActive: true,
      },
    });
    scholarshipCount++;
  }
  console.log(`Created ${scholarshipCount} scholarships`);

  // Summary
  const totalUniversities = await prisma.university.count();
  const totalPrograms = await prisma.program.count();
  const totalAdmissions = await prisma.admission.count();
  const totalFAQs = await prisma.fAQ.count();
  const totalScholarships = await prisma.scholarship.count();

  console.log("\n─── Seeding Complete ───");
  console.log(`  Universities: ${totalUniversities}`);
  console.log(`  Programs:     ${totalPrograms}`);
  console.log(`  Admissions:   ${totalAdmissions}`);
  console.log(`  FAQs:         ${totalFAQs}`);
  console.log(`  Scholarships: ${totalScholarships}`);
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
