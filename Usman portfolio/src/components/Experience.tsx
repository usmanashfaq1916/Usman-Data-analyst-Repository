'use client'

import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'

export default function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Career</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text font-heading">
            Experience
          </h2>
        </motion.div>

        <div className="mt-14 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative pl-10 border-l-2 border-primary/30"
          >
            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-white" />
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase size={22} className="text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-text font-heading">
                    Data Analyst
                  </h3>
                  <p className="text-sm text-primary font-medium">Xynova.ai</p>
                </div>
              </div>
              <p className="text-xs text-muted">January 2025 &ndash; Present &middot; 1 yr 7 mos &middot; Lahore</p>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Data Expert specializing in business intelligence, data pipelining, and predictive
                analysis. Translates raw data into high-impact visual narratives to support scalable,
                cutting-edge IT and AI solutions.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
