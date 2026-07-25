"use client"

import { useState } from "react"
import { UserCheck } from "lucide-react"

const subjects = [
  { subject: "Mathematics", present: 22, total: 25 },
  { subject: "Physics", present: 20, total: 25 },
  { subject: "English", present: 24, total: 25 },
  { subject: "Chemistry", present: 19, total: 25 },
]

export default function ParentAttendancePage() {
  const [child] = useState("Ali Ahmed (CS-001)")

  const overall = subjects.reduce((s, c) => ({ present: s.present + c.present, total: s.total + c.total }), { present: 0, total: 0 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted mt-1">Attendance report for {child}.</p>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card">
        <p className="text-sm text-muted">Selected Child</p>
        <p className="font-semibold text-foreground">{child}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-accent">{overall.total > 0 ? Math.round((overall.present / overall.total) * 100) : 0}%</p>
          <p className="text-xs text-muted mt-1">Overall Attendance</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-foreground">{overall.present}</p>
          <p className="text-xs text-muted mt-1">Days Present</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-foreground">{overall.total - overall.present}</p>
          <p className="text-xs text-muted mt-1">Days Absent</p>
        </div>
      </div>

      <div className="space-y-3">
        {subjects.map((s) => (
          <div key={s.subject} className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-accent" />
                {s.subject}
              </h3>
              <span className="text-sm font-medium text-foreground">{s.present}/{s.total}</span>
            </div>
            <div className="h-3 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(s.present / s.total) * 100}%` }} />
            </div>
            <p className="text-xs text-muted mt-2">{Math.round((s.present / s.total) * 100)}% attendance</p>
          </div>
        ))}
      </div>
    </div>
  )
}
