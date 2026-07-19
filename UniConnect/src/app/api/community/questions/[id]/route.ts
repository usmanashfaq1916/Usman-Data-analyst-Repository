import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      answers: {
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
        orderBy: { upvotes: "desc" },
      },
      _count: { select: { answers: true } },
    },
  });

  if (!question) {
    return NextResponse.json({ success: false, error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: question });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const question = await prisma.question.findUnique({ where: { id }, select: { authorId: true } });
  if (!question) {
    return NextResponse.json({ success: false, error: "Question not found" }, { status: 404 });
  }
  if (question.authorId !== session.user.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  await prisma.question.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
