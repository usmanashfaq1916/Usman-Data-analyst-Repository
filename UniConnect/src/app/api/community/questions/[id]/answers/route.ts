import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const question = await prisma.question.findUnique({ where: { id }, select: { id: true } });
  if (!question) {
    return NextResponse.json({ success: false, error: "Question not found" }, { status: 404 });
  }

  const body = await req.json();
  const { content } = body;

  if (!content?.trim()) {
    return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 });
  }

  const answer = await prisma.answer.create({
    data: {
      content: content.trim(),
      questionId: id,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json({ success: true, data: answer }, { status: 201 });
}
