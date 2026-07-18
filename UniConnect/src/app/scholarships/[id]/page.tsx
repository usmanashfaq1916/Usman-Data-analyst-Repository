import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, GraduationCap, ExternalLink, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { id } = await params;

  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
    include: {
      university: {
        select: { name: true, slug: true, city: true, province: true, websiteUrl: true },
      },
    },
  });

  if (!scholarship) notFound();

  const now = new Date();
  const daysLeft = scholarship.deadline
    ? Math.max(0, Math.ceil((scholarship.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="space-y-6">
      <Link
        href="/scholarships"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to scholarships
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{scholarship.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              {scholarship.university.name}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {scholarship.university.city}, {scholarship.university.province}
            </span>
            <Badge variant="outline">{scholarship.type}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {scholarship.officialUrl && (
            <a href={scholarship.officialUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Official Link
              </Button>
            </a>
          )}
          <Link href={`/universities/${scholarship.university.slug}`}>
            <Button size="sm">View University</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-foreground">Description</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {scholarship.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {scholarship.eligibility && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-foreground">Eligibility Criteria</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {scholarship.eligibility.split("\n").map((line, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {line}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-sm text-muted-foreground">Scholarship Amount</p>
                <p className="text-2xl font-bold text-success">
                  {scholarship.amount ? `PKR ${scholarship.amount.toLocaleString()}` : "Not specified"}
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="flex flex-wrap gap-1.5">
                {scholarship.isMeritBased && <Badge variant="secondary">Merit-Based</Badge>}
                {scholarship.isNeedBased && <Badge variant="secondary">Need-Based</Badge>}
                {scholarship.degreeLevel && <Badge variant="outline">{scholarship.degreeLevel}</Badge>}
                {scholarship.country && <Badge variant="outline">{scholarship.country}</Badge>}
              </div>

              {scholarship.deadline && (
                <>
                  <div className="h-px bg-border" />
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-medium text-foreground">
                        {scholarship.deadline.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      {daysLeft !== null && daysLeft > 0 && (
                        <p className="text-xs text-warning font-semibold">{daysLeft} days left</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
