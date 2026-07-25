"use client"

import Link from "next/link"
import { useDashboardData } from "@/lib/useDashboardData"
import { Users, GraduationCap, ClipboardList, TrendingUp, Building2, School, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

interface CampusDist {
  name: string
  students: number
}

const defaultCampusDist: CampusDist[] = [
  { name: "Chowk Begum Kot", students: 420 },
  { name: "Kot Shabudin", students: 280 },
  { name: "Kot Abdul Malik", students: 195 },
  { name: "Al Rehman Garden", students: 225 },
  { name: "Quaid Lyceum", students: 127 },
]

export default function ManagementDashboard() {
  const { data } = useDashboardData()
  const [campusDist, setCampusDist] = useState<CampusDist[]>(defaultCampusDist)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/campuses")
        const campuses = await res.json()
        if (Array.isArray(campuses) && campuses.length > 0) {
          setCampusDist(campuses.map((c: { name: string; _count?: { enrollments: number }; students?: string }) => ({
            name: c.name,
            students: c._count?.enrollments ?? (parseInt(c.students ?? "0") || 0),
          })))
        }
      } catch {
        /* keep defaults */
      }
    }
    load()
  }, [])

  const stats = [
    { label: "Total Students", value: data?.totalStudents ?? 1247, change: "+12%", icon: Users, color: "text-primary" },
    { label: "Teachers", value: data?.totalTeachers ?? 86, change: "+5%", icon: GraduationCap, color: "text-accent" },
    { label: "Campuses", value: data?.totalCampuses ?? 5, change: "0%", icon: Building2, color: "text-blue-500" },
    { label: "Admissions", value: data?.totalAdmissions ?? 342, change: "+18%", icon: ClipboardList, color: "text-yellow-500" },
    { label: "Programs", value: data?.programCount ?? 24, change: "+2", icon: School, color: "text-purple-500" },
    { label: "Active Apps", value: data?.activeAdmissions ?? 45, change: "+8%", icon: TrendingUp, color: "text-green-500" },
  ]

  const admissions: Array<{ id: string; name: string; date: string; status: string }> = (data?.recentAdmissions ?? []).map((a: { applicationId?: string; id: string; studentName: string; createdAt: string; status?: string }) => ({
    id: a.applicationId || a.id,
    name: a.studentName,
    date: a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
    status: a.status || "Submitted",
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Management Dashboard</h1>
        <p className="text-sm text-muted mt-1">Institutional overview and key metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-accent">
                <ArrowUp className="h-3 w-3" />{s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{(s.value ?? 0).toLocaleString()}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" />Recent Admissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 pr-4 text-muted font-medium">App ID</th><th className="text-left py-2 pr-4 text-muted font-medium">Name</th><th className="text-left py-2 pr-4 text-muted font-medium">Date</th><th className="text-right py-2 text-muted font-medium">Status</th></tr></thead>
              <tbody className="divide-y divide-border">
                {admissions.length > 0 ? admissions.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 pr-4 font-mono text-xs text-card-foreground">{a.id}</td>
                    <td className="py-3 pr-4 font-medium text-card-foreground">{a.name}</td>
                    <td className="py-3 pr-4 text-muted">{a.date}</td>
                    <td className="py-3 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        a.status === "Approved" ? "bg-accent/10 text-accent" :
                        a.status === "Submitted" ? "bg-blue-500/10 text-blue-500" :
                        "bg-muted/10 text-muted"
                      }`}>{a.status}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="py-8 text-center text-muted">No admissions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-accent" />Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/portal/management/students" className="block w-full text-left p-3 rounded-lg border border-border bg-background text-sm font-medium text-card-foreground hover:bg-border transition-colors">Manage Students</Link>
              <Link href="/portal/management/teachers" className="block w-full text-left p-3 rounded-lg border border-border bg-background text-sm font-medium text-card-foreground hover:bg-border transition-colors">Manage Staff</Link>
              <Link href="/portal/management/admissions" className="block w-full text-left p-3 rounded-lg border border-border bg-background text-sm font-medium text-card-foreground hover:bg-border transition-colors">View Admissions</Link>
              <Link href="/portal/management/reports" className="block w-full text-left p-3 rounded-lg border border-border bg-background text-sm font-medium text-card-foreground hover:bg-border transition-colors">Generate Reports</Link>
              <Link href="/portal/management/classes" className="block w-full text-left p-3 rounded-lg border border-border bg-background text-sm font-medium text-card-foreground hover:bg-border transition-colors">Fee Management</Link>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card">
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2"><School className="h-5 w-5 text-primary" />Campus Distribution</h2>
            <div className="space-y-2">
              {campusDist.map((c) => (
                <div key={c.name} className="flex justify-between text-sm">
                  <span className="text-card-foreground">{c.name}</span>
                  <span className="text-muted">{c.students} students</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
