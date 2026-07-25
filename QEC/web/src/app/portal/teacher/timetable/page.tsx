"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const timetable: Record<string, { time: string; course: string; class: string; room: string }[]> = {
  Monday: [
    { time: "9:00 - 10:30", course: "Data Structures", class: "BS CS 4A", room: "Room 101" },
    { time: "11:00 - 12:30", course: "Database Systems", class: "BS CS 4B", room: "Lab 2" },
  ],
  Tuesday: [
    { time: "9:00 - 10:30", course: "Operating Systems", class: "BS CS 4A", room: "Room 101" },
    { time: "2:00 - 3:30", course: "Programming Fundamentals", class: "BS SE 2A", room: "Lab 1" },
  ],
  Wednesday: [
    { time: "9:00 - 10:30", course: "Data Structures", class: "BS CS 4A", room: "Room 101" },
    { time: "11:00 - 12:30", course: "Database Systems", class: "BS CS 4B", room: "Lab 2" },
  ],
  Thursday: [
    { time: "9:00 - 10:30", course: "Operating Systems", class: "BS CS 4A", room: "Room 101" },
  ],
  Friday: [
    { time: "2:00 - 3:30", course: "Machine Learning", class: "BS AI 6A", room: "Lab 3" },
  ],
  Saturday: [],
}

export default function TeacherTimetablePage() {
  const [day, setDay] = useState("Monday")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Timetable</h1>
        <p className="text-sm text-muted mt-1">Weekly teaching schedule.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              day === d ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {timetable[day]?.length > 0 ? (
          timetable[day].map((slot, i) => (
            <div key={i} className="p-5 rounded-xl border border-border bg-card flex items-start gap-4">
              <div className="min-w-[120px]">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <Clock className="h-4 w-4" />
                  {slot.time}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{slot.course}</h3>
                <p className="text-sm text-muted">{slot.class}</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-4 w-4" />
                {slot.room}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 rounded-xl border border-border bg-card text-center">
            <Calendar className="h-10 w-10 text-muted mx-auto mb-2" />
            <p className="text-muted">No classes scheduled for {day}</p>
          </div>
        )}
      </div>
    </div>
  )
}
