import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const entry = await prisma.timetableEntry.update({
      where: { id },
      data: {
        dayOfWeek: body.dayOfWeek,
        startTime: body.startTime,
        endTime: body.endTime,
        courseName: body.courseName,
        teacherName: body.teacherName,
        room: body.room,
        classId: body.classId,
        section: body.section,
      },
    })
    return NextResponse.json(entry)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update timetable entry"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.timetableEntry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete timetable entry"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
