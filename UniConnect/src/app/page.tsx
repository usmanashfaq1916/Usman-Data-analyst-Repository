import { prisma } from "@/lib/db";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { AdmissionTicker } from "@/components/ticker";
import { UniversityCard } from "@/components/university-card";
import { ScholarshipHighlight } from "@/components/scholarship-highlight";
import { BlogPreview } from "@/components/blog-preview";
import { FaqSection } from "@/components/faq-section";
import { TestimonialSection } from "@/components/testimonial-section";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [universities, admissions, totalUniversities, programCount, scholarshipCount] = await Promise.all([
    prisma.university.findMany({
      take: 6,
      orderBy: { name: "asc" },
      include: { _count: { select: { programs: true } } },
    }),
    prisma.admission.findMany({
      where: { status: { in: ["OPEN", "CLOSING_SOON"] } },
      orderBy: { closeDate: "asc" },
      take: 5,
      include: { university: true },
    }),
    prisma.university.count(),
    prisma.program.count(),
    prisma.scholarship.count({ where: { isActive: true } }),
  ]);

  const tickerItems = admissions.map((a) => {
    const now = new Date();
    const diff = a.closeDate.getTime() - now.getTime();
    return {
      slug: a.university.slug,
      name: a.university.name,
      closeDate: a.closeDate,
      daysLeft: Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))),
    };
  });

  return (
    <div className="space-y-12">
      <HeroSection />

      <StatsSection
        universities={totalUniversities}
        programs={programCount}
        scholarships={scholarshipCount}
      />

      {tickerItems.length > 0 && <AdmissionTicker admissions={tickerItems} />}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Featured Universities</h2>
          <Link
            href="/universities"
            className="flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni, i) => (
            <UniversityCard
              key={uni.id}
              university={{
                ...uni,
                programCount: uni._count.programs,
              }}
              index={i}
            />
          ))}
        </div>
      </section>

      <ScholarshipHighlight />

      <BlogPreview />

      <TestimonialSection />

      <FaqSection />
    </div>
  );
}
