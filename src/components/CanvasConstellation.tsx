import React, { useEffect, useRef } from 'react'

export const CanvasConstellation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Particle nodes
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 32 : 64
    const connectionDistance = isMobile ? 85 : 130

    interface Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      alpha: number
    }

    const nodes: Node[] = []
    for (let i = 0; i < particleCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.5 + 0.2
      })
    }

    let mouseX = -1000
    let mouseY = -1000

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX
        mouseY = e.touches[0].clientY
      }
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('resize', handleResize)

    let isDocumentVisible = true
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const render = () => {
      if (isDocumentVisible) {
        ctx.clearRect(0, 0, width, height)

        // Update & draw nodes
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]
          node.x += node.vx
          node.y += node.vy

          // Wrap edges
          if (node.x < 0) node.x = width
          else if (node.x > width) node.x = 0
          if (node.y < 0) node.y = height
          else if (node.y > height) node.y = 0

          // Gentle mouse pull
          const dx = mouseX - node.x
          const dy = mouseY - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 180) {
            const force = (1 - dist / 180) * 0.3
            node.x += (dx / dist) * force
            node.y += (dy / dist) * force
          }

          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(129, 140, 248, ${node.alpha * 0.7})`
          ctx.fill()

          // Connect nearby nodes
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j]
            const ndx = other.x - node.x
            const ndy = other.y - node.y
            const nDist = Math.sqrt(ndx * ndx + ndy * ndy)

            if (nDist < connectionDistance) {
              const alpha = (1 - nDist / connectionDistance) * 0.16
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`
              ctx.lineWidth = 0.75
              ctx.stroke()
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  )
}
