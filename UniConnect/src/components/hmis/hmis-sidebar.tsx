"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  DollarSign,
  Clock,
  Bell,
  Settings,
  UserCheck,
  Bookmark,
  School,
  Briefcase,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  roles: string[];
};

const ALL_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/hmis/dashboard", roles: ["SUPER_ADMIN", "ADMIN", "CHAIRMAN", "DIRECTOR", "PRINCIPAL", "HOD", "TEACHER", "HR", "STUDENT", "PARENT"] },
  { label: "Students", icon: Users, href: "/hmis/students", roles: ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "HOD", "TEACHER", "HR"] },
  { label: "Teachers", icon: UserCheck, href: "/hmis/teachers", roles: ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "HOD", "HR"] },
  { label: "Employees", icon: Briefcase, href: "/hmis/employees", roles: ["SUPER_ADMIN", "ADMIN", "HR"] },
  { label: "Departments", icon: School, href: "/hmis/departments", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTOR", "PRINCIPAL", "HOD"] },
  { label: "Programs", icon : BookOpen, href: "/hmis/programs", roles: ["SUPER_ADMIN", "ADMIN", "DIRECTOR", "PRINCIPAL", "HOD"] },
  { label: "Classes", icon: GraduationCap, href: "/hmis/classes", roles: ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "HOD", "TEACHER"] },
  { label: "Timetable", icon: Calendar, href: "/hmis/timetable", roles: ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "HOD", "TEACHER", "STUDENT"] },
  { label: "Attendance", icon: ClipboardCheck, href: "/hmis/attendance", roles: ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "HOD", "TEACHER", "HR", "STUDENT", "PARENT"] },
  { label: "Exams", icon: Bookmark, href: "/hmis/exams", roles: ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "HOD", "TEACHER", "STUDENT"] },
  { label: "Fee Management", icon: DollarSign, href: "/hmis/fees", roles: ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "STUDENT", "PARENT"] },
  { label: "Payroll", icon: Clock, href: "/hmis/payroll", roles: ["SUPER_ADMIN", "ADMIN", "HR"] },
  { label: "Reports", icon: BarChart3, href: "/hmis/reports", roles: ["SUPER_ADMIN", "ADMIN", "CHAIRMAN", "DIRECTOR", "PRINCIPAL", "HR"] },
  { label: "Notices", icon: Bell, href: "/hmis/notices", roles: ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "DIRECTOR", "HR"] },
  { label: "Settings", icon: Settings, href: "/hmis/settings", roles: ["SUPER_ADMIN", "ADMIN"] },
];

export function HmisSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role ?? "STUDENT";

  const navItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col h-full">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/hmis" className="text-lg font-bold text-foreground">
          HMIS Portal
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
