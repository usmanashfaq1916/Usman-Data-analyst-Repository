"use client"

import { useState } from "react"
import { ClipboardList, CheckCircle, XCircle, Clock } from "lucide-react"

interface StudentRecord {
  id: string
  name: string
  rollNumber: string
  status: string
}

const students: StudentRecord[] = [
  { id: "1", name: "Ali Ahmed", rollNumber: "CS-001", status: "PRESENT" },
  { id: "2", name: "Fatima Khan", rollNumber: "CS-002", status: "PRESENT" },
  { id: "3", name: "Muhammad Usman", rollNumber: "SE-001", status: "ABSENT" },
  { id: "4", name: "Ayesha Malik", rollNumber: "CS-003", status: "LATE" },
  { id: "5", name: "Hassan Raza", rollNumber: "AI-001", status: "PRESENT" },
]

export default function TeacherAttendancePage() {
  const [records, setRecords] = useState(students)
  const [selectedClass, setSelectedClass] = useState("BS CS 4A")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const toggleStatus = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const next = { PRESENT: "ABSENT", ABSENT: "LATE", LATE: "PRESENT" } as Record<string, string>
        return { ...r, status: next[r.status] }
      })
    )
  }

  const present = records.filter((r) => r.status === "PRESENT").length
  const absent = records.filter((r) => r.status === "ABSENT").length
  const late = records.filter((r) => r.status === "LATE").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
        <p className="text-sm text-muted mt-1">Take attendance for your classes.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>BS CS 4A</option>
          <option>BS CS 4B</option>
          <option>BS SE 2A</option>
          <option>BS AI 6A</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-accent">{present}</p>
          <p className="text-xs text-muted">Present</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-red-500">{absent}</p>
          <p className="text-xs text-muted">Absent</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-yellow-500">{late}</p>
          <p className="text-xs text-muted">Late</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 bg-border/50 text-xs font-semibold text-muted uppercase">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Roll No</div>
          <div className="col-span-4">Status</div>
        </div>
        {records.map((r, i) => (
          <div key={r.id} className="grid grid-cols-12 gap-2 p-4 border-t border-border items-center">
            <div className="col-span-1 text-sm text-muted">{i + 1}</div>
            <div className="col-span-4 text-sm font-medium text-foreground">{r.name}</div>
            <div className="col-span-3 text-sm text-muted">{r.rollNumber}</div>
            <div className="col-span-4">
              <button
                onClick={() => toggleStatus(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  r.status === "PRESENT" ? "bg-accent/10 text-accent" :
                  r.status === "ABSENT" ? "bg-red-500/10 text-red-500" :
                  "bg-yellow-500/10 text-yellow-500"
                }`}
              >
                {r.status === "PRESENT" ? <CheckCircle className="h-3 w-3" /> :
                 r.status === "ABSENT" ? <XCircle className="h-3 w-3" /> :
                 <Clock className="h-3 w-3" />}
                {r.status}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
        Save Attendance
      </button>
    </div>
  )
}
