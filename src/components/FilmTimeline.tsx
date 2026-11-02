import React, { useRef } from 'react'
import { ACTS } from '../data/actsData.ts'

interface FilmTimelineProps {
  progress: number
  activeActIndex: number
  onSelectAct: (actIdx: number) => void
}

const ACT_LABELS = [
  'Doorway',
  'Practices',
  'Sanctuary',
  'Mirrors',
  'Tewahedo',
  'Senses',
  'Traps',
  'Synthesis'
]

export const FilmTimeline: React.FC<FilmTimelineProps> = ({
  progress,
  activeActIndex,
  onSelectAct
}) => {
  const tickRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: React.KeyboardEvent, currentIdx: number) => {
    let nextIdx = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIdx = (currentIdx + 1) % ACTS.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIdx = (currentIdx - 1 + ACTS.length) % ACTS.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIdx = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIdx = ACTS.length - 1
    }

    if (nextIdx !== -1) {
      onSelectAct(nextIdx)
      tickRefs.current[nextIdx]?.focus()
    }
  }

  return (
    <nav id="film-timeline" aria-label="Monograph Chapters">
      <div className="timeline-ticks" role="tablist">
        {ACTS.map((act, idx) => {
          const isActive = idx === activeActIndex
          return (
            <button
              key={idx}
              ref={(el) => { tickRefs.current[idx] = el }}
              type="button"
              className={`timeline-tick ${isActive ? 'is-active' : ''}`}
              data-act={idx}
              role="tab"
              aria-selected={isActive}
              aria-label={`Act ${act.geez}: ${ACT_LABELS[idx] || act.name}`}
              onClick={() => onSelectAct(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              <span className="tick-geez">{act.geez}</span>
              <span className="tick-label">{ACT_LABELS[idx] || act.name}</span>
            </button>
          )
        })}
      </div>
      <div className="timeline-track">
        <div
          id="timeline-progress"
          style={{ transform: `scaleX(${Math.max(0.02, Math.min(1, progress))})` }}
        />
      </div>
    </nav>
  )
}
