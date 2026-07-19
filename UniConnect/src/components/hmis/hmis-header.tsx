"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Bell, LogOut, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials, cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  students: "Students",
  teachers: "Teachers",
  employees: "Employees",
  departments: "Departments",
  programs: "Programs",
  classes: "Classes",
  timetable: "Timetable",
  attendance: "Attendance",
  exams: "Exams",
  fees: "Fee Management",
  payroll: "Payroll",
  reports: "Reports",
  notices: "Notices",
  settings: "Settings",
};

export function HmisHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;
  const role = (user as any)?.role ?? "";

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = ROUTE_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
    return { href, label };
  });

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          <Home className="h-4 w-4" />
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-muted-foreground hover:text-foreground">
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] text-white">
            3
          </span>
        </Button>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary text-white text-xs">
                  {getInitials(user?.name ?? "User")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{role.toLowerCase().replace("_", " ")}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-danger cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
