import React, { useEffect, useRef } from 'react'
import { animate } from 'animejs'

interface SacredGeometryStageProps {
  activeActIndex: number
  progress: number
}

export const SacredGeometryStage: React.FC<SacredGeometryStageProps> = ({
  activeActIndex,
  progress
}) => {
  const outerWheelRef = useRef<SVGGElement | null>(null)
  const rosetteRef = useRef<SVGPathElement | null>(null)

  // Generate rosette path dynamically based on lobes and progress
  const lobes = 8 + (activeActIndex % 4) * 2
  const baseR = 120
  const amp = 24 + Math.sin(progress * Math.PI * 4) * 12

  let pathD = ''
  const steps = 120
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const r = baseR + Math.cos(theta * lobes) * amp
    const x = Math.cos(theta) * r
    const y = Math.sin(theta) * r
    pathD += (i === 0 ? 'M ' : 'L ') + x.toFixed(2) + ' ' + y.toFixed(2) + ' '
  }
  pathD += 'Z'

  // Animate outer wheel rotation with Anime.js
  useEffect(() => {
    if (!outerWheelRef.current) return
    const anim = animate(outerWheelRef.current, {
      rotate: [0, 360],
      duration: 45000,
      loop: true,
      ease: 'linear'
    })
    return () => {
      anim?.pause?.()
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] flex items-center justify-center overflow-hidden">
      <svg
        id="semantic-svg-stage"
        viewBox="-260 -260 520 520"
        fill="none"
        aria-hidden="true"
        className="w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] max-w-full opacity-60 transition-opacity duration-500"
      >
        {/* Outer Aksumite Wheel */}
        <g ref={outerWheelRef} id="svg-outer-wheel" opacity="0.48">
          <circle r="242" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 6" />
          <circle r="226" stroke="rgba(226, 198, 150, 0.44)" strokeWidth="1.05" />
          <path
            d="M0 -248 V-214 M0 214 V248 M-248 0 H-214 M214 0 H248"
            stroke="rgba(216, 184, 136, 0.42)"
            strokeWidth="1.8"
          />
        </g>

        {/* Dynamic Ethiopian Rosette Cross Knot */}
        <path
          ref={rosetteRef}
          d={pathD}
          stroke="rgba(216, 184, 136, 0.55)"
          strokeWidth="1.4"
          fill="rgba(217, 164, 65, 0.04)"
          className="transition-all duration-300"
        />

        {/* Act-specific Sacred Symbols */}
        {activeActIndex === 0 && (
          <g className="transition-opacity duration-500">
            <rect
              x="-155"
              y="-155"
              width="310"
              height="310"
              stroke="rgba(226, 198, 150, 0.44)"
              strokeWidth="1.1"
              strokeDasharray="6 6"
              opacity="0.55"
            />
            <circle
              r="196"
              stroke="rgba(245, 240, 230, 0.32)"
              strokeWidth="1.5"
              strokeDasharray="10 5"
            />
          </g>
        )}

        {activeActIndex === 1 && (
          <g className="transition-opacity duration-500">
            <circle r="142" stroke="rgba(216, 184, 136, 0.42)" strokeWidth="1.2" />
            <circle
              r="178"
              stroke="rgba(226, 198, 150, 0.44)"
              strokeWidth="1.2"
              strokeDasharray="12 6"
            />
            <circle r="208" stroke="rgba(245, 240, 230, 0.32)" strokeWidth="1.3" />
          </g>
        )}

        {activeActIndex === 2 && (
          <g className="transition-opacity duration-500">
            <circle r="162" stroke="rgba(226, 198, 150, 0.44)" strokeWidth="1.6" />
            <path
              d="M0 -208 L28 -28 L208 0 L28 28 L0 208 L-28 28 L-208 0 L-28 -28 Z"
              stroke="rgba(226, 198, 150, 0.44)"
              strokeWidth="1.1"
              fill="rgba(217, 164, 65, 0.05)"
            />
          </g>
        )}

        {activeActIndex >= 3 && (
          <g className="transition-opacity duration-500">
            <circle
              r="208"
              stroke="rgba(245, 240, 230, 0.32)"
              strokeWidth="1.3"
              strokeDasharray="4 8"
            />
            <circle r="128" stroke="rgba(226, 198, 150, 0.44)" strokeWidth="1.1" />
            <path
              d="M-120 0 H120 M0 -120 V120"
              stroke="rgba(216, 184, 136, 0.38)"
              strokeWidth="1.2"
            />
          </g>
        )}
      </svg>
    </div>
  )
}
