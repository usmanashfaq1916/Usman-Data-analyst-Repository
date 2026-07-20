"use client";

import { Check, Clock, X, AlertTriangle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface TimelineEvent {
  date: Date;
  label: string;
  status: "completed" | "active" | "upcoming" | "missed";
}

interface AdmissionTimelineProps {
  openDate: Date;
  closeDate: Date;
  status: string;
}

function getEvents(openDate: Date, closeDate: Date, status: string): TimelineEvent[] {
  const now = new Date();
  const events: TimelineEvent[] = [
    {
      date: openDate,
      label: "Admissions Open",
      status: now >= openDate ? "completed" : "upcoming",
    },
    {
      date: new Date(openDate.getTime() + (closeDate.getTime() - openDate.getTime()) / 2),
      label: "Mid-Deadline",
      status: now >= new Date(openDate.getTime() + (closeDate.getTime() - openDate.getTime()) / 2) ? "completed" : now >= openDate ? "active" : "upcoming",
    },
    {
      date: closeDate,
      label: status === "CLOSED" ? "Closed" : "Closing Date",
      status: now >= closeDate ? (status === "CLOSED" ? "missed" : "completed") : status === "CLOSING_SOON" ? "active" : "upcoming",
    },
  ];
  return events;
}

const STATUS_ICONS = {
  completed: Check,
  active: Clock,
  upcoming: Calendar,
  missed: X,
};

const STATUS_COLORS = {
  completed: "bg-emerald-500",
  active: "bg-blue-500",
  upcoming: "bg-gray-300 dark:bg-gray-600",
  missed: "bg-red-500",
};

export function AdmissionTimeline({ openDate, closeDate, status }: AdmissionTimelineProps) {
  const events = getEvents(openDate, closeDate, status);

  return (
    <div className="space-y-4" role="list" aria-label="Admission timeline">
      {events.map((event, i) => {
        const Icon = STATUS_ICONS[event.status];
        return (
          <motion.div
            key={event.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-3"
            role="listitem"
          >
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${STATUS_COLORS[event.status]} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              {i < events.length - 1 && (
                <div className={`mt-1 h-full w-0.5 ${event.status === "completed" ? "bg-emerald-300" : "bg-gray-200 dark:bg-gray-700"}`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`text-sm font-medium ${event.status === "missed" ? "text-red-500" : "text-foreground"}`}>
                {event.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {event.date.toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {event.status === "active" && (
                <Badge variant="warning" className="mt-1 text-xs">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {status === "CLOSING_SOON" ? "Closing Soon" : "In Progress"}
                </Badge>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
