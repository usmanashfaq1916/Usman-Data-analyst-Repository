import { prisma } from "@/lib/db";
import { UniversityCard } from "@/components/university-card";
import { FilterBar } from "@/components/filter-bar";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    province?: string;
    city?: string;
    type?: string;
  }>;
}

export default async function UniversitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};

  if (params.province) where.province = params.province;
  if (params.city) where.city = params.city;
  if (params.type) where.type = params.type;

  const universities = await prisma.university.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { programs: true } } },
  });

  const provinces = await prisma.university.findMany({
    select: { province: true },
    distinct: ["province"],
    orderBy: { province: "asc" },
  });

  const distinctProvinceValues = provinces.map((p) => p.province);
  const totalCount = universities.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Universities</h1>
        <p className="mt-1 text-gray-600">
          {totalCount} university{totalCount !== 1 ? "ies" : "y"} found
          {params.province && ` in ${params.province}`}
        </p>
      </div>

      <FilterBar
        provinces={distinctProvinceValues}
        currentProvince={params.province || ""}
        currentCity={params.city || ""}
        currentType={params.type || ""}
        currentQuery={params.q || ""}
      />

      {universities.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-gray-500">
          <p className="text-lg font-medium">No universities found</p>
          <p className="text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
