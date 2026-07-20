"use server";

import { prisma } from "@/lib/db";

export async function getMeritFormulas() {
  return prisma.meritFormula.findMany({
    where: { isActive: true },
    include: { university: { select: { name: true, slug: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getSuggestedUniversities(aggregate: number) {
  const programs = await prisma.program.findMany({
    where: {
      isAvailable: true,
      minAggregate: { lte: aggregate },
    },
    orderBy: { minAggregate: "desc" },
    take: 10,
    include: {
      university: {
        select: { name: true, slug: true, city: true, province: true, type: true, ranking: true },
      },
    },
  });

  return programs.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    degreeLevel: p.degreeLevel,
    field: p.field,
    minAggregate: p.minAggregate,
    university: { ...p.university, type: p.university.type },
  }));
}

export async function calculateMerit(
  matric: number,
  inter: number,
  entryTest: number,
  formulaId?: string,
) {
  if (formulaId) {
    const formula = await prisma.meritFormula.findUnique({ where: { id: formulaId } });
    if (formula) {
      return {
        aggregate: Math.round((matric * formula.matricWeight + inter * formula.interWeight + entryTest * formula.entryTestWeight) * 100) / 100,
        formulaName: formula.name,
        breakdown: [
          `Matric (${formula.matricWeight * 100}%): ${(matric * formula.matricWeight).toFixed(2)}`,
          `Intermediate (${formula.interWeight * 100}%): ${(inter * formula.interWeight).toFixed(2)}`,
          `Entry Test (${formula.entryTestWeight * 100}%): ${(entryTest * formula.entryTestWeight).toFixed(2)}`,
        ],
      };
    }
  }

  const defaultMatricWeight = 0.1;
  const defaultInterWeight = 0.4;
  const defaultTestWeight = 0.5;

  return {
    aggregate: Math.round((matric * defaultMatricWeight + inter * defaultInterWeight + entryTest * defaultTestWeight) * 100) / 100,
    formulaName: "General Engineering",
    breakdown: [
      `Matric (${defaultMatricWeight * 100}%): ${(matric * defaultMatricWeight).toFixed(2)}`,
      `Intermediate (${defaultInterWeight * 100}%): ${(inter * defaultInterWeight).toFixed(2)}`,
      `Entry Test (${defaultTestWeight * 100}%): ${(entryTest * defaultTestWeight).toFixed(2)}`,
    ],
  };
}
