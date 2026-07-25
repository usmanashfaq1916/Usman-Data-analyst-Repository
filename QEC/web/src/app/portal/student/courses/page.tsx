"use client"

import { useState, useEffect } from "react"
import { BookOpen, Clock, Search } from "lucide-react"

interface Course {
  code: string
  name: string
  teacher: string
  schedule: string
  credits?: number
}

export default function StudentCoursesPage() {
  const [search, setSearch] = useState("")
  const [courses] = useState<Course[]>([
    { code: "MTH-101", name: "Mathematics", teacher: "Dr. Ahmed", schedule: "Mon/Wed 9:00-10:30", credits: 3 },
    { code: "PHY-101", name: "Physics", teacher: "Prof. Khan", schedule: "Tue/Thu 9:00-10:30", credits: 4 },
    { code: "ENG-101", name: "English", teacher: "Ms. Fatima", schedule: "Mon/Wed 11:00-12:30", credits: 3 },
    { code: "CHM-101", name: "Chemistry", teacher: "Dr. Ali", schedule: "Tue/Thu 11:00-12:30", credits: 4 },
    { code: "CSC-101", name: "Computer Science", teacher: "Mr. Usman", schedule: "Wed/Fri 2:00-3:30", credits: 3 },
    { code: "ISL-101", name: "Islamic Studies", teacher: "Mr. Hassan", schedule: "Mon/Wed 2:00-3:00", credits: 2 },
  ])

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="text-sm text-muted mt-1">Courses enrolled for the current semester.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => (
          <div key={course.code} className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{course.code}</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{course.name}</h3>
            <p className="text-sm text-muted mb-3">{course.teacher}</p>
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.schedule}</span>
              <span>{course.credits} Credits</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-xl border border-border bg-card">
        <h2 className="font-semibold text-foreground mb-2">Course Summary</h2>
        <p className="text-sm text-muted">Total Enrolled: <strong className="text-foreground">{courses.length}</strong></p>
        <p className="text-sm text-muted">Total Credits: <strong className="text-foreground">{courses.reduce((s, c) => s + (c.credits ?? 0), 0)}</strong></p>
      </div>
    </div>
  )
}
