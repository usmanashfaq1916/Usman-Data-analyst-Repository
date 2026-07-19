"use client";

import { Users, GraduationCap, Briefcase, School, BookOpen, DollarSign } from "lucide-react";
import { StatCard } from "@/components/hmis/stat-card";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const studentGrowth = [
  { month: "Jan", students: 1200 }, { month: "Feb", students: 1350 },
  { month: "Mar", students: 1500 }, { month: "Apr", students: 1680 },
  { month: "May", students: 1820 }, { month: "Jun", students: 2100 },
];

const feeCollection = [
  { month: "Jan", collected: 850000, pending: 150000 },
  { month: "Feb", collected: 920000, pending: 120000 },
  { month: "Mar", collected: 880000, pending: 180000 },
  { month: "Apr", collected: 960000, pending: 100000 },
  { month: "May", collected: 1020000, pending: 90000 },
  { month: "Jun", collected: 1100000, pending: 80000 },
];

const genderRatio = [
  { name: "Male", value: 55 },
  { name: "Female", value: 45 },
];

const COLORS = ["#0066FF", "#16A34A"];

interface SuperAdminDashboardProps {
  counts: {
    students: number;
    teachers: number;
    employees: number;
    departments: number;
    programs: number;
    classes: number;
  };
  instituteId: string | null;
}

export function SuperAdminDashboard({ counts, instituteId }: SuperAdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Complete system overview and analytics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Students" value={counts.students} icon={Users} description="Active enrollments" />
        <StatCard title="Total Teachers" value={counts.teachers} icon={GraduationCap} description="Teaching staff" />
        <StatCard title="Total Employees" value={counts.employees} icon={Briefcase} description="All staff" />
        <StatCard title="Departments" value={counts.departments} icon={School} description="Academic departments" />
        <StatCard title="Programs" value={counts.programs} icon={BookOpen} description="Active programs" />
        <StatCard title="Classes" value={counts.classes} icon={DollarSign} description="Active sections" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold">Student Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="students" stroke="#0066FF" fill="#0066FF" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold">Fee Collection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="collected" fill="#0066FF" name="Collected" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#F97316" name="Pending" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold">Gender Ratio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderRatio} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label>
                {genderRatio.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: "New student enrolled", time: "2 minutes ago", type: "success" },
              { action: "Fee payment received", time: "15 minutes ago", type: "info" },
              { action: "Leave request approved", time: "1 hour ago", type: "warning" },
              { action: "Exam results published", time: "3 hours ago", type: "info" },
              { action: "New employee added to CS department", time: "5 hours ago", type: "success" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <span className="flex-1">{activity.action}</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
