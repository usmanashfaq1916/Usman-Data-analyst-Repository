import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });

  if (!blog || !blog.isPublished) {
    notFound();
  }

  return (
    <article className="max-w-3xl">
      <Link
        href="/blog"
        className="mb-6 flex items-center gap-1 text-sm text-secondary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {blog.coverUrl && (
        <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={blog.coverUrl}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold text-primary">{blog.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {blog.author.name && (
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {blog.author.name}
          </span>
        )}
        {blog.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {blog.publishedAt.toLocaleDateString("en-PK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      <div className="mt-8">
        <MarkdownRenderer content={blog.content} />
      </div>
    </article>
  );
}
