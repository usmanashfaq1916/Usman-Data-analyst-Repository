'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Server, Database, BarChart3, Cpu } from 'lucide-react'

const topics = [
  { icon: Cpu, name: 'Advanced SQL', desc: 'Window functions, query optimization, CTEs' },
  { icon: TrendingUp, name: 'Machine Learning', desc: 'Scikit-learn, model deployment, ML pipelines' },
  { icon: Server, name: 'Streamlit', desc: 'Interactive data app development' },
  { icon: Database, name: 'Azure Data Fundamentals', desc: 'Cloud data solutions, Synapse, Data Lake' },
  { icon: BarChart3, name: 'Advanced Power BI', desc: 'DAX, Power Query, Row-Level Security' },
]

export default function Learning() {
  return (
    <section id="learning" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Growth</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text font-heading">
            Currently Learning
          </h2>
          <p className="mt-3 text-muted max-w-lg mx-auto">
            Always expanding my toolkit to deliver better data solutions.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {topics.map((t, i) => {
            const TopicIcon = t.icon
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 bg-card rounded-xl border border-border hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <TopicIcon size={24} className="text-accent" />
                </div>
                <h3 className="mt-4 text-base font-bold text-text font-heading">{t.name}</h3>
                <p className="mt-2 text-xs text-muted leading-relaxed">{t.desc}</p>
                <div className="mt-4 w-full h-1 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '60%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
