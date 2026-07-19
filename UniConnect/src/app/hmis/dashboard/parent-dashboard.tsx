"use client";

import { ClipboardCheck, Bookmark, DollarSign, Bell } from "lucide-react";
import { StatCard } from "@/components/hmis/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        <p className="text-muted-foreground">Track your child&apos;s academic progress</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance" value="92%" icon={ClipboardCheck} trend={{ value: 2, isUp: true }} />
        <StatCard title="Current GPA" value="3.4" icon={Bookmark} />
        <StatCard title="Fee Status" value="Paid" icon={DollarSign} />
        <StatCard title="Notifications" value={3} icon={Bell} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { subject: "Data Structures", marks: "85/100", grade: "A" },
                { subject: "Algorithms", marks: "72/100", grade: "B+" },
                { subject: "Database Systems", marks: "90/100", grade: "A+" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                  <span className="font-medium">{item.subject}</span>
                  <span>{item.marks}</span>
                  <span className="font-semibold text-secondary">{item.grade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Midterm exams starting July 25", date: "1 day ago" },
                { title: "Fee submission due July 20", date: "3 days ago" },
                { title: "Parent-teacher meeting on Aug 5", date: "5 days ago" },
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
