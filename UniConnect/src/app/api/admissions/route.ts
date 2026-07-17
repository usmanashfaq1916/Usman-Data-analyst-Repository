import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const universityId = searchParams.get("universityId");

  const where: any = {};
  if (status) where.status = status;
  if (universityId) where.universityId = universityId;

  const admissions = await prisma.admission.findMany({
    where,
    include: {
      university: { select: { name: true, slug: true, city: true, province: true } },
    },
    orderBy: { closeDate: "asc" },
  });

  return NextResponse.json({ success: true, data: admissions });
}
