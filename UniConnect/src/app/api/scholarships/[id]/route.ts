import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
    include: { university: { select: { id: true, name: true, slug: true } } },
  });
  if (!scholarship) {
    return NextResponse.json({ success: false, error: "Scholarship not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: scholarship });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const { name, description, type, amount, amountType, deadline, eligibility, country, degreeLevel, isMeritBased, isNeedBased, officialUrl, isActive } = body;

  const existing = await prisma.scholarship.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Scholarship not found" }, { status: 404 });
  }

  const scholarship = await prisma.scholarship.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(type !== undefined && { type }),
      ...(amount !== undefined && { amount: parseFloat(amount) }),
      ...(amountType !== undefined && { amountType }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      ...(eligibility !== undefined && { eligibility }),
      ...(country !== undefined && { country }),
      ...(degreeLevel !== undefined && { degreeLevel }),
      ...(isMeritBased !== undefined && { isMeritBased }),
      ...(isNeedBased !== undefined && { isNeedBased }),
      ...(officialUrl !== undefined && { officialUrl }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json({ success: true, data: scholarship });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await prisma.scholarship.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Scholarship not found" }, { status: 404 });
  }
  await prisma.scholarship.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
