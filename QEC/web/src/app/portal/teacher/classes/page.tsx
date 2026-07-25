"use client"

import { School, Users, BookOpen } from "lucide-react"

const classes = [
  { id: "1", name: "BS CS 4A", program: "BS Computer Science", section: "A", students: 35, courses: ["Data Structures", "Database Systems", "Operating Systems"] },
  { id: "2", name: "BS CS 4B", program: "BS Computer Science", section: "B", students: 32, courses: ["Data Structures", "Database Systems"] },
  { id: "3", name: "BS SE 2A", program: "BS Software Engineering", section: "A", students: 28, courses: ["Programming Fundamentals", "Discrete Mathematics"] },
  { id: "4", name: "BS AI 6A", program: "BS Artificial Intelligence", section: "A", students: 30, courses: ["Machine Learning", "Deep Learning"] },
]

export default function TeacherClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
        <p className="text-sm text-muted mt-1">Classes assigned to you this semester.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <School className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">{cls.section}</span>
            </div>
            <h3 className="font-semibold text-foreground">{cls.name}</h3>
            <p className="text-sm text-muted mb-3">{cls.program}</p>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{cls.students} Students</span>
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{cls.courses.length} Courses</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
