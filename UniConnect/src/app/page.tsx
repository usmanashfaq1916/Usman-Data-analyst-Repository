import { prisma } from "@/lib/db";
import { SearchBar } from "@/components/search-bar";
import { AdmissionTicker } from "@/components/ticker";
import { UniversityCard } from "@/components/university-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const universities = await prisma.university.findMany({
    take: 6,
    orderBy: { name: "asc" },
    include: { _count: { select: { programs: true } } },
  });

  const admissions = await prisma.admission.findMany({
    where: { status: { in: ["OPEN", "CLOSING_SOON"] } },
    orderBy: { closeDate: "asc" },
    take: 5,
    include: { university: true },
  });

  const tickerItems = admissions.map((a) => {
    const now = new Date();
    const diff = a.closeDate.getTime() - now.getTime();
    return {
      slug: a.university.slug,
      name: a.university.name,
      closeDate: a.closeDate,
      daysLeft: Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))),
    };
  });

  const totalUniversities = await prisma.university.count();

  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center gap-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
          One Portal.
          <br />
          <span className="text-secondary">Every Pakistani University.</span>
        </h1>
        <p className="max-w-xl text-lg text-gray-600">
          Search universities and programs, calculate your admission merit, and
          track deadlines — all from one place.
        </p>
        <SearchBar />
        <p className="text-sm text-gray-500">
          {totalUniversities} universities across Pakistan
        </p>
      </section>

      {tickerItems.length > 0 && <AdmissionTicker admissions={tickerItems} />}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">
            Featured Universities
          </h2>
          <a
            href="/universities"
            className="text-sm font-medium text-secondary hover:underline"
          >
            View all &rarr;
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni, i) => (
            <UniversityCard
              key={uni.id}
              university={{
                ...uni,
                programCount: uni._count.programs,
              }}
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
