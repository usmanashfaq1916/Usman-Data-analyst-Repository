import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ success: false, error: "ids parameter required" }, { status: 400 });
  }

  const idList = ids.split(",").filter(Boolean);

  if (idList.length < 1 || idList.length > 4) {
    return NextResponse.json({ success: false, error: "Provide 1-4 university IDs" }, { status: 400 });
  }

  const universities = await prisma.university.findMany({
    where: { id: { in: idList } },
    include: {
      programs: { select: { field: true, degreeLevel: true, minAggregate: true, semesterFee: true } },
      scholarships: { select: { name: true, type: true, amount: true } },
      hostels: { select: { name: true, type: true, fee: true } },
      _count: { select: { programs: true, scholarships: true } },
    },
  });

  const data = universities.map((u) => ({
    ...u,
    programCount: u._count.programs,
    scholarshipCount: u._count.scholarships,
  }));

  return NextResponse.json({ success: true, data });
}
