'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, ExternalLink, GitFork, Lightbulb, Target, TrendingUp, FileCode } from 'lucide-react'

const steps = [
  {
    title: 'Standardize Missing Values',
    desc: 'Detect and handle NaN, None, and placeholder values across numeric and categorical columns using Pandas.',
  },
  {
    title: 'Remove Duplicates',
    desc: 'Identify and deduplicate records based on key columns to ensure data integrity.',
  },
  {
    title: 'Fix Format Inconsistencies',
    desc: 'Normalize date formats, string casing, and categorical labels into a consistent schema.',
  },
  {
    title: 'Detect & Handle Outliers',
    desc: 'Use IQR and Z-score methods to flag extreme values and decide on treatment (cap, remove, or flag).',
  },
  {
    title: 'Validate & Export',
    desc: 'Run validation checks (null counts, type checks, uniqueness) and export a clean dataset.',
  },
]

const tools = ['Python', 'Pandas', 'NumPy', 'Regex']

export default function DataCleaningPage() {
  return (
    <div className="min-h-screen bg-surface text-text">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
          <Link href="/" className="text-lg font-bold text-primary font-heading">Usman Ashfaq</Link>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 bg-card/50">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Project</span>
              <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-text font-heading leading-tight">
                Automating Data Cleaning with Python
              </h1>
              <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl">
                A reusable Python data cleaning pipeline that handles missing values, outliers, duplicate records,
                and format inconsistencies — cutting manual cleaning time by hours per dataset.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {tools.map((t) => (
                  <span key={t} className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">{t}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://github.com/usmanashfaq1916" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
                  <GitFork size={16} /> View on GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem & Approach */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Target size={20} className="text-accent" />
                  <h2 className="text-lg font-bold text-text font-heading">The Problem</h2>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Raw datasets almost always arrive with missing values, inconsistent formatting, duplicate rows,
                  and outliers that skew analysis. Cleaning this data manually is repetitive, error-prone, and
                  consumes hours that should go into actual analysis.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-text font-heading">The Solution</h2>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  A modular, reusable Python pipeline built with Pandas and NumPy that automates the entire
                  cleaning workflow: missing value detection, deduplication, format normalization, outlier
                  handling, and validation — all configurable per dataset.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pipeline Steps */}
        <section className="py-16 bg-card/30">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-bold text-text font-heading flex items-center gap-3">
                <FileCode size={28} className="text-primary" /> Pipeline Steps
              </h2>
              <div className="mt-8 space-y-4">
                {steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-text">{step.title}</span>
                      <p className="text-sm text-muted mt-0.5">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-card/50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text font-heading">Want to use this pipeline?</h2>
            <p className="mt-3 text-muted">The full reusable cleaning script is available on GitHub with examples and documentation.</p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a href="https://github.com/usmanashfaq1916" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
                <GitFork size={18} /> View on GitHub
              </a>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-card text-text font-semibold rounded-lg border border-border hover:border-primary hover:text-primary transition-all">
                <ArrowLeft size={18} /> Back to Portfolio
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-muted">
          &copy; 2026 Usman Ashfaq
        </div>
      </footer>
    </div>
  )
}