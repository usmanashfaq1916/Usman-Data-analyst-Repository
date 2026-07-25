import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const searchParams = req.nextUrl.searchParams
  const studentId = searchParams.get("studentId")

  const where: Record<string, unknown> = { examId: id }
  if (studentId) where.studentId = studentId

  const results = await prisma.examResult.findMany({
    where,
    orderBy: { marks: "desc" },
  })

  return NextResponse.json(results)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { studentId, studentName, rollNumber, marks, totalMarks, grade, remarks } = body

    if (!studentId || marks === undefined) {
      return NextResponse.json({ error: "studentId and marks are required" }, { status: 400 })
    }

    const existing = await prisma.examResult.findUnique({
      where: { examId_studentId: { examId: id, studentId } },
    })

    let result
    if (existing) {
      result = await prisma.examResult.update({
        where: { id: existing.id },
        data: { marks, totalMarks, grade, remarks },
      })
    } else {
      result = await prisma.examResult.create({
        data: {
          examId: id,
          studentId,
          studentName,
          rollNumber,
          marks,
          totalMarks: totalMarks || 100,
          grade,
          remarks,
        },
      })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit marks"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
