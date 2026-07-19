"use client";

import { Users, GraduationCap, ClipboardCheck, BookOpen, Clock } from "lucide-react";
import { StatCard } from "@/components/hmis/stat-card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const enrollmentData = [
  { month: "Jan", students: 400 },
  { month: "Feb", students: 420 },
  { month: "Mar", students: 480 },
  { month: "Apr", students: 520 },
  { month: "May", students: 560 },
  { month: "Jun", students: 600 },
];

interface PrincipalDashboardProps {
  counts: { students: number; teachers: number; employees: number; departments: number; programs: number; classes: number };
}

export function PrincipalDashboard({ counts }: PrincipalDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Principal Dashboard</h1>
        <p className="text-muted-foreground">Student and faculty management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={counts.students} icon={Users} />
        <StatCard title="Faculty" value={counts.teachers} icon={GraduationCap} />
        <StatCard title="Programs" value={counts.programs} icon={BookOpen} />
        <StatCard title="Attendance" value="94%" icon={ClipboardCheck} trend={{ value: 1, isUp: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold">Enrollment Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="students" stroke="#0066FF" fill="#0066FF" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold">Today's Schedule</h3>
          <div className="space-y-3">
            {[
              { time: "08:00 AM", event: "Faculty Meeting", room: "Conference Room A" },
              { time: "10:00 AM", event: "Department Review", room: "Principal's Office" },
              { time: "12:00 PM", event: "Student Council Meeting", room: "Auditorium" },
              { time: "02:00 PM", event: "Academic Committee", room: "Board Room" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{item.time}</span>
                <span>{item.event}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.room}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
