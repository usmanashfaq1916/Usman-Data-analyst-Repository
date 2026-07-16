'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Shield } from 'lucide-react'
import { GitHubIcon, LinkedInIcon, EmailIcon, WhatsAppIcon } from './OfficialIcons'
const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact', label: 'Contact' },
]

const socials = [
  { icon: GitHubIcon, href: 'https://github.com/usmanashfaq1916' },
  { icon: LinkedInIcon, href: 'https://www.linkedin.com/in/usman-ashfaq-5329912a2/' },
  { icon: EmailIcon, href: 'mailto:usman.ashfaq1916@gmail.com' },
  { icon: WhatsAppIcon, href: 'https://wa.me/9203244776493' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => r.json())
      .then(data => setIsAdmin(data.authenticated))
      .catch(() => setIsAdmin(false))
  }, [])

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-lg font-bold text-primary font-heading">
          Usman Ashfaq
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {isAdmin && (
            <>
              <div className="h-5 w-px bg-border" />
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Shield size={14} />
                Admin
              </a>
            </>
          )}
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-3">
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-primary transition-colors"
                  aria-label={s.href}
                >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>
        </div>

        <button
          className="md:hidden text-text"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-b border-border">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm font-medium text-muted hover:text-primary border-b border-border"
            >
              {l.label}
            </a>
          ))}
          {isAdmin && (
            <a
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary border-b border-border"
            >
              <Shield size={16} />
              Admin Panel
            </a>
          )}
          <div className="flex items-center gap-4 px-6 py-4">
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-primary transition-colors"
                >
                  <Icon size={20} />
                </a>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
