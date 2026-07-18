import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

export async function BlogPreview() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  if (blogs.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Latest from Blog</h2>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`}>
            <div className="group h-full rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-md hover:border-secondary/50">
              {blog.coverUrl && (
                <div className="h-40 w-full bg-muted">
                  <img
                    src={blog.coverUrl}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-secondary line-clamp-2">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {blog.excerpt}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{blog.author.name || "Admin"}</span>
                  {blog.publishedAt && (
                    <>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {blog.publishedAt.toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
