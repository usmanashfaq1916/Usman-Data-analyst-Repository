'use client'

import { ArrowUp, ExternalLink } from 'lucide-react'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top row: nav + social */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border">
          <div className="text-center md:text-left">
            <a href="#" className="text-lg font-bold text-primary font-heading">Usman Ashfaq</a>
            <p className="text-xs text-muted mt-1">Data Analyst for Startups &amp; Remote Teams | SQL &bull; ETL &bull; Business Intelligence</p>
          </div>

          <nav className="flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-medium text-muted hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

        </div>

        {/* Bottom row: credits */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-muted">
            &copy; 2026 Usman Ashfaq
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              Built with <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">Next.js <ExternalLink size={10} /></a>
            </span>
            <span className="hidden md:inline text-muted/40">|</span>
            <span className="flex items-center gap-1">
              Hosted on <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">Vercel <ExternalLink size={10} /></a>
            </span>
          </div>
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-all"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  )
}
