import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const campusId = searchParams.get("campusId")

  const { prisma } = await import("@/lib/prisma")

  const where: Record<string, unknown> = {}
  if (campusId) where.campusId = campusId

  const fees = await prisma.fee.findMany({ where })

  const totalCollected = fees.filter((f: { status: string }) => f.status === "PAID").reduce((sum: number, f: { paidAmount: number }) => sum + f.paidAmount, 0)
  const totalPending = fees.filter((f: { status: string }) => f.status === "PENDING").reduce((sum: number, f: { amount: number }) => sum + f.amount, 0)
  const totalOverdue = fees.filter((f: { status: string }) => f.status === "OVERDUE").reduce((sum: number, f: { amount: number }) => sum + f.amount, 0)

  return NextResponse.json({
    totalCollected,
    totalPending,
    totalOverdue,
    paidCount: fees.filter((f: { status: string }) => f.status === "PAID").length,
    pendingCount: fees.filter((f: { status: string }) => f.status === "PENDING" || f.status === "OVERDUE").length,
    total: fees.length,
  })
}
