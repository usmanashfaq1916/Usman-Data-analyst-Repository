import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { name: "asc" },
    include: { university: { select: { name: true, slug: true } } },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-primary">Programs</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Degree</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Min Aggregate</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.university.name}</TableCell>
              <TableCell>{p.degreeLevel}</TableCell>
              <TableCell>{p.field}</TableCell>
              <TableCell>{p.minAggregate ? `${p.minAggregate}%` : "-"}</TableCell>
              <TableCell>
                <Badge variant={p.isAvailable ? "success" : "destructive"}>
                  {p.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
