import type { RefObject } from 'react'
import { SHRINES } from '../data/shrines.ts'

interface Props {
  nodes: RefObject<HTMLElement[]>
}

// Relic cutouts hung in CSS3D space; the engine positions and fogs them each frame.
export function Shrines({ nodes }: Props) {
  return (
    <>
      {SHRINES.map((s, i) => (
        <div
          key={i}
          className="shrine-3d"
          ref={(el) => {
            if (el) nodes.current[i] = el
          }}
        >
          <div className="shrine-light-pillar" aria-hidden="true" />
          <div className="shrine-cutout-plane">
            <img src={s.src} alt={s.alt} decoding="async" draggable={false} fetchPriority={i < 2 ? 'high' : 'low'} />
          </div>
        </div>
      ))}
    </>
  )
}
