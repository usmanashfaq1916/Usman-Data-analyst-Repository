'use client'

import { useEffect, useRef } from 'react'

const roles = [
  'Data Analyst for Startups & Remote Teams',
  'Python (Pandas, NumPy) Developer',
  'SQL & ETL Specialist',
  'Power BI & BI Consultant',
  'Data Storyteller',
]

export default function TypingEffect() {
  const elRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    let textIndex = 0
    let charIndex = 0
    let isDeleting = false
    let timeout: ReturnType<typeof setTimeout>

    function type() {
      if (!el) return
      const current = roles[textIndex]
      el.textContent = isDeleting
        ? current.substring(0, charIndex - 1)
        : current.substring(0, charIndex + 1)
      charIndex += isDeleting ? -1 : 1

      let speed = isDeleting ? 25 : 60
      if (!isDeleting && charIndex === current.length) {
        speed = 2000
        isDeleting = true
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % roles.length
        speed = 400
      }
      timeout = setTimeout(type, speed)
    }

    timeout = setTimeout(type, 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <span className="text-muted">
      <span ref={elRef} />
      <span className="inline-block w-[2px] h-[1.2em] bg-primary ml-0.5 align-text-bottom animate-pulse" />
    </span>
  )
}
