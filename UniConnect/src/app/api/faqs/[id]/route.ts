import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateFaqSchema } from "@/lib/validations/faq";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const faq = await prisma.fAQ.findUnique({ where: { id } });

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json({ faq });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateFaqSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((e) => e.message).join(", ") },
        { status: 400 },
      );
    }

    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ faq, success: true });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    await prisma.fAQ.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
