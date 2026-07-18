import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  ACCEPTED: "success",
  UNDER_REVIEW: "warning",
  REJECTED: "destructive",
  PENDING: "secondary",
  WAITLISTED: "secondary",
};

export default async function ApplicationsPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const applications = await prisma.application.findMany({
    where: { userId },
    orderBy: { submittedAt: "desc" },
    include: {
      university: { select: { name: true, slug: true } },
      program: { select: { name: true, degreeLevel: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-sm text-muted-foreground">Track your university applications</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Start applying to universities to track them here."
          actionLabel="Browse Universities"
          actionHref="/universities"
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const variant = STATUS_VARIANT[app.status] || "secondary";
            return (
              <Card key={app.id}>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-semibold">{app.university.name}</p>
                    <p className="text-xs text-muted-foreground">{app.program.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted{" "}
                      {app.submittedAt.toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge variant={variant}>
                    {app.status.replace(/_/g, " ")}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
