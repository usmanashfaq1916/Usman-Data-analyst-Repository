import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg();
const prisma = new PrismaClient({ adapter });

function parseSeedSQL(): Array<{
  id: string;
  name: string;
  slug: string;
  province: string;
  city: string;
  type: string;
  websiteUrl: string | null;
  admissionUrl: string | null;
}> {
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

    if (current.length > 0) {
      values.push(current);
    }

    if (values.length >= 11) {
      universities.push({
        id: values[0],
        name: values[1],
        slug: values[2],
        province: values[3],
        city: values[4],
        type: values[5],
        websiteUrl: values[6] || null,
        admissionUrl: values[7] || null,
      });
    }
  }

  return universities;
}

const MAJOR_UNIVERSITIES: Record<
  string,
  Array<{ name: string; degreeLevel: string; field: string; minAggregate: number }>
> = {
  "national-university-of-sciences-and-technology-pakistan": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 70 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 68 },
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 65 },
  ],
  "comsats-university": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 65 },
    { name: "BS Software Engineering", degreeLevel: "BS", field: "Computer Science", minAggregate: 63 },
    { name: "BS Business Administration", degreeLevel: "BS", field: "Business", minAggregate: 60 },
  ],
  "quaid-i-azam-university": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 65 },
    { name: "BS Economics", degreeLevel: "BS", field: "Business", minAggregate: 60 },
    { name: "MS Data Science", degreeLevel: "MS", field: "Computer Science", minAggregate: 55 },
  ],
  "lahore-university-of-management-sciences": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 75 },
    { name: "BSc Accounting & Finance", degreeLevel: "BS", field: "Business", minAggregate: 72 },
    { name: "BS Economics", degreeLevel: "BS", field: "Business", minAggregate: 70 },
  ],
  "national-university-of-computer-and-emerging-sciences": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 70 },
    { name: "BS Artificial Intelligence", degreeLevel: "BS", field: "Computer Science", minAggregate: 72 },
    { name: "BS Software Engineering", degreeLevel: "BS", field: "Computer Science", minAggregate: 68 },
  ],
  "university-of-engineering-and-technology-lahore": [
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 72 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 70 },
    { name: "BS Civil Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 68 },
  ],
  "university-of-the-punjab": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 60 },
    { name: "BS Business Administration", degreeLevel: "BS", field: "Business", minAggregate: 55 },
    { name: "BS Law", degreeLevel: "BS", field: "Law", minAggregate: 58 },
  ],
  "university-of-karachi": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 55 },
    { name: "BS Business Administration", degreeLevel: "BS", field: "Business", minAggregate: 50 },
    { name: "BS Microbiology", degreeLevel: "BS", field: "Medical", minAggregate: 52 },
  ],
  "institute-of-business-administration-karachi": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 72 },
    { name: "BBA", degreeLevel: "BS", field: "Business", minAggregate: 70 },
    { name: "BS Economics", degreeLevel: "BS", field: "Business", minAggregate: 68 },
  ],
  "ghulam-ishaq-khan-institute-of-engineering-sciences-and-technology": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 72 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 70 },
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 68 },
  ],
  "bahria-university": [
    { name: "BS Computer Science", degreeLevel: "BS", field: "Computer Science", minAggregate: 60 },
    { name: "BS Business Administration", degreeLevel: "BS", field: "Business", minAggregate: 55 },
    { name: "BS Psychology", degreeLevel: "BS", field: "Arts", minAggregate: 55 },
  ],
  "ned-university-of-engineering-and-technology": [
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 68 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 66 },
    { name: "BS Civil Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 65 },
  ],
  "aga-khan-university": [
    { name: "MBBS", degreeLevel: "BS", field: "Medical", minAggregate: 80 },
    { name: "BS Nursing", degreeLevel: "BS", field: "Medical", minAggregate: 65 },
    { name: "MS Public Health", degreeLevel: "MS", field: "Medical", minAggregate: 55 },
  ],
  "dow-university-of-health-sciences": [
    { name: "MBBS", degreeLevel: "BS", field: "Medical", minAggregate: 75 },
    { name: "BDS", degreeLevel: "BS", field: "Medical", minAggregate: 72 },
    { name: "BS Nursing", degreeLevel: "BS", field: "Medical", minAggregate: 60 },
  ],
  "university-of-engineering-and-technology-taxila": [
    { name: "BS Mechanical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 65 },
    { name: "BS Electrical Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 63 },
    { name: "BS Civil Engineering", degreeLevel: "BS", field: "Engineering", minAggregate: 62 },
  ],
};

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.admission.deleteMany();
  await prisma.program.deleteMany();
  await prisma.university.deleteMany();

  // Seed universities from seed.sql
  const universities = parseSeedSQL();
  console.log(`Parsed ${universities.length} universities from seed.sql`);

  for (const uni of universities) {
    await prisma.university.create({
      data: {
        id: uni.id,
        name: uni.name,
        slug: uni.slug,
        province: uni.province,
        city: uni.city,
        type: uni.type,
        websiteUrl: uni.websiteUrl || null,
        admissionUrl: uni.admissionUrl || null,
        logoUrl: null,
        ranking: null,
      },
    });
  }
  console.log(`Created ${universities.length} universities`);

  // Seed programs for major universities
  let programCount = 0;
  for (const [slug, programs] of Object.entries(MAJOR_UNIVERSITIES)) {
    const uni = universities.find(
      (u) => u.slug === slug || u.slug.includes(slug),
    );
    if (!uni) {
      console.log(`  Skipping programs for ${slug}: university not found`);
      continue;
    }
    for (const prog of programs) {
      await prisma.program.create({
        data: {
          universityId: uni.id,
          name: prog.name,
          degreeLevel: prog.degreeLevel,
          field: prog.field,
          minAggregate: prog.minAggregate,
        },
      });
      programCount++;
    }
  }
  console.log(`Created ${programCount} programs`);

  // Seed admissions (demo data for the next few months)
  const now = new Date();
  const admissionData = [
    { slug: "national-university-of-sciences-and-technology-pakistan", daysToOpen: -30, daysToClose: 45, status: "open" },
    { slug: "comsats-university", daysToOpen: -20, daysToClose: 30, status: "open" },
    { slug: "quaid-i-azam-university", daysToOpen: -10, daysToClose: 60, status: "open" },
    { slug: "lahore-university-of-management-sciences", daysToOpen: -15, daysToClose: 20, status: "closing_soon" },
    { slug: "national-university-of-computer-and-emerging-sciences", daysToOpen: -5, daysToClose: 55, status: "open" },
    { slug: "university-of-engineering-and-technology-lahore", daysToOpen: 10, daysToClose: 80, status: "upcoming" },
    { slug: "university-of-the-punjab", daysToOpen: 20, daysToClose: 90, status: "upcoming" },
    { slug: "institute-of-business-administration-karachi", daysToOpen: -25, daysToClose: 5, status: "closing_soon" },
    { slug: "ghulam-ishaq-khan-institute-of-engineering-sciences-and-technology", daysToOpen: -60, daysToClose: -10, status: "closed" },
    { slug: "ned-university-of-engineering-and-technology", daysToOpen: -40, daysToClose: 15, status: "closing_soon" },
    { slug: "aga-khan-university", daysToOpen: -50, daysToClose: -5, status: "closed" },
    { slug: "dow-university-of-health-sciences", daysToOpen: -3, daysToClose: 25, status: "open" },
    { slug: "university-of-engineering-and-technology-taxila", daysToOpen: 5, daysToClose: 65, status: "upcoming" },
    { slug: "bahria-university", daysToOpen: -7, daysToClose: 40, status: "open" },
  ];

  let admissionCount = 0;
  for (const ad of admissionData) {
    const uni = universities.find(
      (u) => u.slug === ad.slug || u.slug.includes(ad.slug),
    );
    if (!uni) {
      console.log(`  Skipping admission for ${ad.slug}: university not found`);
      continue;
    }

    const openDate = new Date(now);
    openDate.setDate(openDate.getDate() + ad.daysToOpen);
    const closeDate = new Date(now);
    closeDate.setDate(closeDate.getDate() + ad.daysToClose);

    await prisma.admission.create({
      data: {
        universityId: uni.id,
        programId: null,
        openDate,
        closeDate,
        status: ad.status,
      },
    });
    admissionCount++;
  }
  console.log(`Created ${admissionCount} admission records`);

  console.log("\nSeeding complete!");
  console.log(`  Universities: ${universities.length}`);
  console.log(`  Programs: ${programCount}`);
  console.log(`  Admissions: ${admissionCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
