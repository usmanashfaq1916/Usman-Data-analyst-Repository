"use client"

import { useState } from "react"
import { Users, Search, Mail, Phone, ChevronRight } from "lucide-react"

const students = [
  { id: "1", name: "Ali Ahmed", rollNumber: "CS-001", program: "BS CS", email: "ali@example.com", phone: "0300-1234567" },
  { id: "2", name: "Fatima Khan", rollNumber: "CS-002", program: "BS CS", email: "fatima@example.com", phone: "0301-2345678" },
  { id: "3", name: "Muhammad Usman", rollNumber: "SE-001", program: "BS SE", email: "usman@example.com", phone: "0302-3456789" },
  { id: "4", name: "Ayesha Malik", rollNumber: "CS-003", program: "BS CS", email: "ayesha@example.com", phone: "0303-4567890" },
  { id: "5", name: "Hassan Raza", rollNumber: "AI-001", program: "BS AI", email: "hassan@example.com", phone: "0304-5678901" },
]

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("")

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Students</h1>
        <p className="text-sm text-muted mt-1">View students across your classes.</p>
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

      <div className="space-y-2">
        {filtered.map((student) => (
          <div key={student.id} className="p-4 rounded-xl border border-border bg-card flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{student.name}</p>
              <p className="text-xs text-muted">{student.rollNumber} | {student.program}</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{student.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{student.phone}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
