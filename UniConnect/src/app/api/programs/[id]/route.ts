import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = await prisma.program.findUnique({
    where: { id },
    include: { university: { select: { id: true, name: true, slug: true } } },
  });
  if (!program) {
    return NextResponse.json({ success: false, error: "Program not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: program });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const { name, degreeLevel, field, description, duration, minAggregate, semesterFee, totalSeats, isAvailable } = body;

  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Program not found" }, { status: 404 });
  }

  const program = await prisma.program.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(degreeLevel !== undefined && { degreeLevel }),
      ...(field !== undefined && { field }),
      ...(description !== undefined && { description }),
      ...(duration !== undefined && { duration: parseInt(duration) }),
      ...(minAggregate !== undefined && { minAggregate: parseFloat(minAggregate) }),
      ...(semesterFee !== undefined && { semesterFee: parseFloat(semesterFee) }),
      ...(totalSeats !== undefined && { totalSeats: parseInt(totalSeats) }),
      ...(isAvailable !== undefined && { isAvailable }),
    },
  });

  return NextResponse.json({ success: true, data: program });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Program not found" }, { status: 404 });
  }
  await prisma.program.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
