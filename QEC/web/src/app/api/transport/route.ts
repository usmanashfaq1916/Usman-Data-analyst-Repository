import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const activeOnly = searchParams.get("activeOnly")

  const where: Record<string, unknown> = {}
  if (activeOnly === "true") where.isActive = true

  const routes = await prisma.busRoute.findMany({
    where,
    orderBy: { routeName: "asc" },
  })

  return NextResponse.json(routes)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { routeName, vehicleNumber, driverName, driverPhone, stops, totalSeats, description } = body

    if (!routeName || !vehicleNumber || !driverName) {
      return NextResponse.json({ error: "routeName, vehicleNumber, and driverName are required" }, { status: 400 })
    }

    const route = await prisma.busRoute.create({
      data: { routeName, vehicleNumber, driverName, driverPhone, stops, totalSeats: totalSeats || 50, description },
    })

    return NextResponse.json(route, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create bus route"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
