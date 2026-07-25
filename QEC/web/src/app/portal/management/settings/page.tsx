"use client"

import { useState } from "react"
import { Settings, Bell, Shield, Globe, Save } from "lucide-react"

export default function ManagementSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "QEC HMIS",
    academicYear: "2026-2027",
    semester: "Fall 2026",
    lateFeePerDay: "50",
    attendanceThreshold: "75",
    examPassPercentage: "40",
    enableNotifications: true,
    enableOnlinePayments: true,
    enableSelfRegistration: false,
  })

  const update = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted mt-1">Configure system settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />General</h2>
          <div className="space-y-4">
            <div><label className="text-sm text-muted block mb-1">Site Name</label><input type="text" value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="text-sm text-muted block mb-1">Academic Year</label><input type="text" value={settings.academicYear} onChange={(e) => update("academicYear", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="text-sm text-muted block mb-1">Current Semester</label><input type="text" value={settings.semester} onChange={(e) => update("semester", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Academic Rules</h2>
          <div className="space-y-4">
            <div><label className="text-sm text-muted block mb-1">Late Fee Per Day (Rs.)</label><input type="text" value={settings.lateFeePerDay} onChange={(e) => update("lateFeePerDay", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="text-sm text-muted block mb-1">Attendance Threshold (%)</label><input type="text" value={settings.attendanceThreshold} onChange={(e) => update("attendanceThreshold", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="text-sm text-muted block mb-1">Exam Pass Percentage</label><input type="text" value={settings.examPassPercentage} onChange={(e) => update("examPassPercentage", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Features</h2>
          <div className="space-y-4">
            {[
              { key: "enableNotifications", label: "Enable Email Notifications" },
              { key: "enableOnlinePayments", label: "Enable Online Payments" },
              { key: "enableSelfRegistration", label: "Allow Self Registration" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">{label}</span>
                <button
                  onClick={() => update(key, !(settings as any)[key])}
                  className={`relative w-12 h-6 rounded-full transition-colors ${(settings as any)[key] ? "bg-primary" : "bg-border"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${(settings as any)[key] ? "translate-x-6" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
        <Save className="h-4 w-4" />
        Save Settings
      </button>
    </div>
  )
}
