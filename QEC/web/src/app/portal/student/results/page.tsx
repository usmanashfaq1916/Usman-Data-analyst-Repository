"use client"

import { Award, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface ExamResult {
  exam: string
  type: string
  subject: string
  totalMarks: number
  obtainedMarks: number
  grade: string
  date: string
}

const results: ExamResult[] = [
  { exam: "Mid Term", type: "Theory", subject: "Mathematics", totalMarks: 100, obtainedMarks: 87, grade: "A", date: "Mar 15, 2026" },
  { exam: "Mid Term", type: "Theory", subject: "Physics", totalMarks: 100, obtainedMarks: 79, grade: "B+", date: "Mar 18, 2026" },
  { exam: "Mid Term", type: "Theory", subject: "English", totalMarks: 100, obtainedMarks: 91, grade: "A+", date: "Mar 12, 2026" },
  { exam: "Mid Term", type: "Theory", subject: "Chemistry", totalMarks: 100, obtainedMarks: 74, grade: "B", date: "Mar 20, 2026" },
  { exam: "Quiz 1", type: "Quiz", subject: "Mathematics", totalMarks: 20, obtainedMarks: 18, grade: "A", date: "Feb 10, 2026" },
  { exam: "Quiz 1", type: "Quiz", subject: "Physics", totalMarks: 20, obtainedMarks: 16, grade: "B+", date: "Feb 12, 2026" },
]

export default function StudentResultsPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const grouped = results.reduce<Record<string, ExamResult[]>>((acc, r) => {
    if (!acc[r.exam]) acc[r.exam] = []
    acc[r.exam].push(r)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marks & Results</h1>
        <p className="text-sm text-muted mt-1">View your exam results and performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-primary">3.42</p>
          <p className="text-xs text-muted mt-1">Current GPA</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-accent">83.7%</p>
          <p className="text-xs text-muted mt-1">Average Score</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-foreground">A</p>
          <p className="text-xs text-muted mt-1">Overall Grade</p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([exam, records]) => (
          <div key={exam} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === exam ? null : exam)}
              className="w-full flex items-center justify-between p-4 hover:bg-border/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">{exam}</span>
                <span className="text-xs text-muted">({records.length} subjects)</span>
              </div>
              {expanded === exam ? <ChevronUp className="h-4 w-4 text-muted" /> : <ChevronDown className="h-4 w-4 text-muted" />}
            </button>
            {expanded === exam && (
              <div className="px-4 pb-4 space-y-2">
                {records.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.subject}</p>
                      <p className="text-xs text-muted">{r.type} - {r.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{r.obtainedMarks}/{r.totalMarks}</p>
                      <p className="text-xs text-muted">{r.grade}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
