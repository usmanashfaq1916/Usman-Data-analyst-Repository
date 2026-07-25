import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const studentId = searchParams.get("studentId")
  const status = searchParams.get("status")
  const type = searchParams.get("type")

  const where: Record<string, unknown> = {}
  if (studentId) where.studentId = studentId
  if (status) where.status = status
  if (type) where.type = type

  const fees = await prisma.fee.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(fees)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { studentId, studentName, rollNumber, type, amount, dueDate } = body

    if (!studentId || !type || !amount) {
      return NextResponse.json({ error: "studentId, type, and amount are required" }, { status: 400 })
    }

    const fee = await prisma.fee.create({
      data: {
        studentId,
        studentName,
        rollNumber,
        type,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json(fee, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create fee"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
