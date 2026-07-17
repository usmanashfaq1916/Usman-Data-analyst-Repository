import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminUniversitiesPage() {
  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { programs: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Universities</h1>
        <Button asChild>
          <Link href="/admin/universities/new">Add University</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Province</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Programs</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {universities.map((uni) => (
            <TableRow key={uni.id}>
              <TableCell className="font-medium">
                <Link href={`/admin/universities/${uni.id}`} className="text-secondary hover:underline">
                  {uni.name}
                </Link>
              </TableCell>
              <TableCell>{uni.city}</TableCell>
              <TableCell>{uni.province}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {uni.type === "PUBLIC" ? "Public" : uni.type === "PRIVATE" ? "Private" : "Military"}
                </Badge>
              </TableCell>
              <TableCell>{uni._count.programs}</TableCell>
              <TableCell>
                <Badge variant={uni.isActive ? "success" : "destructive"}>
                  {uni.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
