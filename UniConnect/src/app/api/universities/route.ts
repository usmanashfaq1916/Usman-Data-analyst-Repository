import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, province, city, type, description, websiteUrl, admissionUrl, ranking, establishedYear, phone, email, isFeatured } = body;

  if (!name?.trim() || !province?.trim() || !city?.trim()) {
    return NextResponse.json({ success: false, error: "Name, province, and city are required" }, { status: 400 });
  }

  const slug = slugify(name) + "-" + Date.now();

  const university = await prisma.university.create({
    data: {
      name: name.trim(),
      slug,
      province: province.trim(),
      city: city.trim(),
      type: type || "PUBLIC",
      description: description || null,
      websiteUrl: websiteUrl || null,
      admissionUrl: admissionUrl || null,
      ranking: ranking ? parseInt(ranking) : null,
      establishedYear: establishedYear ? parseInt(establishedYear) : null,
      phone: phone || null,
      email: email || null,
      isFeatured: isFeatured === true,
    },
  });

  return NextResponse.json({ success: true, data: university }, { status: 201 });
}
