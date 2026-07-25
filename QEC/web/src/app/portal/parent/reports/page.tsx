"use client"

import { TrendingUp, Award, Download } from "lucide-react"

const subjects = [
  { name: "Mathematics", score: 87, grade: "A", total: 100 },
  { name: "Physics", score: 79, grade: "B+", total: 100 },
  { name: "English", score: 91, grade: "A+", total: 100 },
  { name: "Chemistry", score: 74, grade: "B", total: 100 },
]

export default function ParentReportsPage() {
  const average = subjects.reduce((s, c) => s + c.score, 0) / subjects.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Progress Report</h1>
        <p className="text-sm text-muted mt-1">Academic performance overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-primary">{average.toFixed(1)}%</p>
          <p className="text-xs text-muted mt-1">Average Score</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-accent">3.42</p>
          <p className="text-xs text-muted mt-1">GPA</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-foreground">A-</p>
          <p className="text-xs text-muted mt-1">Overall Grade</p>
        </div>
      </div>

      <div className="space-y-3">
        {subjects.map((s) => (
          <div key={s.name} className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                {s.name}
              </h3>
              <span className="text-sm font-semibold text-foreground">{s.score}/{s.total}</span>
            </div>
            <div className="h-3 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(s.score / s.total) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted">{s.score}%</p>
              <p className="text-xs font-medium text-foreground">Grade: {s.grade}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
        <Download className="h-4 w-4" />
        Download Full Report
      </button>
    </div>
  )
}
