"use client"

import { Bell, Calendar, ChevronRight } from "lucide-react"

const notices = [
  { id: "1", title: "Parent-teacher meeting", content: "Parent-teacher meeting is scheduled for July 25, 2026 at 10:00 AM in the main auditorium.", category: "GENERAL", date: "Jul 15, 2026", author: "Administration" },
  { id: "2", title: "Mid-term exams schedule", content: "Mid-term examinations will begin from August 1, 2026. Please ensure your child is prepared.", category: "ACADEMIC", date: "Jul 20, 2026", author: "Examination Branch" },
  { id: "3", title: "School closed on July 28", content: "The institution will remain closed on July 28 on account of a public holiday.", category: "GENERAL", date: "Jul 18, 2026", author: "Administration" },
  { id: "4", title: "Science fair registration", content: "The annual science fair will be held on August 15. Interested students should register by July 30.", category: "EVENT", date: "Jul 18, 2026", author: "Science Department" },
]

export default function ParentNoticesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notices</h1>
        <p className="text-sm text-muted mt-1">Important announcements for parents.</p>
      </div>

      <div className="space-y-3">
        {notices.map((notice) => (
          <div key={notice.id} className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{notice.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">{notice.category}</span>
                </div>
                <p className="text-sm text-muted line-clamp-2">{notice.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{notice.date}</span>
                  <span>{notice.author}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
