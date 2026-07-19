import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const tag = searchParams.get("tag");
  const search = searchParams.get("q");

  const where: any = {};
  if (tag) where.tags = { contains: tag, mode: "insensitive" };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.question.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: questions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, tags } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      tags: tags || null,
      authorId: session.user.id,
    },
  });

  return NextResponse.json({ success: true, data: question }, { status: 201 });
}
