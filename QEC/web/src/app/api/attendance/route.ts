import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const date = searchParams.get("date")
  const studentId = searchParams.get("studentId")
  const courseId = searchParams.get("courseId")

  const where: Record<string, unknown> = {}
  if (date) where.date = new Date(date)
  if (studentId) where.studentId = studentId
  if (courseId) where.courseId = courseId

  const records = await prisma.attendance.findMany({
    where,
    orderBy: { date: "desc" },
    take: 100,
  })

  return NextResponse.json(records)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { studentId, studentName, rollNumber, date, status, courseId, courseName, markedBy, remarks } = body

    if (!studentId || !date || !status) {
      return NextResponse.json({ error: "studentId, date, and status are required" }, { status: 400 })
    }

    const existing = await prisma.attendance.findFirst({
      where: { studentId, date: new Date(date), courseId: courseId || undefined },
    })

    let record
    if (existing) {
      record = await prisma.attendance.update({
        where: { id: existing.id },
        data: { status, remarks, markedBy },
      })
    } else {
      record = await prisma.attendance.create({
        data: {
          studentId,
          studentName,
          rollNumber,
          date: new Date(date),
          status,
          courseId,
          courseName,
          markedBy,
          remarks,
        },
      })
    }

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to mark attendance"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
