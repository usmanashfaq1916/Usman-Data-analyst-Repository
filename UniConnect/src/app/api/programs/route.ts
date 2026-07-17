import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const universityId = searchParams.get("universityId");
  const field = searchParams.get("field");
  const degreeLevel = searchParams.get("degreeLevel");

  const where: any = { isAvailable: true };
  if (universityId) where.universityId = universityId;
  if (field) where.field = field;
  if (degreeLevel) where.degreeLevel = degreeLevel;

  const [programs, total] = await Promise.all([
    prisma.program.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { university: { select: { name: true, slug: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.program.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: programs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
