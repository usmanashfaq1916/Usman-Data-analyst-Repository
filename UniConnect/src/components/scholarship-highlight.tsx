import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

export async function ScholarshipHighlight() {
  const scholarships = await prisma.scholarship.findMany({
    where: { isActive: true },
    take: 3,
    include: { university: true },
    orderBy: { createdAt: "desc" },
  });

  if (scholarships.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Top Scholarships</h2>
        <Link
          href="/scholarships"
          className="flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((s) => (
          <Link key={s.id} href={`/scholarships/${s.id}`}>
            <div className="group h-full rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-secondary/50">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-secondary">
                  {s.name}
                </h3>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {s.type}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {s.university.name}
              </p>
              {s.amount && (
                <p className="mt-2 text-lg font-bold text-success">
                  PKR {s.amount.toLocaleString()}
                </p>
              )}
              {s.deadline && (
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Deadline: {s.deadline.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
