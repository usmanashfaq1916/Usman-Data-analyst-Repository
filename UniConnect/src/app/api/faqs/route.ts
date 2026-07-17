import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createFaqSchema } from "@/lib/validations/faq";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const active = searchParams.get("active");
    const category = searchParams.get("category");

    const where: any = {};
    if (active === "true") where.isActive = true;
    if (active === "false") where.isActive = false;
    if (category) where.category = category;

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createFaqSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((e) => e.message).join(", ") },
        { status: 400 },
      );
    }

    const faq = await prisma.fAQ.create({ data: parsed.data });

    return NextResponse.json({ faq, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
