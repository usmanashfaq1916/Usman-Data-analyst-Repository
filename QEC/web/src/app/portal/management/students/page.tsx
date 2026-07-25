"use client"

import { useState } from "react"
import { Users, Search, ChevronRight, MoreHorizontal } from "lucide-react"

const students = [
  { id: "1", name: "Ali Ahmed", rollNumber: "CS-001", program: "BS CS", status: "Active", campus: "Main Campus" },
  { id: "2", name: "Fatima Khan", rollNumber: "CS-002", program: "BS CS", status: "Active", campus: "Main Campus" },
  { id: "3", name: "Muhammad Usman", rollNumber: "SE-001", program: "BS SE", status: "Active", campus: "Main Campus" },
  { id: "4", name: "Ayesha Malik", rollNumber: "CS-003", program: "BS CS", status: "Inactive", campus: "Main Campus" },
  { id: "5", name: "Hassan Raza", rollNumber: "AI-001", program: "BS AI", status: "Active", campus: "City Campus" },
  { id: "6", name: "Sana Tariq", rollNumber: "CS-004", program: "BS CS", status: "Active", campus: "Main Campus" },
]

export default function ManagementStudentsPage() {
  const [search, setSearch] = useState("")

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted mt-1">Manage all enrolled students.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          + Add Student
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-foreground">{students.length}</p>
          <p className="text-xs text-muted mt-1">Total Students</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-accent">{students.filter((s) => s.status === "Active").length}</p>
          <p className="text-xs text-muted mt-1">Active</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-red-500">{students.filter((s) => s.status === "Inactive").length}</p>
          <p className="text-xs text-muted mt-1">Inactive</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 bg-border/50 text-xs font-semibold text-muted uppercase">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Roll No</div>
          <div className="col-span-2">Program</div>
          <div className="col-span-2">Campus</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1" />
        </div>
        {filtered.map((s) => (
          <div key={s.id} className="grid grid-cols-12 gap-2 p-4 border-t border-border items-center">
            <div className="col-span-4 text-sm font-medium text-foreground">{s.name}</div>
            <div className="col-span-2 text-sm text-muted">{s.rollNumber}</div>
            <div className="col-span-2 text-sm text-muted">{s.program}</div>
            <div className="col-span-2 text-sm text-muted">{s.campus}</div>
            <div className="col-span-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                s.status === "Active" ? "bg-accent/10 text-accent" : "bg-red-500/10 text-red-500"
              }`}>{s.status}</span>
            </div>
            <div className="col-span-1 text-right">
              <button className="p-1 text-muted hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
