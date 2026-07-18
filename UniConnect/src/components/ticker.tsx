"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface AlertItem {
  slug: string;
  name: string;
  closeDate: Date;
  daysLeft: number;
}

function getDaysLeft(closeDate: Date) {
  const now = new Date();
  const diff = closeDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function AdmissionTicker({ admissions }: { admissions: AlertItem[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (admissions.length < 2) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % admissions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [admissions.length]);

  if (admissions.length === 0) return null;

  const current = admissions[index];

  return (
    <div className="flex items-center gap-3 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm">
      <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href={`/admission-alerts`}
              className="hover:text-secondary"
            >
              <span className="font-medium">{current.name}</span>
              {" — "}
              <span className="text-warning font-semibold">
                {current.daysLeft > 0
                  ? `${current.daysLeft} days remaining`
                  : "Closing today!"}
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
      <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
    </div>
  );
}
