import type { Ref } from 'react'
import { ACTS } from '../data/acts.ts'

interface Props {
  act: number
  progressRef: Ref<HTMLDivElement>
  onSelectAct: (act: number) => void
}

export function FilmTimeline({ act, progressRef, onSelectAct }: Props) {
  return (
    <nav id="film-timeline" aria-label="Chapters">
      <div className="timeline-ticks">
        {ACTS.map((a, i) => (
          <button
            key={i}
            type="button"
            className={`timeline-tick${i === act ? ' is-active' : ''}`}
            aria-current={i === act ? 'step' : undefined}
            aria-label={`Chapter ${i + 1}: ${a.short}`}
            onClick={() => onSelectAct(i)}
          >
            <span className="tick-geez" lang="am" aria-hidden="true">{a.geez}</span>
            <span className="tick-label" aria-hidden="true">{a.short}</span>
          </button>
        ))}
      </div>
      <div className="timeline-track" aria-hidden="true">
        <div id="timeline-progress" ref={progressRef} />
      </div>
    </nav>
  )
}
