"use client";

import { Users, ClipboardCheck, Bookmark, Clock } from "lucide-react";
import { StatCard } from "@/components/hmis/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeacherDashboardProps {
  counts: { students: number; teachers: number; employees: number; departments: number; programs: number; classes: number };
}

export function TeacherDashboard({ counts }: TeacherDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Your classes and tasks at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Students" value={counts.students} icon={Users} />
        <StatCard title="Today's Classes" value={4} icon={Clock} />
        <StatCard title="Pending Attendance" value={2} icon={ClipboardCheck} />
        <StatCard title="Pending Marks" value={1} icon={Bookmark} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "08:00 - 09:00", subject: "Data Structures", section: "CS-4A" },
                { time: "09:00 - 10:00", subject: "Algorithms", section: "CS-4B" },
                { time: "10:30 - 11:30", subject: "Database Systems", section: "CS-4A" },
                { time: "11:30 - 12:30", subject: "Lab", section: "CS-4B" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                  <span className="font-medium">{item.time}</span>
                  <span>{item.subject}</span>
                  <span className="text-muted-foreground">{item.section}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { student: "Ali Ahmed", assignment: "Assignment 3", status: "Submitted" },
                { student: "Sara Khan", assignment: "Quiz 2", status: "Graded" },
                { student: "Usman Ali", assignment: "Lab Report", status: "Pending" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                  <span className="font-medium">{item.student}</span>
                  <span>{item.assignment}</span>
                  <span className="text-muted-foreground">{item.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
