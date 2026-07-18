import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function DeadlinesPage() {
  const session = await auth();
  const admissions = await prisma.admission.findMany({
    where: { status: { in: ["OPEN", "CLOSING_SOON", "UPCOMING"] } },
    orderBy: { closeDate: "asc" },
    take: 20,
    include: { university: { select: { name: true, slug: true, city: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upcoming Deadlines</h1>
        <p className="text-sm text-muted-foreground">Track admission deadlines across universities</p>
      </div>

      {admissions.length === 0 ? (
        <EmptyState title="No deadlines" description="No upcoming admission deadlines found." />
      ) : (
        <div className="space-y-3">
          {admissions.map((admission) => {
            const now = new Date();
            const diff = admission.closeDate.getTime() - now.getTime();
            const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

            return (
              <Link
                key={admission.id}
                href={`/universities/${admission.university.slug}`}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-accent"
              >
                <div>
                  <p className="text-sm font-medium">{admission.university.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Closes:{" "}
                    {admission.closeDate.toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={admission.status === "CLOSING_SOON" ? "destructive" : "secondary"}>
                  {daysLeft}d left
                </Badge>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
