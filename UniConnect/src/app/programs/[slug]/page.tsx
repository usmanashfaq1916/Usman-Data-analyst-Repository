import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowLeft, GraduationCap, Clock, CreditCard, Briefcase, TrendingUp, Star, DollarSign, BookOpen, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProgram(slug: string) {
  return prisma.program.findFirst({
    where: { slug },
    include: {
      university: {
        select: { id: true, name: true, slug: true, city: true, province: true, type: true, logoUrl: true, websiteUrl: true, isHecRecognized: true, ranking: true },
      },
      department: { select: { name: true } },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return { title: "Program Not Found" };
  return {
    title: `${program.name} — UniConnect Pakistan`,
    description: program.description || `${program.degreeLevel} in ${program.field} at ${program.university.name}. Check eligibility, duration, fees, and career scope.`,
    openGraph: {
      title: `${program.name} at ${program.university.name}`,
      description: program.description?.slice(0, 160) || `Explore ${program.name} program details.`,
    },
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  const { university } = program;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: program.name,
    description: program.description || `${program.degreeLevel} in ${program.field}`,
    educationalLevel: program.degreeLevel,
    provider: {
      "@type": "CollegeOrUniversity",
      name: university.name,
      address: { addressLocality: university.city, addressRegion: university.province, addressCountry: "PK" },
    },
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Programs", href: "/programs" },
          { label: program.field || "Program" },
        ]}
      />
      <Link
        href="/programs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-secondary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to programs
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">{program.name}</h1>
            {university.isHecRecognized && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                HEC Recognized
              </Badge>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              {university.name}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {university.city}, {university.province}
            </span>
            <Badge variant="outline">{program.degreeLevel}</Badge>
            {program.field && <Badge variant="outline">{program.field}</Badge>}
            {university.ranking && (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                Rank #{university.ranking}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard icon={Clock} label="Duration" value={program.duration ? `${program.duration} years` : "N/A"} />
        <InfoCard icon={CreditCard} label="Credit Hours" value={program.creditHours ? `${program.creditHours}` : "N/A"} />
        <InfoCard icon={DollarSign} label="Semester Fee" value={program.semesterFee ? `PKR ${program.semesterFee.toLocaleString()}` : "Varies"} />
        <InfoCard icon={Star} label="Min. Aggregate" value={program.minAggregate ? `${program.minAggregate}%` : "Varies"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {program.description && (
          <Card>
            <CardHeader><h2 className="text-lg font-semibold text-foreground">Overview</h2></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{program.description}</p>
            </CardContent>
          </Card>
        )}

        {program.curriculum && (
          <Card>
            <CardHeader><h2 className="text-lg font-semibold text-foreground">Curriculum</h2></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{program.curriculum}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {program.careerScope && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-semibold text-foreground">Career Scope</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{program.careerScope}</p>
            </CardContent>
          </Card>
        )}

        {program.expectedSalary && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-foreground">Expected Salary</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{program.expectedSalary}</p>
            </CardContent>
          </Card>
        )}

        {program.futureDemand && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-foreground">Future Demand</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{program.futureDemand}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {program.skills && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              <h2 className="text-lg font-semibold text-foreground">Skills You Will Gain</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {program.skills.split(",").map((skill) => (
                <Badge key={skill.trim()} variant="secondary">
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">Offered at</h2>
          </div>
        </CardHeader>
        <CardContent>
          <Link
            href={`/universities/${university.slug}`}
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {university.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="font-medium text-foreground">{university.name}</p>
              <p className="text-sm text-muted-foreground">
                {university.city}, {university.province} &middot; {university.type === "PUBLIC" ? "Public" : university.type === "PRIVATE" ? "Private" : "Military"}
              </p>
            </div>
            <Badge variant="outline" className="ml-auto">
              View University
            </Badge>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Icon className="h-8 w-8 text-secondary" />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
