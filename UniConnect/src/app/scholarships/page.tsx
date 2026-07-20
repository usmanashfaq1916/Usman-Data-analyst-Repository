import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ScholarshipFilterBar } from "@/components/scholarship-filter-bar";
import { ScholarshipCategories } from "@/components/scholarship-categories";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    degree?: string;
    country?: string;
    gender?: string;
    minCgpa?: string;
    province?: string;
  }>;
}

export default async function ScholarshipsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const where: Record<string, unknown> = { isActive: true };

  if (params.type) where.type = { contains: params.type, mode: "insensitive" };
  if (params.country) where.country = params.country;
  if (params.degree) where.degreeLevel = params.degree;
  if (params.gender) where.gender = params.gender;
  if (params.minCgpa) where.minCgpa = { lte: parseFloat(params.minCgpa) };
  if (params.province) where.university = { province: params.province };
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const scholarships = await prisma.scholarship.findMany({
    where,
    orderBy: { deadline: "asc" },
    include: { university: { select: { name: true, slug: true, city: true, province: true } } },
  });

  const [types, countries, degrees, provinces] = await Promise.all([
    prisma.scholarship.findMany({
      where: { isActive: true },
      select: { type: true },
      distinct: ["type"],
      orderBy: { type: "asc" },
    }),
    prisma.scholarship.findMany({
      where: { isActive: true },
      select: { country: true },
      distinct: ["country"],
      orderBy: { country: "asc" },
    }),
    prisma.scholarship.findMany({
      where: { isActive: true },
      select: { degreeLevel: true },
      distinct: ["degreeLevel"],
      orderBy: { degreeLevel: "asc" },
    }),
    prisma.university.findMany({
      where: { scholarships: { some: { isActive: true } } },
      select: { province: true },
      distinct: ["province"],
      orderBy: { province: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Scholarships</h1>
        <p className="mt-1 text-muted-foreground">
          Find merit-based, need-based, and government scholarships across Pakistan.
        </p>
      </div>

      <ScholarshipCategories />

      <ScholarshipFilterBar
        types={types.map((t) => t.type)}
        degrees={degrees.filter((d) => d.degreeLevel).map((d) => d.degreeLevel!)}
        countries={countries.filter((c) => c.country).map((c) => c.country!)}
        provinces={provinces.map((p) => p.province)}
        currentQuery={params.q || ""}
        currentType={params.type || ""}
        currentDegree={params.degree || ""}
        currentCountry={params.country || ""}
        currentGender={params.gender || ""}
        currentMinCgpa={params.minCgpa || ""}
        currentProvince={params.province || ""}
      />

      {scholarships.length === 0 ? (
        <EmptyState
          title="No scholarships found"
          description="Try adjusting your filters or check back later."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((s) => (
            <Link key={s.id} href={`/scholarships/${s.id}`}>
              <Card className="group h-full transition-all hover:shadow-md hover:border-secondary/50">
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-secondary line-clamp-2">
                      {s.name}
                    </h3>
                    <Badge variant="outline" className="shrink-0 text-xs">{s.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {s.university.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {s.university.city}, {s.university.province}
                  </p>
                  {s.amount && (
                    <p className="text-lg font-bold text-success">
                      PKR {s.amount.toLocaleString()}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {s.isMeritBased && <Badge variant="secondary" className="text-xs">Merit-Based</Badge>}
                    {s.isNeedBased && <Badge variant="secondary" className="text-xs">Need-Based</Badge>}
                    {s.degreeLevel && <Badge variant="outline" className="text-xs">{s.degreeLevel}</Badge>}
                    {s.gender && <Badge variant="outline" className="text-xs"><Users className="mr-0.5 h-3 w-3" />{s.gender}</Badge>}
                    {s.minCgpa && <Badge variant="outline" className="text-xs">CGPA {s.minCgpa}+</Badge>}
                  </div>
                  {s.deadline && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Deadline: {s.deadline.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
