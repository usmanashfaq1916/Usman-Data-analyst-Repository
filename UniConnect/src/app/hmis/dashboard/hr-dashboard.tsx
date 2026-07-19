"use client";

import { Users, Clock, DollarSign, ClipboardCheck } from "lucide-react";
import { StatCard } from "@/components/hmis/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HrDashboardProps {
  counts: { students: number; teachers: number; employees: number; departments: number; programs: number; classes: number };
}

export function HrDashboard({ counts }: HrDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <p className="text-muted-foreground">Employee and payroll management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Employees" value={counts.employees} icon={Users} />
        <StatCard title="Present Today" value={Math.round(counts.employees * 0.92)} icon={ClipboardCheck} />
        <StatCard title="On Leave" value={Math.round(counts.employees * 0.05)} icon={Clock} />
        <StatCard title="Payroll This Month" value="Rs. 4.2M" icon={DollarSign} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Ahmed Khan", type: "Annual Leave", days: 5, status: "Pending" },
                { name: "Fatima Ali", type: "Sick Leave", days: 2, status: "Pending" },
                { name: "Bilal Hassan", type: "Casual Leave", days: 1, status: "Approved" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span>{item.type}</span>
                  <span>{item.days} days</span>
                  <span className="text-muted-foreground">{item.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Birthdays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Dr. Usman", dept: "CS", date: "Jul 20" },
                { name: "Ms. Ayesha", dept: "BBA", date: "Jul 22" },
                { name: "Mr. Kamran", dept: "Admin", date: "Jul 25" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span>{item.dept}</span>
                  <span className="text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
