"use client"

import { useState } from "react"
import { ClipboardList, Search, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"

const admissions = [
  { id: "1", name: "Bilal Ahmed", program: "BS CS", campus: "Main Campus", status: "Approved", date: "Jul 20, 2026" },
  { id: "2", name: "Sara Khan", program: "BS SE", campus: "Main Campus", status: "Pending", date: "Jul 19, 2026" },
  { id: "3", name: "Omar Farooq", program: "BS AI", campus: "City Campus", status: "Submitted", date: "Jul 18, 2026" },
  { id: "4", name: "Zainab Ali", program: "BS CS", campus: "Main Campus", status: "Approved", date: "Jul 17, 2026" },
  { id: "5", name: "Hamza Malik", program: "BS DS", campus: "City Campus", status: "Rejected", date: "Jul 16, 2026" },
]

export default function ManagementAdmissionsPage() {
  const [filter, setFilter] = useState("all")

  const filtered = filter === "all" ? admissions : admissions.filter((a) => a.status.toLowerCase() === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admissions</h1>
        <p className="text-sm text-muted mt-1">Manage admission applications.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-foreground">{admissions.length}</p>
          <p className="text-xs text-muted mt-1">Total</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-yellow-500">{admissions.filter((a) => a.status === "Pending" || a.status === "Submitted").length}</p>
          <p className="text-xs text-muted mt-1">Pending</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-accent">{admissions.filter((a) => a.status === "Approved").length}</p>
          <p className="text-xs text-muted mt-1">Approved</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card text-center">
          <p className="text-3xl font-bold text-red-500">{admissions.filter((a) => a.status === "Rejected").length}</p>
          <p className="text-xs text-muted mt-1">Rejected</p>
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "submitted", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 bg-border/50 text-xs font-semibold text-muted uppercase">
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Program</div>
          <div className="col-span-2">Campus</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1" />
        </div>
        {filtered.map((a) => (
          <div key={a.id} className="grid grid-cols-12 gap-2 p-4 border-t border-border items-center">
            <div className="col-span-3 text-sm font-medium text-foreground">{a.name}</div>
            <div className="col-span-2 text-sm text-muted">{a.program}</div>
            <div className="col-span-2 text-sm text-muted">{a.campus}</div>
            <div className="col-span-2 text-sm text-muted">{a.date}</div>
            <div className="col-span-2">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                a.status === "Approved" ? "bg-accent/10 text-accent" :
                a.status === "Rejected" ? "bg-red-500/10 text-red-500" :
                "bg-yellow-500/10 text-yellow-500"
              }`}>
                {a.status === "Approved" ? <CheckCircle className="h-3 w-3" /> :
                 a.status === "Rejected" ? <XCircle className="h-3 w-3" /> :
                 <ClipboardList className="h-3 w-3" />}
                {a.status}
              </span>
            </div>
            <div className="col-span-1 text-right">
              <button className="p-1 text-muted hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
