import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const BADGE_MAP: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  OPEN: "success",
  CLOSING_SOON: "warning",
  UPCOMING: "secondary",
  CLOSED: "destructive",
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Open",
  CLOSING_SOON: "Closing Soon",
  UPCOMING: "Upcoming",
  CLOSED: "Closed",
};

const ALERT_ORDER: Record<string, number> = {
  CLOSING_SOON: 0,
  OPEN: 1,
  UPCOMING: 2,
  CLOSED: 3,
};

export default async function AdmissionAlertsPage() {
  const now = new Date();

  const admissions = await prisma.admission.findMany({
    orderBy: { closeDate: "asc" },
    include: { university: { select: { name: true, slug: true, city: true, province: true } } },
  });

  const sorted = [...admissions].sort(
    (a, b) => (ALERT_ORDER[a.status] ?? 99) - (ALERT_ORDER[b.status] ?? 99),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Admission Alerts</h1>
        <p className="mt-1 text-muted-foreground">
          Track admission deadlines across all universities.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
          <p className="text-lg font-medium">No admission alerts</p>
          <p className="text-sm">Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((admission) => {
            const totalDays = Math.ceil(
              (admission.closeDate.getTime() - admission.openDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );
            const elapsedDays = Math.ceil(
              (now.getTime() - admission.openDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );
            const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
            const daysLeft = Math.max(
              0,
              Math.ceil(
                (admission.closeDate.getTime() - now.getTime()) /
                  (1000 * 60 * 60 * 24),
              ),
            );

            return (
              <Card key={admission.id}>
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/universities/${admission.university.slug}`}
                      className="text-sm font-semibold text-primary hover:text-secondary"
                    >
                      {admission.university.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {admission.university.city}, {admission.university.province}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={BADGE_MAP[admission.status]}>
                      {STATUS_LABEL[admission.status] || admission.status}
                    </Badge>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {admission.openDate.toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {admission.closeDate.toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {admission.status !== "CLOSED" && daysLeft > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progress > 80
                                ? "bg-danger"
                                : progress > 50
                                  ? "bg-warning"
                                  : "bg-success"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {daysLeft}d left
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
