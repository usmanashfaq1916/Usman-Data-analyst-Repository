import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const province = searchParams.get("province");
  const city = searchParams.get("city");
  const type = searchParams.get("type");
  const search = searchParams.get("q");
  const featured = searchParams.get("featured");

  const where: any = { isActive: true };
  if (province) where.province = province;
  if (city) where.city = city;
  if (type) where.type = type;
  if (featured === "true") where.isFeatured = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const [universities, total] = await Promise.all([
    prisma.university.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { programs: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.university.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: universities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
