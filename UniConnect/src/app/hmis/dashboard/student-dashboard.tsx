"use client";

import { Calendar, ClipboardCheck, Bookmark, DollarSign } from "lucide-react";
import { StatCard } from "@/components/hmis/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Your academic overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance" value="92%" icon={ClipboardCheck} trend={{ value: 3, isUp: true }} />
        <StatCard title="Current GPA" value="3.4" icon={Bookmark} description="Out of 4.0" />
        <StatCard title="Fee Status" value="Paid" icon={DollarSign} />
        <StatCard title="Today's Classes" value={4} icon={Calendar} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "08:00 - 09:00", subject: "Data Structures", room: "Room 201" },
                { time: "09:00 - 10:00", subject: "Algorithms", room: "Room 203" },
                { time: "10:30 - 11:30", subject: "Database Systems", room: "Lab 1" },
                { time: "11:30 - 12:30", subject: "Probability", room: "Room 205" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                  <span className="font-medium">{item.time}</span>
                  <span>{item.subject}</span>
                  <span className="text-muted-foreground">{item.room}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Midterm Exam Schedule", date: "Jul 18, 2026" },
                { title: "Fee Submission Deadline", date: "Jul 25, 2026" },
                { title: "Holiday Announcement", date: "Jul 15, 2026" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
