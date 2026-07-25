import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { amount, paymentMethod } = body

    if (!amount || !paymentMethod) {
      return NextResponse.json({ error: "amount and paymentMethod are required" }, { status: 400 })
    }

    const fee = await prisma.fee.update({
      where: { id },
      data: {
        paidAmount: amount,
        status: "PAID",
        paidAt: new Date(),
        paymentMethod,
      },
    })

    return NextResponse.json(fee)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to collect fee"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
