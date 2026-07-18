"use client";

import Link from "next/link";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/universities?q=${encodeURIComponent(query.trim())}`);
    }
  }

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
          Pakistan&apos;s Smartest University Portal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold sm:text-5xl lg:text-6xl"
        >
          One Portal.
          <br />
          <span className="text-blue-200">Every Pakistani University.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-xl text-lg text-blue-100"
        >
          Search universities, find scholarships, calculate merit, compare programs,
          and get AI-powered guidance — all from one place.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search universities, programs, or cities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 pl-10 pr-4 text-base text-gray-900 shadow-lg"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-6 bg-white text-primary hover:bg-blue-50">
            Search
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-200"
        >
          <Link href="/universities" className="flex items-center gap-1 hover:text-white transition-colors">
            Browse Universities <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/scholarships" className="flex items-center gap-1 hover:text-white transition-colors">
            Find Scholarships <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/merit-calculator" className="flex items-center gap-1 hover:text-white transition-colors">
            Calculate Merit <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/compare" className="flex items-center gap-1 hover:text-white transition-colors">
            Compare Unis <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
