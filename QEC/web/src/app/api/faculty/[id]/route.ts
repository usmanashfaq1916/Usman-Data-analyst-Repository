import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const faculty = await prisma.faculty.findUnique({
    where: { id },
    include: { department: true, user: { select: { email: true } } },
  })
  if (!faculty) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(faculty)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const faculty = await prisma.faculty.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role,
        qualification: body.qualification,
        experience: body.experience,
        departmentId: body.departmentId,
      },
      include: { department: true },
    })
    return NextResponse.json(faculty)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update faculty"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.faculty.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete faculty"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
