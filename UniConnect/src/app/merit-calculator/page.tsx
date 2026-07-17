import { prisma } from "@/lib/db";
import { MeritForm } from "./MeritForm";

export const dynamic = "force-dynamic";

export default async function MeritCalculatorPage() {
  const programs = await prisma.program.findMany({
    where: { minAggregate: { not: null } },
    include: { university: { select: { name: true, slug: true } } },
    orderBy: { minAggregate: "desc" },
  });

  const universities = programs
    .filter((p) => p.minAggregate !== null)
    .map((p) => ({
      name: p.university.name,
      slug: p.university.slug,
      program: p.name,
      minAggregate: p.minAggregate!,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Merit Calculator</h1>
        <p className="mt-1 text-gray-600">
          Calculate your aggregate and see which programs you qualify for.
        </p>
      </div>

      <MeritForm universities={universities} />
    </div>
  );
}
