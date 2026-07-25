import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const campusId = searchParams.get("campusId")

  const where: Record<string, unknown> = {}
  if (campusId) where.campusId = campusId

  const hostels = await prisma.hostel.findMany({
    where,
    include: { rooms: { orderBy: { roomNumber: "asc" } } },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(hostels)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, type, totalRooms, totalBeds, wardenName, wardenPhone, campusId, address } = body

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 })
    }

    const hostel = await prisma.hostel.create({
      data: { name, type, totalRooms, totalBeds, wardenName, wardenPhone, campusId, address },
    })

    return NextResponse.json(hostel, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create hostel"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
