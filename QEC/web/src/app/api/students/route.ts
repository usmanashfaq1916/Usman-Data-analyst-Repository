import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const search = searchParams.get("search")
  const campusId = searchParams.get("campusId")
  const status = searchParams.get("status")

  const where: Record<string, unknown> = {}
  if (search) where.name = { contains: search, mode: "insensitive" }
  if (campusId) where.campusId = campusId
  if (status) where.status = status

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { campus: true, program: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.student.count({ where }),
  ])

  return NextResponse.json({ students, total, page, limit })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, rollNumber, fatherName, dateOfBirth, gender, phone, address, campusId, programId, enrollmentYear } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const student = await prisma.student.create({
      data: {
        userId: body.userId || "manual",
        name,
        fatherName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        phone,
        address,
        campusId,
        programId,
        enrollmentYear,
      },
      include: { campus: true, program: true },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create student"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
