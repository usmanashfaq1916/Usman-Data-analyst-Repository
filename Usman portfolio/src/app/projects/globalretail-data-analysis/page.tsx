'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, FileText, GitFork, Lightbulb, Target, TrendingUp, Database, DollarSign, PieChart } from 'lucide-react'

const overviewStats = [
  { icon: Database, label: 'Orders', value: '50,000' },
  { icon: DollarSign, label: 'Total Revenue', value: '$87.3M' },
  { icon: TrendingUp, label: 'Total Profit', value: '$18.1M' },
  { icon: PieChart, label: 'Return Rate', value: '24.9%' },
]

const chartCategories = [
  {
    title: 'Time-Series Analysis',
    charts: [
      { src: '/projects/globalretail/charts/task2_monthly_trends.png', title: 'Monthly Revenue Trends' },
      { src: '/projects/globalretail/charts/task2_seasonality.png', title: 'Seasonality Pattern' },
      { src: '/projects/globalretail/charts/task2_yoy_bar.png', title: 'Year-over-Year Comparison' },
      { src: '/projects/globalretail/charts/task2_yoy_growth.png', title: 'YoY Growth Rate' },
    ],
  },
  {
    title: 'Profitability Analysis',
    charts: [
      { src: '/projects/globalretail/charts/task3_discount_correlation.png', title: 'Discount-Profit Correlation' },
      { src: '/projects/globalretail/charts/task3_negative_orders.png', title: 'Negative Profit Orders' },
      { src: '/projects/globalretail/charts/task3_profit_margins.png', title: 'Profit Margin Distribution' },
    ],
  },
  {
    title: 'Customer Segmentation',
    charts: [
      { src: '/projects/globalretail/charts/task4_pareto.png', title: 'Pareto Analysis — Top Customers' },
      { src: '/projects/globalretail/charts/task4_rfm_combined.png', title: 'RFM Segmentation' },
      { src: '/projects/globalretail/charts/task4_rfm_distribution.png', title: 'RFM Segment Distribution' },
    ],
  },
  {
    title: 'Returns & Shipping Analysis',
    charts: [
      { src: '/projects/globalretail/charts/task5_return_breakdowns.png', title: 'Return Breakdown by Category' },
      { src: '/projects/globalretail/charts/task5_return_loss.png', title: 'Revenue Lost to Returns' },
      { src: '/projects/globalretail/charts/task5_return_pie.png', title: 'Return Rate by Product' },
      { src: '/projects/globalretail/charts/task5_shipping_return_rate.png', title: 'Shipping Mode vs Return Rate' },
      { src: '/projects/globalretail/charts/task6_payment_methods.png', title: 'Payment Method Distribution' },
      { src: '/projects/globalretail/charts/task6_shipping_preferences.png', title: 'Shipping Mode Preferences' },
      { src: '/projects/globalretail/charts/task6_shipping_rating.png', title: 'Shipping Rating Analysis' },
    ],
  },
  {
    title: 'Salesperson & Advanced Analysis',
    charts: [
      { src: '/projects/globalretail/charts/task7_salesperson_performance.png', title: 'Salesperson Performance' },
      { src: '/projects/globalretail/charts/task9_cohort_retention.png', title: 'Cohort Retention Heatmap' },
      { src: '/projects/globalretail/charts/task9_feature_importance.png', title: 'Feature Importance (Logistic Regression)' },
      { src: '/projects/globalretail/charts/task9_rfm_tiers.png', title: 'RFM Tiers Distribution' },
    ],
  },
]

const insights = [
  'Revenue declined 2.8% YoY — need for growth strategy reversal',
  'Top 20% of customers generate ~29.5% of total revenue',
  'Return rate of 24.94% resulting in $4.5M in lost profit',
  'Discount-profit margin correlation of -0.365 — higher discounts hurt margins',
  'RFM segmentation created 3 customer tiers for targeted marketing',
]

const tools = ['Python', 'Pandas', 'Jupyter Notebook', 'Machine Learning']

export default function GlobalRetailPage() {
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
                GlobalRetail Data Analysis
              </h1>
              <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl">
                End-to-end retail analytics on 50,000 orders including time-series analysis, profitability
                analysis, customer segmentation (RFM), returns analysis, and predictive modeling.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {tools.map((t) => (
                  <span key={t} className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">{t}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://github.com/usmanashfaq1916/GlobalRetail-Data-Analysis" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
                  <GitFork size={16} /> View on GitHub
                </a>
                <a href="/projects/globalretail/analysis_slides.slides.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-card text-text font-semibold rounded-lg border border-border hover:border-primary hover:text-primary transition-all">
                  <FileText size={16} /> View Presentation Slides
                </a>
                <a href="/projects/globalretail" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-card text-text font-semibold rounded-lg border border-border hover:border-primary hover:text-primary transition-all">
                  <ExternalLink size={16} /> Browse Raw Files
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {overviewStats.map((stat, i) => {
                const StatIcon = stat.icon
                return (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center p-6 bg-card rounded-xl border border-border">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <StatIcon size={20} className="text-primary" />
                    </div>
                    <div className="text-2xl md:text-3xl font-extrabold text-primary font-heading">{stat.value}</div>
                    <div className="mt-1 text-xs text-muted font-medium">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Target size={20} className="text-accent" />
                  <h2 className="text-lg font-bold text-text font-heading">Business Problem</h2>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  GlobalRetail needed a comprehensive understanding of 50,000 orders to identify
                  profitability drivers, customer segments, return patterns, and year-over-year
                  growth trends.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-text font-heading">Solution</h2>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  End-to-end analytics pipeline covering data cleaning, time-series analysis,
                  profitability analysis, RFM customer segmentation, returns analysis, payment/shipping
                  analysis, and logistic regression predictive modeling.
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
        {chartCategories.map((cat) => (
          <section key={cat.title} className="py-16">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl md:text-3xl font-bold text-text font-heading">{cat.title}</h2>
              </motion.div>
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                {cat.charts.map((chart) => (
                  <motion.div key={chart.src} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all">
                      <div className="relative w-full bg-surface" style={{ minHeight: 250 }}>
                        <Image src={chart.src} alt={chart.title} width={600} height={300} className="w-full h-auto object-contain" />
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
        ))}

        {/* Presentation Slides */}
        <section className="py-16 bg-card/30">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-bold text-text font-heading flex items-center gap-3">
                <FileText size={28} className="text-primary" /> Presentation Slides
              </h2>
              <p className="mt-2 text-muted">Full analysis summary in slide format.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-8">
              <iframe
                src="/projects/globalretail/analysis_slides.slides.html"
                className="w-full h-[500px] md:h-[700px] rounded-xl border border-border bg-white"
                title="GlobalRetail Analysis Slides"
              />
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text font-heading">Explore the full project</h2>
            <p className="mt-3 text-muted">Browse the complete analysis notebook, code, and all visualizations.</p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a href="https://github.com/usmanashfaq1916/GlobalRetail-Data-Analysis" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
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
