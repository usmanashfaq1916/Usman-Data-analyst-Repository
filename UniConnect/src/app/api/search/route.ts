import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, data: { universities: [], programs: [] } });
  }

  const [universities, programs] = await Promise.all([
    prisma.university.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { province: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
      orderBy: { name: "asc" },
    }),
    prisma.program.findMany({
      where: {
        isAvailable: true,
        name: { contains: q, mode: "insensitive" },
      },
      include: { university: { select: { name: true, slug: true } } },
      take: 10,
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: { universities, programs },
  });
}
