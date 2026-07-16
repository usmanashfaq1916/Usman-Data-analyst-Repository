'use client'

import { motion } from 'framer-motion'
import { ExternalLink, GitFork, Star, Code2, BookOpen, BarChart3 } from 'lucide-react'

const repos = [
  { name: 'Sales-Analytics-Dashboard', lang: 'Python', stars: 12, forks: 4 },
  { name: 'Customer-Churn-Prediction', lang: 'Jupyter Notebook', stars: 9, forks: 3 },
  { name: 'HR-Analytics-PowerBI', lang: 'Power BI', stars: 7, forks: 2 },
  { name: 'Data-Cleaning-Automation', lang: 'Python', stars: 5, forks: 1 },
  { name: 'TechMart-Sales-Analysis', lang: 'Python', stars: 4, forks: 1 },
  { name: 'GlobalRetail-Data-Analysis', lang: 'Jupyter Notebook', stars: 3, forks: 0 },
]

const languageStats = [
  { lang: 'Python', percentage: 50, color: 'bg-blue-500' },
  { lang: 'Jupyter Notebook', percentage: 33, color: 'bg-orange-500' },
  { lang: 'Power BI', percentage: 17, color: 'bg-yellow-500' },
]

export default function GitHubSection() {
  return (
    <section id="github" className="py-24 md:py-32 bg-card/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Open Source</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text font-heading">
            GitHub Showcase
          </h2>
        </motion.div>

        <div className="mt-10 max-w-4xl mx-auto">
          {/* Profile card */}
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            href="https://github.com/usmanashfaq1916"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border mb-6 hover:border-primary/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GitFork size={28} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-text flex items-center gap-2">
                usmanashfaq1916
                <ExternalLink size={14} className="text-muted" />
              </div>
              <p className="text-xs text-muted mt-0.5">github.com/usmanashfaq1916</p>
            </div>
          </motion.a>

          {/* Language distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="p-5 bg-card rounded-xl border border-border mb-6"
          >
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <BarChart3 size={14} /> Most Used Languages
            </h3>
            <div className="flex h-3 rounded-full overflow-hidden bg-surface">
              {languageStats.map((l) => (
                <div
                  key={l.lang}
                  className={`${l.color} transition-all`}
                  style={{ width: `${l.percentage}%` }}
                  title={`${l.lang}: ${l.percentage}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {languageStats.map((l) => (
                <div key={l.lang} className="flex items-center gap-1.5 text-xs text-muted">
                  <span className={`w-2.5 h-2.5 rounded-full ${l.color.replace('bg-', 'bg-')}`} />
                  {l.lang} ({l.percentage}%)
                </div>
              ))}
            </div>
          </motion.div>

          {/* Featured repos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {repos.map((repo) => (
              <a
                key={repo.name}
                href={`https://github.com/usmanashfaq1916/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-surface rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-muted" />
                  <span className="text-sm font-medium text-text truncate">{repo.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Code2 size={12} /> {repo.lang}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={12} /> {repo.forks}
                  </span>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
