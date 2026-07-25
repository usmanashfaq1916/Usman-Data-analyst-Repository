import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const departmentId = searchParams.get("departmentId")

  const where: Record<string, unknown> = {}
  if (departmentId) where.departmentId = departmentId

  const [faculty, total] = await Promise.all([
    prisma.faculty.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { department: true, user: { select: { email: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.faculty.count({ where }),
  ])

  return NextResponse.json({ teachers: faculty, total, page, limit })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, role, qualification, experience, departmentId, userId } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const faculty = await prisma.faculty.create({
      data: {
        userId: userId || `fac-${Date.now()}`,
        name,
        role: role || "TEACHER",
        qualification,
        experience,
        departmentId,
      },
      include: { department: true },
    })

    return NextResponse.json(faculty, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create faculty"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
