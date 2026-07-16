'use client'

import { motion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'

const posts = [
  {
    title: 'Building a Sales Analytics Dashboard from Scratch',
    summary: 'How I connected SQL, Python, and Power BI to create a real-time sales performance tracker that cut reporting time by 90%.',
  },
  {
    title: 'Using Machine Learning to Predict Customer Churn',
    summary: 'A walkthrough of the data preprocessing, feature engineering, and model selection process behind my churn prediction project.',
  },
  {
    title: 'Automating Data Cleaning with Python',
    summary: 'Lessons learned from building reusable data cleaning scripts that handle missing values, outliers, and format inconsistencies.',
  },
]

export default function Insights() {
  return (
    <section id="insights" className="py-24 md:py-32 bg-card/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Blog</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text font-heading">
            Insights &amp; Write-ups
          </h2>
          <p className="mt-3 text-muted max-w-lg mx-auto">
            Notes on projects, tools, and lessons from working with data.
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText size={20} className="text-primary" />
              </div>
              <h3 className="text-base font-bold text-text font-heading leading-snug">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {post.summary}
              </p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Read more <ArrowRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
