import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const studentId = searchParams.get("studentId")

  const { prisma } = await import("@/lib/prisma")

  const where: Record<string, unknown> = {}
  if (startDate && endDate) {
    where.date = { gte: new Date(startDate), lte: new Date(endDate) }
  }
  if (studentId) where.studentId = studentId

  const records = await prisma.attendance.findMany({ where })

  const total = records.length
  const present = records.filter((r: { status: string }) => r.status === "PRESENT").length
  const absent = records.filter((r: { status: string }) => r.status === "ABSENT").length
  const late = records.filter((r: { status: string }) => r.status === "LATE").length

  return NextResponse.json({
    total,
    present,
    absent,
    late,
    percentage: total > 0 ? (present / total) * 100 : 0,
  })
}
