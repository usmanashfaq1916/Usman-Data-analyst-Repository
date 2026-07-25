import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: { results: { orderBy: { marks: "desc" } } },
  })
  if (!exam) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(exam)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const exam = await prisma.exam.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        courseId: body.courseId,
        courseName: body.courseName,
        totalMarks: body.totalMarks,
        passMarks: body.passMarks,
        examDate: body.examDate ? new Date(body.examDate) : undefined,
        startTime: body.startTime,
        endTime: body.endTime,
        isActive: body.isActive,
      },
    })
    return NextResponse.json(exam)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update exam"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.exam.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete exam"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
