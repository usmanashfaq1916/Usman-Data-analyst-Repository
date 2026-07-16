'use client'

import { motion } from 'framer-motion'
import { Database, Trash2, Search, Terminal, BarChart3, Lightbulb, ArrowRight, TrendingUp } from 'lucide-react'

const steps = [
  { icon: Database, label: 'Raw Data', desc: 'Collect & ingest' },
  { icon: Trash2, label: 'Data Cleaning', desc: 'Standardize & validate' },
  { icon: Search, label: 'Exploratory Data Analysis', desc: 'Find patterns' },
  { icon: Terminal, label: 'SQL Analysis', desc: 'Query & aggregate' },
  { icon: BarChart3, label: 'Visualization', desc: 'Dashboards & charts' },
  { icon: Lightbulb, label: 'Business Insights', desc: 'Actionable findings' },
  { icon: TrendingUp, label: 'Decision Making', desc: 'Data-driven strategy' },
]

export default function Workflow() {
  return (
    <section id="workflow" className="py-24 md:py-32 bg-card/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">How I Work</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text font-heading">
            How I Work
          </h2>
          <p className="mt-3 text-muted max-w-lg mx-auto">
            From raw data to business decisions &mdash; a structured approach to analytics.
          </p>
        </motion.div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 md:gap-2">
          {steps.map((step, i) => {
            const StepIcon = step.icon
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all min-w-[110px] group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <StepIcon size={20} className="text-primary" />
                  </div>
                  <span className="text-xs font-bold text-text text-center leading-tight">
                    {step.label}
                  </span>
                  <span className="text-[10px] text-muted hidden md:block">{step.desc}</span>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight size={20} className="hidden md:block text-muted/40 flex-shrink-0" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Mobile flow line */}
        <div className="mt-8 md:hidden flex justify-center">
          <div className="flex items-center gap-2 text-muted text-xs">
            <span>Raw</span>
            <ArrowRight size={14} />
            <span>Clean</span>
            <ArrowRight size={14} />
            <span>EDA</span>
            <ArrowRight size={14} />
            <span>SQL</span>
            <ArrowRight size={14} />
            <span>Viz</span>
            <ArrowRight size={14} />
            <span>Insights</span>
            <ArrowRight size={14} />
            <span>Decisions</span>
          </div>
        </div>
      </div>
    </section>
  )
}
