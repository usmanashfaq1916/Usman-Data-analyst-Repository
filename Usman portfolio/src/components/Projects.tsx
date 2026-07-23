'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, GitFork, Lightbulb, Target, BarChart3, FileText } from 'lucide-react'
import Image from 'next/image'

type Project = {
  id: string
  title: string
  problem: string
  dataset: string
  tools: string[]
  solution: string
  insights: string[]
  results: string
  code: string
  demo?: string
  locallink?: string
  screenshot?: string
}

function ProjectScreenshot({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false)
  if (errored) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BarChart3 size={36} className="text-muted/30" />
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={160}
      className="w-full h-full object-cover"
      onError={() => setErrored(true)}
    />
  )
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className="group p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
    >
      <div className="w-full h-40 mb-5 bg-surface rounded-lg border border-border overflow-hidden">
        {p.screenshot ? (
          <ProjectScreenshot src={p.screenshot} alt={`${p.title} screenshot`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BarChart3 size={36} className="text-muted/30" />
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-text font-heading">{p.title}</h3>

      <div className="mt-3 space-y-3 text-sm text-muted leading-relaxed">
        <div className="flex gap-2">
          <Target size={16} className="text-accent flex-shrink-0 mt-0.5" />
          <span><strong className="text-text">Problem:</strong> {p.problem}</span>
        </div>
        <div className="flex gap-2">
          <BarChart3 size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <span><strong className="text-text">Dataset:</strong> {p.dataset}</span>
        </div>
        <div className="flex gap-2">
          <Lightbulb size={16} className="text-accent flex-shrink-0 mt-0.5" />
          <span><strong className="text-text">Solution:</strong> {p.solution}</span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <span className="text-xs font-semibold text-accent uppercase tracking-wider">Key Insights</span>
        <ul className="space-y-1">
          {p.insights.map((insight) => (
            <li key={insight} className="text-xs text-muted flex items-start gap-1.5">
              <span className="text-accent mt-0.5">&#9656;</span>
              {insight}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 p-3 bg-accent/5 border border-accent/10 rounded-lg">
        <span className="text-xs font-semibold text-accent uppercase tracking-wider">Results</span>
        <p className="text-sm text-text mt-0.5">{p.results}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {p.tools.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4 pt-4 border-t border-border">
        <a
          href={p.code}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-primary transition-colors"
        >
          <GitFork size={16} /> Code
        </a>
        {p.locallink && (
          <a
            href={p.locallink}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <FileText size={16} /> View Full Analysis
          </a>
        )}
        {p.demo && (
          <a
            href={p.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-primary transition-colors"
          >
            <ExternalLink size={16} /> Live Demo
          </a>
        )}
        <a
          href={p.code}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-primary transition-colors"
        >
          <ExternalLink size={16} /> Read Case Study
        </a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then(setProjects)
      .catch(() => { setError(true); setLoading(false) })
      .finally(() => setLoading(false))
  }, [])

  if (error) {
    return (
      <section id="projects" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-muted">Failed to load projects.</p>
        </div>
      </section>
    )
  }

  if (loading && projects.length === 0) {
    return (
      <section id="projects" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Portfolio</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text font-heading">
            Featured Projects
          </h2>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
