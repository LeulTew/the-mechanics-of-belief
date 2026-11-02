import React, { useEffect, useState } from 'react'

export const ArchitecturalGrid: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })

  useEffect(() => {
    let ticking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePos({ x: e.clientX, y: e.clientY })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Subtle Coordinate Grid Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />

      {/* Hardware-Accelerated Interactive Illumination Spot */}
      <div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 pointer-events-none transition-opacity duration-500 will-change-transform"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.05) 45%, transparent 70%)',
          display: mousePos.x < 0 ? 'none' : 'block'
        }}
      />
    </div>
  )
}
