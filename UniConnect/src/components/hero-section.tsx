"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, GraduationCap, BookOpen, ClipboardCheck, Calculator, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GlobalSearch } from "@/components/search/global-search";

const CTAS = [
  { href: "/universities", label: "Explore Universities", icon: GraduationCap },
  { href: "/programs", label: "Search Programs", icon: BookOpen },
  { href: "/admission-alerts", label: "Check Admissions", icon: ClipboardCheck },
  { href: "/merit-calculator", label: "Calculate Merit", icon: Calculator },
  { href: "/chat", label: "Talk to UniConnect AI", icon: Bot },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl gradient-hero px-6 py-16 text-center text-white sm:py-24">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4" />
          Pakistan&apos;s Largest University Admission Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold sm:text-5xl lg:text-6xl"
        >
          Pakistan&apos;s Largest
          <br />
          <span className="text-blue-200">University Admission Platform</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-xl text-lg text-blue-100"
        >
          Search hundreds of universities, compare degree programs, calculate merit,
          discover scholarships, and apply confidently — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto flex justify-center"
        >
          <GlobalSearch />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {CTAS.map((cta) => {
            const Icon = cta.icon;
            return (
              <Link key={cta.href} href={cta.href}>
                <Button
                  variant={cta.href === "/chat" ? "secondary" : "outline"}
                  className={`gap-2 ${
                    cta.href === "/chat"
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500"
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cta.label}
                </Button>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
