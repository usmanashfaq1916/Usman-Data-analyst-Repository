import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, phone: true, city: true, province: true, cnic: true, role: true, createdAt: true },
  });

  if (!user) return null;

  const fields = [
    { label: "Full Name", value: user.name || "Not set", icon: User },
    { label: "Email", value: user.email, icon: Mail },
    { label: "Phone", value: user.phone || "Not set", icon: Phone },
    { label: "City", value: user.city || "Not set", icon: MapPin },
    { label: "Province", value: user.province || "Not set", icon: MapPin },
    { label: "CNIC", value: user.cnic || "Not set", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{field.label}</p>
                    <p className="text-sm font-medium">{field.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium">{user.role}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium">{user.createdAt.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
