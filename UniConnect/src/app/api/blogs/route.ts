import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createBlogSchema } from "@/lib/validations/blog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const published = searchParams.get("published");

    const where: any = {};
    if (published === "true") where.isPublished = true;
    if (published === "false") where.isPublished = false;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { author: { select: { name: true } } },
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({ blogs, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createBlogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((e) => e.message).join(", ") },
        { status: 400 },
      );
    }

    const { title, slug, content, excerpt, coverUrl, isPublished } = parsed.data;

    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 409 });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverUrl: coverUrl || null,
        authorId: req.headers.get("x-user-id") || "unknown",
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ blog, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
