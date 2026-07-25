import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const fee = await prisma.fee.findUnique({ where: { id } })
  if (!fee) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(fee)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const fee = await prisma.fee.update({
      where: { id },
      data: {
        amount: body.amount,
        type: body.type,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        status: body.status,
      },
    })
    return NextResponse.json(fee)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update fee"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
