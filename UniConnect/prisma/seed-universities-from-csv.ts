import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const url = process.env.DATABASE_URL!;
const adapter = new PrismaPg(url);
const prisma = new PrismaClient({ adapter });

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function parseBool(val: string): boolean | null {
  const trimmed = val.trim().toUpperCase();
  if (trimmed === "TRUE") return true;
  if (trimmed === "FALSE") return false;
  return null;
}

function parseNullableString(val: string): string | null {
  const trimmed = val.trim();
  if (!trimmed || trimmed === "NULL" || trimmed === '""') return null;
  return trimmed;
}

function parseNullableInt(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed || trimmed === "NULL") return null;
  const num = parseInt(trimmed, 10);
  return isNaN(num) ? null : num;
}

async function main() {
  const csvPath = path.join(__dirname, "..", "University updated list.csv");
  console.log(`Reading CSV: ${csvPath}`);
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim());

  if (lines.length < 2) {
    console.error("CSV has no data rows");
    process.exit(1);
  }

  const headers = parseCSVLine(lines[0]);
  const totalRows = lines.length - 1;
  console.log(`Headers (${headers.length}): ${headers.join(", ")}`);
  console.log(`Data rows: ${totalRows}\n`);

  // Get existing slugs for tracking
  const existingSlugs = new Set(
    (await prisma.university.findMany({ select: { slug: true } })).map((u) => u.slug)
  );
  console.log(`Existing universities in DB: ${existingSlugs.size}`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      console.warn(`Line ${i + 1}: expected ${headers.length} fields, got ${values.length}. Skipping.`);
      errors++;
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx];
    });

    try {
      await prisma.university.upsert({
        where: { slug: row.slug },
        create: {
          id: row.id,
          name: row.name,
          slug: row.slug,
          logoUrl: parseNullableString(row.logoUrl),
          coverUrl: parseNullableString(row.coverUrl),
          description: parseNullableString(row.description),
          province: row.province,
          city: row.city,
          type: (parseNullableString(row.type) || "PUBLIC") as any,
          websiteUrl: parseNullableString(row.websiteUrl),
          admissionUrl: parseNullableString(row.admissionUrl),
          ranking: parseNullableInt(row.ranking),
          establishedYear: parseNullableInt(row.establishedYear),
          phone: parseNullableString(row.phone),
          email: parseNullableString(row.email),
          isFeatured: parseBool(row.isFeatured) ?? false,
          isActive: parseBool(row.isActive) ?? true,
          isHecRecognized: parseBool(row.isHecRecognized) ?? true,
        },
        update: {
          name: row.name,
          logoUrl: parseNullableString(row.logoUrl),
          coverUrl: parseNullableString(row.coverUrl),
          description: parseNullableString(row.description),
          province: row.province,
          city: row.city,
          type: (parseNullableString(row.type) || "PUBLIC") as any,
          websiteUrl: parseNullableString(row.websiteUrl),
          admissionUrl: parseNullableString(row.admissionUrl),
          ranking: parseNullableInt(row.ranking),
          establishedYear: parseNullableInt(row.establishedYear),
          phone: parseNullableString(row.phone),
          email: parseNullableString(row.email),
          isFeatured: parseBool(row.isFeatured) ?? false,
          isActive: parseBool(row.isActive) ?? true,
          isHecRecognized: parseBool(row.isHecRecognized) ?? true,
        },
      });

      if (existingSlugs.has(row.slug)) {
        updated++;
      } else {
        created++;
      }
    } catch (err) {
      console.error(`Error on line ${i + 1} (slug: ${row.slug}):`, err);
      errors++;
    }

    if (i % 100 === 0) {
      console.log(`Progress: ${i}/${totalRows}`);
    }
  }

  const total = await prisma.university.count();
  console.log(`\n─── University Update Complete ───`);
  console.log(`  Created:  ${created}`);
  console.log(`  Updated:  ${updated}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`  Total in DB: ${total}`);
  console.log(`────────────────────────────────\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
