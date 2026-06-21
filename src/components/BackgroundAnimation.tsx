import { useEffect, useRef } from 'react'

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0
    let h = 0

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      r: number
      opacity: number
      pulse: number
      pulseSpeed: number
    }

    const particles: Particle[] = []
    const PARTICLE_COUNT = 50
    const CONNECTION_DIST = 140
    const MOUSE_RADIUS = 180

    let mouseX = -9999
    let mouseY = -9999

    const createParticle = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    })

    const resize = () => {
      const prevW = w
      const prevH = h
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight

      if (prevW === 0 && prevH === 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push(createParticle())
        }
      } else {
        const scaleX = w / (prevW || 1)
        const scaleY = h / (prevH || 1)
        for (const p of particles) {
          p.x = Math.min(p.x * scaleX, w)
          p.y = Math.min(p.y * scaleY, h)
        }
      }
    }

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleMouseLeave = () => {
      mouseX = -9999
      mouseY = -9999
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.pulse += p.pulseSpeed
        const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.15

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distToMouse = Math.sqrt(dx * dx + dy * dy)
        if (distToMouse < MOUSE_RADIUS) {
          const force = (1 - distToMouse / MOUSE_RADIUS) * 0.02
          p.vx -= dx * force * 0.01
          p.vy -= dy * force * 0.01
        }

        p.vx *= 0.999
        p.vy *= 0.999

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34, 211, 238, ${pulseOpacity})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const cx = p.x - p2.x
          const cy = p.y - p2.y
          const dist = Math.sqrt(cx * cx + cy * cy)

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        if (distToMouse < MOUSE_RADIUS) {
          const alpha = (1 - distToMouse / MOUSE_RADIUS) * 0.25
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouseX, mouseY)
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
