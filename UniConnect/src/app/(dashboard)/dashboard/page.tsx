import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, GraduationCap, Bell, Calendar, User, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) return null;

  const [savedCount, applicationCount, unreadNotifications, upcomingDeadlines, user] = await Promise.all([
    prisma.savedUniversity.count({ where: { userId } }),
    prisma.application.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
    prisma.admission.findMany({
      where: { status: { in: ["OPEN", "CLOSING_SOON"] } },
      orderBy: { closeDate: "asc" },
      take: 5,
      include: { university: { select: { name: true, slug: true } } },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true, city: true, province: true, cnic: true },
    }),
  ]);

  const profileFields = [user?.name, user?.email, user?.phone, user?.city, user?.province, user?.cnic];
  const profileCompleted = profileFields.filter(Boolean).length;
  const profileStrength = Math.round((profileCompleted / profileFields.length) * 100);

  const stats = [
    { label: "Saved Universities", value: savedCount, icon: Bookmark, href: "/dashboard/saved", color: "text-secondary" },
    { label: "Applications", value: applicationCount, icon: GraduationCap, href: "/dashboard/applications", color: "text-success" },
    { label: "Notifications", value: unreadNotifications, icon: Bell, href: "/dashboard/notifications", color: "text-warning" },
    { label: "Profile Strength", value: `${profileStrength}%`, icon: TrendingUp, href: "/dashboard/profile", color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name || "Student"}!</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s your overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No upcoming deadlines</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((admission) => {
                  const daysLeft = Math.max(0, Math.ceil((admission.closeDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                  return (
                    <Link
                      key={admission.id}
                      href={`/universities/${admission.university.slug}`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent"
                    >
                      <div>
                        <p className="text-sm font-medium">{admission.university.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Closes: {admission.closeDate.toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <Badge variant={admission.status === "CLOSING_SOON" ? "destructive" : "secondary"}>
                        {daysLeft}d left
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Strength</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <User className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profileStrength}%</p>
                <p className="text-xs text-muted-foreground">Complete your profile for better recommendations</p>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-secondary transition-all"
                style={{ width: `${profileStrength}%` }}
              />
            </div>
            <Link href="/dashboard/profile" className="text-sm text-secondary hover:underline">
              Complete Profile &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
