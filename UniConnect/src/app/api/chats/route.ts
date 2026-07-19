import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json([], { status: 401 });

  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return NextResponse.json(chats);
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, messages } = await req.json();

  const chat = await prisma.chat.create({
    data: {
      userId,
      title: title || "AI Chat",
      messages: JSON.stringify(messages || []),
    },
  });

  return NextResponse.json(chat);
}
