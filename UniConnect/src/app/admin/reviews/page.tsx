import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } }, university: { select: { name: true } } },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-primary">Reviews</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.user.name || "Anonymous"}</TableCell>
              <TableCell>{r.university.name}</TableCell>
              <TableCell>{r.rating}/5</TableCell>
              <TableCell className="max-w-xs truncate">{r.content || "-"}</TableCell>
              <TableCell>
                <Badge variant={r.isApproved ? "success" : "warning"}>
                  {r.isApproved ? "Approved" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell>{r.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
