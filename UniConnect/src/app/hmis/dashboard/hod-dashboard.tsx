"use client";

import { Users, GraduationCap, ClipboardCheck, BookOpen } from "lucide-react";
import { StatCard } from "@/components/hmis/stat-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const subjectPerformance = [
  { subject: "Data Structures", avg: 78 },
  { subject: "Algorithms", avg: 72 },
  { subject: "DBMS", avg: 85 },
  { subject: "OS", avg: 68 },
  { subject: "Networks", avg: 74 },
];

interface HodDashboardProps {
  counts: { students: number; teachers: number; employees: number; departments: number; programs: number; classes: number };
}

export function HodDashboard({ counts }: HodDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Department Dashboard</h1>
        <p className="text-muted-foreground">Subject and teacher performance overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Teachers" value={counts.teachers} icon={GraduationCap} />
        <StatCard title="Students" value={counts.students} icon={Users} />
        <StatCard title="Subjects" value={counts.programs * 6} icon={BookOpen} />
        <StatCard title="Attendance" value="91%" icon={ClipboardCheck} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold">Subject-wise Average Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="subject" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip />
            <Bar dataKey="avg" fill="#0066FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
