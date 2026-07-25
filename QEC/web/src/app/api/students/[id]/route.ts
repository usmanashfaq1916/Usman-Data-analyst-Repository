import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const student = await prisma.student.findUnique({
    where: { id },
    include: { campus: true, program: true, user: { select: { email: true } } },
  })
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(student)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const student = await prisma.student.update({
      where: { id },
      data: {
        name: body.name,
        fatherName: body.fatherName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        gender: body.gender,
        phone: body.phone,
        address: body.address,
        campusId: body.campusId,
        programId: body.programId,
        enrollmentYear: body.enrollmentYear,
      },
      include: { campus: true, program: true },
    })
    return NextResponse.json(student)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update student"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.student.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete student"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
