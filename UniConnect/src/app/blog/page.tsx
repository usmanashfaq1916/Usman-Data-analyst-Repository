import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { BlogCategoryFilter } from "@/components/blog-category-filter";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  ADMISSIONS: "Admissions",
  SCHOLARSHIPS: "Scholarships",
  CAREER: "Career",
  TECHNOLOGY: "Technology",
  STUDY_TIPS: "Study Tips",
  AI: "AI",
  GENERAL: "General",
};

export default async function BlogPage(props: { searchParams?: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const category = searchParams?.category;

  const where: any = { isPublished: true };
  if (category) where.category = category;

  const blogs = await prisma.blog.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Blog</h1>
        <p className="mt-1 text-muted-foreground">
          Tips, guides, and updates for university admissions in Pakistan.
        </p>
      </div>

      <BlogCategoryFilter />

      {blogs.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No posts found in this category.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`}>
              <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                {blog.coverUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={blog.coverUrl}
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {blog.category}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">{blog.title}</CardTitle>
                  {blog.excerpt && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {blog.excerpt}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
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
