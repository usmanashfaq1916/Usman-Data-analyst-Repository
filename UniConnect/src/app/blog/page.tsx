import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Blog</h1>
        <p className="mt-1 text-gray-600">
          Tips, guides, and updates for university admissions in Pakistan.
        </p>
      </div>

      {blogs.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Check back later for new articles."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`}>
              <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                {blog.coverUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={blog.coverUrl}
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">{blog.title}</CardTitle>
                  {blog.excerpt && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {blog.excerpt}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="mt-auto flex items-center gap-4 text-xs text-gray-500">
                  {blog.author.name && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {blog.author.name}
                    </span>
                  )}
                  {blog.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {blog.publishedAt.toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
