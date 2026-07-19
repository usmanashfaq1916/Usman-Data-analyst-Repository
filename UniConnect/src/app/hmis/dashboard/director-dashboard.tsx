"use client";

import { Users, GraduationCap, School, ClipboardCheck } from "lucide-react";
import { StatCard } from "@/components/hmis/stat-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const deptPerformance = [
  { dept: "CS", performance: 92 },
  { dept: "EE", performance: 88 },
  { dept: "BBA", performance: 85 },
  { dept: "LAW", performance: 90 },
  { dept: "MED", performance: 87 },
];

interface DirectorDashboardProps {
  counts: { students: number; teachers: number; employees: number; departments: number; programs: number; classes: number };
}

export function DirectorDashboard({ counts }: DirectorDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Director Dashboard</h1>
        <p className="text-muted-foreground">Department monitoring and academic oversight</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Departments" value={counts.departments} icon={School} />
        <StatCard title="Students" value={counts.students} icon={Users} />
        <StatCard title="Teachers" value={counts.teachers} icon={GraduationCap} />
        <StatCard title="Avg Attendance" value="93%" icon={ClipboardCheck} trend={{ value: 2, isUp: true }} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold">Department Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deptPerformance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis dataKey="dept" type="category" stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip />
            <Bar dataKey="performance" fill="#0066FF" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
