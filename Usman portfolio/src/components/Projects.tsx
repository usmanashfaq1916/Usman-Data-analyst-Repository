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

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'TechMart Sales Analysis',
    problem: 'A mid-sized electronics retailer was facing declining sales and needed to understand patterns across regions, products, and time periods to make data-driven inventory and marketing decisions.',
    dataset: '5,000 sales records from 2024, including transaction details, customer demographics, and product categories across 8 regions.',
    tools: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
    solution: 'Performed comprehensive exploratory data analysis to uncover sales trends, regional performance gaps, and actionable business insights from thousands of transaction records.',
    insights: [
      'Sales show clear seasonal peaks in Q4 and troughs in Q2 — 40% variance between best and worst months',
      'Top-performing region generated 3.2x more revenue than the lowest',
      'Discounts show weak correlation with sales volume (r = 0.12) — discounts are not driving demand',
      'Top salesperson generated 5.6x more revenue than the lowest performer',
      'Category mix varies significantly by region — Electronics dominates in one region, Home & Garden in another',
    ],
    results: 'Identified key revenue drivers and seasonal patterns, enabling targeted marketing and inventory strategies projected to increase Q2 sales by 15-20%.',
    code: 'https://github.com/usmanashfaq1916',
    locallink: '/projects/techmart-sales-analysis',
    screenshot: '/projects/techmart-trend.png',
  },
  {
    id: '2',
    title: 'GlobalRetail Data Analysis',
    problem: 'A global retailer was struggling with declining profitability despite growing revenue, high return rates eating into margins, and a lack of customer segmentation for targeted marketing.',
    dataset: '50,000 orders from 2024–2025, spanning 2,000 customers, $87.3M revenue, across multiple regions and product categories.',
    tools: ['Python', 'Pandas', 'Jupyter Notebook', 'Machine Learning'],
    solution: 'Conducted end-to-end analytics including data cleaning, time-series forecasting, profitability analysis, customer segmentation via RFM modeling, and return rate optimization strategies.',
    insights: [
      'Revenue declined 2.8% YoY despite increased order volume — profitability is eroding',
      'Top 20% of customers generate ~29.5% of revenue, highlighting a moderate concentration risk',
      'Return rate of 24.94% caused $4.5M in lost profit — Same Day shipping has the highest return risk',
      'Discount-profit correlation of -0.365 — aggressive discounts are hurting margins significantly',
      'RFM segmentation created 3 customer tiers (High, Medium, Low) enabling targeted retention strategies',
    ],
    results: 'Delivered 22+ visualizations, an interactive sales dashboard, and 3 actionable recommendations projected to recover $2M+ in lost profit annually.',
    code: 'https://github.com/usmanashfaq1916',
    locallink: '/projects/globalretail-data-analysis',
    screenshot: '/projects/globalretail-cohort.png',
  },
]

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
      .then((data) => {
        if (data && data.length > 0) {
          setProjects(data)
        } else {
          setProjects(defaultProjects)
        }
      })
      .catch(() => { setProjects(defaultProjects) })
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
