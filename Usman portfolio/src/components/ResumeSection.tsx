'use client'

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'

export default function ResumeSection() {
  return (
    <section id="resume" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <FileText size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text font-heading">
            Download My Resume
          </h2>
          <p className="mt-3 text-muted">
            Get a complete overview of my experience, skills, projects, and certifications.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8"
          >
            <a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
            >
              <Download size={20} />
              Download Resume (PDF)
            </a>
          </motion.div>
          <p className="mt-4 text-xs text-muted">
            File: Usman_Ashfaq_Data_Analyst_Resume.pdf
          </p>
        </motion.div>
      </div>
    </section>
  )
}
