"use client";

import { Users, GraduationCap, DollarSign, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/hmis/stat-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const financialData = [
  { month: "Jan", income: 1200000, expense: 800000 },
  { month: "Feb", income: 1350000, expense: 850000 },
  { month: "Mar", income: 1100000, expense: 900000 },
  { month: "Apr", income: 1400000, expense: 820000 },
  { month: "May", income: 1500000, expense: 880000 },
  { month: "Jun", income: 1600000, expense: 920000 },
];

interface ChairmanDashboardProps {
  counts: { students: number; teachers: number; employees: number; departments: number; programs: number; classes: number };
}

export function ChairmanDashboard({ counts }: ChairmanDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chairman Dashboard</h1>
        <p className="text-muted-foreground">Institute performance overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={counts.students} icon={Users} />
        <StatCard title="Total Teachers" value={counts.teachers} icon={GraduationCap} />
        <StatCard title="Departments" value={counts.departments} icon={BarChart3} />
        <StatCard title="Monthly Revenue" value="Rs. 1,280,000" icon={DollarSign} trend={{ value: 12, isUp: true }} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold">Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={financialData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#16A34A" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#DC2626" name="Expenses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
