import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { HmisSidebar } from "@/components/hmis/hmis-sidebar";
import { HmisHeader } from "@/components/hmis/hmis-header";

export default async function HmisLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const hmisRoles = ["SUPER_ADMIN", "ADMIN", "CHAIRMAN", "DIRECTOR", "PRINCIPAL", "HOD", "TEACHER", "HR", "STUDENT", "PARENT"];

  if (!hmisRoles.includes(role)) redirect("/");

  return (
    <div className="flex h-screen">
      <HmisSidebar />
      <div className="flex flex-1 flex-col">
        <HmisHeader />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
