'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[1001] pointer-events-none transition-[width] duration-100 ease-linear"
      style={{
        width: `${width}%`,
        background: 'linear-gradient(90deg, #2563EB, #10B981)',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
      }}
    />
  )
}
