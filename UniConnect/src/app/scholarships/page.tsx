import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, GraduationCap, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    degree?: string;
    country?: string;
  }>;
}

export default async function ScholarshipsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const where: Record<string, unknown> = { isActive: true };

  if (params.type) where.type = params.type;
  if (params.country) where.country = params.country;
  if (params.degree) where.degreeLevel = params.degree;
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

  const types = await prisma.scholarship.findMany({
    where: { isActive: true },
    select: { type: true },
    distinct: ["type"],
    orderBy: { type: "asc" },
  });

  const countries = await prisma.scholarship.findMany({
    where: { isActive: true },
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });

  const degrees = await prisma.scholarship.findMany({
    where: { isActive: true },
    select: { degreeLevel: true },
    distinct: ["degreeLevel"],
    orderBy: { degreeLevel: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Scholarships</h1>
        <p className="mt-1 text-muted-foreground">
          Find merit-based, need-based, and government scholarships across Pakistan.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search scholarships..."
            defaultValue={params.q || ""}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <select
          defaultValue={params.type || ""}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t.type} value={t.type}>{t.type}</option>
          ))}
        </select>
        <select
          defaultValue={params.degree || ""}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">All Degrees</option>
          {degrees.filter(d => d.degreeLevel).map((d) => (
            <option key={d.degreeLevel} value={d.degreeLevel!}>{d.degreeLevel}</option>
          ))}
        </select>
        <select
          defaultValue={params.country || ""}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">All Countries</option>
          {countries.filter(c => c.country).map((c) => (
            <option key={c.country} value={c.country!}>{c.country}</option>
          ))}
        </select>
      </div>

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
