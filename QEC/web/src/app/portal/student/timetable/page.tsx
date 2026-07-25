"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const timetableData: Record<string, { time: string; course: string; teacher: string; room: string }[]> = {
  Monday: [
    { time: "9:00 - 10:30", course: "Mathematics", teacher: "Dr. Ahmed", room: "Room 101" },
    { time: "11:00 - 12:30", course: "English", teacher: "Ms. Fatima", room: "Room 203" },
    { time: "2:00 - 3:00", course: "Islamic Studies", teacher: "Mr. Hassan", room: "Room 105" },
  ],
  Tuesday: [
    { time: "9:00 - 10:30", course: "Physics", teacher: "Prof. Khan", room: "Lab 1" },
    { time: "11:00 - 12:30", course: "Chemistry", teacher: "Dr. Ali", room: "Lab 2" },
  ],
  Wednesday: [
    { time: "9:00 - 10:30", course: "Mathematics", teacher: "Dr. Ahmed", room: "Room 101" },
    { time: "11:00 - 12:30", course: "English", teacher: "Ms. Fatima", room: "Room 203" },
    { time: "2:00 - 3:30", course: "Computer Science", teacher: "Mr. Usman", room: "Lab 3" },
  ],
  Thursday: [
    { time: "9:00 - 10:30", course: "Physics", teacher: "Prof. Khan", room: "Lab 1" },
    { time: "11:00 - 12:30", course: "Chemistry", teacher: "Dr. Ali", room: "Lab 2" },
  ],
  Friday: [
    { time: "9:00 - 10:30", course: "Computer Science", teacher: "Mr. Usman", room: "Lab 3" },
    { time: "2:00 - 3:30", course: "Islamic Studies", teacher: "Mr. Hassan", room: "Room 105" },
  ],
  Saturday: [],
}

export default function StudentTimetablePage() {
  const [day, setDay] = useState("Monday")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Timetable</h1>
        <p className="text-sm text-muted mt-1">View your class schedule.</p>
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
        {timetableData[day]?.length > 0 ? (
          timetableData[day].map((slot, i) => (
            <div key={i} className="p-5 rounded-xl border border-border bg-card flex items-start gap-4">
              <div className="min-w-[120px]">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <Clock className="h-4 w-4" />
                  {slot.time}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{slot.course}</h3>
                <p className="text-sm text-muted">{slot.teacher}</p>
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
