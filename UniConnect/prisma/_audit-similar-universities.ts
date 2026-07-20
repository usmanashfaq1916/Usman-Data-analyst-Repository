import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL!;
const adapter = new PrismaPg(url);
const prisma = new PrismaClient({ adapter });

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;
    }
  }
  return dp[m][n];
}

async function main() {
  const universities = await prisma.university.findMany({
    select: { id: true, name: true, slug: true, websiteUrl: true, city: true, province: true },
    orderBy: { name: "asc" },
  });

  console.log(`Total universities: ${universities.length}\n`);

  // 1. Group by website domain
  console.log("═══ Same-domain duplicates ═══");
  const byDomain = new Map<string, typeof universities>();
  for (const u of universities) {
    const domain = extractDomain(u.websiteUrl);
    if (domain) {
      const list = byDomain.get(domain) || [];
      list.push(u);
      byDomain.set(domain, list);
    }
  }
  let domainDupCount = 0;
  for (const [domain, list] of byDomain) {
    if (list.length > 1) {
      console.log(`\nDomain: ${domain} (${list.length} entries)`);
      for (const u of list) {
        console.log(`  [${u.id}] ${u.name} — ${u.city}, ${u.province} (${u.slug})`);
      }
      domainDupCount++;
    }
  }
  if (domainDupCount === 0) console.log("  No same-domain duplicates found.");

  // 2. Similar names (Levenshtein distance < 5)
  console.log("\n═══ Similar-name pairs ═══");
  const normalized = universities.map((u) => ({ ...u, normalized: normalizeName(u.name) }));
  const checked = new Set<string>();
  let similarCount = 0;
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const a = normalized[i].normalized;
      const b = normalized[j].normalized;
      // Skip if one name is clearly a substring of the other (handled below)
      const dist = levenshtein(a, b);
      if (dist > 0 && dist < 5 && !normalized[i].name.includes(normalized[j].name) && !normalized[j].name.includes(normalized[i].name)) {
        const key = [normalized[i].id, normalized[j].id].sort().join("|");
        if (!checked.has(key)) {
          checked.add(key);
          console.log(`\n  "${normalized[i].name}" (${normalized[i].city})`);
          console.log(`  "${normalized[j].name}" (${normalized[j].city})`);
          console.log(`  Distance: ${dist}`);
          similarCount++;
        }
      }
    }
  }
  if (similarCount === 0) console.log("  No similar-name pairs found (distance < 5).");

  // 3. Name substring / superset relationships (e.g., "X University" vs "X University - City")
  console.log("\n═══ Substring/superset name pairs ═══");
  let substringCount = 0;
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const a = normalized[i].normalized;
      const b = normalized[j].normalized;
      if (a !== b && (a.includes(b) || b.includes(a))) {
        const shorter = a.length <= b.length ? normalized[i] : normalized[j];
        const longer = a.length > b.length ? normalized[i] : normalized[j];
        console.log(`\n  "${shorter.name}" (${shorter.city}, ${shorter.province})`);
        console.log(`  "${longer.name}" (${longer.city}, ${longer.province})`);
        substringCount++;
      }
    }
  }
  if (substringCount === 0) console.log("  No substring/superset name pairs found.");

  console.log(`\n─── Summary ───`);
  console.log(`  Same-domain groups: ${domainDupCount}`);
  console.log(`  Similar-name pairs (distance < 5): ${similarCount}`);
  console.log(`  Substring/superset pairs: ${substringCount}`);
  console.log(`────────────────\n`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
