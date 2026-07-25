"use client"

import { useState } from "react"
import { UserCheck, Calendar, Filter } from "lucide-react"

interface AttendanceRecord {
  subject: string
  present: number
  total: number
  records: { date: string; status: string }[]
}

export default function StudentAttendancePage() {
  const [filter, setFilter] = useState("all")
  const [subjects] = useState<AttendanceRecord[]>([
    { subject: "Mathematics", present: 22, total: 25, records: [] },
    { subject: "Physics", present: 20, total: 25, records: [] },
    { subject: "English", present: 24, total: 25, records: [] },
    { subject: "Chemistry", present: 19, total: 25, records: [] },
  ])

  const overall = subjects.reduce((s, c) => ({ present: s.present + c.present, total: s.total + c.total }), { present: 0, total: 0 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted mt-1">Track your attendance across all subjects.</p>
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

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Subjects</option>
          {subjects.map((s) => (<option key={s.subject} value={s.subject}>{s.subject}</option>))}
        </select>
      </div>

      <div className="space-y-3">
        {subjects
          .filter((s) => filter === "all" || s.subject === filter)
          .map((subject) => (
            <div key={subject.subject} className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-accent" />
                  {subject.subject}
                </h3>
                <span className="text-sm font-medium text-foreground">{subject.present}/{subject.total}</span>
              </div>
              <div className="h-3 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${(subject.present / subject.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-2">{Math.round((subject.present / subject.total) * 100)}% attendance</p>
            </div>
          ))}
      </div>
    </div>
  )
}
