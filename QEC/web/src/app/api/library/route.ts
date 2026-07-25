import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const search = searchParams.get("search")

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { author: { contains: search, mode: "insensitive" } },
    ]
  }

  const books = await prisma.book.findMany({
    where,
    orderBy: { title: "asc" },
  })

  return NextResponse.json(books)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, author, isbn, publisher, publishYear, category, quantity, availableQuantity } = body

    if (!title || !author) {
      return NextResponse.json({ error: "title and author are required" }, { status: 400 })
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        publisher,
        publishYear,
        category,
        quantity: quantity || 1,
        availableQuantity: availableQuantity ?? quantity ?? 1,
      },
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create book"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
