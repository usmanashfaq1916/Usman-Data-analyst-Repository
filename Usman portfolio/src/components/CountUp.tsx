'use client'

import { useEffect, useRef, useState } from 'react'

export default function CountUp({ to, suffix = '', duration = 2000 }: { to: number; suffix?: string; duration?: number }) {
  const [mounted, setMounted] = useState(false)
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const el = ref.current
    if (!el || started.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            setCount(Math.floor(progress * to))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration, mounted])

  if (!mounted) {
    return <span>{to}{suffix}</span>
  }

  return <span ref={ref}>{count}{suffix}</span>
}
