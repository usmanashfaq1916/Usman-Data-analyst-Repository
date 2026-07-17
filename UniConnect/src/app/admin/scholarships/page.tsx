import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminScholarshipsPage() {
  const scholarships = await prisma.scholarship.findMany({
    orderBy: { deadline: "asc" },
    include: { university: { select: { name: true } } },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-primary">Scholarships</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scholarships.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.university.name}</TableCell>
              <TableCell>{s.type}</TableCell>
              <TableCell>{s.amount ? `PKR ${s.amount.toLocaleString()}` : "-"}</TableCell>
              <TableCell>{s.deadline?.toLocaleDateString() || "-"}</TableCell>
              <TableCell>
                <Badge variant={s.isActive ? "success" : "destructive"}>
                  {s.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
