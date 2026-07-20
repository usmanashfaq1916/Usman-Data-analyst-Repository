import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { prisma } = await import("@/lib/db");

  const [universities, programs, blogPosts, scholarships] = await Promise.all([
    prisma.university.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.program.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.blog.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.scholarship.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    }),
  ]);

  const baseUrl = "https://uniconnect-pk.vercel.app";

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/universities`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/programs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/scholarships`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/merit-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/admission-alerts`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/chat`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/faqs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ...universities.map((uni) => ({
      url: `${baseUrl}/universities/${uni.slug}`,
      lastModified: uni.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...programs.map((p) => ({
      url: `${baseUrl}/programs/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...scholarships.map((s) => ({
      url: `${baseUrl}/scholarships/${s.id}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
