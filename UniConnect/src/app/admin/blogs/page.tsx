import { prisma } from "@/lib/db";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Blogs</h1>
        <Button asChild>
          <Link href="/admin/blogs/new">New Post</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="max-w-sm truncate font-medium">
                <Link href={`/blog/${b.slug}`} className="text-secondary hover:underline">
                  {b.title}
                </Link>
              </TableCell>
              <TableCell>{b.author.name || "Unknown"}</TableCell>
              <TableCell>{b.publishedAt?.toLocaleDateString() || "-"}</TableCell>
              <TableCell>
                <Badge variant={b.isPublished ? "success" : "warning"}>
                  {b.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>{b.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
