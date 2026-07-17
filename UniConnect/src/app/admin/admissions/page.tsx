import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const BADGE_MAP: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  OPEN: "success",
  CLOSING_SOON: "warning",
  UPCOMING: "secondary",
  CLOSED: "destructive",
};

export default async function AdminAdmissionsPage() {
  const admissions = await prisma.admission.findMany({
    orderBy: { closeDate: "asc" },
    include: { university: { select: { name: true } } },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-primary">Admissions</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>University</TableHead>
            <TableHead>Open Date</TableHead>
            <TableHead>Close Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admissions.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.university.name}</TableCell>
              <TableCell>{a.openDate.toLocaleDateString()}</TableCell>
              <TableCell>{a.closeDate.toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={BADGE_MAP[a.status]}>
                  {a.status === "CLOSING_SOON" ? "Closing Soon" : a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
