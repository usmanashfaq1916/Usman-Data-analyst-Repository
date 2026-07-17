import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Globe, ExternalLink, Calendar, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {university.city}, {university.province}
            </span>
            <Badge
              variant={
                university.type === "Public" ? "Public" : "Private"
              }
            >
              {university.type}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
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
              <p className="py-8 text-center text-sm text-gray-500">
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
            <h2 className="text-lg font-semibold text-primary">
              Admission Deadlines
            </h2>
          </CardHeader>
          <CardContent>
            {university.admissions.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No admission dates announced yet.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {university.admissions.map((admission) => {
                  const daysLeft = Math.ceil(
                    (admission.closeDate.getTime() - now.getTime()) /
                      (1000 * 60 * 60 * 24),
                  );

                  return (
                    <div
                      key={admission.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={admission.status as 'open' | 'closing_soon' | 'closed' | 'upcoming'}>
                            {admission.status === "closing_soon"
                              ? "Closing Soon"
                              : admission.status.charAt(0).toUpperCase() +
                                admission.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Opens:{" "}
                            {admission.openDate.toLocaleDateString("en-PK", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Closes:{" "}
                            {admission.closeDate.toLocaleDateString("en-PK", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      {admission.status !== "closed" && daysLeft > 0 && (
                        <span className="whitespace-nowrap text-sm font-semibold text-warning">
                          {daysLeft}d left
                        </span>
                      )}
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
