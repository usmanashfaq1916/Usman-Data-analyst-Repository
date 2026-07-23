'use client'

import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let time = 0
    let mouseX = 0
    let mouseY = 0
    let rafId = 0

    const energyWaves: { x: number; y: number; radius: number; maxRadius: number; life: number; speed: number }[] = []

    class GridNode {
      x: number
      y: number
      z: number
      baseGlow: number
      pulseOffset: number
      constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
        this.baseGlow = Math.random() * 0.3 + 0.1
        this.pulseOffset = Math.random() * Math.PI * 2
      }
    }

    const gridNodes: GridNode[] = []
    const GRID_SIZE = 28
    const GRID_DEPTH = 20
    const SPACING = 35

    for (let z = -GRID_DEPTH; z <= 0; z++) {
      for (let x = -GRID_SIZE; x <= GRID_SIZE; x++) {
        gridNodes.push(new GridNode(x, 0, z))
      }
    }

    function project3D(x: number, y: number, z: number) {
      const focal = 350
      const perspective = focal / (focal + z)
      return {
        x: width / 2 + x * SPACING * perspective + (mouseX - width / 2) * 0.04 * perspective,
        y: height / 2 + y * SPACING * perspective * 0.6 - z * SPACING * 0.3 * perspective,
        scale: perspective,
      }
    }

    const horizonStars: { x: number; y: number; size: number; opacity: number; twinkle: number }[] = []
    for (let i = 0; i < 120; i++) {
      horizonStars.push({
        x: Math.random() * 2000,
        y: Math.random() * 1200 * 0.6,
        size: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.3 + 0.05,
        twinkle: Math.random() * Math.PI * 2,
      })
    }

    function resize() {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', onMouse)

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        energyWaves.push({
          x: e.clientX,
          y: e.clientY,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.4,
          life: 1,
          speed: 2 + Math.random() * 1.5,
        })
      }
    }
    canvas.addEventListener('click', onClick)

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      const bgGrad = ctx.createRadialGradient(width / 2, height * 0.3, 0, width / 2, height * 0.3, Math.max(width, height) * 0.7)
      bgGrad.addColorStop(0, 'rgba(37, 99, 235, 0.04)')
      bgGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.015)')
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      horizonStars.forEach((s) => {
        s.twinkle += 0.015
        const pulse = s.opacity * (0.4 + 0.6 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x % width, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(148, 163, 184, ${pulse})`
        ctx.fill()
      })

      const gridAlpha = 0.12
      for (let z = -GRID_DEPTH; z <= 0; z++) {
        const zWobble = Math.sin(z * 0.3 + time * 0.02) * 3
        for (let x = -GRID_SIZE; x < GRID_SIZE; x++) {
          const p1 = project3D(x, zWobble, z)
          const p2 = project3D(x + 1, zWobble, z)
          if (p1.scale > 0.02) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            const a = p1.scale * gridAlpha * (1 + z / GRID_DEPTH)
            ctx.strokeStyle = `rgba(16, 185, 129, ${a})`
            ctx.lineWidth = p1.scale * 0.5
            ctx.stroke()
          }
        }
      }

      for (let x = -GRID_SIZE; x <= GRID_SIZE; x++) {
        const xWobble = Math.sin(x * 0.3 + time * 0.025) * 2
        let prevP: { x: number; y: number; scale: number } | null = null
        for (let z = -GRID_DEPTH; z <= 0; z++) {
          const zWobble = Math.sin(z * 0.3 + time * 0.02) * 3
          const p = project3D(x + xWobble, zWobble, z)
          if (prevP && p.scale > 0.02) {
            ctx.beginPath()
            ctx.moveTo(prevP.x, prevP.y)
            ctx.lineTo(p.x, p.y)
            const a = p.scale * gridAlpha * (1 + z / GRID_DEPTH)
            ctx.strokeStyle = `rgba(37, 99, 235, ${a})`
            ctx.lineWidth = p.scale * 0.5
            ctx.stroke()
          }
          prevP = p
        }
      }

      gridNodes.forEach((node) => {
        const wobble = Math.sin(node.x * 0.3 + time * 0.02) * 3
        const zWobble = Math.sin(node.z * 0.3 + time * 0.02) * 3
        const p = project3D(node.x, wobble, node.z)
        if (p.scale < 0.02) return

        const glow = node.baseGlow + Math.sin(time * 0.03 + node.pulseOffset) * 0.1
        const alpha = Math.max(0, glow * p.scale * 0.8 * (1 + node.z / GRID_DEPTH))
        const dist = Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2)
        const mouseGlow = Math.max(0, (1 - dist / 200)) * 0.4
        const total = alpha + mouseGlow

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.scale * (1.5 + mouseGlow * 3), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(16, 185, 129, ${total})`
        ctx.fill()

        if (total > 0.1) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.scale * (4 + mouseGlow * 8), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(37, 99, 235, ${total * 0.12})`
          ctx.fill()
        }
      })

      for (let i = energyWaves.length - 1; i >= 0; i--) {
        const w = energyWaves[i]
        w.radius += w.speed
        w.life -= 0.008
        if (w.life <= 0) {
          energyWaves.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(16, 185, 129, ${w.life * 0.4})`
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(w.x, w.y, w.radius * 0.7, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(37, 99, 235, ${w.life * 0.2})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      const trail = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120)
      trail.addColorStop(0, 'rgba(37, 99, 235, 0.08)')
      trail.addColorStop(0.5, 'rgba(16, 185, 129, 0.03)')
      trail.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = trail
      ctx.fillRect(0, 0, width, height)

      time += 1
      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
}
