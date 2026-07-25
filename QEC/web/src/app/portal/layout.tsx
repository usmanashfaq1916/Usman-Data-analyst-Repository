"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  LayoutDashboard, BookOpen, Calendar, Users,
  GraduationCap, ClipboardList, BarChart3, Settings, LogOut,
  UserCheck, FileText, DollarSign, TrendingUp, MessageSquare,
  School, Award, Bell, Menu, X, Home
} from "lucide-react"

const roleNav: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  STUDENT: [
    { label: "Dashboard", href: "/portal/student", icon: LayoutDashboard },
    { label: "My Courses", href: "/portal/student/courses", icon: BookOpen },
    { label: "Attendance", href: "/portal/student/attendance", icon: UserCheck },
    { label: "Timetable", href: "/portal/student/timetable", icon: Calendar },
    { label: "Marks & Results", href: "/portal/student/results", icon: Award },
    { label: "Fee Details", href: "/portal/student/fees", icon: DollarSign },
    { label: "Notices", href: "/portal/student/notices", icon: Bell },
  ],
  PARENT: [
    { label: "Dashboard", href: "/portal/parent", icon: LayoutDashboard },
    { label: "Attendance", href: "/portal/parent/attendance", icon: UserCheck },
    { label: "Progress Report", href: "/portal/parent/reports", icon: TrendingUp },
    { label: "Fee Details", href: "/portal/parent/fees", icon: DollarSign },
    { label: "Communication", href: "/portal/parent/communication", icon: MessageSquare },
    { label: "Notices", href: "/portal/parent/notices", icon: Bell },
  ],
  TEACHER: [
    { label: "Dashboard", href: "/portal/teacher", icon: LayoutDashboard },
    { label: "My Classes", href: "/portal/teacher/classes", icon: School },
    { label: "Students", href: "/portal/teacher/students", icon: Users },
    { label: "Attendance", href: "/portal/teacher/attendance", icon: ClipboardList },
    { label: "Marks Entry", href: "/portal/teacher/marks", icon: FileText },
    { label: "Timetable", href: "/portal/teacher/timetable", icon: Calendar },
    { label: "Notices", href: "/portal/teacher/notices", icon: Bell },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/portal/management", icon: LayoutDashboard },
    { label: "Students", href: "/portal/management/students", icon: Users },
    { label: "Teachers", href: "/portal/management/teachers", icon: GraduationCap },
    { label: "Admissions", href: "/portal/management/admissions", icon: ClipboardList },
    { label: "Classes", href: "/portal/management/classes", icon: School },
    { label: "Reports", href: "/portal/management/reports", icon: BarChart3 },
    { label: "Settings", href: "/portal/management/settings", icon: Settings },
  ],
}

// Bottom tab items for mobile (first 5 items)
const bottomTabs: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  STUDENT: [
    { label: "Dashboard", href: "/portal/student", icon: LayoutDashboard },
    { label: "Courses", href: "/portal/student/courses", icon: BookOpen },
    { label: "Attendance", href: "/portal/student/attendance", icon: UserCheck },
    { label: "Fees", href: "/portal/student/fees", icon: DollarSign },
    { label: "Exams", href: "/portal/student/results", icon: Award },
  ],
  PARENT: [
    { label: "Dashboard", href: "/portal/parent", icon: LayoutDashboard },
    { label: "Attendance", href: "/portal/parent/attendance", icon: UserCheck },
    { label: "Reports", href: "/portal/parent/reports", icon: TrendingUp },
    { label: "Fees", href: "/portal/parent/fees", icon: DollarSign },
    { label: "Notices", href: "/portal/parent/notices", icon: Bell },
  ],
  TEACHER: [
    { label: "Dashboard", href: "/portal/teacher", icon: LayoutDashboard },
    { label: "Classes", href: "/portal/teacher/classes", icon: School },
    { label: "Attendance", href: "/portal/teacher/attendance", icon: ClipboardList },
    { label: "Marks", href: "/portal/teacher/marks", icon: FileText },
    { label: "Notices", href: "/portal/teacher/notices", icon: Bell },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/portal/management", icon: LayoutDashboard },
    { label: "Students", href: "/portal/management/students", icon: Users },
    { label: "Teachers", href: "/portal/management/teachers", icon: GraduationCap },
    { label: "Admissions", href: "/portal/management/admissions", icon: ClipboardList },
    { label: "Reports", href: "/portal/management/reports", icon: BarChart3 },
  ],
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = (session?.user?.role as string) ?? "STUDENT"
  const navItems = roleNav[role] ?? roleNav.STUDENT
  const tabs = bottomTabs[role] ?? bottomTabs.STUDENT
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card p-4 gap-1 flex flex-col transform transition-transform duration-200 lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-3 py-3 mb-2">
          <div>
            <p className="text-sm font-semibold text-foreground">{session?.user?.name ?? "User"}</p>
            <p className="text-xs text-muted capitalize">{role.toLowerCase()} Portal</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-border transition-colors lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted hover:text-foreground hover:bg-border"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-border transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto pb-20 lg:pb-8 relative">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 mb-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-border transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Home className="h-4 w-4 text-primary" />
            QEC Portal
          </Link>
        </div>
        {children}
      </main>

      {/* Bottom tab bar - mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-card border-t border-border pb-safe">
        <div className="flex items-center justify-around px-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-3 text-[10px] font-medium transition-colors min-w-0",
                  isActive
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span className="truncate max-w-full">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
