import { prisma } from "@/lib/db";
import Link from "next/link";
import { Search, BookOpen, GraduationCap, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Degree Programs — UniConnect Pakistan",
  description: "Browse thousands of degree programs across Pakistani universities. Search by field, university, city, or degree level.",
};

interface Props {
  searchParams: Promise<{ q?: string; field?: string; degree?: string }>;
}

export default async function ProgramsPage(props: Props) {
  const searchParams = await props.searchParams;
  const q = searchParams.q?.toLowerCase() || "";
  const fieldFilter = searchParams.field || "";
  const degreeFilter = searchParams.degree || "";

  const where: Record<string, unknown> = { isAvailable: true };
  if (q) where.OR = [
    { name: { contains: q, mode: "insensitive" } },
    { field: { contains: q, mode: "insensitive" } },
    { university: { name: { contains: q, mode: "insensitive" } } },
  ];
  if (fieldFilter) where.field = fieldFilter;
  if (degreeFilter) where.degreeLevel = degreeFilter;

  const [programs, fields, degreeLevels] = await Promise.all([
    prisma.program.findMany({
      where: where as any,
      orderBy: { name: "asc" },
      include: {
        university: { select: { name: true, slug: true, city: true, province: true, type: true } },
      },
    }),
    prisma.program.findMany({ select: { field: true }, distinct: ["field"], orderBy: { field: "asc" } }),
    prisma.program.findMany({ select: { degreeLevel: true }, distinct: ["degreeLevel"], orderBy: { degreeLevel: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Degree Explorer</h1>
        <p className="text-muted-foreground">
          Browse {programs.length.toLocaleString()} programs across Pakistani universities
        </p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <form>
            <Input
              name="q"
              placeholder="Search programs..."
              defaultValue={q}
              className="h-9 pl-9 text-sm"
            />
          </form>
        </div>
        <select
          name="field"
          defaultValue={fieldFilter}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            params.set("field", e.target.value);
            window.location.search = params.toString();
          }}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
        >
          <option value="">All Fields</option>
          {fields.map((f) => (
            <option key={f.field} value={f.field}>{f.field}</option>
          ))}
        </select>
        <select
          name="degree"
          defaultValue={degreeFilter}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            params.set("degree", e.target.value);
            window.location.search = params.toString();
          }}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
        >
          <option value="">All Levels</option>
          {degreeLevels.map((d) => (
            <option key={d.degreeLevel} value={d.degreeLevel}>{d.degreeLevel}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <Link
            key={program.id}
            href={`/programs/${program.slug}`}
            className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-secondary">
                  {program.name}
                </h3>
                <p className="truncate text-xs text-muted-foreground">{program.field}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{program.degreeLevel}</Badge>
              {program.minAggregate && (
                <span className="text-xs text-muted-foreground">{program.minAggregate}% min</span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <GraduationCap className="h-3 w-3" />
              {program.university.name}
              <MapPin className="ml-1 h-3 w-3" />
              {program.university.city}
            </div>
          </Link>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
          <BookOpen className="h-12 w-12" />
          <p className="text-lg font-medium">No programs found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
