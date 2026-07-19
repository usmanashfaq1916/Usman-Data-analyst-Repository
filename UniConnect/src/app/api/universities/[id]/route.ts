import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const university = await prisma.university.findUnique({
    where: { id },
    include: {
      _count: { select: { programs: true, scholarships: true, reviews: true } },
    },
  });
  if (!university) {
    return NextResponse.json({ success: false, error: "University not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: university });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const { name, province, city, type, description, websiteUrl, admissionUrl, ranking, establishedYear, phone, email, isFeatured, isActive } = body;

  const existing = await prisma.university.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "University not found" }, { status: 404 });
  }

  const university = await prisma.university.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(province !== undefined && { province }),
      ...(city !== undefined && { city }),
      ...(type !== undefined && { type }),
      ...(description !== undefined && { description }),
      ...(websiteUrl !== undefined && { websiteUrl }),
      ...(admissionUrl !== undefined && { admissionUrl }),
      ...(ranking !== undefined && { ranking: parseInt(ranking) }),
      ...(establishedYear !== undefined && { establishedYear: parseInt(establishedYear) }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json({ success: true, data: university });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await prisma.university.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "University not found" }, { status: 404 });
  }
  await prisma.university.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
