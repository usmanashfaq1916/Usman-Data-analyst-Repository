"use client"

import { useState } from "react"
import { FileText, Search, Save } from "lucide-react"

const students = [
  { id: "1", name: "Ali Ahmed", rollNumber: "CS-001" },
  { id: "2", name: "Fatima Khan", rollNumber: "CS-002" },
  { id: "3", name: "Muhammad Usman", rollNumber: "SE-001" },
  { id: "4", name: "Ayesha Malik", rollNumber: "CS-003" },
  { id: "5", name: "Hassan Raza", rollNumber: "AI-001" },
]

export default function TeacherMarksPage() {
  const [examType, setExamType] = useState("Mid Term")
  const [selectedSubject, setSelectedSubject] = useState("Data Structures")
  const [marks, setMarks] = useState<Record<string, string>>({})
  const [search, setSearch] = useState("")

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const updateMarks = (id: string, value: string) => {
    setMarks((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marks Entry</h1>
        <p className="text-sm text-muted mt-1">Enter marks for exams and assessments.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>Data Structures</option>
          <option>Database Systems</option>
          <option>Operating Systems</option>
        </select>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>Mid Term</option>
          <option>Final Term</option>
          <option>Quiz</option>
          <option>Assignment</option>
        </select>
        <input
          type="number"
          placeholder="Total Marks"
          defaultValue={100}
          className="w-28 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 bg-border/50 text-xs font-semibold text-muted uppercase">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Roll No</div>
          <div className="col-span-4">Marks</div>
        </div>
        {filtered.map((s, i) => (
          <div key={s.id} className="grid grid-cols-12 gap-2 p-4 border-t border-border items-center">
            <div className="col-span-1 text-sm text-muted">{i + 1}</div>
            <div className="col-span-4 text-sm font-medium text-foreground">{s.name}</div>
            <div className="col-span-3 text-sm text-muted">{s.rollNumber}</div>
            <div className="col-span-4">
              <input
                type="number"
                value={marks[s.id] ?? ""}
                onChange={(e) => updateMarks(s.id, e.target.value)}
                placeholder="0"
                className="w-24 px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
        <Save className="h-4 w-4" />
        Save Marks
      </button>
    </div>
  )
}
