'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, ExternalLink, GitFork, Lightbulb, Target, TrendingUp } from 'lucide-react'

const charts = [
  { src: '/projects/techmart/trend_analysis.png', title: 'Monthly & Quarterly Sales Trends', cols: 2 },
  { src: '/projects/techmart/regional_analysis.png', title: 'Regional Performance Comparison' },
  { src: '/projects/techmart/product_category_analysis.png', title: 'Product & Category Analysis' },
  { src: '/projects/techmart/salesperson_performance.png', title: 'Salesperson Performance' },
  { src: '/projects/techmart/discount_analysis.png', title: 'Discount Impact Analysis' },
  { src: '/projects/techmart/cross_analysis.png', title: 'Cross-Region Category Mix', cols: 2 },
  { src: '/projects/techmart/heatmap_month_region.png', title: 'Monthly-Region Revenue Heatmap', cols: 2 },
]

const insights = [
  'Identified seasonal peaks and troughs — highest revenue in Q4, lowest in Q2',
  'Top region outperformed bottom region by 3.2x in revenue',
  'Discount correlation with volume is weak — discounts erode margin without driving sales',
  'Top salesperson generated 5.6x more revenue than bottom performer',
  'Cross-region analysis revealed category mix varies significantly by region',
]

const tools = ['Python', 'Pandas', 'Matplotlib', 'Seaborn']

export default function TechMartPage() {
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
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Case Study</span>
              <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-text font-heading leading-tight">
                TechMart Sales Analysis
              </h1>
              <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl">
                Comprehensive exploratory data analysis on 5,000 sales records to identify growth opportunities,
                regional disparities, and discount strategy optimization.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {tools.map((t) => (
                  <span key={t} className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">{t}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://github.com/usmanashfaq1916/TechMart-Sales-Analysis" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
                  <GitFork size={16} /> View on GitHub
                </a>
                <a href="/projects/techmart" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-card text-text font-semibold rounded-lg border border-border hover:border-primary hover:text-primary transition-all">
                  <ExternalLink size={16} /> Browse Raw Files
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dataset & Problem */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Target size={20} className="text-accent" />
                  <h2 className="text-lg font-bold text-text font-heading">Business Problem</h2>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  TechMart needed to understand sales performance drivers across time periods, regions,
                  product categories, and salespeople to identify growth opportunities and optimize
                  discount strategies.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-text font-heading">Dataset</h2>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  5,000 sales records with product, regional, and salesperson information spanning
                  multiple quarters. Includes revenue, discount, and customer data.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Insights */}
        <section className="py-16 bg-card/30">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-bold text-text font-heading flex items-center gap-3">
                <Lightbulb size={28} className="text-accent" /> Key Insights
              </h2>
              <div className="mt-8 space-y-4">
                {insights.map((insight, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                    <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-accent">{i + 1}</span>
                    </span>
                    <span className="text-sm text-muted">{insight}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Charts Gallery */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-bold text-text font-heading flex items-center gap-3">
                <TrendingUp size={28} className="text-primary" /> Charts &amp; Visualizations
              </h2>
              <p className="mt-2 text-muted">All charts generated during the exploratory data analysis.</p>
            </motion.div>
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {charts.map((chart) => (
                <motion.div key={chart.src} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`${chart.cols === 2 ? 'md:col-span-2' : ''}`}>
                  <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all">
                    <div className="relative w-full" style={{ minHeight: 300 }}>
                      <Image src={chart.src} alt={chart.title} width={800} height={400} className="w-full h-auto object-contain bg-surface" />
                    </div>
                    <div className="p-4 border-t border-border">
                      <h3 className="text-sm font-semibold text-text">{chart.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-card/50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text font-heading">Want to see the full analysis?</h2>
            <p className="mt-3 text-muted">Browse the complete code, dataset, and all visualizations on GitHub.</p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a href="https://github.com/usmanashfaq1916/TechMart-Sales-Analysis" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
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
