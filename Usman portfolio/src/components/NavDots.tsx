'use client'

import { useEffect, useState } from 'react'

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certs' },
  { id: 'contact', label: 'Contact' },
]

export default function NavDots() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const onScroll = () => {
      let current = 'hero'
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el) {
          const top = el.getBoundingClientRect().top
          if (top < 300) current = s.id
        }
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-[999] flex-col gap-3 hidden lg:flex">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          title={s.label}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            active === s.id
              ? 'bg-primary scale-125 shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              : 'bg-muted/30 hover:bg-muted/60'
          }`}
        />
      ))}
    </div>
  )
}
