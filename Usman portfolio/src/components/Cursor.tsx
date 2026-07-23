'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const cursorX = useRef(-100)
  const cursorY = useRef(-100)
  const ringX = useRef(-100)
  const ringY = useRef(-100)
  const raf = useRef<number>(0)

  const animate = useCallback(() => {
    ringX.current += (cursorX.current - ringX.current) * 0.15
    ringY.current += (cursorY.current - ringY.current) * 0.15
    if (ringRef.current) {
      ringRef.current.style.left = `${ringX.current}px`
      ringRef.current.style.top = `${ringY.current}px`
    }
    raf.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMouse = (e: MouseEvent) => {
      cursorX.current = e.clientX
      cursorY.current = e.clientY
      dot.style.left = `${e.clientX}px`
      dot.style.top = `${e.clientY}px`
    }

    const onHover = (el: Element) => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('scale-150', 'bg-accent')
        ring.classList.add('w-12', 'h-12', 'border-accent/50')
      })
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('scale-150', 'bg-accent')
        ring.classList.remove('w-12', 'h-12', 'border-accent/50')
      })
    }

    document.addEventListener('mousemove', onMouse)
    raf.current = requestAnimationFrame(animate)
    document.querySelectorAll('a, button, input, textarea, [role="button"]').forEach(onHover)

    return () => {
      document.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(raf.current)
    }
  }, [animate])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed w-2 h-2 rounded-full bg-secondary pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-200 shadow-[0_0_12px_rgba(6,182,212,0.5)] hidden md:block"
        style={{ boxShadow: '0 0 12px rgba(6,182,212,0.5), 0 0 30px rgba(6,182,212,0.2)' }}
      />
      <div
        ref={ringRef}
        className="fixed w-8 h-8 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 border border-secondary/30 hidden md:block"
        style={{ boxShadow: '0 0 20px rgba(99,102,241,0.1)' }}
      />
    </>
  )
}
