'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Calendar, Building, Award } from 'lucide-react'

type Cert = {
  id: string
  name: string
  org: string
  date: string
  verify_url: string
  display_order: number
}

function CertCard({ c, i }: { c: Cert; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className="p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group text-center"
    >
      <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
        <Award size={28} className="text-primary" />
      </div>
      <h3 className="mt-4 text-base font-bold text-text font-heading">{c.name}</h3>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
          <Building size={12} />
          <span>{c.org}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
          <Calendar size={12} />
          <span>{c.date}</span>
        </div>
      </div>
      {c.verify_url && (
        <a
          href={c.verify_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Verify <ExternalLink size={12} />
        </a>
      )}
    </motion.div>
  )
}

const defaultCerts: Cert[] = [
  {
    id: '1',
    name: 'IBM Data Analyst Professional Certificate',
    org: 'NAVTTC',
    date: '2026',
    verify_url: '',
    display_order: 1,
  },
]

export default function Certifications() {
  const [certs, setCerts] = useState<Cert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/certifications')
      .then((res) => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then((data) => {
        if (data && data.length > 0) {
          setCerts(data)
        } else {
          setCerts(defaultCerts)
        }
      })
      .catch(() => { setCerts(defaultCerts) })
      .finally(() => setLoading(false))
  }, [])

  if (error) {
    return (
      <section id="certifications" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-muted">Failed to load certifications.</p>
        </div>
      </section>
    )
  }

  if (loading && certs.length === 0) {
    return (
      <section id="certifications" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    )
  }

  return (
    <section id="certifications" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Credentials</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text font-heading">
            Certifications
          </h2>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {certs.map((c, i) => (
            <CertCard key={c.id} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
