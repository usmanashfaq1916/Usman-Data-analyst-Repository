import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, University, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [universityCount, programCount, admissionCount, userCount] = await Promise.all([
    prisma.university.count(),
    prisma.program.count(),
    prisma.admission.count(),
    prisma.user.count(),
  ]);

  const stats = [
    { label: "Universities", value: universityCount, icon: University, href: "/admin/universities", color: "text-secondary" },
    { label: "Programs", value: programCount, icon: BookOpen, href: "/admin/programs", color: "text-success" },
    { label: "Admissions", value: admissionCount, icon: Calendar, href: "/admin/admissions", color: "text-warning" },
    { label: "Users", value: userCount, icon: Users, href: "/admin/users", color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your UniConnect platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
