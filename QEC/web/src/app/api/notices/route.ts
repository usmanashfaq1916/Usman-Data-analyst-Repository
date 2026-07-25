import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const category = searchParams.get("category")
  const targetRole = searchParams.get("targetRole")

  const where: Record<string, unknown> = { isActive: true }
  if (category) where.category = category
  if (targetRole) where.targetRole = targetRole

  const notices = await prisma.notice.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json(notices)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, content, category, targetRole, authorId, authorName } = body

    if (!title || !content) {
      return NextResponse.json({ error: "title and content are required" }, { status: 400 })
    }

    const notice = await prisma.notice.create({
      data: { title, content, category: category || "GENERAL", targetRole, authorId, authorName },
    })

    return NextResponse.json(notice, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create notice"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
