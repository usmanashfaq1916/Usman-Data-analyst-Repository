"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { University, BookOpen, Award, Users, ClipboardCheck, Bot } from "lucide-react";

interface StatProps {
  universities: number;
  programs: number;
  scholarships: number;
  admissionAlerts?: number;
}

function AnimatedNumber({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, inView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function StatsSection({ universities, programs, scholarships, admissionAlerts = 100 }: StatProps) {
  const stats = [
    { icon: University, label: "Universities", value: universities, color: "text-secondary" },
    { icon: BookOpen, label: "Programs", value: programs, color: "text-success" },
    { icon: Award, label: "Scholarships", value: scholarships, color: "text-warning" },
    { icon: ClipboardCheck, label: "Admission Alerts", value: admissionAlerts, color: "text-orange-500" },
    { icon: Bot, label: "24/7 AI Assistant", value: 1, color: "text-emerald-500", noPlus: true },
    { icon: Users, label: "Students Assisted", value: 10000, color: "text-purple-600" },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-4 text-center transition-shadow hover:shadow-md"
          >
            <Icon className={`mx-auto h-7 w-7 ${stat.color}`} />
            <p className="mt-2 text-2xl font-bold text-foreground">
              {stat.noPlus ? (
                <span>Available</span>
              ) : (
                <><AnimatedNumber target={stat.value} />+</>
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        );
      })}
    </section>
  );
}

