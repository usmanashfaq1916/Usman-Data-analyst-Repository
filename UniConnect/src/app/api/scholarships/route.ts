import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const universityId = searchParams.get("universityId");

  const where: any = { isActive: true };
  if (universityId) where.universityId = universityId;

  const scholarships = await prisma.scholarship.findMany({
    where,
    include: { university: { select: { name: true, slug: true } } },
    orderBy: { deadline: "asc" },
  });

  return NextResponse.json({ success: true, data: scholarships });
}
