"use client"

import { MessageSquare, Send, Calendar } from "lucide-react"
import { useState } from "react"

const conversations = [
  { id: "1", from: "Dr. Ahmed (Mathematics)", subject: "Mid-term performance", preview: "Ali has shown good improvement in mathematics...", date: "Jul 22, 2026", unread: true },
  { id: "2", from: "Prof. Khan (Physics)", subject: "Lab report submission", preview: "The physics lab report is due on Friday...", date: "Jul 20, 2026", unread: false },
  { id: "3", from: "Admin Office", subject: "Fee due reminder", preview: "This is a reminder that the August tuition fee...", date: "Jul 18, 2026", unread: false },
]

export default function ParentCommunicationPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Communication</h1>
        <p className="text-sm text-muted mt-1">Messages from teachers and administration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selected === c.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-border/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{c.from}</p>
                </div>
                {c.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="text-xs font-medium text-foreground truncate">{c.subject}</p>
              <p className="text-xs text-muted truncate mt-1">{c.preview}</p>
              <p className="text-xs text-muted mt-1">{c.date}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="p-5 rounded-xl border border-border bg-card h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center text-muted">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3" />
                  <p>Select a conversation to view messages</p>
                  <p className="text-sm mt-1">Full messaging will be available in the next update</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-border">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-xl border border-border bg-card flex items-center justify-center">
              <div className="text-center text-muted">
                <MessageSquare className="h-12 w-12 mx-auto mb-3" />
                <p>Select a conversation to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
