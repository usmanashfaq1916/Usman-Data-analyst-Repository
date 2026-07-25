"use client"

import { Bell, Calendar, ChevronRight } from "lucide-react"

const notices = [
  { id: "1", title: "Faculty meeting on July 28", content: "All faculty members are requested to attend the meeting in the conference room at 2:00 PM.", category: "STAFF", date: "Jul 22, 2026", author: "Administration" },
  { id: "2", title: "Exam invigilation schedule", content: "The exam invigilation schedule for mid-terms has been published. Please check your assigned slots.", category: "ACADEMIC", date: "Jul 20, 2026", author: "Examination Branch" },
  { id: "3", title: "New library resources", content: "New research journals and books have been added to the library. Faculty can request access.", category: "GENERAL", date: "Jul 18, 2026", author: "Library" },
  { id: "4", title: "Workshop on AI in Education", content: "A professional development workshop will be held on August 5. Register by July 30.", category: "EVENT", date: "Jul 15, 2026", author: "HR Department" },
]

export default function TeacherNoticesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notices</h1>
        <p className="text-sm text-muted mt-1">Announcements and updates for faculty.</p>
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
