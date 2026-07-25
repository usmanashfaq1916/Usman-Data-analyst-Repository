import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const classId = searchParams.get("classId")
  const campusId = searchParams.get("campusId")
  const dayOfWeek = searchParams.get("dayOfWeek")

  const where: Record<string, unknown> = {}
  if (classId) where.classId = classId
  if (campusId) where.campusId = campusId
  if (dayOfWeek) where.dayOfWeek = dayOfWeek

  const entries = await prisma.timetableEntry.findMany({
    where,
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  })

  return NextResponse.json(entries)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { dayOfWeek, startTime, endTime, courseName, teacherName, room, classId, section, campusId } = body

    if (!dayOfWeek || !startTime || !endTime) {
      return NextResponse.json({ error: "dayOfWeek, startTime, and endTime are required" }, { status: 400 })
    }

    const entry = await prisma.timetableEntry.create({
      data: { dayOfWeek, startTime, endTime, courseName, teacherName, room, classId, section, campusId },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create timetable entry"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
