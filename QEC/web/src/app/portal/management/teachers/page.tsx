"use client"

import { useState } from "react"
import { GraduationCap, Search, MoreHorizontal } from "lucide-react"

const teachers = [
  { id: "1", name: "Dr. Ahmed", role: "Professor", department: "Computer Science", qualification: "PhD CS", status: "Active" },
  { id: "2", name: "Prof. Khan", role: "Professor", department: "Physics", qualification: "PhD Physics", status: "Active" },
  { id: "3", name: "Ms. Fatima", role: "Lecturer", department: "English", qualification: "MA English", status: "Active" },
  { id: "4", name: "Dr. Ali", role: "Associate Professor", department: "Chemistry", qualification: "PhD Chemistry", status: "Active" },
  { id: "5", name: "Mr. Usman", role: "Lecturer", department: "Computer Science", qualification: "MS CS", status: "Active" },
]

export default function ManagementTeachersPage() {
  const [search, setSearch] = useState("")

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-sm text-muted mt-1">Manage faculty members.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          + Add Teacher
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-foreground">{teachers.length}</p>
          <p className="text-xs text-muted mt-1">Total Teachers</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-primary">{teachers.filter((t) => t.role === "Professor" || t.role === "Associate Professor").length}</p>
          <p className="text-xs text-muted mt-1">Professors</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-accent">{teachers.filter((t) => t.role === "Lecturer").length}</p>
          <p className="text-xs text-muted mt-1">Lecturers</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 bg-border/50 text-xs font-semibold text-muted uppercase">
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-3">Department</div>
          <div className="col-span-2">Qualification</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1" />
        </div>
        {filtered.map((t) => (
          <div key={t.id} className="grid grid-cols-12 gap-2 p-4 border-t border-border items-center">
            <div className="col-span-3 text-sm font-medium text-foreground">{t.name}</div>
            <div className="col-span-2 text-sm text-muted">{t.role}</div>
            <div className="col-span-3 text-sm text-muted">{t.department}</div>
            <div className="col-span-2 text-sm text-muted">{t.qualification}</div>
            <div className="col-span-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">{t.status}</span>
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
