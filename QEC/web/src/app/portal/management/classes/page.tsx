"use client"

import { School, Users, BookOpen, MoreHorizontal } from "lucide-react"

const classes = [
  { id: "1", name: "BS CS 4A", program: "BS Computer Science", section: "A", students: 35, courses: 4, teacher: "Dr. Ahmed" },
  { id: "2", name: "BS CS 4B", program: "BS Computer Science", section: "B", students: 32, courses: 3, teacher: "Prof. Khan" },
  { id: "3", name: "BS SE 2A", program: "BS Software Engineering", section: "A", students: 28, courses: 4, teacher: "Ms. Fatima" },
  { id: "4", name: "BS AI 6A", program: "BS Artificial Intelligence", section: "A", students: 30, courses: 5, teacher: "Dr. Ali" },
  { id: "5", name: "BS DS 4A", program: "BS Data Science", section: "A", students: 25, courses: 4, teacher: "Mr. Usman" },
]

export default function ManagementClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes</h1>
          <p className="text-sm text-muted mt-1">Manage classes and sections.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          + Add Class
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 bg-border/50 text-xs font-semibold text-muted uppercase">
          <div className="col-span-3">Class</div>
          <div className="col-span-3">Program</div>
          <div className="col-span-1">Section</div>
          <div className="col-span-1">Students</div>
          <div className="col-span-1">Courses</div>
          <div className="col-span-2">Homeroom</div>
          <div className="col-span-1" />
        </div>
        {classes.map((c) => (
          <div key={c.id} className="grid grid-cols-12 gap-2 p-4 border-t border-border items-center">
            <div className="col-span-3 text-sm font-medium text-foreground">{c.name}</div>
            <div className="col-span-3 text-sm text-muted">{c.program}</div>
            <div className="col-span-1 text-sm text-muted">{c.section}</div>
            <div className="col-span-1 text-sm text-foreground">{c.students}</div>
            <div className="col-span-1 text-sm text-muted">{c.courses}</div>
            <div className="col-span-2 text-sm text-muted">{c.teacher}</div>
            <div className="col-span-1 text-right">
              <button className="p-1 text-muted hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
