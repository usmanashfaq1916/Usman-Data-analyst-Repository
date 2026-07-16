'use client'

import { motion } from 'framer-motion'
import { BarChart3, Database, LineChart, PieChart, Workflow, Search, Brain, Terminal } from 'lucide-react'

const focusAreas = [
  { icon: BarChart3, label: 'Data Analytics' },
  { icon: Database, label: 'Python' },
  { icon: Terminal, label: 'SQL' },
  { icon: PieChart, label: 'Power BI & Excel' },
  { icon: LineChart, label: 'Data Visualization' },
  { icon: Workflow, label: 'Automation' },
  { icon: Brain, label: 'Business Intelligence' },
  { icon: Search, label: 'Problem Solving' },
]

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">About Me</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text font-heading">
            Data Analyst who transforms complexity into clarity.
          </h2>
        </motion.div>

        <div className="mt-10 grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <p className="text-base md:text-lg text-muted leading-relaxed">
              I specialize in end-to-end data analytics &mdash; from cleaning and structuring raw datasets
              with Python and SQL to building interactive Power BI and Excel dashboards that drive
              business decisions. Every analysis I deliver is designed to answer a specific question
              and enable action.
            </p>
            <p className="text-base md:text-lg text-muted leading-relaxed">
              My recent work includes sales performance tracking, churn prediction modeling, HR workforce
              analytics, and data cleaning automation &mdash; each project focused on replacing manual
              reporting with scalable, insight-driven solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {focusAreas.map((area) => {
              const Icon = area.icon
              return (
                <div
                  key={area.label}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-text">{area.label}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
