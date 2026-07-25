"use client"

import { BarChart3, TrendingUp, Users, DollarSign, Download } from "lucide-react"

export default function ManagementReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted mt-1">Analytics and institutional reports.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">1,247</p><p className="text-xs text-muted">Enrolled Students</p></div>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-accent" /></div>
            <div><p className="text-2xl font-bold text-foreground">87%</p><p className="text-xs text-muted">Avg Attendance</p></div>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-yellow-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">Rs. 4.2M</p><p className="text-xs text-muted">Fee Collected</p></div>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><BarChart3 className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">3.6</p><p className="text-xs text-muted">Avg GPA</p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="font-bold text-foreground mb-4">Enrollment by Program</h2>
          <div className="space-y-3">
            {[
              { program: "BS Computer Science", count: 420, pct: 34 },
              { program: "BS Software Engineering", count: 310, pct: 25 },
              { program: "BS Artificial Intelligence", count: 280, pct: 22 },
              { program: "BS Data Science", count: 237, pct: 19 },
            ].map((p) => (
              <div key={p.program}>
                <div className="flex justify-between text-sm mb-1"><span className="text-card-foreground">{p.program}</span><span className="text-muted">{p.count}</span></div>
                <div className="h-2.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="font-bold text-foreground mb-4">Quick Reports</h2>
          <div className="space-y-3">
            {["Student List", "Teacher List", "Attendance Summary", "Fee Report", "Exam Results", "Class Rosters"].map((r) => (
              <div key={r} className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-border/50 transition-colors cursor-pointer">
                <span className="text-sm text-card-foreground">{r}</span>
                <Download className="h-4 w-4 text-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
