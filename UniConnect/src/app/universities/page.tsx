import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { UniversityCard } from "@/components/university-card";
import { FilterBar } from "@/components/filter-bar";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    province?: string;
    city?: string;
    type?: string;
    degree?: string;
    minFee?: string;
    maxFee?: string;
    hasHostel?: string;
    hasScholarship?: string;
  }>;
}

export default async function UniversitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const where: Prisma.UniversityWhereInput = {};
  const programWhere: Prisma.ProgramWhereInput = {};

  const PUBLIC = "PUBLIC", PRIVATE = "PRIVATE", MILITARY = "MILITARY";
  if (params.province) where.province = params.province;
  if (params.city) where.city = params.city;
  if (params.type) where.type = params.type.toUpperCase() as any;
  if (params.q) where.name = { contains: params.q, mode: "insensitive" };
  if (params.degree) programWhere.degreeLevel = params.degree as any;
  if (params.minFee) programWhere.semesterFee = { gte: parseFloat(params.minFee) };
  if (params.maxFee) {
    const maxFeeFilter: Prisma.FloatNullableFilter = {};
    if (params.minFee) {
      (programWhere.semesterFee as any).lte = parseFloat(params.maxFee);
    } else {
      programWhere.semesterFee = { ...((programWhere.semesterFee as any) || {}), lte: parseFloat(params.maxFee) };
    }
  }
  if (params.hasHostel === "true") where.hostels = { some: { isActive: true } };
  if (params.hasScholarship === "true") where.scholarships = { some: { isActive: true } };

  if (params.degree || params.minFee || params.maxFee) {
    where.programs = { some: programWhere };
  }

  const universities = await prisma.university.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      _count: { select: { programs: true } },
      hostels: { where: { isActive: true }, take: 1 },
      scholarships: { where: { isActive: true }, take: 1 },
    },
  });

  const [provinceRows, cityRows, degreeRows] = await Promise.all([
    prisma.university.findMany({
      select: { province: true },
      distinct: ["province"],
      orderBy: { province: "asc" },
    }),
    prisma.university.findMany({
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
    prisma.program.findMany({
      select: { degreeLevel: true },
      distinct: ["degreeLevel"],
      orderBy: { degreeLevel: "asc" },
    }),
  ]);

  const totalCount = universities.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Universities</h1>
        <p className="mt-1 text-muted-foreground">
          {totalCount} universit{totalCount !== 1 ? "ies" : "y"} found
          {params.province && ` in ${params.province}`}
        </p>
      </div>

      <FilterBar
        provinces={provinceRows.map((p) => p.province)}
        cities={cityRows.map((c) => c.city)}
        degreeLevels={degreeRows.map((d) => d.degreeLevel)}
        currentProvince={params.province || ""}
        currentCity={params.city || ""}
        currentType={params.type || ""}
        currentQuery={params.q || ""}
        currentDegree={params.degree || ""}
        currentMinFee={params.minFee || ""}
        currentMaxFee={params.maxFee || ""}
        currentHasHostel={params.hasHostel || ""}
        currentHasScholarship={params.hasScholarship || ""}
      />

      {universities.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
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
