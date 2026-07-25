"use client"

import { DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"

const fees = [
  { id: "1", title: "Tuition Fee (July)", type: "Tuition", amount: 4000, dueDate: "Jul 15, 2026", status: "PAID", paidDate: "Jul 10, 2026" },
  { id: "2", title: "Lab Fee (July)", type: "Lab", amount: 500, dueDate: "Jul 15, 2026", status: "PAID", paidDate: "Jul 10, 2026" },
  { id: "3", title: "Tuition Fee (August)", type: "Tuition", amount: 4000, dueDate: "Aug 15, 2026", status: "PENDING" },
  { id: "4", title: "Library Fee", type: "Library", amount: 1000, dueDate: "Aug 1, 2026", status: "PENDING" },
]

export default function ParentFeesPage() {
  const totalPaid = fees.filter((f) => f.status === "PAID").reduce((s, f) => s + f.amount, 0)
  const totalPending = fees.filter((f) => f.status !== "PAID").reduce((s, f) => s + f.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fee Details</h1>
        <p className="text-sm text-muted mt-1">View fee records and payment history.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-accent" /></div>
            <div><p className="text-2xl font-bold text-foreground">Rs. {totalPaid.toLocaleString()}</p><p className="text-xs text-muted">Total Paid</p></div>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">Rs. {totalPending.toLocaleString()}</p><p className="text-xs text-muted">Pending</p></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {fees.map((fee) => (
          <div key={fee.id} className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{fee.title}</h3>
                <p className="text-sm text-muted">{fee.type} - Due: {fee.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">Rs. {fee.amount.toLocaleString()}</p>
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${
                  fee.status === "PAID" ? "bg-accent/10 text-accent" : "bg-yellow-500/10 text-yellow-500"
                }`}>
                  {fee.status === "PAID" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {fee.status}
                </span>
              </div>
            </div>
            {fee.status === "PAID" && fee.paidDate && (
              <p className="text-xs text-muted mt-2">Paid on {fee.paidDate}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
