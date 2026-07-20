"use server";

import { prisma } from "@/lib/db";

export async function searchSuggestions(query: string) {
  if (!query || query.length < 2) return { universities: [], programs: [], cities: [], disciplines: [] };

  const [universities, programs, cities, disciplines] = await Promise.all([
    prisma.university.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { province: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, slug: true, city: true, province: true, type: true, logoUrl: true },
      take: 5,
    }),
    prisma.program.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { field: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, slug: true, field: true, degreeLevel: true, university: { select: { name: true, slug: true } } },
      take: 5,
    }),
    prisma.university.findMany({
      where: { city: { contains: query, mode: "insensitive" } },
      select: { city: true },
      distinct: ["city"],
      take: 5,
    }),
    prisma.program.findMany({
      where: { field: { contains: query, mode: "insensitive" } },
      select: { field: true },
      distinct: ["field"],
      take: 5,
    }),
  ]);

  return {
    universities: universities.map((u) => ({
      id: u.id,
      name: u.name,
      slug: u.slug,
      subtitle: `${u.city}, ${u.province}`,
      type: "University" as const,
    })),
    programs: programs.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      subtitle: `${p.field} - ${p.university.name}`,
      type: "Program" as const,
    })),
    cities: cities.map((c) => ({ name: c.city, type: "City" as const })),
    disciplines: disciplines.map((d) => ({ name: d.field, type: "Discipline" as const })),
  };
}

export type SearchResults = Awaited<ReturnType<typeof searchSuggestions>>;
