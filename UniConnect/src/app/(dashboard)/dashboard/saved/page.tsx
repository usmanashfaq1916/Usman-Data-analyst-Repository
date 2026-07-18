import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const saved = await prisma.savedUniversity.findMany({
    where: { userId },
    include: {
      university: {
        select: { name: true, slug: true, city: true, province: true, type: true },
      },
    },
    orderBy: { savedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved Universities</h1>
        <p className="text-sm text-muted-foreground">Universities you&apos;ve bookmarked</p>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          title="No saved universities"
          description="Browse universities and save your favorites."
          actionLabel="Browse Universities"
          actionHref="/universities"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((item) => (
            <Link key={item.id} href={`/universities/${item.university.slug}`}>
              <Card className="group h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-secondary">
                    {item.university.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {item.university.city}, {item.university.province}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Saved {item.savedAt.toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
