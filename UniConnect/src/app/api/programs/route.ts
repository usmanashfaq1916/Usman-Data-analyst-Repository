import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { universityId, name, degreeLevel, field, description, duration, minAggregate, semesterFee, totalSeats } = body;

  if (!universityId || !name?.trim() || !field?.trim()) {
    return NextResponse.json({ success: false, error: "University, name, and field are required" }, { status: 400 });
  }

  const slug = slugify(name) + "-" + Date.now();

  const program = await prisma.program.create({
    data: {
      universityId,
      name: name.trim(),
      slug,
      degreeLevel: degreeLevel || "BS",
      field: field.trim(),
      description: description || null,
      duration: duration ? parseInt(duration) : null,
      minAggregate: minAggregate ? parseFloat(minAggregate) : null,
      semesterFee: semesterFee ? parseFloat(semesterFee) : null,
      totalSeats: totalSeats ? parseInt(totalSeats) : null,
    },
  });

  return NextResponse.json({ success: true, data: program }, { status: 201 });
}
