'use client'

import { motion } from 'framer-motion'
import CountUp from './CountUp'

const stats = [
  { value: 6, suffix: '+', label: 'Analytics Projects Completed' },
  { value: 3, suffix: '+', label: 'Dashboards Created' },
  { value: 4, suffix: '+', label: 'Python Scripts Developed' },
  { value: 2, suffix: '+', label: 'Datasets Analyzed' },
]

export default function Statistics() {
  return (
    <section className="py-16 md:py-20 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-all"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-primary font-heading">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1.5 text-sm text-muted font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
