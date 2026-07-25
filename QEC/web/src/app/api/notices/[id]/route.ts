import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const notice = await prisma.notice.findUnique({ where: { id } })
  if (!notice) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(notice)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const notice = await prisma.notice.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        category: body.category,
        targetRole: body.targetRole,
        isActive: body.isActive,
      },
    })
    return NextResponse.json(notice)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update notice"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.notice.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete notice"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
