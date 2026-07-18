import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const type = searchParams.get("type");
  const country = searchParams.get("country");
  const degree = searchParams.get("degree");
  const search = searchParams.get("q");

  const where: any = { isActive: true };
  if (type) where.type = type;
  if (country) where.country = country;
  if (degree) where.degreeLevel = degree;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [scholarships, total] = await Promise.all([
    prisma.scholarship.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { university: { select: { name: true, slug: true, city: true } } },
      orderBy: { deadline: "asc" },
    }),
    prisma.scholarship.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: scholarships,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
