import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Globe, ExternalLink, Calendar, ArrowLeft, GitCompareArrows } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdmissionTimeline } from "@/components/admission-timeline";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function UniversityDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const university = await prisma.university.findUnique({
    where: { slug },
    include: {
      programs: true,
      admissions: { orderBy: { closeDate: "asc" } },
    },
  });

  if (!university) notFound();

  const now = new Date();

  return (
    <div className="space-y-6">
      <Link
        href="/universities"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-secondary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to universities
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {university.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {university.city}, {university.province}
            </span>
            <Badge variant="outline">
              {university.type === "PUBLIC" ? "Public" : university.type === "PRIVATE" ? "Private" : "Military"}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/compare`}>
            <Button variant="outline" size="sm">
              <GitCompareArrows className="mr-1.5 h-4 w-4" />
              Compare
            </Button>
          </Link>
          {university.websiteUrl && (
            <a
              href={university.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Globe className="mr-1.5 h-4 w-4" />
                Website
              </Button>
            </a>
          )}
          {university.admissionUrl && (
            <a
              href={university.admissionUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm">
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Apply Now
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-primary">Programs</h2>
          </CardHeader>
          <CardContent>
            {university.programs.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No program data available yet.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {university.programs.map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {program.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {program.degreeLevel} &middot; {program.field}
                      </p>
                    </div>
                    {program.minAggregate && (
                      <Badge variant="default">
                        Min. {program.minAggregate}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                Admission Deadlines
              </h2>
              <Link href="/admission-alerts" className="text-xs text-secondary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {university.admissions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No admission dates announced yet.
              </p>
            ) : (
              <div className="space-y-6">
                {university.admissions.map((admission) => {
                  const daysLeft = Math.ceil(
                    (admission.closeDate.getTime() - now.getTime()) /
                      (1000 * 60 * 60 * 24),
                  );
                  return (
                    <div key={admission.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            ({
                              OPEN: "success",
                              CLOSING_SOON: "warning",
                              UPCOMING: "secondary",
                              CLOSED: "destructive",
                            } as Record<string, "success" | "warning" | "secondary" | "destructive">)[admission.status]
                          }
                        >
                          {admission.status === "CLOSING_SOON"
                            ? "Closing Soon"
                            : admission.status === "OPEN"
                              ? "Open"
                              : admission.status === "UPCOMING"
                                ? "Upcoming"
                                : "Closed"}
                        </Badge>
                        {admission.status !== "CLOSED" && daysLeft > 0 && (
                          <span className="text-sm font-semibold text-warning">
                            {daysLeft}d left
                          </span>
                        )}
                      </div>
                      <AdmissionTimeline
                        openDate={admission.openDate}
                        closeDate={admission.closeDate}
                        status={admission.status}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
