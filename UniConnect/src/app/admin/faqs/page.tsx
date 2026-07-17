import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminFAQsPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-primary">FAQs</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="max-w-md truncate font-medium">{f.question}</TableCell>
              <TableCell>{f.category}</TableCell>
              <TableCell>{f.order}</TableCell>
              <TableCell>
                <Badge variant={f.isActive ? "success" : "destructive"}>
                  {f.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
