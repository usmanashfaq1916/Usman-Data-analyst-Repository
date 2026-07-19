import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

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

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { universityId, name, description, type, amount, amountType, deadline, eligibility, country, degreeLevel, isMeritBased, isNeedBased, officialUrl } = body;

  if (!universityId || !name?.trim()) {
    return NextResponse.json({ success: false, error: "University and name are required" }, { status: 400 });
  }

  const scholarship = await prisma.scholarship.create({
    data: {
      universityId,
      name: name.trim(),
      description: description || null,
      type: type || "Merit Based",
      amount: amount ? parseFloat(amount) : null,
      amountType: amountType || "fixed",
      deadline: deadline ? new Date(deadline) : null,
      eligibility: eligibility || null,
      country: country || "Pakistan",
      degreeLevel: degreeLevel || null,
      isMeritBased: isMeritBased === true,
      isNeedBased: isNeedBased === true,
      officialUrl: officialUrl || null,
    },
  });

  return NextResponse.json({ success: true, data: scholarship }, { status: 201 });
}
