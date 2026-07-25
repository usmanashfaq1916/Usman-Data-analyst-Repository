import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const courseId = searchParams.get("courseId")
  const upcoming = searchParams.get("upcoming")

  const where: Record<string, unknown> = {}
  if (courseId) where.courseId = courseId
  if (upcoming === "true") where.examDate = { gte: new Date() }

  const exams = await prisma.exam.findMany({
    where,
    include: { _count: { select: { results: true } } },
    orderBy: { examDate: "asc" },
  })

  return NextResponse.json(exams)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, type, courseId, courseName, totalMarks, passMarks, examDate, startTime, endTime } = body

    if (!name || !type || !examDate) {
      return NextResponse.json({ error: "name, type, and examDate are required" }, { status: 400 })
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        type,
        courseId,
        courseName,
        totalMarks: totalMarks || 100,
        passMarks: passMarks || 40,
        examDate: new Date(examDate),
        startTime,
        endTime,
      },
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create exam"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
